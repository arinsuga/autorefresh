<?php

namespace App\Http\Controllers;

use App\ProjectStatus;
use App\Repositories\Contracts\ProjectStatusRepositoryInterface;
use Illuminate\Http\Request;

class ProjectStatusController extends Controller
{
    protected $projectStatusRepository;

    public function __construct(ProjectStatusRepositoryInterface $projectStatusRepository)
    {
        $this->projectStatusRepository = $projectStatusRepository;
        $this->middleware('authjwt');
    }

    public function index()
    {
        $statuses = $this->projectStatusRepository->all();
        return response()->json(['data' => $statuses], 200);
    }

    public function show($id)
    {
        $status = $this->projectStatusRepository->find($id);
        
        if (!$status) {
            return response()->json(['error' => 'Project Status not found'], 404);
        }

        return response()->json(['data' => $status], 200);
    }
}
