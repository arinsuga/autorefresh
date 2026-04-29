<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUomNormalizationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('uom_normalizations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('raw_uom_code', 255); // raw_uom_code
            $table->string('uom_code', 255); // uom_code
            $table->string('language', 10)->default('en'); // 'en', 'id', 'mixed'
            $table->boolean('is_indonesian_specific')->default(0);
            $table->timestamps();
            
            // Indexes for performance
            $table->unique('raw_uom_code');
            $table->index('language');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('uom_normalizations');
    }
}
