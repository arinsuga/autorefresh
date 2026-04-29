<?php

namespace App\Repositories;

use App\PaymentMethod;
use App\Repositories\Contracts\PaymentMethodRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class PaymentMethodRepository extends EloquentRepository implements PaymentMethodRepositoryInterface
{
    public function getActive()
    {
        return $this->data->where('is_active', 1)->orderBy('payment_method_name')->get();
    }
}
