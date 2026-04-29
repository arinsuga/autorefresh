<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExpensesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('expenses', function (Blueprint $table) {

            $table->bigIncrements('id');
            $table->bigInteger('project_id');
            $table->bigInteger('contract_id');
            $table->bigInteger('order_id');
            $table->unsignedBigInteger('refftype_id')->nullable();

            $table->date('expense_dt')->nullable();
            $table->string('expense_number')->nullable();
            $table->string('expense_description')->nullable();
            $table->string('expense_pic')->nullable();
            $table->integer('expensestatus_id')->nullable()->default(0); // 0=Open, 1=approved, 2=Closed, 3=Canceled/Rejected, 4=Pending

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
        Schema::dropIfExists('expenses');
    }
}
