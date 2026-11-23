# 議論記録

## 論点1: steeringが受け持っていることを、どのskillへどう分け直すか

**ステータス:** 決定

**種別:** TBDヒアリング / 認識齟齬

**重さ:** 一つずつ考える（波及: 大。残すskillの数、名前、記録を置くdirectoryの名前、参照元の追随がすべてこの答えで変わる。戻しにくさ: 大。利用先repositoryで作業を始める入口と、記録の置き場所が変わる。確かめる手間: 中。現在の責務の一覧と経路の図を読む必要がある。利用者の前提への依存: 中。plan有りの作業でも入口を一つに保ちたいかは、利用者の運用で決まる）

### イテレーション0（論点1）: 現在の責務を確かめ、分け直しの方向を提案する

#### 提案0（論点1）

##### 依頼の前提と、現在のsteeringの受け持ちの差

依頼の前提「steeringはディレクトリを作るだけになった」は、plan（`tasklist.md`・`roadmap.md`）を作らずに終わる作業では事実である。planを作る作業では事実ではなく、steeringは実行の段取りを今も受け持っている。

| steeringが受け持つこと（`steering/SKILL.md`、9.1.7） | plan無しで終わる作業 | planを作る作業 |
| --- | --- | --- |
| 記録の置き場所の準備（`name-work-directory`での命名、`.steering/YYYY/YYYYMM/YYYYMMDD-slug/`の作成、前月の`summary.md`、任意のbranch作成） | 動く | 動く |
| task-designの起動と、返った結果とfileの対応の確認 | 動く | 動く |
| 締めくくりの確認（`doc-enricher`の提案mode、議論記録からの再発防止先の見直し、steering自身の見直し） | 動く | 動く |
| plan無しで終わった変更の公開（commit・push・PR） | 動く | — |
| 実行を始めてよいかの確認、`tasklist-executor`への受け渡し、止まった後のtasklistの読み直し | — | 動く |
| roadmapの各phaseの実行（子steeringの割り当て、status・完了日の更新、完了の伝播） | — | roadmapの時 |
| 実装後のfeedbackの記録と、戻し先の決定（`implementation-feedback.md`） | — | 動く |
| 実行の前提が崩れて進めない時の復旧（blocker resolution） | — | 動く |

このrepositoryでは、202611の21件の作業がすべてplan無しで終わっている。skillとdocsの変更はtasklistに載せる条件（本番のapplicationのcode変更、段階を踏む実行、利用者の指定）に当たらないためである。このrepositoryで見る限り、steeringはディレクトリを作ってtask-designを包むだけに見える。利用先repositoryでapplicationのcodeを変える作業はtasklistを作り、上の表の下半分が動く。

この差を踏まえ、steeringの受け持ちをどう分け直すかを三つの案で示す。

##### a. steeringを「一つの作業を始めから終わりまで受け持つskill」として残し、名前をその役割へ合わせる

入口は今と同じ一つのskillのまま、表の全行をこのskillが持ち続ける。変えるのは名前である（締めくくりの確認をtask-designへ移すかは論点2で決める）。

- plan無しで終わる作業では、このskillがtask-designを包むだけになる状態は変わらない。名前が「作業全体を受け持つ」ことを表していれば、包むだけの回があっても名前と役割は食い違わない、という整理になる。
- task-designを単独で起動すると、現在のdirectory直下に記録を作る。roadmapの時だけ、steeringの「standalone roadmapの昇格」で`.steering/`へ移す。この置き場所の二通りは残る。
- 変更は名前とその参照の追随に収まる。

##### b. steeringを解き、作業の入口をtask-designにする（推奨）

```text
plan無しで終わる作業
  利用者 → task-design ─┬→ 置き場所を用意する小さなskill（命名、directory、前月summary、branch）
                         ├→ 設計・議論・反映・validation
                         └→ 締めくくりの確認 → 公開 → 完了

planを作る作業
  利用者 → task-design → … → planの合意 → 締めくくりの確認 → 結果を返す
         → 実行を始めてよいかの確認
         → 実行の段取りを持つskill ─┬→ tasklist-executor
                                      ├→ roadmapの各phase: task-designを起動して設計し、その結果を実行する
                                      └→ 実装後のfeedback、進めない時の復旧
```

- 置き場所の準備は、task-designから呼ぶ小さなskillへ切り出す。依頼にある「task-designから置き場所を決めるskill」に当たる。単独で起動したtask-designも同じ置き場所を使うため、置き場所が一通りになり、「standalone roadmapの昇格」は要らなくなる。
- 締めくくりの確認とplan無しで終わった変更の公開は、設計を締めくくる担当であるtask-designが持つ。依頼にある「doc-enricherもtask-designが持って良い」に当たる。
- 実行の段取り（表の下半分）は無くならないため、実行側のskillに残す。新しいskillにするか、`tasklist-executor`へ寄せるかは論点3で決める。
- 変更は大きい。`escalate-plugin-skill-fix`、hook、validator、利用先repositoryで作業を始める時の呼び方が変わり、配布versionはMAJORを上げる。

##### c. steeringの受け持ちをすべてtask-designへ移す

入口はtask-designだけになり、実行の段取りとroadmapの各phaseの実行もtask-designが持つ。

- task-designは「planを実行しない」という今の境目を失い、設計と実行の両方の止まり方・再開の仕方・完了の条件を一つのskillで抱える。task-designの`SKILL.md`は既に長く、独立した判断・状態・完了の条件を持つ工程を複数抱える形になる。`skill-update-review`が切り出しを促す形である。

##### bを推す理由

依頼の動機である「名前と役割の食い違い」は、aでもbでも解ける。差が出るのは、plan無しで終わる作業が通るskillの層と、置き場所が二通りあることである。このrepositoryの作業のほとんどはplan無しで終わり、そこでsteeringはtask-designを包むだけの層になっている。bはこの層を消す。名前の問題も、包むだけの層に合う名前を探す問題から、実際にある役割（置き場所、設計、実行）へ名前を付ける問題に変わる。

aの利点は、planを作る作業でも入口が一つで済むことである。bではplanの合意の後に実行側のskillへ替わる。ただし今もplanの合意の後に「実行を始めてよいか」を利用者へ確かめているため、その確認を境にskillが替わるだけで、利用者との往復は増えない。roadmapは、bでも実行側のskillがphaseごとにtask-designを起動すれば今と同じく入れ子で進められる。

cは、task-designへ独立した工程を詰め込むため推さない。

選ぶ時に大事にすることを確かめたい。planを作る作業でも入口を一つに保つことを優先するならa、plan無しで終わる作業の層を減らし置き場所を一通りにすることを優先するならbになる。

#### 検討記録（論点1・イテレーション0）

##### 調査: steeringが今受け持っていることと、このrepositoryで通っている経路

**問い:** 依頼の前提「steeringはディレクトリを作るだけ」は、現在のsteeringの記述と、このrepositoryの作業の実績に照らして成り立つか。

**確かめた場所と方法:**

- `plugins/tumeda-dev/skills/steering/SKILL.md`（配布version 9.1.7、commit `085cc08`）のFlow、Ready result後の必須gate、実装完了後review、Blocker resolutionを読み、受け持つことを列挙した。結果は提案0の表である。
- `.steering/2026/`配下で`design.md`を持つdirectoryを、`tasklist.md`・`roadmap.md`の有無で月ごとに数えた。

| 月 | `tasklist.md`あり | `roadmap.md`あり | どちらもなし |
| --- | --- | --- | --- |
| 202607 | 4 | 0 | 0 |
| 202608 | 6 | 0 | 7 |
| 202609 | 5 | 1 | 10 |
| 202610 | 1 | 0 | 3 |
| 202611 | 0 | 0 | 21 |

- 過去の決定として、`.steering/2026/202608/20260802-move-tasklist-ownership-to-task-design/design.md`のD1・D2・D4を読んだ。tasklistとroadmapの設計をtask-designへ移し、steeringは置き場所、task-designの起動、roadmapの実行、planの合意後の見直し、実装の開始、実装後のreviewへ受け持ちを絞った。今回の依頼は、その絞った後の姿を見直すものになる。

**分かったこと:**

- 202611の全件がplan無しになったのは、task-designがtasklistへ載せる条件（`task-design/SKILL.md` Step 5: 本番のapplicationのcode変更、段階を踏む実行、利用者の指定）に、skillとdocsの変更が当たらないためである。このrepositoryはskillとdocsだけを持つため、今後もplan無しが大半になる見込みである。
- planを作る作業では、steeringが実行を始めてよいかの確認、`tasklist-executor`への受け渡しと読み直し、roadmapの各phaseの実行、実装後のfeedback、進めない時の復旧を受け持つ。依頼文はこれらに触れていない。

**確かめていないこと:** 利用先repositoryで、planを作る作業がどの程度あるか。このsessionからは利用先repositoryを読めない。

##### 判断: steeringの受け持ちをどう分け直すか

**判断対象:** steeringを残して名前を役割に合わせるか（a）、解いて置き場所・設計の締めくくり・実行の段取りへ分けるか（b）、task-designへすべて移すか（c）。

**満たさなければならないこと:**

- 実行の段取り（提案0の表の下半分）の担当が消えない。依頼文は触れていないが、planを作る作業で要る。
- 依頼の動機である、名前と役割の食い違いが解ける。

**比べた観点:** plan無しで終わる作業が通るskillの層、置き場所が二通りあること、roadmapの各phaseの実行が入れ子のまま進むか、変更の大きさ、一つのskillが抱える独立した工程の数。

**各案の評価:**

- a: 満たさなければならないことは満たす。層は減らず、置き場所の二通りも残る。変更は名前とその参照に収まる。
- b: 実行の段取りを実行側のskillへ残すことで満たす。層が減り、置き場所が一通りになる。roadmapは実行側のskillがphaseごとにtask-designを起動して進む。変更は大きい。
- c: 満たすが、task-designが設計と実行の両方の止まり方・再開の仕方・完了の条件を抱える。

**推す案:** b。決め手は、このrepositoryの作業の大半がplan無しで終わることと、置き場所を一通りにできること。引き受ける代償は変更の大きさと、planを作る作業で途中からskillが替わること。

**利用者に確かめること:** planを作る作業でも入口を一つに保ちたいか。利用先repositoryでplanを作る作業がどの程度あるか。

#### 提案0へのフィードバック（論点1）

**結果:** bに合意。推す理由は差し替え

> b。ただ、理由が違う。steeringがディレクトリ管理以外task-designの出来損ないのラッパーだと感じたから。それであればあるべきところにあるべきものを置くべきと思った。今のsteeringの役割を複数に分割しても良いしね。あと、ほとんどがplanなしと言ったけど、他のリポジトリで使うときは大抵プランあり。

案bの中身（入口をtask-designにし、置き場所の準備・締めくくりの確認・実行の段取りをそれぞれの担当へ分ける）は受け入れられた。推す理由として示した「plan無しで終わる作業が大半」は、このrepositoryだけの実績であり、利用先repositoryでは大抵planを作る。提案0で「確かめていないこと」とした前提であり、それを決め手に使ったことは成り立たなかった。

利用者の理由は、steeringが記録の置き場所の管理を除くとtask-designを包む不完全な層になっているため、受け持ちをそれぞれあるべき担当へ置く、というものである。この理由のもとでは、planを作る作業でplanの合意の後に実行側のskillへ替わる経路が通常の経路になる。また、実行の段取りは一つのskillに集めなくてよく、複数へ分けてよい。これは論点3の条件になる。

### 決定（論点1）

steeringを解き、作業の入口をtask-designにする。steeringは記録の置き場所の管理を除くとtask-designを包む不完全な層になっているため、受け持ちをそれぞれあるべき担当へ置く。

- 記録の置き場所の準備（`name-work-directory`での命名、directoryの作成、前月の`summary.md`の生成、任意のbranch作成）は、task-designから呼ぶ小さなskillへ移す。単独で起動したtask-designも同じ置き場所を使い、「standalone roadmapの昇格」は無くす。
- 締めくくりの確認（`doc-enricher`の提案mode、議論記録からの再発防止先の見直し、skill自身の見直し）と、plan無しで終わった変更の公開は、task-designへ移す。
- 実行の段取り（実行を始めてよいかの確認、`tasklist-executor`への受け渡しと止まった後の読み直し、roadmapの各phaseの実行、実装後のfeedback、進めない時の復旧）は実行側に残す。どのskillが持つかは論点3で決め、一つのskillに集めず複数へ分けてもよい。

前提として、利用先repositoryでは大抵planを作るため、planの合意の後に実行側のskillへ替わる経路が通常の経路になる。task-designを包むだけのskillを実行側に作り直さない。配布versionはMAJORを上げる。

## 論点2: 締めくくりの確認をtask-designへ移すか

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** まとめて考える（波及: 中。task-designの完了の条件と、steering側の締めくくりの確認が変わる。他は小）

**依存先:** 論点1（aなら、`doc-enricher`の提案mode・議論記録からの再発防止先の見直し・steering自身の見直しをtask-designの完了の条件へ移すかを問う。bまたはcなら、締めくくりの確認の行き先はtask-designに決まるため、論点1の決定に含めてこの論点を取り下げる）

### 決定（論点2）

論点1がbに決まり、締めくくりの確認の行き先はtask-designに決まった（論点1の決定）。この論点は論点1の決定に含めて取り下げる。案を作らずに終える。

## 論点3: 実行の段取りをどのskillが持つか

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 一つずつ考える（波及: 大。実行側のskillの数と、`tasklist-executor`の受け持ちが変わる。他は小）

**依存先:** 論点1（bなら、実行の段取りを新しいskillにするか、`tasklist-executor`へ寄せるかを問う。aなら残すsteeringがそのまま持ち、cならtask-designが持つため、この論点を取り下げる）。論点1はbに決まった。

### イテレーション0（論点3）: 実行の段取りの担当を、planの種類との関係で提案する

#### 提案0（論点3）

##### 今steeringが持つ実行の段取り

```text
tasklistの時
  実行を始めてよいかの確認
    → tasklist-executorを起動
    → 止まって返ってきたら（委譲待ち・利用者の確認待ち・phaseの区切り・進めない・上限）
        tasklistのcheckboxとartifactを読み直し、design.mdと食い違えば実装後のreviewへ回す
    → 実装後のfeedback

roadmapの時
  依存順に、未着手で依存が済んだphaseを選ぶ
    → phaseへ子steeringを割り当て、statusを進行中にする
    → 子steering（置き場所の準備 + task-design + その結果の実行）
    → 完了を確かめ、status・完了日を書く
    → 全phaseが完了したら、一段上のroadmapへ伝える
```

`tasklist-executor`は、止まる理由と再開の仕方、実装後のfeedbackの扱い（今は`steering/implementation-feedback.md`を読む）を既に自分で持つ。また`context: fork`で起動される子agentであり、一つのtasklistをtaskの単位で実行する。

この段取りをどのskillに持たせるかを三つの案で示す。実装後のfeedbackの手順、進めない時の復旧、実行を始めてよいかの確認の置き場所は、この論点の答えの上で別に決める（論点6〜8）。

##### a. planの種類ごとに、そのplanを実行する担当が段取りを持つ（推奨）

```text
tasklist_ready → 利用者の指示 → tasklist-executor
roadmap_ready  → 利用者の指示 → roadmapを実行するskill（新設）
                                   └ phaseごと: task-designを起動（上位roadmapの制約を渡す）
                                        ├ tasklist_ready → tasklist-executor
                                        ├ roadmap_ready  → roadmapを実行するskill（入れ子）
                                        └ planless_complete → 完了を確かめる
```

- tasklistの段取りは`tasklist-executor`が持つ。起動する側が行うこと（起動の仕方、止まって返ってきた時の扱い、tasklistとartifactの読み直し、design.mdとの食い違いを実装後のreviewへ回すこと）は、`tasklist-executor/execution-contracts.md`に「起動する側が行うこと」として置く。今のsteeringの6-1に当たる内容である。利用者が直接起動しても、roadmapを実行するskillが起動しても、同じ約束で扱える。
- roadmapの段取りは新しいskillが持つ。依存順にphaseを選び、phaseごとにtask-designを起動し、返った結果に応じて`tasklist-executor`、自分自身、または完了の確認へ進む。roadmapのphaseの子のpath・status・完了日を書くのはこのskillだけにする（今のsteeringと同じ範囲）。

##### b. planの実行全般を受け持つskillを一つ新設し、tasklistもroadmapもそこから起動する

- tasklistの時、このskillは`tasklist-executor`を起動し、止まった時に読み直すだけになる。`tasklist-executor`を包む層であり、論点1で無くしたsteering（task-designを包む層）と同じ形を実行側に作り直す。
- 利用者から見ると、planの種類に関わらず起動するskillが一つで済む。

##### c. roadmapの実行も`tasklist-executor`へ寄せる

- `tasklist-executor`は`context: fork`の子agentとして動く。roadmapのphaseごとに起動するtask-designは利用者との議論を伴うため、子agentの中では進められない。
- 名前もtasklistを実行する担当を表しており、roadmapを持つと名前と受け持ちが食い違う。

##### aを推す理由

論点1で決めた「受け持ちをあるべき担当へ置く」に当てると、tasklistを実行する段取りは、tasklistを実行する担当が自分の起動のされ方として持つのが自然である。roadmapの実行は、phaseごとに利用者と議論するtask-designを起動するため利用者と対話できる場で動く必要があり、子agentである`tasklist-executor`とは別の担当が要る。bは利用者から見て入口が一つになる利点があるが、tasklistの時に包むだけの層を作り直す。

#### 検討記録（論点3・イテレーション0）

##### 調査: 実行の段取りのうち、`tasklist-executor`が既に持つもの

**問い:** 論点1で実行側に残した段取りのうち、`tasklist-executor`が既に持つものと、steeringだけが持つものはどれか。

**確かめた場所:** `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md`（frontmatter、最重要原則、停止・再開、実装feedbackの記録と返却、返却）、`tasklist-executor/execution-contracts.md`（状態の正本、停止理由、停止・再開と二重起動防止、Logical ownerとphysical launcher）、`steering/SKILL.md` 6-1・6-2。

**分かったこと:**

- `tasklist-executor`が既に持つもの: 止まる理由の種類（`completed`、`phase_checkpoint`、`delegation_required`、`user_confirmation_required`、`blocked`、`limit_reached`）、再開の仕方、実装後のfeedbackの扱い（`../steering/implementation-feedback.md`を読む）、roadmapを作らず更新しないこと。
- steeringだけが持つもの: 実行を始めてよいかの確認、`tasklist-executor`を起動すること、返った結果だけで次を判断せずtasklistとartifactを読み直すこと（6-1）、roadmapの各phaseの実行（6-2）、進めない時の復旧。
- `tasklist-executor`はfrontmatterで`context: fork`を持つ子agentである。`execution-contracts.md`は、子agentを起動して完了を待つ側を「physical launcher」と呼び、tasklistの中身を解釈しない担当として定める。steeringの6-1の読み直しは、この起動する側の約束に当たる。

##### 判断: 実行の段取りをどの担当に持たせるか

**判断対象:** planの種類ごとに実行する担当へ持たせるか（a）、plan全般の実行skillを一つ作るか（b）、`tasklist-executor`へ寄せるか（c）。

**満たさなければならないこと:**

- 論点1の決定に従い、受け持ちをあるべき担当へ置き、task-designや`tasklist-executor`を包むだけの層を作り直さない。
- roadmapのphaseごとのtask-designは利用者との議論を伴うため、利用者と対話できる場で起動される。

**各案の評価:**

- a: 両方を満たす。tasklistの時は層が増えない。roadmapだけ新しいskillが要る。
- b: tasklistの時に`tasklist-executor`を包む層になり、一つ目を満たさない。
- c: `tasklist-executor`は子agentのため、二つ目を満たさない。

**推す案:** a。引き受ける代償は、planの種類によって利用者が起動するskillが二通りになること。

##### 構造の見直し: 論点1の決定と論点3の案aを合わせた構造案に、`skill-update-review`を当てる（設計時）

`task-design/SKILL.md` Step 2は、汎用skillの内部指示を増やす・移す・分ける決定を合意する前に`skill-update-review`を当てると定める。論点1の合意の前に当て損ねていたため、論点1の決定と論点3の案aを合わせた構造案へ、論点3の提示の前に当てた。

**読んだもの:** `task-design/SKILL.md`、同skillの内部指示（`tasklist-design.md`、`roadmap-design.md`、`work-handoff-contracts.md`は見出しの構成まで）、`tasklist-executor/SKILL.md`、`tasklist-executor/execution-contracts.md`、`steering/SKILL.md`。新設する二つのskillは構造案だけを見た。判断の基準は`skill-update-review/find-split-candidates.md`。

**候補:**

- task-designへ移す締めくくりの確認とplan無しの公開
  - 持つもの: 何を再発防止の提案にするかという固有の判断、提案ごとの承認待ちの状態、全提案を承認・拒否・適用し終えた時の完了、設計の手順とは別の理由（見直しの問いの変更、`doc-enricher`の重複の避け方の変更）による改訂。
  - 当てた変更case: 議論記録からの再発防止の三つの問いを直すと、`task-design/SKILL.md`の設計の手順の間にある記述を直すことになり、設計の手順と無関係な改訂が同じfileへ入る。
  - 分ける先: task-designの内部指示（一つのfile）。Step 6で結果を返す前に読む。親へは、見直しの結果と公開の結果を返す。
- 前月の`summary.md`の生成
  - 持つもの: planの種類ごとのstatusの導き方という固有の判断、summaryの有無という状態、置き場所の準備とは別の理由（planの種類やplan無しの判定の変更）による改訂。
  - 当てた変更case: plan無しで完了と判定する条件を変えると、summaryの生成だけを直し、directoryの作成や命名は直さない。
  - 分ける先: 置き場所の準備を持つ担当の内部指示。

**構造案への所見:** 置き場所の準備を別のskillとして新設する案は、今それを呼ぶのがtask-designだけである（`escalate-plugin-skill-fix`とroadmapを実行するskillは、task-designを経由して呼ぶ）。`find-split-candidates.md`は「別skill化には現在の単独利用・他callerの具体要求を要し、将来予測だけでは独立させない」と定めるため、この基準ではtask-designの内部指示になる。

**変更なし:** `tasklist-executor/execution-contracts.md`へ「起動する側が行うこと」を足すことは、同fileが既に子agentを起動する側（physical launcher）の約束を持つため、範囲の内で候補にならない。roadmapを実行するskillは、構造案の範囲では一つの工程であり候補なし。

候補ごとに今の作業で切り出すかと、置き場所の準備をskillにするかは、論点11〜13で合意する。

#### 提案0へのフィードバック（論点3）

**結果:** aに合意

> a

### 決定（論点3）

planの種類ごとに、そのplanを実行する担当が実行の段取りを持つ。

- tasklistの段取りは`tasklist-executor`が持つ。起動する側が行うこと（起動の仕方、止まって返ってきた時の扱い、返った結果だけで次を判断せずtasklistのcheckboxとartifactを読み直すこと、design.mdと食い違えば実装後のreviewへ回すこと）は、`tasklist-executor/execution-contracts.md`に置く。利用者の会話から直接起動しても、roadmapを実行するskillが起動しても、同じ約束で扱う。
- roadmapの段取りは新しいskill（roadmapを実行するskill）が持つ。依存順に未着手で依存が済んだphaseを選び、phaseごとに上位roadmapの制約を渡してtask-designを起動し、返った結果がtasklistなら`tasklist-executor`、roadmapなら自分自身（入れ子）、plan無しなら完了の確認へ進む。roadmapのphaseの子のpath・status・完了日を書くのはこのskillだけにする。

plan全般を実行するskillは作らない。tasklistの時に`tasklist-executor`を包む層になり、論点1で無くしたsteeringと同じ形になるためである。roadmapを`tasklist-executor`へ寄せない。`tasklist-executor`は`context: fork`の子agentとして動き、phaseごとに利用者と議論するtask-designを起動できないためである。代償として、planの種類によって利用者が起動するskillが二通りになる。

## 論点4: 置き場所を用意するskillの名前

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** まとめて考える（戻しにくさ: 中。利用先repositoryでskillを呼ぶ名前になる。他は小。推す案は論点5の`.design-records/`と、既存のskill名の動詞と目的語の形から導く）

**依存先:** 論点1、論点3（残すskill・新しく作るskillと、それぞれの役割が決まれば、名前の案を作れる）。論点1・3・5・11が決まった。論点を立てた時のタイトルは「変更後のskillの名前」だったが、新しく作るskillの名前はそれぞれ別の問いのため、提案を出す前にこの論点を置き場所を用意するskillの名前へ絞り、roadmapを実行するskillの名前は論点15へ分けた

### イテレーション0（論点4）: 置き場所を用意するskillの名前を提案する

#### 提案0（論点4）

このskillは、新しい作業を始める時に、命名（`name-work-directory`）、`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/`の作成、前月の`summary.md`の生成、任意のbranchの作成、初回の`.steering/`の移動の提案を行う。結果として、一つの作業の設計の記録が使える状態になる。

##### a. `prepare-design-record`（推奨）

- 初見の人の予想: 設計の記録（`.design-records/`の一件）を用意する。新しい作業の始めに呼ぶものと読める。
- 実態との差: 前月summaryの生成と`.steering/`の移動の提案は名前から読めないが、どちらも記録を用意する時の付随する処理で、誤解の方向は同じ。

##### b. `start-design-record`

- 初見の人の予想: 設計の記録を始める。新しい記録であることはaより強く読める。
- 実態との差: 「始める」は作業そのものを始めるとも読め、設計の議論まで行うskillと予想されうる。

##### c. `open-design-record`

- 初見の人の予想: 設計の記録を開く。既にある記録を開いて読む、とも読める。
- 実態との差: 新しく用意することと、既にあるものを開いて読むことの二通りに読め、後者は方向が違う。

##### aを推す理由

論点5で決めた`.design-records/`の一件を目的語にし、既存の`name-work-directory`、`plan-commits`と同じ動詞と目的語の形にした。動詞はこのskillを経た後の状態（記録が使える状態になる）を名指す「prepare」にした。

#### 検討記録（論点4・イテレーション0）

`plugins/tumeda-dev/skills/`のskill名（動詞と目的語の形: `name-work-directory`、`plan-commits`、`share-work-in-progress`、`facilitate-discussion`。名詞の形: `tasklist-executor`、`doc-enricher`、`test-runner`）を確かめた。`docs/development_standards/naming/core.md`の「outcomeを名指す」「名前を単独で評価しない」と、`reverse_translation.md`で各案を検算した。

#### 提案0へのフィードバック（論点4）

**結果:** aに合意（論点4・15・16をまとめて示した往復で「15以外ok」と答えられた）

> 15以外ok。ロードマップって、executeするものなの？

### 決定（論点4）

置き場所を用意するskillの名前を`prepare-design-record`にする。論点5で決めた`.design-records/`の一件を目的語にし、既存の`name-work-directory`、`plan-commits`と同じ動詞と目的語の形にする。動詞は、このskillを経た後の状態（設計の記録が使える状態になる）を名指す「prepare」にする。`start-design-record`は設計の議論まで行うskillと読まれうるため、`open-design-record`は既にある記録を開いて読むとも読めるため採らない。

## 論点5: 記録を置くdirectoryの名前

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 一つずつ考える（波及: 大、戻しにくさ: 大。このrepositoryと利用先repositoryの既存の`.steering/`、記録を探すskill（task-design、facilitate-discussion）、hook、`.gitignore`の見本が変わる。利用者の前提への依存: 中）

**依存先:** 論点1（directoryを用意する担当と、そこへ入る記録の種類が決まれば、名前の案を作れる。依頼にある「タスク設計に限らないもの（調査設計等）も入れられる名前にする。ただし最大公約数をとって意味のない名前にしない」を条件にする）。論点1は決まり、directoryはtask-designから呼ぶ置き場所のskillが用意する。論点3の後に案を作る。

### イテレーション0（論点5）: 記録を置くdirectoryの名前を提案する

#### 提案0（論点5）

この論点では名前だけを決める。既にある`.steering/`の記録の扱い（移すか、残すか、記録を探すskillがどこを読むか）は、名前の答えが別に決まっても答えが変わる別の問いのため、論点14へ分けた。論点の立て始めのタイトルは「名前と、既にある記録の扱い」だったが、提案を出す前に名前だけへ絞った。

##### directoryに入るものと、読まれる時

- 作業ごと（`YYYY/YYYYMM/YYYYMMDD-slug/`）: `design.md`、`task-design-discussion.md`、`tasklist.md | roadmap.md`、`discussion.md`（実行の段取りの議論）、`implementation_review.md`、`investigation.md`、`requirements.md`、`spike/`、`subagent_report/`、`temporary-overrides/`、`pending-escalations/`、`task-design-catch-up/`、`internal-records/`
- 月ごと: `summary.md`
- これから: 変更を伴わない調査の設計（論点11の決定）
- 読まれる時: 作業を再開する時、後の作業が過去の決定を探す時（`task-design`の設計前調査、`facilitate-discussion/round-trip.md`の前例探し）、月の一覧を見る時

実態を一文で書くと、「一つの作業ごとに、その作業の設計（何を変えるか、何を調べるか）と、そこへ至った議論、実行の計画と経緯を残し、再開と、後の作業が過去の決定を探す時に読まれる場所」である。依頼の条件は、タスク設計に限らないもの（調査設計等）も入れられること、ただし最大公約数をとって意味のない名前にしないこと。依頼文は、入るものを「タスク設計」「調査設計」と、どれも「設計」と呼んでいる。

##### a. `.design-records/`（推奨）

- 初見の人の予想: 設計の記録が入っている。一つの作業の設計書と、決定とその経緯（ADR、architecture decision recordsのような記録）を予想する。
- 実態との差: 実行の計画（tasklist、roadmap）、実装後のfeedback、実行の段取りの議論も入る。どれも設計を実行し、見直した記録であり、誤解の方向は同じで、開けば分かる。調査の設計も「設計の記録」に入る。

##### b. `.work-records/`

- 初見の人の予想: 作業の記録。何の作業でも入り、日報やlogを予想することもある。
- 実態との差: 設計と決定が中心であることが名前から読めない。入るものの共通の核を「設計」から「作業」へ広げており、依頼が避けたい最大公約数の側に寄る。

##### c. `.task-design/`

- 初見の人の予想: `task-design`というskillの成果物の置き場所。
- 実態との差: task-designを通さない調査の設計（論点11）や、実行側のskillが書く記録（`implementation_review.md`、段取りの`discussion.md`）が入ることと食い違う。

##### d. `.steering/`のまま

- 初見の人の予想: 無くなる`steering`というskillの記録。またはprojectの方針を書いたsteering file（AI agentへ常に読ませる方針文書）の置き場所。
- 実態との差: 後者はprojectに一つの方針文書であり、作業ごとの記録とは方向が違う誤解になる。

##### aを推す理由

依頼文の言葉では、入るもの（タスク設計、調査設計）の共通の核は「設計」である。「設計」なら、最大公約数の「作業」まで広げずに、調査の設計も含めて範囲を覆える。`records`は、設計書だけでなく決定と経緯が残る場所であることを示し、後の作業が過去の決定を探しに来る使われ方とも合う。

#### 検討記録（論点5・イテレーション0）

##### 判断: 入るものの共通の核をどの語で表すか

**確かめたこと:** 今の`.steering/`の作業ごとのdirectoryにあるfile（このrepositoryの`.steering/2026/`配下）と、論点1・10・11で決まった行き先、記録が読まれる箇所（`task-design/SKILL.md` PrepareStep 3、`facilitate-discussion/round-trip.md`「根拠にする前例を探す」）。命名は`docs/development_standards/naming/`の`core.md`（outcomeを名指す、中身が大まかにわかる具体性、名前を単独で評価しない）、`reverse_translation.md`、`review.md`（誤解の方向で判定する）を当てた。

**考えた候補と外したもの:**

- `.designs/`: 短いが、隠しdirectoryでも「画面のdesignのfile」と読まれうる。方向が違う誤解のため候補から外した。
- `.decisions/`: 決定の記録は核の一つだが、計画や調査の経過も入り、決定だけを集めた場所と読まれる。外した。
- `.specs/`: 要件・設計・tasksを機能ごとに置く形は似ているが、「仕様」は作るものの定めであり、調査の設計や議論の経緯が入ると読まれない。外した。

**推す案:** a。名前の第一の語を「設計」にするのは、依頼文が入るものをどれも「設計」と呼んでいるためである。

#### 提案0へのフィードバック（論点5）

**結果:** aに合意

> aめっちゃええやん

### 決定（論点5）

作業の記録を置くdirectoryの名前を`.design-records/`にする。作業ごとのdirectoryは`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/`、月の一覧は`.design-records/YYYY/YYYYMM/summary.md`になる。

入るもの（タスク設計、調査設計、その議論・計画・実行の経緯）に共通する核は、依頼文の言葉では「設計」であり、「作業」まで広げずに調査の設計も含めて範囲を覆える。`records`は、設計書だけでなく決定と経緯が残る場所であることを示し、後の作業が過去の決定を探しに来る使われ方と合う。実行の計画、実装後のfeedback、段取りの議論も入るが、設計を実行し見直した記録であり、初見の人の誤解の方向は同じである。`.work-records/`は核を「作業」へ広げて最大公約数に寄り、`.task-design/`はtask-designを通さない調査の設計や実行側の記録と食い違い、`.steering/`は無くなるskillの名前と、projectの方針文書の置き場所という方向の違う誤解を残すため採らない。


