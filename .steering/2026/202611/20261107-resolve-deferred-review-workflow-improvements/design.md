# Design: レビュー境界・モデル分担・承認待ちの自走

## 元の依頼内容

> マージした。じゃあescalate片付けようか

三提案の原文と出典精度は[受領記録](escalation-receipt.md)に保持する。以下の詳細は原文に基づく設計上の具体化であり、詳細を発言したという帰属を利用者へ加えない。引継ぎownerは本案を既指示の具体化として採用し、追加のchoiceを要求しないと確認した。

前版公開後、利用者が適用範囲と許可の意味を訂正した。現在仕様はその訂正を反映する。原文と前版の誤解は[実装feedback](implementation_review.md)と既存の議論履歴に保持し、利用者が最初から前版の詳細を合意したように書き換えない。

## TL;DR

正常操作を保つ内部欠陥修正の規範を保持し、exhaustive-review内でSolの方針・進行・結果監督とTerraへ委譲できる実作業を分ける。既存unattended-executionは必要な指示・合意・許可を維持し、その不足に依存しない既承認作業だけ先に進める。一般workflowのmodel既定値、レビュー採否、権限境界、single writerを保持する。

## 完成後の姿

### レビューが保護する操作と業務仕様

exhaustive-reviewの「挙動維持」は正常な認可ユーザーの既存操作、業務上の入出力・制約、正常時の結果を維持する意味にする。関数内部の戻り値・例外・拒否条件・transaction境界は、その維持を実現するために変更できる。

他者の資源を更新できる認可漏れの拒否、失敗時の部分保存のrollback、既存業務仕様に反する競合状態の修正は、正常操作を保つ修正として扱う。内部で変えたという理由だけで無条件に許可せず、期待する認可と整合性の根拠を示す。未定義の並行操作の勝敗や、新しい業務制約・操作手順・常設service費用を決める場合だけ、その独立する判断を既存の採否workflowへ返す。

exhaustive-review/SKILL.mdの「合意と適用」がこの意味を所有する。templates/finding.mdは「振る舞いへの影響」で維持する正常操作・業務仕様、修正する不正操作・異常系、内部変更とその根拠を示す。戻り値・例外等も影響説明として残すが、全量固定の条件へしない。

レビュー依頼だけでは修正しない契約、合意済み範囲のみ適用、既存許可を再確認しない契約、1指摘1コミット、撤回、証拠を維持する。function_migration_policy.mdはplugin能力移行の全量維持を扱う別規範であり変更しない。

### exhaustive-review内の役割分担

Solが方針検討、ハンドリング、agent結果の監督を担い、その他の読取、事実調査、確定済み方針の実装、テスト等はTerraへ委譲できる。この分担の適用先はexhaustive-reviewであり、hostを限定しない。全skillの既定値やCodexだけの規則へ拡張しない。委譲許可であり、全作業を必ずchildにする義務にはしない。

モデルの明示指定と現実の選択可否を確認し、選べない時は制約と実際のmodelを示す。Solをhost名だけでOpus、TerraをSonnetへ自動読み替えする新対応は設けない。切替や独立reviewを実行していないのに実施したと記さない。

高推論reviewの能力要求と既存high-reasoning-reviewの選択契約は保持する。Solの方針・監督と、横断判断を行うreview担当、Terraへ委譲できる実作業を区別する。高推論reviewを勝手に廃止せず、その担当の結果もSolが監督する。利用者指定を優先する既存契約は維持する。

exhaustive-review/SKILL.mdの「目的とモデル」に役割分担と適用範囲を明記し、必要な共有定義はruntime-model-profiles.mdの既存high-reasoning-review内へ限定する。新しいprofileやhost mappingは追加しない。

前版が一般runtime-model-profilesの推論強度基準、delegated-execution、adapter規則へ追加したSol/Terra既定値は撤回し、変更前の一般契約へ戻す。steering、task-design、tasklist-executor、test-runner、visual-inspectorへ前版が追加した参照文も今回分だけ撤回する。旧版全fileへの一括切戻しは行わず、無関係な契約を保持する。

ownerとsingle writerは変えない。executorのrequest、result消費、DoD、checkbox、parentのphysical launch、test-runner・visual-inspectorの非書込み境界、task-designのdiscussion ownerはそれぞれ既存契約に従う。

### unattended-executionの役割

unattended-executionは、利用者が応答できない間に、新規承認が不要な既承認scopeの作業を進める。権限の拡張や設計判断の代行をしない。通常の許可workflowを恒久的に書き換えず、明示された不在・応答不能中の自走指示で適用する。利用者が通常進行へ戻すか対象作業が終了したら、この動作を終了する。

必要な作業指示、設計合意、工程移行の確認、command実行権限、公開許可はそれぞれ維持する。必要なものが欠ける操作と、その操作に依存する後続を保留し、既に許可されている独立作業だけ先に進める。commandの保存prefixで自動許可されることは、設計や公開の許可を得たことを意味しない。

設計合意待ちなら、合意を前提としない既承認の調査や試験は継続できるが、その合意に依存する実装は保留する。公開許可待ちなら、公開に依存しない既承認のlocal検証はできるが、保存prefixがあっても公開しない。工程移行の確認が要るworkflowでは、その確認を不在skillが代行しない。保留のない許可済み操作へ新しい確認gateを追加することもない。

作業ownerが、操作ごとにscope、既存許可、上位指示、実行環境の権限を実行直前に照合する。追加承認なしで実行できるなら進め、新たな利用者判断が必要ならその操作を未実行で保留し、依存しない作業を選ぶ。利用者が不在だからという理由で、すでに許可されている操作を再確認しない。

require_escalated指定と人の新規承認を同一視しない。確認済みの保存prefixで無人許可される正規操作は実行できる。新たな人向けapproval promptを起こして可否を探らない。無人許可を事前確認できなければ保留する。上位指示が特定の承認呼出しを要求する場合はその指示を優先し、不在skillの判断で回避しない。

承認済みnode等の広いprefix、別tool、分割command、別pathにより、実行環境に拒否された同等操作や承認対象を通してはならない。許可と技術的不具合を区別し、権限境界を変えない正規の技術修復は可能とする。

#### 正本と状態

元workflowのownerがtask・checkbox・完了・single writerを持つ。新skillはそれを奪わない。保留は元workflowに既存の実行記録があればそこへ、なければ指定済みworking directoryのapproval-deferrals.mdへ、操作、必要な許可と根拠、依存先、未実行か結果不明か、再開条件を保存する。専用directoryや全体状態の別正本は作らない。

独立作業が残れば続ける。尽きた時点で完了済み・保留・依存停止を区別して返し、未完了をcompletedへ変えない。既存workflowのblocked等をそのまま使い、汎用result enumを増設しない。

利用者の復帰時や許可の確認材料が得られた時は、保留操作の現在のscope、既存許可、外部状態、依存を再判定する。なお新しい承認が必要な操作だけ具体的に示し、実承認を得てから再開する。保存済みprefixへの適合など、既承認で実行できることが確認できた操作には新承認を取り直さない。途中で外部状態が変わっている可能性があるため、過去の実行可判定だけで再実行しない。

#### 配置と見出し

plugins/tumeda-dev/skills/unattended-execution/SKILL.mdを単独入口にする。frontmatterはnameと具体的triggerを持つdescription。本文は「役割と適用条件」「操作前の承認判定」「保留して独立作業を進める」「権限境界を維持する」「記録と再開」「返却と終了」の順に置き、上記policyとcaseを対応する節の近くへ置く。現時点では一fileで一つの判断loopを持ち、別の内部workflowを抱え込まない。

runtime-execution-contracts.mdには、明示不在時の適用入口と元owner維持を参照として追加する。停止後に他の独立taskへ進めるだけであり、拒否された操作自体の実行やblockedの解消を偽装しない。既存の「実行環境gate」は移動・削除せず保持する。

### 配布物

前版8.3.0の適用範囲と許可維持の修正としてPATCH 8.3.1へ一度だけbumpする。新skill・parameter・profileは追加しない。宣言四箇所とvalidator expectedReleaseを同時更新する。既存のskill登録と公開索引は保持する。

## 要件（Requirements）

- 正常操作・業務仕様を保つ内部欠陥修正を、関数挙動が変わるという理由だけで取消さない。
- exhaustive-review内だけでSolの方針・進行・結果監督とTerraへ委譲できる実作業を分け、hostを限定せず、既存model指定とowner契約を保持する。
- unattended-executionを単独で呼び、新規承認が必要な操作のみ保留する。
- 保留・依存停止を完了に数えず、承認境界を別toolやprefixで回避しない。
- 利用先固有情報を公開物に入れない。

### 非目標

利用先の業務仕様とapplication修正はpluginの責務外。pluginは実際に未定義の業務判断を補完しない。高推論reviewの既存指定を廃止しない。

### 受け入れ基準

正常な資源操作は維持し他者IDだけ拒否するcase、失敗rollback、未定義業務判断、新業務制約、構成費用をそれぞれ正しく分類できる。model指定あり/選択可能/選択不可を区別し、exhaustive-review内のTerra結果をSolが監督し、高推論reviewを保持する。一般workflowのmodel規則へ今回の役割を拡張せず、役割分担を特定hostへ限定しない。不在中の既承認、保存prefix自動許可、新規人承認、境界迂回、依存停止、復帰を正しく扱い、未完了を完了にしない。

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 内部名義で業務変更する | 正常操作と業務仕様を具体caseで独立判定 |
| 委譲で責任を移す | model profileとlogical ownerを分離 |
| 不在中に許可を回避する | 操作直前の二層照合と迂回禁止case |
| 配布後も旧cacheを使用する | 既存escalate ownerが正式reloadと取得元を確認 |

## テスト方針

変更したpolicyの期待文字列・禁止文字列・参照と新skill存在をvalidatorへ追加する。レビュー分類とmodel adapterと不在時の各受入caseを、実際のmodel切替実行と机上case確認を区別して記録する。skill-update-reviewを設計時と編集後に適用し、document-reviewをsource emit前に適用する。

全体検証はnode scripts/verification/validate-plugin.mjs、node scripts/verification/test-task-design-handoff.mjs、node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs。新scriptがあればnode --checkも実行する。UIとlintは対象がない。

## （付録）前提とする既存仕様

exhaustive-reviewは依頼だけの修正を禁じ、既適用許可を保持する。runtime profileはhost adapterの正本。runtime-execution-contractsはlogical owner、physical launcher、実行環境gateを保持する。function migrationの全量維持規範は対象能力の移動・分割等に適用し、今回の単純追記や明示方針変更へ根拠なく全repository ledgerを拡張しない。

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

前版のレビュー挙動維持の修正は保持する。前版の反映・検証と未再現incidentは[反映・検証結果](implementation-results.md)と[実行証跡](validation-evidence.txt)に保存されており、今回の実施結果へ読み替えない。

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| exhaustive-review、既存high-reasoning-review、一般profileと前版追記5skill | review限定・host非限定の役割、一般規定への前版拡張の撤回 | 5入口と一般profile部分は前々版と一致、挙動維持節とfindingは前版と一致。差分とcaseをSol監督済み | exhaustive-review内の役割分担 |
| unattended-executionとvalidator | 必要な指示・合意・各許可を維持し、既承認独立作業だけ進めるcase | 保存prefixと設計・公開許可の区別、既許可再判定、依存停止を確認。編集後構造reviewとdocument-review済み | unattended-executionの役割 |
| 配布version5値 | 8.3.1へ更新 | validator exit 0、正規環境でhandoff exit 0、自己test exit 0（24 pass・1 skip・0 fail） | 配布物 |

今回の結果は[訂正結果](correction-results.md)、実行条件・失敗と再検証・source hashは[訂正検証証跡](correction-validation-evidence.txt)に保存する。sourceを固定し、validator成功後に、sandbox内の空stdout失敗・中断を記録した。独立probeのspawnSync EPERMを根拠に正規の承認済node環境へ戻し、handoffと自己testだけを各一回実行して成功した。旧所有processの終了を共有一覧で確認したが、旧wrapperの子exit未取得という履歴は残す。過去incidentと初回失敗の原因を遡及断定しない。

model selector切替と承認UIは実測しておらず、文面とcaseによる確認である。main取り込み・正式reloadはまだ完了として扱わない。

### task-design内の対象成果物反映待ち

なし。

訂正designを先に共有する時点ではsourceをatomic編集完了後に固定し、全三検証は未実行だった。共有後に編集後reviewと検証を実施し、上記の現在結果へ同期した。共有当時の未検証状態と、現在のsource品質確認を区別する。

### execution plan対象

なし。今回の既存skillと検査の訂正は、一つの連続した反映とvalidationで実施できる。空tasklist・roadmapを作らない。main取り込み・正式reloadはroot ownerの後続工程であり、本書から勝手に実行しない。
