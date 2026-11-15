# 内部検討記録: 論点11 — テンプレートの全fileで、ownerをそれぞれ何へ書き直すか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点11

## 開始context

- 問題: 論点10で見本2 fileの書き方を基準にすると決めた。利用者は、ownerだけはテンプレートの全fileで全箇所を洗い出し、文・見出しごとの書き直しを一挙に示すよう求めた。
- 決める範囲: `task-design/templates/`配下（outcome-sections 14 file、design.md、tasklist.md、roadmap.md）の、ownerを含む全ての箇所の書き直し。同じ文の他の表現は、論点10の基準で後から書き直すため、ここではownerの部分だけを変える。
- 開始時の既決条件: 論点3（箇所ごとに言いたいことを書く。sectionの中で同じものを指す語は揃える）、論点4（見出し・label）。

<a id="iteration-0"></a>

## イテレーション0: 全箇所を抜き出し、意味ごとに書き直す

<a id="iteration-0-record-1"></a>

### 調査: ownerの全出現と、それぞれの意味

#### 問い・探索範囲・方法

- 範囲: `plugins/tumeda-dev/skills/task-design/templates/`配下の全file。
- 方法: `grep -rnoi "owner" .`で出現数を数え（63）、`grep -rni "owner" .`で全行を出して前後を読んだ。見本2 fileには既に出現が無い。

#### 見つかった事実

出現は57行・63箇所。意味は次の七つに分かれる。

| 意味 | 書き直し | 行数 |
| --- | --- | --- |
| どのsectionに書くか（sectionの書き分け） | 「他sectionとの書き分け」「このsectionに書くこと・書かないこと」「それを扱うsection」 | 15 |
| workflowで判断・更新を受け持つ担い手（skill、人） | 「担当」。`workflow.md`の中は「担当」に揃える | 18 |
| codeの中でその責務を持つmodule・class・component | 「class」「module」「component」と具体的に書く | 8 |
| 文書を直す人 | 「直す人」 | 4 |
| 記述やfunctionの置き場所（owner変更、owner移動） | 「担当や置き場所」 | 4 |
| secretや状態を持つ管理元 | 「管理元」「状態を持つcomponent」 | 3 |
| 議論の記録先（discussion owner） | 「議論の記録先」 | 1 |

一つ例外がある。`workflow.md`6行目の「roadmap-design.md「Field ownership」」は、`roadmap-design.md`に実在する見出し名を引いている。見出し名は識別子として残す。

`README.md`135行の「discussion owner: `task-design-discussion.md`の論点25」は、どのsteeringの記録かが書かれていない。`.steering`配下で「## 論点25」を検索すると二つの記録に当たり、内容が一致するのは`.steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/task-design-discussion.md`の論点25（domainの概念化・語彙・境界を拘束する方針sectionのscopeと名前を決める）である。書き直しで記録先を具体的に書く。

#### 解釈・残る不足・次action

- 七つの意味ごとに、論点3の書き直し方で書き直す。同じ文の他の表現（state、gate、handoff等）は、ここでは変えず、論点10の基準で後から書き直す。
- `tasklist.md`の「workflow owner」は、feedbackを直接受け取ったskillを指す。`validate-plugin.mjs`は同じ箇条の「特定の`steering` callerへ固定しない」を検査しているが、その部分は変えないため影響しない。
