<?php

namespace App\Repositories\Contracts;

use App\Repositories\Data\DataRepositoryInterface;

interface PaymentMethodRepositoryInterface extends DataRepositoryInterface
{
    function getActive();
}
