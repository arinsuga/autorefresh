<?php

namespace App\Repositories;

use App\Repositories\Contracts\ContractOrderSummaryRepositoryInterface;
use App\ContractOrderSummary;

class ContractOrderSummaryRepository implements ContractOrderSummaryRepositoryInterface
{
    protected $model;

    public function __construct(ContractOrderSummary $model)
    {
        $this->model = $model;
    }

    public function getSummaryByContract($contractId)
    {
        return $this->model->where('contract_id', $contractId)->get();
    }

    public function getSummaryByContractAndSheet($contractId, $sheetId)
    {
        return $this->model->where('contract_id', $contractId)
                          ->where('contractsheet_id', $sheetId)
                          ->first();
    }

    public function getSummaryByProjectAndContract($projectId, $contractId)
    {
        return $this->model->where('project_id', $projectId)
                          ->where('contract_id', $contractId)
                          ->get();
    }

    public function getSummaryByContractExcludingOrder($contractId, $excludeOrderId)
    {
        // 1. Get the total summary for all orders from the view (cached/pre-calculated by the database engine)
        $summaries = $this->model->where('contract_id', $contractId)->get();

        // 2. Get the specific amounts for the order we want to exclude
        $orderItems = \DB::table('ordersheets')
            ->select('contractsheets_id', 'sheet_netamt')
            ->where('order_id', $excludeOrderId)
            ->where('sheet_type', 1)
            ->get()
            ->keyBy('contractsheets_id');

        // 3. Adjust the totals to "exclude" the current order's amounts
        foreach ($summaries as $summary) {
            $itemId = $summary->contractsheet_id;
            $currentOrderAmt = isset($orderItems[$itemId]) ? (float)$orderItems[$itemId]->sheet_netamt : 0;
            
            // Subtract current order's amount from the total order amount
            $summary->order_amount = (float)$summary->order_amount - $currentOrderAmt;
            
            // Recalculate available amount: Total Contract - (Total Order - Current Order)
            $summary->available_amount = (float)$summary->contract_amount - $summary->order_amount;
        }

        return $summaries;
    }
}

