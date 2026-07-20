# 調査: 移植元 skill の成長分 backport 候補

> 用語: **移植元（upstream）** = 本 plugin の skill の派生元リポジトリ。移植後も独自進化を続けている本家。
> **plugin（本 repo）** = この配布用リポジトリ。移植元から汎用化してコピーした側。
> ※ 移植元の固有名・絶対パス・固有ドメイン名は本ドキュメントに残さない（この steering ディレクトリは公開 plugin repo に含まれるため）。

## 背景・前提

- 移植元が本家。移植後も独自に成長を続けている。
- plugin（本 repo）の skill は 2026-07-20 に移植元から「転記 → 再移植（意訳でスカスカだったため）」で作成された。
- 対象 skill: `doc-enricher`, `think-through`, `steering`, `task-design`

## 移植元での各 skill の成長状況

移植元の該当パスの履歴を確認した結果:

| skill | 移植後の成長 | 内容 |
|---|---|---|
| doc-enricher | なし | 初版のみ。追加成長なし |
| think-through | なし | 初版のみ。追加成長なし |
| steering | 3 回 | 初版後に 3 回の成長 commit |
| task-design | 2 回 | 初版後に 2 回の成長 commit |

→ 移植元の作業ツリーにも対象 4 skill の未 commit 変更は無い（対象外 skill に別変更があるのみ）。

## doc-enricher: 差分結果

移植元 → plugin の差分は「plugin 側が配布用に汎用化した」ものが大半で、移植元独自の新規成長は見当たらない。

- plugin 側で追加: `## repository固有文脈` セクション（`maintenance-plugin-context` skill への委譲）→ plugin 配布のための追加。backport 対象外。
- plugin 側で追加: `discussion.md` を最優先素材とする記述 → plugin 独自の steering skill との連携強化。backport 対象外（むしろ plugin → 移植元方向）。
- 移植元にのみ存在: 「API 定義ファイル（API 仕様書ディレクトリ）も確認対象に含める」ステップと固有ドメインの具体例 → 移植元固有。汎用化された `repository固有文脈` 委譲で代替可能なため backport 不要と判断。
- 【弱い backport 候補 = D1】「確認範囲を対象ディレクトリに閉じず、関連する上位・隣接文書（API 仕様等）まで広げる」という**原則**自体は汎用化して取り込む価値がある。優先度は低い。

## think-through: 差分結果

- 差分はインデント記法の違いと、plugin 側の追加（`repository固有文脈` 委譲、genshijin skill 併存のための表記追加）のみ。
- 移植元の独自成長は無し。backport 候補なし。

## steering: 差分分析（エージェント委譲 + 原文検証）

### backport候補（★= 原文検証済み）
1. 【最優先・検証済 = S1】tasklist 自己レビュー（Step 7）に「同一エンドポイント（内部分岐）でのフェーズ境界を検討する」を追加。plugin 側の Step 7 には「複数操作の混在」「外部サービス混在」チェックはあるが、この「同一エンドポイント内の内部分岐」の盲点だけ欠けている。
   - 反映時: 移植元の Rails 依存語（`controller#action` 等）を「エンドポイント/処理単位」に軽く抽象化。
2. 【中・検証済 = S2】注意事項に「ドメイン固有名詞を略称で書かない」を追加。
   - 反映時: 悪い例/良い例は移植元固有のドメイン名なので、汎用の仮名に差し替え必須。

### 汎用化差分（除外）
- tasklist フェーズ3 を移植元専用のレビューオーケストレータ skill に置換 → plugin 側は `visual-inspector` ベースの汎用形で代替済み。ただし「自己解決ループ」構造は将来 plugin が汎用コードレビュー skill 連携を持つ場合に再検討余地あり。
- 移植元固有の実績パス・社内用語の削除 → plugin には元々ない。

### 環境固有だが境界事例 → ユーザー判断で backport 決定（= S3）
- summary.md 運用を「都度追記型」→「翌月自動まとめ型」に変更し `summary_entry.md` を削除（動機 = 複数人並行時のコンフリクト最小化）。
  - plugin は現在も旧方式（都度追記＋`summary_entry.md` 保持）。
  - 当初は「移植元固有の動機」で除外に分類したが、ユーザーが backport を選定 → **option a（完全移植・adapt あり）で確定**。詳細は design.md / discussion 論点2・3。

## task-design: 差分分析（エージェント委譲 + 原文検証）

### backport候補（★= 原文検証済み）

★★★ **重要訂正: T2 は誤報だった。** 委譲エージェントは「§5 Step 3『論点の粒度と質問の材料』が移植元にあって plugin に無い」と報告したが、実際は逆。
- 移植元側には「論点の粒度」該当文言が存在しない（grep 0件）。
- plugin 側にはすでに存在する（`task-design/SKILL.md:465-469`）。
- → **T2 は backport 不要（no-op）**。plugin に既にある。移植方向は移植元 → plugin のみなので、「plugin にあって移植元に無い」ものは定義上 backport 対象になりえない、という不変条件で検出できた。

1. 【最優先・検証済 = T1】§9「軽量モード（discussion 駆動）」全体の追加（description 冒頭＋§9 本体＋§4/§5 末尾の連動参照）。plugin には §9 も description の軽量モード言及も無い。
   - docs/skill 作成のような「完成後の姿が紋切り型で書けない/不要な」タスク向けの軽量フロー。plugin 想定シーンに直撃。
   - 反映時: §9-5「実例リファレンス」は移植元固有パス参照のため削除 or 汎用化。他は非依存。
2. ~~【高】§5 Step 3「論点の粒度と質問の材料」~~ → **取り下げ（plugin に既存）**。
3. 【高・検証済 = T3】Step 4「読み手セルフレビュー」＋「設計記述の主語の選び方」の追加。plugin の Step 4（`517-523`）には無い。
   - 「論点全解消＝設計完了」判定の穴（tasklist 化で"なぜこの変更か"を辿れない）を埋める。主語は「修正の入口」にする原則。
   - 反映時: 移植元固有のセキュリティ文脈の例は汎用例に言い換え。原則は非依存。

### 汎用化差分（除外）
- `maintenance-plugin-context` 委譲、ドメイン用語の汎用化、外部サービス具体例の汎用化、テストフレームワーク名の置換、テンプレート参照パスの一般化、`design-consult` の所在明示。
- design.md / discussion_entry.md はインデント差のみで内容同一。

### 環境固有差分（除外）
- 技術検証の実行環境・成果物置き場運用 → plugin は既に `maintenance-plugin-context` 委譲で汎用化済み。

## 最終選定

| 記号 | skill | 内容 | 判定 |
|---|---|---|---|
| T1 | task-design | §9 軽量モード | 移植（最優先） |
| T2 | task-design | 論点の粒度 | 取り下げ（plugin に既存） |
| T3 | task-design | Step4 読み手セルフレビュー + 主語 | 移植 |
| S1 | steering | Step7 内部分岐フェーズ境界 | 移植（最優先） |
| S2 | steering | 注意事項 略称禁止 | 移植 |
| S3 | steering | summary.md 翌月まとめ方式 | 移植（option a・adapt あり） |
| D1 | doc-enricher | 確認範囲を閉じない | 移植（低優先） |
