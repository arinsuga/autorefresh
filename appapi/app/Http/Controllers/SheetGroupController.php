<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\SheetGroupRepositoryInterface;

class SheetGroupController extends Controller
{
    protected $repository;

    public function __construct(SheetGroupRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index(Request $request)
    {
        $sheetgroups = $this->repository->getAllPaginated($request->all());
        return response()->json($sheetgroups, 200);
    }

    public function show($id)
    {
        $sheetgroup = $this->repository->find($id);
        
        if (!$sheetgroup) {
            return response()->json(['error' => 'Sheet group not found'], 404);
        }

        return response()->json(['data' => $sheetgroup], 200);
    }

    public function getByType($type)
    {
        $sheetgroups = $this->repository->getSheetGroupsByType($type);
        return response()->json(['data' => $sheetgroups], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sheetgroup_code' => 'required|unique:sheetgroups,sheetgroup_code',
            'sheetgroup_name' => 'required|string',
            'sheetgroup_type' => 'required|integer',
            'is_active' => 'boolean',
        ]);

        $sheetgroup = $this->repository->create($request->all());
        return response()->json(['data' => $sheetgroup], 201);
    }

    public function update(Request $request, $id)
    {
        $sheetgroup = $this->repository->find($id);
        
        if (!$sheetgroup) {
            return response()->json(['error' => 'Sheet group not found'], 404);
        }

        $validated = $request->validate([
            'sheetgroup_code' => 'unique:sheetgroups,sheetgroup_code,' . $id,
            'sheetgroup_name' => 'string',
            'sheetgroup_type' => 'integer',
            'is_active' => 'boolean',
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        $sheetgroup = $this->repository->find($id);
        
        if (!$sheetgroup) {
            return response()->json(['error' => 'Sheet group not found'], 404);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Sheet group deleted successfully'], 200);
    }
}
