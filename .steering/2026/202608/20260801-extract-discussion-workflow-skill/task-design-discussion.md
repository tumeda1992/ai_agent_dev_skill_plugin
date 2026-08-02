# Task Design Discussion

## 論点1: 議論 workflow の正本と consumer の責務境界

**ステータス:** 分解済み

**役割:** 親論点

**種別:** 認識齟齬、レビュー指摘

**提起の背景:** `task-design`、`steering` の通常議論、実装後レビューが、それぞれ議論の進め方・保存先・template を所有している。特に実装後レビューは、フィードバック原文の保存、認識合わせ、設計、タスク整理を一つのファイルへまとめたが、後半二つが使われず、議論記録と後続成果物の責務が混在した。一方、単に共通 template だけを切り出しても、記録タイミングや既存ファイルへの追記規則が consumer 側に重複したまま残る。

### 合意対象として提示した全体案

この論点でユーザーへ確認した対象は、次の全体構造である。

- 新 skill の名前を `facilitate-discussion` とし、単なる記録ではなく、論点の開始、提案、検証、再診断、決定、永続化までの議論 process を所有させる。
- consumer は議論の起動条件、議論へ渡す文脈、決定後の適用先・適用方法を所有する。適用先は `design.md` や `tasklist.md` に限定しない。
- 議論 directory が caller から渡されなければユーザーへ確認する。file 名は `discussion.md` をdefaultとし、指定された場合はそのbasenameを使う。同名fileが存在すれば既存内容を保持して追記する。
- 独立した `フィードバック収集` sectionと`FB-N`は廃止する。review起点の最上位論点では `起点となった原文` を保持し、1件のfeedbackから複数の決定が生じる場合だけ親子論点へ分解する。
- `task-design` は `task-design-discussion.md`、`steering` の通常議論は `discussion.md`、実装後reviewは `implementation_review.md` を使用するが、すべて同じ論点形式と議論processを使う。
- 旧template pathは互換用に残さず削除し、新skillのtemplateを唯一の正本にする。

この全体案を一括して一つの決定にするのではなく、以下の子論点へ分解して合意・未決を管理する。

### 分割前の議論の変遷（履歴として保持）

#### 事象の記述

- `task-design/templates/discussion_entry.md` と `steering/templates/discussion_entry.md` は、`ネクストアクション` の例を除いて同じ論点形式を重複保持している。
- `steering/templates/implementation_review.md` は `1. フィードバック収集`、`2. 認識合わせ`、`3. 設計`、`4. タスク整理` の独自形式を持つが、設計とタスク整理は既存の `design.md` と `tasklist.md` に正本があり、review file では空欄になりやすかった。
- ユーザーは、議論場所の directory を確認し、default の `discussion.md` または指定された file 名へ、既存内容を壊さず追記する再利用可能な skill を求めている。

#### 原因の追跡

- なぜ: 議論の形式を各 lifecycle の成果物名へ結び付け、共通する「論点を立て、提案を検証し、決定まで追跡する」process として定義していなかった。
- なぜ: フィードバック原文の保存、議論の進行、設計・tasklist への反映という異なる責務を、`implementation_review.md` という一つの容器へ集約した。
- なぜ: feedback と論点が一致しない場合の追跡を `FB-N` と `論点N` の二重採番で解いたため、通常の1:1ケースにも専用 section の記入負担が発生した。

#### 根本原因₀ + 提案₀

- **根本原因₀**: 議論 process の正本がなく、consumer 固有の file と後続成果物が process 定義を兼ねている。
- **提案₀**:
  - 総論: 議論の開始・反復・決定・永続化を独立 skill の責務にし、consumer は起動判断と決定後の成果物反映だけを担う。
  - 各論:
    - ルール: 新 skill は、議論 directory が入力されていなければユーザーへ確認し、file 名がなければ `discussion.md`、指定があれば指定名を使う。同名 file があれば最大の `論点N` を読み取り、次の番号で既存内容へ追記する。file 全体の置換や既存論点の再採番は行わない。
    - ルール: 新 skill は `task-design-discussion.md` の事象→原因→提案→検証形式を正本にし、提案時・feedback 受領時・決定時の記録タイミングも所有する。consumer 固有の design・tasklist 更新手順は持たない。
    - ルール: 1つの leaf 論点は1つの決定を扱う。1件の feedback が複数決定へ分かれるときは、原文を保存した親論点から子論点へ分解する。複数 feedback が1つの決定へ収束するときは、1論点の `提起内容（原文）` に複数項目を保持する。
    - ルール: 専用の `フィードバック収集` section と `FB-N` は廃止する。ただし `レビュー指摘` では論点内の `提起内容（原文）` を必須とし、原文の忠実性は失わない。通常の TBD や AI 自発論点ではこの field を省略できる。
    - 適用例: `task-design` は steering directory と `task-design-discussion.md` を渡し、決定後に `design.md` へ反映する。`steering` の通常議論は同じ directory と default の `discussion.md` を使う。実装後レビューは `implementation_review.md` を指定し、決定後の設計・追加タスクは `design.md` と既存 `tasklist.md` へ反映する。
    - 適用例: 実装後の一つの発言が「表示名」と「保存形式」の二つの決定を含む場合、親論点に発言原文を一度だけ保存し、二つの子論点を作る。各子論点は親番号を参照し、それぞれ一つの決定だけを扱う。

#### 暫定全体

- 新 skill 名の候補は `conduct-discussion` とする。単なる記録ではなく、議論 process を進行する責務を表す。
- 入力は `discussion_directory` と任意の `discussion_file_name`。呼び出し元から directory が渡された場合は聞き直さず、直接起動で未指定の場合だけユーザーへ確認する。
- 新 skill は `SKILL.md`、`agents/openai.yaml`、一つの共通 `templates/discussion_entry.md` を持ち、実行 script は持たない。
- 既存の task-design と steering の重複 `discussion_entry.md`、独自 `implementation_review.md` template は正本から外し、consumer の `SKILL.md` は新 skill の呼び出し契約だけを残す。
- `scripts/verification/validate-plugin.mjs` は新しい正本 path、default file 名、指定 file 名、append、論点連番、親論点、review 原文 field を検証し、削除した template path への依存を除く。
- template path の削除と実装後 review 契約の変更を含むため、配布 version は破壊的変更として `2.0.0` から `3.0.0` へ上げる案とする。

##### 検証

- **観点**: 共通 template だけを切り出す案、議論 file writer に限定する案、議論 process 全体を切り出す案を比較した。
- **弱点**: `conduct-discussion` が広すぎると、あらゆる会話で暗黙起動して directory を尋ねる可能性がある。また親論点を許すと、1論点1決定の単純さが崩れるおそれがある。

##### 修正先の判断

- **提案レベル**: 新 skill は caller からの明示委譲または永続化を伴う議論の明示依頼に限定して起動する。親論点は複数の leaf 論点へ分解する必要がある場合だけ作り、`分解済み` と子論点参照を記録する。leaf 論点の1決定原則は維持する。

#### イテレーション1

##### 検証

- **観点**: 独立した設計レビューは、共通 template ではなく議論 process 全体を切り出す責務境界と、専用 `フィードバック収集` section を論点内の原文 field へ置き換える案を支持した。
- **弱点**: 親子関係は決定の分解・依存関係を表すだけであり、原文の忠実性を単独では担保しない。また、legacy の `implementation_review.md` は `### 論点N` を持つため、新 skill が `## 論点N` だけを走査すると連番が衝突する。template path を即時削除する場合の version は、後方互換な新 skill 追加だけの場合と分けて判定する必要がある。

##### 修正先の判断

- **提案レベル**: 原文保存、legacy file の継続、skill 名、directory と version の責務を具体化する。議論 workflow の正本を切り出す根本診断は維持する。

##### 根本原因1 + 提案1

- **根本原因1**: 提案₀では、親子関係による論点追跡と原文保持の役割差、legacy file への forward-only migration、配布互換性の条件を十分に分離していなかった。
- **変更点**: 新 skill 名を `facilitate-discussion` へ改める。review の最上位論点では `起点となった原文` を必須にし、親子関係は1 feedbackから複数の決定へ分解するときだけ使う。既存 directory の用意は consumer の責務とし、新 skill は未指定なら確認、指定済みなら存在を検証する。連番は `##` と legacy の `###` の両方から最大値を得る。旧 template を削除するか互換用に残すかと配布 version は、構造合意後の独立論点で決める。
- **提案1（現時点）**:
  - 総論: `facilitate-discussion` を議論 process と記録形式の唯一の正本にし、consumer 固有の成果物管理を混ぜない。
  - 各論:
    - ルール: `discussion_directory` が caller から渡されなければユーザーへ確認し、渡されていれば聞き直さない。directory は推測作成せず、consumer が用意する。
    - ルール: `discussion_file_name` は任意の basename とし、default は `discussion.md`。既存 file は再構成せず、最大の論点番号に1を足して canonical な論点形式を追記する。同じ file は single writer とする。
    - ルール: review 起点の最上位論点はユーザーの原文をそのまま保持する。1 feedbackから複数決定へ分かれる場合は、実質的な分解决定を持つ親論点を作り、子論点は同じ file 内の親を一つだけ参照する。leaf 論点は1決定を維持する。
    - 適用例: legacy `implementation_review.md` に `### 論点1` があれば、既存の4部構成を変更せず、file末尾へ `## 論点2` を新形式で追記する。

#### イテレーション2

##### 検証

- **観点**: ユーザーは全体構造を基本的に承認したうえで、consumer の反映先を `design.md` / `tasklist.md` に固定してはならないと指摘した。また、独立レビューが示した入力一覧は、skill 起動時の入力と論点ごとの lifecycle state が混在していて理解できないと指摘した。旧 template path は互換用に残さず削除する破壊的変更でよいと明示した。
- **弱点**: 提案1の適用例を一般契約のように表現したため、新 skill が特定成果物を前提に見える。さらに `operation`、`topic_id` 等を入力とする案は、対話中に skill が判断・管理すべき内部状態を caller の指定責務へ押し戻す。

##### 修正先の判断

- **提案レベル**: consumer の責務を「決定後の適用」に一般化し、具体的な反映先は consumer ごとの例へ下げる。入力契約は別の論点へ分離し、skill 起動時の引数と内部 lifecycle state を混ぜない。

##### 根本原因2 + 提案2

- **根本原因2**: 既存 consumer の具体例を再利用可能な責務境界へ抽象化し切れていなかった。また、自然言語で継続する skill を関数 API のように捉え、内部の状態遷移まで公開入力へ列挙した。
- **変更点**: consumer が所有するのは、起動条件、議論へ渡す文脈、決定後の適用先と適用方法とする。適用先は `design.md` / `tasklist.md` に限定しない。`operation`、`topic_id`、`parent_topic`、`source_verbatim` は skill 起動時の入力候補から外す。旧 template path は削除し、破壊的変更として扱う。
- **提案2（現時点）**:
  - 総論: `facilitate-discussion` は議論 process と永続化だけを所有し、議論結果をどこへどう適用するかは各 consumer が所有する。
  - 各論:
    - ルール: consumer は議論の起動条件、議論対象の文脈、決定後の適用先・適用方法を定める。新 skill は特定の成果物名を前提にしない。
    - ルール: `task-design` が `design.md` へ反映することや `steering` が `tasklist.md` へ反映することは consumer 固有の適用例であり、新 skill の出力契約ではない。
    - ルール: 旧 `task-design/templates/discussion_entry.md`、`steering/templates/discussion_entry.md`、`steering/templates/implementation_review.md` は互換用に残さず削除し、新 skill の template を唯一の正本にする。
    - 適用例: 将来 README 改善の議論へ新 skill を使う consumer は、決定を README へ適用できる。新 skill 側に README 固有の手順は追加しない。

**決定:** 論点1は全体構造を示す親論点とし、責務境界、入力契約、feedback追跡、旧template削除、合意対象の永続化、iterationのroutingを論点2〜7へ分解する。分割前の記録は、当初複数論点を混在させた事実を失わないため履歴として保持する。

**ネクストアクション:** `design.md` に責務境界、feedback 追跡、consumer 連携、旧 template 削除方針を記録し、skill 起動時の入力と内部 lifecycle state を論点2で分離する。

## 論点2: skill 起動時の入力と論点 lifecycle state の分離

**ステータス:** 決定

**親論点:** 論点1

**種別:** 認識齟齬、レビュー指摘

**起点となった原文:**

> 入力について、新情報が多いのに説明が無いからよくわからない。operationが何を表すのか、topic_idはどういうときに使うのか

> というか、skillとしての入力と、論点1つ1つのin/outが混ざってるのか？

**提起の背景:** 独立レビューでは `discussion_dir`、`filename` と並べて `operation`、`topic_id`、`parent_topic`、`source_verbatim` を入力として列挙した。しかし、前二つはskillを開始するときにcallerまたはユーザーが与える設定であり、後四つは進行中の会話と議論fileからskill自身が判断する状態である。異なる層を一つの入力一覧にしたため、誰がいつ値を決めるのかが不明になった。

### 現在の合意対象

skill起動時の明示設定は、次の二つだけにする。

- `discussion_directory`: callerから渡されていれば使用し、未指定ならユーザーへ具体的なdirectory pathを確認する。
- `discussion_file_name`: 任意のbasename。未指定なら `discussion.md` を使う。

議論対象とconsumer固有の制約は、現在の会話またはcallerから渡された自然言語の文脈として扱い、固定fieldを増やさない。`open` / `iterate` / `decide` / `reopen`、現在の `論点N`、`親論点`、`起点となった原文` は、skillが会話とfileから判断・管理する内部状態であり、skill起動時の入力にはしない。

skillの成果は、更新されたdiscussion fileと、チャット上で合意された決定・ネクストアクションとする。consumerが機械的にparseする固定result schemaは設けない。

### 今回確認すること

今回の確認対象は、次の境界だけである。

1. skill起動時の明示設定を `discussion_directory` と任意の `discussion_file_name` に限定する。
2. 議論内容は自然言語の文脈として受け取り、論点の状態遷移とentry fieldはskillが内部管理する。
3. 成果をdiscussion fileと合意内容にし、固定result schemaを設けない。

既存fileへの追記方法、論点番号の割り当て、親子参照の整合性は、この確認には含めず後続論点で決める。

### 議論の変遷

#### 事象の記述

- `operation` が `open` / `iterate` / `decide` / `reopen` のどれを表すかは説明されたが、ユーザーまたはconsumerが明示指定する理由は示されなかった。
- `topic_id` は既存論点を更新する識別子として提案されたが、現在議論中の論点や「論点3について」という自然言語から解決できる場合との使い分けがなかった。
- 論点formatのfieldである `parent_topic` と `source_verbatim` まで、skill起動時の引数と同列に置かれた。

#### 原因の追跡

- なぜ: 議論 skill を継続的な対話規則ではなく、一回ごとに呼び出す command API のように設計した。
- なぜ: file選択のためにcallerが与える値と、議論を進めながらskillが管理する状態を区別しなかった。
- なぜ: consumer へ返す情報を明確にしたい意図から、内部状態まで公開 input/output schema に持ち上げた。

#### 根本原因₀ + 提案₀

- **根本原因₀**: skill の境界を「起動時の設定」「会話から得る議論内容」「skillが管理する内部状態」「終了時にconsumerへ返す結果」の四層に分解していなかった。
- **提案₀**:
  - 総論: skill 起動時の明示入力を保存先の指定だけに絞り、論点 lifecycle はskillが会話とfileから判断する内部状態にする。
  - 各論:
    - ルール: skill 起動時に扱う設定は `discussion_directory` と任意の `discussion_file_name` だけとする。directory が渡されなければユーザーへ確認し、file名がなければ `discussion.md` を使う。
    - ルール: 議論対象とcaller固有の制約は現在の会話またはcallerから渡された自然言語の文脈として受け取る。固定fieldを増やさない。
    - ルール: `open` / `iterate` / `decide` / `reopen` は公開 `operation` input にせず、現在の論点状態とユーザー応答からskillが選ぶ内部動作とする。
    - ルール: `論点N` 自体を識別子とし、別の `topic_id` inputは作らない。ユーザーが論点番号を明示したときはその参照を使い、明示がなければ現在議論中の論点を使う。複数候補があり曖昧な場合だけ確認する。
    - ルール: `親論点` と `起点となった原文` はskillが必要性を判断してdiscussion entryへ記録するfieldであり、skill起動時のinputではない。
    - ルール: skillの成果は、更新されたdiscussion fileと、チャット上で合意された決定・ネクストアクションである。固定の機械向け返却schemaは設けない。consumerはその決定を自身の規則で適用する。
    - 適用例: `task-design` が `discussion_directory=<working_dir>` と `discussion_file_name=task-design-discussion.md` を与えて新 skill を適用する。ユーザーが提案へ修正意見を返したら、新 skill が自ら `iterate` 相当と判断して現在の論点へ追記し、consumerは `operation=iterate` を渡さない。

##### 検証

- **観点**: 明示inputを2つへ絞れば、callerが議論の状態機械を操作せずに済み、直接起動とconsumer経由起動で同じ契約を使える。
- **弱点**: 将来、新 skill を会話継続ではなく独立child agentとして機械的に呼ぶ場合は、完了状態を返すresult契約が別途必要になる。ただし現在の用途では同じagentがskillを適用して対話を継続するため、先回りして公開schemaを持たせる必要はない。

**決定:** skill起動時の明示設定は `discussion_directory` と任意の `discussion_file_name` だけにする。議論内容は自然言語の文脈として受け取り、論点の状態遷移とentry fieldはskillが内部管理する。成果は更新されたdiscussion fileと合意内容であり、固定result schemaは設けない。

**ネクストアクション:** `design.md` のD7へ反映し、論点9で対象fileの解決規則を決める。

## 論点3: consumer が所有する決定適用の範囲

**ステータス:** 決定

**親論点:** 論点1

**種別:** 認識齟齬、レビュー指摘

**起点となった原文:**

> これは使う側によるから毎回 design.md / tasklist.md かは限らない。

**提起の背景:** 初期案はconsumerの責務を `design.md` / `tasklist.md` への反映として説明した。これは現在の二つのconsumerには当てはまるが、再利用可能なskillの契約としては具体例を一般則へ持ち上げていた。

### 議論の変遷

#### 事象の記述

- `task-design` は決定を `design.md` へ反映し、`steering` は状況により `design.md` や `tasklist.md` へ反映する。
- 将来別のconsumerが使う場合、決定の適用先はREADME、skill、設定、またはチャット上の結論だけになる可能性がある。

#### 原因の追跡

- なぜ: 現在のconsumerの適用例を、新skillの固定出力契約として表現した。
- なぜ: 新skillが返す「決定」と、consumerが行う「決定の適用」を分離していなかった。

#### 根本原因₀ + 提案₀

- **根本原因₀**: consumer固有の成果物名が、再利用可能な責務境界へ漏れていた。
- **提案₀**:
  - 総論: consumerは決定後の適用先と適用方法を所有し、新skillは適用先を限定しない。
  - 各論:
    - ルール: 新skillは、合意された決定とネクストアクションをdiscussion fileとチャットに残してconsumerへ制御を返す。
    - 適用例: `task-design` は決定を `design.md` へ反映するが、README改善consumerはREADMEへ反映できる。

**決定:** consumerは議論の起動条件、渡す文脈、決定後の適用先・適用方法を所有する。適用先を特定のfileやworkflowへ限定しない。

**ネクストアクション:** `design.md` のD1へ反映済み。

## 論点4: feedback原文と複数論点の対応方法

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング、レビュー指摘

**提起の背景:** `implementation_review.md` の独立した `フィードバック収集` sectionは、feedbackと論点が1対1でない場合の追跡に役立つ一方、通常の1対1ケースでも`FB-N`と`論点N`を二重管理させていた。

### 議論の変遷

#### 事象の記述

- ユーザーは専用sectionの効果に疑問を持ちつつ、原文と派生論点の対応を失う危険も認識していた。
- 独立レビューは、原文保持と親子関係は別の役割であり、親子関係だけでは原文の忠実性を担保できないと指摘した。

#### 原因の追跡

- なぜ: 原文保存と対応関係の表現を、一つの `フィードバック収集` sectionへまとめていた。
- なぜ: feedbackと論点に別々の識別子を付ける以外の対応方法を持っていなかった。

#### 根本原因₀ + 提案₀

- **根本原因₀**: 原文の忠実性と、決定を分解する論点構造を別々に設計していなかった。
- **提案₀**:
  - 総論: 原文は論点内に保持し、複数の決定へ分かれる場合だけ親子論点を使う。
  - 各論:
    - ルール: review起点の最上位論点では `起点となった原文` を必須にする。
    - ルール: 1 feedbackから複数決定へ分かれる場合は、原文と実質的な分解决定を持つ親論点を作る。
    - 適用例: 「保存後もmodalが閉じず通知も出ない」という原文を親に保存し、modal終了条件と通知timingを別の子論点にする。

**決定:** 独立した `フィードバック収集` sectionと`FB-N`は廃止する。review原文は論点内に保持し、必要時だけ親子論点へ分解する。

**ネクストアクション:** `design.md` のD2へ反映済み。

## 論点5: 旧template pathの互換性

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**起点となった原文:**

> 旧pathも消す破壊的な変更で問題ない

**提起の背景:** 新skillのtemplateを唯一の正本にする際、旧pathを一定期間残す後方互換案と、即時削除して重複を完全に解消する案が残っていた。

### 議論の変遷

#### 事象の記述

- 旧pathを残せば既存参照は壊れないが、同じformatの複数正本が残る。
- 即時削除すればconsumerとvalidatorを一度に新pathへ移行する必要がある。

#### 原因の追跡

- なぜ: templateを切り出す目的と、公開済みpathの互換性が競合した。
- なぜ: 互換性を優先するか、正本の一元化を優先するかは利用者の配布方針に依存する。

#### 根本原因₀ + 提案₀

- **根本原因₀**: 破壊的変更を許容するかが未決だった。
- **提案₀**:
  - 総論: 旧pathを削除し、新skillのtemplateだけを残す。
  - 各論:
    - ルール: 旧templateをcompatibility stubとして残さない。
    - 適用例: `task-design`と`steering`は新skillを参照し、旧template pathを読まない。

**決定:** 旧template pathは互換用に残さず削除し、配布versionは破壊的変更として扱う。

**ネクストアクション:** `design.md` のD4へ反映済み。具体的なversion値は配布規約に従って別途確定する。

## 論点6: チャットだけにある合意対象の永続化

**ステータス:** 決定

**親論点:** 論点8

**種別:** 認識齟齬、レビュー指摘

**起点となった原文:**

> 私との対話記録のフロー情報だけがファイルに追記されているけど、あなたが「大枠はこれでいいですか？」と提案したものがセッションにしか残っていなくて、ファイルだけ見た人はわからない（A）。

> Aについては、記録するときにセッションにしか書いていない内容を前提にしていたらきちんとdisscussionファイルに初見の人が見てもわかるように転記することが必要。

**提起の背景:** discussion fileには事象、原因、提案の差分、ユーザーfeedbackを記録していたが、チャットで最終的に何を一括して確認したかが同じ形で残っていなかった。そのため、チャットを見られない読者は「基本的にok」が何への合意か復元できない。

### 議論の変遷

#### 事象の記述

- チャットでは新skillの責務、保存先、feedback形式、consumer連携を箇条書きで提示し、「上記の責務境界と全体構造で合っていますか」と確認した。
- discussion fileには各要素の変遷はあったが、確認対象となった全体案を一つのself-containedなsnapshotとして特定できなかった。
- 次の確認でも「この『明示入力は保存先の2項目だけ』という契約」と指示語を使い、file内のどの提案を確認しているかを特定しなかった。

#### 原因の追跡

- なぜ: discussion fileを対話の差分logとして扱い、合意判定の対象物を保存するartifactとして扱わなかった。
- なぜ: チャットとfileを一緒に読める現在のsessionを前提にした。
- なぜ: `変更点`と「現在の完全な提案」を区別する記録規則がなかった。

#### 根本原因₀ + 提案₀

- **根本原因₀**: 合意を求める前に、何へ合意するかをdiscussion fileだけで再現できる形へ固定する規則がなかった。
- **提案₀**:
  - 総論: 確認依頼の前に、合意対象となる現在案をself-containedなsnapshotとしてdiscussion fileへ保存する。
  - 各論:
    - ルール: `変更点`には前案との差分を書き、`提案N（現時点）`には差分だけでなく、現在採用を求める案の全体を書く。
    - ルール: 提案の一部だけを確認する場合は `今回確認すること` を設け、決定対象と決定によって変わる範囲を具体的に書く。
    - ルール: チャットの確認文は「これ」「上記」「この契約」だけで済ませず、discussion file名、論点番号、提案番号または見出し、判断対象を明記する。
    - 適用例: 「`task-design-discussion.md` の論点2『現在の合意対象』に記載した、明示設定をdirectoryと任意file名の二つに限定する案で合意できますか」と問う。

**決定:** 合意を求める前に、現在の完全な提案と今回の判断対象をdiscussion fileへ保存する。確認文は初見の読者でも参照先と判断内容を特定できる具体的な表現にする。

**ネクストアクション:** 論点1へ全体案のsnapshotを、論点2へ現在の合意対象を追記済み。新skillのtemplateと手順へ同じ規則を反映する。

## 論点7: feedbackをiterationへ入れる前のrouting

**ステータス:** 決定

**親論点:** 論点8

**種別:** 認識齟齬、レビュー指摘

**起点となった原文:**

> 複数論点が混ざったことを論点1として扱って、全部ないまぜにして、イテレーションを行っている（B）。

> Bについては、イテレーションを回すときに、はたしてその論点かどうか振り返って吟味必要。特に親子関係を持てるようになったんだから

**提起の背景:** 論点1は責務境界、入力契約、feedback形式、consumer連携、template削除、versionを一つに含めた。feedbackを受けるたびに同じ論点へiterationを追加したため、一つの決定を追う単位ではなく、task全体の変更履歴になった。

### 議論の変遷

#### 事象の記述

- consumerの適用先に関する指摘と、inputの層が混在している指摘を、同じ論点1のイテレーション2へ追加した。
- その後inputだけを論点2へ分けたが、論点1には複数の独立した決定と履歴が残った。
- 親子論点を新形式へ導入する案を持ちながら、現在のdiscussion自身には適用しなかった。

#### 原因の追跡

- なぜ: 「現在の提案へのfeedbackなら現在の論点のiteration」と機械的に判断した。
- なぜ: iteration追加前に、そのfeedbackが同じ決定を修正するのか、別の決定を要求するのかを再分類しなかった。
- なぜ: 論点を会話topicのまとまりとして扱い、「一つの決定を追跡する単位」として扱わなかった。

#### 根本原因₀ + 提案₀

- **根本原因₀**: feedback受領時のrouting判定がなく、iterationがあらゆる変化のdefault保存先になっていた。
- **提案₀**:
  - 総論: iterationを追加する前に、feedbackが現在の論点と同じ決定を扱うかを判定し、異なれば子論点または独立論点へ分ける。
  - 各論:
    - ルール: 現在の論点が答えようとしている決定を一文で再確認する。
    - ルール: feedbackが同じ決定の原因・提案・検証を修正する場合だけ、同じ論点へiterationを追加する。
    - ルール: 現在の決定を成立させるための下位決定が生じた場合は子論点を作り、親論点を `子論点待ち` または `分解済み` にする。
    - ルール: 共通の親に依存しない別の決定が生じた場合は、同じ親を持つsiblingまたは独立論点を作る。
    - ルール: 複数の既存論点を規定する上位決定が後から見つかった場合は、新しい親論点を作り、既存論点から参照してよい。親番号が子番号より小さいことを必須にせず、循環参照だけを禁止する。
    - 適用例: 「consumerの適用先」と「skillのinput」は同じ全体案へのfeedbackでも別の決定なので、同一iterationではなく論点3と論点2へ分ける。

**決定:** feedbackを受けたらiteration追加前にdecision scopeを再確認する。同じ決定の修正だけをiterationとし、下位決定はchild、独立決定はsiblingまたは独立論点、後から判明した上位決定は新しいparentへroutingする。

**ネクストアクション:** 論点1を親論点へ変更し、既存の各決定とA/Bを論点2〜7へ分割済み。新skillの手順とtemplateへrouting判定を反映する。

## 論点8: 新skill完成前から議論guardrailを強制する場所

**ステータス:** 決定

**親論点:** 論点1

**種別:** 認識齟齬、レビュー指摘

**起点となった原文:**

> 論点6,7について、このsteeringだけで合意しただけで、今後のsteering、切り出された新skillでの議論では再発するだろ

**提起の背景:** 論点6・7は `design.md` の決定事項になったが、まだ `facilitate-discussion` は存在せず、現行の `think-through`、`task-design`、`steering` と各templateにも規則がない。今回の設計成果物を読まない次のsessionは、合意対象をチャットだけに置くことと、異なるdecision scopeのfeedbackを同じiterationへ入れることを再び行える。

### 却下された提案0

`facilitate-discussion` の本実装を待たず、次の現行正本へ論点6・7のguardrailを即時反映する。

1. `plugins/tumeda-dev/skills/think-through/SKILL.md`
   - feedbackを受けたら、iterationの前に同じdecision scopeかを再評価する。
   - 下位決定はchild、別決定はsiblingまたは独立論点、後から判明した上位決定はparentへroutingする。
   - 永続化先がある議論で合意を求める前に、現在案の全体と今回の判断対象をfileへ保存し、確認文から具体的に参照する。
2. `plugins/tumeda-dev/skills/task-design/SKILL.md`
   - Step 3のfeedback loopへrouting判定を追加する。
   - ユーザーへ構造・提案の合意を求める前に、`task-design-discussion.md`へself-containedな合意対象を保存する。
3. `plugins/tumeda-dev/skills/steering/SKILL.md`
   - 通常discussionとimplementation reviewのfeedback loopへ同じrouting判定を追加する。
   - review依頼前に、discussion fileへself-containedな合意対象と今回の判断内容を保存する。
4. 現行のdiscussion template群
   - `変更点`と完全な`提案N（現時点）`を区別し、`今回確認すること`を記録できる形にする。
   - `親論点`を記録できる形にする。

この変更は新skillの実装ではなく、実装完了までの移行期間にも同じ失敗を防ぐguardrailである。`facilitate-discussion` 実装時は規則の正本を新skillへ移し、consumerと旧templateから重複記述を削除する。

### 今回確認すること

今回の判断対象は、論点6・7を新skillのtasklistへ後回しにせず、上記4箇所へ現在の設計中に即時反映するかどうかである。新skill本体の作成、consumerの最終移行、旧template削除はまだ行わない。

### 議論の変遷

#### 事象の記述

- 論点6・7の決定を今回のsteering成果物に記録した。
- ユーザーは、その記録だけでは今後のsteeringや新skillで規則が自動適用されず、再発防止にならないと指摘した。

#### 原因の追跡

- なぜ: 設計で合意したことを、実行時に必ず読まれる正本へ反映する時期を定めなかった。
- なぜ: 新skill完成後の最終形だけを考え、完成まで現行skillが動き続ける移行期間を設計していなかった。
- なぜ: 「設計成果物に書いた」と「次回のagent行動を拘束した」を同一視した。

#### 根本原因₀ + 提案₀

- **根本原因₀**: 再発防止規則の最終正本は決めたが、移行期間にagentが読む暫定正本と適用時期を決めていなかった。
- **提案₀**:
  - 総論: 論点6・7を現行skillとtemplateへ即時反映し、新skill完成までのguardrailにする。
  - 各論:
    - ルール: 現在の実行経路が読む正本へ規則を置いてから、設計議論を続ける。
    - ルール: 新skillへの移行時は同じ規則を移し、暫定正本の重複を削除するtaskを必須にする。
    - 適用例: 次のtask-designがfeedbackを受けたとき、現在の `task-design/SKILL.md` によりiterationかchild論点かを先に判定する。

##### 検証

- **観点**: `design.md`だけに置く案、`think-through`だけへ置く案、実際に議論を実行する現行skillとtemplateへも置く案を比較した。
- **弱点**: 現行skillへ一時的に重複記述が入り、新skill移行時に削除漏れが起きる可能性がある。

##### 修正先の判断

- **提案レベル**: 重複は移行期間の明示的な暫定状態とし、最終tasklistに「新skillへ移した後、現行consumerと旧templateの重複を削除する」taskを置く。再発期間を残すより、削除対象が明示された短期重複を選ぶ。

#### イテレーション1

##### 検証

- **観点**: ユーザーは、論点6・7が `facilitate-discussion` に閉じる体験であり、`think-through` へ一般化する必要はないと指摘した。新skillの利用者が必ずそのskillを読むなら、新skillの中で強制すれば目的を満たす。
- **弱点**: 提案0は「次回も読まれる正本が必要」という診断から、再利用可能な規則は上位skillへ置くべきだと飛躍した。これにより、議論fileを持たない一般的な思考場面までdiscussion固有の永続化・routing規則で拘束し、責務境界を壊す。

##### 修正先の判断

- **診断レベルへの遡及**: 問題は移行期間の暫定正本不足ではなく、`design.md` のD5・D6を「新skillの完成条件」として明示せず、今回だけの合意に見える書き方をしたことにある。

##### 根本原因1 + 提案1

- **根本原因1**: 複数consumerで再利用するskill固有の体験と、全場面へ適用する思考原則を区別せず、再利用範囲を正本の配置階層と取り違えた。
- **変更点**: 現行 `think-through`、`task-design`、`steering`、旧templateへの暫定反映案をすべて撤回する。D5・D6を `facilitate-discussion` のMUSTな利用体験として明記し、新skillの `SKILL.md` とcanonical templateだけを正本にする。
- **提案1（現時点）**:
  - 総論: 合意対象のself-containedな保存とfeedback routingは、`facilitate-discussion` の体験として完結させる。
  - 各論:
    - ルール: `facilitate-discussion` は合意依頼前に現在案と判断対象をdiscussion fileへ保存し、具体的な参照を含む確認文を出す。
    - ルール: `facilitate-discussion` はfeedback受領時にdecision scopeを再評価し、iteration、child、sibling、parentへroutingする。
    - ルール: consumerは `facilitate-discussion` を適用するだけでこの体験を得る。A・Bの手順をconsumer側へ複製しない。
    - ルール: `think-through` は変更しない。新skill作成前の現行 `task-design`、`steering`、旧templateにも暫定変更を入れない。
    - 適用例: `steering` がimplementation reviewで `facilitate-discussion` を適用すると、新skill自身が原文保存、論点routing、合意対象保存を行い、`steering` は同じ規則を持たない。

**決定:** 論点6・7は `facilitate-discussion` のMUSTな利用体験として、新skillの `SKILL.md` とcanonical templateへ実装する。`think-through` とconsumerへ規則を重複配置せず、移行前の現行skill・旧templateにも暫定変更を入れない。

**ネクストアクション:** `design.md` のD5・D6を新skillの体験として明記する。tasklistでは新skillへD5・D6を実装した後、consumerを新skill利用へ切り替える。

## 論点9: 議論の正本となるfileの解決規則

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**起点となった原文:**

> 議論場所のディレクトリを聞いて、 discussion.mdがデフォルトだけど、指定された議論ファイル名があったらその名前の議論ファイルにして、既に同名のファイルがあったら、そこに追記していく形で

**提起の背景:** 論点2で `discussion_directory` と任意の `discussion_file_name` を明示設定として確定したが、directoryが未指定・存在しない場合、file名にpathが含まれる場合、新規fileと既存fileをどう扱うかは未決である。ここが曖昧だと、skillが推測した場所へfileを作る、consumerが指定したdirectory外へ書く、既存fileを上書きする可能性がある。

### 現在の合意対象

`facilitate-discussion` は、次の順序で議論fileを一意に解決する。

1. `discussion_directory` がcallerから渡されていれば、そのdirectoryを使う。渡されていなければ、議論を始める前にユーザーへ具体的なdirectory pathを確認する。
2. 指定されたdirectoryが存在するdirectoryであることを確認する。存在しない場合は推測して作らず、ユーザーまたはconsumerへ用意を求める。
3. `discussion_file_name` がなければ `discussion.md` を使う。指定されていれば、そのbasenameを変更せず使う。
4. `discussion_file_name` はbasenameだけを受け付ける。絶対path、`../`、path separatorを含む値は、directory指定との責務が混ざるため拒否して再指定を求める。
5. `<discussion_directory>/<discussion_file_name>` が存在しなければ新規作成する。存在すれば内容を保持して同じfileを継続利用する。

### 今回確認すること

今回の判断対象は、directoryをskillが作らず既存directoryに限定すること、file名をbasenameに限定すること、新規fileは作成し、既存fileは上書きせず継続利用することの3点である。

既存fileのどこへentryを追加するか、論点番号をどう決めるか、既存論点のstatusや決定を更新してよいかは、この論点には含めず後続論点で決める。

### 議論の変遷

#### 事象の記述

- ユーザーは議論場所のdirectoryを確認すること、default file名を `discussion.md` とすること、指定file名と既存同名fileを継続利用することを求めた。
- 初期設計ではcallerからdirectoryが渡された場合は聞き直さない案と、存在しないdirectoryを新skillが作らない案を加えた。

#### 原因の追跡

- なぜ: directoryとfile名の境界を定めないと、file名側から保存先を変更できる。
- なぜ: 新skillがdirectory作成まで担うと、議論processと作業場所管理の責務が混ざる。
- なぜ: 既存fileの扱いを明示しないと、新規template適用時に履歴を置換する危険がある。

#### 根本原因₀ + 提案₀

- **根本原因₀**: 保存先を指定する二つのinputは決めたが、安全に一つの正本fileへ解決するvalidationと責務境界を決めていなかった。
- **提案₀**:
  - 総論: 既存directoryとbasenameを組み合わせて対象fileを一意に決め、既存履歴を優先する。
  - 各論:
    - ルール: directory未指定時だけユーザーへ確認し、存在しないdirectoryは作成しない。
    - ルール: file名はbasenameに限定し、defaultまたは指定名をそのまま使う。
    - ルール: fileがなければ作成し、あれば同じfileを継続する。
    - 適用例: `discussion_directory=.steering/example`、file名未指定なら `.steering/example/discussion.md` を使う。`discussion_file_name=implementation_review.md` なら同じdirectoryの `implementation_review.md` を使う。

##### 検証

- **観点**: directoryもskillが作る案、file名に相対pathを許す案、directoryとbasenameを厳密に分ける案を比較した。
- **弱点**: 直接起動時にユーザーが新しいdirectoryを希望しても、別途directoryを作ってから再指定する一手間が増える。

##### 修正先の判断

- **提案レベル**: directory作成は新skillの責務外として維持する。議論の保存場所を誤るリスクより、存在しないdirectoryを明示的に用意する手間を選ぶ。

**決定:** directoryは既存directoryに限定し、未指定ならユーザーへ確認し、存在しなければ再指定を求める。file名はbasenameだけを受け付け、未指定なら `discussion.md` を使う。対象fileがなければ新規作成し、同名fileがあれば上書きせず継続利用する。

**ネクストアクション:** `design.md` のD8へ反映し、論点10で既存fileへの追記・局所更新規則を決める。

## 論点10: 既存discussion fileの履歴保持と局所更新

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**起点となった原文:**

> 既に同名のファイルがあったら、そこに追記していく形で

**提起の背景:** 論点9で既存同名fileを継続利用すると決めたが、「追記」をfile末尾へのappend-onlyと解釈すると、既存論点へfeedback、決定、再開を反映できない。一方、自由な書換えを許すと、過去の提案や却下理由を消して現在の結論だけに整理する危険がある。

### 現在の合意対象

`facilitate-discussion` の書込みモデルを、履歴保持を優先した局所更新とする。

1. 新しい論点はdiscussion fileの末尾へ追加する。
2. 同じdecision scopeへのfeedbackは、対象論点内へ新しいiterationとして追加する。既存iterationは書き換えない。
3. `ステータス`、末尾の `決定`、`ネクストアクション` は現在状態を示すfieldとして局所更新してよい。
4. 決定済み論点を再開・変更する場合は、以前の決定と変更理由を新しいiterationへ保存してから、現在の `決定` を更新する。
5. file全体の置換、既存論点の並べ替え、過去の提案・feedback・却下理由の削除、旧formatの一括整形は行わない。

### 今回確認すること

今回の判断対象は、「追記」を物理的なappend-onlyとはせず、過去の変遷を不変で保持しながら、現在状態を示すfieldだけ局所更新できる書込みモデルにすることである。

論点番号の採番、親子参照のvalidation、legacy formatから番号を読む方法は、この論点には含めず後続論点で決める。

### 議論の変遷

#### 事象の記述

- 新論点はfile末尾へ追加できるが、既存論点へのfeedbackは対象論点の履歴として読む必要がある。
- 現行formatは冒頭に `ステータス`、末尾に `決定` と `ネクストアクション` を持ち、議論の進行に応じて現在値が変わる。
- 過去の決定を単純に上書きすると、なぜ再開したかをfileだけから追えなくなる。

#### 原因の追跡

- なぜ: 「既存fileへ追記する」という要求は履歴保全を意図しているが、byte単位のappend-onlyか論理的な履歴保持かを区別していなかった。
- なぜ: 議論の変遷と現在状態を同じentry内に持つformatなので、全fieldを不変にすると現在状態を表せない。
- なぜ: 自由な編集と局所的な状態更新の境界を決めていなかった。

#### 根本原因₀ + 提案₀

- **根本原因₀**: immutableな議論履歴とmutableな現在状態をfield単位で分類していなかった。
- **提案₀**:
  - 総論: iteration履歴は不変とし、現在状態fieldだけを局所更新する。
  - 各論:
    - ルール: 新論点とiterationは追加し、既存の変遷を削除・要約置換しない。
    - ルール: `ステータス`、現在の `決定`、`ネクストアクション` は更新可能にする。
    - 適用例: 決定済みの論点3を再開するとき、旧決定をiterationへ引用して再開理由を記録した後、statusを `提案中` へ変更する。

##### 検証

- **観点**: 完全append-only、自由編集、履歴不変・現在状態だけ局所更新の三案を比較した。
- **弱点**: mutable fieldとimmutable blockの境界をskillが守る必要があり、単純な末尾追記より手順が複雑になる。

##### 修正先の判断

- **提案レベル**: template上で現在状態fieldと議論履歴blockを明確に分ける。複雑さは増えるが、履歴と現在状態の両方をfile単独で読めることを優先する。

**決定:** 新論点とiterationは追加し、既存の議論履歴を変更・削除しない。`ステータス`、現在の `決定`、`ネクストアクション` は現在状態として局所更新できる。決定済み論点を変更するときは、以前の決定と変更理由をiterationへ保存してから現在状態を更新する。file全体の置換・並べ替え・旧formatの一括整形は行わない。

**ネクストアクション:** `design.md` のD9へ反映し、論点11で新規論点の採番規則を決める。

## 論点11: 新規論点の安定した採番

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**提起の背景:** 既存discussion fileへ新論点を追加するとき、欠番の再利用、既存論点のrenumber、legacy `implementation_review.md` のh3論点見出しの見落とし、並行変更による番号重複を防ぐ規則が必要である。論点番号は会話と親子参照の識別子でもあるため、一度割り当てた番号が変わると履歴全体の参照が壊れる。

### 現在の合意対象

`facilitate-discussion` は、新規論点を次の規則で採番する。

1. 書込み直前に対象fileを読み直す。
2. canonicalな `## 論点N:` と、legacy互換の `### 論点N:` の見出しだけから既存番号を収集する。
3. 既存論点がなければ `論点1`、存在すれば最大番号に1を足した番号を使う。
4. 欠番は再利用せず、既存論点をrenumberしない。削除済み・移動済みの番号も詰め直さない。
5. 新規論点はcanonicalなh2見出し `## 論点N: タイトル` でfile末尾へ追加する。
6. 書込み直前の再読込で別writerによる変更を検出した場合は、最大番号を再計算してから追加する。同じfileへの同時書込みはsingle writerを前提にする。
7. 既存file内に同じ `論点N` が複数ある場合は、どちらを正本とするか推測せず、追加を停止してユーザーへ重複を報告する。

### 今回確認すること

今回の判断対象は、論点番号をfile内の単調増加IDとして扱い、canonical h2とlegacy h3の最大値へ1を足すこと、欠番再利用・renumber・重複番号の自動修復を行わないことである。

親論点が存在するか、循環していないか、親子関係を後から変更できるかは、この論点には含めず後続論点で決める。

### 議論の変遷

#### 事象の記述

- 現行 `task-design-discussion.md` と `discussion.md` はh2の `論点N` を使う。
- legacy `implementation_review.md` はsection2配下でh3の `論点N` を使う。
- 親子関係やチャットからの「論点3」参照は、番号が履歴中に変わらないことを前提にする。

#### 原因の追跡

- なぜ: 新skillは複数の既存formatへ追記するため、一つのheading levelだけを見ると既存番号を見落とす。
- なぜ: 欠番を再利用すると、過去の会話やfile外の参照が別の論点を指す可能性がある。
- なぜ: 重複番号を自動でrenumberすると、どの参照を更新すべきか判断できないまま履歴を改変する。

#### 根本原因₀ + 提案₀

- **根本原因₀**: 論点番号を見た目の連番として扱うか、変更しない識別子として扱うかが未定だった。
- **提案₀**:
  - 総論: 論点番号をfile内の安定IDとして扱い、最大値から単調増加させる。
  - 各論:
    - ルール: canonical h2とlegacy h3を読み、`max + 1`で採番する。
    - ルール: 欠番を再利用せず、既存番号を変更しない。
    - ルール: 既存重複を検出したら自動修復せず停止する。
    - 適用例: `論点1` と `論点3` があれば、新規論点は欠番の2ではなく `論点4` にする。

##### 検証

- **観点**: 最初の欠番を使う案、entry数+1を使う案、最大値+1を使う案を比較した。
- **弱点**: 論点を削除したfileでは番号が飛び、見た目の連続性は失われる。

##### 修正先の判断

- **提案レベル**: 見た目の連続性より参照の安定性を優先する。欠番は過去に論点が存在した可能性を示す履歴として許容する。

**決定:** 論点番号はfile内の単調増加する安定IDとして扱う。canonical h2とlegacy h3の見出しから最大値を得て1を足し、欠番再利用・renumber・重複番号の自動修復を行わない。書込み直前にfileを再読込し、新論点はcanonical h2でfile末尾へ追加する。

**ネクストアクション:** `design.md` のD10へ反映し、論点12で親子参照の正本と整合性を決める。

## 論点12: 親子関係の正本と整合性

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**提起の背景:** 親子論点を導入したが、現在のdiscussion fileはchild側の `親論点` とparent側の `子論点` を両方保存している。両方向を更新すると一方だけ直して不整合になる可能性がある。また、後から上位論点が判明した場合のreparent、存在しない親、循環参照、別fileの論点を親にする扱いが未決である。

### 現在の合意対象

親子関係は、child entryの `親論点` fieldだけを構造上の正本にする。

1. `親論点` は任意fieldとし、top-level論点では省略する。
2. 一つの論点が持てる直接の親は最大一つとする。複数の上位論点と関係する場合は、親子へ押し込まず本文中の関連参照として記録する。
3. 親は同じdiscussion file内に存在する論点だけを指定できる。別fileの論点は、`提起の背景`または`ネクストアクション`からpathと論点番号で参照する。
4. `親論点` を保存・変更する前に、指定した親が存在すること、自分自身でないこと、親を辿って自分へ戻る循環がないことを確認する。
5. 親番号が子番号より小さいことは要求しない。後から上位決定が判明した場合は新しいparentを作り、既存論点をreparentできる。
6. reparentするときは、以前の親と変更理由を対象論点の新しいiterationへ保存してから、現在の `親論点` を局所更新する。
7. parent側には `子論点` fieldを保存しない。子の一覧は、同じfile内で `親論点: 論点N` を検索して得る。
8. parent論点は、未決のchildがあれば `子論点待ち`、分解後のchildがすべて決定済みなら `分解済み` とする。parent自身にも「何を分解したか」という実質的な決定を残す。

### 今回確認すること

今回の判断対象は、child側の `親論点` だけを関係の正本とし、同一file・単一parent・循環禁止を守りつつ、履歴を残したreparentを許可することである。

この案を採用した場合、現在の `task-design-discussion.md` にあるparent側の `子論点` fieldは削除し、child側の `親論点` から辿る形へ揃える。

### 議論の変遷

#### 事象の記述

- 論点1と論点8は `子論点` を持ち、各childは `親論点` も持っている。
- 論点8を後から追加した際、論点6・7の親を論点1から論点8へ変更する必要が生じた。
- 親の一覧とchildの参照を両方更新する操作は、更新漏れによる矛盾を生む。

#### 原因の追跡

- なぜ: 読みやすさのために親から子、子から親の両方向をfileへ保存した。
- なぜ: Markdownにはreferential integrityがなく、二つのfieldを自動同期する仕組みもない。
- なぜ: 親子関係のcanonicalな方向を決めずに、表示上便利な両方向を採用した。

#### 根本原因₀ + 提案₀

- **根本原因₀**: 親子関係を一つの正本から導出せず、同じ事実を二箇所に保存した。
- **提案₀**:
  - 総論: childからparentへの参照だけを保存し、parentからchildの一覧は検索で導出する。
  - 各論:
    - ルール: 親は同じfile内の一論点に限定し、存在確認とcycle検査を行う。
    - ルール: 後から上位論点が判明したreparentを許可し、変更前の関係をiterationへ残す。
    - ルール: parent側の `子論点` fieldは持たない。
    - 適用例: 論点6・7が `親論点: 論点8` を持ち、論点8は `子論点` fieldを持たない。論点8のchildrenはfile検索で6・7と分かる。

##### 検証

- **観点**: parent側だけに保存、child側だけに保存、両方向へ保存の三案を比較した。
- **弱点**: parent entryだけを読んだ場合、child一覧がその場に表示されず、file内検索が必要になる。

##### 修正先の判断

- **提案レベル**: 表示上の便利さよりsingle source of truthを優先する。必要なら将来scriptやviewerでchild一覧を導出するが、Markdown本文へ重複保存しない。

**決定:** child entryの `親論点` だけを親子関係の正本にする。一つの論点が持てる直接の親は同じfile内の一論点に限定し、存在確認・自己参照禁止・循環禁止を守る。親番号と子番号の大小は制約せず、以前の関係をiterationへ保存したうえでreparentできる。parent側に `子論点` fieldは保存しない。

**ネクストアクション:** 現在fileのparent側 `子論点` fieldを削除し、`design.md` のD11へ反映する。論点13でcanonical templateを決める。

## 論点13: canonicalなdiscussion fileとentryの構造

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**提起の背景:** 個別規則として、原文保持、親論点、合意対象のself-containedな保存、feedback routing、immutableな履歴、mutableな現在状態を決めた。しかし、これらをどの見出し・fieldへ配置するかが未確定なため、実装者がtemplate作成時に構造を判断しなければならない。

### 現在の合意対象

新規discussion fileは `# 議論記録` を先頭に持ち、各論点は次のcanonical templateで記録する。既存fileに別のh1がある場合は置換せず、論点entryだけをcanonical形式で追加する。

```markdown
## 論点N: タイトル

**ステータス:** （提案中 / 調査中 / 子論点待ち / 決定 / 保留 / 分解済み）

**親論点:** 論点M
<!-- top-level論点では省略 -->

**種別:** （TBDヒアリング / 認識齟齬 / レビュー指摘。複数可）

**起点となった原文:**
> （ユーザーの言葉を変更せず記録する）
<!-- review起点の最上位論点では必須。それ以外は必要時だけ記載 -->

**提起の背景:** （表面の質問ではなく、質問が生まれた設計上の問題を書く）

### 現在の合意対象

**参照する現在案:** （根本原因0 + 提案0 / イテレーションNの提案N）

**今回確認すること:** （決定対象と、決定によって変わる範囲を指示語なしで書く）

### 議論の変遷

#### 事象の記述

- （具体的に何が起きたか）

#### 原因の追跡

- なぜ: ...
- なぜ: ...
- なぜ: ...

#### 根本原因0 + 提案0

- **根本原因0**: ...
- **提案0（現時点）**:
  - 総論: ...
  - 各論:
    - ルール: ...
    - 適用例: ...

#### イテレーションN

##### 検証

- **観点**: ...
- **弱点**: ...

##### 論点routingの判断

- **同一decision scopeとしてiterationを継続する理由**: ...

##### 修正先の判断

- **提案level / 診断levelへの遡及**: ...

##### 根本原因N + 提案N

- **根本原因N**: ...
- **変更点**: （前案との差分）
- **提案N（現時点）**:
  - 総論: （差分ではなく、現在案の全体を書く）
  - 各論:
    - ルール: ...
    - 適用例: ...

**決定:** （現在の決定。未決なら理由を書く）

**ネクストアクション:** （決定の適用先・適用方法。具体的な合意前は未決とする）
```

`現在の合意対象` は現在状態fieldとして局所更新できる。参照先の `提案N（現時点）` は必ず同じfile内に完全な案として存在させ、session内の説明だけを参照しない。新しいfeedbackが同じdecision scopeでない場合はiteration blockを追加せず、新規のchild・sibling・parent・独立論点を作る。

### 今回確認すること

今回の判断対象は、上記templateをcanonicalなentry構造にすることである。特に次の配置を確認する。

1. `ステータス`、`親論点`、`種別`、条件付きの原文、背景をentry冒頭に置く。
2. mutableな `現在の合意対象` から、immutableな履歴内の完全な現在案を参照する。
3. iteration内で、同じdecision scopeとして継続した理由を必ず記録する。
4. `決定` と `ネクストアクション` をentryの現在状態として末尾に置く。

fileの保存先、採番、親子validationは既に決定済みであり、この論点では変更しない。

### 議論の変遷

#### 事象の記述

- 現行のtask-design templateにはstatus、種別、背景、事象、原因、提案、iteration、決定、ネクストアクションがある。
- 論点6で、完全な現在案と確認対象をfileに保存する必要が加わった。
- 論点7と12で、親論点とrouting判定が加わった。

#### 原因の追跡

- なぜ: 規則だけ決めても、template上の配置がなければ記録時に省略される。
- なぜ: immutableな履歴とmutableな現在状態を見出しで分離しないと、何を更新してよいか判断できない。
- なぜ: 確認対象と提案本文の関係を明示しないと、sessionにしかない提案を指示語で参照する問題が再発する。

#### 根本原因0 + 提案0

- **根本原因0**: 新skillの利用体験を構成するfieldと更新可能性が、具体的なartifact構造へ統合されていなかった。
- **提案0（現時点）**:
  - 総論: 現行task-design形式を基礎に、原文、親論点、現在の合意対象、routing判断を追加した一つのcanonical templateへ統合する。
  - 各論:
    - ルール: 現在状態と履歴を見出しで分離し、現在案は履歴内へ完全な形で保存する。
    - 適用例: feedback後の確認では、`現在の合意対象` が `イテレーション2の提案2` を参照し、提案2本文だけで現在案全体を読める。

##### 検証

- **観点**: 現行templateへの最小追加、current proposalを毎回重複記載、current proposalをimmutable履歴から参照する三案を比較した。
- **弱点**: 参照方式では、entry冒頭だけを読んでも提案本文が見えず、同じentry内の参照先まで移動する必要がある。

##### 修正先の判断

- **提案レベル**: current proposalを冒頭と履歴へ二重保存する不整合より、同一file内の明示参照を選ぶ。`今回確認すること`は冒頭に置き、判断内容だけはすぐ読めるようにする。

**決定:** 新規fileは `# 議論記録` を持ち、各entryはstatus、任意の親論点、種別、条件付きの原文、背景、現在の合意対象、immutableな議論履歴、現在の決定・ネクストアクションで構成する。現在の合意対象は同じentry内の完全な現在案を参照し、iterationには同じdecision scopeとして継続する理由を記録する。

**ネクストアクション:** `design.md` のD12へtemplate完成形を反映し、論点14で新skillの起動契約を決める。

## 論点14: `facilitate-discussion` の起動契約

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**提起の背景:** `facilitate-discussion` は議論全般に見える名前と説明を持つため、通常の質問・短い認識合わせまで暗黙起動すると、保存を求めていない会話でdirectoryを質問する。反対に明示起動だけへ閉じすぎると、`task-design` と `steering` が確実に利用する契約を記述しない限り、既存の重複workflowへ戻る。

### 現在の合意対象

`facilitate-discussion` は暗黙起動させず、次の二経路だけで起動する。

1. ユーザーが `$facilitate-discussion` を明示する、または議論をMarkdownへ継続記録するよう明示的に依頼する。
2. `task-design`、`steering` などのconsumer skillが、保存を伴う議論workflowとして明示的に適用する。

`agents/openai.yaml` では `policy.allow_implicit_invocation: false` とする。`SKILL.md` のfrontmatter descriptionは、「構造化して永続化する議論」であることと、明示依頼またはconsumerからの委譲時に使うことを記載し、単なる質問・相談・説明をtriggerに含めない。

直接起動で `discussion_directory` がない場合はskillがユーザーへ確認する。consumer経由でdirectoryが渡されている場合は聞き直さない。

### 今回確認すること

今回の判断対象は、通常会話からのimplicit triggerを無効にし、ユーザーの明示依頼またはconsumer skillの明示適用だけを起動経路にすることである。

consumerごとの具体的な呼出し引数と、skill directory内のresource構成は、この論点には含めず後続論点で決める。

### 議論の変遷

#### 事象の記述

- 新skillは議論を進める一般的な名前だが、必ずdiscussion fileへ永続化する。
- directory未指定ならユーザーへの質問が必要なので、意図しないimplicit invocationの会話負担が大きい。
- `task-design` と `steering` は新skillを必ず使うconsumerとして移行する必要がある。

#### 原因の追跡

- なぜ: skill名だけでは「保存を伴う議論」と「通常会話の議論」を区別しにくい。
- なぜ: implicit invocationを許すと、file成果物を必要としない会話まで保存workflowへ入る。
- なぜ: consumerからの明示適用を契約にすれば、implicit invocationなしでも対象workflowを網羅できる。

#### 根本原因0 + 提案0

- **根本原因0**: skillの一般的な行為名と、永続化を必須とする狭い利用条件の差をtrigger policyで表現していなかった。
- **提案0（現時点）**:
  - 総論: implicit invocationを無効にし、明示的な永続化要求またはconsumer委譲だけで起動する。
  - 各論:
    - ルール: 通常の質問、説明、短い相談では起動しない。
    - ルール: consumerは対象workflowへ入る時点で新skillを明示適用する。
    - 適用例: `steering` が実装後reviewを開始するとき、`implementation_review.md` を指定して新skillを適用する。

##### 検証

- **観点**: 全議論でimplicit、frontmatter descriptionだけで限定、policyでimplicitを無効にする三案を比較した。
- **弱点**: ユーザーが構造化議論を望んでいてもskill名や保存依頼を明示しなければ、自動では起動しない。

##### 修正先の判断

- **提案レベル**: 取りこぼしより、意図しないfile作成とdirectory質問を避けることを優先する。対象consumerは明示適用で確実に網羅する。

**決定:** `facilitate-discussion` はimplicit invocationを無効にし、ユーザーがskillまたはMarkdownへの継続記録を明示した場合と、consumer skillが保存を伴う議論として明示適用した場合だけ起動する。consumerからdirectoryが渡されていれば聞き直さず、通常の質問・説明・短い相談はtriggerに含めない。

**ネクストアクション:** `design.md` のD13へ反映し、論点15で新skillのresource構成を決める。

## 論点15: `facilitate-discussion` のresource構成

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**提起の背景:** 新skillの責務、起動契約、canonical templateは決まったが、skill directory内に何を置くかが未決である。skill本文へtemplate全体を重複記載すると正本が二つになり、反対にappendや採番をscript化すると、自然言語のdecision scope判断まで機械処理へ寄せる危険がある。

### 現在の合意対象

`facilitate-discussion` は次の最小構成にする。

```text
plugins/tumeda-dev/skills/facilitate-discussion/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── templates/
    └── discussion_entry.md
```

#### `SKILL.md`

- frontmatterは `name` と `description` だけにする。
- descriptionには、構造化した議論をMarkdownへ永続化すること、明示起動またはconsumer委譲で使うことを書く。
- bodyには、保存先解決、論点routing、合意対象保存、履歴と現在状態、採番、親子validation、起動から決定までのflowを書く。
- canonical templateの全文はbodyへ複製せず、`templates/discussion_entry.md` を使うよう指示する。

#### `templates/discussion_entry.md`

- `design.md` のD12で合意したentry形式だけを置く。
- 新規fileのh1 `# 議論記録` はskillの新規file作成手順で追加し、entry templateにはh2以降だけを置く。
- 他consumer配下にtemplateのcopyを残さない。

#### `agents/openai.yaml`

次のUI metadataと起動policyだけを持つ。

```yaml
interface:
  display_name: "議論を進める"
  short_description: "論点を構造化し、合意までの変遷をMarkdownへ保存"
  default_prompt: "$facilitate-discussion を使って、この論点を構造化し、議論記録へ保存してください。"

policy:
  allow_implicit_invocation: false
```

#### 持たないresource

- `scripts/`: decision scope、原因、提案の判断が自然言語中心であり、現時点では機械化しない。
- `references/`: skill本文とtemplate以外のdomain知識を必要としない。
- `assets/`: 出力へcopyするvisual assetを必要としない。
- READMEや補助guide: skill利用に不要な重複文書を作らない。

### 今回確認すること

今回の判断対象は、`SKILL.md`、一つのcanonical template、`agents/openai.yaml`だけを持つinstruction skillとし、append・採番scriptや追加referenceを作らないことである。

consumerがどの引数で適用するか、旧templateをどの順序で削除するか、verification内容は、この論点には含めず後続論点で決める。

### 議論の変遷

#### 事象の記述

- `skill-creator` は `SKILL.md` と `agents/openai.yaml` を基本構成として推奨する。
- 現行のdiscussion形式はconsumerごとの `templates/discussion_entry.md` に重複している。
- 採番やparent cycle検査は形式的に見えるが、実際の書込み前にはdecision scopeの意味判断と同じfileの局所編集が伴う。

#### 原因の追跡

- なぜ: resourceを増やすほどprogressive disclosureはできるが、短いskillでは正本が分散する。
- なぜ: scriptを先に導入すると、まだ実利用で観測していないconcurrencyやformat variationまでAPI化する必要がある。
- なぜ: 今回の主な再発原因は機械処理不足ではなく、議論processの判断規則不足だった。

#### 根本原因0 + 提案0

- **根本原因0**: 再利用に必要なresourceと、将来必要になるかもしれないresourceを区別していなかった。
- **提案0（現時点）**:
  - 総論: instruction、UI metadata、canonical templateだけの最小skillにする。
  - 各論:
    - ルール: 手順は `SKILL.md`、entry構造はtemplateを唯一の正本にする。
    - ルール: 実利用で決定的な機械処理が必要と判明するまでscriptを追加しない。
    - 適用例: 新論点の採番はskillがfileを読み直して行い、専用CLIは呼ばない。

##### 検証

- **観点**: すべてをSKILL本文へ置く案、append scriptを含む案、SKILL・metadata・templateの最小構成を比較した。
- **弱点**: 採番・cycle検査が自然言語instruction依存になり、scriptによる原子的なlockや構造validationは得られない。

##### 修正先の判断

- **提案レベル**: single writer前提と書込み前再読込で現時点のriskを抑える。実利用で重複番号やcycleが再発した場合にscript化を別変更として検討する。

**決定:** `facilitate-discussion` は `SKILL.md`、`agents/openai.yaml`、一つのcanonical `templates/discussion_entry.md` だけを持つinstruction skillとする。consumer配下にtemplate copyを残さず、現時点ではscripts、references、assets、README等を作らない。

**ネクストアクション:** `design.md` のD14へ反映し、論点16で `task-design` の適用契約を決める。

## 論点16: `task-design` が `facilitate-discussion` を適用する境界

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**提起の背景:** `task-design` は現在、`task-design-discussion.md` の作成、論点format、記録timing、feedback iteration、論点分割を自身で定義している。新skillへ移行するとき、これらを残したまま新skillも使うと二重正本になり、すべて削ると `task-design` がいつ議論を開始し、決定をどこへ反映するかまで失う。

### 現在の合意対象

`task-design` は、議論の起動条件と設計への反映だけを所有し、議論を開始した後のprocessと記録を `facilitate-discussion` へ委ねる。

#### `task-design` に残す責務

1. `working_dir` を確定する。
2. 設計上の未決事項のうち、ユーザー判断が必要なものを上位から一つ選び、議論開始を決める。
3. `facilitate-discussion` へ次を渡して明示適用する。

```text
discussion_directory=<working_dir>
discussion_file_name=task-design-discussion.md
```

4. 議論対象となる設計文脈と、決定によって変わるdesign deliverableを自然言語で渡す。
5. 新skillから制御が戻った後、合意された決定を `design.md` へ反映する。
6. 全TBD解消、設計外判断なし等のtask-design固有の完了判定を行う。

#### `facilitate-discussion` へ移す責務

- discussion fileの作成・継続利用
- 論点entryの作成、採番、親子validation
- 事象・原因・提案・検証の記録
- 合意対象をfileへ保存してから確認するflow
- feedback受領時のiteration / child / sibling / parent routing
- status、決定、ネクストアクションの更新

#### `task-design` から削除するもの

- `templates/discussion_entry.md`
- `task-design-discussion.md` 固有のentry format全文
- 提案時・feedback時・決定時の記録手順の重複
- 「親子関係は作らない」という旧規則

通常modeと軽量modeの両方で同じ適用契約を使う。軽量modeでも `task-design-discussion.md` は主成果物として維持するが、書込みprocessは新skillが所有する。

`task-design` を実行中のagent自身が `facilitate-discussion` を適用し、議論だけを別child agentへ再委譲しない。これによりユーザーとの会話contextとdiscussion fileのsingle writerを維持する。

### 今回確認すること

今回の判断対象は、`task-design` に「いつ議論するか・何を設計へ反映するか」を残し、議論開始後のprocessと `task-design-discussion.md` の管理を新skillへ全面委譲することである。

`steering` の通常discussion、implementation review、`design-consult`、`doc-enricher`への影響は、この論点には含めない。

### 議論の変遷

#### 事象の記述

- `task-design` は設計processと議論processを同じSKILL.md内に持つ。
- 新skillは議論processと記録形式を唯一の正本にすることが合意済みである。
- `task-design` 固有の成果は `design.md` であり、新skillはその内容・完了判定を所有しない。

#### 原因の追跡

- なぜ: 現行 `task-design` から議論規則だけを抜くには、起動判断と設計反映の境界を残す必要がある。
- なぜ: entry formatやfeedback loopを両方へ残すと、将来の修正先が二つになる。
- なぜ: 別child agentへ委譲すると、対話contextの受渡しとsingle writer管理が追加で必要になる。

#### 根本原因0 + 提案0

- **根本原因0**: consumerが持つdomain workflowと、再利用する議論workflowの接続点を具体化していなかった。
- **提案0（現時点）**:
  - 総論: `task-design` は議論の前後を所有し、議論中は新skillの規則を適用する。
  - 各論:
    - ルール: task-design agent自身がworking_dirと固定file名を渡して適用する。
    - ルール: 決定後は `task-design` が `design.md` を更新する。
    - 適用例: 軽量modeの論点2を始めるとき、新skillが `task-design-discussion.md` へentryを追加し、決定後にtask-designがD2をdesignへ保存する。

##### 検証

- **観点**: templateだけ共有、議論を別childへ委譲、同じagentが新skillを適用する三案を比較した。
- **弱点**: skill適用がinstruction compositionであるため、consumerが明示適用手順を省略すると旧来の独自進行へ戻る可能性がある。

##### 修正先の判断

- **提案レベル**: `task-design/SKILL.md` の通常mode・軽量mode双方に、discussion開始時のMUSTな適用契約を一箇所から参照する形で記載する。重複formatは削除する。

**決定:** `task-design` はworking_dir、議論開始判断、設計文脈、決定後のdesign反映、task-design固有の完了判定を所有する。通常mode・軽量modeとも、task-design agent自身がworking_dirと `task-design-discussion.md` を渡して `facilitate-discussion` を適用し、議論processとfile管理を全面委譲する。旧templateと重複手順は削除する。

**ネクストアクション:** `design.md` のD15へ反映し、論点17で `steering` の通常discussion契約を決める。

## 論点17: `steering` が通常discussionで新skillを適用する境界

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**提起の背景:** `steering` は現在、設計後phaseで使う `discussion.md` のtrigger、記録timing、feedback loop、entry formatを自身で定義している。新skill移行後も、steering固有の「いつ通常discussionを始めるか」と、議論決定をどのphaseへ戻すかはsteeringに残す必要がある。

### 現在の合意対象

`steering` は通常discussionの起動条件と決定後のworkflow制御だけを所有し、議論開始後のprocessと `discussion.md` 管理を `facilitate-discussion` へ委ねる。

#### `steering` に残す責務

1. steering directoryを作成・管理する。
2. `task-design` 完了後の設計修正、tasklist作成・review、振り返り等で、成果物へ直接反映する前に議論が必要かを判断する。
3. 次の場合に通常discussionを開始する。
   - ユーザーが論点・質問・要議論を提起した。
   - steering agentが自発的に深めた検討が2往復以上になり、設計判断として残す価値が生じた。
4. `facilitate-discussion` へsteering directoryだけを渡し、file名はdefaultの `discussion.md` を使う。

```text
discussion_directory=<steering directory>
```

5. 議論対象となるsteering phase、関連成果物、決定によって変わる範囲を自然言語で渡す。
6. 決定後、design修正、tasklist修正、調査、文書改善review等の適切なphaseへ戻す。反映先は固定しない。
7. tasklist合意後のdiscussion review等、steering固有の終了条件と後続flowを管理する。

#### `facilitate-discussion` へ移す責務

- `discussion.md` の作成・継続利用
- entry formatとfile更新
- 提案・feedback・決定の記録timing
- 合意対象保存、論点routing、採番、親子validation
- status、決定、ネクストアクションの更新

#### `steering` から削除するもの

- `templates/discussion_entry.md`
- `discussion.md` のentry format全文
- feedbackをiterationへ記録する具体手順
- 種別・原因追跡・提案formatの重複説明

steering agent自身が `facilitate-discussion` を適用し、通常discussionだけを別child agentへ再委譲しない。`task-design-discussion.md` はtask-design consumerが管理し、通常 `discussion.md` と混ぜない。

### 今回確認すること

今回の判断対象は、`steering` に通常discussionの起動判断と決定後のphase制御を残し、default `discussion.md` の議論processとfile管理を新skillへ委譲することである。

実装後reviewの原文保持と `implementation_review.md`、tasklist templateやdoc-enricherの参照範囲は、この論点には含めない。

### 議論の変遷

#### 事象の記述

- 現行steeringはtask-design由来の議論と区別して、設計後phaseの議論を `discussion.md` に保存する。
- entry formatとfeedback loopはtask-design側とほぼ同じだが、steering本体へ重複記載されている。
- steeringは議論結果からdesign、tasklist、調査、文書改善等の複数phaseへ戻り得る。

#### 原因の追跡

- なぜ: 通常discussionの内容は共通processだが、開始条件と終了後の適用はsteering phaseに依存する。
- なぜ: 全責務を新skillへ移すと、新skillがsteering workflowを知る必要が生じる。
- なぜ: formatだけ残すと、新skillとsteeringの二重正本になる。

#### 根本原因0 + 提案0

- **根本原因0**: 共通の議論processとsteering固有のorchestrationを分離していなかった。
- **提案0（現時点）**:
  - 総論: steeringは議論の前後を所有し、議論中は新skillを適用する。
  - 各論:
    - ルール: steering agent自身がdirectoryだけを渡し、default `discussion.md` を使う。
    - ルール: 決定後の反映先はsteeringが現在phaseと決定内容から選ぶ。
    - 適用例: tasklist reviewで新しい設計論点が出た場合、新skillで `discussion.md` に記録し、決定後にtask-designまたはtasklist作成phaseへ戻る。

##### 検証

- **観点**: steeringへformatを残す案、新skillがsteering phaseまで所有する案、前後だけsteeringに残す案を比較した。
- **弱点**: 「自発的検討が2往復以上」というtriggerはsteering側に残るため、他consumerと起動thresholdが異なる可能性がある。

##### 修正先の判断

- **提案レベル**: 起動条件はconsumerのdomain判断として差異を許容する。議論開始後の体験だけを新skillで統一する。

**決定:** `steering` は通常discussionの起動判断、steering文脈、決定後のphase制御、終了条件を所有する。steering agent自身がsteering directoryを渡して `facilitate-discussion` を適用し、default `discussion.md` の議論processとfile管理を委譲する。task-design由来のfileとは混ぜず、旧templateと重複手順を削除する。

**ネクストアクション:** `design.md` のD16へ反映し、論点18でimplementation review consumer契約を決める。

## 論点18: implementation reviewで新skillを適用する境界

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**提起の背景:** 現行 `implementation_review.md` はフィードバック収集、認識合わせ、設計、タスク整理の4部構成を持つ。ユーザーは設計・タスク整理sectionが空欄になりやすく効果が薄いと判断し、task-design discussion形式への統一を求めた。一方、「設計合意後にtaskへ落とす」という順序自体は、review fileの構造ではなくsteering workflowとして必要な場合がある。

### 現在の合意対象

実装完了後にユーザーが漏れ・追加要件・不具合を提示した場合、`steering` は次を渡して `facilitate-discussion` を明示適用する。

```text
discussion_directory=<steering directory>
discussion_file_name=implementation_review.md
```

#### `steering` に残す責務

1. 実装完了後feedbackをreview workflowの起点として判断する。
2. feedback原文と、関連する実装・design・tasklistの文脈を自然言語で新skillへ渡す。
3. 議論決定後、次の適用先を判断する。
   - 認識合わせだけで完了する。
   - 既存 `design.md` の変更、またはtask-designによる再設計へ戻る。
   - design合意後、既存 `tasklist.md` へ追加taskを追記する。
   - 文書・skill・その他consumer固有の成果物へ反映する。
4. 設計判断が必要な変更では、design合意前にtaskを作らない。
5. review決定やtask追加後も、実装を自動開始しない。

#### `facilitate-discussion` へ移す責務

- `implementation_review.md` の作成・継続利用
- review起点の最上位論点へ `起点となった原文` をそのまま保存する
- 1 feedbackから複数決定が生じる場合の親子routing
- 共通entry形式による提案・feedback・決定の記録
- 合意対象保存、採番、親子validation、現在状態更新

#### 廃止する旧形式

- `1. フィードバック収集` section
- `FB-N` の独立採番
- `2. 認識合わせ` section
- `3. 設計` の空section
- `4. タスク整理` の空section
- `templates/implementation_review.md`

設計→taskの順序は廃止せず、`implementation_review.md` の固定sectionからsteeringのdecision後flowへ移す。review fileは議論の正本だけを担い、設計の正本とtaskの正本を複製しない。

修正済みfeedbackも議論を省略しない。原文、原因、採用した修正方針、決定をentryへ残し、実装済みという状態は決定またはネクストアクションに記録する。

### 今回確認すること

今回の判断対象は、`implementation_review.md` を共通論点形式だけにし、原文保持と議論processを新skillへ委譲すること、設計→追加taskの順序はsteeringの決定後flowとして維持することである。

tasklist templateの具体的な文言、複数feedback時に別steeringを作るか、doc-enricherが読むfile範囲は、この論点には含めず後続論点で決める。

### 議論の変遷

#### 事象の記述

- 旧4部構成はfeedback原文と論点の対応を示せるが、設計・taskの正本と内容が重複する。
- 設計とtask整理sectionが使われない場合、review fileは未完成に見える。
- 追加実装が必要なfeedbackでは、designとtaskの順序をどこかが制御する必要がある。

#### 原因の追跡

- なぜ: reviewの議論記録と、議論後に更新する成果物を同じfileへ先置きした。
- なぜ: lifecycleの順序をfile sectionの順序で強制しようとした。
- なぜ: designとtasklistを別の正本として持ちながら、review fileにも同じ成果物の枠を作った。

#### 根本原因0 + 提案0

- **根本原因0**: 議論の正本と決定適用先の正本を分離せず、review fileへworkflow全体を表現しようとした。
- **提案0（現時点）**:
  - 総論: review fileは新skillによる議論だけにし、決定後の適用順序はsteeringが管理する。
  - 各論:
    - ルール: review原文は論点内へ保存し、別ledgerを持たない。
    - ルール: 設計が必要ならdesign合意後にだけtaskを追加する。
    - 適用例: UI漏れのfeedbackを `implementation_review.md` で決定後、task-designへ戻ってdesignを更新し、承認後に既存tasklistへ追加phaseを追記する。

##### 検証

- **観点**: 4部構成維持、設計・task順序も廃止、review fileを議論だけにして順序をsteeringへ残す三案を比較した。
- **弱点**: review fileだけを読んだ場合、決定が最終的にどのdesign/taskへ反映されたかはネクストアクションのpathを辿る必要がある。

##### 修正先の判断

- **提案レベル**: `ネクストアクション` に具体的な適用先pathと処理を合意後に記録し、正本の重複を避けながら追跡可能性を維持する。

**決定:** `implementation_review.md` は共通論点形式だけを持つ議論の正本とし、原文保持、親子routing、議論process、file管理を `facilitate-discussion` へ委譲する。steeringはreviewの起動判断、関連文脈、決定後の適用先と順序を所有し、設計判断が必要ならdesign合意後にtaskを追加する。旧4部構成、`FB-N`、旧templateは廃止し、修正済みfeedbackも論点として残す。

**ネクストアクション:** `design.md` のD17へ反映し、新skill抽出の実装に必要な未確定事項だけを再確認する。

## 論点19: 複数feedbackを同じsteeringで扱う範囲

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**提起の背景:** 現行 `steering/SKILL.md` は「複数のフィードバックが揃ったら、新しいsteeringを起動する」と定めている。しかし、feedbackの件数と、設計・taskの正本を分ける必要性は一致しない。新しい `facilitate-discussion` は一つの `implementation_review.md` 内で論点の親子・兄弟関係を表せるため、件数だけを理由にsteeringを分ける必要があるかを決め直す必要がある。

### 現在の合意対象

**参照する現在案:** イテレーション1の提案1

**今回確認すること:** 論点19は新skill抽出の判断対象ではないため、提案0を採用せず、`steering` のfeature・MVP境界を今回変更しない。既存 `tasklist.md` への追記方法も同じくconsumer内部規則として今回の議論対象から外す。

### 議論の変遷

#### 事象の記述

- 現行規則はfeedbackが複数になった時点で新しいsteeringを起動する。
- 新形式では、一つの原文から複数論点が生じる場合も、複数原文が一つの決定へ収束する場合も、同じreview file内で追跡できる。
- feedbackが複数でも同じfeatureの完成条件を補うだけの場合がある一方、一件のfeedbackでも独立featureへ拡大する場合がある。

#### 原因の追跡

- なぜ: 旧形式ではfeedbackの収集と設計・task整理を一つのreview fileへ持たせていたため、feedback群をまとめて別workflowへ送る必要があった。
- なぜ: 新形式では議論と決定後の成果物更新を分離したため、件数は成果物境界を決める根拠にならない。
- なぜ: steeringを分ける判断は、記録量ではなく独立した提供価値・完成条件・MVP境界に基づくべきである。

#### 根本原因0 + 提案0

- **根本原因0**: discussion fileの収容単位とsteeringの成果物単位を、feedback件数で間接的に結び付けていた。
- **提案0（現時点）**:
  - 総論: feedback件数ではsteeringを分けず、元のfeatureと同じ完成条件を扱う限り元のsteeringでreviewを継続する。
  - 各論:
    - ルール: 一件目から `implementation_review.md` に記録し、複数件が揃うまで議論開始を待たない。
    - ルール: 複数feedbackはD2とD6に従い、同じ論点の原文追加、親子論点、兄弟論点、独立論点へroutingする。
    - ルール: feedbackが独立して提供・合意・実装できる別featureまたは別MVPなら、件数に関係なくsteeringの既存分割規則で新規steeringを作る。
    - ルール: 新規steeringを作る場合、元の `implementation_review.md` の論点をpathと論点番号で参照し、原文と議論履歴を複製しない。
    - 適用例: 同じ画面の表示漏れとvalidation漏れは元のsteering内の兄弟論点として扱う。そこから独立した管理画面の追加要求へ拡大した場合は、新規steeringへ切り出す。

##### 検証

- **観点**: feedback件数、議論量、既存tasklistの完了状態、featureまたはMVP境界を分割条件として比較した。
- **弱点**: 「同じ完成条件」か「別feature」かの判断にはsteering側の設計判断が残る。

##### 修正先の判断

- **提案レベル**: `facilitate-discussion` にsteering分割規則を持たせず、`steering/SKILL.md` のimplementation review flowで既存のMVP分割基準を参照する。

#### イテレーション1

**受領したfeedback:**
> なんでこれが聞かれているかわからない。これはsteeringスキルの個々のsteeringの境界であって、新スキルと何の関係があるの？

##### 検証

- **観点**: 論点19が `facilitate-discussion` の入力、出力、議論process、file管理、またはconsumerとの接続契約を変えるかを再確認した。
- **結果**: feedback件数とfeature・MVP境界によるsteering分割は、`steering` が所有するdomain workflowである。新skillは指定されたdiscussion file内の論点routingだけを所有し、steering directoryを新設・分割する判断を持たない。
- **弱点**: 論点18の後続候補に書かれていたことを理由に、抽出実装へ必要な判断かを再評価せず論点化していた。

##### 論点routingの判断

- **同一decision scopeとしてiterationを継続する理由**: feedbackは論点19の案を修正するのではなく、論点19自体が今回のscopeに属さないことを指摘している。不要な論点をさらに別論点へ展開せず、論点19内で取り下げ理由を保存する。

##### 修正先の判断

- **診断levelへの遡及**: 「implementation reviewに関連する未決事項」と「新skill抽出に必要な未決事項」を同一視した診断を撤回する。後続論点は、新skillまたはconsumerとの接続契約に実際の差分を生むものだけに限定する。

##### 根本原因1 + 提案1

- **根本原因1**: consumer内部に属する既存規則を、新skillとの接続点かどうかで選別せず、後続論点へ昇格させた。
- **変更点**: steering分割条件を変更する提案0を取り下げ、現行規則の是非を今回判断しない。
- **提案1（現時点）**:
  - 総論: 論点19を新skill抽出のscope外として終了する。
  - 各論:
    - ルール: `facilitate-discussion` はdiscussion file内の論点routingだけを所有し、steeringの新設・分割を判断しない。
    - ルール: feedback件数、feature・MVP境界、既存tasklistへの追記方法は `steering` のconsumer内部規則として維持し、今回変更しない。
    - 適用例: `steering` が新規steeringを選んだ場合、新skillは渡されたdirectoryとfile名を使うだけで、その選択理由を規定しない。

**決定:** 論点19は新skill抽出と無関係な `steering` 内部の境界判断だったため、提案0を取り下げ、今回の変更対象外とする。既存 `tasklist.md` への追記方法も後続論点にしない。

**ネクストアクション:** `design.md` は変更せず、新skillまたはconsumerとの接続契約に差分を生む未確定事項だけを洗い直す。

## 論点20: 新skill移行の検証契約

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング / レビュー指摘

**提起の背景:** `facilitate-discussion` は実行codeではなくagentの議論手順を定義するinstruction skillである。fileの存在やfrontmatterだけを検証しても、今回解消する二つの問題、すなわち「sessionにしかない提案を前提に合意を求めること」と「異なるdecision scopeを一つのiterationへ混ぜること」が防げるとは確認できない。一方、consumer内部のsteering分割やtasklist運用まで検証対象にすると、新skill抽出のscopeを越える。

### 現在の合意対象

**参照する現在案:** 根本原因0 + 提案0

**今回確認すること:** 新skillの構造、repository内の移行漏れ、discussion file操作、合意対象のself-contained性、feedback routingを検証する。`steering` のfeature・MVP境界やtasklist内容の正しさは検証対象に含めない。この検証範囲を今回の実装完了条件にするかを確認する。

### 議論の変遷

#### 事象の記述

- `quick_validate.py` はskill directoryとfrontmatterの妥当性を検証できるが、議論時の振る舞いまでは検証しない。
- repositoryの `scripts/verification/validate-plugin.mjs` は現在、削除予定の二つの `templates/discussion_entry.md` を必須pathとして参照している。
- `task-design`、`steering`、tasklist template、skill一覧にはdiscussion fileや旧templateへの参照が分散している。
- 今回の主要な品質要件は、完全な現在案をfileへ先に保存することと、feedbackをdecision scopeに応じて別論点へroutingすることである。

#### 原因の追跡

- なぜ: instruction skillはsyntaxが正しくても、重要なMUSTがconsumerへ接続されず、旧手順が残れば期待する体験にならない。
- なぜ: 静的検査だけでは、同名fileの継続、採番、履歴保持、self-containedな提案保存、論点routingの組合せを確認できない。
- なぜ: 実agentによるsmoke testだけでは、毎回の生成差があり、削除pathやversion不整合の機械的な検出を代替できない。

#### 根本原因0 + 提案0

- **根本原因0**: packaging検証、参照移行検証、議論体験の検証を分けて定義していなかった。
- **提案0（現時点）**:
  - 総論: 機械的な静的検証と、隔離した一時directoryでのbehavior smoke testを併用する。
  - 各論:
    - ルール: `quick_validate.py` で `facilitate-discussion/SKILL.md` の構造とfrontmatterを検証する。
    - ルール: `scripts/verification/validate-plugin.mjs` を更新し、新skillとtemplateの存在、`agents/openai.yaml` の `policy.allow_implicit_invocation: false`、consumerの新skill参照、旧template三pathの不存在、配布versionの一致を検証する。
    - ルール: repository全体を検索し、削除したtemplate path、旧4部構成、`FB-N`、consumer側に複製されたcanonical entry全文が現行定義に残っていないことを確認する。過去の `.steering/` 成果物は履歴として除外する。
    - ルール: `plugins/tumeda-dev/skills/README.md` に新skillの一行索引を追加し、validatorまたは差分確認で索引漏れを検出する。
    - ルール: 一時directoryを使うbehavior smoke testで、少なくとも次の四ケースを確認する。
      1. directory指定・file名省略では `discussion.md` を新規作成する。
      2. custom file名かつ既存fileでは内容を保持し、既存最大番号の次をfile末尾へ追加する。
      3. 合意を求める前に、session内の説明へ依存しない完全な現在案と今回の判断対象がentry内に存在する。
      4. 既存論点と異なるdecision scopeのfeedbackをiterationへ混ぜず、親子・兄弟・独立のいずれかへroutingし、その理由を保存する。
    - ルール: behavior smoke testはplugin sourceを変更しない隔離directoryで行い、既存steering成果物をfixtureとして書き換えない。
    - ルール: 最後に `node scripts/verification/validate-plugin.mjs`、version一致確認、`git diff --check`、変更差分の通読を行う。
    - 適用例: legacyな `### 論点3:` を持つcustom fileへ新しい別decisionを追加し、旧本文が不変のままcanonicalな `## 論点4:` がfile末尾へ作られることを確認する。

##### 検証

- **観点**: structure検証だけ、実agent smoke testだけ、静的検証とbehavior smoke testの併用を比較した。
- **弱点**: agentの生成には非決定性があるため、一回のsmoke test成功だけで将来の全実行を保証できない。skill本文とvalidatorでMUSTの存在を固定し、smoke testは統合上の明白な欠落を検出する役割に限定する。

##### 修正先の判断

- **提案レベル**: verificationは新skillの振る舞いとconsumer接続だけに限定する。steering固有成果物の内容評価は各consumerの既存検証へ残す。

**決定:** 新skillの構造、repository内の参照移行、discussion file操作、合意対象のself-contained性、feedback routingを、静的検証と隔離した一時directoryでのbehavior smoke testを併用して検証する。steering固有のfeature・MVP境界とtasklist内容は対象外とする。

**ネクストアクション:** `design.md` のD18へ反映し、論点21で `design-consult` のdiscussion記録を新skillへ接続するか決める。

## 論点21: `design-consult` のdiscussion記録を新skillへ接続する

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング / レビュー指摘

**提起の背景:** 現行 `design-consult/SKILL.md` は分析結果を返した後、「この分析を discussion.md に記録しますか？」とユーザーへ確認する。記録を承認された後のfile解決・entry形式・議論processは定義していないため、そのまま残すと `facilitate-discussion` を経由しない独自記録が生じ得る。`doc-enricher` はdiscussion fileを読むだけなので新skillのconsumerではないが、`design-consult` はdiscussion fileへの書込みを提案するproducerであり、接続要否を決める必要がある。

### 現在の合意対象

**参照する現在案:** 根本原因0 + 提案0

**今回確認すること:** `design-consult` が分析の記録を提案し、ユーザーが承認した場合は、`design-consult` 自身がdiscussion entryを直接書かず、同じ親agentが `facilitate-discussion` を明示適用する。callerからdiscussion directoryとfile名が渡されていればその値を使い、なければ新skillの通常契約どおりdirectoryをユーザーへ確認し、file名はdefaultの `discussion.md` とする。この接続を `design-consult/SKILL.md` へ追加するかを確認する。

`design-consult` の分析方法、subagent model、回答形式は変更しない。`doc-enricher` の読取対象も変更しない。

### 議論の変遷

#### 事象の記述

- `design-consult` は分析結果の永続化をユーザーへ提案するが、永続化の共通processを持たない。
- `task-design` や `steering` の中から設計相談する場合、callerは既にdiscussion directoryとconsumer固有file名を知っている。
- 単独の `design-consult` では保存directoryが決まっていないため、`discussion.md` というfile名だけでは保存先を一意に決められない。

#### 原因の追跡

- なぜ: 現行 `design-consult` は「記録するか」までを定義し、その後の書込み契約を各sessionへ委ねている。
- なぜ: 新skill移行後もこの経路を残すと、共通形式とself-contained性を迂回できる。
- なぜ: 一方で、保存先を `design-consult` 固有に固定すると、task-designやsteeringが所有するfile選択を侵害する。

#### 根本原因0 + 提案0

- **根本原因0**: 設計相談結果をdiscussionへ渡す接続点に、保存先と議論processのownerがなかった。
- **提案0（現時点）**:
  - 総論: `design-consult` は記録の承認を得るところまで担当し、実際のdiscussion記録は `facilitate-discussion` へ委譲する。
  - 各論:
    - ルール: 分析を返した直後に自動保存せず、現行どおりユーザーの記録承認を得る。
    - ルール: 承認後はdesign-consultのchild subagentではなく、会話と保存先を知る親agentが新skillを適用する。
    - ルール: callerが `discussion_directory` と任意の `discussion_file_name` を渡していれば、そのconsumer契約を優先する。
    - ルール: 保存先が渡されていなければ新skillがdirectoryを確認し、file名はdefaultの `discussion.md` を使う。
    - ルール: 分析全文を機械的に貼るのではなく、分析から生じたdecision scopeごとにself-containedな現在案を作り、必要なら親子論点へ分ける。
    - 適用例: task-design内の相談では `task-design-discussion.md`、steeringの設計後相談では `discussion.md`、単独相談ではユーザーが指定したdirectoryの `discussion.md` へ記録する。

##### 検証

- **観点**: 現行の曖昧な記録提案を残す、`design-consult` が固定pathへ直接書く、保存を新skillへ委譲する三案を比較した。
- **弱点**: 分析結果を複数論点へ分ける場合、ユーザーの「記録して」という一回の承認後にも、各decisionの合意自体は別途必要になる。

##### 修正先の判断

- **提案レベル**: 記録承認はfile作成・追記の承認であり、分析内の全提案への一括合意とは扱わない。各decisionは `facilitate-discussion` の通常flowで個別に合意する。

**決定:** `design-consult` は分析の記録承認を得た後、discussion entryを直接書かず、親agentが `facilitate-discussion` を明示適用する。callerが保存先を持っていればそのconsumer契約を使い、なければ新skillがdirectoryを確認してdefault `discussion.md` を使う。記録承認は分析内の全提案への一括合意とは扱わず、各decisionを通常flowで合意する。分析方法と `doc-enricher` の読取契約は変更しない。

**ネクストアクション:** `design.md` のD19へ反映し、論点22で設計全体を最終確認する。

## 論点22: `facilitate-discussion` 抽出設計の最終確認

**ステータス:** 決定

**親論点:** 論点1

**種別:** TBDヒアリング

**提起の背景:** 個別論点で新skillの責務、file契約、entry形式、feedback routing、consumer接続、検証が決まった。tasklist作成へ進む前に、実装者が追加の設計判断を必要としない完全な変更像として整合しているかを一度だけ確認する必要がある。

### 現在の合意対象

**参照する現在案:** 根本原因0 + 提案0

**今回確認すること:** 以下の提案0全体を、実装へ渡す最終designとして承認するかを確認する。承認後は新しい機能設計論点を追加せず、`design.md` を確定して `tasklist.md` の作成・reviewへ進む。tasklistの実行は今回のsteeringには含めない。

### 議論の変遷

#### 事象の記述

- `task-design` と `steering` は同種の議論processとtemplateを別々に持ち、`implementation_review.md` はさらに独自4部構成を持つ。
- 既存processでは、sessionにしかない提案を前提に曖昧な合意確認を行うことと、異なるdecision scopeを同じiterationへ混ぜることが起きた。
- 個別論点では共通processの抽出だけでなく、これら二つの問題を新skillの利用体験として防ぐ契約まで合意した。

#### 原因の追跡

- なぜ: discussionのformat、file操作、議論進行がconsumerへ重複し、正本がなかった。
- なぜ: consumer固有workflowと共通discussion lifecycleの責務境界が曖昧だった。
- なぜ: 合意対象の永続化とfeedbackのdecision-scope判定が、共通のMUSTとして定義されていなかった。

#### 根本原因0 + 提案0

- **根本原因0**: 再利用可能なdiscussion lifecycleと記録契約が独立しておらず、各consumerが部分的で不整合な議論体験を実装していた。
- **提案0（現時点）**:
  - 総論: `facilitate-discussion` をdiscussion lifecycleと記録形式の唯一の正本として追加し、consumerには起動前後のdomain workflowだけを残す。
  - 各論:
    - skill責務: 論点開始、提案、検証、feedback routing、決定、履歴保持、現在状態、採番、親子validation、file作成・継続利用を所有する。
    - 明示設定: `discussion_directory` と任意のbasename `discussion_file_name` だけを扱う。directory未指定時は聞き、存在しないdirectoryを作らない。file名defaultは `discussion.md` とする。
    - file更新: 新規論点を末尾へ追加し、同じdecision scopeだけをiterationにする。過去iterationを不変に保ち、現在状態fieldだけ局所更新する。legacy見出しも採番対象に含め、最大番号+1を使う。
    - 親子関係: child側の任意 `親論点` だけを正本とし、同じfile内の一親、存在、自己参照、循環を検証する。feedbackは同一decisionならiteration、下位ならchild、並列ならsiblingまたは独立、上位なら後発parentへroutingする。
    - 原文保持: review起点の最上位論点は `起点となった原文` を保持する。独立したfeedback ledgerと `FB-N` は作らない。
    - 合意体験: 合意を求める前に、完全な現在案と具体的な判断対象を同じentryへ保存する。sessionだけの説明、差分だけの提案、曖昧な指示語を前提にしない。
    - 起動: ユーザーの明示依頼またはconsumerからの明示適用だけで起動し、`agents/openai.yaml` は `policy.allow_implicit_invocation: false` とする。
    - packaging: `SKILL.md`、`agents/openai.yaml`、canonical entryだけを持つ `templates/discussion_entry.md` の最小構成にする。scripts、references、assets、READMEは新skill内に作らない。
    - task-design接続: 同じagentがworking directoryと `task-design-discussion.md` を渡す。議論決定後の `design.md` 反映と完了判定はtask-designに残す。
    - steering接続: 同じagentが通常discussionにはdefault `discussion.md`、implementation reviewには `implementation_review.md` を指定する。起動判断、関連文脈、決定後の適用先と順序はsteeringに残す。
    - implementation review: 旧4部構成と `FB-N` を廃止し、共通論点形式だけを使う。設計からtaskへの順序はsteeringの決定後flowへ残し、review fileへ設計・taskの正本を複製しない。
    - design-consult接続: 記録承認後に親agentが新skillを適用する。保存先がcallerにあれば優先し、なければdirectoryを聞く。記録承認を分析内提案への一括合意にはしない。
    - 対象外: `think-through`、`doc-enricher`、steeringのfeature・MVP境界、既存tasklistの運用、既存 `.steering/` 履歴は変更しない。
    - 旧path削除: task-designのdiscussion template、steeringのdiscussion template、steeringのimplementation review templateを互換用に残さず削除する。
    - 配布: 破壊的変更として `tumeda-dev` を `2.0.0` から `3.0.0` へ上げ、四つのversion宣言とvalidator期待値を一致させる。
    - verification: quick validation、repository validator、旧参照検索、索引確認、隔離directoryでの四つのbehavior smoke case、version一致、`git diff --check`、差分通読を行う。
    - 変更file: 新skill三fileを追加し、task-design、steering、steering tasklist template、design-consult、skill一覧、validator、三つの配布metadata fileを更新する。D4の旧template三fileだけを削除する。
    - 適用例: task-design中の提案は `task-design-discussion.md`、steeringの通常議論は `discussion.md`、実装後feedbackは `implementation_review.md` に同じcanonical形式で記録される。

##### 検証

- **観点**: ユーザーの元依頼、論点2〜21の決定、現行repositoryの参照箇所、配布version規約に対して提案0を照合した。
- **弱点**: instruction skillのため実行時挙動はagentに依存し、完全な決定性はない。MUSTを一つのskillへ集約し、静的検証とbehavior smoke testで明白な逸脱を検出する。

##### 修正先の判断

- **提案レベル**: 個別consumerのdomain workflowへ共通規則を複製せず、consumerは新skillの明示適用と前後の責務だけを記載する。

**決定:** 提案0全体を `facilitate-discussion` 抽出の最終designとして採用する。共通discussion lifecycleと記録形式を新skillへ集約し、task-design、steering、implementation review、design-consultを明示接続する。旧template三pathを削除し、`tumeda-dev` を `3.0.0` へ上げ、静的検証とbehavior smoke testで移行を確認する。consumer内部のdomain workflowと既存steering履歴は変更しない。

**ネクストアクション:** `design.md` の完了条件を満たし、合意済みdesignから `tasklist.md` を作成してreviewする。

## 論点23: 新規論点を開く前のdiscussion scope gate

**ステータス:** 決定

**親論点:** 論点1

**種別:** 認識齟齬 / レビュー指摘

**起点となった原文:**
> なんでこれが聞かれているかわからない。これはsteeringスキルの個々のsteeringの境界であって、新スキルと何の関係があるの？

**提起の背景:** 論点19では、`implementation_review` に関連する既存規則という理由だけで、steeringのfeature・MVP境界を新skill抽出の論点として開いた。feedback routingは同じ論点をiteration、child、sibling、parent、独立論点へ分けるが、「現在のdiscussion目的に属さないため論点化しない」という入口の判定を明示していない。`facilitate-discussion` が論点作成を所有する以上、独立論点を無制限に許すと同じ脱線が再発する。

### 現在の合意対象

**参照する現在案:** 根本原因0 + 提案0

**今回確認すること:** `facilitate-discussion` が新しい論点を作る前に、そのdecisionが現在のdiscussion目的、または指定されたparentの決定へ実際に影響するかを検証するMUSTを追加する。影響しない事項はactiveな論点にせず、consumer内部の判断として残すか、必要ならscope外候補としてchatで明示するだけにする。このscope gateを新skillの体験とverificationへ追加するかを確認する。

`think-through`、`steering`、その他consumerへ同じ規則を追加しない。steeringのfeature・MVP境界自体も変更しない。

### 議論の変遷

#### 事象の記述

- 論点19は新skillの入力、出力、file管理、議論process、consumer接続を変えなかった。
- 論点19を提案した理由は、論点18の後続候補に書かれていたことだけだった。
- 現在のrouting分類には `独立論点` があるが、discussion目的からも独立した事項を除外する条件がない。

#### 原因の追跡

- なぜ: 「前の論点から派生した」ことを「現在のdiscussion目的に必要」と同一視した。
- なぜ: routing時にdecision間の関係だけを見て、discussion全体の目的への影響を先に検証しなかった。
- なぜ: `独立論点` を「同じdiscussion目的に属するが他論点へ依存しないdecision」へ限定していなかった。

#### 根本原因0 + 提案0

- **根本原因0**: 新規論点のroutingに、現在のdiscussion目的へ属するかを判定する入口のscope gateがなかった。
- **提案0（現時点）**:
  - 総論: decision間の親子・兄弟判定より前に、候補decisionが現在のdiscussion目的へ影響するかを検証する。
  - 各論:
    - ルール: 新規論点候補について、「このdecisionの結論が変わると、現在のdiscussion目的または指定parentの決定・実装範囲が変わるか」を確認する。
    - ルール: 変わらない場合はdiscussion fileへactiveな論点を作らない。既存consumer規則をそのまま維持するか、別の明示依頼が必要なscope外候補としてchatで区別する。
    - ルール: `独立論点` は、現在のdiscussion目的には属するが、同じfile内の他論点へ直接依存しないdecisionだけを指す。
    - ルール: 既にscope外の論点を作った後で判明した場合は、履歴を削除せず、その論点内に取り下げ理由を保存して終了する。
    - 適用例: discussion skill抽出中に、steeringが別featureを新規steeringへ分ける基準は、新skillの契約を変えないため論点化しない。新skillが指定directory外のfileを作るかどうかはfile契約を変えるため論点化する。

##### 検証

- **観点**: すべての派生事項を独立論点にする案、consumerが事前選別する案、新skillが論点作成直前にscopeを検証する案を比較した。
- **弱点**: 将来影響が不明な候補を早期に除外する可能性がある。その場合はactiveな決定論点にせず、必要な事実が揃うまで調査候補としてchatで明示し、ユーザーがdiscussion scopeへ含めると決めた場合だけ論点化する。

##### 修正先の判断

- **提案レベル**: 論点作成を所有する `facilitate-discussion` のMUSTとtemplateのrouting観点へ追加する。常時思考規則やconsumerへ重複させない。

**決定:** `facilitate-discussion` は新規論点を作る前に、候補decisionが現在のdiscussion目的または指定parentの決定・実装範囲へ影響するかを検証する。影響しない事項はactiveな論点にせず、`独立論点` は同じdiscussion目的に属するdecisionだけに限定する。誤って作成済みなら履歴を保持して取り下げ理由を残す。この規則は新skillとtemplateのrouting観点だけに置き、`think-through` とconsumerへ重複させない。

**ネクストアクション:** `design.md` のD6・D18・D21と `tasklist.md` へ反映済み。Design合意、Tasklist合意、必須振り返りが完了したため、実装は別workflowで `tasklist.md` を上から実行する。
