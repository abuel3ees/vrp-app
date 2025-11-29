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

        // The relation to an instance
        if (!Schema::hasColumn('vehicles', 'instance_id')) {
            $table->foreignId('instance_id')
                  ->after('driver_id')
                  ->constrained()
                  ->cascadeOnDelete();
        }

        if (!Schema::hasColumn('vehicles', 'name')) {
            $table->string('name')->after('instance_id');
        }

        if (!Schema::hasColumn('vehicles', 'color')) {
            $table->string('color')->after('name');
        }

        if (!Schema::hasColumn('vehicles', 'status')) {
            $table->string('status')->default('available')->after('color');
        }

        // Make plate number nullable if needed
        $table->string('plate_number')->nullable()->change();
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
