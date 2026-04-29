<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UomNormalization extends Model
{
    protected $fillable = [
        'raw_uom_code',
        'uom_code',
        'language',
        'is_indonesian_specific'
    ];

    protected $casts = [
        'is_indonesian_specific' => 'boolean'
    ];

    /**
     * Get the contract sheets that use this normalization.
     */
    public function contractSheets()
    {
        return $this->hasMany('App\ContractSheet', 'uom_code', 'uom_code');
    }

    /**
     * Get the order sheets that use this normalization.
     */
    public function orderSheets()
    {
        return $this->hasMany('App\Ordersheet', 'uom_code', 'uom_code');
    }
}
