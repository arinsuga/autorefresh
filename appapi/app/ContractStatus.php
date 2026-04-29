<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContractStatus extends Model
{
    protected $table = 'contractstatuses';
    
    protected $fillable = ['name', 'description'];
}
