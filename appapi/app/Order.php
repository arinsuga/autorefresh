<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'orders';

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
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
        'order_dt',
        'order_number',
        'order_description',
        'order_pic',
        'orderstatus_id',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();
        
        // Cascade delete ordersheets when order is deleted
        static::deleting(function($order) {
            $order->ordersheets()->delete();
        });
    }

    /**
     * Project that this order belongs to.
     */
    public function project()
    {
        return $this->belongsTo('App\Project', 'project_id');
    }

    /**
     * Contract that this order belongs to.
     */
    public function contract()
    {
        return $this->belongsTo('App\Contract', 'contract_id');
    }

    /**
     * Ordersheets that belong to this order.
     */
    public function ordersheets()
    {
        return $this->hasMany('App\Ordersheet', 'order_id');
    }

    /**
     * Status of the order.
     */
    public function status()
    {
        return $this->belongsTo('App\OrderStatus', 'orderstatus_id');
    }

    /**
     * Expenses that belong to this order.
     */
    public function expenses()
    {
        return $this->hasMany('App\Expense', 'order_id');
    }
}
