# outcome sectionの構成と未決候補

このdirectoryの各fileは、`design.md`の「3. 完成後の姿」へ差し込むsectionである。`catalog.md`でsectionを選び、このREADMEのcomposition ruleで配置する。各section fileは固有の書き方だけを所有し、共通の配置規則を複製しない。

## design.mdへの配置順

### 基本手順

1. `catalog.md`から、steering終了時に変わるoutcome sectionだけを選ぶ。
2. 選択済みsection間の「読者が理解するための依存」を先に確定する。
3. 理解依存だけでは前後が決まらないsectionを、後述の既定順で安定化する。
4. 各sectionのWHATを配置した後、block固有、section固有、複数sectionを通底する設計意図をそれぞれのscopeへ置く。

file名順、catalogの行順、実装順、作成者が考えた順では並べない。選ばれていないsectionは飛ばし、空sectionや順序を示すだけのcategory見出しを生成しない。

### 読者が理解するための依存

`A`のWHATを読まないと`B`の用語、actor、状態、保証、対象scopeを推測で補うことになる場合だけ、`A → B`として配置する。source code上のdependency、fileの生成順、単なるlink先という理由だけでは前後を決めない。end-to-end overviewが後続の詳細sectionを参照する場合は、overviewを先に読み、詳細へ降りる順を使う。

現行sectionには次のprecedenceがある。

- `research-findings.md`が後続outcomeを規定するevidenceなら、そのoutcomeより前へ置く。別outcomeの設計途中で得たevidenceにすぎない場合は、`research-findings.md`自体を選ばない。
- `skill-policy.md`は、それを具体化する`caller-contracts.md`、`workflow.md`、`file-deliverables.md`より前へ置く。
- 同じ利用場面を扱う`interaction-flow.md`は、`screen.md`、`data.md`、`caller-contracts.md`より前へ置く。
- callerが依存する挙動を内部構造が実現する場合、`data.md`と`caller-contracts.md`を`code-structure.md`より前へ置く。
- `documentation.md`と他sectionの前後はfile種別で固定しない。既存のpolicy、workflow、挙動を形式知化するdocumentationなら、それらの後へ置く。documentation自体の維持方法を`workflow.md`で設計するなら、`documentation.md → workflow.md`とする。
- `workflow.md`が成立させる実行条件を`runtime-and-configuration.md`が具体化する場合は、`workflow.md → runtime-and-configuration.md`とする。
- `contract-preservation.md`は、選択した他のoutcome sectionをすべて読んだ後へ置く。先に具体的な完成後状態を示し、その後にbaselineとの関係、全量保存宣言、明示差分を読む。

### 同順位の既定順

理解依存で前後が決まらないsectionだけを、次の順で安定化する。これは全task共通の因果順ではなく、同順位のtie-breakである。

1. `research-findings.md`
2. `skill-policy.md`
3. `interaction-flow.md`
4. `screen.md`
5. `data.md`
6. `caller-contracts.md`
7. `documentation.md`
8. `workflow.md`
9. `runtime-and-configuration.md`
10. `code-structure.md`
11. `file-deliverables.md`
12. `contract-preservation.md`

新しいoutcome sectionを正式採用する時は、owner境界だけでなく、既知のprecedenceとtie-break上の位置もこのREADMEへ追加する。位置未決のままcatalogへ追加しない。

### 循環した場合

`A`を理解するには`B`が必要で、`B`を理解するには`A`が必要なら、任意のfile順で切らない。一方がend-to-end overviewになれる場合は、overview側で用語と全体像を最小限定義し、他方へ詳細を委ねる。どちらも入口になれない場合は、内容のowner分割、共通概念の正本、section選択漏れをdiscussionへ戻す。同じ本文を両sectionへ複製して循環を隠さない。

### 設計意図との合成

設計意図は、templateを埋めるための固定fieldではない。次のいずれかに該当し、WHATだけでは完成後状態を正しく理解・維持できない時だけ書く。

- 複数の合理的な完成形から一つを選んだ。
- trade-offまたは守る制約があり、WHATだけでは選択の強度を維持できない。
- 理由を失うと、将来の変更で同じ失敗形へ戻る可能性がある。
- 複数sectionの組合せ自体に意味があり、個別WHATだけでは全体の選択を理解できない。

機械的な結果、WHATの言い換え、既存contractの単純維持、template欄を埋めるための一般論には作らない。設計意図がない場合も、空見出しや「設計意図: なし」を生成しない。

設計意図を置く時は、作成者の思考順ではなく読者の理解順でWHATを先に示す。

- block固有の設計意図は、そのblockのWHAT直後へ置く。
- section固有の設計意図は、そのsectionのWHAT直後へ置く。
- 複数sectionを通底する設計意図は、選択済みsectionをすべて置いた後、第3章末尾へ一度だけ置く。
- 同じ意図を複数scopeへ複製しない。複数箇所を拘束するなら、すべてを包含する最小scopeへ置く。

代替案は、次をすべて満たす場合だけ設計意図へ含める。

1. discussion、調査、または設計中に、実際の選択肢として具体的に検討された。
2. 採用しなかった理由が合意済みであり、assistantの後付け推論ではない。
3. 理由を失うと、完成後状態を誤読するか、将来同じ案へ理由なく戻る可能性がある。
4. 最終状態を理解・維持するために必要であり、単なる議論履歴ではない。

条件を満たす代替案は、関係するWHATの後で設計意図の実際の論理構造へ組み込む。段落、nested list、内容を表す固有見出し等を選び、`設計判断`や`代替案と棄却理由`という固定見出し、一案一行の固定formatを要求しない。検討したが最終状態の理解に不要な案、旧iteration、feedbackはdiscussionだけが所有する。

designは最終理由を単独で理解できる本文を持つ。discussionへのlinkは出典として添えてよいが、linkだけで理由または棄却理由を省略しない。

### 代表パターン

#### dataを更新するAPIを画面へ適用する

画面操作からAPIを呼び、保存dataと表示状態が変わる修正では、基本形を次の順にする。

```text
interaction-flow.md
  → screen.md
  → data.md
  → caller-contracts.md
  → code-structure.md         # 責務配置・公開入口・依存方向も変わる場合だけ
  → contract-preservation.md  # migrationまたはrefactoringの場合だけ
```

1. `interaction-flow.md`で、actorの操作、API call、成功・失敗、画面へ戻る結果までのend-to-end overviewを示す。
2. `screen.md`で、初期、loading、成功、空、error等、flow中に見える状態と操作可否を具体化する。
3. `data.md`で、APIの結果として保存される値、関係、更新前後、状態遷移、不変条件を示す。
4. `caller-contracts.md`で、画面側が依存するAPIのidentifier、input、result、error、side effect保証を、先に示したdata semanticsへ接続する。
5. `code-structure.md`を選ぶ場合は、外部から見える挙動と保証を確定した後に、それを実現するmodule責務、公開入口、dependency directionを示す。
6. `contract-preservation.md`を選ぶ場合は最後に置き、ここまでに示した完成後状態とbaselineの関係、保存するcontract、明示差分を読む。

#### skill方針を変更し、skill本体と利用者向けdocumentationへ反映する

skillの役割・判断方針を変え、その方針をworkflow、`SKILL.md`、利用者向けdocumentationへ反映する修正では、基本形を次の順にする。

```text
skill-policy.md
  → caller-contracts.md       # trigger、input、result等のcaller-facingな保証も変わる場合だけ
  → workflow.md               # owner、state、gate、handoffも変わる場合だけ
  → documentation.md
  → file-deliverables.md
  → contract-preservation.md  # 既存skillの移動・分割・統合・形式置換を伴う場合だけ
```

1. `skill-policy.md`で、完成後skillの役割、成立させる能力、判断の優先順位、能力境界、禁止、非目標を先に示す。
2. `caller-contracts.md`を選ぶ場合は、policyを利用者から観測できるtrigger、input、result、error、side effect保証へ具体化する。
3. `workflow.md`を選ぶ場合は、policyとcaller contractを、owner、state、gate、停止・再開、handoffを持つ実行過程へ具体化する。
4. `documentation.md`で、先に示したpolicyとworkflowを利用者が正しく判断・運用できる知識体系、標準、具体例、維持規律として形式知化する。
5. `file-deliverables.md`で、`SKILL.md`やtemplate等のsource artifactが持つ見出し、内容、配置、形式を示す。policyやworkflow本文を複製せず、artifact上の実現形だけを所有する。
6. `contract-preservation.md`を選ぶ場合は最後に置き、変更後のskill全体を読んだ後でbaselineとの保存・差分関係を確認する。

この例の`documentation.md`は、完成後skillのpolicyとworkflowを説明するため、それらの後に置く。documentation自体のreview・更新workflowを設計するtaskでは、理解依存が逆になり、`documentation.md → workflow.md`とする。

## 未決outcome section

以下は、既存sectionへ押し込まず、独立した完成判定と固有templateが必要かを今後決める候補である。候補名はfile名ではない。scope、分割・統合、正式名、template、catalogへの追加が合意されるまで対応fileを作らない。

### domainの概念化・語彙・境界を拘束する方針

- 対象候補: domain概念をどう分節するか、語の意味、ubiquitous language、bounded context、同名異義・異名同義の扱い。
- owner境界候補: data schema、public name、module構造そのものではなく、それらを導く概念化と語彙の方針。
- 未決事項: 概念化方針、語彙方針、context境界方針を一sectionにするか、正式名、必要な具体例と完成判定。
- discussion owner: `task-design-discussion.md`の論点25。

### architecture（code structure以外）

- 決定済みの境界: code内のlayer、component／module／class責務、directory、公開入口、dependency direction、全体call relationは`code-structure.md`が所有する。caller-facingな保証は`caller-contracts.md`が所有する。
- 対象候補: process／service topology、deployment単位等、code structure、runtime設定、security、performanceの各sectionだけでは完成後の全体構成を表せないarchitecture上の変化。
- 未決事項: code structure以外に独立したarchitecture outcomeが必要か、必要な具体case、owner境界、正式名、template。

### security

- 対象候補: trust boundary、authentication／authorization方針、機密性・完全性、secret取扱い、脅威時の失敗状態と監査可能性。
- owner境界候補: runtime設定、public error contract、dataの不変条件、workflow上のapproval gateとの分離。
- 未決事項: securityを一つのoutcomeにするか、threat modelと具体的なsecurity contractを分けるか、selection gateとtemplate。

### performance

- 対象候補: latency、throughput、resource上限、負荷時の劣化方針、計測条件とbudget。
- owner境界候補: runtime設定、data access、画面上の待機状態、調査findingとの分離。
- 未決事項: performance budgetと検証evidenceを同じsectionが所有するか、selection gateとtemplate。

### compatibility

- 対象候補: caller、保存data、設定、運用手順の後方互換性と、意図的なbreaking changeの境界。
- owner境界候補: 個別caller contract、data migration、contract preservation、release policyとの分離。
- 未決事項: compatibilityを横断outcomeとして持つ条件、他sectionへの参照方法、template。

## 候補を扱う時の制約

- 「根幹だから」「横断するから」という理由だけで汎用sectionへまとめない。
- 既存sectionと異なる完成判定、固有の失敗例、固有の記述guideが必要な場合だけsectionを追加する。
- 未決候補を設計中の穴埋めに使わない。必要になったtaskではdiscussionでscopeとownerを決めてから追加する。
- 同じ本文を複数sectionへ複製せず、意味正本となるsectionと観測可能な帰結を持つsectionを参照で接続する。
