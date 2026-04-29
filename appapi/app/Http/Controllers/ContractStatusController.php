<?php

namespace App\Http\Controllers;

use App\ContractStatus;
use App\Repositories\Contracts\ContractStatusRepositoryInterface;
use Illuminate\Http\Request;

class ContractStatusController extends Controller
{
    protected $contractStatusRepository;

    public function __construct(ContractStatusRepositoryInterface $contractStatusRepository)
    {
        $this->contractStatusRepository = $contractStatusRepository;
    }

    public function index()
    {
        return $this->contractStatusRepository->all();
    }

    public function show($id)
    {
        return $this->contractStatusRepository->find($id);
    }
}
