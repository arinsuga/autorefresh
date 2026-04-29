<?php

namespace App\Repositories;

use App\Refftype;
use App\Repositories\Contracts\RefftypeRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class RefftypeRepository extends EloquentRepository implements RefftypeRepositoryInterface
{
    protected $refftype;


    public function getRefftypesByActive()
    {
        return $this->data->where('is_active', 1)->orderBy('display_order')->get();
    }

    public function getRefftypeByCode($code)
    {
        return $this->data->where('refftype_code', $code)->first();
    }
    public function getAllPaginated($params)
    {
        $query = $this->data->query();

        // Search Logic
        if (!empty($params['search_query'])) {
            $search = '%' . $params['search_query'] . '%';
            $column = !empty($params['search_column']) ? $params['search_column'] : '';

            $allowedColumns = ['refftype_code', 'refftype_name'];
            
            if (in_array($column, $allowedColumns)) {
                 $query->where($column, 'like', $search);
            } else {
                 $query->where(function($q) use ($search) {
                     $q->where('refftype_name', 'like', $search)
                       ->orWhere('refftype_code', 'like', $search);
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
