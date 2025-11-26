<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ScenarioController;
use App\Http\Controllers\Api\AttemptController;
use App\Http\Controllers\Api\SkillController;
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
});
