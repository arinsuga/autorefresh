<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVendorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vendors', function (Blueprint $table) {
            // Primary key
            $table->bigIncrements('id');
            
            // Vendor Type reference
            $table->bigInteger('vendortype_id'); // Foreign key to vendortypes table
            
            // Vendor identification
            $table->string('vendor_code')->unique(); // Unique vendor code
            $table->string('vendor_name'); // Vendor/supplier name
            $table->string('vendor_description')->nullable(); // Detailed description
            
            // Contact information
            $table->string('vendor_email')->nullable(); // Email address
            $table->string('vendor_phone')->nullable(); // Phone number
            $table->string('vendor_mobile')->nullable(); // Mobile number
            $table->string('vendor_fax')->nullable(); // Fax number
            
            // Address information
            $table->string('vendor_address')->nullable(); // Street address
            $table->string('vendor_city')->nullable(); // City
            $table->string('vendor_state')->nullable(); // State/Province
            $table->string('vendor_postal_code')->nullable(); // Postal code
            $table->string('vendor_country')->nullable(); // Country
            
            // Business details
            $table->string('vendor_tax_id')->nullable(); // Tax ID / VAT number
            $table->string('vendor_bank_account')->nullable(); // Bank account
            $table->string('vendor_bank_name')->nullable(); // Bank name
            
            // Status & metadata
            $table->boolean('is_active')->default(1); // Active/inactive flag
            $table->text('vendor_notes')->nullable(); // Additional notes
            
            // Timestamps
            $table->timestamps();
            
            // Foreign key constraint
            // $table->foreign('vendortype_id')->references('id')->on('vendortypes')->onDelete('restrict');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vendors');
    }
}
