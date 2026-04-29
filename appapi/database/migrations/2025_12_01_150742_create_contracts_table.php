<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('project_id');
            $table->string('contract_name')->nullable();
            $table->string('contract_description')->nullable();
            $table->string('contract_number')->nullable();
            $table->string('contract_pic')->nullable();
            $table->integer('contractstatus_id')->default(0); // 0=Open, 1=approved, 2=Closed, 3=Canceled/Rejected, 4=Pending
            $table->decimal('contract_progress', 5, 2)->nullable();

            $table->date('contract_dt')->nullable();
            $table->date('contract_startdt')->nullable();
            $table->date('contract_enddt')->nullable();

            $table->date('contract_payment_dt')->nullable();
            $table->decimal('contract_amount', 20, 2)->nullable();
            $table->decimal('contract_payment', 20, 2)->nullable();
            $table->string('contract_payment_status')->nullable();
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
        Schema::dropIfExists('contracts');
    }
}
