<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicle_routes', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('instance_id');
    $table->integer('vehicle_number');
    $table->json('deliveries');
    $table->json('steps');
    $table->json('full_path');
    $table->double('cost');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_routes');
    }
};
