<?php

namespace App\Repositories;

use App\ExpenseStatus;
use App\Repositories\Contracts\ExpenseStatusRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class ExpenseStatusRepository extends EloquentRepository implements ExpenseStatusRepositoryInterface
{
    public function __construct(ExpenseStatus $model)
    {
        parent::__construct($model);
    }
}
