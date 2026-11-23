# Function migration ledger: steeringの受け持ちを各担当へ移す

`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`に従う移行の対応表。`design.md`の「移行で変えない振る舞いと、意図して変える差分」から参照する。

## baseline

- revision: `085cc08`（`main`。この作業の開始時点）
- 移行元:
  - `plugins/tumeda-dev/skills/steering/SKILL.md` 1〜510行
  - `plugins/tumeda-dev/skills/steering/implementation-feedback.md` 1〜44行
  - `plugins/tumeda-dev/skills/steering/.gitignore.sample` 1〜8行
  - このrepositoryの`.steering/`全体（`.steering/.gitignore`と61の作業のdirectory、月ごとの`summary.md`）
- 方向: steering → `task-design`（`SKILL.md`と新しい`wrap-up.md`）、新しい`prepare-design-record`、新しい`advance-roadmap`、`tasklist-executor`（`caller-contract.md`、`blocker-resolution.md`、移した`implementation-feedback.md`）、`.design-records/`。段取りの議論の運用は`advance-roadmap/staging-discussion.md`
- 移行の開始前に合意済みの変更・廃止: `task-design-discussion.md`の論点1〜21の決定
- 移行対象の内容へ依存している側（`.steering/`配下を除き、`steering`を含む43 file）:
  - skill: `task-design`（`SKILL.md`、`roadmap-design.md`、`tasklist-design.md`、`work-handoff-contracts.md`、`templates/`の`design.md`・`tasklist.md`・`roadmap.md`・`outcome-sections/`・`breaking_changes/`）、`tasklist-executor`（`SKILL.md`、`execution-contracts.md`）、`escalate-plugin-skill-fix`（`SKILL.md`、`pending-escalations.md`、`integrate-plugin-changes.md`、`agents/openai.yaml`）、`facilitate-discussion`（`SKILL.md`、`round-trip.md`）、`maintenance-plugin-context`（`SKILL.md`、`maintenance_policies/migration.md`）、`doc-enricher/SKILL.md`、`think-through/SKILL.md`、`visual-inspector/SKILL.md`、`skills/README.md`、`skills/tumeda-dev-plugin-context.md`
  - docs: `think_standards/`（`advancing_discussion.md`、`core.md`、`updating_types.md`）、`documentation_standards/`（`README.md`、`provisionality_explicitness.md`、`stock-and-flow-information.md`）、`development_standards/development_flow/work_scope.md`、`agent_execution_standards/blocked_commands.md`
  - repository: `AGENTS.md`、`.claude/hooks/think_through_session_start.sh`、`.claude/hooks/think_through_user_prompt.sh`、`scripts/verification/validate-plugin.mjs`、`scripts/verification/test-task-design-handoff.mjs`

## 分類の合意の出典

`D<n>`は`task-design-discussion.md`の論点nの決定を指す。

## 構造ledger

| ID | source（`steering/SKILL.md`の行） | 構造の役割 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| ST-01 | 1〜6 | frontmatter | 新skillのfrontmatter、`task-design`の起動条件 | ADAPT | D1、D4、D15 |
| ST-02 | 7〜8 | 題 | — | RETIRE | D1 |
| ST-03 | 9〜24 | 暫定指示の取得 | `prepare-design-record`、`advance-roadmap` | ADAPT | D1、D3、D11 |
| ST-04 | 25〜31 | 入力 | `task-design`の入力、`advance-roadmap`の入力 | ADAPT / CHANGE / RETIRE | D1、D19 |
| ST-05 | 32〜42 | 役割とゴール | `task-design/wrap-up.md`、`advance-roadmap`、`caller-contract.md` | ADAPT / RETIRE | D1、D3、D6、D12、D31 |
| ST-06 | 43〜56 | task-design初回起動前の境界 | `advance-roadmap`（子phaseのtask-design起動前）、`prepare-design-record` | ADAPT | D1、D3、D11 |
| ST-07 | 57〜60 | repository固有文脈 | `advance-roadmap` | ADAPT | D21 |
| ST-08 | 61〜68 | 記述規則 | `prepare-design-record`、`advance-roadmap` | ADAPT | D11、D3 |
| ST-09 | 69〜93 | 命名規則とcanonical directory | `prepare-design-record` | MOVE / ADAPT / CHANGE | D5、D11 |
| ST-10 | 94〜106 | 成果物のlifecycle | `prepare-design-record`（記録に入るもの）、`task-design/tasklist-design.md` | ADAPT / MOVE | D1、D10、D11 |
| ST-11 | 107〜124 | commitへ載せる順序 | `task-design/wrap-up.md`、`tasklist-design.md`から参照 | ADAPT | D9 |
| ST-12 | 125〜128 | 非規範的なlegacy memo | — | RETIRE | D24 |
| ST-13 | 129〜148 | discussion.mdの使い方 | `advance-roadmap/staging-discussion.md`、`caller-contract.md` | ADAPT | D10、D31、D32 |
| ST-14 | 149〜183 | Flow、Step 1（置き場所と前月summary） | `prepare-design-record`、`prepare-design-record/summarize-previous-month.md` | MOVE / ADAPT / CHANGE | D5、D11、D13、D18、D23 |
| ST-15 | 184〜214 | Step 2（task-designの起動） | `task-design`の入力、`advance-roadmap` | ADAPT / CHANGE / RETIRE | D1、D19 |
| ST-16 | 215〜231 | Step 3（ready resultの検証） | `advance-roadmap`（子phaseの結果）、`wrap-up.md`、`caller-contract.md` | ADAPT | D1、D3、D12、D31 |
| ST-17 | 232〜237 | 必須gateの前置き | `task-design/wrap-up.md` | MOVE | D1、D12 |
| ST-18 | 238〜249 | 4-1 doc-enricher | `task-design/wrap-up.md` | ADAPT | D12 |
| ST-19 | 250〜268 | 4-2 再発防止のreview | `task-design/wrap-up.md` | MOVE | D12 |
| ST-20 | 269〜272 | 4-3 skill自身の確認 | `task-design/wrap-up.md` | ADAPT | D1、D12 |
| ST-21 | 273〜281 | ファインプレー即時記録 | `task-design/wrap-up.md` | MOVE | D12 |
| ST-22 | 282〜289 | 5-1 planlessの完了と公開 | `task-design/wrap-up.md` | ADAPT | D1、D12 |
| ST-23 | 290〜298 | 5-2 実行開始の確認 | `task-design/wrap-up.md` | ADAPT | D6 |
| ST-24 | 299〜318 | 6-1 leafの受け渡し | `tasklist-executor/caller-contract.md`（起動する側が行うこと） | ADAPT | D3、D31 |
| ST-25 | 319〜332 | 6-2 roadmapの実行 | `advance-roadmap` | ADAPT | D3、D15、D19、D20 |
| ST-26 | 333〜362 | standalone roadmapの昇格 | — | RETIRE | D1 |
| ST-27 | 363〜376 | 実装完了後review | `caller-contract.md`、`advance-roadmap` | ADAPT | D7、D31 |
| ST-28 | 377〜477 | Blocker resolution | `tasklist-executor/blocker-resolution.md`（`caller-contract.md`から参照） | ADAPT | D8、D27 |
| ST-29 | 478〜494 | 絶対にやらないこと | 各destination | ADAPT / RETIRE | 下のcontract ledger |
| ST-30 | 495〜505 | 合意済みの明示廃止 | `advance-roadmap`（一部） | ADAPT / RETIRE | D24、D3 |
| ST-31 | 506〜510 | 元作業の完了の通知 | `advance-roadmap`、`caller-contract.md` | ADAPT | D3、D31 |
| IF-01 | `implementation-feedback.md` 1〜2、4〜9、11〜33、35〜44 | 実装feedbackの共通手順（steeringを名指さない行） | `tasklist-executor/implementation-feedback.md` | MOVE（バイト一致） | D7 |
| IF-02 | `implementation-feedback.md` 3、10、34 | 実装feedbackの共通手順（steeringを名指す行） | `tasklist-executor/implementation-feedback.md` | ADAPT | D7、D3、D15 |
| GI-01 | `.gitignore.sample` 1〜8 | 利用先へ複製する`.gitignore`の見本 | `prepare-design-record/.gitignore.sample` | ADAPT | D11、D5 |
| SR-01 | このrepositoryの`.steering/`全体 | 作業の記録 | `.design-records/`（`git mv`） | MOVE | D14 |

## contract ledger

### ST-01 frontmatter

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-001 | trigger | 明示指定時、および軽度でない複数file・複数stepの変更時に起動する | `task-design`の既存の起動条件（複数file・layerの変更、設計判断を含む変更）。入口がtask-designになる | ADAPT | D1 |
| C-002 | 宣言 | name、description、allowed-tools（Read, Grep, Write, Edit, Bash, Agent） | `prepare-design-record`と`advance-roadmap`のfrontmatter。toolsは同じ | ADAPT | D4、D15 |

### ST-03 暫定指示の取得

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-003 | action | 起動・再開時に、元作業のexactな場所・consumer名・対象処理・SKILL.mdの取得元を`maintenance-plugin-context`へ渡して暫定指示を取得し、状態ごとに従う。定期取得しない | 両新skillの同名節。consumer名だけを各skillの名前にする | ADAPT | D11、D3 |
| C-004 | 前提・停止 | 元作業directoryが未確定なら取得不能をnoneにせず不足を返し、命名・directory確定に必要な処理は続け、確定直後に取得する | 両新skillの同名節 | ADAPT | 同上 |

### ST-04 入力

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-005 | 入力 | 利用者の入力「達成したいこと」を受ける | `task-design`の既存の入力（要件） | ADAPT | D1 |
| C-006 | 入力 | 子phaseでは四項目を受ける | `advance-roadmap`が子phaseのtask-designへ渡す。task-designは同じ四項目を受ける | ADAPT | D19 |
| C-007 | 入力 | `adopt_task_design_working_dir`でstandalone roadmapを昇格する | — | RETIRE | D1 |
| C-008 | 入力・default | `branch_from_basename`（default `false`）。`true`ならbasenameを決めた直後に同名branchを作って切り替える | `task-design`の入力として受け、`prepare-design-record`へ渡す。`prepare-design-record`がbranchを作る | ADAPT | D11、D19 |

### ST-05 役割とゴール

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-009 | owner | steeringはtask-designのcaller兼plan orchestratorであり、repository contextとcanonical directoryを準備し、task-designのresultを検証する | callerとしての層は無くす。置き場所は`prepare-design-record`、resultの検証は`advance-roadmap`（子phase）とtask-design自身のStep 6 | RETIRE / ADAPT | D1、D3 |
| C-010 | 順序 | `tasklist_ready`は必須gateと実行開始確認を経て`tasklist-executor`へ | `wrap-up.md`（gate、確認）→ `execution-contracts.md`（起動する側） | ADAPT | D6、D12、D3 |
| C-011 | 順序 | `roadmap_ready`は同じgateと確認を経て子phaseを依存順に再帰実行 | `wrap-up.md` → `advance-roadmap` | ADAPT | D6、D12、D3 |
| C-012 | 順序 | `planless_complete`は同じ終了前gateを経てdispatchせず完了 | `wrap-up.md` | ADAPT | D12 |
| C-013 | owner | phaseの計画はtask-design、子path・status・完了日はsteering | 子path・status・完了日は`advance-roadmap` | ADAPT | D3 |
| C-014 | 禁止 | design、tasklist、roadmapの内容を設計・重複reviewしない | `advance-roadmap`の禁止 | ADAPT | D3 |
| C-015 | 禁止・順序 | ready resultで自動的に実装へ進まない。三result共通gateを完了し、planでは開始確認を得るまで起動しない。planlessは開始確認・dispatchへ送らない | `wrap-up.md` | ADAPT | D6、D12 |

### ST-06 task-design初回起動前の境界

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-016 | 順序 | directory準備後、入力を未整理のままtask-designへ渡して直ちに起動する。曖昧さはtask-designが解消する | `advance-roadmap`: 子phaseのtask-designへ、phaseの計画と上位制約を未整理のまま渡し、子の設計を先回りしない。最上位では利用者が直接task-designを起動するため層が無い | ADAPT | D1、D3 |
| C-017 | 許可 | 起動前に行ってよいのは、入力の保持、命名・directory作成・前月summary・repository contextの解決、機械的な入力不足の確認だけ | `prepare-design-record`: 行うのは命名・directory・summary・branch・初回移動の提案だけ | ADAPT | D11 |
| C-018 | 禁止 | 起動前にcodeや設計文書を読んで方針を作る、WHY・WHAT・HOWの整理、scope分解、選択肢の提示、plan種別の予想、`discussion.md`での設計議論をしない | `advance-roadmap`（子phaseのtask-designを起動する前）と`prepare-design-record` | ADAPT | D3、D11 |
| C-019 | 例・理由 | `think-through`は安全に起動できるかの確認にだけ使う。「認証方式を変更したい」の例。既存directoryのexact path欠落は機械的不足として確認してよい | `advance-roadmap`（例は子phaseの曖昧なphase計画に置き換え） | ADAPT | D3 |

### ST-07 repository固有文脈

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-020 | action・禁止 | 必要なfactは`maintenance-plugin-context`へconsumer名・理由・fact・確認元候補を渡して解決し、返された範囲だけ読む。task-designが使う設計の材料を自分の判断材料として読まない。固定pathを推測しない | `advance-roadmap`（consumer `advance-roadmap`） | ADAPT | D21 |

### ST-08 記述規則

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-021 | 規則 | 会話と成果物は日本語、識別子等は原文 | 両新skill | ADAPT | D11、D3 |
| C-022 | 規則・例・理由 | 全成果物でdomain固有名詞を略称で書かない（悪い例・良い例、reading costの理由） | `advance-roadmap`（roadmapの進み具合と`discussion.md`を書く） | ADAPT | D3 |
| C-023 | 規則 | 成果物へ書く前に`confidentiality.md`で判定する。調査と書く時点の判断は別 | 両新skill | ADAPT | D11、D3 |

### ST-09 命名規則とcanonical directory

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-024 | action・禁止 | 新規では入力とlocal dateを`name-work-directory`へ渡してbasenameを一つ受け取り、英語要約・slug・日付を独自に決めず、作業中は変えない | `prepare-design-record` | MOVE | D11 |
| C-025 | 出力 | `YYYY`・`YYYYMM`を得て`.steering/YYYY/YYYYMM/YYYYMMDD-slug/`を管理する | `prepare-design-record`。`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/` | CHANGE | D5 |
| C-026 | 正本 | このpathがsteering directoryであり、task-designのworking directoryでもある | このpathが設計の記録であり、task-designのworking directoryでもある | ADAPT | D11、D19 |
| C-027 | owner | 親directoryの作成と前月summary生成を担当する | `prepare-design-record` | MOVE | D11 |
| C-028 | 禁止 | branch名の取得・埋込み・衝突確認をbasenameへ持ち込まない。逆方向は`branch_from_basename` | `prepare-design-record` | MOVE | D11 |
| C-029 | 構造 | rootへ置くfile（`design.md`、`task-design-discussion.md`、排他的plan、任意の`discussion.md`・`implementation_review.md`、必要時の`investigation.md`・`requirements.md`・`spike/`） | `prepare-design-record`の「記録に入るもの」 | ADAPT | D11、D10 |
| C-030 | 禁止 | task-design専用子directory、`task_design_dir`探索、`steering.json`を作らない | `prepare-design-record`の禁止 | ADAPT | D11 |
| C-031 | 規則 | 議論記録は単一fileまたは同名directoryの索引から`facilitate-discussion/resolve-discussion.md`で解決し、分割形式も同じ正本と扱う | `prepare-design-record`の「記録に入るもの」 | ADAPT | D11 |

### ST-10 成果物のlifecycle

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-032 | 正本 | `design.md`は合意済み設計の正本 | `prepare-design-record`の「記録に入るもの」 | ADAPT | D11 |
| C-033 | 条件 | `requirements.md`は長く独立fileでreview可能性が上がる時だけ | 同上 | ADAPT | D11 |
| C-034 | 正本 | `task-design-discussion.md`は設計収束過程の正本 | 同上 | ADAPT | D11 |
| C-035 | 条件 | `tasklist.md | roadmap.md`は載せて実行する変更がある時だけ排他的に作る | 同上 | ADAPT | D11 |
| C-036 | 正本 | `discussion.md`はsteering固有の随時議論 | 同上。実行の段取りの議論の記録 | ADAPT | D10 |
| C-037 | 正本 | `implementation_review.md`は実装後のfeedback・ずれの正本 | 同上 | ADAPT | D11 |
| C-038 | fallback | 見出しが見つからない時は`task-design/templates/breaking_changes/`で旧名を確かめる。前月summary、planless検証、roadmapの進み具合のいずれでも | `summarize-previous-month.md`、`wrap-up.md`、`advance-roadmap`。置き場所のpathは`prepare-design-record/breaking_changes/` | ADAPT | D16、D20 |
| C-039 | 規則・理由 | 同じfeatureの追加taskはdesignとplanを再合意した後に既存tasklistへ追記する。tasklistはfeatureを完成させるためのchecklistで、追加要件が判明してもfeatureの完成まで生きる | `task-design/tasklist-design.md` | MOVE | D1 |

### ST-11 commitへ載せる順序

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-040 | 規則 | 記録を「記録」として一括りにせず、確定した時点で変更commitの前後へ分ける。分割軸は確定時点で置き場所ではない | `wrap-up.md`。「steering成果物」を「作業の記録」へ | ADAPT | D9 |
| C-041 | 順序 | 1 設計・議論は前、2 変更commit、3 checkboxと`implementation_review.md`は後 | `wrap-up.md` | ADAPT | D9 |
| C-042 | 規則 | 複数変更commitでは各commitと根拠の記録を近接させ、無関係なcommitを挟まない | `wrap-up.md` | ADAPT | D9 |
| C-043 | 規則 | 一つのdiscussion fileが複数commitへ対応する時は最も早いcommitへまとめ、後続commitの本文で論点を示す | `wrap-up.md` | ADAPT | D9 |
| C-044 | 例外・判断質問 | 一commitで完結し分けても辿れる情報が増えなければまとめてよい。基準は「どの変更がどの合意に基づくか」を辿れるか | `wrap-up.md` | ADAPT | D9 |
| C-045 | 失敗例・判断質問 | 置き場所で括って最後の一commitへまとめる失敗、その帰結、「対応する変更より前に確定したか」 | `wrap-up.md` | ADAPT | D9 |
| C-046 | 参照 | tasklistのcommit sectionでもこの規則を使う（今のsteeringの規則はtasklistのcommitにも効く） | `tasklist-design.md`の「実装後feedbackと公開action」から`wrap-up.md`を参照 | ADAPT | D9 |

### ST-12 非規範的なlegacy memo

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-047 | 履歴 | 「複数のfeedbackが揃ったら新しいsteeringを起動する」方針は現在の規則ではなく、将来必要なら明示合意で復活を検討する | — | RETIRE | D24 |

### ST-13 discussion.mdの使い方

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-048 | trigger | task-design起動後、記録価値のある固有の思考が生じた時に随時追記。利用者が段取りの論点を提起した時、または自分の段取りの判断で問いを出す時に開始。往復回数の予測等は開始しない理由にならない。初回task-design起動前には開始せず、設計の曖昧さはtask-designへ | `advance-roadmap`と`execution-contracts.md`（起動する側） | ADAPT | D10 |
| C-049 | owner | 開始後は自分が`discussion_directory=<設計の記録>`を渡して`facilitate-discussion`を明示適用し、議論だけを別childへ再委譲しない | 同上 | ADAPT | D10 |
| C-050 | 禁止 | discussion内部の解決・形式・採番等は`facilitate-discussion`が持ち、複製しない。決定後は適切なphaseへ戻す | 同上 | ADAPT | D10 |
| C-051 | 例 | 主な用途（段取り中の疑問・背景、ready result後の進行判断、どこにも属さないこぼれ話） | 同上 | ADAPT | D10 |
| C-052 | 区別 | `investigation.md`は事実収集のlog、`discussion.md`は推論・議論のlog | 同上 | ADAPT | D10 |

### ST-14 Flow、Step 1

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-053 | 順序 | Flowは順序固定 | `prepare-design-record`と`advance-roadmap`の手順は順序固定 | ADAPT | D11、D3 |
| C-054 | action | `name-work-directory`で`YYYYMMDD-slug`を決める | `prepare-design-record` | MOVE | D11 |
| C-055 | action・停止 | `branch_from_basename=true`の時だけHEADから同名branchを作って切り替える。基点はcallerが保証。同名branchがある・切替失敗なら作成も強制切替もせず停止して報告。stashしない。merge済みbranch名の再利用を`branch_pr_issue.md`で確かめる | `prepare-design-record` | MOVE | D11 |
| C-056 | action | 年月の親directoryと作業のdirectoryを作る | `prepare-design-record`。`.design-records/` | CHANGE | D5 |
| C-057 | 条件・禁止 | 前月directoryがあり`summary.md`が無い時だけ生成。既存なら追記・再生成・status更新をしない | `summarize-previous-month.md` | MOVE | D13、D18 |
| C-058 | action・fallback | 前月の各directoryを列挙し、概要はrootの`design.md`から。旧形式だけ直下の子から一意な`design.md`。複数なら推測しない | `summarize-previous-month.md` | MOVE | D13 |
| C-059 | 規則 | 概要の優先順（`## TL;DR`／`## 1. TL;DR`の最初の段落、`## 目的`、`{slug}（概要抽出不可、design.md 参照）`）。旧templateを読むため番号付きも併記 | `summarize-previous-month.md` | MOVE | D13 |
| C-060 | 規則 | tasklistのstatus判定 | `summarize-previous-month.md` | MOVE | D13 |
| C-061 | 規則 | roadmapのstatus判定 | `summarize-previous-month.md` | MOVE | D13 |
| C-062 | 規則 | planlessのstatus判定（付録の見出しの名前） | `summarize-previous-month.md` | MOVE | D13 |
| C-063 | 出力形式 | summaryのexact format。題は「{YYYY}年{MM}月 Steering サマリー」 | `summarize-previous-month.md`。題を「{YYYY}年{MM}月 設計の記録 サマリー」へ | CHANGE | D23 |
| C-064 | 禁止 | entryはslug link・概要・statusだけ。種別・関連・詳細を足さない。詳細は各記録へ委ねる | `summarize-previous-month.md` | MOVE | D13 |
| C-065 | single writer・理由 | 各実行時にstatusを手動更新しない。single writerは翌月初の処理だけ。並行作業のconflictを避けるため | `summarize-previous-month.md` | MOVE | D13 |
| C-066 | 禁止 | この時点では`design.md`・`tasklist.md`・`roadmap.md`を作らない | `prepare-design-record` | MOVE | D11 |

### ST-15 Step 2

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-067 | 順序 | Step 1完了後、設計を整理する別stepを挟まず直ちにtask-designを起動する | task-designは`prepare-design-record`から戻った直後に自分の設計前調査へ進む。間に別の層は無い | RETIRE | D1 |
| C-068 | 入力 | `working_dir_parent=<steering directory>`と`create_working_dir=false`を渡す | 新しい作業は置き場所を渡さず、再開は`working_dir`を渡す | CHANGE | D19 |
| C-069 | 構造 | task-designは子directoryを作らずrootへ置き、再開も同じ入力で別directoryを増やさない | `task-design`のPrepareStep 2 | ADAPT | D19 |
| C-070 | owner・禁止 | 既存designを引き継ぐdesign phaseでも同じworking directoryのtask-designへroutingし、canonicalな本文を読まず、catch-upの要否・完了を判断しない | `advance-roadmap`: 子phaseを再開する時は`working_dir`を渡してtask-designへroutingし、本文を読まない | ADAPT | D3、D19 |
| C-071 | 範囲 | このroutingはtask-designのdesign phaseだけ。他のphaseへhandoff contractを一般化しない | `advance-roadmap` | ADAPT | D3 |
| C-072 | 入力 | 子steeringは四項目を一組で渡す | `advance-roadmap` | ADAPT | D3、D19 |
| C-073 | 区別 | `task-design-discussion.md`と`discussion.md`を同じ正本として混同しない | `prepare-design-record`の「記録に入るもの」 | ADAPT | D10 |

### ST-16 Step 3

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-074 | gate | resultと対応fileのidentityだけを検証し、内容を設計・重複reviewしない | `advance-roadmap`（子phaseの結果） | ADAPT | D3 |
| C-075 | gate | `tasklist_ready`の条件（三pathがrootを指し`roadmap.md`が無い） | `advance-roadmap` | ADAPT | D3 |
| C-076 | gate | `roadmap_ready`の条件 | `advance-roadmap` | ADAPT | D3 |
| C-077 | gate | `planless_complete`の条件（両planが無い、分類保留が無い、反映待ちとplan対象が`なし`、適用済み行にvalidationとdesign section） | `advance-roadmap` | ADAPT | D3 |
| C-078 | gate | plan resultはplanが自然言語合意済みで、TBD・未解消feedback・実装者へ残した設計判断が無い | `advance-roadmap` | ADAPT | D3 |
| C-079 | fallback | 矛盾・両plan併存・未解消feedback・zero state不成立なら同じdirectoryでtask-designを再開する | `advance-roadmap` | ADAPT | D3 |
| C-080 | 条件・禁止 | 保留したplugin改善のメモは、再開条件が成り立ちうる状態遷移の時だけ確かめ直す。依頼は元作業全体の完了時だけ、場所と完了記録・実証拠を渡す。ready照合後・再開時・executor停止時には依頼しない。返却resultだけで成立を通知しない。暫定指示の管理への通知とは区別する | `wrap-up.md`（plan無しの完了）、`execution-contracts.md`（tasklistの完了を確かめた起動する側）、`advance-roadmap`（roadmapの完了） | ADAPT | D12、D3 |
| C-081 | 順序・禁止 | ready result直後に実装・子の起動・planless完了へ進まず、Step 4を先に完了する | `wrap-up.md` | ADAPT | D12 |

### ST-17〜ST-21 必須gate

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-082 | 順序・禁止 | 三resultのどれでも返却直後に必ず実行。planでは開始確認より先、planlessでは完了報告より先。急ぐことを理由に省略しない | `wrap-up.md` | MOVE | D12 |
| C-083 | 順序 | 4-1〜4-3を三つとも見直してから提案を一度に示し、重なりを一つにまとめる。一往復の数と並べ方は`round-trip.md`。理由（見直しごとに示すと往復が増える） | `wrap-up.md` | MOVE | D12 |
| C-084 | action | `doc-enricher`を提案modeで、対象directory・関連file・設計の記録のpathを渡して実行する | `wrap-up.md`。「steering path」を設計の記録のpathへ | ADAPT | D12 |
| C-085 | 承認 | 提案があれば内容と適用先を示し、明示承認だけ適用。拒否・保留なら変更しない | `wrap-up.md` | MOVE | D12 |
| C-086 | 禁止 | task-design中にreview済みの同じoriginは重複提案せず、theme全体の最終safety netとして新しい候補だけ扱う | `wrap-up.md` | MOVE | D12 |
| C-087 | action・禁止 | 各議論basenameを解決し`read-discussion.md`で現在stateと必要logを取得する。full取得は全chunkで補う。共存・取得不能を未記録と扱わない | `wrap-up.md` | MOVE | D12 |
| C-088 | 判断質問・失敗例 | 三問（根本原因となる未共有の前提／codeで分かるか・設計意図か・process不足か／どこに書けば次回不要か）と各分岐の提案先、失敗例 | `wrap-up.md` | MOVE | D12 |
| C-089 | 規則 | 既存fileへ書くなら`naming/core.md`の範囲の照合を先に通す | `wrap-up.md` | MOVE | D12 |
| C-090 | 順序・理由・判断質問 | 特定した提案と承認判断はこのstepで完了させ、実装taskへ先送りしない。contextが熱い時点を逃すと理由が薄れる。自問の問い | `wrap-up.md` | MOVE | D12 |
| C-091 | action・禁止 | 今回の議論から「このsteering skill」の変更が必要かを確認する。不要なら変更しない。必要でも提案と変更を分け、合意後だけ適用 | `wrap-up.md`。「このtask-design skill」へ | ADAPT | D1、D12 |
| C-092 | 原則・例外 | 実行中のskill改善のinsightはcontextが熱いうちに提案してよい。Step 4は最終確認でtimelyな提案の代替ではない。提案は即時、変更は合意後。型は利益があるため存在し、精神を理解して良くする時だけ即時提案する。命令無視や改悪を正当化しない | `wrap-up.md` | MOVE | D12 |

### ST-22・ST-23 完了と実行開始の確認

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-093 | 禁止・出力 | planlessでは開始確認・executor・dispatchへ進まず、`design_path`、適用した変更とvalidationの要約、planを作らなかった理由、Step 4の結果を示して完了する | `wrap-up.md` | ADAPT | D12 |
| C-094 | action・参照 | 完了報告の前に変更を公開する。条件と方法は`tasklist-design.md`「実装後feedbackと公開action」に従い写さない。PRの作成で終わりmergeしない。escalate経由では`integrate-plugin-changes.md`へ。報告にPRのURLか公開しなかった理由を含める | `wrap-up.md` | ADAPT | D12 |
| C-095 | 順序 | plan resultではready result、主要成果物、Step 4の結果を示した後でのみ、実行開始の明示確認を自然言語で得る | `wrap-up.md` | ADAPT | D6 |
| C-096 | 分岐 | 明示確認があれば実行へ。拒否・保留・確認なしなら終了 | `wrap-up.md`。明示確認ならplanの種類に対応するskillを起動する。子phaseでは指示を結果に添えて`advance-roadmap`へ返す | ADAPT | D6 |
| C-097 | 禁止 | plan合意を実行開始の承認と読み替えず、`roadmap_ready`を受けたこと自体を子の実行の承認とみなさない | `wrap-up.md` | MOVE | D6 |
| C-098 | 禁止 | Step 3直後に「実装へ進みますか」と聞きStep 4を飛ばすことを禁止する | `wrap-up.md` | ADAPT | D6 |

### ST-24 6-1 leafの受け渡し

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-099 | action | `tasklist.md`と同階層の`design.md`の絶対pathを渡す | `execution-contracts.md`の起動する側が行うこと | ADAPT | D3 |
| C-100 | single writer | `tasklist-executor`だけがtasklistのsingle writer | 同上（executor側の既存規則と対応付ける） | ADAPT | D3 |
| C-101 | 規則 | 実測完了直後に`[x]`へ更新させ、最後にまとめて更新させない | 同上 | ADAPT | D3 |
| C-102 | 禁止 | executorは親roadmapを探索・更新せず完了resultだけを返す | 同上と`advance-roadmap` | ADAPT | D3 |
| C-103 | 禁止 | ユーザー動作確認の前にcommit・push・PRへ進ませない（二つの例外） | 同上 | ADAPT | D3 |
| C-104 | action・禁止・参照 | 合意済みのcommandを実行させる時は合意の原文とcommandの一覧をそのまま渡す。まだ無い承認や確かめを事実として書かない。止められた時は`blocked_commands.md` | 同上 | ADAPT | D3 |
| C-105 | 規則・理由 | どの停止理由で返っても返却resultだけで次を判断しない。`Blocker resolution`の一部ではない。正常停止も含めて常に行う | 同上 | ADAPT | D3 |
| C-106 | action | checkboxとnote、`artifact_directory`のrequest／resultを読み、`design.md`と食い違えば実装後のreviewへ回す | 同上 | ADAPT | D3 |
| C-107 | 根拠 | `execution-contracts.md`「状態の正本とsingle writer」に返却resultが含まれないこと | 同上（同じfile内の参照になる） | ADAPT | D3 |

### ST-25 6-2 roadmapの実行

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-108 | action | 依存DAGを読み、未着手かつ依存完了済みのphaseを選ぶ | `advance-roadmap` | ADAPT | D3 |
| C-109 | action | phaseの進み具合へ子steering pathをbindingする | `advance-roadmap`。子の設計の記録のpath（label「子の設計の記録」）。pathは子のtask-designが`prepare-design-record`で作るまで決まらないため、statusの更新と起動の後、task-designがPrepareStep 2で`working_dir`を返した時点でbindingする | ADAPT | D3、D11、D20 |
| C-110 | action | statusを`進行中`へ | `advance-roadmap` | MOVE | D3 |
| C-111 | action | 子へ四項目を渡す | `advance-roadmap`が子phaseのtask-designへ渡す | ADAPT | D3、D19 |
| C-112 | 構造 | 子steeringも自身のrootを`create_working_dir=false`で子task-designへ渡し、子は三resultのどれでも返せる | 子task-designは新しい作業として`prepare-design-record`で設計の記録を作る。三resultのどれでも返せる | CHANGE | D19 |
| C-113 | gate | leafは`tasklist-executor`の完了、compositeは全子の完了、planlessは子の共通gateと完了報告を確認する | `advance-roadmap` | ADAPT | D3 |
| C-114 | action・owner | 対応phaseのstatusと完了日だけを更新して次へ。子で生じた保留メモは子が完了時に確かめ直す | `advance-roadmap` | ADAPT | D3 |
| C-115 | gate | 全phase完了を全status `完了`と完了日で判定し、一段上へ伝播する | `advance-roadmap` | ADAPT | D3 |
| C-116 | 禁止・fallback | 更新できるのは子path・status・完了日だけ。他は直接編集せず同じdirectoryでtask-designを再開する | `advance-roadmap` | ADAPT | D3 |

### ST-26 standalone roadmapの昇格

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-117 | 入力・gate | 対象gate（repository内、basename形式、必須file、排他、未解消なし）とdestinationの一意な解決 | — | RETIRE | D1 |
| C-118 | gate | 移動前の安全gate（read-only確認、提示、明示承認、merge等の禁止） | — | RETIRE | D1 |
| C-119 | action | 承認後の一度だけの移動、pointer禁止、Step 3への合流 | — | RETIRE | D1 |

### ST-27 実装完了後review

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-120 | trigger・owner | 実装・review・validation・動作確認でfeedbackが判明したら、直接受領した担当が`implementation-feedback.md`を読み`facilitate-discussion`を`implementation_review.md`で明示適用する。steeringが受領したらsteering自身 | `execution-contracts.md`（起動する側）と`advance-roadmap` | ADAPT | D7 |
| C-121 | 順序・禁止 | 共通指示の処理を終えてから返された先のphaseへ戻る。記録せず直接designへ戻したり、実装を自動再開したりしない | 同上 | ADAPT | D7 |

### ST-28 Blocker resolution

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-122 | 定義・例外 | 自ら手を動かしてよいのは、Flowの実行条件が崩れFlowの内側で復旧できない`blocker`を解消する時だけ（`resolve-blocker`） | `tasklist-executor/blocker-resolution.md`（論点27で`execution-contracts.md`の起動する側から分けた）。「Flow」を起動する側の手順へ | ADAPT | D8、D27 |
| C-123 | 構造・理由 | Flowに並行する経路で、任意のstepから離脱して同じstepへ戻る（図）。番号を与えない理由（どのstepでも起こり得る、順序固定が崩れる） | 同上 | ADAPT | D8 |
| C-124 | 条件・理由 | 成立する2条件（設計を尽くした後、Flowの内側では復旧できない）。片方だけでは成立しない。片方ずつ欠けた時の扱い（designへ戻る、通常のtask失敗）。歯止めであること | 同上 | MOVE | D8 |
| C-125 | 禁止・判断質問 | 実行条件の回復だけを許容し、designで決めていないこと・design中に決められたこと・spikeで潰せたことを持ち込まない。問い | 同上 | MOVE | D8 |
| C-126 | 禁止・理由 | 解消してもtaskを進める目的にせず、checkboxは通常手順で確定する。抜け道にしない | 同上 | MOVE | D8 |
| C-127 | action・形式・理由 | 検知時に指示の有無に関わらず三択（a 止まる／b 離れて都度確認／c 離れて自走）を1回で問う。入れ子のyes/noにしない理由、aを先頭にする理由、5-2の形式を流用しない | 同上。5-2の参照は`wrap-up.md`の実行開始の確認へ | ADAPT | D8、D6 |
| C-128 | 禁止・基準 | cでも破壊的操作、repository外への影響、blocker解消に必要な範囲を超える変更は都度確認。基準の理由 | 同上 | MOVE | D8 |
| C-129 | 報告 | 離脱したstepへ戻る時に1回、四項目を報告。自走中に逐一報告しない理由 | 同上 | MOVE | D8 |
| C-130 | 順序・理由 | 回復したら離脱したstepの先頭へ戻り、次へ進めない理由 | 同上 | MOVE | D8 |
| C-131 | action・禁止 | 復帰時はstepを入口条件から実行し報告する。checkboxを復帰時に更新しない | 同上 | MOVE | D8 |
| C-132 | 記録先・理由 | 判明した事実は`<作業のdirectory>/subagent_report/`へ。追跡しない理由（合意の正本ではない） | 同上。`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/subagent_report/` | ADAPT | D8、D5 |
| C-133 | 設定 | 利用先は`steering/.gitignore.sample`を`.steering/.gitignore`へ複製する。`.sample`のままでは効かない | 同上。`prepare-design-record/.gitignore.sample`を`.design-records/.gitignore`へ | ADAPT | D8、D5、D11 |

### ST-29 絶対にやらないこと

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-134 | 禁止 | 許可なくtasklistを実行する | `wrap-up.md`（明示確認の前に起動しない） | ADAPT | D6 |
| C-135 | 禁止・例外 | steering自身が実装codeを変更しない。dispatchする。例外はBlocker resolution | `advance-roadmap`の禁止（例外は`execution-contracts.md`のBlocker resolution） | ADAPT | D3、D8 |
| C-136 | 禁止 | steering自身がtest・CIを実行しない | `advance-roadmap` | ADAPT | D3 |
| C-137 | 禁止 | 初回task-design起動前に実装設計・方向性・scope分解・plan種別を判断・提案する | `advance-roadmap`（子phaseのtask-design起動前） | ADAPT | D3 |
| C-138 | 禁止 | 初回task-design起動前に設計の曖昧さを`discussion.md`で解消する | `advance-roadmap` | ADAPT | D3 |
| C-139 | 禁止 | task-designの代わりにdesign・plan構造を設計・重複reviewする | `advance-roadmap` | ADAPT | D3 |
| C-140 | 禁止 | task-design専用子directory、`task_design_dir`探索、`steering.json`を作る | `prepare-design-record` | ADAPT | D11 |
| C-141 | 禁止 | roadmapの各phaseの計画をruntime都合で直接変更する | `advance-roadmap` | MOVE | D3 |
| C-142 | 禁止 | `tasklist-executor`へ親roadmapを探索・更新させる | `advance-roadmap` | MOVE | D3 |
| C-143 | 禁止 | standalone bundleを明示承認前に移動する | — | RETIRE | D1 |
| C-144 | 禁止 | tasklist合意前に実装し、動作確認前にcommit・push・PR（二つの例外）。push・PR前にlocal commitが一件以上あることを確認する | `execution-contracts.md`の起動する側、`wrap-up.md`（plan無しの公開） | ADAPT | D3、D12 |
| C-145 | 禁止 | 必須gate・利用者確認を飛ばして自動で次工程へ | `wrap-up.md` | MOVE | D12 |
| C-146 | 禁止 | `planless_complete`を未完了として戻す、開始確認・executor・子へdispatchする | `wrap-up.md` | MOVE | D12 |
| C-147 | 禁止 | `planless_complete`を理由に必須gateを省略する | `wrap-up.md` | MOVE | D12 |

### ST-30 合意済みの明示廃止

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-148 | 履歴・guard | task-design専用子directoryと`task_design_dir`探索は廃止した | — （禁止はC-140が持つ） | RETIRE | D24 |
| C-149 | 履歴・guard | tasklistから親roadmapを更新する契約は廃止した | — （禁止はC-142と`tasklist-executor`が持つ） | RETIRE | D24 |
| C-150 | 履歴・guard | steeringがtasklist・roadmapを設計・再reviewする契約は廃止した | — （禁止はC-139が持つ） | RETIRE | D24 |
| C-151 | 履歴 | feedback件数による新steeringの自動起動は廃止した | — | RETIRE | D24 |
| C-152 | 履歴・規則 | `全フェーズ完了日`と`計画と実績の差分`fieldは廃止し、全体完了はstatus・完了日から導出し、逸脱は`implementation_review.md`へ | `advance-roadmap`（全体完了の導き方）。`implementation-feedback.md`にも同じ規則がある | ADAPT | D3 |
| C-153 | 規則 | 上記以外の旧steeringの意味単位はmigration ledgerに従う | — （この対応表が持つ） | RETIRE | D24 |

### ST-31 元作業の完了の通知

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-154 | 条件・禁止 | 単独で完了ownerを担い完了条件を満たした時だけ、完了記録と場所を`maintenance-plugin-context`へ渡す。別ownerが続けるなら結果を返す。呼出しの終了等は完了ではない。追加の承認gateを設けない | `advance-roadmap`（roadmap全体の完了）。`prepare-design-record`は完了ownerにならない | ADAPT | D3、D11 |

### IF・GI・SR

| ID | 種類 | 原文が生む判断・挙動 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- | --- |
| C-155 | file | `implementation-feedback.md`のsteeringを名指さない行 | `tasklist-executor/implementation-feedback.md`の同じ行。相対linkは同じ深さのため変わらない | MOVE | D7 |
| C-156 | 担当 | 3行目「steeringまたはtasklist-executorが…直接受領した時に読む」 | 「`tasklist-executor`、またはそれを起動する側（利用者の会話のagent、`advance-roadmap`）が…」 | ADAPT | D7 |
| C-157 | 担当 | 10行目「steeringが直接受領した場合はsteering自身が行い」 | 「起動する側が直接受領した場合は起動する側自身が行い」 | ADAPT | D7 |
| C-158 | 戻り先 | 34行目「roadmapの子path、status、完了日だけが変わる: steering runtimeで更新する」 | 「…: `advance-roadmap`が更新する」 | ADAPT | D7、D3 |
| C-159 | 設定 | `.gitignore.sample`の三つのpatternと理由のcomment（「steering ディレクトリ」「steering working directory」） | `prepare-design-record/.gitignore.sample`。commentの語を「設計の記録のdirectory」へ | ADAPT | D11 |
| C-160 | 記録 | このrepositoryの`.steering/`の全file | `.design-records/`へ`git mv`。中身は変えない | MOVE | D14 |

## 移行で足す能力

| ID | 能力 | destination | 分類 | 合意 |
| --- | --- | --- | --- | --- |
| A-001 | `.steering/`があり`.design-records/`が無い時、移すことを利用者へ提案し、承認されたら一度だけ`git mv`する。両方ある時は確かめる | `prepare-design-record` | ADD | D14 |
| A-002 | `.steering/…`を`.design-records/…`として読む記録と、その`breaking_changes/`のREADME。記録は移し方の手順の正本を持ち、A-001はそれを参照する | `prepare-design-record/breaking_changes/` | ADD | D16、D25 |
| A-003 | 記録の対象を「見出し・labelの名前や、置き場所のpath」へ広げる | `maintenance-plugin-context/SKILL.md`「Plugin version」 | CHANGE | D16 |
| A-004 | roadmapの見出し・labelの切り替えと、その記録 | `task-design/templates/roadmap.md`、`task-design/templates/breaking_changes/` | CHANGE / ADD | D20 |
| A-005 | 新しい作業でtask-designが`prepare-design-record`を呼ぶ。単独起動でも同じ置き場所 | `task-design`のPrepareStep 2 | CHANGE | D1、D19 |
| A-006 | 変更を伴わない調査の設計のように、task-designを通さない作業からも`prepare-design-record`を呼べる | `prepare-design-record`の起動条件 | ADD | D11 |
| A-007 | repository固有文脈の表と節の`steering`を`advance-roadmap`へ移し、Branch/issue契約等の文面を書き換える | `maintenance-plugin-context/SKILL.md`、`skills/tumeda-dev-plugin-context.md` | ADAPT | D21 |
| A-008 | 旧`task-design/SKILL.md` PrepareStep 2の`create_working_dir=true`の手順4「同名pathが存在する場合はsuffix追加や上書きをしない」と、手順1「親ディレクトリが存在しなければ推測で作らず」 | `prepare-design-record`の手順5（同名pathで停止）、`task-design`の新しい作業の手順2（停止した理由を返し、推測で別の置き場所を作らない） | ADAPT | D11、D19 |
| A-009 | `.steering/`を移すことを利用者が承認しなかった時は、移さず、新しい記録も作らずに止まり、呼出し元へ返す | `prepare-design-record`の手順1 | ADD | D26 |
| A-010 | 両方あり`.steering/`に追跡されたfileが無い時は、残ったfileを`.design-records/`の同じ相対pathへ移すことを提案し、承認されたら移して空のdirectoryと`.steering/`を消す。fileは消さない。追跡されたfileが残る時は止まる | `prepare-design-record/breaking_changes/20261123-move-steering-to-design-records.md`の「移し方」（正本）、`prepare-design-record`の手順1（参照） | ADD | D28 |

## white-box照合の記録

### 順方向

`KEEP | MOVE | ADAPT | ADD | CHANGE`の全ID（C-001〜C-160のうち`RETIRE`だけの12件とC-009・C-155・C-160を除く145件、A-001〜A-007）について、destinationのfileに対応する文があることを、IDごとに一つ以上の照合語で確かめた（173件、不一致0）。照合語だけでは意味の保存を言えないため、移した節は通読して、条件・理由・例・失敗例・判断の問いが残っていることを確かめた。

- 照合の途中で、C-039（同じfeatureの追加taskは既存tasklistへ追記する、tasklistはfeatureのchecklist）とC-046（tasklistのcommit sectionから記録の順序の規則を参照する）が`tasklist-design.md`へ移っていないことを見つけ、足した。
- C-155は、`git diff -M`で`implementation-feedback.md`の変化がC-156〜C-158の3行だけであることを確かめた。
- C-160は、`git mv`のrenameだけで、記録の中身を変えていないことを確かめた。

### 逆方向

`steering/SKILL.md`の削除行は1〜510行がST-01〜ST-31で覆われている。追加行を新しいfileごとに読み、対応するIDを引いた。対応が無かった追加は次の二つで、どちらも扱いを決めた。

- 読み替えの記録の「移し方」に足していた、`.gitignore`を見本で補う手順と、このrepositoryの`.design-records/.gitignore`への追記。論点25の決定に無いため、取り除いた。
- `prepare-design-record`の、移すことを承認されなかった時の扱い。A-009として、論点26で合意を取る。
- 旧task-designの入力の手順から移した行（同名pathで止まる、推測で別の置き場所を作らない）は、A-008として足した。

### 境界

利用者の会話のagent、task-design、`wrap-up.md`、`tasklist-executor`を起動する側、`advance-roadmap`を合わせて、plan無し・tasklist・roadmapの三つの経路を辿った。

- plan無し: task-designがPrepareStep 2で`prepare-design-record`を呼び、設計し、Step 6の後に`wrap-up.md`で締めくくりの確認、公開、完了報告へ進む。実行開始の確認とexecutorの起動は無い。
- tasklist: `wrap-up.md`で締めくくりの確認の結果を示した後に実行開始を確かめ、明示確認があれば起動する側が`tasklist-executor`を起動する。止まるたびにtasklistとartifactを読み直し、`blocked`ならBlocker resolution、feedbackなら`implementation-feedback.md`へ進む。
- roadmap: `advance-roadmap`がstatusを進行中にして子phaseのtask-designを起動し、`working_dir`が返った時点で子の設計の記録をbindingし、結果を確かめ、子が添えた明示確認がある時だけplanを実行させ、status・完了日を書く。
- この照合で、`advance-roadmap`の手順がbindingを子のtask-designの起動より前に置いていたことを見つけた。pathは子のtask-designが`prepare-design-record`で作るまで決まらないため、`working_dir`が返った時点へ並べ替えた（C-109）。
- 単一のwriter: tasklistは`tasklist-executor`、roadmapの進み具合は`advance-roadmap`、`summary.md`は翌月初の`summarize-previous-month.md`だけ。

### 集計

```text
適合 145 / 合意済み追加 5（A-001、A-002、A-004の記録、A-006、A-009は論点26で合意待ち） / 合意済み変更 9（C-025、C-056、C-063、C-068、C-112、A-003、A-004の見出し、A-005、A-007） / 明示廃止 12 / 未監査 0 / 未分類削除 0 / 未分類追加 0（A-009は論点26の応答待ち）
```
