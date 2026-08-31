# Design: 退避エンティティ標準の追加と task-design の読み順・差し込み点の整備

## 元の依頼内容

```text
（escalate-plugin-skill-fix により利用先repositoryから引き渡された5件。固有情報は migration.md に従い除去済み）

提案1: entity_modeling を directory 化し、退避エンティティの標準を追加する
  利用先で「あるデータを作り、元データを削除する」型のエンティティを設計した際、既存の
  entity_modeling.md（フィールド追加の判断基準）をそのまま適用して失敗した。既存基準は
  「このフィールドなしで完結した意味を持つか → Yes なら追加しない」という足し算方向（opt-in）であり
  新規エンティティ向けである。退避型へ適用すると、退避のたびに情報が失われる方向へ既定が倒れる。
  実際に、退避先へ引き継がなかった項目が元データの削除とともに失われ、ユーザーの動作確認で発覚した。

  完成後の構成: entity_modeling/{README.md, core.md, evacuation.md}。naming/ と同じ形に揃える。

  evacuation.md が持つ判断基準:
    あるデータを作り、元データを削除する事象をデータ退避と呼ぶ。作られる側が退避エンティティであり、
    history、archive、状態遷移による別テーブルへの移動を含む。
    通常のエンティティ（core.md）は opt-in、退避エンティティは opt-out。
    逆転する理由は回復可能性の非対称性。通常のエンティティで足さなかった項目は「まだ無い」だけで
    後から足せるが、退避エンティティで引き継がなかった項目は元データの削除とともに失われ、
    後から足しても過去に退避した分は戻らない。
    やってしまいがちな失敗: 退避先を「その操作に必要最低限のデータ」で設計する／
    項目が落ちることに気づきUIへ警告を出して済ませる（警告は喪失を正当化しない）。
    function_migration_policy が全rangeを登録し未分類の削除を失敗とするのと同じ構造。
    file名 evacuation.md は暫定採用。

提案2: design.md template の見出し順を読む順へ変え、章番号を廃止する
  TL;DR → 完成後の姿 → 要件 → リスク → テスト方針 →（付録）前提とする既存仕様 →（付録）変更の実行区分。
  一番見たくて合意したいのは完成後の姿であり、要件は認識が違った場合に確認する先。
  現行templateのコメントは既に「完成後の姿が中心」と宣言しながら3番目に置いていた。
  章番号を廃止するのは、番号を残すと参照を毎回追随させることになり次の並べ替えでも同じ作業が
  発生するため。naming/core.md は連番IDでの相互参照を退けている。
  追随5 file。steering/SKILL.md:142 は前月summary生成の抽出元であり文字列一致に依存する機能的な参照。
  既に存在する design.md は書き換えない。

提案3: task-design/SKILL.md の準備段階stepを PrepareStep へ改名する
  PrepareStep 1-3（旧 Step 0 / 0.5 / 0.75）。Step 1-6 は変更しない。
  参照件数の実測（Step 0系4箇所 対 Step 1-6の57箇所）が決定的。
  提案2では章番号を廃止するがここでは残す理由: step は実行順序そのものが契約であり、
  番号は順序という情報を担っている。

提案4: 破壊的actionへの差し込み点を tasklist-design.md へ作る
  Ruby の yield と同じ構造。plugin が枠、利用先が中身。宣言がなければ何も差し込まない。
  問うタイミングは tasklist初稿のreview時。実行時は記録済みの選択に従い問い直さない。
  設計段階で決められる判断を実行時まで持ち越さないため。
  利用先の context instance への宣言追加は今回のscope外。

提案5: DoD の各項目に対応する task があるかを自己レビューgateで検査する
  現行gateの「各phaseにtest作成・変更があるか」は test が存在するかを問う。
  今回抜けたのは DoD の一項目に対応する test が無かったことであり、存在の有無では検出できない。
  実例では DoD 3項目に対して test 2項目が存在し、gate は通過していた。

補足: 前回steeringの design.md「3. 完成後の姿」が naming/ directory化を反映しないまま commit されている。
version: 現在 7.3.2。提案4は MINOR に当たる見込み。
```

---

## 1. TL;DR

利用先での実装を通じて、このpluginの4種類の欠陥が露出した。うち3種類は利用先から引き渡され、
1種類はこの設計の途中で自ら踏んで見つけた。

**標準の欠落**: エンティティ設計の判断基準は新規エンティティ向けの opt-in しか持たず、
「元データを削除して別のエンティティへ移す」型に適用すると情報が失われる方向へ既定が倒れる。
実際に利用先で項目が失われ、ユーザーの動作確認で発覚した。

**読み順と書き順の食い違い**: `design.md` template は「完成後の姿が中心」と宣言しながら3番目に置き、
参照を壊しやすい章番号を持つ。`task-design/SKILL.md` の準備段階は `0.5` `0.75` という
後から差し込んだ形跡のまま残っている。

**利用先固有の運用を差し込む余地の不在**: 作業を破棄しても残るactionの前後に利用先固有の確認を
挟みたくても、plugin側に受け口がない。

**repository運用契約の守備範囲不足**: `README.md` は「skillを変更したらassertionを追加する」としか
書いておらず、既存assertionの追随を覆っていない。この設計中に、追随すべき
`validate-plugin.mjs` を二度落とした。

終了時には、退避エンティティの判断基準が `entity_modeling/` に置かれ、`design.md` template が
読む順に並び、準備段階のstepが連番になり、作業の外へ残るactionへ利用先が宣言を差し込めるようになり、
`README.md` が assertion の追加と追随を分けて指示している。

---

## 前提とする既存仕様

<!-- 確認元: docs/development_standards/ 配下、skills/task-design/、skills/steering/SKILL.md -->

- `docs/development_standards/` は現在 `entity_modeling.md`（単一file）と `naming/`（README + core + file + method）を持つ。
  `naming/` は前回steeringで directory 化された
- `entity_modeling.md` の構成は `# エンティティ設計` / `## §1 エンティティの切り方` / `## §2 エンティティの命名`。
  §1 に「状態が変わるとき、同じエンティティに置くか別エンティティにするか」、
  §2 に「テーブル名は集約の同一性を主張しない」「修飾の向きが『1 行が何か』を決める」がある
- **`naming/README.md` は `../entity_modeling.md` へ相対リンクを持つ**（「エンティティ固有の命名判断は」の箇所）。
  directory 化すると壊れる
- `tasklist-design.md` の「migration phaseの原則」は MUST を2つ持つ。
  単独phaseとして切り出すこと、末尾に停止・確認taskを置くこと
- `tasklist-design.md` の自己レビューgateには「各phaseにtest作成・変更があるか」がある
- `design.md` template の見出しは `## 1. TL;DR` / `## 前提とする既存仕様` / `## 2. 要件` /
  `## 3. 完成後の姿` / `## 4. リスクと対策` / `## 5. テスト方針` / `## （付録）変更の実行区分`
- `docs/documentation_standards/README.md`: 「各標準は基本1ファイル。1つの標準を説明するのに
  複数ファイルが要る場合はディレクトリ化してよい」
- 配布versionは `7.3.2`。宣言値4箇所と `scripts/verification/validate-plugin.mjs` の `expectedRelease` が一致
- `validate-plugin.mjs` は skill と docs の内容を文字列一致で検査する。`task-design` 系のピン留めは実測で
  次のとおり。`templates/design.md` の `## 4. リスクと対策` / `## 5. テスト方針`（require）、
  `## 4. 設計判断`（forbid）、`SKILL.md` の `### Step 0.5.` / `### Step 0.75.`（require）、
  `Step 0 → 0.5 → 0.75 → Step 1` の順序（requireOrderedText）、`### Step 0.25. 設計前調査`（forbid）
- `README.md` の `## 変更時の検証と前提` は「skillを追加・変更したら、対応するassertionをこのfileへ
  追加する」とし、既存assertionの追随には触れていない。同節は assertion 数を「926行」と記すが実測950行

---

## 2. 要件（Requirements）

### MUST（必達）

- 退避エンティティの判断基準が `docs/development_standards/` 配下から辿れ、`core.md` の既定と対比できる。
- `entity_modeling.md` の分割で、既存の判断能力を一つも失わない。
- `design.md` template が読む順に並び、章番号を持たない。
- 準備段階のstepが `PrepareStep` 系の連番になり、`Step 1`〜`Step 6` の番号と参照が変わらない。
- 対象actionの判定が、列挙ではなく判定可能な一つの問いとして `tasklist-design.md` に置かれる。
- 利用先が宣言を返さない場合、対象actionを含むphaseは従来どおり扱われる（差し込みなしで動く）。
- `validate-plugin.mjs` のピン留めが変更後の内容と一致し、`plugin validation passed` を返す。
- `forbidText` がピン留めする文字列が、変更後のformatで出現可能である（禁止が無力化しない）。
- 前月summary生成が、旧形式 `## 1. TL;DR` と新形式 `## TL;DR` の両方から概要を抽出できる。

### SHOULD（できれば）

- 前回steeringの `design.md` の「3. 完成後の姿」が、実装（`naming/` 4 file）と一致する。
- `README.md` から腐った行数の記述が落ちる。

### MAY（あれば嬉しい）

- なし。

### 非目標

- 利用先の context instance への差し込み宣言の追加。利用先で別途行う。
- `SKILL.md` 自身の section 番号（`## 5. 進め方（フロー）` 等）の変更。
- 既に存在する `design.md` を新しい見出し順へ書き換えること。事実誤りの修正はこれに含まない。
- 「否定形の検査は無効化を自己申告しない」のrepository非依存標準への昇格。二例目が出てから判断する。
- `## 自己レビューgate` の群への構造化。
- `tasklist-executor` の変更。既存のcheckpoint / confirmation契約で足りる。

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を返す。
- `entity_modeling.md` への参照が repository 全体でゼロである（`.steering/` を除く）。
- `### Step 0` が `plugins/` と `scripts/` でゼロである。
- `## 1. TL;DR` `## 2. 要件` `## 3. 完成後の姿` `## 4. リスクと対策` `## 5. テスト方針` が
  `templates/design.md` からゼロである。
- `steering/SKILL.md` の summary 抽出が `## TL;DR` と `## 1. TL;DR` の両方を持つ。
- version宣言値4箇所と `expectedRelease` が `7.4.0` で一致する。

---

## 3. 完成後の姿

<!-- 採用予定の outcome section:
     documentation.md → workflow.md → file-deliverables.md → contract-preservation.md
     （catalog の「documentationの新設・本質的更新」「既存skillの本質的更新」
       「既存functionの移動・分割」に対応）
     contract-preservation は README の precedence により最後へ置く。 -->

### documentationによって成立する知識体系

**形式知化する対象:**

- pain: エンティティ設計の判断基準が新規エンティティ向けの opt-in しか持たず、
  「元データを削除して別エンティティへ移す」型に適用すると情報が失われる方向へ既定が倒れる。
  利用先で実際に項目が失われた
- 再利用可能な原則へ引き上げるもの: 退避という状況では既定が逆転すること、その理由（回復可能性の非対称性）、
  全項目を列挙して分類する手順

**読者と成立させる判断:**

| 読者 | 利用場面 | 再調査せず可能になる判断 | 入口 |
| --- | --- | --- | --- |
| 設計を行うagentまたは開発者 | エンティティを新規に切るとき | `core.md` の判断基準を適用してよいか、状況fileへ降りるべきか | `entity_modeling/README.md` |
| 同上 | 元データを削除して別エンティティへ移すとき | 何を引き継ぎ、何を落とすか。落とす判断に理由が要ること | `entity_modeling/evacuation.md` |

**知識構造:**

```text
entity_modeling/
  README.md      群の置き方、判断の問い、既定の優先関係、守備範囲表
  core.md        ライフサイクルを問わず成立する判断（旧 entity_modeling.md の全内容）
  evacuation.md  退避という状況に固有の判断。core.md の既定を逆転させる
```

**分割軸と、`naming/` との構造上の違い:**

| | 分割軸 | `core` と個別fileの関係 |
| --- | --- | --- |
| `naming/` | 対象種別（何に名前を付けるか） | 加算的。`core.md` の内容を打ち消さない |
| `entity_modeling/` | 状況（どう生まれ、どう消えるか） | 上書き的。`core.md` の既定を逆転させることがある |

この違いをREADMEへ明記する。`naming/` の判断の問いをそのまま持ち込むと、読者は `core.md` の opt-in を
適用したまま状況fileを読み足し、矛盾する2つの既定を同時に持つ。今回の失敗はこの経路で起きた。

**規範の根拠と適用境界:**

- MUST: 退避エンティティを設計するとき `core.md` のフィールド追加基準を適用しない。状況fileの既定が優先する
- MUST: 元データの全項目を一度列挙し、引き継ぐ／落とすを分類する。未分類の欠落を失敗とする
- 判断基準: 通常は「このフィールドなしで完結した意味を持つか」、退避では「この項目を引き継がない理由を書けるか」

**完成後のdocument構造:**

- `docs/development_standards/entity_modeling/README.md`: 新規
- `docs/development_standards/entity_modeling/core.md`: 旧 `entity_modeling.md` を内容不変で移動
- `docs/development_standards/entity_modeling/evacuation.md`: 新規
- `docs/development_standards/naming/README.md`: リンクを `../entity_modeling/README.md` へ追随
- `docs/development_standards/entity_modeling.md`: 削除

#### repository運用契約の守備範囲を広げる

**形式知化する対象:**

- pain: `README.md` の `## 変更時の検証と前提` は「skillを追加・変更したら、対応するassertionを
  このfileへ追加する」としか書いておらず、**既存assertionの追随**を覆っていない。
  この設計中に、追随すべき `validate-plugin.mjs` を二度落とした
- 再利用可能な原則へ引き上げるもの: 追加と追随を分けること。`requireText` と `forbidText` で
  失敗の現れ方が違い、注意は自動で検出できない側へ割くこと

**読者と成立させる判断:**

| 読者 | 利用場面 | 再調査せず可能になる判断 | 入口 |
| --- | --- | --- | --- |
| このrepositoryを変更するagent・保守者 | skillまたはdocsの見出し・契約文を変えるとき | `validate-plugin.mjs` の既存ピン留めを追随させる必要があるか | `README.md` |
| 同上 | 変更でformatそのものが変わるとき | `forbidText` が無力化していないかを先に確認する | 同上 |

**規範の根拠と適用境界:**

- 新しいruleを足さず、既存ruleを広げる。不在だと誤認して足すと、同じ対象を指す二つの規定が並ぶ
- `requireText` は追随を怠ると検査が落ちて気づける。`forbidText` は落ちないまま無力化する
- 「否定形の検査は、禁止対象が構造的に出現不能になると失敗せずに無効化する」は
  lint rule、test assertion、type guard にも当てはまりうるが、repository非依存の標準へは昇格させない。
  観測した実例が二つとも同じ `validate-plugin.mjs` に閉じており、一方向の実例だけの抽象化は金属疲労する

**完成後のdocument構造:**

- `README.md` の `## 変更時の検証と前提`: 追加と追随を分けた3つのbulletへ置き換え。
  腐っている行数の記述（「926行」に対し実測950行）を落とす

### workflow

**適用対象の判定:**

`tasklist-design.md` は対象actionを列挙せず、一つの問いで判定する。

> このphaseで起きる変化は、この作業を破棄しても残るか。

残るなら**作業の外へ残るaction**（本文では`対象action`）であり、残らないなら対象外である。
判定を分けているのは変化の性質ではなく変化が及ぶ範囲である。`破壊的` `後方互換性がない` は
この範囲を指さないため判定に使わない。

| action | 作業破棄後に残るか | 判定 |
| --- | --- | --- |
| DB migration の適用 | 残る | 対象 |
| deploy / release | 残る | 対象 |
| 外部serviceの設定変更 | 残る | 対象 |
| 本番データの移行・削除 | 残る | 対象 |
| 公開APIのcode変更（未release） | 残らない | 対象外 |
| 通常のcode変更・test追加 | 残らない | 対象外 |

判定は利用先の運用に依存する。開発DBが開発者ごとに分離されていれば migration の適用も対象外になりうる。
pluginは問いだけを持ち、答えは利用先が出す。

**既存「migration phaseの原則」との関係:**

section見出しを `### 作業の外へ残るactionを含むphaseの原則` へ一般化し、migration を代表例として本文へ残す。
二つのMUST（単独phaseとして切り出す / 末尾に停止・確認taskを置く）の文面は変えず、適用対象だけを広げる。
理由へ「作業破棄で戻せないため、適用の事実を独立に確認する必要がある」を加える。

**ownerと責務:**

| owner | 判断・更新するもの | 行わないこと | single source of truth |
| --- | --- | --- | --- |
| `tasklist-design.md`（plugin） | 対象actionの判定基準、既定の停止・確認task、差し込み宣言を要求すること | 差し込む内容を推測して補完すること | `tasklist-design.md` |
| 利用先の context instance | 差し込む内容と、その背景 | 判定基準を上書きすること | `.agents/skills/tumeda-dev-plugin-context.md` |

**宣言の受け口:**

context instance template の `## task-design` 配下へ `### 作業の外へ残るactionの差し込み` を置く。
既存の `### UI確認環境` `### Git / GitHub公開条件` と同じく、tasklist設計時にだけ使う利用先固有factである。
`maintenance-plugin-context` の `## 選択的読取` 末尾へ、この項目を必要factとして要求できることを1行足す。

**宣言の二形態と、それによる振る舞い:**

| 宣言の形 | review時 | 停止・確認taskへ書くもの |
| --- | --- | --- |
| actionを定める | 問わない | 宣言された内容 |
| 問いを定める | review依頼へ併せて出す | ユーザーの回答 |
| 宣言なし | 問わない | 既定の停止・確認taskのみ |

常に問う設計にすると、利用先が既に決めている判断を毎回ユーザーへ差し戻すことになり、
「実装中に新しい判断が生まれない状態を作る」というtask-designの目的と逆を向く。

**必須順序とhandoff:**

1. tasklist初稿作成（task-design）: 対象actionを含むphase末尾へ既定の停止・確認taskを書く。宣言があれば内容を反映する
2. tasklist初稿のreview依頼（task-design）: 宣言が問いを定めている場合だけ、その問いをreviewへ併せて出す
3. review後（task-design）: ユーザーの選択を停止・確認taskへ書き込む
4. 実行時の停止（tasklist-executor）: 記録済みの選択に従い、問い直さない

設計段階で決められる判断を実行時まで持ち越さない。

**失敗・取消・再開:**

- 宣言が返らない: 既定の停止・確認taskだけを置く。pluginが内容を推測して補完しない
- `maintenance-plugin-context` が `unavailable` を返す: 同上。要求した事実だけを残す

**`tasklist-executor` は変更しない。** executor に migration 固有の分岐は無く、
`runtime-execution-contracts.md` の checkpoint / confirmation 契約に従って
tasklist に書かれた停止taskで止まる。停止・確認taskは通常のtaskとして書かれる。

**silent failure を捕らえるgate:**

`## 自己レビューgate` へ「対象actionを含むphaseで、差し込み宣言を要求したか」を足す。
この契約は「宣言がなければ何もしない」ため、要求を忘れてもtasklistは正常に見える。
宣言が返らなかった場合と要求を忘れた場合が成果物の上で区別できず、成果物の検査では捕まらない。

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `skills/task-design/templates/design.md` | designを書くagent・開発者 | 合意したい順に読み、完成後の姿へ最初に到達できる |
| `skills/task-design/tasklist-design.md` | tasklistを設計するagent | 対象actionを判定し、差し込み宣言を要求し、gateで漏れを検出できる |
| `skills/tumeda-dev-plugin-context.md`（template） | 利用先repositoryの運用者 | 対象action停止時に何を行う／問うかを宣言できる |
| `skills/maintenance-plugin-context/SKILL.md` | context解決を行うagent | 新しい宣言sectionを必要factとして要求してよいと判断できる |
| `scripts/verification/validate-plugin.mjs` | plugin保守者 | 変更後のcontractが維持されているかを機械的に検査できる |

**`templates/design.md` の完成後の構造:**

```text
# Design: {タイトル}
## 元の依頼内容
## 上位roadmap制約（子phaseの場合のみ）
## TL;DR
## 完成後の姿
## 要件（Requirements）
## リスクと対策
## テスト方針
## （付録）前提とする既存仕様
## （付録）変更の実行区分
```

章番号を廃止する。番号は意味を足さず、並べ替えのたびに参照を壊すコストだけを持つ。
`naming/core.md` は連番IDでの相互参照を退けており、現行の参照は既に名前を伴っている。

`元の依頼内容` と `上位roadmap制約` は先頭へ残す。`前提とする既存仕様` が設計者の調査結果であり
必要な時だけ見るものであるのに対し、`元の依頼内容` は加工していない入力であり、
TL;DRと完成後の姿が正しい問いに答えているかを判定する基準になる。役割が違う。

本文コメントは番号参照から名前参照へ書き直し、
「完成後の姿が既存仕様へ言及するときは、付録の『前提とする既存仕様』へリンクする」を加える。
付録へ送ることで読者が本文で未説明の参照に先に出会うため、飛び先が分かる状態を保つ。

**`tasklist-design.md` の完成後の構造:**

- `### migration phaseの原則` を `### 作業の外へ残るactionを含むphaseの原則` へ改称。
  判定の問い、判定例、二つのMUST（文面不変）、migration を代表例として持つ
- `## 自己レビューgate` へ「対象actionを含むphaseで、差し込み宣言を要求したか」を追加

**`tumeda-dev-plugin-context.md`（template）の完成後の構造:**

`## task-design` 配下へ次のH3を追加する。既存の `### UI確認環境` `### Git / GitHub公開条件`
`### Branch / issue 契約` と同列に置く。

```markdown
### 作業の外へ残るactionの差し込み

<!-- 対象actionを含むphaseの停止時に、既定の確認へ加えて行うこと、または問うことを記載する。
     対象action種別、差し込む内容、その背景。宣言がなければ何も差し込まれない -->
```

**`maintenance-plugin-context/SKILL.md` の変更:**

`## 選択的読取` 末尾の「task-designがexecution planを設計する時は…UI確認環境とGit/GitHub公開条件を
必要factとして要求できる」へ、この項目を並べる。`## 選択的読取` の表と `## 返却形式` は変更しない。

**`validate-plugin.mjs` の変更:**

| 行 | 種別 | 変更 |
| --- | --- | --- |
| 338 | require | `## 4. リスクと対策` → `## リスクと対策` |
| 339 | require | `## 5. テスト方針` → `## テスト方針` |
| 345付近 | forbid | `## 4. 設計判断` → `## 設計判断` |

require側は落ちて気づけるが、forbid側は落ちないまま無力化する。番号廃止後は
`## 4. 設計判断` が現れる余地が無くなり、`## 設計判断` を書き戻しても検出されない。

**`task-design/SKILL.md` の完成後の構造:**

準備段階のstepを別系統の連番へ切り出す。

```text
### PrepareStep 1. トリガー判定      （旧 Step 0）
### PrepareStep 2. 配置先確定        （旧 Step 0.5）
### PrepareStep 3. 設計前調査        （旧 Step 0.75）
### Step 1〜Step 6                   変更なし
```

step番号は残す。`design.md` の章番号が編集上の並びしか担っていなかったのに対し、
step番号は実行順序そのものを担う契約である。`naming/core.md` が退けるのは
「中身を示さないIDでの相互参照」であって、順序を表す連番ではない。

`Step 1`〜`Step 6` を触らないのは参照数の非対称による。実測で `plugins/` と `scripts/` 全体の
`Step 1`〜`Step 6` 参照は60 occurrence、`Step 0` 系は9箇所である。準備段階だけを切り出せば本流は動かない。

`validate-plugin.mjs` 側は requireText（353-354）と requireOrderedText（393-396）を PrepareStep へ更新し、
forbidText（400）を `"### Step 0"` へ置き換える。この一句が退役する `Step 0` 系番号をすべて覆う。

**`tasklist-design.md` の `## 自己レビューgate` へ追加する2項目:**

```markdown
- [ ] **DoDの各項目に、それを担保するtaskがあるか**: DoDに書いた観測可能な結果が、
      testまたは確認taskのどれにも対応していない状態になっていないか。
  - DoDから順にたどり、各項目を担保するtaskを指させることを確認する。taskから逆にたどらない。
  - やってしまいがちな失敗: testの一覧を先に作り、DoDと突き合わせずに揃ったとみなす。
    DoDに書いたのにtestが無い項目は、実装者に「書かなくてよい」と読まれる。

- [ ] **対象actionを含むphaseで、差し込み宣言を要求したか**:
      `maintenance-plugin-context` へ要求し、返却の有無に応じて停止・確認taskを書いたか。
  - 宣言が返らなければ既定の停止・確認taskだけを置く。要求自体を省略しない。
  - やってしまいがちな失敗: 宣言が無い前提で進める。この契約は「宣言がなければ何もしない」ため、
    要求を忘れてもtasklistは正常に見え、差し込みが黙って落ちる。
```

前者の核心は**たどる向き**である。task から辿ると、存在する task はすべて何かを担保しているため
必ず整合して見える。欠落は「DoD側に対応先が無い項目がある」という形でしか現れない。
既存の「各phaseにtest作成・変更があるか」は test の存在を問い、これは網羅を問う。置き換えず並べる。

配置は、それぞれ対になる既存項目の直後とする。前者は「各phaseにtest作成・変更があるか」の後、
後者は「完了後actionがrepository contextへ従うか」の後である。

gate は16項目へ伸びるが、見出しで群へ分けない。上から順に全部確認するためのlistであり、
群へ分けると「この群は今回関係ない」と飛ばす余地が生まれる。

**前回steeringの記録の事実誤り修正:**

`.steering/2026/202608/20260829-fix-cause-routing-and-add-entity-standards/design.md` の
「3. 完成後の姿」が、知識構造を旧 `naming.md` の §1/§2/§3 構成として描いている。実装は `naming/` 4 file である。
同じsteering内で後から決めた結論が反映されないまま commit された。知識構造の記述を実装と一致させる。

見出し順と章番号は旧形式のまま触らない。`design.md` は「合意した設計＝いま存在するものの設計」であり、
議論の履歴は discussion file が持つ。実装と食い違う design.md は将来の読者を誤らせる。
非目標にある「既に存在する `design.md` を新しい見出し順へ書き換えること」とは別の作業である。

### 既存contractの保存と明示的な差分

**baseline:** `docs/development_standards/entity_modeling.md` 全51行。

**保存するcontract:** 全51行をそのまま `entity_modeling/core.md` へ移す。見出し、判断の問い、
やってしまいがちな失敗、例のすべてを含む。内容は1バイトも変えない。

**検証手段:** `diff` による同一性確認。full ledger は作らない。内容が再配置されず一対一対応が
機械的に取れる移動では、`diff` の空が全量保存の直接の証明になる。ledger は代表句の存在しか示せない。

**明示的な差分（`ADD`）:**

| 対象 | 内容 | 根拠 |
| --- | --- | --- |
| `entity_modeling/README.md` | 群の置き方、判断の問い、既定の優先関係、守備範囲表 | `core.md` と状況fileで既定が逆転するため、どちらを適用するかの判断を入口に置く必要がある |
| `entity_modeling/evacuation.md` | 退避エンティティの判断基準 | 退避という状況で既定が逆転することを述べた基準が、どこにも無かった |

**依存元の追随:** `naming/README.md` が `../entity_modeling.md` を参照していた。
`../entity_modeling/README.md` へ変更する。directoryの入口を指すのは、エンティティ固有の命名判断が
`core.md` の §2 と状況fileの両方へ分かれる可能性があるためである。

---

## 4. リスクと対策

| リスク | 対策 |
| --- | --- |
| `naming/README.md` の `../entity_modeling.md` リンクが directory 化で壊れる | 依存元として明示的に登録し、移動と同じ単位で更新する（適用済み・旧path参照ゼロを確認） |
| 章番号廃止で `steering/SKILL.md:142` の summary 抽出が動かなくなる | 同じ変更単位で `## TL;DR` へ追随させる。文字列一致に依存する機能的な参照である |
| `entity_modeling.md` の分割で判断能力が落ちる | 内容不変の移動であるため `diff` で全51行の一致を確認する（適用済み・差分ゼロ） |
| `forbidText` が番号廃止・改名で無力化し、検査が落ちないまま何も守らなくなる | require と forbid を同じ単位で追随させ、forbid句を新formatで出現可能な文字列へ置き換える。`## 設計判断` と `### Step 0` |
| summary抽出を置換すると、旧templateで書かれた過去の `design.md` から概要が取れなくなる | 置換ではなく併記にする。errorが出ないsilent degradationであり、validationでも検出できない |
| 見出し順変更で `outcome-sections/README.md` の composition rule が壊れる | 実測したところ番号依存は3行目の「3. 完成後の姿」だけであり、precedenceとtie-breakは名前で書かれている。3行目を追随させる |
| version bump区分を誤る | 利用先が新たに宣言できるものが増えるため MINOR とする。`maintenance-plugin-context` の判定軸（consumerが新たに呼べるものが増えたか）に従う。`7.3.2` → `7.4.0` |

---

## 5. テスト方針

このrepositoryに test framework、lint、formatter、CI設定は存在しない。検査の正本は
`node scripts/verification/validate-plugin.mjs` だけである。

- 各変更の適用直後に validation を実行し、`plugin validation passed` を確認する。まとめて最後に実行しない
- **validation が検出できない範囲を `grep` で補う。**
  - summary抽出の併記: `steering/SKILL.md` が `## TL;DR` と `## 1. TL;DR` の両方を持つこと。
    validation はこの行をピン留めしていない
  - 旧path・旧番号の残存: `entity_modeling.md`、`### Step 0`、番号付き章見出しがゼロであること
  - **forbid の有効性**: 禁止文字列が新formatで出現可能かを確認する。
    validation は forbid の無力化を検出できない（無力化しても検査は通る）
- 移動の同一性は `diff` で確認する。`entity_modeling.md` → `core.md` は適用済みで差分ゼロ

やってしまいがちな失敗: `plugin validation passed` をもって全体の正しさが確認されたとみなす。
validation はピン留めされた文字列の存在・不在・順序しか見ない。ピン留めされていない機能的な参照
（summary抽出）と、無力化した forbid は、通過したまま壊れる。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `docs/development_standards/entity_modeling/` | `entity_modeling.md` を `core.md` へ内容不変で移動し、`README.md` と `evacuation.md` を新設。旧fileを削除 | `diff` で移動前後の全51行一致を確認（差分ゼロ）。`plugin validation passed` | [documentationによって成立する知識体系](#documentationによって成立する知識体系) / [既存contractの保存と明示的な差分](#既存contractの保存と明示的な差分) |
| `docs/development_standards/naming/README.md` | リンクを `../entity_modeling/README.md` へ追随 | 旧pathへの参照が repository 全体でゼロであることを `grep` で確認。link先の実在を確認 | 同上 |
| `skills/task-design/templates/design.md` | 見出しを読む順へ並べ替え、章番号を廃止。`前提とする既存仕様` を付録へ移動。コメントを名前参照へ書き直し、付録への導線を追加（+57 / -34） | `plugin validation passed`。番号付き見出し `^## [0-9]\. ` がゼロ | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| `skills/task-design/SKILL.md` / `outcome-sections/{README,catalog}.md` | 「3. 完成後の姿」→「完成後の姿」 | `plugin validation passed` | 同上 |
| `skills/steering/SKILL.md` | summary抽出を `## TL;DR` と `## 1. TL;DR` の併記へ。置換にしない理由を併記 | 併記の実在を `grep` で確認（validation はこの行をピン留めしていない） | 同上 |
| `skills/task-design/SKILL.md` | `Step 0` / `0.5` / `0.75` を `PrepareStep 1` / `2` / `3` へ改名（見出し3・本文参照3） | `plugin validation passed`。`### Step 0` の残存が forbid句以外でゼロ | 同上 |
| `skills/task-design/tasklist-design.md` | `migration phaseの原則` を `作業の外へ残るactionを含むphaseの原則` へ一般化。判定の問い・判定例・利用先固有の差し込みを追加。自己レビューgateへ2項目（+44 / -6） | `plugin validation passed`。gate項目が14→16 | [workflow](#workflow) / 同上 |
| `skills/tumeda-dev-plugin-context.md` | `## task-design` 配下へ `### 作業の外へ残るactionの差し込み` を新設 | `plugin validation passed` | 同上 |
| `skills/maintenance-plugin-context/SKILL.md` | `## 選択的読取` 末尾へ新項目を追加 | 初回 validation が必須句「UI確認環境とGit/GitHub公開条件」の不一致で**失敗**。契約が実際に変わったと判断し、assertion を新しい3項目へ追随させて `plugin validation passed` | 同上 |
| `scripts/verification/validate-plugin.mjs` | require 4箇所（章見出し2・step 2）、forbid 2箇所（`## 設計判断` / `### Step 0`）、requireOrderedText 1ブロック、context契約2箇所を追随（+24 / -24） | `plugin validation passed` | 同上 |
| `README.md` | `## 変更時の検証と前提` を追加・追随・forbid優先の3 bulletへ。腐っていた行数記述（926 に対し実測950）を削除 | 記述と実装の一致を目視確認 | [repository運用契約の守備範囲を広げる](#repository運用契約の守備範囲を広げる) |
| `.steering/2026/202608/20260829-.../design.md` | 「3. 完成後の姿」の知識構造を実装（`naming/` 4 file）と一致させる（7箇所） | 「完成後の姿」内に旧 `naming.md` 前提の記述が残っていないことを `grep` で確認 | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| version宣言値4箇所 + `expectedRelease` | `7.3.2` → `7.4.0`（MINOR） | 5箇所すべてが `7.4.0`、`7.3.2` の残存ゼロ、`plugin validation passed` | [リスクと対策](#4-リスクと対策) |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし。

すべての変更が skill、template、docs、および それらを検査する補助tool（`validate-plugin.mjs`）の
contentであり、本番application coding に該当しない。合意済み内容から一意に反映でき、
他の未決事項へ依存せず、一つの連続した反映・validation で完了できる。
外部調整、rollback境界、独立した検証単位を必要としない。

file数が多いことは掲載理由にならない。前回steering（`20260829-fix-cause-routing-and-add-entity-standards`）も
同じ判断で planless であり、`naming.md` の4 file分割を task-design 内で完了させている。
