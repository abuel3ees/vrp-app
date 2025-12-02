<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Instance;
use Illuminate\Support\Facades\Storage;

class JordanInstancesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // File: storage/app/instances_jordan.json
        $jsonPath = 'instances_jordan.json';

        if (!Storage::exists($jsonPath)) {
            $this->command?->error("File {$jsonPath} not found in storage/app");
            return;
        }

        $json = Storage::get($jsonPath);
        $decoded = json_decode($json, true);

        if (!is_array($decoded) || !isset($decoded['instances'])) {
            $this->command?->error("Invalid JSON structure in {$jsonPath}");
            return;
        }

        $instances = $decoded['instances'];

        foreach ($instances as $i) {
            Instance::create([
                // You *can* omit 'id' if you want auto-increment IDs instead.
                'id'                 => $i['id'],
                'category'           => $i['category'],
                'name'               => $i['name'],
                'delivery_points'    => $i['deliveryPoints'],
                'number_of_vehicles' => $i['numberOfVehicles'],
                'max_allowed_route'  => $i['maxAllowedRoute'],
                'comment'            => $i['comment'],
                'random_seed'        => $i['randomSeed'],
                'md5'                => $i['md5'],
            ]);
        }

        $this->command?->info('Jordan instances seeded successfully.');
    }
}