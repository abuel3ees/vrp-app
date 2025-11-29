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
        Schema::table('routes', function (Blueprint $table) {
    $table->foreignId('instance_id')
          ->nullable()
          ->after('id')
          ->constrained('instances')
          ->cascadeOnDelete();

    $table->json('deliveries')
          ->nullable()
          ->after('vehicle_id');

    $table->json('path')
          ->nullable()
          ->after('deliveries');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('routes', function (Blueprint $table) {
            //
        });
    }
};
