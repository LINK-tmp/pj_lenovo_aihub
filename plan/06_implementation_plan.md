# 06. 実装計画

> **ステータス: 確定**

---

## 1. 技術スタック

### フロントエンド

| 技術 | バージョン | 選定理由 |
|------|----------|---------|
| **Next.js 15** (App Router) | 15.x | Server Components / Server Actions / 組み込みAPIルート。安定・本番運用実績豊富 |
| **React 19** | 19.x | Next.js 15にバンドル |
| **Tailwind CSS 4** | 4.x | `04_design_tone.md`の色・スペーシングをそのまま設定可能 |
| **shadcn/ui** | latest | Table / Card / Badge / Dialog / Form / Select等。コードコピー方式で完全制御可能 |
| **React Hook Form + Zod** | - | フォーム処理＋バリデーション（E-2, U-3, A-5） |
| **Noto Sans JP** | - | `next/font/google`で読み込み |
| **lucide-react** | - | アイコン（shadcn/uiにバンドル） |
| **nuqs** | - | URL状態管理（フィルタ・検索のクエリパラメータ） |
| **date-fns** | - | 日付フォーマット（日本語ロケール） |

### バックエンド / API

| 技術 | 選定理由 |
|------|---------|
| **Next.js API Routes (Route Handlers)** | 分離バックエンド不要。データ量が極小（5-10件）。デプロイがシンプル |
| **Server Actions** | フォーム送信・ステータス変更等のミューテーション。型安全 |

### データベース

| 技術 | 選定理由 |
|------|---------|
| **PostgreSQL** | リレーショナルデータ（ユーザー・案件・応募・ログ）に最適。業務アプリの定番 |
| **Prisma** | 型安全ORM。マイグレーション管理。スキーマ＝コードで可読性高い |

### 認証

| 技術 | 選定理由 |
|------|---------|
| **NextAuth.js v5 (Auth.js)** | Credentials Provider（メール+パスワード）。招待制＝事務局がアカウント発行。App Router対応 |

### インフラ（AWS）

| サービス | 用途 | 月額目安 |
|---------|------|---------|
| **AWS Amplify** | Next.jsホスティング（SSR対応） | ~$5-10 |
| **Amazon RDS PostgreSQL** | DB（db.t4g.micro） | ~$15 |
| 合計 | | **~$20-25/月** |

**将来追加:**
- Amazon S3（添付ファイル）
- Amazon SES（メール通知）

### 代替案: Vercel + Supabase

プロトタイプ段階でAWSが必須でなければ、無料で立ち上げ可能:
- Vercel: 無料枠でNext.jsホスティング
- Supabase: 無料枠でPostgreSQL提供
- 後からAWSへ移行可能

---

## 2. プロジェクト構造

```
kansai-ai-hub/
├── .env.local                     # 環境変数
├── .env.example                   # テンプレート
├── next.config.ts
├── tailwind.config.ts             # 04_design_toneのカスタムカラー
├── prisma/
│   ├── schema.prisma              # データモデル
│   ├── seed.ts                    # デモデータ
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # ルートレイアウト（Noto Sans JP）
│   │   ├── page.tsx               # C-0: パブリックTOP（LP）
│   │   ├── login/
│   │   │   └── page.tsx           # C-1: ログイン
│   │   ├── (authenticated)/       # ルートグループ: 認証必須
│   │   │   ├── layout.tsx         # 認証済みレイアウト（ヘッダー付き）
│   │   │   ├── enterprise/        # 企業側ページ
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx       # E-1: 企業ダッシュボード
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx   # E-2: ユースケース登録フォーム
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # E-3: 自社案件詳細
│   │   │   ├── member/            # 大学・会員企業側ページ
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx       # U-1: 案件一覧
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx   # U-2: 案件詳細
│   │   │   │   │   └── apply/
│   │   │   │   │       └── page.tsx # U-3: 応募フォーム
│   │   │   │   └── my-applications/
│   │   │   │       └── page.tsx   # U-4: マイ応募一覧
│   │   │   └── admin/             # 事務局ページ
│   │   │       ├── layout.tsx     # サイドバー付きレイアウト
│   │   │       ├── page.tsx       # A-1: 事務局ダッシュボード
│   │   │       ├── cases/
│   │   │       │   ├── page.tsx   # A-2: 案件管理一覧
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx # A-3: 案件管理詳細
│   │   │       ├── applications/
│   │   │       │   └── page.tsx   # A-4: 応募管理
│   │   │       └── proxy-register/
│   │   │           └── page.tsx   # A-5: 案件代理登録
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts   # NextAuth ルートハンドラー
│   ├── components/
│   │   ├── ui/                    # shadcn/uiコンポーネント
│   │   ├── layout/
│   │   │   ├── header.tsx         # ヘッダー（ロール対応ナビ）
│   │   │   ├── admin-sidebar.tsx  # 事務局サイドバー
│   │   │   └── footer.tsx
│   │   ├── cases/
│   │   │   ├── case-card.tsx      # 案件カード（U-1, E-1）
│   │   │   ├── case-detail.tsx    # 案件詳細ビュー（共通）
│   │   │   ├── case-form.tsx      # 登録フォーム（E-2, A-5共通）
│   │   │   ├── case-table.tsx     # 管理テーブル（A-2）
│   │   │   └── case-filters.tsx   # フィルタバー
│   │   ├── applications/
│   │   │   ├── application-form.tsx    # 応募フォーム（U-3）
│   │   │   ├── application-table.tsx   # 応募テーブル
│   │   │   └── application-modal.tsx   # 応募詳細モーダル
│   │   ├── workflow/
│   │   │   └── workflow-stepper.tsx    # ワークフローステッパー
│   │   ├── dashboard/
│   │   │   ├── kpi-card.tsx       # KPI集計カード
│   │   │   ├── action-alerts.tsx  # 対応アラート（A-1）
│   │   │   └── activity-list.tsx  # 最近のアクティビティ
│   │   └── landing/
│   │       ├── hero-section.tsx   # C-0 ヒーロー
│   │       ├── features-section.tsx # 3カラム説明
│   │       └── workflow-diagram.tsx  # ワークフロー図
│   ├── lib/
│   │   ├── auth.ts                # NextAuth設定
│   │   ├── db.ts                  # Prismaクライアント
│   │   ├── validations.ts         # Zodスキーマ
│   │   └── constants.ts           # ステータス定数・予算レンジ・業界等
│   ├── actions/
│   │   ├── cases.ts               # 案件関連Server Actions
│   │   ├── applications.ts        # 応募関連Server Actions
│   │   ├── admin.ts               # 管理操作Server Actions
│   │   └── auth.ts                # 認証Server Actions
│   ├── types/
│   │   └── index.ts               # 共有TypeScript型
│   └── styles/
│       └── globals.css            # Tailwind + カスタムCSS変数
├── public/
│   └── images/
├── package.json
└── tsconfig.json
```

---

## 3. データモデル（Prismaスキーマ）

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── Enum ──────────────────────────────────

enum UserRole {
  ENTERPRISE    // 企業側
  MEMBER        // 大学・JAM BASE会員企業
  ADMIN         // 事務局（Lenovo）
}

enum CaseStatus {
  DRAFT         // 下書き
  UNDER_REVIEW  // 審査中
  OPEN          // 募集中
  IN_PROGRESS   // 進行中
  COMPLETED     // 完了
}

enum ApplicationStatus {
  NEW           // 新着
  UNDER_REVIEW  // 検討中
  APPROVED      // 承認
  REJECTED      // 不採用
}

enum BudgetRange {
  UNDER_1M      // 〜100万円
  UNDER_3M      // 〜300万円
  UNDER_5M      // 〜500万円
  UNDER_10M     // 〜1000万円
  OVER_10M      // 1000万以上
  UNDECIDED     // 未定
}

enum TargetAudience {
  UNIVERSITY    // 大学
  COMPANY       // 企業
  BOTH          // 両方
}

// ── Model ─────────────────────────────────

model User {
  id               String    @id @default(cuid())
  email            String    @unique
  passwordHash     String
  name             String              // 担当者名
  organizationName String              // 企業名 / 大学名 / 組織名
  role             UserRole
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  cases            UseCase[]
  applications     Application[]
  activityLogs     ActivityLog[]
  proxyCases       UseCase[]  @relation("proxyCreator")

  @@map("users")
}

model UseCase {
  id               String          @id @default(cuid())
  title            String                   // 案件名
  companyName      String                   // 企業名（表示用）
  summary          String          @db.Text // ユースケース概要
  challenge        String          @db.Text // 課題内容
  expectedDev      String?         @db.Text // 期待する開発内容
  industry         String?                  // 対象業界
  technologies     String[]                 // 対象技術（タグ配列）
  budgetRange      BudgetRange?             // PoC予算上限
  targetAudience   TargetAudience?          // 募集対象
  notes            String?         @db.Text // 備考
  adminNotes       String?         @db.Text // 事務局メモ（非公開）

  status           CaseStatus      @default(DRAFT)
  isPublished      Boolean         @default(false)

  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  createdBy        User            @relation(fields: [createdById], references: [id])
  createdById      String
  proxyCreatedBy   User?           @relation("proxyCreator", fields: [proxyCreatedById], references: [id])
  proxyCreatedById String?

  applications     Application[]
  activityLogs     ActivityLog[]

  @@map("use_cases")
}

model Application {
  id               String              @id @default(cuid())
  organizationName String                       // 組織名
  contactName      String                       // 担当者名
  contactEmail     String                       // 連絡先メール
  proposalSummary  String              @db.Text // 提案概要
  message          String?             @db.Text // 補足メッセージ

  status           ApplicationStatus   @default(NEW)

  createdAt        DateTime            @default(now())
  updatedAt        DateTime            @updatedAt

  useCase          UseCase             @relation(fields: [useCaseId], references: [id])
  useCaseId        String
  applicant        User                @relation(fields: [applicantId], references: [id])
  applicantId      String

  @@unique([useCaseId, applicantId])   // 1ユーザー1案件1応募
  @@map("applications")
}

model ActivityLog {
  id          String   @id @default(cuid())
  action      String              // "案件投稿", "ステータス変更", "応募" 等
  detail      String?             // 詳細テキスト
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
  userId      String
  useCase     UseCase? @relation(fields: [useCaseId], references: [id])
  useCaseId   String?

  @@map("activity_logs")
}
```

### データモデルの設計判断

| 判断 | 理由 |
|------|------|
| `technologies`をString配列で管理 | 5-10件のデータ量でJOINテーブルは過剰。PostgreSQL配列で十分 |
| `companyName`をUseCaseに冗長保持 | 代理登録時、表示企業名と登録者（事務局）が異なるため |
| `Application`に`@@unique`制約 | 1ユーザー1案件1応募を強制 |
| `ActivityLog`はシンプルな追記型 | 複雑なイベントソーシング不要。時系列表示のみ |
| `adminNotes`をUseCaseに追加 | 代理登録時の事務局メモ（非公開）を格納 |

---

## 4. 実装フェーズ

### Phase 1: 基盤構築（Day 1-3）

**成果物:** 認証付きアプリが起動し、ロール別のレイアウトとナビゲーションが動作。

| # | タスク | 詳細 |
|---|--------|------|
| 1-1 | プロジェクト初期化 | `create-next-app` + TypeScript + Tailwind + App Router |
| 1-2 | shadcn/ui導入 | `shadcn init` + 必要コンポーネントインストール |
| 1-3 | Tailwindカスタム設定 | `04_design_tone.md`の全色・スペーシングを設定 |
| 1-4 | フォント設定 | Noto Sans JP（`next/font/google`） |
| 1-5 | DB構築 | Prismaスキーマ作成 → マイグレーション → シードデータ |
| 1-6 | 認証実装 | NextAuth v5 + Credentials Provider + ログイン画面(C-1) |
| 1-7 | ミドルウェア | ルート保護 + ロール別リダイレクト |
| 1-8 | 共通レイアウト | ヘッダー（ロール対応ナビ）+ 事務局サイドバー + フッター |

### Phase 2: ユーザー向け画面（Day 4-7）

**成果物:** 公開LP + 大学/会員企業の全画面 + 企業側の全画面が動作。

| # | タスク | 画面 |
|---|--------|------|
| 2-1 | パブリックTOP | C-0: ヒーロー + 仕組み説明 + ワークフロー図 |
| 2-2 | 案件一覧 | U-1: カードグリッド + NEWバッジ + フィルタ + 少数データ対応 |
| 2-3 | 案件詳細 | U-2: 2カラム + ワークフローステッパー + 応募ボタン |
| 2-4 | 応募フォーム | U-3: RHF + Zod + Server Action |
| 2-5 | マイ応募一覧 | U-4: テーブル + ステータスバッジ |
| 2-6 | 企業ダッシュボード | E-1: KPIカード3枚 + 案件カード一覧 |
| 2-7 | ユースケース登録 | E-2: 構造化フォーム + 下書き/投稿アクション |
| 2-8 | 自社案件詳細 | E-3: ワークフロー + 応募者テーブル + 応募詳細モーダル |

### Phase 3: 事務局管理画面（Day 8-10）

**成果物:** 事務局の全管理機能が動作。

| # | タスク | 画面 |
|---|--------|------|
| 3-1 | 事務局ダッシュボード | A-1: KPI4枚 + アクションアラート + 最近のアクティビティ |
| 3-2 | 案件管理一覧 | A-2: テーブル + チェックボックス + 一括操作 + 公開トグル |
| 3-3 | 案件管理詳細 | A-3: ワークフロー + ステータス変更 + 応募者管理 + アクティビティログ |
| 3-4 | 応募管理 | A-4: 全応募テーブル + フィルタ + ステータス更新 |
| 3-5 | 代理登録 | A-5: 企業選択 + case-form共通コンポーネント + 事務局メモ + 公開設定 |

### Phase 4: 仕上げ・デプロイ（Day 11-14）

**成果物:** 本番稼働可能なアプリケーション。

| # | タスク | 詳細 |
|---|--------|------|
| 4-1 | レスポンシブ対応 | PC優先。タブレット（1024px）での最低限の表示調整 |
| 4-2 | ローディング状態 | Suspense境界 + スケルトンローダー |
| 4-3 | エラーハンドリング | error.tsx境界 + トースト通知（sonner） |
| 4-4 | エンプティステート | 全一覧画面のデータなし表示 |
| 4-5 | UIアニメーション | ワークフローステッパーのパルス + ホバートランジション |
| 4-6 | デモデータ拡充 | プレゼン用のリアルなダミーデータ |
| 4-7 | デプロイ | AWS Amplify + RDS構築 + 環境変数設定 + ドメイン設定 |

---

## 5. アーキテクチャ上の設計判断

### 5.1 ロールベースアクセス制御（3層防御）

```
middleware.ts（エッジ）
  ├── 未認証 → /loginにリダイレクト（/ と /login は除外）
  ├── /enterprise/* → ENTERPRISEロール必須
  ├── /member/* → MEMBERロール必須
  └── /admin/* → ADMINロール必須

各ロールのlayout.tsx（サーバー）
  └── セッションのロールを二重チェック

Server Actions（サーバー）
  └── ミューテーション実行前にセッション検証
```

### 5.2 ワークフロー / ステータス管理

```
DRAFT → UNDER_REVIEW → OPEN → IN_PROGRESS → COMPLETED
```

| 操作 | 許可ロール |
|------|-----------|
| DRAFT → UNDER_REVIEW（投稿） | ENTERPRISE |
| UNDER_REVIEW → OPEN（公開承認） | ADMIN |
| OPEN → IN_PROGRESS | ADMIN |
| IN_PROGRESS → COMPLETED | ADMIN |
| 任意のステータスに設定 | ADMIN（代理登録時） |

- ステータス変更は`updateCaseStatus` Server Actionで一元管理
- 変更のたびに`ActivityLog`に記録
- ワークフローステッパーは`CaseStatus`を受け取る純粋な表示コンポーネント

### 5.3 コンポーネント共有戦略

| コンポーネント | 使用箇所 | 共有方法 |
|--------------|---------|---------|
| `case-form.tsx` | E-2, A-5 | A-5は`企業選択`と`事務局メモ`を追加Props制御 |
| `case-detail.tsx` | E-3, U-2, A-3 | ロールに応じたアクションパネルをslotで切り替え |
| `workflow-stepper.tsx` | E-3, U-2, A-3 | `currentStatus`を受け取る純粋表示 |
| `application-modal.tsx` | E-3, A-3 | 共通。A-3ではステータス変更UIも表示 |

### 5.4 データフェッチングパターン

```
ページ（Server Component / async）
  └── Prismaで直接データ取得
      └── Clientコンポーネントにpropsで渡す

フォーム送信・ステータス変更
  └── Server Actionsで処理
      └── revalidatePath()でページ再検証
```

### 5.5 Tailwind設定

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      'brand-red': '#E2231A',
      'brand-red-hover': '#C91E16',
      'cta-blue': '#049FD7',
      'cta-blue-hover': '#0388B9',
      'brand-gray': '#6C747D',
      'surface-off-white': '#FAFAFA',
      'surface-light': '#F0F0F0',
      'border-default': '#E2E2E2',
      'border-dark': '#D1D1D1',
      'status-open': '#049FD7',
      'status-progress': '#6ABF4A',
      'status-review': '#FF6A00',
      'status-complete': '#919598',
      'status-draft': '#D1D1D1',
    },
    maxWidth: {
      'content': '1200px',
    },
    width: {
      'sidebar': '240px',
    },
  }
}
```

shadcn/uiのCSS変数も`globals.css`でこれらの色に上書きし、全コンポーネントがLenovo準拠のパレットを使用。

---

## 6. デプロイ構成（AWS）

```
┌──────────────────────────────────────────┐
│              AWS Cloud                    │
│                                           │
│  ┌──────────────┐    ┌────────────────┐  │
│  │  AWS Amplify  │───→│ RDS PostgreSQL │  │
│  │  (Next.js)   │    │ (db.t4g.micro) │  │
│  └──────────────┘    └────────────────┘  │
│         │                                 │
│         │ （将来拡張）                      │
│  ┌──────┴───────┐    ┌────────────────┐  │
│  │     S3       │    │     SES        │  │
│  │（添付ファイル）│    │（メール通知）    │  │
│  └──────────────┘    └────────────────┘  │
└──────────────────────────────────────────┘
```

### デプロイ手順

1. Amplifyアプリ作成 → Gitリポジトリ接続
2. 環境変数設定（`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`）
3. RDS PostgreSQL構築（db.t4g.micro, 単一AZ）
4. VPC・セキュリティグループ設定
5. ビルドステップに`prisma migrate deploy`追加
6. カスタムドメイン設定（あれば）

### 月額コスト見積もり

| サービス | 月額 |
|---------|------|
| AWS Amplify | ~$5-10 |
| RDS (db.t4g.micro) | ~$15 |
| **合計** | **~$20-25** |

議事録の「月額1-2万円」の想定にほぼ合致。

---

## 7. 実装上の注意事項

| 項目 | 方針 |
|------|------|
| 初期データ量 | 5-10件。カードが少なくても見栄えするUIは`03_screen_details.md`で設計済み |
| 認証 | 招待制。MVPではパスワードリセット不要。管理者がシード or 管理画面でアカウント作成 |
| 通知 | MVP対象外。ActivityLogが代替 |
| 日本語 | 全UIテキストは日本語直書き。i18n不要 |
| ボトルネック検知（A-1） | Prismaクエリで実装: 審査中3日超過 / 募集中30日超過・応募0件 / 新着応募3日超過 |
| パスワードハッシュ | bcryptで保存 |
