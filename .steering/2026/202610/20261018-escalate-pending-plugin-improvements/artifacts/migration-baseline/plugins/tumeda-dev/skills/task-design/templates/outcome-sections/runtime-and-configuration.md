### runtime・設定・環境構築

<!--
移行元:
- templates/design.md「docs・設定・環境構築系 deliverable」
- task-design/SKILL.md「観点4」
- tasklist-design.md「品質check」

設定file名を列挙するのではなく、完成後にどの条件がどの挙動を決め、
不足・不整合時にsystemがどう反応するかを設計する。

なぜ必要か:
- environment variable、dependency、build settingは値と解決元が曖昧だと、実装者が環境差を推測するため。
- 「Vitest環境を構築する」のようなlistingでは、配置、test discovery、setup、実行commandが決まらないため。
- secret値を書かずに、secret ownerと不足時の挙動を合意する必要があるため。

NG:
- 環境変数を追加する
- build設定を直す
- test環境を作る
- repository固有commandを推測して固定する

具体的な記述例:
Vitest環境:
- vitest.config.ts / test/setup.tsはrootに置く
- test codeは対象fileと同じdirectoryへco-locationする
- 実行commandはrepository contextが返したものを使う

記述のMUST:
- identifier、値そのものではなく値の解決元、影響する挙動を対応付ける。
- environmentごとの差、default、不足・不整合時のfail-fast / fallback / recoveryを示す。
- config、setup、dependencyの配置と既存patternを示す。
- secret値そのものは記録しない。
- repository固有commandと環境はmaintenance-plugin-contextが返した範囲だけを使う。

判断基準:
- 新しい環境で、何をどこから与えれば同じ挙動になるか読めるか。
- 不足時に黙ってdefaultへ流れるか、明示errorにするかが決まっているか。
- local、test、production等の差を実装者が推測せずに済むか。
-->

**実行条件と設定:**

| identifier / dependency | 値または解決元 | default | 影響する挙動 |
| --- | --- | --- | --- |
| `{identifier}` | {context / config / secret owner} | {なし / 具体値} | {観測可能な挙動} |

**環境別の完成状態:**

| environment | 配置・起動条件 | 観測可能な結果 |
| --- | --- | --- |
| {local / test / production等} | {config、dependency、commandの解決元} | {成立する挙動} |

**不足・不整合時:**

- {条件}: {fail-fast / fallback / error表示 / recovery}

**file配置と既存pattern:**

- `{path}`: {役割}
- 参照する既存pattern: `{pathまたはcontext}`
