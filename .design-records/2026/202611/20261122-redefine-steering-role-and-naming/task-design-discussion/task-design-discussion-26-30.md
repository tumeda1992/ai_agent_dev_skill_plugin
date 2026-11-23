# 議論記録

## 論点26: 利用先で`.steering/`を移すことを利用者が承認しなかった時の扱い

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** 確かめるだけ（全部小。論点14・25の決定から導ける）

変更を適用した後の逆方向の照合（追加した行から移行の対応表のIDを引く）で、合意の無い追加として見つけた。適用時に`prepare-design-record`の手順1へ「承認されなければ移さず、新しい記録だけを`.design-records/`へ置く」と書いていたが、論点14は承認されなかった時の扱いを決めていない。この書き方では、次に呼ばれた時に`.steering/`と`.design-records/`が両方あり、論点14の決定どおり止まる。

### イテレーション0（論点26）: 承認されなかった時の扱いを仮決めする

#### 提案0（論点26）

- a. 移さず、新しい記録も作らずに止まり、呼出し元へ返す（仮決め）
  - 根拠: 論点14の決定は、両方がある時は推測で混ぜず利用者へ確かめるとしている。承認されなかった時に新しい記録を`.design-records/`へ作ると、その併存の状態をこのskill自身が作る。止まれば、利用者が移すか、別の扱いを指示するまで状態は変わらない。
  - 今の`prepare-design-record/SKILL.md`の手順1は、この仮決めの文面で書いてある（対応表のA-009）。
- b. 承認されなくても、新しい記録は`.design-records/`へ作る
  - 次に呼ばれた時に両方がある状態になり、止まる。

#### 検討記録（論点26・イテレーション0）

論点14の決定（利用先では初回に移すことを提案し、承認されたら一度だけ移す。両方がある時は確かめる）と論点25の決定（移し方の正本は読み替えの記録）を読み、承認されなかった時の扱いがどちらにも無いことを確かめた。

#### 提案0へのフィードバック（論点26）

**結果:** 仮決めaに合意

> ok。あと「a. 移さず、新しい記録も作らずに止まる（仮決め）」より「a. （仮ぎめ）移さず、新しい記録も作らずに止まる」（推奨も同じ）の方が読みやすいな。案を全部読まなくても推奨とかがわかるから

論点29・26・27をまとめて示した往復で「ok」と答えられた。返事の後半は、仮決め・推奨の印を案の行の頭に置く方が読みやすいという、提示の形への意見である。この論点の答えではなく、この作業の目的の外のskill（`facilitate-discussion/round-trip.md`、`templates/proposal-sections/compact-options.md`）への改善提案として、`escalate-plugin-skill-fix`へ回し、[保留メモ](../pending-escalations/001-put-recommendation-mark-at-option-head.md)に控えた。

### 決定（論点26）

利用先で`.steering/`を`.design-records/`へ移すことを利用者が承認しなかった時は、移さず、新しい記録も作らずに止まり、呼出し元へ返す。
承認されなかった時に新しい記録を`.design-records/`へ作ると、`.steering/`と`.design-records/`が併存する状態をこのskill自身が作り、次に呼ばれた時に止まるためである。
止まれば、利用者が移すか別の扱いを指示するまで状態は変わらない。論点14の決定（推測で混ぜない）と、論点28の決定（承認されなければ移さずに止まる）と揃う。

## 論点27: Blocker resolutionを`tasklist-executor`の別の内部指示へ分けるか

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** 確かめるだけ（全部小。根拠は`skill-update-review/find-split-candidates.md`と`work_scope.md`の二段目）

編集後の`skill-update-review`の候補から立てた。

### イテレーション0（論点27）: 編集後のreviewの候補を、今の作業で分けるかを仮決めする

#### 提案0（論点27）

**reviewの結果（編集後）:** `task-design/SKILL.md`と`wrap-up.md`、`prepare-design-record/SKILL.md`と`summarize-previous-month.md`、`advance-roadmap/SKILL.md`、`tasklist-executor/SKILL.md`と`execution-contracts.md`と`implementation-feedback.md`の全体を読んだ。設計時の二つの候補（締めくくりの確認、前月summary）は分け終えている。新しい候補は一件である。

- 候補: `tasklist-executor/execution-contracts.md`の「Blocker resolution」。固有の状態（Flowを離れている）、完了（離れた段の先頭へ戻る）、判断（三択、自走の範囲）を持ち、自走の決まりの見直しという、child request・resultの形とは別の理由で改める。自走の範囲を一つ直す変更を当てると、JSONの形を定めたfileを直すことになる。分ける先は`tasklist-executor`の内部指示。
- `advance-roadmap`、`prepare-design-record`、task-designには新しい候補は無い。

- a. 今の作業で`tasklist-executor/blocker-resolution.md`へ分け、`execution-contracts.md`の「起動する側が行うこと」から、`blocked`で返った時と、進めなくなった時に読むと参照する（仮決め）
  - 根拠: `work_scope.md`の二段目で、今の作業のreview・revert・本番適用の単位は崩れない。論点8で置いた先の中で、同じskillの別fileへ分けるだけであり、論点8の決定（起動する側が行うことに置く）の意味は変わらない。後で分けると、今書いた節と参照を二度直すことになる。
- b. 今は分けない
  - 今の`execution-contracts.md`に残る。

#### 検討記録（論点27・イテレーション0）

`skill-update-review/find-split-candidates.md`の基準で、編集後の各fileを読んだ。`execution-contracts.md`は、子agentへの委譲の契約、起動する側の約束、Blocker resolutionを持つ。起動する側の約束は停止理由の扱いと結び付いており、分けると停止理由の定義と離れるため候補にしない。Blocker resolutionは停止理由の定義を参照するだけで、独立して改められる。

#### 提案0へのフィードバック（論点27）

**結果:** 仮決めaに合意

> ok。あと「a. 移さず、新しい記録も作らずに止まる（仮決め）」より「a. （仮ぎめ）移さず、新しい記録も作らずに止まる」（推奨も同じ）の方が読みやすいな。案を全部読まなくても推奨とかがわかるから

論点29・26・27をまとめて示した往復で「ok」と答えられた。返事の後半は、仮決め・推奨の印を案の行の頭に置く方が読みやすいという、提示の形への意見である。この論点の答えではなく、この作業の目的の外のskill（`facilitate-discussion/round-trip.md`、`templates/proposal-sections/compact-options.md`）への改善提案として、`escalate-plugin-skill-fix`へ回し、[保留メモ](../pending-escalations/001-put-recommendation-mark-at-option-head.md)に控えた。

### 決定（論点27）

今の作業で、`tasklist-executor/execution-contracts.md`の「Blocker resolution」を`tasklist-executor/blocker-resolution.md`へ分ける。`execution-contracts.md`の「起動する側が行うこと」からは、`blocked`で返った時と、起動する側が自分の手順で進めなくなった時に読むと参照する。
Blocker resolutionは固有の状態（手順を離れている）、完了（離れた段の先頭へ戻る）、判断（三択、自走の範囲）を持ち、子agentへの委譲の形とは別の理由で改めるためである。
論点8の決定（起動する側が行うことに置く）の意味は変えず、同じskillの別fileへ分けるだけである。`work_scope.md`の二段目でも今の作業の単位は崩れず、後で分けると今書いた節と参照を二度直すことになる。

## 論点28: `.steering/`に追跡されたfileが無く、追跡外の残りだけがある時の扱い

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** 一つずつ考える（波及: 中。`prepare-design-record`の手順1と、読み替えの記録の「移し方」が変わり、論点26と同じ箇所に効く。利用者の前提への依存: 中。残ったfileを移すか、止まって知らせるだけにするかは、名指せる既決事項や規範から一つに決まらない。他は小）

別のsessionのtask-designがこの作業を引き継いだ時の照合（`task-design/work-handoff-contracts.md`の独立再構成）で、正本に無い新しい未決事項として見つけた。

### イテレーション0（論点28）: 残りが生じる仕組みを確かめ、扱いを提案する

#### 提案0（論点28）

##### 起きること

`.steering/`を`git mv`したcloneと、その変更をpullした別のcloneで、`.steering/`に残るものが違う。

| clone | 移した後の`.steering/` |
| --- | --- |
| `git mv`したclone | 無い。追跡外のfileもdirectoryごと`.design-records/`へ移る |
| pullしたclone | 追跡外のfileが残る。`.design-records/`もできる |

pullしたcloneに残るのは、次のような追跡外のfileである。

- `.gitignore`で追跡しない作業の控え（`internal-records/`、`subagent_report/`）
- commit前の作業のfile
- Claude Codeが、sessionの作業directoryを移すたびにその場所へ作る空の`.claude/.cc-writes/`

今の手順では、pullしたcloneで次に`prepare-design-record`を呼ぶと「両方ある」で止まり、「どちらを正にするか」を利用者へ確かめる。
しかし正は既に`.design-records/`であり、問いが実情に合わない。
このrepositoryの手元のcloneがこの状態にある。
`.steering/`には空の`.claude/.cc-writes/`だけが残り、`validate-plugin.mjs`が「削除済みであるべき旧pathが残っている」で失敗している。

##### 案

- **a. 追跡されたfileが無い時は、残ったfileを`.design-records/`の同じ相対pathへ移すことを提案し、承認されたら移して`.steering/`を消す**（推奨）
  - 見分け方: `git ls-files .steering`が何も返さない時。返す時（他のbranchが`.steering/`の下へfileを足した等）は、今と同じく混ぜずに止まる。
  - 移し方: 残ったfileと空のdirectoryを一覧にして示す。承認されたら、各fileを`.design-records/`の同じ相対pathへ`mv`で移す。移す先に同じ名前のfileがあれば止まる。空になったdirectory（`.claude/.cc-writes/`を含む）を消し、最後に`.steering/`を消す。fileは一つも消さない。
  - 承認されなければ、移さずに止まる。論点26の仮決め（承認されなければ移さず止まる）と同じ扱いになる。
  - 置き場所: 手順の正本は読み替えの記録（`prepare-design-record/breaking_changes/20261123-move-steering-to-design-records.md`）の「移し方」へ足し、`prepare-design-record`の手順1はそれを参照する。論点25の決定と同じ形である。
- **b. 今のまま、両方ある時は止まって確かめる**
  - 利用者は、`.steering/`に何が残っているか、移すべきものがあるかを自分で調べる。
  - 問いは「どちらを正にするか」のまま残る。
- **c. 追跡されたfileが無い時は、`.steering/`を無いものとして扱い、新しい記録を作る**
  - 止まらずに進める。
  - 残ったfile（commit前の作業や作業の控え）は古い置き場所に取り残され、`.steering/`も残り続ける。

aを推す。
追跡されたfileが無いことで、記録の正本が既に`.design-records/`へ移ったと分かる。
残りは手元のfileだけであり、推測で混ぜる必要が無い。
一方、残りにはcommit前の作業が含まれうるため、消さずに移す。
承認を得てから一度だけ移す形は、論点14の決定（承認されたら一度だけ移す）と揃う。
bは安全だが、実情に合わない問いを利用者へ投げ続ける。
cは止まらないが、残りを置き去りにする。

`validate-plugin.mjs`の検査をどうするかは、この論点の答えで問いが変わるため、論点29へ分けた。

#### 検討記録（論点28・イテレーション0）

##### 診断: 移し終えたはずのcloneに`.steering/`が残る

###### 期待との差と原因候補

designの受け入れ基準は「`.steering/`が無い」で、適用時には`validate-plugin.mjs`が通っていた。
引き継いだsessionの手元のcloneでは、同じ検査が「`.steering`: 削除済みであるべき旧pathが残っている」で失敗した。
原因の候補は二つ考えた。

- 適用漏れで、追跡されたfileが`.steering/`に残っている
- 追跡外のfileが手元に残っている

###### 原因を支持・反証する証拠

- `git ls-files .steering`は0件、`find .steering -type f`も0件だった。追跡されたfileは無く、一つ目の候補は否定した。
- `.steering/`に残っていたのは、`2026/202608/.claude/.cc-writes/`と`2026/202609/20260905-absorb-document-review-skill/.claude/.cc-writes/`の空のdirectoryだけだった（作成日は2026-09-03と2026-09-05）。
- 引き継いだsessionの中で、作業directoryを`plugins/tumeda-dev/docs/development_standards/`と、この作業の記録のdirectoryへ移した直後に、それぞれの場所へ空の`.claude/.cc-writes/`が作られた。repository全体でも8箇所に同じ空のdirectoryがあった。Claude Codeがsessionの作業directoryに作るものと判断した。自分のsessionで作った2箇所は消した。
- 作業用のdirectoryで、二つのcloneを使って再現した。
  - `git mv .steering .design-records`を行ったcloneでは、追跡しない`internal-records/log.md`も`.design-records/`へ移った。
  - その変更をpullしたcloneでは、`.steering/`の下に`internal-records/log.md`と`.claude/.cc-writes/`が残り、`.design-records/`もできた。
- 二つ目の候補を、確定した原因とする。

未確認の範囲:

- 利用先repositoryで実際に何が残っているか。このsessionから利用先を読めない。
- Claude Code以外の実行環境が、作業directoryに何かを作るか。

##### 判断: 残ったfileをどう扱うか

###### 判断対象・必須条件・根拠

pullしたcloneで`.steering/`に追跡外のfileだけが残る時、`prepare-design-record`と移し方の手順がどう扱うか。
必須条件は次の三つとした。

- 推測で混ぜない（論点14の決定）
- 手元のfileを失わない。commit前の作業が含まれうる
- 利用者へ出す問いが実情に合う

###### 各案の評価

- a: 三つとも満たす。追跡されたfileの有無で、正本が移り終えたかを推測なしに見分けられる。fileは移すだけで消さない。
- b: 一つ目と二つ目は満たすが、三つ目を満たさない。
- c: 一つ目を満たすが、二つ目を満たさない。残りが古い置き場所に取り残される。

案にしなかったもの:

- 追跡されたfileが無ければ、承認なしに`.steering/`を消す。commit前の作業を消しうるため外した。
- 追跡しない名前（`internal-records/`、`subagent_report/`）のdirectoryだけを移す。`.gitignore`の対象外のcommit前の作業が取り残されるため外し、残ったfileを一律に同じ相対pathへ移す形にした。

#### 提案0へのフィードバック（論点28）

**結果:** aに合意

> ok

論点28だけを示した往復への返事である。

### 決定（論点28）

`.steering/`と`.design-records/`が両方あり、`git ls-files .steering`が何も返さない（`.steering/`に追跡されたfileが無い）時は、残ったfileを`.design-records/`の同じ相対pathへ移すことを利用者へ提案する。
残ったfileと空のdirectoryを一覧にして示し、承認されたら各fileを`mv`で移す。
移す先に同じ名前のfileがあれば止まる。
空になったdirectory（Claude Codeが作る`.claude/.cc-writes/`を含む）を消し、最後に`.steering/`を消す。fileは一つも消さない。
承認されなければ移さずに止まる。
`git ls-files .steering`がfileを返す時は、今と同じく混ぜずに止まり、利用者へ確かめる。

手順の正本は`prepare-design-record/breaking_changes/20261123-move-steering-to-design-records.md`の「移し方」へ足し、`prepare-design-record`の手順1はそれを参照する（論点25の決定と同じ形）。

この扱いにするのは、移した変更をpullした別のcloneでは、追跡外のfile（作業の控え、commit前の作業、空の`.claude/.cc-writes/`）が`.steering/`に残るためである。
追跡されたfileが無いことで、記録の正本が既に`.design-records/`へ移ったと推測なしに分かる。
残りにはcommit前の作業が含まれうるため、消さずに移す。
今のまま止まって「どちらを正にするか」を問う形は、実情に合わない問いを投げ続けるため採らない。
`.steering/`を無いものとして扱う形は、残りを古い置き場所に取り残すため採らない。

## 論点29: `validate-plugin.mjs`の`.steering`の不存在の検査を、何で判定するか

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** 確かめるだけ（全部小。検査の一行で閉じ、推す案を論点28の決定から導ける）

**依存先:** 論点28（aなら、残りを移す手順で手元の`.steering/`も消えるため、今の検査（作業directoryに`.steering`が無いこと）のままでよいかを問う。bまたはcなら、手元に残りが残り続けるため、追跡されたfileだけを見る検査へ変えるかを問う）

論点28を立てる中で、`validate-plugin.mjs`の`requireAbsent(".steering")`が、追跡外の残りだけでも失敗することから立てた。

### イテレーション0（論点29）: 論点28の決定を受けて、検査の判定を仮決めする

#### 提案0（論点29）

- a. 今の検査（作業directoryに`.steering`が無いこと）のままにする（仮決め）
  - 根拠: 論点28の決定で、手元に残った追跡外のfileを、承認を得て`.design-records/`へ移し`.steering/`を消す手順ができた。手順を通したcloneでは検査が通る。検査が失敗した時は、そのcloneでまだ手順を通していないことを示す。
  - designの受け入れ基準「`.steering/`が無い」と同じ意味を保つ。
- b. 追跡されたfileだけを見る（`git ls-files .steering`が空なら通す）検査へ変える
  - 手元に残りがあっても検査は通る。残りは、次に`prepare-design-record`が呼ばれた時に見つかり、移すことを提案される。
  - 検査はrepositoryの中身だけを見る形になり、手元の状態では失敗しない。

#### 検討記録（論点29・イテレーション0）

論点28の決定（追跡外の残りだけがある時は、承認を得て移し`.steering/`を消す）を受けて、二つの判定を比べた。

- aは、手元の残りを片付ける手順があることを前提に、残りを見つける役を検査にも持たせる。このrepositoryの手元のcloneは今まさに残りがあり、手順を通すまで失敗し続ける。
- bは、検査をrepositoryの中身に限る。手元の残りは`prepare-design-record`だけが見つける。plugin repositoryでは新しい作業を始めるまで残りに気づかない。

`validate-plugin.mjs`の他の不存在の検査（`requireAbsent(skillPath(...))`）も、作業directoryにfileが無いことで判定している。aはこの書き方と揃う。
designの受け入れ基準「`.design-records/`に61の作業のdirectoryと月ごとの`summary.md`があり、`.steering/`が無い」も、手元に`.steering/`が無いことを求める読み方で書かれている。
この二点から、aを仮決めにした。

#### 提案0へのフィードバック（論点29）

**結果:** 仮決めaに合意

> ok。あと「a. 移さず、新しい記録も作らずに止まる（仮決め）」より「a. （仮ぎめ）移さず、新しい記録も作らずに止まる」（推奨も同じ）の方が読みやすいな。案を全部読まなくても推奨とかがわかるから

論点29・26・27をまとめて示した往復で「ok」と答えられた。返事の後半は、仮決め・推奨の印を案の行の頭に置く方が読みやすいという、提示の形への意見である。この論点の答えではなく、この作業の目的の外のskill（`facilitate-discussion/round-trip.md`、`templates/proposal-sections/compact-options.md`）への改善提案として、`escalate-plugin-skill-fix`へ回し、[保留メモ](../pending-escalations/001-put-recommendation-mark-at-option-head.md)に控えた。

### 決定（論点29）

`validate-plugin.mjs`の`requireAbsent(".steering")`は変えず、作業directoryに`.steering`が無いことで判定する。
論点28の決定で、手元に残った追跡外のfileを承認を得て移し`.steering/`を消す手順ができたため、検査が失敗した時は、そのcloneでまだ手順を通していないことを示す。
validatorの他の不存在の検査と同じ書き方であり、designの受け入れ基準「`.steering/`が無い」とも同じ意味を保つ。追跡されたfileだけを見る検査は、plugin repositoryで新しい作業を始めるまで手元の残りに気づかないため採らない。

## 論点30: `prepare-design-record`の移す工程を、新しい内部指示へ分けるか

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** 確かめるだけ（全部小。推す案を論点25の決定から導ける）

論点26〜29を反映した後の、編集後の`skill-update-review`の候補（候補1）から立てた。

### イテレーション0（論点30）: 候補を論点25の決定と照らし、仮決めする

#### 提案0（論点30）

##### 候補の内容

`.steering/`を移す工程が、二箇所に入っている。

- `prepare-design-record/SKILL.md`の手順1と禁止事項: どの場合か（`.design-records/`が無い、追跡されたfileが残る、追跡外のfileだけが残る）の判定、承認、承認されなければ止まること
- 読み替えの記録（`prepare-design-record/breaking_changes/20261123-move-steering-to-design-records.md`）の「移し方」: 同じ場合の判定と、承認、`mv`、同じ名前のfileでの停止、`.steering/`の削除

残り方の種類が増えるたびに、両方を直すことになる。候補は、移す工程を同じskillの新しい内部指示へ分け、`SKILL.md`と記録の両方から参照する形である。

##### 案

- **a. （仮決め）新しい内部指示へは分けず、`SKILL.md`の手順1から場合の判定と承認の記述を外し、記録の「移し方」への参照と、止まる時の扱いだけを残す**
  - 根拠: 論点25の決定は、移し方の手順の正本を読み替えの記録に置き、`prepare-design-record`はそれを参照して手順を自分では書かないとした。論点28の反映で手順1へ場合の判定と承認を書き足しており、この決定から外れていた。手順1を参照へ縮めれば、残り方の種類が増えても直すのは記録の一箇所になる。
  - 禁止事項（推測で混ぜない、承認なしに移さない・消さない）は手順ではなく守る約束なので残す。
  - 手順1は次の形になる。

    ```markdown
    1. 以前の置き場所を確かめる。
       - `.steering/`がある時は、[`breaking_changes/20261123-move-steering-to-design-records.md`](breaking_changes/20261123-move-steering-to-design-records.md)の「移し方」の手順で移すことを利用者へ提案する。`.design-records/`も既にある時の扱いを含め、手順の正本は同fileであり、ここへ写さない。
       - 承認されたら同fileの手順で移す。承認されない時、または同fileの手順が止まった時は、新しい記録を作らずに止まり、呼出し元へ返す。`.steering/`と`.design-records/`が併存する状態を、このskillが作らないためである。
    ```

- **b. 候補どおり、`prepare-design-record/`に移し方の内部指示を作り、`SKILL.md`と記録の両方から参照する**
  - 論点25の決定（記録を手順の正本にする）を開き直すことになる。記録を読んだ人は、手順を別のfileで読むことになる。
- **c. 今のまま、二箇所に書く**
  - 残り方の種類が増えるたびに、二箇所を直す。

#### 検討記録（論点30・イテレーション0）

##### 編集後のreviewの結果

`skill-update-review`を編集後reviewとして、子agentに当てさせた。`prepare-design-record`（`SKILL.md`、`summarize-previous-month.md`、`breaking_changes/`）、`tasklist-executor`（`SKILL.md`、`execution-contracts.md`、`implementation-feedback.md`、`blocker-resolution.md`）、`advance-roadmap/SKILL.md`の全体を読ませた。候補は三件だった。

- 候補1: `.steering/`を移す工程（この論点）
- 候補2: `execution-contracts.md`の「起動する側が行うこと」（論点31）
- 候補3: `advance-roadmap/SKILL.md`の「段取りの議論（discussion.md）」（論点32）

候補にしなかった主なもの: 前月summary（既に分けてある）、手順3のbranch作成（判断の中身は`branch_pr_issue.md`が持つ）、`blocker-resolution.md`と`implementation-feedback.md`（一つの工程で完結）、子phaseの結果の確認（固有の状態を持たないgate）。

##### 判断: 候補1をどう扱うか

候補の指摘（二箇所に入っている）は事実である。二箇所になった原因を辿ると、論点28を反映した時に、手順1へ場合の判定と承認を書き足したことにある。論点25は「`prepare-design-record`の初回の提案は、この節の手順を参照して行い、手順を自分では書かない」と決めていた。新しい内部指示を作る案（b）は、記録を正本にする論点25の決定とぶつかる。決定どおりに手順1を参照へ縮める案（a）なら、新しいfileを作らずに二箇所の問題が解ける。`work_scope.md`の二段目で見ても、今の作業で自分が書き足した数行を直すだけであり、単位は崩れない。

#### 提案0へのフィードバック（論点30）

**結果:** 仮決めaに合意

> 全部ok

論点30・31・32をまとめて示した往復（あわせて、手元の`.steering/`に残った空のdirectoryを消してよいかを確かめた）で「全部ok」と答えられた。

### 決定（論点30）

`.steering/`を移す工程は新しい内部指示へ分けず、`prepare-design-record/SKILL.md`の手順1から場合の判定と承認の記述を外して、読み替えの記録（`prepare-design-record/breaking_changes/20261123-move-steering-to-design-records.md`）の「移し方」への参照と、止まる時の扱いだけを残す。
`.design-records/`も既にある時は、記録の「追跡外のfileだけが残った時」の手順2で示す一覧を、移すことの提案とし、承認を一度だけ取る。承認されない時、または記録の手順が止まった時は、新しい記録を作らずに止まり、呼出し元へ返す。
禁止事項（推測で混ぜない、承認なしに移さない、残ったfileを消さない）は、手順ではなく守る約束なので`SKILL.md`に残す。

論点25の決定（移し方の手順の正本を記録に置き、`prepare-design-record`は参照して手順を自分では書かない）どおりの形に戻すためである。論点28の反映で手順1へ場合の判定と承認を書き足し、二箇所に同じ工程が入っていた。新しい内部指示を作る形は、記録を正本にする論点25の決定とぶつかるため採らない。
