# 見出し・file・directoryの構造をtreeで示す

## 使用条件

documentの見出し、file・directory、module、所有関係等について、包含階層と配置を認識合わせする時に使う。順番を判断するprocess flowではなく、親子関係や全体内の配置が判断対象になる場合を扱う。

## template

````markdown
{このtreeで判断するrootとscopeを一文で示す。}

```text
{root}
├── {child}
│   └── {grandchild}
└── {child}
```

{treeだけでは表せない各nodeの意味、変更理由、条件があれば必要な分だけ説明する。}
````

単独の認識合わせにも、complete stateや重い選択肢の内部にも使える。treeのnodeを置くだけで意味が伝わらない場合は、判断に必要な説明を補う。

新規documentの見出し階層と各見出しが扱う内容へ合意してからdraftを書く場合は、`document-heading-outline.md`を使う。新規documentの配置と見出し構造の両方を判断する場合は、完成後のfile treeにこのpatternを、document内部のoutlineに`document-heading-outline.md`を使う。
