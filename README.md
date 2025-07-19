# パーソナライズされたUI生成アプリケーション

AIがユーザーの嗜好に基づいて動的にUIを生成・カスタマイズするNext.jsアプリケーションです。

## 機能概要

- **AIとの対話型UI生成**: チャットインターフェースを通じてUIの生成・修正が可能
- **ユーザー認証**: GitHub認証によるセキュアなログイン
- **パーソナライズ**: ユーザー固有の嗜好を保存し、それに基づいたUI生成
- **リアルタイム更新**: 動的なUI変更とプレビュー
- **会話履歴**: 過去のAIとの対話を保存・参照

## セットアップ

### 前提条件

- Node.js 18以上
- npm, yarn, pnpm, または bun

### 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```bash
# データベース
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# AI API keys (使用するプロバイダーに応じて設定)
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"
GOOGLE_GENERATIVE_AI_API_KEY="your-google-key"
```

### インストールと起動

1. 依存関係のインストール：
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

2. データベースのセットアップ：
```bash
npx prisma generate
npx prisma db push
```

3. 開発サーバーの起動：
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 使用方法

### 1. ログイン
- トップページでGitHubアカウントでログイン
- 初回ログイン時は自動的にアカウントが作成されます

### 2. ダッシュボード
- ログイン後、パーソナライズされたダッシュボードに移動
- 左側：生成されたUIのプレビューエリア
- 右側：AIチャットインターフェース

### 3. UIの生成
チャットで以下のようなリクエストが可能です：

**初回UI生成の例：**
```
「シンプルなタスク管理UIを作成してください」
「ダークテーマのダッシュボードを作りたいです」
「カードレイアウトのポートフォリオサイトを生成してください」
```

**UI修正の例：**
```
「ボタンの色を青色に変更してください」
「フォントサイズを大きくしてください」
「新しいセクションを追加してください」
```

### 4. パーソナライゼーション
- AIとの対話を通じて、ユーザーの嗜好が自動的に学習・保存されます
- 保存された嗜好は今後のUI生成に自動的に反映されます

## プロジェクト構造

```
src/
├── app/                    # App Router
│   ├── page.tsx           # トップページ
│   ├── dashboard/         # ダッシュボード
│   └── auth/             # 認証ページ
├── components/            # Reactコンポーネント
│   ├── AuthButton.tsx    # 認証ボタン
│   ├── ChatInterface.tsx # チャットUI
│   ├── DynamicUI.tsx     # 動的UI表示
│   └── ...
├── lib/                  # ユーティリティ
│   ├── auth.ts          # 認証設定
│   └── prisma.ts        # データベース設定
└── types/               # 型定義
```

## データベーススキーマ

- **User**: ユーザー情報
- **UserPreference**: ユーザーの嗜好設定
- **UserUI**: 生成されたUI データ
- **Conversation**: AIとの会話履歴

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **認証**: NextAuth.js + GitHub OAuth
- **データベース**: SQLite + Prisma ORM
- **AI**: Vercel AI SDK (OpenAI, Anthropic, Google対応)
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript
