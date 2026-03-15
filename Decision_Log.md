# Plank Timer — Decision Log

| Issue | Decision | Why |
|-------|----------|-----|
| ビルドシステム | `next build --webpack`（Turbopack無効化） | next-pwa がTurbopack非対応のため |
| データ永続化 | localStorageのみ | ログイン不要・外部依存なし・オフライン動作を優先 |
| デプロイ方法 | GitHub + Vercel自動連携 | Androidスマホ利用のためURL固定・pushで自動デプロイが適切 |
| リポジトリ可視性 | プライベート | APIキー等はないが非公開で問題なし。Vercel無料枠で対応可 |
| UIトーン | 達成感重視・プレッシャーなし・やわらかい文体 | 対象ユーザー（30代・子持ち・多忙）に合わせる |
