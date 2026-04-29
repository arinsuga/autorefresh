<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface TransactionRepositoryInterface extends DataRepositoryInterface
{
    function getAllPaginated($params);
    function getByBranch($branchId);
    function getReportDetail($params);
    function getReportSummary($params);
    function findByPlateNumber($plateNumber);
}
