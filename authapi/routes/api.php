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
