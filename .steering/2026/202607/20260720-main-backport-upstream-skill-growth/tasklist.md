# タスクリスト — 移植元 skill 成長分の backport

> 実装の唯一のソース: 同ディレクトリの `design.md`（各項目 T1/T3/S1/S2/D1/S3 の挿入先・具体文言・汎用化方針を記載済み）。
> このタスクリストは順序と検証単位を定める。文言は design.md を正とする。

## 🚨 タスク完全完了の原則
- 全タスクを `[x]` にするまで作業継続。未完了 `[ ]` を残して終了しない。
- フェーズ完了ごとに即 `[x]` 更新（最後にまとめて更新は禁止）。

## テスト・検証について（この repo 固有）
- この repo は skill / プロンプト定義中心で、自動コードテスト・UI が無い。よって従来の「テスト作成」の代わりに各フェーズで次を検証手段とする:
  - **リーク grep**: 変更ファイルに移植元固有情報（社名・repo名・絶対パス・固有モデル名・commitハッシュ）が無いこと。`maintenance_policies/migration.md` のセルフチェックに準拠。
  - **通読整合**: 変更した SKILL.md を通読し、内部参照（§番号・Step番号）が解決し、前後の文脈と矛盾しないこと。
- visual-inspector / スクリーンショットは対象外（UI 変更なし）。

---

## フェーズ1: migration ポリシー整備【完了済み】

> discussion 論点4（移植成果物は公開先前提で書く）の Step 9 相当を、文脈が熱いうちに先行適用したもの。

- [x] `skills/maintenance-plugin-context/maintenance_policies/migration.md` を作成（「リポジトリ固有情報の除去」見出し＋なぜ/抜くもの/残すもの/やり方/適用範囲/セルフチェック）
- [x] `skills/maintenance-plugin-context/SKILL.md` に `## Maintenance policies` を追加し migration.md を参照

### DoD
- migration.md が「移植・追随時に参照元固有情報を抜く」規約を見出し付きで持つ ✅
- maintenance-plugin-context/SKILL.md から migration.md への参照が張られている ✅

---

## フェーズ2: task-design backport（T1 + T3）

対象ファイル: `.claude/skills/task-design/SKILL.md`

- [x] T1: §9「軽量モード（discussion 駆動）」を新設（design.md T1 変更4 の文言）
    - [x] description 末尾に軽量モード言及を追記（変更1）
    - [x] §4 冒頭に §9 連動参照を追記（変更2）
    - [x] §5 Step 4 末尾に §9-4 連動参照を追記（変更3）
    - [x] ファイル末尾に §9-1〜9-6 を追加（変更4、`discussion.md`→`task-design-discussion.md` 統一・§9-5 は汎用版）
- [x] T3: Step 4 完了判定に「読み手セルフレビュー」＋「設計記述の主語の選び方」を追加（design.md T3 の文言、セキュリティ文脈語は汎用化済み）
- [x] 検証: §9-6 が参照する §2-3 観点4 / §3 が実在すること、§4・§5 の連動参照が §9 に解決することを通読確認（§9=L689, 参照=L19/389/558, §2-3観点4/§3実在）
- [x] 検証: リーク grep（このファイル）→ 0件

### DoD
- task-design/SKILL.md に §9 が存在し、description・§4・§5 Step 4 から §9 への参照が解決する
- Step 4 完了判定に読み手セルフレビュー・主語の選び方の2ブロックが入っている
- 移植元固有語が grep で 0 件

---

## フェーズ3: steering backport（S1 + S2）

対象ファイル: `.claude/skills/steering/SKILL.md`

- [x] S1: Step 7 第1チェック項目に「同一エンドポイント（内部分岐）でのフェーズ境界」サブ項目を追加（L333、Rails 依存語は薄めた design.md S1 の文言）
- [x] S2: 注意事項（`会話は日本語で行うこと。` の直後）に「ドメイン固有名詞を略称で書かない」を追加（L26-28、悪い例/良い例は汎用仮名 UP/PM）
- [x] 検証: Step 7 チェックリスト・注意事項が箇条書きとして整合しているか通読確認
- [x] 検証: リーク grep（このファイル。S2 の例が汎用仮名であること）→ 0件

### DoD
- Step 7 に内部分岐フェーズ境界の観点が入っている
- 注意事項に略称禁止ルールが入り、例が汎用仮名（UP/PM 等）である
- 移植元固有語が grep で 0 件

---

## フェーズ4: steering S3（summary.md 翌月自動まとめ方式）

> S1/S2 とは別フェーズ。summary 運用の構造変更で、複数箇所＋ファイル削除＋テンプレート編集を伴う独立した検証単位。

対象: `.claude/skills/steering/SKILL.md`、`.claude/skills/steering/templates/summary_entry.md`、`.claude/skills/steering/templates/tasklist.md`

- [x] 変更1: Step 1 item 4 を「前月分 summary.md の自動まとめ」に差し替え（L171、概要=design.md `## 1. TL;DR`（無ければ `## 目的`）、ステータス=tasklist.md チェックボックス）
- [ ] 変更2: `templates/summary_entry.md` を削除 → **ユーザー実行待ち**（Bash サンドボックスが plugin `skills/` 配下の削除を拒否。参照はすべて除去済み＝ファイルは既に inert）
- [x] 変更3: Step 6 パターンA の roadmap/親子 summary 記録ロジックを削除し「summary.md には記録しない」注記に置換（L276）
- [x] 変更4: `templates/tasklist.md` の完了後アクションから「summary.md のステータスを完了に更新する」タスクを削除、親ロードマップ更新を roadmap.md 依存に置換（L132）
- [x] 変更5確認: Step 1 の branch 命名（`[YYYYMMDD]-[branch]-[slug]`）は現状維持で触っていない（L34/L170）
- [x] 検証: SKILL.md/templates 内で summary_entry.md への参照が残っていないこと（grep 0件）
- [x] 検証: 自動まとめの抽出元（design.md TL;DR / tasklist.md）が plugin の実テンプレート構造と一致（design.md 論点3 と整合）
- [x] 検証: リーク grep → 0件

### DoD
- Step 1 が「翌月初に前月分を自動まとめ」方式になっている
- summary_entry.md が削除され、SKILL.md/templates に同ファイルへの参照が残っていない
- roadmap/親子の summary 記録ロジックが除去され、完了後アクションの summary 手動更新タスクが消えている
- 抽出元が plugin 構造（概要=design.md TL;DR、ステータス=tasklist.md）に adapt されている

---

## フェーズ5: doc-enricher backport（D1）

対象ファイル: `.claude/skills/doc-enricher/SKILL.md`

- [x] D1: ステップ1（`候補を出した後でなく、**出す前に**確認する` の後）に「確認範囲を対象ディレクトリに閉じない」を追加（L64、API仕様パスは汎用化済み）
- [x] 検証: ステップ1 の箇条書き整合を通読確認
- [x] 検証: リーク grep → 0件

### DoD
- doc-enricher/SKILL.md ステップ1に「確認範囲を閉じない」原則が入っている
- 移植元固有パスが grep で 0 件

---

## フェーズ6: 全体品質チェック

### DoD
- リポジトリ全体で移植元固有情報のリークが 0
- 変更した全 skill が単体で通読して整合する

### タスク
- [x] repo 全体リーク grep: 移植元の社名・repo名・組織名・絶対パス・固有モデル名・固有外部サービス名・commitハッシュがヒットしないこと → 0件（`OrderEntry` は plugin 既存の汎用例で移植元固有ではないと確認）
    - 自分の tasklist に組織名の文字列が残っていたため汎用化（migration.md セルフチェック適用）
- [x] 変更した4ファイル（task-design / steering / doc-enricher の SKILL.md ＋ steering templates/tasklist.md）を通読し、内部参照の解決・前後文脈の整合・見出し連番を最終確認
- [x] シンボリックリンク運用の確認: 実体 `.agents/skills/`、`skills/`・`.claude/skills/` は同一 inode（126439368）。リンク切れ・二重実体なし

---

## 動作確認

### DoD
ユーザーが変更後の skill 定義を確認し、意図通り（軽量モード・各追加ルール・summary 方式）であると合意した

### タスク
- [ ] ユーザーに変更内容の確認を依頼する（特に S3 の summary 方式変更と、各移植文言の汎用化度合い）
- [ ] フィードバックがあれば `implementation_review.md` を作成して収集する
    - フィードバックなしの場合は `~~フィードバック収集~~（フィードバックなし）` で完了扱い

---

## 完了後のアクション

> ⚠️ 動作確認フェーズが完了するまでコミットを促さない。急かさない。

- [ ] `.steering/2026/202607/summary.md` の本 steering エントリのステータスを「完了」に更新する
    - ※ 本 repo の steering は S3 適用後は翌月自動まとめ方式になるが、本 steering の summary エントリは既に手動記載済み。ステータス更新のみ行う（移行期の扱い）
- [ ] コミット（現在 `main` ブランチのため、まず作業ブランチを切ってからコミットする）
    - フェーズ単位で分割: ①migration ポリシー ②task-design ③steering S1/S2 ④steering S3 ⑤doc-enricher
    - ユーザーが「不要」「後で」と回答した場合は `- [x] ~~コミット~~（ユーザーが不要と回答）` で完了扱い
- [ ] GitHub 連携（ユーザーが push/PR を希望した時のみ）
    - `git push -u origin <作業ブランチ名>`
    - steering skill directory の `scripts/github/create_or_get_pr.sh`
    - コミットが1件も無い場合は実行しない。急かさない
