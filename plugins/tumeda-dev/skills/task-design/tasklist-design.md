# Tasklist design

このfileは外部referenceではなく、長さのために`SKILL.md`から分割したtask-design本体の一部である。leaf判定後、`tasklist.md`を作る直前に先頭から末尾まで完全に読む。

## 入出力とowner

- 入力は同じ`working_dir`の合意済み`./design.md`と、`maintenance-plugin-context`がconsumer=`task-design`へ返した許可済みrepository contextである。
- 出力は同じdirectoryの`tasklist.md`だけであり、`roadmap.md`と併存させない。
- task-designがtasklistの構造、自己レビュー、ユーザーレビュー、designへの差し戻しを所有する。
- tasklist-executorが実行時のsingle writerとなる。task-designはtaskを実行しない。
- 親roadmapを探索・更新するtaskを含めない。callerはtasklist完了resultを受けて必要なorchestrationを行う。

## 作成手順

このskill directoryの`templates/tasklist.md`を元に`tasklist.md`を作り、**詳細taskまで**記載する。設計参照は常に`./design.md`とする。

tasklist作成途中では、解消対象を可視化するために`TBD`を使用できる。その場合は前提と解消方法を併記する。ただし、TBDを実装者へ残してはならない。`tasklist_ready`を返す前にすべて解消し、実装可能で今回の完了に必要なtaskだけを残す。

### 作業の外へ残るactionを含むphaseの原則

判定の問いは一つである。**このphaseで起きる変化は、この作業を破棄しても残るか。** 残るなら対象action、残らないなら対象外とする。DB migrationの適用はその代表例である。

| action | 作業破棄後に残るか | 判定 |
| --- | --- | --- |
| DB migrationの適用 | 残る | 対象 |
| deploy / release | 残る | 対象 |
| 外部serviceの設定変更 | 残る | 対象 |
| 本番データの移行・削除 | 残る | 対象 |
| 公開APIのcode変更（未release） | 残らない | 対象外 |
| 通常のcode変更・test追加 | 残らない | 対象外 |

`破壊的` `後方互換性がない` を判定に使わない。判定を分けているのは変化の性質ではなく、変化が及ぶ範囲である。カラム追加のmigrationは破壊的でも後方非互換でもないが、共有DBを持つrepositoryでは対象になる。逆にbranch内で完結する大規模な削除は破壊的だが対象外である。

判定は利用先の運用に依存する。開発DBが開発者ごとに分離されていれば、migrationの適用も対象外になりうる。pluginは問いだけを持ち、答えは利用先が出す。

- **MUST**: 対象actionを含むphaseは必ず単独phaseとして切り出す。
- **MUST**: そのphaseの最後に「ここで作業を停止し、対象actionの結果をユーザーに確認する。次phaseへは進まない」というtaskを置く。
- 理由: 対象actionは後続作業すべての前提になる。ユーザーが実際に適用されたことを確認する前に後続へ進むと、誤った前提上へ変更が積み上がる。加えて、作業破棄で戻せないため、適用の事実を独立に確認する必要がある。

#### 利用先固有の差し込み

対象actionを含むphaseがある時は、`maintenance-plugin-context`へconsumer=`task-design`として「作業の外へ残るactionの差し込み」宣言を要求する。宣言の内容をplugin側が推測して補完しない。

| 宣言の形 | tasklist初稿のreview時 | 停止・確認taskへ書くもの |
| --- | --- | --- |
| actionを定める | 問わない | 宣言された内容 |
| 問いを定める | review依頼へ併せて出す | ユーザーの回答 |
| 宣言なし、または`unavailable` | 問わない | 既定の停止・確認taskのみ |

常に問う形にしない。利用先が既に決めている判断を毎回ユーザーへ差し戻すことになり、「実装中に新しい判断が生まれない状態を作る」というtask-designの目的と逆を向く。毎回問いたい利用先は、宣言を「問いを定める」形で書く。

ユーザーの選択はreview後に停止・確認taskへ書き込む。実行時に`tasklist-executor`が問い直さない。設計段階で決められる判断を実行時まで持ち越さない。

### phase分割の方針

- **MUST**: incremental developmentを基本とし、各phaseを独立して完結・検証できる変更単位にする。phase完了時に、そのphaseの変更だけをDoDで検証できなければならない。
- 良い分割: `準備 → 一覧機能（完結） → 新規作成機能（完結） → 編集機能（完結） → 品質check → documentation review`。
- 悪い分割: `backend実装 → frontend実装 → test`。layerを横切る分割は一つの利用者操作を分断し、独立した検証単位にならないため原則禁止する。
- **MUST**: 各phaseのDoDを「ユーザーが一つの操作をした時、何を確認できるか」の形で書く。
  - DoDに作成・更新・削除・一覧取得など異なる操作が混在したらphaseを分割する。
  - 悪い例: 「`ProjectBoard`のCRUDができる」。複数操作をまとめたため、大きすぎるphaseを検知できない。
  - 良い例: 「`createProjectBoard` APIで保存できる」「一覧画面で作成したboardが表示される」。
  - DoDが抽象的なままreviewへ進むことを禁止する。具体化できない時はdesignへ戻る。
- 「まとめすぎ」のsignalは次の通り。いずれかがあれば分割を検討する。
  - DoDに複数の利用者操作が混在する。
  - DoDの確認項目が多すぎて、失敗時の原因を特定しにくい。
  - testとscreenshotの対象が複数contextにまたがる。
  - phaseの分割軸がbackend / frontendなどのlayerになっている。
- 各taskは対象file、変更内容、順序、依存、確認方法が分かる着手可能な粒度にする。
- 主要taskまたはphaseにDoDを置く。
- 「将来やるかもしれないtask」「検討中のtask」「別taskで後から行うtask」を入れない。

### test作成・変更

- **MUST**: 各phaseで変更した挙動に対応するtestを、そのphase内で作成または変更する。test実行とgreen確認だけでは足りない。
- 新しいprops・挙動を追加した場合は、その挙動をcoverするtestを追加する。
- 既存props・interfaceを変更した場合は、既存testを新interfaceへ書き直す。
- bug修正では、修正対象を再現する退行防止testを追加する。
- 「既存testが通ればよい」は不十分である。変更した挙動が今後も担保されるtestを必要とする。
- testを書けない、または書きにくい時は、技術的理由をtask commentへ記録する。

### 品質check

- **MUST**: repository contextが返したrepository全体のstatic analysis、lint、format check、test commandを含める。固定commandを推測しない。
- 特定fileだけでなくrepository全体への影響を確認する。新規codeが既存codeへ与える影響を早期に発見するためである。
- 新規fileに対するlintと、許可済み全体commandを使うrepository全体のlintを区別してtask化する。
- errorがあれば修正、再実行、error zero確認までをsubtaskにする。

### UI変更の追加要件

- **MUST**: UIの見た目に関わる変更があるphaseでは、そのphaseのDoDへscreenshot確認taskを含める。品質checkだけへまとめない。
- 品質check phaseでは、各phaseの確認を代替せず、全体の最終確認として改めてscreenshotを確認する。
- pluginの`visual-inspector` skillをchildとして使い、実際の見た目を目視確認する。
- `npx playwright`またはPlaywright toolの直接呼び出しは禁止する。
- 確認項目の例: color barの色、layout、今日highlight、responsive崩れ。
- UI変更の判定は広めに取る。次はすべて対象に含む。
  - 新規component作成
  - style変更（CSS / Tailwind class変更）
  - 表示内容・表示条件に影響するcomponent props変更
  - component refactoring
  - 既存componentへの差し替え・組み込み
- 「refactoringだからUI確認不要」と判断しない。内部構造の変更にも表示崩れriskがある。

### 実装前から確立しているdocument

- product仕様、architecture原則、test方針など、設計前に確立済みの知識を既存documentへ記録するtaskは最初の実装phaseへ置く。
- 判断質問は「このdocumentは実装が終わるまで書けないか」である。答えがNoなら実装後へ送らない。
- docs整備を最後へまとめると、設計前から確立済みの知識と実装で初めて得た知識を混同し、知識を揮発させるため禁止する。

### 実装後feedbackと公開action

- code readingまたは実装で得た永続的知識は、contextが熱いうちに`doc-enricher`へ提案modeで渡す。tasklist末尾へ単に先送りせず、提案と承認判断をその場で完了させる。書込みはユーザー承認後だけ行う。
- 実装、review、validation、ユーザー動作確認から生じたfeedbackは、直接受領したworkflow ownerがpluginの`facilitate-discussion`を`discussion_directory=<working_dir>`、`discussion_file_name=implementation_review.md`で適用するtaskにする。特定caller名へ固定しない。
- 各feedbackについて次の三問を順に扱う。
  1. このfeedback・ずれが起きた根本原因、すなわち共有されていなかった知識の前提は何か。
  2. その知識はcodeを読めば分かるか、読んでも分からない設計意図か、process不足か。
  3. どこに書けば次回この議論が不要になるか。変更は合意後だけ行う。
- feedbackがdesignまたはplan構造へ影響する場合は、同じ`working_dir`でtask-designを`create_working_dir=false`として再開する。review後に実装を自動再開しない。
- 自動testとscreenshotは機械的確認であり、ユーザーが実際に触る動作確認を代替しない。commit・push・PRより前にユーザー動作確認を必須にする。
- local Git運用条件がrepository contextから返された場合、またはユーザーが明示的にcommitを要求した場合だけcommit sectionを生成する。phase単位かつ意味単位で分け、部分承認なら承認範囲だけをcommitする。
- GitHub公開条件が返され、tasklistに実行可能なcommit taskが一件以上あり、current branchが公開可能なnon-default branchである場合だけpush・PR sectionを生成し、`tasklist-executor/scripts/github/create_or_get_pr.sh`を使う。
- push・PRの実行直前に、commit taskの結果としてlocal commitが実際に一件以上存在することを確認する。commit taskが取消完了になった等の理由でcommitが一件もなければ、push・PRを実行しない。
- plan合意時点で適用できないcommit・push・PR actionは、条件付きの未確定taskとして残さずsection自体を生成しない。
- 親roadmapのpath探索、status、完了日の更新taskは作らない。

### 完了・取消条件

- tasklistの`[ ]` / `[x]`を完了状態の正本とし、taskとsubtaskは実測完了の直後に更新させる。phase末や作業末にまとめて更新させない。
- 全taskを完了するまで作業を継続し、未完了taskを残して`completed`を返させない。
- taskが大きすぎる場合は、このfileへsubtaskを追記して一つずつ完了させる。
- 取消完了は、合意済みplanの変更により元taskが不要または別実装へ置換された場合だけ許す。実装方針、architecture、依存関係の変更、またはユーザーがplan変更としてscopeから除外した場合に限定し、具体的理由と合意を記録する。
- 時間不足、難しさ、host停止、tool制限、外部環境未準備を取消理由にしない。これらは未完了のまま適切な停止・再開状態を返す。

## 自己レビューgate

tasklistを書いたら、ユーザーへ提示する前にゼロベースで次を確認する。一つでも不合格なら必ずtasklistを修正し、「だいたい合っている」で通過させない。特に一つのphaseへ異なるendpointまたはcomponent変更が混在していないかを厳しく見る。

- [ ] **各phaseのDoDが一つの操作で検証できるか**: 作成・更新・削除・一覧取得などが混在していないか。
  - 外部serviceへの接続検証が複数serviceにまたがる場合はserviceごとに分ける。例: external storage APIとnotification APIは別phaseにする。
  - 検証commandが複数段階にまたがる場合は検証手段の境界で分ける。例: `docker compose build`と、起動後のbrowser確認は別phaseにする。
  - 同一endpointでも`case ... when`等の内部分岐ごとに修正対象moduleや修正patternが異なるなら、code経路をphase境界として検討する。
  - 判断基準は、分岐内で「修正対象」と「修正pattern（既存流用 / 新設 / 自明な追加）」が異なるかである。異なれば別phaseにする。
  - 失敗例: 同じendpointというだけで一phaseに集約し、DoDへtype別の複数分岐caseを並列に置く。
- [ ] **各phaseにDoDがあるか**: 完了条件が明確か。
- [ ] **各phaseにtest作成・変更があるか**: 実行だけでなく、変更挙動を担保するtestがあるか。
- [ ] **DoDの各項目に、それを担保するtaskがあるか**: DoDに書いた観測可能な結果が、testまたは確認taskのどれにも対応していない状態になっていないか。
  - DoDから順にたどり、各項目を担保するtaskを指させることを確認する。taskから逆にたどらない。taskから辿ると、存在するtaskはすべて何かを担保しているため必ず整合して見える。欠落は「DoD側に対応先が無い項目がある」という形でしか現れない。
  - 前項がtestの不在を見るのに対し、この項目は網羅の欠落を見る。片方が通っても他方は通らない。
  - やってしまいがちな失敗: testの一覧を先に作り、DoDと突き合わせずに揃ったとみなす。DoDに書いたのにtestが無い項目は、実装者に「書かなくてよい」と読まれる。
- [ ] **UI変更phaseにscreenshot確認があるか**: 品質checkだけへまとめていないか。
- [ ] **横切りになっていないか**: 実装phaseの後にtest phaseを置くようなlayer分割になっていないか。
- [ ] **commit・push・PRより前にユーザー動作確認があるか**: 自動test・screenshotをユーザー確認の代替にしていないか。
  - 失敗例: 機械的確認を「動作確認済み」と読み替え、tasklist-executorがそのままcommit・pushまで進む。
- [ ] **完了後actionがrepository contextへ従うか**: local commitとGitHub公開を別条件で判定し、plan時点では実行可能なcommit task、runtimeでは実際のcommitを確認し、適用不能なsectionを生成していないか。
- [ ] **対象actionを含むphaseで、差し込み宣言を要求したか**: `maintenance-plugin-context`へ要求し、返却の有無に応じて停止・確認taskを書いたか。
  - 宣言が返らなければ既定の停止・確認taskだけを置く。要求自体を省略しない。
  - やってしまいがちな失敗: 宣言が無い前提で進める。この契約は「宣言がなければ何もしない」ため、要求を忘れてもtasklistは正常に見え、差し込みが黙って落ちる。宣言が返らなかった場合と要求を忘れた場合が成果物の上で区別できない。
- [ ] **設計前に確立済みの知識を記録するdocumentがPhase 1にあるか**: 実装終了まで書けないものかを問い、Noなら早期配置する。
- [ ] **各deliverableのDoDが完成後の状態を具体的に示すか**: 「整備される」「作成する」というlistingだけになっていないか。
  - 抽象的なDoDがあれば`SKILL.md` Step 3へ戻り、完成後の状態を設計してからtasklistへ戻る。
  - 悪い例: 「`architecture.md`が整備される」。
  - 良い例: 「`architecture.md`に各layerの責務、判断基準、anti-patternがあり、実装者がcodeを読まずに設計判断できる」。
- [ ] **task順と依存が明示され、実装者へ設計判断を残していないか**。
- [ ] **今回実装可能なtaskだけか**: 将来候補、検討中、未解消TBDを含まないか。
- [ ] **取消条件がplan変更による不要・置換だけか**: 時間や環境を理由にしていないか。
- [ ] **roadmapを作成・探索・更新するtaskがないか**。
- [ ] **同じworking directoryに`roadmap.md`がないか**。

## ユーザーレビューとfeedback routing

tasklistのphaseと主要taskを短く示し、自然言語でreviewを依頼する。特定の承認keywordを強制しない。修正要求は次に分類する。

- task順、task粒度、検証手順、適用可能な実行時actionだけが変わる: `tasklist.md`を更新し、自己レビューから繰り返す。
- 完成後の姿、要件、設計根拠、公開API、module境界が変わる: tasklistを未合意のままにし、`SKILL.md` Step 3へ戻る。
- 二つ以上のstrictly narrowerな子design loopが必要と判明した: leaf / composite判定へ戻り、plan種別の合意後にtasklistを正本として残さずroadmapへ切り替える。

tasklistの自然言語での合意と、designへ戻る未解消feedbackがないことを確認したら`SKILL.md` Step 6へ返す。task-design自身はtasklistを実行せず、callerはtask-designのready resultを受け取った後も、自身に定められた実装前gateを飛ばしてはならない。
