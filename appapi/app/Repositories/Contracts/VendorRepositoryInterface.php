<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface VendorRepositoryInterface extends DataRepositoryInterface
{
    function getVendorsByType($vendorTypeId);
    function getVendorsByActive();
    function getVendorByCode($code);
    function getAllPaginated($params);
}
