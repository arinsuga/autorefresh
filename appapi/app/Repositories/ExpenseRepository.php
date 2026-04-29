<?php

namespace App\Repositories;

use App\Expense;
use App\Repositories\Contracts\ExpenseRepositoryInterface;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class ExpenseRepository extends EloquentRepository implements ExpenseRepositoryInterface
{
    protected $orderRepo;

    public function __construct(Expense $model, OrderRepositoryInterface $orderRepo)
    {
        parent::__construct($model);
        $this->orderRepo = $orderRepo;
    }

    public function getByProject($projectId)
    {
        return $this->data->with(['status', 'project', 'contract', 'order', 'ordersheets', 'refftype'])
            ->where('project_id', $projectId)->get();
    }

    public function getByContract($contractId)
    {
        return $this->data->with(['status', 'project', 'contract', 'order', 'ordersheets', 'refftype'])
            ->where('contract_id', $contractId)->get();
    }

    public function find($id)
    {
        return $this->data->with(['status', 'project', 'contract', 'order', 'ordersheets', 'refftype'])->find($id);
    }

    public function create($data)
    {
        return \DB::transaction(function () use ($data) {
            $expense = $this->data->create($data);
            
            if (isset($data['expense_items']) && is_array($data['expense_items'])) {
                $this->orderRepo->updateOrdersheetsForExpense($expense, $data['expense_items']);
            }

            return $expense->fresh(['status', 'project', 'contract', 'order', 'ordersheets', 'refftype']);
        });
    }

    public function update($id, $data)
    {
        return \DB::transaction(function () use ($id, $data) {
            $expense = $this->find($id);
            if ($expense) {
                $expense->update($data);
                
                if (isset($data['expense_items']) && is_array($data['expense_items'])) {
                    $this->orderRepo->updateOrdersheetsForExpense($expense, $data['expense_items']);
                }
                
                return $expense->fresh(['status', 'project', 'contract', 'order', 'ordersheets', 'refftype']);
            }
            return null;
        });
    }

    public function getAllPaginated($params)
    {
        $query = $this->data->newQuery()->with(['status', 'project', 'contract', 'order', 'ordersheets', 'refftype']);

        // Search Logic
        if (!empty($params['search_query'])) {
            $search = '%' . $params['search_query'] . '%';
            $column = !empty($params['search_column']) ? $params['search_column'] : '';

            $allowedColumns = ['expense_number', 'expense_description'];
            
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
            } elseif ($column == 'order_number') {
                $query->whereHas('order', function($q) use ($search) {
                    $q->where('order_number', 'like', $search);
                });
            } else {
                 $query->where(function($q) use ($search) {
                     $q->where('expense_description', 'like', $search)
                       ->orWhere('expense_number', 'like', $search)
                       ->orWhereHas('project', function($q) use ($search) {
                           $q->where('project_number', 'like', $search)
                             ->orWhere('project_name', 'like', $search);
                       })
                       ->orWhereHas('order', function($q) use ($search) {
                           $q->where('order_number', 'like', $search);
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
}
