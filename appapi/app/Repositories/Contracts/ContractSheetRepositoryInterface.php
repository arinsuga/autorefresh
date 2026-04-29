<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface ContractSheetRepositoryInterface extends DataRepositoryInterface
{
    function getContractSheetsByContract($contractId);
}
