# 前月summaryを作る

`prepare-design-record`が、実行月の一か月前（年を跨ぐ場合は前年12月）のdirectoryが存在し、その月の`summary.md`が未存在の時だけ読む。

- 既存`summary.md`があれば何もしない。追記、再生成、status更新をしない。
- 前月配下の各作業のdirectoryを列挙する。
- 概要はrootの`design.md`から抽出する。rootにない旧形式だけ、直下の子directoryから一意な`design.md`を探す。候補が複数なら推測しない。
- `## TL;DR`または`## 1. TL;DR`本文の最初の段落を優先し、なければ`## 目的`の最初の段落、それもなければ`{slug}（概要抽出不可、design.md 参照）`とする。旧templateで書かれた過去のdesign.mdを読むため、番号付きの旧形式も併記する。
- tasklist status: checkboxがすべて`[x]`なら`完了`、`[ ]`が残れば`未完了`、判定不能なら`不明`とする。
- roadmap status: 全phaseの運用statusが`完了`なら`完了`、一つでも`未着手 | 進行中`なら`未完了`、fieldを判定できなければ`不明`とする。
- planless status: tasklistとroadmapがどちらもなく、rootの`design.md`付録に`分類保留`sectionがなく、`設計中に反映する、他の判断を待っている変更`と`tasklist・roadmapに載せて実行する変更`がともに`なし`なら`完了`とする。いずれかを判定できなければ`不明`とする。

見出しやlabelが見つからない時は、作成時のpluginの版が古い可能性がある。[`task-design/templates/breaking_changes/`](../task-design/templates/breaking_changes/README.md)で旧名を確かめて読む。

summaryは次のexact formatを使う。

```markdown
# {YYYY}年{MM}月 設計の記録 サマリー

## [{slug}](./{slug}/)

**概要:** {概要}

**ステータス:** {完了 / 未完了 / 不明}

---
```

entryはslug link、概要、statusだけを持ち、種別、関連、詳細fieldを追加しない。詳細は各作業の`design.md`、`discussion.md`、排他的planへ委ねる。各作業の実行時にもstatusを手動更新しない。`summary.md`のsingle writerを翌月初のこの処理だけにするのは、複数人の並行作業で同じsummaryへ書き込み、conflictすることを避けるためである。

以前の版が作った月のsummaryの題（「{YYYY}年{MM}月 Steering サマリー」）は書き換えない。
