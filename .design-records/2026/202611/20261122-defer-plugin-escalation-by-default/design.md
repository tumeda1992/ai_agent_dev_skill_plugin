# Design: plugin への改善の引渡しを、既定で元の作業の後にする

## 元の依頼内容

起点: escalate-plugin-skill-fix の保留していた改善の引渡し（利用先 repository の作業の実装の後に再開条件が成立した）。plugin repository の issue #6（「escalate-pluginは、即時改善だけでなく、保留改善の選択肢も持ち、保留改善をデフォルトとする（改善 in クラウドセッション）」、2026-11-22 時点で open、本文なし）でやろうとしたことの一部として出された。

達成したいこと: escalate-plugin-skill-fix の既定を、提案が生じた時点での即時の引渡しから、元の作業の後の引渡し（保留）に変える。利用者が即時を指示した時だけ、即時に引き渡す。

具体例（利用先固有の情報を除いた形）: ある利用先 repository の一つの作業（AWS の変更を Terraform と GitHub Actions で届ける経路を作る作業）の中で、plugin への提案が三度生じた。二度は既定どおりその場で plugin repository へ移って steering を回し（基盤の設計の標準 3 件で 9.0.3、作業の外へ残る action の停止 task の規則で 9.0.4）、どちらも元の作業（design、tasklist のレビュー）を中断して行った。三度目は、利用者が明示して実装の後へ保留した。その後、同じ作業の中で保留した提案はさらに二件増えた。実装が終わった後、保留した提案を一件ずつ引き渡している（一件目は 9.1.2 として取り込み済み）。

根拠: 利用者の原文（下）。中断の負担（元の作業の context を離れ、戻ってから再開する）は assistant の読みで、利用者の原文には無い。

利用者の原文（会話上の原文。三度目の提案への保留指示に続けて述べた）:

> 提案は受諾。今回のエスカレ適用はは実装後に保留する。
> というか、 https://github.com/tumeda1992/ai_agent_dev_skill_plugin/issues/6 でやろうとしたことついでにエスカレ提案にあげるけど、即時エスカレ反映がデフォルトになってるけど、デフォルトを作業後にして、言われた時だけ即時にしたい。

合意の範囲: 引き渡すこと（保留の後に引き渡すこと）と、既定を作業の後にし、言われた時だけ即時にするという方向は、利用者の原文で合意がある。「作業の後」が何を指すか（元の作業のどの時点か）、保留を既定にした時の記録・再開の仕組みの書き方、issue #6 の残りの範囲との関係は未合意で、この steering の設計で決める。

---

## TL;DR

今の escalate-plugin-skill-fix は、plugin への改善の提案が生じると、利用者が保留を明示しない限り、その場で plugin repository へ移って steering を回す。そのたびに元の作業が中断し、利用者は元の作業の context から離れる。これを逆にし、既定では提案を元の作業の保留メモに控えて元の作業を続け、元の作業の後に引き渡す。利用者が即時を指示した時だけ、今の即時の経路を使う。保留の保存・再確認・引渡しの仕組み（`pending-escalations.md`）は既にあり、それを既定の経路にする。

---

## 完成後の姿

### escalate-plugin-skill-fix の流れ

```text
提案が生じる（起動 gate は今と同じ）
  │
  ├─ 利用者が即時を指示している ─→ 今の即時の経路（plugin repository の判定 → 引渡し → steering）
  │
  └─ 指示が無い（既定） ─→ 元の作業の pending-escalations/ に保留メモを保存し、元の作業へ返す
                              │
                              └─ 元の担当が、再開条件に当たる状態の遷移を記録した時に再確認を依頼する
                                   └─ 条件が成立 → 今の引渡しの経路（現在の提案を整えて plugin repository へ）
```

- 起動 gate、plugin repository の判定、引渡しの内容、取り込みと反映は変えない。
- 変えるのは、作業先を切り替える前の判定の向きである。今は「明示保留があれば保留、無ければ即時」で、変更後は「即時の指示があれば即時、無ければ保留」になる。
- 既定の保留の再開条件は「元の作業の完了」である。
  - 元の作業は、提案が生じた時に進めていた作業である。steering の中で生じたらその steering、roadmap の子 steering の中で生じたらその子 steering（roadmap 全体ではない）。
  - 完了は、その作業の既存の完了判定で決める。steering なら、planless の完了を報告した時（Step 5-1）、または tasklist-executor の完了を照合した時（Step 6-1）。
  - 保留メモの再開条件には「既定（即時の指示なし）: 元の作業の完了」と書く。利用者が別の時点を指示した時は、その指示を再開条件にする。
  - これは `pending-escalations.md` の「条件が『作業完了』なら元作業の既存完了判定が対応する」と同じ対応であり、元の担当が状態の遷移で再確認を依頼する今の仕組みをそのまま使う。design の完了を既定にすると実装へ移る時に中断が起き、roadmap 全体の完了では引渡しが遅れて同じ不備が他の子 steering でも効き続け、PR の merge は元の担当が状態の遷移として記録しないため、どれも既定にしない。
- 元の作業に保留メモを置く directory が無い時（steering を使わない作業等）は、既定の保留にしない。利用者へ「a. 今すぐ plugin へ引き渡す」「b. 控えを置く場所と、引き渡す時点を指示する」の一問を出し、答えに従う。b なら、指示された場所に保留メモを置き、指示された時点を再開条件にする。推測で置き場を作らず、repository 共通の仮置きもしない。黙って即時に引き渡すと元の作業を中断しない目的に反し、chat に控えると session の外に記録が残らないためである。
- 即時の指示は、今の明示保留と同じ二つの範囲で扱う。個別（「この改善はすぐ渡して」）はその提案だけ、同じ作業の中の全部（「この作業中の改善は全部すぐ渡して」）は指示の後に同じ元の作業の中で生じる提案を即時にする。指示はその対象・元の作業だけに効き、別の作業へ広げない。範囲や期間が分からない時は不足だけを確かめ、慣習や過去の指示から即時を補わない。保留と即時の指示の扱いを対称にし、読み手が二つの規則を覚え分けずに済むようにするためである。
- 提案を直すと、同じ元の作業の残りの進め方が変わる時だけ、assistant は即時を勧める。勧める時は、提案を示す時に「この改善を保留すると、今の作業の残り（{変わる工程}）が今の skill の規則のまま進み、後でやり直しになる。a. 今すぐ plugin へ引き渡す / b. 保留して、今の作業の後に引き渡す」の一問を出し、自分で即時に切り替えない。それ以外の提案では勧めず、既定どおり保留する。判断の問いは「この提案が直す規則に、今の作業の残りの工程が従うか」である。「重要」「急ぎ」では線が引けず、勧めないと assistant が気付いたやり直しを黙ることになるためである。
- 既定で保留した時は、保留メモを保存した直後に、利用者へ「plugin への引渡しは、既定どおり作業の後に保留した（控え: `{保留メモの path}`、引き渡す時点: {再開条件}）。すぐ渡す時は言って。」の一行で知らせる。問いにはしない。即時を勧める一問を出した場合は、答えが保留の時だけ、この一行で保存を知らせる。利用者が即時を指示できるのは、保留されたことを知っている時だけであり、毎回問うと中断を減らす目的に反するためである。

### 変わる file

見出しは変えない。validator が見出しの順（起動 gate → 作業先を切り替える前の保留判定 → plugin repository の判定）を検査しており、「作業先を切り替える前の保留判定」は即時か保留かの判定として名前がそのまま合うためである。

- `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md`
  - frontmatter の description: 一文目の後に「既定では提案を元の作業の保留メモに控え、元の作業の後に引き渡す。利用者が即時を指示した時だけ、その場で引き渡す。」を足す。
  - 「目的と成果」: 既定を保留にし、その理由（提案のたびに移ると元の作業の context を離れる）を書く。利用者が即時を指示した場合だけ、記録を始める前に plugin repository へ移る経路を使う。既定の保留の成果は、保留メモと追跡を保存し、保留を利用者へ知らせて元の担当へ返した状態とする。
  - 「作業先を切り替える前の保留判定」: 即時の指示（個別または同じ作業内）があれば即時引渡しへ、無ければ既定どおり `pending-escalations.md` で保留する。慣習や過去の指示から即時を補わない。即時を勧める一問と判断の問いを置く。
- `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md`
  - h1 を「明示された改善の保留と再開」から「改善の保留と再開」にする（既定の保留も扱うため、明示に限らない）。
  - 冒頭の「いつ読むか」に、即時の指示が無い提案を既定として保留する時を足す。
  - 「保留を保存する」: 既定の保留と再開条件、利用者が時点を指示した保留、即時の指示の二つの範囲、置き場が無い時の一問、保留の根拠（保留指示の原文、または即時の指示が無かったこと）、指示が効く範囲、保留を知らせる一行を書く。
  - 「元担当の状態遷移から再確認する」: 既定の再開条件「元の作業の完了」が元作業の既存完了判定に対応すること、元の作業の単位（roadmap の子 steering ならその子 steering）を足す。
  - 「再開条件を確認する」: 既定の保留は元の作業の完了の証拠を確認して引き渡すことを足す。
- `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/templates/pending-escalation.md`: 「保留指示の原文と出典」を「保留の根拠（利用者の保留指示の原文と出典、または即時の指示が無かったこと）」にする。既定の保留には利用者の保留指示の原文が無いためである。
- `plugins/tumeda-dev/skills/README.md`: escalate-plugin-skill-fix の一行を、既定では元の作業の保留メモに控えて作業の後に、利用者が即時を指示した時はその場で、plugin repository の `steering` へ引き渡す routing skill とする。
- `scripts/verification/validate-plugin.mjs`: 書き換えた文の `requireText`（SKILL.md 3 文、`pending-escalations.md` 4 文、template 1 文）と、即時を既定とする旧い文の `forbidText`（SKILL.md 2 文、`pending-escalations.md` 1 文）を足す。見出しの順の検査の label を「起動後・repository判定前の保留判定」にする。
- release version を 9.1.2 から 9.1.3 へ上げる（PATCH。既存 skill の内容の修正で、consumer が新たに呼べるものは増えない）。宣言値 4 箇所と `expectedRelease` を一度に変える。

他の skill（steering、task-design、tasklist-executor、doc-enricher、maintenance-plugin-context）は、escalate を保留条件の再確認や提案の引渡し先として参照するだけで、即時か保留かの既定を書いていないため変えない。

---

## 要件（Requirements）

### MUST（必達）

- 利用者が即時を指示しない限り、改善の提案は元の作業の保留メモに保存され、元の作業は中断しない。
- 利用者が即時を指示した時は、今の即時の経路で引き渡す。
- 保留の保存・再確認・引渡し・受領の記録は、今の `pending-escalations.md` の仕組みをそのまま使う。
- validator が pass し、書き換えた文の assertion と、即時を既定とする旧い文が戻らないことの検査を持つ。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- issue #6 の残りの範囲（題名の「改善 in クラウドセッション」）は扱わない。既定を保留にするというこの作業の目的とは別の判断で、どちらに決まってもこの作業の完成後の姿は変わらない（`work_scope.md` の一段目で目的の外）。issue #6 は、その範囲のために open のまま残す。

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出す。新しい assertion の文を一つ消すと失敗する。
- 変更後の skill の文だけを読んで、次の四つの場面の扱いを一意に言える。
  - 指示が無い提案
  - 即時を指示された提案
  - 元の作業に保留メモを置けない提案
  - 直す規則に、今の作業の残りの工程が従う提案

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 保留した提案が、元の作業の完了後に引き渡されず残る | 既定の再開条件を元作業の既存完了判定に対応させ、元の担当（steering、task-design、tasklist-executor）が状態の遷移で再確認する今の仕組みを使う |
| 急ぎで直したい不備（今の作業を誤らせる skill の不備）まで保留される | 提案が直す規則に今の作業の残りの工程が従う時は、assistant が即時を勧める一問を出す。利用者が即時を指示すれば即時になる |
| 利用者が保留されたことに気付かず、即時を指示する機会を失う | 保留を保存した直後に、控えの場所と引き渡す時点を一行で知らせる |

---

## テスト方針

- assistant が、repository の root で `node scripts/verification/validate-plugin.mjs`、`node scripts/verification/test-task-design-handoff.mjs`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` を実行する。この session の開発機で使える。
- assistant が、新しい assertion の文を一時的に変えて validator が失敗することを確かめ、元に戻す。
- assistant が、変更した skill の file に document-review を当て、skill-update-review を編集後に当てる。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md`（9.1.2）: 「作業先を切り替える前の保留判定」で、明示保留があれば `pending-escalations.md` へ、無ければ即時の引渡しを続ける。「メモの存在や慣習だけで保留にしない」と書く。
- `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md`: 保留の保存（「この改善は後で」という個別保留と、「この作業中の改善は全部後で」という対象・期間付きの指示を扱う）、元担当の状態遷移からの再確認、再開条件の確認、現在の提案の引渡し、受領の記録を持つ。条件が「作業完了」なら元作業の既存完了判定が対応する。
- 元担当の再確認の依頼: steering（Step 3 と 6-1、6-2）、task-design（再開時と design phase の完了時）、tasklist-executor（再開時と task・phase の完了時）が、`pending-escalations.md` の「元担当の状態遷移から再確認する」を依頼する。
- `scripts/verification/validate-plugin.mjs`: escalate-plugin-skill-fix について、見出しの順（起動 gate → 作業先を切り替える前の保留判定 → plugin repository の判定）、`pending-escalations.md` の見出し、template の見出し等を検査している。

---

## （付録）変更の実行区分

### 設計中に反映を終えた変更

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` | description、「目的と成果」、「作業先を切り替える前の保留判定」を、既定の保留と即時の指示の判定、即時を勧める一問へ書き換えた | validator が pass。必須の文「即時の指示がなければ、既定どおり保留する。」を一時的に変えると失敗し、旧い文「保留指示がなければ即時引渡しを継続し、」を戻すと禁止項目で失敗した。どちらも戻すと pass。編集後の skill-update-review は候補なし | [変わる file](#変わる-file) |
| `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/pending-escalations.md` | h1、冒頭、「保留を保存する」、「元担当の状態遷移から再確認する」、「再開条件を確認する」を書き換えた。100 字を超える二文の行を句点で改行した | validator が pass（4 文の `requireText`、1 文の `forbidText`、既存の見出しの検査を含む） | 同上 |
| `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/templates/pending-escalation.md` | 「保留時の内容」の説明を、保留の根拠（保留指示の原文、または即時の指示が無かったこと）にした | validator が pass（`requireText` と既存の見出しの検査） | 同上 |
| `plugins/tumeda-dev/skills/README.md` | escalate-plugin-skill-fix の一行を、既定で保留する routing skill へ直した | validator が pass（既存の skill 名の検査） | 同上 |
| `scripts/verification/validate-plugin.mjs` | 上の assertion を足し、見出しの順の検査の label を直し、`expectedRelease` を 9.1.3 にした | pass | 同上 |
| release version（`.claude-plugin/marketplace.json` の 2 箇所、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`plugins/tumeda-dev/.codex-plugin/plugin.json`） | 9.1.2 から 9.1.3 へ上げた | validator の version 検査が pass。`test-task-design-handoff.mjs` が pass。`inspect-discussion.test.mjs` は 27 件中 pass 26、fail 0、skip 1 | 同上 |

### 設計中に反映する、他の判断を待っている変更

なし

### tasklist・roadmapに載せて実行する変更

なし（skill の文書と validator の変更で、合意済みの内容から一つの連続した反映と validation で完了した）
