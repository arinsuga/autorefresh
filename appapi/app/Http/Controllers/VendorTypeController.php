<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\VendorTypeRepositoryInterface;

class VendorTypeController extends Controller
{
    protected $repository;

    public function __construct(VendorTypeRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index(Request $request)
    {
        $vendortypes = $this->repository->getAllPaginated($request->all());
        return response()->json($vendortypes, 200);
    }

    public function show($id)
    {
        $vendortype = $this->repository->find($id);
        
        if (!$vendortype) {
            return response()->json(['error' => 'Vendor type not found'], 404);
        }

        return response()->json(['data' => $vendortype], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendortype_code' => 'required|unique:vendortypes,vendortype_code',
            'vendortype_name' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $vendortype = $this->repository->create($request->all());
        return response()->json(['data' => $vendortype], 201);
    }

    public function update(Request $request, $id)
    {
        $vendortype = $this->repository->find($id);
        
        if (!$vendortype) {
            return response()->json(['error' => 'Vendor type not found'], 404);
        }

        $validated = $request->validate([
            'vendortype_code' => 'unique:vendortypes,vendortype_code,' . $id,
            'vendortype_name' => 'string',
            'is_active' => 'boolean',
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        $vendortype = $this->repository->find($id);
        
        if (!$vendortype) {
            return response()->json(['error' => 'Vendor type not found'], 404);
        }

        // Validation Rule: User can not delete physical data if already use by vendors.
        if ($vendortype->vendors()->count() > 0) {
            return response()->json([
                'error' => 'Conflict',
                'message' => 'Vendor type cannot be deleted because it is already used by vendors.',
                'in_use' => true
            ], 409);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Vendor type deleted successfully'], 200);
    }
}
