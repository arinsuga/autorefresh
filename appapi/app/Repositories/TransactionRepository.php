<?php

namespace App\Repositories;

use App\Transaction;
use App\Repositories\Contracts\TransactionRepositoryInterface;
use App\Repositories\Data\EloquentRepository;
use Illuminate\Support\Facades\DB;
use Arins\Facades\Filex;
use Intervention\Image\Facades\Image;

class TransactionRepository extends EloquentRepository implements TransactionRepositoryInterface
{
    /**
     * Eager-load relationships for transaction detail view.
     */
    public function find($id)
    {
        return $this->data
            ->with(['branch', 'vehicleType', 'paymentMethod', 'transactionServices.serviceType'])
            ->find($id);
    }

    /**
     * Find the latest transaction by plate number for customer lookup.
     */
    public function findByPlateNumber($plateNumber)
    {
        return $this->data
            ->where('plate_number', $plateNumber)
            ->orderByDesc('transaction_dt')
            ->first(['plate_number', 'customer_name', 'customer_phone']);
    }

    /**
     * Create transaction with nested transaction_services.
     * Auto-generates transaction_number in format TRX-{YYYYMMDD}-{5 digit sequence}.
     */
    public function create($data)
    {
        return \DB::transaction(function () use ($data) {
            // Auto-generate transaction number
            $date    = now()->format('Ymd');
            $prefix  = "TRX-{$date}-";
            $last    = \App\Transaction::where('transaction_number', 'like', "{$prefix}%")
                ->orderByDesc('transaction_number')
                ->first();

            $seq  = $last ? (int) substr($last->transaction_number, -5) + 1 : 1;
            $data['transaction_number'] = $prefix . str_pad($seq, 5, '0', STR_PAD_LEFT);

            $services = $data['services'] ?? [];
            unset($data['services']);

            $transaction = $this->data->create($data);

            foreach ($services as $service) {
                $transaction->transactionServices()->create([
                    'service_type_id' => $service['service_type_id'],
                    'service_price'   => $service['service_price'],
                ]);
            }

            // Handle image upload and compression
            if (isset($data['upload']) && $data['upload'] instanceof \Illuminate\Http\UploadedFile) {
                $file = $data['upload'];
                $uploadDirectory = 'autorefresh';
                
                // 1. Save original file using Filex helper
                $path = Filex::upload(null, $uploadDirectory, $file, 'public', 'transaction');
                
                // 2. Compress image if needed (target < 1MB)
                if ($path) {
                    $fullPath = storage_path('app/public/' . $path);
                    
                    // Only compress if file exists and is an image
                    if (file_exists($fullPath)) {
                        $img = Image::make($fullPath);
                        
                        // Check size (1MB = 1048576 bytes)
                        if (filesize($fullPath) > 1048576) {
                            // Resize if too large (optional but helpful for speed)
                            if ($img->width() > 1600) {
                                $img->resize(1600, null, function ($constraint) {
                                    $constraint->aspectRatio();
                                    $constraint->upsize();
                                });
                            }
                            
                            // Save with lower quality until size is < 1MB
                            $quality = 85;
                            $img->save($fullPath, $quality);
                            
                            while (filesize($fullPath) > 1048576 && $quality > 10) {
                                $quality -= 10;
                                $img->save($fullPath, $quality);
                            }
                        }
                        
                        // 3. Update transaction with the photo path
                        $transaction->transaction_photo = $path;
                        $transaction->save();
                    }
                }
            }

            return $transaction->fresh(['branch', 'vehicleType', 'paymentMethod', 'transactionServices.serviceType']);
        });
    }

    /**
     * Update transaction header and sync services.
     */
    public function update($id, $data)
    {
        return \DB::transaction(function () use ($id, $data) {
            $transaction = $this->find($id);

            if (!$transaction) {
                return null;
            }

            $services = $data['services'] ?? null;
            unset($data['services']);

            // Handle image upload and compression
            if (isset($data['upload']) && $data['upload'] instanceof \Illuminate\Http\UploadedFile) {
                $file = $data['upload'];
                $uploadDirectory = 'autorefresh';
                
                // 1. Save new file using Filex helper
                $path = Filex::upload(null, $uploadDirectory, $file, 'public', 'transaction');
                
                if ($path) {
                    $fullPath = storage_path('app/public/' . $path);
                    
                    if (file_exists($fullPath)) {
                        $img = Image::make($fullPath);
                        
                        // Compress if > 1MB
                        if (filesize($fullPath) > 1048576) {
                            if ($img->width() > 1600) {
                                $img->resize(1600, null, function ($constraint) {
                                    $constraint->aspectRatio();
                                    $constraint->upsize();
                                });
                            }
                            
                            $quality = 85;
                            $img->save($fullPath, $quality);
                            while (filesize($fullPath) > 1048576 && $quality > 10) {
                                $quality -= 10;
                                $img->save($fullPath, $quality);
                            }
                        }
                        
                        // 2. Delete old photo if exists
                        if ($transaction->transaction_photo) {
                            Filex::delete($transaction->transaction_photo, 'public');
                        }

                        // 3. Set new photo path
                        $data['transaction_photo'] = $path;
                    }
                }
            }

            $transaction->update($data);

            if (is_array($services)) {
                // Delete existing services and recreate
                $transaction->transactionServices()->delete();

                foreach ($services as $service) {
                    $transaction->transactionServices()->create([
                        'service_type_id' => $service['service_type_id'],
                        'service_price'   => $service['service_price'],
                    ]);
                }
            }

            return $transaction->fresh(['branch', 'vehicleType', 'paymentMethod', 'transactionServices.serviceType']);
        });
    }

    /**
     * Get all transactions in a specific branch.
     */
    public function getByBranch($branchId)
    {
        return $this->data
            ->with(['branch', 'vehicleType', 'paymentMethod', 'transactionServices.serviceType'])
            ->where('branch_id', $branchId)
            ->orderByDesc('transaction_dt')
            ->get();
    }

    /**
     * Paginated list with search and filter.
     */
    public function getAllPaginated($params)
    {
        $query = $this->data->newQuery()
            ->with(['branch', 'vehicleType', 'paymentMethod', 'transactionServices.serviceType']);

        $this->applyCommonFilters($query, $params);

        $sortBy    = !empty($params['sort_by']) ? $params['sort_by'] : 'transaction_dt';
        $sortOrder = !empty($params['sort_order']) ? $params['sort_order'] : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = !empty($params['per_page']) ? $params['per_page'] : 15;
        return $query->paginate($perPage);
    }

    /**
     * Detailed transaction report with filters.
     */
    public function getReportDetail($params)
    {
        $query = $this->data->newQuery()
            ->with(['branch', 'vehicleType', 'paymentMethod', 'transactionServices.serviceType']);

        $this->applyCommonFilters($query, $params);

        $query->orderBy('transaction_dt', 'asc');

        return $query->get();
    }

    /**
     * Summary report grouped by branch/payment/service/date.
     */
    public function getReportSummary($params)
    {
        $query = DB::table('transactions as t')
            ->join('branches as b', 't.branch_id', '=', 'b.id')
            ->join('vehicle_types as vt', 't.vehicle_type_id', '=', 'vt.id')
            ->join('payment_methods as pm', 't.payment_method_id', '=', 'pm.id')
            ->select(
                'b.id as branch_id',
                'b.branch_name',
                'vt.id as vehicle_type_id',
                'vt.vehicle_type_name',
                'pm.id as payment_method_id',
                'pm.payment_method_name',
                DB::raw('DATE(t.transaction_dt) as transaction_dt'),
                DB::raw('COUNT(t.id) as total_transactions'),
                DB::raw('IFNULL(SUM(t.gross_total), 0) as total_gross'),
                DB::raw('IFNULL(SUM(t.discount), 0) as total_discount'),
                DB::raw('IFNULL(SUM(t.net_total), 0) as total_net')
            );

        if (!empty($params['branch_id'])) {
            $ids = explode(',', $params['branch_id']);
            $query->whereIn('t.branch_id', $ids);
        }
        if (!empty($params['vehicle_type_id'])) {
            $ids = explode(',', $params['vehicle_type_id']);
            $query->whereIn('t.vehicle_type_id', $ids);
        }
        if (!empty($params['date_from'])) {
            $query->where('t.transaction_dt', '>=', $params['date_from']);
        }
        if (!empty($params['date_to'])) {
            $query->where('t.transaction_dt', '<=', $params['date_to']);
        }
        if (!empty($params['date'])) {
            $query->whereDate('t.transaction_dt', $params['date']);
        }
        if (!empty($params['payment_method_id'])) {
            $ids = explode(',', $params['payment_method_id']);
            $query->whereIn('t.payment_method_id', $ids);
        }

        $groupBy = $params['group_by'] ?? 'date';
        switch ($groupBy) {
            case 'branch':
                $query->groupBy('b.id', 'b.branch_name', 'vt.id', 'vt.vehicle_type_name', 'pm.id', 'pm.payment_method_name', 't.transaction_dt');
                break;
            case 'payment':
                $query->groupBy('pm.id', 'pm.payment_method_name', 'b.id', 'b.branch_name', 'vt.id', 'vt.vehicle_type_name', 't.transaction_dt');
                break;
            case 'vehicle':
                $query->groupBy('vt.id', 'vt.vehicle_type_name', 'b.id', 'b.branch_name', 'pm.id', 'pm.payment_method_name', 't.transaction_dt');
                break;
            case 'date':
            default:
                $query->groupBy(DB::raw('DATE(t.transaction_dt)'), 'b.id', 'b.branch_name', 'vt.id', 'vt.vehicle_type_name', 'pm.id', 'pm.payment_method_name');
                break;
        }

        $query->orderBy('t.transaction_dt', 'asc');

        return $query->get();
    }

    /**
     * Apply common filters to a query builder.
     */
    private function applyCommonFilters($query, $params)
    {
        if (!empty($params['search_query'])) {
            $search = '%' . $params['search_query'] . '%';
            $query->where(function ($q) use ($search) {
                $q->where('plate_number', 'like', $search)
                  ->orWhere('transaction_number', 'like', $search)
                  ->orWhere('customer_name', 'like', $search)
                  ->orWhereHas('branch', function ($q2) use ($search) {
                      $q2->where('branch_name', 'like', $search);
                  });
            });
        }

        if (!empty($params['branch_id'])) {
            $ids = explode(',', $params['branch_id']);
            $query->whereIn('branch_id', $ids);
        }

        if (!empty($params['vehicle_type_id'])) {
            $ids = explode(',', $params['vehicle_type_id']);
            $query->whereIn('vehicle_type_id', $ids);
        }

        if (!empty($params['payment_method_id'])) {
            $ids = explode(',', $params['payment_method_id']);
            $query->whereIn('payment_method_id', $ids);
        }

        if (!empty($params['service_ids'])) {
            $ids = explode(',', $params['service_ids']);
            $query->whereHas('transactionServices', function ($q) use ($ids) {
                $q->whereIn('service_type_id', $ids);
            });
        }

        if (!empty($params['date_from'])) {
            $query->whereDate('transaction_dt', '>=', $params['date_from']);
        }

        if (!empty($params['date_to'])) {
            $query->whereDate('transaction_dt', '<=', $params['date_to']);
        }

        if (!empty($params['date'])) {
            $query->whereDate('transaction_dt', $params['date']);
        }
    }
}
