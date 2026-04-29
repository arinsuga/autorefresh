<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'payment_methods';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'payment_method_code',
        'payment_method_name',
        'is_active',
    ];

    /**
     * Transactions using this payment method.
     */
    public function transactions()
    {
        return $this->hasMany('App\Transaction', 'payment_method_id');
    }
}
