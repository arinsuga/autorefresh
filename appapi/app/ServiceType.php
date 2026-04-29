<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServiceType extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'service_types';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'vehicle_type_id',
        'service_code',
        'service_name',
        'service_price',
        'service_description',
        'is_active',
    ];

    /**
     * Vehicle type that this service belongs to.
     */
    public function vehicleType()
    {
        return $this->belongsTo('App\VehicleType', 'vehicle_type_id');
    }

    /**
     * Transaction services using this service type.
     */
    public function transactionServices()
    {
        return $this->hasMany('App\TransactionService', 'service_type_id');
    }
}
