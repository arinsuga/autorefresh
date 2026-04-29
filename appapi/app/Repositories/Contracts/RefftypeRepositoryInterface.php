<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface RefftypeRepositoryInterface extends DataRepositoryInterface
{

    function getRefftypesByActive();
    function getRefftypeByCode($code);
    function getAllPaginated($params);
}
