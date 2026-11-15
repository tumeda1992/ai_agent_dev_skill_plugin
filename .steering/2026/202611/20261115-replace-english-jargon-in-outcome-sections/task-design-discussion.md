# 議論記録

## 論点1: 言い換えの対象にする表現を、何で見分けるか

**ステータス:** 決定

**種別:** 認識齟齬

### イテレーション0（論点1）: 利用者の基準を、当てはめられる形にする

#### 提案0（論点1）

##### 見分ける問い

**このpluginを知らない開発者が、task-designのテンプレートや、それを使って書かれたdesign.mdでこの表現を見たとき、普段使っている意味のまま読んで、書き手の意図どおりに受け取れるか。**

受け取れないなら言い換える。受け取れるなら残す。英語か日本語かは問わない。

##### 対象になる二つの型

| 型 | 例（今のoutcome-sectionsから） |
| --- | --- |
| 耳馴染みがない。普段の会話で聞かない | 英語: precedence、tie-break、closed-world、baseline、ledger、handoff。日本語: 意味正本、理解依存、全量保存宣言、明示差分、形式知化、通底 |
| 聞き慣れているが、ここで特別な意味を載せている | owner（その内容に責任を持つ担い手）、contract（呼び出し方と、結果の保証）、gate（先へ進む前の判定）、「所有する」（そのsectionに書く）、正本 |

二つ目の型も対象に入れる。ownerは聞き慣れた語だが、issueが挙げたのはこの型だからである。

##### 対象にしない表現

- 識別子、path、file名、code例（`caller-contracts.md`、`importDocument(url)`等）
- task-design全体で決まった形式（MUST／SHOULD／MAY、TBD、TL;DR、`KEEP | MOVE | ...`等）
- 普段の開発の会話で、普段の意味のまま使っている語（file、directory、code、test、API、class、function、module、error、data、Markdown、template、commit、branch等）

##### 当てはめる場所

見出しだけでなく、本文、記入guide（HTML comment内）、記入欄のlabelの全てに当てはめる。記入guideはdesign.mdへ写らないが、design.mdを書くagentが読み、その語をdesign.mdへ持ち込むため。

##### この論点で決めないこと

- どのfileを直すか（outcome-sectionsだけか、参照元まで含むか）
- 各表現を何へ言い換えるか（用語の対応）
- 再発を防ぐ基準をどこへ置くか

#### 検討記録（論点1・イテレーション0）

初稿では対象を「英語の概念語」と置いた。これはissueのタイトル「ルー語」を英語の混入と読んだassistantの推論で、利用者の言葉ではなかった。利用者から次の訂正を受けた。

> 対象は見出しだけじゃない。task-designで使われるときに、解釈が必要な普段耳馴染みのない表現が対象

この訂正を受けて、outcome-sectionsの14 fileを調べた。解釈の要る表現は英語に限られない。

- 日本語の造語がある。意味正本、理解依存、全量保存宣言（3回）、明示差分（7回）、形式知化（6回）等。
- 聞き慣れた日本語に特別な意味を載せたものがある。「所有する」は31回出て、「そのsectionに書く」の意味で使われている。
- 逆に英語でも、file、test、API等は普段の開発の会話と同じ意味で使われ、解釈は要らない。

そのため、見分ける問いは言語ではなく、「普段の意味のまま読んで正しく受け取れるか」に置いた。

「耳馴染みがあるか」だけを問いにすると、ownerや「所有する」が残ってしまう。これらは聞き慣れているが、読者は訳し直す必要がある。issueがownerを挙げているのはこの型なので、二つ目の型を明示した。

限界: 日本語の例はassistantが本文を読んで拾ったもので、網羅ではない。網羅は用語の対応を決める段階で、全文を読んで行う。

[内部検討記録: 論点1・イテレーション0](internal-records/task-design-discussion.md.topic-1.md#iteration-0)

#### 提案0へのフィードバック（論点1）

**結果:** 合意

> ok

### 決定（論点1）

言い換えの対象は、次の問いで見分ける。

**このpluginを知らない開発者が、task-designのテンプレートや、それを使って書かれたdesign.mdでこの表現を見たとき、普段使っている意味のまま読んで、書き手の意図どおりに受け取れるか。** 受け取れないなら言い換え、受け取れるなら残す。英語か日本語かは問わない。

対象になるのは次の二つの型である。

- 耳馴染みがない表現。英語（precedence、tie-break、closed-world、baseline、ledger、handoff等）も、日本語の造語（意味正本、理解依存、全量保存宣言、明示差分、形式知化、通底等）も含む。
- 聞き慣れているが、ここで特別な意味を載せている表現（owner、contract、gate、「所有する」、正本等）。issueが挙げたownerはこの型であり、聞き慣れているかだけを問うと残ってしまうため、明示して対象に含める。

対象にしないのは、識別子・path・file名・code例、task-design全体で決まった形式（MUST／SHOULD／MAY、TBD、TL;DR、`KEEP | MOVE | ...`等）、普段の開発の会話で普段の意味のまま使う語（file、directory、code、test、API、class、function、module、error、data、Markdown、template、commit、branch等）である。

当てはめる場所は、見出し、本文、記入guide（HTML comment内）、記入欄のlabelの全てである。記入guideはdesign.mdへ写らないが、design.mdを書くagentがその語をdesign.mdへ持ち込むため、対象から外さない。

直すfileの範囲、各表現の言い換え先、再発を防ぐ基準の置き場所は別の論点で決める。

## 論点2: 言い換えをどのfileまで行うか

**ステータス:** 応答待ち

**種別:** TBDヒアリング

### イテレーション0（論点2）: 範囲の候補と、それぞれの広がりを比べる

#### 提案0（論点2）

##### 候補

| 候補 | 今回直すfile | 別の作業へ切り出すもの |
| --- | --- | --- |
| a（推奨） | `task-design/templates/outcome-sections/`の14 file全体 | `templates/design.md`・`tasklist.md`・`roadmap.md`、`task-design/SKILL.md`・`tasklist-design.md`・`roadmap-design.md`、他skillの同じ型の表現 |
| b | aに加え、`templates/design.md`・`tasklist.md`・`roadmap.md`のうち、他のfileが名前で読まないlabel・記入guide・placeholder | 他のfileが名前で読むlabel、SKILL.md等、他skill |
| c | bに加え、他のfileが名前で読むlabelと、それを読むskill・script・validator | plugin全体の残り |

##### aを推奨する理由

- outcome-sectionsは、他のfileと名前で結び付いている箇所がほぼ無い。単独で言い換え、単独でrevertできる。
- 他のテンプレートで言い換え対象になる表現の多くは、steering・tasklist-executor・script・validatorが名前で読むlabelである（分類保留、execution plan対象、上位roadmap制約、運用field、構造field、strictly narrower等）。変えるとskill間の取り決めが変わり、他skill・script・testを同時に直すことになる。
- bはlabelを残して周りの文だけ言い換えるため、同じテンプレートの中に言い換え前と後の語が混ざる。
- 切り出す側はskill間の取り決めとしてまとまっており、一つの作業として扱える。`work_scope.md`の二段目でいう「大きすぎる」「単体で分けた方がrevertしやすい」に当たる。

##### aを採った場合の扱い

- outcome-sections内でroadmapのlabelを指す「構造field」（`workflow.md`、1回）は、labelを持つ側に合わせて今回は残し、切り出した作業で一緒に変える。
- 切り出し先として、GitHubに新しいissueを作る。issueの作成は外部への書き込みなので、作成前に文面を確認してもらう。作るまでは、design.mdに「切り出し済み」と書かない。
- `contract-preservation.md`が使うledger、baseline等は`function_migration_policy.md`が定義する語である。outcome-sections側だけ言い換えたときに定義元とどう対応させるかは、言い換え先を決める論点で扱う。

#### 検討記録（論点2・イテレーション0）

論点1で決めた見分ける問いは、読む場面を「task-designのテンプレートや、それを使って書かれたdesign.md」としている。issueが名指ししたのはoutcome-sectionsだが、同じ型の表現はtask-designの他のテンプレートやSKILL.mdにも出るため、範囲を決める必要がある。

論点1の例に挙げた表現で出現数を数えた（網羅ではなく目安）。outcome-sectionsで378、`task-design/SKILL.md`で53、`templates/design.md`で7、plugin全体のMarkdown 71 fileで940である。`templates/roadmap.md`は0件だが、「運用field」「構造field」「親DoD coverage」「Dependency DAG」のような同じ型の別表現を持つ。

範囲を分ける決め手は、他のfileと名前で結び付いているかである。

- outcome-sections: 他から名前で読まれているのは、validatorが検査する`documentation.md`の三つの文だけで、そこに言い換え対象の表現は無い。
- `templates/design.md`: 「上位roadmap制約」の見出しは、`extract-handoff-input.mjs`が見出し名で本文を抜き出している。「分類保留」「execution plan対象」は、steeringがdesign.mdの付録を検証する時に名前で読む。
- `templates/roadmap.md`: 「運用field」「構造field」は、steering、tasklist-executor、validatorが名前で読む。

そのため、outcome-sectionsは単独で直せるが、他のテンプレートはskill間の取り決めと一緒でないと直せない。bのようにlabelだけ残して周りを直すと、テンプレート内で語が混ざる。

限界: 出現数は論点1の例だけを数えたもので、各fileの全量ではない。全量は言い換え先を決める段階で全文を読んで洗い出す。

[内部検討記録: 論点2・イテレーション0](internal-records/task-design-discussion.md.topic-2.md#iteration-0)

#### 提案0へのフィードバック（論点2）
