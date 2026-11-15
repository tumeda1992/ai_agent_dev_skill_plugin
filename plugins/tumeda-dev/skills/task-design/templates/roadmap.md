# ロードマップ: {task名}

## 設計参照

- `./design.md`

## 概要

{作業全体の目的と、なぜ一つのtasklistではなく、複数の子のdesignの範囲へ分けるかを書く}

このroadmapは、子の範囲の一覧である。各phaseは独立した子steeringを通じて設計・実装し、各phaseの完了の時点で、appまたは成果物が正常に使える状態を保つ。

各phaseの計画は、task-designが設計・reviewする。各phaseの子steeringのpath、status、完了日だけを、steeringが実行中に更新する。

## 各phaseの計画（task-designが設計・reviewする）

---

## Phase: {stable-phase-id} — {phase名}

### 目的

{このphaseが達成すること}

### Scope

- {親のscopeより狭い（親と同じ範囲にしない）、このphaseで扱う範囲}

### Scope外

- {隣接phaseとの境界。このphaseで扱わない範囲}

### DoD（完了条件）

- {親のdesignの完了条件に対応し、一つの子の範囲として実際に確かめられる状態}
- {このphaseの完了の時点で、appまたは成果物が正常に使える条件}

### 依存

- 依存phase: {なし、または依存するphaseのID}
- 依存phaseの確定結果: {子のtask-designへ渡す確定した結果。依存が無ければなし}
- 子のdesignで解消する制約: {依存phaseの確定結果を使って確定する上位の制約。依存が無ければなし}

### 親DoDとの対応

- {親のdesignの完了条件}

### 進み具合（steeringだけが更新する）

- 子steering: 未割当
- status: 未着手
- 完了日: 未完了

---

## Phase: {stable-phase-id} — {phase名}

### 目的

{このphaseが達成すること}

### Scope

- {親のscopeより狭い（親と同じ範囲にしない）、このphaseで扱う範囲}

### Scope外

- {隣接phaseとの境界。このphaseで扱わない範囲}

### DoD（完了条件）

- {親のdesignの完了条件に対応し、一つの子の範囲として実際に確かめられる状態}
- {このphaseの完了の時点で、appまたは成果物が正常に使える条件}

### 依存

- 依存phase: {なし、または依存するphaseのID}
- 依存phaseの確定結果: {子のtask-designへ渡す確定した結果}
- 子のdesignで解消する制約: {依存phaseの確定結果を使って確定する上位の制約}

### 親DoDとの対応

- {親のdesignの完了条件}

### 進み具合（steeringだけが更新する）

- 子steering: 未割当
- status: 未着手
- 完了日: 未完了

---

## 親の完了条件と、それを満たすphase

| 親DoD | 担当phase |
| --- | --- |
| {親のdesignの完了条件} | {stable-phase-id} |

## phase間の依存関係

{phase IDの間の依存を、循環しない形で書く。例: `phase-a -> phase-b`}
