<?php

namespace App\Repositories;

use App\Project;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\Repositories\Data\EloquentRepository;

class ProjectRepository extends EloquentRepository implements ProjectRepositoryInterface
{
    protected $project;

    public function getProjectsByActive()
    {
        return $this->data->where('is_active', 1)->get();
    }

    public function getProjectByCode($code)
    {
        return $this->data->where('project_number', $code)->first();
    }

    public function getByProject($projectId)
    {
        return $this->data->where('project_id', $projectId)->get();
    }

    public function getAllPaginated($params)
    {
        $query = $this->data;

        // Search Logic
        if (!empty($params['search_query'])) {
            $search = '%' . $params['search_query'] . '%';
            $column = !empty($params['search_column']) ? $params['search_column'] : '';

            $allowedColumns = ['project_number', 'project_name'];
            
            if (in_array($column, $allowedColumns)) {
                 $query->where($column, 'like', $search);
            } else {
                 $query->where(function($q) use ($search) {
                     $q->where('project_name', 'like', $search)
                       ->orWhere('project_number', 'like', $search);
                 });
            }
        }

        // Sort Logic
        $sortBy = !empty($params['sort_by']) ? $params['sort_by'] : 'id';
        $sortOrder = !empty($params['sort_order']) ? $params['sort_order'] : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination Logic
        $perPage = !empty($params['per_page']) ? $params['per_page'] : 10;
        return $query->paginate($perPage);
    }
}
