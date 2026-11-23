# Design: tasklistを段階実行が必要な変更へ限定する

> **状態: 合意済み・task-design完了**
>
> 個別のdiscussion decision、production差分、この`design.md`を一つの統合designとして確定することは、ユーザーが全件確認し、合意済みである。release versionは`6.0.0`へ同期済みである。execution plan対象はなく、論点13で撤去した`tasklist.md`を再作成しない。

## 元の依頼内容

> task-designの中でtasklistを作るのを、ほぼコーディングだけにしぼりたい。
> 今のところsteeringするものについては基本的にタスクリストも作る前提にしていた。
> だから、例外としてタスクリストを作らない軽量モードや、ドキュメントについては、即時反映といった記述を入れていった。
> だけど、例外ルールが増えていって、かつ例外のほうの運用が半分ぐらいになってしまって、例外としての運用ではなくなってしまった。
> また、ドキュメント更新については、即時反映をしてほしいのに、タスクリスト行きになることがそこそこ多かった。
>
> だから、条件に合致した時のみタスクリストを作る、または載せると言う運用にしたい。
> 基本的にはコーディング。作業が単発で終わらず、段階を踏まざるを得ないようなタスクも、タスクリスト行き。あとは、ユーザが指定した時。
> だから、ドキュメント更新みたいに単発で終わるものはディスカッションで方針が固まったら即時反映するようにしたい。
> 軽量モードも、結局は調査やドキュメント更新やコードを使った思考に過ぎないから、軽量モードと言うラベリングが必要なく、ただただタスクリストを使わないステアリングとして移行できると思う。
>
> だから、design.mdの存在意義は変わってくる。
> 今までは、コーディング後の世界の記述、軽量モードの決定事項の羅列だったけど、
> ステアリング開始からステアリング終了時までの差分が乗るようになれば、整合性つくかな
>
> また、design.mdのテンプレートの存在も大きく変わってくると思う
> と言うのも、必ずコードが変更されるわけではないし、ドキュメントが変更されるわけでもない。
> 何かが変更されたときに使われるテンプレートの部品が、その時に応じて差し込まれる形になると思う。
> 画面を変えるから、画面に関しての完成後の姿。データを作ったり、データの見え方が変わるから、データに関しての完成後の姿。
> そういう風にテーマにするものによって、ファイルの形は変わってくると思う。
>
> ただ、思想は全く変わらなくて、コード変更前、タスクリスト作成前にタスクが全て終わった目線で、変化後の世界の様子を描ききり、
> タスクリスト遂行中に合意されていないことが勝手に決まって、実装後に齟齬が起きたりしないように考えきると言う姿勢は同じ。
> だから、段階を踏むといっても、不確実性削減のためのスパイクスクリプトの実行はもちろんタスクリストに入らず、design.mdの時点で実行される

feedbackと議論の変遷は同じdirectoryの[task-design-discussion.md](./task-design-discussion.md)を正本とする。

## 1. TL;DR

tasklist必須を正常系、planなしを例外とする構造が、document・skill等を不要なtasklistへ送っていた。完成後のtask-designは、設計の深さを落とさず、変化対象に応じた完成後の姿を合意し、対象成果物への変更をtask-designが完了するものとexecution planへ渡すものへ分ける。

これは既存task-designの再構成を伴うfunction migrationである。新しいworkflowだけを記述して旧contractを置換しない。baselineの判断、停止、例外、理由、例、失敗例、問い、owner境界は、ユーザーが明示した変更を除いて全量維持する。

## 前提とする既存仕様

### 移行規範

- [Function migration policy](../../../../plugins/tumeda-dev/docs/common_standard/function_migration_policy.md)に従い、移行前の全能力をbaselineとして固定し、構造ledgerとcontract ledgerをproduction編集前に作る。
- `ADD | CHANGE | RETIRE`にはユーザーの明示指示または明示合意を必要とする。
- 理由、例、失敗例、判断質問、強調も判断能力の一部として保存する。
- production変更前後に順方向、逆方向、境界のwhite-box照合を行う。

### Baseline

- revision: `c3537350f31059a24f4960d9248f04766d213ac6`
- source:
  - `plugins/tumeda-dev/skills/task-design/SKILL.md`
  - `plugins/tumeda-dev/skills/task-design/tasklist-design.md`
  - `plugins/tumeda-dev/skills/task-design/roadmap-design.md`
  - `plugins/tumeda-dev/skills/task-design/templates/design.md`
  - `plugins/tumeda-dev/skills/task-design/templates/tasklist.md`
  - `plugins/tumeda-dev/skills/task-design/templates/roadmap.md`
  - callerである`plugins/tumeda-dev/skills/steering/SKILL.md`
  - discussion記録ownerである`plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`と`templates/discussion_entry.md`
- 二層ledger: [function-migration-ledger.md](./function-migration-ledger.md)
- baseline固定時点でproduction sourceにこのsteering由来の変更はない。

### 現行task-designが持つ能力

- 実装中に新しい設計判断が生まれないことを完了条件とし、完成後の世界を具体値、例、失敗例、判断質問で描く。
- WHY→WHAT→HOW、TBD込みの構造合意、上位からの合意、不確実性を潰す調査・技術検証実装、対話による設計という思想を持つ。
- working directory、repository context、子roadmap制約、investigation、requirements、discussion、design、排他的planのownerとlifecycleを持つ。
- discussion decisionを確定直後に`design.md`へ記録し、次の論点より先に全体を再評価する。
- design完了時に、要件分類、TBD zero、収束、自己診断、根拠追跡、自然言語合意、grepと目視通読を行う。
- leafのtasklistとcompositeのroadmapについて、選択条件、single writer、review、feedback routing、停止・取消・公開actionを規定する。
- steeringはcanonical directory、result検証、plan後gate、実行開始確認、dispatch、roadmap orchestration、実装後reviewを担う。

## 2. 要件（Requirements）

### MUST（必達）

- execution plan対象は、本番application coding、実行時に段階を踏む作業、ユーザーが明示した作業に限定する。実行可能なcode一般を本番application codingへ読み替えない。
- discussion、調査、不確実性削減の技術検証実装はdesign手段としてtasklistへ載せない。
- code変更の有無にかかわらず、task-design全体で一つの完成後の姿を描き、合意する。
- 完成後の姿は`outcome-sections/catalog.md`から変化対象に必要なsectionを選んで構成する。
- 選択済みoutcome sectionは、READMEを正本とする読者の理解依存で部分順序を作り、依存しないsectionだけを既定順で安定化する。file名順、catalog順、実装順では並べない。
- 完成後状態を理解・維持するために必要な設計意図は、固定章へ機械的に集約せず、実在を判定するgateを通して関係するWHATの後へ置く。実在しない理由や代替案をtemplate充足のために生成しない。
- `skill-policy.md`はpolicyの意味要件を固定fieldへ圧縮しない。短いroleだけを共通入口とし、独立したpolicyは内容を表す小見出しへ分け、各pieceの関係に応じて[表現記法の標準](../../../../plugins/tumeda-dev/docs/documentation_standards/expression_notation.md)から記法を選ぶ。
- 既存functionの移動、分割、統合、owner変更、形式置換では`contract-preservation.md`を選び、baseline scope、明示差分以外の全量保存宣言、人が理解できる完成後の意味差分、根拠となるledger IDを記載する。contract単位の分類と証拠はledgerを正本とし、designへ転記しない。
- documentationの新設・本質的更新は`documentation.md`を選び、暗黙知の形式知化、読者の判断、規範の根拠と境界、snapshot維持規律まで完成後の姿として設計する。
- 調査、比較、技術検証そのものが主成果の場合だけ`research-findings.md`を選び、別outcomeを設計する途中で得た事実は該当sectionへ根拠として書き戻す。
- execution plan対象一覧は`対象`、`掲載理由`、`参照するdesign section`だけを持つ参照索引とし、対象ごとの完成後の姿を作らない。
- discussion decisionの`design.md`への即時記録と、decisionから生じる対象成果物への適用時期を別contractとして扱う。
- 委託されたテーマ内の議論は、未決・合意済みにかかわらず`facilitate-discussion`が単独でdiscussionへ同期する。consumer skillへ同じ記録条件を重複定義しない。
- discussionへの記録を成果物反映より先に行うことを基本とする。記録漏れへ事後に気づいた場合は、最終結論だけでなく、起点、当初認識、当初提案、feedback、修正過程、合意、反映済み成果物を再構成する。
- 対象成果物への即時適用は目的またはdefaultにせず、未決decisionとfile間contractに依存しない時だけ任意で行う。
- tasklist不要だが依存解消を待つ対象成果物の変更をexecution planへ送らず、task-designが依存解消後に整合する単位で一括適用・validationする。
- task-design resultを`tasklist_ready | roadmap_ready | planless_complete`の排他的unionとし、execution plan対象がzeroならplan fileを作らず完了できる。
- steeringは三result共通の終了前safety gateを維持し、`planless_complete`では実行開始確認とdispatchを行わない。
- baselineの全構造rangeと全atomic contractをledgerへ登録し、合意済み変更を除いて移行後ownerへ保存する。
- `ADD | CHANGE | RETIRE`の全件を合意根拠へ逆引きできるようにする。
- tasklist、roadmap、steeringの既存gate、停止、取消、single writer、feedback routingは、別途合意されない限り維持する。
- task-design、template、steeringのmigration batchをproductionへ反映する前に`未監査 0 / 未分類削除 0 / 未分類追加 0`を満たす。独立して合意・監査が完了した一file変更まで、このbatchの未決事項で待たせない。

### SHOULD（できれば）

- 対象成果物への変更が一論点で閉じ、他の未決事項と整合性依存がない場合は、contextが熱いうちに適用してよい。
- outcome sectionは既存観点の理由、具体例、失敗例、判断質問まで含め、見出しとfieldだけへ縮退させない。
- task-design、template、steering、validator、公開contractの相互依存変更は、一つのbatchとしてwhite-box照合する。

### MAY（あれば嬉しい）

- 一つのsteering内で、task-design内の対象成果物適用とexecution plan対象を混在させる。
- Requirementsが長い場合は既存contractどおり同じworking directoryの`requirements.md`へ切り出す。

### 非目標

- tasklistまたはroadmapを廃止すること。
- designを軽くすること。
- tasklist不要な変更を無条件に即時適用すること。
- outcome section化を理由に既存の設計思想、例、gateを短縮・削除すること。
- tasklistまたはroadmapの内部規則を今回の目的に無関係に改善すること。
- planなしrouteを理由にdesign completion gate、終了前safety gate、直接反映のvalidationを省略すること。

### 受け入れ基準

- baselineの全source rangeが構造ledgerに登録されている。
- baselineの全意味単位がatomic contractとして分類され、具体的なdestinationまたは合意済み廃止へ到達する。
- prototype coreに、原文保持、上位roadmap制約、既存仕様、Requirements 4分類、完成後の姿、必要な設計意図、独立したrisk、testが残る。
- tasklistとroadmapのprototypeは、別途変更が合意されるまでbaselineと同一である。
- execution plan対象が空の正常系と、tasklistまたはroadmapを作る正常系の両方がowner、gate、resultまで一意に読める。
- `planless_complete`が子steeringの完了伝播と月次summaryで未完了扱いされない。
- production差分の削除行と追加行をledgerへ逆引きできる。
- `facilitate-discussion`がhandoff前に未収録議論を検出し、合意済みdiscussionを再合意なしで保存できる。事後記録では議論の変遷と事後状態を再構成する。
- tumeda-devの四version宣言とrepository validatorの`expectedRelease`が`6.0.0`で一致し、suffixなしのSemVerとして検証される。
- white-box完了後、旧contract由来のblack-box scenarioと通常validatorを通過する。

## 3. 完成後の姿

### skillの役割と方針

#### task-design

task-designは、task全体が完了した目線で完成後の世界を描き、後続作業中の新しい設計判断をzeroにする。利用後は、合意済み内容から対象成果物への反映とexecution planの要否を別々に判断できる。

##### designの深さをexecution planから切り離す

execution planの有無やcode変更の有無でdesignの深さを変えない。対象成果物への適用時期は未決decisionとfile間contractへの依存、execution planの要否は作業の実行特性で判断し、一方から他方を決めない。

##### execution planへ送る対象を限定する

execution planへ載せるのは、本番applicationのruntime behaviorを変更しtestで正しさを確認する通常のapplication coding、実行時に段階を踏む作業、ユーザー指定の作業だけである。本番成果物に伴うtest、schema、dependency、build／runtime設定はapplication codingの実装scopeへ含むが、それらのfile種別だけでは掲載しない。

skill、prompt、documentation、template、規範等のcontentと、それらを検査・生成・整形する補助tool codeは、実行可能なcodeであることだけではplanへ載せない。今回利用者へ届ける本番productであるかを役割から判断し、補助toolとして合意済み内容から一意に変更・validationできるならtask-design内で扱う。discussion、調査、技術検証実装もdesignの不確実性解消手段であり、planへ載せない。

##### sourceから設計能力を保存する

execution planの作成条件を変えても、task-designが設計を完了させるための判断能力は変えない。

###### 完了判定

- 設計は完成後の世界を合意する段階、実装は合意を対象成果物へ落とす段階として分ける。
- fileの変更点一覧を、完成後の世界の代わりにしない。
- 新しい判断が残る、完成後の姿が描けない、sectionを埋めたことを完了根拠にする、という三つのnegative diagnosisに一つでも該当すればdesign未完と判定する。

###### 設計の進め方

次の五つの思想を、理由、違反signal、帰結、判断質問とともに同じ強度で維持する。

- WHY→WHAT→HOWの順序で下ろす。
- TBDを使って全体を先に示す。
- 上位の合意から再帰的に積み上げる。
- 議論や調査で確定できない不確実性はspikeで実測する。
- 転記や推測で埋めず、対話で設計する。

###### 自己更新

skill自身を構造的・抜本的に変える場合はOpusを使い、task-designの思想を自己適用する。既存文の転記による薄型化、抽象または具体への偏り、一sectionだけの変更による全体不整合という観測済み失敗patternも、自己reviewの入力として維持する。

##### 軽量modeのlabelを廃止し、能力を全taskへ共通化する

###### 廃止するもの

軽量モードというlabel、mode切替、完成後の姿を不要とする分岐、`D1, D2, ...`を主内容とするformat、plan常時必須の前提を廃止する。

###### 全taskへ共通化するもの

旧軽量モードにあったdocs／skill／prompt／規範taskのcoverage、discussion駆動、decision／fact単位の記録と再評価、file成果物観点、五つの設計思想は、全task共通の能力として維持する。

###### 維持するbaseline contract

Requirementsを不要とする分岐の廃止は合意されていないため、baselineのRequirements contractを維持する。

#### facilitate-discussion

facilitate-discussionは、テーマとdiscussion fileを委託された後、そのテーマ内の記録価値判定、論点routing、提案、feedback、合意、履歴保存を単独で所有する。利用後は、fileだけを読んだ人が起点から最終decisionまでをsessionの補完なしに再現できる。

##### 委託themeの議論を完全に記録する

handoff前に前回保存後の会話とdiscussionを照合し、未収録の事象、原因、提案、反論、訂正、合意を同期する。chat上で合意済みなら再合意を求めない。成果物反映後に記録漏れへ気づいた場合は、事後記録であることと確認不能範囲を明示し、最終結論だけでなく実際の議論の変遷を再構成する。

##### 認識齟齬を原因ownerへ戻す

認識齟齬または修正要求では、具体案より先に、原因を成果物固有、repository知識、skillへ分類する。repository知識またはskillが原因なら、具体ケースを一般則の不備を示す実例として扱い、一般則の修正を先に合意する。

一般則のdecisionと対象成果物への適用時期は別に判断する。即時適用したoriginについてだけ`doc-enricher`を一度reviewし、具体ケースの修正だけで再発原因を残さない。

##### discussion内部contractをconsumerへ複製しない

記録と原因routingのcontractを`task-design`、`steering`、`think-through`、discussion templateへ複製しない。consumerは設計contextとdecision後の適用を所有するが、discussion内部の論点、提案、iteration、合意を組み立て直さない。事後記録を、合意のない提案をdecisionへ変える根拠にも使わない。

#### steering

steeringはcanonical directoryを準備してtask-designを起動し、ready resultを検証してplan routeまたはplanless routeを完了させる。

##### ready resultでrouteを分ける

plan resultは共通safety gateと実行開始確認の後にdispatchする。planless resultは共通safety gate後に完了し、実行開始確認を求めない。`planless_complete`を未完了または実行対象として扱わず、tasklist-executorや子steeringへdispatchしない。

##### identityとstateだけを検証する

design内容またはplan構造を重複reviewせず、result、file identity、付録stateの整合だけを検証する。矛盾があれば自動修復せず、同じworking directoryでtask-designへ戻す。

##### roadmap runtime fieldのsingle writerになる

roadmapの子binding、status、完了日はsteeringだけがruntimeで更新する。tasklistとroadmapの構造field、およびtasklist-executorが所有する実行中stateをsteeringが直接書き換えない。

### callerが依存するcontract

task-designのcaller-facing resultは、次の三つだけを排他的に返す。

三resultはすべて、次の共通成立保証を満たす。

- designが合意済みで、未解消TBDと未確定decisionがない。
- `分類保留`sectionが存在せず、`task-design内の対象成果物反映待ち`が`なし`である。
- task-design内で対象成果物へ適用した変更は、validation結果と参照するdesign sectionが記録されている。

| result | 必須field | route固有の成立保証 | steeringの挙動 |
| --- | --- | --- | --- |
| `tasklist_ready` | `working_dir`、`design_path`、`tasklist_path` | execution plan対象が一件以上あるleafで、tasklistが合意済み、roadmapが存在しない | identity／stateと共通safety gateを確認し、ユーザーの実行開始確認後にtasklist-executorへdispatchする |
| `roadmap_ready` | `working_dir`、`design_path`、`roadmap_path` | execution plan対象が一件以上あるcompositeで、roadmapが合意済み、tasklistが存在しない | identity／stateと共通safety gateを確認し、ユーザーの実行開始確認後にroadmapを子steeringへbindingする |
| `planless_complete` | `working_dir`、`design_path` | execution plan対象が`なし`で、tasklistとroadmapがどちらも存在しない | identity／stateと共通safety gateを確認し、実行開始確認とdispatchを行わず完了する |

`tasklist_ready`と`roadmap_ready`の既存名称とfieldは変更しない。共通成立保証の証拠をresultへ複製せず、`design.md`付録を正本とする。子roadmap phaseの`planless_complete`は正常な子完了として親へ伝播する。

**失敗contract:** result名、必須field、canonical root、plan fileの排他性、付録stateが矛盾する場合、steeringは完了またはdispatchへ進まず、同じworking directoryでtask-designへ戻す。判定不能な前月summaryは`不明`とし、既存summary fieldを増やさない。

### workflow

**ownerと責務:**

| owner | 判断・更新するもの | 行わないこと | single source of truth |
| --- | --- | --- | --- |
| task-design | working directory、完成後の姿、design合意、対象成果物変更のrouting、条件付きexecution plan、ready result | plan実行、roadmap runtime field更新、discussion内部processの再定義 | `design.md`、条件付きの`tasklist.md`／`roadmap.md` |
| facilitate-discussion | 論点、提案、feedback、合意、履歴、原因owner routing、handoff前同期 | consumer固有の成果物適用、未提示提案のdecision化 | `task-design-discussion.md`または`discussion.md` |
| doc-enricher | 指定originまたはsteering全体から、永続的で高レバレッジな既存README／docs候補を提案 | 合意前の書込み、新規docs directory作成、同一originの重複review | 承認済みの既存README／docs |
| steering | canonical directory、ready resultのidentity／state、共通safety gate、plan実行開始確認、dispatch、roadmap runtime field | designとplan構造の重複判断、planlessのdispatch | root steering directory、roadmap runtime field |
| tasklist-executor／子steering | 合意済みplanの実行、test、実行結果 | design変更、plan構造変更、親roadmap runtime field更新 | 対応するtasklistの実行state／子steering成果物 |

**状態と遷移:**

```text
decision／fact確定
  -> 対象成果物変更を四stateの一つへrouting
  -> 未決解消とtask-design内反映・validation
  -> design phase完了
      ├─ execution plan対象zero
      │    -> plan file不存在を確認
      │    -> planless_complete
      │    -> steering共通safety gate
      │    -> steering完了
      └─ execution plan対象あり
           -> leaf／composite判定
           -> tasklistまたはroadmapを設計・review・合意
           -> tasklist_readyまたはroadmap_ready
           -> steering共通safety gate
           -> 実行開始確認
           -> 既存のtasklist executionまたはroadmap orchestration
           -> 既存完了contractを経てsteering完了
```

**必須順序とhandoff:**

1. task-designはworking directoryと上位roadmap制約を確定し、repository context、既存規約、類似実装、必要な現状UIを初稿前に調査する。function migrationではproduction編集前にbaselineと二層ledgerを固定する。
2. `design.md`の既存coreを維持し、`outcome-sections/catalog.md`から今回変わる対象だけを選んで一つの完成後の姿を作る。TBD込みの全体構造を先に合意する。
3. 最上位の不確実性をdiscussion、調査、技術検証実装のいずれかで一つずつ解消する。discussion decisionは確定直後にdesign本文へ記録し、次の論点より先に全体を再評価する。
4. decisionから対象成果物変更が生じた時点で、付録の四routing stateへ分類する。decision記録と対象成果物への適用を同じcontractにしない。
5. design completion gateで、要件分類、TBD zero、収束、negative diagnosis、根拠追跡、自然言語合意、grep、目視通読、分類保留zero、反映待ちzero、task-design内反映済み変更のvalidationとdesign参照を確認する。ここで成立するstateを`design phase完了`とし、callerへ返却可能なready resultとは区別する。
6. execution plan gateは初回分類ではなく最終検証として、共通成立保証、適用済み変更との重複、掲載理由、design参照を再確認する。対象zeroならplanを作らず、両plan fileの不存在を確認して`planless_complete`を返す。対象ありの場合だけleaf／compositeを判定し、対応する一方のplanを設計・review・合意してから`tasklist_ready`または`roadmap_ready`を返す。
7. task-designは三resultの一つを返す。steeringはidentity／stateを検証し、三result共通の`doc-enricher`、再発防止、steering自己reviewを行う。
8. planlessは共通gate後に完了する。plan resultだけはユーザーの実行開始確認を得てからdispatchし、既存のtasklist executionまたはroadmap orchestrationの完了contractへ接続する。

**対象成果物変更のrouting:**

| state | 入口条件 | 次の遷移 |
| --- | --- | --- |
| 分類保留 | 未決decisionによりownerまたは内容が変わる | decision確定後に再分類。design合意前にsectionごとzeroにする |
| task-design内反映待ち | plan不要だが未決decisionまたはfile間contractとの一括適用が必要 | 依存解消後に整合する単位で反映・validationする。design phase完了前に`なし`にする |
| task-design内反映済み | task-designが対象成果物へ適用しvalidationを完了した | 完了証拠とdesign参照を付録へ残す |
| execution plan対象 | 本番application coding、実行時の段階作業、ユーザー指定のいずれかに該当する | tasklistまたはroadmapへ具体化する |

各対象成果物変更は四stateのちょうど一つへ置き、同一対象を複数stateへ重複掲載しない。stateが変わった場合は旧stateから新stateへ移す。即時適用は、内容とvalidationが一decisionで閉じ、他の未決decisionで要否・内容が変わらず、他fileとの同時変更が不要な時に選べるが、義務ではない。付録はrouting stateの単一正本であり、対象別の完成後の姿やtask手順を複製しない。

**代表scenario:**

- 依存のないdocs単独変更: decisionをdesignへ記録し、対象docsへ反映・validationして`task-design内反映済み`にする。他のexecution plan対象がなければ`planless_complete`を返す。
- 他の未決事項へ依存するskill一括変更: 各decisionはdesignへ記録するが、対象skillは`task-design内反映待ち`に置く。依存解消後にfile間contractが整合する単位で一括反映し、複数fileであることだけを理由にtasklistへ送らない。
- docs直接反映と本番application code変更が混在する変更: 独立したdocsはtask-design内で反映・validationし、本番application code変更だけをexecution plan対象へ載せる。反映待ちzeroでdesign phaseを完了し、application実装とtestを扱うleaf planを合意した後に`tasklist_ready`を返す。一つのdesignを正本とし、対象ごとの完成後の姿を作らない。
- 不確実性削減のspike: design phaseで最小codeを実行し、確定した事実を該当outcomeへ書き戻す。spike自体をexecution planへ載せず、本実装へ連続させない。

#### execution plan要否と対象成果物への適用時期を分ける理由

execution plan要否は作業の実行特性、適用時期は未決decisionとfile間contractへの依存で決まる。二軸を一つにすると、plan不要だが依存中のdocs／skill変更を未整合のまま先行patchするか、不要なtasklistへ送ることになるため分ける。

**失敗・取消・再開:**

- discussionの記録漏れ: 成果物反映後でも、結論だけを追記せず、確認できる議論の変遷と事後状態を再構成してから次へ進む。
- plan reviewで完成後の姿、要件、公開contractが変わる: planだけを修正せずtask-designのdesignへ戻る。task順・粒度・検証手順だけならplan ownerで更新する。
- ready resultとfile identity／stateが矛盾する: steeringは自動修復せず同じworking directoryでtask-designを再開する。
- 既存planをplanlessへ変更する: 不要になった理由とplan撤去をdiscussionで合意し、stale planを黙って残さない。
- plan実行の取消、停止、再開、commit・push・PR条件: tasklist／roadmapの既存contractを維持し、今回のplan作成条件変更を理由に短縮しない。

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/SKILL.md` | task-design agent、steering | 一つの完成後の姿を設計し、対象成果物変更をroutingし、必要な場合だけplanを返す |
| `plugins/tumeda-dev/skills/task-design/templates/design.md` | task-design agent、design reviewer | 既存coreと選択式の完成後の姿、risk、test、変更routingを一つのdesignへ組み立てる |
| `plugins/tumeda-dev/skills/task-design/templates/outcome-sections/` | task-design agent、template maintainer | 変化対象に必要なsectionを選び、読者の理解順で配置し、薄い記述にせず具体化する |
| `plugins/tumeda-dev/skills/steering/SKILL.md` | steering agent | 三resultを検証し、plan resultだけをdispatchし、planlessを安全に完了する |
| `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md` | discussion facilitator、consumer skill | 委託themeの議論を完全に記録し、原因ownerへroutingして一decisionずつ返す |
| `tasklist-design.md`、`roadmap-design.md`、`templates/tasklist.md`、`templates/roadmap.md` | plan designer、executor | execution plan対象がある場合の既存leaf／composite contractを変更前と同じ強度で使う |
| `plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json` | plugin loader、release maintainer | 破壊的な公開contract変更を表すrelease version `6.0.0`を四宣言で同一に読み取れる |
| `scripts/verification/validate-plugin.mjs` | plugin maintainer、repository validation | 合意済みのtask-design／steering contractを退行検出し、四version宣言が期待release `6.0.0`で一致することを検査できる |

**完成後の内容と構造:**

```text
task-design/
├── SKILL.md
├── tasklist-design.md
├── roadmap-design.md
└── templates/
    ├── design.md
    ├── tasklist.md
    ├── roadmap.md
    └── outcome-sections/
        ├── README.md
        ├── catalog.md
        ├── interaction-flow.md
        ├── screen.md
        ├── data.md
        ├── caller-contracts.md
        ├── code-structure.md
        ├── skill-policy.md
        ├── documentation.md
        ├── file-deliverables.md
        ├── runtime-and-configuration.md
        ├── workflow.md
        ├── contract-preservation.md
        └── research-findings.md
```

`design.md`のcoreは、原文、上位roadmap制約、TL;DR、既存仕様、Requirements、選択式の「3. 完成後の姿」、「4. リスクと対策」、「5. テスト方針」、付録の変更routingから成る。固定の設計判断章は持たず、必要な設計意図だけをoutcome section READMEのgateで関係するWHATの後へ置く。

`outcome-sections/catalog.md`はselection、READMEは理解依存による配置順、循環時の戻り先、設計意図／代替案の生成・配置、未決候補を所有する。各sectionは固有の選択条件、理由、NG、具体例、MUST、判断基準、記入blockを所有し、共通ruleを複製しない。理解依存を優先し、同順位では読み手の理解順を使い、contract preservationを最後に置く。循環する場合は、最初に知りたい入口を一つ選び、後続sectionから戻り参照する。

`documentation.md`は、形式知化する対象、読者が下せる判断、知識構造、根拠と適用境界、良い状態のsnapshotを維持する規律、document構造を所有する。`research-findings.md`は、問い、evidence、finding、confidence、適用scope、そこから下せる判断、未判明、矛盾、再検証条件を所有する。調査が主outcomeなら独立して選び、documentationも作る場合は知識体系と調査結果を別ownerにして同じfactを重複記載しない。

`file-deliverables.md`は、documentation以外のfileについて、対象と読者、完成後の内容と構造、記載する原則と例、配置・形式を所有する。`contract-preservation.md`は、baseline／evidence、closed-worldな差分宣言、意味を要約した変更項目とledger ID、保存するcontractを所有し、ledger全文を転記しない。`runtime-and-configuration.md`、`workflow.md`、`skill-policy.md`、`caller-contracts.md`、`code-structure.md`もそれぞれ独立ownerとする。interaction、data、caller contract、screenには、今回変わる失敗・中断・更新・不変条件・成功／失敗保証・状態別表示を具体化するblockを持つ。

`skill-policy.md`は、役割、判断方針、能力境界、禁止、非目標という意味要件を維持するが、それらを固定の表示枠にしない。skillごとの短いroleを入口に、独立したpolicyを固有見出しへ分ける。理由、条件、例外、帰結は散文、短い同格要素だけは箇条書き、独立した説明を持つ子policyは小見出しとして、`expression_notation.md`に従って表す。具体caseは関係するpolicyの直後へ置き、全policyのcaseを末尾へ集約しない。

`migration-and-rollout.md`はoutcome sectionとして採用しない。移行後に成立する状態は該当outcomeへ、一般的なmigration手順は共通policyへ、今回固有の実行順と停止条件はrisk／test／必要なexecution planへ置く。prototypeとproduction templateは、このowner分割を同じ内容で持つ。

`task-design/SKILL.md`はbaseline section 1〜8をsource土台として残し、frontmatter、成果物contract、共通Step 3、Step 4〜6、起動・終了条件等、合意済み差分に必要な箇所だけを適応する。旧section 9はmode identityを廃止し、維持する能力を共通ownerへ移した後に削除する。`steering/SKILL.md`も既存plan routeを土台に、三result共通gateとplanless branchだけを加える。`facilitate-discussion/SKILL.md`はdiscussion processの唯一の正本であり、consumerへ内部ruleを複製しない。

#### outcome section化とsource-first migrationの設計意図

outcome section化のscopeを完成後の姿へ限定し、既存coreとtask-designの判断能力はbaseline sourceから保存する。変化対象ごとに必要な完成後状態を選べるようにしながら、Requirements、risk、test、設計思想、停止条件までtemplate再編の都合で薄めないためである。

実際に検討した次の構成は採らない。

- 現在のprototypeへ不足項目だけを継ぎ足すと、薄い要約と誤分類を土台に残し、未発見の欠落を検出できない。
- 新workflowだけを書いて既存task-designをproduction反映時に読み直すと、design合意時に廃止・変更が見えず、実装者へcontract判断を残す。
- source全文を一つの巨大templateへ残すと判断能力は保存できても、変化対象に応じてoutcome sectionを選ぶ完成後構造にならない。

**記載する原則と例:**

- source artifactはpolicyとworkflowを実現するが、同じ本文の正本にはならない。
  - 今回の具体例: `templates/design.md`はREADMEのcomposition ruleを参照し、配置規則を再掲しない。
  - 意図に反する薄い記述: `interaction-flow.md`を見出しと空tableだけにすると、移行元の理由、失敗例、判断質問が消え、同じ判断能力を再現できない。
- outcome sectionはfile種別ではなく、steering終了時に何が成立・観測できるかで選ぶ。
  - 今回の具体例: skill変更では`skill-policy`、`caller-contracts`、`workflow`、`file-deliverables`、`contract-preservation`を組み合わせる。
  - 意図に反する薄い記述: docs変更をすべて`file-deliverables`へ送り、形式知化する知識体系や維持規律を設計しない。

**配置・形式:** production sourceは上記pathのMarkdownと既存schemaを維持する。完成形の具体参照は[task-design_template_prototype/templates/](./task-design_template_prototype/templates/)とし、意味保存の証拠は[function-migration-ledger.md](./function-migration-ledger.md)を正本にする。prototype、production、ledgerへ同じ意味を三重転記しない。

### contractの保存と明示差分

**baselineとevidence:**

| 項目 | 内容 |
| --- | --- |
| baseline | `c3537350f31059a24f4960d9248f04766d213ac6` |
| 対象scope | baseline revisionの`plugins/tumeda-dev/skills/task-design/`全体、callerの`steering/SKILL.md`、discussion ownerの`facilitate-discussion/`、公開説明`skills/README.md`、repository validator `scripts/verification/validate-plugin.mjs` |
| ledger | [function-migration-ledger.md](./function-migration-ledger.md) |
| 一般procedureの正本 | [Function migration policy](../../../../plugins/tumeda-dev/docs/common_standard/function_migration_policy.md) |

**完成後の差分宣言:** 次に記載する意味差分だけが変わる。baseline scope内のその他すべてのcontractは、ownerや配置が変わっても意味、条件、順序、強度、判断能力を保存する。

**完成後に変わること:**

| 完成後の意味差分 | 移行前との違い | 詳細owner | 出典 |
| --- | --- | --- | --- |
| execution planは条件に合致する作業だけに作り、plan不要のtaskも一つの完成後の姿と`planless_complete`で正常完了できる | 移行前はplanを正常系、軽量モードを例外として扱い、docs／skill等もtasklistへ送りやすかった | [skillの役割と方針](#skillの役割と方針)、[callerが依存するcontract](#callerが依存するcontract)、[workflow](#workflow) | ledger A-001、A-002、A-004、A-007、A-011、A-012 |
| discussion decisionの記録、認識齟齬の原因owner、対象成果物への適用時期を分け、委託themeの履歴をfacilitate-discussionが一貫して所有する | 移行前はhandoff後の記録漏れ、具体ケース先行、decision記録と即時適用の混同を防ぐcontractが不足していた | [skillの役割と方針](#skillの役割と方針)、[workflow](#workflow) | ledger A-005、A-006、A-008〜A-010 |
| 完成後の姿を変化対象別のoutcome sectionから選び、selection、composition、各theme固有の具体化を別ownerにする | 移行前は固定観点または軽量モードのdecision列で扱い、documentation、research、runtime、workflow、skill policy、contract preservation等の完成状態を固有の型で表せなかった | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) | ledger A-003、A-013〜A-017、A-022、A-024、A-025、A-029 |
| caller-facingな保証とcodeの責務配置を別sectionへ分け、失敗／中断／更新後data／状態別画面等の必要caseを追加する | 移行前はpublic nameとmodule境界が一観点で、成功・失敗保証や変化する境界caseの専用blockがなかった | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) | ledger A-018〜A-021、A-023 |
| 必要な最終理由は関係するWHATの後へ置き、実在する代替案だけを残す。固定設計判断章は廃止し、riskとtestを独立した4章・5章として維持する | 移行前は全taskへ固定理由章と代替案欄を生成し、存在しない理由の穴埋めと実在理由の矮小化を誘発した | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) | ledger A-026〜A-028 |

tasklist、roadmap、その設計fileが持つmigration停止、incremental phase、test、repository check、UI確認、document、feedback、ユーザー動作確認、取消、commit・push・PR、strictly narrowerな子scope、DAG、field ownership、dependency result、親DoD coverage、逸脱記録、single writerのcontractは、上記の意味差分に含まれず全量保存される。

### prototype・ledger・designの役割を分ける理由

prototypeは完成後templateの具体像、ledgerは移行前後の意味保存と明示差分の証拠、この`design.md`はtask全体が終了した世界をそれぞれ正本として持つ。三つを一つへ統合すると、読者が理解する完成後状態、source artifactの具体形、migration監査の証拠が混ざり、designへのledger転記またはledgerへの設計本文複製が起きるため分ける。

## 4. リスクと対策

| リスク | 対策 |
| --- | --- |
| outcome section化で理由・例・問いが落ちる | atomic contract ledgerでsourceとdestinationを一対一に照合する |
| `design.md`へのdecision記録と対象成果物への適用を再び混同する | 別contract・別状態名として記述し、scenario testを分ける |
| planless routeを「何もしない完了」と誤認し、終了前safety gateやvalidationを省略する | `planless_complete`のzero state、validation、三result共通gateをcaller／consumer contractとして照合する |
| tasklist／roadmapの無関係な内部規則をついでに変更する | 両設計fileとtemplateを`KEEP`としてbyte diffと通読で検証する |
| ledgerをsection要約で済ませる | atomic分解完了までは`未監査あり`と明記し、production source編集を禁止する |
| policyを固定fieldへ圧縮するか、逆に小見出しを増やしすぎる | `expression_notation.md`に従い、短い同格要素は箇条書き、独立した理由・条件・例外・caseを持つpolicyだけを小見出しへ昇格する |

## 5. テスト方針

- prototype coreに移行前core sectionが存在し、独立した意味を維持することをwhite-boxで照合する。
- outcome sectionごとにsourceの理由、具体例、失敗例、判断質問がdestinationへ存在することを照合する。
- `skill-policy.md`の固定四枠がzeroで、現在の三skillが固有policy見出しへ分かれ、各箇条書きが同格・並列であることを目視照合する。
- tasklistとroadmapのprototypeをbaselineとbyte比較する。
- planなし、tasklist、roadmap、discussion decision記録、対象成果物反映待ち、spikeのscenarioを旧contractと合意済み変更から導く。
- production変更後にGit削除行・追加行の逆引き、caller/consumer境界の通読、validator、lintを行う。
- repository validatorは、outcome section、四routing state、本番application codingに限定した掲載条件、三result、Ready result後の共通gate、planless非dispatch／伝播を検査し、旧固定観点、通常／軽量mode、二result前提、固定設計判断format、旧`public-contracts.md`の復活を拒否する。次期release versionは、四宣言とvalidator期待値を`6.0.0`へ同期して検査する。generic skill validatorは対応可能範囲の補助toolとし、非対応の`model`／`effort`拒否をacceptance failureにしない。

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| [task-design_template_prototype/templates/design.md](./task-design_template_prototype/templates/design.md) | 未合意に削除されていた既存仕様、Requirements分類、独立したriskとtestを復元した。再監査で薄くなっていた冒頭思想、上位制約、既存仕様、非目標、付録の理由も復元した。その後、論点21により固定設計判断章と二つの固定subsectionを廃止し、必要な設計意図を第3章へ配置する形へ変更した。論点1・イテレーション3により、execution plan対象の掲載理由を本番application coding／段階実行／ユーザー指定へ限定した。 | coreのatomic mapping、固定設計判断章・固定subsectionがzero、risk／testの独立性、付録の四区分・field・zero gate、本番application codingという掲載理由を照合した。 | [documentation以外のfile deliverable](#documentation以外のfile-deliverable)、[workflow](#workflow) |
| [task-design_template_prototype/templates/outcome-sections/](./task-design_template_prototype/templates/outcome-sections/) | 論点8、9のsection群に加え、skill policyとcontract preservationを追加し、旧`public-contracts.md`をcaller contract／code structureへ分割した。未決候補と、理解依存・既定順・循環時の戻り先・設計意図／代替案の生成gateをREADMEへ集約し、代表2パターンを追加した。`skill-policy.md`は固定四枠を廃止し、意味関係に応じて記法を選ぶ形へ変更した。 | 移行元の具体例・MUST・判断質問、四追加のselection gateとowner境界、caller contract／code structureの旧→新・新→旧対応、contract preservationの二層正本と三記入block、WHAT→WHY、代替案の四条件、API／画面とskill／documentationの順序例を確認した。`skill-policy.md`は旧四枠zero、固有policy見出し、親子階層、`expression_notation.md`参照を確認した。tasklist／roadmapは変更していない。 | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| [function-migration-ledger.md](./function-migration-ledger.md) | baseline、構造ledger、contract ledger、未監査gateを作成し、A-011〜A-029、outcome section 16件、template core 13件、軽量mode 19件、task-design production edit 25件のmappingを追加した。論点10のvalidator assertion実差分を`VAL-E002`〜`VAL-E004`、release値を`VAL-E001`へ分離し、最終production hunkを全件逆引きした。 | baseline revision、構造range、各atomic mappingの件数とsource coverage、task-design section 1〜9の限定変更範囲、合意済みprototype追加、固定理由章とskill policy固定四枠の意味移管・format廃止根拠を照合した。最終監査で未分類削除0、未分類追加0、反映待ち0、三result scenario passを確認した。 | [contractの保存と明示差分](#contractの保存と明示差分) |
| [facilitate-discussion/SKILL.md](../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md) | 論点5のhandoff前同期、合意済みdiscussionの保存、事後reconstructionと、論点2の原因owner分類、一般則優先、一回限りの`doc-enricher` reviewをproductionへ反映した。 | skill validator、通常・事後回復smoke、JSON・version整合、差分checkに成功した。 | [skillの役割と方針](#skillの役割と方針)、[workflow](#workflow) |
| [task-design/SKILL.md](../../../../plugins/tumeda-dev/skills/task-design/SKILL.md) | 既存section 1〜8を原文土台に、outcome section選択、decision単位routing、条件付きplan、三resultへ限定変更し、軽量mode sectionを廃止した。論点1・イテレーション3で、coding routeを本番applicationの実装とtest完了へ限定し、skill ecosystemの補助tool codeをfile種別だけでplanへ送らない境界を追加した。後続監査で見つかった論点21・23の適用漏れとして、固定4章へ理由を集約する旧self-reviewと撤去済み`public-contracts.md`への二参照を訂正した。 | `軽量モード`zero、三result返却形式、三掲載条件、spike非掲載、本番成果物／補助toolの役割判定、固定理由章への集約指示zero、`public-contracts.md`参照zero、既存思想sectionの残存、Markdown差分を確認した。generic validatorの`model`拒否はtoolの非対応でありacceptance failureにしない。repository validatorのtask-design assertionもpassした。 | [skillの役割と方針](#skillの役割と方針)、[callerが依存するcontract](#callerが依存するcontract)、[workflow](#workflow) |
| [task-design/templates/](../../../../plugins/tumeda-dev/skills/task-design/templates/) | 初回prototype反映後、論点17〜26、28で合意した`contract-preservation.md`、outcome sectionの配置順、設計意図／代替案の生成gate、固定設計判断章の廃止、caller contract／code structure分割、`skill-policy.md`の記法変更を含むfreeze済みprototype全体を、論点31でproductionへ一括同期した。論点1・イテレーション3では`design.md`付録の掲載理由placeholderを本番application codingへ限定した。tasklist／roadmapは変更していない。 | productionとprototypeの全file集合・内容がbyte一致し、旧`public-contracts.md`がzero、内部linkとselection gateが有効、付録の掲載理由が本番application coding／段階実行／ユーザー指定であること、tasklist／roadmapがbaseline・prototype・productionで同一SHA-256であることを確認した。function migration ledgerのA-023〜A-029とP-ADD／P-CHGからproduction差分を順方向・逆方向に照合し、Markdown差分checkに成功した。 | [documentation以外のfile deliverable](#documentation以外のfile-deliverable)、[contractの保存と明示差分](#contractの保存と明示差分) |
| [steering/SKILL.md](../../../../plugins/tumeda-dev/skills/steering/SKILL.md) | 三result identity、共通Ready result後gate、planless非dispatch、summary判定、子完了伝播を追加し、plan routeとroadmap orchestrationを維持した。 | planlessのzero state、共通gate、開始確認skip、非dispatch、子伝播、既存plan routeの残存、Markdown差分を確認した。generic validatorの`model`／`effort`拒否はtoolの非対応でありacceptance failureにしない。repository validatorのsteering assertionもpassした。 | [skillの役割と方針](#skillの役割と方針)、[callerが依存するcontract](#callerが依存するcontract)、[workflow](#workflow) |
| [skills/README.md](../../../../plugins/tumeda-dev/skills/README.md) | task-designとsteeringの公開概要を、条件付きplanと三resultへ更新した。 | result名、plan routeのdispatch、planless routeの完了ownerを目視照合した。 | [callerが依存するcontract](#callerが依存するcontract)、[documentation以外のfile deliverable](#documentation以外のfile-deliverable) |
| [scripts/verification/validate-plugin.mjs](../../../../scripts/verification/validate-plugin.mjs) | 旧固定観点、通常／軽量mode、mode固有文、旧Plan gate、二result前提のassertionを、outcome section、四routing state、本番application coding、三result、Ready result後gate、planless非dispatch／伝播のassertionへ置換した。固定設計判断formatと旧`public-contracts.md`の復活も拒否し、`expectedRelease`を`6.0.0`へ同期した。 | task-design／template／steeringの新assertion、四version宣言、変更対象外assertionを含むrepository validator全件がpassした。 | [skillの役割と方針](#skillの役割と方針)、[callerが依存するcontract](#callerが依存するcontract)、[workflow](#workflow)、[テスト方針](#5-テスト方針) |
| [plugin version宣言](../../../../plugins/tumeda-dev/.codex-plugin/plugin.json) | `plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`の二宣言を、破壊的な公開contract変更を表す`6.0.0`へ一括同期した。 | 四宣言のJSON parse、値の完全一致、suffix不在、validator期待値との一致を確認した。 | [documentation以外のfile deliverable](#documentation以外のfile-deliverable)、[contractの保存と明示差分](#contractの保存と明示差分) |

### task-design内の対象成果物反映待ち

なし。

### execution plan対象

なし。
