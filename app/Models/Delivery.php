<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Delivery extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;
    protected $fillable = [
        'customer_name',
        'address',
        'lat',
        'lng',
        'deadline',
        'status',
        'vehicle_id',
        'instance_id',
        'x',
        'y',
    ];

    public function routes()
    {
        return $this->belongsToMany(Route::class)
                    ->withPivot('sequence')
                    ->withTimestamps();
    }
}
