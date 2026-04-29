<?php

namespace App\Repositories;

use App\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class OrderRepository extends EloquentRepository implements OrderRepositoryInterface
{
    protected $order;

    public function getByProject($projectId)
    {
        return $this->data->with(['status', 'project', 'contract', 'ordersheets'])
            ->where('project_id', $projectId)->get();
    }

    public function getByContract($contractId)
    {
        return $this->data->with(['status', 'project', 'contract', 'ordersheets'])
            ->where('contract_id', $contractId)->get();
    }

    public function find($id)
    {
        return $this->data->with(['status', 'project', 'contract', 'ordersheets'])->find($id);
    }

    public function create($data)
    {
        $order = $this->data->create($data);
        
        if (isset($data['order_items']) && is_array($data['order_items'])) {
            foreach ($data['order_items'] as $item) {
                // Ensure link to parent order
                $item['order_id'] = $order->id;
                $item['order_number'] = $order->order_number;
                $item['order_dt'] = $order->order_dt;
                $item['project_id'] = $order->project_id;
                $item['contract_id'] = $order->contract_id;
                
                $order->ordersheets()->create($item);
            }
        }

        return $order->fresh(['status', 'project', 'contract', 'ordersheets']);
    }

    public function update($id, $data)
    {
        return \DB::transaction(function () use ($id, $data) {
            $order = $this->find($id);
            if ($order) {
                $order->update($data);
                
                if (isset($data['order_items']) && is_array($data['order_items'])) {
                    // Pre-load existing items to avoid N queries in the loop
                    $inputItems = $data['order_items'];
                    $inputIds = collect($inputItems)->pluck('id')->filter()->toArray();
                    $existingItems = $order->ordersheets()->whereIn('id', $inputIds)->get()->keyBy('id');

                    $itemIdsToKeep = [];
                    foreach ($inputItems as $item) {
                        // Sync header fields
                        $item['order_id'] = $order->id;
                        $item['order_number'] = $order->order_number;
                        $item['order_dt'] = $order->order_dt;
                        $item['project_id'] = $order->project_id;
                        $item['contract_id'] = $order->contract_id;

                        if (isset($item['id']) && isset($existingItems[$item['id']])) {
                            // Update existing item
                            $existingItems[$item['id']]->update($item);
                            $itemIdsToKeep[] = $item['id'];
                        } else {
                            // Create new item
                            $newItem = $order->ordersheets()->create($item);
                            $itemIdsToKeep[] = $newItem->id;
                        }
                    }

                    // Delete items that are no longer present in the request
                    $order->ordersheets()->whereNotIn('id', $itemIdsToKeep)->delete();
                }
                return $order->fresh(['status', 'project', 'contract', 'ordersheets']);
            }
            return null;
        });
    }
    public function getAllPaginated($params)
    {
        $query = $this->data->newQuery()->with(['status', 'project', 'contract', 'ordersheets']);

        // Search Logic
        if (!empty($params['search_query'])) {
            $search = '%' . $params['search_query'] . '%';
            $column = !empty($params['search_column']) ? $params['search_column'] : '';

            $allowedColumns = ['order_number', 'order_description'];
            
            if (in_array($column, $allowedColumns)) {
                 $query->where($column, 'like', $search);
            } elseif ($column == 'project_number') {
                $query->whereHas('project', function($q) use ($search) {
                    $q->where('project_number', 'like', $search);
                });
            } elseif ($column == 'project_name') {
                $query->whereHas('project', function($q) use ($search) {
                    $q->where('project_name', 'like', $search);
                });
            } elseif ($column == 'contract_number') {
                $query->whereHas('contract', function($q) use ($search) {
                    $q->where('contract_number', 'like', $search);
                });
            } elseif ($column == 'contract_name') {
                $query->whereHas('contract', function($q) use ($search) {
                    $q->where('contract_name', 'like', $search);
                });
            } else {
                 $query->where(function($q) use ($search) {
                     $q->where('order_description', 'like', $search)
                       ->orWhere('order_number', 'like', $search)
                       ->orWhereHas('project', function($q) use ($search) {
                           $q->where('project_number', 'like', $search)
                             ->orWhere('project_name', 'like', $search);
                       })
                       ->orWhereHas('contract', function($q) use ($search) {
                           $q->where('contract_number', 'like', $search)
                             ->orWhere('contract_name', 'like', $search);
                       });
                 });
            }
        }

        // Sort Logic
        $sortBy = !empty($params['sort_by']) ? $params['sort_by'] : 'id';
        $sortOrder = !empty($params['sort_order']) ? $params['sort_order'] : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination Logic
        $perPage = !empty($params['per_page']) ? $params['per_page'] : 10;
        return $query->paginate($perPage);
    }

    /**
     * Update or create ordersheets for an expense.
     * Follows the business logic for expense items.
     */
    public function updateOrdersheetsForExpense($expense, $items)
    {
        return \DB::transaction(function () use ($expense, $items) {
            $currentExpenseId = $expense->id;
            $inputIds = collect($items)->pluck('id')->filter()->toArray();
            
            // 1. Handle unlinking items that are no longer in the request
            // These are items currently linked to this expense but not present in the items array
            $expense->ordersheets()
                ->whereNotIn('id', $inputIds)
                ->update([
                    'expenses_id' => null,
                    'sheet_refftypeid' => null,
                    'sheet_reffno' => null
                ]);

            $processedIds = [];
            foreach ($items as $item) {
                if (isset($item['id'])) {
                    // Scenario (b): Update existing order item
                    $ordersheet = \App\Ordersheet::find($item['id']);
                    if ($ordersheet) {
                        // Condition: empty/null expenses_id OR matching current expense
                        if (empty($ordersheet->expenses_id) || $ordersheet->expenses_id == $currentExpenseId) {
                            $ordersheet->update([
                                'expenses_id' => $currentExpenseId,
                                'sheet_refftypeid' => $item['sheet_refftypeid'] ?? $ordersheet->sheet_refftypeid,
                                'sheet_reffno' => $item['sheet_reffno'] ?? $ordersheet->sheet_reffno,
                                // Also update other fields if they are in the input
                                'sheet_name' => $item['sheet_name'] ?? $ordersheet->sheet_name,
                                'sheet_qty' => $item['sheet_qty'] ?? $ordersheet->sheet_qty,
                                'sheet_price' => $item['sheet_price'] ?? $ordersheet->sheet_price,
                                'sheet_netamt' => $item['sheet_netamt'] ?? $ordersheet->sheet_netamt,
                            ]);
                            $processedIds[] = $ordersheet->id;
                        }
                    }
                } else {
                    // Scenario (c): Create new expense item without using existing order item
                    // Ensure link to parent expense and relevant order/project info
                    $item['expenses_id'] = $currentExpenseId;
                    $item['project_id'] = $expense->project_id;
                    $item['contract_id'] = $expense->contract_id;
                    $item['order_id'] = $expense->order_id;
                    
                    // Fill order number/dt from the parent order if available
                    if ($expense->order) {
                        $item['order_number'] = $expense->order->order_number;
                        $item['order_dt'] = $expense->order->order_dt;
                    }

                    $newItem = \App\Ordersheet::create($item);
                    $processedIds[] = $newItem->id;
                }
            }
            
            return $processedIds;
        });
    }
}
