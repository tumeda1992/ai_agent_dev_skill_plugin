# 共通イテレーション

[SKILL.md](SKILL.md) でfile・論点を選んだ同じownerが実行する。新規、継続、再開を扱い、別decisionはhandlerの対象論点選択へ戻す。

## 入る前に引き継ぐ状態

解決済みfile、scope・consumer制約、対象decision、新規／継続／再開、実際の発言とevidence、親子と現在stateを引き継ぐ。

## 保存形の組立て

[templates/discussion_entry.md](templates/discussion_entry.md) 全文を読み、必要な名前のcode blockだけを使う。新規はmetadata・回の骨子・提案本文・空の提案応答欄を組み立てる。継続は回以下、受領時は受領応答の本文、現在stateは全回の後へ置く。外側の部品名とfenceはコピーしない。

#### 2.2 新規論点を作るvariant

handlerの論点選択で新しいdecisionと判定した場合だけ入る。新規entryには`templates/discussion_entry.md`を使い、template全文を`SKILL.md`へ複製しない。

1. fileを再読込し、canonical h2とlegacy h3の最大番号を再計算する。新しい番号は最大値+1とし、既存論点がなければ`論点1`とする。
2. `templates/discussion_entry.md`の新規entry骨子を使い、`イテレーション0`を作る。
3. `提案0`には、その回の問いを判断できる内容を書く。完全状態そのものが判断対象の時だけ完全版を示す。`templates/proposal-sections/README.md`を確認し、判断対象に合うpatternがあれば内容に合わせて使い、必要なら組み合わせる。該当patternがなければ内容固有の構成を使う。
4. `提案背景`には、最初のuser input、finding、既存状態を必要な範囲で示し、提案0が満たす必要のある条件と、提案0のどの内容がそれを満たすかを書く。原因追跡、discussion scopeへ属する理由、別decisionとして分けた理由等は、proposalを評価するために必要な時だけ内容固有の見出しや段落で示す。
5. `提案0へのフィードバック`見出しを置き、可視本文は空にする。`未回答`等を表示せず、feedbackを推測しない。
6. childまたは後発parentを作る場合は、論点levelの親子契約を検証する。
7. canonicalな`## 論点N: タイトル`としてfile末尾へ追加する。childを追加した場合だけparent statusを同期する。
8. 保存後にdiscussion file名、論点番号、提案番号または見出し、判断対象をchatで具体的に示し、合意を求める。

review起点の最上位論点では、ユーザーの言葉を提案0の背景へ変更せず保存する。独立したfeedback ledgerや`FB-N`を作らない。一つのfeedbackから複数decisionが生じる場合は、原文と分解自体の実質的なdecisionを持つparentを作り、leafごとにchildへ分ける。複数feedbackが一つのdecisionへ収束する場合は、一つの論点内に複数の原文を保持できる。

新しい一decisionについて、判断可能な提案0、提案背景、空のfeedback見出しがactiveな論点として保存され、具体的な合意確認をchatへ返した時点で、このvariantを抜ける。

## 既存提示への応答を扱う

handlerの論点選択で既存論点を選んだ後に入る。論点の現在stateと到着したeventに応じて、このscope内の処理を選ぶ。

##### 2.3.1 feedbackをiterationとして扱う

handlerの論点選択でactiveな既存論点を選び、その論点へのfeedbackを処理するときだけ入る。feedbackを受けた時は、iterationを追加する前に必ずこの分類をやり直す。ここでいう分類は所属論点の判定であり、原因ownerの分類（handlerの原因owner判定）とは別のものである。両方を通る。

###### iterationの入口gate

| feedbackの判定 | 遷移 |
| --- | --- |
| 選択中のactive論点と同じdecisionの原因・提案・検証を変える | 同じ論点へiterationを追記する |
| child・sibling・後発parent・独立論点にあたる別decision | iterationを追加せず、一段上のhandlerの「対象論点を選ぶ」へ戻る |
| 選択中の論点が決定済みで、同じdecisionを変更する | `決定済み論点を再開するvariant`へ進む |
| 作成済み論点自体がdiscussion scope外と判明した | iterationを追加せず、`scope外の既存論点を取り下げる`へ進む |
| discussion目的へ影響しない別事項 | activeな論点を作らず、chatでscope外と示す |

このgateはiterationの所属先を決める。skill起動済みという前提やtarget fileの解決を毎回分岐させない。

###### 同じdecisionへiterationを追記する

activeな論点に`再開条件`があり、その条件を満たすevent、evidence、actionを受けた場合は、その結果を新しいiterationの`提案背景`へ接続し、現在stateである`再開条件`を外す。条件が未成立なら、再開したようにiterationを進めない。

1. feedbackを受ける直前の末尾iterationに、対象proposalと同じ番号の`提案Iへのフィードバック`見出しがあり、本文が空であることを確認する。空でなければ同じ評価結果を上書きせず、再開または別decisionへのroutingを判定する。
2. そのfeedback欄へ、固定候補ではなくその回の結果が分かる短い`結果`、必要な原文、原文だけでは分からない評価内容を保存する。proposalと提案背景は変更しない。
3. feedbackがproposalを受諾した場合は、新しいiterationを作らずhandlerのdecision確定へ進む。
4. 同じdecisionの修正が必要なら、番号を一つ増やしたiterationを追加し、`提案I`へ今回の問いを判断できる修正案を書く。既決内容を完全性のためだけに再掲せず、完全状態そのものが判断対象の時だけ完全版を示す。
5. 新しい`提案背景`へ、直前のfeedbackと今回の調査から今回満たす必要が生じた条件、その条件を導いたfindingとその整理、新proposalのどの内容が条件を満たすかを書く。feedback原文と評価結果は直前iterationが所有するため複製しない。原因診断または修正scopeが変わった時は、前の診断の何を維持、置換、拡張したかを読み分けられるようにする。
6. 新proposalと背景に続けて、可視本文が空の`提案Iへのフィードバック`見出しを置く。
7. fileへ保存してから、discussion file名、論点番号、提案番号または見出し、判断対象をchatで具体的に示し、合意を求める。

feedback確定後の過去iteration、却下理由、誤っていた認識は変更・削除せず、`ここまでの議論`等で再要約しない。複数decisionを一つのiterationへ混ぜない。同じdecision scopeの判断可能な修正案、提案背景、空のfeedback見出しが保存された時点で、このprocedureを抜ける。

###### 決定済み論点を再開するvariant

1. feedbackが以前のdecisionと同じscopeを変更することを確認する。別decisionならiterationを追加せずhandlerの「対象論点を選ぶ」へ戻る。
2. 以前の決定を現在結論として表示する末尾の`決定`を外し、statusをactiveな状態へ戻す。旧決定に至った過去iterationは変更しない。
3. 新しいiterationの`提案背景`へ、再開させたfeedbackまたはevidence、無効になった判断、置換に必要な条件を保存し、`提案I`へ今回判断する案を書く。
4. 新proposalの末尾へ空のfeedback見出しを置いてから、具体的に合意を求める。

過去iterationを上書きして旧決定へ至った判断を失わせない。再開用iterationとfeedback用iterationを同じfeedbackから二重に作らない。旧判断を履歴に残したまま論点がactiveな合意待ちへ戻った時点で、このvariantを抜ける。


## 保存形から移した適用制御

新規論点を作る前に確認する:
- このdecisionの結論が変わると、現在のdiscussion目的または指定parentの決定・実装範囲が変わるか。
- 変わらない場合はactiveな論点を作らない。
- 一括proposalから独立decisionを分ける場合は、枝labelを付けた同一論点内sectionにせず、次の連番を持つ別論点にする。child側へ`親論点`を書き、parentを未決childがある間`子論点待ち`にする。

top-level論点では省略する

最初は N=0 として作る。
提案Iと提案背景を保存する時点で、同じiterationの`提案Iへのフィードバック`見出しまで置き、その本文は空にする。`未回答`等のplaceholderは可視本文へ書かず、feedbackを推測しない。
feedbackを受けたら、提案Iと提案背景を変更せず、その提案へのfeedbackだけを一度確定する。`結果`には固定候補から選ばず、その回の結果が分かる短い表現を書く。受諾なら決定へ進み、修正要求なら番号を増やしたiteration blockをentry末尾へ追加する。別decisionなら別論点へroutingする。
entry末尾の未決提案が判断対象になるため、同じ内容を上部へ複製しない。

新規entryでは、下の見出し階層をそのまま使う。
既存entryへiterationを追加する場合は、可視構造と読み順を変えず、iteration見出しの深度を既存のiteration兄弟へ合わせる。配下の見出しも同じ段数だけ移動し、iteration subtree内の親子関係を保つ。既存履歴の見出しは一括変換しない。

今回の問いへ何を示せば判断できるかを先に考える。`templates/proposal-sections/README.md`から判断対象の理解を助けるpatternを確認し、必要なら複数を組み合わせる。複数案を提示する場合は選択肢patternをwrapperとして使い、各案の内部に別patternを置いてよい。該当patternがなければcatalogへ押し込まず、内容から構成を決める。

提案本文の構成は内容から決める。
独立した説明を持つ内容は、たとえば「保存構造」「読み取り範囲」「fallback」のような固有見出しへ分ける。
短く同格な要素だけを箇条書きにする。
`総論 / 各論 / ルール / 適用例`や箇条書きを固定しない。
抽象と具体の両方が必要でも、一つの疑似箇条書きへ平坦化せず、意味関係が読める段落、固有見出し、表等を選ぶ。

新規fileの作成では、配置、周辺fileとの関係、作らないfileが判断対象なら、`structure-tree.md`を使って対象範囲を絞った完成後treeを示す。新規documentは、`document-heading-outline.md`を使って各見出しの役割と扱う内容へ合意してから実fileを作成し、作成されたfile自体をreviewする。本文全文を作成前のdiscussionへ複製しない。

既存fileの変更が局所範囲に閉じ、全追加・削除行と必要contextを読みやすい一つのunified diffで示せる場合は、`existing-file-local-diff.md`を使う。変更hunk内を省略せず、変更しないfile残部は再掲しない。

複数file、file間の対応、または一file内の複数hunkが一つのdecisionとして不可分に変わる場合は、`file-change-set.md`を使う。今回の変更へ含む対象を漏れなく列挙し、beforeからafterへの対応、変えてよい範囲、維持・削除・scope外、完了状態を判断できる変更集合にする。対応の主単位と内部表示はcaseに合わせ、file path、責務・contract、保持する意味等から選ぶ。各対象内部ではtree、機械的置換、完全diff、before / after、outline、flow等を使い分け、同じ表示方式へ揃えない。独立して採否を変えられる変更は、一つの変更集合へまとめず別decisionへ分ける。

外部evidenceが採用済み判断を無効にした場合は、evidence、無効になった判断、置換に必要な条件を読み分けられる内容固有の見出しを使う。これらのlabelを全iterationの固定fieldにしない。

提案保存時は、この見出しの可視本文を空にする。`結果: 未回答`等のplaceholderは書かない。

feedback受領後は、次の内容をこの見出しの下へ追加する。

**結果:** {その回の結果が分かる短い表現}

> {user feedback、review等を必要な範囲で原文のまま示す}

{原文だけでは結果が分からない場合に、提案Iのどこが受け入れられ、どこが成立しなかったかを書く。}

`結果`は固定語彙へ限定しない。原因診断への影響が次の提案を理解するうえで重要なら、`修正要求`だけに丸めず、診断を維持するのか遡るのかが分かる短い表現にする。

feedback確定後の過去iterationを変更・削除せず、`ここまでの議論`等の圧縮要約も作らない。通常は、末尾の空のfeedback欄を実際に受けた内容で一度確定する更新だけを許す。決定済みの同一提案へ再feedbackを受けた場合も、元の評価結果は上書きしない。
決定済みの同一decisionを変える後続feedbackまたはevidenceは、元のfeedbackへ追記せず、新しいiterationの提案背景へ接続する。元のiterationを履歴として残し、論点をactiveへ戻して、末尾の旧`決定`を現在結論の表示から外す。

scopeまたは情報ownerの移動が元proposalから独立して変更できるdecisionなら、同じiterationへ累積せず別論点へ分ける。同じdecision内の判断材料として移動前後やowner境界を示す時は、process flow、tree、対応表、散文等から内容に合うproposal patternを選ぶ。

議論中に現在成立している内容をまとめることが理解を助ける時だけ、最新iteration blockの直後へ次を置く。

### 仮決定

{その時点で現在有効な仮の判断を自己完結して書く。判断の足跡が役立つ場合だけ典拠iterationを添える。}

`仮決定`は固定sectionではない。過去iterationの部分判断を機械的に加算せず、方向転換で無効になった内容は外す。履歴は過去iterationが所有する。最終合意時は現在stateである`仮決定`を外し、最終結論を`決定`へ書く。

同じ未決decisionが外部event、user action、後続phase等を待って止まり、entryだけでは停止理由と再開位置を特定できない時だけ、最新iteration blockの直後へ次を置く。

### 再開条件

{今足りないもの、それが解消したと判断するevent・evidence・action、解消後に再開する未決判断を書く。固定小fieldへ分けず、内容に合う文章、短い列挙、表等を使う。}

通常のuser feedback待ち、consumerによるdecision反映、完了報告、直後に追加する次iteration・次topicへの移動では置かない。条件が満たされたら結果を新しいiterationの提案背景へ接続し、現在stateである`再開条件`を外す。別steering化や後続phaseへの委譲自体が最終判断なら、`再開条件`ではなく`決定`本文へ含める。

`決定`は現在有効な最終結論だけを自己完結して書く。過去iterationのdecisionを機械的に加算せず、`以前の決定`、`決定（更新）`、`決定（最終）`を並べない。最終decisionへ影響する弱点をuserが受容した場合は、デバッグ経緯ではなく、現在契約の制約と選択理由として含める。

別topicのdecisionが、このtopicのdecision boundaryを維持したまま識別子、path、語彙等の具体表現だけを置換した場合は、過去iterationを当時の判断対象として変更せず、`決定`を現在有効な表現へ同期する。同期した箇所には置換元topicを典拠として示す。置換理由は後続topicが所有し、このtopicへ複製しない。先行decision自体が変わる場合はこの同期で済ませず、同一decisionの再開または別decisionへのroutingを行う。

固定の`ネクストアクション`fieldは置かない。「ユーザーが合意する」「consumerが正本へ反映する」「完了済み」だけのdefaultな後続処理を全entryへ反復しない。
通常の次の焦点はfile末尾のactive proposalで示す。順序や委譲先そのものが合意内容なら`決定`が所有し、同じ未決decisionの再開位置が停止条件と不可分な時だけ`再開条件`へ含める。
decision後にconsumerへ処理を返す既存handoff自体は維持する。

## 見出しの所属

新規fileでは論点Nと共通回Iをtemplateの所属suffixへ埋め、handlerの範囲検査を通す。既存fileは兄弟深度と識別表記を保ち、過去見出しを変換しない。
