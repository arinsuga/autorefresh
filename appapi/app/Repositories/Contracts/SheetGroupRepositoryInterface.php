<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface SheetGroupRepositoryInterface extends DataRepositoryInterface
{
    function getSheetGroupsByType($type);
    function getSheetGroupsByActive();
    function getSheetGroupByCode($code);
    function getAllPaginated($params);
}
