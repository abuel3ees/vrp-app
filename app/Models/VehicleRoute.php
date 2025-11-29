<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleRoute extends Model
{
    protected $fillable = [
        'instance_id',
        'vehicle_number',
        'deliveries',
        'steps',
        'full_path',
        'cost',
    ];

    protected $casts = [
        'deliveries' => 'array',
        'steps' => 'array',
        'full_path' => 'array',
    ];
}
