<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrdersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $orders = [
            [
                'project_id' => 1,
                'contract_id' => 1,
                'order_dt' => Carbon::now()->subDays(60)->toDateString(),
                'order_number' => 'ORD-2023-001',
                'order_description' => 'Procurement of foundation materials',
                'order_pic' => 'John Anderson',
                'orderstatus_id' => 1, // 'Completed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 1,
                'contract_id' => 2,
                'order_dt' => Carbon::now()->subDays(55)->toDateString(),
                'order_number' => 'ORD-2023-002',
                'order_description' => 'Electrical wiring order',
                'order_pic' => 'Michael Torres',
                'orderstatus_id' => 1, // 'Approved',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 2,
                'contract_id' => 3,
                'order_dt' => Carbon::now()->subDays(50)->toDateString(),
                'order_number' => 'ORD-2023-003',
                'order_description' => 'Villa eco-bricks supply',
                'order_pic' => 'Sarah Jenkins',
                'orderstatus_id' => 0, // 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 2,
                'contract_id' => 4,
                'order_dt' => Carbon::now()->subDays(45)->toDateString(),
                'order_number' => 'ORD-2023-004',
                'order_description' => 'Solar panel units batch 1',
                'order_pic' => 'David Green',
                'orderstatus_id' => 1, // 'Approved',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 3,
                'contract_id' => 5,
                'order_dt' => Carbon::now()->subDays(40)->toDateString(),
                'order_number' => 'ORD-2023-005',
                'order_description' => 'Steel beams for reinforcement',
                'order_pic' => 'Michael Ross',
                'orderstatus_id' => 0, // 'In Progress',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 3,
                'contract_id' => 6,
                'order_dt' => Carbon::now()->subDays(35)->toDateString(),
                'order_number' => 'ORD-2023-006',
                'order_description' => 'Anti-corrosion paint supply',
                'order_pic' => 'Robert Brown',
                'orderstatus_id' => 1, // 'Completed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 4,
                'contract_id' => 7,
                'order_dt' => Carbon::now()->subDays(30)->toDateString(),
                'order_number' => 'ORD-2023-007',
                'order_description' => 'Smart IoT sensors batch A',
                'order_pic' => 'Emily Chen',
                'orderstatus_id' => 0, // 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 4,
                'contract_id' => 8,
                'order_dt' => Carbon::now()->subDays(25)->toDateString(),
                'order_number' => 'ORD-2023-008',
                'order_description' => 'Office furniture set',
                'order_pic' => 'Jennifer Liu',
                'orderstatus_id' => 1, // 'Approved',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 5,
                'contract_id' => 9,
                'order_dt' => Carbon::now()->subDays(20)->toDateString(),
                'order_number' => 'ORD-2023-009',
                'order_description' => 'Park landscaping trees',
                'order_pic' => 'David Wilson',
                'orderstatus_id' => 0, // 'In Progress',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 5,
                'contract_id' => 10,
                'order_dt' => Carbon::now()->subDays(15)->toDateString(),
                'order_number' => 'ORD-2023-010',
                'order_description' => 'Community center fixtures',
                'order_pic' => 'Patricia Moore',
                'orderstatus_id' => 0, // 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('orders')->insert($orders);
    }
}
