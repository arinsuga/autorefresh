<?php

namespace App\Http\Controllers;

use App\Repositories\Contracts\OrderStatusRepositoryInterface;
use Illuminate\Http\Request;

class OrderStatusController extends Controller
{
    protected $repository;

    public function __construct(OrderStatusRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index()
    {
        $statuses = $this->repository->all();
        return response()->json(['data' => $statuses], 200);
    }

    public function show($id)
    {
        $status = $this->repository->find($id);
        
        if (!$status) {
            return response()->json(['error' => 'Order Status not found'], 404);
        }

        return response()->json(['data' => $status], 200);
    }
}
