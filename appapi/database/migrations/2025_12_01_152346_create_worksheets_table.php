<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorksheetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('worksheets', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('project_id');
            $table->bigInteger('contract_id');
            $table->bigInteger('contractsheets_id');

            $table->date('sheet_dt')->nullable();
            $table->integer('sheet_type')->default(0); // 0=header, 1=item
            $table->bigInteger('sheetgroup_id');
            $table->integer('sheetheader_id')->nullable();
            $table->string('sheet_code')->nullable();

            $table->string('sheet_name')->nullable();
            $table->string('sheet_description')->nullable();
            $table->string('sheet_notes')->nullable();

            $table->decimal('sheet_qty', 10, 2)->nullable();
            $table->decimal('sheet_price', 10, 2)->nullable();
            $table->decimal('sheet_grossamt', 10, 2)->nullable();
            $table->decimal('sheet_discountrate', 10, 2)->nullable();
            $table->decimal('sheet_discountvalue', 10, 2)->nullable();
            $table->decimal('sheet_taxrate', 10, 2)->nullable();
            $table->decimal('sheet_taxvalue', 10, 2)->nullable();
            $table->decimal('sheet_netamt', 10, 2)->nullable();

            $table->string('uom_id')->nullable();
            $table->string('uom_name')->nullable();

            $table->date('sheet_payment_dt')->nullable();
            $table->string('sheet_payment_status')->nullable();

            $table->bigInteger('vendortype_id')->nullable();
            $table->string('vendortype_name')->nullable();
            $table->bigInteger('vendor_id')->nullable();
            $table->string('vendor_name')->nullable();
            
            $table->string('sheet_refftypeid')->nullable();
            $table->string('sheet_reffno')->nullable();

            $table->bigInteger('order_id');
            $table->string('order_code')->nullable();
            $table->date('order_dt')->nullable();

            $table->bigInteger('sheetgroup_seqno')->nullable();
            $table->bigInteger('sheet_seqno')->nullable();
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
        Schema::dropIfExists('worksheets');
    }
}
