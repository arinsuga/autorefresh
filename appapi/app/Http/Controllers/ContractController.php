<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\ContractRepositoryInterface;

class ContractController extends Controller
{
    protected $repository;

    public function __construct(ContractRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index(Request $request)
    {
        $contracts = $this->repository->getAllPaginated($request->all());
        return response()->json($contracts, 200);
    }

    public function show($id)
    {
        $contract = $this->repository->findWithSheets($id);
        
        if (!$contract) {
            return response()->json(['error' => 'Contract not found'], 404);
        }

        return response()->json(['data' => $contract], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'contract_number' => 'required|unique:contracts,contract_number',
            'contract_name' => 'required|string',
            'project_id' => 'required|exists:projects,id',
            'contract_dt' => 'nullable|date',
            'contractstatus_id' => 'nullable|integer|exists:contractstatuses,id',
            'contract_sheets' => 'nullable|array',
        ]);

        return \DB::transaction(function () use ($request) {
            $contract = $this->repository->create($request->all());
            
            if ($request->has('contract_sheets')) {
                $this->syncSheets($contract, $request->get('contract_sheets'), $request);
            }

            return response()->json(['data' => $contract->load('contractSheets')], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $contract = $this->repository->find($id);
        
        if (!$contract) {
            return response()->json(['error' => 'Contract not found'], 404);
        }

        $validated = $request->validate([
            'contract_number' => 'unique:contracts,contract_number,' . $id,
            'contract_name' => 'string',
            'contract_dt' => 'nullable|date',
            'contractstatus_id' => 'nullable|integer|exists:contractstatuses,id',
            'contract_sheets' => 'nullable|array',
        ]);

        return \DB::transaction(function () use ($request, $id, $contract) {
            $this->repository->update($id, $request->all());
            
            if ($request->has('contract_sheets')) {
                $this->syncSheets($contract, $request->get('contract_sheets'), $request);
            }

            return response()->json(['data' => $contract->load('contractSheets')], 200);
        });
    }

    /**
     * Sync contract sheets with calculations.
     */
    protected function syncSheets($contract, array $inputSheets, Request $request)
    {
        $existingSheetIds = $contract->contractSheets()->pluck('id')->toArray();
        $inputSheetIds = array_map('intval', array_filter(array_column($inputSheets, 'id'), function($id) use ($existingSheetIds) {
            return is_numeric($id) && in_array((int)$id, $existingSheetIds);
        }));
        
        // 1. Remove sheets not in input
        $idsToDelete = array_diff($existingSheetIds, $inputSheetIds);
        if (!empty($idsToDelete)) {
            $inUseSheets = [];
            foreach ($idsToDelete as $id) {
                $sheet = $contract->contractSheets()->find($id);
                if ($sheet && $sheet->ordersheets()->count() > 0) {
                    $inUseSheets[] = $sheet->sheet_code . ' - ' . $sheet->sheet_name;
                }
            }

            if (!empty($inUseSheets) && !$request->has('force_soft_delete')) {
                // Throwing an exception to be caught by the outer try-catch or transaction handler
                // Actually, since we're inside a transaction callback in update(), we should return a specific response or throw an exception.
                // But update() returns whatever the callback returns.
                return response()->json([
                    'error' => 'Conflict',
                    'message' => 'The following items are in use and cannot be physically deleted: ' . implode(', ', $inUseSheets) . '. Would you like to mark them as inactive instead?',
                    'in_use' => true,
                    'in_use_items' => $inUseSheets
                ], 409);
            }

            foreach ($idsToDelete as $id) {
                $sheet = $contract->contractSheets()->find($id);
                if ($sheet) {
                    if ($sheet->ordersheets()->count() > 0) {
                        $sheet->update(['is_active' => 0]);
                    } else {
                        $sheet->delete();
                    }
                }
            }
        }

        // 2. Separate headers and items for calculation
        $headers = [];
        $items = [];
        $tempIdMap = []; // Map frontend temp IDs to database IDs for new headers

        foreach ($inputSheets as $sheetData) {
            if (($sheetData['sheet_type'] ?? 0) == 0) {
                $headers[] = $sheetData;
            } else {
                $items[] = $sheetData;
            }
        }

        // 3. Process Headers first (to get IDs for items)
        foreach ($headers as &$headerData) {
            $headerId = $headerData['id'] ?? null;

            // Map sheetheader_id if it references a newly created parent header (Rule: nested headers)
            if (isset($headerData['sheetheader_id']) && isset($tempIdMap[$headerData['sheetheader_id']])) {
                $headerData['sheetheader_id'] = $tempIdMap[$headerData['sheetheader_id']];
            }

            $isNewHeader = !is_numeric($headerId);
            $headerTempId = $isNewHeader ? $headerId : null;
            
            // Calculate header totals recursively based on code pattern
            $headerGrossAmt = 0;
            $prefix = $headerData['sheet_code'] . '.';

            foreach ($items as $item) {
                $itemCode = $item['sheet_code'] ?? '';
                if (substr($itemCode, 0, strlen($prefix)) === $prefix) {
                    $qty = $item['sheet_qty'] ?? 0;
                    $price = $item['sheet_price'] ?? 0;
                    $headerGrossAmt += ($qty * $price);
                }
            }

            $headerData['sheet_grossamt'] = $headerGrossAmt;
            $headerData['sheet_grossamt2'] = $headerGrossAmt;
            $headerData['sheet_netamt'] = $headerGrossAmt;
            $headerData['sheet_netamt2'] = $headerGrossAmt;
            $headerData['sheet_realamt'] = $headerGrossAmt;
            $headerData['contract_id'] = $contract->id;
            $headerData['project_id'] = $contract->project_id;

            // Filter data to only include valid DB columns
            $filteredHeaderData = collect($headerData)->only([
                'project_id', 'contract_id', 'sheet_dt', 'sheet_type', 'sheetgroup_type',
                'sheetgroup_id', 'sheetheader_id', 'sheet_code', 'sheet_name',
                'sheet_description', 'sheet_notes', 'sheet_qty', 'sheet_price',
                'sheet_grossamt', 'sheet_discountrate', 'sheet_discountvalue',
                'sheet_taxrate', 'sheet_taxvalue', 'sheet_netamt', 'sheet_grossamt2',
                'sheet_netamt2', 'sheet_realamt', 'uom_id', 'uom_code',
                'sheetgroup_seqno', 'sheet_seqno', 'is_active'
            ])->toArray();

            // Only set is_active to 1 if it's not explicitly provided as 0
            if (!isset($filteredHeaderData['is_active'])) {
                $filteredHeaderData['is_active'] = 1;
            }

            if ($isNewHeader) {
                $newHeader = $contract->contractSheets()->create($filteredHeaderData);
                if ($headerTempId) {
                    $tempIdMap[$headerTempId] = $newHeader->id;
                }
            } else {
                $headerSheet = $contract->contractSheets()->find($headerId);
                if ($headerSheet) {
                    $headerSheet->update($filteredHeaderData);
                }
            }
        }

        // 4. Process Items
        foreach ($items as $itemData) {
            $itemId = $itemData['id'] ?? null;
            
            // Map header ID if it was a new header
            if (isset($itemData['sheetheader_id']) && isset($tempIdMap[$itemData['sheetheader_id']])) {
                $itemData['sheetheader_id'] = $tempIdMap[$itemData['sheetheader_id']];
            }

            $qty = $itemData['sheet_qty'] ?? 0;
            $price = $itemData['sheet_price'] ?? 0;
            $itemData['sheet_grossamt'] = $qty * $price;
            $itemData['sheet_netamt'] = $qty * $price;
            $itemData['sheet_realamt'] = $qty * $price;
            $itemData['contract_id'] = $contract->id;
            $itemData['project_id'] = $contract->project_id;

            // Filter data to only include valid DB columns
            $filteredItemData = collect($itemData)->only([
                'project_id', 'contract_id', 'sheet_dt', 'sheet_type', 'sheetgroup_type',
                'sheetgroup_id', 'sheetheader_id', 'sheet_code', 'sheet_name',
                'sheet_description', 'sheet_notes', 'sheet_qty', 'sheet_price',
                'sheet_grossamt', 'sheet_discountrate', 'sheet_discountvalue',
                'sheet_taxrate', 'sheet_taxvalue', 'sheet_netamt', 'sheet_grossamt2',
                'sheet_netamt2', 'sheet_realamt', 'uom_id', 'uom_code',
                'sheetgroup_seqno', 'sheet_seqno', 'is_active'
            ])->toArray();

            // Only set is_active to 1 if it's not explicitly provided as 0
            if (!isset($filteredItemData['is_active'])) {
                $filteredItemData['is_active'] = 1;
            }

            if (!is_numeric($itemId)) {
                $contract->contractSheets()->create($filteredItemData);
            } else {
                $itemSheet = $contract->contractSheets()->find($itemId);
                if ($itemSheet) {
                    $itemSheet->update($filteredItemData);
                }
            }
        }
    }

    public function destroy($id)
    {
        $contract = $this->repository->find($id);
        
        if (!$contract) {
            return response()->json(['error' => 'Contract not found'], 404);
        }

        // Validation Rule: User can not delete physical data if already use by order.
        if ($contract->orders()->count() > 0) {
            return response()->json([
                'error' => 'Conflict',
                'message' => 'Contract cannot be deleted because it is already used by orders.',
                'in_use' => true
            ], 409);
        }

        return \DB::transaction(function () use ($id, $contract) {
            $contract->contractSheets()->delete();
            $this->repository->delete($id);
            return response()->json(['message' => 'Contract and all sheets deleted successfully'], 200);
        });
    }
}
