# Design: 基盤を変えた後に、影響下の動きをすべて確かめる標準を書く

## 元の依頼内容

利用先 repository の作業から、`escalate-plugin-skill-fix` で引き渡された（2026-11-01）。

利用者の指示（原文）:

> deploy。あと、シンプルにログの書き込み失敗に今気付いてるのはやばい。オーケストレーションの結果上澄みのサイトが開けてることで良しとした結果であり。構造変えた後に関しては、一応変えたコンポーネントの影響下で意図通りの動きをしているか全て観に行くことは必須。これもさっきのプラグインのドキュメントに書こうか。今回の失敗事例も載せて

「さっきのプラグインのドキュメント」は、同じ日に作った開発標準の infrastructure の群（`development_standards/infrastructure/`）を指す。

引き渡された具体例:

- 利用先で、SSR の app を infrastructure as code で作って公開した時、受け入れは「公開 URL で機能が使える」「認証が効く」「再適用で差分が出ない」だった。app にログを書く role が無く、本番の SSR のログは一度も出ていなかった。気付いたのは約 2 か月後、定期実行が時間上限で切られた原因を調べようとした時で、server 側で何が起きたかを確かめられなかった。
- 同じ app に role を付けた後も、apply の成功と画面が開くことでは、ログが書かれているかは分からなかった。log group を見に行くと作られておらず、deploy し直した後に初めてログが出た。

合意の範囲: plugin の infrastructure の群に書くこと、方針（構造を変えた後は、変えた component の影響下で意図どおりに動いているかをすべて見に行くことは必須）、失敗事例を載せることは、上の原文による。file 名、本文（列挙の観点を含む）は、この作業の設計で利用者と合意した（[議論記録](./task-design-discussion.md)）。

---

## TL;DR

利用先で、基盤を作った・変えた後の確かめを「画面が開く」といった上澄みの結果で済ませ、本番のログが一度も書かれていないことに約 2 か月気付かなかった。
plugin の開発標準の infrastructure の群に、基盤の構造を変えた後は、変えた component の影響下にある動きをすべて実物で確かめるという標準を、この失敗事例とともに書く。`task-design` は設計前調査で開発標準の配下をすべて読むため、基盤を変える作業の受け入れ基準を設計する時にこの標準に触れる。

---

## 完成後の姿

### documentationによって成立する知識体系

**形式知化する対象:**

- 暗黙知・pain: 基盤を変えた後の確かめが、利用者から見える上澄みの結果（画面が開く、apply が成功する）で止まる。その下で動く component（ログの出力、権限、定期実行など）が動いていないことに、必要になるまで気付かない。
- 再利用可能な原則へ引き上げるもの: 変えた component の影響下にある動きを列挙し、それぞれを実物で確かめるまで完了としない、という判断基準と、列挙の観点、判断の問い。

**読者と成立させる判断:**

| 読者 | 利用場面 | codeや過去会話を再調査せず可能になる判断・action | 入口・読む順序・検索語 |
| --- | --- | --- | --- |
| `task-design` を実行する assistant | 基盤（cloud の resource、その構成）を作る・変える作業の受け入れ基準と tasklist を設計する時 | 変えた component の影響下の動きを列挙し、それぞれの確かめ方を受け入れ基準と task に入れる | `task-design` の設計前調査（開発標準の配下をすべて読む）。`development_standards/README.md` の索引。検索語: 確かめ、影響、上澄み |
| `tasklist-executor` を実行する assistant | 基盤の変更を適用した後の確認 task | 上澄みの結果で完了とせず、列挙した動きを実物で確かめる | tasklist の task（`task-design` が標準から書く） |

**知識構造:**

```text
変更の後の確かめ（change_verification.md）
├── 変えた component の影響下にある動きを、すべて実物で確かめる
│   ├── MUST: 影響を受ける動きを列挙し、それぞれを実物で確かめるまで完了としない
│   ├── MUST: 上澄みの結果（画面が開く、apply が成功する）だけで完了としない
│   ├── 理由: 上澄みは下の component の一部しか通らず、欠落は必要になるまで表に出ない
│   ├── 列挙の観点: 利用者の操作 / 操作を伴わない処理 / 出力 / 権限 / 共有する別の環境 / 作る・更新する経路
│   ├── 確かめにくい動き: 確かめる時と方法を決めて残す
│   └── 判断の問い: まだ実物で確かめていない動きは何か
└── 失敗事例: ログの欠落に約 2 か月気付かなかった / role を付けても deploy し直すまでログが出なかった
```

**規範の根拠と適用境界:**

- 根拠となるpain・失敗: 上の二つの失敗事例。
- MUST: 変えた component の影響下の動きを列挙し、すべて実物で確かめる。上澄みの結果だけで完了としない。
- SHOULD: なし
- MAY: なし
- 適用対象: 基盤（cloud の resource とその構成）を作る・変える作業の受け入れ基準と確認。
- 例外・非目標: すぐに確かめにくい動き（費用、時刻）は、確かめる時と方法を決めて残してよいが、確かめるまで完了としない。
- 誤適用: 影響を受けない動きまで毎回すべて確かめること。列挙するのは、変えた component が関わる動きである。

**snapshotと維持規律:**

| 正しいsnapshot | single source of truth | 更新owner | 更新trigger | 腐敗signal・同時確認先 |
| --- | --- | --- | --- | --- |
| 基盤を変えた後の確かめの判断基準 | `plugins/tumeda-dev/docs/development_standards/infrastructure/change_verification.md` | plugin repository の steering | 利用者の方針の変更。上澄みの確かめで見落とした新しい事例 | `development_standards/README.md` の「維持規律」の file 数・分量が実物と合わない。`log_retention.md` との重複 |

**完成後のdocument構造:**

- 配置: `plugins/tumeda-dev/docs/development_standards/infrastructure/change_verification.md`
- 形式: Markdown。h1 の下に、確かめる範囲の h2 と、失敗事例の h2 を置く。
- 既存documentへ統合するか: 同じ群の `log_retention.md` は「ログをどれだけ残すか」であり、確かめ方は別の判断で、ログ以外（権限、build、定期実行）にも及ぶ。file を分ける。
- `development_standards/README.md`: infrastructure の群の索引に足し、「維持規律」を 15 file・約 64KB と内訳に直す。

---

## 要件（Requirements）

### MUST（必達）

- 利用者の方針（構造を変えた後は、変えた component の影響下で意図どおりに動いているかをすべて見に行く）を、開発標準の infrastructure の群に判断基準として書く。
- 失敗事例（上澄みで良しとしてログの欠落に約 2 か月気付かなかった）を載せる。
- `development_standards/README.md` の「収録している標準」から新しい文書へ辿れる。「維持規律」の file 数・分量が実物と合う。
- 利用先固有の情報を書かない（`maintenance_policies/migration.md`）。
- 配布 version を PATCH で上げる。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- skill の本文の変更。`task-design` は既に開発標準の配下をすべて読む。
- 利用先 repository の docs への記載。

### 受け入れ基準

- 新しい文書が `development_standards/infrastructure/` にあり、`development_standards/README.md` の索引から辿れる。
- `node scripts/verification/validate-plugin.mjs` が通る。
- 追加・変更した範囲を利用先の repository 名・絶対 path で grep して、ヒットしない。
- 新しい文書と README の変更が、`document-review` の作成時観点・更新時観点を満たす。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 「すべて確かめる」が、何を列挙すればよいか分からない標語になる | 列挙の観点（6 つ）と判断の問いを本文に持たせる |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs`
- 追加・変更した範囲の grep（利用先の repository 名・絶対 path）
- `document-review` を新しい文書と README の変更へ当てる

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/docs/development_standards/README.md`: 開発そのものの標準を置く。`task-design` は配下をすべて読む。「維持規律」は 14 file・約 60KB と書く。
- `plugins/tumeda-dev/docs/development_standards/infrastructure/log_retention.md`: 同じ群の既存の文書。ログをどれだけ残すかを扱い、ログが書かれているかの確かめは扱わない。
- `.agents/skills/tumeda-dev-plugin-context.md` の「version bump」: docs の追加・変更は PATCH。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/docs/development_standards/infrastructure/change_verification.md` | 新しく作り、合意した本文を書いた | `document-review` の作成時観点で確認。利用先の repository 名・絶対 path の grep はヒットなし | [完成後の姿](#完成後の姿) |
| `plugins/tumeda-dev/docs/development_standards/README.md` | infrastructure の群の索引に足し、「維持規律」を 15 file・約 64KB と内訳に直した | `find` で 15 file、`wc -c` で 64,153 byte | [完成後の姿](#完成後の姿) |
| 配布 version（宣言値 4 箇所と `expectedRelease`） | 8.2.3 から 8.2.4 へ | `node scripts/verification/validate-plugin.mjs` が「plugin validation passed」 | [要件（Requirements）](#要件requirements) |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし。対象は docs の content であり、本番 application coding に当たらない。
