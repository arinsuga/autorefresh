<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRefftypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('refftypes', function (Blueprint $table) {
            // Primary key
            $table->bigIncrements('id');
            
            // Reff Type details
            $table->string('refftype_code')->unique(); // Unique code (e.g., 'PO', 'SPK', 'INV')
            $table->string('refftype_name'); // Full name (e.g., 'Purchase Order', 'Service Package Kit')
            $table->string('refftype_description')->nullable(); // Detailed description
            
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
        Schema::dropIfExists('refftypes');
    }
}
