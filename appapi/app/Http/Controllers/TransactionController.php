<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Repositories\Contracts\TransactionRepositoryInterface;

class TransactionController extends Controller
{
    protected $repository;

    public function __construct(TransactionRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index(Request $request)
    {
        $transactions = $this->repository->getAllPaginated($request->all());
        return response()->json($transactions, 200);
    }

    public function show($id)
    {
        $transaction = $this->repository->find($id);

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        return response()->json(['data' => $transaction], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'branch_id'         => 'required|exists:branches,id',
            'transaction_dt'    => 'required|date',
            'plate_number'      => 'required|string',
            'vehicle_type_id'   => 'required|exists:vehicle_types,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'gross_total'       => 'required|numeric|min:0',
            'net_total'         => 'required|numeric|min:0',
            'services'          => 'required|array|min:1',
            'services.*.service_type_id' => 'required|exists:service_types,id',
            'services.*.service_price'   => 'required|numeric|min:0',
            // 'upload'            => 'nullable|image|max:10240', // Max 10MB raw, will be compressed
        ]);

        // Attach the authenticated user as creator
        $data = $request->all();
        $user = JWTAuth::parseToken()->authenticate();
        $data['created_by'] = $user ? $user->email : null;

        $transaction = $this->repository->create($data);
        return response()->json(['data' => $transaction], 201);
    }

    public function update(Request $request, $id)
    {
        $transaction = $this->repository->find($id);

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        $request->validate([
            'branch_id'         => 'exists:branches,id',
            'transaction_dt'    => 'date',
            'plate_number'      => 'string',
            'vehicle_type_id'   => 'exists:vehicle_types,id',
            'payment_method_id' => 'exists:payment_methods,id',
            'gross_total'       => 'numeric|min:0',
            'net_total'         => 'numeric|min:0',
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        $transaction = $this->repository->find($id);

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Transaction deleted successfully'], 200);
    }

    public function getByBranch($branchId)
    {
        $transactions = $this->repository->getByBranch($branchId);
        return response()->json(['data' => $transactions], 200);
    }

    public function getReportDetail(Request $request)
    {
        $data = $this->repository->getReportDetail($request->all());
        return response()->json(['data' => $data], 200);
    }

    public function getReportSummary(Request $request)
    {
        return response()->json(['$request->all()' => $request->all()], 200);
        $data = $this->repository->getReportSummary($request->all());
        return response()->json(['data' => $data], 200);
    }

    public function findByPlateNumber(Request $request)
    {
        $plateNumber = $request->input('plate_number');

        if (!$plateNumber) {
            return response()->json(['error' => 'plate_number is required'], 422);
        }

        $customer = $this->repository->findByPlateNumber($plateNumber);
        return response()->json(['data' => $customer], 200);
    }
}
