<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateViewContractOrderSummary extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("DROP VIEW IF EXISTS view_contract_order_summary");
        DB::statement("
            CREATE VIEW view_contract_order_summary AS
            SELECT 
                cs.project_id,
                p.project_number,
                p.project_name,
                cs.contract_id,
                c.contract_number,
                cs.id AS contractsheet_id,
                cs.sheetgroup_type,
                cs.sheetgroup_id,
                sg.sheetgroup_code,
                cs.sheet_code,
                cs.sheet_name,
                cs.uom_id,
                cs.uom_code,
                cs.sheet_netamt AS contract_amount,
                SUM(IFNULL(os.sheet_netamt, 0)) AS order_amount,
                cs.sheet_netamt - SUM(IFNULL(os.sheet_netamt, 0)) AS available_amount
            FROM 
                contractsheets cs
            JOIN 
                projects p ON cs.project_id = p.id
            JOIN 
                contracts c ON cs.contract_id = c.id
            LEFT JOIN 
                sheetgroups sg ON cs.sheetgroup_id = sg.id
            LEFT JOIN 
                ordersheets os ON os.contractsheets_id = cs.id AND os.sheet_type = 1
            WHERE 
                cs.sheet_type = 1
            GROUP BY 
                cs.project_id,
                p.project_number,
                p.project_name,
                cs.contract_id,
                c.contract_number,
                cs.id,
                cs.sheetgroup_type,
                cs.sheetgroup_id,
                sg.sheetgroup_code,
                cs.sheet_code,
                cs.sheet_name,
                cs.uom_id,
                cs.uom_code,
                cs.sheet_netamt
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("DROP VIEW IF EXISTS view_contract_order_summary");
    }
}
