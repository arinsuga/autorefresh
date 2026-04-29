<?php

namespace App\Repositories\Contracts;

interface ContractOrderSummaryRepositoryInterface
{
    public function getSummaryByContract($contractId);
    public function getSummaryByProjectAndContract($projectId, $contractId);
    public function getSummaryByContractAndSheet($contractId, $sheetId);
    public function getSummaryByContractExcludingOrder($contractId, $excludeOrderId);
}
