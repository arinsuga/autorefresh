<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\OrderRepositoryInterface;

class OrderController extends Controller
{
    protected $repository;

    public function __construct(OrderRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index(Request $request)
    {
        $orders = $this->repository->getAllPaginated($request->all());
        return response()->json($orders, 200);
    }

    public function show($id)
    {
        $order = $this->repository->find($id);
        
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        return response()->json(['data' => $order], 200);
    }

    public function store(Request $request)
    {
        // $validated = $request->validate([
        //     'project_id' => 'required|exists:projects,id',
        //     'contract_id' => 'required|exists:contracts,id',
        //     'order_dt' => 'nullable|date',
        //     'order_number' => 'required|nullable|string|unique:orders,order_number',
        //     'order_description' => 'required|nullable|string',
        //     'order_pic' => 'nullable|string',
        //     'orderstatus_id' => 'nullable|integer|in:0,1,2',
        // ]);

        $order = $this->repository->create($request->all());
        return response()->json(['data' => $order], 201);
    }

    public function update(Request $request, $id)
    {
        $order = $this->repository->find($id);
        
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $validated = $request->validate([
            'project_id' => 'exists:projects,id',
            'contract_id' => 'exists:contracts,id',
            'order_dt' => 'nullable|date',
            'order_number' => 'required|nullable|string|unique:orders,order_number,' . $id,
            'order_description' => 'required|nullable|string',
            'order_pic' => 'nullable|string',
            'orderstatus_id' => 'nullable|integer|in:0,1,2',
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        $order = $this->repository->find($id);
        
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        // The deleting event in the Order model will handle cascade deletion of ordersheets
        $this->repository->delete($id);
        
        return response()->json(['message' => 'Order deleted successfully'], 200);
    }

    public function getByProject($projectId)
    {
        $orders = $this->repository->getByProject($projectId);
        return response()->json(['data' => $orders], 200);
    }

    public function getByContract($contractId)
    {
        $orders = $this->repository->getByContract($contractId);
        return response()->json(['data' => $orders], 200);
    }
}
