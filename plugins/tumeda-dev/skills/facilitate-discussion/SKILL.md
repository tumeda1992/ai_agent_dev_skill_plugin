---
name: facilitate-discussion
description: 明示された議論を論点単位で進行し、委託されたテーマ内の提案、feedback、決定、親子関係を指定directoryのMarkdownへ継続記録する。合意済みの議論も再合意なしで記録し、記録漏れへ後から気づいた場合は結論だけでなく議論の変遷を再構成するが、会話から確認できない提案や合意は補完しない。ユーザーが `$facilitate-discussion`、議論のMarkdown保存・追記を明示した時、またはconsumer skillが保存を伴う議論workflowとして明示適用した時だけ使う。通常の質問、説明、短い相談には使わない。
---

# Facilitate Discussion

## 目的と成果

明示された議論を一つのdecision単位で進行し、判断可能な提案・認識合わせ、応答、決定をdiscussion fileへ保存する。
内部の調査・訂正・再判定・検証は論点ごとの内部検討記録へ保存する。
discussionだけで各回の問いを理解して判断・応答でき、内部検討記録だけでも検討過程と限界を追える状態を作る。
linkは詳細証跡への導線であり、説明を省く理由にしない。

成果は次の三つである。

- 更新されたdiscussion file
- 同じownerが管理する論点ごとの内部検討記録
- chat上で合意された決定とconsumerへの具体的なhandoff

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
- 論点の開始、提案、必要な認識合わせ、検証、feedback routing、決定
- 各proposalと決定のself-containedな保存
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
  - 合意確認より前に、その回の問いを判断できるproposalと背景を保存し、chatにしか判断対象が残らない状態を防ぐ。
- **一つのleaf論点を一つのdecisionに限定する**
  - feedbackごとにdecision scopeを再判定し、独立decisionを一つのiterationへ混ぜない。
  - 限定するのは、decisionごとに合意の可否が独立しているためである。二つを一つの提案へ入れると、片方だけを却下できない。ユーザーは全体を却下するか、どこが問題かを自分で切り分けて伝えるかを選ばされる。
  - 論点を分けると論点数が増え、往復が増える。これは分けない理由にならない。往復を減らしたいなら、未決事項をTBDのまま暫定全体として提示し、構造への合意を先に取る。一つの提案へ複数decisionを詰めることは、往復を減らさずに合意の粒度だけを粗くする。
- **履歴と現在stateを両立する**
  - 応答確定後の過去iterationを不変にし、activeな末尾提示、status、現在有効な決定、必要時だけ置く再開条件を局所更新する。
- **discussion processとdomain固有workflowを分ける**
  - このskillは委託されたテーマの議論記録と決定を所有し、一つの論点を決定するたびに適用をconsumerへ返す。consumerが適用と再評価を終える前に次の論点を進めないが、同じテーマの記録ownerまでconsumerへ返さない。

## workflow全体で守る不変条件

- discussion fileを判断context・応答・decisionの正本、内部検討記録をprocess evidence・中断復帰の正本とする。書込み直前に対象file全体を再読込し、二層とも同じownerがsingle writerで更新する。
- canonicalな `## 論点N:` とlegacyな `### 論点N:` を走査する。同じ番号が複数存在すれば全書込みを停止してユーザーへ報告し、自動修復、renumber、欠番再利用を行わない。
- feedback確定後の過去iteration、却下理由、当時の判断内容を変更・削除しない。既存h1、論点順序、legacy formatも一括変更しない。
- entry末尾の未決提案が判断対象になるため、同じ内容を上部へ複製しない。
- ユーザーへ提示する前に、その回の問いを初見の読者が単独で評価できる提案または必要な認識合わせ、検討記録、対応する空の応答見出しをdiscussion fileへ保存する。完全状態そのものが判断対象の時だけ完全版を要求する。
- 提案保存前にも「decisionの境界を判定する」を通す。別decisionがあれば対象論点の選択へ戻す。event到着後に自分で案へ追加した別decisionを見逃さないためであり、本体の判断材料確認とは別のgateとして両方を通る。
- iterationを重ねた提案では、論点のタイトルが問うている範囲と、いま書いている提案の範囲を照合する。iterationごとに小さく足していると、累積して別decisionへ届いていることに気づけない。タイトルが「対象のどれを扱うか」を問うているのに、提案が「対象をどう分割し、どちらを先に扱うか」まで決めていれば、範囲を越えている。どれを扱うかへの答えは対象の特定であり、分割と順序は別のdecisionである。
- chatではdiscussion file名、論点番号、提案番号または見出し、判断対象を特定する。`これ`、`上記`、`大枠`のようにsessionだけで解釈する指示語で合意を求めない。
- discussion fileとchatへ出す図は、raw textのまま読める形にする。アスキーアートを第一選択とし、mermaidはtextでは関係を保ったまま表せない複雑さがあり、かつ読み手の環境でrenderされる場合だけ使う。`text`のコードブロックへmermaid記法を入れる形は使わない。fileとしてもchatとしても図にならない。対象はflow、状態遷移、依存関係、構成を含む図全般である。
  - これは、ユーザーの判断interfaceを未renderのままでも読めるようにする、discussion fileとchatに限った例外である。`expression_notation.md` の「図にするか」の選択は維持し、図の描画方式だけを上書きする。
  - 内部logにはこの例外を広げず、同標準の記法選択と描画方式に従う。図を使うこと自体を全記録へ要求しない。
- 成果物へ書く前に、その記述が機密情報にあたるかを [`confidentiality.md`](../../docs/documentation_standards/confidentiality.md) の判定で確認する。調査は網羅的に行ってよいが、成果物へ書く時点では別の判断が要る。判定の中身は同 file が正本であり、ここへ写さない。
- userまたはconsumerへcontrolを返す前に、前回保存後に委託scope内で生じた議論とdiscussion fileを照合する。未収録の事象、原因、提案、feedback、訂正、合意があれば先に同期する。
- 記録漏れへ事後に気づいた場合は、最終結論だけを追記しない。確認できる履歴から議論の変遷を再構成し、事後記録であることと確認不能な範囲を明示する。
- 事後記述は書込み順序の修復であり、decisionの生成または合意の代替ではない。会話履歴から明示的な合意を確認できない提案は`決定`にせず、未決proposalとして保存する。変更済みの成果物を、合意があったことの証拠に使わない。


## 実行経路

同じ実行者がこのhandler、本体、回復を実行する。別skill・agent・state正本へ委譲しない。

skill起動は一回だけ通る初期phaseである。起動後は論点levelへ進み、一つの論点を扱っている間だけ、その配下のiteration levelへ入る。
skill起動、論点選択、iterationを無前提な兄弟分岐として扱わない。consumerによる適用・全体再評価はこのskillの外側にある。

```text
一度だけ起動 → file解決 → 論点選択・原因owner判定
                           ├─ 通常提示・応答 → iteration.md
                           ├─ decision確定・reparent・取下げ・現在state更新
                           └─ 未収録履歴の検出 → record-recovery.md
                                  ↓ いずれもhandlerへ戻る
                    通常同期 → 提示して待つ／一decisionをconsumerへ返す／停止
                                  ↓ consumerの適用・全体再評価後
                         origin review → 次の論点選択
```

本体へ入る直前に [iteration.md](iteration.md) 全文を読む。回復対象を検出した時だけ [record-recovery.md](record-recovery.md) 全文を読む。入口を選ぶために回復fileの読取を要求しない。
本体内の応答から次準備ではこの起動をやり直さない。必須fileが読めなければ対象・理由・未同期範囲を示して停止し、記憶や要約で代行しない。

### 書込対象を範囲限定する

#### 保存までの順序

1. 各書込み直前に対象file全体を再読込する。code fence・引用・HTML comment内の例を除き、canonical h2とlegacy h3の実論点を走査する。
2. 論点→必要なら回→欄の順に範囲を限定する。完全な番号、役割、所属suffix、終端と周辺文脈を照合し、先頭一致・部分一致で選ばない。
3. 更新なら既存欄を一意に特定する。追加なら次の挿入位置と未作成を確認する。
   - 新論点: 最大値+1を採番し、file末尾へ追加する。
   - 次の回: 対象論点の現在state直前へ追加する。
   - 欄: 同じ回の該当位置へ追加する。
4. 保存後に差分を確認する。対象欄・現在state・必要な親status以外が変わらず、過去履歴が保たれていなければ、正常完了として先へ進まない。

#### 停止する不整合

- 論点番号重複: 同期を含む全書込みを停止する。
- 更新対象の既存欄が不在・複数・所属不整合: その更新を停止し、自動修復しない。
- 追加予定の欄が既存: 中断復帰か不整合かを判定してから進む。正常な未作成は停止理由にしない。

#### fileごとの見出しと説明変数

- 新規file: templateの所属suffixと深度を使う。
- 既存file: 新しい論点・回も現在の識別表記と兄弟深度へ合わせ、配下を同じ段数移す。新方式の継続は新方式を保ち、過去見出しを一括変換しない。
- templateの説明変数: Nは論点、Iは共通の回、Mは親であり、実番号へ置き換える。

#### statusの表示と導出

表示値は `応答待ち / 調査中 / 子論点待ち / 決定 / 保留 / 分解済み` とする。
本文・応答・会話が正本であり、旧`提案中`を含む値だけで判断しない。
親子導出を通常のstatus更新より優先する。

### 二層の保存先と読取範囲を解決する

discussionはテーマの判断interface、内部logは一つの論点の過程であり、論点番号・stateを内部logから逆算しない。
対象論点を選んだ後、既存の接続があればそのlogを継続利用する。新規logだけをdiscussion directory内の `internal-records/{D}.topic-{N}.md` へ置く。
Dは解決済みdiscussion basename全体（拡張子も保持）、Nはdiscussionの実論点番号である。
例えば `task-design-discussion.md` の論点3なら `internal-records/task-design-discussion.md.topic-3.md` となる。
必要な内部directoryはこの派生保存先として作成できるが、入力discussion directory自体を推測作成しない。

- 所属の確認
  - discussionからのlinkとlog先頭のdiscussion・論点表示を照合する。既存logが二つある、所属が違う、名前長等で書けない時は停止する。
  - 短縮名や別名へ逃げて二つ目の正本を作らず、過去の暫定名を命名統一だけのために移動しない。
- 必要な読取
  - discussion全文に加え、対象logを全文読む。新規なら未作成を確認する。
  - 他論点の根拠を使う場合は、そのdiscussionの現在decisionと当該log全文へ広げ、後続訂正と参照を辿る。無関係な全logの毎回読取は要求しない。
  - 必須fileや根拠を読めなければ確認済みと扱わず、未同期・未確認と停止理由を返す。
- 位置の識別
  - discussionから `#iteration-I`、個別根拠は `#iteration-I-record-R` を指す。Rはその回内で1始まりとし、進捗flagではない。
  - labelにも論点・回・必要ならrecord番号を示す。logからはdiscussionへの相対linkと実論点番号で戻れるようにする。
  - pathの特殊文字はsegmentごとにpercent-encodeし、実file名を変更しない。anchorとsemantic titleは分離し、曖昧なlegacy見出しslugを推測しない。

logを書き込む時も全文再読込から論点・回・記録単位の所属と一意性を検査し、新規なら未作成と挿入先を確認する。
現在の記録単位へ結果を加えることはできるが、次の処理へ進んだ単位の訂正は新しい記録から元を指す。
検討記録の入力・結果・訂正・discussion背景を書く直前には毎回 [expression_notation.md](../../docs/documentation_standards/expression_notation.md) を全文読む。
単純な並列は箇条書き、短い補足を持つものはネスト、独立した話題へ育ったものは見出しへ分け、因果を長い散文一塊へ潰さない。
この記法指定だけを理由に記録後の追加reviewを新設しない。既存のemit gateは維持する。

## discussion fileを解決する

ユーザーまたはconsumerがskillを明示適用し、discussion fileがまだ確定していないときに一度だけ入る。起動後のfeedbackごとにこのphaseを再実行しない。

1. `discussion_directory`が渡されていれば使う。未指定なら、議論を始める前に具体的なdirectory pathをユーザーへ確認する。
2. directoryが存在することを確認する。存在しなければ推測作成せず、consumerまたはユーザーへ用意・再指定を求める。
3. `discussion_file_name`がなければ`discussion.md`を使う。絶対path、`../`、`/`、`\`等のpath separatorを含む指定は拒否し、basenameを求める。
4. fileの有無によって起動variantを選ぶ。

| 起動variant | action |
| --- | --- |
| fileが存在しない | 先頭に`# 議論記録`を持つfileを新規作成する |
| fileが存在する | 全内容を保持して継続利用する。h1の追加・置換や旧formatの一括整形は行わない |

5. file全体を読み、現在のdiscussion目的、既存論点、status、末尾のiterationとfeedback状態、決定、再開条件、`親論点`、未決child、論点番号を把握する。
6. 論点番号の重複がないことを確認する。重複していれば書込みを停止し、自動修復しない。

### 解決の完了gate

target directory、discussion file、現在のdiscussion stateを一意に解決できた場合だけ論点levelへ進む。file解決だけを依頼された場合は、新規論点を作らずここでworkflowを終えてよい。


## 対象論点を選ぶ

### decisionの境界を判定する

ユーザーが「ここは良いがここは違う」と言える箇所を数える。二つ以上なら独立して却下できるdecisionとして分け、child、sibling、独立論点へroutingする。

### scopeと親子関係

discussion fileが解決済みで、議論するdecision候補、既存論点へのfeedback、または保存済み提案への合意が到着したときに入る。
ここでは一つのleaf論点を一つのdecisionとして選び、その論点が次のユーザー判断を待てる状態または終了状態になるまで扱う。

新しいdecision候補またはfeedbackを扱うときは、次を最初に問う。

> このdecisionの結論が変わると、現在のdiscussion目的または指定parentの決定・実装範囲が変わるか。

- 変わる場合だけdiscussion scope内として論点選択へ進む。
- 変わらなければactiveな論点を作らない。consumer内部の判断またはscope外候補としてchatで区別する。
- 影響が不明ならactiveな決定論点を作らず、必要な事実と調査候補を示す。ユーザーがdiscussion scopeへ含めた場合だけ論点化する。

`独立論点` は現在のdiscussion目的には属するが、同じfile内の他論点へ直接依存しないdecisionだけを指す。discussion目的と無関係な事項の受け皿にしない。
一括proposalから独立decisionを分ける場合は、枝labelを付けた同一論点内sectionにせず、次の連番を持つ別論点にする。

親子関係の正本はchild entryの任意field `親論点`だけとする。parent側へ`子論点`fieldを保存せず、child側の参照から一覧を導出する。親を保存・変更する前に、次をすべて確認する。

- 直接の親は最大一つ
- 親は同じdiscussion file内に存在する
- 自己参照ではない
- 親参照を辿っても循環しない

親番号と子番号の大小は制約しない。別fileの論点は親にせず、本文からfile pathと論点番号で参照する。parent自身にも分解内容の実質的なdecisionを残す。未決childがあればparentを`子論点待ち`、全childが決定済みなら`分解済み`とする。未決child集合が変わったときだけparent statusを同期する。

### eventから所属を選ぶ

到着したeventとfileの現在stateを比較し、どの論点を扱うかを決める。この判定がiterationより上位にあるため、iteration中に別decisionを検出した場合はここへ戻る。

| 観測した関係・state | 次に行うこと |
| --- | --- |
| activeな既存論点と同じdecisionの原因・提案・検証を変える | その論点を選び、本体の「既存提示への応答を扱う」へ進む |
| 決定済みの既存論点と同じdecisionを変える | その論点を選び、本体の提示準備へ再開差分を渡す |
| 既存decisionに依存する下位decision | childとして新規論点を作る |
| 共通parentに属する別decision | siblingとして新規論点を作る |
| 複数の既存論点を規定する上位decision | 後発parentを新規作成し、必要な論点をreparentする |
| discussion目的に属し、他論点へ直接依存しないdecision | 独立論点として新規作成する |
| 保存済みproposalへの合意 | 対象論点を選び、本体の応答入口で合意を一度保存してからdecisionを確定する |
| 作成済み論点がdiscussion scope外と判明した | 対象論点を選び、取下げる |

表で対象論点を決めた後、本体の提示準備または選択した論点の処理へ進む前に必ず「認識齟齬を原因ownerへ戻す」を通る。「認識齟齬を原因ownerへ戻す」で原因を分類するのは認識齟齬または修正要求を扱う場合だけだが、**該当するかどうかの判定自体は全経路で行う**。表の「次に行うこと」列が指す遷移先は、この判定を終えた後の行き先である。

### 認識齟齬を原因ownerへ戻す

選んだdecisionが認識齟齬または修正要求を扱う場合は、具体案を作る前に原因を次のいずれかへ分類する。この分類は、具体ケースの症状だけを直して同じ齟齬を再発させないために行う。

認識齟齬に該当するかは次で判定する。

> このfeedbackは、提案の選好を変えたのか。それとも提案が依拠していた前提知識の誤りを正したのか。

後者なら認識齟齬である。assistantが「より良い案へ差し替えた」と感じている時ほど、実際には前提が誤っていた場合がある。差し替えた提案の内容ではなく、**差し替える理由になった知識がどこから来たか**で判定する。その知識をassistantが持っていなかったなら、成果物固有ではなくrepository知識またはskillの不足である。

| 原因owner | 判定 | discussionで先に合意するもの |
| --- | --- | --- |
| 成果物固有 | 共有知識とprocessは足りており、今回の成果物だけが合意内容から外れている | 具体ケースの修正 |
| repository知識 | codeだけでは分からない永続的な設計意図、制約、探索導線がREADMEまたは既存docsに不足している | `doc-enricher`を提案modeで起動し、具体ケースを失敗例として一般化したdocs修正 |
| skill | repositoryを問わず再発する思考、設計、discussion、実行processの問いまたは順序がskillに不足している | 具体ケースを必要性の実例とし、別domainでも機能するか検証した対応skillの修正 |

repository知識またはskillの不足では、具体ケース固有の修正を先に合意しない。原因ownerの一般則を主decisionとして合意した後、元の具体ケースをその適用例として必ず再評価する。一般則だけで変更が一意に決まらなければ、残る判断を具体ケース側のdecisionとしてdiscussionへ保存する。

ここでいう一般則は、原因ownerのdocsまたはskillへ実際に書き込む修正内容そのものを指す。原因の分類結果、抽象的な規則文、再発防止の方針だけを`提案N`へ置かない。どのfileのどの位置へ何を書き、何を削るかを読者が判断できる修正案として提示する。原因の分類と追跡は、その修正案がなぜ必要かを示す`検討記録`が所有する。

一般則を先に合意することと、対象fileへ即時適用することは分ける。適用先、適用方法、適用時期はconsumerが所有する。consumerは他の未決事項との依存関係を判定し、独立していれば即時反映し、依存があれば自身のworkflowで反映待ちとして扱う。稼働中のskillまたはdocs体系自身の不備は通常、個別論点の結論から独立して存在するため、依存関係gateを通した結果として即時反映になることを基本的な期待とする。

consumerがdecisionを対象成果物へ即時反映した場合、このskillは同じテーマの次の論点を選ぶ前に、そのoriginating decisionについて`doc-enricher`を提案modeで一度だけ起動する。repository知識不足の分類時に同じoriginから起動済みなら、それを一回として数える。`doc-enricher`が提案・適用したdocs変更から同じoriginのreviewを再帰起動しない。候補があれば`doc-enricher`の承認gateに従って同じdiscussionへ提案・合意・結果を保存し、候補がなければreview済みであることだけを適用結果として保存する。

steering終了時などconsumerが持つtheme横断の`doc-enricher` reviewは、このdecision単位のreviewとは別の最終safety netである。decision単位でreview済みの候補を重複提案しない。この原因routingとdecision単位の起動条件をconsumer skillまたは`doc-enricher`へ複製しない。


## 選択した論点を進める

### 共通本体へ接続する

handlerから [iteration.md](iteration.md) 全文を読んで、次のいずれかへ入る。入力は外部APIではなく同じownerが保持する実stateである。

| 入口 | 引き継ぐ状態 |
| --- | --- |
| 次の提示を準備する | 解決済みfile、目的・consumer制約、選択したdecision、新規／継続／再開の関係、実際の発言・evidence。新規では未採番、既存では番号・履歴・末尾応答・現在state・親子を特定する |
| 既存提示への応答を扱う | 同じ前提に加え、評価された提示の種類・番号と未処理の応答。合意だけでもまず対応先を一意にする |

本体からは、提示保存、合意保存、別decision、scope外、外部停止、state不整合、未収録履歴のどれかとして戻る。固定result schemaは作らない。合意保存なら直ちに下の確定へ、別decisionなら起動でなく論点選択へ、scope外なら取下げへ、未収録履歴なら回復へ進む。
外部停止・明示保留ではstatusを保留にし、必要な時だけ下の再開条件を保存する。親子導出がある場合はそちらを優先する。通常の応答待ちを保留へ変えない。
状態不明や書込み失敗では二層の実file、tool結果、会話を照合し、盲目的に追記しない。
同じ中断処理は保存された本文、tool結果、会話を照合して未完位置へ戻る。実行済みか、提示済みか不明な時は停止し、処理を盲目的に繰り返さない。
未保存のdecisionを適用可能な結果として返さない。

### 合意したdecisionを確定する

保存済みの具体案と明示合意が一意な時だけ行う。認識合わせの回答や作業再開指示から未提示案への合意を補完しない。
合意のfile・論点・提案が不明なら更新せず確認する。本体または回復で保存済みの同じ結果を重複記録せず、そのturnで現在有効な決定とstatusを更新する。
[templates/discussion_entry.md](templates/discussion_entry.md) 全文を読み、「決定」のcode blockを全iterationの後へ置く。過去の部分判断を加算せず、現在有効な結論をself-containedに書く。任意の仮決定は外す。受容された弱点はデバッグ経緯でなく現在契約の制約・選択理由として残す。未決child集合が変わる場合だけ親statusを導出する。
記録同期を通して一decisionずつconsumerへ具体的にhandoffする。適用先をdesignやtasklistへ固定せず、このskillが適用を自動実行しない。
consumerがdecisionを適用して全体状態を再評価するまで次論点へ進まない。即時反映なら、上の原因owner節に定めたorigin単位のdoc-enricher提案reviewを一度だけ行う。
次論点が依存から一意ならその提案まで同じturnで進み、次の合意を待つ。同じturnで次decisionを確定しない。候補の上位関係かscopeが不明な場合だけ次の対象を問う。

### 必要な現在stateを扱う

`templates/discussion_entry.md` 全文を読み、必要な名前のcode blockだけを使う。全entryへ空の欄を置かず、現在stateは全iterationの後へ置く。
templateの任意`仮決定`は、[仮決定](templates/discussion_entry.md#仮決定) の形を現在成立する内容の要約が理解を助ける時だけ使う。過去の部分判断を機械的に加算せず、無効になった内容は外す。履歴は過去の回へ保持し、判断の足跡が役立つ時だけ典拠を付ける。最終合意で外す。
templateの`再開条件`は、[再開条件](templates/discussion_entry.md#再開条件) の形を同じ未決decisionが外部event・action・権限等で止まり、entryだけでは停止理由と再開位置を特定できない時だけ使う。固定小fieldへ分けない。通常応答待ち、consumer反映待ち、完了、直後の移動には置かない。条件成立は新しい検討記録へ接続して現在条件を外す。委譲自体が結論なら決定に書く。
固定の`ネクストアクション`fieldはentryへ置かない。次の焦点は末尾のactiveな提示、順序・委譲先の合意は決定、停止と不可分の再開判断は再開条件へ置き、具体的handoffはchatへ返す。
別topicがdecision境界を保ったままpath・語彙等を具体化した場合は、先行topicの現在決定だけを典拠付きで同期する。置換理由と影響範囲は後続topicが所有する。先行topicの過去の回を変更・追加せず、境界が変わるなら再開／別論点へroutingする。`以前の決定`、`決定（更新）`、`決定（最終）`を並べない。

### 論点をreparentする

「対象論点を選ぶ」で新しい上位decisionまたは親変更が必要だと判定した場合だけ行う。

[templates/discussion_entry.md](templates/discussion_entry.md) 全文を読み、回の骨子・提案本文・空の提案応答欄・受領応答の本文を使う。本文は同じ回の検討記録の前、対応する応答欄は後へ置き、現在stateより前へ回を加える。別decisionの機械的反映なら結果まで保存し、通常提示の準備loopへ戻さない。
この処理で新たな調査・判断過程を記録する場合も、内部logの保存形を全文読み、実施前入力→結果保存→discussion背景という境界を使う。単なる既決decisionの反映に不要な内部loopを作らない。

1. 新しいparentがまだ存在しなければ、「共通本体へ接続する」の新規入口で実質的な分解decisionを持つ後発parentを先に作る。
2. 新parentが同じdiscussion file内に存在し、一親、自己参照禁止、循環禁止を満たすことを検証する。失敗した場合は参照を変更しない。
3. childの新しいiterationを`templates/discussion_entry.md`のiteration以下と`templates/discussion_entry.md#提案本文`の骨子で追加し、`提案N`へ新parentとの関係、`検討記録`へ旧parentと変更理由・典拠decisionを保存する。reparentが別論点の決定を反映する処理なら、feedback欄へその結果と典拠を保存して空の合意待ちにしない。
4. child側の`親論点`だけを更新する。parent側へ`子論点`fieldを追加しない。
5. 旧parentと新parentの未決child集合が変わった場合だけ、それぞれのstatusを同期する。

### scope外の既存論点を取り下げる

作成済み論点が現在のdiscussion目的または指定parentの決定・実装範囲へ影響しないと判明した場合だけ行う。作成済み論点がscope外と判明した場合は履歴を削除しない。

`templates/discussion_entry.md` 全文を読む。既存の空応答欄へ「受領応答の本文」を入れ、新しい回が必要なら上のreparentと同じ保存骨子で取下げの判断・背景・結果を置く。「決定」で現在の終了を示す。通常の空合意待ちを作らない。

1. scope外であることを確定したeventまたはevidenceと理由を、評価対象proposalのfeedback欄が空ならその欄へ保存する。すでにfeedback確定済みなら上書きせず、`templates/discussion_entry.md`のiteration以下と`templates/discussion_entry.md#提案本文`の骨子の新しいiterationへ取下げ判断とその背景・結果を保存する。
2. 現在の`決定`を、取下げと終了が分かる内容へ局所更新する。
3. 未決child集合が変わる場合だけparent statusを同期し、chatで取下げ理由を具体的に示す。


## 返却前に記録を同期する

### 通常の同期と回復の検出

提案・認識合わせの提示、decision、reparent、取下げ、scope外報告、停止、consumer返却のいずれでも最後に通る。
discussionと扱った論点の内部logを再読込し、前回保存後に委託scope内で実際に生じた事象・原因・提案・回答・反論・訂正・合意を照合する。
過程の実証拠はlog、ユーザーが判断する内容・原文応答・decisionはdiscussionへ同期し、二層の所属と根拠linkも確認する。
同じdecisionは同じ論点、別decisionは論点選択を通して保存する。
未保存のままchat合意へ到達したか、処理を進めた後に記録漏れを発見したなら、[record-recovery.md](record-recovery.md) を全文読んで回復する。到着直後の通常応答、通常のreparent・取下げ、正しく保存済みの中断復帰は回復へ集めない。
成果物変更の理由が原文からdecisionまで追えることを確認する。保存済みdecisionとの一対一対応で新scope・routing・方針・成果物・実行単位を一切決めない適用だけは新論点にしない。
対応付けに具体的な判断が一つでも必要なら「既存decisionの機械的適用」と呼んでdiscussionを省略せず、proposalとして提示・保存して合意を得る。議論のない誤字・format・link修正も新論点にしない。

### 返却の完了gate

委託scopeの未収録内容がなく、結論だけでなく原文・提案・応答・変遷をfileから追えることを確認する。決定には具体案と明示合意の証拠があり、未合意は分離されている。
回復した場合は事後記録・反映済み成果物・確認不能範囲が示されている。同期不能なら未同期範囲と停止理由を返し、通常のhandoff完了を宣言しない。
mdの作成・更新はemit前にproductionのdocument-reviewを適用する。図の描画方式は上の不変条件に従い、discussion file・chatの例外を内部logへ広げない。
提示して待つ場合はfile名・論点番号・提示見出し・判断対象をchatで特定する。`これ`や`大枠`だけで合意を求めない。
