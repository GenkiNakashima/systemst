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
            // === Database ===
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
                'title' => 'インデックスを最適化せよ',
                'category' => 'Database',
                'difficulty' => 3,
                'description' => '大量データを持つテーブルへのクエリが遅い。適切なインデックスを設計し、B-Tree構造を理解する',
                'environment_config' => json_encode(['language' => 'sql']),
                'broken_code_snippet' => 'SELECT * FROM orders WHERE user_id = 123 AND status = "pending";',
                'solution_validation_rule' => json_encode(['must_contain' => ['CREATE INDEX', 'user_id', 'status']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'トランザクションと排他制御',
                'category' => 'Database',
                'difficulty' => 4,
                'description' => '銀行の送金処理で同時アクセス時にデータ不整合が発生。トランザクション分離レベルとロックを実装せよ',
                'environment_config' => json_encode(['language' => 'php', 'framework' => 'laravel']),
                'broken_code_snippet' => <<<'PHP'
$user->balance -= 1000;
$user->save();
$recipient->balance += 1000;
$recipient->save();
PHP,
                'solution_validation_rule' => json_encode(['must_contain' => ['DB::transaction', 'lockForUpdate']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => '正規化と非正規化のトレードオフ',
                'category' => 'Database',
                'difficulty' => 3,
                'description' => '高頻度で参照されるユーザーの投稿数。JOIN vs 非正規化（カウンターカラム）のパフォーマンス比較',
                'environment_config' => json_encode(['language' => 'sql']),
                'broken_code_snippet' => 'SELECT users.*, COUNT(posts.id) FROM users LEFT JOIN posts ON users.id = posts.user_id GROUP BY users.id;',
                'solution_validation_rule' => json_encode(['must_contain' => ['ALTER TABLE', 'posts_count']]),
            ],

            // === Network ===
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
                'title' => 'TCP接続の基礎を理解せよ',
                'category' => 'Network',
                'difficulty' => 1,
                'description' => '3-wayハンドシェイク（SYN, SYN-ACK, ACK）の仕組みを理解し、接続確立プロセスを可視化する',
                'environment_config' => json_encode(['type' => 'concept']),
                'broken_code_snippet' => '',
                'solution_validation_rule' => json_encode(['type' => 'quiz']),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'HTTPステータスコードとエラーハンドリング',
                'category' => 'Network',
                'difficulty' => 2,
                'description' => 'APIがエラー時に常に200を返している。適切なステータスコード（400, 401, 404, 500等）を実装せよ',
                'environment_config' => json_encode(['language' => 'php', 'framework' => 'laravel']),
                'broken_code_snippet' => <<<'PHP'
public function show($id) {
    $user = User::find($id);
    if (!$user) {
        return response()->json(['error' => 'Not found'], 200);
    }
    return response()->json($user, 200);
}
PHP,
                'solution_validation_rule' => json_encode(['must_contain' => ['404', '401', '500']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'RESTful API設計の原則',
                'category' => 'Network',
                'difficulty' => 3,
                'description' => '既存のエンドポイント設計がRESTの原則に違反している。適切なHTTPメソッドとURIに修正せよ',
                'environment_config' => json_encode(['language' => 'rest-api']),
                'broken_code_snippet' => <<<'TEXT'
GET  /getUser?id=123
POST /createUser
GET  /deleteUser?id=123
POST /updateUser
TEXT,
                'solution_validation_rule' => json_encode(['must_contain' => ['GET /users', 'POST /users', 'DELETE /users']]),
            ],

            // === Security ===
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
                'title' => 'CSRFトークンを実装せよ',
                'category' => 'Security',
                'difficulty' => 2,
                'description' => 'フォーム送信にCSRF対策を実装する',
                'environment_config' => json_encode(['language' => 'php', 'framework' => 'laravel']),
                'broken_code_snippet' => '<form method="POST" action="/update">',
                'solution_validation_rule' => json_encode(['must_contain' => ['@csrf', 'csrf_field()']]),
            ],

            // === Performance (Algorithm & Data Structure) ===
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
                'title' => '計算量を最適化せよ（O(n²) → O(n)）',
                'category' => 'Performance',
                'difficulty' => 3,
                'description' => '1000万件のデータから重複を検出する処理が遅い。O(n²)の二重ループをハッシュマップでO(n)に改善せよ',
                'environment_config' => json_encode(['language' => 'php']),
                'broken_code_snippet' => <<<'PHP'
$duplicates = [];
foreach ($ids as $i => $id) {
    foreach ($ids as $j => $compareId) {
        if ($i !== $j && $id === $compareId) {
            $duplicates[] = $id;
        }
    }
}
PHP,
                'solution_validation_rule' => json_encode(['must_contain' => ['array_count_values', 'isset', 'hash']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => '配列 vs ハッシュマップの使い分け',
                'category' => 'Performance',
                'difficulty' => 2,
                'description' => 'ユーザーIDの存在チェックをin_array()で行っている。100万件になった時の最適化方法は？',
                'environment_config' => json_encode(['language' => 'php']),
                'broken_code_snippet' => <<<'PHP'
$validIds = [1, 2, 3, ..., 1000000];
if (in_array($userId, $validIds)) {
    // O(n) の線形探索
}
PHP,
                'solution_validation_rule' => json_encode(['must_contain' => ['isset', 'array_flip', 'hash']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => '二分探索でログ検索を高速化',
                'category' => 'Performance',
                'difficulty' => 3,
                'description' => 'ソート済みログデータから特定の時刻範囲を抽出。線形探索O(n)を二分探索O(log n)に改善せよ',
                'environment_config' => json_encode(['language' => 'php']),
                'broken_code_snippet' => <<<'PHP'
foreach ($logs as $log) {
    if ($log['timestamp'] >= $start && $log['timestamp'] <= $end) {
        $results[] = $log;
    }
}
PHP,
                'solution_validation_rule' => json_encode(['must_contain' => ['array_search', 'binary', 'log']]),
            ],

            // === OS & Concurrency ===
            [
                'id' => Str::uuid(),
                'title' => 'レースコンディションを防げ',
                'category' => 'OS',
                'difficulty' => 4,
                'description' => 'マルチスレッドでカウンターを増やす処理で値がおかしくなる。排他制御（Mutex）を実装せよ',
                'environment_config' => json_encode(['language' => 'php']),
                'broken_code_snippet' => <<<'PHP'
// 複数プロセスから同時実行される
$counter = Cache::get('counter', 0);
$counter++;
Cache::put('counter', $counter);
// 期待: 100, 実際: 87 (競合状態)
PHP,
                'solution_validation_rule' => json_encode(['must_contain' => ['Cache::lock', 'atomic', 'increment']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'プロセスとスレッドの違いを理解せよ',
                'category' => 'OS',
                'difficulty' => 2,
                'description' => 'Webサーバーの並行処理モデル。Apache（プロセス）とNginx（イベント駆動）の違いを学ぶ',
                'environment_config' => json_encode(['type' => 'concept']),
                'broken_code_snippet' => '',
                'solution_validation_rule' => json_encode(['type' => 'quiz']),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'スタックオーバーフローを回避せよ',
                'category' => 'OS',
                'difficulty' => 3,
                'description' => '深い再帰処理でスタックオーバーフロー。メモリ構造を理解し、反復処理に変換せよ',
                'environment_config' => json_encode(['language' => 'php']),
                'broken_code_snippet' => <<<'PHP'
function factorial($n) {
    if ($n <= 1) return 1;
    return $n * factorial($n - 1);
}
// factorial(100000) -> Fatal error: Stack overflow
PHP,
                'solution_validation_rule' => json_encode(['must_contain' => ['for', 'while', 'loop']]),
            ],
            [
                'id' => Str::uuid(),
                'title' => 'メモリリークを検出せよ',
                'category' => 'OS',
                'difficulty' => 4,
                'description' => '長時間稼働するワーカープロセスでメモリ使用量が増え続ける。循環参照を解消せよ',
                'environment_config' => json_encode(['language' => 'php']),
                'broken_code_snippet' => <<<'PHP'
class Node {
    public $next;
    public $data;
}
while (true) {
    $node = new Node();
    $node->next = $node; // 循環参照
    processQueue();
}
PHP,
                'solution_validation_rule' => json_encode(['must_contain' => ['unset', 'WeakReference', 'gc_collect_cycles']]),
            ],
        ];

        foreach ($scenarios as $scenario) {
            Scenario::create($scenario);
        }
    }
}
