# Plank Timer

広告なし・ログイン不要のプランクトレーニング専用タイマーWebアプリ。

## 機能

- **タイマー画面**: 円形プログレスリング付きカウントダウンタイマー
  - 30秒 / 60秒 / 90秒 / 120秒 / カスタム のプリセット選択
  - 残り10秒でリングがオレンジに変化
  - 完了時にバイブレーション + 効果音
  - 画面スリープ防止（Wake Lock API）
- **履歴画面**: GitHubコントリビューション風ヒートマップカレンダー
- **統計画面**: 週間棒グラフ・トレンド折れ線グラフ・ストリーク表示
- **設定**: 目標時間・効果音・バイブレーション・ダークモード切替・データエクスポート

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **スタイリング**: Tailwind CSS v4
- **グラフ**: Recharts
- **データ永続化**: localStorage
- **PWA**: next-pwa

## 開発環境

```bash
npm install
npm run dev
```

http://localhost:3000 で確認

## ビルド・デプロイ

```bash
npm run build
```

Vercelへのデプロイ:

```bash
npx vercel
```

## ディレクトリ構成

```
app/
├── layout.tsx          # 共通レイアウト + タブバー
├── page.tsx            # タイマー画面
├── history/page.tsx    # 履歴画面
└── stats/page.tsx      # 統計画面
components/
├── Timer/              # タイマー関連コンポーネント
├── History/            # 履歴・カレンダーコンポーネント
├── Stats/              # 統計グラフコンポーネント
├── SettingsModal.tsx   # 設定モーダル
└── TabBar.tsx          # 下部タブナビゲーション
hooks/
├── useTimer.ts         # タイマーロジック（rAF + performance.now）
├── useRecords.ts       # localStorage CRUD
├── useWakeLock.ts      # 画面スリープ防止
└── useSettings.ts      # 設定の読み書き
lib/
├── storage.ts          # localStorage ラッパー
└── stats.ts            # 統計計算ユーティリティ
types/
└── index.ts            # 型定義
```
