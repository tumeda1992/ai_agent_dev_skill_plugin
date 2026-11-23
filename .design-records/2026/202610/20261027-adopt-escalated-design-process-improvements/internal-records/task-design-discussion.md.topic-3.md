# 内部検討記録: 論点3 — 作業を破棄しても残る変化の引き継ぎ観点を、design 合意判定でどう確かめるか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点3

## 開始context

- 引き渡された改善 1: design 合意判定（Step 4）で、作業を破棄しても残る変化（既定 branch への merge による deploy、schedule の有効化、外部 service の設定変更など）が含まれるかを確かめる。含まれる場合、それを後から止める・確かめる・変える手段が受け入れ基準にあることを、design 合意の前に確かめる。
- 具体例: 定期実行の schedule を有効にする作業で、design 合意の後、tasklist 設計で `tasklist-design.md` の MUST に当たり、合意済みの design へ戻って合意をやり直した。
- 決める範囲: Step 4 に置く問いと、`tasklist-design.md` の既存の MUST・判定の定義との関係。

<a id="iteration-0"></a>

## イテレーション0: 判定の定義の置き場所と、Step 4 の確認項目

<a id="iteration-0-record-1"></a>

### 調査: 判定の定義と MUST が、どこで読まれるか

確かめたもの:

- plugin 全体を「作業の外へ残る」「破棄しても残る」で検索した。該当は `task-design/tasklist-design.md` の節、`task-design/templates/design.md` の受け入れ基準の comment、`maintenance-plugin-context/SKILL.md`（tasklist 設計で利用先の差し込み宣言を要求できる旨）、`tumeda-dev-plugin-context.md`（差し込み宣言の template）だけである。`roadmap-design.md` には無い。
- `tasklist-design.md` の「作業の外へ残るactionを含むphaseの原則」: 判定の問い、例の表（6 行）、判定に使わない観点（破壊的・後方非互換ではなく変化の及ぶ範囲）、利用先依存の注記、MUST 3 つ（単独 phase、停止・確認 task、受け入れ基準へ引き継ぎの観点を入れる）、理由、利用先固有の差し込み。
- `tasklist-design.md` の冒頭: 「長さのために`SKILL.md`から分割したtask-design本体の一部である。leaf判定後、`tasklist.md`を作る直前に先頭から末尾まで完全に読む」。`SKILL.md` の 2 箇所（§4、Step 5）も同じ読取の時点を定める。
- `SKILL.md` Step 4: 合意判定の条件として、要件の分類、TBD の解消、収束、分類保留ゼロ、反映待ちゼロ、自己チェック、ネガティブ定義、読み手セルフレビュー、新しい判断基準の検証、確認範囲の照合を持つ。作業の外へ残る変化に関する項目は無い。
- `templates/design.md` の受け入れ基準の comment: 「この作業を破棄しても残る変化があるなら、それを後から更新・確認・復旧できることを受け入れ基準へ入れる」と、存在確認ではなく操作で検証できる形で書くこと。

結果:

- 受け入れ基準を求める MUST と判定の定義は、design 合意の時点で読まれない file にある。
- template の comment は同じ趣旨を書いているが、記入時の注意であり、具体例でも外した。
- 判定の定義のうち、design に関わるもの（問い・例・判定に使わない観点）と、tasklist に関わるもの（単独 phase、停止・確認 task）が一つの節に混ざっている。

<a id="iteration-0-record-2"></a>

### 判断: 定義を本体へ移し、分割 file から参照する

推奨: 判定の問い・例の表・判定に使わない観点・利用先依存の注記を `SKILL.md` Step 4 の新しい確認項目へ移す。`tasklist-design.md` は phase の作り方の MUST と差し込みだけを残し、判定は Step 4 を参照する。受け入れ基準へ入れる MUST は、「Step 4 で入れた観点を前提にし、無ければ design へ戻す」に置き換える。

確認の語は既存の「更新・確認・復旧」を使う。引き渡された提案の「止める・確かめる・変える」は具体例（schedule）に寄った語であり、「止める」は「更新」「復旧」に含まれる。語を増やすと既存の template の comment と食い違う。

採らない形と理由:

- Step 4 から `tasklist-design.md` の節を参照する: 分割 file の読取の約束（plan phase の直前に完全に読む）が崩れる。`SKILL.md` は常に全部読まれるため、参照の向きは分割 file から本体にする。
- template の comment を強める: 既にあり、外した。記入時の注意は関門にならない。
- 定義を両方に置く: 二箇所に分かれ、片方だけ直されて食い違う。

代償: `SKILL.md` が判定の定義の分（約 15 行）だけ長くなる。`tasklist-design.md` の節は短くなり、判定のために本体を参照する。

<a id="iteration-1"></a>

## イテレーション1: 構造reviewから導いた変更

<a id="iteration-1-record-1"></a>

### 検証: 設計時の skill-update-review

入力: design.md の構造案（論点3 の決定を反映した版）と、対象 file の現行版。材料・内容 hash・判定の根拠は [設計時の構造review](../artifacts/design-structure-review.md) に保存した。

結果: 不合格 4（tasklist-design.md の対象actionの定義）。決定を変えず、決定から導ける細部として解消条件を変更内容に書き、利用者へ報告する。利用者の次の実応答の後に design.md へ反映し、反映した構造案を同じ材料で再照合する。

<a id="iteration-1-record-2"></a>

### 反映と再照合: 実応答の後の design.md への反映

入力: 利用者の実応答「ok」（2026-10-28。報告した 4 件すべてに対するもの。原文は [論点1 の現在の変更](../task-design-discussion.md#現在の変更論点1)）。

結果:

- design.md 改善1 の `tasklist-design.md` の変更表に「節の冒頭」の行を足し、判定の問い等の行を「削る。対象actionの判定は冒頭の一文で Step 4 へ渡す」に直した。表の後に、作業単位から phase 単位へ渡す一文が要る理由の段落を足した。
- 同じ材料で再照合し、不合格 4 は解消した（`tasklist-design.md` の「対象action」は 21・36〜39・43・169 行で使われ、冒頭の定義がこれらを覆う）。詳細は [設計時の構造review・再照合](../artifacts/design-structure-review.md#再照合)。
