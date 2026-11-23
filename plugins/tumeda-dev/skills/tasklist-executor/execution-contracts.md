# Execution contracts

tasklist-executorがvisual-inspector / test-runnerへchild処理を委譲する時の、hostに依存しない共通契約である。tasklist-executorを起動する側が守る約束（「起動する側が行うこと」）もここに置き、その唯一の例外であるBlocker resolutionは[`blocker-resolution.md`](blocker-resolution.md)に分けて置く。commandを実行しうる任意のskillが従う、実行環境に止められた時の規範は[`blocked_commands.md`](../../docs/agent_execution_standards/blocked_commands.md)が持つ。

## 状態の正本とsingle writer

- taskの完了状態の正本はtasklistの`[ ]` / `[x]`である。
- child処理の状態の正本はrequest / result artifactである。session memoryを正本にしない。
- tasklist、DoD判定、checkbox、child結果の転記を更新できるのはtasklist-executorだけである。
- visual-inspector / test-runnerはtasklistと実装を変更しない。実測結果と証跡だけをresultへ返す。

## 停止理由

executorは停止時に次のいずれかを返す。

- `completed`: 全taskとDoDが完了した。
- `phase_checkpoint`: 合意されたPhase境界まで完了した。
- `delegation_required`: requestを作成し、physical launcherによるchild起動または完了を待つ。
- `user_confirmation_required`: tasklistが要求するユーザー動作確認を待つ。
- `blocked`: 必須入力・外部状態・権限が不足している。実行環境にcommandを止められた場合も、権限が不足している状態の一種としてこれに当たる（[`blocked_commands.md`](../../docs/agent_execution_standards/blocked_commands.md)）。
- `limit_reached`: 利用上限へ達した。完了済みtask、pending request/result、次の未完了taskを返す。

`completed`以外は「全完了」を意味しない。停止までに実測完了したtaskだけを`[x]`へ更新する。

## Child request

executorが作成するrequestは次を必須とする。

```json
{
  "request_id": "phase-2-task-3-visual-1",
  "kind": "visual-inspector",
  "tasklist": ".design-records/example/tasklist.md",
  "task": "phase-2-task-3",
  "attempt": 1,
  "artifact_directory": "artifacts/phase-2-task-3/",
  "status": "requested",
  "checks": [
    {
      "operation": "対象操作",
      "expected": "期待する結果"
    }
  ],
  "dod": [
    "tasklistの対応する完了条件"
  ]
}
```

- `request_id`はworkflow内で一意かつ再開後も不変とする。
- `kind`は`visual-inspector`または`test-runner`とする。
- `attempt`は1以上の整数とし、同じ試行を再起動するために増やさない。
- `artifact_directory`にはscript、screenshot、詳細result等の証跡をまとめる。

## Child result

childが作成するresultは次を必須とする。

```json
{
  "request_id": "phase-2-task-3-visual-1",
  "attempt": 1,
  "status": "passed",
  "artifact_directory": "artifacts/phase-2-task-3/",
  "result": "artifacts/phase-2-task-3/result.md",
  "summary": "executorがDoDを判定できる実測結果"
}
```

- `request_id`と`attempt`は対応するrequestと一致させる。
- `status`は`passed`、`failed`、`blocked`のいずれかとする。
- `passed`は全checksを実測できた時だけ返す。
- `failed`は実測結果が期待値またはDoDを満たさない時に返す。
- `blocked`は必須入力・環境・権限が不足し、実測できない時に返す。
- childはtask完了を決定しない。`passed`でもexecutorがDoDを判定し、`failed` / `blocked`では対応taskを`[ ]`のまま維持する。

## 停止・再開と二重起動防止

executorは再開時に最初の`[ ]`を選び、対応するrequest / result artifactを次の順で確認する。

1. resultがある:
   - request ID、attempt、status、必須fieldを検証する。
   - resultを消費してDoDを判定し、childは再起動しない。
   - `failed` / `blocked`ならtaskを未完了のままにし、修正または入力要求へ戻る。
2. requestがありresultがない:
   - 同じrequestをpendingとして返し、新しいrequestやattemptを作らない。
   - physical launcherは同じrequest IDのchildを完了させる。
3. requestがない:
   - 新しいrequest IDを作り、`delegation_required`で停止できる。

Phase checkpoint、user confirmation、blocked、limitで停止しても、tasklistとartifactから同じ判定を再構築する。

明示された不在・応答不能中の自走では`unattended-execution/SKILL.md`を適用できる。保留後に独立作業を進めても、元workflowのowner、停止状態、single writerは変わらず、拒否操作の実行やblocker解消を偽装しない。

## Logical ownerとphysical launcher

- logical ownerはtasklist-executorである。委譲要否、request、result消費、DoD、tasklist更新を所有する。
- physical launcherはhost adapterである。指定されたchildの起動、完了待ち、result到達だけを担い、tasklistやresult内容を解釈しない。
- Codexでは直近parentがchildを起動し、完了まで待つ。parentはrequestをpromptへ渡し、child resultをlogical ownerへ返す。
- agent由来の3skillはfrontmatterに`context: fork`を保持する。これは宣言の静的契約であり、特定hostのruntime動作をこの文書の受け入れ条件にはしない。

## Repository context

repository固有のapp URL、authentication、test / lint command、artifact root、browser helper、setup / run command、result template、permissionは、`maintenance-plugin-context`が`<repository root>/.agents/skills/tumeda-dev-plugin-context.md`から解決して返す。共通skill本文とrequest fixtureへ固定しない。

同fileに該当項目が無い場合は、推測せず利用者へ確認する。確認するまでchild処理を実行しない。test commandやapp URLが分からないまま検証taskを省くと、検証して通ったのか検証できなかったのかが成果物の上で区別できなくなるためである。

利用者の回答は`maintenance-plugin-context`が同fileへ書き戻す。否定の回答もfactとして記載する。書き戻すことで、同じrepositoryで二度目以降の確認が不要になる。

## 起動する側が行うこと

`tasklist-executor`を起動する側（利用者の会話のagent、`advance-roadmap`）が守る約束である。どの担当が起動しても同じ約束で扱う。起動するのは、task-designの[`wrap-up.md`](../task-design/wrap-up.md)の「実行を始めてよいかを確かめる」で利用者の明示確認を得た後だけである。

### 起動する

tasklist-executorへ`tasklist.md`と同階層の`design.md`の絶対pathを渡す。

- tasklist-executorだけをtasklistのsingle writerとする。
- task、subtask、phaseを実測完了した直後に`[x]`へ更新させ、最後にまとめて更新させない。
- tasklist-executorは親roadmapを探索・更新せず、完了resultだけをcallerへ返す。
- tasklist内のユーザー動作確認が完了する前にcommit、push、PRへ進ませない（確認環境へ載せるために`UI確認環境`が定めるcommit・pushと、作業の外へ残るactionを含むphaseの最後のcommit・pushを除く）。push・PR前にはlocal commitが実際に一件以上存在することを確認する。
- 利用者が合意したcommand（tasklistで合意した取り返しのつかない操作等）をtasklist-executorに実行させる時は、利用者の合意の原文と、合意したcommandの一覧をそのまま渡す。実行環境は利用者の意図を判断に使うことがある。例えば、Claude Codeのauto modeの分類器は、破壊的な操作の既定の制止を利用者の意図で解く。利用者がまだ与えていない承認や、「利用者が実行許可の画面で見る」のようなまだ起きていない確かめを、指示に事実として書かない。それでも実行環境に止められた時の扱いは[`blocked_commands.md`](../../docs/agent_execution_standards/blocked_commands.md)に従う。

### 止まって返ってきた時に読み直す

executorがどの停止理由で返しても、返却resultだけで次の判断をしない。この手順は[Blocker resolution](blocker-resolution.md)の一部ではない。起動先の停止はそれ自体では`blocker`ではなく、この文書が定める停止理由のうち`delegation_required`、`user_confirmation_required`、`phase_checkpoint`は起動する側の手順が想定する正常停止であるため、停止理由で分岐させず全停止理由で常に行う。

- `tasklist.md`のcheckboxと、task配下にexecutorが書き残したnoteを読む。
- `artifact_directory`にrequest / result artifactがあれば読む。
- 読んだ内容が`design.md`と食い違う場合、実装を進める前に下の「実装後のfeedback」へ回す。

根拠はこの文書の`状態の正本とsingle writer`にある。taskの完了状態の正本はtasklistの`[ ]` / `[x]`、child処理の状態の正本はrequest / result artifactと定められ、返却resultはこの列挙に含まれない。

### 実装後のfeedback

実装、review、validation、ユーザー動作確認でfeedback・漏れ・追加要件・不具合が判明したら、
直接受領した担当が[共通の実装feedback処理](implementation-feedback.md)を読み、pluginの`facilitate-discussion`を明示適用する。
起動する側が直接受領した場合は起動する側自身が行い、次の入力を渡す。

```text
discussion_directory=<tasklist.mdがある設計の記録のdirectory>
discussion_file_name=implementation_review.md
```

共通指示が所有する原文保存・原因確認・合意・decision後のroutingを終えてから、返された先のphaseへ戻る。
feedbackを記録せず直接designへ戻したり、実装を自動再開したりしない。

### 段取りの議論

tasklistを実行する段取り（起動、再開位置、止まった後の進め方）について記録価値のある思考が生じた時、またはユーザーへ段取り上の問いを出そうとしている時は、起動する側が`discussion_directory=<tasklist.mdがある設計の記録のdirectory>`を渡してpluginの`facilitate-discussion`を明示適用し、`discussion.md`へ記録する。議論だけを別child agentへ再委譲しない。設計上の曖昧さや方向性はtask-designへ渡す。`discussion.md`の使い方の詳細は[`advance-roadmap/SKILL.md`](../advance-roadmap/SKILL.md)の「段取りの議論（discussion.md）」と同じである。

### 完了を確かめた時

tasklist-executorが`completed`を返し、読み直しで全taskの`[x]`と、tasklistが定める利用者の確認の完了を確かめたら、元作業全体の完了として扱う。

保留したplugin改善のメモは、再開条件が成り立ちうる状態遷移の時だけ確かめ直す（[保留条件の再確認](../escalate-plugin-skill-fix/pending-escalations.md#元担当の状態遷移から再確認する)）。
起動する側が依頼するのは、元作業全体を完了する時だけであり、元作業の場所と完了記録・実証拠を`escalate-plugin-skill-fix`へ渡す。
executorの停止時、作業の再開時には依頼しない。返却resultだけで成立を通知しない。暫定指示の管理への通知や追加承認とは区別する。
`advance-roadmap`が起動した時は、完了を`advance-roadmap`へ返し、phaseの完了として扱わせる。

### 起動する側が絶対にやらないこと

- 許可なくtasklistを実行する。task-designの`wrap-up.md`で利用者の明示確認を得る前に`tasklist-executor`を起動しない。
- tasklist合意前に実装し、ユーザー動作確認前にcommit、push、PRを行う（確認環境へ載せるために`UI確認環境`が定めるcommit・pushと、作業の外へ残るactionを含むphaseの最後のcommit・pushを除く）。push・PR前にはlocal commitが実際に一件以上存在することを確認する。
- 返却resultだけで次の判断をする。
- 起動する側自身が実装codeを変更する。唯一の例外は[Blocker resolution](blocker-resolution.md)であり、その成立条件と手順は同fileが持つ。

### Blocker resolution

`tasklist-executor`が`blocked`で返り、起動する側の手順の内側では復旧できない時と、起動する側が自分の手順（`advance-roadmap`の「phaseを進める手順」を含む）で実行の前提が崩れて進めなくなった時は、[`blocker-resolution.md`](blocker-resolution.md)を読んで従う。手順を離れて自ら手を動かしてよい唯一の例外であり、成立する条件と手順は同fileが持つ。
