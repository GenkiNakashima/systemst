'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearchToggle: (active: boolean) => void;
}

export default function SearchBar({ onSearchToggle }: SearchBarProps) {
  const { setPosts } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    onSearchToggle(true);

    // Mock search - replace with actual API call
    setTimeout(() => {
      // Filter mock data based on search query
      setIsSearching(false);
    }, 500);
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsSearching(false);
    onSearchToggle(false);
    // Reset to all posts
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="投稿を検索..."
            className="w-full bg-slate-700 text-white pl-10 pr-10 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
            disabled={isSearching}
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          検索
        </button>
      </div>
    </div>
  );
}
