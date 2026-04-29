<?php

namespace App\Repositories;

use App\VendorType;
use App\Repositories\Contracts\VendorTypeRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class VendorTypeRepository extends EloquentRepository implements VendorTypeRepositoryInterface
{
    protected $vendortype;

    public function getVendorTypesByActive()
    {
        return $this->data->where('is_active', 1)->orderBy('display_order')->get();
    }

    public function getVendorTypeByCode($code)
    {
        return $this->data->where('vendortype_code', $code)->first();
    }
    public function getAllPaginated($params)
    {
        $query = $this->data->newQuery();

        // Search Logic
        if (!empty($params['search_query'])) {
            $search = '%' . $params['search_query'] . '%';
            $column = !empty($params['search_column']) ? $params['search_column'] : '';

            $allowedColumns = ['vendortype_code', 'vendortype_name'];
            
            if (in_array($column, $allowedColumns)) {
                 $query->where($column, 'like', $search);
            } else {
                 $query->where(function($q) use ($search) {
                     $q->where('vendortype_name', 'like', $search)
                       ->orWhere('vendortype_code', 'like', $search);
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
