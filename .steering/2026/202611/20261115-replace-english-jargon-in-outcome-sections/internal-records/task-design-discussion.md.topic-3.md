# 内部検討記録: 論点3 — 言い換えを、一語一訳の対応表で行うか、箇所ごとの書き直しで行うか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点3

## 開始context

- 問題: 論点1で見分ける問い、論点2で範囲（利用者の目に出る表現と、その入口になる記入guide）が決まった。次に各表現の言い換え先を決めるが、その前に言い換えの仕方を決める必要がある。owner→「担当」のように一語ずつ訳語を決めて置き換えるのか、箇所ごとにその文で言いたいことを書き直すのかで、後の作業の形が変わる。
- 決める範囲: 言い換えの仕方。個々の箇所の言い換え先、`caller-contracts.md`の見出しは決めない。
- 開始時の既決条件: 論点1、論点2の決定。file名は変えない。

<a id="iteration-0"></a>

## イテレーション0: 同じ語が、箇所によって違う意味で使われているか

<a id="iteration-0-record-1"></a>

### 調査: owner、contractの使われ方

#### 問い・探索範囲・方法

一語一訳が成り立つのは、同じ語がどこでも同じ意味で使われている時だけである。出現の多いownerとcontractが、箇所によって違う意味を載せているかを確かめる。

- 範囲: `plugins/tumeda-dev/skills/task-design/templates/outcome-sections/`の14 file
- 方法: `grep -n "owner" *.md`、`grep -n "contract" *.md`で全出現行を出し、前後の文を読んで意味を分類した。

#### ownerの意味

| 意味 | 例（file:行） |
| --- | --- |
| どのsectionにその内容を書くか（sectionの書き分け） | `caller-contracts.md:41`「owner境界:」、`catalog.md:25`「主ownerとなるsectionへ書き」、`README.md:47`「owner境界だけでなく」 |
| codeの中で、その責務を持つmodule・class | `code-structure.md:20`「各ownerが何を行わず」、`code-structure.md:71`「{Owner A} -> {Owner B} -> {Result owner}」 |
| workflowで判断・更新を行う担い手（skill、人） | `workflow.md`「ownerと責務」「各ownerについて、行う判断・更新と、行わないこと」 |
| 文書を更新する担い手 | `documentation.md:14`「更新owner」 |
| functionや記述が置かれている場所 | `contract-preservation.md:4`「owner変更」、`contract-preservation.md:32`「owner移動」 |
| 議論を記録している場所 | `README.md:135`「discussion owner」 |

#### contractの意味

| 意味 | 例 |
| --- | --- |
| 呼び出し元が依存する名前・入力・結果・失敗時の返し方・副作用の保証 | `caller-contracts.md`全体、`README.md`「caller contract」 |
| 移行前に存在した、挙動と判断能力を生む記述の単位（公開APIに限らず、順序、停止、例外、理由、失敗例、判断質問まで含む） | `contract-preservation.md:14`「ここでいうcontractは公開APIだけではない」 |

#### 解釈・残る不足・次action

- ownerは少なくとも六つ、contractは二つの意味で使われている。一語に一つの訳語を当てると、「owner境界」が「担当境界」になるだけで、何の境界かは依然として読み取れない。
- 箇所ごとに、その文で言いたいことを普段の言葉で書き直す方が、論点1の問い（普段の意味のまま読んで受け取れるか）を満たす。
- ただし、一つのsectionの中で同じものを繰り返し指す語（workflowの担い手、codeの責務を持つmodule等）は、そのsectionの中で一つの語に揃えないと、読者が別物と読む。
- 記入guideの中で全fileに繰り返し出る小見出し（「owner境界:」「なぜ必要か:」「NG:」「判断基準:」等）は、file間で同じ言い換えに揃えないと、同じ役割の部品だと分からなくなる。
