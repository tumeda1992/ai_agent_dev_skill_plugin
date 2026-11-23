# Design: 利用者が見てから通すべき command を、実行許可の画面に頼らず確かめる

## 元の依頼内容

起点: escalate-plugin-skill-fix の保留していた改善の引渡し（利用先 repository の作業の実装の後に再開条件が成立した）。

利用者の原文（会話上の原文、2026-11-22。利用先の作業で、auto mode の分類器に削除の command を止められた後）:

> 足していいよ。このリポジトリの設定に足して。そして、前も{別の利用先 repository}で起きた気がするから、エスカレとして、aiへの指示固有のドキュメント（あればそれ、無ければ新設）に、claudeのautoモードで、許可されないコマンドで、ユーザがそのコマンドの実行を望んでるか聞いてokだった場合に限り、ユーザの意図せぬブロックのため、回避策を行う。20261121時点の回避策はaskを入れること（今回これで回避できた場合の記述）

（`{別の利用先 repository}` は、利用先固有の名前を除くために置き換えた箇所である。他は原文のまま。）

その後、利用先の作業で分かったこと（利用先固有の情報を除いた形）:

- 利用者は auto mode のまま、削除の command を 1 つずつ実行許可の画面で見て通すことを選んだ。assistant は project の settings に、削除の command に当たる `permissions.ask` の rule を足した。
- その後、forked の skill を background で動かした executor が削除・取り外しの command を 12 件実行した。どれも実行許可の画面に出ず、分類器の許可で実行された。利用者も画面を受けていないと述べた。原因は確かめられていない（docs は「ask の rule は auto mode でも分類器より先に評価され画面が出る」としている）。
- 同じ作業の前の phase の、Terraform の apply と secrets の登録も、分類器の許可で実行され、画面は出ていなかった。その作業の design は「利用者が各 command を tool の実行の許可で確かめる」を前提にしていた。
- 結果に逸脱は無かったが、利用者が見てから走るという手順は守られなかった。

利用先の作業の実装後 review で合意した、引き渡す提案（利用者が合意、2026-11-22）:

- plugin の docs に、AI agent への指示に固有の文書を新設する。既存に該当する文書は無い。この文書が Claude Code に固有であることを範囲として示す。名前と置き場は plugin 側の設計で決める。
- その文書に、Claude Code の auto mode で、利用者が見てから通すべき command の扱いとして、次の規則を書く。
  - 利用者が確かめる経路に tool の実行の許可の画面を当てる前に、session の permission mode を確かめる。auto mode では、この画面は既定で出ず、分類器が command を通すか止めるかを決める。
  - auto mode で、利用者が見てから通すべき command は、実行する形のまま chat で示し、利用者の明示の ok を得てから、示した形のまま実行する。取り返しのつかない操作がこれに当たる。分類器に止められた command を利用者が望んでいる場合も含む。一つずつ示しても、まとめて一覧で示してもよい。示していない command や、形を変えた command は実行しない。
  - assistant の実行が分類器に止められたら、利用者に `!` を付けて session の中で実行してもらう。示した command をそのまま渡す。
  - `permissions.ask` の rule を足して実行許可の画面に回す方法は、回避策として書かない。
- 規則の目的（利用者の原文、2026-11-22）:

  > ok。まぁaskつけるかはhowの話だから、こっちとしては合意したコマンドが、変に止められず先に進められればいいよ

  plugin 側の設計では、この目的に照らして方法を決め直してよい。

---

## TL;DR

利用者が見てから通すべき command（取り返しのつかない操作等）の確かめを、実行環境の実行許可の画面に当てていた。Claude Code の auto mode では、その画面は既定で出ず、ask の rule を足しても出なかった。確かめを chat または tasklist での明示の合意に移し、実行する agent へ利用者の合意をそのまま渡し、それでも止められたら迂回せず利用者へ返す規則を plugin に足す。目的は、合意した command が意図しない止められ方をせずに先へ進むことである。手段は確かめられた範囲だけを書き、ask の rule や `!` を固定の手段にしない。

---

## 完成後の姿

### 文書にまとめる知識と、その保ち方

- 文書にする知識:
  - 実行環境の実行許可の画面は、permission mode によって出ない（Claude Code の auto mode）。設計で利用者の確かめをその画面に当てると、利用者が見ないまま command が走る。
  - 実行環境に止められた command を利用者が望む時の進め方。
- 書く規則:
  - 利用者の確かめは、実行許可の画面に当てない。確かめが要る command は、実行する形のまま chat または tasklist で示し、利用者の明示の合意を得る。実行許可の画面は permission mode によって出ない（例: Claude Code の auto mode では既定で出ない）。
  - 合意した command を実行する時は、利用者の合意の原文と、合意した command の一覧を、実行する agent（subagent を含む）へそのまま渡す。実行環境は利用者の意図を判断に使うことがある（例: Claude Code の auto mode の分類器は、破壊的な操作の既定の制止を利用者の意図で解く）。利用者がまだ与えていない承認や、まだ起きていない確かめを、事実として書かない。
  - それでも実行環境に止められたら、迂回せず停止し、利用者へ返す。止められた command と、実行環境が示した止めた理由を示し、どう進めるかを利用者と決める。
  - `permissions.ask` の rule と `!` を、止められた時の固定の手段として書かない。どちらも効くと確かめていない。
- 置き場: 規則を中身の性質ごとに、使う場面で効く場所へ置く。新しい文書は作らず、`runtime-*` の file にも足さない。
  - 利用者の確かめの経路（design の時）: `task-design/SKILL.md` の Step 4「確認の担当と手段」に、判断の問いとやってしまいがちな失敗を足す。利用先の作業で誤ったのは design の時であり、Step 4 は「その手段が今の環境で使えるか」を既に問うが、実行許可の画面に掛からなかったためである。
  - 合意の渡し方（実行を任せる時）: `steering/SKILL.md` の 6-1「leafを実行する」に足す。利用先の作業で誤ったのは、steering が tasklist-executor へ渡す指示文に、まだ起きていない確かめを書いた時だったためである。
  - 止められた時: `runtime-execution-contracts.md` の「実行環境gate」に既にあり、変えない。
  - Claude Code に固有の事実（auto mode では実行許可の画面が既定で出ない、分類器は利用者の意図で既定の制止を解く）は、上の二か所で、規則が必要な理由の例として添える。
  - 新しい文書（AI agent への指示に固有の文書）は作らない。task-design と steering 自体が AI agent への指示であり、規則が効く場面で読まれるためである。止められた時の規則を一か所にまとめるという理由で「実行環境gate」へ足す案は、止められた時の規則が一つしか無く、他の規則は止められた時の規則ではないため採らない。
- 書き込む文:
  - `plugins/tumeda-dev/skills/task-design/SKILL.md` の Step 4「確認の担当と手段」の判断基準の前に、二項目を足す。
    - 「実行環境の実行許可の画面（agentがtoolを実行する前に利用者へ出す確認）を、利用者が確かめる手段にしない。画面が出るかはpermission modeで変わる。例えば、Claude Codeのauto modeでは画面は既定で出ず、分類器がcommandを通すか止めるかを決める。利用者が見てから通すべきcommand（取り返しのつかない操作等）は、実行する形のままchatまたはtasklistで示し、利用者の明示の合意を得ることを手段にする」
    - やってしまいがちな失敗として、基盤を作る作業の design で一度だけ行う操作の確かめを実行許可の画面に当て、auto mode で apply・secrets の登録・削除が画面を経ずに走った例（利用先固有の情報を除く）。既存の失敗例（誰が何で見るかを後で問う）とは別の型（手段を決めたが、その手段が働かなかった）のため、もう一つ足す。
  - `plugins/tumeda-dev/skills/steering/SKILL.md` の 6-1 の箇条書きの最後に、「利用者が合意したcommand（tasklistで合意した取り返しのつかない操作等）をtasklist-executorに実行させる時は、利用者の合意の原文と、合意したcommandの一覧をそのまま渡す。」から始まり、実行環境が利用者の意図を判断に使う例（Claude Code の auto mode の分類器）、まだ与えていない承認・まだ起きていない確かめを指示に事実として書かないこと、止められた時は「実行環境gate」に従うことを書く一項目を足す。
  - `plugins/tumeda-dev/skills/README.md` の共有リファレンスの一覧に、`runtime-feedback-review.md` の一行（実装の feedback を受けた時に `facilitate-discussion` を `implementation_review.md` へ適用し、decision の戻り先を選ぶ手順）を足す。

---

## 要件（Requirements）

### MUST（必達）

- 「書く規則」のうち、利用者の確かめの経路を task-design の Step 4 に、合意の渡し方を steering の 6-1 に書く。止められた時の扱いは既存の「実行環境gate」を参照する。ask の rule と `!` は書かない。
- skills の README の共有リファレンスの一覧に、`runtime-feedback-review.md` の一行を足す。
- validator が pass し、書いた規則の assertion を持つ。
- release version を PATCH で上げる。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- `skills/` 直下の共有リファレンス（`runtime-*` 等）の分け方と置き場の見直し。この作業の目的の外であり、置き場と分け方の設計が要るため、plugin repository の issue #26 に切り出した。利用者の指示により、この作業を終えた直後に扱う。この作業では、skills の README の共有リファレンスの一覧に `runtime-feedback-review.md` の一行を足す（一覧の漏れ）だけを行う。
- ask の rule が画面を出さなかった原因を突き止めること。規則は実行許可の画面にも ask の rule にも頼らないため、原因がどちらでも規則は変わらない。

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出す。新しい assertion の文を一つ消すと失敗する。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| Claude Code に固有の内容が、host に依存しない文書に混ざる | host に依存しない共有リファレンス（`runtime-execution-contracts.md`）には足さない。task-design と steering では、規則を host に依存しない言葉で書き、Claude Code の auto mode は理由の例として添える |
| 確かめていない手段が、規則として固定される | ask の rule と `!` は書かない。規則は、確かめた事実（画面は permission mode で出ない、分類器は利用者の意図を使う）と、目的（合意した command が止められずに進む）から導けるものだけにする |

---

## テスト方針

- assistant が、repository の root で `node scripts/verification/validate-plugin.mjs`、`node scripts/verification/test-task-design-handoff.mjs`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` を実行する。
- assistant が、新しい assertion の文を一時的に変えて validator が失敗することを確かめ、元に戻す。
- assistant が、変更した文書に document-review を当てる。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/skills/runtime-execution-contracts.md`: 「この file は二つの対象を持つ」とし、二つ目に「command を実行しうる任意の skill が共通して従う、実行時一般の契約」を持つ。「実行環境 gate」は、task level の許可判定と実行環境が command を通すかは別の層であり、止められたら迂回せず停止して利用者へ返す、別の command で同じ結果を得ようとしない、特定の実行基盤に依存する手順はこの file へ書かない、とする。skills の README は、このファイルを host 非依存の共通ドキュメントとして載せる。
- `plugins/tumeda-dev/skills/runtime-model-profiles.md`: host に依存しない profile と、Claude Code と Codex への対応（adapter 規則）を一つの file に持つ。
- `plugins/tumeda-dev/docs/README.md`: docs の 5 群（common_standard、development_standards、doc_templates、documentation_standards、think_standards）。一つの file で足りる主題は新しい群を作らず既存の群へ置く。

---

## （付録）変更の実行区分

### 設計中に反映を終えた変更

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/SKILL.md` | Step 4「確認の担当と手段」に、実行許可の画面を確かめる手段にしない項目と、やってしまいがちな失敗を足した | validator が pass。利用先固有の語の grep は 0 件。編集後の skill-update-review は候補なし | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `plugins/tumeda-dev/skills/steering/SKILL.md` | 6-1 に、合意の原文と command の一覧を渡し、まだ起きていない確かめを書かない項目を足した | validator が pass。必須の文の末尾を一時的に変えると「必須項目…がない」で失敗し、戻すと pass。編集後の skill-update-review は候補なし | 同上 |
| `plugins/tumeda-dev/skills/README.md` | 共有リファレンスの一覧に `runtime-feedback-review.md` の一行を足した | validator が pass | 同上 |
| `scripts/verification/validate-plugin.mjs` | 上の三つの文の `requireText` を足し、`expectedRelease` を 9.1.4 にした | pass | [要件（Requirements）](#要件requirements) |
| release version（`.claude-plugin/marketplace.json` の 2 箇所、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`plugins/tumeda-dev/.codex-plugin/plugin.json`） | 9.1.3 から 9.1.4 へ上げた | validator の version 検査が pass。`test-task-design-handoff.mjs` が pass。`inspect-discussion.test.mjs` は 27 件中 pass 26、fail 0、skip 1 | 同上 |

### 設計中に反映する、他の判断を待っている変更

なし

### tasklist・roadmapに載せて実行する変更

なし（skill の文書と validator の変更で、合意済みの内容から一つの連続した反映と validation で完了した）
