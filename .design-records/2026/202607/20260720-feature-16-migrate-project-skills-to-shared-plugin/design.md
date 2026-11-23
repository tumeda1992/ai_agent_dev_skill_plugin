# Design: x_favorites のスキルを共有 plugin へ移行

## 元の依頼内容

steeringスキルを使って、今 x_favorites が独自で持っているスキルを ai_agent_dev_skill_plugin に移して、他のリポジトリでも使えるようにしたいと思っている。その際に x_favorites 独自の例がスキルに直書きされいる場合は一般的な例にしたい。スキルがリポジトリ固有のドキュメントを参照させる際は引数で受け取るようにしたい

---

## 1. TL;DR

`x_favorites/.agents/skills/` の 5 スキルと、`.claude/agents/` の 3 agent 由来 skill を、`ai_agent_dev_skill_plugin` の `tumeda-dev` plugin を唯一の正本として管理する。共有可能な手順は skill 本文に残し、X/Notion、MealFrame、固定ファイルパス、固定実行コマンドなどのリポジトリ文脈は一般例または repository 内の context instance へ分離する。

これにより、別リポジトリでも同じスキルを使いつつ、対象リポジトリの規約・ドキュメント・検証コマンドだけを明示的に与えられる。移行後は plugin を検証し、既存 marketplace 経由で cachebuster を更新して再インストールし、新規スレッドで読み込みを確認する。

## 前提とする既存仕様

- `x_favorites/.agents/skills/`: `think-through`、`steering`、`task-design`、`doc-enricher`、`design-consult` の 5 スキルと、`steering`・`task-design` のテンプレートを持つ。
- `x_favorites/.claude/agents/`: `visual-inspector`、`tasklist-executor`、`test-runner` の 3 agent 定義を持つ。非同期実行が必要だった手順を plugin skill に移す。
- `x_favorites/.agents/plugins/marketplace.json`: `./.agents/plugins/local_plugin_sym_links/ai_agent_dev_skill_plugin/` を local source として参照する。
- `local_plugin_sym_links/ai_agent_dev_skill_plugin`: `/Users/takahiroumeda/src/github.com/tumeda1992/ai_agent_dev_skill_plugin` への symlink。
- `ai_agent_dev_skill_plugin/.codex-plugin/plugin.json`: `skills: "./skills/"` を宣言し、現在は `skills/hello/` のみを提供する。
- 現在の skill 本文には、X/Notion、MealFrame、`backend/docs/...`、`frontend/docs/...`、`.claude/...`、`docker compose` など、x_favorites 固有の参照が混在する。

---

## 2. 要件（Requirements）

### MUST（必達）

- 8 移行skill、`maintenance-plugin-context`、それらが実行時に読むtemplateを `tumeda-dev` plugin 内で完結させ、既存`hello` skillを削除する。完成時の提供skillは9個とする。
- x_favorites の `.agents/skills/tumeda-dev-plugin-context.md` を、最初の repository context instance として作成する。
- x_favorites の host設定から旧 skill / agentを参照する経路を更新し、Claude Code と Codex の双方でplugin skillが起動することを確認してから旧定義を退役する。
- 共有スキルから、x_favorites 固有の業務例・固定ドキュメントパス・固定実行環境を取り除く。
- リポジトリ固有ドキュメントを使う必要がある skill は、`.agents/skills/tumeda-dev-plugin-context.md` から、明示参照された項目だけを受け取る。
- context instance にない文書・コマンドを、共有 skill が固定パスから暗黙に読まない。
- `steering`だけがmaintainerから返された`## steering / ### GitHub`により、ユーザー動作確認後の外部公開actionをtasklistへ生成する。GitHub未記載ならcommit・push・PR作成をskipし、GitHubありならpreflight・commit・push・plugin内adapterによるPR作成を含める。GitHub以外のproviderは今回のscope外とする。
- 移行後に plugin 構造を検証し、Codex が更新版を読み込める再インストール手順を実行・確認する。

### SHOULD（できれば）

- x_favorites 側に同一内容の skill を残さず、将来の二重管理を防ぐ。
- 各 skill が同じ context instance の選択的参照規則を使い、他リポジトリでも文脈の読み取り方が揺れないようにする。
- 既存例の教育的な役割を保ち、抽象論だけの skill にしない。

### 非目標

- `tumeda-dev` 以外の plugin の統合・再編。
- x_favorites のプロダクトコード、テストコード、アプリケーション設定の変更。
- marketplace の source を別ディレクトリへ移す変更。既存 symlink は plugin 実体を指している。

### 受け入れ基準

- plugin の `skills/` 配下だけで、8 移行skill、`maintenance-plugin-context`、必要templateが解決できる。
- plugin の提供skillは、8 移行skillと`maintenance-plugin-context`の9個だけであり、`hello`は残らない。
- skill 本文を検索しても、x_favorites の固有ドメイン・固定パス・固定実行コマンドが残らない（一般例または context instance の記載例を除く）。
- context instance で明示参照された文書だけを必須参照し、instance 不在・項目未記載時の挙動が各該当 skill に明記される。
- x_favorites 初期 context instance は、正本ドキュメント・設定・remote で確認した stable facts のみを持つ。矛盾・欠損した旧 agent 記述を転記しない。
- Claude Code / Codex の各hostで、think-through常時適用と移行skillの起動を確認した後にだけ、`.claude/skills` symlinkと旧 `.claude/agents` 定義を削除する。
- plugin 検証と再インストール後の新規スレッドで、移行した skill が発見・起動できる。

---

## 3. 完成後の姿

### 3-1. 操作フロー

**ケース: 別リポジトリで共有 skill を使う**

1. 利用者が `tumeda-dev:steering` などの共有 skill を起動する。
2. repository固有文脈が必要なskillは`maintenance-plugin-context`へ必要理由・必要fact・確認元候補を渡す。maintainerが返した許可範囲だけを読む。
3. skillはcontext instanceにない固定pathを推測して読まない。maintainerがGit root、template、書込み可能な確認済みfactを得られない時は`unavailable`を返し、skillは一般手順へ縮退するか必要入力を求める。
4. skill は対象リポジトリ固有の文脈を、設計・調査・検証結果へ明示的に記録する。

**ケース: x_favorites の skill 正本を更新する**

1. 保守者が `ai_agent_dev_skill_plugin/skills/` の正本を編集する。
2. plugin 内の validation を実行し、8 移行skill、`maintenance-plugin-context`、template相対参照を確認する。
3. cachebuster を更新し、`x-favorite-plugins` marketplace から `tumeda-dev` を再インストールする。
4. 保守者が新規スレッドを開き、移行した skill が plugin から読まれることを確認する。

### 3-2. データモデル

repository 固有文脈は、各 repository の `.agents/skills/tumeda-dev-plugin-context.md` に置く Markdown instance で管理する。plugin は同じ構造の template を提供する。context instance は、repository 固有の文書・規約・command のような、変化の遅い確認済み事実だけを正本として持つ。

H2 は各 skill 名と、最後の `共通` にする。どのH2/H3を返すかは`maintenance-plugin-context`がconsumerごとに解決する。consumerは返却された範囲以外を読まない。

```text
実効文脈 = skill 固有情報 ∪ (共通情報 ∩ skill が明示参照した項目)
```

`共通` は全 skill の和集合ではない。2つ以上の skill が同じ意味・同じ粒度で直接使う repository fact だけを置く。単独 consumer の情報は対応 skill section に置く。たとえば全体 test command は `steering`、`tasklist-executor`、`test-runner` が直接使い、全体 lint command は `steering` と `tasklist-executor` が直接使うため、どちらも `## 共通` に置く。

context instance がなく、repository 固有文脈が必要になった時は maintainerだけがtemplateから作る。既存ファイルで確認できる安定事実だけを最小限に記載し、作成・更新直後に同じ file を読み直す。構造を読めない既存instanceは修復・再生成しない。session 中の議論、TBD、steering の task は context instance に書かない。

### 3-3. 命名・公開 API・モジュール境界（全体レイヤ）

#### (A) 命名・公開 API

- `tumeda-dev-plugin-context.md`: 共有 skill が読む対象リポジトリの文脈を表す instance。
  - `共通`: 複数 skill が直接使う文書・方針だけを H3 で分類する。
  - `<skill-name>`: skill 固有の文脈を置く。consumerごとの`共通` H3選択はmaintainer skillが管理する。
- `templates/`: skill 自身の成果物書式。リポジトリ文脈ではなく plugin の内部資産として同じ skill ディレクトリに置く。

#### (B) モジュール境界・ディレクトリ構成

```text
ai_agent_dev_skill_plugin/
  skills/
    think-through/SKILL.md          ← リポジトリ非依存の思考作法
    design-consult/SKILL.md         ← リポジトリ非依存の設計相談手順
    doc-enricher/SKILL.md           ← README 知識化の判定・適用手順
    task-design/
      SKILL.md                      ← 実装前設計手順
      templates/                    ← design / discussion 書式
    steering/
      SKILL.md                      ← design 合意から tasklist 合意までの手順
      templates/                    ← summary / tasklist 等の書式
      scripts/github/               ← GitHub 指定時だけ使う PR 作成 adapter
    visual-inspector/SKILL.md       ← 実画面の事実確認手順
    tasklist-executor/SKILL.md      ← tasklist の実行手順
    test-runner/SKILL.md            ← test 実行・報告手順
    runtime-model-profiles.md       ← profile → host別model adapter

x_favorites/
  .agents/plugins/marketplace.json  ← plugin の local source を参照
  .agents/skills/tumeda-dev-plugin-context.md
                                        ← plugin 利用時の repo 固有 context 正本
```

**境界のルール:**

- plugin 配下は共有手順・一般例・skill 内部テンプレートだけを持つ。
- x_favorites 配下は marketplace 接続と x_favorites 固有の文脈だけを持つ。移行確認後、`.agents/skills/` の共有 skill 本文とテンプレートは削除し、`tumeda-dev-plugin-context.md` だけを残す。
- skill がリポジトリ文書を読む場合は、`maintenance-plugin-context`が返す固有sectionと`共通` H3だけを使う。固定絶対path・固定相対pathを本文に書かない。
- `steering` の GitHub adapter は plugin 内部資産であり、context instance の `### GitHub` がある時だけ使う。GitHub以外のproviderを抽象化しない。

### 3-4. docs・設定・環境構築系 deliverable

- **`ai_agent_dev_skill_plugin/skills/tumeda-dev-plugin-context.md`**
  - 内容: `tumeda-dev-plugin-context.md` のコピー元template。skill H2、最後の`共通` H2、各項目の記入欄だけを持ち、repository固有値・運用手順は持たない。
  - 配置: plugin の `skills/` 直下。plugin は skill の集合であり、全 skill が参照する template は特定 skill の private asset にしない。
  - 形式: Markdown。Codex skill として自動起動させるファイルではなく、context instance を作成する時のコピー元。

- **`<repository-root>/.agents/skills/tumeda-dev-plugin-context.md`**
  - 内容: template から作る repository 固有の context instance。確認済みの文書パス、方針、command、skill 固有制約だけを持つ。
  - 配置: 各 repository の `.agents/skills/` 直下。x_favorites では今回必ず作成し、移行後は同ディレクトリに残す唯一の非 skill Markdown。
  - 形式: plugin template と同じ Markdown。session 中の設計議論・TBD・task 状態は書かない。

- **`ai_agent_dev_skill_plugin/skills/maintenance-plugin-context/SKILL.md`**
  - 内容: context instanceの唯一のmaintenance owner。Git root探索、instance探索、maintainer自身の`SKILL.md`の親の親にあるplugin `skills/` rootからのtemplate解決、最小作成・更新、保存後再読込、選択的読取範囲の解決、作成不能時の`unavailable`返却を担う。`skill 固有情報 ∪ (共通情報 ∩ skill が明示参照した項目)`、`共通`へ置く事実の基準、session固有情報を置かない規則もここを正本にする。
  - 入力: consumer skill名、必要なH2/H3、必要理由、確認元候補。repository固有文脈が不要なconsumerは呼ばない。
  - 出力: `available`ならrepository root・instance path・許可された読取範囲・確認済みfact、`unavailable`なら理由と安全なfallback。Git root・plugin template・書込み権限のいずれかが得られない時は、cwdへの仮作成や独自形式の生成をしない。
  - 境界: consumer skillはinstanceを作成・更新・直接探索しない。必要な時だけmaintainerを呼び、返された範囲だけを読む。既存instanceの構造を読めない時も修復しない。必須文脈が`unavailable`なら推測せず、一般手順へ縮退するか必要入力を求める。

- **agent 由来 skill の host 別実行契約**
  - Claude Code: frontmatter の `model` 属性と `context: fork` で subagent 実行を表す。
  - Codex: 各 skill の `## Codex` が、直近の親 session に subagent を起動して完了まで待つよう指示する。親は child に skill 手順、task 固有入力、context instance path、成果物 path、完了条件、返却 summary を渡す。childも必要なsubskillの親になれる。
  - `runtime-model-profiles.md`: `deep-design`と`standard-execution`の推論強度profile、Claude selector、Codex adapter、release確認を持つ。skillはprofileを要求し、Codexは選択面がある時だけprofile相当modelを選び、ない時はparent modelを継承する。

- **`ai_agent_dev_skill_plugin/skills/runtime-model-profiles.md`**
  - 内容: provider固有model名を正本にせず、`deep-design`（`design-consult`）と`standard-execution`（agent由来3 skill）の能力profileを定義する。Claude frontmatter selector、Codexの選択・継承fallback、host提供変更時の更新規則を持つ。
  - 配置: pluginの`skills/`直下。profileを使うskillの`## Codex`とClaude frontmatterが参照する共有advisory。

- **`ai_agent_dev_skill_plugin/skills/<skill>/SKILL.md`**
  - 内容: 共有手順、一般化した具体例、repository固有文脈が必要になる呼出条件。context instanceの探索・作成・更新・不在時規則は持たず、`maintenance-plugin-context`へ委譲する。
  - 配置: plugin の `skills/` 配下。
  - 形式: Codex skill の frontmatter と Markdown 本文。

- **`ai_agent_dev_skill_plugin/skills/hello/`**
  - 内容: 今回のplugin責務に含めない既存skill。
  - 操作: directoryごと削除する。

- **`ai_agent_dev_skill_plugin/skills/{task-design,steering}/templates/`**
  - 内容: 各 skill が生成する成果物のテンプレート。steeringのgeneric tasklist templateはcommit・push・PR scriptを固定記載せず、`steering`本文がGitHub有無に応じて完了後actionを生成する。
  - 配置: 対応する skill の直下。
  - 形式: skill 本文が相対参照する Markdown テンプレート。

- **`ai_agent_dev_skill_plugin/skills/steering/scripts/github/`**
  - 内容: GitHub 指定 repository でだけ使う internal adapter。current branch と repository の default base branch を使い、既存 PR を返すか、新規 PR を作成する。
  - 境界: `feature-<issue_id>` のような branch 命名、issue title の利用、close keyword は repository 固有の `## steering` section から明示された時だけ適用する。shared script に固定しない。
  - 形式: shell script。ほかの skill が再利用する必要が生じるまで、独立 skill にはしない。

- **`x_favorites/AGENTS.md`**
  - 内容: x_favorites で常時適用する思考作法を、移行後の plugin skill 名へ案内する。物理的な旧 skill パスを正本として扱わない。
  - 配置: repository root。
  - 形式: 既存のオーケストレータ役を維持する簡潔な参照。

### 3-5. GitHubによる完了後 action の分岐

1. steering は`maintenance-plugin-context`から返された`## steering` sectionを読む。
2. `### GitHub` がなければ、tasklist にcommit・push・PR作成を追加しない。ユーザー動作確認とsteering summary更新で終える。
3. section があれば、ユーザー動作確認の後に、GitHub接続・認証のpreflight、commit、current branchのpush、`skills/steering/scripts/github/`による既存PR取得またはPR作成をtasklistへ含める。
4. preflightまたはadapterが失敗した時、executorは外部公開actionを未完のまま失敗内容と必要な利用者操作を報告する。GitHub以外のCLI・manual fallbackを推測して実行しない。
5. branch とissueの対応規約が`### Branch / issue 契約`にある時だけ、GitHub adapterはissue連携を行う。
6. tasklist自己レビューは、GitHubあり/なしの分岐と、GitHubあり時にユーザー動作確認がcommit前にあることを確認する。固定script pathを確認対象にしない。
7. GitHub以外のproviderは今回のscope外であり、adapter・認証preflight・fallbackを定義しない。

### 3-6. x_favorites 初期 context instance

初期 instance は`maintenance-plugin-context`がtemplateをコピーし、確認済みfactsだけを記入する。`共通`には`AGENTS.md`、`docs/ai_guideline/`の案内・アーキテクチャ・testing / docker文書、`docker compose exec app yarn test`、`docker compose exec app yarn lint`を置く。`steering`には`origin`がGitHubであることと、`feature-<issue番号>`のbranch / issue契約を置く。

`visual-inspector` には compose で確認できる `http://localhost:3000` と現存する browser config / 出力先だけを記載する。旧 agent の `http://localhost:18100`、存在しない helper・result template、旧 `test-runner` の `docker compose exec frontend npm test` は転記しない。shared skill は repository 固有 helper を使う前に存在確認し、存在しないものを前提にしない。

### 3-7. host起動経路と旧定義の退役

- **正本**: think-throughの詳細手順と、3 agent由来手順の正本はplugin skillに置く。repository内に共有skill本文のコピーを残さない。
- **Claude Code**: `.claude/hooks/think_through_session_start.sh` と `think_through_user_prompt.sh` は残し、毎turnに必要な短い思考作法だけを注入する。削除する `.claude/skills/think-through/SKILL.md` へのpath参照は消す。`AGENTS.md` とsettingsのSkill permissionは、インストール済みpluginの名前で解決できることを実機確認してから更新する。
- **Codex**: `AGENTS.md` に `tumeda-dev:think-through` を毎turn適用する常時作法として案内し、pluginが利用可能な時に詳細skillを読む。Codex用の常時適用はproject instructionとplugin skillの組み合わせで成立させる。
- **退役順**: plugin sourceの検証 → Codex再install・新thread smoke test → Claude Code plugin reload / 新session smoke test → settings・hook・browser設定・permissionのinventory更新 → `.claude/skills` symlink、旧 `.claude/agents` 3ファイル、旧GitHub script permissionの削除または置換、の順に行う。
- **検証**: 退役後に、旧path / 旧agent名を参照するproject設定がないこと、Claude CodeとCodexの双方でthink-throughと移行skillが起動することを確認する。

### 3-8. subagent実行グラフ

```text
呼び出し元 session → design-consult
呼び出し元 session → tasklist-executor
tasklist-executor → visual-inspector  （UI taskの時だけ）
tasklist-executor → test-runner       （test実行・失敗分析が必要な時）
```

- 各edgeの直近parentがchildを起動して待機する。root mainだけに起動権限を限定しない。
- parentはchildに、実行skill、task入力、context instance path、成果物path、DoD、返却summaryを渡す。Claude Codeでは`context: fork` skillの`$ARGUMENTS`、Codexでは`## Codex`のchild prompt契約で同じ入出力を満たす。
- `visual-inspector` は `result.md` と検査summaryをexecutorへ返す。`test-runner` は実行結果・失敗分析・推奨修正をexecutorへ返す。executorだけがtasklistへの転記、DoD判定、`[x]`更新を行う。
- childが失敗またはDoD未達を返した時、parentはtaskを完了にせず、修正・再実行・必要なら利用者への報告へ進む。

---

## 4. なぜこの姿か（設計判断）

### 設計選択と理由

- plugin を唯一の正本にする。コピーを残すと、共有版と x_favorites 版の修正がずれ、どちらが実行されるか分からなくなる。
- context instance は skill 共通の外枠にし、`共通` の H3 と skill section の明示参照で文書の役割を表す。単なるパス配列では、skill が何の判断に使う文書か分からない。
- 例は削除せず一般化する。例を失うと抽象ルールの適用範囲が不明になるため、外部取得→変換→保存、作成→検証→表示のようなドメイン非依存例へ置換する。
- templates は plugin 内部資産として skill と同居させる。利用先リポジトリの `.agents` や `.claude` に依存させない。
- GitHub remote は repository 固有の安定事実であり、公開手順そのものを毎 repository が重複記載する必要はない。`### GitHub` の有無で完了後 action を分岐させる。

### 代替案と棄却理由

- **案A: x_favorites の skill を残して plugin へコピーする**: 二重管理になり、一般化の修正が片方にだけ入る。
- **案B: 固定パスを残し、存在しない時だけ無視する**: 他リポジトリで意図しない文書を読み、暗黙依存を再生産する。
- **案C: 文脈を JSON schema で厳格に固定する**: Codex skill の自然言語呼び出しには重く、スキルごとに不要な入力まで強制する。skill H2 と最後の `共通` H2 を持つ自由な Markdown を採用する。
- **案D: generic template に GitHub の push / PR command を残す**: GitHub remote未記載のrepositoryに外部公開を強制する。`### GitHub` の明示有無で分岐する。

## 事前設計議論メモ（揮発防止）

- **repository context の選択的結合**: 自由形式の invocation 引数と固定 schema のどちらにも寄せず、plugin が Markdown template を提供する。実効文脈は `skill 固有情報 ∪ (共通情報 ∩ skill が明示参照した項目)` とする。`共通` は和集合でなく、複数 skill が同じ意味・粒度で直接使う facts だけを置く。
- **agent 由来手順の skill 化**: `visual-inspector`、`tasklist-executor`、`test-runner` は skill の手順正本へ移す。Claude Code は frontmatter の `model` と `context: fork`、Codex は skill の `## Codex` にある parent→child prompt 契約で subagent 化する。model profile は advisory であり、今回 model 固定は扱わない。
- **GitHubによる完了後 action**: `## steering` に `### GitHub` がある repository だけが、ユーザー動作確認後にcommit・push・PR作成を行う。GitHub adapter は `steering/scripts/github/` に内包し、x_favorites の branch / issue 規約は context instance に分離する。GitHub以外のproviderは今回対象外とする。
- **x_favorites の bootstrap**: 初期 context instance は今回の必達。正本 docs / config / remote の確認済み facts だけを記載し、旧 agent の `frontend npm test`、`18100`、存在しない visual helper は転記しない。
- **host起動経路**: pluginへ移す対象はskill本文だけではない。Claude Codeのhook・settings・symlink・agent definition、Codexのproject instructionを棚卸し、plugin smoke testの後に旧経路を退役する。
- **subagent実行**: nested delegationを許可する。executorはUI確認時にvisual-inspector、test実行・分析時にtest-runnerを起動し、child結果をtasklistのDoDへ統合する。

---

## 5. リスクと対策

| リスク | 対策 |
|---|---|
| 旧 skill を消しても Codex が cache を読む | cachebuster 更新、再インストール、新規スレッド確認を完了条件にする |
| 一般化で具体性が失われる | 各固有例を、役割と入出力が分かる一般例へ置換する |
| 必須文書が未入力で不完全な設計になる | skill ごとに必須・任意を明記し、必須時だけ役割名と理由を示して入力を求める |
| plugin 内テンプレート参照が旧 `.agents` / `.claude` を向く | 全参照を skill ディレクトリ相対へ置換し、静的検索で確認する |
| x_favorites の常時適用案内が旧パスを参照する | `AGENTS.md` の参照を plugin skill 名へ更新する |
| GitHub adapter が x_favorites の branch / issue 規約を暗黙に引き継ぐ | generic adapter と context instance の `Branch / issue 契約` を分離し、任意 branch 名でも PR 作成できるようにする |
| GitHub未記載repositoryにも旧templateのpush / PR taskが混入する | 外部公開actionの生成者をsteeringだけにし、generic templateと自己レビューから固定scriptを除去する |
| 初期 context が旧 agent の陳腐化した設定を正本化する | context に書く値を正本ドキュメント・設定・remote で確認した facts に限定する |
| 旧 `.claude` 経路がplugin移行後も古いskill / agentを発見する | host別smoke test後に、hook・settings・symlink・agent definitionをinventoryに従って更新・退役する |
| subagent結果がtasklistの完了状態へ反映されない | executorだけをtasklist更新者とし、visual / test childの返却形式とDoD未達時の未完了規則を固定する |

---

## 6. テスト方針

- plugin validator で manifest と plugin 構造を検証する。
- 8 移行skill、`maintenance-plugin-context`、templateの一覧・相対参照を検査する。
- 移行対象の skill 本文に、x_favorites 固有の固定パス・ドメイン例・固定実行コマンドが残っていないことを検索する。
- context instance あり・なしの各例を本文上で確認し、不在時に固定パスを読む指示がないことをレビューする。
- `### GitHub` あり・なしの各 case で、tasklist の完了後 action と GitHub adapter の選択が正しいことを確認する。GitHub以外のproviderを扱うtaskがないことを確認する。
- GitHubありのtasklistで、ユーザー動作確認がpreflight・commitより前にあり、preflight / adapter失敗時に外部公開actionが未完になることを確認する。GitHubなしのtasklistにcommit・push・PR scriptが含まれないことを確認する。
- x_favorites 初期 context instance の各値を、記載した根拠ファイルまたは remote と照合する。旧 agent の `18100` と `frontend npm test` が残らないことを検索する。
- Claude Code / Codexの両方でthink-throughの常時作法、8移行skill、`maintenance-plugin-context`の発見・起動を確認し、project設定から旧 `.claude/skills` path・旧agent名・旧GitHub script permissionが消えたことを検索する。
- Claude Code / Codexの双方で、executorからvisual-inspector・test-runnerへのnested delegation、child結果のtasklist転記、DoD未達時に`[x]`にならないことをsmoke testする。
- `runtime-model-profiles.md`のClaude selectorとprofile使用skillのfrontmatterが一致すること、Codexでchild model選択面がある時はprofile相当model、ない時はparent model継承になることをsmoke testする。
- cachebuster 更新・再インストール後、新規スレッドで plugin skill の発見と起動を手動確認する。
- `skills/hello/`が存在せず、8移行skillと`maintenance-plugin-context`の9 skillだけがpluginに存在することを確認する。Claude Codeではplugin manifestとmarketplace entryのversion更新・reload / 新session、Codexではcachebuster・marketplace経由reinstall・新threadを別々に確認する。

---

## （付録）変更点一覧

### plugin

- `skills/think-through/SKILL.md`: 移行。`CLAUDE.md` 固有参照を一般的なプロジェクト指示参照へ置換。
- `skills/design-consult/SKILL.md`: 移行。必要な時だけ context instance の `design-consult` section と明示参照された共通項目を相談入力に添える規則を追加。
- `skills/doc-enricher/SKILL.md`: 移行。MealFrame / resolver の例を一般的なモジュール・オーケストレーション例へ置換。
- `skills/task-design/SKILL.md` と `templates/`: 移行。X/Notion、固定規約パス、固定 spike 実行コマンドを一般例または context instance へ置換。
- `skills/steering/SKILL.md` と `templates/`: 移行。固定規約path、固定project例、旧template path、固定GitHub script自己レビューを一般化・相対化する。外部公開actionはGitHub context分岐だけで生成する。
- `skills/steering/scripts/github/`: `scripts/github/` の PR 作成補助を移行・一般化。GitHub adapter に限定し、branch / issue 規約は context instance へ分離する。
- `.codex-plugin/plugin.json`: cachebuster 更新対象。

### x_favorites

- `.agents/skills/`: plugin の検証・再インストール・新規スレッド確認後、共有 skill 本文とテンプレートを削除する。`tumeda-dev-plugin-context.md` を repo 固有 context の正本として残す。互換 wrapper は作らない。
- `.claude/skills` と `.claude/agents/`: pluginのClaude Code / Codex smoke testとhost設定inventoryの完了後、旧skill symlinkと3 agent definitionを削除または置換する。
- `.claude/hooks/`、`.claude/settings.json`、`AGENTS.md`: plugin正本を参照するhost別起動経路へ更新する。hookは短い常時作法だけを持ち、削除するlocal SKILL pathを参照しない。
- `maintenance-plugin-context`: template を基に x_favorites の初期instanceを作成する。正本 docs / config / remote で確認したfactsだけを記載する。
- `AGENTS.md`: plugin へ移行した常時適用 skill の参照を更新する。
- `.agents/plugins/marketplace.json`: source は既に plugin 実体を指すため変更しない。
