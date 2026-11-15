# Design: 守れなかった既存の原則へ、具体例を足す

## 元の依頼内容

利用先 repository の steering の終了前 review（再発防止）で見つかり、`escalate-plugin-skill-fix` で引き渡された改善 2 件である。利用者の指示で一度保留し、利用者の解除指示（「ok。じゃあエスカレ続けて」）で再開した。利用先固有の情報を除いて記録する。

どちらも、plugin に既にある原則を、利用先の作業の中で守れずに起きた。原則は足りているが、その失敗の形を防ぐ具体例が無い。doc-enricher の抽象化の段の 1（既存の文書に同じ原則があり、作業の中で原則を守れずに誤った前提・提案をした場合は、既存の文書の「やってしまいがちな失敗」に具体例として添える）にあたる。

1. task-design の execution plan 対象の基準（`skills/task-design/SKILL.md` Step 5）
   - 起きたこと: domain の module ごとに、資料と code から案を作り、利用者に確かめてから README を書く文書の作業を、module ごとの task に分けて tasklist にし、その合意を求めた。利用者から「え、tasklistでやることある？全部独立してdesignで合意するごとにできたことでしょ」と指摘され、tasklist を消して design の中で module ごとに論点を立てて書いた。
   - 守れなかった原則: Step 5 の「file数、調査量、discussion回数…だけを掲載理由にしない」「合意済み内容から一意に変更でき…一つの連続した反映・validationで完了できるならtask-design内で扱う」。「利用者に確かめる点がある」ことを、条件 2 の「中間 checkpoint」と読み替えた。
2. 案を作る前の確認（`docs/think_standards/making_and_choosing_options.md`「提案を出す前に確かめる」）
   - 起きたこと: directory の一覧から作業対象（README を置く module）の一覧を作り、各 directory に中身があるかを確かめずに対象へ含めた。一つは将来の module のために置いた空の directory（`.gitkeep` だけ）で、計算する code も table も無かった。その module の論点で初めて気づき、README を置かない形に直した。
   - 守れなかった原則: 「この提案が依拠する前提は確定しているか。調べれば分かることを調べずに前提として置いていないか」「この案をどこから導いたか。既存成果物からの演繹だけになっていないか」。

合意の範囲: 利用者は、2 件を plugin へ渡すことに合意した（原文「ok。」。利用先の再発防止 review で「この 2 つは、001 と同じく保留メモに残し、001 と一緒に後で plugin へ渡す、でいい？」と問うた応答）。足す先と文面は assistant の案で、この design で合意する。

---

## TL;DR

plugin に既にある二つの原則（execution plan 対象の基準、案を作る前に前提を確かめる確認）を、利用先の作業で守れなかった。原則は足りているが、その失敗の形を防ぐ具体例が無かった。それぞれの原則の「やってしまいがちな行動」に起きた形を具体例として足し、同じ形の失敗に読み手が自分で気づけるようにする。

---

## 完成後の姿

### documentationによって成立する知識体系

**形式知化する対象:**

- pain 1: 文書・skill 等の作業で、利用者に確かめる点があることを段階実行と読み替え、task-design 内で済む作業を tasklist に載せる。合意と実行の gate が重なり、往復が増える。
- pain 2: 既存の構造（directory の一覧等）から作業対象を列挙し、各対象に中身があるかを確かめない。中身の無い対象に作業を割り当て、その対象に入って初めて気づく。
- 引き上げる原則: 新しい原則は足さない。既存の原則に、起きた形を具体例として添える。

**読者と成立させる判断:**

| 読者 | 利用場面 | 可能になる判断 | 入口 |
| --- | --- | --- | --- |
| task-design を実行する agent | execution plan 対象を判定する時（Step 3 の分類、Step 5 の検証） | 利用者への確認が、案への合意か、実行時の状態を見て初めてできる確認かで、tasklist に載せるかを判定する | `skills/task-design/SKILL.md` Step 5 |
| 案を作る agent と利用者 | 既存の構造から作業対象を列挙する時 | 列挙した各対象に中身があるかを確かめてから、作業対象に含める | `think_standards/README.md` の場面「案を作る・提示する・選ぶとき」→ `making_and_choosing_options.md`「提案を出す前に確かめる」 |

**知識構造:**

```text
skills/task-design/SKILL.md Step 5（execution plan 対象を検証する）
└── 「file数、調査量、discussion回数…を掲載理由にしない」の段落
    └── やってしまいがちな行動 / それをやると何が起きるか / 正しい判断のための問い
        （利用者への確認を中間checkpointと読み替える形。問いで、実行時の状態を見る確認と案への合意を分ける）

場面「案を作る・提示する・選ぶとき」（making_and_choosing_options.md）
└── 提案を出す前に確かめる（三つの確認は変えない）
    ├── やってしまいがちな行動 +1 行（既存の構造から列挙し、中身を確かめずに含める）
    └── それをやると何が起きるか +1 行（一覧の上に積み上がった合意を直し直す）
```

**規範の根拠と適用境界:**

- 根拠となる失敗: 元の依頼内容の 1 と 2。
- 適用しない範囲: 実行して初めて得られる状態を見る中間の確認（batch ごとの件数確認、段階的な公開での指標確認等）は、従来どおり条件 2 として tasklist に載せる。列挙した対象の中身を確かめることは、列挙の元が中身まで保証している場合（生成された一覧をそのまま使う等）には要らない。
- 誤適用: 利用者への確認を含む作業を、確認の中身を見ずに一律に task-design 内で扱うこと。

**snapshotと維持規律:**

| 正しいsnapshot | single source of truth | 更新owner | 更新trigger | 腐敗signal・同時確認先 |
| --- | --- | --- | --- | --- |
| Step 5 に三行の具体例があり、`validate-plugin.mjs` が問いの文を検査している | `plugins/tumeda-dev/skills/task-design/SKILL.md` | task-design を変える後続改善者 | execution plan 対象の条件の変更 | 問いの文を変えた時に `requireText` が落ちる。条件の番号を変えた時は「条件2」の参照も直す |
| 「提案を出す前に確かめる」の箇条に一行ずつあり、`validate-plugin.mjs` が検査している | `plugins/tumeda-dev/docs/think_standards/making_and_choosing_options.md` | 思考標準を変える後続改善者（`evolution_policy.md` に従う） | 節の確認の追加・統合 | 足した文を変えた時に `requireText` が落ちる |

**完成後のdocument構造:**

- task-design: `SKILL.md` Step 5 の「file数、調査量、discussion回数…を掲載理由にしない」の段落の直後に、三行（やってしまいがちな行動 / それをやると何が起きるか / 正しい判断のための問い）を足す。execution plan 対象の基準を持つのは Step 5 だけで、`tasklist-design.md`・`roadmap-design.md`・templates には無い。形は同じ `SKILL.md` の「commitの境界が設計判断になる時」に揃える。NG 集 G の項目は Step 5 を指しているので変えない。
- 思考標準: `making_and_choosing_options.md`「提案を出す前に確かめる」の既存の「やってしまいがちな行動」と「それをやると何が起きるか」に一行ずつ足す。この失敗は、節の確認の一つ目（調べれば分かることを調べずに前提に置いていないか）と三つ目（既存成果物からの演繹だけになっていないか）の両方に当たる。節は確認の数を「実際に起きた失敗の形」に限っているので、確認は足さない。

---

## 要件（Requirements）

### MUST（必達）

- 新しい原則や判定基準を足さない。既存の原則の具体例として添える。
- 利用先 repository の固有情報を含めない（`migration.md`）。
- task-design の `SKILL.md` を変えるので、設計時と編集後に `skill-update-review` を当てる。
- 足した記述を `scripts/verification/validate-plugin.mjs` の assertion で検査する。
- 配布 version を PATCH で上げる（既存 skill と docs の内容修正）。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- execution plan 対象の三条件そのもの、「提案を出す前に確かめる」の三つの確認そのものの変更。

### 受け入れ基準

- task-design `SKILL.md` Step 5 の段落の直後に、合意した三行がある。
- `making_and_choosing_options.md`「提案を出す前に確かめる」の二つの箇条に、合意した一行ずつがある。三つの確認は変わっていない。
- `validate-plugin.mjs` が、足した問いの文と「やってしまいがちな行動」の文を検査している。
- `skill-update-review` を設計時と編集後に当て、結果を議論記録に残している。
- `node scripts/verification/validate-plugin.mjs` が通る。
- 配布 version の宣言値 4 か所と `expectedRelease` が `8.3.5` で揃っている。
- 追記した範囲に、利用先 repository の固有情報が無い。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 具体例が新しい規則として読まれ、既存の原則と二重になる | 既存の段落・確認の直後の「やってしまいがちな行動」として置き、新しい条件や確認を足さない |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs` が通る。
- `node scripts/verification/test-task-design-handoff.mjs` が通る（task-design の `SKILL.md` を変えるため）。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/skills/task-design/SKILL.md` Step 5: execution plan 対象は、本番 application coding、段階実行（順序依存する複数段階、中間 checkpoint、外部調整、rollback 境界、独立した検証単位）、利用者の指定の三つだけ。「file数、調査量、discussion回数、実行可能な言語で書かれていることだけを掲載理由にしない」。
- `plugins/tumeda-dev/docs/think_standards/making_and_choosing_options.md`「提案を出す前に確かめる」: 三つの確認（前提は確定しているか、今決める時期か、どこから導いたか）と、「やってしまいがちな行動」「それをやると何が起きるか」の箇条を持つ。「三つは実際に起きた失敗の形であり、網羅のために足したものではない」と数を限っている。
- `scripts/verification/validate-plugin.mjs`: `expectedRelease` は `8.3.4`。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/SKILL.md` | Step 5 に三行の具体例を追記 | `skill-update-review` を設計時と編集後に当て、この変更に関わる切り出し候補なし（読んだ範囲は `SKILL.md` の全文と、内部指示の見出し・grep まで）。`test-task-design-handoff.mjs` passed | [完成後のdocument構造](#完成後のdocument構造) |
| `plugins/tumeda-dev/docs/think_standards/making_and_choosing_options.md` | 「提案を出す前に確かめる」の二つの箇条に一行ずつ追記 | `document-review` の更新時観点で指摘なし。利用先固有名の grep で 0 件 | [完成後のdocument構造](#完成後のdocument構造) |
| `scripts/verification/validate-plugin.mjs` | 足した二つの文の `requireText`、`expectedRelease` を `8.3.5` へ | `plugin validation passed`。各検査は対象の文を一時的に変えると落ちることを確認 | [要件（Requirements）](#要件requirements) |
| `plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`（2 か所） | `version` を `8.3.5` へ（PATCH。既存 skill と docs の内容修正） | 同上。`inspect-discussion.test.mjs` 24 pass・0 fail・1 skip | [要件（Requirements）](#要件requirements) |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし
