# Design: PR作成taskを別手段で置換できない形にする

<!--
このfileはpluginの公開配布物に含まれる。`maintenance_policies/migration.md`に従い、
利用先repositoryの名称、所有者名、絶対path、固有ドメイン名、固有steering slugを書かない。
-->

## 元の依頼内容

`templates/tasklist.md` のPR作成taskが、指定scriptを使わず別手段で代替されるのを防ぎたい。

現行の記述は次のとおり。

> - [ ] `tasklist-executor/scripts/github/create_or_get_pr.sh`を使い、既存PRがあれば再利用する

利用先での実測では、agentがこのscriptの実在を確認せず、`gh pr create`を直接実行した。

---

## 1. TL;DR

PR作成taskの一文が、実行すべき手段と、達成すべき目的を同時に担っている。後半の目的節が受け入れ条件に読めるため、それを満たす別手段で置換できると判断される。加えて、名指しされたscriptのpathが利用先repositoryから解決できず、所有者であるskillが自分の同梱物へ言及していない。手段をtask本体へ置き、目的を注記へ降ろし、pathの起点を明示する。

---

## 前提とする既存仕様

### `templates/tasklist.md` のPR作成task

completion sectionの末尾にある。

> - [ ] `tasklist-executor/scripts/github/create_or_get_pr.sh`を使い、既存PRがあれば再利用する

### `create_or_get_pr.sh` の実際の挙動

`gh pr create` のwrapperではない。次を行う。

| 挙動 | 内容 |
| --- | --- |
| 既存PRの再利用 | 同じhead branchのopen PRがあれば、新規作成せずそのURLを返す |
| default branchの解決 | `--base`未指定なら`gh repo view`から導く |
| issue番号の導出 | repositoryのplugin contextが`feature-<issue番号>`契約を宣言し、branch名が一致する場合、branch名からissue番号を取り出す |
| issue title の流用 | `--title`未指定なら、導出したissueのtitleを使う |
| PR bodyへのissue参照 | `--body`未指定なら`Closes #<issue番号>`を入れる |

### pathの解決規則

`tasklist-executor/scripts/github/create_or_get_pr.sh` は、pluginのskills directoryを起点とした相対pathである。利用先repositoryのworking directoryからは解決できない。

validatorはこの文字列を、`tasklist-design.md`と`templates/tasklist.md`の双方に存在することとして検査している。加えてfileの実在と、`steering`配下に同名fileが無いことを検査している。

### `tasklist-executor/SKILL.md` の言及状況

このscriptへ一度も言及していない。scriptはこのskillのdirectory配下に同梱されているが、skill本文からの導線がない。

---

## 調査で確定した事実

### 置換が成立した経路

一文が二つの役割を担っている。

| 役割 | 担っている部分 |
| --- | --- |
| 手段 | `create_or_get_pr.sh`を使う |
| 目的 | 既存PRがあれば再利用する |

目的節は、別手段でも満たせる条件として読める。実測では、agentが既存PRの不在を確認したうえで`gh pr create`を実行し、目的は満たしたと判断した。

### 置換によって失われたもの

scriptが持つissue番号の導出とPR bodyへの`Closes`挿入が働かなかった。PRがissueへ紐づかず、mergeしてもissueが閉じない状態になった。

目的節が言及していた「既存PRの再利用」だけを見ると、置換は成功している。失われたのは、目的節に書かれていない挙動である。

### 同型の欠陥をrelease `7.2.0`と`7.3.0`で四回修正している

`task-design/SKILL.md`の§4 trigger、同NG集F1、`steering/SKILL.md`のdiscussion trigger、同`実装完了後review`。いずれも一文が二役を担い、片方がもう片方のgateまたは受け入れ条件として読めていた。

今回は「適用範囲と実行者」ではなく「手段と目的」だが、一文が二役を担うという構造は同じである。

---

## 2. 要件（Requirements）

### MUST（必達）

- taskの本体が実行すべき手段そのものになっており、別手段で満たせる条件節が残らない。
- 名指しされたscriptのpathが、どこを起点とするか読める。
- scriptが`gh pr create`の単純なwrapperではないことが、実行前に読める。

### SHOULD（できれば）

- `tasklist-executor`が同梱物へ言及し、所有者からの導線がある。

### MAY（あれば嬉しい）

- なし。

### 非目標

- `create_or_get_pr.sh`自体の挙動変更。今回の問題は呼び出し側の記述にある。
- scriptの全挙動をtemplateへ複製すること。script本体が正本であり、templateは置換を防ぐために必要な範囲だけを書く。
- `tasklist-design.md`の生成条件の変更。どのtaskを生成するかは変わらない。
- validatorが検査しているpath文字列の変更。識別子として安定させる。

### 受け入れ基準

- 修正後のtaskを読む者が、`gh pr create`で代替してよいと判断しない。
- `node scripts/verification/validate-plugin.mjs`が成功する。
- 追加・変更したfileに対する`migration.md`のセルフチェックgrepが、利用先固有情報を検出しない。

---

## 3. 完成後の姿

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `task-design/templates/tasklist.md` のPR作成task | tasklistを実行するagent | 何を実行するかが一意に定まり、別手段での代替を検討しない |
| `tasklist-executor/SKILL.md` | tasklist-executorを実行するagent | 自身が同梱するhelper scriptの存在と置き場所を知る |

**完成後の内容と構造:**

PR作成taskを次へ置き換える。

```markdown
- [ ] pluginのskills directory配下にある `tasklist-executor/scripts/github/create_or_get_pr.sh` を実行する
  - pathの起点はpluginのskills directoryである。利用先repositoryからの相対pathではない
  - このscriptは`gh pr create`のwrapperではない。同じhead branchのopen PRがあれば新規作成せずそのURLを返し、repositoryが`feature-<issue番号>`契約を宣言していればbranch名からissue番号を導いてPR bodyへ`Closes #<番号>`を入れる
  - `--title`と`--body`を渡すとissueからの導出は行われない。issueへ紐づける場合はbody側へ明示する
```

task本体を手段そのものにする。「既存PRがあれば再利用する」は注記の一項目へ降ろし、受け入れ条件の位置から外す。

`tasklist-executor/SKILL.md` の `## repository固有文脈` の末尾へ次を置く。

```markdown
このskillのdirectory配下に `scripts/github/create_or_get_pr.sh` を同梱している。tasklistがPR作成taskを持つ場合に使う。
```

**記載する原則と例:**

- taskの本体には、実行する手段そのものを書く
  - 今回の具体例: `create_or_get_pr.sh`の実行をtask本体にし、既存PR再利用という達成状態は注記へ置く
  - 意図に反する薄い記述: 「必ずscriptを使うこと」と強調語を足すだけ。目的節が受け入れ条件の位置に残るため、同じ置換が成立する
- 名指しした成果物には、読み手が到達できる起点を添える

**配置・形式:**

- 配置: `task-design/templates/tasklist.md` のcompletion section、`tasklist-executor/SKILL.md` の `## repository固有文脈` 末尾
- 形式: Markdown。既存の記述スタイルに合わせる
- 参照する既存pattern: release `7.3.0` で`steering/SKILL.md`の`## 実装完了後review`を二段落へ分けた形。一文が担っていた二役を、位置で分ける
- 正本と重複防止: scriptの挙動の正本はscript本体である。templateには置換を防ぐために必要な挙動だけを書き、全仕様を複製しない

---

## 4. リスクと対策

| リスク | 対策 |
| --- | --- |
| templateへscriptの仕様を書きすぎ、script変更時に二重管理になる | 完成後の姿で、置換を防ぐために必要な範囲だけと限定する |
| path文字列を変えてvalidatorのassertionが落ちる | 非目標でpath文字列の変更を除外し、起点の説明だけを足す |
| 強調語を足すだけの対症療法になる | 完成後の姿の「意図に反する薄い記述」でこの形を禁じる |

---

## 5. テスト方針

- `node scripts/verification/validate-plugin.mjs` を実行する。既存のpath文字列assertionが通ることを確認する。
- 変更したfileへ`migration.md`のセルフチェックgrepを適用する。
- 修正後のtaskを、今回の置換（`gh pr create`の直接実行）へ当てはめ、その判断が成立しないことを机上で確認する。
- validatorへassertionを追加しない。今回の変更は既存taskの記述の組み替えであり新しい契約を追加しない。検査したい対象は「手段と目的が別の位置にあること」という構造であり、固定文字列では表現できない。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `task-design/templates/tasklist.md` | PR作成taskの本体を手段そのものにし、目的を注記へ降ろした | `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `tasklist-executor/SKILL.md` | 同梱scriptへの言及を追加した | 同上 | 同上 |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし
