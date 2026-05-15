<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\VehicleTypeRepositoryInterface;

class VehicleTypeController extends Controller
{
    protected $repository;

    public function __construct(VehicleTypeRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index(Request $request)
    {
        $vehicleTypes = $this->repository->getAllPaginated($request->all());
        return response()->json($vehicleTypes, 200);
    }

    public function show($id)
    {
        $vehicleType = $this->repository->find($id);

        if (!$vehicleType) {
            return response()->json(['error' => 'Vehicle type not found'], 404);
        }

        return response()->json(['data' => $vehicleType], 200);
    }

    public function store(Request $request)
    {
        if (!$this->isSuper()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'vehicle_type_code' => 'required|string|unique:vehicle_types,vehicle_type_code',
            'vehicle_type_name' => 'required|string|unique:vehicle_types,vehicle_type_name',
        ]);

        $vehicleType = $this->repository->create($request->all());
        return response()->json(['data' => $vehicleType], 201);
    }

    public function update(Request $request, $id)
    {
        if (!$this->isSuper()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $vehicleType = $this->repository->find($id);

        if (!$vehicleType) {
            return response()->json(['error' => 'Vehicle type not found'], 404);
        }

        $request->validate([
            'vehicle_type_code' => 'required|string|unique:vehicle_types,vehicle_type_code,' . $id,
            'vehicle_type_name' => 'required|string|unique:vehicle_types,vehicle_type_name,' . $id,
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        if (!$this->isSuper()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $vehicleType = $this->repository->find($id);

        if (!$vehicleType) {
            return response()->json(['error' => 'Vehicle type not found'], 404);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Vehicle type deleted successfully'], 200);
    }

    public function getActive()
    {
        $vehicleTypes = $this->repository->getActive();
        return response()->json(['data' => $vehicleTypes], 200);
    }
}
