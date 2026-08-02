# design-consult skill の削除

## 目的

メインセッションで Opus または Sol 相当の高推論モデルを使う現在の運用では、別の高推論モデルを child として起動する `design-consult` の責務が重複している。独立した設計相談 skill とその専用契約を削除し、設計判断をメインセッション、`think-through`、`task-design` の既存プロセスへ一本化する。

## 完了条件

- [ ] 配布対象から `design-consult` skill が削除されている。
- [ ] 現行の skill、共有リファレンス、context template、人間向け索引、validator に `design-consult` 固有の参照が残っていない。
- [ ] 過去の `.steering/` 成果物は履歴として変更されていない。
- [ ] validator が `design-consult` の不在と、残る skill の契約を検証して成功する。
- [ ] 破壊的変更として `tumeda-dev` の配布 version が `4.0.0` に統一されている。

## 決定事項

### D1. skill 本体を削除する

`plugins/tumeda-dev/skills/design-consult/SKILL.md` を削除する。代替となる設計相談 skill は追加しない。

### D2. 設計判断を既存プロセスへ一本化する

通常の設計判断はメインセッションで行い、実装前設計は `task-design`、思考プロセスのガードレールは `think-through` が引き続き担う。`task-design` 自身の構造的・抜本的な更新も、削除対象の skill へ再委譲せず、`model: opus` で動く `task-design` 自身の検討とユーザーとの対話で進める。

### D3. 現行参照だけを整理する

次の現行ファイルから `design-consult` 固有の参照または契約を削除する。

- `plugins/tumeda-dev/skills/README.md`
- `plugins/tumeda-dev/skills/think-through/SKILL.md`
- `plugins/tumeda-dev/skills/task-design/SKILL.md`
- `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`
- `plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md`
- `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`
- `.agents/skills/tumeda-dev-plugin-context.md`
- `plugins/tumeda-dev/skills/runtime-model-profiles.md`
- `scripts/verification/validate-plugin.mjs`

`.steering/` 配下にある過去の設計、議論、tasklist は当時の事実を表す履歴なので変更しない。

### D4. deep-design profile を削除する

`runtime-model-profiles.md` の `deep-design` profile は使用 skill が `design-consult` だけなので削除する。`standard-execution` profile と、これを利用する child skill の契約は維持する。

### D5. validator で不在を契約化する

validator から `design-consult` の内容・consumer・portable file としての必須検証を削除し、`plugins/tumeda-dev/skills/design-consult/SKILL.md` が存在しないことを検証する。

### D6. 配布 version を 4.0.0 へ上げる

公開 skill の削除は後方互換性を壊すため MAJOR release とする。次の宣言値と validator の期待値を `4.0.0` に揃える。

- `plugins/tumeda-dev/.codex-plugin/plugin.json`
- `plugins/tumeda-dev/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json` の root version
- `.claude-plugin/marketplace.json` の `tumeda-dev` plugin version
- `scripts/verification/validate-plugin.mjs` の期待 release

## 代替案と棄却理由

- `design-consult` を非推奨として残す方法は、利用可能な skill 一覧と保守対象を増やしたままにするため採らない。
- `design-consult` を別名の review skill に置き換える方法は、現在必要とされていない責務を新設することになるため採らない。独立した第二意見が再び必要になった時点で、その用途に合わせて設計する。
