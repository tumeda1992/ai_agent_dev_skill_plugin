# Function migration policy

## 1. 目的

function migrationは、既存の機能を別file、別module、別skill、別owner、別repositoryへ移すrefactoringである。完了条件は「新しい場所に似た説明やcodeがあること」ではなく、**移行前に成立していた挙動と意味が、合意済みの変更を除いて全量維持されていること**である。

ここでいうfunctionは実行codeだけを指さない。skill、prompt、workflow、template、script、documentに埋め込まれた判断能力、停止能力、失敗防止能力も対象に含む。

この規範は次へ適用する。

- file分割、module分割、rename、directory移動
- ownerまたは責務境界の変更
- skill間、plugin間、repository間の移植
- 実装言語、framework、保存形式の置換
- 長い文書やworkflowの再構成

## 2. 移行の不変条件

移行後の全consumerを合わせた観測可能な能力は、次を満たさなければならない。

```text
移行後の能力
= 移行前の能力
+ ユーザーが変更として明示指示した追加・変更
+ 実装者の提案にユーザーが明示合意した追加・変更
- ユーザーが廃止として明示指示または明示合意した能力
```

ユーザーが相談中に挙げた思いつき、比較対象、疑問を、変更指示として読み替えてはならない。実装者が提案した変更は、提案したという事実だけでは許可にならず、ユーザーの明示合意を必要とする。

「設計として非合理に見える」「冗長である」「新構造なら不要に見える」「短く言い換えられる」は、変更または削除の権限にならない。過去の細かな文言には、長年の運用で実際に起きた失敗と、その再発を防ぐための限定、強調、理由が圧縮されていることがある。意味を証明できない意訳は改善ではなく、未合意の機能変更として扱う。

新しい構造へpath、owner、field名、呼出関係を読み替えることはできる。ただし、読み替えによって判断条件、順序、停止条件、例外、失敗時の挙動が変わるなら、単なる適応ではない。変更候補としてユーザー合意を得る。

## 3. 保存対象となる意味単位

見出しや主要な命令だけを拾っても、functionの全量にはならない。移行前sourceを先頭から末尾まで読み、少なくとも次を独立したcontractとして扱う。

- 入力、前提条件、trigger、default
- action、出力、返却値、副作用
- 必須順序、先行gate、完了条件
- 禁止、停止、再開、取消、fallback
- owner、single writer、正本、callerとconsumerの境界
- 例外条件、分岐、適用外
- なぜその規則が必要かという理由
- 正しい例、悪い例、失敗例、counterexample
- 読み手が誤適用に気づくための判断質問
- `MUST`、警告、太字、章分け等が表す強度と相対的重要性
- 複数の章やfileをまたぐ順序、対応、排他、lifecycle

理由、例、失敗例、判断質問は装飾ではない。抽象的な規則を具体的な場面で正しく発火させるfunctionの一部である。「原則は残した」としてこれらを落とすと、文字列としては似ていても判断能力が低下する。

## 4. 二層ledgerを編集前に作る

移行対象を編集する前にbaselineを固定し、構造ledgerとcontract ledgerを作る。移行後fileや途中の失敗実装を正本にしてはならない。

### 4.1 baselineの固定

次を記録する。

- revision、tag、snapshot等、移行前sourceを再現できる識別子
- 対象fileと連続した行範囲
- sourceとdestinationの方向
- 移行開始前に既に合意済みだった変更・廃止

作業途中のfileしか残っていない場合は、Git等から移行前sourceを復元して読む。失敗実装へ不足分を継ぎ足すだけの修復は、失敗時の要約や誤分類を土台に残すため避ける。

### 4.2 構造ledger

移行前の章、節、template block、script、file間の関係を連続範囲で登録する。各行に次を持たせる。

| 項目 | 内容 |
| --- | --- |
| source | fileと連続範囲 |
| structural role | 章、gate、template block、helper等の役割 |
| relation | 前後順、親子、排他、参照先 |
| destination | 移行後のfileと章 |
| classification | `KEEP | MOVE | ADAPT | ADD | CHANGE | RETIRE` |
| agreement | `ADD | CHANGE | RETIRE`の指示または合意根拠 |
| evidence | 移行後に構造と関係を確認した証拠 |

構造ledgerは「章がどこへ行ったか」を追う。章を構成する個々の意味はcontract ledgerで追う。

### 4.3 contract ledger

各構造範囲を§3の意味単位へ分解する。長い一項目へ複数contractを丸めず、一つの前提・action・禁止・例外等を独立して照合できる粒度にする。

| 項目 | 内容 |
| --- | --- |
| contract ID | 安定した識別子 |
| source | 原文を特定できるfileと範囲 |
| kind | 前提、action、順序、禁止、例外、fallback、理由、例、失敗例、判断質問、強調等 |
| meaning | 原文が生む判断または挙動 |
| destination | 移行後ownerと具体的な節 |
| classification | `KEEP | MOVE | ADAPT | ADD | CHANGE | RETIRE` |
| agreement | `ADD | CHANGE | RETIRE`の指示または合意根拠 |
| verification | white-box照合結果 |

分類の意味は次の通り。

- `KEEP`: ownerも意味も維持する。
- `MOVE`: ownerまたは配置だけを変え、意味を維持する。
- `ADAPT`: 合意済みの新構造へbindingを読み替えるが、判断と挙動は維持する。
- `ADD`: 移行前に存在しない能力を追加する。ユーザーの明示指示または、実装者の提案への明示合意が必須。
- `CHANGE`: 挙動または意味を変える。ユーザーの明示指示または、実装者の提案への明示合意が必須。
- `RETIRE`: 能力を廃止する。ユーザーの明示指示または、実装者の提案への明示合意が必須。

`ADD | CHANGE | RETIRE`に指示・合意根拠がなく、`KEEP | MOVE | ADAPT`に具体的なdestinationがない行を残したまま実装へ進んではならない。移行後だけに現れるcontractを既存contractへ無理に対応付けず、`ADD`として独立させる。未分類削除と未分類追加は常に失敗である。

## 5. 変更が必要なときの合意gate

新構造と旧contractが両立しない場合、実装者が合理性だけで決めない。意味単位ごとに次を示してユーザーへ問い、明示合意を得る。

1. 移行前の原文と生じていた挙動
2. 新構造と競合する具体的な理由
3. 維持、適応、変更、廃止の選択肢と影響
4. 推奨案と、その弱点
5. 合意後の代替contractまたは廃止後の状態

同じ一つの上位decisionに完全に規定される複数contractはまとめて合意できる。それ以外を「細部」として一括承認へ丸めない。合意結果はledgerの各該当行から逆引きできなければならない。

## 6. Source-firstの実装手順

1. baseline、方向、合意済み変更を固定する。
2. 構造ledgerを作り、旧sourceの全範囲を登録する。
3. contract ledgerを作り、全意味単位を分類する。
4. `ADD`と、競合する`CHANGE | RETIRE`を上位decisionから一件ずつ合意する。
5. 移行前sourceを土台に、`KEEP | MOVE | ADAPT`を新ownerへ移す。
6. `ADD | CHANGE | RETIRE`は指示または合意された差分だけを適用する。
7. white-box検証を完了する。
8. 旧contractから導いたblack-box scenarioを実行する。
9. validator、lint、test等の通常検証を実行する。

途中の失敗実装がある場合は、それを完成形の土台にするかゼロベースで判断する。意味単位の欠落や章構造の縮退が広い場合は、移行前sourceから論理的に再構築する。安全に切り戻せる場合は切り戻してもよいが、無関係なユーザー変更や既に合意済みの成果物を巻き戻してはならない。

## 7. White-box検証

white-box検証は、移行前に顕在化していた能力を内部構造から全件照合する工程である。次をすべて行う。

### 7.1 順方向の照合

移行前の全構造範囲と全contractについて、移行後の具体的なownerと節、または合意済みの変更・廃止理由を確認する。複数fileへ分散した場合は、それらの合算で元の順序とlifecycleが再現されるか通読する。

### 7.2 逆方向の照合

Git差分の削除行を起点に、対応する旧contract IDとdestinationを逆引きする。Git追加行と移行後の全contractも逆向きに読み、対応する旧contract ID、または`ADD`とその指示・合意根拠へ接続する。ledgerに載らない削除または追加が一行でもあれば、完了ではない。旧ownerへ規則を残し、新ownerにも複製して二重正本にすることも、移行ではなく責務の逆流として検出する。

### 7.3 境界の照合

個々のfileが正しくても、callerとconsumerを合算したworkflowが欠けることがある。次を重点的に確認する。

- 安全gate、ユーザー確認、停止・再開条件
- 調査、review、feedback routingのowner変更
- checkbox、取消、commit、push等、不可逆または外部状態に関わる条件
- directory identity、正本、single writer
- fileをまたぐ必須順序、排他条件、resultの受渡し

### 7.4 情報量と構造の異常signal

移行後の文章量や章数が大幅に減った場合、それ自体は失敗の証明ではないが、強い監査signalである。削減された各範囲について、意味が別の場所に移ったのか、合意済みで廃止されたのかを説明できるまで完了扱いにしない。

特に、独立した章を薄い箇条書き一つへ置き換え、章名または要旨だけを残して「移行した」とすることを禁止する。章内の条件、理由、例、失敗例、問い、他章との関係にbijectiveな対応がなく、同じ判断を再現できなければ形式的移行である。

### 7.5 完了集計

最低限、次を数で示す。

```text
適合 N / 合意済み追加 N / 合意済み変更 N / 明示廃止 N / 未監査 0 / 未分類削除 0 / 未分類追加 0
```

数は正しさの代替ではない。各件のevidenceへ辿る索引として使う。

## 8. Black-box検証の位置づけ

smoke testや代表scenarioは、対象が持つ潜在能力のごく一部だけを観測する。極端にいえば「潜在能力の1%を通しただけ」という位置づけであり、通過しても、たまたま通った経路以外の判断、停止、例外、失敗防止が維持されたとは証明できない。このためblack-box検証をwhite-box検証の代替にしてはならない。ここでの1%は網羅率の実測値ではなく、smokeの証明力を過大評価しないための比喩である。

black-box scenarioは、white-box ledgerに登録した旧contractから導出し、white-box完了後に行う。新しい実装を眺めて「通りそうなhappy path」だけを作ると、既に落とした能力をtest対象からも消してしまう。

validatorや文字列assertionも補助である。重要なanchorの消失やpath不整合は検知できるが、文脈、順序、理由、例外まで同じ意味で働くことは通読とledger照合でしか確認できない。

## 9. 失敗pattern

### 章を要旨一つへ畳む

旧章の主張だけを新fileの箇条書きへ載せ、条件、理由、例、失敗例、判断質問を落とす。見出し検索とsmokeは通るが、実際の判断能力は失われる。

### 意訳で「きれい」にする

重複や不自然さを整える過程で、強調、限定、例外を一般論へ丸める。過去の障害に由来する再発防止ニュアンスを、由来を知らない実装者が消してしまう。

### 失敗実装へ継ぎ足す

既に欠落した移行結果を前提に、指摘された数箇所だけを追記する。認識できた穴だけが戻り、同じ原因で落ちた未発見のcontractは戻らない。

### smokeの通過を完了根拠にする

happy pathが一つ通ったことを、全能力の保存と読み替える。testが観測していない分岐を無為に捨てる。

### owner移動を削除の機会にする

新ownerへ移す内容を要約し、旧ownerからは全量削除する。合算しても移行前と同じにならず、責務整理の名で機能変更が混入する。

### 未合意の能力をついでに追加する

旧contractを削除していないことに安心し、新ownerへ便利そうな判断、例外、副作用を足す。移行は改善taskではなく、追加能力にも削除と同じauthorityと逆引きが必要である。

## 10. 具体例

### Skillのowner移動

旧skillに「tasklistを作る」章があり、その中にphase分割、test作成、UI確認、ユーザー動作確認、commit前gate、失敗例があるとする。新skillへ「tasklistを作成しreviewする」と一行だけ移しても、function migrationではない。旧章を意味単位へ分け、それぞれを新skill本体、分割した設計規則、template、executorへ対応付け、合算したworkflowが同じ判断を再現することを確認する。

### 別domain: API clientのclass分割

一つのAPI clientをtransport、retry policy、response parserへ分割する場合、public method名と成功responseだけを維持しても足りない。timeoutのdefault、retry対象status、backoff順序、最大試行回数、parse失敗時のerror型、logging前のsecret除去もcontractである。代表的な200 responseのtestが通っても、これらをwhite-boxで対応付けなければ移行完了ではない。

## 11. 完了gate

- [ ] 移行前baselineと方向を再現可能な形で固定した。
- [ ] 構造ledgerが旧sourceの全連続範囲をcoverしている。
- [ ] contract ledgerが§3の意味単位をcoverしている。
- [ ] 全contractが`KEEP | MOVE | ADAPT | ADD | CHANGE | RETIRE`へ分類されている。
- [ ] `ADD | CHANGE | RETIRE`の全件にユーザーの明示指示または明示合意がある。
- [ ] `KEEP | MOVE | ADAPT`の全件に具体的なdestinationとverificationがある。
- [ ] Git削除行からcontract IDとdestinationまたは廃止合意を逆引きできる。
- [ ] Git追加行と移行後contractから旧contract IDまたは合意済み`ADD`を逆引きできる。
- [ ] 移行後の全ownerを通読し、順序、境界、停止、例外を合算で確認した。
- [ ] 章から薄い箇条書きへの未証明な縮退がない。
- [ ] 情報量の大幅減少を異常signalとして監査した。
- [ ] `未監査 0 / 未分類削除 0 / 未分類追加 0`である。
- [ ] 旧contract由来のblack-box scenarioをwhite-box完了後に実行した。
- [ ] smoke、validator、行数、見出しの存在だけを意味保存の証拠にしていない。

このgateを満たすまで、「移植済み」「refactoring完了」と報告してはならない。
