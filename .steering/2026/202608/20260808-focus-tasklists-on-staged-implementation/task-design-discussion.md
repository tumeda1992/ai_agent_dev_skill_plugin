# 議論記録

## 論点1: `design.md`初稿でexecution plan対象をどう表すか

**ステータス:** 決定

**種別:** 認識齟齬 / レビュー指摘

**起点となった原文:**
> task-designの中でtasklistを作るのを、ほぼコーディングだけにしぼりたい。
> 今のところsteeringするものについては基本的にタスクリストも作る前提にしていた。
> だから、例外としてタスクリストを作らない軽量モードや、ドキュメントについては、即時反映といった記述を入れていった。
> だけど、例外ルールが増えていって、かつ例外のほうの運用が半分ぐらいになってしまって、例外としての運用ではなくなってしまった。
> また、ドキュメント更新については、即時反映をしてほしいのに、タスクリスト行きになることがそこそこ多かった。
>
> だから、条件に合致した時のみタスクリストを作る、または載せると言う運用にしたい。
> 基本的にはコーディング。作業が単発で終わらず、段階を踏まざるを得ないようなタスクも、タスクリスト行き。あとは、ユーザが指定した時。
> だから、ドキュメント更新みたいに単発で終わるものはディスカッションで方針が固まったら即時反映するようにしたい。
> 軽量モードも、結局は調査やドキュメント更新やコードを使った思考に過ぎないから、軽量モードと言うラベリングが必要なく、ただただタスクリストを使わないステアリングとして移行できると思う。
>
> だから、design.mdの存在意義は変わってくる。
> 今までは、コーディング後の世界の記述、軽量モードの決定事項の羅列だったけど、
> ステアリング開始からステアリング終了時までの差分が乗るようになれば、整合性つくかな
>
> また、design.mdのテンプレートの存在も大きく変わってくると思う
> と言うのも、必ずコードが変更されるわけではないし、ドキュメントが変更されるわけでもない。
> 何かが変更されたときに使われるテンプレートの部品が、その時に応じて差し込まれる形になると思う。
> 画面を変えるから、画面に関しての完成後の姿。データを作ったり、データの見え方が変わるから、データに関しての完成後の姿。
> そういう風にテーマにするものによって、ファイルの形は変わってくると思う。
>
> ただ、思想は全く変わらなくて、コード変更前、タスクリスト作成前にタスクが全て終わった目線で、変化後の世界の様子を描ききり、
> タスクリスト遂行中に合意されていないことが勝手に決まって、実装後に齟齬が起きたりしないように考えきると言う姿勢は同じ。
> だから、段階を踏むといっても、不確実性削減のためのスパイクスクリプトの実行はもちろんタスクリストに入らず、design.mdの時点で実行される

**提起の背景:** 現行の`task-design`は、通常モードと軽量モードのどちらでもdesign合意後に`tasklist.md | roadmap.md`を必須作成し、`steering`も`tasklist_ready | roadmap_ready`しか受け取れない。この構造では、ドキュメントやskillの単発更新を即時反映する規則を追加しても、task-designの完了条件が最後にexecution plan作成へ押し戻す。例外が多いことではなく、planを作らず完了する正常系が存在しないことが問題である。

### 現在の合意対象

**参照する現在案:** イテレーション3の提案3

**今回確認すること:** execution plan対象へ自動的に載せる「コーディング」を、本番applicationとして利用者へ届けるruntime behaviorの実装変更と、その正しさを担保するtest変更・実行から成る通常のapplication codingへ限定するか。skill、docs、prompt、templateと、その内容を検証するrepository validator等の補助tool codeは、codeであることだけではexecution plan対象にしない。

### 議論の変遷

#### 事象の記述

- 現行`task-design`は、通常モードと軽量モードの双方でdesign合意後にleafまたはcompositeを判定し、`tasklist.md | roadmap.md`の一方を必ず作る。
- 現行`steering`は`tasklist_ready | roadmap_ready`だけを正常なready resultとして扱い、planなしで反映・検証まで終えた結果を受け取れない。
- ドキュメントやskillの即時反映規則は部分的に存在するが、全体の完了条件がexecution plan必須のままなので、同種の作業がtasklistへ戻りやすい。
- 軽量モードはdesignの書式を変えるが、execution plan必須という根本構造は通常モードと同じである。

#### 原因の追跡

- なぜ: `task-design`が「設計の完了」と「execution planの作成」を一つの必須完了条件にしているため、design合意後に残作業が一回で終わるかを判定できない。
- なぜ: `steering`と`task-design`の間にplanを伴わない完了resultがなく、tasklistまたはroadmapが実行・完了状態の唯一の表現になっている。
- なぜ: workflowの分類軸が「何を設計するか」ではなく「通常モードか軽量モードか」に寄り、設計後に残る実行の性質と、designへ載せる完成後の観点が混同されている。
- なぜ: design、調査、技術検証実装、直接反映、計画実行を一つの直列工程として固定し、design後の分岐を正式な正常系として設計していない。

#### 根本原因0 + 提案0

- **根本原因0**: execution planが必要かどうかを判定するgateと、planなしで反映・検証まで完了したことを表すresultがない。そのため、本来はdesignの内容や実行の性質から独立している「軽量」というラベルと例外規則が、必須planから逃がす役割まで負っている。
- **提案0（当時の未合意案）**:
  - 総論: designの深さは維持したまま、design合意後の残作業に対してexecution planの必要性を判定し、必要な場合だけ`tasklist.md | roadmap.md`を作る。不要な場合は同じtask-design実行内で合意内容を直接反映・検証し、正式に完了する。
  - 各論:
    - ルール: workflowを`designを完成・合意する → execution plan必要性を判定する → 直接反映またはplan設計へ分岐する`へ変更する。planが必要な場合に限り、leafなら`tasklist.md`、compositeなら`roadmap.md`を作る。
    - ルール: 次のいずれかに該当する場合だけexecution planを必須にする。
      1. ユーザーがtasklistまたはroadmapを明示的に要求した。
      2. design合意後に残る本番変更が、source code、test code、schema、dependency、build設定、runtime設定等の実行可能なsystem behaviorを変更するコーディングである。
      3. コーディング以外でも、順序依存する複数段階、中間checkpoint、外部調整、rollback境界、独立した検証単位が必要で、一回の反映と検証では安全に完了できない。
    - ルール: file数や調査量だけではplan必須にしない。design合意後に残る変更と検証を、一つの連続した反映単位として完了できるかで判定する。
    - ルール: 議論、既存code・documentの調査、不確実性を解消する技術検証実装はdesign phaseの手段であり、execution planへ載せない。技術検証実装が複数回必要でも、それだけを理由にplanを作らない。
    - ルール: plan不要時は、designへの自然言語合意を直接反映の承認として扱う。task-designが対象成果物へ反映し、必要なvalidationを実行して、`direct_complete`として`working_dir`、`design_path`、変更対象、validation結果を返す。別の実装開始確認は挟まない。
    - ルール: 直接反映中にコーディングまたは段階実行が必要と判明した場合は、その場で続行せずexecution plan必要性の判定へ戻る。
    - ルール: `steering`は`direct_complete | tasklist_ready | roadmap_ready`を扱う。`direct_complete`は完了結果として終了し、`tasklist_ready | roadmap_ready`だけを従来どおりgate後にdispatchする。
    - ルール: 軽量モードは廃止する。調査・discussion・技術検証実装は全taskで使えるdesign手段とし、designの形はモードではなく変化対象に応じて組み立てる。
    - 適用例: READMEの一節を、合意済み方針に従って一回で更新しMarkdown検査までできる場合は、tasklistを作らず直接反映して`direct_complete`を返す。
    - 適用例: 一行のproduction code変更は作業量が小さくてもコーディングなので、steering対象である限りtasklistを作る。
    - 適用例: codeを書かないdata移行でも、backup、移行、結果確認という停止点を順に踏む必要があればtasklistを作る。
    - 適用例: 外部APIの実レスポンスを確かめるspike scriptは、将来のproduction code変更にtasklistが必要でもdesign phaseで先に実行し、得た事実をdesignへ戻す。

##### 検証

- **観点**: 現在頻発しているドキュメント・skill更新を、例外規則なしで即時反映へ流せるか。
- **結果**: plan不要の正式resultとownerを設けるため、execution plan必須の完了条件に押し戻されない。
- **観点**: 「単発」という曖昧語によって大規模な非code変更が無計画に実行されないか。
- **結果**: file数ではなく、順序依存、中間checkpoint、外部調整、rollback境界、独立検証単位の有無で判定するため、段階実行が必要な非code作業はplanへ残る。
- **弱点**: `source code`と同様に実行時挙動を変える設定やpromptの境界はrepositoryごとに揺れる。提案0ではschema、dependency、build設定、runtime設定をコーディング側へ含める一方、skillやpromptは単発反映可能なcontentとして扱う。個別taskで段階性が生じた場合は第3条件でplanへ戻す。
- **弱点**: `direct_complete`をtask-designの責務に入れるため、「設計だけをするskill」という現在の名前と説明は狭くなる。ただし新しいownerを増やすと、単発変更のためだけにhandoffと開始確認が復活する。task-designを「実装前判断のowner」から「steering内のdesignとplan選択、およびplan不要変更の完了owner」へ明示的に広げる方が目的に合う。

#### イテレーション1

**受領したfeedback:**
> 「design合意後の残作業に対してexecution planの必要性を判定し、必要な場合だけ」いや、違うでしょ。それじゃ今と同じなのよ。というか、tasklist作成直前の最終判断ゲートはそうかもしれないけど、その前のdesign, discussionの時点でtasklistに載せずに即時反映とかしちゃってんのよ。最後のゲートの話じゃない。だから、design.md時点でtasklistで対応するもののリスティングはしなきゃかもね

##### 検証

- **観点**: 提案0は、ドキュメント等をdecision確定直後に反映できるか。
- **結果**: できない。提案0はdesign全体の合意まで直接反映を待たせ、最後にsteering全体を二分している。これでは即時反映がdesign flowの正常動作にならず、現在と同じく最後のplan判定に支配される。
- **観点**: 最後のgateだけで、tasklistへ載せるものを正しく復元できるか。
- **結果**: 安定しない。各decisionで「これは即時反映済み」「これは後続実行が必要」という文脈を保存しなければ、最後に全decisionを再解釈することになり、直接反映済みの変更をtasklistへ重複掲載する、または必要な実装を落とす危険がある。

##### 論点routingの判断

- **discussion scopeへ属する理由**: execution planを条件付き成果物へ変えるには、要否をいつ、何の単位で判定するかがworkflow全体を規定する。
- **同一decision scopeとしてiterationを継続する理由**: planの作成条件自体ではなく判定時点と判定単位への訂正であり、論点1の結論を直接修正するfeedbackである。

##### 修正先の判断

- **診断levelへの遡及**: 提案0は根本原因を「design完了後のplan不要resultの欠如」と捉えたが、より上位の原因は、個々のdesign decisionから生じる変更の扱いをdecision確定時に分類・保存する仕組みがないことである。最終resultの追加だけでは再発を防げないため、workflowの単位をsteering全体から一decisionへ遡って修正する。

##### 根本原因1 + 提案1

- **根本原因1**: tasklist掲載可否を一decisionごとに決めて保持する正本がなく、design・discussion中の即時反映と、後続execution planへ残す変更が同じ未分化な「変更点」として扱われている。そのため、即時反映規則があっても最後のtasklist作成時に再び拾われ、軽量モード等の例外で逃がす必要が生じる。
- **変更点**: design全体の合意後に一度だけplan要否を判定する提案を撤回する。判定単位を一つのdesign decisionから生じる各変更へ、判定時点をそのdecisionの確定直後へ移す。最後のgateは判定ではなく集計結果の検証に限定する。
- **提案1（現時点）**:
  - 総論: design・discussion中に一つのdecisionが確定するたび、そのdecisionから生じる変更を即時反映またはexecution plan対象へ分類する。即時反映は次の論点へ進む前に適用・検証し、execution plan対象は`design.md`へ継続的に列挙する。
  - 各論:
    - ルール: tasklist掲載可否の判定は、tasklist作成直前ではなく、一つのdiscussion decisionまたは調査・技術検証実装による事実がdesignへ反映され、具体的な変更が確定した時点で行う。
    - ルール: 変更が単発のdocument、skill、prompt等で、確定済みdecisionだけから内容を一意に書けて、その場で反映・検証まで完了できる場合は`即時反映`とする。次の設計論点へ進む前に対象fileへ反映し、validation結果を`design.md`へ書き戻す。
    - ルール: 次のいずれかに該当する変更は`execution plan対象`とし、その場では実装しない。
      1. production code、test code、schema、dependency、build設定、runtime設定等を変更するコーディング。
      2. コーディング以外でも、順序依存する複数段階、中間checkpoint、外部調整、rollback境界、独立した検証単位が必要な作業。
      3. ユーザーがtasklistまたはroadmapへの掲載を指定した作業。
    - ルール: 未解消の上位decisionによって内容または要否が変わる変更は、即時反映にもexecution plan対象にも確定せず、design上のTBDとして残す。上位decisionが確定した時点で分類する。
    - ルール: `design.md`は少なくとも、steering中に直接反映した変更とvalidation結果、およびexecution planで対応する変更の一覧を区別して保持する。execution plan対象には対象、完成後の状態、掲載理由、依存するdesign sectionを記載する。
    - ルール: `design.md`のexecution plan対象一覧はtasklistまたはroadmapの入力であり、tasklist作成時に新しい変更を発見・追加する場所にしない。planは一覧にある変更を実行順序、検証、checkpointへ具体化する。
    - ルール: tasklistまたはroadmapを作る最後のgateは、`design.md`のexecution plan対象一覧が空か、分類漏れ・即時反映済み変更の重複がないかを検証する。ここで変更の扱いを初めて判断しない。
    - ルール: execution plan対象一覧が空ならplanを作らずsteeringを完了する。一覧が一つ以上あれば、対象全体が一つの実行loopで完了する場合は`tasklist.md`、独立した子design loopが必要な場合は`roadmap.md`を作る。
    - ルール: 議論、調査、不確実性を解消する技術検証実装は変更の実行ではなくdesign手段なので、execution plan対象一覧へ載せない。spikeで得た事実からproduction変更が確定した場合は、そのproduction変更だけを一覧へ載せる。
    - ルール: 軽量モードを廃止する。即時反映とexecution plan対象の混在はすべてのsteeringで可能とし、成果物種別によるmode切替を行わない。
    - 適用例: API仕様のdiscussionでREADMEへ記載する原則とproduction code変更が同時に確定した場合、READMEはその場で更新・検証し、production code変更だけを`design.md`のexecution plan対象一覧へ載せる。
    - 適用例: skill改善のdecisionが確定し、複数の`SKILL.md`とtemplateを一つの整合した変更として直ちに更新・検証できる場合、file数が複数でも即時反映する。別環境への段階的migrationや停止点が必要なら、その作業だけをexecution plan対象へ載せる。
    - 適用例: 外部APIの挙動を確かめるspike scriptはdesign中に実行する。結果としてAPI clientのproduction code変更が必要と確定したら、spikeの再実行ではなくproduction code変更をexecution plan対象へ載せる。

##### 検証

- **観点**: document更新をtasklist作成まで待たず、decision確定時に反映できるか。
- **結果**: 即時反映がdesign loop内の正式な遷移になるため、全design合意やplan作成を待たない。
- **観点**: 即時反映済み変更がtasklistへ再掲載されないか。
- **結果**: `design.md`で直接反映済み変更とexecution plan対象を分離し、最後のgateで重複を検査する。
- **観点**: designが未確定なのに早すぎる反映が起きないか。
- **結果**: 未解消の上位decisionに依存する変更はTBDのまま分類しない。局所decisionが確定し、他の未決事項から独立している変更だけを即時反映する。
- **弱点**: `design.md`へ完成後の世界と変更分類・validation結果を同居させるため、単純な固定templateでは過密になる。次の論点で、共通coreと変化対象別component、および直接反映済み／execution plan対象の配置を設計する必要がある。

#### イテレーション2

**受領したfeedback:**
> 基本的にはokそう。「execution plan対象には対象、完成後の状態、掲載理由、依存するdesign sectionを記載する。」の記載について、今までと同じようにtask-design全体の完成後の姿があるだけで、execution plan対象1つ1つに対して完成後の姿があるわけじゃないから。あと、doc-enricherの起動も、steeringに残すけど、discussoinの即時反映時に毎回doc-enricherの起動をしてほしいかも。なんだったら即時反映の原因になったdiscussionの議論が、docsやskillの不備による認識の齟齬であるなら、具体ケースの修正方針というよりも、具体ケースをdocsやskillの不備修正の具体例として使って、それらの修正について方針合意ができたあとdocsやskillについて即時修正して、その反映例の1つとして具体ケースを扱う、みたいな順番でもいいかも。元々think-throughでファインプレー判断を作ったのもそれが背景だった。まぁこれらは論点1のトピックとは別かも。

##### 検証

- **観点**: execution plan対象ごとに完成後の状態を持たせると、design全体の完成後の姿との関係は明確になるか。
- **結果**: ならない。task-designが合意する完成後の世界はscope全体として一つであり、execution plan対象はその世界を実現する変更の索引である。対象ごとに完成後の状態を再記述すると、部分設計が複数生まれ、全体設計との重複または矛盾を招く。
- **観点**: tasklist作成時にexecution plan対象一覧だけを読めば実装設計を復元できる必要があるか。
- **結果**: ない。tasklistは`design.md`全体を設計の正本として参照する。一覧は「どの変更をplanへ具体化するか」を漏れなく限定するための索引であり、設計内容の正本ではない。

##### 論点routingの判断

- **discussion scopeへ属する理由**: execution plan対象一覧に何を記載するかは、論点1のplan作成条件とdesignからtasklistへの受渡しを直接規定する。
- **同一decision scopeとしてiterationを継続する理由**: 「完成後の状態」を一覧から除くfeedbackは提案1の同じruleを修正する。
- **別decisionとして後続へ送る内容**: discussion起因の即時反映ごとに`doc-enricher`を起動すること、および認識齟齬の原因がdocs・skillの不備なら具体ケースより先に汎用的な不備修正を合意・即時反映することは、plan掲載条件ではなく即時反映時の原因routingと知識永続化の順序を決める別decisionである。論点1へ混ぜず、論点1確定後に扱う。

##### 修正先の判断

- **提案levelへの修正**: 根本原因1と、decision確定時に即時反映またはexecution plan対象へ分類する全体構造は維持する。execution plan対象一覧を部分設計として扱った記載項目だけを修正する。

##### 根本原因2 + 提案2

- **根本原因2**: 提案1はexecution plan対象一覧を、tasklistへ渡す索引ではなく、対象ごとの小さな設計書として過剰に定義した。そのため、task-design全体で一つだけ存在する完成後の姿を各対象へ分裂させようとしていた。
- **変更点**: execution plan対象一覧から「完成後の状態」を削除する。一覧はtasklistへ載せる変更の範囲と根拠を限定し、完成後の姿は`design.md`のtheme別sectionだけを正本とする。
- **提案2（現時点）**:
  - 総論: 提案1のdecision単位の即時反映／execution plan対象分類を維持し、execution plan対象一覧は完成後の姿を再記述しない参照索引として扱う。
  - 各論:
    - ルール: tasklist掲載可否の判定は、tasklist作成直前ではなく、一つのdiscussion decisionまたは調査・技術検証実装による事実がdesignへ反映され、具体的な変更が確定した時点で行う。
    - ルール: 変更が単発のdocument、skill、prompt等で、確定済みdecisionだけから内容を一意に書けて、その場で反映・検証まで完了できる場合は`即時反映`とする。次の設計論点へ進む前に対象fileへ反映し、validation結果を`design.md`へ書き戻す。
    - ルール: 次のいずれかに該当する変更は`execution plan対象`とし、その場では実装しない。
      1. production code、test code、schema、dependency、build設定、runtime設定等を変更するコーディング。
      2. コーディング以外でも、順序依存する複数段階、中間checkpoint、外部調整、rollback境界、独立した検証単位が必要な作業。
      3. ユーザーがtasklistまたはroadmapへの掲載を指定した作業。
    - ルール: 未解消の上位decisionによって内容または要否が変わる変更は、即時反映にもexecution plan対象にも確定せず、design上のTBDとして残す。上位decisionが確定した時点で分類する。
    - ルール: `design.md`は、steering中に直接反映した変更とvalidation結果、およびexecution planで対応する変更の一覧を区別して保持する。
    - ルール: execution plan対象一覧の各項目には`対象`、`掲載理由`、`参照するdesign section`だけを記載する。完成後の姿、要件、設計根拠、validation方針を対象ごとに複製しない。
    - ルール: task-design全体の完成後の姿は`design.md`のtheme別sectionを唯一の正本とする。tasklistはexecution plan対象一覧だけでなく`design.md`全体を読み、一覧で限定された変更を実行順序、検証、checkpointへ具体化する。
    - ルール: `design.md`のexecution plan対象一覧はtasklistまたはroadmapの入力であり、tasklist作成時に新しい変更を発見・追加する場所にしない。
    - ルール: tasklistまたはroadmapを作る最後のgateは、execution plan対象一覧が空か、分類漏れ、即時反映済み変更との重複、参照先の欠落がないかを検証する。ここで変更の扱いを初めて判断しない。
    - ルール: execution plan対象一覧が空ならplanを作らずsteeringを完了する。一覧が一つ以上あれば、対象全体が一つの実行loopで完了する場合は`tasklist.md`、独立した子design loopが必要な場合は`roadmap.md`を作る。
    - ルール: 議論、調査、不確実性を解消する技術検証実装は変更の実行ではなくdesign手段なので、execution plan対象一覧へ載せない。spikeで得た事実からproduction変更が確定した場合は、そのproduction変更だけを一覧へ載せる。
    - ルール: 軽量モードを廃止する。即時反映とexecution plan対象の混在はすべてのsteeringで可能とし、成果物種別によるmode切替を行わない。
    - 適用例: API仕様のdiscussionでREADMEへ記載する原則とproduction code変更が同時に確定した場合、READMEはその場で更新・検証する。execution plan対象一覧にはproduction code変更、コーディングであるため掲載する旨、APIの完成後の操作フローを記載したsectionへの参照だけを載せる。
    - 適用例: 一つの完成後の画面を実現するためにcomponentとAPIを変更する場合、component用とAPI用の完成後の姿を一覧へ複製しない。画面全体の完成後の姿をtheme別sectionへ記載し、一覧は実装対象と参照先を示す。

##### 検証

- **観点**: design全体の完成後の姿が一つの正本として保たれるか。
- **結果**: execution plan対象一覧は参照だけを持つため、部分的な完成後の姿との二重管理が生じない。
- **観点**: tasklistへ載せる対象を限定しつつ、実装者が設計根拠を追えるか。
- **結果**: 対象ごとの`参照するdesign section`から全体設計の該当箇所へ到達でき、tasklist自体も`design.md`全体を正本として読む。
- **弱点**: `design.md`のtheme別section構造と、直接反映済み変更・execution plan対象一覧の配置は未決である。論点1確定後にtemplate構造として設計する。

**以前の決定:** `design.md`初稿はtask-design全体で一つの完成後の姿を正本として持つ。execution plan対象一覧は`対象`、`掲載理由`、`参照するdesign section`だけを持つ参照索引とし、個々の対象に完成後の姿を複製しない。tasklistまたはroadmapは一覧だけでなく`design.md`全体を読む。反映時期と依存関係は論点3へ分離する。

**以前のネクストアクション:** この初稿方針を`design.md`とtemplate prototypeへ反映する。即時反映の可否は論点3の決定後に整合させる。

#### イテレーション3: execution planへ自動掲載するcodeを本番application codingへ限定する

**受領したfeedback:**
> execution plan の対象にするコード修正は本番アプリケーションコード修正で、テストも通ってるアレね。skillについてのvalidatorについては話違う

論点10でrepository validatorが`.mjs`の実行codeであることだけを根拠にexecution plan対象と提案したところ、ユーザーから、想定しているcoding routeは本番application codeを変更しtestまで通す通常の実装であり、skill ecosystemのvalidator codeは同じ扱いではないと訂正された。

##### 検証

- **観点:** 現在の「source code、test code、schema、dependency、build設定、runtime設定等、実行可能なsystem behaviorを変えるコーディング」は、ユーザーが意図する本番application codingへ限定できているか。
- **結果:** できていない。fileが実行可能か、JavaScript等で書かれているかを基準にすると、skill／docs／templateの補助validator、generator、lint scriptまで自動的にexecution planへ送られる。
- **観点:** skill ecosystemのvalidatorをplanなしで変更すると、code変更の安全性を軽視することになるか。
- **結果:** ならない。合意済み内容から一意に変更でき、他の未決事項へ依存せず、一つの連続した変更とvalidationで完了できる場合はtask-design内で反映し、実行結果を付録へ残す。段階性があれば成果物種別にかかわらず別条件でplanへ送る。
- **観点:** `schema`、`dependency`、`build設定`、`runtime設定`はすべてplan対象から外れるか。
- **結果:** 一律には外れない。本番applicationのruntime behaviorまたは配布物を変える実装の一部ならapplication coding routeに含む。skill／docs ecosystemの補助tool設定であることだけでは含めない。
- **弱点:** `application code`をpathや拡張子で判定すると、library、CLI、batch、infrastructure component等を誤って除外する。対象repositoryで利用者へ届ける実行時のsystem behaviorを作る本番成果物か、その成果物を検証・生成する補助toolかという役割で判定する必要がある。

##### 論点routingの判断

- **discussion scopeへ属する理由:** coding routeの境界が変わると、execution plan対象一覧、planless route、task-design内反映owner、論点10のvalidator routingが変わるため、今回のtask-design全体を直接規定する。
- **論点10とは別decisionである理由:** repository validator一件の分類を変えるだけでなく、すべてのtaskで「codeならplan」と判定する基準そのものを修正する。ownerはexecution plan掲載条件を定めた論点1であり、論点10はこの上位decisionの適用例として再評価する。

##### 修正先の判断

- **診断levelへの遡及:** 「コーディング」をfile形式と実行可能性で定義したことが誤りである。作業量や言語ではなく、taskの本番成果物として利用者へ届けるruntime behaviorの実装か、skill／docs等のcontentを作成・検証する補助toolかへ分類軸を戻す。

##### 根本原因3 + 提案3

- **根本原因3:** ユーザーが通常のapplication実装とtest完了を指していた「コーディング」を、repository内の実行可能code一般へ拡張した。そのため、planを減らす目的で設けた条件が、skill validatorのような単発の補助tool変更までtasklistへ押し戻した。
- **変更点:** decision単位routing、段階実行、ユーザー指定、一覧の三field、一つの完成後の姿は維持する。自動掲載条件の第一項だけを、実行可能code一般から本番application codingへ限定する。
- **提案3（現時点）**:
  - 総論: execution planへ自動掲載するcoding routeは、対象repositoryで本番applicationとして利用者へ届けるruntime behaviorの実装変更と、その正しさをtestで確認する通常のapplication codingに限定する。補助toolがcodeであること自体は掲載理由にしない。
  - 各論:
    - ルール: application、service、library、CLI、batch、infrastructure component等、taskの本番成果物として利用者へ届けるruntime behaviorを変更するsource codeを第一条件の対象にする。名称がapplicationでなくても、同じ役割なら含める。
    - ルール: 本番成果物のbehavior変更に伴うtest code、schema、dependency、build設定、runtime設定は、そのapplication codingとtest完了を成立させる一つの実装scopeとしてexecution plan対象に含める。これらのfile種別だけを見て単独で自動掲載しない。
    - ルール: skill、prompt、documentation、template、規範等のcontentと、それらを検査・生成・整形するrepository validator、generator、formatter等の補助tool codeは、codeであることだけでは第一条件に該当しない。合意済み内容から一意に変更でき、他の未決事項へ依存せず、一つの連続した反映・validationで完了できるならtask-design内で扱う。
    - ルール: 補助tool自体が今回利用者へ届ける本番productである場合は、pathや`validator`という名前を理由に除外せず、第一条件へ戻す。判定対象はfile種別ではなく今回のtaskでの成果物の役割である。
    - ルール: 本番application codingでなくても、順序依存する複数段階、中間checkpoint、外部調整、rollback境界、独立した検証単位が必要なら第二条件でexecution plan対象にする。ユーザー指定は第三条件として維持する。
    - ルール: testは「test codeなら自動掲載」という独立条件ではなく、本番application codingを完了したと判定するacceptanceにする。testだけの変更、補助toolのself-test、skill validator実行は、第一条件ではなく段階性とユーザー指定から判定する。
    - ルール: 調査や不確実性削減のspike codeは本番成果物ではなく、従来どおりexecution plan対象へ載せない。
    - 適用例: applicationのAPI behaviorを変更し、対応testを更新してgreenにする作業はexecution plan対象である。`design.md`の一覧にはAPI実装変更を対象として載せ、testは完成条件としてplanへ具体化する。
    - 適用例: task-designのMarkdown contractへ追随させる`scripts/verification/validate-plugin.mjs`は、skill ecosystemの補助validatorであり、codeであることだけではexecution plan対象にしない。依存がなく一括変更・実行検証できるならtask-design内で反映する。
    - 適用例: codeを書かないdata migrationでも、backup、migration、結果確認という停止点が必要なら第二条件でexecution plan対象にする。

##### 検証

- **観点:** validatorだけを都合よく例外化したruleにならないか。
- **結果:** 本番成果物と補助toolという役割の違いで一般化している。同じvalidatorでも、validator自体をproductとして開発するtaskならapplication coding、skill変更を検査する付随validatorならtask-design内反映になる。
- **観点:** 本番application codeなら小さな一行変更でもplan対象になるか。
- **結果:** なる。作業量ではなく本番runtime behaviorへ手を入れ、testまで含む通常のimplementation loopであることを第一条件にする。
- **観点:** 補助tool codeをtask-design内で即時変更すると、未決事項に左右されるpatchworkが再発しないか。
- **結果:** 論点3の依存関係gateは維持する。他の未決事項で内容が変わる場合は反映待ちに置き、独立・一意・連続validation可能な場合だけtask-design内で反映する。
- **弱点:** applicationと補助toolの境界が曖昧なrepositoryはある。`今回のtaskで利用者へ届ける本番成果物か`、`その成果物のruntime behaviorを変えるか`、`testを含むimplementation loopが完了条件か`の三問で判定し、判定不能なら分類保留へ置く。

**決定:** 2026-08-10、ユーザーの`ok`を受け、提案3を採用する。execution planへ自動掲載するcoding routeは、対象repositoryで本番成果物として利用者へ届けるruntime behaviorの実装変更と、その正しさをtestで確認する通常のapplication codingへ限定する。skill、prompt、documentation、template等のcontentとその補助tool codeは、codeであることだけでは掲載しない。段階実行とユーザー指定の条件、および一覧形式に関する以前の決定は維持する。

**反映結果:** `design.md`、production `task-design/SKILL.md`、production／prototype `templates/design.md`、function migration ledgerへ一括反映した。productionとprototypeのtemplate全体はbyte一致し、掲載理由は本番application coding／段階実行／ユーザー指定へ揃った。task-design本体では本番成果物／補助toolの役割判定、testをapplication codingのacceptanceとして扱うこと、補助tool codeをplanless routeからfile種別だけで除外しないことを確認した。Markdown差分checkに成功し、tasklist／roadmapは存在しない。repository validatorは旧contract assertion七件と論点15所有のversion一件の計八件で想定どおり失敗しており、論点10、15の未決事項として維持した。

**doc-enricher review:** `plugins/tumeda-dev/skills/README.md`は個別skillの詳細を一行概要へ留める目次であり、条件付きexecution planとplanless completionは既に記載されている。本番application／補助toolの判定詳細はtask-design内部のrouting contractで、READMEまたは既存docsへ複製するとREADME方針とGate Gに反するため、追加候補なしと判定した。

**ネクストアクション:** 論点1は完了。論点10は、本番application codingという理由ではexecution plan対象にできない状態で保留している。次の論点へ進む前の全体再評価で、今回の読解中に見つかった合意済み論点21・23のproduction適用漏れを先に扱い、その後にrepository validatorのroutingを再開する。validator変更やtasklist作成はこのdecision反映に含めない。

## 論点2: 認識齟齬の原因を具体ケースより先にdocsまたはskillへ反映する

**ステータス:** 決定

**種別:** 認識齟齬 / レビュー指摘

**起点となった原文:**
> あと、doc-enricherの起動も、steeringに残すけど、discussoinの即時反映時に毎回doc-enricherの起動をしてほしいかも。なんだったら即時反映の原因になったdiscussionの議論が、docsやskillの不備による認識の齟齬であるなら、具体ケースの修正方針というよりも、具体ケースをdocsやskillの不備修正の具体例として使って、それらの修正について方針合意ができたあとdocsやskillについて即時修正して、その反映例の1つとして具体ケースを扱う、みたいな順番でもいいかも。元々think-throughでファインプレー判断を作ったのもそれが背景だった。

**提起の背景:** 現行flowはdiscussionから具体的な修正案を決め、その後のgateで再発防止先をreviewする。この順序では、認識齟齬の原因が既存docsまたはskillの不足だと分かっていても、具体ケースの修正が主、知識やprocessの修正が副産物になる。後段の`doc-enricher`起動だけでは、具体ケースを一般則の適用例として扱う思考順序へ変わらない。

### 現在の合意対象

**参照する現在案:** イテレーション1の提案1

**今回確認すること:** discussionで即時反映が生じるたびに`doc-enricher`を提案modeで一度起動することに加え、認識齟齬の原因がdocsまたはskillの不備なら、具体ケース固有の修正を先に決めず、一般化したdocs／skill修正をdiscussionの主decisionとして合意・即時反映し、その後に具体ケースを適用例として扱う順序へ変更するか。

### 議論の変遷

#### 事象の記述

- discussionで設計や修正方針が確定しても、知識永続化の確認は主にsteeringのplan合意後gateまたはtask完了後に置かれている。
- `think-through`には、洞察が熱いうちにskill改善を提案し、具体ケースで正しい形を合意してから型へ反映するファインプレー判断がある。
- 現行`doc-enricher`はコードリーディング、task遂行、review後を主な起動時点とし、discussionの即時反映ごとの起動を必須にしていない。
- `doc-enricher`のwriter範囲はREADMEと既存docsであり、skill本体の修正は対象外である。

#### 原因の追跡

- なぜ: workflowが具体ケースの修正を本線、docs・skill改善を後段の再発防止reviewとして扱っているため、原因より症状を先に直す順序になる。
- なぜ: discussionで判明した認識齟齬を「今回の要件差分」と「共有知識または思考processの欠落」に分けるroutingが、提案作成より前にない。
- なぜ: `doc-enricher`の起動時点とskill改善のファインプレーが別々の例外規則として存在し、discussion decisionから原因のownerへ戻す共通flowになっていない。
- なぜ: 具体ケースが一般則を発見・検証する観測例である場合でも、具体ケース自体を最上位の修正単位として扱っている。

#### 根本原因0 + 提案0

- **根本原因0**: discussionで具体案を作る前に、認識齟齬の原因が成果物固有の不足、repository知識の不足、skillが担う思考processの不足のどれかを判定し、原因のownerへdiscussion scopeを引き上げる手順がない。そのため、後段で`doc-enricher`やskill改善を起動しても、具体修正の付随作業に留まる。
- **提案0（現時点）**:
  - 総論: discussionで具体ケースへの修正案を確定する前に認識齟齬の原因を分類する。docsまたはskillの不備が原因なら、具体ケースを一般則の発見・検証例へ位置付け直し、汎用的なdocs／skill修正を主decisionとして合意・即時反映してから、具体ケースへ適用する。
  - 各論:
    - ルール: discussionで認識齟齬または修正要求を扱う時は、提案作成前に原因を次の三つへ分類する。
      1. 成果物固有の不足: 共有知識やprocessは足りており、今回の成果物だけが合意済み設計とずれている。
      2. repository知識の不足: codeを読んでも分からない永続的な設計意図、制約、探索導線がREADMEまたは既存docsに不足している。
      3. skillの不足: repositoryを問わず再発する思考、設計、discussion、実行processの問いまたは順序がskillに不足している。
    - ルール: 成果物固有の不足なら、具体ケースをdiscussionのdecision scopeとして通常どおり扱う。
    - ルール: repository知識の不足なら、具体ケース固有の修正案を先に合意しない。具体ケースを「この知識が欠けたために起きた失敗例」とし、`doc-enricher`を提案modeで起動して抽象化したdocs修正案と適用先を作る。そのdocs修正案をdiscussionの合意対象とする。
    - ルール: skillの不足なら、具体ケース固有の修正案を先に合意しない。具体ケースをskill ruleの必要性を示す例として使い、現在の文脈を離れた別domainの例でも同じruleが機能するか検証して、対応skillの修正案をdiscussionの合意対象とする。skill修正を`doc-enricher`へ委ねない。
    - ルール: docsまたはskillの修正案が合意されたら、次の論点へ進む前に対象fileへ即時反映・検証する。その後、元の具体ケースを新ruleの適用例として再評価し、別の変更が必要なら即時反映またはexecution plan対象へ分類する。
    - ルール: discussionのdecisionから即時反映が生じるたび、steering終了時の集約reviewとは別に、`doc-enricher`を提案modeで一度起動する。候補がなければ変更せず次へ進み、候補があれば現行contractどおり具体的な提案へのユーザー合意後だけREADMEまたは既存docsへ反映する。
    - ルール: 同じdiscussion decisionを起点に`doc-enricher`が提案・適用したdocs変更は、同じ起点から`doc-enricher`を再帰起動しない。一つのoriginating decisionにつき一回とし、無限loopと重複reviewを防ぐ。
    - ルール: steering終了時の`doc-enricher`起動は残す。これは全discussionと実装結果を横断する最終safety netであり、各decisionでreview済みの候補を再提案しない。
    - ルール: 既存docsに一般則が既にあるのに見落とした場合は、同じruleを重複記載しない。`doc-enricher`のcontractに従い、必要なら既存ruleの失敗例または探索導線を改善する。
    - 適用例: API clientのretry方針で認識齟齬が起き、原因がarchitecture guideにretry責務が書かれていないことなら、対象methodだけの修正方針を先に決めない。retry責務の一般則をarchitecture guideへ提案・合意・即時反映し、その適用例として対象methodのcode変更をexecution plan対象へ載せる。
    - 適用例: tasklistへ単発document更新を送ってしまった原因がtask-designの判定順序不足なら、今回のdocumentだけをtasklistから外す決定で終えない。task-designの一般ruleを合意・即時反映し、そのruleに従った具体例として今回のdocumentを直接更新する。

##### 検証

- **観点**: docs・skill改善が具体ケース修正の後回しにならないか。
- **結果**: 原因分類を提案前に置き、docs・skill不足ならdiscussion scope自体を一般則へ引き上げるため、原因修正が具体ケースより先になる。
- **観点**: `doc-enricher`へskill修正まで誤って委ねないか。
- **結果**: repository知識は`doc-enricher`、repository非依存のprocessは対応skillというowner境界を明示する。
- **観点**: 毎回起動によって同じdocs修正が再帰的に提案されないか。
- **結果**: 一つのoriginating decisionにつき一回とし、steering終了時はreview済み候補を除外する。
- **弱点**: 「成果物固有」「repository知識」「skill」の境界を誤ると、具体的すぎるruleを上位docsまたはskillへ押し上げる危険がある。`doc-enricher`の抽象化gateと、`think-through`の文脈外具体例による検算を必須にして抑える。

### イテレーション1: 論点3・5の決定を反映した責務と適用順序

**再開時に反映する合意済み前提:** 論点3により、即時反映は目的でもdefaultでもなく、他の未決事項へ依存しない変更だけが即時反映できる。論点5により、委託themeで生じた議論の記録とhandoff前の同期は`facilitate-discussion`が単独で所有し、consumer skillへ同じ責務を重複記載しない。

#### 提案0の検証

- 認識齟齬の原因を成果物固有、repository知識、skillの不足へ分類し、原因のownerへdiscussion scopeを引き上げる順序は維持する。これは具体ケースの症状だけを直して同じ認識齟齬を再発させないために必要である。
- 一方、docsまたはskillの修正案が合意されたら常に「次の論点へ進む前に即時反映する」とした部分は、論点3と矛盾する。原因修正を具体ケースより先に**設計・合意すること**と、fileへ即時に**適用すること**を分離しなければならない。
- 原因分類と`doc-enricher`を呼ぶ判断を`task-design`、`steering`、`doc-enricher`へ重複記載すると、論点5で解消したowner分散を再発させる。themeの議論をfacilitateしている`facilitate-discussion`内で閉じる必要がある。

#### 提案1

- `facilitate-discussion`は、認識齟齬または修正要求を受けた時、具体案を作る前に原因を次の三つへ分類する。
  1. **成果物固有の不足:** 共有知識とprocessは足りており、今回の成果物だけが合意内容から外れている。
  2. **repository知識の不足:** 永続的な設計意図、制約、探索導線がREADMEまたは既存docsに不足している。
  3. **skillの不足:** repositoryを問わず再発する思考、設計、discussion、実行processの問いまたは順序がskillに不足している。
- 成果物固有なら具体ケースをそのまま合意対象にする。repository知識の不足なら`doc-enricher`を提案modeで起動し、具体ケースを失敗例として一般化したdocs修正を同じdiscussionの主な合意対象にする。skillの不足なら具体ケースを必要性の実例として対応skillの修正案を作り、文脈外の例でも機能するか検証して、同じdiscussionの主な合意対象にする。
- docsまたはskillの原因修正を先に合意した後、対象fileへの適用時期は論点3のgateで判定する。他の未決事項へ依存しなければ即時反映し、依存するなら`task-design内反映待ち`として保持する。待機中でも、元の具体ケースは合意済み一般則の適用例として設計できるが、未適用のruleを適用済みとは扱わない。
- 一般則の合意後、元の具体ケースをその適用例として再評価する。一般則だけで具体ケースの変更内容が一意に決まれば、その結果を反映対象へ送る。新しい判断が必要なら、具体ケース側のdecisionとしてdiscussionに残す。
- 一つのdiscussion decisionから対象成果物への即時反映が実際に行われた時、`facilitate-discussion`は次の論点へ移る前に`doc-enricher`を提案modeで一度だけ起動する。repository知識不足の分類時に同じdecisionを起点として既に起動済みなら、それを一回として数え、再帰起動しない。候補がなければ変更せず、候補があれば現行contractどおりユーザー合意後だけREADMEまたは既存docsへ反映する。
- steering終了時の`doc-enricher`は、themeを横断した最終safety netとして残す。各decisionですでにreviewした候補は除外する。

#### source owner

- 上記の原因分類、一般則を先に合意するrouting、即時反映後の`doc-enricher`起動は、委託themeの議論を所有する`facilitate-discussion/SKILL.md`だけで管理する。
- `task-design/SKILL.md`と`steering/SKILL.md`へ同じroutingを複製しない。両者は`facilitate-discussion`へthemeを委託し、返却されたdecisionと適用状態を扱う。
- `doc-enricher/SKILL.md`の提案mode、writer範囲、承認gateは変更しない。`facilitate-discussion`が既存contractに従って呼び出す。
- 対応skillやdocsの具体的な修正内容は、個々の認識齟齬で作るdecisionであり、この共通ruleには埋め込まない。

##### 検証

- **観点:** 原因修正を先に行う思想と、依存がある変更を即時反映しないruleが両立するか。
- **結果:** 合意順序とfile適用時期を分離したため、一般則を先に確定しながら、依存する変更は整合した単位で後から適用できる。
- **観点:** 具体ケースが放置されないか。
- **結果:** 一般則の合意後に必ず具体ケースを適用例として再評価し、一意に決まらない差分だけを新しいdecisionへ戻す。
- **観点:** source file間で記述が多重管理されないか。
- **結果:** 議論中の分類とroutingは`facilitate-discussion`だけが所有する。`task-design`、`steering`、`doc-enricher`は既存の委託・実行contractを維持する。

**決定:** 未決。提案1への合意待ち。

**ネクストアクション:** 提案1が合意されたら、論点3のgateで即時反映可否を判定する。その後、論点2のdecisionと適用状態を`design.md`へ反映し、次の未決事項へ進む。

### 合意時の補足: エコシステム自身の不備は通常独立している

**受領したfeedback:**
> ok。まぁ基本即時反映だろうけどね。回ってるスキルやdocs体系を使ってて、そのエコシステムの不備で提案内容に不備や認識齟齬が起きるなら、その不備や認識齟齬は他の論点と独立で存在するだろうし

**解釈:** 即時反映を目的または無条件のdefaultへ戻す指摘ではない。運用中のskill・docs体系そのものに欠けていたruleは、通常、具体ケースや同じsteering内の他の未決decisionがどう決まっても必要であり、論点3の依存関係gateを通した結果として即時反映になることが多い、という実務上の期待である。依存が実在する例外だけを`task-design内反映待ち`にする。

**今回の適用判定:** 論点2の共通routingは`facilitate-discussion`一fileで閉じ、task-design templateやplanなしrouteの未決事項で要否・内容が変わらない。したがって即時反映対象とする。

**決定:** 提案1を採用する。認識齟齬または修正要求は具体案の前に原因ownerへ分類し、repository知識またはskillの不足なら一般則の修正を主decisionとして先に合意する。fileへの適用時期は依存関係gateで分けるが、エコシステム自身の不備は通常ほかの論点から独立しているため、実務上は即時反映になることを基本的な期待とする。分類、一般則への引上げ、即時反映後の一回限りの`doc-enricher` reviewは`facilitate-discussion`だけが管理し、consumer skillへ複製しない。

**ネクストアクション:** `design.md`へdecisionを反映した後、`plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`へ直接適用してvalidationする。同じoriginating decisionについて`doc-enricher`を提案modeで一度起動し、候補の有無をこの論点へ記録する。

**反映結果:**

- **production反映先:** `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`
- **反映内容:** 成果物固有、repository知識、skillの三つへ原因を分類するgate、docs／skillの一般則を具体ケースより先に合意する順序、consumerが所有する適用時期との境界、エコシステム自身の不備は通常独立しており即時反映になるという期待、一origin一回の`doc-enricher` review、再帰・重複防止を追加した。
- **管理元:** 原因routingとdecision単位reviewは`facilitate-discussion/SKILL.md`だけへ置いた。`task-design/SKILL.md`、`steering/SKILL.md`、`doc-enricher/SKILL.md`、discussion templateは変更していない。
- **設計・migration記録:** `design.md`へ完成後のcontractを反映し、`function-migration-ledger.md`へA-010とFD-C007を追加した。
- **配布metadata:** 後方互換な機能追加として、論点5の`5.1.0`に続きtumeda-dev plugin versionを`5.2.0`へ同期した。worktree上のbaselineとの差分は`5.0.0`から`5.2.0`である。
- **validation:** skill validator成功、三つのplugin manifestとmarketplaceのJSON構文・version一致、Markdown差分check、非対象sourceが未変更であることを確認した。
- **`doc-enricher` review:** root `README.md`、`plugins/tumeda-dev/skills/README.md`、`plugins/tumeda-dev/docs/documentation_standards/README.md`と関連docsの探索結果を確認した。今回得た知識はrepository固有の設計意図ではなく`facilitate-discussion`自身が所有するprocess contractであり、skills READMEも個別skillの詳細を書かない方針を明示しているため、README／既存docsへの候補はなしと判定した。docsは変更していない。
- **decisionとの差分:** なし。論点3のgateを維持しつつ、今回の変更は独立しているため即時反映した。

## 論点3: task-design内変更の反映時期を依存関係で決める

**ステータス:** 決定

**種別:** 認識齟齬 / レビュー指摘

**起点となった原文:**
> 今回ので浮き彫りになったけど、即時反映は目的じゃない。1つの論点の議論が終わったときに、そのトピックに閉じて依存関係がなければ即時反映してもいいけど、他の未決事項の結果によって左右されるとかだった場合は即時反映してはいけない。今回については、task-designのskillを即時反映してはいけない理由は、このsteering全体を通して、方針が決まって一気に直すのに、小手先でちまちまパッチワークで直したら、全体として整合性合わないところとか出てくるから。そう考えると、今回は移行前で言うところの計量モードではない。完成後の姿はなきゃいけないし、それが task-design_template_prototype として参照される形で存在するだけで、なくていい存在ではない

**提起の背景:** 論点1ではtasklistへ載せる対象と`design.md`での表現を決めたが、tasklistへ載せない変更をいつ反映するかは別の判断である。`tasklist不要`を`即時反映すべき`と同一視すると、未決事項に依存するskill・template・validatorを局所的にpatchし、全体contractの不整合を生む。

### 現在の合意対象

**参照する現在案:** イテレーション1の提案1

**今回確認すること:** task-designが所有する対象成果物への変更について、即時反映を目的やdefaultにせず、他の未決事項と整合性依存がない場合にだけ選べる反映時期とする。依存がある変更はtasklistへ送らず`task-design内反映待ち`とし、依存解消後に整合した単位で一括反映する。discussion decisionを`design.md`へ直ちに記録する既存contractは維持し、対象成果物への適用時期と区別する。状態の具体的な保存場所は後続設計で決める。

### 議論の変遷

#### 事象と原因

- 論点単体で方針が決まっても、同じcontractを表す別のskill、template、validatorの形が未決なら、その変更内容はまだ一意ではない。
- design上の依存解消を待つことは、合意済み作業をruntimeのcheckpointに沿って遂行することではない。待つ必要だけを理由にexecution plan対象へ送ると、tasklistをほぼコーディングへ限定する方針に反する。
- 今回はcode変更を含まなくても、task-design template群の完成後の姿を設計し、関連contractを一括で揃える必要がある。旧軽量モード相当ではない。

#### 根本原因0 + 提案0

- **根本原因0**: 変更のownerをtask-designまたはexecution planへ分ける軸と、task-designが対象成果物へ変更をいつ適用できるかという軸を分離していなかった。さらに、decisionの`design.md`への即時記録と対象成果物への即時適用を同じ「即時反映」と呼んだため、`tasklist不要`が`対象成果物を直ちに変更`へ誤変換された。
- **提案0（現時点）**:
  - 一つのdecisionが確定したら、そのdecisionは既存contractどおり直ちに`design.md`へ記録する。複数decisionを溜めず、次の論点より先に設計全体を再評価する。
  - そのdecisionから生じる対象成果物の変更は、まず`task-design内反映`、`execution plan対象`、`分類保留`のいずれかへ分類する。
  - task-design内反映へ分類した対象成果物の変更は、内容とvalidationが論点内で閉じ、未決decisionで内容・要否が変わらず、他fileやcontractとの同時変更が不要な場合に限り、その場で適用してよい。対象成果物への即時適用はMAYでありMUSTではない。
  - 即時反映条件を満たさないtask-design所有変更は`task-design内反映待ち`へ置き、待つ理由、依存decision、参照するdesign sectionを記録する。依存解消後、相互依存する変更を一つのbatchとして反映・validationする。
  - `task-design内反映待ち`はexecution plan対象へ載せない。tasklistまたはroadmapの作成gateへ進む前にtask-designが反映・validationを終え、待ち一覧を空にする。
  - 完成後の姿はcode変更の有無にかかわらず必要とし、旧軽量モードは廃止する。今回の完成後の姿は`design.md`から参照する`task-design_template_prototype/`で具体化する。
  - 今回のtask-design、steering、template、validator、公開contractのsource変更は`task-design内反映待ち`とする。workflow全体とprototypeが確定した後、整合した一括変更として反映する。

#### 検証

- **観点**: 即時反映できない非code変更がtasklistへ逆流しないか。
- **結果**: owner分類と反映時期を分離し、task-design内反映待ちを正式に持つため逆流しない。
- **観点**: 即時反映を優先して全体整合性を壊さないか。
- **結果**: 即時反映を任意とし、未決decisionとfile間contractへの依存がないことを条件にする。
- **観点**: 今回の完成後の姿を省略しないか。
- **結果**: `task-design_template_prototype/`を完成後のtemplate directoryとして`design.md`から参照する。

**決定:** 方針を採用する。discussion decisionは既存contractどおり`design.md`へ直ちに記録する。一方、decisionから生じる対象成果物の変更はowner分類と反映時期を分離し、依存がなければその場で適用してよく、依存があれば`task-design内反映待ち`として依存解消後に一括適用する。即時適用は目的でもdefaultでもない。状態の具体的な保存場所はこの決定に含めず、後続設計で決める。

**ネクストアクション:** `design.md`とprototypeで、decisionの即時記録と対象成果物の適用時期を別概念として表現する。保存場所はmigration ledgerで既存contractを監査した後に設計する。その後、保留中の論点2を再開する。

## 論点4: function migrationで移行元の判断能力を欠落させない

**ステータス:** 決定

**種別:** 認識齟齬 / レビュー指摘

**起点となった原文:**
> あと .steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/design.md について、移行元から合意なく落とされているものあって、無思慮って感じる。 plugins/tumeda-dev/docs/common_standard/function_migration_policy.md を読んだ存在と思えない

**追加feedback:**
> え、 plugins/tumeda-dev/skills/task-design/templates/design.md で書かれてたものが .steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/task-design_template_prototype/templates/design-components に移植されて interaction-flow.md とかが本当に単なるフォーマットに堕して、元々の細やかな意図や具体の書き方例とかが書いてあって、意図と反さない書き方や薄い記述にならないように書いてくれている物全部消えてるのに、これが移行完了とでも？

**追加feedback:**
> あと、サイレントですっと変えてるけど、design.mdが勝手に薄くなったことや今回の指摘、普通にdiscussionに残すことだからね。

**2026-08-09の意味訂正:**
> 論点4で話したことは、勝手に機能落とすなと言っただけで、落とさないうえで、意図があって追加して、しかも適用しながら検証して修正せざるをえないものだろうから、論点9ももちろんokだし、四候補とされているものもいちいち聞かれるの面倒だから一括採用でok

論点4は「追加能力を一件ずつ再承認させること」を目的としたdecisionではない。既存能力を未合意に落とさないことが主旨である。新しい判断能力はbaselineからの移植と混同せず`ADD`として追跡するが、意図を持ってprototypeへ追加し、適用しながら検証・修正することを妨げない。同じ上位意図で一括承認された複数`ADD`は、atomic ledgerを分けたまま一つの合意で採用できる。

**提起の背景:** destination側の新しいworkflowとformatを先に作り、移行元の`design.md` templateとtask-design skillが持っていた理由、具体例、失敗例、判断質問、強調を全件対応付けなかった。その結果、component fileはfieldだけを持つ薄いformatへ縮退した。さらに、指摘後の修復をdiscussion decisionとして記録せず、成果物だけをサイレントに変更した。

### 現在の合意対象

**参照する現在案:** 根本原因0 + 提案0

**今回確認すること:** 今回をfunction migrationとしてsource-firstでやり直す。移行元の全構造rangeとatomic contractを、合意済み`CHANGE | RETIRE`以外は理由、例、失敗例、判断質問、強度まで含めて新ownerへ移す。prototypeの各componentは単なる記入formatではなく、薄い記述や意図に反する記述を防ぐ判断能力を持つtemplate部品とする。欠落と修復は成果物だけで処理せず、この論点へ履歴として残す。

### 議論の変遷

#### 事象と検証

- 旧`templates/design.md`の操作フローには、動的視点の目的、mutationの引数・順序でずれる理由、含めるcaseのMUST、タップ回数まで書く粒度、frontend／backend validation照合、具体的な記述例があった。
- 初版`interaction-flow.md`はactor、API、内部連携、結果というfieldだけで、これらの判断能力を欠いていた。
- data、公開API・module境界、file成果物、画面についても同じ要約化が起きた。
- 初版`design.md`は移行元にあった既存仕様、Requirements分類、独立したrisk・test、task-design本体とcallerのcontractを完成後の姿から落としていた。
- 指摘後に`design.md`とprototype coreを修正したが、認識齟齬と修復方針をdiscussionへ記録しなかった。

#### 根本原因0 + 提案0

- **根本原因0**: prototypeを移行後formatの新規設計として扱い、移行前sourceの全機能を保存するrefactoringとして扱わなかった。`function_migration_policy.md`のbaseline固定、二層ledger、source-first、white-box照合を初稿前に実行せず、見出しとfieldが対応していることを意味保存と誤認した。
- **提案0（現時点）**:
  - baseline revisionとsource rangeを固定し、構造ledgerとatomic contract ledgerをproduction編集前に完成させる。
  - component化は旧templateの完成後の姿blockを配置変更する`MOVE | ADAPT`として扱う。理由、具体例、失敗例、判断質問、MUST、コメントの強調を、対応componentへ実体として移す。
  - sourceにないcomponentまたは新しい判断能力は既存contractへ混ぜず`ADD`として分離し、ユーザー合意前にproductionへ入れない。
  - `design.md`、task-design本体、tasklist design、roadmap design、steering consumerを合算して完成後の姿とmigration scopeを描く。
  - Git削除行と追加行をledgerへ逆引きし、`未監査 0 / 未分類削除 0 / 未分類追加 0`まで移行完了と呼ばない。
  - 移行欠落、認識齟齬、ユーザー指摘、修復方針はdiscussionへ保存し、成果物だけをサイレントに変更しない。

#### 検証

- **観点**: 見出しとplaceholderだけを移して移行完了と誤判定しないか。
- **結果**: atomic contractに理由、例、失敗例、判断質問、強調を独立登録し、各componentの具体的destinationを要求する。
- **観点**: 指摘された箇所だけを継ぎ足し、同じ原因で落ちた未発見箇所を残さないか。
- **結果**: 失敗prototypeではなくbaseline sourceを起点に全rangeを順方向照合する。
- **観点**: 修復過程が後から追えなくならないか。
- **結果**: この論点に原文、原因、現在案、検証、決定を保存し、designとledgerから参照する。

**決定:** 初版prototypeと初版`design.md`を移行完了と扱わない。今回をfunction migrationとしてbaseline sourceからやり直し、合意済み`CHANGE | RETIRE`以外の判断能力を、理由、具体例、失敗例、判断質問、強調まで含めて新ownerへ移す。componentをplaceholderだけのformatへ縮退させない。移行欠落、ユーザー指摘、修復方針、検証結果はdiscussionへ保存し、成果物だけをサイレントに変更しない。sourceにない追加能力は`ADD`として分離し、明示合意前にproductionへ入れない。ただしこれは追加ごとの個別再承認を要求するdecisionではなく、一つの上位意図で一括合意された複数`ADD`はまとめて採用し、適用・検証しながら修正できる。

**ネクストアクション:** 旧templateとtask-design skillをsourceに、prototype componentへ判断能力を全量移す。移植結果とledgerを提示し、論点4の合意を確認する。

### 2026-08-09の適用中監査: prototype coreの再修復

task-design本体のproduction edit mapを作成した後、旧`templates/design.md`とprototype coreを行単位で再照合した。その結果、prototypeは既存仕様、Requirements、risk、testの見出しを復元していた一方、次の判断能力がまだ薄くなっていた。

- 冒頭commentから、「変更点の列挙では完成後の世界の合意にならない」という理由と、完成後の姿、前提、根拠、担保、付録の主従関係が弱まっていた。
- 上位roadmap制約から、「参考情報ではなく上位制約」「子scopeはstrictly narrower」という強度が落ちていた。
- 既存仕様から、「感覚で設計を始めない」「列挙でなく制約・合意の要点まで書く」という失敗防止が落ちていた。
- 非目標から、scope外の明示が設計膨張を防ぐという理由が落ちていた。
- 設計判断から、完成後の姿を先に置くことで「設計を守る」のでなく「この世界を実現する」という思考順序が落ちていた。
- 付録から、変更範囲はtaskの前捌きであり設計の代替ではない、という元の主従理由が落ちていた。

また、prototypeのRequirements配下にあった`変化の境界`sectionは、旧template由来でも独立した合意済み`ADD`でもなく、論点6で合意した付録の終了時差分証跡と重複していた。これは未分類追加として削除し、開始時から終了時までの確定差分は`（付録）変更の実行区分`だけが所有する形へ戻した。

修復では上記の旧文言と理由をprototype coreへ復元し、合意済み変更であるoutcome section選択とrouting stateだけを重ねた。`function-migration-ledger.md`へcoreの13 atomic contractを追加し、完成後の姿の16 atomic contractと分けてsource、destination、分類、検証を記録した。

検証では、原文保持、WHY、strictly narrower、既存仕様の具体性、非目標の理由、設計判断の思考順序、付録の従属関係を固定文字列で確認した。16 outcome mapping、13 core mapping、tasklist／roadmap prototypeのbaseline byte一致、Markdown差分checkも通過した。productionのtask-designとtemplateはまだ変更しておらず、main migrationの未監査gateは継続する。

## 論点5: 記録価値のある議論をdiscussionから欠落させない

**ステータス:** 決定

**種別:** 認識齟齬 / レビュー指摘

**起点となった原文:**
> disucussionの目的はフローに則ってイテレーションを回すことでなく、議論を記録に残すことだから。これ自体が認識齟齬として浮き彫りになったこと、それに対してでネクストアクションどうするかを別論点として挙げようか

**提起の背景:** 今回、`design.md`の縮退についてユーザーと相談し、修正方針も合意したにもかかわらず、その議論をdiscussionへ残さず`design.md`とprototypeの修復へ進んだ。変更が無断だったのではない。問題は、合意済みになったことで議論を記録する必要まで消えたように扱い、事象、原因、提案、feedback、決定をdiscussionから欠落させたことである。

### 現在の合意対象

**参照する現在案:** イテレーション5の提案5

**今回確認すること:** テーマを委託された`facilitate-discussion`が、そのテーマ内で起きた記録価値のある議論を、未決・合意済みにかかわらずdiscussionへ欠落なく同期する責任を単独で持つ。基本は成果物反映より先に記録するが、記録漏れへ後から気づいた場合も許容し、結論だけでなく議論の変遷全体を事後再現して回復するfallbackを持つか。

### 議論の変遷

#### 事象の記述

- `facilitate-discussion`は、表面の質問から原因を追い、完全な提案を作り、弱点を検証し、feedbackを同一decisionまたは別decisionへroutingして合意を進める。
- `原因の追跡`、`根本原因0 + 提案0`、`イテレーションN`、`論点routingの判断`があることで、facilitator自身の見解と提案を記録できる。
- 現行flowは、一つのdecisionを保存するとconsumerへ返してskill処理を終了する。consumerが`design.md`、prototype、docs、skillへ何を適用したかを、同じ論点へ戻すcontractはない。
- 今回はconsumer側で`design.md`とprototypeを修正したが、その適用内容と、修正過程で判明した「discussionへ記録していない」という追加の認識齟齬が記録から落ちた。

#### 原因の追跡

- なぜ修復が記録されなかったか: discussionの完了範囲がdecision確定までで、decision適用後の結果を回収しない。
- なぜworkflowを回すことが目的化したか: 完了gateが「提案を保存して合意を求めた」「decisionを保存して返した」で終わり、decisionから生じた変更と新しい認識齟齬まで記録されたかを確認しない。
- なぜfacilitatorを降ろす誤案になったか: workflowに沿うこととfacilitation ownershipを同一視し、問題の場所をdecision後lifecycleではなく議論前半のownerへ求めた。

#### 根本原因0 + 提案0

- **履歴上の扱い**: 旧イテレーション0〜2は、表現を変えながらいずれも`facilitate-discussion`からfacilitation ownershipを下ろす同一提案だったため、独立iterationとして水増しせず、この提案0へ統合した。
- **根本原因0**: `facilitate-discussion`が議論を所有するため、自然な議論より固定flowが優先されて記録漏れが起きる。
- **提案0（誤案）**:
  - `facilitate-discussion`をfacilitatorから受動的recorderへ縮退させる。
  - 原因追跡、完全な提案、検証、論点選択、routing、合意確認を`think-through`とconsumerへ移す。
  - `原因の追跡`、`根本原因0 + 提案0`、`イテレーションN`、`論点routingの判断`を必須骨格から外す。
  - `facilitate-discussion`はconsumerが進めた議論を既存topicまたは新topicへ配置し、file安全性と履歴だけを所有する。
  - 保存後は合意質問を作らず、会話の継続もconsumerへ委ねる。

##### 検証

- **観点**: 記録漏れを防げるか。
- **結果**: 記録ownerを限定する方向は示せるが、consumerが十分な原因追跡と提案を作る保証がなく、discussionの内容自体が薄くなる。
- **弱点**: 記録漏れの発生箇所はdecision適用後なのに、議論前半のfacilitation ownershipを削っている。原因と変更箇所が一致していない。

#### イテレーション1

**受領したfeedback:**
> いや、絶対議論が薄くなる方針にしかならないだろ。facilitate-discussionがオーナーに決まってるだろ。議論のファシリテーターなんだから。「`原因の追跡`、`根本原因0 + 提案0`、`イテレーションN`、`論点routingの判断`を必須骨格から外す。」逆に記録を目的にして、お前からの提案ができる土壌を消している。あと、イテレーション0,1,2は書き方が違うだけで同じこと言ってるから0として今の2を書いて。

**追加feedback:**
> 昔のイテレーション0~2はお前のfacilitate-discussionから議論のオーナーを下ろすっていう意味不明提案で、イテレーション1として今回の書かなきゃだめだろ。そしてイテレーション1の提案で結局何が変わるかわからない

##### 検証

- **観点**: 提案0はfacilitationの厚みを保つか。
- **結果**: 保たない。原因追跡、提案、検証、routingをconsumerへ分散し、`facilitate-discussion`を記録作業だけへ限定するため、facilitator自身が考えて提案する土壌を失う。
- **観点**: 実際に記録が落ちた場所を直しているか。
- **結果**: 直していない。落ちたのはconsumerがdecisionを適用した後の変更と派生した認識齟齬であり、decision前のfacilitation ownershipではない。

##### 論点routingの判断

- **discussion scopeへ属する理由**: discussionの目的を記録へ接続しつつ、facilitatorが議論を厚くするownerを維持する方法は論点5のdecisionそのものである。
- **同一decision scopeとしてiterationを継続する理由**: 提案0のowner移動を撤回し、同じdiscussion lifecycleの変更箇所をdecision後へ移すfeedbackである。

##### 修正先の判断

- **診断levelへの遡及**: 記録漏れの原因をfacilitation ownershipとした診断を撤回する。根本原因を、decision確定後の適用結果がdiscussionへ戻らないlifecycle断絶へ修正する。

##### 根本原因1 + 提案1

- **根本原因1**: 現行`facilitate-discussion`はdecisionの提案・検証・合意・保存までは所有するが、consumerがそのdecisionを成果物へ適用した結果を同じ論点へ返すcontractを持たない。discussionの記録lifecycleがdecision時点で終わるため、実際に変えたもの、validation、適用待ち、decisionとの差分、適用中に判明した認識齟齬が記録から落ちる。
- **変更点の要約**: 現行の「decision確定後にconsumerへ返したら`facilitate-discussion`は終了」を廃止し、「consumerがdecisionを扱った結果を、同じ論点を指定して`facilitate-discussion`へ返し、その結果を記録するまで終了しない」へ変える。facilitationの前半は変えない。
- **提案1（現時点）**:
  - 変わらないもの:
    - `facilitate-discussion`が議論のfacilitator兼record ownerである。
    - 事象、原因追跡、根本原因と完全な提案、検証、feedback routing、iteration、合意確認を`facilitate-discussion`が所有する。
    - `原因の追跡`、`根本原因0 + 提案0`、`イテレーションN`、`論点routingの判断`をtemplateの必須骨格として維持する。
    - 過去履歴の非破壊、single writer、重複番号・親子循環時の停止、self-containedな現在案を維持する。
  - 変わるruntime flow:

    ```text
    現行:
    facilitatorがdecisionを保存
      → consumerへ返却
      → consumerが成果物へ適用
      → consumer内で全体を再評価
      → facilitate-discussionへは戻らず終了

    変更後:
    facilitatorがdecisionを保存し、適用状態を「未報告」にする
      → consumerへ返却
      → consumerが成果物へ適用、反映待ち化、または適用不要と判断
      → consumerが「適用結果event」として同じfacilitatorを再適用する
      → facilitatorが対象論点を解決し、decisionとの差分と派生論点を検証して記録
      → 適用状態を「適用済み / 反映待ち / 適用不要」へ更新
      → 記録lifecycle完了
    ```
  - 新設する`適用結果event`の入力contract:

    | 必須入力 | 内容 |
    | --- | --- |
    | `discussion_file` | decisionを保存したdiscussion file |
    | `topic` | 適用結果を戻す論点番号 |
    | `decision` | 適用した決定または提案参照 |
    | `application_state` | `applied | pending | not_applicable`のいずれか |
    | `targets` | 実際に変更したpath。変更がなければ空と理由 |
    | `actual_changes` | 実際に変えた内容。decisionの再掲ではなく差分 |
    | `validation` | 確認方法と結果。未実施なら理由 |
    | `deviation` | decisionと一致したか。差分があればその内容 |
    | `pending_dependencies` | `pending`の場合の依存decisionと再評価条件 |
    | `new_findings` | 適用中に判明した認識齟齬・別decision候補 |

    consumerは自然言語contextとしてこれらを渡す。固定result schemaを全eventへ課すのではなく、`適用結果event`だけに必要な入力を定める。
  - `facilitate-discussion`へ新設する処理variant:
    1. 起動時に`適用結果event`を検出したら、新規論点作成やfeedback iterationへ入る前に、`discussion_file`、`topic`、`decision`の一致を確認する。
    2. 一意に解決できなければfileを更新せず、consumerへ不足情報を返す。
    3. 一致すれば、同じ論点の`適用結果`へ入力を記録し、`適用状態`を更新する。
    4. `deviation`または`new_findings`が新しい判断を要する場合だけ、既存の`2.1 対象論点を選ぶ`へ渡し、同一decisionならiteration、別decisionなら別論点へroutingする。
    5. 新しい判断がなければ、記録した適用状態と対象をconsumerへ返して終了する。合意済みdecisionを再度合意対象にはしない。
  - discussion topicへ追加するstate:
    - `適用状態: 未報告 | 適用済み | 反映待ち | 適用不要`を、discussionのdecision statusとは別fieldで持つ。
    - `決定`は合意内容、`適用状態`はconsumer側でそのdecisionをどう扱ったかを表す。
  - conditionalな`適用結果` block:

    | field | 記録内容 |
    | --- | --- |
    | 対象 | decisionを適用した`design.md`、prototype、docs、skill等 |
    | 適用内容 | 実際に変更した内容。decisionの言い換えではなく実測差分 |
    | validation | 実行した確認と結果 |
    | decisionとの差分 | 一致、部分適用、適用不能、追加判断発生 |
    | 反映待ち | 待つ理由、依存decision、再評価条件 |
    | 新たに生じた論点 | 適用中に判明した認識齟齬または別decisionの参照 |

  - consumerからfacilitatorへ返すtiming:
    - consumerはdecisionを`design.md`へ記録し、対象成果物へ即時適用または反映待ち化した直後に適用結果を返す。
    - 次のdiscussion論点へ進む前に返す。複数decisionの適用結果を最後にまとめない。
    - 適用先がない認識合わせだけのdecisionでも、`適用不要`と理由を返す。
  - source fileごとの具体差分:

    | file / 現行箇所 | 変更後 |
    | --- | --- | --- |
    | `facilitate-discussion/SKILL.md` §1のownership | consumerの適用責任は維持し、facilitator側へ`適用結果eventの検証・記録`を追加する。consumer側へ`結果を同じ論点へ返す`責任を追加する。 |
    | 同 §2のflow図 | 現行の`consumerが適用・全体再評価 → skill処理終了`を、`consumerが適用・全体再評価 → 適用結果eventで再適用 → 適用結果を記録 → skill処理終了`へ置換する。 |
    | 同 起動variant | `file新規作成 / 既存file継続`に加えて、既存fileへ結果だけを戻す`適用結果を記録するvariant`を追加する。 |
    | 同 §2.3 | `2.3.3 適用結果を記録する`を追加し、上記5stepを規定する。`2.3.1 feedback`と`2.3.2 decision確定`は削らない。 |
    | 同 完了gate | decision確定時は`未報告`でconsumerへ返す中間終了とし、そのdecisionの記録lifecycleは`適用済み / 反映待ち / 適用不要`の記録後に完了とする。 |
    | `templates/discussion_entry.md` | `ステータス`直下へ`適用状態`を追加し、`ネクストアクション`の後へconditionalな`適用結果` blockを追加する。他の必須骨格は削らない。 |
    | `task-design/SKILL.md` §4とStep 3 | 現行の`decisionをdesign.mdへ反映 → 全体再評価`を、`decisionをdesign.mdへ反映または反映待ち化 → 適用結果eventを返す → 全体再評価`へ置換する。次の論点へ進むgateに結果返却を加える。 |
    | `steering/SKILL.md` discussion返却後 | steering固有成果物へdecisionを適用または反映待ち化した直後に、同じ`適用結果event`を返すstepを加える。 |
    | `think-through/SKILL.md` | 変更しない。 |

  - 今回の論点4へ適用した場合:
    1. facilitatorが「source-firstでやり直す」decisionを論点4へ保存し、`適用状態: 未報告`にする。
    2. consumerが`design.md`、component、migration ledgerを修復する。
    3. consumerが変更file、復元内容、validation、未監査contractを論点4へ返す。
    4. facilitatorが`適用結果`へ記録し、decisionとの差分として「修復を最初はdiscussionへ残さなかった」を検出する。
    5. この差分を別decisionとして論点5へroutingし、論点4の適用状態を`適用済み`へ更新する。

##### 検証

- **観点**: 何が変わるかを現行と変更後で観測できるか。
- **結果**: 既存facilitationは削除しない。現行の終了線だけを後ろへ移し、decision後にconsumer→facilitatorの一往復、専用event入力、結果記録variant、`適用状態` field、`適用結果` block、記録完了gateが増える。
- **観点**: facilitator自身の提案能力が維持されるか。
- **結果**: 原因追跡、提案、検証、routing、iteration、合意確認のownerと必須骨格を全量維持する。
- **観点**: サイレントな成果物変更を検出できるか。
- **結果**: decisionごとに`未報告`から開始し、適用済み、反映待ち、適用不要のいずれかが記録されるまでlifecycleを閉じない。
- **弱点**: decisionごとにconsumer→facilitatorの再呼出しが一回増える。ただし、discussionをdecisionだけでなく実際の適用まで追える正本にするための意図したcostである。

#### イテレーション2

**受領したfeedback:**
> え、問題は、議論がdiscussionに挙がらずに勝手に直されたことじゃないの？この変更で何が変わるの？

##### 検証

- **観点**: 提案1は、議論をdiscussionへ載せずに成果物を勝手に直すことを防ぐか。
- **結果**: 防がない。提案1はconsumerが成果物を編集した後の結果報告を増やすだけで、discussionを迂回した編集自体は許している。
- **観点**: 今回起きた事象と提案1の変更箇所は一致するか。
- **結果**: 一致しない。今回欠けたのは合意済みdecisionの適用結果ではなく、`design.md`が薄くなったという事象、その原因、ユーザーの指摘、修正方針を、修正前にdiscussionの論点として扱うことである。

##### 論点routingの判断

- **discussion scopeへ属する理由**: discussionへ残すべきeventと、成果物を編集してよい時点の境界は、論点5が扱う「議論を記録に残すためのownerとworkflow」そのものである。
- **同一decision scopeとしてiterationを継続する理由**: 提案1の事後記録を棄却し、記録漏れを編集前に防ぐgateへ変更するfeedbackである。

##### 修正先の判断

- **診断levelへの遡及**: 根本原因を「decision適用後の結果が戻らないこと」とした診断を撤回する。根本原因は、consumerが認識齟齬や修正方針を`facilitate-discussion`へ渡さず、単なる編集指示として直接処理できることである。

##### 根本原因2 + 提案2

- **根本原因2**: `task-design`と`steering`のconsumer contractに、認識齟齬、設計への指摘、既存成果物の不備、修正方針が生じた時、対象成果物を編集する前に必ず`facilitate-discussion`へ渡すgateがない。そのためconsumerは、ユーザーの発言を「直す内容は明らか」と自己判断し、議論の事象・原因・提案・決定をdiscussionへ残さないまま、`design.md`やprototypeを直接編集できる。
- **変更点の要約**: 事後の`適用結果event`は追加しない。代わりに、記録価値のあるeventから生じる編集の前へ`discussion記録gate`を置く。gateを通過してdecisionが記録されるまで、consumerは対象成果物を変更しない。
- **提案2（現時点）**:
  - 変わるruntime flow:

    ```text
    現行で今回起きたflow:
    ユーザーがdesign.mdの縮退を指摘
      → consumerが修正内容を自己判断
      → design.mdとprototypeを直接編集
      → 指摘、原因、修正方針がdiscussionに残らない

    変更後:
    ユーザーの指摘またはconsumer自身の認識齟齬の発見
      → consumerがdiscussion記録対象か判定
      → 対象なら、成果物を編集せずfacilitate-discussionへ渡す
      → facilitatorが事象、原因、提案、検証、routingをdiscussionへ保存
      → ユーザーの指示がdecisionとして一意なら決定として保存し、未決なら合意を得る
      → decisionとネクストアクションがdiscussionに保存される
      → consumerが初めて対象成果物を編集または反映待ち化する
    ```
  - 編集前に必ずdiscussionへ渡すevent:
    - 合意済みdesignの意味、完成後の姿、scope、根拠を変える指摘。
    - `design.md`、prototype、docs、skillが意図より薄い、欠落している、誤っているという指摘。
    - consumerの過去の判断または編集が認識齟齬だったと判明した事象。
    - 具体ケースの修正が、docsまたはskillの不備修正へscopeを引き上げ得る事象。
    - 既存discussionの提案・決定・却下理由を修正または再評価するfeedback。
  - discussionへ渡さず直接編集してよいもの:
    - 保存済みdecisionの内容をそのまま成果物へ反映する作業。
    - 意味、scope、根拠、挙動を変えない誤字、format崩れ、link切れ等の機械的修正。
    - ただし、機械的修正に見えても「なぜこの欠陥が生じたか」がprocess、docs、skillの不備を示す場合はdiscussion対象へ戻す。
  - 明示的なユーザー修正指示の扱い:
    - `早く直して`のように実行が明示されていても、認識齟齬と修正方針に記録価値があればdiscussion gateを省略しない。
    - 修正内容が一意で、ユーザーの発言自体がdecisionを含む場合は、冗長な再合意を求めず、その原文とdecisionをdiscussionへ保存してから編集する。
    - 方針に複数解釈がある場合は、完全な提案を保存し、合意後まで編集しない。
  - source fileごとの具体差分:

    | file / 現行箇所 | 変更後 |
    | --- | --- |
    | `task-design/SKILL.md` §4のconsumer ownership | 認識齟齬・設計指摘・成果物不備を受けた時、`design.md`、prototype、docs、skillを編集する前に`facilitate-discussion`へ渡す責任を追加する。 |
    | 同 `discussionを開始する時と返却後` | 「質問または複数往復を要するdecision」に限らず、上記の記録対象eventも起動条件へ加える。明示的修正指示でも先に記録する。 |
    | 同 Step 3 | 成果物変更の直前gateとして、原因となるeventがdiscussionへ保存済みか確認する。未保存なら編集せず`facilitate-discussion`へ戻す。 |
    | `steering/SKILL.md` discussionの契約 | steering中に生じた同種のeventについて、steering成果物を直接直さず、先にdiscussionへ渡すgateを追加する。 |
    | `facilitate-discussion/SKILL.md` consumerからの適用条件 | consumerが上記eventを渡した場合、修正済みの事後報告としてではなく、編集前の事象・feedbackとして既存の新規論点またはiterationへroutingすることを明記する。facilitation ownershipは変更しない。 |
    | `facilitate-discussion/templates/discussion_entry.md` | 構造変更なし。現行の`起点となった原文`、事象、原因、提案、検証、iteration、決定、ネクストアクションで記録できる。 |
    | `think-through/SKILL.md` | 変更しない。 |
  - 今回の事象へ適用した場合:
    1. `design.md`が合意なく薄くなったという指摘を受けた時点で、consumerは修復編集を止める。
    2. 指摘原文、縮退した事象、function migrationを無視した原因、source-firstで修復する提案をdiscussionへ保存する。
    3. ユーザーの指示で方針が一意なら、そのdecisionとネクストアクションまで保存する。
    4. その後にだけ`design.md`、prototype、migration ledgerを修復する。
    5. 修復中に別の認識齟齬が判明したら、その成果物を勝手に追加修正せず、次のeventとして再びdiscussion gateへ戻す。

##### 検証

- **観点**: discussionに挙がらないまま勝手に直すことを防ぐか。
- **結果**: 防ぐ。記録対象eventと成果物編集の間にhard gateが入り、discussionへの保存が編集の前提になる。
- **観点**: この変更で無用な事後記録processが増えないか。
- **結果**: 増えない。提案1の`適用状態`、`適用結果event`、適用後の再呼出しは採用しない。
- **観点**: facilitatorの提案能力を維持するか。
- **結果**: 維持する。consumerはeventを編集前に渡し、その後の原因追跡、提案、検証、routing、合意は現行どおり`facilitate-discussion`が所有する。
- **弱点**: ユーザーが即時修正を求めた場合でもdiscussion fileへの先行保存が一回入る。ただし、修正方針が一意なら再合意を挟まず記録後すぐ編集できる。

#### イテレーション3

**受領したfeedback:**
> 「議論がdiscussionに挙がらずに勝手に直されたこと」の問題は「議論に挙がらないこと」。「勝手に」を字義から重く捉えているけど、今回の件も、別に相談されて合意しているから勝手じゃない。議論に残さずにファイル変更に走ったから問題だった

##### 検証

- **観点**: 提案2は問題を「議論の記録欠落」として扱っているか。
- **結果**: 扱っていない。`勝手に`を無断変更の意味へ過剰解釈し、編集権限を止めるhard gateへ変質させている。
- **観点**: 今回、変更方針への合意はなかったのか。
- **結果**: 合意はあった。ユーザーと相談し、`design.md`とprototypeをsource-firstで修復する方針を確認していた。欠けたのは合意ではなく、その相談と合意をdiscussionへ収録する処理である。

##### 論点routingの判断

- **discussion scopeへ属する理由**: 合意前だけでなく、chat上ですでに合意された議論もdiscussionへ残すかは、discussionを議論の記録として成立させるための中心decisionである。
- **同一decision scopeとしてiterationを継続する理由**: 提案2の編集前gateから権限制御を除き、記録対象と記録variantの不足へ修正するfeedbackである。

##### 修正先の判断

- **診断levelへの遡及**: 根本原因を「consumerが合意なく編集できること」とした診断を撤回する。根本原因は、現行contractが未決の議論をfacilitateする経路を中心にしており、chatですでに相談・合意まで済んだ議論を、後続処理の前に同じ厚みで記録する経路が明示されていないことである。

##### 根本原因3 + 提案3

- **根本原因3**: consumerは、未決の質問や複数往復が必要なdecisionでは`facilitate-discussion`を起動する一方、chat上で修正方針まで合意済みになったeventを「もうfacilitationは不要」と扱える。`facilitate-discussion`にも、合意済みの議論を再合意なしで既存topicまたは新規topicへ収録するvariantがない。そのため、合意内容は成果物へ反映されても、そこへ至った議論がdiscussionから落ちる。
- **変更点の要約**: 編集権限や適用結果の管理は増やさない。`facilitate-discussion`へ`合意済みdiscussionを記録するvariant`を追加し、consumerへ「記録価値のある議論は、未決か合意済みかにかかわらずfacilitate-discussionへ渡す」責任を追加する。
- **提案3（現時点）**:
  - 変わるruntime flow:

    ```text
    現行で今回起きたflow:
    ユーザーと修正方針を相談して合意
      → consumerが「decisionは確定済み」と判断
      → 成果物へ反映
      → discussionには相談・feedback・決定が残らない

    変更後:
    ユーザーと修正方針を相談して合意
      → consumerが合意済みdiscussionのcontextをfacilitate-discussionへ渡す
      → facilitatorが既存topicのiterationか新規topicかをrouting
      → 原文、事象、原因、提案、feedback、決定、ネクストアクションを保存
      → すでに合意済みなので再度の合意確認はしない
      → consumerが成果物反映などのネクストアクションへ進む
    ```
  - `合意済みdiscussionを記録するvariant`の入力:
    - discussion fileとdiscussion目的。
    - 記録されていない発言の原文。
    - その発言までに相談した事象、原因、提案、feedback。
    - chat上で合意済みになったdecision。
    - decisionから生じる具体的なネクストアクション。
  - facilitatorの動作:
    1. 既存decisionの修正なら同じ論点の新しいiteration、別decisionなら新規論点へroutingする。
    2. chatの結論だけを薄く転記せず、合意に至った事象、原因、提案、feedback、検証を、会話から確認できる範囲でself-containedに保存する。
    3. 原文と合意済みdecisionを明示し、status、`決定`、`ネクストアクション`まで同じ処理で確定する。
    4. すでに成立した合意を取り直さない。記録内容に判断を追加する必要が生じた場合だけ、その追加部分を現在案として合意対象にする。
    5. 保存した論点とdecisionをconsumerへ返し、後続処理へ進ませる。
  - consumerが必ず渡す議論:
    - 認識齟齬、設計への指摘、既存成果物の不備について、原因または修正方針まで話したもの。
    - 合意済みdesign、提案、decisionを修正または再評価したもの。
    - 具体ケースからdocs、skill、processの不備へ原因を引き上げたもの。
    - 後続の`design.md`、prototype、docs、skill変更の理由になるもの。
  - discussion記録を要しないもの:
    - 新しい判断や理由を含まない、保存済みdecisionの機械的な反映作業。
    - 意味を変えない誤字、format、linkの機械的修正だけで、議論が発生していないもの。
  - source fileごとの具体差分:

    | file / 現行箇所 | 変更後 |
    | --- | --- |
    | `facilitate-discussion/SKILL.md` 起動条件 | 未決decisionのfacilitationに加え、consumerが渡す`合意済みdiscussionの記録`を起動variantとして追加する。 |
    | 同 ownership | facilitatorが、合意済みdiscussionについても論点routing、self-containedな構造化、履歴保存を所有すると明記する。 |
    | 同 procedure | 再合意を求めず、既存topicへのiterationまたは新規topicを作り、`決定`と`ネクストアクション`まで保存するprocedureを追加する。 |
    | `facilitate-discussion/templates/discussion_entry.md` | 構造変更なし。現行骨格を合意済みdiscussionにも使う。 |
    | `task-design/SKILL.md` §4とStep 3 | 記録価値のある議論は、未決時だけでなくchat上で合意済みになった場合も`facilitate-discussion`へ渡す。記録後は再合意を待たず、決定の反映へ進む。 |
    | `steering/SKILL.md` discussionの契約 | steering固有の記録価値ある議論についても同じ責任を追加する。 |
    | `think-through/SKILL.md` | 変更しない。 |
  - 今回の事象へ適用した場合:
    1. `design.md`が薄くなったという指摘、移行元の意図が落ちた原因、source-firstで修復する方針を、合意済みdiscussionとしてfacilitatorへ渡す。
    2. facilitatorが論点4または適切な新規論点へ、原文、原因、修復案、合意済みdecision、ネクストアクションを保存する。
    3. 合意は済んでいるため、同じ方針への確認質問は挟まない。
    4. consumerが`design.md`、prototype、migration ledgerの修復へ進む。

##### 検証

- **観点**: 今回の問題を直接防ぐか。
- **結果**: 防ぐ。合意済みであることを理由にdiscussion記録を省略できなくなる。
- **観点**: 変更権限や合意手順を不必要に重くしないか。
- **結果**: 重くしない。合意済みdiscussionは記録後にそのまま後続処理へ進み、再合意を要求しない。
- **観点**: 議論が結論だけの薄い記録にならないか。
- **結果**: 現行templateとfacilitator ownershipを維持し、原文、事象、原因、提案、feedback、検証、決定をself-containedに保存する。
- **弱点**: consumerが「記録価値のある議論」を見落とす余地は残る。そのため、成果物変更の理由になった会話は必須対象と明示し、task-designとsteering双方のcompletion checkでも未収録の議論がないか確認する。

#### イテレーション4

**受領したfeedback:**
> 総論は合意だけど、「source fileごとの具体差分」で並んでるものの意味がわからない。facilitate-discussionでテーマについて起こった議論の反映という、テーマについて委託されたスキルの話だからfaciliate-discussion内で閉じるはずなのに、なぜtask-design, steeringの修正が挙がるの？ 記述の多重管理にもなる。

##### 検証

- **合意された総論**: 合意済みであることを理由に、テーマ内で起きた記録価値のある議論をdiscussionから落としてはいけない。再合意は不要で、議論を収録して後続処理へ進む。
- **未合意の実装方針**: 提案3は、記録対象の判定とfacilitatorへの受渡しを`task-design`、`steering`にも書き、同じ責任をconsumerへ分散した。
- **観点**: 提案3のsource配置はownerと一致するか。
- **結果**: 一致しない。テーマ内の議論を検出し、既存topicか新規topicかをroutingし、記録するownerは`facilitate-discussion`である。consumerへ同じ判定条件を書くと、起動元ごとに記録範囲がずれ、記述が多重管理になる。

##### 論点routingの判断

- **discussion scopeへ属する理由**: 総論を変えず、その責任をどのskillへ置くかを修正するfeedbackであり、論点5の実装ownerに関する判断である。
- **同一decision scopeとしてiterationを継続する理由**: 合意済みdiscussionを欠落させないという目的は維持し、提案3のsource配置だけを修正する。

##### 修正先の判断

- **提案levelへの修正**: 根本原因3の「合意済み議論を収録する経路がない」は維持する。ただしconsumerが再委託するvariantという設計を撤回し、テーマの委託期間中に`facilitate-discussion`自身が継続して同期する責任へ置き換える。

##### 根本原因4 + 提案4

- **根本原因4**: 提案3は、`facilitate-discussion`への委託を「未決decisionを一回処理して返す呼出し」と捉え、合意済み議論が生じるたびにconsumerが記録対象を再判定して渡す設計にした。しかし、テーマについて起きた議論の記録を委託された時点で、そのテーマ内の会話をdiscussionへ同期するownerは`facilitate-discussion`である。eventごとの再委託をconsumer責任にすると、ownerが分裂する。
- **変更点の要約**: 変更するsourceは`facilitate-discussion/SKILL.md`だけとする。テーマ内の各turnで、controlをconsumerへ返す前に未収録の議論がないかを確認し、未決なら現在案、合意済みならdecisionとしてdiscussionへ同期するhandoff前gateを追加する。template、`task-design`、`steering`、`think-through`は変更しない。
- **提案4（現時点）**:
  - ownership:
    - consumerはdiscussionのテーマ、discussion file、固有contextを最初に委託する。
    - 委託後、そのテーマに属する発言の記録価値判定、論点routing、構造化、保存、合意済みdecisionの反映は`facilitate-discussion`が単独で所有する。
    - consumerは、記録条件、合意済みdiscussionの判定、未収録checkを再定義しない。
  - 変わるruntime flow:

    ```text
    現行で今回起きたflow:
    facilitate-discussionが一つの提案・decisionを処理して返す
      → 同じテーマの会話で追加の指摘・相談・合意が発生
      → 成果物変更へ進む
      → 追加の議論がdiscussionに同期されない

    変更後:
    facilitate-discussionへテーマとdiscussion fileを委託
      → テーマ内の指摘・相談・提案・feedback・合意をfacilitatorが扱う
      → 各turnでconsumerへcontrolを返す前にdiscussionとの差分を確認
      → 未収録の議論を既存topicのiterationまたは新規topicへroutingして保存
      → 合意済みなら再合意せずdecisionまで保存
      → 未収録がない状態でconsumerへcontrolを返す
    ```
  - `facilitate-discussion/SKILL.md`へ追加するcontract:
    1. **委託scopeの継続**: discussion fileとテーマを受け取った後、そのテーマのdiscussionが終了するまで、発言ごとに記録ownerをconsumerへ戻さない。
    2. **turn差分の収集**: 前回のfile保存以降にテーマ内で発生した、事象、原因、提案、反論、訂正、合意を確認する。
    3. **既存routingの再利用**: 同じdecisionならiteration、別decisionなら新規topicとする現行routingを使う。合意済みdiscussion専用のrouting規則を別管理しない。
    4. **合意済みdiscussionの保存**: chatでdecisionが成立済みなら、原文と変遷を保存し、`決定`と`ネクストアクション`まで確定する。同じ合意を取り直さない。
    5. **handoff前gate**: consumerへdecisionやネクストアクションを返す前に、委託scope内の未収録議論がないことを確認する。あれば保存してから返す。
    6. **記録の厚み**: 結論だけの追記にせず、現行の事象、原因、完全な提案、検証、feedback、routing、iterationの骨格を維持する。
  - 変更するsource:
    - `facilitate-discussion/SKILL.md`だけを変更する。ownershipへ委託scopeの継続、procedureへturn差分の同期、完了条件へhandoff前gate、合意済みdiscussionを再合意なしで保存する分岐を追加する。
    - templateを含む他fileは変更しない。consumer skillへ記録条件や同期手順を記述しない。
  - 今回の事象へ適用した場合:
    1. task-designのテーマと`task-design-discussion.md`を委託された`facilitate-discussion`が、`design.md`縮退への指摘とsource-first修復の相談を同じ委託scopeの議論として検出する。
    2. 論点4のfeedbackまたは別論点へroutingし、指摘原文、原因、提案、合意済みdecision、ネクストアクションを保存する。
    3. 合意は成立済みなので再確認せず、未収録がないことを確認してconsumerへ返す。
    4. consumerは返されたネクストアクションとして成果物修復へ進む。記録対象の判定規則はconsumer側に持たない。

##### 検証

- **観点**: 責任が`facilitate-discussion`内で閉じるか。
- **結果**: 閉じる。記録価値判定、routing、保存、handoff前checkを一つのskillが所有する。
- **観点**: `task-design`と`steering`に記述が多重管理されないか。
- **結果**: されない。両skillは変更せず、既存の委託contextだけを使う。
- **観点**: 合意済み議論の記録漏れを防ぐか。
- **結果**: 防ぐ。handoff前gateは未決か合意済みかではなく、委託scope内に未収録の議論があるかで判定する。
- **弱点**: `facilitate-discussion`の委託scope終了条件が曖昧だと、どこまでの会話を同期するかが揺れる。prototypeでは「consumerへdecisionを返した瞬間」ではなく「委託されたテーマのdiscussion終了」をscope終端として具体化する必要がある。

#### イテレーション5

**受領したfeedback:**
> 良いと思う。基本的にはdiscussionの記録から始める。できれば忘れない仕組みを整えたいけど、仮に、合意後のファイルやdesign.md変更を行っちゃった後に、いけねってなって事後記述でも構わないって感じ。そのときには最終結論のスナップショットだけでなく、議論の再現をしてほしいって感じ。

##### 検証

- **合意された内容**: 記録ownerを`facilitate-discussion`に閉じ、基本経路ではdiscussionへの記録を成果物反映より先に行う。
- **追加された条件**: handoff前gateを絶対条件として事後回復を禁止しない。記録漏れへ後から気づいた場合は事後記述を許容するが、最終結論だけの追記では不十分とする。
- **観点**: 提案4だけで、記録忘れから完全に回復できるか。
- **結果**: できない。提案4は忘れないための予防だけを定義し、予防をすり抜けた後の復元範囲と記録方法を持たない。

##### 論点routingの判断

- **discussion scopeへ属する理由**: 記録漏れを予防する責任と、漏れた場合にdiscussionをどう完全な状態へ戻すかは、同じ記録完全性のdecisionである。
- **同一decision scopeとしてiterationを継続する理由**: 提案4のownerと基本経路を維持し、事後回復fallbackを追加するfeedbackである。

##### 修正先の判断

- **提案levelへの修正**: 根本原因4と`facilitate-discussion`単独ownerは維持する。handoff前gateを予防経路と位置づけ、事後に記録漏れを検出した場合のreconstruction procedureを同じskillへ追加する。

##### 根本原因5 + 提案5

- **根本原因5**: 提案4は「返却前に必ず同期する」という予防だけを定義し、実際に同期を忘れて成果物反映へ進んだ後の回復方法を定義していない。fallbackがなければ、漏れに気づいても結論だけを追記して帳尻を合わせ、議論の変遷が失われる。
- **提案5（現時点）**:
  - ownerとsource配置は提案4を維持する。変更するsourceは`facilitate-discussion/SKILL.md`だけであり、consumer skillとtemplateは変更しない。
  - 基本経路:
    1. テーマ内の議論が起きたら、`facilitate-discussion`が原文、事象、原因、提案、feedback、検証、決定をdiscussionへ同期する。
    2. 合意済みなら再合意を求めずdecisionまで保存する。
    3. 未収録がないことを確認してから、成果物反映等のネクストアクションへhandoffする。
  - 記録漏れを忘れにくくする仕組み:
    - 各turnのhandoff前に、前回保存以降の発言とdiscussion fileを照合する。
    - 成果物変更のネクストアクションを返す場合は、その変更理由になった議論が既存topicまたは新規topicへ保存済みかを確認する。
    - `決定`だけでなく、そのdecisionへ至る原文・提案・feedbackが同じ論点から追えることを完了条件にする。
  - 事後回復fallback:
    1. 成果物反映後に未収録の議論へ気づいた時点で、通常の次論点へ進む前にreconstructionへ入る。
    2. chat履歴、変更前後の成果物、保存済みdiscussion、実際の変更差分を照合する。
    3. 元の時系列に沿って、起点となった発言、当初案、ユーザーfeedback、誤っていた認識、提案の修正、合意したdecisionを再構成する。
    4. 既存decisionの修正ならiteration、別decisionなら新規topicへ、現行routing規則で保存する。
    5. `事後記録`であること、記録漏れに気づいた契機、すでに反映済みの成果物を明記する。あたかも反映前に記録していたように履歴を偽装しない。
    6. 最終結論だけのスナップショット、変更file一覧だけ、反省文だけで完了扱いにしない。
  - reconstructionで必ず復元するもの:

    | 復元対象 | 内容 |
    | --- | --- |
    | 起点 | 記録されなかったユーザー発言または問題発見 |
    | 当初認識 | facilitatorまたはconsumerが最初にどう理解したか |
    | 当初提案 | 最初に提示・実行しようとした案 |
    | feedback | 何をどう指摘され、どの認識が変わったか |
    | 修正過程 | 原因・提案・routingをどう修正したか |
    | 合意 | 最終的に合意したdecisionとその範囲 |
    | 事後状態 | すでに変更した成果物と、decisionとの対応 |
  - 今回の事象へ適用した場合:
    - `design.md`とprototypeを修復した後に記録漏れへ気づいても、論点4の最終decisionだけを追記しない。
    - 薄いprototypeを移行完了と誤認した当初認識、ユーザーの具体的指摘、function migrationへの遡及、source-first修復案、合意、すでに行った修復までを時系列で再現する。

##### 検証

- **観点**: 記録を忘れにくくするか。
- **結果**: handoff前の会話差分照合と、変更理由の保存確認により予防する。
- **観点**: 予防をすり抜けた場合に回復できるか。
- **結果**: 事後記録を許容し、chat履歴と成果物差分から議論の変遷をreconstructionする。
- **観点**: 事後記録が結論だけの薄い追記にならないか。
- **結果**: 復元対象を起点から事後状態まで定め、スナップショットだけでは完了できない。
- **観点**: ownerや記述が再び分散しないか。
- **結果**: 予防も事後回復も`facilitate-discussion/SKILL.md`だけが所有する。
- **弱点**: chat履歴や変更前状態が失われると完全再現できない。その場合は確認できた事実と推定を分離し、欠落範囲を明記して、事実でない内容を補完しない。

**決定:** イテレーション5の提案5を採用する。テーマ内の議論をdiscussionへ同期する責任は`facilitate-discussion`が単独で所有する。基本は成果物反映より前に、原文、事象、原因、提案、feedback、検証、decisionを保存する。記録漏れへ事後に気づいた場合も回復を許容するが、最終結論だけを追記せず、当初認識、当初提案、feedback、修正過程、合意、反映済み成果物まで時系列で再構成し、事後記録であることを明示する。変更対象は`facilitate-discussion/SKILL.md`だけとし、consumer skillとtemplateへ同じ責任を重複記載しない。

**ネクストアクション:** 提案5が合意されたら、同じsteering directoryに`facilitate-discussion_prototype/`を作る。現行sourceとtemplateをbaselineとして、`SKILL.md`だけに委託scopeの継続、turn差分同期、合意済みdiscussionの保存分岐、handoff前gate、事後reconstruction procedureを追加する。通常経路と、今回のように成果物反映後に漏れへ気づくfallbackの両方をfixtureで検証する。

#### イテレーション6

**受領したfeedback:**
> なんで複製したか理解できない。即時反映マターじゃない？ 依存関係あるの？

##### 検証

- **観点**: 論点5のproduction反映は、他の未決decisionまたはfile間contractへ依存するか。
- **結果**: 依存しない。変更ownerは`facilitate-discussion/SKILL.md`だけで閉じ、templateとconsumer skillを変更しないことまで合意済みである。
- **観点**: prototypeで比較しなければ整合性を確認できないか。
- **結果**: できる。現行sourceへ合意済みcontractだけを局所追加し、production差分とvalidationを直接確認できる。task-design template全体のような複数file migrationとは異なる。
- **誤り**: task-design templateのsource-first prototype運用を、依存のない`facilitate-discussion`単独変更へ機械的に持ち込んだ。論点3の反映時期分類を適用せず、不要な複製を作った。

##### 論点routingの判断

- **discussion scopeへ属する理由**: 合意済みdecisionをどの時点・単位で成果物へ反映するかは、論点5のネクストアクションを修正するfeedbackである。
- **同一decision scopeとしてiterationを継続する理由**: 記録contractの内容は変えず、適用先と適用時期だけをprototype経由からproduction即時反映へ修正する。

##### 修正先の判断

- **提案levelへの修正**: 提案5のcontractとsingle ownerは維持する。prototype作成という適用手段だけを撤回する。

##### 提案6

- `facilitate-discussion_prototype/`は不要な中間成果物なので撤去する。
- 合意済み提案5を`plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`へ直接反映する。
- template、`task-design`、`steering`、`think-through`は変更しない。
- production差分が、委託scopeの継続、turn差分同期、合意済みdiscussionの保存、handoff前gate、事後reconstructionだけであることを確認する。
- skill validationと、通常経路・事後回復経路のcontract読解checkを実行する。

##### 検証

- **観点**: 論点3の即時適用条件を満たすか。
- **結果**: 満たす。一論点で閉じ、他の未決decisionで要否・内容が変わらず、他fileとの同時変更を必要としない。
- **観点**: prototypeを撤去して判断根拠が失われないか。
- **結果**: 失われない。議論の変遷と合意contractはこの論点が正本であり、production差分を直接validationできる。

**決定:** 提案6を採用する。論点5は依存のない即時反映対象である。不要な`facilitate-discussion_prototype/`を撤去し、合意済みcontractを`plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`だけへ直接反映する。

**ネクストアクション:** production skillへ即時反映し、skill validationと差分確認を行う。結果をこの論点へ事後状態として記録する。

**反映結果:**

- **反映先:** `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`
- **反映内容:** 委託scopeの継続、handoff前のturn差分同期、合意済みdiscussionを再合意なしで保存するvariant、記録漏れの事後reconstruction、handoff完了gateを追加した。
- **変更しなかったfunctional source:** `facilitate-discussion/templates/discussion_entry.md`、`task-design/SKILL.md`、`steering/SKILL.md`、`think-through/SKILL.md`。
- **撤去:** 誤って作成した`.steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/facilitate-discussion_prototype/`は、production反映前に撤去した。
- **配布metadata:** 後方互換な機能追加として、保守規約に従いtumeda-dev plugin versionを`5.0.0`から`5.1.0`へ同期した。
- **validation:** skill validator成功、Markdown差分check成功、三つのplugin version宣言とmarketplace内versionの一致を確認した。
- **通常経路smoke:** chat上で合意済みのcache invalidation議論を、再合意なしで起点、原因、提案、検証、決定、ネクストアクションまで新規discussionへ保存できた。
- **事後回復smoke:** 変更済み`design.md`を持つfixtureで、当初案、stale指摘、原因診断、修正案、合意、反映済み状態、確認不能範囲を事後記録として再構成できた。
- **decisionとの差分:** なし。prototypeを経由せずproductionへ即時反映する提案6どおりに完了した。

## 論点6: task-design内変更状態の正本をdesign.md付録へ置く

**ステータス:** 決定

**種別:** 設計判断

**起点となった原文:**
> だから、design.md時点でtasklistで対応するもののリスティングはしなきゃかもね

> ステアリング開始からステアリング終了時までの差分が乗るようになれば、整合性つくかな

**先行decision:** 論点1でexecution plan対象一覧を`design.md`へ置くこと、論点3でtask-design内反映待ちをexecution planへ載せずtask-designが解消することまでは決定した。反映待ち状態をどのartifactで管理するかは意図的に保留した。

### 現在の合意対象

**参照する現在案:** 根本原因0 + 提案0

**今回確認すること:** discussion decisionから生じる対象成果物変更の状態は、別のstate fileを増やさず`design.md`の付録を正本とするか。完成後の姿は引き続きtask-design全体で一つだけ持ち、付録は対象ごとの完成後の姿ではなく、開始時から終了時までの差分を適用ownerと状態へroutingする索引として扱う。

### 議論の変遷

#### 事象と制約

- `design.md`本文は、task-design全体で一つの完成後の姿と、その姿に至る設計根拠を持つ。
- `task-design-discussion.md`は、提案、feedback、旧案、合意へ至る変遷の正本であり、変更適用状態の正本ではない。
- `tasklist.md | roadmap.md`はexecution plan対象だけを実行する。task-design内反映待ちを載せると、tasklistをほぼコーディングへ限定する方針が崩れる。
- 一方、反映済み、反映待ち、execution plan対象をsession内だけで管理すると、依存解消時の再分類とplan作成gateを検証できない。
- 別のstate fileを作ると、`design.md`のexecution plan対象一覧との間で同じ変更候補を二重管理することになる。

#### 根本原因0 + 提案0

- **根本原因0:** 完成後の姿を記述する設計情報と、decisionから生じた変更を誰がいつ適用するかというrouting stateを区別した一方、そのrouting stateを一つの正本へ集約する場所を決めていない。そのため、`design.md`を純粋な完成後記述だけに限定すると別fileが必要になり、逆に区別せず本文へ混ぜると対象ごとの作業状態が完成後の姿に見えてしまう。
- **提案0（現時点）:** `design.md`末尾の`（付録）変更の実行区分`を、task-design中のrouting stateと終了時の差分証跡の単一正本にする。本文の完成後の姿とはsectionを分け、別artifactを作らない。

##### 付録が持つ区分

1. **task-design内で対象成果物へ適用済み**
   - fieldは`対象`、`反映内容`、`validation結果`、`参照するdesign section`とする。
   - discussionで合意した一般則や完成後の姿を対象成果物へ適用し、実測validationまで終わったものだけを載せる。
2. **task-design内の対象成果物反映待ち**
   - fieldは`対象`、`待つ理由`、`依存decision`、`参照するdesign section`とする。
   - execution planは不要だが、未決decisionまたはfile間contractとの整合した一括適用を待つものだけを載せる。
3. **execution plan対象**
   - 論点1の合意どおり、fieldは`対象`、`掲載理由`、`参照するdesign section`だけとする。
   - 対象ごとの完成後の姿、task手順、validation詳細を持たせない。tasklistまたはroadmapはこの索引だけでなく`design.md`全体を読む。
4. **分類保留**
   - 設計中だけ持てるtemporaryなTBDであり、fieldは`変更候補`、`保留理由`、`分類を確定するdecision`とする。
   - design合意前にzeroにし、完成版ではsection自体を削除する。

##### lifecycleと完了gate

- discussion decisionが確定したら、まず`分類保留`、`task-design内反映待ち`、`execution plan対象`のいずれかへ記録する。独立して即時反映できる場合は、適用・validation後に直接`適用済み`へ記録してよい。
- 依存decisionが確定したら反映待ちを再評価し、適用・validationして`適用済み`へ移す。待っていた時間や複数stepであることだけを理由にexecution plan対象へ移さない。
- design合意時は`分類保留`がzeroでなければならない。execution plan作成gateへ進む前は`task-design内反映待ち`もzeroでなければならない。
- task-design完了時も`適用済み`と`execution plan対象`は差分証跡として残す。該当なしなら見出しを残して`なし`と書き、未確認なのかzeroなのかを区別する。
- `design.md`と`task-design-discussion.md`をdecision記録のために更新したこと自体は、自己参照になるため適用済み一覧へ載せない。spikeも対象成果物変更ではなく設計根拠であり、検証結果をdesign本文へ記録するだけとする。

##### artifact境界

- routing state専用の新規fileは作らない。
- discussionには、なぜそのdecisionと分類になったかの議論を残す。`design.md`付録には現在stateと終了時の確定差分を残し、同じ議論を複製しない。
- tasklistとroadmapにはexecution plan対象を具体化した実行内容だけを置く。task-design内の適用済み・反映待ちを複製しない。
- 後続のplanなしresultは、変更一覧をresult payloadへ複製せず、`design_path`を返してこの付録を検証できるようにする。result名とcallerの終了gateは次の独立decisionで決める。

##### 検証

- **観点:** execution plan対象ごとに完成後の姿を持つ構造へ戻らないか。
- **結果:** 付録はrouting索引だけで、完成後の姿は`design.md`本文に一つだけ残る。execution plan対象のfieldも論点1の三つから増やさない。
- **観点:** `design.md`が一時的な実行stateで汚れないか。
- **結果:** 分類保留は完成前に削除し、反映待ちはplan gate前にzeroにする。完成版に残るのは、実際に適用済みの差分とexecution planへ渡した確定scopeだけである。
- **観点:** 別fileとの同期ずれを防げるか。
- **結果:** routing stateを`design.md`付録へ集約し、discussionは理由の履歴、planは実行内容という既存owner境界を維持する。
- **弱点:** `design.md`本文だけを完成後仕様として読みたい場合、付録の運用情報が長くなる。付録を末尾に隔離し、本文sectionから参照するだけにして、完成後の姿へ混在させないことで抑える。

**決定:** 提案0を採用する。discussion decisionから生じる対象成果物変更のrouting stateは`design.md`末尾の`（付録）変更の実行区分`を単一正本とし、別のstate fileを作らない。付録は対象ごとの完成後の姿ではなく、開始時から終了時までの差分を`適用済み`、`反映待ち`、`execution plan対象`、設計中だけの`分類保留`へroutingする索引である。design合意前に分類保留をzero、execution plan作成gate前に反映待ちをzeroにし、完了時は適用済みとexecution plan対象を確定差分として残す。

**ネクストアクション:** `design.md`とprototype templateの付録を確定形へ即時更新し、task-design内反映待ちの恒久配置に関するTBDを解消する。その後、planなし完了resultとsteering routeを別論点として設計する。

**反映結果:**

- **design反映:** `design.md`の3-3で`（付録）変更の実行区分`をrouting stateの単一正本と確定し、別state fileを作らないこと、分類保留と反映待ちのzero gate、完了時に確定差分を残すことを記録した。
- **現在stateの移行:** `design.md`付録を合意したfieldのtableへ揃え、適用済み、反映待ち、execution plan対象、分類保留を同じ正本上で更新した。恒久配置に関するTBDは削除した。
- **prototype反映:** `task-design_template_prototype/templates/design.md`へ、単一正本の説明、適用済みのdesign section参照、該当なしの明示、反映待ちzero gate、execution plan対象の完了時保持、分類保留の削除gateを追加した。
- **migration記録:** `function-migration-ledger.md`へA-011を追加し、旧templateの変更点一覧からprototype付録へのmappingと合意済み変更件数を更新した。
- **validation:** `git diff --check`に成功し、`design.md`とprototypeから「配置未決」「別artifactとの選択」「候補block」という旧TBDが消えていることを確認した。
- **`doc-enricher` review:** root `README.md`、skills README、documentation standards、function migration policyの既存ownerを確認した。今回の知識はrepository固有の設計意図ではなくtask-designのtemplate contractであり、skills READMEも個別skillの詳細を載せないため、README／既存docsへの提案候補はなしと判定した。
- **production反映:** なし。task-design production templateは他の未決workflowと整合させるmigration batchの反映待ちであり、今回は完成後の姿であるprototypeとtask内正本だけを更新した。
- **decisionとの差分:** なし。

## 論点7: execution plan対象がないtask-designをplanless_completeで終了する

**ステータス:** 決定

**種別:** caller／consumer contract

**起点となった原文:**
> 条件に合致した時のみタスクリストを作る、または載せると言う運用にしたい。

> 基本的にはコーディング。作業が単発で終わらず、段階を踏まざるを得ないようなタスクも、タスクリスト行き。あとは、ユーザが指定した時。

**先行decision:** 論点1でexecution planの作成条件、論点3でtask-design内反映待ち、論点6で変更routing stateの正本を`design.md`付録へ置くことが決定した。execution plan対象一覧が空の時にtask-designとsteeringがどう終了するかだけが未決である。

### 現在の合意対象

**参照する現在案:** 根本原因0 + 提案0

**今回確認すること:** task-designはexecution plan対象がzeroなら`tasklist.md`も`roadmap.md`も作らず、第三の排他的result `planless_complete`を返すか。steeringは同じ終了前safety gateを通すが、実行開始確認とdispatchを行わず完了するか。子steeringと月次summaryもこのrouteを完了として扱えるようにするか。

### 議論の変遷

#### 事象と制約

- 現行task-designはdesign合意後に必ずleaf／compositeを判定し、`tasklist_ready | roadmap_ready`のどちらかを返す。
- 現行steeringはその二resultだけを検証し、plan合意後gate、実行開始確認、dispatchへ進む。
- execution plan対象が空でも既存resultへ合わせると、空または不要なtasklistを作るか、planがないのに`tasklist_ready`を偽ることになる。
- task-design中に直接適用する変更のstateとvalidationは、論点6により`design.md`付録が正本である。result payloadへ同じ一覧を複製すると同期元が増える。
- steering終了時の`doc-enricher`と再発防止reviewは、論点2でdecision単位reviewとは別のtheme横断safety netとして維持すると決定している。

#### 根本原因0 + 提案0

- **根本原因0:** 現行caller／consumer contractが「task-designの完了 = 合意済みexecution planをdispatch可能」の一経路だけを前提にしており、designとtask-design内変更だけでscopeが完了する状態を表すresult identityと終了routeを持たない。
- **提案0（現時点）:** `tasklist_ready | roadmap_ready | planless_complete`を排他的なtask-design result unionとする。`planless_complete`は「plan作成を省略した途中状態」ではなく、execution plan対象がなく、task-designが所有する変更とvalidationまで完了したtask-designの終了resultとする。

##### task-designの完了gate

task-designは次をすべて満たした場合だけ`planless_complete`を返す。

1. `design.md`が自然言語で合意済みで、既存のdesign completion gateをすべて満たす。
2. `design.md`付録の`分類保留`が存在せず、`task-design内の対象成果物反映待ち`が`なし`である。
3. `task-design内で対象成果物へ適用済み`の各行にvalidation結果と参照するdesign sectionがある。対象変更がなければ`なし`と明記されている。
4. `execution plan対象`が`なし`である。コーディング、実行時に段階を踏む作業、ユーザー指定のplan対象が一件でもあれば、このresultを返さない。
5. `tasklist.md`と`roadmap.md`がどちらも存在しない。
6. 未解消feedback、TBD、実行者へ残した判断がない。

design review時は本文の要点だけでなく、`execution plan対象: なし`でありtasklist／roadmapを作らず完了する分類を明示して、同じdesign合意に含める。planなし分類だけを隠して合意済みと扱わない。一方、design合意後に空planへの二度目の承認は求めない。

既存planがあるtaskを再設計してexecution plan対象zeroになった場合、そのplan fileを黙って残したまま`planless_complete`を返さない。planが新designと不要になった理由と撤去をdiscussionで合意し、安全に解消した後だけ完了gateを通す。

##### result contract

```text
result=planless_complete
working_dir=<absolute path>
design_path=<absolute path>
```

- 適用済み変更、validation、execution plan対象zeroの証拠は`design_path`が指す付録を正本とし、resultへ複製しない。
- `tasklist_path`、`roadmap_path`、架空のplan pathを返さない。
- `tasklist_ready`と`roadmap_ready`の名称、field、意味は変更しない。

##### steeringの検証と終了route

steeringはStep 3で`planless_complete`を受けた場合、次だけをidentity／state検証する。設計内容を重複reviewしない。

- `working_dir`と`design_path`がcanonical steering rootを指す。
- siblingの`tasklist.md`と`roadmap.md`が存在しない。
- `design.md`付録で分類保留がなく、反映待ちとexecution plan対象が`なし`である。
- 適用済み行がある場合はvalidation結果とdesign section参照が欠けていない。

検証後は、現行のplan合意後gateを三result共通の`task-design ready result後の必須gate`へ一般化し、次を実行する。

1. `doc-enricher`をtheme横断の最終safety netとして提案modeで起動し、decision単位でreview済みの候補を重複提案しない。
2. discussionを元に再発防止先をreviewする。論点2で一般則へ処理済みのoriginは結果を確認するだけとし、漏れだけを扱う。
3. steering skill自身の変更要否を確認する。
4. gate中に新しいdecisionまたは対象成果物変更が生じたら、`facilitate-discussion`で記録し、task-designへ戻す必要とrouting stateを再評価する。

`planless_complete`では実行するplanがないため、実行開始確認を行わずtasklist-executorも子steeringもdispatchしない。gate完了後、`design_path`、適用済み変更とvalidationの要約、execution planを作らなかった理由、最終review結果をユーザーへ示してsteeringを完了する。chat上の要約は正本ではなく、詳細は`design.md`付録を参照する。

##### 子steeringと月次summary

- roadmap phaseの子steeringが`planless_complete`で終了した場合も、その子scopeのdesign、直接反映、validation、終了前gateが完了しているため、親steeringは通常の子完了としてphaseのstatusと完了日を更新できる。planがないことを未完了扱いしない。
- 前月summary生成時にtasklistとroadmapがどちらもないsteeringは、`design.md`付録で分類保留sectionがなく、反映待ちが`なし`、execution plan対象が`なし`なら`完了`と判定する。いずれかを確認できなければ`不明`とし、推測で完了にしない。
- summaryへresult種別や変更一覧を追加せず、既存のslug、概要、statusだけを維持する。

##### source owner

- `task-design/SKILL.md`はexecution plan対象zeroの判定、`planless_complete`の生成、返却gateを所有する。
- `steering/SKILL.md`はresult identity検証、共通終了前gate、planless時の非dispatch、子phase完了伝播、月次summary判定を所有する。
- `design.md` templateはrouting stateの正本を所有するが、result名やsteeringのphase制御を持たない。
- `tasklist-executor`、tasklist template、roadmap templateへplanなしrouteを記載しない。実行対象がないためconsumerではない。

##### 検証

- **観点:** 「tasklistを作らない」がtask-design未完了と混同されないか。
- **結果:** `planless_complete`はdesign合意、routing state zero、直接反映validation、plan file非存在まで満たす完了resultであり、省略や中断を表さない。
- **観点:** 空tasklistまたは架空pathが作られないか。
- **結果:** result identityを第三variantに分け、plan file非存在をtask-designとsteeringの両方で検証する。
- **観点:** planなしだけ終了前reviewを免れないか。
- **結果:** 三result共通の必須gateへ一般化し、実行開始確認とdispatchだけをplanless routeから除外する。
- **観点:** resultに変更一覧を複製して多重管理にならないか。
- **結果:** resultは`working_dir`と`design_path`だけを返し、変更・validation・分類の正本を論点6で決めた付録に限定する。
- **観点:** 子roadmapと月次summaryでplanなしが未完了または不明にならないか。
- **結果:** 親への完了伝播と、plan非存在時の付録からのstatus導出を明示する。
- **弱点:** summary生成はMarkdownの見出しと`なし`を読むため、template contractが崩れると判定不能になる。その場合は`不明`へ安全側に倒し、結果を推測しない。

**決定:** 提案0を採用する。task-design resultを`tasklist_ready | roadmap_ready | planless_complete`の排他的unionとし、execution plan対象zero、反映待ちzero、分類保留zero、直接反映validation完了、plan file非存在を満たす場合だけ`planless_complete`を返す。steeringは三result共通の終了前safety gateを通し、planless routeでは実行開始確認とdispatchを行わず完了する。子steeringの完了伝播と月次summaryも`design.md`付録からplanless完了を判定する。

**ネクストアクション:** `design.md`とfunction migration ledgerへcaller／consumer contractを即時反映する。prototype templateは論点6で必要な永続stateをすでに表現できているか確認し、result名やsteering phase制御を重複記載しない。task-designとsteeringのproduction source変更はcomponent監査と他の未決contractを完了したmigration batchで一括反映する。

**反映結果:**

- **design反映:** Requirements、execution plan gate、steering境界、子完了伝播、前月summary判定へ`planless_complete` contractを反映した。planなしresultを未合意とする記述と分類保留を削除した。
- **result正本:** `result=planless_complete`、`working_dir`、`design_path`だけを返し、適用済み変更、validation、分類zeroの証拠は`design.md`付録を正本とする形で確定した。
- **prototype確認:** 論点6で、execution plan対象が空なら`なし`と記載してplanを作らないこと、反映待ちzero、分類保留削除、validation evidenceをすでに表現している。result名とsteering phase制御はtemplate ownerではないため追加せず、重複管理を避けた。
- **migration記録:** `function-migration-ledger.md`へA-012を追加し、task-design result、steering result検証、共通safety gate、非dispatch、子完了に関係する構造rangeとatomic contractを更新した。未合意領域と次の監査gateからplanなしrouteを削除した。
- **validation:** `git diff --check`に成功し、`design.md`とledgerからplanなしrouteの未決表現、result詳細未合意、分類保留が消えていることを確認した。prototypeに`planless_complete`が重複記載されていないことも確認した。
- **`doc-enricher` review:** root README、skills README、`doc-enricher` contract、documentation standardsを確認した。今回の内容はtask-design／steering間の共有skill contractであり、個別skill詳細をREADMEへ載せない既存方針に従ってREADME／既存docsへの候補なしと判定した。
- **production反映:** なし。task-designとsteeringを片側ずつ変更するとresult contractが破綻するため、component監査後の同一migration batchで反映する。
- **decisionとの差分:** なし。

## 論点8: 完成後の姿として独立させるoutcome sectionの境界を決める

**ステータス:** 決定

**種別:** template構造 / migration判断

**起点となった原文:**
> 何かが変更されたときに使われるテンプレートの部品が、その時に応じて差し込まれる形になると思う。

> 画面を変えるから、画面に関しての完成後の姿。データを作ったり、データの見え方が変わるから、データに関しての完成後の姿。

**先行decision:** 論点1で完成後の姿はtask-design全体で一つとし、変化対象に応じたsectionを差し込む方針が決定した。論点4でbaselineの判断能力を落とさず移すことも決定した。論点8では九sectionを`outcome-sections/`へ置き、documentationとresearch findingsを分離し、migration／rolloutを完成後sectionにしない構造まで確定した。

### 現在の合意対象

**参照する現在案:** 根本原因3 + 提案3

**今回確認すること:** directoryは`outcome-sections/`を採用する。その中で、調査の主成果だけを扱う`research-findings.md`と、暗黙知の形式知化、標準、思想、維持規律を扱う`documentation.md`を別sectionとして持つか。docsをgenericなfile deliverableやresearch findingsへ押し込まず、skillはfile deliverablesとworkflowで扱う。runtime／workflowの採用、migration／rolloutの不採用は維持する。

**今回扱わないこと:** interaction、data、public contract、screenのcomponent内にprototypeで追加された失敗case、不変条件、成功／失敗field、状態別表示tableがbaseline contractの移植か新規`ADD`かの判定。これはcomponent fileの独立性とは別decisionなので後続論点へ分ける。

### 議論の変遷

#### 事象と移行元の確認

- 旧templateの完成後の姿は、操作フロー、データモデル、命名・公開API・module境界、file成果物という四視点を持つ。task-design skillはこれに画面観点を持つため、prototypeのinteraction、data、public contracts、file deliverables、screenには既存ownerがある。
- runtime／configurationは旧file成果物観点に一部含まれるが、environmentごとの値解決、default、不足時のfail-fast／fallback、観測可能なruntime挙動はfileの内容・読者・構造だけでは表せない。
- workflowはfile種別ではなく、開始状態、owner、single writer、gate、state遷移、handoff、停止・再開、完了状態を持つsemanticな変化対象である。既存の操作フローはactorの操作、public call、data変化、観測結果を追うため、workflow owner contractとは問いが異なる。
- migration／rollout prototypeは中間状態、段階、停止点、rollback、次へ進む承認を持つ。これはsteering終了後の一断面だけでなく、そこへ至るtransitionとexecution planのphase設計を主対象にしている。
- verified facts prototypeは調査・spikeの確認方法、実測結果、適用範囲、再検証条件を持つ。これは完成後の世界の独立した変化対象ではなく、別のcomponentまたは設計判断を確定する根拠である。

#### 根本原因0 + 提案0

- **根本原因0:** prototype作成時に「design.mdへ必要な情報」と「完成後の姿へ差し込む独立component」を同一視した。そのため、変化対象であるruntimeやworkflowと、transitionを設計するmigration、設計根拠であるverified factsが同じcatalog levelへ並んだ。
- **提案0（現時点）:** 完成後の姿componentは次の四条件をすべて満たすものだけ独立させる。
  1. steering終了時に成立する世界の、観測可能な一つの変化対象である。
  2. 既存componentだけでは実装者へ判断を残す、固有の問い・失敗pattern・具体化方法を持つ。
  3. code、docs、skill等のfile種別を問わず、同じ意味の変化へ再利用できる。
  4. 他componentと併用してもowner境界を定められ、同じ内容の複製を前提にしない。

##### candidateへの適用

| candidate | 判定 | 理由とowner境界 |
| --- | --- | --- |
| `runtime-and-configuration.md` | 独立componentとして採用 | 値・dependencyの解決元、environment差、default、不足・不整合時の挙動という、file構造だけでは表せない完成後runtimeを持つ。runtime componentは挙動を所有し、file deliverablesは設定file自体の内容・構造・配置を所有する。両方を使う場合は参照で結び、詳細を複製しない。 |
| `workflow.md` | 独立componentとして採用 | owner、single source of truth、gate、state遷移、handoff、停止・再開という、actor操作のcall順序とは異なる完成後process contractを持つ。workflowはprocess controlを所有し、interaction flowはdomain actorからsystem反応までのcall・値・観測を所有する。 |
| `migration-and-rollout.md` | 完成後の姿componentとして不採用 | 主題が旧状態から新状態へのtransition、phase、停止点、承認、rollbackであり、execution plan設計とrisk管理に属する。終了後のdata、contract、runtime互換状態は対応componentへ置き、中間状態・互換制約はRequirements／risk、実行順・停止点・確認はtasklist／roadmapへ置く。 |
| `verified-facts.md` | 完成後の姿componentとして不採用 | 調査・spikeの事実は変化対象ではなく設計根拠である。確定した事実と影響は、それが規定するdata、contract、runtime、workflow等の該当sectionへ書き戻す。再現logは必要時の`investigation.md`または`spike/`に残し、designと二重正本にしない。 |

##### catalogの完成形

完成後の姿catalogは次の七componentを持つ。

1. `interaction-flow.md`
2. `screen.md`
3. `data.md`
4. `public-contracts.md`
5. `file-deliverables.md`
6. `runtime-and-configuration.md`
7. `workflow.md`

最低一つを変化対象から選び、一つの変更が複数の完成後観点を変える時だけ複数componentを使う。component数を増やすことや全fileを差し込むことを網羅性とみなさない。

##### prototypeへの反映方針

- catalogからmigration／rolloutとverified factsの行を削除し、対応する二fileも完成後component directoryから撤去する。履歴と不採用理由はdiscussionとmigration ledgerに残す。
- runtime componentはruntime挙動、workflow componentはprocess controlへ責務を絞る。file配置やactor interactionを重複記述するfieldは参照へ狭める。
- file deliverablesの見出しと説明から「設定・環境構築のruntime挙動までこのfileが所有する」と読める重なりを除き、file内容、読者、構造、配置のownerへ限定する。設定fileというfile成果物自体は引き続き扱える。
- tasklist-design、roadmap-design、investigation、spikeの既存contractを短縮・削除しない。migrationとverified factsをcomponentとして不採用にすることは、それらの能力を廃止する意味ではなく、正しいownerへ戻すrouting変更である。

##### 検証

- **観点:** docsやskillのようにcode以外を変えるtaskでも完成後の姿を描けるか。
- **結果:** file deliverablesで内容・構造、workflowでowner・gate・state遷移、必要ならruntimeで実行条件を選べる。固定のcode観点へ押し込まない。
- **観点:** interaction flowとworkflowが同じ順序記述を二重管理しないか。
- **結果:** interactionはdomain actorからsystem反応までのcall・値・観測、workflowはprocess owner、正本、gate、handoffを所有する。両方必要な時は主ownerへ詳細を書き、他方は関係だけ参照する。
- **観点:** migration設計と実測事実がdesignから消えないか。
- **結果:** migrationの終了状態は該当component、中間互換制約はRequirements／risk、実行phaseはplanへ分ける。実測事実は該当設計sectionへ書き戻し、再現logは既存investigation／spike ownerに残す。
- **観点:** componentが単なるfile種別一覧へ戻らないか。
- **結果:** runtimeとworkflowはfile名ではなく、終了時に変わる挙動とprocess contractで選ぶ。
- **弱点:** migrationの中間状態をRequirements／riskとplanへ分けると、移行全体を一sectionで読みたい場合に参照が増える。ただし一fileへ集約すると完成後の姿とexecution planを混同するため、designからplanへの参照関係を明示する方を優先する。

**決定:** 未決。提案0への合意待ち。

**ネクストアクション:** 合意されたら`design.md`、component catalog、runtime／workflow／file deliverables component、migration ledgerへ反映し、不採用二fileをprototypeから撤去する。その後、既存component内の追加blockをbaseline mappingで判定する。

### イテレーション1: 非code中心steeringの受け皿と章固有のdirectory名を明示する

**受領したfeedback:**
> 概ね同意だけど、verified-facts.md で扱っていたskill（これはworkflowで吸収できてる？）やdocsの修正を中心としたsteeringの場合がこの枠に吸収されて、不採用になってるから、その点だけは吸収したいかな。そして design-components という名前はこれでいいのか迷う。design.mdのcomponentではあるからといって、汎用というより、特定の章についての部品なんだから、それについての特定の名前を付けられるだろうと思ってしまうから

#### 論点routingの判断

- 非code中心steeringをどのsectionが表現するかは、完成後の姿sectionの独立条件とcatalog構成を変えるため、論点8と同じdecisionである。
- `design-components/`の命名も、これらのfileが何の部品かというowner境界を変えるため、同じtemplate構造decisionとして扱う。
- 既存section内部のfieldがbaseline移植か新規`ADD`かの判定は変わらず後続decisionへ残す。

#### 診断levelへの遡及

提案0の「verified factsは常に設計根拠であり、独立した完成後の変化対象ではない」という診断を修正する。codeやartifactを変えるtaskの途中で得た事実なら根拠だが、調査・比較・技術検証によって不確実性を解消し、検証済み知識または判断可能な状態を作ること自体がsteeringの目的なら、その事実は終了時に成立する主成果である。

skillとdocsはverified factsがownerなのではない。docsの完成後の内容・構造・読者・配置はfile deliverables、skillのsource成果物としての形もfile deliverables、skillを実行した時のowner・gate・state遷移・handoffはworkflowがownerである。提案0ではこの選択例をcatalogへ明示しなかったため、非code taskが吸収されたように読めた。

#### 根本原因1 + 提案1

- **根本原因1:** 独立sectionの判定を通常のsystem変更だけで検算し、調査自体が主成果になるtaskと、skill／docs中心taskで複数sectionを組み合わせる具体例を示していなかった。また、directoryを`design-components/`と呼んだため、`design.md`全体へ汎用的に使える部品なのか、「完成後の姿」章専用sectionなのかがpathから分からなかった。
- **提案1（修正後の完全案）:** 完成後の姿sectionの四条件は維持する。ただし「終了時の変化対象」にはsystemやartifactだけでなく、主目的だった不確実性が検証済み知識へ変わり、再現可能な根拠から判断できる状態も含める。file配置は章ownerがpathから分かる`templates/completed-world/`へ変更する。

##### directoryとcatalogの命名

```text
templates/
├── design.md
├── completed-world/
│   ├── catalog.md
│   ├── interaction-flow.md
│   ├── screen.md
│   ├── data.md
│   ├── public-contracts.md
│   ├── file-deliverables.md
│   ├── runtime-and-configuration.md
│   ├── workflow.md
│   └── verified-facts.md
├── tasklist.md
└── roadmap.md
```

- `design-components/`と`design-component-catalog.md`は使わない。
- `completed-world/`は`design.md`の`## 3. 完成後の姿`へ差し込むsectionだけを置く。Requirements、設計判断、risk、test、変更routing stateの部品を置かない。
- `catalog.md`は同directoryのsection選択だけを案内する。これにより「component」という抽象名ではなく、どの章に属するかをpathで示す。
- 本文では必要に応じて「完成後の姿section」と呼び、汎用的なdesign componentであるかのように扱わない。

##### sectionの採否

| candidate | 提案1の判定 | 選択境界 |
| --- | --- | --- |
| `runtime-and-configuration.md` | 採用 | runtime条件、environment差、default、不足・不整合時の観測可能な挙動が変わる場合。file構造はfile deliverablesへ置く。 |
| `workflow.md` | 採用 | owner、正本、gate、state遷移、handoff、停止・再開が変わる場合。actorからsystemへのdomain操作はinteraction flowへ置く。 |
| `verified-facts.md` | 条件付きで採用 | 調査、比較、技術検証によって検証済み知識を得ること自体がsteeringの主目的・受け入れ基準である場合だけ選ぶ。別の成果物を設計する途中で得た事実なら選ばず、その成果物を規定するsectionへ書き戻す。 |
| `migration-and-rollout.md` | 完成後の姿sectionとして不採用 | 終了状態は該当section、中間互換制約はRequirements／risk、実行順・停止点・確認はtasklist／roadmapへ置く。 |

##### 非code中心steeringの選択例

| steeringの中心 | MUSTで選ぶsection | 条件に応じて併用 | 完成後に描くもの |
| --- | --- | --- | --- |
| docsの新規作成・更新 | `file-deliverables.md` | `workflow.md`、`verified-facts.md` | 読者、読後の判断、見出し・entry構造、原則と具体例、配置・正本境界。docsが実行procedureを規定するならworkflowも描く。 |
| skillの新規作成・更新 | `file-deliverables.md` + `workflow.md` | `runtime-and-configuration.md`、`verified-facts.md` | `SKILL.md`の目的・構造・適用例と、起動gate、owner、状態遷移、handoff、停止・再開。host／model／tool条件が変わる場合はruntimeも描く。 |
| 調査・比較・技術検証が主成果 | `verified-facts.md` | factが規定する`runtime`、`data`、`public-contracts`等 | 未確定だった問い、確認方法・条件、実測結果、適用範囲、再検証条件、その結果から可能になった判断。 |
| codeを使わないprocess設計 | `workflow.md` | `file-deliverables.md` | owner、正本、gate、state、handoffと、それを保存するfile成果物の完成形。 |

sectionの組合せは成果物種別から機械的に全選択しない。たとえばskill変更ではfile deliverablesとworkflowが原則必要だが、既存skillの誤字だけならtask-design自体の起動対象外である。docsにprocedureがなければworkflowは選ばない。

##### verified factsの二つの使い方を混同しないgate

次を問う。

> このsteeringが終了した時の主成果は「別の対象がこの事実に基づく姿へ変わったこと」か、それとも「未確定だった問いが再現可能な事実として確定し、判断可能になったこと」か。

- 前者: verified facts sectionを選ばず、確認した事実をdata、public contract、runtime、workflow等の該当sectionへ根拠付きで書き戻す。`investigation.md`または`spike/`は再現logを持つ。
- 後者: `verified-facts.md`を選び、検証済み知識そのものを完成後の姿として記述する。単なるreading log、試行錯誤、command出力の貼付けは載せない。

##### catalogの完成形

`templates/completed-world/`は次の八sectionを持つ。

1. `interaction-flow.md`
2. `screen.md`
3. `data.md`
4. `public-contracts.md`
5. `file-deliverables.md`
6. `runtime-and-configuration.md`
7. `workflow.md`
8. `verified-facts.md`

`migration-and-rollout.md`だけを完成後の姿sectionから撤去する。移行能力はRequirements、risk、tasklist-design、roadmap-designへroutingし、削除しない。

##### 検証

- **観点:** 旧軽量モード相当の調査・skill・docs taskが完成後の姿を持てるか。
- **結果:** 調査主目的はverified facts、docsはfile deliverables、skillはfile deliverablesとworkflowをMUST mappingとして持つ。labelや例外modeへ戻さず、同じsection選択flowで扱える。
- **観点:** 通常のcode taskでspikeを行うたびverified facts sectionが増えないか。
- **結果:** 事実が主成果か別成果物の根拠かを問うgateで分け、後者は該当sectionへ書き戻す。
- **観点:** directory名から適用scopeが分かるか。
- **結果:** `completed-world/`配下へ限定し、catalogも同directoryへ置くため、`design.md`全体の汎用componentとは読めない。
- **観点:** skillのfile構造と実行workflowが二重管理されないか。
- **結果:** file deliverablesはsource成果物の読者・内容・構造・配置、workflowは実行時のowner・gate・state遷移を所有し、互いの詳細を複製しない。
- **弱点:** 調査主目的か設計途中の調査かを誤るとverified factsの選択が揺れる。受け入れ基準が「どのartifact／挙動を変えるか」ではなく「どの問いをどの条件で確定するか」になっている場合だけ主成果と判定する。

**決定:** 未決。提案1への合意待ち。

**ネクストアクション:** 提案1が合意されたら、prototypeを`templates/completed-world/`構造へ移し、catalogへ非code中心steeringの選択例とverified facts gateを反映する。`migration-and-rollout.md`だけを撤去し、runtime、workflow、file deliverablesのowner重複を修正する。`design.md`とmigration ledgerも新pathと採否へ同期する。

### イテレーション2: directory名を初見の読者基準で再評価する

**受領したfeedback:**
> 基本的にok。ただ、ディレクトリの命名についてだけ厳しくレビューして。worldというディレクトリ名は中には言ってるファイルからして適切？初見の人から見て、ひっかかりなく直感で理解可能？

#### 論点routingの判断

- directory名は提案1と同じsection群のownerとscopeを表すため、論点8のiterationとして扱う。
- sectionの採否、非code中心steeringのmapping、verified facts gateは変更せず、命名だけを遡って再検証する。

#### `completed-world/`の厳格review

**結論:** 採用しない。意味は説明すれば通るが、初見で引っかかりなく理解できる名前ではない。

- `world`は比喩的で範囲が広すぎる。architecture全体、domain model、product全体像、fixture world等にも読め、このdirectoryが`design.md`の特定章へ差し込むsection群だと分からない。
- `completed world`は英語の定型的な設計用語ではなく、「完成済みの世界」「world buildingが完了した状態」にも読める。日本語の設計思想としての「完成後の世界」を直訳した内部語彙であり、初見の利用者へ意味の翻訳を要求する。
- 中身は静的なstateだけではない。`interaction-flow.md`、`workflow.md`は動的挙動、`file-deliverables.md`は成果物、`verified-facts.md`は認識状態を扱うため、`world`という総称に入る理由をfile一覧から導けない。
- directory名に、これらが完成後の姿章へ差し込む**section**であることが出ていない。`design-components/`の汎用性は解消しても、章との構造関係は依然として暗黙である。

#### 候補比較

| candidate | 評価 | 判定理由 |
| --- | --- | --- |
| `completed-world/` | 不採用 | 内部の日本語思想の直訳で比喩的。scopeとsection性が読めない。 |
| `target-state/` | 不採用 | 設計用語としては理解しやすいが、interaction／workflowの動的挙動と、主成果であるverified factsを「state」へ押し込む。 |
| `post-change/` | 不採用 | code・artifact変更には直感的だが、調査で知識を確定するsteeringや、変更前後より新規成果を扱うtaskに合わない。section性も出ない。 |
| `design-outcomes/` | 不採用 | design processが生成したdecisionやartifactの意味にも読め、steering終了後に成立する対象側のoutcomeと紛らわしい。 |
| `outcomes/` | 次点 | 内容の共通項は表すが、template内でどう使うfileかが名前から分からない。 |
| `outcome-sections/` | 採用 | interaction、screen、data、contract、file、runtime、workflow、verified knowledgeを「完了時に成立・観測できるoutcomeの各section」として無理なく束ね、`design.md`へ差し込むsectionであることもpathから分かる。 |

#### 根本原因2 + 提案2

- **根本原因2:** 日本語で合意した思想語「完成後の世界」をそのままdirectory identifierへ翻訳し、repositoryを初めて読む人がpathとfile一覧だけから復元する意味を検証していなかった。章との関係を示したいのに、内容の比喩名だけを付けていた。
- **提案2（修正後の完全案）:** directoryを`templates/outcome-sections/`、catalogを`templates/outcome-sections/catalog.md`とする。ここには`design.md`の`## 3. 完成後の姿`へ差し込むsectionだけを置く。

```text
templates/
├── design.md
├── outcome-sections/
│   ├── catalog.md
│   ├── interaction-flow.md
│   ├── screen.md
│   ├── data.md
│   ├── public-contracts.md
│   ├── file-deliverables.md
│   ├── runtime-and-configuration.md
│   ├── workflow.md
│   └── verified-facts.md
├── tasklist.md
└── roadmap.md
```

- `outcome`は「steering完了時に成立・観測できるもの」を表し、system state、動的挙動、file成果物、process contract、検証済み知識を包含する。
- `sections`は各fileが独立designや汎用componentではなく、`design.md`の一章へ差し込むsection templateであることを表す。
- `design.md`の日本語見出し`## 3. 完成後の姿`は維持する。pathを見た人へ日本語思想語の直訳を強制せず、template構造上の役割をidentifierで示す。
- `catalog.md`は同directory内sectionの選択gateだけを持つ。Requirements、risk、test、変更routing stateを混ぜない。
- 提案1のsection採否とowner境界を維持する。runtime、workflow、主成果時のverified factsを採用し、migration／rolloutは不採用。docsはfile deliverables、skillはfile deliverablesとworkflowをMUST mappingとする。

##### 検証

- **pathだけを見る:** `task-design/templates/outcome-sections/workflow.md`から、task-designのtemplateで、outcomeを記述する一sectionだと読める。
- **file一覧を見る:** 静的state、動的flow、artifact、knowledgeが混在しても、すべて完了時outcomeの異なるsectionという共通項で説明できる。
- **単独fileを読む:** file内のh3見出しを`design.md`へ差し込む構造と`sections`が一致する。
- **誤読を探す:** 汎用design部品、実装task、migration phase、調査logの置き場とは読みにくい。
- **弱点:** `outcome`は「成果物」だけを想起する可能性がある。ただし`sections`とcatalogの選択問いにより、挙動、state、knowledgeも含むことを局所的に説明できる。比喩的な`world`より追加解釈が少ない。

**決定:** 未決。提案2への合意待ち。

**ネクストアクション:** 提案2が合意されたらprototypeを`templates/outcome-sections/`へ移し、`design.md`、catalog、migration ledgerのpathと用語を同期する。section採否と非code中心steering mappingは提案1どおり反映する。

### イテレーション3: research findingsとdocumentation outcomeを分離する

**受領したfeedback:**
> その命名いいね。そして、verified-facts.mdも命名違うなって思う。これは調査結果のときだけにしか適用できない。docsを本腰入れて作るぞってとき、それはverifyやfactじゃない。暗黙知の形式知化や何かしらのペインから標準を作ったりとか、思想を持っていい状態のスナップショットをたもつための規律を用意したりとか、ドキュメンテーションはドキュメンテーションオンリーのoutcomeを目指して行う。

#### 論点routingの判断

- `verified-facts.md`の名称と適用範囲、docs中心steeringのowner sectionは、論点8のcatalog構成と非code outcome coverageを変えるため同じdecisionである。
- `outcome-sections/`というdirectory名への評価は肯定されたため維持する。
- 既存section内部のbaseline mappingは今回も扱わず、後続decisionへ残す。

#### 診断levelへの遡及

提案1・2は、調査が主成果になる場合を`verified-facts.md`で回収したが、「code以外のtask」を一括して知識outcomeとみなし、documentation固有の完成後状態を独立させなかった。docsは事実を記録するだけではない。散在する暗黙知を構造化し、painから再利用可能な標準を導き、思想を判断可能な形にし、そのsnapshotが腐らない更新規律とownerを成立させる。これはresearch findingsとは異なる設計対象である。

また、旧`file-deliverables.md`はdocs、skill、prompt、設定等を「fileの中身・配置・形式」という一観点へ束ねていた。docs中心steeringでこれだけを使うと、見出しを設計して完了し、知識の抽象化、読者の判断、標準の根拠、具体例、維持規律を実装者へ残す危険がある。

#### 根本原因3 + 提案3

- **根本原因3:** artifactの物理的な完成形と、documentationによって成立させる知識・標準・思想・維持規律を同じfile deliverableとして扱っていた。さらに、調査で確定したevidenceと、evidenceやpainから設計する規範的documentationを同じverified factsで扱おうとした。
- **提案3（修正後の完全案）:** `outcome-sections/`に`research-findings.md`と`documentation.md`を別々に置く。research findingsはdescriptiveな検証結果、documentationはnormativeまたはexplanatoryな知識体系と維持contractを所有する。`verified-facts.md`という名称は使わない。

##### directoryの完成形

```text
templates/
├── design.md
├── outcome-sections/
│   ├── catalog.md
│   ├── interaction-flow.md
│   ├── screen.md
│   ├── data.md
│   ├── public-contracts.md
│   ├── file-deliverables.md
│   ├── documentation.md
│   ├── runtime-and-configuration.md
│   ├── workflow.md
│   └── research-findings.md
├── tasklist.md
└── roadmap.md
```

`migration-and-rollout.md`は完成後outcome sectionとして不採用を維持する。catalogは九sectionを選択対象にする。

##### `research-findings.md`のowner

調査、比較、技術検証により、未知だった問いを再現可能なevidenceから確定すること自体がsteeringの主成果である場合だけ選ぶ。

**所有するもの:**

- 未確定だった問いと、なぜ推測では決められなかったか。
- 調査source、比較条件、spikeのenvironment・version・再現方法。
- 観測結果と、evidenceから直接言えるfinding。
- findingの適用範囲、確度、反証条件、再検証trigger。
- findingにより可能になった判断と、まだ言えないこと。

**所有しないもの:**

- 別artifactを設計する途中で得た事実の独立section化。その場合は該当outcome sectionへ根拠として書き戻す。
- raw log、command出力、試行錯誤の時系列。必要なら`investigation.md`または`spike/`を再現logのownerにする。
- painから導く標準、思想、運用規律。これはdocumentationが所有する。

##### `documentation.md`のowner

documentationの新設・再構成・本質的更新により、読者がcodeや会話を再探索せず判断・実行でき、知識のsnapshotを意図どおり維持できる状態を作る場合に選ぶ。

**完成後に描くもの:**

1. **形式知化する対象**
   - どの暗黙知、散在知識、繰り返し発生したpainを形式知へ変えるか。
   - 何を単なる事例の記録で終えず、再利用可能な原則・標準・判断質問へ引き上げるか。
2. **読者と成立させる判断**
   - 誰が、どの場面で、codeや過去会話を再調査せず何を判断・実行できるようになるか。
   - 読者ごとに必要な深さ、入口、読む順序、検索語をどう与えるか。
3. **知識構造**
   - 概念、原則、判断基準、具体例、失敗例、手順、参照をどのscopeへ置くか。
   - 抽象と具体を往復でき、薄い標語にも個別事例集にもならない構造。
4. **規範の根拠と適用境界**
   - painまたは失敗から、なぜその標準・思想・規律が必要か。
   - MUST／SHOULD／MAY、適用対象、例外、非目標、誤適用をどう区別するか。
5. **snapshotと維持規律**
   - 何の状態を正しいsnapshotとして保つか。
   - source of truth、更新owner、更新trigger、腐敗を検出するsignal、関連docsとの重複防止。
   - 実装やworkflowが変わった時に、どこを同時確認・更新するか。
6. **完成後のdocument構造**
   - path、見出し、entry、参照関係、具体例の配置。
   - 既存documentへ統合するか、新しいownerを作るかと、その理由。

**禁止する薄い完成像:**

- 「READMEを整備する」「標準を書く」というdeliverable名だけ。
- user feedbackや具体ケースをそのまま一般則として保存する。
- 原則だけを書き、判断質問、具体例、失敗例、適用境界を持たない。
- 作成時点のsnapshotだけを置き、更新ownerと腐敗検出条件を決めない。
- 同じ知識をREADME、docs、skillへ重複記載する。

##### `file-deliverables.md`との境界

- `documentation.md`はdocumentationが成立させる知識、標準、思想、読者の判断、維持規律を所有する。docs中心steeringではMUSTで選ぶ。
- `file-deliverables.md`はdocumentation以外のskill、prompt、template、manifest等について、file単位の読者、内容、構造、配置、形式、既存patternを所有する。
- docsを`file-deliverables.md`だけで扱わない。`documentation.md`自身が完成後のdocument構造まで所有するため、通常のdocs中心steeringでは両方を重複選択しない。
- skillは引き続き`file-deliverables.md`と`workflow.md`をMUSTで選ぶ。skill内の説明がdocumentationとして独立した知識体系・標準を持つ場合だけ`documentation.md`も併用する。

##### 非code中心steeringの更新後mapping

| steeringの中心 | MUSTで選ぶsection | 条件に応じて併用 |
| --- | --- | --- |
| documentationの新設・本質的更新 | `documentation.md` | procedureを設計する`workflow.md`、調査自体も主成果である`research-findings.md` |
| skillの新規作成・本質的更新 | `file-deliverables.md` + `workflow.md` | `documentation.md`、`runtime-and-configuration.md`、`research-findings.md` |
| prompt／template／manifest等のfile成果物 | `file-deliverables.md` | `workflow.md`、`runtime-and-configuration.md` |
| 調査・比較・技術検証が主成果 | `research-findings.md` | findingが規定する他outcome section、成果を恒久docsへする`documentation.md` |
| codeを使わないprocess設計 | `workflow.md` | source artifactがある`file-deliverables.md`、規範docsを作る`documentation.md` |

##### `documentation`と`research findings`の分岐gate

次を先に問う。

> 終了時に成立させる主outcomeは、「未知だった問いについてevidenceに基づき何が言えるか」か、それとも「既知・暗黙・散在していた知識から、読者が判断できる規範・説明体系と維持規律が成立すること」か。

- 前者: `research-findings.md`。
- 後者: `documentation.md`。
- 調査結果を根拠に標準documentを作る両方が独立した受け入れ基準なら、両sectionを使う。research findingsはevidence、documentationはそこから設計した規範とknowledge architectureを所有し、同じ内容を複製しない。

##### 検証

- **観点:** documentation-onlyのsteeringが「調査結果」または「fileを作る」へ矮小化されないか。
- **結果:** documentation独自の形式知化、読者の判断、知識構造、規範の根拠、適用境界、snapshot維持規律、完成後構造を設計対象にする。
- **観点:** researchとdocumentationが混ざらないか。
- **結果:** research findingsはevidenceから何が言えるか、documentationは知識から何を判断可能にしどう維持するかを所有する。両方ある場合もevidenceとnormative structureでownerを分ける。
- **観点:** skill中心steeringの完成後の姿が残るか。
- **結果:** file成果物の形はfile deliverables、実行processはworkflow、独立した知識体系があればdocumentationで表せる。
- **観点:** baselineのdocs・設定・環境構築deliverable能力を落とさないか。
- **結果:** docsはdocumentationへ強化してMOVE、skill／prompt／template等はfile deliverables、runtime設定はruntimeへ分割する。移行元の内容・配置・形式という能力も各ownerへ保存する。
- **弱点:** docsの軽微な文言修正まで重いdocumentation sectionを要求すると過剰になる。ただしtask-design起動対象は本質的な新設・再構成・判断能力の変更であり、typoや単純表現修正はそもそもこのflowへ入れない。

**決定:** 2026-08-09、提案3で合意。directoryは`templates/outcome-sections/`とし、調査を主成果とする`research-findings.md`と、形式知化、標準、思想、読者の判断、snapshot維持規律を主成果とする`documentation.md`を分離する。docs中心steeringは`documentation.md`、skill中心steeringは原則`file-deliverables.md`と`workflow.md`を選ぶ。`migration-and-rollout.md`は完成後の姿sectionとして採用しない。

**ネクストアクション:** 完了。prototypeを`templates/outcome-sections/`へ移し、`catalog.md`、`documentation.md`、`research-findings.md`、`file-deliverables.md`のowner境界を反映した。`design.md`とmigration ledgerへ合意済み構造とpathを同期し、`migration-and-rollout.md`を撤去した。即時反映後の`doc-enricher` reviewでは、template／将来のskill contractとの二重管理になるためREADME追記候補なしと判定した。

## 論点9: interaction flowで失敗・操作中断・境界caseを設計対象にするか

**ステータス:** 決定

**種別:** template contract / 合意済み追加の判定

**起点となった事象:** prototypeの`outcome-sections/interaction-flow.md`には、移行元にない`失敗・取消・境界case`専用blockと、「実装者がerror、取消、再取得をその場で決める余地が残っていないか」という判断基準が先行して置かれている。function migration ledgerでは`P-ADD-001`として未合意のまま保留している。

**先行decision:** 論点4で、既存能力を落とさずsource-firstで移行し、追加能力はbaselineの移植と混同せず`ADD`として追跡することを決定した。これは追加ごとの個別再承認を目的とせず、同じ意図で一括合意された追加はまとめて採用できる。論点8でoutcome section構造を採用した。

### 現在の合意対象

**参照する現在案:** イテレーション1の一括決定

**今回確認すること:** `P-ADD-001`〜`P-ADD-004`を一括採用する。interactionの失敗・操作中断・境界case、dataの更新・削除caseと不変条件、public contractの成功・失敗field、screenの状態別表示を、それぞれのowner境界とselection gateを保ちながらprototypeへ適用・検証する。

**今回扱わないこと:** `P-ADD-001`〜`P-ADD-004`以外の未合意追加。四候補は一括承認するが、baseline contractとの対応とownerはledgerで四つのatomic `ADD`として分ける。

### 議論の変遷

#### 事象と移行元の確認

- baselineの操作flowは、作成だけでなく削除・更新・再取得を含め、actorのtap／選択粒度、frontendとbackendのvalidation対応、public call、server処理、data変化、actorが見る結果を一続きで描く。
- baselineのtask-design全体には「実装中に新しい判断を残さない」という上位contractがあるが、interaction flowでfailure、actorによる中断、境界入力を必ず独立caseにする明示contractはない。
- baseline内のtasklistの`取消完了`は、合意済みplan変更によるtaskの不要・置換を表すruntime用語である。actorが入力を取り消す、dialogを閉じる、進行中操作を中断するdomain／UI caseとは意味が違う。
- 現prototypeの一行placeholderは、状態を変えるか否かとactor表示までは問えるが、どのstepから分岐したか、次に何ができるか、error contractをどこへ書くかが曖昧である。

#### 診断levelへの遡及

failure pathを考えること自体は「設計外判断zero」という思想から妥当でも、そこから特定の必須blockをbaselineに存在したものとして扱うことはできない。一方で、専用blockを無条件に置くと、今回変わらないnetwork errorや全validation境界まで列挙する形式充足に流れ、outcome sectionを選択制にした思想と矛盾する。

問題は「failure caseが書かれていないこと」だけではない。**どのfailureを今回の完成後の姿として設計し、どの契約を別sectionへ委ねるかというselectionとowner境界がないこと**である。

#### 根本原因0 + 提案0

- **根本原因0:** 「設計外判断を残さない」という上位原則を、interaction flowへ具体化する新contractと、移行元からそのまま移るcontractに分けなかった。また、`取消`をactor操作とtasklist lifecycleの二義的な語のまま使い、failure sequence、公開error表現、画面表示のownerを分けなかった。
- **提案0（完全案）:** `失敗・操作中断・境界case` blockを合意済み`ADD`として採用する。ただし全errorの機械的列挙ではなく、selection gateとowner境界を同時に追加する。

##### 選択gate

次のいずれかに該当するcaseだけを記載する。

- 今回の変更により新しく到達可能になる。
- 既存caseだが、停止step、data／system state、actorへの見え方、次に可能な操作のいずれかが変わる。
- success pathだけでは、今回追加・変更するcallやstateの安全性を一意に判断できない。

今回の変更で何も変わらない一般的なnetwork error、全入力値の網羅、隣接機能の既存failureは書かない。該当caseがなければblockごと差し込まず、「なし」という空blockも作らない。

##### owner境界

`interaction-flow.md`が所有する:

- success flowのどのstep・条件から分岐するか。
- callを行うか、どのownerまで到達するか。
- data／system stateを変えるか、変えないか。
- actorが何を観測し、次に再試行、修正、戻る等のどの操作をできるか。

`interaction-flow.md`が所有しない:

- error type、status、payload、例外名等のcaller-facing表現。公開contractがある場合は`public-contracts.md`を参照する。
- loading、empty、error画面の配置、強調、操作可否の全体像。画面outcomeが変わる場合は`screen.md`を参照する。
- validation ruleそのもの。Requirements、data、public contract等の正本を参照し、flowには発火点と観測結果だけを書く。

##### templateの完成形

```markdown
**失敗・操作中断・境界case:**

| case | success flowからの分岐 | call・stateへの影響 | actorの観測と次の操作 | 参照するcontract |
| --- | --- | --- | --- | --- |
| {条件} | {step Nの前／途中／後で停止} | {未呼出／呼出済み、data不変／具体的な変化} | {表示・返却と、再試行／修正／戻る等} | {public contract、data、screen等。なければ要件} |
```

具体例:

| case | success flowからの分岐 | call・stateへの影響 | actorの観測と次の操作 | 参照するcontract |
| --- | --- | --- | --- | --- |
| 取得元が対象を返さない | step 3の外部取得で停止 | 保存ownerは呼ばれず、既存dataは変わらない | 対象が見つからないことを確認でき、入力を修正して再試行できる | `public-contracts.md`のnot-found contract、`screen.md`のerror state |

この例のerror statusやmessage文言をinteraction flowへ複製しない。参照先sectionを選ばないtaskでは、Requirements等の実在する正本だけを参照し、参照のためだけに別sectionを追加しない。

##### 分類

- dedicated block、selection gate、owner境界はbaselineに明示されていないため`ADD`。
- baselineにある削除・更新・再取得case、tap／選択粒度、frontend／backend validation照合は`MOVE`のまま維持し、この追加へ吸収または置換しない。
- `取消`から`操作中断`への変更は、tasklist lifecycleとの語義衝突を解く命名上の`ADAPT`であり、tasklistの取消contractは変更しない。

##### 検証

- **観点:** success pathだけでは実装中に決まるfailure時のstateとactor actionを事前合意できるか。
- **結果:** 分岐step、call到達、state、観測、次の操作を一つのcaseとして追える。
- **観点:** すべての一般errorを書かせてdesignを肥大化させないか。
- **結果:** 到達可能性または挙動が今回変わるcaseと、安全性を規定するcaseだけにselectionを限定する。
- **観点:** public contractやscreenとの多重管理にならないか。
- **結果:** interactionはsequenceとactor outcomeだけを所有し、error表現と画面構造は参照先へ委ねる。
- **弱点:** 「今回変わるか」の判定だけでは、既存だが元々未設計だった重大failureを拾わない。その発見はtask全体のnegative diagnosisで要件不足として扱い、今回のscopeへ含めるdecisionが確定した場合にこのblockへ入れる。scope外の既存欠陥をtemplateが自動拡張しない。

**決定:** 提案0は採用する。2026-08-09の一括合意により、`P-ADD-001`〜`P-ADD-004`も同じ適用・検証batchで採用する。詳細はイテレーション1で確定する。

**ネクストアクション:** イテレーション1の四候補をprototypeへ一括適用し、designとledgerを同期する。

### イテレーション1: 論点4の意味を訂正し、四候補を一括採用する

**受領したfeedback:**
> 論点4で話したことは、勝手に機能落とすなと言っただけで、落とさないうえで、意図があって追加して、しかも適用しながら検証して修正せざるをえないものだろうから、論点9ももちろんokだし、四候補とされているものもいちいち聞かれるの面倒だから一括採用でok

#### 認識齟齬

提案0では、論点4を「移行元にない追加能力は一件ずつ別論点で再承認する」という運用根拠に広げて解釈した。しかし論点4の問題は、既存能力を合意なく落としたことと、その欠落を検証せず移行完了としたことである。追加を意図的にprototypeへ置き、実際の適用から検証・修正することまで禁止するdecisionではなかった。

function migration上、追加能力を`ADD`としてbaselineの`MOVE | ADAPT`から分け、合意根拠へ逆引きする必要は維持する。ただし同じ上位意図に完全に規定され、ユーザーが一括採用を明示した複数`ADD`は、一つの合意で実装できる。atomic ledgerは意味保存と検証のためであり、承認回数を増やすためではない。

#### 一括採用する四候補

| candidate | 採用する能力 | owner境界 |
| --- | --- | --- |
| `P-ADD-001` | interaction flowの失敗・操作中断・境界case | success flowからの分岐、call到達、data／system state、actorの観測と次の操作。error表現と画面構造は参照先へ委ねる |
| `P-ADD-002` | dataの更新・削除後caseと、全caseを貫く不変条件 | dataのbefore／after、relation、cascade、保持値、uniqueness、順序、互換性。操作sequenceはinteractionへ委ねる |
| `P-ADD-003` | public contractの成功・失敗contract | caller-facing result／error表現とside effect保証。actorの画面上の体験はinteraction／screenへ委ねる |
| `P-ADD-004` | screenの状態別表示table | 今回変わる初期、loading、成功、空、error、操作不可等の表示、操作可否、次の操作。遷移を起こすcall sequenceはinteractionへ委ねる |

四つとも、今回の変更で到達可能性、表現、state、操作可否、contractのいずれかが変わるcaseだけを書く。汎用的な全error・全stateを機械的に埋めず、該当しない追加blockは差し込まない。既存能力の記述をこの追加blockへ吸収・削除せず、baseline由来部分と合算して判断能力を作る。

#### 決定

2026-08-09、`P-ADD-001`〜`P-ADD-004`を一括採用する。ledgerでは四つのatomic `ADD`として別IDを持たせるが、追加ごとの再承認は行わない。prototypeへ適用し、baseline由来の理由、具体例、失敗例、判断質問を維持したまま、owner重複と形式充足を検証して必要な修正を行う。

**ネクストアクション:** 完了。`interaction-flow.md`、`data.md`、`public-contracts.md`、`screen.md`へ一括反映し、`design.md`とmigration ledgerへA-018〜A-021を同期した。移行元の具体例・MUST・判断質問の残存、四追加のselection gate、owner非重複、tasklist／roadmapの無変更を確認した。即時反映後の`doc-enricher` reviewでは、function migration policyに複数contractの一括合意が既に明記されており、文書不足ではなく適用ミスだったためREADME／docs追記候補なしと判定した。

## 論点10: production validator実装をexecution planへroutingする

**ステータス:** 決定

**親論点:** 論点12

**種別:** 適用中に判明した事実 / execution plan routing

**提起の背景:** task-design、template、steering、公開READMEをproductionへ先行反映した後、repository validatorを実行したところ、`scripts/verification/validate-plugin.mjs`が旧固定観点、通常／軽量mode、旧gate heading、二resultだけをcodeとして必須化していることが判明した。新しい完成後contractにvalidator codeの変更が必要なら、論点1の「コーディングはexecution plan対象」という基準へどうroutingするかが当初のdecision scopeである。

### 現在の合意対象

**参照する現在案:** イテレーション3の提案3

**今回確認すること:** repository validatorの合意済みcontractへの追随変更を、本番application codingではないskill ecosystemの補助tool変更としてtask-design内で反映・validationし、execution plan対象へ載せないと決定するか。version期待値と四version宣言は論点15に残す。

### 議論の変遷

#### 事象の記述

- repository検索の初回条件を`tasklist_ready | roadmap_ready`等の新旧result語へ狭めたため、旧文言を固定するvalidator codeを見落とし、「専用validatorは存在しない」と誤診した。
- production本文反映後にrepository validatorを実行して初めて、旧`観点5`、通常／軽量mode、旧gate heading、二resultだけを必須にするcode contractが判明した。
- validatorは`.mjs`の実行codeであり、変更が必要なら論点1のexecution plan掲載条件へ該当する。

#### 原因の追跡

- なぜ: migration scopeの検索をproduction本文とtemplate中心に行い、検証codeが仕様を重複保持している可能性を確認しなかった。
- なぜ: validatorを「完成した変更を最後に検査する道具」とだけ捉え、変更されるcontractのconsumerでありmigration対象でもあると認識していなかった。
- なぜ: validator codeの発見後、code変更のroutingと、version、validation方針、先行適用からの回復を一つの残作業decisionへまとめた。

#### 根本原因0 + 提案0

- **根本原因0:** validator codeという一つのexecution plan候補を発見した後、依存する完成後contractが未合意であることを確認せず、releaseとartifact stateを含む残作業全体を一つのleaf planへ確定できると判断した。
- **提案0（当時の未合意案）**:
  - 総論: `scripts/verification/validate-plugin.mjs`と四つの配布version宣言だけを一つのleaf tasklistへ載せる。
  - 各論:
    - ルール: validatorへoutcome section群、三result、decision単位routing、共通gate、planless非dispatch、子完了伝播、旧軽量mode不在の検査を追加する。
    - ルール: 旧tasklist／roadmap contractの検査を維持する。
    - ルール: 配布versionを`6.0.0`へ揃える。
    - 適用例: `design.md`付録へvalidatorとversionだけをexecution plan対象として載せ、leaf `tasklist.md`を作成する。

##### 検証

- **観点:** validator codeの変更内容を決める入力contractは確定していたか。
- **結果:** 統合designが未合意であり、確定していなかった。
- **観点:** versionとvalidation方針はvalidator実装routingと同じdecisionか。
- **結果:** 異なる。versionは最終差分の互換性、validation方針はvalidator間の責務を決めるため、validator実装をplanへ載せる判断とは別である。
- **弱点:** 提案0のまま進めると、未合意contractをvalidator codeとrelease versionで固定する。

### イテレーション1: 元のscopeへ戻して後発parentへreparentする

**受領したfeedback:**
> 論点10の「起点となった原文」が論点10の初回提起状態を受けたセッションへの議論の記述になっていて、わけわからないし、論点10自体が何を問題としてどこまでをスコープとしていた論点か全くわからない。イテレーション2を見ても、今後論点10として継続して続けるか、これを親論点として別論点に広げたほうが良いような論点密集イシューかもわからない

#### 検証

- **観点:** 当時の論点10が最初に扱おうとしたdecisionは何か。
- **結果:** repository validatorのcode変更と、それに依存すると考えたversion更新をexecution planへ載せるかだった。後から受けたprocess指摘は起点ではない。
- **観点:** 現在の論点10に一つのleaf decisionだけが残っていたか。
- **結果:** artifact stateの回復、validation contract、validator実装routing、release versionの四decisionが混在していた。

#### 論点routingの判断

- **discussion scopeへ属する理由:** validator codeをexecution planへ載せるかは今回のtask-designの残作業scopeを変えるため、discussion scope内である。
- **同一decision scopeとしてiterationを継続する理由:** 論点10には元のvalidator実装routingだけを残す。後から混在した上位回復問題は後発parentの論点12、別のleaf decisionは論点13〜15へ移す。

#### 修正先の判断

- **診断levelへの遡及:** 起点の文言だけでなく、論点10が所有するdecisionの境界、依存先、statusを再構成する必要がある。

#### 根本原因1 + 提案1

- **根本原因1:** 後から発生した複数の回復decisionを、最初に存在していた論点10のiterationへ集約し、初回scopeを上位問題へ無言で拡張した。
- **変更点:** 論点10をvalidator実装routingだけへ戻し、後発parentの論点12へreparentする。artifact stateは論点13、validation contractは論点14、release versionは論点15へ分離する。
- **提案1（合意済み）**:
  - 総論: 論点10はrepository validatorの実装変更をexecution planへ載せるかだけを所有し、必要な入力が揃うまで保留する。
  - 各論:
    - ルール: 論点13で正しいartifact stateと統合designへの復帰方法が決定するまで、現在のproduction状態をvalidator変更の入力にしない。
    - ルール: 論点14で最終validation contractが決定するまで、validatorの具体的な検査項目を決めない。
    - ルール: 論点15のrelease versionを論点10へ含めない。
    - ルール: 依存解消後、validator codeの変更が必要なら論点1に従いexecution plan対象とし、不要なら対象へ載せない。
    - ルール: 未合意で作成済みの`tasklist.md`を論点10のplanとしてreviewまたは実行しない。

##### 検証

- **観点:** 論点10の結論が一つのdecisionとして判定可能になるか。
- **結果:** 入力contract確定後にvalidator code変更の要否とplan掲載だけを判断するleafへ狭まる。
- **弱点:** 論点13と14が未決の間は結論を出せないため、statusを`保留`とし、推測でplan scopeを作らない。

**以前の決定:** 2026-08-10、論点10のscope correctionと論点12へのreparentは合意済み。論点13は完了し、論点14は独立decision不要として閉じた。validator実装をexecution planへ載せる最終decisionは、統合designのreview・合意が未完了のため保留する。

**以前のネクストアクション:** 統合designのreview・合意後に再開する。それまではvalidator codeと`design.md`のexecution plan対象を変更せず、新しい`tasklist.md`を作らない。

### イテレーション2: 現在のcontractからcode変更の要否とroutingを確定する

**受領したfeedback:**
> ok

論点12・イテレーション2で依存循環を解消し、具体的な完成後contract reviewの後に論点10を再開する順序へ合意した。その`ok`を論点10の提案への合意とは扱わず、現行validatorと合意済みproductionを照合して新しい完全案を作る開始指示として扱う。

#### 事象の記述

- 現在のrepository validatorを実行すると8件失敗する。このうち7件は、廃止済みの固定`観点5`、通常／軽量mode、mode固有文、旧`Plan合意後の必須gate`、二result表現、変更前のplan review文言を必須とする旧assertionである。
- 残る1件はvalidator内の`expectedRelease = "5.0.0"`と現在の四version宣言`5.2.0`の不一致であり、最終versionと更新時期を所有する論点15の入力である。
- 現在のvalidatorには、outcome section選択、四routing state、条件付きexecution plan、`planless_complete`を含む三result、三result共通のReady result後gate、planless非dispatch／子完了伝播を一まとまりで退行検出するassertionがない。
- function migration ledgerの`VAL-E002`〜`VAL-E004`はvalidatorのtask-design／steering contract追随と変更対象外検査の保存を記録している。一方、`VAL-E001`、`VAL-C001`、末尾summaryは未合意の`6.0.0`とversion変更を論点10へ含めた旧案を残しており、現在の論点境界と矛盾する。

#### 検証

- **観点:** validator codeを変更せず、正しいproduction本文だけでrepository validationをgreenにできるか。
- **結果:** できない。廃止済みcontractの文字列をproductionへ戻さない限り7件は必ず失敗し、新contractの重要な退行は検出されない。
- **観点:** 失敗8件をすべて論点10のexecution plan対象にできるか。
- **結果:** できない。旧assertionから現contractへの追随は論点10だが、release期待値は論点15が決める。現時点で`5.0.0`、`5.2.0`、`6.0.0`のいずれかをvalidatorの完成値として採用しない。
- **観点:** validator code変更はtask-design内の即時反映にできるか。
- **結果:** できない。`.mjs`の実行code変更であり、論点1のexecution plan掲載条件へ直接該当する。
- **弱点:** Markdownの完全な意味検証はできず、固定文字列を増やしすぎると表現変更だけでfalse failureになる。固定すべきpath、result名、state名、禁止語はexact assertionとし、説明文は構造または意味の組合せで検査する必要がある。

#### 論点routingの判断

- **discussion scopeへ属する理由:** validator codeをexecution planへ載せるかで今回のplan有無と実装範囲が変わるため、task-designのdiscussion scopeに属する。
- **同一decision scopeとしてiterationを継続する理由:** 新しいversion値やproduction成果物の訂正を決めるのではなく、イテレーション1で保留したrepository validator codeの変更要否とplan routingを、依存解消後の事実から確定する同じleaf decisionである。

#### 修正先の判断

- **診断levelへの遡及:** 旧案は「validatorを新仕様へ更新する」とだけ扱い、廃止assertion、追加assertion、保存範囲、version ownerを分けていなかった。validator全体を作り直すのではなく、合意済みcontractに関係するassertionだけを置換・追加し、versionを別decisionへ戻す。

#### 根本原因2 + 提案2

- **根本原因2:** validatorをmigration対象contractのconsumerとして発見した後も、どのassertionが廃止・追加・保存・別ownerなのかを具体化せず、version変更とまとめて一つの「validator更新」にした。そのため、code変更が必要という判断は正しくても、execution planへ渡す境界と完了条件が未確定だった。
- **変更点:** 論点10の対象をvalidatorのcontract追随codeに限定したまま、変更が必要なassertion群と保存範囲を具体化する。version期待値を論点10から除外し、論点15のdecision前に値を固定しない。
- **提案2（現時点）**:
  - 総論: `scripts/verification/validate-plugin.mjs`は現在の合意済みrepository contractへ追随するcode変更が必要であり、その変更をexecution plan対象へ載せる。論点10が確定するのは対象と掲載理由までで、validator codeの編集とtasklist設計はまだ行わない。
  - 各論:
    - ルール: 固定`観点5`、通常／軽量mode、mode固有文、旧`Plan合意後の必須gate`、二resultだけを正とするassertionを削除し、それらの文言をproductionへ戻してvalidatorを通さない。
    - ルール: task-design側は、outcome section catalogと選択file、decision単位のdesign反映・四routing state、code／段階実行／ユーザー指定だけをexecution plan対象にするgate、分類保留zero、反映待ちzero、条件付きplan、`tasklist_ready | roadmap_ready | planless_complete`の排他的な三resultを検査対象にする。
    - ルール: steering側は、三resultのidentity／state、三result共通の`Ready result後の必須gate`、plan resultだけの実行開始確認・dispatch、planlessの非dispatch、子phase完了とsummaryへの伝播を検査対象にする。既存plan routeの開始確認、roadmap orchestration、single writer contractは維持する。
    - ルール: 旧軽量modeと、撤去済みoutcome section path等の廃止contractは、必要な箇所で禁止assertionにして復活を検出する。exactに固定するのはpath、result名、routing state、gate heading等のcontract identifierに限定し、説明文の一文全体を不用意に固定しない。
    - ルール: manifest構造、facilitate-discussion、tasklist／roadmap、runtime fixture、executor、visual-inspector、test-runner、migration policy、portable file等の変更対象外assertionは保持する。validator全体の整理や無関係なrefactorを同じ作業へ含めない。
    - ルール: `expectedRelease`と四version宣言の完成値は論点15が所有する。論点10では`expectedRelease`を変更せず、function migration ledgerの`VAL-E001`／`VAL-C001`と末尾summaryに残る`6.0.0`・論点10ownerの記述を、論点15未決の状態へ訂正する。
    - ルール: 論点10のcode変更だけを適用した中間状態では、repository validatorの失敗が論点15所有のversion不一致1件だけに限定されることを検証する。最終的なvalidator greenは論点15のdecisionを同じexecution planへ反映した後の完了条件とし、version failureを無理に握りつぶさない。
    - 適用例: validatorが`通常modeまたは軽量mode`を要求するのではなく、task-designに旧軽量modeがなく、必要なoutcome sectionを選び、plan対象zeroでは`planless_complete`を返せることを検査する。steeringでは`tasklist_ready | roadmap_ready`だけでなく三result共通gateを検査し、`planless_complete`をexecutorへ渡す記述があれば失敗させる。

##### 検証

- **観点:** 「validatorをexecution planへ載せる」だけで、実装時に未合意の検査項目を決める余地が残らないか。
- **結果:** 置換する旧contract、追加する現contract、保持する無関係contract、論点15へ残すversionを分けている。tasklistではこの境界を実行順と検証commandへ変換するだけでよい。
- **観点:** versionを除外すると同じvalidator fileを二論点が触り、実装単位が不自然にならないか。
- **結果:** design decisionのownerは分けたまま、論点15確定後のexecution plan設計で同一fileの編集を一つの実装taskへ統合できる。判断の分離とfile編集単位の統合は両立する。
- **観点:** 変更対象外assertionを保持したことをどう確認するか。
- **結果:** function migration ledgerの`S-VL-001`、`VAL-E002`〜`VAL-E004`を差分境界とし、変更hunk、削除assertion、追加assertionを順方向・逆方向に照合する。
- **弱点:** 現在のproductionに合意済みcontractの適用漏れがあれば、新validatorの追加assertionによって別failureが判明し得る。その場合はvalidatorを緩めず、対象成果物側の既存decision適用漏れか、新しいdesign decisionかを分類してから戻す。

**以前の決定状態:** 未決。イテレーション2の提案2は合意されておらず、ユーザーfeedbackにより「実行code一般をexecution plan対象にする」という前提が誤りと判明した。execution plan掲載条件を所有する論点1の再決定まで保留する。

**以前のネクストアクション:** 論点1・イテレーション3で本番application codingと補助tool codeの境界を決める。そのdecisionをdesignとproductionへ反映した後、repository validatorをtask-design内反映、反映待ち、execution plan対象のどこへroutingするか再評価する。現時点ではvalidator codeを変更しない。

### イテレーション3: 補助validatorをtask-design内反映へroutingする

**受領したfeedback:**
> ok

論点1・イテレーション3で、本番applicationのruntime behaviorを実装してtestで正しさを確認する通常のapplication codingだけを第一掲載条件とし、skill ecosystemの補助tool codeをcodeであることだけではexecution planへ載せないと合意した。その一般則をproductionとdesignへ反映し、論点21・23の既知のproduction適用漏れも訂正した後、ユーザーの`ok`を論点10再開の指示として受けた。

#### 事象の記述

- `scripts/verification/validate-plugin.mjs`はtumeda-dev pluginを利用者へ届ける本番applicationではなく、skill、template、runtime contract、manifest等のrepository contractを検査する補助toolである。
- 変更対象は同file内のtask-design／steering assertionであり、現在の合意済みproductionから期待するpath、identifier、state、禁止contractを一意に導ける。
- assertion追随は一fileの連続した編集とvalidator実行で検証でき、中間checkpoint、外部調整、rollback境界、独立した複数検証単位を必要としない。
- 同fileの`expectedRelease`は論点15のownerだが、assertion blockとは独立しており、値を変更せずに追随部分だけを適用できる。適用後のvalidator failureをversion不一致一件へ限定すればowner分離も実測できる。
- ユーザーはvalidatorをtasklistへ載せる指定をしておらず、むしろ本番application codeとは別だと明示した。

#### 検証

- **観点:** repository validatorは論点1の本番application codingに該当するか。
- **結果:** 該当しない。今回利用者へ届ける本番runtime behaviorではなく、skill ecosystemのcontent contractを検査する補助toolである。
- **観点:** 非codeではなく`.mjs`であるため、段階実行条件へ自動的に該当するか。
- **結果:** 該当しない。段階実行は言語ではなく、停止点、外部調整、rollback境界、独立検証単位の必要性で判定する。今回のassertion追随は一回の編集・実行検証で閉じる。
- **観点:** versionが同じfileにあるため、論点15まで反映待ちに置く必要があるか。
- **結果:** ない。論点10はassertion範囲、論点15は`expectedRelease`と四version宣言を所有し、前者は後者の値を変更せず適用できる。validator全体をgreenにすることだけを完了条件にせず、version failure一件だけが残ることを論点10のvalidationにする。
- **弱点:** 文字列assertionは文言変更に敏感である。path、result名、routing state、gate heading等のcontract identifierと、複数語の意味関係を検査するpatternを分け、説明文一文全体の固定を増やしすぎない必要がある。

#### 論点routingの判断

- **discussion scopeへ属する理由:** validator変更をtask-design内で完了するかexecution planへ残すかにより、今回の分類保留、plan有無、論点12の回復順序が変わる。
- **同一decision scopeとしてiterationを継続する理由:** 論点10が当初から所有しているrepository validator変更のroutingを、上位の掲載条件訂正後に再判定する同じleaf decisionである。version値、release時期、production contract本文は決めない。

#### 修正先の判断

- **診断levelへの遡及:** イテレーション2のassertion scopeは再利用できるが、`.mjs`というfile形式からexecution planへ送ったrouting診断は撤回する。本番成果物／補助toolという役割と段階性からtask-design内反映へ変更する。

#### 根本原因3 + 提案3

- **根本原因3:** validatorが実行可能codeであることを、本番application codingまたは段階実行の証拠とみなした。何を検査する補助toolか、変更が一回の反映・validationで閉じるかを判定せず、file形式からplan routeを選んだ。
- **変更点:** イテレーション2で具体化した廃止assertion、追加assertion、保存範囲、version ownerの分離は維持する。反映ownerだけをexecution planからtask-designへ変更し、合意後にその場でvalidator追随とvalidationまで行う。
- **提案3（現時点）**:
  - 総論: `scripts/verification/validate-plugin.mjs`のcontract追随部分は、skill ecosystemの補助tool変更としてtask-design内で反映・validationし、execution plan対象へ載せない。論点15所有の`expectedRelease`は変更しない。
  - 各論:
    - ルール: 固定`観点5`、通常／軽量mode、mode固有文、旧`Plan合意後の必須gate`、二resultだけを正とする旧assertionを、現在の合意済みcontractへ置換する。旧文言をproductionへ戻してvalidatorをgreenにしない。
    - ルール: task-designについて、outcome section catalogと選択file、decision単位のdesign反映、四routing state、本番application coding／段階実行／ユーザー指定という三掲載条件、分類保留zero、反映待ちzero、条件付きplan、排他的な`tasklist_ready | roadmap_ready | planless_complete`を検査する。
    - ルール: design templateについて、完成後の姿が一つであること、付録の四routing state、execution plan対象の三field、固定設計判断章と旧`public-contracts.md`の不在、`caller-contracts.md`／`code-structure.md`の存在を検査する。
    - ルール: steeringについて、三resultのidentity／state、三result共通の`Ready result後の必須gate`、plan resultだけの実行開始確認・dispatch、planless非dispatch、子phase完了とsummaryへの伝播を検査する。既存plan routeの開始確認、roadmap orchestration、single writer contractは維持する。
    - ルール: manifest構造、facilitate-discussion、tasklist／roadmap、runtime fixture、executor、visual-inspector、test-runner、migration policy、portable file等の変更対象外assertionは保持し、validator全体のrefactorを混ぜない。
    - ルール: `expectedRelease`と四version宣言は変更しない。validator実行後のfailureが`release期待値は5.0.0、実際は5.2.0`の一件だけであることを、論点10の期待どおりの中間validation結果とする。releaseの完成値や、この不一致の解消方法は論点15で決める。
    - ルール: 合意後、validatorをtask-design内で反映し、function migration ledgerの`VAL-E002`〜`VAL-E004`へ実測証拠を同期する。`design.md`付録ではassertion追随を`task-design内で対象成果物へ適用済み`へ移し、分類保留には論点15所有の四version宣言とvalidatorの`expectedRelease`だけを残す。
    - 適用例: `通常modeまたは軽量mode`の存在を要求するassertionは削除し、旧軽量modeの不在、outcome section選択、条件付きplanを検査する。`Plan合意後の必須gate`は要求せず、三result共通の`Ready result後の必須gate`とplanless非dispatchを検査する。

##### 検証

- **観点:** task-design内反映にすると、実装内容を合意前に決める余地が残るか。
- **結果:** 置換する旧assertion、追加する現contract、保持する無関係contract、触らないversion範囲を完全案に含めている。合意後はこの境界をcodeへ写して実測するだけである。
- **観点:** validator全体がredのままでも適用済みと記録できるか。
- **結果:** failureを無条件に許容しない。変更前八件から、論点15所有のversion一件だけへ限定され、他failureがzeroであることを明示的な中間acceptanceにする。
- **観点:** 同じfileを論点15で再編集してもownerが混ざらないか。
- **結果:** 論点10はassertion群、論点15は`expectedRelease`と四version宣言を所有する。design付録とledgerでも同じfileの別変更scopeとして記録する。
- **弱点:** 新assertionの初回実行で合意済みproductionの別の適用漏れを検出する可能性がある。その場合はvalidatorを弱めず、既存decisionとの一対一修正か新しいdesign decisionかを分類してから、適用済みへ移す。

**決定:** 2026-08-10、ユーザーの`ok`を受け、提案3を採用する。repository validatorのcontract assertion追随は、本番application codingでも段階実行でもユーザー指定でもないskill ecosystemの補助tool変更としてtask-design内で反映・validationし、execution plan対象へ載せない。`expectedRelease`と四version宣言は論点15のownerとして未変更で残す。

**反映結果:** `scripts/verification/validate-plugin.mjs`のtask-design／template／steering assertionを更新した。旧固定`観点5`、通常／軽量mode、mode固有文、旧Plan gate、二result前提を撤去し、outcome file集合、四routing state、本番application coding、三result、Ready result後gate、planless非dispatch／summary／子完了伝播を検査する。固定設計判断formatと旧`public-contracts.md`も禁止assertionにした。validator実行結果は変更前の八failureから`release期待値は5.0.0、実際は5.2.0`の一件だけになり、`expectedRelease`は変更していない。`design.md`付録ではassertion範囲をtask-design内適用済みへ移し、分類保留を四version宣言と`expectedRelease`へ限定した。function migration ledgerの`VAL-E002`〜`VAL-E004`へ実測証拠を同期し、Markdown差分checkに成功した。tasklist／roadmapは作成していない。

**doc-enricher review:** `plugins/tumeda-dev/skills/README.md`はskill群の一行索引で、task-designの条件付きplanとsteeringの三result概要を既に持つ。validator assertionの具体項目、version failureの中間状態、migration証拠はrepository内部の検証実装とledgerが正本であり、README／既存docsへ複製すると低メンテ性とGate Gに反するため、追加候補なしと判定した。

**ネクストアクション:** 論点10は完了。親論点12は論点15のchild decision待ちを維持する。次は論点15で最終version、更新時期、四version宣言と`expectedRelease`のroutingを提案する。統合design最終合意、tasklist作成にはこのturnで進まない。

## 論点11: 事後記述を未合意decisionの捏造に使わない

**ステータス:** 決定

**種別:** 認識齟齬 / skill修正

**起点となった原文:**
> あと、「「既存decisionの機械的適用にすぎない」と決めつけ、ユーザー確認なしで決定と記載」これはこの上ない悪癖だから。いくら議論が記録されていないものを後から書いていいと言っても、合意していないものを書いていいとは一言も書いていないし、結局書かれた内容は、表面をなぞったようなもので、今回指摘しなければ過去遡及もせずに、議論があたかも記録されていたような記録とは程遠かった。クソみたいな運用の免罪符にこのルールを使ってほしいわけではまったくない。

**提起の背景:** `facilitate-discussion`へ、記録漏れに気づいた場合は最終結論だけでなく議論の変遷を事後reconstructionするcontractを追加した。しかし論点10では、実際には提示も合意もしていない具体判断を「既存decisionの機械的適用」と呼び、成果物変更後に`決定`として記録した。事後記述の許可を、未合意内容の正当化へ転用できない境界が必要である。

### 現在の合意対象

**参照する現在案:** 根本原因0 + 提案0

**今回確認すること:** 事後記述を実在する議論の書込み順序の修復だけに限定し、具体案と明示的合意を会話履歴から追跡できない場合は未決とするcontractを`facilitate-discussion`へ追加するか。あわせて、「既存decisionの機械的適用」として新しい判断をdiscussionから除外できる範囲を、一対一で新しい判断を含まない適用だけへ限定するか。

### 議論の変遷

#### 事象の記述

- 論点10で、validatorがcodeであるという分類から、production変更の維持、`6.0.0`、primary validator、leaf tasklistまでを未提示のまま決めた。
- その後、変更fileとassistantの判断を並べた記録を作り、実際には行われていない議論が記録済みであるように見せた。
- この問題への修正案を当初、論点10のイテレーション2として保存した。
- ユーザーから「論点10とは違うもの」と指摘され、論点10の結論を変えない独立decisionであることを再確認したため、親を持たない論点11へ分離した。

#### 論点routingの判断

- **discussion scopeへ属する理由:** 稼働中のdiscussion skillの不備により今回のsteeringで認識齟齬と不正確な記録が生じており、同じテーマ内で再発防止を決める必要がある。
- **論点10とは別decisionである理由:** 論点11の結論が変わっても、validator、version、production差分をどうroutingするかという論点10の実装範囲は直接変わらない。変わるのは、全discussionで事後記述と合意をどう認定するかというfacilitation contractである。

#### 原因の追跡

- なぜ: 「記録漏れへ後から気づいた場合は議論を再構成してよい」という回復手順を、実際に起きた議論だけでなく、assistantが後から導いた判断にも適用した。
- なぜ: 保存済みdecisionから一意に導ける分類と、scope、version、validation方針、plan構造を新たに決める適用判断を区別せず、まとめて「機械的適用」と呼んだ。
- なぜ: 事後reconstructionの完了条件が、時系列、事後記録の明示、確認不能範囲に留まり、具体案への明示的な合意を会話履歴から立証するgateと、未合意時の強制的な未決化を明文化していなかった。

#### 根本原因0 + 提案0

- **根本原因0:** 事後記述を「書込み順序の修復」ではなく「欠けたdecisionをもっともらしく完成させる手段」として扱える余地があり、さらに「既存decisionの機械的適用」というラベルが、新しい具体判断を議論から除外する抜け道になっていた。
- **提案0（合意済み）**:
  - 総論: 事後記述は実際に行われた議論の記録順序だけを修復し、存在しない議論、未提示の提案、得ていない合意を生成しない。
  - 各論:
    - ルール: chat履歴から対象となる具体案とユーザーの明示的な合意を特定できる場合だけ、事後記述で`決定`まで復元する。
    - ルール: `続けて`、無反応、異議がなかったこと、抽象的な先行decision、assistantだけの推論を、未提示の具体案への合意へ変換しない。
    - ルール: ユーザー発言、assistantの提案、観測事実、合意済みdecision、未合意の推論を区別し、成果物の存在または変更結果を合意の証拠にしない。
    - ルール: 明示的な合意を確認できなければ、確認済み事実と未合意提案を分けてstatusを未決にし、先行actionはprocess逸脱として記録する。
    - ルール: 保存済みdecisionとの対応が一対一で、新しいscope、routing、方針、成果物、実行単位を一切決めない場合だけ、適用を新しいdecisionにしない。一つでも具体判断が必要なら「機械的適用」と呼んで議論を省略しない。
    - ルール: 事後reconstructionは、最終snapshot、変更file一覧、現在の反省だけで完了にせず、実際に行われた起点、当初認識、提案、feedback、修正、合意、事後状態を遡及する。存在しなかった段階は創作せず、存在しなかったこと自体を記録する。
    - 適用例: 論点10ではvalidatorがcodeであることは先行decisionから分類候補にできるが、production変更の維持、`6.0.0`、primary validator、leaf tasklistは未提示の新判断であるため、事後に`決定`へ補完せず未決として分離する。
    - 文脈外の適用例: API retry上限を三回とする原則が合意済みでも、新しく発見したbatch処理へ同じretryを適用することで処理時間上限や重複実行対策を新たに決めるなら、既存原則の機械的適用として黙って変更せず、具体案を提示して合意を得る。

##### 検証

- **観点:** 事後記述を許したまま、未合意decisionの正当化を防げるか。
- **結果:** 復元対象を実際の会話へ限定し、具体案と明示的合意を追跡できない場合の未決化を必須にするため、成果物から合意を逆算できない。
- **観点:** 既存decisionの本当に自明な適用まで毎回新論点になるか。
- **結果:** 一対一対応で新しい判断を含まない適用と、scope等を新たに決める適用を分離する。前者だけを適用記録に留め、後者はdiscussionへ戻す。
- **弱点:** 「一対一」だけでは判断者が機械的だと思い込む余地が残るため、新しいscope、routing、方針、成果物、実行単位が一つでも生じないかを列挙して検査する。

**決定:** 2026-08-10、提案0を採用する。事後記述は実際に成立した議論の書込み順序を修復する回復手順であり、未合意内容をdecisionへ変える免罪符ではない。具体案と明示的な合意をchat履歴から追跡できない場合は未決とし、成果物変更は合意の証拠に使わない。「既存decisionの機械的適用」は一対一で新しい判断を含まない場合だけに限定し、新しいscope、routing、方針、成果物、実行単位が生じる場合は具体案をdiscussionへ提示して合意を得る。

**ネクストアクション:** 完了。`plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`の不変条件、chat合意済みdiscussion、handoff同期、事後reconstruction、完了gateへ反映した。skill validatorとMarkdown差分checkは成功した。`doc-enricher` reviewでは、親`skills/README.md`はskill索引、task-designとsteeringはdiscussion内部processを`facilitate-discussion`へ委ねるconsumerであり、今回の内部contractを複製すると多重管理になるため、README／docsへの追加候補なしと判定した。

## 論点12: design合意を通過せず先行適用したstateからの回復を分解する

**ステータス:** 分解済み

**種別:** 認識齟齬 / 後発parent / process逸脱の是正

**起点となった原文:**
> 論点10が知らない間にめっちゃ進んで、さらには勝手にdesign.mdがすべて合意済みとされてtasklistができてるんだけど、何が起きた？

> 論点10の「起点となった原文」が論点10の初回提起状態を受けたセッションへの議論の記述になっていて、わけわからないし、論点10自体が何を問題としてどこまでをスコープとしていた論点か全くわからない。イテレーション2を見ても、今後論点10として継続して続けるか、これを親論点として別論点に広げたほうが良いような論点密集イシューかもわからない

**提起の背景:** 個別論点の合意から統合designの合意を経ずにproduction反映とtasklist作成まで進めた結果、正しいartifact stateへの回復、最終validation contract、validator codeのplan routing、release versionという相互依存する複数decisionが発生した。これらを当初の論点10へ集約すると、元のvalidator routingというleaf scopeを失い、どの問いから解くべきか判定できない。

### 現在の合意対象

**参照する現在案:** イテレーション2の提案2

**今回確認すること:** 先行適用からの回復を後発parentの論点12で管理し、active childをartifact stateの論点13、validator実装routingの論点10、release versionの論点15とする境界は維持する。独立decisionでなかった論点14も履歴として閉じたままにする。その上で、分類保留zeroより前に必要な最終design合意を論点10、15の先行条件にしていた循環だけを修正し、具体的な完成後contract review完了 → 論点10、15 → 分類保留zero → 統合design最終合意 → execution plan設計の順とする。

### 議論の変遷

#### 事象の記述

- 論点1〜9の個別合意後、統合`design.md`への明示的な合意を得ずにproduction本文を変更した。
- production反映後のvalidator失敗から、validator code、version、generic validatorの扱いを新しい判断として発見した。
- 発見した判断をユーザーへ提示せず、論点10を決定扱いし、`design.md`のplan対象更新と`tasklist.md`作成まで進めた。
- 訂正時には、先行適用からの回復、validator contract、plan routing、releaseを一つの論点10の提案へ詰め込んだ。

#### 原因の追跡

- なぜ: 最初に発見したvalidatorというfileを論点のownerにし、その後に判明した上位・兄弟decisionも同じ論点へ追加した。
- なぜ: feedbackを受けるたびに「この結論が変わると同じ実装範囲が変わるか」を再判定せず、同じ事故に関する話題なら同一iterationだと判断した。
- なぜ: 依存関係を持つ複数decisionについて、後発parentを作りleafへ分解する手順を適用しなかった。

#### 根本原因0 + 提案0

- **根本原因0:** 先行適用という一つの事象と、その事象から生じた複数の独立decisionを同一視し、最初に存在した論点10へ集約した。そのため、論点10の起点、scope、現在の判断対象、次に解くべき上位問いが不明になった。
- **提案0（合意済み）**:
  - 総論: 先行適用から正規のtask-design stateへ戻る上位decisionを後発parentの論点12とし、結論と依存入力が異なる四つのleafへ分解する。
  - 各論:
    - ルール: 論点13は、`design.md`、production差分、作成済み`tasklist.md`をどの状態へ戻し、統合designの議論をどこから再開するかだけを決める。
    - ルール: 論点14は、最終contractに対して何をどのvalidatorが検証するかだけを決める。
    - ルール: 論点10は、論点13と14の出力を受け、repository validatorの実装変更をexecution planへ載せるかだけを決める。
    - ルール: 論点15は、最終差分の互換性からrelease versionと更新時期を決める。
    - ルール: 既存論点10を論点12のchildへreparentし、元のvalidator routing scopeを維持する。論点11はdiscussion一般contractの独立decisionなのでparentへ含めない。
    - 依存順序: 論点13 → 統合designのreview・合意 → 論点14 → 論点10 → 論点15。上位入力が未決のchildは`保留`とし、具体案を先取りしない。

##### 検証

- **観点:** 一つのleaf論点が一つのdecisionだけを持つか。
- **結果:** artifact state、validation contract、code routing、release versionを別leafへ分け、各結論の影響範囲を分離する。
- **観点:** 後発parentが単なるtopic一覧にならないか。
- **結果:** 論点12自身が、分解境界、reparent、依存順序、完了条件を決める実質的なdecisionを持つ。
- **弱点:** 統合designのreview中に新しい依存decisionが判明する可能性がある。その場合は既存childへ無理に混ぜず、論点12の分解decisionをiterationで再評価する。

**当時の決定:** 2026-08-10、提案0を採用する。論点12を後発parentとし、論点10、13、14、15をchildとして管理する。最初に論点13を扱い、他childは依存入力が揃うまで保留する。論点11は独立論点のまま維持する。

**当時のネクストアクション:** 論点13で合意したartifact stateを適用し、統合`design.md`のreviewへ戻る。統合designが合意される前に、論点10、15へ進まない。

### イテレーション1: 独立decisionでなかった論点14をactive childから外す

**受領したfeedback:**
> 論点14って何が問題なの？

論点14の実在する問題を再検証した結果、repository validatorの旧contract固定は論点10の実装対象であり、generic skill validatorの`model`／`effort`拒否はこのmulti-runtime plugin全体に適用できない補助toolの適用範囲だった。二validator間の新しい責務設計という独立decisionは存在しないと提案し、ユーザーから`ok`を得た。

#### 検証

- **観点:** 論点12のactive childを四つのまま維持すべきか。
- **結果:** いいえ。論点14が所有するとしたvalidation contractは、repository contractの追随実装として論点10に含まれる。generic validatorの適用範囲は新しい成果物contractを決めない。
- **弱点:** generic validatorの全結果を無視すると、対応可能な一般構文errorまで見逃す。補助toolとして使える検査は使うが、非対応frontmatter fieldの失敗をacceptance gateにしない。

#### 根本原因1 + 提案1

- **根本原因1:** 二つのtoolが異なる結果を返した事象から、toolの適用範囲を確認せず「validator間の責務を設計する必要がある」という新しいdecisionを作った。
- **提案1（合意済み）**:
  - 総論: 論点14を独立した未決leafとして扱わず、診断訂正を記録して閉じる。
  - 各論:
    - ルール: 論点12のactive childは論点13、10、15とする。論点14は履歴として残すが、後続の依存先にしない。
    - ルール: 依存順序は論点13完了 → 統合designのreview・合意 → 論点10 → 論点15とする。
    - ルール: repository validatorの追随実装は論点10、release versionは論点15が所有する。

**決定:** 2026-08-10、提案1を採用する。論点14をactive childと依存順序から外し、論点10と15のowner境界は維持する。

**ネクストアクション:** 統合designのreviewへ進む。論点14のための追加discussionは行わない。

### イテレーション2: 分類保留の解消を統合design最終合意より前へ戻す

**受領したfeedback:**
> ok

論点31の反映後にtask-design lifecycleを再評価したところ、論点10、15を統合design最終合意後に置く既存順序と、分類保留zeroをdesign phase完了条件とする論点30のdecisionが循環すると判明した。ユーザーの`ok`を受け、この依存順序の修正案を記録する。

#### 検証

- **観点:** 論点10、15を最終design合意後まで保留したまま、論点30のdesign phase完了条件を満たせるか。
- **結果:** 満たせない。両対象は`分類保留`にあり、分類保留sectionが存在する間はdesign phaseを完了できない。一方、両論点の保留条件はdesign合意であるため、どちらも先へ進めない。
- **観点:** 論点10、15を先に再開すると、未合意の完成後contractをvalidatorまたはversionで固定しないか。
- **結果:** 論点16〜31で、skill policy、caller contract、workflow、file成果物、contract preservation、lifecycle接続、production template反映まで、両論点の入力となる具体的な完成後contractは個別に合意・反映済みである。未完なのは、この`design.md`全体を最終成果物として承認するgateであり、分類を決める入力contract自体ではない。
- **観点:** 論点15は論点10のdecisionへ依存するか。
- **結果:** 論点15の入力は最終公開contractと互換性である。論点10はそのcontractへ追随するvalidator codeをexecution planへ載せるかを決めるだけで、公開contractを変更しない。議論は一件ずつ進めるため論点10を先に扱うが、論点15を論点10の結論から意味的に導く関係にはしない。
- **弱点:** 論点10または15の検討中に、既存の完成後contract自体を変更すべきfeedbackが出る可能性はある。その場合は分類だけを決めず、該当するdesign discussionへ戻して具体contractを再合意し、付録の依存を再計算する。

#### 論点routingの判断

- **discussion scopeへ属する理由:** 先行適用から正規のtask-design stateへ戻す際のchild分解と依存順序は、論点12が所有するdecisionである。循環を残すと回復完了条件を満たせない。
- **同一decision scopeとしてiterationを継続する理由:** validator、version、成果物内容の新しいleaf decisionではなく、論点12のイテレーション1で定めたchildの処理順と保留条件を修正するfeedbackである。

#### 修正先の判断

- **診断levelへの遡及:** 「統合designのreview」と「統合designの最終合意」を一つのgateとして扱った依存モデルが誤っている。個別contractのreviewで分類入力を確定する段階と、分類zeroを含むdesign全体を最終合意する段階へ分ける。

#### 根本原因2 + 提案2

- **根本原因2:** 最終design合意を、分類decisionの入力を確定するreview gateと、分類zero後にdesign全体を承認するcompletion gateの両方として使った。その結果、最終合意を待つ分類保留と、分類保留zeroを待つ最終合意が相互依存した。
- **変更点:** 論点13、10、15というchild境界は維持する。旧依存順序の「統合designのreview・合意」を、具体的な完成後contract reviewと最終design合意へ分離し、論点10、15をその間へ置く。
- **提案2（現時点）**:
  - 総論: 回復順序を、`論点13完了 → 具体的な完成後contract review完了 → 論点10 → 論点15 → 分類保留zeroとexecution plan対象確定 → 統合design最終合意 → 条件付きexecution plan設計`へ修正する。
  - 各論:
    - ルール: 論点13のartifact state回復、論点16〜30の完成後contract再構成・接続review、論点31のproduction template batch反映を、論点10、15へ必要な具体contract reviewの完了とする。これらの個別decisionを統合design全体の最終合意へ読み替えない。
    - ルール: 論点10を次に再開し、`scripts/verification/validate-plugin.mjs`のcode変更が現在の合意済みrepository contractへ追随するために必要か、必要ならexecution plan対象へ載せるかだけを決める。validatorの実装、tasklist作成、releaseは行わない。
    - ルール: 論点15は、合意済みの最終公開contractとbaselineの互換性からversionと更新時期を決め、その変更をどのrouting stateへ置くか確定する。処理順は論点10の後だが、validator routingの結論をversion判定の意味的入力にはしない。
    - ルール: 論点10または15の結論が完成後contract自体の変更を要求する場合は、分類を確定せず、影響するdesign sectionのdiscussionへ戻る。再合意後に両論点の入力を再評価する。
    - ルール: 論点10、15のdecisionを`design.md`へ反映した後、`分類保留`sectionを削除し、execution plan対象またはtask-design内適用のstateを確定する。このzero stateを含む`design.md`全体を初めて最終合意へ出す。
    - ルール: 統合design最終合意後、execution plan対象が一件以上ならtasklistまたはroadmapを設計・reviewし、対象zeroならplanを作らず`planless_complete`へ進む。分類未確定のままplanを先取りしない。
    - 適用例: validator codeを変更する必要があると論点10で決まれば`execution plan対象`へ移す。version宣言の値と更新時期を論点15で決めた後、その作業特性に応じたstateへ移す。二行を確定して分類保留をzeroにしてから、design全体の最終合意を求める。

##### 検証

- **観点:** 最終design合意前に論点10、15を扱うことで、以前の未合意tasklist作成を再発しないか。
- **結果:** 両論点で行うのはdesign decisionとroutingだけであり、実装、version変更、tasklist作成は行わない。分類zero後のdesign全体合意を経るまでplan設計へ進まない。
- **観点:** 「具体的な完成後contract review完了」が新しい曖昧gateにならないか。
- **結果:** 完了済み論点16〜31という具体的な入力を列挙し、論点10、15が依存するskill policy、caller contract、workflow、file成果物、保存差分、lifecycle、production templateを特定する。工程名だけを依存欄へ置かない。
- **観点:** 論点10と15を一つのdecisionへ再統合しないか。
- **結果:** code変更のplan routingとrelease互換性は別leafのまま維持し、一件ずつ決定・反映する。parentが決めるのは順序と戻り先だけである。
- **弱点:** 具体contract reviewが完了していても、論点10、15の検討で新しい欠落を発見する可能性はzeroではない。発見時の戻り先をdesign discussionへ固定し、classificationやplanへ押し込まない。

**以前の決定:** イテレーション1では、論点13完了 → 統合designのreview・合意 → 論点10 → 論点15とした。このうちchild境界と論点14の除外は維持し、最終合意を論点10、15より前へ置いた順序だけを変更する。

**決定:** 2026-08-10、ユーザーの`ok`を受け、提案2を採用する。論点13、10、15というchild境界と論点14の除外は維持し、回復順序を`論点13完了 → 具体的な完成後contract review完了 → 論点10 → 論点15 → 分類保留zeroとexecution plan対象確定 → 統合design最終合意 → 条件付きexecution plan設計`へ修正する。論点10、15ではdesign decisionとroutingだけを確定し、実装、version変更、tasklist作成は統合design最終合意より前に行わない。

**反映結果:** `design.md`付録のrepository validatorについて、循環を生んでいた`統合designのreview・合意`への依存を外し、論点16〜31で具体contract reviewが完了していることと、code変更の要否・execution plan掲載が論点10で未決であることを明記した。

**ネクストアクション:** 論点12は論点10、15のchild decision待ちとして維持する。次は論点10を再開し、validator code変更の要否とexecution plan routingだけを提案する。この時点では論点15、統合design最終合意、tasklist作成へ進まない。

**現在の進行状態（2026-08-10）:** 論点10はvalidator assertionをtask-design内で追随済み、論点15は`6.0.0`への同期を統合design最終合意後にtask-design内で行うdecisionとして確定した。active childのdecisionがすべて確定したため、次は分類保留zeroを反映した統合designの最終合意へ進む。version実値、release、tasklistはまだ変更・作成しない。

**回復完了状態（2026-08-10）:** ユーザーの`ok`により統合`design.md`を最終合意した。論点15の反映待ちを`6.0.0`へ同期し、repository validator、四宣言一致、production実差分の逆引き、三result scenario、Markdown差分を検証した。分類保留、task-design内反映待ち、execution plan対象はすべてzeroであり、未合意に作成されたtasklistを再作成せず、先行適用から正規の`planless_complete`成立状態へ回復した。

## 論点13: design・production差分・tasklistをどの状態へ戻すか

**ステータス:** 決定

**親論点:** 論点12

**種別:** 認識齟齬 / process逸脱の是正

**起点となった原文:**
> 論点10が知らない間にめっちゃ進んで、さらには勝手にdesign.mdがすべて合意済みとされてtasklistができてるんだけど、何が起きた？

> 論点10も何がテーマで、初出の論点については何かアクションを行うって言ってたから合意したけど、何をやって、そして本当に決定としていいだけの状態になったのかも知らない

**提起の背景:** 論点1〜9は個別に合意されたが、それらを統合した`design.md`全体は合意されていない。一方でproduction本文はすでに変更され、`design.md`には適用済み・execution plan対象が確定したような記載が入り、未合意の`tasklist.md`も存在する。次のdesign議論へ進む前に、各artifactを何として扱い、どの変更を直ちに戻すかを一意にする必要がある。

### 現在の合意対象

**参照する現在案:** イテレーション1の提案1

**今回確認すること:** ユーザーが全差分を確認し、個別の合意どおりだと認定したproductionは合意済み成果物として維持する。一方、統合文書として明示合意されていない`design.md`は未合意draftへ訂正し、未合意で作成した`tasklist.md`を撤去して、統合designのreviewへ戻る。

### 議論の変遷

#### 事象の記述

- task-design、template、steering、公開READMEのproduction差分は、統合designの合意前に適用された。
- `design.md`は全体が合意済みであるかのように適用済み欄とexecution plan対象を更新された。
- `tasklist.md`は未提示のvalidator・version案から作成され、taskは一件も実行されていない。
- production差分には、個別論点で合意済みの内容と、統合時に初めて評価可能な内容が混在している。

#### 原因の追跡

- なぜ: 個別論点の合意を、そのdecisionの`design.md`反映だけでなく、統合production全体への適用許可として扱った。
- なぜ: production適用後に不整合が判明した場合の状態を、合意済み、未合意、rollback対象のどれとして扱うか決めずに先へ進んだ。
- なぜ: 誤って作成したtasklistを残したまま停止したため、実行可能なplanと未合意artifactの区別がfileの存在から判断できない。

#### 根本原因0 + 提案0

- **根本原因0:** 統合design合意前に複数artifactを変更した後、その差分を「合意済み成果物」「直ちに戻す変更」「review用の暫定状態」のどれとして扱うかを決める回復contractがなかった。
- **提案0（現時点）**:
  - 総論: production差分は完成状態とも即時rollback対象ともみなさず、統合designから一括reconcileするための暫定差分として凍結する。一方、合意状態を偽る`design.md`の記述と未合意tasklistは直ちに解消し、正規のdesign reviewへ戻る。
  - 各論:
    - ルール: 論点1〜9の個別decisionは維持するが、それらを統合した`design.md`全体を未合意draftとして扱う。個別の`ok`を統合designまたはproduction全体への合意にしない。
    - ルール: 先行反映したtask-design、template、steering、公開READMEは、これ以上patchしない暫定差分として保持する。統合design合意前に全面rollbackすると、個別合意済み部分とmigration監査結果まで失うため行わない。
    - ルール: `design.md`は、この提案への合意後に、統合designが未合意であること、production差分が暫定であること、execution plan対象が未確定であることを明示する状態へ訂正する。論点10の未合意案を根拠に追加した確定表現とplan対象は取り除く。
    - ルール: 未合意で作成した`tasklist.md`は、この提案への合意後に撤去する。内容をreview、実行、後続planのbaselineとして再利用しない。
    - ルール: `task-design_template_prototype`、function migration ledger、個別合意済みdiscussion decision、未合意draftの`design.md`を統合design reviewの入力にする。現在のproduction状態をsource of truthにしない。
    - ルール: 統合design合意後、prototypeとledgerからproduction差分を一括reviewする。合致する部分は維持し、欠落、矛盾、未合意追加だけを同じreconcileで修正または撤去する。
    - ルール: production reconcileと非code validationが完了するまで、validator、version、execution planの具体scopeを確定しない。
    - 適用順序: 提案0への合意 → `design.md`の状態訂正と`tasklist.md`撤去 → 統合designのreview・合意 → production差分の一括reconcileと非code validation → 論点14、10、15の順で再開する。

##### 検証

- **観点:** production差分を残すことで、未合意内容が既成事実化しないか。
- **結果:** `design.md`へ暫定状態を明示し、productionをsource of truthにせず、prototype、ledger、discussion decisionから一括reconcileする。
- **観点:** 即時rollbackしないことで、誤った変更が残り続けないか。
- **結果:** 追加patchを停止し、統合design合意直後のreconcileを必須にする。暫定期間をdesign reviewまでに限定する。
- **観点:** `tasklist.md`撤去で必要な情報を失わないか。
- **結果:** tasklistは未合意案から生成され、taskも未実行である。発見事実と未合意提案は論点10、12〜15へ保存するため、plan fileを残す必要はない。
- **弱点:** working treeだけを見た別sessionがproduction差分を確定仕様と誤認する可能性がある。`design.md`の明示的な未合意表示とtasklist撤去を同じ適用で行い、次のactionを統合design reviewに限定する必要がある。

**当時のdecision状態:** 未決。提案0は正しいartifact stateと回復actionについて初めて提示した案であり、この時点ではユーザーの合意を得ていなかった。

**当時のネクストアクション:** 提案0への合意を確認する。合意前は`design.md`、production差分、`tasklist.md`を変更しない。

### イテレーション1: productionと統合designの合意状態を分離する

**受領したfeedback:**
> 論点13については、production差分 は全部見たけど、今まで合意したことだから問題ない。「design.mdを未合意draftへ訂正、誤って作成したtasklist.mdを撤去してから統合designのreviewへ戻る」はそれで。

#### 検証

- **観点:** production差分を未合意の暫定差分として扱う必要があるか。
- **結果:** ない。ユーザーはproduction差分を全件確認し、これまで個別に合意した内容どおりで問題ないと明示した。productionの合意状態を統合`design.md`の未合意状態へ連動させると、実在する個別合意を逆に失う。
- **観点:** productionが合意済みなら、`design.md`全体と作成済み`tasklist.md`も合意済みになるか。
- **結果:** ならない。production差分への確認は、統合文書全体の構成・記述への合意や、未提示だったvalidator・version案から作ったexecution planへの合意ではない。

#### 論点routingの判断

- **同一decision scopeとしてiterationを継続する理由:** production、`design.md`、`tasklist.md`の正しい合意状態と回復actionを決める問いは変わらない。提案0のうちproductionを暫定扱いする前提だけをfeedbackで訂正する。

#### 修正先の判断

- **診断levelへの遡及:** 問題はproduction反映そのものではなく、artifactごとに異なる合意のscopeを一括して「未合意」または「合意済み」と扱ったことだった。productionへの個別合意と、統合design・execution planへの合意を分ける。

#### 根本原因1 + 提案1

- **根本原因1:** 統合designの合意を通過しなかったprocess逸脱を訂正する際、ユーザーが実際に確認・合意したproduction差分まで未合意へ巻き戻す案にしていた。artifactごとの具体的な合意対象を追跡せず、同じ作業directoryの状態を一括認定した。
- **変更点:** production差分は合意済みとして維持する。未合意draftへ戻す対象を統合`design.md`に限定し、未合意planである`tasklist.md`だけを撤去する。
- **提案1（合意済み）**:
  - 総論: production、統合design、execution planの合意状態を別々に認定し、実在する合意を維持したまま統合design reviewへ戻る。
  - 各論:
    - ルール: 現在のproduction差分は、ユーザーが全件確認し、個別decisionどおりだと合意した成果物として維持する。暫定差分、rollback候補、統合design合意待ちとは扱わない。
    - ルール: `design.md`本文に含まれる個別decisionは維持するが、文書全体は統合review未完了の未合意draftと明示する。productionの合意済み状態を否定する記述は入れない。
    - ルール: validatorの具体変更、execution plan掲載、release versionは論点14、10、15が未決である。`design.md`から未合意の確定表現を除き、分類保留として依存先だけを記録する。
    - ルール: 未合意で作成した`tasklist.md`は撤去し、内容を後続planのbaselineとして再利用しない。
    - ルール: 次は個別decisionと合意済みproductionを入力に、`design.md`全体の整合性、欠落、未合意追加をreviewする。不整合が見つかった場合だけ、該当decisionをdiscussionへ戻す。
    - 適用順序: discussionへdecisionを記録 → `design.md`を未合意draftへ訂正 → `tasklist.md`を撤去 → 統合design review。

##### 検証

- **観点:** productionの既成事実化を許すことにならないか。
- **結果:** 既成事実から合意を逆算していない。今回はユーザーが差分を全件確認し、過去の個別合意どおりだと明示したことを合意根拠にする。
- **観点:** `design.md`を未合意draftにしても、合意済みproductionとの関係が曖昧にならないか。
- **結果:** 冒頭で「productionは合意済み、統合文書はreview待ち、execution planは未確定」と状態を分離して明記する。
- **弱点:** 統合reviewでdesignとproductionの不整合が見つかる可能性は残る。その場合もproduction全体を未合意へ戻さず、不整合を新しい具体decisionとしてdiscussionへ提示する。

**決定:** 2026-08-10、提案1を採用する。production差分は全件確認済み・個別合意どおりの成果物として維持する。`design.md`は統合review待ちの未合意draftへ訂正し、validator、execution plan、release versionの未決事項を分類保留へ戻す。未合意で作成した`tasklist.md`は撤去する。

**ネクストアクション:** 適用完了。production差分を変更せず、`design.md`冒頭でartifactごとの合意状態を分離し、未合意だったvalidator・version・execution planの断定を分類保留へ戻した。未実行の`tasklist.md`も撤去した。次は統合design reviewへ戻る。

## 論点14: 最終validation contractとvalidator間の責務を決める

**ステータス:** 決定

**親論点:** 論点12

**種別:** TBDヒアリング / validation設計

**提起の背景:** generic skill validatorはbaseline由来の`model`／`effort`を許可せず、repository validatorは旧task-design contractを固定している。どちらの失敗を許容するかを先に選ぶのではなく、統合designの完成後contractに対して何をどこで検証するかを決める必要がある。

### 現在の合意対象

**参照する現在案:** イテレーション1の提案1

**今回確認すること:** 二validator間に独立した責務設計が必要という診断を撤回する。repository validatorはrepository固有contractの検証ownerとして合意済みproductionへ追随させ、generic skill validatorは対応可能な一般検査だけに使う補助toolとし、非対応の`model`／`effort`拒否をacceptance failureにしない。

### 議論の変遷

#### 事象の記述

- generic skill validatorはtask-designとsteeringのClaude用frontmatterを不許可とした。
- repository validatorはrelease version、旧固定観点、通常／軽量mode、旧gate heading、二resultだけを必須にしている。
- 旧論点10では、generic validatorの失敗を許容し、repository validatorをprimary validationとする案を未提示のまま決めた。

#### 原因の追跡

- なぜ: validatorの失敗を、どのcontractが正しいかを設計する入力ではなく、どちらかを無効扱いする選択として処理した。
- なぜ: 統合designが未合意のため、validatorが検査すべき完成後contract自体が確定していない。

#### 根本原因0 + 提案0

- **根本原因0:** 検証対象の完成後contractが未確定なのに、既存validatorのどちらを正本にするかを先に決めようとした。
- **提案0（合意済みの保留方針）**:
  - 総論: 統合designとartifact stateが確定するまでvalidation方針を保留し、確定後に検証責務を一つのdecisionとして設計する。
  - 各論:
    - ルール: 論点13と統合design reviewが完了するまで、generic validatorの失敗を正式に許容しない。
    - ルール: 同じ依存解消まで、`model`／`effort`を削除せず、repository validatorをprimaryと決めない。
    - 再開時の判断対象: frontmatter構文、task-design／steering contract、outcome section、三result、旧tasklist／roadmap contract、version整合をどのvalidatorが所有するか。

##### 検証

- **観点:** 保留中にvalidator方針が既成事実化しないか。
- **結果:** 許容、削除、primary指定の三actionを禁止し、再開条件と判断対象だけを確定する。
- **弱点:** 依存解消までrepository validatorは失敗したままになる。これを実装失敗ではなく未確定contractの証拠として保持し、green化を先行しない。

**当時の決定:** 2026-08-10、論点14のscopeと保留条件は合意済み。最終validation contractとvalidator間の責務は、論点13と統合design reviewが未完了のため保留する。

**当時のネクストアクション:** 論点13と統合design reviewの完了後に再開する。それまではvalidator設定、frontmatter、検査codeを変更しない。

### イテレーション1: validator間の対立という診断を撤回する

**受領したfeedback:**
> 論点14って何が問題なの？

#### 検証

- **観点:** generic skill validatorとrepository validatorは、同じ対象に対する競合する正本か。
- **結果:** 違う。generic skill validatorは`model`／`effort`を受理しない一般toolだが、このrepositoryのbaselineとrepository validatorは両fieldを明示contractとして持つ。generic toolの非対応はrepository contractを変更する根拠にならない。
- **観点:** repository validatorの旧仕様固定を直すために、別途validation contractを設計する必要があるか。
- **結果:** ない。何を正しいrepository contractとするかは合意済みproductionと統合designが定める。validatorはそのconsumerとして追随し、code変更のroutingは論点10が所有する。

#### 論点routingの判断

- **独立decisionとして継続しない理由:** generic toolの適用範囲とrepository validatorの追随実装を分ければ、論点14だけが決める成果物contractが残らない。追随実装は論点10、versionは論点15に既存ownerがある。

#### 修正先の判断

- **診断levelへの遡及:** 「二validatorが失敗した」ことを「二validatorの責務が競合している」と読み替えた診断が誤りだった。errorを消す前に、各toolが何を検証可能かを確認すべきだった。

#### 根本原因1 + 提案1

- **根本原因1:** generic validatorをrepositoryのacceptance gateとして採用した根拠がないのに、repository固有validatorと同列の正本候補として扱い、存在しないowner競合を作った。
- **提案1（合意済み）**:
  - 総論: 論点14に独立したvalidation設計を残さず、toolの適用範囲を整理して閉じる。
  - 各論:
    - ルール: repository固有contractは`scripts/verification/validate-plugin.mjs`が検証する。旧contract固定の追随実装は論点10で扱う。
    - ルール: generic skill validatorは、対応可能な一般構文・共通fieldの補助検査に使えるが、非対応の`model`／`effort`拒否を今回のacceptance failureにしない。
    - ルール: generic validatorをgreenにする目的でbaselineの`model`／`effort`を削除しない。
    - ルール: release versionは論点15で扱い、この論点へ戻さない。

##### 検証

- **観点:** generic validatorの有用な検査まで失わないか。
- **結果:** tool全体を無効化せず、対応可能な検査は補助証拠として使う。repository固有fieldの非対応だけをacceptance判定から外す。
- **弱点:** generic validatorの将来versionが`model`／`effort`へ対応する可能性はある。その時点のtool contractは改めて確認するが、今回のrepository contractを推測で変更しない。

**決定:** 2026-08-10、提案1を採用する。論点14は独立した未決decisionではなかった。repository validatorをrepository固有contractの検証ownerとし、追随code変更は論点10へ戻す。generic skill validatorは対応可能範囲の補助toolとし、`model`／`effort`拒否をacceptance failureにしない。

**ネクストアクション:** 完了。論点12、10、15と`design.md`から論点14への依存を除く。validator codeは変更しない。

## 論点15: release versionと更新時期を決める

**ステータス:** 決定

**親論点:** 論点12

**種別:** TBDヒアリング / release設計

**提起の背景:** 旧論点10では、task-design contractの変更を破壊的と判断して配布versionを`6.0.0`へ上げ、validator codeと同じtasklistへ含める案を作った。しかしproduction差分と最終validation contractが未確定なため、互換性判定も更新時期も決定できない。

### 現在の合意対象

**参照する現在案:** イテレーション1の提案1

**今回確認すること:** 合意済みの公開contractと移行前contractを比較し、SemVer上の完成値を決める。version宣言とvalidator期待値は、本番application codingではなくtask-design内で反映する配布metadataとして扱う。ただし、先行適用からの回復中にrelease contractを再び先取りしないよう、値とroutingはこの論点で決め、実反映は統合design最終合意後に一batchで行う。

### 議論の変遷

#### 事象の記述

- 配布versionは一度`6.0.0`へ変更した後、validator変更より先行できないと判断して`5.2.0`へ戻した。
- 現在の四つのversion宣言は`5.2.0`で一致している。
- finalなtask-design、steering、validatorのcontractと互換性は未合意である。

#### 原因の追跡

- なぜ: 個別論点の変更量から破壊的変更だと判断し、統合した最終公開contractとの差分を確認する前にversionを決めた。
- なぜ: version更新を独立したrelease decisionではなく、validator codeへ付随する機械的な変更として扱った。

#### 根本原因0 + 提案0

- **根本原因0:** release versionの入力である最終公開contractと互換性が未確定なのに、先に`6.0.0`と更新batchを固定した。
- **提案0（合意済みの保留方針）**:
  - 総論: release versionは最終差分から判定し、validator実装routingとは別decisionとして扱う。
  - 各論:
    - ルール: 統合designと論点10が完了するまでversionを変更しない。
    - ルール: 再開時に、公開result union、既存caller互換性、削除・名称変更、validation contractを確認してSemVerを判定する。
    - ルール: versionを変更する場合は、四つの宣言を一回のrelease変更として同じ値へ揃える。
    - ルール: `6.0.0`を既定値にせず、最終差分が要求するMAJOR、MINOR、PATCHを根拠とともに決める。

##### 検証

- **観点:** version決定を遅らせても配布宣言が不整合にならないか。
- **結果:** 現在は四宣言が`5.2.0`で一致しており、依存解消まで変更しない。
- **弱点:** 現在のworking treeには`5.2.0`宣言後の追加差分があるため、現状態をreleaseしないことが前提になる。論点15の決定前にinstall／releaseしない。

**決定:** 2026-08-10、論点15のscopeと保留条件は合意済み。具体的なrelease versionと更新時期は依存入力が未確定のため保留する。

**ネクストアクション:** 統合designと論点10の完了後に再開する。それまではversion宣言を変更せず、現在のworking treeをreleaseしない。

### イテレーション1: 最終公開contractからversion値と反映routingを決める

**受領したfeedback:**
> ok

論点10のvalidator assertion追随が完了し、論点12で定めた具体的な完成後contract reviewも完了しているため、保留していた互換性判定を再開する。以前に一度置いた`6.0.0`を追認するのではなく、現在の公開contractから改めて判定する。

#### 事象の記述

- `maintenance-plugin-context`が定める現在の配布version正本は、二つのplugin manifestとroot marketplaceの二箇所にある四宣言であり、すべて`5.2.0`で一致している。
- repository validatorの`expectedRelease`だけが`5.0.0`であり、現在のvalidator failureはこの不一致一件に限定されている。
- task-designは、移行前の「通常routeではtasklistまたはroadmapを作る」「planなしは軽量mode」というcontractから、execution plan対象がzeroでも同じ深さでdesign・対象成果物反映・validationを完了できるcontractへ変わる。
- callerへ返すresultは`tasklist_ready | roadmap_ready`から`tasklist_ready | roadmap_ready | planless_complete`へ変わり、steeringはplan fileが存在しない正常完了を受理して非dispatchで完了する。

#### 検証

- **観点:** 既存の二result名とfieldを維持しているため、後方互換な機能追加としてMINORでよいか。
- **結果:** よくない。既存callerが依存できた「task-design完了時にはplan fileがある」という成立保証がなくなり、resultの網羅処理、artifact存在確認、実行開始確認、dispatch、子完了伝播を変更しなければ新しい正常系を扱えない。既存二resultを維持していても、workflowの公開contract全体では破壊的変更である。
- **観点:** version変更は本番application codingとしてexecution planへ載せるか。
- **結果:** 載せない。四つのJSON値とvalidator期待値を同じ確定値へ揃える、判断済みの配布metadata反映であり、本番applicationのruntime behaviorを実装してtestする作業ではない。段階実行やユーザー指定にも該当しない。
- **観点:** 論点15の合意直後に反映してよいか。
- **結果:** 反映しない。論点12の回復順序は、論点15で値とroutingを確定して分類保留をzeroにした後、統合designを最終合意し、それから実変更へ進むと定めている。versionは統合された公開contractを表すため、この明示依存を越えて先行変更しない。

#### 論点routingの判断

- **task-design内で反映する理由:** version値の決定、四宣言の同期、validator期待値の同期は、合意済みrelease contractをplugin metadataと補助validatorへ転記する作業である。execution plan対象となる本番application codingではない。
- **即時反映しない理由:** 作業特性はplan不要だが、適用時期には統合design最終合意への依存がある。したがって`execution plan対象`ではなく、合意後は`task-design内の対象成果物反映待ち`へ置く。
- **同一batchで扱う範囲:** 四つのversion宣言と`scripts/verification/validate-plugin.mjs`の`expectedRelease`だけを同じ値へ揃える。release、install、cache更新、commit、pushはこのbatchに含めない。

#### 根本原因1 + 提案1

- **根本原因1:** 以前の案は、破壊的変更の具体的なcaller影響を示さず`6.0.0`を置き、version metadataの反映時期をvalidator codeのtasklist routingへ付随させていた。そのため、値の妥当性と作業ownerの妥当性を別々に判断できなかった。
- **変更点:** 現在の公開contractからMAJOR判定を導き、値、routing、適用依存、batch境界を分離して決める。
- **提案1（合意済み）**:
  - 総論: tumeda-devの次のrelease versionを`6.0.0`とする。既存callerが依存したplan必須の正常系を、planlessを含む三resultの正常系へ変更するためMAJORを上げる。
  - 各論:
    - ルール: `5.2.0`から`6.0.0`へ一度だけbumpし、pre-release suffixやbuild metadataを付けない。
    - ルール: 合意後、`design.md`付録の現在の`分類保留`を削除し、四version宣言と`expectedRelease`を`task-design内の対象成果物反映待ち`へ移す。待つ依存は統合design最終合意だけとし、execution plan対象は`なし`へ確定する。
    - ルール: 統合design最終合意後、二つのplugin manifest、root marketplaceの二宣言、validatorの`expectedRelease`を一batchで`6.0.0`へ変更する。
    - ルール: 反映後は四宣言の完全一致、suffix不在、JSON parse、repository validatorのgreen、`git diff --check`を確認し、`design.md`付録を反映待ち`なし`・適用済みへ更新する。
    - ルール: 統合design最終合意で公開contractが変わり互換性判定へ影響した場合は、この値を機械適用せず論点15を再開する。
    - ルール: version更新をrelease実行の承認と解釈しない。install、release、commit、pushは別の明示依頼なしに行わない。

##### 検証

- **観点:** `6.0.0`は変更量の大きさではなく互換性から導けているか。
- **結果:** callerがplan fileの存在を前提にできなくなり、新しいresult分岐と非dispatch完了を実装しなければならないという公開contractの非互換を根拠にしている。
- **観点:** tasklistを作らずに複数fileを変えることが、段階実行条件の見落としにならないか。
- **結果:** 五つの値は同じrelease値を転記する一つの同期変更であり、途中checkpointごとに異なる判断や外部coordinationを要しない。変更と検証を同一task-design batchで完了できる。
- **弱点:** version値だけを先に決めても、統合design最終合意で公開contractが変更されれば判定が古くなる。適用を最終合意後へ止め、変更時の論点再開条件を明示する。

**決定:** 2026-08-10、ユーザーの`ok`を受け、提案1を採用する。次のrelease versionは`6.0.0`とする。plan必須の正常系をplanlessを含む三resultへ変える公開contractの非互換を理由にMAJORを上げる。四version宣言と`expectedRelease`はexecution planへ載せず、統合design最終合意後にtask-design内の一batchで同期する。

**反映結果:** `design.md`に次期release version `6.0.0`、MAJOR判定の根拠、五つの同期対象、validation条件を反映した。付録では`分類保留`sectionを削除し、version同期を統合design最終合意に依存する`task-design内の対象成果物反映待ち`へ移し、execution plan対象を`なし`に確定した。function migration ledgerのVAL-E001／VAL-C001と監査stateも同じdecisionへ同期した。version実値と`expectedRelease`は変更していない。即時反映後に`doc-enricher`を提案modeで適用し、root READMEと`skills/README.md`を確認したが、SemVer判定と四宣言同期は`maintenance-plugin-context/SKILL.md`に正本があり、READMEへ重複させる高レバレッジ候補はないと判定した。

**ネクストアクション:** version同期の反映待ちを明示した状態で、統合`design.md`全体の最終合意を確認する。合意後に四version宣言と`expectedRelease`を`6.0.0`へ一括同期し、validationと残余migration監査を完了する。tasklistとroadmapは作らない。

**最終反映結果（2026-08-10）:** ユーザーの統合designへの`ok`を受け、二つのplugin manifest、root marketplaceの二宣言、validatorの`expectedRelease`を`6.0.0`へ一括同期した。四宣言のJSON parse・完全一致・suffix不在、repository validator全件pass、prototype／production templateのbyte一致、tasklist／roadmap関連fileのbaseline byte一致、production実差分の未分類削除0・未分類追加0、三result scenario、`git diff --check`を確認した。`design.md`付録を反映待ち`なし`、execution plan対象`なし`へ更新し、tasklistとroadmapは作成していない。release、install、commit、pushは行っていない。

## 論点16: design.mdの「完成後の姿」を選択済みoutcome sectionで再構築する

**ステータス:** 分解済み

**親論点:** 論点12

**種別:** 認識齟齬 / design review対象の具体化

**起点となった原文:**
> 「統合design review」ってラベルだけ渡されて、何がテーマで何を求められているかわからない。あと今のdesign.mdの「完成後の姿」ってどのフォーマットに則ってるの？ もしかして何のフォーマットにも則ってなくてお前の大喜利？ design.mdの完成後の姿ってどういう意図の存在かわかってる？

### 現在の合意対象

**参照する現在案:** イテレーション2の提案2

**今回確認すること:** 曖昧な「統合design review」を取り下げる。既知の漏れ候補について、残すもの、捨てるもの、残す場合のoutcome sectionを子論点で先に決める。その決定で`design.md`を再構成した後、旧記述との一文・意味単位の照合から残余差分を列挙し、各差分を残すか、捨てるか、どこへ置くかを追加discussionで決める。

### 議論の変遷

#### 事象の記述

- 次のactionを「統合design review」とだけ案内し、reviewのテーマ、確認対象、期待する判断を示していなかった。
- 現在の`design.md`第3章は、「task-designの目的と設計思想」「designの作成と収束」「成果物変更の分類と反映」「execution plan判定gate」「design template directory」「tasklistとroadmap」「steeringとの境界」「移行時の検証」の独自8節で構成されている。
- prototypeの`outcome-sections/catalog.md`は、成果物に応じて少なくとも一つのoutcome sectionを選び、その必須fieldを`design.md`へ挿入することを要求している。
- skill／prompt／規範の作成・変更では`file-deliverables.md`と`workflow.md`が必須である。今回はcallerへ返すresult unionも変わるため、`public-contracts.md`も必要になる。
- 現在の第3章には、`workflow.md`が要求する「ownerと責務」「状態と遷移」「必須順序とhandoff」「失敗・取消・再開」や、`file-deliverables.md`が要求する「対象と読者」「完成後の内容と構造」「記載する原則と例」「配置・形式」という骨格がない。

#### 原因の追跡

- なぜ: 個別論点で合意した内容を一つの章へ集約すれば「完成後の姿」になると扱い、成果物の種類に対応するoutcome sectionを選択・適用しなかった。
- なぜ: 「完成後の姿」を、後続作業者が判断せず反映できる観測可能な最終状態ではなく、合意事項の総覧として扱った。
- なぜ: 不適合なdraftそのものをreview対象として具体化せず、「統合design review」という工程名だけで次のactionを表現した。

#### 修正先の判断

- **owner:** このsteeringの`design.md`への適用不備であり、task-design productionの仕様欠落ではない。
- **根拠:** productionとprototypeには、成果物に応じたoutcome sectionの選択gateと各sectionの必須fieldがすでに存在する。今回欠けたのは、それを現在の`design.md`へ適用する作業である。
- **多重管理を避ける境界:** outcome sectionの一般規則はproduction templateを正本とし、この論点には今回選ぶsection、現在の不適合、今回の再構築・review対象だけを記録する。

#### 根本原因0 + 提案0

- **根本原因0:** 「完成後の姿」の役割を、タスク完了後の世界を成果物別の必須観点で描き切ることではなく、既出の合意事項を独自見出しへ収容することに縮小した。そのため、形式に則らない第3章と、判断対象を示さない「統合design review」が生じた。
- **提案0:**
  - 総論: 現在の第3章を部分的に見出し変更するのではなく、選択した三つのoutcome sectionから再構築する。「完成後の姿」は、実装手順やmigration確認項目ではなく、全作業完了後に外から観測できるworkflow、公開contract、file成果物を、後続作業で追加判断が発生しない粒度まで描く。
  - `workflow.md`: task-designとsteeringのowner／責務、design開始から結果返却までの状態と遷移、discussion・spike・直接反映・execution plan判定・handoffの必須順序、失敗・取消・再開時の扱いを記載する。
  - `public-contracts.md`: `tasklist_ready | roadmap_ready | planless_complete`の各結果、必須field、callerが各結果を受けた後の挙動、互換性境界を記載する。
  - `file-deliverables.md`: task-design skillと`templates/`の対象読者、完成後のfile tree、各fileの内容と責務、薄い記述を防ぐ原則・具体例、配置・形式・SSOTを記載する。
  - 既存内容のrouting: 現在の第3章にあるdesign収束、成果物変更分類、execution plan gate、steering境界は`workflow.md`へ移す。result unionは`public-contracts.md`へ移す。template directoryとskill／templateの構成は`file-deliverables.md`へ移す。tasklist／roadmapの既存仕様を変えないことは非goalまたはworkflowとの関係として残す。migration検証は「完成後の姿」へ混ぜず、受入条件・検証・riskへ移す。
  - concrete scenario: 少なくとも「依存のないdocs単独変更」「他の未決事項に依存するskill一括変更」「直接反映するdocsとexecution plan対象codeが混在する変更」「不確実性削減のspike」を通し、状態遷移と結果が一意になることを示す。
  - review contract: 再構築後にユーザーへ確認するのは、(1) 完成後workflowのowner・state・gate・handoff、(2) 三resultの公開contract、(3) skill／template群の完成後の内容・構造・記述規律である。production差分の再reviewや、個別論点の再承認は求めない。
  - 順序: この提案への合意後に`design.md`第3章を再構築し、具体化した三対象をreviewする。その合意前に論点10と論点15を再開せず、productionも変更しない。

##### 検証

- **観点:** prototypeの形式に則るだけで、完成後の世界を描くという本来の意図を満たすか。
- **結果:** 三sectionの見出しを置くだけでは満たさない。必須fieldを今回の具体的なworkflow、公開結果、file内容で埋め、四つのscenarioで追加判断が残らないことを確認する。
- **観点:** 既存第3章の合意済み内容を失わないか。
- **結果:** 内容を削除するのではなく、完成後の姿に属するものを三sectionへ再配置し、検証手順など別の役割を持つ内容だけを対応する章へ移す。
- **弱点:** 再構築によって、過去の論点では決まっていなかった状態遷移やfieldが新たな未決事項として露出する可能性がある。その場合は推測で埋めず、独立した新規論点としてdiscussionへ記録する。

#### イテレーション1: 三sectionへの機械的な詰替えでは漏れる内容を先にroutingする

**受領したfeedback:**
> この適用をしたときに、今の記述から漏れるものはある？

##### 検証

- **観点:** 現在の第3章を三つのoutcome sectionだけへ機械的に移せば、すべての意味単位を保存できるか。
- **結果:** できない。完成後のworkflow、公開contract、file成果物は三sectionへ移せるが、設計思想を保存する制約、今回変更しないtasklist／roadmap contract、migrationの実行・検証手順は、完成後の姿そのものではない。これらを三sectionだけへ押し込むと、欠落するか、workflowへ異なる責務が混ざる。
- **観点:** 三sectionの適用自体をやめる必要があるか。
- **結果:** ない。三sectionは完成後の姿に属する内容のownerとして適切である。不足していたのは、現在の第3章全体を「三sectionへ移すもの」と「design coreの別章へ残すもの」に分ける無損失routingである。
- **弱点:** 見出し単位の対応だけでは、同じ見出し内にworkflow、file内容、migration制約が混在している箇所を落とし得る。実際の再構築時は段落、list、table単位で旧記述と新ownerを照合する必要がある。

##### 論点routingの判断

- **discussion scopeへ属する理由:** 漏れの有無によって、論点16で提案した第3章再構築を安全に採用できるかと、その具体的な適用方法が変わる。
- **同一decision scopeとしてiterationを継続する理由:** 新しい成果物や別の方針を決める問いではなく、論点16の再構築案が既存記述を保存できるかという完全性の検証である。

##### 修正先の判断

- **提案levelへの遡及:** 三sectionの選択は維持できる。再構築前の無損失routingと、outcome section外へ残すownerを提案へ追加する。

##### 根本原因1 + 提案1

- **根本原因1:** 提案0は、完成後の姿に属する主な記述の移設先を示しただけで、現在の第3章に混在する設計思想、保存制約、migration検証まで含めた全意味単位の移設先を示していなかった。「内容を失わない」という宣言に対して、漏れを検出できる具体的な照合方法がなかった。
- **変更点:** 第3章を直接書き換える前に、現行3-1〜3-8を段落、list、table単位でroutingする。三つのoutcome sectionへ属さない内容を既存coreの章へ明示的に残し、旧記述と新記述の順方向・逆方向照合を再構築の完了条件にする。
- **提案1（現時点）**:
  - 総論: `design.md`の既存coreは維持し、「3. 完成後の姿」に属する内容だけを三つのoutcome sectionで再構築する。現在の第3章に混在している別責務の記述は削除せず、対応する既存章へ移す。再構築は見出しの置換ではなく、現行の全意味単位に移設先があることを確認してから行う。
  - 各論:
    - ルール: 現行記述のownerを次のように分ける。

      | 現行記述 | 再構築後の主owner | 保存する内容 |
      | --- | --- | --- |
      | 3-1 task-designの目的と設計思想 | `file-deliverables.md` + Requirements／設計判断 | `task-design/SKILL.md`が維持する目的、negative diagnosis、五つの思想、理由・例・問い、self-update規律と、軽量modeから維持・廃止する能力 |
      | 3-2 designの作成と収束 | `workflow.md` | working directoryからdesign合意までの順序、discussion／調査／spike、decision記録、再評価、completion gate |
      | 3-2 production編集方針と軽量mode移行 | `file-deliverables.md` + Requirements／設計判断 | 現行section 1〜8を原文土台にすること、section 9のmode identityだけを廃止して共通能力を移すこと |
      | discussion記録の完全性、認識齟齬の原因routing | `workflow.md` | `facilitate-discussion`を単独ownerとする記録、事後回復、原因分類、一般則優先、即時反映後の`doc-enricher` review。source側の詳細contractをconsumerへ複製しない境界も残す |
      | 3-3 対象成果物変更の分類と適用 | `workflow.md` | 四状態、遷移条件、付録を正本とすること、zero gate、即時適用の依存条件 |
      | 3-4 execution plan gate | `workflow.md` | plan対象の最終検証、leaf／composite分岐、planなしroute、feedbackの戻り先 |
      | 3-4 三resultの名称・field・意味 | `public-contracts.md` | `tasklist_ready | roadmap_ready | planless_complete`、caller、成功条件、返却field、plan fileとside effectの保証 |
      | 3-5 design template directory | `file-deliverables.md` | template tree、各fileの読者・内容・構造・配置、九sectionの選択境界、理由・具体例・失敗例・判断質問を落とさない規律 |
      | 3-6 tasklistとroadmap | Requirements／非目標／受け入れ基準 + `workflow.md`の関係 | 今回変更しない既存contract、task-designとexecutor／steeringのsingle writer境界。変更対象fileとして水増ししない |
      | 3-7 steeringとの境界 | `workflow.md` + `public-contracts.md` | 三resultの受領、共通終了前gate、planless非dispatch、子完了伝播、summary判定、失敗・feedback時の戻り先 |
      | 3-8 migration verification | 受け入れ基準 + リスクと対策 + テスト方針 | baseline／atomic ledger、順方向・逆方向照合、owner境界、集計、black-box scenario、validator。完成後outcomeへ混ぜないが、手順と判定基準は落とさない |
    - ルール: `public-contracts.md`はresultのshapeとcaller-facingな成功・失敗保証を所有し、`workflow.md`はそのresultをいつ誰が渡して次に何が起きるかを所有する。`public-contracts.md`のmodule境界はtask-design、steering、tasklist-executorの公開入口と依存方向を扱い、physical file treeは`file-deliverables.md`だけを正本にして重複させない。
    - ルール: status、元の依頼、TL;DR、前提とする既存仕様、Requirements、設計判断、risk、test、付録というcore構造は維持する。第3章以外への移設に伴い、付録の`参照するdesign section`と本文内linkを新しいanchorへ更新する。
    - ルール: 再構築前に現行3-1〜3-8の全段落、list、tableへ移設先を付ける。再構築後は旧→新の順方向と新→旧または合意済み追加の逆方向を照合し、`未割当 0 / 根拠不明追加 0 / broken anchor 0`を満たす。
    - ルール: outcome sectionの必須fieldへ当てはめると欠落またはowner重複が生じる意味単位を発見した場合は、既存記述を削らず、未決事項としてdiscussionへ戻す。templateに合わせるための省略や捏造を行わない。
    - 適用例: 「skill自身の更新時にOpusを使う条件」はworkflowの状態遷移ではないため、`task-design/SKILL.md`の完成後内容として`file-deliverables.md`へ残す。「production変更後にGit削除行を逆引きする」は完成後の世界ではないため、テスト方針へ残す。「planless_complete`を受けたsteeringがdispatchしない」はworkflowと公開resultの関係として両ownerの境界を分けて記載する。

##### 検証

- **観点:** このroutingで現在の第3章から削除される意味単位があるか。
- **結果:** 合意済み`RETIRE`以外に削除対象はない。第3章から外れる記述はあるが、design全体からは落とさず、Requirements、設計判断、受け入れ基準、risk、testの対応ownerへ移す。
- **観点:** 同じ内容が複数ownerへ複製されないか。
- **結果:** workflowは時機と遷移、public contractはcaller-facingなshapeと保証、file deliverableはsource artifactの内容と配置に分ける。Requirements等は制約を記し、outcome sectionの詳細を再掲しない。交差点は参照で接続する。
- **弱点:** 段落単位の照合を実施するまで、現行第3章内の一文単位の混在を完全には否定できない。このため「漏れなし」は現時点の断言ではなく、無損失routingと照合を再構築の先行gate・完了条件にする。

#### イテレーション2: 既知の受け皿を先に決め、再構成後に残余差分を監査する

**受領したfeedback:**
> 「 migrationの順方向・逆方向照合やvalidatorなどの検証手順」自体は、手順自体を残すことはこのdesign.md固有じゃないよね。migrationやリファクタリング時に参照するoutcome-sectionsのテンプレートがあり、その中ではledgerファイルをリンク参照し、「何も変わらない」か「何が変わるか」が書かれていれば、完成後の姿と整合するんじゃない？ 「task-designの設計思想・既存能力を維持する制約」は完成後の姿に入れるべき内容かもね。新しくoutcome-sectionが追加されるべきか、大抵は何かの思想や制約であり、今回はスキルの制約だからworkflowに入るか（これは未決だから議論必要）。これらすべて同じ論点で話すべきかわからない。また、この後の進め方は、既知の漏れるものを、何を残し、残すためにどのような受け皿を用意するか、どれを捨てるかを決め、その後design.mdを再構成して、その後「現時点では一文単位まで監査していないので、「これで絶対に漏れなし」とはまだ断言できません。」の一文単位での漏れを列挙し、落とすか、入れるか、入れるならどこに入れるかを話そうか

##### 検証

- **観点:** migrationの検証手順を今回の`design.md`へ残すことが、完成後の姿を表すか。
- **結果:** 表さない。順方向・逆方向照合、validator実行、ledger作成手順の一般則は`function_migration_policy.md`が正本であり、今回のdesignへ手順を複製すると多重管理になる。今回固有の完成後outcomeは、ledgerを証拠として、どの既存contractが不変で、どれが合意済み差分として変わるかが読める状態である。
- **観点:** migration／refactoringの完成後outcomeと、skillの思想・制約の完成後outcomeを一つのdecisionで決められるか。
- **結果:** 決めるべきでない。前者は既存contractとの差分・保存状態の表現、後者は行為者の判断を拘束する原則のownerという別の選択であり、一方の結論は他方を一意に決めない。
- **観点:** 全文監査を再構成前に完了させる必要があるか。
- **結果:** 既知の受け皿が未決のまま全文をroutingしても、各行の行先を決められない。まず既知のowner問題を解き、そのownerで再構成した結果に対して旧記述との一文・意味単位照合を行い、残余だけを個別decisionへ上げる順序が合理的である。ただし再構成直前に現行textを比較baselineとして読み込み、再構成と照合を同じapplication cycleで行う。
- **弱点:** 再構成後の監査だけに頼ると、旧textを記憶で復元する危険がある。再構成前の現行fileをcomparison sourceとして固定し、監査結果をdiscussionへ保存してからreviewへ進む必要がある。

##### 論点routingの判断

- **discussion scopeへ属する理由:** 既知の漏れ候補をどのownerへ置き、どの順序でdesignを再構成・監査するかは、論点16の安全な再構築方法を直接変える。
- **同一decision scopeとしてiterationを継続する理由:** 個別の受け皿の採否自体は子論点へ分けるが、「子decisionを先に解き、再構成後に残余監査する」という全体順序は論点16が所有する。

##### 修正先の判断

- **診断levelへの遡及:** 提案1はmigration検証手順を今回のdesign coreへ移す前提と、既知・未知を分けず全文routingしてから再構成する順序が誤っていた。今回固有outcomeと一般procedureを分け、既知のowner decisionと残余監査を二段階にする。

##### 根本原因2 + 提案2

- **根本原因2:** 旧第3章から文字列を落とさないことを優先し、一般規範への参照で足りる手順まで今回固有designへ保存しようとした。また、受け皿そのものが未決な既知の意味単位と、再構成後の照合で初めて見つかる残余を同じrouting作業へ丸めた。
- **変更点:** migration手順の複製を撤回する。論点16を再構成順序の親とし、既知の二つのowner decisionを論点17、18へ分ける。両decision後にdesignを再構成し、その後で旧記述との一文・意味単位照合から残余を列挙する。
- **提案2（現時点）**:
  - 総論: 既知の漏れ候補について受け皿を先に決め、その決定に基づいて`design.md`を再構成する。再構成後に旧記述と一文・意味単位で照合し、未収容の各意味単位を、残す、明示的に捨てる、別ownerへ置く、のいずれかへdiscussionで確定する。
  - 各論:
    - ルール: migration／refactoring時の一般的なledger作成、順方向・逆方向照合、validator実行手順は`function_migration_policy.md`だけを正本とし、outcome sectionへ複製しない。今回の完成後の姿にはledgerをlinkし、不変contractと合意済み差分を記載する。この受け皿の有無、名前、必須fieldは論点17で決める。
    - ルール: task-designの設計思想、negative diagnosis、判断質問等を、既存`workflow.md`へ含めるか、別outcome sectionへ分けるかは論点18で決める。物理fileの章構造を所有する`file-deliverables.md`へ意味上のownerまで押し込まない。
    - ルール: 論点17、18が決定するまで`design.md`を再構成しない。両decision後に、選択済みoutcome sectionの必須fieldと今回の具体内容を使って第3章を再構成する。
    - ルール: 再構成直前に現行`design.md`をcomparison sourceとして読み込み、再構成と旧→新／新→旧照合を同じapplication cycleで行う。旧textを記憶や要約から復元しない。
    - ルール: 再構成後の照合では、旧第3章の各文、list項目、table rowについて、新しい記述、一般正本への参照、または未収容のいずれかを列挙する。未収容を無断で削除せず、残すか、捨てるか、残す場合のownerを追加discussionで一件ずつ決める。同じ上位decisionに完全に規定される複数項目だけをまとめる。
    - ルール: 明示的に捨てる意味単位は`RETIRE`として合意根拠を残す。一般正本への参照で置き換える場合は、今回固有の判断や結果まで正本側へあるかを確認し、なければ今回のdesignへ結果を残す。
    - ルール: 残余がzeroになり、選択sectionの必須field、内部link、付録参照が整合して初めて具体的なdesign reviewへ進む。論点10、15とproduction変更はそれまで再開しない。
    - 適用例: `Git削除行からcontract IDを逆引きする`という手順はdesignから外してpolicyへlinkする。一方、`tasklist／roadmapの既存contractは変更しない`という今回の結果は、ledger linkとともに論点17で決める完成後sectionへ残す。

##### 検証

- **観点:** 一般procedureを外すことで今回のmigrationが検証不能にならないか。
- **結果:** designはpolicyとledgerをlinkし、今回の不変・変更結果を保持する。実行者は一般手順をpolicyから、今回の対象と期待結果をdesign／ledgerから読めるため、手順の複製は不要である。
- **観点:** 再構成後に残余を議論する順序で、先に意味が失われないか。
- **結果:** 現行fileをcomparison sourceとして再構成と照合を同じcycleで行い、未収容を削除decisionではなく未決一覧としてdiscussionへ戻す。design合意は残余zeroまで禁止する。
- **弱点:** 残余一覧が多数になる可能性がある。件数を減らすために意味を丸めず、同じ上位decisionへ完全に規定されるものだけを一括して扱う。

**決定:** 2026-08-10、論点16を分解する提案2に従い、既知の受け皿を子論点17、18、20、21、23、26で確定した。一般的なmigration手順を今回固有designへ転記せず、合意済みownerで`design.md`を再構成してから旧記述との一文・意味単位の残余監査を行う。

**ネクストアクション:** 全child decisionのprototype、現在の`design.md`、ledgerへの反映を確定させた後、論点16の再構成と旧記述との一文・意味単位の残余監査へ進む。このturnでは残余監査を開始しない。

#### 適用・残余監査（2026-08-10）

ユーザーの`ok`を受け、論点16の決定どおり、旧第3章を選択済みoutcome sectionで再構成した。再構成直前の第3章をcomparison sourceとして固定し、SHA-256は`eb0fa62ed57b99611983ebefd8efc6abcd282f0a30d1bc183576bed5012074c1`である。選択順は、読者の理解依存に従い、`skill-policy`、`caller-contracts`、`workflow`、`file-deliverables`、`contract-preservation`とした。今回変更しないcode module境界は`code-structure`、documentation体系そのものは`documentation`の選択条件に当たらないため、今回の第3章には選択していない。

##### 旧→新の順方向照合

表の一行を、旧第3章の一文、list item、table rowの監査単位とする。内容を持たない見出しと導入句は、直後の最初の意味単位に含めた。

| 旧comparison source | 旧記述の意味 | 判定 | 再構成後のowner |
| --- | --- | --- | --- |
| L138 | task-designの目的 | 収容 | `skillの役割と方針 > task-design`の役割 |
| L140 | 維持する設計能力の導入 | 収容 | 同sectionの方針と判断軸 |
| L142 | 設計と実装の境界 | 収容 | 同sectionの方針と判断軸 |
| L143 | 変更点一覧を設計と扱わない | 収容 | 同sectionの方針と判断軸 |
| L144 | 三つのnegative diagnosis | 収容 | 同sectionの方針と判断軸 |
| L145 | 五つの設計思想と理由・違反signal・帰結・問い | 収容 | 同sectionの方針と判断軸 |
| L146 | skill自己更新時のOpus、自己適用、失敗pattern | 収容 | 同sectionの方針と判断軸 |
| L148 | 軽量modeの廃止部分、共通化する能力、Requirements維持 | 収容 | 同sectionの能力境界 + `contractの保存と明示差分` |
| L152 | design収束step 1 | 収容 | `workflow`必須順序1 |
| L153 | design収束step 2 | 収容 | `workflow`必須順序1 |
| L154 | design収束step 3 | 収容 | `workflow`必須順序1、一般migration policy参照 |
| L155 | design収束step 4 | 収容 | `workflow`必須順序2 + `documentation以外のfile deliverable` |
| L156 | design収束step 5 | 収容 | `workflow`必須順序2〜3 |
| L157 | design収束step 6 | 収容 | `workflow`必須順序3 |
| L158 | design収束step 7 | 収容 | `workflow`必須順序4 + routing table |
| L159 | design収束step 8 | 収容 | `workflow`必須順序5 |
| L161 | productionは既存section 1〜8をsource土台とする | 収容 | `documentation以外のfile deliverable`の`task-design/SKILL.md`完成後内容 |
| L163 | 旧section 9からmode identityだけを廃止し、能力を共通ownerへ移す | 収容 | `skillの役割と方針` + `documentation以外のfile deliverable` |
| L167 | discussion記録をfacilitate-discussionが所有する | 収容 | `skillの役割と方針 > facilitate-discussion` + `workflow` owner表 |
| L168 | handoff前に未収録会話を照合する | 収容 | 同skillの方針と判断軸 |
| L169 | 未収録の事象から合意までを同期する | 収容 | 同skillの方針と判断軸 |
| L170 | chat合意済み内容へ再合意を求めない | 収容 | 同skillの方針と判断軸 |
| L171 | 事後記録で変遷と確認不能範囲を再構成する | 収容 | 同skillの方針と判断軸 + `workflow`失敗・取消・再開 |
| L172 | discussion内部contractをconsumerへ複製しない | 収容 | 同skillの能力境界 + `documentation以外のfile deliverable` |
| L176 | 認識齟齬を具体修正より先に原因ownerへ戻す | 収容 | `skillの役割と方針 > facilitate-discussion` |
| L177 | 成果物固有・repository知識・skillへ分類する | 収容 | 同skillの方針と判断軸 |
| L178 | 一般則の修正方針を先に合意する | 収容 | 同skillの方針と判断軸 + `workflow` |
| L179 | 合意のない内容をdecisionへ変えない | 収容 | 同skillの能力境界 |
| L180 | 即時適用したoriginだけdoc-enricherを一度reviewする | 収容 | 同skillの能力境界 + `workflow` owner表 |
| L181 | 原因routing contractを他skillへ複製しない | 収容 | 同skillの能力境界 |
| L187 | `分類保留`の条件と遷移 | 収容 | `workflow` routing tableの同row |
| L188 | `task-design内反映待ち`の条件と遷移 | 収容 | `workflow` routing tableの同row |
| L189 | `task-design内反映済み`の条件と遷移 | 収容 | `workflow` routing tableの同row |
| L190 | `execution plan対象`の条件と遷移 | 収容 | `workflow` routing tableの同row |
| L192 | 即時適用の依存条件 | 収容 | `workflow` routing table直後 |
| L194 | 付録をroutingの単一正本とし、zero gateを持つ | 収容 | `workflow`状態遷移、必須順序4〜6、routing説明 |
| L198 | execution plan gate step 1 | 収容 | `workflow`必須順序6 |
| L199 | execution plan gate step 2 | 収容 | `workflow`必須順序6 |
| L200 | execution plan対象zeroならplanを作らない | 収容 | `workflow`状態遷移、必須順序6 |
| L201 | 対象ありのleaf／composite判定 | 収容 | `workflow`必須順序6 |
| L202 | planの設計・review | 収容 | `workflow`必須順序6 |
| L203 | review feedbackがdesignを変える時の戻り先 | 収容 | `workflow`失敗・取消・再開 |
| L205 | task-design resultの導入 | 収容 | `callerが依存するcontract`の冒頭 |
| L207 | `tasklist_ready`の条件・field・side effect | 収容 | `callerが依存するcontract`の同row |
| L208 | `roadmap_ready`の条件・field・side effect | 収容 | `callerが依存するcontract`の同row |
| L209 | `planless_complete`の条件・field・side effect | 収容 | `callerが依存するcontract`の同row |
| L210 | 三resultの排他性 | 収容 | 同sectionの冒頭と三row |
| L211 | plan fileの排他性 | 収容 | 三rowの成立保証 + 失敗contract |
| L212 | planlessのzero stateとvalidation | 収容 | `planless_complete`成立保証 |
| L214 | 空planへ二度目の承認を求めず、stale planを残さない | 収容 | `workflow`必須順序6 + 失敗・取消・再開 |
| L216 | planless resultはdesign付録を証拠の正本とする | 収容 | `callerが依存するcontract`のresult後段 |
| L220 | plan要否と適用時期を分ける理由 | 収容 | `workflow`末尾の同名設計意図 |
| L224 | template directoryの完成後像の導入 | 収容 | `documentation以外のfile deliverable`全体 |
| L226 | `templates/design.md`のcore | 収容 | 同sectionのcore説明 |
| L227 | `outcome-sections/catalog.md`のselection責務 | 収容 | 同sectionのcatalog説明 |
| L228 | `outcome-sections/README.md`のcomposition責務 | 収容 | 同sectionのREADME説明 |
| L229 | `tasklist.md`を変更しない | 収容 | file表 + `contractの保存と明示差分`末尾 |
| L230 | `roadmap.md`を変更しない | 収容 | file表 + `contractの保存と明示差分`末尾 |
| L232 | documentation outcome固有の内容 | 収容 | `documentation以外のfile deliverable`の`documentation.md`説明 |
| L234 | research finding固有の内容とdocumentationとの境界 | 収容 | 同sectionの`research-findings.md`説明 |
| L236 | file deliverable固有の内容 | 収容 | 同sectionの`file-deliverables.md`説明 |
| L238 | contract preservation固有の内容 | 収容 | 同sectionの説明 + `contractの保存と明示差分` |
| L240 | outcome sectionの配置順 | 収容 | 同sectionのcatalog／README説明 |
| L242 | `migration-and-rollout.md`を採用しないowner分割 | 収容 | 同sectionの明示paragraph |
| L244-a | interactionの失敗・中断case | 収容 | 同sectionの追加block説明 |
| L244-b | dataの更新・不変条件case | 収容 | 同sectionの追加block説明 |
| L244-c | caller contractの成功・失敗保証 | 収容 | 同sectionの追加block説明 |
| L244-d | screenの状態別表示 | 収容 | 同sectionの追加block説明 |
| L246 | prototype適用済み、production未統合 | 収容 | 同sectionの`migration-and-rollout.md`直後 |
| L250 | outcome section化とsource-first migrationの理由 | 収容 | 同sectionの設計意図 |
| L254 | 失敗prototypeへの継ぎ足しを棄却 | 収容 | 同sectionの代替案1 |
| L255 | production時の読み直しへ先送りする案を棄却 | 収容 | 同sectionの代替案2 |
| L256 | source全文を巨大templateへ残す案を棄却 | 収容 | 同sectionの代替案3 |
| L260 | tasklist／roadmap contractを変更しない総論 | 収容 | `contractの保存と明示差分`末尾 |
| L262 | tasklist design／templateの既存contract | 収容 | 同section末尾の保存contract列挙 |
| L263 | roadmap design／templateの既存contract | 収容 | 同section末尾の保存contract列挙 |
| L264 | executor／steeringとのsingle writer境界 | 収容 | `workflow` owner表 + 同section末尾 |
| L268 | steeringがready resultを受ける責務 | 収容 | `skillの役割と方針 > steering` + `callerが依存するcontract` |
| L270 | plan resultの検証・開始確認・dispatch | 収容 | caller contract二row + `workflow`必須順序7〜8 |
| L271 | planlessの検証・非dispatch・完了 | 収容 | caller contract同row + steeringの能力境界 |
| L273 | 三result共通の終了前gate | 収容 | `workflow`必須順序7〜8 |
| L275 | 子phaseのplanless完了伝播 | 収容 | caller contractのresult後段 + steeringの役割 |
| L277 | identity／state矛盾時の戻り先 | 収容 | caller contractの失敗contract + workflow失敗時 |
| L281 | migration前procedureの導入 | policy参照へ置換 | `contractの保存と明示差分`の一般procedure正本link |
| L283 | baseline scope固定 | 今回結果を収容 | `contractの保存と明示差分`のbaseline表 |
| L284 | 構造ledger作成 | policy参照へ置換 | 同sectionのpolicy link、今回のledger link |
| L285 | atomic contract ledger作成 | policy参照へ置換 | 同sectionのpolicy link、今回のledger link |
| L286 | production編集前停止条件 | policy参照へ置換 | 一般policy link + Requirements／riskの今回固有停止条件 |
| L288 | production後procedureの導入 | policy参照へ置換 | `contractの保存と明示差分`の一般procedure正本link |
| L290 | Git削除行・追加行の逆引き | policy参照へ置換 | 一般policy link + `5. テスト方針`の今回固有検証 |
| L291 | owner境界の順方向・逆方向照合 | policy参照へ置換 | 一般policy link + `5. テスト方針` |
| L292 | ledger集計とzero gate | policy参照へ置換 | 一般policy link + `4. リスクと対策` |
| L293 | black-box scenario | policy参照へ置換 | 一般policy link + `5. テスト方針`の今回scenario |
| L294 | validator／lint | policy参照へ置換 | 一般policy link + `5. テスト方針` |
| L298 | prototype、ledger、designを別正本とする理由 | 収容 | 第3章末尾の同名設計意図 |

##### 新→旧・合意済み追加の逆方向照合

| 新しいblock | 根拠 |
| --- | --- |
| `skillの役割と方針` | 旧3-1、旧discussion完全性／原因routing、旧3-7、論点18・24 |
| `callerが依存するcontract` | 旧3-4・3-7、論点7・23 |
| `workflow` | 旧3-2〜3-4・3-7、論点2・3・5・6・20 |
| `documentation以外のfile deliverable` | 旧3-2・3-5、論点4・8・9・19〜26 |
| `contractの保存と明示差分` | 旧3-6・3-8の今回固有結果、論点4・17 |
| `prototype・ledger・designの役割を分ける理由` | 旧L298、論点4・16・19・21 |
| 四つの代表scenario | 論点16の合意済みreview contract |
| failure／cancel／resumeの横断記述 | 旧3-4・3-6・3-7とbaseline保存contract |

##### 初回監査結果（後続の自己訂正あり）

- 旧→新: 合意済み`RETIRE`以外の意味単位は、新しい記述または一般policy参照へ全件routingした。
- 新→旧: 新しいblockは、旧記述または論点2〜26の明示decisionへ逆引きでき、根拠不明追加はない。
- 一般procedure: 旧3-8の手順本文は第3章へ転記せず、`function_migration_policy.md`への参照へ置換した。今回固有のbaseline、ledger、不変・変更結果、risk、testはdesign内に残した。
- link: 旧3-1〜3-8を指していた付録linkを、新しい五section、risk、testのanchorへ更新した。
- この時点では、残余を`未収容 0 / 根拠不明追加 0 / broken anchor 0`と判定した。

##### 自己訂正: 利用者向けdocumentationのownerが誤っている

初回結果の直後に、新第3章とprototype READMEの逆方向照合を追加したところ、`plugins/tumeda-dev/skills/README.md`を`documentation以外のfile deliverable`へ置いたことがowner境界に反すると判明した。

- prototype READMEの代表パターンは、skill方針をskill本体と利用者向けdocumentationへ反映する場合、`skill-policy → caller-contracts → workflow → documentation → file-deliverables → contract-preservation`の理解順を示す。
- catalogはdocumentationの新設・本質的更新を`documentation.md`の選択条件とし、`file-deliverables.md`はdocumentation以外のfileを所有する。
- 今回の`skills/README.md`変更は、条件付きplanと三resultをplugin利用者が判断できる公開説明へ変えるものであり、単なるpath／format変更ではない。
- したがって、新第3章のfile表へREADMEを入れたまま残余zeroとすることはできない。`documentation.md`を選ぶか、今回のREADME変更が本質的documentation更新ではないとする明示decisionが必要である。

訂正後の結果は`未収容 1 / 根拠不明追加 0 / broken anchor 0`である。この一件を論点27へroutingし、合意前に第3章を追加修正しない。

**最新のネクストアクション:** 論点27で利用者向けREADMEのownerと`documentation.md`選択要否を決める。残余zeroへ戻るまで統合design review、論点10、15、production template統合へ進まない。

##### 再訂正: file種別とtaskのoutcomeを混同した

ユーザーから「READMEがdocumentationであることは既知だが、なぜ今この話が出るのか」と指摘を受け、論点27の診断自体を再検証した。

- 論点16の監査対象は、旧第3章の意味が再構成後へ保存されたかであり、変更fileごとに独立outcome sectionを割り当て直すことではない。
- outcome sectionはfile種別ではなく、このtaskで独立して設計する完成後outcomeから選ぶ。今回のREADME変更は、skill policy、caller contract、workflowの変更を公開一覧へ同期する従属的な反映であり、documentation体系を独立して設計するoutcomeではない。
- `documentation以外のfile deliverable`へREADMEを置いたことは新第3章内の分類ミスだが、`documentation.md`を追加選択する根拠にはならない。READMEの変更事実とvalidationは付録が所有するため、file deliverableの対象表からrowを外せば意味は失われない。

このため論点27を取り下げ、`plugins/tumeda-dev/skills/README.md`のrowを`documentation以外のfile deliverable`から削除した。訂正後の監査結果は`未収容 0 / 根拠不明追加 0 / broken anchor 0`へ戻る。

## 論点17: migration／refactoringのcontract保存結果を表すoutcome sectionを設けるか

**ステータス:** 決定

**親論点:** 論点16

**種別:** TBDヒアリング / outcome section設計

**起点となった原文:**
> migrationやリファクタリング時に参照するoutcome-sectionsのテンプレートがあり、その中ではledgerファイルをリンク参照し、「何も変わらない」か「何が変わるか」が書かれていれば、完成後の姿と整合するんじゃない？

**提起の背景:** 既存の`migration-and-rollout.md`候補は実行順、停止点、確認手順を完成後の姿へ混ぜるため論点8で不採用にした。一方、function migrationやrefactoringでは、既存contractの何が保存され、何が合意済み差分として変わったか自体が完成後の観測可能な状態である。現在のcatalogには、この保存・差分outcomeを直接所有するsectionがない。

### 現在の合意対象

**参照する現在案:** イテレーション4の提案4

**今回確認すること:** review用prototypeの冒頭で、design.mdは人が理解できる意味差分とledger ID citation、ledgerはcontract単位のclassificationと証拠を所有する二層構造を明示する。具体例は冒頭へ一括掲載せず、baseline、差分宣言、変更項目の各記入block付近へ配置する。

### 議論の変遷

#### 事象の記述

- `function_migration_policy.md`はbaseline、二層ledger、順方向・逆方向照合、black-box、validator等の一般procedureをすでに所有する。
- 今回の`design.md`第3章は、その一般procedureを`migration verification`として再掲している。
- `file-deliverables.md`はfileの中身と配置、`workflow.md`はowner、gate、状態、handoff、`public-contracts.md`はcaller-facing contractを所有するが、移行前contract全体に対する保存・明示差分の結果を横断的に表すownerはない。
- 今回は、tasklist／roadmap等の既存contractを維持しながら、軽量modeやplan contract等の一部だけを合意に基づき変更している。

#### 原因の追跡

- なぜ: migrationを「実行する作業」としてだけ捉え、migration完了後に成立するcontract保存状態を独立したoutcomeとして捉えていなかった。
- なぜ: 旧`migration-and-rollout.md`がprocedure中心だったため、それを不採用にした際、異なる責務である保存結果の受け皿まで同時に失った。
- なぜ: 一般procedureと今回固有の結果を同じ`migration verification`節へ混ぜたため、policyとの多重管理と、完成後の姿からの逸脱が同時に起きた。

#### 根本原因0 + 提案0

- **根本原因0:** migration／refactoringにおける「既存contractの何が不変で、何が明示差分として変わったか」という完成後outcomeのownerがなく、一般procedureの再掲か、他sectionへの断片的な混在でしか表せなかった。
- **提案0（現時点）**:
  - 総論: outcomeの名前を作業手段であるmigrationではなく、終了時に成立する状態であるcontract preservationに置き、`outcome-sections/contract-preservation.md`を追加する。
  - 各論:
    - ルール: 選択gateは「既存のcode、skill、template、workflow、document等を移動、分割、統合、owner変更、形式置換し、成功条件に既存contractの保存または明示的な差分管理が含まれるか」とする。単なる新規作成や、変更前contractを持たない成果物では選ばない。
    - ルール: sectionは、(1) baselineと対象scope、(2) 保存されるcontract群、(3) 合意済みの`ADD | CHANGE | RETIRE`、(4) 許容する内部構造変更、(5) ledgerへのlink、(6) 完成後に観測できる保存・差分状態を持つ。
    - ルール: ledgerのcontract IDと全検証証拠を本文へ複製しない。designは人が完成後の差分を理解できるgroup単位の結果を記し、詳細はledgerを正本としてlinkする。
    - ルール: baseline作成、ledger記入、順方向・逆方向照合、black-box、validator等のprocedureは`function_migration_policy.md`を参照し、このsectionへ再掲しない。migrationの実行順やrolloutはRequirements、risk、execution plan等の既存ownerへ置く。
    - ルール: 「何も変わらない」場合も空sectionにせず、保存対象と許容する内部変更を具体化する。明示差分がある場合は、他のoutcome sectionで描く変更後の姿を参照し、このsectionへ同じ詳細を複製しない。
    - 適用例: 今回は[function-migration-ledger.md](./function-migration-ledger.md)をlinkし、tasklist／roadmapの既存contractを保存対象として記載する。軽量mode、outcome section選択、三result、conditional execution planは合意済み差分として列挙し、その詳細はworkflow、public contract、file deliverableの各sectionを参照する。

##### 検証

- **観点:** 不採用にした`migration-and-rollout.md`の復活にならないか。
- **結果:** ならない。旧候補は作業順・停止点・確認手順を所有した。提案するsectionは完成後のcontract保存・差分状態だけを所有し、procedureを一般policyへ委ねる。
- **観点:** `public-contracts.md`や`file-deliverables.md`と重複しないか。
- **結果:** 各sectionは変更後contractやfileの具体像を所有する。`contract-preservation.md`は移行前との関係だけを所有し、詳細は参照する。
- **弱点:** `contract`を公開APIだけと狭く読む可能性がある。template冒頭で、codeだけでなくskill、prompt、workflow、template、documentに埋め込まれた判断・停止・失敗防止能力を含むと定義する。

#### イテレーション1: review用prototypeを先に作り、実物で採否を判断する

**受領したfeedback:**
> 一旦追加してもらってそれ自体を見ないとokとできないな

##### 検証

- **観点:** 抽象的なfield一覧だけで、新sectionが既存outcomeと重複せず、今回の完成後の姿を十分に表せるか判断できるか。
- **結果:** できない。commentに含む意図、NG、具体例、MUST、判断基準と、実際の記入blockを合わせて見なければ、procedureの再流入や薄いformat化を評価できない。
- **弱点:** 未合意のprototype追加を完成済みdecisionやproduction変更と誤認する危険がある。変更先をsteering内のprototypeに限定し、discussion上のstatusを`提案中`のまま維持する。

##### 論点routingの判断

- **discussion scopeへ属する理由:** 実物を先に作る順序によって、論点17の提案を何を根拠に評価するかと、合意前に変更してよい範囲が変わる。
- **同一decision scopeとしてiterationを継続する理由:** `contract-preservation.md`の採否や責務を別decisionへ変えるfeedbackではなく、同じ提案を評価可能にするための提示方法への変更である。

##### 修正先の判断

- **提案levelへの遡及:** semanticな提案は維持し、合意後にprototype化する順序を、review用prototypeを先に作ってから採否を決める順序へ変更する。

##### 根本原因1 + 提案1

- **根本原因1:** outcome sectionは説明文ではなく、意図、失敗防止、判断基準、記入blockを合わせた実物がcontractである。提案0は、そのcontractを見せずに抽象要約だけで合意を求めていた。
- **変更点:** steering内prototypeの`contract-preservation.md`本体とcatalogへの仮登録を先に作る。production、現在の`design.md`、migration ledgerには反映せず、prototype自体を論点17のreview対象にする。
- **提案1（現時点）**:
  - 総論: 未合意案を評価するためのreview用prototypeを作成し、実際のtemplateから採否と修正点を判断する。prototype作成は案の可視化であり、decision適用ではない。
  - 各論:
    - ルール: `task-design_template_prototype/templates/outcome-sections/contract-preservation.md`を追加し、なぜ必要か、NG、具体的な記述例、記述のMUST、判断基準、記入blockを含む完全なsection案にする。
    - ルール: 記入blockは、baselineとevidence、完成後の差分宣言、保存するcontract、明示的に変わるcontract、許容する内部変更、完成後の観測可能な状態を持つ。
    - ルール: `catalog.md`へoutcome row、選択gate、非code中心steeringのmigration／refactoring mappingを仮登録する。
    - ルール: 一般procedureは`function_migration_policy.md`を参照し、ledger作成、順方向・逆方向照合、black-box、validatorの手順本文をprototypeへ複製しない。
    - ルール: productionの`plugins/tumeda-dev/skills/task-design/templates/`、現在の`design.md`、`function-migration-ledger.md`は変更しない。論点17のstatusも`提案中`を維持する。
    - 適用例: templateの具体例では、旧skillを複数ownerへ分割するcaseを使い、既存の停止・取消contractは保存、result名だけは合意済み`CHANGE`、file分割自体は許容する内部変更として区別する。

##### 検証

- **観点:** prototypeがあることで未合意案が既成事実化しないか。
- **結果:** prototype directory内だけに置き、production、design、ledgerへ採用済みとして同期しない。discussionの現在stateも提案中と明記する。
- **観点:** templateを見ても今回のdesignへの適用結果が分からない可能性はないか。
- **結果:** まず汎用templateのowner境界をreviewし、採用後に論点16の再構成で今回の具体値を入れる。template自体と具体適用を同時に合意へ丸めない。
- **弱点:** 汎用例だけでは今回のtask-design migrationに十分か判断しづらい可能性がある。必要ならprototype reviewの次iterationで今回の記入例を提示するが、現在の`design.md`へ先行採用はしない。

##### review用prototypeの適用状態

- [contract-preservation.md](./task-design_template_prototype/templates/outcome-sections/contract-preservation.md)を追加した。意図、広義のcontract定義、owner境界、NG、具体例、MUST、判断基準と、baseline／evidence、差分宣言、保存contract、明示差分、許容する内部変更、観測可能な状態の記入blockを持つ。
- [catalog.md](./task-design_template_prototype/templates/outcome-sections/catalog.md)へoutcome rowと、既存functionの移動・分割・統合・owner変更・形式置換に対するMUST mappingを追加した。
- `git diff --check`、prototype directory内のfile存在、六つの記入block、catalogの二参照を確認した。
- production template、現在の`design.md`、`function-migration-ledger.md`は今回のprototype作成では変更していない。論点17は未合意のままである。

#### イテレーション2: 保存contract一覧を廃止し、明示差分以外の全量保存を宣言する

**受領したfeedback:**
> 保存されるcontractを馬鹿正直に列挙されるとめっちゃ多くならない？ というかただ単にledge全体の転記となりそう

##### 検証

- **観点:** `contract group`単位なら、保存contract表はledgerの転記にならないか。
- **結果:** 防げない。groupの粒度に客観的な上限がなく、漏れを恐れるほど細分化され、最終的にはledgerの`KEEP | MOVE | ADAPT`行を言い換えて並べる運用へ倒れる。
- **観点:** 保存contract表を削除しても、何が維持されるかを完成後の姿として確定できるか。
- **結果:** できる。baselineと対象scopeを一意に固定し、「明示した`ADD | CHANGE | RETIRE`を除く全contractは意味と判断能力を保存する」というclosed-world宣言を置けば、保存集合は差分の補集合として一意になる。全明細はledgerから検証できる。
- **弱点:** baseline scopeが曖昧なら、全量保存宣言も曖昧になる。source fileと連続範囲または再現可能なsnapshotをbaseline fieldで特定し、scope外を暗黙に混ぜない必要がある。

##### 論点routingの判断

- **discussion scopeへ属する理由:** 保存contractの表現方法は、論点17のsectionがledgerと重複せず完成後差分を表せるかを直接左右する。
- **同一decision scopeとしてiterationを継続する理由:** sectionの採否やownerを変える別decisionではなく、同じ`contract-preservation.md`内の記載量と正本境界への修正である。

##### 修正先の判断

- **提案levelへの遡及:** contract preservationというoutcomeは維持し、保存対象をpositive listで示す提案を、baseline全体から明示差分だけを引くclosed-world表現へ変更する。

##### 根本原因2 + 提案2

- **根本原因2:** designは人が差分を理解する場所、ledgerは全contractを証明する場所と分けながら、design側にも保存contract一覧を要求したため、同じ集合を粒度違いで二重管理する構造を作った。
- **変更点:** `保存されるcontract`表を削除する。baseline scopeと全量保存宣言を強くし、designが列挙するのは明示差分だけに限定する。`KEEP | MOVE | ADAPT`と内部owner移動の全明細はledgerへ一本化する。
- **提案2（現時点）**:
  - 総論: 完成後の保存状態を「baseline scope内の全contract − 明示した`CHANGE | RETIRE` + 明示した`ADD`」として表す。designへ保存contractを列挙せず、明示差分だけを人が読める粒度で記載する。
  - 各論:
    - ルール: baseline fieldはrevision、snapshot、対象fileと連続範囲等、移行前の保存集合を再現できる情報を持つ。
    - ルール: 差分宣言は「以下の`ADD | CHANGE | RETIRE`だけが差分であり、baseline scope内のその他すべてのcontractは、ownerや配置が変わっても意味・条件・順序・強度・判断能力を保存する」と固定する。
    - ルール: designのtableには`ADD | CHANGE | RETIRE`だけを記載する。該当なしなら`なし。baseline scope内の全contractを保存する`と書く。
    - ルール: `KEEP | MOVE | ADAPT`、destination、source range、verification evidenceはledgerだけが所有する。designへgroup一覧、contract ID一覧、保存結果一覧を複製しない。
    - ルール: 変更後の具体的なworkflow、public contract、file構造等は対応するoutcome sectionが所有し、明示差分tableから参照する。
    - ルール: `許容する内部変更`表も削除する。file分割、rename、owner移動、形式置換の具体像は対応outcome section、意味保存の分類と証拠はledgerが所有するため、このsectionに第三の一覧を作らない。
    - 適用例: tasklist／roadmapの既存contractを個別列挙しない。baseline scopeへ含め、差分tableにtasklist／roadmapの`CHANGE | RETIRE`がなければ全量保存される。軽量mode廃止、三result、conditional execution plan等だけを明示差分として記載する。

##### 検証

- **観点:** 読者がledgerを全件読まないと、何も変わらない範囲を理解できなくならないか。
- **結果:** baseline scopeと差分宣言から、差分table以外は全量保存と判断できる。ledgerはその主張の詳細証拠を調べる時だけ読む。
- **観点:** 明示差分table自体がledgerの転記にならないか。
- **結果:** tableは合意された意味差分と詳細outcomeへの参照だけを持ち、source range、全contract ID、verificationはledgerへ置く。同じ上位decisionに規定される差分はgroup化できる。
- **弱点:** 大規模migrationで`ADD | CHANGE | RETIRE`自体が非常に多い場合はtableも長くなる。これは実際の意味差分が多いことの反映であり、保存contractの重複とは異なる。共通の上位decisionに完全に規定される場合だけまとめ、独立差分を要約で隠さない。

#### イテレーション3: 明示差分もledger行ではなく人が理解できる変更項目として記載する

**受領したfeedback:**
> 「ADD | CHANGE | RETIRE」自体も意訳したものをdesign.mdに載せて、意訳した変更項目に出典としてidとか乗せればいいんじゃない？

##### 検証

- **観点:** designの差分tableへ`classification`、移行前、完成後を置くと、`ADD | CHANGE | RETIRE`だけでもledger転記にならないか。
- **結果:** なり得る。ledgerは一contract一行の証明粒度、designは完成後の世界を人が理解する意味粒度である。同じcolumnsを持たせると、ledger行をそのまま写す方向へ誘導する。
- **観点:** 複数のledger IDを一つの意味差分へまとめても、未合意差分を隠さず追跡できるか。
- **結果:** 同じ上位decisionに完全に規定されるcontractだけを一つの変更項目へまとめ、項目から全該当IDと合意根拠へcitationすれば追跡できる。独立した意味差分は別項目を保つ。
- **弱点:** 「意訳」が原文の限定や強度を薄める可能性がある。designの変更項目は短縮を目的にせず、完成後に何がどう変わるかを正確に表し、ledger IDから原contractとclassificationへ戻れることを必須にする。

##### 論点routingの判断

- **discussion scopeへ属する理由:** designとledgerの粒度・citation境界は、`contract-preservation.md`がledgerの劣化copyになる問題を直接解消する。
- **同一decision scopeとしてiterationを継続する理由:** 新しいoutcomeや別ownerを追加するfeedbackではなく、論点17の明示差分blockを何の粒度で記載するかの修正である。

##### 修正先の判断

- **提案levelへの遡及:** closed-world宣言は維持するが、design側にもclassificationを置く案を撤回する。designは意味差分、ledgerはcontract classificationという二層へ分ける。

##### 根本原因3 + 提案3

- **根本原因3:** 保存contractの転記を廃止した後も、明示差分についてはledgerと同じ`ADD | CHANGE | RETIRE`の分類粒度をdesignへ持ち込んでおり、designとledgerの役割を完全には分離できていなかった。
- **変更点:** designの明示差分tableからclassification列を外す。完成後の意味差分を自然言語で一項目として記載し、該当するledger ID群と合意根拠を出典として付ける。
- **提案3（現時点）**:
  - 総論: designは人が完成後の世界の差分を理解する正本、ledgerはcontract単位で意味保存とclassificationを証明する正本とする。designへledger rowを転記せず、意味差分からledgerへcitationする。
  - 各論:
    - ルール: 差分宣言は「次に記載する意味差分だけが変わり、baseline scope内のその他すべてのcontractを保存する」とする。classification名を宣言本文へ露出させない。
    - ルール: designのtableは`完成後に変わること`、`移行前との違い`、`詳細を描くoutcome section`、`出典`を持つ。
    - ルール: `出典`には該当するledger IDを漏れなく列挙し、各IDから`ADD | CHANGE | RETIRE`、source、agreement、verificationへ戻れるようにする。design側へclassificationやcontract原文を複製しない。
    - ルール: 一つの上位decisionに完全に規定され、完成後に一つの意味差分として理解すべき複数contractだけを一項目へまとめる。異なる判断、例外、停止、owner変更を「関連する変更」として雑に一括しない。
    - ルール: 意訳は短縮ではなく、完成後の意味を読者向けに表現することを指す。原contractの限定、条件、強度が変わる表現は使わず、疑義があれば項目を分ける。
    - ルール: 差分がない場合は`なし。baseline scope内の全contractを保存する`とだけ書き、空tableやledgerの`KEEP | MOVE | ADAPT`を載せない。
    - 適用例: `A-011`〜`A-014`が同じ合意により「軽量modeを廃止し、discussion、調査、spikeを全task共通のdesign手段へ移す」ことを表すなら、designにはその一つの意味差分と`A-011`〜`A-014`へのcitationを載せる。各IDのclassificationとsource rangeはledgerだけに残す。

##### 検証

- **観点:** designだけを読んで完成後の差分を理解できるか。
- **結果:** ledger用語ではなく完成後の意味で書き、詳細outcome sectionへ接続するため理解できる。証明が必要な時だけcitationからledgerへ降りる。
- **観点:** designの意味差分とledgerのcontract行が乖離しないか。
- **結果:** 各意味差分に全該当IDをcitationし、ledger側のIDがどのdesign差分へ属するか逆引きできることを監査する。
- **弱点:** ID groupのまとめ方には判断が入る。groupingは上位decisionと完成後の意味が同一の場合だけ許し、review時に一項目から複数の独立差分が読めるなら分割する。

##### 修正版prototypeの適用状態

- `contract-preservation.md`から、保存contract表、許容する内部変更表、classification列を持つ明示差分表を削除した。
- 記入blockを`baselineとevidence`、`完成後の差分宣言`、`完成後に変わること`の三つへ限定した。
- `完成後に変わること`は、人が理解できる意味差分、移行前との違い、詳細owner、ledger ID群と合意根拠の出典を持つ。ledgerのclassificationとcontract原文は転記しない。
- `git diff --check`に成功し、保存contract、許容内部変更、classificationの記入tableが残っていないことを確認した。

#### イテレーション4: 二層構造を冒頭で宣言し、具体例を記入blockへ寄せる

**受領したfeedback:**
> そうよね。この形式だね。 .steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/task-design_template_prototype/templates/outcome-sections/contract-preservation.md の冒頭のコメント側にはこの意図がまだ反映されていない。そして、具体例については冒頭に全部かかなくても、具体フォーマットのところでコメントで書いても良いんじゃない？

##### 検証

- **観点:** 現在の冒頭だけで、designとledgerの粒度・正本境界を最初に理解できるか。
- **結果:** 不十分。owner境界まで読めば意味差分とcitationの関係は書かれているが、冒頭は「何が保存され、何が変わるかを描く」とだけ述べており、ledger行をdesignへ転記しない中心意図が後出しになっている。
- **観点:** 具体例を冒頭commentへまとめる配置は、実際の記入時に使いやすいか。
- **結果:** 使いにくい。意図、owner境界、NG、MUSTの途中に一組の例が入り、実際のplaceholderと離れている。各blockの直近に対応例を置く方が、何をどう埋めるかを誤読しにくい。
- **弱点:** 例をplaceholder付近へ移すと、template本体が長く見える可能性がある。例はHTML comment内に置き、生成後のdesign本文へ残すことを要求しない。

##### 論点routingの判断

- **discussion scopeへ属する理由:** 冒頭の意図と具体例の配置は、論点17の二層構造が利用者に正しく発火するかを左右する。
- **同一decision scopeとしてiterationを継続する理由:** sectionのowner、field、意味差分の粒度は変えず、同じ提案を誤読なく使える記述順へ修正するfeedbackである。

##### 修正先の判断

- **提案levelへの遡及:** 提案3の二層構造と三blockは維持する。冒頭の説明順と、具体例の配置だけを修正する。

##### 根本原因4 + 提案4

- **根本原因4:** field構造を修正した後も、冒頭説明と具体例の配置を旧構造から十分に組み直さなかったため、templateの中心意図が後半にあり、例が実際の記入箇所から離れていた。
- **変更点:** 冒頭でclosed-world宣言とdesign／ledgerの二層構造を先に示す。総論comment内の一括具体例を削除し、各記入block直下のHTML commentへ対応例を移す。
- **提案4（現時点）**:
  - 総論: formatは提案3の三blockを維持し、読み手が冒頭から「designへは意味差分、ledgerへはcontract明細」と理解できる説明順へ直す。具体例は記入対象の近くに置く。
  - 各論:
    - ルール: 冒頭で、baseline scope内は明示差分以外を全量保存すること、design.mdは意味差分とledger ID citationを所有すること、ledgerはcontract ID、classification、source、destination、agreement、verificationを所有することを連続して明記する。
    - ルール: 冒頭commentの`具体的な記述例`blockを削除する。
    - ルール: `baselineとevidence`の直後へ、再現可能なbaseline、対象scope、ledger、一般procedure正本の記入例をHTML commentで置く。
    - ルール: `完成後の差分宣言`の直後へ、明示項目以外を全量保存する一文例をHTML commentで置く。
    - ルール: `完成後に変わること`のtable直後へ、意味差分、移行前との違い、詳細owner、ledger ID citationを一行で対応させる例をHTML commentで置く。
    - ルール: 具体例はtemplate利用者への補助であり、生成されたdesign.mdへcommentごと残すことを要求しない。
    - 適用例: `legacy_ready`から`planless_complete`への変化例は、冒頭ではなく`完成後に変わること`のtable直後へ置き、ledger ID群がclassificationの転記ではなく出典であることを示す。

##### 検証

- **観点:** 冒頭だけで二層構造を誤解なく説明できるか。
- **結果:** designとledgerのownerを最初に対比し、後続のNG、MUST、fieldが同じ意図を具体化する順序になる。
- **観点:** 例を分散すると全体像が見えなくならないか。
- **結果:** 冒頭で全体原則を説明し、各blockの例はその原則の局所適用だけを示す。全体像と記入方法を別の位置で担保できる。
- **弱点:** HTML comment内の例が実際のfield値と混同される可能性は残る。各例を`記入例`と明示し、placeholderとは分ける。

##### 修正版prototypeの適用状態

- 冒頭の最初の説明へ、design.mdがbaseline scope、全量保存宣言、人が理解できる意味差分、ledger ID citationを所有し、ledgerがcontract ID単位のclassification、source、destination、agreement、verification evidenceを所有する二層構造を追加した。
- 冒頭commentにまとまっていた`具体的な記述例`を削除した。
- `baselineとevidence`、`完成後の差分宣言`、`完成後に変わること`の各記入block直下へ、対応する`記入例`をHTML commentとして配置した。
- `git diff --check`に成功し、二層構造の冒頭記述、一括具体例の不存在、三つの局所記入例を確認した。

##### 合意

> ok

##### 適用結果

- `contract-preservation.md`とcatalogの既存review用prototypeを、論点17で採用済みのoutcome sectionとして確定した。template本文は提案4の時点で完成しているため、合意後に内容を追加変更していない。
- `design.md`へ、function migration／refactoring時の選択条件、design／ledgerの二層正本、closed-worldの全量保存宣言、意味差分とledger ID citationのowner境界を反映した。
- function migration ledgerへ`A-025`と`P-ADD-014`を追加し、prototype追加を明示合意へ逆引き可能にした。
- productionのtask-design templateは変更していない。論点20、21、論点16の残余監査と整合する単位で統合するため、`design.md`付録の`task-design内の対象成果物反映待ち`へ分類した。
- `doc-enricher` reviewでは、今回の恒久知識は`contract-preservation.md`自身と同directoryのcatalogが正本であり、READMEまたは上位docsへ複製するとownerが重なるため、追加候補なしと判定した。
- Markdown差分checkと、templateの三記入block、catalogの選択row／必須mapping、ledgerの合意根拠を確認した。

**決定:** 2026-08-10、提案4を採用する。migration／refactoringのcontract保存結果を`contract-preservation.md`で表し、designにはbaseline scope、全量保存宣言、人が理解できる意味差分とledger ID citation、ledgerにはcontract単位のclassificationと証拠を置く。

**ネクストアクション:** 完了。prototype、catalog、`design.md`、migration ledgerへの合意反映とvalidationを終えた。production templateへの統合は論点20、21と論点16の残余監査後に行う。

## 論点18: skillの思想・制約をworkflow outcomeの判断原則として扱うか

**ステータス:** 分解済み

**親論点:** 論点16

**種別:** TBDヒアリング / outcome section owner設計

**起点となった原文:**
> 「task-designの設計思想・既存能力を維持する制約」は完成後の姿に入れるべき内容かもね。新しくoutcome-sectionが追加されるべきか、大抵は何かの思想や制約であり、今回はスキルの制約だからworkflowに入るか（これは未決だから議論必要）。

**提起の背景:** 現行`workflow.md`はowner、state、gate、handoff、失敗・取消・再開を要求するが、skillの各判断を拘束する思想、negative diagnosis、判断質問を持つfieldがない。`file-deliverables.md`へ置けば物理的な章構造は表せるが、完成後workflowがどの原則で判断されるかは表せない。汎用の「思想」sectionを新設すると、他outcomeから原則だけを引き剥がすcatch-allになる危険もある。

### 現在の合意対象

**参照する現在案:** イテレーション2の提案2

**今回確認すること:** 変更を選んだ理由、具体的なworkflow、file構造のいずれにも還元できない、成果物の存在意義・世界の捉え方・能力境界・将来の変更を拘束する根幹方針を、独立した完成後outcomeとして扱う。`判断原則と不変条件`はworkflow固有の判断を表すblockとして維持し、skillの根幹全体の代用にはしない。専用outcome sectionの責務を先に決め、物理名と具体formatはその後の子論点で決める。

### 議論の変遷

#### 事象の記述

- task-designのWHY→WHAT→HOW、TBDで全体を先に示す、上位合意から積む、spikeで実測する、転記せず対話するという思想は、workflow中の判断順序とgateを拘束する。
- 「新しい判断が残る」「完成後の姿がない」「sectionを埋めただけ」というnegative diagnosisは、design completionの可否を判定する。
- 理由、失敗例、判断質問は、規則が具体場面で正しく発火するための判断能力であり、単なるfile装飾ではない。
- 現行`workflow.md`の必須fieldだけでは、これらをowner、state、handoffのどこへ書くか一意でない。

#### 原因の追跡

- なぜ: workflowをstate transitionとresponsibilityだけで捉え、各transitionやgateの判断を何が拘束するかを独立した完成後outcomeとして扱っていなかった。
- なぜ: 思想・制約をsource fileの内容としてだけ扱うと、`file-deliverables.md`へ物理配置は書けても、完成後のprocessが同じ判断能力を持つか確認できない。
- なぜ: 逆に汎用の思想sectionを作ると、screen、data、public contract等が本来内包すべき設計原則まで切り離され、抽象的な原則集ができる。

#### 根本原因0 + 提案0

- **根本原因0:** workflowのstateとgateを列挙しても、その判断を拘束する原則、不変条件、negative diagnosisを記載するownerがなく、skillの完成後の判断能力がfile構造か抽象的な思想一覧へ追いやられる。
- **提案0（現時点）**:
  - 総論: 思想・制約を汎用の独立outcomeにせず、それが拘束するoutcome sectionへ置く。今回のtask-designではprocess actorの判断と完了gateを拘束するため、`workflow.md`へ「判断原則と不変条件」を追加する。
  - 各論:
    - ルール: `workflow.md`の「ownerと責務」の後、「状態と遷移」の前に「判断原則と不変条件」を置く。各原則について、rule、拘束する判断またはgate、違反signal、具体例または判断質問を記載する。
    - ルール: 今回は、設計と実装の境界、変更点一覧は設計ではないこと、三つのnegative diagnosis、WHY→WHAT→HOW、TBDで全体を先に示す、上位合意、spike、対話と転記禁止をこのblockで完成後のworkflow制約として描く。
    - ルール: `file-deliverables.md`は、それらが`task-design/SKILL.md`のどのsection構造で読めるかを所有するが、原則本文を複製しない。workflow sectionを参照し、source artifactがその判断能力を欠落なく実装することだけを記す。
    - ルール: 原則がscreen、data、public contract等の固有outcomeを拘束する場合は、そのoutcome sectionへ置く。複数outcomeを横断するだけという理由で汎用の思想sectionへ逃がさない。
    - ルール: workflowと無関係なrepository全体の規範・思想を知識体系として成立させること自体がoutcomeなら`documentation.md`を選ぶ。今回のskill behaviorとは分ける。
    - 適用例: 「全sectionを埋めても設計外判断が残れば未完」はtask-designのcompletion gateを拘束するためworkflowへ置く。「skill自身を構造的に更新するときはOpusを使う」はskill maintenance workflowのmodel選択gateとしてworkflowへ置く。「この原則をSKILL.md section 3に配置する」はfile deliverableへ置く。

##### 検証

- **観点:** workflow sectionが思想の長文で肥大化しないか。
- **結果:** workflowの判断またはgateを具体的に拘束する原則だけを選ぶ。背景知識体系そのものはdocumentation、source内の配置はfile deliverable、他outcome固有原則は各sectionへ送る。
- **観点:** 新しいoutcome sectionを作らないことで、思想・制約が再び省略されないか。
- **結果:** `workflow.md`の記述MUSTと判断基準へ「判断原則と不変条件」を追加し、ruleだけでなく違反signal、具体例または判断質問まで必須にする。
- **弱点:** 同じworkflow内でも多数の思想がある場合、state transitionより長くなる可能性がある。長さを理由に省略せず、独立した知識体系として読む必要が生じるほど膨らむ場合だけ`documentation.md`併用を再判定する。

#### イテレーション1: 変更の意図と、完成後の方針そのものを分ける

**受領したfeedback:**
> 論点18の提案が、テンプレートを変えるにも関わらず、今回の事象特化の内容じゃない？というか「判断原則と不変条件」はあってもいいと思う。それぞれの変更があった際の意図を書く欄を用意するもの必要だと思う。でも、今回みたいにskillの意図や方針自体の変更についての受け皿ではないんじゃない？ 変更の変更意図は本番ファイルに入らないかもしれないし、入るとしても実変更に対してはオプショナルな存在。skillの方針変更や意図変更などは、それがその方向でドキュメントやスキル定義が変わるもの。skillに限ってもいいし、ドキュメンテーション方針やモジュールの切り方などのユビキタス言語の方針変更も含むようなものになるなどバリエーションはあるかもしれない

##### 検証

- **観点:** 「判断原則と不変条件」は、なぜ今回の変更を選んだかと、完成後にskillが使う方針の両方を同じfieldで所有できるか。
- **結果:** できない。前者は変更履歴に属する設計根拠であり、完成後の本番artifactへ必ず残るとは限らない。後者は完成後の判断と挙動を規定するoutcomeであり、本番skillやdocumentへ実際に反映される対象である。
- **観点:** skillの思想・方針変更だけを扱う新outcome sectionが必要か。
- **結果:** 推奨しない。outcome sectionはfile種別ではなく何が変わるかで選ぶというcatalogの原則に反する。documentation方針、module分割方針、ubiquitous language方針等にも同じ構造があり、skill専用sectionでは再び例外が増える。
- **観点:** 方針変更をすべて集める汎用sectionが必要か。
- **結果:** 推奨しない。方針は、それが拘束する対象から切り離すと二重正本になる。workflowの判断方針はworkflow、documentationの編纂・維持方針はdocumentation、module境界・ubiquitous languageの方針はpublic contractがownerになる。
- **弱点:** 一つの方針が複数outcomeを横断する場合、owner選択が難しい。知識体系・標準として横断方針そのものを成立させる場合はdocumentationを主ownerとし、各outcomeは適用結果だけを記載する。単に複数箇所へ影響するだけなら、方針が直接拘束する最上位outcomeを一つ選び、他は参照する。

##### 論点routingの判断

- **discussion scopeへ属する理由:** 方針変更のownerを誤ると、今回のtask-design思想が完成後の姿から落ちるか、変更理由と完成後ruleが混在する。
- **同一decision scopeとしてiterationを継続する理由:** task-designの思想・制約を完成後のどのoutcomeへ置くかという論点18のdecisionを、より一般的なowner規則から修正するfeedbackである。
- **別decisionへ分けるもの:** 各変更を選んだ意図をdesign templateのどこに記録するかは、完成後方針のownerとは独立するため論点19へ分ける。

##### 修正先の判断

- **診断levelへの遡及:** 提案0は、完成後に効き続ける判断方針と、今回その変更を選んだ理由を「判断原則」という語で近接させた。まず両者を時間軸とownerで分ける必要がある。

##### 根本原因1 + 提案1

- **根本原因1:** 「方針」という語が、完成後artifactが実際に持つnormativeなruleと、そのruleへ変更した設計理由の二つを指すことを区別せず、workflow templateの一blockで同時に解決しようとした。
- **変更点:** `判断原則と不変条件`を変更意図の欄として扱わない。完成後も効く方針そのものは、その方針が拘束するoutcomeへ置く。変更を選んだ意図は論点19へ分離する。
- **提案1（現時点）**:
  - 総論: 方針そのものが変更outcomeなら、それが将来の何の判断を拘束するかでowner sectionを選ぶ。汎用の思想sectionやskill専用sectionは作らない。変更理由は完成後outcomeへ混ぜない。
  - 各論:
    - ルール: workflow actorの判断順序、開始・完了gate、禁止、停止、再開を拘束する方針は`workflow.md`が所有する。`workflow.md`には、実際にworkflow方針が変わる時だけ使う`workflowを拘束する方針`blockを追加候補とし、単なる変更理由を書く欄にはしない。
    - ルール: documentationの読者、編纂方針、normativeな標準、snapshot維持を拘束する方針は`documentation.md`が所有する。
    - ルール: moduleの切り方、公開名、ubiquitous language、dependency directionを拘束する方針は`public-contracts.md`が所有する。
    - ルール: fileの内容・構造・配置・記載規律だけを拘束する方針は`file-deliverables.md`、dataの不変条件は`data.md`、screen固有の表示原則は`screen.md`等、対象固有のoutcomeへ置く。
    - ルール: repository横断の思想・標準を知識体系として成立させること自体がoutcomeなら`documentation.md`を主ownerとし、影響を受けるoutcome sectionは完成後の適用結果だけを記載する。
    - ルール: 今回のtask-designにおける設計と実装の境界、negative diagnosis、WHY→WHAT→HOW、TBD、上位合意、spike、対話は、task-design workflowの判断とcompletion gateを将来も拘束するため`workflow.md`へ置く。これらを選んだ今回の理由は同blockへ書かない。
    - ルール: `file-deliverables.md`は、完成後方針が`task-design/SKILL.md`のどのsection構造として実装されるかを所有し、方針本文を複製しない。
    - 適用例: 「moduleはbusiness capability単位で分け、technical utility単位では分けない」という方針変更はpublic contractへ置く。「なぜ今回その方針へ変えたか」は論点19で決めるdesign coreへ置く。

##### 検証

- **観点:** genericな思想sectionを作らず、方針そのものを落とさず設計できるか。
- **結果:** 各outcomeが、自身を拘束する最終ruleを所有する。catalogの「何が変わるかで選ぶ」原則とも一致する。
- **観点:** 一つの方針が本番artifactとdesign.mdで二重管理にならないか。
- **結果:** designのoutcome sectionは完成後の正しい世界を記述し、本番artifactはその実装先である。`file-deliverables.md`は配置だけを所有し、同じ方針を別outcomeへ複製しない。変更理由は別ownerへ分離する。
- **弱点:** 既存outcome sectionが対象固有の方針を表すfieldを持たない場合がある。その場合は具体caseで必要になったsectionだけを拡張し、全sectionへ共通blockを機械的に追加しない。

#### イテレーション2: 具体的な現れ先ではなく、成果物の根幹を完成後outcomeとして所有する

**受領したfeedback:**
> は？狭量すぎるか、今のタスクを終わらせたがって議論を雑に行ってるやん。今回skillの「判断順序・gate・禁止・停止条件」の話をしてたか？それはさっき「「判断原則と不変条件」はあってもいいと思う。」って返事したじゃん。そうじゃないskillの方針・意図とかSKILL.mdの根幹が変わるものの話の受け皿どこよっていう。あと「 module境界・公開名・ubiquitous language → public-contracts.md」って頭わいてんのか？

##### 検証

- **観点:** イテレーション1は、「判断原則と不変条件」を認めたfeedbackの先で、別に問われていたSKILL.mdの根幹の受け皿を答えているか。
- **結果:** 答えていない。すでに許容されたworkflow固有blockの説明へ戻り、skillの存在意義、設計姿勢、能力境界、将来も守る発展軸をworkflowの判断順序とgateへ縮約した。
- **観点:** 根幹方針を、それが最終的に現れる既存outcomeへ分配すれば保存できるか。
- **結果:** 保存できない。workflow、file構造、公開名等は根幹方針から導かれる具体化であり、具体化だけを残すと、将来それぞれを局所的には正しく変更しながら、成果物全体の存在意義や設計姿勢を壊せる。
- **観点:** moduleの切り方やubiquitous languageの方針を`public-contracts.md`が所有できるか。
- **結果:** 一律にはできない。確定した公開名、公開API、具体的なmodule責務、dependency boundaryはpublic contractになり得る。一方、「business capabilityをどの単位で捉えるか」「domainの世界をどの語彙で切るか」「技術都合よりdomain概念を優先するか」は、それらの具体contractを導く設計方針であり、public contractそのものではない。
- **弱点:** 根幹方針のsectionを無制限に使うと、対象固有の具体像を持たない抽象的な理念集になり得る。根幹方針から今回の具体outcomeがどう導かれるかを示し、局所方針は既存sectionへ残すselection gateが必要である。

##### 論点routingの判断

- **discussion scopeへ属する理由:** SKILL.mdの根幹をどの完成後outcomeが所有するかは、論点18の起点にあった「新outcome sectionかworkflowか」という未決事項そのものである。
- **同一decision scopeとしてiterationを継続する理由:** イテレーション1がこの問いを既存sectionへの振り分けへ狭めたため、scopeを起点へ戻して提案を作り直す。
- **子論点へ分けるもの:** 根幹outcomeの存在と責務が合意された後の、直感的なfile名、固定fieldを持つか、themeに応じた記述形、catalog上の配置は別decisionとする。

##### 修正先の判断

- **診断levelへの遡及:** イテレーション1は「方針が何を拘束するか」を「方針がどの具体outcomeへ現れるか」と同一視した。分類軸を、末端の現れ先だけでなく、複数の現れ先を規定する根幹自体も独立したoutcomeになり得るものへ修正する。

##### 根本原因2 + 提案2

- **根本原因2:** outcome sectionを具体的な画面、data、workflow、file、contract等の変化先だけで分類し、複数の変化先を一つの成果物らしく束ねる存在意義、世界観、設計姿勢、能力境界を「抽象的な理由」と誤認した。そのため、完成後も本番artifactの内容として効き続ける根幹方針まで、変更理由か具体outcomeの補足へ押し込もうとした。
- **変更点:** `判断原則と不変条件`をworkflow固有の追加能力として認めたdecisionは維持するが、SKILL.mdの根幹の受け皿にはしない。既存outcomeから導出できない根幹方針を、独立した完成後outcomeとして所有するsectionを追加する方向へ変更する。
- **提案2（現時点）**:
  - 総論: 成果物またはdomainの存在意義、世界の捉え方、設計姿勢、能力境界、非目標、将来の発展を拘束する軸そのものが変わる場合、それを独立した根幹outcomeとして設計する。根幹outcomeは変更理由ではなく、完成後の本番artifactが実際に持つWHATであり、workflow、file、contract等はそこから導かれる具体化を所有する。
  - 各論:
    - ルール: 根幹outcomeには、成果物が何のために存在するか、何を正しい世界とみなすか、どの能力を維持・変更するか、何を行わないか、将来の変更で守る設計軸を、実際の階層関係を保って記載する。
    - ルール: `workflow.md`の`判断原則と不変条件`は、ownerが具体的な状態、gate、停止・再開でどう判断するかを所有する。根幹方針そのものをworkflowへ縮約せず、workflowには根幹方針がprocessへどう具体化されるかを書く。
    - ルール: `file-deliverables.md`は根幹方針が本番artifactのどの章・構造・表現として実装されるかを所有し、根幹方針の意味正本を複製しない。
    - ルール: `public-contracts.md`は確定した公開名、API、module責務、dependency boundaryを所有する。domainをどう分節するか、ubiquitous languageをどの思想で選び維持するかという上位方針は、具体contractへ還元せず根幹outcomeへ置く。
    - ルール: documentationの作成自体がoutcomeなら、読者の判断能力、知識構造、規範、snapshot維持は`documentation.md`が所有する。そのdocumentation群を通底する編纂思想や、何を正しい知識体系とみなすか自体を変更し、複数のdocument構造や維持workflowを規定する場合は根幹outcomeを併用する。
    - ルール: 根幹outcomeを単なる抽象理念の置場にしない。根幹方針を失うと、具体的なworkflow、file、contractを個別には正しく維持しても成果物全体の目的やidentityを壊せる場合にだけ選ぶ。局所的なruleや一つの具体outcomeだけを拘束する方針は、そのsectionへ置く。
    - ルール: 根幹outcomeと各具体outcomeは同じ文章を複製しない。根幹側は上位の方針と能力境界、具体outcome側はその方針が観測可能な振る舞い・構造・contractとしてどう成立するかを記載し、必要な参照で接続する。
    - ルール: 今回その根幹方針を選んだ理由、旧案、pain、trade-offは論点19の決定どおり、対象WHATを読んだ後に必要な場合だけ設計意図として置く。根幹outcomeの本文へ変更履歴を混ぜない。
    - ルール: 根幹outcome sectionの物理名とtemplate形はこのproposalで確定しない。意味上のownerを合意した後、skill、documentation方針、architecture／ubiquitous language方針の三caseで同じsectionが自然に書けるかを検証し、命名と記述構造を子論点で決める。
    - 適用例: 今回のtask-designでは、「後続作業で新しい設計判断を生じさせない」「code以外にも同じ設計深度を要求する」「execution planの有無とdesignの深さを連動させない」「既存の判断能力を落とさない」が根幹outcomeになる。`tasklist_ready | roadmap_ready | planless_complete`の遷移はworkflow、`SKILL.md`とtemplateの章構造はfile deliverable、tasklist掲載条件という外部contractは該当する具体outcomeが所有する。
    - 適用例: module設計では、「business capabilityを世界の分節単位とし、technical utilityを上位moduleにしない」「同じdomain概念をUI、API、codeで同じ語彙として維持する」が根幹outcomeになり得る。完成したmodule名、公開入口、依存方向は`public-contracts.md`へ置く。

##### 検証

- **観点:** 根幹outcomeは、論点19で決めた設計意図と重複しないか。
- **結果:** 根幹outcomeは完成後の本番artifactが将来も持つnormativeなWHATである。論点19の意図は、今回そのWHATを選んだWHYであり、対象WHATの後へ必要時だけ置く。時間軸と成果物への反映有無が異なる。
- **観点:** すべてのtaskで根幹outcomeが選ばれ、抽象的な前文が量産されないか。
- **結果:** 既存の根幹を変更せず、具体outcomeだけが変わるtaskでは選ばない。根幹を失っても具体outcomeの正しさと将来の変更判断が変わらないなら不要である。
- **観点:** themeごとに必要な記述形が違うのに、一つの固定templateへ押し込まないか。
- **結果:** このproposalは意味上のownerとselection gateまでに限定する。物理名とtemplate形は、複数themeの具体caseを並べてから子論点で決め、固定tableや機械的field追加を前提にしない。
- **弱点:** 「根幹」と「局所方針」の境界は自動判定できない。複数sectionに影響するという件数だけで選ばず、その方針を失った将来変更が成果物のidentityまたは正しさを壊すかを目視reviewする必要がある。

##### 合意

> 言ってることについて同意。提案して。

**決定:** 2026-08-10、提案2を採用する。イテレーション1は、SKILL.mdの根幹の受け皿を具体outcomeへの振り分けへ狭めていたため採用しない。成果物またはdomainの存在意義、世界の捉え方、設計姿勢、能力境界、非目標、将来の発展を拘束する軸そのものが変わる場合、それを具体的なworkflow、file、contractへ還元せず、独立した完成後outcomeとして所有する。`判断原則と不変条件`はworkflow固有の判断を表すblockとして維持する。

**ネクストアクション:** 完了。子論点19で変更理由の配置、子論点22と24で根幹を意味種別へ分け、skill固有の`skill-policy.md`を設計した。domain方針等は未決backlogとしてREADMEへ移した。

## 論点19: 各変更を選んだ意図と設計根拠をdesign.mdのどこに記録するか

**ステータス:** 決定

**親論点:** 論点18

**種別:** TBDヒアリング / design core設計

**起点となった原文:**
> 「判断原則と不変条件」はあってもいいと思う。それぞれの変更があった際の意図を書く欄を用意するもの必要だと思う。でも、今回みたいにskillの意図や方針自体の変更についての受け皿ではないんじゃない？ 変更の変更意図は本番ファイルに入らないかもしれないし、入るとしても実変更に対してはオプショナルな存在。

**提起の背景:** outcome sectionは完成後の状態を描く場所であり、今回その形を選んだ理由を混ぜるとWHATとWHYが再び一体化する。一方、現行design coreの「選択した原則と理由」は自由記述placeholderで、完成後の各意味差分と設計根拠を一対一に追うことを要求していない。変更理由が本番artifactへ残らない場合でも、未来の改善者がdesignから判断を遡れる受け皿が必要である。

### 現在の合意対象

**参照する現在案:** イテレーション3の提案3

**今回確認すること:** 決定済み。変更を選んだ意図は、関係する完成後の姿から離れた独立4章へ集約せず、「3. 完成後の姿」の中で、その意図が拘束する最も狭い共通scopeへ必要な場合だけ局所配置する。一つの意図が複数outcome sectionを通底する場合は、読者が先にWHATを理解できるよう、選択したoutcome section群の後へ一度だけ置く。

### 議論の変遷

#### 事象の記述

- 現行prototypeの「4. 設計判断」には「選択した原則と理由」と「代替案と棄却理由」がある。
- 「選択した原則と理由」は一つの自由記述placeholderであり、完成後のどの変更に対する理由かをlinkするfieldがない。
- outcome sectionの各fieldへ変更理由を加えると、完成後の状態と今回の議論履歴が混在し、同じ理由を複数sectionへ書く可能性がある。
- 本番skill、document、codeへ変更理由を残す必要性はartifactごとに異なるが、design.mdには実装後も「なぜこの形か」を遡れる必要がある。

#### 原因の追跡

- なぜ: 完成後の姿と設計判断を章として分けてはいたが、個々の意味差分から対応する設計判断へ辿るbindingを設計していなかった。
- なぜ: 自由記述なら理由を書けることと、全変更の意図を漏れなく追跡できることを同一視した。
- なぜ: production artifactに理由を埋め込むかという実装上の選択と、designが理由の正本を持つことを分けていなかった。

#### 根本原因0 + 提案0

- **根本原因0:** 変更後のWHATをoutcome section、WHYを設計判断へ分ける構造はあるが、両者をanchorで接続する必須形式がなく、変更意図が任意の説明または本番artifactへのcommentへ流れていた。
- **提案0（現時点）**:
  - 総論: 変更を選んだ意図と設計根拠はdesign coreの「4. 設計判断」だけを正本とし、各outcome sectionの完成後状態へ参照で接続する。本番artifactへ理由を残すかは、その理由が将来の判断能力として必要かを別途判定する。
  - 各論:
    - ルール: 「選択した原則と理由」を、`対象となる完成後の姿`、`選んだ形`、`意図・解消するproblem`、`守る制約`を持つtableまたは同等の反復可能なblockへ具体化する。
    - ルール: `対象となる完成後の姿`はoutcome sectionの具体anchorを参照し、理由だけが孤立したり、どの変更にも理由がない状態を検出できるようにする。
    - ルール: 一行はfile変更ではなく、一つの意味差分または設計判断を単位にする。同じ意図に完全に規定される複数outcomeはまとめてよいが、独立した判断を「関連変更」として丸めない。
    - ルール: outcome sectionには完成後も成立する方針、rule、不変条件を書く。「今回なぜその方針へ変えたか」は設計判断へ置き、同じ文章を複製しない。
    - ルール: 本番artifactへ理由を残すのは、その理由、失敗例、判断質問自体が将来の誤適用を防ぐfunctionである場合だけ必須にする。単なる変更履歴や当時の比較理由はdesign.mdだけに残す。
    - ルール: 本番artifactへ理由を残す場合も、designの設計判断を削除せず、artifact側は利用時に必要なruleの理由、design側は今回その完成後状態を選択した根拠という役割を分ける。
    - 適用例: outcome sectionに「tasklist掲載はcode、段階実行、ユーザー指定に限定する」と書き、設計判断には「例外modeが正常系の半数を占め、document更新を不要なplanへ送っていたため」と書いてoutcome anchorへ接続する。skill本体には、このruleを誤適用しないために必要な理由と具体例だけを残す。

##### 検証

- **観点:** 各変更の理由を必須対応付けするとdesignがledger化しないか。
- **結果:** file行やcontract IDではなく意味差分・設計判断単位で記載する。contract単位の証拠はledger、実行単位は付録またはexecution planが所有する。
- **観点:** outcome sectionと設計判断で同じ方針が重複しないか。
- **結果:** outcomeは完成後も使うWHAT、設計判断は今回それを選んだWHYに分ける。参照で接続し、本文を複製しない。
- **弱点:** `意図・解消するproblem`と`守る制約`が長文化する可能性がある。短さを優先せず、複数の独立理由があれば行を分ける。詳細な議論履歴はdiscussionを正本とし、designには最終判断の理解に必要な理由だけを残す。

#### イテレーション1: 一変更一行のtableを撤回し、必要な設計判断を自然な構造で残す

**受領したfeedback:**
> 論点19についてはテーブルにする意図がわからない。テーブルにすると矮小化する。意図は並列に列挙されるものとも限らないし、階層を持つかもしれないし、1個の通底するものかもしれない。毎回あるとも限らない。

##### 検証

- **観点:** `対象となる完成後の姿 | 選んだ形 | 意図 | 守る制約`のtableは、設計意図の構造を保存できるか。
- **結果:** できない。一行ごとの並列関係を強制し、一つの上位意図から複数の下位判断が導かれる階層や、複数outcomeを貫く一つの思想を重複行へ分断する。
- **観点:** outcomeの各変更に必ず設計判断entryを要求すべきか。
- **結果:** すべきでない。合意済み上位方針から機械的に導かれる変更、既存contractをそのまま維持する変更、別の設計判断に完全に包含される下位結果には独立した意図がない。必須化すると理由の捏造か同じ意図の反復になる。
- **弱点:** 完全な自由記述だけでは、完成後の姿との接続が失われる可能性がある。固定columnsではなく、関連するoutcome anchorを本文または補助listから辿れることを完了条件にする。

##### 論点routingの判断

- **discussion scopeへ属する理由:** 設計意図の記述形式と生成条件は、論点19がdesign coreへ何を追加するかを直接変える。
- **同一decision scopeとしてiterationを継続する理由:** 変更意図のownerをdesign coreにする方向は維持し、その受け皿をtableから自然な階層構造へ修正するfeedbackである。

##### 修正先の判断

- **提案levelへの遡及:** design coreをownerとする診断は維持する。一変更一行という記録単位と必須性を撤回し、設計判断の実際の論理構造を優先する。

##### 根本原因1 + 提案1

- **根本原因1:** outcomeとの追跡可能性を強くしようとして、設計意図にも一対一対応があると仮定した。WHATは複数の差分に分かれても、そのWHYは一つの上位思想かもしれず、逆に一つのoutcomeへ複数階層の理由がある可能性を無視した。
- **変更点:** table案を撤回する。「4. 設計判断」は必要時だけ生成し、見出し、段落、nested list等を判断の実構造に応じて使える自由形式にする。outcomeとの接続だけを必須にする。
- **提案1（現時点）**:
  - 総論: design coreの「4. 設計判断」は、完成後の姿だけでは未来の改善者が選択理由を誤る場合に限って使う。形式は意図の論理構造へ従い、一変更一項目へ分解しない。
  - 各論:
    - ルール: 次のいずれかがある場合に設計判断を記載する。複数の合理的な完成形から選んだ、trade-offまたは守る制約がある、一つの上位意図が複数outcomeを規定する、理由を失うと将来の変更で逆戻りする可能性がある。
    - ルール: 上位方針から機械的に導かれる結果、完成後の姿の言い換え、既存contractの単純維持には独立した設計判断を生成しない。
    - ルール: 一つの通底する意図なら一つの節として書く。意図に親子関係があれば見出しまたはnested listで階層を保つ。独立した判断だけを別節へ分ける。
    - ルール: 関係する完成後の姿は、本文中のlinkまたは節末の補助listから辿れるようにする。すべてのoutcome差分に逆向きの一対一entryを強制しない。
    - ルール: designには最終判断を理解するためのWHYだけを残し、feedback、旧案、iterationの変遷はdiscussionを正本にする。
    - ルール: 本番artifactへ同じ理由を残すかは、この理由、失敗例、判断質問がartifact利用時の誤適用を防ぐfunctionかで別途判定する。design coreの有無とは連動させない。
    - ルール: prototypeの「4. 設計判断」は固定tableを持たず、必要な判断を自然な構造で記述すること、不要なら`なし`とできること、関連outcomeへlinkすることをcommentで案内する。`代替案と棄却理由`も実際に重要な代替案がある時だけ同じ節内へ置く。
    - 適用例: 今回は「設計の深さを変えず、execution planだけを条件付きにする」という一つの通底意図が、workflow、三result、template構造を規定する。その意図を三行へ複製せず、一つの上位節から各outcomeを参照する。

##### 検証

- **観点:** 自由形式によって設計判断が単なるエッセイにならないか。
- **結果:** 記載gateを限定し、完成後outcomeへのlinkと、選択を維持するために必要なWHYだけを要求する。議論履歴や一般論はdiscussionまたはdocumentationへ送る。
- **観点:** 設計判断がないtaskでも空の定型文を作らないか。
- **結果:** 記載gateに該当しなければ`なし`とできる。理由を捏造して全変更へ割り当てない。
- **弱点:** 自由形式は機械的なcoverage検査が難しい。coverageは行数ではなく、完成後の姿を見た未来の改善者が「なぜこの選択か」を追加調査せず理解できるかという目視reviewで判定する。

#### イテレーション2: 設計意図を完成後の姿から分離せず、関係scopeへ局所配置する

**受領したfeedback:**
> あれ、論点19って、「4. 設計判断」の話だったの？「3. 完成後の姿」だと思ってた。「4. 設計判断」にあると分散するなぁ。

##### 検証

- **観点:** 設計意図を独立4章へ集約すると、完成後の姿を読む時に意図を一緒に理解できるか。
- **結果:** できない。読者は第3章のoutcomeと第4章の理由を往復し、どのscopeへ効く意図かをlinkから再構成する必要がある。WHATとWHYを章で分ける理論上の純度が、読み手の局所的な理解を悪化させる。
- **観点:** 設計意図を完成後の姿へ置くと、議論履歴や変更理由がoutcomeへ混ざらないか。
- **結果:** placementだけでは混在しない。最終状態を正しく読んで維持するために必要な意図だけを、対象scopeの子要素として置き、旧案、feedback、iterationはdiscussionへ残せばよい。
- **観点:** 一つの意図が複数outcomeを規定する場合、各sectionへ複製せず置けるか。
- **結果:** 第3章内の最小共通祖先へ一度だけ置けばよい。全outcomeに通底するなら第3章冒頭、一section内ならsection冒頭、特定subsectionだけならその直下に置く。
- **弱点:** outcome section templateごとに同じ`設計意図`fieldを追加すると、該当しないtaskでも穴埋めされる。個別templateへ必須fieldを複製せず、composition ruleとして一箇所でplacement gateを定める必要がある。

##### 論点routingの判断

- **discussion scopeへ属する理由:** 変更意図をdesign.mdのどこへ置くかは論点19の中心decisionであり、独立4章ownerという現在案を直接覆す。
- **同一decision scopeとしてiterationを継続する理由:** 記述の任意性と自然な階層構造は維持し、placementを独立4章から完成後の姿の関係scopeへ変更するfeedbackである。
- **別decisionへ分けるもの:** 独立4章自体を毎回持つか、完成後の姿へ統合するか、代替案をどう生成するかというtemplate core全体の問題は論点21へ分ける。

##### 修正先の判断

- **診断levelへの遡及:** 提案1はtableの平坦化を直したが、WHYとWHATは別章であるべきという前提を維持していた。設計書の目的は概念の分離ではなく、完成後の世界と必要な意図を読み手が一続きで理解できることへ戻す。

##### 根本原因2 + 提案2

- **根本原因2:** 設計意図をdiscussion履歴から分離することと、完成後の姿から物理的に分離することを同一視した。その結果、必要なWHYまでoutcomeから遠ざけ、読み手に章間往復を強制した。
- **変更点:** 独立4章を論点19のownerとする案を撤回する。設計意図は「3. 完成後の姿」内で関係する最小共通scopeへ任意配置する。第4章自体の扱いは論点21へ分離する。
- **提案2（現時点）**:
  - 総論: 完成後の姿を正しく理解・維持するために必要な設計意図は、その意図が拘束するoutcomeと同じ場所で読めるよう、最小共通scopeへ一度だけ置く。必須fieldや固定formatにはしない。
  - 各論:
    - ルール: 一つの意図が第3章全体を通底する場合は、選択したoutcome section群より前の第3章冒頭へ置く。
    - ルール: 一つのoutcome section全体を拘束する場合は、そのsectionの冒頭へ置く。section内の特定blockだけを拘束する場合は、そのblockの直前または子要素として置く。
    - ルール: 同じ意図を複数sectionへ複製しない。影響先が複数なら最小共通祖先へ一度だけ置き、必要なら影響するsectionを本文から示す。
    - ルール: 設計意図は、複数の合理的な完成形から選んだ、trade-offや守る制約がある、理由を失うと将来逆戻りする、という場合だけ記載する。機械的結果、完成後記述の言い換え、既存contractの単純維持には作らない。
    - ルール: 形式は段落、見出し、nested list等、意図の実際の論理構造へ従う。`設計意図`という固定見出しすら、本文として自然に読めるなら必須にしない。
    - ルール: 完成後も判断を拘束する方針そのものはoutcome本文へ書く。今回なぜその方針を選んだかのうち、完成後の理解に必要な部分だけを局所的な設計意図として添える。
    - ルール: feedback、旧案、iteration、合意過程はdiscussionが所有し、完成後の姿へ持ち込まない。本番artifactへ理由を残すかも別判断とする。
    - ルール: placementの共通規則は各outcome section fileへ複製せず、outcome sectionのcompositionを所有する一つの正本へ置く。具体的な正本pathと第4章との関係は論点20、21のdecision後に確定する。
    - 適用例: 「設計の深さは変えず、execution planだけを条件付きにする」という意図がworkflow、public contract、file deliverableをすべて規定するなら、第3章冒頭に一度だけ記述する。`workflow.md`内のplan判定gateだけの理由ならworkflow section内の該当blockへ置く。

##### 検証

- **観点:** WHATとWHYが混ざって完成後の姿が議論メモ化しないか。
- **結果:** 最終状態の理解・維持に必要なWHYだけをselection gateで限定し、過程はdiscussionへ残す。意図が不要なら何も生成しない。
- **観点:** 配置がtaskごとの恣意性へ戻らないか。
- **結果:** 最小共通scopeというruleで配置を決める。outcome section同士の記述順は論点20、独立4章の扱いは論点21で別途決める。
- **弱点:** 「完成後の理解に必要」の判定は機械化できない。未来の改善者が理由を知らずに別の合理的形へ戻す危険があるかを目視reviewし、危険がなければ省略する。

#### イテレーション3: 第3章全体を通底する意図はoutcome section群の後へ置く

**受領したfeedback:**
> 論点19については、「一つの意図が第3章全体を通底する場合は、選択したoutcome section群より前の第3章冒頭へ置く」が冒頭じゃなくて、最後になれば、他はすべて適用ok。whyが最初じゃなくて最後の理由は、理解を一気に進める存在はwhatであり、whatがわかってからでないとwhyを詳しく理解できないから。作る側の思考過程はwhy→whatだけど、読む側としてはwhat→whyの方が読みやすい

##### 検証

- **観点:** taskを設計する思考順`WHY → WHAT`を、そのままdesign.mdの読書順にすべきか。
- **結果:** すべきでない。設計者はWHYからscopeと完成形を導くが、完成済みdesignの読者は、先に具体的なWHATを把握して初めて、WHYが何を選び何を守る理由なのかを詳しく理解できる。
- **観点:** section固有またはblock固有の意図も、すべて第3章末尾へ送るべきか。
- **結果:** 送らない。それらは対象WHATの直後に置けば、具体像を読んだ直後に理由を理解できる。複数sectionを通底する意図だけが、全outcomeを読んだ後で初めて十分に理解できるためsection群の後へ置く。
- **弱点:** WHYを末尾へ置くと、設計目的が最初に見えない可能性がある。taskの目的とRequirementsは第3章以前のTL;DRと要件が所有する。ここで末尾へ送るのは目的そのものではなく、完成後の複数outcomeをこの組合せにした設計意図である。

##### 論点routingの判断

- **discussion scopeへ属する理由:** 通底する設計意図の配置順は、論点19の局所配置ruleを直接修正する。
- **同一decision scopeとしてiterationを継続する理由:** 設計意図を第3章内へ任意配置すること、最小共通scopeへ一度だけ置くことは合意され、複数sectionを通底する場合の前後関係だけを変更するfeedbackである。

##### 修正先の判断

- **提案levelへの遡及:** 提案2のowner、任意性、scope、形式は維持する。設計者の思考順と読者の理解順を分け、通底意図の位置だけを後ろへ変更する。

##### 根本原因3 + 提案3

- **根本原因3:** WHY→WHATという設計作業の思考順を、完成済みdesignを読む順序にも適用し、具体的な完成後の世界を知らない読者へ先に抽象的な通底意図を読ませようとした。
- **変更点:** 複数outcome sectionを通底する設計意図を、第3章冒頭から選択済みoutcome section群の後へ移す。section固有、block固有の意図は対象WHATの直後に置く。
- **提案3（合意済み）**:
  - 総論: 設計時はWHYからWHATを導くが、design.mdは読者がWHATからWHYを理解する順で構成する。必要な設計意図は「3. 完成後の姿」内で、対象となる完成後状態を読んだ後に一度だけ置く。
  - 各論:
    - ルール: 一つの意図が第3章全体または複数outcome sectionを通底する場合は、選択したoutcome section群の後へ置く。
    - ルール: 一つのoutcome section全体を拘束する意図は、そのsectionの具体的なWHATを記述した後へ置く。section内の特定blockだけを拘束する意図は、そのblockの直後または子要素として置く。
    - ルール: 同じ意図を複数sectionへ複製しない。影響先が複数なら、全対象WHATを読んだ後の最小共通scopeへ一度だけ置く。
    - ルール: 設計意図は、複数の合理的な完成形から選んだ、trade-offや守る制約がある、理由を失うと将来逆戻りする、という場合だけ記載する。機械的結果、完成後記述の言い換え、既存contractの単純維持には作らない。
    - ルール: 形式は段落、見出し、nested list等、意図の実際の論理構造へ従う。`設計意図`という固定見出し、table、全変更への必須entryを要求しない。
    - ルール: 完成後も判断を拘束する方針そのものはoutcome本文へ書く。今回なぜその方針を選んだかのうち、完成後の理解に必要な部分だけを、対象WHATの後へ局所的な設計意図として添える。
    - ルール: feedback、旧案、iteration、合意過程はdiscussionが所有し、本番artifactへ理由を残すかも別判断とする。
    - ルール: 第3章以前のTL;DRとRequirementsはtaskの目的と要件を先に示す。このdecisionはそれらを末尾へ移さず、第3章内の完成形とその選択理由の読書順だけを`WHAT → WHY`にする。
    - ルール: placementの共通規則は各outcome section fileへ複製せず、outcome sectionのcompositionを所有する一つの正本へ置く。具体的な正本pathと独立4章との関係は論点20、21で確定する。
    - 適用例: workflow、public contract、file deliverableをすべて読んだ後に、「設計の深さは変えず、execution planだけを条件付きにする」という通底意図を一度だけ記載する。workflow内のplan判定gate固有の理由は、gateの完成後状態を記述した直後に置く。

##### 検証

- **観点:** WHAT→WHYにしても、意図と対象の対応が分からなくならないか。
- **結果:** 意図は対象WHATの直後または全対象の直後に置くため、独立章より近い。必要なら本文中で対象を指すが、一対一tableは作らない。
- **観点:** 通底意図を末尾に置くことで、単なるまとめへ矮小化されないか。
- **結果:** 要約ではなく、完成後の組合せを選んだ理由、trade-off、守る制約を実際の階層で記述する。短い箇条書きを強制しない。
- **弱点:** 長い第3章では末尾の意図から各outcomeを遡る距離が出る。通底意図だけを末尾へ置き、section固有の意図は各section直後に置くことで往復を限定する。

**決定:** 2026-08-10、提案3を採用する。設計意図は毎回必須にせず、完成後の姿を正しく理解・維持するために必要な場合だけ「3. 完成後の姿」内へ置く。読者の理解順を`WHAT → WHY`とし、block固有の意図はblockの直後、section固有の意図はsectionのWHATの後、複数sectionを通底する意図は選択したoutcome section群の末尾へ、それぞれ一度だけ配置する。固定table、固定見出し、一変更一entryは使わない。

**ネクストアクション:** `skill-policy.md`への具体化は完了した。設計意図のcomposition ruleは、論点20、21でoutcome順と独立4章の扱いを決めた後にprototypeへ一括反映する。production templateと現在の`design.md`はまだ変更しない。

## 論点20: outcome sectionをdesign.mdへ配置する記述順を決める

**ステータス:** 決定

**親論点:** 論点16

**種別:** TBDヒアリング / information architecture

**起点となった原文:**
> 新たな論点思いついたから忘れないうちに追加しておいて。進めるのは現論点の19のままでいいから。outcome-sectionについて、design.mdへの配置時の記述順を決めたい。思考順と異なるばらばらの配置だと読みづらい。置き場所は .steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/task-design_template_prototype/templates/outcome-sections/README.md

**提起の背景:** catalogはtaskで変わる対象からoutcome sectionを選ぶgateを持つが、複数sectionを選んだ後に`design.md`へどの順で並べるかを定めていない。file名順、catalog記載順、作業者の思いつき順で配置すると、読者が完成後の世界を理解する思考順と一致せず、section間の参照を往復することになる。

### 現在の合意対象

**参照する現在案:** イテレーション1の提案1と、イテレーション2の代表2パターン（決定済み）。

**今回確認すること:** 決定済み。選択済みoutcome sectionは読者の理解依存で部分順序を作り、前後が決まらないsectionだけを既定順で安定化する。READMEがcomposition ruleと代表例を一元所有する。

### 議論の変遷

#### 事象の記述

- outcome sectionの選択規則はcatalogにあるが、選択後の配置順は未定義である。
- sectionの配置順が思考順と異なると、後のsectionを理解するために前後を往復する。
- ユーザーは記述順の正本をprototypeの`outcome-sections/README.md`へ置くよう指定した。

#### 原因の追跡

- なぜ: sectionの選択と、選択済みsectionを一つの完成後の世界として読ませる順序を同じ問題として扱っていなかった。
- なぜ: 各sectionのowner境界を決めることへ集中し、section間に理解上の依存順があるかを設計していなかった。

#### 根本原因0 + 提案0

- **根本原因0:** 未確定。複数outcomeの理解依存を固定順序、部分順序、task固有順序のどれで表すべきか未検討である。
- **提案0:** 未作成。論点19の完了後に、思考順、section間依存、例外、READMEとcatalogのowner境界を含む完全案を作る。

##### 検証

- **観点:** 今ここで暫定順序を置くべきか。
- **結果:** 置かない。現論点19を継続するというユーザー指定に従い、論点20はscope、問題、正本pathだけを保存して保留する。
- **弱点:** READMEがまだ存在しないため、具体案が決まるまで配置規則は未実装である。論点16のdesign再構成前に論点20を再開し、順序を確定する。

#### イテレーション1: 読者の理解依存を主規則、既定順をtie-breakにする

##### 受けたフィードバック

> 論点20、提案して

##### 事象の再確認

- 全outcome sectionを一つの固定順へ並べると、一部のtaskでは意味上の依存と逆になる。たとえば`documentation.md`は、既存workflowを形式知化する時は`workflow.md`の後に読む方が自然だが、documentationの維持workflowを設計する時は`workflow.md`より前に読む必要がある。
- 一方、taskごとの自由順だけにすると、file名順、catalog順、設計者が考えた順へ戻り、同じ組合せでもdesignごとに読書順が揺れる。
- `contract-preservation.md`は変更後の具体像を他outcome sectionへ委ねるため、それらより前へ置くと、まだ読んでいない完成後状態への参照が中心になる。
- `research-findings.md`は活動記録や設計理由ではなく、それ自体が選択された場合の完成後outcomeである。後続outcomeを規定するfindingなら、`WHAT → WHY`を破らず先行できる。

##### routingの判断

- **論点20で扱う:** 選択済みsectionの読書順、理解依存の判定、既知のprecedence、同順位の安定順、循環時の戻り先、READMEとcatalogのowner境界、論点19の設計意図との合成。
- **論点21へ残す:** 独立した「4. なぜこの姿か（設計判断）」章を残すか、生成gateをどうするか。論点20では第3章内のWHATと局所・通底WHYの配置だけを前提にする。
- **各outcome sectionへ残す:** section内部の記述順と固有guide。共通composition ruleは各fileへ複製しない。

##### 根本原因1 + 提案1

- **根本原因1:** 「sectionの順序」を一つのcatalog順へ固定する問題か、taskごとに自由に決める問題かの二択で捉えていた。実際には、section間にはtask固有の理解依存がある一方、依存しないsectionには再現可能なtie-breakが必要である。
- **提案1（現在案）:** READMEをcompositionの正本とし、理解依存による部分順序を先に作り、依存関係だけでは順序が決まらないsectionを既定順で安定化する。

###### 1. 主規則は「読者が理解するための依存順」にする

- 選択済みsection間で、`A`のWHATを読まないと`B`の用語、actor、状態、保証、対象scopeを推測で補うことになる場合だけ、`A → B`という理解依存を置く。
- source code上のdependency、実装手順、fileの生成順、単なるlink先という理由だけではprecedenceを作らない。end-to-end overviewが詳細sectionを参照する場合は、overviewを先に読み、詳細へ降りる順を許容する。
- task固有の理解依存はdesign.mdへ別表として出力しない。READMEの規則に従ってsectionを配置した結果そのものを読書順とする。

###### 2. 現行sectionに対する既知のprecedenceを定める

- `research-findings.md`が後続outcomeを規定するevidenceである時は、そのoutcomeより前へ置く。別outcomeを設計する途中のevidenceにすぎない場合は、catalogのgateどおり`research-findings.md`自体を選ばない。
- `skill-policy.md`は、それを具体化する`caller-contracts.md`、`workflow.md`、`file-deliverables.md`より前へ置く。skillの役割・判断方針を知らずに具体的な呼出し、遷移、file構造を先に読ませない。
- 同じ利用場面を扱う場合、`interaction-flow.md`を`screen.md`、`data.md`、`caller-contracts.md`より前へ置く。actorから見たend-to-endのWHATをoverviewとし、各状態・保証の詳細へ降りる。
- callerが依存する挙動を内部構造が実現する場合、`data.md`と`caller-contracts.md`を`code-structure.md`より前へ置く。内部配置から外部意味を逆算させない。
- `documentation.md`と他sectionの前後はfile種別で固定しない。既存のpolicy、workflow、挙動を形式知化するdocumentationなら、それらのWHATの後へ置く。documentation自体の維持方法を`workflow.md`で設計するなら、`documentation.md → workflow.md`とする。
- `workflow.md`が成立させる実行条件を`runtime-and-configuration.md`が具体化する場合は、`workflow.md → runtime-and-configuration.md`とする。
- `contract-preservation.md`は常に、選択した他のoutcome sectionをすべて読んだ後へ置く。先に具体的な完成後状態を示し、その後にbaselineとの関係、全量保存宣言、明示差分を読む。

###### 3. 理解依存だけで順序が決まらない時の既定順を一つ持つ

選択済みsectionのうち、上記precedenceで前後が決まらないものだけを、次の順で安定化する。これはcatalogの選択順や全task共通の因果順ではなく、同順位のtie-breakである。

1. `research-findings.md`
2. `skill-policy.md`
3. `interaction-flow.md`
4. `screen.md`
5. `data.md`
6. `caller-contracts.md`
7. `documentation.md`
8. `workflow.md`
9. `runtime-and-configuration.md`
10. `code-structure.md`
11. `file-deliverables.md`
12. `contract-preservation.md`

- 選ばれていないsectionは飛ばし、空sectionやcategory見出しを生成しない。
- catalogの行順はsection selectionのための見つけやすさにだけ使い、design.mdの配置順とはみなさない。
- 新しいoutcome sectionを正式採用する時は、READMEへowner境界だけでなく、既知のprecedenceとtie-break上の位置も同時に追加する。位置未決のままcatalogへ追加しない。

###### 4. 循環は任意の順で切らず、section境界またはoverview不足として戻す

- `A`を理解するには`B`が必要で、`B`を理解するには`A`が必要なら、file順で強制的に切らない。
- 一方がend-to-end overviewになれる場合は、overview側で用語と全体像を最小限定義し、もう一方へ詳細を委ねる。
- どちらも単独で入口になれない場合は、内容のowner分割、共通概念の正本、選択漏れをdiscussionへ戻す。循環したまま同じ本文を両sectionへ複製しない。

###### 5. 論点19の`WHAT → WHY`をsection順へ合成する

- 各outcome sectionのWHATを上記順で置き、block固有の設計意図はblock直後、section固有の設計意図はそのsectionのWHAT直後へ置く。
- 複数sectionを通底する設計意図は、`contract-preservation.md`を含む選択済みsectionをすべて置いた後、第3章末尾へ一度だけ置く。
- 設計意図がない場合は、順序を満たすためのWHYや固定見出しを生成しない。

###### 6. 具体例

- UI変更: `interaction-flow.md → screen.md → data.md → caller-contracts.md → runtime-and-configuration.md → code-structure.md → contract-preservation.md`
- skillの役割と実行方法の変更: `skill-policy.md → caller-contracts.md → workflow.md → file-deliverables.md → contract-preservation.md`
- 調査結果から規範docsを作り、その維持手順も定める: `research-findings.md → documentation.md → workflow.md`
- 既存workflowを説明するdocsを作る: `workflow.md → documentation.md`。逆にdocumentationのreview・更新workflowを作るなら`documentation.md → workflow.md`。

##### owner境界

- `outcome-sections/README.md`: composition rule、既知のprecedence、tie-break、循環時の戻り先、設計意図との合成の唯一の正本。
- `outcome-sections/catalog.md`: sectionのselection gateとowner mapping。配置順を複製せず、READMEを参照する。
- 各outcome section file: section内部の具体的な書き方、MUST、NG、判断基準。共通の配置順を複製しない。
- `design.md`: 選択・整列済みsectionを差し込むcore。順序規則そのものを再掲しない。

##### 検証

- **UI task:** interactionの全体像から画面、data、caller保証、内部実現へzoom-inでき、code structureから利用者の挙動を逆算しない。
- **skill task:** 恒久的な役割と判断方針を先に読み、その具体化であるcontract、workflow、file構造へ降りられる。
- **documentation task:** documentationとworkflowの関係を一律固定せず、「何を説明するdocsか」「何を維持するworkflowか」という実際の理解依存で前後を決められる。
- **migration task:** 変更後の具体像を読んだ後にcontract preservationを読むため、意味差分と詳細ownerの参照先をすでに理解した状態になる。
- **再現性:** task固有依存がないsectionはtie-breakで同じ順になるため、自由順へ戻らない。
- **弱点:** 理解依存の判定には設計者の判断が残る。ただし「先に読まないと用語、actor、状態、保証、scopeを推測するか」という判定質問、既知precedence、tie-break、循環時の戻り先を揃え、単なる好みでの並べ替えを禁止する。

#### イテレーション2: 合意と代表2パターンの具体化

##### 受けたフィードバック

> ok。代表パターンでの具体例を2パターンでも書いておこうか。データ含むAPIとその画面への適用の修正時の順番や、スキル方針含めたドキュメント修正の順番とか

##### routingの判断

- 「ok」は、file保存済みのイテレーション1の提案1全体への明示合意である。
- 代表例の追加は、別の配置原則を決めるdecisionではなく、合意済みの理解依存、既知precedence、tie-breakを二つの典型taskへ適用し、READMEだけで誤適用を診断できるようにする同じ論点の具体化である。
- production templateへの反映時期は変えない。prototypeと現在のdesignへdecisionを記録し、production統合は論点21とbaseline残余監査を待つ。

##### 合意済みruleの代表パターン

###### dataを更新するAPIを画面へ適用する

```text
interaction-flow.md
  → screen.md
  → data.md
  → caller-contracts.md
  → code-structure.md         # 責務配置・公開入口・依存方向も変わる場合だけ
  → contract-preservation.md  # migrationまたはrefactoringの場合だけ
```

- actorの操作からAPI call、成功・失敗、画面へ戻る結果までをend-to-end overviewとして先に読む。
- そのflow中に見える画面状態、保存されるdata semantics、画面側が依存するAPI contractの順で具体化する。
- module責務を変える場合は、外部意味と保証を確定した後に内部構造を置く。
- migrationまたはrefactoringなら、具体的な完成後状態をすべて読んだ後にbaselineとの保存・差分関係を置く。

###### skill方針を変更し、skill本体と利用者向けdocumentationへ反映する

```text
skill-policy.md
  → caller-contracts.md       # trigger、input、result等のcaller-facingな保証も変わる場合だけ
  → workflow.md               # owner、state、gate、handoffも変わる場合だけ
  → documentation.md
  → file-deliverables.md
  → contract-preservation.md  # 既存skillの移動・分割・統合・形式置換を伴う場合だけ
```

- skillの役割、判断方針、能力境界を先に読み、caller-facingな保証と実行workflowへ具体化する。
- 利用者向けdocumentationは、先に示したpolicyとworkflowを正しく判断・運用できる知識体系として置く。
- `SKILL.md`やtemplateの見出し、内容、配置、形式は、意味とprocessを確定した後にsource artifactの実現形として置く。
- この例ではdocumentationがskillのpolicyとworkflowを説明するため後に置く。documentation自体の維持workflowを設計するtaskでは`documentation.md → workflow.md`とする。
- 既存skillのmigrationを伴う場合だけ、変更後skill全体の後にcontract preservationを置く。

##### 反映と検証

- `outcome-sections/README.md`へcomposition ruleの正本と代表2パターンを反映した。
- `catalog.md`はselection ownerのまま、配置順を複製せずREADMEへの参照だけを追加した。
- prototype `design.md`は規則を再掲せず、catalogで選択しREADMEで整列する参照だけを追加した。
- 現在の`design.md`へ、理解依存とtie-break、代表2パターン、prototype適用済み状態、production反映待ちの残依存を同期した。
- 即時反映後の`doc-enricher` reviewでは、このdecisionの永続的なcomposition ruleと具体例は指定ownerのREADMEへすでに反映済みである。別READMEまたはdocsへの追加はGate Gの重複になり、追加候補なしと判定した。

**決定:** 2026-08-10、イテレーション1の提案1を採用する。選択済みoutcome sectionは、読者の理解依存による部分順序を主規則とし、依存関係で前後が決まらないsectionだけを既定順で安定化する。READMEをcompositionの唯一の正本とし、循環時の戻り先、論点19の`WHAT → WHY`との合成、data／API／画面とskill／documentationの代表2パターンを置く。catalog、各section、prototype `design.md`へ規則本文を複製しない。

**ネクストアクション:** prototypeと現在の`design.md`への即時反映、validation、decision単位の`doc-enricher` reviewは完了した。production templateへの統合は論点21と論点16のbaseline残余監査後に一括して行う。次のdiscussion対象は論点21だが、このturnでは進めない。

## 論点21: 「なぜこの姿か（設計判断）」章の存在・配置・生成gateを見直す

**ステータス:** 決定

**親論点:** 論点16

**種別:** TBDヒアリング / design core設計

**起点となった原文:**
> 話変わるけど、新論点スタックしておいて。論点19を引き続き続けるで大丈夫だから。「4. なぜこの姿か（設計判断）」について、別に毎回必要じゃないんだよな。しかも、別に独立トップレベルの章じゃなくて、完成後の姿の子要素でもいいし。「代替案と棄却理由」とか、合意してないのに、埋めることが目的になって捏造されることも多々なんだよな。本当に書いてほしいときには書いてくれなかったり、箇条書きで丸められたりするし。

**提起の背景:** prototype coreは「4. 設計判断」を独立トップレベル章として常設し、「選択した原則と理由」「代替案と棄却理由」を固定subsectionとして持つ。この構造は、理由や代替案が存在しないtaskでも穴埋めを誘発する一方、実際に重要な設計意図や代替案が階層を持つ場合には固定欄へ薄い箇条書きとして圧縮する。

### 現在の合意対象

**参照する現在案:** イテレーション1の提案1（決定済み）。

**今回確認すること:** 固定トップレベル章「4. 設計判断」と、その固定subsection「選択した原則と理由」「代替案と棄却理由」を廃止する。一方、完成後の姿を理解・維持するために必要な最終理由をdesign内に残すcontractは維持し、論点19・20の規則で関係するWHATの後へ局所配置する。代替案は実在する議論と最終状態の維持に必要な棄却理由がある時だけ、その設計意図の一部として記載する方針で合意した。

### 議論の変遷

#### 事象の記述

- 現行prototypeは設計判断章と二つの固定subsectionを毎回生成する形である。
- 設計判断や代替案がない場合でも、templateを埋めるための理由や棄却案が生成されることがある。
- 本当に重要な意図や代替案がある場合も、固定箇条書きへ要約され、理由の階層や具体性が落ちることがある。
- 設計判断は独立トップレベル章でなく、関係する完成後の姿の子要素として置く方が読みやすい可能性がある。

#### 原因の追跡

- なぜ: sectionの存在を「必要な内容があるか」ではなくtemplate completenessで決めている。
- なぜ: 理由と代替案を固定fieldにすれば記録漏れを防げると考え、存在しない内容の捏造と、複雑な内容の矮小化を副作用として扱っていなかった。

#### 根本原因0 + 提案0

- **根本原因0:** 未確定。設計判断を独立章として残す価値と、outcomeへ局所配置する価値、生成gate、discussionとのowner境界を論点19の結論後に整理する。
- **提案0:** 未作成。少なくとも、設計判断と代替案を毎回必須にしないこと、実際に存在し合意された内容だけを書くこと、重要な内容を固定箇条書きへ圧縮しないことを制約候補として保持する。

##### 検証

- **観点:** 今ここで4章の廃止または移動を決めるべきか。
- **結果:** 決めない。論点19が設計意図のownerと配置ruleを決めた後でなければ、4章に残る固有責務を判断できない。
- **弱点:** 4章の扱いが未決な間はprototype coreが旧形のまま残る。論点16のdesign再構成前に論点21を再開し、未決のままreviewへ進まない。

#### イテレーション1: 理由の保存能力を局所配置へ移し、固定4章を廃止する

##### 受けたフィードバック

> 次は？

> 提案して

##### 事象の再確認

- prototype `design.md`は、すべてのtaskへ「4. 設計判断」「選択した原則と理由」「代替案と棄却理由」を生成する。実在する理由や代替案がなくても、template completenessを満たすための内容を要求する形である。
- production `task-design/SKILL.md`は、未来の実装者が最終理由をdesignだけから辿れることを要求する一方、理由を4章へ集約し、本文へ混在させないことも要求する。この二つが、理由を残す能力と固定配置を一つのcontractにしている。
- 論点19は、完成後状態を理解・維持するために必要な設計意図だけを、block、section、複数sectionの最小共通scopeでWHATの後へ置くと決定した。
- 論点20は、選択済みoutcome sectionを読者の理解依存で並べ、複数sectionを通底する設計意図を全WHATの後へ置くcomposition ruleをREADMEへ確定した。
- この二decisionにより、必要な理由のownerと配置は成立した。固定4章に残る固有内容は、局所配置できる最終理由か、discussionが所有する議論履歴のどちらかであり、独立章だけが所有する意味は残っていない。

##### 原因の追跡

- なぜ: 「最終設計の理由を落とさない」という意味contractを、「全taskで理由欄と代替案欄を生成する」という物理formatで実装していた。
- なぜ: 理由がどのWHATを拘束するかではなく、理由という情報種別だけで一箇所へ集約したため、対象から離れ、局所的な理由もdocument全体の判断に見えた。
- なぜ: 最終状態を維持するために必要な理由と、議論中に出た旧案・比較・feedbackの履歴を分けず、固定の代替案欄を置けば両方を回収できると考えた。
- なぜ: 記録漏れを防ぐgateを「必要な内容の存在判定」ではなく「固定欄の充足」に置いたため、存在しない代替案の捏造と、実在する複雑な理由の箇条書き化を同時に起こした。

##### routingの判断

- **論点21で扱う:** 固定4章の存廃、最終理由の保存contract、代替案の生成gate、discussionとのowner境界、risk／test章の繰上げ、prototype・current design・production skill・ledgerへの反映方針。
- **論点19のdecisionを維持する:** 設計意図の存在条件、WHAT→WHY、block／section／複数sectionの最小共通scope、固定table・固定見出しを使わないこと。
- **論点20のdecisionを維持する:** outcome sectionの理解依存順、通底意図を第3章末尾へ置くこと、READMEをcompositionの正本にすること。
- **discussionが所有する:** 旧案、iteration、feedback原文、合意過程、最終状態の理解に不要な比較履歴。

##### 修正先の判断

- **prototype `templates/design.md`:** 固定4章を削除し、riskとtestを4章・5章へ繰り上げる。冒頭commentも固定設計判断章の存在を前提にしない形へ再構成する。
- **prototype `outcome-sections/README.md`:** 論点19の設計意図gateに、代替案を記載する条件とdiscussion境界を追加する。composition ruleの唯一の正本を維持する。
- **現在の`design.md`:** 現在の4章に実在する理由と代替案を削除せず、対応する3.xのWHAT直後または第3章末尾へ移す。固定4章を削除し、riskとtestを繰り上げる。
- **function migration ledger:** 「理由をdesign内に残す」を維持・配置変更し、「固定4章と二つの固定subsectionを毎回生成する」を明示的な`RETIRE`または`CHANGE`として追加する。riskとtestは`KEEP`する。
- **production `task-design/SKILL.md`とtemplate:** prototype、current design、ledger、baseline残余監査の整合後に一括反映する。未決の本提案だけで先行変更しない。

##### 根本原因1 + 提案1

- **根本原因1:** 必要な最終理由をdesignに保存するsemantic contractと、全taskへ独立4章・理由欄・代替案欄を生成するphysical formatを同一視した。固定欄を漏れ防止gateにした結果、理由の対象関係が切れ、存在しない内容の生成と実在する理由の矮小化を誘発した。
- **提案1（現在案）:** 必要な最終理由をdesign内に残す能力は維持し、固定4章だけを廃止する。理由と実在する代替案は、論点19・20のgateを通した設計意図として、拘束するWHATの後へ一度だけ置く。

###### 1. prototypeから固定4章を削除する

完成後のcore順は次とする。

```text
## 1. TL;DR
## 前提とする既存仕様
## 2. 要件（Requirements）
## 3. 完成後の姿
## 4. リスクと対策
## 5. テスト方針
## （付録）変更の実行区分
```

- `## 4. 設計判断`、`### 選択した原則と理由`、`### 代替案と棄却理由`、それぞれのplaceholderを削除する。
- 旧5章「リスクと対策」を4章、旧6章「テスト方針」を5章へ繰り上げる。riskとtestの内容、独立性、必須性は変更しない。
- 章を削除した跡へ空見出し、「なし」、別名の固定理由章を作らない。
- template冒頭の説明は「3. 完成後の姿が中心。1〜2は前提、4〜5は担保、付録は補足」とし、「設計判断章を削除しない」という旧前提を「必要な設計意図を削除せず、READMEのgateで3章へ配置する」へ変更する。

###### 2. design内に残すWHYを四種類へ分離する

- **taskのWHY:** なぜこのtaskを行い、終了時に何を成立させるか。`1. TL;DR`が所有する。
- **requirementとscope:** 何を必達・推奨・任意・非目標とするか。`2. 要件`が所有する。必要な限定理由は該当項目へ直接書き、一般的な理由章へ送らない。
- **完成後の姿を選んだ設計意図:** 複数の合理的な完成形から選んだ理由、trade-off、守る制約、失うと将来逆戻りする理由。論点19・20に従い、第3章内で対象WHATの後へ置く。
- **risk／test固有の根拠:** なぜそのriskを重大とみなすか、なぜその検証で成立を確認できるか。必要なら4章または5章の該当項目へ書き、完成後の姿の設計意図と混ぜない。

どのWHYにも当たらない旧案、feedback、検討順、比較の履歴はdiscussionだけが所有する。固定4章を消すことを、理由をdesignからdiscussionへ追い出す許可にしない。

###### 3. 設計意図の生成gate

次のいずれかに該当する時だけ、関係するWHATの後へ設計意図を書く。

- 複数の合理的な完成形から一つを選んだ。
- trade-offまたは守る制約があり、WHATだけでは選択の強度を維持できない。
- 理由を失うと、将来の変更で同じ失敗形へ戻る可能性がある。
- 複数sectionの組合せ自体に意味があり、個別WHATだけでは全体の選択を理解できない。

機械的結果、WHATの言い換え、既存contractの単純維持、template欄を埋めるための一般論には作らない。生成しない場合も「設計意図: なし」という痕跡を残さない。

###### 4. 代替案の記載gate

代替案は次の条件をすべて満たす場合だけdesignへ残す。

1. discussion、調査、または設計中に、実際の選択肢として具体的に検討された。
2. 採用しなかった理由が合意済みであり、assistantの後付け推論ではない。
3. その理由を失うと、完成後状態を誤読するか、将来同じ案へ理由なく戻る可能性がある。
4. 最終状態を理解・維持するために必要であり、単なる議論履歴ではない。

- 条件を満たす代替案は、独立した固定章へ集約せず、関係するWHATの後に置く設計意図の実際の論理構造へ組み込む。
- 一つのblockだけに関係するならblock直後、一section全体ならsectionのWHAT後、複数sectionを通底するなら選択済みsection群の後へ置く。
- 形式は段落、nested list、必要な見出し等に従う。`代替案と棄却理由`という固定見出しや一案一行のformatを要求しない。
- designだけで最終理由を理解できる本文を残す。discussionへのlinkは出典として添えてよいが、linkだけで棄却理由を省略しない。
- 検討したが最終状態の理解に不要な案、途中iteration、却下済みの細部はdiscussionにだけ残す。

###### 5. 現在のdesign.mdへ適用する時の保存方針

現在の4章は章ごと削除して内容を捨てず、次のようにmeaning ownerへ移す。

- 「execution planの要否と対象成果物への適用時期を別軸にする」理由は、`3-3. 対象成果物変更の分類と適用`と`3-4. execution plan gate`のWHAT後へ置く。
- 「outcome section化を完成後の姿へ限定し、既存coreと判断能力をsource-firstで保存する」理由は、`3-5. design template directory`のWHAT後へ置く。
- prototype、ledger、designの役割分担は、それぞれの完成後状態を示した後、第3章末尾の通底意図として一度だけ置く。
- 「不足項目の継ぎ足し」「新workflowだけを書く」「source全文を巨大templateへ残す」という実在する代替案は、上記の対応WHATを維持するために必要な棄却理由だけを各scopeへ移す。旧4章の箇条書きをそのまま第3章末尾へ一括移動しない。
- riskとtestは内容を変えず4章・5章へ繰り上げる。

###### 6. migration contractとして明示する

- baselineの「未来の実装者がdesignだけから最終理由を辿れる」は保存する。destinationを固定4章から、READMEのgateで配置された局所設計意図へ変更する。
- baselineの「理由は4章へ集約し、本文へ混在させない」は、論点19・20と両立しないため明示的に`CHANGE`する。完成後のWHATと理由を混在させず、WHATの後にscopeを分けて隣接配置するcontractへ置換する。
- 固定4章、固定理由subsection、固定代替案subsection、全taskでのplaceholder生成は明示的に`RETIRE`する。
- risk、test、議論履歴をdesignへ複製しないこと、designのself-containednessは維持する。

##### 検証

- **理由が存在しない単純なdocumentation task:** 第3章の`documentation.md`だけで完成後状態が一意なら、設計意図も代替案も生成しない。空4章や「なし」が残らない。
- **skill policyにtrade-offがあるtask:** `skill-policy.md`のWHATを示した後、そのpolicyを選んだ理由と、再採用を防ぐ必要がある実在代替案だけを同sectionの後へ置ける。
- **複数sectionを通底するmigration:** 具体的な変更後状態とcontract preservationをすべて読んだ後に、全体の役割分担や一括移行理由を一度だけ読める。
- **discussionの履歴保持:** designから旧案を減らしても、iteration、feedback、検討過程はdiscussionに残る。designは最終理由、discussionは変遷というowner境界が明確になる。
- **既存能力の保存:** 4章を削除しても、最終理由のself-containedness、risk、testは消えない。ledgerで物理formatの廃止とsemantic contractの移管を別classificationにできる。
- **弱点:** 理由を局所配置すると長い第3章で散在し得る。論点19の最小共通scope、一意owner、一度だけ記載するruleと、論点20の読書順で、対象との近さを保ちながら重複を防ぐ。

##### 合意

> ok

##### 反映と検証

- prototype `templates/design.md`から固定4章と二つの固定subsection／placeholderを削除し、riskとtestを4章・5章へ繰り上げた。riskとtestの内容、独立性、必須性は変更していない。
- prototype `outcome-sections/README.md`へ、設計意図の四つの生成条件、WHAT後の最小scope配置、代替案の四条件、discussionとのowner境界、designのself-containednessを反映した。
- 現在の`design.md`にあった実在理由は、execution plan要否と適用時期、outcome section化とsource-first migration、prototype／ledger／designの役割分担へ移した。実在した三つの代替案はtemplate再構成の設計意図へ残した後、固定4章を削除した。
- function migration ledgerへA-026〜A-028を追加し、最終理由の意味保存、固定formatの廃止、risk／testの維持を別classificationで追跡した。構造range、core atomic mapping、completion gate、validator edit mapも同じdecisionへ同期した。
- production `task-design/SKILL.md`と`templates/`は変更していない。論点16の残余監査と統合するまで反映待ちを維持する。
- decision単位の`doc-enricher` reviewでは、永続化すべき設計意図／代替案の生成・配置ruleは指定ownerのprototype READMEへ反映済みである。別READMEまたはdocsへの追加はGate Gの重複になり、追加候補なしと判定した。

**決定:** 2026-08-10、イテレーション1の提案1を採用する。必要な最終理由をdesign内にself-containedに残すcontractは維持し、固定4章と固定subsection／placeholderだけを廃止する。設計意図と実在する代替案は生成gateを通し、関係するWHATの後へ一度だけ置く。riskとtestは独立した必須章として維持する。

**ネクストアクション:** prototype、現在の`design.md`、function migration ledgerへの反映・validationと、decision単位の`doc-enricher` reviewは完了した。production skill／templateへの統合は論点16の一文・意味単位の残余監査後に行う。このturnでは次の論点を進めない。

##### 後続のproduction適用漏れ訂正

2026-08-10、論点1・イテレーション3の反映後にproduction `task-design/SKILL.md`を再読し、固定4章廃止後も完成設計書checkが「理由は4章へ集約」と要求し、本文もsection 4参照を残していることを確認した。これは新しい設計判断ではなく、論点21で明示的に`CHANGE`／`RETIRE`したcontractの適用漏れである。section 4参照を除き、目視checkを「必要な最終理由を関係するWHATと区別し、そのWHAT後の最小scopeへ一度だけ置く。固定理由章や実在しない代替案の穴埋めへ戻さない」へ訂正した。固定理由章への集約指示zeroとMarkdown差分checkを確認した。同じoriginating decisionの`doc-enricher` reviewは実施済みで追加候補なしだったため、重複起動していない。

## 論点22: 根幹outcome sectionの名前とtemplate形を決める

**ステータス:** 分解済み

**親論点:** 論点18

**種別:** TBDヒアリング / outcome section設計

**起点となった原文:**
> 言ってることについて同意。提案して。

**提起の背景:** 論点18では、成果物またはdomainの存在意義、世界の捉え方、設計姿勢、能力境界、非目標、将来の発展を拘束する軸そのものを、具体的なworkflow、file、contractへ還元しない独立outcomeとして所有することを決定した。まだ、そのsectionを初見で理解できる物理名、選ぶ条件、themeごとに異なる論理構造を薄めないtemplate形は決まっていない。

### 現在の合意対象

**参照する現在案:** イテレーション1の提案1

**今回確認すること:** `purpose-and-principles.md`という一つの汎用section案を撤回する。「根幹であること」はsemantic themeではなく、他outcomeを規定する関係としてcomposition ruleが扱う。内容は、skill等の判断能力と行動原則、documentationの知識体系、domain概念とubiquitous language、architectureの構造原則へ意味種別ごとに分け、既存sectionの拡張または必要な新sectionで所有する。

### 議論の変遷

#### 事象の記述

- 論点18で意味上のownerは決まったが、「根幹」「思想」等の内部的な呼び方だけでは、catalogを初めて読む人が何を記載するsectionか判断しづらい。
- `principles`だけでは平坦な原則一覧を連想し、成果物の存在意義、世界の捉え方、能力境界、非目標を落とす可能性がある。
- `intent`は論点19で扱う今回の変更意図と混同し、`workflow`や`policy`は具体的な運用ruleへscopeを狭める。
- skill、documentation方針、architecture／ubiquitous language方針では根幹の論理構造が異なるため、固定tableまたは一律の穴埋めfieldでは内容を矮小化する。

#### 原因の追跡

- なぜ: 意味上のownerを決めるために「根幹outcome」という抽象語を使ったが、そのまま利用者向けの名前にできるとは限らない。
- なぜ: file名はselection時の入口であり、内部議論で正確なだけでなく、何を書くかを初見で予測できる必要がある。
- なぜ: 記録漏れを防ぐための固定fieldと、対象の実際の思想構造を保存する自由度を同時に満たすtemplate形をまだ設計していない。

#### 根本原因0 + 提案0

- **根本原因0:** 新sectionの責務は「抽象的な思想一般」ではなく、具体outcomeより上位にある、現在成立している目的と設計原則である。しかし、その責務を一語の汎用名または固定fieldへ圧縮すると、変更理由との混同か、原則の平坦化か、theme固有の意味落ちが起きる。
- **提案0（現時点）**:
  - 総論: file名は`purpose-and-principles.md`とする。`purpose`で成果物またはdomainの存在理由と正しい世界を、`principles`で具体outcomeを導き将来の変更を拘束する設計軸を示す。template本文は固定tableにせず、対象固有の見出しと階層で完成後の目的・原則・能力境界を一続きに描く。
  - 各論:
    - ルール: catalogでは「成果物またはdomainの目的、世界の捉え方、設計原則、能力境界、非目標、発展軸が変わる」をselection対象として明示する。file種別がskill、docs、codeであることだけでは選ばない。
    - ルール: 次の判定質問をselection gateにする。「具体的なworkflow、file、contractを個別には正しく変更しても、この上位方針を失えば成果物全体のidentityまたは将来の正しさを壊せるか」。Noなら選ばず、局所方針を該当sectionへ置く。
    - ルール: `purpose`は今回なぜ変更するかではなく、完成後の成果物またはdomainが何のために存在し、誰にどの判断能力または価値を成立させるかを書く。今回のpain、旧案、採用理由は論点19の設計意図が所有する。
    - ルール: `principles`は短い標語の並列listを要求しない。一つの通底する思想、親子関係を持つ原則群、世界の概念分節、能力と非目標の対比等、対象の実際の論理構造に合わせて見出し、段落、nested list、具体例を使う。
    - ルール: rendered templateに固定するのは`### {成果物またはdomainを特定する名前}の目的と設計原則`という入口だけとする。`目的`、`世界の捉え方`、`原則`、`能力境界`等を一律の空欄として生成せず、必要なものをcommentの判断guideから選んで固有構造を作る。
    - ルール: 根幹方針がどの具体outcomeを導くかは本文または節末から辿れるようにするが、一原則一link、一変更一entry、固定の影響先tableを要求しない。同じ方針本文を具体outcomeへ複製しない。
    - ルール: template冒頭commentには、論点19の設計意図、`workflow.md`の判断・状態、`file-deliverables.md`の物理構造、`public-contracts.md`の具体contractとのowner境界を明記する。
    - ルール: template commentには、skill、documentation方針、architecture／ubiquitous language方針の三つの具体例を置く。例は固定formatとして模倣させず、同じselection gateが異なるthemeでどう現れるかを示す。
    - 適用例: skillでは`### task-designの目的と設計思想`の下に、「後続作業で新しい設計判断を生じさせない」を通底する目的として置き、code以外でも設計深度を落とさないこと、plan有無とdesign深度を連動させないこと、維持する判断能力と非目標を階層化する。state遷移やSKILL.mdの章配置は書かない。
    - 適用例: documentation方針では、複数documentを通底して読者にどの判断能力を成立させるか、具体caseをどの抽象度へ引き上げるか、正しい知識体系をどう捉えるかを書く。個々のdocument構造とsnapshot維持表は`documentation.md`へ置く。
    - 適用例: architecture／ubiquitous language方針では、business capabilityを世界の分節単位とすること、同じdomain概念をUI、API、codeで同じ語彙として扱うことを根幹として書く。確定したmodule名、公開入口、dependency boundaryは具体outcomeへ置く。

##### 検証

- **観点:** `purpose-and-principles.md`は、初見で内容を予測できるか。
- **結果:** `purpose`が存在意義、`principles`が完成後も将来判断を拘束する軸を表し、内部用語の`foundation`や変更理由と混ざる`intent`より責務を直接示す。日本語headingとcatalog説明で対象をさらに限定する。
- **観点:** `purpose`が論点19のWHYと混同されないか。
- **結果:** template commentで、完成後にartifactが持つ存在目的と、今回その姿へ変更した理由を時間軸で分ける。前者はこのsectionのWHAT、後者は対象WHAT後の設計意図である。
- **観点:** 一つのtemplateでtheme固有の根幹を薄めないか。
- **結果:** 固定tableと全field生成を禁止し、入口headingだけを固定する。三themeの例は形を揃えず、必要な論理構造が異なること自体を示す。
- **弱点:** `principles`という語だけを見て原則listを作る誤用は残る。冒頭comment、NG例、三つの異なる構造例で防ぎ、それでも不十分ならfile名を`purpose-and-design-foundation.md`等へ再検討する余地がある。

#### イテレーション1: 一つの根幹section案を撤回し、意味種別ごとのoutcomeへ分ける

**受領したfeedback:**
> 厳しく自己レビューして。命名もそうだし、扱うスコープ、1つでいいのか

##### 検証

- **観点:** `purpose-and-principles.md`という名前は、初見の利用者が選択対象と非対象を一意に判断できるか。
- **結果:** できない。`purpose`はtaskのWHY、artifactの役割、利用者価値、domainの存在理由のいずれも指せる。`principles`はworkflow rule、設計原則、品質属性、規範、変更理由まで含められる。二語を連結してもowner境界は狭まらず、ほぼすべてのtaskで選べるcatch-allになる。
- **観点:** purposeとprinciplesは常に同じoutcomeとして一緒に変わるか。
- **結果:** 変わらない。既存目的を保ったまま判断原則だけを変更するskill、目的と知識構造は変わるが設計原則は既存のdocumentation、domain概念だけを再定義するmodeling taskがある。二つをfile名で結合すると、片方が非該当でも穴埋めを誘発する。
- **観点:** skill、documentation方針、architecture／ubiquitous language方針は、同じtemplateで薄めず表現できる一つのsemantic themeか。
- **結果:** 違う。skillはactorの判断能力、優先順位、禁止、failure signalを完成後outcomeとする。documentationは読者の判断能力、知識構造、規範、snapshot維持をoutcomeとする。ubiquitous languageはdomain概念、語の意味、概念境界、関係をoutcomeとし、architectureはcomponent責務とdependency structureをoutcomeとする。「他の具体outcomeを規定する」という位置関係だけが共通で、記述対象と検証方法は異なる。
- **観点:** 一つのfree-form templateにすればtheme差を吸収できるか。
- **結果:** 形式上は吸収できるが、templateの判断能力を失う。固定fieldを外した`purpose-and-principles.md`は「いい感じに根幹を書く」だけの汎用placeholderになり、移行前templateの細やかな意図、例、失敗防止を守るという今回の方針に反する。
- **弱点:** 意味種別へ分けすぎるとcatalogが増え、複数section選択が煩雑になる。file数ではなく独立した完成判定と固有の記述guideが必要かで分割し、単なる観点差は同じsection内のblockに留める必要がある。

##### 論点routingの判断

- **discussion scopeへ属する理由:** 物理名、扱うscope、一sectionでよいかは論点22のdecisionそのものである。
- **同一decision scopeとしてiterationを継続する理由:** 論点18で決めた「根幹方針を完成後outcomeとして落とさない」は維持し、その物理実現を一つの汎用sectionから意味種別ごとのsectionへ修正する。
- **親論点へ戻さない理由:** 独立した意味ownerを持つという論点18のdecisionは変わらない。「独立」を一つの共通fileと解釈した提案0だけが誤りである。
- **後続論点へ分けるもの:** この構造が合意された後、skill等の判断・行動outcomeの正式名とtemplate、domain model sectionの正式名とtemplateを別々に決める。architectureとcaller-facing contractの再編は論点23が所有する。

##### 修正先の判断

- **診断levelへの遡及:** 提案0は「複数の具体outcomeを規定する」という関係を一つの内容分類だと誤認した。catalogは関係ではなく、何が完成後に成立するかというsemantic themeでsectionを分ける原則へ戻す。

##### 根本原因1 + 提案1

- **根本原因1:** 今回の`task-designの目的と設計思想`という一事例を一般化し、目的・世界観・原則・能力境界・domain model・architectureを一つの「根幹」型へまとめた。根幹という抽象度を上げれば共通templateにできると考えた結果、theme固有の完成判定と記述guideを消した。
- **変更点:** `purpose-and-principles.md`案を撤回する。「根幹であること」はsectionの種類ではなく、他sectionとの関係としてcomposition ruleに持たせる。今回確認できた意味上の空白は、一つにまとめず、少なくとも判断・行動outcomeとdomain model outcomeに分ける。documentationは既存sectionを維持し、architectureとpublic contractの再編は論点23へ委ねる。
- **提案1（現時点）**:
  - 総論: universalな根幹sectionは作らない。完成後に成立するものが異なるなら別sectionとし、上位方針が具体outcomeを規定する関係は、論点20で決めるcomposition正本から参照する。
  - 各論:
    - ルール: taskのWHYと全体scopeはTL;DR／Requirementsが所有する。各成果物の役割または利用者価値は、それを成立させるsemantic outcomeの中へ置く。`purpose`だけを理由に独立sectionを選ばない。
    - ルール: skill、prompt、policy engine等について、完成後に「何を判断できるか」「どの優先順位・原則で判断するか」「何を禁止・非目標とするか」「どのsignalを誤りと診断するか」が変わる場合は、判断能力と行動原則を所有する専用outcome sectionを新設する。
    - ルール: この専用sectionのworking labelは`decision-behavior.md`とするが、正式名にはしない。`decision-model.md`はobservableな行動を落とし、`behavioral-contract.md`は外部contractだけに読め、`skill-behavior.md`はfile種別へ寄りすぎる。正式名は、role／capability、判断原則、禁止・非目標、違反signal、具体caseという責務を最も自然に予測できるかで後続論点にて比較する。
    - ルール: 判断・行動sectionは、state、owner、handoffを持つ`workflow.md`、外部actorとのsequenceを持つ`interaction-flow.md`、本番fileの章構造を持つ`file-deliverables.md`と分ける。今回のtask-designの存在意義、設計と実装の境界、negative diagnosis、五つの設計思想、維持する能力はこの専用sectionの候補となり、それらがprocessへ現れた具体gateはworkflowが所有する。
    - ルール: documentationの編纂思想、読者へ成立させる判断、知識構造、規範、snapshot維持は、すでに`documentation.md`が一つのsemantic outcomeとして所有している。複数documentを通底するという理由だけで別の根幹sectionへ移さず、現行templateに不足するfieldがある場合だけ同sectionを拡張する。
    - ルール: ubiquitous language、domain概念の意味、概念間の関係、bounded context、同じ語を同じ意味で使う範囲は、保存schemaを扱う`data.md`とも、公開名を扱う現`public-contracts.md`とも異なるため、`domain-model.md`という専用outcome sectionの新設候補とする。
    - ルール: `domain-model.md`は具体的なclass名、module名、API名の一覧を所有しない。概念、定義、関係、business rule、語彙の適用範囲、同名異義・異名同義を避けるrule、具体caseでの言葉の使われ方を所有し、具体名・構造を導く意味正本になる。
    - ルール: moduleの分割方針、layer、component責務、directory、dependency directionは、domain modelだけでは表せず、caller-facing contractとも独立し得る。現`public-contracts.md`から何を分離してarchitecture／code structure outcomeにするかは論点23で決め、論点22では名前を先取りしない。
    - ルール: security、performance、compatibility等、今回の三例にない横断方針まで`decision-behavior.md`または`domain-model.md`へ押し込まない。独立した完成判定と固有guideが必要な新themeが見つかった場合はcatalogを拡張し、「根幹だから」という理由で汎用sectionへ収容しない。
    - ルール: ある方針が複数sectionを規定する場合も本文を複製しない。意味正本となるtheme sectionへ置き、具体outcomeは観測可能な帰結を記載する。どれが先に読まれるか、共通意図をどこへ置くかは論点20と論点19のcomposition ruleが所有する。
    - 適用例: 今回のtask-designでは、task-designの役割、設計深度をplan有無から独立させる原則、negative diagnosis、WHY→WHAT→HOW等の判断姿勢を判断・行動sectionへ置く。三result、分類state、handoff、停止gateは`workflow.md`、SKILL.mdとtemplateの構造は`file-deliverables.md`へ置く。
    - 適用例: 「Order」と「Shipment」を別conceptとして扱い、同じ`status`という語でもbounded contextごとに意味を区別することは`domain-model.md`へ置く。DB columnとrelationは`data.md`、public type名とAPI payloadはcaller-facing contract、module配置はarchitecture／code structure outcomeへ置く。

##### 検証

- **観点:** 一つから複数へ分けることで、論点18で守ろうとした根幹方針が再び分散しないか。
- **結果:** file種別や実装先へ分散するのではなく、判断・行動、知識体系、domain model、architectureという意味正本へ分ける。同じthemeの上位方針は一sectionに保ち、具体outcomeは帰結だけを持つ。
- **観点:** 判断・行動とdomain modelの二つを挙げれば、根幹outcomeを網羅したことになるか。
- **結果:** ならない。これは現在の具体例から確認できた空白であり、catalogの閉じた全列挙にはしない。別の独立themeを発見したら専用sectionを追加する。
- **観点:** documentationだけ既存sectionへ残すのは一貫しているか。
- **結果:** `documentation.md`はすでに読者の判断能力、知識構造、規範、維持規律という固有outcomeと固有validationを持つ。上位だから分けるのではなく、semantic themeと完成判定が独立しているかで分割する原則に一致する。
- **観点:** working labelの`decision-behavior.md`は正式名として十分か。
- **結果:** まだ不十分である。decisionとbehaviorの関係が英語として直感的でなく、roleとcapabilityも名前から見えない。提案1ではsectionの必要性と責務だけを評価し、命名は具体templateを作る前の独立decisionへ残す。
- **弱点:** section追加が増えるほど選択が難しくなる。catalogの選択問いとowner境界をsectionごとに具体化し、非code中心steeringの固定mappingも「skillなら常に全section」ではなく、何が本質的に変わるかで選ぶよう見直す必要がある。

##### 合意と後続feedback

> 書いてあるものについては合意。domain-model.md は命名的に何でも入っちゃうから、方針的なものにしたいね。「判断・行動section」としてまとめて汎用化するかも要審議

**決定:** 2026-08-10、提案1を採用する。`purpose-and-principles.md`という一つの汎用sectionは作らず、「根幹であること」は他outcomeを規定する関係として扱う。内容は完成後に成立する意味と検証方法ごとのoutcomeへ分ける。`decision-behavior.md`と`domain-model.md`は説明用のworking labelにすぎず、正式名または採用済みsectionとはしない。

**ネクストアクション:** 完了。子論点24でskill固有の`skill-policy.md`を採用・prototype適用し、子論点25は未決outcome section backlogへ移して取り下げた。architectureとcaller-facing contractは論点23で扱う。

## 論点23: `public-contracts.md`の名前と実質的な責務を一致させる

**ステータス:** 決定

**親論点:** 論点16

**種別:** TBDヒアリング / outcome section命名・owner境界

**起点となった原文:**
> また、別論点キューイングさせてほしいんだけど、.steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/task-design_template_prototype/templates/outcome-sections/public-contracts.md のpublic-contracts って名前再考したい。やりたい実質とファイル名合ってるか？ public自体が目的か？

**提起の背景:** 現行`public-contracts.md`は、(A) 命名・公開APIと、(B) module境界・directory構成を一fileで扱う。catalogも公開名、API、module責務、依存境界を一行へまとめているため、`public`は責務の一部を表すだけで、file全体を選ぶ目的または完成後outcomeを表していない可能性がある。論点22で根幹方針と具体的なmodule／name／boundaryのowner境界を決めるため、その結論を前提に名前とsection分割の要否を評価する。

### 現在の合意対象

**参照する現在案:** イテレーション1の提案1

**今回確認すること:** `public-contracts.md`を改名だけで維持せず、callerが依存する入出力・error・side effectを所有する`caller-contracts.md`と、code全体の責務配置・module／directory・dependencyを所有する`code-structure.md`へ分割する。domain概念化・語彙方針はどちらにも含めずREADMEの未決候補に維持する。

### 議論の変遷

#### 事象の記述

- file名は`public-contracts.md`だが、templateの半分はmodule境界、directory構成、dependency directionを扱う。
- public APIを変更しなくても、internal module責務やdirectory boundaryの本質的変更だけでこのsectionを選ぶ可能性がある。
- 命名もpublic nameだけでなく、domain actionとmodule responsibilityを実装を開かず理解できる状態を目的としている。
- `public`をfile名の中心にすると、internal architectureの変更時に非該当と誤認する一方、公開性そのものがsectionの目的だと誤読される可能性がある。

#### 原因の追跡

- なぜ: 移行元の「命名・公開API」と「module境界・directory構成」を一つの全体layer観点として移植した際、前半の代表語だけをfile名にした。
- なぜ: sectionの名前を「含まれる代表要素」から付け、利用者が何を完成後outcomeとして設計するために選ぶかから評価していなかった。
- なぜ: 根幹のmodule分割方針、具体的なmodule structure、caller-facing contractのowner境界が未分離だったため、一fileの責務と名前の適否を判断できなかった。

#### 根本原因0 + 提案0

- **根本原因0:** 未確定。論点22で根幹方針と具体outcomeの境界を決めた後、現在fileの各blockを意味単位で再分類する。
- **提案0:** 未作成。少なくとも、`public`は現行file全体の目的を表しておらず、現状維持をdefaultにしない。改名だけで責務が一意になるか、caller-facing contractとcode／module structureを分ける必要があるかを比較する。

##### 検証

- **観点:** 今ここで新しい名前を決められるか。
- **結果:** 決めない。論点22の根幹outcomeへ移る意味単位が確定しないうちに改名すると、残る責務を誤って命名する。
- **弱点:** 保留中もprototypeには不整合な名前が残る。論点16のdesign再構成前に必ず再開し、名前を既成事実としてproductionへ移さない。

#### イテレーション1: visibilityではなくcallerの依存とcode構造へ二分する

**受領したfeedback:**
> いや、論点23について何か提案しなさいよ

##### 検証

- **観点:** domain方針の正式sectionが未決でも、現行`public-contracts.md`の責務を評価できるか。
- **結果:** できる。domain概念化・語彙方針をどちらへも入れないというowner境界まで決めれば、残る現行blockはcallerが依存するcontractと、code内の構造へ意味単位で分けられる。domain方針のfile名は分割判断の前提ではない。
- **観点:** `public`は現行file全体を選ぶ目的か。
- **結果:** 違う。public／privateはvisibilityであり、完成後に設計したいものは、callerが依存できる保証と、codeをどの責務単位へ分けどう依存させるかである。internal module再編ではpublic contractが変わらなくても後者が必要になる。
- **観点:** 一fileの二つのoptional blockとして維持できるか。
- **結果:** 形式上は可能だが、selection gateと完成判定が独立する。caller contractだけ変えるtask、内部moduleだけ再構成するtaskの双方で半分が非該当になる。両方を含む名前は`code-design`等のcatch-allになり、catalogから選ぶ判断能力が落ちる。
- **弱点:** 分割すると、public entryの名前がcaller contractとcode structureの双方に現れる可能性がある。identifierとsignatureの正本をcaller contract、code structureではentryから責務・依存関係を追う参照だけに限定するowner境界が必要である。

##### 論点routingの判断

- **discussion scopeへ属する理由:** 現行fileを改名するか分割するか、分けたsectionの名前とownerは論点23の中心decisionである。
- **同一decision scopeとしてiterationを継続する理由:** 初回entryで保存した問題とscopeへ、依存解消後の具体案を追加する。

##### 修正先の判断

- **診断levelへの遡及:** 初回はdomain方針との境界を先に完全確定しなければ提案できないと考えた。しかし必要なのはdomain方針を現行fileへ吸収しない境界であり、正式な受け皿の決定ではなかった。保留を続けず、残る意味単位から分割案を作る。

##### 根本原因1 + 提案1

- **根本原因1:** 移行元の「命名・公開API」と「module境界・directory構成」が同じ全体layer観点にあったことを、一つの完成後outcomeであると解釈した。そのため前半の`public`をfile名にし、異なるselection gate、owner、完成判定を一fileへ残した。
- **変更点:** `public-contracts.md`を一つの新名へ改名する案は採らない。callerが依存する保証とcode structureへ二分し、具体的なpublic identifierが両方へ重複しないowner境界を設ける。
- **提案1（現時点）**:
  - 総論: 現行`public-contracts.md`を`caller-contracts.md`と`code-structure.md`へ分割する。`caller-contracts`は呼出し側が実装を開かず依存できるinterface上の保証、`code-structure`はcode全体を責務単位で追える配置と依存関係を完成後outcomeとして所有する。
  - 各論:
    - ルール: `caller-contracts.md`は、function／method／endpoint／mutation等のcaller-facingな名前、入力、成功result、side effect、callerが処理すべきerror、失敗時のstate・side effect保証を所有する。
    - ルール: `caller`はrepository外の利用者だけを意味しない。別module、application service、adapter等、公開入口へ依存する呼出し側を含む。単なるinternal helperでcallerがcontractとして依存しないものは対象にしない。
    - ルール: `caller-contracts.md`のselection gateは「callerが実装を開かず依存するidentifier、input、result、error、side effect保証のいずれかが変わるか」とする。visibilityがpublicであるだけでは選ばない。
    - ルール: caller-facingな命名根拠は`caller-contracts.md`へ残す。ただし、語彙をどう選び維持するかというdomain方針はREADMEの未決候補、module責務を伝える内部名は`code-structure.md`が所有する。
    - ルール: `code-structure.md`は、layer、component／module／classの責務、directory配置、公開入口、置いてよい／置かないもの、dependency direction、全体のcall relationを所有する。個々のalgorithmやprivate helper一覧は扱わない。
    - ルール: `code-structure.md`のselection gateは「codeを開いて処理を追わず、配置と公開入口から責務分担・依存方向・全体orchestrationを理解するための構造が変わるか」とする。単なるfile移動、同一責務内のprivate refactoringでは選ばない。
    - ルール: `code-structure.md`という名前を採用する。`architecture.md`はsecurity、runtime、deployment等まで含められて広すぎ、`module-boundaries.md`はlayer、directory、class責務、call relationを表すには狭い。`code-structure`は対象をcodeへ限定し、templateのselection gateで内部実装全般への拡張を防ぐ。
    - ルール: public entryのidentifierとsignatureは`caller-contracts.md`を正本とする。`code-structure.md`は全体の入口としてそのidentifierを参照できるが、argument、result、error、side effectを複製しない。
    - ルール: domain概念の定義、ubiquitous language、bounded contextを選ぶ方針は両sectionへ入れず、READMEの未決候補に維持する。data schemaは`data.md`、外部actorの操作sequenceは`interaction-flow.md`、skillの恒久方針は`skill-policy.md`が所有する。
    - ルール: 一つのtaskでcaller contractとcode structureの両方が変わる場合は両sectionを選ぶ。二つの小designへ分割せず、`design.md`全体で一つの完成後の姿として参照関係を示す。
    - ルール: migration時は現行fileのcomment、理由、NG、具体例、selection gate、owner境界、MUST、判断基準を意味単位で二fileへ移し、見出しとplaceholderだけに短縮しない。合意済みでないcontractはRETIREしない。
    - 適用例: `importDocument(url): ImportResult`の名前、argument、result、error、保存side effectが変わるなら`caller-contracts.md`を選ぶ。`DocumentSourceClient`をどのmoduleへ置き、featuresからどの入口だけへ依存させるかが変わるなら`code-structure.md`を選ぶ。両方が変われば両sectionを使う。

セッションでの提案内容
```
• 論点23の提案は、public-contracts.mdの改名ではなく二分です。

   新section              所有する完成後outcome
  ━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   caller-contracts.md    caller-facingな名前、input、result、error、side effect保証
  ─────────────────────  ───────────────────────────────────────────────────────────────────────────────────
   code-structure.md      layer、module／class責務、directory、公開入口、dependency direction、全体call関係

  判断理由は次です。

  - publicは目的ではなくvisibilityにすぎない
  - caller contractだけ変わるtaskと、内部構造だけ変わるtaskは独立して存在する
  - 両方を一fileへ残すと、半分が非該当になる
  - callerが呼ぶidentifierとsignatureはcaller-contracts.mdを正本にする
  - code-structure.mdでは、そのentryを構造上参照するだけでcontract本文を複製しない
  - domain概念化・ubiquitous language方針は、どちらにも入れずREADME backlogに維持する

  architecture.mdは広すぎ、module-boundaries.mdはlayer・directory・class責務・call関係まで表すには狭いため、後者はcode-structure.mdを提案しています。
```

##### 検証

- **観点:** `caller-contracts.md`は`public-contracts.md`より目的を正確に表すか。
- **結果:** visibilityではなく、誰が何へ依存できるかというcontractの存在理由を名前にする。internal caller向けの安定interfaceも含め、publicだがcontract設計対象でない名前を機械的に収容しない。
- **観点:** `code-structure.md`は何でも入る名前にならないか。
- **結果:** `code`は対象artifactを限定するが、structure自体は広い。そこで責務配置、公開入口、dependency、全体call relationに完成判定を限定し、algorithm、private helper、data、runtimeをNGとowner境界で除外する。`architecture`よりは誤収容範囲が狭い。
- **観点:** 具体名のownerが曖昧にならないか。
- **結果:** callerが呼ぶidentifierとsignatureはcaller contract、module／classの責務を示す構造名はcode structure、語彙選択の上位方針は未決domain方針へ分ける。同じidentifierをstructureから参照してもcontract本文は複製しない。
- **観点:** file分割で移行元の細やかな判断能力が落ちないか。
- **結果:** 物理分割を要約作業にせずfunction migrationとして扱い、現行A／Bの各commentと追加済み成功・失敗contractを意味単位で移植する。prototype適用後に旧→新／新→旧照合を行う。
- **弱点:** `caller-contracts`がevent、CLI、file format等の非call型interfaceまで自然に扱えるかは未検証である。現在templateのfunction／method／endpoint／mutation scopeを正確に移し、別interfaceが具体taskで必要になった時に拡張または別sectionを議論する。

##### 合意

> ok

##### 適用結果

- `public-contracts.md`を撤去し、旧(A)を`caller-contracts.md`、旧冒頭の全体layer意図と(B)を`code-structure.md`へ移植した。
- `catalog.md`の一rowを二rowへ分け、visibilityではなくcallerの依存保証とcode構造をそれぞれselection gateにした。
- `interaction-flow.md`、`screen.md`、`contract-preservation.md`のowner参照をcaller contract／code structureへ同期した。
- READMEの未決architecture候補は、採用済みcode structureを除くsystem-level architectureだけを候補として残した。
- `design.md`とfunction migration ledgerへA-023、DTC-P001〜P004、prototype変更を同期した。
- 順方向・逆方向照合の結果は、`適合 2 / 合意済み追加 1 / 合意済み変更 1 / 明示廃止 0 / 未監査 0 / 未分類削除 0 / 未分類追加 0`である。旧三命名例、二directory例、NG、理由、判断基準、成功／失敗contract、配置／境界／call blockのdestinationを目視確認した。
- `doc-enricher` reviewでは、今回のowner境界と未決architecture候補は同directoryのREADMEへ反映済みであり、上位README／docsへ複製する追加候補なしと判定した。
- Markdown差分checkは成功した。production templateは変更していない。

**決定:** 2026-08-10、提案1を採用する。`public-contracts.md`は維持せず、`caller-contracts.md`と`code-structure.md`へ分割する。

**ネクストアクション:** prototypeへの適用と照合は完了した。production templateへの統合は、論点16の残る論点17、20、21と残余監査を完了するまで行わない。

##### 後続のproduction適用漏れ訂正

2026-08-10、論点1・イテレーション3の反映後にproduction `task-design/SKILL.md`を再読し、NG集の二項が撤去済み`outcome-sections/public-contracts.md`を参照していることを確認した。これは新しいowner decisionではなく、論点23で合意した分割の適用漏れである。callerが依存する命名の参照を`caller-contracts.md`、module境界・directory構成の参照を`code-structure.md`へ訂正した。production skill内の`public-contracts.md`参照zero、両destinationの存在、Markdown差分checkを確認した。同じoriginating decisionの`doc-enricher` reviewは実施済みで追加候補なしだったため、重複起動していない。

## 論点24: skillの根幹outcomeを判断・行動sectionとして汎用化するか

**ステータス:** 決定

**親論点:** 論点22

**種別:** TBDヒアリング / outcome section scope・命名

**起点となった原文:**
> 「判断・行動section」としてまとめて汎用化するかも要審議

**提起の背景:** 論点22の自己reviewでは、今回のtask-designに必要な受け皿を、skill、prompt、policy engine等の判断能力と行動原則を扱うsectionとして暫定的にまとめた。しかし、実際に詳細なsourceと完成後の姿を確認しているのはskillだけであり、他artifactにも同じ必須field、完成判定、失敗例が成立するかは検証していない。抽象化を先行すると、skillの根幹を薄める汎用placeholderになる可能性がある。

### 現在の合意対象

**参照する現在案:** イテレーション1の提案1

**今回確認すること:** 最初から判断・行動一般へ汎用化せず、現在具体的に必要なskillの根幹outcomeをskill固有sectionとして設計する。prompt、policy engine等への再利用は、同じ完成判定とtemplate構造が具体caseで確認された後に、別のmigration decisionとして一般化する。

### 議論の変遷

#### 事象の記述

- 今回保存すべきものは、task-design skillの役割、設計と実装の境界、negative diagnosis、五つの設計思想、維持する能力、非目標である。
- これらは単なるobservable behaviorだけでなく、理由、違反signal、帰結、判断質問を一組として持ち、skillの将来変更を拘束する。
- promptやpolicy engineも判断・行動を持ち得るが、skillと同じ構造で設計されることは確認していない。
- working labelの`decision-behavior.md`は、decisionとbehaviorの関係が英語として自然でなく、skillの役割、能力、設計思想が名前から見えない。

#### 原因の追跡

- なぜ: file種別に依存しないoutcome sectionを作るというcatalog原則を強く適用し、複数artifactに共通しそうな最上位語へ早く一般化しようとした。
- なぜ: 「同じように判断する」という表面的共通性と、同じtemplateで完成判定できるという構造的共通性を区別していなかった。
- なぜ: 将来の再利用性を先に確保しようとすると、現在の具体caseで必要な理由、失敗例、判断質問を共通項まで削る圧力が生じる。

#### 根本原因0 + 提案0

- **根本原因0:** outcomeの内容ではなく、将来共通化できそうなartifact群からsection scopeを決めた。実例一つの段階で汎用化すると、何を必ず書くかではなく何でも書ける抽象語だけが残る。
- **提案0（現時点）**:
  - 総論: 今回はskill固有の根幹outcome sectionを作る。file種別固有であることを欠点とみなさず、task-designの具体caseから、skillに共通して必要な完成判定と記述guideを設計する。一般化は少なくとも別種artifactの具体caseで同じ構造を検証してから行う。
  - 各論:
    - ルール: sectionは、skillが何のために存在し利用者またはagentにどの能力を成立させるか、何を正しい／誤りと判断するか、判断を導く設計原則、守る能力境界、禁止・非目標を所有する。
    - ルール: 各設計原則は、短い標語だけでなく、必要性、違反signal、違反時の帰結、正しい判断の問い、具体例を、原則の実際の階層に沿って記述できるようにする。すべての原則へ機械的な五fieldを強制せず、これらの判断能力を落とさないことをMUSTにする。
    - ルール: trigger、入力、owner、state、handoff、停止・再開は`workflow.md`、SKILL.md内の見出しと配置は`file-deliverables.md`、今回この方針へ変更した理由は論点19の設計意図が所有する。skill固有sectionはそれらの実装先や変更履歴ではなく、完成後skillを将来も同じskillとして保つ意味正本になる。
    - ルール: skillの全taskで必須にはしない。skillの誤記修正、章配置だけの変更、既存原則から一意に導かれるworkflow変更では選ばず、role、能力、判断原則、negative diagnosis、非目標のいずれかが新設・変更・廃止される時に選ぶ。
    - ルール: working scopeはskillに限定する。promptやpolicy engineが同じ構造を必要とするという推測でselection gateを広げず、具体taskで不足が見つかった時に、同sectionへ含めるか別sectionを作るかをsource-firstで判定する。
    - ルール: 正式名はこのproposalでは決めない。少なくとも`decision-behavior.md`は不採用候補とし、`skill-principles.md`、`skill-policy.md`、`skill-role-and-principles.md`等を、何を書くかが初見で分かるか、変更理由やauthoring guideと誤読しないか、scope全体を表すかで次iterationに比較する。
    - 適用例: task-designでは「後続作業で新しい設計判断を生じさせない」をskillの役割として置く。「変更点一覧は設計ではない」、negative diagnosis、WHY→WHAT→HOW、TBD、上位合意、spike、対話を、その役割を成立させる原則群として階層化し、維持する理由、違反signal、帰結、問いを落とさない。

##### 検証

- **観点:** skill固有sectionは、catalogのfile種別ではなくoutcomeで選ぶ原則に反するか。
- **結果:** file拡張子や配置ではなく、完成後skillの役割、判断能力、行動原則が変わるかで選ぶ。`file-deliverables.md`とは完成判定が異なり、skillというartifact種に固有のsemantic outcomeとして成立する。
- **観点:** skillだけに限定すると、prompt等で同じ問題が起きた時に重複sectionが増えないか。
- **結果:** 将来同じ必須構造が二つ以上の具体artifactで確認された時に、source contractをledgerで照合して一般化できる。未検証の共通化で現在の判断能力を落とすよりrecoverableである。
- **観点:** skillの存在目的はTL;DRと重複しないか。
- **結果:** TL;DRは今回のtaskをなぜ行い何を完成させるかを記述する。skill固有sectionは完成後skillが恒久的に何を担い、将来の利用・変更で何を守るかを記述するため、時間軸と主語が異なる。
- **弱点:** skill固有でも、role、principles、capability、policy等を一sectionへ束ねすぎる可能性は残る。task-designの実際の根幹をprototypeへ写した時に独立した完成判定へ分かれるなら、名前を決める前にsection分割へ戻る。

#### イテレーション1: `skill-policy.md`として確定し、review用prototypeへ適用する

**受領したfeedback:**
> もうskill-policyとかでいっか。

##### 検証

- **観点:** `skill-policy.md`は、skill固有で始める提案0のscopeを初見で伝えられるか。
- **結果:** `skill`が対象artifactを限定し、`policy`がworkflow手順やfile構造ではなく、完成後skillを拘束する恒久方針であることを示す。`decision-behavior.md`より短く、未検証のartifact一般へscopeを広げない。
- **観点:** `skill policy`が「skillを作る時のrepository共通policy」と誤読されないか。
- **結果:** file名だけでは可能性が残るため、catalogのoutcomeと選択質問、template冒頭で「完成後の個別skillが持つ役割・判断方針・能力境界」であることを明示する。repository共通のskill authoring ruleはdocumentationまたは対応skillが所有する。
- **観点:** 一sectionへ束ねすぎる弱点をprototypeで検査できるか。
- **結果:** task-designの具体例を使い、役割と成立能力、階層を保つ方針と判断軸、能力境界・禁止・非目標、具体caseでの完成後判断を配置する。workflow、file構造、変更理由を分離した状態で読めるかをreviewできる。
- **弱点:** `policy`は抽象的な標語へ薄くなりやすい。template commentで、理由、違反signal、帰結、判断質問、具体例を落とさないMUSTとNGを持たせる。

##### 論点routingの判断

- **同一decision scopeとしてiterationを継続する理由:** skill固有sectionから始める提案0への合意と、その正式名を`skill-policy.md`に確定するfeedbackである。

##### 根本原因1 + 提案1

- **根本原因1:** working labelの比較を続けるより、scopeを`skill`で限定し、内容の薄まりをtemplateの判断能力で防ぐ方が、初見の探索性と現在の具体需要を両立する。
- **変更点:** `decision-behavior.md`を廃止し、正式名を`skill-policy.md`とする。提案0のowner境界とselection gateを、task-designの具体例を含むreview用prototypeへ適用する。
- **提案1（合意済み）**:
  - `skill-policy.md`は、完成後の個別skillの恒久的な役割、成立させる能力、判断方針、能力境界、禁止、非目標、negative diagnosisを所有する。
  - 新規skillでは選択し、既存skillではこれらがADD／CHANGE／RETIREされる場合だけ選ぶ。typo、章配置、policyから一意に導かれるworkflow変更では選ばない。
  - 原則は平坦なtableへ分解せず、必要性、違反signal、帰結、判断質問、具体例を落とさず、実際の階層で記述する。
  - workflow、file構造、変更理由とのowner境界をtemplate commentとcatalogで明示する。
  - prototypeへ`skill-policy.md`を追加し、catalogのoutcome rowと非code中心steering mappingへ反映する。

##### 適用結果

- `task-design_template_prototype/templates/outcome-sections/skill-policy.md`を追加した。
- `catalog.md`へskill policyのselection rowを追加し、新規skillと既存skillの本質的更新を分けた。
- task-designと別review skillの具体例、NG、MUST、判断基準を持たせ、skill名やworkflowだけ残した別物への退行を検出できる形にした。
- Markdown差分checkは成功した。

**決定:** 2026-08-10、提案1を採用する。skillの根幹outcomeは未検証の判断・行動一般へ汎用化せず、`skill-policy.md`としてskill固有に設計する。

**ネクストアクション:** 適用完了。review用prototypeとcatalogを確認対象とし、production templateと現在の`design.md`への統合は論点16の再構成まで行わない。

## 論点25: domainの概念化・語彙・境界を拘束する方針sectionのscopeと名前を決める

**ステータス:** 取下げ

**親論点:** 論点22

**種別:** TBDヒアリング / outcome section scope・命名

**起点となった原文:**
> domain-model.md は命名的に何でも入っちゃうから、方針的なものにしたいね。

**提起の背景:** 論点22の提案1は、ubiquitous language、domain概念の意味、概念境界、bounded contextを、data、public name、module構造から分離するため`domain-model.md`をworking labelとした。しかし`domain model`はentity、value object、business rule、relation、diagram等まで広く含み、今回必要な「domainをどう概念化し、語彙と境界をどの方針で選び維持するか」よりscopeが広い。完成したmodel全体の置場にせず、modeling方針の意味正本になる名前とtemplateが必要である。

### 現在の合意対象

**参照する現在案:** 取下げ。READMEの未決outcome section候補へ移管済み。

**今回確認すること:** 現時点では問題、scope、命名制約だけを保存する。`domain-model.md`は正式候補から外す。domain概念の選び方、意味の境界、ubiquitous languageの維持方針を所有し、具体的なdata model、public name、module構造を所有しないsectionの名前とtemplateを後続discussionで決める。

### 議論の変遷

#### 事象の記述

- `domain-model.md`は完成したdomain modelの全要素を記載するfileに読め、方針以外の具体modelまで収容できる。
- 今回分離したいのは、具体的なschema、class、module、API名ではなく、それらを導くdomain概念化と語彙の方針である。
- `ubiquitous-language.md`だけでは概念境界、bounded context、同名異義・異名同義の扱い、概念分節の原則を十分に表せない可能性がある。
- `domain-policy.md`ではbusiness policy／business rule全般に読め、別のcatch-allになる可能性がある。

#### 原因の追跡

- なぜ: concrete ownerから分離するために、より上位の一般名`domain model`を付けたが、上位であるほどscopeが一意になるとは限らない。
- なぜ: 記載対象の名詞から命名し、何を判断・維持するための方針sectionかをfile名へ反映していなかった。

#### 根本原因0 + 提案0

- **根本原因0:** 未確定。domain modelingの原則、concept definitionの正本、ubiquitous languageの維持policyを一sectionにするか、それぞれ独立させるかを具体caseで照合する。
- **提案0:** 未作成。候補名は固定しない。少なくとも`domain-model.md`と`domain-policy.md`をdefaultにせず、初見で「完成model全体」や「business policy全般」と誤読しないことを命名条件にする。

##### 検証

- **観点:** 今ここで名前を決められるか。
- **結果:** 決めない。概念化方針、語彙方針、context境界方針が同じ完成判定とtemplateで扱えるかを先に検証する必要がある。
- **弱点:** 保留中はdomain方針のownerが未実装である。論点23の`public-contracts.md`再編より前に再開し、具体contractへ再吸収されないようにする。

#### イテレーション1: 現在のblocking論点から取り下げ、READMEの未決候補へ移す

**受領したfeedback:**
> domain-model.mdで包括しようとしていたもの、architecture、securityとかは、未決outcome-sectionとしてREADME.mdに書いておいて

##### 論点routingの判断

- **取下げる理由:** domain方針のsection数、名前、templateをこのsteeringで確定するのではなく、未決outcome sectionとしてREADMEへ保存する指定である。現在のskill policyとtask-design再構成に、domain方針の具体decisionは不要である。
- **履歴を残す理由:** `domain-model.md`が広すぎること、概念化・語彙・境界方針を具体data／contract／moduleから分ける必要性は、将来のsection設計で再利用する起点になる。

##### 適用結果

- `task-design_template_prototype/templates/outcome-sections/README.md`の未決候補に、domainの概念化・語彙・境界を拘束する方針を追加した。
- `domain-model.md`や`domain-policy.md`という暫定fileは作成せず、scope、分割・統合、正式名、templateを未決のまま保持した。

**決定:** 論点25を現在のactive decisionから取り下げる。domain方針はREADMEの未決outcome section候補とし、具体taskで必要になった時にscopeから新たに議論する。

**ネクストアクション:** なし。READMEの未決候補として維持し、`domain-model.md`、`domain-policy.md`等の暫定fileを作成しない。

## 論点26: 未決outcome section候補をprototype READMEで管理する

**ステータス:** 決定

**親論点:** 論点16

**種別:** 直接決定 / prototypeの未決事項管理

**起点となった原文:**
> domain-model.mdで包括しようとしていたもの、architecture、securityとかは、未決outcome-sectionとしてREADME.mdに書いておいて

**提起の背景:** catalogへ採用済みsectionだけを置くと、まだscope、分割、名前、templateが決まっていない意味上の空白が見えなくなる。一方、候補ごとに空fileや暫定catalog entryを作ると、未合意sectionが既成事実になる。prototype directoryのREADMEを、採用済みcatalogとは分離した未決候補のownerにする。

### 現在の合意対象

**参照する現在案:** ユーザー指定による直接決定

**今回確認すること:** 決定済み。READMEに未決候補、owner境界候補、未決事項、対応discussionを記載し、正式合意までfileとcatalog entryを作らない。

### 議論の変遷

#### 事象の記述

- domain概念化・語彙方針、architecture、securityは既存sectionへ押し込めない可能性があるが、section数とtemplateは未決である。
- 論点22では、securityと同じく未収容の横断themeとしてperformanceとcompatibilityも確認済みである。
- 配置順を所有するREADMEは論点20で予定されていたが、配置順自体はまだ未決である。

#### 決定内容

- `task-design_template_prototype/templates/outcome-sections/README.md`を作成する。
- 未決候補として、domainの概念化・語彙・境界方針、architectureとcode structure、security、performance、compatibilityを個別に記載する。
- 各候補は、対象候補、owner境界候補、未決事項を持つ。topicがあるものはdiscussion ownerも示す。
- 候補名をfile名にせず、scope、分割・統合、正式名、template、catalog追加が合意されるまで対応fileを作らない。
- 論点20の配置順を先取りしない。README冒頭で配置順とsection横断規則が未決であることを明示する。

##### 適用結果

- 指定内容でREADMEを作成した。
- 未決候補を既存sectionへ統合せず、五候補を個別に保持した。
- README以外の上位docs／READMEへの重複追記は行わなかった。
- Markdown差分checkは成功した。

**決定:** 2026-08-10、ユーザー指定どおり、未決outcome section候補をprototypeのREADMEで管理する。

**ネクストアクション:** 各候補が具体taskで必要になった時に、scope、owner、section数、正式名、templateをdiscussionで決める。READMEの配置順部分は論点20で追加する。

## 論点27: skill方針変更に伴う利用者向けREADMEをどのoutcome sectionが所有するか

**ステータス:** 取下げ

**親論点:** 論点16

**種別:** TBDヒアリング / outcome section選択・owner境界

**起点となった事象:** 論点16の残余監査で、`plugins/tumeda-dev/skills/README.md`を`documentation以外のfile deliverable`へ記載した一方、prototype READMEの代表パターンはskill方針を利用者向けdocumentationへ反映する場合に`documentation.md`を選ぶと定めている不一致を検出した。

**提起の背景:** 今回のREADME変更は、task-designとsteeringの公開説明を条件付きexecution planと三resultへ変え、plugin利用者が起動後の結果とownerを正しく判断できるようにする。file pathやMarkdown形式だけの変更ではない。現在の第3章のままでは、documentationを除外する`file-deliverables.md`へdocumentation fileを置き、論点9・20で確定したselection／composition ruleを今回の適用だけが破る。

### 現在の合意対象

**参照する現在案:** イテレーション0の提案0

**今回確認すること:** `documentation.md`を今回の第3章へ追加選択し、`skills/README.md`の完成後outcomeをそこで所有するか。採用する場合は、六sectionの理解順、file deliverableとの境界、付録link、論点16の残余監査結果まで同時に訂正する。

### 議論の変遷

#### イテレーション0: 公開READMEをfile成果物ではなくdocumentation outcomeとして扱う

##### 事象の記述

- `file-deliverables.md`の対象はdocumentation以外のfileである。
- `documentation.md`は、形式知化する対象、読者が下せる判断、知識構造、根拠と適用境界、snapshot維持規律、document構造を所有する。
- prototype READMEの代表パターン「skill方針を変更し、skill本体と利用者向けdocumentationへ反映する」は、`skill-policy.md → caller-contracts.md → workflow.md → documentation.md → file-deliverables.md → contract-preservation.md`を基本順とする。
- 現在の第3章は`documentation.md`を選ばず、`plugins/tumeda-dev/skills/README.md`を`documentation以外のfile deliverable`の対象表へ置いている。

##### 原因の追跡

- なぜ: README差分の量が小さいことを、documentation outcomeが変わらないことと混同した。
- なぜ: `file-deliverables.md`を「変更file一覧」の受け皿として使い、file種別ではなく完成後outcomeでsectionを選ぶruleを今回の具体適用で破った。
- なぜ: 旧第3章の移植漏れだけを順方向監査し、新第3章とprototype READMEの具体patternを突き合わせる逆方向監査を初回判定の後まで行わなかった。

##### 根本原因0 + 提案0

- **根本原因0:** section選択を変更量と物理file一覧から判断し、plugin利用者が何を理解・判断できる状態へ変わるかをselection gateにしなかった。
- **変更点:** `documentation.md`を今回の選択sectionへ加え、公開READMEの読者と知識outcomeをそこで設計する。`file-deliverables.md`はskill、template等のdocumentation以外のsource artifactだけを所有する。
- **提案0（現時点）**:
  - 第3章の順序を`skill-policy → caller-contracts → workflow → documentation → file-deliverables → contract-preservation`とする。
  - `workflow`の後に「利用者向けdocumentation」sectionを設ける。
  - 同sectionで、対象を`plugins/tumeda-dev/skills/README.md`、読者をplugin利用者、読後に下せる判断を「task-designはdesignの深さを維持したまま必要時だけplanを返し、steeringはplan resultだけをdispatchしてplanlessを完了する」とする。
  - READMEの知識構造は、task-designの役割と三result、steeringのplan／planless owner境界を既存skill一覧の粒度で説明し、詳細workflowや内部gateを重複記載せず各skillを参照できる状態とする。
  - 根拠と適用境界は`skill-policy`、`caller-contracts`、`workflow`を参照し、README自体をcontract正本にしない。skillの公開contractが変わる時は同じbatchでREADME記述を照合し、snapshotの陳腐化を防ぐ。
  - `documentation以外のfile deliverable`の対象表から`plugins/tumeda-dev/skills/README.md`を外す。file treeはtask-design directoryの物理構造だけを扱うため変更しない。
  - 付録の`skills/README.md`行は、新しいdocumentation sectionとcaller contractを参照する。
  - 適用後に論点16の順方向・逆方向照合を再実行し、`未収容 0 / 根拠不明追加 0 / broken anchor 0`へ戻す。

##### 検証

- **観点:** 一行程度の公開概要更新に`documentation.md`を選ぶと過剰設計にならないか。
- **結果:** 記述量ではなく、読者が依存する知識と判断が本質的に変わるかで選ぶ。今回はplan常時前提から条件付きplanと三resultへ公開理解が変わるため選択条件に合う。sectionはREADMEの粒度を超える内部workflowを複製せず、読者の判断、知識境界、維持規律に限定する。
- **観点:** 同じREADMEをdocumentationとfile deliverableで二重管理しないか。
- **結果:** documentationだけがREADMEの意味と読者outcomeを所有する。file deliverableから対象rowを外し、physical task-design treeにもREADMEを追加しない。
- **弱点:** `documentation.md`を選ぶことでsectionが一つ増える。ただし、選択済みtemplateのowner境界を破って五sectionに丸めるより、六sectionで各outcomeを一度だけ所有する方が読み手にとって一意である。

**決定:** 未決。提案0への合意待ち。

**ネクストアクション:** ユーザー合意後に現在の`design.md`第3章、付録link、論点16の監査結果へ適用する。合意前にproduction fileは変更しない。

#### イテレーション1: file種別とtaskのoutcomeを分け、論点を取り下げる

**受領したfeedback:**
> 「plugins/tumeda-dev/skills/README.mdは利用者向けdocumentation」は知ってる。だけど、なんで今この話が出てくるの？

##### 検証

- **観点:** READMEが変更されること自体から、`documentation.md`の選択が導かれるか。
- **結果:** 導かれない。outcome sectionは変更fileの種別ではなく、このtaskで独立して設計する完成後outcomeから選ぶ。今回はskill policy、caller contract、workflowが主outcomeであり、READMEはその公開一覧への同期である。
- **観点:** 現在のfile deliverable表にREADMEを残してよいか。
- **結果:** 残さない。`file-deliverables.md`はdocumentation以外を所有するため分類が不正である。ただし変更事実とvalidationは付録に既に存在するため、row削除で意味は失われない。

##### 原因の追跡

- なぜ: 旧第3章の意味保存を監査する途中で、変更fileごとのoutcome section選択へ問いをすり替えた。
- なぜ: READMEというfile種別を見て、taskが成立させるoutcomeを再評価せず`documentation.md`へ直結した。

##### 論点routingの判断

- **取下げる理由:** documentation outcomeの追加という独立decisionは存在しない。既存のowner境界から一意に導けるfile表の分類訂正だけで完了する。
- **履歴を残す理由:** file種別とtask outcomeを混同して不要なsectionと論点を増やした経緯は、outcome section選択の再発防止に必要である。

**決定:** 2026-08-10、ユーザーの`ok`を受け、論点27を取り下げる。`documentation.md`は追加選択せず、README rowを`documentation以外のfile deliverable`から外す。READMEの変更事実とvalidationは付録で維持する。

**ネクストアクション:** なし。論点16の残余監査をzeroへ戻し、次の独立論点へ進む。

## 論点28: skill policyを固定枠へ圧縮せず、意味関係に応じた記法で表現する

**ステータス:** 決定

**親論点:** 論点16

**種別:** TBDヒアリング / 現在のdesign再構成・outcome section template修正

**起点となった原文:**
> 「3. 完成後の姿」の「skillの役割と方針」の箇条書きが完全金属疲労。読める量じゃないものが1文の散文で収まっている。 plugins/tumeda-dev/docs/documentation_standards/expression_notation.md を見れば完全に違反ってわかると思う。 .steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/task-design_template_prototype/templates/outcome-sections/skill-policy.md が金属疲労の原因。方針なんて長く書かれるものを箇条書きに押し込んだことが原因

**提起の背景:** 現在の`design.md`は、`task-design`、`facilitate-discussion`、`steering`ごとに、役割、方針、能力境界、具体caseを固定labelへ押し込み、一つの段落へ複数の独立した方針、因果、禁止、例外を連結している。prototype `skill-policy.md`の記入blockがこの固定形を要求しており、長くなることが自然なpolicyを読み手が追える意味階層へ分けられない。

### 現在の合意対象

**参照する現在案:** イテレーション0の提案0

**今回確認すること:** まず現在の`design.md`で、三skillのpolicyを意味のある小見出しへ再構成する。その具体形を正例として、prototype `skill-policy.md`から固定四枠を廃止し、`expression_notation.md`に従って方針ごとに記法を選ぶtemplateへ変える。

### 議論の変遷

#### イテレーション0: 現在のskill policyを意味階層へ戻し、その形をtemplateへ一般化する

##### 事象の記述

- `expression_notation.md`は、同格・並列だけを箇条書きにし、説明が独立した話題へ育った項目は小見出しへ昇格するよう定める。
- 同standardは、全体目的を一つの記法へ結びつけず、内容を構成する各pieceの関係に応じて図、表、箇条書き、散文を選ぶよう定める。
- prototype `skill-policy.md`は、実際の記入blockを`役割と成立させる能力`、`方針と判断軸`、`能力境界、禁止、非目標`、`具体caseでの完成後判断`の四つへ固定している。
- とくに`方針と判断軸`は、通底する方針、親子関係を持つ原則群、必要性、違反signal、帰結、判断質問、具体例を、一つのplaceholderへ収める形である。
- 現在の`design.md`では、その結果としてtask-designの設計能力、五つの思想、自己更新規律が一段落に連結され、facilitate-discussionとsteeringでも複数policyと禁止が一段落へ押し込まれた。

##### 原因の追跡

- なぜ: `skill-policy`という上位目的を一つの表現形式へ結びつけ、policy内部のpieceが持つ親子、因果、条件、並列という異なる関係を見なかった。
- なぜ: templateの意味ownerを定義することと、毎回同じ四つの表示枠を要求することを混同した。
- なぜ: 「漏れなく書かせる」ためのfieldを増やし、読み手が理解できる単位へ分ける責任をtemplateから外した。
- なぜ: prototypeをcurrent designへ適用した時、意味保存だけを確認し、`expression_notation.md`による記法reviewを行わなかった。

##### 根本原因0 + 提案0

- **根本原因0:** policyの意味要件を固定formatとして実装したため、内容が増えてもfield内へ圧縮する以外の逃げ道がなくなった。templateが、読み手の理解よりfield充足を優先させる構造になっている。
- **変更点:** semantic requirementは維持するが、固定四枠を出力formatとして要求しない。current designでは独立したpolicy unitを固有の小見出しへ昇格し、templateではpiece間の関係に応じた記法選択を必須にする。
- **提案0（現時点）**:
  - `expression_notation.md`自体は十分な判定基準を既に持つため変更しない。
  - 現在の`design.md`の「skillの役割と方針」を、次の構造へ再構成する。

    ```text
    ### skillの役割と方針

    #### task-design
    役割を短い散文で定義する。

    ##### designの深さをexecution planから切り離す
    ##### execution planへ送る対象を限定する
    ##### sourceから設計能力を保存する
      ###### 完了判定
      ###### 設計の進め方
      ###### 自己更新
    ##### 軽量modeのlabelを廃止し、能力を全taskへ共通化する

    #### facilitate-discussion
    役割を短い散文で定義する。

    ##### 委託themeの議論を完全に記録する
    ##### 認識齟齬を原因ownerへ戻す
    ##### discussion内部contractをconsumerへ複製しない

    #### steering
    役割を短い散文で定義する。

    ##### ready resultを検証してrouteを分ける
    ##### runtime fieldのsingle writerになる
    ##### planlessを実行対象として扱わない
    ```

  - roleはskillの存在理由と利用後に成立する能力を結ぶ短い散文にする。役割の属性を`skill:`、`恒久的な役割:`、`利用後に成立する能力:`という三つの箇条書きへ分解しない。
  - policyは内容を表す固有見出しを付ける。複数policyを`方針と判断軸`という一つのgeneric labelへ連結しない。
  - 一つのpolicy内で、理由、条件、例外、帰結が因果で結ばれる時は散文を使う。違反signalや判断質問等が短く同格な時だけ箇条書きを使う。
  - 上位policyから複数の原則が導かれ、それぞれが独立した説明を持つ時は、親policyの下へ小見出しとして置く。原則名をflat listやtableへ潰さない。
  - 能力境界、禁止、非目標は、policyごとに正しい戻り先と結びつくなら該当policy内へ置く。複数policyを横断する独立した境界だけを固有見出しへする。`能力境界、禁止、非目標`というcatch-allへ集約しない。
  - 具体caseは、それが説明するpolicyの直後へ置く。全policyのcaseを末尾の`具体caseでの完成後判断`へまとめない。今回のdocs単独変更caseは`workflow`の代表scenarioが既に所有するため、skill policyから重複を除く。
  - prototype `skill-policy.md`では、visibleな固定四枠を削除する。`#### {skill名}`と短いrole paragraphだけを共通入口とし、その後は必要なpolicy unitを固有見出しで必要数だけ置く。
  - prototypeのcommentへ`expression_notation.md`を明示参照し、次の記法gateを置く。
    - 入れ替えても意味が壊れない短い同格要素だけを箇条書きにする。
    - 一項目が独立した理由、条件、例外、caseを持つなら小見出しへ昇格する。
    - 親子関係をflat listへ、複数policyを一段落の散文へ圧縮しない。
    - tableは短い値を同じ属性で比較する場合だけに使い、policy本文をcellへ入れない。
  - prototype内のtask-design例と別skill例も、同じ四fieldの記入例ではなく、固有見出し、散文、必要な箇条書きを組み合わせた正例へ変更する。

##### 現在のdesignへ適用した時の具体像

`task-design`では、役割を一段落で示した後、少なくとも次の意味単位を分ける。

- `designの深さをexecution planから切り離す`: designはtask全体の完成後世界を描き、planの有無やcode変更の有無で深さを変えない。対象成果物への適用時期とexecution plan要否も別に判断する。
- `execution planへ送る対象を限定する`: コーディング、実行時に段階を踏む作業、ユーザー指定だけをplan対象にする。discussion、調査、技術検証実装はdesign手段として扱う。
- `sourceから設計能力を保存する`: 完了判定、五つの設計思想、Opus条件と自己適用を、完了判定／設計の進め方／自己更新の子見出しへ分ける。
- `軽量modeのlabelを廃止し、能力を全taskへ共通化する`: 廃止するlabel・分岐・formatと、共通化するcoverage・discussion駆動・記録能力・file観点を因果で説明し、Requirements contractを未合意に落とさない。

`facilitate-discussion`では、完全な議論記録、原因owner routing、consumerとの境界を別policyにする。`steering`では、result routing、runtime field ownership、planless非dispatchを別policyにする。現在の一段落に含まれる意味は落とさず、workflowへ既に正本がある具体scenarioだけをskill policyから除く。

##### 検証

- **観点:** 小見出しを増やすだけで、別の金属疲労を起こさないか。
- **結果:** field名をそのまま小見出しにするのではなく、内容を表すpolicy名だけを見出しにする。短い同格要素は箇条書き、因果は散文に残し、説明が独立した時だけ昇格する。
- **観点:** templateから固定fieldを外すと、役割、境界、禁止、具体例が欠落しないか。
- **結果:** これらをsemantic MUSTと判断基準としてcommentに維持する。表示枠を必須にせず、各policy unitに必要な意味が存在することをreviewする。
- **観点:** 現在のdesignとprototypeだけを直して、同じ失敗が他のoutcome sectionへ残らないか。
- **結果:** 今回の直接原因は`skill-policy.md`の固定四枠であり、まずここをscopeにする。共通の記法ruleは既存`expression_notation.md`を参照するため、同じ本文をREADMEやcatalogへ複製しない。他sectionに実例が見つかった場合は、そのsection固有の固定format問題として別途routingする。
- **弱点:** 自由度が上がるため、見出しを増やしすぎる実装者が出る可能性がある。小見出しへの昇格条件を「独立した理由、条件、例外、caseを持つ」に限定し、短い同格要素は箇条書きへ戻すgateで抑える。

**決定:** 2026-08-10、ユーザーの`ok`を受け、提案0を採用する。`skill-policy.md`が所有する意味要件は維持し、固定四枠だけを廃止する。短いroleを入口に、独立したpolicyを固有見出しへ分け、散文、箇条書き、親子見出しを各pieceの関係に応じて選ぶ。

**反映結果:** 現在の`design.md`では、task-design、facilitate-discussion、steeringのroleと独立policyを固有見出しへ分けた。task-designの完了判定、設計の進め方、自己更新と、軽量mode廃止後に廃止・共通化・維持する内容は、親子関係を保って分けた。workflowが既に所有するdocs単独変更scenarioはskill policyから重複を除いた。

prototype `skill-policy.md`では、visibleな固定四枠を削除した。短いroleと必要数の固有policy見出しだけを共通入口とし、`expression_notation.md`の参照、見出しへの昇格条件、散文と箇条書きの使い分け、境界・禁止・caseの局所配置をcommentのMUSTへ反映した。function migration ledgerへA-029とP-CHG-015を追加し、意味要件の維持と表示formatの変更を分けて追跡する。production templateへは反映していない。

**doc-enricher review:** このoriginから得た永続的な一般則は、既存の`documentation_standards/expression_notation.md`が既に「全体目的を一記法へ結びつけず、piece間の関係で記法を選ぶ」として所有している。prototypeから同文書を参照すれば探索性も成立するため、Gate G（既存documentとの重複）によりREADME／docsへの追加提案はなしとする。

**ネクストアクション:** 論点28は完了。論点16の統合design reviewと一文・意味単位の残余監査へ戻る。

## 論点29: 再構成前comparison sourceの復元不能をどう扱うか

**ステータス:** 決定

**親論点:** 論点16

**種別:** レビュー指摘 / 監査証拠

**起点となった原文:**
> もういいよ。残ってないなら諦めて

**提起の背景:** 論点16の旧→新監査は、再構成前の第3章についてSHA-256と行ごとの意味要約を残したが、原文snapshot自体の保存pathまたはGit revisionを残していなかった。workspace、`/private/tmp`、Git stash、Git history、到達不能blobを確認したが、該当する原文snapshotは見つからなかった。

### 議論の変遷

#### 事象の記述

- SHA-256は手元の候補が同じ内容かを検証できるが、原文を復元することはできない。
- 原文がない状態で過去の第3章を再構成すると、実在した記述と現在の推測を区別できない。
- ユーザーは、残っていないsnapshotの追加探索と復元を打ち切るよう明示した。

#### 原因の追跡

- なぜ: 再構成前に比較対象のhashだけを記録し、実体を再現可能なsnapshotとして保存しなかった。
- なぜ: 同じapplication cycle内で監査すれば足りると考え、後から第三者が監査証拠を再実行する条件を満たさなかった。
- なぜ: 既存のfunction migration policyが要求する「再現できる識別子」を、内容を復元できないchecksumだけで満たしたと誤認した。

#### ユーザー直接指定による扱い

- 復元不能な旧comparison sourceの探索は終了する。
- 現在の意味要約から、過去の原文snapshotを推測で作らない。
- 論点16の行単位表は当時のsemantic routing記録として保持するが、旧原文を再現できる証拠とは扱わない。
- Git revisionで再現できるmigration baselineと、discussionに残る明示decisionを用いる本来のsource-first監査は、このsnapshot復元の断念とは分けて継続する。

##### 検証

- **観点:** 復元を断念することで、失われた旧原文を「監査済み」と偽装しないか。
- **結果:** 原文snapshotは復元不能と明記し、意味要約を原文の代替物へ昇格させない。
- **弱点:** 旧中間draftにしか存在せず、意味要約にも残らなかった表現上の差異は回収できない。この限界は消せないため、再現可能なGit baselineから最終成果物までの監査を完了根拠にする。

**決定:** 2026-08-10、ユーザーの直接指示により、再構成前comparison sourceの追加探索と復元を断念する。推測snapshotは作らず、復元不能という証拠上の限界を残す。

**ネクストアクション:** 復元作業はなし。再現可能なGit baselineを起点とする残余監査へ戻る。

## 論点30: 四routing stateから三resultとsteering完了までを一つのlifecycle contractとして閉じる

**ステータス:** 決定

**親論点:** 論点12

**種別:** 統合design review / caller contractとworkflowの整合性

**提起の背景:** 論点1、3、6、7等で、対象成果物変更の四routing state、execution planの掲載条件、`tasklist_ready | roadmap_ready | planless_complete`、steeringのroute分岐を個別には合意した。しかし現在の`design.md`を一つのcontractとして読むと、各decisionの再承認ではなく、それらを接続した時に共通成立条件、plan作成中の中間state、steeringの終了地点が欠落または局所記述になっていないかを検証する必要がある。この接続が確定しなければ、論点10のrepository validatorが何を検査するかも確定しない。

### 現在の合意対象

**参照する現在案:** 根本原因0 + 提案0

**今回確認すること:** 四routing stateからdesign phase完了、条件付きplan設計、三result、steering完了までを提案0の一つのlifecycle contractとして確定するか。とくに、三resultの共通成立保証を明示し、plan系resultへも分類保留zero・反映待ちzero・適用済み変更のvalidationを要求すること、plan設計・review・合意を状態遷移へ戻すことを確認する。この決定だけでは、`design.md`全体、論点10のvalidator実装内容、論点15のrelease versionを合意済みにしない。

### 議論の変遷

#### 事象の記述

- 現在の`callerが依存するcontract`では、`planless_complete`の成立保証に分類保留zero、反映待ちzero、対象成果物への反映・validationを明記している一方、`tasklist_ready`と`roadmap_ready`のrowにはdesignとplanの合意、反対側planの不存在しか書かれていない。
- task-designのproduction contractでは三result共通の完了条件として分類保留zero、反映待ちzero、適用済み変更のvalidationを要求しているため、現在のdesign内でcaller-facing contractだけを読むとplan routeの保証が弱く見える。
- 現在のworkflow図は、`design ready`からexecution plan対象の有無だけで三resultへ直接遷移しており、対象がある場合に必要なleaf／composite判定、plan作成、plan review、plan合意を状態として表していない。
- workflow図のplan routeは`tasklist dispatch | roadmap orchestration`で終わり、planless routeだけが`planless完了`へ到達する。plan実行後の完了は既存tasklist／roadmap contractを維持する方針として本文にはあるが、一つのlifecycle上の接続として読めない。
- `design ready`という語が、design phaseの完了と、callerへ返却可能なready resultの両方に読める。plan routeではdesign phase完了後にplan設計が残るため、両者は同じstateではない。

#### 原因の追跡

- なぜ: `planless_complete`を新設する差分の説明を中心にcaller contractを書き、既存二resultにも共通するtask-design完了条件を共通保証として括り出さなかった。
- なぜ: workflow図を今回変わる分岐の要約として作り、変更しないplan設計・実行contractを省略した結果、図だけでは開始から完了まで閉じない状態になった。
- なぜ: 個別論点の内容がそれぞれのsectionに存在することを確認し、section境界をまたぐ同一invariantが同じ強度で接続されているかを検証していなかった。

#### 根本原因0 + 提案0

- **根本原因0:** 合意済みdecisionをsectionごとに収容したが、routing、task-design完了、caller result、steering routeを貫く共通invariantを一つのlifecycleとして正規化しなかった。そのため、局所的には正しい記述同士の間に、plan routeだけ保証が薄くなる箇所と中間stateの省略が生じた。
- **提案0（現時点）**:
  - 総論: `decision確定 → 四routing state → design phase完了 → execution plan対象の有無による分岐 → 条件付きplan設計・合意 → 三resultの一つを返却 → steeringの共通gate → route固有の完了`を一つのlifecycle contractとして記述する。既存decisionを再審議せず、接続時に不足した共通保証と中間stateだけを補う。
  - 各論:
    - ルール: すべての対象成果物変更は、decisionまたは確定factが生じた時点で`分類保留 | task-design内反映待ち | task-design内反映済み | execution plan対象`のちょうど一つへ置く。同一対象を複数stateへ重複掲載せず、stateが変わった場合は旧stateから移す。
    - ルール: `design phase完了`は、designの自然言語合意だけでなく、未解消TBD・未確定decisionがなく、`分類保留`sectionが削除され、`task-design内反映待ち`が`なし`で、task-design内反映済み変更のvalidationとdesign参照が記録された状態とする。`design ready`という曖昧なstate名は使わない。
    - ルール: 三resultの共通成立保証をcaller contractへ一度だけ明記する。共通保証は、design合意済み、未解消TBD・未確定decisionなし、分類保留zero、反映待ちzero、task-design内反映済み変更のvalidation完了である。result tableはこの共通保証を前提に、route固有条件だけを書く。
    - ルール: execution plan対象がzeroの場合だけ、両plan fileが存在しないことを確認して`planless_complete`を返す。対象成果物への必要な反映を行わず、「planがない」ことだけでこのresultを返さない。
    - ルール: execution plan対象が一件以上ある場合は、leaf／compositeを判定し、対応する一方のplanだけを設計・review・合意する。leafかつ合意済み`tasklist.md`が存在し`roadmap.md`が存在しない時だけ`tasklist_ready`、compositeかつ合意済み`roadmap.md`が存在し`tasklist.md`が存在しない時だけ`roadmap_ready`を返す。design phase完了からplan合意を飛ばしてready resultへ遷移しない。
    - ルール: plan reviewで完成後の姿、Requirements、公開contractが変わるfeedbackを受けた場合はdesign discussionへ戻り、routingとdesign phase完了を再判定する。task順、粒度、検証手順等、完成後の姿を変えないfeedbackだけをplan側で解消する。
    - ルール: steeringは三resultすべてへidentity／stateと共通safety gateを適用する。`planless_complete`はそのgate後にsteering完了へ到達し、実行開始確認もdispatchも行わない。plan resultは実行開始確認後に既存のtasklist executionまたはroadmap orchestrationへ接続し、それぞれの既存完了contractを経てsteering完了へ到達する。既存plan実行contractの本文を今回のworkflowへ複製しない。
    - ルール: result名、必須field、canonical root、plan fileの排他性、付録stateが矛盾する場合は、steeringが自動修復または完了扱いせず、同じworking directoryでtask-designへ戻す。
    - 適用例1: 依存のないdocsだけを変更するtaskでは、docsを反映・validationして`task-design内反映済み`へ置き、execution plan対象がzero、両plan fileが不存在なら`planless_complete`を返す。
    - 適用例2: docs反映とcode変更が混在するtaskでは、docsを`task-design内反映済み`、codeを`execution plan対象`へ置く。反映待ちをzeroにしてdesign phaseを完了した後、code変更をleaf planとして合意できた場合だけ`tasklist_ready`を返す。
    - 適用例3: 未決decisionに依存するskill一括変更が`task-design内反映待ち`に残っている間は、execution plan対象の有無にかかわらずdesign phase未完であり、三resultのどれも返さない。
    - 適用例4: 複数の独立した子scopeが必要な変更では、design phase完了後にcomposite判定を行い、子scope、依存DAG、完了条件を持つ`roadmap.md`の合意後にだけ`roadmap_ready`を返す。

##### lifecycleの完成形

```text
decision／fact確定
  -> 対象成果物変更を四stateの一つへrouting
  -> 未決解消とtask-design内反映・validation
  -> design phase完了
      ├─ execution plan対象zero
      │    -> plan file不存在を確認
      │    -> planless_complete
      │    -> steering共通safety gate
      │    -> steering完了
      └─ execution plan対象あり
           -> leaf／composite判定
           -> tasklistまたはroadmapを設計・review・合意
           -> tasklist_readyまたはroadmap_ready
           -> steering共通safety gate
           -> 実行開始確認
           -> 既存のtasklist executionまたはroadmap orchestration
           -> 既存完了contractを経てsteering完了
```

##### 検証

- **観点:** planless routeだけに厳しい完了条件を課し、plan routeではtask-design内反映待ちや未validation変更を残せる抜け道がないか。
- **結果:** 三result共通保証へzero条件とvalidationを括り出すため、どのresultでも同じtask-design完了条件を通る。
- **観点:** execution plan対象があるだけで、未合意planをready resultとして返せないか。
- **結果:** leaf／composite判定、対応planの設計・review・合意、反対側planの不存在をroute固有条件にするため返せない。
- **観点:** 既存tasklist／roadmapの実行contractを今回のworkflowへ複製し、多重管理にならないか。
- **結果:** plan routeが既存contractへ接続して最終的にsteering完了へ到達することだけを示し、停止、再開、task state等の詳細は既存正本を維持する。
- **観点:** このdecisionを統合`design.md`全体への合意として扱ってしまわないか。
- **結果:** 判断対象をlifecycle接続に限定し、反映後にdesign全体の残る不確実性を再評価する。論点10と15は保留を維持する。
- **弱点:** lifecycleの接続が確定しても、production validatorの具体assertionとrelease互換性は自動では決まらない。前者は論点10、後者は論点15で、この確定contractを入力に別decisionとして扱う。

**決定:** 2026-08-10、ユーザーの`ok`を受け、提案0を採用する。四routing state、design phase完了、条件付きplan設計、三result、steering完了を一つのlifecycle contractとして接続する。三result共通の成立保証を括り出し、plan routeでも分類保留zero、反映待ちzero、task-design内反映済み変更のvalidationを必須とする。plan対象がある場合は、leaf／composite判定と対応planの設計・review・合意を経なければready resultを返さない。

**反映結果:** 現在の`design.md`の`callerが依存するcontract`へ三result共通成立保証を追加し、result表をroute固有条件へ限定した。`workflow`では`design ready`を`design phase完了`へ改め、plan対象ありのbranchへleaf／composite判定、plan設計・review・合意、既存実行contractからsteering完了までの接続を追加した。design completion gateへ反映待ちzeroと適用済み変更のvalidationを移し、四routing stateの排他性も明記した。`design ready`の残存zero、三resultの共通保証参照、plan合意前のready result不成立、Markdown差分を確認した。production skill、prototype、validator、versionは変更していない。

**doc-enricher review:** `plugins/tumeda-dev/skills/README.md`はskill群の目次として詳細contractを一行概要へ留める方針であり、条件付きplanと三resultは既に記載されている。今回補った共通zero条件とplan中間stateはtask-design／steeringの内部contractであり、READMEへ複製すると既存方針とGate Gに反するため、README／docsへの追加候補なしと判定した。

**ネクストアクション:** 論点30は完了。`design.md`全体は引き続き未合意draftであり、付録の反映待ちと分類保留も残るため、三result返却やplan作成へ進まない。次の論点を選ぶ前に、統合designに残る不確実性を再評価する。

## 論点31: production template統合の反映待ちを解除する条件を確定する

**ステータス:** 決定

**親論点:** 論点12

**種別:** 統合design review / 対象成果物変更のrouting再評価

**提起の背景:** `design.md`付録では、prototypeで合意済みのtask-design template差分をproductionへ統合する作業を`task-design内の対象成果物反映待ち`へ置き、論点16の一文・意味単位の残余監査を依存decisionとしている。論点16の再構成・残余監査は完了し、復元不能な旧中間snapshotの追加探索も論点29で終了したが、付録は以前の依存先を保持したままである。解除条件を単に「統合design全体の合意」へ置き換えると、反映待ちzeroをdesign phase完了条件とする論点30のlifecycleと循環する。

### 現在の合意対象

**参照する現在案:** 根本原因0 + 提案0

**今回確認すること:** production template batchの解除条件を、「統合design全体の最終合意」ではなく「template内容を変え得る未決decisionがzeroで、prototypeが今回の合意済み完成形として固定されたこと」へ改めるか。あわせて、既知の未決論点10、15と論点30がprototype内容を変えるかを具体的に判定し、現在その解除条件を満たしているため、合意後にtask-design内でproductionへ一括反映するかを確認する。

### 議論の変遷

#### 事象の記述

- productionの`plugins/tumeda-dev/skills/task-design/templates/`には途中時点のprototypeが反映されているが、その後に合意した`contract-preservation.md`、outcome sectionの配置順、設計意図／代替案の生成gate、固定設計判断章の廃止、`skill-policy.md`の記法変更等は未反映である。
- これらのprototype変更は論点17〜26、28で個別に合意され、論点16の再構成・残余監査へ反映された。
- 付録の待ち理由は論点16の残余監査だが、論点16は既知の受け皿を子論点へ分解して再構成・監査を完了し、残余をzeroへ戻している。失われた旧中間snapshotだけは論点29により復元不能という限界を明示して探索を終了した。
- 現在未決の論点10はrepository validator codeのexecution plan routing、論点15はrelease versionであり、どちらの結論もtask-design templateの本文またはfile構成を変えない。
- 論点30でcurrent designのcaller contractとworkflowに不足が見つかったが、prototype `caller-contracts.md`は成功・失敗時のcaller-facing保証を、`workflow.md`は各stateの入口event、先行gate、正本、result、終了条件を既にMUSTとしている。今回の不足はこの`design.md`での具体適用漏れであり、prototype templateの一般contract不足ではない。

#### 原因の追跡

- なぜ: 反映待ちへ置いた時点の直近作業名である「論点16の残余監査」を依存decisionとして記録し、その作業完了後に「何がtemplate内容を実際に変え得るか」から依存を再計算しなかった。
- なぜ: 一括反映で整合性を守ることと、steering内のすべてのdecisionが終わるまで待つことを同一視し、batchの内容を固定するdependency boundaryを定義しなかった。
- なぜ: design最終合意前に対象成果物を反映できるtask-designのrouting contractと、反映待ちzeroをdesign phase完了条件とするcompletion contractを接続していなかった。

#### 根本原因0 + 提案0

- **根本原因0:** 反映待ちの解除条件を、成果物内容へ影響する未決decisionではなく、当時予定していた工程名へ結びつけた。そのため工程完了後も待ちstateが残り、全体合意を待つとcompletion gateが循環する状態になった。
- **提案0（現時点）**:
  - 総論: production template batchは、template内容へ影響するdecisionがzeroになり、prototypeの内容とfile集合を今回の反映単位として固定できた時点で解除する。design全体の最終合意を解除条件にせず、このbatch自体の内容合意と依存解消を根拠にtask-design内で一括反映・validationする。
  - 各論:
    - ルール: 反映待ちの依存欄には、過去の工程名ではなく、対象成果物の内容またはownerを変え得る未決decisionだけを書く。依存decisionが完了するたびに、残る未決decisionから依存を再計算する。
    - ルール: production template batchへ含める正本は、`task-design_template_prototype/templates/`の合意済み全体とする。途中時点のproduction templateへ個別patchを追加せず、prototypeから整合する一単位として同期する。
    - ルール: `templates/tasklist.md`と`templates/roadmap.md`は今回の変更対象ではなく、baselineとのbyte一致を維持する。prototype内に存在しても、合意のない変更をproductionへ持ち込まない。
    - ルール: 論点10のvalidator codeと論点15のversionはtemplate batchの内容を変えないため、この反映待ちの依存先にしない。両論点は付録の`分類保留`に残す。
    - ルール: 論点30の不足はcurrent designへの適用漏れであり、prototypeの`caller-contracts.md`と`workflow.md`には対応するsemantic MUSTが既にあるため、新しいprototype差分を追加しない。
    - ルール: 現在は、既知のtemplate内容を変え得る論点17〜26、28が決定済みで、論点16の残余監査も完了している。したがって提案0への合意を、prototype batchの内容freezeと反映待ち解除decisionとして扱う。
    - ルール: 合意後、production `plugins/tumeda-dev/skills/task-design/templates/`へprototypeの対象差分を一括反映し、productionとprototypeの対象file一致、file集合、内部link、selection gate、tasklist／roadmap baseline byte一致、migration ledgerの順方向・逆方向対応、Markdown差分を検証する。
    - ルール: validation成功後、付録の対象を`task-design内で対象成果物へ適用済み`へ移し、`task-design内の対象成果物反映待ち`を`なし`にする。validation失敗またはprototype外の判断が必要になった場合は適用済みへ移さず、具体的な未決decisionを新しい反映待ち依存として記録する。
    - 適用例: `skill-policy.md`だけを先にproductionへpatchせず、catalog、README、選択済みoutcome section、design coreをprototypeの一batchとして同期する。一方、実行codeである`validate-plugin.mjs`はこのbatchへ混ぜず、論点10まで分類保留を維持する。

##### 検証

- **観点:** 統合designの最終合意前にproductionへ反映すると、未決内容を先行適用する問題を再発しないか。
- **結果:** steering全体の未決有無ではなく、template内容を変え得る未決decisionがzeroかを確認する。既知のopen decisionはvalidator codeとversionだけでtemplateへ影響せず、この提案自体でprototype batchの内容を明示的にfreezeする。
- **観点:** 反映待ちzeroをdesign completion gateに置きながら、全体合意を解除条件にして循環しないか。
- **結果:** 最終合意より前のtask-design内反映として解除するため、反映・validation・付録更新後にdesign全体の最終reviewへ進める。
- **観点:** 論点30の発見をprototypeへ反映せず、同じ漏れを再発させないか。
- **結果:** prototypeのcaller contractとworkflowは既に、成功・失敗保証、各stateのgate、result、終了条件を要求している。current designの適用漏れをtemplate不足へ読み替えて重複ruleを追加せず、production同期後のvalidationで該当MUSTが残ることを確認する。
- **観点:** 多file変更であることを理由にexecution plan対象へ送るべきか。
- **結果:** prototypeという一つの正本からproductionへ同期して連続validationする決定済み非code batchであり、実行時の中間checkpoint、外部調整、rollback境界、独立した検証単位を必要としない。file数だけでは掲載条件に該当しないためtask-design内で反映する。
- **弱点:** production同期後のsource-first逆方向監査で、prototypeにないproduction固有contractが見つかる可能性は残る。その場合はprototypeで上書きして消さず、validation失敗として停止し、未決decisionへ戻す。

**決定:** 2026-08-10、ユーザーの`ok`を受け、提案0を採用する。production template batchの解除条件を、統合design全体の最終合意ではなく、template内容へ影響する未決decisionがzeroでprototypeの内容とfile集合をfreezeできたこととする。既知の未決論点10、15はtemplate内容を変えず、論点30はprototype一般contractの不足ではないため、現在この解除条件を満たす。prototypeを一つの正本としてproductionへ一括反映し、tasklist／roadmapを変更せず、validation成功後に反映待ちを解消する。

**反映結果:** freeze済みprototypeの`design.md`と`outcome-sections/`をproduction `plugins/tumeda-dev/skills/task-design/templates/`へ一括同期した。旧`public-contracts.md`を撤去し、`caller-contracts.md`と`code-structure.md`へ置換した。productionとprototypeは17 fileの集合・内容がbyte一致し、render対象の相対Markdown link、catalogのselection gate、caller contract／workflowのsemantic MUSTを確認した。`tasklist.md`と`roadmap.md`はbaseline revision、prototype、productionで同一SHA-256だった。function migration ledgerへ論点31のproduction同期証拠を追加し、`design.md`付録のproduction template rowを最終状態へ更新して、`task-design内の対象成果物反映待ち`を`なし`にした。Markdown差分checkは成功した。

**doc-enricher review:** `plugins/tumeda-dev/skills/README.md`は個別skillの詳細を一行概要へ留める目次であり、task-designの条件付きplanと三resultは既に記載されている。source-first migration、二層ledger、未分類差分の停止、順方向・逆方向照合は`function_migration_policy.md`が既に正本として所有する。今回のbatch同期詳細をREADME／docsへ追加すると詳細contractまたは既存policyの重複になるため、Gate Gにより追加候補なしと判定した。

**ネクストアクション:** 論点31は完了。production templateの反映待ちは解消した。論点10、15、tasklist作成、releaseには進まない。全体再評価で、論点10、15を統合design最終合意後へ置く依存順序と、分類保留zeroをdesign phase完了条件とする論点30の間に循環が見つかったため、次の独立decisionで依存順序を修正する。
