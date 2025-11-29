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
        Schema::create('instances', function (Blueprint $table) {
    $table->id();
    $table->string('category');
    $table->string('name');
    $table->integer('delivery_points');
    $table->integer('number_of_vehicles');
    $table->integer('max_allowed_route');
    $table->string('comment')->nullable();
    $table->integer('random_seed');
    $table->string('md5');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instances');
    }
};
