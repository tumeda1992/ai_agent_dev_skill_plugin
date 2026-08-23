---
name: steering
description: "task-designのready resultを受け、plan resultをdispatchし、planless resultを安全gate後に完了する。roadmap treeの子steering bindingとruntime orchestrationはsteeringが所有する。明示指定時、および軽度でない複数file・複数stepの変更時に起動する"
allowed-tools: Read, Grep, Write, Edit, Bash, Agent
model: sonnet
effort: high
---

# Steering Skill

## 入力

- ユーザー入力: **達成したいこと**
- 子roadmap phaseの場合: `parent_roadmap_path`、`parent_phase_id`、`parent_design_path`、`dependency_results`
- standalone roadmapを昇格する場合: `adopt_task_design_working_dir=<absolute path>`
- 任意: `branch_from_basename`。defaultは`false`。`true`のとき、basenameを決めた直後に同名のbranchを作成して切り替える。

## 役割とゴール

steeringはtask-designのcaller兼plan orchestratorである。repository contextとcanonical working directoryを準備し、task-designが返す`tasklist_ready | roadmap_ready | planless_complete`を検証する。

- `tasklist_ready`: leafとして、plan合意後の必須gateとユーザーの実装開始確認を経てtasklist-executorへ渡す。
- `roadmap_ready`: compositeとして、同じ必須gateと開始確認を経てphaseを子steeringへbindingし、依存順に再帰実行する。
- `planless_complete`: execution planを作らずtask-design内で対象成果物の反映・validationまで完了したresultとして、同じ終了前gateを経た後にdispatchせず完了する。
- roadmapの構造fieldはtask-design、子steering path・status・完了日はsteeringが所有する。

steeringはdesign、tasklist、roadmapの内容を設計または重複reviewしない。task-designのready resultを受けても自動的に実装へ進まない。三result共通の終了前gateを完了し、plan resultではさらにユーザーの開始確認を得るまで、tasklist-executorも子steeringも起動しない。planless resultは実行開始確認またはdispatchへ送らない。

## task-design初回起動前の境界

通常flowでは、steering directoryを準備したら、ユーザー入力を未整理のままtask-designへ渡して直ちに起動する。曖昧さや未決事項はtask-designが設計中に解消する入力であり、steeringが先回りして解消してはならない。

初回task-design起動前にsteeringが行ってよいのは次だけである。

- ユーザー入力を「達成したいこと」として意味を足さずに保持する。
- canonical directoryの命名・作成、前月summary生成、task-design起動に必要なrepository contextの解決を行う。
- task-designを起動できない機械的な入力不足だけをユーザーへ確認する。

この区間では、application codeや設計文書を読んで実装方針を作る、WHY・WHAT・HOWを整理する、scopeを分解する、選択肢や推奨方向を提示する、leaf・composite・planlessを予想する、設計上の曖昧さを`discussion.md`で議論することを禁止する。常時適用される`think-through`も、task-designを安全に起動できるかの確認にだけ使い、steeringへ設計責務を追加する根拠にしない。

たとえば「認証方式を変更したい」という入力が曖昧でも、steeringが既存codeを調べて方式候補を出してはならない。その入力をtask-designへ渡し、調査、方向性、完成後の姿、execution plan種別の判断をtask-designに委ねる。一方、既存directoryを再開するのにexact pathが欠けていて起動先を確定できない場合は、機械的な不足として確認してよい。

## repository固有文脈

プロジェクト指示、canonical directory準備、roadmap orchestrationに必要なrepository固有factは、`maintenance-plugin-context`へconsumer=`steering`、必要理由、必要fact、確認元候補を渡して解決する。返された範囲だけを読む。task-designが設計に使うarchitecture・開発規約・test方針を初回起動前にsteering自身の判断材料として読まず、task-designへ解決を委ねる。固定の`CLAUDE.md`、`docs/`、backend/frontend path、command、remoteを推測して読まない。

## 記述規則

- ユーザーとの会話と成果物本文は日本語で記述する。code、command、path、identifier、規定された出力形式、固有名詞は原文を維持する。
- **全成果物（`design.md`、`tasklist.md | roadmap.md`、`discussion.md`、`implementation_review.md`等）でdomain固有名詞を略称で書かない。** class名、model名、operation名は完全な名前で書く。内部だけで通じる頭字語は、未来の読み手に意味の再調査を強制しreading costを上げる。
  - 悪い例: 「UPの権限を確認する」「PMを作成する」
  - 良い例: 「`UserProfile`の権限を確認する」「`PaymentMethod`を作成する」

## 命名規則とcanonical directory

新規steeringでは、ユーザー入力と実行時のlocal dateを`name-work-directory`へ渡し、`YYYYMMDD-slug`のbasenameを一つ受け取る。steeringが英語要約、slug、日付を独自に決めず、同じ作業中はbasenameを変更せず使い続ける。

basenameの日付部分から`YYYY`と`YYYYMM`を得て、次のpathを管理する。

```text
.steering/YYYY/YYYYMM/YYYYMMDD-slug/
```

このpathがsteering directoryであり、task-design working directoryでもある。steeringは親directoryの作成と前月summary生成を担当する。branch名の取得・埋込み・衝突確認をbasenameへ持ち込まない。basenameからbranch名を導く逆方向は`branch_from_basename`が扱う。

rootへ次を置く。

- `design.md`
- `task-design-discussion.md`
- execution plan対象がある場合だけ排他的な`tasklist.md | roadmap.md`
- 任意の`discussion.md`
- 任意の`implementation_review.md`
- 必要時だけ`investigation.md`、`requirements.md`、`spike/`

task-design専用子directory、`task_design_dir`探索、`steering.json`を新規flowで作らない。

## 成果物のlifecycle

- `design.md`: 合意済み設計の正本。
- `requirements.md`: Requirementsが長く、独立fileにするとreview可能性が上がる時だけdesignから切り出す。
- `task-design-discussion.md`: task-designの設計収束過程の正本。
- `tasklist.md | roadmap.md`: execution plan対象がある場合だけtask-designが合意済みdesignから作る排他的execution plan。
- `discussion.md`: steering固有の随時議論、orchestration上の推論、他成果物へ収まらない背景。
- `implementation_review.md`: 実装、review、validation、ユーザー動作確認後に判明したfeedback・ずれの正本。

同じfeatureの追加taskは、designとplanを再合意した後に既存tasklistへ追記する。tasklistは「このfeatureを完成させるためのchecklist」であり、納品物はtasklistではなくfeatureなので、追加要件が判明しても同じfeatureの完成まで生き続ける。

### commitへ載せる順序

steering成果物を「記録」として一括りにせず、確定した時点で実装変更の前後へ分ける。分割軸は何がいつ確定したかであり、`.steering/`配下という置き場所ではない。

1. `design.md`、`requirements.md`、`task-design-discussion.md`、`discussion.md` — 変更を行う前に確定する。対応する変更commitより前へ置く。
2. tasklistが指示した成果物変更 — 実装commit。
3. `tasklist.md`のcheckbox確定と`implementation_review.md` — 変更が終わってから確定する。対応する変更commitより後へ置く。

一つのsteeringが複数の変更commitを生む場合、各変更commitと、その根拠になった合意の記録を近接させる。間に無関係なcommitを挟まない。

一つのdiscussion fileが複数の変更commitへ対応する場合、hunk単位の分割を強制しない。最も早い対応commitへまとめ、後続commitの本文でどの論点に基づくかを示す。

変更が一commitで完結し、三段へ分けても読み手が辿れる情報が増えない場合は、まとめてよい。判断基準は、後から読む人が「どの変更がどの合意に基づくか」をcommit単位で辿れるかである。

- やってしまいがちな行動: steering成果物を`.steering/`配下という置き場所で括り、最後の一commitへまとめる
- それをやると何が起きるか: 合意が変更より後に記録された履歴になる。どの変更がどの合意に基づくかを、後から読む人がfile全体を突き合わせないと辿れない
- 正しい判断のための問い: 「このsteering成果物は、対応する変更より前に確定したか、後に確定したか？」

### 非規範的なlegacy memo

過去には「複数のfeedbackが揃ったら新しいsteeringを起動する」という方針があった。現在の起動条件、推奨動作、fallbackではない。将来必要になった場合だけ、ユーザーとの明示合意により復活を検討する。

## discussion.mdの使い方（随時）

`discussion.md`は特定phaseへ縛らず、task-design起動後に記録価値のあるsteering固有の思考が生じた時に随時追記する。ユーザーがorchestration上の論点・質問・要議論を提起した場合、またはsteering agent自身のorchestration上の判断についてユーザーへ問いを出そうとしている場合に通常discussionを開始する。往復回数の予測、assistantが既に結論を持っているか、論点が選択肢へ畳めるかは、開始しない理由にならない。通常flowの初回task-design起動前には開始しない。設計上の曖昧さや方向性はtask-designへ渡し、task-design固有の議論として扱う。

steeringはsteering directory、起動判断、関連成果物のcontext、決定後のphase制御、終了条件を所有する。議論開始後はsteering agent自身が次を渡してpluginの`facilitate-discussion` skillを明示適用し、議論だけを別child agentへ再委譲しない。

```text
discussion_directory=<steering directory>
```

discussion fileの解決、entry形式、合意対象保存、採番、親子validation、feedback routing、履歴と現在状態の更新は`facilitate-discussion`が所有する。steering内へtemplate全文、採番、feedback iteration、原因追跡、種別等の内部processを複製しない。決定後はsteeringがdesign、plan、調査、文書改善review等の適切なphaseへ戻す。

主な用途:

- orchestration中に生じた疑問・背景: designやplanへ入らないが捨てない思考
- ready result後の進行判断: runtime state、dispatch、再開位置について複数往復で検討した過程
- design、investigation、plan、implementation reviewのいずれにも属さないこぼれ話

`investigation.md`は、事実を集めなければ設計方針が決まらない時のfact収集logである。`discussion.md`は、どう考えたかという推論・議論のlogであり、目的、確認方法、実測結果を持つ調査の正本にしない。

## Flow（順序固定）

### Step 1. steering directoryと前月summaryを準備する

1. `name-work-directory`で`YYYYMMDD-slug`を決める。
2. `branch_from_basename=true`の場合だけ、現在のHEADから`YYYYMMDD-slug`という名前のbranchを作成して切り替える。基点となるbranchが意図どおりかはcallerが保証する。同名branchが既に存在する場合、または切替に失敗した場合は、作成も強制切替もせず作業を停止してユーザーへ報告する。stashを行わない。
3. `.steering/YYYY/YYYYMM/`がなければ作成する。
4. `.steering/YYYY/YYYYMM/YYYYMMDD-slug/`を作成する。
5. 実行月の一か月前（年を跨ぐ場合は前年12月）のdirectoryが存在し、その月の`summary.md`が未存在の場合だけ、前月summaryを生成する。
   - 既存`summary.md`があれば何もしない。追記、再生成、status更新をしない。
   - 前月配下の各steering directoryを列挙する。
   - 概要はrootの`design.md`から抽出する。rootにない旧形式だけ、直下の子directoryから一意な`design.md`を探す。候補が複数なら推測しない。
   - `## 1. TL;DR`本文の最初の段落を優先し、なければ`## 目的`の最初の段落、それもなければ`{slug}（概要抽出不可、design.md 参照）`とする。
   - tasklist status: checkboxがすべて`[x]`なら`完了`、`[ ]`が残れば`未完了`、判定不能なら`不明`とする。
   - roadmap status: 全phaseの運用statusが`完了`なら`完了`、一つでも`未着手 | 進行中`なら`未完了`、fieldを判定できなければ`不明`とする。
   - planless status: tasklistとroadmapがどちらもなく、rootの`design.md`付録に`分類保留`sectionがなく、`task-design内の対象成果物反映待ち`と`execution plan対象`がともに`なし`なら`完了`とする。いずれかを判定できなければ`不明`とする。

summaryは次のexact formatを使う。

```markdown
# {YYYY}年{MM}月 Steering サマリー

## [{slug}](./{slug}/)

**概要:** {概要}

**ステータス:** {完了 / 未完了 / 不明}

---
```

entryはslug link、概要、statusだけを持ち、種別、関連、詳細fieldを追加しない。詳細は各steeringの`design.md`、`discussion.md`、排他的planへ委ねる。各steering実行時にもstatusを手動更新しない。`summary.md`のsingle writerを翌月初のこの処理だけにするのは、複数人の並行作業で同じsummaryへ書き込み、conflictすることを避けるためである。

> この時点では`design.md`、`tasklist.md`、`roadmap.md`を作らない。

### Step 2. task-designを起動または再開する

通常flowではStep 1完了後、設計や方向性を整理する別stepを挟まず、直ちにtask-designを起動する。

新規・再開とも、pluginの`task-design` skillへユーザーの要件と次を渡す。

```text
working_dir_parent=<steering ディレクトリの絶対パス>
create_working_dir=false
```

task-designは新しい子directoryを作らず、steering rootへ`design.md`、必要時の`task-design-discussion.md`、execution plan対象がある場合だけ排他的な`tasklist.md | roadmap.md`を置く。既存設計を再開する場合も同じ入力を使い、別directoryを増やさない。

子steeringの場合は次の四項目を一組として渡す。

```text
parent_roadmap_path=<親roadmap.mdの絶対path>
parent_phase_id=<stable phase identity>
parent_design_path=<親design.mdの絶対path>
dependency_results=<依存phaseの確定結果>
```

`task-design-discussion.md`はtask-design固有の設計議論、`discussion.md`はsteering固有の議論であり、同じ正本として混同しない。

### Step 3. ready resultを検証する

task-designのresultと対応fileのidentityだけを検証する。内容設計または重複reviewはしない。

- `tasklist_ready`: `working_dir`、`design_path`、`tasklist_path`がsteering rootを指し、`roadmap.md`が存在しない。
- `roadmap_ready`: `working_dir`、`design_path`、`roadmap_path`がsteering rootを指し、`tasklist.md`が存在しない。
- `planless_complete`: `working_dir`と`design_path`がsteering rootを指し、`tasklist.md`と`roadmap.md`がどちらも存在しない。`design.md`付録に`分類保留`sectionがなく、`task-design内の対象成果物反映待ち`と`execution plan対象`が`なし`である。適用済み行があればvalidation結果と参照するdesign sectionがある。
- plan resultでは、planがtask-designで自然言語合意済みであり、TBD、未解消feedback、実装者へ残した設計判断がない。

resultとfileが矛盾する、両planが併存する、planからdesignへ戻るfeedbackが未解消、またはplanlessのzero stateを満たさない場合は、同じworking directoryでtask-designを再開する。

task-designからready resultが返った直後に実装、子steering起動、またはplanless完了へ進まない。次のStep 4を必ず先に完了する。

## Ready result後の必須gate

`tasklist_ready | roadmap_ready | planless_complete`のどのresultでも、返却直後に必ず実行する。plan resultでは実装開始確認より先、planless resultでは完了報告より先に置く。「早く次へ進みたい」ことを理由に省略しない。

#### 4-1. doc-enricherを提案modeで起動する

次を渡してpluginの`doc-enricher` skillを提案modeで実行する。

- 対象directory: 今回readingまたは変更対象になった範囲
- 関連file: 調査で読んだ、または参照したfile
- steering path: `.steering/.../YYYYMMDD-slug/`

`doc-enricher`を提案modeで適用し、再利用価値の高い知識が既存READMEまたは既存docsに不足するかを確認する。提案があれば内容と適用先をユーザーへ示す。明示承認された提案だけを適用し、拒否または保留なら変更しない。

同じoriginating decisionについてtask-design中にreview済みなら重複提案しない。このStepはtheme全体を横断する最終safety netとして、新たな候補だけを扱う。

#### 4-2. discussionを元に再発防止先をreviewする

`discussion.md`と`task-design-discussion.md`に記録された各discussionについて、次の三問による再発防止reviewを順番に扱う。解決策より先に原因を特定する。

1. この議論が起きた根本原因、すなわち共有されていなかった知識の前提は何か。
   - 失敗例: 議論の結論であるruleを根本原因として扱い、対症療法にする。
   - 正しい問い: 議論が始まる前に、どちらかが知らなかった、または共有されていなかった設計前提は何か。
2. その知識はcodeを読めば分かるか、読んでも分からない設計意図か、設計processの不足か。
   - codeを読めば分かる: 既存README等へessenceを提案し、次回のcode readingを省く。
   - codeを読んでも分からない: repositoryの上位architecture document等へ原則を提案する。
   - 設計processの不足: 対応するskillへ、設計時に問うべき問いを提案する。
3. どこに書けば次回この議論が不要になるか。変更はユーザー合意後だけ行う。

ここで特定した更新提案と承認判断はこのStepで完了させ、実装taskへ先送りしない。設計議論のcontextが最も熱い時点を逃すと「なぜ変えるか」が薄れ、更新品質が下がるためである。「tasklistへdocument更新taskを入れようとしているが、これは今すぐ扱うべきものではないか」と自問する。

#### 4-3. steering skill自身を確認する

今回の議論から、このsteering skillの変更が必要かを確認する。不要なら変更してはならない。必要な場合も、提案と変更を分け、ユーザー合意後だけ適用する。

### ファインプレー即時記録の原則

実行中にskill改善のinsightが生まれた場合は、Step 4を待たずcontextが熱いうちに提案してよい。

- Step 4は全体整合性の最終確認であり、timelyな提案の代替ではない。
- 「提案する」と「変更する」は別である。提案は即時、変更は合意後に行う。
- 型は利益があるため存在する。型の精神を理解し、型を活かしてより良くする場合だけ即時提案する。
- 命令無視または単なる改悪を「型を崩す」と正当化しない。

### Step 5. resultごとの次の動作を行う

#### 5-1. `planless_complete`を完了する

`planless_complete`では実行するplanがない。実行開始確認、tasklist-executor、子steering dispatchへ進まず、`design_path`、task-design内で適用した変更とvalidationの要約、planを作らなかった理由、Step 4のreview結果を示してsteeringを完了する。

#### 5-2. planの実行開始をユーザーへ確認する

`tasklist_ready | roadmap_ready`では、ready result、主要成果物、Step 4のreview結果を示した後でのみ、tasklist実装またはroadmap tree実行を開始するかユーザーの明示確認を自然言語で得る。

- `OK`、`はい`、`進めて`等の明示確認があればStep 6へ進む。
- 拒否、保留、確認なしならここで終了する。
- plan合意を実行開始の承認と読み替えず、`roadmap_ready`を受けたこと自体を子実行の承認とみなさない。
- Step 3直後に「実装へ進みますか」と聞き、Step 4を飛ばすことを禁止する。

### Step 6. ready resultをdispatchする

#### 6-1. leafを実行する

tasklist-executorへ`tasklist.md`と同階層の`design.md`の絶対pathを渡す。

- tasklist-executorだけをtasklistのsingle writerとする。
- task、subtask、phaseを実測完了した直後に`[x]`へ更新させ、最後にまとめて更新させない。
- tasklist-executorは親roadmapを探索・更新せず、完了resultだけをcallerへ返す。
- tasklist内のユーザー動作確認が完了する前にcommit、push、PRへ進ませない。

#### 6-2. roadmap runtime orchestrationを行う

roadmapの依存DAGを読み、未着手かつ依存完了済みのphaseを選ぶ。

1. phaseの運用fieldへcanonicalな子steering pathをbindingする。
2. statusを`進行中`へ更新する。
3. 子steeringへ親roadmap path、phase identity、親design path、dependency resultsを渡す。
4. 子steeringも自身のrootを`create_working_dir=false`で子task-designへ渡す。子task-designは`tasklist_ready`、nestedな`roadmap_ready`、または`planless_complete`を返せる。
5. leafはtasklist-executorの完了result、compositeは全子phaseの完了、planlessは子steeringの共通gateと完了報告を確認する。
6. 対応phaseのstatusと完了日だけを更新し、次の依存可能phaseへ進む。
7. 全phase完了は、全phaseのstatusが`完了`で、各phaseに完了日があることを確認して判定し、composite完了を一段上の親roadmapへ伝播する。

steeringが更新できるroadmap fieldは、子steering path、status、完了日だけである。目的、scope、scope外、DoD、依存、phase identityを変える必要がある場合は直接編集せず、同じdirectoryでtask-designを`create_working_dir=false`として再開する。

## Standalone roadmapの昇格

`adopt_task_design_working_dir=<absolute path>`は、standalone task-designが作った合意済みroadmap bundleをcanonical steering nodeへ昇格する任意flowである。

### 対象gate

- sourceは現在のrepository内にある。
- source basenameは`YYYYMMDD-slug`である。
- rootに合意済み`design.md`、`task-design-discussion.md`、`roadmap.md`がある。
- `tasklist.md`が併存しない。
- designとroadmapに未解消TBD、未合意状態、designへ戻るfeedbackがない。

source basenameの日付からdestinationを`.steering/YYYY/YYYYMM/<basename>/`へ一意に解決し、suffixを追加しない。

### 移動前の安全gate

移動前に次をread-onlyで確認する。

- exact sourceとexact destination
- 必須fileと排他的plan
- bundle内部の相対参照が移動後もbundle内で閉じること
- sourceのGit状態
- destinationが存在しないこと

検証結果、source、destination、変わるpathをユーザーへ提示し、移動への明示承認を得る。承認前は変更しない。merge、overwrite、suffix追加、自動copy/delete、repository外sourceのcopyまたはdeleteを禁止する。

### 移動と再開

承認後にbundle directory全体を一度だけdestinationへ移動し、destinationだけを正本にする。`steering.json`や旧sourceへのpointerは作らない。新しい`working_dir`、`design_path`、`roadmap_path`を返し、通常flowのStep 3からroadmap child bindingへ合流する。

## 実装完了後review

実装、review、validation、ユーザー動作確認でfeedback・漏れ・追加要件・不具合を直接受け取ったworkflow ownerが、同じworking directoryでpluginの`facilitate-discussion`を適用する。steeringが直接受け取った場合はsteering自身が行い、議論だけを別childへ再委譲しない。

```text
discussion_directory=<steering directory>
discussion_file_name=implementation_review.md
```

feedback原文、関連する実装、`design.md`、排他的plan、原因、採用方針、決定を渡す。既に修正済みのfeedbackでも記録を省略しない。`implementation_review.md`はfeedback議論の正本だけを担い、designまたはplanの正本を複製しない。

各feedbackについて、Step 4と同じ三問を順に扱う。

1. 根本原因となる未共有知識は何か。
2. codeから分かるか、設計意図か、process不足か。
3. どこへ保存すれば次回の議論を不要にできるか。変更は合意後だけ行う。

decision後、直接受領したworkflow ownerはcallerへdecisionを返し、次の戻り先を一意に選ぶ。

- 完成後の姿、要件、設計根拠、公開API、module境界が変わる: 同じworking directoryでtask-designのdesign phaseへ戻す。
- task順、task粒度、検証手順が変わる: task-designのtasklist plan phaseへ戻す。
- roadmapのphase identity、目的、scope、scope外、DoD、依存、親DoD coverageが変わる: task-designのroadmap plan構造へ戻し、親designへの影響を判定する。親designが変わる場合だけdesign phaseへ戻す。
- roadmapの子path、status、完了日だけが変わる: steering runtimeで更新する。
- repository知識の永続化だけが必要: doc-enricher等のwriter contractに従い、承認後だけ既存READMEまたは既存docsへ反映する。
- 認識合わせだけで完了する: designとplanを変更しない。

設計判断が必要な変更では、design合意前にtaskを作らない。reviewのdecisionやtask追加後も実装を自動再開しない。同じfeatureの追加taskは合意済みdesign・planへ戻した後、既存tasklistへ追加する。

計画からの意味ある逸脱も`implementation_review.md`で扱う。roadmapの`全フェーズ完了日`または`計画と実績の差分`fieldは作らない。全体完了は各phaseのstatusと完了日から導出する。

## このskillが絶対にやらないこと

- 許可なくtasklistを実行する。
- steering自身が実装codeを変更する。実装は明示承認後にtasklist-executorまたは子steeringへdispatchする。
- steering自身がtestまたはCIを実行する。検証は合意済みtasklistとruntime contractに従うexecutorへ委ねる。
- 初回task-design起動前に実装設計、方向性、scope分解、plan種別を判断または提案する。
- 初回task-design起動前に設計上の曖昧さを`discussion.md`で解消する。
- task-designの代わりにdesign、tasklist、roadmapの構造を設計または重複reviewする。
- task-design専用子directory、`task_design_dir`探索、`steering.json`を新規flowで作る。
- roadmapの構造fieldをruntime都合で直接変更する。
- tasklist-executorへ親roadmapを探索・更新させる。
- standalone bundleを明示承認前に移動する。
- tasklist合意前に実装し、ユーザー動作確認前にcommit、push、PRを行う。push・PR前にはlocal commitが実際に一件以上存在することを確認する。
- 必須gateまたはユーザー確認を飛ばし、自動で次工程へ突入する。
- `planless_complete`を未完了resultとしてtasklist作成へ戻す、または実行開始確認・executor・子steeringへdispatchする。
- `planless_complete`を理由にReady result後の必須gateを省略する。

## 合意済みの明示廃止

- task-design専用子directoryと`task_design_dir`探索は廃止した。steering directory自体を`create_working_dir=false`で直接使う。
- tasklistから親`roadmap.md`を更新する契約は廃止した。tasklist-executorは完了resultだけを返し、steeringだけがroadmapの運用fieldを更新する。
- steeringがtasklist・roadmapを設計または再reviewする契約は廃止した。task-designの排他的plan設計・reviewを正本とする。
- feedback件数による新steeringの自動起動規則は廃止した。別steeringの要否はtask-designのleaf / composite判定またはユーザーの明示判断で決める。
- roadmapの`全フェーズ完了日`と`計画と実績の差分`fieldは廃止した。全体完了はphase status・完了日から導出し、意味ある逸脱は`implementation_review.md`へ記録する。

上記以外の旧steeringの意味単位は、migration ledgerに従って新ownerへ移管または適応する。簡略化だけを理由に未分類のcontractを削除しない。
