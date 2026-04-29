<?php

use Illuminate\Database\Seeder;

class VehicleTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $vehicleTypes = [
            [
                'vehicle_type_code'        => 'VT-MC',
                'vehicle_type_name'        => 'Motorcycle',
                'vehicle_type_description' => 'Sepeda motor roda dua',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            [
                'vehicle_type_code'        => 'VT-SD',
                'vehicle_type_name'        => 'Sedan',
                'vehicle_type_description' => 'Kendaraan penumpang sedan',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            [
                'vehicle_type_code'        => 'VT-SUV',
                'vehicle_type_name'        => 'SUV',
                'vehicle_type_description' => 'Sport Utility Vehicle',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            [
                'vehicle_type_code'        => 'VT-MPV',
                'vehicle_type_name'        => 'MPV',
                'vehicle_type_description' => 'Multi Purpose Vehicle / Minivan',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            [
                'vehicle_type_code'        => 'VT-PU',
                'vehicle_type_name'        => 'Pickup Truck',
                'vehicle_type_description' => 'Kendaraan niaga bak terbuka',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
        ];

        DB::table('vehicle_types')->insert($vehicleTypes);
    }
}
