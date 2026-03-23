# 04. デザイントーン

> **ステータス: 確定** — [lenovojp.com/business/](https://www.lenovojp.com/business/) を参考にトーンを策定。
> カラーとデザインイメージをLenovoに合わせつつ、コンポーネントはシンプル＆モダンに仕上げる。

---

## 参考元: Lenovo Japan Business サイトの特徴

- コーポレートB2B日本語サイト。クリーン・構造的・情報密度高め
- グレー基調にRed（ブランド）とBlue（CTA）をアクセント使い
- 装飾は最小限（薄いシャドウ、小さなborder-radius、グラデーションなし）
- プロフェッショナルで落ち着いたトーン

---

## カラーパレット

Lenovoサイトから抽出した色をベースに、業務アプリ向けに調整。

### コアカラー

| 役割 | カラー | Hex | 用途 |
|------|--------|-----|------|
| Primary Dark | ■ | `#222222` | テキスト、見出し |
| Brand Gray | ■ | `#6C747D` | ヘッダー背景、セカンダリボタン、見出しアクセント |
| Brand Red | ■ | `#E2231A` | ブランドアクセント、アクティブ状態、重要な強調 |
| CTA Blue | ■ | `#049FD7` | リンク、プライマリアクション、CTAボタン |

### サーフェス・背景

| 役割 | Hex | 用途 |
|------|-----|------|
| White | `#FFFFFF` | メインコンテンツ背景 |
| Off-white | `#FAFAFA` | セクション背景（交互） |
| Light Gray | `#F0F0F0` | カード背景、サイドバー |
| Border | `#E2E2E2` | カード枠線、区切り線 |
| Border Dark | `#D1D1D1` | ナビゲーション下線 |

### ステータスカラー（アプリ独自）

| ステータス | Hex | 用途 |
|-----------|-----|------|
| 募集中 | `#049FD7` | Blue系 — CTAと統一 |
| 進行中 | `#6ABF4A` | Green — Lenovoサイトのグリーンボタンから |
| 審査中 | `#FF6A00` | Orange — Lenovoサイトのオレンジアクセントから |
| 完了 | `#919598` | Gray — サブテキストカラーから |
| 下書き | `#D1D1D1` | Light Gray |

---

## タイポグラフィ

Lenovoサイトはシステムフォント依存。アプリでも軽量さを重視しつつ、やや整える。

```
font-family: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
```

### サイズスケール

| 用途 | サイズ | Weight |
|------|--------|--------|
| ページタイトル | 26px | Bold |
| セクション見出し | 20px | Bold |
| カード見出し | 16px | Bold |
| 本文 | 14px | Normal |
| サブテキスト・ラベル | 12px | Normal |
| 極小（日付など） | 11px | Normal |

### 行間

- 見出し: `line-height: 1.3`
- 本文: `line-height: 1.6`
- コンパクト表示: `line-height: 1.4`

---

## コンポーネントスタイル

Lenovoサイトのトーンを踏襲しつつ、**モダンでシンプルなコンポーネント**に仕上げる。

### ボタン

```
【プライマリ（CTA）】
背景: #049FD7 → hover: #0388B9
文字: #FFFFFF
padding: 10px 24px
border-radius: 4px
font-weight: bold
shadow: none（フラットデザイン）

【セカンダリ】
背景: #FFFFFF
文字: #6C747D
border: 1px solid #D1D1D1
hover: background #F0F0F0

【アクセント（重要アクション）】
背景: #E2231A → hover: #C91E16
文字: #FFFFFF
```

- Lenovoサイトはグラデーションボタンだが、アプリではフラットに簡略化
- border-radiusは `4px`（Lenovoの3pxよりわずかにモダン寄り）

### カード

```
背景: #FFFFFF
border: 1px solid #E2E2E2
border-radius: 8px
padding: 20px
shadow: 0 1px 3px rgba(0,0,0,0.08)
hover: shadow 0 2px 8px rgba(0,0,0,0.12)
```

- Lenovoサイトより少しだけシャドウを効かせて立体感を出す
- 角丸はやや大きめにしてモダン感を加える

### テーブル

```
ヘッダー背景: #F0F0F0
ヘッダー文字: #6C747D, bold
行背景: #FFFFFF（交互: #FAFAFA）
border-bottom: 1px solid #E2E2E2
セルpadding: 12px 16px
```

### ステータスバッジ

```
border-radius: 12px
padding: 4px 12px
font-size: 12px
font-weight: bold
背景: 各ステータスカラーの10%透明度
文字: 各ステータスカラー
```

### ナビゲーション見出しアクセント

```
Lenovoスタイルの左ボーダー:
border-left: 4px solid #E2231A
padding-left: 12px
```

- セクション見出しにLenovoらしい赤の左アクセントを入れる

### フォーム入力

```
border: 1px solid #D1D1D1
border-radius: 4px
padding: 10px 12px
font-size: 14px
focus: border-color #049FD7, box-shadow 0 0 0 2px rgba(4,159,215,0.15)
```

---

## レイアウト基本値

| 項目 | 値 | 備考 |
|------|-----|------|
| コンテンツ最大幅 | 1200px | Lenovoサイトと同じ |
| サイドバー幅 | 240px | |
| カード間隔 | 20px | |
| セクション間隔 | 40px | |
| ヘッダー高さ | 60px | |
| 内部padding | 16px〜24px | |

---

## トーンまとめ

### やること
- Lenovoブランドカラー（Gray + Red + Blue）を軸にした配色
- 情報密度の高い、構造的なレイアウト
- 最小限の装飾（フラットデザインベース、薄いシャドウ）
- 赤はアクセント使い（見出し左ボーダー、重要ボタン、ホバー状態）
- プロフェッショナルで落ち着いたB2Bトーン

### やらないこと
- グラデーションの多用（Lenovoサイトにはあるが、アプリではフラットに）
- 派手なアニメーション
- 過度な装飾やイラスト
- カラフルすぎる配色（コアカラー3色＋ステータス色に絞る）
