# 2026年08月 Steering サマリー

## [20260801-extract-discussion-workflow-skill](./20260801-extract-discussion-workflow-skill/)

**概要:** `task-design` と `steering` に重複している議論 workflow を再利用可能な独立 skill に切り出し、議論の記録・追跡・合意反映に一貫した契約を与える。

**ステータス:** 完了

---

## [20260802-add-task-design-work-directory-creation](./20260802-add-task-design-work-directory-creation/)

**概要:** `task-design` を単独でも配置先の事前決定なしに起動でき、`steering` から起動した場合も設計固有の成果物を steering ディレクトリ配下へ分離して保存できるようにする。

**ステータス:** 不明

---

## [20260802-move-tasklist-ownership-to-task-design](./20260802-move-tasklist-ownership-to-task-design/)

**概要:** `tasklist.md`と`roadmap.md`を単なるsteeringの後工程ではなく、`design.md`を実行可能な単位へ落とす排他的な設計成果物として`task-design`に帰属させる。leafのtasklist作成・reviewでもcompositeのroadmap作成・reviewでも、設計不足が判明した場合にskill境界を跨がず同じ所有者がdesignへ戻れるworkflowを作る。

**ステータス:** 未完了

---

## [20260802-remove-design-consult-skill](./20260802-remove-design-consult-skill/)

**概要:** メインセッションで Opus または Sol 相当の高推論モデルを使う現在の運用では、別の高推論モデルを child として起動する `design-consult` の責務が重複している。独立した設計相談 skill とその専用契約を削除し、設計判断をメインセッション、`think-through`、`task-design` の既存プロセスへ一本化する。

**ステータス:** 完了

---

## [20260808-focus-tasklists-on-staged-implementation](./20260808-focus-tasklists-on-staged-implementation/)

**概要:** tasklist必須を正常系、planなしを例外とする構造が、document・skill等を不要なtasklistへ送っていた。完成後のtask-designは、設計の深さを落とさず、変化対象に応じた完成後の姿を合意し、対象成果物への変更をtask-designが完了するものとexecution planへ渡すものへ分ける。

**ステータス:** 完了

---

## [20260810-sync-documentation-standards-upstream-growth](./20260810-sync-documentation-standards-upstream-growth/)

**概要:** 20260810-sync-documentation-standards-upstream-growth（概要抽出不可、design.md 参照）

**ステータス:** 不明

---

## [20260815-evaluate-discussion-entry-format](./20260815-evaluate-discussion-entry-format/)

**概要:** 論点についてiterationを回し、その都度の意思決定と変遷を残す既存processは維持する。変更対象はformatだけである。過去のdiscussionから、壊れ方が異なる`だめだった・伝わらなかった`caseを少数キュレーションし、before、伝わらなかった内容、after、case固有の修正方針を比較する。仮の共通骨子とcase別variantを全iteration論点へ展開し、未対応caseがあればキュレーションとafterを更新する。この反復で既存caseを改善し、全体をcoverできた時にtemplateと`facilitate-discussion`のformat生成contractを固定する。

**ステータス:** 完了

---

## [20260822-extract-think-standards-docs](./20260822-extract-think-standards-docs/)

**概要:** think-throughは「毎ターン適用する常時注入型」でありながら、453行31KBのSKILL.md一つに、常時適用のコア、場面別S1〜S9、標準群の維持規律、skill運用contractを同居させている。場面駆動という構成意図を持ちながら、物理的には場面に該当しない大部分も毎回読み込む形になっており、また思考の標準そのものがskillに閉じているため、skill以外のconsumerから引けず、標準の増改築がskill改版と結合している。

**ステータス:** 未完了

---

## [20260823-route-skill-feedback-to-plugin-steering](./20260823-route-skill-feedback-to-plugin-steering/)

**概要:** 利用先repositoryでskillを実行中にこのpluginの成果物への修正提案が生じたとき、それを正本repositoryへ引き渡すownerが存在しない。存在しないため、直近の実例では利用先repositoryで議論を合意まで進めてから手作業で移設することになり、論点採番の衝突、ユーザー発言の原文改変、`migration.md`が要求する固有情報除去の未実施が同時に起きた。新skill `escalate-plugin-skill-fix` を新設してこの引き渡しを所有させ、その`description`をhostのdiscovery機構として使うことで、提案が生じた瞬間に起動されるようにする。

**ステータス:** 完了

---

## [20260827-fix-implementation-review-trigger](./20260827-fix-implementation-review-trigger/)

**概要:** `steering/SKILL.md` の `## 実装完了後review` 冒頭の一文が、適用範囲を定める列挙と、実行者を固定する句を同時に担っている。実行者を固定する「直接受け取った」が、適用範囲を絞るgateとして読める形になっており、自己発見の`漏れ`・`不具合`が対象外だと誤読された。二つの役割を書き分け、誤読の余地をなくす。

**ステータス:** 完了

---

## [20260827-fix-substitutable-pr-script-task](./20260827-fix-substitutable-pr-script-task/)

**概要:** PR作成taskの一文が、実行すべき手段と、達成すべき目的を同時に担っている。後半の目的節が受け入れ条件に読めるため、それを満たす別手段で置換できると判断される。加えて、名指しされたscriptのpathが利用先repositoryから解決できず、所有者であるskillが自分の同梱物へ言及していない。手段をtask本体へ置き、目的を注記へ降ろし、pathの起点を明示する。

**ステータス:** 完了

---

## [20260829-fix-cause-routing-and-add-entity-standards](./20260829-fix-cause-routing-and-add-entity-standards/)

**概要:** 利用先repositoryでの実運用中に、このpluginの欠陥が2つ露出した。

**ステータス:** 完了

---

## [20260831-add-evacuation-standard-and-refine-task-design](./20260831-add-evacuation-standard-and-refine-task-design/)

**概要:** 利用先での実装を通じて、このpluginの4種類の欠陥が露出した。うち3種類は利用先から引き渡され、1種類はこの設計の途中で自ら踏んで見つけた。

**ステータス:** 完了

---

## [20260831-add-incident-flow-and-subagent-boundary](./20260831-add-incident-flow-and-subagent-boundary/)

**概要:** 現状、`steering`は「steering自身が実装codeを変更する」を無条件禁止とだけ定めており、Flowが前提とする実行条件が崩れて内側では復旧できなくなった場合の扱いを持たない。dispatch先が停止・失敗したときに何を読むかも定めていない。また`task-design`は、変更対象fileを説明している既存docsを逆引きする観点を持たない。

**ステータス:** 未完了

---
