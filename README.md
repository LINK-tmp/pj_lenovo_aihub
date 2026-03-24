# 関西AI Hub

関西圏の企業課題と技術シーズをつなぐ情報流通プラットフォーム

## 技術スタック

- Next.js 16 / React 19 / TypeScript
- Prisma + PostgreSQL
- NextAuth.js v5（認証）
- Tailwind CSS v4 + shadcn/ui
- Docker Compose（ローカル環境）

---

## セットアップ

### 方法 1: Docker（推奨）

Docker Desktop がインストールされていれば、コマンド 2 つで起動できます。

```bash
# 1. 起動（初回はビルドに数分かかります）
docker compose up -d

# 2. デモデータを投入
docker compose run --rm seed
```

http://localhost:3000 でアクセスできます。

```bash
# 停止
docker compose down

# データも含めて完全リセット
docker compose down -v
```

### 方法 2: ローカル（Node.js + PostgreSQL）

**前提条件**
- Node.js 20+
- PostgreSQL 16+（起動済み）

```bash
# 1. 依存パッケージをインストール
npm install

# 2. 環境変数を設定
cp .env.example .env
# 必要に応じて DATABASE_URL を編集

# 3. データベースをセットアップ
npx prisma migrate dev

# 4. デモデータを投入
npx prisma db seed

# 5. 開発サーバーを起動
npm run dev
```

http://localhost:3000 でアクセスできます。

---

## デモアカウント

シード実行後、以下のアカウントでログインできます。

| ロール | メールアドレス | パスワード | 説明 |
|--------|---------------|-----------|------|
| 事務局（Admin） | `admin@kansai-aihub.jp` | `admin123` | 全案件・応募の管理、代理登録が可能 |
| 企業（Enterprise） | `enterprise@example.co.jp` | `pass123` | ユースケースの投稿・管理が可能 |
| 会員（Member） | `member@example.ac.jp` | `pass123` | 公開案件の閲覧・応募が可能 |

---

## 主な機能

- **企業** — ユースケース（課題）を登録し、応募を受け付ける
- **会員** — 公開された案件を閲覧し、提案・応募する
- **事務局** — 案件の審査・公開管理、応募ステータスの更新、代理登録

---

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run lint         # ESLint 実行
npx prisma studio    # DB の GUI ブラウザを起動
npx prisma db seed   # デモデータを再投入
npx prisma db push   # スキーマ変更を DB に反映（マイグレーションなし）
```
