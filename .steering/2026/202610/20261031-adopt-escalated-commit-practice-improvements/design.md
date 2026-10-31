# Design: 引き渡された commit 運用の改善提案を取り込む

## 元の依頼内容

利用先 repository の作業から、保留メモとして引き渡された plugin 改善提案 2 件である。提案の本文は assistant が書き、利用者は保留と引渡しの時期を選んだ。利用先固有の情報（repository 名、issue 番号、file path）は除いてある。

- 提案1: `task-design` が design の段階で commit の境界を決める時（要件に revert の単位がある、変更の分け方が設計判断になる等）に、`plan-commits` の判断基準を当てる導線を足す。
    - 契機の利用者の発言: 「コミット計画のスキル考えても同じ結論に至る？」
    - 保留の指示: 「1:b,2:b」（「1:b」がこの提案を指す。問いは「a) 今すぐ plugin の repository に引き渡す b) 保留メモに残し、元作業が終わってから引き渡す c) skill は直さない」）
- 提案2: `tasklist-design.md` と `tasklist-executor/SKILL.md` の、利用者の動作確認と commit の順序を緩める。
    - 契機の利用者の発言: 「つど確認必要？最後まで終わってでいいんじゃない？」
    - 保留の指示: 「1:b。多分あれか？動確環境立ち上げの時のコミットに引きずられたのか？」（「1:b」がこの提案を指す。問いは「a) この作業だけの例外にする b) plugin へ提案し、保留メモに残して元作業の後で引き渡す」）
- 引渡しの指示: 「a」（問いは「a) 今渡す b) 元作業の PR の merge の後に渡す」）

提案の具体例・根拠・後発情報は、[付録の「引き渡された提案の詳細」](#付録引き渡された提案の詳細)に置く。

---

## TL;DR

利用先 repository から引き渡された二つの提案を取り込む。提案1 の理由は、利用先の作業で利用者が「plugin へ提案する」（「1:b」）を選んだ時に合意されている。提案2 の理由は、利用者の発言「review環境で確認するとか必然性があるコミットを許可してるだけ」による（[議論記録](./task-design-discussion.md#論点1-提案1commit-の境界を決める段階で-plan-commits-の基準を当てる導線を取り込む理由)）。

- 提案1: commit の境界を決める段階で、何を比べて境界を決めるかの基準が手元に無い。そのため、revert しても code と文書が食い違わないといった必要条件や、同じ行を二度直す手間を、境界を決める基準と取り違える。plan-commits はその基準を持つが、task-design からも tasklist の設計からも辿れない。境界を決める段階からその基準へ辿れるようにして、同じ取り違えを減らす。取り違えの主な原因は当てはめの誤りであり、導線はそれを減らす補助にとどまる。
- 提案2: 確認環境（review 環境など）で確かめるには commit・push が要る場合がある。今の契約は確認の前の commit・push を一律に禁じるため、確認に必然性がある commit・push まで禁じてしまう。それを許す（[議論記録](./task-design-discussion.md#論点2-提案2利用者の動作確認を-push-の前に置きlocal-commit-を先に許すを取り込む理由)）。

終了時には、TBD: 何が成立するか（二つの提案の中身が決まった後に書く）。

---

## 完成後の姿

### workflow

**利用者の動作確認と commit・push・PR の順序:**

```text
実装 → 機械的な確認（test、lint、型検査、UI 変更なら visual-inspector）
  → [UI確認環境 が「確認環境へ載せるのに commit・push が要る」と定める時だけ]
       その commit・push を行い、確認環境へ載せる
  → 利用者の動作確認
       ├─ 直すところなし → commit → push・PR
       └─ 直すところあり → 直す → 動作確認へ戻る
            （確認環境のための commit が作業 branch に既にあれば、直したところは追加の commit にする）
```

- 確認の前に許す commit・push は、repository の context file の `UI確認環境` に書かれたものだけである。何が必然かを tasklist-executor が実行時に判断しない。
- それ以外の commit・push・PR は、今までどおり利用者の動作確認の後に行う。

**ownerと責務:**

| owner | 判断・更新するもの | 行わないこと | single source of truth |
| --- | --- | --- | --- |
| task-design（tasklist の設計） | `UI確認環境` を読み、確認環境へ載せる commit・push が要るなら、その task を動作確認の前に置く | `UI確認環境` に無い commit・push を確認の前に置く | context file の `UI確認環境`、tasklist |
| tasklist-executor | tasklist の順に、確認環境へ載せる commit・push を行い、`user_confirmation_required` で止まる | 確認の前に、それ以外の commit・push・PR へ進む | tasklist |
| steering | executor を dispatch し、確認の前にそれ以外の commit・push・PR へ進ませない | 確認環境へ載せる commit・push を止める | tasklist |
| 利用先 repository | `UI確認環境` に、確認環境と載せ方、commit・push が要るかを書く | — | context file |

この順序の理由: 確認環境（review 環境など）で確かめるには commit・push が要る場合があり、今の契約はそれまで禁じていた。必然性がある commit・push だけを許す（[議論記録](./task-design-discussion.md#論点3-提案2-の新しい契約利用者の動作確認local-commitpushpr-の順序)）。phase ごとに確認の前に commit する形は採らない。利用者の意図に無かった。

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| TBD: 提案1 の導線を置く file | commit の境界を決める task-design・tasklist-executor | TBD |
| `task-design/tasklist-design.md` の「実装後feedbackと公開action」と自己レビューgate | tasklist を設計する task-design | 確認の前に置いてよい commit・push を、`UI確認環境` の宣言から決める |
| `task-design/templates/tasklist.md` の「完了後のaction」 | tasklist を書く task-design | ⚠️ の除外から、確認環境へ載せる commit・push だけを確認の前に置く |
| `tasklist-executor/SKILL.md` の「停止・再開」と「返却」 | tasklist を実行する tasklist-executor | 確認環境へ載せる commit・push だけを確認の前に行う |
| `steering/SKILL.md` の「6-1. leafを実行する」と「このskillが絶対にやらないこと」 | dispatch する steering | 確認環境へ載せる commit・push を止めない |
| `skills/tumeda-dev-plugin-context.md`（context file の template）の `### UI確認環境` | 利用先 repository で context を書く人・agent | 確認環境へ載せるのに commit・push が要るなら、その旨と載せ方を書く（論点3 の変更内容3。報告中） |
| `scripts/verification/validate-plugin.mjs` | validator | 変えた契約の文に対応する assertion を持つ（repository の test 方針） |
| version 宣言 5 箇所 | 配布 | 既存 skill の内容修正なので PATCH（8.2.0 → 8.2.1） |

**完成後の内容と構造（提案2）:**

どの箇所も、「確認前に commit・push しない」の文に除外を添える。除外の文は次の二つである。

- `tasklist-design.md` の規則の文の後: 「repositoryのcontext fileの`UI確認環境`が、確認環境へ載せるのにcommit・pushが要ると定めている場合、そのcommit・pushは確認の前に行ってよい。それ以外のcommit・push・PRは確認の後に行う。確認の前に確認環境のためのcommitが作業branchにある場合、確認で直したところは既存のcommitを書き換えず、追加のcommitにする。」
- 他の 6 か所（gate、template の ⚠️、executor 2、steering 2）: 「（確認環境へ載せるために`UI確認環境`が定めるcommit・pushを除く）」またはそれと同じ意味の句。

`share-work-in-progress/SKILL.md` と `skills/README.md` は変えない。tasklist-executor の契約の原則（確認まで commit・push・PR しない）は変わらないため。

---

## 要件（Requirements）

### MUST（必達）

- 確認の前に許す commit・push を、context file の `UI確認環境` が定めるものに限る。tasklist-design、template、tasklist-executor、steering の「確認前に commit・push しない」のすべてに、同じ除外を添える。
- 確認で直したところは、既存の commit を書き換えず追加の commit にする（確認環境のための commit が作業 branch に既にある場合）。
- TBD: 提案1 の要件。
- 変えた skill・docs の契約の文に対応する assertion を `scripts/verification/validate-plugin.mjs` に足し、撤去した文が戻らないことも検査する。
- plugin へ書く内容に、利用先 repository 固有の情報を入れない（`maintenance_policies/migration.md`）。

### SHOULD（できれば）

なし

### MAY（あれば嬉しい）

なし

### 非目標

- phase ごとに、利用者の確認の前に local で commit すること。利用者の意図に無い（論点3）。
- `share-work-in-progress` と `skills/README.md` の書き換え。tasklist-executor の契約の原則は変わらない。
- 確認環境へ載せる具体的な手順を plugin に書くこと。手順は repository ごとに違い、context file の `UI確認環境` と repository の文書が持つ。

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出す。
- `grep` で「確認前にcommit・pushへ進まない」等の 6 か所に `UI確認環境` の除外があり、`share-work-in-progress/SKILL.md` と `skills/README.md` が `c1122f5` から変わっていない。
- TBD: 提案1 の基準。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| TBD | TBD |

---

## テスト方針

- validator の assertion で、変えた契約の文があり、撤去した文が無いことを検査する。
- TBD

---

## （付録）前提とする既存仕様

確認元は 2026-10-31 の `c1122f5`（plugin 8.2.0）である。

- 利用者の動作確認と commit・push・PR の順序（提案2 が変える契約）:
    - `task-design/tasklist-design.md` の「実装後feedbackと公開action」: 「自動testとscreenshotは機械的確認であり、ユーザーが実際に触る動作確認を代替しない。commit・push・PRより前にユーザー動作確認を必須にする。」
    - 同 file の自己レビューgate: 「commit・push・PRより前にユーザー動作確認があるか」と、失敗例「機械的確認を『動作確認済み』と読み替え、tasklist-executorがそのままcommit・pushまで進む。」
    - `task-design/templates/tasklist.md` の「完了後のaction」: 「⚠️ 動作確認phaseが完了するまでcommit、push、PRを促したり実行したりしない。急かすことも禁止する。」
    - `tasklist-executor/SKILL.md` の「停止・再開」: 「ユーザー動作確認がtasklistにある時は`user_confirmation_required`で停止し、確認前にcommit・pushへ進まない」。「返却」: 「tasklistが定めるユーザー動作確認より先にcommit・push・PRへ進まない。」
    - `steering/SKILL.md` の「6-1. leafを実行する」: 「tasklist内のユーザー動作確認が完了する前にcommit、push、PRへ進ませない。」。「このskillが絶対にやらないこと」: 「tasklist合意前に実装し、ユーザー動作確認前にcommit、push、PRを行う。」
    - `share-work-in-progress/SKILL.md` の「起動gate」と `skills/README.md`: tasklist-executor の契約を「ユーザー動作確認が完了するまでcommit・push・PRを行わない」と引き、自身を「動作確認の前に呼ばれる」と位置付ける。
    - `runtime-execution-contracts.md`: `user_confirmation_required` は「tasklistが要求するユーザー動作確認を待つ」停止理由である。
- commit の分け方（提案1 が関わる契約）:
    - `task-design/tasklist-design.md`: commit section は「phase単位かつ意味単位で分け」る。commit section を生成するのは、context file に local Git 運用条件がある場合か、利用者が commit を明示要求した場合だけ。
    - `task-design/templates/tasklist.md`: 「commit（phase単位かつ意味単位で分割）」「MUST: まとめて一commitにしない」「同一phase内でも意味的に異なる変更を分割する（例: DB migration、domain model、GraphQL、frontendは別commit）」。
    - `task-design/SKILL.md` とその templates に、design の段階で commit の境界（revert の単位）を決める節は無い。
    - `plan-commits` を参照しているのは `skills/README.md` の一覧だけで、task-design・tasklist-design・tasklist-executor・steering のどれも参照していない。
- validator の assertion: 上の契約の文を検査する assertion は無い（2026-10-31 に `scripts/verification/validate-plugin.mjs` を「動作確認」で検索した）。
- version: 既存 skill の内容修正・docs の変更は PATCH（`.agents/skills/tumeda-dev-plugin-context.md` の「version bump」）。

---

## （付録）引き渡された提案の詳細

### 提案1: design の段階で commit の境界を決める時に、plan-commits の判断基準を当てる

- 具体例: 利用先 repository で、ある機能を削除する作業。要件に「その機能の削除を、単体で revert できる一つの変更にする」があり、文書の書き直しを code の削除と同じ commit に入れるかを議論で決めた。assistant は「revert したとき code と文書が食い違わない」だけを軸にし、code・文書・呼び名の変更をすべて一つの commit にする案を出した。利用者が「コミット計画のスキル考えても同じ結論に至る？」と問い、`plan-commits` の基準に当てると、画面の依存の切り離しと呼び名の変更は取り消す効果が独立しており、四つの commit に分かれた。
- 根拠（assistant の整理）: 「意味単位」という語だけでは、何を比べて境界を決めるかが分からない。assistant は revert 時の整合という必要条件を分割の基準と取り違え、手間（同じ行を二度直す）を分けない理由に挙げた。`plan-commits` はこの判断の基準を持つが、design の段階ではそこへ辿る導線が無い。主な原因は assistant の当てはめの誤りであり、導線は再発を減らす補助である。

### 提案2: 利用者の動作確認を push の前に置き、phase ごとの local commit を機械的な確認の後に許す

- 提案した契約: 利用者の動作確認は、作業 branch の push・PR より前に置く。phase ごとの local commit は、test・lint・型検査と画面の機械的な確認の後に、利用者の確認を待たずに行ってよい。確認環境へ載せるための push（確認専用の branch への push）は確認の一部として扱い、push の制限に含めない。作業の外へ残る action を含む phase で止まって確かめる規則は変えない。
- 具体例: 利用先 repository の作業で、tasklist は各 phase の後に利用者の確認、その後に commit と定めた。利用者はスマホで確かめるため、本番と同じ build 設定で常設の branch を build する確認環境を使った。確認環境は、その branch へ commit を push すると build が走る。最初の phase の変更は commit 前だったため、assistant は作業 branch に commit せず一時 commit を作って確認用の branch へ force push し、build の成功を確かめてから確認を頼んだ。その後、利用者が「つど確認必要？最後まで終わってでいいんじゃない？」と問い、以降は機械的な確認の後に local で commit し、利用者の確認は最後に一度、push の前に行った。最終確認は作業 branch の HEAD をそのまま確認環境へ載せられた。
- 根拠（assistant の整理）: 利用者の確認で守りたいのは、確かめていない変更を公開しないことである。push 前の local commit は amend や rebase で直せる。確認環境が commit の push で build される場合、「確認より先に commit しない」は確認環境の使い方と構造上ぶつかり、phase ごとに一時 commit・push・build の待ちが要った。
- 後発情報: 利用先 repository では、確認環境への push を repository 側で扱った。確認環境へ載せて build の成功を確かめてから確認を頼む repository 固有の skill を作り、repository の context file の tasklist-executor 節を「確認前に止めるのは作業 branch への commit・push と PR 作成であり、skill による確認環境への force push は含まない」に直した。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

なし

### task-design内の対象成果物反映待ち

| 対象 | 待つ理由 | 依存decision | 参照するdesign section |
| --- | --- | --- | --- |
| 提案2 の除外（`tasklist-design.md`、`templates/tasklist.md`、`tasklist-executor/SKILL.md`、`steering/SKILL.md`） | 内容は決まった（論点3）。作業 branch に書き換えは入っている。提案1 の導線が同じ file に入るため、document-review・skill-update-review・validator の assertion を提案1 と一緒に行う | 提案1 の導線の置き場所 | [workflow](#workflow)、[documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| context file の template の `### UI確認環境` の comment | 論点3 の変更内容3 として報告中。次の応答の後に反映する | 論点3 の変更内容3 への応答 | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |

### execution plan対象

なし

### 分類保留（設計中のみ）

| 変更候補 | 保留理由 | 分類を確定するdecision |
| --- | --- | --- |
| 提案1 の導線 | 置く file と中身が決まっていない | 提案1 の導線の置き場所 |
| validator の assertion と version bump | 提案1 の文が決まっていない | 提案1 の導線の置き場所 |
