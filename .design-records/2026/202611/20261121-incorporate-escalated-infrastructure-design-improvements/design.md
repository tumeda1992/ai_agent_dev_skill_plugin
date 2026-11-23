# Design: 利用先の作業から引き渡された、基盤の設計に関する 2 件の改善提案を取り込む

## 元の依頼内容

利用先 repository の一つの作業（AWS の基盤への変更を、Terraform と GitHub Actions を通して本番へ届ける経路を作る。上位の roadmap の一 phase として子の steering で行う）の design 中に出た、plugin の skill・docs への改善提案である。`escalate-plugin-skill-fix` で引き渡す。元の作業は design の途中（Terraform の置き場、state、GitHub Actions の role の数まで決定）で中断している。利用先固有の情報（repository 名、path、commit、issue・PR の番号、AWS の account の値）は除いた。

### 合意の範囲（全件に共通）

- 引き渡すことへの合意: 利用者が自分から「エスカレ対象ある」と述べ、二つ目も「別エスカレ論点で」と依頼した。保留の指定は無い。
- 提案の中身への合意: 各件に書く。利用者の原文で確かめられない中身（置き場、文面、assistant が書いた規則文や例）は未合意であり、この repository の設計で改めて合意を取る。

利用者の原文（repository 名だけを伏せた）:

> 1個エスカレ対象ある。完全汎用でどこでも使えるものじゃないけど、terraform建てる時の型。今回丁寧にオーダーメイドに論点整理して考えてもらってるけど、結局ほぼ同じ形になるから、[参考 repository A]参考にして、差分だけ合意するようにしたい。[参考 repository A]性を抜きにして汎用の形で転写してもいいけど、そうすると同期が必要になるから、基本的に[参考 repository A]の最新を見るとディティールまで含めて真似できる。変わりにくい大枠の部分は意味抜きして汎用にしても良いかもだけど。[参考 repository B]のaws batchとかも。あと、どうせ全てでreview環境作るから、そのエッセンスも別エスカレ論点で。

### 1. Terraform で基盤と適用経路を建てる時は、参考実装の最新を読み、差分だけを合意する

- 提案: 利用者が、同じ形の基盤を既に持つ別の repository（参考実装）を持つ時、task-design は Terraform の置き場、state、GitHub Actions の role、workflow 等を一から論点にしない。参考実装の最新を読んで写し、参考実装との差分だけを論点にする。
  - どの repository を参考実装とするかは、利用先の repository の context instance が宣言する（plugin へ repository 名を書かない）。
  - 変わりにくい大枠は、plugin の docs に汎用の形で書いてもよい。詳細は参考実装の最新を正とし、plugin へ写さない。写すと、参考実装が変わるたびに同期が要る。
  - 参考実装は一つとは限らない。基盤の部分ごとに参考になる repository が違う（例: 中央と app ごとの置き分けは参考 A、job の基盤（AWS Batch）は参考 B）。
- 具体例:
  - 利用先の作業で、Terraform の置き場、state の置き場と排他、GitHub Actions の role の数（plan 用と apply 用）を、それぞれ一から論点にした。三つとも、利用者の別の repository（参考 A）と同じ形に落ちた。
  - 置き場の論点では、参考 A の file の一覧を絞り込んだ出力を先頭 40 行で打ち切ったまま全体として扱い、構成を読み違えて利用者に訂正された。参考 A は、app をまたいで使うもの（state の bucket、GitHub Actions の role）を root の中央の directory に、一つの app だけが使う resource をその app の directory の下に置き、中央の適用の root から各 app の定義を module として呼ぶ形だった。もう一つの参考（参考 B）は app が分かれておらず、root の一か所に置く形である。
- 根拠: 利用者の原文「結局ほぼ同じ形になるから、…差分だけ合意するようにしたい」「汎用の形で転写してもいいけど、そうすると同期が必要になるから、基本的に…最新を見るとディティールまで含めて真似できる」。
- 中身の合意: 進め方（参考実装の最新を見て差分だけを合意する、大枠は汎用に抜いてもよい、詳細は写さない）は利用者の原文による。置き場（skill か docs か、context instance での宣言の形）と文面は未合意。「参考実装は部分ごとに違ってよい」は原文の「[参考 B]のaws batchとかも」からの assistant の読みで、未合意。

### 2. review 環境の要点

- 提案: 利用者は、どの repository でも review 環境（本番とは別の、動作確認のための環境）を作る。その要点を plugin に持つ。
- 具体例:
  - 利用先の作業の design は、Terraform の置き場の論点で「本番だけを持ち、review 用の環境は作らない」と決めていた（上位の design が本番とローカルだけを持つため）。利用者の「どうせ全てでreview環境作る」は、この前提と食い違う。
  - 参考 A の review 環境は、次の形を持つ（assistant が参考 A の文書から読んだもの。利用者の原文には無い）。本番と同じ module を stage 違いで呼び、resource を環境ごとに別に持つ。停止している状態を定義の既定にし、起動は一時的な逸脱として扱う（apply が停止側へ倒れる）。起動・停止の script と、止め忘れの検知を持つ。存在するだけで時間課金される resource を構成に含めない。作業 branch から review の apply を手動で試せ、destroy を含む plan では止まる。
- 根拠: 利用者の原文「どうせ全てでreview環境作るから、そのエッセンスも別エスカレ論点で」。
- 中身の合意: review 環境の要点を plugin に持つこと、提案 1 と別の論点で扱うことは原文による。要点の中身、置き場、文面は未合意。上の参考 A の形は assistant の読みである。

### 作業の途中で足された依頼

論点5 の応答で、利用者が次を足した。

> あと、[参考 repository B]か[参考 repository A]にあるお金の判断の話も別論点としてかいておきたいかな。xのapiを使え方じゃなくてインフラコストの方。applyしてから止めるのもその思想のhow。ゼロコスト志向ではないが個人開発で無尽蔵にお金は使えない。だからログ記録で月数円掛かろうと必要だったら問題ない。ただ、100円とかを安易に許容すると10個で1000円でランニングコストにそれがかかり続けるのは負担、みたいな話があった気がする

（原文の repository 名は伏せた。どちらも利用者の別の repository で、参考実装として扱う。）

---

## TL;DR

利用先 repository で、Terraform で基盤と適用経路を建てる作業の design を、置き場・state・role と一から論点にして進めたところ、どれも利用者の別 repository（参考実装）と同じ形に落ちた。利用者は、参考実装の最新を読んで差分だけを合意する進め方と、どの repository でも作る review 環境の要点を、plugin に持たせたいと示した。この作業で、2 件それぞれについて取り込むか、どこに何を書くかを決めて書く。

2 件と、作業の途中で足された 1 件（基盤の費用の判断）をすべて取り込んだ。どれも基盤に固有の知識のため、すべての設計で通る skill の手順には足さず、`docs/development_standards/infrastructure/` の標準として置いた。task-design は設計前調査でこの群をすべて読むため、基盤を扱う作業でそこに届く。参考実装に倣う進め方は `reference_implementation.md`、review 環境の要点は `review_environment.md`、費用の判断は `cost_judgment.md` に書き、どの repository に倣うかは利用先の context instance の `### 基盤の参考実装` に宣言させる。置き場の議論で起きた失敗（足す先に合わせて中身を言い直してから範囲を照合した）の再発防止として、`naming/core.md` に失敗例を足した。配布 version は 9.0.2 から 9.0.3（PATCH）へ上げた。

---

## 完成後の姿

### 文書にまとめる知識と、その保ち方

**文書にする知識:**

- 暗黙知・散らばった知識・困りごと（元の依頼内容の 2 件）
  1. 同じ形の基盤を持つ参考実装があっても、task-design がそれを前提にせず、置き場・state・role 等を一から論点にした。参考実装の構成も途中で打ち切って読み、読み違えた。
  2. 利用者はどの repository でも review 環境を作るが、その要点が plugin に無く、利用先の design は review 環境を作らないと決めていた。
- 再び使える原則へ引き上げるもの:
  1. 同じ形の基盤を持つ参考実装があれば、その最新を全体まで読み、同じ形で足りる部分は骨格で一度に合意し、差分だけを論点にする。design には参考実装への参照ではなく作るものを具体的に書き、参考実装の細部は plugin へ写さない。
  2. 基盤を持つ repository は review 環境を作ることを既定にし、本番と同じ定義を環境の名前だけ変えて呼び、止めている状態を既定にして使う時だけ起動し、review 環境に閉じる操作を定義する。
  3. ゼロの費用は目指さないが、継続的な費用は一件の額ではなく積み上がった額で考える。課金の型を分け、防ぐ損失と並べ、上限は金額で書く。
  4. 中身を足す先の範囲を照合する時は、足す先に合わせて言い直した中身ではなく、元の中身で照合する。

**読者と、読んでできるようになる判断:**

- 1〜3: 基盤（cloud の resource、Terraform の定義、本番へ届ける workflow）を設計する assistant。task-design の設計前調査で `docs/development_standards/` の配下を読む時に、`infrastructure/` の三つの文書に届く。参考実装に倣って差分だけを論点にでき、review 環境を作るかと形を決められ、resource を入れるかを費用で判断できる。
- 4: 名前の付いたものへ中身を足す人（skill・docs を書く assistant）。足す先の範囲を照合する時に、照合の相手が元の中身かを確かめられる。

**決まりの理由と、当てはめる範囲:**

件ごとに、下の「完成後の文書の構成」の中身・範囲に入る理由・入れないもの・文の組み立ての理由に書いた。

**内容を最新に保つ方法:**

正とする記述は、件ごとの文書（`naming/core.md`、`infrastructure/` の三つの文書、context instance の template の H3）である。`scripts/verification/validate-plugin.mjs` が、決まりの本体と、README・template・文書の間の導線を `requireText` で検査する。参考実装の細部（構成、権限、workflow の手順）とサービスごとの料金は plugin へ写さず、参考実装の最新とその時の公式の料金表を正とする。plugin に置くのは変わりにくい大枠だけで、写さないことで参考実装との同期を要らなくする。

**完成後の文書の構成:**

- 1（参考実装の最新を読み、差分だけを合意する）: 取り込む。
  - 置き場: `plugins/tumeda-dev/docs/development_standards/infrastructure/reference_implementation.md` を新しく作る。`plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` の `## task-design` に H3 `### 基盤の参考実装` を足す（この repository の値は「なし」）。`docs/development_standards/README.md` の「infrastructure/」に一行を足し、「維持規律」を直す。task-design の設計前調査には足さない。
  - 中身: 当てはめる範囲は、基盤（cloud の resource、Terraform の定義、それを本番へ届ける workflow）を建てる・変える作業。利用者が同じ形の基盤を別の repository（参考実装）に持つなら、その最新を、最初に読む場所から辿って構成の全体を確かめて読む。同じ形で足りる部分は個別の論点にせず、骨格の合意で一度に合意を取る。ただし design の完成後の姿には、参考実装への参照ではなく実際に作るものを具体的に書く（参考実装は読んだ時点の情報で後で変わるため）。個別の論点にするのは差分（同じ形にできない部分、同じ形だと目的に合わない部分、利用者が変えたい部分）だけ。参考実装は基盤の部分ごとに違ってよい。詳細は plugin の docs・skill へ写さない。どの repository を参考実装とするかは context instance の `### 基盤の参考実装` を見る。
  - 範囲に入る理由: 元の中身は基盤の作業に固有で、すべての設計で通る task-design の手順には入らない。`infrastructure/` は名前・入口の説明（基盤の作り方の判断基準）・既にある中身のどれにも入る。
  - 読み手に届く道筋: task-design は設計前調査で `docs/development_standards/` をすべて読むため、基盤の作業ではこの文書に届き、そこから context instance の宣言を引く。
  - template に置く理由: repository 名は `migration.md` により plugin に書かない。context instance は基盤を建てる前からある。template の `## task-design` は、`### UI確認環境` と同じく特定の作業でだけ使う repository 固有の fact を持つ。
  - 文面: `reference_implementation.md` は次の内容にする。

    ````markdown
    # 参考実装に倣って基盤を建てる

    基盤（cloud の resource、Terraform の定義、それを本番へ届ける workflow）を建てる・変える時に、利用者が別の repository に持つ同じ形の基盤（参考実装）をどう使うかの判断基準。

    ## 参考実装の最新を読み、差分だけを論点にする

    利用者が同じ形の基盤を別の repository に既に持つなら、その最新を読み、同じ形を最初の案にする。

    - 最初に読む場所から辿り、構成の全体を確かめる。file の一覧や文書を途中で打ち切って読まない。
    - 参考実装と同じ形で足りる部分は、部分ごとに論点を立てず、骨格の合意で一度に合意を取る。
    - ただし design の完成後の姿には、参考実装への参照ではなく、実際に作るもの（directory の構成、resource と権限、workflow の手順等）を具体的に書く。参考実装は読んだ時点の情報で、後で変わるため、参照だけでは作るものが design から読めなくなる。どの参考実装をいつ読んだかは、design の付録の「前提とする既存仕様」に書く。
    - 論点にするのは、参考実装との差分だけである。差分は、この repository で同じ形にできない部分、同じ形にすると目的に合わない部分、利用者が変えたい部分である。
    - 参考実装は、基盤の部分ごとに違ってよい。例えば、app ごとの resource と app をまたぐ resource の置き分けは一つの repository に、job の基盤は別の repository に倣う。

    理由:

    - 同じ利用者の基盤は、どの repository でもほぼ同じ形に落ちる。一から論点を立てると、候補を比べて結局同じ形を選ぶ往復だけが増える。
    - 参考実装は、細部（role の権限、workflow の手順、運用の文書）まで動いている実物である。最新を読めば、細部まで含めて倣える。

    どの repository を参考実装とするかは、利用先の context instance の `## task-design` にある `### 基盤の参考実装` に書く。宣言が無ければ、参考実装は無いものとして、従来どおり論点を立てる。

    判断の問い: **「この論点は、参考実装との差分か。参考実装と同じ形で足りる部分を、改めて論点にしていないか」**

    ## 参考実装の細部を plugin へ写さない

    参考実装の細部（directory の構成、role の権限、workflow の手順）は、plugin の docs・skill へ写さず、参考実装の最新を正とする。写すと、参考実装が変わるたびに同期が要り、古い写しが正として読まれる。
    細部を書き起こす先は、その基盤を作る利用先の design である（上の「参考実装の最新を読み、差分だけを論点にする」）。

    ## やってしまいがちな失敗

    - 参考実装を候補の一つとして扱い、置き場、state、role を一つずつ論点にする。
        - Terraform の置き場、state の置き場と排他、GitHub Actions の role の数を順に論点にし、三つとも参考実装と同じ形に落ちた。
    - 参考実装の file の一覧を、絞り込んだ出力の先頭だけで読み、構成を読み違える。
        - app ごとの resource を app の下に、app をまたぐ resource を中央の directory に置く構成を、app の下の directory だけだと読み、利用者に訂正された。
    ````

    template の `## task-design` の最後に H3 `### 基盤の参考実装` を足す。HTML comment に、基盤の部分ごとに参考にする repository と最初に読む場所を書くこと、読み方と論点の決まりは `reference_implementation.md` が持つこと、無ければ「なし」と書くことを書き、この repository の値は「- なし。このrepositoryは基盤を持たない。」とする。README の「infrastructure/」に「[reference_implementation.md](./infrastructure/reference_implementation.md) — 基盤を建てる・変える時に、利用者が別の repository に持つ同じ形の基盤（参考実装）をどう使うか。最新を読んで同じ形を最初の案にし、差分だけを論点にする。」を足し、「維持規律」を 18 file・約 80KB と、`infrastructure/` の一覧に reference_implementation を足した形に直す。

  - 文の組み立ての理由: 同じ群の `database_separation.md` と同じ形にし、設計の進め方の決まりと plugin の保守の決まりを見出しで分ける。参考実装への参照ではなく作るものを design に書くのは、参考実装が後で変わるためである（利用者の入力）。どの時点の形に倣ったかを辿れるよう、読んだ参考実装と日付を付録に残す。
  - 保ち方: `validate-plugin.mjs` が、二つの決まりの本体、作るものを design に書く箇条、README からの導線、template の H3 を `requireText` で検査する。
- 2（review 環境の要点）: 取り込む。
  - 置き場: `plugins/tumeda-dev/docs/development_standards/infrastructure/review_environment.md` を新しく作る。`docs/development_standards/README.md` の「infrastructure/」に一行を足し、「維持規律」を直す。
  - 中身（五つの要点）: (1) 基盤を持つ repository は review 環境を作ることを既定にし、作らない時は理由を design に書く。(2) 本番と同じ定義を環境の名前だけ変えて呼び、resource と state を本番と分ける。(3) 止めている状態を既定にし、使う時だけ起動する（定義は停止を正とする、起動は自動停止の予約と一緒、止め忘れは通知、時間課金の resource を入れない）。(4) 何が載っているかは保証せず、確かめる人が載せ、後始末は運用に入れない。(5) review 環境に閉じる操作（本番、開発の DB、本番の state、secret に影響しない操作）を定義し、AI agent は事前確認なしに行ってよい。閉じるかは対象の resource と state で決め、destroy を含む apply は含めない。
  - 入れないもの: 構成に依存する細部と、repository ごとに違う判断（DB を共用するか）。細部は `reference_implementation.md` に従い参考実装の最新を読む。
  - 範囲に入る理由: review 環境は本番と分けて持つ基盤の環境で、`infrastructure/` の環境の分け方の判断基準に入る。README の入口の説明は「開発と本番の環境の分け方」から「環境の分け方」へ広げる。
  - 文面: `review_environment.md` は次の内容にする。

    ````markdown
    # review 環境

    本番へ入れる前の変更を、開発機の外の実物で確かめる環境（review 環境）を、どう持つかの判断基準。

    ## 基盤を持つ repository は、review 環境を作る

    基盤を持つ repository は、review 環境を作ることを既定にする。作らない時は、その理由を design に書く。

    ローカルの環境では、cloud の service の上での動きや、開発機以外の端末（スマートフォンの実機等）からの操作を確かめられない。本番へ入れてから確かめると、確かめている間も本番が変わった状態になる。

    ## 本番と同じ定義を、環境の名前だけ変えて呼ぶ

    review 環境は、本番と同じ定義（Terraform の module）を、環境の名前（stage）だけ変えて呼ぶ。resource と state は本番と分けて持つ。

    - 同じ定義を呼ぶのは、review で確かめた構成と本番の構成をずらさないためである。
    - state を分けるのは、review への適用が本番の resource を対象にせず、逆も同じにするためである。

    ## 止めている状態を既定にし、使う時だけ起動する

    - 定義は止めている状態を正とし、起動は一時的な逸脱として扱う。起動中に apply すると、止まる側へ倒れる。
    - 起動は、決まった時間の後に止まる予約と一緒に行う。予約できなければ起動しない。
    - 止め忘れは通知で知らせる。
    - 存在するだけで時間ごとに課金される resource（load balancer、managed の DB、NAT gateway 等）を構成に入れない。

    review 環境を使う時間は短く、間が空く。起動したままにすると、使わない時間の費用が、使う時間の費用を大きく上回る。

    判断の問い: **「この resource は、止めている間も時間ごとに課金されるか。起動したまま忘れた時に、誰がいつ気づくか」**

    ## 何が載っているかは保証しない

    review 環境に何が載っているかは保証しない。確かめる人は、開く前に自分の確認の対象を載せる。確かめた後の後始末（元の状態へ戻す等）は運用に入れない。

    後始末を運用に入れると、それが守られなかった時に「前の人の後始末漏れ」という状態が生まれる。確かめる人が毎回自分で載せる前提にすれば、その状態自体が無くなる。

    ## review 環境に閉じる操作を定義する

    本番、開発の DB、本番の state、secret のどれにも影響しない操作を、review 環境に閉じる操作と定義する。AI agent は、閉じる操作を、操作ごとの事前確認なしに行ってよい。失敗しても止めて再実行すれば回復し、影響が review 環境の外へ出ないためである。

    - 閉じるかは、対象の resource と state で決める。`review` という名前が付いているかでは決めない。例えば、review 環境のための変更でも、本番の state への apply は閉じない。
    - destroy（作り直しを含む）を含む apply は、閉じる操作に含めない。消したものは apply し直しても戻らないことがあり、再実行で回復するという前提が崩れるためである。
    - 何が閉じる操作に当たるかの一覧は、その repository の review 環境の文書に書く。

    ## 細部は参考実装を読む

    起動・停止の手順、到達の経路、build の確かめ方、DB の向き先等の細部は、[`reference_implementation.md`](./reference_implementation.md) に従い、参考実装の最新を読む。

    ## やってしまいがちな失敗

    - 基盤の design で、上位の design が本番とローカルの環境だけを持つことを理由に、review 環境を作らないと決める。
        - 上位の design に review 環境が無いことは、作らない理由にならない。作らないなら、作らない理由を design に書く。
    ````

    README は、「infrastructure/」の入口の説明を「基盤（cloud の resource とその構成、環境の分け方）の作り方の判断基準。」に変え、「[review_environment.md](./infrastructure/review_environment.md) — 本番へ入れる前の変更を、開発機の外の実物で確かめる review 環境をどう持つか。作ることを既定にし、止めている状態を既定にして使う時だけ起動する。」を足し、「維持規律」を 19 file・約 84KB と、`infrastructure/` の一覧に review_environment を足した形に直す。
  - 保ち方: `validate-plugin.mjs` が、五つの要点の本体と閉じる操作の決まり（六つの文）、README からの導線を検査する。
- 3（基盤の費用の判断。作業の途中で足された依頼）: 取り込む。
  - 置き場: `plugins/tumeda-dev/docs/development_standards/infrastructure/cost_judgment.md` を新しく作る。README の「infrastructure/」に一行を足し、「維持規律」を直す。`review_environment.md` の「止めている状態を既定にし、使う時だけ起動する」の理由の段落に、この文書への参照を一文足す。
  - 中身: (1) ゼロの費用を目指さないが、個人の開発で無尽蔵には使わない。必要なものは月に数円かかっても入れてよく、月に 100 円程度の継続的な費用を一件ずつ許さない。継続的な費用は一件の額ではなく積み上がった額で考える。(2) 時間で課金されるものと、保存の量・件数で課金されるものを分ける。(3) 防ぐ損失を見積もり、手段を複数出して額を比べ、継続的な費用と防ぐ損失を並べる。(4) 要件の費用の上限は resource の種類ではなく金額で書く。(5) 使う時だけ起動する形は、この考え方を実現する手段の一つ。
  - 入れないもの: サービスごとの料金と性質。変わる細部であり、参考実装の最新かその時の公式の料金表を読む。
  - 範囲に入る理由: resource を構成に入れるかを費用で決めることは、基盤の作り方の判断基準に入る。
  - 文面: `cost_judgment.md` は次の内容にする。

    ````markdown
    # 基盤の費用の判断

    基盤の resource を構成に入れるかを、費用を根拠に決めるための判断基準。既に決まった構成を安くする作業（size の見直し等）は扱わない。

    ## ゼロを目指さないが、継続的な費用は積み上がった額で考える

    ゼロの費用を目指さない。ただし個人の開発であり、無尽蔵には使わない。

    - 必要なものは、月に数円かかっても入れてよい。例えば、ログの保存（[`log_retention.md`](./log_retention.md)）。
    - 月に 100 円程度の継続的な費用を、一件ずつ「この程度なら」と許さない。一件は小さくても、継続的な費用は積み上がる。10 件で、月 1,000 円を払い続けることになる。

    継続的な費用は、一件の額ではなく、積み上がった額で考える。一度だけかかる費用には、この積み上げの考え方は当てはまらない。必要かどうかで決める。

    判断の問い: **「この継続的な費用は、必要なものか。同じ程度の費用を、他の resource でも同じ理由で許していないか」**

    ## 課金の型を分けて考える

    課金の起き方が違うものを、同じ基準で扱わない。

    - 時間で課金されるもの: 存在するだけで積み上がる。止める手段が無いか、止めても課金が続く。構成に入れた時点で月額が決まるため、入れるかどうかが、そのまま費用の判断になる。
    - 保存の量・件数で課金されるもの: 量に比例し、量を抑える設定がある。入れるかではなく、どれだけ持つかの判断になることが多い。

    ## 入れるかを金額で決める手順

    1. その resource が防ぐ損失を、金額と期間で見積もる。「なんとなく危ない」で止めない。使う頻度が低い環境ほど、問題に気づくのが遅れ、損失が大きくなる。
    2. 同じ目的の手段を複数出し、額を比べる。額が桁で違うことがある。最初に思いついた手段で決めない。
    3. 防ぐための継続的な費用と、防ぐ損失を並べて比べる。

    金額で比べられない損害（データを失う等）を含む時は、この手順とは別に判断する。

    ## 要件の上限は、resource の種類ではなく金額で書く

    要件に費用の上限を書く時は、「時間で課金される resource を入れない」のように種類で書かず、「止めている間の費用を月 N 円以内にする」のように金額で書く。種類で書くと、損失を防ぐ少額の resource（止め忘れの通知等）まで機械的に退ける。

    ## 使う時だけ起動する

    止めている状態を既定にし、使う時だけ起動する形（[`review_environment.md`](./review_environment.md)）は、この考え方を実現する手段の一つである。使わない時間の費用を払わずに済む。

    ## サービスごとの料金は写さない

    どの service がいくらか、どの metric が無料か等の料金と性質は、この文書に持たない。料金は変わり、構成ごとに違うためである。参考実装の最新か、その時の公式の料金表を読む（[`reference_implementation.md`](./reference_implementation.md)）。

    ## やってしまいがちな失敗

    - 一件ずつ「月 100 円程度なら」と許し、継続的な費用を積み上げる。
    - 要件の「時間で課金される resource を入れない」という文言だけを根拠に、止め忘れを知らせる月十数円の通知まで退ける。防ぎたいのは無駄な継続的な費用で、損失を防ぐ少額の resource ではない。
    - 同じ目的の手段の額を比べず、最初に思いついた手段で決める。代わりになる無料の観測があることが多い。
    ````

    `review_environment.md` の「止めている状態を既定にし、使う時だけ起動する」の理由の段落の末尾に「費用の考え方は [`cost_judgment.md`](./cost_judgment.md) が持つ。」を足す。README の「infrastructure/」に「[cost_judgment.md](./infrastructure/cost_judgment.md) — 基盤の resource を構成に入れるかを費用で決める。ゼロは目指さないが、継続的な費用は一件の額ではなく積み上がった額で考える。」を足し、「維持規律」を 20 file・約 88KB と、`infrastructure/` の一覧に cost_judgment を足した形に直す。
  - 保ち方: `validate-plugin.mjs` が、考え方の本体二つ、上限を金額で書く決まり、README からの導線、`review_environment.md` からの参照を検査する。
- 再発防止として、`naming/core.md` の範囲の照合の規則に、照合の前に足す先に合わせて中身を言い直す失敗を足した（「設計中に反映を終えた変更」）。

---

## 要件（Requirements）

### MUST（必達）

- 2 件それぞれについて、plugin へ取り込むか（取り込む／取り込まない）を利用者と決め、取り込まない件は理由を残す。
- 取り込む件は、利用者が合意した置き場と文面で plugin の skill・docs へ書く。利用者の原文で確かめられない中身（置き場、文面、assistant が書いた規則文や例）は、この design の議論で合意してから書く。
- 書いた件ごとに、`scripts/verification/validate-plugin.mjs` へ契約の文が残っていることを検査する assertion を足す。
- 利用先 repository と、参考実装の repository の固有の情報（repository 名、path、commit、issue・PR の番号、AWS の account の値）を、skill・docs・この steering の成果物に書かない（`maintenance_policies/migration.md`）。
- 一つでも取り込んだら、配布 version を一度だけ上げる。上げる区分は `maintenance-plugin-context` の規約で決める。

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- 利用先 repository の design の続き（Terraform の置き場等の決定、review 環境を作らないとした決定の見直し）。利用先の作業へ戻ってから、そこで扱う。
- 利用先 repository への plugin の update と、利用先の進行中の作業への反映。`escalate-plugin-skill-fix` の「取り込みと反映」が扱う。

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出す。
- 取り込んだ件ごとに、合意した置き場に合意した文面があり、対応する assertion がある。
- 変更した範囲を `grep` で調べ、利用先と参考実装の repository の固有の情報が無い。

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 参考実装の詳細を plugin へ写すと、参考実装が変わるたびに同期が要り、古い写しが正として読まれる | plugin には変わりにくい大枠だけを置き、細部と料金は参考実装の最新・公式の料金表を正とする（`reference_implementation.md`、`cost_judgment.md` の「写さない」節） |
| 一つの repository の review 環境の形を、どこでも当てはまる要点として書き、別の構成の repository で合わない規則になる | 件ごとに、起点以外の具体 case（当てはまらないはずの case を含む）を当て、意図した場所へ落ちることを確かめる（task-design Step 4 の「新しい判断基準の検証」） |
| 汎用 skill へ足すことで、skill が独立した工程を抱え込む | 汎用 skill の更新は、構造案の採用前と編集後に `skill-update-review` を当てる |

---

## テスト方針

- 取り込んだ件ごとに、`validate-plugin.mjs` の assertion で、契約の文が残っていることを検査する。assistant が plugin repository の手元で `node` を実行して確かめる（今の環境で動く）。
- `node scripts/verification/validate-plugin.mjs`、`node scripts/verification/test-task-design-handoff.mjs`、`node --test plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.test.mjs` が通ることを、assistant が手元で確かめる。
- skill・docs の md は、書く前に assistant が `document-review` を当てる。
- 利用者が確かめる項目は無い。

---

## （付録）前提とする既存仕様

- `skills/task-design/SKILL.md` の PrepareStep 3（設計前調査）: 手順 2 で「類似実装を検索し、類似機能・命名・例外処理・test pattern・layer・責務境界を確認する」。対象はその repository の中で、別の repository にある参考実装を読むことは定めていない。
- `skills/tumeda-dev-plugin-context.md`（利用先の context instance の template）: `## task-design` に version bump、UI確認環境、Git / GitHub公開条件、Branch / issue 契約、作業の外へ残るactionの差し込みの H3 を持つ。参考実装の repository を宣言する項目は無い。
- `skills/maintenance-plugin-context/SKILL.md`: consumer が必要な fact を要求すると、instance の該当 section を返す。task-design が execution plan を設計する時に要求できる項目を列挙している。
- `skills/maintenance-plugin-context/maintenance_policies/migration.md`: 他の repository から得た内容は固有の情報を抜いて汎用知識だけを書く。repository 固有の fact が前提として必要なら、plugin へ直接書かず context instance から解決する。
- `docs/development_standards/infrastructure/`: 基盤（cloud の resource とその構成、開発と本番の環境の分け方）の作り方の判断基準。`log_retention.md`、`change_verification.md`、`database_separation.md` がある。review 環境を扱う標準は無い。

---

## （付録）変更の実行区分

### 設計中に反映を終えた変更

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/docs/development_standards/naming/core.md` | 「中身を足す前に、名前が約束する範囲に入るかを確かめる」に、照合の前に足す先に合わせて中身を一般的な言葉で言い直す失敗と、判断の問いを足した（task-design-discussion の論点2。1 の置き場の議論で起きた失敗の再発防止） | `validate-plugin.mjs`、`test-task-design-handoff.mjs`、`inspect-discussion.test.mjs` が通った。document-review（更新時観点）は指摘なし | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `scripts/verification/validate-plugin.mjs` | 上の判断の問いを検査する `requireText` を一行足した。検査する文を一文字変えると落ちることを確かめた | `plugin validation passed` | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `plugins/tumeda-dev/docs/development_standards/infrastructure/reference_implementation.md` | 1 の標準を新しく作った（参考実装の最新を読み、差分だけを論点にする。design には作るものを具体的に書く。細部を plugin へ写さない） | `validate-plugin.mjs`、`test-task-design-handoff.mjs`、`inspect-discussion.test.mjs` が通った。document-review（作成時観点）は指摘なし | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md` | `## task-design` に H3 `### 基盤の参考実装` を足した（この repository の値は「なし」） | `plugin validation passed`。document-review（更新時観点）は指摘なし | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `plugins/tumeda-dev/docs/development_standards/README.md` | 「infrastructure/」に一行を足し、「維持規律」を 18 file・約 80KB に直した（実際は 79,650 byte） | `plugin validation passed`。document-review（更新時観点）は指摘なし | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `scripts/verification/validate-plugin.mjs` | 1 の決まりの本体、作るものを design に書く箇条、README からの導線、template の H3 を検査する `requireText` を五行足した。検査する文を一文字変えると五つとも落ちることを確かめた | `plugin validation passed` | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `plugins/tumeda-dev/docs/development_standards/infrastructure/review_environment.md` | 2 の標準（review 環境の五つの要点）を新しく作った | `validate-plugin.mjs`、`test-task-design-handoff.mjs`、`inspect-discussion.test.mjs` が通った。document-review（作成時観点）は指摘なし | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `plugins/tumeda-dev/docs/development_standards/README.md` | 「infrastructure/」の入口の説明を「環境の分け方」へ広げ、一行を足し、「維持規律」を 19 file・約 84KB に直した（実際は 84,003 byte） | `plugin validation passed`。document-review（更新時観点）は指摘なし | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `scripts/verification/validate-plugin.mjs` | 2 の決まりの本体の六つの文と README からの導線を検査する七つの `requireText` を足した。検査する文を一文字変えると七つとも落ちることを確かめた | `plugin validation passed` | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `plugins/tumeda-dev/docs/development_standards/infrastructure/cost_judgment.md` | 3 の標準（基盤の費用の判断）を新しく作った | `validate-plugin.mjs`、`test-task-design-handoff.mjs`、`inspect-discussion.test.mjs` が通った。document-review（作成時観点）は指摘なし | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `plugins/tumeda-dev/docs/development_standards/infrastructure/review_environment.md` | 「止めている状態を既定にし、使う時だけ起動する」の理由に、`cost_judgment.md` への参照を一文足した | `plugin validation passed`。document-review（更新時観点）は指摘なし | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `plugins/tumeda-dev/docs/development_standards/README.md` | 「infrastructure/」に一行を足し、「維持規律」を 20 file・約 88KB に直した（実際は 88,254 byte） | `plugin validation passed`。document-review（更新時観点）は指摘なし | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `scripts/verification/validate-plugin.mjs` | 3 の考え方の本体二つ、上限を金額で書く決まり、README からの導線、`review_environment.md` からの参照を検査する五つの検査を足した。検査する文を一文字変えると五つとも落ちることを確かめた | `plugin validation passed` | [文書にまとめる知識と、その保ち方](#文書にまとめる知識とその保ち方) |
| `.claude-plugin/marketplace.json`（二箇所）、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`plugins/tumeda-dev/.codex-plugin/plugin.json`、`scripts/verification/validate-plugin.mjs` の `expectedRelease` | 配布 version を 9.0.2 から 9.0.3 へ上げた。docs の追加・変更と context instance の template への H3 の追加だけで、consumer が新たに呼べるもの（skill、parameter）は増えないため PATCH | `plugin validation passed`、`task-design handoff tests passed` | [MUST（必達）](#must必達) |

### 設計中に反映する、他の判断を待っている変更

なし

### tasklist・roadmapに載せて実行する変更

なし
