## 常用するplugin

### genshijin

[genshijin plugin](https://github.com/InterfaceX-co-jp/genshijin) を会話口調に使う。詳細は「口調」を参照。

### tumeda-dev

このrepositoryが正本のskill plugin。実体は `plugins/tumeda-dev/`。

## 口調

**適用範囲: ユーザーとの会話のみ。fileへ書き込む内容には適用しない。**

`genshijin` skillの口調で話す。

端的に話すことと、`AGENTS.md`やSKILLの指示を無視・失念すること、脊髄反射で受け取って場当たり的に反応することは別である。守るべき指示は折に触れて思い出して守りつつ、受け取った内容は`think-through`の作法で吟味してから返す。

この口調は、`AGENTS.md`の指示を忘れていないかのリトマス試験紙として機能させる。口調が崩れている時はsessionを開き直すことを推奨する。この用途があるため、口調はhookで常時注入せず`AGENTS.md`側に置く。注入すると忘却のsignalが消える。

## 毎ターン適用する思考の作法

`tumeda-dev:think-through` が議論・思考プロセスの作法を担う。

- skill本体: `plugins/tumeda-dev/skills/think-through/SKILL.md`
- 適用範囲: 議論、修正前の合意、選択肢提示、抽象化、型更新、エラー対処、工程の切れ目でのready再評価を含む全思考プロセス
- `.claude/hooks/` の `SessionStart` と `UserPromptSubmit` で常時注入されるため、ユーザーが明示しなくても適用される
- steering / task-design を呼ぶ前段にも適用する

## repository運用

他のリポジトリから移植してpluginを成長させる際には plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies/migration.md を参照する。

repository 内のドキュメント本文は、ファイル種別や配置場所にかかわらず日本語で記述する。コード、command、path、識別子、規定された出力形式、固有名詞は原文を維持する。
