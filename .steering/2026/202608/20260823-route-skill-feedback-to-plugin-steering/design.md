# Design: 利用先repositoryで生じたplugin成果物の修正提案を、正本repositoryのsteeringへ引き渡す

<!--
このfileはpluginの公開配布物に含まれる。`maintenance_policies/migration.md`に従い、
利用先repositoryの名称、所有者名、絶対path、固有ドメイン名、固有steering slugを書かない。
参照元は「利用先repository」等の総称で書く。
-->

## 元の依頼内容

ai_agent_dev_skill_plugin 内のpluginのスキルに、consumer側からのスキル修正提案を立てられたら、steeringスキルを起動して、ai_agent_dev_skill_plugin 側でdiscussionをハンドリングするっていうものを立てたい。これ自体も、ai_agent_dev_skill_plugin 側のsteeringで行いたい。mainから新しいブランチも切る。全部収束したら、バージョンアップ含めたコミット計画を立てて、合意されたらai_agent_dev_skill_plugin 側でコミットして、ブランチpushして、ローカル側でmainのマージして、mainもpushする

追加の指示:

- 記録が一時的に誤っていても、結果整合で最終的に正しくなればよい。既commit分の是正は履歴rewriteではなく後続の変更で行う。
- `maintenance_policies/migration.md` との棲み分けも、このsteeringのトピックに含める。
- `SKILL.md` は手書きせず `skill-creator` skill を適用して作成する。

---

## 1. TL;DR

利用先repositoryでskillを実行中にこのpluginの成果物への修正提案が生じたとき、それを正本repositoryへ引き渡すownerが存在しない。存在しないため、直近の実例では利用先repositoryで議論を合意まで進めてから手作業で移設することになり、論点採番の衝突、ユーザー発言の原文改変、`migration.md`が要求する固有情報除去の未実施が同時に起きた。新skill `escalate-plugin-skill-fix` を新設してこの引き渡しを所有させ、その`description`をhostのdiscovery機構として使うことで、提案が生じた瞬間に起動されるようにする。

---

## 前提とする既存仕様

### 修正提案の「検出」側は既に存在する

- `facilitate-discussion` の `2.1.1`: 原因ownerを`成果物固有 | repository知識 | skill`へ分類し、`skill`なら対応skillの修正を主decisionとして合意する。
- `task-design/SKILL.md` の `skill / docs 改善が必要になったとき`: contextが熱いうちに候補を`facilitate-discussion`へ渡す。
- `steering/SKILL.md` の `Ready result後の必須gate` 4-2・4-3、および `ファインプレー即時記録の原則`。
- `steering/SKILL.md` の `実装完了後review`: feedbackを受け取ったworkflow ownerが**同じworking directory**で`implementation_review.md`へ記録する。この「同じworking directory」は単一repositoryを前提にしている。

いずれも修正提案の検出と議論の進行を規定するが、**どのrepositoryで扱うかを規定していない**。

### `maintenance_policies/migration.md` が既に所有している契約

- 適用対象に「consumerリポジトリでの改善の逆輸入」を含む。
- `リポジトリ固有情報の除去（移植・追随時 MUST）`: 社名、リポジトリ名、絶対path、固有ドメインモデル名、固有の外部サービス名、参照元のcommit hash・PR番号・issue番号を抜く。このpluginが公開配布物であり、参照元が非公開repositoryのことがあるため。
- 適用範囲に `.steering/` 配下の成果物とdirectory名（slug）を含む。
- `セルフチェック`: commit前にgrepで参照元固有情報がヒットしないことを確認する。

### 配布versionと検証

`maintenance-plugin-context` が配布version規約を所有する。SemVerの`MAJOR.MINOR.PATCH`だけを使う。破壊的変更はMAJOR、後方互換な機能追加はMINOR、後方互換な修正・文書変更はPATCH。version bumpは宣言値四箇所と検査期待値一箇所の計五箇所を一度に変える。

- `plugins/tumeda-dev/.codex-plugin/plugin.json` の `version`
- `plugins/tumeda-dev/.claude-plugin/plugin.json` の `version`
- root `.claude-plugin/marketplace.json` の `version`
- root `.claude-plugin/marketplace.json` の `plugins[]` 内 `tumeda-dev` の `version`
- `scripts/verification/validate-plugin.mjs` の `expectedRelease`

現在のrelease versionは `7.1.0`。

### 実測で確定した環境事実

- **skill内容はsession開始時にcacheされる。** 本steeringの実行中に、plugin skillのfileを変更してcommitした後で同じskillを起動したところ、変更前の内容が返った。disk上は変更後だった。利用先repositoryのsessionでplugin skillを直しても、そのsessionは旧版のskillで動き続ける。
- **正本repositoryの `.agents/skills` は `plugins/tumeda-dev/skills` へのsymlinkである。** そのため`<git-root>/.agents/skills/tumeda-dev-plugin-context.md` は、利用先repository用のcontext instanceではなく配布template実体へ解決される。`maintenance-plugin-context` の解決手順を正本repositoryで実行し、instanceが存在するものとして書き込むと、全利用先へ配布されるtemplateを汚染する。

### 直近の実例で観測された事故

利用先repositoryで`steering` → `task-design`を実行中、assistantがprocess違反を起こし、その原因追跡からplugin skillの修正提案が生じた。実際に取った経路と結果は次のとおり。

1. 利用先repositoryのsteering directoryの`discussion.md`で議論を合意まで進めた
2. 合意ごとに正本repositoryのskill fileへ変更を適用した。この時点で変更の根拠は利用先repositoryにしかなかった
3. 全合意後、その`discussion.md`を正本repository側の既存steeringの`implementation_review.md`へ手作業で移設した
4. 移設先に既存の記録があり番号が衝突したため、採番し直した
5. 採番し直しの際、ユーザー発言の引用ブロック内の番号まで一括置換し、原文を改変した。検証時に気づいて復元し注記を追加した
6. 移設後の内容に利用先repository名とその固有slugが三箇所残ったままcommitした。`migration.md`のセルフチェックを実行していなかった

三つの事故はいずれも、記録先が二箇所に分かれ移設が手作業になったことから派生している。

---

## 2. 要件（Requirements）

### MUST（必達）

- 利用先repositoryでこのpluginの成果物への修正提案が生じたとき、agentが現在のdiscussion fileで議論を続けず正本repositoryへ移ることが、hostのdiscovery機構によって担保される。
- 引き渡しのownerが一意に存在し、そのownerが正本判定と引き渡し内容の取り出しを行う。
- 既に他ownerが所有する契約（固有情報除去、配布version規約、議論の進行、設計と実装のorchestration）を複製しない。
- skillを増やしたことが `skills/README.md` の階層構造へ反映される。
- 配布versionが宣言値四箇所と`expectedRelease`で揃う。

### SHOULD（できれば）

- 直近の実例の三つの事故が、完成後のworkflowでは構造的に発生しないことを説明できる。
- 既commit分の`implementation_review.md`に残る利用先固有情報が除去される。

### MAY（あれば嬉しい）

- なし。

### 非目標

- `docs/common_standard/function_migration_policy.md` が所有するbaseline、二層ledger、white-box検証手順の変更。
- `maintenance_policies/migration.md` の内容変更。固有情報除去と意味保存の正本であり続ける。
- 配布version規約そのものの変更。
- `facilitate-discussion/SKILL.md` の変更。
- skill内容のsession cacheという挙動自体の解消。host側の仕様でありpluginから変更できない。workflow側で前提として扱う。
- 利用先repository側のfileの変更。
- 既にcommit済みの固有情報について、git履歴のrewriteによる除去。結果整合での是正とする。
- **正本repositoryの `.agents/skills` symlinkによるtemplate汚染への対処。** 上記「実測で確定した環境事実」に記録した既知の欠陥だが、本steeringが定めるrouting workflowとは独立した`maintenance-plugin-context`の解決手順の問題である。別途扱う。

### 受け入れ基準

- 新skillの`description`だけを読んで、どの場面で起動すべきかが判断できる。
- 完成後のworkflowを読み、直近の実例の各stepについて「本来どのrepositoryのどのfileへ、誰が記録すべきだったか」を一意に答えられる。
- 新skillと既存owner（`facilitate-discussion` / `migration.md` / `maintenance-plugin-context` / `steering`）のどちらを読んでも同じ判断が同じ結論になり、記述の重複がない。
- `node scripts/verification/validate-plugin.mjs` が成功する。
- 正本repositoryへ追加・変更した全fileに対する`migration.md`のセルフチェックgrepが、利用先固有情報を検出しない。

---

## 3. 完成後の姿

### workflow

**ownerと責務:**

| owner | 判断・更新するもの | 行わないこと | single source of truth |
| --- | --- | --- | --- |
| `escalate-plugin-skill-fix` | 現在のrepositoryが正本かの判定、引き渡す提案内容の取り出し、正本repositoryを作業対象とした`steering`の起動 | 議論の進行、設計と実装、固有情報除去規約の定義、配布versionの決定 | 自身の`SKILL.md` |
| `facilitate-discussion` | 議論の進行、提案、feedback、決定の記録 | 記録先repositoryの決定 | 指定されたdiscussion file |
| `maintenance_policies/migration.md` | 正本repositoryへ入る内容からの固有情報除去と意味保存 | routing、議論の進行 | policy document |
| `maintenance-plugin-context` | repository context、配布version規約 | routingの手順 | 自身の`SKILL.md` |
| `steering` | 正本repositoryでの設計と実装のorchestration。`migration.md`のセルフチェック、配布version五箇所の更新、`validate-plugin.mjs`による検証を実装scopeへ含める | 引き渡しの判定 | 正本repositoryのsteering directory |

`escalate-plugin-skill-fix` の`description`が、hostのdiscovery機構に対する唯一のtriggerである。

**状態と遷移:**

```text
plugin成果物への修正提案が生じた
  --{descriptionマッチ / host}--> escalate-plugin-skill-fixが起動
escalate-plugin-skill-fixが起動
  --{Git rootが正本}--> 正本repositoryでsteeringを起動（本skill終了）
escalate-plugin-skill-fixが起動
  --{Git rootが正本以外}--> 提案内容を固有情報なしで取り出す
提案内容を取り出した
  --{正本repositoryを作業対象に指定}--> 正本repositoryでsteeringを起動
正本repositoryでsteeringを起動
  --{steeringの通常flow}--> task-design / facilitate-discussion / 実装
利用先側
  --{参照だけ残す}--> 利用先のdiscussion fileは参照で終わる
```

**必須順序とhandoff:**

`escalate-plugin-skill-fix` が所有するのは、引き渡しが完了するstep 6までである。

1. plugin成果物（skill、docs、template、script）への修正提案が生じる。`escalate-plugin-skill-fix` が`description`マッチで起動する。起動条件は「修正提案が生じた」という観測可能な行為だけである。
2. `escalate-plugin-skill-fix` が現在のGit rootを観測し、正本repositoryかを判定する。
3. 正本であれば、そのまま`steering`を起動して本skillは終了する。
4. 正本以外であれば、提案の内容、必要性の実例、根拠を、利用先固有情報を除いた形で取り出す。除去の規約は`migration.md`が正本である。
5. 作業対象を切り替える。working directoryを正本repositoryへ移し、既定branchから作業branchを切る。`steering`は起動時のworking directoryを基準に`.steering/`を解決するため、この移動が`steering`へ作業対象を伝える唯一の手段である。
6. 利用先repositoryのdiscussion fileへ、正本repositoryで扱う旨、正本側steering directoryのbasename、引き渡した提案の要旨一行を残す。`steering`を起動して本skillは終了する。

step 6以降は`steering`の通常flowが所有する。設計、議論、実装に加えて、commit前の`migration.md`セルフチェック、配布version五箇所の更新、`node scripts/verification/validate-plugin.mjs` による検証を、その実装scopeへ含める。

**失敗・取消・再開:**

| 条件 | 停止するowner | 維持するstate | 再開入口 |
| --- | --- | --- | --- |
| Git rootを取得できず正本判定ができない | `escalate-plugin-skill-fix` | 引き渡し前。提案は利用先のsessionに残る | ユーザーから正本repositoryのpath提示を得る |
| 固有情報を除去すると意味が保存できない | `escalate-plugin-skill-fix` | 取り込み前。`migration.md`の規定により停止する | context instanceへの外出し、または意味を維持する`ADAPT`の合意 |
| 引き渡し後にskillを変更したが、実行中のsessionが旧版で動く | なし | skillはdisk上で更新済み | 新しいsessionで起動する |
| 利用先で既に議論を開始していた | `facilitate-discussion`（利用先側） | 利用先の議論は途中で止まる | その時点で正本repositoryへ移し、利用先には参照を残す |

四つ目は、合意まで進めてから移設する経路を断つためにある。移設は記録の採番衝突、ユーザー発言の原文改変、利用先固有情報の残存を生む。

**引き渡し後の前提:**

- 利用先の元taskは中断したまま残り、正本repository側の作業が終わってから戻る。
- 修正したskillは、実行中のsessionへ反映されない。skill内容はsession開始時にcacheされる。
- 元taskを旧版のskillのまま続行するか、新しいsessionで再開するかは、ユーザーが選ぶ。

**設計意図: 起動gateを「修正提案が生じた」だけにする**

正本判定はskill本体の`## 正本repositoryの判定`が所有する。起動条件へ正本判定を含めると、判定を誤った経路がskillへ到達せず、この設計が塞ごうとしている到達性の問題が形を変えて再発する。起動は広く、判定は内側で行う。

**設計意図: triggerをskillの`description`へ置く**

`description`はhostのdiscovery機構そのものであり、提案が生じた瞬間に評価される。ここへ起動条件を置けば、検出側のskillが供給側の知識を持たずに到達性が成立する。`facilitate-discussion`はrepositoryを問わず使う汎用skillであり、利用側の道具である。そこへ「このpluginの正本repository」という供給側の知識を持ち込む案も検討したが、依存方向が逆流するため採らなかった。

### 新設・変更するfile

```text
plugins/tumeda-dev/skills/
├── escalate-plugin-skill-fix/
│   └── SKILL.md                   ← 新規作成（skill-creatorを適用）
├── maintenance-plugin-context/
│   └── SKILL.md                   ← ## Maintenance policies へpointer1行
└── README.md                      ← ## 階層構造 へ1行
```

`SKILL.md` の見出し構成:

```text
# Escalate plugin skill fix
├── ## 目的と成果
├── ## 起動gate
├── ## 正本repositoryの判定
│   ├── ### 判定方法
│   └── ### 正本だった場合
├── ## 正本でない場合の引き渡し
│   ├── ### 引き渡す内容
│   ├── ### 作業対象の切り替え
│   ├── ### 起動するもの
│   └── ### 利用先側に残すもの
├── ## 引き渡し後の前提
├── ## 責務境界
└── ## このskillが絶対にやらないこと
```

`description` が満たす要件:

- 起動条件を「このpluginのskill、docs、template、scriptに対する修正提案が生じた時」と観測可能な行為で書く
- 起動条件は上記だけとし、正本判定はskill本体へ委ねる
- 通常の設計議論と、利用先repository自身のcode修正を起動対象から外すことを明示し、過剰起動を抑える

`maintenance-plugin-context/SKILL.md` の `## Maintenance policies` へ追加する1行:

> 利用先repositoryでこのpluginの成果物への修正提案が生じた場合の引き渡しは`escalate-plugin-skill-fix`が所有する。修正の議論と変更は正本repositoryで行う。

`skills/README.md` の `## 階層構造` へ追加する1行:

> - **escalate-plugin-skill-fix** — 利用先repositoryで生じたこのpluginの成果物への修正提案を、正本repositoryの`steering`へ引き渡すrouting skill。

### 命名の根拠

`escalate-plugin-skill-fix` とする。利用先で生じた修正提案を供給側の正本repositoryへ上げる方向を `escalate` が表す。

`maintenance-plugin-context` が既にあるため、`plugin-skill-maintenance` のような名前は名前空間が近く、配布version規約とrepository contextを持つ既存skillとの区別がつかない。

---

## 4. リスクと対策

| リスク | 対策 |
| --- | --- |
| 新skillが`migration.md`と重複し、固有情報除去の正本が二つになる | 新skillは除去規約を持たず参照だけにする。責務境界を`SKILL.md`の`## 責務境界`へ明示する |
| 新skillが`steering`の設計・実装processを再実装する | `## このskillが絶対にやらないこと`へ、専用の設計・実装processを持たないことを明示する |
| `description`がdiscoveryで拾われず、到達性が担保されない | 起動条件を観測可能な行為で書き、正本判定を起動条件へ含めない。通常の設計議論では起動しないことも書き、過剰起動と過少起動の両方を抑える |
| version bumpが五箇所のうち一部だけになり`plugin validation failed`になる | `node scripts/verification/validate-plugin.mjs` を実行して検証する |
| 正本repositoryへ入る成果物へ利用先固有情報が残る | commit前に`migration.md`のセルフチェックgrepを実行する |

---

## 5. テスト方針

- `node scripts/verification/validate-plugin.mjs` を実行し、version宣言値四箇所と`expectedRelease`の整合を確認する。
- 正本repositoryへ追加・変更した全fileに対し、`migration.md`のセルフチェックgrepを実行する。検出語は利用先repository名、所有者名、絶対path、利用先固有のドメイン名、利用先固有のsteering slug。
- 完成後のworkflowを直近の実例へ当てはめ、三つの事故が構造的に発生しないことを机上で確認する。

| 実例で起きたこと | 完成後の帰結 |
| --- | --- |
| 記録の採番が移設先の既存記録と衝突した | 最初から正本repositoryへ記録するため移設が発生せず、衝突しない |
| 採番し直しの際にユーザー発言の引用内の番号まで置換し原文を改変した | 採番し直し自体が発生しない |
| 利用先repository名と固有slugを残したままcommitした | 正本repositoryで書き始めるため書く時点から総称で書く。加えてcommit前のセルフチェックが要求される |

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

なし

### task-design内の対象成果物反映待ち

なし

### execution plan対象

| 対象 | 掲載理由 | 参照するdesign section |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/escalate-plugin-skill-fix/SKILL.md` | このrepositoryが利用者へ届ける本番成果物そのものの新設。`skill-creator`適用というユーザー指定の実施手段があり、作成後に実file自体のreviewを要する | [workflow](#workflow) / [新設・変更するfile](#新設変更するfile) |
| `plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md` | 本番成果物の変更。新skill確定後でないと参照先が定まらない順序依存がある | [新設・変更するfile](#新設変更するfile) |
| `plugins/tumeda-dev/skills/README.md` | 本番成果物の変更。同上の順序依存がある | [新設・変更するfile](#新設変更するfile) |
| 配布version五箇所（宣言値四箇所と`expectedRelease`） | 本番成果物の配布設定。変更範囲が確定してから互換性区分を決める順序依存があり、validatorによる独立した検証単位を持つ | [配布versionと検証](#配布versionと検証) |
| `.steering/2026/202608/20260801-extract-discussion-workflow-skill/implementation_review.md` の利用先固有情報除去 | 既commit分の是正。ユーザー指定により結果整合で行う | [直近の実例で観測された事故](#直近の実例で観測された事故) |
| commit、branch push、mainへのmerge、main push | ユーザーが実行順序を明示した段階作業 | [元の依頼内容](#元の依頼内容) |

### ユーザメモ
この仕組みでうまくいかなかった、steeringに移った後に利用元リポジトリに戻らないとか、コミットの手順がおざなりとか、最終的にmainに戻ってないとかpushしてないとかあったら、
このスキル固有のテンプレートを作り、そのチェックリストをsteeringディレクトリに差し込んで、design.mdとかに、終了後にその作成されたファイルに戻るとかを注入することとかを解決の選択肢に入れる

