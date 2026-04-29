<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUomsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('uoms', function (Blueprint $table) {
            // Primary key
            $table->bigIncrements('id');
            
            // UOM details
            $table->string('uom_code')->unique(); // Unique code (e.g., 'PCS', 'BOX', 'KG')
            $table->string('uom_name'); // Full name (e.g., 'Piece', 'Box', 'Kilogram')
            $table->string('uom_description')->nullable(); // Detailed description
            
            // Status & metadata
            $table->boolean('is_active')->default(1); // Active/inactive flag
            $table->integer('display_order')->nullable(); // Order for display
            
            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('uoms');
    }
}
