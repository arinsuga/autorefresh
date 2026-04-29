<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'contracts';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
        'contract_dt',
        'contract_startdt',
        'contract_enddt',
        'contract_payment_dt',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'project_id',
        'contract_name',
        'contract_description',
        'contract_number',
        'contract_pic',
        'contractstatus_id',
        'contract_progress',
        'contract_dt',
        'contract_startdt',
        'contract_enddt',
        'contract_amount',
        'contract_payment',
        'contract_payment_dt',
        'contract_payment_status',
    ];

    /**
     * Project that this contract belongs to.
     */
    public function project()
    {
        return $this->belongsTo('App\Project', 'project_id');
    }

    /**
     * Orders that belong to this contract.
     */
    public function orders()
    {
        return $this->hasMany('App\Order', 'contract_id');
    }

    /**
     * Get the status of the contract.
     */
    public function contractStatus()
    {
        return $this->belongsTo('App\ContractStatus', 'contractstatus_id');
    }

    /**
     * Contract sheets that belong to this contract.
     */
    public function contractSheets()
    {
        return $this->hasMany('App\ContractSheet', 'contract_id')->orderBy('sheetgroup_seqno', 'asc')->orderBy('sheet_seqno', 'asc');
    }

    /**
     * Summary of orders for this contract.
     */
    public function orderSummaries()
    {
        return $this->hasMany('App\ContractOrderSummary', 'contract_id');
    }

    /**
     * Expenses that belong to this contract.
     */
    public function expenses()
    {
        return $this->hasMany('App\Expense', 'contract_id');
    }

}
