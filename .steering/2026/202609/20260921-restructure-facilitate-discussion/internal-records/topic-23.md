# 論点23の内部検討: 二層の保存形と接続

対象は [task-design-discussion.md](../task-design-discussion.md) の論点23・イテレーション0である。
このfile名は当作業の暫定名であり、設計対象skillの正式命名を先取りしない。

## 開始context

discussionはユーザーが各回の内容を理解・判断する正本、内部logは調査・比較・訂正等の実施経過の正本である。
内部経過を分けても説明を薄くせず、双方を単独で読める文書にすることが合意済みである。

- 配置はdiscussion directoryの `internal-records/` 配下、一論点一file。過去履歴は一括移動しない。
- 保存は作成中の回とlog接続の準備、入力→実施→結果、提示の再構成・照合、応答保存→後続処理の順である。
- 制御は三実行file、discussionの十部品は一つの `discussion_entry.md`、六用途の記入形は `consideration-records/` 群が所有する。
- 未確定なのは正式名、相互参照、logの骨子、二層分離によるentry差分である。これらを具体化しても、既決の読解品質・履歴保持・保存順は弱めない。

## 判断: 番号だけでなく、discussionのidentityから保存先を導く

### 判断対象と既知の根拠

同じdirectoryに `task-design-discussion.md` と `implementation-review.md` がある場合、双方に論点1が存在できる。
現行skillの入力は既存directoryと任意basenameであり、論点番号は各discussion内だけで一意である。
従って `topic-1.md` だけでは対象を決められない。

比較するのは、discussion basenameをfile名へ含める平坦な配置と、basenameで下位directoryを区切る配置である。
basenameから拡張子を勝手に落とすと `discussion` と `discussion.md` を同一名へ潰すため、元のidentityを保つ必要がある。
ここでは新しい外部設定や採番正本を追加せず、確定済み入力から一意に導けること、作業directoryを辿りやすいことを評価する。

### 接続を確かめる方法

保存先だけでなく、次の具体例へ当てる。

- 同じdirectoryの二つのdiscussionに同じ論点番号がある。
- 同一論点に複数の外向き回があり、同じ調査テーマが再登場する。
- 過去findingへの訂正が後の回に追記され、そのfindingを別論点から使う。
- legacyの提案背景に根拠があり、新しい回だけが内部logへ分かれる。

同じownerが対象fileの全文とdiscussionの現在stateを読み、根拠・訂正を辿る前提で保存形を組み立てる。
新たな完了flag・進捗索引は作らず、既決の停止と事後回復へつながることを確認する。
具体本文を組み立てる前に、ここへ判断対象・根拠・確認方法を保存した。

### 比較結果と採った具体化

平坦な配置でも、basenameを省略せず含めれば、同じ番号を持つdiscussionどうしを区別できる。
`internal-records/{D}.topic-{N}.md` とし、下位directoryを追加する案は採らない。
別directoryを作る利点は同一discussionのまとまりだが、今回の一論点一fileという要件には必須でなく、追加階層なしで一意性を満たせるためである。

- 異なるdiscussion、拡張子の有無、日本語・空白・`#`を含む五つのbasenameと二つの論点番号から、十の異なる保存先を生成できた。
- 元basenameをそのまま持つため名前は長くなる。filesystemの名前長制限に当たる場合は既存の書込み失敗として止まり、勝手に短縮して別の正本を作らない。
- link上では特殊文字をencodeし、実file名は変えない。file名の短さより、既存の二入力から同じ保存先を再現できることを優先した。

discussionの背景名は、既に合意した `検討記録` をそのまま使う。
新しい背景名への変更は二層分離に必須でない。内部logはfile titleで `内部検討記録` と識別し、回・記録単位のanchorと意味ある用途名を併用する。
「確認N」をタイトルにする必要はなく、番号は位置の識別だけを担う。

### 四caseへ当てた結果

| case | 保存・読取で成立すること |
| --- | --- |
| 二つのdiscussionの論点1 | basenameを含む別fileへ解決される。追加の採番ownerは不要 |
| 同一テーマを複数の回で調査 | 同じ論点file内でも回番号とrecord番号で別の根拠になる。用途名は具体的な問いを維持できる |
| 過去findingの後続訂正 | 対象log全文とdiscussionの現在stateを読み、新しい訂正から元を辿る。引用された古いblockだけで結論を出さない |
| legacy背景から新logへ移る回 | 旧背景を移さず、開始contextに分離開始回と旧根拠の所在を残せる。曖昧なら範囲を広げ、解決不能なら利用しない |

これは保存名の生成と机上の接続確認である。productionのparser、link renderer、agentの実行精度は未検証であり、全量移行の完了には数えない。

## 診断: TBDを追加合意の必要性と混同した

### 期待と実態

既決の目的・責務から導ける具体化は進め、ユーザー所有の判断だけを問うべきだった。
しかし正式名や参照がTBDであることから、新しい採否論点23の骨子を先に登録した。
また全文読取を扱う際、無関係な全logを毎回読む案を対抗馬にすれば、実際の要件より弱い比較になるところだった。

### 原因と修正

未記入の設計項目と、ユーザーにしか確定できない選択を同一視した。
修正先は今回の進行である。既存の名前・全文読取・一意識別を保つ具体形へ降ろし、同じ手順への再合意を求めない。
論点23は未提示の採否ヒアリング候補として取下げ、その履歴と具体化の典拠だけを残す。ユーザーの新しい「ok」や提案への合意は作らない。

## 検証: 具体化した保存形が上位合意と履歴を維持するか

### emit前に確認する範囲

document-reviewをdesignの変更範囲、保存形文書、今回の内部log、論点22・23のlifecycleへ適用する。

- 新しい保存形だけから、配置、所属、回、根拠、訂正、legacyの辿り方と更新境界を実行できるか。
- 上位合意の十部品・六用途・全文読取・独立可読性・expression_notation毎回参照・三ownerを落としていないか。
- userに新しい合意を受けたような記録を作っていないか。22の過去提示と、23以前の履歴を保持したか。
- production・prototypeの差分が無いか。全量ledger・validatorが未完であることを保っているか。

この確認は既存emit gateであり、ユーザーの記法指定だけを理由に新設する追加reviewではない。

### review結果と返却範囲

保存形文書を単独で読み、二つのdiscussionの保存先を生成し、同じ回・個別根拠・後続訂正・legacy根拠の所在を辿れることを確認した。
templateの表示形と制御の説明を分け、entry十部品のうち変える一部品と、追加する内部log三部品を特定した。
六用途の内容、独立可読性、記録前の標準全文参照、履歴不変、三実行fileのownerは維持している。
prototypeの整理対象に誤って挙げた未存在の `topic.md` は、実在する八つの分割file一覧へ修正した。

- discussionの23論点は番号一意・親の存在・非循環・親status導出が一致した。
  - 22の応答とdecisionは保存済み。23は追加ヒアリングの取下げであり、架空の提案・feedback・ユーザー合意は無い。
  - 23を除いた本文のSHA-256は、22合意反映直後の `f8f0ccc9aa4a74fe483183c9faf971436b27a6bfe30cf3f86f5289efe8283245` に一致した。
- designから保存名・接続・骨子・読取の古いTBDを外し、未完の実行本文・ledger・検査は残した。
- productionの `plugins/`・`scripts/` はHEADから差分なし。prototypeは31fileで、hash `338758cf8b35794fd6556fea97e7388c414fa1efdab47174dc640028164d7b5a` を維持している。
- 新しい機密情報、別環境の構成、credentialは追加していない。設計documentとlogのcode fenceは閉じている。

document-reviewの作成時・更新時観点を通した。判定は同じownerによる読解・局所照合であり、productionの機能移行や初見利用者の理解速度の検証ではない。
次工程は、保存形に追随するprototypeの更新、三実行file・六用途fileの最終本文、全量移行ledgerと検証への接続、依頼済みの思考標準三件の具体化である。
今回の返却では新しい採否質問を出さず、production実装へ進まない。

## 検証: prototypeを合意済みの二層保存形へ追随させる

### 今回確かめること

前回は保存形を設計文書へ具体化しただけで、ユーザーが読めるprototypeは論点15時点のまま残った。
ユーザーが既に依頼した完成形の提示を満たすため、prototypeを論点16〜22と上記具体化へ追随させる。
新しい採否を求める検討ではなく、承認済み責務・保存形の実体化と欠落検査である。

- 変更対象
  - 三実行fileへ二層の読取・保存順・中断復帰を接続する。
  - entry十部品を一fileへ集約し、内部log三部品を追加する。
  - 六用途formatは内部logへ接続し、discussion側は独立した判断背景へ再構成する。
  - 旧分割雛形と比較用templateは履歴として保全する。productionは変更しない。
- 確認方法
  - baselineの手順・template全行から移動先を照合し、実行入口と戻り先を追う。
  - 新規、継続、明示合意、認識合わせ、通常中断、事後回復へ保存順を当てる。
  - activeな参照、保存形の部品数、選択して読む先、親子・履歴保護の接続を検査する。
- 結論の限界
  - prototypeの構造検証とwhite-box照合は、稼働するagentによる全経路の実行成功を保証しない。
  - 元steeringから移管された思考標準三件とproduction validator・callerは、別の具体設計が必要であり、このprototype更新だけで完了にしない。

### 保存した実物と確認結果

prototypeの三実行fileと二層保存形を更新した。新しい合意や外向きiterationは追加していない。

- 三実行file
  - SKILL.mdにdiscussionと論点logの正本分担、保存名、全文読取、根拠の後続訂正、single writer、毎回の標準参照を接続した。
  - iteration.mdに作成中骨子→内部log準備→入力保存→実施→結果保存→再判定→判断背景の再構成→提示という順序を実装した。通常中断では実証拠から未完部分へ戻り、提示済みか不明なら再送しない。
  - record-recovery.mdに、過程を内部log、実際の提示・応答・合意をdiscussionへ戻す経路を加えた。事後記録、確認不能、過去履歴を保つ条件は維持した。
- 保存形とformat
  - discussion_entry.mdは合意済み十部品へ集約し、回の骨子へ内部logへのlinkを加えた。
  - internal_record.mdは所属・回・記録単位の三部品とした。六用途の構成は共通入口から内部logへ接続した。
  - 表示pattern三fileへ論点17の語彙変更を適用した。残る七fileはproduction原文との一致を確認した。
- 比較資料と履歴
  - 旧八小templateをalternatives/topic-15-split-templatesへ内容を変えず移動し、当時のentryも保存した。
  - discussionの論点15・16にある旧保存形への十linkだけを保存先へ直した。提案・説明・応答・decisionの本文は変更しない。
  - A案の比較templateは未変更である。production想定の当時の参照は比較資料として残し、実行導線には使わない。

静的照合では、activeなMarkdown linkは44件すべて実在し、開いたままのfenceはなかった。
entryは十見出し・十code block、内部logは三見出し・三code blockで、両者に制御commentはない。
discussionの23論点の一意性・親存在・非循環・親statusを確認した。
これらは構造・参照と机上の接続確認であり、agentの判断精度、全contractの意味保存、black-box成功の証拠ではない。

### 今回の到達点と残る監査

最小の完成形はprototypeで読める。document-reviewの作成時・更新時観点を適用し、旧九分割を現在仕様として説明するREADME、断片だけを読むようにも見える雛形参照、二層化後も背景を蓄積場所とする文を修正した。
変更範囲から、読者が保存先・手順・中断位置と二層の読者責務を追えることを確認した。新しい機密情報は追加していない。

全量移行は未完了である。既存entryの103contractに加え、baselineの十二fileから603の原文候補をfunction-migration-ledger.jsonへ登録したが、これは初期inventoryであり、具体destination・分類・意味照合・逆引きは未監査である。
自動抽出の句単位は最終contractの粒度を保証せず、表の区切りや構造行も含むため件数を保存能力数とは呼ばない。
残件はこのinventoryの意味単位への精査、三実行file全体のwhite-box、validator・callerの具体binding、元steeringから移管済みの思考標準三件である。
productionのplugins・scriptsは差分なし。production実装開始やdesign readyを宣言しない。

## 検証: sourceの意味単位と新しい実行経路を全量対応させる

### 主張・合格条件・方法

前段で作った実物が、合意済み差分を除く旧能力を保持するかを調べる。
対象は固定baselineのSKILL・entry・十の表示pattern・metadataと、それらに依存するvalidator・callerである。
entryの103contractを既存の照合単位とし、603の自動抽出候補は、構造行を除き意味単位・種類・具体的な移行先へ精査してから使う。

- 順方向: 旧sourceの条件・理由・例・停止・返却を、新三実行fileと保存形の具体位置へ対応付ける。
- 逆方向: prototypeの追加内容は既存contractか合意済み差分へ、旧sourceの削除内容は移動先か合意済み変更へ結ぶ。
- 境界: 新規・継続・再開だけでなく、合意、認識合わせ、reparent、取下げ、未保存chat合意、事後回復、consumer返却の順序を読む。
- 完了判定: pathや語の一致は補助とし、意味・強度・例外を保持できた行だけを適合とする。曖昧な対応は未監査のまま残し、件数で完了を演出しない。

欠落の補修は旧contractの復元としてprototypeへ反映する。新しい意味変更が必要なら、その箇所だけを既存合意と照合する。
validatorは守っていたcontractと新ownerを対応させて設計し、単に新しい文言へassertionを合わせない。
この結果を受けて、旧contractからscenarioを導き、元steering移管三件の具体本文を確定する。

### 順方向で確認した範囲と、復元した欠落

旧sourceからprototypeへの対応を保存した。これは全量移行の完了ではなく、次の逆方向・境界照合へ渡す結果である。

- entry template
  - 既存の103単位を実物の節へ対応させた。
  - 末尾の未決提案が判断対象なので上部へ重複しない禁止と理由が薄くなっていたため、handlerへ復元した。
  - scope・情報ownerの移動が独立decisionなら別論点、同じdecisionの説明ならflow・tree・表・散文を選ぶ例を本体へ復元した。
- SKILL・metadata・十表示pattern
  - 自動候補603件は原文inventoryとして別fileへ保全し、598意味単位と5構造記法へ分けた順方向ledgerを保存した。
  - 410単位は原文の一致、182単位はowner・保存層・章名等の読み替え、6単位は論点17の語彙差分を照合した。
  - 起動・論点・iterationの包含、仮決定の機械加算禁止、過去の回を変更も追加もしない同期境界、記録回復が通常経路の代替でないこと等を復元した。
  - 文字列assertionの守る意味が不変な箇所は、guardを緩めず移管先へ元の語句を残した。

これらの件数は保存能力の総数でも移行完了件数でもない。
source非空行の未登録は静的にゼロと確認したが、長い意味単位の分解・逆方向の追加分類・owner間の合算・black-boxを置き換える証拠ではない。
productionのpluginsとscriptsは未変更である。

### 次の確認へ渡すこと

新しい追加contractの合意根拠とprototypeの追加行を対応させ、callerが二層保存を一層と誤記していないかを確認する。
validatorは旧contract IDから新ownerを選び、章分割や保存形変更で本当に変わったassertionだけを更新対象にする。
例の追加を無制限に広げず、旧contractから導く入口・停止・回復・返却の経路で閉じる。

## 調査: 移管済みの思考標準三件を具体本文へ落とす

### 確定する問いと探索範囲

対象に含めるかは元steeringからの移管とユーザーの目的で確定済みであり、再質問しない。
ここで確かめるのは、既存の判断能力を変えずに必要性を説明し、場面名と補助見出しをどの具体文字列へ揃えるかである。

- 確認先
  - 元steeringのroadmapとhandoffにある三件の指摘。
  - 現行think_standards全fileの主軸・補助・見出し関係。
  - 分割直前revision `f8a2435^` のthink-through。直前の予備読取で構成意図節が現行evolution_policyの元と確認したため、因果と保持範囲を原文から照合する。
- 方法
  - evolution_policyは歴史的理由と現在も必要な判断条件を区別し、要約を足すのでなく、後続改善者が追加・統合・分割を判断できる全文を作る。
  - 場面名は行為・出来事の違いを消さず、同種の文型だけを揃える。file名やtrigger条件は変更しない。
  - 補助prefixは意味から選ぶ。主軸の手順・例・検証を、h2だからという理由で補助へ変えない。
- 終了条件
  - 置換するfile・見出し・本文がexactに決まり、保持する能力と参照元の更新要否を説明できる。
  - productionへ適用せず、設計成果物として確認可能な形へ保存する。

### 確認結果と具体本文への接続

[thinking-standards-design.md](../thinking-standard-evolution/thinking-standards-design.md) に三件の具体本文を保存した。

- 維持規律
  - 分割前の構成意図から、性質別分類では作業中に引けなかったこと、主軸を一つにする理由、失敗起点の知識を削除しない条件を確認した。
  - 全文置換案は、それぞれを追加・統合・分割時の判断へ接続する。「80%」を測定済みcoverageとする根拠はなく、設計上の目安と明示した。
- 場面名
  - 全11場面のh1を「〜とき」へ揃える対応を保存した。出来事と行為、修正したい段階と実行段階の違いは残す。
  - file名・本文triggerは変えず、そのfileへ向く表示labelだけを同期対象にした。
- 補助見出し
  - making_and_choosing_optionsの回答形式と、議論省略を防ぐ境界の二見出しを「補助:」へ変更する。
  - 主軸の手順、理由、例をh2だからという理由で補助へ移さない。building_a_prototype、receiving_feedback、core等の異なる構造を照合し、本文と見出し深度を維持する。

三件は元steeringの承認済みscopeの具体化であり、新しい採否質問は要らない。
この結果はproductionへの適用完了ではない。具体本文をdesignへ接続し、最終reviewへ渡す。

## 検証: 対応台帳・実行評価・designの到達点を一致させる

### 対象と確認方法

旧source598意味単位・構造5行、entry103単位、新しい実行保存53単位・六用途179原文単位、削除追加の逆引きは保存済みである。
三責務の12経路とsource由来B01〜B14も [migration-verification.md](../behavior-preservation/migration-verification.md) に保存した。
ここでは台帳を作り直さず、まだ実行していないものと、既に具体化したのにdesignへTBDとして残るものを分ける。

- 独立した実行評価
  - 設計文書や想定解を渡さず、prototypeを使う別agentへ三入力を与えた。対象は作業再開指示、認識合わせへの「ok」、未保存のchat合意である。
  - 一時directoryだけを書込み可能範囲とした。最初の試行は利用上限で停止したため、同じagentを未完地点から再開した。
  - この段落は開始後の経過記録であり、実施前にこの詳細を保存した履歴へ偽装しない。既存のsource由来scenarioに対する限定実行として結果を照合する。
- 静的な最終確認
  - validator置換片の構文、旧48guardの移管先、十部品・三部品、具体参照の存在を確認する。
  - これらはprototypeの検査であり、productionへ投影して既存validatorを実行したことにはしない。
- 文書の現状同期
  - designとprototype READMEに残る、ledger・caller・三件が未具体化という説明を実保存に合わせる。
  - document-reviewの作成時・更新時観点を当て、結論を実行済み証拠の範囲へ限定する。

次のactionは静的確認と現状同期である。追加の維持性レビューは主agentが独立に行うため、その指摘を予想した編集は行わない。

### 結果・保証できる範囲と返却

独立評価三入力の実物を読み、[migration-verification.md](../behavior-preservation/migration-verification.md) に結果と限界を保存した。

- Aは作業再開指示を合意へ変換しなかった。提示済みか不明として停止し、fileは変えていない。
- Bは認識合わせへのokから経験を推測せず、原文・不足を保存した。次の問いと背景だけで回答でき、内部logだけでも質問を具体化した理由を読める。
- Cは具体案・明示合意・反映結果を区別し、再合意せず事後回復した。変更前状態と実装動作は確認不能と残した。
  - ただし後続doc-enricher確認の記録2は、目的別formatやfallback理由を追えない「確認」形式になった。全用途で適用できたとは扱わず、主agentの独立レビューへ渡す。
  - Bの初回読解とCの事後照合は内部log作成より前であり、あらゆる判断前に入力が保存されたという証拠にはしない。

静的確認は旧48guardの文字列移管先、十部品・三部品、五文書の60link、validator片の構文まで完了した。
quick_validateはPyYAML不足で開始できず、依存を追加していない。
ledgerの四つのADAPT単位に旧contract索引を補い、entry ledgerの古い監査状態説明を現状へ同期した。

designとprototype READMEの未具体化という説明は、保存済みの完成本文・ledger・caller・思考標準三件への接続へ更新した。
document-reviewの作成時・更新時観点を当て、具体的な置換範囲と保持能力、実測・机上・未実施の境界を読み分けられることを確認した。
実行評価の不足を消す修正は行わず、追加依頼の二fileレビューへ渡す。今回の再開ではprototypeのSKILL.md・iteration.mdを変更していない。

ready判定は未到達である。新しい採否質問はないが、観測した運用不足の扱い、最終contract粒度の精査、完成設計のreview、productionへの反映待ちとvalidationが残る。
production未承認のまま反映待ちをzeroへ偽装せず、tasklist・roadmapも作らない。
次の主agent作業は指定二fileの独立レビューであり、完了済みの照合やcaseを最初から繰り返すことではない。
