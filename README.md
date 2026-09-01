# ai_agent_dev_skill_plugin
tumedaが、リポジトリ横断でよく使うskill集としてのplugin。
特定テーマに特化したものは順次切り出す

## 運用契約

- 共有手順の正本はこのpluginに置く。利用先repositoryへ同じskill本文をコピーしない。
- repository固有の文書・command・規約は、`<repository-root>/.agents/skills/tumeda-dev-plugin-context.md`に置く。作成・更新・読取範囲の解決は`maintenance-plugin-context`だけが担う。
- shared skillはrepository固有の固定path・固定commandを暗黙に読まない。必要な文脈はcontext maintainerから返された範囲だけを使う。
- hostごとのmodel差は`plugins/tumeda-dev/skills/runtime-model-profiles.md`の能力profileで吸収する。provider固有model名はskill手順の正本にしない。
- 正本repository自身も`<repository-root>/.agents/skills/tumeda-dev-plugin-context.md`のinstanceを持つ。pluginを開発する時もshared skillは同じcontract上で動くため、正本だけを例外にしない。

## 変更時の検証と前提

- このrepositoryの検査正本は `node scripts/verification/validate-plugin.mjs` である。assertion（`requireText` / `requireExists` / `requireFrontmatter` / `requireAbsent` / `forbidText` / `requireOrderedText` 等）でskillとdocsの内容を検査する。test framework、lint、formatter、CI設定は他に存在しない。
    - skillまたはdocsを追加・変更したら、対応するassertionをこのfileへ追加する。
    - 既存assertionがピン留めしている文字列を変更したら、そのassertionも追随させる。見出し、step番号、章番号、契約文の変更はすべてこれに当たる。
    - `forbidText` を先に確認する。`requireText` は追随を怠ると検査が落ちて気づけるが、`forbidText` は落ちないまま無力化する。禁止した文字列が新formatで出現不能になると、その禁止は何も守らなくなる。注意は、自動で検出できない側へ割く。
- skill内容はsession開始時にcacheされる。skillを変更したsession内では変更が反映されない。変更後のskillで動作を確認するには新しいsessionで起動する。
