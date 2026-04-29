<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VendortypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Clear existing data
        DB::table('vendortypes')->truncate();

        // Insert vendor type data
        $vendortypes = [
            [
                "id" => 1,
                'vendortype_code' => 'SUPPLIER',
                'vendortype_name' => 'Supplier',
                'vendortype_description' => 'Material and goods supplier',
                'is_active' => 1,
                'display_order' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "id" => 2,
                'vendortype_code' => 'DISTRIBUTOR',
                'vendortype_name' => 'Distributor',
                'vendortype_description' => 'Product Distributor',
                'is_active' => 1,
                'display_order' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "id" => 3,
                'vendortype_code' => 'PRODUCT',
                'vendortype_name' => 'Product Provider',
                'vendortype_description' => 'Product Provider',
                'is_active' => 1,
                'display_order' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "id" => 4,
                'vendortype_code' => 'SERVICE',
                'vendortype_name' => 'Service Provider',
                'vendortype_description' => 'Professional services provider',
                'is_active' => 1,
                'display_order' => 40,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "id" => 5,
                'vendortype_code' => 'LOGISTICS',
                'vendortype_name' => 'Logistics Provider',
                'vendortype_description' => 'Transportation and logistics company',
                'is_active' => 1,
                'display_order' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "id" => 6,
                'vendortype_code' => 'CONTRACTOR',
                'vendortype_name' => 'Contractor',
                'vendortype_description' => 'contractor or subcontractor',
                'is_active' => 1,
                'display_order' => 60,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                "id" => 7,
                'vendortype_code' => 'CONSULTANT',
                'vendortype_name' => 'Consultant',
                'vendortype_description' => 'consultant',
                'is_active' => 1,
                'display_order' => 70,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('vendortypes')->insert($vendortypes);
    }
}
