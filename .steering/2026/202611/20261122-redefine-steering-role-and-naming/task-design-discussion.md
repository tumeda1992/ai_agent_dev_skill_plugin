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

## 論点4: 変更後のskillの名前

**ステータス:** 依存先待ち

**種別:** TBDヒアリング

**重さ:** 一つずつ考える（戻しにくさ: 中。利用先repositoryでskillを呼ぶ名前が変わる。利用者の前提への依存: 中。名前の好みは利用者が持つ）

**依存先:** 論点1、論点3（残すskill・新しく作るskillと、それぞれの役割が決まれば、名前の案を作れる）

## 論点5: 記録を置くdirectoryの名前

**ステータス:** 応答待ち

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

## 論点11: 記録の置き場所の準備を、別のskillにするか、task-designの内部指示にするか

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** まとめて考える（波及: 中。別skillにしなければ論点4で名前を付けるskillが一つ減る。他は小。根拠は`skill-update-review/find-split-candidates.md`の別skill化の条件）

論点3の検討記録「構造の見直し」の所見から立てた。論点1の決定は「task-designから呼ぶ小さなskillへ移す」としており、この論点の答えで論点1の決定の該当行を同期する。

### イテレーション0（論点11）: 置き場所の準備の形を提案する

#### 提案0（論点11）

##### a. task-designの内部指示にする（推奨）

- `task-design/`配下に置き場所の準備の内部指示のfileを置き、PrepareStep 2（配置先の確定）から読む。単独で起動しても、roadmapを実行するskillから起動されても、`escalate-plugin-skill-fix`から起動されても、同じ手順で置き場所を用意する。
- `name-work-directory`は今のまま別のskillに残す。命名だけを持ち、特定のworkflowを前提にしない汎用のskillとして作られているためである。
- 依頼文の「task-designに紐付く、置き場所を決めるskill」は、task-designの内部に置くことで、最も強く紐付いた形で満たす。
- 論点4で名前を付けるskillが一つ減る（内部指示のfileの名前は付ける）。

##### b. 別のskillにする

- 依頼文の書き方どおり、置き場所の準備を独立したskillにし、task-designから呼ぶ。
- 今これを呼ぶのはtask-designだけであり、呼ばれ方が一通りのskillが一つ増える。task-designを通さずに記録だけを置く作業は、今は無い（依頼文の「調査設計」も、task-designが調査を主な成果とするdesignとして扱う）。

##### aを推す理由

`skill-update-review/find-split-candidates.md`は「別skill化には現在の単独利用・他callerの具体要求を要し、将来予測だけでは独立させない」と定める。置き場所の準備を呼ぶのは今task-designだけである。task-designを通さずに記録を置く作業が出たら、その時に内部指示のfileを別のskillへ移せる。移すまでの間に作られるのは、task-designからの参照だけである。

#### 検討記録（論点11・イテレーション0）

##### 判断: 置き場所の準備に、task-design以外の呼び手があるか

**確かめたこと:** 今steeringを起動している担当（`escalate-plugin-skill-fix/SKILL.md`の「plugin repositoryで`steering`を`branch_from_basename=true`で起動する」、steering自身の6-2の子steering）と、論点1・3の決定後にそれらが起動する先。

**分かったこと:** `escalate-plugin-skill-fix`は論点1の決定後にtask-designを起動する（branchの作成をtask-designへ頼む）。roadmapを実行するskillは、論点3の決定でphaseごとにtask-designを起動する。どちらも置き場所の準備を直接は呼ばない。task-design以外の呼び手は無い。

**推す案:** a。`escalate-plugin-skill-fix`がbranchの作成を頼めるよう、task-designは今のsteeringの`branch_from_basename`を入力として受ける。これは論点1・3の決定から一つに導ける受け渡しであり、file設計で書く。

#### 提案0へのフィードバック（論点11）

**結果:** bを選択

> 論点11はb。今後変更を伴わない調査設計とかも行う可能性があるから、分けておきたい。他はok

推す案aの根拠は、置き場所の準備を呼ぶのが今task-designだけであることだった。利用者は、変更を伴わない調査の設計のように、task-designを通さずに記録を置く作業を今後行う予定を示した。`find-split-candidates.md`の「現在の外部利用要求があれば、実装済みcallerや利用実績を待つ必要はない」に当たる、持ち主からの具体的な要求として扱う。

### 決定（論点11）

記録の置き場所の準備（`name-work-directory`での命名、directoryの作成、前月の`summary.md`の生成、任意のbranch作成）は、独立したskillにする。task-designはこのskillを呼んで置き場所を用意し、単独で起動しても、roadmapを実行するskillや`escalate-plugin-skill-fix`から起動されても同じ置き場所を使う。変更を伴わない調査の設計のように、task-designを通さずに記録を置く作業からも呼べるようにする。`name-work-directory`は今のまま、命名だけを持つ汎用のskillとして残す。論点1の決定の「task-designから呼ぶ小さなskillへ移す」と一致する。

## 論点12: 締めくくりの確認とplan無しの公開を、task-designの内部指示のfileへ分けるか

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** 確かめるだけ（全部小。根拠は`skill-update-review/find-split-candidates.md`と、`work_scope.md`の二段目）

論点3の検討記録「構造の見直し」の候補から立てた。論点3の後に示す。

### イテレーション0（論点12）: 締めくくりの確認とplan無しの公開を、今の作業で別fileへ分けるかを仮決めする

#### 提案0（論点12）

- a. 今の作業で、task-designの内部指示の一つのfileへ分ける（仮決め）
  - 根拠: `skill-update-review`の候補（論点3の検討記録「構造の見直し」）。`work_scope.md`の二段目では、分けても今の作業のreview・revert・本番適用の単位は崩れない。どのみちsteeringからtask-designへ書き移すため、`task-design/SKILL.md`へ書いてから後で分けると同じ内容を二度書くことになる。
  - task-designのStep 6で、結果を返す前にこのfileを読む。論点6の決定（実行を始めてよいかの確認）もこのfileの末尾に置き、締めくくりの確認の結果を示してから確かめる順序を一つのfileで保つ。fileの名前は論点4で決める。
- b. `task-design/SKILL.md`の本文へ書く
  - 再発防止の問いや`doc-enricher`の重複の避け方を直すたびに、設計の手順の間を直すことになる。

#### 検討記録（論点12・イテレーション0）

`work_scope.md`の二段目（今の作業に含めたら、review・revert・本番適用の単位が崩れるか）を当てた。分ける対象はこの作業でsteeringから移すものそのもので、別の作業にすると同じ節を二度書き換える。崩れないため、拾う（今の作業で分ける）。

#### 提案0へのフィードバック（論点12）

**結果:** aに合意（論点7・9・10・12・13をまとめて示した往復で「それ以外はok」と答えられた）

> 論点9が何を扱う論点なのかわかってない。それ以外はok

### 決定（論点12）

締めくくりの確認（`doc-enricher`の提案mode、議論記録からの再発防止先の見直し、skill自身の見直し）とplan無しで終わった変更の公開は、今の作業でtask-designの内部指示の一つのfileへ分ける。task-designはStep 6で結果を返す前にこのfileを読む。論点6の決定（実行を始めてよいかの確認）もこのfileの末尾に置き、締めくくりの確認の結果を示してから確かめる順序を一つのfileで保つ。今分けるのは、どのみちsteeringから書き移すため、`task-design/SKILL.md`へ書いてから後で分けると同じ内容を二度書くことになり、`work_scope.md`の二段目でも今の作業の単位を崩さないためである。fileの名前は論点4で決める。

## 論点13: 前月の`summary.md`の生成を、置き場所の準備とは別の内部指示へ分けるか

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** 確かめるだけ（全部小。根拠は論点12と同じ）

**依存先:** 論点11（置き場所の準備を持つ担当が決まれば、その担当の内部指示として分けるかを問える）。論点11は決まった。

### イテレーション0（論点13）: 前月の`summary.md`の生成を、今の作業で別fileへ分けるかを仮決めする

#### 提案0（論点13）

- a. 今の作業で、置き場所を用意するskillの内部指示のfileへ分ける（仮決め）
  - 根拠: `skill-update-review`の候補（論点3の検討記録「構造の見直し」）と、論点11の決定（置き場所の準備は独立したskill）。論点12と同じく、`work_scope.md`の二段目で単位は崩れず、どのみち書き移すため今分ける。
  - 置き場所を用意するskillは、前月のdirectoryがあり`summary.md`が無い時だけこのfileを読む。中身（概要の抽出、planの種類ごとのstatusの導き方、exact format、単一writerの理由）は変えない。
- b. 置き場所を用意するskillの`SKILL.md`の本文へ書く
  - plan無しの判定条件を変えるたびに、directoryの作成や命名の手順と同じfileを直すことになる。

#### 検討記録（論点13・イテレーション0）

論点11の決定で、置き場所の準備を持つ担当が独立したskillに決まった。`steering/SKILL.md` Step 1の5（前月summaryの生成）は、directoryの作成とは別の判断（planの種類ごとのstatusの導き方）を持つ。論点12と同じ理由で今分ける。

#### 提案0へのフィードバック（論点13）

**結果:** aに合意（論点7・9・10・12・13をまとめて示した往復で「それ以外はok」と答えられた）

> 論点9が何を扱う論点なのかわかってない。それ以外はok

### 決定（論点13）

前月の`summary.md`の生成は、今の作業で、置き場所を用意するskillの内部指示のfileへ分ける。置き場所を用意するskillは、前月のdirectoryがあり`summary.md`が無い時だけこのfileを読む。中身（概要の抽出、planの種類ごとのstatusの導き方、exact format、単一writerの理由）は変えない。今分ける理由は論点12と同じである。fileの名前は論点4で決める。

## 論点14: 既にある`.steering/`の記録の扱い

**ステータス:** 依存先待ち

**種別:** TBDヒアリング

**重さ:** 一つずつ考える（波及: 中。記録を探すskill（task-design、facilitate-discussion）、hook、`.gitignore`の見本の読み先が変わる。戻しにくさ: 中。利用先repositoryにある記録の置き場所に関わる。他は小。前例は`.steering/2026/202607/20260726-extract-work-directory-naming/design.md`の「既存の`.steering/`配下にある branch 込みのディレクトリは履歴としてそのまま残す。移行・一括改名は行わない」）

**依存先:** 論点5（名前を変えるなら、このrepositoryと利用先repositoryの既存の`.steering/`を移すか、履歴として残すか、記録を探すskillが両方を読むかを問う。名前を変えないなら、この論点を取り下げる）
