<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrdersheetsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Fetch the 10 orders we just created
        $orders = DB::table('orders')->take(10)->get();
        $sheets = [];

        foreach ($orders as $order) {
            for ($i = 1; $i <= 10; $i++) {
                $qty = rand(1, 100);
                $price = rand(100, 10000);
                $gross = $qty * $price;
                $taxRate = 11;
                $taxValue = $gross * ($taxRate / 100);
                $net = $gross + $taxValue;

                $sheets[] = [
                    'project_id' => $order->project_id,
                    'contract_id' => $order->contract_id,
                    // Assuming contractsheets exist, referencing a dummy ID. 
                    // Since no FK constraint was explicitly seen in the migration provided, any int is fine.
                    // We'll map it sequentially or randomly.
                    'contractsheets_id' => rand(1, 50), 
                    
                    'sheet_dt' => $order->order_dt,
                    'sheet_type' => 1, // 1 for Item
                    'sheetgroup_type' => 0,
                    
                    // Default values for group/header
                    'sheetgroup_id' => 1, 
                    'sheetheader_id' => 0, 

                    'sheet_code' => $order->order_number . '-ITM-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                    'sheet_name' => 'Order Item ' . $i,
                    'sheet_description' => 'Description for Order Item ' . $i . ' of ' . $order->order_number,
                    'sheet_notes' => 'Standard delivery terms apply.',
                    
                    'sheet_qty' => $qty,
                    'sheet_price' => $price,
                    'sheet_grossamt' => $gross,
                    'sheet_discountrate' => 0.00,
                    'sheet_discountvalue' => 0.00,
                    'sheet_taxrate' => $taxRate,
                    'sheet_taxvalue' => $taxValue,
                    'sheet_netamt' => $net,

                    'uom_id' => 1, // PCS
                    'uom_code' => 'Pieces',

                    'sheet_payment_dt' => null,
                    'sheet_payment_status' => 'Pending',

                    'vendortype_id' => 1,
                    'vendortype_name' => 'Material Supplier',
                    'vendor_id' => 1,
                    'vendor_name' => 'Global Materials Inc.',
                    
                    'sheet_refftypeid' => '',
                    'sheet_reffno' => '',

                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'order_dt' => $order->order_dt,

                    'sheetgroup_seqno' => 1,
                    'sheet_seqno' => $i,
                    
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Insert in chunks
        foreach (array_chunk($sheets, 50) as $chunk) {
            DB::table('ordersheets')->insert($chunk);
        }
    }
}
