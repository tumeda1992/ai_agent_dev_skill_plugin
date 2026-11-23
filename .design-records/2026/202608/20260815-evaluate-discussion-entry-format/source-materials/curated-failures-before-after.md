# 伝わらなかった事例のbefore / after集 v1（一般化済み検証資料）

> **判定: format evidenceとして無効**
>
> C1〜C4のafterは、全iteration終了後の最終内容を再編集しただけで、議論中の当事者が各iterationで使うentry状態を再現していない。論点2イテレーション2で合意した第一利用者を検証していないため、このfileからformat方針を導いてはならない。beforeのsource整理だけを再利用し、afterはiteration 0から各feedback後までのreplayとして作り直す。C5は別途監査する。
>
> C1の作り直しとして作った[`c1-iteration-replay-v2.md`](./c1-iteration-replay-v2.md)も不採用。初期提案直後とiteration 1〜5更新後を別snapshotとして並べたため、実際に一つのentryへiterationが増えるprocessを表さず、既存iterationの重複要約と固定箇条書きを生んだ。失敗例として残す。
>
> C1の現在のafter候補は[`c1-single-entry-v3.md`](./c1-single-entry-v3.md)。一つのentryへ初期提案とiteration 1〜5を蓄積し、各iterationを`feedback → 提案N → 提案背景`の順にした。提案Nは完全案だが見出しへ補足を反復せず、提案背景配下の不成立理由とgapを別見出しにした。C1での読みやすさは評価待ちであり、他caseへ適用できる共通formatとはまだ扱わない。

このfileは非公開の利用先記録から、repository名、source path、固有domain語彙を除いて再構成した。formatの見出しを先に決めるための資料ではない。実際に伝わりづらかったcaseを、何が読めなかったかごとに修正し、その局所修正を他caseへ展開できるか検証するための試作である。

## 今回キュレーションしたcase

| case | 伝わらなかったもの | 選定理由 | afterで試すvariant |
| --- | --- | --- | --- |
| C1 | 5 iterationで追加された契約の累積結果 | 現formatの発生源であり、削ってはいけない意味も最も多い | 累積契約 + 判断の展開 |
| C2 | 深くなっていく原因診断と、そこから変わる修正scope | proposal差分だけでは変化を説明できない | 診断の更新 |
| C3 | 技術的な反証で採用案が撤回され、過去案へ戻る経路 | 最新案だけでは判断の強度と制約を失う | 前提の反証・採用案の置換 |
| C4 | 一つの論点から3つのdecisionへ分解した後の現在地 | 通常iterationではなく、議論構造自体が変わった | decision分解・焦点移動 |
| C5 | READMEのpath変更後に作られるfileの中身 | pathへの合意と成果物への合意が一致していない | file deliverable preview |

---

## C1: 5 iterationで追加された契約の累積結果が見えない

### source

非公開の利用先記録から一般化したcase（論点11「提案の精度の低さ」）

### before

元entryでは、次の順で契約が追加された。

```text
提案0
  診断 → 提案の深化loopを定義する

イテレーション1
  診断への遡及をloopへ追加
  提案1として完全案を再掲

イテレーション2
  提案は総論 + 各論を必須にする
  提案2として完全案を再掲

イテレーション3
  診断の質が提案の質を決める因果を追加
  提案3として完全案を再掲

イテレーション4
  discussion format自体を構造化対象へ追加
  提案4として完全案を再掲

イテレーション5
  各論をrule本文 + 適用例にする
  提案5として完全案を再掲
```

各iterationの本文には、`検証 / 修正先の判断 / 根本原因N + 提案N / 変更点`が毎回置かれている。

### 何が伝わらなかったか

- iteration 5時点で、現在の契約が「診断への遡及」「総論と各論」「因果説明」「discussionへの保存」「抽象と具体」の5点で構成されることを一覧できない。
- 各契約がどのfeedbackで加わったかを知るには、5個の完全提案を比較する必要がある。
- `根本原因N: 変わらず`が反復され、診断が維持されたことより、契約の累積が見えにくい。
- 一方で、各iterationのfeedbackを削ると、なぜ現在formatに各要素が必要なのかが分からなくなる。

### after試作 v1（無効: iterationを回す途中状態がない）

```markdown
## 論点11: 提案の精度の低さ

**ステータス:** 決定

**提起の背景:** 振り返りで一行の総論だけを返し、具体的な更新内容と認識差異を利用者へ判断させていた。提案の書き方だけでなく、提案へ至る診断と、その過程をdiscussionへ残す形式が必要になった。

### 現在成立させるもの

提案の質を、提案後の言い換えでなく前段の診断から高める。診断、提案、検証を繰り返す時は、その過程と現在の完全案を利用者が追える形で残す。

#### 診断から提案へ進む条件

- 事象を具体化し、原因を追ってから根本原因を確定する。
- 提案の弱点が診断に由来する場合は、提案だけを直さず原因追跡へ戻る。
- 診断が浅いまま提案だけを修正しても、根本原因は残る。

#### 提案に含める抽象と具体

- 提案は全体方針だけで終わらせず、それを成立させる具体契約を含める。
- 具体契約は再利用可能なruleとして書き、その直後に適用例を置く。
- ruleだけ、または特定caseだけのどちらかに偏らない。

#### discussionへ残すもの

- 事象、原因、提案を独立して読める粒度で残す。
- feedbackごとに、何が問題で、診断または提案の何を変えたかを残す。
- 各時点の意思決定を復元できる情報を省略しない。

### 判断の展開

0. **初期案で診断から提案へのloopを定義**
   - 事象: 自己reviewも初案も一行の総論で終わり、具体的な更新内容を利用者へ判断させていた。
   - この時点の判断: 事象を具体化し、原因を追って根本原因を確定してから、総論と各論を持つ提案を作り、提案を検証する。
1. **診断への遡及を追加**
   - feedback: 提案の検証中に、原因追跡自体へ戻る場合がある。
   - 加わった判断: 弱点が診断levelなら原因追跡へ戻る。
2. **総論だけの提案を禁止**
   - feedback: 全体方針だけで、具体的な変更内容が利用者へ丸投げされている。
   - 加わった判断: 提案は総論と各論の両方を持つ。
3. **診断の質と提案の質を接続**
   - feedback: loopの手順はあるが、なぜ診断へ戻る必要があるか分からない。
   - 加わった判断: 診断が浅いまま提案だけを弄っても根本原因は残ると明示する。
4. **discussion formatも修正対象へ追加**
   - feedback: chatで考えても、discussionへ一行総論しか残らなければ認識差異を振り返れない。
   - 加わった判断: 事象、診断、提案、各iterationの変更をdiscussionへ保存する。
5. **ruleと適用例を対にする**
   - feedback: `CreateItem`の確認先のような特定caseを各論本文にすると一般化できず、それを除いて抽象ruleだけに戻すと自分のcaseへ適用できない。
   - 加わった判断: 再利用可能なruleと、それを地に着ける適用例を接続する。

### 決定

上記の5契約を、project-instructions.mdとdiscussion formatへ反映する。
```

### このcaseでの修正方針

- 5個の完全提案を一つへ潰すことが主目的ではない。累積した具体契約を内容固有の見出しで一度に読めるようにする。
- iteration側は、`feedback → 加わった判断`の対応をnamed stepとして残す。
- 変わらなかった根本原因を毎回再掲せず、診断が更新されたcaseだけ別variantを使う。

### このafterだけでは解けないもの

- 採用案が技術的に無効化され、以前の案へ戻るcase。
- 一つの論点を複数decisionへ分解するcase。
- file作成の具体像。

---

## C2: 原因診断が深くなったのか、提案が変わったのか区別できない

### source

非公開の利用先記録から一般化したcase（論点7「設計フェーズが捕まえるべき決定を実装フェーズに流した」）

### before

```text
初期診断
  tasklistへ作業だけを書き、合意が必要な設計判断を問わなかった

イテレーション1
  本当はskillに設計完了条件がなく、完成後の姿がUIへ偏っていた

イテレーション2
  docs等もdeliverable単位で完成状態を設計し、抽象的DoDを未完signalにする

イテレーション3
  HOWのruleだけでなく、実装中に判断を残さないというWHYを上に置く
```

すべてが`検証 / 弱点 / 修正先 / 根本原因N + 提案N`という同じ外形で続く。

### 何が伝わらなかったか

- 初期からiteration 1では診断の深さが変わり、iteration 2と3では修正案の具体化と上位方針の追加が起きているが、見出しから区別できない。
- `根本原因1を引き継ぎつつ`等を本文で探さないと、どの診断が現在も有効か分からない。
- docs、設定、code構造という複数deliverable variantが、`ルール1 / ルール2`へ平坦化されている。

### after試作

```markdown
## 論点7: 設計判断を実装へ流出させない

**ステータス:** 決定

**問題になった具体例:** test設定の配置、architecture documentの内容、product documentのscopeを、設計で合意せず実装時に決めた。

### 現在の診断

設計完了を「templateを埋めて利用者がOKした状態」と扱い、「実装者が新しい設計判断をせず反映できる状態」と定義していなかった。そのため、既存templateで表しにくいdocs、設定、code構造の完成像を設計対象から落とした。

### 現在の修正案

#### 設計完了条件

後続作業で新しい設計判断が生まれず、合意済み内容を反映するだけの状態を設計完了とする。

#### deliverableに応じた完成像

- documentation: 読者、成立させる判断、知識構造、具体的な見出しと内容を決める。
- test / runtime設定: file配置、解決元、実行条件、不足時の挙動を決める。
- code構造: directory、責務、公開入口、依存方向を決める。

#### 未設計を検出するsignal

`整備する / 作成する / 対応する`だけのDoDは、完成状態が未設計であるsignalとする。該当deliverableの完成像へ戻る。

### 診断と修正scopeの更新

1. **作業単位で止まった事象を特定**
   - 診断: tasklistで合意が必要な判断を問わなかった。
   - この時点の修正scope: tasklist checkの追加。
2. **設計完了条件の欠落へ診断を深める**
   - 新しい発見: skill自体が、実装中に判断を残さない状態を完了条件にしていなかった。
   - 修正scopeの変化: tasklistだけでなく、skill policyと非UI deliverableの設計へ広げる。
3. **deliverableごとの完成像へ具体化**
   - 検証で分かった不足: 「読み手が何を得るか」だけでは、書き手が何を書くかを決められない。
   - 修正scopeの変化: docs、設定、code構造ごとに固有の完成判定を持たせる。
4. **HOWを支えるWHYを追加**
   - 検証で分かった不足: 詳細なDoDを書くこと自体が目的化し得る。
   - 修正scopeの変化: 個別ruleを、設計完了条件から導く構造にする。

### 決定

設計完了条件を上位に置き、deliverableの種類に応じた完成像を選び、抽象的DoDを未設計signalとして検出する。
```

### このcaseでの修正方針

- diagnosisが変わったiterationは、`前の診断 → 新しい発見 → 修正scopeの変化`を一組で示す。
- 現在の診断は一つにまとめるが、旧診断を単なる誤りとして消さず、どの段階で何を説明できていなかったかを残す。
- 提案の各論は固定の`ルール`で並べず、documentation、runtime、code structure等、完成判定が異なるvariantへ分ける。

---

## C3: 技術的反証で採用案が撤回された経路が埋もれる

### source

非公開の利用先記録から一般化したcase（論点4「スレッド本文取得方法」）

### before

```text
初期候補: search/recent、単体保存、backward traversal
  → 利用者はroot postを保存するためforward取得が必要
iteration 1: since_idは非効率と評価
iteration 2: start_time / end_timeを採用し、decisionを記載
iteration 3: Elevated access必須と判明し、iteration 2を撤回してsince_idへ戻る
iteration 4: until_idを追加したが、3,200件上限と一本post誤検知が判明
最終decision: since_id + until_id + MAX_PAGES=3、取得不能はsyncError
```

### 何が伝わらなかったか

- entry中に`決定`、`決定（更新）`、`決定（最終）`が残り、どれが現在有効か見出しだけでは判断できない。
- iteration 2は妥当性検証で負けた案ではなく、access tierという新事実で実行不能になった。この違いが通常のproposal修正と同じ階層に置かれる。
- since_idは一度「非効率」で退けられた後に復活しており、最終案が単純な改善の積み上げではない。
- 3,200件上限と一本post誤検知は最終案の弱点として受容された重要な判断だが、長いデバッグ経緯に埋もれる。

### after試作

```markdown
## 論点4: root postからthread本文を取得する

**ステータス:** 決定

### 現在の取得契約

- request: author timelineへ`since_id=rootId`と`until_id=rootCreatedAt+3h`を指定する。
- filter: 同一conversation、同一author、root自身を除くpostだけを残す。
- pagination上限: 3 page。
- 取得不能時: 3,200件window外と一本postをAPI上で区別できないため、どちらも`syncError`を残す。

### 受け入れた制約

- Basic tierでは、active authorの古いthreadが3,200件window外になり取得できない。
- 一本postにも`syncError`が付く可能性を受け入れる。何も記録せず情報欠落を見逃すより、取得できなかった可能性を残す方を優先する。

### 採用案が変わった経路

1. **利用者の保存行動からforward取得を必須化**
   - backward traversalは末尾からrootへ辿る方法で、rootを保存する利用者には使えない。
2. **since_idを候補化したが、探索範囲が広すぎると評価**
   - root以降の全postを新しい順に辿るため、古いthreadへ届きにくい。
3. **start_time / end_timeを一度採用**
   - rootから3時間へ絞れば、探索範囲を小さくできると判断した。
4. **新事実により採用案を無効化**
   - evidence: Basic tierでは`start_time / end_time`が利用できない。
   - 無効になった判断: iteration 2の時間窓方式。
   - 戻した候補: 7日制限を避けられるsince_id。
5. **until_idを組み合わせて探索窓を作る**
   - since_id単独の広さを、root+3h相当のsnowflake IDで制限する。
6. **3,200件上限を発見し、弱点を受容して確定**
   - evidence: 古いrootでは指定窓がtimeline access範囲外になった。
   - 判断: 取得不能と一本postの区別不能を`syncError`として可視化する。

### 棄却・置換された案

- backward traversal: rootを保存する利用者の行動に合わない。
- search/recent: 7日制限により魚拓用途を満たさない。
- start_time / end_time: Basic tierで実行不能。
- since_id単独: 古いthreadへ到達するpage数が大きすぎる。
```

### このcaseでの修正方針

- 新しいevidenceが前提を壊したiterationは、通常の`提案修正`ではなく、`evidence / 無効になった判断 / 置換先`を持つvariantにする。
- 過去のdecisionは削除せず、現在有効なdecisionと同じlabelで並べない。`一度採用後に無効化`を経路上で明示する。
- 最終案の弱点はデバッグlogから分離し、利用者が何を受け入れたかを現在契約の近くへ置く。

---

## C4: 一つの論点を3 decisionへ分解した後の現在地が分からない

### source

非公開の利用先記録から一般化したcase（論点10「context中央集権とhost runtime契約」）

### before

初期提案は、次の4契約を一つの合意対象にした。

```text
- context ownership
- context template path
- runtime model profile
- remote Git provider tasklist分岐
```

iteration 1で10-A / 10-B / 10-Cへ分解し、iterationごとに`現在の焦点`とdecisionを持たせた。最後に`論点10の結論`で再統合した。

### 何が伝わらなかったか

- 初期提案の`ルール`4個は独立したyes / noを必要とし、一括合意できない。
- iteration 1以降は同じ提案のversionではなく、10-A、10-B、10-Cという別decisionを順番に確定している。
- `ネクストアクション`はこのcaseではboilerplateでなく、10-Aから10-Bへ焦点を移すnavigationとして機能している。
- ただし各iterationをproposal versionとして読む外形は残り、3 decisionの進捗を一覧できるのは最後の結論だけである。

### after試作

```markdown
## 論点10: context中央集権とhost runtime契約を完成させる

**ステータス:** 決定

### 論点を分解した理由

context、model、remote Git provider公開は、ownerも成果物も合意判断も異なる。一つの提案へまとめると、一部だけ同意・修正する位置を示せないため、3 decisionへ分けて順に確定する。

### decisionの現在地

| decision | 決めること | 状態 | 結論 |
| --- | --- | --- | --- |
| 10-A context ownership / template path | 誰がinstanceを解決し、templateをどこから読むか | 決定 | maintainerだけが解決し、plugin `skills/` rootのtemplateを読む |
| 10-B runtime model profile | provider名でなく何を正本にするか | 決定 | 推論強度profileを正本とし、host adapterで実装する |
| 10-C remote Git provider tasklist分岐 | publish actionを誰が、何を根拠に生成するか | 決定 | steeringだけがcontextのremote Git provider capabilityから生成する |

### 10-A: context ownership / template path

**判断:** maintainerだけがinstanceの探索、作成、更新、読取範囲の解決を行う。consumerは必要factを伝え、返された範囲だけを読む。

**具体契約:** template sourceはpluginの`skills/tumeda-dev-plugin-context.md`。取得不能時は`unavailable`とし、壊れたinstanceを推測修復しない。

### 10-B: runtime model profile

**判断:** provider固有model名でなく、必要な推論強度profileを正本にする。

**具体契約:** hostにchild model選択面があればprofile相当を選び、なければparent modelを継承する。

### 10-C: remote Git provider tasklist分岐

**判断:** steeringだけがrepository capabilityを読み、公開actionをtasklistへ生成する。

**具体契約:** remote Git provider情報なしではpublish taskを作らない。ありの場合もuser確認後にpreflight、commit、push、PRを行い、失敗時は推測fallbackしない。

### 分解と焦点移動の経路

1. 初期提案が4契約を一括していると判明した。
2. context ownershipとtemplate pathを10-Aとして先に確定した。
3. 次の未決であるmodel profileへ焦点を移し、10-Bを確定した。
4. 最後にremote Git provider公開分岐を10-Cとして確定し、3 decisionを再統合した。
```

### このcaseでの修正方針

- 複数decisionへ分解した時点で、通常のiteration versioningを止め、decision一覧をnavigationの正本にする。
- `現在の焦点`は固定fieldにせず、未決decisionが残る時だけ一覧上で示す。
- 各decisionは完成判定が異なるため、同じ`ルール / 適用例`構造を強制しない。
- 最後に個別結論を再統合するが、個別本文を一つの巨大な完全提案として再掲しない。

---

## C5: READMEのpathを決めても、作られるfileの中身へ合意できない

### source

非公開の利用先記録から一般化したcase（論点11「画面イメージと設計意図のストック」）

### before

```text
初期decision
  UIの配置意図をsrc/app/saved-items/README.mdへ保存する

iteration 1
  appは統合層で、UI責務はcomponents側だと指摘された
  src/components/savedItem/README.mdへpath変更
  src/app/saved-items/README.mdは作らない

decision
  提案1採用

next action
  design.md 3-4 docsと変更一覧を修正
```

### 何が伝わらなかったか

- どのdirectoryをownerにするかは分かるが、新規READMEが何を正本にし、どんな見出しと本文を持つか分からない。
- 画面の情報配置は議論済みだが、それをREADMEへどの粒度で保存するかは実装時判断として残る。
- `design.mdを修正する`への合意が、README本文への合意に見えてしまう。
- 作らないfileは分かるが、既存componentとの位置関係がtreeで見えない。

### after試作

````markdown
## 論点11: UI配置意図を保存するownerとREADME内容

**ステータス:** 決定

### 保存先を変える理由

UIの情報順序、強調、配置意図はpage統合層ではなくpresentation componentの責務である。`app/saved-items`はdata取得とcomponent統合を担い、UI設計意図の正本にはしない。

### 完成後の配置

```text
src/
  app/saved-items/
    page.tsx
  components/savedItem/
    README.md              # 新規: UI配置と設計意図の正本
    SavedItemCard.tsx
    SavedItemDetail.tsx
```

`src/app/saved-items/README.md`は作成しない。

### READMEによって成立させる判断

componentを変更する人が、過去の会話を読み直さず、一覧と詳細で何を先に見せ、どの操作を本文より優先するかを判断できる。

### READMEの見出しoutline

1. このdirectoryの責務
2. 一覧cardの情報順序と理由
3. 詳細表示の情報順序と理由
4. 吟味actionを本文より前へ置く条件
5. component変更時に同時更新する設計意図

### 判断に必要な代表本文

```markdown
## 詳細表示

表示順は、タイトル、メタ情報、吟味action、本文全文とする。本文は雰囲気を確認する補助情報であり、長文を読み切らなくてもタイトルとメタ情報から吟味操作へ進めるよう、本文を最後に置く。
```

### owner修正の経路

1. 初期案では画面単位の直感から`app/saved-items`を保存先にした。
2. architecture上、appは統合層、componentsはpresentation ownerだと確認した。
3. 保存先をcomponentsへ変更し、app側READMEは作らないと決めた。

### 決定

上記tree、outline、代表本文を持つ`src/components/savedItem/README.md`を作成する。
````

### このcaseでの修正方針

- file作成・変更iterationでは、path差分だけでなく、対象に合うdeliverable previewを差し込む。
- documentationなら、読者、成立させる判断、outline、判断に重要な代表本文、作らないfileを示す。
- directory変更ならtree、code変更ならbefore / after、画面ならwireframeというようにvariantを選ぶ。
- previewは全fileへ固定で要求せず、合意後に実装者が内容を独自判断する余地がある時に使う。

---

## 5 caseから得た共通骨子 v0

この段階ではtemplateの確定案ではない。5個のafterに共通して必要だった最小骨子だけを記録する。

```text
論点のidentityと状態
提起の背景または具体的なproblem
現在成立させる判断内容
  └─ 内容に応じたvariant section
判断の展開
  └─ iterationの作用に応じたvariant
決定
非defaultな停止位置・次の焦点（存在する時だけ）
```

### 現在の判断内容へ差し込むvariant v0

`outcome-sections`と同じく、file種別だけでなく「何へ合意するか」で選ぶ。一つの論点が複数themeを持つ場合は複数variantを合成する。

| 判断対象 | variant | 合意できるまでに見せるもの |
| --- | --- | --- |
| policy・恒久的なrule | 方針と具体契約 | 上位方針、内容固有名を持つ契約、適用例、能力境界 |
| 原因と修正scope | 現在の診断 | 現在の根本原因、説明できる事象、修正scope |
| 外部制約を持つ技術判断 | 現在の契約と受容制約 | 実装契約、成立条件、受け入れる弱点、棄却案 |
| 複数decision | decision一覧 | decision boundary、状態、個別結論、現在の焦点 |
| documentation file | document preview | tree、読者、成立させる判断、outline、代表本文、非作成file |
| directory / module配置 | structure preview | 完成後tree、責務、移動元、依存方向 |
| code・挙動変更 | change preview | 必要範囲のbefore / after、変える範囲、変えない範囲 |
| screen変更 | screen preview | wireframe、情報順序、強調、今回変わる状態 |

### 判断の展開へ差し込むiteration variant v0

| iterationで起きたこと | 記録する組 |
| --- | --- |
| 同じ診断のまま提案を修正 | feedback / 問題だった部分 / 変えた判断 |
| 診断を更新 | 前の診断 / 新しい発見 / 現在の診断 / 修正scopeの変化 |
| 前提をevidenceで反証 | evidence / 無効になった判断 / 置換先 / まだ残る制約 |
| decisionを分解 | 分解理由 / decision一覧 / 順序 / 現在の焦点 |
| scopeまたはtopicを移動 | 移動理由 / 移動先 / 元topicに残る判断 |
| 具体像を追加 | 合意前に欠けていた判断 / 選んだpreview / previewから確定したこと |

## v1で意図的に固定しないもの

- `現在案`という一つの固定見出し名
- すべてのiterationに同じfieldを要求すること
- すべてのentryへtree、outline、before / afterを置くこと
- `ネクストアクション`fieldの一律削除
- 現在の判断内容を上、展開を下へ置く順序

次は、この共通骨子とvariantで全iteration論点を説明できるかを確認する。説明できないcaseがあれば、そのcaseをC6以降へ追加し、before / afterとvariantを更新する。
