'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import {
  Network,
  Database,
  Shield,
  Zap,
  Search,
  Filter,
  ArrowLeft,
} from 'lucide-react';

type Category = 'All' | 'Network' | 'Database' | 'Security' | 'Performance';

const mockScenarios = [
  {
    id: '1',
    title: 'N+1問題を特定し修正せよ',
    category: 'Database' as const,
    difficulty: 2,
    description: 'APIが急に遅くなった原因を特定し、Eloquentのリレーション読み込みを最適化する',
  },
  {
    id: '2',
    title: 'CORSエラーを解決せよ',
    category: 'Network' as const,
    difficulty: 3,
    description: '特定のオリジンからのアクセスでエラーが出る。HTTPヘッダーの設定を修正する',
  },
  {
    id: '3',
    title: 'XSS脆弱性を修正せよ',
    category: 'Security' as const,
    difficulty: 3,
    description: 'フォームにXSS脆弱性がある。サニタイズ処理を実装する',
  },
  {
    id: '4',
    title: 'SQLインジェクションを防げ',
    category: 'Security' as const,
    difficulty: 4,
    description: 'ログインフォームにSQLインジェクション脆弱性がある。プリペアドステートメントを実装する',
  },
  {
    id: '5',
    title: 'インデックスを最適化せよ',
    category: 'Database' as const,
    difficulty: 3,
    description: '大量データを持つテーブルへのクエリが遅い。適切なインデックスを設計する',
  },
  {
    id: '6',
    title: 'TCP接続の基礎を理解せよ',
    category: 'Network' as const,
    difficulty: 1,
    description: '3-wayハンドシェイクの仕組みを理解し、接続確立プロセスを可視化する',
  },
  {
    id: '7',
    title: 'キャッシュ戦略を実装せよ',
    category: 'Performance' as const,
    difficulty: 4,
    description: 'APIレスポンスのキャッシュを実装し、レスポンス時間を改善する',
  },
  {
    id: '8',
    title: 'CSRFトークンを実装せよ',
    category: 'Security' as const,
    difficulty: 2,
    description: 'フォーム送信にCSRF対策を実装する',
  },
  {
    id: '9',
    title: 'DNS解決の仕組みを理解せよ',
    category: 'Network' as const,
    difficulty: 2,
    description: 'ドメイン名からIPアドレスへの解決プロセスを可視化する',
  },
  {
    id: '10',
    title: '非同期処理で負荷分散せよ',
    category: 'Performance' as const,
    difficulty: 5,
    description: '重い処理をキューに入れて非同期実行し、レスポンス時間を改善する',
  },
];

const categoryConfig = {
  Network: { icon: Network, color: 'bg-blue-500', textColor: 'text-blue-400' },
  Database: { icon: Database, color: 'bg-green-500', textColor: 'text-green-400' },
  Security: { icon: Shield, color: 'bg-red-500', textColor: 'text-red-400' },
  Performance: { icon: Zap, color: 'bg-yellow-500', textColor: 'text-yellow-400' },
};

export default function ScenariosPage() {
  const router = useRouter();
  const { isAuthenticated } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const filteredScenarios = mockScenarios.filter((scenario) => {
    const matchesCategory =
      selectedCategory === 'All' || scenario.category === selectedCategory;
    const matchesSearch =
      scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: Category[] = ['All', 'Network', 'Database', 'Security', 'Performance'];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-white">
            DeepDive Dev
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードへ戻る
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">シナリオ一覧</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="シナリオを検索..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {category === 'All' ? 'すべて' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScenarios.map((scenario) => {
            const config = categoryConfig[scenario.category];
            const Icon = config.icon;

            return (
              <Link
                key={scenario.id}
                href={`/workspace/${scenario.id}`}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${config.color} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm ${config.textColor}`}>
                    {scenario.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {scenario.title}
                </h3>

                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {scenario.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < scenario.difficulty ? 'bg-blue-500' : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">
                    難易度 {scenario.difficulty}/5
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredScenarios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">該当するシナリオが見つかりません</p>
          </div>
        )}
      </main>
    </div>
  );
}
