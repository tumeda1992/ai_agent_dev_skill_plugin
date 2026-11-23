# Execution contracts

tasklist-executorがvisual-inspector / test-runnerへchild処理を委譲する時の、hostに依存しない共通契約である。tasklist-executorを起動する側が守る約束（「起動する側が行うこと」）もここに置く。commandを実行しうる任意のskillが従う、実行環境に止められた時の規範は[`blocked_commands.md`](../../docs/agent_execution_standards/blocked_commands.md)が持つ。

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

executorがどの停止理由で返しても、返却resultだけで次の判断をしない。この手順は`Blocker resolution`の一部ではない。起動先の停止はそれ自体では`blocker`ではなく、この文書が定める停止理由のうち`delegation_required`、`user_confirmation_required`、`phase_checkpoint`はFlowが想定する正常停止であるため、停止理由で分岐させず全停止理由で常に行う。

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
- 起動する側自身が実装codeを変更する。唯一の例外は`Blocker resolution`であり、その成立条件と手順は同節が持つ。

### Blocker resolution

起動する側が自ら手を動かしてよいのは、Flowが前提とする実行条件が崩れ、Flowの内側では復旧できなくなった`blocker`を解消するときだけである。ここでいうFlowは、起動する側の手順（`tasklist-executor`の起動、止まって返ってきた時の扱い、完了の確認）と、`advance-roadmap`の「phaseを進める手順」である。この行為を`resolve-blocker`と呼ぶ。

`blocker resolution`はFlowに対して並行して存在する経路であり、Flowの一部ではない。任意のstepから離脱し、同じstepへ戻る。

```text
起動 → 止まった時の扱い → 完了の確認   （advance-roadmapでは phaseの選択 → … → 伝播）
  │            │                │
  └────────────┴────────────────┘
                      実行条件が崩れる
                            │
                            ▼
              ┌──────────────────────────┐
              │ blocker resolution        │
              │ （Flowの外側）            │
              │  確認 → 復旧行為 → 回復確認 │
              └──────────────────────────┘
                            │
                     実行条件が回復
                            │
                            ▼
                 離脱したstepの先頭へ戻る
```

stepとして番号を与えない。実行条件の崩壊は`tasklist-executor`が`blocked`で返った時に限らず、`advance-roadmap`のphaseの間でも起こり得るため、特定stepの後続として置けない。また`advance-roadmap`の手順は「順序固定」であり、条件分岐のstepを挿すとその性質が崩れる。

#### 例外が成立する2条件

例外が成立する条件は次の2つがともに満たされることであり、片方だけでは成立しない。

- 設計を尽くした後である。designが合意され、tasklistが合意され、実行に入っている
- Flowの内側では復旧できない。次のstepへ進めず、現在のstepも完了できず、skillが定めた手順のどれを実行しても状態が変わらない

条件1 が欠けて条件2 だけが成立するなら設計不足であり、designへ戻る。条件2 が欠けて条件1 だけが成立するなら通常のtask失敗であり、`tasklist-executor`の停止・再開contractで扱う。この2条件が、例外を「詰まったから手を動かす」へ拡張させない歯止めである。

#### 設計で潰せた不確実性を持ち込まない

`resolve-blocker`が許容するのは実行条件の回復だけである。次の3つは`blocker`の解消に見えても許容しない。

- 実装中に、designで決めていないことを決める
- design中に決められたはずのことを、実装中に判断する
- spikeで潰せたはずの不確実性を、えいやで試しながら進める

いずれも「設計を尽くした」という前提を満たしていない。これらを`resolve-blocker`として実行すると、設計と実行の分離そのものが崩れる。判断時は「この不確実性は、designまたはspikeで潰せたか」と問う。潰せたならそれは`blocker`ではなく設計不足である。

#### blockerを解消してもFlowの成果にはしない

`resolve-blocker`は実行条件を回復させるためだけの行為であり、tasklistのtaskを進めることを目的にしない。`blocker resolution`中に副次的にtaskが進んでいても、tasklistのcheckboxはstep内の通常手順で確定させる。

この区別を失うと、`resolve-blocker`が実装の抜け道になる。「blockerを解消するついでに実装した」を成果として数えないことが、例外を例外のまま保つ条件である。

#### 検知時の確認

`blocker`を検知した時点で、ユーザーの指示の有無に関わらず次の3択を1回で問う。

```text
Flowが進められない状態を検知した。（何が起きているかを1〜2文で示す）

a. Flowから離れず、ここで停止して指示を待つ
b. blockerの解消のためにFlowから離れる。方針は都度確認する
c. blockerの解消のためにFlowから離れる。解消できる限り自走する
```

2軸（離れるか / 離れた後どう進めるか）を`yes/no`の入れ子で2段に分けない。入れ子では1回目の回答時点で何を承諾したことになるのかが確定しないため、`no` / `yes-no` / `yes-yes`の3通りへ展開して1往復で取る。

`a`を先頭へ置くのは、離れることを既定にしないためである。選択肢として提示されなければ、agentは「離れてよいか」という問い自体を離れる前提の確認として出しやすい。

task-designの[`wrap-up.md`](../task-design/wrap-up.md)の「実行を始めてよいかを確かめる」は「進むか否か」の2値を扱う形式であり、この2軸の判断には流用しない。

#### 自走の範囲と報告

`c`を選ばれた場合も、次は自走の範囲に含めない。該当したら`b`と同じく都度確認へ戻る。

- 破壊的操作。削除、強制上書き、履歴の書き換え、稼働中の外部resourceの再作成
- repository外への影響。push、PR作成、外部serviceへの送信
- `blocker`の解消に必要な範囲を超える変更

選定基準は「取り返しがつかないか、影響がrepositoryの外へ出るか、`blocker`と無関係か」である。3つめは`resolve-blocker`が実行条件の回復だけを目的とすることに対応し、ここが緩むと`blocker`の解消を名目にした任意の実装が正当化される。

報告は離脱したstepへ戻る時点で1回行い、何が`blocker`だったか、解消のために行ったこと、解消できたか、判明した事実のうちdesign・tasklist・repository知識へ影響するものを含める。自走中に逐一報告しない。報告のたびに応答を待つなら`c`が`b`と同じになる。

#### 離脱したstepへの復帰

実行条件が回復したら、離脱したstepの先頭へ戻る。戻り先はこれ1つであり、「次のstepへ進む」を選べない。離脱したstepの入口条件が満たされたかは、復帰時に改めて確認する必要があるためである。次へ進めると、崩れた条件のまま先へ行く経路ができる。

復帰時に行うことは次の2つだけである。

- 離脱したstepをその入口条件から改めて実行する
- 上記「自走の範囲と報告」で定めた報告を1回行う

`blocker resolution`中に副次的にtaskが進んでいても、tasklistのcheckboxはstep内の通常手順で確定させる。復帰した時点でcheckboxを更新しない。

#### blocker resolution中の記録先

判明した事実は`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/subagent_report/`へ記録する。

追跡対象外にする。`design.md`、`tasklist.md`、discussion fileは「どの変更がどの合意に基づくか」を後から辿るために追跡されるが、`blocker resolution`の記録は実行条件の回復に関する調査ログであり、合意の正本ではないためこの性質を持たない。

利用先repositoryは`plugins/tumeda-dev/skills/prepare-design-record/.gitignore.sample`を`.design-records/.gitignore`へ複製して使う。`.sample`のままでは効かない。
