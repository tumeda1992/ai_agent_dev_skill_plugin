# 内部検討記録: 論点5 — 既存の commit を書き換えないという考え方を plan-commits に書くか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点5

## 開始context

利用者が design 全体に「ok」と答えた発言（2026-10-31）で、WIP の commit を作り直さない（steering の `discussion.md` の論点1 の b）理由を説明した。「コミット単位は、歴史を理解する単位として厳密にするけど、強硬派のように、コミットを書き換えてでも間違った歴史にしない強制力をするほどじゃ無いと思っているから。うまい単位にならない可能性もあるし」。
この考え方を plugin のどこかへ書くかを決める。design の合意の後に生じた論点であり、合意済みの design へ要件を一つ足すことになる。

<a id="iteration-0"></a>

## イテレーション0: 書く先と文

<a id="iteration-0-record-1"></a>

### 調査: plugin の今の文と、この session で書き換えを既定にした場面

#### 入力

- 問い: plugin は既存の commit の書き換えをどう扱っているか。この考え方が無いことで、何が起きたか。
- 方法: 2026-10-31 に `plan-commits/SKILL.md` を「既存履歴」「書き換」「amend」「rebase」で検索し、該当箇所を読んだ。この session の提案を見直した。

#### 結果

- `plan-commits/SKILL.md` は「利用者が現状保存を明示した場合」の段落で「既存の保存commitを、履歴が整わないという理由だけで改変しない」と書く。対象は現状保存の commit に限られる。冒頭は「既存履歴の変更は別の権限である」と書く。
- この session で assistant は、既存の commit の書き換えを二度既定にした。
    - 論点3 の提案0: 確認で直すところが出た phase の commit を、push の前に書き換える。利用者は「指摘修正で追いコミットでいいんじゃ無い？」と答えた。
    - steering の `discussion.md` の論点1: WIP の commit を作り直して force push する案を推した。利用者は「b」（作り直さない）を選んだ。
- validator に、「既存の保存commit」の文の assertion は無い。

<a id="iteration-0-record-2"></a>

### 判断: plan-commits に書くか

推奨: plan-commits の「既存の保存commit」の一文を、既存の commit 全般に広げた段落へ置き換える。決め手は、同じ session で二度、書き換えを既定にしたこと。どちらも、既存の commit を書き換えないという考え方が手元にあれば出なかった。

- plan-commits に書く（推奨）
    - commit の単位を決める正本が plan-commits であり、論点4 で task-design と tasklist から plan-commits へ辿る導線を置いた。同じ正本に置けば、導線の先で読まれる。
- think-through や docs に書く
    - commit に固有の判断であり、思考の作法一般ではない。
- 書かない
    - 今の文は現状保存の commit に限られ、確認の後の指摘修正や WIP の commit には効かなかった。

#### 判断結果が規定するもの

- `plan-commits/SKILL.md` の一段落と、validator の assertion。
- design.md の要件に一つ足す。

<a id="iteration-0-record-3"></a>

### 応答: 提案0 への利用者の答え

#### 入力

- 2026-10-31 の利用者の発言「plan-commitに関係ない気もするけど、一旦ここに間借りさせるか」

#### 結果

- 提案0 の文を採る。置き場所は暫定とする。暫定にした理由は、利用者が plan-commits との関係を疑ったことである。
- 見直す条件は発言に無い。イテレーション1 で導出して報告する。

<a id="iteration-1"></a>

## イテレーション1: 間借りの見直す条件

<a id="iteration-1-record-1"></a>

### 調査: plan-commits を通らない場面と、移す先の候補

#### 入力

- 問い: 置き場所の弱点はどこにあるか。移すならどこか。
- 方法: 2026-10-31 に次を行った。
    - この session で書き換えを既定にした二つの場面が、plan-commits を通ったかを見直した。
    - `docs/development_standards/README.md` の「この群の置き方」と「この群の引き方」、`development_flow/` の 2 file の冒頭を読んだ。
    - skills と docs を「amend」「rebase」「force push」「書き換え」で検索した。

#### 結果

- 二つの場面は、どちらも plan-commits を通らなかった。
    - 論点3 の提案0: tasklist の契約を設計する議論の中だった。
    - WIP の commit を作り直す案: 作業中の PR を共有した後、steering の `discussion.md` の論点1 の中だった。
- `docs/development_standards/README.md` は、「開発そのもの（何を作るか、どう名付けるか、どう進めるか）」をこの群へ置くと定める。task-design は設計前にこの群の配下をすべて読む。
- `development_flow/` には `branch_pr_issue.md`（branch・PR・issue の対応）と `work_scope.md`（作業の範囲）がある。commit や履歴の扱いを扱う file は無い。
- 検索で、`share-work-in-progress/SKILL.md` の「起動gate」に「このskillが作るcommitは、後からamendやrebaseで整理される前提を持つ。履歴として残すためのcommitではない。」が見つかった。
    - 論点5 の決定と逆の既定を渡す。論点6 で扱う。

<a id="iteration-1-record-2"></a>

### 判断: 見直す条件

- 見直す条件は二つ。
    - plan-commits を通らない場面で、既にある commit の書き換えを再び既定にした時。置き場所の弱点は、plan-commits を通らない場面で読まれないことにある。弱点が実際に効いた時が、移す理由になる。
    - `development_flow/` に commit や履歴の扱いを書く時。同じ主題の正本が二つにならないようにする。
- 移す先の候補: `docs/development_standards/development_flow/`。
    - 開発の進め方の判断基準の群であり、task-design が設計前に全部読むため、設計の議論で読まれる。
- skill の本文には書かない。
    - 規則は暫定ではなく、暫定なのは置き場所だけである。
    - 暫定性の明示の標準の「判定の問い」に当てると、本文だけを読んだ読み手が規則を恒久と受け取っても誤りにならない。

#### 判断結果が規定するもの

- design.md の MUST の論点5 の行の、見直す条件の文。

<a id="iteration-1-record-3"></a>

### origin review: doc-enricher の提案 mode（論点5 の決定について一度だけ）

#### 入力

- origin: 論点5 の決定（既にある commit を書き換えない段落を plan-commits に置く。置き場所は暫定）。plan-commits へ即時反映済み。
- 対象: `plugins/tumeda-dev/docs/development_standards/`（README と `development_flow/`）、`plugins/tumeda-dev/skills/README.md`。

#### 結果

候補なし。

- 既にある commit を書き換えない原則を `development_flow/` へ書く案: DROP。
    - 同じ原則を plan-commits と docs の二か所に置くと正本が二つになる（Gate G）。
    - docs へ移すかは、この決定の見直す条件（変更内容1）で扱う。
- skills の README へ plan-commits の説明を足す案: DROP。
    - 一覧の一行は skill の用途を示すもので、原則を載せる場所ではない（Gate F）。
