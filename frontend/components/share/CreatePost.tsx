'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Post } from '@/types';
import { X, Send, AlertTriangle } from 'lucide-react';

interface CreatePostProps {
  onClose: () => void;
}

export default function CreatePost({ onClose }: CreatePostProps) {
  const { user, addPost } = useStore();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiWarning, setAiWarning] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    setAiWarning(null);

    // Mock AI fact-checking - replace with actual API call
    const mockAiCheck = {
      is_flagged: content.toLowerCase().includes('誤情報'),
      reason: content.toLowerCase().includes('誤情報')
        ? 'この投稿には検証が必要な情報が含まれている可能性があります。'
        : null,
    };

    const newPost: Post = {
      id: Date.now().toString(),
      user_id: user?.id || '',
      user: user || {
        id: '',
        email: '',
        name: '',
        currentLevel: 1,
        createdAt: new Date().toISOString(),
      },
      content,
      is_ai_flagged: mockAiCheck.is_flagged,
      ai_flag_reason: mockAiCheck.reason,
      reactions_count: 0,
      has_reacted: false,
      replies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addPost(newPost);

    if (mockAiCheck.is_flagged) {
      setAiWarning(mockAiCheck.reason);
      setTimeout(() => {
        setContent('');
        setIsSubmitting(false);
        setAiWarning(null);
        onClose();
      }, 3000);
    } else {
      setContent('');
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">新しい投稿</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="あなたの知識や最新情報を共有しましょう..."
        className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 resize-none"
        rows={5}
        disabled={isSubmitting}
      />

      {aiWarning && (
        <div className="mt-4 bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-semibold text-sm">
              AIによる警告
            </p>
            <p className="text-yellow-200 text-sm">{aiWarning}</p>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-slate-400">
          AIが自動的に投稿内容をファクトチェックします
        </p>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
          投稿する
        </button>
      </div>
    </div>
  );
}
