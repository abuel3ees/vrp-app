<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\Delivery;
use App\Models\Route;

class DataSeeder extends Seeder
{
    public function run(): void
    {
        // CLEAR TABLES IN SQLITE SAFE WAY
        Driver::query()->delete();
        Vehicle::query()->delete();
        Delivery::query()->delete();
        Route::query()->delete();

        // -------------------------
        // DRIVERS
        // -------------------------
        $drivers = [];
        for ($i = 1; $i <= 5; $i++) {
            $drivers[] = Driver::create([
                'name' => "Driver $i",
                'phone' => "07900000$i",
            ]);
        }

        // -------------------------
        // VEHICLES
        // -------------------------
        $vehicles = [];
        for ($i = 1; $i <= 5; $i++) {
            $vehicles[] = Vehicle::create([
                'driver_id' => $drivers[array_rand($drivers)]->id,
                'plate_number' => "ABC-10$i",
                'capacity' => rand(200, 2000),
                'model' => "Model $i",
            ]);
        }

        // -------------------------
        // DELIVERIES
        // -------------------------
        $deliveries = [];
        for ($i = 1; $i <= 10; $i++) {
            $deliveries[] = Delivery::create([
                'vehicle_id' => $vehicles[array_rand($vehicles)]->id,
                'customer_name' => "Customer $i",
                'address' => "Amman Street $i",
                'lat' => 31.95 + ($i * 0.001),
                'lng' => 35.91 + ($i * 0.001),
                'status' => ['pending', 'in_transit', 'completed'][array_rand(['pending','in_transit','completed'])],
            ]);
        }

        // -------------------------
        // ROUTES (NO PIVOT)
        // -------------------------
        for ($i = 1; $i <= 5; $i++) {
            Route::create([
                'vehicle_id' => $vehicles[array_rand($vehicles)]->id,
                'total_distance' => rand(5, 50),
                'total_time' => rand(10, 90),
            ]);
        }

        echo "\n✔ SIMPLE DataSeeder completed.\n";
    }
}