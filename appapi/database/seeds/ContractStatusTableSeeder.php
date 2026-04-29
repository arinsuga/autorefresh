<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContractstatusesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $statuses = [
            [
                'id' => 0,
                'name' => 'Open',
                'description' => 'Contract is open and activeX',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 1,
                'name' => 'Approved',
                'description' => 'Contract has been approved',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Closed',
                'description' => 'Contract has been closed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Canceled/Rejected',
                'description' => 'Contract has been canceled or rejected',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'name' => 'Pending',
                'description' => 'Contract is pending approval',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Using insertOrIgnore to prevent duplicate key errors if run multiple times
        DB::table('contractstatuses')->insertOrIgnore($statuses);
    }
}
