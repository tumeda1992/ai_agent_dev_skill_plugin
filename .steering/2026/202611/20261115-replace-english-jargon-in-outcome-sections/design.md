# Design: task-designのテンプレートから、利用者の目に出る、解釈が要る耳馴染みのない表現をなくす

## 元の依頼内容

https://github.com/tumeda1992/ai_agent_dev_skill_plugin/issues/5 を解決したい

issue #5「ルー語を改善する（改善 in クラウドセッション）」本文:

```text
- owner
- callerのcontract
  - 完成した姿のファイル名はそれでいいけど、見出しにそれ使われたくない
  - 「xxの呼ばれ方」「xxの呼び元からの呼び出し方」
  - contractも分かりづらい
- その他 .agents/skills/task-design/templates/outcome-sections の中は分かりづらい
```

---

## TL;DR

`task-design`の`templates/outcome-sections/`は、普段の会話で聞かない表現（precedence、全量保存宣言等）や、聞き慣れた語にここだけの意味を載せた表現（owner、contract、「所有する」等）で書かれており、読者が訳し直さないと読めない。
読者は、テンプレートを読んでdesign.mdを書くagentと、出来上がったdesign.mdを読む利用者である。agentがその表現をdesign.mdへ持ち込むため、design.mdの読み手にも同じ負担が移る。
同じ型の表現は、design.md・roadmap.mdのテンプレートの見出しや表のlabelにもあり、成果物へそのまま写る。
終了時には、task-designのテンプレートのうち利用者の目に出る表現（見出し、本文、記入欄のlabel）と、agentがその語を成果物へ持ち込む入口になる記入guideが、普段の意味のまま読んで正しく受け取れる表現で書かれ、同じ書き方が再び増えないための判断基準が置かれている。agentへの指示の文など、skillの内部だけでやり取りされる語は内輪で通じればよいため、言い換えない。

---

## 完成後の姿

### 文書以外に作るfileの中身

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/templates/outcome-sections/*.md`（14 file） | design.mdを書くagent、design.mdを読む利用者 | 表現を訳し直さずに、sectionを選び、見出しと記入欄を埋め、出来上がったdesign.mdを読める |
| `plugins/tumeda-dev/skills/task-design/templates/design.md`、`tasklist.md`、`roadmap.md` | 成果物を書くagent、design.md・tasklist.md・roadmap.mdを読む利用者 | 成果物の見出しと表のlabelを、task-designの内部の区分を知らなくても読める |
| 言い換えたlabelを名前で読むskill・script・validator（`steering/SKILL.md`、`task-design/SKILL.md`、`tasklist-executor/SKILL.md`、`task-design/roadmap-design.md`、`skills/README.md`、`runtime-feedback-review.md`、`outcome-sections/workflow.md`、`scripts/verification/validate-plugin.mjs`） | 各skillを実行するagent、検証を走らせる保守者 | 言い換え後のlabelで、これまでどおり成果物を検証できる |
| `plugins/tumeda-dev/skills/task-design/templates/breaking_changes/`（READMEと今回の記録1件） | 以前の版のtask-designが作った成果物を読むagent・利用者 | 古いdesign.md・roadmap.mdの見出しを、今の名前に読み替えられる |
| `plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md`の「Plugin version」節 | pluginを保守する人とagent | MAJORを上げる破壊的変更の時に、古い成果物を読むための記録を残すことを思い出し、何を書くかが分かる |
| `plugins/tumeda-dev/docs/think_standards/writing_abstraction.md`、`.claude/hooks/think_through_session_start.sh` | 共通の規則・関数・索引を書くagent | 共通の場所に今回の個別を書き込む前に気づける |
| pluginのversion（宣言値4箇所と`validate-plugin.mjs`の`expectedRelease`） | 利用先repository | 破壊的変更を含む版（9.0.0）だと分かる |

**完成後の内容と構造:**

outcome-sectionsの本文と記入guideの文、design.md・tasklist.md・roadmap.mdのテンプレートの記入guideとtaskの文は、見本として先に書き直した`caller-contracts.md`と`contract-preservation.md`の書き方を基準に、全fileを書き直す。見本は、issueが名指しした`caller-contracts.md`（呼び出し方と保証）と、表現が最も込み入り`function_migration_policy.md`の語との対応を持つ`contract-preservation.md`であり、易しいfileを見本にしない。見本以外のfileの書き直しは任されたものであり、全体の差分を利用者がreviewする。

見本で決めた書き方:

| 元の表現 | 書き直し |
| --- | --- |
| caller、caller-facing、contract（`caller-contracts.md`） | 「呼び出し元」「呼び出し元から見える名前」「呼び出し方」「保証」へ、箇所ごとに書き分ける。sectionの中では「呼び出し元」に揃える |
| side effect、input、result、identifier | 副作用、入力、結果、名前 |
| ubiquitous language | domainの概念と、それを呼ぶ共通の言葉 |
| contract（`contract-preservation.md`）、baseline、ledger | 意味単位、移行前の基準、移行の対応表。記入guideの冒頭で`function_migration_policy.md`のcontract、baseline、ledgerとの対応を一度だけ示す |
| 全量保存宣言、closed-world、明示差分 | 「次に書く変化以外は全て保存する」という宣言、閉じた完成状態（意味を同じ文で説明）、意図して変える変化 |
| black-box、順方向・逆方向照合 | 外から動かして確かめる検証、移行元から移行先への照合と逆向きの照合 |

ownerは、テンプレートの全fileで60行・63箇所に出る。同じ語が七つの意味で使われているため、意味ごとに書き直す。行ごとの今と後の対照表は、同じdirectoryの`task-design-discussion.md`に残している。

| ownerの意味 | 書き直し | 行数 |
| --- | --- | --- |
| どのsectionに書くか | 他sectionとの書き分け、このsectionに書くこと・書かないこと、それを扱うsection | 16 |
| workflowで判断・更新を受け持つ担い手 | 担当。`workflow.md`の中は「担当」に揃える。`tasklist.md`の「直接受領したworkflow owner」は「feedbackを直接受け取ったskill」 | 24 |
| codeの中で責務を持つ部品 | class、module、componentと具体的に書く | 6 |
| 文書を直す人 | 直す人 | 5 |
| 置き場所 | 担当や置き場所の変更、新しいdocument | 5 |
| 管理元 | secretの管理元、状態を持つcomponent | 3 |
| 議論の記録先 | 議論の記録先。`README.md`の候補では、どのsteeringの記録かを具体的に書く | 1 |

`workflow.md`の移行元に書かれた「roadmap-design.md「Field ownership」」は、実在する見出し名の引用なので残す（`documentation.md`86行は「直す人」と「置き場所」の両方を含む）。

残す表現の具体例: file名（`caller-contracts.md`、`function-migration-ledger.md`等）、`KEEP | MOVE | ADAPT | ADD | CHANGE | RETIRE`、移行元として引く旧見出しの名前、refactoring、validator、rollback、signature、adapter、domain、wireframe、section。

現時点で確定している構造上の前提:

- file名（`caller-contracts.md`、`contract-preservation.md`等）は変えない。issueが「ファイル名はそれでいい」と明示している。
- 範囲は、利用者の目に出るかで引く。

  | 表現の置き場所 | 扱い |
  | --- | --- |
  | outcome-sectionsの見出し・本文・記入欄のlabel | 「見分ける問い」で判定し、言い換える |
  | design.md・tasklist.md・roadmap.mdのテンプレートの見出し・表のlabel | 「見分ける問い」で判定し、言い換える |
  | テンプレートの記入guide（HTML comment） | 「見分ける問い」で判定し、言い換える。成果物へは直接出ないが、agentがその語を成果物へ持ち込むため、表出の入口として扱う |
  | SKILL.md・tasklist-design.md・roadmap-design.md等、agentへの指示の文 | 言い換えない |
  | 言い換えたlabelを名前で読むskill・script・validator | labelの文字列だけを追随させる。周りの文は言い換えない |
- 言い換えたlabelと、それを名前で読む側の追随は、同じcommitに含める。片方だけが変わった状態を作らない。

outcome-sectionsの見出し、記入欄のlabel、表の列名、placeholder、記入guideの小見出しは、次のとおりにする。表に無い名前（「なぜ必要か」「NG」「判断基準」「記述のMUST」「具体的な記述例」「記入例」「移行元」等）は、普段の意味のまま読めるため残す。

##### 各sectionの見出し（design.mdへ写る）

| file | 今 | 後 |
| --- | --- | --- |
| `caller-contracts.md` | ### callerが依存するcontract | ### 呼び出し元から見た呼び出し方と保証 |
| `contract-preservation.md` | ### contractの保存と明示差分 | ### 移行で変えない振る舞いと、意図して変える差分 |
| `documentation.md` | ### documentationによって成立する知識体系 | ### 文書にまとめる知識と、その保ち方 |
| `file-deliverables.md` | ### documentation以外のfile deliverable | ### 文書以外に作るfileの中身 |
| `research-findings.md` | ### 調査・比較・技術検証によるfindings | ### 調査・比較・技術検証で分かったこと |
| `workflow.md` | ### workflow | ### 作業の流れと担当 |

残す見出し: codeの責務配置と依存構造、データモデル、操作フロー、runtime・設定・環境構築、画面イメージと配置意図、skillの役割と方針。

`caller-contracts.md`は、issueの候補「xxの呼び元からの呼び出し方」に、このsectionが併せて持つ「成功・失敗時に何が起きるかの保証」を足した。「xxの呼ばれ方」の形（xxに対象名を入れる）は、一つのsectionで複数のfunctionやendpointを扱う時に見出しへ入りきらないため採らない。

##### 記入欄のlabel・表の列名・placeholder（design.mdへ写る）

| file | 今 | 後 |
| --- | --- | --- |
| `caller-contracts.md` | **新設・変更するcaller-facing class / function:** | **新設・変更する、呼び出し元が使うclass / function:** |
| | **mutation / endpoint / caller contract:** | **mutation / endpointの呼び出し方:** |
| | caller: / input contract: / 成功時のresult: / 成功時のside effect: | 呼び出し元: / 入力の条件: / 成功時の結果: / 成功時の副作用: |
| | **失敗contract:** | **失敗時の返し方と、dataの状態の保証:** |
| | \| 条件 \| caller-facingなerror contract \| state・side effectの保証 \| | \| 条件 \| 呼び出し元へ返すerror（type、status、payload） \| dataの状態と副作用の保証 \| |
| `code-structure.md` | **境界のrule:** | **moduleの間の決まり:** |
| | **全体のcall関係:** | **全体の呼び出し関係:** |
| | {Caller-facing entry} -> {Owner A} -> {Owner B} -> {Result owner} | {呼び出し元が使う入口} -> {担当module A} -> {担当module B} -> {結果を返すmodule} |
| `contract-preservation.md` | **baselineとevidence:** | **移行前の基準と、照合の記録:** |
| | 表の行: baseline / 対象scope / ledger / 一般procedureの正本 | 移行前の基準 / 対象範囲 / 移行の対応表 / 移行手順を定める文書 |
| | **完成後の差分宣言:** | **変わるものと、保存されるもの:** |
| | \| 完成後の意味差分 \| 移行前との違い \| 詳細owner \| 出典 \| | \| 完成後に変わる意味 \| 移行前との違い \| 詳細を書いたsection \| 根拠 \| |
| `data.md` | **典型case:** | **代表的なcase:** |
| | \| operation \| 操作前 \| 操作後 \| relation・cascade・保持値 \| | \| 操作 \| 操作前 \| 操作後 \| 関連するdataへの影響・残る値 \| |
| `documentation.md` | **形式知化する対象:** | **文書にする知識:** |
| | **読者と成立させる判断:** | **読者と、読んでできるようになる判断:** |
| | **知識構造:** | **知識の並べ方:** |
| | **規範の根拠と適用境界:** | **決まりの理由と、当てはめる範囲:** |
| | **snapshotと維持規律:** | **内容を最新に保つ方法:** |
| | **完成後のdocument構造:** | **完成後の文書の構成:** |
| | \| 読者 \| 利用場面 \| codeや過去会話を再調査せず可能になる判断・action \| 入口・読む順序・検索語 \| | \| 読者 \| 読む場面 \| codeや過去の会話を調べ直さずにできるようになる判断・作業 \| 最初に開く場所・読む順序・検索語 \| |
| | \| 正しいsnapshot \| single source of truth \| 更新owner \| 更新trigger \| 腐敗signal・同時確認先 \| | \| 保つべき内容 \| 正とする記述の置き場所 \| 直す人 \| 直すきっかけ \| 古くなったと気づく兆候・あわせて確認する文書 \| |
| `interaction-flow.md` | **ケース: {actorの操作名}** | **ケース: {操作する人の操作名}** |
| | \| case \| success flowからの分岐 \| call・stateへの影響 \| actorの観測と次の操作 \| 参照するcontract \| | \| case \| 成功時の流れから分かれる点 \| 呼び出しと状態への影響 \| 操作する人に見えることと次の操作 \| 関係する呼び出し方 \| |
| `research-findings.md` | **evidenceとfinding:** | **根拠と、分かったこと:** |
| | **可能になった判断と限界:** | **できるようになった判断と、言えないこと:** |
| | \| source / method \| comparison条件・environment・version \| 再現方法 \| | \| 情報源・方法 \| 比較の条件・環境・version \| 再現方法 \| |
| | \| evidence \| evidenceから直接言えるfinding \| 確度・適用範囲 \| | \| 根拠 \| 根拠から直接言えること \| 確かさ・当てはまる範囲 \| |
| `runtime-and-configuration.md` | **file配置と既存pattern:** | **fileの置き場所と、倣う既存の書き方:** |
| | \| identifier / dependency \| 値または解決元 \| default \| 影響する挙動 \| | \| 設定名・依存 \| 値または値の取得元 \| 既定値 \| 影響する挙動 \| |
| | {context / config / secret owner} | {context / config / secretの管理元} |
| | \| environment \| 配置・起動条件 \| 観測可能な結果 \| | \| 環境 \| 配置・起動条件 \| 外から確かめられる結果 \| |
| `screen.md` | **inputの供給元:** | **表示に使う値の出どころ:** |
| | \| input \| 供給元 \| 受渡し経路 \| 未取得・失敗時 \| | \| 値 \| 出どころ \| 渡される経路 \| 取得前・失敗時 \| |
| `skill-policy.md` | ##### {policyの内容を表す固有見出し} | ##### {方針の内容を表す見出し} |
| `workflow.md` | **ownerと責務:** | **担当と、受け持つこと:** |
| | **必須順序とhandoff:** | **守る順序と引き継ぎ:** |
| | \| owner \| 判断・更新するもの \| 行わないこと \| single source of truth \| | \| 担当 \| 判断・更新するもの \| 行わないこと \| 正とする記録 \| |
| | 図のlabel {event / gate / owner} | {きっかけ / 先へ進む条件 / 担当} |

`workflow.md`では、判断・更新の担い手を指す語を「担当」に揃える。`contract-preservation.md`の「移行前の基準」「移行の対応表」は、`function_migration_policy.md`が定義するbaseline、ledgerに当たる。design.mdの読み手には言い換えた語を見せ、記入guideで定義元の語との対応を一度だけ示す。

##### 記入guideの小見出し（file間で揃える）

| 今 | 後 |
| --- | --- |
| owner境界:（7 file） | このsectionに書くこと・書かないこと: |
| `skill-policy.md`の「このsectionが所有するもの:」と「owner境界:」 | このsectionに書くこと: / このsectionに書かないこと: |
| selection gate:（`code-structure.md`）、選択gate:（`skill-policy.md`） | このsectionを選ぶ条件: |
| 成功・失敗contractのselection gate: | 成功・失敗時の返し方を書く条件: |
| 更新・削除caseと不変条件のselection gate: | 更新・削除caseと不変条件を書く条件: |
| 失敗・操作中断・境界caseの選択gate: | 失敗・操作中断・境界caseを書く条件: |
| 状態選択のgate: | 書く状態を選ぶ条件: |

##### READMEとcatalogの見出し（agentがsectionを選び並べる時に読む）

| file | 今 | 後 |
| --- | --- | --- |
| `README.md` | # outcome sectionの構成と未決候補 | # 完成後の姿のsectionの並べ方と、追加候補 |
| | ### 同順位の既定順 | ### 前後が決まらない時の並び順 |
| | ### 設計意図との合成 | ### 設計意図をどこに置くか |
| | ## 未決outcome section | ## 追加を検討中のsection |
| `catalog.md` | # 完成後の姿section catalog | # 完成後の姿のsection一覧 |
| | ## 選択gate | ## sectionを選ぶ時の決まり |
| | ## 非code中心steeringの必須mapping | ## codeが中心でない作業で必ず選ぶsection |
| | ## `documentation`と`research findings`の分岐gate | ## `documentation.md`と`research-findings.md`のどちらを選ぶか |
| | \| outcome \| 読むsection \| 主な移行元 \| 選択する問い \| | \| 完成後に変わるもの \| 読むsection \| 主な移行元 \| 選ぶかを決める問い \| |

##### design.md・roadmap.mdのテンプレートのlabel

古い名前を残さず、新しい名前へ切り替える。今後は新しい表記が中心になるため、読む側に新旧二つの名前を持たせない。

| テンプレート | 今 | 後 |
| --- | --- | --- |
| `design.md` | ### task-design内で対象成果物へ適用済み | ### 設計中に反映を終えた変更 |
| | ### task-design内の対象成果物反映待ち | ### 設計中に反映する、他の判断を待っている変更 |
| | ### execution plan対象 | ### tasklist・roadmapに載せて実行する変更 |
| `roadmap.md` | ## 構造field（task-designが設計・reviewする） | ## 各phaseの計画（task-designが設計・reviewする） |
| | ### 運用field（steeringだけが更新する） | ### 進み具合（steeringだけが更新する） |
| | ## 親DoD coverage | ## 親の完了条件と、それを満たすphase |
| | ## Dependency DAG | ## phase間の依存関係 |
| | dependency results: | 依存phaseの確定結果: |
| | {親scopeよりstrictly narrowerな、このphaseで扱う範囲} | {親のscopeより狭い（親と同じ範囲にしない）、このphaseで扱う範囲} |
| | {cycleを持たないstable phase identity間の依存を記載する。例: `phase-a -> phase-b`} | {phase IDの間の依存を、循環しない形で書く。例: `phase-a -> phase-b`} |

変えないもの: 「上位roadmap制約」「分類保留（設計中のみ）」「（付録）変更の実行区分」、表の「validation結果」「参照するdesign section」「掲載理由」。普段の意味のまま読めるためである。「上位roadmap制約」は`task-design/scripts/extract-handoff-input.mjs`が既存のdesign.mdからh2見出しの完全一致で抜き出しているが、変えないので今のまま動く。`tasklist.md`の見出し（Phase、DoD（完了条件）、Tasks、各task詳細、動作確認等）も普段の意味のまま読めるため変えない。

新しい名前を使う読む側（対象と読者の表に挙げた8 file）は、同じcommitで新しい名前へ揃え、旧名を併記しない。

##### 古い成果物を読むための記録

付録の三つのlabelは、steeringが前月summaryの判定とplanless resultの検証で、既存のdesign.mdから名前で読む。「運用field」は、steeringが進行中のroadmap.mdで更新する。名前を切り替えると、以前の版で作られたこれらの成果物を名前で探せなくなるため、次の三つで辿れるようにする。

- `plugins/tumeda-dev/skills/task-design/templates/breaking_changes/`を作る。directory名は、記録する線そのもの（破壊的変更だけ）が名前に出る`breaking_changes/`とする。配布されるpluginの中に置くため、利用先repositoryのagentも読める。
  - `README.md`: このdirectoryには古い成果物を読むための対応だけを置き、全ての変更履歴ではないこと。記録の対象と1件の書き方は`maintenance-plugin-context`の版の規則（「Plugin version」節）に従うこと。task-designの成果物（design.md、tasklist.md、roadmap.md）で記録する例（9.0.0での付録・roadmapのlabelの切り替え）と、記録しない例（完成後の姿のsectionの見出しだけの言い換え、テンプレートへのsectionの追加、記入guideの書き直し）。いつ読むか（既存のdesign.md・roadmap.mdで、skillが探す見出しが見つからない時）。
  - 今回の記録1件（`20261115-rename-template-labels.md`）: 変わった版（9.0.0）、旧名と新名の対応（付録の三つのlabel、構造field、運用field、親DoD coverage、Dependency DAG、dependency results）、変えた理由（利用者の目に出る見出しから、普段の意味のまま読めない表現を無くすため）、古い成果物の読み方（旧名の見出しは新名と同じものとして読む。進行中のroadmap.mdを続ける時は、見出しを新名へ書き換えてよい）。
- `steering/SKILL.md`の、既存の成果物を読む箇所に共通する一文として、次を置く。「既存のdesign.md・roadmap.mdで、ここで探す見出しが見つからない時は、作成時のpluginの版が古い可能性がある。`task-design/templates/breaking_changes/`で旧名を確かめて読む。」steeringはtask-designの成果物を読む個別のskillなので、task-designのdirectoryを名指してよい。
- `maintenance-plugin-context/SKILL.md`の「Plugin version」節の「破壊的変更はMAJOR、…を上げる」の直下へ、全skillに当たる規則として次を足す。特定のskillやpathを名指さない。

```diff
 - 破壊的変更はMAJOR、後方互換な機能追加はMINOR、後方互換な修正・文書変更はPATCHを上げる
+  - MAJORを上げる理由が、以前の版のskillが作った成果物を、今の版のskillやscriptが見出し・labelの名前で読めなくなることなら、その成果物のテンプレートと同じdirectoryの`breaking_changes/`に記録を残す。無ければ作る。
+    - 記録しない変更: 成果物を読む側に影響しない変更（読まれない見出しの言い換え、テンプレートへのsectionの追加、記入guideの書き直し等）。git logと各作業の記録で辿る。
+    - 1件のfile: 名前は`YYYYMMDD-slug.md`。変わった版、旧名と新名の対応、変えた理由、古い成果物の読み方を書く。
+    - `breaking_changes/`のREADMEには、記録の対象がこの変更だけであることと、そのskillの成果物での具体例を書き、線と1件の書き方はこの規則を参照する。
```

破壊的変更なので、pluginのversionを8.3.5から9.0.0へ上げる（宣言値4箇所と`validate-plugin.mjs`の`expectedRelease`）。

記録する線（以前の版のskillが作った成果物を、今の版のskillやscriptが見出し・labelの名前で読めなくなる変更）を、今回以外の変更に当てた結果は次のとおりである。

| 変更 | 記録するか | 理由 |
| --- | --- | --- |
| 今回の付録・roadmapのlabelの切り替え | する | steeringが古いdesign.mdの付録を名前で探せなくなる |
| outcome sectionの見出しだけの言い換え | しない | skillもscriptも名前で読まない |
| テンプレートへ新しいsectionを足す | しない | 古い成果物も今までどおり読める |
| 「上位roadmap制約」の見出しを変える（仮） | する | scriptが古いdesign.mdから完全一致で抜き出せなくなる |
| 記入guideの書き直しだけ | しない | 成果物の見出し・labelが変わらない |

##### 共通の場所に個別を書き込まないための思考の作法

この設計の途中で、全skillに当たる版の規則から特定のskillのREADMEを正本として名指す案が出た。同じ誤りを繰り返さないため、`plugins/tumeda-dev/docs/think_standards/writing_abstraction.md`へ補助節「共通の場所に、今回の個別を書き込まない」を足し、このrepositoryの`.claude/hooks/think_through_session_start.sh`の「抽象を書く」の行の末尾に「共通の場所に今回の個別を書き込まない」を足す。補助節は、複数の対象に効く場所には全ての対象に当たる内容だけを書き、個別は個別の側に置いて個別から共通を参照する、という原則を、今回の例と文脈外の例（共通の金額整形の関数へ請求書画面のためだけの`if`を足す）、やってしまいがちな行動、帰結、判断の問い「今回の対象を、ここが効く別の対象に置き換えても、そのまま成り立つか」で示す。

既存の標準では止められなかった。`naming/core.md`の「中身を足す前に、名前が約束する範囲に入るかを確かめる」は話題での照合を許し、`writing_abstraction.md`の「文脈を離れた具体例で抽象の視野を確認する」は添える例の広さだけを扱い、`naming/README.md`の積集合の原則はnaming群に閉じている。誤りが起きたのは共通の規則（抽象）を書く場面であり、その場面の思考の作法はthink-throughとして毎ターン注入されるため、利用先repositoryでも効く。

**記載する原則と例:**

- 見分ける問い: このpluginを知らない開発者が、task-designのテンプレートや、それを使って書かれたdesign.mdでこの表現を見たとき、普段使っている意味のまま読んで、書き手の意図どおりに受け取れるか。受け取れないなら言い換え、受け取れるなら残す。英語か日本語かは問わない。
  - 今回の具体例（耳馴染みがない表現）: precedence、tie-break、closed-world、baseline、ledger、handoff、意味正本、理解依存、全量保存宣言、明示差分、形式知化、通底
  - 今回の具体例（聞き慣れているが、ここで特別な意味を載せている表現）: owner（その内容に責任を持つ担い手）、contract（呼び出し方と、結果の保証）、gate（先へ進む前の判定）、「所有する」（そのsectionに書く）、正本
  - 意図に反する薄い記述: 英語を日本語へ置き換えるだけにする。「所有する」「正本」のように日本語でも解釈が要る表現が残り、ownerを「オーナー」とカタカナにしても意味は伝わらない。
- 言い換えの仕方: 一語ずつ訳語を決めて置き換えず、箇所ごとに、その文で言いたいことを普段の言葉で書き直す。同じ語が箇所によって違う意味で使われているため、一語一訳では何を指すかが読み取れないまま残る。
  - 今回の具体例: 「owner境界: このsectionは…side effect保証を所有する」は「このsectionに書くこと・書かないこと: …成功・失敗のそれぞれで何が起きるか（保存、通知等）の保証を書く」とする。「主ownerとなるsectionへ書き」は「その内容を主に扱うsectionへ書き」とする。同じownerが、前者では「どのsectionに書くか」、後者では「主に扱うsection」へ書き直される。
  - 揃えるもの: 一つのsectionの中で同じものを繰り返し指す語は、そのsectionの中で一つの語に揃える（例: `workflow.md`の中で判断・更新の担い手を指す語）。全fileの記入guideに繰り返し出る小見出しは、file間で同じ言い換えに揃える。
  - 意図に反する薄い記述: ownerを一律に「担当」へ置き換える。「担当境界」は何の境界かを依然として読み取れない。
- 残す表現: 識別子・path・file名・code例、task-design全体で決まった形式（MUST／SHOULD／MAY、TBD、TL;DR、`KEEP | MOVE | ...`等）、普段の開発の会話で普段の意味のまま使う語（file、directory、code、test、API、class、function、module、error、data、Markdown、template、commit、branch等）。

**配置・形式:**

- 配置: 既存fileの書き換え。file追加・削除・改名はしない。
- 形式: 既存のMarkdown構造（HTML commentの記入guideと、記入欄）を保つ。

### 普段の言葉で書くための標準

#### 文書にする知識

- 埋もれていた知識: プロジェクト指示の「code、command、path、識別子、規定された出力形式、固有名詞は原文を維持する」が、owner、contract等の普通の概念語まで英語で書くことを止めていなかった。どの表現を避けるかの線引きはどこにも無く、書き手ごとに耳馴染みのない表現が増え、テンプレートからdesign.mdへ持ち込まれた。
- 原則へ引き上げるもの: 見分ける問い（このpluginを知らない読み手が、普段使っている意味のまま読んで受け取れるか）と、書き直し方（一語一訳にせず、箇所ごとに言いたいことを書く。同じものを指す語と、繰り返す小見出しは揃える）。

#### 読者と、読んでできるようになる判断

| 読者 | 読む場面 | codeや過去の会話を調べ直さずにできるようになる判断・作業 | 最初に開く場所・読む順序・検索語 |
| --- | --- | --- | --- |
| skillのテンプレートやdocsを書くagent・保守者 | `document-review`の作成時・更新時観点 | 書いた表現を書き直すか残すかを判定し、書き直し方を選べる | `document-review/SKILL.md`の観点list → `everyday_wording.md` |
| task-designでdesign.mdやchatを書くagent | 成果物とchatで利用者へ向けて書く時 | 利用者が訳し直さずに読める表現で書ける | `task-design/SKILL.md`§1 → `everyday_wording.md` |

#### 完成後の文書の構成

- 配置: `plugins/tumeda-dev/docs/documentation_standards/everyday_wording.md`（新設）。収録一覧`documentation_standards/README.md`へ一行足す。
- 既存の文書へ統合しない理由: `referent_explicitness.md`は語が指す実体を復元できるかを扱い、precedenceや全量保存宣言のような耳馴染みがない語の型が、名前の範囲（指示対象の明示）に入らない。
- 見出し: 一般則、見分ける問い、書き直す表現の二つの型（今回の例と、業務の手順書の「突合する」「洗い替える」という文脈外の例）、残す表現、書き直し方、当てはめる範囲（利用者の目に出る文と、書き手が表現を持ち込む入口になる記入の手引き。skillの内部だけの指示の文は対象外）、やってしまいがちな失敗。
- 参照: `document-review/SKILL.md`の作成時観点・更新時観点に「普段の言葉 → `everyday_wording.md`」、`task-design/SKILL.md`§1に、成果物とchatで利用者へ向けて書く表現を同標準で確認する一行。いずれも個別から共通の標準を参照する向きで、標準は特定のskillを名指さない。task-design以外のskillからの参照は今回は置かない（下の非目標）。

#### 内容を最新に保つ方法

| 保つべき内容 | 正とする記述の置き場所 | 直す人 | 直すきっかけ | 古くなったと気づく兆候・あわせて確認する文書 |
| --- | --- | --- | --- | --- |
| 見分ける問いと書き直し方 | `everyday_wording.md` | pluginの保守者 | 書き直すか残すかで迷う表現が出た時 | `document-review`の指摘が標準で判定できない。`validate-plugin.mjs`のassertion、`document-review/SKILL.md`、`task-design/SKILL.md`§1の参照 |

---

## 要件（Requirements）

### MUST（必達）

- 範囲に入る表現（outcome-sectionsの見出し・本文・記入欄のlabel・記入guide、design.md・tasklist.md・roadmap.mdのテンプレートの見出し・表のlabel・記入guide）に、「見分ける問い」で言い換え対象と判定される表現を残さない。
- file名は変えない。
- 既存の記入guideが持つ判断能力（なぜ必要か、NG、記述例、MUST、判断基準）を、言い換えで落とさない。
- 言い換えたlabelを名前で読むskill・script・validatorを、同じcommitで追随させる。

### SHOULD（できれば）

- 見本以外のfileでも、見本と同じ語の選び方に揃える（呼び出し元、呼び出し方、保証、担当、正とする記録等）。

### MAY（あれば嬉しい）

- なし

### 非目標

- SKILL.md・tasklist-design.md・roadmap-design.md等、agentへの指示の文の言い換え。skillの内部だけでやり取りされる語は、内輪で通じればよい。言い換えたlabelを名前で読む箇所の文字列の追随だけは行う。
- agentがchatで使う語の言い換え。出どころは指示の文であり、範囲に入れると指示の文を全部言い換えることになる。利用者へ向けて書く時の基準として、再発防止の側で扱う。
- task-design以外のskill（facilitate-discussion等）が作る成果物の言い換えと、それらのskillから`everyday_wording.md`への参照。今回のissueはtask-designの範囲であり、範囲を広げると他skillの成果物の書き直しまで含むことになるためである。他のskillの成果物で同じ型の表現が問題になった時に、その作業でこの標準を参照させる。

### 受け入れ基準

- `plugins/tumeda-dev/skills/task-design/templates/`の`outcome-sections/*.md`、`design.md`、`tasklist.md`、`roadmap.md`について、backtickの外の文から次の表現をgrepで抜き出すと、当たるのは下の「残してよい当たり」だけである。表現: owner、contract、caller、gate、ledger、baseline、evidence、finding、closed-world、handoff、outcome、precedence、tie-break、所有、正本、明示差分、全量保存、理解依存、通底、形式知、能力境界、single source、single writer、signal、orchestration、consumer、negative diagnosis、composition rule、side effect、identity、decision、routing。
  - 残してよい当たり: `outcome-sections/README.md`のcode block内のfile名、`catalog.md`の移行元の「function migration ledger」、`contract-preservation.md`の記入guide冒頭の`function_migration_policy.md`の語との対応とfile名`function-migration-ledger.md`、`workflow.md`の移行元の「Field ownership」。
- `plugins/`と`scripts/`で、旧label（task-design内で対象成果物へ適用済み、task-design内の対象成果物反映待ち、execution plan対象、構造field、運用field、親DoD coverage、Dependency DAG）が出るのは、`task-design/templates/breaking_changes/20261115-rename-template-labels.md`だけである。
- 宣言値4箇所と`validate-plugin.mjs`の`expectedRelease`が`9.0.0`である。
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed`、`node scripts/verification/test-task-design-handoff.mjs` が `task-design handoff tests passed` を出力する。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 言い換えで、元の表現が担っていた区別（例: callerとconsumer、ownerとwriter）が潰れる | 一語一訳をやめ、箇所ごとに言いたいことを書く。callerは「呼び出す側・呼び出し元」、consumerは「結果を受け取る側」、single writerは「書き込む担当を一つにする」と、別の言い方で書き分ける。ownerは意味ごとに七通りに書き分ける |
| テンプレートと、agentへの指示の文で、同じ概念の呼び方が二系統になる | 指示の文は内輪の語として残すと合意済み。成果物へ出るlabelは、名前で読む側の文字列を同じcommitで追随させ、取り決めの食い違いは作らない |

---

## テスト方針

- 受け入れ基準のgrepを実行し、当たりが残してよいものだけであることを確かめる。
- 旧labelのgrepを`plugins/`と`scripts/`に対して実行する。
- `node scripts/verification/validate-plugin.mjs`、`node scripts/verification/test-task-design-handoff.mjs`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs`を実行する。
- 書き直しで記入guideの項目（なぜ必要か、NG、記述例、書く条件、書くこと・書かないこと、MUST、判断基準）を削除・統合していないことを、元のfileと並べて確かめる。

---

## （付録）前提とする既存仕様

- プロジェクト指示（`AGENTS.md`、`.agents/skills/tumeda-dev-plugin-context.md`の「プロジェクト指示」）: repository内のdocument本文は日本語で記述する。code、command、path、識別子、規定された出力形式、固有名詞は原文を維持する。owner、contract等の普通の概念語は、この例外のどれにも当たらない。
- `outcome-sections/`の現状: 14 file、1137行。backtickの外にある英単語の出現数（大文字小文字を区別しない、2回以上のもの）を数えると、section 94、owner 70、contract 60、caller 31、ledger 29、outcome 27、state 24、gate 24、scope 20、evidence 20、baseline 16、finding 15、trigger 11、caller-facing 11、handoff 9、consumer 4、precedence 2、tie-break 2等である。
- `scripts/verification/validate-plugin.mjs`: outcome-sectionsの14 fileの存在と、`documentation.md`の三つの文（「統合する時は、統合先の範囲に入ることを」等）を検査する。outcome sectionの見出しの文字列は検査していない。design.md・roadmap.md・tasklist.mdのテンプレートについては、付録の見出し、roadmapの「構造field（task-designが設計・reviewする）」「運用field（steeringだけが更新する）」、tasklistの「特定の`steering` callerへ固定しない」等を完全一致で検査している。
- pluginのversion: 8.3.5。`maintenance-plugin-context`の版の規則で、破壊的変更はMAJORを上げる。
- `documentation_standards/referent_explicitness.md`: 「system内部語」が実体と結ばれていなければ暗黙の指示語として働く、と定める。聞き慣れた語にここだけの意味を載せた型とは重なるが、耳馴染みがない語の型は、語が指す実体ではなく語の馴染みの問題であり、この標準の範囲に入らない。
- `document-review`: 書いたmdをemit前に標準へ照らす。観点の中身は`documentation_standards/`の各fileが正本で、skillは参照だけを持つ。

---

## （付録）変更の実行区分

### 設計中に反映を終えた変更

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/docs/think_standards/writing_abstraction.md`、`.claude/hooks/think_through_session_start.sh`、`scripts/verification/validate-plugin.mjs` | 補助節「共通の場所に、今回の個別を書き込まない」の追加、場面別の要約への一言の追加、補助節の見出しと判断の問いのassertion | `node scripts/verification/validate-plugin.mjs`が`plugin validation passed`、`node scripts/verification/test-task-design-handoff.mjs`が`task-design handoff tests passed`。doc-enricherの提案modeで、`think_standards/README.md`の索引の一行（抽象と具体の往復をワンショットで行う）は補助節の追加後も正しく、既存READMEへ足す候補は無い | [共通の場所に個別を書き込まないための思考の作法](#共通の場所に個別を書き込まないための思考の作法) |
| `plugins/tumeda-dev/docs/documentation_standards/everyday_wording.md`（新設）、`documentation_standards/README.md`、`skills/document-review/SKILL.md`、`skills/task-design/SKILL.md`、`scripts/verification/validate-plugin.mjs` | 普段の言葉で書く標準の新設と、収録一覧・観点list・task-designの§1からの参照、assertionの追加 | `node scripts/verification/validate-plugin.mjs`が`plugin validation passed`。新設したfileは利用者のreviewで合意を得た。doc-enricherの提案modeで、収録一覧の一行以外に足す候補は無い | [普段の言葉で書くための標準](#普段の言葉で書くための標準) |
| `plugins/tumeda-dev/skills/task-design/templates/outcome-sections/`の14 file、`templates/design.md`、`templates/tasklist.md`、`templates/roadmap.md` | 見出し・記入欄のlabel・記入guideの小見出しの言い換え、本文と記入guideの書き直し、ownerの意味ごとの書き直し、design.md・roadmap.mdのlabelの切り替え | 受け入れ基準のgrepの当たりは、残してよいもの（code block内のfile名、移行元の引用、`function_migration_policy.md`の語との対応）だけ。記入guideの項目の削除・統合は無い。見本2 fileと、ownerの60行は利用者のreviewで合意を得た。見本以外の書き直しは任されたもので、全体の差分のreview待ち | [文書以外に作るfileの中身](#文書以外に作るfileの中身) |
| `steering/SKILL.md`、`task-design/SKILL.md`、`tasklist-executor/SKILL.md`、`task-design/roadmap-design.md`、`skills/README.md`、`runtime-feedback-review.md`、`scripts/verification/validate-plugin.mjs` | 切り替えたlabelの文字列の追随。`steering/SKILL.md`へ、見出しが見つからない時に`breaking_changes/`で旧名を確かめる一文を追加 | 旧labelのgrepの当たりは`breaking_changes/20261115-rename-template-labels.md`だけ。`node scripts/verification/validate-plugin.mjs`が`plugin validation passed`、`node scripts/verification/test-task-design-handoff.mjs`が`task-design handoff tests passed` | [design.md・roadmap.mdのテンプレートのlabel](#designmdroadmapmdのテンプレートのlabel) |
| `task-design/templates/breaking_changes/README.md`、`20261115-rename-template-labels.md`（新設）、`maintenance-plugin-context/SKILL.md`、宣言値4箇所と`expectedRelease` | 古い成果物を読むための記録、全skillに当たる版の規則への追記、version 9.0.0 | `validate-plugin.mjs`のassertion（記録の存在、版の規則の文、共通の規則が`task-design/templates/breaking_changes`を名指さないこと）が通る | [古い成果物を読むための記録](#古い成果物を読むための記録) |

### 設計中に反映する、他の判断を待っている変更

なし

### tasklist・roadmapに載せて実行する変更

なし
