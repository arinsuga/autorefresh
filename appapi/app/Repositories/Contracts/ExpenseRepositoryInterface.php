<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface ExpenseRepositoryInterface extends DataRepositoryInterface
{
    function getByProject($projectId);
    function getByContract($contractId);
    function getAllPaginated($params);
}
