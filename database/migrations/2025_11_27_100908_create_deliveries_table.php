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
    Schema::create('deliveries', function (Blueprint $table) {
        $table->id();
    $table->string('customer_name');
    $table->string('address');
    $table->decimal('lat', 10, 7);
    $table->decimal('lng', 10, 7);
    $table->timestamp('deadline')->nullable();
    $table->enum('status', ['pending', 'assigned', 'completed'])->default('pending');
    $table->foreignId('vehicle_id')->nullable()->constrained()->nullOnDelete();
    $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};
