<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Mockery;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();
        DB::table('projects')->insert([
            [
                'id' => 1,
                'project_name' => 'Skyline Tower Construction',
                'project_description' => 'Construction of a 50-story residential tower in the city center.',
                'project_owner' => 'Skyline Developers Ltd.',
                'project_pic' => 'John Anderson',
                'project_number' => 'PRJ-2023-001',
                'project_startdt' => '2023-01-15',
                'project_enddt' => '2025-06-30',
                'project_address' => '123 Main St, Metropolis, NY',
                'project_latitude' => '40.7128',
                'project_longitude' => '-74.0060',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        DB::table('contracts')->insert([
            [
                'id' => 1,
                'project_id' => 1,
                'contract_name' => 'Main Construction Contract',
                'contract_description' => 'Primary construction contract for the 50-story residential tower including foundation, structure, and finishing.',
                'contract_number' => 'CNT-2023-001-A',
                'contract_pic' => 'John Anderson',
                'contractstatus_id' => 0,
                'contract_progress' => 65,
                'contract_dt' => '2023-01-10',
                'contract_startdt' => '2023-01-15',
                'contract_enddt' => '2025-06-30',
                'contract_amount' => 85000000.00,
                'contract_payment' => 55250000.00,
                'contract_payment_dt' => '2024-11-15',
                'contract_payment_status' => 'Partial',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        $this->repository = Mockery::mock(OrderRepositoryInterface::class);
        $this->app->instance(OrderRepositoryInterface::class, $this->repository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_returns_list_of_all_orders()
    {
        $orders = [
            [
                'id' => 1,
                'project_id' => 1,
                'contract_id' => 1,
                'order_number' => 'ORD001',
                'order_description' => 'Order 1',
                'order_pic' => 'John Doe',
                'orderstatus_id' => 1,
                'order_dt' => '2025-12-01',
            ],
            [
                'id' => 2,
                'project_id' => 1,
                'contract_id' => 1,
                'order_number' => 'ORD002',
                'order_description' => 'Order 2',
                'order_pic' => 'Jane Smith',
                'orderstatus_id' => 0,
                'order_dt' => '2025-12-02',
            ],
        ];

        $this->repository
            ->shouldReceive('all')
            ->once()
            ->andReturn($orders);

        $response = $this->withoutMiddleware()
            ->getJson('/orders');

        $response->assertStatus(200)
            ->assertJson(['data' => $orders]);
    }

    /** @test */
    public function it_returns_a_single_order()
    {
        $order = [
            'id' => 1,
            'project_id' => 1,
            'contract_id' => 1,
            'order_number' => 'ORD001',
            'order_description' => 'Order 1',
            'order_pic' => 'John Doe',
            'orderstatus_id' => 1,
            'order_dt' => '2025-12-01',
        ];

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($order);

        $response = $this->withoutMiddleware()
            ->getJson('/orders/1');

        $response->assertStatus(200)
            ->assertJson(['data' => $order]);
    }

    /** @test */
    public function it_returns_404_when_order_not_found()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->getJson('/orders/999');

        $response->assertStatus(404)
            ->assertJson(['error' => 'Order not found']);
    }

    /** @test */
    public function it_creates_a_new_order()
    {
        $orderData = [
            'project_id' => 1,
            'contract_id' => 1,
            'order_number' => 'ORD003',
            'order_description' => 'New Order',
            'order_pic' => 'John Doe',
            'orderstatus_id' => 1,
            'order_dt' => '2025-12-08',
        ];

        $createdOrder = array_merge(['id' => 3], $orderData);

        $this->repository
            ->shouldReceive('create')
            ->with($orderData)
            ->once()
            ->andReturn($createdOrder);

        $response = $this->withoutMiddleware()
            ->postJson('/orders', $orderData);

        $response->assertStatus(201)
            ->assertJson(['data' => $createdOrder]);
            
    }

    /** @test */
    public function it_validates_required_fields_when_creating_order()
    {
        $response = $this->withoutMiddleware()
            ->postJson('/orders', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['project_id', 'contract_id']);
    }

    /** @test */
    public function it_validates_project_exists_when_creating_order()
    {
        $response = $this->withoutMiddleware()
            ->postJson('/orders', [
                'project_id' => 999,
                'contract_id' => 1,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['project_id']);
    }

    /** @test */
    public function it_validates_contract_exists_when_creating_order()
    {
        $response = $this->withoutMiddleware()
            ->postJson('/orders', [
                'project_id' => 1,
                'contract_id' => 999,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['contract_id']);
    }

    /** @test */
    public function it_updates_an_existing_order()
    {
        $updateData = [
            'order_number' => 'ORD001', // Required by validation
            'order_description' => 'Updated Order Description',
            'orderstatus_id' => 1,
        ];

        $existingOrder = [
            'id' => 1,
            'project_id' => 1,
            'contract_id' => 1,
            'order_number' => 'ORD001',
            'order_description' => 'Old Description',
            'order_pic' => 'John Doe',
            'orderstatus_id' => 0,
            'order_dt' => '2025-12-01',
        ];

        $updatedOrder = array_merge($existingOrder, $updateData);

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn((object)$existingOrder);

        $this->repository
            ->shouldReceive('update')
            ->with(1, $updateData)
            ->once()
            ->andReturn((object)$updatedOrder);

        $response = $this->withoutMiddleware()
            ->putJson('/orders/1', $updateData);

        $response->assertStatus(200)
            ->assertJson(['data' => $updatedOrder]);
    }

    /** @test */
    public function it_returns_404_when_updating_non_existent_order()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->putJson('/orders/999', ['order_description' => 'Test']);

        $response->assertStatus(404)
            ->assertJson(['error' => 'Order not found']);
    }

    /** @test */
    public function it_deletes_an_order()
    {
        $order = Mockery::mock(Order::class);
        $order->id = 1;
        $order->project_id = 1;
        $order->contract_id = 1;
        $order->order_number = 'ORD001';

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($order);

        $order->shouldReceive('delete')
            ->once()
            ->andReturn(true);

        $response = $this->withoutMiddleware()
            ->deleteJson('/orders/1');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Order deleted successfully']);
    }

    /** @test */
    public function it_returns_404_when_deleting_non_existent_order()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->deleteJson('/orders/999');

        $response->assertStatus(404)
            ->assertJson(['error' => 'Order not found']);
    }

    /** @test */
    public function it_returns_orders_by_project()
    {
        $orders = [
            [
                'id' => 1,
                'project_id' => 1,
                'contract_id' => 1,
                'order_number' => 'ORD001',
            ],
            [
                'id' => 2,
                'project_id' => 1,
                'contract_id' => 2,
                'order_number' => 'ORD002',
            ],
        ];

        $this->repository
            ->shouldReceive('getByProject')
            ->with(1)
            ->once()
            ->andReturn($orders);

        $response = $this->withoutMiddleware()
            ->getJson('/orders/project/1');

        $response->assertStatus(200)
            ->assertJson(['data' => $orders]);
    }

    /** @test */
    public function it_returns_orders_by_contract()
    {
        $orders = [
            [
                'id' => 1,
                'project_id' => 1,
                'contract_id' => 1,
                'order_number' => 'ORD001',
            ],
            [
                'id' => 3,
                'project_id' => 2,
                'contract_id' => 1,
                'order_number' => 'ORD003',
            ],
        ];

        $this->repository
            ->shouldReceive('getByContract')
            ->with(1)
            ->once()
            ->andReturn($orders);

        $response = $this->withoutMiddleware()
            ->getJson('/orders/contract/1');

        $response->assertStatus(200)
            ->assertJson(['data' => $orders]);
    }
}
