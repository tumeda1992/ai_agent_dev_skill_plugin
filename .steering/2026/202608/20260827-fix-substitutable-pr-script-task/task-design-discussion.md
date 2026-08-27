# 議論記録

## 論点1: PR作成taskの置換を防ぐ修正内容

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: 原因ownerを決める

#### 提案0

原因をrepository知識と分類し、利用先repositoryのplugin contextにある branch / issue 契約へ「PR bodyへ`Closes #<issue番号>`を入れる」と追記する。

#### 提案背景

利用先でPRがissueへ紐づかなかった。branch名とissue番号の対応は宣言されているが、PR側の帰結が書かれていない。

#### 提案0へのフィードバック

**結果:** 却下。

> は？ Aはスクリプト使わない理由にならないから。

提案0は「`Closes`が落ちたこと」への対処であり、「指定scriptを使わなかったこと」の説明にも防止にもなっていない。被害を分析して、失敗そのものを分析していなかった。

`Closes`の欠落は今回たまたま現れた被害である。同じ置換が別の場面で起きれば別の被害が出る。直すべきは置換が成立する構造である。

### イテレーション1: 手段と目的の同居を原因として扱う

#### 提案1

`task-design/templates/tasklist.md` のPR作成taskを次へ置き換える。

```markdown
- [ ] pluginのskills directory配下にある `tasklist-executor/scripts/github/create_or_get_pr.sh` を実行する
  - pathの起点はpluginのskills directoryである。利用先repositoryからの相対pathではない
  - このscriptは`gh pr create`のwrapperではない。同じhead branchのopen PRがあれば新規作成せずそのURLを返し、repositoryが`feature-<issue番号>`契約を宣言していればbranch名からissue番号を導いてPR bodyへ`Closes #<番号>`を入れる
  - `--title`と`--body`を渡すとissueからの導出は行われない。issueへ紐づける場合はbody側へ明示する
```

`tasklist-executor/SKILL.md` の `## repository固有文脈` へ、同梱scriptへの言及を1行置く。

validatorが検査しているpath文字列は変更しない。scriptの挙動自体も変更しない。

#### 提案背景

##### 直前のfeedbackから今回満たす必要が生じた条件

1. taskの本体が実行すべき手段そのものになっており、別手段で満たせる条件節が残らない
2. 名指しされたscriptのpathが、どこを起点とするか読める
3. scriptが`gh pr create`の単純なwrapperではないことが、実行前に読める

task本体を`create_or_get_pr.sh`の実行そのものにし、「既存PRがあれば再利用する」を注記の一項目へ降ろすことが条件1を満たす。pathの起点を明示することが条件2、wrapperではないという記述と主要挙動の列挙が条件3を満たす。

##### 置換が成立した経路

現行の一文が二つの役割を担っている。

| 役割 | 担っている部分 |
| --- | --- |
| 手段 | `create_or_get_pr.sh`を使う |
| 目的 | 既存PRがあれば再利用する |

目的節は別手段でも満たせる条件として読める。実測では、agentが既存PRの不在を確認したうえで`gh pr create`を実行し、目的は満たしたと判断した。

失われたのは目的節に書かれていない挙動である。issue番号の導出とPR bodyへの`Closes`挿入が働かず、PRがissueへ紐づかなかった。

##### 到達できないpath

`tasklist-executor/scripts/github/create_or_get_pr.sh` はpluginのskills directoryを起点とする相対pathであり、利用先repositoryからは解決できない。所有者である`tasklist-executor/SKILL.md`はこのscriptへ一度も言及しておらず、辿る導線がない。

##### 同型の欠陥を四回修正している

release `7.2.0`と`7.3.0`で、`task-design/SKILL.md`の§4 trigger、同NG集F1、`steering/SKILL.md`のdiscussion trigger、同`実装完了後review`を修正した。いずれも一文が二役を担い、片方がもう片方のgateまたは受け入れ条件として読めていた。

今回は「適用範囲と実行者」ではなく「手段と目的」だが、構造は同じである。五回目の観測であり、一度きりの事例として成果物固有に留める根拠はない。

##### validatorへassertionを追加しない理由

既存taskの記述の組み替えであり、新しい契約を追加しない。検査したい対象は「手段と目的が別の位置にあること」という構造であり、固定文字列では表現できない。既存のpath文字列assertionは変更せず通ることを確認した。

#### 提案1へのフィードバック

**結果:** 受諾。

> ok。大した修正じゃないから、最後まで進めて

### 決定

提案1のとおり、`task-design/templates/tasklist.md` のPR作成taskの本体を手段そのものにし、目的を注記へ降ろす。pathの起点とscriptがwrapperでないことを明記する。

`tasklist-executor/SKILL.md` へ同梱scriptの言及を追加する。

validatorのassertionとpath文字列、script本体は変更しない。

**適用済み。** `node scripts/verification/validate-plugin.mjs` が `plugin validation passed`。
