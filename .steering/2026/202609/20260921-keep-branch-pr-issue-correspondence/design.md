# Design: branch・PR・issue の対応を保つ契約を置く

## 元の依頼内容

利用先 repository から `escalate-plugin-skill-fix` で引き渡された提案のうち、提案4 を扱う。

検証のために既定 branch へ merge する必要がある場合の扱いが決まっていない。issue 完了の merge と同じ経路を使った結果、検証のための merge が `Closes #28` で issue を閉じた。加えて merge 済みの branch 名を再利用した。

既定 branch への merge が terraform apply を本番へ走らせる契機になった repository では、この崩れが直接事故へつながる。

> 大抵、マージはissueで1つであり、それはそのブランチの終了、issueの終了を意味する。だから、howでできるからといって乱立させたくない。同じ変数に文脈が変わるのに雑に値を入れるのと同じようなもの。今回みたいに検証したいことがmergeしないとできないのであれば、そのブランチを用意して作業するとかにしたい。mainにマージするって、これからはterraformで本番に自動applyされる大事な営みなんだよ

同じ steering の後半で正しい形（別 branch、`Closes` なしの PR）を実証済みである。

---

## 上位roadmap制約

- 親roadmap: `.steering/2026/202609/20260921-apply-escalated-skill-fixes/roadmap.md`
- 親phase identity: `branch-pr-issue-correspondence`
- 親phaseの目的: 検証のために既定 branch へ merge する必要がある場合の扱いが決まっていないため、検証の merge が issue を閉じ、merge 済み branch 名が再利用される状態を解消する
- 親phaseのscope: 検証のための merge が必要な場合の branch・PR の立て方と、その PR が `Closes` を持たないこと / merge 済み branch 名の再利用の禁止 / owner の決定（候補は `task-design` の plan 設計時、`tasklist-executor` の実行時契約、`steering` の orchestration）/ 既存の「ユーザー動作確認が完了する前に commit、push、PR を行わない」との関係整理
- 親phaseのscope外: 動作確認の DoD の具体化（`verification-concreteness` が扱う）/ 提案の出し方に関する 3 phase の内容
- 親phaseのDoD: 下記「受け入れ基準」へ展開する
- 依存phase: なし

---

## 調査で確定した事実

**`merge` と `issue` の契約は、どの skill にも存在しない。**

```text
task-design/tasklist-design.md  push/PR section の生成条件、commit 前のユーザー動作確認、
                                create_or_get_pr.sh の使用、local commit の存在確認
tasklist-executor/SKILL.md      script の使用、ユーザー動作確認前に commit・push へ進まない
steering/SKILL.md               branch_from_basename、branch 作成、
                                ユーザー動作確認前に commit・push・PR を行わない
share-work-in-progress/SKILL.md 作業中 branch の共有。PR 作成まで。merge はしない
```

三つの skill はいずれも「PR を作るところまで」を扱い、**merge した後に何が終わるかを扱っていない。**

`feature-<issue番号>` という branch 命名契約は、利用先 repository の `.agents/skills/tumeda-dev-plugin-context.md` にある。plugin 側には無い。

**既存の commit・push・PR 制約との関係は、`share-work-in-progress` が既に整理している。** 同 skill は「`tasklist-executor` の『ユーザー動作確認が完了するまで commit・push・PR を行わない』契約とは前提が逆であり、動作確認の後に呼ぶものではない」と明記し、起動 gate で両者を分けている。今回の contract がこの整理と矛盾しないことを確認する必要がある。

---

## 失敗の分析

実際に起きたことを、何が問題だったか / どこでどうすればよかったか に分けて並べる。

| 起きたこと | 何が問題だったか | どこでどうすればよかったか |
| --- | --- | --- |
| 検証のために `main` へ merge する必要が生じた | 問題ではない。既定 branch への merge でしか確認できない挙動は実在する | — |
| issue 完了の merge と同じ経路（`Closes` 付き PR）を使った | **merge が issue を閉じた。** 残 phase があったのに issue が完了扱いになった | 検証のための merge だと分かった時点で、`Closes` を持たない PR を立てる |
| merge 済みの branch 名を再利用した | **branch 名と issue の 1:1 対応が崩れた。** 同じ名前が二つの異なる作業を指す | 新しい branch 名を使う。merge 済みの名前は再利用しない |

**共有されていなかった前提は一つである。** branch と issue は 1:1 で対応し、merge はその両方の終了を意味する。この前提が skill に書かれていないため、`Closes` を付けるかどうかが「その PR で issue を閉じたいか」という個別判断になり、branch 名の再利用が「履歴が綺麗になるか」という別の軸で判断された。

**契約として書く内容は確定した（論点1）。**

```text
前提
  branch と issue は 1:1 で対応する。
  merge はその branch の作業の終わりであり、同時に issue の終わりである。

経路 1: issue 完了の merge          経路 2: 検証のための merge
  branch が issue の作業を終えた      既定 branch へ入れないと確認できない挙動がある
  PR は `Closes` を持つ               PR は `Closes` を持たない
  merge 後、branch 名は再利用しない   検証が終わったら元の作業 branch へ戻る
```

経路の選択は「この merge で issue の作業が終わるか」で判定する。規律は三つ。`Closes` は issue の終わりを宣言するため検証の merge へ付けない。merge 済みの branch 名を再利用しない。既定 branch への merge が本番適用を起こす repository では経路 2 も適用を起こすため、適用されて困る変更を含めない。

---

## TL;DR

merge は branch と issue の終了を意味する。この対応を保つため、検証のための merge には別の経路を用意する。

終了時には、検証のための merge と issue 完了の merge が別の形として書かれ、どちらの経路を使うかが判断できる状態になっている。merge 済み branch 名の再利用も禁止されている。

---

## 完成後の姿

### skillの役割と方針

契約は `development_standards` が正本として持ち、skill は参照する。契約が必要な場面が `task-design`（tasklist を作る）、`tasklist-executor`（実行する）、`steering`（branch を作る、phase を管理する）の三つにまたがるため、skill の中へ置くと他から引けない。

`task-design` は `development_standards` 配下を無条件に読むため、判定漏れによって標準へ触れない経路が生じない。

標準は原則と推奨形式を定め、形式そのものは利用先が context file で宣言する。issue を持たない repository（plugin repository 自身がその例）でも成立させるためである。

### workflow

契約の内容は「調査で確定した事実」の下へ記した（論点1 で決定）。

**置き場は `docs/development_standards/development_flow/branch_pr_issue.md`（新設）。**

`README.md` の定義を「開発にまつわる標準を置く場所」へ直し、置き場の判断を場面の列挙から対象領域の問いへ変える。

```text
**この標準が扱う対象は何か。**

- 開発そのもの（何を作るか、どう名付けるか、どう進めるか） → この群の配下
- docs の書き方・構造化 → documentation_standards/
- 思考・議論のプロセス → think_standards/
```

**branch 名の形式。**

```text
原則   branch 名から issue 番号を一意に引けること
       その issue の本線がどれかを名前から判定できること
       merge 済みの branch 名を再利用しないこと

推奨   本線 issue-<番号>            派生 issue-<番号>-<説明>
       `issue-` の直後の数値列を issue 番号として読む
```

**引く場面を置くのは `steering` と `task-design` の二つ。** `tasklist-executor` には置かない。

```text
steering                      branch を作る直前に引く
task-design（tasklist-design.md）
  push・PR section の生成規則   既定 branch への merge を含む場合に引き、経路を判定する
  自己レビューgate              経路の判定を確かめる項目
tasklist-executor             置かない。経路の判定は tasklist を作る段階で済んでいる
```

いずれも判定の中身を写さず、引く指示と失敗例だけを持つ。`name-work-directory` が `naming/README.md` を引く形と同じである。

**`task-design` が配下を無条件に読むことは、その場面で使われることを保証しない。** 読まれる可能性と、必要な場面で引かれることは別であるため、生成規則と gate の二箇所へ引く場面を明示する。

**検証のための merge の単位。**

```text
検証用 branch   `issue-<番号>-<検証内容>`。本線と同じ issue に属する
差分            既定 branch 上でしか動かない仕組みを動かすのに必要な範囲を含めてよい
PR              `Closes` を持たない。issue へは参照として書く
                本文に「この PR は issue の完了を意味しない」を明記する
merge 後        既定 branch を本線へ取り込み、作業を続ける
後始末          検証のためだけに入れた差分は本線で削除し、issue 完了の merge で反映する
```

最小差分に制限しないのは、検証用 PR が必要になるのが CI や deploy が既定 branch 上でしか動かない場合であり、それを動かすには本線の修正が既定 branch に入っている必要があるためである。

### documentation以外のfile deliverable

対象 file は次の通り。

| file | 変わる内容 |
| --- | --- |
| `docs/development_standards/development_flow/branch_pr_issue.md` | 新規。前提、二つの経路、三つの規律、branch 名の原則と推奨形式 |
| `docs/development_standards/README.md` | 定義、置き場の判断、収録一覧、維持規律の file 数と分量 |
| `skills/scripts/github/create_or_get_pr.sh` | `feature-<issue番号>` のハードコードを、context file の宣言を読む形へ緩める |
| `skills/tumeda-dev-plugin-context.md` | `### Branch / issue 契約` section の記載方針 |
| `skills/steering/SKILL.md` | branch を作る直前に標準を引く指示 |
| `skills/task-design/tasklist-design.md` | push・PR section の生成規則と自己レビューgateへ、経路判定の指示 |

---

## 要件（Requirements）

### MUST（必達）

- owner が一つに決まり、対象 file へ反映されている
- 検証のための merge と issue 完了の merge を分ける形が、branch・PR・`Closes` の扱いとして具体的に書かれている
- 既存の commit・push・PR の制約との関係が整理され、矛盾が残っていない
- 既定 branch への merge が本番適用を起こす repository で、この契約がどう効くかが読み取れる

### SHOULD（できれば）

- 修正で増える記述を最小に留める

### MAY（あれば嬉しい）

- 利用先で実証済みの正しい形（別 branch、`Closes` なしの PR）を具体例として使う

### 非目標

- 動作確認の DoD の具体化。phase `verification-concreteness` が扱う
- 提案の出し方に関する 3 phase の内容

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する
- この phase 完了時点で、触った skill が単独で利用可能である
- 起点となった実例以外の具体 case を二つ以上、確定した契約へ当て、どちらの経路になるかが判定できることを確認する

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 既存の commit・push・PR 制約と矛盾する | `share-work-in-progress` が既に整理した境界を先に確認し、同じ軸で書く |
| 契約を置いても、merge の種類を判定する契機が無ければ発火しない | 配下を読むことに依存せず、`task-design` の生成規則と gate、`steering` の branch 作成直前という実手順の位置へ引く場面を置く |
| `development_standards` の file 数が増え、「配下をすべて読む」契約が成立しなくなる | 維持規律の file 数と分量の記載を更新し、読み切れるかを利用者が判断できる状態にする |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs` を実行する
- この repository は自動 test framework を持たないため、skill 本文の内容は人の review で担保する
- `document-review` skill を md の emit 前ゲートとして適用する

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

なし。

### task-design内の対象成果物反映待ち

なし。

### execution plan対象

なし。対象はすべて docs・skill・script の修正であり、合意済み内容から一意に反映でき、他の未決事項へ依存せず、一つの連続した反映・validation で完了できる。

### 分類保留（設計中のみ）

なし。
