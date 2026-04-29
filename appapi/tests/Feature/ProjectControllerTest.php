<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use Mockery;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = Mockery::mock(ProjectRepositoryInterface::class);
        $this->app->instance(ProjectRepositoryInterface::class, $this->repository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_returns_list_of_active_projects()
    {
        $projects = [
            ['id' => 1, 'project_name' => 'Project 1', 'projectstatus_id' => 0, 'is_active' => true],
            ['id' => 2, 'project_name' => 'Project 2', 'projectstatus_id' => 0, 'is_active' => true],
        ];

        $this->repository
            ->shouldReceive('getProjectsByActive')
            ->once()
            ->andReturn($projects);

        $response = $this->withoutMiddleware()
            ->getJson('/projects');

        $response->assertStatus(200)
            ->assertJson(['data' => $projects]);
    }

    /** @test */
    public function it_returns_a_single_project()
    {
        $project = ['id' => 1, 'project_name' => 'Project 1', 'projectstatus_id' => 0, 'is_active' => true];

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($project);

        $response = $this->withoutMiddleware()
            ->getJson('/projects/1');

        $response->assertStatus(200)
            ->assertJson(['data' => $project]);
    }

    /** @test */
    public function it_returns_404_when_project_not_found()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->getJson('/projects/999');

        $response->assertStatus(404)
            ->assertJson(['error' => 'Project not found']);
    }

    /** @test */
    public function it_creates_a_new_project()
    {
        $projectData = [
            'project_number' => 'PRJ-001',
            'project_name' => 'New Project',
            'projectstatus_id' => 0,
            'is_active' => true,
        ];

        $createdProject = array_merge(['id' => 3], $projectData);

        $this->repository
            ->shouldReceive('create')
            ->with($projectData)
            ->once()
            ->andReturn($createdProject);

        $response = $this->withoutMiddleware()
            ->postJson('/projects', $projectData);

        $response->assertStatus(201)
            ->assertJson(['data' => $createdProject]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_project()
    {
        $response = $this->withoutMiddleware()
            ->postJson('/projects', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['project_number', 'project_name']);
    }

    /** @test */
    public function it_validates_unique_project_number_when_creating()
    {
        // This test would require database setup or more complex mocking
        // Skipping for now as it requires actual database interaction
        $this->markTestSkipped('Requires database setup for unique validation');
    }

    /** @test */
    public function it_updates_an_existing_project()
    {
        $updateData = [
            'project_name' => 'Updated Project Name',
            'projectstatus_id' => 1,
            'is_active' => false,
        ];

        $existingProject = ['id' => 1, 'project_name' => 'Old Name', 'projectstatus_id' => 0, 'is_active' => true];
        $updatedProject = array_merge($existingProject, $updateData);

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($existingProject);

        $this->repository
            ->shouldReceive('update')
            ->with(1, $updateData)
            ->once()
            ->andReturn($updatedProject);

        $response = $this->withoutMiddleware()
            ->putJson('/projects/1', $updateData);

        $response->assertStatus(200)
            ->assertJson(['data' => $updatedProject]);
    }

    /** @test */
    public function it_returns_404_when_updating_non_existent_project()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->putJson('/projects/999', ['project_name' => 'Test']);

        $response->assertStatus(404)
            ->assertJson(['error' => 'Project not found']);
    }

    /** @test */
    public function it_deletes_a_project()
    {
        $project = ['id' => 1, 'project_name' => 'Project 1', 'projectstatus_id' => 0, 'is_active' => true];

        $this->repository
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($project);

        $this->repository
            ->shouldReceive('delete')
            ->with(1)
            ->once()
            ->andReturn(true);

        $response = $this->withoutMiddleware()
            ->deleteJson('/projects/1');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Project deleted successfully']);
    }

    /** @test */
    public function it_returns_404_when_deleting_non_existent_project()
    {
        $this->repository
            ->shouldReceive('find')
            ->with(999)
            ->once()
            ->andReturn(null);

        $response = $this->withoutMiddleware()
            ->deleteJson('/projects/999');

        $response->assertStatus(404)
            ->assertJson(['error' => 'Project not found']);
    }
}
