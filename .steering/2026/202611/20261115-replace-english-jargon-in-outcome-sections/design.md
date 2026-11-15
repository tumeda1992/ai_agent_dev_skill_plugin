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

TBD: 本文と記入guideの文の完成形、design.md・tasklist.md・roadmap.mdのテンプレートの言い換えは、それぞれの論点で決める。

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

outcome-sectionsの見出し、記入欄のlabel、表の列名、placeholder、記入guideの小見出しは、次のとおりにする。表に無い名前（「なぜ必要か」「NG」「判断基準」「記述のMUST」「具体的な記述例」「記入例」「移行元」等）は、普段の意味のまま読めるため残す。

##### 各sectionの見出し（design.mdへ写る）

| file | 今 | 後 |
| --- | --- | --- |
| `caller-contracts.md` | ### callerが依存するcontract | ### 呼び出し元から見た呼び出し方と保証 |
| `contract-preservation.md` | ### contractの保存と明示差分 | ### 移行で変えない振る舞いと、意図して変える差分 |
| `documentation.md` | ### documentationによって成立する知識体系 | ### 文書にまとめる知識と、その保ち方 |
| `file-deliverables.md` | ### documentation以外のfile deliverable | ### 文書以外に作るfileの中身 |
| `research-findings.md` | ### 調査・比較・技術検証によるfindings | ### 調査・比較・技術検証で分かったこと |
| `workflow.md` | ### workflow | ### 作業の流れと担当 |

残す見出し: codeの責務配置と依存構造、データモデル、操作フロー、runtime・設定・環境構築、画面イメージと配置意図、skillの役割と方針。

`caller-contracts.md`は、issueの候補「xxの呼び元からの呼び出し方」に、このsectionが併せて持つ「成功・失敗時に何が起きるかの保証」を足した。「xxの呼ばれ方」の形（xxに対象名を入れる）は、一つのsectionで複数のfunctionやendpointを扱う時に見出しへ入りきらないため採らなかった。

##### 記入欄のlabel・表の列名・placeholder（design.mdへ写る）

| file | 今 | 後 |
| --- | --- | --- |
| `caller-contracts.md` | **新設・変更するcaller-facing class / function:** | **新設・変更する、呼び出し元が使うclass / function:** |
| | **mutation / endpoint / caller contract:** | **mutation / endpointの呼び出し方:** |
| | caller: / input contract: / 成功時のresult: / 成功時のside effect: | 呼び出し元: / 入力の条件: / 成功時の結果: / 成功時の副作用: |
| | **失敗contract:** | **失敗時の返し方と、dataの状態の保証:** |
| | \| 条件 \| caller-facingなerror contract \| state・side effectの保証 \| | \| 条件 \| 呼び出し元へ返すerror（type、status、payload） \| dataの状態と副作用の保証 \| |
| `code-structure.md` | **境界のrule:** | **moduleの間の決まり:** |
| | **全体のcall関係:** | **全体の呼び出し関係:** |
| | {Caller-facing entry} -> {Owner A} -> {Owner B} -> {Result owner} | {呼び出し元が使う入口} -> {担当module A} -> {担当module B} -> {結果を返すmodule} |
| `contract-preservation.md` | **baselineとevidence:** | **移行前の基準と、照合の記録:** |
| | 表の行: baseline / 対象scope / ledger / 一般procedureの正本 | 移行前の基準 / 対象範囲 / 移行の対応表 / 移行手順を定める文書 |
| | **完成後の差分宣言:** | **変わるものと、保存されるもの:** |
| | \| 完成後の意味差分 \| 移行前との違い \| 詳細owner \| 出典 \| | \| 完成後に変わる意味 \| 移行前との違い \| 詳細を書いたsection \| 根拠 \| |
| `data.md` | **典型case:** | **代表的なcase:** |
| | \| operation \| 操作前 \| 操作後 \| relation・cascade・保持値 \| | \| 操作 \| 操作前 \| 操作後 \| 関連するdataへの影響・残る値 \| |
| `documentation.md` | **形式知化する対象:** | **文書にする知識:** |
| | **読者と成立させる判断:** | **読者と、読んでできるようになる判断:** |
| | **知識構造:** | **知識の並べ方:** |
| | **規範の根拠と適用境界:** | **決まりの理由と、当てはめる範囲:** |
| | **snapshotと維持規律:** | **内容を最新に保つ方法:** |
| | **完成後のdocument構造:** | **完成後の文書の構成:** |
| | \| 読者 \| 利用場面 \| codeや過去会話を再調査せず可能になる判断・action \| 入口・読む順序・検索語 \| | \| 読者 \| 読む場面 \| codeや過去の会話を調べ直さずにできるようになる判断・作業 \| 最初に開く場所・読む順序・検索語 \| |
| | \| 正しいsnapshot \| single source of truth \| 更新owner \| 更新trigger \| 腐敗signal・同時確認先 \| | \| 保つべき内容 \| 正とする記述の置き場所 \| 直す人 \| 直すきっかけ \| 古くなったと気づく兆候・あわせて確認する文書 \| |
| `interaction-flow.md` | **ケース: {actorの操作名}** | **ケース: {操作する人の操作名}** |
| | \| case \| success flowからの分岐 \| call・stateへの影響 \| actorの観測と次の操作 \| 参照するcontract \| | \| case \| 成功時の流れから分かれる点 \| 呼び出しと状態への影響 \| 操作する人に見えることと次の操作 \| 関係する呼び出し方 \| |
| `research-findings.md` | **evidenceとfinding:** | **根拠と、分かったこと:** |
| | **可能になった判断と限界:** | **できるようになった判断と、言えないこと:** |
| | \| source / method \| comparison条件・environment・version \| 再現方法 \| | \| 情報源・方法 \| 比較の条件・環境・version \| 再現方法 \| |
| | \| evidence \| evidenceから直接言えるfinding \| 確度・適用範囲 \| | \| 根拠 \| 根拠から直接言えること \| 確かさ・当てはまる範囲 \| |
| `runtime-and-configuration.md` | **file配置と既存pattern:** | **fileの置き場所と、倣う既存の書き方:** |
| | \| identifier / dependency \| 値または解決元 \| default \| 影響する挙動 \| | \| 設定名・依存 \| 値または値の取得元 \| 既定値 \| 影響する挙動 \| |
| | {context / config / secret owner} | {context / config / secretの管理元} |
| | \| environment \| 配置・起動条件 \| 観測可能な結果 \| | \| 環境 \| 配置・起動条件 \| 外から確かめられる結果 \| |
| `screen.md` | **inputの供給元:** | **表示に使う値の出どころ:** |
| | \| input \| 供給元 \| 受渡し経路 \| 未取得・失敗時 \| | \| 値 \| 出どころ \| 渡される経路 \| 取得前・失敗時 \| |
| `skill-policy.md` | ##### {policyの内容を表す固有見出し} | ##### {方針の内容を表す見出し} |
| `workflow.md` | **ownerと責務:** | **担当と、受け持つこと:** |
| | **必須順序とhandoff:** | **守る順序と引き継ぎ:** |
| | \| owner \| 判断・更新するもの \| 行わないこと \| single source of truth \| | \| 担当 \| 判断・更新するもの \| 行わないこと \| 正とする記録 \| |
| | 図のlabel {event / gate / owner} | {きっかけ / 先へ進む条件 / 担当} |

`workflow.md`では、判断・更新の担い手を指す語を「担当」に揃える（論点3の決定）。`contract-preservation.md`の「移行前の基準」「移行の対応表」は、`function_migration_policy.md`が定義するbaseline、ledgerに当たる。design.mdの読み手には言い換えた語を見せ、記入guideで定義元の語との対応を一度だけ示す。

##### 記入guideの小見出し（file間で揃える）

| 今 | 後 |
| --- | --- |
| owner境界:（7 file） | このsectionに書くこと・書かないこと: |
| `skill-policy.md`の「このsectionが所有するもの:」と「owner境界:」 | このsectionに書くこと: / このsectionに書かないこと: |
| selection gate:（`code-structure.md`）、選択gate:（`skill-policy.md`） | このsectionを選ぶ条件: |
| 成功・失敗contractのselection gate: | 成功・失敗時の返し方を書く条件: |
| 更新・削除caseと不変条件のselection gate: | 更新・削除caseと不変条件を書く条件: |
| 失敗・操作中断・境界caseの選択gate: | 失敗・操作中断・境界caseを書く条件: |
| 状態選択のgate: | 書く状態を選ぶ条件: |

##### READMEとcatalogの見出し（agentがsectionを選び並べる時に読む）

| file | 今 | 後 |
| --- | --- | --- |
| `README.md` | # outcome sectionの構成と未決候補 | # 完成後の姿のsectionの並べ方と、追加候補 |
| | ### 同順位の既定順 | ### 前後が決まらない時の並び順 |
| | ### 設計意図との合成 | ### 設計意図をどこに置くか |
| | ## 未決outcome section | ## 追加を検討中のsection |
| `catalog.md` | # 完成後の姿section catalog | # 完成後の姿のsection一覧 |
| | ## 選択gate | ## sectionを選ぶ時の決まり |
| | ## 非code中心steeringの必須mapping | ## codeが中心でない作業で必ず選ぶsection |
| | ## `documentation`と`research findings`の分岐gate | ## `documentation.md`と`research-findings.md`のどちらを選ぶか |
| | \| outcome \| 読むsection \| 主な移行元 \| 選択する問い \| | \| 完成後に変わるもの \| 読むsection \| 主な移行元 \| 選ぶかを決める問い \| |

**記載する原則と例:**

- 見分ける問い: このpluginを知らない開発者が、task-designのテンプレートや、それを使って書かれたdesign.mdでこの表現を見たとき、普段使っている意味のまま読んで、書き手の意図どおりに受け取れるか。受け取れないなら言い換え、受け取れるなら残す。英語か日本語かは問わない。
  - 今回の具体例（耳馴染みがない表現）: precedence、tie-break、closed-world、baseline、ledger、handoff、意味正本、理解依存、全量保存宣言、明示差分、形式知化、通底
  - 今回の具体例（聞き慣れているが、ここで特別な意味を載せている表現）: owner（その内容に責任を持つ担い手）、contract（呼び出し方と、結果の保証）、gate（先へ進む前の判定）、「所有する」（そのsectionに書く）、正本
  - 意図に反する薄い記述: 英語を日本語へ置き換えるだけにする。「所有する」「正本」のように日本語でも解釈が要る表現が残り、ownerを「オーナー」とカタカナにしても意味は伝わらない。
- 言い換えの仕方: 一語ずつ訳語を決めて置き換えず、箇所ごとに、その文で言いたいことを普段の言葉で書き直す。同じ語が箇所によって違う意味で使われているため、一語一訳では何を指すかが読み取れないまま残る。
  - 今回の具体例: 「owner境界: このsectionは…side effect保証を所有する」は「このsectionに書くこと・書かないこと: …成功・失敗のそれぞれで何が起きるか（保存、通知等）の保証を書く」とする。「主ownerとなるsectionへ書き」は「その内容を主に扱うsectionへ書き」とする。同じownerが、前者では「どのsectionに書くか」、後者では「主に扱うsection」へ書き直される。
  - 揃えるもの: 一つのsectionの中で同じものを繰り返し指す語は、そのsectionの中で一つの語に揃える（例: `workflow.md`の中で判断・更新の担い手を指す語）。全fileの記入guideに繰り返し出る小見出しは、file間で同じ言い換えに揃える。
  - 意図に反する薄い記述: ownerを一律に「担当」へ置き換える。「担当境界」は何の境界かを依然として読み取れない。
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
