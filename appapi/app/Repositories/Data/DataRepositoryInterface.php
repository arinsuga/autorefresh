<?php

namespace App\Repositories\Data;

interface DataRepositoryInterface
{
    function all();
    function first();
    function find($parId);
    function create($parData);
    function bulkCreate($parData);
    function update($parId, $parData);
    function delete($parId);

}