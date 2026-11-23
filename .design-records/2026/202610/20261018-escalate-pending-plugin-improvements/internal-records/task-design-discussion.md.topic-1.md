# 内部検討記録: 論点1 — 四つの改善領域を独立して設計する骨格

**discussion:** [task-design-discussion.md](../task-design-discussion/task-design-discussion-1-5.md)

**論点:** 論点1

## 開始context

利用先で保留していた四提案をpluginへ転送した。
四領域は長大な議論の分割、自明な導出の扱い、保留と暫定運用指示、skill構造reviewである。
今回判断するのは、四領域を別々に詰める設計の骨格だけであり、plugin本体への具体的変更ではない。

<a id="iteration-0"></a>

## イテレーション0: 骨格への合意を保存する

<a id="iteration-0-record-1"></a>

### 事後記録: 保存した初稿とsessionの合意を対応付ける

#### 確認できる証拠と経過

前turnでhandoff-input.mdとdesign.mdを作成したtool結果がある。
design.mdの初稿は各領域をTBD付きで示し、sessionで四領域を別々に詰める骨格への採否を問うた。
その直後の利用者応答は「ok」である。
このturn開始時、working directoryには両fileがあるが、task-design-discussion.mdは存在しなかった。

#### 記録漏れと合意の限界

sessionで確認する前にproposalをdiscussionへ保存する契約を満たしていなかった。
そのため、今の記録を事前保存の証拠として扱わず、提示、背景、応答を事後記録として回復する。
四領域の骨格への合意は原文から確認できるが、下位のschema、owner、実装方法への合意は確認できない。

#### 反映と次の判断

discussionの論点1へ提示と応答を保存し、designの状態を骨格合意済みへ更新する。
plugin本体、manifest、既存案件のtasklistには変更を加えない。
次は分割領域について、適用対象と現行callerの事実を照合する。

<a id="iteration-0-record-2"></a>

### 判断: 全体設計から実行区分と残るreviewを確定する

#### 判断対象・必要条件・根拠

各領域の方針と詳細をdesignへ同期した後、親の未完childを再計算し、全体reviewへ進めるか判断する。
新たな価値判断を追加せず、task-designのStep 3〜5と現行designの検証条件へ照合する。
単なるfile数・補助scriptの存在だけでtasklist対象にしない。
一つの連続した反映・検証で安全に済むか、順序依存・中間checkpoint・独立した動作検証が必要かを確認する。
新たな子designを必要とする不確実性がなければ、工程数だけでroadmapへ分けない。
designの全文通読、残るTBDと古い未決記述、対象fileとcallerの対応、起点以外の具体caseを確認する。
既存pluginは未変更のまま、全体reviewへ提示する完成形と実行区分を整える。

#### 実行区分の照合結果

通常decisionとAI変更の全52件を機械抽出して親参照と状態を確認した。
親自身を除く未完childは0件である。AI変更の対象はdesignであり、plugin本体を未実装のまま反映済みと偽る状態にはしていない。

task-design内で一括反映する場合と、段階別の実装・独立検証をtasklistへ落とす場合を照合した。
今回の変更は読取許可、履歴保持、報告後の反映、作業限定指示の版・競合、完了gateへまたがる。
共通処理とcallerの片側だけでは成立しないうえ、作成者の文書照合と別に、隔離した記録による独立forward-testと修正後の再検証が必要である。
能力baseline確保、共通処理と接続の確認、独立した動作検証のcheckpointを設けるため、Step 5の段階実行・独立検証条件へ該当すると判断した。
scriptが実行言語であることやfile数は掲載根拠にしていない。
一つの合意済み完成形からtaskへ落とせ、新たな子design loopは要らないためleafとする。
tasklistは設計全体のreview応答後に作成し、roadmapは作らない。今回は実行区分の確定までで、本体の先行編集や公開は行わない。

<a id="iteration-0-record-3"></a>

### 検証: 全体reviewへ提示できる設計になったか

#### 主張・合格条件・方法

現行designを初見の実装担当として全文読み、全TBDと分類保留が解消し、変更理由・file分担・接続・停止と再開・受け入れ条件を辿れるか確認する。
起点の長大な設計議論以外に、短い実装review・旧h3・例示、明示保留なしと条件付き再開、同一作業再開と別作業、単一責務と独立復旧工程へ基準を当てる。
文書reviewでは旧版から削った要素を照合し、原文と履歴を保持したことも検査する。
記録全体の採番・親・索引・相対参照・過去blockと、配布pluginの不変を検査する。
新skillの実装・動作・配布の合格は主張せず、設計全体のreview待ちとtasklist未作成を明示する。

#### 全文照合と具体caseの結果

designを先頭から末尾まで通読し、各領域の目的、判断と状態のowner、内部file分担、callerへの入力と返却、失敗・停止・再開を照合した。
対象はdesign.mdのSHA-256が31db71fce89ccfbf57d70cbe89633bdadeefe3e1b45cc537a2c5b192b7867607である版。
未決だった詳細は論点48〜52の変更内容0から反映し、残る依存関係・対象file・受け入れcase・検証範囲も同じ仕様から整理した。
旧版から外したのは詳細未決・設計開始時点の分類保留という状態記述で、対応する保持条件を削っていない。
TBDと分類保留、詳細未決を示す古い記述は残っていない。「論点」は保存する仕様の用語と例の見出しであり、未決提案の残留とは区別して全文で確認した。

起点以外のcaseへも次のとおり当てた。これは机上の設計照合であり、未実装の新機能の実行結果ではない。

- 短い実装reviewと、旧h3の10件に例示の999が同居する記録は、一fileを保つ。最大番号や別記録との合算を閾値にしない。
- 明示保留のない改善は既存の即時経路へ進み、「終わったら聞く」は条件成立だけで引き渡さない。転送先を作って失敗した場合も受領確認まで未完である。
- 同じ未完作業の再開では同じ暫定指示を取得し、別作業には持ち込まない。取得不能はnoneにせず、実行版不明・競合は影響する動作だけを止める。
- 長い単一責務は一fileを認める。固有の状態と再開条件を持つ復旧工程は内部fileへ分け、CSVとPDFの値の切替だけは独立工程と扱わない。
- review後の未commitの内部指示変更と、共有文書の未使用の独立節だけの変更では、前者は全体再review、後者は無影響の根拠を確認して維持できる。hashだけで読取や合格を代行しない。

文書reviewでは初見の実装担当が具体的な操作・記録・停止条件を使えるかを確認した。
file一覧の共通referenceの誤記と見出し前の空行は修正後に再確認した。
表は操作と結果・caseと受け入れ条件の対応へ、散文は理由・例外へ使い、各templateには例を併記した。
利用先固有情報を公開仕様へ足しておらず、根拠・前後差・例の実績との区別を維持している。今回の設計同期に残る文書指摘はない。

#### 記録検査、未実施範囲、次の接続

読取専用検査は66文書・52件・11範囲本文・183相対参照で問題0件となり、未完childは0件だった。
更新した二つの範囲本文は現在の状態欄だけを検査内で旧状態へ戻すと開始時の内容hashと一致した。
論点48〜52と親の完了済み内部blockも開始時のprefixと一致し、過去の提案・応答・検討を変更していない。
索引と旧範囲本文の他のfileは変更せず、配布pluginの内容識別情報も一致した。
node scripts/verification/validate-plugin.mjsはplugin validation passedとなった。

本体未変更のため、新scriptの自己test、新skillの独立forward-test、構造review skillの実起動、配布の検証は未実施である。
この結果をplugin実装の合格やtask-design全体の完了には広げない。
次はtask-design Step 4の全体reviewとして、保存したdesignと四領域の要点をsessionへ提示する。
設計全体のreview応答後にStep 5のtasklist設計へ進む。個別の詳細を再承認する問いや、新しい統合確認論点は作らない。

<a id="iteration-0-record-4"></a>

### 診断: 完成設計として読めない構成を直す

#### 受領した指摘

> design.mdさぁ、これもう読めるもんじゃないだろ

設計全体へのreview応答であり、前回の完成形への合意ではない。
記録3の「残る文書指摘はない」という判定は不十分だった。過去の判定を消さず、この記録で再評価する。

#### 期待との差と確認する原因

初見の利用者は何が変わり、各仕組みがどうつながるかを先に掴む必要がある。
現物では決定ごとの長文に詳細仕様を継ぎ足し、同じ規則を方針・具体化・file一覧へ重複させている。
前回のreviewは条件の所在と整合へ偏り、入口だけで全体を理解できるか、各仕様を一箇所で引けるかを判定できていなかった。
全文を読んだことやTBD・link検査の成功は、この問題を解消した根拠にならない。

#### 修正範囲と確認方法

design.mdを全体像・責務・受け入れ条件の入口として書き直し、操作・記録・判定の詳細は同じ作業内で領域別に整理する。
重複を統合し、同じ仕様の詳細な正本を複数作らない。決定・例・安全境界・呼出し条件を旧版と照合する。
議論履歴とplugin本体は編集せず、tasklist作成へはまだ進まない。
新しい運用判断を混入させず、今回の変更は設計文書の構成・表現の修復として扱う。
初見の全体理解、必要な詳細の探索、旧版の固有条件の保持をそれぞれ確認してから提示する。

#### 診断結果と再構成

原因は、論点ごとの反映を文書全体の再編集なしに積み重ねたことだった。
旧版は一つの領域の中で方針と具体化を再説明し、低い見出しの下へ入口・API・記録例・呼出し側の説明を並べていた。
初見の全体理解と実装時の詳細探索を同じ読み順へ押し込んでいたため、fileを分けるだけでなく重複と説明順を直した。

design.mdは845行から170行へ書き直した。
四領域の目的、利用時に起きること、担当間の接続、変更範囲と検証を入口で説明し、操作の引数や内部見出しの詳細は領域別に譲った。
設計は一つのままで、子designや別の承認単位を増やしていない。
詳細込みの文字数も約34,600字から約23,700字へ減らし、同じ規則の方針と具体化の重複を統合した。

#### 旧版との対応と意味保持

旧版の全文を読み、一時snapshotを比較材料として保存してから再構成した。
前版の内容hashは記録3の31db71fce89ccfbf57d70cbe89633bdadeefe3e1b45cc537a2c5b192b7867607で識別できる。
削ったのは重複する説明と、同じ制約を繰り返す文章。固有の操作・状態・例・停止条件は次へ対応させた。

| 領域 | 詳細の所在 | 照合した固有条件 |
| --- | --- | --- |
| 議論の保存・読取 | [discussion-records.md](../design-details/discussion-records.md) | 実件数10超、短い記録の据置、原文と参照、存在確認と本文禁止、通常読取と全件引継ぎ、移行中断、全CLI操作と戻り値 |
| AI変更 | [derived-changes.md](../design-details/derived-changes.md) | 四分類、同じ番号・回、報告後の当該応答、部分反映、訂正と依存、架空の合意禁止、親の未完判定 |
| 保留 | [pending-escalations.md](../design-details/pending-escalations.md) | 明示指示、固定本文と追跡の分離、再開条件と回答待ち、受領確認、転送失敗と二重起動防止 |
| 暫定指示 | [temporary-overrides.md](../design-details/temporary-overrides.md) | 作業限定・一指示一file、factと分離、取得の契機、noneとunavailable、競合停止、実行元と版、更新時の毎回確認、部分・全面代替、終了記録 |
| 構造review | [skill-update-review.md](../design-details/skill-update-review.md) | 二段階起動、全体と依存の読取、一責務と独立工程、現在問題と将来候補、未確認との併記、保存担当、内容照合と再review |

各領域のtemplate例、予定する内部指示の見出し、script・template・callerのfile分担も保持した。
識別子の文字列差は、treeによるpath表現と共通基準からの相対path化を含むため、文字列の存在だけでは保持判定しなかった。
照合でtask-designのtemplateの所属が曖昧な箇所を見つけ、task-design/templates/tasklist.mdへ明示して修正した。

#### 文書reviewと確認できた範囲

入口だけを読んで四領域の役割・利用順・保留メモと暫定指示の違いを説明できるかを確認した。
実装担当の探索では、保存場所とCLIは議論記録、版更新と終了は暫定指示、材料不足と再判定は構造reviewへ一箇所で辿れることを確認した。
詳細5文書も全文再読し、旧版の具体caseと条件へ照合した。
document-reviewの内容の濃さ・記法・命名・指示対象・既存記述の修正・機密性を当て、追記で弁解を増やす構成へ戻っていないことを確認した。
同じagentの自己reviewであり、利用者から読めると評価された実績にはしない。

記録全体の構造・親子・索引・相対参照の読取専用検査は問題0件、plugin本体の内容識別情報も従前と一致した。
今回は文書の再構成だけなので、新機能の動作試験やplugin validatorの再実行を意味保存の根拠にはしていない。
discussion本文・過去の内部block・plugin本体は編集していない。設計全体への合意は未受領で、tasklistは未作成のままとする。

<a id="iteration-0-record-5"></a>

### 判断: 設計全体の合意を受けて実行計画へ落とす

#### 受領した応答と対象

> ok

書き直したdesign.mdと領域別の詳細を提示した後の応答であり、設計全体のreviewへの了承として扱う。
この応答だけで未提示のtasklist、実装済み状態、公開までの完了を認定しない。
過去の合意範囲と前回の読みにくさへの指摘・修復は保持する。

#### 判断対象・必要条件と確認方法

同じ作業directoryにroadmapがないことを確認し、task-design/tasklist-design.mdとtemplateを全文読んだ。
一つのtasklistへ落とせるleaf判定を維持し、設計の各対象と受け入れ条件からphaseとtaskを導く。
構造reviewを利用可能にしてから他のskill更新へ進み、各phaseを一つの利用操作・成果状態で検証できるように分ける。
各段階の対象file、依存、変更挙動の検証、能力baselineと二層ledger、呼出し境界、独立した動作検証を計画する。
実装後の機能・文書・構造の確認を混同せず、利用者の動作確認の前にcommit・push・PRへ進まない。

maintenance-plugin-contextとしてtask-designの必要factを確認した。
全体commandはnode scripts/verification/validate-plugin.mjs、既存handoff回帰scriptも実在し、全体linterとappはない。
repositoryのcontext pathは配布templateへのsymlinkなのでinstanceとして書き込まない。
公開条件の記載と実物を照合し、origin、mainへの直接commit・push禁止、現在の非default branch、repository側PR wrapperの存在を確認した。
計画へlocal commitとpush・PRを別々に置く。release・merge・cache更新・利用先への適用は計画しない。
共有状態へ残るpush・PRは独立した最終phaseとし、差し込み宣言は空のため既定の停止・確認だけを置く。

自己reviewはdesign側から全変更対象を辿る確認と、各DoD側から検証taskを辿る確認を別に行う。
未解消の設計判断、将来候補、空のlint・UI確認task、他作業の変更を混ぜない。
計画は保存・文書review後に利用者へ提示し、合意前はtasklist_readyも実装開始も返さない。

#### 作成した計画と自己review結果

[tasklist.md](../tasklist.md)を13phase・64taskで作成した。全taskは未着手である。
構造reviewを先に利用可能にするphase 1、議論の読取と分割を扱うphase 2–3、導出変更の報告と反映を扱うphase 4、改善提案の保留と再開を扱うphase 5–6、暫定指示の登録・取得・終了を扱うphase 7–9へ設計の変更対象を対応させた。
全体検証、利用者の動作確認、意味単位のcommit、push・PRをphase 10–13へ分けた。
前phaseの完了条件を満たしてから次へ進む依存を明示し、各phase内に対象変更とその挙動の検証を置いた。

designと詳細5文書から変更先を逆引きし、読取専用script・その自己test・既存引継ぎの回帰・template・caller・配布情報の対象が計画に含まれることを確認した。
暫定指示の入口は現存13skillと新設skillを列挙した。取得判断を各入口へ複製せず、管理担当へ渡す構造を維持した。
変更前baselineの対象には補助指示や共有参照だけでなく、変更するREADME・manifest・検証scriptも含めた。
各DoDから検証taskを辿り、通常系だけでなく、読取不足・途中失敗・競合・再開・部分代替・古いreview結果の扱いが判定できることを確認した。
能力移行の二層ledger、内容が変わった場合の再review、独立した動作確認、利用者確認前にcommitしない条件も計画へ含めた。

保存後のtasklistを全文読み直し、所属が曖昧だったtemplate・test・README・manifestのpathと、phase間の依存を明示して修正した。
document-reviewの観点で、設計本文を計画へ重複転記せず、各taskに対象・行うこと・検証方法があることを確認した。
読取専用の計画検査ではphaseの連番、各DoDと未完task、現存13skillの列挙、roadmapとの排他、完了済みや未解決placeholderの混入に問題はなかった。
最終tasklistのSHA-256は32ce56ee308b57c340ba9e13a661458dbf053230c652aa7add13d5fddf493af6。

これは計画と文書の自己reviewであり、新機能の動作試験を実行した結果ではない。
plugin本体、配布version、既存discussion本文は変更していない。commit・push・PRも行っていない。
計画全体の利用者reviewは未受領。tasklist_readyを返さず、実装を開始しない。

<a id="iteration-0-record-6"></a>

### 判断: 合意済みtasklistを実装担当へ渡す

#### 応答と完了判定

> ok

13phase・64taskのtasklistと「この計画で進めていい？」への応答として受領した。
計画全体の了承と、提示した範囲で実装へ進む明示指示である。実装後の動作確認や公開確認の代わりにはしない。
designとtasklistは同じworking directoryを指し、roadmapはない。設計判断やplan feedbackの未解消はなく、task-designはtasklist_readyとしてsteeringへ返す。

#### steeringの終了前gate

doc-enricherを提案modeで適用し、rootとskillsのREADME、今回の設計・plan・既存review記録を照合した。
各議論で扱った保存・責務・状態・再開・構造の前提は、既に合意済み変更の担当先と設計根拠へ対応している。
計画へ落とす過程で追加したpath・順序の明示は、この作業の実行条件であり新たな汎用原則にしない。
新たにREADMEや上位規範へ加える候補はない。既存議論の再発防止reviewを再提案せず、実装taskへ未処理の知識提案も移さない。
steering自身への追加変更も不要。合意済みの読取・暫定指示への接続だけを実装範囲とする。

#### dispatchの範囲と境界

tasklist-executorをchildとして起動し、Phase 1から順にPhase 10までの実装・検証を渡す。
tasklistとcheckboxのsingle writerはexecutorだけにする。検証担当は実装とtasklistを編集しない。
Phase 11の利用者確認で停止し、確認前にcommit・push・PRへ進まない。
この記録の時点ではplugin本体は未変更であり、実装結果を先取りしない。
