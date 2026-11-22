# 議論記録

## 論点1: 共有リファレンスの置き場の原則

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点1）: 誰が持ち、誰が読むかで置き場を決める

#### 提案0（論点1）

skill の本文から参照される、skill ではない文書と script の置き場を、次の三つの原則で決める。判断の問いは「この中身は誰が持ち（変え）、誰が読むか」である。

| 中身 | 置き場 |
| --- | --- |
| 一つの skill が持つ手順・契約（他の skill が読んでも、変えるのはその skill） | その skill の directory の内部指示。他の skill は相対 path で参照する |
| 複数の skill が対等に持つ手順・契約（どの skill も単独では持ち主にならない） | `skills/` 直下の共有リファレンス |
| skill に依らない、種別横断の判断基準（規範） | `docs/` の群 |

名前は、中身が何の手順・契約・規範かを表す。`runtime-` のように、性質の違う中身をまとめる接頭辞を付けない。一つの file に二つの対象があり、持ち主または読み手が違う時は、file を分ける。

当てはめの見込み（行き先と名前は論点2 で決める。ここでは原則を評価する材料として示す）:

- `task-design-work-handoff-contracts.md`: 持ち主は task-design だけ（steering は routing するだけ）。原則の一行目に当たり、`task-design/` の内部指示になる見込み。
- `runtime-execution-contracts.md` の child 委譲の契約: logical owner は tasklist-executor と書かれており、visual-inspector・test-runner は読む側。一行目に当たる見込み。
- `runtime-execution-contracts.md` の実行時一般の契約（実行環境 gate 等）: command を実行しうる任意の skill が対等に従う。二行目か三行目かを論点2 で決める。
- `runtime-feedback-review.md`: steering と tasklist-executor が対等に持つ手順。二行目に当たる見込み。`facilitate-discussion` を使うが、持ち主ではない。
- `runtime-model-profiles.md`: 推論強度の profile を使う複数の skill が対等に従う対応表。二行目に当たる見込み。

#### 検討記録（論点1・イテレーション0）

##### 起点

利用者の原文:

> あと、runtime-xx系多くない？ なんかfaciliate-disscussionに限定した記述もあるし、skillsにあるべきか悩むところもある

`runtime-` の接頭辞が、性質の違う中身をまとめている。置き場（skills の直下か docs か）を決める基準も書かれていない。

##### 今ある基準を確かめた

- `.agents/skills/tumeda-dev-plugin-context.md` の「アーキテクチャ文書」: skill 本体と docs の責務境界は、skill が実行手順と ownership、docs が種別横断の規範を持つ。
- `plugins/tumeda-dev/skills/README.md` の「共有リファレンス（skill ではない）」: 「直下に置く、skill 本文から参照される host 非依存の共通ドキュメントと script」。どの中身を直下に置き、どの中身を skill の内部に置くかは書かれていない。
- `plugins/tumeda-dev/docs/README.md`: 群は主題単位で、一つの file で足りる主題は新しい群を作らず既存群へ置く。
- 各 skill の directory には、既に内部指示がある（例: `escalate-plugin-skill-fix/pending-escalations.md`、`facilitate-discussion/iteration.md`、`task-design/tasklist-design.md`）。他の skill から相対 path で参照される内部指示もある（例: steering から `../escalate-plugin-skill-fix/pending-escalations.md`）。

##### 原則の軸を比べた

| 軸の候補 | 採らない・採る理由 |
| --- | --- |
| 実行時に使うか、設計時に使うか（今の `runtime-` の接頭辞の考え方） | 採らない。実行時に使うものの中に、持ち主も読み手も違う中身が混ざる。今の問題そのものである |
| 参照する skill の数（一つなら内部、複数なら直下） | 採らない。child 委譲の契約は四つの skill が読むが、変えるのは tasklist-executor だけである。数で決めると、持ち主の分からない共有物が増える |
| 誰が持ち（変え）、誰が読むか（提案0） | 採る。持ち主が一つなら、その skill の中に置けば、変える時に同じ directory で済む。持ち主が複数なら共有、skill に依らないなら docs と、一つの問いで三つに分かれる |

#### 提案0へのフィードバック（論点1）

**結果:** 修正要求（二行目が今の skills に実在するかの問い。他は納得）

> 「複数の skill が対等に持つ手順・契約」について今本当にskillsにある？ それ以外は納得

### イテレーション1（論点1）: 対等に持つ「文書」は今は無い。対等に使う script だけを直下に残す

#### 提案1（論点1）

置き場の原則を次の三つにする。判断の問いは提案0 と同じく「この中身は誰が持ち（変え）、誰が読むか」である。

| 中身 | 置き場 |
| --- | --- |
| 一つの skill が持つ手順・契約・雛形・対応表 | その skill の directory の内部。他の skill は相対 path で参照する |
| skill に依らない、種別横断の判断基準（規範） | `docs/` の群 |
| 複数の skill が対等に使い、どの skill も持ち主にならない script | `skills/` 直下の共有の script |

- 文書（手順・契約）で、複数の skill が対等に持つものは、今は無い。文書がこれに当たりそうな時は、まず持ち主を一つに決められないかを問う。決められない時だけ、新しい置き場を設計で決める。
- 名前は中身を表し、性質の違う中身をまとめる接頭辞（`runtime-` 等）を付けない。一つの file に持ち主または読み手が違う二つの対象があれば、file を分ける。

#### 検討記録（論点1・イテレーション1）

##### 提案0 で「対等」と見込んだものを、持ち主（変える担当）で確かめ直した

| file | 提案0 の見込み | 確かめた事実 | 持ち主 |
| --- | --- | --- | --- |
| `runtime-feedback-review.md` | steering と tasklist-executor が対等 | steering の「実装完了後review」が「共通の実装feedback処理」として参照し、tasklist-executor も読む。中身の戻り先の表は、design phase・tasklist plan phase・roadmap plan の構造・roadmap の進み具合の更新という、steering が orchestrate する lifecycle の分岐である | steering（tasklist-executor は読む側） |
| `runtime-model-profiles.md` | 複数の skill が対等 | 推論強度の profile と host の model の対応、adapter 規則、release 時の確認を持つ。skill を足す・host の model が変わる時に変わる。plugin の配布 version 規約と同じく、plugin の保守の規約である | maintenance-plugin-context（各 skill は読む側） |
| `runtime-execution-contracts.md` の実行環境 gate | 対等（または docs） | command を実行しうる任意の skill が従う判断基準で、特定の skill の手順ではない | skill に依らない規範（docs） |
| `runtime-execution-contracts.md` の Repository context | （提案0 では見ていない） | child 処理に要る repository 固有の値を、maintenance-plugin-context が context instance から解決して返す、確認するまで child 処理を実行しない、という child 委譲の前提 | tasklist-executor（child 委譲の契約の一部） |
| `tumeda-dev-plugin-context.md` | （提案0 では見ていない） | 利用先に置く context の雛形。maintenance-plugin-context が「`SKILL.md` から親の親 directory（plugin の `skills/` root）」にあるものとして読む | maintenance-plugin-context |
| `scripts/github/create_or_get_pr.sh` | （提案0 では見ていない） | tasklist-executor（tasklist の PR 作成 task）と share-work-in-progress が使う。以前は steering と tasklist-executor の中に複製があり、validator がその複製が無いことを検査している。共有へまとめた経緯がある | どの skill も持ち主にならない（対等に使う script） |

文書で、複数の skill が対等に持つものは無かった。どれも、持ち主の skill を一つに決められるか、skill に依らない規範だった。対等に使うものとして残るのは、PR を作る script だけである。

##### 二行目を消さず、script に限る理由

PR を作る script は、二つの skill が同じものを使い、どちらかの中に置くと、もう一方の skill がその skill の内部を参照することになる。以前は複製で持ち、複製をやめて共有にまとめた。この経緯から、script の共有の置き場は要る。

#### 提案1へのフィードバック（論点1）

**結果:** 修正要求（問いの読み違い）

> あ、いやそういう意味じゃない。横断するものはdocsに入ってないか？

提案0 へのフィードバック（「今本当にskillsにある？」）は、「複数の skill が対等に持つものの実例があるか」ではなく、「複数の skill を横断するものは、skills ではなく docs に入るのではないか」という問いだった。assistant は前者と読み、実例の有無を調べ直した。持ち主の確かめ直し（イテレーション1 の検討記録の表）は、事実としては残る。

### イテレーション2（論点1）: 横断するものは docs に置き、skills の直下に共有の文書を置かない

#### 提案2（論点1）

置き場の原則を二つにする。

| 中身 | 置き場 |
| --- | --- |
| 一つの skill が持つ手順・契約・雛形・対応表（他の skill が読んでも、変えるのはその skill） | その skill の directory の内部。他の skill は相対 path で参照する |
| 複数の skill を横断するもの（どの skill も単独では持ち主にならない規範・契約・手順） | `docs/` の群 |

- `skills/` の直下には、skill の directory と、skills の索引（README）だけを置く。共有の文書は置かない。
- 判断の問いは「この中身を変える担当は、一つの skill か」である。一つなら、その skill の中に置く。一つに決まらなければ、横断するものとして docs に置く。
- 名前は中身を表し、性質の違う中身をまとめる接頭辞（`runtime-` 等）を付けない。一つの file に持ち主または読み手が違う二つの対象があれば、file を分ける。
- script（`scripts/github/create_or_get_pr.sh`）は文書ではないため、この原則の外で、論点2 で行き先を決める。

#### 検討記録（論点1・イテレーション2）

##### 今ある基準と合うかを確かめた

`.agents/skills/tumeda-dev-plugin-context.md` の「アーキテクチャ文書」は、skill 本体と docs の責務境界を「skill は実行手順と ownership、docs は種別横断の規範」とする。横断するものを docs に置く原則は、この境界と同じ向きである。`skills/` の直下に共有の文書を置く今の形は、この境界から外れていた。

##### 提案1 から変えたところ

提案1 は、複数の skill が対等に使うものの置き場として `skills/` の直下を残した（script に限る形で）。利用者の問いのとおり、横断するものは docs が受け持つ。文書については、置き場は「持ち主の skill の中」か「docs」の二つで足りる。

#### 提案2へのフィードバック（論点1）

**結果:** 合意

> ok

### 決定（論点1）

文書の置き場を、「これを変える担当は、一つの skill か」で決める。

- 一つの skill が持つ手順・契約・雛形・対応表（他の skill が読んでも、変えるのはその skill）は、その skill の directory の内部に置く。他の skill は相対 path で参照する。
- 複数の skill を横断するもの（どの skill も単独では持ち主にならない規範・契約・手順）は、`docs/` の群に置く。
- `skills/` の直下には、skill の directory と skills の索引（README）だけを置き、共有の文書は置かない。
- 名前は中身を表し、性質の違う中身をまとめる接頭辞を付けない。一つの file に持ち主または読み手が違う二つの対象があれば、file を分ける。
- script は文書ではないため、この原則の外で、行き先を個別に決める。

## 論点2: 各 file の行き先

**ステータス:** 分解済み

**種別:** TBDヒアリング

### イテレーション0（論点2）: 論点1 の原則と、持ち主の事実を当てる

#### 提案0（論点2）

各 file（と、file の中の対象）の行き先を次のとおりにする。名前は論点3 で決める。

| 今の場所 | 行き先 | 根拠 |
| --- | --- | --- |
| `skills/runtime-execution-contracts.md` のうち、child 委譲の契約（状態の正本と single writer、停止理由、Child request、Child result、停止・再開と二重起動防止、Logical owner と physical launcher、Repository context） | `skills/tasklist-executor/` の内部 | 本文に「logical ownerはtasklist-executorである」とある。steering（停止理由を読む）、visual-inspector・test-runner（request・result を読む）は読む側 |
| 同じ file のうち、実行環境 gate | `docs/common_standard/` | 本文に「command を実行しうる任意の skill（tasklist-executor、steering の Blocker resolution、task-design の技術検証実装等）」が従うとある。持ち主の skill が一つに決まらない、skill を横断する規範である。`common_standard/` は、skill の作業を横断する共通規範（`function_migration_policy.md`）の群である |
| `skills/runtime-feedback-review.md` | `skills/steering/` の内部 | 中身の戻り先の表は、steering が orchestrate する lifecycle の分岐である。steering の「実装完了後review」が参照し、tasklist-executor は読む側。`facilitate-discussion` は、decision の適用先・適用方法・後続 workflow を consumer の所有と定めており、持ち主にならない |
| `skills/runtime-model-profiles.md` | `docs/common_standard/` | child を起動する複数の skill（visual-inspector、test-runner、tasklist-executor、exhaustive-review）が、model の宣言で従う規範である。持ち主の skill が一つに決まらない |
| `skills/task-design-work-handoff-contracts.md` | `skills/task-design/` の内部 | 本文に「consumerは`task-design`であり、`steering`は同じworking directoryへのroutingだけを担う」とある |
| `skills/tumeda-dev-plugin-context.md` | 動かさない（原則の例外） | `.agents/skills` が `plugins/tumeda-dev/skills` への symlink であり、この file は plugin repository 自身の context instance（`<git-root>/.agents/skills/tumeda-dev-plugin-context.md`）を兼ねる。maintenance-plugin-context は、雛形を「`SKILL.md` から親の親 directory（plugin の `skills/` root）」から読む。動かすと、plugin repository 自身の context の解決と、雛形の読み取りの両方が壊れる。例外である理由を skills の README に書く |
| `skills/scripts/github/create_or_get_pr.sh` | `plugins/tumeda-dev/scripts/github/` | 文書ではない。tasklist-executor と share-work-in-progress が対等に使い、どちらも持ち主にならない（以前は複製を持ち、共有へまとめた）。`skills/` の外、plugin の直下に置けば、`skills/` の直下を skill と索引だけにでき、plugin と一緒に配布される |

#### 検討記録（論点2・イテレーション0）

##### 提案1（論点1）の持ち主の見込みから変えたところ

`runtime-model-profiles.md` は、論点1 のイテレーション1 で「持ち主は maintenance-plugin-context」と見込んだ。maintenance-plugin-context の役割は、repository context、作業限定の暫定指示、配布 version 規約の管理であり、skill が model をどう宣言するかは持っていない。model の宣言は child を起動する各 skill が行い、規則は全員に同じく効く。持ち主の skill が一つに決まらないため、docs に置く。

##### 雛形が動かせない事実を確かめた

`.agents/skills` は `../plugins/tumeda-dev/skills` への symlink である（`ls -ld .agents/skills`）。`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の中身は、この repository の値（PR 作成 script の path、branch の契約等）を持っており、配布する雛形と、この repository の instance を兼ねている。

##### script の置き場

plugin repository の `.agents/skills/tumeda-dev-plugin-context.md` は、PR 作成 script を `scripts/for_local/github/create_or_get_pr.sh`（plugin 内の path を指す symlink、`.gitignore` の対象）として宣言している。script を動かす時は、この symlink の張り替えと、context の記載の書き換えが要る。

#### 提案0へのフィードバック（論点2）

**結果:** 一部合意。`docs/common_standard/` に置く二行（実行環境 gate、model の対応表）は、`common_standard/` の範囲を決めてから吟味し直す

> common_standardに置くかどうかは、最大公約数が太るから、吟味必要だし、このディレクトリ自体としても何を置いて何をおいてはいけないかを決めなきゃだけど、それ以外は特に問題ない

### 決定（論点2）

各 file（と、file の中の対象）の行き先を次のとおりにする。skill の内部へ置く file の名前は論点7 で決める。

- `runtime-execution-contracts.md` のうち、child 委譲の契約（状態の正本と single writer、停止理由、Child request、Child result、停止・再開と二重起動防止、Logical owner と physical launcher、Repository context）: `skills/tasklist-executor/` の内部。「停止理由」の `blocked` に、実行環境に止められた場合を含むことを書き、実行環境 gate の規範の本体の file を参照する（論点4）。
- 同じ file のうち、実行環境 gate の規範の本体: 新しい群 `docs/agent_execution_standards/` の `blocked_commands.md`（論点4）。
- `runtime-feedback-review.md`: `skills/steering/` の内部。
- `runtime-model-profiles.md`: `plugins/tumeda-dev/model-profiles.md`（論点6）。
- `task-design-work-handoff-contracts.md`: `skills/task-design/` の内部。
- `tumeda-dev-plugin-context.md`: 動かさない（原則の例外。`.agents/skills` が `plugins/tumeda-dev/skills` への symlink で、この file は plugin repository 自身の context を兼ねる。理由を skills の README に書く）。
- `scripts/github/create_or_get_pr.sh`: `plugins/tumeda-dev/scripts/github/`。

`docs/common_standard/` の範囲は論点3 で決めた。

論点番号の予定の訂正: 論点2〜4 の検討の中で、model の対応表を「論点5」、名前を「論点6」で決めると予定した。その後、論点4 への応答で置き場の誤りの再発防止を依頼され、それを論点5 として先に採番した。model の対応表は論点6 で決め、skill の内部へ置く file の名前は論点7 で決める。

## 論点3: `docs/common_standard/` に置くもの・置かないもの

**ステータス:** 決定

**親論点:** 論点2

**種別:** レビュー指摘

### イテレーション0（論点3）: 既存の群のどれにも収まらず、複数の群の作業に同じく効く規範だけを置く

#### 提案0（論点3）

`docs/common_standard/` の範囲を次のとおりにし、`plugins/tumeda-dev/docs/README.md` の群の一覧に書く。

- 置くもの: 他の群（`development_standards/`、`documentation_standards/`、`think_standards/`）のどれか一つに収まらず、それら複数の群の作業（開発、文書、思考）に同じ形で効く規範。
- 置かないもの:
  - どれか一つの群に収まる規範。その群へ置く。
  - 特定の skill や工程にだけ効く手順・契約。その skill の中へ置く（論点1 の決定）。
  - 「複数の skill が使う」ことだけを理由にした規範。使う場面が一つの群に収まるならその群へ、どの群にも収まらないなら、その主題の群を作るかを決める。
- 判断の問い: 「この規範は、既存の群のどれか一つに収まるか。収まらないなら、開発・文書・思考のどの作業にも同じ形で効くか」

今ある `function_migration_policy.md` は、code・skill・prompt・template・script・document のどれを移す時にも同じく効き（同 file の「1. 目的」）、開発・文書のどちらの群にも収まらない。この範囲に入る。

#### 検討記録（論点3・イテレーション0）

##### 起点

利用者の原文（論点2 の提案0 への応答）:

> common_standardに置くかどうかは、最大公約数が太るから、吟味必要だし、このディレクトリ自体としても何を置いて何をおいてはいけないかを決めなきゃだけど、それ以外は特に問題ない

assistant は論点2 で、「持ち主の skill が一つに決まらない」ことを理由に、二つを `common_standard/` に置くとした。この理由は「複数の skill が使う」とほぼ同じで、`common_standard/` の範囲を見ていない。この理由で置き場を決め続けると、横断するものがすべて `common_standard/` に集まり、群の名前が何も約束しなくなる。

##### 今の `common_standard/` を確かめた

- 収録は `function_migration_policy.md` の一つだけ。README は無い。
- `plugins/tumeda-dev/docs/README.md` は「機能・仕様の移行（file分割、owner変更、skill間・plugin間移植等）で意味を全量保存するための共通規範」とだけ書き、群の範囲は書いていない。
- 参照元: maintenance-plugin-context（SKILL.md と `maintenance_policies/migration.md`）、`development_standards/entity_modeling/evacuation.md`、plugin の context の雛形、validator。

##### 範囲の決め方を比べた

| 候補 | 採らない・採る理由 |
| --- | --- |
| skill を横断するものを置く | 採らない。論点1 の決定で、skill を横断するものはすべて docs に置く。その全部が `common_standard/` に入り、利用者の懸念どおり太る |
| 範囲を書かず、置く時に都度判断する | 採らない。今回の論点2 がそれで、「横断する」だけで置き場が決まった |
| 他の群に収まらず、複数の群の作業に同じく効く規範だけ（提案0） | 採る。他の群が先に受け取り、残ったものだけが入る。`function_migration_policy.md` は入る |

#### 提案0へのフィードバック（論点3）

**結果:** 合意

> ok

### 決定（論点3）

`docs/common_standard/` の範囲を次のとおりにし、`plugins/tumeda-dev/docs/README.md` の群の一覧に書く。

- 置くもの: 他の群（`development_standards/`、`documentation_standards/`、`think_standards/`）のどれか一つに収まらず、それら複数の群の作業（開発、文書、思考）に同じ形で効く規範。
- 置かないもの:
  - どれか一つの群に収まる規範。その群へ置く。
  - 特定の skill や工程にだけ効く手順・契約。その skill の中へ置く（論点1 の決定）。
  - 「複数の skill が使う」ことだけを理由にした規範。使う場面が一つの群に収まるならその群へ、どの群にも収まらないなら、その主題の群を作るかを決める。
- 判断の問い: 「この規範は、既存の群のどれか一つに収まるか。収まらないなら、開発・文書・思考のどの作業にも同じ形で効くか」

今ある `function_migration_policy.md` は、code・skill・prompt・template・script・document のどれを移す時にも同じく効き、開発・文書のどちらの群にも収まらないため、この範囲に入る。

## 論点4: 実行環境 gate の行き先

**ステータス:** 決定

**親論点:** 論点2

**種別:** TBDヒアリング

### イテレーション0（論点4）: 開発の進め方の規範として `development_flow/` に置き、`blocked` との対応は child 委譲の契約に残す

#### 提案0（論点4）

`runtime-execution-contracts.md` の「実行環境gate」を、次の二つに分けて置く。

| 中身 | 行き先 |
| --- | --- |
| 規範の本体: task level で実行してよいと判定したことは、実行環境がその command を通すことを意味しない（別の層である）。実行環境に止められたら、迂回せず停止して利用者へ返し、別の command で同じ結果を得ようとしない。特定の実行基盤に依存する手順はこの規範に書かず、利用先で要る具体手順は repository 固有の context に持たせる | `docs/development_standards/development_flow/` の新しい file（名前は論点6 で決める） |
| 「実行環境に止められたことは、停止理由の `blocked`（権限の不足）に当たる」という対応 | `skills/tasklist-executor/` へ移す child 委譲の契約の「停止理由」。`blocked` の説明に、実行環境に止められた場合を含むことを書き、規範の本体の file を参照する |

あわせて、`docs/development_standards/README.md` の `development_flow/` の一覧に一行足し、「維持規律」の file 数と分量の記載を更新する。steering の 6-1 が「実行環境gate」を参照している箇所は、規範の本体の file へ向け直す。

#### 検討記録（論点4・イテレーション0）

##### 論点3 の判断の問いを当てた

「既存の群のどれか一つに収まるか」:

- `docs/development_standards/README.md` の「この群の置き方」は、「開発そのもの（何を作るか、どう名付けるか、どう進めるか）」をこの群に置くとする。gate は、command を実行して作業を進める時に、実行環境に止められたらどう進めるかの規範であり、「どう進めるか」に当たる。
- `development_flow/` は「開発の進め方の判断基準」で、既に `work_scope.md`（作業中に出た判断や不備を今の作業で扱うか）を持つ。gate も、作業の途中で起きる事象への進め方の規範で、同じ並びに入る。
- `think_standards/handling_errors.md`（エラーは消す前に原因を特定する）とは対象が違う。handling_errors は、エラーを消すために既存の実装を無効化しないという思考の作法で、gate は、実行環境の制止という権限の境界を越えないという行動の規範である。
- 一つの群に収まるため、論点3 の範囲により `common_standard/` には置かない。

##### 二つに分ける理由

今の gate は「この事象は、上記「停止理由」の`blocked`に該当する」と書き、同じ file の child 委譲の契約の停止理由を参照している。停止理由は tasklist-executor が返す値で、tasklist-executor の契約である（論点2 の仮決定で、child 委譲の契約は `skills/tasklist-executor/` へ移す）。docs の規範が特定の skill の停止理由の値を持つと、論点1 の「一つの file に持ち主の違う二つの対象があれば分ける」に反する。対応は持ち主の側（停止理由）に置き、規範の本体は skill に依らない形で docs に置く。

##### 採らなかった案

| 案 | 採らない理由 |
| --- | --- |
| tasklist-executor の中に残す | 今の file の冒頭が、command を実行しうるのは tasklist-executor だけでなく、steering の Blocker resolution、task-design の技術検証実装等も従うと書いている。持ち主の skill が一つに決まらない（論点1） |
| `common_standard/` | 開発の進め方という一つの群に収まる（論点3） |
| `think_standards/` | 思考・議論のプロセスの作法の群で、権限の境界を越えない行動の規範は入らない |
| 規範の本体と `blocked` の対応を一緒に docs へ置く | docs が tasklist-executor の停止理由の値を持つことになる |

##### 置いた後の読まれ方

task-design は、設計前に `development_standards/` の配下をすべて読む（同 README の「この群の引き方」）。gate は今は 9 行で、読む量は大きく増えない。設計の時点でも、task-design の「確認の担当と手段」（実行許可の画面を利用者が確かめる手段にしない）と同じ前提を、設計者が知った上で tasklist を作れる。

#### 提案0へのフィードバック（論点4）

**結果:** 一部合意。`blocked` との対応を child 委譲の契約の「停止理由」に残すことは合意。規範の本体の置き場は、file 名と一緒でなければ決まらない

> [「実行環境に止められたことは、停止理由の `blocked`（権限の不足）に当たる」という対応]は合意。[規範の本体: task level で実行してよいと判定したことは、実行環境がその command を通すことを意味しない（別の層である）。実行環境に止められたら、迂回せず停止して利用者へ返し、別の command で同じ結果を得ようとしない。特定の実行基盤に依存する手順はこの規範に書かず、利用先で要る具体手順は repository 固有の context に持たせる]はファイル名による。ディレクトリだけが自明で決まるものでもない

### イテレーション1（論点4）: 規範の本体を、置き場と file 名の組で決める

#### 提案1（論点4）

規範の本体を `docs/development_standards/development_flow/command_permission.md` に置く。

- `development_flow/command_permission` は「開発の進め方のうち、command の実行の許可」と読める。
- 入口の説明（`development_standards/README.md` の一覧の一行）: 「command の実行の許可。agent が実行してよいと判定することと、実行環境が command を通すことは別の層である。実行環境に止められたら、迂回せず停止して利用者へ返す。」
- 中身は今の「実行環境gate」の本文のうち、`blocked` との対応を除いた全部（二つの層、止められた時の停止と利用者への返却、別の command で同じ結果を得ない、特定の実行基盤に依存する手順を書かず利用先の context に持たせる）。
- 同じ README の「維持規律」の file 数と分量の記載を更新する。steering の 6-1 の参照先を、この file へ向け直す。

`blocked` との対応は、イテレーション0 で合意したとおり、child 委譲の契約の「停止理由」に残し、この file を参照する。

#### 検討記録（論点4・イテレーション1）

##### フィードバックの原因

提案0 は、置き場（directory）を論点4、名前を論点6 に分けた。directory は中身の性質だけで決まり、名前はその後で付けられると見ていた。

`docs/development_standards/naming/core.md` の「名前を単独で評価しない」は、名前を `親/自分` の形で読むとし、「中身を足す前に、名前が約束する範囲に入るかを確かめる」は、directory の名前と入口の説明が中身の範囲を約束するとする。directory に入るかは、置く file が何を約束する file かと照合して決まり、file が何を約束するかは file 名が表す。置き場と file 名は互いに依存しており、別の問いではなかった。この知識は既存の標準にあり、assistant が当てていなかった（原因は今回の成果物に固有）。

skill の内部へ置く行（論点2 の仮決定）は、directory を持ち主の skill が決め（論点1）、directory の名前が中身の範囲を約束する形ではないため、名前を論点6 で決める分け方のままにする。docs の群のように、directory の名前が規範の範囲を約束する置き場（この論点と論点5 の候補）は、置き場と file 名を一つの問いとして決める。

##### file 名の候補を `親/自分` で読んだ

同じ directory の file: `branch_pr_issue.md`（branch・PR・issue の対応）、`work_scope.md`（作業の範囲）、`version_upgrade.md`（version の上げ方）。どれも、開発の進め方の一つの主題を名詞で表す。

| 候補 | `development_flow/` に置いて読んだ時 | 判断 |
| --- | --- | --- |
| `command_permission.md` | 開発の進め方のうち、command の実行の許可 | 採る。中身（誰が command を通すかの二つの層と、止められた時の扱い）を表し、同じ directory の file と同じ主題の粒度である |
| `execution_environment_gate.md` | 開発の進め方のうち、実行環境の gate | 採らない。「gate」は今の file の見出しの語で、普段の言葉では何を通す門かが読めない |
| `blocked_command.md` | 開発の進め方のうち、止められた command | 採らない。tasklist-executor の停止理由 `blocked`（必須入力・外部状態・権限の不足）と、同じ読み手が同じ場面（停止の判断）で出会い、意味が違う（こちらはその一部） |

##### 置き場を file 名と照合した

- `development_flow/` の入口の説明は「開発の進め方の判断基準」。command の実行の許可は、作業を進める中で command を実行する時の判断基準で、この範囲に入る。
- 既存の file へ足す案: `work_scope.md` は「作業中に出た判断や不備を今の作業で扱うか」を約束し、command の許可は入らない。`branch_pr_issue.md`、`version_upgrade.md` も入らない。新しい file にする。
- 新しい群（AI agent の実行の規範等）を作る案: `docs/README.md` の「一つのfileで足りる主題は、新しい群を作らず既存群へ置く」に当たり、`development_flow/` に収まるため作らない。

#### 提案1へのフィードバック（論点4）

**結果:** 修正要求（置き場の性質が中身と合わない）

> 迷うな。それで良い気もするけど、汎用的な開発フローに対しての標準に見えて、AIに指示したときの、AI特有の詰まり方に対しての対応案だからな

### イテレーション2（論点4）: AI agent が場面ごとにやってしまう失敗への作法として、`think_standards/` の場面に置く

#### 提案2（論点4）

規範の本体を、`docs/think_standards/` の新しい場面「実行環境に command を止められたとき」として、`docs/think_standards/handling_blocked_commands.md` に置く。

- `think_standards/handling_blocked_commands` は「思考の作法のうち、止められた command への対処」と読める。同じ群の `handling_errors.md`（エラーが出たとき）と同じ形である。
- `think_standards/README.md` の収録一覧に一行足す: 「**[実行環境に command を止められたとき](./handling_blocked_commands.md)** — 迂回せず止まり、利用者へ返す」
- file は群の形（`evolution_policy.md`: 場面名を見出しにし、主軸を一つ立てる）に合わせる。主軸は「迂回せず止まり、利用者へ返す」。今の本文（task level の許可と実行環境の許可は別の層、別の command で同じ結果を得ない、特定の実行基盤に依存する手順を書かず利用先の context に持たせる）は、規則を変えずに主軸の本体として移す。
- steering の 6-1 の参照先を、この file へ向け直す。`blocked` との対応は、合意どおり child 委譲の契約の「停止理由」に残し、この file を参照する。

#### 検討記録（論点4・イテレーション2）

##### フィードバックの原因

提案1 は、gate を「command を実行して作業を進める時に、止められたらどう進めるか」と言い直し、`development_flow/`（開発の進め方の判断基準）の範囲に入るとした。元の本文は「agentがcommandを実行してよいとtask levelで判定したこと」と「実行環境」の関係を扱い、AI agent が実行環境（許可の仕組み・sandbox・分類器）に止められた時に、別の command で回り込もうとする失敗を防ぐ規範である。人も AI も読む開発の進め方としてではなく、AI agent に特有の詰まり方への対処として読むのが元の中身である。

`naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」は、照合の前に中身を足す先に合わせて一般的な言葉で言い直す失敗を挙げている。提案1 はこの失敗をしていた。知識は既存の標準にあり、assistant が当てていなかった（原因は今回の成果物に固有）。

##### `think_standards/` を確かめた

- `think-through` は、AI agent の議論・思考の作法を矯正する skill で、`think_standards/` はその本体である（`docs/README.md`、`think_standards/README.md`）。
- 群は「場面駆動 + 主軸/補助」で、場面は行為または出来事の「〜とき」で表す（`evolution_policy.md`）。各場面は、AI agent がその場面でやってしまいがちな失敗を起点にしている。
- `handling_errors.md`（エラーが出たとき）の主軸は「エラーは消す前に原因を特定する」で、エラーを消すために既存の実装を無効化する失敗を防ぐ。gate は、実行環境に止められた時に、別の command で回り込む失敗を防ぐ。どちらも、作業が阻まれた時に AI agent が阻んでいるものを回避しようとする失敗への作法で、同じ群に並ぶ。
- 提案0 で `think_standards/` を「思考の作法の群で、行動の規範は入らない」として採らなかった。`handling_errors.md` も「既存実装を無効化する変更は、合意を得てから行う」という行動の規範を持っており、この理由は成り立たない。

##### file 名を `親/自分` で読んだ

同じ群の file は、場面を動名詞句で表す（`handling_errors`、`receiving_feedback`、`starting_to_think`、`questioning_existing` 等）。

| 候補 | 読み | 判断 |
| --- | --- | --- |
| `handling_blocked_commands.md` | 思考の作法のうち、止められた command への対処 | 採る。`handling_errors` と同じ形で、出来事の場面を表す |
| `respecting_execution_environment.md` | 実行環境を尊重すること | 採らない。場面（いつ引くか）ではなく態度を表し、場面から引けない |

提案1 で `blocked_command.md` を、tasklist-executor の停止理由 `blocked` と意味が違うとして採らなかった。確かめ直すと、実行環境に止められた command は、executor が `blocked`（権限の不足）で止まる原因の一つであり（イテレーション0 で合意した対応）、「阻まれて進めない」という同じ意味で使っている。同じ意味なら同じ語を使う（`naming/core.md` の「表現が同じでも、名前空間が違えば別の意味を持つ」）。

##### 採らなかった案

| 案 | 採らない理由 |
| --- | --- |
| `development_flow/command_permission.md`（提案1） | 人も AI も読む開発の進め方の群で、AI agent に特有の詰まり方への対処という中身と合わない |
| AI agent に特有の規範の群を新しく作る | 作業が阻まれた時の AI agent の失敗への作法は、既に `think_standards/` に `handling_errors.md` がある。新しい群に置くと、同じ種類の作法が二つの群に分かれる。また今は一つの file で足り、`docs/README.md` の「一つのfileで足りる主題は、新しい群を作らず既存群へ置く」に当たる |
| `common_standard/` | 一つの群に収まる（論点3） |

##### 置いた後の読まれ方

- `think-through` は、場面を判定してその場面の file を読む。AI agent が実行環境に止められた場面で、この file に届く。
- tasklist-executor は fork で動くため、main session の `think-through` の注入が届くとは限らない。child 委譲の契約の「停止理由」の `blocked` からこの file を参照するため（イテレーション0 で合意）、executor もこの file に届く。steering は 6-1 から参照する。

#### 提案2へのフィードバック（論点4）

**結果:** 修正要求（`think_standards/` は範囲が違う）

> thinkはもっと違うだろ。これで入れて良いってなったらthink側のREADMEを直したいくらい

### イテレーション3（論点4）: 既存の群に収まらないため、AI agent に特有の詰まり方を扱う群を新しく作る

#### 提案3（論点4）

`docs/` に新しい群 `agent_execution_standards/` を作り、規範の本体を `docs/agent_execution_standards/blocked_commands.md` に置く。

- 群の範囲: AI agent に作業を実行させる時に、AI agent と、それを動かす実行環境（host の実行許可の仕組み、sandbox、分類器等）の性質から起きる、AI agent に特有の詰まり方への対処。人も AI も従う開発・文書・思考の規範は、それぞれの群に置く。
- `docs/README.md` の群の一覧に一行足す: 「**[agent_execution_standards/blocked_commands.md](./agent_execution_standards/blocked_commands.md)** — AI agent に作業を実行させる時に、AI agent と実行環境の性質から起きる、AI agent に特有の詰まり方への対処」。収録が一つの間は README を作らず、同 README の「READMEを持たない群は、収録fileが1つならそのfileを…指す」に従って file を指す。見出し「5群への入口」の数も直す。
- `agent_execution_standards/blocked_commands` は「AI agent の実行の標準のうち、止められた command」と読める。
- 中身は今の「実行環境gate」の本文のうち、`blocked` との対応を除いた全部を、規則を変えずに移す。
- steering の 6-1 の参照先をこの file へ向け直す。`blocked` との対応は、合意どおり child 委譲の契約の「停止理由」に残し、この file を参照する。

#### 検討記録（論点4・イテレーション3）

##### フィードバックの原因

提案2 は、`think_standards/` の範囲を「AI agent が場面ごとにやってしまいがちな失敗を正す作法」と言い直し、gate が入るとした。`think_standards/README.md` の入口の説明は「議論・思考プロセスの作法」で、対象は「思考・議論プロセスが絡む全場面」である。assistant は、既に入っている `handling_errors.md` の一面（阻まれた時の行動の規範）を根拠に、入口の説明より広い範囲を読み取った。

提案1 は中身を足す先に合わせて言い直し、提案2 は足す先の範囲を中身に合わせて言い直した。どちらも、`naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」が挙げる失敗（照合の前に言い直す）である。知識は既存の標準にあり、assistant が当てていなかった（原因は今回の成果物に固有）。

##### 既存の群を、言い直さずに照合した

| 群 | 入口の説明 | gate（AI agent が実行環境に止められた時に、別の command で回り込まない）は入るか |
| --- | --- | --- |
| `development_standards/` | 開発そのもの（何を作るか、どう名付けるか、どう進めるか） | 入らない。人も AI も従う開発の規範で、AI agent と実行環境の関係は扱わない |
| `documentation_standards/` | docs の書き方・構造化 | 入らない |
| `think_standards/` | 議論・思考プロセスの作法 | 入らない。議論・思考のプロセスではない |
| `common_standard/` | 他の群に収まらず、開発・文書・思考の作業に同じ形で効く規範（論点3） | 入らない。作業の種類を横断する規範ではなく、AI agent という作業者に特有の規範である |

どの群にも収まらないため、論点3 の決定（「どの群にも収まらないなら、その主題の群を作るかを決める」）により、群を作るかを決める。

##### 群を作る理由

- 主題は、利用者の原文の「AIに指示したときの、AI特有の詰まり方に対しての対応」である。既存の群は、人も AI も従う開発・文書・思考の規範で、この主題を持たない。
- `docs/README.md` の「一つのfileで足りる主題は、新しい群を作らず既存群へ置く」は、収まる既存群がある時の規則である。今回は収まる群が無い。
- 直前の steering（`20261122-handle-user-reviewed-commands-in-auto-mode`）は、利用者が求めた「aiへの指示固有のドキュメント」を作らなかった。task-design と steering の規則は、それ自体が AI agent への指示であり、規則が効く skill の中で読まれるためである。gate は、command を実行しうる複数の skill が従い、持ち主の skill が一つに決まらない（論点1）。skill の中に置けない AI agent 特有の規範が出たため、群が要る。

##### 群の名前を同列の群と並べて読んだ

同列: `common_standard/`、`development_standards/`、`documentation_standards/`、`think_standards/`、`doc_templates/`。

| 候補 | 読み | 判断 |
| --- | --- | --- |
| `agent_execution_standards/` | AI agent の実行の標準 | 採る。AI agent が作業を実行する時、という範囲を表し、同列の `*_standards` と表記が揃う |
| `ai_agent_standards/` | AI agent の標準 | 採らない。この docs はどの群も AI agent が読むため、何も絞らない名前になる（`naming/core.md` の「中身が大まかにわかる具体性を備える」） |

file 名 `blocked_commands.md` は、群の名前が「AI agent の実行」を語るため、それを繰り返さない（`naming/file.md` の「直上ディレクトリのコンテキストを継承する」）。`blocked` は、イテレーション2 で確かめたとおり、tasklist-executor の停止理由 `blocked` と同じ意味で使う。

##### 論点5 との関係

model の対応表（`runtime-model-profiles.md`）がこの群の範囲に入るかは、論点5 で、この範囲と言い直さずに照合して決める。この論点では決めない。

#### 提案3へのフィードバック（論点4）

**結果:** 合意（あわせて、置き場の誤りの再発防止の依頼。論点5 で扱う）

> ok。opusに頼んでるのはthinkに入れないみたいな愚行を起こさないからと思っているのに失望した。再発防止してほしい

### 決定（論点4）

`runtime-execution-contracts.md` の「実行環境gate」を、次の二つに分けて置く。

- 規範の本体（task level で実行してよいと判定したことは、実行環境がその command を通すことを意味しない。実行環境に止められたら、迂回せず停止して利用者へ返し、別の command で同じ結果を得ようとしない。特定の実行基盤に依存する手順はこの規範に書かず、利用先で要る具体手順は repository 固有の context に持たせる）は、`docs/` に新しい群 `agent_execution_standards/` を作り、`docs/agent_execution_standards/blocked_commands.md` に規則を変えずに移す。
  - 群の範囲: AI agent に作業を実行させる時に、AI agent と、それを動かす実行環境（host の実行許可の仕組み、sandbox、分類器等）の性質から起きる、AI agent に特有の詰まり方への対処。人も AI も従う開発・文書・思考の規範は、それぞれの群に置く。
  - `docs/README.md` の群の一覧に一行足す。収録が一つの間は群の README を作らず file を指す。見出し「5群への入口」の数を直す。
  - 既存の群（`development_standards/`、`documentation_standards/`、`think_standards/`、`common_standard/`）は、どれも人も AI も従う作業の規範か思考の作法の群で、AI agent に特有の詰まり方を扱わない。中身または群の範囲を言い直さずに照合すると、どれにも収まらない。
- 「実行環境に止められたことは、停止理由の `blocked`（権限の不足）に当たる」という対応は、`skills/tasklist-executor/` へ移す child 委譲の契約の「停止理由」に残し、規範の本体の file を参照する。
- steering の 6-1 の参照先を、規範の本体の file へ向け直す。

## 論点5: 置き場を選ぶ時に、中身または置き先の範囲を言い直して収めてしまう誤りの再発防止

**ステータス:** 反映済み

**種別:** レビュー指摘

### イテレーション0（論点5）: `naming/core.md` に読み違えの形を二つ足し、`docs/README.md` の群の置き方を直す

#### 提案0（論点5）

`doc-enricher` を提案 mode で適用した結果の三件。一件ずつ採否を決められる。

##### 提案0-1: 失敗例と訂正 — `plugins/tumeda-dev/docs/development_standards/naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」

範囲を約束する三つ（名前、入口の説明、既に入っている中身）の箇条の直後に、次を足す。

```markdown
三つのうち、範囲を決めるのは名前と入口の説明である。既に入っている中身は、名前と入口の説明をどう読むかを確かめる手掛かりに使い、名前と入口の説明より範囲を広げる根拠にしない。中身は名前を変えずに後から足されるため、既に入っている中身の一つが名前と入口の説明より広く見える時は、範囲が既に崩れている兆候であり、同じように足してよい先例ではない。

やってしまいがちな失敗: 既に入っている中身の一つが足す中身に近いことを根拠に、範囲を読み広げる。例えば、AI agent が実行環境に command を止められた時に迂回せず止まる、という規範を、議論・思考のプロセスの作法を入口の説明とする文書群へ足そうとした。群にある「エラーが出たとき」の作法が、阻まれた時の行動も扱っていることを根拠に、群の範囲を「AI agent の失敗を正す作法」と読み直した。入口の説明のまま照合すれば、この規範は議論・思考のプロセスの作法ではなく、入らない。

判断の問い: **「範囲に入ると判断した根拠は、名前と入口の説明か。既に入っている中身の一つか」**
```

##### 提案0-2: 失敗例 — 同じ節の、言い直しの失敗例（「照合しているのは、元の依頼や具体例が指す中身か…」の判断の問い）の直後

```markdown
言い直しは、言葉を一般化する形だけではない。中身のうち足す先に合う一面だけを取り出し、中身を他と区別している性質を落とす形もある。取り出した一面はどれも正しいため、言い直したことに気づきにくい。例えば、AI agent が実行環境に command を止められた時に迂回せず止まる、という AI agent に特有の規範を、「command を実行して作業を進める時に、止められたらどう進めるか」という一面で述べ、人も AI も従う開発の進め方の文書群へ足そうとした。AI agent に特有であるという性質を落としていた。

照合の前に、足す中身を、他と区別している性質（誰に向けたものか、どの場面で効くか）を含めて書き出す。足す先の候補が複数あり得る時は、一つを選んでから入る理由を探さず、書き出した中身を候補ごとに照合してから選ぶ。

判断の問い: **「書き出した中身から、足す先に合わない性質を落としていないか」**
```

##### 提案0-3: 訂正と導線 — `plugins/tumeda-dev/docs/README.md` の「群の置き方」

直す前:

```markdown
- 一つのfileで足りる主題は、新しい群を作らず既存群へ置く。
```

直した後:

```markdown
- 一つのfileで足りる主題は、収まる既存群があれば、新しい群を作らずその群へ置く。収まる群が無い時は、既存群へ収めるために中身や群の範囲を言い直さず、群を作るかを決める。収まるかは [`naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」](./development_standards/naming/core.md#中身を足す前に名前が約束する範囲に入るかを確かめる) で照合する。
```

#### 検討記録（論点5・イテレーション0）

##### 起点

利用者の原文（論点4 の提案3 への応答）:

> ok。opusに頼んでるのはthinkに入れないみたいな愚行を起こさないからと思っているのに失望した。再発防止してほしい

##### 起きたこと

| 回 | 選んだ置き場 | 誤りの形 |
| --- | --- | --- |
| 直前の steering（`20261122-handle-user-reviewed-commands-in-auto-mode`） | 規則を「実行環境gate」へ足す案の理由に「新設すると、止められた時の規則が二つの文書に分かれる」 | 中身を、足す先に合う形に言い直した |
| 論点2 提案0 | `docs/common_standard/` | 「持ち主の skill が一つに決まらない」だけを理由にし、群の範囲を見ていない |
| 論点4 提案1 | `docs/development_standards/development_flow/command_permission.md` | gate を「command を実行して作業を進める時に、止められたらどう進めるか」という一面で述べ、AI agent に特有という性質を落とした |
| 論点4 提案2 | `docs/think_standards/handling_blocked_commands.md` | 群に既にある `handling_errors.md` の一面（阻まれた時の行動の規範）を根拠に、群の範囲を入口の説明（議論・思考プロセスの作法）より広く読んだ |
| 論点4 提案3（合意） | 新しい群 `docs/agent_execution_standards/` | 中身も各群の範囲も言い直さず、全候補を表で照合した。どれにも収まらなかった |

##### 原因

`naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」は、assistant が設計前に読んでおり、論点4 の提案1 の検討記録で引用もしていた。読んでいたのに守れなかったため、なぜ自分の場合がその記述に当たると気づけなかったかを問うた（`doc-enricher` の進行5）。

- 提案1: 同節の失敗例は「中身を実際より一般的な言葉で言い直す」形だった。assistant は、一面を正確に述べることは言い直しに当たらないと読んだ。一面だけを取り出して性質を落とす形が、言い直しに含まれると書かれていない（提案0-2）。
- 提案2: 同節は範囲を約束するものに「既に入っている中身」を並べ、三つが食い違う時にどれが範囲を決めるかを書いていない。assistant は、既に入っている中身の一つを根拠に範囲を広げてよいと読んだ（提案0-1）。
- 提案1・2 の両方: `docs/README.md` の「一つのfileで足りる主題は、新しい群を作らず既存群へ置く」を、収まる群があるかを問う前に「新しい群を作らない」と読み、収まる群を探しにいった。`development_standards/README.md` の「既存の群に当たらなければ新設する」と違い、収まる群が無い時の扱いが書かれていない（提案0-3）。
- 論点2 提案0（`common_standard/` の範囲を見ていない）は、論点3 の決定で `docs/README.md` に範囲を書くため、次の作業者は払わない。提案にしない。

原因の持ち主は repository の知識（plugin の docs）である。`naming/core.md` は repository を問わず適用する標準で、`docs/README.md` はこの plugin の docs の索引である。

##### 当てはまる範囲

- 提案0-1・0-2: 既存の節の記述に読み違えの形を足すもので、範囲はその節の範囲（名前の付いたものへ中身を足す場面すべて）と同じである。
- 提案0-3: `docs/` の群の置き方。`docs/development_standards/README.md` の「この群の置き方」が既に「既存の群に当たらなければ新設する」としており、下位の群とも同じ扱いになる。

##### 本体の置き場所と導線

- 提案0-1・0-2: 本体は `naming/core.md` の同節。この節は、steering の再発防止 review（4-2）、`doc-enricher` の置き場所の決定（進行6）から参照され、task-design は設計前に `development_standards/` の配下をすべて読む。置き場を選ぶ場面で読まれている。導線は足さない。
- 提案0-3: 置き場を選ぶ時に最初に見たのは `docs/README.md` の群の一覧と群の置き方である。ここから `naming/core.md` の同節への案内を足す。

##### 捨てた候補

- `common_standard/` の範囲が書かれていなかった（論点2 提案0）— 進行2: 論点3 の決定で範囲を `docs/README.md` に書くため、原因が無くなる。

##### `doc-enricher` の置き場所の一覧を保存しなかった

`doc-enricher` は、置き場所の一覧を repository 固有の context へ保存してから進むとする。この repository の context（`.agents/skills/tumeda-dev-plugin-context.md`）は、配布する雛形（`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`）と同じ file であり（symlink）、ここへ保存すると、この repository に固有の一覧が利用先へ配布される。保存せず、今回の照合に要る範囲（`docs/README.md` の群の一覧と各群の README の入口の説明）だけを読んで進めた。

##### 気づいた不備（この論点では決めない）

`docs/README.md` の群の一覧は、`development_standards/` を「命名規約とエンティティ設計の判断基準」と説明している。今は `development_flow/` と `infrastructure/` も収め、群の README は「開発にまつわる標準を置く場所」とする。一覧の一行が古い。

#### 提案0へのフィードバック（論点5）

**結果:** 合意（提案0-1・0-2・0-3 のすべて）

> ok

### 決定（論点5）

置き場を選ぶ時に、中身または置き先の範囲を言い直して収めてしまう誤りを防ぐため、`doc-enricher` の提案三件を、提案0 の文面のまま適用する。

- 提案0-1: `naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」に、範囲を決めるのは名前と入口の説明であり、既に入っている中身は範囲を広げる根拠にしないことと、その失敗例・判断の問いを足す。
- 提案0-2: 同じ節に、一面だけを取り出して中身を他と区別している性質を落とす言い直しの形と、照合の前に性質を含めて書き出し、候補ごとに照合してから選ぶ手順、その失敗例・判断の問いを足す。
- 提案0-3: `docs/README.md` の「群の置き方」の一つの file の主題の規則を、収まる既存群がある時に限る形へ直し、収まらない時は言い直さず群を作るかを決めること、`naming/core.md` の同節への案内を足す。

適用は、他の未決の論点に依存しないため、設計中に反映する。適用した文書は `document-review` を通す。

### 反映（論点5）

- 提案0-1・0-2 を `plugins/tumeda-dev/docs/development_standards/naming/core.md` へ、提案0-3 を `plugins/tumeda-dev/docs/README.md` へ、承認された文面のまま適用した。
- `scripts/verification/validate-plugin.mjs` に、足した文の `requireText` と、直す前の一文の `forbidText` を足した。`node scripts/verification/validate-plugin.mjs` と `node scripts/verification/test-task-design-handoff.mjs` は pass。足した文を一語ずつ変えると、validator が落ちることを確かめた（変えた文は戻した）。
- `document-review` の更新時観点（内容の濃さ、記法、指示対象、普段の言葉、既存記述の直し方、機密性、暫定性）を当て、指摘は無かった。
- 同じ origin の `doc-enricher` review は、この決定自体が `doc-enricher` の提案であるため、再び起動しない。

## 論点6: model の対応表（`runtime-model-profiles.md`）の行き先

**ステータス:** 決定

**親論点:** 論点2

**種別:** TBDヒアリング

### イテレーション0（論点6）: plugin 全体の skill と host をつなぐ対応表として、plugin の直下に置く

#### 提案0（論点6）

`skills/runtime-model-profiles.md` を、規則を変えずに `plugins/tumeda-dev/model-profiles.md` へ移す。

- `tumeda-dev/model-profiles` は「tumeda-dev plugin の model の profile」と読める。plugin の直下には、host ごとの manifest（`.claude-plugin/`、`.codex-plugin/`）と、`docs/`、`skills/`、論点2 で合意した `scripts/` が並ぶ。plugin 全体に効く、host との対応の取り決めとして、manifest と同じ階層に置く。
- 参照元（visual-inspector、test-runner、tasklist-executor、exhaustive-review の `SKILL.md`、validator、repository の `README.md` の「運用契約」、skills の README）を向け直す。skills の README の「共有リファレンス」の行は、論点1 の決定で節ごと無くなるため、plugin の直下に置いた理由を一文書く先を論点7 の後に決める。

#### 検討記録（論点6・イテレーション0）

##### 中身を、他と区別している性質を含めて書き出した（論点5 で足した手順）

- 中身: plugin の skill は、provider 固有の model 名ではなく推論強度の profile を要求し、Claude Code と Codex の adapter がその profile を各 host の model に変える。profile ごとの host 別の選び方（`delegated-execution`、`high-reasoning-review`）、main session の skill は model を宣言しないという基準、adapter の規則、release 時の確認と host の model が変わった時の直し方を持つ。
- 誰に向けたものか:
  - plugin の skill を書く・直す人（frontmatter の `model`、Codex で child を起動する時の書き方）
  - release する人（frontmatter と対応表の一致、smoke test）
  - Codex で child を起動する直近の parent（実行時に profile を読み、model を選ぶか親の model を継ぐ）
- どの場面で効くか: skill の model の宣言を書く時、release の前、host の model の提供が変わった時、Codex で child を起動する時。
- 他と区別している性質: この plugin の skill 群に固有で、AI の host（Claude Code、Codex）ごとの model の選び方を扱う。利用先の作業の規範ではない。plugin のどの skill にも同じく効き、持ち主の skill が一つに決まらない。

##### 候補を、名前と入口の説明で照合した

| 候補 | 名前と入口の説明 | 照合 |
| --- | --- | --- |
| `docs/` の既存の群（`common_standard/`、`development_standards/`、`documentation_standards/`、`think_standards/`） | 人も AI も従う、開発・文書・思考の作業の規範 | 入らない。利用先の作業の規範ではなく、この plugin の skill と host の対応である |
| `docs/agent_execution_standards/`（論点4 で作る） | AI agent に作業を実行させる時に、AI agent と実行環境の性質から起きる、AI agent に特有の詰まり方への対処 | 入らない。model の選び方は詰まり方への対処ではない。「選べない model を指定して失敗させない」という一文だけを取り出すと入るように見えるが、それは中身の一面である |
| `skills/maintenance-plugin-context/maintenance_policies/` | directory の入口の説明は「このpluginのskill保守で従う規約」 | 一部だけ入る。skill を書く人・release する人に向けた部分は入るが、実行時に読む Codex の parent は保守をしていない。また、この directory を持つ skill の名前と説明は「repository context、作業限定の暫定指示、配布version規約を管理する」で、skill の保守の規約はそこに含まれていない。directory の入口の説明が、持ち主の skill の範囲より広く見える（論点5 の 0-1 の、範囲が既に崩れている兆候）。先例として使わない |
| profile を使う skill に分けて置く（`delegated-execution` を tasklist-executor の child 委譲の契約へ、`high-reasoning-review` を exhaustive-review へ） | 各 skill の範囲 | 入らない部分が残る。main session の skill は model を宣言しないという基準、adapter の規則、release 時の確認は、どの profile にも、どの skill にも同じく効き、置き先が無い |
| plugin の直下 | plugin 全体。host ごとの manifest が並ぶ | 入る。plugin のどの skill にも効く、host との対応の取り決めで、読み手（skill を書く人、release する人、実行時の host）のどれにも、plugin 全体の取り決めとして読める |

`docs/` に新しい群を作る案は採らない。`docs/` の群はどれも作業の規範で、この対応表は作業の規範ではないため、群を作っても `docs/` の中で一つだけ性質の違う群になる。

##### 論点2 の見込みの訂正

論点1 のイテレーション1 では「持ち主は maintenance-plugin-context」と見込み、論点2 の提案0 では「持ち主の skill が一つに決まらない」ことから `docs/common_standard/` とした。前者は上の表のとおり、`maintenance_policies/` の入口の説明を、持ち主の skill の範囲より広く読んでいた。後者は論点3 で範囲を決め、入らない。

##### 気づいた不備（この論点では決めない）

`skills/maintenance-plugin-context/maintenance_policies/` の入口の説明（「このpluginのskill保守で従う規約」）が、持ち主の skill の名前と説明より広い。`AGENTS.md` と root の `docs/maintenance_policies`（この directory への symlink）は、ここを plugin の保守の規約の置き場として扱っている。範囲を広げると決めて skill の説明を改めるか、置き場を変えるかは、この作業の目的（共有リファレンスの置き場）の外である。

#### 提案0へのフィードバック（論点6）

**結果:** 合意

> ok

### 決定（論点6）

`skills/runtime-model-profiles.md` を、規則を変えずに `plugins/tumeda-dev/model-profiles.md` へ移す。plugin のどの skill にも同じく効く、AI の host（Claude Code、Codex）ごとの model の選び方の取り決めであり、host ごとの manifest（`.claude-plugin/`、`.codex-plugin/`）と同じ plugin の直下に置く。参照元（visual-inspector、test-runner、tasklist-executor、exhaustive-review の `SKILL.md`、validator、repository の `README.md` の「運用契約」）を向け直す。

`docs/` の群（作業の規範）、`agent_execution_standards/`（AI agent に特有の詰まり方への対処）には、名前と入口の説明で照合すると入らない。`maintenance-plugin-context/maintenance_policies/` は、実行時に読む Codex の parent に向けた部分が入らず、directory の入口の説明が持ち主の skill の範囲より広いため使わない。profile を使う skill に分けると、どの skill にも同じく効く基準・adapter の規則・release 時の確認の置き先が無くなる。

## 論点7: skill の内部へ置く file の名前

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点7）: 持ち主の skill の directory の名前を繰り返さず、中身を表す

#### 提案0（論点7）

| 今の file | 行き先と名前 | `親/自分` で読んだ時 |
| --- | --- | --- |
| `runtime-execution-contracts.md` のうち、child 委譲の契約 | `skills/tasklist-executor/execution-contracts.md` | tasklist-executor の実行の契約 |
| `runtime-feedback-review.md` | `skills/steering/implementation-feedback.md` | steering の、実装の feedback（の記録と返却） |
| `task-design-work-handoff-contracts.md` | `skills/task-design/work-handoff-contracts.md` | task-design の、作業の引継ぎの契約 |

表記は、`skills/` の配下の慣習（kebab-case）と、`task-design/` の既存の内部指示（`tasklist-design.md`、`roadmap-design.md`）に揃える。各 file の H1 は、新しい名前と中身に合わせる（例: `# Runtime execution contracts` は、gate を外した後の中身を表す見出しにする）。見出しの文言は移行の ledger で、移す前の意味を保つことと合わせて確かめる。

#### 検討記録（論点7・イテレーション0）

##### 中身を、他と区別している性質を含めて書き出した

| file | 中身 | 誰に向けたものか | どの場面で効くか |
| --- | --- | --- | --- |
| child 委譲の契約 | 状態の正本と single writer、executor が停止時に返す停止理由、child の request・result、停止・再開と二重起動防止、logical owner と physical launcher、child 処理に要る repository context | steering（停止理由と状態の正本を読む caller）、visual-inspector・test-runner（request・result を読む child）、host の起動の仕組み | tasklist-executor が tasklist を実行し、child へ委ね、停止して caller へ返し、再開する時 |
| 実装の feedback の処理 | 実装・review・validation・利用者確認の feedback を直接受けた時に、`facilitate-discussion` を `implementation_review.md` へ適用し、decision の戻り先を選ぶ手順（今の H1: 「実装feedbackの記録と返却」） | steering、tasklist-executor | 実装の後に feedback を受けた時 |
| 作業の引継ぎの契約 | 進行中の design の判断責任を、別の task-design の実行へ渡す時の、独立再構成、正本の照合、attempt の lifecycle、完了 gate | task-design（steering は routing するだけ） | 既存の design を別の task-design の実行が引き継ぐ時（task-design の「既存designのhandoff gate」） |

##### 名前を選んだ理由

- `execution-contracts.md`: 中身は child への委譲だけでなく、caller（steering）へ返す停止理由と、tasklist の single writer を含む。`child-delegation.md` にすると、caller との契約が名前から外れる。持ち主の directory が「tasklist-executor」を語るため、名前で繰り返さない（`naming/file.md` の「直上ディレクトリのコンテキストを継承する」）。
- `implementation-feedback.md`: 今の H1（実装feedbackの記録と返却）に合わせる。`implementation-review.md` にすると、この手順が書き込む記録の file（`implementation_review.md`）と、同じ読み手が同じ場面（feedback を受けた時）で出会い、手順と記録という違う意味の名前が並ぶ。
- `work-handoff-contracts.md`: 今の名前から、親の directory が語る `task-design-` だけを外す。`handoff` だけにすると、task-design の中で別の意味で使われる handoff（`facilitate-discussion` から返る decision の handoff、skill 間の result の handoff）と区別できない。今の H1・`SKILL.md` の「handoff gate」・`scripts/extract-handoff-input.mjs` と同じ語を保つ。

#### 提案0へのフィードバック（論点7）

**結果:** 合意

> ok

### 決定（論点7）

skill の内部へ置く file の名前を次のとおりにする。持ち主の directory の名前を繰り返さず、中身を表す。表記は `skills/` の配下の慣習（kebab-case）に揃え、各 file の H1 は新しい名前と中身に合わせる。見出しの文言は、移行の ledger で移す前の意味を保つことと合わせて確かめる。

- `runtime-execution-contracts.md` のうち、child 委譲の契約 → `skills/tasklist-executor/execution-contracts.md`。child への委譲に加え、caller（steering）へ返す停止理由と tasklist の single writer を含むため、`child-delegation` にしない。
- `runtime-feedback-review.md` → `skills/steering/implementation-feedback.md`。今の H1（実装feedbackの記録と返却）に合わせ、書き込む記録の file（`implementation_review.md`）と別の名前にする。
- `task-design-work-handoff-contracts.md` → `skills/task-design/work-handoff-contracts.md`。task-design の中で別の意味で使う handoff と区別するため、`work-` を残す。

## 論点8: 移す前の意味を保つことの確かめ方（function migration の ledger と検証）

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点8）: 文面を変えずに移す範囲はバイト一致で確かめ、文面が変わる範囲だけを意味単位に分ける

#### 提案0（論点8）

`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md` に従い、編集の前に baseline と二層 ledger を作る。ledger は `design.md` の「移す前の意味を保つこと」に置く。

- baseline: `main` の `dc6bf58`（9.1.4）。対象は `runtime-execution-contracts.md`（118 行）、`runtime-feedback-review.md`（44 行）、`runtime-model-profiles.md`（46 行）、`task-design-work-handoff-contracts.md`（56 行）、`scripts/github/create_or_get_pr.sh`（133 行）と、これらを参照する file（skill、docs、validator、test script、README、plugin repository の context）。
- 構造 ledger: 移す file の節（`##`）ごとに、行き先の file と節、分類（`MOVE`、`ADAPT` 等）を一行ずつ登録する。
- contract ledger:
  - 文面を一字も変えずに移す節は、節を一行として `MOVE` に分類し、baseline から切り出した範囲と移した後の範囲が、バイト単位で一致することで確かめる。
  - 文面が変わる範囲だけを、§3 の意味単位（前提、action、禁止、例外、理由、例、判断質問等）へ分け、一つずつ分類する。対象は次のとおり。
    - H1 と冒頭の説明（論点7 で、新しい名前と中身に合わせると決めた）
    - 実行環境 gate のうち、`blocked` との対応を「停止理由」へ移す一文と、規範の本体の file の H1（論点4）
    - 参照元の path の書き換え（`ADAPT`）
    - skills の README の「共有リファレンス」の節（論点1 で、直下に共有の文書を置かないと決めた）と、plugin の context の雛形が例外である理由
    - docs の README の群の一覧
- white-box 検証:
  - 順方向: baseline の全節について、行き先の節がバイト一致するか、contract ledger の行があることを確かめる。
  - 逆方向: `git diff` の削除行と追加行を一行ずつ、ledger の行へ対応付ける。対応しない行が一行でもあれば完了にしない。
  - 境界: steering の 6-1（gate の参照）と停止理由の参照、tasklist-executor・visual-inspector・test-runner からの child 委譲の契約の参照、task-design の handoff gate、validator と test script の assertion が、移した後の file を指して同じ判断になるかを読む。
- 完了集計を `適合 N / 合意済み追加 N / 合意済み変更 N / 明示廃止 N / 未監査 0 / 未分類削除 0 / 未分類追加 0` の形で `design.md` に残す。

#### 検討記録（論点8・イテレーション0）

##### 方針が定める手順と、この作業の差

`function_migration_policy.md` の §4.3 は、各構造範囲を §3 の意味単位へ分解して contract ledger に載せるとする。この作業の大半は、file の場所と名前を変え、文面を変えずに移すことである（論点1〜7 で、中身の規則は変えないと決めた。design の非目標）。

文面が一字も変わらない範囲では、意味単位はすべて同じ文のまま残る。意味単位に分けて一行ずつ照合しても、バイト一致を確かめる以上のことは分からない。一方、意味が落ちたり変わったりしうるのは、文面が変わる範囲（H1、冒頭の説明、分ける境目、path の書き換え、README の節）である。分解の手間を、変わる範囲へ集める。

この扱いは §4.3 の文言（各構造範囲を分解する）とは違うため、論点として合意を取る。

##### 採らなかった案

| 案 | 採らない理由 |
| --- | --- |
| 移す範囲をすべて意味単位に分ける | 約 300 行の大半が文面を変えない範囲で、分けた行はバイト一致と同じことしか確かめない。分解の量が、変わる範囲の照合に向ける注意を薄める |
| ledger を作らず、validator の pass で完了とする | §9 の「smokeの通過を完了根拠にする」失敗に当たる。validator は assertion を置いた文字列しか見ない |
| ledger を別の file にする | steering の directory の root に置く file は決まっている。この ledger は、設計の「移す前の意味を保つこと」の中身であり、design に置ける量に収まる |

#### 提案0へのフィードバック（論点8）

**結果:** 合意

> ok

### 決定（論点8）

`function_migration_policy.md` に従い、編集の前に baseline（`main` の `dc6bf58`）と二層 ledger を作り、`design.md` の「移す前の意味を保つこと」に置く。

- 文面を一字も変えずに移す節は、節を一行として `MOVE` に分類し、baseline から切り出した範囲と移した後の範囲のバイト一致で確かめる。
- 文面が変わる範囲（H1 と冒頭の説明、実行環境 gate のうち `blocked` との対応を「停止理由」へ移す一文と規範の本体の見出し、参照元の path の書き換え、skills の README の「共有リファレンス」の節と雛形が例外である理由、docs の README の群の一覧）だけを、§3 の意味単位へ分けて分類する。
- white-box 検証は、順方向（全節がバイト一致か ledger の行を持つ）、逆方向（`git diff` の削除行・追加行を ledger の行へ対応付ける）、境界（steering の 6-1 と停止理由、child 委譲の契約の参照、task-design の handoff gate、validator と test script の assertion）を行い、完了集計を `design.md` に残す。

§4.3（各構造範囲を意味単位へ分解する）の文言と違い、文面を変えない範囲を分解しないことに合意した。分解しても、バイト一致以上のことは確かめられないためである。

## 論点9: release version の上げ方

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点9）: PATCH（9.1.5）にし、利用先の context に残る旧い path は分かる範囲で直す

#### 提案0（論点9）

PATCH を上げ、9.1.5 にする。

- 利用者が呼ぶ skill、parameter、skill の動作は変わらない。変わるのは、skill の本文が参照する共有の文書と script の path だけで、参照する側はすべてこの作業で書き換える。
- 利用先の repository の context に、旧い path が書かれている例がある。今回の発端になった利用先 repository の context は、PR を作る script を「plugin の `skills/scripts/github/create_or_get_pr.sh`」と書いている。skill は新しい path で script を呼ぶため PR の作成は動くが、context の記載は古くなる。この repository の記載は、元の作業へ戻った後の記録の PR で直す。他の利用先は、ここから確かめられない。

#### 検討記録（論点9・イテレーション0）

##### version の規約を当てた

`maintenance-plugin-context` の「Plugin version」と、plugin repository の context の「version bump」:

- 破壊的変更は MAJOR、後方互換な機能追加は MINOR、後方互換な修正・文書変更は PATCH。
- MINOR と PATCH の境界は「consumer が新たに呼べるものが増えたか」。新規 file の追加それ自体は MINOR の根拠にならない。
- MAJOR を上げる理由が、以前の版の skill が作った成果物を、今の版の skill や script が見出し・label の名前で読めなくなることなら、`breaking_changes/` に記録する。

この作業は、新しく呼べるものを増やさない（MINOR でない）。以前の版の skill が作った成果物（design、tasklist、discussion 等）の見出しや label も変えない。

##### MAJOR にしない理由

共有の文書と script の path は、skill の本文が相対 path で参照する plugin の内部の配置で、skills の README も「skill 本文から参照される」ものとして並べてきた。利用者や利用先の作業が直接呼ぶ入口ではない。利用先の context の記載が古くなるのは、内部の配置を写した記載が残る問題で、skill の呼び出し方は壊れない。

##### 採らなかった案

| 案 | 採らない理由 |
| --- | --- |
| MAJOR（10.0.0） | 呼び出し方も、以前の版の成果物の読み方も変わらない。利用先の context の記載は、旧い path を写した記載の更新で済む |
| 旧い path に転送用の file を残す | 二重の正本になる。validator は以前の複製が無いことを検査しており（`requireAbsent`）、同じ考え方に反する |

#### 提案0へのフィードバック（論点9）

**結果:** 合意

> ok

### 決定（論点9）

PATCH を上げ、9.1.5 にする。新しく呼べるもの（skill、parameter）は増えず、以前の版の skill が作った成果物の見出し・label も変えない。変わるのは skill の本文が参照する共有の文書と script の path で、参照する側はこの作業ですべて書き換える。旧い path に転送用の file は残さない。

今回の発端になった利用先 repository の context に残る、PR を作る script の旧い path の記載は、元の作業へ戻った後の記録の PR で直す。他の利用先は、ここからは確かめられない。

## 論点10: 切り出しの候補と、目的の外で気づいた不備の扱い

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点10）: どれもこの作業に含めず、issue を三つ作って切り出す

#### 提案0（論点10）

次の五件は、どれもこの作業に含めず、plugin repository の issue へ切り出す。issue は扱う判断ごとに三つ作る。この作業の `design.md` の非目標へ、切り出したことと切り出し先を書く。

| issue | 含める件 | 扱う判断 |
| --- | --- | --- |
| A: steering と task-design の `SKILL.md` から、独立した工程を内部指示へ切り出すかを決める | 下の skill-update-review の候補 1〜4 | 各工程を同じ skill の内部指示へ分けるか |
| B: `maintenance-plugin-context/maintenance_policies/` の範囲を、持ち主の skill に合わせる | 入口の説明（このpluginのskill保守で従う規約）が、持ち主の skill の名前と説明（repository context、作業限定の暫定指示、配布version規約）より広い | skill の範囲を広げて説明を改めるか、置き場を変えるか |
| C: plugin repository の context と、配布する context の雛形を分ける | `.agents/skills/tumeda-dev-plugin-context.md` が配布する雛形と同じ file のため、この repository に固有の記載（`doc-enricher` の置き場所の一覧等）を保存すると利用先へ配布される | 雛形と instance の分け方 |

issue の本文には、利用先 repository に固有の情報を書かない。

#### 検討記録（論点10・イテレーション0）

##### skill-update-review の結果（設計時）

task-design の Step 2 に従い、構造案の採用前に `skill-update-review` を適用した。論点1〜7 で構造（置き場と名前）を決めた後で、採用前の適用が遅れた。反映の前には適用している。

- 対象: `tasklist-executor`、`steering`、`task-design`（内部指示が増える三つ）。参照の path だけが変わる skill（visual-inspector、test-runner、exhaustive-review、share-work-in-progress）は、参照先の file を文面を変えずに移し、指す path だけを直すため、構造の変わらない更新として対象にしなかった。
- 読んだ file: `tasklist-executor/SKILL.md`、`steering/SKILL.md`、`task-design/SKILL.md`、`task-design/tasklist-design.md`、`task-design/roadmap-design.md`、移す予定の `runtime-execution-contracts.md`、`runtime-feedback-review.md`、`task-design-work-handoff-contracts.md`。
- tasklist-executor: 候補なし。
- 候補 1（steering）: 「Blocker resolution」。固有の判断（例外が成立する 2 条件）、状態（Flow から離脱中、a・b・c の進め方）、完了条件（実行条件の回復と、離脱した step の先頭への復帰）、記録先（`subagent_report/`）を持ち、Flow と別の理由（自走の範囲の見直し等）で改訂される。変更 case: 自走の範囲から外す操作に「費用が発生する操作」を足すと、同節だけを直し、Flow の step は直さない。分ける先は同じ skill の内部指示。読む条件は Flow が進められない状態を検知した時、親へは離脱した step と報告を返す。
- 候補 2（steering）: 「Standalone roadmapの昇格」。固有の gate（対象 gate、移動前の安全 gate、利用者の承認）、完了条件（bundle の移動と Step 3 への合流）を持ち、入力 `adopt_task_design_working_dir` がある時だけ使う。変更 case: 昇格できる source の条件を変えると、同節だけを直す。分ける先は同じ skill の内部指示。
- 候補 3（steering）: Step 1 の前月 summary の生成。固有の判断（tasklist・roadmap・planless の status の導出）、出力形式、single writer（翌月初の処理だけ）を持つ。変更 case: summary の status の導き方を変えると、この手順だけを直す。分ける先は同じ skill の内部指示。
- 候補 4（task-design）: 「8. このスキル自体の更新について」。task-design を実行する時ではなく、この skill を直す時に読む。固有の判断（修正の種類と使う model）を持ち、skill の実行の手順と別の理由で改訂される。分ける先は同じ skill の内部指示。
- 移す三つの file（`execution-contracts.md`、`implementation-feedback.md`、`work-handoff-contracts.md`）は、それぞれ既に別 file で、固有の契約と改訂理由を持つ。持ち主の skill の内部指示として置くことは、候補を生まない。

##### `work_scope.md` の二段目で判定した

一段目: どの件も、結論が変わってもこの作業（共有リファレンスの置き場と名前）の決定・実装範囲は変わらない。目的の外である。

二段目: 今の作業に含めたら、review・revert・本番適用の単位が崩れるか。

- 候補 1〜4: 崩れる。共有の文書の置き場を変える変更と、skill の中の工程を分ける変更が一つの release に混ざり、片方だけを戻せない。分けるかどうかにも、工程ごとの判断が要る。
- B: 崩れる。skill の範囲を広げるか置き場を変えるかの判断が要り、`AGENTS.md` と root の `docs/maintenance_policies`（symlink）にも及ぶ。
- C: 崩れる。雛形と instance の分け方の設計が要る。この作業では雛形を動かさないと決めた（論点2）。

`docs/README.md` の `development_standards/` の行の説明が古い件は、同じ file の群の一覧を直す作業に含めても単位が崩れないため、この作業で拾う（design の X4）。

##### issue の分け方

一つの issue が一つの判断を持つように分ける。A は「skill の中の工程を分けるか」、B は「一つの skill の範囲」、C は「context の雛形と instance」で、互いに結論が依存しない。

#### 提案0へのフィードバック（論点10）

**結果:** 合意（issue A に、steering の名前が変わりうることを添える）

> ok。ただ、このissueを適用する時もしかしたらsteeringという名前がなくなってるかも https://github.com/tumeda1992/ai_agent_dev_skill_plugin/issues/11

### 決定（論点10）

次の五件は、この作業に含めず、plugin repository の issue へ切り出した。この作業の `design.md` の非目標へ、切り出したことと切り出し先を書く。

- issue #27（A）: steering と task-design の `SKILL.md` から、独立した工程（steering の Blocker resolution、Standalone roadmap の昇格、前月 summary の生成、task-design の「8. このスキル自体の更新について」）を内部指示へ分けるかを決める。steering の候補は #11（steering の役割と名前の見直し）の結論に依存し、#11 で名前や役割が変わった場合は変わった後の skill に当てて判断し直すと本文に書いた。
- issue #28（B）: `maintenance-plugin-context/maintenance_policies/` の範囲を、持ち主の skill に合わせる。
- issue #29（C）: plugin repository の context と、配布する context の雛形を分ける。

`docs/README.md` の `development_standards/` の行の説明が古い件は、この作業で拾う（design の X4）。

この作業で `skills/steering/` の中へ移す `implementation-feedback.md` は、持ち主の skill の directory と一緒に動く。#11 で steering の名前が変わる時は、directory の名前の変更とともに移る。

### 反映後の skill-update-review（編集後）

対象と段階: `tasklist-executor`、`steering`、`task-design` の編集後。設計時に全体を読んだ `SKILL.md` と内部指示に対し、反映で変わったのは参照の path の行（R1〜R7、R11、R12、R19）と、内部指示として加わった `tasklist-executor/execution-contracts.md`、`steering/implementation-feedback.md`、`task-design/work-handoff-contracts.md` である。加わった三つは設計時に移す前の file として全体を読んでおり、文面の変化は design の ledger の C1〜C6 だけである。編集後の全体を、この差分を当てて探し直した。

- tasklist-executor: 候補なし。`execution-contracts.md` は child 委譲と停止の契約という固有の改訂理由を持つ別 file で、`SKILL.md` への抱え込みを増やさない。
- steering: 候補は設計時と同じ（Blocker resolution、Standalone roadmap の昇格、前月 summary の生成）。issue #27 へ切り出し済み。`implementation-feedback.md` は別 file のまま加わった。
- task-design: 候補は設計時と同じ（「8. このスキル自体の更新について」）。issue #27 へ切り出し済み。

返却先: この steering の design と、この議論記録。新しい候補が無いため、論点10 の決定（issue #27 へ切り出す）を変えない。
