<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'vendors';

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
        'vendortype_id',
        'vendor_code',
        'vendor_name',
        'vendor_description',
        'vendor_email',
        'vendor_phone',
        'vendor_mobile',
        'vendor_fax',
        'vendor_address',
        'vendor_city',
        'vendor_state',
        'vendor_postal_code',
        'vendor_country',
        'vendor_tax_id',
        'vendor_bank_account',
        'vendor_bank_name',
        'is_active',
        'vendor_notes',
    ];

    /**
     * Vendor type relation.
     */
    public function vendortype()
    {
        return $this->belongsTo('App\VendorType', 'vendortype_id');
    }

    /**
     * Orders that belong to this vendor.
     */
    public function orders()
    {
        return $this->hasMany('App\Order', 'vendor_id');
    }

    /**
     * Ordersheets that belong to this vendor.
     */
    public function ordersheets()
    {
        return $this->hasMany('App\Ordersheet', 'vendor_id');
    }

}
