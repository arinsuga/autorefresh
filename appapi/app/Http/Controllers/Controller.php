<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Constants\Roles;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function checkRole($roles)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) return false;
            
            return $user->roles()->whereIn('code', (array)$roles)->exists();
        } catch (\Exception $e) {
            return false;
        }
    }

    protected function isMaster()
    {
        return $this->checkRole(Roles::master());
    }

    protected function isSuper()
    {
        return $this->checkRole([Roles::master(), Roles::super()]);
    }
}
