'use client';

import Link from 'next/link';
import { Code2, Network, Shield, Database, ArrowRight, Zap, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            DeepDive Dev
          </h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">
          「動く仕組み」を可視化する<br />
          実戦的Web学習プラットフォーム
        </h2>
        <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
          コードは書けるが中身がわからない、を解決。
          ネットワーク、セキュリティ、パフォーマンスなど
          実務で必要な「非機能要件」を体験しながら学ぶ。
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          学習を始める
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          主要機能
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Network className="w-8 h-8" />}
            title="内部構造可視化"
            description="リクエストフロー、TCPハンドシェイク、TLS暗号化プロセスをアニメーションで表示"
          />
          <FeatureCard
            icon={<Code2 className="w-8 h-8" />}
            title="トラブルシューティング演習"
            description="N+1問題、CORSエラー、XSS脆弱性など実践的なバグ修正課題"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="AIアーキテクト・レビュー"
            description="修正コードに対するフィードバックと理論的背景の解説"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="実務スキル証明"
            description="カテゴリ別スコアと解決事例のリスト化でスキルを可視化"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          学習カテゴリ
        </h3>
        <div className="grid md:grid-cols-5 gap-4">
          <CategoryCard
            icon={<Network className="w-6 h-6" />}
            title="Network"
            description="HTTP/HTTPS, TCP/IP, DNS, CORS, RESTful API"
            color="bg-blue-500"
          />
          <CategoryCard
            icon={<Database className="w-6 h-6" />}
            title="Database"
            description="N+1, インデックス, トランザクション, ACID"
            color="bg-green-500"
          />
          <CategoryCard
            icon={<Shield className="w-6 h-6" />}
            title="Security"
            description="XSS, CSRF, SQLインジェクション"
            color="bg-red-500"
          />
          <CategoryCard
            icon={<Zap className="w-6 h-6" />}
            title="Performance"
            description="計算量, アルゴリズム, キャッシュ戦略"
            color="bg-yellow-500"
          />
          <CategoryCard
            icon={<Cpu className="w-6 h-6" />}
            title="OS"
            description="並行処理, メモリ管理, プロセス/スレッド"
            color="bg-purple-500"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400">
          <p>&copy; 2024 DeepDive Dev. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

function CategoryCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
      <div className={`inline-flex p-2 rounded-lg ${color} text-white mb-4`}>
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}
