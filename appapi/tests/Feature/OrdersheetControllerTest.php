<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Repositories\Contracts\OrdersheetRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Mockery;

class OrdersheetControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = Mockery::mock(OrdersheetRepositoryInterface::class);
        $this->app->instance(OrdersheetRepositoryInterface::class, $this->repository);
        $this->createDependencies();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    private function createDependencies()
    {
        // 1. Project
        DB::table('projects')->insert([
            'id' => 1,
            'project_name' => 'Project 1',
        ]);

        // 2. Contract (depends on Project)
        DB::table('contracts')->insert([
            'id' => 1,
            'project_id' => 1,
            'contract_name' => 'Contract 1',
        ]);

        // 3. Order (depends on Project, Contract)
        DB::table('orders')->insert([
            'id' => 1,
            'project_id' => 1,
            'contract_id' => 1,
            'order_number' => 'ORD001',
        ]);

        // 4. SheetGroup
        DB::table('sheetgroups')->insert([
            'id' => 1,
            'sheetgroup_code' => 'GRP1',
            'sheetgroup_name' => 'Group 1',
        ]);

        // 5. ContractSheet (depends on Project, Contract, SheetGroup)
        DB::table('contractsheets')->insert([
            'id' => 1,
            'project_id' => 1,
            'contract_id' => 1,
            'sheetgroup_id' => 1,
        ]);

        // 6. Uom
        DB::table('uoms')->insert([
            'id' => 1,
            'uom_code' => 'PCS',
            'uom_name' => 'Pieces',
        ]);

        // 7. VendorType
        DB::table('vendortypes')->insert([
            'id' => 1,
            'vendortype_code' => 'SUPP',
            'vendortype_name' => 'Supplier',
        ]);

        // 8. Vendor (depends on VendorType)
        DB::table('vendors')->insert([
            'id' => 1,
            'vendortype_id' => 1,
            'vendor_code' => 'VEN1',
            'vendor_name' => 'Vendor 1',
        ]);
    }

    /** @test */
    public function it_returns_list_of_all_ordersheets()
    {
        $ordersheets = [
            [
                'id' => 1,
                'project_id' => 1,
                'order_id' => 1,
                'contract_id' => 1,
                'sheet_name' => 'Sheet 1',
                'sheet_qty' => 10.00,
                'sheet_price' => 1000.00,
                'sheet_netamt' => 10000.00,
            ],
            [
                'id' => 2,
                'project_id' => 1,
                'order_id' => 1,
                'contract_id' => 1,
                'sheet_name' => 'Sheet 2',
                'sheet_qty' => 5.00,
                'sheet_price' => 2000.00,
                'sheet_netamt' => 10000.00,
            ],
        ];

        $this->repository
            ->shouldReceive('all')
            ->once()
            ->andReturn($ordersheets);

        $response = $this->withoutMiddleware()
            ->getJson('/ordersheets');

        $response->assertStatus(200)
            ->assertJson(['data' => $ordersheets]);
    }

    /** @test */
    public function it_returns_a_single_ordersheet()
    {
        $ordersheet = [
            'id' => 1,
            'project_id' => 1,
            'order_id' => 1,
            'contract_id' => 1,
            'sheet_name' => 'Sheet 1',
            'sheet_qty' => 10.00,
            'sheet_price' => 1000.00,
            'sheet_netamt' => 10000.00,
        ];

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($ordersheet);

        $response = $this->withoutMiddleware()
            ->getJson('/ordersheets/1');

        $response->assertStatus(200)
            ->assertJson(['data' => $ordersheet]);
    }

    /** @test */
    public function it_returns_404_when_ordersheet_not_found()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->getJson('/ordersheets/999');

        $response->assertStatus(404)
            ->assertJson(['error' => 'Ordersheet not found']);
    }

    /** @test */
    public function it_creates_a_new_ordersheet()
    {
        $ordersheetData = [
            'project_id' => 1,
            'order_id' => 1,
            'contract_id' => 1,
            'contractsheets_id' => 1,
            'sheet_type' => 1,
            'sheetgroup_type' => 1,
            'sheetgroup_id' => 1,
            'sheet_name' => 'New Sheet',
            'sheet_code' => 'SHT-NEW-001',
            'sheet_description' => 'Sheet description',
            'sheet_qty' => 15.00,
            'sheet_price' => 1500.00,
            'sheet_grossamt' => 22500.00,
            'sheet_discountrate' => 0.00,
            'sheet_discountvalue' => 0.00,
            'sheet_taxrate' => 10.00,
            'sheet_taxvalue' => 2250.00,
            'sheet_taxvalue' => 2250.00,
            'sheet_netamt' => 24750.00,
            'uom_id' => 1,
            'uom_name' => 'Unit',
        ];

        $createdOrdersheet = array_merge(['id' => 3], $ordersheetData);

        $this->repository
            ->shouldReceive('bulkCreate')
            ->with([$ordersheetData])
            ->once()
            ->andReturn([$createdOrdersheet]);

        $response = $this->withoutMiddleware()
            ->postJson('/ordersheets', [$ordersheetData]);

        $response->assertStatus(201)
            ->assertJson(['data' => [$createdOrdersheet]]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_ordersheet()
    {
        $response = $this->withoutMiddleware()
            ->postJson('/ordersheets', [[]]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['0.project_id', '0.order_id']);
    }

    /** @test */
    public function it_validates_project_exists_when_creating_ordersheet()
    {
        $response = $this->withoutMiddleware()
            ->postJson('/ordersheets', [[
                'project_id' => 999,
                'order_id' => 1,
            ]]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['0.project_id']);
    }

    /** @test */
    public function it_validates_order_exists_when_creating_ordersheet()
    {
        $response = $this->withoutMiddleware()
            ->postJson('/ordersheets', [[
                'project_id' => 1,
                'order_id' => 999,
            ]]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['0.order_id']);
    }

    /** @test */
    public function it_updates_an_existing_ordersheet()
    {
        $updateData = [
            'sheet_name' => 'Updated Sheet Name',
            'sheet_qty' => 20.00,
            'sheet_netamt' => 30000.00,
        ];

        $existingOrdersheet = [
            'id' => 1,
            'project_id' => 1,
            'order_id' => 1,
            'contract_id' => 1,
            'sheet_name' => 'Old Sheet Name',
            'sheet_qty' => 10.00,
            'sheet_netamt' => 10000.00,
        ];

        $updatedOrdersheet = array_merge($existingOrdersheet, $updateData);

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn((object)$existingOrdersheet);

        $this->repository
            ->shouldReceive('update')
            ->with(1, $updateData)
            ->once()
            ->andReturn($updatedOrdersheet);

        $response = $this->withoutMiddleware()
            ->putJson('/ordersheets/1', $updateData);

        $response->assertStatus(200)
            ->assertJson(['data' => $updatedOrdersheet]);
    }

    /** @test */
    public function it_returns_404_when_updating_non_existent_ordersheet()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->putJson('/ordersheets/999', ['sheet_name' => 'Test']);

        $response->assertStatus(404)
            ->assertJson(['error' => 'Ordersheet not found']);
    }

    /** @test */
    public function it_deletes_an_ordersheet()
    {
        $ordersheet = [
            'id' => 1,
            'project_id' => 1,
            'order_id' => 1,
            'sheet_name' => 'Sheet 1',
        ];

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($ordersheet);

        $this->repository
            ->shouldReceive('delete')
            ->with(1)
            ->once()
            ->andReturn(true);

        $response = $this->withoutMiddleware()
            ->deleteJson('/ordersheets/1');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Ordersheet deleted successfully']);
    }

    /** @test */
    public function it_returns_404_when_deleting_non_existent_ordersheet()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->deleteJson('/ordersheets/999');

        $response->assertStatus(404)
            ->assertJson(['error' => 'Ordersheet not found']);
    }

    /** @test */
    public function it_returns_ordersheets_by_order()
    {
        $ordersheets = [
            [
                'id' => 1,
                'project_id' => 1,
                'order_id' => 1,
                'sheet_name' => 'Sheet 1',
            ],
            [
                'id' => 2,
                'project_id' => 1,
                'order_id' => 1,
                'sheet_name' => 'Sheet 2',
            ],
        ];

        $this->repository
            ->shouldReceive('getOrdersheetsByOrder')
            ->with(1)
            ->once()
            ->andReturn($ordersheets);

        $response = $this->withoutMiddleware()
            ->getJson('/ordersheets/order/1');

        $response->assertStatus(200)
            ->assertJson(['data' => $ordersheets]);
    }

    /** @test */
    public function it_returns_ordersheets_by_project()
    {
        $ordersheets = [
            [
                'id' => 1,
                'project_id' => 1,
                'order_id' => 1,
                'sheet_name' => 'Sheet 1',
            ],
            [
                'id' => 2,
                'project_id' => 1,
                'order_id' => 2,
                'sheet_name' => 'Sheet 2',
            ],
        ];

        $this->repository
            ->shouldReceive('getOrdersheetsByProject')
            ->with(1)
            ->once()
            ->andReturn($ordersheets);

        $response = $this->withoutMiddleware()
            ->getJson('/ordersheets/project/1');

        $response->assertStatus(200)
            ->assertJson(['data' => $ordersheets]);
    }

    /** @test */
    public function it_returns_ordersheets_by_contract()
    {
        $ordersheets = [
            [
                'id' => 1,
                'project_id' => 1,
                'order_id' => 1,
                'contract_id' => 1,
                'sheet_name' => 'Sheet 1',
            ],
            [
                'id' => 3,
                'project_id' => 2,
                'order_id' => 2,
                'contract_id' => 1,
                'sheet_name' => 'Sheet 3',
            ],
        ];

        $this->repository
            ->shouldReceive('getOrdersheetsByContract')
            ->with(1)
            ->once()
            ->andReturn($ordersheets);

        $response = $this->withoutMiddleware()
            ->getJson('/ordersheets/contract/1');

        $response->assertStatus(200)
            ->assertJson(['data' => $ordersheets]);
    }

    /** @test */
    public function it_creates_ordersheet_with_all_optional_fields()
    {
        $ordersheetData = [
            'project_id' => 1,
            'order_id' => 1,
            'contract_id' => 1,
            'contractsheets_id' => 1,
            'sheet_dt' => '2025-12-08',
            'sheet_type' => 1,
            'sheetgroup_type' => 1,
            'sheetgroup_id' => 1,
            'sheetheader_id' => 1,
            'sheet_code' => 'SHT001',
            'sheet_name' => 'Complete Sheet',
            'sheet_description' => 'Full description',
            'sheet_notes' => 'Some notes',
            'sheet_qty' => 10.00,
            'sheet_price' => 1000.00,
            'sheet_grossamt' => 10000.00,
            'sheet_discountrate' => 5.00,
            'sheet_discountvalue' => 500.00,
            'sheet_taxrate' => 10.00,
            'sheet_taxvalue' => 950.00,
            'sheet_netamt' => 10450.00,
            'uom_id' => 1,
            'uom_name' => 'Unit',
            'sheet_payment_dt' => '2025-12-15',
            'sheet_payment_status' => 1,
            'vendortype_id' => 1,
            'vendortype_name' => 'Supplier',
            'vendor_id' => 1,
            'vendor_name' => 'ABC Vendor',
            'sheet_refftypeid' => 1,
            'sheet_reffno' => 'REF001',
            'order_number' => 'ORD001',
            'order_dt' => '2025-12-01',
            'sheetgroup_seqno' => 1,
            'sheet_seqno' => 1,
        ];

        $createdOrdersheet = array_merge(['id' => 5], $ordersheetData);

        $this->repository
            ->shouldReceive('bulkCreate')
            ->with([$ordersheetData])
            ->once()
            ->andReturn([$createdOrdersheet]);

        $response = $this->withoutMiddleware()
            ->postJson('/ordersheets', [$ordersheetData]);

        $response->assertStatus(201)
            ->assertJson(['data' => [$createdOrdersheet]]);
    }
}
