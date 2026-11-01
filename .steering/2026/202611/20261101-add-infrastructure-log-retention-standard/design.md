# Design: 開発標準に infrastructure の群を作り、ログの保存方針を書く

## 元の依頼内容

利用先 repository の作業から、`escalate-plugin-skill-fix` で引き渡された（2026-11-01）。

利用者の指示（原文）:

> 基本言ってもらったの全部オッケー。プラグインの開発方針のところあったら、infrastractureというファイルかディレクトリ切ってそこにもログ方針書いておいて。

利用者の方針（原文、同日の直前の発言）:

> awsサービス個別のログはそのサービス閉じたら消していいけど、アプリケーションログは永続的に残したい。どうせ個人アクセスだから大した量残らないし。

引き渡された具体例: 利用先 repository で、本番の SSR の app のログを CloudWatch Logs へ出す変更を設計した時、assistant が保存期間 90 日を推奨し、利用者に無期限を選ばれた。別の利用先 repository でも以前、7 日の保存期間を提案して却下されていた。どちらの repository でも、方針は docs に無く、Terraform の comment や作業記録にしか無かった。

合意の範囲: plugin へ書くこと、置き場所（開発方針の所に infrastructure という file か directory）、方針の中身は、上の原文による。directory にすること、file 名、本文（MUST の粒度を含む）は、この作業の設計で利用者と合意した（[議論記録](./task-design-discussion.md)）。

---

## TL;DR

利用先の作業で、assistant は application のログに短い保存期間（7 日、90 日）を推奨し、二つの repository で利用者に却下された。利用者の方針（application のログは無期限に残す、cloud の service が自分で持つログは service と一緒に消えてよい）が、どの docs にも書かれていなかったためである。
plugin の開発標準（`plugins/tumeda-dev/docs/development_standards/`）に infrastructure の群を新設し、この方針を判断基準として書く。`task-design` は設計前調査で開発標準の配下をすべて読むため、次にログの保管先を設計する assistant はこの方針に触れてから案を出す。

---

## 完成後の姿

### documentationによって成立する知識体系

**形式知化する対象:**

- 暗黙知・pain: ログの保存期間についての利用者の方針が、利用者の頭の中と、利用先の Terraform の comment・作業記録にしか無い。assistant は費用を理由に短い保存期間を既定のように推奨し、利用者が二度却下した。
- 再利用可能な原則へ引き上げるもの: ログを「application が出すもの」と「cloud の service が自分で持つもの」に分け、前者は保存期間を付けずに残す、という判断基準と、どちらかを見分ける判断質問。

**読者と成立させる判断:**

| 読者 | 利用場面 | codeや過去会話を再調査せず可能になる判断・action | 入口・読む順序・検索語 |
| --- | --- | --- | --- |
| `task-design` を実行する assistant | 利用先で、ログの保管先（log group 等）を作る・保存期間を決める設計 | 保存期間を付けない案を既定として出す。保管先が resource の削除に連れて消えない形にする | `task-design` の設計前調査（開発標準の配下をすべて読む）。`development_standards/README.md` の索引。検索語: 保存期間、retention、log group |
| 利用先の docs を書く人 | 利用先 repository の infrastructure の README に方針を写す時 | plugin の標準を出典として、利用先固有の具体（resource 名、設定値）だけを足す | 同上 |

**知識構造:**

```text
ログの保存期間（log_retention.md）
├── application のログは無期限に残す
│   ├── 定義: application の code が動いた結果として出る記録
│   ├── MUST: 保管先に保存期間を付けない
│   ├── MUST: ログを出す resource を消しても残す（IaC では削除に連れて消えない形）
│   ├── 理由: さかのぼって調べる / 個人規模では量が小さく費用は決め手にならない
│   └── 前提が変わる場合: 量が費用を左右する application では残す期間を利用者と決める
├── cloud の service が自分で持つログは、service と一緒に消えてよい
│   ├── 例: Amplify Hosting の SSR の出力（application）と build のログ（service）
│   └── 判断の問い: application の code が出すものか、service が自分の動作について持つものか
└── やってしまいがちな失敗: 費用を理由に 7 日・90 日を既定のように推奨する
```

**規範の根拠と適用境界:**

- 根拠となるpain・失敗: 方針が docs に無く、assistant が費用を理由に短い保存期間を推奨し、二つの利用先 repository で却下された。
- MUST: application のログの保管先に保存期間を付けない。application のログを出す resource を消しても、ログを残す。
- SHOULD: なし
- MAY: なし
- 適用対象: cloud の基盤へ出すログの保管先を設計する時。
- 例外・非目標: ログの量が保存の費用を左右するほど大きい application では、無期限を当てはめず、残す期間を利用者と決める。利用者の理由「どうせ個人アクセスだから大した量残らない」を、適用の前提として書く。
- 誤適用: cloud の service が自分の動作について持つログ（build、deploy のログ等）に、残すための保管先を別に作ること。これらは service と一緒に消えてよい。

**snapshotと維持規律:**

| 正しいsnapshot | single source of truth | 更新owner | 更新trigger | 腐敗signal・同時確認先 |
| --- | --- | --- | --- | --- |
| 利用者のログの保存方針 | `plugins/tumeda-dev/docs/development_standards/infrastructure/log_retention.md` | plugin repository の steering | 利用者の方針の変更。新しい種類のログ（例: 非同期の job のログ）の扱いが問われた時 | 利用先の docs が異なる方針を書いている。`development_standards/README.md` の「維持規律」の file 数・分量が実物と合わない |

**完成後のdocument構造:**

- 配置: `plugins/tumeda-dev/docs/development_standards/infrastructure/log_retention.md`
- 形式: Markdown。h1 の下に、application のログ、service のログ、やってしまいがちな失敗の h2 を置く。
- 既存documentへ統合するか: 新しい群 `infrastructure/` を作る。開発標準の「この群の置き方」は、何を作るかの標準を既存の群に当たらなければ新設するとしており、ログの保管先は命名・エンティティ設計・開発の進め方のどれにも当たらない。infrastructure は分野の名前で、権限や費用など同じ分野の標準が後から入りうるため、file ではなく directory にする。1 file の間は `development_flow/` と同じく README を置かず、索引を親 README に置く。
- file 名: 同階層の慣習（docs は snake_case）に揃え、親が語る「infrastructure」を重ねない。中身は「ログをどれだけ残すか」なので `log_retention`。

```text
development_standards/README.md
├── 収録している標準
│   └── **infrastructure/** — 本番の基盤（cloud の resource）の作り方の判断基準。
│       └── log_retention.md — ログをどれだけ残すか。…
└── 維持規律: 14 file・約 60KB（内訳に `infrastructure/` に log_retention を足す）
```

---

## 要件（Requirements）

### MUST（必達）

- 利用者の方針の二点（application のログは無期限に残す、cloud の service が自分で持つログは service と一緒に消えてよい）を、開発標準の infrastructure の群に判断基準として書く。
- `development_standards/README.md` の「収録している標準」から新しい文書へ辿れる。「維持規律」の file 数・分量が実物と合う。
- 利用先固有の情報（repository 名、絶対 path、固有の resource 名）を書かない（`maintenance_policies/migration.md`）。
- 配布 version を PATCH で上げる（docs の追加は PATCH。`.agents/skills/tumeda-dev-plugin-context.md` の「version bump」）。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- 利用先 repository の docs への記載。各利用先の作業で、その repository の docs に書く。
- skill の本文の変更。`task-design` は既に開発標準の配下をすべて読むため、新しい導線は要らない。

### 受け入れ基準

- 新しい文書が `plugins/tumeda-dev/docs/development_standards/` の infrastructure の群にあり、`development_standards/README.md` の索引から辿れる。
- `node scripts/verification/validate-plugin.mjs` が通る。
- 追加・変更した範囲を利用先の repository 名で grep して、ヒットしない。
- 新しい文書と README の変更が、`document-review` の作成時観点・更新時観点を満たす。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 「どうせ個人アクセスだから」という前提を書き落とし、量の大きい application にも無条件に当てはめられる | 前提を理由として書き、「前提が変わる場合」に、量が費用を左右する application では残す期間を利用者と決めると書く |
| 開発標準の「配下をすべて読む」契約の分量が増える | 新しい文書は 1 file・数 KB に収める。README の「維持規律」の数字を更新する |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs` で、version の 5 箇所と manifest の整合を確かめる。
- 追加・変更した範囲を利用先の repository 名・絶対 path で grep する。
- `document-review` を新しい文書と README の変更へ当てる。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/docs/development_standards/README.md`:
    - 「この群の置き方」: 開発そのもの（何を作るか、どう名付けるか、どう進めるか）は開発標準の配下に置き、既存の群に当たらなければ新設する。docs の書き方は `documentation_standards/`、思考のプロセスは `think_standards/`。
    - 「この群の引き方」: `task-design` は設計判断へ入る前に、この群の配下をすべて読む。
    - 「維持規律」: file を増やす時は、増やした後も「すべて読む」契約が成立するかを確かめる。現在は 13 file・約 57KB と書かれている。
    - 既存の群は、README を持つ directory（`naming/`、`entity_modeling/`）と、README を持たず索引だけ親 README に置く directory（`development_flow/`）がある。
- `plugins/tumeda-dev/docs/development_standards/naming/file.md`: 同階層と表記・抽象度を揃える。docs は snake_case。親が語ることを file 名に重ねない。
- `.agents/skills/tumeda-dev-plugin-context.md` の「version bump」: docs の追加・変更は PATCH。宣言値 4 箇所と `scripts/verification/validate-plugin.mjs` の `expectedRelease` 1 箇所を一度に変える。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/docs/development_standards/infrastructure/log_retention.md` | 新しく作り、本文を書いた | `document-review` の作成時観点で確認（指示対象の明示で一箇所を直した）。利用先の repository 名・絶対 path の grep はヒットなし | [完成後の姿](#完成後の姿) |
| `plugins/tumeda-dev/docs/development_standards/README.md` | 「収録している標準」に infrastructure の群を足し、「維持規律」を 14 file・約 60KB と内訳に直した | `find` で 14 file、`wc -c` で 60,935 byte。`document-review` の更新時観点で確認 | [完成後の姿](#完成後の姿) |
| 配布 version（宣言値 4 箇所と `expectedRelease`） | 8.2.2 から 8.2.3 へ | `node scripts/verification/validate-plugin.mjs` が「plugin validation passed」 | [要件（Requirements）](#要件requirements) |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし。対象は docs の content であり、本番 application coding に当たらない。合意済み内容から一意に反映でき、一つの連続した反映・validation で完了できる。
