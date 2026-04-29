<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface BranchRepositoryInterface extends DataRepositoryInterface
{
    function getAllPaginated($params);
    function getActive();
}
