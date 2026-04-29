<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\ExpenseRepositoryInterface;

class ExpenseController extends Controller
{
    protected $repository;

    public function __construct(ExpenseRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index(Request $request)
    {
        $expenses = $this->repository->getAllPaginated($request->all());
        return response()->json($expenses, 200);
    }

    public function show($id)
    {
        $expense = $this->repository->find($id);
        
        if (!$expense) {
            return response()->json(['error' => 'Expense not found'], 404);
        }

        return response()->json(['data' => $expense], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'contract_id' => 'required|exists:contracts,id',
            'order_id' => 'required|exists:orders,id',
            'refftype_id' => 'nullable|exists:refftypes,id',
            'expense_dt' => 'nullable|date',
            'expense_number' => 'required|string|unique:expenses,expense_number',
            'expense_description' => 'required|string',
            'expense_pic' => 'nullable|string',
            'expensestatus_id' => 'nullable|integer|in:0,1,2,3,4',
            'expense_items' => 'nullable|array',
            'expense_items.*.id' => 'nullable|exists:ordersheets,id',
            'expense_items.*.sheet_refftypeid' => 'nullable|string|max:255',
            'expense_items.*.sheet_reffno' => 'nullable|string|max:255',
            // Other optional fields for new items
            'expense_items.*.sheet_name' => 'nullable|string|max:255',
            'expense_items.*.sheet_qty' => 'nullable|numeric',
            'expense_items.*.sheet_price' => 'nullable|numeric',
            'expense_items.*.sheet_netamt' => 'nullable|numeric',
            'expense_items.*.uom_id' => 'nullable|exists:uoms,id',
            'expense_items.*.uom_code' => 'nullable|string',
        ]);

        $expense = $this->repository->create($request->all());
        return response()->json(['data' => $expense], 201);
    }

    public function update(Request $request, $id)
    {
        $expense = $this->repository->find($id);
        
        if (!$expense) {
            return response()->json(['error' => 'Expense not found'], 404);
        }

        $validated = $request->validate([
            'project_id' => 'exists:projects,id',
            'contract_id' => 'exists:contracts,id',
            'order_id' => 'exists:orders,id',
            'refftype_id' => 'nullable|exists:refftypes,id',
            'expense_dt' => 'nullable|date',
            'expense_number' => 'required|string|unique:expenses,expense_number,' . $id,
            'expense_description' => 'required|string',
            'expense_pic' => 'nullable|string',
            'expensestatus_id' => 'nullable|integer|in:0,1,2,3,4',
            'expense_items' => 'nullable|array',
            'expense_items.*.id' => 'nullable|exists:ordersheets,id',
            'expense_items.*.sheet_refftypeid' => 'nullable|string|max:255',
            'expense_items.*.sheet_reffno' => 'nullable|string|max:255',
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        $expense = $this->repository->find($id);
        
        if (!$expense) {
            return response()->json(['error' => 'Expense not found'], 404);
        }

        // Before deleting expense, clear linkage in ordersheets as per point (d)
        // or should we delete the expense? The user said "existing expense items can be deleted or canceled by set value to null"
        // If the whole expense is deleted, we should unlink all items.
        \DB::transaction(function () use ($expense) {
            $expense->ordersheets()->update([
                'expenses_id' => null,
                'sheet_refftypeid' => null,
                'sheet_reffno' => null
            ]);
            $expense->delete();
        });
        
        return response()->json(['message' => 'Expense deleted and items unlinked successfully'], 200);
    }

    public function getByProject($projectId)
    {
        $expenses = $this->repository->getByProject($projectId);
        return response()->json(['data' => $expenses], 200);
    }

    public function getByContract($contractId)
    {
        $expenses = $this->repository->getByContract($contractId);
        return response()->json(['data' => $expenses], 200);
    }
}
