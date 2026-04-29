<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class VehicleType extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'vehicle_types';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'vehicle_type_code',
        'vehicle_type_name',
        'vehicle_type_description',
        'is_active',
    ];

    /**
     * Service types available for this vehicle type.
     */
    public function serviceTypes()
    {
        return $this->hasMany('App\ServiceType', 'vehicle_type_id');
    }

    /**
     * Transactions involving this vehicle type.
     */
    public function transactions()
    {
        return $this->hasMany('App\Transaction', 'vehicle_type_id');
    }
}
