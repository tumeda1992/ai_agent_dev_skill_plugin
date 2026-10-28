# 内部検討記録: 論点4 — `validate-plugin` が今の既定 branch でも失敗している 4 件を、今の作業で拾うか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点4

## 開始context

- 改善 1〜3 を対象 file へ適用し、version を `8.1.1` に上げた後、受け入れ基準の `node scripts/verification/validate-plugin.mjs` を実行した。
- 決める範囲: 今回の変更に起因しない失敗を、今の作業で拾うか切り出すか。

<a id="iteration-0"></a>

## イテレーション0: 失敗の内訳と、拾うか切り出すか

<a id="iteration-0-record-1"></a>

### 調査: 失敗の内訳と起点

確かめたもの:

- 適用後の実行結果: 必須文言の欠落 6 件。
    - `task-design/SKILL.md` の「選んだ不確実性を、今回の段階のscopeへ含めるか判定する（3-5）」: 改善3 で Step 3 の手順を「目的の内にある不確実性を、…」へ書き換えたため。
    - `task-design/tasklist-design.md` の「引き継ぎの観点（…）を`design.md`の受け入れ基準へ入れる」: 改善1 で MUST を「Step 4で受け入れ基準へ入れた引き継ぎの観点（…）を前提にする」へ置き換えたため。
    - `steering/SKILL.md` の 3 件と `facilitate-discussion/read-discussion.md` の 1 件。
- HEAD `44c4992` を一時 worktree に取り出して validator を実行した。後者の 4 件が同じく失敗した（exit 1）。worktree は削除済み。
- `git log -S` で文言が消えた commit を特定した。`steering/SKILL.md` の 3 件は `1f09d43`（2026-10-25、実装 feedback の処理を `skills/runtime-feedback-review.md` へ移した）、`read-discussion.md` の 1 件は `b07286a`（読取の手順の書き直し）。
- 移動先: 3 件は `skills/runtime-feedback-review.md` に同じ文がある。`read-discussion.md` は手順 6 に「末尾提示・原文応答・現在state・親子と根拠を判断する」がある。
- 前回の steering（`.steering/2026/202610/20261018-escalate-pending-plugin-improvements/`）の保留 8 件（`pending-escalations/001`〜`008`）に、validator の失敗を扱うものは無い。

結果:

- 前者の 2 件は今回の変更の一対一の追随として、validator の必須文言を新しい文へ置き換えた。置き換え後の実行で、失敗は後者の 4 件だけになった。
- 後者の 4 件は、今回の作業の目的の外にある、記録されていない既存の不備である。

<a id="iteration-0-record-2"></a>

### 判断: `work_scope.md` の二段目に当てる

推奨: 拾う。

- 一段目: 改善 1〜3 の目的の決定・実装範囲は、この 4 件の扱いで変わらない。目的の外。
- 二段目: 1 file の 4 箇所で、検査の意図を変えず所在だけを追随させる。commit を分ければ review・revert の単位を崩さない。本番適用（配布）も遅れない。切り出す 3 条件のどれにも当たらない。
- 加えて、今の作業の受け入れ基準（validator が passed を出す）は、この 4 件を直さないと満たせない。

拾うか切り出すかは利用者の判断を含むため、推奨として discussion で合意する（task-design §4、design.md 改善3 の Step 3 の扱い）。

<a id="iteration-0-record-3"></a>

### 適用と検証: 合意の後の validator への反映

入力: 利用者の実応答「a」（2026-10-28。原文は [論点4 の提案0へのフィードバック](../task-design-discussion.md#提案0へのフィードバック論点4)）。

結果:

- `scripts/verification/validate-plugin.mjs` の `steeringSkill` の検査から 3 文言を外し、`runtime-feedback-review.md` の文字列を求める項目を足した。3 文言は新しい `runtimeFeedbackReview` の検査へ移した。`discussionRead` の必須文言を「末尾提示・原文応答・現在state・親子と根拠を判断する」へ置き換えた。
- `node scripts/verification/validate-plugin.mjs`: `plugin validation passed`（exit 0）。
- 同じ repository の他の検証: `node scripts/verification/test-task-design-handoff.mjs` は `task-design handoff tests passed`。`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` は 25 件中 24 passed、0 failed、1 skipped（前回の steering の記録と同じ既存の環境依存の skip）。
- design.md の受け入れ基準の TBD を解消し、「完成後の姿」に「validator の必須文言」の節を足した。

<a id="iteration-1"></a>

## イテレーション1: 既存の検証規約との照合

<a id="iteration-1-record-1"></a>

### 調査: validator へ assertion を足す規約

確かめたもの:

- root `README.md` の「変更時の検証と前提」: validator は assertion（`requireText` 等）で skill と docs の内容を検査する。skill または docs を追加・変更したら対応する assertion を足し、assertion が固定している文字列を変えたら追随させる。`forbidText` を先に確かめる。
- `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`（この repository の context instance。`.agents/skills` は `plugins/tumeda-dev/skills` への symlink）の「テスト方針」: 「検証は `scripts/verification/validate-plugin.mjs` によるplugin manifestの整合確認だけである。skill本文の内容は人のreviewで担保する」。「全体 test command」は validate-plugin の 1 本だけを挙げる。
- validator の `forbidText` のうち、今回変えた file を対象にするもの（`taskDesignTemplate` の旧設計判断 format、`taskDesignSkill` の旧番号・旧 process・model 宣言）は、今回の差分と関係しない。
- 今回足した契約（Step 4 の確認項目、Step 3 の目的の内外の判定、`tasklist-design.md` の冒頭、`runtime-feedback-review.md` の判定、`document-review` の観点、新しい 2 標準とその参照）に対応する assertion は無い。

結果:

- README の規約から、新しい契約の assertion を足す変更が一意に導ける。変更内容1 として報告する。
- design が assertion を含めなかった原因は、task-design が依拠した context のテスト方針が README と食い違っていたことである。context の修正は今の作業の目的の外にあり、steering の再発防止 review（Step 4-2）で扱う。

<a id="iteration-1-record-2"></a>

### 適用と検証: 合意の後の assertion の追加

入力: 利用者の実応答「a」（2026-10-28。原文は [論点4 の現在の変更](../task-design-discussion.md#現在の変更論点4)）。

結果:

- `scripts/verification/validate-plugin.mjs` の末尾（失敗の集計の前）に、改善 1〜3 の契約を固定する assertion を足した。内訳は design.md の「validator の必須文言」の節の表のとおり。
- `node scripts/verification/validate-plugin.mjs`: passed。`node --check` も通過。
- 検出力の確認: 作業 tree を scratchpad へ複製し、`SKILL.md` の「**作業の外へ残る変化の引き継ぎ**」を書き換え、`tasklist-design.md` へ例の表の行を戻し、`work_scope.md` を削除して実行した。必須pathの欠落、必須項目の欠落、禁止項目の残存がそれぞれ失敗として出た（exit 1）。複製は削除済み。
- `test-task-design-handoff.mjs` は passed、`inspect-discussion.test.mjs` は 24 passed・0 failed・1 skipped。
