# 内部検討記録: 論点10 — 見つけた不備を問いにする前に、何を確かめるか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点10

## 開始context

利用者が「それでそんな問題起きる？みたいなことで何度か答えさせられてる」と述べた（2026-10-31）。
問いの出どころを確かめると、答えが既にあった問い・誤りが起きていない問いは、どれも assistant が起こしていた（[論点8 の内部検討記録、イテレーション1 の記録1](./task-design-discussion.md.topic-8.md#iteration-1-record-1)）。
利用者の指示（AGENTS.local.md）は、誤りの原因を文書に求めて文書を直すことである。

<a id="iteration-0"></a>

## イテレーション0: 確かめることと、書く場所

<a id="iteration-0-record-1"></a>

### 調査: 既にある規則と、欠けている問い

#### 入力

- 問い: 問いにする前に確かめるべきことのうち、思考標準と skill が既に持つものは何か。欠けているものは何か。
- 方法: 2026-10-31 に、`docs/think_standards/` の README と `advancing_discussion.md`・`receiving_feedback.md`・`evolution_policy.md`、facilitate-discussion の `derived-change.md` を読んだ。`think_standards`・`think-through`・`facilitate-discussion` を「実害」「誰が何を」「起きる場面」「問う前」で検索した。

#### 結果

- 答えが既にあるか: 既にある。
    - `receiving_feedback.md` の主軸は、外部にある情報（既存 docs、論理的帰結）は自分で取りに行くとする。
    - facilitate-discussion の `derived-change.md` は、既決事項から一意に導いた変更を、採否を問わずに報告するとする。
    - 論点1 と論点8 は、この当てはめの誤りである。
- 直さなかった時に誤る場面があるか: 無い。検索で該当は無かった。
    - facilitate-discussion の論点を起こす判定は、決定が目的・実装範囲を変えるかを問う。不備が実際に誤りを起こすかは問わない。
    - template の件は、この問いがあれば出なかった。

<a id="iteration-0-record-2"></a>

### 判断: 書く場所と形

#### 入力

- 問い: どこに、どの形で書くか。
- 方法: 上の結果と、`evolution_policy.md` の主軸と補助の規律を照らした。

#### 結果

- 推奨: `advancing_discussion.md` の補助にする。
    - 問いを出すのは、設計・review・実装のどの場面でも起きる。AGENTS.md の判断の問い（テスト・設計・レビューのいずれにも前提なしに当てはまるか）に当たるため、思考標準に置く。
    - 主軸（問いはロジックツリーの上位から）とは別の判断なので、「補助:」を付ける。
- 採らなかった場所:
    - facilitate-discussion の論点を起こす判定: discussion の外（chat）で出す問いに効かない。template の件は chat で問うた。
    - `think-through/SKILL.md`: 思考標準の内容の正本は `think_standards/` であり、SKILL.md は入口だけを持つ。
- 答えが既にあるかは、新しい規則を足さず、`receiving_feedback.md` への参照にする。同じ規則を二か所に持たない。
- 例は、利用先・この repository の固有名を除いた形で書く。
