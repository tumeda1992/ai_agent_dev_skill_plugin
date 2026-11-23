# 内部検討記録: 論点1 — 言い換えの対象にする表現を、何で見分けるか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点1

## 開始context

- 問題: issue #5「ルー語を改善する」。`task-design/templates/outcome-sections/`の書き方が分かりづらい。issueは例としてowner、callerのcontract（見出しに使われたくない、contractも分かりづらい）を挙げる。
- 決める範囲: どの表現を言い換えの対象にし、どれを残すかを見分ける基準。どのfileを直すか（範囲）、各語を何へ言い換えるか（用語の対応）、再発防止をどこへ置くかは、この論点では決めない。
- 開始時の既決条件: file名（`caller-contracts.md`等）は変えない（issue本文）。
- 開始時の不足: assistantは初稿で対象を「英語の概念語」と置いたが、利用者から次の訂正を受けた。

  > 対象は見出しだけじゃない。task-designで使われるときに、解釈が必要な普段耳馴染みのない表現が対象

<a id="iteration-0"></a>

## イテレーション0: 利用者の基準を、当てはめられる形にする

入口は上の訂正。初稿の「英語の概念語」「見出しに使わない」という置き方は、ルー語を英語の混入と読んだassistantの推論であり、利用者の言葉ではなかった。

<a id="iteration-0-record-1"></a>

### 調査: 今のoutcome-sectionsに、解釈が要る表現がどの形で出ているか

#### 問い・探索範囲・方法

基準を「英語かどうか」から「解釈が要るか」へ移すと、対象に入る表現の形が変わる。英語以外にも解釈の要る表現があるか、聞き慣れた語でも解釈が要るものがあるかを知れば、基準の書き方が決まる。

- 範囲: `plugins/tumeda-dev/skills/task-design/templates/outcome-sections/`の14 file全体。
- 方法1: backtickの外にある英単語を全て抜き出し、出現数を数える（`grep -oE`で出現単位。行単位ではない）。
- 方法2: 日本語の候補語を個別に`grep -o`で数え、使われ方を数箇所読む。日本語は自動では抜き出せないため、候補はassistantが本文を読んで拾ったものに限られる。

#### 英語の語

出現数の多い順に、section 94、owner 70、contract 60、caller 31、ledger 29、outcome 27、state 24、gate 24、scope 20、evidence 20、baseline 16、finding 15、trigger 11、caller-facing 11、handoff 9、snapshot 8、signal 7、pain 7、consumer 4、precedence 2、tie-break 2、closed-world 2。file、directory、code、test、API、Markdown、template等の、普段の開発の会話でそのまま使う語も多数出る。

#### 日本語の語

- 普段の会話で聞かない造語: 意味正本 1、理解依存 3、同順位 2、通底 2、全量保存宣言 3、明示差分 7、差分宣言 3、形式知化 6、意味単位 2、合算 3、腐敗 3。
- 普段の語だが、ここで特別な意味を載せている語: 所有 31（例: 「各section fileは固有の書き方だけを所有し」。「そのsectionに書く」の意味）、正本 21、境界 41、能力境界 8、観測可能 3。

#### 解釈・残る不足・次action

- 解釈の要る表現は英語に限らない。日本語の造語にも、聞き慣れた日本語に特別な意味を載せたものにもある。
- 英語でも、普段の開発の会話で同じ意味で使う語（file、test、API等）は解釈が要らない。
- 「聞き慣れているか」だけでは足りない。ownerや「所有」は聞き慣れた語だが、ここでは「その内容を書く場所」「責任を持つ担い手」という特別な意味で使われ、読者は訳し直す必要がある。issueがownerを挙げているのはこの型である。
- 基準は、耳馴染みがない語と、聞き慣れていても特別な意味を載せた語の二つの型を拾える形にする。
- 未確認: 日本語の候補は網羅ではない。網羅は用語の対応を決める段階で、全文を読んで行う。
