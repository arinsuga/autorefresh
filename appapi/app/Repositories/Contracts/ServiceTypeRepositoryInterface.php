<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface ServiceTypeRepositoryInterface extends DataRepositoryInterface
{
    function getAllPaginated($params);
    function getActive();
    function getByVehicleType($vehicleTypeId);
}
