<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface OrdersheetRepositoryInterface extends DataRepositoryInterface
{
    function getOrdersheetsByOrder($orderId);
    function getOrdersheetsByOrderWithRelations($orderId, array $relations = []);
    function getOrdersheetsByExpense($expenseId);
    function getOrdersheetsByProject($projectId);
    function getOrdersheetsByContract($contractId);
    function getOrdersheetsByContractsheet($contractsheetId);
    function getOrdersheetsByVendor($vendorId);
    function getOrdersheetsBySheetgroup($sheetgroupId);
}
