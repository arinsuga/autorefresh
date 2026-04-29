<?php

namespace App\Http\Controllers;

use App\Contract;
use App\ContractOrderSummary;
use App\ContractSheet;
use App\Ordersheet;
use App\SheetGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function orderRecap(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'contract_id' => 'required|exists:contracts,id',
        ]);

        $projectId = $request->input('project_id');
        $contractId = $request->input('contract_id');

        // Fetch Project and Contract details
        $contract = Contract::with('project')->findOrFail($contractId);
        $project = $contract->project;

        // Fetch all active SheetGroups, ordered by sequence or code
        // User example shows rows A to H, which implies specific ordering.
        // We'll order by sheetgroup_seqno if available, else code.
        $sheetGroups = SheetGroup::where('is_active', 1)
            ->where('sheetgroup_type', 0)
            ->orderBy('sheetgroup_seqno')
            ->orderBy('sheetgroup_code')
            ->get();

        // Calculate RAP (Contract Sheets) and Project Expenses (Order Sheets) by Sheet Group
        // Use ContractOrderSummary which is based on view_contract_order_summary
        // This ensures only sheet_type = 1 (Unit Price) items are included.
        $summaryData = ContractOrderSummary::where('project_id', $projectId)
            ->where('contract_id', $contractId)
            ->select(
                'sheetgroup_id',
                DB::raw('SUM(contract_amount) as total_rap'),
                DB::raw('SUM(order_amount) as total_expense')
            )
            ->groupBy('sheetgroup_id')
            ->get()
            ->keyBy('sheetgroup_id');

        $rapData = $summaryData->map->total_rap;
        $expenseData = $summaryData->map->total_expense;

        $reportRows = [];
        $totalRap = 0;
        $totalExpense = 0;
        $totalBalance = 0;

        foreach ($sheetGroups as $group) {
            $rap = $rapData->get($group->id, 0);
            $expense = $expenseData->get($group->id, 0);
            $balance = $rap - $expense; // Column G

            // Weights
            $expenseWeight = $rap != 0 ? ($expense / $rap) * 100 : 0; // Column D
            $balanceWeight = $rap != 0 ? ($balance / $rap) * 100 : 0; // Column F

            $totalRap += $rap;
            $totalExpense += $expense;
            $totalBalance += $balance;

            $reportRows[] = [
                'sheetgroup_id' => $group->id,
                'code' => $group->sheetgroup_code, // Column A
                'name' => $group->sheetgroup_name, // Column B
                'rap_amount' => $rap, // Column C
                'expense_weight' => $expenseWeight, // Column D
                'expense_amount' => $expense, // Column E
                'balance_weight' => $balanceWeight, // Column F
                'balance_amount' => $balance, // Column G
            ];
        }

        // Project Info for Header
        $header = [
            'project_name' => $project->project_name, // Nama Proyek
            'project_address' => $project->project_address, // Alamat Proyek
            'project_number' => $project->project_number, // Nomor Proyek
            'schedule' => null, // Jadwal Pekerjaan => null
            'period' => ($project->project_startdt && $project->project_enddt) 
                ? $project->project_startdt . ' s/d ' . $project->project_enddt 
                : '-', // Periode s/d
        ];

        return response()->json([
            'header' => $header,
            'rows' => $reportRows,
            'totals' => [
                'rap' => $totalRap,
                'expense' => $totalExpense,
                'balance' => $totalBalance,
            ]
        ]);
    }
}
