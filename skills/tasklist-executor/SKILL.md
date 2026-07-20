---
name: tasklist-executor
description: >
  合意済みtasklistを上から実行し、実測したDoDだけを完了にするsubagent skill。
  UI確認はvisual-inspector、test実行・失敗分析はtest-runnerへ委譲し、child失敗時は未完のまま修正・再実行へ戻る。
model: sonnet
context: fork
---

# Tasklist executor

このskillの推論強度は`../runtime-model-profiles.md`の`standard-execution`に従う。設計やplanningを作り直さず、合意済みtasklistとdesignを根拠に実装する。

## 必須入力

parentはchildへ次を渡す。

- tasklist path
- design path（あれば）
- 実行範囲または開始task
- DoD
- maintainerが返した許可済みcontext

tasklistがない、または未合意なら実行しない。repository固有のinstruction、architecture、development/test規約、全体commandが必要なら、`maintenance-plugin-context`へconsumer=`tasklist-executor`、必要理由、必要section、確認元候補を渡す。返却範囲以外を根拠にしない。

## 実行規則

1. tasklistと関連designを読み、最初の未完taskを一つ選ぶ。
2. task、DoD、対象、依存関係を確認し、必要な実装と検証を行う。
3. 完了が実測できた時だけ、そのtaskを`[x]`へ更新する。完了直後に更新し、最後にまとめて更新しない。
4. taskが大きすぎて着手不能なら、理由とDoDを保ったsubtaskへ分ける。設計変更が必要なら停止してparentへ返す。
5. 全task後にtasklistを再読し、残る`[ ]`とDoD未達を確認する。

技術的に不要になったtaskだけは、理由をtasklistに残して完了扱いにできる。難しい、時間がかかる、別taskで行う予定、は理由にならない。

## child委譲

UIの見た目・操作を確認するtaskでは、executorが直近parentとして`visual-inspector`を起動し、以下を渡して待機する。

- task / phase、確認操作、期待結果、DoD
- artifact directory
- 対象データ準備方法
- 許可済みcontext

test実行または失敗分析では、executorが直近parentとして`test-runner`を起動し、対象、DoD、許可済みcommandと前提、関連path、許可済みcontextを渡して待機する。

childの`passed`だけをDoDの証跡として使う。`failed`または`blocked`ならtaskを`[x]`にせず、修正、入力要求、再実行へ戻る。childがtasklistを更新することはない。executorだけがtasklist転記とDoD最終判定を行う。

visualの結果はtasklistの該当task直下へ、result path、確認項目、期待値、実測値、総合結果を要約して残す。データ不足で確認できないことを成功扱いにしない。

## host別の起動

### Claude Code

frontmatterの`model: sonnet`と`context: fork`で起動する。executorからのchild起動も同じinput契約で行う。

### Codex

親sessionがexecutorをchildとして起動し、必須入力を渡す。executorは必要時に直近parentとしてvisual-inspectorまたはtest-runnerを起動して待機する。childも必要ならparentになれる。各parentはprofileに応じたmodel選択、または親model継承をsummaryへ残す。

## 終了

未完taskまたはDoD未達が残る時は完了宣言しない。全taskが完了した時も、tasklistが定める利用者動作確認より先にcommit・push・PRへ進まない。実行したこと、未完があればその理由、child結果を親へ返す。
