'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { Post } from '@/types';
import PostCard from '@/components/share/PostCard';
import TrendingPosts from '@/components/share/TrendingPosts';
import CreatePost from '@/components/share/CreatePost';
import SearchBar from '@/components/share/SearchBar';
import {
  LogOut,
  TrendingUp,
  Search,
  MessageSquarePlus,
} from 'lucide-react';

export default function SharePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, posts, setPosts, trendingPosts, setTrendingPosts } = useStore();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchPosts();
    fetchTrendingPosts();
  }, [isAuthenticated, router]);

  const fetchPosts = async () => {
    // Mock data for now - replace with actual API call
    const mockPosts: Post[] = [
      {
        id: '1',
        user_id: '1',
        user: {
          id: '1',
          email: 'user1@example.com',
          name: 'テストユーザー1',
          currentLevel: 5,
          createdAt: new Date().toISOString(),
        },
        content: 'ReactのuseEffectフックを使うときは、依存配列を正しく設定することが重要です。特にオブジェクトや配列を依存配列に入れる場合は注意が必要です。',
        is_ai_flagged: false,
        ai_flag_reason: null,
        reactions_count: 15,
        has_reacted: false,
        replies: [],
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '2',
        user_id: '2',
        user: {
          id: '2',
          email: 'user2@example.com',
          name: 'テストユーザー2',
          currentLevel: 3,
          createdAt: new Date().toISOString(),
        },
        content: 'N+1問題を解決する方法を教えてください。データベースクエリが多すぎて遅くなっています。',
        is_ai_flagged: false,
        ai_flag_reason: null,
        reactions_count: 8,
        has_reacted: true,
        replies: [],
        created_at: new Date(Date.now() - 7200000).toISOString(),
        updated_at: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    setPosts(mockPosts);
    setIsLoading(false);
  };

  const fetchTrendingPosts = async () => {
    // Mock data for now
    const mockTrending: Post[] = [
      {
        id: '3',
        user_id: '3',
        user: {
          id: '3',
          email: 'user3@example.com',
          name: 'エキスパート太郎',
          currentLevel: 10,
          createdAt: new Date().toISOString(),
        },
        content: 'TypeScriptの型安全性を活かした開発手法について解説します。Genericsを使うことで、再利用可能なコンポーネントを作成できます。',
        is_ai_flagged: false,
        ai_flag_reason: null,
        reactions_count: 45,
        has_reacted: false,
        replies: [],
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    setTrendingPosts(mockTrending);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 sticky top-0 bg-slate-900 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-white">
              DeepDive Dev
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-slate-300 hover:text-white">
                ダッシュボード
              </Link>
              <Link href="/scenarios" className="text-slate-300 hover:text-white">
                シナリオ
              </Link>
              <Link href="/share" className="text-blue-400 font-semibold">
                共有
              </Link>
              <span className="text-slate-300">
                {user?.name} (Lv.{user?.currentLevel})
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">情報共有</h1>
              <button
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <MessageSquarePlus className="w-5 h-5" />
                投稿する
              </button>
            </div>

            {/* Create Post Form */}
            {showCreatePost && (
              <CreatePost onClose={() => setShowCreatePost(false)} />
            )}

            {/* Search Bar */}
            <SearchBar
              onSearchToggle={(active) => setSearchMode(active)}
            />

            {/* Posts List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center text-slate-400 py-8">
                  読み込み中...
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  投稿がありません。最初の投稿を作成してみましょう!
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Posts */}
            <TrendingPosts posts={trendingPosts} />

            {/* Info Card */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                使い方
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• 最新情報や知識を投稿しましょう</li>
                <li>• スレッド形式で返信できます</li>
                <li>• @checkAI で AIに質問できます</li>
                <li>• 急上昇マークで投稿を評価</li>
                <li>• AIが誤情報を自動チェック</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
