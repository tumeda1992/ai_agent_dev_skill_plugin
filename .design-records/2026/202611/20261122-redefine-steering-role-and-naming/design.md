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

tasklist・roadmapの設計をtask-designへ移した後（`20260802-move-tasklist-ownership-to-task-design`）、steeringは記録の置き場所の管理を除くと、task-designを包む不完全な層になった。steeringを解き、受け持ちをそれぞれあるべき担当へ置く。終了時には、利用者は作業をtask-designから始め、記録の置き場所は新しい`prepare-design-record`が`.design-records/`に用意し、設計の締めくくり・plan無しの公開・実行開始の確認はtask-designが、tasklistの実行は`tasklist-executor`と起動する側の約束が、roadmapの進行は新しい`advance-roadmap`が受け持つ。steeringというskillと`.steering/`は無くなる。

---

## 完成後の姿

### skillの役割と方針

#### task-design

task-designは作業の入口である。変更や調査を、後の作業で新しい設計判断が生じない状態まで設計して合意し、plan無しで終わる作業では反映・validation・公開まで、planを作る作業では実行を始めてよいかの確認までを行う。既存の設計の方針（WHY→WHAT→HOW、TBDで全体を先に見せる、合意を積み上げる等）は変えない。

##### 新しい作業の置き場所は`prepare-design-record`に任せる

新しい作業を始める時、task-designは自分で置き場所を決めず、`prepare-design-record`を呼んで`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/`を用意させ、そこを`working_dir`にする。単独で起動されても、`advance-roadmap`や`escalate-plugin-skill-fix`から起動されても同じである。既にある作業の再開では、渡された`working_dir`をそのまま使う。置き場所が一通りであるため、記録を別の場所から`.design-records/`へ移す手順（旧「standalone roadmapの昇格」）は持たない。

##### 結果を返す前に締めくくる

`tasklist_ready`・`roadmap_ready`・`planless_complete`のどれでも、結果を返す前に`wrap-up.md`を読み、締めくくりの確認（`doc-enricher`の提案mode、議論記録からの再発防止先の見直し、task-design自身の見直し）を行う。plan無しの作業では、続けて変更を公開して完了を報告する。planを作る作業では、確認の結果を示した後に実行を始めてよいかを確かめ、明示の指示があればplanの種類に対応するskillを起動する。planの合意を実行開始の承認と読み替えない。締めくくりを設計の担当に置くのは、議論の記録を持ち、設計の経緯を最もよく知る担当が、contextが熱いうちに再発防止を判断できるためである。

#### prepare-design-record

`prepare-design-record`は、一つの作業の設計の記録を使える状態にする。`name-work-directory`での命名、`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/`の作成、前月の`summary.md`の生成、任意のbranchの作成を行い、作ったdirectoryの絶対pathを返す。

##### 置き場所だけを用意し、設計しない

このskillは置き場所の準備だけを受け持つ。入力を整理する、codeや設計文書を読んで方針を作る、scopeを分ける、`design.md`等の成果物を作ることは行わない。設計の判断を置き場所の準備へ紛れ込ませると、無くしたsteeringと同じく、設計の担当を包む層が生まれる。

##### task-designを通さない作業からも呼べる

task-designから呼ばれるのが通常だが、変更を伴わない調査の設計のように、task-designを通さずに記録を置く作業からも呼べる。task-designの内部指示ではなく独立したskillにするのは、利用者がこの使い方を予定しているためである。

##### 以前の置き場所の記録を一度だけ移す

`.steering/`があり`.design-records/`が無いrepositoryで呼ばれた時は、`.steering/`を`.design-records/`へ移すことを利用者へ提案し、承認されたら一度だけ`git mv`で移す。

両方がある時は、`.steering/`に追跡されたfileが残っているかで扱いを分ける。`git ls-files .steering`がfileを返す時は、推測で混ぜず利用者へ確かめる。何も返さない時は、移した変更をpullした別のcloneのように、追跡外のfile（作業の控え、commit前の作業、Claude Codeが作る空の`.claude/.cc-writes/`）だけが残った状態である。この時は、残ったfileと空のdirectoryを一覧にして、各fileを`.design-records/`の同じ相対pathへ移すことを提案し、承認されたら`mv`で移して、空になったdirectoryと`.steering/`を消す。移す先に同じ名前のfileがあれば止まり、fileは一つも消さない。追跡されたfileが無いことで記録の正本が既に移ったと推測なしに分かり、残りにはcommit前の作業が含まれうるため、消さずに移す。

記録の本文に残る`.steering/…`のpathは書き換えず、`breaking_changes/`の記録で「`.design-records/…`として読む」と残す。移し方の手順の正本は同じ記録の「移し方」の節であり、このskillはそれを参照して提案する。記録を読んだ人もagentも、skillを起動せずに同じ手順で移せる。

#### advance-roadmap

`advance-roadmap`は、合意済みのroadmapを依存順に一phaseずつ進める。次に進められるphaseを選び、そのphaseを一つの作業としてtask-designで設計させ、返ったplanを実行させ（`tasklist-executor`、入れ子の`advance-roadmap`、またはplan無しの完了の確認）、完了を書き留めて次へ進む。roadmapのphaseの子のpath・status・完了日を書くのはこのskillだけである。

##### phaseの設計をtask-designへ任せ、先回りしない

子phaseのtask-designを起動する前に、phaseの計画を整理し直す、codeを読んで方針を作る、plan種別を予想することをしない。phaseの計画と上位roadmapの制約を、そのままtask-designへ渡す。返った結果は、結果とfileの対応（排他的なplan、未解消のTBDが無いこと）だけを確かめ、内容を設計し直さない。

##### 進み具合だけを書き、計画は変えない

roadmapのうち更新するのは子のpath・status・完了日だけである。phaseの目的・範囲・DoD・依存を変える必要が出たら、直接編集せず、同じdirectoryでtask-designを再開する。

##### roadmapは実行するものではなく進めるもの

tasklistのtaskはそのまま実行できるが、roadmapのphaseはそれぞれをtask-designで設計してから実行する。このskillを`tasklist-executor`と対の「executor」にせず、進み具合を進める担当として名付ける。

#### tasklist-executorと、それを起動する側

`tasklist-executor`の受け持ち（tasklistのsingle writer、止まる理由、再開）は変えない。`tasklist-executor/caller-contract.md`（起動する側が行うこと）を新しく置き、steeringが持っていたtasklistの段取りを、起動する側（利用者の会話のagent、`advance-roadmap`）の約束として置く。返却結果だけで次を判断せずtasklistとartifactを読み直すこと、`blocked`で返った時の復旧（blocker resolution）、実装後のfeedbackの扱い、段取りの議論の記録（`discussion.md`）である。どの担当が起動しても同じ約束で扱えるよう、起動される側のfileに置く。blocker resolutionは、手順を離れて自ら手を動かしてよい唯一の例外であり、固有の状態・完了・判断を持って子agentへの委譲の形とは別の理由で改められるため、`tasklist-executor/blocker-resolution.md`に分けて置き、`caller-contract.md`から参照する。起動する側の約束を、`tasklist-executor`がchild処理を委譲する時の契約（`execution-contracts.md`）と別のfileにするのは、読む担当も改める理由も違うためである。段取りの議論（`discussion.md`）の運用は、roadmapとtasklistの起動する側が共有し、roadmapだけに関わる手順とは別の理由で改まるため、`advance-roadmap/staging-discussion.md`に置き、`caller-contract.md`から参照する。

### 作業の流れと担当

**担当と、受け持つこと:**

| 担当 | 判断・更新するもの | 行わないこと | 正とする記録 |
| --- | --- | --- | --- |
| `task-design` | 設計とplanの合意、設計中の反映・validation、締めくくりの確認、plan無しの公開、実行開始の確認 | 置き場所の決定、planの実行、roadmapの進み具合の更新 | `design.md`、`task-design-discussion.md`、`tasklist.md | roadmap.md` |
| `prepare-design-record` | 命名、`.design-records/`の作成、前月の`summary.md`、branch、`.steering/`の一度だけの移動の提案 | 設計、成果物の作成、`summary.md`の追記・再生成 | 作業のdirectory、`summary.md` |
| `tasklist-executor` | taskの実行、checkbox、DoD判定、止まる理由の返却 | roadmapの探索・更新、設計 | `tasklist.md`のcheckbox、request／result artifact |
| 起動する側（利用者の会話のagent、`advance-roadmap`） | `tasklist-executor`の起動、止まった後の読み直し、復旧の三択、実装後feedbackの記録、段取りの議論 | tasklistの更新、設計 | `implementation_review.md`、`discussion.md`、`subagent_report/` |
| `advance-roadmap` | phaseの選択、子phaseのtask-designの起動、結果の確認、子のpath・status・完了日、完了の伝播 | phaseの計画の変更、設計、実装、test・CIの実行 | `roadmap.md`の進み具合 |

**状態と遷移:**

```text
利用者 → task-design ─→ prepare-design-record（新しい作業のとき）
                     ─→ 設計・議論・plan ─→ wrap-up.md（締めくくりの確認）
                                              ├ planless_complete → 公開 → 完了
                                              ├ tasklist_ready → 実行開始の確認 ─→ 起動する側 → tasklist-executor
                                              └ roadmap_ready  → 実行開始の確認 ─→ advance-roadmap

advance-roadmap（phaseごと）
  次のphaseを選ぶ → 子の設計の記録をbinding・進行中 → task-design（子phase）
    ├ tasklist_ready → 起動する側としてtasklist-executor
    ├ roadmap_ready  → advance-roadmap（入れ子）
    └ planless_complete → 完了を確かめる
  → status・完了日 → 次のphase → 全phase完了なら一段上へ伝える
```

**守る順序と引き継ぎ:**

1. 利用者がtask-designを起動する。新しい作業ならtask-designが`prepare-design-record`を呼び、返ったpathを`working_dir`にする。再開なら渡された`working_dir`を使う。
2. task-designが設計し、必要ならplanを作って合意する。
3. 結果を返す前に、task-designが`wrap-up.md`の締めくくりの確認を行い、提案を一度に示して承認されたものだけ適用する。
4. plan無しなら公開して完了を報告する。planがあれば、確認の結果を示した後に実行を始めてよいかを確かめ、明示の指示があればtasklistは起動する側が`tasklist-executor`を、roadmapは`advance-roadmap`を起動する。
5. `tasklist-executor`がどの理由で止まっても、起動する側はtasklistとartifactを読み直してから次を決める。
6. `advance-roadmap`は子phaseの結果を受けるたびに結果とfileの対応を確かめ、status・完了日を書き、次のphaseへ進む。

**失敗・取消・再開:**

- 実行開始の確認で拒否・保留・返事なし: task-designはそこで終える。実行側は起動しない。
- `tasklist-executor`が`blocked`で返り、Flowの内側で復旧できない: 起動する側が三択（止まる／離れて都度確認／離れて自走）を一度で問う。
- 実装・review・動作確認でfeedback: 直接受けた担当が`implementation-feedback.md`を読み、`implementation_review.md`へ記録してから戻し先へ返す。実装を自動再開しない。
- 子phaseの結果がfileと食い違う、両planが併存する: `advance-roadmap`が同じdirectoryでtask-designを再開する。
- `.steering/`と`.design-records/`が両方あり、`.steering/`に追跡されたfileが残る: `prepare-design-record`が止まり、利用者へ確かめる。
- `.steering/`と`.design-records/`が両方あり、`.steering/`には追跡外のfileだけが残る: `prepare-design-record`が残ったfileを`.design-records/`へ移すことを提案する。承認されなければ止まる。

### 作業の記録を置くdirectory

作業の記録は`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/`へ置き、月の一覧は`.design-records/YYYY/YYYYMM/summary.md`に置く。入るもの（タスク設計、調査設計、その議論・計画・実行の経緯）に共通する核は「設計」であり、「作業」まで広げずに調査の設計も含めて範囲を覆える。`records`は、決定と経緯が残る場所であることを示し、後の作業が過去の決定を探しに来る使われ方と合う。

既にある`.steering/`の記録は`.design-records/`へ移す。このrepositoryでは今回の作業で`git mv`し、進行中の作業のdirectoryも一緒に移す。利用先repositoryでは`prepare-design-record`が初回に移すことを提案する。記録の本文に残る`.steering/…`のpathは書き換えず、`prepare-design-record/breaking_changes/`の記録で読み替える。この記録を置けるよう、`maintenance-plugin-context/SKILL.md`「Plugin version」の記録の対象を「見出し・labelの名前や、置き場所のpathで読めなくなること」へ広げる。読む箇所（過去の決定を探す処理、前月summary、hook、`.gitignore`の見本）は`.design-records/`だけを見る。他のbranchで`.steering/`の下にfileを足している作業とmergeの時に衝突しうることは、移す代償として受け入れる。

### 文書以外に作るfileの中身

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/prepare-design-record/SKILL.md`（新規） | 作業を始めるagent | 設計の記録を用意し、pathを返す |
| `plugins/tumeda-dev/skills/prepare-design-record/summarize-previous-month.md`（新規） | 同上 | 前月の`summary.md`を作る |
| `plugins/tumeda-dev/skills/prepare-design-record/.gitignore.sample`（移動） | 利用先repository | `.design-records/.gitignore`へ複製する |
| `plugins/tumeda-dev/skills/prepare-design-record/breaking_changes/`（新規。READMEと一件） | 以前の記録を読むagent | `.steering/…`を読み替える |
| `plugins/tumeda-dev/skills/advance-roadmap/SKILL.md`（新規） | roadmapを進めるagent | phaseを依存順に進める |
| `plugins/tumeda-dev/skills/task-design/SKILL.md`（更新） | 作業を始めるagent | 入口としての入力、`prepare-design-record`の呼び方、Step 6から`wrap-up.md`を読む |
| `plugins/tumeda-dev/skills/task-design/wrap-up.md`（新規） | 結果を返す前のtask-design | 締めくくりの確認、公開、commitの順序、実行開始の確認 |
| `plugins/tumeda-dev/skills/task-design/`の`tasklist-design.md`、`roadmap-design.md`、`work-handoff-contracts.md`、`templates/`（更新） | task-design | steeringの名指しを新しい担当へ。roadmapの見出し・labelの切り替え |
| `plugins/tumeda-dev/skills/task-design/templates/breaking_changes/`（一件追加） | 以前のroadmapを読むagent | roadmapの旧い見出し・labelを読み替える |
| `plugins/tumeda-dev/skills/tasklist-executor/caller-contract.md`（新規） | 起動する側 | 起動の仕方、読み直し、blocker resolutionの読む時、feedback、段取りの議論 |
| `plugins/tumeda-dev/skills/tasklist-executor/execution-contracts.md`（更新） | `tasklist-executor` | child処理を委譲する時の契約。起動する側の約束とBlocker resolutionへの参照 |
| `plugins/tumeda-dev/skills/advance-roadmap/staging-discussion.md`（新規） | 段取りの議論を始める担当（`advance-roadmap`、tasklistを起動する側） | `discussion.md`へ段取りの議論を記録する |
| `plugins/tumeda-dev/skills/tasklist-executor/blocker-resolution.md`（新規） | 起動する側 | 実行の前提が崩れて進めない時に、手順を離れてよいかを判断し、復旧して戻る |
| `plugins/tumeda-dev/skills/tasklist-executor/caller-contract.md`（新規）、`execution-contracts.md`、`task-design/wrap-up.md`、`advance-roadmap/SKILL.md`、`blocker-resolution.md` | `execution-contracts.md`の「起動する側が行うこと」を見出しの深さだけ変えて新しいfileへ移した（論点31）。`execution-contracts.md`の内部を指していた二箇所は`execution-contracts.md`へのlinkにした。参照元を新しいfileへ向けた | 移した本文が、見出しの深さと参照の書き換えを除き元と一致することを機械的に照合した。validatorの`callerContract`を新しいfileへ向け、古い参照を禁止するassertionを足して通過 | [tasklist-executorと、それを起動する側](#tasklist-executorとそれを起動する側) |
| `plugins/tumeda-dev/skills/advance-roadmap/staging-discussion.md`（新規）、`advance-roadmap/SKILL.md`、`caller-contract.md` | `advance-roadmap/SKILL.md`の「段取りの議論（discussion.md）」を見出しの深さだけ変えて新しいfileへ移し、`SKILL.md`には始めない境界と参照を残した（論点32）。tasklistを起動する側の参照先も新しいfileへ直した | 移した本文が見出しの深さを除き元と一致することを機械的に照合した。validatorのassertionを新しいfileへ向けて通過 | [tasklist-executorと、それを起動する側](#tasklist-executorとそれを起動する側) |
| `plugins/tumeda-dev/skills/tasklist-executor/implementation-feedback.md`（移動） | feedbackを直接受けた担当 | feedbackを記録して戻し先を決める |
| `plugins/tumeda-dev/skills/steering/`（削除） | — | — |
| 参照元（`escalate-plugin-skill-fix`、`facilitate-discussion`、`maintenance-plugin-context`、`doc-enricher`、`think-through`、`visual-inspector`、`skills/README.md`、`skills/tumeda-dev-plugin-context.md`、docs、`AGENTS.md`、`.claude/hooks/`） | 各読者 | steeringと`.steering/`の名指しを新しい担当と`.design-records/`へ |
| `scripts/verification/validate-plugin.mjs`、`test-task-design-handoff.mjs`（更新） | 検証 | steeringに置いていたassertionを移した先へ移す |
| 配布manifestと`expectedRelease`（更新） | 配布 | `10.0.0`へ |
| `.steering/` → `.design-records/`（このrepository） | 記録を読むagent | `.design-records/`だけを見る |

**完成後の内容と構造:**

```text
prepare-design-record/SKILL.md
  frontmatter（name、description: 新しい作業の設計の記録を用意する時に使う。task-designが呼ぶ。task-designを通さない調査の設計からも呼べる）
  作業限定の暫定指示を取得する（consumer prepare-design-record）
  役割（置き場所だけを用意し、設計しない）
  入力（作業内容、local date、任意のbranch_from_basename）
  記述規則（日本語、confidentiality）
  手順（順序固定）
    1. 以前の置き場所の確認（.steering/ の一度だけの移動の提案、両方ある時の停止）
    2. name-work-directoryでbasename
    3. branch_from_basename=trueの時だけbranch（停止条件、stashしない、merge済みの名前の確認）
    4. .design-records/YYYY/YYYYMM/ と作業のdirectoryの作成
    5. 前月summary（条件に当たる時だけ summarize-previous-month.md を読む）
    6. 絶対pathを返す。design.md等は作らない
  記録に入るもの（各fileの役割とlifecycle、議論記録の解決、task-design-discussion.mdとdiscussion.mdの区別）
  以前の版の記録の読み方（breaking_changes/）
  .gitignoreの見本
  禁止（設計、子directory、task_design_dir、steering.json、summaryの追記）

advance-roadmap/SKILL.md
  frontmatter、暫定指示（consumer advance-roadmap）
  役割、入力（roadmap.mdとdesign.mdの絶対path）
  repository固有文脈、記述規則
  phaseを進める手順（順序固定。選択、binding、task-designの起動と四項目、結果の確認、起動、status・完了日、全体完了と伝播）
  子phaseのtask-designの起動前の境界
  進み具合だけを書く（更新できるfield、計画の変更はtask-designを再開）
  段取りの議論（staging-discussion.mdを参照）、実装後feedback、blocker resolution（caller-contract.md・blocker-resolution.mdを参照）
  禁止、元作業の完了の通知

task-design/wrap-up.md
  いつ読むか（Step 6で結果を返す前）
  締めくくりの確認（三つを見直してから一度に示す。doc-enricher、議論記録からの再発防止、task-design自身、ファインプレー即時記録）
  plan無しの完了と公開（記録をcommitへ載せる順序を含む）
  実行を始めてよいかの確認（子phaseでは指示を結果に添えて返す）
  保留したplugin改善のメモ、元作業の完了の通知
  禁止
```

**記載する原則と例:**

- 移す内容は、対応表（`function-migration-ledger.md`）のdestinationへ、元の条件・理由・例・失敗例・判断の問いごと移す。
  - 今回の具体例: steeringの4-2の三つの問いと失敗例は、`wrap-up.md`へ文面を保って移す。
  - 意図に反する薄い記述: 「締めくくりに再発防止を見直す」の一行だけを残し、三つの問い・失敗例・先送りしない理由を落とす。判断の力が落ちる。
- 名前の置き換えは、意味を変えない範囲だけを機械的に行い、意味が変わる箇所は対応表の`ADAPT`・`CHANGE`として扱う。
  - 今回の具体例: 「steering directory」は「設計の記録」へ置き換える。「子steering」は、roadmapの子phaseの設計の記録と、それを進める`advance-roadmap`の起動に分かれるため、箇所ごとに書き分ける。

**配置・形式:**

- 配置: `plugins/tumeda-dev/skills/`。`.agents/skills`と`.claude/skills`はこのdirectoryへのsymlinkのため、新しいskillはそのまま読み込まれる。
- 形式: 既存の`SKILL.md`のfrontmatterと見出しの形に合わせる。
- 正とする記述と重複の防止: 起動する側の約束は`tasklist-executor/caller-contract.md`だけに、blocker resolutionは`tasklist-executor/blocker-resolution.md`だけに、段取りの議論の運用は`advance-roadmap/staging-discussion.md`だけに書き、他からは参照する。移し方の手順は`prepare-design-record/breaking_changes/20261123-move-steering-to-design-records.md`だけに書き、`prepare-design-record/SKILL.md`は参照と止まる時の扱いだけを持つ。記録の置き場所の規則は`prepare-design-record`だけに書き、task-designからは呼び方だけを書く。

### 新しいskillの名前

置き場所を用意するskillは`prepare-design-record`、roadmapを進めるskillは`advance-roadmap`とする。内部指示のfileは`task-design/wrap-up.md`と`prepare-design-record/summarize-previous-month.md`とする。

`prepare-design-record`は、`.design-records/`の一件を目的語にし、このskillを経た後の状態（設計の記録が使える状態になる）を名指す。`advance-roadmap`は、このskillを経た後に変わるroadmapの進み具合を名指す。`tasklist-executor`と形を揃えた`roadmap-executor`にしないのは、tasklistのtaskはそのまま実行できるが、roadmapのphaseはそれぞれをtask-designで設計してから実行し、二つが同じ種類の仕事ではないためである。`wrap-up.md`は、直上の`task-design/`が語ることを重ねず、別のtask-designの実行への引き継ぎを指す`work-handoff-contracts.md`の「handoff」と紛れない名前にした。`summarize-previous-month.md`は、生成物の`summary.md`と紛れないよう手順を動詞で表した。

### 移行で変えない振る舞いと、意図して変える差分

**移行前の基準と、照合の記録:**

| 項目 | 内容 |
| --- | --- |
| 移行前の基準 | `085cc08`の`plugins/tumeda-dev/skills/steering/`（`SKILL.md`、`implementation-feedback.md`、`.gitignore.sample`）と、このrepositoryの`.steering/` |
| 対象範囲 | steeringの受け持ちを`task-design`、`prepare-design-record`、`advance-roadmap`、`tasklist-executor`へ移し、記録の置き場所を`.design-records/`へ移す |
| 移行の対応表 | [function-migration-ledger.md](./function-migration-ledger.md) |
| 移行手順を定める文書 | [`function_migration_policy.md`](../../../../plugins/tumeda-dev/docs/common_standard/function_migration_policy.md) |

**変わるものと、保存されるもの:**

次に書く変化だけが変わる。対象範囲の中のその他の全ての意味単位は、担当や置き場所が変わっても、意味、条件、順序、強さ、判断の力を保存する。

**完成後に変わること:**

| 完成後に変わる意味 | 移行前との違い | 詳細を書いたsection | 根拠 |
| --- | --- | --- | --- |
| 利用者はtask-designから作業を始め、task-designを包む層が無い | 移行前はsteeringがtask-designを起動し、結果を検証していた | [task-design](#task-design) | C-009、C-067、論点1 |
| 新しい作業の記録は`.design-records/`に置かれ、単独起動でも同じ置き場所になる | 移行前は`.steering/`、単独起動では現在のdirectory直下 | [prepare-design-record](#prepare-design-record) | C-025、C-056、A-005、論点5・19 |
| task-designの入力は、新しい作業なら置き場所を渡さず、再開なら`working_dir`を渡す | 移行前は`working_dir_parent`と`create_working_dir` | [新しい作業の置き場所は`prepare-design-record`に任せる](#新しい作業の置き場所はprepare-design-recordに任せる) | C-068、C-112、論点19 |
| 記録を`.design-records/`へ移す手順として、standalone roadmapの昇格が無くなる | 移行前は明示承認の後にbundleを移動した | [新しい作業の置き場所は`prepare-design-record`に任せる](#新しい作業の置き場所はprepare-design-recordに任せる) | C-007、C-117〜C-119、C-143、論点1 |
| 既にある`.steering/`を一度だけ`.design-records/`へ移し、本文の旧pathは読み替える | 移行前に該当なし | [以前の置き場所の記録を一度だけ移す](#以前の置き場所の記録を一度だけ移す) | A-001、A-002、A-003、論点14・16 |
| 移した変更をpullした別のcloneに残った追跡外のfileを、承認を得て`.design-records/`の同じ相対pathへ移す | 移行前に該当なし | [以前の置き場所の記録を一度だけ移す](#以前の置き場所の記録を一度だけ移す) | A-010、論点28 |
| roadmapの進み具合の見出し・labelが`advance-roadmap`と子の設計の記録を名指す | 移行前はsteeringと子steering | [advance-roadmap](#advance-roadmap) | A-004、論点20 |
| 前月summaryの題が「{YYYY}年{MM}月 設計の記録 サマリー」になる。既にある月のsummaryは書き換えない | 移行前は「{YYYY}年{MM}月 Steering サマリー」 | [prepare-design-record](#prepare-design-record) | C-063、論点23 |
| steeringの非規範的なlegacy memoと、steering自身の過去の契約を説明する「合意済みの明示廃止」の記述が無くなる。逆戻りを防ぐ禁止は新しい担当が持つ | 移行前はsteeringが持っていた | [advance-roadmap](#advance-roadmap)、[prepare-design-record](#prepare-design-record) | C-047、C-148〜C-151、C-153、論点24 |

---

## 要件（Requirements）

### MUST（必達）

- `plugins/tumeda-dev/skills/steering/`が無くなり、`function-migration-ledger.md`の全IDが、具体的なdestinationへ移るか、合意済みの`CHANGE`・`RETIRE`として扱われている。
- 利用者がtask-designから作業を始められ、新しい作業の記録が`prepare-design-record`によって`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/`へ置かれる。
- `prepare-design-record`、`advance-roadmap`、`task-design/wrap-up.md`、`prepare-design-record/summarize-previous-month.md`が、上の「文書以外に作るfileの中身」の構造で作られている。
- `tasklist-executor/caller-contract.md`が起動する側の約束（読み直し、blocker resolution、実装後feedback、段取りの議論）を持ち、blocker resolutionの本文が`tasklist-executor/blocker-resolution.md`に、段取りの議論の運用が`advance-roadmap/staging-discussion.md`にあり、`implementation-feedback.md`が`tasklist-executor/`へ移っている。
- このrepositoryの`.steering/`が`.design-records/`へ`git mv`されている。
- `prepare-design-record/breaking_changes/`と`task-design/templates/breaking_changes/`に読み替えの記録があり、`maintenance-plugin-context/SKILL.md`「Plugin version」の対象が置き場所のpathを含む。
- skill・docs・hook・`AGENTS.md`・validatorから、steeringというskillと`.steering/`への名指しが無くなっている（残るのは読み替えの記録、移行の対応表、過去の記録の本文だけ）。
- 配布versionが`10.0.0`に揃っている（宣言値4箇所と`expectedRelease`）。

### 非目標

- `.steering/`配下にあった過去の記録の本文を書き換えること。旧pathは`breaking_changes/`の記録で読み替える（論点14）。
- `advance-roadmap`へ移す、repository固有文脈で返す項目を減らすこと。振る舞いの変更であり今回の目的の外である（論点21）。`advance-roadmap`を使う作業で、使わない項目があると分かった時に見直す。
- 変更を伴わない調査の設計を受け持つskillを作ること。今回は`prepare-design-record`をそこから呼べるようにするだけで、そのskillは利用者がその作業を始める時に設計する。
- `exhaustive-review`の`working_dir_parent`・`create_working_dir`を変えること。自分の成果物の置き場所であり、task-designの入力とは独立している（論点19）。
- 別のsessionで進行中の`20261122-raise-steering-autonomy`の中身。directoryを移すだけで、本文は変えない。

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs`が`plugin validation passed`を出す。
- `node scripts/verification/test-task-design-handoff.mjs`が`task-design handoff tests passed`を出す。
- `node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs`が通る。
- `.design-records/`と移行の対応表を除くrepository全体を`grep -rn "steering"`し、出力の全行が、読み替えの記録・versionの履歴等の許した箇所だけであることを全出力で確かめる。
- `function-migration-ledger.md`の白box照合の集計が「未監査0 / 未分類削除0 / 未分類追加0」である。
- `.design-records/`に61の作業のdirectoryと月ごとの`summary.md`があり、`.steering/`が無い。`git log --follow`で移動前の履歴を辿れる。
- 作業を破棄しても残る変化（配布したpluginを利用先が更新すること）について: 利用先が`.steering/`の記録を読めることを、`prepare-design-record/breaking_changes/`の記録の手順だけを入力として、`.steering/…`のpathを`.design-records/…`へ読み替えられることで確かめる。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 別のbranchやsessionが`.steering/`の下にfileを足していると、mergeで衝突する（`20261122-raise-steering-autonomy`等） | 移す代償として受け入れる（論点14）。PRの本文に、移動を含むことと衝突の解き方（`.design-records/`へ置き直す）を書く |
| validatorのassertionを書き換える時に、守っていた契約まで緩める | `function_migration_policy.md` §8に従い、assertionは消さずに移した先のfileへ向け直す。消すassertionは対応表の`RETIRE`に対応させる |
| steeringの記述を移す時に、条件・理由・失敗例が落ちる | 対応表のIDごとに移し、白box照合（順方向・逆方向・境界）を行う。移行後の文章量の大幅な減少を異常のsignalとして監査する |
| 利用先repositoryで、更新後の初回に`.steering/`と`.design-records/`が両方できる | `.steering/`に追跡されたfileが残る時は、`prepare-design-record`が止まって利用者へ確かめる |
| 移した変更をpullした別のcloneで、追跡外のfile（作業の控え、commit前の作業）が`.steering/`に残り、置き去りになる | `prepare-design-record`が、追跡されたfileが無いことを確かめてから、残ったfileを`.design-records/`の同じ相対pathへ移すことを提案する。fileは消さない |
| このsessionのhookが`.steering/`を前提にした文を注入し続ける | `.claude/hooks/`の文を`.design-records/`へ書き換える |

---

## テスト方針

- assistantが、上の三つのcommandを実行して確かめる。今の環境でNode.jsが使える。
- assistantが、`grep -rn "steering"`の全出力を読み、残る行がすべて許した箇所であることを確かめる。
- assistantが、対応表の全IDについて、移した先の節を読んで照合し、Git差分の削除行と追加行から逆にIDを引く（白box照合）。集計を対応表へ記録する。
- assistantが、旧contractから導いた三つの経路（plan無し、tasklist、roadmap）を、新しい`task-design`・`wrap-up.md`・`caller-contract.md`・`advance-roadmap`の記述だけを読んで辿り、gate・確認・停止・single writerが欠けないことを確かめる（黒box）。実際の利用先repositoryでskillを起動しての確認は、このsessionからは行えない。
- assistantが、新しく作る・変える`SKILL.md`と内部指示とdocsに`document-review`を当て、汎用skillの編集後に`skill-update-review`を当てる。
- 利用者が、PRの差分を読んで確かめる。GitHubで差分を読める。

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

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/skills/prepare-design-record/`（`SKILL.md`、`summarize-previous-month.md`、`.gitignore.sample`、`breaking_changes/`） | 新設。置き場所の準備、前月summary、以前の置き場所の一度だけの移動と読み替えの記録 | validator・白box照合・document-reviewを通過 | [prepare-design-record](#prepare-design-record) |
| `plugins/tumeda-dev/skills/advance-roadmap/SKILL.md` | 新設。roadmapをphaseごとに進める | 同上。bindingの順序を照合で直した | [advance-roadmap](#advance-roadmap) |
| `plugins/tumeda-dev/skills/task-design/`（`SKILL.md`、`wrap-up.md`、`tasklist-design.md`、`roadmap-design.md`、`work-handoff-contracts.md`、`templates/`、`templates/breaking_changes/`） | 入口としての入力、`prepare-design-record`の呼び方、締めくくり、roadmapの見出し・labelの切り替えと記録、steeringの名指しの書き換え | 同上。`test-task-design-handoff.mjs`を通過 | [task-design](#task-design) |
| `plugins/tumeda-dev/skills/tasklist-executor/`（`execution-contracts.md`、`implementation-feedback.md`、`SKILL.md`） | 起動する側が行うことを足し、実装feedbackの手順を移した | validator・白box照合を通過 | [tasklist-executorと、それを起動する側](#tasklist-executorとそれを起動する側) |
| `plugins/tumeda-dev/skills/steering/` | 削除 | validatorの不存在条件を通過 | [移行で変えない振る舞いと、意図して変える差分](#移行で変えない振る舞いと意図して変える差分) |
| 参照元（escalate、facilitate-discussion、maintenance-plugin-context、doc-enricher、think-through、visual-inspector、`skills/README.md`、`tumeda-dev-plugin-context.md`、docs、`AGENTS.md`、`.claude/hooks/`） | steeringと`.steering/`の名指しを新しい担当と`.design-records/`へ。`Plugin version`の記録の対象を置き場所のpathへ広げた | `grep -rn steering`の全出力で、残りが読み替えの記録・以前の置き場所の扱い・`steering.json`の禁止だけであることを確かめた | [文書以外に作るfileの中身](#文書以外に作るfileの中身) |
| `scripts/verification/validate-plugin.mjs`、`test-task-design-handoff.mjs` | steeringに向けていたassertionを移した先へ向け直した。消したassertionは合意済みの`RETIRE`・`CHANGE`に対応する | `plugin validation passed`、`task-design handoff tests passed` | [テスト方針](#テスト方針) |
| 配布manifestの4箇所と`expectedRelease` | `10.0.0` | validatorを通過 | [要件（Requirements）](#要件requirements) |
| `.steering/` → `.design-records/` | `git mv`。中身は変えていない | 61の作業のdirectoryがあり、`.steering/`が無い | [作業の記録を置くdirectory](#作業の記録を置くdirectory) |

### 設計中に反映する、他の判断を待っている変更

| 対象 | 待つ理由 | 依存する判断 | 参照するdesign section |
| --- | --- | --- | --- |
| `prepare-design-record/SKILL.md`の手順1（移すことを承認されなかった時の扱い） | 仮決めの文面で書いてあり、合意を待つ | 論点26 | [以前の置き場所の記録を一度だけ移す](#以前の置き場所の記録を一度だけ移す) |
| `tasklist-executor/blocker-resolution.md`への分割 | 編集後のreviewの候補を今分けるかの合意を待つ | 論点27 | [tasklist-executorと、それを起動する側](#tasklist-executorとそれを起動する側) |

### tasklist・roadmapに載せて実行する変更

なし。対象はskill・docs・template・hook・manifestと、それらを検査する補助のscriptであり、本番として利用者へ届けるapplicationのcode変更ではない。順序に依存する段階や中間の確認も無く、一つの連続した反映と検証で完了できる。利用者のplanの指定も無い。
