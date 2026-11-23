# C7 after候補 v1: 後続topicのdecisionで先行topicの具体表現を読み替える

**位置づけ:** 独立した後続decisionが、先行topicのdecision boundaryを変えずに、その具体表現だけを置換するcaseのafter候補。共通format案ではない。

**判定:** 成立（task-design discussionの論点16で受諾）

**source:** 非公開の利用先記録から一般化したcase（論点5「モジュール階層設計」と論点6「コンセプト命名」）

論点5のproposalとfeedbackは、その時点で使っていた`Template`を履歴として維持する。現在有効な`決定`だけは、論点6を典拠として`Pattern`へ同期する。命名理由は論点5へ複製せず、独立した命名decisionである論点6が所有する。

---

## 論点5: 概念間の関係をmodule階層へ反映する

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: 関連概念を一つのmodule階層へまとめる

#### 提案0

`Slot`に関連する概念を、次の階層へまとめる。

```text
Schedule::Slot::Root
Schedule::Slot::Entry::Root
Schedule::Slot::Template::Root
Schedule::Slot::Template::Entry::Root
```

```text
schedule/slot/
├── root.rb
├── entry/
└── template/
    ├── root.rb
    └── entry/
```

既存の`Schedule::SlotEntry::*`は`Schedule::Slot::Entry::*`へ移す。

#### 提案背景

初案は、slot master、calendar上のslot entry、再利用する配置、配置内entryを、`Schedule::`直下の兄弟として平坦に置いていた。しかし、これらはすべて`Slot`の文脈で意味を持ち、entryはそれぞれの親概念に従属する。

この関係をnamespaceとdirectoryへ反映し、`Schedule::`直下へ関連概念が増え続ける構造を避ける必要がある。

#### 提案0へのフィードバック

**結果:** 受諾（source上の採用記録）

元sourceは上記の階層を`決定`として記録している。採用時のuser feedback原文は保存されていないため補完しない。

### 決定

関連概念は`Schedule::Slot::`の配下へまとめ、entryは対応する親概念の配下へ置く。現在有効な概念名は論点6で決定した`Pattern`であるため、完成後の階層は次とする。

```text
Schedule::Slot::Root
Schedule::Slot::Entry::Root
Schedule::Slot::Pattern::Root
Schedule::Slot::Pattern::Entry::Root
```

```text
schedule/slot/
├── root.rb
├── entry/
└── pattern/
    ├── root.rb
    └── entry/
```

論点5が決めたのは階層関係であり、`Template`から`Pattern`への置換理由と命名decisionは論点6が所有する。論点5のイテレーション0は、当時の判断対象を復元できるよう`Template`のまま変更しない。

---

## 論点6: 再利用する配置概念の名前を決める

**ステータス:** 決定

**種別:** TBDヒアリング、認識齟齬

### イテレーション0: 再利用する用途からTemplateを候補にする

#### 提案0

複数日分の枠配置を保存し、後から適用する概念名には`Template`を使う。

#### 提案背景

この概念は、一度作った枠配置を再利用してcalendarへ適用する。繰り返しを必須にしないため`Routine`は合わないが、再利用する雛形という用途なら`Template`で表せると考えた。

#### 提案0へのフィードバック

**結果:** 修正要求・命名の診断へ遡及

> 勝手になに結論決めてるの？パターンっていうのが近くない？

利用法から`Template`へ決めており、保存されるもの自体が何であるかを検討していない。`Pattern`を含めてdomain上の実体から命名し直す必要がある。

### イテレーション1: 利用法ではなくdomain上の実体から命名する

#### 提案1

複数日分の枠配置を表す概念名には`Pattern`を使う。class、table、mutation、directory等、この概念を表す既存の`Template`表記を`Pattern`へ置換する。

#### 提案背景

イテレーション0は、再利用して適用するという用途から`Template`を選んだ。しかし同じ配置を必ず複製するとは限らず、将来繰り返す場合にも単発で適用する場合にも、保存している実体は複数日分の枠の配置構造である。

命名は利用法ではなく何であるかを表す必要がある。`Pattern`なら、配置構造そのものを指し、将来それを繰り返す場合にも、単発で適用する場合にも意味を狭めない。

#### 提案1へのフィードバック

**結果:** 受諾（source上の採用記録）

元sourceは`Pattern`を最終名として採用している。採用時のuser feedback原文は保存されていないため補完しない。

### 決定

複数日分の枠配置を表す概念名は`Pattern`とする。このdecisionは、論点5のmodule階層を含め、先行topicでこの同じ概念を`Template`と表現していたclass、table、mutation、directoryの現在有効な表記を`Pattern`へ置換する。

先行topicのproposalとfeedbackは当時の判断対象として変更しない。先行topicの現在有効な`決定`では、論点6を典拠として置換後の表記を示す。
