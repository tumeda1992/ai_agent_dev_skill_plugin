# Design: skill-update-review を切り出しの検出に絞り、escalate の取り込みに plugin の update を足す

## 元の依頼内容

（steering へ渡された「達成したいこと」をそのまま記載する）

1. skill-update-review を、SKILL.md から切り出せるもの（独立した判断・状態・完了条件・改訂理由を持つ工程の抱え込み）の検出に絞る。
   - 出典: .steering/2026/202610/20261031-adopt-escalated-commit-practice-improvements/pending-escalations/001-narrow-skill-update-review-to-split-detection.md と、同 steering の task-design-discussion.md 論点9（決定）。
   - 利用者が合意した範囲: 「絞る」ことと「別の作業で行う」ことは、論点9 の提案2 への「a」（2026-10-31）で合意済み。利用者の観点は「skill-update-reviewが、切出しだけで機能してるならいいんだけど、それ以上のうるさい指摘存在になってないか」。書き直す範囲（description、assess-structure.md の最初の節と二重正本の段落、SKILL.md の再 review と hash の節など）と、20261018 の論点31〜47 の決定のどれを残すかは未合意であり、設計で合意を取る。

2. escalate-plugin-skill-fix の「plugin repositoryでの作業完了後の取り込み」に、main を push した後の plugin の update（marketplace の update、plugin の update、install した commit が main の先端と一致することの確認、利用者が /reload-plugins を打つ案内）を手順として足す。
   - 契機（2026-10-31）: assistant が 4 step の取り込みと plugin の update を利用者へ渡し、利用者に「え、escalateがやること終わってから私の作業じゃない？」「updateもあなたでしょ」と正された。
   - 利用者が合意した範囲: 取り込みと update が assistant の仕事であることは、上の利用者の発言による。手順として escalate に足す中身は assistant が書いた提案であり、assistant が「次の steering で一緒に扱う」と報告した後の利用者の応答（「打った」）に異論は無かったが、中身への明示の合意は無い。設計で合意を取る。

---

## TL;DR

skill-update-review は、SKILL.md から切り出せるものを知らせる役として頼まれた（利用者「あれに依頼したことはskill.mdから切り出せるものがあったら分割透知しろってだけの内容だったのに」）。
ところが、skill-update-review を使った三つの steering で、指摘 12 件のうち切り出しの指摘は 0 件だった。12 件のうち 9 件が利用者との問答になり、作業を遅らせた。切り出しを超えた指摘は、skill の文自体が求めていた。これを切り出しの検出に絞る。

あわせて、escalate-plugin-skill-fix の取り込みの手順を、`main` の push で終わらせず、plugin の update と session への反映の案内まで続ける。assistant が取り込みと update を利用者へ渡し、利用者に「updateもあなたでしょ」と正されたためである。

終了時には、skill-update-review が返すのは切り出しの候補だけになる。escalate の取り込みは、plugin の update と、install した commit の確認まで assistant が行う。

---

## 完成後の姿

### skillの役割と方針

#### skill-update-review

skill-update-review は、skill を新設・更新する時に、その skill の `SKILL.md` と内部指示が、独立した判断・状態・完了条件・改訂理由を持つ工程を一つの file に抱え込んでいないかを見る。抱え込んでいれば、同じ skill の内部指示へ分けるもの、または別 skill にするものとして知らせる。

##### 切り出しの候補だけを返す

返すのは切り出しの候補だけである。処理の順序・位置、受渡し・入出力・状態の遷移、文や規則の食い違い、script の動作、構造案と実物の一致は見ない。これらの欠けは、document-review、validator、動作の検証、利用者の review で見つける。

切り出すかの判断基準は、今の `assess-structure.md` の基準を保つ。

- 判断・状態・完了条件・改訂理由から決める。入力値や出力形式の違いだけでは分けない。
- 固有の判断・状態・完了条件と独立した改訂理由を持つ工程の抱え込みは、混線の実績が無くても候補にする。
- 別 skill にするには、現在の単独利用か、他の caller の具体的な要求が要る。将来の予測だけでは別 skill にしない。
- 分けると入口の gate・状態・返却が欠けるなら、その分け方は採らない。

##### 候補として知らせ、今切り出すかは呼出し側が決める

skill-update-review は、候補ごとに、どの工程が、どの判断・状態・完了条件・改訂理由を持つか、当てた変更 case、分ける先（同じ skill の内部指示か、別 skill か）を返す。候補が無ければ「候補なし」と返す。合格・不合格・材料不足の判定は持たず、更新の完了を止めない。

今の作業で切り出すかは、呼出し側が候補ごとに `development_flow/work_scope.md` の二段目で判定する。既定は今の作業で切り出す。大きすぎる・単体で revert したい・本番適用が遅れる時だけ別の作業にし、切り出し先を先に作る。
この扱いは、利用者の言葉「skill.mdから切り出せるものがあったら分割透知しろってだけの内容だったのに」による。20261018 の論点31 は、直さずに完了できると抱え込みが残り続けることを避けるため、解消するまで完了にしないと決めていた。その懸念は `work_scope.md` の既定（今の作業で拾う）で受け止める（[議論記録](./task-design-discussion.md#論点2-skill-update-review-が切り出しの候補を見つけた時更新の完了を止めるか)）。

##### やらないこと

- 編集しない。編集は skill-creator と元の担当が行う。
- 切り出しの判断に要らない材料を集めない。読むのは、対象 skill の `SKILL.md` と内部指示の全体（今回編集しない処理を含む）と、設計時の構造案だけである。呼ぶだけの別 skill、共有指示、script、更新前の比較元は読まない。
- 読んだ file の内容 hash を記録しない。前の結果を版に結んで再利用しない。再び呼ばれたら、その時の全体から候補を探し直す。
    - 20261018 の論点41〜47 は、受渡し・script・共有指示まで読み、合格の判定を版に結んで後の工程で使うために、これらを決めていた。切り出しだけを見て合否を持たない今は、その目的が無い（[議論記録](./task-design-discussion.md#論点2-skill-update-review-が切り出しの候補を見つけた時更新の完了を止めるか)のイテレーション1）。

### workflow

**skill-update-review の呼ばれ方:**

呼ぶ時期は変えない。構造案の採用前（設計時）と、skill-creator による編集の後の両方で呼ぶ（20261018 の論点33）。設計時は書く前に分け方を決めるため、編集後は編集で生じた抱え込みを見つけるためである。

| owner | 候補が返った時に行うこと | 行わないこと |
| --- | --- | --- |
| task-design（設計時・task-design 内の編集後） | 候補ごとに `work_scope.md` で今切り出すかを判定し、その判定を推奨として discussion で合意する。今切り出すなら構造案と design へ反映し、別の作業にするなら切り出し先を作る | 合否を待って構造案の採用や完了を止める |
| tasklist-executor（実装 phase の編集後） | 自分で切り出さず、「実装feedbackの記録と返却」を通して返す。判定は実装 feedback の共通処理（三問の後の `work_scope.md`）が行う | 自分で切り出す、再設計する |
| skill-update-review | 候補か「候補なし」を返す | 今切り出すかを判定する、編集する |

task-design の完了条件（Step 6）は、「設計時・編集後の結果が保存され、候補ごとに今切り出したか別の作業にしたかが記録されている」になる。

**escalate-plugin-skill-fix の取り込みと反映:**

plugin repository での steering が commit まで終わったら、assistant が次を続けて行う。手順の正本は `escalate-plugin-skill-fix/integrate-plugin-changes.md` である。

```text
1. 作業 branch を push する
2. main へ切り替える
3. 作業 branch を main へ merge する
4. main を push する
5. 使用中の AI agent の marketplace と plugin を update する
6. install された plugin の commit が main の先端と一致することを確かめる
7. 実行中の session へ反映する操作を利用者へ案内する
   （Claude Code では利用者が /reload-plugins を打つ。agent からは実行できない）
```

利用者へ依頼するのは 7 だけである。取り込みと update が assistant の仕事であることは、利用者の発言「え、escalateがやること終わってから私の作業じゃない？」「updateもあなたでしょ」による（[議論記録](./task-design-discussion.md#論点1-escalate-plugin-skill-fix-の取り込みの手順にplugin-の-update-を足す)）。
取り込みと反映は、引渡しとは始まる時点・完了条件・改訂理由が違うため、escalate の内部指示へ分けた。`SKILL.md` は見出しを残し、context file の `### Git / GitHub公開条件` が見出しの名前で指す参照を保つ。

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `skill-update-review/SKILL.md` | skill-update-review を適用する agent | 見るもの（抱え込み）と見ないものを区別し、`SKILL.md` と内部指示だけを読んで候補を返す |
| `skill-update-review/find-split-candidates.md`（`assess-structure.md` から改名） | 同上 | 分けるか、どこへ分けるかを判断・状態・完了条件・改訂理由と変更 case から決め、候補を返す |
| `skill-update-review/templates/review-result.md` | 同上 | 候補か「候補なし」を、呼出し側の既存記録の形で返す |
| `skill-update-review/agents/openai.yaml`、`skills/README.md` の一行 | skill を選ぶ agent・人 | 切り出しの候補を知らせる skill だと分かる |
| `task-design/SKILL.md`、`task-design/tasklist-design.md`、`task-design/templates/tasklist.md`、`tasklist-executor/SKILL.md` | skill-update-review を呼ぶ agent | 候補が返った時に、上の workflow の表のとおりに扱う |

`skill-update-review/collect-review-material.md` は削除する。中身（入力と比較元、依存先の読取、内容 hash）は切り出しの判断に要らず、残る「対象の `SKILL.md` と内部指示の全体を読む」は `SKILL.md` の進行の 1 行で足りる。
`assess-structure.md` を `find-split-candidates.md` へ改名するのは、名前が「構造の評価」という広い範囲を示し、今回外す照合を呼び込むためである。skill の名前（skill-update-review）は変えない（非目標）。

**完成後の内容と構造:**

`skill-update-review/SKILL.md`（「作業限定の暫定指示を取得する」の節と、元作業 directory が未確定な時の 3 行は今のまま）:

```markdown
---
name: skill-update-review
description: >-
  汎用skillの新設・更新で、SKILL.mdと内部指示が、独立した判断・状態・完了条件・改訂理由を持つ工程を抱え込んでいないかを見て、
  切り出せる工程（同じskillの内部指示へ分けるもの、別skillにするもの）を候補として知らせる。構造案の採用前と編集後に使う。単独でも使う。
---

# Skillの切り出し候補review

## 作業限定の暫定指示を取得する

（今のまま）

構造案の採用前と、skill-creatorによる編集後に明示適用する。編集そのものはskill-creatorと元の担当が行う。
候補が無いことは、利用者の合意、機能・安全・動作の検証、作業完了の合格を代替しない。

（元作業directoryが未確定な時の3行は今のまま）

## 見るもの、見ないもの

見るのは、対象skillの`SKILL.md`と内部指示が、独立した判断・状態・完了条件・改訂理由を持つ工程を一つのfileに抱え込んでいないかだけである。
処理の順序・位置、受渡し・入出力・状態の遷移、文や規則の食い違い、scriptの動作、構造案と実物の一致は見ない。これらの欠けは、document-review、validator、動作の検証、利用者のreviewで見つける。

- やってしまいがちな行動: 全体を読む途中で気づいた受渡しの欠けや文の食い違いを、ついでに指摘として返す
- それをやると何が起きるか: 切り出しと関係の無い指摘が、呼出し側で利用者との問答になり、作業を遅らせる。切り出しの指摘が一件も無いまま、それ以外の指摘だけが続いた例がある
- 正しい判断のための問い: 「この指摘は、fileを分けるか、別skillにするかの判断か」

## 入力と対象判定

対象の入口path、新規／更新、設計時／編集後、目的・変更内容、構造案、元作業と返却先を既存contextから揃える。専用依頼file、利用者の手動記入、固定構文は要求しない。

起動条件、指示、入出力、役割分担、参照・読取条件、scriptの動作を変える更新が対象となる。誤字・書式だけの変更は、差分と参照先から意味・構造不変を示せる時だけ除外できる。
file種類・行数・「軽微」という呼び名では除外しない。不明な変更と明示reviewは省略しない。

設計時は構造案と、既存更新なら現行の`SKILL.md`と内部指示を読む。新設の予定入口も認め、実行指示の先行完成を要求しない。編集後は実物の`SKILL.md`と内部指示を読む。
同じ設計・編集agentが明示適用してよい。

## 進行

1. 対象skillの`SKILL.md`と内部指示を、今回編集しない処理も含めて全体を読む。呼ぶだけの別skill、共有指示、script、更新前の比較元は読まない。
2. [切り出しの判断](find-split-candidates.md)で候補を探す。
3. [結果の部品](templates/review-result.md)で、候補か「候補なし」を呼出し側へ返す。保存は呼出し側の既存記録へ行う。

reviewだけで編集や実装を始めない。元のworkflowへ戻す。別作業の探索、外部連絡は行わない。

## 返したあと

候補ごとに、今の作業で切り出すかは、呼出し側が[`work_scope.md`](../../docs/development_standards/development_flow/work_scope.md)の二段目で判定する。このskillは判定しない。
再び呼ばれた時は、その時の`SKILL.md`と内部指示の全体から候補を探し直す。前の候補を今切り出したか、別の作業にしたかは、呼出し側の記録が持つ。
```

`skill-update-review/find-split-candidates.md`:

```markdown
# 切り出しの判断

対象skillの`SKILL.md`と内部指示の全体について、独立した判断・状態・完了条件・改訂理由を持つ工程を、一つのfileに抱え込んでいないかを見る。今回編集しない処理も対象とする。行数やfile数では判断しない。

## 分けるか、どこへ分けるか

一fileを維持するか、同skillの内部指示へ分けるか、別skillとして独立させるかは、判断・状態・完了条件・改訂理由から決める。入力値や出力形式の違いだけで分割しない。
固有の判断・状態・完了条件と独立した改訂理由を持つ工程を一fileに抱え込む構成は、混線の実績がなくても候補とする。内部指示へ分ける候補には、読む条件・所有する判断と状態・親への返却を添える。
分割によって入口のgate・状態・返却が欠けるなら、その分け方を候補にしない。
別skill化には現在の単独利用・他callerの具体要求を要し、将来予測だけでは独立させない。現在の外部利用要求があれば、実装済みcallerや利用実績を待つ必要はない。

## 変更caseで確かめる

具体的な改訂を一つ当て、その改訂がどのfileのどこを直すかを説明する。無関係な処理まで直す必要が出るなら、抱え込みの根拠になる。

たとえばdeployの復旧工程が固有の状態・再開条件・完了を持つなら、同じskill内の内部fileへ分ける候補になる。一方、帳票のCSV/PDFが同じ判断・状態・完了の値の切替なら、その違いで分けない。

新skillでも具体caseで評価できるが、過去の障害を創作しない。

## 返すもの

候補ごとに、どの工程が、どの判断・状態・完了条件・改訂理由を持つか、当てた変更case、分ける先（同じskillの内部指示か、別skillか）を返す。候補が無ければ「候補なし」と返す。
合格・不合格・材料不足の判定は持たない。分割後の構成を完成させることは要求しない。
```

`skill-update-review/templates/review-result.md`:

```markdown
# 切り出し候補の結果の部品

固定の提出構文ではない。該当する部品だけを、呼出し側の既存記録形式で使う。空見出しや架空の候補を作らない。

- 対象と段階（設計時／編集後）、読んだfile。
- 候補ごとに、工程、持つ判断・状態・完了条件・改訂理由、当てた変更case、分ける先。
- 候補が無ければ「候補なし」。
- 返却先と、保存した既存記録の場所。

## 架空例

対象はdeploy/SKILL.mdの編集後版。`SKILL.md`と内部指示の全体を読んだ。

候補: 復旧工程。固有の状態（復旧中）、再開条件、完了（配布の再成立）を持ち、通常のdeployと別の理由（障害の型の追加）で改訂される。配布手順を直す変更caseで、復旧の記述まで直す必要が出た。分ける先は同じskillの内部指示。

今の作業で分けるかは、呼出し側が`work_scope.md`で判定する。
```

`skill-update-review/agents/openai.yaml`:

```yaml
interface:
  display_name: "Skillの切り出し候補review"
  short_description: "汎用skillのSKILL.mdと内部指示から、切り出せる工程を候補として知らせる"
  default_prompt: "$skill-update-review で、対象skillのSKILL.mdと内部指示の全体を読み、切り出せる工程を候補として返す。"
```

`skills/README.md` の一行:

```markdown
- **skill-update-review** — 汎用skillのSKILL.mdと内部指示から、切り出せる工程を候補として知らせる。
```

`task-design/SKILL.md` の Step 2 の 5 行を、次の 4 行に置き換える。

```markdown
`skill-update-review`の対象判定に該当する汎用skillの新設・更新を含む時は、構造案を採用する前に`skill-update-review`を明示適用する。
対象入口、目的、構造案、既存更新なら現行の`SKILL.md`と内部指示、元作業と返却先を渡す。
結果は既存の設計議論または検証記録へ保存する。
切り出しの候補が返ったら、候補ごとに今の作業で切り出すかを[`work_scope.md`](../../docs/development_standards/development_flow/work_scope.md)で判定し、その判定を推奨としてdiscussionで合意する。
```

`task-design/SKILL.md` の「task-design内で汎用skillを編集する時のreview」を、次にする。

```markdown
対象判定に該当する汎用skillへ合意済み内容を適用する場合はskill-creatorで編集し、その後・完了宣言前に`skill-update-review`を明示適用する。
編集後の`SKILL.md`と内部指示、構造案、元作業を渡す。
結果は既存の設計議論または対象taskの検証記録へ保存する。切り出しの候補が返ったら、設計時と同じく`work_scope.md`で判定し、その判定を推奨としてdiscussionで合意する。
document-review、機能・安全・独立した動作検証、利用者合意と既存の完了条件は維持する。
```

`task-design/SKILL.md` の Step 6 の 2 行を、次の 1 行にする。

```markdown
対象判定に該当する汎用skillを扱った場合、設計時・編集後の`skill-update-review`の結果が保存され、切り出しの候補ごとに、今切り出したか別の作業にしたかが記録されていることも共通の完了条件とする。
```

`task-design/tasklist-design.md` の「汎用skillの構造review」を、次にする。

```markdown
`skill-update-review`の対象となる汎用skillの新設・更新を実装するphaseには、skill-creatorによる編集後・DoD判定前の`skill-update-review`明示起動をtaskとDoDへ含める。
編集後の`SKILL.md`と内部指示、構造案、元作業と返却先を渡す。同じ担当による明示reviewを認める。
結果を既存の検証記録または実装reviewへ保存する。切り出しの候補が返ったら、executorは自分で切り出さず、実装feedbackとして返す。
document-review、機能・安全・独立した動作検証、利用者確認を代替しない。
```

`task-design/templates/tasklist.md` の「汎用skillを新設・更新する場合のreview」の checklist を、次にする。

```markdown
- [ ] skill-creatorによる編集後・DoD判定前に`skill-update-review`を明示適用する
  - [ ] 編集後の`SKILL.md`と内部指示・構造案・元作業と返却先を渡す
  - [ ] 結果を既存の検証記録または実装reviewへ保存する
  - [ ] 切り出しの候補が返ったら、自分で切り出さず、実装feedbackとして返す
  - [ ] document-review・機能・安全・独立した動作検証・利用者確認を維持する
```

`tasklist-executor/SKILL.md` の「汎用skillの構造review」を、次にする。

```markdown
`skill-update-review`の対象となる汎用skillの新設・更新では、skill-creatorによる実装後・DoD判定前に`skill-update-review`を明示適用する。
編集後の`SKILL.md`と内部指示、構造案、元作業と返却先を渡す。
同じexecutorが明示適用してよく、別途指定された独立review・動作検証は省略しない。
結果を既存のtask検証記録または実装reviewへ保存する。
切り出しの候補が返ったら、自分で切り出さず、下の「実装feedbackの記録と返却」を通して返す。勝手に再設計しない。
```

**配置・形式:**

- 配置は今の skill-update-review の directory と、呼出し側の各節の位置のまま。
- 正本と重複防止: 切り出すかの判断基準は `find-split-candidates.md` だけが持つ。今切り出すかの判定は `work_scope.md` が持ち、呼出し側は参照だけを書く。

---

## 要件（Requirements）

### MUST（必達）

- skill-update-review が返す指摘を、切り出しの候補に限る。description・本文・内部指示・result の部品・`agents/openai.yaml`・`skills/README.md` の一行を、この役割にそろえる。
- 切り出すかの判断基準（上の「切り出しの候補だけを返す」）を保つ。
- 呼出し側の文を、決めた扱い・読む範囲・呼ぶ時期にそろえる。「内容識別」「材料不足」「合格の流用」「file集合・参照・解決先の照合」を求める文を残さない。
- 変えた文の assertion を `scripts/verification/validate-plugin.mjs` で直し、外した文が戻らないことを検査する。
- version を上げる（既存 skill の内容修正のため PATCH。8.2.1 → 8.2.2）。
- plugin へ書く内容に、利用先 repository 固有の情報を入れない（`maintenance_policies/migration.md`）。

### SHOULD（できれば）

なし

### MAY（あれば嬉しい）

なし

### 非目標

- skill-update-review の名前を変えること。利用者が使っている名前であり、役割は description と本文が定める。
- 20261018 の steering と、過去の steering の review 記録を書き換えること。過去の判断の記録であり、この作業の決定は新しい記録に置く。
- 切り出しを超えた欠け（受渡し、順序など）を見つける別の仕組みを作ること。document-review、validator、動作の検証、利用者の review が持つ。

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出す。
- skill-update-review の description と本文に、順序・受渡し・状態の遷移・規則の正本・script の動作・構造案との一致を見る文が無い（validator が検査する）。
- 切り出すかの判断基準の文が残っている（validator が検査する）。
- 呼出し側 4 file に「内容識別」「材料不足」が無く、候補が返った時の扱いの文がある（validator が検査する）。
- `skill-update-review/collect-review-material.md` と `assess-structure.md` が無く、`find-split-candidates.md` がある。
- main へ取り込んだ後、assistant が plugin を update し、install した commit が main の先端と一致することを確かめられる。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 切り出し以外の欠け（受渡しの欠け、command の不具合など）を、skill の更新時に見つけなくなる | document-review、validator の assertion、動作の検証、利用者の review で見つける。この弱点は、元の作業の論点9 で受け入れた |
| 呼出し側に、外した仕組み（内容識別、材料不足）を求める文が残る | 呼出し側の文を grep で洗い、validator の assertion を直す |

---

## テスト方針

- validator の assertion を、変えた文に合わせて直す。外した文（「内容hash」「必要な比較元が読めなければ材料不足」等）が skill-update-review と呼出し側に無いことを検査する。
- 変える前の文に戻すと validator が落ちることを確かめる。
- `node scripts/verification/test-task-design-handoff.mjs` と facilitate-discussion の helper の自己 test を通す。

---

## （付録）前提とする既存仕様

- `skill-update-review`（`SKILL.md`、`collect-review-material.md`、`assess-structure.md`、`templates/review-result.md`、`agents/openai.yaml`）: description は「全体の責務・判断・状態・受渡しをreviewする」。`assess-structure.md` の最初の節は、指示とコードの分担、入出力、判断・状態、停止・再開・返却、規則の正本、独立した改訂理由と検証のまとまりの照合を求める。`collect-review-material.md` は、専用 script の source 全文、呼ぶだけの別 skill の受渡し、内容 hash の記録を求める。`SKILL.md` の「既存結果の再利用と再review」は、内容 hash による照合を求める。
- 20261018 の steering（`.steering/2026/202610/20261018-escalate-pending-plugin-improvements/`）の論点31〜47: skill-update-review の決定。論点31 で構造上の不合格を完了の条件にし、論点33 で設計時と編集後の両方に挟み、論点36・38 で切り出しの基準を決め、論点41〜47 で入力・返却・読む範囲・hash を決めた。元の目的は論点31 の提案0 に「skillを変更する時に、処理を一つのSKILL.mdへ抱え込みすぎていないかを調べる役」とある。
- 元の作業（`.steering/2026/202610/20261031-adopt-escalated-commit-practice-improvements/`）の論点9: skill-update-review を使った三つの steering で、指摘 12 件のうち切り出しは 0 件、9 件が利用者への報告になった。
- 呼出し側: `task-design/SKILL.md` の Step 2（構造案の採用前）、Step 3 の「task-design内で汎用skillを編集する時のreview」、Step 6 の完了条件。`task-design/tasklist-design.md` の「汎用skillの構造review」、`task-design/templates/tasklist.md` の「汎用skillを新設・更新する場合のreview」、`tasklist-executor/SKILL.md` の「汎用skillの構造review」。validator は呼出し側の「skill-update-review」「内容識別」「材料不足」を検査する。
- `escalate-plugin-skill-fix/SKILL.md` の「plugin repositoryでの作業完了後の取り込み」: 作業 branch の push、`main` への切替、merge、`main` の push の 4 step で終わる。「引き渡し後」は、修正した skill は実行中の session へ反映されず、反映するには session を resume すると書く。context file の `### Git / GitHub公開条件` はこの節を名前で指す。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `escalate-plugin-skill-fix/SKILL.md`、`escalate-plugin-skill-fix/integrate-plugin-changes.md`、`scripts/verification/validate-plugin.mjs` | 取り込みの手順を内部指示へ移し、plugin の update・commit の確認・反映の案内を足した。「引き渡し後」の resume の文を内部指示の 7 に従う形へ直した。validator に内部指示の存在と手順の文、旧文が戻らない検査を足した | validator が通る。変える前の文に戻すと 12 件で落ちる | [workflow](#workflow) |
| skill-update-review（`SKILL.md`、`find-split-candidates.md`、`templates/review-result.md`、`agents/openai.yaml`）、`skills/README.md` の一行、`task-design/SKILL.md`、`task-design/tasklist-design.md`、`task-design/templates/tasklist.md`、`tasklist-executor/SKILL.md`、validator、version 宣言 | 「documentation以外のfile deliverable」の文のとおりに書いた。`collect-review-material.md` を削除し、`assess-structure.md` を `find-split-candidates.md` へ改名した。validator の assertion を新しい文に合わせ、外した文が戻らない検査を足した。version を 8.2.2 にした | validator、task-design handoff test、facilitate-discussion の helper の自己 test が通る。変える前の skill-update-review と呼出し側に新しい validator を当てると 41 件で落ちる | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし
