<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\VendorRepositoryInterface;

class VendorController extends Controller
{
    protected $repository;

    public function __construct(VendorRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index(Request $request)
    {
        $vendors = $this->repository->getAllPaginated($request->all());
        return response()->json($vendors, 200);
    }

    public function show($id)
    {
        $vendor = $this->repository->find($id);
        
        if (!$vendor) {
            return response()->json(['error' => 'Vendor not found'], 404);
        }

        return response()->json(['data' => $vendor], 200);
    }

    public function getByType($vendorTypeId)
    {
        $vendors = $this->repository->getVendorsByType($vendorTypeId);
        return response()->json(['data' => $vendors], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_code' => 'required|unique:vendors,vendor_code',
            'vendor_name' => 'required|string',
            'vendortype_id' => 'required|exists:vendortypes,id',
            'is_active' => 'boolean',
        ]);

        $vendor = $this->repository->create($request->all());
        return response()->json(['data' => $vendor], 201);
    }

    public function update(Request $request, $id)
    {
        $vendor = $this->repository->find($id);
        
        if (!$vendor) {
            return response()->json(['error' => 'Vendor not found'], 404);
        }

        $validated = $request->validate([
            'vendor_code' => 'unique:vendors,vendor_code,' . $id,
            'vendor_name' => 'string',
            'vendortype_id' => 'exists:vendortypes,id',
            'is_active' => 'boolean',
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        $vendor = $this->repository->find($id);
        
        if (!$vendor) {
            return response()->json(['error' => 'Vendor not found'], 404);
        }

        // Validation Rule: User can not delete physical data if already use by order or ordersheet items.
        if ($vendor->orders()->count() > 0 || $vendor->ordersheets()->count() > 0) {
            return response()->json([
                'error' => 'Conflict',
                'message' => 'Vendor cannot be deleted because it is already used by orders or ordersheet items.',
                'in_use' => true
            ], 409);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Vendor deleted successfully'], 200);
    }
}
