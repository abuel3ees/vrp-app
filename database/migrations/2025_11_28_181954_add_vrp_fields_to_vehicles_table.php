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
         Schema::table('vehicles', function (Blueprint $table) {
        $table->foreignId('instance_id')->after('driver_id')->constrained()->cascadeOnDelete();
        $table->string('name')->after('instance_id');
        $table->string('color')->after('name');
        $table->string('status')->default('available')->after('color');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            //
        });
    }
};
