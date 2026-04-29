<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Repositories\Contracts\ContractRepositoryInterface;
use Mockery;

class ContractControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = Mockery::mock(ContractRepositoryInterface::class);
        $this->app->instance(ContractRepositoryInterface::class, $this->repository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_returns_list_of_active_contracts()
    {
        $contracts = [
            ['id' => 1, 'contract_number' => 'CNT001', 'contract_name' => 'Contract 1'],
            ['id' => 2, 'contract_number' => 'CNT002', 'contract_name' => 'Contract 2'],
        ];

        $this->repository
            ->shouldReceive('all')
            ->once()
            ->andReturn($contracts);

        $response = $this->withoutMiddleware()
            ->getJson('/contracts');

        $response->assertStatus(200)
            ->assertJson(['data' => $contracts]);
    }

    /** @test */
    public function it_returns_a_single_contract()
    {
        $contract = Mockery::mock(\App\Contract::class)->makePartial();
        $contract->id = 1;
        $contract->contract_number = 'CNT001';
        $contract->contract_name = 'Contract 1';

        $this->repository
            ->shouldReceive('findWithSheets')
            ->with(1)
            ->once()
            ->andReturn($contract);

        $response = $this->withoutMiddleware()
            ->getJson('/contracts/1');

        $response->assertStatus(200);
    }

    /** @test */
    public function it_returns_404_when_contract_not_found()
    {
        $this->repository
            ->shouldReceive('findWithSheets')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->getJson('/contracts/999');

        $response->assertStatus(404)
            ->assertJson(['error' => 'Contract not found']);
    }

    /** @test */
    public function it_creates_a_new_contract()
    {
        factory(\App\Project::class)->create(['id' => 1]);

        $contractData = [
            'contract_number' => 'CNT003',
            'contract_name' => 'New Contract',
            'project_id' => 1,
        ];

        $contract = Mockery::mock(\App\Contract::class)->makePartial();
        $contract->id = 3;
        $contract->project_id = 1;
        $contract->fill($contractData);

        $this->repository
            ->shouldReceive('create')
            ->once()
            ->andReturn($contract);

        $contract->shouldReceive('load')
            ->with('contractSheets')
            ->once()
            ->andReturn($contract);

        $response = $this->withoutMiddleware()
            ->postJson('/contracts', $contractData);

        $response->assertStatus(201);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_contract()
    {
        $response = $this->withoutMiddleware()
            ->postJson('/contracts', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['contract_number', 'contract_name']);
    }

    /** @test */
    public function it_updates_an_existing_contract()
    {
        $updateData = [
            'contract_name' => 'Updated Contract Name',
        ];

        $contract = Mockery::mock(\App\Contract::class)->makePartial();
        $contract->id = 1;
        $contract->contract_number = 'CNT001';
        $contract->contract_name = 'Old Name';

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($contract);

        $this->repository
            ->shouldReceive('update')
            ->with(1, Mockery::any())
            ->once()
            ->andReturn(true);

        $contract->shouldReceive('load')
            ->with('contractSheets')
            ->once()
            ->andReturn($contract);

        $response = $this->withoutMiddleware()
            ->putJson('/contracts/1', $updateData);

        $response->assertStatus(200);
    }

    /** @test */
    public function it_returns_404_when_updating_non_existent_contract()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->putJson('/contracts/999', ['contract_name' => 'Test']);

        $response->assertStatus(404)
            ->assertJson(['error' => 'Contract not found']);
    }

    /** @test */
    public function it_deletes_a_contract()
    {
        $contract = Mockery::mock(\App\Contract::class)->makePartial();
        $contract->id = 1;

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($contract);

        $sheetMock = Mockery::mock();
        $contract->shouldReceive('contractSheets')->once()->andReturn($sheetMock);
        $sheetMock->shouldReceive('delete')->once()->andReturn(true);

        $this->repository
            ->shouldReceive('delete')
            ->with(1)
            ->once()
            ->andReturn(true);

        $response = $this->withoutMiddleware()
            ->deleteJson('/contracts/1');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Contract and all sheets deleted successfully']);
    }

    /** @test */
    public function it_returns_404_when_deleting_non_existent_contract()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->deleteJson('/contracts/999');

        $response->assertStatus(404)
            ->assertJson(['error' => 'Contract not found']);
    }
}
