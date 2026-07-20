# ai_agent_dev_skill_plugin
tumedaが、リポジトリ横断でよく使うskill集としてのplugin。
特定テーマに特化したものは順次切り出す

## 運用契約

- 共有手順の正本はこのpluginに置く。利用先repositoryへ同じskill本文をコピーしない。
- repository固有の文書・command・規約は、`<repository-root>/.agents/skills/tumeda-dev-plugin-context.md`に置く。作成・更新・読取範囲の解決は`maintenance-plugin-context`だけが担う。
- shared skillはrepository固有の固定path・固定commandを暗黙に読まない。必要な文脈はcontext maintainerから返された範囲だけを使う。
- hostごとのmodel差は`runtime-model-profiles.md`の能力profileで吸収する。provider固有model名はskill手順の正本にしない。
