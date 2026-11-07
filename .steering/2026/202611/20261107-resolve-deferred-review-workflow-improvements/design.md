# Design: レビュー境界・モデル分担・承認待ちの自走

## 元の依頼内容

> マージした。じゃあescalate片付けようか

三提案の原文と出典精度は[受領記録](escalation-receipt.md)に保持する。以下の詳細は原文に基づく設計上の具体化であり、詳細を発言したという帰属を利用者へ加えない。引継ぎownerは本案を既指示の具体化として採用し、追加のchoiceを要求しないと確認した。

## TL;DR

正常操作を保つ内部欠陥修正を取消す誤読を防ぎ、Solの方針・進行・結果監督とTerraへ委譲できる実作業を分ける。応答できない間にも承認不要の作業を進める単独skillを追加する。既存のレビュー採否、モデル指定、権限境界、single writerを保持する。

## 完成後の姿

### レビューが保護する操作と業務仕様

exhaustive-reviewの「挙動維持」は正常な認可ユーザーの既存操作、業務上の入出力・制約、正常時の結果を維持する意味にする。関数内部の戻り値・例外・拒否条件・transaction境界は、その維持を実現するために変更できる。

他者の資源を更新できる認可漏れの拒否、失敗時の部分保存のrollback、既存業務仕様に反する競合状態の修正は、正常操作を保つ修正として扱う。内部で変えたという理由だけで無条件に許可せず、期待する認可と整合性の根拠を示す。未定義の並行操作の勝敗や、新しい業務制約・操作手順・常設service費用を決める場合だけ、その独立する判断を既存の採否workflowへ返す。

exhaustive-review/SKILL.mdの「合意と適用」がこの意味を所有する。templates/finding.mdは「振る舞いへの影響」で維持する正常操作・業務仕様、修正する不正操作・異常系、内部変更とその根拠を示す。戻り値・例外等も影響説明として残すが、全量固定の条件へしない。

レビュー依頼だけでは修正しない契約、合意済み範囲のみ適用、既存許可を再確認しない契約、1指摘1コミット、撤回、証拠を維持する。function_migration_policy.mdはplugin能力移行の全量維持を扱う別規範であり変更しない。

### Solの監督とTerraの実作業

runtime-model-profiles.mdをモデル役割とhost adapterの正本とする。方針検討、ハンドリング、agent結果の監督をSolが担い、読取、事実調査、確定済み方針の実装、テスト実行をTerraへ委譲できる。委譲許可であり、すべてを機械的にchild化する義務にはしない。

Codexのdelegated-execution adapterは選択可能ならTerraを選ぶ。方針・進行・結果監督にSolを使う対応をprofileへ記述し、skill本文は役割またはprofileを参照する。利用者の明示model指定を優先し、選択不能時は継承して制約を報告する。存在しないselectorを創作しない。Claude Codeの既存対応は保持する。

high-reasoning-reviewの既存Astra相当指定は保持する。利用者の「他はTerraに投げていい」は委譲許可であり、独立した高推論review契約を廃止する指示ではない。レビュー担当から戻る結果もSolが監督する。

tasklist-executorはlogical ownerのままrequest作成、result消費、DoD、checkboxを更新する。直近parentによるphysical launchとSolの監督は、この権限を奪わない。test-runner・visual-inspectorはtasklistと実装を変更しない。task-designのdiscussionを別childへ渡さない契約も維持する。

変更対象はruntime-model-profiles.md、既存のmodel adapter説明に従うtasklist-executor/test-runner/visual-inspectorのCodex節とsteeringの委譲説明。task-designのOpusに関する既存規定はClaude側の既存品質契約として残し、CodexのSol対応はprofile参照で明確にする。大量のmodel名置換は行わない。

### unattended-executionの役割

unattended-executionは、利用者が応答できない間に、新規承認が不要な既承認scopeの作業を進める。権限の拡張や設計判断の代行をしない。通常の許可workflowを恒久的に書き換えず、明示された不在・応答不能中の自走指示で適用する。利用者が通常進行へ戻すか対象作業が終了したら、この動作を終了する。

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

新skillが増えるためMINOR 8.3.0へ一度だけbumpする。宣言四箇所とvalidator expectedReleaseを同時更新する。公開索引・manifestのskills列挙は既存構造に合わせて新skillを登録し、明示列挙がなければ新しい登録構造を作らない。root README等の既存モデル説明はprofileと整合する必要最小限の参照にする。

## 要件（Requirements）

- 正常操作・業務仕様を保つ内部欠陥修正を、関数挙動が変わるという理由だけで取消さない。
- Solの方針・進行・結果監督とTerraへ委譲できる実作業を分け、既存model指定とowner契約を保持する。
- unattended-executionを単独で呼び、新規承認が必要な操作のみ保留する。
- 保留・依存停止を完了に数えず、承認境界を別toolやprefixで回避しない。
- 利用先固有情報を公開物に入れない。

### 非目標

利用先の業務仕様とapplication修正はpluginの責務外。pluginは実際に未定義の業務判断を補完しない。高推論reviewの既存指定を廃止しない。

### 受け入れ基準

正常な資源操作は維持し他者IDだけ拒否するcase、失敗rollback、未定義業務判断、新業務制約、構成費用をそれぞれ正しく分類できる。model指定あり/選択可能/選択不可を区別し、Terra結果をSolが監督し、Astra高推論reviewを保持する。不在中の既承認、保存prefix自動許可、新規人承認、境界迂回、依存停止、復帰を正しく扱い、未完了を完了にしない。

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

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| exhaustive-review本文とfinding template | 正常操作・業務仕様の維持と内部欠陥修正の境界を具体化 | validator成功、具体caseの机上確認、Solによる差分監督済み | レビューが保護する操作と業務仕様 |
| runtime profileと参照adapter | Sol/Terraの役割を正本へ集約し、既存host契約とownerを保持 | validator成功、model指定/継承caseの机上確認、既存Astra/Claude差分の監督済み | Solの監督とTerraの実作業 |
| unattended-execution、新skill参照と検査、version | 新skill、元ownerを維持する参照、具体case、8.3.0宣言と検査 | skill-creator簡易検証・編集後構造review・document-review・全体三検証を実施。結果と限界は下記参照 | unattended-executionの役割、配布物 |

結果の正本は[反映・検証結果](implementation-results.md)、実行証跡は[validation-evidence.txt](validation-evidence.txt)。全体三検証は成功し、自己testは24 pass・1 skip・0 fail。追加実行のhandoffで一度空stdoutのJSON解析失敗を観測し、同じsourceの単独再実行は成功した。原因は未確定であり、環境・一過性・既存bugのいずれとも断定しない。この観測限界を残して検証結果を消費することを引継ぎownerが判断した。

実際のhost selector切替と承認UIは実測せず、文面とcaseの確認である。実行したように扱わない。機能移行として旧工程を削除・移動しておらず、元のowner・gate・host差を保持することはbaseline差分の通読で監督した。

### task-design内の対象成果物反映待ち

なし。

### 設計文書の共有時点

設計本文は完成し、設計上の未決事項はない。利用者の「design.mdが出来上がったら見たいから $tumeda-dev:share-work-in-progress もして」に応じ、実装完了前の設計文書を共有する。

共有準備時の作業treeには既存14fileの変更と新skillがあった。その時点では全体三検証、対応assertionの完成、編集後の構造review、sourceのdocument-review、Solによる実装結果の監督が未完了だった。実装担当が利用上限で停止したため、共有までsourceを固定した。共有後は同じ作業treeから反映と検証を再開し、結果を上記へ反映した。

本書の共有自体はtask-design全体の完了でも、plugin配布や正式cache更新の完了でもない。共有時の設計記録のdocument-reviewと、その後のsource品質確認を区別する。

### execution plan対象

なし。三件のskill・規範は既存契約を保持して一つの連続した反映・validationで実施でき、本番application codingでもない。空tasklist・roadmapを作らない。merge・push・reloadは既存escalate ownerの完了後取込みで扱い、task-designの対象成果物反映と混同しない。
