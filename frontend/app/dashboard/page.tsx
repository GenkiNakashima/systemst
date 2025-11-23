'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  LogOut,
  Network,
  Database,
  Shield,
  Zap,
  ArrowRight,
  Trophy,
  Target,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, skillMatrix, setSkillMatrix } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Mock skill data
    setSkillMatrix({
      userId: user?.id || '',
      networkScore: 65,
      dbScore: 45,
      securityScore: 70,
      performanceScore: 55,
    });
  }, [isAuthenticated, router, setSkillMatrix, user?.id]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  const radarData = [
    { subject: 'Network', value: skillMatrix?.networkScore || 0, fullMark: 100 },
    { subject: 'Database', value: skillMatrix?.dbScore || 0, fullMark: 100 },
    { subject: 'Security', value: skillMatrix?.securityScore || 0, fullMark: 100 },
    { subject: 'Performance', value: skillMatrix?.performanceScore || 0, fullMark: 100 },
  ];

  const recommendedScenarios = [
    {
      id: '1',
      title: 'N+1問題を特定し修正せよ',
      category: 'Database',
      difficulty: 2,
      icon: <Database className="w-5 h-5" />,
      color: 'bg-green-500',
    },
    {
      id: '2',
      title: 'CORSエラーを解決せよ',
      category: 'Network',
      difficulty: 3,
      icon: <Network className="w-5 h-5" />,
      color: 'bg-blue-500',
    },
    {
      id: '3',
      title: 'XSS脆弱性を修正せよ',
      category: 'Security',
      difficulty: 3,
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-red-500',
    },
  ];

  const recentActivity = [
    { id: '1', title: 'SQLインジェクション対策', status: 'Solved', score: 85 },
    { id: '2', title: 'キャッシュ最適化', status: 'In_Progress', score: null },
    { id: '3', title: 'TCP接続の理解', status: 'Solved', score: 92 },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-white">
            DeepDive Dev
          </Link>
          <div className="flex items-center gap-4">
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
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            おかえりなさい、{user?.name}さん
          </h1>
          <p className="text-slate-400">
            今日も実践的なスキルを身につけましょう
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Skill Radar Chart */}
          <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              スキルマトリックス
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#64748b' }}
                  />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <StatCard
              icon={<Trophy className="w-5 h-5" />}
              label="解決済みシナリオ"
              value="12"
              color="text-yellow-400"
            />
            <StatCard
              icon={<Target className="w-5 h-5" />}
              label="総合スコア"
              value="234"
              color="text-blue-400"
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              label="学習時間"
              value="18h"
              color="text-green-400"
            />
          </div>
        </div>

        {/* Recommended Scenarios */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              AIおすすめのシナリオ
            </h2>
            <Link
              href="/scenarios"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
            >
              すべて見る
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendedScenarios.map((scenario) => (
              <Link
                key={scenario.id}
                href={`/workspace/${scenario.id}`}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${scenario.color} text-white`}>
                    {scenario.icon}
                  </div>
                  <span className="text-sm text-slate-400">{scenario.category}</span>
                </div>
                <h3 className="text-white font-medium mb-2">{scenario.title}</h3>
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
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            最近のアクティビティ
          </h2>
          <div className="bg-slate-800 rounded-lg border border-slate-700 divide-y divide-slate-700">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-white font-medium">{activity.title}</h3>
                  <span
                    className={`text-sm ${
                      activity.status === 'Solved'
                        ? 'text-green-400'
                        : 'text-yellow-400'
                    }`}
                  >
                    {activity.status === 'Solved' ? '解決済み' : '進行中'}
                  </span>
                </div>
                {activity.score && (
                  <span className="text-2xl font-bold text-blue-400">
                    {activity.score}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}
