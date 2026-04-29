<?php

namespace App\Repositories;

use App\Contract;
use App\Repositories\Contracts\ContractRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class ContractRepository extends EloquentRepository implements ContractRepositoryInterface
{
    public function all()
    {
        return $this->data->with(['contractStatus', 'project', 'orderSummaries'])->get();
    }

    public function getAllPaginated($params)
    {
        $query = $this->data->with(['contractStatus', 'project', 'orderSummaries']);

        // Search Logic
        if (!empty($params['search_query'])) {
            $search = '%' . $params['search_query'] . '%';
            $column = !empty($params['search_column']) ? $params['search_column'] : 'contract_name';
            
            // Validate column to prevent SQL injection if needed, or stick to safe list
            $allowedColumns = ['contract_number', 'contract_name', 'contract_pic', 'id'];
            if (in_array($column, $allowedColumns)) {
                 $query->where($column, 'like', $search);
            } elseif ($column === 'project_number') {
                $query->whereHas('project', function($q) use ($search) {
                    $q->where('project_number', 'like', $search);
                });
            } elseif ($column === 'project_name') {
                $query->whereHas('project', function($q) use ($search) {
                    $q->where('project_name', 'like', $search);
                });
            } else {
                 // Fallback or multiple column search
                 $query->where(function($q) use ($search) {
                     $q->where('contract_name', 'like', $search)
                       ->orWhere('contract_number', 'like', $search)
                       ->orWhere('contract_pic', 'like', $search)
                       ->orWhereHas('project', function($subQ) use ($search) {
                           $subQ->where('project_number', 'like', $search)
                                ->orWhere('project_name', 'like', $search);
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

    public function find($parId)
    {
        return $this->data->with(['contractStatus', 'project', 'orderSummaries'])->find($parId);
    }

    public function getContractByCode($code)
    {
        return $this->data->with(['contractStatus', 'project', 'orderSummaries'])->where('contract_code', $code)->first();
    }

    public function findWithSheets($id)
    {
        return $this->data->with(['contractStatus', 'project', 'contractSheets' => function($query) {
            $query->orderBy('sheetgroup_seqno', 'asc')
                  ->orderBy('sheet_seqno', 'asc')
                  ->withCount('ordersheets')
                  ->with('orderSummary');
        }, 'orderSummaries'])->find($id);
    }
}
