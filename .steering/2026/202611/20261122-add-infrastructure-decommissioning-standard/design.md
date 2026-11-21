# Design: 使わなくなった基盤の仕組みを消す時の範囲の標準

## 元の依頼内容

起点: escalate-plugin-skill-fix の保留していた改善の引渡し（利用先 repository の作業の実装の後に再開条件が成立した）。

達成したいこと: plugin の infrastructure の開発標準に、使わなくなった基盤の仕組みを消す時に、何を消し、何を残すかを決める標準を足す。

提案（assistant が書き、利用者が受諾した）:
- `plugins/tumeda-dev/docs/development_standards/infrastructure/` に新しい標準（仮の名前 `decommissioning.md`）を作る。中身は次の三つ。
  - 消す対象は、その仕組みの resource が作ったもの・付けたもの（相手側の登録、それだけに付いた権限、書き出した成果物）まで辿って一覧にする。
  - 共有されているものは残す。
  - 消す前に、他から使われていないことを確かめる。
- 既存の `change_verification.md` は「変えた後に、動きを確かめる」標準で、消す範囲を決める話は範囲の外にあるため、別の file にする。

具体例（利用先固有の情報を除いた形）: ある利用先 repository で、AWS の変更を Terraform と GitHub Actions で届ける経路を作る作業の中で、旧 deploy の仕組み（GitHub の webhook → CodePipeline → CodeDeploy）を消す一覧を、最初の調査で見えた resource（pipeline とその service role、CodeDeploy の application、ECR の repository、GitHub の webhook）だけで作り、設計で合意した。tasklist を設計する前に読み取りで確かめると、AWS 側の CodePipeline の webhook、service role だけに付いた customer managed の policy、artifact の bucket のうちその pipeline の prefix の下の object が漏れていた。一方、CodeDeploy の service role と artifact の bucket は、同じ AWS account の別の app と共有していた。漏れを足して合意し直した一覧で消し、消す前の読み取りの確認と、消した後の確認（消したものが無く、残すものが残る）で、誤って消したものが無いことを確かめた。

根拠（assistant が書いた部分）: 最初の調査で見えた resource だけを並べ、その仕組みが作ったもの・付けたものまで辿らなかった。repository が違っても、基盤の仕組みを消す時に同じ漏れが起きる。

合意の範囲: 利用者の原文は「提案は受諾。今回のエスカレ適用はは実装後に保留する。」（assistant が上の提案を示し、plugin へ引き渡すかを問うた応答）。引き渡すことと、提案の中身（置き場と三つの中身）への合意はある。標準の本文の書き方・構成・名前の確定は未合意で、この設計で決める。

---

## TL;DR

基盤の仕組みを使わなくなって消す時、消す一覧を最初の調査で見えた resource だけで作ると、その仕組みが作ったもの・付けたもの（相手側の登録、それだけに付いた権限、書き出した成果物）が漏れる。逆に、他と共有しているものまで消す恐れもある。infrastructure の開発標準に `decommissioning.md` を足し、task-design が設計前調査（`development_standards/` の配下をすべて読む）で、基盤を消す設計の前に必ず触れるようにする。終了時には、新しい標準、`development_standards/README.md` の索引の一行と維持規律の更新、validator の assertion、release version 9.1.2 が `main` に入り、plugin を update した状態になる。

---

## 完成後の姿

### 文書にまとめる知識と、その保ち方

**文書にする知識:**

- 暗黙知・散らばった知識・困りごと: 基盤の仕組みを消す一覧を、最初の調査で見えた resource（設定画面や一覧の command で直接見えるもの）だけで作る。その仕組みが他の場所へ作ったもの・付けたもの（別の service への登録、それだけに付いた権限、書き出した成果物）は直接は見えず、漏れる。漏れたものは、消した後も残り続け、権限や費用として効き続ける。一方、同じ account の別の仕組みと共有しているものは、一覧に入れると別の仕組みを壊す。これまでの plugin には、消す範囲を決める標準が無かった。`change_verification.md` は作る・変えた後に何を確かめるかを扱い、消す範囲は扱わない。
- 再び使える原則へ引き上げるもの:
  - 消す対象は、その仕組みの resource が作ったもの・付けたもの（相手側の登録、それだけに付いた権限、書き出した成果物）まで辿って一覧にする。
  - 共有されているものは残す。
  - 消す前に、他から使われていないことを確かめる。
  - 消した後、一覧と実物を突き合わせる。消すとした全件が無く、残すとした全件が残っていることを確かめる。

**読者と、読んでできるようになる判断:**

| 読者 | 読む場面 | 調べ直さずにできるようになる判断・作業 | 最初に開く場所 |
| --- | --- | --- | --- |
| task-design を進める AI agent | 基盤の仕組みを消す・置き換える設計の前（設計前調査で `development_standards/` の配下をすべて読む） | 消す一覧を、見えた resource だけで終えず、作ったもの・付けたものまで辿って作る。共有されているものを一覧から外す。消す前の確かめと、消した後の突き合わせを tasklist に置く | `development_standards/README.md` の infrastructure の一行 |
| 利用者 | 消す一覧の design を review する時 | 一覧に、辿るべき種類（相手側の登録、それだけに付いた権限、書き出した成果物）が入っているか、共有されているものが外れているかを確かめる | 同上 |

**知識の並べ方:**

作業の順（一覧を作る → 残すものを外す → 消す前に確かめる → 消した後に突き合わせる）に、四つの原則を一つずつ見出しにする。同じ directory の他の標準と同じく、各見出しは MUST、理由、判断の問いを持ち、最後に「やってしまいがちな失敗」を置く。

```text
# 基盤の仕組みを消す時の範囲
├── （冒頭）扱う判断と、受け持つ範囲（一覧）と change_verification.md との境目（動き）
├── ## 作ったもの・付けたものまで辿って、消す一覧を作る
│   └── MUST、辿る先の三種類と例、理由、例外（application のログは消さない）、判断の問い
├── ## 共有されているものは残す
│   └── MUST（共有物を外す、共有物の中のこの仕組みの分だけを消す）、理由、判断の問い
├── ## 消す前に、他から使われていないことを確かめる
│   └── MUST（読み取りで確かめる、一覧と違えば消さずに直して合意し直す）、確かめる観点（付き先、参照元、prefix の前方一致）、判断の問い
├── ## 消した後、一覧と実物を突き合わせる
│   └── MUST、影響を受ける動きの確かめは change_verification.md に従う参照、判断の問い
└── ## やってしまいがちな失敗
    └── 起点の具体例（利用先固有の情報を除く）
```

**決まりの理由と、当てはめる範囲:**

- 理由になる困りごと・失敗: 上の「暗黙知・散らばった知識・困りごと」。
- MUST: 上の四つの原則。共有物の中のこの仕組みの分だけを消すこと。消す前の確かめが一覧と違えば消さず、一覧を直して合意し直すこと。
- 当てはめる対象: 基盤（cloud の resource とその構成、それを届ける workflow、外部の service への登録）の仕組みを、使わなくなって消す時。別の仕組みへ置き換えて旧を消す時を含む。infrastructure as code で管理している仕組みを定義から外して消す時も含む。state に無いもの（service が自分で作ったもの、書き出した object、手で登録したもの）は、定義から外して apply しても消えないためである。
- 受け持つ範囲の境目: この標準は「何を消し、何を残すかの一覧」を受け持つ（作る、消す前に確かめる、消した後に実物と突き合わせる）。消したことで影響を受ける動きの確かめ（残したものを使う別の仕組みが動く、消した仕組みを起動していた経路が何も起こさない等）は `change_verification.md` が持ち、この標準からは参照だけを置く。消すことも基盤の変更であり、`change_verification.md` の範囲に入るためである。
- 例外: application のログは消さない。`log_retention.md` が「それを出す resource を消しても残す」を MUST にしており、書き出した成果物の一つとして消すと食い違うためである。
- 誤った当てはめ: review 環境を止めること。仕組みを使わなくなったのではなく、次に使う時に起動するため、この標準は当たらない。止める・起動する扱いは `review_environment.md` が持つ。

**内容を最新に保つ方法:**

| 保つべき内容 | 正とする記述の置き場所 | 直す人 | 直すきっかけ | 古くなったと気づく兆候・あわせて確認する文書 |
| --- | --- | --- | --- | --- |
| 消す範囲を決める四つの原則と、application のログの例外 | `plugins/tumeda-dev/docs/development_standards/infrastructure/decommissioning.md` | plugin の保守者 | 利用先で、この標準に従っても消し漏れ・誤った削除が起きた時。`log_retention.md` の MUST が変わった時 | `change_verification.md` との境目の重複、`log_retention.md` との食い違い、`development_standards/README.md` の索引の一行と中身のずれ |
| 標準の主な文が残っていること | `scripts/verification/validate-plugin.mjs` の assertion | 標準を直す人 | 標準の MUST の文を変えた時 | validator の失敗 |

**完成後の文書の構成:**

- 配置: `plugins/tumeda-dev/docs/development_standards/infrastructure/decommissioning.md`。同じ directory の他の標準と同じく、扱う判断の対象を名詞で表す。`infrastructure/decommissioning.md` と置かれた場所の形で読むと、基盤を使わなくなって消すことの標準と読める。
- 形式: Markdown。上の「知識の並べ方」の見出し。
- 既存 document へ統合するか: 新しく作る。`change_verification.md` の名前・冒頭の説明・見出しは「作る・変えた後に何を確かめるか」を約束しており、消す範囲を決める判断はその範囲に入らない。
- 索引: `development_standards/README.md` の「収録している標準」の infrastructure の下に一行を足す。「維持規律」の file 数と分量を 21 file・約 94KB に更新し、括弧内の infrastructure の一覧に `decommissioning` を足す。

---

## 要件（Requirements）

### MUST（必達）

- 新しい標準が、上の四つの原則を、判断の問いとやってしまいがちな失敗と一緒に持つ。
- 新しい標準が、消したことで影響を受ける動きの確かめを `change_verification.md` に任せる参照の一文を持つ。`change_verification.md` は変えない。
- 新しい標準が、application のログを消さない例外を、`log_retention.md` への参照と一緒に持つ。
- 新しい標準に、利用先固有の情報（repository 名、path、issue・PR 番号、commit、account の値、利用先の resource の実名）を書かない。
- `development_standards/README.md` の「収録している標準」の infrastructure の下に、新しい標準への一行を足し、「維持規律」の file 数と分量を更新する。
- `scripts/verification/validate-plugin.mjs` に、新しい標準の MUST の文、例外、参照の一文と、README の一行を検査する assertion を足す。
- release version を PATCH で上げる（docs の追加）。宣言値 4 箇所と `expectedRelease` を一度に変える。作業の間に `main` へ別の作業の 9.1.0・9.1.1 が先に入ったため、`main` の 9.1.1 から 9.1.2 にする。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- 消す操作そのものの進め方（実行の順序、auto mode の許可の扱い等）は扱わない。auto mode の許可の扱いは、同じ利用先の作業から別の改善として保留中であり、別の steering で扱う。
- 消したことで影響を受ける動きの確かめを、新しい標準に書き直すこと。`change_verification.md` が持つ（責務の境目であり、見直す条件は無い）。

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出す。新しい標準の検査対象の文を一つ消すと失敗する。
- 新しい標準が document-review の作成時観点を満たす。
- 起点の具体例以外の具体例二つ以上（当てはまらないはずの例を一つ以上含む）に新しい標準を当てると、意図した結論になる。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 起点の具体例（CodePipeline と CodeDeploy の deploy の仕組み）に寄った、他の基盤で使えない原則になる | 原則を「作ったもの・付けたもの」の種類で書き、特定の service の resource 名で書かない。起点以外の具体例（定期実行の function、infrastructure as code から外して消す仕組み、review 環境を止めること）へ当てて確かめた |
| `change_verification.md` と中身が重なる | 境目を「一覧か、動きか」で分け、新しい標準からは動きの確かめを参照だけにする |
| `log_retention.md` と食い違う（ログを書き出した成果物として消す） | application のログを消さない例外を、`log_retention.md` への参照と一緒に書く |

---

## テスト方針

- assistant が、repository の root で `node scripts/verification/validate-plugin.mjs`、`node scripts/verification/test-task-design-handoff.mjs`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` を実行する。この session の開発機で使える。
- assistant が、新しい標準の検査対象の文を一時的に変えて validator が失敗することを確かめ、元に戻す。
- assistant が、新しい標準に document-review の作成時観点を当てる。
- assistant が、起点以外の具体例へ新しい標準を当て、結果を `task-design-discussion.md` に書く。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/docs/development_standards/README.md`: 開発標準の索引。task-design は設計判断の前に配下をすべて読む。「維持規律」に file 数と分量を書く（変更前は 20 file・約 88KB と記載）。
- `plugins/tumeda-dev/docs/development_standards/infrastructure/change_verification.md`: 基盤を作る・変えた後に、変えた component の影響下にある動きを実物で確かめる標準。列挙の観点（利用者の操作、利用者の操作を伴わない処理、出力、権限、共有する別の環境、作る・更新する経路）を持つ。消す範囲を決める判断は持たない。
- `plugins/tumeda-dev/docs/development_standards/infrastructure/log_retention.md`: application のログは、それを出す resource を消しても残すことを MUST にする。
- `plugins/tumeda-dev/docs/development_standards/infrastructure/review_environment.md`: review 環境を止めている状態を既定にし、使う時だけ起動する扱いを持つ。
- 同 directory の他の標準（`database_separation.md`、`reference_implementation.md`、`cost_judgment.md` を含む）: 冒頭の一文で扱う判断を示し、原則の見出し、理由、判断の問い、やってしまいがちな失敗を持つ形で揃っている。
- `scripts/verification/validate-plugin.mjs`: 基盤の各標準について、主な文と README の索引の一行を `requireText` で検査している。
- `.agents/skills/tumeda-dev-plugin-context.md` の「version bump」: docs の追加・変更は PATCH。宣言値 4 箇所と `expectedRelease` を一度に変える。

---

## （付録）変更の実行区分

### 設計中に反映を終えた変更

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/docs/development_standards/infrastructure/decommissioning.md`（新規） | 「知識の並べ方」の見出しで、四つの原則、application のログの例外、`change_verification.md` への参照、やってしまいがちな失敗を書いた | validator が pass。document-review の作成時観点を当て、100 字を超える散文の行を句点で改行した。利用先固有の語の grep は 0 件 | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `plugins/tumeda-dev/docs/development_standards/README.md` | infrastructure の下に一行を足し、維持規律を 21 file・約 94KB に更新し、括弧内に `decommissioning` を足した | validator が pass（README の一行の assertion を含む） | 同上 |
| `scripts/verification/validate-plugin.mjs` | 新しい標準の MUST 五文、例外、参照の一文と、README の一行の assertion を足した。`expectedRelease` を上げた（最終は 9.1.2） | pass。共有物の MUST の文を一時的に変えると「必須項目…がない」で失敗し、戻すと pass に戻った | [要件（Requirements）](#要件requirements) |
| release version（`.claude-plugin/marketplace.json` の 2 箇所、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`plugins/tumeda-dev/.codex-plugin/plugin.json`） | 9.0.4 から 9.0.5 へ上げた後、`main` の 9.1.1 を取り込む merge で 9.1.2 にした | merge の後も、validator の version 検査が pass。`test-task-design-handoff.mjs` が pass。`inspect-discussion.test.mjs` は 27 件中 pass 26、fail 0、skip 1 | 同上 |

### 設計中に反映する、他の判断を待っている変更

なし

### tasklist・roadmapに載せて実行する変更

なし（docs と validator の変更で、合意済みの内容から一つの連続した反映と validation で完了した）
