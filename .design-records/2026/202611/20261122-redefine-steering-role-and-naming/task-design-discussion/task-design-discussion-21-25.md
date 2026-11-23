# 議論記録

## 論点21: repository固有文脈での、steeringの節と表の行

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。論点3・11の決定から導ける）

### イテレーション0（論点21）: 文脈のtemplateと`maintenance-plugin-context`の表のsteeringの扱いを仮決めする

#### 提案0（論点21）

`maintenance-plugin-context/SKILL.md`の表は`steering`に「プロジェクト指示、アーキテクチャ文書、開発規約、テスト方針」を返すと定め、文脈のtemplate（`skills/tumeda-dev-plugin-context.md`）は`## steering`の節を持つ。templateの`### Branch / issue 契約`は「`steering` を `branch_from_basename=true` で起動して作る」と書く。

- a. 次のとおり書き換える（仮決め）
  - 表の`steering`の行と`## steering`の節は、`advance-roadmap`へ名前を変えて移す。返す項目は変えない。
  - `prepare-design-record`はrepository固有の文脈を使わない（命名、directoryの作成、summaryの生成、branchの作成は、どのrepositoryでも同じ手順である）ため、表に足さない。
  - `### Branch / issue 契約`の文面を「task-designを`branch_from_basename=true`で起動し、`prepare-design-record`がbranchを作る」へ書き換える。`### UI確認環境`のcommentの「tasklist-design・tasklist-executor・steering」は、「tasklist-design・tasklist-executor・tasklist-executorを起動する側」へ書き換える。
  - `doc-enricher`の置き場所の一覧の`.steering/<年>/<年月>/<作業>/`の行は`.design-records/<年>/<年月>/<作業>/`へ書き換える。
  - 根拠: 論点3の決定（steeringの実行の段取りは`advance-roadmap`と`tasklist-executor`を起動する側へ）と、論点11・14の決定。
- b. `advance-roadmap`の返す項目を「プロジェクト指示」だけへ減らす
  - steeringは初回のtask-design起動の前に設計の材料を読むことを禁じられており、表の四項目は実際には使っていなかった可能性がある。ただし項目を減らすのは振る舞いの変更であり、今回の目的（置き場所を正す）の外にある。

#### 検討記録（論点21・イテレーション0）

`maintenance-plugin-context/SKILL.md`の「選択的読取」の表、`skills/tumeda-dev-plugin-context.md`の`steering`を含む行を確かめた。このrepositoryの`.agents/skills/tumeda-dev-plugin-context.md`は配布templateへのsymlinkであり、templateを直すとこのrepositoryの文脈も同じに変わる（`.agents/CLAUDE.md`）。項目を減らす案bは、`docs/development_standards/development_flow/work_scope.md`の一段目で、今の作業の目的の決定・実装範囲を変えないため目的の外になる。

#### 提案0へのフィードバック（論点21）

**結果:** aに合意（論点17〜21をまとめて示した往復で「ok」と答えられた）

> ok

### 決定（論点21）

repository固有文脈では次のとおり書き換える。`maintenance-plugin-context/SKILL.md`の表の`steering`の行と、文脈のtemplateの`## steering`の節は、`advance-roadmap`へ名前を変えて移し、返す項目は変えない。`prepare-design-record`はrepository固有の文脈を使わないため表に足さない。`### Branch / issue 契約`の文面は「task-designを`branch_from_basename=true`で起動し、`prepare-design-record`がbranchを作る」へ、`### UI確認環境`のcommentの「steering」は「tasklist-executorを起動する側」へ、`doc-enricher`の置き場所の一覧の`.steering/<年>/<年月>/<作業>/`は`.design-records/<年>/<年月>/<作業>/`へ書き換える。返す項目を減らすことは振る舞いの変更であり、今回の目的の外のため行わない。

## 論点22: 配布versionの上げ方

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。根拠は`maintenance-plugin-context/SKILL.md`「Plugin version」）

**依存先:** なし。designの仕上げの時に、他の残りとまとめて示す。

### イテレーション0（論点22）: 配布versionを仮決めする

#### 提案0（論点22）

- a. `9.1.7`から`10.0.0`へ上げる（仮決め）
  - 根拠: `maintenance-plugin-context/SKILL.md`「Plugin version」は「破壊的変更はMAJOR」と定める。今回は、利用先が呼んでいた`steering`が無くなり、task-designの入力（`working_dir_parent`、`create_working_dir`）が無くなり、記録の置き場所が`.design-records/`へ変わり、以前の版が作ったroadmapの見出し・labelを今の版が名前で読めなくなる。どれも利用先の呼び方や成果物の読み方を壊す。
  - 宣言値4箇所と`scripts/verification/validate-plugin.mjs`の`expectedRelease`を一度に変える。
- b. `9.2.0`（MINOR）
  - 新しいskillが増えることは呼べるものが増える変更だが、既存の呼び方を壊す変更を含むため、MINORでは足りない。

#### 検討記録（論点22・イテレーション0）

`maintenance-plugin-context/SKILL.md`「Plugin version」と、今の宣言値（4箇所とも`9.1.7`、`expectedRelease`も`9.1.7`）を確かめた。

#### 提案0へのフィードバック（論点22）

**結果:** aに合意（論点22〜24をまとめて示した往復で「ok」と答えられた）

> ok。あと、使う側もbreaking_changes見たらgit mvできるかな？ ちょっと週間上限近づいてきたから、今のうちにコミット計画立てて。私が合意したらコミットして、pushしてPR作って

### 決定（論点22）

配布versionを`9.1.7`から`10.0.0`へ上げる。利用先が呼んでいた`steering`が無くなり、task-designの入力が変わり、記録の置き場所が`.design-records/`へ変わり、以前の版が作ったroadmapの見出し・labelを今の版が名前で読めなくなるため、`maintenance-plugin-context/SKILL.md`「Plugin version」の「破壊的変更はMAJOR」に当たる。宣言値4箇所と`scripts/verification/validate-plugin.mjs`の`expectedRelease`を一度に変える。

## 論点23: 前月summaryの題

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。論点5の決定から導ける）

移行の対応表（`function-migration-ledger.md`のC-063）を作る中で立てた。

### イテレーション0（論点23）: summaryの題に残る「Steering」の扱いを仮決めする

#### 提案0（論点23）

steeringのStep 1は、前月summaryのexact formatの題を「{YYYY}年{MM}月 Steering サマリー」と定めている。この形式は`prepare-design-record/summarize-previous-month.md`へ移る。

- a. 題を「{YYYY}年{MM}月 設計の記録 サマリー」へ変える（仮決め）
  - 根拠: 論点5で、記録を置く場所を`.design-records/`（設計の記録）と決めた。summaryはその月の設計の記録の一覧である。既に作られた月のsummaryは書き換えない（論点14の、過去の記録の本文を書き換えない決まり）。
  - 題は人が読むもので、skillやscriptが名前で探さないため、`breaking_changes/`の記録は要らない。
- b. 題を変えない
  - 無くなるskillの名前が、これから作るsummaryの題に残り続ける。

#### 検討記録（論点23・イテレーション0）

`steering/SKILL.md` Step 1のsummaryのexact formatと、summaryを名前で読む箇所を確かめた。summaryの題を名前で探すskillやscriptは無く、validatorがexact formatの文字列を確かめているだけである。

#### 提案0へのフィードバック（論点23）

**結果:** aに合意（論点22〜24をまとめて示した往復で「ok」と答えられた）

> ok。あと、使う側もbreaking_changes見たらgit mvできるかな？ ちょっと週間上限近づいてきたから、今のうちにコミット計画立てて。私が合意したらコミットして、pushしてPR作って

### 決定（論点23）

前月summaryの題を「{YYYY}年{MM}月 設計の記録 サマリー」にする。summaryは`.design-records/`の一か月分の一覧である。既に作られた月のsummaryは書き換えない。題を名前で探すskillやscriptは無いため、`breaking_changes/`の記録は作らない。

## 論点24: steeringの「非規範的なlegacy memo」と「合意済みの明示廃止」の履歴の記述

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。論点1の決定と、移行の対応表から導ける）

移行の対応表（`function-migration-ledger.md`のC-047、C-148〜C-151、C-153）を作る中で立てた。

### イテレーション0（論点24）: steering自身の過去の契約についての記述を移さないことを仮決めする

#### 提案0（論点24）

steeringは、自分の過去の契約について次の記述を持つ。

- 非規範的なlegacy memo: 「複数のfeedbackが揃ったら新しいsteeringを起動する」方針は今の規則ではなく、将来必要なら明示合意で復活を検討する。
- 合意済みの明示廃止: task-design専用子directoryと`task_design_dir`探索の廃止、tasklistから親roadmapを更新する契約の廃止、steeringがtasklist・roadmapを設計・再reviewする契約の廃止、feedback件数による新steeringの自動起動の廃止、「上記以外の旧steeringの意味単位はmigration ledgerに従う」。

- a. 移さない（`RETIRE`）（仮決め）
  - 根拠: どれもsteering自身の過去の契約の記述であり、論点1でsteeringが無くなる。これらが防いでいた逆戻りは、新しい担当の禁止として移す（task-design専用子directory等の禁止は`prepare-design-record`、親roadmapを更新させない禁止は`advance-roadmap`と`tasklist-executor`、設計をしない禁止は`advance-roadmap`。対応表のC-139、C-140、C-142）。履歴はgitと過去の記録に残る。
  - 「全フェーズ完了日・計画と実績の差分fieldの廃止」は、全体完了の導き方という今も効く規則のため、`advance-roadmap`へ移す（C-152）。
- b. `advance-roadmap`か`prepare-design-record`へ「履歴」の節として移す
  - 無くなったskillの過去の契約を、別のskillが説明し続けることになる。

#### 検討記録（論点24・イテレーション0）

`steering/SKILL.md`の「非規範的なlegacy memo」と「合意済みの明示廃止」を一件ずつ読み、今も効く規則か、steering自身の履歴かを分けた。今も効く規則（全体完了の導き方）と、逆戻りを防ぐ禁止は、新しい担当へ移る行が対応表にある。残りはsteering自身の過去の契約の説明だけである。

#### 提案0へのフィードバック（論点24）

**結果:** aに合意（論点22〜24をまとめて示した往復で「ok」と答えられた）

> ok。あと、使う側もbreaking_changes見たらgit mvできるかな？ ちょっと週間上限近づいてきたから、今のうちにコミット計画立てて。私が合意したらコミットして、pushしてPR作って

### 決定（論点24）

steeringの「非規範的なlegacy memo」と、「合意済みの明示廃止」のうちsteering自身の過去の契約を説明する記述（task-design専用子directoryと`task_design_dir`探索の廃止、tasklistから親roadmapを更新する契約の廃止、steeringがtasklist・roadmapを設計・再reviewする契約の廃止、feedback件数による新steeringの自動起動の廃止、上記以外はmigration ledgerに従う）は移さない（`RETIRE`）。これらが防いでいた逆戻りは、新しい担当の禁止として移す（対応表のC-139、C-140、C-142）。今も効く「全体完了はphaseのstatusと完了日から導き、`全フェーズ完了日`等のfieldを作らない」は`advance-roadmap`へ移す（C-152）。

## 論点25: 利用先が`breaking_changes/`の記録だけを読んで`.steering/`を移せるようにするか

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。論点14・16の決定の具体化）

論点22〜24への返事に添えられた問いから立てた。

> 使う側もbreaking_changes見たらgit mvできるかな？

### イテレーション0（論点25）: 読み替えの記録に移し方を書くかを仮決めする

#### 提案0（論点25）

論点14では、利用先の`.steering/`は`prepare-design-record`が初回に移すことを提案し、論点16では、`.steering/…`を`.design-records/…`として読む記録を`prepare-design-record/breaking_changes/`へ置くと決めた。今の決め方では、移し方の手順は`prepare-design-record`の中にあり、記録には読み替え方しか無い。

- a. 記録に「移し方」の節を足し、手順の正本をそこに置く。`prepare-design-record`の初回の提案は、その節の手順を参照して行う（仮決め）
  - 手順: `.design-records/`が無いことを確かめる。`git mv .steering .design-records`で移す。`.steering/.gitignore`も一緒に移る。移した結果をcommitする。`.steering/`と`.design-records/`が両方ある時は混ぜずに止まり、利用者が確かめる。
  - 根拠: 論点14・16の決定。記録を読んだ人もagentも、skillを起動せずに同じ手順で移せる。手順を二箇所に書かず、記録だけを正本にする。
  - `maintenance-plugin-context/SKILL.md`「Plugin version」の一件の書き方（変わった版、旧名と新名の対応、変えた理由、古い成果物の読み方）に、移せる場合の移し方を足すかは、この一件の書き方として記録の中で足すだけにし、規則の文面は変えない。
- b. 記録は読み替え方だけにし、移し方は`prepare-design-record`だけが持つ
  - 移すには`prepare-design-record`を起動する必要がある。

#### 検討記録（論点25・イテレーション0）

論点14・16の決定と、`task-design/templates/breaking_changes/20261115-rename-template-labels.md`の「古い成果物の読み方」（「進行中のroadmap.mdを続ける時は、見出しを新名へ書き換えてよい」という、読む側が成果物を直す手順を既に含む）を確かめた。移し方を記録に書くことは、既存の記録の形の範囲で書ける。

#### 提案0へのフィードバック（論点25）

**結果:** aに合意（コミット計画と論点25をまとめて示した往復で「ok」と答えられた）

> ok

### 決定（論点25）

`prepare-design-record/breaking_changes/`の`.steering/`の読み替えの記録に「移し方」の節を足し、手順の正本をそこに置く。手順は、`.design-records/`が無いことを確かめ、`git mv .steering .design-records`で移し（`.steering/.gitignore`も一緒に移る）、移した結果をcommitする。`.steering/`と`.design-records/`が両方ある時は混ぜずに止まり、利用者が確かめる。`prepare-design-record`の初回の提案は、この節の手順を参照して行い、手順を自分では書かない。記録を読んだ人もagentも、skillを起動せずに同じ手順で移せるようにするためである。`maintenance-plugin-context/SKILL.md`「Plugin version」の一件の書き方の規則の文面は変えず、この一件の記録の中で移し方を足す。

