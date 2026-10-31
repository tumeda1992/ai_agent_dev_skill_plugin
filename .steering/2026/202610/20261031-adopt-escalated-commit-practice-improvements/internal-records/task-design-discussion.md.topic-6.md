# 内部検討記録: 論点6 — share-work-in-progress の「後から整理される前提」を、論点5 の決定に合わせるか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点6

## 開始context

論点5 の決定を plan-commits へ反映した後、置き場所の見直す条件を調べるため、skills と docs を「amend」「rebase」「force push」「書き換え」で検索した（[論点5 の内部検討記録、イテレーション1 の記録1](./task-design-discussion.md.topic-5.md#iteration-1-record-1)）。
`share-work-in-progress/SKILL.md` の「起動gate」に、論点5 の決定と逆の既定を渡す文が見つかった。

<a id="iteration-0"></a>

## イテレーション0: 書き換えるかと文

<a id="iteration-0-record-1"></a>

### 調査: 文の中身と、効いた場面

#### 入力

- 問い: この文は何を既定にしているか。実際に判断へ効いたか。design の合意とどう関わるか。
- 方法: 2026-10-31 に `share-work-in-progress/SKILL.md` の全体を読んだ。steering の `discussion.md` の論点1 の検討記録と、design.md の非目標・受け入れ基準を読んだ。

#### 結果

- 文: 「このskillが作るcommitは、後からamendやrebaseで整理される前提を持つ。履歴として残すためのcommitではない。」
    - WIP の commit を、後で書き換えるものとして読み手に渡す。
- steering の `discussion.md` の論点1 の検討記録は、WIP の commit を作り直す案の根拠にこの文を挙げている。利用者は作り直さない b を選んだ。
- design.md は「`share-work-in-progress` と `skills/README.md` の書き換え」を非目標にしている。
    - 理由は「tasklist-executor の契約の原則は変わらない」であり、この文は扱っていない。
- 同じ skill の「このskillが絶対にやらないこと」は force push を禁じる。
    - push 済みの WIP の commit を後から書き換えるには force push が要る。この skill の中で、書き換えの前提と force push の禁止が並んでいる。

<a id="iteration-0-record-2"></a>

### 判断: 書き換えるか、消すか、残すか

推奨: 書き換える。決め手は、WIP の commit が意味の単位でないことを残しつつ、書き換えを既定にする部分だけを外せること。

- 書き換える（推奨）
    - 「意味の単位になっているとは限らない」で、WIP の commit の性質を保つ。
    - 「後から整理するかは利用者が決める」で、書き換えを既定から外す。
    - 既にある commit の扱いは plan-commits への参照にとどめ、規則を写さない。
- 消す
    - WIP の commit が意味の単位でないことが伝わらない。
- 残す
    - 論点5 の決定と逆の既定が残り、論点1 と同じ案が再び出る。

#### 判断結果が規定するもの

- `share-work-in-progress/SKILL.md` の「起動gate」の二段落目。
- design.md の非目標・受け入れ基準・完成後の姿・付録。
- validator の assertion。

<a id="iteration-0-record-3"></a>

### 応答: 提案0 への利用者の答え

#### 入力

- 2026-10-31 の利用者の発言「ok」。論点5 の変更内容1 の報告と、論点6 の提案0 を同じ message で示した後の答え。

#### 結果

- 提案0 を採る。`share-work-in-progress/SKILL.md`、validator、design.md へ反映した。
- validator は通り、`share-work-in-progress/SKILL.md` を `c1122f5` の版に戻すと 3 件で落ちることを確かめた。
- skill-update-review の 4 回目で合格した（`artifacts/skill-structure-review.md`）。

<a id="iteration-0-record-4"></a>

### origin review: doc-enricher の提案 mode（論点6 の決定について一度だけ）

#### 入力

- origin: 論点6 の決定（share-work-in-progress の、作る commit を後から整理する前提を外す）。即時反映済み。
- 対象: `plugins/tumeda-dev/skills/README.md` の share-work-in-progress の行、`plugins/tumeda-dev/docs/development_standards/`。

#### 結果

候補なし。

- skills の README の share-work-in-progress の行は用途と tasklist-executor の契約との関係を示し、後から整理する前提を書いていない。直す箇所は無い。
- 既にある commit の扱いを docs に書く案は、論点5 の origin review と同じ理由で DROP（正本が二つになる。論点5 の見直す条件で扱う）。
