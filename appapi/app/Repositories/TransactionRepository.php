<?php

namespace App\Repositories;

use App\Transaction;
use App\Repositories\Contracts\TransactionRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

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
        $query = \DB::table('transactions as t')
            ->join('branches as b', 't.branch_id', '=', 'b.id')
            ->join('vehicle_types as vt', 't.vehicle_type_id', '=', 'vt.id')
            ->join('payment_methods as pm', 't.payment_method_id', '=', 'pm.id')
            ->select(
                'b.branch_name',
                'vt.vehicle_type_name',
                'pm.payment_method_name',
                't.transaction_dt',
                \DB::raw('COUNT(t.id) as total_transactions'),
                \DB::raw('SUM(t.gross_total) as total_gross'),
                \DB::raw('SUM(t.discount) as total_discount'),
                \DB::raw('SUM(t.net_total) as total_net')
            );

        if (!empty($params['branch_id'])) {
            $query->where('t.branch_id', $params['branch_id']);
        }
        if (!empty($params['date_from'])) {
            $query->where('t.transaction_dt', '>=', $params['date_from']);
        }
        if (!empty($params['date_to'])) {
            $query->where('t.transaction_dt', '<=', $params['date_to']);
        }
        if (!empty($params['payment_method_id'])) {
            $query->where('t.payment_method_id', $params['payment_method_id']);
        }

        $groupBy = $params['group_by'] ?? 'date';
        switch ($groupBy) {
            case 'branch':
                $query->groupBy('b.id', 'b.branch_name', 'vt.vehicle_type_name', 'pm.payment_method_name', 't.transaction_dt');
                break;
            case 'payment':
                $query->groupBy('pm.id', 'pm.payment_method_name', 'b.branch_name', 'vt.vehicle_type_name', 't.transaction_dt');
                break;
            case 'vehicle':
                $query->groupBy('vt.id', 'vt.vehicle_type_name', 'b.branch_name', 'pm.payment_method_name', 't.transaction_dt');
                break;
            case 'date':
            default:
                $query->groupBy('t.transaction_dt', 'b.branch_name', 'vt.vehicle_type_name', 'pm.payment_method_name');
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
            $query->where('branch_id', $params['branch_id']);
        }

        if (!empty($params['vehicle_type_id'])) {
            $query->where('vehicle_type_id', $params['vehicle_type_id']);
        }

        if (!empty($params['payment_method_id'])) {
            $query->where('payment_method_id', $params['payment_method_id']);
        }

        if (!empty($params['date_from'])) {
            $query->whereDate('transaction_dt', '>=', $params['date_from']);
        }

        if (!empty($params['date_to'])) {
            $query->whereDate('transaction_dt', '<=', $params['date_to']);
        }
    }
}
