<!--
このfileは議論用prototypeであり、production templateではない。

現在のtemplate候補で維持する骨格:
- 一つのentryへ、0から始まる番号付きiterationを順に蓄積する。
- 一つのiterationを、その回の問いを判断できる提案N、提案背景、その提案へのfeedbackの単位にする。
- feedbackは評価対象の提案と同じiterationへ置き、次の提案の起点として複製しない。
- 提案背景には、提案Nが満たす条件と、提案N内の応答を書き、提案を評価するための材料としてfeedbackより先に置く。
- 過去のiterationは、その時点で判断した提案、成立理由、feedbackを所有する。entry末尾の`決定`は現在有効な最終結論だけを所有する。
- 決定済みの同一decisionが後続feedbackまたはevidenceで再開した時は、元のiterationを変更せず、末尾の旧`決定`を現在結論の表示から外して新しいiterationを追加する。再決定後も`決定`は一つだけ置く。
- 別topicのdecisionが、先行topicのdecision boundaryを変えずに具体表現だけを置換する時は、先行topicのiterationを変更・追加せず、先行topicの`決定`を現在有効な表現と置換元topicの典拠へ同期する。置換理由と影響範囲は後続topicが所有する。
- 一括proposalが独立した複数decisionを含むと判明した時は、通常iterationを止め、新しい連番のchild論点へ分解する。各childは`親論点`を持ち、parentは未決childがある間`子論点待ち`にする。
- 新規fileは、必要な完成後treeと`document-heading-outline.md`によるoutlineへ合意してから実fileを作成し、作成されたfileをreviewする。本文全文を作成前のdiscussionへ複製しない。
- 既存fileの局所修正は、全追加・削除行と必要contextが読みやすい一つのunified diffに収まる時、`existing-file-local-diff.md`で変更内容を省略せず示す。変更しないfile残部は再掲しない。
- 複数file、file間の対応、または不可分な複数hunkが一decisionを構成する時は、`file-change-set.md`で変更集合を閉じる。対象内部の表示はtree、diff、before / after、outline、flow等から選び、全対象を同じ方式へ揃えない。独立して採否を変えられる変更は別decisionへ分ける。
- entry末尾の未決提案を判断対象とし、それを複製する上部navigationは作らない。
- 同じ未決decisionが外部event、user action、後続phase等を待って止まる時だけ、最新iteration直後へ`再開条件`を置く。通常のfeedback待ち、次iteration・次topicへの移動、consumer反映、完了報告には置かない。
- snapshot、過去iterationの再要約、固定の弱点fieldは作らない。

記法:
- proposal本文は固定fieldへ押し込まず、内容に応じて段落、内容固有の見出し、表、tree、diffを選ぶ。
- 箇条書きは、短く同格な要素を並べる時だけ使う。
- 独立した説明を持つ意味単位を「- **label:** 長い散文」の連続で疑似的に区切らない。
- 長い意味単位には内容固有の見出しを使い、連続した論旨は段落で書く。

-->

<!--
新規論点を作る前に確認する:
- このdecisionの結論が変わると、現在のdiscussion目的または指定parentの決定・実装範囲が変わるか。
- 変わらない場合はactiveな論点を作らない。
- 一括proposalから独立decisionを分ける場合は、枝labelを付けた同一論点内sectionにせず、次の連番を持つ別論点にする。child側へ`親論点`を書き、parentを未決childがある間`子論点待ち`にする。
-->
## 論点N: {判断内容を表すタイトル}

**ステータス:** {提案中 / 調査中 / 子論点待ち / 決定 / 保留 / 分解済み}

**親論点:** 論点M
<!-- top-level論点では省略する -->

**種別:** {TBDヒアリング / 認識齟齬 / レビュー指摘。複数可}

<!--
最初は N=0 として作る。
提案Nと提案背景を保存する時点で、同じiterationの`提案Nへのフィードバック`見出しまで置き、その本文は空にする。`未回答`等のplaceholderは可視本文へ書かず、feedbackを推測しない。
feedbackを受けたら、提案Nと提案背景を変更せず、その提案へのfeedbackだけを一度確定する。`結果`には固定候補から選ばず、その回の結果が分かる短い表現を書く。受諾なら決定へ進み、修正要求なら番号を増やしたiteration blockをentry末尾へ追加する。別decisionなら別論点へroutingする。
entry末尾の未決提案が判断対象になるため、同じ内容を上部へ複製しない。

新規entryでは、下の見出し階層をそのまま使う。
既存entryへiterationを追加する場合は、可視構造と読み順を変えず、iteration見出しの深度を既存のiteration兄弟へ合わせる。配下の見出しも同じ段数だけ移動し、iteration subtree内の親子関係を保つ。既存履歴の見出しは一括変換しない。
-->

### イテレーションN: {この提案で成立させること、または変えること}

#### 提案N

{その回の問いを判断できる提案を書く。既決内容は今回の判断に必要な範囲だけ示し、完全性のためだけに再掲しない。完全状態そのものが判断対象なら完全版を示す。}

<!--
今回の問いへ何を示せば判断できるかを先に考える。`proposal-sections/README.md`から判断対象の理解を助けるpatternを確認し、必要なら複数を組み合わせる。複数案を提示する場合は選択肢patternをwrapperとして使い、各案の内部に別patternを置いてよい。該当patternがなければcatalogへ押し込まず、内容から構成を決める。

提案本文の構成は内容から決める。
独立した説明を持つ内容は、たとえば「保存構造」「読み取り範囲」「fallback」のような固有見出しへ分ける。
短く同格な要素だけを箇条書きにする。
`総論 / 各論 / ルール / 適用例`や箇条書きを固定しない。
抽象と具体の両方が必要でも、一つの疑似箇条書きへ平坦化せず、意味関係が読める段落、固有見出し、表等を選ぶ。

新規fileの作成では、配置、周辺fileとの関係、作らないfileが判断対象なら、`structure-tree.md`を使って対象範囲を絞った完成後treeを示す。新規documentは、`document-heading-outline.md`を使って各見出しの役割と扱う内容へ合意してから実fileを作成し、作成されたfile自体をreviewする。本文全文を作成前のdiscussionへ複製しない。

既存fileの変更が局所範囲に閉じ、全追加・削除行と必要contextを読みやすい一つのunified diffで示せる場合は、`existing-file-local-diff.md`を使う。変更hunk内を省略せず、変更しないfile残部は再掲しない。

複数file、file間の対応、または一file内の複数hunkが一つのdecisionとして不可分に変わる場合は、`file-change-set.md`を使う。今回の変更へ含む対象を漏れなく列挙し、beforeからafterへの対応、変えてよい範囲、維持・削除・scope外、完了状態を判断できる変更集合にする。対応の主単位と内部表示はcaseに合わせ、file path、責務・contract、保持する意味等から選ぶ。各対象内部ではtree、機械的置換、完全diff、before / after、outline、flow等を使い分け、同じ表示方式へ揃えない。独立して採否を変えられる変更は、一つの変更集合へまとめず別decisionへ分ける。
-->

#### 提案背景

{提案Nが満たす必要のある条件と、提案Nのどの内容がそれを満たすかを書く。提案0では、最初のuser input、finding、既存状態を必要な範囲で示し、そこから必要になった条件を扱う。提案1以降では、直前の提案へのfeedbackから必要になった条件を扱う。直前のfeedbackが原因診断または修正scopeを変えた場合は、前の診断の何を維持し、置換し、または拡張したかを説明する。直前のfeedback原文や評価結果は前のiterationが所有するため、次の提案背景へ複製しない。}

<!-- 外部evidenceが採用済み判断を無効にした場合は、evidence、無効になった判断、置換に必要な条件を読み分けられる内容固有の見出しを使う。これらのlabelを全iterationの固定fieldにしない。 -->

#### 提案Nへのフィードバック

<!--
提案保存時は、この見出しの可視本文を空にする。`結果: 未回答`等のplaceholderは書かない。

feedback受領後は、次の内容をこの見出しの下へ追加する。

**結果:** {その回の結果が分かる短い表現}

> {user feedback、review等を必要な範囲で原文のまま示す}

{原文だけでは結果が分からない場合に、提案Nのどこが受け入れられ、どこが成立しなかったかを書く。}

`結果`は固定語彙へ限定しない。原因診断への影響が次の提案を理解するうえで重要なら、`修正要求`だけに丸めず、診断を維持するのか遡るのかが分かる短い表現にする。
-->

<!--
feedback確定後の過去iterationを変更・削除せず、`ここまでの議論`等の圧縮要約も作らない。通常は、末尾の空のfeedback欄を実際に受けた内容で一度確定する更新だけを許す。決定済みの同一提案へ再feedbackを受けた場合も、元の評価結果は上書きしない。
決定済みの同一decisionを変える後続feedbackまたはevidenceは、元のfeedbackへ追記せず、新しいiterationの提案背景へ接続する。元のiterationを履歴として残し、論点をactiveへ戻して、末尾の旧`決定`を現在結論の表示から外す。

scopeまたは情報ownerの移動が元proposalから独立して変更できるdecisionなら、同じiterationへ累積せず別論点へ分ける。同じdecision内の判断材料として移動前後やowner境界を示す時は、process flow、tree、対応表、散文等から内容に合うproposal patternを選ぶ。
-->

<!--
議論中に現在成立している内容をまとめることが理解を助ける時だけ、最新iteration blockの直後へ次を置く。

### 仮決定

{その時点で現在有効な仮の判断を自己完結して書く。判断の足跡が役立つ場合だけ典拠iterationを添える。}

`仮決定`は固定sectionではない。過去iterationの部分判断を機械的に加算せず、方向転換で無効になった内容は外す。履歴は過去iterationが所有する。最終合意時は現在stateである`仮決定`を外し、最終結論を`決定`へ書く。
-->

<!--
同じ未決decisionが外部event、user action、後続phase等を待って止まり、entryだけでは停止理由と再開位置を特定できない時だけ、最新iteration blockの直後へ次を置く。

### 再開条件

{今足りないもの、それが解消したと判断するevent・evidence・action、解消後に再開する未決判断を書く。固定小fieldへ分けず、内容に合う文章、短い列挙、表等を使う。}

通常のuser feedback待ち、consumerによるdecision反映、完了報告、直後に追加する次iteration・次topicへの移動では置かない。条件が満たされたら結果を新しいiterationの提案背景へ接続し、現在stateである`再開条件`を外す。別steering化や後続phaseへの委譲自体が最終判断なら、`再開条件`ではなく`決定`本文へ含める。
-->

### 決定

{合意後、その論点で確定した内容を書く。未決なら確定したように書かない。}

<!--
`決定`は現在有効な最終結論だけを自己完結して書く。過去iterationのdecisionを機械的に加算せず、`以前の決定`、`決定（更新）`、`決定（最終）`を並べない。最終decisionへ影響する弱点をuserが受容した場合は、デバッグ経緯ではなく、現在契約の制約と選択理由として含める。

別topicのdecisionが、このtopicのdecision boundaryを維持したまま識別子、path、語彙等の具体表現だけを置換した場合は、過去iterationを当時の判断対象として変更せず、`決定`を現在有効な表現へ同期する。同期した箇所には置換元topicを典拠として示す。置換理由は後続topicが所有し、このtopicへ複製しない。先行decision自体が変わる場合はこの同期で済ませず、同一decisionの再開または別decisionへのroutingを行う。

固定の`ネクストアクション`fieldは置かない。「ユーザーが合意する」「consumerが正本へ反映する」「完了済み」だけのdefaultな後続処理を全entryへ反復しない。
通常の次の焦点はfile末尾のactive proposalで示す。順序や委譲先そのものが合意内容なら`決定`が所有し、同じ未決decisionの再開位置が停止条件と不可分な時だけ`再開条件`へ含める。
decision後にconsumerへ処理を返す既存handoff自体は維持する。
-->
