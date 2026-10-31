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
- 既にある commit の扱い: 利用者の考えは「コミット単位は、歴史を理解する単位として厳密にするけど、強硬派のように、コミットを書き換えてでも間違った歴史にしない強制力をするほどじゃ無い」「うまい単位にならない可能性もある」である。この考え方が skill に無く、assistant は既にある commit の書き換えを二度既定にした。plan-commits に書き、share-work-in-progress の、作る commit を後から整理する前提を外す（[論点6](./task-design-discussion.md#論点6-share-work-in-progress-の後から整理される前提を論点5-の決定に合わせるか)、[議論記録](./task-design-discussion.md#論点5-既存の-commit-を書き換えないという考え方を-plan-commits-に書くか)）。

終了時には、commit の境界を決める三つの段階（design、tasklist の設計、commit の実行）から plan-commits の基準へ辿れる。利用者の動作確認の前には、context file の `UI確認環境` が定める確認環境へ載せるための commit・push だけを行え、それ以外の commit・push・PR は確認の後に残る。既にある commit は、利用者が明示しない限り書き換えず、その上へ積む。利用先から plugin へ提案を引き渡す時は、利用者が合意した範囲を原文とともに渡す。

---

## 完成後の姿

### workflow

**利用者の動作確認と commit・push・PR の順序:**

```text
実装 → 機械的な確認（test、lint、型検査、UI 変更なら visual-inspector）
  → [UI確認環境 が「確認環境へ載せるのに commit・push が要る」と定める時だけ]
       tasklist の task として、その commit・push を行い、確認環境へ載せる
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
| `task-design/SKILL.md` の Step 3 の小節「commitの境界が設計判断になる時」 | design で commit の境界を決める task-design | 境界が設計判断になる時に、plan-commits の基準を design の変更の単位へ当てる。実差分が無いので skill は起動しない（[議論記録](./task-design-discussion.md#論点4-提案1-の導線の置き場所と文)） |
| `task-design/tasklist-design.md` の commit の生成条件の文 | tasklist を設計する task-design | commit の分け方の基準が plan-commits にあると分かる |
| `task-design/templates/tasklist.md` の commit task | commit を実行する tasklist-executor | 実差分へ plan-commits を当てて境界を決める |
| `share-work-in-progress/SKILL.md` の「起動gate」の二段落目 | WIP の commit を扱う agent | WIP の commit が意味の単位とは限らないと分かる。後から整理するかは利用者が決め、既にある commit の扱いは plan-commits に従う（[議論記録](./task-design-discussion.md#論点6-share-work-in-progress-の後から整理される前提を論点5-の決定に合わせるか)） |
| `escalate-plugin-skill-fix/SKILL.md` の「引き渡す内容」 | 提案を引き渡す agent と、受け取って設計する task-design | 引き渡しへの合意と中身への合意を分けて渡し、受け取った側は原文で確かめられない中身を未合意として設計で合意を取る（[議論記録](./task-design-discussion.md#論点7-引き渡す内容に利用者が合意した範囲を足すか)） |
| `plan-commits/SKILL.md` の「分割の優先順位」の末尾の段落 | commit を計画・実行する agent | 既にある commit を、履歴の単位を整えるためだけに書き換えず、その上へ意味の単位で積む。書き換えるのは利用者が明示した時だけ（[議論記録](./task-design-discussion.md#論点5-既存の-commit-を書き換えないという考え方を-plan-commits-に書くか)） |
| `task-design/tasklist-design.md` の「実装後feedbackと公開action」と自己レビューgate | tasklist を設計する task-design | 確認の前に置いてよい commit・push を、`UI確認環境` の宣言から決める |
| `task-design/templates/tasklist.md` の「完了後のaction」 | tasklist を書く task-design | ⚠️ の除外から、確認環境へ載せる commit・push だけを確認の前に置く |
| `tasklist-executor/SKILL.md` の「停止・再開」と「返却」 | tasklist を実行する tasklist-executor | 確認環境へ載せる commit・push だけを確認の前に行う |
| `steering/SKILL.md` の「6-1. leafを実行する」と「このskillが絶対にやらないこと」 | dispatch する steering | 確認環境へ載せる commit・push を止めない |
| `skills/tumeda-dev-plugin-context.md`（context file の template）の `### UI確認環境` | 利用先 repository で context を書く人・agent | 確認環境へ載せるのに commit・push が要るなら、その旨と載せ方を書く（[議論記録](./task-design-discussion.md#論点3-提案2-の新しい契約利用者の動作確認local-commitpushpr-の順序)） |
| `scripts/verification/validate-plugin.mjs` | validator | 変えた契約の文に対応する assertion を持つ（repository の test 方針） |
| version 宣言 5 箇所 | 配布 | 既存 skill の内容修正なので PATCH（8.2.0 → 8.2.1） |

**完成後の内容と構造（提案2）:**

`tasklist-design.md` の「実装後feedbackと公開action」の規則は、次の形になる。

```markdown
- 自動testとscreenshotは機械的確認であり、ユーザーが実際に触る動作確認を代替しない。commit・push・PRより前にユーザー動作確認を必須にする。
  - 例外: repositoryのcontext fileの`UI確認環境`が、確認環境へ載せるのにcommit・pushが要ると定めている場合、そのcommit・pushは確認の前に行ってよい。その場合は、動作確認の依頼taskの前に、`UI確認環境`が定める載せ方で確認環境へ載せるtaskを置く。それ以外のcommit・push・PRは確認の後に行う。
  - 確認の前に確認環境のためのcommitが作業branchにある場合、確認で直したところは既存のcommitを書き換えず、追加のcommitにする。
```

- 他の 6 か所（自己レビュー gate、template の ⚠️、tasklist-executor の 2 か所、steering の 2 か所）には、同じ句「確認環境へ載せるために`UI確認環境`が定めるcommit・pushを除く」（template の ⚠️ は「除き、」）を添える。
- template の「動作確認」の Tasks の先頭に、「- [ ] 確認環境へ載せる（`UI確認環境`が載せ方を定めている場合だけ。{載せ方}）」を置く。

`share-work-in-progress/SKILL.md` は「起動gate」の二段落目だけを変える（論点6）。tasklist-executor の契約を引く段落と `skills/README.md` は変えない。tasklist-executor の契約の原則（確認まで commit・push・PR しない）は変わらないため。

---

## 要件（Requirements）

### MUST（必達）

- 確認の前に許す commit・push を、context file の `UI確認環境` が定めるものに限る。tasklist-design、template、tasklist-executor、steering の「確認前に commit・push しない」のすべてに、同じ除外を添える。
- 確認で直したところは、既存の commit を書き換えず追加の commit にする（確認環境のための commit が作業 branch に既にある場合）。
- commit の境界を決める三つの段階（`task-design/SKILL.md` の Step 3、`tasklist-design.md` の commit の文、`templates/tasklist.md` の commit task）から、plan-commits の基準へ辿れる。
- design の段階では plan-commits を起動せず基準だけを当てると書く。plan-commits は実差分から計画する skill であるため。
- 「意味単位」の定義を plan-commits 以外へ書かない。
- 既にある commit を、履歴の単位を整えるためだけに書き換えないと、`plan-commits/SKILL.md` に書く。書き換えるのは利用者が明示した時だけとする。
    - 置き場所は暫定である（利用者「一旦ここに間借りさせるか」）。暫定にした理由は、利用者の「plan-commitに関係ない気もする」による。見直す条件: plan-commits を通らない場面（設計の議論、作業中の共有など）で既にある commit の書き換えを再び既定にした時、または `docs/development_standards/development_flow/` に commit や履歴の扱いを書く時に、置き場所を見直す。移す先の候補は `development_flow/` である。
- `share-work-in-progress/SKILL.md` の「起動gate」で、作る commit を後から書き換える前提を外し、既にある commit の扱いを `plan-commits` へ委ねる。規則は写さない。
- `escalate-plugin-skill-fix/SKILL.md` の「引き渡す内容」に、利用者が合意した範囲（引き渡すことへの合意と中身への合意を分け、原文を添える）を足す。受け取った側は、原文で確かめられない中身を未合意として扱う。
- context file の template の `### UI確認環境` に、確認環境へ載せるのに commit・push が要るならその旨と載せ方を書く、という comment を置く。
- version を 8.2.1 にする（既存 skill の内容修正のため PATCH）。
- 変えた skill・docs の契約の文に対応する assertion を `scripts/verification/validate-plugin.mjs` に足し、撤去した文が戻らないことも検査する。
- plugin へ書く内容に、利用先 repository 固有の情報を入れない（`maintenance_policies/migration.md`）。

### SHOULD（できれば）

なし

### MAY（あれば嬉しい）

なし

### 非目標

- design.md の template に「変更の単位と順序」節を足すこと。境界が設計判断になる作業だけで要る節であり、すべての design に空の節が増える。
- phase ごとに、利用者の確認の前に local で commit すること。利用者の意図に無い（[議論記録](./task-design-discussion.md#論点3-提案2-の新しい契約利用者の動作確認local-commitpushpr-の順序)）。
- `skills/README.md` の書き換えと、`share-work-in-progress/SKILL.md` の「起動gate」の二段落目以外の書き換え。tasklist-executor の契約の原則は変わらない。
- 確認環境へ載せる具体的な手順を plugin に書くこと。手順は repository ごとに違い、context file の `UI確認環境` と repository の文書が持つ。

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出す。
- `grep` で「確認前にcommit・pushへ進まない」等の 6 か所に `UI確認環境` の除外があり、`skills/README.md` が `c1122f5` から変わっていない。`share-work-in-progress/SKILL.md` は「起動gate」の二段落目だけが変わっている。
- `task-design/SKILL.md` に「commitの境界が設計判断になる時」の小節があり、`tasklist-design.md` と `templates/tasklist.md` に `plan-commits` への導線がある。
- `plan-commits/SKILL.md` に、既にある commit を書き換えない段落があり、「既存の保存commit」の一文が無い。
- `escalate-plugin-skill-fix/SKILL.md` の「引き渡す内容」が四点になり、受け取った側の扱いの文がある。
- 変えた文と、変えていない `share-work-in-progress/SKILL.md` の tasklist-executor の契約を引く文・`skills/README.md` について、validator の assertion がある。
- 変えた skill の file が document-review の更新時観点を通り、skill-update-review の編集後 review が合格する。
- main へ取り込んだ後、`claude plugin marketplace update` と plugin の update で 8.2.1 が入り、install した commit が main の先端と一致することを確かめられる。取り込みは配布になり作業を破棄しても残るため、戻す時は revert と PATCH の bump で戻す。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 例外の条件（`UI確認環境` の宣言）が書かれず、例外が使われない | template の `### UI確認環境` に書き方の comment を置く |
| 「確認環境へ載せる」の範囲が広く読まれ、確認の前に作業 branch を push・PR する | 除外は `UI確認環境` に書かれた commit・push に限ると、全箇所で同じ句で書く。PR は除外に含めない |
| plan-commits を design の段階で起動し、実差分の無い計画を作る | design の小節に「起動せず基準だけを当てる」と書く |

---

## テスト方針

- validator（`scripts/verification/validate-plugin.mjs`）に assertion を足す。
    - 足した文があること: `tasklist-design.md` の例外の文と plan-commits の括弧書き、template の ⚠️ の除外と plan-commits の行、tasklist-executor と steering の除外 4 か所、`task-design/SKILL.md` の小節の見出し、context file の template の `UI確認環境` の comment、`plan-commits/SKILL.md` の既にある commit を書き換えない段落、`share-work-in-progress/SKILL.md` の「起動gate」の新しい二文、`escalate-plugin-skill-fix/SKILL.md` の「引き渡す内容」の四点目と受け取った側の扱いの文。
    - 外した形が戻らないこと: 「phase ごとに確認の前に local で commit する」形の文（提案0・提案1 で一時的に入れた文）と、plan-commits の「既存の保存commitを、履歴が整わないという理由だけで改変しない。」、share-work-in-progress の「後からamendやrebaseで整理される前提を持つ」が無いこと。
- `node scripts/verification/validate-plugin.mjs`、`node scripts/verification/test-task-design-handoff.mjs`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` を通す。
- 変えた skill の file に document-review の更新時観点を当てる。skill-update-review の編集後 review を行う。

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

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `task-design/tasklist-design.md`、`task-design/templates/tasklist.md`、`tasklist-executor/SKILL.md`、`steering/SKILL.md` | 確認の前の commit・push の禁止に、`UI確認環境` が定める確認環境のための commit・push の除外を 6 か所同じ句で添えた。`tasklist-design.md` に、載せる task を動作確認の依頼 task の前に置くことと、確認で直したところを追加の commit にすることを書き、template の「動作確認」の先頭に載せる task を置いた | skill-update-review の 2 回目で合格（`artifacts/skill-structure-review.md`）。document-review の更新時観点で、規則の 1 行を子の箇条書きに分けた。validator の assertion が通る | [workflow](#workflow)、[documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `task-design/SKILL.md`、`task-design/tasklist-design.md`、`task-design/templates/tasklist.md` | commit の境界を決める三つの段階に plan-commits への導線を置いた（Step 3 の小節、括弧書き、commit task の 1 行） | 同上 | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `skills/tumeda-dev-plugin-context.md`（`.agents/skills/` は `plugins/tumeda-dev/skills/` への symlink であり、同じ file） | `### UI確認環境` に、確認環境へ載せるのに commit・push が要るならその旨と載せ方を書く、という comment を置いた | comment が一つだけあることを `grep -c` で確かめた。validator の assertion が通る | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `plan-commits/SKILL.md` | 「分割の優先順位」の末尾の一文を、既にある commit を書き換えない段落と三行の失敗例に置き換えた | validator の assertion が通り、旧文に戻すと 3 件で落ちることを確かめた。document-review の更新時観点で、置き換えた一文の対象（現状保存の commit）が新しい段落に含まれることを確かめた。skill-update-review の 3 回目は share-work-in-progress との食い違いで不合格になり、論点6 の反映後の 4 回目で合格した（`artifacts/skill-structure-review.md`） | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `share-work-in-progress/SKILL.md` | 「起動gate」の二段落目を、作る commit が意味の単位とは限らないことと、既にある commit の扱いを plan-commits に委ねることに書き換えた | validator の assertion が通り、旧文に戻すと 3 件で落ちることを確かめた。document-review の更新時観点で、消した「履歴として残すためのcommitではない」の役割（WIP の commit の性質を伝える）を「意味の単位になっているとは限らない」が引き継ぐことを確かめた。skill-update-review の 4 回目で合格（`artifacts/skill-structure-review.md`） | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `escalate-plugin-skill-fix/SKILL.md` | 「引き渡す内容」に、利用者が合意した範囲を四点目として足し、受け取った側の扱いを書いた | validator の assertion が通り、旧文に戻すと 3 件で落ちることを確かめた。document-review の更新時観点で、四点目が既存の「利用先repository固有の情報を除いた形で」の対象に入り、原文の固有情報は `migration.md` の規約で除くことを確かめた。skill-update-review の 5 回目で合格（`artifacts/skill-structure-review.md`） | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `scripts/verification/validate-plugin.mjs`、version 宣言 5 箇所 | 上の文の assertion と、phase ごとの確認前 commit の形が戻らない assertion を足した。version を 8.2.1 にした | `validate-plugin.mjs`、`test-task-design-handoff.mjs`、`inspect-discussion.test.mjs` がすべて通る | [テスト方針](#テスト方針) |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし
