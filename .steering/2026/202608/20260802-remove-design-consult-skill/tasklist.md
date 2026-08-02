# タスクリスト

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

- 全タスクとサブタスクは完了直後に `[x]` へ更新する。
- 実装方針の変更で不要になったタスクだけ、具体的な理由を残して完了扱いにできる。
- 未完了タスクを残したまま実装完了としない。

## フェーズ1: design-consult を配布対象と現行契約から削除する

### DoD（完了条件）

利用者が `tumeda-dev` version `4.0.0` を読み込んだとき、`design-consult` は利用可能な skill に含まれず、残る skill・context・model profile・validator が削除後の構成だけを参照する。過去の `.steering/` 成果物は変更されていない。

### タスク

- [x] `design-consult` skill 本体を削除する。
    - [x] `plugins/tumeda-dev/skills/design-consult/SKILL.md` を削除する。

- [x] 人間向け索引と既存 skill の説明を削除後の責務へ更新する。
    - [x] `plugins/tumeda-dev/skills/README.md` から `design-consult` の項目を削除し、`think-through` の説明から前段適用先としての記載を除く。
    - [x] `plugins/tumeda-dev/skills/think-through/SKILL.md` の description から `design-consult` を除く。
    - [x] `plugins/tumeda-dev/skills/task-design/SKILL.md` から `design-consult` への再委譲を除き、構造的・抜本的更新を `task-design` 自身の高推論モデルとユーザー対話で扱う契約へ揃える。
    - [x] `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md` の consumer 例から `design-consult` を除く。

- [x] repository context と model profile から専用契約を削除する。
    - [x] `plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md` の consumer 対応表から `design-consult` を削除する。
    - [x] `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` から `design-consult` section を削除する。
    - [x] `.agents/skills/tumeda-dev-plugin-context.md` から `design-consult` section を削除する。
    - [x] `plugins/tumeda-dev/skills/runtime-model-profiles.md` から、使用者がなくなる `deep-design` profile を削除する。

- [x] validator を削除後の構成へ更新する。
    - [x] `scripts/verification/validate-plugin.mjs` から `design-consult` の必須内容、discussion consumer、portable file としての検証を削除する。
    - [x] `plugins/tumeda-dev/skills/design-consult/SKILL.md` が存在しないことを validator で検証する。

- [x] 破壊的変更として配布 version を `4.0.0` に統一する。
    - [x] `plugins/tumeda-dev/.codex-plugin/plugin.json` を更新する。
    - [x] `plugins/tumeda-dev/.claude-plugin/plugin.json` を更新する。
    - [x] `.claude-plugin/marketplace.json` の root version と `tumeda-dev` plugin version を更新する。
    - [x] `scripts/verification/validate-plugin.mjs` の期待 release を更新する。

- [x] 変更した配布契約に対応する検証を実行する。
    - [x] `node scripts/verification/validate-plugin.mjs` が成功することを確認する。

## フェーズ2: 品質チェックと修正

### DoD（完了条件）

現行の配布対象では validator の不在assertionを除いて `design-consult` 参照がなく、version 宣言が `4.0.0` で一致し、plugin validator と差分形式検査が成功する。

### タスク

- [x] 現行ファイルの参照整合性を確認する。
    - [x] `plugins/`、`.agents/`、`.claude-plugin/`、`scripts/` を検索し、validator の不在assertion以外に `design-consult` または `opus-consult` が残っていないことを確認する。
    - [x] `.steering/` 配下の履歴が変更されていないことを `git diff -- .steering` で確認する。ただし今回作成した steering directory は新規成果物として除外する。

- [x] 配布 version の整合性を確認する。
    - [x] 四つの配布 version 宣言と validator の期待 release が `4.0.0` であることを確認する。

- [x] repository の利用可能な静的検証を実行する。
    - [x] `node scripts/verification/validate-plugin.mjs` が成功することを再確認する。
    - [x] `git diff --check` が成功することを確認する。
    - [x] repository context に全体 test command と全体 lint command が未登録であることを記録し、未確認の command を推測して実行しない。
      > repository context に全体 test command と全体 lint command は未登録であるため、tasklist に明記された `node scripts/verification/validate-plugin.mjs` と `git diff --check` 以外の command は推測して実行しなかった。

## 動作確認

### DoD（完了条件）

ユーザーが変更差分と検証結果を確認し、`design-consult` を代替 skill なしで削除した構成が意図どおりであると判断している。

### タスク

- [x] ユーザーに変更差分と検証結果の確認を依頼する。
- [x] ~~フィードバック収集~~（フィードバックなし）

## 完了後のアクション

repository context から GitHub 公開契約が得られていないため、commit、push、Pull Request 作成はこの tasklist の対象外とする。
