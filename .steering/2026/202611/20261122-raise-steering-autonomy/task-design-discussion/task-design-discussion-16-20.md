# 議論記録

## 論点16: 決めた規則を、どのskill・docsのどこに置くか（置き場の骨格）

**ステータス:** 応答待ち

**親論点:** 論点1

**種別:** TBDヒアリング

### イテレーション0（論点16）: fileごとの変更の対応表と、設計時の構造reviewを示す

#### 提案0（論点16）

重さ: 一つずつ考える（波及: 大 — この後の文面と検査の論点がすべてこの答えを前提にする。利用者の前提: 中。他は小）

##### 置き場の考え方

- 論点の進め方の規則（重さ、一往復の組み方、仮決めの示し方、まとめた返事の読み方、前例の探し方）は、提示・応答・決定を受け持つ`facilitate-discussion`に置く。今の`SKILL.md`は論点を一つ選ぶ前提で書かれた入口であり、`iteration.md`は一つの論点の回を扱う。どちらにも収まらない独立した工程なので、新しい内部指示file（下の表の1）に置き、`SKILL.md`から読む時点を示す。
- `task-design`は、論点の中身を持たず、TBDを識別した時点で論点として`facilitate-discussion`へ渡すことと、一つずつ選ぶ前提を改めることだけを持つ。
- 思考の作法（`docs/think_standards/advancing_discussion.md`）は、上位から一つずつの主軸を保ち、まとめてよい論点の例外と、既にある発言・決定から決まる論点を仮決めとして問うことだけを改める。
- 保留の知らせは、`escalate-plugin-skill-fix/pending-escalations.md`と、確かめ直しを依頼する三つのskillを改める。

##### fileごとの変更

| # | file | 変えること | 元の決定 |
| --- | --- | --- | --- |
| 1 | `facilitate-discussion/compose-round-trip.md`（新規。名前は仮） | 重さの判定（四観点、三段、序列、判定する時点）、前例の探し方、一往復の組み方（段ごとの数、回を重ねた論点、横展開、依存、順、利用者の指示）、仮決めの示し方と答え方の一文、まとめた返事の読み方と各論点への振り分け | 論点2・4・5・6・8・11・13 |
| 2 | `facilitate-discussion/SKILL.md` | 全体の設計意図に、往復は論点を混ぜずに軽い論点をまとめて示して減らす旨を足す。論点を選ぶ節を「一往復で示す論点の組を1で選ぶ」に改める。論点をわかった時点で立てる（依存のある論点は依存先・重さ・案を作れる条件だけ）ことを足す。まとめた返事で合意された論点を一つずつ確定・返却する。変更の権限の分類から一意な導出を外す | 論点1・3・7・8 |
| 3 | `facilitate-discussion/iteration.md` | 提案に重さを書く。確かめるだけの論点は仮決めとして形にする。まとめた返事は1の振り分けに従い、各論点の応答欄へ書く | 論点6・9・13 |
| 4 | `facilitate-discussion/derived-change.md` | 「既決事項からAIが一意に導出した変更」を外し、仮決めの論点として立てる先を示す。明示委託と機械的適用は残す | 論点7 |
| 5 | `facilitate-discussion/templates/discussion_entry.md` | 論点metadataに重さと依存先の欄を足す。依存先の決定待ちを表す状態を足す | 論点2・3 |
| 6 | `facilitate-discussion/scripts/inspect-discussion.mjs`とそのtest | 依存先の決定待ちを新しい状態の値で表す場合だけ、既知の状態へ加える | 論点3 |
| 7 | `docs/think_standards/advancing_discussion.md` | 主軸の「やってしまいがちな行動」の「直下の全問いを一度に並べる」に、まとめて考える・確かめるだけの論点はまとめてよい例外を足す。補助「見つけた不備を問いにする前に、誤る場面を一つ言う」の「導いた結果として報告する」を「根拠を名指した仮決めとして問う」に改める | 論点4・7 |
| 8 | `task-design/SKILL.md` | Step 1の「この時点ではdiscussion fileの論点・提案・親子関係を組み立てない」を、TBDを識別したら論点として`facilitate-discussion`へ渡す、に改める。Step 3の「不確実性を一つ選ぶ」を、discussionで解く不確実性は`facilitate-discussion`へ渡して組み方を任せる、に改める。保留の確かめ直しの依頼を、再開時からは外し、design phaseの完了時は設計完了を条件にしたメモがある時だけにする | 論点1・14 |
| 9 | `steering/SKILL.md` | 保留の確かめ直しの依頼を、Step 3、6-1、6-2の手順6から外し、元作業全体の完了時だけにする | 論点14 |
| 10 | `tasklist-executor/SKILL.md` | 再開時とtask・phaseの完了時の確かめ直しの依頼を外す。完了ownerとしての完了時の依頼は残す | 論点14 |
| 11 | `escalate-plugin-skill-fix/pending-escalations.md` | 「元担当の状態遷移から再確認する」を、再開条件が成り立ちうる時点だけに改める。利用者へ伝える時点（保存時の一行、引き渡しに入る時、判断が要る時）を書く | 論点14・15 |
| 12 | `scripts/verification/validate-plugin.mjs` | 変えた契約の文を検査するassertionを足し、固定している文が変わる所を追随させる | root `README.md`「変更時の検証と前提」 |
| 13 | version宣言の4箇所と`expectedRelease` | 上げる | `maintenance-plugin-context`「Plugin version」 |

##### 変えないもの

- `steering`の議論の進め方。steeringは`facilitate-discussion`を通して議論するため、2〜4の変更がそのまま効く。
- think-throughのhookの注入文（`.claude/hooks/think_through_session_start.sh`）。advancing_discussionの要約「ロジックツリー上位から再帰。往復コストが高ければ TBD 暫定全体を先に出す」は、7の変更の後も成り立つ。
- 止まっている作業`.steering/2026/202611/20261115-review-discussion-recording/`の記録。過去の作業記録は直さない。論点7の決定で、そこで未決だった一意な導出の扱いは、4の変更で閉じる。

##### この後に決めること

この骨格が決まった後に、次を別の論点で問う。

- 1の新しいfileの名前と見出しの構成
- 5・6の依存先の決定待ちを、新しい状態の値で表すか、今の「保留」と依存先の欄で表すか
- 5の重さと依存先の欄の書き方
- 7の改める文面
- 各fileの文面（変更の全体を差分で示す）
- 13のversionの上げ幅
- 下の構造reviewで見つかった、目的の外の候補の扱い

判断してほしいこと: 決めた規則を置く場所を、この骨格（新しい内部指示fileを1つ作り、表の13箇所を変える）で進めてよいか。

#### 検討記録（論点16・イテレーション0）

##### 調査: 決めた規則に触れる今の箇所

論点1〜15の決定ごとに、今のskill・docsで反する文、または置き換える文を探した。

- 一つずつ選ぶ前提: `facilitate-discussion/SKILL.md`「scopeと親子関係」の「一つのleaf論点を一つのdecisionとして選び、その論点が次のユーザー判断を待てる状態または終了状態になるまで扱う」、「合意したdecisionを確定する」の「次論点が依存から一意ならその提案まで同じturnで進み、次の合意を待つ。同じturnで次decisionを確定しない」、`task-design/SKILL.md` Step 1・Step 3、`think_standards/advancing_discussion.md`の主軸。
- 往復の減らし方: `facilitate-discussion/SKILL.md`「全体の設計意図」の「往復を減らしたいなら、未決事項をTBDのまま暫定全体として提示し、構造への合意を先に取る」。この方法は残し、軽い論点をまとめて示す方法を足す。「一つの提案へ複数decisionを詰めることは、往復を減らさずに合意の粒度だけを粗くする」は、論点1の変えないもの（一つの提案は一つのdecision）と同じであり残す。
- 一意な導出: `facilitate-discussion/derived-change.md`の表の二行目、`facilitate-discussion/SKILL.md`「変更の権限から経路を選ぶ」、`think_standards/advancing_discussion.md`の補助。
- 保留の確かめ直し: 論点14の検討記録で挙げた、`tasklist-executor`・`steering`・`task-design`の依頼箇所と、`pending-escalations.md`「元担当の状態遷移から再確認する」。
- 状態の値: `facilitate-discussion/scripts/inspect-discussion.mjs`は、論点の状態を既知の値（応答待ち、調査中、子論点待ち、決定、保留、分解済み、提案中、反映待ち、反映済み）と照合している。新しい値を足すならscriptも変わる。
- 検査: `scripts/verification/validate-plugin.mjs`は「一つのleaf論点を一つのdecision」を固定している。この文は残すため、追随は要らない。

##### skill-update-review（設計時）

task-designのStep 2に従い、構造案の採用前に`skill-update-review`を当てた。

- `facilitate-discussion`: `SKILL.md`、`iteration.md`、`derived-change.md`、`read-discussion.md`、`resolve-discussion.md`、`split-discussion.md`、`record-recovery.md`とtemplatesを読んだ。今回足す「一往復で示す論点を組み、まとめた返事を振り分ける」工程は、固有の判断（重さと段）、状態（まとめて示した論点のうち答えを待つもの）、完了条件（各論点が答えを得るか、待つ状態として次のまとまりへ入る）、改訂理由（利用者の一度に考えられる量）を持つ。`SKILL.md`へ書くと抱え込みになるため、構造案で新しい内部指示file（表の1）に分けている。既存の工程では、`SKILL.md`「認識齟齬を原因ownerへ戻す」が、固有の判断（原因ownerの分類）、状態（originごとのdoc-enricher reviewを一度だけ行う）、完了条件（reviewの結果の保存）、改訂理由（原因の振り分けの方針）を持ったまま入口の一節にある。変更case: origin単位のreviewの起動条件を変えると、この節と「合意したdecisionを確定する」の一文を直し、file解決や論点の採番は直さない。分ける先は同じskillの内部指示。
- `escalate-plugin-skill-fix`: `SKILL.md`、`pending-escalations.md`、`integrate-plugin-changes.md`を読んだ。保留と再開、取り込みは既に別fileに分かれている。今回の変更は`pending-escalations.md`の節の中に収まる。候補なし。
- `steering`、`task-design`、`tasklist-executor`: 今日の別作業`.steering/2026/202611/20261122-reorganize-shared-skill-references/`の論点10で、同じ三つへ設計時・編集後の`skill-update-review`を当てている。結果はsteeringに3件（Blocker resolution、Standalone roadmapの昇格、前月summaryの生成）、task-designに1件（「8. このスキル自体の更新について」）の候補があり、issue #27へ切り出し済み、tasklist-executorは候補なしだった。その編集後の結果を記録したcommit（cf9e9be）以降、三つのskillのfileは変わっていない（`git log`で確認）。今回の変更（表の8〜10）は文を改めるだけで工程を足さないため、新しい候補は生まない。

`facilitate-discussion`の既存の候補（原因ownerの振り分け）は、この作業の目的（論点の進め方）の外にある。今の作業で扱うかは、`work_scope.md`の二段目で判定し、別の論点で問う。

#### 提案0へのフィードバック（論点16）
