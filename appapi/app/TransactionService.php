<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TransactionService extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'transaction_services';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'transaction_id',
        'service_type_id',
        'service_price',
    ];

    /**
     * Transaction that owns this service item.
     */
    public function transaction()
    {
        return $this->belongsTo('App\Transaction', 'transaction_id');
    }

    /**
     * Service type used in this transaction item.
     */
    public function serviceType()
    {
        return $this->belongsTo('App\ServiceType', 'service_type_id');
    }
}
