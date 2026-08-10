---
name: facilitate-discussion
description: 明示された議論を論点単位で進行し、委託されたテーマ内の提案、feedback、決定、親子関係を指定directoryのMarkdownへ継続記録する。合意済みの議論も再合意なしで記録し、記録漏れへ後から気づいた場合は結論だけでなく議論の変遷を再構成するが、会話から確認できない提案や合意は補完しない。ユーザーが `$facilitate-discussion`、議論のMarkdown保存・追記を明示した時、またはconsumer skillが保存を伴う議論workflowとして明示適用した時だけ使う。通常の質問、説明、短い相談には使わない。
---

# Facilitate Discussion

## 目的と成果

明示された議論を一つのdecision単位で進行し、委託されたテーマ内で起きた完全な合意対象、feedbackによる変遷、決定を一つのdiscussion fileへ保存する。fileだけを読む人が、sessionの発言を補わずに現在案とそこへ至った過程を評価できる状態を作る。

成果は次の二つである。

- 更新されたdiscussion file
- chat上で合意された決定と具体的なネクストアクション

consumer向けの固定result schemaは設けない。一つの論点でdecisionを確定するたびに、決定後の成果物更新や後続workflowをconsumerへ返す。複数論点のdecisionをまとめてから返さない。ただし、decisionを返すことと、委託されたテーマの記録ownerを終了することは同じではない。同じテーマの議論が続く間は、このskillが記録ownerであり続ける。

## 起動gate

次のいずれかに該当するときだけ適用する。

1. ユーザーが `$facilitate-discussion` を明示した。
2. ユーザーが議論をMarkdownへ継続記録するよう明示した。
3. `task-design`、`steering` 等のconsumer skillが、保存を伴う議論workflowとして明示適用した。

通常の質問、説明、短い相談から暗黙起動してはならない。

## 責務境界

### このskillが所有するもの

- discussion fileの解決、作成、継続利用
- 論点の開始、提案、検証、feedback routing、決定
- 合意対象のself-containedな保存
- 議論履歴と現在状態の更新
- 論点採番と親子validation
- 委託されたテーマ内で前回保存後に生じた議論の検出と同期
- chat上で合意済みになった議論の再合意なしでの保存
- 記録漏れを事後検出した場合の議論の再構成
- 認識齟齬または修正要求を、具体案の前に原因ownerへroutingすること
- discussion decisionの即時反映後に行う、一回限りの`doc-enricher`提案review

### consumerが所有するもの

- 議論の起動条件
- 議論対象とconsumer固有制約のcontext
- discussion directoryの用意
- 一つの論点ごとに返されたdecisionの適用先、適用方法、適用後の再評価と後続workflow

consumerの適用先を `design.md` や `tasklist.md` に固定しない。

## 入力

明示設定は次の二つだけとする。

| 設定 | 意味 |
| --- | --- |
| `discussion_directory` | discussion fileを置く既存directory |
| `discussion_file_name` | 任意。pathを含まないbasename。defaultは `discussion.md` |

議論対象とconsumer固有制約は、現在の会話またはcallerから渡された自然言語contextとして受け取る。

`open`、`iterate`、`decide`、`reopen`、`topic_id`、`親論点`、`起点となった原文`は入力fieldではない。外部event、会話、discussion fileの現在状態から、このskillがentry procedureを選び管理する内部状態である。

## 全体の設計意図

- **discussion fileをsession外の正本にする**
  - 合意確認より前に完全な現在案を保存し、chatにしか判断対象が残らない状態を防ぐ。
- **一つのleaf論点を一つのdecisionに限定する**
  - feedbackごとにdecision scopeを再判定し、独立decisionを一つのiterationへ混ぜない。
- **履歴と現在stateを両立する**
  - 過去iteration、旧決定、却下理由を不変にし、現在の合意対象、status、決定、ネクストアクションだけを局所更新する。
- **discussion processとdomain固有workflowを分ける**
  - このskillは委託されたテーマの議論記録と決定を所有し、一つの論点を決定するたびに適用をconsumerへ返す。consumerが適用と再評価を終える前に次の論点を進めないが、同じテーマの記録ownerまでconsumerへ返さない。

## workflow全体で守る不変条件

- discussion fileをsession外の正本とする。書込み直前にfile全体を再読込し、同じfileへの書込みはsingle writerで行う。
- canonicalな `## 論点N:` とlegacyな `### 論点N:` を走査する。同じ番号が複数存在すれば全書込みを停止してユーザーへ報告し、自動修復、renumber、欠番再利用を行わない。
- 過去iteration、旧決定、却下理由を変更・削除しない。既存h1、論点順序、legacy formatも一括変更しない。
- ユーザーへ合意を求める前に、初見の読者が単独で評価できるself-containedな完全案と具体的な判断対象をdiscussion fileへ保存する。
- chatではdiscussion file名、論点番号、提案番号または見出し、判断対象を特定する。`これ`、`上記`、`大枠`のようにsessionだけで解釈する指示語で合意を求めない。
- userまたはconsumerへcontrolを返す前に、前回保存後に委託scope内で生じた議論とdiscussion fileを照合する。未収録の事象、原因、提案、feedback、訂正、合意があれば先に同期する。
- 記録漏れへ事後に気づいた場合は、最終結論だけを追記しない。確認できる履歴から議論の変遷を再構成し、事後記録であることと確認不能な範囲を明示する。
- 事後記述は書込み順序の修復であり、decisionの生成または合意の代替ではない。会話履歴から明示的な合意を確認できない提案は`決定`にせず、未決の現在案として保存する。変更済みの成果物を、合意があったことの証拠に使わない。

## 実行workflow

skill起動は一回だけ通る初期phaseである。起動後は論点levelへ進み、一つの論点を扱っている間だけ、その配下のiteration levelへ入る。iterationの判定で別decisionだと分かった場合は、skill起動へ戻らず、一段上の論点選択へ戻る。

```mermaid
flowchart TD
  S["1. skillを起動する"] --> T
  subgraph TL["2. 論点を扱う"]
    T["2.1 対象論点を選ぶ"]
    T --> C["2.1.1 必要なら原因ownerへrouting"]
    C -->|新しいdecision| N["2.2 新規論点を作る"]
    C -->|既存論点| A
    subgraph AL["2.3 選択した一つの論点を進める"]
      A["論点stateを観測する"] --> I["2.3.1 feedbackをiterationとして扱う"]
      A --> D["2.3.2 decisionを確定する"]
      A --> R["reparent・取下げ"]
    end
    I -->|別decision| T
  end
  N -->|現在案を保存| G["3. handoff前に未収録議論を同期"]
  I -->|同じdecisionの修正案を保存| G
  R -->|結果を保存| G
  D -->|decisionを保存| G
  G -->|合意待ち| W["turn終了"]
  G -->|一decisionごとに返却| H["consumerが適用・全体再評価"]
  H -->|即時反映| K["doc-enricherを一回review"]
  H -->|反映待ち・execution plan| E["skill処理終了"]
  K --> E
```

図のsubgraphはscopeの包含を表す。skill起動、論点選択、iterationを無前提な兄弟分岐として扱わない。consumerによる適用・全体再評価はこのskillの外側にある。`skill処理終了`は一回の処理の終了であり、同じテーマが継続している間の記録ownership終了を意味しない。

### 1. skillを起動する

ユーザーまたはconsumerがskillを明示適用し、discussion fileがまだ確定していないときに一度だけ入る。起動後のfeedbackごとにこのphaseを再実行しない。

#### discussion fileを解決する

1. `discussion_directory`が渡されていれば使う。未指定なら、議論を始める前に具体的なdirectory pathをユーザーへ確認する。
2. directoryが存在することを確認する。存在しなければ推測作成せず、consumerまたはユーザーへ用意・再指定を求める。
3. `discussion_file_name`がなければ`discussion.md`を使う。絶対path、`../`、`/`、`\`等のpath separatorを含む指定は拒否し、basenameを求める。
4. fileの有無によって起動variantを選ぶ。

| 起動variant | action |
| --- | --- |
| fileが存在しない | 先頭に`# 議論記録`を持つfileを新規作成する |
| fileが存在する | 全内容を保持して継続利用する。h1の追加・置換や旧formatの一括整形は行わない |

5. file全体を読み、現在のdiscussion目的、既存論点、status、決定、現在の合意対象、`親論点`、未決child、論点番号を把握する。
6. 論点番号の重複がないことを確認する。重複していれば書込みを停止し、自動修復しない。

#### 起動phaseの完了gate

target directory、discussion file、現在のdiscussion stateを一意に解決できた場合だけ論点levelへ進む。file解決だけを依頼された場合は、新規論点を作らずここでworkflowを終えてよい。

### 2. 論点を扱う

discussion fileが解決済みで、議論するdecision候補、既存論点へのfeedback、または保存済み提案への合意が到着したときに入る。ここでは一つのleaf論点を一つのdecisionとして選び、その論点が次のユーザー判断を待てる状態または終了状態になるまで扱う。

#### 論点levelで守る契約

新しいdecision候補またはfeedbackを扱うときは、次を最初に問う。

> このdecisionの結論が変わると、現在のdiscussion目的または指定parentの決定・実装範囲が変わるか。

- 変わる場合だけdiscussion scope内として論点選択へ進む。
- 変わらなければactiveな論点を作らない。consumer内部の判断またはscope外候補としてchatで区別する。
- 影響が不明ならactiveな決定論点を作らず、必要な事実と調査候補を示す。ユーザーがdiscussion scopeへ含めた場合だけ論点化する。

`独立論点` は現在のdiscussion目的には属するが、同じfile内の他論点へ直接依存しないdecisionだけを指す。discussion目的と無関係な事項の受け皿にしない。

親子関係の正本はchild entryの任意field `親論点`だけとする。parent側へ`子論点`fieldを保存せず、child側の参照から一覧を導出する。親を保存・変更する前に、次をすべて確認する。

- 直接の親は最大一つ
- 親は同じdiscussion file内に存在する
- 自己参照ではない
- 親参照を辿っても循環しない

親番号と子番号の大小は制約しない。別fileの論点は親にせず、本文からfile pathと論点番号で参照する。parent自身にも分解内容の実質的なdecisionを残す。未決childがあればparentを`子論点待ち`、全childが決定済みなら`分解済み`とする。未決child集合が変わったときだけparent statusを同期する。

#### 2.1 対象論点を選ぶ

到着したeventとfileの現在stateを比較し、どの論点を扱うかを決める。この判定がiterationより上位にあるため、iteration中に別decisionを検出した場合はここへ戻る。

| 観測した関係・state | 次に行うこと |
| --- | --- |
| activeな既存論点と同じdecisionの原因・提案・検証を変える | その論点を選び、`2.3.1 feedbackをiterationとして扱う`へ進む |
| 決定済みの既存論点と同じdecisionを変える | その論点を選び、`決定済み論点を再開するvariant`へ進む |
| 既存decisionに依存する下位decision | childとして新規論点を作る |
| 共通parentに属する別decision | siblingとして新規論点を作る |
| 複数の既存論点を規定する上位decision | 後発parentを新規作成し、必要な論点をreparentする |
| discussion目的に属し、他論点へ直接依存しないdecision | 独立論点として新規作成する |
| 保存済みの現在案への合意 | 対象論点を選び、decisionを確定する |
| 作成済み論点がdiscussion scope外と判明した | 対象論点を選び、取下げる |

#### 2.1.1 認識齟齬を原因ownerへ戻す

選んだdecisionが認識齟齬または修正要求を扱う場合は、具体案を作る前に原因を次のいずれかへ分類する。この分類は、具体ケースの症状だけを直して同じ齟齬を再発させないために行う。

| 原因owner | 判定 | discussionで先に合意するもの |
| --- | --- | --- |
| 成果物固有 | 共有知識とprocessは足りており、今回の成果物だけが合意内容から外れている | 具体ケースの修正 |
| repository知識 | codeだけでは分からない永続的な設計意図、制約、探索導線がREADMEまたは既存docsに不足している | `doc-enricher`を提案modeで起動し、具体ケースを失敗例として一般化したdocs修正 |
| skill | repositoryを問わず再発する思考、設計、discussion、実行processの問いまたは順序がskillに不足している | 具体ケースを必要性の実例とし、別domainでも機能するか検証した対応skillの修正 |

repository知識またはskillの不足では、具体ケース固有の修正を先に合意しない。原因ownerの一般則を主decisionとして合意した後、元の具体ケースをその適用例として必ず再評価する。一般則だけで変更が一意に決まらなければ、残る判断を具体ケース側のdecisionとしてdiscussionへ保存する。

一般則を先に合意することと、対象fileへ即時適用することは分ける。適用先、適用方法、適用時期はconsumerが所有する。consumerは他の未決事項との依存関係を判定し、独立していれば即時反映し、依存があれば自身のworkflowで反映待ちとして扱う。稼働中のskillまたはdocs体系自身の不備は通常、個別論点の結論から独立して存在するため、依存関係gateを通した結果として即時反映になることを基本的な期待とする。

consumerがdecisionを対象成果物へ即時反映した場合、このskillは同じテーマの次の論点を選ぶ前に、そのoriginating decisionについて`doc-enricher`を提案modeで一度だけ起動する。repository知識不足の分類時に同じoriginから起動済みなら、それを一回として数える。`doc-enricher`が提案・適用したdocs変更から同じoriginのreviewを再帰起動しない。候補があれば`doc-enricher`の承認gateに従って同じdiscussionへ提案・合意・結果を保存し、候補がなければreview済みであることだけを適用結果として保存する。

steering終了時などconsumerが持つtheme横断の`doc-enricher` reviewは、このdecision単位のreviewとは別の最終safety netである。decision単位でreview済みの候補を重複提案しない。この原因routingとdecision単位の起動条件をconsumer skillまたは`doc-enricher`へ複製しない。

#### 2.2 新規論点を作るvariant

`2.1`で新しいdecisionと判定した場合だけ入る。新規entryには`templates/discussion_entry.md`を使い、template全文を`SKILL.md`へ複製しない。

1. fileを再読込し、canonical h2とlegacy h3の最大番号を再計算する。新しい番号は最大値+1とし、既存論点がなければ`論点1`とする。
2. 表面の質問ではなく、質問が生まれた設計上の問題を`提起の背景`へ書く。
3. 具体的な事象から原因を追跡し、`根本原因0 + 提案0`へ完全な現在案、`現在の合意対象`へ同じentry内の提案参照と今回のdecision・影響範囲、検証へ提案の弱点を書く。iterationの入口gateから別decisionとして戻った場合は、`論点routingの判断`へdiscussion scopeに属する理由と、選択中だった論点とは別decisionである理由も保存する。
4. childまたは後発parentを作る場合は、論点levelの親子契約を検証する。
5. canonicalな`## 論点N: タイトル`としてfile末尾へ追加する。childを追加した場合だけparent statusを同期する。
6. 保存後にdiscussion file名、論点番号、提案番号または見出し、判断対象をchatで具体的に示し、合意を求める。

review起点の最上位論点では、ユーザーの言葉を`起点となった原文`へ変更せず保存する。独立したfeedback ledgerや`FB-N`を作らない。一つのfeedbackから複数decisionが生じる場合は、原文と分解自体の実質的なdecisionを持つparentを作り、leafごとにchildへ分ける。複数feedbackが一つのdecisionへ収束する場合は、一つの論点内に複数の原文を保持できる。

新しい一decisionの完全な現在案がactiveな論点として保存され、具体的な合意確認をchatへ返した時点で、このvariantを抜ける。

#### 2.3 選択した一つの論点を進める

`2.1`で既存論点を選んだ後に入る。論点の現在stateと到着したeventに応じて、このscope内の処理を選ぶ。

##### 2.3.1 feedbackをiterationとして扱う

`2.1`でactiveな既存論点を選び、その論点へのfeedbackを処理するときだけ入る。feedbackを受けた時は、iterationを追加する前に必ずこの分類をやり直す。

###### iterationの入口gate

| feedbackの判定 | 遷移 |
| --- | --- |
| 選択中のactive論点と同じdecisionの原因・提案・検証を変える | 同じ論点へiterationを追記する |
| child・sibling・後発parent・独立論点にあたる別decision | iterationを追加せず、一段上の`2.1 対象論点を選ぶ`へ戻る |
| 選択中の論点が決定済みで、同じdecisionを変更する | `決定済み論点を再開するvariant`へ進む |
| 作成済み論点自体がdiscussion scope外と判明した | iterationを追加せず、`scope外の既存論点を取り下げる`へ進む |
| discussion目的へ影響しない別事項 | activeな論点を作らず、chatでscope外と示す |

このgateはiterationの所属先を決める。skill起動済みという前提やtarget fileの解決を毎回分岐させない。

###### 同じdecisionへiterationを追記する

1. feedbackを受けた時点の事象と検証結果を保存する。
2. `論点routingの判断`に、現在のdiscussion scopeへ属する理由と、同じdecision scopeとしてiterationを継続する理由を書く。
3. 原因または提案のどのlevelへ戻るかを書く。
4. `変更点`へ前案との差分を書く。
5. `提案N（現時点）`へ差分ではなく修正後の完全な現在案を書く。
6. `現在の合意対象`を新しい提案参照と具体的な判断対象へ局所更新する。
7. fileへ保存してから、discussion file名、論点番号、提案番号または見出し、判断対象をchatで具体的に示し、合意を求める。

過去iteration、却下理由、誤っていた認識は変更・削除しない。複数decisionを一つのiterationへ混ぜない。同じdecision scopeの完全な修正案と判断対象が保存された時点で、このprocedureを抜ける。

###### 決定済み論点を再開するvariant

1. feedbackが以前のdecisionと同じscopeを変更することを確認する。別decisionならiterationを追加せず`2.1 対象論点を選ぶ`へ戻る。
2. 以前の決定と変更理由を、新しいiterationの中へ保存する。
3. 同じiteration内で事象、routing判断、遡及level、変更点、完全な現在案、検証を記録する。
4. 現在の合意対象とstatusをactiveな状態へ局所更新してから、具体的に合意を求める。

現在stateだけを上書きして旧決定を失わせない。再開用iterationとfeedback用iterationを同じfeedbackから二重に作らない。旧決定を履歴に残したまま論点がactiveな合意待ちへ戻った時点で、このvariantを抜ける。

##### 2.3.2 合意したdecisionを確定する

ユーザーがfileへ保存済みの現在案へ合意した場合だけ行う。

1. 合意対象がdiscussion file、論点、提案まで一意に特定できることを確認する。特定できなければ更新せず、対象の明示を求める。
2. 同じturnで対象論点の`ステータス`、`決定`、`ネクストアクション`を局所更新する。
3. 未決child集合が変わる場合だけparent statusを導出する。
4. 更新済みfileと決定・ネクストアクションをchatで示し、決定後の成果物更新、phase遷移、実装開始をconsumerへ返す。
5. 別の論点を選ばず、`3. handoff前に委託scopeの記録を同期する`へ進む。consumerがdecisionを適用して全体状態を再評価する間も、同じテーマの議論記録はこのskillのownershipに残る。

`ネクストアクション`にはconsumerが実際に適用するpathまたはworkflowと処理を書く。適用先がない場合は`なし`とする。このskillが決定後の適用を自動実行しない。

##### 2.3.3 論点をreparentする

`2.1`で新しい上位decisionまたは親変更が必要だと判定した場合だけ行う。

1. 新しいparentがまだ存在しなければ、`2.2 新規論点を作るvariant`で実質的な分解decisionを持つ後発parentを先に作る。
2. 新parentが同じdiscussion file内に存在し、一親、自己参照禁止、循環禁止を満たすことを検証する。失敗した場合は参照を変更しない。
3. childの新しいiterationへ、旧parentと変更理由を保存する。
4. child側の`親論点`だけを更新する。parent側へ`子論点`fieldを追加しない。
5. 旧parentと新parentの未決child集合が変わった場合だけ、それぞれのstatusを同期する。

##### 2.3.4 scope外の既存論点を取り下げる

作成済み論点が現在のdiscussion目的または指定parentの決定・実装範囲へ影響しないと判明した場合だけ行う。作成済み論点がscope外と判明した場合は履歴を削除しない。

1. scope外である事象と理由を、新しいiterationへ保存する。
2. 現在の決定とネクストアクションを、取下げと終了が分かる内容へ局所更新する。
3. 未決child集合が変わる場合だけparent statusを同期し、chatで取下げ理由を具体的に示す。

##### 2.3.5 chat上で合意済みのdiscussionを記録する

委託されたテーマ内の議論がdiscussion fileへ未収録のままchat上でdecisionまで到達した場合に使う。成果物へ反映済みかどうかは、このvariantへ入る条件を変えない。

このvariantへ入る前に、対象となる具体的な提案と、それに対するユーザーの明示的な合意をchat履歴から特定する。`続けて`、無反応、異議がなかったこと、抽象的な先行decision、assistantだけの推論を、未提示の具体案への合意へ変換しない。明示的な合意を特定できない場合はこのvariantを使わず、確認できた事実、assistantの未合意提案、先行して行ったactionを分けて未決の論点またはiterationへ保存し、合意を求める。

1. 未収録の発言とfileの現在stateを比較し、`2.1 対象論点を選ぶ`の既存routingで、既存論点のiterationか新規論点かを決める。
2. 起点となった原文、事象、当初の原因認識と提案、検証、user feedback、誤っていた認識、修正後の完全な提案を、確認できる時系列どおりに保存する。
3. chat上で成立した合意を`決定`へ、そのdecisionから生じる処理を`ネクストアクション`へ保存し、statusを確定する。
4. 同じdecisionへの合意を取り直さない。記録のために新しい判断を加える必要が生じた場合だけ、その追加判断を現在の合意対象として保存して確認を求める。
5. 結論だけの要約、変更file一覧、反省だけを議論の記録として扱わない。

このvariantは、合意前に完全案を保存する通常経路の代替ではない。通常経路で記録を先に行うことを基本とし、chat上で合意が先に成立した場合または記録漏れへ後から気づいた場合の回復に使う。

#### 論点levelの完了gate

次のいずれかが成立したら、選択中の論点を扱う処理を抜ける。

- 完全な現在案を保存し、具体的な合意確認をchatへ返した。
- 合意されたdecision、status、ネクストアクションを同じturnで保存した。
- 履歴を保持したままreparentまたは取下げの結果を保存した。
- feedbackが別decisionに属すると判定し、iterationを作らず`2.1 対象論点を選ぶ`へ戻した。

feedbackが別decisionに属すると判定された場合だけ、decision未確定のまま`2.1`へ戻る。いずれかの条件を満たしても、userまたはconsumerへ返す前に`3. handoff前に委託scopeの記録を同期する`を通る。一つの論点のdecisionを確定した後は、未決の別論点が残っていてもその論点を進めず、同期だけを完了してconsumerまたはユーザーへ返す。直接起動時は、次の明示的な入力が来るまで別論点へ進まない。

### 3. handoff前に委託scopeの記録を同期する

このphaseは、提案への合意確認、decision、reparent、取下げ、scope外報告、consumerへのネクストアクションのいずれを返す場合にも最後に通る。目的は新しいdecisionを無理に作ることではなく、委託されたテーマで実際に起きた議論をdiscussion fileから落とさないことである。

#### 3.1 通常の同期

1. discussion fileを再読込する。
2. 前回のfile保存後に委託scope内で生じたuser発言とassistantの提案を確認する。
3. fileへ未収録の事象、原因、提案、反論、訂正、合意があるかを確認する。
4. 未収録内容が現在扱ったdecisionと同じなら、必要な内容をその論点へ保存する。別decisionなら、現在のdecisionへ混ぜず`2.1`のroutingで別論点へ保存する。
5. chat上で合意済みの未収録discussionには`2.3.5`を使い、再合意せずdecisionまで保存する。
6. 未収録がないことを確認してからhandoffする。

成果物変更をネクストアクションとして返す場合は、その変更の理由になった議論が、原文からdecisionまで同じdiscussion fileで追えることを確認する。保存済みdecisionとの対応が一対一で、新しいscope、routing、方針、成果物、実行単位を一切決めない適用だけは、新しい論点にしない。対応付けに具体的な判断が一つでも必要なら「既存decisionの機械的適用」と呼んでdiscussionを省略せず、現在案として提示・保存して合意を得る。議論を伴わない誤字・format・linkの修正は新しい論点にしない。

#### 3.2 記録漏れの事後reconstruction

成果物変更または別の処理へ進んだ後に未収録の議論へ気づいた場合は、通常の次論点を進める前に次を行う。

1. chat履歴、変更前後の成果物、discussion file、実際の変更差分を照合する。
2. 起点となった発言、当初認識、当初提案、feedback、誤っていた認識、修正過程、合意したdecision、すでに反映した成果物を時系列で再構成する。
3. 既存decisionの修正ならiteration、別decisionなら新規論点として保存する。
4. `事後記録`であること、記録漏れへ気づいた契機、すでに反映済みの成果物を明記する。あたかも成果物反映前に保存していたように履歴を偽装しない。
5. ユーザー発言、assistantの提案、観測事実、合意済みdecision、未合意の推論を区別する。成果物の存在や変更結果から、提示していない提案または得ていない合意を逆算しない。
6. chat履歴から対象となる具体案への明示的な合意を特定できない場合は、`合意なし`または`確認不能`と明記してstatusを未決にする。先行actionがあればprocess逸脱として記録し、事後記述によって正当化しない。
7. chat履歴や変更前状態が失われている場合は、確認不能な範囲を明記し、もっともらしい内容で補完しない。
8. 最終結論のsnapshot、変更file一覧、現在のassistantによる反省だけでは完了扱いにしない。実際に行われた起点、当初認識、当初提案、feedback、修正過程、合意、事後状態が追えることを確認する。実際には存在しない段階は創作せず、存在しなかったこと自体を記録する。

#### 3.3 handoff完了gate

次をすべて満たした場合だけuserまたはconsumerへcontrolを返す。

- 委託scope内で前回保存後に生じた記録価値のある議論がdiscussion fileへ同期されている。
- 合意済みdiscussionは再合意なしで`決定`と`ネクストアクション`まで保存されている。
- `決定`とした各内容について、対象となる具体案と明示的な合意をchat履歴から追跡できる。追跡できない内容は未決として分離されている。
- 事後reconstructionを行った場合は、議論の変遷、事後記録であること、反映済み成果物、確認不能な範囲が記録されている。
- 議論の結論だけでなく、そこへ至る原文、提案、feedbackをfileだけから追える。
