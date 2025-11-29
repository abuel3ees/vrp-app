<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instance extends Model
{
    protected $fillable = [
        'category',
        'name',
        'delivery_points',
        'number_of_vehicles',
        'max_allowed_route',
        'comment',
        'random_seed',
        'md5'
    ];

    public function deliveries()
{
    return $this->hasMany(\App\Models\Delivery::class, 'instance_id');
}
}
