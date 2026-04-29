<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVendortypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vendortypes', function (Blueprint $table) {
            // Primary key
            $table->bigIncrements('id');
            
            // Vendor Type details
            $table->string('vendortype_code')->unique(); // Unique code (e.g., 'SUPPLIER', 'CONTRACTOR', 'DISTRIBUTOR')
            $table->string('vendortype_name'); // Full name (e.g., 'Supplier', 'Contractor', 'Distributor')
            $table->string('vendortype_description')->nullable(); // Detailed description
            
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
        Schema::dropIfExists('vendortypes');
    }
}
