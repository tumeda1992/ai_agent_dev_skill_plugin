# 議論記録

## 論点1: 暫定の判断の規範を、どこに正本として置き、どの経路から当てるか

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点1）: 規範の正本と、当てる経路

#### 提案0（論点1）

規範の正本を新しい文書標準 `docs/documentation_standards/provisionality_explicitness.md`（暫定性の明示）に一つだけ置き、次の三つの経路から参照する。

**正本: `provisionality_explicitness.md`**

- 対象: 今回の範囲に限った判断（「今回は含めない」「今回は無効にする」）、条件付きの保留（「〜の場合のみ別途合意する」）、別の作業への切り出し。
- MUST: 暫定の判断を書くときは、次の 3 点を書く。
    - 暫定であること（今回の範囲の判断であり、恒久の方針ではないこと）。
    - 暫定にした理由。
    - 見直す条件、または切り出した先。
- 写すときの規則: design から README へ、先行の steering から後続の design へ写すときも、3 点を落とさない。結論だけを写さない。
- 判断の問い: 「見直す条件を知らない読み手がこの文だけを読んだら、恒久の方針と受け取らないか」。
- 具体例: 引き渡された具体例 a（README が暫定の無効化を「無効に保つため」と書いた）と b（design.md の非目標が条件付きの保留を「行わないと決定済み」と書いた）。
- 名前は、同じ階層の `referent_explicitness.md`（指示対象の明示）と同じ「〜の明示」の形にそろえる。

**経路 1: docs と skill 本体 — `document-review` の観点**

`document-review/SKILL.md` の作成時観点と更新時観点に「暫定性の明示 → `provisionality_explicitness.md`」を足す。md を出す前に必ず通る関門で当たる。

**経路 2: steering の作業記録 — task-design と design の template**

`documentation_standards/README.md` のとおり、`document-review` は docs と skill 本体にしか当たらず、steering の作業記録には当たらない。具体例 b は `design.md` の非目標で起きたため、経路 1 だけでは塞がらない。

- `task-design/SKILL.md` の、`confidentiality.md` を参照する既存の一文の隣に、「成果物へ暫定の判断を書くときは `provisionality_explicitness.md` で確認する」を足す。
- `task-design/templates/design.md` の「非目標」の comment に、「今回扱わない理由と、見直す条件または切り出した先を書く」を足す。暫定の判断が最も多く書かれる場所で、書くときに当たる。

**経路 3: 提案 — 思考標準**

`think-through` の本体は `docs/think_standards/` への入口だけを持ち、思考の作法の正本は `think_standards/` にある。

- `think_standards/making_and_choosing_options.md`（案を作る・提示する・選ぶとき）に、「提案が暫定か恒久かを示す」節を足す。
- 中身: 「今はやらない」「今回だけ」の判断を提示するときは、理由と、見直す条件または切り出す先を添える。判断の問い「この提案を受け取った人は、ずっとやらない判断と読まないか」。具体例 c（今はやらない非同期化を「どちらの形もやらない」と提示した）。
- 思考標準は文書標準を参照する形にせず、提案の場面で必要な問いだけを持つ。文書を書く場面の規則は `provisionality_explicitness.md` が持つ。

**採らない形**

- `stock-and-flow-information.md` の「議論結果をそのまま転記する」アンチパターンを広げる: 内容は近いが、この file は置き場所と書き方の上位方針であり、`documentation_standards/README.md` の基準では `document-review` の観点にならない。観点にできないと、経路 1 で縛れない。代わりに、このアンチパターンから `provisionality_explicitness.md` へ参照を足す。
- `document-review` の観点だけに足す: steering の作業記録へ届かない。`documentation_standards/README.md` が「やってしまいがちな失敗」として挙げている形そのものである。
- `think-through/SKILL.md` の本体に書く: 本体は入口だけを持つ構成であり、正本を二つにする。

#### 検討記録（論点1・イテレーション0）

利用者は、置き場所として「文書は文書規約に標準を足し、`document-review` の観点に加える。提案は `think-through` に問いを足す」を選んでいる。この提案は、その選択を plugin の実際の構成に当てはめたものである。当てはめる途中で、二つの事実が分かった。

- `document-review` は steering の作業記録に当たらない。具体例 b の `design.md` へ届かせるには、作業記録を書く側にも仕掛けが要る。`confidentiality.md` は同じ理由で、task-design・steering・facilitate-discussion の本文から参照されている。
- `think-through/SKILL.md` は入口だけで、作法の正本は `think_standards/` にある。

[内部検討記録: 論点1・イテレーション0](internal-records/task-design-discussion.md.topic-1.md#iteration-0)

#### 提案0へのフィードバック（論点1）

**結果:** 合意

> ok

正本の file、三つの経路、採らない形のいずれにも修正は無かった。規範の文面（MUST の書き方、具体例の一般化）は、この合意の上で design の完成後の姿に書く。

### イテレーション1（論点1）: 変更の報告

#### 変更内容1（論点1）

判断根拠: 合意からの導出（決定（論点1）の選択理由「`document-review` は steering の作業記録に当たらないため、作業記録を書く側にも参照が要る」）。

- 対象: `docs/documentation_standards/README.md` の「標準の置き方」にある、観点の 2 つの向きを説明する段落。
- 変更前: 「前者（読者がその doc で使えるかを見る観点）は読者向けの doc にだけ当たり、steering の作業記録には当たらない」。この段落は、作業記録を書く skill 側に trigger が要るのは後者（書いてはいけないものが入っていないかを見る観点）だけだと読める。
- 変更後: 前者についての文の後に、「ただし、後続の作業が steering の作業記録を前提として読み、その記録の書き方で失敗が起きる標準は、前者でも作業記録を書く skill 側に trigger を置く。`provisionality_explicitness.md` がこれに当たる」を足す。後者についての既存の文と「やってしまいがちな失敗」は変えない。
- 理由: 新しい標準は「読者が恒久の方針と受け取らないか」を見るため前者に当たる。それでも決定（論点1）は task-design 側から参照する経路 2 を置いた。README を変えないと、README の説明と決定が食い違い、次に標準を増やす人が「前者なら作業記録への trigger は不要」と読む。
- 採らなかった形: 新しい標準を後者（書いてはいけないものが入っていないか）に分類し、README を変えない形。後者の説明は「公開範囲へ置かれるものすべてに当たる」であり、機密性を前提にしている。暫定性は公開範囲と関係しないため、分類を合わせると README の説明が実態とずれる。
- 反映の時期: 他の対象 file と同じく、design 合意の後に適用する。

#### 検討記録（論点1・イテレーション1）

決定（論点1）を design の完成後の姿に書く途中で、`documentation_standards/README.md` の「観点の向きで適用範囲が決まる」という説明が、決定と食い違うことが分かった。task-design の設計前調査の規則（変更後に不正確になる既存 docs の記述を変更対象に含める）に従い、変更対象に加える。

[内部検討記録: 論点1・イテレーション1](internal-records/task-design-discussion.md.topic-1.md#iteration-1)

### イテレーション2（論点1）: 変更の報告

#### 変更内容2（論点1）

判断根拠: 合意からの導出（決定（論点1）の経路 3）と、既存の維持規律（`docs/think_standards/evolution_policy.md`）。出典: [設計時の構造review](artifacts/design-structure-review.md)の不合格 3。

- 対象: design.md 改善2 の経路の表の、`think_standards/making_and_choosing_options.md` の行。
- 変更前: 「『提案が暫定か恒久かを示す』節を足す」。
- 変更後: 見出しを「補助: 提案が暫定か恒久かを示す」とし、主軸（材料が枯れていないと、案も作れず、選ぶこともできない）を変えない。既存の補助節と同じく、やってしまいがちな行動・それをやると何が起きるか・正しい判断のための問いで書く。末尾の「正しい判断のための問い」の一覧には足さない（既存の補助節も一覧に載っていない）。
- 理由: `evolution_policy.md` は各場面の主軸を一つにし、独立した補助判断の見出しに「補助:」を付けると定める。新しい節は主軸の説明ではなく独立した補助判断である。

#### 検討記録（論点1・イテレーション2）

構造案の採用前に skill-update-review を通し、思考標準の維持規律に照らして見出しの形が決まっていないことが分かった。経路の決定は変えない。

[内部検討記録: 論点1・イテレーション2](internal-records/task-design-discussion.md.topic-1.md#iteration-2)

### イテレーション3（論点1）: 変更の報告

#### 変更内容3（論点1）

判断根拠: 合意からの導出（決定（論点1）の正本の中身と、design.md の「テスト方針」の検証 case 2）。

- 対象: design.md 改善2 の経路の表の、`skills/task-design/templates/design.md` の行。
- 変更前: 「非目標」の comment に「今回扱わない理由と、見直す条件または切り出した先を書く」を足す。
- 変更後: 同じ文の後に「責務の境界など、今回に限らない判断なら見直す条件は要らない」を足す。
- 理由:
    - 非目標には、暫定の判断と恒久の判断が並ぶ。この design の非目標でも、「facilitate-discussion の変更」は責務の境界に基づく恒久の判断である。
    - 正本の `provisionality_explicitness.md` は、恒久の判断には見直す条件を求めない（該当しない例）。design.md の検証 case 2 も同じ結果を書いている。
    - 変更前の文だけだと、template を使う人はすべての非目標に見直す条件を書くことになり、正本と食い違う。
- 変えないもの: 正本の中身、他の経路。

#### 検討記録（論点1・イテレーション3）

対象 file へ適用する途中で、template の comment と正本の「該当しない例」の食い違いに気付いた。一文を足して適用したが、報告の前に適用した形になるため、対象 file は design の文面に戻し、変更内容として報告する。

[内部検討記録: 論点1・イテレーション3](internal-records/task-design-discussion.md.topic-1.md#iteration-3)

### 現在の変更（論点1）

- イテレーション1・変更内容1（`documentation_standards/README.md` の観点の向きの段落）: 報告済み。報告後の実応答に異論は無く、design.md の改善2 へ反映済み。対象 file へ適用済み（2026-10-28）。
- イテレーション2・変更内容2（`making_and_choosing_options.md` の節の見出し）: 報告済み（論点3 の合意の後の chat で、構造reviewの不合格 4 件をまとめて報告した）。報告後の利用者の実応答（2026-10-28）:

    > ok

    この応答は、同じ chat で報告した 4 件（論点1・変更内容2、論点2・変更内容2 の対象 1・2、論点3・変更内容1）すべてに対するものである。論点2 と論点3 の現在の変更は、この原文を参照する。design.md の改善2 の経路の表と、表の後の段落へ反映済み。反映した構造案を同じ材料で再照合し、この変更に関する不合格は解消した（[設計時の構造review・再照合](artifacts/design-structure-review.md#再照合)）。対象 file へ適用済み（2026-10-28）。
- 対象 file への適用の時期: 変更内容1 では「design 合意の後に適用する」と書いたが、task-design の Step 4 は `task-design内の対象成果物反映待ち` がゼロであることを design 合意の条件にしている。そのため、対象 file への適用と validation は design 合意の前に task-design 内で行い、適用結果を design 合意の対象に含める。この訂正は報告済みで、報告後の実応答は [論点2 の現在の変更](#現在の変更論点2) に保存した「ok」（2026-10-28）である。
- イテレーション3・変更内容3（template の非目標の comment に、恒久の判断なら見直す条件は要らない旨を足す）: 報告済み。報告後の利用者の実応答は [論点4 の提案0へのフィードバック](#提案0へのフィードバック論点4) に保存した「a」（2026-10-28）であり、変更内容3 への異論は無い。design.md の改善2 の経路の表と、対象 file へ反映済み。

### 決定（論点1）

暫定の判断の規範は、新しい文書標準 `docs/documentation_standards/provisionality_explicitness.md`（暫定性の明示）を唯一の正本とし、次の三つの経路から参照する。

- 正本の中身: 対象（今回の範囲に限った判断、条件付きの保留、別の作業への切り出し）、MUST（暫定であること・暫定にした理由・見直す条件または切り出した先の 3 点を書く）、写すときの規則（design から README へ、先行の steering から後続の design へ写すときも 3 点を落とさない）、判断の問い「見直す条件を知らない読み手がこの文だけを読んだら、恒久の方針と受け取らないか」、具体例。
- 経路 1（docs と skill 本体）: `document-review/SKILL.md` の作成時観点と更新時観点に、この標準を足す。
- 経路 2（steering の作業記録）: `task-design/SKILL.md` の `confidentiality.md` を参照する一文の隣に、この標準を参照する一文を足す。`task-design/templates/design.md` の「非目標」の comment に「今回扱わない理由と、見直す条件または切り出した先を書く」を足す。
- 経路 3（提案）: `think_standards/making_and_choosing_options.md` に補助節「補助: 提案が暫定か恒久かを示す」を足す（見出しの形は変更内容2）。思考標準は文書標準を参照せず、提案の場面の問いだけを持つ。
- `stock-and-flow-information.md` の「議論結果をそのまま転記する」アンチパターンからは、新しい標準へ参照を足すだけにする。
- 付随: `documentation_standards/README.md` の観点の向きの段落に、作業記録を書く skill 側へ trigger を置く条件を足す（変更内容1）。

選択理由: `document-review` は steering の作業記録に当たらないため、作業記録を書く側にも参照が要る（具体例 b は `design.md` で起きた）。`stock-and-flow-information.md` は置き場所の上位方針で `document-review` の観点にできず、`think-through/SKILL.md` は入口だけを持つ構成のため、どちらにも正本を置かない。

代償: 文書標準と `document-review` の観点が一つずつ増え、task-design の本文に参照の一文が増える。

## 論点2: その場で気付いた不備を拾うか切り出すかの基準と、対になる scope の判定を、どこに置き、どの経路から当てるか

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点2）: 基準の正本と、当てる経路

#### 提案0（論点2）

拾うか切り出すかの基準の正本を、新しい開発標準 `docs/development_standards/development_flow/work_scope.md`（作業の範囲）に一つだけ置く。対になる scope の判定の 2 規則は、その判定の問いを既に持つ場所へ、それぞれ足す。

**正本: `development_flow/work_scope.md`**

扱う場面: 作業中に、その作業の目的の外にある不備に気付いたとき。

- 既定は今の作業で拾う。その場でしか気付けない不備は、別の作業へ回すと誰も拾わずに溜まる（ボーイスカウトルール）。
- 次のどれかに当たるものだけを、別の作業（issue・steering）に切り出す。
    - 大きすぎる。
    - 単体で分けた方が revert しやすい。
    - 今の作業に含めると、本番への適用が遅れる。
- 「今の作業の scope 外である」ことは、切り出す理由にならない。
- 切り出すときは、切り出し先の issue・steering を先に作る。そのうえで、今の作業の記録に、今はやらない理由と切り出し先を書く。書き方は `provisionality_explicitness.md`（論点1で決定）に従う。
- 拾うときは、今の作業の design と plan に戻して範囲に加える。戻り先は、気付いた段階の skill が決める。
- 判断の問い: 「これを今の作業に含めたら、今の作業の review・revert・本番適用の単位が崩れるか」。崩れなければ拾う。
- やってしまいがちな失敗: 「今の作業の scope 外だから」と別 issue を推奨する。具体例は、拾った 2 件（README の暫定性の欠落、CI の state lock の待ち時間）と、切り出した 2 件（大きな機能の削除、同期処理の非同期化）。利用先固有の情報は除く。
- 名前: 同じ directory の `branch_pr_issue.md`（branch・PR・issue の対応）と同じく、開発の進め方の一つの話題を名詞で表す。`development_flow/` の文脈を継承するため、`work_scope` で足りる。

**経路: 不備に気付く 3 つの段階から、正本を参照する**

```text
 気付く段階            参照する場所                         正本
 設計中        ──→  task-design/SKILL.md Step 3        ─┐
 議論中        ──→  facilitate-discussion の scope 判定 ─┼─→ work_scope.md
 実装・動作確認 ──→  runtime-feedback-review.md         ─┘
                    （steering と tasklist-executor が読む）
```

1. 設計中: `task-design/SKILL.md` の Step 3 に、「設計中に、今の作業の目的の外にある不備に気付いたら、拾うか切り出すかを `work_scope.md` で判定する」を足す。設計前調査（PrepareStep 3）は `development_standards/` を全部読むが、それは設計の開始時である。不備に気付いた時点で当てるために、Step 3 にも参照を置く。Step 3 の 2 は既に `making_and_choosing_options.md` を同じ形で参照している。
2. 議論中: `facilitate-discussion/SKILL.md` の「scopeと親子関係」の「変わらなければactiveな論点を作らない。consumer内部の判断またはscope外候補としてchatで区別する」の後に、「scope外候補として区別することは、別の作業へ回す判断ではない。今の作業へ含めるかは consumer が判断し、含めると決まれば discussion scope 内として扱う」を足す。facilitate-discussion は issue・steering の概念を持たない汎用の skill のため、`work_scope.md` を名指ししない。
3. 実装・動作確認中: `runtime-feedback-review.md` の「decision後の戻り先」の前に、「feedback が今の作業の目的の外にある不備なら、拾うか切り出すかを `work_scope.md` で判定してから戻り先を選ぶ。拾うなら完成後の姿が変わるため、design phase へ戻す」を足す。拾った 2 件の具体例は、どちらもこの段階で起きた。

**対になる scope の判定: 判定の問いを持つ場所へ足す**

- `facilitate-discussion/SKILL.md` の「scopeと親子関係」の問い（「このdecisionの結論が変わると、現在のdiscussion目的または指定parentの決定・実装範囲が変わるか」）に、やってしまいがちな失敗として「選択肢に成果物の変更が含まれることを、実装範囲が変わる根拠にする」を足す。具体例: 作業の範囲外と決めていた作業の費用を下げる案を、code の変更を含むという理由で design の論点に起こした。
- `task-design/SKILL.md` の Step 4（design合意判定）の「全 TBD が解消されている」に、やってしまいがちな失敗として「進行中の試行・調査のうち、結果次第で design の範囲が変わるものを TBD に登録しないまま、design の合意を求める」を足す。具体例: design の範囲を左右する別の試行が進行中なのに、design の合意を催促した。

**付随する変更（上の決定から一意に導く）**

- `development_standards/README.md` の「収録している標準」の `development_flow/` の行は、今は `branch_pr_issue.md` へ直接 link している。2 file になるため、2 file を区別できる書き方に直す。「維持規律」の file 数と分量の記述も更新する。

**採らない形**

- `task-design/SKILL.md` に基準の本体を書く（引き渡された提案の文言どおり）: 拾った 2 件はどちらも実装・動作確認の途中で起き、その段階では task-design は動いていない。task-design に本体を書き、`runtime-feedback-review.md` にも書くと、正本が二つになる。task-design には Step 3 の参照と Step 4 の失敗例を足すため、task-design の修正は含まれる。
- `think_standards/` に場面を足す: `think-through` は常時注入されるため、届く範囲は最も広い。しかし基準の中身（issue・revert・本番適用）は開発の進め方の概念である。`development_standards/README.md` の置き方は「どう進めるか」をこの群に置き、`think_standards/README.md` はドメイン固有の判断基準を対象外にしている。
- `facilitate-discussion/SKILL.md` に基準の本体を書く: issue・steering・本番適用は consumer の概念であり、汎用の議論 skill に持ち込むと責務境界（適用先と後続 workflow は consumer が持つ）が崩れる。

#### 検討記録（論点2・イテレーション0）

引き渡された提案は「task-design に基準を入れる」だった。拾った 2 件の具体例がどの段階で起きたかを確かめると、どちらも実装・動作確認の途中で、steering が `runtime-feedback-review.md` の手順で facilitate-discussion を使っていた。そこで assistant が別 issue を推奨したのは、facilitate-discussion の scope 判定が「scope 外候補」と区別した後、それを別の作業へ回すものと読んだためである。task-design の本文だけを直しても、この経路には届かない。

基準の中身（issue・revert・本番適用）は開発の進め方の判断であり、`development_standards/development_flow/` には既に branch・PR・issue の対応を扱う標準がある。task-design は設計前調査でこの群を全部読むため、設計中は参照が既にある。足りないのは、気付いた時点での参照と、実装・動作確認の経路である。

対になる scope の判定の 2 規則は、新しい基準ではなく、既存の判定の問いで起きた失敗の形である。問いの持ち主（facilitate-discussion の scope 判定、task-design の design 合意判定）に失敗例として置く。

[内部検討記録: 論点2・イテレーション0](internal-records/task-design-discussion.md.topic-2.md#iteration-0)

#### 提案0へのフィードバック（論点2）

**結果:** 質問（提案0の採否は未回答）

> 論点2の件ってtask-design以外見るの？

回答: 見る。不備に気付く段階は設計中・議論中・実装と動作確認中の 3 つあり、task-design が動いているのは設計中だけである。拾った 2 件の具体例は、どちらも実装・動作確認中に steering が `runtime-feedback-review.md` の手順で判断していた（[内部検討記録: 論点2・イテレーション0・記録1](internal-records/task-design-discussion.md.topic-2.md#iteration-0-record-1)）。そこで「別 issue」と判断すると design phase へ戻らないため、task-design に置いた規則には届かない。また `development_standards/` を読むのは task-design の設計前調査だけであり、他の段階からは明示の参照が要る。

経路の必要度を分けて示した。

- 必須: task-design Step 3 の参照（設計中）、`runtime-feedback-review.md` の判定（実装・動作確認中。具体例 2 件の経路）。
- 補助: facilitate-discussion の scope 判定への一文。consumer 側（`runtime-feedback-review.md`、task-design）が判定するなら、無くても塞がる。残す理由は、「scope外候補」という語を別の作業へ回すものと読んだことが、具体例の判断の起点だったことである。
- scope の判定の 2 規則（facilitate-discussion の失敗例、task-design Step 4 の失敗例）は、拾うか切り出すかの経路とは別の話であり、この分類に含めない。

**結果:** b を選択（facilitate-discussion の一文を外す）

> bかな。別にfaciliateは記録役

利用者の理由は、facilitate-discussion は議論の記録役であり、作業の範囲の判断基準を持つ場所ではない、というものである。この理由は、提案0で facilitate-discussion の scope 判定へ置いたもう一つの変更（「選択肢に成果物の変更が含まれる」の失敗例）にも当たる。そのため採否を確定せず、この変更の置き場所も合わせて直した提案1を出す。

### イテレーション1（論点2）: facilitate-discussion を変えない形

#### 提案1（論点2）

提案0から、facilitate-discussion への変更を二つとも外す。scope の内外の判定の失敗例は、正本の `work_scope.md` へ移す。

**正本: `development_flow/work_scope.md`**

扱う場面: 作業中に新しい判断が出たとき、または作業の目的の外にある不備に気付いたとき。二段で判定する。

1. scope の内外: 「その判断の結論が変わると、今の作業の目的の決定・実装範囲が変わるか」。
    - やってしまいがちな失敗: 選択肢に成果物の変更（code の変更など）が含まれることを、scope 内の根拠にする。具体例: 作業の範囲外と決めていた作業の費用を下げる案を、code の変更を含むという理由で design の論点に起こした。
2. scope 外の不備を拾うか切り出すか: 提案0の内容のまま。
    - 既定は今の作業で拾う。
    - 切り出すのは、大きすぎる・単体で分けた方が revert しやすい・今の作業に含めると本番への適用が遅れる、のどれかに当たるものだけ。
    - 「scope 外である」ことは、切り出す理由にならない。
    - 切り出すときは、切り出し先を先に作り、理由と切り出し先を `provisionality_explicitness.md` に従って書く。
    - 判断の問い: 「今の作業に含めたら、今の作業の review・revert・本番適用の単位が崩れるか」。

**経路**

```text
 気付く段階            参照する場所                       正本
 設計中        ──→  task-design/SKILL.md Step 3      ─┐
                                                       ├─→ work_scope.md
 実装・動作確認 ──→  runtime-feedback-review.md       ─┘
                    （steering と tasklist-executor が読む）
```

- task-design Step 3: 「設計中に新しい判断が出たら、scope の内外を `work_scope.md` で判定する。目的の外にある不備なら、拾うか切り出すかも同じ file で判定する」を足す。
- `runtime-feedback-review.md`: 「decision後の戻り先」の前に、「feedback が今の作業の目的の外にある不備なら、拾うか切り出すかを `work_scope.md` で判定してから戻り先を選ぶ。拾うなら完成後の姿が変わるため、design phase へ戻す」を足す。

**task-design Step 4 の失敗例**: 提案0のまま。「全 TBD が解消されている」に、「進行中の試行・調査のうち、結果次第で design の範囲が変わるものを TBD に登録しないまま、design の合意を求める」を失敗例として足す。design 合意判定は task-design の判断であり、記録役の facilitate-discussion とは関係しない。

**付随する変更**: 提案0のまま（`development_standards/README.md` の `development_flow/` の行と、「維持規律」の file 数・分量）。

**採らない形（提案0から足すもの）**

- 失敗例を facilitate-discussion の scope 判定に置く（提案0の形）: facilitate-discussion の scope 判定は、議論記録に active な論点を作るかを決める記録上の判定である。作業の範囲の判断は consumer が行い、その結果を記録に渡す。

#### 検討記録（論点2・イテレーション1）

提案0の facilitate-discussion への変更は二つあった。拾うか切り出すかの一文と、scope 判定の失敗例である。利用者が b を選んだ理由（facilitate-discussion は記録役）は両方に当たる。失敗例が起きた場面は設計中に論点を起こすかの判断であり、その判断の持ち主は task-design である。task-design は Step 3 から `work_scope.md` を参照するため、失敗例を `work_scope.md` に置けば同じ場面で当たる。

[内部検討記録: 論点2・イテレーション1](internal-records/task-design-discussion.md.topic-2.md#iteration-1)

#### 提案1へのフィードバック（論点2）

**結果:** 合意

> ok

### イテレーション2（論点2）: 変更の報告

#### 変更内容2（論点2）

判断根拠: 合意からの導出（決定（論点2）の経路）。出典: [設計時の構造review](artifacts/design-structure-review.md)の不合格 1・2。

- 対象 1: design.md 改善3 の参照側の変更表の、`runtime-feedback-review.md` の行。
    - 変更前: 「『decision後の戻り先』の前に、…判定してから戻り先を選ぶ」。
    - 変更後: 判定を、各 feedback の三問の後、decision の提案を作る段階に置く（「feedback が今の作業の目的の外にある不備なら、拾うか切り出すかを `work_scope.md` で判定し、その判定を decision の提案にする」）。戻り先の一覧で二つの結果の行き先を示す。拾う場合は完成後の姿が変わるため、既存の「design phase へ戻す」に当たる。切り出す場合は、切り出し先を作り、理由と切り出し先を decision に記録する。今の作業の完成後の姿が変わらないなら design と plan は変えない。
    - 理由: 拾うか切り出すかは decision の中身であり、戻り先を選ぶ段階では既に決まっている。「戻り先の前」では、判定せずに decision を作る順序が残る。
- 対象 2: design.md 改善3 の参照側の変更表の、`task-design/SKILL.md` Step 3 の行。
    - 変更前: 「Step 3 に足す」（位置の指定なし）。
    - 変更後: `work_scope.md` の判定を、Step 3 の 1（不確実性を選ぶ）と 2（段階の scope の判定、3-5）の間に置く。3-5 の判定は目的の内にある不確実性だけに当てる。目的の外の判断は design の論点にしない。目的の外の不備は二段目で判定し、拾うものは今の作業の scope に加える設計判断として discussion で合意し、切り出すものは非目標へ `provisionality_explicitness.md` に従って書く。facilitate-discussion へ渡すのはこの判定の後とする。facilitate-discussion 自体は変えない。
    - 理由: Step 3 の 2 は既に別の scope（今回の段階）を判定しており、順序が無いと目的の外の判断に 3-5 を当てる余地が残る。facilitate-discussion の scope 判定は同趣旨の問いを持つため、task-design が先に判定すると書かないと、記録役の判定が作業の範囲の判断を兼ねる状態に戻る。

#### 検討記録（論点2・イテレーション2）

構造案の採用前に skill-update-review を通し、参照を置く位置と受渡しの順序が design に無いことが分かった。正本と経路の決定は変えない。

[内部検討記録: 論点2・イテレーション2](internal-records/task-design-discussion.md.topic-2.md#iteration-2)

### イテレーション3（論点2）: 変更の報告

#### 変更内容3（論点2）

判断根拠: 既存の規則からの導出。task-design の §4「discussionを開始する時と返却後」は、discussion を既定で開始し、開始しないのは TBD が一つも残らない場合と、調査・技術検証実装だけで事実が決まる場合だけとしている。出典: [設計時の構造review・再照合](artifacts/design-structure-review.md#再照合)の不合格 5。

- 対象: design.md 改善3 の参照側の変更表の、`task-design/SKILL.md` Step 3 の行の「結果ごとの扱い」。
- 変更前: 「拾うものは今の作業の scope に加える設計判断として discussion で合意する。切り出すものは非目標へ `provisionality_explicitness.md` に従って書く」。
- 変更後: 「目的の外の不備を拾うか切り出すかは、どちらの結果も discussion で合意する。拾うと合意したものは今の作業の scope に加える。切り出すと合意したものは、切り出し先を作ってから、非目標へ `provisionality_explicitness.md` に従って書く」。
- 理由:
    - 拾うか切り出すかは調査だけでは決まらず、利用者の判断を含む（大きすぎるか、本番適用の遅れを許すか）。§4 の規則では discussion を開始する場合に当たる。具体例（拾う）でも、assistant の切り出しの推奨を利用者が覆した。
    - 変更前の書き方は、切り出す側だけ合意を経ずに非目標へ書く形に読める。`work_scope.md` は「切り出し先を先に作る」と定めるため、切り出し先（issue 等）を合意の前に作ることになる。issue の作成は repository の外へ出る操作であり、利用者が拾う方を選んだときに不要な issue が残る。
- 変えないもの: `runtime-feedback-review.md` の行。decision（合意）の後に切り出し先を作る順序であり、同じ問題を持たない。Step 3 での判定の位置（1 と 2 の間）と、facilitate-discussion へ渡す順序（変更内容2 の対象 2）も変えない。

#### 検討記録（論点2・イテレーション3）

変更内容2 を design.md へ反映した構造案を、同じ材料で再照合した。先行の 4 件は解消したが、Step 3 の切り出す側の扱いが、合意を経ずに切り出し先を作る順序に読めることが分かった。決定（論点2）の正本と経路は変えない。

[内部検討記録: 論点2・イテレーション3](internal-records/task-design-discussion.md.topic-2.md#iteration-3)

### イテレーション4（論点2）: 変更の報告

#### 変更内容4（論点2）

判断根拠: 合意からの導出（決定（論点2）の「目的の外の判断は design の論点にしない」）と、task-design の既存の規則（Step 3 の手順 8 は `design.md` に残る不確実性があれば Step 3 を繰り返し、Step 4 は全 TBD の解消を条件にする）。出典: [設計時の構造review・編集後review](artifacts/design-structure-review.md#編集後review)の不合格 6。

- 対象: `plugins/tumeda-dev/skills/task-design/SKILL.md` Step 3 の手順 2 の「目的の外の判断」の枝と、design.md 改善3 の参照側の変更表の Step 3 の行。
- 変更前: 「目的の外の判断: designの論点にしない。この判断は今回のStep 3の対象から外す」。
- 変更後: 「目的の外の判断: designの論点にしない。`design.md`にTBDとして書いていた場合は外し、この判断は今回のStep 3の対象から外す」。
- 理由:
    - 目的の外と判定した判断が `design.md` に TBD として残ると、手順 8 で同じ TBD が再び選ばれ、Step 4 の「全 TBD が解消されている」も満たせない。
    - 同じ手順の「目的の外の不備」（切り出すなら非目標へ書く）と、手順 3 の段階の scope（非目標へ「実測後に設計する」と書く）は `design.md` の書き換えまで定めている。この枝だけが状態の遷移を持たない。
    - 非目標へは書かない。目的の外の判断は今の作業の設計の対象ではなく、今回やらないと決めた事柄でもないため。
- 変えないもの: `work_scope.md`、`runtime-feedback-review.md`、目的の内外を判定する位置と順序。

#### 検討記録（論点2・イテレーション4）

対象 file へ適用した後、編集後の skill-update-review で、Step 3 の手順 2 の枝ごとに `design.md` の状態がどう変わるかを照らした。「目的の外の判断」の枝だけが TBD の扱いを持たず、手順 8 と Step 4 で止まることが分かった。決定（論点2）の正本と経路は変えない。

[内部検討記録: 論点2・イテレーション4](internal-records/task-design-discussion.md.topic-2.md#iteration-4)

### 現在の変更（論点2）

- イテレーション2・変更内容2（`runtime-feedback-review.md` の判定の位置と二つの結果の行き先、task-design Step 3 の判定の位置と議論へ渡す順序）: 報告済み。報告後の利用者の実応答は [論点1 の現在の変更](#現在の変更論点1) に保存した「ok」（2026-10-28）であり、4 件すべてに対するもの。design.md の改善3 の参照側の変更表と、その前の段落へ反映済み。再照合で対象 1・2 の不合格は解消した。対象 file へ適用済み（2026-10-28）。
- イテレーション3・変更内容3（Step 3 で、切り出す側も discussion で合意してから切り出し先を作る）: 報告済み。報告後の利用者の実応答（2026-10-28）:

    > ok

    この応答は、同じ chat で報告した変更内容3、論点1 の現在の変更に記録した適用時期の訂正、design.md の要件・リスク・テスト方針・実行区分の記入のすべてに対するものである。design.md の改善3 の参照側の変更表の Step 3 の行へ反映済み。反映した構造案を同じ材料で再照合し、不合格 5 は解消した（[設計時の構造review・再々照合](artifacts/design-structure-review.md#再々照合)）。対象 file へ適用済み（2026-10-28）。
- イテレーション4・変更内容4（Step 3 の「目的の外の判断」の枝で、`design.md` の TBD を外す）: 報告済み。報告後の利用者の実応答（2026-10-28）:

    > ok

    design.md の改善3 の参照側の変更表の Step 3 の行と、対象 file（`plugins/tumeda-dev/skills/task-design/SKILL.md`）へ反映済み。反映後の実物で再照合し、不合格 6 は解消した（[設計時の構造review・編集後の再照合](artifacts/design-structure-review.md#編集後の再照合)）。

### 決定（論点2）

その場で気付いた不備を拾うか切り出すかの基準と、対になる scope の内外の判定は、新しい開発標準 `docs/development_standards/development_flow/work_scope.md`（作業の範囲）を唯一の正本とする。facilitate-discussion は議論の記録役であり、作業の範囲の判断基準を持たないため変えない。

- 正本の中身: 作業中に新しい判断が出たとき、または作業の目的の外にある不備に気付いたときに、二段で判定する。
    1. scope の内外: 「その判断の結論が変わると、今の作業の目的の決定・実装範囲が変わるか」。やってしまいがちな失敗として、選択肢に成果物の変更が含まれることを scope 内の根拠にする形を置く。
    2. scope 外の不備を拾うか切り出すか: 既定は今の作業で拾う。大きすぎる・単体で分けた方が revert しやすい・今の作業に含めると本番への適用が遅れる、のどれかに当たるものだけを切り出す。「scope 外である」ことは切り出す理由にならない。切り出すときは切り出し先を先に作り、理由と切り出し先を `provisionality_explicitness.md` に従って書く。判断の問いは「今の作業に含めたら、今の作業の review・revert・本番適用の単位が崩れるか」。
- 経路: `task-design/SKILL.md` の Step 3 に二段の両方を参照する手順を、`runtime-feedback-review.md` に二段目を参照する一文を足す。拾う場合は完成後の姿が変わるため design phase へ戻す。参照を置く位置（Step 3 では 1 と 2 の間、`runtime-feedback-review.md` では三問の後の decision の提案を作る段階）と結果ごとの行き先は、変更内容2 で具体化した。Step 3 では拾うか切り出すかのどちらの結果も discussion で合意し、切り出すと合意してから切り出し先を作る（変更内容3）。
- `task-design/SKILL.md` の Step 4 の「全 TBD が解消されている」に、進行中の試行・調査のうち結果次第で design の範囲が変わるものを TBD に登録しないまま design の合意を求める形を、やってしまいがちな失敗として足す。
- 付随: `development_standards/README.md` の `development_flow/` の行を 2 file を区別できる書き方に直し、「維持規律」の file 数と分量を更新する。

選択理由: 拾った具体例 2 件は実装・動作確認中に起き、その段階では task-design は動いていない。`development_standards/` を読むのは task-design の設計前調査だけのため、不備に気付く段階（設計中、実装・動作確認中）ごとに明示の参照を置く。基準の中身は開発の進め方（issue・revert・本番適用）であり、`think_standards/` の対象外、facilitate-discussion の責務の外である。

代償: 開発標準が一つ増え、task-design の設計前調査で読む量が 1 file 増える。task-design に二文、`runtime-feedback-review.md` に一文増える。

## 論点3: 作業を破棄しても残る変化の引き継ぎ観点を、design 合意判定でどう確かめるか

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点3）: 判定の定義の置き場所と、Step 4 の確認項目

#### 提案0（論点3）

「作業を破棄しても残る変化」の判定の定義を、`tasklist-design.md` から `task-design/SKILL.md` の Step 4（design合意判定）へ移す。Step 4 に確認項目を足し、`tasklist-design.md` は phase の作り方だけを持って Step 4 の定義を参照する。

**今の配置と、外れた理由**

```text
 design を書く           design 合意判定          tasklist 設計
 templates/design.md     SKILL.md Step 4          tasklist-design.md
 受け入れ基準の comment   （該当する項目なし）       判定の問い・例の表・
 「破棄しても残る変化が                              受け入れ基準へ入れる MUST・
  あるなら…入れる」                                 単独 phase・停止確認 task
        │                       │                          │
   記入時の注意             関門が無い              ここで初めて MUST に当たり
   （書かれていたが外した）                          合意済みの design へ戻った
```

- `tasklist-design.md` は、冒頭で「`tasklist.md`を作る直前に先頭から末尾まで完全に読む」と定めた分割 file である。design 合意の時点では読まれない。
- 受け入れ基準は design に属するのに、それを求める MUST と判定の定義が tasklist 設計の段階にしか無い。
- composite の計画を作る `roadmap-design.md` には、この原則が無い。

**変更**

1. `task-design/SKILL.md` Step 4 に確認項目「作業の外へ残る変化の引き継ぎ」を足す。
    - 判定の問い: 「この作業で起きる変化は、この作業を破棄しても残るか」。
    - 例の表（DB migration の適用、deploy・release、外部 service の設定変更、本番データの移行・削除は残る。未 release の code 変更、通常の code 変更・test 追加は残らない）。`tasklist-design.md` から移す。
    - 判定に使わない観点（「破壊的」「後方互換性がない」ではなく、変化が及ぶ範囲で分ける）と、判定は利用先の運用に依存すること。`tasklist-design.md` から移す。
    - 確認: 残る変化があるなら、それを後から更新・確認・復旧できることが受け入れ基準に入っているか。入っていなければ design 合意へ進まない。
    - やってしまいがちな失敗: 引き継ぎの観点を tasklist 設計で初めて問われ、合意済みの design へ戻って合意をやり直す。具体例: 定期実行の schedule を有効にする作業で、止め方と結果の確かめ方を運用の文書に書くことが、design 合意の後に受け入れ基準へ加わった。
2. `tasklist-design.md` の「作業の外へ残るactionを含むphaseの原則」を、phase の作り方だけにする。
    - 判定の問い・例の表・判定に使わない観点は削り、「対象actionの判定は `SKILL.md` Step 4 の「作業の外へ残る変化の引き継ぎ」で行う」と参照する。
    - 「引き継ぎの観点を `design.md` の受け入れ基準へ入れる」MUST は、「Step 4 で受け入れ基準へ入れた引き継ぎの観点を前提にする。入っていなければ design へ戻す」に置き換える。
    - 単独 phase に切り出す MUST、停止・確認 task を置く MUST、停止・確認 task での照合、利用先固有の差し込みは変えない。
3. `templates/design.md` の受け入れ基準の comment は変えない。書くときの注意として既に正しい。

**採らない形**

- Step 4 から `tasklist-design.md` の節を参照するだけにする: `tasklist-design.md` は plan phase の直前に完全に読む分割 file であり、design 合意の時点で一部だけ読ませると、その読取の約束が崩れる。`SKILL.md` は常に全部読まれるため、定義は本体に置き、分割 file から参照する向きにする。
- template の comment を強めるだけにする: comment は既にあり、具体例でも記入時に見えていたのに外した。記入時の注意は関門にならない。
- 定義を両方に置く: 判定の問いと例が二箇所に分かれ、片方だけ直されて食い違う。

#### 検討記録（論点3・イテレーション0）

`tasklist-design.md` の「作業の外へ残るactionを含むphaseの原則」は、判定の問い（このphaseで起きる変化は、この作業を破棄しても残るか）と例の表、design の受け入れ基準へ引き継ぎの観点を入れる MUST、phase の作り方の MUST を一つの節に持つ。このうち受け入れ基準の MUST と判定の定義は design の内容に関わり、phase の作り方だけが tasklist の内容である。`SKILL.md` は `tasklist-design.md` を「plan phase へ入る直前に先頭から末尾まで完全に読む」と定めているため、design 合意の時点ではこの節に触れない。`templates/design.md` の受け入れ基準の comment は同じ趣旨を書いているが、記入時の注意であり関門ではない。`roadmap-design.md` にはこの原則が無い。

[内部検討記録: 論点3・イテレーション0](internal-records/task-design-discussion.md.topic-3.md#iteration-0)

#### 提案0へのフィードバック（論点3）

**結果:** 合意

> ok

### イテレーション1（論点3）: 変更の報告

#### 変更内容1（論点3）

判断根拠: 合意からの導出（決定（論点3）の「判定は Step 4 を参照する」）。出典: [設計時の構造review](artifacts/design-structure-review.md)の不合格 4。

- 対象: design.md 改善1 の `tasklist-design.md` の変更表。
- 変更前: 判定の問い等を削り、「対象actionの判定は `SKILL.md` Step 4 の『作業の外へ残る変化の引き継ぎ』で行う」と参照する。
- 変更後: 節の冒頭に「`SKILL.md` Step 4 で特定した、作業を破棄しても残る変化を起こす action を対象actionとし、それを含む phase に次の MUST を当てる」と書く。自己レビュー gate と利用先固有の差し込みの「対象action」は、この定義を指す。
- 理由: Step 4 へ移す問いは主語を作業に変える。`tasklist-design.md` は phase 単位で「対象actionを含むphase」を使い続けるため、作業単位の判定から phase 単位の対象へ渡す一文が要る。

#### 検討記録（論点3・イテレーション1）

構造案の採用前に skill-update-review を通し、定義を移した後の受渡しが無いことが分かった。移す決定は変えない。

[内部検討記録: 論点3・イテレーション1](internal-records/task-design-discussion.md.topic-3.md#iteration-1)

### 現在の変更（論点3）

イテレーション1・変更内容1（`tasklist-design.md` の対象actionの定義の一文）: 報告済み。報告後の利用者の実応答は [論点1 の現在の変更](#現在の変更論点1) に保存した「ok」（2026-10-28）であり、4 件すべてに対するもの。design.md の改善1 の `tasklist-design.md` の変更表と、表の後の段落へ反映済み。再照合でこの不合格は解消した。対象 file へ適用済み（2026-10-28）。

### 決定（論点3）

「作業を破棄しても残る変化」の判定の定義を `tasklist-design.md` から `task-design/SKILL.md` の Step 4（design合意判定）へ移し、Step 4 で受け入れ基準を確かめる。

- `SKILL.md` Step 4 に確認項目「作業の外へ残る変化の引き継ぎ」を足す。判定の問い「この作業で起きる変化は、この作業を破棄しても残るか」、例の表、判定に使わない観点（「破壊的」「後方互換性がない」ではなく変化が及ぶ範囲で分ける）、利用先の運用に依存する旨を `tasklist-design.md` から移す。残る変化があるなら、それを後から更新・確認・復旧できることが受け入れ基準に入っているかを確かめ、入っていなければ design 合意へ進まない。やってしまいがちな失敗として、引き継ぎの観点を tasklist 設計で初めて問われ合意をやり直す形と、schedule を有効にする作業の具体例を置く。
- `tasklist-design.md` の「作業の外へ残るactionを含むphaseの原則」は phase の作り方だけを持つ。判定は Step 4 を参照し、節の冒頭で「Step 4 で特定した、作業を破棄しても残る変化を起こす action を対象actionとする」と受け渡す（変更内容1）。受け入れ基準へ入れる MUST は「Step 4 で受け入れ基準へ入れた引き継ぎの観点を前提にする。入っていなければ design へ戻す」に置き換える。単独 phase の MUST、停止・確認 task の MUST と照合、利用先固有の差し込みは変えない。
- `templates/design.md` の受け入れ基準の comment は変えない。
- 確認の語は既存の「更新・確認・復旧」を使う。

選択理由: `tasklist-design.md` は plan phase の直前に完全に読む分割 file であり、design 合意の時点では読まれない。`SKILL.md` は常に全部読まれるため、定義を本体に置き、分割 file から参照する向きにする。template の comment は記入時の注意であり、関門にならない。

代償: `SKILL.md` が判定の定義の分だけ長くなる。

## 論点4: `validate-plugin` が今の既定 branch でも失敗している 4 件を、今の作業で拾うか

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点4）: 拾うか切り出すか

#### 提案0（論点4）

`scripts/verification/validate-plugin.mjs` の必須文言の検査が、今の既定 branch（HEAD `44c4992`）でも 4 件失敗している。この 4 件を今の作業で拾い、validator の必須文言を移動先の文へ追随させる。commit は改善 1〜3 と分ける。

**失敗している 4 件と、移動先**

| 必須文言（validator が探す場所） | 消えた commit | 今の所在 |
| --- | --- | --- |
| 「feedback原文」（`steering/SKILL.md`） | `1f09d43`（実装 feedback の処理を共通 file へ移した） | `skills/runtime-feedback-review.md` の「feedback原文、関連する実装、…を渡す」 |
| 「既に修正済みのfeedbackでも記録を省略しない」（同） | 同上 | `skills/runtime-feedback-review.md` の同じ段落 |
| 「reviewのdecisionやtask追加後も実装を自動再開しない」（同） | 同上 | `skills/runtime-feedback-review.md` の「設計判断が必要な変更では、…」の段落 |
| 「末尾のiterationとfeedback状態」（`facilitate-discussion/read-discussion.md`） | `b07286a`（読取の手順を書き直した） | 同 file 手順 6 の「末尾提示・原文応答・現在state・親子と根拠を判断する」 |

**直し方**

- 先頭 3 件: `steering/SKILL.md` に求めていた 3 文言を、`skills/runtime-feedback-review.md` に求める検査へ移す。`steering/SKILL.md` には、共通 file を参照していること（`runtime-feedback-review.md` の文字列）を求める。
- 4 件目: 必須文言を「末尾提示・原文応答・現在state・親子と根拠を判断する」に置き換える。
- validator の検査の意図（実装 feedback を記録して自動再開しない契約、読取後に末尾の提示と応答を確かめる契約）は変えず、文の所在だけを追随させる。

**拾う理由（`work_scope.md` の二段目に当てた結果）**

- 今の作業の目的の外にある不備である。改善 1〜3 のどれとも関係しない。
- 小さい。1 file の 4 箇所で、検査の意図は変えない。今の作業の review・revert・本番適用の単位を崩さない。commit を分ければ revert も単独でできる。
- 今の作業の受け入れ基準「`validate-plugin` が passed を出す」は、この 4 件を直さないと満たせない。切り出すと、今回の配布も検証が失敗したままになる。

**切り出す場合**

受け入れ基準を「今回の変更に起因する失敗が無い」へ弱め、切り出し先の issue を作ってから、非目標へ理由と切り出し先を書く。前回の配布（`8.1.0`）と同じく、検証が失敗した状態で配布することになる。

#### 検討記録（論点4・イテレーション0）

version を `8.1.1` に上げて validator を実行したところ、今回の変更に起因する 2 件と、それ以外の 4 件が失敗した。今回の 2 件は、改善 1・3 で置き換えた文を validator が探していたもので、validator の必須文言を新しい文へ追随させた（一対一の追随であり、新しい判断を含まない）。残る 4 件は HEAD の worktree でも同じく失敗し、前回の steering の保留 8 件にも含まれていなかった。

[内部検討記録: 論点4・イテレーション0](internal-records/task-design-discussion.md.topic-4.md#iteration-0)

#### 提案0へのフィードバック（論点4）

**結果:** 合意（a: 拾う）

> a

この応答は、同じ chat で報告した論点1・変更内容3 への実応答も兼ねる。変更内容3 への異論は無い。

### イテレーション1（論点4）: 変更の報告

#### 変更内容1（論点4）

判断根拠: 既存の規則からの導出。root `README.md` の「変更時の検証と前提」は、skill または docs を追加・変更したら対応する assertion を `scripts/verification/validate-plugin.mjs` へ足すと定める。決定（論点1〜3）で足した契約に、対応する assertion が無い。

- 対象: `scripts/verification/validate-plugin.mjs` と、design.md の「validator の必須文言」の節。
- 変更前: 必須文言の追随（6 件）と `expectedRelease` だけを変える。
- 変更後: 新しい契約を固定する assertion を足す。

    | 対象 file | 足す検査 |
    | --- | --- |
    | `docs/documentation_standards/provisionality_explicitness.md`、`docs/development_standards/development_flow/work_scope.md` | 存在（`requireExists`）。判断の問い「見直す条件を知らない読み手がこの文だけを読んだら、恒久の方針と受け取らないか」、「「今の作業の目的の外である」ことは、切り出す理由にならない」 |
    | `skills/task-design/SKILL.md` | 「**作業の外へ残る変化の引き継ぎ**」、判定の問い「この作業で起きる変化は、この作業を破棄しても残るか」、`provisionality_explicitness.md` と `work_scope.md` の参照、「目的の内外の判定は、`facilitate-discussion`へ渡す前にtask-designが行う」 |
    | `skills/task-design/tasklist-design.md` | 冒頭の「`SKILL.md`のStep 4（design合意判定）で特定した、作業を破棄しても残る変化を起こすactionを対象action」。加えて、Step 4 へ移した例の表の行「\| DB migrationの適用 \| 残る \| 対象 \|」を禁止（`forbidText`）し、判定の定義が二箇所に戻らないようにする |
    | `skills/runtime-feedback-review.md` | `work_scope.md` の参照、「目的の外の不備を切り出すと決めた」 |
    | `skills/document-review/SKILL.md` | 「暫定性 → `provisionality_explicitness.md`」 |
    | `skills/task-design/templates/design.md` | 「見直す条件または切り出した先を書く」 |
    | `docs/documentation_standards/README.md`、`stock-and-flow-information.md`、`docs/development_standards/README.md`、`docs/think_standards/making_and_choosing_options.md` | 新しい標準への参照、または「## 補助: 提案が暫定か恒久かを示す」 |

- 理由: assertion が無いと、後の変更で契約の文が消えても validator が気付かない。今回拾った既存の失敗 4 件と同じく、文の移動・削除が検査から漏れる。
- 変えないもの: 必須文言の追随（6 件）、検査の意図。

#### 検討記録（論点4・イテレーション1）

steering の終了前 gate（doc-enricher）のため validator の扱いを記した文書を探し、root `README.md` の規約に当たった。task-design が設計前に読む repository context のテスト方針は「検証は manifest の整合確認だけ、skill 本文は人の review で担保する」と書いており、README と食い違っていた。設計がこの記述に依拠したため、assertion の追加が design から漏れた。

[内部検討記録: 論点4・イテレーション1](internal-records/task-design-discussion.md.topic-4.md#iteration-1)

### 現在の変更（論点4）

提案0の直し方を `scripts/verification/validate-plugin.mjs` へ適用し、design.md の受け入れ基準の TBD を解消した。validation の結果は design.md の付録「変更の実行区分」に記録する。

イテレーション1・変更内容1（新しい契約の assertion を validator へ足す）: 報告済み。報告後の利用者の実応答（2026-10-28）:

> a

この応答は、同じ chat で報告した steering の [discussion.md](discussion.md) 論点1・提案0 への合意も兼ねる（a は両方を進める選択肢）。design.md の「validator の必須文言」の節と、`scripts/verification/validate-plugin.mjs` へ反映済み。`plugin validation passed`。足した assertion が失敗を検出することを、作業 tree の複製で契約の文を消して確かめた。

### 決定（論点4）

`validate-plugin` が既定 branch（HEAD `44c4992`）でも失敗している必須文言の検査 4 件を、今の作業で拾う。validator の必須文言を、移動先の文へ追随させる。検査の意図は変えない。

- `steering/SKILL.md` に求めていた「feedback原文」「既に修正済みのfeedbackでも記録を省略しない」「reviewのdecisionやtask追加後も実装を自動再開しない」は、`skills/runtime-feedback-review.md` に求める。`steering/SKILL.md` には、共通 file を参照していること（`runtime-feedback-review.md` の文字列）を求める。
- `facilitate-discussion/read-discussion.md` に求めていた「末尾のiterationとfeedback状態」は、「末尾提示・原文応答・現在state・親子と根拠を判断する」に置き換える。
- commit は改善 1〜3 と分ける。

選択理由: 改善 1〜3 の目的の外にある不備だが、1 file の 4 箇所で検査の意図を変えず、review・revert・配布の単位を崩さない（`work_scope.md` の二段目）。今の作業の受け入れ基準（validator が passed を出す）は、この 4 件を直さないと満たせない。

代償: 今回の配布に、改善 1〜3 と無関係な validator の修正が一つ含まれる。
