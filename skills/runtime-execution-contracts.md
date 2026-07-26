# Runtime execution contracts

tasklist-executorがvisual-inspector / test-runnerへchild処理を委譲する時の、hostに依存しない共通契約。

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
- `blocked`: 必須入力・外部状態・権限が不足している。
- `limit_reached`: 利用上限へ達した。完了済みtask、pending request/result、次の未完了taskを返す。

`completed`以外は「全完了」を意味しない。停止までに実測完了したtaskだけを`[x]`へ更新する。

## Child request

executorが作成するrequestは次を必須とする。

```json
{
  "request_id": "phase-2-task-3-visual-1",
  "kind": "visual-inspector",
  "tasklist": ".steering/example/tasklist.md",
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

## Logical ownerとphysical launcher

- logical ownerはtasklist-executorである。委譲要否、request、result消費、DoD、tasklist更新を所有する。
- physical launcherはhost adapterである。指定されたchildの起動、完了待ち、result到達だけを担い、tasklistやresult内容を解釈しない。
- Codexでは直近parentがchildを起動し、完了まで待つ。parentはrequestをpromptへ渡し、child resultをlogical ownerへ返す。
- agent由来の3skillはfrontmatterに`context: fork`を保持する。これは宣言の静的契約であり、特定hostのruntime動作をこの文書の受け入れ条件にはしない。

## Repository context

repository固有のapp URL、authentication、test / lint command、artifact root、browser helper、setup / run command、result template、permissionはrepository contextから解決する。共通skill本文とrequest fixtureへ固定しない。
