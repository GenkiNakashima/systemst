'use client';

import { useState } from 'react';
import { Post, Reply } from '@/types';
import { useStore } from '@/store/useStore';
import {
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Bot,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user, updatePost, removePost } = useStore();
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReplies, setLocalReplies] = useState<Reply[]>(post.replies || []);

  const handleReaction = async () => {
    // Mock - replace with actual API call
    updatePost(post.id, {
      has_reacted: !post.has_reacted,
      reactions_count: post.has_reacted
        ? post.reactions_count - 1
        : post.reactions_count + 1,
    });
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);

    // Mock reply - replace with actual API call
    const newReply: Reply = {
      id: Date.now().toString(),
      post_id: post.id,
      user_id: replyContent.includes('@checkAI') ? null : user?.id || '',
      user: replyContent.includes('@checkAI')
        ? null
        : user || null,
      content: replyContent.includes('@checkAI')
        ? 'これはAIからの自動応答です。実際の実装では、OpenAI APIを使用して適切な回答を生成します。'
        : replyContent,
      is_ai_response: replyContent.includes('@checkAI'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setLocalReplies([...localReplies, newReply]);
    setReplyContent('');
    setIsSubmitting(false);
    setShowReplies(true);
  };

  const handleDelete = async () => {
    if (confirm('この投稿を削除しますか?')) {
      // Mock - replace with actual API call
      removePost(post.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    return `${days}日前`;
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      {/* Post Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {post.user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-white font-semibold">{post.user.name}</h3>
            <p className="text-sm text-slate-400">
              Lv.{post.user.currentLevel} • {formatDate(post.created_at)}
            </p>
          </div>
        </div>
        {post.user_id === user?.id && (
          <button
            onClick={handleDelete}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-slate-200 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* AI Warning */}
      {post.is_ai_flagged && (
        <div className="mb-4 bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-semibold text-sm">
              AIによる警告
            </p>
            <p className="text-yellow-200 text-sm">{post.ai_flag_reason}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
        <button
          onClick={handleReaction}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            post.has_reacted
              ? 'bg-yellow-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">{post.reactions_count}</span>
        </button>

        <button
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">{localReplies.length} 返信</span>
          {showReplies ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Replies Section */}
      {showReplies && (
        <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
          {/* Reply Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleReply()}
              placeholder="返信を入力... (@checkAI でAIに質問)"
              className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
              disabled={isSubmitting}
            />
            <button
              onClick={handleReply}
              disabled={isSubmitting || !replyContent.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              送信
            </button>
          </div>

          {/* Replies List */}
          <div className="space-y-3">
            {localReplies.map((reply) => (
              <div
                key={reply.id}
                className={`p-3 rounded-lg ${
                  reply.is_ai_response
                    ? 'bg-blue-900/20 border border-blue-700'
                    : 'bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {reply.is_ai_response ? (
                    <>
                      <Bot className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-semibold text-blue-400">
                        AI Assistant
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold">
                        {reply.user?.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {reply.user?.name}
                      </span>
                    </>
                  )}
                  <span className="text-xs text-slate-400">
                    {formatDate(reply.created_at)}
                  </span>
                </div>
                <p className="text-sm text-slate-200">{reply.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
