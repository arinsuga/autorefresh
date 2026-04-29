<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\OrdersheetRepositoryInterface;

class OrdersheetController extends Controller
{
    protected $repository;

    public function __construct(OrdersheetRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index()
    {
        $ordersheets = $this->repository->all();
        return response()->json(['data' => $ordersheets], 200);
    }

    public function show($id)
    {
        $ordersheet = $this->repository->find($id);
        
        if (!$ordersheet) {
            return response()->json(['error' => 'Ordersheet not found'], 404);
        }

        return response()->json(['data' => $ordersheet], 200);
    }

    public function getByOrder($orderId)
    {
        $ordersheets = $this->repository->getOrdersheetsByOrder($orderId);
        return response()->json(['data' => $ordersheets], 200);
    }

    public function getByOrderOptimized($orderId)
    {
        // Only load vendor and uom relationships for performance
        $ordersheets = $this->repository->getOrdersheetsByOrderWithRelations($orderId, ['vendor', 'uom']);
        return response()->json(['data' => $ordersheets], 200);
    }

    public function getByExpense($expenseId)
    {
        $ordersheets = $this->repository->getOrdersheetsByExpense($expenseId);
        return response()->json(['data' => $ordersheets], 200);
    }

    public function getByProject($projectId)

    {
        $ordersheets = $this->repository->getOrdersheetsByProject($projectId);
        return response()->json(['data' => $ordersheets], 200);
    }

    public function getByContract($contractId)
    {
        $ordersheets = $this->repository->getOrdersheetsByContract($contractId);
        return response()->json(['data' => $ordersheets], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            '*.project_id' => 'required|exists:projects,id',
            '*.order_id' => 'required|exists:orders,id',
            '*.contract_id' => 'nullable|exists:contracts,id',
            '*.contractsheets_id' => 'nullable|exists:contractsheets,id',
            '*.sheet_dt' => 'nullable|date',
            '*.sheet_type' => 'required|nullable|integer',
            '*.sheetgroup_type' => 'required|integer|in:0,1',
            '*.sheetgroup_id' => 'required|nullable|exists:sheetgroups,id',
            '*.sheetheader_id' => 'nullable|integer',
            '*.sheet_code' => 'required|nullable|string|max:255',
            '*.sheet_name' => 'required|nullable|string|max:255',
            '*.sheet_description' => 'nullable|string',
            '*.sheet_notes' => 'nullable|string',
            '*.sheet_qty' => 'required|nullable|numeric',
            '*.sheet_price' => 'required|nullable|numeric',
            '*.sheet_grossamt' => 'required|nullable|numeric',
            '*.sheet_discountrate' => 'nullable|numeric',
            '*.sheet_discountvalue' => 'nullable|numeric',
            '*.sheet_taxrate' => 'nullable|numeric',
            '*.sheet_taxvalue' => 'nullable|numeric',
            '*.sheet_netamt' => 'required|nullable|numeric',
            '*.uom_id' => 'required|nullable|integer|exists:uoms,id',
            '*.uom_code' => 'required|nullable|string|max:255',
            '*.sheet_payment_dt' => 'nullable|date',
            '*.sheet_payment_status' => 'nullable|integer',
            '*.vendortype_id' => 'nullable|exists:vendortypes,id',
            '*.vendortype_name' => 'nullable|string|max:255',
            '*.vendor_id' => 'nullable|exists:vendors,id',
            '*.vendor_name' => 'nullable|string|max:255',
            '*.sheet_refftypeid' => 'nullable|integer',
            '*.sheet_reffno' => 'nullable|string|max:255',
            '*.order_number' => 'nullable|string|max:255',
            '*.order_dt' => 'nullable|date',
            '*.sheetgroup_seqno' => 'nullable|integer',
            '*.sheet_seqno' => 'nullable|integer',
        ]);

        // $ordersheet = $this->repository->create($request->all());
        $ordersheet = $this->repository->bulkCreate($request->all());
        return response()->json(['data' => $ordersheet], 201);
    }

    public function update(Request $request, $id)
    {
        $ordersheet = $this->repository->find($id);
        
        if (!$ordersheet) {
            return response()->json(['error' => 'Ordersheet not found'], 404);
        }

        $validated = $request->validate([
            'project_id' => 'exists:projects,id',
            'order_id' => 'exists:orders,id',
            'contract_id' => 'nullable|exists:contracts,id',
            'contractsheets_id' => 'nullable|exists:contractsheets,id',
            'sheet_dt' => 'nullable|date',
            'sheet_type' => 'nullable|integer',
            'sheetgroup_type' => 'integer|in:0,1',
            'sheetgroup_id' => 'nullable|exists:sheetgroups,id',
            'sheetheader_id' => 'nullable|integer',
            'sheet_code' => 'nullable|string|max:255',
            'sheet_name' => 'nullable|string|max:255',
            'sheet_description' => 'nullable|string',
            'sheet_notes' => 'nullable|string',
            'sheet_qty' => 'nullable|numeric',
            'sheet_price' => 'nullable|numeric',
            'sheet_grossamt' => 'nullable|numeric',
            'sheet_discountrate' => 'nullable|numeric',
            'sheet_discountvalue' => 'nullable|numeric',
            'sheet_taxrate' => 'nullable|numeric',
            'sheet_taxvalue' => 'nullable|numeric',
            'sheet_netamt' => 'nullable|numeric',
            'uom_id' => 'nullable|integer|exists:uoms,id',
            'uom_code' => 'nullable|string|max:255',
            'sheet_payment_dt' => 'nullable|date',
            'sheet_payment_status' => 'nullable|integer',
            'vendortype_id' => 'nullable|exists:vendortypes,id',
            'vendortype_name' => 'nullable|string|max:255',
            'vendor_id' => 'nullable|exists:vendors,id',
            'vendor_name' => 'nullable|string|max:255',
            'sheet_refftypeid' => 'nullable|integer',
            'sheet_reffno' => 'nullable|string|max:255',
            'order_number' => 'nullable|string|max:255',
            'order_dt' => 'nullable|date',
            'sheetgroup_seqno' => 'nullable|integer',
            'sheet_seqno' => 'nullable|integer',
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        $ordersheet = $this->repository->find($id);
        
        if (!$ordersheet) {
            return response()->json(['error' => 'Ordersheet not found'], 404);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Ordersheet deleted successfully'], 200);
    }
}
