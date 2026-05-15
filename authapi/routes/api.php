<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Authentication
Route::post('auth/register', 'AuthController@register')->name('auth.register');
Route::post('auth/login', 'AuthController@login')->name('auth.login');
Route::post('auth/logout', 'AuthController@logout')->name('auth.logout');
Route::post('auth/refresh', 'AuthController@refresh')->name('auth.refresh');
Route::delete('auth/blacklist', 'AuthController@blacklist')->name('auth.blacklist');
Route::get('auth/me', 'AuthController@me')->name('auth.me');
Route::get('auth/status', 'AuthController@status')->name('auth.status');

// User Management
Route::group(['middleware' => 'authjwt'], function () {
    Route::get('users', 'UserController@index');
    Route::post('users', 'UserController@store');
    Route::get('users/{id}', 'UserController@show');
    Route::put('users/{id}', 'UserController@update');
    Route::delete('users/{id}', 'UserController@destroy');
    Route::patch('users/{id}/reset-password', 'UserController@resetPassword');
    Route::patch('users/{id}/toggle-status', 'UserController@toggleStatus');
    Route::get('roles', 'UserController@getRoles');
    Route::patch('profile/change-password', 'UserController@changePassword');
});
