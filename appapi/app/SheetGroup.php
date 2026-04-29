<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SheetGroup extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'sheetgroups';

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
        'sheetgroup_code',
        'sheetgroup_name',
        'sheetgroup_description',
        'sheetgroup_type',
        'is_active',
        'sheetgroup_seqno',
        'sheetgroup_notes',
    ];

    /**
     * Get the contract sheets for the sheet group.
     */
    public function contractSheets()
    {
        return $this->hasMany('App\ContractSheet', 'sheetgroup_id');
    }

    /**
     * Get the order sheets for the sheet group.
     */
    public function orderSheets()
    {
        return $this->hasMany('App\Ordersheet', 'sheetgroup_id');
    }

}
