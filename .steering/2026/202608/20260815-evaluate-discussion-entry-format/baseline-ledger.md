# Baseline ledger: facilitate-discussionのentry format移行

## baselineと移行方向

| 項目 | 内容 |
| --- | --- |
| baseline revision | `71c8ba040d04cca0ad54181460326688991e671f` |
| baseline source | 上記revisionの`plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`全文と`plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md`全文 |
| baseline再現方法 | `git show 71c8ba040d04cca0ad54181460326688991e671f:<path>` |
| 移行方向 | baselineのproduction contractから、同steeringで合意した読み手中心のentry contractへ移行する |
| general policy | `plugins/tumeda-dev/docs/common_standard/function_migration_policy.md` |
| 合意の正本 | `task-design-discussion.md`の論点4、8〜20と`design.md` |
| baselineとの差分確認 | 移行着手前のproduction 2 fileはbaseline revisionと同一であり、先行差分はない |

この移行はdiscussion processを変更しない。論点選択、同一decisionへのiteration、別decisionへのrouting、親子関係、合意gate、履歴保存、再開、事後reconstruction、consumerへのhandoffは保持する。変更対象は、それらをentryへどう表示・保存するかである。

## 分類語彙

| 分類 | このledgerでの意味 |
| --- | --- |
| `KEEP` | 意味と配置を維持する。文脈接続のための軽微な語句補正は許す |
| `MOVE` | 意味を変えず、別の節またはtemplate commentへ移す |
| `ADAPT` | 能力を維持し、新formatの語彙・構造へ接続し直す |
| `ADD` | 合意済みの新contractまたは参照templateを追加する |
| `CHANGE` | baselineの挙動を合意済みの別挙動へ置換する |
| `RETIRE` | baselineの固定fieldまたは強制表示を合意に基づいて廃止する |

## structure ledger

### `SKILL.md`

baselineの全348行を次の連続区間で覆う。

| baseline行 | 構造単位 | 分類 | productionでの行き先 |
| --- | --- | --- | --- |
| 1〜4 | frontmatter | `KEEP` | frontmatter |
| 5〜7 | 文書title周辺 | `KEEP` | 文書title周辺 |
| 8〜17 | 目的と成果 | `ADAPT` | `目的と成果`。完全案強制と固定next actionを新contractへ置換 |
| 18〜28 | 起動gate | `KEEP` | `起動gate` |
| 29〜51 | 責務境界 | `ADAPT` | `責務境界`。self-contained性と現在stateの語彙だけ更新 |
| 52〜65 | 入力 | `KEEP` | `入力` |
| 66〜76 | 全体の設計意図 | `ADAPT` | `全体の設計意図`。完全案、現在の合意対象、next actionの固定表示を置換 |
| 77〜87 | workflow全体の不変条件 | `ADAPT` | `workflow全体で守る不変条件`。判断可能な提案、feedback lifecycle、過去iteration不変へ接続 |
| 88〜119 | workflow概観とflow | `ADAPT` | `実行workflow`。processは維持し、nodeの表示語彙だけ更新 |
| 120〜142 | skill起動とfile解決 | `ADAPT` | `1. skillを起動する`。読取対象から廃止fieldを外す |
| 143〜167 | 論点level契約と親子validation | `KEEP` | `2. 論点を扱う`冒頭 |
| 168〜182 | 対象論点のrouting | `KEEP` | `2.1 対象論点を選ぶ` |
| 183〜200 | 原因owner routingとdoc-enricher | `KEEP` | `2.1.1 認識齟齬を原因ownerへ戻す` |
| 201〜215 | 新規論点作成 | `ADAPT` | `2.2 新規論点を作るvariant`。新entry骨子とproposal patternへ接続 |
| 216〜219 | 既存論点処理の入口 | `KEEP` | `2.3 選択した一つの論点を進める` |
| 220〜247 | feedback routingとiteration追記 | `ADAPT` | `2.3.1 feedbackをiterationとして扱う`。feedback確定後に次iterationを追加するlifecycleへ置換 |
| 248〜256 | 決定済み論点の再開 | `ADAPT` | 同名variant。旧決定の現在表示を外して新iterationへ接続 |
| 257〜268 | decision確定とnext action保存 | `CHANGE` | `2.3.2 合意したdecisionを確定する`。固定fieldは廃止し、chat handoffは維持 |
| 269〜278 | reparent | `KEEP` | `2.3.3 論点をreparentする` |
| 279〜286 | scope外論点の取下げ | `ADAPT` | `2.3.4 scope外の既存論点を取り下げる`。結果は`決定`へ保存 |
| 287〜300 | chat上で合意済みのdiscussion記録 | `ADAPT` | `2.3.5`。新iteration骨子で再構成し、固定next action保存を外す |
| 301〜311 | 論点level完了gate | `ADAPT` | 同名gate。判断可能な提案、decision、handoffの語彙へ更新 |
| 312〜326 | handoff前の通常同期 | `ADAPT` | `3`と`3.1`。固定next action参照をchat handoffへ更新 |
| 327〜339 | 記録漏れの事後reconstruction | `ADAPT` | `3.2`。旧固定field列挙を新iterationの意味単位へ更新 |
| 340〜348 | handoff完了gate | `ADAPT` | `3.3`。固定next action保存を要求せず、decisionとhandoffを区別 |

### `templates/discussion_entry.md`

baselineの全84行を次の連続区間で覆う。

| baseline行 | 構造単位 | 分類 | productionでの行き先 |
| --- | --- | --- | --- |
| 1〜5 | 新規論点作成gate comment | `ADAPT` | template先頭comment。独立decision分解契約を追加 |
| 6〜14 | 論点見出し、status、parent、種別 | `KEEP` | entry直下のmetadata |
| 15〜19 | 起点原文と提起背景の固定field | `ADAPT` | `提案0`の`提案背景`へ、判断に必要な時だけ内容固有の構造で保存 |
| 20〜26 | `現在の合意対象` | `RETIRE` | entry末尾の未決proposalを判断対象にするため削除。論点4のイテレーション12〜14 |
| 27〜38 | `議論の変遷`、固定の事象・原因追跡 | `ADAPT` | 番号付きiteration内の`提案背景`。原因の追跡能力は維持し、固定見出しを廃止 |
| 39〜47 | `根本原因0 + 提案0`と固定`総論 / 各論 / ルール / 適用例` | `CHANGE` | `イテレーション0`の`提案0 → 提案背景 → 提案0へのフィードバック` |
| 48〜52 | 固定`検証 / 観点 / 弱点` | `RETIRE` | internal validationはskill側で維持。判断材料になる制約だけproposalまたは背景へ具体的に記載 |
| 53〜57 | iteration見出しとfeedback原文 | `ADAPT` | 番号付きiterationと末尾の`提案Nへのフィードバック` |
| 58〜62 | iteration固定`検証 / 観点 / 弱点` | `RETIRE` | 固定表示を廃止。必要な判断材料だけ内容固有に記載 |
| 63〜67 | 固定`論点routingの判断` | `MOVE` | routing能力は`SKILL.md`に維持。entryへは判断理解に必要な場合だけ`提案背景`等へ記載 |
| 68〜71 | 固定`修正先の判断` | `MOVE` | 遡及判断は`SKILL.md`に維持。proposal理解に必要なら`提案背景`へ記載 |
| 72〜81 | `根本原因N + 提案N`、変更点、完全案、固定本文形 | `CHANGE` | `提案N → 提案背景 → 提案Nへのフィードバック`。その回の問いを判断できる範囲だけ示す |
| 82〜82 | inlineの`決定`field | `ADAPT` | entry末尾の`### 決定` |
| 83〜84 | 固定`ネクストアクション`field | `RETIRE` | default後続処理は表示しない。必要な停止は任意`再開条件`、最終的な順序・委譲は`決定`、chat handoffはskill contractで維持 |

## contract ledger

### 既存contract

| ID | baseline契約 | source | 分類 | productionで維持・変更する内容 | 合意典拠 |
| --- | --- | --- | --- | --- | --- |
| S01 | 明示された時だけskillを起動する | SKILL 19〜27 | `KEEP` | 起動gateを維持 | 既存能力保持 |
| S02 | 一つのdiscussion fileをsession外の正本にする | SKILL 8〜17, 79 | `KEEP` | 保存済みfileを判断と履歴の正本にする | 論点1 |
| S03 | 一つのleaf論点を一decisionに限定する | SKILL 70〜71, 143〜181 | `KEEP` | feedbackごとにscopeを再判定し、別decisionは別論点へrouting | 論点1、13 |
| S04 | discussion fileの解決・作成・継続利用をskillが所有する | SKILL 29〜51, 120〜141 | `KEEP` | directory/file解決とlegacy保持を維持 | 既存能力保持 |
| S05 | 明示入力はdirectoryとbasenameだけにする | SKILL 53〜64 | `KEEP` | internal stateを外部input fieldにしない | 既存能力保持 |
| S06 | 論点番号重複時は停止し、自動修復しない | SKILL 79〜80, 126〜137 | `KEEP` | canonical/legacy走査と停止能力を維持 | 既存能力保持 |
| S07 | 過去iteration、旧判断、却下理由を不変にする | SKILL 72〜73, 81 | `ADAPT` | feedback確定後のiteration subtreeを不変にし、現在結論は末尾の`決定`が所有 | 論点4、8、12 |
| S08 | 合意前にself-containedな完全案を保存する | SKILL 68〜69, 82 | `CHANGE` | 合意前にその回の問いを単独で判断できるproposalを保存。完全状態が問いの時だけ完全版を示す | 論点4イテレーション17〜20 |
| S09 | 上部の現在対象を局所更新する | SKILL 72〜73, template 21〜26 | `RETIRE` | entry末尾の未決proposalを現在の判断対象とし、重複navigationを作らない | 論点4イテレーション12〜14 |
| S10 | chatの合意確認でfile・論点・提案・判断対象を特定する | SKILL 83 | `KEEP` | session指示語を避け、保存したproposalを具体的に特定 | 論点1 |
| S11 | handoff前に未収録discussionを同期する | SKILL 84〜86, 312〜348 | `KEEP` | 同期と事後reconstructionを維持 | 論点1 |
| S12 | 会話にない提案・合意を補完しない | SKILL 85〜86, 287〜299, 327〜348 | `KEEP` | 観測、提案、feedback、合意、確認不能を区別 | 論点1 |
| S13 | processとdomain workflowを分け、decisionごとにconsumerへ返す | SKILL 74〜75, 90〜118 | `KEEP` | fileの固定next actionとは分け、chat handoffは維持 | 論点1、20 |
| S14 | 親子関係はchildの`親論点`を正本にする | SKILL 159〜166 | `KEEP` | 一親、同file、非自己参照、非循環を維持 | 論点13 |
| S15 | 未決childに応じてparent statusを同期する | SKILL 166 | `KEEP` | `子論点待ち / 分解済み`を維持 | 論点13 |
| S16 | 認識齟齬を成果物・repository知識・skillへroutingする | SKILL 183〜199 | `KEEP` | 原因ownerとdoc-enricher reviewを維持 | 既存能力保持 |
| S17 | 新規論点で固定`提起の背景`、事象、原因追跡を順に書く | SKILL 205〜207, template 15〜38 | `ADAPT` | `提案0`の後の`提案背景`で、入力・finding・既存状態、必要条件、proposalの応答を読み手順に示す | 論点4、8、9 |
| S18 | 提案を固定`総論 / 各論 / ルール / 適用例`で書く | template 39〜47, 72〜81 | `CHANGE` | 内容固有の段落、見出し、表、tree、diff等を選ぶ | 論点3、4、10 |
| S19 | 全iterationに固定`検証 / 観点 / 弱点`を表示する | template 48〜52, 58〜62 | `RETIRE` | validation自体は維持し、判断に必要な制約や未解決事項だけを内容に適した場所へ示す | 論点4 |
| S20 | iterationへfeedback、routing、遡及、変更点、完全案を順に保存する | SKILL 220〜246 | `CHANGE` | `提案N → 提案背景 → 提案Nへのフィードバック`を一単位にする。feedbackは評価した提案が所有 | 論点4、8 |
| S21 | feedback前の状態を表示する | template 53〜57 | `ADAPT` | 提案保存時にfeedback見出しだけ置き、本文は空にする。`未回答`は書かない | 論点19 |
| S22 | feedback結果を固定候補で表す | baselineには明示fieldなし | `CHANGE` | feedback受領後に、その回の結果が分かる短い自由表現を`結果`へ書く | 論点19 |
| S23 | iterationごとに修正後の完全案を再掲する | SKILL 241〜246 | `CHANGE` | 各回の問いに必要なproposalだけ示し、既決内容を完全性のために累積再掲しない | 論点4イテレーション17〜20 |
| S24 | 決定済み同一decisionを旧決定を残して再開する | SKILL 248〜255 | `ADAPT` | 過去iterationを維持し、旧`決定`を現在表示から外して新iterationを追加。再決定後の`決定`は一つ | 論点12 |
| S25 | 別topicが具体表現だけ置換した時の履歴同期 | baselineに専用contractなし | `ADD` | decision boundaryを維持する置換ではiterationを変えず、`決定`だけを現在表現と典拠へ同期 | 論点16 |
| S26 | decision確定時にstatus、決定、固定next actionを保存する | SKILL 257〜267 | `CHANGE` | statusと自己完結した`決定`を保存。固定next action fieldは書かず、consumerへの具体handoffはchatで返す | 論点20 |
| S27 | `決定`を過去の部分決定の総和として扱う | baselineは暗黙 | `CHANGE` | `決定`は現在有効な最終結論を自己完結して書く。任意の仮決定は現在stateとしてのみ扱う | 論点4イテレーション17〜20 |
| S28 | reparent時に履歴と親子validationを維持する | SKILL 269〜277 | `KEEP` | child側parent更新とstatus導出を維持 | 論点13 |
| S29 | scope外論点を履歴ごと削除せず取り下げる | SKILL 279〜285 | `ADAPT` | 新iterationへ理由を残し、現在の取下げ結果は`決定`へ示す | 既存能力保持、論点20 |
| S30 | chat上で先に合意した議論を再合意なしで再構成する | SKILL 287〜299 | `ADAPT` | 新骨子で確認できる変遷を保存し、固定next actionは要求しない | 論点1、20 |
| S31 | proposal保存またはdecision保存で一論点の処理を抜ける | SKILL 301〜310 | `ADAPT` | 判断可能なproposalと空feedback欄、またはdecision保存を完了条件にする | 論点8、19 |
| S32 | default next actionを全entryへ表示する | template 83〜84 | `RETIRE` | 通常のfeedback待ち、consumer反映、完了をentryへ反復しない | 論点20 |
| S33 | 非defaultな停止理由と再開位置を保持する | baselineでは固定next actionが代替 | `ADD` | 同じ未決decisionが外部event等で止まり、entryから推測不能な時だけ任意`再開条件`を置く | 論点20 |
| S34 | feedbackを別decisionへ分ける | SKILL 168〜181, 224〜234 | `KEEP` | iterationを増やさずtopic levelへ戻る | 論点13、17 |
| S35 | proposalの表示方法を固定しない | baselineにはなし | `ADD` | catalogを開始形として参照し、該当patternがなければ自由構成する | 論点10 |
| S36 | raw textでもflowを読めるようにする | baselineにはなし | `ADD` | 短いflowはtext図を第一選択にし、Mermaidはinline render可能な複雑caseだけ | 論点11 |
| S37 | 新規document作成前に完成像を判断する | baselineにはなし | `ADD` | 必要なtreeとannotated outlineへ合意後、実fileを作り実物reviewする | 論点14 |
| S38 | 既存fileの局所変更前に全差分を判断する | baselineにはなし | `ADD` | 全追加・削除行と位置contextを含む読みやすいunified diffを示す | 論点15 |
| S39 | 複数対象の不可分変更を閉じる | baselineにはなし | `ADD` | 対象、before→after対応、許可・維持・削除・scope外、完了をcaseに合う表示で閉じる | 論点18、20 |
| S40 | 一括proposalが独立decisionを含む時の表示 | baselineのrouting contractのみ | `ADAPT` | 同一entry内の枝ではなく連番child論点へ分解する | 論点13 |
| S41 | 起点原文からdecisionまで追跡可能にする | SKILL 327〜348 | `ADAPT` | 原文を固定fieldへ毎回強制せず、必要な入力・findingを提案背景へ残し、変遷をiterationで追跡可能にする | 論点4、8 |
| S42 | proposalの前案との差分を固定fieldで示す | SKILL 241, template 75 | `RETIRE` | feedbackと新proposalを読み比べられるようにし、差分説明が判断に必要な時だけ内容固有に示す | 論点4、8 |
| S43 | iterationと別のsnapshotや過去要約を作らない | baselineには明文化なし | `ADD` | 一つのentryへiterationを順に増やし、`ここまでの議論`を作らない | 論点4 |
| S44 | legacy entryを一括整形しない | SKILL 81, 133〜137 | `ADAPT` | 新規entryは新骨子、既存entryへの追記は兄弟iterationの深度へ合わせ、既存履歴を一括変換しない | 論点4イテレーション16 |

### 新規参照成果物

| ID | 追加するproduction file | 分類 | contract | 合意典拠 |
| --- | --- | --- | --- | --- |
| A01 | `templates/proposal-sections/README.md` | `ADD` | patternは排他的分類でなく、組み合わせ可能な開始形であることを案内 | 論点10 |
| A02 | `templates/proposal-sections/complete-state.md` | `ADD` | 完全状態そのものが判断対象の時に全体を直接示す | 論点10 |
| A03 | `templates/proposal-sections/compact-options.md` | `ADD` | 添字付きの軽い可変長選択肢を示す | 論点10 |
| A04 | `templates/proposal-sections/detailed-options.md` | `ADD` | 独立した本文を要する重い選択肢を示す | 論点10 |
| A05 | `templates/proposal-sections/process-flow.md` | `ADD` | 順序、分岐、戻り先、循環をraw textでも読める形で示す | 論点10、11 |
| A06 | `templates/proposal-sections/element-correspondence.md` | `ADD` | 少数要素を短い共通観点で照合する | 論点10 |
| A07 | `templates/proposal-sections/structure-tree.md` | `ADD` | 見出し、file、directory等の包含・配置を示す | 論点10 |
| A08 | `templates/proposal-sections/document-heading-outline.md` | `ADD` | 新規documentの見出し構造と各見出しの役割へ合意する | 論点10、14 |
| A09 | `templates/proposal-sections/existing-file-local-diff.md` | `ADD` | 既存fileの局所変更を完全diffで示す | 論点15 |
| A10 | `templates/proposal-sections/file-change-set.md` | `ADD` | 複数対象または不可分な複数hunkの変更集合を閉じる | 論点18、20 |

`agents/openai.yaml`は起動条件、表示名、default promptだけを表し、entry内部formatを規定していないため変更対象外とする。

### downstream整合

production反映後のrepository validationで、baseline外のconsumerとvalidatorが旧contractを参照していることを検出した。いずれも合意済みformatを変えずに一意に補正できるため、次の適用対象として分類する。

| ID | 対象 | 分類 | 補正内容 | 合意典拠 |
| --- | --- | --- | --- | --- |
| D01 | `plugins/tumeda-dev/skills/task-design/SKILL.md`のdiscussion返却contract | `ADAPT` | `decisionとネクストアクション`を、fileの固定fieldではなく`decisionと具体的なhandoff`として参照する | 論点20、S13、S26 |
| D02 | `scripts/verification/validate-plugin.mjs`のfacilitate-discussion assertion | `CHANGE` | 廃止fieldのpresence要求を、新iteration骨子、任意state、proposal pattern 10 fileのpresenceと旧field absenceへ置換する | 論点4、8〜20 |
| D03 | `scripts/verification/validate-plugin.mjs`のthink-through assertion | `CHANGE` | 旧S8見出しと文言を新S8へ同期し、新S9の反復帰納contractを検証する | 論点5、6 |

## 移行前completeness gate

| 確認 | 結果 |
| --- | --- |
| baseline sourceをrevisionから再現できる | 済 |
| baseline対象fileの全行がstructure ledgerに属する | `SKILL.md` 348 / 348行、template 84 / 84行 |
| baselineの意味単位がcontract ledgerに分類されている | 44件分類済み |
| `KEEP / MOVE / ADAPT`に具体的な行き先がある | 済 |
| `ADD / CHANGE / RETIRE`に合意典拠がある | 済 |
| 未review区間 | 0 |
| 未分類削除 | 0 |
| 未分類追加 | 0 |

## 移行後verification欄

### forward trace

| ledger ID | production evidence | 結果 |
| --- | --- | --- |
| S01〜S06 | `SKILL.md`の`起動gate`、`責務境界`、`入力`、`discussion fileを解決する` | 到達 |
| S07〜S13 | `全体の設計意図`、`workflow全体で守る不変条件`、workflow図、handoff手順 | 到達 |
| S14〜S16 | `論点levelで守る契約`、`対象論点を選ぶ`、`認識齟齬を原因ownerへ戻す` | 到達 |
| S17〜S23 | `新規論点を作るvariant`、`feedbackをiterationとして扱う`、`discussion_entry.md`のiteration骨子 | 到達 |
| S24〜S27 | `決定済み論点を再開するvariant`、`合意したdecisionを確定する`、templateの任意`仮決定`と`決定` | 到達 |
| S28〜S34 | reparent、取下げ、事後記録、完了gate、任意`再開条件` | 到達 |
| S35〜S40 | `proposal-sections/README.md`、各pattern、child分解contract | 到達 |
| S41〜S44 | 提案背景、事後reconstruction、履歴再要約禁止、legacy追記contract | 到達 |
| A01〜A10 | `templates/proposal-sections/`配下のREADMEと9 pattern file | 到達 |

### reverse trace

| production変更 | 逆引き先 |
| --- | --- |
| `SKILL.md`の目的、不変条件、新規論点、iteration、再開、decision、reparent、取下げ、reconstruction、handoffの変更 | S07〜S08、S13、S17、S20〜S31、S33、S40〜S44 |
| `templates/discussion_entry.md`の新骨子とhidden instruction | S07〜S09、S17〜S27、S32〜S44 |
| `templates/proposal-sections/`の新規10 file | A01〜A10、S35〜S39 |
| `agents/openai.yaml` | entry内部formatを規定しないため変更なし |

### completeness count

| 区分 | 件数 | 結果 |
| --- | ---: | --- |
| baseline由来の`KEEP` | 15 | trace済み |
| baseline由来の`ADAPT` | 10 | trace済み |
| 合意済み`CHANGE` | 7 | trace済み |
| 明示`RETIRE` | 4 | productionに正の生成指示なし |
| semantic `ADD` | 8 | trace済み |
| 新規参照成果物 | 10 file | A01〜A10と一致 |
| downstream補正 | 3 | D01〜D03と一致 |
| 未review区間 | 0 | 完了 |
| 未分類削除 | 0 | 完了 |
| 未分類追加 | 0 | 完了 |

### validation実績

- [x] forward trace: S01〜S44、A01〜A10がproductionの具体箇所へ到達する
- [x] reverse trace: productionの変更行と新規fileがledgerの分類へ逆引きできる
- [x] `SKILL.md`から廃止した可視fieldへの正の生成指示がなく、禁止説明としてだけ参照される
- [x] templateの見出し階層、feedback lifecycle、任意`仮決定`、任意`再開条件`、`決定`が合意形と一致する
- [x] proposal pattern 10 fileがproductionから参照でき、議論用prototypeと一致する
- [x] black-box fixtureで修正要求後のiteration追加、受諾後のdecision確定、外部event待ちの`再開条件`を再現した
- [x] `skill-creator`のquick validationが`Skill is valid!`で完了した
- [x] `git diff --check`が完了した
- [x] repository validatorを新contractへ同期し、`node scripts/verification/validate-plugin.mjs`が完了した
