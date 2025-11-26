<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Scenario;
use Illuminate\Http\Request;

class ScenarioController extends Controller
{
    public function index(Request $request)
    {
        $query = Scenario::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        $scenarios = $query->get();

        return response()->json($scenarios);
    }

    public function show(Scenario $scenario)
    {
        return response()->json($scenario);
    }
}
