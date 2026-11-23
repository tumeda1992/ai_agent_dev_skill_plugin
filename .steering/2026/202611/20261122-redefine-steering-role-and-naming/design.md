# Design: steeringの役割を見直し、役割に合う名前へ揃える

## 元の依頼内容

https://github.com/tumeda1992/ai_agent_dev_skill_plugin/issues/11 「もはやsteeringはオーケストリングスキルじゃなくて、ディレクトリ整備だけの役割？」の本文（2026-11-22時点）。

````text
元はsteeringが1スキルだった名残だけど、skill分割した結果、ただただディレクトリ作るだけのskillになってしまった。
doc-enricherもtask-designが持って良いし。

steeringスキルの名前を変えて、task-designから置き場所を決めるskillというtask-designに紐付くskillにしてもいい。

波及先として作っているディレクトリ名を変えることも検討。.steeringを .task-design/でもいい
タスク設計に限らないものも入れるからそれらを入れられる名前にしてもいい。調査設計とか、色々入ってくるし。
最大公約数にした結果意味のない名前になってほしくないけど
````

---

## TL;DR

tasklist・roadmapの設計をtask-designへ移した後（`20260802-move-tasklist-ownership-to-task-design`）、steeringは記録の置き場所の管理を除くと、task-designを包む不完全な層になった。steeringを解き、作業の入口をtask-designにして、受け持ちをそれぞれあるべき担当へ置く。終了時には、記録の置き場所の準備は独立したskill（task-designが呼ぶ）が、設計の締めくくりとplan無しで終わった変更の公開はtask-designが、planの実行の段取りは実行側のskillが受け持ち、steeringというskillは無くなる。記録は`.design-records/`へ置く。置き場所を用意するskillは`prepare-design-record`。TBD: roadmapを進めるskillの名前（論点15）。

---

## 完成後の姿

選ぶsectionは次の四つである。各sectionの本文は、残る論点の決定後に書く。

- `skill-policy.md`: 変更後の各skill（task-design、置き場所を用意するskill、実行側のskill）の役割と受け持つ範囲
- `workflow.md`: 作業の始まりから設計・実行・実装後のfeedbackまでの担当と引き継ぎ
- `file-deliverables.md`: 変更後の`SKILL.md`、template、hook、validator、`.gitignore`の見本の中身
- `contract-preservation.md`: steeringの受け持ちを移す前後で、何を保存し何を変えるか

### steeringの受け持ちの行き先

利用先repositoryでは大抵planを作るため、planの合意の後に実行側のskillへ替わる経路が通常の経路になる。task-designを包むだけのskillを実行側に作り直さない。

実行の段取りは、planの種類ごとに、そのplanを実行する担当が持つ。plan全般を実行するskillは作らない。tasklistの時に`tasklist-executor`を包む層になり、無くしたsteeringと同じ形になるためである。roadmapは`tasklist-executor`へ寄せない。`tasklist-executor`は`context: fork`の子agentとして動き、phaseごとに利用者と議論するtask-designを起動できないためである。代償として、planの種類によって利用者が起動するskillが二通りになる。

実行を始めてよいかの確認をtask-designに置くのは、確かめる時点（planの合意の直後、次のskillを起動する前）に読まれているのがtask-designだからである。実行側のskillの起動の条件は起動された後に読まれ、`tasklist-executor`は子agentとして起動されるため利用者と対話できない。

進めない時の復旧を`execution-contracts.md`に置くのは、成立する条件が「designとtasklistが合意され、実行に入っている」に限られ、使う担当が`tasklist-executor`を起動する側だけであるためである。`docs/agent_execution_standards/`の入口の説明は、AI agentと実行環境の性質から起きる詰まり方に限っており、原因がそれに限らないblocker resolutionは入らない。

置き場所の準備を独立したskillにするのは、変更を伴わない調査の設計のように、task-designを通さずに記録を置く作業を利用者が予定しているためである。

```text
tasklist_ready → tasklist-executor
roadmap_ready  → roadmapを実行するskill
                   └ phaseごと: task-designを起動（上位roadmapの制約を渡す）
                        ├ tasklist_ready → tasklist-executor
                        ├ roadmap_ready  → roadmapを実行するskill（入れ子）
                        └ planless_complete → 完了を確かめる
```

| steeringが受け持っていたこと | 行き先 |
| --- | --- |
| 記録の置き場所の準備（命名、directoryの作成、前月の`summary.md`、任意のbranch作成） | 置き場所を用意する独立したskill`prepare-design-record`。前月の`summary.md`の生成は、このskillの内部指示の別fileへ分ける。task-designが呼び、単独で起動したtask-designも同じ置き場所を使う。変更を伴わない調査の設計のように、task-designを通さずに記録を置く作業からも呼べる |
| task-designの起動と、返った結果とfileの対応の確認 | 無くなる。利用者が直接task-designを起動する |
| 締めくくりの確認（`doc-enricher`の提案mode、議論記録からの再発防止先の見直し、skill自身の見直し） | task-designの内部指示の一つのfile。Step 6で結果を返す前に読む。実行を始めてよいかの確認もこのfileの末尾に置く |
| plan無しで終わった変更の公開（commit・push・PR） | task-designの、締めくくりの確認と同じ内部指示のfile |
| standalone roadmapの昇格 | 無くなる。置き場所が一通りになるため |
| 実行を始めてよいかの確認 | task-designが結果を返す時。締めくくりの確認の結果を示した後に確かめ、明示の指示があればplanの種類に対応するskillを起動する。roadmapの子phaseでは指示を結果に添えて返し、roadmapを実行するskillが起動する |
| `tasklist-executor`の起動、止まって返ってきた時の扱い、tasklistのcheckboxとartifactの読み直し、design.mdとの食い違いを実装後のreviewへ回すこと | `tasklist-executor/execution-contracts.md`の、起動する側が行うこと。利用者の会話から直接起動しても、roadmapを実行するskillが起動しても同じ約束で扱う |
| roadmapの各phaseの実行（phaseの選択、task-designの起動、結果に応じた実行、子のpath・status・完了日の更新、完了の伝播） | 新しいskill（roadmapを実行するskill）。phaseの子のpath・status・完了日を書くのはこのskillだけ |
| 実装後のfeedbackの記録と戻し先（`implementation-feedback.md`） | `tasklist-executor/implementation-feedback.md`。feedbackを直接受ける担当（`tasklist-executor`と、それを起動する側）が読む。中身は変えず、担当の名指しだけを書き換える |
| 実行の前提が崩れて進めない時の復旧（blocker resolution） | `tasklist-executor/execution-contracts.md`の、起動する側が行うこと（`blocked`で返ってきた時の扱い）。roadmapを実行するskillも同じ約束に従う。中身は変えない |
| 記録をcommitへ載せる順序の規則 | task-designの、締めくくりの確認と公開の内部指示のfile。tasklistのcommit sectionを設計する`task-design/tasklist-design.md`もこの規則を参照する。汎用の`plan-commits`へは置かない |
| steering固有の議論記録（`discussion.md`） | 実行の段取りの議論の記録として残す。roadmapを実行するskillと、tasklistの時は`tasklist-executor`を起動する側が書く。basenameは`discussion.md`のまま |

### 作業の記録を置くdirectory

作業の記録は`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/`へ置き、月の一覧は`.design-records/YYYY/YYYYMM/summary.md`に置く。入るもの（タスク設計、調査設計、その議論・計画・実行の経緯）に共通する核は「設計」であり、「作業」まで広げずに調査の設計も含めて範囲を覆える。`records`は、決定と経緯が残る場所であることを示し、後の作業が過去の決定を探しに来る使われ方と合う。

既にある`.steering/`の記録は`.design-records/`へ移す。このrepositoryでは今回の作業で`git mv`し、進行中の作業のdirectoryも一緒に移す。利用先repositoryでは、置き場所を用意するskillが、`.steering/`があり`.design-records/`が無い時に移すことを利用者へ提案し、承認されたら一度だけ移す。両方がある時は推測で混ぜず利用者へ確かめる。記録の本文に残る`.steering/…`のpathは書き換えず、`prepare-design-record`のdirectoryに作る`breaking_changes/`の記録で「`.steering/…`は`.design-records/…`として読む」と残す。この記録を置けるよう、`maintenance-plugin-context/SKILL.md`「Plugin version」の記録の対象を「見出し・labelの名前や、置き場所のpathで読めなくなること」へ広げる。読む箇所は`.design-records/`だけを見る。他のbranchで`.steering/`の下にfileを足している作業とmergeの時に衝突しうることは、移す代償として受け入れる。

### TBD: skillの名前

置き場所を用意するskillと、実行側のskillの名前（論点4）。

---

## 要件（Requirements）

TBD: 方向性の合意後に書く。

### 非目標

TBD

### 受け入れ基準

TBD

---

## リスクと対策

TBD

---

## テスト方針

TBD

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/skills/steering/SKILL.md`（9.1.7、`085cc08`時点）: steeringが現に受け持つことは次のとおり。
  - 作業の記録の置き場所: `name-work-directory`での命名、`branch_from_basename`でのbranch作成、`.steering/YYYY/YYYYMM/YYYYMMDD-slug/`の作成、前月の`summary.md`の生成（Step 1）。
  - task-designの起動と、返ったresultとfileの対応の確認（Step 2〜3）。
  - ready result後の必須gate: `doc-enricher`の提案mode（4-1）、議論記録からの再発防止先のreview（4-2）、steering自身の確認（4-3）。
  - planless完了の公開（commit・push・PR）と完了報告（5-1）。
  - plan resultの実行開始の確認（5-2）、`tasklist-executor`へのdispatchと停止後の読み直し（6-1）。
  - roadmapの子steeringのbinding、status・完了日の更新、完了の伝播（6-2）と、standalone roadmapの昇格。
  - 実装後のfeedbackの記録と戻し先の決定（`implementation-feedback.md`。`tasklist-executor`も同じfileを読む）。
  - blocker resolution、steering固有の`discussion.md`、steering成果物をcommitへ載せる順序。
- このrepositoryの経路の実績（`.steering/2026/`配下の`design.md`を持つdirectoryを、`tasklist.md`・`roadmap.md`の有無で数えた）: 202607〜202610は`tasklist.md`16件、`roadmap.md`1件、planなし20件。202611は21件すべてplanなし。plan無しの経路では、steeringが行うのは置き場所の準備、task-designの起動、締めくくりのgate、公開だけになる。
- 過去の決定（`.steering/2026/202608/20260802-move-tasklist-ownership-to-task-design/design.md` D1・D2・D4）: tasklist・roadmapの設計をtask-designへ移し、steeringはrepository contextの準備、task-designの起動、roadmapの子steeringのbinding・status伝播、plan合意後の振り返り、実装開始、実装後reviewへ責務を絞った。steering経由では、steering directoryをtask-designのworking directoryとして`create_working_dir=false`で直接使う。
- `plugins/tumeda-dev/skills/task-design/SKILL.md` PrepareStep 2: 単独起動のtask-designは`<working_dir_parent または cwd>/<YYYYMMDD-slug>`を作る。`.steering/`の構造へ置くには、steeringの「standalone roadmapの昇格」で移動する。
- task-designも設計中に`doc-enricher`を呼ぶ（PrepareStep 3の4、skill・docsを即時適用した時）。steeringの4-1は「theme全体を横断する最終safety net」として新たな候補だけを扱う。
- `steering`という語の参照: `.steering/`配下を除き43 file・312箇所（`grep -ro`の出現数）。`.steering`というpathの参照: 同26箇所。主な参照元は`steering/SKILL.md`、`scripts/verification/validate-plugin.mjs`、`task-design/SKILL.md`、`escalate-plugin-skill-fix/SKILL.md`、`task-design/roadmap-design.md`、`.claude/hooks/think_through_*.sh`、`facilitate-discussion`、`tumeda-dev-plugin-context.md`。
- `escalate-plugin-skill-fix/SKILL.md`: 利用先からの改善提案を、plugin repositoryで`steering`を`branch_from_basename=true`で起動して引き渡す。
- `.claude/hooks/think_through_session_start.sh`: 「`.steering/` 配下を読み書きする前に、Skill で tumeda-dev:task-design を起動する」を毎session注入する。
- `plugins/tumeda-dev/skills/steering/.gitignore.sample`: 利用先が`.steering/.gitignore`へ複製し、`subagent_report/`、`task-design-catch-up/`、`internal-records/`を追跡対象外にする。
- 配布version: 9.1.7（宣言値4箇所と`expectedRelease`）。

---

## （付録）変更の実行区分

### 設計中に反映を終えた変更

なし

### 設計中に反映する、他の判断を待っている変更

なし

### tasklist・roadmapに載せて実行する変更

TBD

### 分類保留（設計中のみ）

| 変更候補 | 保留理由 | 分類を決める判断 |
| --- | --- | --- |
| steeringの`SKILL.md`と内部指示を各担当へ移し、steeringを削除する | 実行側のskillの分け方と、各受け持ちの行き先が未決 | 論点3、論点6〜10 |
| task-designへ締めくくりの確認とplan無しの公開を移す | 移す先の節と、置き場所を用意するskillとの境目が未決 | 論点3〜5 |
| 置き場所を用意する独立したskillの新設 | 名前と、directoryの名前、前月summaryの内部指示の分け方が未決 | 論点4、論点5、論点13 |
| `.steering/`の改名と既存記録の扱い | 名前と移行方針が未決 | 論点5 |
| 参照元（`escalate-plugin-skill-fix`、hook、validator、`facilitate-discussion`、`tumeda-dev-plugin-context.md`等）の追随 | 名前と行き先が未決 | 論点3〜10 |
