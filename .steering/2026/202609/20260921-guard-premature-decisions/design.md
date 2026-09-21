# Design: 判断材料が揃う前に決めない段を置く

## 元の依頼内容

利用先 repository から `escalate-plugin-skill-fix` で引き渡された提案のうち、提案1 を扱う。

`facilitate-discussion` は「`提案N` はその回の問いを判断できる案にする」と定めるが、**その案が「判断できる」かを何で確かめるかが書かれていない。** 形式は整っているが前提が誤っている提案は、形式の確認では検出できない。

利用先 repository での実例。ある論点のイテレーション1 で、事実を一つ見つけた時点で三案へ畳み、その三案が依拠する前提を疑わなかった。イテレーション2 で前提が誤りと判明し、結論が逆転した。

> 何度も言ってるけど、決定だけ急がないで。決められる判断材料が揃って、ほぼどれを選ぶか自明になってから決めに入る。

既存の思考標準を確認済みで、盲点にあたる。`choosing_between_options.md` の主軸は「選べないのは、材料が枯れていない合図」で、assistant が選べないと感じたときに発火する。`presenting_options.md` の補助「選択肢に畳めたことは、議論が不要になったことを意味しない」は、畳めた後に記録を省くかどうかの話である。どちらも assistant が自信を持って提案を出すときには発火しない。

### 併合された提案（別の利用先 repository で先に記録され、escalate されないまま保留されていたもの）

対象は `task-design` の section 5 Step 3「未解消の設計判断を解消する」。

Step 3 は「解消すると下位判断を最も多く確定できる不確実性を一つ選ぶ → 解消手段を選ぶ → 実行する → 確定した decision を design へ反映する」の順序を持つ。1 で「規定力が最大の不確実性」を選ばせた直後に、2 以降がすべて「解消する」前提で構成されている。解消手段（discussion / 調査 / 技術検証実装）は三つとも解消のための手段であり、**「まだ決めない」という分岐が構造上存在しない。**

入れるべきは、1 と 2 の間に置く「今が決める時期か」の判定である。判定基準は、根拠が揃って選択問題に落ちているかどうか。落ちていなければ確定させず、仮決定と再開条件を置いて前へ進み、根拠が集まってから戻る。

必要だと分かった具体例が 2 回連続で発生している。一度目は、作業場の全容が見えていない段階で成果物一件分のディレクトリ構造を 3 案提示し「今のこの決め方はキャップを決めている」と差し戻された。二度目は、工程の完了条件 3 項目を既存成果物からの演繹だけで提示し「プロダクトアウトで演繹的に機能しているだけ」として仮決定へ格下げされた。

どちらも、規定力の大きい判断を先に扱ったこと自体は正しい。誤りは、**扱うことと決めることを区別せず、そのまま確定させにいった点**にある。

> task-designがそう指示したとしても、決まっていない不確実性が高いものを決めることが先走って勝手に決めちゃうって悪手だよね。不確実性が大きいものはそれだけ影響力がでかく、それが決まることによる制約が大きいもの。決めるための根拠があってあとは選ぶだけっていう状況だったらいいけど、そうじゃないのに決める状態では不確実性が高いことについて扱うにあたって決めちゃいけない

`facilitate-discussion` の `仮決定` と `再開条件` は、根拠が揃う前に前へ進むための道具として既に存在する。しかし `task-design` 側の Step 3 からは、この二つを使う判断へ接続していない。

### この steering 自身で観測された追加の実例（3 件）

親 roadmap の論点1 で、同じ誤りが三度起きた。

1. 5 件の提案を 2 群へ分けるとき、「触る場所が同じ」を根拠にした。しかし対象の owner は未決だった。**owner が決まっていないのに「同じ場所」と決めつけていた。**
2. 指摘を受けて分類をやり直したが、「性質が同じ」と言い換えただけで判定の中身を変えなかった。**自分で書いた「独立した decision として分ける」を、後続の構造設計へ適用しなかった。**
3. 依存の向きを「一方の owner 次第」として未確定と判定した。相手側から問えばすぐ決まった。**片側からだけ見ていた。**

3 の個別対処（依存の向きを両端から問う）は `think_standards/ordering_parallel_items.md` へ、2 の個別対処（束ねる根拠を答える問いで照合する）は `roadmap-design.md` へ追記済みである。**この phase が扱うのは、これらの個別対処ではなく「判断材料が揃う前に決めない」という原則そのものの置き場である。**

---

## 上位roadmap制約

- 親roadmap: `.steering/2026/202609/20260921-apply-escalated-skill-fixes/roadmap.md`
- 親phase identity: `proposal-decidability`
- 親phaseの目的: 提案が「判断できる案」になっているかを確かめる段が存在しない状態を解消する
- 親phaseのscope: 段の設計と owner 決定（候補は `facilitate-discussion` の提案保存 gate、`task-design` Step 3、`think_standards` の新しい場面 file）/ 既存 2 file との関係確定 / 併合提案の扱い / `仮決定` と `再開条件` の接続 / 引き渡し元への後始末
- 親phaseのscope外: `提案背景` の定義そのもの / 提案を出せない段階の受け皿 / 実行フェーズの契約 / escalate の起動タイミング
- 親phaseのDoD: 下記「受け入れ基準」へ展開する
- 依存phaseの確定結果: `proposal-background-scope` が完了。`提案背景` は「条件」「条件を導いた finding とその整理」「対応」の三つを持つ。`SKILL.md` の `2.3.1` 手順5 に書かれている。別 file へ分離していないため、この phase は予定どおり判定材料として使えるかを判断してよい

**前 phase から引き継いだ制約。** 前 phase は「前提の確認結果」を `提案背景` から意図的に除外した。理由は「前提の確認はこの phase が判定材料を設計する際に必要としうるため、先に置き場だけを決めると後続の設計余地を狭める」である。この phase が「前提の確認結果」を判定材料に使い、その置き場を `提案背景` にするなら、前 phase の decision を再開する必要がある。

**後続 phase への引き渡し。** `non-proposal-iteration` が「段が置かれた file と位置、および『提案を出せる状態か』の判定基準」を受け取る。段が `think_standards` へ置かれ `facilitate-discussion` の実行手順へ分岐点を持たない形に着地した場合は、後続が分岐条件を自前で設計する必要があるため親 roadmap へ戻る。

---

## TL;DR

提案を出す側が自信を持っているとき、既存の思考標準はどれも発火しない。`choosing_between_options.md` は選べないと感じたときに、`presenting_options.md` の補助は畳めた後の記録判断に効く。**自信を持って畳んだ提案が、実は前提を疑っていない**という場面を覆う記述が無い。

終了時には、その場面で発火する段が一つの owner のもとに置かれ、既存 2 file との境界が決まっている。併合された `task-design` Step 3 の提案も同じ owner 判断の中で処理される。

---

## 完成後の姿

### skillの役割と方針

判断材料が揃っているかを確かめる段は、`think_standards` が正本として所有する。`facilitate-discussion` と `task-design` は自身の手順からそこを参照し、判定内容を複製しない。

`think_standards` へ正本を置く理由は、発火の確実性と適用範囲の両方を満たすためである。`think_standards` は場面を問わず引け、`facilitate-discussion` の手順へ参照を置けば discussion を使う場面では必ず通る。

`think_standards` 側では、既存の `choosing_between_options.md` と `presenting_options.md` を統合した一つの場面 file が所有する。新しい場面 file は立てない。統合の理由は、両 file が最初から同じ根本（判断材料が枯れていない段階で決めようとすること）を扱っており、案を作る場面と選ぶ場面が連続していて読み手が先に判定できないためである。

### workflow

#### `think_standards` の統合

`choosing_between_options.md`（79 行）と `presenting_options.md`（18 行）を `making_and_choosing_options.md` へ統合する。場面名は `案を作る・提示する・選ぶ` とする。

主軸は材料の側を採り、形式（`a/b/c` または `1/2/3`）は補助へ移す。主軸は場面突入時に思い出す一つであり、忘れやすい側を置く。形式は習慣化でき、忘れても読み手から指摘されればすぐ直る。材料が枯れているかの確認は自信があるときほどしない。

```text
# 案を作る・提示する・選ぶ
**主軸: 材料が枯れていないと、案も作れず、選ぶこともできない**
├── 検知: 選べたと感じたとき          ← 新
└── 検知: 選べないと感じたとき        ← 既存 choosing の主軸

## 提案を出す前に確かめる三つ            ← 案を作る前     （新）
## 別の問いへの答えなら、選ぶ必要がない  ← 案を作る前の除外（既存 choosing）
## 足したくなったこと自体が合図          ← 作っている最中 （既存 choosing）
## 両方を満たす方法と、和集合を区別する  ← 作っている最中 （既存 choosing）
## a/b/c または 1/2/3 で答えられる形式    ← 提示する       （既存 presenting 主軸）
## 選ぶときに何を大事にするかを問う      ← 提示する       （新）
## 畳めたことは、議論が不要を意味しない  ← 畳んだ後       （既存 presenting 補助）
## 正しい判断のための問い                ← 締め           （既存 choosing）
```

並び順は場面名の三行為に沿った時系列とする。場面名が目次として機能し、読み手は自分がどの行為をしているかを場面名で判定して、その位置の節から読み始められる。

`## 補助:` prefix は付けない。主軸は file 冒頭に bold で置かれ h2 にはならないため、h2 は必ず補助である。`presenting_options.md` 由来の 1 節からは prefix を外す。

#### 新設する内容

主軸の検知を片側から両側へ広げる。既存は「選べないと感じたとき」だけを合図としていたが、「選べたと感じたとき」も同じ状態を疑う。

補助として次を新設する。

**提案を出す前に確かめる三つ。** 主軸「この提案は、why からこのレイヤまで引いて説明できるか」が抽象で発火しないときに当てる。

- この提案が依拠する前提は確定しているか
- この判断は今決める時期か。材料を集める段階と決める段階を区別しているか
- この案をどこから導いたか。既存成果物からの演繹だけになっていないか

**選ぶときに何を大事にするかを問う。** 選択肢を出す側は、その選択肢を選ぶときに何を大事にするかを問うてよい。判断基準を先に共有すれば評価軸が揃う。

#### `task-design` Step 3 からの参照

section 5 Step 3 の 2 と 3 の間へ参照を置く。

```diff
 2. 選んだ不確実性を、今回の段階のscopeへ含めるか判定する（3-5）。
+   scopeへ含める場合、解消手段を選ぶ前に、判断材料が枯れているかを
+   `think_standards/making_and_choosing_options.md`で確かめる。
 3. 不確実性の解消手段を選ぶ。
```

判断材料が枯れているかは解消手段の選択に効くため、手段選択の直前へ置く。判定表の三手段は互いに排他的に書かれており、`discussion` を選んだ時点で調査は終わったものとして扱われる。

`仮決定` と `再開条件` への接続は作らない。参照先の `正しい判断のための問い` が「何が分かれば選べるようになるか」を持ち、Step 3 の判定表が調査への選び直しを持つため、両者で対処が揃う。

#### `facilitate-discussion` からの参照

手順から `making_and_choosing_options.md` を参照する。判定内容は複製しない。

**参照を置く位置は、新 phase `iteration-structure` が決める。** この phase では六案を検討し、すべて否定された。

```text
不変条件へ置く        → 手順の性質を持つものを不変条件へ置いた
三箇所へ一文          → 分散。案を出すことを 1 行に落とした
SKILL に新設節        → 節番号が実行順序を示すため、論点確定前に読める位置になった
template へ           → template は注入されないため発火しない
番号なし節へ          → 実手順から離れており、不変条件案と同じ構造
三箇所へ直接          → 二番目の再演
```

否定の理由が位置ごとに異なるのではなく、`2.2`（新規論点）と `2.3`（既存論点を進める）という variant 分割がイテレーションという実態を分断していることが原因である。`non-proposal-iteration` phase も同じ手順群（`2.2` と `2.3.1`。`2.3.2` は scope 外）を触るため、構造を先に決める phase を親 roadmap へ追加する。

### documentation

`think_standards/README.md` の収録一覧を更新する。現在の 2 行を 1 行へ置き換える。

```diff
-- **[選択肢を提示する](./presenting_options.md)** — a/b/c または 1/2/3 で答えられる形式
-- **[二つ以上の案から一つを決める](./choosing_between_options.md)** — 選べないのは、材料が枯れていない合図
+- **[案を作る・提示する・選ぶ](./making_and_choosing_options.md)** — 材料が枯れていないと、案も作れず、選ぶこともできない
```

`think_standards/core.md` 44 行が `presenting_options.md` を参照している。`a/b/c` が主軸から補助へ降格するため、link 先と文言の整合を取る。

```text
現行: やってしまいがちな行動: consumer が別の提示形式を指定していても、
      [選択肢を提示する](./presenting_options.md) の `a/b/c` を優先する
```

### documentation以外のfile deliverable

| file | 変わる内容 |
| --- | --- |
| `docs/think_standards/making_and_choosing_options.md` | 新規。統合後の場面 file。主軸・補助 8 節 |
| `docs/think_standards/choosing_between_options.md` | 削除。内容は統合先へ移す |
| `docs/think_standards/presenting_options.md` | 削除。内容は統合先へ移す |
| `docs/think_standards/README.md` | 収録一覧の 2 行を 1 行へ |
| `docs/think_standards/core.md` | 44 行の link 先と文言 |
| `skills/task-design/SKILL.md` | section 5 Step 3 の 2 と 3 の間へ参照 |
| `skills/facilitate-discussion/SKILL.md` | 手順へ参照。**この phase では扱わない**（`iteration-structure` phase が決める） |

利用先 repository の保留 file（`article_workspace` の `pending-plugin-skill-fix.md`）への後始末を行う。記載するのは「正本で扱う旨・正本側 steering directory の basename・提案要旨 1 行」の三つだけである。

### この phase で扱わないと決めたもの

- **`think_standards` 全体の命名見直し。** 場面名の形式が 5 つ混在している（file 名のまま / 名詞 / 動詞句 / 過去形 / 願望形）。答える問いが違うため、独立した phase として親 roadmap へ追加することを提案する。この phase で決めた `案を作る・提示する・選ぶ` と `making_and_choosing_options.md` は、その phase で全体規約に照らして再評価されうる
- **`think_standards` 全体の `## 補助:` prefix の揺れ。** 4 file が prefix あり、5 file がなし、1 file が混在
- **`facilitate-discussion` の workflow 構造の再設計。** 新 phase `iteration-structure` として親 roadmap へ追加することを提案する。`proposal-decidability` の残り（参照位置）と `non-proposal-iteration` がこれに依存する

---

## 要件（Requirements）

### MUST（必達）

- 段の owner が一つに決まり、対象 file へ反映されている
- `choosing_between_options.md` と `presenting_options.md` との関係が決まり、同じ判断基準が二箇所に存在しない
- 併合された `task-design` Step 3 の提案について、Step 3 を直すか別の owner へ寄せるかが決まり、反映されている
- 段が発火する条件と、発火したときに何を確かめるかが具体的に書かれている。原則名だけを置いていない
- 利用先 repository の保留 file へ、引き渡し完了の記載が済んでいる

### SHOULD（できれば）

- 修正で増える記述を最小に留める。`modify_description_policy.md` が定める「指摘された箇所ほど厚くなる力学」を避ける

### MAY（あれば嬉しい）

- この steering 自身で観測された 3 件を、段の具体例として使う

### 非目標

- `提案背景` の定義そのもの。前 phase が確定済み
- 提案を出せない段階の受け皿。phase `non-proposal-iteration` が扱う
- 実行フェーズの契約。`branch-pr-issue-correspondence` と `verification-concreteness` が扱う
- escalate の起動タイミング。`escalation-without-deferral` が扱う

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する
- この phase 完了時点で、触った skill / docs が単独で利用可能である
- 起点となった実例以外の具体 case を二つ以上、確定した段へ当て、発火するかしないかが判定できることを確認する

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 既存 2 file と判断基準が重複する | owner decision で既存との境界を先に決める |
| 三つの候補すべてへ置き、同じ判断が三箇所に分裂する | 「同じ判断を複数の正本が持たない」を親 design から引き継ぐ |
| 段を足しても発火しない。原則名だけが置かれて具体場面で使われない | 主軸が抽象で発火しないときに当てる補助三つを、観測された失敗の形から導く。推測で足さない |
| 統合で file が 8 節へ増え、必要な節を見つけられない | 並び順を場面名の三行為と揃え、場面名を目次として機能させる |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs` を実行する
- この repository は自動 test framework を持たないため、skill 本文の内容は人の review で担保する
- `document-review` skill を md の emit 前ゲートとして適用する

---

## （付録）前提とする既存仕様

- `think_standards/choosing_between_options.md`: 主軸は「選べないのは、材料が枯れていない合図」。二案のどちらも捨てられないと感じた時点を検知の合図とし、和集合を取ることを禁じる。判断の問いは「いま選べないのは、判断材料が足りないからか、それとも問いを二つ混ぜているからか」「何が分かれば選べるようになるか」「この案は一つの軸を持つか、二つの軸を並べたか」
- `think_standards/presenting_options.md`: 主軸は `a/b/c` または `1/2/3` の形式。補助「選択肢に畳めたことは、議論が不要になったことを意味しない」を持ち、判断の問いは「この選択肢が畳めたのは、ユーザーの判断が不要になったからか、それとも自分が先に答えを出したからか」
- `think_standards/ordering_parallel_items.md`: 主軸は「readyな確定事項を先に完了する」。判断の問いは「この事項を今完了するために、未決事項の答えが一つでも必要か」。「やってしまいがちな行動」へ、依存の向きを一方からだけ問う失敗を追記済み
- `facilitate-discussion/SKILL.md` の不変条件: 「ユーザーへ合意を求める前に、その回の問いを初見の読者が単独で評価できるproposal、提案背景、空のfeedback見出しをdiscussion fileへ保存する」「提案を保存する前に、その提案が含むdecisionを数える」
- 同 `2.2` 手順3: 「`提案0`には、その回の問いを判断できる内容を書く」
- 同 任意 field: `仮決定`（議論中に現在成立している内容をまとめる価値がある時だけ使う）と `再開条件`（外部 event、user action、後続 phase 等を待って止まる時だけ使う）
- `task-design/SKILL.md` section 5 Step 3: 「不確実性を一つ選ぶ → 解消手段を選ぶ（discussion / 調査 / 技術検証実装）→ 実行する → design へ反映する」。解消手段はこの三つだけで、「確認」「念のため聞く」「選択肢を出して選んでもらう」は第四の手段ではなくすべて discussion
- 同 section 3-2: TBD で全体を先に見せる思想。初稿段階の作法として書かれている
- `task-design/SKILL.md` Step 4: 「新しい判断基準の検証」として、起点以外の具体 case を二つ以上当てることを求める
- この repository は自動 test framework を持たず、検証は `node scripts/verification/validate-plugin.mjs` だけである

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

なし。

### task-design内の対象成果物反映待ち

なし。

### execution plan対象

なし。対象はすべて skill / docs の修正であり、合意済み内容から一意に反映でき、他の未決事項へ依存せず、一つの連続した反映・validation で完了できる。

### 分類保留（設計中のみ）

なし。`facilitate-discussion/SKILL.md` への参照は、この phase の scope から外して `iteration-structure` phase へ送った。
