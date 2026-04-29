<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface ContractRepositoryInterface extends DataRepositoryInterface
{
    function getContractByCode($code);
    function findWithSheets($id);
    function getAllPaginated($params);
}
