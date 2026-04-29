<?php

namespace App\Repositories;

use App\SheetGroup;
use App\Repositories\Contracts\SheetGroupRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class SheetGroupRepository extends EloquentRepository implements SheetGroupRepositoryInterface
{
    protected $sheetgroup;

    public function getSheetGroupsByType($type)
    {
        return $this->data->where('sheetgroup_type', $type)->orderBy('sheetgroup_seqno')->get();
    }

    public function getSheetGroupsByActive()
    {
        return $this->data->where('is_active', 1)->orderBy('sheetgroup_seqno')->get();
    }

    public function getSheetGroupByCode($code)
    {
        return $this->data->where('sheetgroup_code', $code)->first();
    }
    public function getAllPaginated($params)
    {
        $query = $this->data->query();

        // Search Logic
        if (!empty($params['search_query'])) {
            $search = '%' . $params['search_query'] . '%';
            $column = !empty($params['search_column']) ? $params['search_column'] : '';

            $allowedColumns = ['sheetgroup_code', 'sheetgroup_name'];
            
            if (in_array($column, $allowedColumns)) {
                 $query->where($column, 'like', $search);
            } else {
                 $query->where(function($q) use ($search) {
                     $q->where('sheetgroup_name', 'like', $search)
                       ->orWhere('sheetgroup_code', 'like', $search);
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
