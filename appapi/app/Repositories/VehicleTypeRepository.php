<?php

namespace App\Repositories;

use App\VehicleType;
use App\Repositories\Contracts\VehicleTypeRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class VehicleTypeRepository extends EloquentRepository implements VehicleTypeRepositoryInterface
{
    public function getActive()
    {
        return $this->data->where('is_active', 1)->orderBy('vehicle_type_name')->get();
    }

    public function getAllPaginated($params)
    {
        $query = $this->data->newQuery();

        if (!empty($params['search_query'])) {
            $search = '%' . $params['search_query'] . '%';
            $query->where(function ($q) use ($search) {
                $q->where('vehicle_type_code', 'like', $search)
                  ->orWhere('vehicle_type_name', 'like', $search)
                  ->orWhere('vehicle_type_description', 'like', $search);
            });
        }

        if (isset($params['is_active'])) {
            $query->where('is_active', $params['is_active']);
        }

        $sortBy    = !empty($params['sort_by']) ? $params['sort_by'] : 'vehicle_type_name';
        $sortOrder = !empty($params['sort_order']) ? $params['sort_order'] : 'asc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = !empty($params['per_page']) ? $params['per_page'] : 10;
        return $query->paginate($perPage);
    }
}
