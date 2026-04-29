<?php

namespace App\Repositories;

use App\Branch;
use App\Repositories\Contracts\BranchRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class BranchRepository extends EloquentRepository implements BranchRepositoryInterface
{
    public function getActive()
    {
        return $this->data->where('is_active', 1)->orderBy('branch_name')->get();
    }

    public function getAllPaginated($params)
    {
        $query = $this->data->newQuery();

        if (!empty($params['search_query'])) {
            $search = '%' . $params['search_query'] . '%';
            $query->where(function ($q) use ($search) {
                $q->where('branch_code', 'like', $search)
                  ->orWhere('branch_name', 'like', $search)
                  ->orWhere('branch_address', 'like', $search);
            });
        }

        if (isset($params['is_active'])) {
            $query->where('is_active', $params['is_active']);
        }

        $sortBy    = !empty($params['sort_by']) ? $params['sort_by'] : 'branch_name';
        $sortOrder = !empty($params['sort_order']) ? $params['sort_order'] : 'asc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = !empty($params['per_page']) ? $params['per_page'] : 10;
        return $query->paginate($perPage);
    }
}
