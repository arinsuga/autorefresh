<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersheetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ordersheets', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('project_id');
            $table->bigInteger('contract_id');
            $table->bigInteger('contractsheets_id');
            $table->bigInteger('expenses_id')->nullable();

            $table->date('sheet_dt')->nullable();
            $table->integer('sheet_type')->default(1); // 0=header, 1=item
            $table->integer('sheetgroup_type')->default(0); // 0=work, 1=cost
            $table->bigInteger('sheetgroup_id'); // base on table sheetgroups
            $table->integer('sheetheader_id')->nullable();
            $table->string('sheet_code')->nullable();

            $table->string('sheet_name')->nullable();
            $table->string('sheet_description')->nullable();
            $table->string('sheet_notes')->nullable();

            $table->decimal('sheet_qty', 20, 2)->nullable();
            $table->decimal('sheet_price', 20, 2)->nullable();
            $table->decimal('sheet_grossamt', 20, 2)->nullable();
            $table->decimal('sheet_discountrate', 5, 2)->nullable();
            $table->decimal('sheet_discountvalue', 20, 2)->nullable();
            $table->decimal('sheet_taxrate', 5, 2)->nullable();
            $table->decimal('sheet_taxvalue', 20, 2)->nullable();
            $table->decimal('sheet_netamt', 20, 2)->nullable();

            $table->bigInteger('uom_id')->nullable();
            $table->string('uom_code')->nullable();

            $table->date('sheet_payment_dt')->nullable();
            $table->string('sheet_payment_status')->nullable();

            $table->bigInteger('vendortype_id')->nullable();
            $table->string('vendortype_name')->nullable();
            $table->bigInteger('vendor_id')->nullable();
            $table->string('vendor_name')->nullable();
            
            $table->string('sheet_refftypeid')->nullable(); // base on table refftypes ( PO, WO, INV, DN, PR, GRN )
            $table->string('sheet_reffno')->nullable(); // refftypes number

            $table->bigInteger('order_id');
            $table->string('order_number')->nullable();
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
        Schema::dropIfExists('ordersheets');
    }
}
