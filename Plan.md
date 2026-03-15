# Plank Timer — Plan.md

## プロジェクト概要

広告なし・ログイン不要のプランクトレーニング専用タイマーWebアプリ。
対象ユーザー: 30代女性・在宅勤務フルタイム子持ち・モチベーション維持に課題あり。

- リポジトリ: https://github.com/kazumi-natsu/plank-timer
- デプロイ先: Vercel（GitHub連携によるauto-deploy）
- ローカル開発: `cd /Users/kazumi/Projects/plank-timer && npm run dev`

## 技術スタック

| 項目 | 選定 |
|------|------|
| フレームワーク | Next.js 16 (App Router) |
| スタイリング | Tailwind CSS v4 |
| グラフ | Recharts |
| データ永続化 | localStorage のみ（外部API不使用） |
| PWA | next-pwa |
| デプロイ | Vercel |

## 主要ファイル

```
app/page.tsx              タイマー画面（メイン）
app/history/page.tsx      履歴・カレンダー画面
app/stats/page.tsx        統計画面
components/GoalSuggestionCard.tsx  スマートゴール提案カード
lib/goalSuggestion.ts     過去記録分析・目標提案ロジック
lib/stats.ts              統計計算ユーティリティ
lib/storage.ts            localStorage ラッパー
hooks/useTimer.ts         rAF + performance.now タイマー
```

## 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-03-15 | 初期実装完了（タイマー・履歴・統計・設定・PWA対応） |
| 2026-03-15 | モチベUI強化・スマートゴール提案機能追加 |
| 2026-03-15 | GitHubリポジトリ作成・push完了。Vercelデプロイ作業中（GitHub App連携待ち） |
