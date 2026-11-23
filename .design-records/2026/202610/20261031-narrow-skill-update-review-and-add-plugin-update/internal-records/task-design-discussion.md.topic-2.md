# 内部検討記録: 論点2 — skill-update-review が切り出しの候補を見つけた時、更新の完了を止めるか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点2

## 開始context

design.md の骨格に利用者が「ok」と答えた（2026-10-31）。骨格の TBD のうち、返す結果の形と呼出し側の完了条件を決めるのはこの論点であり、読む範囲（hash、材料不足）と呼ぶ時期の答えもこれに依る。最上位として先に問う。

<a id="iteration-0"></a>

## イテレーション0: 知らせるだけにするか、完了を止めるか

<a id="iteration-0-record-1"></a>

### 調査: 今の決定と、利用者の今回の言葉

#### 入力

- 問い: 今の skill-update-review は、候補を見つけた時に何をするか。その決定はどこから来たか。利用者は今回何と言ったか。
- 方法: 2026-10-31 に、20261018 の task-design-discussion の論点31（提案0、フィードバック、決定）と、`skill-update-review/SKILL.md`・`assess-structure.md`、`task-design/SKILL.md` の Step 6 を読んだ。

#### 結果

- 論点31 の提案0 は、a（改善候補として返し、今回直すかは担当側で決める）と b（構造上の不合格が残っていたら更新完了にしない）を示し、b を推した。利用者は「b」と答えた。
- 論点31 の決定は、不合格が残る間は設計か編集へ戻し、通常の完了扱いにしないとする。理由は、問題を見つけても抱え込み続けられる状態を避けること。
- 今の `SKILL.md` は「不足・不合格を残したまま通常完了へ進まない」、`assess-structure.md` は「既存の不合格も通常完了までに解消」と書く。`task-design/SKILL.md` の Step 6 は、不合格・材料不足・影響不明を残したまま ready result を返さないとする。
- 利用者の今回の言葉（2026-10-31）: 「あれに依頼したことはskill.mdから切り出せるものがあったら分割透知しろってだけの内容だったのに」「skill-update-reviewが、切出しだけで機能してるならいいんだけど」。

<a id="iteration-0-record-2"></a>

### 判断: 選択肢と推奨

#### 入力

- 問い: どちらを推すか。どちらを選んでも抱え込みが流れて消えないか。
- 方法: 上の結果を、`development_flow/work_scope.md` の二段目（拾うか切り出すか）と照らした。

#### 結果

- 推奨は a。利用者の今回の言葉（通知）に合う。
- 論点31 の懸念（抱え込み続ける余地）は、`work_scope.md` で受け止められる。
    - 既定は今の作業で拾う（切り出す）。
    - 別の作業にするのは、大きすぎる・単体で revert したい・本番適用が遅れる時だけで、切り出し先を先に作る。
- a の代償: 呼出し側が別の作業にすると判定した時、その場では切り出されない。
- 今回の利用者の言葉と論点31 の決定は向きが違い、答えは利用者の内側にある。採否を問う。

<a id="iteration-1"></a>

## イテレーション1: a から導く変更

<a id="iteration-1-record-1"></a>

### 判断: 残る TBD と、文の変更

#### 入力

- 問い: 利用者の「a」（2026-10-31）と元の作業の論点9 から、design.md の残る TBD（読む範囲と記録、いつ呼ぶか）と、skill-update-review・呼出し側の文は一つに決まるか。
- 方法: 2026-10-31 に、skill-update-review の全 file、呼出し側 4 file の該当節、validator の skill-update-review の assertion、20261018 の論点33・41〜47 の題と決定の要旨を照らした。

#### 結果

- 材料不足: a で判定を持たないと決めたので外す。
- 内容 hash と結果の再利用: 論点47 で合格の判定を後の工程で使うために版へ結んだ。判定が無いので外す。
- 読む範囲: 論点43〜46 で受渡し・script・共有指示まで読むと決めたのは、それらの問題を見るためだった。論点9 で見ないと決めたので、対象 skill の `SKILL.md` と内部指示の全体と、設計時の構造案に限る。script は、利用者の言葉（SKILL.md から）により読まない。
- 呼ぶ時期: 論点33 の理由は範囲を絞っても変わらない。変えない。
- file の構成: `collect-review-material.md` は中身がすべて不要になり、残る 1 行は `SKILL.md` で足りるので削除する。`assess-structure.md` は名前が広い範囲を示すので `find-split-candidates.md` へ改名する。
- 呼出し側: 「内容識別」「材料不足」は skill-update-review の結果の扱いだけに使われている（grep で 4 file・10 行）。外して、候補の扱いを足す。tasklist-executor は既存の「実装feedbackの記録と返却」を通し、そこから実装 feedback の共通処理（`runtime-feedback-review.md`）で `work_scope.md` の判定が行われる。
- どれも利用者の新しい採否を要しない。導出変更として報告し、次の実応答を確かめてから反映する。
- skill-update-review（設計時）: 元の作業の論点9 の決定に従い、切り出しの判断だけを新しい構成に当てた。`SKILL.md` は入口・見るもの・進行・返したあとを持ち、判断基準は `find-split-candidates.md`、返す形は template が持つ。独立した判断・状態・完了条件を持つ工程を一つの file に抱え込んではいない。候補なし。

<a id="iteration-1-record-2"></a>

### 判断: 決定の後の doc-enricher の提案 review（origin: 論点2 の決定）

#### 入力

- 問い: 論点2 の決定から、README や既存 docs に足すべき、再利用価値の高い知識があるか。
- 方法: 2026-10-31 に、決定と `skills/README.md`、`development_flow/work_scope.md` を照らした。

#### 結果

- 候補なし。skill-update-review の役割は skill 自身と `skills/README.md` の一行が持ち、今切り出すかの判定は `work_scope.md` が持つ。どこかへ写すと二か所になる。
