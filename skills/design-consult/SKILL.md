---
name: design-consult
description: >
  設計上の悩みをdeep-design profileの独立した視点で分析する。
  型設計、責務境界、アーキテクチャ、パターン選定、複数案のトレードオフに迷う時に使う。
model: opus
context: fork
---

# Design consult

設計相談を独立したchildへ渡し、親が結果を利用者の相談へ統合する。modelの意味は`../runtime-model-profiles.md`の`deep-design`に従う。profileに合うCodex modelを選べるなら選び、選べないruntimeでは親modelを継承する。存在しないmodel名を作らない。

## 入力

自由なMarkdownで次を受け取る。

- 背景と現在の制約
- 悩み（何を決めるか）
- 既知の選択肢と未確定点
- 必要なら、repository固有の確認元候補

入力が薄くても、利用者へ穴埋めだけを要求しない。与えられた事実から、仮定と限界を明示して相談を始める。repository固有のarchitectureや規約が必要な時だけ、`maintenance-plugin-context`にconsumer=`design-consult`、理由、必要section=`共通/アーキテクチャ文書`、確認元候補を渡す。`available`で返った範囲だけをchildへ渡す。

## childへ渡す相談

child promptには、相談本文、許可されたrepository context、守る制約、次の出力形式を渡す。parentはchildに、未許可のrepository pathを探索させない。

```markdown
あなたはソフトウェア設計のconsultantです。結論だけでなく、判断が変わる条件を明示してください。

## 相談
{consultation}

## 許可されたrepository context
{allowed_context または "なし"}

## 回答形式
1. 問いの再定義: 表面の質問の背後にある設計上の問いと、難しさの構造
2. 選択肢の分析: 各案の利点、欠点、暗黙の前提、将来の具体的な帰結
3. 見落としがちな観点: 選択肢外の案または隠れた前提
4. 条件付き推奨: どの条件で何を選ぶか。その理由
5. 推奨の弱点: 崩れる条件、追加で確かめるべき事実
```

## host別の起動

### Claude Code

frontmatterの`model: opus`と`context: fork`でchildを起動する。`$ARGUMENTS`と、maintainerが返した許可済みcontextだけをpromptへ渡す。

### Codex

親sessionがsubagentを起動する。child promptには上記の相談、許可済みcontext、出力形式をそのまま渡す。childが返した分析を親が読み、相談への回答として統合する。parentは利用したprofileと、modelを選択したか親modelを継承したかを短いsummaryに残す。

## 返却

childの文章を無検証で転送しない。親は、利用者の問いへの答えとして矛盾、未検証の仮定、contextの範囲逸脱を確認し、必要なら差分を説明して統合する。結論、条件、残る検証事項を区別して返す。

設計決定が複数stepの実装へ進むなら、`task-design`または`steering`へ引き継ぐ。相談の内容をrepositoryの議論記録に残すかは、該当skillの記録規則に従う。
