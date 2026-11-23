# 議論記録

## 論点1: 終了前の再発防止 review で見つかった、次の作業者が再び払う手間

**ステータス:** 反映済み

**種別:** レビュー指摘

### イテレーション0（論点1）: function migration の方針と task-design の Step 2 に、今回の判断を足す

#### 提案0（論点1）

steering の「Ready result後の必須gate」（4-1 doc-enricher、4-2 議論ごとの再発防止 review）で見つかった二件。一件ずつ採否を決められる。

##### 提案0-1: 追加 — `plugins/tumeda-dev/docs/common_standard/function_migration_policy.md` の「4.3 contract ledger」

冒頭の段落（「各構造範囲を§3の意味単位へ分解する。…」）の直後に、次を足す。

```markdown
文面を一字も変えずに移す構造範囲（fileや節の移動）は、範囲を一行としてcontract ledgerへ載せ、`MOVE`に分類してよい。この行は、baselineから切り出した範囲と移行後の範囲がバイト単位で一致することで照合する。文面が一字でも変わる範囲（見出し、冒頭の説明、path、分ける境目）は、この扱いにせず§3の意味単位へ分解する。

文面が同じなら、全意味単位が同じ文のまま残るため、意味単位へ分けても、照合できることはバイト一致と変わらない。分解の手間を、意味が落ちたり変わったりしうる範囲へ集める。
```

##### 提案0-2: 失敗例 — `plugins/tumeda-dev/skills/task-design/SKILL.md` の Step 2 の `skill-update-review` の段落の直後

```markdown
構造を一度の構造案ではなく、論点ごとの決定で固める時は、汎用skillの内部指示を増やす・移す・分ける決定を合意する前に適用する。共有の文書を持ち主のskillの中へ移すだけの変更も、そのskillの内部指示と参照・読取条件を変えるため対象に入る。

- やってしまいがちな失敗: 置き場と名前を論点ごとに決め終えてから、構造案の採用前の適用を思い出す。どの論点も「構造案の提示」に見えないため、適用する時点を通り過ぎる。決めた後のreviewは、候補が出ても合意済みの決定を戻す形になる
- 判断の問い: 「この論点の決定は、汎用skillの内部指示を増やす・移す・分けるか」
```

#### 検討記録（論点1・イテレーション0）

##### 4-1: 払った手間（doc-enricher の進行1〜2）

| 手間 | 種類 | 次の作業者も払うか |
| --- | --- | --- |
| 置き場を三回続けて誤った（task-design-discussion.md 論点2・4） | 誤った | 論点5 の決定で `naming/core.md` と `docs/README.md` を直した。払わない |
| `common_standard/` の範囲が書かれておらず、横断するものを置きかけた（論点2） | 誤った | 論点3 の決定で `docs/README.md` に範囲を書いた。払わない |
| 文面を変えずに移す範囲を、意味単位へ分解するかを議論して決めた（論点8） | 決めた | 払う。`function_migration_policy.md` の §4.3 は、どの構造範囲も意味単位へ分解するとだけ書き、文面を変えない移動の扱いを書いていない。次に file を移す作業者は、同じ議論をやり直す（提案0-1） |
| `skill-update-review` を、構造を論点1〜7 で決め終えた後に適用した（論点10） | 誤った | 払う。task-design の Step 2 は「構造案を採用する前に」適用するとし、構造を論点ごとに決める時の適用の時点を書いていない（提案0-2） |
| PR を作る script の旧い起点を書いた一行（`skills/task-design/templates/tasklist.md` L147）を、ledger の作成時に見落とし、反映後の逆方向の照合で見つけた | 誤った | 払わない。旧い起点の語は repository から無くなり、validator が再び現れないことを検査する |
| plugin repository の `scripts/for_local/github` の symlink が、反映の前から無かった | 探した | 払う。ただし、作り方を書く先は plugin repository の context で、配布する雛形と同じ file である。置き方は issue #29 で決めるため、ここでは提案にしない |
| 利用先 repository の context に、PR を作る script の plugin 内の path が写されていて、移動で古くなる（論点9） | 誤った | 今回の発端の利用先は、元の作業へ戻った後の記録の PR で直す。plugin の内部の path を context へ写さない規則を足すかは、写した経緯（maintenance-plugin-context が書いたか、利用者が書いたか）を確かめていないため、ここでは提案にしない |

##### 4-1: 読んでいたのに守れなかった件の読み違えの形（doc-enricher の進行5）

提案0-2 の件では、task-design の Step 2 を読んでいた。読み違えの形は二つある。一つは、論点ごとの決定を「構造案の提示」と読まなかったことである。もう一つは、共有の文書を持ち主の skill へ移すだけの変更を、skill の更新と読まなかったことである。後者は `skill-update-review` の対象判定（参照・読取条件を変える更新）に当たるが、Step 2 の側に書かれていない。

##### 4-2: 議論ごとの再発防止 review

| 議論 | 根本原因（共有されていなかった前提） | code・docs から分かるか | 書く先 |
| --- | --- | --- | --- |
| task-design-discussion.md 論点1 | 利用者の短い問い（「今本当にskillsにある？」）を、実例の有無の問いと読んだ | 読み違えで、知識の不足ではない | なし |
| 論点2・3 | `common_standard/` の範囲 | 書かれていなかった | 反映済み（`docs/README.md`） |
| 論点4・5 | 範囲を決めるのは名前と入口の説明で、中身や置き先を言い直して照合しない | 書かれていたが、二つの読み違えの形が無かった | 反映済み（`naming/core.md`、`docs/README.md`） |
| 論点6・7・9 | なし（既存の規約で決まった） | — | なし |
| 論点8 | 文面を変えない移動の照合の仕方 | 書かれていない | 提案0-1 |
| 論点10 | 論点ごとに構造を決める時の `skill-update-review` の時点 | 書かれていない | 提案0-2 |

##### 4-3: steering skill 自身

steering の本文は、この作業で参照の path（6-1、停止理由、状態の正本、実装完了後review）だけを直した。今回の議論から、steering の手順を変える必要は見つからなかった。

#### 提案0へのフィードバック（論点1）

**結果:** 提案0-1・0-2 をどちらも採用

> ok

chat では「0-1・0-2、それぞれ採る？」と問い、その応答である。

### 決定（論点1）

提案0-1 と提案0-2 を、提案0 に書いた文面と位置のまま適用する。

- 0-1: `function_migration_policy.md` の「4.3 contract ledger」の冒頭の段落の直後に、文面を一字も変えずに移す構造範囲を一行の `MOVE` として載せ、バイト一致で照合してよいこと、文面が変わる範囲は意味単位へ分解することと、その理由を足す。
- 0-2: `task-design/SKILL.md` の Step 2 の `skill-update-review` の段落の直後に、構造を論点ごとの決定で固める時の適用の時点と、共有の文書を持ち主の skill の中へ移すだけの変更も対象に入ることを、失敗例と判断の問いを添えて足す。

どちらも validator の `requireText` で文面を検査し、`document-review` を通す。release は、まだ main へ入れていない 9.1.5 に含める。

### 反映の結果（論点1）

- 0-1 は提案0 の文面のまま、0-2 は `document-review` で一語を足して適用した。
  - 0-2 の「決定を合意する前に適用する」は、何を適用するかを直前の段落から補って読む形だった。直前の文の動詞が「合意する」で終わるため、「決定を合意する前に`skill-update-review`を適用する」と目的語を書いた。意味は変えていない。
- `scripts/verification/validate-plugin.mjs` へ、0-1 の三文と 0-2 の三文を `requireText` で足した。
  - 六つとも、本文の該当する語を変えると validation が落ちることを確かめた。
- `node scripts/verification/validate-plugin.mjs` と `node scripts/verification/test-task-design-handoff.mjs` は pass。
- task-design の `SKILL.md` を編集したため、編集後の `skill-update-review` を当てた。足したのは Step 2 にある既存の適用指示の時点と対象の補足で、独立した判断・状態・完了条件を持つ工程は増えていない。候補は設計時・編集後と同じ（issue #27）で、新しい候補はない。
