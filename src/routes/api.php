<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\StatementController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\LikeController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/v1/users/{id}', [UserController::class, 'index']);
    Route::post('/v1/topics/create', [TopicController::class, 'create']);
    // Route::get('/v1/topics', [TopicController::class, 'index']);
    Route::put('/v1/topics/update', [TopicController::class, 'update']);
    Route::post('/v1/lists/create', [ListController::class, 'create']);
    Route::get('/v1/lists', [ListController::class, 'index']);
    Route::get('/v1/lists/{id}', [ListController::class, 'show']);
    Route::put('/v1/lists/update/{id}', [ListController::class, 'update']);
    Route::delete('/v1/lists/{id}', [ListController::class, 'delete']);
    Route::post('/v1/statements/create', [StatementController::class, 'create']);
    Route::put('/v1/statements/update', [StatementController::class, 'update']);
    Route::delete('/v1/statements/{id}', [StatementController::class, 'delete']);
    Route::post('/v1/likes', [LikeController::class, 'create']);
    Route::delete('/v1/likes', [LikeController::class, 'delete']);
});

Route::get('/v1/topics', [TopicController::class, 'index']);
Route::get('/v1/statements', [StatementController::class, 'index']);
Route::get('/v1/likes', [LikeController::class, 'index']);