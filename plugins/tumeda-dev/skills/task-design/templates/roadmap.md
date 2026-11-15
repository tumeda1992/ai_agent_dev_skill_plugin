# ロードマップ: {task名}

## 設計参照

- `./design.md`

## 概要

{task全体の目的と、なぜ一つのtasklistではなく複数の子design scopeへ分割するかを書く}

このroadmapは子scopeの構造一覧である。各phaseは独立した子steeringを通じて設計・実装し、各phase完了時点でappまたは成果物が正常に利用できる状態を保つ。

roadmapの各phaseの計画はtask-designが設計・reviewする。各phaseの子steering path、status、完了日だけをsteeringが実行時に更新する。

## 各phaseの計画（task-designが設計・reviewする）

---

## Phase: {stable-phase-id} — {phase名}

### 目的

{このphaseが達成すること}

### Scope

- {親scopeよりstrictly narrowerな、このphaseで扱う範囲}

### Scope外

- {隣接phaseとの境界。このphaseで扱わない範囲}

### DoD（完了条件）

- {親designの完了条件へ対応し、一つの子scopeとして実測できる状態}
- {このphase完了時点でappまたは成果物が正常に利用できる条件}

### 依存

- 依存phase: {なし、またはstable phase identity}
- 依存phaseの確定結果: {子task-designへ渡す確定結果。依存なしならなし}
- 子designで解消する制約: {依存phaseの確定結果を使って確定する上位制約。依存なしならなし}

### 親DoDとの対応

- {親designの完了条件}

### 進み具合（steeringだけが更新する）

- 子steering: 未割当
- status: 未着手
- 完了日: 未完了

---

## Phase: {stable-phase-id} — {phase名}

### 目的

{このphaseが達成すること}

### Scope

- {親scopeよりstrictly narrowerな、このphaseで扱う範囲}

### Scope外

- {隣接phaseとの境界。このphaseで扱わない範囲}

### DoD（完了条件）

- {親designの完了条件へ対応し、一つの子scopeとして実測できる状態}
- {このphase完了時点でappまたは成果物が正常に利用できる条件}

### 依存

- 依存phase: {なし、またはstable phase identity}
- 依存phaseの確定結果: {子task-designへ渡す確定結果}
- 子designで解消する制約: {依存phaseの確定結果を使って確定する上位制約}

### 親DoDとの対応

- {親designの完了条件}

### 進み具合（steeringだけが更新する）

- 子steering: 未割当
- status: 未着手
- 完了日: 未完了

---

## 親の完了条件と、それを満たすphase

| 親DoD | 担当phase |
| --- | --- |
| {親designの完了条件} | {stable-phase-id} |

## phase間の依存関係

{cycleを持たないstable phase identity間の依存を記載する。例: `phase-a -> phase-b`}
