# Task Design Discussion

## 論点1: repository context を各 skill へ揺れなく引き渡す

**ステータス:** 決定

**提起の背景:** 共有 plugin にした skill が repository 固有の文書や command を使う時、呼び出しごとの自由形式引数では表記・粒度・欠落が揺れる。一方で、plugin が固定 schema を押し付けると repository ごとの文脈を表現できない。

### 議論の変遷

#### 事象の記述

- ユーザーは、repository 固有文書を引数として渡せるようにしたい。
- ユーザーは、毎回の自由形式引数による結果のぶれを避け、plugin が提供する Markdown template を repository が instance として持つ案を提起した。

#### 原因の追跡

- なぜ: 文脈を invocation ごとの一時入力として扱うと、複数 skill が同じ意味で読む情報の正本がない。
- なぜ: 共通情報を全 skill の和集合として扱うと、関係しない情報まで毎回読み、`共通` が肥大化する。
- なぜ: repository 全体に関係する情報と、複数 skill が同じ意味で消費する情報を区別していない。

#### 根本原因₀ + 提案₀

- **根本原因₀**: plugin と repository の間に、持続する context の保存先・選択規則がない。
- **提案₀**:
  - 総論: plugin が template を提供し、repository は `.agents/skills/tumeda-dev-plugin-context.md` を instance の正本として持つ。
  - 各論:
    - ルール: H2 は各 skill 名と最後の `共通` にする。H3 は自由な Markdown でよい。
    - 適用例: `## steering` の最初の一文が、最後の `## 共通` にある「開発規約」「テスト方針」を明示参照する。

#### イテレーション1

##### 検証

- **観点**: `共通` を全 skill が読む構造では、共通情報が肥大化し、skill に不要な repository facts まで混入する。
- **弱点**: `共通` を和集合として扱っている。

##### 修正先の判断

- **提案レベル**: skill 固有集合と共通集合を分離し、skill が必要とする共通項目だけを明示選択する。

##### 根本原因1 + 提案1

- **根本原因1**: 共通化を全員が読む情報の集約と誤認した。
- **変更点**: 実効文脈を `skill 固有情報 ∪ (共通情報 ∩ skill が明示参照した項目)` と定義する。
- **提案1（現時点）**:
  - 総論: skill は自 section を先に読み、最初の一文で指定した `共通` H3 だけを追加で読む。
  - 各論:
    - ルール: 2つ以上の skill が同じ意味・粒度で直接使う repository fact だけを `共通` に置く。
    - 適用例: 単独 consumer の UI 認証方式は `## visual-inspector` に置く。複数 consumer になった全体 test / lint command は `## 共通` に置く。

#### イテレーション2

##### 検証

- **観点**: `共通参照` と `skill 固有文脈` を別見出しにすると、利用 skill が読む一つの文脈を人工的に分割する。
- **弱点**: 保存側の分類を表示に持ち込んでいる。

##### 修正先の判断

- **提案レベル**: selector を skill section 最初の一文に置き、以降は固有情報を連続した Markdown として記載する。

##### 根本原因2 + 提案2

- **根本原因2**: context を保存場所で表現し、skill が読む実効文脈で表現していない。
- **変更点**: `共通参照` / `skill 固有文脈` 見出しを置かない。
- **提案2（現時点）**:
  - 総論: skill section は共通項目の参照宣言と固有情報を一続きで記載する。
  - 各論:
    - ルール: context template 自身に、分類理由・積集合の式・作成/更新範囲を可視本文で残す。
    - 適用例: session 中の議論・TBD・task 状態は context instance に書かず、steering 成果物に残す。

**決定:** `.agents/skills/tumeda-dev-plugin-context.md` を repository context の正本とする。plugin は同じ構造の template を `skills/tumeda-dev-plugin-context.md` に提供する。`共通` は最後に置き、各 skill は明示参照した共通項目だけを読む。context instance には確認済みで変化の遅い repository facts だけを記載する。

**ネクストアクション:** 確定内容を 8 skill の context 読み取り規則へ適用する。

## 論点2: skill が要求する runtime capability を host 固有名称から分離する

**ステータス:** 決定

**提起の背景:** 現在の `design-consult` は `Agent` / Opus、`steering` は `visual-inspector` / `tasklist-executor` を直接指定する。これらは repository ではなく現在の host runtime 固有であり、他 repository での plugin 利用を妨げうる。

### 議論の変遷

#### 事象の記述

- `design-consult` は独立した設計レビューを必要とするが、特定 agent 名と model 名を前提にする。
- `steering` は UI の実画面確認と tasklist 実行を必要とするが、特定 subagent 名を前提にする。

#### 原因の追跡

- なぜ: skill が必要とする行為と、現在の host での実現手段を分離していない。
- なぜ: plugin は repository 横断を目指すが、runtime 横断の境界を持たない。

#### 根本原因₀ + 提案₀

- **根本原因₀**: 行為の要件を tool / model 固有の名前で表現している。
- **提案₀**:
  - 総論: 「独立設計レビュー」「実画面確認」「tasklist 実行」を capability として残し、特定 agent 名・model 名・tool 呼び出しは skill 本文から外す。
  - 各論:
    - ルール: host が capability を提供しない時、skill は架空の agent / model を指定しない。
    - 適用例: UI の表示変更は実画面確認を要求するが、利用可能な visual inspection 手段を host に委ねる。

#### イテレーション1

##### 検証

- **観点**: ユーザーは、`.claude/agents` にある `visual-inspector`、`tasklist-executor`、`test-runner` を skill 化する案を提起した。Claude Code では frontmatter の `model` と `context: fork` で実行形態を表せる。一方 Codex では、skill の `## Codex` 見出しから親 session に subagent 起動を指示する必要がある。
- **弱点**: agent の手順と非同期実行の理由を分離していない。また Claude Code と Codex の実行指定の差を、共有 skill 内で明示保存していない。

##### 修正先の判断

- **診断レベルへの遡及**: agent は「実行形態」、skill は「手順と知識」の別レイヤである。skill 化しても subagent 化は失われない。共有 skill は host ごとの差を曖昧にせず、Claude Code と Codex の実行契約を別々に持つ。

##### 根本原因1 + 提案1

- **根本原因1**: agent 定義に、手順・非同期実行・host 固有の起動指定が同居している。
- **変更点**: 3 agent の手順を plugin skill に移し、Claude Code と Codex の実行契約を skill 内で明記する。
- **提案1（現時点）**:
  - 総論: `visual-inspector`、`tasklist-executor`、`test-runner` を全て skill 化する。skill が手順の正本となり、親 session が runtime ごとの方法で subagent に渡す。
  - 各論:
    - ルール: Claude Code 版は frontmatter の `model` 属性でモデルを指定し、`context: fork` で fork 実行を要求する。
    - 適用例: `visual-inspector` は Claude Code では fork された skill session が UI 検証を実施する。
    - ルール: Codex 版は各 skill の `## Codex` に、親 session が1つの subagent を起動し、この skill の手順・入力・context instance を渡して完了まで待つことを明記する。
    - 適用例: `tasklist-executor` を起動した main session は、tasklist path と design path を渡した subagent を1つ起動し、結果を回収する。
    - ルール: plugin に `skills/runtime-model-profiles.md` を置く。profile は「深い設計判断」「通常の実装実行」「高速な調査」のような必要能力を表し、Claude Code と Codex で選べる model の対応を advisory として示す。
    - 適用例: `design-consult` は `deep-design-review` profile を要求し、Claude では Opus、Codex では現在の高推論 model を選ぶ。
    - ルール: Codex の subagent 起動面が model 指定を露出しない時、skill は profile を child prompt に添えるが、未対応の model 名を捏造しない。child は親 model を継承して起動する。
    - 適用例: 現在の Codex tool surface に model parameter がなければ、`design-consult` は親 model を継承した subagent で実行する。
    - ルール: agent 由来の repository 固有設定は context instance へ移す。`visual-inspector` の URL・認証方式・script / screenshot 保存先・起動 command、`test-runner` の test command は対応 skill section または明示参照された共通項目に置く。
    - 適用例: `test-runner` を加えることで全体 test command は `steering` と `tasklist-executor` と `test-runner` の直接 consumer になり、`共通` へ再分類する。

#### イテレーション2

##### 検証

- **観点**: ユーザーは、model を pin しなくても skill 側が subagent へ渡す prompt を構成すればよいのではないかと指摘した。
- **弱点**: model pin を、subagent が skill の手順・文脈・品質要求を受け取るための必要条件として扱った。pin が保証するのは model 選択だけであり、skill 実行に必要な task・context・出力形式は親 session の prompt で渡せる。

##### 修正先の判断

- **提案レベル**: model 固定を今回の scope から外す。Codex section は親 session が構成すべき child prompt を明記し、model profile は利用可能な時だけ使う advisory hint にする。

##### 根本原因2 + 提案2

- **根本原因2**: 非同期実行の契約と model 固定の契約を同一視した。
- **変更点**: Codex での subagent 実行を prompt 伝達だけで完結させ、model pin を必須条件にしない。
- **提案2（現時点）**:
  - 総論: Codex section は parent→child の prompt 契約を定義する。child は親が渡した skill、入力、context instance、完了条件に従い、親は結果を回収する。
  - 各論:
    - ルール: Codex の親 session は subagent に、(1) 実行する skill、(2) task 固有入力、(3) context instance path、(4) 必要な成果物 path、(5) 結果に含める summary を渡す。
    - 適用例: `tasklist-executor` には tasklist path、対応 design path、context instance path、完了後に返す未完了タスク一覧を渡す。
    - ルール: `runtime-model-profiles.md` は prompt に添える任意の model hint とし、model 選択面がない host では親 model を継承する。pin 失敗・非対応をエラー扱いにしない。
    - 適用例: `design-consult` は deep-design-review profile を child prompt に添えるが、利用可能な model を強制しない。
    - ルール: model の固定が必要になった時だけ、別 steering で host 固有の追加方法を設計する。

#### イテレーション3

##### 検証

- **観点**: model 固定の話題が、Claude Code では `model` 属性と `context: fork` だけで済むという本題を覆い隠した。subagent への指示は Codex に特化した設計であることを、決定として残す必要がある。
- **弱点**: Claude Code と Codex の責務境界が、前段の model 固定の議論に埋もれていた。

##### 修正先の判断

- **提案レベル**: host ごとの実行契約を決定本文に引き上げ、今回の scope にない model 固定の実装詳細を議論から除去する。

##### 根本原因3 + 提案3

- **根本原因3**: 実行品質の問題を model 固定として扱い、親から child へ渡す手順・入力・文脈・完了条件の契約を主語にしていなかった。
- **変更点**: Claude Code は metadata、Codex は `## Codex` の parent→child prompt 契約、と明示して保存する。
- **提案3（現時点）**:
  - 総論: 3 agent は skill 化する。Claude Code では `model` と `context: fork`、Codex では `## Codex` に書かれた child prompt 契約で同じ非同期実行目的を満たす。
  - 各論:
    - ルール: Claude Code 用の subagent 起動指示は frontmatter の `model` 属性と `context: fork` に置く。Codex 用の起動指示をそこへ重ね書きしない。
    - 適用例: `visual-inspector` は Claude Code で fork された skill session が UI 検証を実施する。
    - ルール: Codex 用には、各 agent 由来 skill の `## Codex` で、親 session が subagent を1つ起動して完了まで待つことを指示する。child prompt には skill 手順、task 固有入力、context instance path、成果物 path、完了条件、親に返す summary を渡す。
    - 適用例: `tasklist-executor` は tasklist path・design path・context instance path・完了後に返す未完了タスク一覧を child に渡す。
    - ルール: `runtime-model-profiles.md` は能力対応の advisory だけを持つ。Codex で model 選択面がなければ parent model を継承し、child prompt の契約は変えない。
    - 適用例: `design-consult` は deep-design-review profile を参照できるが、model 固定なしでも child prompt に設計レビューの観点と出力形式を渡す。

**決定:** 3 agent は skill 化する。Claude Code の subagent 化は frontmatter の `model` と `context: fork` で表し、Codex の subagent 化は各 agent 由来 skill の `## Codex` にある parent→child prompt 契約で表す。今回 model 固定は扱わず、`runtime-model-profiles.md` は advisory とする。

**ネクストアクション:** context template に3 skill sectionを追加し、consumer 増加後の共通集合を再分類する。

## 論点3: generic steering が repository 固有の publish workflow を強制しない

**ステータス:** 決定

**提起の背景:** 現在の `steering/templates/tasklist.md` は x_favorites の GitHub script、push、PR 作成を必須 task にしている。これは他 repository で存在しない command と外部公開を強制する。

### 議論の変遷

#### 事象の記述

- tasklist template は固定の GitHub script と push / PR 作成を完了後 action として含む。
- context template の `## steering` は test/lint と同様に publish workflow を持てるが、未記載時の generic 動作が未定義である。

#### 原因の追跡

- なぜ: repository の公開手順と、steering の普遍的な完了確認を分離していない。
- なぜ: template が外部変更の権限まで固定している。

#### 根本原因₀ + 提案₀

- **根本原因₀**: generic tasklist に x_favorites 固有の publish workflow を埋め込んでいる。
- **提案₀**:
  - 総論: generic template から固定 push / PR command を除く。
  - 各論:
    - ルール: `## steering` が publish workflow を明示した repository だけ、対応 task を tasklist に含める。
    - 適用例: publish workflow 未記載なら、tasklist は動作確認までで終わり、push / PR を計画・実行しない。

#### イテレーション1

##### 検証

- **観点**: 固定 publish workflow は tasklist template の完了後 action だけでなく、steering 本文の tasklist 自己レビューにも「push + PR を必須」として残っている。executor は tasklist をそのまま実行するため、template が固定 task を作れば外部公開まで進む。
- **弱点**: publish の有無・手順・許可条件を一つの repository fact として扱わず、generic template と自己レビューが x_favorites の GitHub 手順をそれぞれ強制している。

##### 修正先の判断

- **提案レベル**: publish workflow を `## steering` section の任意 Markdown として記録し、template と自己レビューはその有無だけで task 生成を分岐させる。

##### 根本原因1 + 提案1

- **根本原因1**: 「steering 完了時に必ず行う内部更新」と「repository が任意に採用する外部公開」を同じ完了後 action として扱っている。
- **変更点**: summary 更新だけを generic の完了後 action として残し、commit / push / PR は context instance が明示した時だけ tasklist に転記する。
- **提案1（現時点）**:
  - 総論: generic steering は publish を計画も実行も要求しない。repository が publish workflow を採用する場合だけ、`## steering` 内の `### 公開手順` に人間が読める Markdown で action・事前条件・ユーザー承認条件・必要なら command を記載する。
  - 各論:
    - ルール: generic `tasklist.md` の「完了後のアクション」には steering summary の状態更新だけを置く。commit / push / PR の固定 checkbox と command は置かない。
    - 適用例: Git hosting を使わない repository の tasklist は、ユーザー確認と summary 更新で終わる。
    - ルール: `## steering` に `### 公開手順` がある時だけ、steering はそこに書かれた action を tasklist の完了後 action として具体的な checkbox に展開する。未記載なら commit / push / PR の task を追加してはならない。
    - 適用例: repository context に「ユーザー確認後、フェーズ単位で commit し、指定 command で PR を作る」とある時だけ、その順序と command を tasklist に転記する。
    - ルール: tasklist 自己レビューは固定 push / PR の存在を確認せず、`### 公開手順` がある時だけ全 action・事前条件・承認条件が転記されたことを確認する。
    - 適用例: 公開手順がない context instance で push task を見つけたら、自己レビューで tasklist を修正する。
    - ルール: executor は tasklist にある公開 task だけを実行対象にする。tasklist にない commit / push / PR を推測して追加・実行しない。
    - 適用例: `### 公開手順` 未記載の repository では、executor は summary 更新後に終了する。

**当時の状態:** 未決（`### 公開手順` を任意 Markdown として採用し、generic template の固定 publish task を除くかの合意待ち）

**ネクストアクション:** `### 公開手順` の任意 Markdown 運用と、未記載時に summary 更新で tasklist を終える規則を確定する。

#### イテレーション2

##### 検証

- **観点**: ユーザーは、公開手順を repository ごとに書くのではなく、remote の GitHub 等の Git 管理サービスが指定されていない時だけ公開を skip するべきだと指摘した。
- **弱点**: 前提案は repository が持つ客観的な接続先ではなく、毎回手順を重複記載することを条件にしていた。共有 skill が標準的に行う commit / push / review request の振る舞いを context instance へ押し出している。

##### 修正先の判断

- **提案レベル**: `## steering` の repository fact を `### Git 管理サービス` に変更する。ここには remote 名と provider を自由な Markdown で記載し、公開の具体手順は記載しない。

##### 根本原因2 + 提案2

- **根本原因2**: 「公開可能な remote があるか」という capability と、「その capability を使う標準手順」を分離していない。
- **変更点**: context instance は remote capability だけを持ち、共有 steering が provider 非依存の完了 action を生成する。固定 GitHub command は残さない。
- **提案2（現時点）**:
  - 総論: `## steering` に `### Git 管理サービス` がある repository は、ユーザー動作確認の後に commit・push・provider 上の review request 作成を tasklist に含める。section がなければ、これらを全て skip し、summary 更新で終える。
  - 各論:
    - ルール: `### Git 管理サービス` には remote 名と provider を Markdown で書く。schema は固定しない。
    - 適用例: `origin は GitHub`、または `upstream は GitLab` と記載する。
    - ルール: steering は provider 固有の shell command を template に埋め込まない。指定された provider の利用可能な公式 CLI / host capability で、branch を publish して review request（GitHub の PR、GitLab の MR 等）を作成する task を組み立てる。
    - 適用例: GitHub 指定時の task は「GitHub に push し、PR を作成する」とし、`scripts/github/create_pr_from_branch_name.sh` を一般 template へコピーしない。
    - ルール: `### Git 管理サービス` がない context instance では、generic tasklist と executor は commit・push・review request を task に追加・推測・実行しない。
    - 適用例: ローカル作業用 repository、または remote 未登録 repository は、ユーザー確認と summary 更新で tasklist を完了する。
    - ルール: tasklist 自己レビューは、Git 管理サービスがある時だけ commit・push・review request が provider に対応していることを確認する。ない時にいずれかが含まれていれば除去する。
    - 適用例: GitLab 指定の context instance に GitHub PR script が出た時は、tasklist を修正する。

**当時の状態:** 未決（`### Git 管理サービス` を公開条件として採用し、service 指定時の標準 action を commit・push・provider review request とするかの合意待ち）

**ネクストアクション:** Git 管理サービスの記載だけで commit・push・provider review request を標準生成する規則を確定する。

#### イテレーション3

##### 検証

- **観点**: ユーザーは、`scripts/github/create_pr_from_branch_name.sh` と `scripts/github/gh_issue_from_branch.sh` を、独立 skill にせず `steering` skill の `scripts/` に内包する案を提起した。
- **弱点**: 現在の2 script は GitHub adapter としてだけでなく、`feature-<issue_id>` の branch 命名、issue title の PR title 利用、base branch が `main` という x_favorites 固有契約まで内包している。実際には branch を作成せず、既存 branch から issue を解決するだけである。

##### 修正先の判断

- **提案レベル**: script は `skills/steering/scripts/github/` に置く internal adapter とし、現時点で独立 skill 化しない。ただし共有する GitHub adapter と repository 固有の branch / issue 契約を分離する。

##### 根本原因3 + 提案3

- **根本原因3**: provider 固有の操作と repository 固有の命名規約を、同じ shell script の不透明な前提として結合している。
- **変更点**: shared script は GitHub capability だけを担い、repository 固有の issue 連携を使う時は context instance の `## steering` section から明示する。
- **提案3（現時点）**:
  - 総論: `skills/steering/scripts/github/` は GitHub を指定した repository だけが使う optional adapter とする。ほかの skill から再利用が生じるまで、独立 skill にはしない。
  - 各論:
    - ルール: generic GitHub PR script は current branch と repository の default base branch を使い、既存 PR があればその URL を返し、なければ PR を作成する。`feature-<issue_id>` と固定 `main` は前提にしない。
    - 適用例: branch が任意名の GitHub repository でも、default branch を base に PR を作成できる。
    - ルール: issue を branch 名から解決して PR title / close keyword に使う契約は、`## steering` に明示された repository 固有ルールがある時だけ有効にする。shared adapter はその契約を満たせない時、issue 連携なしで PR を作成するか、明示 input を要求する。
    - 適用例: x_favorites が `feature-123` を issue #123 と対応させる時だけ、その規約を context instance に記載し、GitHub adapter に issue 番号を渡す。
    - ルール: Git 管理サービスが GitHub 以外、または未記載なら GitHub scripts を呼ばない。provider 非依存の steering 本文には GitHub script path を書かない。
    - 適用例: GitLab 指定では GitHub adapter を選ばず、host capability で MR を作成する task にする。

**決定:** `## steering` の `### Git 管理サービス` を公開可否の条件にする。section があれば、ユーザー動作確認後に commit・push・provider の review request を tasklist に含める。なければ3操作は skip し、summary 更新で終える。GitHub 向け操作は `skills/steering/scripts/github/` の internal adapter とし、独立 skill にはしない。adapter は generic な PR 作成だけを担い、x_favorites の branch / issue 契約は context instance に分離する。

**ネクストアクション:** 確定内容を context template、steering skill / tasklist template、GitHub adapter、x_favorites の context instance へ適用する。

## 論点4: x_favorites を最初の consumer として context instance へ移行する

**ステータス:** 決定

**提起の背景:** x_favorites は移行後の最初の plugin 利用 repository だが、context instance を任意にすると、既存の規約・command が plugin 初回利用時に失われる。

### 議論の変遷

#### 事象の記述

- x_favorites には `.agents/skills/` の 5 skill と template があり、移行後は plugin 正本を読む。
- `.agents/skills/tumeda-dev-plugin-context.md` は template として合意済みだが、x_favorites で初期 instance を作るかは未決である。

#### 原因の追跡

- なぜ: context instance の作成規則と、migration 時の bootstrap を同じものとして扱っていない。
- なぜ: 初期 instance がなければ、移行後の最初の skill は既存の repository facts を再発見する必要がある。

#### 根本原因₀ + 提案₀

- **根本原因₀**: 最初の consumer の context bootstrap を migration deliverable に含めていない。
- **提案₀**:
  - 総論: x_favorites の context instance を今回の必達 deliverable にする。
  - 各論:
    - ルール: template から作り、既存ファイルで確認できる stable facts だけを記載する。
    - 適用例: x_favorites の project instruction、存在する development guideline、検証 command を該当 skill section または明示参照された `共通` に記載する。

#### イテレーション1

##### 検証

- **観点**: 調査で、`AGENTS.md`、`docs/ai_guideline/`、`docs/ai_guideline/development_standard/{testing,docker}.md`、`docker-compose.yml`、Git remote から初期 context の大半を確認できた。test / lint はともに `docker compose exec app yarn ...` である。
- **観点**: 旧 `test-runner` の `docker compose exec frontend npm test` は正本 testing.md と矛盾する。旧 `visual-inspector` の `http://localhost:18100` は compose の公開 port `3000` と矛盾し、参照先の `frontend/inspect/visual/lib/base.mjs` と `result-template.md` は存在しない。
- **弱点**: 旧 agent の記述をそのまま context instance に転記すると、確認済みの安定事実だけを置くという論点1の契約を破る。

##### 修正先の判断

- **提案レベル**: x_favorites の初期 context instance は今回の MUST deliverable にする。ただし現存する source で裏付けられる事実だけを書き、旧 agent の矛盾・欠損した前提は移さない。

##### 根本原因1 + 提案1

- **根本原因1**: migration の bootstrap を単なる template の複製として扱い、既存 skill / agent の記述を正本ドキュメントと照合していない。
- **変更点**: x_favorites を最初の context consumer として明示し、section ごとに根拠ファイルを持つ事実だけを初期入力にする。
- **提案1（現時点）**:
  - 総論: `.agents/skills/tumeda-dev-plugin-context.md` を初期 instance として作成する。全 H2 は template のまま持つが、empty section に未確認値や TBD を書かない。
  - 各論:
    - ルール: `共通` には `AGENTS.md`、AI guideline の案内・アーキテクチャ・testing / docker 文書、全体 test command `docker compose exec app yarn test`、全体 lint command `docker compose exec app yarn lint` を根拠パスとともに置く。
    - 適用例: `test-runner` は旧 `frontend npm test` を使わず、共通の test command を読む。
    - ルール: `## steering` には Git remote `origin` の GitHub 管理と、`feature-<issue番号>` が GitHub Issue 番号に対応する branch / issue 契約を置く。
    - 適用例: GitHub adapter は x_favorites でだけこの契約に従い、他 repository にこの命名を持ち出さない。
    - ルール: `## visual-inspector` には compose で確認できるアプリ URL `http://localhost:3000` と、現存する browser config / 出力先だけを置く。helper や result template は file の存在を確認できた時だけ使う。
    - 適用例: `http://localhost:18100`、`frontend/inspect/visual/lib/base.mjs`、`result-template.md` は初期 instance に書かない。
    - ルール: repository 固有の browser helper がない時、shared `visual-inspector` は generic な browser 手段で確認し、作成すべき安定設定が判明した時だけ context instance の対象 section を更新する。
    - 適用例: UI 認証情報が session にない時は、context instance に推測値を書かず、実行時に安全な方法で取得する。

**決定:** x_favorites の `.agents/skills/tumeda-dev-plugin-context.md` は今回の MUST deliverable とする。正本ドキュメント・設定・remote から確認できる stable facts だけを初期記載し、旧 agent の矛盾・欠損した記述は移さない。test / lint は `docker compose exec app yarn ...`、visual は compose の `http://localhost:3000` と現存する設定だけを使う。

**ネクストアクション:** 確定内容を design と移行 tasklist に反映し、実装時に初期 instance を作成する。

## 論点5: host 常時適用と旧定義の退役を一つの移行契約にする

**ステータス:** 決定

**提起の背景:** plugin を正本にしても、x_favorites の Claude Code は `.claude/settings.json` の SessionStart / UserPromptSubmit hook、`.claude/hooks/think_through_session_start.sh`、`.claude/skills` symlink、`.claude/agents/*.md` で旧 skill / agent を発見・参照する。design は `AGENTS.md` 更新と `.agents/skills/` 削除だけを定めており、移行後に think-through の常時適用が失われるか、旧agentとplugin skillが二重に発見される。

### 議論の変遷

#### 事象の記述

- `.claude/skills` は `.agents/skills` への symlink であり、`.agents/skills` を削除すると旧参照は壊れる。
- Claude Code の hook は削除対象となる `.claude/skills/think-through/SKILL.md` を詳細参照先として案内する。
- `visual-inspector`、`tasklist-executor`、`test-runner` の旧 `.claude/agents/*.md` を削除・無効化するdeliverableがない。
- `.claude/settings.json` の permission、hook、browser設定は旧 skill / agentの実行前提を持つが、残す・更新する・削除する分類がない。

#### 原因の追跡

- なぜ: skill本文の移行と、hostが発見・常時注入・実行を行うproject設定を別の移行対象として扱っていない。
- なぜ: pluginを唯一の正本にする対象を Markdown 本文だけと誤認し、symlink・hook・settings・agent definition を含む実行経路として捉えていない。

#### 根本原因₀ + 提案₀

- **根本原因₀**: repository内の旧定義が、host設定から複数経路で参照されていることのinventoryがない。
- **提案₀**:
  - 総論: Claude Code と Codex の host別起動経路を棚卸し、常時適用・手動/自動起動・permission・browser設定を「pluginへ移す」「repositoryに残す」「削除する」に分類してから旧定義を退役する。
  - 各論:
    - ルール: think-through の常時適用は、各hostで移行後も有効な明示的機構を持つ。pluginが提供するskill名だけを記すのではなく、毎turnの要約注入と詳細参照をどこから得るかを定義する。
    - 適用例: Claude Codeのhookを残すなら、削除するlocal SKILL pathを参照せず、plugin正本と矛盾しない短い作法だけを注入する。
    - ルール: 旧 `.claude/agents/*.md` と `.claude/skills` symlink は、両hostでplugin skillの発見・起動をsmoke testした後に削除または置換する。
    - 適用例: `test-runner` plugin skillが正しい共通test commandを使うことを確認してから、旧 `test-runner.md` を退役する。

**決定:** host別起動経路を移行対象に含める。think-throughの詳細な正本はplugin skillとし、Claude Codeはproject hookに短い作法だけを残して削除対象local SKILL pathを参照しない。Codexは`AGENTS.md`にplugin skill名と常時適用の要約を置く。`.claude/skills` symlink、旧 `.claude/agents/{visual-inspector,tasklist-executor,test-runner}.md`、旧 GitHub script permissionは、Claude / Codex双方のplugin skill smoke testとsettings・browser設定のinventory完了後に削除または置換する。

**ネクストアクション:** 上記のhost別移行契約をdesignへ反映し、settings / hooks / symlink / agent definition / permissionの変更対象をtasklistへ落とす。

## 論点6: subagent手順を単体skillではなく実行グラフとして定義する

**ステータス:** 決定

**提起の背景:** agent由来3 skillを個別にsubagent化する方針は決まったが、既存では `tasklist-executor` がUI task時に `visual-inspector` を起動して結果をtasklistへ転記する。さらに `design-consult` は既存skillでありながらOpus subagent呼び出しが本体である。親子の責務・入力・出力・待機・失敗時の扱いを定めないと、移行後に独立実行の品質保証が失われる。

### 議論の変遷

#### 事象の記述

- 現designは agent由来skillについてmain sessionがchildを1つ起動する契約だけを定める。
- 旧 `tasklist-executor` は childとして `visual-inspector` を起動し、`result.md` をtasklistへ転記する。
- 旧 `design-consult` はAgent + Opusで独立設計レビューを実行するが、host別実行契約は3 agent由来skillだけを対象にしている。
- `test-runner` を誰がどの段階で起動するかも未定義である。

#### 原因の追跡

- なぜ: subagent化をfrontmatter / promptの記法として扱い、複数skillが連鎖する実行グラフとして設計していない。
- なぜ: action skillのClaude `context: fork` は会話履歴を持たず、skill本文と明示入力がchildのtaskになるという制約を、input/output契約へ反映していない。

#### 根本原因₀ + 提案₀

- **根本原因₀**: skillごとの実行形態は決めたが、skill間の依存・delegation・結果集約の責務境界を決めていない。
- **提案₀**:
  - 総論: `design-consult`、`tasklist-executor`、`visual-inspector`、`test-runner` を含むhost別実行DAGを定義する。
  - 各論:
    - ルール: 各edgeに、起動者、childへ渡すtask入力・context instance path・成果物path・DoD・返却summary、待機方法、child失敗時に親が完了扱いにしない規則を定める。
    - 適用例: `tasklist-executor → visual-inspector` はUI taskだけで起動し、visual結果をtasklistへ定型転記してから親がDoDを判定する。
    - ルール: `design-consult` もClaude/Codex別のchild起動またはmain session fallbackを明示する。
    - 適用例: model選択面のないCodexでは、parent model継承childに設計相談の問い・観点・返却形式を渡す。

#### イテレーション1

##### 検証

- **観点**: main sessionだけがsubagentを起動すると仮定したが、subagentがさらにsubagentを起動してもよい。実行権限をrootだけに限定する根拠はない。
- **弱点**: 「Codexの場合はmain sessionがsubagentを立てる」という規則のmainを、plugin skillを直接起動したsessionだけと狭く解釈した。nested skillにとっては、その起動元childがmain sessionである。

##### 修正先の判断

- **診断レベルへの遡及**: 起動権限の制限ではなく、各delegation edgeのprompt・結果・DoDを明示すれば、nested delegationは既存の責務分離を保ったまま使える。

##### 根本原因1 + 提案1

- **根本原因1**: host固有の起動記法を、skill間の責務グラフそのものと混同した。
- **変更点**: Codexの `## Codex` におけるparentは直近の呼び出し元sessionとし、child→grandchildを許可する。
- **提案1（現時点）**:
  - 総論: direct parentが必要なchild skillを起動して待機する。root main、executor、design-consultはいずれも、そのchildに対するparentになれる。
  - 各論:
    - ルール: UI taskでは `tasklist-executor → visual-inspector` を起動し、visualの `result.md` とsummaryをexecutorへ返す。executorだけがtasklistのDoD判定・結果転記・完了更新を行う。
    - 適用例: visual結果が異常ならexecutorはtaskを完了にせず修正・再確認へ戻る。
    - ルール: test実行・失敗分析が必要な時は `tasklist-executor → test-runner` を起動し、test-runnerの実行結果・失敗分析をexecutorへ返す。executorがtasklistの完了を判定する。
    - 適用例: test-runnerが失敗を返した時、executorは該当taskを未完了のまま原因修正へ進む。
    - ルール: Codexの各 `## Codex` は直近parentがchildへ、skill手順、task入力、context instance path、成果物path、DoD、返却summaryを渡して待機すると指示する。Claude Codeでは同じ入出力を`context: fork` skillの`$ARGUMENTS`で渡す。
    - 適用例: executor childはvisual skillに確認対象・期待値・出力dir・context instanceを渡す。
    - ルール: `design-consult` は呼び出し元sessionから独立childとして起動し、設計相談の問い・参照文脈・出力形式を渡す。
    - 適用例: Codexのdesign-consult parentは深い設計レビューが必要な時にchildを起動し、返却分析を会話へ統合する。

**決定:** direct parentによるnested delegationを許可する。`tasklist-executor → visual-inspector` と `tasklist-executor → test-runner` を標準edgeとし、executorが結果をtasklistへ反映する。`design-consult` も呼び出し元から独立childとして起動する。各edgeはhost別の同一prompt・入出力契約を持つ。

**ネクストアクション:** 確定したDAGとedge契約をdesignへ反映する。

## 論点7: Git 管理サービスの抽象を実行可能なprovider範囲へ落とす

**ステータス:** 決定

**提起の背景:** Git管理サービスがある時にprovider review requestを作る方針は決まったが、pluginが内包するadapterはGitHubだけである。GitLab等をcontextに指定した場合の検出・認証・CLI/MCP・失敗時の規則がなく、tasklistにMR作成を入れても実行できない。

### 議論の変遷

#### 事象の記述

- `skills/steering/scripts/github/` はGitHub向けinternal adapterとして設計されている。
- `### Git 管理サービス` はGitHub以外も表せるが、provider別adapterは設計されていない。

#### 原因の追跡

- なぜ: 「providerを記載できる」ことと「provider上のreview requestを実行できる」ことを同じものとして扱っている。
- なぜ: generic steeringの抽象範囲を、pluginが提供する実行手段より広く取っている。

#### 根本原因₀ + 提案₀

- **根本原因₀**: provider capabilityの検出・adapter・停止条件がない。
- **提案₀**:
  - 総論: 今回対応するprovider範囲を確定し、未対応providerをcontextに指定した時のtasklist終端を定義する。
  - 各論:
    - ルール: 対応providerごとにadapter、必要CLI/MCP、認証preflight、失敗時の未完了扱いを持つ。未対応providerを自動review request作成対象にしない。
    - 適用例: GitHubだけを今回対応とするなら、GitLab指定時はcommit/pushまでか、review requestをユーザー確認待ちにして終了する。

#### イテレーション1

##### 検証

- **観点**: 現在pluginが実行できる外部公開操作はGitHub adapterだけである。将来のproviderを想定した抽象を先に作ると、未検証の認証・CLI・失敗規則を設計に混ぜる。

##### 修正先の判断

- **診断レベルへの遡及**: 公開可否の一般論ではなく、今回実装・smoke testする外部連携の境界を固定する必要がある。

##### 根本原因1 + 提案1

- **根本原因1**: GitHub adapterしかない段階で、Git管理サービス一般を完了actionの対象にしていた。
- **変更点**: `## steering` の公開設定は `### GitHub` とし、GitHub repositoryだけを今回の外部公開対象にする。未記載ならcommit・push・PR作成をtasklistへ追加しない。GitHub以外のproviderは今回のscope外であり、adapter interface・fallback・tasklist分岐を定義しない。

**決定:** 今回のprovider scopeはGitHubのみ。`### GitHub` があるrepositoryだけ、ユーザー動作確認後にcommit・push・PR作成をtasklistへ含め、`skills/steering/scripts/github/` を使う。GitHub以外は対応対象にしない。

**ネクストアクション:** context templateとdesignの`Git 管理サービス`を`GitHub`へ揃え、GitHub以外を前提にした受入条件を除去する。

## 論点8: context instance の探索・作成を安全なbootstrap手順として定義する

**ステータス:** 決定

**提起の背景:** context instanceの配置と選択的読み取りは決まったが、実行cwdがsubdirectoryの時のrepository root、plugin templateの解決、`.agents`未作成時の作成、権限・確認不能時の停止が未定である。これではinstance不在時の作成規則を各skillが実装判断できない。

### 議論の変遷

#### 事象の記述

- context instanceの正規pathは `<repository-root>/.agents/skills/tumeda-dev-plugin-context.md` と定義される。
- plugin templateは `skills/tumeda-dev-plugin-context.md` に置くが、各skillからの解決方法が定義されていない。
- 新repositoryには`.agents`がない場合があり、repository root自体がGit管理下でない場合もある。

#### 原因の追跡

- なぜ: contextをdata modelとしては設計したが、生成・検索する操作としては設計していない。
- なぜ: repository固有事実を安全に書く前提となるroot判定・template source・書込み権限を暗黙にしている。

#### 根本原因₀ + 提案₀

- **根本原因₀**: instance lifecycleの状態遷移がない。
- **提案₀**:
  - 総論: root discovery、instance探索、template copy、最小記入、再読込、作成不能時fallbackを順序固定のbootstrapとして定義する。
  - 各論:
    - ルール: repository rootはGit rootを優先し、取得不能時のfallback rootと、template sourceをplugin内のskill相対pathで解決する方法を明記する。
    - 適用例: subdirectoryから起動してもGit root配下の`.agents/skills/`だけを読む。
    - ルール: `.agents`未作成時は必要になったskillだけが作成し、確認できたstable factsの対象H3だけを最小記入する。作成権限がない時は推測で続行せず、一般手順または必要文脈の提示依頼へfallbackする。
    - 適用例: contextを作れないread-only repositoryでは、固定pathを探さず、利用者が渡した文脈だけで設計範囲を限定する。

#### イテレーション1

##### 検証

- **観点**: 各consumer skillへ作成・不在時の規則を書くと、templateの運用思想とbootstrapが分散し、変更時に揃わない。

##### 修正先の判断

- **診断レベルへの遡及**: context instanceは任意のMarkdownではなく、探索・生成・更新・選択的読取を一つのlifecycleとして扱う必要がある。

##### 根本原因1 + 提案1

- **根本原因1**: contextのdata schemaとmaintenance手順のownerがいない。
- **変更点**: `maintenance-plugin-context` を追加skillにする。templateはH2/H3の構造と項目説明だけを持ち、運用思想・探索・作成・更新・不在時の規則はこのskillの正本へ移す。
- **提案1（現時点）**:
  - ルール: consumer skillはrepository固有文脈が不要ならcontextを無視して一般手順を続ける。必要なら`maintenance-plugin-context`へ、consumer名、必要なH2/H3、必要理由、確認元候補を渡す。consumer自身はinstanceを作成・更新しない。
  - ルール: maintainerはGit rootだけをrepository rootとして使う。rootを得られない時はcwdに`.agents`を作らず、instanceを`unavailable`として返す。
  - ルール: maintainerは自分がplugin内で持つtemplateだけをコピー元にする。templateを読めない時は独自形式を作らず、`unavailable`として返す。
  - ルール: instanceを作成・更新できるのは、書込み可能で確認済みの安定factがある対象sectionだけ。保存後は同じinstanceを読み直し、consumerへpathと許可された読取範囲を返す。
  - ルール: 必須文脈が`unavailable`ならconsumerは推測しない。一般手順に縮退できなければ、必要なrepository rootまたは文脈の提示を求める。

**決定:** `maintenance-plugin-context` を追加skillとし、context instanceのlifecycleを中央集権する。templateは構造だけ、運用方針はmaintainer skillだけが正本とする。8移行skillは、repository固有文脈が必要な時だけmaintainerへ解決・maintenanceを委譲する。

**ネクストアクション:** maintainer skillの入力・出力契約、templateの最小構造、各consumer skillの呼出条件をdesignへ反映する。

## 論点9: CodexとClaude Codeの配布更新を同じ完了条件にする

**ステータス:** 決定

**提起の背景:** 現designのcachebuster / reinstall / new thread確認はCodex向けにしか具体化されていない。Claude Codeは `.claude-plugin/marketplace.json` のplugin versionとplugin cacheを別に持つ。また現在pluginには既存の`hello` skillがあり、移行対象8 skillとの共存・削除を決めないと、skill数・manifest・受入基準が揺れる。

### 議論の変遷

#### 事象の記述

- Codex plugin manifestは`version`と`skills` pathを持ち、更新にはCodex cachebusterと再installが必要である。
- Claude Code marketplaceはplugin versionを持ち、plugin cacheから読み込む。
- 現pluginは`skills/hello/SKILL.md`を既に提供するが、designは8 skillだけを完成構造・受入基準に書いている。

#### 原因の追跡

- なぜ: pluginの正本を共有しても、hostごとの配布cacheとmanifest versionは共有されない。
- なぜ: 既存plugin資産を移行対象と非対象に分類していない。

#### 根本原因₀ + 提案₀

- **根本原因₀**: source treeの完成と、各hostが更新版を実際に発見することを同一視している。
- **提案₀**:
  - 総論: Codex / Claude Codeのmanifest・version・cache更新・reload / new sessionを別々に検証し、`hello`を残すか削除するかを明示する。
  - 各論:
    - ルール: Codexはcachebuster更新、marketplace経由reinstall、新threadで8移行skillを起動確認する。Claude Codeはmarketplace plugin version更新、reinstall / reload後に同じskillの発見・起動・`context: fork`を確認する。
    - 適用例: source tree上に新skillがあっても、host cacheが旧versionなら移行完了にしない。
    - ルール: `hello`は今回の移行対象外として残し受入基準を「8移行skill + 既存hello」とするか、削除してplugin提供skillを8だけにするかを決める。
    - 適用例: `hello`を残す場合、plugin validatorと一覧確認は9 skillを期待する。

#### イテレーション1

##### 検証

- **観点**: `hello`は今回の共有開発skill群と無関係であり、残すと移行後の提供一覧・validator・host smoke testが余分な分岐を持つ。

##### 修正先の判断

- **診断レベルへの遡及**: 既存assetの温存ではなく、今回のpluginが提供する責務を一意にする必要がある。

##### 根本原因1 + 提案1

- **根本原因1**: `hello`を移行対象外として残す可能性を持たせ、完成時のskill一覧を確定していなかった。
- **変更点**: `skills/hello/`を削除し、pluginの完成skill一覧を8移行skillと`maintenance-plugin-context`の9個に固定する。

**決定:** `hello`を削除する。source検証後、Claude Codeは`.claude-plugin/plugin.json`とmarketplace内の`tumeda-dev` versionを更新してreload / 新sessionで9 skillを確認する。Codexはplugin cachebuster、marketplace経由reinstall、新threadで同じ9 skillを確認する。両hostの確認までを移行完了条件とする。

**ネクストアクション:** 9 skillの正確な一覧、`hello`削除、host別version更新・reload手順をdesignとtasklistへ反映する。

## 論点10: context中央集権とhost runtime契約を矛盾なく完成させる

**ステータス:** 決定

**提起の背景:** `maintenance-plugin-context`をcontext lifecycleの唯一のownerとして追加した後も、designには各consumerがinstanceを直接作成・更新し、skill section先頭で`共通`参照を指定する旧契約が残っている。またmodel profileは配置図だけで、作成・読取・検証のdeliverableになっていない。このままtasklistへ落とすと、中央集権を壊す実装と、実行不能なtemplate解決が混在する。

### 議論の変遷

#### 事象の記述

- templateからは`共通`の参照指定と不在時の操作規則を除き、`maintenance-plugin-context`へ移した。
- しかしdesign 3-2 / 3-3は、各skillが自section先頭で`共通` H3を指定し、必要時にtemplateからinstanceを作る旧文面のままである。
- 新しいmaintainer skillはtemplateを「このskillの親directory（pluginの`skills/`）」から読むと書くが、`SKILL.md`の親directoryは`maintenance-plugin-context/`であり、templateが置かれる`skills/`は親の親directoryである。
- `runtime-model-profiles.md`は完成構造にあるが、内容、reader、host別release確認がdeliverable・受入基準にない。
- 移行元のsteering skillには固定GitHub scriptをtasklist自己レビューで必須とする文面があり、GitHub section不在時にpublishをskipする新契約へ明示的に置換しなければ、生成tasklistが再び旧scriptを要求する。

#### 原因の追跡

- なぜ: context templateの方針をmaintainerへ移す変更を、designのデータモデル・公開API・操作フローまで一括で置換していない。
- なぜ: model選択の方針を「advisory」と決めた後、実体fileを通常のplugin deliverableとして設計していない。
- なぜ: steering本文・template・自己レビューの3箇所にある公開action契約を、一つのGitHub分岐へ統合していない。

#### 根本原因₀ + 提案₀

- **根本原因₀**: source of truthを移した時に、旧sourceを参照する契約・パス解決・検証項目を網羅的に差し替える完了条件がない。
- **提案₀**:
  - 総論: context lifecycle、model profile、GitHub公開分岐について、正本・consumer・参照方法・検証を1つずつ確定し、design全体を新契約へ揃える。
  - 各論:
    - ルール: contextの選択的読取mappingと不在時の判断は`maintenance-plugin-context`だけが正本とする。templateはH2/H3と記入欄、consumer skillは呼出条件だけを持つ。designの旧「先頭の一文」および「各skillが作成」は削除する。
    - ルール: template sourceは`maintenance-plugin-context/SKILL.md`のparentではなく、installed pluginの`skills/` rootにある`tumeda-dev-plugin-context.md`として解決する。source rootを特定できなければ`unavailable`にする。
    - ルール: `runtime-model-profiles.md`をpluginの通常deliverableにし、Claude frontmatterのmodel指定をCodex child起動時のadvisoryへ変換する対応表、reader、更新時のhost確認を定義する。Codexでmodel選択面がない時は親model継承を明記する。
    - ルール: steering本文・tasklist template・自己レビューは`### GitHub`あり/なしだけでpublish actionを判定し、旧`bash scripts/github/create_pr_from_branch_name.sh`の固定要求を残さない。GitHubありではplugin内部adapter、なしではsummary更新で終了することを生成tasklistで検証する。

**当時の状態:** 未決（上記4契約をどのdesign section・deliverable・受入基準へ反映するかの合意待ち）

**ネクストアクション:** context契約の置換範囲、model profileの最小内容、GitHub分岐を持つtasklist templateの完成形を確定する。

#### イテレーション1

##### 検証

- **観点**: 論点10はcontext lifecycle、template path、model profile、GitHub tasklistという独立した4契約を一つのyes/noにしている。これではどの回答が何を確定するか不明で、合意しても次へ進めない。

##### 修正先の判断

- **診断レベルへの遡及**: 「source of truthを揃える」は上位原則であり、実際に決める単位ではない。consumerが誰か、何を読むか、誰が書くかを対象ごとに分離する。

##### 根本原因1 + 提案1

- **根本原因1**: source of truthの矛盾を一つの論点として記録し、個別のdecision boundaryを切っていない。
- **変更点**: 論点10を次の順で扱う。10-A context ownership / template path、10-B runtime-model-profiles、10-C GitHub tasklist分岐。最初は10-Aだけを議論する。
- **提案1（現時点）**:
  - 総論: 10-Aでは、contextを読む・更新する主体と、templateを解決するpathだけを確定する。modelとGitHub公開は持ち込まない。
  - 各論:
    - ルール: `maintenance-plugin-context`だけがinstanceの探索・作成・更新・選択的読取範囲の解決を担う。consumerは必要な事実と確認元候補を渡し、返却された範囲だけを読む。
    - ルール: template sourceはinstalled pluginの`skills/tumeda-dev-plugin-context.md`である。maintainer自身の`SKILL.md`からは、skill directoryの親の親を`skills/` rootとして解決する。hostがsource locationを公開しない時は`unavailable`にする。
    - ルール: templateには構造と記入欄だけを置く。`共通`の選択規則、instance不在時、更新禁止、fallbackはmaintainerだけが持つ。

**現在の焦点:** 10-A context ownership / template path（未決）

**決定:** 10-Aを確定する。`maintenance-plugin-context`だけがcontext instanceの探索・作成・更新・選択的読取範囲の解決を担い、consumerは必要理由・必要fact・確認元候補を渡して返却範囲だけを読む。template sourceはmaintainerの`SKILL.md`の親の親であるplugin `skills/` rootの`tumeda-dev-plugin-context.md`だけとし、取得不能時は`unavailable`にする。既存instanceは要求H2/H3だけを最小更新し、構造を読めない時は修復・再生成しない。

**ネクストアクション:** designとmaintainer skillから旧契約を除去し、10-B runtime-model-profilesを議論する。

#### イテレーション2

##### 検証

- **観点**: Claude Codeの`model: opus`はfrontmatterで選べるが、Codexのsubagent起動面には常にmodel選択があるとは限らない。製品名だけの対応表を正本にすると、hostの提供model変更時に誤った指定を強制する。

##### 修正先の判断

- **診断レベルへの遡及**: 必要なのはmodel名の同一性ではなく、skillが要求する推論強度をhostごとに再現する契約である。

##### 根本原因2 + 提案2

- **根本原因2**: `runtime-model-profiles.md`を置く方針だけで、profile・host実装・model選択面がない時のfallbackを分離していない。
- **変更点**: 10-Bでは、profileを正本にするか、Claude/Codexの製品model名を正本にするかを決める。
- **提案2（現時点）**:
  - 総論: `runtime-model-profiles.md`は「推論強度profile」を正本にし、Claude selectorとCodexの現在推奨model名はhost別adapter情報として併記する。
  - 各論:
    - ルール: `deep-design`、`standard-execution`などのprofileは、必要な品質・速度・用途を定義する。skillはprofile名を要求し、特定providerのmodel名を本文の判断根拠にしない。
    - ルール: Claude CodeはprofileのClaude selectorをfrontmatter `model`へ反映する。Codexはchild model選択面がある時だけ対応する推奨modelを選び、選択面がなければ親modelを継承する。
    - ルール: source release時に、両hostでprofileに対応するmodelが選択・継承されることを確認する。利用不能なmodel名をfallbackとして書かず、profile要求と実際のfallbackを返却summaryへ残す。

**現在の焦点:** 10-B runtime-model-profiles（未決）

**決定:** 10-Bを確定する。`runtime-model-profiles.md`はprovider固有model名でなく推論強度profileを正本にする。初期profileは`deep-design`（Claude `opus`、`design-consult`）と`standard-execution`（Claude `sonnet`、agent由来3 skill）。Codexはchild model選択面がある時だけprofile相当modelを選び、ない時は親modelを継承する。host adapterとrelease確認をこのfileへ置く。

**ネクストアクション:** profile fileをplugin deliverable・host別smoke testへ反映し、10-C GitHub tasklist分岐を議論する。

#### イテレーション3

##### 検証

- **観点**: 旧steeringは本文・tasklist template・自己レビューのそれぞれで固定GitHub scriptを要求する。`### GitHub`をcontextで管理しても、この3箇所を同じ分岐にしなければ、GitHub未記載repositoryへpublish taskが混入する。

##### 修正先の判断

- **診断レベルへの遡及**: GitHub adapterの配置だけでなく、tasklistに外部公開actionを生成する唯一の決定者を定める必要がある。

##### 根本原因3 + 提案3

- **根本原因3**: generic tasklist templateが外部公開actionを持ち、repository capabilityの判定がtemplateとsteering本文に分散している。
- **変更点**: 10-CではGitHub公開actionの生成・失敗・自己レビューを一つの契約にする。
- **提案3（現時点）**:
  - 総論: `steering`だけがmaintainerから返された`## steering / ### GitHub`を見て、tasklistの完了後actionを生成する。generic tasklist templateと自己レビューは固定push / PR scriptを持たない。
  - 各論:
    - ルール: `### GitHub`なしなら、ユーザー動作確認とsteering summary更新で完了する。commit・push・PR作成をtasklistへ書かない。
    - ルール: `### GitHub`ありなら、ユーザー動作確認の後に、GitHub接続・認証のpreflight、commit、current branchのpush、plugin内GitHub adapterによる既存PR取得またはPR作成を順にtasklistへ書く。
    - ルール: preflightまたはadapterが失敗した時、executorは外部公開actionを完了にせず、失敗内容と必要な利用者操作を報告する。GitHub以外のCLI・manual fallbackを推測して実行しない。
    - ルール: tasklist自己レビューは`### GitHub`あり/なしの分岐と、GitHubあり時のユーザー動作確認がcommit前にあることだけを確認する。旧`bash scripts/github/create_pr_from_branch_name.sh`の固定pathを確認対象にしない。

**現在の焦点:** 10-C GitHub tasklist分岐（未決）

**決定:** 10-Cを確定する。`steering`だけがmaintainerから返された`## steering / ### GitHub`により外部公開actionを生成する。generic tasklist templateと自己レビューは固定push / PR scriptを持たない。GitHub未記載ではユーザー動作確認とsummary更新で終え、GitHubありではユーザー動作確認後に接続・認証preflight、commit、current branchのpush、plugin内adapterによる既存PR取得またはPR作成を順に実行する。preflightまたはadapter失敗時は外部公開actionを未完のまま報告し、manual fallbackを推測しない。

**ネクストアクション:** designのGitHub分岐、steering skill / tasklist template / 自己レビューの置換範囲、受入基準を更新する。論点10を決定にする。

**論点10の結論:** 10-A context ownership / template path、10-B runtime-model-profiles、10-C GitHub tasklist分岐をすべて確定した。context lifecycle・model profile・GitHub公開actionの各正本を一意にし、旧契約を置換してからtasklistへ進む。

## 論点11: 設計議論で得た再発防止の置き場所を誤らない

**ステータス:** 決定

**提起の背景:** tasklist合意後の振り返りで、論点を一つのdecision boundaryへ分割できず、source of truth移管後の旧契約を見落とした再発防止を提案した。しかし「質問を一つにする」をthink-throughへ置く提案は、一般思考作法とsteeringの設計合意フローを混同している。

### 議論の変遷

#### 事象の記述

- 論点10はcontext、model profile、GitHub tasklistという独立契約を一つの論点に混在させ、ユーザーが一度に判断できなかった。
- source of truthをmaintainerへ移した後、design・template・tasklist自己レビューに旧契約が残った。
- plugin READMEへの高位原則追記は、plugin利用者に永続的な構造を知らせる候補として受け入れられた。

#### 原因の追跡

- なぜ: discussion entryの粒度と、steeringが設計を閉じる前に行う整合監査を明示していない。
- なぜ: 一般思考のruleと、steering成果物を作る時だけ必要なreview checklistを分けていない。

#### 根本原因₀ + 提案₀

- **根本原因₀**: 再発防止の知識を「一般的に見える」だけでthink-throughへ置こうとし、発生したworkflowの責務へ帰属させていない。
- **提案₀**:
  - 総論: 2・3は`steering` skillの設計レビュー手順へ置き、think-throughは変更しない。
  - 各論:
    - ルール: steeringのdiscussionでは、1つの論点に1つのdecision boundaryだけを置く。複数のowner・成果物・yes/noが必要なら、子論点へ分割してcurrent focusを示す。
    - ルール: source of truthを移す設計ではtasklist前に、旧owner、新owner、consumer、template、host設定、受入検証を列挙し、旧契約が残らないことを確認する。
    - 置き場所: どちらもpluginの`skills/steering/SKILL.md`のdesign review / discussion review checklist。静的なREADME知識ではなく、steering実行時だけ読む手順として置く。

**現在の焦点:** 2・3をthink-throughではなくsteering skillの実行手順に置くか（未決）

#### イテレーション1

##### 検証

- **観点**: steeringはtask-designを起動するオーケストレータであり、論点の分割とdesign artifactの整合を実際に扱うのはtask-designである。steeringへ置くと、同じ規則を二重に持つ。
- **弱点**: 「source of truth移管監査」を抽象語のまま提案し、何を監査して今回の何を防ぐのかを示していない。

##### 修正先の判断

- **診断レベルへの遡及**: 2はtask-designのdiscussion / design review手順に帰属させる。3は単なるチェックリスト追加ではなく、今回の見落としを再現できる具体操作まで定義できるかを先に確認する。

##### 根本原因1 + 提案1

- **根本原因1**: source of truthを「consumerが各自作成・読取」から「maintainerだけが解決」へ変えた時、旧契約を表すdesign 3-1、3-2、3-3、template、consumer説明、受入基準を一つの変更対象集合として列挙しなかった。
- **変更点**: 2はpluginの`skills/task-design/SKILL.md`へ置く候補に変更する。3は次の具体操作として理解・合意できる時だけ同じskillへ置く候補にする。
- **提案1（現時点）**:
  - ルール: task-designのdiscussionは、1見出しにつき1つの決定だけを扱う。複数の成果物・yes/noが必要なら、親子関係を作らず別論点へ分割し、現在議論する論点を示す。
  - 操作案: 設計判断が「正本 / owner / contract」を置換する時、変更した事実を保持する全artifactを列挙する。今回ならdesign 3-1 / 3-2 / 3-3、context template、maintainer、consumer skill、受入基準である。旧語・旧path・旧ownerを検索し、更新済みか、議論の履歴として`当時の状態`へ退避済みかを確認してからTBDなしと判定する。
  - 境界: これはrepository固有factsを保存する話ではない。task-designが「設計変更の影響範囲を閉じる」時だけ使う手順である。

**現在の焦点:** 2をtask-designへ置くこと、3の具体操作をtask-designの恒久手順にするか（未決）

**決定（2）:** 1論点1決定と、複数決定時は親子関係を作らず別論点へ分割する規則、判断前に決めること・影響成果物・推奨根拠を出す規則を`task-design/SKILL.md`のStep 3へ適用する。steeringとthink-throughには重複追加しない。

**残件（3）:** 「設計を変えた時に同じ内容を別の箇所にも直す確認」を恒久手順にするかは、表現と必要性を再説明してから判断する。

#### イテレーション2

##### 検証

- **観点**: task-designのStep 4には、design.mdを初見の設計者として通読し、他sectionとの前提矛盾がないか確認する既存規則がある。

##### 修正先の判断

- **診断レベルへの遡及**: 3は新しい知識・手順の欠落ではない。既存の最終通読を実行せず、正本変更後の矛盾を見落とした運用違反である。

##### 根本原因2 + 提案2

- **根本原因2**: 既存規則を適用しない失敗を、規則不足と誤診して追加の抽象用語で覆おうとした。
- **変更点**: 3は新規skill規則にしない。既存Step 4の最終通読・前提矛盾確認を守る。

**決定:** 3は棄却する。新たな「正本移管監査」はskillへ追加しない。論点11は、2のtask-design反映と3の棄却で完了する。

**ネクストアクション:** なし。
