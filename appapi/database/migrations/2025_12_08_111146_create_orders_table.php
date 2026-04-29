<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('project_id');
            $table->bigInteger('contract_id');

            $table->date('order_dt')->nullable();
            $table->string('order_number')->nullable();
            $table->string('order_description')->nullable();
            $table->string('order_pic')->nullable();
            $table->integer('orderstatus_id')->nullable()->default(0); // 0=Open, 1=approved, 2=Closed, 3=Canceled/Rejected, 4=Pending

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
        Schema::dropIfExists('orders');
    }
}
