<?php

namespace App\Repositories;

use App\Vendor;
use App\Repositories\Contracts\VendorRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class VendorRepository extends EloquentRepository implements VendorRepositoryInterface
{
    protected $vendor;

    public function getVendorsByType($vendorTypeId)
    {
        return $this->data->where('vendortype_id', $vendorTypeId)->get();
    }

    public function getVendorsByActive()
    {
        return $this->data->where('is_active', 1)->get();
    }

    public function getVendorByCode($code)
    {
        return $this->data->where('vendor_code', $code)->first();
    }
    public function getAllPaginated($params)
    {
        $query = $this->data->with(['vendortype']);

        // Search Logic
        if (!empty($params['search_query'])) {
            $search = '%' . $params['search_query'] . '%';
            $column = !empty($params['search_column']) ? $params['search_column'] : '';

            $allowedColumns = ['vendor_code', 'vendor_name'];
            
            if (in_array($column, $allowedColumns)) {
                 $query->where($column, 'like', $search);
            } else {
                 $query->where(function($q) use ($search) {
                     $q->where('vendor_name', 'like', $search)
                       ->orWhere('vendor_code', 'like', $search);
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
