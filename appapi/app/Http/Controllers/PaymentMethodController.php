<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\PaymentMethodRepositoryInterface;

class PaymentMethodController extends Controller
{
    protected $repository;

    public function __construct(PaymentMethodRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index()
    {
        $paymentMethods = $this->repository->getActive();
        return response()->json(['data' => $paymentMethods], 200);
    }

    public function show($id)
    {
        $paymentMethod = $this->repository->find($id);

        if (!$paymentMethod) {
            return response()->json(['error' => 'Payment method not found'], 404);
        }

        return response()->json(['data' => $paymentMethod], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'payment_method_code' => 'required|string|unique:payment_methods,payment_method_code',
            'payment_method_name' => 'required|string',
        ]);

        $paymentMethod = $this->repository->create($request->all());
        return response()->json(['data' => $paymentMethod], 201);
    }

    public function update(Request $request, $id)
    {
        $paymentMethod = $this->repository->find($id);

        if (!$paymentMethod) {
            return response()->json(['error' => 'Payment method not found'], 404);
        }

        $request->validate([
            'payment_method_code' => 'required|string|unique:payment_methods,payment_method_code,' . $id,
            'payment_method_name' => 'required|string',
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        $paymentMethod = $this->repository->find($id);

        if (!$paymentMethod) {
            return response()->json(['error' => 'Payment method not found'], 404);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Payment method deleted successfully'], 200);
    }
}
