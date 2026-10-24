# 保留解除したplugin改善の引き渡し入力

これは利用先で記録された改善提案を、固有情報を除いて引き渡した入力である。
利用先で採用した運用と、pluginへ適用する設計の合意を区別する。
plugin側の完成後の姿、既存契約との差分、呼出元、適用順は、このworking directoryのtask-designで確定する。

## 長大な議論記録を分割して読む

### 提案

議論が10論点を超えたら、索引を残して5論点単位へ分割する。
索引と本文を同じdiscussion directoryへ置き、通常の追記先は最大の論点範囲から判別する。
現在の追記先という可変pointerは作らず、既存論点の再開は元の担当fileへ追記する。
5論点未満の進行中fileも予定上の末尾論点をfile名に用いる。
新旧の入口、論点採番、過去iteration、正本性、参照を保持する。
恒久契約が反映されるまでの分割運用への追加feedbackは、利用先へ暫定適用し、
一般化した恒久対応のstackへ蓄積してからpluginへ渡す。

### 必要性を示した具体例と根拠

一つの設計議論が38論点に達し、進行中論点へ到達するための読取量が過大になった。
要約による圧縮では提案、feedback、訂正、決定が失われるため、履歴を保持する物理分割を暫定適用した。
索引を本文directory外へ置き、現在の追記先まで同期する初版には、不要な同期負荷があった。
そのfeedbackから、同じdirectory内の索引と最大論点範囲を用いる運用へ変更した。

### 影響するplugin成果物

task-design、facilitate-discussion、steeringが持つ入口・保存先・読取・再開契約。
どこが分割を所有するかは、現行の二層記録とcaller境界を踏まえて設計する。

## 自明な導出を選ばせず、変更を追跡できるようにする

### 提案

利用者へdecisionを開くのは、次のいずれかが残る場合に限る。

- 既決事項と制約を適用しても、生きた代替案が複数残り、成果または後続が実質的に変わる
- 価値または優先順位が衝突し、既決事項から重みを導けない
- 意図、好み、許容範囲、公開判断など、利用者だけが持つ情報または権限が必要
- 解釈に疑義があり、推定すると利用者の意図から実質的に外れうる

既決事項に反する案、必要条件を満たさない案、明らかに情報量が足りない案は比較用の選択肢にしない。
生きた代替案なら二つから五つを小文字a〜eで示し、一問だけが残る場合は案数を満たす選択肢を作らない。
feedback自体で自明に閉じた場合も追加のok確認を作らない。
独立した導出変更の現在運用は次のとおりである。

収束対話は、利用者が答えを決めるdecisionと、既決事項からagentが導く変更を分ける。

利用者が答えを決めるdecisionは、この節の冒頭に挙げた四条件のいずれかが成立する場合だけ開く。
生きた代替案が複数なら小文字`a`から`e`、利用者だけが持つ一問ならその一問だけを提示する。

既決事項から一つに導けても、合意済み提案、契約、成果の意味または外形を具体化・変更するものは、
個別の`導出候補`論点として記録する。導出元、変更箇所、理由、変更前後、依存成果、
変更後の完全な提案を持たせる。導出元、変更する契約または所有者、変更理由、単独差し戻しの
影響範囲が異なり、一つだけを差し戻して他の大半を維持できる変更は、別の個別論点にする。

次の利用者decisionまたは完了reviewを提示する直前に、未報告の導出候補をsessionで要約する。
要約は論点番号、どこ、なぜ、何が変わったか、他論点との相互作用を持つ。
統合用のdiscussion論点またはfileは作らず、summaryへの`ok`も求めない。
利用者が訂正した場合は影響する個別論点を再開し、訂正がなければ対象成果へ同期する。

意味と外形を変えない機械的な転記、link修正、表記統一は、導出候補とsession報告を要しない。

### 必要性を示した具体例と根拠

後続成果物を作る前の検討で、既決の停止線に反する案、必要な情報を欠く案、条件を満たす推奨案を並べた。
利用者に実質的な選択がないのに確認だけを返させていた。
その是正後、導出を黙って確定反映すると、最初の合意からどこで何が変わったかが見えなくなった。
そこで独立変更を個別論点へ保存した。さらに統合確認論点を新設する案は不要とされ、
個別論点を正本として保ち、次の利用者decisionまたは完了reviewの前にsessionで横断報告する形へ落ち着いた。
独立して差し戻せる変更を一件へ丸めることも、横断報告へ毎回okを求めることも意図しない。

### 影響するplugin成果物

task-design、facilitate-discussion、思考標準の提案・選択・合意契約。
現行facilitate-discussionの原因owner routing、保存前gate、二層記録を失わずに適用する。

## 明示保留と利用先限定の暫定運用指示

### 必要性を示した具体例と根拠

利用者が本来の設計を先に進めるためplugin改善を後回しに指定したが、
現行escalate-plugin-skill-fixには保留状態がなく、提案発生時の即時転送だけが定義されている。
利用先の暫定動作も必要になったが、安定したrepository factだけを持つcontextへ期限付き指示を混ぜると、
contextが運用台帳へ太り、plugin更新後にも古い指示が残る。
提案そのもの、暫定指示、対象consumerへの選択的適用、導入後の解決確認を分ける必要がある。

### 提案

以下は利用先で合意された境界であり、pluginの最終schemaと実装方法は未確定である。

#### 暫定運用指示の正本とplugin-contextの関係

利用先repositoryだけで有効な暫定運用指示は、`.agents/tumeda-dev/temporary-overrides/`へ一指示一fileで置く。
`.agents/skills/tumeda-dev-plugin-context.md`は安定したrepository factだけを持ち、暫定指示を内包しない。

`maintenance-plugin-context`が暫定指示の書込み、対象consumerへの選択的返却、競合検出を所有する。
consumerはcontext instanceや暫定指示fileを直接合成せず、返された実効文脈だけを使う。

一指示は少なくとも、対象consumer、変更対象、暫定動作、根拠となる利用先論点、適用範囲、失効条件を持つ。
保留lifecycle、適用優先順位、引き渡し、cleanupは別decisionとして扱う。

#### plugin escalationの保留を成立させる権限と状態遷移

plugin修正提案を検出した場合、既定では現行どおり即時escalationする。
`保留`は、利用者が対象提案について明示した場合だけ成立する。利用者が承認済みのrepository方針や、
条件を指定した再開指示も利用者の明示として扱う。

agentは保留を提案できるが、自分の判断だけでは成立させない。保留成立時は改善提案を`保留中`にし、
元taskを継続できる。暫定運用が必要な場合だけ別正本を作り、不要なら保留記録だけを作る。

明示された再開条件を満たした時、または利用者が保留解除を指示した時にescalationを再開する。
提案の取下げも、利用者の明示または利用者が合意済みの判断条件を必要とする。

#### 暫定運用指示を対象consumerがいつ解決するか

`maintenance-plugin-context`自身を除くtumeda-dev pluginの各skillは、起動時に自分の完全なskill名を
consumer名として`maintenance-plugin-context`へ渡し、対象consumer向けの有効な暫定運用指示を解決する。
有効な指示がなければno-opとして通常契約を続ける。

同じsessionで暫定運用指示を新規作成、更新、失効した場合は、`maintenance-plugin-context`が
更新後の実効指示を現在実行中の対象consumerへ返す。対象consumerは以後の処理へ適用する。
新しいsession、session resume、skillの新規起動では起動時に再取得する。全user turnでは定期scanしない。

この機構自体を実装する前の旧skillは暫定運用指示fileを自動解決できない。実装前は利用者の
session指示を直接守り、pluginの実装、install、session resume後からこの解決機構を使う。

#### 保留中のplugin改善提案の正本と暫定運用指示の関係

保留中のplugin改善提案は、`.agents/tumeda-dev/pending-escalations/`へ一提案一fileで置く。
各recordは安定したIDと状態を持つ。
recordは提案、具体例、根拠、対象plugin成果物、利用先の参照元、保留を成立させた利用者指示、
再開条件、関連するtemporary override IDを持つ。

recordは凍結した引き渡しpacketであり、保留中の議論場所にはしない。追加証拠または別提案は
元recordを書き換えずに関連付ける。暫定運用指示はpending escalation IDを参照できるが、
暫定指示がなくてもpending escalation recordは成立する。

#### 暫定運用指示が上書きできる契約の範囲

暫定運用指示は、名指ししたplugin skill内の振る舞いまたは契約だけを局所的に置き換える。
同じskillの他の規則、repositoryで確認できる事実、system・developer・安全・権限上の制約は変えない。

利用者の直接指示が今回限りなら保存済みの指示を変えず、この実行だけへ適用する。
今後にも効かせる場合は`maintenance-plugin-context`を通じて保存済みの指示を更新、置換、または失効させる。
永続範囲が不明で、その差が動作を変える場合だけ利用者へ確認する。

上位の指示または確認済みのrepository事実と衝突する暫定運用指示は有効な上書きにしない。
`maintenance-plugin-context`は衝突をconsumerへ返し、consumerは影響する振る舞いを黙って選んで実行しない。

#### 同じ対象へ複数の暫定運用指示が重なった場合の解決

同じconsumerの同じ振る舞いまたは契約へ複数の暫定運用指示が該当する場合、暗黙の優先順位では選ばない。
新しい指示が置換対象のIDを明示した場合だけ、旧指示を`置換済み`にして新指示を有効化する。
明示なしに重なった場合は競合として止める。

別の対象を名指した指示は併存できる。同じ対象の指示は既存recordの更新、または置換元IDを明示した
新recordとして変更する。置換は旧指示の状態変更と新指示の有効化を一つの操作として行い、
旧指示を自動的に再有効化しない。

#### 暫定運用指示の対象識別と漏出防止

一つの暫定運用指示は一つのconsumerだけを対象とし、完全なconsumer名と、指示作成時に確認した
配布pluginのversion・file・見出しまたは条項の照合情報を組にして対象契約を同定する。
wildcard、skill group、暗黙の関連skill展開は認めない。複数consumerへ同じ変更が必要なら、
同じpending escalationへ紐づく別々のoverride recordを作る。

`maintenance-plugin-context`は完全なconsumer名が一致するactive recordだけを候補にし、
対象pluginのversionと条項が作成時の照合情報にも一致する場合だけ実効指示を返す。
plugin更新などで一致しなくなったrecordは`再検証要`とし、どのconsumerにも適用しない。

recordはoverride IDと状態、完全なconsumer名、対象plugin契約の照合情報、置換前後の契約、
適用条件と失効条件、根拠となる利用先discussionとpending escalation ID、
置換元または置換先のoverride IDを持つ。

#### plugin反映後の暫定運用指示の失効とcleanup

plugin側で改善がmergeまたはreleaseされても、利用先repositoryへ修正版pluginを導入し、
対象契約へ改善が含まれることを検証するまでは暫定運用指示を失効させない。
上流で改善済みになったpending escalationは`利用先反映待ち`とし、旧versionと照合できる間は
overrideをactiveのまま維持する。

新version導入後、`maintenance-plugin-context`が対象consumerの配布契約を検証する。
改善を確認できた場合は、pending escalationへ解決したplugin version、参照先、検証結果を追記して
`解決済み`にし、同じcleanup操作でoverride fileを削除する。削除後の経緯はpending escalationとGit履歴から追跡する。

改善を確認できなければoverrideを`再検証要`として適用せず、pending escalationも解決しない。
必要なら新versionを対象とするoverrideへ明示的に置き換える。利用者の撤回または合意済みの失効条件によって
overrideだけが終了した場合は直ちに適用対象から外し、pending escalationの継続または取下げは別に判定する。
`temporary-overrides/`は恒久archiveにせず、activeまたは再検証が必要なrecordだけを置く。

### 影響するplugin成果物

escalate-plugin-skill-fix、maintenance-plugin-context、各consumer skillの起動契約。
保留機構のない旧版へrecordだけ置いても動作が変わらないことを維持する。

## skillの構造変化をreviewする

### 提案

tumeda-dev pluginへ`skill-update-review`を追加する。
このskillは開発AIエージェントの`skill-creator`を代替せず、tumeda-devとしてskillの進化時に
差し込む構造review gateを担う。

`skill-creator`はskillの作成・更新・metadata・validator等を所有する。
`skill-update-review`は、変更前のskill directoryと変更目的、変更後の案またはdiffを読み、
一つの`SKILL.md`へ独立して進化する処理を累積していないか、同一skill内の指示fileと
別skillのどちらへ分けるべきかを判定する。

#### reviewする境界

次の三つから、変更後の構造を選ぶ。

1. **一つの`SKILL.md`に保つ**: 一つの目的、状態機械、変更理由、検証単位で閉じている
2. **同一skill内の心臓部指示fileへ分ける**: 一つのskillとして起動・返却するが、内部に独立して進化する処理、別状態機械、別検証単位がある
3. **別skillへ昇格する**: 切り出した処理が独立した起動条件、入力、状態、返却、検証を持つ、または複数skillから再利用される

最初から別skillとして公開契約を増やす必然性が弱い場合は、同じskill directoryの指示fileへ一旦置く。
そのfileが独立した役割を持てる大きさになった、独自の状態機械を持った、または他skillからも参照されるようになった時点で、
複数のcallerが使うprivate methodを独立componentへ昇格するように別skill化を再検討する。

#### 金属疲労の検知

行数だけを閾値にせず、次を検知する。

- 一つの変更理由で直すと、無関係な処理の理解と検証まで必要になる
- 一fileに複数の状態機械またはlifecycleがある
- 分岐が増え、`SKILL.md`がハンドリングでなく全caseの和集合になっている
- 各節が別々のfeedback、障害、進化理由で変更される
- 一つの内部処理だけを独立したcaseで検証できる
- 同じ処理が複数skillへ複製され始めている
- 抽出候補が独立した入力、出力、禁止事項、完了条件を持ち始めている

逆に、見出しが多い、行数が多い、tokenを減らしたい、見た目を揃えたいだけでは分けない。
細かいfileへ散らして全体flowを失う分割も不合格とする。

#### 合格する分割

分割後も`SKILL.md`は薄い目次にならず、目的、起動条件、責務境界、全体flow、
各指示fileを読む条件、最終的な返却契約を持つ。
切り出したfileはtemplateまたは参考資料と誤認されないよう、skill本体の心臓部処理であること、
いつ完全に読むか、何を所有するかを明示する。

review結果は次を返す。

- `維持 | 同一skill内で分割 | 別skillへ昇格`の判定と根拠
- 変更後のdirectory tree
- 旧`SKILL.md`から各fileへの責務移動表
- `SKILL.md`が各fileを読む時点と、読まない分岐
- 将来別skillへ昇格させる観測条件
- 分割前後で外部契約が変わっていないことを確かめるvalidation case

#### tumeda-dev workflowへの差し込み

- task-designでskillの完成後構造を決める場合、execution planをreadyにする前にreviewする
- tasklist-executor等がskill-creatorでskillを作成・更新した後、validator前の構造reviewとして再度確認する
- plugin skillの修正提案から起動した場合も、具体的な編集はskill-creatorへ委ね、review結果を入力として渡す

### 提案根拠

今回、複数skillの外部契約が閉じた後に利用者が指摘するまで、`SKILL.md`一fileへ心臓部処理を
集め続ける前提を見落とした。templateとreferenceへ内容を逃がす観点はあったが、
skill本体の実行指示も複数fileへ分けられる観点がreview gateになかった。

`利用先独自の対話skill`ではdecision routing、proposal、persistenceが別々に進化していたのに、
一fileへ追加され続けた。これはskill固有の失敗ではなく、skill更新全般で再発しうる。
tumeda-dev側にreview gateを置き、skill-creatorへ渡す完成後構造を先に検査する必要がある。

### 再開の権限と既存案件との境界

保留していたplugin改善の確認を受け、利用者が「だよね。続けて」と指示した。
この指示は上の四提案の転送とplugin側の設計再開を認めるもので、未提示のplugin実装への合意ではない。
既に別steeringへ渡したdesign引き継ぎ改善を重複して新規設計しない。
その案件にはmain取り込み記録と最終確認待ちのtaskがあるため、実装済みと全task完了を同一視しない。
