<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\Contracts\UomNormalizationRepositoryInterface;

class UomNormalizationController extends Controller
{
    protected $repository;

    public function __construct(UomNormalizationRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $normalizations = $this->repository->all();
        return response()->json($normalizations);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'raw_uom_code' => 'required|string|max:255|unique:uom_normalizations,raw_uom_code',
            'uom_code' => 'required|string|max:255',
            'language' => 'nullable|string|in:en,id,mixed',
            'is_indonesian_specific' => 'boolean'
        ]);

        $normalization = $this->repository->create($validated);
        return response()->json($normalization, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $normalization = $this->repository->find($id);
        return response()->json($normalization);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'raw_uom_code' => 'required|string|max:255|unique:uom_normalizations,raw_uom_code,' . $id,
            'uom_code' => 'required|string|max:255',
            'language' => 'nullable|string|in:en,id,mixed',
            'is_indonesian_specific' => 'boolean'
        ]);

        $normalization = $this->repository->update($id, $validated);
        return response()->json($normalization);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->repository->delete($id);
        return response()->json(null, 204);
    }
}
