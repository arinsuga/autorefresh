<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UomsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Clear existing data
        DB::table('uoms')->truncate();

        // Insert common Unit of Measure data (Indonesian names/descriptions)
        $uoms = [
            // Pieces & Units
            [
                'uom_code' => 'pcs',
                'uom_name' => 'pcs',
                'uom_description' => 'Satu unit atau buah',
                'is_active' => 1,
                'display_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'box',
                'uom_name' => 'box',
                'uom_description' => 'Satuan dalam kotak',
                'is_active' => 1,
                'display_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'pack',
                'uom_name' => 'pack',
                'uom_description' => 'Satuan per paket',
                'is_active' => 1,
                'display_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'set',
                'uom_name' => 'set',
                'uom_description' => 'Satu set item',
                'is_active' => 1,
                'display_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Weight
            [
                'uom_code' => 'kg',
                'uom_name' => 'kg',
                'uom_description' => 'Berat dalam kilogram',
                'is_active' => 1,
                'display_order' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'gr',
                'uom_name' => 'gr',
                'uom_description' => 'Berat dalam gram',
                'is_active' => 1,
                'display_order' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'ton',
                'uom_name' => 'ton',
                'uom_description' => 'Berat dalam ton metrik',
                'is_active' => 1,
                'display_order' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Volume & Liquid
            [
                'uom_code' => 'L',
                'uom_name' => 'L',
                'uom_description' => 'Volume dalam liter',
                'is_active' => 1,
                'display_order' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'ml',
                'uom_name' => 'ml',
                'uom_description' => 'Volume dalam mililiter',
                'is_active' => 1,
                'display_order' => 9,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'gal',
                'uom_name' => 'gal',
                'uom_description' => 'Volume dalam galon',
                'is_active' => 1,
                'display_order' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Additional volume units
            [
                'uom_code' => 'm2',
                'uom_name' => 'm2',
                'uom_description' => 'Volume dalam meter persegi',
                'is_active' => 1,
                'display_order' => 11,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'm3',
                'uom_name' => 'm3',
                'uom_description' => 'Volume dalam meter kubik',
                'is_active' => 1,
                'display_order' => 12,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Length
            [
                'uom_code' => 'm',
                'uom_name' => 'm',
                'uom_description' => 'Panjang dalam meter',
                'is_active' => 1,
                'display_order' => 13,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'cm',
                'uom_name' => 'cm',
                'uom_description' => 'Panjang dalam sentimeter',
                'is_active' => 1,
                'display_order' => 14,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'km',
                'uom_name' => 'km',
                'uom_description' => 'Panjang dalam kilometer',
                'is_active' => 1,
                'display_order' => 15,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Time
            [
                'uom_code' => 'hr',
                'uom_name' => 'hr',
                'uom_description' => 'Waktu dalam jam',
                'is_active' => 1,
                'display_order' => 16,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'day',
                'uom_name' => 'day',
                'uom_description' => 'Waktu dalam hari',
                'is_active' => 1,
                'display_order' => 17,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Service
            [
                'uom_code' => 'svc',
                'uom_name' => 'svc',
                'uom_description' => 'Satuan untuk layanan',
                'is_active' => 1,
                'display_order' => 18,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Additional packaging unit
            [
                'uom_code' => 'sack',
                'uom_name' => 'sack',
                'uom_description' => 'Satuan Sack atau karung',
                'is_active' => 1,
                'display_order' => 19,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // General
            [
                'uom_code' => 'lot',
                'uom_name' => 'lot',
                'uom_description' => 'Satu lot',
                'is_active' => 1,
                'display_order' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'unit',
                'uom_name' => 'unit',
                'uom_description' => 'Satu unit',
                'is_active' => 1,
                'display_order' => 21,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'uom_code' => 'point',
                'uom_name' => 'point',
                'uom_description' => 'Satu point',
                'is_active' => 1,
                'display_order' => 21,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('uoms')->insert($uoms);
    }
}

