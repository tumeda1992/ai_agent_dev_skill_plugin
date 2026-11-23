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

**ステータス:** 決定

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

**結果:** 修正要求（cを希望。範囲を「利用者の目に出るか」で引く）

> cを希望するけど、結果aを選んだときと同じ結果になると思う。skillの内部的で表出しない話は内輪で伝わればいいから

範囲をfile単位ではなく、利用者の目に出るかで引くことになった。skillの内部だけでやり取りされる語は言い換えない。利用者は、この引き方なら結果はaと同じになると見ている。この見立ては次の回で確かめる。

### イテレーション1（論点2）: 「利用者の目に出るか」で範囲を引き直す

#### 提案1（論点2）

##### 範囲の引き方

task-design全体（outcome-sections、design.md・tasklist.md・roadmap.mdのテンプレート、SKILL.md等）を対象にし、その中で**利用者の目に出る表現**だけを言い換える。

| 表現の置き場所 | 利用者の目に出るか | 扱い |
| --- | --- | --- |
| outcome-sectionsの見出し・記入欄のlabel | 出る（design.mdへそのまま写る） | 言い換える |
| design.md・tasklist.md・roadmap.mdのテンプレートの見出し・表のlabel | 出る（成果物へそのまま写る） | 言い換える |
| テンプレートの記入guide（HTML comment） | 直接は出ないが、agentがその語をdesign.mdへ持ち込む | 言い換える（論点1の決定どおり） |
| SKILL.md・tasklist-design.md・roadmap-design.md等、agentへの指示の文 | 出ない | 言い換えない |
| 上の言い換えで変わるlabelを、名前で読んでいるskill・script・validator | 出ない | labelの文字列だけ追随させる。周りの文は言い換えない |

##### 結果はaと同じにならない

design.mdとroadmap.mdのテンプレートには、成果物へそのまま出て、論点1の型に当たる見出し・labelがある。

- `design.md`: 上位roadmap制約、（付録）変更の実行区分、task-design内の対象成果物反映待ち、execution plan対象、分類保留、表の「掲載理由」「参照するdesign section」
- `roadmap.md`: 構造field、運用field、親DoD coverage、Dependency DAG

各語を本当に言い換えるか、何へ言い換えるかは、次の論点（言い換え先）で一つずつ判定する。ここで決めるのは、これらが判定の候補に入ることである。`tasklist.md`のPhase、DoD（完了条件）、Tasksは、普段の意味のまま読めるため候補から外れる見込みである。

これらのlabelの多くは、steering・tasklist-executor・script・validatorが名前で読んでいる。言い換えたlabelは、名前で読む側の文字列を同時に差し替える。同じcommitに含め、片方だけが変わった状態を作らない。

##### 範囲に入れないもの

- agentがchatで使う語。出どころはSKILL.md等の内部の文で、範囲に入れると内部の文を全部言い換えることになり、「内輪で伝わればいい」と食い違う。再発防止の論点で、利用者へ向けて書く時の基準として扱う。
- task-design以外のskill（facilitate-discussion等）が作る成果物。今回のissueはtask-designの範囲であり、他skillは再発防止の基準ができた後に、その基準で扱う。

##### 別issueは作らない

提案0で別issueへ切り出すとしたもののうち、利用者の目に出るものは今回の範囲に入り、出ないものは言い換えの対象から外れる。切り出すものは残らない。

#### 検討記録（論点2・イテレーション1）

提案0では、file単位で範囲を引き、他のfileが名前で読むlabelを含むかで候補を分けた。利用者の応答で、引き方が「利用者の目に出るか」に変わった。skillの内部だけでやり取りされる語は、内輪で通じればよい。

この引き方で、利用者は結果がaと同じになると見ていたため、outcome-sections以外のテンプレートの見出しとlabelを調べた。design.mdとroadmap.mdには、成果物へそのまま写り、論点1の型に当たる語がある。

- 「execution plan対象」「対象成果物反映待ち」は、task-designの内部の区分を知らないと、何の対象か、何の反映かが分からない。
- 「構造field」「運用field」「親DoD coverage」「Dependency DAG」は普段の会話で聞かない。

そのため結果はaと同じにならず、これらは候補に入る。

これらのlabelは、他skill・script・validatorも名前で読んでいる。提案0ではこれを切り出す理由にしたが、追随は語の差し替えだけで、読む側の文を言い換えるわけではない。同じcommitで両方を変えれば、取り決めは崩れない。

記入guide（HTML comment）は成果物へは出ない。それでも論点1で対象に入れたのは、agentがguideの語をdesign.mdへ持ち込むからである。「内輪で伝わればいい」と食い違うように見えるが、持ち込みの経路がある以上、guideは表出の入口として扱う。なお、この作業の初稿のdesign.mdでは、assistantはoutcome sectionの見出し「documentation以外のfile deliverable」をそのまま写していた。見出しがそのまま成果物へ出ることの実例である。

限界: 候補に入るかの判定は見出しと表のlabelを読んだ範囲である。テンプレート本文の全量は、言い換え先の論点で全文を読んで洗い出す。

[内部検討記録: 論点2・イテレーション1](internal-records/task-design-discussion.md.topic-2.md#iteration-1)

#### 提案1へのフィードバック（論点2）

**結果:** 合意

> ok

### 決定（論点2）

範囲はfile単位ではなく、**利用者の目に出るか**で引く。task-design全体（outcome-sections、design.md・tasklist.md・roadmap.mdのテンプレート、SKILL.md等）を見渡し、利用者の目に出る表現だけを、論点1の見分ける問いで判定して言い換える。skillの内部だけでやり取りされる語は、内輪で通じればよいため言い換えない。

| 表現の置き場所 | 扱い |
| --- | --- |
| outcome-sectionsの見出し・本文・記入欄のlabel | 言い換えの判定にかける |
| design.md・tasklist.md・roadmap.mdのテンプレートの見出し・表のlabel | 言い換えの判定にかける |
| テンプレートの記入guide（HTML comment） | 言い換えの判定にかける。成果物へは直接出ないが、agentがその語を成果物へ持ち込むため、表出の入口として扱う |
| SKILL.md・tasklist-design.md・roadmap-design.md等、agentへの指示の文 | 言い換えない |
| 言い換えたlabelを名前で読むskill・script・validator | labelの文字列だけを追随させ、同じcommitに含める。周りの文は言い換えない |

design.mdとroadmap.mdのテンプレートには、成果物へそのまま出て論点1の型に当たる見出し・labelがある（上位roadmap制約、execution plan対象、task-design内の対象成果物反映待ち、分類保留、構造field、運用field、親DoD coverage、Dependency DAG等）。そのため、outcome-sectionsだけを直す提案0のaとは結果が異なる。各語を実際に言い換えるか、何へ言い換えるかは、言い換え先の論点で一つずつ判定する。

範囲に入れないものは次の二つである。agentがchatで使う語は、出どころがSKILL.md等の内部の文であり、範囲に入れると内部の文を全部言い換えることになるため、再発防止の論点で利用者へ向けて書く時の基準として扱う。task-design以外のskillが作る成果物は、今回のissueの範囲外であり、再発防止の基準ができた後にその基準で扱う。

別issueは作らない。利用者の目に出るものは今回の範囲に入り、出ないものは言い換えの対象から外れるため、切り出すものが残らない。

## 論点3: 言い換えを、一語一訳の対応表で行うか、箇所ごとの書き直しで行うか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点3）: 同じ語が箇所によって違う意味で使われている

#### 提案0（論点3）

##### 言い換えの仕方

一語ずつ訳語を決めて置き換える対応表は作らない。**箇所ごとに、その文で言いたいことを普段の言葉で書き直す。**

ただし、次の二つは揃える。

- 一つのsectionの中で同じものを繰り返し指す語は、そのsectionの中で一つの語に揃える。例: `workflow.md`の中で判断・更新の担い手を指す語、`code-structure.md`の中で責務を持つmoduleを指す語。
- 全fileの記入guideに繰り返し出る小見出し（「owner境界:」等）は、file間で同じ言い換えに揃える。

##### 書き直しの例

| 箇所 | 今 | 書き直した後 |
| --- | --- | --- |
| `caller-contracts.md`の記入guide | owner境界: このsectionはcaller-facingなidentifier、input、result、error type／status／payloadと、成功・失敗時のside effect保証を所有する。 | このsectionに書くこと・書かないこと: このsectionには、呼び出し元から見える名前、入力、結果、失敗時の返し方（error type、status、payload）と、成功・失敗のそれぞれで何が起きるか（保存、通知等）の保証を書く。 |
| `catalog.md`の選び方 | 同じ内容を複数sectionへ複製しない。主ownerとなるsectionへ書き、他sectionから必要な関係だけ参照する。 | 同じ内容を複数sectionへ複製しない。その内容を主に扱うsectionへ書き、他sectionからは必要な関係だけを参照する。 |
| `code-structure.md`の記入欄 | {Caller-facing entry} -> {Owner A} -> {Owner B} -> {Result owner} | {呼び出し元が使う入口} -> {担当module A} -> {担当module B} -> {結果を返すmodule} |
| `documentation.md`の記入guide | source of truth、更新owner、更新triggerがなく腐るsnapshotを防ぐため。 | どれを正として直すか、誰がいつ直すかが決まっておらず、書いた時点では正しかった内容が古くなるのを防ぐため。 |
| `README.md`の配置規則 | owner境界だけでなく、既知のprecedenceとtie-break上の位置もこのREADMEへ追加する。 | 他sectionとの書き分けだけでなく、他sectionとの前後関係と、前後が決まらない時の並び順での位置もこのREADMEへ追加する。 |

例のownerは、同じ語が「どのsectionに書くか」「責務を持つmodule」「文書を直す人」と、箇所ごとに違う意味へ書き直されている。

##### この論点で決めないこと

- 各fileの全箇所の書き直し（次の論点で、file単位に完成形を示す）
- `caller-contracts.md`の見出し（issueが名指ししているため、次の論点で個別に示す）

#### 検討記録（論点3・イテレーション0）

各表現の言い換え先を決める前に、言い換えの仕方を決める。一語ずつ訳語を決める対応表にするか、箇所ごとに書き直すかで、次の論点で示すものが「対応表」になるか「file単位の完成形」になるかが変わる。

一語一訳が成り立つのは、同じ語がどこでも同じ意味で使われている時だけである。出現の多いownerとcontractの全出現行を読んで、意味を分類した。

- ownerは少なくとも六つの意味で使われている。どのsectionに書くか、codeの責務を持つmodule、workflowの担い手、文書を直す人、functionや記述が置かれている場所、議論を記録している場所である。
- contractは二つの意味で使われている。呼び出し元が依存する名前・入力・結果・保証（`caller-contracts.md`）と、移行前に存在した挙動と判断能力を生む記述の単位（`contract-preservation.md`。公開APIに限らず、順序、停止、例外、失敗例、判断質問まで含む）である。

ownerに「担当」を一律に当てると、「owner境界」は「担当境界」になるだけで、何の境界かは読み取れない。論点1の問いを満たすには、その箇所で言いたいこと（このsectionに書くこと・書かないこと）を書く必要がある。

一方、一つのsectionの中で同じものを繰り返し指す語まで箇所ごとに変えると、読者が別物と読む。全fileに繰り返し出る記入guideの小見出しも、file間で揃えないと同じ役割の部品だと分からなくなる。この二つだけは揃える。

代償: 対応表が無いため、後から書く人が同じ語を別の言い方で書く余地が残る。これは再発防止の論点で、書く時の基準として扱う。

[内部検討記録: 論点3・イテレーション0](internal-records/task-design-discussion.md.topic-3.md#iteration-0)

#### 提案0へのフィードバック（論点3）

**結果:** 合意

> ok

### 決定（論点3）

一語ずつ訳語を決めて置き換える対応表は作らない。箇所ごとに、その文で言いたいことを普段の言葉で書き直す。同じ語が箇所によって違う意味で使われているためである（ownerは、どのsectionに書くか、codeの責務を持つmodule、workflowの担い手、文書を直す人、記述が置かれている場所、議論の記録先の少なくとも六つ。contractは、呼び出し元が依存する名前・入力・結果・保証と、移行前に存在した挙動と判断能力を生む記述の単位の二つ）。一語一訳では「owner境界」が「担当境界」になるだけで、何の境界かは読み取れない。

ただし次の二つは揃える。

- 一つのsectionの中で同じものを繰り返し指す語は、そのsectionの中で一つの語に揃える。
- 全fileの記入guideに繰り返し出る小見出しは、file間で同じ言い換えに揃える。

代償として、対応表が無いため、後から書く人が同じものを別の言い方で書く余地が残る。これは再発防止の論点で、書く時の基準として扱う。

## 論点4: outcome-sectionsの見出し・記入欄のlabel・記入guideの小見出しを何へ言い換えるか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点4）: 名前を全て抜き出し、見分ける問いを当てる

#### 提案0（論点4）

本文の書き直しより先に、design.mdへそのまま写る名前と、file間で揃える記入guideの小見出しを決める。本文はこの名前に合わせて書き直す。表に無い名前（「なぜ必要か」「NG」「判断基準」「記述のMUST」「具体的な記述例」「記入例」「移行元」「状態と遷移」等）は普段の意味のまま読めるため、そのまま残す。

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

#### 検討記録（論点4・イテレーション0）

論点3で、言い換えは箇所ごとの書き直しとし、sectionの中で繰り返し指す語とfile間で繰り返す小見出しだけを揃えると決めた。本文を書き直す前に、design.mdへそのまま写る名前と、file間で揃える小見出しを決める。本文はこれらの名前を使って書くため、先に決めないと書き直しが二度手間になる。

14 fileから、見出し、太字label、行末が「:」の小見出し、表の列名を抜き出し、placeholderは記入欄を読んで拾った。

- 記入guideの小見出しのうち、「なぜ必要か」「NG」「判断基準」「記述のMUST」は11 file前後に出るが、普段の意味のまま読めるため残す。
- 「owner境界」は7 fileに出る。論点3の例どおり「このsectionに書くこと・書かないこと」へ揃える。
- selection gate系は六通りに表記が割れている。中身はどれも「どの場合に書くか・選ぶか」なので、「〜を書く条件」「このsectionを選ぶ条件」の形へ揃える。
- `skill-policy.md`だけ「このsectionが所有するもの」と「owner境界」の二つを持ち、前者は書くこと、後者は他sectionへ送るものを並べている。二つに分けたまま揃える。

`caller-contracts.md`の見出しは、issueの候補「xxの呼び元からの呼び出し方」を基にした。このsectionは呼び出し方（名前、入力、結果）だけでなく、成功・失敗時に何が起きるか（保存、通知、dataが変わらない等）の保証も扱うため、「保証」を足した。「xxの呼ばれ方」の形はxxに対象名を入れる形だが、一つのsectionで複数のfunctionやendpointを扱うことがあり、見出しに入りきらない。

ledgerとbaselineは`function_migration_policy.md`が定義する語である。design.mdの読み手は定義元を読まないため、言い換えた語（移行の対応表、移行前の基準）を見せる。agentは定義元の手順に従って対応表を作るため、記入guideで定義元の語との対応を一度だけ示す。

限界: 残すと判断した見出し（「codeの責務配置と依存構造」「runtime・設定・環境構築」等）は、開発の会話で普段の意味のまま使う語だと判断した。違和感があれば個別に指摘してほしい。

[内部検討記録: 論点4・イテレーション0](internal-records/task-design-discussion.md.topic-4.md#iteration-0)

#### 提案0へのフィードバック（論点4）

**結果:** 合意

> 最高

### 決定（論点4）

outcome-sectionsの見出し、記入欄のlabel、表の列名、placeholder、記入guideの小見出しを、[提案0（論点4）](#提案0論点4)の表のとおり言い換える。表に無い名前（「なぜ必要か」「NG」「判断基準」「記述のMUST」「具体的な記述例」「記入例」「移行元」等、および見出し「codeの責務配置と依存構造」「データモデル」「操作フロー」「runtime・設定・環境構築」「画面イメージと配置意図」「skillの役割と方針」）は、普段の意味のまま読めるため残す。

主な決定は次のとおりである。

- `caller-contracts.md`の見出しは「呼び出し元から見た呼び出し方と保証」とする。issueの候補「xxの呼び元からの呼び出し方」に、このsectionが併せて持つ成功・失敗時の保証を足した。「xxの呼ばれ方」の形は、一つのsectionで複数のfunctionやendpointを扱う時に見出しへ入りきらないため採らない。
- `workflow.md`では、判断・更新の担い手を指す語を「担当」に揃える。
- 「owner境界:」は全fileで「このsectionに書くこと・書かないこと:」へ揃える。`skill-policy.md`の二つの小見出しは「このsectionに書くこと:」「このsectionに書かないこと:」へ分ける。
- selection gate系の小見出しは「〜を書く条件:」「このsectionを選ぶ条件:」の形へ揃える。
- `contract-preservation.md`のbaseline、ledgerは「移行前の基準」「移行の対応表」とする。`function_migration_policy.md`が定義する語との対応は、記入guideで一度だけ示す。

## 論点5: design.md・roadmap.mdのテンプレートの見出し・labelをどう言い換えるか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点5）: labelの読まれ方を調べ、言い換え先を決める

#### 提案0（論点5）

##### 前提が一つ変わった

論点2では「言い換えたlabelを名前で読む側の文字列を追随させる」とした。調べると、いくつかのlabelは、steeringとscriptが**既に作られた成果物**（過去のdesign.md、進行中のroadmap.md）からも名前で読んでいる。名前を変えると、利用先repositoryにある古い成果物を読めなくなる。

- steeringは、前月のsummaryを作る時に前月の全design.mdを読み、付録の「分類保留」「task-design内の対象成果物反映待ち」「execution plan対象」の有無と`なし`で完了を判定する。
- `extract-handoff-input.mjs`は、既存のdesign.mdからh2見出しが「上位roadmap制約」と完全一致するsectionを抜き出す。
- steeringは、進行中のroadmap.mdの「運用field」を更新する。

##### 案

| 案 | 内容 |
| --- | --- |
| a（推奨） | 既存の成果物から名前で読まれるlabelは、決まった形式として名前を残す。意味が読み取れないものだけ、括弧で普段の言葉の説明を足す。名前で読まれないlabelは言い換え、指示側の文字列を追随させる |
| b | 全て言い換え、読む側（steering、script、validator）が新旧両方の名前を受け付けるようにする |

bは、読む側に新旧二つの名前を恒久的に持たせることになる。aは読む側を変えずに、読み手が意味を受け取れる。テンプレートには既に「分類保留（設計中のみ）」という括弧書きの前例がある。

##### aの場合の完成形

既存の成果物から名前で読まれるlabel:

| テンプレート | 今 | 後 |
| --- | --- | --- |
| `design.md` | ### task-design内で対象成果物へ適用済み | ### task-design内で対象成果物へ適用済み（設計中にtask-designが反映を終えた変更） |
| | ### task-design内の対象成果物反映待ち | ### task-design内の対象成果物反映待ち（設計中にtask-designが反映するが、他の判断を待っている変更） |
| | ### execution plan対象 | ### execution plan対象（tasklist・roadmapに載せて実行する変更） |
| `roadmap.md` | ## 構造field（task-designが設計・reviewする） | ## 構造field（各phaseの計画。task-designが設計・reviewする） |
| | ### 運用field（steeringだけが更新する） | ### 運用field（進み具合。steeringだけが更新する） |

そのまま残すもの: 「上位roadmap制約」（scriptが完全一致で照合するため括弧も足せないが、「上位のroadmapから受ける制約」と普段の意味のまま読める）、「分類保留（設計中のみ）」、表の「validation結果」「参照するdesign section」「掲載理由」（普段の意味のまま読める）。

括弧を足しても、steering・validatorは見出しにlabelの文字列が含まれるかで読んでいるため、今のまま照合できる。`validate-plugin.mjs`の`構造field（task-designが設計・reviewする）`と`運用field（steeringだけが更新する）`の完全一致の検査だけ、新しい見出しへ合わせる。

名前で読まれないlabel:

| テンプレート | 今 | 後 |
| --- | --- | --- |
| `roadmap.md` | ## 親DoD coverage | ## 親の完了条件と、それを満たすphase |
| | ## Dependency DAG | ## phase間の依存関係 |
| | {cycleを持たないstable phase identity間の依存を記載する。例: `phase-a -> phase-b`} | {phase IDの間の依存を、循環しない形で書く。例: `phase-a -> phase-b`} |
| | dependency results: | 依存phaseの確定結果: |
| | {親scopeよりstrictly narrowerな、このphaseで扱う範囲} | {親のscopeより狭い（親と同じ範囲にしない）、このphaseで扱う範囲} |

「親DoD coverage」「dependency results」を指示側（`roadmap-design.md`、`task-design/SKILL.md`、`steering/SKILL.md`、`runtime-feedback-review.md`）で名前として書いている箇所は、新しい名前へ追随させる。進行中のroadmap.mdには古い見出しが残るが、これらはagentが意味で読むだけでscriptの照合は無いため、読めなくなることはない。

`tasklist.md`の見出し（Phase、DoD（完了条件）、Tasks、各task詳細、動作確認等）は普段の意味のまま読めるため残す。tasklist.mdのtaskの文（「workflow owner」「decisionをcallerへ返す」等）は本文として、本文の書き直しの論点で扱う。

#### 検討記録（論点5・イテレーション0）

論点2では、言い換えたlabelを名前で読む側は文字列を追随させればよいとした。この前提を確かめるため、design.md・roadmap.mdのテンプレートのlabelについて、誰がどの成果物から読んでいるかを調べた。

- 「分類保留」「task-design内の対象成果物反映待ち」「execution plan対象」: steeringが前月のsummaryを作る時に、前月の全design.mdからsectionの有無と`なし`を読む。名前を変えると、変更前に作られたdesign.mdの完了判定ができなくなる。
- 「上位roadmap制約」: `extract-handoff-input.mjs`が既存のdesign.mdからh2見出しの完全一致で抜き出す。
- 「構造field」「運用field」: steeringが進行中のroadmap.mdの運用fieldを更新する。validatorは見出しの完全一致を検査する。
- 「親DoD coverage」「dependency results」: agentが意味で読むだけで、scriptの照合は無い。「Dependency DAG」は読む側が無い。

既存の成果物から読まれるlabelを追随で変えるには、読む側が新旧両方の名前を受け付ける必要がある（案b）。これは利用先repositoryの古い成果物のために、読む側へ二つの名前を恒久的に持たせることになる。

これらのlabelは、論点1で残すと決めた「task-design全体で決まった形式」に当たると見ることができる。名前は残し、意味が読み取れない「execution plan対象」「対象成果物反映待ち」「構造field」「運用field」等だけ、括弧で普段の言葉の説明を足す（案a）。steering・validatorは見出しにlabelの文字列が含まれるかで読むため、今のまま照合できる。

「上位roadmap制約」は完全一致で照合されるため括弧も足せない。ただし「上位のroadmapから受ける制約」と普段の意味のまま読めるため、言い換えの対象に当たらない。

代償: 「execution plan対象」のような名前そのものは成果物に残り、括弧の説明で補う形になる。

[内部検討記録: 論点5・イテレーション0](internal-records/task-design-discussion.md.topic-5.md#iteration-0)

#### 提案0へのフィードバック（論点5）

**結果:** 修正要求（古い名前を残さず新しい名前へ切り替え、古い成果物はskillの中の履歴で辿れるようにする）

> aでも良いけど、別にこれから先は新しい表記が中心になるから引きずりたくない。そのスキルのメジャーバージョンアップ的な破壊的変更が行われたときは今回みたいに追えるようにスキルディレクトリ内にxxx_historiesみたいなディレクトリに起こった事のファイル作って追えるようにADRのようなもの作れば丸く収まる？

括弧で補うaではなく、名前を切り替えるbの方向を、読む側に新旧二つの名前を持たせずに実現したい。そのために、破壊的変更の記録をskillの中に残す、という提案を受けた。この応答には、今回の変更をどうするかと、今後の破壊的変更で毎回記録を残すかという二つの判断が含まれる。後者は別の論点に分ける。

### イテレーション1（論点5）: 新しい名前へ切り替え、古い成果物はhistoriesで辿れるようにする

#### 提案1（論点5）

##### 丸く収まるかへの答え

ほぼ収まる。足りないのは一点だけで、**読む側が履歴を引くきっかけ**が要る。

steeringは、前月summaryの判定やplanless resultの検証で、古いdesign.mdの付録の見出しを名前で探す。履歴のfileがあっても、steeringがそれを引かなければ、古いdesign.mdは見出しが見つからず`不明`と判定される。label一つ一つの旧名を読む側に持たせる必要はなく、「見出しが見つからない時は作成時の版が古い可能性があるので、historiesで旧名を確かめる」という一般的な一文を、既存の成果物を読むsteeringに一つ置けばよい。

##### 名前を切り替えるlabel

| テンプレート | 今 | 後 |
| --- | --- | --- |
| `design.md` | ### task-design内で対象成果物へ適用済み | ### 設計中に反映を終えた変更 |
| | ### task-design内の対象成果物反映待ち | ### 設計中に反映する、他の判断を待っている変更 |
| | ### execution plan対象 | ### tasklist・roadmapに載せて実行する変更 |
| `roadmap.md` | ## 構造field（task-designが設計・reviewする） | ## 各phaseの計画（task-designが設計・reviewする） |
| | ### 運用field（steeringだけが更新する） | ### 進み具合（steeringだけが更新する） |
| | ## 親DoD coverage | ## 親の完了条件と、それを満たすphase |
| | ## Dependency DAG | ## phase間の依存関係 |
| | dependency results: | 依存phaseの確定結果: |
| | {親scopeよりstrictly narrowerな、このphaseで扱う範囲} | {親のscopeより狭い（親と同じ範囲にしない）、このphaseで扱う範囲} |
| | {cycleを持たないstable phase identity間の依存を記載する。例: `phase-a -> phase-b`} | {phase IDの間の依存を、循環しない形で書く。例: `phase-a -> phase-b`} |

変えないもの: 「上位roadmap制約」「分類保留（設計中のみ）」「（付録）変更の実行区分」、表の「validation結果」「参照するdesign section」「掲載理由」。普段の意味のまま読めるためである。「上位roadmap制約」を変えないので、`extract-handoff-input.mjs`の完全一致の照合は今のまま動く。

##### 読む側の追随

新しい名前だけを使い、旧名を併記しない。同じcommitで次の文字列を新しい名前へ揃える: `steering/SKILL.md`、`task-design/SKILL.md`、`tasklist-executor/SKILL.md`、`task-design/roadmap-design.md`、`skills/README.md`、`runtime-feedback-review.md`、`outcome-sections/workflow.md`、`scripts/verification/validate-plugin.mjs`。

##### 履歴の置き方

- 置き場所: `plugins/tumeda-dev/skills/task-design/templates/histories/`。labelが元々居た場所であり、配布されるpluginの中なので利用先repositoryのagentも読める。名前は既存の標準（`information_structuring/README.md`の「役目を終えたナレッジは元々居た場所に`histories`として残す」）に合わせる。
- file: `20261115-rename-template-labels.md`のように、日付と内容で名付ける。
- 中身:
  - いつの版から変わったか（9.0.0）
  - 何が変わったか: 旧名と新名の対応表。今回の論点4で変えたoutcome sectionの見出しも含める（古いdesign.mdを読む人が旧見出しを引けるようにするため）
  - なぜ変えたか: 普段の意味のまま読めない表現を、利用者の目に出る場所から無くすため
  - 古い成果物の読み方: 旧名の見出しは新名と同じものとして読む。進行中のroadmap.mdを続ける時は、見出しを新名へ書き換えてよい
- 現行のテンプレートと指示の本文には新しい名前だけを書き、旧名は履歴に隔離する。

##### 読む側に置く一文

`steering/SKILL.md`の、既存の成果物を読む箇所（前月summaryの判定、planless resultの検証、roadmapの進み具合の更新）に共通する一文を置く。

> 既存のdesign.md・roadmap.mdで、ここで探す見出しが見つからない時は、作成時のpluginの版が古い可能性がある。`task-design/templates/histories/`で旧名を確かめて読む。

##### 版

破壊的変更なので、pluginのversionを8.3.5から9.0.0へ上げる（宣言値4箇所と`validate-plugin.mjs`の`expectedRelease`）。

##### 別の論点に分けるもの

今後の破壊的変更でも、毎回このように履歴を残すという一般的な決まり（どこに書くか、何を破壊的変更とみなすか）は、この提案とは別の判断なので、次の論点で扱う。

#### 検討記録（論点5・イテレーション1）

利用者は、括弧で補う案aではなく、名前を新しいものへ切り替え、古い成果物はskillの中の履歴で辿れるようにしたいと応答した。その方法で足りるかを確かめた。

既存の決まりとの関係: `docs/documentation_standards/information_structuring/README.md`の「時間軸の3状態で置き場所を分ける」に、役目を終えたナレッジは元々居た場所に`histories`として残し、現行の本文には最新版だけを書いて旧値を混ぜない、という決まりがある。利用者の案はこれと一致するため、名前は`histories`、置き場所はlabelが元々居た`task-design/templates/`とする。ADRやchangelogの決まりは無い。

置き場所が配布物の中である必要: 設計の経緯はこのrepositoryの`.steering/`にも残るが、`.steering/`は配布されるpluginの外にあり、利用先repositoryのagentは読めない。古い成果物を読むのは利用先のagentなので、履歴は配布物の中に置く。

履歴だけで足りない点: steeringは古いdesign.mdの付録の見出しを名前で探す。履歴があっても、steeringが引かなければ見出しは見つからず、前月summaryで`不明`になる。label一つ一つの旧名を読む側に持たせると、利用者が避けたい「引きずる」形になる。そこで、見つからない時に履歴を引く、という一般的な一文だけを置く。これは今後の別の破壊的変更でもそのまま使える。

変えないlabel: 「上位roadmap制約」と「分類保留」は普段の意味のまま読めるため、論点1の問いで言い換え対象に当たらない。「上位roadmap制約」は`extract-handoff-input.mjs`が完全一致で照合するが、変えないので影響しない。

版: `maintenance-plugin-context`の版の決まりで、破壊的変更はMAJORを上げる。現在の8.3.5から9.0.0にする。

[内部検討記録: 論点5・イテレーション1](internal-records/task-design-discussion.md.topic-5.md#iteration-1)

#### 提案1へのフィードバック（論点5）

**結果:** 修正要求（形式は合意。directory名を変え、記録する変更の線をREADMEで示す）

> 形式はok。だけどhistoriesって名前は嫌だ。全ての記録を管理しなきゃいけないようで、管理だけ面倒になる。今回くらい大きい変更じゃないと残したくないからそれがわかるようなREADMEを書いて、それが書かれるようなディレクトリ名にしたい

名前の切り替え、記録のfileの中身、steeringに置く一文、9.0.0への版上げは合意された。directory名と、何を記録するかの線を示すREADMEを変える。

### イテレーション2（論点5）: 記録を残す変更の線を、directory名とREADMEで示す

#### 提案2（論点5）

提案1から変えるのは、directory名と、そのREADMEだけである。名前の切り替え、記録のfileの中身、steeringに置く一文、9.0.0への版上げは提案1のとおりとする。

##### directory名

`plugins/tumeda-dev/skills/task-design/templates/breaking_changes/`

| 候補 | 名前から読めること |
| --- | --- |
| `breaking_changes/`（推奨） | 破壊的変更だけが入る。記録する線そのものが名前に出る |
| `reading_older_artifacts/` | 古い成果物の読み方が入る。線は目的から間接に伝わるが、中身が変更の記録だとは読めない |

breaking changeはSemVer等で確立した語であり、置くだけの場所なので、命名標準（`naming/core.md`）の「既に確立した名前があればoutputで名付けてよい」に当たる。

steeringに置く一文のpathも`task-design/templates/breaking_changes/`にする。

##### READMEの見出しと扱う内容

```text
# 成果物を名前で読めなくなった変更の記録
  このdirectoryの目的を一文で示す。以前の版のtask-designが作った成果物を、今の版で読むための対応だけを残す。
  全ての変更履歴ではないことを冒頭で示す。

## 記録する変更
  線: この版より前のtask-designが作った成果物（design.md、tasklist.md、roadmap.md）を、
      今の版のskillやscriptが見出し・labelの名前で読めなくなる変更。pluginのMAJORを上げる理由にもなる。
  例: 9.0.0での付録・roadmapのlabelの切り替え（steeringが古いdesign.mdの付録を名前で探せなくなる）。

## 記録しない変更
  成果物を読む側に影響しない変更。git logと各作業の記録で辿る。
  例: 完成後の姿のsectionの見出しだけの言い換え（skillもscriptも名前で読まない）、
      テンプレートへのsectionの追加（古い成果物も今までどおり読める）、記入guideの書き直し。

## いつ読むか
  既存のdesign.md・roadmap.mdで、skillが探す見出しが見つからない時。作成時の版が古い可能性がある。

## 1件のfileに書くこと
  file名: YYYYMMDD-slug.md
  版、旧名と新名の対応、変えた理由、古い成果物の読み方。
```

提案1で「論点4で変えたoutcome sectionの見出しも記録に含める」としたが、上の線の外なので外す。

##### 線を他の変更に当てた結果

| 変更 | 記録するか | 理由 |
| --- | --- | --- |
| 今回の付録・roadmapのlabelの切り替え | する | steeringが古いdesign.mdの付録を名前で探せなくなる |
| outcome sectionの見出しだけの言い換え | しない | skillもscriptも名前で読まない |
| テンプレートへ新しいsectionを足す | しない | 古い成果物も今までどおり読める |
| 「上位roadmap制約」の見出しを変える（仮） | する | scriptが古いdesign.mdから完全一致で抜き出せなくなる |
| 記入guideの書き直しだけ | しない | 成果物の見出し・labelが変わらない |

#### 検討記録（論点5・イテレーション2）

利用者は、`histories`という名前だと全ての変更を記録・管理する場所に読めて、管理が面倒になると指摘した。記録するのは今回くらい大きい変更だけにしたく、それが分かるREADMEと、その線が伝わるdirectory名を求めている。

名前は、記録する線そのものが出る`breaking_changes/`を推奨する。`reading_older_artifacts/`は目的（古い成果物を読む）を名指すが、中身が変更の記録だとは名前から読めない。命名標準は目的（outcome）での名付けを優先するが、置くだけの場所で、既に確立した名前がある時はoutputで名付けてよいとしている。breaking changeはSemVer等で確立した語である。

「今回くらい大きい変更」を、他の変更にも当てられる線にした。「この版より前のtask-designが作った成果物を、今の版のskillやscriptが見出し・labelの名前で読めなくなる変更」である。起点の今回以外に四つの変更へ当て、記録するか否かが一意に決まることを確かめた（上の表）。outcome sectionの見出しの言い換えは線の外になるため、提案1で記録に含めるとしたものは外す。

代償: 線の外の変更は、古いdesign.mdを人が読む時に旧見出しとの対応をこのdirectoryでは辿れず、git logと各作業の記録で辿ることになる。利用者の「今回くらい大きい変更だけ」に合わせて受け入れる。

[内部検討記録: 論点5・イテレーション2](internal-records/task-design-discussion.md.topic-5.md#iteration-2)

#### 提案2へのフィードバック（論点5）

**結果:** 一部合意（directory名は合意。記録する線への明示の応答はまだ無い）

> breaking_changes ok

directory名`breaking_changes/`は合意された。READMEの「記録する変更」の線（以前の版のtask-designが作った成果物を、今の版のskillやscriptが見出し・labelの名前で読めなくなる変更）への明示の応答はまだ無いため、次の応答で確かめる。

記録する線について、次の応答で合意を得た。

> 論点5についてok。

### 決定（論点5）

design.md・roadmap.mdのテンプレートのlabelは、古い名前を残さず新しい名前へ切り替える。今後は新しい表記が中心になるため、読む側に新旧二つの名前を持たせない。

| テンプレート | 今 | 後 |
| --- | --- | --- |
| `design.md` | ### task-design内で対象成果物へ適用済み | ### 設計中に反映を終えた変更 |
| | ### task-design内の対象成果物反映待ち | ### 設計中に反映する、他の判断を待っている変更 |
| | ### execution plan対象 | ### tasklist・roadmapに載せて実行する変更 |
| `roadmap.md` | ## 構造field（task-designが設計・reviewする） | ## 各phaseの計画（task-designが設計・reviewする） |
| | ### 運用field（steeringだけが更新する） | ### 進み具合（steeringだけが更新する） |
| | ## 親DoD coverage | ## 親の完了条件と、それを満たすphase |
| | ## Dependency DAG | ## phase間の依存関係 |
| | dependency results: | 依存phaseの確定結果: |
| | {親scopeよりstrictly narrowerな、このphaseで扱う範囲} | {親のscopeより狭い（親と同じ範囲にしない）、このphaseで扱う範囲} |
| | {cycleを持たないstable phase identity間の依存を記載する。例: `phase-a -> phase-b`} | {phase IDの間の依存を、循環しない形で書く。例: `phase-a -> phase-b`} |

「上位roadmap制約」「分類保留（設計中のみ）」「（付録）変更の実行区分」、表の「validation結果」「参照するdesign section」「掲載理由」は、普段の意味のまま読めるため変えない。「上位roadmap制約」を変えないので、`extract-handoff-input.mjs`の完全一致の照合は今のまま動く。

新しい名前を使う読む側（`steering/SKILL.md`、`task-design/SKILL.md`、`tasklist-executor/SKILL.md`、`task-design/roadmap-design.md`、`skills/README.md`、`runtime-feedback-review.md`、`outcome-sections/workflow.md`、`scripts/verification/validate-plugin.mjs`）は、同じcommitで新しい名前へ揃え、旧名を併記しない。

古い成果物は、`plugins/tumeda-dev/skills/task-design/templates/breaking_changes/`に残す記録で辿る。

- directory名は、記録する線そのもの（破壊的変更だけ）が名前に出る`breaking_changes/`とする。`histories/`は全ての過去を残す場所に読め、管理が面倒になるため採らない。配布されるpluginの中に置き、利用先repositoryのagentも読めるようにする。
- 記録する変更は、以前の版のtask-designが作った成果物（design.md、tasklist.md、roadmap.md）を、今の版のskillやscriptが見出し・labelの名前で読めなくなる変更だけである。outcome sectionの見出しだけの言い換え、テンプレートへのsectionの追加、記入guideの書き直しは、読む側に影響しないため記録しない。
- 今回の記録は1 file（`YYYYMMDD-slug.md`）で、変わった版（9.0.0）、旧名と新名の対応（上の表のうち、名前で読まれていたもの）、変えた理由、古い成果物の読み方を書く。
- `steering/SKILL.md`の、既存の成果物を読む箇所に共通する一文として、「既存のdesign.md・roadmap.mdで、ここで探す見出しが見つからない時は、作成時のpluginの版が古い可能性がある。`task-design/templates/breaking_changes/`で旧名を確かめて読む」を置く。
- 破壊的変更なので、pluginのversionを8.3.5から9.0.0へ上げる。

記録する線と1件の書き方を、directoryのREADMEとpluginの共通の規則のどちらに置くかは論点6で決める。

## 論点6: 今後の破壊的変更で、記録を残すことをどこで思い出させるか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点6）: 破壊的変更を行う人が必ず通る場所に一文を置く

#### 提案0（論点6）

`plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md`の「Plugin version」節にある「破壊的変更はMAJOR、…を上げる」の直後へ、次の一文を足す。

```diff
 - 破壊的変更はMAJOR、後方互換な機能追加はMINOR、後方互換な修正・文書変更はPATCHを上げる
+  - MAJORを上げる理由が、以前の版のskillが作った成果物を、今の版のskillやscriptが見出し・labelの名前で読めなくなることなら、その成果物のテンプレートを持つdirectoryの`breaking_changes/`へ、旧名と新名の対応を残す。記録する変更の線と1件のfileに書くことは`task-design/templates/breaking_changes/README.md`に従う。`breaking_changes/`が無いskillでは、同じ形で作る。
 - MINORとPATCHの境界は「consumerが新たに呼べるものが増えたか」で判定する。…
```

置く理由: 配布する変更には必ずversion bumpを行うため、破壊的変更はこの節でMAJORの判定を通る。記録を残すことを思い出せる、必ず通る場所である。線と中身はREADMEに委ね、ここへ写さない。

置かない場合: READMEは記録の置き場所にあるため、破壊的変更を行う人がそこを開かなければ記録を思い出せない。今回のように利用者が気づかない限り、記録が残らない。

#### 検討記録（論点6・イテレーション0）

利用者は論点5の応答で、破壊的変更が行われた時は今回のように追えるようにしたいと述べた。論点5で記録の置き場所とREADMEは決まったが、READMEは置き場所の中にあるため、破壊的変更を行う人がそこを開かなければ記録を残すことを思い出せない。

破壊的変更を行う人が必ず通る場所を探した。`maintenance-plugin-context`の「Plugin version」節は、破壊的変更ならMAJORを上げると定め、配布する変更には必ずversion bumpを行う。つまり破壊的変更は、必ずこの節でMAJORの判定を通る。ここに一文を置けば、記録を思い出せる。

一文は、どの変更で記録するかの線と、記録の中身をREADMEへ委ねる。ここへ写すと、READMEを直した時に食い違う。

今は`task-design`だけが`breaking_changes/`を持つ。他のskill（facilitate-discussion等）の成果物で同じ変更が起きた時のために、そのskillのテンプレートを持つdirectoryに同じ形で作る、と書く。

[内部検討記録: 論点6・イテレーション0](internal-records/task-design-discussion.md.topic-6.md#iteration-0)

#### 提案0へのフィードバック（論点6）

**結果:** 修正要求（共通の規則に個別のskillを名指さない）

> 論点6について、maintenance-plugin-context/SKILL.md に書くのはいいけど、それは全般に同じ規則を適用するから。だからtask-designを名指しで指名するとかありえない。共通の原則のところに個別の事書くとかセンスなさすぎるよね。それでもOpus？ メソッドに関係ない文脈のものぶっ込んで目先ifで解決するタイプ？

置き場所（`maintenance-plugin-context/SKILL.md`）は合意。共通の規則から`task-design`のREADMEを線と書き方の正本として名指したのは誤りである。

### イテレーション1（論点6）: 線と書き方を共通の規則へ置き、個別のREADMEは共通を参照する

#### 提案1（論点6）

##### 共通の規則（`maintenance-plugin-context/SKILL.md`の「Plugin version」節）

「破壊的変更はMAJOR、…を上げる」の直下へ、どのskillにも当たる内容だけを書く。特定のskillやpathは名指さない。

```diff
 - 破壊的変更はMAJOR、後方互換な機能追加はMINOR、後方互換な修正・文書変更はPATCHを上げる
+  - MAJORを上げる理由が、以前の版のskillが作った成果物を、今の版のskillやscriptが見出し・labelの名前で読めなくなることなら、その成果物のテンプレートと同じdirectoryの`breaking_changes/`に記録を残す。無ければ作る。
+    - 記録しない変更: 成果物を読む側に影響しない変更（読まれない見出しの言い換え、テンプレートへのsectionの追加、記入guideの書き直し等）。git logと各作業の記録で辿る。
+    - 1件のfile: 名前は`YYYYMMDD-slug.md`。変わった版、旧名と新名の対応、変えた理由、古い成果物の読み方を書く。
+    - `breaking_changes/`のREADMEには、記録の対象がこの変更だけであることと、そのskillの成果物での具体例を書き、線と1件の書き方はこの規則を参照する。
 - MINORとPATCHの境界は「consumerが新たに呼べるものが増えたか」で判定する。…
```

##### 個別のREADME（`task-design/templates/breaking_changes/README.md`）

論点5で決めた見出し構成から、線と1件の書き方の本文を共通の規則へ移し、ここには参照とtask-design固有の内容だけを残す。

```text
# 成果物を名前で読めなくなった変更の記録
  以前の版のtask-designが作った成果物を、今の版で読むための対応だけを置く。全ての変更履歴ではない。
  記録の対象と1件の書き方は、maintenance-plugin-contextの版の規則（「Plugin version」節）に従う。

## task-designの成果物で記録する例・しない例
  対象の成果物: design.md、tasklist.md、roadmap.md
  記録する例: 9.0.0での付録・roadmapのlabelの切り替え（steeringが古いdesign.mdの付録を名前で探せなくなる）
  記録しない例: 完成後の姿のsectionの見出しだけの言い換え（skillもscriptも名前で読まない）、
                テンプレートへのsectionの追加、記入guideの書き直し

## いつ読むか
  既存のdesign.md・roadmap.mdで、skillが探す見出しが見つからない時。作成時の版が古い可能性がある。
```

参照の向き: 個別のREADMEが共通の規則を参照する。共通の規則は個別のskillを参照しない。

#### 検討記録（論点6・イテレーション1）

提案0は、共通の規則（`maintenance-plugin-context`の版の規則）から、記録する線と書き方の正本として`task-design`のREADMEを名指した。全skillに当たる規則から個別のskillを参照する、逆向きの依存である。

原因は、論点5で線と書き方をtask-designのREADMEへ書く構成を先に決め、論点6でその構成を前提に一文を足したことにある。線（以前の版のskillが作った成果物を、今の版で名前で読めなくなる変更）も、書き方（版、旧名と新名、理由、読み方）も、どのskillの成果物にも当たる。全skillに当たる内容は共通の規則に置くべきだったのに、それを問い直さなかった。既存の標準（`naming/core.md`の「中身を足す前に、名前が約束する範囲に入るかを確かめる」）に当てても、task-designのpathは「Plugin version」節の範囲に入らない。

修正では、線と書き方を共通の規則へ置き、task-designのREADMEには、このdirectoryに何が入るかと、task-designの成果物での具体例だけを残す。参照は個別から共通への向きになる。

論点5で合意したREADMEの見出し構成（記録する変更、記録しない変更、いつ読むか、1件のfileに書くこと）のうち、「記録する変更」の線と「1件のfileに書くこと」の本文は共通の規則へ移り、READMEからは参照になる。記録する変更・しない変更の線そのものは論点5の合意から変わらない。

[内部検討記録: 論点6・イテレーション1](internal-records/task-design-discussion.md.topic-6.md#iteration-1)

#### 提案1へのフィードバック（論点6）

**結果:** 合意

> ok。そして今回のような愚策をもう提案しないように、再発防止できるような場所にちゃんと指示を書いておきたい

後半の再発防止は別の判断なので、論点7で扱う。

### 決定（論点6）

破壊的変更の記録を残すことは、pluginの全skillに当たる共通の規則として、`plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md`の「Plugin version」節の「破壊的変更はMAJOR、…を上げる」の直下へ書く。配布する変更には必ずversion bumpを行うため、破壊的変更はこの節でMAJORの判定を必ず通る。共通の規則には全skillに当たる内容だけを書き、特定のskillやpathを名指さない。

```diff
 - 破壊的変更はMAJOR、後方互換な機能追加はMINOR、後方互換な修正・文書変更はPATCHを上げる
+  - MAJORを上げる理由が、以前の版のskillが作った成果物を、今の版のskillやscriptが見出し・labelの名前で読めなくなることなら、その成果物のテンプレートと同じdirectoryの`breaking_changes/`に記録を残す。無ければ作る。
+    - 記録しない変更: 成果物を読む側に影響しない変更（読まれない見出しの言い換え、テンプレートへのsectionの追加、記入guideの書き直し等）。git logと各作業の記録で辿る。
+    - 1件のfile: 名前は`YYYYMMDD-slug.md`。変わった版、旧名と新名の対応、変えた理由、古い成果物の読み方を書く。
+    - `breaking_changes/`のREADMEには、記録の対象がこの変更だけであることと、そのskillの成果物での具体例を書き、線と1件の書き方はこの規則を参照する。
```

`task-design/templates/breaking_changes/README.md`には、このdirectoryに古い成果物を読むための対応だけを置くこと（全ての変更履歴ではないこと）、記録の対象と1件の書き方は`maintenance-plugin-context`の版の規則に従うこと、task-designの成果物（design.md、tasklist.md、roadmap.md）で記録する例（9.0.0での付録・roadmapのlabelの切り替え）と記録しない例（完成後の姿のsectionの見出しだけの言い換え、テンプレートへのsectionの追加、記入guideの書き直し）、いつ読むか（既存のdesign.md・roadmap.mdで、skillが探す見出しが見つからない時）を書く。参照は個別のREADMEから共通の規則への一方向とし、共通の規則は個別のskillを参照しない。

## 論点7: 共通の場所に個別を書き込む提案を、再び出さないための指示をどこに書くか

**ステータス:** 反映済み

**種別:** 認識齟齬

### イテレーション0（論点7）: 共通の規則を書く場面の思考の作法に、一般の原則として足す

#### 提案0（論点7）

##### 書く場所

1. `plugins/tumeda-dev/docs/think_standards/writing_abstraction.md`へ、新しい補助節を足す。共通の規則（抽象）を書く場面の思考の作法であり、think-throughとして毎ターン注入される場面の一つである。
2. このrepositoryの`.claude/hooks/think_through_session_start.sh`が注入する場面別の要約の「抽象を書く」の行に、一言足す。

##### 1. `writing_abstraction.md`に足す節

「文脈を離れた具体例で抽象の視野を確認する」の後へ置く。

```markdown
## 補助: 共通の場所に、今回の個別を書き込まない

複数の対象に効く場所（全体に当たる規則、共通の関数、基底のclass、全体の索引）には、そこが効く全ての対象に当たる内容だけを書く。今回扱っている個別の対象の名前、path、条件分岐を書き込まない。個別に固有の内容は個別の側に置き、個別から共通を参照する。共通が個別を参照する向きにしない。

今の文脈での例: pluginの全skillに当たる版の規則へ、破壊的変更を記録する時の線と書き方の正本として、特定のskillのREADMEのpathを書いた。線と書き方はどのskillの成果物にも当たるのに、正本を一つのskillへ置き、全体の規則がそのskillを参照する向きになった。線と書き方を全体の規則へ置き、個別のREADMEには、そのskillでの具体例と全体の規則への参照だけを置くべきだった。

文脈を離れた例: 金額を整形する共通の関数へ、請求書の画面のためだけに「請求書なら小数第2位まで」という`if`を足す。呼び出し元が増えるたびに分岐が増え、共通の関数が個々の呼び出し元を知る形になる。桁数は呼び出し元が渡すか、請求書の側で整形する。

やってしまいがちな行動:
- 今の作業で個別の置き場所や構成を先に決め、その後で共通の規則を足す時に、決めた個別を参照して済ませる
- 足す先を話題で照合し（「記録の話は版の規則の話題に入る」）、当たる対象の広さで照合しない
- 目の前の一件を通すために、共通の場所へ条件分岐や固有名を足す

それをやると何が起きるか:
- 共通の場所が一つの個別に依存する。別の対象に当てると意味が通らず、個別を直すと共通が壊れる
- 個別ごとの例外が共通の場所に積み重なり、何に当たる規則なのかが読めなくなる

判断の問い: 「この共通の場所に書こうとしている文は、今回の対象を、ここが効く別の対象に置き換えても、そのまま成り立つか。成り立たない部分は個別の側へ置けるか」
```

##### 2. 場面別の要約の一言

```diff
-- 抽象を書く（writing_abstraction.md）: 抽象と具体をワンショット。文脈外の具体でも成立するか確認する
+- 抽象を書く（writing_abstraction.md）: 抽象と具体をワンショット。文脈外の具体でも成立するか確認する。共通の場所に今回の個別を書き込まない
```

##### 併せて行うこと

- `scripts/verification/validate-plugin.mjs`へ、足した節の見出しと判断の問いが残っていることのassertionを足す（docsを変えたらassertionを同じ変更で足す、というrepositoryの検証の決まり）。

#### 検討記録（論点7・イテレーション0）

論点6の提案0で、assistantは全skillに当たる版の規則から、task-designのREADMEを線と書き方の正本として名指した。原因は、個別の構成（task-designのREADMEに線と書き方を書く）を先に決め、共通の規則を足す時にそれを参照して済ませ、足す内容が全ての対象に当たるかを問い直さなかったことにある。

既存の標準がなぜ止めなかったかを照合した。

- `naming/core.md`の「中身を足す前に、名前が約束する範囲に入るかを確かめる」は、足す中身が範囲に入るかを問う。assistantは話題（破壊的変更の記録は版の話）で照合して通してしまった。範囲には「どの対象に当たるか」の広さもあるが、この節はそれを明示していない。
- `writing_abstraction.md`の「文脈を離れた具体例で抽象の視野を確認する」は、添える具体例の広さを扱う。抽象の本文に今回の個別を書き込む誤りと、共通が個別を参照する向きは扱っていない。
- `naming/README.md`の「`core.md`は積集合だけを扱う」は近い原則だが、naming群の置き方に閉じている。

一般の原則としてどこにも書かれていないため、誤りが起きた場面（共通の規則＝抽象を書く場面）の思考の作法である`writing_abstraction.md`へ足す。think-throughとして毎ターン注入される場面の一つなので、他のrepositoryでも効く。検知の問いは、同fileの「検知手順は、行為ではなく状態か関係で書く」に従い、「今回の対象を別の対象に置き換えても成り立つか」という関係で書いた。これは「pathを書いたか」のような行為の検知と違い、共通の場所に正しく置かれた参照（個別のREADMEから共通の規則への参照等）を誤って弾かない。

文脈を離れた例には、利用者の指摘（共通のメソッドに目先のifを入れる）と同じ構造の、共通の関数への呼び出し元固有の分岐を選んだ。

`.claude/hooks/`の要約はこのrepositoryで作業する時だけ注入される。利用先repositoryでは`writing_abstraction.md`本体がthink-throughから読まれる。

[内部検討記録: 論点7・イテレーション0](internal-records/task-design-discussion.md.topic-7.md#iteration-0)

#### 提案0へのフィードバック（論点7）

**結果:** 合意

> ok

### 決定（論点7）

共通の場所に今回の個別を書き込む誤りを再び起こさないため、次の三つを行う。

1. `plugins/tumeda-dev/docs/think_standards/writing_abstraction.md`の「文脈を離れた具体例で抽象の視野を確認する」の後へ、補助節「共通の場所に、今回の個別を書き込まない」を[提案0（論点7）](#提案0論点7)の本文どおりに足す。誤りが起きたのは共通の規則（抽象）を書く場面であり、その場面の思考の作法はthink-throughとして毎ターン注入されるため、利用先repositoryでも効く。既存の`naming/core.md`の範囲の照合は話題での照合を許し、`writing_abstraction.md`の文脈外の具体例は添える例の広さだけを扱い、`naming/README.md`の積集合の原則はnaming群に閉じているため、一般の原則としてはどこにも無かった。
2. このrepositoryの`.claude/hooks/think_through_session_start.sh`の「抽象を書く」の行の末尾に「共通の場所に今回の個別を書き込まない」を足す。
3. `scripts/verification/validate-plugin.mjs`へ、足した節の見出しと判断の問いが残っていることのassertionを足す。

検知の問いは「今回の対象を、ここが効く別の対象に置き換えても、そのまま成り立つか」という関係で書く。「pathを書いたか」のような行為の検知にすると、個別から共通への正しい参照まで弾くためである。

### 現在の変更（論点7）

決定どおり、`plugins/tumeda-dev/docs/think_standards/writing_abstraction.md`へ補助節を足し、`.claude/hooks/think_through_session_start.sh`の「抽象を書く」の行へ一言を足し、`scripts/verification/validate-plugin.mjs`へ補助節の見出しと判断の問いのassertionを足した。`node scripts/verification/validate-plugin.mjs`は`plugin validation passed`、`node scripts/verification/test-task-design-handoff.mjs`は`task-design handoff tests passed`を出力した。このdecisionのdoc-enricherの提案modeのreviewでは、`think_standards/README.md`の索引の一行が補助節の追加後も正しく、既存READMEへ足す候補は無かった。未解決は無い。

## 論点8: 「見分ける問い」を、ルー語の再発防止としてどこに置くか

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点8）: 新しい標準を作り、書く時に通る二つの経路から参照する

#### 提案0（論点8）

##### 置き場所と参照の経路

```text
plugins/tumeda-dev/docs/documentation_standards/
├── README.md                    # 収録一覧へ一行足す
└── everyday_wording.md          # 新設。見分ける問いと書き直し方の正本

参照する側（個別 → 共通の向き）
├── skills/document-review/SKILL.md   # 作成時観点・更新時観点へ「普段の言葉 → everyday_wording.md」
└── skills/task-design/SKILL.md §1    # design.mdとchatで利用者へ書く時に確認する一行
```

- `referent_explicitness.md`へは足さない。この標準は「語が指す実体を復元できるか」を扱い、precedenceや全量保存宣言のような耳馴染みがない語の型は、名前が約束する範囲（指示対象の明示）に入らない。
- `document-review`の観点にするのは、テンプレートやskill本体を書く時に必ず通るためである。
- task-designの§1に置くのは、design.mdとchatは`document-review`の対象外だが、利用者が読んで合意する文だからである。既存のconfidentiality・provisionalityの参照と同じ形にする。
- 標準は特定のskillを名指さない（論点7で足した原則）。task-design以外のskillへの参照は、論点2の決定どおり今回は置かない。

##### `everyday_wording.md`の見出しと扱う内容

```text
# 普段の言葉で書く
  documentation_standards/の傘の下の1トピック。
  書いた表現を、読み手が普段使っている意味のまま読んで、書き手の意図どおりに受け取れるかを扱う。

## 見分ける問い
  「この表現を知らない読み手が、普段使っている意味のまま読んで、書き手の意図どおりに受け取れるか」。
  受け取れないなら書き直す。英語か日本語かは問わない。

## 書き直す表現の二つの型
  耳馴染みがない表現: 英語（precedence、tie-break、closed-world）、日本語の造語（全量保存宣言、理解依存）
  聞き慣れているが、ここだけの意味を載せた表現: owner（責任を持つ担い手の意味）、contract、「所有する」（そのsectionに書く、の意味）
  文脈を離れた例: 業務文書の「突合」「洗い替え」（社内でだけ通じる意味で使う場合）

## 残す表現
  識別子・path・file名・code例、決まった形式（MUST／SHOULD／MAY等）、
  開発の会話で普段の意味のまま使う語（file、test、API、commit等）

## 書き直し方
  一語ずつ訳語を決めて置き換えない。箇所ごとに、その文で言いたいことを普段の言葉で書く。
  例: 「owner境界」を「担当境界」にしても何の境界かは読めない → 「このsectionに書くこと・書かないこと」
  揃えるもの: 一つの文書の中で同じものを繰り返し指す語、繰り返し出る小見出し

## 当てはめる範囲
  利用者の目に出る文（テンプレートの見出し・本文・記入欄、それを使って書かれる成果物、利用者への応答）と、
  書き手がその語を成果物へ持ち込む入口（テンプレートの記入guide）。
  skillの内部だけでやり取りされる指示の文は、内輪で通じればよいため対象外。

## やってしまいがちな失敗
  行動: 「識別子は原文を維持する」を広く読み、普通の概念語まで英語のまま書く／英語をカタカナにするだけで済ませる
  起きること: 読み手が訳し直さないと読めず、書き手がその語を成果物へ持ち込み、読む人全員へ負担が移る
  判断の問い: 見分ける問いと同じ
```

各見出しの本文は、この合意の後に実fileとして書き、作成されたfile自体をreviewしてもらう。

##### 併せて行うこと

- `documentation_standards/README.md`の収録一覧へ一行足す。
- `scripts/verification/validate-plugin.mjs`へ、新しい標準の存在と、`document-review`・`task-design/SKILL.md`の参照が残っていることのassertionを足す。

#### 検討記録（論点8・イテレーション0）

論点3で対応表を作らないと決めた代償として、後から書く人が同じ型の表現を書く余地が残る。issueの原因は、プロジェクト指示の「識別子は原文を維持する」がowner等の普通の概念語まで英語で書くことを止めず、どの表現を避けるかの線引きがどこにも無かったことにある。論点1の見分ける問いと論点3の書き直し方を、書く時に当たる場所へ置く。

既存の標準に足せるかを調べた。`referent_explicitness.md`は「語が指す実体を、読み手が復元できるか」を扱い、「system内部語」を指示語の範囲に含む。論点1の二つ目の型（聞き慣れているが特別な意味を載せた語）とは重なるが、一つ目の型（precedence、全量保存宣言のような耳馴染みがない語）は語の馴染みの問題で、指示対象の明示という名前の範囲に入らない。そのため新しい標準を1 fileとして作る。

書く時に通る経路は二つある。

- テンプレートやskill本体を書く時: `document-review`が作成時・更新時の観点を当てる。`documentation_standards/README.md`は、書かれた文に当てて判定できる標準を観点listへ足すと定めている。
- task-designがdesign.mdとchatで利用者へ書く時: これらは`document-review`の対象外である。task-designの§1は、成果物へ書く前に`confidentiality.md`と`provisionality_explicitness.md`で確認する参照を既に持つので、同じ形で一行置く。

どちらも個別のskillから共通の標準を参照する向きで、標準は特定のskillを名指さない（論点7の原則）。task-design以外のskill（facilitate-discussion等）が書く成果物への参照は、論点2の決定どおり今回は置かない。

新しいfileの名前は、収録されている標準（`content_density.md`、`referent_explicitness.md`等）と同じく英語のsnake_caseで、中身（普段の言葉で書く）が分かる`everyday_wording.md`とした。

[内部検討記録: 論点8・イテレーション0](internal-records/task-design-discussion.md.topic-8.md#iteration-0)

#### 提案0へのフィードバック（論点8）

**結果:** 合意

> 素晴らしい提案。ok。さすがopusだね。

### 決定（論点8）

論点1の見分ける問いと論点3の書き直し方を、新しい標準`plugins/tumeda-dev/docs/documentation_standards/everyday_wording.md`（普段の言葉で書く）に置く。既存の`referent_explicitness.md`へは足さない。同標準は語が指す実体を復元できるかを扱い、耳馴染みがない語の型が名前の範囲（指示対象の明示）に入らないためである。

標準の見出しは、見分ける問い、書き直す表現の二つの型、残す表現、書き直し方、当てはめる範囲、やってしまいがちな失敗とする。標準は特定のskillを名指さない。

参照は個別から共通の標準への向きで、次の二つに置く。

- `skills/document-review/SKILL.md`の作成時観点・更新時観点へ「普段の言葉 → `everyday_wording.md`」。テンプレートやskill本体を書く時に必ず通るため。
- `skills/task-design/SKILL.md`の§1へ、成果物とchatで利用者へ向けて書く表現を同標準で確認する一行。design.mdとchatは`document-review`の対象外だが、利用者が読んで合意する文であるため。既存のconfidentiality・provisionalityの参照と同じ形にする。

task-design以外のskillからの参照は、論点2の決定どおり今回は置かない。`documentation_standards/README.md`の収録一覧へ一行足し、`validate-plugin.mjs`へassertionを足す。

### 現在の変更（論点8）

決定どおり、`everyday_wording.md`を新設し、`documentation_standards/README.md`の収録一覧、`document-review/SKILL.md`の作成時・更新時観点、`task-design/SKILL.md`の§1へ参照を足し、`validate-plugin.mjs`へ標準の見出し・書き直し方・三つの参照のassertionを足した。`node scripts/verification/validate-plugin.mjs`は`plugin validation passed`を出力した。新設した標準のfile自体は、利用者のreviewで合意を得た（「どっちもok」。論点9の提案0と同じ応答）。このdecisionのdoc-enricherの提案modeのreviewでは、`documentation_standards/README.md`の収録一覧へ足した一行以外に、既存READMEへ足す候補は無かった。

## 論点9: 本文と記入の手引きの書き直しを、どう合意して反映するか

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点9）: 見本で書き方を合意し、残りを任せてもらう

#### 提案0（論点9）

| 案 | 内容 | 往復 |
| --- | --- | --- |
| a | 17 file（outcome-sections 14、design.md・tasklist.md・roadmap.mdのテンプレート）の書き直しを、discussionで一つずつ合意する | 17往復以上 |
| b | 全て任せてもらい、出来上がった差分だけをreviewしてもらう | 少ない。ただし書き方がずれていると全fileをやり直す |
| c（推奨） | 性質の違う2 fileを見本として書き直して合意し、その書き方で残りを任せてもらう。最後に全体の差分をreviewしてもらう | 2〜3往復 |

cの見本は次の2 fileにする。どちらも易しくないfileを選ぶ（`building_a_prototype.md`の「やりやすいところから始めない」）。

- `caller-contracts.md`: issueが名指しした。呼び出し方と保証という、code寄りの内容。
- `contract-preservation.md`: 表現が最も込み入っている（全量保存宣言、明示差分、baseline、ledger等）。他の標準`function_migration_policy.md`の語との対応を持つ。

見本の合意の後、残りの書き直し、design.md・roadmap.mdのlabelの切り替えと読む側の追随、`breaking_changes/`、`maintenance-plugin-context`の規則、`steering/SKILL.md`の一文、version 9.0.0を、同じ作業の中で反映し、全体の差分をreviewしてもらう。

代償: 見本以外のfileは、最後の差分reviewまで利用者の目を通らない。書き方のずれは見本で潰すが、file固有の判断でずれる余地は残り、最後の差分で指摘を受けて直す。

#### 検討記録（論点9・イテレーション0）

見出し・labelの言い換えと書き直しの基準は決まった。残る本文と記入の手引きは、outcome-sectionsだけで1137行あり、箇所ごとの書き直しは一意に決まらない判断を含む。全てを一つずつ合意すると17往復以上になる。全てを任せて最後の差分だけを見てもらうと、書き方がずれていた時に全fileをやり直すことになる。

そこで、性質の違う2 fileを見本として先に合意し、その書き方で残りを書く案を推奨する。`building_a_prototype.md`は「横展開で検証するまで成立していない。やりやすいところから始めない」としているため、見本は易しいfileを避け、issueが名指しした`caller-contracts.md`と、表現が最も込み入り他の標準の語との対応も持つ`contract-preservation.md`を選んだ。

[内部検討記録: 論点9・イテレーション0](internal-records/task-design-discussion.md.topic-9.md#iteration-0)

#### 提案0へのフィードバック（論点9）

**結果:** 合意（同じ応答で、論点8で新設した`everyday_wording.md`のfile自体にも合意）

> どっちもok

### 決定（論点9）

本文と記入の手引きの書き直しは、性質の違う2 fileを見本として先に書き直して合意し、その書き方で残りを書く。最後に全体の差分をreviewしてもらう。見本は、issueが名指しした`caller-contracts.md`（呼び出し方と保証。code寄り）と、表現が最も込み入り`function_migration_policy.md`の語との対応を持つ`contract-preservation.md`とする。易しいfileを見本にしない（`building_a_prototype.md`）。

見本の合意の後、残りのoutcome-sectionsの書き直し、design.md・tasklist.md・roadmap.mdのテンプレートの記入の手引きとtaskの文の書き直し、design.md・roadmap.mdのlabelの切り替えと読む側の追随、`breaking_changes/`、`maintenance-plugin-context`の規則、`steering/SKILL.md`の一文、version 9.0.0を、同じ作業の中で反映する。

代償として、見本以外のfileは最後の差分reviewまで利用者の目を通らない。file固有の判断でずれた箇所は、最後の差分で指摘を受けて直す。

### 現在の変更（論点9）

見本2 fileの合意（論点10）とownerの書き直しの合意（論点11）を受け、任された範囲を反映した。

- outcome-sectionsの残り12 file（`README.md`、`catalog.md`、`code-structure.md`、`data.md`、`documentation.md`、`file-deliverables.md`、`interaction-flow.md`、`research-findings.md`、`runtime-and-configuration.md`、`screen.md`、`skill-policy.md`、`workflow.md`）を、見本の書き方と論点4・11の決定で書き直した。記入guideの項目（なぜ必要か、NG、記述例、書く条件、書くこと・書かないこと、MUST、判断基準）は削除・統合していない。
- `templates/design.md`・`tasklist.md`・`roadmap.md`の記入guideとtaskの文を書き直し、論点5のlabelを切り替えた。tasklistの「特定の`steering` callerへ固定しない」は「適用する担当を`steering`に固定しない」とし、validatorの検査文を合わせた。tasklistの「## 参照」の「正本」も書き直した。
- 任された範囲で選んだ主な言い換え: policy→方針、能力境界→受け持つ範囲、negative diagnosis→違反の見分け方、pain→困りごと、snapshot→その時点の内容・保つべき内容、single source of truth→正とする記録・正とする記述の置き場所、single writer→書き込む担当を一つにする、caller／consumer→呼び出す側／結果を受け取る側、gate→先へ進む条件・〜を書く条件、handoff→引き継ぎ、orchestration→処理の組み立て、evidence／finding→根拠／分かったこと、false positive→誤検知、ubiquitous language・bounded context→domainの中で共通に使う言葉・その言葉が通じる範囲の境目。
- 論点5・6の決定どおり、labelを名前で読む側（`steering/SKILL.md`、`task-design/SKILL.md`、`tasklist-executor/SKILL.md`、`task-design/roadmap-design.md`、`skills/README.md`、`runtime-feedback-review.md`、`validate-plugin.mjs`）を追随させ、`task-design/templates/breaking_changes/`（READMEと記録1件）、`maintenance-plugin-context/SKILL.md`の版の規則、`steering/SKILL.md`の一文を足し、versionを9.0.0にした。
- 検証: `node scripts/verification/validate-plugin.mjs`は`plugin validation passed`、`node scripts/verification/test-task-design-handoff.mjs`は`task-design handoff tests passed`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs`はpass 24・fail 0。言い換え対象の表現のgrepの当たりは、file名、移行元の引用、`function_migration_policy.md`の語との対応だけ。旧labelのgrepの当たりは`breaking_changes/20261115-rename-template-labels.md`だけ。
- 利用者のreview: PR https://github.com/tumeda1992/ai_agent_dev_skill_plugin/pull/19 の全体の差分（commit `c92b589`、`232f311`）について、次の応答で合意を得た。

  > 全部ok

- 未解決は無い。

## 論点10: 見本2 fileの書き直しを、残りの書き方の基準にしてよいか

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点10）: 見本2 fileを書き直す

#### 提案0（論点10）

見本2 fileを、合意済みの見出し・label（論点4）と書き直し方（論点1・3）で書き直し、作業branchへ置いた。合意を得るまでは見本であり、この書き方を残りのfileへ広げない。

- `plugins/tumeda-dev/skills/task-design/templates/outcome-sections/caller-contracts.md`
- `plugins/tumeda-dev/skills/task-design/templates/outcome-sections/contract-preservation.md`

##### 書き直しで決めたこと

| 箇所 | 書き直し方 |
| --- | --- |
| `caller-contracts.md`のcaller、caller-facing、contract | 「呼び出し元」「呼び出し元から見える名前」「呼び出し方」「保証」へ、箇所ごとに書き分けた。例: 「caller contractへ昇格させない」は「このsectionへ書き足さない」 |
| side effect、input、result、identifier | 副作用、入力、結果、名前 |
| ubiquitous language | 「domainの概念と、それを呼ぶ共通の言葉」 |
| placeholderの`{callerFacingName}` | `{operationName}`。placeholderの中にも呼び出し元を指す英語を残さない |
| `contract-preservation.md`のcontract | 「意味単位」。`function_migration_policy.md`のcontract（保存の対象になる振る舞いと判断の単位）に当たる |
| baseline、ledger | 「移行前の基準」「移行の対応表」。記入の手引きの冒頭で、同policyのbaseline、ledger（構造ledgerとcontract ledger）、contractとの対応を一度だけ示した |
| 全量保存宣言、closed-world、明示差分 | 「次に書く変化以外は全て保存する」という宣言、「閉じた完成状態」（意味を同じ文で説明）、「意図して変える変化」 |
| black-box、順方向・逆方向照合 | 「外から動かして確かめる検証」「移行元から移行先への照合と、逆向きの照合」 |
| owner（担当、置き場所の意味） | 「担当」「担当や置き場所」 |

残した語: `KEEP | MOVE | ADAPT | ADD | CHANGE | RETIRE`（決まった形式）、refactoring、validator、rollback、signature、application service、adapter、domain（開発の会話で普段の意味のまま使う語）、file名の`function-migration-ledger.md`（識別子）。

判断能力の保存: 両fileとも、なぜ必要か、NG、記述例、書く条件、書くこと・書かないこと、MUST、判断基準の全ての項目を残し、項目の削除・統合はしていない。

`node scripts/verification/validate-plugin.mjs`は`plugin validation passed`を出力した。

#### 検討記録（論点10・イテレーション0）

論点9で、見本2 fileを先に書き直して合意し、その書き方で残りを書くと決めた。見本は、論点4で決めた見出し・labelを使い、論点1の見分ける問いと論点3の書き直し方（箇所ごとに言いたいことを書く。sectionの中で同じものを指す語は揃える）で書いた。

`caller-contracts.md`では、caller・contractを「呼び出し元」「呼び出し方」「保証」へ箇所ごとに書き分けた。sectionの中では「呼び出し元」に揃えた。

`contract-preservation.md`は、`function_migration_policy.md`が定義するbaseline、ledger、contractを使って書かれている。design.mdの読み手には言い換えた語（移行前の基準、移行の対応表、意味単位）を見せ、記入の手引きの冒頭で一度だけ同policyの語との対応を示した（論点4の決定）。agentは対応を見て、同policyの手順へ辿れる。

書き直しで項目を削ったり統合したりすると、記入の手引きが持っていた判断能力が落ちる。両fileとも全ての項目を残した。

[内部検討記録: 論点10・イテレーション0](internal-records/task-design-discussion.md.topic-10.md#iteration-0)

#### 提案0へのフィードバック（論点10）

**結果:** 合意（ownerの書き直しだけは、論点11で全箇所を洗い出して決める）

> 基本的にok。ownerだけ、テンプレートファイル横断で全部洗い出して、それぞれの文や見出し表現に対する修正提案を一挙に出して

### 決定（論点10）

見本2 file（`caller-contracts.md`、`contract-preservation.md`）の書き直しを、残りのfileの書き方の基準にする。ownerの書き直しだけは、テンプレートの全fileで全箇所を洗い出し、論点11で一挙に決める。

## 論点11: テンプレートの全fileで、ownerをそれぞれ何へ書き直すか

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点11）: 全箇所を抜き出し、意味ごとに書き直す

#### 提案0（論点11）

`task-design/templates/`配下の全file（outcome-sections 14 file、design.md、tasklist.md、roadmap.md）で、ownerは60行・63箇所に出る（見本2 fileには既に無い）。同じ語が七つの意味で使われているため、意味ごとに書き直す。同じ文の他の表現（state、gate、handoff等）はここでは変えず、論点10の基準で後から書き直す。「決定済み」は論点4で決めたものである。

##### 1. どのsectionに書くか（sectionの書き分け）

| 箇所 | 今 | 後 |
| --- | --- | --- |
| `README.md`:47 | owner境界だけでなく、既知のprecedenceとtie-break上の位置も | 他sectionとの書き分けだけでなく、既知のprecedenceとtie-break上の位置も |
| `README.md`:51 | 内容のowner分割、共通概念の正本、section選択漏れをdiscussionへ戻す | どのsectionに何を書くかの分け方、共通概念の正本、section選択漏れをdiscussionへ戻す |
| `README.md`:133、146、152、158 | owner境界候補: | 他sectionとの書き分けの候補: |
| `README.md`:141 | 必要な具体case、owner境界、正式名、template | 必要な具体case、他sectionとの書き分け、正式名、template |
| `README.md`:165 | discussionでscopeとownerを決めてから追加する | discussionでscopeと、他sectionとの書き分けを決めてから追加する |
| `catalog.md`:25 | 主ownerとなるsectionへ書き | その内容を主に扱うsectionへ書き（決定済み） |
| `code-structure.md`:38、`data.md`:37、`interaction-flow.md`:27、`screen.md`:37 | owner境界: | このsectionに書くこと・書かないこと:（決定済み） |
| `skill-policy.md`:14 | owner境界: | このsectionに書かないこと:（決定済み） |
| `code-structure.md`:44 | data schema、runtime／deployment条件、security、performanceはそれぞれのownerへ送る。 | data schema、runtime／deployment条件、security、performanceは、それぞれを扱うsectionへ送る。 |
| `file-deliverables.md`:8 | source artifactとruntime contractのownerが曖昧になることを防ぐため。 | source artifactとruntime contractを、どのsectionに書くかが曖昧になることを防ぐため。 |

##### 2. workflowで判断・更新を受け持つ担い手（skill、人）→「担当」

`workflow.md`の中は「担当」に揃える（論点3）。

| 箇所 | 今 | 後 |
| --- | --- | --- |
| `workflow.md`:9 | owner、single writer、正本、gate、停止・再開、handoffを合算して | 担当、single writer、正本、gate、停止・再開、handoffを合算して |
| `workflow.md`:14 | 二つのownerが同じfieldを更新する二重正本や | 二つの担当が同じfieldを更新する二重正本や |
| `workflow.md`:28 | 各ownerについて、行う判断・更新と、行わないことを両方示す。 | 各担当について、行う判断・更新と、行わないことを両方示す。 |
| `workflow.md`:29 | 次ownerへ渡すresultを示す。 | 次の担当へ渡すresultを示す。 |
| `workflow.md`:37 | 同じ判断またはstateを複数ownerが正本として持っていないか。 | 同じ判断またはstateを、複数の担当が正本として持っていないか。 |
| `workflow.md`:40 | **ownerと責務:** | **担当と、受け持つこと:**（決定済み） |
| `workflow.md`:42、44 | \| owner \|、`{owner}` | \| 担当 \|、`{担当}`（決定済み） |
| `workflow.md`:50 | {event / gate / owner} | {きっかけ / 先へ進む条件 / 担当}（決定済み） |
| `workflow.md`:56 | {開始条件、owner、読む正本} | {開始条件、担当、読む正本} |
| `workflow.md`:64 | {停止するowner、維持するstate、再開入口} | {停止する担当、維持するstate、再開入口} |
| `README.md`:111 | # owner、state、gate、handoffも変わる場合だけ | # 担当、state、gate、handoffも変わる場合だけ |
| `README.md`:119 | owner、state、gate、停止・再開、handoffを持つ実行過程 | 担当、state、gate、停止・再開、handoffを持つ実行過程 |
| `catalog.md`:16 | owner、gate、状態、handoffを持つworkflow | 担当、gate、状態、handoffを持つworkflow |
| `catalog.md`:35、36 | owner、state、gate、handoffを設計する（が変わる）`workflow.md` | 担当、state、gate、handoffを設計する（が変わる）`workflow.md` |
| `skill-policy.md`:15 | trigger、入力、owner、state、gate、handoff、停止・再開は`workflow.md`が所有する。 | trigger、入力、担当、state、gate、handoff、停止・再開は`workflow.md`に書く。 |
| `skill-policy.md`:97 | 何をしないかだけでなく、隣接ownerまたは正しい戻り先を示す。 | 何をしないかだけでなく、それを代わりに受け持つ隣のskill、または正しい戻り先を示す。 |
| `interaction-flow.md`:43 | 各stepのownerと、次stepへ渡す値が一意か。 | 各stepを誰（人、server、componentのどれ）が受け持つかと、次stepへ渡す値が一意か。 |
| `documentation.md`:36（記述例） | workflowまたはowner境界を変更した時に | workflowや、skillの間の受け持ちの境目を変えた時に |
| `file-deliverables.md`:16（記述例） | (2) ownerと入力 | (2) 担当と入力 |
| `design.md`:166 | {実行ownerまたは内容をまだ決められない理由} | {誰が行うか、または内容をまだ決められない理由} |
| `tasklist.md`:96、119 | 直接受領したworkflow ownerが | feedbackを直接受け取ったskillが |

##### 3. codeの中でその責務を持つmodule・class・component

| 箇所 | 今 | 後 |
| --- | --- | --- |
| `code-structure.md`:20 | class一覧だけを書き、各ownerが何を行わず | class一覧だけを書き、各classが何を行わず |
| `code-structure.md`:30 | flowとowner境界が読める | flowと、各moduleが受け持つ範囲の境目が読める |
| `code-structure.md`:50 | public entryからresult ownerまで | public entryから結果を返すmoduleまで |
| `code-structure.md`:65 | {隣接ownerへ送る責務} | {隣のmoduleへ送る責務} |
| `code-structure.md`:71 | {Owner A} -> {Owner B} -> {Result owner} | {担当module A} -> {担当module B} -> {結果を返すmodule}（決定済み） |
| `interaction-flow.md`:51 | {serverまたは受信owner} | {serverまたは受け取るcomponent} |

##### 4. 文書を直す人 →「直す人」

| 箇所 | 今 | 後 |
| --- | --- | --- |
| `documentation.md`:14 | source of truth、更新owner、更新triggerがなく腐るsnapshotを防ぐため。 | どれを正として直すか、誰がいつ直すかが決まっておらず、書いた時点では正しかった内容が古くなるのを防ぐため。（論点3の例） |
| `documentation.md`:22 | 更新ownerと腐敗検出条件を決めない | 直す人と、古くなったと気づく条件を決めない |
| `documentation.md`:43 | 正しいsnapshot、single source of truth、更新owner、更新trigger | 正しいsnapshot、single source of truth、直す人、更新trigger |
| `documentation.md`:84、86 | \| 更新owner \|、{owner} | \| 直す人 \|（決定済み）、{直す人} |

##### 5. 記述やfunctionの置き場所 →「担当や置き場所」「新しいdocument」

| 箇所 | 今 | 後 |
| --- | --- | --- |
| `catalog.md`:17、40 | 移動、分割、統合、owner変更、形式置換 | 移動、分割、統合、担当や置き場所の変更、形式の置き換え |
| `documentation.md`:44 | 既存documentへの統合または新owner作成の理由を明示する | 既存documentへ統合するか、新しいdocumentを作るかの理由を明示する |
| `documentation.md`:86 | `{pathまたはowner}` | `{pathまたは、その記述を持つsection}` |
| `documentation.md`:92 | {統合先または新ownerと理由。…} | {統合先、または新しく作るdocumentと理由。…} |

##### 6. secretや状態の管理元

| 箇所 | 今 | 後 |
| --- | --- | --- |
| `runtime-and-configuration.md`:15 | secret値を書かずに、secret ownerと不足時の挙動を合意する | secretの値を書かずに、secretの管理元と不足時の挙動を合意する |
| `runtime-and-configuration.md`:46 | {context / config / secret owner} | {context / config / secretの管理元}（決定済み） |
| `interaction-flow.md`:52 | {repository / external service / state owner} | {repository / external service / 状態を持つcomponent} |

##### 7. 議論の記録先

| 箇所 | 今 | 後 |
| --- | --- | --- |
| `README.md`:135 | discussion owner: `task-design-discussion.md`の論点25。 | 議論の記録先: このplugin repositoryの`.steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/task-design-discussion.md`の論点25。 |

今の記述はどのsteeringの記録かが書かれておらず、同名の論点25が別のsteeringにもある。内容が一致する記録を具体的に書く。

##### 残すもの

- `workflow.md`:6「roadmap-design.md「Field ownership」」。`roadmap-design.md`に実在する見出し名を引いており、識別子として残す。

#### 検討記録（論点11・イテレーション0）

論点10で見本の書き方を基準にすると決め、ownerだけはテンプレートの全fileで全箇所を洗い出すよう求められた。

`task-design/templates/`配下を`grep -rni "owner"`で抜き出すと、60行・63箇所に出た（見本2 fileには既に無い）。前後を読むと、ownerは七つの意味で使われていた。どのsectionに書くか（16行）、workflowの担い手（24行）、codeの責務を持つmodule等（6行）、文書を直す人（5行）、置き場所（5行）、管理元（3行）、議論の記録先（1行）、実在する見出し名の引用（1行）である。`documentation.md`86行は「直す人」と「置き場所」の両方を含む。論点3で一語一訳をやめ、箇所ごとに言いたいことを書くと決めた理由が、ここでも確かめられる。

`workflow.md`の中は「担当」に揃えた。workflowの担い手を指す語が他のfile（README、catalog、skill-policy）にも出るため、そこも「担当」にした。

`README.md`135行の議論の記録先は、どのsteeringの記録かが書かれていなかった。`.steering`配下で「## 論点25」を検索すると二つの記録に当たり、内容（domainの概念化・語彙・境界を拘束する方針section）が一致するのは`20260808-focus-tasklists-on-staged-implementation`の記録だった。書き直しに合わせて具体的に書く。

同じ文の他の表現（state、gate、handoff、single source of truth等）は、ここでは変えない。ownerだけの判断として合意を取り、他の表現は論点10の基準で後から書き直す。

[内部検討記録: 論点11・イテレーション0](internal-records/task-design-discussion.md.topic-11.md#iteration-0)

#### 提案0へのフィードバック（論点11）

**結果:** 合意（PR https://github.com/tumeda1992/ai_agent_dev_skill_plugin/pull/19 で60行を確認したうえでの合意。同じ応答で、見本2 fileの書き直し方針にも改めて合意）

> 60行全部見た。これでいい。そして代表例2個の修正方針も合意

### 決定（論点11）

`task-design/templates/`配下のownerを、[提案0（論点11）](#提案0論点11)の表のとおり、意味ごとに書き直す。

- どのsectionに書くか: 「他sectionとの書き分け」「このsectionに書くこと・書かないこと」「それを扱うsection」等
- workflowで判断・更新を受け持つ担い手: 「担当」。`workflow.md`の中は「担当」に揃え、他のfileでworkflowの担い手を指す箇所も「担当」にする。`tasklist.md`の「直接受領したworkflow owner」は「feedbackを直接受け取ったskill」
- codeの中で責務を持つ部品: 「class」「module」「component」と具体的に書く
- 文書を直す人: 「直す人」
- 置き場所: 「担当や置き場所の変更」「新しいdocument」
- 管理元: 「secretの管理元」「状態を持つcomponent」
- 議論の記録先: 「議論の記録先」とし、`README.md`135行は`.steering/2026/202608/20260808-focus-tasklists-on-staged-implementation/task-design-discussion.md`の論点25と具体的に書く

`workflow.md`6行の「roadmap-design.md「Field ownership」」は、実在する見出し名の引用なので残す。同じ文のowner以外の表現は、論点10の基準（見本2 fileの書き方）で書き直す。

### 現在の変更（論点11）

決定どおり、`task-design/templates/`配下のownerを意味ごとに書き直した。残るのは`workflow.md`の移行元の「roadmap-design.md「Field ownership」」（実在する見出し名の引用）だけである。反映は論点9の現在の変更と同じcommitの範囲にあり、全体の差分のreviewで合意を得た（「全部ok」）。未解決は無い。
