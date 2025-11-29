<?php

namespace Database\Seeders;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Instance;
use Illuminate\Support\Facades\Storage;

class InstancesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
{
    $json = Storage::get('instances.json');
    $instances = json_decode($json, true)['instances'];

    foreach ($instances as $i) {
        Instance::create([
            'id' => $i['id'],
            'category' => $i['category'],
            'name' => $i['name'],
            'delivery_points' => $i['deliveryPoints'],
            'number_of_vehicles' => $i['numberOfVehicles'],
            'max_allowed_route' => $i['maxAllowedRoute'],
            'comment' => $i['comment'],
            'random_seed' => $i['randomSeed'],
            'md5' => $i['md5'],
        ]);
    }
}
}
