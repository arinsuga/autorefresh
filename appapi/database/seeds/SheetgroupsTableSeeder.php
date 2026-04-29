<?php

use Illuminate\Database\Seeder;

class SheetgroupsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sheetgroups = [
            // Type 0: Work Categories
            [
                "id" => 1,
                'sheetgroup_code' => 'A',
                'sheetgroup_name' => 'PREPARATION WORK',
                'sheetgroup_description' => 'Preparation and site preparation work',
                'sheetgroup_type' => 0,
                'is_active' => 1,
                'sheetgroup_seqno' => 100,
            ],
            [
                "id" => 2,
                'sheetgroup_code' => 'B',
                'sheetgroup_name' => 'DEMOLISH WORK',
                'sheetgroup_description' => 'Demolition and removal work',
                'sheetgroup_type' => 0,
                'is_active' => 1,
                'sheetgroup_seqno' => 200,
            ],
            [
                "id" => 3,
                'sheetgroup_code' => 'C',
                'sheetgroup_name' => 'CIVIL WORK',
                'sheetgroup_description' => 'Civil construction work',
                'sheetgroup_type' => 0,
                'is_active' => 1,
                'sheetgroup_seqno' => 300,
            ],
            [
                "id" => 4,
                'sheetgroup_code' => 'D',
                'sheetgroup_name' => 'FINISHING WORK',
                'sheetgroup_description' => 'Finishing and surface work',
                'sheetgroup_type' => 0,
                'is_active' => 1,
                'sheetgroup_seqno' => 400,
            ],
            [
                "id" => 5,
                'sheetgroup_code' => 'E',
                'sheetgroup_name' => 'MEP WORK',
                'sheetgroup_description' => 'Mechanical, Electrical, Plumbing work',
                'sheetgroup_type' => 0,
                'is_active' => 1,
                'sheetgroup_seqno' => 500,
            ],
            [
                "id" => 6,
                'sheetgroup_code' => 'F',
                'sheetgroup_name' => 'INTERIOR WORK',
                'sheetgroup_description' => 'Interior decoration and design work',
                'sheetgroup_type' => 0,
                'is_active' => 1,
                'sheetgroup_seqno' => 600,
            ],
            [
                "id" => 7,
                'sheetgroup_code' => 'G',
                'sheetgroup_name' => 'LANDSCAPE',
                'sheetgroup_description' => 'Landscape and outdoor work',
                'sheetgroup_type' => 0,
                'is_active' => 1,
                'sheetgroup_seqno' => 700,
            ],
            [
                "id" => 8,
                'sheetgroup_code' => 'H',
                'sheetgroup_name' => 'OTHER WORK',
                'sheetgroup_description' => 'Other miscellaneous work',
                'sheetgroup_type' => 0,
                'is_active' => 1,
                'sheetgroup_seqno' => 800,
            ],
            [
                "id" => 9,
                'sheetgroup_code' => 'I',
                'sheetgroup_name' => 'ADD WORK',
                'sheetgroup_description' => 'Additional work and extras',
                'sheetgroup_type' => 0,
                'is_active' => 1,
                'sheetgroup_seqno' => 900,
            ],
            // Type 1: Cost Categories
            [
                "id" => 10,
                'sheetgroup_code' => 'BP',
                'sheetgroup_name' => 'BIAYA PERBAIKAN',
                'sheetgroup_description' => 'Biaya perbaikan dan perawatan',
                'sheetgroup_type' => 1,
                'is_active' => 1,
                'sheetgroup_seqno' => 1000,
            ],
            [
                "id" => 11,
                'sheetgroup_code' => 'BTD',
                'sheetgroup_name' => 'BIAYA DARURAT',
                'sheetgroup_description' => 'Biaya darurat dan situasi mendesak',
                'sheetgroup_type' => 1,
                'is_active' => 1,
                'sheetgroup_seqno' => 1100,
            ],
            [
                "id" => 12,
                'sheetgroup_code' => 'BK',
                'sheetgroup_name' => 'BIAYA KESEHATAN',
                'sheetgroup_description' => 'Biaya kesehatan dan keselamatan kerja',
                'sheetgroup_type' => 1,
                'is_active' => 1,
                'sheetgroup_seqno' => 1200,
            ],
            [
                "id" => 13,
                'sheetgroup_code' => 'OH',
                'sheetgroup_name' => 'OVER HEAD',
                'sheetgroup_description' => 'Biaya overhead dan operasional',
                'sheetgroup_type' => 1,
                'is_active' => 1,
                'sheetgroup_seqno' => 1300,
            ],
        ];

        DB::table('sheetgroups')->insert($sheetgroups);
    }
}
