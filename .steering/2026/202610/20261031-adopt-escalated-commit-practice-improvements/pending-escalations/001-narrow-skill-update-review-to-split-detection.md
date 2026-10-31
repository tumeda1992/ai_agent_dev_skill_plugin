# 保留メモ: skill-update-review を、SKILL.md から切り出せるものの検出に絞る

## 保留時の内容

提案: `skill-update-review` を、SKILL.md が独立した判断・状態・完了条件・改訂理由を持つ工程を抱え込んでいないか（同じ skill の内部指示へ分けるか、別 skill にするか）の検出に絞る。
順序・受渡し・入出力・状態の遷移・規則の食い違い・script の動作・構造案との一致の照合を外す。
書き直す範囲の候補は、description、`assess-structure.md` の「全体の責務と進行を照合する」と二重正本の段落、`SKILL.md` の「既存結果の再利用と再review」（内容 hash による照合）である。
どの文を残すかは、`.steering/2026/202610/20261018-escalate-pending-plugin-improvements/` の論点31〜47 の決定を見直して決める。

具体例: skill-update-review を使った三つの steering（20261027、利用先 repository の steering、この作業）で、指摘は 12 件あり、切り出しの指摘は 0 件だった。12 件のうち 9 件が利用者への報告になった。
該当箇所: [task-design-discussion.md の論点9（イテレーション2）](../task-design-discussion.md#論点9-skill-update-review-をskillmd-から切り出せるものの検出に絞るか)と、[内部検討記録](../internal-records/task-design-discussion.md.topic-9.md#iteration-2-record-2)。

根拠: 利用者が skill-update-review に頼んだのは、SKILL.md から切り出せるものの通知だった。元の目的は 20261018 の論点31 の提案0 に「処理を一つのSKILL.mdへ抱え込みすぎていないかを調べる役」とある。
一方、skill の文は作った時点（`b172223`）から、順序・受渡し・状態・規則の正本の照合を求めており、切り出しを超えた指摘だけが出ていた。
受け入れる弱点: 動作の不備（例: 実行する directory で結果が変わる command）を skill-update-review では見つけなくなる。動作の検証で見つける。

保留指示: 「a」（2026-10-31、chat 上の発言）。
問いは task-design-discussion.md 論点9 の提案2「a) 切り出しの検出に絞る。別の作業で行う（推奨） b) 切り出しの検出に絞る。この作業で行う c) そのまま」である。
別の作業にする理由として示したのは、この作業に含めると PR #9 の取り込みが遅れることである。

対象: この改善提案だけ。

再開条件: この元作業（steering `20261031-adopt-escalated-commit-practice-improvements`）の完了の後に、plugin repository で別の steering を起動して扱う。

## 追跡

状態: 保留。元作業は design の段階の後で、論点10 と commit・push が残っており、完了していない。引渡しは未実施。
