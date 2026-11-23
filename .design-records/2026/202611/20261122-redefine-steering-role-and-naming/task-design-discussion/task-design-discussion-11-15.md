# 議論記録

## 論点11: 記録の置き場所の準備を、別のskillにするか、task-designの内部指示にするか

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** まとめて考える（波及: 中。別skillにしなければ論点4で名前を付けるskillが一つ減る。他は小。根拠は`skill-update-review/find-split-candidates.md`の別skill化の条件）

論点3の検討記録「構造の見直し」の所見から立てた。論点1の決定は「task-designから呼ぶ小さなskillへ移す」としており、この論点の答えで論点1の決定の該当行を同期する。

### イテレーション0（論点11）: 置き場所の準備の形を提案する

#### 提案0（論点11）

##### a. task-designの内部指示にする（推奨）

- `task-design/`配下に置き場所の準備の内部指示のfileを置き、PrepareStep 2（配置先の確定）から読む。単独で起動しても、roadmapを実行するskillから起動されても、`escalate-plugin-skill-fix`から起動されても、同じ手順で置き場所を用意する。
- `name-work-directory`は今のまま別のskillに残す。命名だけを持ち、特定のworkflowを前提にしない汎用のskillとして作られているためである。
- 依頼文の「task-designに紐付く、置き場所を決めるskill」は、task-designの内部に置くことで、最も強く紐付いた形で満たす。
- 論点4で名前を付けるskillが一つ減る（内部指示のfileの名前は付ける）。

##### b. 別のskillにする

- 依頼文の書き方どおり、置き場所の準備を独立したskillにし、task-designから呼ぶ。
- 今これを呼ぶのはtask-designだけであり、呼ばれ方が一通りのskillが一つ増える。task-designを通さずに記録だけを置く作業は、今は無い（依頼文の「調査設計」も、task-designが調査を主な成果とするdesignとして扱う）。

##### aを推す理由

`skill-update-review/find-split-candidates.md`は「別skill化には現在の単独利用・他callerの具体要求を要し、将来予測だけでは独立させない」と定める。置き場所の準備を呼ぶのは今task-designだけである。task-designを通さずに記録を置く作業が出たら、その時に内部指示のfileを別のskillへ移せる。移すまでの間に作られるのは、task-designからの参照だけである。

#### 検討記録（論点11・イテレーション0）

##### 判断: 置き場所の準備に、task-design以外の呼び手があるか

**確かめたこと:** 今steeringを起動している担当（`escalate-plugin-skill-fix/SKILL.md`の「plugin repositoryで`steering`を`branch_from_basename=true`で起動する」、steering自身の6-2の子steering）と、論点1・3の決定後にそれらが起動する先。

**分かったこと:** `escalate-plugin-skill-fix`は論点1の決定後にtask-designを起動する（branchの作成をtask-designへ頼む）。roadmapを実行するskillは、論点3の決定でphaseごとにtask-designを起動する。どちらも置き場所の準備を直接は呼ばない。task-design以外の呼び手は無い。

**推す案:** a。`escalate-plugin-skill-fix`がbranchの作成を頼めるよう、task-designは今のsteeringの`branch_from_basename`を入力として受ける。これは論点1・3の決定から一つに導ける受け渡しであり、file設計で書く。

#### 提案0へのフィードバック（論点11）

**結果:** bを選択

> 論点11はb。今後変更を伴わない調査設計とかも行う可能性があるから、分けておきたい。他はok

推す案aの根拠は、置き場所の準備を呼ぶのが今task-designだけであることだった。利用者は、変更を伴わない調査の設計のように、task-designを通さずに記録を置く作業を今後行う予定を示した。`find-split-candidates.md`の「現在の外部利用要求があれば、実装済みcallerや利用実績を待つ必要はない」に当たる、持ち主からの具体的な要求として扱う。

### 決定（論点11）

記録の置き場所の準備（`name-work-directory`での命名、directoryの作成、前月の`summary.md`の生成、任意のbranch作成）は、独立したskillにする。task-designはこのskillを呼んで置き場所を用意し、単独で起動しても、roadmapを実行するskillや`escalate-plugin-skill-fix`から起動されても同じ置き場所を使う。変更を伴わない調査の設計のように、task-designを通さずに記録を置く作業からも呼べるようにする。`name-work-directory`は今のまま、命名だけを持つ汎用のskillとして残す。論点1の決定の「task-designから呼ぶ小さなskillへ移す」と一致する。

## 論点12: 締めくくりの確認とplan無しの公開を、task-designの内部指示のfileへ分けるか

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** 確かめるだけ（全部小。根拠は`skill-update-review/find-split-candidates.md`と、`work_scope.md`の二段目）

論点3の検討記録「構造の見直し」の候補から立てた。論点3の後に示す。

### イテレーション0（論点12）: 締めくくりの確認とplan無しの公開を、今の作業で別fileへ分けるかを仮決めする

#### 提案0（論点12）

- a. 今の作業で、task-designの内部指示の一つのfileへ分ける（仮決め）
  - 根拠: `skill-update-review`の候補（論点3の検討記録「構造の見直し」）。`work_scope.md`の二段目では、分けても今の作業のreview・revert・本番適用の単位は崩れない。どのみちsteeringからtask-designへ書き移すため、`task-design/SKILL.md`へ書いてから後で分けると同じ内容を二度書くことになる。
  - task-designのStep 6で、結果を返す前にこのfileを読む。論点6の決定（実行を始めてよいかの確認）もこのfileの末尾に置き、締めくくりの確認の結果を示してから確かめる順序を一つのfileで保つ。fileの名前は論点4で決める。
- b. `task-design/SKILL.md`の本文へ書く
  - 再発防止の問いや`doc-enricher`の重複の避け方を直すたびに、設計の手順の間を直すことになる。

#### 検討記録（論点12・イテレーション0）

`work_scope.md`の二段目（今の作業に含めたら、review・revert・本番適用の単位が崩れるか）を当てた。分ける対象はこの作業でsteeringから移すものそのもので、別の作業にすると同じ節を二度書き換える。崩れないため、拾う（今の作業で分ける）。

#### 提案0へのフィードバック（論点12）

**結果:** aに合意（論点7・9・10・12・13をまとめて示した往復で「それ以外はok」と答えられた）

> 論点9が何を扱う論点なのかわかってない。それ以外はok

### 決定（論点12）

締めくくりの確認（`doc-enricher`の提案mode、議論記録からの再発防止先の見直し、skill自身の見直し）とplan無しで終わった変更の公開は、今の作業でtask-designの内部指示の一つのfileへ分ける。task-designはStep 6で結果を返す前にこのfileを読む。論点6の決定（実行を始めてよいかの確認）もこのfileの末尾に置き、締めくくりの確認の結果を示してから確かめる順序を一つのfileで保つ。今分けるのは、どのみちsteeringから書き移すため、`task-design/SKILL.md`へ書いてから後で分けると同じ内容を二度書くことになり、`work_scope.md`の二段目でも今の作業の単位を崩さないためである。fileの名前は論点4で決める。

## 論点13: 前月の`summary.md`の生成を、置き場所の準備とは別の内部指示へ分けるか

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** 確かめるだけ（全部小。根拠は論点12と同じ）

**依存先:** 論点11（置き場所の準備を持つ担当が決まれば、その担当の内部指示として分けるかを問える）。論点11は決まった。

### イテレーション0（論点13）: 前月の`summary.md`の生成を、今の作業で別fileへ分けるかを仮決めする

#### 提案0（論点13）

- a. 今の作業で、置き場所を用意するskillの内部指示のfileへ分ける（仮決め）
  - 根拠: `skill-update-review`の候補（論点3の検討記録「構造の見直し」）と、論点11の決定（置き場所の準備は独立したskill）。論点12と同じく、`work_scope.md`の二段目で単位は崩れず、どのみち書き移すため今分ける。
  - 置き場所を用意するskillは、前月のdirectoryがあり`summary.md`が無い時だけこのfileを読む。中身（概要の抽出、planの種類ごとのstatusの導き方、exact format、単一writerの理由）は変えない。
- b. 置き場所を用意するskillの`SKILL.md`の本文へ書く
  - plan無しの判定条件を変えるたびに、directoryの作成や命名の手順と同じfileを直すことになる。

#### 検討記録（論点13・イテレーション0）

論点11の決定で、置き場所の準備を持つ担当が独立したskillに決まった。`steering/SKILL.md` Step 1の5（前月summaryの生成）は、directoryの作成とは別の判断（planの種類ごとのstatusの導き方）を持つ。論点12と同じ理由で今分ける。

#### 提案0へのフィードバック（論点13）

**結果:** aに合意（論点7・9・10・12・13をまとめて示した往復で「それ以外はok」と答えられた）

> 論点9が何を扱う論点なのかわかってない。それ以外はok

### 決定（論点13）

前月の`summary.md`の生成は、今の作業で、置き場所を用意するskillの内部指示のfileへ分ける。置き場所を用意するskillは、前月のdirectoryがあり`summary.md`が無い時だけこのfileを読む。中身（概要の抽出、planの種類ごとのstatusの導き方、exact format、単一writerの理由）は変えない。今分ける理由は論点12と同じである。fileの名前は論点4で決める。

## 論点14: 既にある`.steering/`の記録の扱い

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** 一つずつ考える（波及: 中。記録を探すskill（task-design、facilitate-discussion）、hook、`.gitignore`の見本の読み先が変わる。戻しにくさ: 中。利用先repositoryにある記録の置き場所に関わる。他は小。前例は`.steering/2026/202607/20260726-extract-work-directory-naming/design.md`の「既存の`.steering/`配下にある branch 込みのディレクトリは履歴としてそのまま残す。移行・一括改名は行わない」）

**依存先:** 論点5（名前を変えるなら、このrepositoryと利用先repositoryの既存の`.steering/`を移すか、履歴として残すか、記録を探すskillが両方を読むかを問う。名前を変えないなら、この論点を取り下げる）。論点5は`.design-records/`に決まった。

### イテレーション0（論点14）: 既にある`.steering/`の記録を移すか残すかを提案する

#### 提案0（論点14）

##### 今ある記録と、それを読む箇所

- このrepository: `.steering/2026/`配下に61の作業のdirectory（202607〜202611）と月ごとの`summary.md`がある。進行中の作業（例: `.steering/2026/202611/20261122-raise-steering-autonomy/`）も含む。
- 利用先repository: それぞれに`.steering/`の記録がある。数はこのsessionから確かめられない。
- 記録の本文: 93のfileが、計457箇所で`.steering/20…`という他の作業の記録のpathを書いている（前例や関連する作業の参照）。
- 読む箇所: 作業の再開、過去の決定を探す時（`task-design/SKILL.md` PrepareStep 3、`facilitate-discussion/round-trip.md`）、前月の`summary.md`の生成、hook（`.claude/hooks/think_through_session_start.sh`）、`.gitignore`の見本。

##### a. 履歴としてそのまま残し、新しい作業だけ`.design-records/`へ置く（推奨）

- 既にある`.steering/`は動かさない。進行中の作業は、今のdirectoryのまま完了まで続ける。
- 過去の決定を探す箇所は、`.design-records/`と、以前の記録がある`.steering/`の両方を探すと書く。
- 前月の`summary.md`は、前月のdirectoryがある場所ごとに、その場所の作業の一覧として作る。名前を切り替えた月は、両方の場所に一つずつできる。
- `.steering/`という名前が、以前の記録の置き場所としてrepositoryに残る。

##### b. 移す

- このrepositoryでは今回の作業で`.steering/`を`.design-records/`へ`git mv`する。利用先repositoryでは、置き場所を用意するskillが、`.steering/`があり`.design-records/`が無い時に、移すことを利用者へ提案し、承認されたら一度だけ移す。
- 読む箇所は`.design-records/`だけを見ればよくなる。
- 記録の本文の457箇所の`.steering/…`は、古いpathのまま残る。過去の記録を一括で書き換えないため、「以前の記録にある`.steering/…`は`.design-records/…`と読み替える」という読み方の決まりが要る。
- 他のbranchで`.steering/`の下のfileを足している作業があると、mergeの時に、移した側と衝突する。

##### aを推す理由

過去の記録を動かさない決め方には前例が二つある。`.steering/2026/202607/20260726-extract-work-directory-naming/design.md`は「既存の`.steering/`配下にある branch 込みのディレクトリは履歴としてそのまま残す。移行・一括改名は行わない」と決めた。`facilitate-discussion/SKILL.md`は「既存のtrackedな内部logや過去のdiscussionは一括削除・移動・再要約しない」と定める。aの代償は、読む箇所に以前の置き場所を一行足すことと、名前を切り替えた月のsummaryが二つに分かれることである。bの代償は、457箇所の古いpathを読み替える決まりと、進行中のbranchとの衝突である。読む箇所の一行の方が軽い。

#### 検討記録（論点14・イテレーション0）

##### 調査: 移した時に古くなる記述と、読む箇所

**確かめた方法:** `.steering`の下の作業のdirectoryを数えた（`find .steering -mindepth 3 -maxdepth 3 -type d`で61）。記録の本文が他の記録をpathで書いている箇所を数えた（`grep -ro '\.steering/20[0-9][0-9]' .steering`で457箇所、93file）。相対linkで月をまたぐものは1箇所だった。読む箇所は、論点1の調査で数えた`.steering`のpathの参照（`.steering/`配下を除き26箇所）から、記録を読む処理を拾った。

**分かったこと:** 記録どうしの参照のほとんどは、相対linkではなく本文に書いた`.steering/…`のpathである。移すとこれらは古いpathのまま残り、書き換えるには過去の記録を一括で変えることになる。

**前例:** `20260726-extract-work-directory-naming`のdesign、`facilitate-discussion/SKILL.md`の過去の記録を一括で移動しない決まり。

**推す案:** a。

#### 提案0へのフィードバック（論点14）

**結果:** bを選択。aを推した理由の前提に見落とし

> b。確かtask-designのownerとかの表記変えたとき、読み替えのルール作らなかったっけ？

以前の版が作った成果物を今の版で読むための読み替えの決まりは、既に仕組みがある。`maintenance-plugin-context/SKILL.md`の「Plugin version」は、MAJORを上げる理由が「以前の版のskillが作った成果物を、今の版のskillやscriptが見出し・labelの名前で読めなくなること」なら、成果物のtemplateと同じdirectoryの`breaking_changes/`へ記録を残すと定める。9.0.0で付録とroadmapのlabelを切り替えた時の記録が`task-design/templates/breaking_changes/20261115-rename-template-labels.md`にあり、旧名と新名の対応と「古い成果物の読み方」を持つ。

提案0は、bの代償の「読み替えの決まり」を新しく作る負担として数え、aを推した。この仕組みは設計前調査で読んだ`maintenance-plugin-context`の版の規則にあり、標準は既にあった。原因は当てはめの見落としである。この仕組みに乗せれば、bの代償は既にある型の一件の記録になる。

ただし今の規則の対象は「見出し・labelの名前」であり、置き場所のpathの変更は文面に入っていない。この仕組みに乗せる時の文面と記録の置き場所は、論点16で決める。

### 決定（論点14）

既にある`.steering/`の記録は、`.design-records/`へ移す。

- このrepository: 今回の作業で`.steering/`を`.design-records/`へ`git mv`する。進行中の作業のdirectoryも一緒に移す。
- 利用先repository: 置き場所を用意するskillが、`.steering/`があり`.design-records/`が無い時に、移すことを利用者へ提案し、承認されたら一度だけ`git mv`で移す。両方がある時は推測で混ぜず、利用者へ確かめる。
- 記録の本文に残る`.steering/…`のpathは書き換えない。以前の版が作った成果物を今の版で読むための読み替えの決まり（`breaking_changes/`の記録）として、「`.steering/…`は`.design-records/…`として読む」を残す。文面と置き場所は論点16で決める。
- 他のbranchで`.steering/`の下のfileを足している作業とは、mergeの時に衝突しうる。これは移すことの代償として受け入れる。

読む箇所（過去の決定を探す処理、前月summaryの生成、hook、`.gitignore`の見本）は`.design-records/`だけを見る。

## 論点15: roadmapを実行するskillの名前

**ステータス:** 決定

**種別:** TBDヒアリング

**重さ:** まとめて考える（戻しにくさ: 中。利用先repositoryでskillを呼ぶ名前になる。他は小。推す案は`tasklist-executor`との対称から導く）

論点4から分けた。

### イテレーション0（論点15）: roadmapを実行するskillの名前を提案する

#### 提案0（論点15）

このskillは、roadmapの依存順にphaseを選び、phaseごとにtask-designを起動し、返った結果に応じて`tasklist-executor`、自分自身（入れ子）、完了の確認へ進み、phaseの子のpath・status・完了日を書く（論点3の決定）。

##### a. `roadmap-executor`（推奨）

- 初見の人の予想: roadmapを実行する担当。`tasklist-executor`と並べると、planの種類ごとの実行の担当だと読める。
- 実態との差: phaseごとにtask-designを起動して設計させることは名前から読めないが、roadmapを実行する中の段であり、誤解の方向は同じ。

##### b. `execute-roadmap`

- 初見の人の予想: roadmapを実行する。意味はaと同じ。
- 実態との差: 同じ役割の`tasklist-executor`と形が揃わず、並べた時に別の種類のものに見える。

##### aを推す理由

task-designが返すplanの種類（tasklist、roadmap）ごとに実行の担当を置くと決めた（論点3）。同列に並ぶ`tasklist-executor`と表記と抽象度を揃えると、planの種類ごとの対になっていることが名前から読める（`docs/development_standards/naming/core.md`「名前を単独で評価しない」、`naming/file.md`「同階層の存在と足並みを揃える」）。

#### 検討記録（論点15・イテレーション0）

論点3の決定と、既存の`tasklist-executor`の名前と役割（`context: fork`で一つのtasklistを実行する）を確かめた。対になる担当の名前を揃える観点を`naming/core.md`と`naming/file.md`から当てた。

#### 提案0へのフィードバック（論点15）

**結果:** 名前の前提への問い

> 15以外ok。ロードマップって、executeするものなの？

推す理由は、`tasklist-executor`と表記と抽象度を揃えることだった。揃える根拠は、二つが同列に並ぶ同じ種類の仕事であることだが、それを確かめていなかった。tasklistのtaskはそのまま実行できる。roadmapのphaseは、それぞれをtask-designで一つの作業として設計してから、返ったplanを実行する。roadmapは、実行する（execute）ものではなく、phaseを順に進めるものである。`tasklist-executor`と同じ種類の仕事ではないため、形を揃える根拠は成り立たない。

規則の文面（`naming/core.md`「名前を単独で評価しない」の「同列に並ぶ要素を列挙し、抽象度と表記が揃うかを確認する」）は、同列であることを前提にしている。同列かを先に確かめることを明記するかは、締めくくりの`doc-enricher`で候補にする。

### イテレーション1（論点15）: roadmapで行っていることから名前を出し直す

#### 提案1（論点15）

このskillで行っていることを一文で書くと、「roadmapの依存順に、次に進められるphaseを選び、そのphaseを一つの作業としてtask-designで設計させ、返ったplanを実行させ、完了を書き留めて次のphaseへ進む。全phaseが終わればroadmapが完了する」である。このskillを経た後に変わるのは、roadmapの進み具合（どのphaseが終わり、どこまで来たか）である。

##### a. `advance-roadmap`（推奨）

- 初見の人の予想: roadmapを進める。phaseを一つずつ前へ進め、進み具合を書き留める担当と読める。
- 実態との差: 各phaseを設計してから実行することは名前から読めないが、「進める」は実行だけを意味しないため、誤解の方向は同じで、開けば分かる。

##### b. `complete-roadmap`

- 初見の人の予想: roadmapを完了させる。一回の起動で全phaseを終えると読まれる。
- 実態との差: phaseごとに、利用者が実行を始めることを確かめる段で止まる（論点6の決定）。一回で終わる印象と少しずれる。

##### c. `drive-roadmap`

- 初見の人の予想: roadmapを推し進める。意味はaに近い。
- 実態との差: 「drive」は日常の語として「運転する」の印象が強く、aより読みに一段の訳し直しが要る。

##### aを推す理由

このskillを経た後の状態（roadmapの進み具合が前へ進む）を名指す動詞であり、各phaseを設計してから実行するという、tasklistとの違いを打ち消さない。論点4の`prepare-design-record`と同じ動詞と目的語の形にもなる。

#### 検討記録（論点15・イテレーション1）

論点3の決定（roadmapを実行するskillが行うこと）を読み直し、行っていることを一文に書いた（`naming/what_to_try.md`「実態を一文で説明する」）。一文のうち、このskillを経た後の状態は「roadmapの進み具合が前へ進む」であり、outcomeを名指す動詞として「advance」を選んだ（`naming/core.md`「何をもって宣言的とするか」）。提案0の`roadmap-executor`と`execute-roadmap`は、どちらも「実行する」を名指しており、各phaseを設計することを打ち消すため外した。

#### 提案1へのフィードバック（論点15）

**結果:** aに合意

> ok

### 決定（論点15）

roadmapを進めるskillの名前を`advance-roadmap`にする。このskillは、roadmapの依存順に次に進められるphaseを選び、そのphaseを一つの作業としてtask-designで設計させ、返ったplanを実行させ、完了を書き留めて次のphaseへ進む。このskillを経た後に変わるのはroadmapの進み具合であり、それを名指す動詞「advance」を使う。

`tasklist-executor`と形を揃えた`roadmap-executor`は採らない。tasklistのtaskはそのまま実行できるが、roadmapのphaseはそれぞれをtask-designで設計してから実行するため、二つは同じ種類の仕事ではなく、形を揃える根拠が成り立たない。`complete-roadmap`は一回の起動で全phaseを終えると読まれ、phaseごとに実行開始の確認で止まる実態とずれる。`drive-roadmap`は「運転する」の印象が強い。

