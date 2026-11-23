# Design: skills 直下の共有リファレンスの分け方と置き場を見直す

## 元の依頼内容

起点: plugin repository の issue #26（「skills 直下の共有リファレンス（runtime-* 等）の分け方と置き場を見直す」）。直前の steering（`20261122-handle-user-reviewed-commands-in-auto-mode`）で切り出し、利用者が「ただ、直後にこのissue扱ってね」と指示した。

達成したいこと: `plugins/tumeda-dev/skills/` 直下の共有リファレンス（`runtime-execution-contracts.md`、`runtime-feedback-review.md`、`runtime-model-profiles.md`、`task-design-work-handoff-contracts.md` 等）の分け方と置き場を見直す。

issue の本文の事実と問い:
- `runtime-` の接頭辞が、性質の違う中身（実行時の契約、feedback の処理の手順、model の対応）をまとめている。`runtime-execution-contracts.md` は二つの対象（tasklist-executor の child 委譲の契約と、command を実行しうる skill の実行時一般の契約）を持つ。`runtime-feedback-review.md` は特定の skill（`facilitate-discussion`）を使う手順でもある。
- 問い: これらを skills の下に置くべきか、docs の群に置くべきか。接頭辞と分け方をどうするか。

利用者の原文（指摘の元）:

> あと、runtime-xx系多くない？ なんかfaciliate-disscussionに限定した記述もあるし、skillsにあるべきか悩むところもある

---

## TL;DR

`skills/` の直下に、skill ではない共有リファレンスが置かれている。`runtime-` の接頭辞は性質の違う中身をまとめており、一つの file が二つの対象を持ち、特定の skill だけが使う手順もある。読み手は名前から中身を受け取れず、新しい規則をどこへ足すかの判断も誤りやすい（直前の steering で、規則の置き場をこの file に誤って選びかけた）。文書の置き場を「これを変える担当は、一つの skill か」で決め直す。一つの skill が持つ契約と手順はその skill の中へ（child 委譲の契約は tasklist-executor、実装の feedback の手順は steering、作業の引継ぎの契約は task-design）、skill を横断する規範は docs の群へ置く。docs の群は名前と入口の説明で照合し、AI agent が実行環境に command を止められた時の規範は、どの群にも収まらないため新しい群 `agent_execution_standards/` を作って置く。plugin のどの skill にも効く model の対応表と、PR を作る script は plugin の直下へ置く。`skills/` の直下には skill の directory と README だけを残す（context の雛形は例外）。移すことは function migration に当たるため、文面を変えずに移す範囲はバイト一致で、文面が変わる範囲は意味単位で、移す前の意味を全量保つ。

---

## 完成後の姿

### 置き場の原則

文書の置き場を、「これを変える担当は、一つの skill か」で決める。

- 一つの skill が持つ手順・契約・雛形・対応表（他の skill が読んでも、変えるのはその skill）は、その skill の directory の内部に置く。他の skill は相対 path で参照する。変える時に同じ directory で済むためである。
- 複数の skill を横断するもの（どの skill も単独では持ち主にならない規範・契約・手順）は、`docs/` の群に置く。`.agents/skills/tumeda-dev-plugin-context.md` の「アーキテクチャ文書」の境界（skill は実行手順と ownership、docs は種別横断の規範）と同じ向きである。
- `skills/` の直下には、skill の directory と skills の索引（README）だけを置き、共有の文書は置かない。
- 名前は中身を表し、性質の違う中身をまとめる接頭辞（`runtime-` 等）を付けない。一つの file に持ち主または読み手が違う二つの対象があれば、file を分ける。
- script は文書ではないため、この原則の外で、行き先を個別に決める。

「実行時に使うか」で分ける軸（今の `runtime-`）は、持ち主も読み手も違う中身を混ぜるため採らない。「参照する skill の数」で分ける軸は、読む skill が多くても変えるのが一つの skill である中身（child 委譲の契約等）を共有物にしてしまうため採らない。

### `docs/common_standard/` の範囲

skill を横断するものを docs に置く時、「横断する」ことだけを理由に `common_standard/` へ置かない。`common_standard/` の範囲を次のとおりにし、`plugins/tumeda-dev/docs/README.md` の群の一覧に書く。

- 置くもの: 他の群（`development_standards/`、`documentation_standards/`、`think_standards/`）のどれか一つに収まらず、それら複数の群の作業（開発、文書、思考）に同じ形で効く規範。
- 置かないもの:
  - どれか一つの群に収まる規範。その群へ置く。
  - 特定の skill や工程にだけ効く手順・契約。その skill の中へ置く。
  - 「複数の skill が使う」ことだけを理由にした規範。使う場面が一つの群に収まるならその群へ、どの群にも収まらないなら、その主題の群を作るかを決める。
- 判断の問い: 「この規範は、既存の群のどれか一つに収まるか。収まらないなら、開発・文書・思考のどの作業にも同じ形で効くか」

今ある `function_migration_policy.md` は、code・skill・prompt・template・script・document のどれを移す時にも同じく効き、開発・文書のどちらの群にも収まらないため、この範囲に入る。範囲を書かずに置き場を都度決めると、「横断する」ことだけで置き場が決まり、`common_standard/` が他の群の受け皿になって太るため、範囲を書く。

### 新しい群 `docs/agent_execution_standards/` の範囲

AI agent に作業を実行させる時に、AI agent と、それを動かす実行環境（host の実行許可の仕組み、sandbox、分類器等）の性質から起きる、AI agent に特有の詰まり方への対処を置く。人も AI も従う開発・文書・思考の規範は、それぞれの既存の群に置く。

既存の群（`development_standards/`、`documentation_standards/`、`think_standards/`、`common_standard/`）は、どれも人も AI も従う作業の規範か、議論・思考の作法の群で、AI agent に特有の詰まり方を扱わない。実行環境 gate を、中身も群の範囲も言い直さずに照合すると、どれにも収まらなかったため作る。収録が一つの間は群の README を作らず、`docs/README.md` の群の一覧から file を直接指す。

### 置き場を選ぶ時の照合

置き場を既存の群・file から選ぶ時は、`naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」で照合する。この設計中に、実行環境 gate の置き場を三回続けて誤り（`common_standard/`、`development_flow/`、`think_standards/`）、次を同節と `docs/README.md` に足した（task-design-discussion.md の「照合の再発防止」の決定）。

- 範囲を決めるのは名前と入口の説明であり、既に入っている中身の一つを根拠に範囲を読み広げない。
- 中身の一面だけを取り出して、中身を他と区別している性質（誰に向けたものか、どの場面で効くか）を落とすことも言い直しである。照合の前に性質を含めて書き出し、候補が複数あり得る時は候補ごとに照合してから選ぶ。
- 一つの file で足りる主題も、収まる既存群が無ければ、言い直して収めず群を作るかを決める。

model の対応表の行き先と、skill の内部へ置く file の名前も、この照合で決めた。

### 決めた基準を、起点以外の case に当てた結果

| 基準 | 当てた case | 結果 |
| --- | --- | --- |
| 置き場の原則（変える担当が一つの skill か） | 移す六つの file と script | child 委譲の契約・実装の feedback の手順・作業の引継ぎの契約は持ち主の skill の中へ、gate は docs へ落ちる。context の雛形は symlink のため例外になり、script は文書でないため原則の外で決める |
| 置き場の原則 | task-design の「確認の担当と手段」にある、実行許可の画面を利用者が確かめる手段にしない規則 | 変える担当は task-design だけで、task-design の中に残る。AI agent に特有の規則でも、持ち主の skill が一つなら docs へ出さない |
| `common_standard/` の範囲 | `function_migration_policy.md`、実行環境 gate、model の対応表 | 一つ目は入る（どの群にも収まらず、code・skill・document のどれを移す時にも効く）。二つ目と三つ目は入らない |
| `agent_execution_standards/` の範囲 | 実行環境 gate、model の対応表、`think_standards/handling_errors.md` | 一つ目だけが入る。model の対応表は詰まり方への対処ではなく、エラーが出た時の作法は人も AI も従う思考の作法である |

### 各 file の行き先と名前

| 今の file | 中身 | 参照元 | 行き先 | 名前 |
| --- | --- | --- | --- | --- |
| `skills/runtime-execution-contracts.md`（118 行）のうち、child 委譲の契約 | tasklist-executor が visual-inspector・test-runner へ child を委ねる時の契約（状態の正本、停止理由、child の request・result、停止・再開、logical owner と physical launcher、repository context） | steering、tasklist-executor、visual-inspector、test-runner、`documentation_standards/referent_explicitness.md`、validator、`test-task-design-handoff.mjs` | `skills/tasklist-executor/` の内部。「停止理由」の `blocked` に、実行環境に止められた場合を含むことを書き、規範の本体の file を参照する | `execution-contracts.md` |
| 同じ file のうち、実行環境 gate | task level で実行してよいと判定したことは、実行環境が command を通すことを意味しない。止められたら迂回せず停止して利用者へ返す。特定の実行基盤に依存する手順を書かない | steering（6-1） | `docs/agent_execution_standards/` | `blocked_commands.md` |
| `skills/runtime-feedback-review.md`（44 行） | steering または tasklist-executor が実装の feedback を受けた時に、`facilitate-discussion` を `implementation_review.md` へ適用し、decision の戻り先を選ぶ手順 | steering、tasklist-executor、`development_flow/work_scope.md`、validator | `skills/steering/` の内部 | `implementation-feedback.md` |
| `skills/runtime-model-profiles.md`（46 行） | 推論強度の profile と、Claude Code・Codex の model への対応 | visual-inspector、test-runner、tasklist-executor、exhaustive-review、validator、repository の README | `plugins/tumeda-dev/` の直下。plugin のどの skill にも同じく効く、host ごとの model の選び方の取り決めで、host ごとの manifest（`.claude-plugin/`、`.codex-plugin/`）と同じ階層に置く | `model-profiles.md` |
| `skills/task-design-work-handoff-contracts.md`（56 行） | 進行中の design を別の task-design の実行が引き継ぐ時の契約 | task-design、validator、`test-task-design-handoff.mjs` | `skills/task-design/` の内部 | `work-handoff-contracts.md` |
| `skills/tumeda-dev-plugin-context.md` | 利用先 repository に置く context の雛形 | maintenance-plugin-context | 動かさない（原則の例外）。`.agents/skills` が `plugins/tumeda-dev/skills` への symlink で、この file は plugin repository 自身の context を兼ねる。例外である理由を skills の README に書く | 変えない |
| `skills/scripts/github/create_or_get_pr.sh` | PR を作る script | tasklist-executor、share-work-in-progress、task-design の tasklist-design と雛形、plugin repository の context（`scripts/for_local` の symlink） | `plugins/tumeda-dev/scripts/github/` | 変えない |

### 移す前の意味を保つこと

`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md` に従い、編集の前に baseline と二層 ledger を固定する（task-design-discussion.md の「意味を保つ確かめ方」の決定）。文面を一字も変えずに移す範囲は、節を一行として `MOVE` に分類し、baseline から切り出した範囲と移した後の範囲のバイト一致で確かめる。文面が変わる範囲だけを意味単位に分ける。

#### baseline

- revision: `main` の `dc6bf58`（9.1.4）。
- 方向: `plugins/tumeda-dev/skills/` の直下 → 下の構造 ledger の行き先。
- 移行の前に合意済みの変更: task-design-discussion.md の「置き場の原則」、「各 file の行き先」、「common_standard の範囲」、「gate の行き先」、「model の対応表の行き先」、「内部の file の名前」の決定（置き場、分け方、名前、H1）。規則そのものは変えない（非目標）。
- 移す file に依存している側: 下の「参照元の書き換え」の全行。

#### 構造 ledger

| ID | source（`dc6bf58` の `plugins/tumeda-dev/skills/`） | structural role | destination | classification | agreement |
| --- | --- | --- | --- | --- | --- |
| S1 | `runtime-execution-contracts.md` L1 | H1 | `skills/tasklist-executor/execution-contracts.md` の H1 | ADAPT（C1） | 「内部の file の名前」 |
| S2 | 同 L3 | 冒頭の説明（二つの対象） | 前半は同 file の冒頭、後半は `docs/agent_execution_standards/blocked_commands.md` の冒頭 | ADAPT（C2、C3） | 「置き場の原則」、「gate の行き先」 |
| S3 | 同 L5–11 | 節「状態の正本とsingle writer」 | `execution-contracts.md` の同名の節 | MOVE | — |
| S4 | 同 L12–24 | 節「停止理由」 | `execution-contracts.md` の同名の節。`blocked` の行だけ C4 | MOVE ＋ ADAPT（C4） | 「gate の行き先」 |
| S5 | 同 L25–54 | 節「Child request」 | `execution-contracts.md` の同名の節 | MOVE | — |
| S6 | 同 L55–76 | 節「Child result」 | 同上 | MOVE | — |
| S7 | 同 L77–94 | 節「停止・再開と二重起動防止」 | 同上 | MOVE | — |
| S8 | 同 L95–101 | 節「Logical ownerとphysical launcher」 | 同上 | MOVE | — |
| S9 | 同 L102–111 | 節「実行環境gate」 | `docs/agent_execution_standards/blocked_commands.md`。見出しは C5、第 3 段落は C4 で S4 へ、他の段落は本文として MOVE | ADAPT（C4、C5）＋ MOVE | 「gate の行き先」 |
| S10 | 同 L112–118 | 節「Repository context」 | `execution-contracts.md` の同名の節 | MOVE | — |
| S11 | `runtime-feedback-review.md` L1–44 | file 全体 | `skills/steering/implementation-feedback.md` | MOVE ＋ ADAPT（C6） | 「各 file の行き先」、「内部の file の名前」 |
| S12 | `runtime-model-profiles.md` L1 | H1 | `plugins/tumeda-dev/model-profiles.md` の H1 | ADAPT（C7） | 「model の対応表の行き先」、「内部の file の名前」 |
| S13 | 同 L2–46 | 本文（5 節） | `plugins/tumeda-dev/model-profiles.md` | MOVE | 「model の対応表の行き先」 |
| S14 | `task-design-work-handoff-contracts.md` L1–56 | file 全体（H1 を含む） | `skills/task-design/work-handoff-contracts.md` | MOVE（H1 は中身を表しているため変えない） | 「各 file の行き先」、「内部の file の名前」 |
| S15 | `scripts/github/create_or_get_pr.sh` | script 全体（実行権限を含む） | `plugins/tumeda-dev/scripts/github/create_or_get_pr.sh` | MOVE | 「各 file の行き先」 |
| S16 | `README.md` L45–54 | 節「共有リファレンス（skill ではない）」 | 下の X1・X2 | RETIRE ＋ ADD | 「置き場の原則」、「各 file の行き先」 |

移した file の中で、skill の root を起点に書かれた code span の path（`unattended-execution/SKILL.md`、`exhaustive-review/SKILL.md`、`facilitate-discussion/resolve-discussion.md` 等）は、skill の名前で引く書き方として、文面を変えずに残す。`work-handoff-contracts.md` の `scripts/extract-handoff-input.mjs` は、`task-design/` の中へ移すことで、書かれた path のまま実在の file を指すようになる。

#### contract ledger（文面が変わる範囲）

| ID | source | kind | 移す前 | 移した後 | classification | agreement |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | S1 | 見出し | `# Runtime execution contracts` | `# Execution contracts` | ADAPT | 「置き場の原則」（性質の違う中身をまとめる `runtime-` を付けない）、「内部の file の名前」 |
| C2 | S2 前半 | 対象 | この file は二つの対象を持つ。ひとつはtasklist-executorがvisual-inspector / test-runnerへchild処理を委譲する時の、hostに依存しない共通契約。 | tasklist-executorがvisual-inspector / test-runnerへchild処理を委譲する時の、hostに依存しない共通契約である。commandを実行しうる任意のskillが従う、実行環境に止められた時の規範は[`blocked_commands.md`](../../docs/agent_execution_standards/blocked_commands.md)が持つ。 | ADAPT | 「置き場の原則」（file を分ける）、「gate の行き先」 |
| C3a | S2 後半 | 対象（誰が従うか） | もうひとつは、command を実行しうる任意のskill（`tasklist-executor`、`steering`のBlocker resolution、`task-design`の技術検証実装等）が共通して従う、実行時一般の契約である。 | `blocked_commands.md` の冒頭: この規範には、command を実行しうる任意のskill（`tasklist-executor`、`steering`のBlocker resolution、`task-design`の技術検証実装等）が共通して従う。 | ADAPT | 「gate の行き先」 |
| C3b | S2 後半 | 理由（置き場） | command を実行しうるのは`tasklist-executor`だけではないため、実行時契約はこのfileが持つ。 | （置かない） | CHANGE | 「gate の行き先」（置き場を docs の新しい群に決めた。理由は task-design-discussion.md の「置き場の原則」、「gate の行き先」の決定 が持つ） |
| C4 | S9 第 3 段落 | 対応（停止理由） | この事象は、上記「停止理由」の`blocked`（必須入力・外部状態・権限が不足している）に該当する。実行環境がcommandを止めることは、権限が不足している状態の一種である。 | `execution-contracts.md` の「停止理由」の `blocked` の行: - `blocked`: 必須入力・外部状態・権限が不足している。実行環境にcommandを止められた場合も、権限が不足している状態の一種としてこれに当たる（[`blocked_commands.md`](../../docs/agent_execution_standards/blocked_commands.md)）。 | ADAPT | 「gate の行き先」 |
| C5 | S9 見出し | 見出し | `## 実行環境gate` | `# 実行環境に止められた command` | ADAPT | 「gate の行き先」（file 名 `blocked_commands.md`） |
| C6 | S11 L25 | 参照 | [`work_scope.md`](../docs/development_standards/development_flow/work_scope.md) | [`work_scope.md`](../../docs/development_standards/development_flow/work_scope.md) | ADAPT | 「各 file の行き先」 |
| C7 | S12 | 見出し | `# Runtime model profiles` | `# Model profiles` | ADAPT | 「置き場の原則」、「model の対応表の行き先」、「内部の file の名前」 |

`blocked_commands.md` の本文は、S9 の第 1・2・4 段落を文面を変えずに置く（第 4 段落の「このfileへ書かない」は、移した後の file を指す）。

#### 参照元の書き換え（ADAPT）

| ID | file と位置 | 移す前 | 移した後 |
| --- | --- | --- | --- |
| R1 | `skills/steering/SKILL.md` 6-1 | `runtime-execution-contracts.md`の「実行環境gate」に従う | [`blocked_commands.md`](../../docs/agent_execution_standards/blocked_commands.md)に従う |
| R2 | 同 6-1 の後（停止理由） | `runtime-execution-contracts.md`が定める停止理由 | `tasklist-executor/execution-contracts.md`が定める停止理由 |
| R3 | 同（状態の正本） | 根拠は`runtime-execution-contracts.md`の`状態の正本とsingle writer` | 根拠は`tasklist-executor/execution-contracts.md`の`状態の正本とsingle writer` |
| R4 | 同「実装完了後review」 | [共通の実装feedback処理](../runtime-feedback-review.md) | [共通の実装feedback処理](implementation-feedback.md) |
| R5 | `skills/tasklist-executor/SKILL.md` L40 | `../runtime-execution-contracts.md`を正本とし、…`../runtime-model-profiles.md`の`delegated-execution` | `execution-contracts.md`を正本とし、…`../../model-profiles.md`の`delegated-execution` |
| R6 | 同 L56 | pluginのskills directory直下の共用配置 `scripts/github/create_or_get_pr.sh` | pluginの直下の共用配置 `scripts/github/create_or_get_pr.sh` |
| R7 | 同 L161 | `../runtime-feedback-review.md` | `../steering/implementation-feedback.md` |
| R8 | `skills/visual-inspector/SKILL.md` L34、`skills/test-runner/SKILL.md` L30 | `../runtime-execution-contracts.md`を正本とし、…`../runtime-model-profiles.md` | `../tasklist-executor/execution-contracts.md`を正本とし、…`../../model-profiles.md` |
| R9 | `skills/exhaustive-review/SKILL.md` L19 | [runtime-model-profiles.md](../runtime-model-profiles.md) | [model-profiles.md](../../model-profiles.md) |
| R10 | `skills/share-work-in-progress/SKILL.md` L59・L62 | `../scripts/github/create_or_get_pr.sh`を呼ぶ。…script pathの起点はpluginのskills directoryである。 | pluginの直下の`scripts/github/create_or_get_pr.sh`を呼ぶ。…script pathの起点はpluginの直下である。（利用先repositoryからの相対pathではない、は変えない） |
| R11 | `skills/task-design/SKILL.md` L463 | [`task-design-work-handoff-contracts.md`](../task-design-work-handoff-contracts.md) | [`work-handoff-contracts.md`](work-handoff-contracts.md) |
| R12 | `skills/task-design/templates/tasklist.md` L146 | pluginのskills directory配下にある `scripts/github/create_or_get_pr.sh` | pluginの直下にある `scripts/github/create_or_get_pr.sh` |
| R19 | 同 L147 | pathの起点はpluginのskills directoryである。 | pathの起点はpluginの直下である。（反映後の white-box の逆方向の照合で、旧い起点の語を grep して見つけた。R12 と同じ合意で、利用先repositoryからの相対pathではない、は変えない） |
| R13 | `docs/development_standards/development_flow/work_scope.md` L22 | `skills/runtime-feedback-review.md` | `skills/steering/implementation-feedback.md` |
| R14 | `docs/documentation_standards/referent_explicitness.md` L51・L52 | `runtime-execution-contracts.md` の1箇所、`runtime-execution-contracts.md` の `Repository context` 節 | `tasklist-executor/execution-contracts.md` の1箇所、`tasklist-executor/execution-contracts.md` の `Repository context` 節 |
| R15 | repository の `README.md` L10 | `plugins/tumeda-dev/skills/runtime-model-profiles.md` | `plugins/tumeda-dev/model-profiles.md` |
| R16 | `.agents/skills/tumeda-dev-plugin-context.md` L41 | pluginのskills directory直下の共用配置 `skills/scripts/github/create_or_get_pr.sh` | pluginの直下の共用配置 `scripts/github/create_or_get_pr.sh` |
| R17 | plugin repository の `scripts/for_local/github/`（`.gitignore` の対象の symlink） | `plugins/tumeda-dev/skills/scripts/github/create_or_get_pr.sh` を指す | `plugins/tumeda-dev/scripts/github/create_or_get_pr.sh` を指すよう張り替える |
| R18 | `scripts/verification/validate-plugin.mjs`、`scripts/verification/test-task-design-handoff.mjs` | 旧 path の読取と assertion | 新 path へ向け直す。旧 path の file が無いことを `requireAbsent` で検査し、C2・C4・X1〜X3 の文に `requireText` を足す |

`skills/task-design/tasklist-design.md` L153 の `scripts/github/create_or_get_pr.sh` は、起点を書いていないため変えない。

#### README の索引（RETIRE と ADD）

| ID | file | 中身 | classification | agreement |
| --- | --- | --- | --- | --- |
| X1 | `skills/README.md` | 節「共有リファレンス（skill ではない）」を消す。各行が説明していた file は、移した先の file と下の索引が説明する。script の行の「`SKILL.md` を持たないため、loader も validator も skill として拾わない」は、script が `skills/` の外へ出るため要らなくなる | RETIRE | 「置き場の原則」（直下に共有の文書を置かない）、「各 file の行き先」（script を plugin の直下へ） |
| X2 | `skills/README.md` | 新しい節「skills の直下に置くもの」: `skills/` の直下には skill の directory とこの README だけを置く。一つの skill が持つ手順・契約・雛形・対応表はその skill の directory の中へ、複数の skill を横断する規範は `docs/` の群へ置く。例外は `tumeda-dev-plugin-context.md`（利用先 repository に置く context の雛形）で、plugin repository の `.agents/skills` が `plugins/tumeda-dev/skills` への symlink のため、この file は plugin repository 自身の context を兼ねる。`maintenance-plugin-context` は雛形を plugin の `skills/` の直下から読む | ADD | 「置き場の原則」、「各 file の行き先」（例外の理由を skills の README に書く） |
| X3 | `docs/README.md` | 見出し「5群への入口」を「6群への入口」にする。`common_standard/` の行の下に、範囲（置くもの、置かないもの、判断の問い）を書く。`agent_execution_standards/blocked_commands.md` の行を足す（範囲: AI agent に作業を実行させる時に、AI agent と、それを動かす実行環境の性質から起きる、AI agent に特有の詰まり方への対処。人も AI も従う開発・文書・思考の規範は、それぞれの群に置く） | ADD | 「common_standard の範囲」、「gate の行き先」 |
| X4 | `docs/README.md` | `development_standards/` の行の説明「命名規約とエンティティ設計の判断基準」を、群の README の入口の説明に合わせて「開発にまつわる標準（命名、エンティティ設計、開発の進め方、基盤）」に直す | 訂正（移行の外。下の「目的の外で気づいた不備」） | design 全体への合意 |

#### white-box 検証と完了集計

- 順方向: S1〜S16 の全行について、移した後の範囲がバイト一致するか、C・R・X の行があることを確かめる。
- 逆方向: `git diff` の削除行と追加行を一行ずつ、S・C・R・X の行へ対応付ける。
- 境界: steering の 6-1 と停止理由の参照、tasklist-executor・visual-inspector・test-runner からの child 委譲の契約の参照、task-design の handoff gate、validator と test script の assertion が、移した後の file を指して同じ判断になるかを読む。
- 完了集計（反映の後）: `適合 41 / 合意済み追加 2 / 合意済み変更 2 / 明示廃止 1 / 未監査 0 / 未分類削除 0 / 未分類追加 0`。
  - 適合: S1〜S15（S16 は X1・X2 で数える）、C1・C2・C3a・C4〜C7、R1〜R19。
  - 合意済み追加: X2、X3。合意済み変更: C3b、X4。明示廃止: X1。
  - 順方向: S3・S5〜S8・S10 は baseline の行範囲が `execution-contracts.md` にそのまま含まれ、S13（L2–46）・S14・S15 はバイト一致した（S15 は実行権限も保った）。S4・S11 は C4・C6 の一行だけが変わり、S9 の第 1・2・4 段落は `blocked_commands.md` に文面のまま入った。
  - 逆方向: `git diff -M` の削除行と追加行をすべて S・C・R・X の行へ対応付けた。この照合で、`skills/task-design/templates/tasklist.md` L147 の「pathの起点はpluginのskills directoryである。」が ledger に無いことを見つけ、R19 として足して直した。
  - 境界: steering の 6-1 と停止理由・状態の正本の参照、tasklist-executor・visual-inspector・test-runner からの child 委譲の契約と model の対応表の参照、tasklist-executor から実装の feedback の手順への参照、task-design の handoff gate から作業の引継ぎの契約への参照が、移した後の file を指すことを、相対 link の実在の照合で確かめた。`work-handoff-contracts.md` の `scripts/extract-handoff-input.mjs` は、`task-design/` の中から実在の file を指すようになった。
  - R17: plugin repository の `scripts/for_local/github` の symlink は、反映の前から無かった。`plugins/tumeda-dev/scripts/github` を指す symlink を作った（`.gitignore` の対象）。

### 目的の外で気づいた不備

この作業の目的（共有リファレンスの置き場と名前）の外で気づいた不備を、`plugins/tumeda-dev/docs/development_standards/development_flow/work_scope.md` の二段目で扱う。

| 不備 | 扱い | 理由 |
| --- | --- | --- |
| skill-update-review（設計時）の候補: steering の「Blocker resolution」「Standalone roadmapの昇格」、Step 1 の前月 summary の生成、task-design の「8. このスキル自体の更新について」が、固有の判断・状態・完了条件・改訂理由を持ったまま `SKILL.md` にある | issue #27 へ切り出した。steering の候補は #11（steering の役割と名前の見直し）の結論に依存する | 共有の文書の置き場の変更と、skill の中の工程の分割が一つの release に混ざり、片方だけを戻せなくなる。工程ごとに分けるかの判断も要る |
| `docs/README.md` の `development_standards/` の行の説明が古い（`development_flow/` と `infrastructure/` を含まない） | この作業で拾う（X4） | 同じ file の群の一覧を直す作業に含めても、review・revert・本番適用の単位が崩れない |
| `skills/maintenance-plugin-context/maintenance_policies/` の入口の説明（このpluginのskill保守で従う規約）が、持ち主の skill の名前と説明（repository context、作業限定の暫定指示、配布version規約）より広い。`AGENTS.md` と root の `docs/maintenance_policies`（symlink）がここを plugin の保守の規約の置き場として扱う | issue #28 へ切り出した | skill の範囲を広げるか置き場を変えるかの判断が要り、この作業に含めると review の単位が崩れる |
| plugin repository の context（`.agents/skills/tumeda-dev-plugin-context.md`）が配布する雛形と同じ file のため、この repository に固有の記載（`doc-enricher` の置き場所の一覧等）を保存すると利用先へ配布される | issue #29 へ切り出した | 雛形と instance の分け方の設計が要る。この作業では雛形を動かさない（「各 file の行き先」） |

---

## 要件（Requirements）

### MUST（必達）

- 移す file の挙動と意味を、合意した変更を除いて全量保つ（`function_migration_policy.md`）。
- 参照元（skill、docs、validator、test script）の path を、移した後の場所へ直す。参照切れを残さない。
- validator と `test-task-design-handoff.mjs` が pass する。
- release version を PATCH で上げ、9.1.5 にする（宣言値 4 箇所と validator の `expectedRelease`）。新しく呼べるもの（skill、parameter）は増えず、以前の版の skill が作った成果物の見出し・label も変えない。旧い path に転送用の file は残さない（task-design-discussion.md の「version の上げ方」の決定）。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- 共有リファレンスの中身（規則そのもの）を変えること。分け方と置き場と名前だけを変える。
- steering と task-design の `SKILL.md` の中の工程を、内部指示へ分けること。この作業の目的の外で、issue #27 へ切り出した。
- `maintenance-plugin-context/maintenance_policies/` の範囲を、持ち主の skill に合わせること。issue #28 へ切り出した。
- plugin repository の context と、配布する context の雛形を分けること。issue #29 へ切り出した。この作業では雛形を `skills/` の直下に残す。

### 受け入れ基準

- `plugins/tumeda-dev/skills/` の直下に、skill の directory、`README.md`、`tumeda-dev-plugin-context.md` 以外の file と directory が無い。
- 旧い path（`skills/runtime-execution-contracts.md`、`skills/runtime-feedback-review.md`、`skills/runtime-model-profiles.md`、`skills/task-design-work-handoff-contracts.md`、`skills/scripts/`）に file が無く、`.steering/` を除く repository 全体の grep で、旧い path と「実行環境gate」への参照が 0 件である。
- white-box 検証の完了集計が `未監査 0 / 未分類削除 0 / 未分類追加 0` である。
- `node scripts/verification/validate-plugin.mjs`、`node scripts/verification/test-task-design-handoff.mjs`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` が pass する。
- `skill-update-review`（設計時・編集後）の結果が保存され、候補ごとに今切り出したか別の作業にしたかが記録されている。
- release version が 9.1.5 で、`main` へ入れた後、この環境の plugin が update され、`installed_plugins.json` の `gitCommitSha` が `main` と一致する。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 移す時に、理由・例外・失敗例が落ちる | function migration の ledger と white-box 検証で、移す前の意味の単位をすべて照合する |
| 参照切れ（skill の本文、docs、validator、test script） | 移した後に、旧い path を repository 全体で grep し、0 件を確かめる |

---

## テスト方針

- assistant が、`node scripts/verification/validate-plugin.mjs`、`node scripts/verification/test-task-design-handoff.mjs`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` を実行する。
- assistant が、function migration の white-box 検証（順方向・逆方向・境界の照合）を、[移す前の意味を保つこと](#移す前の意味を保つこと)の ledger の全行について行う。
- assistant が、反映した docs と skill の文書（`blocked_commands.md`、`execution-contracts.md`、`model-profiles.md`、`skills/README.md`、`docs/README.md`）に `document-review` を当てる。文面を変えずに移した範囲は、移す前の版で review 済みとして扱い、変えた範囲を見る。
- assistant が、反映の後に `skill-update-review`（編集後）を tasklist-executor・steering・task-design に当て、結果を task-design-discussion.md の「切り出し」の決定の続きへ保存する。
- `main` へ入れた後、assistant が marketplace と plugin を update して `installed_plugins.json` の `gitCommitSha` を `main` と照合する。実行中の session への反映は、利用者が `/reload-plugins` を打つ。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/skills/README.md` の「共有リファレンス（skill ではない）」: 「直下に置く、skill 本文から参照される host 非依存の共通ドキュメントと script」。
- `.agents/skills/tumeda-dev-plugin-context.md` の「アーキテクチャ文書」: skill 本体と docs の責務境界は、skill が実行手順と ownership、docs が種別横断の規範を持つ。
- `plugins/tumeda-dev/docs/README.md`: docs の 5 群。群は主題単位で、一つの file で足りる主題は、収まる既存群があればその群へ置き、収まる群が無ければ群を作るかを決める（後者はこの設計中に照合の再発防止として足した）。
- `plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`: file の移動・分割・rename は function migration であり、baseline、二層 ledger、合意 gate、white-box 検証、完了 gate を持つ。

---

## （付録）変更の実行区分

### 設計中に反映を終えた変更

| 対象 | 反映した内容 | validation | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/docs/development_standards/naming/core.md`、`plugins/tumeda-dev/docs/README.md`、`scripts/verification/validate-plugin.mjs` | 置き場を選ぶ時に、中身または置き先の範囲を言い直して収めてしまう誤りの再発防止（task-design-discussion.md の「照合の再発防止」の決定） | validator と handoff test が pass。足した assertion が文の変更で落ちることを確かめた。`document-review` の指摘なし | [置き場を選ぶ時の照合](#置き場を選ぶ時の照合) |
| 各 file の移動・分割・rename、参照元の書き換え、README の索引（構造 ledger S1〜S16、C1〜C7、R1〜R19、X1〜X4）、release version 9.1.5 | [移す前の意味を保つこと](#移す前の意味を保つこと)の ledger のとおり | validator、handoff test、inspect-discussion test が pass。足した assertion（旧い path が無いこと、`blocked_commands.md` と `execution-contracts.md` と README の文、PR を作る script の起点）が文の変更や旧い file の再作成で落ちることを確かめた。white-box 検証の完了集計は未監査・未分類 0。`document-review` で二件を直した（`blocked_commands.md` の冒頭に「この規範には」を足して何に従うかを示し、`docs/README.md` の群の行から「今は、」を外した）。`skill-update-review`（編集後）の候補は設計時と同じ | [移す前の意味を保つこと](#移す前の意味を保つこと)、[目的の外で気づいた不備](#目的の外で気づいた不備) |

### 設計中に反映する、他の判断を待っている変更

なし

### tasklist・roadmapに載せて実行する変更

なし。この作業は skill と docs の文書、検査 script、PR を作る script の配置の変更で、本番の application の coding、実行時に段階を踏む作業、利用者が指定した作業のいずれにも当たらない（task-design の Step 5）。function migration の段階（baseline → ledger → 移動 → white-box 検証）は task-design の中で順に行う。
