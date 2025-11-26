'use client';

import { Post } from '@/types';
import { TrendingUp, Trophy } from 'lucide-react';

interface TrendingPostsProps {
  posts: Post[];
}

export default function TrendingPosts({ posts }: TrendingPostsProps) {
  const getTrophyColor = (index: number) => {
    switch (index) {
      case 0:
        return 'text-yellow-400';
      case 1:
        return 'text-slate-300';
      case 2:
        return 'text-orange-600';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-yellow-400" />
        急上昇 TOP3
      </h2>

      {posts.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-4">
          まだ急上昇投稿がありません
        </p>
      ) : (
        <div className="space-y-3">
          {posts.slice(0, 3).map((post, index) => (
            <div
              key={post.id}
              className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <Trophy className={`w-5 h-5 flex-shrink-0 ${getTrophyColor(index)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">
                      {post.user.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      Lv.{post.user.currentLevel}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2 mb-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-semibold text-yellow-400">
                      {post.reactions_count}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
