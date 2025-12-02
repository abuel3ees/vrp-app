<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\JordanInstancesSeeder;
use Database\Seeders\InstancesSeeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            JordanInstancesSeeder::class,
            InstancesSeeder::class,
        ]);

        User::firstOrCreate(
            ['email' => 'a@a.com'],
            [
                'first_name' => 'Test User',
                'last_name' => 'Admin',
                'password' => bcrypt('12345678'),
                'email_verified_at' => now(),
            ]
        );
    }
}
