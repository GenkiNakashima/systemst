<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SkillMatrix;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function show(Request $request)
    {
        $skillMatrix = SkillMatrix::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'network_score' => 0,
                'db_score' => 0,
                'security_score' => 0,
                'performance_score' => 0,
            ]
        );

        return response()->json($skillMatrix);
    }

    public function update(Request $request)
    {
        $request->validate([
            'network_score' => 'integer|min:0|max:100',
            'db_score' => 'integer|min:0|max:100',
            'security_score' => 'integer|min:0|max:100',
            'performance_score' => 'integer|min:0|max:100',
        ]);

        $skillMatrix = SkillMatrix::updateOrCreate(
            ['user_id' => $request->user()->id],
            $request->only(['network_score', 'db_score', 'security_score', 'performance_score'])
        );

        return response()->json($skillMatrix);
    }
}
