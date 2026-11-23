# 議論記録

## 論点6: 実行を始めてよいかの確認を、どこに置くか

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** まとめて考える（波及: 中。task-designの返し方と、実行側のskillの起動の条件が変わる。他は小）

**依存先:** 論点3（実行側のskillが決まれば、「planの合意を実行開始の承認と読み替えない」をtask-designの返し方に置くか、実行側のskillの起動の条件に置くかを問える）。論点3は決まった。

### イテレーション0（論点6）: 実行を始めてよいかの確認の置き場所を提案する

#### 提案0（論点6）

今のsteeringの5-2は、tasklist・roadmapの合意の後、締めくくりの確認の結果を示してから、実行を始めるかを利用者へ明示に確かめる。planの合意を実行開始の承認と読み替えず、roadmapの結果を受けたこと自体を子の実行の承認とみなさない。この中身は変えず、置き場所を決める。

##### a. task-designが結果を返す時に確かめる（推奨）

- task-designのStep 6で、`tasklist_ready`・`roadmap_ready`の時は、締めくくりの確認の結果を示した後に、実行を始めるかを利用者へ確かめる。明示の指示（`OK`、`進めて`等）があれば、planの種類に対応するskill（`tasklist-executor`、roadmapを実行するskill）を起動する。拒否・保留・返事なしならそこで終える。
- roadmapを実行するskillから起動された子phaseのtask-designも、同じく確かめる。明示の指示があれば、その指示を結果に添えて返し、roadmapを実行するskillが起動する。今の子steeringも、phaseごとに5-2で確かめている。

##### b. 実行側のskillの起動の条件に置く

- `tasklist-executor`とroadmapを実行するskillが、「利用者の明示の指示なしに起動されない」を自分の起動の条件として持つ。task-designは結果と、次に起動するskillを示すだけにする。
- 起動の条件は、そのskillが起動された後に読まれる。task-designの結果を受け取ったagentが確かめずに起動することを、起動の前に止められない。`tasklist-executor`は子agentとして起動されるため、起動された時点で利用者と対話できない。

##### aを推す理由

確かめる時点は、planが合意された直後であり、次のskillを起動する前である。その時点で読まれているのはtask-designであり、確かめる規則を読み落とさずに起動の前で止まれるのはaである。

#### 検討記録（論点6・イテレーション0）

##### 判断: 実行を始めてよいかの確認を、確かめる時点で読まれている担当に置けるか

**確かめたこと:** `steering/SKILL.md`の5-2（ready result、主要成果物、締めくくりの確認の結果を示した後でのみ確かめる。plan合意を実行開始の承認と読み替えない。`roadmap_ready`を受けたこと自体を子の実行の承認とみなさない。Step 3直後に聞いてStep 4を飛ばすことを禁止する）と6-2の4（子steeringも同じflowを通る）。`tasklist-executor/SKILL.md`のfrontmatter（`context: fork`）。

**満たさなければならないこと:** 実行を始める前に、利用者の明示の指示を得る。締めくくりの確認の結果を示す前に聞かない。

**各案の評価:**

- a: 確かめる規則は、締めくくりの確認と同じtask-designのStep 6にあり、順序（確認の結果を示してから聞く）を一つのfileで保てる。起動の前に読まれる。
- b: 起動された後に読まれるため、起動の前に止まれない。子agentである`tasklist-executor`は利用者と対話できない。

**推す案:** a。

#### 提案0へのフィードバック（論点6）

**結果:** aに合意（論点11・6・8をまとめて示した往復で「他はok」と答えられた）

> 論点11はb。今後変更を伴わない調査設計とかも行う可能性があるから、分けておきたい。他はok

### 決定（論点6）

実行を始めてよいかの確認は、task-designが結果を返す時に行う。`tasklist_ready`・`roadmap_ready`では、締めくくりの確認の結果を示した後に、実行を始めるかを利用者へ確かめる。planの合意を実行開始の承認と読み替えず、`roadmap_ready`を受けたこと自体を子の実行の承認とみなさない。明示の指示があれば、planの種類に対応するskill（`tasklist-executor`、roadmapを実行するskill）を起動する。拒否・保留・返事なしならそこで終える。roadmapを実行するskillから起動された子phaseのtask-designも同じく確かめ、明示の指示を結果に添えて返し、roadmapを実行するskillが起動する。

実行側のskillの起動の条件に置かないのは、起動の条件はそのskillが起動された後に読まれ、起動の前に止められないためである。`tasklist-executor`は子agentとして起動され、起動された時点で利用者と対話できない。

## 論点7: 実装後のfeedbackの共通手順（`steering/implementation-feedback.md`）の置き場所

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。今も`tasklist-executor`とsteeringが読む共通手順で、steeringが無くなった後に読む担当へ移すだけになる見込み）

**依存先:** 論点3（feedbackを直接受ける実行側のskillが決まれば、置き場所を決められる）

### イテレーション0（論点7）: 実装後のfeedbackの共通手順の置き場所を仮決めする

#### 提案0（論点7）

- a. `tasklist-executor/implementation-feedback.md`へ移す（仮決め）
  - 根拠: 今このfileを読むのはsteeringと`tasklist-executor`（`tasklist-executor/SKILL.md`「実装feedbackの記録と返却」が`../steering/implementation-feedback.md`を読む）。論点3の決定で、`tasklist-executor`を起動する側が行うことも`tasklist-executor/execution-contracts.md`に置くため、feedbackを直接受ける担当（`tasklist-executor`とそれを起動する側）がすべて`tasklist-executor`の約束の下に入る。roadmapを実行するskillも起動する側としてここを読む。
  - 中身は変えず、「steeringまたはtasklist-executorが」等の担当の名指しを、起動する側を含む新しい担当へ書き換える。
- b. task-designへ移す
  - feedbackの戻し先の多くはtask-designのdesign phaseだが、このfileは戻す前に記録と原因の確認を行う手順であり、読むのはfeedbackを直接受けた実行側の担当である。

#### 検討記録（論点7・イテレーション0）

`steering/implementation-feedback.md`の冒頭（steeringまたは`tasklist-executor`が直接受領した時に読む）と、`tasklist-executor/SKILL.md`の参照を確かめた。読む担当は実行側だけで、論点3の決定の後は`tasklist-executor`とそれを起動する側（利用者の会話のagent、roadmapを実行するskill）になる。中身の変更は要らず、担当の名指しの書き換えだけで済む。

#### 提案0へのフィードバック（論点7）

**結果:** aに合意（論点7・9・10・12・13をまとめて示した往復で「それ以外はok」と答えられた）

> 論点9が何を扱う論点なのかわかってない。それ以外はok

### 決定（論点7）

実装後のfeedbackの共通手順は、`tasklist-executor/implementation-feedback.md`へ移す。feedbackを直接受ける担当（`tasklist-executor`と、それを起動する側である利用者の会話のagentとroadmapを実行するskill）は、すべて`tasklist-executor`の約束の下に入るためである。中身は変えず、「steeringまたはtasklist-executorが」等の担当の名指しを、起動する側を含む新しい担当へ書き換える。task-designへは移さない。戻し先の多くはtask-designだが、このfileは戻す前に記録と原因の確認を行う手順であり、読むのは実行側の担当である。

## 論点8: 実行の前提が崩れて進めない時の復旧（blocker resolution）の置き場所

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** まとめて考える（波及: 中。復旧の手順を読む担当と、`subagent_report/`の記録先が変わる。他は小）

**依存先:** 論点3（実行側のskillが決まれば、各skillに持たせるか、AI agentの実行の標準（`docs/agent_execution_standards/`）へ置くかを問える）。論点3は決まった。

### イテレーション0（論点8）: 進めない時の復旧の置き場所を提案する

#### 提案0（論点8）

今のsteeringの「Blocker resolution」は、designとtasklistが合意され実行に入った後に、skillの手順の内側では復旧できない形で実行の前提が崩れた時、agentが手順を離れて手を動かしてよいかを定める。成立する二つの条件、設計で潰せた不確実性を持ち込まないこと、復旧をtaskの成果にしないこと、検知した時の三択（a 止まって待つ／b 離れて都度確認／c 離れて自走）、自走の範囲と報告、離脱した段への復帰、記録先（作業の記録のdirectoryの`subagent_report/`、追跡しない）を持つ。中身は変えず、置き場所を決める。

##### a. `tasklist-executor/execution-contracts.md`の、起動する側が行うことへ置く（推奨）

- 論点3で、`tasklist-executor`を起動する側が行うこと（止まって返ってきた時の扱い）を`execution-contracts.md`に置くと決めた。`blocked`で返ってきた時の扱いとして、同じ場所へ置く。
- roadmapを実行するskillは、`tasklist-executor`を起動する側としてこの約束に従う。phaseの間に自分の手順で進めなくなった時も、同じ約束を参照する。
- 成立する条件の一つ目「designとtasklistが合意され、実行に入っている」は、`tasklist-executor`を起動する側でだけ成り立つ。使う担当と成立する場面が一致する。

##### b. AI agentの実行の標準（`docs/agent_execution_standards/`）へ新しいfileとして置き、実行側のskillから参照する

- skillの手順に沿って動くagentが、手順の内側で進めなくなった時に手順を離れてよいかは、人の開発者には要らない、AI agentに特有の扱いである。
- 群の入口の説明は「AI agent と、それを動かす実行環境（host の実行許可の仕組み、sandbox、分類器等）の性質から起きる、AI agent に特有の詰まり方への対処」である。blocker resolutionで崩れる前提（依存が無い、環境が壊れている等）は、実行環境の性質から起きるものに限らない。入れるには、入口の説明を「進めなくなった時のAI agentの振る舞い」へ広げることになる。

##### aを推す理由

成立する条件が実行に入った後に限られ、使う担当は`tasklist-executor`を起動する側（利用者の会話のagentと、roadmapを実行するskill）だけである。止まって返ってきた時の扱いと同じ場所にあれば、`blocked`を受けた時に読み落とさない。bは群の入口の説明を広げる判断が別に要り、広げた説明が今の`blocked_commands.md`と新しいfileの両方を覆う上位語になる。

#### 検討記録（論点8・イテレーション0）

##### 判断: blocker resolutionを、使う担当の近くに置くか、AI agentの実行の標準に置くか

**確かめたこと:** `steering/SKILL.md`の「Blocker resolution」全体（例外が成立する2条件、設計で潰せた不確実性を持ち込まない、blockerを解消してもFlowの成果にはしない、検知時の確認、自走の範囲と報告、離脱したstepへの復帰、blocker resolution中の記録先）。`docs/README.md`の`agent_execution_standards/`の入口の説明と、`docs/agent_execution_standards/blocked_commands.md`の冒頭（従う側として「`steering`のBlocker resolution」を名指す）。`docs/development_standards/naming/core.md`の「中身を足す前に、名前が約束する範囲に入るかを確かめる」。

**分かったこと:**

- 成立する条件の一つ目は「designが合意され、tasklistが合意され、実行に入っている」であり、plan無しで終わる作業や設計の途中では成立しない。今の文面の「Step 1のbranch作成でも起こり得る」は、二つ目の条件だけを見た記述である。
- `agent_execution_standards/`の入口の説明は、詰まる原因を「AI agentと実行環境の性質」に限っている。blocker resolutionの原因はそれに限らないため、元の中身のまま照合すると範囲に入らない。

**各案の評価:**

- a: 使う担当と成立する場面に一致する。`execution-contracts.md`は既に子agentを起動する側の約束を持ち、範囲の内である。
- b: 再利用はしやすいが、群の入口の説明を広げる別の判断が要る。今の使い手は`tasklist-executor`を起動する側だけである。

**推す案:** a。`blocked_commands.md`の冒頭で名指している「`steering`のBlocker resolution」は、置き場所の変更に合わせて書き換える。

#### 提案0へのフィードバック（論点8）

**結果:** aに合意（論点11・6・8をまとめて示した往復で「他はok」と答えられた）

> 論点11はb。今後変更を伴わない調査設計とかも行う可能性があるから、分けておきたい。他はok

### 決定（論点8）

進めない時の復旧（blocker resolution）は、`tasklist-executor/execution-contracts.md`の、起動する側が行うことへ置く。`tasklist-executor`が`blocked`で返ってきた時の扱いとして、止まって返ってきた時の扱いと同じ場所に置く。roadmapを実行するskillは、`tasklist-executor`を起動する側としてこの約束に従い、phaseの間に自分の手順で進めなくなった時も同じ約束を参照する。中身（成立する二つの条件、設計で潰せた不確実性を持ち込まない、復旧をtaskの成果にしない、検知した時の三択、自走の範囲と報告、離脱した段への復帰、記録先の`subagent_report/`を追跡しない）は変えない。`docs/agent_execution_standards/blocked_commands.md`の冒頭で名指す「`steering`のBlocker resolution」は、置き場所に合わせて書き換える。

`docs/agent_execution_standards/`へ置かないのは、成立する条件が実行に入った後に限られ、使う担当が`tasklist-executor`を起動する側だけであるためと、群の入口の説明（AI agentと実行環境の性質から起きる詰まり方）に、原因がそれに限らないblocker resolutionが入らないためである。

## 論点9: 記録をcommitへ載せる順序の規則の置き場所

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。規則の中身は変えず、置き場所だけを決める見込み）

**依存先:** 論点1（決定済み）。steeringの「commitへ載せる順序」（記録を、対応する変更の前と後へ分ける）を、plan無しの公開を持つtask-design、tasklistのcommitの節を設計する`tasklist-design.md`、commit計画の`plan-commits`のどこへ置くかを問う。論点3の後に、他の論点とまとめて示す

### イテレーション0（論点9）: 記録をcommitへ載せる順序の規則の置き場所を仮決めする

#### 提案0（論点9）

- a. `plan-commits`へ移す（仮決め）
  - 根拠: `plan-commits`は「コミット計画、変更の分割、レビューする単位と順番」を受け持つ（`plan-commits/SKILL.md`のdescription）。tasklistのcommitの分け方も「分け方の基準は`plan-commits`に従い、commit taskの実行時は実差分へ`plan-commits`を当てて境界を決める」（`task-design/tasklist-design.md`の「実装後feedbackと公開action」）。記録を、対応する変更の前と後へ分ける規則は、commitの境界と順序の規則である。
  - plan無しで終わる作業の公開（task-design）も、tasklistのcommit taskも、`plan-commits`を通るため、どちらの経路でも読まれる。
  - 移す時に「steering成果物」を「作業の記録（`design.md`、議論記録、`tasklist.md`、`implementation_review.md`等）」へ言い換える。判断の問い・やってしまいがちな行動・まとめてよい条件は変えない。
- b. task-designの公開の手順へ置く
  - plan無しで終わる作業では読まれるが、tasklistのcommit taskの実行時には読まれない。

#### 検討記録（論点9・イテレーション0）

`steering/SKILL.md`の「commitへ載せる順序」、`plan-commits/SKILL.md`のdescriptionと本文、`task-design/tasklist-design.md`152行目のcommit sectionの記述を確かめた。`plan-commits`の本文は作業の記録とcommitの関係をまだ扱っていない（「既存記録」は依存の観点として一度出るだけ）。新しい節として足すことになり、範囲（commit計画、変更の分割、レビューする単位と順番）に入る。

#### 提案0へのフィードバック（論点9）

**結果:** 論点の中身が伝わらなかった

> 論点9が何を扱う論点なのかわかってない。それ以外はok

提案0は、規則を「記録を、対応する変更の前と後へ分ける規則」と短く呼ぶだけで、どの規則か、何を分けるのか、なぜ要るのかを示していなかった。案の比較の前に、規則の中身と、今steeringのどこにあり誰が使うかを具体例で示す必要がある。

### イテレーション1（論点9）: 規則の中身を具体例で示し、置き場所を問い直す

#### 提案1（論点9）

##### この論点が扱う規則

`steering/SKILL.md`の「commitへ載せる順序」という節にある規則である。一つの作業をcommitする時、`.steering/`の作業の記録を、最後に一つのcommitへまとめず、確定した時点に合わせて変更のcommitの前と後へ分ける。

| 記録 | 確定する時点 | 置くcommit |
| --- | --- | --- |
| `design.md`、議論記録（`task-design-discussion.md`等） | 変更を行う前に合意して確定する | 対応する変更のcommitより前 |
| skill・docs・code等の変更 | — | 変更のcommit |
| `tasklist.md`のcheckboxの完了、`implementation_review.md`、締めくくりの見直しで書き足した記録 | 変更を終えてから確定する | 対応する変更のcommitより後 |

このrepositoryの直近の作業（PR #31）が、この規則に従った例である。

```text
c1f89c7 docs(steering): planlessの完了に公開の段を足す論点を出す              ← 記録（議論）
9f810d6 docs(steering): planlessの完了でtasklistと同じ条件で公開すると決める    ← 記録（決定）
100cd4b docs(tumeda-dev): steeringのplanless完了で、…PRまで公開する            ← 変更（steering/SKILL.md、validator）
24f1ce1 docs(steering): 締めくくりのreviewで加えた変更をdesignと対応表に書き足す ← 記録（変更の後に確定）
```

規則がある理由は、後からcommitの履歴を読む人が「どの変更が、どの合意に基づくか」をcommit単位で辿れるようにするためである。`.steering/`配下という置き場所で記録を括り、最後の一つのcommitへまとめると、合意が変更より後に記録された履歴になる。

##### 何を決めるか

steeringが無くなるため、この節の行き先を決める。この規則を使うのはcommitを作る担当であり、変更後は二つある。

- plan無しで終わる作業: task-designが変更を公開する時にcommitする（論点1・12の決定）
- tasklistを作る作業: `tasklist-executor`がtasklistのcommit taskを実行する時にcommitする

##### a. `plan-commits`へ移す（仮決め）

- 根拠: `plan-commits`は「コミット計画、変更の分割、レビューする単位と順番」を受け持つ（`plan-commits/SKILL.md`のdescription）。tasklistのcommitの分け方も、`task-design/tasklist-design.md`が「分け方の基準は`plan-commits`に従い、commit taskの実行時は実差分へ`plan-commits`を当てて境界を決める」と定めている。どちらの担当も`plan-commits`を通るため、この規則がどちらの経路でも読まれる。
- 移す時に「steering成果物」を「作業の記録」へ言い換える。前と後への分け方、まとめてよい条件（一つのcommitで完結し、分けても辿れる情報が増えない時）、判断の問いは変えない。

##### b. task-designの公開の手順（論点12で分けるfile）へ置く

- plan無しで終わる作業の公開では読まれる。tasklistのcommit taskの実行時には読まれず、tasklistを作る作業で記録が最後の一つのcommitへまとまる形に戻る。

#### 検討記録（論点9・イテレーション1）

提案0の示し方を見直した。規則の名前だけを示し、規則の中身（何をどこへ分けるか）、理由、今の置き場所を示していなかった。`steering/SKILL.md`の「commitへ載せる順序」を読み直し、表と、このrepositoryの直近のcommit履歴（`git log`の`c1f89c7`〜`24f1ce1`、各commitが変更したfile）を具体例として加えた。各commitのfileは、`9f810d6`が`task-design-discussion.md`だけ、`100cd4b`が`steering/SKILL.md`と`validate-plugin.mjs`、`24f1ce1`が`design.md`・`task-design-discussion.md`・`contract-ledger.md`であり、表の分け方と一致する。案と推す理由は提案0から変えていない。

#### 提案1へのフィードバック（論点9）

**結果:** bを選択。aは前提の誤り

> bだね。逆にaを挙げてるのが意味わからない。plan-commitsはsteering色のない汎用の存在だから

`plan-commits`は、特定のworkflowや作業の記録の置き方を前提にしない汎用のskillである。aは、steeringの作業の記録に固有の規則を、「commitの境界と順序の規則」という`plan-commits`に合う一面だけで言い直し、作業の記録に固有であるという性質を落として照合していた。`docs/development_standards/naming/core.md`の「中身を足す前に、名前が約束する範囲に入るかを確かめる」が、この言い直しを失敗例として挙げており、標準は既にあった。原因は標準の当てはめの誤りである。`plan-commits/SKILL.md`は`name-work-directory`のように「特定のworkflowを前提にしない」と明記していないため、明記するかは締めくくりの`doc-enricher`で候補にする。

### 決定（論点9）

記録をcommitへ載せる順序の規則（`design.md`・議論記録は対応する変更のcommitより前、tasklistのcheckboxの完了・`implementation_review.md`・締めくくりで書き足した記録は後、まとめてよい条件、判断の問い）は、task-designの公開の手順（論点12で分ける内部指示のfile）へ置く。中身は変えず、「steering成果物」を「作業の記録」へ言い換える。

tasklistを作る作業でも規則を保つため、tasklistのcommit sectionを設計する`task-design/tasklist-design.md`はこの規則を参照し、commit taskに記録の分け方を書く。今のsteeringの規則は、plan無しの公開とtasklistのcommitの両方に効いており、その範囲を変えない。

`plan-commits`へは置かない。`plan-commits`は特定のworkflowや作業の記録の置き方を前提にしない汎用のskillであり、steeringの作業の記録に固有の規則は範囲に入らない。

## 論点10: steering固有の議論記録（`discussion.md`）の扱い

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 確かめるだけ（全部小。steeringの段取りの上の議論を記録する場所であり、行き先は段取りを持つ担当に従う見込み）

**依存先:** 論点3（段取りを持つ担当が決まれば、その担当の議論記録として残すか、無くすかを決められる）

### イテレーション0（論点10）: steering固有の議論記録の扱いを仮決めする

#### 提案0（論点10）

- a. roadmapを実行するskillの議論記録として残す。basenameは`discussion.md`のまま（仮決め）
  - 根拠: steeringの`discussion.md`の主な用途は「ready result後の進行判断: runtime state、dispatch、再開位置について複数往復で検討した過程」と「orchestration中に生じた疑問・背景」である（`steering/SKILL.md`「discussion.mdの使い方」）。論点3の決定で、この段取りを持つのはroadmapを実行するskill（tasklistの時は`tasklist-executor`を起動する側）になる。
  - basenameを変えないのは、既にある記録と前月summaryの読み取りが`discussion.md`を前提にしており、名前を変える利益が無いためである。
  - tasklistの時の段取りの議論も、起動する側が同じ`discussion.md`へ記録してよいことを`execution-contracts.md`の起動する側が行うことに書く。
- b. 無くす
  - 段取りの議論はtask-designの議論記録か`implementation_review.md`へ入れる。設計の議論と実装後のfeedbackの記録に、どちらでもない段取りの議論が混ざる。

#### 検討記録（論点10・イテレーション0）

`steering/SKILL.md`の「discussion.mdの使い方」と「成果物のlifecycle」を確かめた。`discussion.md`は設計の議論（`task-design-discussion.md`）とも実装後のfeedback（`implementation_review.md`）とも別の、段取りの上の議論の置き場所である。段取りを持つ担当へ移すと、置き場所の役割は変わらない。

#### 提案0へのフィードバック（論点10）

**結果:** aに合意（論点7・9・10・12・13をまとめて示した往復で「それ以外はok」と答えられた）

> 論点9が何を扱う論点なのかわかってない。それ以外はok

### 決定（論点10）

steering固有の議論記録`discussion.md`は、実行の段取りの議論の記録として残す。書くのは、roadmapを実行するskillと、tasklistの時は`tasklist-executor`を起動する側である。basenameは`discussion.md`のまま変えない。既にある記録と前月summaryの読み取りが`discussion.md`を前提にしており、名前を変える利益が無いためである。tasklistの時に段取りの議論を記録してよいことは、`tasklist-executor/execution-contracts.md`の起動する側が行うことに書く。

