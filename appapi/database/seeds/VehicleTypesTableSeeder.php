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
                'vehicle_group_id'         => 1,
                'vehicle_type_code'        => 'motor001',
                'vehicle_type_name'        => 'Scoopy dan Sejenisnya',
                'vehicle_type_description' => 'Motor Scoopy dan Sejenisnya',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            [
                'vehicle_group_id'         => 1,
                'vehicle_type_code'        => 'motor002',
                'vehicle_type_name'        => 'NMAX dan Sejenisnya',
                'vehicle_type_description' => 'Motor NMAX dan Sejenisnya',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            [
                'vehicle_group_id'         => 1,
                'vehicle_type_code'        => 'motor003',
                'vehicle_type_name'        => 'Trail / Motor Besar',
                'vehicle_type_description' => 'Motor Trail / Motor Besar',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],

            [
                'vehicle_group_id'         => 2,
                'vehicle_type_code'        => 'mobil001',
                'vehicle_type_name'        => 'Pickup',
                'vehicle_type_description' => 'Mobil Pickup',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            [
                'vehicle_group_id'         => 2,
                'vehicle_type_code'        => 'mobil002',
                'vehicle_type_name'        => 'Avanza dan Sejenisnya',
                'vehicle_type_description' => 'Mobil Avanza dan Sejenisnya',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            [
                'vehicle_group_id'         => 2,
                'vehicle_type_code'        => 'mobil003',
                'vehicle_type_name'        => 'Fortuner Pajero dan Sejenisnya',
                'vehicle_type_description' => 'Mobil Fortuner Pajero dan Sejenisnya',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            [
                'vehicle_group_id'         => 2,
                'vehicle_type_code'        => 'mobil004',
                'vehicle_type_name'        => 'Elf Hiace',
                'vehicle_type_description' => 'Mobil Elf',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            [
                'vehicle_group_id'         => 2,
                'vehicle_type_code'        => 'mobil005',
                'vehicle_type_name'        => 'Truck',
                'vehicle_type_description' => 'Mobil Truck',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],
            [
                'vehicle_group_id'         => 2,
                'vehicle_type_code'        => 'mobil006',
                'vehicle_type_name'        => 'Angkot',
                'vehicle_type_description' => 'Mobil Angkot',
                'is_active'                => 1,
                'created_at'               => now(),
                'updated_at'               => now(),
            ],

        ];

        DB::table('vehicle_types')->insert($vehicleTypes);
    }
}
