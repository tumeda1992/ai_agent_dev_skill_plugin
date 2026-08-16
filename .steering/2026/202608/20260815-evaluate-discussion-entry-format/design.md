# Design: discussion entryを読み手中心の形式へ再設計する

## 元の依頼内容

plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md について、形式を吟味したい。

元々、claudeのsonnetを使ってたときに、あまりにも脊髄反射な提案内容が多く、
自分で考えてから提案しろ、ということを促すためのフォーマットだった。

だけど、ClaudeのOpusやGPTのsolを使う今、考えて提案を出してくれることは当たり前になった。
逆にフォーマットが仇になって、読みにくくなってしまっている部分もある。

いきなり結論だけ出して、後からそのファイルを見た人や、議論途中でも時間を置いて見たときに内容がわからないことは避けたいから、
思考の根拠や論理展開は見せてほしいけど、考えている側の思考順ではなく、読んでいる側の理解がしやすい順番で出してくれればいい。
だから、原因についての記述はありがたい。
総論と各論を書いてくれるから、抽象と具体の往復がされている感じがあって良い。総論があるから具体がどこに紐付くかわかるし、各論があるから具体性を帯びる。
けど、「ルール」「ルール」「ルール」「ルール」「ルール」って並ぶのは分かりづらい。

セッションで提案されるものはわかりやすくてもイテレーションで出るのがわかりにくいのはあるある
あと、「path/to/dir を変更する」で合意したあとにどういう風に変更するかの差分もわからないで合意するとき怖い。
ファイル作成も同様。

別の話だけど、論点ごとのネクストアクションって、「ユーザが合意すること」「合意されたからdesign.mdへ反映」しか無いなら不要だな。

steeringでディレクトリ作った後に、その中にgitignoreされるディレクトリを作り、この後指定した別リポジトリのsteeringの場所を伝えるから
特別わかりにくいのを抜粋して、それらについて、どういう方針で修正したらわかりやすくなるかなっていうのをあててみて、フォーマットを吟味したい

---

## 1. TL;DR

論点についてiterationを回し、その都度の意思決定と変遷を残す既存processは維持する。変更対象はformatだけである。過去のdiscussionから、壊れ方が異なる`だめだった・伝わらなかった`caseを少数キュレーションし、before、伝わらなかった内容、after、case固有の修正方針を比較する。仮の共通骨子とcase別variantを全iteration論点へ展開し、未対応caseがあればキュレーションとafterを更新する。この反復で既存caseを改善し、全体をcoverできた時にtemplateと`facilitate-discussion`のformat生成contractを固定する。

この検討中に具体的に露呈した`think-through`の小さな改善も同じsteeringで扱う。S8を作業中のready再評価まで広げ、広くvariationがある対象では具体caseとの反復から全caseを扱える方針群を作る場面を追加する。一つの方式への収斂と演繹を必須にしない。これらはdiscussion formatの論点4へ混ぜず、独立した論点5・6として設計する。

---

## 前提とする既存仕様

- `discussion_entry.md`: 事象、原因、根本原因と提案、検証、iteration、決定、ネクストアクションを固定fieldとして持つ。
- `facilitate-discussion`: 合意前にself-containedな完全案を保存し、過去iterationと却下理由を不変にし、現在の合意対象だけを局所更新する。
- migration policy: 既存の判断能力、停止能力、履歴保存能力は、明示合意された差分以外を全量保存する。参照元固有情報は公開成果物へ残さない。
- 実例調査: 生の抜粋と未参照の作業メモはgitignore対象の`source-materials.local.md/`に置く。今回のsteeringから参照するcase、before / after、coverageは、参照元固有情報を一般化したうえでgit管理対象の`source-materials/`へ置き、catalogからC1〜C11の意味と比較版を辿れるようにする。
- format確定方法: 抽象原則または見出し案を先に合意gateにせず、具体caseのbefore / afterと全iteration論点へのcoverageから判断する。

---

## 2. 要件（Requirements）

### MUST（必達）

- 議論中の当事者がiterationの途中でも、現在の判断内容、ここまでの判断変化、各feedbackが何を変えたかを短い探索で再構築できる。
- iterationを過去情報の従属領域として扱わず、候補変更、診断更新、scope分割、焦点移動等を経て現在地へ至った経路の節点として扱う。
- 現在の判断内容と議論の展開は、どちらか一方を先に全文通読しなければ対応が分からない形にしない。
- 後から読む人も、同じentryから背景、原因、判断内容、決定へ至った理由を復元できる。
- 記載順とnavigationはagentの内部処理順ではなく、当事者が議論を理解・評価しやすい形にする。
- 原因の追跡を残し、提案が何を解消するかを説明できる。
- 各iterationは`提案N → 提案背景 → 提案Nへのフィードバック`の順に読む。feedbackは評価した提案と同じiterationが所有し、次の提案背景へ複製しない。提案Nはその時点の問いを判断できる範囲を示し、完全状態そのものが判断対象の時だけ完全版を示す。提案背景は、提案Nが満たす必要のある条件と、提案N内の具体的な応答を対応づけ、一般化した薄い診断や境界のない長い散文で代替しない。
- 総論と各論の意味上の接続を残し、抽象と具体を往復できる。ただし、proposal本文を固定の`総論 / 各論 / 箇条書き`へ押し込まず、内容に応じて文章、表、tree、diff等を選べる。
- 異なる内容をすべて`ルール`という同じラベルで平坦化しない。
- feedback、誤っていた認識、却下理由、前案との差分、そのiterationで行った意思決定を失わない。
- 各iterationが、診断、提案、scope、焦点のどこへ作用したかを識別できる。
- 一つのentryへ初期提案とiterationを順に蓄積する。iterationとは別の`snapshot`概念を導入せず、既存iterationを`ここまでの議論`等で再要約しない。
- `弱点`を各iterationの固定fieldにしない。agentの内部validationは維持し、合意判断に必要な制約、未解決事項、適用不能範囲が実際にある場合だけ、内容に適した場所へ具体的に示す。
- 論点選択、同一decisionへのiteration、別decisionへのrouting、その都度の意思決定、合意gate、決定確定、consumerへのhandoffを変更しない。
- file・directoryの作成、移動、変更を合意する前に、完成後のtree、file outline、完全diff、変更集合等から必要な具体像を示す。複数対象が一decisionを構成する時は、変更対象、beforeからafterへの対応、許可・維持・削除・scope外、完了状態を閉じる。すべてのcaseを同じ表示方式へ揃えない。
- 既定の「ユーザー合意待ち」「consumerが正本へ反映」「完了済み」を全論点へ反復せず、非defaultな停止位置、次の焦点、外部依存は失わない。
- 参照元固有の情報を公開成果物へ残さず、汎用化した原則と例だけを扱う。
- S8のready-firstを、user input受領時だけでなく、作業中にdecision、finding、dependency等の状態が変わった時も再評価する継続loopへ広げる。
- 広くvariationがある対象では、case固有の観察形式で具体caseと適用方針を反復往復し、対象scopeの全caseを扱える方針群を作る場面を`think-through`へ追加する。一つの方式への収斂と演繹を必須にしない。

### SHOULD（できれば）

- iterationのない新規提案を、複数iteration向けのnavigationで不必要に肥大化させない。
- topic分割、reparent、scope外化等の監査情報は必要な時だけ読者へ見せる。
- 固定fieldを減らしても、validatorまたはreviewで必要な情報の欠落を検出できる。

### MAY（あれば嬉しい）

- 変更対象の種類に応じて、tree、見出しoutline、before/after、state transition等のpreview形式を選べる。

### 非目標

- 原因分析そのものを省略すること。
- discussionを最終結論だけの短いdecision logにすること。
- `facilitate-discussion`の論点進行、iteration、意思決定、状態遷移、owner、停止・再開、handoffを変更すること。
- 参照元の既存discussion fileを一括整形すること。
- 合意前にtemplateまたは`facilitate-discussion`を変更すること。

### 受け入れ基準

- iterationを含む事例、複数の具体契約が並ぶ事例、file・directory変更事例へ候補形式を適用し、現行形式より読みやすい理由と弱点を比較できる。
- 壊れ方が異なるキュレーションcaseごとに、before、伝わらなかった内容、after、局所修正方針、未対応範囲を比較できる。
- iterationを持つcaseのafterは、初期提案と各feedback後のiterationが一つのentryへ順に増える形で再現する。各iterationは`提案N → 提案背景 → 提案Nへのフィードバック`の順に読み、各時点は同じentryをそのiterationまで読んだ状態として検証する。別snapshotや重複した過去要約を作らない。
- 仮の共通骨子とvariantを全iteration論点へ展開し、coverage不足をcase追加またはvariant修正へ戻せる。
- 完成後のentry構造と、各sectionが保持する情報、iteration増加時のnavigationが一意に決まっている。
- 現行contractの保存、変更、廃止が意味単位で合意され、未分類削除がない。
- templateとskill contractを変更する場合、合意済み形式から新たな判断なしに反映・validationできる。

---

## 3. 完成後の姿

### formatが維持する既存能力

discussion entryは、論点をiterationし、その都度の意思決定と変遷を残す既存processを観測可能にする。第一利用者は、現在その論点を議論している当事者である。当事者が時間を置いて論点へ戻っても、各iterationの作用と累積した判断内容を対応づけて読める形式にする。後から読む人へのself-contained性は、その構造を検証する第二の軸とする。

entry末尾の未決proposalを判断対象とし、同じ内容を上部の`現在の判断対象`やsnapshotへ複製しない。各iterationは番号だけでなく、その回で成立させることまたは変えることを見出しにする。proposal、背景、feedbackを同じiterationへ置くことで、当事者は見出しから展開を走査し、必要な回だけ本文を読める。

診断更新、提案修正、scope分割、焦点移動、撤回は、固定の作用種別fieldへ分類しない。iteration見出しと提案背景で今回変わる判断を示し、独立decisionならchild論点へ分け、evidenceによる撤回なら同じdecisionを再開する。

topic間置換のうち、後続topicが先行topicのdecision boundaryを変えずに具体表現だけを置換するcaseはC7で確定した。先行topicのiterationは変更せず、`決定`だけを現在表現と後続topicの典拠へ同期し、置換理由と影響範囲は後続topicが所有する。

原因、総論と各論、抽象と具体は、固定の`総論 / 各論 / ルール / 適用例`見出しへ押し込まない。独立した説明は内容固有の見出し、連続した論旨は段落、短く同格な要素だけは箇条書きにし、必要なら表、tree、diff、flow等を選ぶ。

### 対象と読者

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md` | 現在discussionを行う当事者、discussionを生成するagent、後からdecisionを確認する人 | 現在の判断内容と、そこへ至った判断変化の連なりを対応づけて読める |
| `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md` | skillを実行・保守するagent | 新規提案、feedback、合意、履歴保存を新しいentry contractに沿って処理できる |
| `plugins/tumeda-dev/skills/think-through/SKILL.md` | 議論、設計、実装、調査を行うagent | 作業中にreadyになった事項を先に反映し、多様な対象では具体caseから仮法則を作って全体で反証できる |

### 完成後のentry構造

共通entry骨子は、論点直下へ番号付きiterationを並べ、各iterationを`提案N → 提案背景 → 提案Nへのフィードバック`とし、末尾へ現在有効な`決定`を置く形で母集団全体を扱えることを確認した。先行して作った`現在案 / 変更履歴`の二分構造と、そこから抽出した`一つの進行地図`という上位原則は採用しない。feedback表示と、非defaultな停止・再開条件を含むformat上の表示判断は確定した。

`提案Nへのフィードバック`見出しは、提案を保存する時点で同じiterationの末尾へ置く。回答前の本文は空にし、`未回答`等のplaceholderは表示しない。feedbackを受けた後、`結果`には固定候補から選ばず、その回の結果が分かる短い表現を書き、必要な原文と評価内容を続ける。

現在確定しているのは、次の設計方法である。

1. 壊れ方が異なるcaseをキュレーションする。
2. iterationを持つcaseでは、一つのentryへ`提案N → 提案背景 → 提案Nへのフィードバック`の単位を順に増やす。提案Nは、その回の問いを判断できる内容にし、完全性のためだけに既決内容を再掲しない。最終状態の再編集や別snapshotで代替しない。
3. after間で共通した最小骨子と、caseに応じたvariantを仮置きする。
4. 全iteration論点へ展開し、未対応caseを追加して骨子・variant・afterを更新する。
5. 既存caseの改善を壊さず全体をcoverできた時にexactな構造を固定する。

C1〜C11のafterで、最初のキュレーションcaseと母集団への一巡適用で見つかった伝わらなさは、次のように改善できると確認した。

- C1: 各proposalはその回の問いだけを判断できればよく、既決内容の累積完全版を毎回再掲しない。過去iterationは当時の提案、背景、feedbackを所有し、entry末尾の`決定`は現在有効な最終結論だけを所有する。
- C2: 原因診断が深くなるcaseも共通骨子で扱える。診断の維持、置換、拡張が判断に必要な時だけ、`提案背景`を内容固有の構造へ分ける。
- C3: 決定後のevidenceで採用案が変わる時は、過去iterationを残し、旧`決定`を現在表示から外して新しいiterationを追加する。再決定後も末尾の`決定`は一つだけ置く。
- C4: 一括proposalが独立decisionへ分かれたら、通常iterationを止め、新しい連番のchild論点へ分解する。childは`親論点`を持ち、parentは未決childがある間`子論点待ち`にする。
- C5: 新規fileは、必要な完成後treeとannotated outlineへ合意してから実fileを作成し、作成されたfileをreviewする。本文全文を作成前のdiscussionへ複製しない。
- C6: 既存fileの局所修正は、全追加・削除行と変更位置を特定できるcontextを含む完全なunified diffへ合意する。変更hunkを省略せず、変更しないfile残部は再掲しない。
- C7: 後続topicが先行topicのdecision boundaryを変えずに具体表現だけを置換する時は、先行topicのiterationを履歴として維持し、先行topicの`決定`だけを現在表現と後続topicの典拠へ同期する。置換理由と影響範囲は後続topicが所有する。
- C8: scope・owner移動を、移動という理由だけで固定entry variantにしない。元proposalとは別decisionならparent / childへ分け、移動前後とowner境界は、そのchild proposalの判断対象に合うprocess flow、tree、対応表、散文等で示す。
- C9: 一対一のdirectory移動は、完成後tree、全fileのsource→target対応、許可する機械的補正、外部consumer、旧path不在、scope外、完了確認で変更集合を閉じる。
- C10: 一fileから複数fileへの分割は、旧fileの責務、fallback、test、公開APIを新fileへ対応させ、file間flowと旧file不在を示す。
- C11: 複数fileの意味保持移植は、source→target台帳、defaultの意味保持、許可する変換、file別の具体差分、未許可差分0件で変更集合を閉じる。全fileを同じ表示方式へ揃えない。

議論用prototype: [`facilitate-discussion_template_prototype/templates/discussion_entry.md`](./facilitate-discussion_template_prototype/templates/discussion_entry.md)へ、C1〜C11で成立した共通骨子とcase別contractを反映した。C8はC4のdecision分解と既存proposal patternの組み合わせで成立したため、prototypeへowner移動固有の構造は追加していない。C9〜C11は、三つの固定patternではなく、複数対象の変更集合を閉じる`proposal-sections/file-change-set.md`の共通contractとvariationとして接続した。長い意味単位を太字lead付きの疑似箇条書きへ並べず、独立した説明は固有見出し、連続した論旨は段落、短く同格な要素だけは箇条書きにする。

補正後の母集団はdiscussion系15 file、134 decisionと、implementation review系7 file、55 review事象である。全件への一巡適用により、entry骨子で扱えない意味型は残らなかった。proposal previewで不足したfile変更集合はC9〜C11で具体化し、C5〜C8と長い複数file改訂caseへ戻して適用境界を確認した。今後、現骨子で扱えない具体caseが見つかった場合はformatへ押し込まず、同じ帰納loopへ戻る。

### 記載する原則と例

- iterationは番号だけでなく、そのiterationで何が変わったかをnavigationとして読める。
  - 今回の具体例: 候補Aの検討、外部制約による候補Bへの変更、制約追加という判断変化を見出しから追える。
  - 意図に反する薄い記述: `イテレーション1 / 2 / 3`だけを並べ、各本文を再読しないと展開が分からない。
- 総論と各論、抽象と具体の接続を残し、具体契約を内容固有の名前で区別できる。
  - 今回の具体例: 一つの全体方針に属するhost起動、context読取、fallbackを、それぞれの内容名で識別する。
  - 意図に反する薄い記述: 意味の異なる契約を`ルール`という同じlabelで連続させる、または具体例をすべて削除する。
- pathまたはfile名だけを合意対象にしない。
  - 今回の具体例: README新規作成では、作らないfileを含む完成後treeと、各見出しの役割・内容を添えたannotated outlineへ合意してから実fileを作成し、そのfileをreviewする。既存fileの局所修正では、全追加・削除行と必要contextを含むunified diffへ合意する。複数fileが一decisionを構成する時は、変更対象、beforeからafterへの対応、許可・維持・削除・scope外、完了状態を`file-change-set`で閉じる。
  - 意図に反する薄い記述: 「`path/to/README.md`を作る」「designのdocs sectionを修正する」だけで合意を求める。

### formatと既存processの境界

- 論点選択、iteration、feedback routing、合意、決定確定、consumerへのhandoffは変更しない。
- formatは、既存processが生成した背景、現在案、原因、検証、feedback、その時点の意思決定、決定をどの順序と見出しで表示するかだけを所有する。
- default handoffの反復を減らしても、decision後にconsumerへ具体的な処理を返す既存handoffと、非defaultな進行位置は維持する。

議論中に現在成立している内容をまとめる価値がある時だけ、任意の`仮決定`として現在stateを示す。方向転換で無効になった内容は仮決定から外し、履歴は過去iterationに残す。論点終了時の`決定`は仮決定やiterationごとの部分決定を機械的に加算せず、最終結論を自己完結して書く。判断の足跡が役立つ場合だけ典拠iterationを添える。

固定の`ネクストアクション`fieldは置かない。通常のfeedback待ち、consumer反映、完了報告、次iteration・次topicへの移動は、既存workflow、status、file末尾のactive proposalから分かるためentryへ反復しない。

同じ未決decisionが外部event、user action、後続phase等を待って止まり、entryだけでは停止理由と再開位置を特定できない時だけ、最新iteration直後へ`再開条件`を置く。今足りないもの、解消を判断するevent・evidence・action、解消後に再開する未決判断を示す。条件成立後は結果を新しいiterationの提案背景へ接続し、現在stateである`再開条件`を外す。別steering化や後続phaseへの委譲自体が最終判断なら`決定`本文へ含める。

### think-throughへ反映する副産物

discussion format検討そのものから、次の二つのskill gapが具体的に確認された。formatの一部ではないため、論点4のiterationには入れず、同じsteeringの独立論点として扱う。

#### S8: 作業中もready事項を再評価する

- 既存の主軸`未決に依存しない確定事項を先に完了する`は維持する。
- userから同時に受け取った事項だけでなく、agentが作業中に発見した事項、decision・findingの確定、dependency解消でreadyになった事項も対象にする。
- meaningfulな状態変化と、新しい論点・調査・成果物へ進む直前にreadyを再評価し、正本または完了結果へ反映してから先へ進む。
- atomic actionの途中では中断せず、完了直後に再評価する。独立した完了判定を持たない微細な思考メモは事項へ昇格させない。

論点5で合意済み。上記のtrigger、継続loop、atomic actionと微細事項の境界を`think-through/SKILL.md`のS8へ反映する。

#### 新しい場面: 具体caseとの反復から全caseを扱える方針群を作る

- 一つのtemplate、policy、標準、architecture等を、性質や要求が異なる多くの対象へ適用する場合に発火する。問題改善だけを対象にしない。
- 目標は、対象scopeの各caseについて適切な方針を選び、そのcaseの完成条件を満たせることとする。一つの方式へ揃えることを目標にしない。
- 完成形として、一つの共通方針、共通骨子 + variant + selection条件、case群ごとの独立方針、必要ならcase固有方針の集合を認める。
- caseの確認形式は目的に応じて選び、before / after等を固定contractにしない。
- 新しいcaseを現在の方針群で扱えなければ、共通部分、variant、selection条件、独立方針、caseの捉え方を更新する。
- 方針群を変更したら既確認の全caseへ戻り、適切な方針を選べて完成条件を満たすか確認し直す。扱えたら次の未確認caseへ進み、変更のたびに戻る反復を続ける。
- 対象scopeの全caseを扱え、未対応caseがなくなった時に完了する。全caseを確認できない場合はscopeを確認済み範囲へ限定するか、暫定と明示する。
- 共通化は目的ではないが、同じ判断を無理なく共有できるcaseはまとめる。一つでも完成条件を満たせなくなるなら分ける。
- 演繹は必須にしない。完成した方針群を未観測、将来、scope外のcaseへ適用すると予測する必要がある場合だけ使う。
- S4が一つの抽象を具体で検算するのに対し、この場面は対象scopeの全caseを扱える方針群ができるまで、具体caseと方針群を反復往復する過程を所有する。

**アンチパターン:**

- **多様なcaseを一つの方式へ押し込む**: 方式数の少なさを品質とみなし、完成条件が異なるcaseを一つのruleやtemplateへ入れる。variantや独立方針なら扱えるcaseを共通方式の都合で未解決にしないかを問う。
- **taskを終えるため、豊富な具体を使わず演繹的に収まりの良い方針を作る**: patternと検証材料が多いのに、具体へ触れる前に上位原則と完成形を作り、caseを既案の説明へ使う。少なくとも一つのcaseで実際に何を満たせるか、caseを見て方針が変わったか、確定理由がcoverageではなくtask終了になっていないかを問う。

前者はcaseとの反復中に方針群を一方式へ縮退させる失敗、後者は具体caseとの反復を始める前に抽象方針を完成させる失敗として区別する。少なくとも一つのcaseで機能することは初期方針の最低条件であり、最終完了には対象scopeの全caseを扱えることを要求する。

論点6で合意済み。方針群、selection条件、反復loop、任意の演繹、二つのアンチパターンを独立したS9として`think-through/SKILL.md`へ反映する。

### contractの保存と明示差分

**baselineとevidence:**

| 項目 | 内容 |
| --- | --- |
| baseline | `71c8ba040d04cca0ad54181460326688991e671f` |
| 対象scope | `facilitate-discussion/SKILL.md`全体と`templates/discussion_entry.md` |
| ledger | `baseline-ledger.md` |
| 一般procedureの正本 | `plugins/tumeda-dev/docs/common_standard/function_migration_policy.md` |

**完成後の差分宣言:**

TBDとして明示した表示形式の差分だけを変更候補とする。baseline scope内のdiscussion process、trigger、owner、state、iteration、意思決定、順序、gate、停止、再開、routing、handoffを含むその他すべてのcontractは、配置または表現が変わっても意味、条件、強度、判断能力を保存する。

**完成後に変わること:**

| 完成後の意味差分 | 移行前との違い | 詳細owner | 出典 |
| --- | --- | --- | --- |
| iterationの作用と現在地をnavigationとして読める | iteration番号と固定構造から当事者が展開を再構築する | [完成後のentry構造](#完成後のentry構造) | C1〜C4、論点4イテレーション3〜20 |
| 内容固有の識別と抽象・具体の接続を両立する | 固定の`ルール / 適用例`を反復する | [記載する原則と例](#記載する原則と例) | C1〜C2、proposal-section catalog |
| 変更対象に応じた具体的previewを合意前に示す | pathと処理名だけでも合意対象になり得る | [記載する原則と例](#記載する原則と例) | C5〜C6、C9〜C11。新規documentはtree + annotated outline、既存局所修正は完全diff、複数対象は`file-change-set` |
| default handoffの反復と非defaultな進行位置を区別する | どちらも同じ`ネクストアクション`fieldへ入る | [formatと既存processの境界](#formatと既存processの境界) | 論点20。固定fieldを外し、同じ未決decisionが外部条件で止まる時だけ`再開条件`を置く |

---

## 4. リスクと対策

| リスク | 対策 |
| --- | --- |
| 累積した判断を見やすくすると、各iteration時点の意思決定が失われる | feedback、誤り、変更作用、その時点の判断を復元できることを実例で検証する |
| 固定fieldを減らすと原因や具体例が省略される | 内容固有見出しを許可しつつ、必要情報のpresence gateをskill側に残す |
| previewが過剰になりdiscussionがさらに長くなる | 新規fileはtreeとannotated outlineへ先に合意し、既存局所修正は完全diffへ絞る。複数対象の変更集合は各対象を同じ方式へ揃えず、path、責務、意味等から対応単位を選ぶ。独立変更はdecisionを分ける |
| 既存discussionとの互換性が崩れる | legacy entryは一括変換せず、canonicalとlegacyの両方を読めるcontractを維持する |

---

## 5. テスト方針

- 抽出した複数iteration事例へ候補形式を適用し、当事者がiteration 4から議論の筋、各iterationの作用、累積した判断内容を再構築できるか目視検証する。
- 一つのentryを初期提案、iteration 1、iteration 2の順に伸ばし、各iterationでfeedbackを評価対象のproposalへ確定してから、その回の問いを判断できる次proposalへ進めるか検証する。提案背景では、今回満たす条件とproposal内の応答を対応づける。iterationとは別のsnapshot、過去要約、固定の弱点fieldは作らない。
- iterationのない短い事例へ候補形式を適用し、navigationのためにentryが不必要に肥大化しないか確認する。
- C9の一対一移動、C10のfile分割、C11の意味保持移植へ`file-change-set`を適用し、共通contractを維持しながら対応単位と内部表示を変えられるか確認する。C5の新規documentとC6の一file局所修正へ戻し当てし、変更集合を常用して冗長化しないselection境界を確認する。
- baselineの構造ledgerとcontract ledgerを用い、未監査、未分類削除、未分類追加がzeroであることを確認する。
- 新規論点、同一decisionへのfeedback、決定済み論点の再開、別decisionへのrouting、file作成提案、decision確定をscenarioとして検証する。
- 外部evidence待ちで同じdecisionを保留するscenarioでは`再開条件`を表示し、通常のfeedback待ち、次topicへの移動、consumer反映、別steering化をそれぞれ空欄や固定`ネクストアクション`なしで識別できることを確認する。
- legacy discussionを読んだ時に既存論点番号、status、親子関係を壊さないことを確認する。
- `think-through`変更後、turn開始時の複数input、作業中のdecision確定、atomic action中の状態変化でS8の判断を再現できるか目視確認する。
- discussion formatとAPI client retry方針の二領域で、単一方式と複数variantの両方を完成形として扱い、方針群の変更ごとに既確認caseへ戻りながら全caseを扱うloopを再現できるか確認する。
- 多様なcaseを一方式へ押し込む出力と、具体caseを一つも扱えないが抽象的に整った出力を、二つのアンチパターンからそれぞれ棄却できるか確認する。
- `skill-creator`のquick validationと`git diff --check`を実行する。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

- `plugins/tumeda-dev/skills/think-through/SKILL.md`のS8: 論点5で合意した作業中のready再評価contractを反映済み。
- `plugins/tumeda-dev/skills/think-through/SKILL.md`のS9: 論点6で合意した全caseを扱える方針群の反復帰納contractと二つのアンチパターンを反映済み。
- `baseline-ledger.md`: baseline 2 fileの全連続区間と44 semantic contractを分類し、production反映後のforward / reverse traceとcompleteness countを記録済み。
- `plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md`: 合意済みprototypeのiteration、feedback、任意`仮決定`、任意`再開条件`、`決定`contractを反映済み。
- `plugins/tumeda-dev/skills/facilitate-discussion/templates/proposal-sections/`: catalogと9 pattern fileをproductionへ追加済み。
- `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`: 既存processを維持し、生成・更新手順を新entry contractへ接続済み。
- `plugins/tumeda-dev/skills/task-design/SKILL.md`: discussion返却を固定field名ではなく、decisionと具体的なhandoffとして受ける語彙へ同期済み。
- `scripts/verification/validate-plugin.mjs`: 新entry骨子、proposal pattern、S8、S9を検証し、廃止fieldの再導入を拒否するassertionへ同期済み。

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし

### 分類保留（設計中のみ）

なし
