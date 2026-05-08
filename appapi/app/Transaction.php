<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'transactions';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
        'transaction_dt',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'branch_id',
        'transaction_dt',
        'transaction_number',
        'plate_number',
        'vehicle_type_id',
        'customer_name',
        'customer_phone',
        'gross_total',
        'discount',
        'net_total',
        'payment_method_id',
        'transaction_photo',
        'created_by',
    ];

    /**
     * Boot the model — cascade delete transaction_services.
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($transaction) {
            $transaction->transactionServices()->delete();
        });
    }

    /**
     * Branch where this transaction was created.
     */
    public function branch()
    {
        return $this->belongsTo('App\Branch', 'branch_id');
    }

    /**
     * Vehicle type of this transaction.
     */
    public function vehicleType()
    {
        return $this->belongsTo('App\VehicleType', 'vehicle_type_id');
    }

    /**
     * Payment method used in this transaction.
     */
    public function paymentMethod()
    {
        return $this->belongsTo('App\PaymentMethod', 'payment_method_id');
    }

    /**
     * Services included in this transaction.
     */
    public function transactionServices()
    {
        return $this->hasMany('App\TransactionService', 'transaction_id');
    }

    /**
     * Get full URL for the transaction photo using Filex helper.
     *
     * @param  string  $value
     * @return string
     */
    public function getTransactionPhotoAttribute($value)
    {
        return \Arins\Facades\Filex::image($value);
    }
}
