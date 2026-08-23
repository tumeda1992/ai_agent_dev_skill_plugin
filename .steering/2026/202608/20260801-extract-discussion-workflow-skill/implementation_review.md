# 議論記録

このfileは、`facilitate-discussion` skill切り出し実装後のreview feedbackを、decision scopeごとに分解して合意するための議論記録である。

## 論点1: workflow記述の構造不足を標準化とskill再構成へ分解する

**ステータス:** 分解済み

**種別:** レビュー指摘

**起点となった原文:**
> plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md について、見出し1~8が貧弱。いろんなトピックがないまぜになっている。守ることが何かとか手順が何かとか、しかもそれは順番に意図もなく、思いつきで羅列されているだけ。手順はめっちゃ大事だし、ファイル作ったときの手順と、論点作るときの手順と、イテレーション追記するときの手順。手順だけでなく、その手順であるステップを行っていいのかという判断基準とか（これは紋切り型にすべてのステップに必要なわけではないが）色々分けて構造化されて書かれるはずだよ。 まず、このことについて毎回指摘したくないから plugins/tumeda-dev/docs/documentation_standards/how_to_write_workflow.md として書こうか。手順について書くのは手順としてわかる見出しの中だし、手順にバリエーションがあったり階層があるなら階層で表現する。思想があるなら、それは手順として独立して書く。思想なのか意図なのか目的なのかさだまらないけど。アンチパターンは思想にも書かれるかもだし手順の中のステップの中に書かれるかもだし、毎回書かれるわけでもない。各ステップの記法は独立しており、出来上がったものについて、並列される階層が意図していないのに全く同じ形式、箇条書きの数が同じとかだったら臭い感じがするなども。テンプレートではなくhowについての思想を書くファイル。

**提起の背景:** 新skillは必要な個別ルールを含んでいるが、file解決、状態読取、scope判定、routing、親子validation、新規論点作成、iteration、決定を一つの番号列へ並べた。その結果、読者は「今どの手順を実行しているか」「どの規則が全手順へ効くか」「次のstepへ進んでよい条件は何か」を見出しから判別できない。

### 現在の合意対象

**参照する現在案:** 論点2の提案4、論点3の提案0、論点4の提案2

**今回確認すること:** workflow記述標準、表現記法、`facilitate-discussion/SKILL.md`のstate階層はすべて決定済みであり、parentが分解したdecisionは解消した。

### 議論の変遷

#### 事象の記述

- 現行`SKILL.md`の見出し1〜8は、workflow全体の時系列に見える一方、procedure、invariant、validation、file形式、routing規則を同じ階層へ混在させている。
- file新規作成、新規論点作成、同一論点へのiteration追記は、開始状態も目的も完了条件も異なる独立procedureだが、一つの連続手順として読める構造になっている。
- 各内容を番号付き見出しへ収めたことで、内容の意味から階層を作らず、項目が存在する順に並べた構造になった。

#### 原因の追跡

- なぜ: 必要事項を漏らさないことを優先し、情報の役割とprocedureの境界を設計しなかった。
- なぜ: workflow文書を「ruleの集合」ではなく「開始条件・状態遷移・分岐・完了条件を持つ実行可能な構造」として書くrepository標準がなかった。
- なぜ: 既存の`information_structuring.md`はナレッジ全体の配置、`expression_notation.md`は局所的な記法を扱うが、workflow固有のprocedure分割と進行gateを正本化していなかった。

#### 根本原因0 + 提案0

- **根本原因0**: workflow文書のsemantic role、独立procedure、進行判断を構造へ反映する標準がなく、内容を思いついた順のflatな番号列へ収めても完成と判定できた。
- **提案0（現時点）**:
  - 総論: 一回の局所修正で終わらせず、workflow記述のhowを先に標準化し、その標準から現行skillの構造を導き直す。
  - 各論:
    - 先行decision: 論点2で`how_to_write_workflow.md`の目的、概念区分、procedure設計、記法、review観点を合意する。
    - 後続decision: 論点2の決定を入力に、現行skillをfile準備、新規論点、iteration、決定・再開等のprocedureへ再構成する。既存見出し1〜8の名前変更や並べ替えだけでは済ませない。
    - 親子関係: 論点1をreview feedbackの分解を所有するparentとし、標準作成とskill再構成を別child decisionとして扱う。

##### 検証

- **観点**: 標準化を先に行えば、現行skillだけでなく今後のworkflow文書にも同じ指摘を繰り返さずに済む。
- **弱点**: 標準が抽象論または固定templateになると、現行skillを再構成する際の判断に使えない。論点2では、固定見出しを配るのでなく、どの意味をどの階層へ置くかの判断基準まで決める必要がある。

**決定:** 標準作成を先に、skill再構成を後に行う分解を採用した。論点2・3で`how_to_write_workflow.md`の内容と表現記法は採用済み。後続のskill再構成を論点4へ分ける。

**ネクストアクション:** なし。論点2〜4のdecisionはすべて採用済みで、論点4のbehavior smokeも成功した。

## 論点2: workflow文書のhowを何として標準化するか

**ステータス:** 分解済み

**親論点:** 論点1

**種別:** レビュー指摘

**提起の背景:** workflow文書は、守るべき契約、処理の順序、分岐判断、成果物の形式、設計理由を同時に含みうる。これらを固定templateの同じslotへ押し込まず、意味に応じて構造化するための判断基準が必要である。

### 現在の合意対象

**参照する現在案:** イテレーション4の提案4

**今回確認すること:** `scope tree`を配置の主軸として維持しながら、目的・成果、設計意図、不変条件・契約、gate、action・状態遷移、validation・アンチパターンを各scope内で区別する第二の軸として、定義・判断基準・配置原則を十分な厚さで復元すること。

### 議論の変遷

#### 事象の記述

- 手順である内容が「手順」と分かる見出しに置かれておらず、規則やvalidationと同じ番号列に混ざると、読者は実行順を復元しなければならない。
- 異なる開始状態と成果を持つ複数procedureを一続きにすると、途中から使う読者がどこへ入るべきか判断できない。
- すべてのstepへ同じ小見出しや同数の箇条書きを割り当てると、内容の意味ではなく外形の対称性が構造を支配する。

#### 原因の追跡

- なぜ: 「workflowに何を書くか」と「workflowをどう実行するか」と「なぜそのflowなのか」を分ける語彙がなかった。
- なぜ: 順序がある内容を番号付きにすればprocedureになると扱い、stepへ入る条件、状態遷移、完了条件を構造上の要素として見ていなかった。
- なぜ: 文書全体を一つのformatへ揃えることを整然さと誤認し、各sectionの意味関係に合う局所記法を独立に選ばなかった。

#### 根本原因0 + 提案0

- **根本原因0**: workflow文書を構成する情報のsemantic roleと、procedureを分ける境界・進行gate・階層の導出規則が定義されていない。
- **提案0（現時点）**:
  - 総論: `how_to_write_workflow.md`は、workflowの完成形を模写させるtemplateではなく、書き手が内容の意味から構造、順序、階層、記法を導くための設計原則とreview方法を書く。
  - 各論:
    - **この標準の対象**: 人またはagentが、ある開始状態から判断と操作を経て成果へ到達するために読むworkflow文書を対象にする。特定skill、特定成果物、Markdownの固定outlineは対象にしない。
    - **品質目標**: 読者が見出し階層だけを追っても、何を達成するworkflowか、どのprocedureを選ぶか、どの順序で進むか、どこで止まるかを把握できる状態を目指す。
    - **情報の役割を区別する**:
      - `目的`: workflowが達成する結果を示す。個々のstepの理由ではない。
      - `設計意図`: なぜそのprocedure境界、順序、分岐にしたかと、どの失敗を防ぐかを説明する。step列へ混ぜず、該当procedureまたは文書全体から独立して読める位置へ置く。
      - `不変条件・契約`: procedureの途中でも常に守ること。効く範囲の最上位へ置き、偶然近いstepの補足に埋めない。
      - `開始条件・判断基準`: procedure、phase、分岐、stepを実行してよいかを決めるgate。すべてのstepへ紋切り型に付けず、誤った進行が起きうる箇所だけで、対象actionより前に置く。
      - `手順`: 実際に状態を変えるactionを実行順で示す。番号を入れ替えると結果が変わるものだけを番号付きにする。
      - `完了条件・成果`: procedureを抜けてよい状態と、後続へ渡すものを示す。
      - これらは固定見出し一覧ではない。実在する役割だけを、その内容に合う名前と階層で表現する。空のslotを埋めるために見出しを作らない。
    - **独立procedureを先に分ける**:
      - 開始状態、起動trigger、主たる成果、再実行の意味のいずれかが異なるflowは、原則として別procedure候補にする。
      - たとえばdiscussion workflowでは、fileを初めて用意する手順、新規論点を作る手順、同じ論点へiterationを追加する手順、決定済み論点を再開する手順を一つの番号列にしない。
      - 文書冒頭ではprocedure間の全体flowを短く示し、各procedureの詳細は`〜する手順`と分かる見出しへ分ける。
    - **procedure内の階層とvariantを表す**:
      - 一つのprocedureがphaseを持つなら、procedure見出しの下にphaseを実行順で置く。phase内部のstepはその配下へ置く。
      - 共通flowとvariantがある場合は、共通部分を一度だけ書き、分岐条件の後にvariantを兄弟見出しとして分ける。variantの中にさらに階層があるなら見出しも入れ子にする。
      - parentとchild、通常flowと例外flow、procedureと単なる補足を同じ階層へ並べない。
    - **stepは局所的な状態遷移として書く**:
      - 各stepの核は、一つのactionと、そのaction後に成立する状態である。一つの番号へ複数procedureや無関係なruleを詰めない。
      - 誤実行の可能性があるstepには、必要な前提、実行可否の判断、失敗時の停止または戻り先を隣接して書く。
      - ある条件が複数stepへ効くなら各stepへ複製せず、共通phaseまたはprocedureのruleへ引き上げる。
    - **各sectionの記法は独立に選ぶ**:
      - sequenceは番号付き箇条書き、同格のruleは箇条書き、規則的な条件と結果は決定表、分岐や状態遷移は図、理由と機微は散文を第一候補にする。詳細な選択基準は`expression_notation.md`を参照し、この標準へ複製しない。
      - 隣接sectionだから同じformatに揃えるのではなく、そのsection内の情報関係に最も合う記法を選ぶ。
    - **アンチパターンは必要な場所にだけ置く**:
      - 文書全体へ効く失敗は設計原則またはreview観点で扱う。特定procedureやstepでだけ起きる失敗は、その判断・actionの近くに置く。
      - 全sectionへ`アンチパターン`、`弱点`、`例`を同じ数だけ配置する規則は作らない。失敗を防ぐ効果がある場合だけ書く。
    - **外形の対称性をsmellとしてreviewする**:
      - 意味の異なる兄弟sectionが全く同じ小見出し、同じ箇条書き数、同じ文型を持つ場合、内容からでなくtemplateから構造を作った疑いがある。
      - 対称性自体を禁止しない。同じsemantic roleを持つcaseやvariantなら同じformatは比較可能性を高める。問題は、同格でないものまで理由なく揃っていること。
      - 並列された見出しは本当に同じ意味levelか、番号付きstepは本当に順序依存か、gateはactionより前か、共通ruleが局所stepへ重複していないかをreviewする。
    - **二つの具体で標準を検算する**:
      - 現文脈: `facilitate-discussion`をfile準備、新規論点、iteration、決定・再開の独立procedureへ分けられるか確認する。
      - 別文脈: release workflowを初回release、通常release、rollbackの独立procedureへ分け、共通検証と各variant固有stepを階層化できるか確認する。
    - **既存標準との境界**: `information_structuring.md`は情報の配置と理解の階層、`expression_notation.md`は局所記法、`core_readers.md`は必要な深さを担う。新標準はworkflow固有のprocedure境界、実行順、進行gate、完了条件を担う。
    - **実装時の更新先**: 上記内容で`how_to_write_workflow.md`を新規作成し、`documentation_standards/README.md`へ一行の索引と既存標準との役割差を追加する。

##### 検証

- **観点**: 現行skillの問題であるprocedure混在、判断基準の後置、ruleとstepの混同、理由のないformat統一を、単なる見出し変更ではなく構造判断として検出できる。
- **観点**: semantic roleを区別しつつ固定slotにしないため、workflowごとに必要なsectionだけを設計できる。
- **弱点**: semantic roleの一覧がそのまま必須outlineとして模写される可能性がある。各roleは分類語彙であって固定見出しでないこと、空slotを作らないこと、同形が比較可能性を生む場合だけ揃えることを本文で強調する必要がある。
- **弱点**: 局所記法を詳述しすぎると`expression_notation.md`と二重正本になる。新標準ではworkflowへの当てはめと参照だけに留める。

#### イテレーション1

**受領したfeedback:**
> 一旦作ってみて

##### 検証

- **観点**: 抽象的なoutlineの往復を続けるより、実際の標準本文で階層、文章量、局所記法を確認する方が、template化していないかを具体的に評価できる。
- **弱点**: 初稿作成の承認を標準内容への最終合意と扱うと、実物へのfeedbackを受ける前にdecisionを閉じてしまう。

##### 論点routingの判断

- **discussion scopeへ属する理由**: 初稿を作るかどうかは、workflow記述標準の内容をどの粒度で評価するかを変えるため、論点2のdecisionに直接属する。
- **同一decision scopeとしてiterationを継続する理由**: 新しい標準テーマではなく、提案0を抽象案のまま決めず、実物へ具体化して評価する進め方への変更である。

##### 修正先の判断

- **提案levelへの遡及**: 標準の責務区分は維持し、合意方法をoutline確認から初稿の実物確認へ変更する。

##### 根本原因1 + 提案1

- **根本原因1**: workflow記述標準は構造そのものを扱うため、outlineだけでは固定template化、階層の自然さ、記法の局所性を十分に検証できない。
- **変更点**: 提案内容を先に最終決定せず、書き手自身のworkflowを含む初稿へ具体化してからreviewする。
- **提案1（現時点）**:
  - 総論: 提案0の思想を`how_to_write_workflow.md`の初稿へ具体化し、そのfileを次の合意対象にする。初稿作成は承認済み、標準内容は未決のまま維持する。
  - 各論:
    - 標準の位置づけ、品質目標、semantic roleの区別を定義する。ただしrole一覧を固定outlineとして使わないことを明記する。
    - workflow文書を書く側のprocedureを、目的と開始状態の確定、素材の分類、独立procedureの分割、phase・variant・gateの設計、局所記法の選択、実行simulationによるreviewの順で示す。この順序は外形を整える前に意味構造を決める意図を持つ。
    - workflow本文側では、file準備、新規論点、iterationのように開始状態・trigger・成果が異なるflowを独立procedureへ分ける判断基準を書く。
    - 設計意図、不変条件、判断基準、完了条件の置き場所を、効くscopeとactionとの前後関係から決める。
    - 局所記法は`expression_notation.md`へ委譲し、workflow固有の当てはめだけを書く。
    - 理由のない同形、同数の箇条書き、同格でない兄弟見出し、順序非依存の番号列をreview smellとして書く。
    - discussion workflowとrelease workflowの二つで原則を検算する。
    - `documentation_standards/README.md`へ新標準の索引を追加する。

#### イテレーション2

**受領したfeedback:**
> 「2. 素材をaction・判断・rule・理由・成果へ分ける」の「分類に迷う情報は、実行時に読み手が何のために参照するかで決める。たとえば「fileを全体読取する」はactionだが、「既存historyを壊さないため」は設計意図、「同じ論点番号が重複していれば停止する」は進行gateである。一つのstepへ三つを一文で詰めない。」について、特定のステップに属するルールや意図がある場合ももちろんある。トップレベルで分類してしまうと特定の条件の時の意図とかが意味抜きされたり分散する。トップレベルに置くものは全体に通底するもの。「discussion workflowへ適用する」だけど、discussionについてのトピックじゃない。skillが内部にワークフローを内包する可能性があり、今回はそれに当てはまるのに、手順も意図も区別せずに書かれているのが気に食わなかった

##### 検証

- **観点**: action、判断、rule、意図をrole別に区別すること自体は、同じ文中で混同しないために有効である。
- **弱点**: roleだけを分類軸にすると、特定stepでのみ成立するruleや意図を元のprocedureから引き剥がし、文書top-levelのrule集・意図集へ分散させる。読み手は実行時に再び関連情報を集め直さなければならない。
- **弱点**: `discussion workflow`という名前は、標準の対象をdiscussion固有のworkflowと誤読させる。今回の具体事象は、skillという成果物が内部に複数procedureを持つのに、手順・意図・ruleのscopeを区別せずflatに書いたことである。

##### 論点routingの判断

- **discussion scopeへ属する理由**: どの情報をどの階層へ置くかと、標準の具体例が何を例示するかは、`how_to_write_workflow.md`の構造判断を直接変更する。
- **同一decision scopeとしてiterationを継続する理由**: 新しい標準を追加する話ではなく、論点2の初稿がsemantic roleの区別をplacementの分離へ誤変換した点と、検算例の主語を誤った点の修正である。

##### 修正先の判断

- **診断levelへの遡及**: 「roleを区別する」と「role別のtop-level sectionへ配置する」を同一視した原因診断を改める。placementはroleだけでなく、その情報が効くscopeと、実行時に一緒に参照する文脈から決める。

##### 根本原因2 + 提案2

- **根本原因2**: 素材のsemantic roleを診断することを、素材をrole別の箱へ物理的に分けることとして書いた。情報が`workflow全体 / procedure / phase / variant / step / branch`のどこに属するかという所有scopeを同時に保持していなかった。また、具体例をworkflowの題材名で命名し、workflowを内包する成果物の構造問題として抽象化できていなかった。
- **変更点**: role分類をplacementから切り離し、各素材を`役割 + 所属scope + 一緒に参照する文脈`で診断する。discussion固有の例を、workflowを内包するskillの例へ置き換える。
- **提案2（現時点）**:
  - 総論: workflowの構造軸は、role別のtop-level分類ではなく、読み手が実行するprocedureとその階層に置く。action、rule、意図、gateのroleは混同を防ぐために区別するが、局所的に結びつく情報は同じprocedure・phase・stepの近傍に保つ。
  - 各論:
    - `2. 素材をaction・判断・rule・理由・成果へ分ける`は、`素材ごとに役割と所属scopeを見極める`へ改める。素材をrole別の箱へ移すstepではなく、後続のplacement判断に必要な属性を保持するstepとして書く。
    - 各素材について、`何のために参照するか`に加え、`workflow全体、procedure、phase、variant、step、branchのどこでのみ成立するか`と、`どのactionまたは判断と一緒に読まれないと意味を失うか`を確認する。
    - top-levelへ置くのはworkflow全体に通底する目的、設計意図、不変条件、入口だけにする。特定procedureへ効くruleはprocedure、特定variantへ効く意図はvariant、特定stepまたはbranchへ効くrule・意図・gateはその局所へ置く。
    - 一つのstepにaction、局所意図、局所rule、gateが属してよい。それぞれを一文へ圧縮して混同することは避けるが、roleが違うという理由だけで別のtop-level sectionへ分散させない。stepの配下または隣接箇所で関係を保ったまま構造的に区別する。
    - `目的と設計意図`の説明は、設計意図を一律にstep列の外へ出す表現をやめる。全体へ通底する意図はtop-level、procedure境界の意図はprocedure冒頭、特定step・条件の意図はそのactionやgateの近くへ置くと書く。
    - `不変条件は効く最小の共通scopeへ置く`という原則を、role分類時点から一貫して使う。scopeを狭くして意味を欠く場合も、広げて無関係なflowへ適用する場合も誤りとする。
    - `discussion workflowへ適用する`は`workflowを内包するskillへ適用する`へ変更する。`facilitate-discussion`を題材に、skill内にfile準備、新規論点作成、iteration、決定・再開という複数procedureがあり、各procedure固有の意図・rule・gateを区別せずflatに並べたことが問題だったと説明する。
    - releaseの例は別文脈の検算として残し、標準がskill専用にならないことを確認する。

#### イテレーション3

**受領したfeedback:**
> 「「discussion workflowへ適用する」は「workflowを内包するskillへ適用する」へ変更する」というより、このワークフロードキュメントの対象が何かについて書かれれば元々の付記も不要になる。それ以外も、今の構造や手順をを前提にこまいところだけ弥縫策として修正しているけど、トップレベルに目的だの手順だの意図だのがあって、通底するものの分類は行うけど、その後は大抵手順の話になって、その手順やステップ固有の意図やアンチパターンがあってって順番に再構成されるんじゃない？

##### 検証

- **観点**: workflowを内包する成果物を具体例として追加すれば、今回のskillにも標準を当てはめられることは示せる。
- **弱点**: 対象定義が不足したまま応用例で補うと、別の成果物が現れるたびに「〜へ適用する」sectionを追加することになる。標準の抽象範囲を例の列挙で代替している。
- **弱点**: step 2の文言や例の見出しだけを変更しても、現行初稿はsemantic roleのtop-level分類と8stepのauthoring flowを骨格として残す。procedureを主軸にscopeを下る構造にはならない。

##### 論点routingの判断

- **discussion scopeへ属する理由**: 初稿全体をどの軸で構成するかと、標準の対象範囲をどこで定義するかは、論点2のworkflow記述標準そのものを規定する。
- **同一decision scopeとしてiterationを継続する理由**: 新しい標準テーマではなく、提案2が初稿の骨格を温存したため、同じ標準案を構造levelから再提案するfeedbackである。

##### 修正先の判断

- **診断levelへの遡及**: 現行sectionを前提に問題箇所を直すのではなく、workflow文書で読み手が辿る主軸はprocedureであり、情報は全体から局所へscopeを下りながらprocedureの近くへ配置される、という構造原則から初稿を組み直す。

##### 根本原因3 + 提案3

- **根本原因3**: 標準の対象を「workflowという独立した種類の文書」に狭く捉え、skill等の成果物内部にworkflowが存在する場合を応用例で補おうとした。また、workflowの主軸をprocedureでなく情報roleと執筆stepの一覧に置いたため、全体へ通底する情報と局所情報をscope階層で自然に配置できなかった。
- **変更点**: 初稿を部分修正せず、対象定義と`workflow全体 → procedure → phase・variant → step・branch`のscope treeから全面的に再構成する。専用の応用例sectionと現行8stepは撤去する。
- **提案3（現時点）**:
  - 総論: `how_to_write_workflow.md`は、workflowを独立文書の種類としてではなく、skill、runbook、README、標準等の任意の成果物内に存在しうる「読み手が判断とactionを順に実行して状態を変える記述」として定義する。標準本文は、全体に通底する情報を先に置き、その後をprocedure主軸で局所scopeへ下る順に組む。
  - 各論:
    - **対象を冒頭で閉じる**: workflowを含むfile全体だけでなく、file内の一sectionも対象になると定義する。成果物の名前や題材は対象判定に使わず、開始状態、判断、順序付きaction、状態遷移、完了状態を持つ記述かで判定する。これにより`〜へ適用する`という成果物別の付記は不要にする。
    - **構造原則をscope treeとして示す**: 情報role別の箱ではなく、`workflow全体 → procedure → phase・variant → step・branch`を構造の主軸にする。purpose、意図、rule、gate、アンチパターンは独立した全体分類ではなく、それぞれが効くscopeの情報として配置する。
    - **workflow全体の情報を書く**: top-levelには、workflow全体の目的と成果、全体の設計意図、全procedureへ通底する不変条件、procedure間の地図と入口判断だけを置く。局所的なruleや意図をtop-levelへ昇格させない。
    - **procedureを主役として書く**: 全体情報の後は、読み手が実際に選択・実行するprocedureを並べる。開始状態、trigger、成果、再実行の意味が異なるflowを別procedureへ分ける。各procedureの冒頭には、そのprocedure固有の目的、設計意図、開始条件、完了条件、不変条件を必要な分だけ置く。
    - **phaseとvariantへscopeを下げる**: procedure内部で複数の状態変化をまとめる必要があればphaseを作る。条件でflowが変わるなら共通部分の後にvariantを置き、そのvariantだけへ効く意図、rule、アンチパターンをvariant内へ置く。
    - **stepとbranchの局所情報を書く**: stepにはactionとaction後の状態を核として置く。そのstepでだけ必要なgate、rule、設計意図、validation、アンチパターンはstepまたはbranchの近くに置く。roleが違っても、同時に読まれないと意味を失う情報は同じ局所scopeに保つ。
    - **role分類は配置後の補助診断に下げる**: purpose、意図、rule、gate、action、成果という語彙は、同じ文へ異なる意味を混ぜていないかを確認するために使う。書き始めにrole別bucketへ素材を分けるprocedureは置かない。
    - **標準本文の新しい流れ**: `対象と目的` → `全体から局所へscopeを下る原則` → `workflow全体を書く` → `procedureを書く` → `phase・variantを書く` → `step・branchを書く` → `workflow記述を組み立てる手順` → `構造をreviewする`の順に全面書換えする。
    - **書く側の手順もscope順にする**: 現行8stepは撤去し、workflow対象と全体目的を確定する、procedure境界を導く、各procedureをphase・variant・stepへ展開する、各scopeへ意図・rule・gateを配置する、局所記法を選びsimulationでreviewする、という少数のphaseへ再構成する。
    - **アンチパターンを独立した必須分類にしない**: 全体構造のsmellはreviewへ、procedure固有の誤選択はprocedureの入口へ、step固有の誤操作はstepの近くへ置く。全アンチパターンを集めるtop-level sectionは作らない。
    - **応用例sectionを撤去する**: `discussion workflowへ適用する`、そのrename案、`release workflowへ適用する`を削除する。必要な具体は、対象定義やprocedure境界等の該当原則を理解するための局所例としてだけ置く。

#### イテレーション4

**受領したfeedback:**
> え、トップレベルの意図とか目的とか不変条件の記述なくなった？ gateも消えたし。すごく陳腐化したね

##### 検証

- **観点**: 全面書換え後の本文にも`目的`、`設計意図`、`不変条件`、`gate`という語と局所配置への言及は残っている。
- **弱点**: 語が残っているだけで、それぞれが何を表し、何と区別し、どの条件でどのscopeへ置き、どの失敗を防ぐかという標準としての説明が失われた。読み手はroleの意味と使い方を別途推測しなければならず、実質的には削除と同じである。
- **弱点**: `gate`を`step・branchを書く`のaction直前へほぼ限定し、workflowの入口、procedure開始、phase進行、完了判定を制御するgateを体系として説明しなくなった。
- **弱点**: scope treeを主軸にすること自体は局所情報の分散を防ぐが、scope内で異なる働きを持つ情報を区別する第二の軸がなければ、手順・rule・理由が再び同じ散文へ混ざる。これは元のreview指摘を別の形で再発させる。

##### 論点routingの判断

- **discussion scopeへ属する理由**: semantic roleの説明を標準へどの厚さで持たせるかは、`how_to_write_workflow.md`を実際に使ってworkflowを構造化できるかを直接変える。
- **同一decision scopeとしてiterationを継続する理由**: scope treeを撤回する別案ではなく、論点2の全面書換えが失ったsemantic dimensionを復元し、同じ標準案を成立させる修正である。

##### 修正先の判断

- **診断levelへの遡及**: `scope tree`とsemantic roleを競合する構造軸として扱った診断を改める。scopeは情報の所有・配置を決める主軸であり、semantic roleは各scope内で情報の働きを区別する直交軸である。role別bucketを禁止することは、roleの定義や判断基準を削ることを意味しない。

##### 根本原因4 + 提案4

- **根本原因4**: 「role別に素材をtop-levelへ分散させない」という指摘を、「roleは配置後の軽い診断語彙に留める」と過剰一般化した。その結果、旧稿にあった目的と設計意図の差、不変条件の適用範囲、gateが制御する遷移、actionと完了条件の差という実行判断を支える知識まで削った。
- **変更点**: scope treeを構造の主軸として残しつつ、各scopeの内部に現れるsemantic roleを十分に定義する第二の軸を復元する。旧稿のsectionをそのまま戻すのではなく、role別のtop-level配置と誤読されない構造へ組み込む。
- **提案4（現時点）**:
  - 総論: workflow記述は`scope × semantic role`の二軸で設計する。`workflow全体 → procedure → phase・variant → step・branch`が情報の所有範囲を決め、目的、成果、設計意図、不変条件・契約、gate、action・状態遷移、validation・アンチパターンが、そのscope内で情報が何を担うかを決める。
  - 各論:
    - **roleの説明を独立して復元する**: scope treeの原則直後に、`各scope内で情報の働きを区別する`sectionを置く。これはworkflow成果物へ同名の見出しを要求するtemplateではなく、書き手が情報を混同しないための概念定義と判断基準である。
    - **目的と成果**: `目的`は対象scopeが何を成立させるために存在するか、`成果・完了状態`はそのscopeを抜けてよいと外から確認できる状態と定義する。workflow全体だけでなくprocedureやphaseにも存在しうるが、実在する場合だけ該当scopeへ置く。最後のactionを成果と取り違えない基準を戻す。
    - **設計意図**: なぜそのscope境界、順序、分岐、actionを選び、どの失敗を防ぐかを説明する情報と定義する。全体の構造理由はworkflow全体、procedure境界の理由はprocedure、variantを選ぶ理由はvariant、局所actionの理由はstepへ置く。手順ではないから離すのでも、局所だからactionと一文へ潰すのでもなく、効くscope内で構造的に区別する。
    - **不変条件・契約**: 一連のaction中に継続して成立させるruleと定義する。効く全actionを覆える最小の共通scopeへ一度だけ置く。局所ruleの不当な全体化と、横断ruleのstepごとの複製を両方誤りとして説明する。
    - **gateを体系として復元する**: gateはworkflow、procedure、phase、step、branchへ入る、進む、分岐する、または抜ける可否を決める条件と定義する。何を観測するか、条件、条件ごとの遷移先、判断不能時の扱いを持ち、制御対象より前に置く。危険、選択、情報不足、既存状態依存がある箇所で明示し、全stepへ固定fieldとして付けない。
    - **action・状態遷移**: actionは実際に状態を変える操作、stepは一つのactionとその後の状態を核にする。順序を入れ替えると結果が変わるものだけをprocedureの番号列に置き、順不同のruleや観点を手順に見せない。
    - **validation・アンチパターン**: validationはgateまたは完了状態を観測する具体的方法として制御対象の近くへ置く。アンチパターンは失敗が生じるscopeへ置き、全体構造のsmellだけをreviewで扱う。独立した必須slotにはしないが、知識自体は省略しない。
    - **workflow全体の説明を厚く戻す**: `workflow全体を書く`では、全体の目的と成果、全体構造の設計意図、全procedureへ通底する不変条件、procedureの地図、入口と完了のgateをそれぞれ明示的に扱う。局所roleをtop-levelへ引き上げない条件も併記する。
    - **下位scopeでもroleを明示する**: `procedureを書く`、`phase・variantを書く`、`step・branchを書く`は手順だけを説明せず、そのscope固有の目的・意図・不変条件・gate・成果がどのとき必要かを扱う。すべてのscopeに同じfieldを要求せず、必要性と配置判断を説明する。
    - **書く側の手順を二軸に直す**: roleを最初にtop-level bucketへ分類せず、scope境界を導いた後、各scopeの内部でroleを区別し、actionや判断との関係を保って配置する。最後のreviewではscope漏れとrole混同を別々に検査する。
    - **旧稿から保持する厚み**: 目的と設計意図の差、全体意図と局所意図の差、不変条件の最小共通scope、gateを明示すべき条件、条件ごとの遷移先、actionと完了条件の差、番号入替え検査を、定義と判断基準として復元する。

##### 検証

- **観点**: scopeを主軸に保つため、特定stepの意図やruleをrole別のtop-level章へ分散させる問題は再発しない。
- **観点**: semantic roleを第二の軸として十分に説明するため、procedure内で手順・rule・理由・gateが同じ散文へ混ざる問題も検出できる。
- **弱点**: role説明を復元すると、そのsectionを成果物の固定outlineとして模写される危険が戻る。各roleの冒頭で「見出し候補ではなく、各scope内の情報を見分ける判断語彙」であることを明記し、scopeごとのsectionでは必要なroleだけを書く条件を示す必要がある。
- **弱点**: roleの定義とscope別の説明を両方詳述すると重複しうる。role sectionは意味と共通判断基準を正本とし、scope sectionはそのscope固有のplacementと相互関係だけを扱う。

**決定:** イテレーション4の提案4を採用し、`scope × semantic role`の二軸で`how_to_write_workflow.md`へ反映した。子論点3の表現設計も反映した標準本文をユーザーが確認し、採用した。

**ネクストアクション:** なし。標準を`facilitate-discussion/SKILL.md`へ適用するdecisionは親論点1の子論点4で扱う。

## 論点3: workflow記述標準自身の表現記法を再設計する

**ステータス:** 決定済み

**親論点:** 論点2

**種別:** レビュー指摘

**提起の背景:** `how_to_write_workflow.md`はsectionごとに関係へ合う記法を選ぶよう要求する標準であるにもかかわらず、自身のscope階層、判断対応、sequence、並列観点を長い散文へ流している。読み手が頭の中で図、表、箇条書きへ再構築しなければならず、参照先の`expression_notation.md`を標準自身へ適用できていない。

### 現在の合意対象

**参照する現在案:** 根本原因0 + 提案0

**今回確認すること:** `how_to_write_workflow.md`を一つの記法へ統一せず、情報piece間の関係ごとにmermaid、表、箇条書き、番号付き手順、散文を選び直すこと。特にscope tree、procedureとvariantの境界、gateが制御する遷移、執筆sequence、並列review観点を散文の壁から取り出す。

### 議論の変遷

#### 事象の記述

- scopeの包含関係をASCIIのcode blockで示したが、mermaidで表せない理由はない。
- procedureとvariantの切分け、gateの観測・条件・遷移先、執筆phaseの順序を複数段落の散文へ埋めた。
- 同格であるreview観点を箇条書きや小見出しへせず、太字で始まる段落として直列に並べた。
- semantic roleとscopeの関係を散文だけで説明し、本文の地図となる一覧を作らなかった。

#### 原因の追跡

- なぜ: 「固定templateにしない」「局所文脈を分散させない」を優先し、視認性を上げる図・表・箇条書きまで外形の押付けとして避けた。
- なぜ: 文書全体の目的である「workflowを説明する」を散文へ結び付け、内部にある包含、flow、規則的対応、並列という異なる関係をpieceへ分解しなかった。
- なぜ: `expression_notation.md`を局所記法の参照先として本文からlinkしただけで、書換え時の各sectionへ実際に適用するreviewを行わなかった。

#### 根本原因0 + 提案0

- **根本原因0**: scopeによる情報配置とMarkdown見出しの再構成だけを行い、各section内のpiece間関係を`描ける構造 / 規則的な交差 / 同格・並列 / 描けない意味`へ分解しなかった。そのため、何でも書ける散文がdefaultになった。
- **提案0（現時点）**:
  - 総論: `expression_notation.md`の優先順に従い、描ける構造は図、短く規則的な対応は表、同格の兄弟は箇条書き、順序付きactionは番号付き手順にする。理由、因果、例外、定義、機微だけを散文に残す。一つのsectionに複数関係があれば記法を分ける。
  - 各論:
    - **scope treeはmermaidにする**: `workflow全体 → procedure → phase・variant → step・branch`の包含をmermaidのflowchartで示し、図の後の短い散文で「全nodeを必須とするtemplateではない」「実在する深さだけを使う」という意味を補う。mermaidで表せる構造をASCIIへ逃がさない。
    - **二軸の入口を分けて見せる**: scopeは包含図、semantic roleは短い属性表で示す。role表は`role / 答える問い / placementの判断`程度の少数列にし、長い説明をcellへ詰めない。表は地図に留め、目的と成果の差、設計意図、不変条件、gate等の機微は論点2の提案4で合意する小見出しと散文で深掘りする。
    - **scopeとroleの全組合せmatrixは作らない**: すべてのroleがすべてのscopeに必須という誤読と空cellを生むため、scope × roleの星取り表にはしない。図とrole表を分け、「必要なroleだけを該当scopeへ置く」という関係を散文で結ぶ。
    - **procedureかvariantかは短い決定表にする**: 開始状態、trigger、成果、再実行の意味が異なる場合は別procedure、開始状態と成果が同じで途中だけが変わる場合はvariant、という規則的な条件と結果を表で示す。条件の機微と例外だけを表の後の散文に置く。
    - **gateはflowと決定表を使う**: `観測 → 条件判定 → action・遷移 → 完了状態`という描ける構造はmermaidで示す。入口、進行、分岐、完了の各gateは、`制御対象 / 明示が必要な場面 / 条件不成立時の遷移`の短い表で対応を示す。判断不能時の扱いや全stepへ固定fieldを付けない理由は散文で補う。
    - **執筆procedureは全体flowと詳細を分ける**: scopeを決め、procedureを切り、局所へ展開し、各scope内でroleを区別し、記法を選んでsimulationする順序をmermaidで先に渡す。各phaseの意味・gate・戻り先は、その後の番号付き手順または小見出しで説明する。図だけを置いて翻訳を読み手へ丸投げしない。
    - **並列criteriaとreview観点は箇条書きにする**: procedure境界の候補、gateを明示する条件、見出しreview・番号入替え・状態simulation・scope漏れ・外形対称性は、同じ意味levelの兄弟として見える箇条書きまたは小見出しへする。長文項目が育つ場合は小見出しへ昇格し、箇条書きへ段落を詰めない。
    - **理由と局所例は散文に残す**: なぜscopeを狭めすぎても広げすぎても誤りか、なぜ設計意図をactionから分散させないか、どの例外でgateが必要か等は言葉でしか結べないため散文で書く。散文の総量を機械的に減らすのではなく、散文に不向きな関係だけを取り出す。
    - **sectionごとに記法を再判定する**: 隣接sectionの見た目へ揃えず、各sectionのpiece間関係を独立に判定する。同じ数の図や表を各scope sectionへ置く規則は作らない。

#### 検証

- **観点**: scope包含、procedure境界、gate遷移、執筆sequenceを視認性の高い記法へ移すため、読み手が散文から構造を再構築する負担を減らせる。
- **観点**: role定義や理由の機微は散文へ残すため、前回のように説明の厚みを削ることとは異なる。
- **弱点**: 図と表を増やすこと自体が目的になると、文書が記法の見本市になる。各図・表について、元のpiece間関係が本当に包含・flow・規則的対応かを確認し、単なる列挙や理由を図へしない。
- **弱点**: overview図と詳細手順が重複しうる。図は全体の順序と分岐、本文は判断理由・例外・戻り先を担い、同じ文言の二重記載を避ける。

**決定:** 提案0を採用する。描ける構造はmermaid、短く規則的な対応は表、同格の兄弟は箇条書き、順序付きactionは番号付き手順、理由・因果・例外・機微・定義は散文で表す。文書全体を一つの記法へ統一せず、sectionごとのpiece間関係から選ぶ。

**ネクストアクション:** なし。決定した表現記法は論点4のskill再構成でも適用する。

## 論点4: `facilitate-discussion`を全体契約と独立procedureへ再構成する

**ステータス:** 決定済み

**親論点:** 論点1

**種別:** レビュー指摘

**提起の背景:** 現行`SKILL.md`は、file解決、状態読取、scope判定、routing、親子validation、新規論点保存、feedback反映、決定・再開を`1`〜`8`の同じ番号levelへ並べている。procedure、全体不変条件、局所gate、状態更新規則が同じ時系列に見え、agentは現在の開始状態から実行すべき手順と、常時守る契約を見分けにくい。

### 現在の合意対象

**参照する現在案:** イテレーション2の提案2、および[`facilitate-discussion/SKILL.md`](../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md)のdraft

**今回確認すること:** 確認済み。skill起動を一度だけ通る初期phase、論点選択・作成・進行をその後の論点level、feedback iterationを選択中の一論点に属する局所procedureとして包含する。iterationが別decisionだと判定した場合だけ、一段上の論点選択へ戻る。

### 議論の変遷

#### 事象の記述

- `discussion fileを解決する`と`新規論点を保存する`は別の開始状態・成果を持つが、同じ番号列の前後として表現されている。
- `feedbackを反映する`、`決定・再開を保存する`には別々の入口gateと状態遷移があるが、一つのsectionへdecisionの確定と再開を同居させている。
- discussion scope判定、decision scope routing、親子validationは、すべての処理を順に実行するprocedureではない。特定の遷移を制御するgateまたは論点関係の不変条件である。
- 書込み前の再読込、履歴保持、single writer、self-containedな合意対象、chatの具体参照が複数procedureへ効くが、局所手順の中へ分散している。

#### 原因の追跡

- なぜ: 議論lifecycleで必要な事項を漏れなく列挙することを優先し、開始状態・trigger・成果・再実行の意味からprocedure境界を導かなかった。
- なぜ: scope判定や親子validationを「実行順に現れる処理」とだけ捉え、何を制御するgateか、どの更新でも成立すべき契約かを区別しなかった。
- なぜ: skill切出し時にentry形式は共通化したが、workflow本文の構造は旧consumerの処理順を引き継ぎ、初見のagentが入口を選ぶための地図を作らなかった。

#### 根本原因0 + 提案0

- **根本原因0**: workflow全体に通底する情報と、開始状態ごとに選ぶ独立procedureを分離せず、必要事項の列挙順をそのままworkflowの構造にした。
- **提案0（現時点）**:
  - 総論: `SKILL.md`を、workflow全体の目的・契約・入口を先に示し、その後に独立procedureを開始状態から選べる構造へ全面書換えする。既存のruleは削らず、効く最小scopeへ再配置する。
  - 各論:
    - **workflow全体の目的と成果**: 明示された議論を一decision単位で進行し、sessionを離れても評価できる完全な現在案、履歴、決定をdiscussion fileへ残すことを目的とする。成果は更新済みdiscussion fileと、chat上の具体的な決定・ネクストアクションとする。固定result schemaは作らない。
    - **起動gateと責務境界**: 明示起動三条件と暗黙起動禁止をworkflow入口gateとして独立させる。skillとconsumerの所有範囲、`design.md`や`tasklist.md`へ固定しない契約を全体scopeに残す。
    - **入力を全体scopeへ置く**: 明示設定は`discussion_directory`と任意の`discussion_file_name`だけとする。自然言語contextと内部状態の区別、default `discussion.md`、basename制約を保つ。file名の具体validationはfile準備procedureへ置く。
    - **設計意図を明示する**:
      - discussion fileをsession外の正本とし、合意確認より前に完全な現在案を保存するのは、chatだけに判断対象が残る失敗を防ぐためである。
      - 一つのleaf論点を一decisionに限定し、feedbackごとにroutingをやり直すのは、独立decisionを一つのiterationへ混ぜないためである。
      - 過去iterationを不変にして現在stateだけを局所更新するのは、判断の変遷を失わず現在案も一意にするためである。
      - consumerへ決定後の適用を返すのは、discussion processとdomain固有workflowを分離するためである。
    - **全procedureの不変条件を集約する**:
      - 書込み直前にfile全体を再読込し、同じfileへの書込みはsingle writerで行う。
      - canonical h2とlegacy h3に同じ論点番号が重複していれば、すべての書込みを停止し、自動修復・renumber・欠番再利用をしない。
      - 過去iteration、旧決定、却下理由を変更・削除せず、既存h1、論点順序、legacy formatを一括変更しない。
      - 合意確認前に、fileだけを読む人が判断できる完全な現在案と具体的な合意対象を保存する。chatではfile、論点、提案、判断対象を特定し、曖昧な指示語を使わない。
      - 親子関係の正本はchild側の任意`親論点`だけとし、一親、同一file内の存在、自己参照禁止、循環禁止を常に成立させる。
    - **procedure地図をmermaidで置く**: file準備後に現在要求をroutingし、scope外候補は作らず終了、新規decisionは新規論点、同じactive decisionはiteration、合意はdecision確定、決定済みdecisionへの変更は再開後にiteration、親変更はreparent、既存論点がscope外なら取下げへ遷移する全体flowを先に示す。
    - **procedure 1 — discussion fileを利用可能にする**: directory未指定ならpathを聞いて停止、存在しないdirectoryは作らず再指定を求める。file名未指定なら`discussion.md`、絶対path・`../`・separatorを含む指定は拒否する。fileがなければ`# 議論記録`で作成し、あれば全内容を保持して読込む。完了状態は対象fileと既存状態を一意に取得できたこととする。
    - **procedure 2 — 現在の要求を論点操作へroutingする**: file全体からdiscussion目的、既存論点、status、現在案、親参照、論点番号、同じdecision scopeを読む。まずdiscussion scope gateを適用し、その後に同一iteration、child、sibling、後発parent、独立論点を判定する。`独立論点`をscope外候補の受皿にしない。review起点の原文保持と、一feedbackから複数decisionが生じる場合のparent分解もここで判定する。
    - **procedure 3 — 新規論点を開始する**: in-scopeかつ新規decisionへのroutingを入口gateにする。書込み直前の再読込、最大番号+1、親validation、templateによる背景・原因・完全な提案・現在の合意対象・検証、file末尾へのcanonical h2追記、chatでの具体的な合意確認を実行順に書く。child作成時はparentを`子論点待ち`へ同期する。
    - **procedure 4 — 同じ論点へfeedback iterationを追記する**: activeな同一decisionへのfeedbackを入口gateにする。事象とfeedback、discussion scopeへ属する理由、同一decisionを継続する理由、遡及level、変更点、完全な現在案、検証を新iterationへ追記し、現在の合意対象だけを局所更新してから具体的に合意を求める。過去iterationは変更しない。
    - **procedure 5 — 合意したdecisionを確定する**: ユーザーが保存済みの現在案へ合意したことを入口gateにし、同じturnでstatus、決定、ネクストアクションを局所更新する。child決定に伴うparent statusを導出し、decision後の成果物更新・phase遷移・実装はconsumerへ返す。
    - **procedure 6 — 決定済み論点を再開する**: 決定済みdecisionを変更するfeedbackを入口gateにし、以前の決定と変更理由を新iterationへ保存してからactive stateへ戻す。その後はprocedure 4へ遷移し、現在案だけを上書きして旧決定を失わせない。
    - **procedure 7 — 論点をreparentする**: 新しい上位decisionまたは親変更が必要というroutingを入口gateにする。新親の存在、一親、自己参照、循環を検証し、旧親と変更理由を新iterationへ保存してchild側の`親論点`だけを更新する。新しい後発parentが必要ならprocedure 3で作成してからreparentする。
    - **procedure 8 — scope外と判明した既存論点を取り下げる**: 作成済み論点がdiscussion目的または指定parentの範囲へ影響しないと判明した場合だけ実行する。履歴を削除せず、取下げ理由を新iterationへ保存し、現在の決定とネクストアクションを更新して終了する。
    - **親statusを局所更新する**: parent自身には分解の実質的な決定を残す。childの追加、決定、再開、取下げ、reparentで未決child集合が変わる時だけ、未決childありなら`子論点待ち`、すべて解消なら`分解済み`へ同期する。parent側に`子論点`fieldは作らない。
    - **完了gateを置く**: 対象fileの一意性、discussion scope、一leaf一decision、合意対象の事前保存、feedback routing、履歴保持、採番・親子validation、chatの具体参照を、workflowを終了またはconsumerへ返す前のcheckとして残す。
    - **表現記法**: procedure間のflowはmermaid、scope判定とroutingの条件対応は短い決定表、並列する不変条件・validationは箇条書き、各procedureのactionは番号付き手順、設計理由・例外・機微は散文で表す。同じ小見出しを八procedureへ機械的に揃えない。
    - **変更範囲**: `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`を全面書換えし、見出し文字列を検証する`validate-plugin.mjs`を新構造へ追随させる。`templates/discussion_entry.md`、consumer skills、metadata、version、`think-through/SKILL.md`は変更しない。
    - **検証**: plugin validatorと`git diff --check`に加え、fresh processのbehavior smokeでcustom既存fileへのiteration追記または新規論点作成を実行し、既存履歴保持、self-containedな合意対象、具体的なchat確認が構造変更後も維持されることを確認する。

#### 検証

- **観点**: file準備、新規論点、iteration、decision、再開を独立procedureへ分けるため、agentは現在の開始状態から必要な手順を直接選べる。
- **観点**: scope gate、親子整合性、履歴保持、self-containedな合意対象を効くscopeへ置くため、手順とruleを混同せず、既存behaviorを削らずに再構成できる。
- **観点**: 新標準と同じくflow、条件対応、並列rule、理由へ異なる記法を使うため、`SKILL.md`自身が参照標準の具体適用例になる。
- **弱点**: 八procedureへ分けることで見出し数は増える。開始状態・成果が異なる操作だけをprocedureとし、共通のfile更新contractや親子不変条件を各手順へ複製しないことで冗長化を抑える必要がある。
- **弱点**: reparentとscope外取下げは頻度が低い。通常flowの地図で主経路と同じ強さに見せず、例外遷移として分ける必要がある。

#### イテレーション1

**受領したfeedback:**
> いや、skill自体の起動の話、論点を立てる話、イテレーションを立てる話、これらは全部別の入口だろ、だから階層構造の話もしたし、それを例に出して初出の指摘もしたのに何もわかってないだろ

##### 検証

- **観点**: 提案0はfile準備、新規論点、iterationを別procedureという名前では分けた。
- **弱点**: procedure地図を`file準備 → routing → 各操作`という一本の実行flowにしたため、後続procedureをskill起動procedureから順に通るchild stepとして扱った。見出しを分けても入口は分かれておらず、元の番号列と同じ直列化を残した。
- **弱点**: `現在の要求をroutingする`を状態を変えるprocedureとして独立させたが、routingの役割は外部eventと現在状態から実行するentry procedureを選ぶgateである。procedureとgateを再び混同した。
- **弱点**: file新規作成は「target fileがない」というskill起動procedure内のvariantであり、既存論点へのfeedbackを受けたturnで毎回先頭から実行する独立procedureではない。

##### 論点routingの判断

- **discussion scopeへ属する理由**: skillの入口とprocedure階層をどう切るかは、`facilitate-discussion/SKILL.md`の全面再構成を直接規定する。
- **同一decision scopeとしてiterationを継続する理由**: procedureの内容を追加する別decisionではなく、提案0が独立procedureを一本のlifecycleへ誤配置した構造levelの修正である。

##### 修正先の判断

- **診断levelへの遡及**: 「開始状態と成果が違えば別procedure」という基準だけでなく、「どの外部eventから直接そのprocedureへ入るか」をprocedure境界の上位に置く。skill lifecycleを一つの時系列と仮定せず、複数entryを持つoperation集合として捉え直す。

##### 根本原因1 + 提案1

- **根本原因1**: skillを一回起動して議論開始から決定まで走り切るprocessと誤認した。実際にはskill起動、新規decisionの提起、既存decisionへのfeedback、合意、決定済みdecisionの変更が別のturn・別の外部eventとして到着し、それぞれが異なるprocedureへの入口になる。
- **変更点**: `file準備 → routing → operation`という直列flowと汎用routing procedureを撤回する。workflow全体の下に、外部eventから直接選ばれる兄弟entry procedureを置く。file作成はskill起動procedureのvariantに戻し、scope・decision routingは新規論点やiteration等の入口gateへ置く。
- **提案1（現時点）**:
  - 総論: `facilitate-discussion`を、共有契約の下に複数の独立entry procedureを持つskillとして書く。各turnで先頭から同じflowを実行するのではなく、外部eventと現在のdiscussion stateから該当entryを直接選ぶ。
  - 各論:
    - **workflow全体の目的と成果**: 明示された議論を一decision単位で進行し、sessionを離れても評価できる完全な現在案、履歴、決定をdiscussion fileへ残す。成果は更新済みdiscussion fileとchat上の具体的な決定・ネクストアクションとし、固定result schemaを作らない。
    - **起動gate・責務境界・入力**: 明示起動三条件、暗黙起動禁止、skillとconsumerの所有範囲、明示設定二つ、自然言語contextと内部状態の区別を全体scopeに置く。consumerの適用先を特定fileへ固定しない。
    - **全体の設計意図**:
      - discussion fileをsession外の正本にして合意確認前に完全な案を保存し、chatだけに判断対象が残ることを防ぐ。
      - 一leaf一decisionとfeedback受領時の再routingにより、独立decisionを同じiterationへ混ぜない。
      - 過去履歴を不変にし、現在stateだけを局所更新して、変遷と現在案を両立する。
      - consumerへ決定後の適用を返し、discussion processとdomain固有workflowを分離する。
    - **全entry procedureの不変条件**:
      - fileへ書くentryでは直前に全体を再読込し、single writerで更新する。
      - 論点番号が重複していれば全書込みを停止し、自動修復・renumber・欠番再利用をしない。
      - 過去iteration、旧決定、却下理由、既存h1、論点順序、legacy formatを破壊しない。
      - 合意確認前に完全な現在案と具体的な合意対象をfileへ保存し、chatではfile・論点・提案・判断対象を特定する。
      - 親子関係はchild側`親論点`を正本にし、一親、同一file、自己参照禁止、循環禁止を保つ。
    - **兄弟entryの地図**: 一本の矢印flowを描かず、`facilitate-discussion`直下に`skillを起動する`、`新規論点を開始する`、`feedback iterationを追記する`、`decisionを確定する`、`決定済み論点を再開する`、`論点をreparentする`、`scope外の既存論点を取り下げる`を兄弟として示す。構造はmermaid tree、entry条件とprocedureの対応は短い決定表で示す。
    - **入口選択はgateでありprocedureではない**: 外部event、target fileが解決済みか、対象論点の有無・status、feedbackが同じdecisionか、discussion scope内かを観測し、兄弟procedureを選ぶ。`現在の要求をroutingする手順`という独立procedureは作らない。
    - **entry 1 — skillを起動する手順**:
      - 開始状態: ユーザーまたはconsumerがskillを明示適用し、discussion fileがまだ確定していない。
      - 手順: `discussion_directory`の取得と存在確認、任意basenameのvalidation、target fileの確定、既存状態の読取りを行う。
      - variant: fileがなければ`# 議論記録`で新規作成し、同名fileがあれば全内容を保持して継続利用する。二つは同じ成果へ至るvariantであり、別entryにはしない。
      - 完了状態: discussion fileと現在状態が一意に解決されている。このprocedureだけで終了してよく、新規論点作成を必ず続けない。
    - **entry 2 — 新規論点を開始する手順**:
      - 開始状態: 新しいdecision候補が到着し、target fileが解決済みである。
      - 入口gate: まずdiscussion scopeへの影響を判定する。scope外ならactive topicを作らず終了する。in-scopeなら既存decisionとの関係を判定し、child、sibling、後発parent、独立論点のいずれかとして新規論点が必要な場合だけ入る。
      - 手順: file再読込、最大番号+1、必要な親validation、templateによる背景・原因・完全な提案・現在の合意対象・検証、file末尾へのcanonical h2追記、chatでの具体的な合意確認を行う。
      - 局所rule: review起点の最上位論点は原文を保持し、一feedbackから複数decisionが生じるなら実質的な分解decisionを持つparentを作る。child追加時だけparent statusを同期する。
    - **entry 3 — feedback iterationを追記する手順**:
      - 開始状態: 既存論点へのfeedbackが到着し、target fileと論点が特定されている。
      - 入口gate: iteration追加前にdiscussion scopeとdecision scopeを再判定する。同じactive decisionなら続行し、別decisionなら新規論点entry、決定済みdecisionの変更なら再開entry、既存論点自体がscope外なら取下げentryへ切り替える。
      - 手順: feedback、事象、scopeへ属する理由、同一decisionを継続する理由、遡及level、変更点、完全な現在案、検証を新iterationへ追記する。現在の合意対象だけを局所更新した後、具体的に合意を求める。
      - 局所rule: 過去iterationを変更せず、複数decisionを一つのiterationへ混ぜない。
    - **entry 4 — 合意したdecisionを確定する手順**:
      - 開始状態: ユーザーがfileへ保存済みの現在案へ合意した。
      - 手順: 同じturnでstatus、決定、ネクストアクションを局所更新し、未決child集合が変わる場合だけparent statusを導出する。決定後の成果物更新・phase遷移・実装はconsumerへ返す。
    - **entry 5 — 決定済み論点を再開する手順**:
      - 開始状態: 決定済みdecisionを変更するfeedbackが到着した。
      - 手順: 旧決定と変更理由を新iterationへ保存してactive stateへ戻す。そのfeedbackの提案化はiteration entryの手順を使い、現在stateだけを上書きして旧決定を失わせない。
    - **entry 6 — 論点をreparentする手順**:
      - 開始状態: 新しい上位decisionの判明または親変更が必要になった。
      - 手順: 必要なら新規論点entryで後発parentを作る。新親の存在、一親、自己参照、循環を検証し、旧親と変更理由を新iterationへ保存してchild側参照だけを更新する。影響したparent statusを同期する。
    - **entry 7 — scope外の既存論点を取り下げる手順**:
      - 開始状態: 作成済み論点がdiscussion目的または指定parentの範囲へ影響しないと判明した。
      - 手順: 履歴を削除せず、取下げ理由を新iterationへ保存し、現在の決定とネクストアクションを更新して終了する。
    - **file未解決時の扱い**: 新規論点・iteration等のentryへ直接入った時点でtarget fileが解決されていなければ、そのentryの処理を開始せずskill起動entryでfileを確定し、元の外部eventに対応するentryへ戻る。これは全entryを一本のlifecycleへする意味ではなく、共有preconditionを満たすための遷移である。
    - **親statusの同期**: parent自身に分解の実質的な決定を残す。childの追加、決定、再開、取下げ、reparentで未決child集合が変わる時だけ、未決childありなら`子論点待ち`、すべて解消なら`分解済み`へ同期する。parent側へ`子論点`fieldを作らない。
    - **完了gate**: 各entryの終了前に、そのentryが変更した範囲について、target file、discussion・decision scope、履歴保持、採番・親子validation、合意対象の事前保存、chatの具体参照を検査する。全entryへ無関係な同一checklistを貼らない。
    - **表現記法**: sibling entryの階層はmermaid tree、entry条件の対応は決定表、各entryのactionは番号付き手順、並列する不変条件・validationは箇条書き、設計理由と例外は散文で表す。七entryへ同じ小見出しを機械的に揃えず、開始状態や局所gateが判断に必要なentryだけで明示する。
    - **変更範囲**: `facilitate-discussion/SKILL.md`と、新見出しへ追随する`validate-plugin.mjs`だけを更新する。template、consumer、metadata、version、`think-through/SKILL.md`は変更しない。
    - **検証**: startup、new topic、iterationを別々のfresh-process smoke caseとして起動し、どのcaseも別entryから開始できることを確認する。既存履歴保持、self-containedな合意対象、具体的なchat確認も再検証する。

##### 検証

- **観点**: skill起動、新規論点、iterationを同じ親の兄弟entryへ置くため、ユーザーが初出で示した三つの開始状態と階層を直接表現できる。
- **観点**: routingをgateへ戻し、file作成をskill起動entryのvariantへ置くため、procedure、gate、variantのsemantic roleが混ざらない。
- **観点**: 既存fileと論点が特定済みならiteration entryへ直接入れるため、毎turn同じ準備flowを先頭から実行する誤読を防げる。
- **弱点**: file未解決ならoperation entryからskill起動entryへ一時遷移するため、完全に無関係なprocedureではない。entryの兄弟関係と共有preconditionへの依存を区別し、全操作をstartupのchildとして描かない必要がある。
- **弱点**: decision scopeの判定は新規論点entryとiteration entryの両方へ現れる。共通ruleを全体へ一度定義した上で、各entryでは判定結果がどの遷移を制御するかだけを局所化し、判断基準全文を複製しない。

#### イテレーション2

**受領したfeedback:**
> 階層の意味わかってる？ skill起動した後はもうその分岐関係ないじゃん。skill起動後に論点の話になる。論点について話している間にイテレーションの話になる。イテレーションの中で属している論点じゃないってなったら前工程の論点の話になる。ずっと無前提で分岐が起こるわけじゃないよ

##### 検証

- **観点**: 提案1はskill起動、新規論点、iterationを別entryとして区別し、毎turn同じ番号列を最初から実行する誤りを避けようとした。
- **弱点**: 七entryをすべて`facilitate-discussion`直下の兄弟へ置いたため、各procedureが有効になる前提stateと包含関係を失った。skill起動済みであること、対象論点が選択済みであることを無視し、どのeventからも七方向へ分岐するように見える。
- **弱点**: iterationは選択中の一論点に属する局所procedureであるのに、新規論点作成と同じlevelへ置いた。別decisionを検出した時の遷移も、iteration levelから論点levelへ戻る動きではなく、root兄弟間のroutingとして表現した。

##### 論点routingの判断

- **discussion scopeへ属する理由**: procedureの階層とstate遷移は`facilitate-discussion/SKILL.md`の実行意味を直接決める。
- **同一decision scopeとしてiterationを継続する理由**: 新しいbehaviorの追加ではなく、提案1がprocedureの独立性を無前提な兄弟関係と誤認した構造levelの修正である。

##### 修正先の判断

- **診断levelへの遡及**: procedureを「別の入口を持つか」だけで分割せず、その入口が有効になる親stateを先に置く。skill起動、論点level、選択中論点、iteration levelの順にscopeを下り、下位procedureのgateから上位scopeへ戻る遷移を明示する。

##### 根本原因2 + 提案2

- **根本原因2**: 直列flowを否定することと、すべてをroot直下の兄弟へすることを同一視した。独立した入口は無前提な入口ではなく、親stateが成立している間だけ有効な局所入口になりうるという階層を落とした。
- **変更点**: 七つのroot兄弟entryを撤回する。workflowを`skill起動 → 論点level`の順で開始し、論点levelの中に対象論点の選択・新規作成・選択中論点の進行を置く。feedback iteration、decision確定、再開、reparent、取下げは選択中論点のscopeへ下げ、iterationが別decisionなら論点選択へ一段戻す。
- **提案2（現時点）**:
  - **全体scope**:
    - 目的と成果、起動gate、責務境界、明示入力、全体の設計意図をworkflowの前に置く。
    - workflow全体の不変条件は、discussion fileを正本にすること、書込み直前の全体再読込とsingle writer、論点番号重複時の停止、履歴・既存formatの保持、合意確認前のself-containedな保存、chat上の具体参照に限定する。
  - **実行階層**:
    - `1. skillを起動する`は一回だけ通る初期phaseとする。discussion file解決後のfeedbackごとに再実行しない。
    - `2. 論点を扱う`は起動完了後の親scopeとする。その中に`2.1 対象論点を選ぶ`、`2.2 新規論点を作るvariant`、`2.3 選択した一つの論点を進める`を置く。
    - `2.3`の下に`2.3.1 feedbackをiterationとして扱う`、`2.3.2 decisionを確定する`、`2.3.3 reparentする`、`2.3.4 scope外の既存論点を取り下げる`を置く。決定済み論点の再開はiteration処理のvariantとする。
  - **skill起動phase**:
    - directory未指定なら具体pathを聞き、存在しないdirectoryは推測作成しない。file名はdefault `discussion.md`またはpathを含まないbasenameだけを受ける。
    - fileがなければ`# 議論記録`で作るvariant、あれば全内容を保持して継続するvariantを選ぶ。
    - file全体から既存stateを読み、重複番号がないことを確認する。target fileと現在stateが一意なら論点levelへ進む。file解決だけの依頼ならここで終了できる。
  - **論点levelの契約**:
    - discussion目的または指定parentの決定・実装範囲へ影響するdecisionだけを扱う。影響しない、または不明な候補からactiveな論点を作らない。
    - 一つのleaf論点を一つのdecisionとする。`独立論点`をscope外事項の受皿にしない。
    - 親子関係はchild側`親論点`を正本にし、一親、同一file、自己参照禁止、循環禁止を守る。未決child集合が変わる場合だけparent statusを同期する。
  - **対象論点の選択**:
    - activeな同じdecisionへのfeedbackは既存論点を選び、iterationへ進む。決定済みの同じdecisionなら同じ論点を選び、再開variantへ進む。
    - 新しいdecisionは既存論点との関係からchild、sibling、後発parent、独立論点のいずれかを選び、新規論点variantへ進む。
    - 保存済み提案への合意は対象論点のdecision確定、既存論点自体のscope外判明は取下げへ進む。
  - **新規論点variant**:
    - file再読込、最大番号+1、必要な親validation、templateによる背景・原因・完全な現在案・合意対象・検証、canonical h2の末尾追記、具体的なchat確認を順に行う。
    - review原文を保持し、一feedbackから複数decisionが生じる場合は実質的な分解decisionを持つparentとleaf childへ分ける。
  - **iteration procedure**:
    - 選択中のactive論点へfeedbackが来た時だけ入る。iteration追加前にdecision scopeを再判定する。
    - 同じdecisionならfeedback、routing理由、遡及level、変更点、差分ではない完全な現在案、検証を新iterationへ保存し、現在の合意対象を局所更新する。
    - 別decisionならiterationを作らず、一段上の`2.1 対象論点を選ぶ`へ戻る。skill起動やfile解決を再分岐しない。
    - 決定済みの同じdecisionなら旧決定と変更理由を同じiterationへ保存してactiveへ戻す。再開用とfeedback用のiterationを二重作成しない。
  - **選択中論点のstate処理**:
    - 合意時は対象file・論点・提案を特定し、同じturnでstatus、決定、ネクストアクションを保存する。決定後の適用はconsumerへ返す。
    - reparent時は必要なら後発parentを先に新規作成し、validation後に旧parentと理由をchildのiterationへ保存してchild側参照だけを更新する。
    - scope外取下げ時は履歴を削除せず、理由と終了stateを新iterationへ保存する。
  - **完了gate**:
    - 現在案の保存と具体的な合意確認、decisionの同turn保存、reparent・取下げ結果の保存、または別decisionとして論点選択へ戻したことのいずれかで、選択中論点の処理を抜ける。
    - 別論点を続けるなら`2.1`へ戻り、未決事項がなくconsumerへ返す決定とネクストアクションが揃えばworkflowを完了する。
  - **変更・検証範囲**:
    - 現在案を[`facilitate-discussion/SKILL.md`](../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md)へdraftとして具体化し、`validate-plugin.mjs`を階層見出しと戻り先の検査へ追随させる。
    - template、consumer、metadata、version、`think-through/SKILL.md`は変更しない。draft確認前にはbehavior smokeを実行せず、構造検査、plugin validator、`git diff --check`だけを行う。

##### 検証

- **観点**: skill起動後は論点levelだけが有効になり、iterationは選択中論点の配下でだけ有効になるため、各分岐の前提stateが見出し階層とflowの両方から分かる。
- **観点**: 別decisionをiterationへ混ぜず、論点選択へ一段だけ戻すため、起動phaseを繰り返さずに新しいchild、sibling、parent、独立論点へ正しく分けられる。
- **弱点**: 一つのskill invocationがchatの複数turnをまたぐため、図の`turn終了`とworkflow全体の完了は異なる。現在案を保存して合意待ちになった状態を、decision済みのworkflow完了と誤読しない必要がある。

**決定:** イテレーション2の提案2と、それを具体化した[`facilitate-discussion/SKILL.md`](../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md)を採用する。提案1の七つのroot兄弟entryは採用しない。採用後のfresh-process behavior smokeは8件すべて成功した。

**ネクストアクション:** なし。behavior smokeと静的検証は完了した。

## 論点5: `task-design`に残ったdiscussion processを新skillへ完全移譲する

**ステータス:** 決定済み

**種別:** レビュー指摘

**起点となった原文:**
> plugins/tumeda-dev/skills/task-design/SKILL.md について、「Step 3. 論点を1つずつ詰める（イテレーション）」が残ってるけど、これは新スキルに全部移譲じゃない？ タスク設計固有の補足は移譲時に受け渡す感じで

**提起の背景:** `task-design`は§4でdiscussion fileの解決、提案、feedback、決定、採番、親子関係、履歴保持を`facilitate-discussion`へ委ねると宣言している。一方、§5 Step 3はtask-design自身の手順として、提案0の作成、論点を一つずつ進めるiteration、routing、合意を再び列挙している。所有宣言と実行手順が一致せず、consumer側にdiscussion processの第二の正本が残っている。

### 現在の合意対象

**参照する現在案:** イテレーション1の根本原因1 + 提案1、およびそれを具体化した[`task-design/SKILL.md`](../../../../plugins/tumeda-dev/skills/task-design/SKILL.md)と[`facilitate-discussion/SKILL.md`](../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md)

**合意済みの判断:** `task-design`からdiscussion内部processを削除し、task-design固有contextを渡す。一つの論点が決定するたびに`facilitate-discussion`からtask-designへ必ず返し、task-designがそのdecisionを直ちに`design.md`へ反映して全体を再評価してから、必要なら次のdiscussionへ入る逐次handbackにする。

### 議論の変遷

#### 事象の記述

- §4は、task-designがworking directory、議論開始判断、設計context、決定後の`design.md`反映、設計完了判定を所有し、discussion fileとdiscussion processを`facilitate-discussion`へ委ねると定義している。
- Step 3は、task-designが先に提案0を出し、一論点ずつiterationし、`facilitate-discussion`内でrouting・合意し、次の論点を選ぶ五段階のloopを持つ。
- §4の`design.md`更新timingには「先にchatで提案」とあり、`facilitate-discussion`が合意確認前に完全案をdiscussion fileへ保存する契約と表現がずれている。
- §8の自己更新規則と§9の軽量modeも、Step 3の「一論点ずつ詰める」processや「論点1を議論 → 決定」をtask-design側の手順として参照・再記述している。

#### 原因の追跡

- なぜ: consumer移行時に、旧Step 3の各stepへ`facilitate-discussion`呼出しを差し込んだが、旧consumerが所有していたdiscussion loop自体を撤去しなかった。
- なぜ: 「task-designが設計decisionの優先順位を決めること」と「discussion file内で論点を選び、提案・iteration・routing・合意を進めること」を同じloopとして扱った。
- なぜ: 同じagentが両skillを適用するため、consumerからcontextを渡す境界と、新skillへroleを切り替えた後の内部processを文書上で分離しなくても動くと判断した。その結果、どちらのskillがprocess変更の正本かが曖昧になった。

#### 根本原因0 + 提案0

- **根本原因0**: task-design固有の設計orchestrationと、共通化したdiscussion processの境界を、呼出し前・実行中・decision返却後の三状態で切らなかった。新skillを呼ぶ記述は追加したが、呼出し中のprocess ownershipをconsumerから削除していない。
- **提案0（現時点）**:
  - 総論: `task-design`はdiscussionを開始するかの判断、設計固有contextの受渡し、返されたdecisionの適用と設計完了判定だけを所有する。`facilitate-discussion`の適用中は、提案作成、論点選択、iteration、feedback routing、親子関係、合意、discussion file更新をすべて新skillへ委ね、task-design側で再定義しない。
  - 各論:
    - **二つのloopを分ける**:
      - task-designの外側loopは、未解消の設計判断を見つけ、解消手段を選び、得られた事実またはdecisionを`design.md`へ反映し、設計完了条件を再評価するloopである。
      - `facilitate-discussion`の内側loopは、discussion scope、対象論点、完全な提案、iteration、feedback routing、合意を扱う。task-designはこのloopの順序や粒度を所有しない。
    - **§4のconsumer契約を受渡し中心にする**: task-designが`facilitate-discussion`へ渡すcontextを次のように明示する。
      - `discussion_directory=<working_dir>`と`discussion_file_name=task-design-discussion.md`
      - 設計目的、完了条件、現在の`design.md`、関連する合意済み設計
      - 解消したい設計上の不確実性と、その結論によって変わる設計範囲
      - task-design固有の判断材料として、該当するWHY・WHAT・HOW、完成後の姿の観点、調査・spikeで確定した事実、通常modeまたは軽量mode
      - task-designは`topic_id`、提案番号、iteration番号、親論点、entry formatを指定しない。これらはdiscussion fileの状態から新skillが管理する。
    - **Step 3を外側の設計orchestrationへ再構成する**: 見出しを`Step 3. 未解消の設計判断を解消する`へ変更し、次の順序だけを残す。
      1. `design.md`と合意済み設計から、次に解消すると下位判断を最も多く確定できる設計上の不確実性を一つ選ぶ。
      2. 解消手段を、ユーザーdecisionが必要ならdiscussion、既存情報で確定できるなら調査、実行しないと分からないなら技術検証実装から選ぶ。
      3. discussionを選んだ場合は§4のtask-design固有contextを渡して`facilitate-discussion`を明示適用し、その内部processを新skillへ委ねる。task-design側で先に提案0をchatへ出したり、論点・iteration・質問形式を組み立てたりしない。
      4. 新skillからdecisionとネクストアクションが返った場合、または調査・技術検証で事実が確定した場合だけ、task-designが`design.md`の該当箇所へ結果を反映する。
      5. `design.md`全体から残る不確実性と完了条件を再評価し、残る場合はStep 3、なければStep 4へ進む。
    - **task-design固有の補足は呼出し前に渡す**: task-designの§2完成後の姿、§3のWHY→WHAT→HOW・TBD・上位判断優先、§5の調査とspikeの結果は、新skill内へ規則として複製せず、そのdiscussionで必要な具体contextだけを渡す。たとえばUI設計decisionなら、画面全体、配置意図、component inputと供給元が未確定であることを渡し、新skillがそれを完全な提案と合意対象へ組み立てる。
    - **`design.md`更新timingを新skillの保存順へ合わせる**: 「先にchatで提案 → 合意 → 書き戻し」を、「`facilitate-discussion`が完全な現在案をdiscussion fileへ保存 → chatで合意 → task-designがdecisionを`design.md`へ反映」へ変更する。未決の提案を`design.md`へ書かない契約は維持する。
    - **技術検証実装はtask-designへ残す**: discussion開始前の解消手段選択、`spike/`の配置、実行環境、成果物管理、検証事実の`design.md`反映は設計workflow固有であり、`facilitate-discussion`へ移さない。検証結果についてユーザーdecisionが必要になった時だけ、その事実をcontextとして新skillへ渡す。
    - **副産物flowはconsumer契約だけに縮める**: skill・docs改善候補をtask-designがcontextとして渡し、新skillから返ったdecisionを対象fileへ反映して元の設計へ戻る、とだけ書く。scope gate、論点化、提案、合意の内部順序をtask-design側へ再記述しない。
    - **§6・§8の旧Step 3参照を更新する**:
      - NG集は「discussion processをtask-design側で組み立てた」「task-design固有contextを渡さず新skillへ丸投げした」というconsumer境界違反を検出する。
      - skill自己更新時の「1論点ずつ詰める」「状態を頭に抱えない」は、task-design Step 3の手順として持たず、discussionを開始したら`facilitate-discussion`へ委ねる契約として参照する。
      - §3-2のTBDで全体を先に見せる思想と§3-3の上位設計判断を優先する思想は、discussion fileの操作手順ではなくtask-design固有の設計priorityなので維持する。
    - **軽量modeも同じconsumer契約を参照する**: §9-4は、最小`design.md`を作った後、task-design固有contextを渡して新skillを適用し、返ったdecisionをD1、D2へ反映し、完了条件を再評価する外側loopだけを書く。「論点1を議論 → 決定」のような新skill内部processは再記述しない。
    - **変更範囲**: `plugins/tumeda-dev/skills/task-design/SKILL.md`を上記境界で再構成し、`scripts/verification/validate-plugin.mjs`へ旧Step 3見出しの不存在、handoff context、内部process再定義禁止、decision返却後の`design.md`反映を検証するassertionを追加する。`facilitate-discussion/SKILL.md`、template、他consumer、metadata、versionは変更しない。
    - **検証**: plugin validatorと`git diff --check`に加え、fresh processへtask-designとfacilitate-discussionを読ませ、task-designがdiscussionの提案・iteration手順を独自に回答せず、渡すcontextとdecision返却後の処理を区別できることをsmoke testする。

##### 検証

- **観点**: discussion内部processの正本が`facilitate-discussion`だけになるため、新skillの論点階層やiteration契約を変更してもtask-designのStep 3が陳腐化しない。
- **観点**: task-design固有の設計priority、調査・spike、`design.md`反映、完了判定はconsumerへ残すため、単なる丸投げではなくdomain contextを伴う移譲になる。
- **弱点**: 同じagentが二つのskillを連続適用するため、role切替が実行上は見えにくい。handoff contextと「適用中はtask-design側で内部processを補わない」という境界を明記し、fresh-process smokeで識別できるか確認する必要がある。
- **弱点**: `design.md`の次の不確実性を一つ選ぶ外側loopと、discussion file内の次の論点を選ぶ内側loopは似て見える。前者は設計成果物全体の完了判定、後者は一つのdiscussion stateの進行を所有すると、対象stateで区別する必要がある。

#### イテレーション1

**受領したfeedback:**
> task-designとfacilitate-discussion の関係は、最後に一括更新じゃなくて論点の決定ごとの逐次更新になってる？

##### 検証

- **事象**: `task-design`は「合意が取れたらその場で書き戻す」としていた一方、`facilitate-discussion`の論点level完了gateは、一論点を決定した後も別論点を続けてよいと読めた。
- **影響**: consumerへ返すtimingが両skill間で一致せず、複数decisionをdiscussion fileへ溜めて最後に`design.md`へ一括反映する実装も契約違反にならなかった。
- **同一decision scopeとして継続する理由**: 新しい議論形式ではなく、提案0で分けた内側loopと外側loopの制御受渡しtimingを具体化するfeedbackである。

##### 論点routingの判断

- **discussion scopeへ属する理由**: 一decisionごとのhandbackか複数decision後の一括handbackかは、task-designからdiscussion processを移譲する境界と`design.md`の更新timingを直接変える。
- **選択中の論点と同じdecisionである理由**: task-design固有の外側loopとfacilitate-discussionの内側loopをどこで接続するかという、論点5の同じconsumer handoff契約である。

##### 修正先の判断

- **契約levelへの遡及**: task-design側の「その場で反映」だけではconsumerの期待に留まる。producerである`facilitate-discussion`にも、一つの論点のdecision確定を強制的な返却gateとして置く必要がある。

##### 根本原因1 + 提案1

- **根本原因1**: 提案0はownershipを分けたが、二つのloopの同期点を定義しなかった。`facilitate-discussion`が複数論点を連続処理できる旧完了gateを残したため、task-designの逐次反映と両立しない実行経路が残った。
- **変更点**: `facilitate-discussion`の一論点決定を強制handback gateにし、`task-design`の一decision反映と全体再評価を次のdiscussionより前に置く。提案0の「`facilitate-discussion/SKILL.md`は変更しない」という変更範囲は撤回する。
- **提案1（現時点）**:
  - `facilitate-discussion`は一つの論点でdecision、status、ネクストアクションを保存したら、未決の別論点が残っていても別論点を選ばずconsumerへ返す。
  - task-designは返された一decisionを直ちに`design.md`へ反映し、設計全体の不確実性と完了条件を再評価する。複数decisionを溜めて最後に一括反映しない。
  - 再評価後もユーザーdecisionが必要なら、更新済み`design.md`と関連合意をcontextとして`facilitate-discussion`へ再び渡す。これにより、直前のdecisionで次の最上位不確実性が変わった場合もtask-designが選び直せる。
  - feedbackが選択中論点とは別decisionだと判定された場合の`2.1`への戻りは、まだ一decisionも確定していないroutingなので維持する。decision確定後の連続処理とは区別する。
  - 直接起動された`facilitate-discussion`も、一論点決定後は次の明示的な入力まで別論点へ進まない。
  - 通常modeと軽量modeの双方へ同じ逐次handbackを適用する。
  - 変更範囲は`task-design/SKILL.md`、`facilitate-discussion/SKILL.md`、`validate-plugin.mjs`とする。template、他consumer、metadata、versionは変更しない。
  - 現在案を両SKILLへdraftとして具体化し、構造検査、plugin validator、`git diff --check`だけを行う。draft採用前にbehavior smokeは実行しない。

##### 検証

- **観点**: 一decisionごとに`discussion fileへ決定保存 → consumerへ返却 → design.mdへ反映 → 設計全体を再評価`となり、決定が後続判断の前提へ逐次取り込まれる。
- **観点**: task-designが次の設計上の不確実性を選び直してからdiscussionを再適用するため、`facilitate-discussion`がconsumer全体の優先順位を推測しない。
- **弱点**: 一つのdiscussion file内に未決論点が残っていても一旦返すため、consumerとの切替回数は増える。ただし同じagentが両skillを適用し、切替の目的は文脈更新と優先順位再評価なので、round-trip増加より一括反映による前提ずれの防止を優先する。

**決定:** イテレーション1の提案1と、それを具体化した[`task-design/SKILL.md`](../../../../plugins/tumeda-dev/skills/task-design/SKILL.md)および[`facilitate-discussion/SKILL.md`](../../../../plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md)を採用する。discussion内部processは`facilitate-discussion`へ移譲し、一論点のdecision確定をconsumerへの強制handback gateとする。task-designは返された一decisionを直ちに`design.md`へ反映して設計全体を再評価し、必要な場合だけ次のdiscussionへ再適用する。

##### 採用後の検証

- fresh processは`NEXT_ACTION=APPLY_DECISION_A`、`AFTER_APPLY=REEVALUATE_WHOLE_DESIGN`、`DISCUSSION_OWNER=FACILITATE_DISCUSSION`、`TOPIC_B_TIMING=AFTER_REEVALUATION_IF_NEEDED`を返した。
- 機械検査、plugin validator、`git diff --check`はすべて成功した。
- 証跡: `artifacts/phase-13-task-design-handoff-behavior-smoke/result.json`（attempt 1、`passed`、成功4件・失敗0件）

**ネクストアクション:** なし。採用とbehavior smokeは完了した。

## 論点6: discussion開始判定を、assistantの主観的予測から観測可能な行為へ置き換える

**ステータス:** 決定

**種別:** 認識齟齬

### イテレーション0: 主観的分類が介在する判定点を、これから行う行為だけで判定できる形にする

#### 提案0

`plugins/tumeda-dev/skills/task-design/SKILL.md` の3箇所を変更する。diff外の範囲は変更しない。他のskill file（`think-through`、`facilitate-discussion`、`steering`）は変更しない。

##### 変更1: §4「discussionを開始する時と返却後」のtrigger文（310〜314行目付近）

```diff
 #### discussionを開始する時と返却後

-ユーザーが設計上の質問を提起した場合、またはtask-design agentの検討が複数往復を要する設計decisionになった場合にdiscussionを開始する。適用中の提案作成、論点選択、iteration、feedback routing、合意は`facilitate-discussion`へ委ねる。
+次のいずれかへ該当した時点でdiscussionを開始する。適用中の提案作成、論点選択、iteration、feedback routing、合意は`facilitate-discussion`へ委ねる。
+
+- ユーザーが設計上の質問を提起した。
+- ユーザーの回答によって`design.md`の内容が変わる問いを、これからユーザーへ出そうとしている。
+
+二番目の条件は、これから行う自分の行為だけで判定する。往復回数の予測、assistantが既に結論を持っているか、論点が選択肢へ畳めるかを判定材料にしない。「これは議論ではなく確認だ」「もう答えが決まっているので1往復で済む」という分類は、この判定を免除しない。
+
+assistantが結論を持っている論点ほどdiscussionを外しやすい。しかしそこでは、採らなかった案と採らなかった理由がassistantの中にしか存在しない。記録を省くと、次に同じ判断へ来た者がゼロから同じ検討をやり直す。結論を持っているほど記録価値は高い。

 `facilitate-discussion`は一つの論点でdecisionを確定するたびにtask-designへ返す。task-designはそのdecisionと具体的なhandoffが返った直後に`design.md`へ反映し、次の論点を扱う前に設計全体の不確実性と完了条件を再評価する。複数論点のdecisionを溜めて最後に一括反映しない。
```

##### 変更2: §5 Step 3 の不確実性解消手段の判定表（414〜422行目付近）

```diff
 2. 不確実性の解消手段を選ぶ。

 | 判定 | 解消手段 |
 | --- | --- |
-| ユーザーのdomain判断または複数往復の設計decisionが必要 | discussion |
+| ユーザーへ問わなければ確定しない | discussion |
 | 既存code・documentを読めば事実を確定できる | 調査 |
 | 実行しなければ挙動を確定できない | 技術検証実装 |

+解消手段はこの三つだけである。`確認`、`念のため聞く`、`選択肢を出して選んでもらう`は第四の手段ではなく、すべてdiscussionである。
+
 3. 選んだ手段を実行する。
    - discussion: §4のtask-design固有contextを渡して`facilitate-discussion`を明示適用し、内部processを委ねる。task-design側で先に提案0をchatへ出したり、論点・iteration・質問形式を組み立てたりしない。
```

##### 変更3: §6 NG集 F の1項目目（619〜623行目付近）

```diff
 ### F. 状態を頭で抱えた

-- [ ] 議論開始後に`facilitate-discussion`を適用せず、論点・提案・却下理由をsessionだけで管理した → 4 / 5 Step 3
+- [ ] `design.md`の内容が変わる問いをユーザーへ出したが、その時点でdiscussion fileに対応するproposalが保存されておらず、論点・提案・却下理由がsessionだけに残った → 4 / 5 Step 3
 - [ ] discussion内部processをtask-design側で組み立て直した → 4 / 5 Step 3
 - [ ] task-design固有の設計contextを渡さず、discussionの判断材料まで新skillへ丸投げした → 4 / 5 Step 3
```

##### 変更しないもの

| 対象 | 変更しない理由 |
| --- | --- |
| §5 Step 2「『この骨格でいいか』のみ問う」 | 既にStep 3の論点同梱を禁じている。変更1〜3の後は、同梱しても「`design.md`の内容が変わる問いをこれから出す」に該当してdiscussionが起動するため、turn境界を規定する新ruleは不要 |
| 選択肢提示tool（AskUserQuestion等）に関する規定 | 新設しない。tool自体は禁止対象ではなく、proposalをdiscussion fileへ保存した後の提示手段としてなら使える。問題は保存せずに合意を求めたことなので、変更1〜3のgateで捕捉される。harness固有のtool名をskillへ書くと、tool構成が変わるたびにskillが陳腐化する |
| `think-through` | 「答えを持っている論点ほど記録価値が高い」は思考の作法ではなく記録processの契約であり、`think-through`の担当外 |
| `facilitate-discussion`の起動gate | 「consumer skillが明示適用した時」と既に規定済み。consumer側（task-design）のtriggerを直せば足りる |

#### 提案背景

##### 起点

この議論は`nanitabe` repositoryのsteering directory `.steering/2026/202608/20260823-fix-dish-card-tap-copy-naming/discussion.md` で実時間に記録し、対象がすべてこのpluginのskillであったため、合意完了後にこのfileへ移設した。論点番号は移設時に既存の最大番号へ続けて採番し直しており、本文中の相互参照も同じ採番へ揃えてある。それ以外の内容、順序、iterationは記録時のままである。

steering → task-designを実行中、`design.md`初稿（TBD込み）を書いた後、assistantが次を行った。

1. Step 2（構造合意）とStep 3（最上位不確実性の解消）を1メッセージへ束ねた
2. 「論点6: バグ修正の適用範囲」「論点8: リネームの適用範囲」をassistant自身が組み立て、それぞれ2〜3の選択肢と「推奨」を付けた
3. `facilitate-discussion`を適用せず、discussion fileへ何も保存しないまま、AskUserQuestion toolでユーザーへ合意を求めた

ユーザーはこのAskUserQuestionを拒否して中断した。ユーザーの発言:

> 副因側で止めた。なんでこれ起きた？

##### 原因owner

**skill**と分類する。repositoryを問わず再発する、discussion開始判定のprocessがskillに不足している。

`nanitabe` repository固有の知識不足でも、今回の成果物固有の逸脱でもない。同じ判定点は、どのrepositoryのtask-design実行でも通る。

##### 既存skillは既に禁止している、という事実

先に確認したところ、既存skillは今回の行動を既に禁止していた。

| 現行文言 | 今回の行動との関係 |
| --- | --- |
| Step 3判定表「ユーザーのdomain判断**または**複数往復の設計decisionが必要 → discussion」 | 「バグ修正の適用範囲」はユーザーのdomain判断が必要。ORの前半に該当し、discussion一択だった |
| Step 2「『この骨格でいいか』**のみ**問う」 | 論点を同梱した時点で違反 |
| §5 Step 3「task-design側で先に提案0をchatへ出したり、論点・iteration・質問形式を組み立てたりしない」 | 選択肢と推奨を組み立てた時点で違反 |
| `facilitate-discussion`不変条件「ユーザーへ合意を求める前に、proposal、提案背景、空のfeedback見出しをdiscussion fileへ保存する」 | 保存ゼロで合意を求めた時点で違反 |

したがって「discussionを適用せよ」という趣旨のruleを追加する提案は採らない。それは議論の結論をruleとして書き写す対症療法であり、既存の4箇所と重複する。

問うべきは「明示的な禁止がなぜ拘束しなかったか」である。

##### 拘束しなかった機構

**機構1（trigger側）: 判定条件がassistantの主観的予測になっている。**

§4のtrigger文と、Step 3判定表のOR後半は、どちらも「複数往復を要するか」を条件にしている。これはassistantが行う予測である。assistantが既に結論を持っている論点では、予測は必ず「1往復で済む」になる。結果として、**結論を持っている論点ほどdiscussionが外れる**という逆選択が構造的に起きる。

実際の思考経路は次だった。判定表のOR前半（ユーザーのdomain判断が必要）に該当していたにもかかわらず、後半の「複数往復」を見て「もう答えがあるから複数往復は不要」と読み、判定全体を否定した。ORをANDとして読んだ形になっている。「複数往復」という予測条件が同じ表に同居していること自体が誤読を招いた。

変更1と変更2は、この予測条件を判定材料から外す。変更2の「ユーザーへ問わなければ確定しない」は、これから行う行為（ユーザーへ問う）だけで判定でき、予測が入る余地がない。

**機構2（自己診断側）: NG集Fが主観的分類を条件節に持っている。**

現行F1は「**議論開始後に**`facilitate-discussion`を適用せず」で始まる。assistantが「これは議論ではなく確認だ」と分類していれば、条件節が成立せず、チェックが素通りする。自己診断チェックリストが、診断対象と同じ主観的分類に依存している。

変更3は条件節を「`design.md`の内容が変わる問いをユーザーへ出したが、その時点でdiscussion fileにproposalが保存されていなかった」という観測可能な事実へ置き換える。fileを見れば真偽が決まるため、分類を誤っても検出される。

**機構3（Step 2とStep 3の同梱）と機構4（tool affordance）を独立decisionにしない理由。**

当初はこの二つも修正対象候補だった。しかし変更1〜3を入れると、どちらも独立したruleを必要としない。

- 機構3: 同梱しても「`design.md`の内容が変わる問いをこれから出す」に該当するため、変更1のtriggerが発火する。turn境界を規定する新ruleは、Step 2の既存文言と変更1の両方に重複する。
- 機構4: assistantは「skillは自然言語で合意を取れと言っている」と認識した上で「選択肢が離散的だからtoolのほうがcleaner」と判断して上書きした。これはtoolの存在が原因ではなく、保存前に合意を求めた行為が原因である。proposalをfileへ保存した後であれば、選択肢UIは提示手段として使ってよい。tool名をskillへ書くとharness構成の変化でskillが陳腐化する。

「変更しないもの」の表は、この判断を後から読める形で残すために置く。

##### 提案0が満たす必要のある条件

1. 既存の4箇所の禁止と重複しない
2. assistantの主観的分類が介在する判定点を残さない
3. 分類を誤っても検出できる自己診断項目を持つ
4. 増幅要因（機構3・機構4）へ個別ruleを積まない
5. 変更範囲が`task-design/SKILL.md`に閉じる

変更1が条件2の前半（trigger）、変更2が条件2の後半（解消手段選択）と「確認」という抜け道の閉鎖、変更3が条件3を満たす。「変更しないもの」の表が条件1・4・5を満たすことを示す。

#### 提案0へのフィードバック

**結果:** 受諾。3つのdiffをそのまま適用してよいという合意。

> 反映していい。

### イテレーション1: triggerを「起動する条件」から「起動しない条件」へ反転する

#### 提案1

イテレーション0で適用した3 hunkのうち、**変更1（§4 trigger文）だけを差し替える**。変更2（Step 3判定表）と変更3（NG集F）は現状のまま維持する。

差し替えの形として案aと案bがある。

##### 案a: 非起動条件を「TBDゼロ」の一つだけにする

```diff
-次のいずれかへ該当した時点でdiscussionを開始する。適用中の提案作成、論点選択、iteration、feedback routing、合意は`facilitate-discussion`へ委ねる。
-
-- ユーザーが設計上の質問を提起した。
-- ユーザーの回答によって`design.md`の内容が変わる問いを、これからユーザーへ出そうとしている。
-
-二番目の条件は、これから行う自分の行為だけで判定する。往復回数の予測、assistantが既に結論を持っているか、論点が選択肢へ畳めるかを判定材料にしない。「これは議論ではなく確認だ」「もう答えが決まっているので1往復で済む」という分類は、この判定を免除しない。
+discussionは既定で開始する。適用中の提案作成、論点選択、iteration、feedback routing、合意は`facilitate-discussion`へ委ねる。
+
+開始しないのは、`design.md`に未解消のTBDが一つも残らず、新たな論点も生じていない場合だけである。それ以外は判断せず開始する。
+
+往復回数の予測、assistantが既に結論を持っているか、論点が選択肢へ畳めるか、ユーザーへ問う前に自分で調べられるかは、いずれも開始しない理由にならない。「これは議論ではなく確認だ」「もう答えが決まっているので1往復で済む」という分類も理由にならない。
```

案aを採る場合、`調査`と`技術検証実装`はdiscussionの代替ではなく、開始済みdiscussionの中で提案の根拠を得る手段になる。したがって§5 Step 3の判定表の意味が変わり、表の見出し「解消手段」と「解消手段はこの三つだけである」の一文も併せて書き換える必要が生じる。この波及は提案1の範囲に含めていない。

##### 案b: 非起動条件を「TBDゼロ」と「ユーザーへ問わずに確定する」の二つにする

```diff
-次のいずれかへ該当した時点でdiscussionを開始する。適用中の提案作成、論点選択、iteration、feedback routing、合意は`facilitate-discussion`へ委ねる。
-
-- ユーザーが設計上の質問を提起した。
-- ユーザーの回答によって`design.md`の内容が変わる問いを、これからユーザーへ出そうとしている。
-
-二番目の条件は、これから行う自分の行為だけで判定する。往復回数の予測、assistantが既に結論を持っているか、論点が選択肢へ畳めるかを判定材料にしない。「これは議論ではなく確認だ」「もう答えが決まっているので1往復で済む」という分類は、この判定を免除しない。
+discussionは既定で開始する。適用中の提案作成、論点選択、iteration、feedback routing、合意は`facilitate-discussion`へ委ねる。
+
+開始しないのは次のどちらかに当たる場合だけである。それ以外は判断せず開始する。
+
+- `design.md`に未解消のTBDが一つも残らず、新たな論点も生じていない。
+- 残る不確実性が、ユーザーへ問わずに確定する。Step 3の`調査`または`技術検証実装`だけで事実が決まる。
+
+往復回数の予測、assistantが既に結論を持っているか、論点が選択肢へ畳めるかは、開始しない理由にならない。「これは議論ではなく確認だ」「もう答えが決まっているので1往復で済む」という分類も理由にならない。調査で得た事実だけでは設計が決まらないと分かった時点で開始する。
```

案bは§5 Step 3の判定表と整合するため、波及がない。

どちらの案でも、次の段落はイテレーション0で適用したまま維持する。

> assistantが結論を持っている論点ほどdiscussionを外しやすい。しかしそこでは、採らなかった案と採らなかった理由がassistantの中にしか存在しない。記録を省くと、次に同じ判断へ来た者がゼロから同じ検討をやり直す。結論を持っているほど記録価値は高い。

##### 推奨

**案b**を推奨する。理由は提案背景の「案aと案bの比較」に置く。

#### 提案背景

##### 現在fileへ適用済みの状態

イテレーション0の3 hunkは`plugins/tumeda-dev/skills/task-design/SKILL.md`へ適用済みである。提案1が合意されるまで戻さない。合意時に変更1の本文だけを差し替える。

##### 今回満たす必要が生じた条件

イテレーション0の変更1は「起動する条件」を列挙する形のままだった。ユーザーの指摘は、その形自体を反転させることを求めている。

> 基本的にdesign.mdが完璧で論点もTBDが無い場合以外は思考停止でfaciliate-discussion起動。起動する場合より、起動しない場合のほうが設定として合ってるかも。元々task-designとして一体化してたんだし

イテレーション0の診断（判定条件に主観的予測が混ざっていた）は維持する。置き換えるのは対処の形である。列挙した起動条件へ「自分は該当するか」を照合させる形は、条件が観測可能になっても照合そのものが残る。照合が残る限り、そこは外しにいける場所であり続ける。

非起動条件を閉じた集合として書くと、既定がfail-openになる。列挙に当たらなければ起動するため、判定を誤ってもdiscussionは起動する側へ倒れる。イテレーション0の形はfail-closedで、誤ると起動しない側へ倒れていた。**この反転がイテレーション1の本質である。**

`facilitate-discussion`が元々`task-design`の一部だったという経緯も、既定を起動側に置くことを支持する。分離は責務の整理であって、起動頻度を下げる判断ではなかった。

##### 案aと案bの比較

| 観点 | 案a | 案b |
| --- | --- | --- |
| 非起動条件の数 | 1つ | 2つ |
| ユーザー発言との距離 | 近い（「TBDが無い場合以外は」そのまま） | 1条件ぶん遠い |
| 判定に残る主観 | 「TBDがあるか」のみ。`design.md`を見れば決まる | 「ユーザーへ問わずに確定するか」が加わる。「調べれば分かるか」の判断が入る |
| §5 Step 3判定表への波及 | あり。`調査`・`技術検証実装`がdiscussionの代替でなくなるため、表の意味と見出しを書き換える必要がある | なし。表と整合する |
| code読解だけで決まるTBDの扱い | discussionを起動し、その中で事実を集めて提案の根拠にする | discussionを起動せず、確定した事実を`design.md`へ直接反映する |

案bを推奨する理由は二つある。

一つ目は、案aが§5 Step 3判定表への波及を伴い、この論点のdecision boundary（§4 trigger文の形）を越えることである。表の意味を変えるかどうかは独立して採否を決められる判断であり、同じdecisionへ混ぜるべきではない。

二つ目は、案bで加わる「ユーザーへ問わずに確定するか」が、イテレーション0で排除した予測とは性質が違うことである。排除したのは「何往復かかるか」という未来の予測だった。案bの条件は「この不確実性はcodeを読めば決まるか」という、現在の対象についての事実判断である。誤っても、調べた結果で決まらないと分かった時点で開始できる。

ただし案aにも利点がある。判定を一つに減らすほど、外しにいける場所は減る。「思考停止で起動」という要求へは案aのほうが忠実である。§5 Step 3判定表の書き換えを許容するなら案aを採る余地がある。

#### 提案1へのフィードバック

**結果:** 受諾。案bを採用。

> bでいいよ

### 決定

`plugins/tumeda-dev/skills/task-design/SKILL.md` を次の状態にする。反映済み。

**§4「discussionを開始する時と返却後」**: discussionを既定で開始する形にした。開始しない条件を閉じた集合として二つだけ列挙し、それ以外は判断せず開始する。列挙は「`design.md`に未解消のTBDが一つも残らず新たな論点も生じていない」と「残る不確実性がユーザーへ問わずに確定する（Step 3の`調査`または`技術検証実装`だけで事実が決まる）」である。往復回数の予測、結論を既に持っているか、選択肢へ畳めるかは開始しない理由にならないこと、調査で得た事実だけでは設計が決まらないと分かった時点で開始することを明記した。結論を持っている論点ほど記録価値が高い理由の段落は維持する。

**§5 Step 3の判定表**: discussion行を「ユーザーへ問わなければ確定しない」へ置き換え、表の直後に「解消手段はこの三つだけである。`確認`、`念のため聞く`、`選択肢を出して選んでもらう`は第四の手段ではなく、すべてdiscussionである」を追記した。

**§6 NG集Fの1項目目**: 条件節を「議論開始後に」から「`design.md`の内容が変わる問いをユーザーへ出したが、その時点でdiscussion fileに対応するproposalが保存されておらず」へ置き換えた。

設計上の要は、既定をfail-openにしたことである。開始条件を列挙する形は、条件が観測可能であっても「自分は該当するか」の照合を残し、その照合が外しにいける場所になる。非起動条件を閉じた集合で書くと、列挙に当たらない限り起動するため、判定を誤ってもdiscussionは起動する側へ倒れる。

案a（非起動条件をTBDゼロの一つに絞る）は採らない。§5 Step 3判定表の意味と見出しの書き換えを伴い、この論点のdecision boundaryである§4 trigger文の形を越えるためである。表の意味を変えるかどうかは独立して採否を決められる判断であり、同じdecisionへ混ぜない。

`think-through`と§5 Step 2は変更しない。選択肢提示toolに関する規定も新設しない。理由はイテレーション0の提案0が持つ「変更しないもの」表にある。`facilitate-discussion`を変更しないことは論点7で別途決定した。`steering`に残る同型の予測条件は論点9が扱う。

## 論点7: facilitate-discussionの起動判定を、caller所有の無条件起動へ変える

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: 常に真になる条件をgateから外し、consumer駆動の起動を無条件にする

#### 提案0

`plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md` の2箇所を変更する。diff外の範囲は変更しない。

##### 変更1: `## 起動gate` section 全体（19〜27行目）

```diff
-## 起動gate
-
-次のいずれかに該当するときだけ適用する。
-
-1. ユーザーが `$facilitate-discussion` を明示した。
-2. ユーザーが議論をMarkdownへ継続記録するよう明示した。
-3. `task-design`、`steering` 等のconsumer skillが、保存を伴う議論workflowとして明示適用した。
-
-通常の質問、説明、短い相談から暗黙起動してはならない。
+## 起動
+
+このskillは起動可否を判断しない。起動条件はcallerが所有する。
+
+| caller | このskillが行う起動判定 |
+| --- | --- |
+| consumer skill（`task-design`、`steering`等） | 行わない。consumerが適用した時点で起動する |
+| ユーザー | `$facilitate-discussion`、または議論のMarkdown保存・追記の明示で起動する |
+
+起動しない条件は一つだけである。`discussion_directory`を解決できない場合、起動せずcallerへ用意または再指定を求める。
+
+「今回は短い相談だ」「もう結論が出ている」「選択肢を出して選んでもらうだけだ」という分類で起動を見送らない。consumerがこのskillを適用した時点で、記録を伴う議論として扱う判断は済んでいる。ここで同じ判定をやり直すと、consumer側とこのskill側の二箇所で同じ誤分類が起き、二箇所とも起動しない方向へ倒れる。
```

##### 変更2: frontmatter `description` の trigger 文

```diff
-description: 明示された議論を論点単位で進行し、委託されたテーマ内の提案、feedback、決定、親子関係を指定directoryのMarkdownへ継続記録する。合意済みの議論も再合意なしで記録し、記録漏れへ後から気づいた場合は結論だけでなく議論の変遷を再構成するが、会話から確認できない提案や合意は補完しない。ユーザーが `$facilitate-discussion`、議論のMarkdown保存・追記を明示した時、またはconsumer skillが保存を伴う議論workflowとして明示適用した時だけ使う。通常の質問、説明、短い相談には使わない。
+description: 明示された議論を論点単位で進行し、委託されたテーマ内の提案、feedback、決定、親子関係を指定directoryのMarkdownへ継続記録する。合意済みの議論も再合意なしで記録し、記録漏れへ後から気づいた場合は結論だけでなく議論の変遷を再構成するが、会話から確認できない提案や合意は補完しない。ユーザーが `$facilitate-discussion` または議論のMarkdown保存・追記を明示した時に使う。通常の質問、説明、短い相談には使わない。consumer skillが明示適用した場合は、このtrigger条件を再評価せず起動する。
```

##### 変更しないもの

| 対象 | 変更しない理由 |
| --- | --- |
| `description`の「通常の質問、説明、短い相談には使わない」 | 残す。この句が守るのはdescription経由のauto-selection、すなわちユーザーのcasual chatからこのskillが勝手に選ばれる経路だけである。bodyから外しdescriptionだけに残すことで、consumer駆動の起動がこの句を読んで見送る経路が断たれる |
| 「1. skillを起動する」の起動phase完了gate | 起動可否ではなくdiscussion file解決の判定であり、性質が違う |
| 「論点levelで守る契約」のscope判定（結論が変わるとdiscussion目的または実装範囲が変わるか） | 検討したが変更しない。consumerが設計上の不確実性として渡した論点は定義上`design.md`を変えるため必ず通る。ここを外すと、discussion目的と無関係な事項まで論点化してdiscussion fileが劣化する |

#### 提案背景

##### 起点

論点6の決定を反映した直後、ユーザーが次を指摘した。

> というか、faciliate-discussionなんて、skillからしか使われないんだから、skillからの使われ方で起動されないバリエーションがある時点でポンコツ。汎用にしてtriggerヒットしないなら汎用じゃなくていい。使うときは毎回使うで終わりだし。

##### 診断

**事実1: このskillは自力で起動しない。** 呼ぶのはconsumer skill（`task-design`、`steering`）か、ユーザーの明示（`$facilitate-discussion`、記録の依頼）だけである。

**事実2: gate条件3は評価時点で常に真になる。** 「consumer skillが保存を伴う議論workflowとして明示適用した」を読んでいるのは、consumerが適用したからこのskillの本文に到達している時である。評価時点で偽になり得ない条件はgateではない。

**事実3: 常に真の条件を「〜するときだけ適用する」という枠に入れると、判定する対象がないのに判定を促す。** さらに末尾の「通常の質問、説明、短い相談から暗黙起動してはならない」が、consumer駆動の起動に対しても読まれる。

三つを合わせると、次の直列failureが成立する。論点6で直した機構は、task-design側で「これは議論ではなく確認だ」と分類してdiscussionを外すものだった。仮にその誤分類を抱えたままこのskillのgateへ到達した場合、末尾行が同じ誤分類を追認する。**同じ誤分類が直列に二回効き、二回とも起動しない方向へ倒れる。** gateがfail-openではなくfail-closedに設計されているため、判定の誤りがそのまま無動作になる。

ユーザーの「skillからの使われ方で起動されないバリエーションがある時点でポンコツ」は、この直列failureを指している。「使うときは毎回使うで終わり」は、consumer経路に判定を置かないことを指している。

##### 二つの起動経路を分ける理由

このskillへの到達経路は性質が異なる二つに分かれる。

| 経路 | 判定が必要か | 判定の置き場所 |
| --- | --- | --- |
| consumer skillが明示適用する | 不要。consumerのtriggerが判定済み | consumer側（論点6で修正済み） |
| ユーザーのchatから選ばれる | 必要。casual chatで起動するとdiscussion fileが無駄に増える | `description`（selection時に評価される） |

現行gateはこの二つを一つのリストへ混ぜている。変更1は経路を分け、consumer経路から判定を消す。変更2は`description`側に経路2の判定だけを残し、consumer経路が`description`のtrigger条件を再評価しないことを明記する。

「汎用にしてtriggerヒットしないなら汎用じゃなくていい」への対応がこれである。auto-selectionの精度を上げる方向へは進まず、consumer subroutineとして無条件に動く方向へ寄せる。

##### 論点6の決定との関係

論点6では「`facilitate-discussion`の起動gateは変更しない。consumer側（task-design）のtriggerを直せば足りる」と判断した。この判断はユーザーの指摘で覆る。

論点6のdecision boundary（`task-design/SKILL.md`の3箇所をどう書くか）自体は変わらないため、論点6のiterationは変更しない。論点7が合意された時点で、論点6の`決定`末尾にある「`facilitate-discussion`... は変更しない」の記述だけを現在有効な内容へ同期し、典拠として論点7を示す。

##### 提案0が満たす必要のある条件

1. consumer駆動の起動に判定を残さない
2. casual chatからのauto-selectionは防いだままにする
3. 論点6で直した誤分類が直列に二回効く経路を断つ
4. 変更範囲が`facilitate-discussion/SKILL.md`に閉じる

変更1が条件1と条件3、変更2が条件2、「変更しないもの」の表が条件2と条件4を示す。

#### 提案0へのフィードバック

**結果:** 却下。原因の所在が誤っている。`facilitate-discussion`は今回の失敗に関与していない。

> 論点2について間違えた。faciliate-disucussionは何も悪くないわ。task-discussion側がスキップすることがあるのが問題だったわ。具体では「ユーザーの回答によって`design.md`の内容が変わる問いを、これからユーザーへ出そうとしている。」で回避できるだろうし

引用中の`論点2`は移設前の採番であり、本fileの論点7を指す。

提案0が想定した直列failureは、consumerが既に誤分類を抱えたまま`facilitate-discussion`のgateへ到達する場合にだけ成立する。その誤分類は論点6が塞ぐ対象であり、塞いだ後は到達しない。したがって提案0は、既に塞いだ問題に対する二段目の防御にすぎない。gate条件3が評価時点で常に真になるという観察自体は誤りではないが、それだけでは変更の根拠にならない。

### 決定

`plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md` は変更しない。`## 起動gate`と`description`のtrigger文を現状のまま維持する。

consumerが正しく到達すれば現行gateは通る。gate条件3が常に真であることは、consumerのtriggerが健全である限り無害である。原因はconsumer側の起動判定にあり、その修正は論点6が所有する。

## 論点8: 「選択肢に畳めたことは議論が不要になったことを意味しない」をpresenting_options.mdへ補助として追加するか

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: 場面fileの補助節として、畳めたことの意味を書く

#### 提案0

`plugins/tumeda-dev/docs/think_standards/presenting_options.md` の末尾へ補助節を追加する。既存の主軸（a/b/c形式）と本文は変更しない。

```diff
 - 使い分け: 元資料（discussion.md 等）にすでに A/B/C が振られている場合は `1/2/3` を使う（混同を防ぐため）
+
+## 補助: 選択肢に畳めたことは、議論が不要になったことを意味しない
+
+選択肢へ畳めるかどうかは、自分が結論を持っているかどうかにしか依存しない。ユーザーの判断が要るかどうかとは無関係である。
+
+- やってしまいがちな行動: 自分の中で答えが出ている論点を「議論ではなく確認だ」と分類し、選択肢と推奨だけを提示して済ませる
+- それをやると何が起きるか: 採らなかった案と採らなかった理由が自分の中にしか残らない。結論を持っている論点ほど記録価値が高いのに、結論を持っている論点ほど記録が省かれるという逆相関が起きる
+- 正しい判断のための問い: 「この選択肢が畳めたのは、ユーザーの判断が不要になったからか、それとも自分が先に答えを出したからか」
```

#### 提案背景

##### 候補の出所

論点6のdecisionを対象成果物へ即時反映したため、`facilitate-discussion`の契約に従い`doc-enricher`を提案modeで一度起動した。その結果として出た候補である。

`presenting_options.md`は現在705バイトで、内容はa/b/c形式という表示形式だけを扱う。既存の「使い分け」行が「元資料（discussion.md 等）にすでに A/B/C が振られている場合」に触れており、選択肢がdiscussion fileから来ることを前提として示唆しているが、それが常態であるとは書かれていない。今回の違反はこの前提が明文化されていない箇所で起きた。

##### 維持規律への適合

`think_standards/evolution_policy.md`は「各場面の主軸は 1 個に絞る（複数立てると主軸が薄まる）」とし、「変えてよいこと」に「補助節の追記」を挙げている。提案0は主軸（a/b/c形式）を変更せず、`## 補助:`として追記する。見出しの付け方と`やってしまいがちな行動 / それをやると何が起きるか / 正しい判断のための問い`という項目立ては、`core.md`の`### 補助: 既存記述と競合する修正の扱い方`に揃えた。

##### 当初案から削った内容

`doc-enricher`の初回提案には「記録先を持つworkflowの中にいるなら、提示より先に記録先へ保存する」という項目があった。これは削る。`facilitate-discussion`の不変条件「ユーザーへ合意を求める前に、proposal、提案背景、空のfeedback見出しをdiscussion fileへ保存する」と、論点6で確定した`task-design`のtriggerが既に所有しており、この議論全体を通じて禁じてきた重複の追加にあたる。

残す内容は、記録processの契約ではなく、選択肢を提示する場面そのものの思考の作法だけである。

##### 論点6で`think-through`を変更しないと判断したこととの関係

論点6のイテレーション0では「『答えを持っている論点ほど記録価値が高い』は思考の作法ではなく記録processの契約であり、`think-through`の担当外」と判断した。提案0はこの判断と衝突しない。

衝突しない根拠は、提案0が主張するのが記録の要否ではなく、「選択肢に畳めたこと」が何を意味するかという解釈だからである。畳めるかどうかは自分が結論を持っているかにしか依存しないという命題は、記録先の有無に関係なく成立する。`presenting_options.md`が既に持つ「選択肢を提示する」という場面の内側にある。

##### 提案0が満たす必要のある条件

1. 既存の主軸を薄めない（補助として追記する）
2. `facilitate-discussion`および`task-design`が所有する記録processの契約を重複させない
3. 論点6で`think-through`を変更しないとした判断と矛盾しない
4. 既存の`think_standards`の記法へ揃える

#### 提案0へのフィードバック

**結果:** 受諾。

> 論点3についてはok。

引用中の`論点3`は移設前の採番であり、本fileの論点8を指す。

### 決定

`plugins/tumeda-dev/docs/think_standards/presenting_options.md` の末尾へ、提案0のdiffどおり`## 補助: 選択肢に畳めたことは、議論が不要になったことを意味しない`を追加する。反映済み。主軸（a/b/c形式）と既存本文は変更しない。

`doc-enricher`の初回提案にあった「記録先を持つworkflowの中にいるなら、提示より先に記録先へ保存する」は採らない。`facilitate-discussion`の不変条件と、本fileの論点で確定した`task-design`のtriggerが既に所有しており、重複になるためである。

## 論点9: steering skillに残る同型の予測条件を直すか

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: steering側のdiscussion開始判定を扱うか判断する

#### 提案0

`plugins/tumeda-dev/skills/steering/SKILL.md` の「discussion.mdの使い方（随時）」にある開始判定から、予測条件を外す。

```diff
-`discussion.md`は特定phaseへ縛らず、task-design起動後に記録価値のあるsteering固有の思考が生じた時に随時追記する。ユーザーがorchestration上の論点・質問・要議論を提起した場合、またはsteering agentのruntime上の検討が複数往復を要するdecisionになった場合に通常discussionを開始する。通常flowの初回task-design起動前には開始しない。
+`discussion.md`は特定phaseへ縛らず、task-design起動後に記録価値のあるsteering固有の思考が生じた時に随時追記する。ユーザーがorchestration上の論点・質問・要議論を提起した場合、またはsteering agent自身のorchestration上の判断についてユーザーへ問いを出そうとしている場合に通常discussionを開始する。往復回数の予測、assistantが既に結論を持っているか、論点が選択肢へ畳めるかは、開始しない理由にならない。通常flowの初回task-design起動前には開始しない。
```

#### 提案背景

論点6のイテレーション0で`task-design`から排除した「複数往復を要するdecisionになった場合」という予測条件が、`steering`側にそのまま残っている。同じagentが同じ誤読をする経路である。

ただし`task-design`と単純に同型ではない。`task-design`のdiscussionは設計の不確実性を扱い、TBDがある限り常に必要になるため、既定を起動側へ倒す反転（論点6のイテレーション1）が成立する。`steering`のdiscussionはorchestration上の思考を扱い、通常flowでは発生しないほうが多い。既定を起動側へ倒すと、記録すべきでない事項まで`discussion.md`へ入る。したがって非起動条件を書く反転はそのまま適用できず、予測条件を観測可能な行為へ置き換えるだけに留める案とした。

##### 論点6で案bを採った後の整合

論点6は`task-design`側で既定をfail-openにし、非起動条件を閉じた集合として二つ列挙する形（案b）を採った。`steering`へ同じ反転をそのまま持ち込まない。

`task-design`のdiscussionは設計の不確実性を扱うため、TBDがある限り常に必要になる。既定を起動側へ倒しても過剰にならない。対して`steering`のdiscussionはorchestration上の思考を扱い、通常flowでは発生しないほうが多い。既定を起動側へ倒すと、記録すべきでない routine な進行判断まで`discussion.md`へ入り、fileが劣化する。この非対称は`steering`側に既にある「通常flowの初回task-design起動前には開始しない」という制約とも整合する。

したがって提案0は反転を行わず、予測条件（「複数往復を要するdecisionになった場合」）だけを観測可能な行為（「ユーザーへ問いを出そうとしている場合」）へ置き換える。除外する判定材料の語彙は論点6の決定へ揃え、`往復回数の予測`、`既に結論を持っているか`、`選択肢へ畳めるか`の三つを明示する。

この形でも、`steering`が単独でユーザーへ問いを出す経路はfail-openになる。問いを出そうとしている事実は、これから行う自分の行為だけで判定できるためである。

#### 提案0へのフィードバック

**結果:** 受諾。

> ok

### 決定

`plugins/tumeda-dev/skills/steering/SKILL.md` の「discussion.mdの使い方（随時）」にある開始判定から、予測条件「steering agentのruntime上の検討が複数往復を要するdecisionになった場合」を外し、「steering agent自身のorchestration上の判断についてユーザーへ問いを出そうとしている場合」へ置き換える。あわせて、往復回数の予測、assistantが既に結論を持っているか、論点が選択肢へ畳めるかが開始しない理由にならないことを明記する。反映済み。

`task-design`で採った反転（既定をfail-openにし、非起動条件を閉じた集合として列挙する）は`steering`へ持ち込まない。`steering`のdiscussionはorchestration上の思考を扱い、通常flowでは発生しないほうが多いため、既定を起動側へ倒すとroutineな進行判断まで`discussion.md`へ入る。既存の「通常flowの初回task-design起動前には開始しない」という制約とも整合しない。

この形でも、`steering`が単独でユーザーへ問いを出す経路はfail-openになる。問いを出そうとしている事実は、これから行う自分の行為だけで判定できるためである。

反映後、`plugins/tumeda-dev/skills/`配下に残る「複数往復」は`steering/SKILL.md`の`discussion.md`用途説明1件だけである。これは記録対象の説明（「複数往復で検討した過程」）であり起動判定ではないため、変更しない。
