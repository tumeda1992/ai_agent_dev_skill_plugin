# tumeda-dev plugin context template

<!-- `maintenance-plugin-context` が作成・更新・読み取り範囲を管理する。 -->

## think-through

参照する共通項目: [プロジェクト指示](#プロジェクト指示)

<!-- think-through 固有の補足がある時だけ、この下に記載 -->

## doc-enricher

参照する共通項目: [プロジェクト指示](#プロジェクト指示)、[アーキテクチャ文書](#アーキテクチャ文書)

<!-- README 編集方針、候補を置く既存文書など、doc-enricher 固有制約だけこの下に記載 -->

## task-design

参照する共通項目: [プロジェクト指示](#プロジェクト指示)、[アーキテクチャ文書](#アーキテクチャ文書)、[開発規約](#開発規約)、[テスト方針](#テスト方針)、[全体 test command](#全体-test-command)、[全体 lint command](#全体-lint-command)

### version bump

- 配布versionはSemVerの `MAJOR.MINOR.PATCH` だけを使う。pre-release / build metadataを付けない。
- MINORとPATCHの境界は「consumerが新たに呼べるものが増えたか」で判定する。新しいskill、新しいparameter等、利用側の呼び出し方が増えるならMINOR。既存skillの内容修正、docsの追加・変更はPATCH。新規file追加それ自体はMINORの根拠にならない。
- bumpは宣言値4箇所と `scripts/verification/validate-plugin.mjs` の `expectedRelease` 1箇所、計5箇所を一度に変える。
- 現在の宣言値は全箇所 `7.4.0` で一致している。

### UI確認環境

- なし。このrepositoryはskill・docsのMarkdownとmanifestのJSONだけを持ち、起動するappを持たない。`visual-inspector` を使う対象がない。

### Git / GitHub公開条件

- remote: `origin` は `ssh://git@github.com/tumeda1992/ai_agent_dev_skill_plugin.git`。
- default branch: `main`。commitとpushをdefault branchへ直接行わない。
- PR作成script: `scripts/for_local/github/create_or_get_pr.sh`。同じhead branchのopen PRがあれば新規作成せずそのURLを返す。
  - `tasklist-executor` skill配下の同名scriptとはpathが異なる。このrepositoryで作業する時はrepository側の `scripts/for_local/github/` を使う。

### Branch / issue 契約

- なし。利用先repositoryからの提案が起点になるため、issue番号のような安定した識別子を持たない。
- branch名はsteering directoryのbasename（`YYYYMMDD-slug`）に揃える。`steering` を `branch_from_basename=true` で起動して作る。branch一覧が日付順に並び、branch名からsteering記録を一意に引ける。

### 作業の外へ残るactionの差し込み

<!-- 対象actionを含むphaseの停止時に、既定の確認へ加えて行うこと、または問うことを記載する。
     対象action種別、差し込む内容、その背景。宣言がなければ何も差し込まれない。
     「actionを定める」形と「問いを定める」形のどちらでもよい。前者はreview時に問わず、後者は問う -->

## steering

参照する共通項目: [プロジェクト指示](#プロジェクト指示)、[アーキテクチャ文書](#アーキテクチャ文書)、[開発規約](#開発規約)、[テスト方針](#テスト方針)

<!-- steering root、roadmap binding・status伝播に必要な制約だけこの下に記載 -->

## visual-inspector

参照する共通項目: [プロジェクト指示](#プロジェクト指示)

### アプリ接続

<!-- アプリURL、認証の取得・利用方針だけを記載。認証情報そのものは書かない -->

### 検査環境

<!-- script/screenshot/resultの作業directoryと命名規則を必ず記載。browser設定、helper、依存install手順、実行command、result templateは存在する時だけ記載 -->

## tasklist-executor

参照する共通項目: [プロジェクト指示](#プロジェクト指示)、[アーキテクチャ文書](#アーキテクチャ文書)、[開発規約](#開発規約)、[テスト方針](#テスト方針)、[全体 test command](#全体-test-command)、[全体 lint command](#全体-lint-command)

<!-- tasklist 実行範囲、結果記録方法、ユーザー確認前の制約だけこの下に記載 -->

## test-runner

参照する共通項目: [プロジェクト指示](#プロジェクト指示)、[テスト方針](#テスト方針)、[全体 test command](#全体-test-command)

<!-- 追加 test command、実行制約、結果 report 形式だけこの下に記載 -->

## 共通

### プロジェクト指示

- `AGENTS.md`（root。`CLAUDE.md` は同fileへのsymlink）: 常用plugin、口調、毎ターン適用する思考の作法、repository運用。
- repository内のdocument本文は、file種別や配置場所にかかわらず日本語で記述する。code、command、path、識別子、規定された出力形式、固有名詞は原文を維持する。

### アーキテクチャ文書

- `plugins/tumeda-dev/docs/README.md`: docs体系の入口。
- `plugins/tumeda-dev/docs/documentation_standards/`: documentの書き方の標準。`core_readers.md`、`information_structuring/`、`how_to_write_workflow.md`、`modify_description_policy.md`等。skill本体やdocsを書く時の規範。
- `plugins/tumeda-dev/docs/think_standards/`: 思考・議論の作法。`think-through` skillが参照する正本。
- `plugins/tumeda-dev/docs/development_standards/`: 命名、entity modeling等のrepository非依存な設計標準。
- skill本体（`plugins/tumeda-dev/skills/<name>/SKILL.md`）とdocsの責務境界: skillは実行手順とownership、docsは種別横断の規範を持つ。

### 開発規約

- `plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies/migration.md`: 他repositoryとの移植・追随・逆輸入の規約。参照元repository固有情報を抜き、汎用知識だけをpluginへ記載する。
- `plugins/tumeda-dev/docs/common_standard/function_migration_policy.md`: 配置やownerを変えても挙動と意味を全量維持するfunction migrationの共通規範。
- root `docs/maintenance_policies` は `plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies` へのsymlink。

### テスト方針

- 自動test frameworkを持たない。`package.json` は存在しない。
- 検証は `scripts/verification/validate-plugin.mjs` によるplugin manifestの整合確認だけである。skill本文の内容は人のreviewで担保する。

### 全体 test command

- `node scripts/verification/validate-plugin.mjs`
  - repository rootで実行する。成功時は `plugin validation passed` を出力する。
  - version宣言値4箇所（`plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、root `.claude-plugin/marketplace.json` の `version` と `plugins[].version`）が一致し、かつ同fileの `expectedRelease` と等しいことを検査する。

### 全体 lint command

- なし。linterを持たない。
