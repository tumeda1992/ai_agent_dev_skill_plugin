# 議論記録

## 論点1: 設計の骨格 — 何を変え、何を変えず、どの順で決めるか

**ステータス:** 応答待ち

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

## 論点2: 作業の終わりに、公開をどこまで必ず行うか

**ステータス:** 依存先待ち

**種別:** TBDヒアリング

**重さ:** 一つずつ考える（波及: すべての作業の終わりの振る舞いが変わる。他は小）

**依存先:** 論点1（骨格が決まれば、案を作れる）

## 論点3: mergeと既定branchのpushを、誰が行うか

**ステータス:** 依存先待ち

**種別:** TBDヒアリング

**重さ:** 一つずつ考える（戻しにくさ: mergeが本番へ適用されるrepositoryでは、merge一回で本番が変わる。他は小）

**依存先:** 論点2（どこまで公開するかが決まれば、mergeを流れに含めるかの案を作れる）

## 論点4: escalate-plugin-skill-fixから引き渡された作業も、同じ流れにするか

**ステータス:** 依存先待ち

**種別:** TBDヒアリング

**重さ:** まとめて考える（利用者の前提への依存: 中。今は意図してPRを経由しない理由が書かれている。他は小）

**依存先:** 論点3（mergeの担当が決まれば、取り込みの手順と比べられる）

## 論点5: steeringのplanless_completeに、公開の段を足すか

**ステータス:** 依存先待ち

**種別:** TBDヒアリング

**重さ:** まとめて考える（波及: 中。tasklistを作らない作業すべての終わりが変わる。他は小）

**依存先:** 論点3（公開の流れが決まれば、planlessの終わりに置く段を作れる）

## 論点6: 公開の流れの規則を、pluginのどこに置くか

**ステータス:** 依存先待ち

**種別:** TBDヒアリング

**重さ:** まとめて考える（波及: 中。置き場によって読むskillと読まれる時が変わる。他は小）

**依存先:** 論点3、論点4、論点5（規則の中身と、使うworkflowが決まれば、置き場の案を作れる）

## 論点7: 利用先の文脈とtemplateに残すfactの欄

**ステータス:** 依存先待ち

**種別:** TBDヒアリング

**重さ:** まとめて考える（波及: 中。templateの欄と`maintenance-plugin-context`が返すfactが変わる。他は小）

**依存先:** 論点3（mergeの担当の判断に使うfactが決まれば、残す欄の案を作れる）

## 論点8: 利用先repositoryの文脈の書き換えを、この作業で行うか

**ステータス:** 依存先待ち

**種別:** TBDヒアリング

**重さ:** まとめて考える（波及: 中。三つのrepositoryの文脈を書き換える。他は小）

**依存先:** 論点7（残す欄が決まれば、各repositoryで消す記述と残す記述が決まる）
