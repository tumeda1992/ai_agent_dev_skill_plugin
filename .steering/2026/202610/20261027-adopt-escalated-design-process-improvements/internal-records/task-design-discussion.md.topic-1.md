# 内部検討記録: 論点1 — 暫定の判断の規範を、どこに正本として置き、どの経路から当てるか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点1

## 開始context

- 引き渡された改善 2: 暫定の判断を記録・提示するとき、暫定であること・理由・見直す条件（または切り出した先）を落とさない。
- 利用者が選んだ置き場所: 文書は plugin の文書規約に標準を足し、`document-review` の作成時・更新時の観点に加える。提案は `think-through` に問いを足す。
- 決める範囲: 規範の正本の file、`document-review` 以外に要る経路、提案に当てる問いの置き場所。規範の文面そのものは、置き場所の合意の後に書く。

<a id="iteration-0"></a>

## イテレーション0: 規範の正本と、当てる経路

<a id="iteration-0-record-1"></a>

### 調査: 既存の標準と、当てる経路の構成

確かめたもの:

- `docs/documentation_standards/README.md`: 標準を増やしたら `document-review` の観点にするかを判断する。判断の問いは「この標準は、書かれた文に当てて、満たすか満たさないかを判定できるか」。何を書くか・どこに置くかを扱う標準は観点にしない。観点の向きが「書いてはいけないものが入っていないか」なら、`document-review` は steering の作業記録に当たらないため、作業記録を書く skill 側にも trigger が要る。
- `docs/documentation_standards/stock-and-flow-information.md`: 情報の寿命で置き場所と書き方を分ける上位方針。ストック情報のアンチパターン「議論結果をそのまま転記する」は、結論だけを載せず因果と具体背景を添えて書き直すよう求める。暫定性・見直しの条件には触れていない。
- `skills/document-review/SKILL.md`: 作成時観点と更新時観点に、標準 file を一つずつ列挙する。対象は docs と skill 本体。
- `confidentiality.md` を参照する本文: `task-design/SKILL.md`、`steering/SKILL.md`、`facilitate-discussion/SKILL.md` に「成果物へ書く前に、その記述が機密情報にあたるかを `confidentiality.md` の判定で確認する」がある。
- `skills/think-through/SKILL.md`: 作法の正本は `docs/think_standards/` にあり、`think_standards/README.md` の引き方に従うと書くだけ。
- `docs/think_standards/README.md`: 場面ごとの file を持つ。「案を作る・提示する・選ぶとき」は `making_and_choosing_options.md`。
- plugin の docs と skills を「暫定」で検索した。暫定の判断の書き方を扱う規則は無い（ヒットするのは「暫定指示」「暫定全体」等の別の意味）。

結果:

- 規範は「書かれた文に当てて、満たすか判定できる」ため、`document-review` の観点にできる。観点にするには、観点にならない `stock-and-flow-information.md` の中ではなく、独立した標準 file が要る。
- 具体例 b は steering の作業記録（`design.md`）で起きた。`documentation_standards/README.md` の基準では、この規範の向きは「読者が使えるか」に近いが、steering の記録も後続の作業が前提として読むため、作業記録にも届かせる必要がある。
- 提案に当てる問いは、`think_standards/making_and_choosing_options.md` が場面として合う。

<a id="iteration-0-record-2"></a>

### 判断: 正本の置き場所と経路

推奨: 新しい標準 `provisionality_explicitness.md` に正本を一つ置き、`document-review` の観点（docs・skill）、task-design の本文と design の template の非目標（作業記録）、`making_and_choosing_options.md`（提案）から当てる。

採らない形と理由:

- `stock-and-flow-information.md` を広げる: 観点にできず、`document-review` で縛れない。
- `document-review` だけ: 作業記録へ届かない。
- `think-through/SKILL.md` 本体: 正本が二つになる。

代償: 文書標準が一つ増え、`document-review` の観点が一つ増える。task-design の本文に参照の一文が増える。

<a id="iteration-1"></a>

## イテレーション1: 決定から導いた README の変更

<a id="iteration-1-record-1"></a>

### 照合: 決定と `documentation_standards/README.md` の観点の向き

入力:

- 決定（論点1）: 新しい標準を `document-review` の観点にし、task-design の本文と design の template からも参照する。
- `documentation_standards/README.md` の「標準の置き方」: 観点の向きは 2 つ。「読者がその doc で使えるか」は読者向けの doc にだけ当たり、作業記録には当たらない。「書いてはいけないものが入っていないか」は公開範囲へ置かれるものすべてに当たるため、作業記録を書く skill 側にも trigger が要る。

照合:

- 新しい標準の判断の問いは「読み手が恒久の方針と受け取らないか」であり、読者の側から見る。前者に当たる。
- 前者なのに作業記録へ trigger を置くため、README の説明のままでは決定と食い違う。
- 後者へ分類する形も検討した。後者の説明は公開範囲を前提にしており（機密性の標準が該当）、暫定性には当てはまらない。

結果:

- README の前者の説明に、「後続の作業が作業記録を前提として読み、その書き方で失敗が起きる標準は、前者でも作業記録を書く側に trigger を置く」という条件を足す。条件は決定の選択理由（具体例 b は後続の design が先行 steering の記録を前提に書いたことで起きた）から導いた。
- 変更内容として報告し、利用者の次の実応答を確認してから design に足す。

<a id="iteration-2"></a>

## イテレーション2: 構造reviewから導いた変更

<a id="iteration-2-record-1"></a>

### 検証: 設計時の skill-update-review

入力: design.md の構造案（論点1 の決定を反映した版）と、対象 file の現行版。材料・内容 hash・判定の根拠は [設計時の構造review](../artifacts/design-structure-review.md) に保存した。

結果: 不合格 3（making_and_choosing_options.md の節の見出し）。決定を変えず、決定から導ける細部として解消条件を変更内容に書き、利用者へ報告する。利用者の次の実応答の後に design.md へ反映し、反映した構造案を同じ材料で再照合する。

<a id="iteration-2-record-2"></a>

### 反映と再照合: 実応答の後の design.md への反映

入力: 利用者の実応答「ok」（2026-10-28。報告した 4 件すべてに対するもの。原文は [discussion の現在の変更](../task-design-discussion.md#現在の変更論点1)）。

結果:

- design.md 改善2 の経路の表の `making_and_choosing_options.md` の行を、補助節「補助: 提案が暫定か恒久かを示す」の形へ直した。表の後に、`evolution_policy.md` に基づく理由の段落を足した。
- 同じ材料で再照合した。材料 16 file の内容 hash は前回と一致し、`plugins/` 配下は未変更（HEAD `44c4992`）。不合格 3 は解消した。詳細は [設計時の構造review・再照合](../artifacts/design-structure-review.md#再照合)。
- 訂正: 変更内容1 の「反映の時期: design 合意の後に適用する」は、task-design の Step 4（`task-design内の対象成果物反映待ち` がゼロであることを design 合意の条件にする）と食い違う。対象 file への適用と validation は design 合意の前に task-design 内で行う。discussion の現在の変更に記録し、次の chat で報告する。

<a id="iteration-3"></a>

## イテレーション3: 適用中に見つけた変更

<a id="iteration-3-record-1"></a>

### 照合: template の非目標の comment と正本の「該当しない例」

入力:

- design.md 改善2 の経路の表の `templates/design.md` の行: 「非目標」の comment に「今回扱わない理由と、見直す条件または切り出した先を書く」を足す。
- 適用した `provisionality_explicitness.md` の「該当しない例」: 責務の境界に基づく恒久の判断には、見直す条件を求めない。
- design.md の「テスト方針」の検証 case 2: 「facilitate-discussion は変えない」は恒久の判断であり、見直す条件は求めない。

結果:

- 非目標には暫定の判断と恒久の判断が並ぶ。comment が見直す条件を一律に求めると、正本と検証 case 2 と食い違う。
- 適用時に「責務の境界など、今回に限らない判断なら見直す条件は要らない」を足したが、報告の前に適用した形になるため、対象 file を design の文面に戻した。
- 変更内容3 として報告し、利用者の次の実応答の後に design.md と対象 file へ反映する。

<a id="iteration-3-record-2"></a>

### 反映: 実応答の後の design.md と対象 file への反映

入力: 利用者の実応答「a」（2026-10-28。論点4 への回答で、同じ chat で報告した変更内容3 への異論は無い。原文は [論点4 の提案0へのフィードバック](../task-design-discussion.md#提案0へのフィードバック論点4)）。

結果:

- `plugins/tumeda-dev/skills/task-design/templates/design.md` の「非目標」の comment に「責務の境界など、今回に限らない判断なら見直す条件は要らない」を足した。
- design.md 改善2 の経路の表の `templates/design.md` の行を同じ文面へ直し、理由を添えた。
