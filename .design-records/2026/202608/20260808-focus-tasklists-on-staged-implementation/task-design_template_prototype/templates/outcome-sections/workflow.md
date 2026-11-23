### workflow

<!--
移行元:
- task-design/SKILL.md「成果物template」「Step 3〜6」
- roadmap-design.md「Field ownership」
- steering/SKILL.md「役割とゴール」「Flow」

単に「Aの後にBを行う」と書くのではなく、owner、single writer、正本、
gate、停止・再開、handoffを合算して完成後のworkflowを描く。

なぜ必要か:
- 個別fileが正しくてもcallerとconsumerの境界でuser確認、停止、resultが落ちるため。
- 二つのownerが同じfieldを更新する二重正本や、誰も更新しない責務の穴を防ぐため。
- happy pathだけでは、feedback、失敗、再開時にどこへ戻るか決まらないため。

NG:
- task-designが設計し、steeringが実行する
- review後に次へ進む
- 必要なら元へ戻る

具体的な記述例:
- task-designはroadmapのphase identity、目的、scope、DoD、依存を設計する。
- steeringだけが子steering path、status、完了日をruntimeで更新する。
- 構造field変更が必要ならsteeringは直接編集せず、同じworking directoryでtask-designを再開する。

記述のMUST:
- 各ownerについて、行う判断・更新と、行わないことを両方示す。
- 各stateの入口event、先行gate、更新する正本、次ownerへ渡すresultを示す。
- user合意、停止、失敗、取消、再開、feedbackの戻り先を示す。
- lifecycleを跨ぐfileはsingle writerを一意にする。
- callerとconsumerを合算し、途中でcontractが消えないことを確認する。

判断基準:
- 任意のstateで「次に誰が、どの正本を、何を根拠に更新するか」を一意に答えられるか。
- errorまたはfeedback時の戻り先と、自動再開の可否が決まっているか。
- 同じ判断またはstateを複数ownerが正本として持っていないか。
-->

**ownerと責務:**

| owner | 判断・更新するもの | 行わないこと | single source of truth |
| --- | --- | --- | --- |
| `{owner}` | {責務} | {非責務} | `{file / result / state}` |

**状態と遷移:**

```text
{state A} --{event / gate / owner}--> {state B}
{state B} --{feedback / failure}--> {戻り先}
```

**必須順序とhandoff:**

1. {開始条件、owner、読む正本}
2. {判断または更新}
3. {validationまたはuser合意gate}
4. {返すresultとconsumer}
5. {終了条件、または停止・再開状態}

**失敗・取消・再開:**

- {条件}: {停止するowner、維持するstate、再開入口}
