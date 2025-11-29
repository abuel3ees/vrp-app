<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('route_delivery', function (Blueprint $table) {
        $table->id();
        $table->foreignId('route_id')->constrained()->cascadeOnDelete();
        $table->foreignId('delivery_id')->constrained()->cascadeOnDelete();
        $table->integer('sequence')->default(0); // order in the route
        $table->timestamps();
    });
} 

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('route_delivery');
    }
};
