<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Constants\Roles;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('authjwt');
    }

    private function checkRole($roles)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) return false;
            
            return $user->roles()->whereIn('code', (array)$roles)->exists();
        } catch (\Exception $e) {
            return false;
        }
    }

    private function isMaster()
    {
        return $this->checkRole(Roles::master());
    }

    private function isSuper()
    {
        return $this->checkRole(Roles::super());
    }

    private function isAdmin()
    {
        return $this->checkRole(Roles::admin());
    }

    public function index()
    {
        $currentUser = JWTAuth::user();
        // MASTER, SUPER and ADMIN can see user list
        if (!$this->isMaster() && !$this->isSuper() && !$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = User::with('roles')->where('id', '!=', $currentUser->id);

        // If user is arf-super (but not mstrole), exclude mstrole users
        $currentUserRoles = $currentUser->roles->pluck('code')->toArray();
        if (in_array(Roles::super(), $currentUserRoles) && !in_array(Roles::master(), $currentUserRoles)) {
            $query->whereDoesntHave('roles', function ($q) {
                $q->where('code', Roles::master());
            });
        }

        // If user is arf-admin, exclude mstrole and arf-super users
        if (in_array(Roles::admin(), $currentUserRoles) && !in_array(Roles::master(), $currentUserRoles) && !in_array(Roles::super(), $currentUserRoles)) {
            $query->whereDoesntHave('roles', function ($q) {
                $q->whereIn('code', [Roles::master(), Roles::super()]);
            });
        }

        $users = $query->get();
        $formattedUsers = $users->map(function ($user) {
            $roles = $user->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'code' => $role->code,
                    'name' => $role->name,
                ];
            });
            $userArray = $user->toArray();
            $userArray['roles'] = $roles;
            return $userArray;
        });

        return response()->json(['data' => $formattedUsers], 200);
    }

    public function show($id)
    {
        if (!$this->isMaster() && !$this->isSuper()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::with('roles')->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['data' => $user], 200);
    }

    public function store(Request $request)
    {
        if (!$this->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'roles' => 'array',
            'app_id' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'disabled' => $request->disabled ?? false,
        ]);

        if ($request->has('roles')) {
            $syncData = [];
            $appId = $request->input('app_id', 1); // Default to app 1
            foreach ($request->roles as $roleId) {
                $syncData[$roleId] = ['app_id' => $appId];
            }
            $user->roles()->sync($syncData);
        }

        $user->load('roles');
        $formattedRoles = $user->roles->map(function ($role) {
            return [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
            ];
        });
        $userArray = $user->toArray();
        $userArray['roles'] = $formattedRoles;

        return response()->json(['data' => $userArray], 201);
    }

    public function update(Request $request, $id)
    {
        if (!$this->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $id,
            'roles' => 'array',
            'app_id' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user->update($request->only(['name', 'email', 'disabled']));

        if ($request->has('roles')) {
            // Check if user is trying to change role to/from mstrole
            $currentRoles = $user->roles->pluck('code')->toArray();
            $newRoleIds = $request->roles;
            $newRoles = Role::whereIn('id', $newRoleIds)->pluck('code')->toArray();

            $isTargetMst = in_array(Roles::master(), $currentRoles);
            $isNewMst = in_array(Roles::master(), $newRoles);

            if (($isTargetMst || $isNewMst) && !$this->isMaster()) {
                return response()->json(['message' => 'Only Master can change masterrole assignments'], 403);
            }

            $syncData = [];
            $appId = $request->input('app_id', 1);
            foreach ($newRoleIds as $roleId) {
                $syncData[$roleId] = ['app_id' => $appId];
            }
            $user->roles()->sync($syncData);
        }

        $user->load('roles');
        $formattedRoles = $user->roles->map(function ($role) {
            return [
                'id' => $role->id,
                'code' => $role->code,
                'name' => $role->name,
            ];
        });
        $userArray = $user->toArray();
        $userArray['roles'] = $formattedRoles;

        return response()->json(['data' => $userArray], 200);
    }

    public function destroy($id)
    {
        if (!$this->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (in_array(Roles::master(), $user->roles->pluck('code')->toArray())) {
            return response()->json(['message' => 'Cannot delete master user'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted'], 200);
    }

    public function resetPassword(Request $request, $id)
    {
        if (!$this->isMaster() && !$this->isSuper() && !$this->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // SUPER cannot reset MASTER password
        if ($this->isSuper() && !$this->isMaster()) {
            $targetRoles = $user->roles->pluck('code')->toArray();
            if (in_array(Roles::master(), $targetRoles)) {
                return response()->json(['message' => 'Super cannot reset Master password'], 403);
            }
        }

        // ADMIN cannot reset MASTER or SUPER password
        if ($this->isAdmin() && !$this->isMaster() && !$this->isSuper()) {
            $targetRoles = $user->roles->pluck('code')->toArray();
            if (in_array(Roles::master(), $targetRoles) || in_array(Roles::super(), $targetRoles)) {
                return response()->json(['message' => 'Admin cannot reset Master or Super password'], 403);
            }
        }

        $validator = Validator::make($request->all(), [
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Password reset successfully'], 200);
    }

    public function toggleStatus(Request $request, $id)
    {
        if (!$this->isMaster()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (in_array(Roles::master(), $user->roles->pluck('code')->toArray())) {
            return response()->json(['message' => 'Cannot disable master user'], 403);
        }

        $user->disabled = !$user->disabled;
        $user->save();

        return response()->json(['data' => $user], 200);
    }

    public function getRoles(Request $request)
    {
        $appId = $request->input('app_id');
        error_log('getRoles request app_id: ' . ($appId ?? 'NULL'));
        
        if (!$this->isMaster() && !$this->isSuper()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($appId) {
            $roles = Role::where('app_id', $appId)->get();
        } else {
            $roles = Role::all();
        }
        
        error_log('getRoles count: ' . count($roles));
        return response()->json(['data' => $roles], 200);
    }

    public function changePassword(Request $request)
    {
        $user = JWTAuth::user();
        
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['current_password' => ['The provided password does not match our records.']], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password changed successfully'], 200);
    }
}
