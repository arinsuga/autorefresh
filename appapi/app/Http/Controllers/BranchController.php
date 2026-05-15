<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\BranchRepositoryInterface;

class BranchController extends Controller
{
    protected $repository;

    public function __construct(BranchRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index(Request $request)
    {
        $branches = $this->repository->getAllPaginated($request->all());
        return response()->json($branches, 200);
    }

    public function show($id)
    {
        $branch = $this->repository->find($id);

        if (!$branch) {
            return response()->json(['error' => 'Branch not found'], 404);
        }

        return response()->json(['data' => $branch], 200);
    }

    public function store(Request $request)
    {
        if (!$this->isSuper()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'branch_code' => 'required|string|unique:branches,branch_code',
            'branch_name' => 'required|string|unique:branches,branch_name',
        ]);

        $branch = $this->repository->create($request->all());
        return response()->json(['data' => $branch], 201);
    }

    public function update(Request $request, $id)
    {
        if (!$this->isSuper()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $branch = $this->repository->find($id);

        if (!$branch) {
            return response()->json(['error' => 'Branch not found'], 404);
        }

        $request->validate([
            'branch_code' => 'required|string|unique:branches,branch_code,' . $id,
            'branch_name' => 'required|string|unique:branches,branch_name,' . $id,
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        if (!$this->isSuper()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $branch = $this->repository->find($id);

        if (!$branch) {
            return response()->json(['error' => 'Branch not found'], 404);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Branch deleted successfully'], 200);
    }

    public function getActive()
    {
        $branches = $this->repository->getActive();
        return response()->json(['data' => $branches], 200);
    }
}
