<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;

use JWTAuth;
use App\User;

class AuthController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:api', ['except' => ['login', 'register', 'status']]);
        $this->middleware('authjwt', ['except' => ['login', 'register', 'status']]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user','token'),201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $user = User::where('email', $credentials['email'])->first();

        $userRoles = [];
        foreach ($user->roles as $key => $item) {
            # code...
            array_push($userRoles, ["code" => $item->code, "name" => $item->name]); 
        }

        $claims = [];
        if (isset($user)) {
            $claims = [
                "username" => $user["email"],
                "roles" => $userRoles,
                "bo" => $user["bo"],
                "prv" => [
                    "name" => $user["name"],
                    "email" => $user["email"],
                    "dept" => $user["dept"],
                    "noabsen" => $user["noabsen"],
                ],
            ];
        }
        

        try {

            $token = JWTAuth::claims($claims)
            ->attempt($credentials);

            if (!$token) {
                return response()->json(['error' => 'invalid_credentials'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        return response()->json(compact('token'));
    }

    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    public function blacklist()
    {
        auth()->invalidate();
        return response()->json(['message' => 'Token has been invalidated'], 200);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function status()
    {

        // Check if the user is authenticated
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent'], $e->getStatusCode());
        } catch (\Throwable $e) {
            
            switch ($e->getMessage()) {
                case 'Token Signature could not be verified.':
                    return response()->json(['token_invalid'], 500);
                    break;

                case 'Token has expired':
                    return response()->json(['token_expired'], 500);
                    break;

                default:
                    return response()->json(['token_invalid'], 500);
                    break;
        }

            return response()->json([$e->getMessage()], 500);

        }

        // If no exception is thrown, the user is authenticated
        return response()->json(['authenticated'], 200);

        
    }

}
