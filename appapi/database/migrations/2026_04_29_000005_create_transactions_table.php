<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('branch_id');
            $table->date('transaction_dt');
            $table->string('transaction_number')->unique();
            $table->string('plate_number');
            $table->unsignedBigInteger('vehicle_type_id');
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->decimal('gross_total', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('net_total', 15, 2)->default(0);
            $table->unsignedBigInteger('payment_method_id');
            $table->string('transaction_photo')->nullable();
            $table->string('created_by')->nullable();

            $table->foreign('branch_id')
                  ->references('id')
                  ->on('branches')
                  ->onDelete('restrict');

            $table->foreign('vehicle_type_id')
                  ->references('id')
                  ->on('vehicle_types')
                  ->onDelete('restrict');

            $table->foreign('payment_method_id')
                  ->references('id')
                  ->on('payment_methods')
                  ->onDelete('restrict');

            $table->index(['branch_id', 'transaction_dt']);
            $table->index('plate_number');

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
        Schema::dropIfExists('transactions');
    }
}
