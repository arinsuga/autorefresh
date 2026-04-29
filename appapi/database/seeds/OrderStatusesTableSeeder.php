<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderstatusesTableSeeder extends Seeder
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
                'description' => 'Order is open and active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 1,
                'name' => 'Approved',
                'description' => 'Order has been approved',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Closed',
                'description' => 'Order has been closed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Canceled/Rejected',
                'description' => 'Order has been canceled or rejected',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'name' => 'Pending',
                'description' => 'Order is pending approval',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        // Using upsert or just insert ignore to prevent duplicate key errors if run multiple times
        // Attempting to just clean and insert or insertIgnore if supported, but simple insert for now as migrations are usually fresh.
        // Assuming fresh seed:
        DB::table('orderstatuses')->insertOrIgnore($statuses);
    }
}
