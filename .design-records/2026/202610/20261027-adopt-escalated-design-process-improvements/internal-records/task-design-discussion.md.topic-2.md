# 内部検討記録: 論点2 — その場で気付いた不備を拾うか切り出すかの基準と、対になる scope の判定を、どこに置き、どの経路から当てるか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点2

## 開始context

- 引き渡された改善 3: 作業中にその場でしか気付けない不備は、小さければ今の作業で拾う。大きすぎる・単体で revert したい・本番への適用が遅れる、のどれかに当たるものだけを切り出す。切り出すときは理由と切り出し先を書く。対になる scope の判定（scope 内の未決があれば design の合意を求めない、scope 外の判断を design の論点にしない、「選択肢にコード変更が含まれる」は scope 内の根拠にならない）を組で扱う。
- 引き渡された提案の置き場所は「task-design」。利用者の元の発言も task-design の修正を求めていた。
- 論点1 の決定: 暫定の判断の書き方は `provisionality_explicitness.md` が正本。改善 3 の「切り出すときは理由と切り出し先を書く」はこれを使う。
- 決める範囲: 基準の正本の file、当てる経路（適用する段階）、scope の判定の 2 規則の置き場所。基準の文面は置き場所の合意の後に書く。

<a id="iteration-0"></a>

## イテレーション0: 基準の正本と、当てる経路

<a id="iteration-0-record-1"></a>

### 調査: 具体例が起きた段階と、そこで動いていた手順

確かめたもの:

- 拾った具体例 2 件（README の暫定性の欠落、CI の state lock の待ち時間）: どちらも実装・動作確認の途中で見つかった。steering が実装 feedback として `runtime-feedback-review.md` を読み、`implementation_review.md` へ facilitate-discussion で記録していた。task-design は動いていない。
- `runtime-feedback-review.md`: steering と tasklist-executor が、実装・review・validation・利用者確認の feedback を受領したときに読む（`steering/SKILL.md` と `tasklist-executor/SKILL.md` の 2 箇所から参照）。agent 自身が見つけたものも同じ扱いにする。decision 後の戻り先（design phase、tasklist plan phase 等）を列挙するが、目的の外にある不備を拾うか切り出すかの判定は無い。
- `facilitate-discussion/SKILL.md` の「scopeと親子関係」: 最初の問いは「このdecisionの結論が変わると、現在のdiscussion目的または指定parentの決定・実装範囲が変わるか」。変わらなければ active な論点を作らず「consumer内部の判断またはscope外候補としてchatで区別する」。scope 外候補をその後どう扱うかは書いていない。README の例で assistant が別 issue を推奨したのは、この「scope外候補」を別の作業へ回すものと読んだためである。
- `task-design/SKILL.md`: PrepareStep 3 で `development_standards/` 配下を全部読む。Step 3 の 2 は scope の判定を 3-5（実行して初めて確定するか、作るものを変えるか）で行い、`making_and_choosing_options.md` を「判定の中身は同 file が正本」の形で参照している。Step 4 は「全 TBD が解消されている」「新たな論点が生まれない」を条件に持つ。
- `development_standards/README.md`: 置き方の問いは「この標準が扱う対象は何か」。開発そのもの（何を作るか、どう名付けるか、どう進めるか）はこの群。`development_flow/` には `branch_pr_issue.md` だけがあり、README の行はその file へ直接 link している。「維持規律」に file 数と分量の記述がある。
- `think_standards/README.md`: 対象は思考・議論プロセスが絡む全場面。ドメイン固有の判断基準は対象外。
- plugin 全体を「ボーイスカウト」「たらい回し」「切り出」で検索した。不備を拾うか切り出すかを扱う規則は無い。

結果:

- task-design の本文だけを直すと、拾った 2 件の具体例が起きた経路（実装・動作確認）に届かない。
- 基準の中身は開発の進め方（issue・revert・本番適用）であり、`development_flow/` に置くのが README の置き方に合う。
- 届かせる経路は、不備に気付く段階ごとに要る。設計中（task-design Step 3）、議論中（facilitate-discussion の scope 判定）、実装・動作確認中（`runtime-feedback-review.md`）。

<a id="iteration-0-record-2"></a>

### 判断: 正本の置き場所、経路、scope の判定の 2 規則

推奨:

- 正本: `development_standards/development_flow/work_scope.md`。
- 経路: task-design Step 3 の参照、facilitate-discussion の scope 判定への一文（汎用 skill のため正本を名指ししない）、`runtime-feedback-review.md` の戻り先の前の判定。
- scope の判定の 2 規則は新しい基準ではなく、既存の問いで起きた失敗の形である。「選択肢に成果物の変更が含まれる」は facilitate-discussion の scope 判定の失敗例へ、「進行中の試行を TBD に登録せずに合意を求める」は task-design Step 4 の失敗例へ置く。
- 引き渡された 3 規則のうち「scope 外の判断を design の論点にしない」は、facilitate-discussion の scope 判定が既に持つ（変わらなければ active な論点を作らない）。新しく足さない。

採らない形と理由:

- task-design 本文に本体を書く: 実装・動作確認の経路に届かず、`runtime-feedback-review.md` にも書けば正本が二つになる。
- `think_standards/` に場面を足す: 届く範囲は最も広いが、中身が開発の進め方であり、`think_standards/README.md` の対象外。
- facilitate-discussion に本体を書く: issue・steering は consumer の概念で、責務境界が崩れる。

名前の検討:

- `development_standards/naming/file.md` の「同階層の存在と足並みを揃える」「直上ディレクトリのコンテキストを継承する」を当てた。同階層の `branch_pr_issue.md` は開発の進め方の一つの話題を名詞で表す。`development_flow/` の文脈を継承するため、`work_scope`（作業の範囲）で足りる。
- 代償: 名前は「作業の範囲」全般に読め、不備の扱いに限らない。scope の内外の判定と、外の不備を拾うか切り出すかの両方を扱うため、範囲全般の名前を受け入れる。

代償:

- 開発標準が一つ増え、task-design が設計前調査で読む量が増える（1 file）。
- task-design、facilitate-discussion、`runtime-feedback-review.md` の 3 箇所に一文ずつ増える。

<a id="iteration-1"></a>

## イテレーション1: facilitate-discussion を変えない形

<a id="iteration-1-record-1"></a>

### 判断: 利用者の理由を、提案0の facilitate-discussion への変更すべてに当てる

入力:

- 利用者の応答「bかな。別にfaciliateは記録役」。b は「facilitate-discussion の scope 判定へ足す、拾うか切り出すかの一文を外す」。
- 提案0の facilitate-discussion への変更: (1) 拾うか切り出すかの一文、(2) scope 判定の問いへの失敗例「選択肢に成果物の変更が含まれることを、実装範囲が変わる根拠にする」。

照合:

- 理由「記録役」は、facilitate-discussion が作業の範囲の判断基準を持たないことを言っている。(1) だけでなく (2) にも当たる。
- (2) の失敗が起きた場面は、設計中に design の論点を起こすかの判断であり、判断の持ち主は task-design である。facilitate-discussion の scope 判定は、その判断を受けて議論記録に active な論点を作るかを決める。
- task-design は Step 3 から `work_scope.md` を参照する（提案0の経路 1）。(2) を `work_scope.md` の scope の内外の判定に置けば、同じ場面で当たる。

結果:

- 提案1: facilitate-discussion を変えない。`work_scope.md` を「scope の内外の判定」と「scope 外の不備を拾うか切り出すか」の二段にし、(2) を一段目の失敗例に置く。task-design Step 3 の参照を、二段の両方を指すように直す。
- 利用者は b を選んだが、(2) の扱いは問われていないため、採否を確定せず提案1として合意を取り直す。

<a id="iteration-2"></a>

## イテレーション2: 構造reviewから導いた変更

<a id="iteration-2-record-1"></a>

### 検証: 設計時の skill-update-review

入力: design.md の構造案（論点2 の決定を反映した版）と、対象 file の現行版。材料・内容 hash・判定の根拠は [設計時の構造review](../artifacts/design-structure-review.md) に保存した。

結果: 不合格 1・2（runtime-feedback-review.md と task-design Step 3 の判定の位置）。決定を変えず、決定から導ける細部として解消条件を変更内容に書き、利用者へ報告する。利用者の次の実応答の後に design.md へ反映し、反映した構造案を同じ材料で再照合する。

<a id="iteration-2-record-2"></a>

### 反映: 実応答の後の design.md への反映

入力: 利用者の実応答「ok」（2026-10-28。報告した 4 件すべてに対するもの。原文は [論点1 の現在の変更](../task-design-discussion.md#現在の変更論点1)）。

結果:

- design.md 改善3 の参照側の変更表で、`task-design/SKILL.md` Step 3 の行を「1 と 2 の間に新しい手順として置き、以降の番号を繰り下げる」形へ、`runtime-feedback-review.md` の行を「三問の後、decision の提案を作る段階に判定を置き、戻り先の一覧に二つの結果の行き先を足す」形へ直した。表の前に、位置の理由の段落を足した。
- 番号の繰り下げの影響: plugin 全体（`plugins/`、`docs/`、`scripts/`）を `Step ?3 ?の ?[0-9]`、`Step ?3\.[0-9]`、`Step ?3-[0-9]` で検索し、Step 3 の手順番号を参照する記述が無いことを確かめた。Step 3 内の「（3-5）」は §3-5 への参照であり、手順番号ではない。

<a id="iteration-3"></a>

## イテレーション3: 再照合で見つけた変更

<a id="iteration-3-record-1"></a>

### 検証: 反映した構造案の再照合

入力: 変更内容2 を反映した design.md と、前回と同じ材料（16 file。内容 hash は一致）。先行指摘は不合格 1〜4。

照合:

- 不合格 1（`runtime-feedback-review.md` の判定の位置）: 三問の後、decision の提案を作る段階に置き、二つの結果の行き先を戻り先の一覧に足す形になった。解消。
- 不合格 2（Step 3 の順序）: 1 と 2 の間に置き、3-5 を目的の内の不確実性だけに当て、facilitate-discussion へ渡すのを判定の後にする形になった。解消。
- 反映した Step 3 の「結果ごとの扱い」を、task-design の §4「discussionを開始する時と返却後」と照らした。§4 は discussion を既定で開始し、開始しないのは TBD が残らない場合と、調査・技術検証実装だけで事実が決まる場合だけとする。拾うか切り出すかは利用者の判断を含むため、どちらの結果も discussion に当たる。ところが反映した文は「拾うものは discussion で合意する。切り出すものは非目標へ書く」であり、切り出す側だけ合意を経ない形に読める。`work_scope.md` は「切り出し先を先に作る」と定めるため、issue 等を合意の前に作ることになる。
- `runtime-feedback-review.md` 側は decision（合意）の後に切り出し先を作る順序であり、同じ問題は無い。

結果:

- 不合格 5 として [設計時の構造review・再照合](../artifacts/design-structure-review.md#再照合) に記録した。
- 決定（論点2）の正本と経路は変えず、§4 から一意に導ける変更として変更内容3 に書き、利用者へ報告する。利用者の次の実応答の後に design.md へ反映し、再び同じ材料で照合する。

<a id="iteration-3-record-2"></a>

### 反映と再々照合: 実応答の後の design.md への反映

入力: 利用者の実応答「ok」（2026-10-28。変更内容3、適用時期の訂正、design.md の残りの記入に対するもの。原文は [論点2 の現在の変更](../task-design-discussion.md#現在の変更論点2)）。

結果:

- design.md 改善3 の参照側の変更表で、`task-design/SKILL.md` Step 3 の行の「結果ごとの扱い」を、どちらの結果も discussion で合意し、切り出すと合意してから切り出し先を作る形へ直した。
- 同じ材料で再々照合した。材料 16 file の内容 hash は前回と一致し、`plugins/` 配下は未変更（HEAD `44c4992`）。不合格 5 は解消し、構造案は合格した。詳細は [設計時の構造review・再々照合](../artifacts/design-structure-review.md#再々照合)。
- `work_scope.md` の「切り出すときは、切り出し先を先に作る」は変えない。「切り出すとき」は拾うか切り出すかが決まった後を指し、決める過程は参照側（Step 3 の discussion、`runtime-feedback-review.md` の decision）が持つ。正本に合意の手順を書くと、参照側の workflow と二重になる。

<a id="iteration-4"></a>

## イテレーション4: 編集後reviewで見つけた変更

<a id="iteration-4-record-1"></a>

### 検証: 編集後の skill-update-review

入力: 適用後の実物一式と、HEAD `44c4992` の比較元。材料・内容 hash・判定の根拠は [設計時の構造review・編集後review](../artifacts/design-structure-review.md#編集後review) に保存した。

照合: Step 3 の手順 2 の枝ごとに、`design.md` の状態の遷移を照らした。

- 目的の内: 手順 3 以降へ進み、通常どおり解消される。
- 目的の外の不備: 拾うなら scope に加え、切り出すなら非目標へ書く。どちらも `design.md` が書き換わる。
- 目的の外の判断: Step 3 の対象から外すだけで、`design.md` に TBD として書かれていた場合の扱いが無い。手順 8 の再評価で同じ TBD が残り、Step 4 の「全 TBD が解消されている」を満たせない。

結果:

- 不合格 6 として記録した。決定（論点2）から一意に導ける変更として変更内容4 に書き、利用者へ報告する。利用者の次の実応答の後に design.md と対象 file へ反映し、反映後の実物で再び照合する。
- 他の観点（正本の数、変更 case、読取の約束、受渡しの順序、validator）は合格した。

<a id="iteration-4-record-2"></a>

### 反映と再照合: 実応答の後の対象 file への反映

入力: 利用者の実応答「ok」（2026-10-28。原文は [論点2 の現在の変更](../task-design-discussion.md#現在の変更論点2)）。

結果:

- `plugins/tumeda-dev/skills/task-design/SKILL.md` Step 3 の手順 2 の「目的の外の判断」の枝に「`design.md`にTBDとして書いていた場合は外し、」を足した。design.md 改善3 の参照側の変更表の Step 3 の行も同じ扱いへ直した。
- 反映後の実物で再照合し、不合格 6 は解消した。`SKILL.md` 以外の 11 file は hash 不変。詳細は [設計時の構造review・編集後の再照合](../artifacts/design-structure-review.md#編集後の再照合)。
