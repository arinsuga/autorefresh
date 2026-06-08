<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'branches';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'branch_code',
        'branch_name',
        'branch_address',
        'branch_phone',
        'branch_email',
        'branch_logo',
        'branch_latitude',
        'branch_longitude',
        'is_active',
    ];

    /**
     * Transactions recorded at this branch.
     */
    public function transactions()
    {
        return $this->hasMany('App\Transaction', 'branch_id');
    }
}
