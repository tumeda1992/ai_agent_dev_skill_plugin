# Design: facilitate-discussionの内部検討記録と自動okを、検討記録の質へ寄せて見直す

## 元の依頼内容

利用者の指示:

> steeringスキルで https://github.com/tumeda1992/ai_agent_dev_skill_plugin/issues/10 を対応したい

issue #10 の本文:

> タイトル: faciliate-disscussionのinternalな記録と自動ok、claudeには不要かも。
>
> claudeの記録と比較して不要か判断してほしい。
>
> codexのsteering。
> internalが必要か判断してほしいやつ
> https://github.com/tumeda1992/grow-product-ideas/pull/17/changes
>
> 論点41くらいまでClaudeがやって、それ以降はCodexがやったやつ
>
> codexは自分で考える時間が長いから、internalなログが長くなりがちだけどClaudeは不要そう。
> internalな記録を作った理由は、「提案背景」がその場の提案だけの背景になってしまって、
> さらにCodexで長考した後は論理が飛躍したかのように見えてしまったから、間を埋めたかった。
> だけど、それで問題になるのはCodexだけで、
> CodexとClaudeで共通するのはちゃんとした検討記録を書いてもらうこと。それはサマリじゃなくて、ちゃんと検討を重ねた記録がdiscussionに載り、その果てに今の提案に活きていることが残せること。
>
> だから、今みたいな検討記録にinternalなログのリンクだけ載せるのではなく、
> internalな記録ログはgit管理対象外にして、Codex特有の副産物のように扱って、検討記録は検討記録単体でイテレーション間の時系列をちゃんとサマリすぎないで残す扱いにすればいいかなって思った

---

## TL;DR

利用者がCodexとClaudeに共通して求めているのは、検討を重ねた過程がdiscussionに載り、その果てに今の提案があることを辿れる記録である（issue #10）。
内部検討記録は、Codexの長考の後に提案背景が飛躍して見えた間を埋めるために作られたが、現行の`facilitate-discussion`はdiscussion側の検討記録を「判断に必要な因果へ再構成した背景＋内部記録へのlink」にしており、回の間の変遷を内部記録へ押し出している。
今回は、discussionの検討記録をそれ単体で回の間の変遷が追える記録にし、内部検討記録をgit管理外の副産物へ下げる。
「自動ok」の見直しは今回扱わない。

---

## 完成後の姿

### skillの役割と方針

#### facilitate-discussion

discussionの検討記録は、それ単体で回をまたいだ検討の時系列を、要約しすぎずに残す。内部記録へのlinkだけで済ませない。内部記録はgit管理の対象外とし、Codexで出る副産物として扱う（task-design-discussion.md 論点1）。

「自動ok」（`derived-change.md`）は今回扱わない（非目標を参照）。

### 作業の流れと担当

内部記録の位置づけは論点1で決まった。残る問いは次の四つである。

- TBD3: 内部記録を前提にしている手順を、discussionだけで回る形へどう畳むか。対象は、調べる前に入力を内部記録へ保存する手順、中断からの復帰、記録漏れの回復、読取helperの起点照合（`--log`）、task-designのhandoffで内部記録を読む契約。
- TBD4: 目的別の記入形（`templates/consideration-records/`）を、検討記録の書き方の例として残すか、やめるか。
- TBD5: 利用先repositoryで内部記録をgit管理外にすることを、何で担保するか（skill本文の案内、各repositoryの`.gitignore`）。
- TBD6: 検討記録へ回の変遷を書いても、論点19で起きたdiscussionの肥大化が戻らない書き方。

### 文書以外に作るfileの中身

TBD: 上の二sectionから導く。変更候補は付録「分類保留」に列挙した。

---

## 要件（Requirements）

### MUST（必達）

- discussionの検討記録だけで、回をまたいだ検討の変遷と、それが今の提案へどう活きたかを辿れる。内部検討記録へのlinkだけで説明を省かない（issue #10「検討記録は検討記録単体でイテレーション間の時系列をちゃんとサマリすぎないで残す」）。
- 内部検討記録をgit管理の対象にしない（issue #10「internalな記録ログはgit管理対象外にして」）。

### SHOULD（できれば）

- TBD

### MAY（あれば嬉しい）

- TBD

### 非目標

- 「自動ok」（`derived-change.md`の仕組み）の見直し。issue #10で付随的な扱いだったため、今回は内部記録の見直しを中心にする（task-design-discussion.md 論点2）。利用者が自動適用の見直しを改めて依頼した時に、別の作業として扱う。

### 受け入れ基準

- TBD

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 内部検討記録を前提に組まれた中断復帰・回復・読取helper・handoffの契約が、片側だけ変わって矛盾する | TBD: 影響範囲を付録へ全件列挙し、各契約の正とする記録を決めてから変える |
| 検討記録へ回の間の変遷を書くことで、論点19で起きた「discussionが長くなり、判断対象を読むのに読み飛ばす量が増える」問題が戻る | TBD |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs`、`node scripts/verification/test-task-design-handoff.mjs`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` が通る。
- TBD: 変更した契約を検査するassertionの追加・撤去。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`「二層の保存先と読取範囲を解決する」: 内部検討記録は論点ごとに `internal-records/{D}.topic-{N}.md` へ置く。discussionは判断context・応答・decisionの正本、内部検討記録はprocess evidence・中断復帰の正本とする（「workflow全体で守る不変条件」）。
- `iteration.md`「内部検討を記録する」: 新しい検討blockは目的別format（`templates/consideration-records/`の六用途）を選び、実施前入力を内部logへ保存してから実施し、結果を保存してから次actionへ進む。
- `iteration.md`「保存した回を提示可能にする」: discussionの検討記録は「時系列の短縮版ではなく、なぜこの問いになり、どの条件が必要で、どの事実・反証が案を規定し、何を代償として残すかを説明する」再構成とし、内部logへの回単位のlinkを添える。
- `iteration.md`「保存境界から中断処理へ戻る」、`record-recovery.md`、`read-discussion.md`（`--log`による起点照合）、`scripts/inspect-discussion.mjs`、`task-design-work-handoff-contracts.md`、`task-design/SKILL.md`: 内部検討記録を読取・照合・復帰の対象に含める。
- `derived-change.md`: 既決事項からAIが一意に導出した変更と、利用者が明示委託した範囲の選択は、利用者の採否を問わず「変更内容」を報告し、同じ作業の次の実応答を確認してから反映する。報告は追加の承認を求める手続ではない。
- 導入の経緯: 内部検討記録は `.steering/2026/202609/20260921-restructure-facilitate-discussion/` の論点6（調査・検討の内部loopと提案背景への随時記録）と論点19（discussionの行数が増え、判断対象を見るのに読み飛ばす量が増えたため、経過を別fileへ分ける）で導入された。導出変更は `.steering/2026/202610/20261018-escalate-pending-plugin-improvements/` で「質問を減らしながら、根拠・変更前後・反映状況を追える記録を残す」ために導入された。
- `.gitignore`（root）と `.steering/.gitignore` は内部検討記録を除外していない。このrepositoryの `.steering/` 配下には、Claudeで作業した回の内部検討記録もcommitされている。

---

## （付録）変更の実行区分

### 設計中に反映を終えた変更

なし

### 設計中に反映する、他の判断を待っている変更

なし

### tasklist・roadmapに載せて実行する変更

TBD

### 分類保留（設計中のみ）

| 変更候補 | 保留理由 | 分類を決める判断 |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`、`iteration.md`、`record-recovery.md`、`read-discussion.md`、`derived-change.md`の内部記録への言及 | 内部記録を前提にした手順の畳み方で変わる | TBD3 |
| `plugins/tumeda-dev/skills/facilitate-discussion/templates/internal_record.md`、`templates/consideration-records/` | 内部記録の保存形と目的別の記入形を残すかで変わる | TBD3、TBD4 |
| `plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs`、`inspect-discussion.test.mjs` | `--log`の起点照合を残すかで変わる | TBD3 |
| `plugins/tumeda-dev/skills/task-design/SKILL.md`、`plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md` | 内部記録を読む契約を残すかで変わる | TBD3 |
| `facilitate-discussion/templates/discussion_entry.md`の内部記録へのlink行 | 検討記録の書き方の決定から導く | TBD3 |
| git管理外にする設定（root `.gitignore`、`.steering/.gitignore`、利用先repositoryへの案内） | 何で担保するかが未決 | TBD5 |
| このrepositoryの `.steering/` 配下でcommit済みの内部記録 | 残すか消すかが未決 | TBD3 |
| `scripts/verification/validate-plugin.mjs`、`scripts/verification/test-task-design-handoff.mjs` | 検査する契約の文が上の変更で決まる | 上の全TBD |
| 配布version（四つの宣言値と`expectedRelease`） | MAJOR／MINOR／PATCHが変更内容で決まる | 上の全TBD |
