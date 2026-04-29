<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface VehicleTypeRepositoryInterface extends DataRepositoryInterface
{
    function getAllPaginated($params);
    function getActive();
}
