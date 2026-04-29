<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Repositories\Contracts\VendorRepositoryInterface;
use Mockery;

class VendorControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = Mockery::mock(VendorRepositoryInterface::class);
        $this->app->instance(VendorRepositoryInterface::class, $this->repository);
        
        // Create a vendor type for validation to pass
        \DB::table('vendortypes')->insert([
            'id' => 1,
            'vendortype_code' => 'VT001',
            'vendortype_name' => 'Test Vendor Type',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_returns_list_of_active_vendors()
    {
        $vendors = [
            ['id' => 1, 'vendor_code' => 'VND001', 'vendor_name' => 'Vendor 1', 'vendortype_id' => 1, 'is_active' => true],
            ['id' => 2, 'vendor_code' => 'VND002', 'vendor_name' => 'Vendor 2', 'vendortype_id' => 1, 'is_active' => true],
        ];

        $this->repository
            ->shouldReceive('getVendorsByActive')
            ->once()
            ->andReturn($vendors);

        $response = $this->withoutMiddleware()
            ->getJson('/vendors');

        $response->assertStatus(200)
            ->assertJson(['data' => $vendors]);
    }

    /** @test */
    public function it_returns_a_single_vendor()
    {
        $vendor = ['id' => 1, 'vendor_code' => 'VND001', 'vendor_name' => 'Vendor 1', 'vendortype_id' => 1, 'is_active' => true];

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($vendor);

        $response = $this->withoutMiddleware()
            ->getJson('/vendors/1');

        $response->assertStatus(200)
            ->assertJson(['data' => $vendor]);
    }

    /** @test */
    public function it_returns_404_when_vendor_not_found()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->getJson('/vendors/999');

        $response->assertStatus(404)
            ->assertJson(['error' => 'Vendor not found']);
    }

    /** @test */
    public function it_returns_vendors_by_type()
    {
        $vendors = [
            ['id' => 1, 'vendor_code' => 'VND001', 'vendor_name' => 'Vendor 1', 'vendortype_id' => 1, 'is_active' => true],
            ['id' => 2, 'vendor_code' => 'VND002', 'vendor_name' => 'Vendor 2', 'vendortype_id' => 1, 'is_active' => true],
        ];

        $this->repository
            ->shouldReceive('getVendorsByType')
            ->with(1)
            ->once()
            ->andReturn($vendors);

        $response = $this->withoutMiddleware()
            ->getJson('/vendortypes/1/vendors');

        $response->assertStatus(200)
            ->assertJson(['data' => $vendors]);
    }

    /** @test */
    public function it_creates_a_new_vendor()
    {
        $vendorData = [
            'vendor_code' => 'VND003',
            'vendor_name' => 'New Vendor',
            'vendortype_id' => 1,
            'is_active' => true,
        ];

        $createdVendor = array_merge(['id' => 3], $vendorData);

        $this->repository
            ->shouldReceive('create')
            ->with($vendorData)
            ->once()
            ->andReturn($createdVendor);

        $response = $this->withoutMiddleware()
            ->postJson('/vendors', $vendorData);

        $response->assertStatus(201)
            ->assertJson(['data' => $createdVendor]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_vendor()
    {
        $response = $this->withoutMiddleware()
            ->postJson('/vendors', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['vendor_code', 'vendor_name', 'vendortype_id']);
    }

    /** @test */
    public function it_updates_an_existing_vendor()
    {
        $updateData = [
            'vendor_name' => 'Updated Vendor Name',
            'is_active' => false,
        ];

        $existingVendor = ['id' => 1, 'vendor_code' => 'VND001', 'vendor_name' => 'Old Name', 'vendortype_id' => 1, 'is_active' => true];
        $updatedVendor = array_merge($existingVendor, $updateData);

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($existingVendor);

        $this->repository
            ->shouldReceive('update')
            ->with(1, $updateData)
            ->once()
            ->andReturn($updatedVendor);

        $response = $this->withoutMiddleware()
            ->putJson('/vendors/1', $updateData);

        $response->assertStatus(200)
            ->assertJson(['data' => $updatedVendor]);
    }

    /** @test */
    public function it_returns_404_when_updating_non_existent_vendor()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->putJson('/vendors/999', ['vendor_name' => 'Test']);

        $response->assertStatus(404)
            ->assertJson(['error' => 'Vendor not found']);
    }

    /** @test */
    public function it_deletes_a_vendor()
    {
        $vendor = ['id' => 1, 'vendor_code' => 'VND001', 'vendor_name' => 'Vendor 1', 'vendortype_id' => 1, 'is_active' => true];

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($vendor);

        $this->repository
            ->shouldReceive('delete')
            ->with(1)
            ->once()
            ->andReturn(true);

        $response = $this->withoutMiddleware()
            ->deleteJson('/vendors/1');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Vendor deleted successfully']);
    }

    /** @test */
    public function it_returns_404_when_deleting_non_existent_vendor()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->deleteJson('/vendors/999');

        $response->assertStatus(404)
            ->assertJson(['error' => 'Vendor not found']);
    }
}
