# 議論記録

## 論点26: 利用先で`.steering/`を移すことを利用者が承認しなかった時の扱い

**ステータス:** 応答待ち

**種別:** レビュー指摘

**重さ:** 確かめるだけ（全部小。論点14・25の決定から導ける）

変更を適用した後の逆方向の照合（追加した行から移行の対応表のIDを引く）で、合意の無い追加として見つけた。適用時に`prepare-design-record`の手順1へ「承認されなければ移さず、新しい記録だけを`.design-records/`へ置く」と書いていたが、論点14は承認されなかった時の扱いを決めていない。この書き方では、次に呼ばれた時に`.steering/`と`.design-records/`が両方あり、論点14の決定どおり止まる。

### イテレーション0（論点26）: 承認されなかった時の扱いを仮決めする

#### 提案0（論点26）

- a. 移さず、新しい記録も作らずに止まり、呼出し元へ返す（仮決め）
  - 根拠: 論点14の決定は、両方がある時は推測で混ぜず利用者へ確かめるとしている。承認されなかった時に新しい記録を`.design-records/`へ作ると、その併存の状態をこのskill自身が作る。止まれば、利用者が移すか、別の扱いを指示するまで状態は変わらない。
  - 今の`prepare-design-record/SKILL.md`の手順1は、この仮決めの文面で書いてある（対応表のA-009）。
- b. 承認されなくても、新しい記録は`.design-records/`へ作る
  - 次に呼ばれた時に両方がある状態になり、止まる。

#### 検討記録（論点26・イテレーション0）

論点14の決定（利用先では初回に移すことを提案し、承認されたら一度だけ移す。両方がある時は確かめる）と論点25の決定（移し方の正本は読み替えの記録）を読み、承認されなかった時の扱いがどちらにも無いことを確かめた。

#### 提案0へのフィードバック（論点26）

## 論点27: Blocker resolutionを`tasklist-executor`の別の内部指示へ分けるか

**ステータス:** 応答待ち

**種別:** レビュー指摘

**重さ:** 確かめるだけ（全部小。根拠は`skill-update-review/find-split-candidates.md`と`work_scope.md`の二段目）

編集後の`skill-update-review`の候補から立てた。

### イテレーション0（論点27）: 編集後のreviewの候補を、今の作業で分けるかを仮決めする

#### 提案0（論点27）

**reviewの結果（編集後）:** `task-design/SKILL.md`と`wrap-up.md`、`prepare-design-record/SKILL.md`と`summarize-previous-month.md`、`advance-roadmap/SKILL.md`、`tasklist-executor/SKILL.md`と`execution-contracts.md`と`implementation-feedback.md`の全体を読んだ。設計時の二つの候補（締めくくりの確認、前月summary）は分け終えている。新しい候補は一件である。

- 候補: `tasklist-executor/execution-contracts.md`の「Blocker resolution」。固有の状態（Flowを離れている）、完了（離れた段の先頭へ戻る）、判断（三択、自走の範囲）を持ち、自走の決まりの見直しという、child request・resultの形とは別の理由で改める。自走の範囲を一つ直す変更を当てると、JSONの形を定めたfileを直すことになる。分ける先は`tasklist-executor`の内部指示。
- `advance-roadmap`、`prepare-design-record`、task-designには新しい候補は無い。

- a. 今の作業で`tasklist-executor/blocker-resolution.md`へ分け、`execution-contracts.md`の「起動する側が行うこと」から、`blocked`で返った時と、進めなくなった時に読むと参照する（仮決め）
  - 根拠: `work_scope.md`の二段目で、今の作業のreview・revert・本番適用の単位は崩れない。論点8で置いた先の中で、同じskillの別fileへ分けるだけであり、論点8の決定（起動する側が行うことに置く）の意味は変わらない。後で分けると、今書いた節と参照を二度直すことになる。
- b. 今は分けない
  - 今の`execution-contracts.md`に残る。

#### 検討記録（論点27・イテレーション0）

`skill-update-review/find-split-candidates.md`の基準で、編集後の各fileを読んだ。`execution-contracts.md`は、子agentへの委譲の契約、起動する側の約束、Blocker resolutionを持つ。起動する側の約束は停止理由の扱いと結び付いており、分けると停止理由の定義と離れるため候補にしない。Blocker resolutionは停止理由の定義を参照するだけで、独立して改められる。

#### 提案0へのフィードバック（論点27）

