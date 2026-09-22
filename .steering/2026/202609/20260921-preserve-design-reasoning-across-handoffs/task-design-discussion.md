# 議論記録

## 論点1: design初稿の骨格

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: owner判断より前に扱う設計範囲を固定する

#### 提案0

`design.md` の初稿は、次の順序で完成後の姿を詰める骨格にする。

```text
引き継ぎで成立させる判断能力
  └─ 正本を読めることと、判断根拠を引き継げたことを区別する

catch-up workflow
  ├─ 必要skillの読込み
  ├─ 正本を読む前の独立再構成
  ├─ 正本を読んだ後の差分解消
  └─ 正本への合流

workflowを支えるcontract
  ├─ ownerとconsumer境界
  ├─ 起動gateと省略条件
  ├─ 読取可能な根拠
  ├─ 一時成果物の配置・ignore・削除
  └─ 完了validationと失敗時の再開

source artifact
  └─ owner決定後に対象skill / docs / templateを確定する
```

初稿では、独立再構成と差分解消の両方を成立させることだけを上位要件として固定する。`task-design`、`steering`、共通handoff contractのどこがownerか、一時fileを必須にするか、軽度な引き継ぎを省略できるかはTBDのまま残す。

この骨格への合意後、下位を最も多く規定する「catch-up contractのownerとconsumer境界」から議論する。

#### 提案背景

引き渡された提案が防ぎたいのは、後任がファイル上の現在地だけを読み、既存decisionを自分の判断として持たないまま続きを始めること。したがって、file配置より先に「何を理解できれば引き継ぎ完了か」を置く必要がある。

ownerを先に決めると、`task-design` と `steering` の現在の分担に引っ張られ、catch-upが成立させる能力をその配置へ合わせて狭める危険がある。初稿では能力、workflow、支えるcontract、source artifactの順に分け、配置判断を最後へ送る。

一方、全discussionの再演や一時file二つの作成は手段候補であり、完了状態ではない。これらを上位要件へ置くと、対象規模にかかわらず重い行為を強制し、理解できたかを判定しないworkflowになる。このため非目標へ分けた。

#### 提案0へのフィードバック

**結果:** 採用

> ok

### 決定

`design.md` は、引き継ぎで成立させる判断能力、catch-up workflow、workflowを支えるcontract、source artifactの順で完成後の姿を詰める。

独立再構成と正本との差分解消を上位要件とする。owner、一時成果物の必須性、軽度な引き継ぎの省略条件は、この構造の下にある未決事項として扱う。

---

## 論点2: catch-up contractのownerとconsumer境界

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: 共通正本とconsumer固有入口へ分ける

#### 提案0

**推奨:** a。catch-upの不変条件を一つの共有referenceへ置き、`task-design` と `steering` は自身の責務に属する入口と再開先だけを持つ。

##### a. `design-handoff-contracts.md`を共有正本にする

```text
plugins/tumeda-dev/skills/
├── design-handoff-contracts.md
│   ├── 正本を見る前の独立再構成
│   ├── 正本を見た後の差分解消
│   ├── catch-up完了条件
│   ├── 一時成果物は非正本
│   └── 未完了時の停止
├── task-design/SKILL.md
│   ├── design phaseを引き継ぐ入口
│   ├── 再構成対象: 仮designとTBD全体
│   ├── canonical file: design.md / task-design-discussion.md
│   └── 完了後: task-designの未決判断へ戻る
└── steering/SKILL.md
    ├── steeringを引き継ぐ入口
    ├── design phaseならtask-designへrouting
    ├── steering固有phaseなら再構成対象を現在step・必須gate・次の合法な遷移に限定
    └── design内容をsteering自身で再設計しない
```

共有referenceは、二つのconsumerへ共通する判断基準と順序だけを所有する。引き継ぎを検知する条件、独立再構成へ渡す入力、再構成対象、canonical file、catch-up後の戻り先は、各workflow skillが所有する。

`design-handoff-contracts.md` は独立起動するskillにしない。引き継ぎは `task-design` または `steering` の進行中stateで起き、元workflowのownerを置き換えないためである。consumerが共有referenceを読み、catch-up後は同じworkflowへ戻る。

##### b. `task-design`だけをownerにする

design rationaleとTBDの再構成は一箇所へまとまる。steering経由でもdesign phase中なら適用できる。

一方、`task-design`完了後に `steering` の必須gateやdispatchを引き継ぐ場合を扱えない。後から `steering` へ別のcatch-up手順を足すと、独立再構成、差分解消、完了条件が二重正本になる。

##### c. `steering`だけをownerにする

steering経由の引き継ぎ入口は一箇所になる。

一方、単独起動できる `task-design` を覆えない。さらに `steering` は初回task-design起動前にdesign、scope、方向性を判断してはならず、仮designとTBDの独立再構成を `steering` 自身の責務にすると既存境界へ反する。

#### 提案背景

この論点は、下位の起動gate、読取範囲、一時成果物、validationのownerを規定する。先にownerを決めなければ、同じ判断をどのfileへ書くかが定まらず、複数skillへの重複記載が起きる。

調査で次を確認した。

- `task-design` は単独起動と `steering` 経由起動の両方を持つ
- `steering` はtask-designのcallerだが、初回起動前にdesign、方向性、scopeを判断してはならない
- `runtime-execution-contracts.md` は、複数skillに共通する不変条件をskill直下の共有referenceへ置き、consumerが固有入口を持つ既存patternである
- `task-design`、`steering`、`think-through`、`facilitate-discussion` のいずれにも、後任agentが正本を読む前後で理解を再構成するcontractは存在しない

共有reference案は、共通contractを一箇所に保ちながら、各consumerの既存責務を変えない。`task-design` はdesignの再構成を所有し、`steering` はdesign phaseでは `task-design` へroutingする。`steering` 固有phaseでは、designを再構成せず、orchestration stateだけをcatch-up対象にする。

#### 提案0へのフィードバック

**結果:** 進め方aを採用し、共有referenceの名前は別decisionへ分離する

> 進め方はaで良いと思う。skill名は別論点で検討

### 決定

進行中designの判断責任を引き継ぐための不変条件は、`plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md`を正本とする。共有referenceは独立起動するskillにせず、`task-design`のowner責務を置き換えない。

`task-design`は、引き継ぎ入口、独立再構成へ渡す入力、再構成対象、canonical file、catch-up後の戻り先を持つ。`steering`はdesign phaseの引き継ぎを同じworking directoryの`task-design`へroutingし、design内容を自身で再設計しない。steering固有phaseの引き継ぎはscope外とする。このscopeは論点4の決定を典拠とする。

共有referenceの名前は、論点3の決定により`task-design-work-handoff-contracts.md`とする。

---

## 論点3: 共有referenceの名前

**ステータス:** 決定

**親論点:** 論点2

**種別:** TBDヒアリング

### イテレーション0: agent交代時のcatch-upを名前から読めるようにする

#### 提案0

**推奨:** a。`agent-handoff-contracts.md` とする。

##### a. `agent-handoff-contracts.md`

初見の人は「agent間で進行中作業を引き継ぐときの契約」が入ると予想する。実態である、後任agentの独立再構成、正本との差分解消、元workflowへの復帰と同じ方向を指す。

対象を `design` に限定しないため、`task-design` と `steering` 固有phaseの両方を含められる。一方、`agent` が付くため、`facilitate-discussion` がconsumerへdecisionを返す通常handoffや、人間への作業報告とは区別できる。

##### b. `design-handoff-contracts.md`

仮designとTBDを再構成する中心caseは明確に伝わる。ただし `steering` 固有phaseの現在step、必須gate、次の合法な遷移を引き継ぐcontractまで含む名前としては狭い。

##### c. `workflow-handoff-contracts.md`

`task-design` と `steering` の両方をworkflowとして覆える。ただしagent交代に限定されないため、skill間のresult handoff、child委譲、consumerへのhandoffも対象だと読める。実態より広い。

#### 提案背景

論点2で決まった共有referenceは、`task-design` と `steering` に共通する「別agentが進行中workflowを引き継ぐときのcatch-up」を所有する。名前は、対象がagent交代であること、design phaseとsteering固有phaseの両方を覆うこと、通常のskill間handoffを含めないことを同時に伝える必要がある。

同階層には `runtime-execution-contracts.md` と `runtime-model-profiles.md` がある。共有referenceも既存どおりkebab-caseと複数形の責務名を使う。`agent-handoff-contracts.md` は3語で同階層の抽象度にも揃う。

逆翻訳では、aだけが対象を過不足なく予想させる。bはsteering固有phaseを予想から落とし、cはagent交代以外のhandoffまで予想へ入れる。

#### 提案0へのフィードバック

**結果:** 全案不採用。引き継ぐ対象を名前へ入れず、適用範囲も根拠なく一般化していた

> 全部の命名が勘所を外している。何のhandoffのcontract（をdesignする）なの？ どんなagentもworkflowもhandoffできるの？

`agent-handoff-contracts.md`と`workflow-handoff-contracts.md`は、handoffの主体または実行枠だけを示し、何を引き継ぐcontractかを示していない。`design-handoff-contracts.md`も、design成果物、design phase、design判断責任のどれを指すか曖昧なまま、steering固有phaseを含める前提との比較だけで退けていた。

このfeedbackは名前の選択だけでなく、論点2の説明でsteering固有phaseまで対象へ広げた前提を無効にする。進め方aの共有reference配置は維持するが、命名案を作り直す前に、子論点4でhandoff objectと適用境界を確定する。

### イテレーション1: task-designの進行中作業を名前へ入れる

#### 提案1

**推奨:** a。`task-design-work-handoff-contracts.md` とする。

##### a. `task-design-work-handoff-contracts.md`

何を引き継ぐかを`task-design work`、何を定めるかを`handoff contracts`として読むことができる。進行中のtask-design作業を後任agentが続ける今回のscopeと一致し、完了済みdesignをexecutorへ渡す通常のresult handoffとも区別できる。

##### b. `task-design-takeover-contracts.md`

後任が進行中作業を引き受けるeventは短く表せる。一方、`takeover`はplugin内の既存語彙ではなく、handoff objectが判断責任であることもaより間接的になる。

##### c. `design-reasoning-handoff-contracts.md`

引き継ぐ中身が判断根拠であることは強く表せる。一方、`task-design`以外の設計活動や、完了済みdesign rationaleの引き渡しまで対象に見える。今回確定した適用境界より広い。

#### 提案背景

論点4により、handoff objectは`task-design`が所有する未完了designの判断責任、eventは別agentによる同じdesign作業の続行に確定した。`agent`や`workflow`はhandoffの主体または実行枠であり、file名の主語にはしない。

skill名には一律の品詞規則はない。このpluginにも、actionを表す動詞句（`facilitate-discussion`、`name-work-directory`）、工程・活動を表す名詞句（`task-design`、`document-review`、`steering`）、実行主体を表す役割名（`tasklist-executor`、`test-runner`、`visual-inspector`）がある。何を呼び出す単位として識別させるかに応じて選ばれている。

ただし今回命名する対象は独立起動するskillではなく、複数skillから参照されるreference fileである。同階層の`runtime-execution-contracts.md`と`runtime-model-profiles.md`も、action名ではなく「対象領域 + 文書が所有する内容」の名詞句になっている。したがってskill名の動詞・役割名patternではなく、handoff objectと文書種別を表す複合名詞として評価する。

逆翻訳では、aは「task-designの作業を引き継ぐ際の契約」、bは「task-designを引き取る際の契約」、cは「design reasoningを引き継ぐ際の契約」になる。aだけが、対象workflow、進行中作業の引き継ぎ、contractという三要素を、今回のscopeを越えずに表す。

#### 提案1へのフィードバック

**結果:** aを採用

> あー、そうだった、mdファイルか。だったらa

### 決定

共有referenceのfile名は`task-design-work-handoff-contracts.md`とする。

独立起動するskill名ではなくreference file名なので、actionを表す動詞句にはしない。`task-design work`でhandoff objectを、`handoff contracts`で文書が所有する内容を表す。

---

## 論点4: 共有referenceが扱うhandoff object

**ステータス:** 決定

**親論点:** 論点3

**種別:** TBDヒアリング

### イテレーション0: 未完了designの判断責任へ限定する

#### 提案0

今回設計するのは、任意のagentまたはworkflowを引き継ぐためのcontractではない。

`task-design`が所有する進行中designを別agentが続行するとき、後任が次を自分の判断として再構成してから未決論点へ戻るためのcontractに限定する。

- original requestから組み立てる問いとTBD全体
- 確定済みdecisionの判断根拠
- 棄却案と棄却理由
- 現在残る未決論点と、その順序

handoffの対象はagentでもworkflowでもなく、**未完了designの判断責任**である。前任と後任はいずれも`task-design`を遂行するagentであり、後任が同じworking directoryのdesignを続行する場合に適用する。

`steering`は、引き継いだ現在phaseがdesign中なら同じworking directoryの`task-design`へroutingする。steering固有phaseの現在step、実行gate、dispatch状態の引き継ぎはこのcontractへ含めない。一般のagent交代、任意workflowの再開、skill間のresult handoff、tasklist実行の再開もscope外とする。

論点2で合意した進め方aは維持する。ただし共有referenceは「`task-design`と`steering`のあらゆる引き継ぎに共通するreference」ではない。「進行中designの判断責任を引き継ぐ不変条件を置き、`task-design`が適用し、`steering`はdesign phaseをそこへroutingするreference」とする。

#### 提案背景

論点3の提案0では、起点となった「進行中designの後任agent」という具体caseから、根拠なくsteering固有phaseへscopeを広げた。その結果、引き継ぐ対象を名前へ入れられず、`agent`または`workflow`という運搬主体だけで共有referenceを命名しようとした。

しかし、独立再構成する内容は仮designとTBD全体であり、正本との照合対象もdesign decisionの問題、棄却案、判断理由である。この手順をsteering固有phaseや任意workflowへ一般化できる証拠はない。

この境界が決まった後、論点3では「未完了designの判断責任」を名前から予想できる案だけを作り直す。

#### 提案0へのフィードバック

**結果:** 採用

> ok

### 決定

共有referenceが扱うhandoff objectは、`task-design`が所有する未完了designの判断責任とする。後任agentが同じworking directoryのdesignを続行するとき、問いとTBD全体、確定済みdecisionの判断根拠、棄却案と棄却理由、現在残る未決論点とその順序を再構成する。

`steering`はdesign phaseの引き継ぎを同じworking directoryの`task-design`へroutingする。steering固有phase、一般のagent交代、任意workflowの再開、skill間のresult handoff、tasklist実行の再開はscope外とする。

論点2で合意した共有reference配置は維持し、その名前はこの境界を前提に論点3で決める。

---

## 論点5: catch-upの起動gate

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: designの規模ではなくtask-design ownershipの連続性で判定する

#### 提案0

**推奨:** a。新しく起動した`task-design`が既存working directoryを引き受ける場合にcatch-upを必須とし、同じtask-design実行の継続中は再起動しない。

##### a. ownershipの連続性で判定する

`task-design`はworking directoryを確定した直後、`design.md`または`task-design-discussion.md`の存在だけを確認する。この時点では本文を読まない。

- 既存正本がなく、新しいdesignを始める場合: catch-up対象外
- 既存正本があり、現在のtask-design実行がまだその判断責任を引き受けていない場合: catch-up必須
- 現在のtask-design実行がcatch-up済み、または同じ実行内で最初からdesignを進めている場合: user feedbackや`facilitate-discussion`から戻るたびには再起動しない
- ownershipの連続性を判定できない場合: catch-up必須

design規模、discussion量、変更の軽重による省略条件は設けない。後任が小さいと判定するためにも正本の理解が必要であり、catch-up前の規模判定を省略根拠にすると循環する。対象が小さければ独立再構成と差分解消の作業量自体が小さくなる。

`steering`はdesign phaseを同じworking directoryの`task-design`へroutingするだけで、catch-up要否を代わりに判断しない。gateのownerは`task-design`とする。

##### b. 既存正本があれば毎turn catch-upする

判定は単純になる。一方、同じtask-design実行がuser feedbackを受けるたび、または`facilitate-discussion`から戻るたびに独立再構成を繰り返し、通常の議論進行を壊す。

##### c. 小規模なdesignでは省略できる

作業量は減る。一方、正本を読む前に規模と判断根拠の単純さを評価できず、後任の主観で今回防ぎたいcatch-upを外せる。

#### 提案背景

今回防ぐ失敗は、既存fileの存在ではなく、判断責任を持っていない後任が正本の表面だけから続きを始めることである。したがってgateはfileの有無だけでも、design規模だけでも足りず、現在のtask-design実行が対象designの判断責任を既に持つかで分ける必要がある。

一方、session IDやagent IDを永続識別子として利用できるcontractは存在しない。host固有識別子へ依存せず、新しいtask-design起動が既存正本を引き受ける時点を境界にする。継続性が曖昧なら安全側としてcatch-upする。

#### 提案0へのフィードバック

**結果:** aを採用

> a

### 決定

新しく起動した`task-design`が既存working directoryのdesignを引き受ける場合、catch-upを必須とする。working directory確定直後は`design.md`または`task-design-discussion.md`の存在だけを確認し、本文は独立再構成後まで読まない。

既存正本がない新規designは対象外とする。同じtask-design実行が既に判断責任を持つ場合、user feedbackや`facilitate-discussion`から戻るたびにはcatch-upを再起動しない。ownershipの連続性を判定できない場合はcatch-upを必須とする。

design規模、discussion量、変更の軽重による省略条件は設けない。対象が小さい場合はcatch-upの作業量が自然に小さくなる。gateのownerは`task-design`とし、`steering`は要否を判断せずdesign phaseをroutingする。

---

## 論点6: 独立再構成前の読取境界

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: 元依頼・上位制約・外部事実だけを先に読む

#### 提案0

**推奨:** a。独立再構成前の入力をwhitelistで定め、対象designの結論と議論過程は仮design作成後まで読まない。

##### a. 元依頼・上位制約・外部事実を許可する

catch-up対象と判定した`task-design`は、次の順で入力を得る。

1. `task-design`、`think-through`、適用される開発標準、repository固有指示を読む。
2. 対象`design.md`から、逐語転記された`元の依頼内容`と、存在する場合だけ`上位roadmap制約`をsection境界で抽出して読む。
3. 対象working directoryを除外し、新規task-designと同じPrepareStep 3の調査として、外部仕様、repository docs、code、testを調査する。子phaseでは親roadmapとdependency resultも確認する。
4. ここまでの入力だけから仮designとTBD全体を作る。

この段階では、対象`design.md`のその他section、`task-design-discussion.md`、`requirements.md`、`investigation.md`、`tasklist.md`、`roadmap.md`、現在designを説明するsummaryやsession履歴を読まない。仮design保存後にこれらを読み、正本との差分解消へ進む。

`design.md`全体を開いて必要sectionだけ無視する運用にはしない。`元の依頼内容`と`上位roadmap制約`だけを出力するbounded extractionを用意し、正本の後続sectionがmodel contextへ入らないようにする。template上、`元の依頼内容`は要約や意訳を加えない逐語転記なので、前任の設計結論ではなくoriginal requestとして扱える。

`元の依頼内容`がない、section境界が壊れている、または抽出に失敗した場合はfail closedで停止する。代わりに`design.md`全体を読む、前任のsummaryから依頼を復元する、依頼内容を推測するfallbackは持たない。

##### b. handoff専用の入力fileを正本とする

新規design開始時に、original request、上位roadmap制約、外部参照を専用fileへ保存する。後任は`design.md`へ一切触れず入力を得られる。一方、`design.md`の`元の依頼内容`と`上位roadmap制約`を複製する第二の正本になり、更新同期とlifecycleを新たに必要とする。

##### c. callerが再起動時に入力を再送する

`task-design`はdesign成果物を一切読まず、callerからoriginal request、上位roadmap制約、外部参照を受け取る。fileの重複はない。一方、standalone再開ではユーザーへ元依頼の再送を要求し、`steering`にも元依頼を別途保持・転送する責務が増える。入力欠落時に後任が推測する経路も生まれる。

#### 提案背景

新しいsessionではoriginal requestがchatに残っていない場合がある。一方、現行`design.md`の`元の依頼内容`は依頼をそのまま転記するcontractを持つため、そのsectionだけなら再入力をユーザーへ要求せず取得できる。子roadmap phaseでは`上位roadmap制約`も参考情報ではなく必須制約なので、同様に先行入力へ含める必要がある。別fileまたはcaller入力へ複製せず、既存正本から許可sectionだけを機械的に切り出すのが最小の追加contractになる。

独立再構成は情報を欠かせて前任案と違う案を作る試験ではない。同じ問題と制約へ後任自身が向き合い、問いとTBDを組み立てた後に、前任の判断との差を説明するための順序制御である。このため外部事実は許可し、前任が構成した設計結論と議論過程だけを後段へ送る。

#### 提案0へのフィードバック

**結果:** aを採用

> a

### 決定

独立再構成前に読める入力は、`task-design`と`think-through`、適用標準とrepository固有指示、`design.md`からbounded extractionした`元の依頼内容`と任意の`上位roadmap制約`、対象working directoryを除外した通常の設計前調査で得る外部事実に限定する。

`plugins/tumeda-dev/skills/task-design/scripts/extract-handoff-input.mjs`を設け、対象`design.md`全体をmodel contextへ入れず許可sectionだけをstdoutへ出す。`元の依頼内容`がない、section境界が壊れている、または抽出に失敗した場合は非zeroで停止し、全体読込み、summaryからの復元、推測へfallbackしない。

仮designとTBD全体を保存するまでは、対象`design.md`のその他section、`task-design-discussion.md`、`requirements.md`、`investigation.md`、`tasklist.md`、`roadmap.md`、現在designを説明するsummaryやsession履歴を読まない。保存後に正本全体を読み、差分解消へ進む。

---

## 論点7: catch-up一時成果物の配置とlifecycle

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: ignored directoryへattempt単位の一fileを置く

#### 提案0

**推奨:** a。`<working_dir>/task-design-catch-up/attempt-N.md`を一attemptの作業正本とし、catch-up完了後にdirectoryごと削除する。

##### a. working directory内のignored directory

一つのattempt fileへ、許可入力の参照元、独立再構成した仮designとTBD、正本読取後の差分、未解消事項、完了判定を順に追記する。独立再構成と差分解消を別fileへ固定分割しない。

```text
<working_dir>/
├── design.md
├── task-design-discussion.md
└── task-design-catch-up/       # Git追跡対象外
    └── attempt-001.md
```

作成前に、Git worktree内なら`git check-ignore`で`task-design-catch-up/`が実際にignoredであることを確認する。ignoredでなければfileを書かず停止し、必要なignore設定を報告する。steering標準配置では`plugins/tumeda-dev/skills/steering/.gitignore.sample`へ対応patternを追加する。Git worktree外では追跡対象が存在しないため、そのまま作成できる。

同じtask-design実行が停止後に再開する場合は同じattemptを続ける。別のtask-designが未完了attemptを引き継ぐ場合は既存attempt本文を独立再構成前に読まず、file名だけから次の連番を選び、新しいattempt fileを作る。正本との差分解消段階で過去attemptも読める。

catch-up未完了で停止する場合はattempt directoryを残し、停止理由と再開位置を現在attemptへ記録する。catch-up完了時は、必要な理解を現在のtask-design進行へ反映した後、`task-design-catch-up/`をdirectoryごと削除する。削除前に、対象がworking directory直下のexact pathであり、symlinkでなく、内部が`attempt-[0-9]{3}.md`だけであることを検証する。予期しないentryがあれば削除せず停止する。attempt fileをcanonical designまたはdiscussionへ移さず、Git履歴にも残さない。

##### b. OSのtemporary directory

Git追跡を確実に避けられ、repositoryのignore設定も不要になる。一方、別sessionから安定pathで再開できず、cleanupやhost再起動で消える。失敗時の再開位置を持てない。

##### c. working directoryへtracked fileとして残す

再開と監査は容易になる。一方、後任が判断責任を得るためだけの仮説と比較過程が永続成果物へ混ざる。designとdiscussionが既に判断結果と議論過程の正本なので、第三の正本になる。

#### 提案背景

catch-up成果物は、そのattemptが完了するまでは再開に必要だが、完了後の利用者が読む成果物ではない。stock情報でも通常のgradient flowでもなく、catch-up完了までだけ寿命を持つflow情報である。

一fileへ独立再構成と差分解消を時系列で持たせると、必須順序を検証でき、常に二fileを作ることも避けられる。attempt単位に分けることで、失敗した後任の仮説を次の後任が独立再構成前に読むことなく、自分のattemptを開始できる。

#### 提案0へのフィードバック

**結果:** aを採用

> a

### 決定

`<working_dir>/task-design-catch-up/attempt-N.md`を一attemptの作業正本とし、許可入力の参照元、独立再構成、正本との差分、未解消事項、完了判定を一fileへ順に追記する。Git worktree内では作成前に`git check-ignore`で実際にignoredであることを確認し、ignoredでなければ書かずに停止する。

同じtask-design実行の再開は同じattemptを続ける。別のtask-designが引き継ぐ場合は既存attempt本文を独立再構成前に読まず、file名だけから次の連番を選ぶ。未完了時は停止理由と再開位置を残す。

完了時は必要な理解を現在のtask-design進行へ反映した後、directoryごと削除する。削除前にworking directory直下のexact path、非symlink、`attempt-[0-9]{3}.md`以外のentryがないことを検証し、予期しないentryがあれば削除せず停止する。attemptをcanonical fileまたはGit履歴へ残さない。

---

## 論点8: catch-up完了validationと正本への復帰

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0: current decisionとactive topicのcoverageで判定する

#### 提案0

**推奨:** a。discussionの全発話を再演せず、現在有効なdecisionと未決topicを漏れなく再構成できたことを完了条件にする。

##### a. current state coverage gate

正本読取後、attempt fileへ次の対応表を作る。

| 正本の単位 | 後任が記述する内容 |
| --- | --- |
| `design.md`の完成後の姿・Requirements | 独立再構成と一致した点、欠けていた点、矛盾した点 |
| discussionの各`決定` | 解こうとした問題、採用判断、主要な棄却案と棄却理由 |
| activeまたは停止中topic | 現在案、未決判断、依存先、次にユーザーへ確認する一問 |

各差分は、`一致`、`正本から補完して理由まで理解`、`正本へ疑義あり`、`独立再構成だけにある新規TBD`のいずれかへ分類する。

- `正本へ疑義あり`は、既存decisionを外から渡された制約として飲み込まず、対応topicを`facilitate-discussion`の再開variantへroutingする。解消するまでcatch-up未完了とする。
- `独立再構成だけにある新規TBD`は、現在designへ影響するなら新しいtopic候補としてtask-designへ返す。影響しないなら除外理由をattemptへ残す。
- 全decisionとactive topicが対応表に現れ、未分類差分と未解消の疑義がzeroで、後任がexactな再開topicと一問を示せた時だけ完了とする。

正本を比較用に読んだ時点で`design.md`、task-design discussion、存在する場合は`requirements.md`のdigestを記録し、完了直前に再計算する。途中で変化していれば一時成果物を削除せず、最新正本との差分解消からやり直す。独立再構成自体はやり直さない。

完了後はattemptから文章をcanonical fileへ転記しない。既存decisionへの疑義または新規TBDが正規のdiscussion手順で反映済みであることを確認し、attempt directoryを削除して、特定したactive topicからtask-designを再開する。

##### b. discussionの全iterationを一件ずつ再演する

履歴coverageは最も強い。一方、現在判断へ寄与しない会話も逐語的に再処理し、discussionが長いほどcatch-upが無制限に重くなる。今回の非目標である全discussionの再演になる。

##### c. 後任の自己申告だけで完了する

「理解した」「次へ進める」と宣言できれば軽い。一方、どのdecision、棄却案、未決topicを落としたか検証できず、元の失敗caseを区別できない。

#### 提案背景

catch-upの目的は過去会話の記憶量を揃えることではなく、現在のdesign判断を後任自身が所有することである。そのためcoverage単位は、現在有効なdesign、decision、active topicとし、全iterationや全発話にはしない。

一方、現在状態だけを要約すると、なぜ別案を採らないかが抜け、同じ誤りを再び提案できる。各decisionについて問題、採用判断、主要な棄却案と理由まで説明させることで、表面の結論を読んだだけの状態と区別する。

#### 提案0へのフィードバック

**結果:** aを採用

> a

### 決定

catch-up完了は、現在有効なdesign、各decision、activeまたは停止中topicのcoverageで判定する。各decisionについて解こうとした問題、採用判断、主要な棄却案と理由を、各未決topicについて現在案、未決判断、依存先、次の一問をattemptへ記録する。

独立再構成との差分を`一致`、`正本から補完して理由まで理解`、`正本へ疑義あり`、`独立再構成だけにある新規TBD`へ分類する。全対象が対応表に現れ、未分類差分と未解消疑義がzeroで、exactな再開topicと一問を示せた場合だけ完了とする。

`正本へ疑義あり`は対応topicの再開へroutingし、解消までcatch-up未完了とする。現在designへ影響する新規TBDは新しいtopic候補としてtask-designへ返す。比較時と完了直前のcanonical file digestが異なる場合は、独立再構成を維持したまま最新正本との差分解消をやり直す。

完了後はattempt本文をcanonical fileへ転記しない。必要な変更が正規のdiscussion手順で反映済みであることを確認し、一時directoryを削除して特定済みのactive topicからtask-designを再開する。
