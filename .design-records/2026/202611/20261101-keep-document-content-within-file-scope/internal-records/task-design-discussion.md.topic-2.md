# 内部検討記録: 論点2 — 範囲との照合の規範を、どの skill のどの位置から引けるようにするか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点2

## 開始context

- 問題: 論点1で、範囲との照合の規範を `naming/core.md` に置いた。`development_standards/` を全て読む契約を持たない skill からは届かない。
- 決める範囲: 規範への参照を置く skill と、その位置と文。
- 開始時の既決条件:
    - 論点1の決定（規範の置き場所と本文、skill へ本文を写さない）。
    - design.md の候補: doc-enricher の Phase 2「置き場所の決め方」、task-design の outcome section `documentation.md` の「既存documentへ統合するか」、steering の Step 4-2 の三問目。
- 残る不足: 候補の他に置き場所を決める場面があるか、各候補の位置。

<a id="iteration-0"></a>

## イテレーション0: 規範を引く入口

<a id="iteration-0-record-1"></a>

### 調査: 中身を足す先を選ぶ手順を持つ skill はどれか

#### 問い・探索先・方法

- 問い: plugin の skill のうち、文書や code へ中身を足す先を選ぶ手順を持つものはどれか。その手順は、どの位置で、どの基準で選んでいるか。
- 探索先: `plugins/tumeda-dev/skills/` の doc-enricher、task-design の `templates/outcome-sections/documentation.md`、steering、facilitate-discussion、tasklist-executor、think-through。
- 方法: `置き場所` と `どこに書けば` の grep と、該当箇所の前後の通読。

#### 結果

- doc-enricher:
    - Phase 1 のステップ2 の抽象化の段で、止まった段を置き場所とする。
    - Phase 2 の「置き場所の決め方」が、知識の抽象レベルに対応する文書を選ぶ基準と、レベルから文書への対応を持つ。
    - Phase 1 のステップ5 は、提案に含める項目（file path、section、箇条書き）を並べるだけで、選ぶ基準を持たない。
- task-design の `documentation.md`: 記述の MUST に「既存documentへの統合または新owner作成の理由を明示する」があり、template の欄に「既存documentへ統合するか: {統合先または新ownerと理由}」がある。理由の中身は問わない。
- steering: Step 4-2 の三問目「どこに書けば次回この議論が不要になるか」で、再発防止の書き先を提案する。`development_standards/` を読む契約は無い。
- facilitate-discussion: 原因 owner が repository 知識なら doc-enricher を提案 mode で起動する。自分では置き場所を選ばない。
- tasklist-executor: design と tasklist に決まった置き場所へ反映する。置き場所を選ばない。
- think-through: 毎ターン注入される思考の作法で、置き場所を選ぶ場面に限った手順は持たない。

#### 限界

- grep の語（`置き場所`、`どこに書けば`）に当たらない言い回しで置き場所を選ぶ手順があれば、見落とす。上の六つ以外の skill は通読していない。

<a id="iteration-0-record-2"></a>

### 判断: 入口をどこに置くか

#### 判断対象・必須条件・根拠

- 判断対象: 規範への参照を置く skill と位置。
- 必須条件:
    - 置き場所を選ぶ場面をすべて覆う。
    - 規範の本文を skill へ写さない（論点1の決定）。
    - 参照を置く位置自身が、論点1の規範を通る。
- 根拠: record 1。

#### 評価

- doc-enricher:
    - 基準を持つのは「置き場所の決め方」なので、ここへ置く。範囲との照合は置き場所を選ぶ基準であり、この項目の範囲に入る。ステップ5 は基準を持たないため入らない。
    - 「置き場所の決め方」の子の箇条書きは、抽象レベルから文書への対応である。範囲との照合はその対応の一つではないため、子にせず同じ深さの項目にする。
- task-design:
    - 規範は設計前調査で context に入る。それでも、統合先を決める欄に問いが無ければ、決める瞬間に引く契機が無い。
    - 起点の失敗は、この欄にあたる判断で起きた。
    - MUST の文と template の欄の両方を変える。MUST は書き手への指示、欄は design に残る結果であり、片方だけでは照合した結果が design から読めないか、照合する指示が無い。
- steering: 書き先を提案するのに `development_standards/` を読まないため、参照が無いと届かない。三問目の子として置く。
- facilitate-discussion: doc-enricher を経由するため、doc-enricher の入口で覆える。足さない。
- tasklist-executor、think-through: 置き場所を選ばない、または場面の範囲の外である。足さない。

#### 結論

- 推奨: doc-enricher の「置き場所の決め方」の次の項目、task-design の `documentation.md` の MUST と欄、steering の Step 4-2 の三問目の子。三つを一つの変更集合にする。
- 最終案への影響: どの入口も本文を持たず、論点1の section への link だけを持つ。link の anchor は見出しから句読点を除いた形にする。
