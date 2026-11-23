# ロードマップ: {task名}

## 設計参照

- `./design.md`

## 概要

{task全体の目的と、なぜ一つのtasklistではなく複数の子design scopeへ分割するかを書く}

このroadmapは子scopeの構造一覧である。各phaseは独立した子steeringを通じて設計・実装し、各phase完了時点でappまたは成果物が正常に利用できる状態を保つ。

roadmapの構造fieldはtask-designが設計・reviewする。各phaseの子steering path、status、完了日だけをsteeringが実行時に更新する。

## 構造field（task-designが設計・reviewする）

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
- dependency results: {子task-designへ渡す確定結果。依存なしならなし}
- 子designで解消する制約: {dependency resultsを使って確定する上位制約。依存なしならなし}

### 親DoDとの対応

- {親designの完了条件}

### 運用field（steeringだけが更新する）

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
- dependency results: {子task-designへ渡す確定結果}
- 子designで解消する制約: {dependency resultsを使って確定する上位制約}

### 親DoDとの対応

- {親designの完了条件}

### 運用field（steeringだけが更新する）

- 子steering: 未割当
- status: 未着手
- 完了日: 未完了

---

## 親DoD coverage

| 親DoD | 担当phase |
| --- | --- |
| {親designの完了条件} | {stable-phase-id} |

## Dependency DAG

{cycleを持たないstable phase identity間の依存を記載する。例: `phase-a -> phase-b`}
