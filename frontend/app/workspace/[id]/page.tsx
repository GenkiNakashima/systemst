'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';
import {
  Play,
  Send,
  Lightbulb,
  ArrowLeft,
  Network,
  Database,
  MessageSquare,
  X,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

// Dynamic imports for client-side only components
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="h-full bg-slate-900 animate-pulse" /> }
);

const mockScenarioData: Record<string, {
  title: string;
  category: string;
  description: string;
  initialCode: string;
  files: { name: string; content: string }[];
}> = {
  '1': {
    title: 'N+1問題を特定し修正せよ',
    category: 'Database',
    description: 'ユーザー一覧APIが遅い原因を特定し、修正してください',
    initialCode: `<?php
// UserController.php - N+1問題があるコード

namespace App\\Http\\Controllers;

use App\\Models\\User;

class UserController extends Controller
{
    public function index()
    {
        // この実装にはN+1問題があります
        $users = User::all();

        $result = [];
        foreach ($users as $user) {
            $result[] = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                // 各ユーザーごとに投稿を取得（N+1問題）
                'posts_count' => $user->posts->count(),
            ];
        }

        return response()->json($result);
    }
}

// ヒント: Eloquentのwith()メソッドやwithCount()を調べてみましょう`,
    files: [
      { name: 'UserController.php', content: '' },
      { name: 'User.php', content: '' },
      { name: 'Post.php', content: '' },
    ],
  },
  '2': {
    title: 'CORSエラーを解決せよ',
    category: 'Network',
    description: '別ドメインからのAPIアクセスでCORSエラーが発生しています',
    initialCode: `<?php
// cors.php - CORS設定ファイル

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['GET', 'POST'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Content-Type'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];

// 問題: https://app.example.com からのアクセスで
// "Access-Control-Allow-Origin" エラーが発生しています
// 適切な設定に修正してください`,
    files: [
      { name: 'cors.php', content: '' },
      { name: 'api.php', content: '' },
    ],
  },
  '3': {
    title: 'XSS脆弱性を修正せよ',
    category: 'Security',
    description: 'コメント投稿フォームにXSS脆弱性があります',
    initialCode: `<?php
// CommentController.php - XSS脆弱性があるコード

namespace App\\Http\\Controllers;

use App\\Models\\Comment;
use Illuminate\\Http\\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $comment = new Comment();
        // 危険: ユーザー入力をそのまま保存
        $comment->content = $request->input('content');
        $comment->user_id = auth()->id();
        $comment->save();

        return redirect()->back();
    }

    public function show(Comment $comment)
    {
        // 危険: エスケープなしで出力
        return view('comment', [
            'content' => $comment->content
        ]);
    }
}

// ヒント: htmlspecialchars()やBladeの{{ }}構文を調べてみましょう`,
    files: [
      { name: 'CommentController.php', content: '' },
      { name: 'comment.blade.php', content: '' },
    ],
  },
};

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, code, setCode, output, setOutput, runCode, chatMessages, addChatMessage } = useStore();

  const [activeTab, setActiveTab] = useState<'network' | 'db'>('network');
  const [showChat, setShowChat] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['src']);

  const scenarioId = params.id as string;
  const scenario = mockScenarioData[scenarioId] || mockScenarioData['1'];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setCode(scenario.initialCode);
  }, [isAuthenticated, router, scenario.initialCode, setCode]);

  if (!isAuthenticated) {
    return null;
  }

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('コードを実行中...\n');

    // Simulate execution
    setTimeout(() => {
      if (scenario.category === 'Database') {
        setOutput(`実行結果:
----------------------------------------
クエリログ:
[1] SELECT * FROM users
[2] SELECT * FROM posts WHERE user_id = 1
[3] SELECT * FROM posts WHERE user_id = 2
[4] SELECT * FROM posts WHERE user_id = 3
... (合計 101 クエリ)

⚠️ N+1問題を検出しました
実行時間: 2,340ms
----------------------------------------
ヒント: with() または withCount() を使用してください`);
      } else {
        setOutput(`実行結果:
----------------------------------------
HTTP/1.1 200 OK
Content-Type: application/json

{"status": "success"}
----------------------------------------`);
      }
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    addChatMessage({
      role: 'user',
      content: '採点をお願いします',
    });

    setTimeout(() => {
      addChatMessage({
        role: 'assistant',
        content: `コードを確認しました。

**評価: 70/100**

✅ 良い点:
- コードの構造は理解できています

⚠️ 改善点:
- N+1問題がまだ解決されていません
- \`with()\` または \`withCount()\` メソッドを使用して、Eager Loadingを実装してください

**ヒント:**
\`\`\`php
$users = User::withCount('posts')->get();
\`\`\`

これにより、1回のクエリで全ユーザーの投稿数を取得できます。`,
      });
    }, 1000);
  };

  const handleHint = () => {
    addChatMessage({
      role: 'user',
      content: 'ヒントをください',
    });

    setTimeout(() => {
      addChatMessage({
        role: 'assistant',
        content: `**N+1問題について:**

現在のコードでは、各ユーザーに対して個別にpostsを取得しています。これが「N+1問題」です。

**解決のヒント:**

1. **Eager Loading**: 関連データを事前に読み込む
   - \`with('posts')\` - 関連モデルを一括取得
   - \`withCount('posts')\` - カウントのみ取得

2. **効果:**
   - N+1回のクエリ → 2回のクエリに削減
   - 大幅なパフォーマンス向上

Laravelドキュメントの「Eager Loading」セクションを参照してください。`,
      });
    }, 500);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    addChatMessage({
      role: 'user',
      content: chatInput,
    });
    setChatInput('');

    setTimeout(() => {
      addChatMessage({
        role: 'assistant',
        content: 'ご質問ありがとうございます。具体的にどの部分についてお聞きになりたいですか？コードの特定の行や、概念について詳しく説明できます。',
      });
    }, 800);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/scenarios"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-white">{scenario.title}</h1>
            <p className="text-sm text-slate-400">{scenario.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleHint}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            ヒント
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            実行
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            採点
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Code Editor */}
        <div className="w-1/2 flex flex-col border-r border-slate-700">
          {/* File Tree */}
          <div className="border-b border-slate-700 p-3">
            <div className="text-sm">
              <button
                onClick={() => setExpandedFolders(
                  expandedFolders.includes('src')
                    ? expandedFolders.filter(f => f !== 'src')
                    : [...expandedFolders, 'src']
                )}
                className="flex items-center gap-1 text-slate-300 hover:text-white"
              >
                {expandedFolders.includes('src') ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <Folder className="w-4 h-4 text-blue-400" />
                <span>src</span>
              </button>
              {expandedFolders.includes('src') && (
                <div className="ml-5 mt-1 space-y-1">
                  {scenario.files.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center gap-1 text-slate-400 cursor-pointer hover:text-white"
                    >
                      <File className="w-4 h-4" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language="php"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Terminal Output */}
          <div className="h-48 border-t border-slate-700 bg-black p-3 overflow-auto">
            <div className="text-xs font-mono text-slate-400 mb-2">出力</div>
            <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">
              {output || 'コードを実行すると、ここに結果が表示されます'}
            </pre>
          </div>
        </div>

        {/* Right: Visualizer & Preview */}
        <div className="w-1/2 flex flex-col">
          {/* Visualizer Panel */}
          <div className="h-1/2 border-b border-slate-700 p-4">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('network')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  activeTab === 'network'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Network className="w-4 h-4" />
                Network
              </button>
              <button
                onClick={() => setActiveTab('db')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  activeTab === 'db'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Database className="w-4 h-4" />
                Database
              </button>
            </div>

            {/* Visualizer Content */}
            {activeTab === 'network' ? (
              <NetworkVisualizer />
            ) : (
              <DatabaseVisualizer />
            )}
          </div>

          {/* Bottom: Preview & Chat */}
          <div className="h-1/2 flex">
            {/* Browser Preview */}
            <div className={`${showChat ? 'w-1/2' : 'w-full'} p-4`}>
              <div className="h-full bg-white rounded-lg overflow-hidden">
                <div className="bg-slate-200 px-3 py-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 bg-white rounded px-2 py-1 text-xs text-slate-600">
                    localhost:8000/api/users
                  </div>
                </div>
                <div className="p-4 text-slate-800 text-sm">
                  <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">
{`{
  "users": [
    {"id": 1, "name": "田中太郎", "posts_count": 5},
    {"id": 2, "name": "鈴木花子", "posts_count": 3}
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* AI Chat */}
            {showChat && (
              <div className="w-1/2 border-l border-slate-700 flex flex-col">
                <div className="p-3 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-medium">AIコーチ</span>
                  </div>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-auto p-3 space-y-3">
                  {chatMessages.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      質問があればお気軽にどうぞ！ヒントや採点も行えます。
                    </p>
                  ) : (
                    chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`text-sm ${
                          msg.role === 'user' ? 'text-right' : ''
                        }`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg max-w-[90%] ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleChatSubmit} className="p-3 border-t border-slate-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="質問を入力..."
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Toggle Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

function NetworkVisualizer() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex items-center gap-8">
        {/* Browser */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl">🌐</span>
          </div>
          <span className="text-xs text-slate-400">Browser</span>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-0.5 bg-green-500 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-green-500 transform rotate-45" />
          </div>
          <span className="text-xs text-slate-400 mt-1">HTTP GET</span>
        </div>

        {/* Server */}
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl">🖥️</span>
          </div>
          <span className="text-xs text-slate-400">Server</span>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-0.5 bg-yellow-500 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-yellow-500 transform rotate-45" />
          </div>
          <span className="text-xs text-slate-400 mt-1">SQL Query</span>
        </div>

        {/* Database */}
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl">🗄️</span>
          </div>
          <span className="text-xs text-slate-400">Database</span>
        </div>
      </div>
    </div>
  );
}

function DatabaseVisualizer() {
  const queries = [
    { id: 1, query: 'SELECT * FROM users', time: 5, slow: false },
    { id: 2, query: 'SELECT * FROM posts WHERE user_id = 1', time: 3, slow: false },
    { id: 3, query: 'SELECT * FROM posts WHERE user_id = 2', time: 4, slow: false },
    { id: 4, query: 'SELECT * FROM posts WHERE user_id = 3', time: 3, slow: false },
    { id: 5, query: '... (98 more queries)', time: 0, slow: true },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-slate-300">実行されたクエリ</span>
        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
          ⚠️ N+1検出
        </span>
      </div>
      <div className="space-y-2">
        {queries.map((q) => (
          <div
            key={q.id}
            className={`p-2 rounded text-xs font-mono ${
              q.slow
                ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            <div className="flex justify-between">
              <span className="truncate">{q.query}</span>
              {q.time > 0 && (
                <span className="text-slate-500 ml-2">{q.time}ms</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
