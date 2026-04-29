<?php

namespace Tests\Unit\Repositories;

use Tests\TestCase;
use App\Repositories\ContractSheetRepository;
use App\ContractSheet;
use App\SheetGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

class ContractSheetRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Setup necessary data
        DB::table('projects')->insert(['id' => 1, 'project_name' => 'Test', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('contracts')->insert(['id' => 1, 'project_id' => 1, 'contract_name' => 'Test', 'created_at' => now(), 'updated_at' => now()]);
        DB::table('uoms')->insert(['id' => 1, 'uom_code' => 'PCS', 'uom_name' => 'Pieces', 'created_at' => now(), 'updated_at' => now()]);
        
        $this->repository = new ContractSheetRepository(new ContractSheet());
    }

    /** @test */
    public function it_sets_sheetgroup_seqno_on_create()
    {
        $group = SheetGroup::create([
            'sheetgroup_code' => 'G1',
            'sheetgroup_name' => 'Group 1',
            'sheetgroup_type' => 1,
            'sheetgroup_seqno' => 5,
        ]);

        $data = [
            'project_id' => 1,
            'contract_id' => 1,
            'sheetgroup_id' => $group->id,
            'uom_id' => 1,
            'uom_code' => 'PCS',
            'sheet_code' => 'S1',
            'sheetgroup_type' => 1
        ];

        $result = $this->repository->create($data);

        $this->assertEquals(5, $result->sheetgroup_seqno);
        $this->assertDatabaseHas('contractsheets', [
            'id' => $result->id,
            'sheetgroup_seqno' => 5
        ]);
    }

    /** @test */
    public function it_sets_sheetgroup_seqno_on_bulk_create()
    {
        $group = SheetGroup::create([
            'sheetgroup_code' => 'G2',
            'sheetgroup_name' => 'Group 2',
            'sheetgroup_type' => 1,
            'sheetgroup_seqno' => 7,
        ]);

        $data = [
            [
                'project_id' => 1,
                'contract_id' => 1,
                'sheetgroup_id' => $group->id,
                'uom_id' => 1,
                'uom_code' => 'PCS',
                'sheet_code' => 'S1',
                'sheetgroup_type' => 1
            ],
            [
                'project_id' => 1,
                'contract_id' => 1,
                'sheetgroup_id' => $group->id,
                'uom_id' => 1,
                'uom_code' => 'PCS',
                'sheet_code' => 'S2',
                'sheetgroup_type' => 1
            ]
        ];

        $this->repository->bulkCreate($data);

        $this->assertDatabaseHas('contractsheets', ['sheet_code' => 'S1', 'sheetgroup_seqno' => 7]);
        $this->assertDatabaseHas('contractsheets', ['sheet_code' => 'S2', 'sheetgroup_seqno' => 7]);
    }

    /** @test */
    public function it_sets_sheetgroup_seqno_on_update()
    {
        $groupSync = SheetGroup::create([
            'sheetgroup_code' => 'G3',
            'sheetgroup_name' => 'Group 3',
            'sheetgroup_type' => 1,
            'sheetgroup_seqno' => 9,
        ]);

        $sheet = ContractSheet::create([
            'project_id' => 1,
            'contract_id' => 1,
            'sheetgroup_id' => 1, // dummy
            'uom_id' => 1,
            'uom_code' => 'PCS',
            'sheet_code' => 'S1',
            'sheetgroup_type' => 1,
            'sheetgroup_seqno' => 1
        ]);

        $this->repository->update($sheet->id, ['sheetgroup_id' => $groupSync->id]);

        $this->assertDatabaseHas('contractsheets', [
            'id' => $sheet->id,
            'sheetgroup_id' => $groupSync->id,
            'sheetgroup_seqno' => 9
        ]);
    }
}
