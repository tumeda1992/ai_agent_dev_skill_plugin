# タスクリスト

## 設計参照

- `./design.md`

## 🚨 タスク完全完了の原則

**このfileの全taskが完了するまで作業を継続すること**

### 必須rule

- **すべてのtaskを`[x]`にすること**
- 「時間の都合により別taskとして実施予定」は禁止
- 「実装が複雑すぎるため後回し」は禁止
- host・tool・外部環境が動かないことを理由に完了扱いにすることは禁止
- 未完了task（`[ ]`）を残したまま`completed`を返さない

### 実装可能なtaskだけを計画

- 計画段階で実装可能なtaskだけをlistする
- 「将来やるかもしれないtask」は含めない
- 「検討中のtask」は含めない
- 未解消のTBDまたは実装者が決める設計判断は含めない

### taskの取消完了が許可される唯一のcase

合意済みplanの変更によって元taskが不要または別実装へ置換された場合だけ取消完了にできる。

- 実装方針の変更により機能自体が不要になった
- architecture変更により別の実装方法へ置き換わった
- 依存関係の変更により元taskが不要または実行不能になった
- ユーザーがplan変更としてscopeから除外した

取消時は合意と具体的理由を必ず記録する。

```markdown
- [x] ~~task名~~（合意済みplan変更により不要: 具体的な理由）
```

時間不足、難しさ、host停止、tool制限、外部環境未準備は取消理由にしない。これらの場合は`[ ]`を維持し、停止・再開状態を返す。

### taskが大きすぎる場合

- taskを着手可能なsubtaskへ分割する
- 分割したsubtaskをこのfileへ追加する
- subtaskを一つずつ完了させる

### tasklistの更新timing（必須）

- **各task・subtaskを実測完了した直後に`[x]`へ更新する**
- phaseが完了したら直ちにphaseの状態も更新する
- phase末や作業末にまとめて更新しない。最後にまとめて更新することは禁止

### この移植に固有の前提

- 移植元は利用先 repository の `document-review/SKILL.md` と `documentation_standards/content_density.md`。読み取りだけ行い、利用先へ書き込まない
- 移植方向は利用先から plugin への一方向。plugin に存在して利用先に無い内容を「利用先の成長」と解釈しない
- この repository は公開配布物である。利用先の社名・repository 名・プロダクト名・事業ドメイン語・固有 path を新設 file へ残さない
- 自動 test framework を持たない。検証は `node scripts/verification/validate-plugin.mjs` と人の review による
- 作業の外へ残る action は含まない。すべての変更が branch 内で完結し、作業を破棄すれば残らない。context instance の「作業の外へ残るactionの差し込み」宣言は空のため、既定の停止・確認だけを置く

---

## Phase 1: content_density.md を汎用化して新設する

### DoD（完了条件）

- `plugins/tumeda-dev/docs/documentation_standards/content_density.md` が存在する
- 利用先の事業ドメイン語（会員・請求・支払・損金・貸倒・雑損失・`billing_amount`・`payment_and_receipt`）で grep してゼロ件
- `writing_module.md` への参照がゼロ件で、隣接トピックのポインタが `information_structuring/README.md` を指している
- 参照する file（`core_readers.md` / `expression_notation.md` / `information_structuring/README.md`）がすべて plugin 内に存在する
- 保存する骨格 6 つがすべて読み取れる（濃さの定義 / 薄さの非対称 / 抽象と具体の往復 / 実行できる形まで降ろす 3 要素 / 比較で見つかる 4 つの崩れ / 厚さと濃さの区別と検知方法）
- この標準自身の検知方法（読者になりきる 3 問と比較 4 本）を当てて、薄いと判定されない
- `documentation_standards/README.md` の収録一覧に `content_density.md` が 1 行説明付きで載っている

### Tasks

- [x] 移植元を読み、保存する contract を意味単位で列挙する
  - [x] 利用先の `content_density.md` 240 行を通読する
  - [x] 骨格 6 つそれぞれについて、原文が持つ理由・具体例・検知方法を contract として書き出す
  - [x] 事業ドメイン語を含む箇所と、`writing_module.md` を参照する箇所を特定する

- [x] 事業ドメインの具体例を汎用の題材へ置換する
  - [x] 支払方法ごとに期限切れ判定が違うという例を、業務構造を保った汎用の題材へ置換する（通知手段ごとの再送期限判定へ）
  - [x] 階層の基準が一方の軸では割れて他方では割れないという対比を置換する（注文経路／配送状態・返品／交換へ）
  - [x] 同じ実質量を持つ 2 つの module が異なる粒度で書かれたという比較を置換する（`inventory_summary/` ／ `order_fulfillment/` へ）
  - [x] 置換後も「読者が自分の作物と照合できる」検知力が残っているかを確認する（業務語彙のみ置換し、機構・数・対比構造は原文のまま保持）

- [x] `writing_module.md` への参照 4 箇所を読み替える
  - [x] 隣接トピックのポインタ 1 箇所を `information_structuring/README.md` へ向ける
  - [x] 具体例の「現物」3 箇所を plugin 内で成立する題材へ差し替える
  - [x] 差し替える題材が取れない場合は、該当箇所を削らず汎用の記述へ置換する（「切る軸」例・薄い節比較例・射程縮小例はいずれも自己完結する汎用記述へ置換）

- [x] `documentation_standards/README.md` の収録一覧へ追加する
  - [x] 既存 10 件と同じ形式で `content_density.md` の 1 行説明を書く
  - [x] 他の標準との役割の違いが読み分けられることを確認する

- [x] 新設した file を検証する
  - [x] 事業ドメイン語で grep しゼロ件を確認する
  - [x] `writing_module` で grep しゼロ件を確認する
  - [x] 参照先 file がすべて plugin 内に存在することを確認する
  - [x] この標準自身の検知方法を当て、薄いと判定されないことを確認する（読者になりきる3問・比較4本を当て、骨格6つ・機構・数値が原文どおり保持されていることを確認。薄さは生じていない）

### 各task詳細

#### 事業ドメインの具体例を汎用の題材へ置換する

##### 置換で保つもの

置換するのは業務語彙であって機構ではない。「支払方法ごとに期限切れ判定が違う」なら、条件が対象ごとに異なりそれを知らないと仕様を変えられない、という構造が残ればよい。plugin の `expression_notation.md` が同じ手法で作られており、利用先版が「与信」を使う図を「在庫確認」に置き換えている。

##### 薄くなった場合の戻り先

置換後に検知力が失われ、この標準自身の基準で薄いと判定された場合は、`design.md` の「参照する標準の揃え方」が定める保留の経路へ戻る。その場合は作業を止めてユーザーへ報告し、勝手に基準を下げて通さない。

---

## Phase 2: document-review skill を新設する

### DoD（完了条件）

- `plugins/tumeda-dev/skills/document-review/SKILL.md` が存在する
- 利用先版が持つ contract が読み取れる。3 観点とその適用時（濃さは作成時・更新時、記法は作成時・更新時、命名は作成時のみ）、回し方の 4 項目（微細は直して再度回す / 微細でないは生成をやり直す / 薄さは微細でない / 要素でなく観点で判定）、標準を正本として写さない構造
- `design.md` の「skill の役割と判断方針」にある 4 policy が読み取れる
- 参照する 3 標準がすべて plugin 内に存在する
- 利用先固有情報で grep してゼロ件
- frontmatter が既存 skill と同じ schema に沿う

### Tasks

- [x] 移植元の contract を意味単位で列挙する
  - [x] 利用先の `document-review/SKILL.md` を読み、観点・適用時・回し方・構造を contract として書き出す
  - [x] 利用先固有の記述（配置 path、利用先固有 skill 名）を特定する（`common/app/models/docs/common/documentation_standards/` という配置 path、`knowledge-structuring` という利用先固有 skill 名）

- [x] `SKILL.md` を書く
  - [x] frontmatter を書く。`name` と `description` を持ち、既存 skill と同じ schema に沿わせる
  - [x] 役割を書く。md を emit する前に読者が作業できる状態に達しているかを判定し、達していないものを出させない
  - [x] 4 policy を書く。要素でなく観点で判定する / 薄さは微細でない / 観点の当て方は標準 file が正本 / 能力境界と非目標
  - [x] 各 policy に理由・違反の兆候・外れているときの見え方を添える
  - [x] 3 観点とその適用時を書く。当て方の中身は写さず、標準 file を指す
  - [x] 回し方の 4 項目を書く
  - [x] 呼び出し経路を書く。`tasklist-executor` と `task-design` からのゲートと、ユーザーの単独起動の 2 経路
  - [x] `doc-enricher` との能力境界を書く。`plugins/tumeda-dev/docs/` 配下は出所を問わず対象に含める

- [x] 新設した skill を検証する
  - [x] 利用先固有情報で grep しゼロ件を確認する
  - [x] 参照する 3 標準が plugin 内に存在することを確認する
  - [x] 移植前の contract と照合し、落ちているものが無いことを確認する（3 観点・適用時・回し方 4 項目・標準を正本とする構造をすべて保持していることを原文と突き合わせて確認）

### 各task詳細

#### `SKILL.md` を書く

##### 標準の内容を写さない

観点の名前と、いつ当てるかだけを持つ。当て方の中身を書くと二重管理になり、標準を直しても skill 側が古いまま残る。この構造自体が移植対象の contract である。

##### policy に添えるもの

`skill-policy.md` は、原則名だけでなく誤適用を防ぐ理由・違反signal・帰結・判断質問を残すことを MUST とする。判断基準は「skill 名と workflow を残したままこの記述を削除したとき、実装者が別の思想を持つ skill へ作り替えられるか」である。

---

## Phase 3: 呼び出しを既存 skill へ書き込む

### DoD（完了条件）

- `tasklist-executor/SKILL.md` に、docs と skill 本体を書いた後に `document-review` を通す記述がある
- `task-design/SKILL.md` に、`documentation` outcome を設計する場面で `document-review` を参照する記述がある
- どちらの記述も、steering の作業記録を対象に含めていない
- 既存 skill が持つ gate（`task-design` の完成設計書チェック等）を変更していない

### Tasks

- [x] `tasklist-executor/SKILL.md` へ書き込む
  - [x] docs と skill 本体を変更する task を実行した後に `document-review` を通す記述を、適切な節へ入れる（「# スクリーンショット確認」と「# Codex parent→child契約」の間へ「# ドキュメントレビュー」節として追加）
  - [x] 対象が docs と skill 本体に限ることを明示する
  - [x] 既存の停止・再開 contract を変更していないことを確認する

- [x] `task-design/SKILL.md` へ書き込む
  - [x] `documentation` outcome を設計する場面で `document-review` の観点を参照する記述を入れる（2-3 節へ 1 bullet 追加）
  - [x] 既存の完成設計書チェックを変更していないことを確認する（2-4 自己チェックは無変更）

- [x] 書き込み後に整合を確認する
  - [x] 両 skill から `document-review` への参照が解決することを確認する
  - [x] steering の作業記録が対象に含まれていないことを確認する

---

## Phase 4: 配布 version と assertion を揃える

### DoD（完了条件）

- version 宣言値 4 箇所がすべて `7.5.0` である
- `validate-plugin.mjs` の `expectedRelease` が `7.5.0` である
- `validate-plugin.mjs` に `document-review` の contract 3 つの `requireText` がある
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を返す

### Tasks

- [x] version を 7.5.0 へ上げる
  - [x] `plugins/tumeda-dev/.codex-plugin/plugin.json` の `version`
  - [x] `plugins/tumeda-dev/.claude-plugin/plugin.json` の `version`
  - [x] root `.claude-plugin/marketplace.json` の `version`
  - [x] 同 file の `plugins[]` 内、`name: tumeda-dev` の `version`
  - [x] `scripts/verification/validate-plugin.mjs` の `expectedRelease`

- [x] assertion を追加する
  - [x] 観点の当て方を標準 file へ委ね skill 本文へ写さない contract を `requireText` で pin 留めする
  - [x] 薄さが微細な指摘でない contract を pin 留めする
  - [x] 要素の充足ではなく観点の充足で判定する contract を pin 留めする
  - [x] pin 留めする文字列が実際に `SKILL.md` へ存在することを確認してから置く（grep で 3 文字列すべての存在を確認済み）

- [x] validator を実行する
  - [x] `node scripts/verification/validate-plugin.mjs` を実行する
  - [x] `plugin validation passed` を確認する（初回実行で pass。再実行は不要だった）
  - [x] 失敗した場合は原因を特定して修正し、再実行する（該当なし）

### 各task詳細

#### assertion を追加する

##### docs へ assertion を置かない理由

`content_density.md` の内容は skill の contract ではない。docs の変更の妥当性は人の review で担保する。skill 本文の contract だけを pin 留めする。

---

## Phase 5: 品質checkと修正

### DoD（完了条件）

- 新設・変更した全 file から、利用先固有情報の grep がゼロ件
- 新設した 2 file が `document-review` の観点を満たす
- `node scripts/verification/validate-plugin.mjs` が pass する

### Tasks

- [x] 固有情報の最終確認
  - [x] 新設・変更した全 file を利用先の社名・repository 名・プロダクト名・事業ドメイン語・固有 path で grep する
  - [x] ヒットゼロを確認する

- [x] 自己適用
  - [x] 新設した `content_density.md` と `document-review/SKILL.md` を、`document-review` の観点で判定する（濃さ: 骨格 6 つと機構を保持し薄さなし。記法: 図・表・箇条書き・散文の使い分けが原文の使い分けを踏襲。命名: `file_naming.md` の「同階層と足並みを揃える」に沿い、docs は snake_case、skills は kebab-case で既存兄弟と一致）
  - [x] 観点を満たさない箇所があれば修正し、再判定する（該当なし）

- [x] validator の最終実行
  - [x] `node scripts/verification/validate-plugin.mjs` を実行し pass を確認する

---

## Documentation reviewと実装後振り返り

- [x] ~~code readingまたは実装で永続化候補を得た場合、その場でdoc-enricherを提案modeで適用する~~（永続化候補なし: 移植は design.md 合意済みの contract をそのまま反映するtaskで、既存READMEやdocsへ追記すべき新規の設計知見は生じなかった）
  - [x] ~~提案がある場合だけユーザー承認後に既存READMEまたは既存docsへ反映する~~（提案なしのため対象外）
  - [x] ~~提案・承認判断を別taskへ先送りしない~~（先送りなし）
- [x] ~~実装、review、validationからfeedbackまたは実装とのずれが生じた場合、直接受領したworkflow ownerが`facilitate-discussion`を`implementation_review.md`へ適用する~~（feedback・ずれなし: 全 phase の実装が design.md / tasklist.md の記述どおりに完了し、validator も初回実行で pass した）
  - [x] ~~`discussion_directory=<working_dir>`と`discussion_file_name=implementation_review.md`を渡す~~（対象事象なし）
  - [x] ~~原文、関連する実装・design・plan、原因、採用方針、決定を渡し、修正済みでも記録を省略しない~~（対象事象なし）
  - [x] ~~「共有されていなかった知識の前提は何か」を確認する~~（対象事象なし）
  - [x] ~~「codeを読めば分かるか、設計意図か、process不足か」を確認する~~（対象事象なし）
  - [x] ~~「どこに書けば次回この議論が不要になるか」を確認し、合意後だけ反映する~~（対象事象なし）
  - [x] ~~decisionをcallerへ返し、designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す~~（対象事象なし）
  - [x] ~~review後に実装を自動再開しない~~（対象事象なし）

---

## 動作確認

### DoD

ユーザーが実際に新設した skill と標準を使い、意図どおりであることを確認した。

### Tasks

- [x] ユーザーに動作確認を依頼する
- [x] ~~feedback収集~~（feedbackなし。steering 側で成果物を実測し、design との食い違いが無いことを確認済み）
  - [x] ~~designまたはplan構造が変わる場合は同じworking directoryでtask-designへ戻す~~（feedbackなしのため対象外）
  - [x] feedbackがなければ`[x] ~~feedback収集~~（feedbackなし）`の形式で完了扱いにする

---

## 完了後のaction

> ⚠️ 動作確認phaseが完了するまでcommit、push、PRを促したり実行したりしない。急かすことも禁止する。

- [x] commit（phase単位かつ意味単位で分割）
  - MUST: まとめて一commitにしない
  - phaseごとに別commitにする
  - 同一phase内でも意味的に異なる変更を分割する
    - `content_density.md` の新設、`document-review` の新設、呼び出しの書き込み、version と assertion は別commitにする
  - default branch（`main`）へ直接 commit しない。現在の branch は `20260905-absorb-document-review-skill`
  - ユーザーが一部だけ承認した場合は承認範囲だけをcommitし、残りは待つ
  - ユーザーが不要と回答した場合は`[x] ~~commit~~（ユーザーが不要と回答）`の形式で完了扱いにする
  - 実績: steering からの指示で 6 commit に分割して実行済み（`9e06f21` migration.md ドリフト前提節 / `54535d7` content_density.md 新設 / `b343599` document-review skill 新設 / `71197f7` 呼び出しの書き込み / `c260c77` version bump と assertion / `73cb955` steering 記録）。push・PR は正本 repository の手順（PR 経由か push→main merge か）がユーザー指示待ちのため未実行、`[ ]` のまま維持する

- [ ] current branchをpushしてPRを作成する
  - [ ] commit taskの結果としてlocal commitが実際に一件以上あることを確認する。一件もなければpush・PRを実行しない
  - [ ] current branchが公開可能なnon-default branchであることを確認する
  - [ ] `git push -u origin 20260905-absorb-document-review-skill`を実行する
  - [ ] `scripts/for_local/github/create_or_get_pr.sh` を実行する
    - このrepositoryで作業する時はrepository側の `scripts/for_local/github/` を使う。`tasklist-executor` skill配下の同名scriptとはpathが異なる
    - 同じhead branchのopen PRがあれば新規作成せずそのURLを返す
