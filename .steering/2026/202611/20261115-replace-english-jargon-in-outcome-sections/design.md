# Design: task-designのテンプレートから、利用者の目に出る、解釈が要る耳馴染みのない表現をなくす

## 元の依頼内容

https://github.com/tumeda1992/ai_agent_dev_skill_plugin/issues/5 を解決したい

issue #5「ルー語を改善する（改善 in クラウドセッション）」本文:

```text
- owner
- callerのcontract
  - 完成した姿のファイル名はそれでいいけど、見出しにそれ使われたくない
  - 「xxの呼ばれ方」「xxの呼び元からの呼び出し方」
  - contractも分かりづらい
- その他 .agents/skills/task-design/templates/outcome-sections の中は分かりづらい
```

---

## TL;DR

`task-design`の`templates/outcome-sections/`は、普段の会話で聞かない表現（precedence、全量保存宣言等）や、聞き慣れた語にここだけの意味を載せた表現（owner、contract、「所有する」等）で書かれており、読者が訳し直さないと読めない。
読者は、テンプレートを読んでdesign.mdを書くagentと、出来上がったdesign.mdを読む利用者である。agentがその表現をdesign.mdへ持ち込むため、design.mdの読み手にも同じ負担が移る。
同じ型の表現は、design.md・roadmap.mdのテンプレートの見出しや表のlabelにもあり、成果物へそのまま写る。
終了時には、task-designのテンプレートのうち利用者の目に出る表現（見出し、本文、記入欄のlabel）と、agentがその語を成果物へ持ち込む入口になる記入guideが、普段の意味のまま読んで正しく受け取れる表現で書かれ、同じ書き方が再び増えないための判断基準が置かれている。agentへの指示の文など、skillの内部だけでやり取りされる語は内輪で通じればよいため、言い換えない。

---

## 完成後の姿

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/templates/outcome-sections/*.md`（14 file） | design.mdを書くagent、design.mdを読む利用者 | 表現を訳し直さずに、sectionを選び、見出しと記入欄を埋め、出来上がったdesign.mdを読める |
| `plugins/tumeda-dev/skills/task-design/templates/design.md`、`tasklist.md`、`roadmap.md` | 成果物を書くagent、design.md・tasklist.md・roadmap.mdを読む利用者 | 成果物の見出しと表のlabelを、task-designの内部の区分を知らなくても読める |
| 言い換えたlabelを名前で読むskill・script・validator（TBD: 言い換え先が決まってから列挙する） | 各skillを実行するagent、検証を走らせる保守者 | 言い換え後のlabelで、これまでどおり成果物を検証・抽出できる |

**完成後の内容と構造:**

TBD: 用語の対応（各表現の言い換え先）が決まってから、各fileの見出しと本文の完成形を書く。

現時点で確定している構造上の前提:

- file名（`caller-contracts.md`、`contract-preservation.md`等）は変えない。issueが「ファイル名はそれでいい」と明示している。
- 範囲は、利用者の目に出るかで引く。

  | 表現の置き場所 | 扱い |
  | --- | --- |
  | outcome-sectionsの見出し・本文・記入欄のlabel | 「見分ける問い」で判定し、言い換える |
  | design.md・tasklist.md・roadmap.mdのテンプレートの見出し・表のlabel | 「見分ける問い」で判定し、言い換える |
  | テンプレートの記入guide（HTML comment） | 「見分ける問い」で判定し、言い換える。成果物へは直接出ないが、agentがその語を成果物へ持ち込むため、表出の入口として扱う |
  | SKILL.md・tasklist-design.md・roadmap-design.md等、agentへの指示の文 | 言い換えない |
  | 言い換えたlabelを名前で読むskill・script・validator | labelの文字列だけを追随させる。周りの文は言い換えない |
- 言い換えたlabelと、それを名前で読む側の追随は、同じcommitに含める。片方だけが変わった状態を作らない。

TBD: `caller-contracts.md`の見出し。issueの候補は「xxの呼ばれ方」「xxの呼び元からの呼び出し方」。contractという語をどう分解するかは用語の対応の論点で決める。

**記載する原則と例:**

- 見分ける問い: このpluginを知らない開発者が、task-designのテンプレートや、それを使って書かれたdesign.mdでこの表現を見たとき、普段使っている意味のまま読んで、書き手の意図どおりに受け取れるか。受け取れないなら言い換え、受け取れるなら残す。英語か日本語かは問わない。
  - 今回の具体例（耳馴染みがない表現）: precedence、tie-break、closed-world、baseline、ledger、handoff、意味正本、理解依存、全量保存宣言、明示差分、形式知化、通底
  - 今回の具体例（聞き慣れているが、ここで特別な意味を載せている表現）: owner（その内容に責任を持つ担い手）、contract（呼び出し方と、結果の保証）、gate（先へ進む前の判定）、「所有する」（そのsectionに書く）、正本
  - 意図に反する薄い記述: 英語を日本語へ置き換えるだけにする。「所有する」「正本」のように日本語でも解釈が要る表現が残り、ownerを「オーナー」とカタカナにしても意味は伝わらない。
- 残す表現: 識別子・path・file名・code例、task-design全体で決まった形式（MUST／SHOULD／MAY、TBD、TL;DR、`KEEP | MOVE | ...`等）、普段の開発の会話で普段の意味のまま使う語（file、directory、code、test、API、class、function、module、error、data、Markdown、template、commit、branch等）。

**配置・形式:**

- 配置: 既存fileの書き換え。file追加・削除・改名はしない。
- 形式: 既存のMarkdown構造（HTML commentの記入guideと、記入欄）を保つ。

### TBD: 再発防止の判断基準

TBD: 「見分ける問い」を文書として置くか、置くならどこか（`documentation_standards/`の新しい標準、既存の`referent_explicitness.md`への追記、プロジェクト指示への追記、`document-review`の観点への追加）は再発防止の論点で決める。置く場合はこのsectionを`documentation.md`の型で書く。

---

## 要件（Requirements）

### MUST（必達）

- 範囲に入る表現（outcome-sectionsの見出し・本文・記入欄のlabel・記入guide、design.md・tasklist.md・roadmap.mdのテンプレートの見出し・表のlabel・記入guide）に、「見分ける問い」で言い換え対象と判定される表現を残さない。
- file名は変えない。
- 既存の記入guideが持つ判断能力（なぜ必要か、NG、記述例、MUST、判断基準）を、言い換えで落とさない。
- 言い換えたlabelを名前で読むskill・script・validatorを、同じcommitで追随させる。

### SHOULD（できれば）

- TBD

### MAY（あれば嬉しい）

- TBD

### 非目標

- SKILL.md・tasklist-design.md・roadmap-design.md等、agentへの指示の文の言い換え。skillの内部だけでやり取りされる語は、内輪で通じればよい。言い換えたlabelを名前で読む箇所の文字列の追随だけは行う。
- agentがchatで使う語の言い換え。出どころは指示の文であり、範囲に入れると指示の文を全部言い換えることになる。利用者へ向けて書く時の基準として、再発防止の側で扱う。
- task-design以外のskill（facilitate-discussion等）が作る成果物の言い換え。今回のissueはtask-designの範囲である。再発防止の基準ができた後、必要になった時にその基準で扱う。

### 受け入れ基準

- TBD: 用語の対応が決まったら、「言い換え対象と判定した表現が、対象fileに出現しない」をgrepで確かめられる形で書く。
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 言い換えで、元の表現が担っていた区別（例: callerとconsumer、ownerとwriter）が潰れる | TBD: 用語対応表の論点で、区別が要る語の組を先に洗い出す |
| テンプレートと、agentへの指示の文で、同じ概念の呼び方が二系統になる | 指示の文は内輪の語として残すと合意済み。成果物へ出るlabelは、名前で読む側の文字列を同じcommitで追随させ、取り決めの食い違いは作らない |

---

## テスト方針

- TBD: 用語の対応が決まった後、言い換え対象と判定した表現を対象file全体からgrepで抽出し、zeroであることを確かめる。
- `node scripts/verification/validate-plugin.mjs` を実行する。

---

## （付録）前提とする既存仕様

- プロジェクト指示（`AGENTS.md`、`.agents/skills/tumeda-dev-plugin-context.md`の「プロジェクト指示」）: repository内のdocument本文は日本語で記述する。code、command、path、識別子、規定された出力形式、固有名詞は原文を維持する。owner、contract等の普通の概念語は、この例外のどれにも当たらない。
- `outcome-sections/`の現状: 14 file、1137行。backtickの外にある英単語の出現数（大文字小文字を区別しない、2回以上のもの）を数えると、section 94、owner 70、contract 60、caller 31、ledger 29、outcome 27、state 24、gate 24、scope 20、evidence 20、baseline 16、finding 15、trigger 11、caller-facing 11、handoff 9、consumer 4、precedence 2、tie-break 2等である。
- `scripts/verification/validate-plugin.mjs`: outcome-sectionsの14 fileの存在と、`documentation.md`の三つの文（「統合する時は、統合先の範囲に入ることを」等）を検査する。見出しの文字列は検査していない。
- `documentation_standards/referent_explicitness.md`: 「system内部語」が実体と結ばれていなければ暗黙の指示語として働く、と定める。英語の概念語の問題はこれと近いが、同じかは未判定。
- `document-review`: 書いたmdをemit前に標準へ照らす。観点の中身は`documentation_standards/`の各fileが正本で、skillは参照だけを持つ。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

なし

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし

### 分類保留（設計中のみ）

| 変更候補 | 保留理由 | 分類を確定するdecision |
| --- | --- | --- |
| outcome-sections 14 fileの言い換え | 言い換え先が未決 | 用語の対応 |
| design.md・tasklist.md・roadmap.mdのテンプレートの言い換えと、labelを名前で読む側の追随 | 言い換え先が未決 | 用語の対応 |
| 再発防止の判断基準の追加 | 置くかどうか、置き場所が未決 | 再発防止 |
