<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ordersheet extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ordersheets';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
        'sheet_dt',
        'sheet_payment_dt',
        'order_dt',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'project_id',
        'contract_id',
        'contractsheets_id',
        'expenses_id',
        'sheet_dt',
        'sheet_type',
        'sheetgroup_type',
        'sheetgroup_id',
        'sheetheader_id',
        'sheet_code',
        'sheet_name',
        'sheet_description',
        'sheet_notes',
        'sheet_qty',
        'sheet_price',
        'sheet_grossamt',
        'sheet_discountrate',
        'sheet_discountvalue',
        'sheet_taxrate',
        'sheet_taxvalue',
        'sheet_netamt',
        'uom_id',
        'uom_code',
        'sheet_payment_dt',
        'sheet_payment_status',
        'vendortype_id',
        'vendortype_name',
        'vendor_id',
        'vendor_name',
        'sheet_refftypeid',
        'sheet_reffno',
        'order_id',
        'order_number',
        'order_dt',
        'sheetgroup_seqno',
        'sheet_seqno',
    ];

    /**
     * Project that this ordersheet belongs to.
     */
    public function project()
    {
        return $this->belongsTo('App\Project', 'project_id');
    }

    /**
     * Contract that this ordersheet belongs to.
     */
    public function contract()
    {
        return $this->belongsTo('App\Contract', 'contract_id');
    }

    /**
     * ContractSheet that this ordersheet belongs to.
     */
    public function contractsheet()
    {
        return $this->belongsTo('App\ContractSheet', 'contractsheets_id');
    }

    /**
     * Order that this ordersheet belongs to.
     */
    public function order()
    {
        return $this->belongsTo('App\Order', 'order_id');
    }

    /**
     * SheetGroup that this ordersheet belongs to.
     */
    public function sheetgroup()
    {
        return $this->belongsTo('App\SheetGroup', 'sheetgroup_id');
    }

    /**
     * VendorType that this ordersheet belongs to.
     */
    public function vendortype()
    {
        return $this->belongsTo('App\VendorType', 'vendortype_id');
    }

    /**
     * Vendor that this ordersheet belongs to.
     */
    public function vendor()
    {
        return $this->belongsTo('App\Vendor', 'vendor_id');
    }

    /**
     * Get the UOM normalization associated with the order sheet.
     */
    public function uomNormalization()
    {
        return $this->belongsTo('App\UomNormalization', 'uom_code', 'uom_code');
    }

    /**
     * Expense that this ordersheet belongs to.
     */
    public function expense()
    {
        return $this->belongsTo('App\Expense', 'expenses_id');
    }

}
