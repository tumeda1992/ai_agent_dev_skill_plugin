# Design: 既存の file に内容を足す前に、その file の範囲に入るかを確かめる

## 元の依頼内容

escalate-plugin-skill-fix からの引き渡し（利用先 repository 固有の情報は除去済み）:

1. 提案の内容（assistant が書いた案。中身は未合意として扱い、設計で改めて合意を取る）
   - 文書の置き場所を決める時（task-design で文書の変更先を決める時、doc-enricher の Phase 2「置き場所の決め方」）に、「足す内容は、その file の範囲に入るか」を問う。範囲は、file 名・入口の説明・既存の見出しから確定し、足す内容と照合する。入らなければ、別の既存 file か新しい file を検討する。
   - やってしまいがちな失敗: どこに書くと読まれるか（読まれる頻度）だけで置き場所を選び、file 名が中身を表さなくなる。

2. 必要だと分かった具体例（一般化済み）
   - 利用先 repository で、新しい原則（CI は変更を届けるだけ、cloud の実行環境が application を動かす、という棲み分けと、application の実行環境で動かせない長い処理を委ねる batch 実行基盤の位置付け）の置き場所として、assistant が「最も読まれる」という理由だけで既存の application architecture の文書を選んだ。
   - 利用者が「この file に書いてよいかゼロベースで厳しく review して」と求めた。見直すと、その file の名前・入口の説明・既存の見出しが表す範囲は application の層の構造であり、基盤の棲み分けは入らなかった。結果、原則は基盤の構成を扱う新しい文書へ置き、既存文書には新しく足す層（batch の入口の層）だけを残した。
   - 同じ論点で、assistant は新しい文書の名前を、既存の用語（層の名前）と語が被るだけの理由で一度退け、利用者に「plugin の naming のファイルのルール適用してもダメそう？」と問われて撤回した。こちらは既存の命名の標準に書かれている失敗の実行ミスであり、この提案の対象外。

3. 提案の根拠
   - plugin の documentation_standards（README、file_naming.md、core_readers.md、information_structuring）、doc-enricher の Phase 2「置き場所の決め方」、task-design のいずれにも、既存 file に内容を足す前に、その file の範囲（名前、入口の説明、既存の見出し）と照合する問いが無いことを grep と通読で確かめた。doc-enricher は知識の抽象の段に合わせることだけを問う。
   - 近い記述は making_and_choosing_options.md の失敗例の引用（「このファイル名には適さないコンテンツとも思う」）だけで、選択肢の和集合の失敗として書かれており、置き場所の判定の問いにはなっていない。

4. 利用者が合意した範囲
   - 引き渡すことには合意済み。原文: 「1:引き渡す。2:開始」（assistant が「論点 17 の process の不足を、plugin への改善提案として記録して引き渡すか？ 案: 文書の置き場所を決めるとき（task-design、doc-enricher）に、『足す内容は、その file の範囲に入るか』を問う。推奨は引き渡す」と問うたことへの回答）。
   - 提案の中身・根拠・具体例の書きぶりは assistant が書いたもので、中身への合意は取れていない。利用者の原文で確かめられるのは、上の具体例で引用した 2 つの発言だけ。

---

## TL;DR

文書の置き場所を「どこに書くと読まれるか」だけで選ぶと、既存の file の範囲を越えた内容が入り、file 名が中身を表さなくなる。その規則を探す人にも届かない。plugin の標準と skill には、既存の file に内容を足す前に、その file の範囲と照合する問いが無い。この作業で、範囲との照合を命名の標準 `naming/core.md` の規範として置き、名前の付いたもの全般（file、directory、module、class、method、文書の見出し）へ当てる。置き場所を決める三つの skill の手順（doc-enricher の「置き場所の決め方」、task-design の outcome section `documentation.md` の統合先の欄、steering の Step 4-2 の三問目）から、その規範を参照で引けるようにする。終了時には、置き場所を決める場面で、足す内容が既存の file の範囲に入るかを照合し、入らない時に別の置き場所を選べる。

---

## 完成後の姿

### documentationによって成立する知識体系

**形式知化する対象:**

- 暗黙知・散在知識・pain:
    - 置き場所を「読まれる頻度」で選び、既存の file の範囲を越えた内容を足した。file 名・入口の説明・見出しが表す範囲を照合していれば、足す前に気付けた。
    - 近い知識は散在しており、どれもこの場面の問いになっていない。
        - 命名の標準の「命名後、名前と実態の対応をレビューする」は、名前を付けた時の見直しとして書かれ、後から中身を足す時の trigger を持たない。
        - 情報構造化の標準の「配置 — 何に一番強く結びつくかで決まる」は、domain の知識の構造化に限った配置の基準である。
        - 選択肢の標準の失敗例（場面の違う二つの内容を一つの標準 file へ入れた）は、和集合の失敗として書かれている。
        - doc-enricher の Phase 2 は、知識の抽象の段に合う文書を選ぶことだけを問う。
- 再利用可能な原則へ引き上げるもの: 名前の付いたものへ中身を足す前に、足す中身が、名前・入口の説明・既に入っている中身が約束する範囲に入るかを確かめる。入らなければ、範囲に入る別の既存のもの、範囲を広げて名前と入口の説明を改めること（広げた名前が具体性を保てる時に限る）、新しいもの、のどれかを選ぶ。文書の file に限らず、名前の付いたもの全般に当てる（[論点1の決定](task-design-discussion.md#決定論点1)）。

**読者と成立させる判断:**

| 読者 | 利用場面 | codeや過去会話を再調査せず可能になる判断・action | 入口・読む順序・検索語 |
| --- | --- | --- | --- |
| 文書・code の置き場所を決める agent・人 | 名前の付いたもの（既存の文書、directory、class など）へ中身を書き足す前 | 足す中身が既存のものの範囲に入るかを判定し、入らない時に三つの選択から置き場所を選ぶ | `naming/README.md` → `naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」。doc-enricher・task-design・steering は、置き場所を決める箇所の参照から辿る |

**規範の根拠と適用境界:** 根拠は、名前と実態の対応が、名前を付けた時だけでなく、名前を変えずに中身を足した時にも崩れること。起点の失敗（読まれる頻度で、範囲の外の文書へ足そうとした）のほか、class・directory・標準の file への当てはめで成り立つことを確かめた（[論点1の内部検討記録](internal-records/task-design-discussion.md.topic-1.md#iteration-0-record-2)）。照合が働かないのは `utils` のように何でも入る名前の入れ物であり、その原因は名前の具体性の不足として、既存の「中身が大まかにわかる具体性を備える」が扱う。

**snapshotと維持規律:** `development_standards/README.md` の「現在は 15 file・約 NKB」は、`development_standards/` の md を足す・広げる時に更新する（この作業で約 64KB から約 67KB へ更新した）。規範の本文は snapshot を持たない。

**完成後のdocument構造:** 既存の標準へ統合する。`naming/core.md` の末尾、「命名後、名前と実態の対応をレビューする」の次に h2「中身を足す前に、名前が約束する範囲に入るかを確かめる」を置く。naming の群の範囲を「名前を付ける場面」から「名前の付いたものへ中身を足す場面」まで広げ、`naming/README.md` の冒頭の一行と `development_standards/README.md` の naming の一行を改める。新しい標準を作らない理由は、名前と実態の対応という同じ原則を二箇所で持たないためである（[論点1の決定](task-design-discussion.md#決定論点1)）。

### documentation以外のfile deliverable

規範を引く参照を、置き場所を決める三つの箇所に一つずつ置く（[論点2の決定](task-design-discussion.md#決定論点2)）。どれも規範の本文を持たず、`naming/core.md#中身を足す前に名前が約束する範囲に入るかを確かめる` への link と、確かめる時点だけを書く。

| file | 位置 | 置くもの |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/doc-enricher/SKILL.md` | Phase 2 の「置き場所の決め方」とその子の箇条書きの次、同じ深さ | 抽象レベルで選んだ既存のドキュメントへ足す前に、範囲に入るかを確かめる |
| `plugins/tumeda-dev/skills/task-design/templates/outcome-sections/documentation.md` | 記述の MUST の「既存documentへの統合または新owner作成の理由を明示する」の子と、欄「既存documentへ統合するか」の placeholder | 統合する時は範囲に入ることを確かめ、その結果を理由に含める |
| `plugins/tumeda-dev/skills/steering/SKILL.md` | 「4-2. discussionを元に再発防止先をreviewする」の三問目の子 | 既存の file へ書くなら、範囲に入るかを確かめてから提案する |

置かない skill: facilitate-discussion（repository 知識の不足は doc-enricher へ回すため、その入口で覆える）、tasklist-executor（置き場所を選ばない）、think-through（毎ターンの思考の作法で、この場面の範囲の外）。

---

## 要件（Requirements）

### MUST（必達）

- 成果物（skill、docs、steering の作業記録）に、利用先 repository 固有の情報を書かない。
- 変更した skill・docs の契約の文を、`scripts/verification/validate-plugin.mjs` の assertion で検査する。
- 配布 version を PATCH で一度だけ上げる（宣言値 4 箇所と `expectedRelease`）。
- 範囲との照合の規範は `naming/core.md` だけに置き、skill へ本文を写さない。skill は規範へ参照で届く。
- 置き場所を決める三つの箇所（doc-enricher、task-design の `documentation.md`、steering の Step 4-2）が、規範への参照を持つ。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- 名前を既存の用語と語が被るだけで退ける失敗。命名の標準の「表現が同じでも、名前空間が違えば別の意味を持つ」に既に書かれており、起点の具体例での実行の誤りであるため、この作業では変えない。

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出す。
- 起点以外の具体 case 二つ以上に規範を当て、意図した置き場所へ落ちることを design に書ける。
- `validate-plugin.mjs` が、規範の見出し・判断の問い・失敗例・範囲に入る例、naming の入口の説明二つ、三つの skill の参照の文と anchor を検査する。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 照合が「入らないから新しい file」へ偏り、薄い file が増える | 規範は入らない時の選択を三つ持ち、新しいものを作るのはその一つにすぎない。範囲に入る別の既存のものと、範囲を広げることを先に並べる |
| 既存の近い規範（命名の見直し、情報構造化の配置）と二重の正本になる | 命名の見直しと同じ `naming/core.md` に隣の section として置き、trigger の違いだけを書き分ける。情報構造化の「配置」は domain の知識の構造化に限った基準として残し、広げない |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs` に、追加・変更した契約の文が残っていることの assertion を足して通す。
- 起点以外の具体 case への当てはめを design の検証として書く。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/docs/development_standards/naming/core.md` の「命名後、名前と実態の対応をレビューする」: 付けた名前と実態の対応を見直し、外していたら改名して再レビューする。名前を付けた時の見直しとして書かれている。
- `plugins/tumeda-dev/docs/development_standards/naming/README.md`: `core.md` は名前を付ける対象が何であっても成立する原則（積集合）だけを扱う。対象種別の規則を足す前に、`core.md` へ入らないことを確かめる。
- `plugins/tumeda-dev/docs/documentation_standards/information_structuring/README.md` の「6. 配置 — 何に一番強く結びつくかで決まる」: domain の知識をどこに置くかを、何に最も強く結びつくかで決める。
- `plugins/tumeda-dev/docs/documentation_standards/README.md` の「標準の置き方」: 何を書くか・どこに置くか・誰に向けて書くかを扱う標準は `document-review` の観点ではない。
- `plugins/tumeda-dev/docs/think_standards/making_and_choosing_options.md` の「足したくなったこと自体が合図」: 場面の違う二つの内容を一つの標準 file へ入れ、「このファイル名には適さないコンテンツとも思う」と指摘された例を、和集合の失敗として持つ。
- `plugins/tumeda-dev/skills/doc-enricher/SKILL.md` の「Phase 2: 適用」: 置き場所の決め方は、知識の抽象レベルに対応する文書を選ぶ（物理的に近いからといって狭い README に書かない）。
- `plugins/tumeda-dev/skills/task-design/templates/outcome-sections/documentation.md`: 記述の MUST に「完成後のpath、見出し、entry、参照関係、具体例の配置を示し、既存documentへの統合または新owner作成の理由を明示する」がある。理由の中身は問わない。
- `plugins/tumeda-dev/skills/steering/SKILL.md` の「4-2. discussionを元に再発防止先をreviewする」: 三問目に「どこに書けば次回この議論が不要になるか」がある。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 変更 | 参照するdesign section | validation |
| --- | --- | --- |
| `naming/core.md` への h2 の追加、`naming/README.md` と `development_standards/README.md` の naming の一行の変更、`development_standards/README.md` の分量の記載の更新 | 完成後のdocument構造、[論点1の決定](task-design-discussion.md#決定論点1) | `node scripts/verification/validate-plugin.mjs` が `plugin validation passed`。document-review を当て、記法の指摘 2 件（理由と結果が混ざった箇条書きを散文へ、条件の長い選択肢を入れ子へ）を直した。範囲に入る側の例が無いという指摘 1 件は、論点1のイテレーション1で合意し、段落を足した |
| doc-enricher・task-design の `documentation.md`・steering への参照の追加 | documentation以外のfile deliverable、[論点2の決定](task-design-discussion.md#決定論点2) | `plugin validation passed`。document-review は指摘なし。編集後の skill-update-review は [記録](artifacts/skill-update-review.md) |
| `validate-plugin.mjs` の assertion の追加と、version の 8.2.5 への bump（宣言値 4 箇所と `expectedRelease`） | 要件の MUST | `plugin validation passed` |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし
