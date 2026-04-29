<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\RefftypeRepositoryInterface;

class RefftypeController extends Controller
{
    protected $repository;

    public function __construct(RefftypeRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index(Request $request)
    {
        $refftypes = $this->repository->getAllPaginated($request->all());
        return response()->json($refftypes, 200);
    }

    public function show($id)
    {
        $refftype = $this->repository->find($id);
        
        if (!$refftype) {
            return response()->json(['error' => 'Reference type not found'], 404);
        }

        return response()->json(['data' => $refftype], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'refftype_code' => 'required|unique:refftypes,refftype_code',
            'refftype_name' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $refftype = $this->repository->create($request->all());
        return response()->json(['data' => $refftype], 201);
    }

    public function update(Request $request, $id)
    {
        $refftype = $this->repository->find($id);
        
        if (!$refftype) {
            return response()->json(['error' => 'Reference type not found'], 404);
        }

        $validated = $request->validate([
            'refftype_code' => 'unique:refftypes,refftype_code,' . $id,
            'refftype_name' => 'string',
            'is_active' => 'boolean',
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        $refftype = $this->repository->find($id);
        
        if (!$refftype) {
            return response()->json(['error' => 'Reference type not found'], 404);
        }

        // Validation Rule: User can not delete physical data if already use by ordersheet items.
        if ($refftype->ordersheets()->count() > 0) {
            return response()->json([
                'error' => 'Conflict',
                'message' => 'Reference type cannot be deleted because it is already used by ordersheet items.',
                'in_use' => true
            ], 409);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Reference type deleted successfully'], 200);
    }
}
