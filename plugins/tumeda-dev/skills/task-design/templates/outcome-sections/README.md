# 完成後の姿のsectionの並べ方と、追加候補

このdirectoryの各fileは、`design.md`の「完成後の姿」へ差し込むsectionである。`catalog.md`でsectionを選び、このREADMEの並べ方の決まりで配置する。各sectionのfileにはそのsectionに固有の書き方だけを書き、共通の並べ方の決まりを写さない。

## design.mdへの配置順

### 基本手順

1. `catalog.md`から、steeringの終了時に変わる完成後の姿のsectionだけを選ぶ。
2. 選んだsectionの間の「読者が理解するための依存」を先に確定する。
3. 理解するための依存だけでは前後が決まらないsectionを、後に書く既定の順で並べる。
4. 各sectionのWHATを置いた後、一つのまとまりに固有の設計意図、一つのsectionに固有の設計意図、複数のsectionに共通する設計意図を、それぞれが当てはまる範囲へ置く。

file名の順、catalogの行の順、実装の順、書き手が考えた順では並べない。選ばれていないsectionは飛ばし、空のsectionや、順序を示すだけの分類の見出しを作らない。

### 読者が理解するための依存

`A`のWHATを読まないと、`B`の用語、操作する人、状態、保証、対象の範囲を推測で補うことになる場合だけ、`A → B`として配置する。source codeの上での依存、fileを作る順、単なるlink先という理由だけでは前後を決めない。始めから終わりまでの全体の概要を示すsectionが後の詳しいsectionを参照する場合は、概要を先に読み、詳しいsectionへ降りる順を使う。

今あるsectionには、次の前後関係がある。

- `research-findings.md`が後のsectionの内容を決める根拠なら、そのsectionより前へ置く。別のsectionを設計する途中で得た根拠にすぎない場合は、`research-findings.md`自体を選ばない。
- `skill-policy.md`は、それを具体化する`caller-contracts.md`、`workflow.md`、`file-deliverables.md`より前へ置く。
- 同じ利用場面を扱う`interaction-flow.md`は、`screen.md`、`data.md`、`caller-contracts.md`より前へ置く。
- 呼び出し元が頼る挙動を内部の構造が実現する場合、`data.md`と`caller-contracts.md`を`code-structure.md`より前へ置く。
- `documentation.md`と他のsectionの前後は、fileの種類で固定しない。既存の方針、作業の流れ、挙動を文書にするdocumentationなら、それらの後へ置く。documentation自体を最新に保つ方法を`workflow.md`で設計するなら、`documentation.md → workflow.md`とする。
- `workflow.md`が成り立たせる実行の条件を`runtime-and-configuration.md`が具体化する場合は、`workflow.md → runtime-and-configuration.md`とする。
- `contract-preservation.md`は、選んだ他の完成後の姿のsectionを全て読んだ後へ置く。先に具体的な完成後の状態を示し、その後に、移行前の基準との関係、「次に書く変化以外は全て保存する」という宣言、意図して変える変化を読む。

### 前後が決まらない時の並び順

理解するための依存で前後が決まらないsectionだけを、次の順で並べる。これは全ての作業に共通する因果の順ではなく、同じ順位のsectionの前後を決めるための順である。

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

新しい完成後の姿のsectionを正式に採り入れる時は、他sectionとの書き分けだけでなく、既に分かっている前後関係と、前後が決まらない時の並び順での位置もこのREADMEへ足す。位置が決まらないままcatalogへ足さない。

### 循環した場合

`A`を理解するには`B`が必要で、`B`を理解するには`A`が必要なら、好きなfileの順で切らない。一方が始めから終わりまでの全体の概要になれる場合は、概要の側で用語と全体像を最小限だけ定義し、他方へ詳細を任せる。どちらも入口になれない場合は、どのsectionに何を書くかの分け方、共通する概念を正として書く場所、sectionの選び漏れをdiscussionへ戻す。同じ本文を両方のsectionへ写して循環を隠さない。

### 設計意図をどこに置くか

設計意図は、templateを埋めるための固定の欄ではない。次のどれかに当たり、WHATだけでは完成後の状態を正しく理解・維持できない時だけ書く。

- 複数の合理的な完成形から一つを選んだ。
- 引き換えにしたもの、または守る制約があり、WHATだけでは選んだことの強さを保てない。
- 理由を失うと、将来の変更で同じ失敗の形へ戻る可能性がある。
- 複数のsectionの組み合わせ自体に意味があり、個々のWHATだけでは全体の選択を理解できない。

機械的な結果、WHATの言い換え、既存の約束をそのまま保つだけのこと、templateの欄を埋めるための一般論には作らない。設計意図が無い場合も、空の見出しや「設計意図: なし」を作らない。

設計意図を置く時は、書き手の思考の順ではなく、読者が理解する順でWHATを先に示す。

- 一つのまとまりに固有の設計意図は、そのまとまりのWHATの直後へ置く。
- 一つのsectionに固有の設計意図は、そのsectionのWHATの直後へ置く。
- 複数のsectionに共通する設計意図は、選んだsectionを全て置いた後、第3章の末尾へ一度だけ置く。
- 同じ意図を複数の箇所へ写さない。複数の箇所を縛るなら、それらを全て含む最小の範囲へ置く。

代替案は、次を全て満たす場合だけ設計意図へ含める。

1. discussion、調査、または設計中に、実際の選択肢として具体的に検討された。
2. 採らなかった理由が合意済みであり、assistantが後から付けた推論ではない。
3. 理由を失うと、完成後の状態を読み誤るか、将来同じ案へ理由なく戻る可能性がある。
4. 最終的な状態を理解・維持するために必要であり、単なる議論の履歴ではない。

条件を満たす代替案は、関係するWHATの後で、設計意図の実際の論理構造へ組み込む。段落、入れ子の箇条書き、内容を表す固有の見出し等を選び、`設計判断`や`代替案と棄却理由`という固定の見出しや、一案一行の固定の形式を求めない。検討したが最終的な状態の理解に要らない案、以前の回の案、feedbackはdiscussionだけに置く。

designは、最終的な理由を単独で理解できる本文を持つ。discussionへのlinkは出典として添えてよいが、linkだけで理由または採らなかった理由を省かない。

### 代表パターン

#### dataを更新するAPIを画面へ適用する

画面の操作からAPIを呼び、保存するdataと表示の状態が変わる修正では、基本の形を次の順にする。

```text
interaction-flow.md
  → screen.md
  → data.md
  → caller-contracts.md
  → code-structure.md         # 責務の配置・公開入口・依存の向きも変わる場合だけ
  → contract-preservation.md  # 移行またはrefactoringの場合だけ
```

1. `interaction-flow.md`で、操作する人の操作、APIの呼び出し、成功・失敗、画面へ戻る結果までの、始めから終わりまでの全体の概要を示す。
2. `screen.md`で、初期、loading、成功、空、error等、流れの途中で見える状態と、操作できるかどうかを具体化する。
3. `data.md`で、APIの結果として保存される値、関係、更新の前後、状態の遷移、不変条件を示す。
4. `caller-contracts.md`で、画面の側が頼るAPIの名前、入力、結果、error、副作用の保証を、先に示したdataの意味へつなぐ。
5. `code-structure.md`を選ぶ場合は、外から見える挙動と保証を確定した後に、それを実現するmoduleの責務、公開入口、依存の向きを示す。
6. `contract-preservation.md`を選ぶ場合は最後に置き、ここまでに示した完成後の状態と移行前の基準の関係、保存する意味単位、意図して変える変化を読む。

#### skill方針を変更し、skill本体と利用者向けdocumentationへ反映する

skillの役割・判断の方針を変え、その方針を作業の流れ、`SKILL.md`、利用者向けのdocumentationへ反映する修正では、基本の形を次の順にする。

```text
skill-policy.md
  → caller-contracts.md       # 起動する条件、入力、結果等、呼び出し元から見える保証も変わる場合だけ
  → workflow.md               # 担当、状態、先へ進む条件、引き継ぎも変わる場合だけ
  → documentation.md
  → file-deliverables.md
  → contract-preservation.md  # 既存のskillの移動・分割・統合・形式の置き換えを伴う場合だけ
```

1. `skill-policy.md`で、完成後のskillの役割、持たせる力、判断の優先順位、受け持つ範囲、禁止、非目標を先に示す。
2. `caller-contracts.md`を選ぶ場合は、方針を、利用者から見える起動する条件、入力、結果、error、副作用の保証へ具体化する。
3. `workflow.md`を選ぶ場合は、方針と呼び出し方を、担当、状態、先へ進む条件、停止・再開、引き継ぎを持つ実行の過程へ具体化する。
4. `documentation.md`で、先に示した方針と作業の流れを、利用者が正しく判断・運用できる知識の並べ方、標準、具体例、最新に保つ方法として文書にする。
5. `file-deliverables.md`で、`SKILL.md`やtemplate等の成果物のfileが持つ見出し、内容、配置、形式を示す。方針や作業の流れの本文を写さず、file上での実現の形だけを書く。
6. `contract-preservation.md`を選ぶ場合は最後に置き、変更後のskill全体を読んだ後で、移行前の基準との保存・差分の関係を確かめる。

この例の`documentation.md`は、完成後のskillの方針と作業の流れを説明するため、それらの後に置く。documentation自体のreview・更新の作業の流れを設計する作業では、理解するための依存が逆になり、`documentation.md → workflow.md`とする。

## 追加を検討中のsection

以下は、既存のsectionへ押し込まず、独立した完成の判定と固有のtemplateが要るかを今後決める候補である。候補の名前はfile名ではない。範囲、分割・統合、正式な名前、template、catalogへの追加が合意されるまで、対応するfileを作らない。

### domainの概念の分け方・語彙・境目を決める方針

- 対象の候補: domainの概念をどう分けるか、語の意味、domainの中で共通に使う言葉、その言葉が通じる範囲の境目、同じ名前で違う意味・違う名前で同じ意味の扱い。
- 他sectionとの書き分けの候補: data schema、公開する名前、moduleの構造そのものではなく、それらを導く概念の分け方と語彙の方針。
- 未決事項: 概念の分け方の方針、語彙の方針、言葉が通じる範囲の境目の方針を一つのsectionにするか、正式な名前、必要な具体例と完成の判定。
- 議論の記録先: このplugin repositoryの`.steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/task-design-discussion.md`の論点25。

### architecture（codeの構造以外）

- 決まっている境目: code内のlayer、component／module／classの責務、directory、公開入口、依存の向き、全体の呼び出し関係は`code-structure.md`に書く。呼び出し元から見える保証は`caller-contracts.md`に書く。
- 対象の候補: processやserviceの構成、deployの単位等、codeの構造、実行環境の設定、security、performanceの各sectionだけでは完成後の全体の構成を表せない、architecture上の変化。
- 未決事項: codeの構造以外に独立したarchitectureのsectionが要るか、必要な具体case、他sectionとの書き分け、正式な名前、template。

### security

- 対象の候補: 信頼できる範囲の境目、認証・認可の方針、機密性・完全性、secretの扱い、攻撃を受けた時の失敗の状態と、後から確かめられること。
- 他sectionとの書き分けの候補: 実行環境の設定、公開するerrorの返し方、dataの不変条件、作業の流れの上の承認の判定との分け方。
- 未決事項: securityを一つのsectionにするか、脅威の洗い出しと具体的なsecurityの保証を分けるか、選ぶ条件とtemplate。

### performance

- 対象の候補: 応答時間、処理量、resourceの上限、負荷が高い時の劣化の方針、測る条件と目標値。
- 他sectionとの書き分けの候補: 実行環境の設定、dataへのaccess、画面上の待ちの状態、調査で分かったこととの分け方。
- 未決事項: performanceの目標値と、確かめた根拠を同じsectionに書くか、選ぶ条件とtemplate。

### compatibility

- 対象の候補: 呼び出し元、保存されたdata、設定、運用の手順の後方互換性と、意図して互換を崩す変更の境目。
- 他sectionとの書き分けの候補: 個々の呼び出し方と保証、dataの移行、移行での保存と差分、releaseの方針との分け方。
- 未決事項: compatibilityを複数sectionにまたがるsectionとして持つ条件、他のsectionへの参照の仕方、template。

## 候補を扱う時の制約

- 「根幹だから」「横断するから」という理由だけで、汎用のsectionへまとめない。
- 既存のsectionと異なる完成の判定、固有の失敗例、固有の書き方の手引きが要る場合だけsectionを足す。
- 未決の候補を、設計中の穴埋めに使わない。必要になった作業では、discussionで範囲と、他sectionとの書き分けを決めてから足す。
- 同じ本文を複数のsectionへ写さず、意味を正として書くsectionと、外から確かめられる結果を持つsectionを参照でつなぐ。
