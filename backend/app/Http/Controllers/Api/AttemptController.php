<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserAttempt;
use App\Models\AIFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AttemptController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'scenario_id' => 'required|uuid|exists:scenarios,id',
            'code_snapshot' => 'required|string',
        ]);

        $attempt = UserAttempt::create([
            'id' => Str::uuid(),
            'user_id' => $request->user()->id,
            'scenario_id' => $request->scenario_id,
            'status' => 'In_Progress',
            'code_snapshot' => $request->code_snapshot,
        ]);

        return response()->json($attempt, 201);
    }

    public function submit(Request $request, UserAttempt $attempt)
    {
        $request->validate([
            'code_snapshot' => 'required|string',
        ]);

        // Update attempt
        $attempt->update([
            'code_snapshot' => $request->code_snapshot,
            'execution_time_ms' => $request->execution_time_ms ?? null,
        ]);

        // TODO: Integrate with AI service for actual feedback
        // For now, return mock feedback
        $feedback = AIFeedback::create([
            'id' => Str::uuid(),
            'attempt_id' => $attempt->id,
            'feedback_content' => $this->generateMockFeedback($request->code_snapshot),
            'score' => rand(60, 100),
        ]);

        return response()->json([
            'attempt' => $attempt,
            'feedback' => $feedback,
        ]);
    }

    public function history(Request $request)
    {
        $attempts = UserAttempt::where('user_id', $request->user()->id)
            ->with(['scenario', 'feedbacks'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($attempts);
    }

    private function generateMockFeedback(string $code): string
    {
        // Mock feedback generation
        if (str_contains($code, 'with(') || str_contains($code, 'withCount(')) {
            return "素晴らしい！Eager Loadingを正しく実装しています。\n\nN+1問題を解決することで、クエリ数が大幅に削減され、パフォーマンスが向上しました。";
        }

        return "コードを確認しました。\n\nN+1問題がまだ解決されていません。with()またはwithCount()メソッドを使用して、Eager Loadingを実装してください。";
    }
}
