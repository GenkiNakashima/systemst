<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ScenarioController;
use App\Http\Controllers\Api\AttemptController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\PostController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Scenarios (public)
Route::get('/scenarios', [ScenarioController::class, 'index']);
Route::get('/scenarios/{scenario}', [ScenarioController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Attempts
    Route::post('/attempts', [AttemptController::class, 'store']);
    Route::post('/attempts/{attempt}/submit', [AttemptController::class, 'submit']);
    Route::get('/attempts/history', [AttemptController::class, 'history']);

    // Skills
    Route::get('/skills', [SkillController::class, 'show']);
    Route::put('/skills', [SkillController::class, 'update']);

    // Posts (User Sharing Feature)
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/trending', [PostController::class, 'trending']);
    Route::get('/posts/search', [PostController::class, 'search']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/posts/{post}', [PostController::class, 'show']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
    Route::post('/posts/{post}/replies', [PostController::class, 'addReply']);
    Route::post('/posts/{post}/reactions', [PostController::class, 'toggleReaction']);
});
