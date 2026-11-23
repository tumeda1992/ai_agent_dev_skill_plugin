# Function migration ledger: tasklist lifecycleをtask-designへ移す

## 1. このledgerの役割

このledgerは、現在の変更後skillを正解として欠落を探すための表ではない。移行前sourceを正本とし、移行前に明示されていた構造とcontractの全量が、合意済み変更を除いて移行後のskill群へ到達したことを証明するために使う。

移行後の全contractは、次だけから構成する。

```text
移行後の全contract
= 移行前の全contract
+ 合意済みの追加・変更
- 合意済みの廃止
```

ownerや配置だけを変える場合は加減算を行わない。旧記述の判断条件、順序、禁止、例外、fallback、理由、具体例、失敗例、判断質問、強調の強さを維持したまま移動する。

### baseline

- Git revision: `d67763fede920b0a9c61028ff93b7dbf3b5fc460`
- `plugins/tumeda-dev/skills/steering/SKILL.md`
- `plugins/tumeda-dev/skills/steering/templates/tasklist.md`
- `plugins/tumeda-dev/skills/steering/templates/roadmap.md`
- `plugins/tumeda-dev/skills/steering/scripts/github/create_or_get_pr.sh`

### 合意済み変換仕様

- `design.md`のD1からD16
- `task-design-discussion.md`の確定済みdecision
- 失敗実装に対する旧Phase 6の粗粒度ledgerと検証結果は、移行完了の証拠として使わない

### 分類

- `KEEP`: 同じownerで全量維持する
- `MOVE`: ownerまたはfile配置だけを変えて全量維持する
- `ADD`: baselineにない能力を、ユーザーの明示指示または明示合意により追加する
- `CHANGE`: 合意済みdecisionに従いcontractを変更する
- `RETIRE`: 合意済みdecisionに従いcontractを廃止する
- `TBD`: 旧contractと合意済み新構造が競合する可能性があり、個別合意が必要

`既存記述に含まれる`、`趣旨は同じ`、`一般化した`は分類として認めない。移管先の具体的な節と維持した要素を示せない場合は未移植とする。

## 2. 構造ledger

構造ledgerは、章の存在だけでなく、章が担っていた目的、発動場面、内部順序、他章との関係を維持するための上位表である。

| ID | baseline | 構造上の役割 | 移行後owner | 分類・根拠 |
| --- | --- | --- | --- | --- |
| ST-S01 | steering 1-13 | steeringの起動契約、利用可能能力、入力 | steering | `CHANGE` D1・D4。plan作成skillからcaller兼roadmap orchestratorへ変わるが、起動条件と入力契約を失わない |
| ST-S02 | steering 14-16 | repository固有factの取得境界 | steering / task-design | `MOVE` D6。caller用factはsteering、設計・plan用factはtask-designへ分配する |
| ST-S03 | steering 20-28 | 完了状態、実装禁止、日本語、完全名、悪い例と良い例 | steering / task-design | `CHANGE` D1は完了状態だけ。言語・命名contractは`MOVE`で全量維持する |
| ST-S04 | steering 32-40 | stable basenameとcanonical steering pathのownership | steering | `KEEP` |
| ST-S05 | steering 44-53 | 成果物の役割分担と実装後feedbackから既存tasklistへ戻るlifecycle | steering / task-design | 配置を`CHANGE` D2。feedback件数triggerだけ`RETIRE` D10。既存tasklist継続とその理由は`KEEP` |
| ST-S06 | steering 57-80 | 随時discussionのtrigger、非委譲、owner境界、用途、investigationとの差 | steering | `KEEP`。task-design固有discussionはD1・D2により別途task-designへ持つ |
| ST-S07 | steering 84 | 実行順序が固定であること | steering / task-design | `CHANGE` D1。二skillへ分割後も前後関係を明示する |
| ST-S08 | steering 86-117 | directory作成後、前月summaryを単一writerで生成し、design作成前に止める | steering | summaryのroadmap対応だけ`CHANGE` D6。残りは`KEEP` |
| ST-S09 | steering 121-140 | design前の根拠収集、README-first、UI実測 | task-design | `MOVE` D1・D6 |
| ST-S10 | steering 144-157 | task-design起動、working directory、再開、成果物確認、discussion分離 | steering / task-design | directoryは`CHANGE` D2、完了resultは`CHANGE` D1、discussion分離は維持 |
| ST-S11 | steering 161-173 | design提示前gate、議論記録、自然言語review loop | task-design | ownerは`MOVE` D1。議論過程と確定設計の正本分離だけ`CHANGE` D11 |
| ST-S12 | steering 177-182 | requirements切り出し判断と二重正本防止 | task-design | `MOVE` D1 |
| ST-S13 | steering 186-264 | tasklist / roadmap / investigationの判定とtasklist詳細設計 | task-design | `CHANGE` D1・D3・D4。詳細規則は全量移管し、合意済みのplan modelだけ変更する |
| ST-S14 | steering 268-298 | tasklist提示前のゼロベース自己review | task-design/tasklist-design.md | `MOVE` D1・D3 |
| ST-S15 | steering 300-305 | tasklistの自然言語reviewと承認後gateへの遷移 | task-design / steering | plan reviewは`MOVE` D1、承認後gateはsteeringへ`KEEP` |
| ST-S16 | steering 309-356 | 実装前の必須振り返り、doc-enricher入力、discussion原因分析、skill自己確認 | steering | `KEEP`。planのowner変更で省略しない |
| ST-S17 | steering 359-369 | 型を守った即時改善提案と合意前変更禁止 | steering / task-design | `MOVE`。移行後に該当phaseを所有する双方から実行可能にする |
| ST-S18 | steering 373-386 | 全gate後の実装開始確認、停止、executor起動、即時checkbox更新 | steering / tasklist-executor | `MOVE` D1・D6。自動開始禁止はsteeringに残す |
| ST-S19 | steering 390-412 | 実装後reviewのtrigger、記録、routing、再設計、既存tasklist継続 | steering | root pathだけ`CHANGE` D2。残りは`KEEP` |
| ST-S20 | steering 417-421 | steering自身の無断実行、code変更、test/CI、自動遷移の絶対禁止 | steering | `KEEP` |
| TL-S01 | tasklist template 1-43 | 設計参照、全task完了、実装可能性、取消条件、分割、即時更新 | task-design template / tasklist-executor | pathだけ`CHANGE` D2。残りは`MOVE` D3・D6 |
| TL-S02 | tasklist template 45-73 | feature phaseとtask/subtask/detailの基本構造 | task-design template | `MOVE` D3 |
| TL-S03 | tasklist template 74-106 | 品質DoD、全test、file lint、全体lint、UI最終目視 | task-design template | `MOVE` D3 |
| TL-S04 | tasklist template 107-130 | 条件付きdocs更新、実装後振り返り、ユーザー動作確認、feedback記録 | task-design template / workflow owner | `MOVE` D3。feedbackの正本を`implementation_review.md`へ統一する部分だけ`CHANGE` D13 |
| TL-S05 | tasklist template 132-152 | 親roadmap更新、意味単位commit、条件付きpush/PR | task-design template / steering / tasklist-executor | 親roadmap更新だけ`CHANGE` D4・D6。commit・push・PRは`MOVE` D3 |
| RM-S01 | roadmap template 1-9 | 分割理由、独立子steering、各phase完了時の正常動作 | task-design roadmap template / roadmap-design.md | `CHANGE` D4で構造を拡張するが、正常動作条件は`MOVE` |
| RM-S02 | roadmap template 11-36 | phaseごとのDoD、scope概要、依存TBD、子path、status | task-design roadmap template / steering | 構造fieldと運用fieldへ`CHANGE` D4 |
| RM-S03 | roadmap template 38-44 | 全phase完了日と計画・実績差分 | なし | `RETIRE` D15。全体完了はphase status・完了日から導出し、意味ある逸脱は`implementation_review.md`へ記録する。旧steeringに更新規則がなく、比較baselineも定義されていないためfieldを維持しない |
| PR-S01 | PR helper 1-98 | 既存PR再利用、default branch、branch/issue契約、title/body導出、PR作成 | tasklist-executor script | 内容を変えない`MOVE` D6 |

### 合意済み追加contract

Git追加行と移行後全contractを逆引きし、baseline contractの移管・適応ではない純粋な追加を次へ分離した。各追加は合意済みdecisionへ接続し、既存contractの`CHANGE`へ隠さない。

| ID | 追加能力 | 移行後owner | 分類・合意根拠 |
| --- | --- | --- | --- |
| ADD-C001 | standalone task-designがdefaultで`name-work-directory`を使い、自身の新しいworking directoryを作る | task-design | `ADD` D2。ユーザーの明示提案と合意 |
| ADD-C002 | stable phase identity、構造fieldと運用field、strictly narrowerなnested roadmap、dependency resultsによる再帰orchestration | task-design / steering | `ADD` D4。model Cの議論と合意 |
| ADD-C003 | standaloneの`roadmap_ready` bundleを明示承認後だけcanonical steering nodeへ昇格する | steering | `ADD` D5。昇格方法の提案と合意 |
| ADD-C004 | function migration共通規範、二層ledger、未分類追加・削除の逆引き、white-box完了gate | common standard / maintenance-plugin-context | `ADD` D16。ユーザーの明示指示と合意 |

### Git追加hunkの逆引き索引

次の索引は、baselineからcurrent worktreeへの`git diff --unified=0`に追加行を持つ既存fileと、全行が追加となる新規fileを全件列挙する。各pathの追加hunkは、右欄の旧contractまたは合意済み`ADD`へ接続する。`.steering`配下のdesign・discussion・tasklist・review・ledgerはmigrationを実行・証明する作業成果物であり、配布skillへ追加されるruntime contractではないため、D1-D16の合意・監査evidenceとして分離する。

| 追加先 | 追加hunk / 新規範囲の逆引き |
| --- | --- |
| `skills/README.md` | D6。変更後owner説明の索引で、`ST-C004`、`ST-C020`、`ST-C026`、`ST-C047`を要約する |
| `maintenance-plugin-context/SKILL.md` | D6のcontext owner移管は`ST-C003`、`ST-C031`、`ST-C037`。共通migration規範への導線は`ADD-C004` |
| `maintenance-plugin-context/maintenance_policies/migration.md` | `ADD-C004`。plugin固有の機密性・汎用化規約へ共通意味保存gateを接続する |
| `steering/SKILL.md`の全追加hunk | `ST-C001`から`ST-C051`のうちsteering destinationを持つ行、D1-D15による`CHANGE | RETIRE`、`ADD-C002`、`ADD-C003` |
| `task-design/SKILL.md`の全追加hunk | `ST-C003`、`ST-C004`、`ST-C005`、`ST-C007`、`ST-C009`から`ST-C035`のうちtask-design destinationを持つ行、`ST-C045`、D1-D14、`ADD-C001`、`ADD-C002` |
| `task-design/templates/design.md` | `ST-C021`、`ST-C023`、D2、D4、D11、`ADD-C002` |
| `task-design/tasklist-design.md` 1-141 | `ST-C028`から`ST-C041`、D1-D3、D9、D12-D14 |
| `task-design/roadmap-design.md` 1-93 | `ST-C026`、`ST-C034`、`RM-C001`から`RM-C004`、D1、D4、D9、D15、`ADD-C002` |
| `task-design/templates/tasklist.md` 1-188 | `TL-C001`から`TL-C013`、D2-D4、D6、D12-D14 |
| `task-design/templates/roadmap.md` 1-101 | `RM-C001`から`RM-C004`、D3、D4、D9、D15、`ADD-C002` |
| `tasklist-executor/SKILL.md`の全追加hunk | `ST-C047`、`TL-C002`から`TL-C004`、`TL-C011`、`TL-C013`、D4、D6 |
| `tasklist-executor/scripts/github/create_or_get_pr.sh` 1-98 | `PR-C001`。baseline helperとbyte一致する`MOVE` |
| `tumeda-dev-plugin-context.md`の全追加hunk | `ST-C003`、`ST-C031`、`ST-C037`、D6、D14 |
| `scripts/verification/validate-plugin.mjs`の全追加hunk | D6の新owner・path・禁止条件と、`ADD-C004`の存在・anchor検証 |
| `docs/common_standard/function_migration_policy.md` 1-235 | `ADD-C004` |
| `.steering/.../design.md` | D1-D16の合意済み設計evidence。配布runtime contractではない |
| `.steering/.../task-design-discussion.md` | D1-D6等へ至るdiscussion履歴evidence。配布runtime contractではない |
| `.steering/.../tasklist.md` | 合意済み実行計画と実測checkbox evidence。配布runtime contractではない |
| `.steering/.../implementation_review.md` | 移行失敗、原因、修復、scenario結果のevidence。配布runtime contractではない |
| `.steering/.../function-migration-ledger.md` | 構造・contract・追加hunkのwhite-box evidence自体。配布runtime contractではない |

この索引にない追加pathまたは追加hunkが生じた場合、対応する旧contractまたは合意済み`ADD`を追記してからでなければ`未分類追加 0`を維持できない。

## 3. contract ledger

### 3.1 steering本体

| ID | baseline | 維持対象 | 移管先 | 分類・合意根拠 | 現実装監査 |
| --- | --- | --- | --- | --- | --- |
| ST-C001 | 1-7 | frontmatter、Sonnet、高effort、必要tools | steering | `CHANGE` D4。roadmap child dispatchに必要な能力だけ追加可能 | §5参照 |
| ST-C002 | 11-13 | ユーザーの「やりたいこと」を入力とする | steering | `KEEP` | §5参照 |
| ST-C003 | 14-16 | context brokerを使い、返却範囲だけを読み、固定path・command・remoteを推測しない | steering / task-design | `MOVE` D6 | §5参照 |
| ST-C004 | 20-22 | plan合意までを完了とし、それ以前に実装しない | task-design / steering | plan種別だけ`CHANGE` D1。実装禁止は維持 | §5参照 |
| ST-C005 | 24-28 | 日本語、全成果物で全domain名を略さない、内部頭字語禁止、悪い例・良い例、reading costの理由 | steering / task-design / plan files | `MOVE`。`曖昧な略称だけ禁止`への弱体化は禁止 | §5参照 |
| ST-C006 | 32-40 | name-work-directory、local date、stable basename、canonical path、親directory・summary owner、branch情報を混ぜない | steering | `KEEP` | §5参照 |
| ST-C007 | 44-50 | design、requirements、tasklist、discussion、implementation_reviewの役割と実装前後の分離 | steering / task-design | pathと排他的planだけ`CHANGE` D1・D2 | §5参照 |
| ST-C008 | 51-53 | 複数feedbackで新steeringを起動し、追加taskは既存tasklistへ追記し、feature完成までtasklistが生きる理由 | steering | 件数triggerだけ`RETIRE` D10。既存tasklistへの追記とfeature完成まで生きる理由は`KEEP`。旧triggerは非規範的なlegacy memoだけ残す | §5参照 |
| ST-C009 | 57-61 | discussionはphase非依存で随時追記し、user提起または複数往復decisionで開始する | steering | `KEEP` | §5参照 |
| ST-C010 | 61-69 | steeringがdirectory・trigger・context・phase制御・終了を持ち、自身がfacilitate-discussionを適用し、childへ議論だけを再委譲しない | steering | `KEEP` | §5参照 |
| ST-C011 | 69-80 | file内部processはfacilitate-discussionを正本とし、決定後の戻り先、3用途、investigationとの差、process重複禁止を維持 | steering | `KEEP` | §5参照 |
| ST-C012 | 84 | flow順序固定 | steering / task-design | `CHANGE` D1。分割後のglobal orderingとして再定義 | §5参照 |
| ST-C013 | 86-94 | directory作成後、前月directoryがありsummary未存在の場合だけ生成し、既存summaryを変更しない | steering | `KEEP` | §5参照 |
| ST-C014 | 95-98 | 各root列挙、design fallback、TL;DR→目的→固定fallback、複数候補は推測禁止、tasklist checkbox status | steering | roadmap status追加だけ`CHANGE` D6 | §5参照 |
| ST-C015 | 99-115 | summary exact format、field限定、詳細参照先、翌月初single writer、並行conflict回避理由 | steering | `KEEP` | §5参照 |
| ST-C016 | 117 | directory・summary完了時点でdesign/tasklistをまだ作らない | steering | `KEEP` | §5参照 |
| ST-C017 | 121-129 | context取得後、許可文書と類似実装から機能・命名・例外・test・責務境界を調査 | task-design | `MOVE` D1・D6 | §5参照 |
| ST-C018 | 130-135 | GraphQL mutation / CommandはREADME-first、resolver fallback、aggregateとlayerの結合を確認、発見知識を即永続化する理由 | task-design | README-first、resolver fallback、確認観点、即時起動、context節約理由は`MOVE`。無条件書込みだけ`CHANGE` D12とし、即時提案後のユーザー承認時だけ適用する | §5参照 |
| ST-C019 | 136-140 | UI taskはvisual-inspector childで実測し、推測を事実にせず、具体例を維持し、Playwright直接利用を禁止 | task-design | `MOVE` D1・D6 | §5参照 |
| ST-C020 | 144-154 | task-design起動、要件受渡し、再開、成果物存在確認 | steering / task-design | directoryは`CHANGE` D2、ready resultは`CHANGE` D1 | §5参照 |
| ST-C021 | 156-157 | task-design discussionとsteering discussionを別file・別用途にする | steering / task-design | `KEEP` D2 | §5参照 |
| ST-C022 | 161-164 | design review前にTBDをゼロにし、要議論をchatで確定し、確定分類だけをdesignへ反映する | task-design | `MOVE` D1 | §5参照 |
| ST-C023 | 165-169 | designへ事前設計議論メモを保存し、論点・選択肢・決定理由を実装者が遡れるようにする | task-design | `CHANGE` D11。議論過程は`task-design-discussion.md`、確定設計と必要十分な棄却理由は`design.md`を正本とし、旧章の二重保存は廃止する | §5参照 |
| ST-C024 | 170-173 | 要点提示、自然言語ok、修正loop、承認keyword強制禁止 | task-design | `MOVE` D1 | §5参照 |
| ST-C025 | 177-182 | Requirementsが長くreview性が上がる時だけ切り出し、design側はlink、短ければ残す | task-design | `MOVE` D1 | §5参照 |
| ST-C026 | 186-202 | plan前判定、MVP/variant/phase数基準、roadmap file名、子steering、summaryとの分離 | task-design / steering | plan判定と構造は`CHANGE` D1・D4、summary分離は`KEEP` | §5参照 |
| ST-C027 | 203-207 | 方針が調査依存なら目的・方針を合意後にinvestigationし、結果確定後にtasklistを作る | task-design | `MOVE` D1 | §5参照 |
| ST-C028 | 209-216 | design参照、template使用、詳細task、migration単独phase、migration後停止・user確認、理由 | tasklist-design.md / tasklist template | pathだけ`CHANGE` D2、残り`MOVE` D3 | §5参照 |
| ST-C029 | 217-231 | incrementalな操作単位phase、layer横切り禁止、具体DoD、悪い例・良い例、まとめすぎの3 signal | tasklist-design.md | `MOVE` D3 | §5参照 |
| ST-C030 | 232-243 | 着手可能粒度、依存、DoD、各phase内のtest作成・変更、必須3ケース、既存testだけでは不足、test困難理由 | tasklist-design.md / template | `MOVE` D3 | §5参照 |
| ST-C031 | 244-247 | repository全体のlint・format・静的解析と既存影響確認、その理由 | tasklist-design.md / template | `MOVE` D3 | §5参照 |
| ST-C032 | 248-261 | UI変更phaseごとのvisual確認、最終再確認、visual-inspector、直接Playwright禁止、確認例、広いUI判定、refactor risk理由 | tasklist-design.md / template | `MOVE` D3 | §5参照 |
| ST-C033 | 262 | tasklist作成途中の不確実事項をTBDとし前提・調査項目を書く | task-design | `CHANGE` D9。作成途中だけTBDを許し、`tasklist_ready`前に全件解消する | §5参照 |
| ST-C034 | 263-264 | 大きすぎるtaskはこのsteeringで分解まで行い、詳細を別steeringへ渡すことと過去例 | task-design roadmap | `CHANGE` D4。過去例を削るかは未合意なので維持対象 | §5参照 |
| ST-C035 | 268-277 | zero-base review、単一操作、外部service分離、検証手段境界、同一endpoint内部branchの分割条件・失敗例 | tasklist-design.md | `MOVE` D3 | §5参照 |
| ST-C036 | 278-284 | 全phase DoD、test作成、phase内UI確認、横切り禁止、commit前user確認、自動確認との違いと失敗例 | tasklist-design.md | `MOVE` D3 | §5参照 |
| ST-C037 | 285 | GitHub contextがある時だけcurrent branch pushとhelperを計画し、ない時はcommit・push・PRを入れない | tasklist-design.md / tasklist template | `CHANGE` D14。local commitはlocal Git運用条件またはユーザー明示指示、push・PRはGitHub公開条件で別々に判定する。contextのないactionは生成しない | §5参照 |
| ST-C038 | 286-288 | 設計前に確立したdocsはPhase 1、判断質問、最後へ回す失敗例 | tasklist-design.md | `MOVE` D3 | §5参照 |
| ST-C039 | 289-293 | deliverable DoDは完成状態、抽象DoDならdesignへ戻る、悪い例・良い例 | tasklist-design.md | `MOVE` D3 | §5参照 |
| ST-C040 | 294-298 | 一件でも違反すれば修正し、だいたいで通さず、複数endpoint/component混在を特に厳しく見る | tasklist-design.md | `MOVE` D3 | §5参照 |
| ST-C041 | 300-305 | plan要点提示、自然言語review、修正loop、ok直後にpost-plan gateを飛ばさない警告と失敗例 | task-design / steering | plan reviewは`MOVE` D1、post-plan順序は`KEEP` | §5参照 |
| ST-C042 | 309-324 | plan承認後・実装前の必須gate、doc-enricher proposal、対象directory・関連file・steering path、自然言語承認/拒否 | steering | `KEEP` | §5参照 |
| ST-C043 | 326-350 | discussionごとに根本原因→code可視性/設計意図/process→配置の順で判断し、失敗例を維持し、その場で承認後適用、tasklistへ先送り禁止 | steering | `KEEP` | §5参照 |
| ST-C044 | 352-355 | steering skill自身の変更必要性を確認し、不要なら変更禁止 | steering | `KEEP` | §5参照 |
| ST-C045 | 359-369 | skill改善insightはstep 9を待たず提案し、変更は合意後、型の精神を守り、命令無視・改悪を禁止 | steering / task-design | `MOVE`。双方の該当phaseで機能させる | §5参照 |
| ST-C046 | 373-383 | step 1-9完了前は実装提案・催促禁止、step 8直後質問禁止、user確認で拒否なら終了 | steering | `KEEP` | §5参照 |
| ST-C047 | 384-386 | executorへtasklistとdesignの絶対pathを渡し、task/subtaskごとに即時checkbox更新、最後の一括更新禁止 | steering / tasklist-executor | sibling designへ`CHANGE` D2・D6、更新timingは`MOVE` | §5参照 |
| ST-C048 | 390-401 | 実装後user feedbackでfacilitate-discussionを自身が適用し、原文と実装/design/tasklist contextを渡し、内部processを委ねる | steering | pathだけ`CHANGE` D2、残り`KEEP` | §5参照 |
| ST-C049 | 403-412 | 認識合わせ、design再設計、design合意後task追加、consumer成果物へのrouting、設計前task禁止、自動再開禁止、修正済みでも完全記録、正本複製禁止 | steering | `KEEP`。roadmap運用routingだけD4で追加 | §5参照 |
| ST-C050 | 412 | feedback件数によるsteering分割と既存tasklist追記規則を維持する | steering | 件数によるsteering分割は`RETIRE` D10。既存tasklist追記はST-C008として`KEEP`。旧分割規則は非規範的なlegacy memoだけ残す | §5参照 |
| ST-C051 | 417-421 | 無断tasklist実行、code変更、test/CI、自動次工程を絶対禁止 | steering | `KEEP` | §5参照 |

### 3.2 tasklist template

| ID | baseline | 維持対象 | 移管先 | 分類・合意根拠 | 現実装監査 |
| --- | --- | --- | --- | --- | --- |
| TL-C001 | 1-6 | titleとdesignへの一意な相対参照 | task-design template | pathを`./design.md`へ`CHANGE` D2 | §5参照 |
| TL-C002 | 7-21 | 全task完了、時間・複雑さによる先送り禁止、未完了終了禁止、実装可能taskだけ、将来・検討task禁止 | template / executor | `MOVE` D3・D6 | §5参照 |
| TL-C003 | 22-31 | 取消を方針・architecture・依存変更に限定し、具体理由を取消線形式で残す | template / executor | `MOVE` D3・D6 | §5参照 |
| TL-C004 | 33-41 | 大taskはsubtaskへ分割し、task/subtask/phase完了ごとに即時更新し、最後の一括更新を禁止 | template / executor | `MOVE` D3・D6 | §5参照 |
| TL-C005 | 45-73 | phase、task、subtask、詳細説明の階層 | task-design template | `MOVE` D3 | §5参照 |
| TL-C006 | 74-83 | quality DoD、全test、全体lint、UI最終確認とphase内確認を代替しない警告 | task-design template | `MOVE` D3 | §5参照 |
| TL-C007 | 85-106 | test、new file lint、context条件付き全体lint、visual-inspector、直接Playwright禁止、問題修正再確認 | task-design template | `MOVE` D3 | §5参照 |
| TL-C008 | 107-115 | doc-enricherは必要時だけ、FB・実装ずれの3問振り返り、合意後反映 | template / steering | `MOVE` D3 | §5参照 |
| TL-C009 | 119-129 | user実操作をDoDとし、user確認を依頼し、feedbackをimplementation_reviewへ記録、feedbackなし取消形式 | template / steering | `MOVE` D3 | §5参照 |
| TL-C010 | 110-115 | 実装後振り返りの保存先をdiscussion.mdとする記述 | template / workflow owner | `CHANGE` D13。実装後feedbackは発生源によらず`implementation_review.md`へ統一し、三つの再発防止質問は各feedbackへ維持する。`discussion.md`はsteering固有判断へ限定する | §5参照 |
| TL-C011 | 132-138 | user確認前commit催促禁止、親roadmap status更新、summary手動更新禁止 | steering / template | 親roadmap writerだけ`CHANGE` D4・D6、残り`MOVE` | §5参照 |
| TL-C012 | 140-147 | phase単位かつ意味単位commit、部分承認範囲だけ、不要時の取消形式 | task-design template / executor | 内部contractは`MOVE` D3。commit sectionの生成条件だけ`CHANGE` D14とし、local Git運用条件またはユーザー明示指示がある場合に限定する | §5参照 |
| TL-C013 | 149-152 | GitHub contextとcommitがある時だけpush/PR、催促禁止、exact command、helper path | task-design template / executor | helper pathだけ`CHANGE` D6、残り`MOVE` | §5参照 |

### 3.3 roadmap template

| ID | baseline | 維持対象 | 移管先 | 分類・合意根拠 | 現実装監査 |
| --- | --- | --- | --- | --- | --- |
| RM-C001 | 1-7 | 全体概要、分割理由、各phaseを独立steeringで実装、各phase完了時にappを正常動作させる | roadmap-design.md / roadmap template | ownerと構造は`CHANGE` D4。正常動作条件は`MOVE` | §5参照 |
| RM-C002 | 11-20 | phase name、DoD、task scope、子steering path、status | roadmap template / steering | 構造/運用fieldへ`CHANGE` D4 | §5参照 |
| RM-C003 | 24-34 | 後続phaseも同じfieldを持ち、前phase依存で決まる内容と必要な依存結果を明記する | roadmap template / task-design | `CHANGE` D9。親roadmapの構造TBDにはせず、子task-designへ渡す依存結果と解消制約として表す | §5参照 |
| RM-C004 | 38-44 | 全phase完了日と計画・実績差分を振り返る | なし | `RETIRE` D15。全体完了はphase status・完了日から導出し、意味ある逸脱は`implementation_review.md`へ記録する。旧steeringに更新規則がなく、比較baselineも定義されていないためfieldを維持しない | §5参照 |

### 3.4 PR helper

| ID | baseline | 維持対象 | 移管先 | 分類・合意根拠 | 現実装監査 |
| --- | --- | --- | --- | --- | --- |
| PR-C001 | 1-98 | script全byte。usage、error handling、branch/default branch、open PR reuse、branch/issue contract、title/body fallback、gh pr create | tasklist-executor script | 内容を変えない`MOVE` D6 | `cmp`一致を確認済み |

## 4. 個別合意が必要な競合

| 競合ID | 関連contract | 競合 | default |
| --- | --- | --- | --- |
| CF-01 | ST-C023 | 旧contractはdesign内の`事前設計議論メモ`へ論点・選択肢・決定理由を保存する。現在のtask-design思想はdesignを決定結果だけにし、議論履歴をtask-design-discussionへ分離する | **解決済み（D11）:** 議論過程は`task-design-discussion.md`、確定設計と必要十分な棄却理由は`design.md`を正本とする。旧章の二重保存を廃止するが、揮発防止と実装者の理由追跡という目的は分担して維持する |
| CF-02 | ST-C018 | 旧contractはcode readingで得た知識をdoc-enricherで即READMEへ反映する。pluginのdoc-enricherはproposalとuser承認を要求する | **解決済み（D12）:** contextが熱いうちの即時起動・即時提案は維持し、書込みだけをユーザー承認後へ変更する。承認判断を後工程へ先送りしない。新規documentの提案可否は論点3へ留保する |
| CF-03 | ST-C033 | 旧tasklist設計は不確実事項をTBDとして残せる。合意済みD1はready resultに未解消TBDを許さない | **解決済み（D9）:** 作成途中だけTBDを許し、`tasklist_ready`前にゼロにする |
| CF-04 | TL-C010 / TL-C009 | 旧template内で実装後振り返りを`discussion.md`、user feedbackを`implementation_review.md`へ書く記述が併存するが、発生源以外の意味的な分水嶺がない | **解決済み（D13）:** すべての実装後feedbackを同じworking directoryの`implementation_review.md`へ統一する。直接受領したworkflow ownerが記録し、decisionをcallerへ返す。三つの再発防止質問は維持し、`discussion.md`はsteering固有判断へ限定する |
| CF-05 | RM-C003 | 旧roadmapは依存結果で決まる内容をTBDとして許す。D4ではruntime未割当と構造上の未解消TBDを分ける | **解決済み（D9）:** 親roadmapの構造TBDにせず、子task-designへ渡す依存結果と解消制約として表す。runtimeの未割当・未着手は許す |
| CF-06 | ST-C008 / ST-C050 | 旧contractは複数の実装後feedbackが揃ったら新しいsteeringを起動する。feedback件数はscope分割の根拠にならず、同一featureのsteeringを過剰に増やす | **解決済み（D10）:** 件数triggerを廃止する。同一featureは既存tasklistを継続し、別steeringの要否は意味的なleaf / composite判定またはユーザーの明示判断で決める。旧規則は非規範的なlegacy memoだけ残す |
| CF-07 | ST-C037 / TL-C012 | 旧steering自己reviewはGitHub contextがない場合にcommit・push・PRをすべてtasklistへ入れないが、旧templateはcommitを常設しpush/PRだけをGitHub条件にする | **解決済み（D14）:** local commitはlocal Git運用条件またはユーザー明示指示、push・PRはGitHub公開条件で別々に判定する。plan合意時点で適用できないactionはtasklistへ生成しない。commitの粒度・部分承認・取消contractは維持する |
| CF-08 | RM-C004 | 旧roadmapは全phase完了日と計画・実績差分を持つ。D4はsteeringが更新できる運用fieldを子path・status・完了日だけに限定する | **解決済み（D15）:** 両fieldを明示廃止する。全体完了はphase status・完了日から導出し、意味ある逸脱は`implementation_review.md`へ記録する。旧steeringに更新規則がなく、再承認され得るroadmapには比較baselineも定義されていないため、形だけのfieldを残さない |

## 5. white-box監査

以下の「初回監査」は、失敗実装を移行完了としない判断へ至った履歴であり、現在の適合判定ではない。最終判定は末尾の「source-first再構築後の最終監査」を正本とする。

### 一致

次は、合意済みowner変更またはpath変更を含め、移行後の合算から対応箇所と必要なcontractを確認できた。

- steering: `ST-C001`、`ST-C002`、`ST-C003`、`ST-C004`、`ST-C006`、`ST-C007`、`ST-C013`、`ST-C017`、`ST-C020`、`ST-C021`、`ST-C025`、`ST-C026`、`ST-C027`、`ST-C028`、`ST-C030`、`ST-C031`、`ST-C037`、`ST-C039`、`ST-C046`、`ST-C047`、`ST-C048`、`ST-C049`
- tasklist template: `TL-C001`、`TL-C002`、`TL-C003`、`TL-C004`、`TL-C009`、`TL-C011`、`TL-C012`、`TL-C013`
- roadmap template: `RM-C002`
- PR helper: `PR-C001`。移動前後のscriptは`cmp`で一致した

### 部分一致

部分一致は移植完了ではない。現在の短い記述を残して一文だけ足すのではなく、baseline blockの構造と全要素を移管先で再構築する。

| contract | 現在残っているもの | 欠落・弱体化 |
| --- | --- | --- |
| ST-C005 | 日本語contractと完全名の要求 | `全domain固有名詞`から`曖昧な略称`へ弱体化し、内部頭字語禁止、悪い例・良い例、reading cost理由が欠落 |
| ST-C008 | 同featureの追加taskを既存tasklistへ戻す | tasklistがfeature完成まで生きる理由が欠落。複数feedback時の新steeringはD10で明示廃止し、非規範的なlegacy memoだけを復元する |
| ST-C009 | steering固有discussionの任意利用 | user提起または複数往復decisionという明示triggerが欠落 |
| ST-C010 | steering自身がfacilitate-discussionを適用 | 議論だけを別childへ再委譲しない禁止が欠落 |
| ST-C011 | discussion用途、investigationとの差、内部process委譲 | 通常discussion決定後にdesign・plan・調査・文書reviewへ戻す一般routingが弱い |
| ST-C012 | skill内の局所的な手順 | 二skillへ分割後のglobalな順序固定と、ownerを跨ぐ停止条件が明示されていない |
| ST-C014 | TL;DR→目的→抽出不可、tasklist/roadmap status | exact fallback `{slug}（概要抽出不可、design.md 参照）`が欠落 |
| ST-C015 | summary format、field限定、翌月single writer | 並行作業時のconflictを避けるという理由が欠落 |
| ST-C016 | directory準備後にtask-designを起動する順序 | `この時点ではdesign/planを作らない`という停止条件が明示されていない |
| ST-C018 | README-firstとresolver fallback | context消費を防ぐ理由と即時起動・即時提案が欠落。無条件書込みはD12で承認後適用へ明示変更する |
| ST-C019 | visual-inspector実測、推測禁止、直接Playwright禁止 | header固定、scroll、layout崩れという実測例が欠落 |
| ST-C022 | TBD解消と未決提案をdesignへ入れないgate | `MUST/SHOULD/MAYまたは非目標`という確定分類が欠落 |
| ST-C024 | 自然言語で合意するflow | 承認keyword強制禁止が明示されていない |
| ST-C029 | incremental操作単位、layer横切り禁止、分割例 | DoD項目過多による原因特定困難、test/screenshot context混在、CRUDの悪いDoD、API・画面の良いDoDが欠落 |
| ST-C032 | UI判定範囲、phase内と最終のvisual確認、直接Playwright禁止 | color bar・layout・today highlight・responsiveの確認例と、refactorにも表示崩れriskがある理由が欠落 |
| ST-C034 | large scopeをroadmapへ変えるcontract | 過去実績の具体例が無合意で削除されている |
| ST-C035 | operation/service/検証手段/branchでの分割観点 | branchごとの修正対象・patternを見る判断基準と、同一endpointへ集約する失敗例が薄い |
| ST-C036 | DoD、test、UI、横切り、user confirmationのreview | 自動testとscreenshotをuser確認の代替にする失敗例が薄い |
| ST-C038 | 既知docsの早期配置と判断質問 | docsを最後へ回すと設計前知識と実装後知識を混同する失敗例が欠落 |
| ST-C040 | 一件でも不合格なら修正するgate | 複数endpoint・component変更の同一phase混在を特に厳しく見る警告が欠落 |
| ST-C041 | plan review後にsteering gateがある | `ok`の勢いでgateを飛ばす失敗例と明示警告が欠落 |
| ST-C042 | doc-enricher proposalとuser approval | 対象directory、調査で読んだ関連file、steering pathという必須入力が欠落 |
| ST-C043 | 根本原因→知識種別→配置の3問 | 各discussion単位、結論を原因と誤認する失敗例、その場で反映してtasklistへ先送りしない規則が薄い |
| ST-C045 | task-design内にhot contextの即時永続化が一部存在 | steeringを含む全実行中の即時提案、型を守る条件、命令無視・改悪禁止が全量移管されていない |
| TL-C005 | 一つのphase、task、subtaskのplaceholder | 複数phaseの基本形と各task詳細の階層が削除され、template構造を全量維持していない |
| TL-C006 | 全体test/lint/UI最終確認 | phase内UI確認を最終確認で代替しない警告と、旧DoDの具体性が薄い |
| TL-C007 | 全体test・lint・UI task | new file lint、error修正・再実行・zero確認のsubtask構造が欠落 |
| TL-C008 | doc-enricherとimplementation_review | 実装後振り返りの3問と、合意後反映の具体contractがtemplateから欠落 |
| RM-C001 | 全体目的と複数子scopeへの分割理由 | 各phase完了時点でappを正常動作させる条件が欠落 |

### 欠落

| contract | 欠落内容 | default repair |
| --- | --- | --- |
| ST-C044 | steering skill自身をreviewし、不要なら変更を禁止するstepがない | 旧blockをplan合意後gateへ復元する |
| ST-C050 | feedback件数によるsteering分割規則がない | D10による意図的廃止。起動規則としては復元せず、旧方針だったことを示す非規範的なlegacy memoだけを置く |
| ST-C051 | steering自身はcode変更とtest/CIを実行せず、自動次工程へ進まない絶対禁止が弱い | executorをorchestrateすることとsteering自身が実行することを分けて旧禁止を復元する |
| RM-C004 | 全phase完了日と計画・実績差分が移管先にない | D15による意図的廃止。全体完了はphase status・完了日、意味ある逸脱は`implementation_review.md`で扱う |

### 競合のため未判定

なし。

### 解決済み競合

- `ST-C033` → CF-03、D9
- `RM-C003` → CF-05、D9
- `ST-C008`、`ST-C050` → CF-06、D10
- `ST-C023` → CF-01、D11
- `ST-C018` → CF-02、D12
- `TL-C010`、`TL-C009` → CF-04、D13
- `ST-C037`、`TL-C012` → CF-07、D14
- `RM-C004` → CF-08、D15

### source-first再構築後の最終監査

移行前baselineの69 contractを一件ずつ、新ownerの具体的なsectionまたは合意済み廃止decisionへ逆引きした。`適合`は、旧contractの前提、action、禁止、例外、fallback、理由、具体例、失敗例、判断質問、強調を移管先で通読した結果である。単語の存在、validator、line数だけでは判定していない。

| contract | 移行後の具体的な証跡 | 判定 |
| --- | --- | --- |
| ST-C001 | `steering/SKILL.md` frontmatter、`役割とゴール` | 適合。Sonnet、高effort、必要toolsを維持し、roadmap child dispatch用の`Agent`だけ追加 |
| ST-C002 | `steering/SKILL.md` `入力` | 適合。ユーザーが達成したいことを起点として維持 |
| ST-C003 | `steering/SKILL.md` `repository固有文脈`、`task-design/SKILL.md` §1・Step 0.75 | 適合。context broker、返却範囲限定、固定path・command・remote推測禁止を両ownerへ分配 |
| ST-C004 | `steering/SKILL.md` `役割とゴール`・Step 3-6、`task-design/SKILL.md` Step 6 | 適合。排他的plan合意と全gate前の実装禁止を維持 |
| ST-C005 | `steering/SKILL.md` `記述規則`、`task-design/SKILL.md` §1 | 適合。日本語、全成果物の完全名、内部頭字語禁止、悪い例・良い例、reading cost理由を復元 |
| ST-C006 | `steering/SKILL.md` `命名規則とcanonical directory` | 適合。name-work-directory、local date、stable basename、canonical path、親directory・summary owner、branch情報非混入を維持 |
| ST-C007 | `steering/SKILL.md` `成果物のlifecycle`、`task-design/SKILL.md` §4 | 適合。D1・D2のroot配置と排他的planだけ適応し、各成果物の役割を維持 |
| ST-C008 | `steering/SKILL.md` `成果物のlifecycle`・`非規範的なlegacy memo` | 適合。件数triggerはD10で廃止し、既存tasklist継続と理由を維持 |
| ST-C009 | `steering/SKILL.md` `discussion.mdの使い方（随時）` | 適合。phase非依存、user提起・複数往復decisionのtriggerを維持 |
| ST-C010 | 同section | 適合。directory、trigger、context、phase制御、終了のownerと、steering自身の適用、議論だけの再委譲禁止を維持 |
| ST-C011 | 同section | 適合。facilitate-discussionの内部process ownership、三用途、investigationとの差、決定後routingを維持 |
| ST-C012 | `steering/SKILL.md` `Flow（順序固定）` Step 1-6、`task-design/SKILL.md` Step 0-6 | 適合。二skillを跨ぐglobal orderingと停止条件へ適応 |
| ST-C013 | `steering/SKILL.md` Step 1 | 適合。前月directory存在・summary未存在時だけ生成し、既存summaryを変更しない |
| ST-C014 | `steering/SKILL.md` Step 1 | 適合。root列挙、旧形式の一意fallback、TL;DR→目的→exact fallback、複数候補推測禁止、tasklist・roadmap status判定を維持・追加 |
| ST-C015 | `steering/SKILL.md` Step 1のsummary formatと説明 | 適合。exact format、field限定、詳細参照先、翌月single writer、parallel conflict回避理由を維持 |
| ST-C016 | `steering/SKILL.md` Step 1末尾 | 適合。directory・summary時点でdesign・planを作らない停止条件を維持 |
| ST-C017 | `task-design/SKILL.md` Step 0.75 | 適合。許可文書、類似機能、命名、例外、test、layer・責務境界の調査を全量移管 |
| ST-C018 | 同Step 0.75 | 適合。README-first、resolver fallback、aggregate・layer観点、context節約理由、即時doc-enricherを維持。書込みだけD12で承認後へ変更 |
| ST-C019 | 同Step 0.75 | 適合。visual-inspector child、実測事実、header・scroll・layout例、直接Playwright禁止を維持 |
| ST-C020 | `steering/SKILL.md` Step 2-3、`task-design/SKILL.md` Step 0.5・6 | 適合。D2のroot再利用、再開、要件受渡し、排他的ready result確認へ適応 |
| ST-C021 | `steering/SKILL.md` `成果物のlifecycle`・Step 2、`task-design/SKILL.md` §4 | 適合。task-design discussionとsteering discussionを別file・別用途で維持 |
| ST-C022 | `task-design/SKILL.md` Step 4 | 適合。TBD zero、要議論のchat解消、MUST・SHOULD・MAY・非目標への確定分類を復元 |
| ST-C023 | `task-design/SKILL.md` Step 4、`templates/design.md` `なぜこの姿か` | 適合。D11により議論過程をdiscussion、確定設計と必要な棄却理由をdesignへ分離し、理由追跡を維持 |
| ST-C024 | `task-design/SKILL.md` Step 4 | 適合。要点提示、自然言語合意、修正loop、承認keyword強制禁止を維持 |
| ST-C025 | `task-design/SKILL.md` Step 1 `requirements.mdの切り出し` | 適合。長くreview性が上がる時だけ切り出し、link置換、短い場合維持、二重正本禁止を復元 |
| ST-C026 | `task-design/SKILL.md` Step 5、`roadmap-design.md` `Roadmapを選ぶ条件`、`steering/SKILL.md` Step 1 | 適合。D1・D4のleaf/compositeへ変更し、phase数だけではroadmapにしない判断、file名、子steering、summary分離を維持 |
| ST-C027 | `task-design/SKILL.md` `investigation.mdのlifecycle` | 適合。調査目的・判断・方法・終了条件の合意、事実記録、結果確定後plan作成を維持 |
| ST-C028 | `tasklist-design.md` `作成手順`・`migration phaseの原則`、tasklist template | 適合。`./design.md`、template、詳細task、migration単独phase、停止・user確認、理由を維持 |
| ST-C029 | `tasklist-design.md` `phase分割の方針` | 適合。incremental操作単位、layer横切り禁止、具体DoD、悪い・良い分割、まとめすぎsignalを復元 |
| ST-C030 | `tasklist-design.md` `phase分割の方針`・`test作成・変更`、tasklist template | 適合。着手可能粒度、依存、DoD、各phase test、三必須case、既存test不足、test困難理由を復元 |
| ST-C031 | `tasklist-design.md` `品質check`、tasklist template `Phase 3` | 適合。repository全体lint・format・static analysis、既存影響確認と理由を復元 |
| ST-C032 | `tasklist-design.md` `UI変更の追加要件`、tasklist template `Phase 3` | 適合。phaseごとと最終のvisual確認、visual-inspector、直接Playwright禁止、四確認例、広いUI判定、refactor risk理由を復元 |
| ST-C033 | `tasklist-design.md` `作成手順`、`task-design/SKILL.md` Step 6 | 適合。D9により作成中TBDと解消情報を許し、ready前zeroへ変更 |
| ST-C034 | `roadmap-design.md` `Roadmapを選ぶ条件` | 適合。大scopeの子scope分解、子で詳細化、過去の親子steering実績例を汎用化して維持 |
| ST-C035 | `tasklist-design.md` `自己レビューgate` | 適合。zero-base、単一操作、外部service、検証手段、同一endpoint分岐の修正対象・pattern判断と失敗例を復元 |
| ST-C036 | 同gate | 適合。DoD、test、phase内UI、横切り禁止、commit前user確認、自動確認との差と失敗例を復元 |
| ST-C037 | `tasklist-design.md` `実装後feedbackと公開action`、tasklist template `完了後のaction` | 適合。D14によりlocal commitとGitHub公開を別条件化し、不適用sectionを生成しない。user gateとhelperを維持 |
| ST-C038 | `tasklist-design.md` `実装前から確立しているdocument`・self-review | 適合。早期配置、判断質問、末尾配置による知識混同・揮発の失敗理由を復元 |
| ST-C039 | `tasklist-design.md` `自己レビューgate` | 適合。deliverableの完成状態、抽象DoDならdesignへ戻る、悪い例・良い例を復元 |
| ST-C040 | 同gate冒頭・末尾 | 適合。一件でも不合格なら修正、「だいたい」禁止、複数endpoint・component混在の厳格確認を復元 |
| ST-C041 | `tasklist-design.md` `ユーザーレビュー`、`steering/SKILL.md` Step 3末尾・Plan gate | 適合。自然言語review・修正loopを移管し、ok直後にpost-plan gateを飛ばす禁止を維持 |
| ST-C042 | `steering/SKILL.md` Plan gate 4-1 | 適合。plan承認後・実装前、doc-enricher proposal、対象directory・関連file・steering path、自然言語承認・拒否を維持 |
| ST-C043 | 同gate 4-2 | 適合。discussionごとの原因→知識種別→配置、結論を原因と誤認する失敗例、即時承認後適用、tasklist先送り禁止を復元 |
| ST-C044 | 同gate 4-3 | 適合。steering skill自身の必要性確認と、不要時の変更禁止を復元 |
| ST-C045 | `steering/SKILL.md` `ファインプレー即時記録`、`task-design/SKILL.md` `副産物` | 適合。hot contextでの即時提案、変更は合意後、型の精神、命令無視・改悪禁止を両ownerへ移管 |
| ST-C046 | `steering/SKILL.md` Step 3末尾・Step 5 | 適合。全gate前の実装提案・催促禁止、plan直後質問禁止、拒否・保留時停止を維持 |
| ST-C047 | `steering/SKILL.md` Step 6-1、`tasklist-executor/SKILL.md` | 適合。sibling tasklist・design絶対path、task単位即時checkbox、最後の一括更新禁止へ適応 |
| ST-C048 | `steering/SKILL.md` `実装完了後review` | 適合。直接受領時のfacilitate-discussion適用、原文・実装・design・plan context、内部process委譲を維持 |
| ST-C049 | 同section | 適合。認識合わせ、再設計、design合意後task、consumer routing、設計前task禁止、自動再開禁止、修正済み記録、正本非複製を維持 |
| ST-C050 | `steering/SKILL.md` `非規範的なlegacy memo`・`合意済みの明示廃止` | 適合。件数分割をD10で明示廃止し、既存tasklist追記contractを維持 |
| ST-C051 | `steering/SKILL.md` `このskillが絶対にやらないこと` | 適合。steering自身の無断実行、code変更、test・CI、自動次工程を強い禁止として復元 |
| TL-C001 | `task-design/templates/tasklist.md` `設計参照` | 適合。D2により一意な`./design.md`へ変更 |
| TL-C002 | 同template `タスク完全完了の原則`、`tasklist-executor/SKILL.md` `最重要原則` | 適合。全task完了、時間・複雑さ・環境による先送り禁止、未完了終了禁止、実装可能task限定を維持 |
| TL-C003 | 同template `taskの取消完了`、executor `最重要原則` | 適合。方針・architecture・依存・合意済みscope変更だけに限定し、具体理由の取消線形式を維持 |
| TL-C004 | 同template `taskが大きすぎる場合`・`更新timing`、executor | 適合。subtask分割、task・subtask・phase直後更新、一括更新禁止を維持 |
| TL-C005 | 同template `Phase 1`・`Phase 2`と各task詳細 | 適合。複数phase、task、subtask、詳細説明の階層を旧template以上の具体性で復元 |
| TL-C006 | 同template `Phase 3` | 適合。quality DoD、全test、全体lint、UI最終確認とphase内確認を代替しない警告を維持 |
| TL-C007 | 同template `Phase 3` tasks | 適合。test、new file lint、条件付き全体lint、修正・再実行・zero確認、visual-inspector、直接Playwright禁止を復元 |
| TL-C008 | 同template `Documentation reviewと実装後振り返り` | 適合。doc-enricher、三つの再発防止質問、合意後反映を復元。保存先だけD13へ変更 |
| TL-C009 | 同template `動作確認` | 適合。user実操作DoD、確認依頼、implementation_review、feedbackなし取消形式を維持 |
| TL-C010 | 同template `Documentation reviewと実装後振り返り` | 適合。D13により保存先をimplementation_reviewへ統一し、三問とworkflow owner contractを維持 |
| TL-C011 | 同template `完了後のaction`の順序、`steering/SKILL.md` Step 6、executor | 適合。user確認前のcommit禁止を維持。親roadmap更新だけD4によりsteeringへ移し、summary手動更新を禁止 |
| TL-C012 | 同template `commit` section | 適合。D14の生成条件だけ変更し、phase・意味単位、部分承認、不要時取消形式を維持 |
| TL-C013 | 同template `push・PR` section、移動後PR helper | 適合。GitHub条件、commit存在、催促禁止、push command、helperを維持しpathだけD6へ変更 |
| RM-C001 | `task-design/templates/roadmap.md` `概要`、`roadmap-design.md` `Roadmapを選ぶ条件` | 適合。分割理由、独立子steering、各phase完了時の正常動作を維持しD4の収束条件を追加 |
| RM-C002 | roadmap template各Phase、`steering/SKILL.md` Step 6-2 | 適合。phase名・DoD・scope、子path・statusを構造field・運用fieldへD4適応し、完了日を追加 |
| RM-C003 | roadmap template `依存`、`roadmap-design.md` `依存結果とTBD` | 適合。D9により依存で決まる内容を親TBDでなくdependency resultsと子design制約へ変更 |
| RM-C004 | D15、`roadmap-design.md` `全体完了と逸脱記録`、`steering/SKILL.md` `実装完了後review` | 明示廃止。phase status・完了日から全体完了を導出し、意味ある逸脱をimplementation_reviewへ移す。旧fieldは復元しない |
| PR-C001 | `tasklist-executor/scripts/github/create_or_get_pr.sh` | 適合。baselineとの`cmp`がbyte一致。usage、error handling、branch、default branch、既存PR再利用、issue、title・body、PR作成を全量維持 |

最終集計: `適合 68 / 合意済み追加 4 / 明示廃止 1 / 未監査 0 / 未分類削除 0 / 未分類追加 0`。

## 6. 再構築方針

失敗実装には部分一致が多く、短いfileへの追記では再び章構造を失うため、次のsource-first方式で再構築した。

1. steeringは旧steeringを土台にし、D1・D2・D4・D6でownerが移ったblockだけを除去またはcaller契約へadaptする。現在の短いsteeringへ欠落を継ぎ足さない。
2. task-designは移行前task-designを土台にし、D1・D2・D4・D6と旧steeringから`MOVE`されたblockを追加する。現在の変更後task-designを土台にしない。
3. `tasklist-design.md`は旧steering 186-298の詳細を土台にし、D1・D3・D4でplan ownerとfeedback routingだけをadaptする。
4. tasklist templateは旧templateを土台にし、design参照、親roadmap writer、helper path、caller名だけをD2・D3・D4・D6へadaptする。
5. roadmap templateは旧templateの正常動作contractを土台にし、D4の構造field・運用field・再帰収束gateを追加する。旧振り返りfieldはD15に従って復元しない。
6. PR helperは現在の移動後fileがbyte一致しているため、そのまま維持する。

物理rollbackは行わず、Git baselineを各blockの正本として論理的に再構築し、合意済み成果物とcurrent diffを保持した。

## 7. 完了gate

- [x] 構造ledgerの全行について、移行後の章と章内関係を確認した
- [x] contract ledgerの`未監査`がゼロである
- [x] `TBD`をすべて一件ずつユーザーと合意し、`CHANGE | RETIRE | KEEP | MOVE`へ確定した
- [x] `CHANGE`と`RETIRE`の全行に合意済みdecision IDがある
- [x] Git差分の旧source削除行をcontract IDから逆引きできる
- [x] Git追加行と移行後contractを旧contract IDまたは合意済み`ADD`から逆引きできる
- [x] 移管先を通読し、判断条件、順序、禁止、例外、fallback、理由、例、失敗例、判断質問、強調が維持されている
- [x] current targetの大幅な情報量減少を異常signalとして調査し、理由なしの縮退がない
- [x] 未分類追加がゼロである
- [x] white-box監査完了後に、旧contractから導いたscenarioでblack-box smokeを行った
- [x] validatorとsmokeを意味保存の代替証拠として使っていない
