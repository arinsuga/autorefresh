<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Repositories\Contracts\ContractSheetRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Mockery;

class ContractSheetControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a project record for foreign key validation
        DB::table('projects')->insert([
            'id' => 1,
            'project_name' => 'Test Project',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        // Create a contract record for foreign key validation
        DB::table('contracts')->insert([
            'id' => 1,
            'project_id' => 1,
            'contract_name' => 'Test Contract',
            'contract_progress' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        // Create another contract for update tests
        DB::table('contracts')->insert([
            'id' => 2,
            'project_id' => 1,
            'contract_name' => 'Test Contract 2',
            'contract_progress' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create a uom record for foreign key validation
        DB::table('uoms')->insert([
            'id' => 1,
            'uom_code' => 'PCS',
            'uom_name' => 'Pieces',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        $this->repository = Mockery::mock(ContractSheetRepositoryInterface::class);
        $this->app->instance(ContractSheetRepositoryInterface::class, $this->repository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_returns_list_of_all_contract_sheets()
    {
        $contractSheets = [
            ['id' => 1, 'contract_id' => 1],
            ['id' => 2, 'contract_id' => 1],
        ];

        $this->repository
            ->shouldReceive('all')
            ->once()
            ->andReturn($contractSheets);

        $response = $this->withoutMiddleware()
            ->getJson('/contractsheets');

        $response->assertStatus(200)
            ->assertJson(['data' => $contractSheets]);
    }

    /** @test */
    public function it_returns_a_single_contract_sheet()
    {
        $contractSheet = ['id' => 1, 'contract_id' => 1];

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($contractSheet);

        $response = $this->withoutMiddleware()
            ->getJson('/contractsheets/1');

        $response->assertStatus(200)
            ->assertJson(['data' => $contractSheet]);
    }

    /** @test */
    public function it_returns_404_when_contract_sheet_not_found()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->getJson('/contractsheets/999');

        $response->assertStatus(404)
            ->assertJson(['error' => 'Contract sheet not found']);
    }

    /** @test */
    public function it_returns_contract_sheets_by_contract()
    {
        $contractSheets = [
            ['id' => 1, 'contract_id' => 1],
            ['id' => 2, 'contract_id' => 1],
        ];

        $this->repository
            ->shouldReceive('getContractSheetsByContract')
            ->with(1)
            ->once()
            ->andReturn($contractSheets);

        $response = $this->withoutMiddleware()
            ->getJson('/contracts/1/sheets');

        $response->assertStatus(200)
            ->assertJson(['data' => $contractSheets]);
    }

    /** @test */
    public function it_creates_a_new_contract_sheet()
    {
        $contractSheetData = [
            'project_id' => 1,
            'contract_id' => 1,
            'sheetgroup_id' => 1,
            'sheetgroup_type' => 1,
            'uom_id' => 1,
            'uom_code' => 'PCS',
        ];

        $createdContractSheet = array_merge(['id' => 3], $contractSheetData);
        // The controller wraps the result in an array for bulkCreate, or returns the collection/array of created items
        // Based on controller: return response()->json(['data' => $contractsheet], 201);
        // If bulkCreate returns the created items, we should expect that.
        
        $this->repository
            ->shouldReceive('bulkCreate')
            ->with(Mockery::on(function ($data) use ($contractSheetData) {
                // Expecting an array containing the contract sheet data
                if (!is_array($data) || count($data) !== 1) {
                    return false;
                }
                $item = $data[0];
                foreach ($contractSheetData as $key => $value) {
                    if (!isset($item[$key]) || $item[$key] !== $value) {
                        return false;
                    }
                }
                return true;
            }))
            ->once()
            ->andReturn([$createdContractSheet]);

        $response = $this->withoutMiddleware()
            ->postJson('/contractsheets', [$contractSheetData]);

        $response->assertStatus(201)
            ->assertJson(['data' => [$createdContractSheet]]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_contract_sheet()
    {
        // specific errors keys would be like '0.project_id', '0.contract_id' because of wildcard validation
        $response = $this->withoutMiddleware()
            ->postJson('/contractsheets', [[]]); 

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['0.project_id', '0.contract_id', '0.sheetgroup_id', '0.uom_id', '0.uom_code']);
    }

    /** @test */
    public function it_updates_an_existing_contract_sheet()
    {
        $updateData = [
            'contract_id' => 2,
        ];

        $existingContractSheet = ['id' => 1, 'contract_id' => 1];
        $updatedContractSheet = array_merge($existingContractSheet, $updateData);

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($existingContractSheet);

        $this->repository
            ->shouldReceive('update')
            ->with(1, $updateData)
            ->once()
            ->andReturn($updatedContractSheet);

        $response = $this->withoutMiddleware()
            ->putJson('/contractsheets/1', $updateData);

        $response->assertStatus(200)
            ->assertJson(['data' => $updatedContractSheet]);
    }

    /** @test */
    public function it_returns_404_when_updating_non_existent_contract_sheet()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->putJson('/contractsheets/999', ['contract_id' => 1]);

        $response->assertStatus(404)
            ->assertJson(['error' => 'Contract sheet not found']);
    }

    /** @test */
    public function it_deletes_a_contract_sheet()
    {
        $contractSheet = ['id' => 1, 'contract_id' => 1];

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($contractSheet);

        $this->repository
            ->shouldReceive('delete')
            ->with(1)
            ->once()
            ->andReturn(true);

        $response = $this->withoutMiddleware()
            ->deleteJson('/contractsheets/1');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Contract sheet deleted successfully']);
    }

    /** @test */
    public function it_returns_404_when_deleting_non_existent_contract_sheet()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->deleteJson('/contractsheets/999');

        $response->assertStatus(404)
            ->assertJson(['error' => 'Contract sheet not found']);
    }
}
