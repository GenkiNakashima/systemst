# プロジェクト全体設計書: DeepDive Dev (仮)

## "動く仕組み"を可視化する実戦的Web学習プラットフォーム

---

## 目次
1. [プロジェクト概要・要求仕様](#1-プロジェクト概要要求仕様)
2. [データベース設計](#2-データベース設計-postgresql)
3. [技術構成・アーキテクチャ案](#3-技術構成アーキテクチャ案)
4. [画面・UIコンポーネント設計](#4-画面uiコンポーネント設計)
5. [競合分析と差別化戦略](#5-競合分析と差別化戦略)

---

## 1. プロジェクト概要・要求仕様
大体の概要 ・基本情報や応用情報、ネットワークセキュリティなど通常のコーディング以外の必須知識（ビット演算やアルゴリズや層なども）を実際のデモシステム（中のコードが見える状態）を使って学ぶ

### 1.1. プロジェクト概要
**「コードは書けるが、中身がわからない」を解決する。**
本サービスは、小規模な開発経験はあるものの、ネットワーク、セキュリティ、パフォーマンスチューニングなどの「非機能要件」や「アーキテクチャの内部挙動」の理解が浅い実務未経験エンジニアをターゲットとする。
AIが生成した「壊れたデモシステム」や「ボトルネックのある環境」を、可視化ツールを用いて修正・改善することで、実務で通用するトラブルシューティング能力とアーキテクチャ理解力を養う。

### 1.2. ターゲットユーザー
* **属性:** コーディング経験あり、ポートフォリオ作成経験ありの実務未経験〜ジュニアエンジニア。
* **課題:**
    * フレームワークを使えば動くものは作れるが、`CORS`エラーや`N+1`問題が出ると手が止まる。
    * 面接で「HTTPリクエストの流れ」や「SessionとCookieの違い」を聞かれても浅い回答しかできない。
    * 「動けばいい」コードしか書けず、パフォーマンスやセキュリティへの配慮が不足している。

### 1.3. 要求仕様 (Core Features)

#### ✅ 1. 内部構造可視化（Glass-Box Execution）
ユーザーが操作するデモアプリの裏側で起きている通信・処理をリアルタイムで図解する。
* **要件:**
    * ブラウザ → DNS → LB → Web Server → DB のリクエストフローのアニメーション表示。
    * TCPハンドシェイク、TLS暗号化のプロセス可視化。
    * SQL実行計画（Explain）とインデックス有無による速度差のグラフ化。

#### ✅ 2. トラブルシューティング演習 (Real-world Scenarios)
「正解を書く」のではなく「バグ/不具合を直す」形式の課題。
* **シナリオ例:**
    * 「APIが急に遅くなった原因（N+1問題）を特定し修正せよ」
    * 「特定のオリジンからのアクセスでエラー（CORS）が出る。設定を修正せよ」
    * 「XSS脆弱性があるフォームを特定し、サニタイズ処理を実装せよ」

#### ✅ 3. AIアーキテクト・レビュー
ユーザーの修正コードや、トラブルの原因特定プロセスに対してAIがフィードバックを行う。
* **要件:**
    * 単なる正誤判定ではなく、「なぜその修正でパフォーマンスが改善するのか」の理論的背景を解説。
    * コードのセキュリティ脆弱性指摘。
    * ユーザーの理解度に応じた「次に取り組むべき弱点課題」のレコメンド。

#### ✅ 4. 実務スキル証明（Skill Visualization）
学習履歴をGitHub等でアピール可能な形式で出力する。
* **要件:**
    * トラブル対応カテゴリー別スコア（Network, DB, Security, Performance）。
    * 解決した具体的なトラブル事例のリスト化。

---

## 2. データベース設計 (PostgreSQL)

### 2.1. Users & Auth
ユーザー管理と基本設定。
| Table Name | Column | Type | Note |
| :--- | :--- | :--- | :--- |
| `users` | `id` | UUID | PK |
| | `email` | VARCHAR | Unique |
| | `name` | VARCHAR | |
| | `current_level` | INT | 現在のランク |
| | `created_at` | TIMESTAMP | |

### 2.2. Learning Content
学習シナリオと技術概念の管理。
| Table Name | Column | Type | Note |
| :--- | :--- | :--- | :--- |
| `scenarios` | `id` | UUID | PK |
| | `title` | VARCHAR | 例: "CORSエラーを解決せよ" |
| | `category` | VARCHAR | Network, Security, DB, etc. |
| | `difficulty` | INT | 1~5 |
| | `environment_config` | JSONB | Dockerコンテナ等の構成定義 |
| | `broken_code_snippet` | TEXT | 初期状態のバグコード |
| | `solution_validation_rule`| JSONB | 解決判定ロジック |
| `concepts` | `id` | UUID | PK (例: "N+1 Problem") |
| | `description` | TEXT | AI学習用の解説コンテキスト |

### 2.3. Progress & Logs
ユーザーの学習進捗とAI評価ログ。
| Table Name | Column | Type | Note |
| :--- | :--- | :--- | :--- |
| `user_attempts` | `id` | UUID | PK |
| | `user_id` | UUID | FK |
| | `scenario_id` | UUID | FK |
| | `status` | VARCHAR | In_Progress, Solved, Failed |
| | `code_snapshot` | TEXT | ユーザーが提出したコード |
| | `execution_time_ms` | INT | 実行にかかった時間（パフォーマンス課題用） |
| `ai_feedbacks` | `id` | UUID | PK |
| | `attempt_id` | UUID | FK |
| | `feedback_content` | TEXT | AIによる解説・指摘 |
| | `score` | INT | 評価点 |
| `skill_matrix` | `user_id` | UUID | FK |
| | `network_score` | INT | |
| | `db_score` | INT | |
| | `security_score` | INT | |

---

## 3. 技術構成・アーキテクチャ案

本プロジェクトでは、「ユーザーが実行するコード」を安全かつリアルタイムに動作させる必要があるため、コンテナ技術とAPIの設計が重要となる。バックエンドには堅牢でAPI開発に強い**PHP (Laravel)**を採用する。

### 3.1. 全体アーキテクチャ図 (AWS)

* **Frontend (User Interface):** Next.js on AWS Amplify or Vercel / ECS
* **Backend (API & Logic):** Laravel (PHP) on AWS ECS (Fargate)
* **Database:** Amazon RDS (PostgreSQL)
* **User Code Execution Env:** Isolated Docker Containers on ECS (Sidecar or Task per user)
* **AI Service:** Laravel Service class connecting to OpenAI API / Gemini API

### 3.2. フロントエンド (Frontend)

* **Framework:** **Next.js (App Router)** + TypeScript
    * サーバーサイドレンダリング (SSR) とクライアントサイドのインタラクションを両立。
* **State Management:** **Zustand**
    * 複雑なシミュレーション状態（パケットの流れ、DB接続状態など）を管理。
* **Visualization:** **React Flow** または **Mermaid.js**
    * アーキテクチャ図、リクエストフローの動的生成に使用。
* **Code Editor:** **Monaco Editor** (VS CodeのWeb版)
    * ブラウザ上でコード修正を行わせるため必須。

### 3.3. バックエンド (Backend)

* **Language:** **PHP 8.2+**
* **Framework:** **Laravel 11**
    * **理由:**
        * 実務で非常に多く採用されており、ターゲットユーザーにとっても親和性が高い。
        * 強力なORM (Eloquent) があり、APIリソース設計が容易。
        * 「素のPHP」に近い書き方もできるため、Webの基礎（`$_SESSION`, `header()`など）を理解させる教材としても優秀。
* **Key Responsibilities:**
    * ユーザー認証 (Sanctum/Passport)。
    * 学習シナリオの配信。
    * AI API (OpenAI/Gemini) とのゲートウェイ。
    * **重要:** ユーザーコードの実行リクエストをサンドボックス環境へプロキシする役割。

### 3.4. インフラ・実行環境 (Infrastructure)

* **Compute:** **AWS ECS (Fargate)**
    * 管理コストを下げつつ、コンテナ単位でのスケーリングが可能。
* **Simulation Environment (The "Demo System"):**
    * 各課題（シナリオ）ごとに軽量なDockerコンテナを用意。
    * ユーザーがコードを修正して「実行」ボタンを押すと、Laravel API経由で一時的なコンテナが立ち上がり（または既存コンテナ内で）、コードが実行される。
    * 実行ログ（stdout/stderr）、ネットワークトラフィックログを収集し、フロントエンドへ返す。
* **Database:** **Amazon RDS for PostgreSQL**
    * JSONB型を活用し、シナリオごとの柔軟な設定データを保存。

### 3.5. AI連携フロー

1.  **Code Submission:** ユーザーが修正コードを送信。
2.  **Analysis:** バックエンドがコードと実行結果（エラーログ、パフォーマンス計測値）を受け取る。
3.  **Prompt Engineering:** LaravelからAIへ以下のプロンプトを送信。
    * 「シナリオ：N+1問題の解決」
    * 「ユーザーコード：[コード内容]」
    * 「実行ログ：Query Count 105 (Failed)」
    * 「指示：正解は教えず、なぜクエリが多いのかヒントを出し、Eloquentの`with()`メソッドについて言及せよ。」
4.  **Feedback:** AIからのレスポンスを整形し、フロントエンドのチャットボットUIに表示。

### 3.6. 技術選定の妥当性 (Why PHP/Laravel?)

* **市場ニーズ:** 日本のWeb開発現場（特に受託、中規模サービス）ではPHP/Laravelのシェアが依然として高く、ターゲット層の「就職・転職」に直結しやすい。
* **教育適性:** Webの仕組み（Request/Responseライフサイクル）が明示的で、隠蔽されすぎていないため、「仕組みを学ぶ」目的に適している。

---

## 4. 画面・UIコンポーネント設計

### 4.1. 画面遷移図

1.  **LP/Login:** サービス紹介、認証。
2.  **Dashboard:**
    * 現在のスキルレーダーチャート。
    * AIおすすめの「次に取り組むべきシナリオ」。
    * 成長ログ（過去の解決済みトラブル一覧）。
3.  **Scenario Select:** カテゴリ別（Network, DB, Security）の問題一覧。
4.  **Immersive Workspace (メイン学習画面):**
    * 左：コードエディタ / ターミナル
    * 右：可視化ビューア / ブラウザプレビュー
    * 下/オーバーレイ：AIコーチチャット

### 4.2. メイン学習画面 (Immersive Workspace) コンポーネント詳細

この画面がアプリケーションの核となる。画面を3〜4分割して情報を表示する。

#### A. CodeEditorArea (左ペイン)
ユーザーが修正を行う場所。
* `FileTree`: 修正対象のファイル構造を表示。
* `MonacoEditor`: シンタックスハイライト付きエディタ。
* `ActionButtons`: 「実行(Run)」「採点(Submit)」「ヒントを貰う」。

#### B. VisualizerPanel (右上ペイン)
コード実行時の「中身」を見せる場所。
* **Network Flow Mode:**
    * ブラウザアイコンからサーバーアイコンへ矢印が飛ぶアニメーション。
    * リクエストヘッダー/レスポンスヘッダーの生データ表示（Cookie等の確認用）。
* **Database Mode:**
    * 発行されたSQLクエリのリスト表示（N+1問題の可視化）。
    * 「Slow Query」警告バッジ。
* **Infrastructure Mode:**
    * Dockerコンテナ間の通信図。

#### C. BrowserPreview (右下ペイン / タブ切り替え)
* 実際のWebアプリのレンダリング結果を表示（iframe等）。
* エラー発生時は、独自のエラー画面ではなく、ブラウザ標準のエラー（500 Internal Server Errorなど）を再現して表示。

#### D. AICoachChat (フローティング/サイドバー)
* `FeedbackStream`: AIからのリアルタイムフィードバック。
* `ConceptCard`: 専門用語（例: "CSRF"）が登場した際に、マウスオーバーで簡易解説が出るカードコンポーネント。

### 4.3. コンポーネント構成案 (React/Next.js)

```tsx
// components/workspace/WorkspaceLayout.tsx
export default function WorkspaceLayout({ scenarioId }) {
  const { code, output, visualizeData } = useScenarioStore();

  return (
    <div className="flex h-screen w-full bg-slate-900 text-white">
      {/* 左側：コードエディタ */}
      <div className="w-1/2 border-r border-slate-700 flex flex-col">
        <FileTree />
        <CodeEditor code={code} />
        <Terminal output={output} />
      </div>

      {/* 右側：可視化 & プレビュー */}
      <div className="w-1/2 flex flex-col">
        {/* 上半分：可視化パネル */}
        <div className="h-1/2 border-b border-slate-700 p-4">
           <Tabs defaultValue="network">
             <TabsContent value="network">
               <NetworkFlowVisualizer data={visualizeData.network} />
             </TabsContent>
             <TabsContent value="db">
               <DatabaseQueryVisualizer queries={visualizeData.queries} />
             </TabsContent>
           </Tabs>
        </div>
        
        {/* 下半分：プレビュー & AI */}
        <div className="h-1/2 flex">
           <div className="w-2/3">
             <BrowserPreview url={visualizeData.previewUrl} />
           </div>
           <div className="w-1/3 border-l border-slate-700">
             <AICoachChat context={scenarioId} />
           </div>
        </div>
      </div>
    </div>
  );
}