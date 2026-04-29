<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\ServiceTypeRepositoryInterface;

class ServiceTypeController extends Controller
{
    protected $repository;

    public function __construct(ServiceTypeRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('authjwt');
    }

    public function index(Request $request)
    {
        $serviceTypes = $this->repository->getAllPaginated($request->all());
        return response()->json($serviceTypes, 200);
    }

    public function show($id)
    {
        $serviceType = $this->repository->find($id);

        if (!$serviceType) {
            return response()->json(['error' => 'Service type not found'], 404);
        }

        return response()->json(['data' => $serviceType], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'vehicle_type_id' => 'required|exists:vehicle_types,id',
            'service_code'    => 'required|string|unique:service_types,service_code',
            'service_name'    => 'required|string|unique:service_types,service_name',
            'service_price'   => 'required|numeric|min:0',
        ]);

        $serviceType = $this->repository->create($request->all());
        return response()->json(['data' => $serviceType], 201);
    }

    public function update(Request $request, $id)
    {
        $serviceType = $this->repository->find($id);

        if (!$serviceType) {
            return response()->json(['error' => 'Service type not found'], 404);
        }

        $request->validate([
            'vehicle_type_id' => 'exists:vehicle_types,id',
            'service_code'    => 'required|string|unique:service_types,service_code,' . $id,
            'service_name'    => 'required|string|unique:service_types,service_name,' . $id,
            'service_price'   => 'numeric|min:0',
        ]);

        $updated = $this->repository->update($id, $request->all());
        return response()->json(['data' => $updated], 200);
    }

    public function destroy($id)
    {
        $serviceType = $this->repository->find($id);

        if (!$serviceType) {
            return response()->json(['error' => 'Service type not found'], 404);
        }

        $this->repository->delete($id);
        return response()->json(['message' => 'Service type deleted successfully'], 200);
    }

    public function getActive()
    {
        $serviceTypes = $this->repository->getActive();
        return response()->json(['data' => $serviceTypes], 200);
    }

    public function getByVehicleType($vehicleTypeId)
    {
        $serviceTypes = $this->repository->getByVehicleType($vehicleTypeId);
        return response()->json(['data' => $serviceTypes], 200);
    }
}
