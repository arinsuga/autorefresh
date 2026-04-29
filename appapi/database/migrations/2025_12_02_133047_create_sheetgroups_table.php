<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSheetgroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sheetgroups', function (Blueprint $table) {
            // Primary key
            $table->bigIncrements('id');

            // Sheet group identification
            $table->string('sheetgroup_code')->unique(); // Unique code
            $table->string('sheetgroup_name'); // Group name
            $table->string('sheetgroup_description')->nullable(); // Description
            $table->integer('sheetgroup_type')->default(0); // Type classification (0=default)
            
            // Status & metadata
            $table->boolean('is_active')->default(1); // Active/inactive flag
            $table->integer('sheetgroup_seqno')->nullable(); // Order for display
            $table->text('sheetgroup_notes')->nullable(); // Additional notes
            
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
        Schema::dropIfExists('sheetgroups');
    }
}
