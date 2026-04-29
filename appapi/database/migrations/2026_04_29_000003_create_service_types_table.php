<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServiceTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_types', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('vehicle_type_id');
            $table->string('service_code')->unique();
            $table->string('service_name')->unique();
            $table->decimal('service_price', 15, 2)->default(0);
            $table->text('service_description')->nullable();
            $table->boolean('is_active')->default(1); // 1=active, 0=inactive

            $table->foreign('vehicle_type_id')
                  ->references('id')
                  ->on('vehicle_types')
                  ->onDelete('cascade');

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
        Schema::dropIfExists('service_types');
    }
}
