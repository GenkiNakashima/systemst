<?php

namespace Database\Seeders;

use App\Models\Scenario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ScenarioSeeder extends Seeder
{
    public function run(): void
    {
        $scenarios = [
            [
                'id' => Str::uuid(),
                'title' => 'N+1問題を特定し修正せよ',
                'category' => 'Database',
                'difficulty' => 2,
                'description' => 'APIが急に遅くなった原因を特定し、Eloquentのリレーション読み込みを最適化する',
                'environment_config' => json_encode(['language' => 'php', 'framework' => 'laravel']),
                'broken_code_snippet' => '$users = User::all(); foreach ($users as $user) { $count = $user->posts->count(); }',
                'solution_validation_rule' => json_encode(['must_contain' => ['with(', 'withCount(']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'CORSエラーを解決せよ',
                'category' => 'Network',
                'difficulty' => 3,
                'description' => '特定のオリジンからのアクセスでエラーが出る。HTTPヘッダーの設定を修正する',
                'environment_config' => json_encode(['language' => 'php', 'framework' => 'laravel']),
                'broken_code_snippet' => "return ['allowed_origins' => ['http://localhost:3000']];",
                'solution_validation_rule' => json_encode(['must_contain' => ['*', 'allowed_origins']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'XSS脆弱性を修正せよ',
                'category' => 'Security',
                'difficulty' => 3,
                'description' => 'フォームにXSS脆弱性がある。サニタイズ処理を実装する',
                'environment_config' => json_encode(['language' => 'php', 'framework' => 'laravel']),
                'broken_code_snippet' => 'echo $request->input("content");',
                'solution_validation_rule' => json_encode(['must_contain' => ['htmlspecialchars', 'e(']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'SQLインジェクションを防げ',
                'category' => 'Security',
                'difficulty' => 4,
                'description' => 'ログインフォームにSQLインジェクション脆弱性がある。プリペアドステートメントを実装する',
                'environment_config' => json_encode(['language' => 'php', 'framework' => 'laravel']),
                'broken_code_snippet' => 'DB::select("SELECT * FROM users WHERE email = \'" . $email . "\'");',
                'solution_validation_rule' => json_encode(['must_contain' => ['?', 'prepare']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'インデックスを最適化せよ',
                'category' => 'Database',
                'difficulty' => 3,
                'description' => '大量データを持つテーブルへのクエリが遅い。適切なインデックスを設計する',
                'environment_config' => json_encode(['language' => 'sql']),
                'broken_code_snippet' => 'SELECT * FROM orders WHERE user_id = 123 AND status = "pending";',
                'solution_validation_rule' => json_encode(['must_contain' => ['CREATE INDEX', 'user_id', 'status']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'TCP接続の基礎を理解せよ',
                'category' => 'Network',
                'difficulty' => 1,
                'description' => '3-wayハンドシェイクの仕組みを理解し、接続確立プロセスを可視化する',
                'environment_config' => json_encode(['type' => 'concept']),
                'broken_code_snippet' => '',
                'solution_validation_rule' => json_encode(['type' => 'quiz']),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'キャッシュ戦略を実装せよ',
                'category' => 'Performance',
                'difficulty' => 4,
                'description' => 'APIレスポンスのキャッシュを実装し、レスポンス時間を改善する',
                'environment_config' => json_encode(['language' => 'php', 'framework' => 'laravel']),
                'broken_code_snippet' => 'return User::all();',
                'solution_validation_rule' => json_encode(['must_contain' => ['Cache::remember', 'cache()']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'CSRFトークンを実装せよ',
                'category' => 'Security',
                'difficulty' => 2,
                'description' => 'フォーム送信にCSRF対策を実装する',
                'environment_config' => json_encode(['language' => 'php', 'framework' => 'laravel']),
                'broken_code_snippet' => '<form method="POST" action="/update">',
                'solution_validation_rule' => json_encode(['must_contain' => ['@csrf', 'csrf_field()']]),
            ],
        ];

        foreach ($scenarios as $scenario) {
            Scenario::create($scenario);
        }
    }
}
