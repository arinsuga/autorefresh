<?php

namespace App\Repositories\Eloquents;

use App\Repositories\Contracts\OrderStatusRepositoryInterface;
use App\OrderStatus;

class OrderStatusRepository implements OrderStatusRepositoryInterface
{
    protected $model;

    public function __construct(OrderStatus $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->all();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }
}
