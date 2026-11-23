# 起動する側が行うこと

`tasklist-executor`を起動する側（利用者の会話のagent、`advance-roadmap`）が守る約束である。どの担当が起動しても同じ約束で扱う。起動するのは、task-designの[`wrap-up.md`](../task-design/wrap-up.md)の「実行を始めてよいかを確かめる」で利用者の明示確認を得た後だけである。`tasklist-executor`がchild処理を委譲する時の契約（状態の正本、停止理由、child request・result、停止・再開）は[`execution-contracts.md`](execution-contracts.md)が持つ。

## 起動する

tasklist-executorへ`tasklist.md`と同階層の`design.md`の絶対pathを渡す。

- tasklist-executorだけをtasklistのsingle writerとする。
- task、subtask、phaseを実測完了した直後に`[x]`へ更新させ、最後にまとめて更新させない。
- tasklist-executorは親roadmapを探索・更新せず、完了resultだけをcallerへ返す。
- tasklist内のユーザー動作確認が完了する前にcommit、push、PRへ進ませない（確認環境へ載せるために`UI確認環境`が定めるcommit・pushと、作業の外へ残るactionを含むphaseの最後のcommit・pushを除く）。push・PR前にはlocal commitが実際に一件以上存在することを確認する。
- 利用者が合意したcommand（tasklistで合意した取り返しのつかない操作等）をtasklist-executorに実行させる時は、利用者の合意の原文と、合意したcommandの一覧をそのまま渡す。実行環境は利用者の意図を判断に使うことがある。例えば、Claude Codeのauto modeの分類器は、破壊的な操作の既定の制止を利用者の意図で解く。利用者がまだ与えていない承認や、「利用者が実行許可の画面で見る」のようなまだ起きていない確かめを、指示に事実として書かない。それでも実行環境に止められた時の扱いは[`blocked_commands.md`](../../docs/agent_execution_standards/blocked_commands.md)に従う。

## 止まって返ってきた時に読み直す

executorがどの停止理由で返しても、返却resultだけで次の判断をしない。この手順は[Blocker resolution](blocker-resolution.md)の一部ではない。起動先の停止はそれ自体では`blocker`ではなく、[`execution-contracts.md`](execution-contracts.md)の「停止理由」のうち`delegation_required`、`user_confirmation_required`、`phase_checkpoint`は起動する側の手順が想定する正常停止であるため、停止理由で分岐させず全停止理由で常に行う。

- `tasklist.md`のcheckboxと、task配下にexecutorが書き残したnoteを読む。
- `artifact_directory`にrequest / result artifactがあれば読む。
- 読んだ内容が`design.md`と食い違う場合、実装を進める前に下の「実装後のfeedback」へ回す。

根拠は[`execution-contracts.md`](execution-contracts.md)の「状態の正本とsingle writer」にある。taskの完了状態の正本はtasklistの`[ ]` / `[x]`、child処理の状態の正本はrequest / result artifactと定められ、返却resultはこの列挙に含まれない。

## 実装後のfeedback

実装、review、validation、ユーザー動作確認でfeedback・漏れ・追加要件・不具合が判明したら、
直接受領した担当が[共通の実装feedback処理](implementation-feedback.md)を読み、pluginの`facilitate-discussion`を明示適用する。
起動する側が直接受領した場合は起動する側自身が行い、次の入力を渡す。

```text
discussion_directory=<tasklist.mdがある設計の記録のdirectory>
discussion_file_name=implementation_review.md
```

共通指示が所有する原文保存・原因確認・合意・decision後のroutingを終えてから、返された先のphaseへ戻る。
feedbackを記録せず直接designへ戻したり、実装を自動再開したりしない。

## 段取りの議論

tasklistを実行する段取り（起動、再開位置、止まった後の進め方）について記録価値のある思考が生じた時、ユーザーが段取り上の論点・質問・要議論を出した時、またはユーザーへ段取り上の問いを出そうとしている時は、起動する側が`discussion_directory=<tasklist.mdがある設計の記録のdirectory>`を渡してpluginの`facilitate-discussion`を明示適用し、`discussion.md`へ記録する。議論だけを別child agentへ再委譲しない。設計上の曖昧さや方向性はtask-designへ渡す。`discussion.md`の使い方の詳細は[`advance-roadmap/SKILL.md`](../advance-roadmap/SKILL.md)の「段取りの議論（discussion.md）」と同じである。

## 完了を確かめた時

tasklist-executorが`completed`を返し、読み直しで全taskの`[x]`と、tasklistが定める利用者の確認の完了を確かめたら、元作業全体の完了として扱う。

保留したplugin改善のメモは、再開条件が成り立ちうる状態遷移の時だけ確かめ直す（[保留条件の再確認](../escalate-plugin-skill-fix/pending-escalations.md#元担当の状態遷移から再確認する)）。
起動する側が依頼するのは、元作業全体を完了する時だけであり、元作業の場所と完了記録・実証拠を`escalate-plugin-skill-fix`へ渡す。
executorの停止時、作業の再開時には依頼しない。返却resultだけで成立を通知しない。暫定指示の管理への通知や追加承認とは区別する。
`advance-roadmap`が起動した時は、完了を`advance-roadmap`へ返し、phaseの完了として扱わせる。

## 起動する側が絶対にやらないこと

- 許可なくtasklistを実行する。task-designの`wrap-up.md`で利用者の明示確認を得る前に`tasklist-executor`を起動しない。
- tasklist合意前に実装し、ユーザー動作確認前にcommit、push、PRを行う（確認環境へ載せるために`UI確認環境`が定めるcommit・pushと、作業の外へ残るactionを含むphaseの最後のcommit・pushを除く）。push・PR前にはlocal commitが実際に一件以上存在することを確認する。
- 返却resultだけで次の判断をする。
- 起動する側自身が実装codeを変更する。唯一の例外は[Blocker resolution](blocker-resolution.md)であり、その成立条件と手順は同fileが持つ。

## Blocker resolution

`tasklist-executor`が`blocked`で返り、起動する側の手順の内側では復旧できない時と、起動する側が自分の手順（`advance-roadmap`の「phaseを進める手順」を含む）で実行の前提が崩れて進めなくなった時は、[`blocker-resolution.md`](blocker-resolution.md)を読んで従う。手順を離れて自ら手を動かしてよい唯一の例外であり、成立する条件と手順は同fileが持つ。
