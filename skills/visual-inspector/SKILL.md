---
name: visual-inspector
description: >
  UI変更後の画面を実ブラウザで確認し、script・screenshot・resultを指定artifact directoryへ残すsubagent skill。
  UIの見た目、操作、回帰を確認する時に使う。
model: sonnet
context: fork
---

# Visual inspector

このskillの推論強度は`../runtime-model-profiles.md`の`standard-execution`に従う。UI確認の依頼を受けたchildは、許可されたrepository context、確認項目、artifact path、DoDを満たすまで確認する。

## 必須入力

parentはchildへ自由なMarkdownで次を渡す。

- 確認するUI操作と期待結果
- task / phaseとDoD
- artifact directory
- 必要なら対象データの準備方法
- maintainerが返した許可済みcontext

repository固有のURL、認証、browser設定、準備command、保存先が必要なら、parentまたはchildは`maintenance-plugin-context`へconsumer=`visual-inspector`、必要理由、必要section=`visual-inspector`と`共通/プロジェクト指示`、確認元候補を渡す。`available`で返った値だけを使う。必須値が無ければURLやcommandを推測せず、`blocked`として返す。

## 実行

1. contextが示すbrowser設定と保存先を確認する。
2. artifact directoryをtaskまたはphaseごとに分ける。親が渡したdirectory以外へ一時scriptや画像を散らさない。
3. 必要なbrowser scriptを作り、対象の操作を実行する。
4. screenshotを読み、期待結果と実際の見た目・操作結果を比較する。
5. artifact directoryに`result.md`を作る。各確認項目の期待値、実測結果、証跡path、総合結果を残す。

認証情報は既存の安全な取得経路だけを使い、scriptや共有設定へ書き込まない。データが無い時は、parentが許可した手段で準備する。確認できなかったことを成功扱いにしない。

## 返却形式

```markdown
status: passed | failed | blocked
artifact directory: <path>
result: <result.md path または unavailable>
checks:
- <確認項目>: passed | failed — 期待値 / 実測値 / screenshot path
summary: <親がDoD判定できる短い説明>
next action: <修正、再確認、または必要な入力>
```

`failed`または`blocked`では、成功と読める表現を混ぜない。

## host別の起動

### Claude Code

frontmatterの`model: sonnet`と`context: fork`で起動し、`$ARGUMENTS`に必須入力を渡す。

### Codex

直近parentがchildを起動し、必須入力と許可済みcontextをpromptへ渡す。childは結果だけを返し、tasklistのチェックやDoDの最終判定は変更しない。parentはprofileに応じたmodel選択、または親model継承をsummaryへ残す。
