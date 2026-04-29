<?php

use Illuminate\Database\Seeder;

class RefftypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Clear existing data
        DB::table('refftypes')->truncate();

        // Insert reference type data
        $refftypes = [
            [
                'id' => 1,
                'refftype_code' => 'PO',
                'refftype_name' => 'PO',
                'refftype_description' => 'Purchase Order document',
                'is_active' => 1,
                'display_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'refftype_code' => 'SPK',
                'refftype_name' => 'SPK',
                'refftype_description' => 'Work Order document',
                'is_active' => 1,
                'display_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('refftypes')->insert($refftypes);
    }
}
use Illuminate\Support\Facades\DB;
