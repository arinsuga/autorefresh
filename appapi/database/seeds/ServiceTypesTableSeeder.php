<?php

use Illuminate\Database\Seeder;

class ServiceTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get vehicle type IDs
        $mc  = DB::table('vehicle_types')->where('vehicle_type_code', 'VT-MC')->value('id');
        $sd  = DB::table('vehicle_types')->where('vehicle_type_code', 'VT-SD')->value('id');
        $suv = DB::table('vehicle_types')->where('vehicle_type_code', 'VT-SUV')->value('id');
        $mpv = DB::table('vehicle_types')->where('vehicle_type_code', 'VT-MPV')->value('id');
        $pu  = DB::table('vehicle_types')->where('vehicle_type_code', 'VT-PU')->value('id');

        //motor
        $motor001 = DB::table('vehicle_types')->where('id', 1)->value('id');
        $motor002 = DB::table('vehicle_types')->where('id', 2)->value('id');
        $motor003 = DB::table('vehicle_types')->where('id', 3)->value('id');

        //mobil
        $mobil001 = DB::table('vehicle_types')->where('id', 4)->value('id');
        $mobil002 = DB::table('vehicle_types')->where('id', 5)->value('id');
        $mobil003 = DB::table('vehicle_types')->where('id', 6)->value('id');
        $mobil004 = DB::table('vehicle_types')->where('id', 7)->value('id');
        $mobil005 = DB::table('vehicle_types')->where('id', 8)->value('id');
        $mobil006 = DB::table('vehicle_types')->where('id', 9)->value('id');

        //Services
        $service1 = 'Cuci Cepat';
        $service2 = 'Cuci Full Service';

        $serviceTypes = [
            // Motorcycle services
            [
                'vehicle_type_id'    => $motor001,
                'service_code'       => 'cuci-motor-001',
                'service_name'       => $service2,
                'service_price'      => 15000,
                'service_description'=> "Motor ${service2}",
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            [
                'vehicle_type_id'    => $motor002,
                'service_code'       => 'cuci-motor-002',
                'service_name'       => $service2,
                'service_price'      => 15000,
                'service_description'=> "Motor ${service2}",
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            [
                'vehicle_type_id'    => $motor003,
                'service_code'       => 'cuci-motor-003',
                'service_name'       => $service2,
                'service_price'      => 25000,
                'service_description'=> "Motor ${service2}",
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],


            // Pickup
            // [
            //     'vehicle_type_id'    => $mobil001,
            //     'service_code'       => 'cuci-mobil-001',
            //     'service_name'       => $service1,
            //     'service_price'      => 25000,
            //     'service_description'=> "Mobil ${service1}",
            //     'is_active'          => 1,
            //     'created_at'         => now(),
            //     'updated_at'         => now(),
            // ],
            [
                'vehicle_type_id'    => $mobil001,
                'service_code'       => 'cuci-mobil-002',
                'service_name'       => $service2,
                'service_price'      => 30000,
                'service_description'=> "Mobil ${service2}",
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            // Avanza dan Sejenisnya
            // [
            //     'vehicle_type_id'    => $mobil002,
            //     'service_code'       => 'cuci-mobil-003',
            //     'service_name'       => $service1,
            //     'service_price'      => 35000,
            //     'service_description'=> "Mobil ${service1}",
            //     'is_active'          => 1,
            //     'created_at'         => now(),
            //     'updated_at'         => now(),
            // ],
            [
                'vehicle_type_id'    => $mobil002,
                'service_code'       => 'cuci-mobil-004',
                'service_name'       => $service2,
                'service_price'      => 40000,
                'service_description'=> "Mobil ${service2}",
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            //Fortuner Pajero dan Sejenisnya
            // [
            //     'vehicle_type_id'    => $mobil003,
            //     'service_code'       => 'cuci-mobil-005',
            //     'service_name'       => $service1,
            //     'service_price'      => 40000,
            //     'service_description'=> "Mobil ${service1}",
            //     'is_active'          => 1,
            //     'created_at'         => now(),
            //     'updated_at'         => now(),
            // ],
            [
                'vehicle_type_id'    => $mobil003,
                'service_code'       => 'cuci-mobil-006',
                'service_name'       => $service2,
                'service_price'      => 45000,
                'service_description'=> "Mobil ${service2}",
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            //Elf Hiace
            // [
            //     'vehicle_type_id'    => $mobil004,
            //     'service_code'       => 'cuci-mobil-007',
            //     'service_name'       => $service1,
            //     'service_price'      => 50000,
            //     'service_description'=> "Mobil ${service1}",
            //     'is_active'          => 1,
            //     'created_at'         => now(),
            //     'updated_at'         => now(),
            // ],
            [
                'vehicle_type_id'    => $mobil004,
                'service_code'       => 'cuci-mobil-008',
                'service_name'       => $service2,
                'service_price'      => 60000,
                'service_description'=> "Mobil ${service2}",
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            //Truck
            // [
            //     'vehicle_type_id'    => $mobil005,
            //     'service_code'       => 'cuci-mobil-009',
            //     'service_name'       => $service1,
            //     'service_price'      => 45000,
            //     'service_description'=> "Mobil ${service1}",
            //     'is_active'          => 1,
            //     'created_at'         => now(),
            //     'updated_at'         => now(),
            // ],
            [
                'vehicle_type_id'    => $mobil005,
                'service_code'       => 'cuci-mobil-010',
                'service_name'       => $service2,
                'service_price'      => 55000,
                'service_description'=> "Mobil ${service2}",
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],

            //Angkot
            // [
            //     'vehicle_type_id'    => $mobil006,
            //     'service_code'       => 'cuci-mobil-011',
            //     'service_name'       => $service1,
            //     'service_price'      => 15000,
            //     'service_description'=> "Mobil ${service1}",
            //     'is_active'          => 1,
            //     'created_at'         => now(),
            //     'updated_at'         => now(),
            // ],
            [
                'vehicle_type_id'    => $mobil006,
                'service_code'       => 'cuci-mobil-012',
                'service_name'       => $service2,
                'service_price'      => 20000,
                'service_description'=> "Mobil ${service2}",
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            
        ];

        DB::table('service_types')->insert($serviceTypes);
    }
}
