<?php
namespace App\Repositories\Contracts;

interface OrderStatusRepositoryInterface
{
    public function all();
    public function find($id);
}
