<?php

namespace App\Repositories;

use App\UomNormalization;
use App\Repositories\Contracts\UomNormalizationRepositoryInterface;

class UomNormalizationRepository implements UomNormalizationRepositoryInterface
{
    protected $model;

    public function __construct(UomNormalization $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->orderBy('language')->orderBy('raw_uom_code')->get();
    }

    public function find($id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $normalization = $this->find($id);
        $normalization->update($data);
        return $normalization->fresh();
    }

    public function delete($id)
    {
        $normalization = $this->find($id);
        return $normalization->delete();
    }

    public function findByRawValue($rawValue)
    {
        return $this->model->where('raw_uom_code', strtolower(trim($rawValue)))->first();
    }
}
