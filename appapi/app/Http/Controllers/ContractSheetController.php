<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\ContractSheetRepositoryInterface;
use App\Repositories\Contracts\ContractOrderSummaryRepositoryInterface;

class ContractSheetController extends Controller
{
    protected $repository;
    protected $summaryRepository;

    public function __construct(
        ContractSheetRepositoryInterface $repository,
        ContractOrderSummaryRepositoryInterface $summaryRepository
    ) {
        $this->repository = $repository;
        $this->summaryRepository = $summaryRepository;
        $this->middleware('authjwt');
    }

    public function index()
    {
        $contractsheets = $this->repository->all();
        return response()->json(['data' => $contractsheets], 200);
    }

    public function show($id)
    {
        $contractsheet = $this->repository->find($id);
        
        if (!$contractsheet) {
            return response()->json(['error' => 'Contract sheet not found'], 404);
        }

        return response()->json(['data' => $contractsheet], 200);
    }

    public function getByContract($contractId)
    {
        $contractsheets = $this->repository->getContractSheetsByContract($contractId);
        return response()->json(['data' => $contractsheets], 200);
    }

    public function getOrderSummaryByContract($contractId)
    {
        $summary = $this->summaryRepository->getSummaryByContract($contractId);
        return response()->json(['data' => $summary], 200);
    }

    public function getOrderSummaryByContractAndSheet($contractId, $sheetId)
    {
        $summary = $this->summaryRepository->getSummaryByContractAndSheet($contractId, $sheetId);
        if (!$summary) {
            return response()->json(['error' => 'Summary not found'], 404);
        }
        return response()->json(['data' => $summary], 200);
    }

    public function getOrderSummaryByProjectAndContract($projectId, $contractId)
    {
        $summary = $this->summaryRepository->getSummaryByProjectAndContract($projectId, $contractId);
        return response()->json(['data' => $summary], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            '*.project_id' => 'required|integer|exists:projects,id',
            '*.contract_id' => 'required|integer|exists:contracts,id',
            '*.sheet_dt' => 'nullable|date',
            '*.sheet_type' => 'integer',
            '*.sheetgroup_type' => 'required|integer|in:0,1',
            '*.sheetgroup_id' => 'required|integer',
            '*.sheetheader_id' => 'nullable|integer',
            '*.sheet_code' => 'nullable|string|max:255',
            '*.sheet_name' => 'nullable|string|max:255',
            '*.sheet_description' => 'nullable|string|max:255',
            '*.sheet_notes' => 'nullable|string|max:255',
            '*.sheet_qty' => 'nullable|numeric',
            '*.sheet_price' => 'nullable|numeric',
            '*.sheet_grossamt' => 'nullable|numeric',
            '*.sheet_discountrate' => 'nullable|numeric',
            '*.sheet_discountvalue' => 'nullable|numeric',
            '*.sheet_taxrate' => 'nullable|numeric',
            '*.sheet_taxvalue' => 'nullable|numeric',
            '*.sheet_netamt' => 'nullable|numeric',
            '*.sheet_grossamt2' => 'nullable|numeric',
            '*.sheet_netamt2' => 'nullable|numeric',
            '*.sheet_realamt' => 'nullable|numeric',
            '*.uom_id' => 'required|integer|exists:uoms,id',
            '*.uom_code' => 'required|string|max:255',
            '*.sheetgroup_seqno' => 'nullable|integer',
            '*.sheet_seqno' => 'nullable|integer',
            '*.is_active' => 'nullable|boolean',
        ]);

        // $contractsheet = $this->repository->create($request->all());
        $contractsheet = $this->repository->bulkCreate($request->all());
        return response()->json(['data' => $contractsheet], 201);
    }

    public function update(Request $request, $id)
    {
        $contractsheet = $this->repository->find($id);
        
        if (!$contractsheet) {
            return response()->json(['error' => 'Contract sheet not found'], 404);
        }

        $validated = $request->validate([
            'contract_id' => 'exists:contracts,id',
            'sheetgroup_type' => 'integer|in:0,1',
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        $contractsheet = $this->repository->find($id);
        
        if (!$contractsheet) {
            return response()->json(['error' => 'Contract sheet not found'], 404);
        }

        // Validation Rule: User can not delete physical data if already use by ordersheet items.
        if ($contractsheet->ordersheets()->count() > 0) {
            return response()->json([
                'error' => 'Conflict',
                'message' => 'Contract sheet item cannot be deleted because it is already used by ordersheet items.',
                'in_use' => true
            ], 409);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Contract sheet deleted successfully'], 200);
    }

    public function getOrderSummaryByContractExcludingOrder($contractId, $orderId)
    {
        $summary = $this->summaryRepository->getSummaryByContractExcludingOrder($contractId, $orderId);
        return response()->json(['data' => $summary], 200);
    }
}
