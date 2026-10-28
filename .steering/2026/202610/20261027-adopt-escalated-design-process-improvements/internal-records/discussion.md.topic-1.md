# 内部検討記録: 論点1 — task-design が依拠する repository context のテスト方針を、root README の検証規約に合わせるか

**discussion:** [discussion.md](../discussion.md)

**論点:** 論点1

## 開始context

- steering の Step 4-1（doc-enricher の提案 mode）と Step 4-2（議論ごとの再発防止 review）。
- 対象: この steering の task-design-discussion.md 論点1〜4。

<a id="iteration-0"></a>

## イテレーション0: 再発防止先の特定

<a id="iteration-0-record-1"></a>

### 調査: 議論ごとの根本原因

確かめたもの:

- 論点1〜3: 引き渡された改善提案 3 件。根本原因は、判断の時点の skill・標準に問いが無いことで、この作業がその問いを置く。追加の保存先は要らない。
- 論点1〜3 の変更内容（構造reviewの不合格 1〜6 から導いたもの）: 設計時・編集後の `skill-update-review` が位置と受渡しの欠落を見つけた。review の仕組みが機能した結果であり、新しい保存先は要らない。
- 論点2 のフィードバック（「facilitate は記録役」）: facilitate-discussion の責務境界は既存の SKILL.md にあり、今回 task-design Step 3 に「同skillのscope判定は議論記録に論点を作るかの判定であり、作業の範囲の判断を兼ねない」を足した。保存済み。
- 論点4 と変更内容1: どちらも、validator が skill と docs の内容を assertion で検査し、変更のたびに assertion を足す規約が守られなかった。規約は root `README.md` の「変更時の検証と前提」にある。task-design が設計前に読む context instance（`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`）の「テスト方針」は「manifest の整合確認だけ、skill 本文は人の review で担保」と書き、「全体 test command」は 1 本だけを挙げる。
- 同じ file が配布 template と instance を兼ねる件: `.steering/2026/202608/20260823-route-skill-feedback-to-plugin-steering/design.md` に既知の欠陥として記録済み（非目標）。

結果:

- 保存先は context instance のテスト方針と全体 test command。README を正本として参照し、規約の中身は写さない。
- doc-enricher の Gate: 永続性（検証の規約は repository の運用として続く）、レバレッジ（設計前調査で assertion の要否に当たる）、非自明（context が逆を書いている）、低メンテ（README を参照し、規約の中身を持たない）、非重複（context に無い）を満たす。
- steering skill 自身の変更（Step 4-3）は要らない。

<a id="iteration-0-record-2"></a>

### 適用: 合意の後の context への反映

入力: 利用者の実応答「a」（2026-10-28。原文は [論点1 の提案0へのフィードバック](../discussion.md#提案0へのフィードバック論点1)）。

結果:

- `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の「テスト方針」の 2 文目を、README の「変更時の検証と前提」を正本として参照し、assertion の追加を求める文へ置き換えた。
- 「全体 test command」の `validate-plugin.mjs` の項目に assertion の検査を書き足し、`test-task-design-handoff.mjs` と `inspect-discussion.test.mjs` を足した。
- 3 本の検証 command はいずれも通過した。
