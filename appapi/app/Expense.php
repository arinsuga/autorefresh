<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'expenses';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
        'expense_dt',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'project_id',
        'contract_id',
        'order_id',
        'expense_dt',
        'expense_number',
        'expense_description',
        'expense_pic',
        'expensestatus_id',
        'refftype_id',
    ];

    /**
     * Project that this expense belongs to.
     */
    public function project()
    {
        return $this->belongsTo('App\Project', 'project_id');
    }

    /**
     * Contract that this expense belongs to.
     */
    public function contract()
    {
        return $this->belongsTo('App\Contract', 'contract_id');
    }

    /**
     * Order that this expense is referencing.
     */
    public function order()
    {
        return $this->belongsTo('App\Order', 'order_id');
    }

    /**
     * Status of the expense.
     */
    public function status()
    {
        return $this->belongsTo('App\ExpenseStatus', 'expensestatus_id');
    }

    /**
     * Ordersheets that belong to this expense.
     */
    public function ordersheets()
    {
        return $this->hasMany('App\Ordersheet', 'expenses_id');
    }

    /**
     * ReffType that this expense belongs to.
     */
    public function refftype()
    {
        return $this->belongsTo('App\Refftype', 'refftype_id');
    }
}
