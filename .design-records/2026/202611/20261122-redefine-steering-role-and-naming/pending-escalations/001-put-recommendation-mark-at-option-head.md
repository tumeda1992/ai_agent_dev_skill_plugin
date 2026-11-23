# 保留メモ: 仮決め・推奨の印を案の行の頭に置く

## 保留時の内容

提案: `facilitate-discussion`で案を示す時、仮決め・推奨の印を案の行の末尾ではなく頭に置く。
例えば「a. 移さず、新しい記録も作らずに止まる（仮決め）」を「a. （仮決め）移さず、新しい記録も作らずに止まる」にする。推奨も同じ形にする。

対象の記述（2026-11-23時点）:

- `plugins/tumeda-dev/skills/facilitate-discussion/round-trip.md`「答え方を毎回添える」: 「仮決め・推す案の印は、論点の行ではなく、該当する案の行の末尾に「（仮決め）」「（推奨）」と付ける。論点の行に「推す案: a」と書くより、案を読みながらどれが推されているかが分かり、読みやすいためである。」
- `plugins/tumeda-dev/skills/facilitate-discussion/templates/proposal-sections/compact-options.md`の本文とtemplate（`（推奨）`を案の行の末尾に置く例）
- `plugins/tumeda-dev/skills/facilitate-discussion/templates/proposal-sections/detailed-options.md`の同じ記述

具体例: この作業で論点29・26・27をまとめて示した往復（chat）。三つの論点の案を、印を末尾に付けて示した。

根拠: 利用者の原文（この作業の議論記録`task-design-discussion/task-design-discussion-26-30.md`の論点26・27・29の「提案0へのフィードバック」に引用）。

> ok。あと「a. 移さず、新しい記録も作らずに止まる（仮決め）」より「a. （仮ぎめ）移さず、新しい記録も作らずに止まる」（推奨も同じ）の方が読みやすいな。案を全部読まなくても推奨とかがわかるから

今の記述が理由にしている「案を読みながらどれが推されているかが分かる」に対し、利用者の理由は「案を全部読まなくても分かる」である。頭に置けば、案の文を読む前に印が目に入る。

利用者が合意した範囲: 印を頭に置く方が読みやすいという意見と、その理由までである。引き渡すことと、どのfileのどの文をどう直すかは、利用者が合意していない。対象の記述の列挙はassistantが書いた。

保留の根拠: 即時の指示が無かった。

対象: この改善提案。

再開条件: 元の作業（`.design-records/2026/202611/20261122-redefine-steering-role-and-naming/`）の完了。

## 追跡

状態: 元の作業の中で適用済み。引渡しは行っていない。

- 元の作業の完了の後に引き渡すため、新しい作業の置き場所とbranchを用意しようとしたところで、利用者から「切るというより、大したことない修正なんだから、同じdesignでさっさとやれよ」と指示された。
- 同じ作業の中で、`facilitate-discussion/round-trip.md`、`templates/proposal-sections/compact-options.md`、`detailed-options.md`と`scripts/verification/validate-plugin.mjs`を直した。適用の記録は元の作業の`design.md`の付録にある。
