# Design: 直す・作る時の到達点を「機能すること」に置く

## 元の依頼内容

利用先 repository の steering で示された原則を、`escalate-plugin-skill-fix` で引き渡されたものである。利用者の指示で一度保留し、利用者の解除指示で再開した。利用先固有の情報を除いて記録する。

- 提案: 直す・作る時の到達点を「間違いが無いこと」ではなく「機能すること」に置き、今の視座で現実的に届く限界を目指す原則を、思考標準（`plugins/tumeda-dev/docs/think_standards/`）へ足す。
- 必要だと分かった具体例（利用先 repository の一つの作業の中で続けて起きた）:
  1. AI で開発する環境を整える作業で、上位の設計に並んだ設定 file を置くだけで終え、それらが置き換える指針の仕組みを作らなかった。最低限で止まった。
  2. 一部が code と食い違う既存の概念説明の文書を、置くべき場所にあるのに「間違っているから」と退避しようとした。間違いを無くすことだけを見ていた。
  3. 参考の文書の節を埋めるため、その作業では決められない product の判断（何ができれば及第点か）を問いにいった。100 点を描いて範囲の外まで詰めにいった。
- 根拠: 是正の基準を「誤りが無いか」に置くと、誤りを含むものを消す・書かない方へ倒れ、場所が空になって使えるものが増えない。
- 合意の範囲: 利用者は、この原則を思考標準へ引き渡すことに合意した。原文は「ok。今回の間違いをしないことではなく機能することを優先する、20点なのに100点を勝手に夢想して、100点から見て欠けてるところだけ小賢しく見るのでなく、30点になること、今機能することを優先する（少し頑張れば80点になるのに、30点に甘んじるのは違う話。今いる視座の中で現実的に行ける限界を目指すこと）ということはthink-standardへのエスカレ対象」。置き場と文面は assistant の下書きで、この design で改めて合意する。
- 引き渡しに添えられた別の気づき（利用者は未判断）: `questioning_existing.md` の分類（残す・移す・消す）に「直す」が無い。

---

## TL;DR

直す・作る時に、到達点を「間違いが無いこと」に置いて誤りを含むものを消す方へ倒れる失敗と、理想の完成形から逆算して最低限で止まる・範囲の外まで詰める失敗が、同じ作業の中で続けて起きた。思考標準の「考え始めるとき」に補助節を一つ足し、到達点を「今より機能すること」に置き、今の視座で現実的に届く限界を目指す判断を、読み手が提案を作るたびに引けるようにする。

---

## 完成後の姿

### documentationによって成立する知識体系

**形式知化する対象:**

- pain: 直す・作る時、到達点を「間違いが無いこと」に置くと、誤りを含むものを消す・書かない方へ倒れ、場所が空になる。到達点を理想の完成形から逆算すると、欠けの多さに対して最低限で止まるか、今の作業では決められない範囲まで詰めにいく。
- 引き上げる原則: 到達点は「今より機能すること」に置く。今 20 点ならまず 30 点にする。少し頑張れば 80 点に届くのに 30 点で止めない。今の視座で現実的に届く限界を目指す。

**読者と成立させる判断:**

| 読者 | 利用場面 | 可能になる判断 | 入口 |
| --- | --- | --- | --- |
| 直す・作る agent と利用者 | 既存のものを直す、新しく作る、提案の到達点を決める時 | 誤りを含むものを消すか直すかを、機能するかで決める。到達点を、理想からの欠けではなく、今の視座で届く水準で決める | `think_standards/README.md` の場面「考え始めるとき」→ `starting_to_think.md` の補助節 |

**知識構造:**

```text
場面「考え始めるとき」（主軸: 事象から原因へ降り、提案を検証まで通す）
├── 主軸の検証の段: 弱点の有無ではなく、課題が解けそうかで測る
└── 補助: 到達点は「間違いが無いこと」ではなく「機能すること」に置き、今の視座で届く限界を目指す
    ├── 原則（到達点を今より機能することに置く。検証の段と同じ向き）
    ├── 到達点の高さ（100 点から逆算しない。まず 30 点、80 点に届くなら 30 点で止めない）
    ├── 実際に落ちた形（最低限で止まる、間違いを無くす方へ倒れる、範囲の外まで詰めにいく）
    ├── 文脈を離れた例（一部が古くなった API の README）
    ├── 境界（消すことは禁じない。届く限界は work_scope.md が決める作業の範囲の中で測る）
    └── やってしまいがちな行動 / それをやると何が起きるか / 正しい判断のための問い
```

**規範の根拠と適用境界:**

- 根拠となる失敗: 元の依頼内容の具体例 1〜3。
- 適用対象: 既存のものを直す時、新しく作る時、提案の到達点を決める時。
- 適用しない範囲: 必然性の無いものや誤った案内しかしない記述を消す判断。消した方が機能するので、この原則は妨げない。
- 誤適用: 「少し頑張れば届く」を、今の作業の目的の外へ広げる根拠にすること。届く限界は、`work_scope.md` が決める作業の範囲の中で測る。消すことを一律に禁じる根拠にすること。

**snapshotと維持規律:**

| 正しいsnapshot | single source of truth | 更新owner | 更新trigger | 腐敗signal・同時確認先 |
| --- | --- | --- | --- | --- |
| 補助節が場面「考え始めるとき」にあり、`validate-plugin.mjs` が見出しを検査している | `plugins/tumeda-dev/docs/think_standards/starting_to_think.md` | 思考標準を変える後続改善者（`evolution_policy.md` に従う） | 場面の追加・統合・分割、主軸と補助の入れ替え | 見出しを変えた時に `validate-plugin.mjs` の `requireText` が落ちる |
| 場面「既存のものを消す・残すを判断するとき」の分類が四つ（残す・直す・移す・消す）で、補助節へ所在を示している | `plugins/tumeda-dev/docs/think_standards/questioning_existing.md` | 同上 | 分類の追加・統合、補助節の見出しの変更 | 分類の文を変えた時に `requireText` が落ちる。補助節の見出しを変えた時は、所在の一文も直す |

**完成後のdocument構造:**

- 配置: `plugins/tumeda-dev/docs/think_standards/starting_to_think.md`
- 既存 document へ統合する。場面「考え始めるとき」は提案を作るたびに通り、起点の失敗はどれも、到達点を決めていると気づかないまま提案を作る途中で起きた。新しい場面「到達点を決めるとき」は、その自覚が無い時に引かれない。
- 位置: file の末尾。既存の「正しい判断のための問い」の後に `## 補助: …` を一つ足す。
- 主軸ではなく補助にする。主軸「事象から原因へ降り、提案を検証まで通す」は変えず、`think_standards/README.md` の一行も変えない。検証の段が「課題が解けそうか」で測ると定めており、到達点の高さはその延長にあたる独立した判断である（`evolution_policy.md` の「各場面の主軸は一つにする」）。
- `core.md` へは置かない。問いへの回答や review のように到達点を決めない場面があり、例外なく常時適用するものではない。
- `making_and_choosing_options.md` へは置かない。主軸は判断材料の充足で、到達点の高さは材料の話ではない。案を作る場面からは直接引けないが、提案を作る時は考え始める場面も通る。
- 範囲の外まで詰めにいく失敗は `development_standards/development_flow/work_scope.md` が扱うので、補助の本文からは所在を示す。
- 誤りを含む文書を退避しようとした失敗は、場面「既存のものを消す・残すを判断するとき」で起きた。`questioning_existing.md` の分類（残す・移す・消す）に、必然性があり置き場も正しいが中身の一部が誤っているものの行き先が無かったため、「直す」を足して四分類にし、補助節へ所在を示す。原則の本体は補助節が持ち、`questioning_existing.md` には複製しない。この不備は作業の目的の外だが、一行の変更で今の作業の単位を崩さないので、この作業で扱う（`work_scope.md` の二段目）。

---

## 要件（Requirements）

### MUST（必達）

- 思考標準の維持規律（`evolution_policy.md`）を守る。場面から引けること、場面の主軸を一つに保つこと、失敗起点の知識を残すこと、コアへ置くものを限定すること。
- 利用先 repository の固有情報を含めない（`migration.md`）。
- 追加・変更した節を `scripts/verification/validate-plugin.mjs` の assertion で検査する。
- 配布 version を PATCH で上げる（docs の追加・変更）。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- 他の場面 file と skill 本体の変更。`questioning_existing.md` は、分類に「直す」を足す一行と所在の一文だけを変える。

### 受け入れ基準

- `starting_to_think.md` の末尾、「正しい判断のための問い」の後に、合意した文面の補助節「## 補助: 到達点は「間違いが無いこと」ではなく「機能すること」に置き、今の視座で届く限界を目指す」がある。主軸と `think_standards/README.md` の一行は変わっていない。
- `validate-plugin.mjs` が追加した見出しを検査している。
- `questioning_existing.md` の分類が、残す・直す・移す・消すの四つになり、中身の一部の誤りは直す理由であることと、補助節の所在が書かれている。`validate-plugin.mjs` が「（直す）」を含む分類の文を検査している。
- `node scripts/verification/validate-plugin.mjs` が通る。
- 配布 version の宣言値 4 か所と `expectedRelease` が `8.3.4` で揃っている。
- 追記した範囲に、利用先 repository の固有情報が無い。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 原則が「少し頑張れば届く」を口実に、範囲の外まで広げる根拠として読まれる | 補助節に、届く限界は `work_scope.md` が決める作業の範囲の中で測ること、「少し頑張れば届く」を目的の外へ広げる根拠にしないことを書く |
| 補助節が、消すことを一律に禁じる根拠として読まれる | 補助節に、必然性の無いものや誤った案内しかしない記述は消した方が機能すること、基準は機能するかであることを書く |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs` が通る。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/docs/think_standards/starting_to_think.md`: 場面「考え始めるとき」。主軸は「事象から原因へ降り、提案を検証まで通す」。検証の段は「弱点の有無を形式として求めない」「見るのは、提案を出す起点になった課題に対して解決が図れそうかである」と定める。補助節は無い。
- `plugins/tumeda-dev/docs/think_standards/questioning_existing.md`: 場面「既存のものを消す・残すを判断するとき」。主軸は「理由を歴史的経緯と合理的必然性へ分離し、必然性だけを残す」。分離した結果を「残す・移す・消す」の三つに分ける。
- `plugins/tumeda-dev/docs/think_standards/making_and_choosing_options.md`: 場面「案を作る・提示する・選ぶとき」。主軸は「材料が枯れていないと、案も作れず、選ぶこともできない」。
- `plugins/tumeda-dev/docs/think_standards/evolution_policy.md`: 場面の追加・統合・分割、主軸と補助の入れ替え、補助節の追記が許される変更。補助判断の見出しには「補助:」を付ける。
- `plugins/tumeda-dev/docs/development_standards/naming/review.md`「評価基準を到達可能な水準へ合わせる」: 命名のレビューに限って、理想の 100 点基準を当てず、同じ性質の対象が世の中で名付けられている水準で測ると定める。
- `plugins/tumeda-dev/docs/development_standards/development_flow/work_scope.md`: 目的の外の判断は設計の論点にしない（一段目）。目的の外の不備は小さければ今の作業で拾う（二段目）。
- `scripts/verification/validate-plugin.mjs`: `expectedRelease` は `8.3.3`。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/docs/think_standards/starting_to_think.md` | 末尾に補助節「## 補助: 到達点は「間違いが無いこと」ではなく「機能すること」に置き、今の視座で届く限界を目指す」を追記 | `document-review` の更新時観点（濃さ、記法、指示対象、既存記述の直し方、機密性、暫定性）で指摘なし。利用先固有名の grep で 0 件 | [documentationによって成立する知識体系](#documentationによって成立する知識体系) |
| `plugins/tumeda-dev/docs/think_standards/questioning_existing.md` | 分類を残す・直す・移す・消すの四つにし、中身の一部の誤りは直す理由であることと補助節の所在を一文足した | `document-review` の更新時観点で指摘なし。三分類を書いている箇所はこの一行だけ（`.steering/` を除く git grep） | [完成後のdocument構造](#完成後のdocument構造) |
| `scripts/verification/validate-plugin.mjs` | 追加した見出しと「（直す）」を含む分類の文の `requireText`、`expectedRelease` を `8.3.4` へ | `node scripts/verification/validate-plugin.mjs` で `plugin validation passed`。各検査は対象の文を一時的に変えると落ちることを確認 | [要件（Requirements）](#要件requirements) |
| `plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`（2 か所） | `version` を `8.3.4` へ（PATCH。docs の追加・変更） | 同上。`node scripts/verification/test-task-design-handoff.mjs` passed、`inspect-discussion.test.mjs` 24 pass・0 fail・1 skip | [要件（Requirements）](#要件requirements) |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし
