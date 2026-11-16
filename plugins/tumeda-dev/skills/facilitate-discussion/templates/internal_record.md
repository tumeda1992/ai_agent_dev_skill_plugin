# 内部検討記録の保存形

既存の内部logの所属・回・記録単位を読み取るための旧保存形である。Git管理外の副産物や既存記録の互換参照に使い、新規logの作成templateとしては使わない。discussionの完成・読取・再開の必須成果物にはしない。

## 論点の骨子

```markdown
# 内部検討記録: 論点N — {対象の問い}

**discussion:** [{discussion basename}]({discussion相対path})

**論点:** 論点N

## 開始context

{問題、対象語の意味、決める範囲、開始時の既決条件、残る不足}
```

## 回の骨子

```markdown
<a id="iteration-I"></a>

## イテレーションI: {この回の問い}

{今回の入口、変わった前提、使う既存根拠}
```

## 記録単位

```markdown
<a id="iteration-I-record-R"></a>

### {用途}: {何を調べ、判断し、確かめるかを表すタイトル}

{選択した目的別formatの入力と結果}
```
