# 議論記録

## 論点1: designとtasklistのlifecycle所有者

**ステータス:** 決定（論点4・提案3で拡張）

**種別:** レビュー指摘、認識齟齬

**起点となった原文:**
> tasklistがsteeringに属しているけど、task-designの方が適しているためそちらに移す。tasklist設計時に指摘の結果task-designに翻ることがある。ということはsteeringよりもtask-designと1セットなのではないかという意図

**提起の背景:** 現行workflowではtask-designがdesign完了で終了し、steeringがtasklistを作成・レビューする。tasklist作成中に実装単位、依存、DoDを具体化して設計不足が見つかると、steeringからtask-designへ戻り、再びsteeringへ戻る必要がある。`design.md`と`tasklist.md`の配置も分かれており、一つの設計収束loopが二つのskillへ分断されている。

### 現在の合意対象

**参照する現在案:** 論点4・イテレーション3の提案3

**今回確認すること:** task-designを単一designのownerではなく、そのdesignに対応する実行計画の設計ownerまで広げ、排他的に`tasklist_ready | roadmap_ready`を返す提案3を採用するか。roadmapの構造はtask-design、子steeringとのbindingと実行statusはsteeringが所有し、親子task-designをroadmap phaseで対応付ける。

### 議論の変遷

#### 事象の記述

- task-designは`design.md`を確定すると終了し、`tasklist.md`を作らない。
- steeringはtask-design完了後に`tasklist.md`を別ディレクトリへ作り、自己レビューとユーザーレビューを行う。
- tasklistでフェーズ、依存、DoDを具体化すると、designに根拠や完成後の姿が不足していることが判明し、task-designへ戻る場合がある。
- 現在のsteeringはこの差し戻しを制御するが、設計の収束状態がtask-designとsteeringに分散する。

#### 原因の追跡

- なぜ: tasklistを「設計完了後に実装手順へ変換するだけの成果物」と見なし、designとは別phaseへ置いている。
- なぜ: tasklistの具体化がdesignの実装可能性を検算し、新しい設計判断を発見する役割を過小評価している。
- なぜ: lifecycleを成果物の作成順で分割し、同じ不確実性を閉じるloop単位で所有者を決めていない。

#### 根本原因0 + 提案0

- **根本原因0**: `design.md`と`tasklist.md`は別々の直線的な成果物ではなく、「完成後の世界を決める → 実装単位へ具体化する → 具体化で見つかった設計不足へ戻る」という一つの設計収束loopを構成する。しかし現行workflowはdesignとtasklistの境界で所有者を分けているため、loopのstateと責任が二つのskillへ分断されている。
- **提案0（現時点）**:
  - 総論: tasklistの配置と設計lifecycleをtask-designへ移し、task-designを「designとtasklistが双方合意され、実装中の新判断が残らない状態」を作るskillにする。steeringはrepository contextの準備、task-design起動、複数MVPのorchestration、tasklist合意後の振り返り、実装開始、実装後reviewを所有する。
  - 各論:
    - ルール: task-designの`working_dir`配下へ`design.md`、`tasklist.md`、`task-design-discussion.md`、必要時の`requirements.md`、`investigation.md`、`spike/`を同居させる。
    - ルール: task-designはdesignの初稿・議論・最終レビューに続いてtasklistを作成し、自己レビューとユーザーレビューを行う。tasklistへの指摘が完成後の姿、設計根拠、公開API、モジュール境界、要件を変える場合は、同じtask-designがdesign loopへ戻る。designを再合意してからtasklistを更新し、tasklistレビューを再開する。
    - ルール: tasklistへの指摘が実装順序、task粒度、検証手順の具体化だけを変え、合意済みdesignを変えない場合はtasklistだけを更新する。design変更要否の判定とdiscussion起動はtask-designが所有する。
    - ルール: task-designの完了条件を「design合意」から「design合意、tasklist合意、tasklistからdesignへ戻る未解消feedbackなし」へ変更する。単独起動でも同じ成果物と終了条件を使う。
    - ルール: `steering/templates/tasklist.md`を`task-design/templates/tasklist.md`へ移し、tasklist設計規則と自己レビュー規則もsteeringからtask-designへ移す。steeringに同じ規則を残して二重の正本を作らない。
    - ルール: 複数MVPへの分割と親子steeringの`roadmap.md`はsteeringに残す。task-designが一つのtasklistでは成立しないと判定した場合はtasklistを確定せず`split_required`相当の結果をsteeringへ返し、steeringがroadmapと子steeringを管理する。
    - ルール: 調査結果でdesignが変わる`investigation.md`はtask-design配下へ移す。事実収集はtask-designの不確実性解消手段として扱い、確定した事実をdesignへ反映してからtasklistを作る。
    - ルール: tasklist合意後のdoc-enricherとdiscussion振り返り、実装開始判断、実装後の`implementation_review.md`はsteeringに残す。実装後reviewからdesignまたはtasklistを変更する場合は、既存`task_design_dir`を再利用してtask-designへ戻す。
    - ルール: steeringの前月summary生成はsteering直下と一意な子ディレクトリの両方から`design.md`と`tasklist.md`を解決し、同じtask-designディレクトリの組を使う。tasklist-executorへは同居する二つの絶対pathを渡す。
    - ルール: 今回の未配布変更はHEADの`4.0.0`に対する一連の破壊的変更として扱い、配布versionは既に更新済みの`5.0.0`を維持する。追加で`6.0.0`へ上げない。
    - 適用例: tasklistレビューで「通知送信と監査ログ更新を一phaseにまとめると二つの操作になりDoDが曖昧」と指摘された場合、操作フローや責務境界も変わるならtask-designがdesignへ戻る。単に同じ設計を二phaseへ分割するだけならtasklistのみ更新する。
    - 適用例: task-design単独起動でも`<working_dir>/design.md`と`<working_dir>/tasklist.md`を作り、双方の合意まで終了しない。steering経由では同じ二fileがsteering配下の`task_design_dir`に置かれる。

##### 検証

- **観点**: tasklistからdesignへの差し戻しが同じowner内で閉じるか、steeringに残す責務がtask-designの設計loopへ再侵入しないか、既存のroadmapと実装後reviewを失わないかを確認した。
- **弱点**: task-designの本文が既に長く、steeringからtasklist規則をそのまま移すとさらに肥大化する。tasklist作成・reviewの詳細はtask-design直下のreferenceへ分離し、SKILL.mdにはphase遷移と完了gateだけを置く必要がある。また、summaryが子ディレクトリを探索する規則は複数task-design directoryがある旧・再設計ケースで曖昧になり得るため、steeringがtask-design pathを永続的に特定する仕組みを後続設計で確定する必要がある。

**決定:** 提案0を採用し、論点4の提案3でscopeを拡張する。task-designはtasklistだけでなく、排他的な`tasklist | roadmap`の構造設計・自己レビュー・ユーザーレビュー・designへの差し戻しを含む設計収束lifecycleを所有する。steeringはroadmapの子binding・status・再帰実行、plan合意後の振り返り、実装開始、実装後reviewを所有する。

**ネクストアクション:** `design.md`のD1へ反映済み。下位論点でtask-design pathの永続的な特定方法と、tasklist詳細規則のreference分離を設計する。

## 論点2: task_design_dirをsession外で一意に復元する方法

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**提起の背景:** steeringはtask-designが`name-work-directory`で作った動的な子ディレクトリを`task_design_dir`として保持する。tasklistもその配下へ移すと、別sessionでの再開、翌月summary、実装後reviewが同じdesignとtasklistを一意に解決できなければならない。session memoryや「一つだけ見つかった子」を恒久的な正本にすると、再設計や旧形式の成果物が混在した時に誤ったdirectoryを選ぶ。

### 現在の合意対象

**参照する現在案:** イテレーション2の提案2

**今回確認すること:** steering経由ではsteering directoryそのものをtask-designの`working_dir`として直接使い、standalone時だけtask-designが新しいdirectoryを作る提案2を採用するか。採用するとtask-design成果物の配置、`create_working_dir`の使い分け、summary、再開、tasklist-executorへの引き継ぎが固定pathで解決し、`steering.json`は不要になる。

### 議論の変遷

#### 事象の記述

- task-designはsteering配下に`YYYYMMDD-slug`の子ディレクトリを作り、その絶対pathを呼び出し元へ返す。
- 現在のsteeringは返されたpathをsession内の`task_design_dir`として保持するが、fileへ永続化しない。
- 新しい配置ではdesignとtasklistの両方が子ディレクトリへ入るため、steering rootだけを受け取った後続処理は対象pathを推測しなければならない。
- 子ディレクトリ探索は通常一件なら動くが、旧形式、途中成果物、誤作成、再設計が混在すると複数候補になり得る。

#### 原因の追跡

- なぜ: `task_design_dir`をworkflow中の一時変数としてだけ扱っている。
- なぜ: これまではtasklistがsteering rootにあり、実装状態の正本だけは固定pathで解決できた。
- なぜ: task-design成果物を子ディレクトリへ分離した際、steeringとtask-designを結ぶ永続的な関連付けを設計していない。

#### 根本原因0 + 提案0

- **根本原因0**: steeringとtask-designの親子関係に動的pathを導入した一方で、その関係をsession外へ保存する正本がない。探索結果を正本にすると、候補数という偶然のfilesystem状態へworkflowの正しさが依存する。
- **提案0（現時点）**:
  - 総論: steering rootの`steering.json`をtask-design directoryへの唯一の永続pointerとし、session再開・summary・実装開始・実装後reviewは同じ解決規則を使う。
  - 各論:
    - ルール: 初回task-designが`working_dir`を返した直後、steeringは次の形式で`<steering-dir>/steering.json`を作る。

      ```json
      {
        "task_design_directory": "20260802-design-tasklist-ownership-transfer"
      }
      ```

    - ルール: `task_design_directory`にはsteering直下にあるtask-design directoryのbasenameだけを保存する。絶対path、`..`、path separatorを許可せず、steering directory外を参照できないようにする。
    - ルール: 同じsteeringではbasenameを変更しない。designまたはtasklistへ戻る時は`steering.json`からpathを復元し、task-designを`create_working_dir=false`で再開する。
    - ルール: summary生成、tasklist-executor起動、実装後reviewも`steering.json`を先に読み、`<steering-dir>/<task_design_directory>/design.md`と`tasklist.md`を同じ組として使う。status等の派生stateをmanifestへ複製しない。
    - ルール: `steering.json`が存在するのに不正、参照先なし、必要fileなしの場合は探索へfallbackせず停止する。正本の破損を別候補で隠さない。
    - ルール: `steering.json`がない旧steeringだけ、(1) steering rootの`design.md`と`tasklist.md`、(2) design.mdを持つ一意な直下子ディレクトリ、の順でfallbackする。候補が複数なら推測せず対象pathを求める。旧steeringを読むだけでmanifestを自動生成しない。
    - 適用例: 新しいsteeringを別sessionで再開した場合、rootの`steering.json`からtask-design directoryを復元し、同居するdesignとtasklistを読む。
    - 適用例: 旧steeringがrootにdesignとtasklistを持つ場合はfallbackで従来pathを読む。子にdesignが二つあるのにmanifestがない場合は一方を選ばない。

##### 検証

- **観点**: session memoryなしで一意に解決できるか、path traversalを防げるか、旧steeringを壊さないか、statusの二重正本を作らないかを確認した。
- **弱点**: task-design directory名を手動変更するとmanifestが壊れる。ただしdirectory名は同じ作業中に変更しない既存契約があり、壊れたmanifestで停止する方が誤ったdesign/tasklistを選ぶより安全である。`steering.json`という新しいroot成果物が一つ増えるが、探索規則を複数consumerへ複製するより小さい。

#### イテレーション1

**受領したfeedback:**
> どこに置いて誰が誰に対して残す記録なの？ tasklistが独立しているとき、steeringとしかコミュニケーションしないとは限らないから

##### 検証

- **観点**: 提案0の`steering.json`がtask-designの一般契約なのかsteering固有stateなのか判別できず、standaloneや別orchestratorから使う時の受渡しが説明されていなかった。
- **弱点**: callerごとの永続化方法を完全に自由にすると、再開契約がhostごとにばらつく。ただしtask-designが特定callerの親directoryへ記録を強制するより、返却するpath契約を共通化し、永続化はcaller adapterへ限定する方が責務境界は明確になる。

##### 論点routingの判断

- **discussion scopeへ属する理由**: task-design directoryをsession外で一意に復元する方法を変え、standalone、steering、tasklist-executorの実装範囲へ直接影響する。
- **同一decision scopeとしてiterationを継続する理由**: 新しい成果物の所有者と受取人を問い直すfeedbackであり、論点2のpath永続化decisionそのものの原因と提案を変更する。

##### 修正先の判断

- **診断levelへの遡及**: 提案0は「pathの永続pointerがない」ことだけを根本原因としたが、その前に「task-designの成果物identity」と「caller固有のorchestration state」を分離できていなかった。

##### 根本原因1 + 提案1

- **根本原因1**: task-designが返す共通成果物と、steeringが子workflowを再開するために保持するcaller固有stateを同じ記録で解決しようとしたため、記録の配置者・受取人・適用範囲が曖昧になった。task-designはstandalone、steering、その他のorchestratorから利用されるため、steeringを唯一の通信相手としてはならない。
- **変更点**: `steering.json`をtask-designの共通pointerとする考えを廃止する。task-designは自己完結したbundleと明示的な返却pathだけを共通契約とし、pathを永続化するか、どこへ残すかはcallerが所有する。`steering.json`はsteering経由時だけ存在するsteering固有stateへ限定する。
- **提案1（現時点）**:
  - 総論: task-designの共通契約は、`task_design_dir`内にdesignとtasklistを自己完結させ、そのdirectoryと二つのfile pathをcallerへ返すところまでとする。caller固有の親pointerをtask-design成果物へ持ち込まない。再開のための永続化はcallerが自身の領域と受取人に合わせて行う。
  - 各論:
    - ルール: task-designは`<task_design_dir>/design.md`と`<task_design_dir>/tasklist.md`を同居させる。tasklist内の設計参照は固定相対path`./design.md`とし、bundleを別の親へ移しても二fileの関係が壊れないようにする。
    - ルール: task-design完了時は少なくとも`task_design_dir`、`design_path`、`tasklist_path`をcallerへ返す。task-designは「誰が次に読むか」やcallerのstate保存形式を固定しない。
    - ルール: standaloneではtask-designがchatまたはhostのresultとして三pathをユーザーへ返す。ユーザーはtasklist-executorへ`tasklist_path`を直接渡せる。再開時は`task_design_dir`を`working_dir_parent`として`create_working_dir=false`でtask-designへ渡す。
    - ルール: tasklist-executorは`tasklist_path`を必須入力とし、`design_path`が省略された場合は同じdirectoryの`design.md`を解決する。明示された`design_path`と相対解決先が異なる場合は推測せず不一致を報告する。
    - ルール: steering経由の場合だけ、steeringが`<steering-dir>/steering.json`へtask-design directoryのbasenameを保存する。これはsteeringが未来のsteering sessionへ残すorchestration stateであり、task-designが作る記録でも、standalone task-designの必須成果物でもない。
    - ルール: steeringはtask-designからpathを受け取った直後に`steering.json`を書く。summary、実装開始、実装後reviewはsteering自身のstateとしてそれを読む。manifestのbasename validation、破損時停止、旧steering fallbackは提案0を維持する。
    - ルール: steering以外のorchestratorが永続pointerを必要とする場合は、そのorchestratorが自身のstate領域へ記録する。task-design directoryへ特定orchestratorへのback referenceを置かない。
    - 適用例: standalone task-designを`/work/20260802-design-api-client-retry/`で完了した場合、task-designは同directoryと`design.md`、`tasklist.md`のpathを返す。steering fileは作らず、tasklist-executorは渡されたtasklistから隣のdesignを解決する。
    - 適用例: steering経由で同じbundleが`.steering/.../20260802-design-api-client-retry/`にある場合、steeringだけが親rootの`steering.json`へbasenameを記録する。task-design bundle自体はstandaloneと同じ構造を保つ。

#### イテレーション2

**受領したfeedback:**
> えっと、steering自体はtask-designにべったり。だから自身のディレクトリ配下にtask-design-disucussionとtasklistを作ってもらう。その指示をtask-design自体に行う時点で、密結合。steering.jsonを作る意味がわからない

##### 検証

- **観点**: 提案1も「steering directory」と「task-design working directory」を別directoryとして扱い続けたため、両者を結ぶpointerが必要だという誤った前提を残していた。
- **弱点**: steering rootへtask-design成果物とsteering固有成果物が同居するため、file名による境界が必要になる。ただし`task-design-discussion.md`と`discussion.md`は既に区別されており、子directoryとmanifestを追加するより構造が単純である。

##### 論点routingの判断

- **discussion scopeへ属する理由**: task-design成果物を置くdirectoryそのものを変更し、path永続化の要否、standaloneとの分岐、summaryとexecutorの参照範囲へ直接影響する。
- **同一decision scopeとしてiterationを継続する理由**: `task_design_dir`をsession外でどう復元するかという論点に対し、「別directoryなのでpointerが必要」という前提を否定し、同じpath解決decisionを単純化するfeedbackである。

##### 修正先の判断

- **診断levelへの遡及**: 問題はpointerの所有者ではなく、steering経由でもtask-designが新しい子directoryを作ると誤解したことにある。steeringが既に用意したdirectoryをtask-designが直接使えば、復元すべき別path自体が存在しない。

##### 根本原因2 + 提案2

- **根本原因2**: 「steeringから使う場合はsteeringのdirectory配下で作る」を「steering directory直下へtask-design専用の子directoryを新設する」と誤読した。実際の意図は、steeringが用意した自身のdirectoryをtask-designの`working_dir`として渡し、その直下へtask-design成果物を作らせる密結合なadapter契約である。
- **変更点**: task-design専用子directory、caller pointer、`steering.json`をすべて廃止する。steering経由では`create_working_dir=false`を使い、steering directoryとtask-design working directoryを同一pathにする。新規directory作成はstandaloneの既定動作だけに限定する。
- **提案2（現時点）**:
  - 総論: task-designは「既存directoryを直接使う」か「自分で新規directoryを作る」かだけを切り替える。steeringはtask-designと密結合なcallerとして、自身のdirectoryを既存working directoryとして直接渡す。両者の間に追加のdirectory identityやmanifestを置かない。
  - 各論:
    - ルール: standalone task-designは`create_working_dir=true`をdefaultとし、`name-work-directory`で決めた`<current working directory>/<YYYYMMDD-slug>/`を作る。そのdirectory直下へ`design.md`、`task-design-discussion.md`、`tasklist.md`と必要時の`requirements.md`、`investigation.md`、`spike/`を置く。
    - ルール: steeringは先に`.steering/YYYY/YYYYMM/YYYYMMDD-slug/`を作り、task-designへ`working_dir_parent=<steering directoryの絶対path>`と`create_working_dir=false`を渡す。task-designは受け取ったsteering directory自体を`working_dir`として使い、新しい子directoryを作らない。
    - ルール: steering経由の成果物は`<steering-dir>/design.md`、`<steering-dir>/task-design-discussion.md`、`<steering-dir>/tasklist.md`になる。steering固有の`discussion.md`、`implementation_review.md`、必要時の`roadmap.md`は同じdirectoryに別basenameで共存する。
    - ルール: `steering.json`を作らない。再開、summary、tasklist-executor、実装後reviewはsteering directory直下の固定file名を使うため、別pathの永続化も子directory探索も行わない。
    - ルール: task-designの一般契約は特定callerを要求しない。steering以外のcallerも、既存directoryを直接使わせるなら`create_working_dir=false`、task-design自身に新規作成させるなら`true`を渡す。
    - ルール: task-design完了時は`working_dir`、`design_path`、`tasklist_path`を返す。standaloneでは返却pathが後続workflowのhandleになり、steeringでは全pathが既知のsteering directoryから導出できる。
    - ルール: tasklist内の設計参照は同居する`./design.md`とする。tasklist-executorはtasklist pathから同じdirectoryのdesignを解決できる。
    - ルール: 現在この議論で誤って作ったtask-design子directory内の`design.md`と`task-design-discussion.md`は、提案2の合意後にsteering rootへ移し、現在の具体成果物を正しい配置へ直してからskill本体へ反映する。
    - 適用例: standaloneでrepository rootからtask-designを起動すると`<repository-root>/20260802-design-api-client-retry/design.md`と`tasklist.md`が作られる。
    - 適用例: steering `.steering/2026/202608/20260802-design-api-client-retry/`からtask-designを起動すると、そのsteering directory直下にdesign、task-design discussion、tasklistが作られ、追加の`20260802-.../`子directoryは作られない。

**決定:** 提案2を採用する。steering経由ではsteering directoryそのものをtask-designの`working_dir`として直接使い、`design.md`、`task-design-discussion.md`、排他的な`tasklist.md | roadmap.md`をrootへ同居させる。standalone時だけtask-designが新規directoryを作る。task-design専用子directoryと`steering.json`は作らない。

**ネクストアクション:** 現在のdesignとtask-design discussionをsteering rootへ移し、`design.md`のD2へ反映済み。tasklist詳細規則をtask-designのどのresourceへ分離するかを次の独立decisionとして扱う。

## 論点3: tasklist設計規則とcaller固有処理の分離

**ステータス:** 決定（論点4・提案3で拡張）

**種別:** TBDヒアリング

**提起の背景:** tasklistの作成・reviewをtask-designへ移すには、現在steeringのSKILL.mdとtasklist templateにある詳細規則も移す必要がある。しかし既存templateには親roadmap更新、steeringの`implementation_review.md`、doc-enricher、commit、push、PR作成などsteering固有の後続処理が含まれる。これをそのままtask-designへ移すと、standalone task-designがsteeringを前提にし、論点2で確定したcaller非依存契約と矛盾する。

### 現在の合意対象

**参照する現在案:** イテレーション3の提案3

**今回確認すること:** tasklistの既存scopeからroadmapに関する処理だけを独立させてsteeringへ残し、詳細な作成・review規則を`task-design/tasklist-design.md`というtask-design本体の分割fileへ移す提案2を採用するか。採用するとtask-design本文の肥大化を抑えつつ、分割fileを外部referenceではなくtask-designの構成要素として扱い、doc-enricher、条件付きcommit/push/PR、ユーザー確認、実装後feedbackを含むtasklistの完成契約を維持できる。

### 議論の変遷

#### 事象の記述

- task-designのSKILL.mdは既に800行を超えており、steeringにあるtasklist作成・自己レビュー規則を直接追記するとさらに肥大化する。
- 現在の`steering/templates/tasklist.md`には実装phaseだけでなく、steering固有のroadmap更新、discussion routing、commit、push、PR作成が含まれる。
- task-designはstandaloneでも起動され、steeringやGitHubを常に利用するとは限らない。
- tasklistの設計feedback loopをtask-designへ移す一方、複数MVPのroadmap、tasklist合意後の振り返り、実装開始、実装後reviewはD1でsteeringに残すと決定している。

#### 原因の追跡

- なぜ: 現在のtasklist templateが「実装契約」と「steeringの後続orchestration」を一つのcheckbox列へ混在させている。
- なぜ: tasklistの作成者がsteeringだったため、caller固有処理をtemplateへ直接埋めても境界問題が表面化しなかった。
- なぜ: tasklistを再利用可能なtask-design成果物ではなく、steering sessionの全残作業一覧として設計していた。

#### 根本原因0 + 提案0

- **根本原因0**: tasklistの正本がsteering固有workflowと結合しており、task-designへ所有権を移すだけではstandalone利用可能な成果物にならない。tasklistが担う実装・検証契約と、callerが担うworkflow orchestrationの境界を分離する必要がある。
- **提案0（現時点）**:
  - 総論: tasklist作成・reviewの再利用可能な規則をtask-design配下のreferenceへ、caller非依存の雛形をtask-design配下のtemplateへ移す。steering固有のroadmap、振り返り、公開、実装後reviewはtasklistから除き、steering本体の後続phaseとして保持する。
  - 各論:
    - ルール: `plugins/tumeda-dev/skills/task-design/references/tasklist-design.md`を新設し、tasklistのphase分割、DoD、test、UI確認、migration停止gate、自己レビュー、ユーザーreview、tasklist feedbackのdesign/tasklist routingを正本として置く。
    - ルール: task-designのSKILL.mdには、design最終合意後にreferenceを完全に読むこと、tasklistを作成・reviewすること、design変更feedbackではdesign loopへ戻ること、双方合意を完了gateとすることだけを置く。詳細checklistをSKILL.mdへ複製しない。
    - ルール: `steering/templates/tasklist.md`を`task-design/templates/tasklist.md`へ移し、設計参照を`./design.md`へ固定する。templateには実装phase、各phaseのDoD、品質確認、ユーザー動作確認までを置く。
    - ルール: templateから親roadmap更新、steering summary説明、steeringの`implementation_review.md` routing、doc-enricher、commit、push、PR作成を除く。これらはtasklistの実装・検証契約ではなくcaller固有orchestrationとして扱う。
    - ルール: steeringは複数MVP時のroadmapと子steering、tasklist合意後のdoc-enricherとdiscussion振り返り、tasklist-executor起動、実装完了後のcommit・push・PR判断、`implementation_review.md`を所有する。tasklistへ同じ処理をcheckboxとして再挿入しない。
    - ルール: standaloneではtask-designが返したtasklistをtasklist-executorへ直接渡せる。実装後のcommit、公開、追加reviewはユーザーまたは別orchestratorが決め、task-designは特定workflowを要求しない。
    - ルール: tasklist-executorはtasklist内の実装・検証・ユーザー動作確認だけをsingle writerとして完了させ、caller固有の公開処理を暗黙実行しない。designは同directoryの`./design.md`を既定参照にする。
    - ルール: tasklist作成中に一つのMVPでは成立しないと判明した場合、task-designはtasklistを確定せず、分割理由と候補MVPをcallerへ返す。steering callerだけがroadmapと子steeringへ変換する。
    - 適用例: standalone task-designのtasklistは実装、test、lint、ユーザー動作確認で終了し、存在しないsteeringやGitHub PR作成を要求しない。
    - 適用例: steering経由では同じgeneric tasklistをexecutorが完了した後、steeringが自分の後続phaseとしてdoc-enricher、commit、push、PR、実装後reviewを扱う。

##### 検証

- **観点**: task-designの肥大化を防げるか、standaloneでsteering依存が漏れないか、steeringに残すD1の責務と矛盾しないか、tasklist-executorが暗黙に外部公開しないかを確認した。
- **弱点**: commit・push・PRがtasklist checkboxから外れるため、tasklist完了は「実装・検証・ユーザー確認の完了」を意味し、「公開完了」を意味しなくなる。summaryがtasklist checkboxから判定するstatusも同じ意味になる。この意味変更をsteeringとsummaryへ明記し、公開状態が必要なら別のcaller stateとして扱う必要がある。

#### イテレーション1

**受領したfeedback:**
> task-design/references/tasklist-design.md って何の話？ 「 roadmap、doc-enricher、commit、push、PR、実装後reviewはcaller固有処理としてtasklistから外す」について外す意図は？

##### 検証

- **観点**: 新しいreferenceが別のworkflowや成果物に見え、task-designとの所有関係と読込timingを説明できていなかった。また、tasklist項目をcaller固有かどうかだけで分類し、機能完成までの実行契約かという本来の基準を使っていなかった。
- **弱点**: 既存tasklist scopeを維持すると、standaloneでもGitHubや親roadmap等の条件分岐を理解する必要がある。ただし既存templateは既に「該当時だけ」の条件を持っており、repository contextがなければ実行しない契約を明確にすれば特定callerへの依存にはならない。

##### 論点routingの判断

- **discussion scopeへ属する理由**: tasklist規則の保存先とtasklistに残す項目を変更し、task-design、template、executor、standalone利用の実装範囲へ直接影響する。
- **同一decision scopeとしてiterationを継続する理由**: 論点3の「tasklist設計規則とcaller固有処理の分離」について、referenceの意味と分離基準を問い直すfeedbackである。

##### 修正先の判断

- **診断levelへの遡及**: 提案0は「steeringに現在ある項目」を「steering固有処理」とみなし、配置場所を責務判定の根拠にした。正しくは、tasklistに残すかを「機能を完成させる実行契約か」「条件を満たす任意callerでも実行可能か」で判定する。

##### 根本原因1 + 提案1

- **根本原因1**: tasklist規則の物理的な移動先と、tasklistが表す完了scopeの変更を一つの提案へ混ぜたため、所有権移動に不要なtask削除まで導いていた。また、referenceをtask-designがphase限定で読む内部instructionとして説明せず、新しい独立概念のように提示した。
- **変更点**: tasklistからdoc-enricher、commit、push、PR、実装後feedback等を一括削除する案を撤回する。既存の完了scopeとconditional actionを維持し、steeringに固定された表現とpathだけをtask-design/caller非依存へ直す。referenceはtask-designの内部resourceであることと読込timingを明示する。
- **提案1（現時点）**:
  - 総論: tasklistの既存scopeを変えず、所有者と正本の配置だけをtask-designへ移す。詳細規則はtask-designのtasklist phase専用internal referenceとして分離し、templateは条件付きactionを維持したcaller非依存表現へ更新する。
  - 各論:
    - ルール: `plugins/tumeda-dev/skills/task-design/references/tasklist-design.md`はtask-design内部のinstructionとする。task-designがdesignを最終合意し、tasklist作成phaseへ入る時だけ完全に読む。ユーザー成果物、別skill、別ownerにはしない。
    - ルール: referenceには現在steeringが持つtasklist作成規則、phase分割、DoD、test、UI確認、migration停止gate、自己レビュー、ユーザーレビュー、tasklist feedbackのdesign/tasklist routingを移す。task-designのSKILL.mdにはreferenceを読むphase遷移と完了gateだけを残し、同じchecklistを複製しない。
    - ルール: `steering/templates/tasklist.md`を`task-design/templates/tasklist.md`へ移す。`設計参照`は同居する`./design.md`へ変更する。
    - ルール: templateの既存scopeである実装、test、lint、UI確認、doc-enricher、ユーザー動作確認、条件付き親roadmap更新、commit、GitHub contextがある場合だけのpush/PR、実装後feedback収集を維持する。
    - ルール: tasklist内の`steeringがfacilitate-discussionを使う`、`steering skill directoryのscript`等の固定表現は、task-design再開またはcallerが所有するfeedback routing、plugin内の解決可能なhelper pathへ置き換える。特定callerが存在しなければtask-designが返したpathと一般契約だけで完了可否を判断できるようにする。
    - ルール: commit、push、PRは引き続きユーザー動作確認後に置き、repository contextが許可した場合だけ実行する。standaloneでもGit/GitHub contextが得られれば実行でき、得られなければ既存契約どおりtasklistへ入れない。
    - ルール: doc-enricherと実装後feedbackを残す。どちらもsteeringの存在ではなく、pluginの対応skillとtask-design bundle pathを基準に起動する。実装後feedbackがdesignまたはtasklistを変える場合は、既存working directoryを`create_working_dir=false`でtask-designへ渡して再開する。
    - ルール: 複数MVPを表すroadmapの作成はtasklistではないためsteeringに残す。ただし子tasklistに既にある「親roadmapがある場合だけ更新」は機能全体の完了伝播としてconditionalに維持する。
    - ルール: task-designがtasklist作成中に一つのMVPでは成立しないと判断した場合はtasklistを確定せず、分割理由と候補MVPをcallerへ返す。steering callerはroadmapへ変換し、standalone callerは返却結果を受けて次のorchestrationを決める。
    - 適用例: standalone task-designでもGitHub contextがあるrepositoryなら、ユーザー確認後のcommit、push、PR taskを含められる。GitHub contextがなければそのtaskを生成しない。
    - 適用例: steering経由の子tasklistは親roadmap pathが渡された場合だけ完了時更新を含む。親roadmapがない通常tasklistやstandalone tasklistには含めない。

#### イテレーション2

**受領したfeedback:**
> 何だったらroadmap性だけはtasklistと同一視せず独立させて母体に残しても良いかもな。 そして task-design/references/tasklist-design.md の references は元々外にあったものという外様性を残すから、task-design直下に置いて、task-designの一部だけど、長いからファイルを分けているという位置づけにする程度にしたい

##### 検証

- **観点**: roadmapの新規作成だけをsteeringへ残して親roadmap更新をtasklistへ含めると、roadmap stateのwriterがsteeringとtasklist-executorへ分かれる。また、`references/`という配置はtasklist設計規則をtask-designが参照する外部知識のように見せ、task-designへ所有権を移す意図を弱める。
- **弱点**: `task-design/tasklist-design.md`は一般的なreference配置から外れるため、SKILL.mdから読込timingと「task-design本体の分割file」であることを明記しなければ見落とされる。ただし所有関係をpathでも明示でき、今回の目的には適している。

##### 論点routingの判断

- **discussion scopeへ属する理由**: roadmap関連taskのownerとtasklist設計規則の正本pathを変更し、task-design、steering、tasklist template、tasklist-executorの実装範囲へ直接影響する。
- **同一decision scopeとしてiterationを継続する理由**: tasklistへ残す完了scopeと、tasklist設計規則をtask-design内でどう分割するかという論点3の二つの判断を具体化するfeedbackである。

##### 修正先の判断

- **提案levelの修正**: tasklist lifecycleをtask-designが所有する根本原因は維持する。roadmapをtasklistとは異なる計画単位としてsteeringへ完全に残し、分割fileの配置だけをtask-design直下へ変更する。

##### 根本原因1 + 提案2

- **根本原因1（維持）**: tasklist規則の物理的な移動先と、tasklistが表す完了scopeの変更を一つの提案へ混ぜたため、所有権移動に不要なtask削除まで導いていた。一方、roadmapは複数tasklistを束ねる上位計画であり、単一tasklistの完了契約へ含めると計画階層のownerが分散する。
- **変更点**: `references/tasklist-design.md`をtask-design内部referenceとする案をやめ、`task-design/tasklist-design.md`をtask-design本体から長いtasklist phaseを物理的に分割した構成fileとする。また、roadmapの作成だけでなく進捗・完了更新もtasklistから外し、steeringへ一貫して残す。それ以外の既存tasklist scopeは維持する。
- **提案2（現時点）**:
  - 総論: designとtasklistの設計収束lifecycleはtask-designが一体で所有する。tasklist phaseの詳細だけを`task-design/tasklist-design.md`へ分割する。roadmapは複数のtask-design/tasklistを束ねるsteeringの上位成果物として独立させ、tasklistと同一視しない。
  - 各論:
    - ルール: 正本pathを`plugins/tumeda-dev/skills/task-design/tasklist-design.md`とする。これは外部資料を置く`references/`ではなく、長さのために`SKILL.md`から分割したtask-design自身のinstructionである。別skill、任意reference、ユーザー成果物にはしない。
    - ルール: task-designの`SKILL.md`は、designの最終合意後に同directoryの`tasklist-design.md`を完全に読み、その手順でtasklistを作成・reviewすることを必須化する。phase遷移、designへの差し戻し、最終完了gateは`SKILL.md`に残し、詳細checklistは分割fileへ一度だけ置く。
    - ルール: `steering/templates/tasklist.md`を`task-design/templates/tasklist.md`へ移し、`設計参照`を同居する`./design.md`へ変更する。
    - ルール: roadmapの作成、子tasklistとの関連付け、進捗・完了更新はすべてsteeringが所有する。tasklist templateには親roadmap更新taskを入れず、tasklist-executorの完了結果を受けたsteeringがroadmapを更新する。standalone task-designはroadmapを要求しない。
    - ルール: 一つのMVPでは成立しないとtask-designが判断した場合、tasklistを確定せず分割理由と候補MVPをcallerへ返す。steeringはその返却をroadmapへ変換するが、task-designやtasklistはroadmap自体を作成・更新しない。
    - ルール: roadmap以外の既存scopeである実装、test、lint、UI確認、doc-enricher、ユーザー動作確認、commit、GitHub contextがある場合だけのpush/PR、実装後feedback収集はtasklistに維持する。
    - ルール: tasklist内のsteering固定表現とpathだけをtask-designまたはcaller非依存の契約へ直す。commit、push、PRはユーザー動作確認後かつrepository contextが許可した場合だけ実行する。
    - ルール: 実装後feedbackがdesignまたはtasklistを変える場合は、既存working directoryを`create_working_dir=false`でtask-designへ渡して再開する。roadmapへの反映が必要なら、task-design再合意後の結果をsteeringが自分のphaseで更新する。
    - 適用例: 子tasklistの全項目が完了するとtasklist-executorは完了結果を返すが、`roadmap.md`は編集しない。親steeringが結果を受け、対応MVPのstatusを更新する。
    - 適用例: standalone task-designのtasklistはroadmapを持たず、repository contextに応じてdoc-enricher、commit、push、PR、実装後feedbackまでを含められる。

**決定:** 提案2を採用し、論点4の提案3でroadmap設計も同じmodelへ拡張する。tasklist phaseは`task-design/tasklist-design.md`、roadmap phaseは`task-design/roadmap-design.md`を正本とし、いずれも外部referenceではなくtask-design本体の分割fileとして扱う。roadmapの構造はtask-design、子steering binding・status・再帰実行はsteeringが所有する。

**ネクストアクション:** `design.md`のD3へ反映済み。roadmap化の意味的な判断基準、task-designからsteeringへの移譲、親roadmap contextを持つ子task-designの運用を論点4で設計する。

## 論点4: roadmap化判断と親子steeringへの引き継ぎ

**ステータス:** 決定

**親論点:** 論点3

**種別:** TBDヒアリング

**起点となった原文:**
> roadmapの意味的な運用方法、判断ロジックは成立するか整理しておきたい。roadmap化判断はtask-designの中で、自身でまかなえそうかとなったらtask-designの中でtasklistで作成、task-designのtasklistで賄えないとなったらsteeringに依頼、そして、steeringからtask-designが呼ばれている場合は、そのまま移譲を受け取りroadmap化を受け取り、次のsteeringでtask-designが自身の親がこのroadmapだと知りながら自身の子タスクを遂行する感じで、めっちゃ密結合で運用する感じかな？ 思いつきで書いているから成立の仕方が無理やりでないかわかっていない

**提起の背景:** roadmapのfile所有者をsteeringへ残しても、roadmapが必要かを判断できるのはdesignとtasklistの具体化を一体で行うtask-designである。判断者と成果物所有者が異なるため、戻り値、親子steeringの生成順、子task-designへ渡す上位contextを決めないと、task-designとsteeringが互いを再帰的に呼び続けたり、子tasklistが親roadmapを直接更新したりする。

### 現在の合意対象

**参照する現在案:** イテレーション3の提案3

**今回確認すること:** task-designがdesignに対応するleaf/composite実行計画を排他的に`tasklist.md`または`roadmap.md`として設計し、steeringはroadmapの子binding・status・再帰実行だけを所有する提案3を採用するか。採用するとtasklistだけでなくroadmap reviewから親designへ戻るloopもtask-design内で閉じられる。

### 議論の変遷

#### 事象の記述

- tasklistを具体化しなければ、現在scopeが一つのtasklistで実装可能か判明しない場合がある。
- roadmapは複数の独立した設計・合意・実装loopを束ねるが、task-designは単一loopのdesignとtasklistを所有する。
- 現行steeringは「一つのMVPか」を判断してroadmapを作る一方、変更後はtasklist設計規則がtask-designへ移る。
- 子task-designが親roadmapを知らないと、自分の担当scope、前後phaseとの依存、親の全体designに反する変更を判断できない。

#### 原因の追跡

- なぜ: roadmap要否の判断を「task数やphase数が多いか」と「設計・合意loopを分ける必要があるか」に分離していない。
- なぜ: task-designからsteeringへ返す結果を単なる終了として扱い、leaf計画とcomposite計画を分岐する明示的な結果契約がない。
- なぜ: roadmapから子steeringへのscope移譲をpathだけで表し、task-designへ渡す上位design、phase identity、依存条件を定義していない。

#### 根本原因0 + 提案0

- **根本原因0**: task-designとsteeringの密結合自体ではなく、両者が同じ判断と成果物を所有すると循環することが問題である。task-designが現在scopeのleaf/composite判定を所有し、steeringがcompositeの構成と進捗伝播を所有すれば、一方向の返却と次nodeの起動として成立する。
- **提案0（現時点）**:
  - 総論: steeringをroadmap treeのnode、task-designを各nodeのleaf/composite判定器兼leaf設計者として密結合させる。task-designは自分でroadmapを作らず、単一tasklistで閉じない場合は`roadmap_required`相当の結果をcallerへ返す。steeringはその結果からroadmapを合意し、各phaseに新しい子steeringを作り、子steeringが新しいtask-designを起動する。
  - 各論:
    - ルール: 「task-design自身で賄える」はagentの処理能力、file数、task数、phase数では判定しない。一つのdesign baseline、一つのtasklist review、一つの実装完了承認loopで現在scopeを閉じられるかで判定する。
    - ルール: 次をすべて満たす場合はleafとし、task-designが`tasklist.md`を作る。(1) 完成後の状態が一つの合意単位である、(2) 各実装phaseが同じdesignを段階的に実現する、(3) phaseごとに別のdesign合意や別の実装完了承認を必要としない、(4) 後続scopeの設計が先行scopeの実装結果待ちにならない。
    - ルール: 次のいずれかに該当する場合はcompositeとし、task-designはtasklistを確定しない。(1) 独立して利用・リリース・完了承認できる完成状態が二つ以上ある、(2) scopeごとにdesignとtasklistの合意loopを分ける必要がある、(3) 後続scopeのdesignが先行scopeの実装結果や判断に依存する、(4) 一つのtasklistにすると異なる完成目的と完了責任が混在する。
    - ルール: A案/B案が単なる設計上の選択肢ならroadmap化せず、task-design内で一案に決める。両案を別々の成果として実装・評価すること自体が要件の場合だけ、独立scopeとしてroadmap候補にする。
    - ルール: task-designはcomposite判定時に`tasklist.md`を作らず、callerへ少なくとも`roadmap_required`、判定理由、候補phaseごとの目的・DoD・依存・scope外、現在の`design_path`を返す。これはroadmapそのものではなくsteeringがroadmapを設計する入力である。
    - ルール: callerがsteeringなら、現在のsteeringが返却を受け、同directoryに`roadmap.md`を作ってユーザー合意を得る。現在nodeは`design.md + roadmap.md`を持つcompositeとなり、`tasklist.md`を持たない。
    - ルール: roadmap合意後、steeringはphaseごとに子steering directoryを作る。子steeringはtask-designへ`working_dir_parent=<子steering directory>`、`create_working_dir=false`に加え、親`roadmap.md`のpath、担当phase identity、親`design.md`、前提・依存を設計contextとして渡す。
    - ルール: 子task-designは親roadmapを編集しない。担当phaseと上位制約を自分の`design.md`へ明示し、そのscopeについて再びleaf/compositeを判定する。leafならtasklistを作り、compositeなら同じ結果契約を子steeringへ返すため、roadmapは必要に応じてtreeとして入れ子になれる。
    - ルール: 各steering nodeは`tasklist.md`を持つleafまたは`roadmap.md`を持つcompositeのどちらか一方とし、両方を正本として持たない。composite nodeの完了は全子steering完了、leaf nodeの完了はtasklist完了で判定する。
    - ルール: 子nodeの完了を親roadmapへ反映するのはtasklistまたはtask-designではなく、その子をorchestrateするsteeringである。最下位のleaf完了から上位composite完了まで、steeringが一段ずつstatusを伝播する。
    - ルール: standalone task-designでcomposite判定になった場合は、steeringを暗黙起動したり既存working directoryをsteering directoryへ見立てたりしない。`roadmap_required`と既存成果物pathをユーザーへ返し、steeringへの明示的な引き継ぎを求める。standalone成果物を新しいsteeringへどう取り込むかは別途handoff規則として確定する。
    - 適用例: API、管理画面、監査運用が同じreleaseで一体となり、一つの完成状態を段階的に作るならphaseが多くても一つのtasklistにする。API提供だけで独立利用でき、その利用結果を見て管理画面の要件を決めるなら二つのdesign loopなのでroadmapにする。
    - 適用例: 親roadmapのphase 2を担当する子steeringは、phase 2のidentityと親designをtask-designへ渡す。task-designがphase 2も二つの独立成果に分かれると判定すれば、子steeringがphase 2用のroadmapを持ち、親phase 2はその子steering全体の完了を待つ。

##### 検証

- **観点**: task-designとsteeringが相互再帰して停止しなくならないか、tasklistとroadmapのownerが再混在しないか、子task-designが親scopeを失わないか、規模だけでroadmap化しないかを確認した。
- **成立する理由**: 同じagent invocation内でtask-designがsteeringを呼び返すのではなく、task-designはleaf/composite結果を返して終了する。steeringが現在nodeを確定し、次の子nodeで新しいtask-designを起動するため、call stackの循環ではなく有限な計画treeの展開になる。
- **弱点**: standaloneからsteeringへ移る際はworking directory体系が異なるため、既存`design.md`を新しいsteeringの正本へどう昇格するかが未決である。また、無制限の入れ子を許すとroadmap treeが深くなるため、親phaseを再分割するか子roadmapを許すかの運用基準が必要になる可能性がある。

**決定:** 未決。提案0への合意を待つ。

**ネクストアクション:** 提案0が合意されたら`design.md`へD4として反映する。その後、standaloneからsteeringへのhandoffとroadmap treeの深さ制御を同じdecisionの追加iterationまたは下位論点として解消する。

#### イテレーション1

**受領したfeedback:**
> この密結合事情を踏まえた分水嶺によってはtasklistはtask-designに移さないことも選択肢かもしれない。tasklistのレビュー結果がtask-designに帰るという越境を許容することになるけど

##### 検証

- **観点**: roadmapをtasklistから独立させた後もtasklistだけをtask-designへ移すと、同じsteering nodeの計画種別であるleafとcompositeを別ownerが作る。tasklistが持つ実装、検証、ユーザー確認、commit、push、PR、実装後feedbackも、design収束よりsteeringの実行orchestrationへ強く属する。
- **弱点**: tasklist作成中のdesign変更feedbackはskill境界を跨ぐ。ただし越境対象をdesign正本の変更だけに限定し、tasklist作業をsuspendしてtask-designの再合意後に再開するなら、二つのownerが同じfileを編集する状態にはならない。

##### 論点routingの判断

- **discussion scopeへ属する理由**: roadmapとtasklistの意味的関係からtasklist ownerそのものを再評価し、task-design、steering、template、完了gateの変更範囲を反転させ得る。
- **親decisionへ遡る理由**: 論点4のhowだけでなく、論点1で採用した「tasklist lifecycleをtask-designへ移す」という根本decisionを再び選び直すfeedbackである。論点1を再検討中へ戻し、論点3の決定はtasklistを移すmodelを選んだ場合だけ有効な条件付きhowとして保持する。

##### 修正先の判断

- **診断levelへの遡及**: tasklistからdesignへfeedbackが戻ることを、同じownerにすべき十分条件とみなしていた。しかし成果物のownerは「feedbackの戻り先」ではなく「成果物が表す主たるlifecycle」で決める必要がある。tasklistはdesignの実装可能性を検算する一方、実装順序から公開・feedbackまでを制御するleaf実行計画でもある。

##### 根本原因1 + 提案1

- **根本原因1**: designとtasklistのfeedback loopの局所性だけを最適化し、steering nodeが`tasklist.md`または`roadmap.md`のどちらで実行計画を表すかという上位の計画topologyを考慮していなかった。そのためtasklistをtask-designへ移すと、leaf計画とcomposite計画のownerが分かれ、task-designとsteeringの相互移譲が必要になった。
- **変更点**: tasklist lifecycleをtask-designへ移す提案を第一候補から外す。tasklistとroadmapをsteeringの排他的な計画成果物として同じownerへ置き、task-designはdesign lifecycleと現在scopeのleaf/composite判定を所有する。tasklistレビューでdesign変更が必要な場合だけ、既存directoryのtask-designへ明示的に差し戻す。
- **提案1（現時点）**:
  - 総論: task-designは「実装判断が残らないdesign」と「一つの実行計画で閉じるscopeか」を返す。steeringはその結果からleafならtasklist、compositeならroadmapを作り、各計画のreviewと後続orchestrationを所有する。tasklistからdesignへ戻る越境は、正本ownerへの型付けされたfeedback routingとして許容する。
  - 各論:
    - ルール: 各steering nodeは`design.md`に加え、leafなら`tasklist.md`、compositeなら`roadmap.md`のどちらか一方を持つ。tasklistとroadmapはともにsteeringの計画成果物であり、同じnodeで併存させない。
    - ルール: task-designはdesign合意時に`single_scope`または`roadmap_required`相当の判定を返す。判定基準は提案0の意味基準を維持し、task数、file数、phase数、agent能力では決めない。
    - ルール: `single_scope`ならsteeringがtasklistを作成・自己レビュー・ユーザーレビューする。`roadmap_required`ならsteeringが候補phaseを検証してroadmapを作成・合意し、子steeringを起動する。
    - ルール: tasklist feedbackを、(A) 実装順序・task粒度・検証手順・実行actionだけを変える`plan_feedback`と、(B) 完成後の姿・要件・設計根拠・公開API・責務境界・scope分割を変える`design_feedback`へ分類する。Aはsteering内でtasklistを修正する。Bはtasklist reviewをsuspendし、feedbackと既存working directoryを渡してtask-designを`create_working_dir=false`で再開する。
    - ルール: task-designはBだけを受けてdesignを修正・再合意し、`single_scope`または`roadmap_required`を再判定してsteeringへ返す。steeringは古いtasklistを正本として継続せず、新しいdesignに合わせてtasklistを更新するかroadmapへ切り替え、reviewを最初から再開する。
    - ルール: task-designとsteeringが同じfileを同時に編集しない。task-designは`design.md`と`task-design-discussion.md`、steeringは`tasklist.md`、`roadmap.md`、steering固有成果物をsingle writerとして所有する。
    - ルール: tasklist作成・review規則とtemplateはsteeringに残す。長さのため分割する場合は`steering/tasklist-design.md`をsteering本体の分割fileとし、`references/`にもtask-design配下にも置かない。
    - ルール: standalone task-designはdesign合意とscope判定で終了し、tasklistやroadmapを作らない。`single_scope`なら実装へ直接進むかsteeringでtasklist化する選択肢を返し、`roadmap_required`ならsteeringへの引き継ぎを案内する。task-designのdefault directory作成契約はそのまま維持する。
    - ルール: 子steeringは親roadmapの担当phase、親design、依存条件をtask-designへcontextとして渡す。task-designはそれを上位制約として子designへ反映するが、親roadmapの作成・更新は行わない。
    - ルール: leaf tasklistの完了とcomposite roadmapの完了はsteeringが一段ずつ親へ伝播する。tasklist templateに親roadmap更新checkboxを持たせず、tasklist-executorにもroadmapを編集させない。
    - 適用例: tasklistレビューで「API phaseと管理画面phaseを別々にリリース・合意すべき」と判明した場合、steeringはtasklist reviewを止めてtask-designへdesign feedbackを返す。task-designがroadmap_requiredへ判定を変えた後、steeringはtasklistを廃止してroadmapを作る。
    - 適用例: 「API phaseを認証実装とendpoint実装へ分けるが完成状態は一つ」という指摘なら、designを変えずsteeringがtasklistだけを更新する。

##### モデル比較

| 観点 | tasklistをtask-designへ移す | tasklistをsteeringへ残す（提案1） |
| --- | --- | --- |
| design feedback loop | 同一skill内で閉じる | design変更時だけ越境する |
| roadmap/tasklistの計画owner | compositeとleafで分かれる | steeringへ統一される |
| tasklistの実行・公開action | task-designがcaller contextを抱える | steeringの後続orchestrationと同居する |
| standalone task-design | tasklistまで作る | designとscope判定で終わる |
| 相互依存 | task-design→steering→子task-designが通常flow | steering→task-design→steeringの明示的な返却 |
| single writer | task-designがdesignとtasklist | task-designがdesign、steeringが計画 |

##### 検証

- **観点**: 越境が無秩序な往復にならないか、tasklist review中に二つのskillが同じ成果物を編集しないか、roadmap化への切替が古いtasklistと競合しないかを確認した。
- **成立する理由**: design変更時だけtasklist phaseを停止し、task-designがdesignを再合意してからsteeringへ返す。feedback分類、suspend、再判定、tasklist再reviewという一方向のprotocolがあるため、越境してもownerは曖昧にならない。
- **見解**: roadmapを独立した上位計画として扱うなら、tasklistもleaf計画としてsteeringへ残す提案1の方が責務の切れ目は自然である。tasklistをtask-designへ移す利点はfeedback loopの局所性だが、そのために計画topologyのownerを分けるコストの方が大きい。

**決定:** 未決。提案1への合意を待つ。論点1のtasklist所有権もこの選択により確定し直す。

**ネクストアクション:** 提案1が合意されたら、`design.md`のD1とD3を「tasklistはsteeringに残す」modelへ置き換え、roadmap判定とfeedback routingをD4として統合する。移すmodelを維持する場合は提案0へ戻り、standalone handoffとtree深さを詰める。

#### イテレーション2

**受領したfeedback:**
> 相談してるんだから、唯々諾々と決定を翻すのではなく、吟味して提案してほしいのよ

##### 検証

- **観点**: tasklistをsteeringへ残す案を、roadmapと同じ「計画」という表面上の共通性だけで優先していないか。元の目的、standalone利用、skill間依存、single writer、feedback頻度を同じ基準で比較した。
- **誤り**: 「tasklistをsteeringへ残すことも選択肢」という仮説を、ユーザーが変更を望んだものとして先取りした。相談段階では既存decisionを直ちに反転せず、二案の意味的凝集性と運用costを比較したうえで推奨案を提示すべきだった。

##### 論点routingの判断

- **discussion scopeへ属する理由**: 新しい要件feedbackではなく、提案1を導いた評価方法への指摘である。同じ所有権decision内で比較基準からやり直す。
- **同一decision scopeとしてiterationを継続する理由**: tasklistをどちらのskillへ置くかという論点1と、roadmapとの連携方法という論点4を同じ分水嶺で評価する必要がある。

##### 修正先の判断

- **診断levelへの遡及**: 「roadmapとtasklistはいずれも計画成果物」という分類だけではownerを決められない。tasklistの主たる役割がdesignの実装可能性を検算して設計判断を収束させることか、実装sessionをorchestrateすることかを、元の問題と利用形態から評価する。

##### 比較結果

- tasklistは実装・検証・公開actionを含むが、その最も強い設計上の役割は、designの完成状態・責務境界・DoDを着手可能な粒度へ落とし、足りない設計判断を発見することである。tasklist reviewでdesignへ戻ることは例外的なerror処理ではなく、tasklist作成phaseの通常の収束loopである。
- roadmapは一つのdesignを詳細化する成果物ではなく、独立したdesign/tasklist loopを複数束ねる上位orchestrationである。tasklistとroadmapはleaf/compositeという関係を持つが、同じ抽象度の代替成果物ではない。
- tasklistをsteeringへ残すと、頻繁に起こり得るdesign feedbackごとにskillを越境し、task-design再合意後にsteeringがtasklist reviewを再開する必要がある。これは実装できるが、今回解消したかった分断を明示protocolへ置き換えただけになる。
- tasklistをtask-designへ移すと、standaloneでもdesignとtasklistのbundleを完成できる。steering経由でも同じbundle契約を使え、caller差分はroadmapが必要な時だけになる。
- task-designがsteeringを直接起動しなければskill依存は循環しない。task-designはcallerの種類を知らずに`tasklist_ready`または`split_required`を返し、steeringだけが後者をroadmapへ変換できる。standalone callerは後者を受けてsteeringを明示起動するか判断する。

##### 根本原因2 + 提案2

- **根本原因2**: tasklist ownershipとroadmap ownershipを同じskillへ揃えなければならないと考えたことで、成果物の抽象度と通常feedback loopを無視した。必要なのはowner統一ではなく、task-designが単一loopを閉じられる場合と複数loopへの分割が必要な場合をcaller非依存の結果型で分けることである。
- **変更点**: tasklistをsteeringへ戻す提案1は代替案として棄却する。論点1と論点3のdecisionを維持し、task-designからsteeringへの直接callを導入しない。roadmap化は`split_required`を受けたsteeringのadapter処理とする。
- **提案2（推奨）**:
  - 総論: task-designは一つの設計収束loopについて`design.md`と`tasklist.md`を完成させるownerであり、steeringは複数の設計収束loopを`roadmap.md`で束ねるownerである。両者の境界はartifact種別ではなく、単一loopか複数loopかに置く。
  - 各論:
    - ルール: task-designの結果を`tasklist_ready`と`split_required`の排他的な二系統にする。実際の識別子や返却形式はskill本文に自然言語で規定し、永続manifestを追加しない。
    - ルール: `tasklist_ready`では`working_dir`、`design_path`、`tasklist_path`を返す。designとtasklistの双方が合意済みで、未解消のdesign feedbackがないことを完了条件とする。
    - ルール: `split_required`では`working_dir`、`design_path`、分割理由、候補scopeごとの目的・DoD・依存・scope外を返し、`tasklist.md`を確定しない。task-designはsteeringを直接起動せず、roadmap fileも作らない。
    - ルール: steeringがcallerなら、同じsteering invocationが`split_required`を受けて`roadmap.md`を作成・合意する。standalone callerなら結果と既存pathをユーザーへ返し、steeringへの移行は別の明示操作にする。
    - ルール: roadmapの各phaseは新しいsteering directoryを持ち、そのsteeringがtask-designへ`create_working_dir=false`、担当phase、親design、依存条件を渡す。子task-designは自分のscopeで再び二系統のどちらかを返す。
    - ルール: 子task-designは親roadmapを参照contextとして理解するが編集しない。tasklist-executorもroadmapを更新しない。子の完了を親へ伝播するのはsteeringである。
    - ルール: tasklistの作成・自己レビュー・ユーザーレビューと、feedbackがdesign変更かtasklist変更だけかのroutingはtask-design内で閉じる。commit、push、PR等のconditional taskも合意済みのtasklist scopeとしてtask-designが設計し、実行はtasklist-executorへ委ねる。
    - ルール: roadmapの新規作成、phase構成の合意、子steering生成、status伝播はsteeringに閉じる。task-design側にsteering固有pathやroadmap更新taskを持ち込まない。
    - 適用例: tasklist作成中に二つの独立releaseと別々の完了承認が必要と判明したら、task-designはtasklistを合意対象にせず`split_required`を返す。steeringは候補scopeをroadmapとして再検証・合意し、各子steeringを順に起動する。
    - 適用例: phaseが多くても一つの完成状態と一つのdesign合意で閉じるなら、task-designは同じskill内でtasklistを完成させ、steeringへ`tasklist_ready`を返す。

##### 提案1を棄却する理由

- tasklist reviewからdesignへの差し戻しをskill間protocolとして恒常化し、元の分断を残す。
- standalone task-designが「実装は手を動かすだけ」のtasklistまで完成できず、simple scopeでもsteeringを必要とする。
- roadmapとtasklistの見た目上の対称性を優先し、単一designの具体化と複数designのorchestrationという抽象度差を弱く扱っている。
- task-designがcaller非依存の結果を返せば依存循環を避けられるため、提案1の主な利点であるcall graph単純化はtasklist ownershipを戻さなくても得られる。

##### 検証

- **観点**: task-designがsteeringへ依存せずにroadmap化を要求できるか、standaloneとsteering経由で同じresult contractを使えるか、親roadmapのwriterが再びtasklistへ漏れないかを確認した。
- **成立する理由**: task-designはcaller-neutralな二系統の結果を返して終了し、steeringだけが自分への返却をroadmapへ変換する。skillの直接相互callではなく、callerによるresult dispatchなので、密結合はsteering adapter内に限定される。
- **残るTBD**: standaloneで生成済みのworking directoryからsteeringへ移行する場合、既存designを新しいsteering directoryへどう引き継ぐかは別途決める必要がある。これはtasklist ownerの選択を反転させる理由ではなく、standalone escalation固有のadapter問題である。

**決定:** 未決。提案2への合意を待つ。現時点の推奨は、tasklistをtask-designへ移すdecisionを維持すること。

**ネクストアクション:** 提案2が合意されたら`design.md`へroadmap判定とresult dispatchをD4として反映し、standalone escalationの引き継ぎだけを下位論点として解消する。

#### イテレーション3

**受領したfeedback:**
> じゃああれかな、roadmap自体がtasklistと同列としてtask-designに内包されるのも選択肢って感じ？ steering>task-design>{tasklist|roadmap}という入れ子構造の中で、roadmapは奥底の他のsteeringの親を持つtask-designと対応を持つって感じ。これは唯々諾々と受け取るのではなくて他の選択肢と吟味して提案して

##### 検証

- **観点**: task-designがroadmapまで設計すると責務過多にならないか、tasklistとroadmapを同じ抽象度で扱えるか、roadmapから子steering・子task-designへの対応を循環なく表せるか、構造と実行statusのwriterを分けても正本が壊れないかを三案で比較した。
- **重要な区別**: tasklistとroadmapは同じ形式ではないが、どちらも「合意済みdesignをどう実行単位へ落とすか」という実行計画の直和として扱える。tasklistは一つのdesign loopを実装phaseへ落とすleaf、roadmapは複数の子design loopへ分解するcompositeである。

##### 論点routingの判断

- **discussion scopeへ属する理由**: roadmapのownerをsteeringからtask-designへ移し、task-designの結果型、roadmap template、親子binding、status更新、standalone出力を変更する。
- **親decisionへ遡る理由**: 論点1のtasklist ownerと論点3のroadmap分離を包含する上位modelであり、採用時はD1とD3を「execution plan designの直和」へ再構成する必要がある。

##### 修正先の判断

- **診断levelへの遡及**: 提案2はroadmapを「複数loopのorchestration」とだけ捉え、roadmap作成時にもphase scope、DoD、依存、親designの再検証という設計feedback loopが生じることを弱く扱っていた。steeringがroadmapを設計すると、tasklistで解消したものと同型のroadmap→design差し戻しがskill境界に残る。

##### 三案比較

| model | task-design | steering | 強み | 主なcost |
| --- | --- | --- | --- | --- |
| A: tasklistだけtask-design | design + tasklist、`split_required`返却 | roadmap設計 + 子orchestration | tasklist feedbackが局所化し、steeringの既存roadmap責務を維持 | task-designが候補phaseを返した後にsteeringがroadmapを再設計し、roadmap reviewからdesignへの越境が残る |
| B: tasklistとroadmapをsteering | design + scope判定 | tasklist/roadmap設計 + orchestration | 計画fileのownerが一つ | tasklist/roadmapの両reviewからdesignへの越境が通常flowになり、standalone task-designが実行計画を完成できない |
| C: tasklistとroadmapをtask-design | design + `tasklist \| roadmap`の構造設計 | 実行先binding + status + 子orchestration | designと全実行計画の収束loopが一つに閉じ、standaloneでも計画構造まで完成 | task-designの責務が広がり、roadmap file内の構造fieldと運用fieldのwriter境界が必要 |

##### 根本原因3 + 提案3

- **根本原因3**: roadmapを「steeringが実行するもの」であることから「steeringが設計するもの」とみなし、設計時ownershipと実行時ownershipを分けていなかった。tasklistもtask-designが構造を設計しtasklist-executorがcheckboxを更新するため、roadmapもtask-designが構造を設計しsteeringがbindingとstatusを更新する対称なlifecycleにできる。
- **変更点**: 提案2の`split_required`をsteeringがroadmapへ再設計する境界を廃止する。task-designが`tasklist.md`または`roadmap.md`を合意まで設計し、`tasklist_ready`または`roadmap_ready`を返す。steeringはroadmapの構造を再設計せず、子steeringを割り当てて再帰的に実行する。
- **提案3（推奨）**:
  - 総論: task-designは一つの親designに対応する実行計画を直和として所有する。leafなら`tasklist.md`、compositeなら`roadmap.md`を作り、どちらもdesignとのfeedback loopをtask-design内で合意まで閉じる。steeringはtask-designの親callerとしてplan resultをdispatchし、roadmapなら各phaseを子steeringへbindingして再帰実行する。
  - 各論:
    - ルール: task-designの結果を`tasklist_ready`と`roadmap_ready`の排他的な二系統にする。同じworking directoryで`tasklist.md`と`roadmap.md`を同時に正本として持たない。
    - ルール: `tasklist_ready`は`working_dir`、`design_path`、`tasklist_path`を返す。`roadmap_ready`は`working_dir`、`design_path`、`roadmap_path`を返す。双方ともdesignと対応planのユーザー合意、未解消feedbackなしを完了条件とする。
    - ルール: leaf/compositeの意味基準は提案0・2を維持する。一つの完成状態と一つの設計・完了承認loopならphaseが多くてもtasklist、独立した完成状態または別々のdesign loopが二つ以上必要ならroadmapとする。file数、task数、agent能力では決めない。
    - ルール: tasklist phaseの正本を`task-design/tasklist-design.md`、roadmap phaseの正本を`task-design/roadmap-design.md`とし、いずれも`SKILL.md`から長さのために分割したtask-design本体の構成fileとする。templateも`task-design/templates/tasklist.md`と`task-design/templates/roadmap.md`へ置く。
    - ルール: task-designはroadmapの構造fieldである全体目的、phase identity、各phaseの目的・scope・scope外・DoD・依存関係、親designとの対応を作成・reviewする。roadmapの構造変更feedbackはtask-designが同じdesign loopへ戻して再合意する。
    - ルール: steeringはroadmapの運用fieldである各phaseの子steering path、未着手・進行中・完了status、完了日だけを更新する。目的、scope、DoD、依存を変更する必要が出た場合は直接編集せず、同じworking directoryでtask-designを`create_working_dir=false`として再開する。
    - ルール: roadmap合意時点では子steering pathを未割当としてよい。`roadmap_ready`を受けたsteeringが依存順に子steering directoryを作り、対応するphaseの運用fieldへbindingする。未割当は設計TBDではなく、実行開始前のruntime stateとして区別する。
    - ルール: 子steeringはtask-designへ`working_dir_parent=<子steering directory>`、`create_working_dir=false`、`parent_roadmap_path`、`parent_phase_id`、親`design.md`、依存するphaseの確定結果を渡す。子task-designは上位制約と親phase identityを自分の`design.md`へ記録する。
    - ルール: 子task-designも排他的にtasklistまたはroadmapを返せる。子がroadmapを返した場合、その子steeringが新しいcomposite nodeのorchestratorとなる。親roadmapのphaseは子steering全体と対応し、子steering内のtask-design成果物がtasklistかroadmapかを直接参照して分岐しない。
    - ルール: 親子対応は`親roadmap phase -> 子steering -> 子task-design working directory`とする。steering経由では子steering directoryと子task-design working directoryが同一なので、追加pointer fileを作らない。子designに親roadmap pathとphase identityを残し、双方向に追跡可能にする。
    - ルール: 再帰を収束させるため、roadmapは二つ以上の子scopeを持ち、各子scopeは親scopeより厳密に狭く、全子の完了で親DoDを満たし、依存関係はcycleを持たないことを自己レビューする。一つだけの子、親と同一scopeの子、phase数が多いだけのroadmapを禁止する。
    - ルール: leaf完了はtasklist-executorがtasklist checkboxを完了してsteeringへ返す。composite完了はsteeringが全子steeringの完了を確認してroadmap statusを一段上へ伝播する。tasklistとtasklist-executorはroadmapを編集しない。
    - ルール: standalone task-designもtasklistまたはroadmapの構造を合意まで作れる。roadmapの場合は子実行先を未割当のまま`roadmap_ready`を返す。後からsteeringがこの外部roadmapをどう引き継ぐかはstandalone handoffの下位論点で確定する。
    - 適用例: root steeringがtask-designからroadmapを受け取ると、phase 1を子steering Aへbindingする。Aは同じdirectoryをworking directoryとしてtask-designを起動し、親roadmapのphase 1を上位scopeとしてtasklistを作る。phase 2の子steering Bがさらにroadmapを返した場合、Bがそのnested roadmapの子steeringをorchestrateし、root roadmapはB全体をphase 2の実行単位として扱う。

##### 提案3を推奨する理由

- tasklist reviewだけでなくroadmapのphase分割reviewでも親designへ戻る可能性があり、両方をtask-designへ置くと設計収束loopの境界が一貫する。
- 提案Aではtask-designが分割理由と候補phaseを作った直後、steeringがほぼ同じ内容をroadmapとして再設計する。提案3はこのhandoffと二重reviewをなくす。
- steeringは「何を作るか」から「合意済みplanをどの子へ割り当て、どこまで完了したか」へ責務を絞れる。親子treeのruntime ownershipが明確になる。
- tasklistがtask-design、roadmapがsteeringという非対称性を解消しつつ、tasklistとroadmapの形式差は別の分割fileで維持できる。

##### 提案3のriskと成立条件

- **field ownership**: roadmap構造をtask-design、binding/statusをsteeringが更新する規則が曖昧だと同じfileの競合が起きる。templateでfieldを明確に区分し、構造変更時はtask-design再開を必須にする。
- **task-design肥大化**: roadmap設計を`roadmap-design.md`へ分割し、SKILL.mdにはresult dispatchと共通completion gateだけを置く。
- **無限分割**: strict subset、二つ以上の子、DAG、親DoD coverをroadmap自己レビューgateにする。
- **standalone handoff**: 外部directoryのroadmapをsteeringが採用する方法は未決であり、提案3合意後に独立して設計する。

**決定:** 提案3のmodel Cを採用する。task-designが`tasklist | roadmap`の構造設計を所有し、steeringがroadmapの子steering binding、実行status、再帰実行を所有する。standalone roadmapからsteeringへのhandoffは、このdecisionを変えず独立論点で解消する。

**ネクストアクション:** `design.md`のD1とD3をexecution planの直和modelへ更新し、D4に親子binding・field ownership・再帰収束条件を反映済み。standalone roadmapをsteeringへ引き継ぐ方法を論点5で解消する。

## 論点5: standalone roadmapをsteeringへ昇格する方法

**ステータス:** 決定

**親論点:** 論点4

**種別:** TBDヒアリング

**提起の背景:** standalone task-designはdefaultの`create_working_dir=true`でcurrent working directory配下に自己完結したbundleを作れる。model Cではそのbundleが`roadmap_ready`になり得るが、steeringのcanonical directoryは`.steering/YYYY/YYYYMM/YYYYMMDD-slug/`である。外部bundleをそのまま参照するとsteering rootと設計正本が分離し、copyすると正本が二つになる。

### 現在の合意対象

**参照する現在案:** 根本原因0 + 提案0

**今回確認すること:** standalone bundle全体をユーザーの明示承認後にcanonicalなsteering directoryへ一度だけ移動し、そのdirectoryをsteeringとtask-designの共通working directoryへ昇格する提案0を採用するか。採用すると相対参照とsingle sourceを維持し、外部pointerやmanifestを追加せずmodel Cの通常flowへ合流できる。

### 議論の変遷

#### 事象の記述

- standalone task-designのworking directoryは`.steering/`配下とは限らない。
- `roadmap_ready`を実行するsteeringは、親roadmap、子steering binding、statusをcanonicalなsteering nodeとして管理する必要がある。
- 外部roadmap pathをsteering rootから参照すると、summary、再開、親子追跡が二つのrootへ分かれる。
- bundleをcopyすると元とcopyのどちらがdesign・roadmapの正本か判別できなくなる。

#### 原因の追跡

- なぜ: standaloneの成果物identityとsteeringのnode identityが別々に作られた後で、同じplan lifecycleへ合流する。
- なぜ: standaloneからorchestratorへ昇格する稀なtransitionを、通常の新規steering作成や既存directory再開のどちらにも定義していない。
- なぜ: pathを保存する方法だけを考えると、同じbundleをcanonical locationへ昇格してidentityを一本化する選択肢が抜ける。

#### 根本原因0 + 提案0

- **根本原因0**: roadmapを引き継ぐための情報が不足しているのではなく、同一bundleにstandalone working directoryとsteering nodeという二つのidentityを同時に与えようとしている。pointerやcopyではなく、identityをcanonical steering directoryへ一度だけ昇格すればよい。
- **提案0（現時点）**:
  - 総論: steeringにstandalone task-design bundleを明示的に採用する入力を設ける。sourceとdestinationをread-onlyに検証してユーザーへ示し、承認後にbundle directory全体をcanonical `.steering/` pathへ移動する。移動後のpathだけを正本としてmodel Cのroadmap orchestrationを開始する。
  - 各論:
    - ルール: steeringの任意入力として`adopt_task_design_working_dir=<absolute path>`を設ける。この入力がない通常起動は従来どおり新しいsteering directoryを作る。
    - ルール: 採用対象は同じrepository内にあり、`design.md`、`task-design-discussion.md`、排他的な`roadmap.md`を持つ`roadmap_ready`相当の自己完結bundleに限定する。`tasklist.md`との併存、未解消TBD、未合意roadmapがある場合は昇格しない。
    - ルール: source basenameはstandalone task-designが`name-work-directory`で確定した`YYYYMMDD-slug`を維持する。日付から`.steering/YYYY/YYYYMM/<basename>/`をdestinationとして解決し、新しいslugやsuffixを生成しない。
    - ルール: 移動前にsourceとdestinationの絶対path、destination不存在、sourceがrepository rootや`.steering` root等の広いdirectoryでないこと、bundle内部の必須file、Git状態をread-onlyで確認する。destinationが存在する場合はmerge、overwrite、suffix追加をせず停止する。
    - ルール: directory移動はpathが変わる操作なので、sourceとdestinationを示してユーザーの明示承認を得てから実行する。承認がなければsourceを変更せず、standalone roadmapのまま終了する。
    - ルール: `design.md`、`roadmap.md`、`task-design-discussion.md`、必要時の`requirements.md`、`investigation.md`、`spike/`をdirectory単位で一緒に移す。file単位のcopyや一部移動をしない。
    - ルール: bundle内部の相互参照は`./design.md`等の相対pathに限定し、移動前に確認する。移動後は返却済みの旧絶対pathを無効とし、新しい`working_dir`、`design_path`、`roadmap_path`をsteeringが返す。
    - ルール: 移動後のdirectory自体をsteering directoryかつtask-design working directoryとして扱う。`steering.json`、sourceへのback reference、copy元を示すpointer fileを作らない。
    - ルール: steeringは合意済みroadmapの構造を変更せず、未割当の運用fieldへ子steeringをbindingしてmodel Cの通常flowを再開する。構造変更が必要なら移動後の同directoryでtask-designを`create_working_dir=false`として再開する。
    - ルール: sourceがrepository外、別filesystem、または安全にdirectory単位で移動できない場合は自動copy/deleteへfallbackしない。standaloneのまま維持し、別途ユーザーが配置を決めるまで停止する。
    - 適用例: repository rootの`20260802-redesign-auth-flow/`がroadmap_readyなら、明示承認後に`.steering/2026/202608/20260802-redesign-auth-flow/`へbundle全体を移し、そのroadmapへ子steering pathを割り当てる。

##### 代替案と棄却理由

- **外部roadmapを参照するだけ**: steering nodeと設計正本が別rootになり、再開・summary・親子追跡にpointerが必要になるため棄却する。
- **新しいsteering directoryへcopyする**: 元bundleとcopyの二つの正本が残り、以後のfeedback反映先が曖昧になるため棄却する。
- **standalone directoryを場所に関係なくsteering rootとして扱う**: `.steering`の月次summaryとnode列挙規約から外れるため棄却する。
- **task-designがroadmap判定時に自動でsteeringを起動・移動する**: standaloneという起動scopeを越え、path変更を無承認で行うため棄却する。

##### 検証

- **観点**: 正本を一つに保てるか、相対参照が壊れないか、暗黙のmoveやoverwriteを防げるか、通常のsteering flowへ追加pointerなしで合流できるかを確認した。
- **弱点**: 明示的なdirectory移動が必要で、元のpathを外部から参照している場合は壊れる。そのため自動では行わず、source/destinationとpath変更を提示して承認を必須にする。外部参照を維持したい場合は昇格せずstandaloneのまま残す。

**決定:** 提案0を採用する。standaloneの`roadmap_ready` bundleは、sourceとcanonical destinationを検証・提示してユーザーの明示承認を得た後だけ、directory単位で`.steering/YYYY/YYYYMM/`へ移動して昇格する。copy、外部pointer、`steering.json`、無承認の自動移動は行わない。

**ネクストアクション:** `design.md`のD5へ反映済み。repository内のconsumerとvalidatorを確認してD6へ変更対象を確定し、Design全体reviewへ進む。
