### runtime・設定・環境構築

<!--
移行元:
- templates/design.md「docs・設定・環境構築系 deliverable」
- task-design/SKILL.md「観点4」
- tasklist-design.md「品質check」

設定fileの名前を並べるのではなく、完成後にどの条件がどの挙動を決め、
足りない・食い違う時にsystemがどう反応するかを設計する。

なぜ必要か:
- 環境変数、依存、buildの設定は、値と値の取得元が曖昧だと、実装者が環境による違いを推測するため。
- 「Vitest環境を構築する」のような列挙では、配置、testの見つけ方、setup、実行commandが決まらないため。
- secretの値を書かずに、secretの管理元と不足時の挙動を合意する必要があるため。

NG:
- 環境変数を追加する
- build設定を直す
- test環境を作る
- repository固有のcommandを推測して固定する

具体的な記述例:
Vitest環境:
- vitest.config.ts / test/setup.tsはrootに置く
- test codeは対象fileと同じdirectoryへ置く
- 実行commandはrepository contextが返したものを使う

記述のMUST:
- 設定名、値そのものではなく値の取得元、影響する挙動を対応付ける。
- 環境ごとの違い、既定値、足りない・食い違う時に、すぐ止めるか、代わりの値で続けるか、どう復旧するかを示す。
- config、setup、依存の配置と、倣う既存の書き方を示す。
- secretの値そのものは記録しない。
- repository固有のcommandと環境は、maintenance-plugin-contextが返した範囲だけを使う。

判断基準:
- 新しい環境で、何をどこから与えれば同じ挙動になるかを読めるか。
- 足りない時に、黙って既定値へ流れるか、明示的にerrorにするかが決まっているか。
- local、test、production等の違いを、実装者が推測せずに済むか。
-->

**実行条件と設定:**

| 設定名・依存 | 値または値の取得元 | 既定値 | 影響する挙動 |
| --- | --- | --- | --- |
| `{設定名}` | {context / config / secretの管理元} | {なし / 具体値} | {外から確かめられる挙動} |

**環境別の完成状態:**

| 環境 | 配置・起動条件 | 外から確かめられる結果 |
| --- | --- | --- |
| {local / test / production等} | {config、依存、commandの取得元} | {成り立つ挙動} |

**不足・不整合時:**

- {条件}: {すぐ止める / 代わりの値で続ける / error表示 / 復旧}

**fileの置き場所と、倣う既存の書き方:**

- `{path}`: {役割}
- 倣う既存の書き方: `{pathまたはcontext}`
