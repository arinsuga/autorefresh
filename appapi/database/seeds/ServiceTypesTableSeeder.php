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

        $serviceTypes = [
            // Motorcycle services
            [
                'vehicle_type_id'    => $mc,
                'service_code'       => 'SVC-MC-EXT',
                'service_name'       => 'Motor Exterior Wash',
                'service_price'      => 25000,
                'service_description'=> 'Cuci eksterior sepeda motor',
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            [
                'vehicle_type_id'    => $mc,
                'service_code'       => 'SVC-MC-WAX',
                'service_name'       => 'Motor Wax Polish',
                'service_price'      => 35000,
                'service_description'=> 'Poles wax sepeda motor',
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            // Sedan services
            [
                'vehicle_type_id'    => $sd,
                'service_code'       => 'SVC-SD-EXT',
                'service_name'       => 'Sedan Exterior Wash',
                'service_price'      => 50000,
                'service_description'=> 'Cuci eksterior sedan',
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            [
                'vehicle_type_id'    => $sd,
                'service_code'       => 'SVC-SD-INT',
                'service_name'       => 'Sedan Interior Clean',
                'service_price'      => 75000,
                'service_description'=> 'Pembersihan interior sedan',
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            [
                'vehicle_type_id'    => $sd,
                'service_code'       => 'SVC-SD-WAX',
                'service_name'       => 'Sedan Wax Polish',
                'service_price'      => 85000,
                'service_description'=> 'Poles wax eksterior sedan',
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            // SUV services
            [
                'vehicle_type_id'    => $suv,
                'service_code'       => 'SVC-SUV-EXT',
                'service_name'       => 'SUV Exterior Wash',
                'service_price'      => 65000,
                'service_description'=> 'Cuci eksterior SUV',
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            [
                'vehicle_type_id'    => $suv,
                'service_code'       => 'SVC-SUV-INT',
                'service_name'       => 'SUV Interior Clean',
                'service_price'      => 100000,
                'service_description'=> 'Pembersihan interior SUV',
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            [
                'vehicle_type_id'    => $suv,
                'service_code'       => 'SVC-SUV-WAX',
                'service_name'       => 'SUV Wax Polish',
                'service_price'      => 110000,
                'service_description'=> 'Poles wax eksterior SUV',
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            // MPV services
            [
                'vehicle_type_id'    => $mpv,
                'service_code'       => 'SVC-MPV-EXT',
                'service_name'       => 'MPV Exterior Wash',
                'service_price'      => 60000,
                'service_description'=> 'Cuci eksterior MPV/Minivan',
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            [
                'vehicle_type_id'    => $mpv,
                'service_code'       => 'SVC-MPV-INT',
                'service_name'       => 'MPV Interior Clean',
                'service_price'      => 90000,
                'service_description'=> 'Pembersihan interior MPV',
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            // Pickup Truck services
            [
                'vehicle_type_id'    => $pu,
                'service_code'       => 'SVC-PU-EXT',
                'service_name'       => 'Pickup Exterior Wash',
                'service_price'      => 70000,
                'service_description'=> 'Cuci eksterior pickup truck',
                'is_active'          => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
        ];

        DB::table('service_types')->insert($serviceTypes);
    }
}
