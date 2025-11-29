<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;
    protected $fillable = [
        'vehicle_id',
        'total_distance',
        'total_time',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function deliveries()
    {
        return $this->belongsToMany(Delivery::class)
                    ->withPivot('sequence')
                    ->orderBy('pivot_sequence');
    }
}