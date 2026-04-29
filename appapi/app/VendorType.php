<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class VendorType extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'vendortypes';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'vendortype_code',
        'vendortype_name',
        'vendortype_description',
        'is_active',
        'display_order',
    ];

    /**
     * Vendors of this type.
     */
    public function vendors()
    {
        return $this->hasMany('App\Vendor', 'vendortype_id');
    }
}
