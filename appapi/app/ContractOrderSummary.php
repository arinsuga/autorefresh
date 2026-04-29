<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContractOrderSummary extends Model
{
    protected $table = 'view_contract_order_summary';
    
    // Read-only model
    public $timestamps = false;
    protected $guarded = ['*'];

    protected $appends = ['balance'];


    /**
     * Calculate balance: contract_amount - order_amount.
     */
    public function getBalanceAttribute()
    {
        return $this->contract_amount - ($this->attributes['order_amount'] ?? 0);
    }

    /**
     * Contract that this summary belongs to.
     */
    public function contract()
    {
        return $this->belongsTo('App\Contract', 'contract_id');
    }
}
