<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface VendorTypeRepositoryInterface extends DataRepositoryInterface
{
    function getVendorTypesByActive();
    function getVendorTypeByCode($code);
    function getAllPaginated($params);
}
