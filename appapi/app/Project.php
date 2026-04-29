<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'projects';

    /**
     * The relations to eager load on every query.
     *
     * @var array
     */
    protected $with = ['projectStatus'];

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
        'project_number',
        'project_name',
        'project_description',
        'projectstatus_id',
        'is_active',
    ];

    /**
     * Project status that this project belongs to.
     */
    public function projectStatus()
    {
        return $this->belongsTo('App\ProjectStatus', 'projectstatus_id');
    }

    /**
     * Orders that belong to this project.
     */
    public function orders()
    {
        return $this->hasMany('App\Order', 'project_id');
    }

    /**
     * Contracts that belong to this project.
     */
    public function contracts()
    {
        return $this->hasMany('App\Contract', 'project_id');
    }

    /**
     * Expenses that belong to this project.
     */
    public function expenses()
    {
        return $this->hasMany('App\Expense', 'project_id');
    }

}
