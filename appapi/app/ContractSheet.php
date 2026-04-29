<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContractSheet extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'contractsheets';

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if ($model->sheetgroup_id) {
                $sheetGroup = \App\SheetGroup::find($model->sheetgroup_id);
                if ($sheetGroup) {
                    $model->sheetgroup_seqno = $sheetGroup->sheetgroup_seqno;
                }
            }
        });
    }

    /**
     * The attributes that should be cast to native types.
     */
    protected $dates = [
        'sheet_dt',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'project_id',
        'contract_id',
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
        'sheet_grossamt2',
        'sheet_netamt2',
        'sheet_realamt',
        'uom_id',
        'uom_code',
        'sheetgroup_seqno',
        'sheet_seqno',
        'is_active',
    ];

    /**
     * Get the contract that owns this contract sheet.
     */
    public function contract()
    {
        return $this->belongsTo('App\Contract', 'contract_id');
    }

    /**
     * Get the sheet group associated with the contract sheet.
     */
    public function sheetGroup()
    {
        return $this->belongsTo('App\SheetGroup', 'sheetgroup_id');
    }

    /**
     * Ordersheets that belong to this contractsheet.
     */
    public function ordersheets()
    {
        return $this->hasMany('App\Ordersheet', 'contractsheets_id');
    }

    /**
     * Get the UOM normalization associated with the contract sheet.
     */
    public function uomNormalization()
    {
        return $this->belongsTo('App\UomNormalization', 'uom_code', 'uom_code');
    }

    /**
     * Get the order summary associated with the contract sheet.
     */
    public function orderSummary()
    {
        return $this->hasOne('App\ContractOrderSummary', 'contractsheet_id', 'id');
    }

}