# Design: document-review skill を plugin へ吸収する

## 元の依頼内容

rapi/.agents/skills/document-review を吸収したい

（`escalate-plugin-skill-fix` 経由で利用先 repository から引き渡された。利用先固有情報は引き渡し時点で除去済み）

---

## TL;DR

利用先 repository で md 成果物の emit 前ゲートとして運用している `document-review` を、この plugin へ取り込む。plugin には現在この位置づけの skill が無く、`doc-enricher` は既存 README への追記提案を担うが md 成果物一般の品質ゲートは担っていない。doc を書く skill が増えるほど、品質基準を各自が持つことになる。

吸収は skill 本体と、参照先のうち plugin に無い `content_density.md` の 2 つで成立する。後者は利用先の事業ドメイン語を汎用の題材へ置換して新設する。

---

## 完成後の姿

使用する outcome section は `skill-policy`（新規 skill の役割・判断方針・能力境界）、`file-deliverables`（SKILL.md の仕様）、`workflow`（他 skill が emit 前ゲートとして呼ぶ handoff）、`documentation`（新設する標準 doc が成立させる知識体系）、`contract-preservation`（利用先からの移動と意味保存）。

### 参照する標準の揃え方

吸収対象の skill は「各標準の当て方はその標準ファイルが正本であり、ここに内容を写さない」という構造を持つ。skill 本体が薄く参照先が厚いため、参照先が揃うことが skill の成立条件になる。

| 標準 | plugin 側 | 完成後 |
| --- | --- | --- |
| `expression_notation.md` | あり | そのまま参照する |
| `file_naming.md` | あり（`development_standards/naming/file.md` を指すスタブ） | そのまま参照する |
| `content_density.md` | なし | 汎用化して新設する |

`content_density.md` は利用先版 240 行の骨格を保ちながら、事業ドメインの具体例を汎用の題材へ置換して新設する。保存する骨格は、濃さの定義（読者が下駄を履く / 深く知る・十全に実行できる・アンチパターンを踏まない）、薄さが書き手と読者の満足条件の非対称から生まれること、抽象と具体の役割分担と往復が閉じる条件、トピックを実行できる形まで降ろす 3 要素、比較で見つかる 4 つの崩れ（薄い節・平準化・射程縮小・振動）とそれぞれの検知方法、厚さと濃さの区別、検知の 3 問と比較 4 本。

置換するのは業務語彙であって機構ではない。支払方法ごとに期限切れ判定が違うという構造、階層の基準が一方の軸では割れて他方では割れないという対比、同じ実質量を持つ 2 つの module が異なる粒度で書かれたという比較は、いずれも業務語彙を外しても成立する。plugin の `expression_notation.md` が同じ手法で作られており、利用先版と同じ骨格を持ちながら図の例が「与信」ではなく「在庫確認」になっている。

利用先版が `information_structuring/writing_module.md` を参照する 4 箇所は読み替える。隣接トピックのポインタ 1 箇所は plugin の `information_structuring/README.md` へ向け、具体例の「現物」として使う 3 箇所は plugin 内で成立する題材へ差し替える。`writing_module.md` 自体は吸収しない。253 行あり固有語 27 箇所を含むため、その汎用化は今回の依頼の範囲を超える。

汎用化後の版は `content_density.md` 自身の基準で判定する。差し替える現物が plugin 内から取れず薄くなると判断された場合は、吸収を保留する経路を残す。

### skill の役割と判断方針

`document-review` は、md を emit する前に読者がその doc で作業できる状態に達しているかを判定し、達していないものを出させない。書き手が自分では見えない薄さを検知させ、指摘の性質に応じて直すか書き直すかを判断させる。

#### 要素の充足ではなく観点の充足で判定する

書き手は「載せた」で満足でき、読者は「使える」でしか満足しない。この非対称があるため、トピックが挙がっていることや節が揃っていることを完了条件にすると薄い doc がそのまま通る。判定は常に観点を満たしたかで行い、満たさないなら出さない。

違反の兆候は、指摘を返すときに「触れてはいる」「抜けは無い」を根拠にすることである。これが出たら、その節を読み終えた読者が何をできるようになるかを 1 文で言えるかへ戻す。言えないなら濃さの目標が定まっていない。

#### 薄さは微細な指摘ではない

指摘は 2 種類に分かれ、対処が違う。記法の一部・命名・言い回しは微細であり、直してレビューを最初から回し直す。指摘が尽きるまで繰り返すのは、直した結果が別の観点を崩すことがあるためである。

骨子・構造・実質の破綻は微細でなく、書く工程へ戻して生成をやり直す。パッチで繕わない。濃さ不足はこちらに属する。1 行足すと書き手の基準では満たされるが、読者は依然として何も持ち帰れないためである。正しい対処は、そのトピックを読者が実行できる形まで降ろすか、親へ畳むかのどちらかになる。

#### 観点の当て方は標準 file が正本

この skill は観点の名前と、いつ当てるかだけを持つ。当て方の中身は `content_density.md` / `expression_notation.md` / `file_naming.md` が正本であり、skill 本文へ写さない。写すと二重管理になり、標準を直しても skill 側が古いまま残る。

新規作成は作成と更新の両方にあたるため、作成時観点と更新時観点の両方を当てる。更新時の濃さ観点では、書き足した箇所だけでなく前の版から削った要素も見る。指摘を受けて書き直すと、指摘された点だけを直して前版に成立していた要素を無自覚に捨てることがあるためである。

#### 能力境界と非目標

何を書くべきかという知識の取捨選択は `doc-enricher` が担う。この skill は書かれたものが観点を満たすかだけを見る。逆に、観点を満たさない doc を「残す価値がある知識だから」という理由で通さない。

観点を増やすときは「ケース別観点」の下へ足す。現時点で中身は無く、必要になったときに追加する枠として置く。

#### 呼び出し経路

`tasklist-executor` と `task-design` からの emit 前ゲートとしての呼び出しに加え、ユーザーが明示する単独起動も受け付ける。呼び出し元が 2 skill に限られるため、それ以外の場面で md を触ったときに明示的に通せる入口が要る。呼ばれなければ誰も気づかないという弱点は残るが、入口を塞ぐ理由にはならない。

`doc-enricher` が `plugins/tumeda-dev/docs/` 配下へ追記する場合も対象に含める。出所を問わず当てることで境界が単純になる。`doc-enricher` の Gate A〜G は残すべき知識かを判定するもので、書かれた文が観点を満たすかは見ないため重複しない。

### ゲートを呼ぶ場面

`document-review` を emit 前ゲートとして呼ぶのは、docs と skill 本体の作成・更新に限る。

| 対象 | 扱い | 理由 |
| --- | --- | --- |
| `docs/` 配下の標準 doc | 当てる | 読者が読んで作業できるようになることを期待する成果物。現在どの gate も無い |
| `skills/` 配下の `SKILL.md` と `templates/` | 当てる | 同上。既存 gate は `outcome-sections` の観点別 MUST であり、濃さ・記法・命名を横断的に見ない |
| steering の作業記録 | 当てない | 読者が次にその steering を読む人に限られ、合意済みの完成後状態を記録する場所。`task-design` が議論色ゼロを 2 段階で確認する gate を既に持つ |
| 利用先 README への追記 | 当てない | `doc-enricher` の Gate A〜G が担う |

呼び出しの書き込み先は、docs と skill 本体を実際に書く工程を持つ `tasklist-executor`。加えて `task-design` が `documentation` outcome を設計する場面でも参照させる。

### plugin 配布への反映

`document-review` は新しい skill であり、consumer が新たに呼べるものが増える。`maintenance-plugin-context` の規約では MINOR bump にあたるため、version を 7.4.2 から 7.5.0 へ上げる。宣言値 4 箇所（`.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`、root `marketplace.json` の `version` と `plugins[].version`）と `validate-plugin.mjs` の `expectedRelease` を一度に揃える。

`validate-plugin.mjs` は重要な contract を `requireText` / `forbidText` で pin 留めする構造を持つ。将来の短縮で消えると困る contract を 3 つ pin 留めする。

- 観点の当て方を標準 file へ委ね、skill 本文へ写さないこと。二重管理を防ぐ contract であり、消えると skill 側へ内容が写り始める
- 薄さが微細な指摘でないこと。微細と微細でないの二分岐の核心であり、消えると濃さ不足がパッチで繕われる
- 要素の充足ではなく観点の充足で判定すること。消えると「触れてはいる」で通るようになる

`content_density.md` の新設に伴う assertion は置かない。docs の内容は skill の contract ではなく、変更の妥当性は人の review で担保する。

---

## 要件（Requirements）

### MUST（必達）

- `plugins/tumeda-dev/skills/document-review/SKILL.md` を新設し、利用先版が持つ contract を全量保存する
- `plugins/tumeda-dev/docs/documentation_standards/content_density.md` を新設し、利用先版の骨格を保ちながら事業ドメイン語を汎用の題材へ置換する
- 新設した 2 file に、利用先 repository の固有情報（社名・repository 名・プロダクト名・事業ドメイン語・固有 path）が残っていない
- `content_density.md` の参照がすべて plugin 内で解決する
- `tasklist-executor` と `task-design` へ emit 前ゲートとしての呼び出しを書き込む
- version を 7.5.0 へ上げ、宣言値 4 箇所と `expectedRelease` を揃える
- `validate-plugin.mjs` へ contract 3 つの `requireText` を追加する
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を返す

### SHOULD（できれば）

- 汎用化した `content_density.md` を、その標準自身の検知方法（読者になりきる 3 問と比較 4 本）で判定する

### MAY（あれば嬉しい）

- 新設した 2 file を `document-review` 自身に通し、ゲートが機能することを確かめる

### 非目標

- `information_structuring/writing_module.md` の吸収。253 行で固有語 27 箇所を含み、汎用化は今回の範囲を超える
- `expression_notation.md` の双方向ドリフトの解消。利用先だけにある「小見出し」の記述を逆輸入するかは独立した decision
- steering の作業記録（`design.md` / `tasklist.md` / discussion file / `summary.md`）へゲートを当てること
- 既存 skill が持つ gate（`task-design` の完成設計書チェック、`doc-enricher` の Gate A〜G、`facilitate-discussion` と `steering` の形式契約）の変更

### 受け入れ基準

- 新設 2 file に対する固有情報の grep がゼロ件
- `content_density.md` から `writing_module.md` への参照がゼロ件で、代わりに plugin 内の題材と `information_structuring/README.md` を指している
- `validate-plugin.mjs` が pass し、`expectedRelease` が 7.5.0 である
- `document-review/SKILL.md` に、利用先版の 3 観点・適用時・回し方の 4 contract が読み取れる

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 汎用化で `content_density.md` の検知力が落ち、その標準自身の基準で薄くなる | 書いた後にその標準の検知方法（読者になりきる 3 問と比較 4 本）を当てる。薄いと判断されたら吸収を保留する経路へ戻る |
| 事業ドメイン語の置換漏れで非公開情報が公開 plugin へ入る | commit 前に固有語で grep し、ゼロ件を確認する。`migration.md` のセルフチェックに従う |
| `writing_module.md` の現物 3 箇所を差し替える題材が plugin 内から取れない | plugin は skill 本体と docs を持ち改稿履歴が `.steering/` に残るため候補はある。取れなければ該当箇所を削らず、汎用の記述へ置換したうえで濃さを再判定する |
| 利用先版の contract を要約で落とす | `function_migration_policy.md` に従い、移植前の contract を意味単位で照合する |
| 呼び出しを書き込んでも誰も通さない | 単独起動の入口を残す。ただし呼ばれなければ気づかない弱点は残るため、受け入れ基準を skill 本体の記述で判定する |

---

## テスト方針

この repository は自動 test framework を持たない。skill 本文と docs の内容は人の review で担保する。移植の正しさは次で判定する。

- **固有情報の除去**: 新設 2 file を利用先の社名・repository 名・事業ドメイン語・固有 path で grep し、ゼロ件を確認する
- **参照解決**: `content_density.md` が参照する file がすべて plugin 内に存在することを確認する。`writing_module.md` への参照が残っていないことも同時に見る
- **contract の保存**: 利用先版の `document-review` が持つ contract（3 観点とその適用時、回し方の 4 項目、標準を正本とする構造）が新設 file から読み取れることを、移植前後の照合で確認する
- **manifest 整合**: `node scripts/verification/validate-plugin.mjs` を実行し `plugin validation passed` を確認する。version 宣言値 4 箇所と `expectedRelease` の一致もここで検査される
- **自己適用**: 新設した 2 file を `document-review` の観点で判定する。汎用化した `content_density.md` が自身の基準を満たすかを見る

---

## （付録）前提とする既存仕様

### 吸収対象の skill が持つ contract

md ファイルを作成・更新したとき、emit する前に通すレビューゲート。新規作成は「作成＝更新でもある」ため作成時・更新時の両方の観点を当てる。観点は「作成時観点」「更新時観点」「ケース別観点」の 3 系統を小見出しで持ち、標準が増えたらその下に足す構造を取る。「ケース別観点」は現時点で中身が無く、必要になったら追加する枠として置かれている。

観点の当て方は各標準ファイルが正本であり、skill 本体へ内容を写さない。二重管理を避けるためである。

| 観点 | 参照する標準 | 適用時 |
| --- | --- | --- |
| 内容の濃さ | `content_density.md` | 作成時・更新時（更新時は「書き足した箇所だけでなく、前の版から削った要素も見る」） |
| 記法 | `expression_notation.md` | 作成時・更新時 |
| 命名 | `file_naming.md` | 作成時のみ |

回し方の contract を持つ。微細な指摘（記法の一部・命名・言い回し）は直してレビューを最初から再度回し、指摘が尽きるまで繰り返す。微細でない指摘（骨子・構造・実質の破綻）は書く工程へ戻って生成をやり直し、パッチで繕わない。「薄い（濃さ不足）は微細でない」と明示し、1 行足して繕わずトピックを読者が実行できる形まで降ろすか親へ畳む。判定は「要素が揃った」ではなく「観点を満たした」で行い、満たさないなら出さない。

### plugin 側の既存 skill 構成

`doc-enricher` / `escalate-plugin-skill-fix` / `facilitate-discussion` / `maintenance-plugin-context` / `name-work-directory` / `steering` / `task-design` / `tasklist-executor` / `test-runner` / `think-through` / `visual-inspector` の 11 個。

`doc-enricher` は code reading やタスク遂行後に、永続性が高くレバレッジの高い知識を既存 README へ提案する。提案 mode が既定で、承認後だけ書き込む。新規 docs の作成は禁止している。md 成果物一般の emit 前レビューは担っていない。

### plugin 側の標準文書体系

`plugins/tumeda-dev/docs/documentation_standards/` に `business_specification.md` / `case_coverage/` / `core_readers.md` / `expression_notation.md` / `file_naming.md` / `how_to_write_workflow.md` / `information_structuring/` / `modify_description_policy.md` / `README.md` / `stock-and-flow-information.md` / `supplier-consumer-relation.md` を持つ。

### 移植の規範

`plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies/migration.md` が、他 repository との移植・追随・逆輸入を扱う。公開 plugin であることから、参照元 repository 固有情報を抜き汎用知識だけを記載することを MUST とする。抜く対象は社名・repository 名・プロダクト名・絶対 path・固有ドメインモデル名・固有外部サービス名・commit ハッシュ。固有例は汎用の仮名や抽象説明へ置換する。

`plugins/tumeda-dev/docs/common_standard/function_migration_policy.md` が、配置や owner を変えても挙動と意味を全量維持する共通規範を持つ。

### 配布 version の規約

`maintenance-plugin-context` が、`MAJOR.MINOR.PATCH` の release version だけを使うことと、宣言値 4 箇所（`.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`、root `marketplace.json` の `version` と `plugins[].version`）および `validate-plugin.mjs` の `expectedRelease` を一度に揃えることを定める。MINOR と PATCH の境界は「consumer が新たに呼べるものが増えたか」で判定する。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

なし

### task-design内の対象成果物反映待ち

なし

### execution plan対象

| 対象 | 掲載理由 | 参照するdesign section |
| --- | --- | --- |
| `docs/documentation_standards/content_density.md` の新設 | 段階実行。240 行の汎用化は、置換 → 参照の読み替え → 自身の基準による濃さ判定という順序依存の段階を持ち、判定で薄いと出たら書き直しへ戻る。一つの連続した反映では安全に完了できない | [参照する標準の揃え方](#参照する標準の揃え方) |
| `skills/document-review/SKILL.md` の新設 | 段階実行。`content_density.md` が確定した後でなければ参照を書けない。順序依存を持つ | [skill の役割と判断方針](#skill-の役割と判断方針) |
| `tasklist-executor/SKILL.md` と `task-design/SKILL.md` への呼び出し記述 | 段階実行。呼び出し先の skill が存在した後でなければ書けない | [ゲートを呼ぶ場面](#ゲートを呼ぶ場面) |
| version 宣言値 4 箇所と `validate-plugin.mjs` | 段階実行。assertion は skill 本文が確定した後でなければ pin 留めする文言を決められない。`validate-plugin.mjs` の実行が最終 gate になる | [plugin 配布への反映](#plugin-配布への反映) |
