<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\ProjectRepositoryInterface;

class ProjectController extends Controller
{
    protected $repository;

    public function __construct(ProjectRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index(Request $request)
    {
        $projects = $this->repository->getAllPaginated($request->all());
        return response()->json($projects, 200);
    }

    public function show($id)
    {
        $project = $this->repository->find($id);
        
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        return response()->json(['data' => $project], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_number' => 'required|unique:projects,project_number',
            'project_name' => 'required|string',
            'projectstatus_id' => 'nullable|integer',
        ]);

        $project = $this->repository->create($request->all());
        return response()->json(['data' => $project], 201);
    }

    public function update(Request $request, $id)
    {
        $project = $this->repository->find($id);
        
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        $validated = $request->validate([
            'project_number' => 'unique:projects,project_number,' . $id,
            'project_name' => 'string',
            'projectstatus_id' => 'nullable|integer',
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        $project = $this->repository->find($id);
        
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        // Validation Rule: User can not delete physical data if already use by contract or order.
        if ($project->contracts()->count() > 0 || $project->orders()->count() > 0) {
            return response()->json([
                'error' => 'Conflict',
                'message' => 'Project cannot be deleted because it is already used by contracts or orders.',
                'in_use' => true
            ], 409);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Project deleted successfully'], 200);
    }
}
