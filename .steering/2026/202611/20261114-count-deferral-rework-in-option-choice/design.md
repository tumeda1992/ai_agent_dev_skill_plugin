# Design: 「後からでもできる」で案を選ぶ時に、延期の間に作られるものを数える

## 元の依頼内容

利用先 repository の steering の終了前 review（再発防止）から、`escalate-plugin-skill-fix` で引き渡された提案である。利用先固有の情報を除いて記録する。

- 提案: 「後からでもできる」を理由に案を選ぶ時は、延期の間にその形を前提に作られるものを数え、後でやる費用に含める。この原則を思考標準へ足す。置き場の候補は `docs/think_standards/making_and_choosing_options.md`。
- 必要だと分かった具体例: 利用先 repository の設計で、application を repository の root に置いたままにするか subdirectory へ移すかを比べた時、「移動は後からでもできる。今やらないと困ることは無い」として root に残す案を推した。後で移すと、それまでに作る container の build 設定、CI の workflow、infrastructure as code が参照する path を書き換え直すことを見落としていた。利用者の別の指摘で見直し、移す案に変わった。
- 根拠: 思考標準に、延期の費用を見積もる原則が無い。起点以外に、DB の列名を後で直す case、test の書き方を後で揃える case でも成り立つ。延期の間に前提に作られるものが無い case では 0 と数えられるため、反例にならない。
- 合意の範囲: 利用者は引き渡すことに合意した（原文「論点2は入れて良いかもね」）。原則の文言、具体例、検証 case は assistant が書いたもので、中身と最終採否はこの design で改めて合意する。

---

## TL;DR

案を選ぶ時に「後からでもできる」を、今やらなくても失うものが無い根拠として使い、延期の間に今の形を前提に作られるものの書き換えを見落とす失敗があった。思考標準の「案を作る・提示する・選ぶとき」に補助節を一つ足し、延期の費用を数えてから「後からでもできる」を使う判断を、読み手が具体例と問いから引けるようにする。

---

## 完成後の姿

### documentationによって成立する知識体系

**形式知化する対象:**

- pain: 案を比べる時、「後からでもできる」を今やらなくても失うものが無い根拠として使い、延期の間に今の形を前提に作られるもの（設定、参照する code、蓄積するデータ等）の書き換えを、後でやる費用から落とす。後になるほど費用が上がる案を、安い案として選ぶ。
- 引き上げる原則: 「後からでもできる」が今やらない理由になるのは、後でやる費用が今と変わらない時だけである。延期の間に前提に作られるものを数え、後でやる費用に含めてから使う。

**読者と成立させる判断:**

| 読者 | 利用場面 | 可能になる判断 | 入口 |
| --- | --- | --- | --- |
| 案を作る・選ぶ agent と利用者 | 今やるか後でやるかで案を比べる時 | 延期の費用を、比べた時点ではなく、やる時点の費用で見積もる。前提に作られるものが無ければ、「後からでもできる」をそのまま使う | `think_standards/README.md` の場面「案を作る・提示する・選ぶとき」→ `making_and_choosing_options.md` の補助節 |

**知識構造:**

```text
場面「案を作る・提示する・選ぶとき」（主軸: 材料が枯れていないと、案も作れず、選ぶこともできない）
└── 補助: 「後からでもできる」は、延期の間に作られるものを数えてから使う
    ├── 原則（今やらない理由になる条件と、費用が増える仕組み）
    ├── 実際に落ちた形（root に置くか subdirectory へ移すか）
    ├── 文脈を離れた例（DB の列名）
    ├── 適用境界（前提に作られるものが無ければ 0。何でも今やる方へ倒すものではない）
    └── やってしまいがちな行動 / それをやると何が起きるか / 正しい判断のための問い
```

**規範の根拠と適用境界:**

- 根拠となる失敗: 利用先 repository の設計で、application の配置を root のままにする案を「後からでもできる」で推し、後で移す時の書き換えを見落とした。
- 適用対象: ある変更を今やるか後でやるかを比べる時。
- 適用しない範囲: 延期の間に前提に作られるものが無い変更（独立した文言の修正等）。数えた結果が 0 になり、「後からでもできる」がそのまま成り立つ。
- 誤適用: この補助を、変更をすべて今やる方へ倒す根拠に使うこと。

**snapshotと維持規律:**

| 正しいsnapshot | single source of truth | 更新owner | 更新trigger | 腐敗signal・同時確認先 |
| --- | --- | --- | --- | --- |
| 補助節が場面「案を作る・提示する・選ぶとき」にあり、`validate-plugin.mjs` が見出しを検査している | `plugins/tumeda-dev/docs/think_standards/making_and_choosing_options.md` | 思考標準を変える後続改善者（`evolution_policy.md` に従う） | 場面の追加・統合・分割、主軸と補助の入れ替え | 見出しを変えた時に `validate-plugin.mjs` の `requireText` が落ちる |

**完成後のdocument構造:**

- 配置: `plugins/tumeda-dev/docs/think_standards/making_and_choosing_options.md`
- 既存documentへ統合する。この file の名前と `think_standards/README.md` の一行「材料が枯れていないと、案も作れず、選ぶこともできない」は案を選ぶ時の判断材料を約束しており、延期の費用はその判断材料として範囲に入る。
- 位置: 既存の「補助: 提案が暫定か恒久かを示す」の直後、「正しい判断のための問い」の前。どちらも「今はやらない」判断を扱い、あちらは提示の仕方、こちらは延期の費用の見積もりである。
- 「提案を出す前に確かめる」の三つの確認へ四つ目として足す形は採らない。三つの確認は提案を出す前に前提と時期を確かめるもので、延期の費用は案同士を比べる時の判断である。その節は「三つは実際に起きた失敗の形であり、網羅のために足したものではない」と数を限っている。
- 主軸ではなく補助にする。この場面の主軸は「材料が枯れているか」の一つで、延期の費用は今やるか後でやるかという形の案にだけ効く独立した判断である（`evolution_policy.md` の「各場面の主軸は一つにする」）。

---

## 要件（Requirements）

### MUST（必達）

- 思考標準の維持規律（`evolution_policy.md`）を守る。場面から引けること、場面の主軸を一つに保つこと、失敗起点の知識を残すこと。
- 利用先 repository の固有情報を含めない（`migration.md`）。
- 追加した節を `scripts/verification/validate-plugin.mjs` の assertion で検査する。
- 配布 version を PATCH で上げる（docs の追加）。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- 他の場面 file や skill 本体の変更。

### 受け入れ基準

- `making_and_choosing_options.md` に、合意した文面の補助節が「補助: 提案が暫定か恒久かを示す」の直後にある。
- `validate-plugin.mjs` が追加した見出しを検査し、`node scripts/verification/validate-plugin.mjs` が通る。
- 配布 version の宣言値 4 か所と `expectedRelease` が `8.3.3` で揃っている。
- 追記した範囲に、利用先 repository の固有情報が無い。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 補助節が、変更をすべて今やる方へ倒す根拠として読まれる | 前提に作られるものが無ければ 0 と数え、「後からでもできる」がそのまま成り立つ境界を本文に書く |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs` が通る。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/docs/think_standards/making_and_choosing_options.md`: 場面「案を作る・提示する・選ぶとき」。主軸は「材料が枯れていないと、案も作れず、選ぶこともできない」。補助節として「a/b/c または 1/2/3 で答えられる形式」「畳めたことは、議論が不要になったことを意味しない」「提案が暫定か恒久かを示す」を持つ。延期の費用を見積もる原則は無い（`後から|後で|先送り|延期|二度` の grep で、該当は前提が覆る話と和集合の話だけ）。
- `plugins/tumeda-dev/docs/think_standards/evolution_policy.md`: 補助節の追記は許される変更。補助判断の見出しには「補助:」を付ける。
- `scripts/verification/validate-plugin.mjs`: `expectedRelease` は `8.3.2`。`making_and_choosing_options.md` の補助節の見出しを `requireText` で検査している（例: `## 補助: 提案が暫定か恒久かを示す`）。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/docs/think_standards/making_and_choosing_options.md` | 「補助: 「後からでもできる」は、延期の間に作られるものを数えてから使う」を「補助: 提案が暫定か恒久かを示す」の直後へ追記 | `document-review` の更新時観点（濃さ、記法、指示対象、既存記述の直し方、機密性、暫定性）で指摘なし。利用先固有名の grep で 0 件 | [documentationによって成立する知識体系](#documentationによって成立する知識体系) |
| `scripts/verification/validate-plugin.mjs` | 追加した見出しの `requireText`、`expectedRelease` を `8.3.3` へ | `node scripts/verification/validate-plugin.mjs` で `plugin validation passed` | [要件（Requirements）](#要件requirements) |
| `plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`（2 か所） | `version` を `8.3.3` へ（PATCH。docs の追加） | 同上。`node scripts/verification/test-task-design-handoff.mjs` passed、`inspect-discussion.test.mjs` 24 pass・0 fail・1 skip | [要件（Requirements）](#要件requirements) |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし
