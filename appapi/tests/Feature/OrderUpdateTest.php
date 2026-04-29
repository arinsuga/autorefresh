<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Order;
use App\Ordersheet;
use Illuminate\Support\Facades\DB;

class OrderUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->createDependencies();
    }

    private function createDependencies()
    {
        DB::table('projects')->insert(['id' => 1, 'project_name' => 'Project 1', 'project_number' => 'P1']);
        DB::table('contracts')->insert(['id' => 1, 'project_id' => 1, 'contract_name' => 'Contract 1', 'contract_number' => 'C1']);
        DB::table('sheetgroups')->insert(['id' => 1, 'sheetgroup_code' => 'GRP1', 'sheetgroup_name' => 'Group 1']);
        DB::table('uoms')->insert(['id' => 1, 'uom_code' => 'PCS', 'uom_name' => 'Pieces']);
        DB::table('contractsheets')->insert(['id' => 1, 'project_id' => 1, 'contract_id' => 1, 'sheetgroup_id' => 1]);
    }

    /** @test */
    public function it_preserves_ordersheet_ids_during_order_update()
    {
        // 1. Create an order with items via the repository
        $repository = app(\App\Repositories\Contracts\OrderRepositoryInterface::class);
        
        $orderData = [
            'project_id' => 1,
            'contract_id' => 1,
            'order_number' => 'ORD-001',
            'order_description' => 'Test Order',
            'order_items' => [
                [
                    'sheet_name' => 'Item 1',
                    'sheet_qty' => 10,
                    'sheet_price' => 100,
                    'sheet_grossamt' => 1000,
                    'sheet_netamt' => 1000,
                    'uom_id' => 1,
                    'uom_code' => 'PCS',
                    'sheetgroup_id' => 1,
                    'contractsheets_id' => 1,
                    'sheet_code' => 'S1',
                ],
                [
                    'sheet_name' => 'Item 2',
                    'sheet_qty' => 20,
                    'sheet_price' => 200,
                    'sheet_grossamt' => 4000,
                    'sheet_netamt' => 4000,
                    'uom_id' => 1,
                    'uom_code' => 'PCS',
                    'sheetgroup_id' => 1,
                    'contractsheets_id' => 1,
                    'sheet_code' => 'S2',
                ]
            ]
        ];

        $order = $repository->create($orderData);
        $originalItems = $order->ordersheets;
        $this->assertCount(2, $originalItems);
        $item1Id = $originalItems[0]->id;
        $item2Id = $originalItems[1]->id;

        // 2. Prepare update data - update Item 1, remove Item 2, add Item 3
        $updateData = [
            'order_description' => 'Updated Order',
            'order_items' => [
                [
                    'id' => $item1Id,
                    'sheet_name' => 'Item 1 Updated',
                    'sheet_qty' => 15,
                    'sheet_price' => 100,
                    'sheet_grossamt' => 1500,
                    'sheet_netamt' => 1500,
                    'uom_id' => 1,
                    'uom_code' => 'PCS',
                    'sheetgroup_id' => 1,
                    'contractsheets_id' => 1,
                    'sheet_code' => 'S1',
                ],
                [
                    'sheet_name' => 'Item 3 New',
                    'sheet_qty' => 30,
                    'sheet_price' => 300,
                    'sheet_grossamt' => 9000,
                    'sheet_netamt' => 9000,
                    'uom_id' => 1,
                    'uom_code' => 'PCS',
                    'sheetgroup_id' => 1,
                    'contractsheets_id' => 1,
                    'sheet_code' => 'S3',
                ]
            ]
        ];

        $updatedOrder = $repository->update($order->id, $updateData);
        $newItems = $updatedOrder->ordersheets;

        // 3. Assertions
        $this->assertCount(2, $newItems);
        
        // Find Item 1 in new items
        $updatedItem1 = $newItems->where('sheet_name', 'Item 1 Updated')->first();
        $this->assertNotNull($updatedItem1, 'Updated Item 1 should exist');
        
        // THIS IS THE CORE OF THE BUG REPORT: ID should remain the same
        $this->assertEquals($item1Id, $updatedItem1->id, 'Existing item ID should be preserved');
        
        // Item 2 should be gone
        $this->assertNull($newItems->where('sheet_name', 'Item 2')->first(), 'Item 2 should be removed');
        
        // Item 3 should be there
        $newItem3 = $newItems->where('sheet_name', 'Item 3 New')->first();
        $this->assertNotNull($newItem3, 'New Item 3 should exist');
        $this->assertNotEquals($item1Id, $newItem3->id);
        $this->assertNotEquals($item2Id, $newItem3->id);
    }
}
