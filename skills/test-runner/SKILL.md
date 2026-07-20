---
name: test-runner
description: >
  repository contextから渡されたtest commandを実行し、失敗を原因まで分析して親へ返すsubagent skill。
  test実行、失敗分析、再実行確認が必要な時に使う。
model: sonnet
context: fork
---

# Test runner

このskillの推論強度は`../runtime-model-profiles.md`の`standard-execution`に従う。test commandを独自に作らず、repositoryが返した前提とcommandだけを実行する。

## 必須入力

parentはchildへ次を渡す。

- 実行対象と確認したい挙動
- DoD
- 許可されたtest commandと前提条件
- 失敗時に読むべき関連path（あれば）
- maintainerが返した許可済みcontext

command・前提・test方針が必要なら、`maintenance-plugin-context`へconsumer=`test-runner`、必要理由、必要section=`共通/プロジェクト指示`、`共通/テスト方針`、`共通/全体 test command`、確認元候補を渡す。必須commandが`unavailable`なら実行せず`blocked`として返す。

## 実行

1. commandと前提を読み、満たせない前提を先に報告する。
2. 指定commandを実行し、成功/失敗、対象数、失敗名、標準出力・標準エラーの要点を取得する。
3. 失敗時は、再現条件、直接原因、根本原因候補を分ける。エラーを隠す変更や、根拠のないretryを提案しない。
4. 修正案が必要なら、最小修正と再実行すべきcommandを示す。実装・tasklist更新は親の責務である。

## 返却形式

```markdown
status: passed | failed | blocked
command: <実行したもの、または unavailable>
summary: <成功/失敗件数と結論>
failures:
- <test / error>: <直接原因> / <根本原因候補>
evidence: <重要な出力またはpath>
recommended next action: <修正または再実行>
```

## host別の起動

### Claude Code

frontmatterの`model: sonnet`と`context: fork`で起動し、`$ARGUMENTS`に必須入力を渡す。

### Codex

直近parentがchildを起動し、必須入力と許可済みcontextをpromptへ渡す。childはtest結果と分析だけを返し、tasklistやDoDを更新しない。parentはprofileに応じたmodel選択、または親model継承をsummaryへ残す。
