<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;
    protected $fillable = [
        'driver_id',
        'plate_number',
        'capacity',
        'model',
        'instance_id',
        'name',
        'color',
        'status',
        
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function routes()
    {
        return $this->hasMany(Route::class);
    }
}
