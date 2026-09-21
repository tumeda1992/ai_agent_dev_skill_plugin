# ロードマップ: 利用先から引き渡された skill 修正提案を適用する

## 設計参照

- `./design.md`

## 概要

利用先 repository から `escalate-plugin-skill-fix` で引き渡された skill 修正提案を適用する。当初 5 件で、作業中に 1 件が加わり 6 件になった。

一つの tasklist へまとめず複数の子 design scope へ分けるのは、**各件がそれぞれ別の問いを持つ**ためである。提案の出し方（判断材料の gate、提案背景の定義、提案を出せない段階の受け皿）、git / GitHub の資源の対応、動作確認の具体化は、互いに独立した decision を必要とする。owner 候補が重なる組み合わせはあるが、それは触る file が近いだけで、答える問いは異なる。

このroadmapは子scopeの構造一覧である。各phaseは独立した子steeringを通じて設計・実装し、各phase完了時点でappまたは成果物が正常に利用できる状態を保つ。

roadmapの構造fieldはtask-designが設計・reviewする。各phaseの子steering path、status、完了日だけをsteeringが実行時に更新する。

## 構造field（task-designが設計・reviewする）

---

## Phase: proposal-background-scope — 提案自体の背景の置き場を定義する

### 目的

`提案背景` が「イテレーションが起きた背景」へ縮退している状態を解消し、提案そのものの背景（この案へ至った調査結果と思考記録）が置かれる場所を定義する。

### Scope

- `facilitate-discussion` の `2.2`（新規論点）と `2.3.1`（iteration）が定める `提案背景` の定義
- `提案N-1へのフィードバック` との責務境界。イテレーションが起きた背景をどちらが持つか
- `templates/discussion_entry.md` の `提案背景` の記述指示

### Scope外

- 提案が判断できる案かを確かめる段の設計（`proposal-decidability` が扱う）
- 提案を出せない段階の受け皿（`non-proposal-iteration` が扱う）
- `提案N` 本文の構成 pattern（`templates/proposal-sections/` は既に pattern catalog を持つ。今回変えない）

### DoD（完了条件）

- `提案背景` の定義が、提案自体の背景（調査結果・思考記録）を含むことを明示している
- イテレーションが起きた背景を `提案N-1へのフィードバック` が持ち、`提案背景` へ重ねて書かないことが読み取れる
- `2.2` と `2.3.1` のどちらを直すか、両方を直すかが決まり、反映されている
- `templates/discussion_entry.md` の記述指示が本文の定義と矛盾しない
- この phase 完了時点で `facilitate-discussion` が単独で利用可能である。他 phase の結論を前提とする記述を残さない

### 依存

- 依存phase: なし
- dependency results: なし
- 子designで解消する制約: なし

### 親DoDとの対応

- 提案2 について、所有する skill が一つに決まり、対象 file へ反映され、同じ判断を複数の正本が持たない

### 運用field（steeringだけが更新する）

- 子steering: `.steering/2026/202609/20260921-scope-proposal-background/`
- status: 完了
- 完了日: 2026-09-21

---

## Phase: proposal-decidability — 判断材料が揃う前に選択肢へ畳まないための段を置く

### 目的

提案が「判断できる案」になっているかを確かめる段が存在しない状態を解消する。形式は整っているが前提が誤っている提案を、形式の確認では検出できないという穴を塞ぐ。

### Scope

- 提案が判断できる案かを確かめる段の設計と、その owner の決定。候補は `facilitate-discussion` の提案保存 gate、`task-design` section 5 Step 3、`think_standards` の新しい場面 file
- 既存の `think_standards/choosing_between_options.md` および `presenting_options.md` との関係の確定。重複した判断基準を二箇所に持たないこと
- 併合された提案（`task-design` Step 3 が「不確実性を選ぶ → 解消手段を選ぶ」の間に「今が決める時期か」の判定を持たない）の扱い
- `facilitate-discussion` の `仮決定` と `再開条件` を、根拠が揃う前に前へ進む道具として `task-design` Step 3 から使えるようにするかの判断
- 引き渡し元の利用先 repository へ、正本で扱う旨・正本側 steering directory の basename・提案要旨 1 行を記載する後始末

### Scope外

- `提案背景` の定義そのもの（`proposal-background-scope` が扱う。この phase はその結果を判定材料として使えるかを判断する）
- 提案を出せない段階の受け皿（`non-proposal-iteration` が扱う）
- 実行フェーズの契約（`branch-pr-issue-correspondence`、`verification-concreteness` が扱う）

### DoD（完了条件）

- 段の owner が一つに決まり、対象 file へ反映されている
- `choosing_between_options.md` と `presenting_options.md` との関係が決まり、同じ判断基準が二箇所に存在しない
- 併合された `task-design` Step 3 の提案について、Step 3 を直すか、別の owner へ寄せるかが決まり、反映されている
- 段が発火する条件と、発火したときに何を確かめるかが具体的に書かれている。原則名だけを置いていない
- 利用先 repository の保留 file へ、引き渡し完了の記載が済んでいる
- この phase 完了時点で、触った skill / docs が単独で利用可能である

### 依存

- 依存phase: `proposal-background-scope`
- dependency results: `提案背景` の確定した定義と、それがどの file のどこに書かれたか
- 子designで解消する制約: この段が `提案背景` を判定材料に使えるか。使えるなら判定基準をその定義へ接続する。使えないなら別の確かめ方を設計する
- 想定範囲外だった場合: `proposal-background-scope` が `提案背景` を持たない形（別 file へ分離等）に着地した場合、判定材料の候補が変わるため、親 roadmap へ戻ってこの phase の scope を見直す

### 親DoDとの対応

- 提案1 について、所有する skill または docs が一つに決まり、対象 file へ反映され、同じ判断を複数の正本が持たない

### 運用field（steeringだけが更新する）

- 子steering: `.steering/2026/202609/20260921-guard-premature-decisions/`
- status: 完了
- 完了日: 2026-09-21

---

## Phase: non-proposal-iteration — 提案を出せない段階の受け皿を作る

**この phase は別の steering へ移した。** `iteration-structure`（`facilitate-discussion` の workflow 構造の再設計）に依存しており、構造が決まらなければ設計できないためである。

- 移管先: `.steering/2026/202609/20260921-restructure-facilitate-discussion/`
- 移管日: 2026-09-21
- 引き継ぎ内容: 同 directory の `handoff.local.md`（gitignore 対象）

### 運用field（steeringだけが更新する）

- 子steering: 未割当
- status: 移管
- 完了日: 未完了

---

## Phase: branch-pr-issue-correspondence — git / GitHub の資源の対応を保つ契約を置く

### 目的

検証のために既定 branch へ merge する必要がある場合の扱いが決まっていないため、検証の merge が issue を閉じ、merge 済み branch 名が再利用される状態を解消する。

### Scope

- 検証のために既定 branch へ merge が必要な場合の branch・PR の立て方と、その PR が `Closes` を持たないこと
- merge 済み branch 名の再利用の禁止
- owner の決定。候補は `task-design` の plan 設計時、`tasklist-executor` の実行時契約、`steering` の orchestration
- 既存の「tasklist 内のユーザー動作確認が完了する前に commit、push、PR を行わない」との関係整理。利用先での実作業では、この制約が「PR を作って plan の結果を確認する」phase と衝突した

### Scope外

- 動作確認の DoD の具体化（`verification-concreteness` が扱う）
- 提案の出し方に関する 3 phase の内容

### DoD（完了条件）

- owner が一つに決まり、対象 file へ反映されている
- 検証のための merge と issue 完了の merge を分ける形が、branch・PR・`Closes` の扱いとして具体的に書かれている
- 既存の commit・push・PR の制約との関係が整理され、矛盾が残っていない
- 既定 branch への merge が本番適用を起こす repository で、この契約がどう効くかが読み取れる
- この phase 完了時点で、触った skill が単独で利用可能である

### 依存

- 依存phase: なし
- dependency results: なし
- 子designで解消する制約: なし

### 親DoDとの対応

- 提案4 について、所有する skill が一つに決まり、対象 file へ反映され、同じ判断を複数の正本が持たない

### 運用field（steeringだけが更新する）

- 子steering: `.steering/2026/202609/20260921-keep-branch-pr-issue-correspondence/`
- status: 完了
- 完了日: 2026-09-21

---

## Phase: verification-concreteness — 動作確認の具体化の段を置く

### 目的

動作確認の DoD が抽象的なまま tasklist へ載り、実行時に初めて具体化される状態を解消する。

### Scope

- tasklist を作る時点で動作確認の具体（何を変更し、何を観測できれば満たすか）を決めるか、実行前に提案して合意する段を置くか、両方かの決定
- owner の決定。候補は `task-design` の `tasklist-design.md`、`tasklist-executor` の実行時契約
- 動作確認の具体が設計時に決まらない場合の扱い

### Scope外

- git / GitHub の資源の対応（`branch-pr-issue-correspondence` が扱う）
- 提案の出し方に関する 3 phase の内容

### DoD（完了条件）

- owner が一つに決まり、対象 file へ反映されている
- 動作確認の具体をいつ決めるかが、設計時・実行前のどちらか、または両方として確定している
- 具体が自明でない場合に何をするかが書かれている。抽象的な DoD がそのまま残る経路を塞いでいる
- この phase 完了時点で、触った skill が単独で利用可能である

### 依存

- 依存phase: なし
- dependency results: なし
- 子designで解消する制約: なし

### 親DoDとの対応

- 提案5 について、所有する skill が一つに決まり、対象 file へ反映され、同じ判断を複数の正本が持たない

### 運用field（steeringだけが更新する）

- 子steering: `.steering/2026/202609/20260921-concretize-verification-dod/`
- status: 完了
- 完了日: 2026-09-21

---

## Phase: escalation-without-context-loss — escalate 後の context 喪失を止める

### 目的

escalate 後に session の新規作成を促され、context が失われる状態を解消する。

<!-- この phase は当初 `escalation-without-deferral`（提案が溜まってから一括で引き渡される
     状態を解消する）として定義していた。起点の発言を「いつ escalate するか」という
     タイミングの話として誤読したものであり、子 steering の設計中に訂正した。
     経緯は子 steering の task-design-discussion.md の論点1・2（取下げ）と論点4 にある。 -->

### Scope

- `escalate-plugin-skill-fix` の「引き渡し後」の記述
- session の新規作成と resume の区別
- 元 task をどう続けるかの選択

### Scope外

- escalate の起動タイミング。後回しにするかどうかは利用側の判断であり、この skill が縛る対象ではない
- 後回し中の提案の記録先。利用側が保留するだけで、その間この skill は起動されない
- 他の 5 phase が扱う skill の内容

### DoD（完了条件）

- 「引き渡し後」に、escalate のために session を新規作成しないことが明示されている
- resume が context を保ったまま skill を読み直す手段として示されている
- 元 task をどう続けるかの選択が利用者に残されている
- この phase 完了時点で `escalate-plugin-skill-fix` が単独で利用可能である

### 依存

- 依存phase: なし
- dependency results: なし
- 子designで解消する制約: なし

### 親DoDとの対応

- 提案6 について、所有する skill が一つに決まり、対象 file へ反映され、同じ判断を複数の正本が持たない

### 運用field（steeringだけが更新する）

- 子steering: `.steering/2026/202609/20260921-escalate-at-proposal-time/`
- status: 完了
- 完了日: 2026-09-21

---

## 親DoD coverage

| 親DoD | 担当phase |
| --- | --- |
| 提案1 の owner が一つに決まり、対象 file へ反映され、同じ判断を複数の正本が持たない | `proposal-decidability` |
| 提案2 の owner が一つに決まり、対象 file へ反映され、同じ判断を複数の正本が持たない | `proposal-background-scope` |
| 提案3 の owner が一つに決まり、対象 file へ反映され、同じ判断を複数の正本が持たない | `non-proposal-iteration`（移管） |
| 提案4 の owner が一つに決まり、対象 file へ反映され、同じ判断を複数の正本が持たない | `branch-pr-issue-correspondence` |
| 提案5 の owner が一つに決まり、対象 file へ反映され、同じ判断を複数の正本が持たない | `verification-concreteness` |
| 提案6 の owner が一つに決まり、対象 file へ反映され、同じ判断を複数の正本が持たない | `escalation-without-deferral` |
| 各修正が利用先を問わず成立する汎用知識として書かれ、利用先固有情報を含まない | 全 phase |
| 各 phase 完了時点で、その phase が触った skill が単独で利用可能である | 全 phase |
| 引き渡し元の利用先 repository へ引き渡し完了が記載されている | `proposal-decidability` |

## Dependency DAG

```text
proposal-background-scope -> proposal-decidability -> non-proposal-iteration

branch-pr-issue-correspondence   （依存なし）
verification-concreteness        （依存なし）
escalation-without-deferral      （依存なし）
```

## その他（別 steering へ移管済み）

作業中に判明したが、6 件の提案とは別の問いを持つため phase へ入れていなかったもの。**すべて `.steering/2026/202609/20260921-restructure-facilitate-discussion/` へ移した。** 内容は同 directory の `handoff.local.md` にある。

- `iteration-structure` — イテレーションを回すことを `facilitate-discussion` の workflow の主構造として持つ
- `think_standards/evolution_policy.md` の density 不足
- `think_standards` 全体の場面名の揺れ
- `think_standards` 全体の `## 補助:` prefix の揺れ
- discussion file の見出しへ論点番号を付ける

## クロージング

引き渡された 6 件のうち 5 件を完了した。

```text
完了  提案1  proposal-decidability            判断材料が揃う前に選択肢へ畳まない段
              ただし facilitate-discussion への参照位置は未実装。
              構造再設計に依存するため移管した
完了  提案2  proposal-background-scope        提案自体の背景の置き場
移管  提案3  non-proposal-iteration           提案を出せない段階の受け皿
完了  提案4  branch-pr-issue-correspondence   branch・PR・issue の対応
完了  提案5  verification-concreteness        動作確認の具体化
完了  提案6  escalation-without-context-loss  escalate 後の context 喪失
```

移管したものは `facilitate-discussion` の workflow 構造の再設計に依存する。構造が決まらなければ、参照位置も認識合わせの形式も決まらない。

この roadmap はここで終了する。
