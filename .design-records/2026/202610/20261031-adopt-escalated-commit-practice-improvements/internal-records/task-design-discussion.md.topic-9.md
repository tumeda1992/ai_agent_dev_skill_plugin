# 内部検討記録: 論点9 — skill-update-review を、SKILL.md から切り出せるものの検出に絞るか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点9

## 開始context

利用者が、この作業で問いが多かったのは skill-update-review のせいかと問い、skill-update-review に頼んだのは SKILL.md から切り出せるものの通知だけだったと述べた（2026-10-31）。
assistant は問いの出どころを確かめ（[論点8 の内部検討記録、イテレーション1 の記録1](./task-design-discussion.md.topic-8.md#iteration-1-record-1)）、chat で「そのまま」を推奨して問うた。この問いは file へ保存する前に示した。
利用者は、絞るかを「今回の一連のsteeringで、間違ってないわけではないけれども、価値が少ない問答が遅延行為になったか」で決めると答えた。

<a id="iteration-0"></a>

## イテレーション0: 絞るか（事後記録）

この回の提案は chat で示した後に、2026-10-31 に事後記録した。判断の材料は、論点8 の内部検討記録のイテレーション1 の記録1 である。

<a id="iteration-1"></a>

## イテレーション1: 利用者の基準に当てる

<a id="iteration-1-record-1"></a>

### 調査: 一連の steering で skill-update-review から生じた問答と、その価値

#### 入力

- 問い: skill-update-review の指摘から、利用者との問答が何回生じたか。各問答は、直さなかったら、いつ誰が何を誤ったか。
- 範囲: この session の二つの steering とした。
    - 利用先 repository の steering（既存の「いいね」の一括取込みを外す作業）。`artifacts/skill-structure-review.md` と task-design-discussion の論点9・11・15
    - この作業の `artifacts/skill-structure-review.md` と task-design-discussion の論点3・6
    - 20261027 の steering など、この session より前の作業は見ていない。
- 方法: 2026-10-31 に、上の記録を読んだ。価値は、指摘を直さなかった場合の誤りの起きやすさと重さで見た。

#### 結果

- review の回数: 利用先で 3 回（設計時 2 回、編集後 1 回）、この作業で 5 回。
- 切り出しの指摘: 0 件。
- 問答（利用者の応答を要したもの）: 5 回。
    - 利用先の論点11 の報告（設計時 1 回目の指摘1、command 列の directory 依存）: 価値は高い。
        - steering の directory で実行すると、`.steering/` 配下の記録だけが一時 commit に入る。agent の shell は作業中に steering の directory へ移ることがある。
        - review は `git add -n` を実行して見つけた。動作の検証でも見つけられる種類である。
    - 利用先の論点15 の報告（設計時 1 回目の指摘2、入力と返却）: 価値は低い。
        - 入力が無いと、main を取り込まずに載せると選んで呼び直した時に、手順2 で再び止まる。agent がその場で気づいて避けられる。
    - 利用先の論点9 のイテレーション1 の報告（編集後 review の終了 code 4）: 価値は低い。
        - skill と script には終了 code 4 が既に入っていた。design.md の記録を実物にそろえただけである。
    - この作業の論点3 の変更内容4（1 回目の指摘2、確認環境へ載せる task）: 価値は低い。
        - 確認環境を持つ利用先は、今は一つである。そこでは `request-check-on-review-environment` が「tasklist の利用者確認 task に来た時」に起動し、確認環境へ載せる。task が無くても載る。
    - この作業の論点6（3 回目の指摘1、share-work-in-progress の一文）: 価値は低い。
        - steering の論点1 で、assistant がこの一文を作り直しの根拠に使った。誤りは一度起きた。
        - 論点5 で plan-commits に「既にあるcommitを書き換えない」が入った後は、この一文が効く場面は少ない。
- 問答の他の遅延: 各 review で読んだ file の SHA-256 を記録し、再 review で照合した。8 回分の記録がある。

<a id="iteration-1-record-2"></a>

### 判断: 絞るか、どの作業で行うか

#### 入力

- 問い: 利用者の基準で、絞るか。絞るなら、この作業か別の作業か。
- 方法: 上の結果を利用者の基準に当てた。行う作業は `development_flow/work_scope.md` の二段目で判定した。

#### 結果

- 価値が少ない問答は 5 回のうち 4 回あった。利用者の基準では、絞る。
- 別の作業にする（推奨）。
    - 絞ると、20261018 の論点31〜47 の決定のどれを残すかを決め直す必要がある。例えば、不合格なら完了にしない（論点31）、受渡しや二重管理の確認（論点46）、hash で確認した版を結ぶ（論点47）。
    - この作業に含めると、PR #9 の取り込みが遅れる。`work_scope.md` の二段目の「今の作業に含めると、本番への適用が遅れる」に当たる。
- 受け入れる弱点: 論点11 のような動作の不備を、skill-update-review では見つけなくなる。動作の検証で見つける。

<a id="iteration-2"></a>

## イテレーション2: 切り出しを超えた指摘をしているか

<a id="iteration-2-record-1"></a>

### 訂正: イテレーション1 の調査の観点

- イテレーション1 は、利用者の基準（「間違ってないわけではないけれども、価値が少ない問答が遅延行為になったか」）を、指摘一つ一つの価値の問題として読んだ。
- 利用者は「skill-update-reviewが、切出しだけで機能してるならいいんだけど、それ以上のうるさい指摘存在になってないか」と正した（2026-10-31）。
- 見るべきは、指摘が切り出しの検出の範囲に収まっているかである。範囲を超えた指摘は、価値が高くても範囲の外にある。

<a id="iteration-2-record-2"></a>

### 調査: 指摘の種類と、指摘を求めている skill の文

#### 入力

- 問い: skill-update-review の指摘のうち、切り出しの指摘はいくつか。切り出しを超えた指摘は、skill のどの文から来たか。
- 範囲: skill-update-review を使った三つの steering の review の記録。
    - `.steering/2026/202610/20261027-adopt-escalated-design-process-improvements/artifacts/design-structure-review.md`
    - 利用先 repository の steering の `artifacts/skill-structure-review.md`
    - この作業の `artifacts/skill-structure-review.md`
    - 20261018 の steering（skill-update-review を作った作業）の中の review は見ていない。
- 方法: 2026-10-31 に、各記録の不合格の見出しと根拠を読んだ。skill の `SKILL.md`、`assess-structure.md` と、作った commit `b172223` の description を読んだ。

#### 結果

- 指摘は 12 件。切り出しの指摘は 0 件。
    - 20261027: 6 件
        - 1: `runtime-feedback-review.md` の判定の位置が、決定の後になっている（順序）
        - 2: Step 3 の二つの scope の判定の順序が無い（順序）
        - 3: 足す節が思考標準の維持規律に沿っていない（規則の食い違い）
        - 4: `tasklist-design.md` の「対象action」と Step 4 の接続が無い（受渡し）
        - 5: 切り出す側が合意を経ずに切り出し先を作る順序に読める（順序）
        - 6: 「目的の外の判断」と判定した不確実性の状態が遷移しない（状態）
    - 利用先: 3 件
        - 指摘1: 一時 commit の command 列が、実行する directory で変わる（command の不具合）
        - 指摘2: skill の入力と、止まった時の返却が無い（受渡し）
        - 編集後 review: 終了 code 4 が design.md に無い（記録と実物の差）
    - この作業: 3 件
        - 1 回目の指摘1: 除外の句が箇所によって違う（文の食い違い）
        - 1 回目の指摘2: 確認環境へ載せる task を置く指示が無い（受渡し）
        - 3 回目の指摘1: share-work-in-progress が逆の既定を渡す（規則の食い違い）
- 利用者への報告になったのは 9 件（20261027 で 4 回、利用先で 3 回、この作業で 2 回）。
- 指摘を求めている skill の文:
    - description（`b172223` から変わらない）: 「全体の責務・判断・状態・受渡しをreviewする」
    - `assess-structure.md` の「全体の責務と進行を照合する」: 「指示とコードの分担、入出力、判断・状態、停止・再開・返却、規則の正本、独立した改訂理由と検証のまとまりを確認する。今回未編集の内部処理も対象とする。」
    - 同じ file の「変更caseで構造を評価する」: 同じ規則を別々に手管理する構造（二重正本）を不合格にする。
    - `SKILL.md` の「既存結果の再利用と再review」: local の file を内容 hash で識別し、再 review で照合する。
- 切り出しに当たる文は、「独立した改訂理由と検証のまとまり」と、一 file を維持するか・内部指示へ分けるか・別 skill にするかを判断・状態・完了条件・改訂理由から決める段落だけである。

<a id="iteration-2-record-3"></a>

### 判断: 絞るか、どの作業で行うか

#### 入力

- 問い: 切り出しの検出に絞るか。絞るなら、この作業か別の作業か。
- 方法: 上の結果を利用者の観点に当てた。行う作業は `development_flow/work_scope.md` の二段目で判定した。

#### 結果

- 絞る。skill-update-review は、切り出しの検出では一度も働かず、切り出しを超えた指摘だけをしていた。
    - 原因は運用ではなく skill の文である。作った時点から、順序・受渡し・状態・規則の食い違いの照合を求めている。
- 別の作業にする（推奨）。
    - 書き直す範囲: description、`assess-structure.md` の最初の節と二重正本の段落、`SKILL.md` の再 review と hash の節。
    - 20261018 の論点31〜47 の決定のどれを残すかを決め直す必要がある。
    - この作業に含めると、PR #9 の取り込みが遅れる。`work_scope.md` の二段目の「今の作業に含めると、本番への適用が遅れる」に当たる。
- 受け入れる弱点: 利用先の指摘1 のような動作の不備を、skill-update-review では見つけなくなる。動作の検証で見つける。

<a id="iteration-2-record-4"></a>

### 判断: 決定の後の doc-enricher の提案 review（origin: 論点9 の決定）

#### 入力

- 問い: 論点9 の決定から、README や既存 docs に足すべき、再利用価値の高い知識があるか。
- 方法: 2026-10-31 に、決定と `development_flow/work_scope.md` の「切り出す」の扱い、context file の `### Branch / issue 契約` を照らした。

#### 結果

- 候補なし。
    - 検討した候補: `work_scope.md` は切り出し先を「issue・steering」とするが、issue を持たず、steering を作ると設計がすぐ始まる repository では、保留メモが切り出し先になる。
    - 落とした理由: 既存の escalate の保留の仕組みで迷わず扱えた。誤りは起きておらず、書いても次の判断は変わらない。
