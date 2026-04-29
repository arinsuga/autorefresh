<?php

namespace App\Repositories;

use App\ServiceType;
use App\Repositories\Contracts\ServiceTypeRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class ServiceTypeRepository extends EloquentRepository implements ServiceTypeRepositoryInterface
{
    public function getActive()
    {
        return $this->data
            ->with(['vehicleType'])
            ->where('is_active', 1)
            ->orderBy('service_name')
            ->get();
    }

    public function getByVehicleType($vehicleTypeId)
    {
        return $this->data
            ->with(['vehicleType'])
            ->where('vehicle_type_id', $vehicleTypeId)
            ->where('is_active', 1)
            ->orderBy('service_name')
            ->get();
    }

    public function find($id)
    {
        return $this->data->with(['vehicleType'])->find($id);
    }

    public function getAllPaginated($params)
    {
        $query = $this->data->newQuery()->with(['vehicleType']);

        if (!empty($params['search_query'])) {
            $search = '%' . $params['search_query'] . '%';
            $query->where(function ($q) use ($search) {
                $q->where('service_code', 'like', $search)
                  ->orWhere('service_name', 'like', $search)
                  ->orWhereHas('vehicleType', function ($q2) use ($search) {
                      $q2->where('vehicle_type_name', 'like', $search);
                  });
            });
        }

        if (!empty($params['vehicle_type_id'])) {
            $query->where('vehicle_type_id', $params['vehicle_type_id']);
        }

        if (isset($params['is_active'])) {
            $query->where('is_active', $params['is_active']);
        }

        $sortBy    = !empty($params['sort_by']) ? $params['sort_by'] : 'service_name';
        $sortOrder = !empty($params['sort_order']) ? $params['sort_order'] : 'asc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = !empty($params['per_page']) ? $params['per_page'] : 10;
        return $query->paginate($perPage);
    }
}
