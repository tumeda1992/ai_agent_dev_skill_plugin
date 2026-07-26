# タスクリスト

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

- 各タスクが終わった時点で対応する`[ ]`を`[x]`へ更新する。
- 未完了や失敗を完了扱いにしない。
- pluginのpublish、外部marketplace登録、install/reinstall、commit、push、Pull Request作成は今回の実行範囲に含めない。

---

## フェーズ1: tumeda-dev pluginの配布境界を`plugins/tumeda-dev/`へ移す

### DoD（完了条件）

repository rootの両marketplace catalogから`tumeda-dev`を1回解決すると、`plugins/tumeda-dev/`内の各host manifestと既存skills treeへ到達でき、repository内の開発用symlinkと検証scriptも同じ実体を参照する。

### タスク

- [x] 移動前のplugin packageを記録する
    - [x] `skills/`配下のGit管理対象について、相対pathとfile modeを比較できる一覧を一時領域へ保存する
    - [x] `.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`、両marketplace catalogの移動前値を確認する

- [x] plugin packageをnested plugin rootへ移す
    - [x] `plugins/tumeda-dev/.codex-plugin/`と`plugins/tumeda-dev/.claude-plugin/`を必要最小限に作成する
    - [x] `.codex-plugin/plugin.json`を`plugins/tumeda-dev/.codex-plugin/plugin.json`へ移す
    - [x] `.claude-plugin/plugin.json`を`plugins/tumeda-dev/.claude-plugin/plugin.json`へ移す
    - [x] `skills/`全体を`plugins/tumeda-dev/skills/`へ移し、descendantの相対pathとfile modeを維持する
    - [x] `references/`、`assets/`、`hooks/`、plugin root直下の`templates/`や`scripts/`など、現在存在しない任意directoryを作成していないことを確認する

- [x] manifestとmarketplace catalogをnested plugin rootへ同期する
    - [x] Codex manifestのplugin名と`skills: "./skills/"`を維持し、versionを`1.1.1`へ更新する
    - [x] Claude manifestのplugin名を維持し、versionを`1.1.1`へ更新する
    - [x] `.claude-plugin/marketplace.json`のroot versionと`name: "tumeda-dev"` entry versionを`1.1.1`へ更新する
    - [x] `.claude-plugin/marketplace.json`の`name: "tumeda-dev"` entry sourceを`"./plugins/tumeda-dev"`へ更新する
    - [x] `.agents/plugins/marketplace.json`の`name: "tumeda-dev"` entry source pathを`"./plugins/tumeda-dev"`へ更新する
    - [x] marketplace名、description、author、category、installation policy、authentication policyを変更していないことを確認する

- [x] repository内の現行path参照を更新する
    - [x] `.agents/skills`のtargetを`../plugins/tumeda-dev/skills`へ更新する
    - [x] `.claude/skills`が従来どおり`../.agents/skills`を指し、nested skills treeへ解決することを確認する
    - [x] `docs/maintenance_policies`のtargetを`../plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies`へ更新する
    - [x] `AGENTS.md`のmigration policy pathをnested skills pathへ更新する
    - [x] `README.md`へ新しい構造説明を追加せず、既存のruntime model profile参照だけをnested skills pathへ更新する
    - [x] 移動後の`maintenance-plugin-context/SKILL.md`で、version同期対象をnested manifests、root marketplace、marketplace root versionとして正確に記載する
    - [x] `.steering/`配下の過去成果物を変更していないことを確認する

- [x] nested構造を担保する検証を更新する
    - [x] `scripts/verification/validate-plugin.mjs`に`plugins/tumeda-dev`のplugin rootを一箇所で定義する
    - [x] manifest、skills、portable fileの既存検証pathをplugin root配下へ切り替える
    - [x] 両marketplace catalogから配列位置ではなく`name: "tumeda-dev"`でentryを特定する
    - [x] Claude sourceとCodex source pathが`./plugins/tumeda-dev`であることを検証する
    - [x] Codex manifest、Claude manifest、Claude marketplace root、Claude marketplace plugin entryのversionがすべて`1.1.1`であることを検証する
    - [x] 旧rootの`.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`、`skills/`が残っていないことを検証する

- [x] フェーズ1の変更を検証する
    - [x] 移動前後のskills一覧を比較し、prefix以外の相対pathとfile modeが一致することを確認する
    - [x] `node scripts/verification/validate-plugin.mjs`を実行し、成功するまでフェーズ1の変更を修正する
    - [x] `.agents/skills`、`.claude/skills`、`docs/maintenance_policies`、`CLAUDE.md`が存在する実体へ解決することを確認する

---

## フェーズ2: repository全体の構造・配布契約を最終確認する

### DoD（完了条件）

repositoryの検証commandと両hostのplugin構造検証が成功し、現行ファイルに実行時の旧root参照がなく、差分が設計対象と今回のsteering成果物だけに限定されている。

### タスク

- [x] repositoryのplugin検証を実行する
    - [x] `node scripts/verification/validate-plugin.mjs`を実行して成功を確認する
    - [x] Claude Code CLIが利用可能なら、repository marketplaceと`plugins/tumeda-dev/`を`claude plugin validate`で検証する
    - [x] Claude Code CLIが利用不能な場合は、その事実を結果へ記録し、repository validatorによるJSON・path検証結果を残す（該当なし: CLIは利用可能で、marketplaceとnested plugin rootの検証が2/2成功）

- [x] stale pathと構造を検査する
    - [x] `.steering/`、`.git/`、IDE設定を除く現行ファイルから、旧root manifest path、旧root skills path、marketplaceの旧`"./"` sourceを検索する
    - [x] ユーザー向けの移動元説明以外に、実行時の旧root参照が残っていないことを確認する
    - [x] 旧rootのplugin manifestと`skills/`が存在しないことを確認する
    - [x] plugin rootに例示だけの任意directoryが増えていないことを確認する

- [x] 差分品質を確認する
    - [x] `git diff --check`を実行して成功を確認する
    - [x] `git status --short`と`git diff --stat`で変更範囲を確認する
    - [x] `.steering/`では今回の作業directory以外に差分がないことを確認する
    - [x] plugin package外の開発用ファイルが意図せず移動・削除されていないことを確認する

---

## 動作確認

### DoD

ユーザーが完成後tree、両marketplace source、release versionを確認し、意図した配布境界になっていると判断する。

### タスク

- [x] ユーザーに変更後のtree、主要manifest値、検証結果を提示して確認を依頼する
- [x] フィードバックがある場合は`implementation_review.md`へ原文のまま記録する（該当なし: ユーザー確認は`ok`で、implementation feedbackなし）
- [x] フィードバックがない場合は、フィードバック収集を「フィードバックなし」として完了扱いにする

---

## 完了後のアクション

- [x] tasklistの全タスクとDoDが完了していることを確認する
- [x] publish、install/reinstall、commit、push、Pull Request作成を実行していないことを確認する
