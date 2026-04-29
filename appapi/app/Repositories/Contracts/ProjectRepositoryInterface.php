<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface ProjectRepositoryInterface extends DataRepositoryInterface
{
    function getProjectsByActive();
    function getProjectByCode($code);
    function getAllPaginated($params);
}
