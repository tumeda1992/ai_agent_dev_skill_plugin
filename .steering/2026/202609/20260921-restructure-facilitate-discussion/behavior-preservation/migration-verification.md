# 移行の検証結果と適用境界

production適用後の結果は [production-verification.md](production-verification.md)、実fileと旧IDの対応は [production-migration-evidence.json](production-migration-evidence.json) を参照する。
以下はprototype検証時の証拠として保持し、production完了の根拠と混同しない。

## prototypeレビュー反映後の証拠の有効範囲

レビュー五件を反映したprototypeについて、順方向の意味照合・独立contract粒度・逆引き・三ownerの境界を再照合した。
以下の台帳集計はレビュー後の本文に対応する。独立A/B/C評価だけはレビュー前の履歴であり、後述の限界を保持する。

今回の差分は [論点24の内部記録](../internal-records/task-design-discussion.md.topic-24.md#iteration-0-record-1) へ対応付けた。
安全書込み・入口差分の構造化、中断復帰の正本一本化、origin-reviewの目的別記録接続、図の既存scopeの明示である。
旧source inventory・レビュー原文は変更していない。

- 旧 `S-C0081`〜`S-C0082` のdiscussion/chatの図の能力は維持し、適用範囲を明示した。
- 旧 `S-C0206` のorigin-review起動条件は維持し、合意済みの目的別記録へ接続した。
- 合意追加 `N-C038` の提示不明で停止するcaseはiterationを正本として保持した。
- 旧 `S-C0070`・`S-C0071` は論点24で合意した数え方の変更としてCHANGEへ更新した。前後の `S-C0069`・`S-C0072`〜`S-C0074` も保持したgate・routingと現在位置を照合した。

今回の限定validationは同内部記録のrecord-3・record-4、台帳最終整合はrecord-6に示す。
五指摘の反映先とhashはレビューファイルの「レビュー後の対処記録」、台帳が照合した全fileのhashは [独立contract監査](function-migration-audit.json) に保存した。

### 独立contractの集計

```text
適合 756 / 合意済み追加 306 / 合意済み変更 44 / 明示廃止 0
未監査 0 / 未分類削除 0 / 未分類追加 0
```

これはprototypeのwhite-box照合の集計であり、production移行完了の宣言ではない。
独立単位の正本は `function-migration-audit.json`、分解判断は [監査定義](contract-audit-definition.json) である。

- 旧sourceは686単位、旧entryは114単位へ分解した。適合はKEEP 237・MOVE 190・ADAPT 329の合計である。
- 追加306単位は六用途format、二層保存、状態・回復、明示した追加例等であり、各単位から合意根拠へ戻れる。
- 旧側800はsource686＋entry114であり、適合756＋合意変更44に一致する。
- 追加側の途中集計271から306への差35は既合意の複合条件の細分化である。N-C005が3、N-C006が6、N-C014が9、N-C019が3、N-C020が4、N-C037が10増えたもので、35件の新しい仕様を加えたものではない。
- 旧規則へ `source_contracts` で戻るN-C関係索引37とE-Aの要約は重ねて加算しない。37は旧800から差し引く数ではなく、旧側と追加側の両方の集計外である。
- 原文候補603件のID・原文はsnapshotに保持した。区切り・列名等54箇所は旧・追加側を合わせた構造記法であり、独立能力として数えない。
- 一つの規則が複数の旧sourceに現れる場合は出現ごとに保存を照合する。したがって総数1106は、重複を除いた潜在能力の数ではない。

一文を機械的に切っただけの集計ではない。
例えばorigin-reviewはtrigger・次論点より先という順序・提案mode・同origin一回を分け、再開では条件成立の次回接続と現在条件の除去を分けた。
文の前提を失わせる分解はせず、各単位から元の連続sourceと周辺節を辿れる。

### レビュー差分の意味照合

- decisionの分割境界
  - `S-C0070`・`S-C0071` は、部分修正可能箇所を数える旧挙動から、別の問いと独立した結論を判定する挙動へのCHANGEである。根拠は論点24の明示合意。
  - 保存前gate、event後の所属routing、scope照合を保持し、iterationの保存前・応答時から同じ基準へ接続した。例は `N-R003`〜`N-R005` で追加として区別した。
- 安全書込み・入口差分・変更集合
  - 全文再読込→実見出しの探索→所属と範囲の一意性→更新または追加→差分確認の順を保つ。
  - 番号重複は全書込み停止、欄の不在・複数・不整合は更新停止、新規追加の正常な未作成は停止でない。`S-C0062`〜`S-C0066`、`N-C008`〜`N-C010`、entryの保存・既存形式contractへ接続する。
  - 新規・継続・決定済み再開、二層の初期化順、過去履歴不変、同じeventで二回を作らない制約を合算した。変更集合は対象・対応・許可・保持・削除・除外・完了状態を維持する。
- 中断復帰
  - `N-C037`を保存境界ごとの独立単位へ分け、提示済み不明の停止を `N-C038` として保持した。
  - 具体caseの正本はiterationの表だけに置き、handlerはその表への読取接続と、確定・通常同期・事後回復検出を所有する。旧handler側の重複説明を消したことを能力廃止にしない。
- origin-reviewとformat
  - 旧 `S-C0206`〜`S-C0212` のtrigger・一回限り・承認gate・consumer境界を維持した。
  - 追加検討は既決 `N-C022`〜`N-C026` の入力→実施→結果保存へ接続するだけであり、新しい外向き回や提案を自動要求しない。保存だけなら架空の調査を作らない。
  - fallbackの目的・表せない必要情報の記録、単なる見出し調整との区別は `N-R006`・`N-R007` として、目的別formatの合意とレビュー修正依頼へ接続した。
- 図の描画方式
  - 旧 `S-C0081`〜`S-C0085` のraw text可読性・ASCII優先・mermaid条件・誤用禁止はdiscussion/chatに保持した。
  - 内部logは `N-C007` の記法標準に従う。図を選ぶ条件と描画方式を分け、旧例外を全記録へ広げない。

## Baselineと証拠の分担

baselineは `a6e24853800fcb75eb6a7bdd91479a633f740d4a` である。
productionがこのbaselineと一致することを確認してから、productionとprototypeの `git diff --no-index --unified=0` を取得した。
productionへ適用した差分ではない。

台帳・逆引き索引の `prototype_root` は各JSON fileから見た移管先の基準、`steering_root` は合意根拠を持つ作業directoryの基準である。
移管先の `SKILL.md` 等は `../faciliate-discussion/`、合意根拠の `task-design-discussion.md` は作業directory直下で解決する。
旧sourceのpathはrepository rootを基準とし、原文候補のsource inventoryは取得時の内容を保持する。

| 証拠 | 役割 |
| --- | --- |
| [source inventory](function-migration-source-inventory.json) | 編集前sourceから抽出した603候補の保全。完成ledgerではない |
| [旧sourceのledger](function-migration-ledger.json) | SKILL、metadata、十patternの598原文候補と5構造記法、連続構造範囲の移管先 |
| [entry ledger](entry-template-migration-ledger.md) | 旧entry全109行の13構造範囲と103contract |
| [合意差分](function-migration-additions.json) | 実行・保存の53単位、目的別formatの179原文単位と合意根拠 |
| [独立contract監査](function-migration-audit.json) | 原文候補を独立した意味へ分解したunit、分類、合意、現在の移管先、集計 |
| [逆引き索引](function-migration-reverse-index.json) | 削除行・追加行・新設fileの各非空行から、旧contractまたは合意差分への接続 |
| [validator/caller設計](../discussion-recording/validator-caller-design.md) | 旧guardを守るownerと、保存層が変わるcallerの具体修正 |

数字は照合位置へ辿る索引であり、独立した能力の数ではない。
旧contractとその合意差分は同じ変更を二方向から記録するため、足して能力数にしない。

## 順方向で復元したもの

実物へ対応させた際、主要命令だけでは失われる限定・理由・具体例を復元した。

- 起動は一度だけ、論点はその後、iterationは選択した論点の内側という包含と入口条件。
- 仮決定を過去の部分判断の機械加算にしないこと、具体表現だけの同期では旧iterationを変更も追加もしないこと。
- 未決提案が末尾にあるため、同じ案をentry上部へ複製しない禁止と理由。
- scope・owner移動が独立decisionなら別論点、同decision内の説明なら内容に合うpatternを使う具体例。
- 記録回復は合意前保存の通常経路の代替ではないこと。
- 機械的適用に新しい判断が混じるなら、proposal保存・提示・合意を省略しないこと。
- validatorが守る意味不変の語句。語を綺麗にするためだけにguardを変更しない。

表示pattern七fileはbaselineとbyte単位で一致する。
三fileだけに、合意済みの広義「認識合わせ」から「内容の理解を共有する」への語彙差分がある。
metadataはproductionでKEEPし、prototypeに複製していないことを削除と解釈しない。

## 逆方向の照合

レビュー後の実際のpair diffは削除255行・追加236行である。
新設fileも含む移管後903非空行を、旧contract、entry contract、合意差分、構造記法、prototype専用注記へ対応させた。

- 削除行からの対応なし: 0。
- 追加行からの対応なし: 0。
- 新設fileを含む非空行からの対応なし: 0。
- 明示廃止した旧能力: 0。

これは意味の照合を置き換える機械合格ではない。
新しい入力・結果保存、認識合わせ、六用途format、二層の読者責務、中断復帰は、旧規則へ無理に押し込まず、合意差分として登録した。
名前・owner・pathへの読み替えと、表示・保存時点・正本の分担が変わる差分を区別している。

prototypeのREADME・比較資料・冒頭注記は配布対象ではない。
標準への相対pathはprototypeから読める形であり、production投影ではvalidator/caller設計に示した相対pathへ変える。

## 三ownerを合算した境界

ここでのownerは三つの別agentではなく、同じ実行者が読む三つの責務fileである。
以下は本文を通読したwhite-box照合であり、agentを動かした結果ではない。

| 経路 | 先行gateと実行先 | 戻り先と保存責務 |
| --- | --- | --- |
| 新規提示 | handlerでfile・scope・親子・原因ownerを確定→iterationの準備 | discussion骨子→log入力→実施→log結果→背景・本文・空応答→handler同期→提示 |
| 継続修正 | handlerの所属と原因分類→iterationで評価対象と空欄を一意にする | 応答を一度保存→同decisionの次準備。別decisionは回を足さずhandler |
| 明示合意 | 保存済みの具体案と評価対象を照合→応答保存 | 新回や材料確認を作らずhandler確定→同期→consumer適用→全体再評価 |
| 認識合わせ | 自力で埋められる不足を先に調査→user所有の空白だけを提示 | 回答・訂正・不足を保存→材料へ戻る。了承だけでdecisionを作らない |
| 決定済みの再開 | 同decisionを変えるeventと旧decisionを特定 | 旧履歴を保持し現在decisionを外す→同じeventで二回作らず準備 |
| reparent | handlerで既存parent・単一親・非循環を検証 | childの親だけを更新→必要な両parent state同期。独立decisionの合意待ちを偽造しない |
| scope外取下げ | handlerでscope外と確定したevidenceを特定 | 空応答ならそこへ、確定済みなら新回へ記録→現在決定を局所更新 |
| 外部停止 | iterationで取得不能条件・不足を記録 | handlerが必要時だけ再開条件を置く。通常応答待ちと混同しない |
| 保存途中の中断 | 実file・tool結果・会話を照合 | 未完部分だけへ戻る。保存済みを重複せず、提示済み不明なら再送停止 |
| 未保存chat合意 | handler検出→record-recovery全文→具体案と明示合意を特定 | 過程はlog、提示・原文応答はdiscussion→handler確定。再合意しない |
| 事後に判明した記録漏れ | handler検出→record-recoveryで証拠と確認不能範囲を区別 | 事後記録として二層へ戻す。未提示案・未確認合意は創作しない |
| consumerへの返却 | 全経路でhandlerの通常同期 | 一decisionずつ返し、consumerが適用・再評価する前に次decisionを進めない |

二重正本は次の境界で防ぐ。

- templateは保存形だけを持ち、scope・部品選択・挿入条件を実行しない。
- 六用途guideは記入形だけを持ち、材料充足と状態遷移をiterationから奪わない。
- decisionとユーザー原文応答はdiscussion、過程と訂正証拠は内部logに置く。
- consumerは保存名・番号・entry形式を組み立てず、返されたdecisionの適用を所有する。

## Sourceから導く実行scenario

追加合意のhappy pathだけでなく、移行前の停止・例外から導出した。
まだ実行していないscenarioを成功として数えない。

| ID | Source | 入力・状況 | 観測する結果 |
| --- | --- | --- | --- |
| B01 | S-C0004・0005、入力・起動節 | 通常の短い質問、またはdirectory未指定の明示起動 | 暗黙にdiscussionを作らない。明示起動で入力不足なら指定を求める |
| B02 | 旧file解決節、E-C022–025 | legacy h3 entry、見出し例を含むfile | 実論点だけを採番し、旧深度・履歴を一括変換しない |
| B03 | 旧一意性・親子節、E-C005–006 | 重複論点、自己参照parent、循環 | 不正な書込みを停止し、自動renumberしない |
| B04 | E-C001–004・054・074 | 同じfeedback中に独立して採否を変えられるdecision | 同じ回へ累積せずhandlerで分ける |
| B05 | 原因owner節、S-C0201 | 共有知識の誤りを成果物修正として指摘 | 一般則の具体修正を先に扱い、症状だけを合意しない |
| B06 | E-C012–020・064–070 | 空feedbackへの明示合意、または修正 | 対象欄に一度保存し、合意は即確定、修正は次回。過去本文は保持 |
| B07 | E-C061・071–073・082–088 | 決定済み内容を無効にするevidence、外部待ちの解消 | 同decisionを再開し、条件成立を次回へ接続。旧decisionを現在結論として残さない |
| B08 | E-C093–103 | 後続decisionによるpathだけの具体化 | 現在decisionだけ典拠付きで同期。旧iterationへ新回を増やさない |
| B09 | 旧reparent・取下げ節 | parent変更、作成後のscope外判明 | child参照と必要parent stateだけ更新し、履歴を削除しない |
| B10 | 旧chat合意・事後記録節 | chat合意済みだが未保存、または履歴の一部が消失 | 確認できる変遷を事後記録し、不明な合意を作らない |
| B11 | 旧返却gate | consumerがまだ適用していないdecision | 複数decisionを溜めず、適用・再評価前に次を進めない |
| B12 | N-C019–028 | 自力で取れる不足が残る | 調査前入力→実施→結果→再判定がlogに残り、調査許可の問いで逃げない |
| B13 | N-C030–041 | 認識合わせへのok・部分回答・回答不能、作業再開指示 | 回答範囲だけを扱い、未提示案の合意・架空の回答へ変えない |
| B14 | N-C033–038・042–045 | 二層保存の途中で中断、提示済み不明 | 保存済みを見て復帰。両層を単独で読め、linkを説明省略に使わない |

## レビュー前の独立した三入力で観測した結果

別agentへprototypeと最小の実入力だけを渡した。設計文書・ledger・想定結果は読取対象から外した。
一時directory内だけの書込みを許し、各入力を一回処理して停止させた。
最初の試行は利用上限で中断したため、同じagentが未完部分から復帰した。完了済みcaseの再実行はしていない。

実物と実行者報告は `/private/tmp/facilitate-forward.BVehqY/` にある。
結果の正本は [result.md](/private/tmp/facilitate-forward.BVehqY/result.md)、各caseのdiscussionと内部logは同directory配下である。

| 入力 | 実際の状態・返答 | 確認できた境界 |
| --- | --- | --- |
| A: 保存済み提案・空feedbackへ「上限復活したから続けて」 | file無変更。合意へ変換せず、chat提示済みか不明として証拠確認で停止 | B13の再開指示とB14の提示不明停止 |
| B: 宛先の期待・経験を問う認識合わせへ「ok」 | 原文と入力不足を保存。具体的な一場面へ絞った認識合わせ1と内部logを作り、回答待ち | B13の経験未取得、二層の独立した背景・問い |
| C: 具体案と明示合意の会話、反映済みspec、未保存discussion | 原文の提案・合意・代償・反映結果を事後記録し、再合意せず決定。元資料は無変更 | B10の回復、B06の明示合意、B11の適用済み結果の返却 |

Case Cの合意案は、同じ通知の再送は初回の宛先、新規送信は現在設定を使うものである。
discussionは利用目的からこの案を選んだ因果と代償を持ち、内部logは会話・現specを照合した方法と、変更前状態・実動作を確認できない限界を持つ。
specの存在を合意の証拠にせず、`ok。その案にして。` を直前の具体案へ対応させている。

この三件を全経路の成功とは扱わない。実施前保存とformatには次の限界がある。

- Bは既存入力の読解後に内部logを作成した。本人へ問う前の保存順は守ったが、調査・判断の全段階を実施前保存できることの証明にはならない。
- Cの資料照合は事後記録であり、当時の実施前保存を捏造していない。後続のdoc-enricher確認は入力→照合→結果の順で保存した。
- Cの記録2は `確認: 反映済みの決定から残す共有知識の有無` という独自formatだった。六用途を選んだ根拠や、該当しないとしてfallbackする根拠は記録されておらず、目的別format運用の完全適用は確認できない。

最後の点は合意済み用途formatの運用上の未達として維持性レビューへ渡し、指摘4の接続明確化へ反映した。
今回の実行履歴自体を書き換えたり、成功扱いへ変えたりしない。

## レビュー後の独立した二入力で観測した結果

white-box完了後、同じ評価agentへ現在prototypeと別domainの最小入力だけを渡した。
design・ledger・review・想定結果は読取対象から外し、D/Eを一回ずつ処理した。中断後は同じdirectoryの未完部分から続け、完了caseは再実行していない。
実行者の記録と全成果物への導線は [D/E result.md](/private/tmp/facilitate-forward-de.ZzHDrk/result.md) にある。

| 入力 | 実物から確認した結果 | 対応する境界 |
| --- | --- | --- |
| D: 支払ボタン名を「支払う」へ変更し、アクセシビリティ名とヘルプも追随。挙動維持、実適用なし | 二file三箇所の完全diffを一つの提案にした。理由・代償・未検証範囲を持つ背景と、判断・検証の内部logを保存し、応答待ちで停止 | 一つの採否に伴う必然的展開を分割しない。B12の入力と結果、B14の同じ回への中断復帰と独立可読性 |
| E: ログ保持を30日へ、失敗通知先をチャットへ。両方未採用 | 二つの独立論点へ分けた。資料の現行7日・容量と監査期間の未確定を確認後、延長目的・経験を問う認識合わせ0を保存。通知先は受付のみ未評価 | B04の独立採否、B12の許可範囲内調査、B13のuser所有の不足と採否の区別 |

Dのdiscussionは名称変更の適用範囲と支払挙動の保持、旧名称に慣れた利用者の読み替え、UI・読み上げ・実装を未検証とする限界を持つ。
Eは資料内の不在を組織全体の不存在とせず、目的への回答だけで容量や監査条件まで確定しない。
二層の本文をそれぞれ読み、logのlinkだけで判断理由を省略していないことを確認した。
どちらもfixtureの本文を変更せず、回答・合意・決定を創作していない。

保証範囲は限定する。

- 保存順は実行者のtool履歴報告と実本文へ対応するが、独立した時刻付きtool監査logはない。中断前の全tool順序まで現物から保証しない。
- Dの提案保存とEの初期骨子保存では、記法標準全文の取得と書込みが同一exec内だった。読取結果をモデルへ返す境界がないため、毎回熟読してから書くことの完全遵守は確認できない。
- Eの通知先案は未評価であり、二案とも採用決定まで進めた実行ではない。
- B01〜B14の全件実行、レビュー後の事後回復・origin-reviewの再実行、実UIや運用環境の検証は行っていない。
- 原本artifactは一時directoryにある。上記入力・観測・限界をこの文書へ残し、一時fileの永続保存は保証しない。

新たな設計trade-offは抽出されなかった。実行結果の意味が合うことと、全工程の完全遵守・全経路の成功は区別する。
標準参照の条件は既存本文に明示されている。同一execへの集約は実行側の参照手順の未充足と分類し、設計に読取条件がないことを原因にはしない。
取得結果を受領してから書き込む既存契約を守る対象であり、新規規則の追加や新しい合意論点は作らない。

## 静的確認と環境上の未実施

- validator置換片は `node --check` で構文エラーなし。
- 旧48guardの移管先に、対応表が要求する文字列の欠落はなかった。
- entry十部品、内部log三部品の見出し・code block数が一致し、適用制御commentはなかった。
- 今回同期した五文書の相対link60件にpath不在はなかった。これはanchor意味や実行順を保証する検査ではない。
- レビュー後の最終整合では、更新文書五つの実link255件にpath不在はなかった。台帳再計算の対応なし0、source inventoryのhash不変も確認した。
- skill-creatorの `quick_validate.py` は、hostにPyYAMLがなく `ModuleNotFoundError: No module named 'yaml'` で開始できなかった。依存を追加しておらず、validatorの合格として数えない。
- productionのplugins・scriptsは未変更。productionへ投影したrepository validator・handoff testは未実施である。

## 今回の到達点と完了の境界

順方向・逆方向の対応、独立contract粒度、三責務を合算した入口・停止・返却を、レビュー後prototypeへ照合した。
原文候補の件数を完了数にせず、独立unitとそのevidenceへ辿る集計を冒頭に示した。
white-box結果を固定した後、レビュー後の限定black-box D/Eを確認した。レビュー前のA/B/Cとは区別する。
既存validatorの成功は同じprototype本文に対するrecord-4の結果として保持し、今回再実行したとは扱わない。
五入力を合算してB01〜B14の全件成功とはしない。
prototype作成や個別decisionへの合意を、production移行の承認へ読み替えない。

この時点ではfunction migrationの完了もproduction移行完了も宣言しない。
