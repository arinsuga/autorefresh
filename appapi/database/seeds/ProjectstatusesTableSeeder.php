<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectstatusesTableSeeder extends Seeder
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
                'description' => 'Project is open and active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 1,
                'name' => 'Approved',
                'description' => 'Project has been approved',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => 'Closed',
                'description' => 'Project has been closed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => 'Canceled/Rejected',
                'description' => 'Project has been canceled or rejected',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'name' => 'Pending',
                'description' => 'Project is pending approval',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Using insertOrIgnore to prevent duplicate key errors if run multiple times
        DB::table('projectstatuses')->insertOrIgnore($statuses);
    }
}
