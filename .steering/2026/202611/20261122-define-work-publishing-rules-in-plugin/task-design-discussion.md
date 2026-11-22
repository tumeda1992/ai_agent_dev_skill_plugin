# 議論記録

## 論点1: 設計の骨格 — 何を変え、何を変えず、どの順で決めるか

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 一つずつ考える（波及: 骨格が論点2〜8の範囲を決める。他は小）

### イテレーション0（論点1）: 今ある公開の規則を一覧にし、行き先を論点で決める骨格を示す

#### 提案0（論点1）

##### 変えること

- 作業の公開の流れ（作業の終わりに、commit、push、PR、merge、既定branchのpushのどこまでを、誰が、どの順で行うか）を、pluginの規則として一つ書く。
- pluginのworkflow（`tasklist-design.md` が作るcommit・push・PRのsection、steeringの`planless_complete`の完了、`escalate-plugin-skill-fix` の取り込み）は、その規則に従う。利用先の文脈に公開の欄があるかどうかで、公開の段を出す・出さないを変えない。
- 利用先の文脈には、repositoryのfactだけを残す。残すfactの候補は次のとおり。
  - remote
  - 既定branchの名前（`main`、`master`）
  - branchの形式（`issue-<番号>`、`feature-<issue番号>`）
  - PR作成scriptのpath（plugin repositoryだけ）
  - 既定branchへのmergeが本番へ適用されるか（`x_favorites` のAmplifyのbuild）
  - mergeの方式（`nanitabe` のsquash merge）
- pluginの規則と同じことを書き写した記述は、文脈から消す。`Closes` の付け方、検証のためのmerge、commitの分け方、PR作成script、動作確認前の禁止がこれに当たる。

##### 変えないこと

- `branch_pr_issue.md` の `Closes` と二つのmerge経路。branchの形式を利用先が宣言する仕組み。
- 動作確認の前にcommit・push・PRを行わない規則。
- `share-work-in-progress`。動作確認の前に今のbranchを見せる別の場面である。

##### 進め方

今ある公開の規則を、[contract-ledger.md](./contract-ledger.md) に一覧にした（利用先の文脈に23件、pluginに10件）。各記述の行き先を、次の論点で決める。

```text
論点2 作業の終わりに、公開をどこまで必ず行うか（commit→push→PR）
  └→ 論点3 mergeと既定branchのpushを、誰が行うか（mergeが本番へ適用されるrepositoryを含む）
        ├→ 論点4 escalate-plugin-skill-fixから引き渡された作業も、同じ流れにするか
        ├→ 論点5 steeringのplanless_completeに、公開の段を足すか
        └→ 論点7 利用先の文脈とtemplateに残すfactの欄
              ├→ 論点6 規則の置き場（新しい文書か、既存の文書・skillか）
              └→ 論点8 利用先repositoryの文脈の書き換えを、この作業で行うか
```

論点2と論点3は、重さが「一つずつ考える」なので一往復に一件ずつ出す。論点4・5・7は論点3が決まった後にまとめて出す。論点6は、置き場を決める前に`skill-update-review`を当てる。

#### 検討記録（論点1・イテレーション0）

##### 起点

issue #2 の作業をplanlessで完了した時、steeringには公開の段が無く、assistantは「PRが要るなら言って」と聞いた。利用者は「PR作ったうえでmainでマージしてpushする」手順があると思っていた。このrepositoryの文脈には、escalate-plugin-skill-fix経由の作業だけ「PRを経由せずmainへmergeしてpush」が書かれていた。

##### pluginが公開の段を文脈に委ねている箇所

`tasklist-design.md`「実装後feedbackと公開action」は、文脈にlocal Git運用条件・GitHub公開条件の記載がある時だけ、tasklistにcommit section・push・PR sectionを作る。記載が無ければ利用者へ確認し、答えを`maintenance-plugin-context`が文脈へ書き戻す。同じ文書の「利用者にしかできない操作」は、PRのmergeと既定branchへのmergeを禁じるかを「repositoryのcontext fileとpluginの規則が決める」としている。steeringの`planless_complete`は、tasklistが無いので公開の段がどこにも無い。

##### 利用先の文脈が持つ記述

| repository | 持つ記述 |
| --- | --- |
| `fortune_calculator` | commit・push・PRは利用者が頼んだ時だけ行う。PRは`master`へ作り、mergeは利用者が行う。`Closes`の付け方。PRはscriptで作る |
| `x_favorites` | commitは動作確認の後、phase・意味単位。push・PRはnon-default branchからscriptで作る。mergeは利用者、assistantはmergeしない。`Closes`の付け方。検証のためのmerge。mainへのmergeはAmplifyの本番buildを起こす。動作確認前にcommit・push・PRしない |
| `nanitabe` | 公開可能なbranchは`feature-<issue番号>`。PRは`main`へ作る。squash merge運用 |
| `grow-product-ideas` | 文脈のfileが無い |
| `article_workspace` | 公開の欄が無い |

`Closes`の付け方、検証のためのmerge、commitの分け方、PRのscript、動作確認前の禁止は、pluginの`branch_pr_issue.md`・`tasklist-design.md`・`steering`・`tasklist-executor`と同じ規則の写しである。

##### 決まっていないこと

利用先ごとに違っている規則は二つある。

- 公開をどこまで必ず行うか: `fortune_calculator`は「頼まれた時だけ」、他は文脈の欄があればtasklistに入る。
- 誰がmergeするか: `fortune_calculator`・`x_favorites`は「利用者」。`x_favorites`は issue #31 で合意し、理由はmainへのmergeが本番のbuildを起こすことである。issue #2 の作業では、利用者の指示でassistantがmergeした。

この二つは、どちらに決めても他方の答えが残る別の問いなので、論点2と論点3に分けた。

#### 提案0へのフィードバック（論点1）

**結果:** 採用

> ん？なんの続き？

assistantは、sessionの上限で止まった後の再開だったため、提案の前提を示し直した。issue #2 を PR #30 で完了したこと、利用者の「pluginに書いてconsumer依存にしないで」を受けてこのsteeringを始めたこと、この提案がその設計の骨格であることを示した。

> ok

### 決定（論点1）

（イテレーション1で再開。下の決定は、対象をすべての利用先repositoryと読み違えたまま合意した時点のものである）

提案0の骨格で進める。作業の公開の流れをpluginの規則として一つ書き、pluginのworkflowはそれに従う。利用先の文脈にはrepositoryのfactだけを残し、pluginの規則の写しは消す。`branch_pr_issue.md`の`Closes`と二つのmerge経路、branchの形式を利用先が宣言する仕組み、動作確認の前にcommit・push・PRをしない規則、`share-work-in-progress`は変えない。各記述の行き先は[contract-ledger.md](./contract-ledger.md)を土台に、論点2から順に決める。

### イテレーション1（論点1）: 対象をplugin repository自身の作業の公開に絞り、骨格を出し直す

#### 提案1（論点1）

##### 対象

plugin repository（`ai_agent_dev_skill_plugin`）自身の作業の公開だけを扱う。利用先repositoryの公開の規則（`fortune_calculator`・`x_favorites`・`nanitabe`の文脈、`tasklist-design.md`が文脈の欄で公開の段を出し分ける仕組み）は変えない。

##### plugin repositoryの作業の公開

| 作業の始まり | 公開の流れ | 根拠 |
| --- | --- | --- |
| escalate-plugin-skill-fixから引き渡された | 今のまま。PRを作らず、作業branchをpushし、mainへmergeしてpushし、pluginをupdateする（`integrate-plugin-changes.md`） | 2026-08-31の決定と、今回の「プラグインのエスカレによる更新はついでになるから、まぁ手元でできた方が良い」 |
| それ以外（issueから始めた作業等） | PRを作り（`Closes`は`branch_pr_issue.md`に従う）、assistantがmainへmergeしてpushする | 「PR作ったうえでmainでマージしてpushする」「本当はpr経由にしたい」、論点3の決定 |

##### 置き場

この規則はpluginが持つ。今、escalate経由の流れを`tumeda-dev-plugin-context.md`の「Git / GitHub公開条件」にも書いているが、このfileは利用先へ配る文脈のtemplateも兼ねる。plugin repositoryの規則をここに置くと、利用先の文脈へ写る。

TBD: pluginのどこに置くか（`integrate-plugin-changes.md`をplugin repositoryの作業全体の取り込みへ広げる、`maintenance_policies/`に置く、等）。決める前に`skill-update-review`を当てる。

##### 残る論点

- 論点2: plugin repositoryの作業に絞って決め直す（作業の終わりに、聞かずにPRまで作るか）。
- 論点5: steeringの`planless_complete`で、この規則をどこで行うか。
- 論点6: 規則の置き場。
- 論点7: plugin repositoryの文脈（`Git / GitHub公開条件`）から消す記述と残す記述。

取り下げる論点:

- 論点4: 上の表で決まる（escalate経由は今のまま）。
- 論点8・論点9・論点10: 利用先repositoryの規則を対象にしないため。

#### 検討記録（論点1・イテレーション1）

論点3への応答で、対象がplugin repositoryに限ると訂正された。読み違えた所は、利用者の「この規約がnanitabeとかリポジトリにあるのおかしいな。pluginが主語の話だから」の「この規約」である。assistantは、直前に示した`fortune_calculator`・`nanitabe`の公開の規則を指すと読んだ。利用者が指していたのは、plugin repositoryの作業の公開の規則である。

plugin repositoryの文脈のfile（`.agents/skills/tumeda-dev-plugin-context.md`）は`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`へのsymlinkであり、`maintenance-plugin-context`は利用先にinstanceが無い時にこのfileをtemplateとして写す。plugin repositoryの規則をこのfileに書くと、利用先へ配るtemplateに入る。

#### 提案1へのフィードバック（論点1）

**結果:** 修正して採用。escalate経由の作業もPRを作る

> いや、だからこそプラグインはエスカレでPR作りたい。最初に違う方針にしたとしても
>
> なんでかというと、他に関してはpr経由のマージだからスカッシュマージだけど、プラグインのエスカレはローカルのmainマージになるからどの塊か分かりづらいのよ。で、prでのマージはaiに任せたくない。だから、記録としてprを作りたい（最初も同じ意図だからPR作るようにしたと思ってたけど）

対象をplugin repository自身の作業に絞ることは採用された。表のescalate経由の行（PRを作らない）は、2026-08-31の決定を引き継いだもので、利用者に退けられた。PRは、mergeの手段ではなく、ひとまとまりの変更の記録として作る。GitHub上でPRをmergeする操作はassistantに任せない。mergeは手元で行う。

### 決定（論点1）

（イテレーション1で再開し、提案1を修正して決めた。それより前の決定は、対象をすべての利用先repositoryと読み違えたまま合意した時点のもの）

対象は、plugin repository（`ai_agent_dev_skill_plugin`）自身の作業の公開だけである。利用先repositoryの公開の規則と、`tasklist-design.md`が文脈の欄で公開の段を出し分ける仕組みは変えない。

plugin repositoryの作業は、escalate経由かどうかによらず、作業branchをpushし、PRを作り、assistantが手元でmainへmergeしてpushする。PRは、ひとまとまりの変更の記録として作る。GitHub上でPRをmergeする操作はassistantが行わない。

理由: 他のrepositoryはPR経由のsquash mergeであり、どの変更がひとまとまりかがPRで分かる。plugin repositoryのescalate経由の作業は手元でmainへmergeしていたため、ひとまとまりが分かりづらい。PRのmergeはAIに任せたくないので、PRは記録として作る。

この規則はpluginが持つ。`tumeda-dev-plugin-context.md`は利用先へ配る文脈のtemplateも兼ねるため、plugin repositoryの規則を置かない。置き場は論点6で決める。

2026-08-31の決定（`.steering/2026/202608/20260831-add-incident-flow-and-subagent-boundary/`、escalate経由はPRを作らない）のうち、PRを作らない点はこの決定で置き換える。そこで決めた「`steering`の完了後actionを変えない」「pluginの更新をさっと済ませてメインの作業へ戻る」は保つ。

## 論点2: 作業の終わりに、公開をどこまで必ず行うか

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 一つずつ考える（波及: すべての作業の終わりの振る舞いが変わる。他は小）

（論点1のイテレーション1で対象がplugin repositoryに絞られたため、イテレーション1で決め直す。下のイテレーション0の決定は、対象をすべての利用先repositoryと読み違えたまま合意した時点のもの）

### イテレーション0（論点2）: 作業の終わりに、利用者に聞かずに行う公開の範囲を比べる

#### 提案0（論点2）

作業の終わりに、assistantが利用者に聞かずに行う公開の範囲を決める。作業の終わりは、tasklistがある作業では利用者の確認と最後のtaskが終わった時、planlessの作業ではsteeringの締めくくりのreviewが終わった時である。動作確認の前にcommit・push・PRをしない規則は変えない。mergeとmainのpushを誰が行うかは論点3で決める。

- a. commit → 作業branchのpush → PRの作成まで、必ず行う。PRの`Closes`は`branch_pr_issue.md`に従う（推奨）
- b. commitと作業branchのpushまで必ず行う。PRは利用者が頼んだ時だけ作る
- c. どれも利用者が頼んだ時だけ行う（`fortune_calculator`の今の規則を全体へ広げる）
- d. 作業の終わりに、どこまで行うかを毎回利用者へ聞く（今のplanlessの終わりと同じ）

aを推す理由: 利用者の言う手順（「PRはいつもいる」「PR作ったうえでmainでマージしてpushする」）は、PRを作ることを毎回の手順にしている。b〜dは、PRを作る段で毎回往復が一つ増える。今回のissue #2の終わりでも、dと同じ問いで一往復した。

どの案でも、次の場合は行えるところまで行い、止まった所と理由を報告する。

- remoteが無い、GitHubでない: commitまで行う。
- 実行環境が、利用者の明示の指示なしのPRの作成やpushを禁じる（cloud sessionの指示等）: 実行環境の指示に従い、行う前に利用者へ確認する。

#### 検討記録（論点2・イテレーション0）

##### 今の規則

- `tasklist-design.md`は、文脈にlocal Git運用条件・GitHub公開条件の欄がある時だけ、tasklistにcommit section・push・PR sectionを作る（[contract-ledger.md](./contract-ledger.md) P1・P2）。欄が無ければ利用者へ確認し、答えを文脈へ書き戻す。
- steeringの`planless_complete`には公開の段が無い（P6）。
- `fortune_calculator`の文脈は「commit・push・PR の作成は、利用者が頼んだ時だけ行う」（L8）。`x_favorites`の文脈は、commitを動作確認の後に行い、push・PRをscriptで作る（L12、L13）。`nanitabe`の文脈は「PR: `feature-<issue番号>` から `main` へ作成する」（L22）。

##### 根拠にする利用者の発言

issue #2の終わりの「PRはいつもいるっていう手順にしてなかったっけ？PR作ったうえでmainでマージしてpushするっていう」。`fortune_calculator`の「頼んだ時だけ」は、この発言と食い違う。どちらを全体の規則にするかを、この論点で決める。

##### 論点を分けたもの

`contract-ledger.md`のL2・L7・L20は「既定branchの上で直接commitしない。作業はbranchで行う」を含む。これは「どこまで公開するか」とは別の問いなので、論点9に分けた。

#### 提案0へのフィードバック（論点2）

**結果:** a を採用

> ok

一件だけを示した往復への「ok」であり、推した案aへの同意として読む。

### 決定（論点2）

作業の終わりに、assistantは利用者に聞かずに、commit → 作業branchのpush → PRの作成まで行う。PRの`Closes`は`branch_pr_issue.md`に従う。作業の終わりは、tasklistがある作業では利用者の確認と最後のtaskが終わった時、planlessの作業ではsteeringの締めくくりのreviewが終わった時である。動作確認の前にcommit・push・PRをしない規則は変えない。remoteが無い、またはGitHubでない時はcommitまで行う。実行環境が明示の指示なしのPRの作成やpushを禁じる時は、その指示に従い、行う前に利用者へ確認する。どちらの場合も、止まった所と理由を報告する。

選んだ理由: 利用者の手順（「PRはいつもいる」「PR作ったうえでmainでマージしてpushする」）はPRまでを毎回の手順にしている。PRを頼まれた時だけ作る案、毎回聞く案は、PRの段で毎回往復が一つ増える。`fortune_calculator`の「頼んだ時だけ行う」は、この規則に置き換わる。

### イテレーション1（論点2）: plugin repositoryの作業に絞って決め直す

**重さ:** 確かめるだけ（全観点が小。論点1の決定と利用者の原文から決まる）

#### 提案1（論点2）

plugin repositoryの作業の終わりに、assistantが利用者に聞かずに行う範囲。

- a. commit → 作業branchのpush → PRの作成 → 手元でmainへmerge → mainのpush → pluginのupdate まで行う（仮決め）
- b. PRの作成まで行い、mainへのmergeは毎回利用者に聞く

aを仮決めにした根拠: 論点1の決定（PRを記録として作り、assistantが手元でmainへmergeしてpushする）と、利用者の「PR作ったうえでmainでマージしてpushする」。pluginのupdateは、今の`integrate-plugin-changes.md`の「pluginをupdateする」をそのまま続ける。

行えない時は、行えるところまで行い、止まった所と理由を報告する。実行環境が利用者の明示の指示なしのPRの作成やmainへのpushを禁じる時（cloud sessionの指示等）は、その指示に従い、行う前に利用者へ確認する。利用者の環境にあるpluginのupdateを、実行環境から行えない時も同じである。

#### 検討記録（論点2・イテレーション1）

イテレーション0は、対象をすべての利用先repositoryと読み違えたまま「作業の終わりにPRの作成まで毎回行う」と決めていた。論点1のイテレーション1で対象がplugin repositoryに絞られ、mergeまで含めることが決まったため、範囲をmainのpushとpluginのupdateまで広げて決め直す。

#### 提案1へのフィードバック（論点2）

**結果:** a を採用

> ok。あと、重さってセッションに出さなくていいわ。うるさい。気になったら自分でディスカッションファイル見にいく

論点2・論点7・論点10を一往復で示した時の返事である。「ok」は全部okと同じ扱いで、三つとも仮決めのaを採る。後半は示し方への指摘であり、論点11として立てた。

### 決定（論点2）

plugin repositoryの作業の終わりに、assistantは利用者に聞かずに、commit → 作業branchのpush → PRの作成 → 手元でmainへmerge → mainのpush → pluginのupdate まで行う。行えない時は、行えるところまで行い、止まった所と理由を報告する。実行環境が利用者の明示の指示なしのPRの作成やmainへのpushを禁じる時（cloud sessionの指示等）、利用者の環境にあるpluginのupdateを実行環境から行えない時は、その手前で利用者へ確認する。

根拠: 論点1の決定と、利用者の「PR作ったうえでmainでマージしてpushする」。

## 論点3: mergeと既定branchのpushを、誰が行うか

**ステータス:** 決定

**種別:** TBDヒアリング、認識齟齬

**重さ:** 一つずつ考える（戻しにくさ: mergeが本番へ適用されるrepositoryでは、merge一回で本番が変わる。他は小）

### イテレーション0（論点3）: PRを作った後のmergeを、誰がどの条件で行うかを比べる

#### 提案0（論点3）

論点2で、作業の終わりにPRの作成まで毎回行うと決めた。その後の、PRのmergeと既定branchを最新にするところまでを、誰が行うかを決める。どの方法でmergeするか（GitHubでPRをmergeするか、localでmergeしてpushするか、squashか）は論点10で決める。

- a. assistantが毎回mergeする。mergeが本番へ適用されるrepositoryでも同じ
- b. assistantがmergeする。既定branchへのmergeが本番へ適用されるrepositoryでは、mergeの前に利用者へ一問だけ確認する（推奨）
- c. assistantがmergeする。既定branchへのmergeが本番へ適用されるrepositoryでは、利用者がmergeする
- d. 毎回、利用者がmergeする（今の`fortune_calculator`・`x_favorites`の規則を全体へ広げる）

bを推す理由: 利用者の手順（「PR作ったうえでmainでマージしてpushする」）は、mergeまでを手順にしている。一方で`x_favorites`は、mainへのmergeがAmplifyの本番buildを起こすことを理由に、利用者がmergeすると issue #31 で合意している。本番への適用は戻しにくく、いつ適用するかを利用者が選べる必要がある。bは、その時だけ一問で選べるようにし、mergeの操作そのものは利用者へ渡さない。cは、本番へ適用されるrepositoryで毎回利用者の手作業が残る。aは、作業の終わりのたびに利用者の知らないうちに本番が変わる。

本番へ適用されるかは、repositoryのfactとして文脈に書く（論点7）。書かれていないrepositoryでは、適用されないものとして扱う案にする。

#### 検討記録（論点3・イテレーション0）

##### 今の規則

- `fortune_calculator`: 「PR は `master` へ作る。merge は利用者が行う。」（[contract-ledger.md](./contract-ledger.md) L9）
- `x_favorites`: 「既定 branch（`main`）への merge は利用者が行う。assistant は merge しない。」（L14）。「`main` への merge は Amplify の本番 build を起こす。」（L17）。確認元は issue #31 の tasklist 設計での合意。
- `nanitabe`: squash merge運用（L23）。mergeの担当は書かれていない。
- plugin repository: escalate-plugin-skill-fix経由の作業はassistantがmainへmergeしてpushする（L3）。それ以外は書かれていない。issue #2 の作業では、利用者の指示でassistantがmergeした。
- `tasklist-design.md`「利用者にしかできない操作」は、PRのmergeと既定branchへのmergeを禁じるかを「repositoryのcontext fileとpluginの規則が決める」としている（P3）。

##### 根拠にする利用者の発言

- 「PR作ったうえでmainでマージしてpushするっていう」
- 「この規約がnanitabeとかリポジトリにあるのおかしいな。pluginが主語の話だから。pluginに書いてconsumer依存にしないで」

mergeの担当をrepositoryごとの文脈で決める形は、二つ目の発言に反する。一方、mainへのmergeが本番へ適用されるかはrepositoryごとに違うfactである。b・cは、規則はpluginに一つ置き、そのfactだけを文脈から読む形になる。

##### 論点を分けたもの

mergeの方法（GitHubでPRをmergeするか、localでmergeしてpushするか、mergeの方式）は、assistantがmergeする時にだけ要る別の問いなので、論点10に分けた。

#### 提案0へのフィードバック（論点3）

**結果:** a を採用。対象はplugin repositoryに限ると訂正された

> いや、aだし、これはプラグインに限る話。本当はpr経由にしたいけど、プラグインのエスカレによる更新はついでになるから、まぁ手元でできた方が良いなって。というか、この話立ち上げ当初かエスカレ作ったときとかにしたのに全く同じ話をすることになってる

assistantは、論点1の骨格で、利用者の「pluginが主語の話」を「すべての利用先repositoryの公開の規則をpluginが持つ」と読んでいた。利用者の意図は、plugin repository自身の作業の公開の規則である。論点1・論点2は、この読み違えの上で決めていたため、論点1を再開する。

同じ話は `.steering/2026/202608/20260831-add-incident-flow-and-subagent-boundary/task-design-discussion.md` で決めていた。escalate-plugin-skill-fixから引き渡されたplugin repositoryの作業は、PRを作らず、作業branchをpushし、mainへmergeしてpushする。利用者の原文は「このスキルが使われるホームポジションはpluginを使う側であり、使う側のリポジトリにとってpluginはサブであり、自活したい。わざわざgithubを開いてPRをマージするより、さっとpluginを更新してメインの動きに戻りたい」。assistantは、この論点群を立てる前に同じrepositoryの`.steering`の決定を探さなかった。

### 決定（論点3）

plugin repositoryの作業では、assistantがmainへmergeしてpushする。利用先repositoryのmergeの担当は、この作業の対象にしない。

## 論点4: escalate-plugin-skill-fixから引き渡された作業も、同じ流れにするか

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** まとめて考える（利用者の前提への依存: 中。今は意図してPRを経由しない理由が書かれている。他は小）

### 決定（論点4）

同じ流れにする。escalate経由の作業もPRを作る。利用者が論点1の提案1へのフィードバックで決めた（「だからこそプラグインはエスカレでPR作りたい。最初に違う方針にしたとしても」）。提案を出す前に答えが決まったため、案は出していない。

## 論点5: steeringのplanless_completeに、公開の段を足すか

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** まとめて考える（波及: 中。tasklistを作らない作業すべての終わりが変わる。他は小）

### 決定（論点5）

取り下げる。論点1で対象がplugin repositoryに絞られ、2026-08-31の決定どおり`steering`の完了後actionは変えない。plugin repositoryの作業の終わりに公開の流れを誰が始めるかは、規則の置き場と一緒に論点6で決める。

## 論点6: 公開の流れの規則を、pluginのどこに置くか

**ステータス:** 応答待ち

**種別:** TBDヒアリング

**重さ:** まとめて考える（波及: 中。置き場によって読むskillと読まれる時が変わる。他は小）

### イテレーション0（論点6）: skill-update-reviewの候補を受け、取り込みと反映をescalateの外へ出す置き場を比べる

#### 提案0（論点6）

決めた流れ（作業branchのpush → PRを記録として作る → 手元でmainへ`--no-ff`でmerge → mainのpush → pluginのupdate）を持つ`integrate-plugin-changes.md`の置き場と、escalate経由でない作業の終わりに誰がこの流れを始めるか。

- a. `maintenance-plugin-context/maintenance_policies/`へ移し、中身を決めた流れへ書き換える。`escalate-plugin-skill-fix/SKILL.md`と、plugin repositoryの`AGENTS.md`「repository運用」から案内する（推奨）
- b. 新しいskillとして独立させ、descriptionで「plugin repositoryの作業を終えた時」に起動させる。`escalate-plugin-skill-fix/SKILL.md`と`AGENTS.md`から案内する
- c. `escalate-plugin-skill-fix`の内部指示のまま中身を書き換え、`AGENTS.md`からそのfileを案内する

aを推す理由:

- `maintenance-plugin-context/SKILL.md`は`maintenance_policies/`を「このpluginのskill保守で従う規約」の置き場と案内している。plugin repositoryの作業を取り込み、pluginをupdateする流れは、この範囲に入る。
- 同じ置き場の`migration.md`は、`escalate-plugin-skill-fix`と`AGENTS.md`の両方から案内されている。同じ形になる。
- escalate経由でない作業は、`AGENTS.md`の案内で流れを始める。`AGENTS.md`はplugin repositoryでの作業の開始時に必ず読まれる。そのため、skillのdescriptionで起動させる必要が無い。
- bは、plugin repositoryでしか働かないskillを、すべての利用先へ配ることになる。新しいskillのためMINORの更新にもなる。
- cは、escalate経由でない作業の読者に、escalateの内部指示を読ませることになる。下の`skill-update-review`の候補に当たる。

aの変更は次のとおり。

| 対象 | 変更 |
| --- | --- |
| `escalate-plugin-skill-fix/integrate-plugin-changes.md` | `maintenance-plugin-context/maintenance_policies/integrate-plugin-changes.md`へ移す。読む時を「plugin repositoryでの作業が終わった時。escalate経由かどうかによらない」にする。「mainへ取り込む」を、論点2・論点10で決めた手順と理由（PRは記録、GitHub上のmergeはassistantが行わない、`--no-ff`）へ書き換える。「pluginをupdateする」は変えない |
| `escalate-plugin-skill-fix/SKILL.md` 121行・127行 | linkを移した先へ直す。127行の「PRを経由せず`main`へ取り込み」を「PRを記録として作り、手元で`main`へ取り込み」にする |
| `maintenance-plugin-context/SKILL.md` | `maintenance_policies/`の一覧へ一行足す |
| plugin repositoryの`AGENTS.md`「repository運用」 | 「このrepositoryでの作業が終わったら、escalate経由かどうかによらず、`integrate-plugin-changes.md`に従ってmainへ取り込み、pluginをupdateする」を一行足す |
| `tumeda-dev-plugin-context.md`「Git / GitHub公開条件」 | 論点7で決めた一行を消す |
| `validate-plugin.mjs`、version | assertionを追随させ、PATCHで上げる |

#### 検討記録（論点6・イテレーション0）

##### skill-update-reviewの結果（構造案の採用前）

対象: `escalate-plugin-skill-fix/SKILL.md`と内部指示（`integrate-plugin-changes.md`、`pending-escalations.md`）。全体を読んだ。構造案は、`integrate-plugin-changes.md`をescalateの内部指示のまま書き換える案と、`maintenance_policies/`へ移す案の二つを渡した。

候補: 取り込みと反映（`integrate-plugin-changes.md`）。

- 持つもの: 判断（PRの作り方、mergeの方法、updateの確かめ方）、状態（push済み、PR作成済み、merge済み、update済み）、完了条件（installされたpluginのcommitがmainの先端と一致する）、改訂理由（plugin repositoryの公開の方針）。改訂理由は、escalateの引渡しの方針とは別である。
- 当てた変更case: 「escalate経由でない作業にも、PRを記録として作る流れを当てる」。直す先は`integrate-plugin-changes.md`と、`SKILL.md` 127行の要約（「PRを経由せず」）の二つになった。さらに、escalate経由でない作業の読者が、escalateの内部指示を読むことになる。
- 他の呼び手: escalate経由でないplugin repositoryの作業の終わり（issue #2 の作業が実例）。今、具体的な要求がある。
- 分ける先: `escalate-plugin-skill-fix`の外。別skill、またはescalate以外からも読む共有の規約。

他の工程（plugin repositoryの判定、引渡し、保留と再開）に候補は無い。保留と再開は、既に`pending-escalations.md`が独立した内部指示として持っている。

今の作業で切り出すかは、[`work_scope.md`](../../../../plugins/tumeda-dev/docs/development_standards/development_flow/work_scope.md)の一段目で判定した。取り込みと反映の置き場は今回決める規則の置き場そのものなので、目的の内である。そのため、この論点の選択肢として扱う。

#### 提案0へのフィードバック（論点6）

## 論点7: 利用先の文脈とtemplateに残すfactの欄

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全観点が小。論点1の決定で、対象がplugin repositoryの文脈の一行になった）

### イテレーション0（論点7）: plugin repositoryの文脈から、pluginの規則の写しを消す

#### 提案0（論点7）

plugin repositoryの文脈（`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`の「Git / GitHub公開条件」）について。

- a. escalate経由の取り込みの一行（[contract-ledger.md](./contract-ledger.md) L3）を消し、remote、既定branch、PR作成scriptのpath（L1、L2、L4）は残す（仮決め）
- b. 今のまま残す

aを仮決めにした根拠: 論点1の決定（plugin repositoryの規則を、利用先へ配る文脈のtemplateに置かない）。L1・L2・L4はplugin repositoryのfactで、pluginの規則の写しではない。消す一行の中身は、論点6で決める置き場が持つ。

#### 提案0へのフィードバック（論点7）

**結果:** a を採用

> ok。あと、重さってセッションに出さなくていいわ。うるさい。気になったら自分でディスカッションファイル見にいく

論点2・論点7・論点10を一往復で示した時の返事である。「ok」は全部okと同じ扱いで、三つとも仮決めのaを採る。後半は示し方への指摘であり、論点11として立てた。

### 決定（論点7）

plugin repositoryの文脈（`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`の「Git / GitHub公開条件」）から、escalate経由の取り込みの一行（[contract-ledger.md](./contract-ledger.md) L3）を消す。remote、既定branch、PR作成scriptのpath（L1、L2、L4）は残す。

根拠: 論点1の決定（plugin repositoryの規則を、利用先へ配る文脈のtemplateに置かない）。残す三行はplugin repositoryのfactで、pluginの規則の写しではない。

## 論点8: 利用先repositoryの文脈の書き換えを、この作業で行うか

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** まとめて考える（波及: 中。三つのrepositoryの文脈を書き換える。他は小）

### 決定（論点8）

取り下げる。論点1で、利用先repositoryの公開の規則は対象にしないと決めた。

## 論点9: 既定branchの上で直接commitしないことを、pluginの規則にするか

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全観点が小。三つのrepositoryの文脈が同じことを書いている）

### 決定（論点9）

取り下げる。論点1で、利用先repositoryの公開の規則は対象にしないと決めた。

## 論点10: assistantがmergeする時の方法

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全観点が小。論点1で対象がplugin repositoryに絞られ、利用者の理由から決まる）

### イテレーション0（論点10）: 手元のmergeで、ひとまとまりとPRが分かる形にする

#### 提案0（論点10）

- a. 手元で`git merge --no-ff <作業branch>`を行い、merge commitのmessageを「Merge pull request #<PR番号>: <PRの題名>」にする（仮決め）
- b. merge commitを作るかを指定しない（2026-08-31の決定のまま）

aを仮決めにした根拠: 利用者の理由「ローカルのmainマージになるからどの塊か分かりづらい」。fast-forwardになると、mainの履歴からひとまとまりの境目が消える。merge commitにPR番号を入れれば、mainの履歴からPRを引ける。issue #2 のPR #30 は、この形で取り込み、GitHubはPRをmerge済みとして扱い、`Closes #2`でissueを閉じた。

#### 検討記録（論点10・イテレーション0）

mainの既存のmerge commitは「Merge branch '<branch名>'」の形で、PRを持たない。PR #30 だけが「Merge pull request #30: steeringの自走力を上げる」である。

#### 提案0へのフィードバック（論点10）

**結果:** a を採用

> ok。あと、重さってセッションに出さなくていいわ。うるさい。気になったら自分でディスカッションファイル見にいく

論点2・論点7・論点10を一往復で示した時の返事である。「ok」は全部okと同じ扱いで、三つとも仮決めのaを採る。後半は示し方への指摘であり、論点11として立てた。

### 決定（論点10）

手元で`git merge --no-ff <作業branch>`を行い、merge commitのmessageを「Merge pull request #<PR番号>: <PRの題名>」にする。

根拠: 利用者の「ローカルのmainマージになるからどの塊か分かりづらい」。fast-forwardになるとmainの履歴からひとまとまりの境目が消える。merge commitにPR番号を入れれば、mainの履歴からPRを引ける。

## 論点11: chatで論点の重さ（段）を示すのをやめるか

**ステータス:** 応答待ち

**種別:** 認識齟齬

**重さ:** 確かめるだけ（全観点が小。利用者の原文から決まり、直すのは一文）

### イテレーション0（論点11）: round-trip.mdのchatの示し方から段を外し、この作業で直すかを決める

#### 提案0（論点11）

利用者の指摘（「重さってセッションに出さなくていいわ。うるさい。気になったら自分でディスカッションファイル見にいく」）は、`facilitate-discussion/round-trip.md`の「chatでは、各論点の番号と段、仮決めの根拠を示し」に従った示し方へのものである。議論記録の`**重さ:**`の欄は変えず、chatから段を外す。

```diff
-chatでは、各論点の番号と段、仮決めの根拠を示し、案は記号を付けて並べる。
+chatでは、各論点の番号と仮決めの根拠を示し、案は記号を付けて並べる。論点の段はchatに示さない。段は一往復の組を選ぶためのものであり、利用者が気になれば議論記録の`**重さ:**`を読む。
```

`validate-plugin.mjs`にこの文のassertionを足す。今のassertionが「番号と段」を固定していれば追随させる。

- a. この作業で直す。この作業の他の変更とは別のcommitにする（仮決め）
- b. `escalate-plugin-skill-fix`の既定どおり保留し、この作業の後に別のsteeringで直す

aを仮決めにした根拠: [`work_scope.md`](../../../../plugins/tumeda-dev/docs/development_standards/development_flow/work_scope.md)の二段目。目的の外の不備だが一文の修正で、別のcommitにすればこの作業のreview・revertの単位を崩さない。

#### 検討記録（論点11・イテレーション0）

指摘を受けた時点から、assistantはchatで段を示すのをやめた。規則の文を直すかは、利用者の指示がchatの示し方に限られるため、論点として問う。

#### 提案0へのフィードバック（論点11）
