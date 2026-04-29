<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIndexesToContractAndOrdersheets extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('contractsheets', function (Blueprint $table) {
            $table->index('contract_id');
            $table->index('project_id');
            $table->index('sheet_type');
            $table->index('is_active');
        });

        Schema::table('ordersheets', function (Blueprint $table) {
            $table->index('contractsheets_id');
            $table->index('order_id');
            $table->index('sheet_type');
            $table->index('contract_id');
            $table->index('project_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contractsheets', function (Blueprint $table) {
            $table->dropIndex(['contract_id']);
            $table->dropIndex(['project_id']);
            $table->dropIndex(['sheet_type']);
            $table->dropIndex(['is_active']);
        });

        Schema::table('ordersheets', function (Blueprint $table) {
            $table->dropIndex(['contractsheets_id']);
            $table->dropIndex(['order_id']);
            $table->dropIndex(['sheet_type']);
            $table->dropIndex(['contract_id']);
            $table->dropIndex(['project_id']);
        });
    }
}
