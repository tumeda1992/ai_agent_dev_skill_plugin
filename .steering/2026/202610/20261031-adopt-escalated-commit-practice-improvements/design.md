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

利用先 repository から引き渡された二つの提案を取り込む。どちらの理由も、利用先の作業で利用者が「plugin へ提案する」（「1:b」）を選んだ時に合意されている（[議論記録](./task-design-discussion.md#論点1-提案1commit-の境界を決める段階で-plan-commits-の基準を当てる導線を取り込む理由)）。

- 提案1: commit の境界を決める段階で、何を比べて境界を決めるかの基準が手元に無い。そのため、revert しても code と文書が食い違わないといった必要条件や、同じ行を二度直す手間を、境界を決める基準と取り違える。plan-commits はその基準を持つが、task-design からも tasklist の設計からも辿れない。境界を決める段階からその基準へ辿れるようにして、同じ取り違えを減らす。取り違えの主な原因は当てはめの誤りであり、導線はそれを減らす補助にとどまる。
- 提案2: TBD（既決事項からの導出として報告中）

終了時には、TBD: 何が成立するか（二つの提案の中身が決まった後に書く）。

---

## 完成後の姿

### workflow

TBD: 利用者の動作確認・local commit・作業 branch の push・PR の順序と、それぞれの owner。提案2 の採否と中身で決まる。

- 今の順序: 実装 → 機械的な確認 → 利用者の動作確認 → commit → push・PR（[付録の既存仕様](#付録前提とする既存仕様)）。
- TBD: 確認環境へ載せるための push を、push の制限に含めるか。plugin が対象 branch を書くか。

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| TBD: 提案1 の導線を置く file（`task-design/SKILL.md`、`task-design/tasklist-design.md`、`task-design/templates/` のどれか、または複数） | design の段階で commit の境界を決める task-design | TBD |
| `task-design/tasklist-design.md`（提案2） | tasklist を設計する task-design | TBD |
| `task-design/templates/tasklist.md`（提案2） | tasklist を書く task-design | TBD |
| `tasklist-executor/SKILL.md`（提案2） | tasklist を実行する tasklist-executor | TBD |
| `steering/SKILL.md`（提案2） | dispatch する steering | TBD |
| `share-work-in-progress/SKILL.md`、`skills/README.md`（提案2） | 作業中の branch を共有する agent | TBD: tasklist-executor の契約を「確認まで commit・push・PR しない」と引いている記述を、新しい契約に合わせるか |
| `scripts/verification/validate-plugin.mjs` | validator | 変えた契約の文に対応する assertion を持つ（repository の test 方針） |
| version 宣言 5 箇所 | 配布 | TBD: bump の区分（既存 skill の内容修正なら PATCH） |

---

## 要件（Requirements）

### MUST（必達）

- TBD: WHY の合意の後に書く。
- 変えた skill・docs の契約の文に対応する assertion を `scripts/verification/validate-plugin.mjs` に足し、撤去した文が戻らないことも検査する。
- plugin へ書く内容に、利用先 repository 固有の情報を入れない（`maintenance_policies/migration.md`）。

### SHOULD（できれば）

なし

### MAY（あれば嬉しい）

なし

### 非目標

TBD

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出す。
- TBD: 契約の変更ごとの基準。

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

なし

### execution plan対象

なし

### 分類保留（設計中のみ）

| 変更候補 | 保留理由 | 分類を確定するdecision |
| --- | --- | --- |
| 提案1 の導線 | 置く file と中身が決まっていない | 提案1 の WHY と、導線を置く場所 |
| 提案2 の契約の変更（tasklist-design、template、tasklist-executor、steering、share-work-in-progress、skills/README） | 契約の中身が決まっていない | 提案2 の WHY と、新しい契約の中身 |
| validator の assertion と version bump | 変える文が決まっていない | 上の二つ |
