# 内部検討記録: 論点4 — outcome-sectionsの見出し・記入欄のlabel・記入guideの小見出しを何へ言い換えるか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点4

## 開始context

- 問題: 論点1〜3で、見分ける問い、範囲（利用者の目に出る表現と、その入口になる記入guide）、言い換えの仕方（箇所ごとの書き直し。sectionの中とfile間の小見出しだけは揃える）が決まった。outcome-sectionsのうち、design.mdへそのまま写る見出しと記入欄のlabel、およびfile間で揃える記入guideの小見出しを先に決める。本文は、これらの名前が決まってから書き直す。
- 決める範囲: outcome-sections 14 fileの見出し（h1〜h5）、記入欄の太字label、表の列名、記入欄のplaceholderに含まれる語、記入guideに繰り返し出る小見出し。
- 決めない範囲: 本文と記入guideの文の書き直し、design.md・tasklist.md・roadmap.mdのテンプレートのlabel。
- 開始時の既決条件: 論点1〜3の決定。file名は変えない。issueは`caller-contracts.md`の見出しの候補として「xxの呼ばれ方」「xxの呼び元からの呼び出し方」を挙げている。

<a id="iteration-0"></a>

## イテレーション0: 名前を全て抜き出し、見分ける問いを当てる

<a id="iteration-0-record-1"></a>

### 調査: outcome-sectionsの名前の全量

#### 問い・探索範囲・方法

design.mdへ写る名前と、file間で揃える小見出しを漏れなく抜き出す。

- 範囲: `plugins/tumeda-dev/skills/task-design/templates/outcome-sections/`の14 file
- 方法: `grep -n "^#\|^\*\*[^*]*:\*\*\|^[^ <|-][^:：]*:$"`で見出し・太字label・行末が`:`の小見出しを、`grep -n "^| [^-{]"`で表の列名を抜き出した。placeholderは各fileの記入欄を読んで拾った。

#### 見つかった事実

- 各sectionのh3見出しは12（READMEとcatalogを除く）。
- 記入guideに繰り返し出る小見出しは、なぜ必要か（11 file）、NG（11）、判断基準（11）、記述のMUST（7）、owner境界（7）、移行元（4）、selection gate系（6。「selection gate」「選択gate」「成功・失敗contractのselection gate」「更新・削除caseと不変条件のselection gate」「失敗・操作中断・境界caseの選択gate」「状態選択のgate」と表記が割れている）。
- `skill-policy.md`だけ「このsectionが所有するもの:」と「owner境界:」の二つを持つ。前者は書くこと、後者は他sectionへ送るものを並べている。
- 表の列名とplaceholderに、owner、single source of truth、snapshot、trigger、signal、evidence、finding、actor、caller-facing、contract、side effect、baseline、ledger、scope等が出る。

#### 解釈・残る不足・次action

- 「なぜ必要か」「NG」「判断基準」「記述のMUST」「具体的な記述例」「記入例」「移行元」は、普段の意味のまま読める（MUSTはtask-design全体で決まった形式）。残す。
- 「owner境界」は「このsectionに書くこと・書かないこと」へ揃える（論点3の決定の例どおり）。`skill-policy.md`の二つの小見出しは、「このsectionに書くこと」「このsectionに書かないこと」へ分けて揃える。
- selection gate系は表記が割れているため、「〜を書く条件」「このsectionを選ぶ条件」の形へ揃える。
- ledger、baselineは`function_migration_policy.md`で定義された語である。design.mdの読み手には言い換えた語を見せ、記入guideで定義元の語との対応を一度だけ示せば、agentは定義元へ辿れる。
