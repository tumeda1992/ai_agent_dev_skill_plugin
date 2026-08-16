# C4 after試作 v1: 一括提案がdecision分解を必要とした時点

**位置づけ:** C4を分解前から再現し、parentが`子論点待ち`、論点11がactive childになった時点で現在地を確認した評価用after。共通format案ではない。

**source:** 非公開の利用先記録から一般化したcase（論点10「context中央集権とhost runtime契約」初期提案〜イテレーション1の分解判断）

この状態では、分解後に現在判断する論点11だけを追加している。ここで分解後の現在地を認識できたためC4の検証を終了し、論点12・13とparent論点10の統合結論は再演しない。

---

## 論点10: context中央集権とhost runtime契約を矛盾なく完成させる

**ステータス:** 子論点待ち

### イテレーション0: 四つの契約を一つの整合性修正として提案する

#### 提案0

context lifecycle、template path、runtime model profile、remote Git provider公開分岐について、正本、consumer、参照方法、検証を一つずつ確定し、design全体を新しい契約へ揃える。

##### Context lifecycle

`maintenance-plugin-context`だけがcontext instanceの探索、作成、更新、選択的読取範囲を決める。consumer skillは必要なfactと確認元候補を渡し、返却された範囲だけを読む。各consumerがinstanceを直接作成または更新する旧契約は削除する。

##### Template path

template sourceは、`maintenance-plugin-context/SKILL.md`のparentではなく、installed pluginの`skills/` rootにある`tumeda-dev-plugin-context.md`として解決する。source rootを特定できなければ`unavailable`とし、壊れたinstanceを推測で修復しない。

##### Runtime model profile

`runtime-model-profiles.md`をpluginのdeliverableにし、skillが必要とする推論強度、host別model selector、model選択面がない場合のfallback、release時のhost確認を定義する。provider固有model名とprofileのどちらを正本にするかも、この契約で確定する。

##### remote Git provider tasklist分岐

steering本文、tasklist template、自己reviewから固定remote Git provider script要求を除き、repository contextの`### remote Git provider`有無で公開actionを分岐する。remote Git provider情報がなければpublish taskを作らず、ある場合は接続確認、commit、push、PR取得または作成をtasklistへ生成する。

#### 提案背景

context lifecycleのownerを`maintenance-plugin-context`へ移した後も、designには各consumerがinstanceを作成・更新する旧契約が残っていた。template pathも、skill directoryのparentとplugin `skills/` rootを混同していた。

同時に、`runtime-model-profiles.md`は完成構造に名前だけがあり、内容、reader、host別検証がdeliverableになっていなかった。remote Git provider公開actionも、contextによる分岐と固定scriptを要求する旧steering・template・自己reviewが併存していた。

いずれもsource of truthを移した後の旧契約残存として観測されたため、最初の提案では一つの整合性修正へまとめた。

#### 提案0へのフィードバック

**結果:** 別decisionへ分離

context lifecycle、template path、runtime model profile、remote Git provider tasklist分岐は、同じsource of truth整合性という上位目的に属するが、一つのyes/noで判断できない。

context ownershipとtemplate pathは、誰がinstanceを扱い、templateをどこから解決するかという一つのruntime境界として一緒に決められる。一方、model profileは推論強度の正本、remote Git provider分岐は外部公開actionの生成ownerを決める別decisionである。

次の提案を一括案の修正版にせず、次の三decisionへ分ける必要がある。

```text
論点11: context ownership / template path
論点12: runtime model profile
論点13: remote Git provider tasklist分岐
```

## 論点11: context instanceのownerとtemplate sourceを一意にする

**ステータス:** 提案中

**親論点:** 論点10

**種別:** TBDヒアリング

### イテレーション0: context lifecycleをmaintainerだけの責務にする

#### 提案0

`maintenance-plugin-context`だけがcontext instanceの探索、作成、更新、選択的読取範囲の解決を担う。consumer skillはcontext fileを直接操作せず、次のrequestをmaintainerへ渡し、返された範囲だけを読む。

```text
consumer skill
  └── maintainerへ渡す
      ├── contextが必要な理由
      ├── 必要なfact
      └── 確認元の候補
              ↓
maintenance-plugin-context
  ├── instanceを探索・作成・更新
  ├── 読み取り範囲を解決
  └── consumerへ必要範囲だけ返す
```

template sourceはinstalled pluginの`skills/tumeda-dev-plugin-context.md`だけとする。`maintenance-plugin-context/SKILL.md`からは、skill directoryの親の親をpluginの`skills/` rootとして解決する。

source locationをhostから取得できない場合は`unavailable`を返す。既存instanceの構造を読めない時も、推測による修復や再生成をせず、必要なH2/H3だけを確認可能な範囲で最小更新する。

templateは構造と記入欄だけを所有する。context sectionの選択規則、instance不在時の処理、更新可否、fallbackは`maintenance-plugin-context`が所有し、consumerやtemplateへ複製しない。

#### 提案背景

一括提案では、context lifecycle、template path、model profile、remote Git provider公開分岐を同じsource of truth整合性として扱った。分解feedbackにより、context instanceを誰が扱うかと、そのmaintainerがtemplateをどこから解決するかは、一つのruntime境界として一緒に判断できると分かった。

既存designには、各consumerがcontext instanceを直接作成・更新する旧契約が残っていた。また、maintainerの`SKILL.md`から見た`parent directory`をtemplate sourceとすると、実際にtemplateが置かれるplugin `skills/` rootではなく、maintainer自身のskill directoryを指してしまう。

この論点ではcontextのownerとpath解決だけを決める。runtime model profileとremote Git provider公開actionは親の別childへ残し、判断材料へ持ち込まない。

#### 提案0へのフィードバック

**結果:** 未回答
