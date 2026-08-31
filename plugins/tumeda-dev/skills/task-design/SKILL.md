---
name: task-design
model: opus
description: |
  変更タスクが与えられたとき、変更前の不確実性をゼロにするための設計プロセス。
  「設計書を書く」のではなく、後続作業では合意済みの内容を手を動かして反映するだけの状態を作ることが目的。

  以下のいずれかに該当する場面で積極的に使う:
  - 機能追加・変更の要件が渡されたとき
  - 「どう実装すればいいか」を問われたとき
  - 複数ファイル・レイヤーにまたがる変更が含まれるとき
  - ドメイン命名・DB設計・API 設計が絡むとき
  - 実装方針が決まっていない状態で「作って」と言われたとき
  - docs、skill、prompt、規範、調査結果等の完成後の姿を設計するとき

  デフォルトモデル: Opus（設計判断の質が要求されるため）。
  Sonnet で起動された場合でも、このスキル実行中は Opus に切替が望ましい。

  design中に対象成果物へ適用する変更の分類・反映・validationと、execution plan対象がある場合の
  排他的なtasklistまたはroadmapの設計・review・合意までを所有する。
---

# task-design スキル

---

## 1. スキルの目的

実装タスクが来たとき、コードを書く前に設計を完了させるためのスキル。
設計完了の定義は「実装中に新たな設計決定が生まれない状態」— 全 deliverable に対して「これを実装するとき、設計外の判断をしなければならない箇所はないか」と問えて「ない」と答えられる状態。
Sonnet は「実装に入りたい衝動」を持っているため、このスキルはその衝動を止め、対話と合意で設計を積み上げる役割を担う。「設計書を書く」ことが目的ではなく、「実装は手を動かすだけ」の状態を作ることが目的。

**起動形式**: 単独起動・steering 経由起動 どちらも可。呼び出し側は必要に応じて親ディレクトリ（`working_dir_parent`）と新規作成フラグ（`create_working_dir`、default `true`）を渡す。task-designが設計成果物の配置先（`working_dir`）を確定する（詳細: section 5 PrepareStep 2）。

ユーザーとの会話と成果物本文は日本語で記述する。code、command、path、identifier、規定された出力形式、固有名詞は原文を維持する。

**全成果物（`design.md`、`requirements.md`、`investigation.md`、`task-design-discussion.md`、`tasklist.md | roadmap.md`等）でdomain固有名詞を略称で書かない。** 公開class名、model名、operation名は完全な名前で書き、内部だけで通じる頭字語を使わない。略称は未来の実装者に意味の再調査を強制し、reading costを上げる。

- 悪い例: 「UPの権限を確認する」「PMを作成する」
- 良い例: 「`UserProfile`の権限を確認する」「`PaymentMethod`を作成する」

repository固有の設計文書、規約、技術検証環境・commandが必要な時は、`maintenance-plugin-context`へconsumer=`task-design`、必要理由、必要fact、確認元候補を渡す。返された範囲だけを使い、固定pathや固定commandを推測しない。

---

## 2. 設計とは何か

### 2-1. 定義（設計と実装の境界）

設計とは、タスク着手前に「実現された後の世界」を描き、実装で必要になる判断をすべて事前に終わらせる行為。ドキュメントを書く行為ではなく、「実装中に新しい判断が生まれない状態」を作る行為。

**設計と実装の境界:**
- **設計** = 「完成後の世界がどうなっているか」を合意する段階
- **実装** = 設計で決まったことをコードに落とす段階

実装中に「これどうしよう」が出るなら、設計が完了していない。書きながら考えるのは設計ではない。

**設計対象はcodeに閉じない。** 操作、screen、data、public contract、file、documentation、runtime、workflow、research finding等のうち、今回の終了時に変わる対象を`templates/outcome-sections/catalog.md`から選ぶ。固定された全観点を機械的に埋めるのでも、code以外は完成後の姿が不要とみなすのでもない。

`assignMember` と `setMemberId` のどちらを選ぶかも設計。`architecture.md` に何を書くかも設計。これらを「実装中に決めればいい」と思った時点で、設計の輪郭がずれている。

**「変更点の列挙」は設計ではない:**
「どのファイルに何を加えるか」は実装計画。変更点を網羅しても、完成後の世界の合意がなければ設計は未完。

### 2-2. ゴール（ネガティブ定義 + 自己診断）

設計の完了は「ドキュメントが埋まった状態」ではない。
以下の3つに該当する間は、書類が完成していても設計は未完。

**ネガティブ定義1: 実装中に新しい判断が生まれる**

「メソッド名は実装しながら決めよう」「データ構造は書きながら詰めよう」と思っている。
実装中に出る判断は、本来設計で確定させておくべきだったもの。

→ **問い:** 「今コードを書き始めたとき、判断する場面はゼロか？1つでもあれば設計は未完」

**ネガティブ定義2: 完成後の姿が描けず、変更点だけ列挙している**

「どのファイルに何を加えるか」は答えられるが、「ユーザーが操作したとき何が起きるか」「完成後のデータはどんな値が入るか」が答えられない。
変更点の網羅は実装計画であって、完成後の世界の描写ではない。

→ **問い:** 「完成後のデータを具体値で示せるか？操作の step by step を示せるか？」

**ネガティブ定義3: 「全セクションを埋めた = 設計完了」と判定している**

書類の充足を完了基準にしている。設計の完了基準は「書類が埋まったか」ではなく「設計外の判断が残っていないか」。
全項目を埋めても TBD のように「決めきれていない判断」が残っていれば設計は未完。

→ **問い:** 「ok の根拠は『書類が埋まった』か『設計外の判断が残っていない』か？」

### 2-3. 完成後の姿を捉えるoutcome section

`templates/outcome-sections/catalog.md`を先頭から末尾まで完全に読み、今回変わる対象に必要なsectionを一つ以上選ぶ。選んだ各fileも完全に読み、`design.md`の「完成後の姿」へ差し込む。

- 各sectionは単なる記入formatではない。「なぜ必要か」「NG」「具体的な記述例」「MUST」「判断基準」に反しない具体性で書く。
- 該当しないsectionを「なし」で機械的に埋めない。選ばなかった観点の判断が実装者へ残る場合は、そのsectionを追加する。
- 複数sectionを使っても完成後の姿はtask-design全体で一つであり、execution plan対象ごとの小さな設計書に分けない。
- 調査、比較、技術検証が主成果の場合だけ`research-findings.md`を選ぶ。別outcomeを設計する途中で得た事実は、該当outcome sectionへ根拠として書き戻す。
- docsを本質的に新設・更新する場合は`documentation.md`を使い、物理fileの仕様だけなら`file-deliverables.md`、skill等のprocess contractなら`workflow.md`も組み合わせる。

### 2-4. 自己チェック

「この deliverable を実装するとき、設計外の判断をしなければならない箇所はないか」→ YES が残るなら設計は未完。

---

## 3. 設計を進めるうえでの思想

### 3-1. WHY→WHAT→HOW の順序

**思想:**

設計は WHY（なぜ作るか）→ WHAT（何を作るか）→ HOW（どう作るか）の順序で下ろす。WHY が合意されれば HOW は自然に導かれる。HOW から始めると WHY を暗黙のうちに決めてしまい、後で WHY に異議が出たとき全部やり直しになる。WHAT を間に挟むのは「目的に対するスコープ」を独立した合意点にするため。

**違反シグナル:**
- 「どのファイルをどう変更するか」から書き始めている
- TL;DR が「何を作るか」だけで「なぜ作るか」が書かれていない
- 機能要件の議論をスキップして実装方針の提案を出している
- 「とりあえず動くもの」を出すために WHY を後回しにしている

**帰結:**

WHY が暗黙のまま実装が進み、レビューで「そもそもこれ必要?」となって全やり直し。スコープの議論が後出しになり「これも必要だった」が積み増される。手戻りコストは初期に WHY を詰めるコストの数倍。

**問い:**
- 「TL;DR を読んで、なぜこれを作るのかが分かるか?」
- 「いま HOW を WHY なしで書き始めようとしていないか?」

---

### 3-2. イテレーティブに進める / TBDで全体を先に見せる

**思想:**

設計は1回で書き上がらない。初稿は TBD（未決事項）を含んでよい。
全セクションを一気に埋めると、各論を詰めずに総論で穴埋めし「設計した」と錯覚する。
正しい進め方は「TBD 込みで全体を見せる → 上位の論点を1つ問う → 合意したら埋める → 埋めた結果から次の論点が生まれる → 繰り返し」。

TBD を能動的に使うと:
- 個別の問いをすべて解決する前に「構造への合意」が取れる
- 全体を見てから「この TBD は答えなくていい」と気づける（問い自体が消える）
- 上位の合意なしに並列で問うと、上位が変わったとき下位の答えがやり直しになるのを防げる

**違反シグナル:**
- 全セクションを TBD なしで一気に埋めて「レビューお願いします」と出している
- TBD を「決まっていないことの表明」として受動的に使っている（埋めるための問いを立てない）
- 上位の論点が未決のまま下位の問いを並列に投げている
- 「全部決まってから出そう」と思って書き溜めている

**帰結:**

総論だけ並べた「設計した感」のドキュメントが完成する。各論が詰まっていないため、実装中に判断が出る。
あるいは上位の合意が後から覆って、書いた下位の答えが全部やり直しになる。

**問い:**
- 「いま埋めようとしている TBD は、上位の合意の上に乗っているか?」
- 「全体構造を先に見せて『この TBD は不要』と気づけたか?」
- 「TBD をなくすために、いま自分が問うべき1つの論点はどれか?」

---

### 3-3. 合意を土台に積み上げる

**思想:**

設計は合意の上に合意を積み上げる行為。下位の合意は上位の合意を前提とするため、上位が動けば下位は崩れる。だから「合意したことは確定として固める」「合意していないことは未決として扱う」を厳密に区別する。

合意には粒度がある:
- 総論（方向性）の合意 ≠ 設計合意。「方向性は合っている」では実装中に判断が残る
- 各論（具体的な詳細）まで揃って初めて合意とみなす
- 「ok」は確定版への合意。途中のフィードバック応答とは区別する

合意の積み上げ順序はロジックツリーの上位から再帰的に。最も多くの下位問いを規定する問いを先に解決する。回答を得るたびに「依存関係の構造が変わった」と認識し、次の最上位を選び直す。

**違反シグナル:**
- 「方向性に ok」を「設計合意」と読み替えてテンプレート・実装まで進めている
- 上位未合意のまま下位の選択肢を一度に並べている
- 途中フィードバック中の発言を「合意」と扱って次に進んでいる
- 各論を詰めずに「だいたい合意取れた」で実装を始めている

**帰結:**

合意の前提が崩れて、書いた内容が無駄になる。
あるいは「合意したつもり」のまま実装し、レビューで「これは合意していない」と差し戻される。
何度かやり直しが起きると、設計プロセス自体が信頼を失う。

**問い:**
- 「この『ok』は何に対する ok か? 方向性か、各論まで含む確定か?」
- 「いま並列に問おうとしている下位は、共通の上位が合意済みか?」
- 「実装の前提にしている合意のうち、各論が未決のものはないか?」

---

### 3-4. 不確実性のためならコードを書く

**思想:**

設計は「考える」フェーズだが、考えるだけで潰せない不確実性は実在する。
外部 API の挙動、認証の実際のレスポンス、環境依存の動作 — これらは議論や既存コードを読んでも確定しない。
そういう TBD は技術検証実装（最小限の動作確認用コード）を書いて潰す。

TBD 解消の3手段:
1. **議論** — ユーザーの判断・方針で決まるもの（ドメイン設計・規約選択）
2. **調査** — 既存コードや外部ドキュメントを読めば分かるもの
3. **技術検証実装** — 動かさないと分からないもの（API 疎通・外部サービス設定・環境依存挙動）

技術検証実装の目的は本実装ではない。動作確認だけして、得られた事実を design に書き戻して TBD を潰す。
書いたコードは捨ててよい。残るのは事実だけ。

**違反シグナル:**
- 「設計フェーズだから実装しない」と思い、実行しないと分からない TBD を未解消のまま実装フェーズに送っている
- 外部 API の仕様を「ドキュメントに書いてあるはず」と推測で埋めている
- 技術検証実装を書く前に「これは設計？実装？」で迷って動けなくなっている
- 技術検証のはずが本実装になり、設計に戻らずそのまま走り続けている

**帰結:**

実装中に「思っていたのと違った」が起きる。外部 API のレスポンスが想定と違う、認証フローが追加で必要、環境変数が足りない — どれも設計時に技術検証で1度動かしておけば 5分で潰せたもの。
未解消の TBD を実装フェーズに送ると、実装が止まり、ユーザーが介入する羽目になる。

**問い:**
- 「この TBD は議論・調査で解消できるか? できなければ技術検証実装で動かす」
- 「外部依存（API・認証・環境）の挙動を、推測で埋めていないか?」
- 「いま書こうとしているコードは技術検証実装（事実取得用）か、本実装か?」

---

### 3-5. 設計は対話であり転記ではない

**思想:**

設計は AI が単独で書ける成果物ではない。ユーザーが持つドメイン知識・プロジェクト規約・プロダクト哲学が前提として必要で、それは対話でしか引き出せない。

転記には3種類ある:
- 既存ドキュメント（steering 内容や類似例）をそのまま貼る
- ユーザーの発言を脊髄反射で文書に落とす
- 推測で埋めてユーザーの承認を待つ

どれも「考える」工程を省略しているため、AI 側に積み上げが起きない。
設計は「AI が咀嚼してから提案する」「ユーザーが咀嚼してから返す」を交互に積み上げる行為。

**違反シグナル:**
- 「ユーザーが言ったから変更する」で動いている（自分の考えなしに変更）
- 「どうお考えですか?」と先に問い、自分の見解を後出しにしている
- 既存 steering の文章をそのまま貼って提案にしている
- 推測で埋めた成果物を「レビューお願いします」と承認待ちにしている
- ユーザーが指摘した瞬間にスキル・テンプレートを修正し始めている（合意なしに型を変える）

**帰結:**

ユーザー側に思考負担が乗り、AI が「壁打ち相手」ではなく「承認依頼マシン」になる。
転記された成果物は文脈が浅く、実装中に「これ、なぜこう書いたんだっけ?」が起きる。
合意なしに型を変えると、ズレたまま固まり、後の作業全部に効く。

**問い:**
- 「いまユーザーに問おうとしていることを、自分で先に考えたか?」
- 「この提案は転記か? 自分で咀嚼した結果か?」
- 「ユーザーの発言を、合意プロセスを経ずに即反映していないか?」

---

## 4. 成果物テンプレート

配置先は section 5 PrepareStep 2 で確定する `working_dir` 配下。

task-designの成果物は、一つのdesign、必要時のdiscussion記録、条件に合致する場合だけの排他的なexecution planから成る:

- **design.md** — 合意済みの設計内容を集約する場所。テンプレート: このskill directoryの`templates/design.md`
- **task-design-discussion.md** — 議論の変遷を記録する場所。discussion processとentry形式の正本はpluginの`facilitate-discussion` skill
  - steering でも `discussion.md` を継続使用するため、task-design 起源の議論記録は `task-design-discussion.md` にして区別する
- **tasklist.md | roadmap.md** — execution plan対象が一件以上ある場合だけ、合意済みdesignを実行可能にする排他的なplan。leafは`tasklist.md`、compositeは`roadmap.md`を作り、同じ`working_dir`に両方を正本として置かない

execution planを作る場合、その設計はtask-designの一部である。詳細規則は長さのために本体から分割した`tasklist-design.md`または`roadmap-design.md`を、対応するplan phaseへ入る直前に先頭から末尾まで完全に読む。

### design.md の使い方

「議論の入力」ではなく「議論の結果」を記録する場所（3-5 思想に対応）。

更新タイミング:
- 一つの論点でdecisionが確定するたびに、その場で書き戻す。複数論点の完了まで保留しない
- 未決事項は TBD として残し、何が未決かを明記する
- 未決の提案を`design.md`へ書かない。`facilitate-discussion`が完全な現在案をdiscussion fileへ保存し、chatで合意した後、task-designが確定したdecisionだけを書き戻す

構造の詳細はテンプレートファイル参照。

### task-design-discussion.md の使い方

task-designは、working directory、議論を開始する判断、設計固有contextの受渡し、決定後の`design.md`反映、設計完了判定を所有する。discussion fileの解決、対象論点の選択、提案、iteration、feedback routing、合意、採番、親子関係、履歴保持は`facilitate-discussion`へ委ねる。discussion内部processをtask-design側で再定義しない。

議論開始後はtask-design agent自身が次を渡して`facilitate-discussion`を明示適用する。議論だけを別child agentへ再委譲しない。

```text
discussion_directory=<working_dir>
discussion_file_name=task-design-discussion.md
```

#### `facilitate-discussion`へ渡す設計context

directoryとfile名に加え、そのdiscussionで判断に必要な次の情報を自然言語contextとして渡す。

- 設計目的と完了条件
- 現在の`design.md`と関連する合意済み設計
- 解消したい設計上の不確実性と、その結論によって変わる設計範囲
- 該当するWHY・WHAT・HOWと、完成後の姿を捉える観点
- 調査・技術検証実装で確定した事実
- 現在の対象成果物変更のrouting stateと、未決decisionへの依存関係

task-designは`topic_id`、提案番号、iteration番号、`親論点`、entry formatを指定しない。これらはdiscussion fileの状態から`facilitate-discussion`が管理する。設計固有の判断材料を渡すことと、discussion内部の提案・論点構造をcallerが組み立てることを混同しない。

#### discussionを開始する時と返却後

discussionは既定で開始する。適用中の提案作成、論点選択、iteration、feedback routing、合意は`facilitate-discussion`へ委ねる。

開始しないのは次のどちらかに当たる場合だけである。それ以外は判断せず開始する。

- `design.md`に未解消のTBDが一つも残らず、新たな論点も生じていない。
- 残る不確実性が、ユーザーへ問わずに確定する。Step 3の`調査`または`技術検証実装`だけで事実が決まる。

往復回数の予測、assistantが既に結論を持っているか、論点が選択肢へ畳めるかは、開始しない理由にならない。「これは議論ではなく確認だ」「もう答えが決まっているので1往復で済む」という分類も理由にならない。調査で得た事実だけでは設計が決まらないと分かった時点で開始する。

assistantが結論を持っている論点ほどdiscussionを外しやすい。しかしそこでは、採らなかった案と採らなかった理由がassistantの中にしか存在しない。記録を省くと、次に同じ判断へ来た者がゼロから同じ検討をやり直す。結論を持っているほど記録価値は高い。

`facilitate-discussion`は一つの論点でdecisionを確定するたびにtask-designへ返す。task-designはそのdecisionと具体的なhandoffが返った直後に`design.md`へ反映し、次の論点を扱う前に設計全体の不確実性と完了条件を再評価する。複数論点のdecisionを溜めて最後に一括反映しない。

---

## 5. 進め方（フロー）

設計を進める手順。思想（section 3）と分離した「動作」レイヤ。

### PrepareStep 1. トリガー判定

変更または設計タスクが来たら、このスキルの起動条件に該当するか確認する（section 7 参照）。
- 該当 → PrepareStep 2 へ
- 軽度の修正で起動条件外 → スキルなしで進める

### PrepareStep 2. 配置先確定

設計成果物（design.md / spike/ / task-design-discussion.md / 条件付きのtasklist.md | roadmap.md）を置くディレクトリを確定する。

入力契約:

- `working_dir_parent`: 省略可能。`create_working_dir`に応じて、新規ディレクトリの親または直接利用する既存ディレクトリを表す
- `create_working_dir`: 省略可能なboolean。defaultは`true`
- 子roadmap phaseからの任意入力: `parent_roadmap_path`、`parent_phase_id`、`parent_design_path`、`dependency_results`。一つでも渡された場合は4項目を一組として必須にする

| `create_working_dir` | `working_dir_parent` | 解決する`working_dir` |
| --- | --- | --- |
| `true` | 指定あり | `<working_dir_parent>/<YYYYMMDD-slug>`を新規作成 |
| `true` | 指定なし | `<current working directory>/<YYYYMMDD-slug>`を新規作成 |
| `false` | 指定あり | `working_dir_parent`自体を直接利用 |
| `false` | 指定なし | 入力不足として、既存ディレクトリの指定をユーザーへ求める |

`create_working_dir=true`の手順:

1. `working_dir_parent`を絶対パスへ解決する。相対パスはtask-design起動時のcurrent working directoryを基準にし、未指定なら同じcurrent working directoryを使う。親ディレクトリが存在しなければ推測で作らず、既存の親ディレクトリをユーザーへ求める。
2. `.agents/skills/name-work-directory`を明示適用し、作業内容と実行時のローカル日付から`YYYYMMDD-slug`のbasenameを一つ受け取る。
3. `<working_dir_parent>/<basename>`が存在しないことを確認して作成し、その絶対パスを`working_dir`とする。
4. 同名pathが存在する場合はsuffix追加や上書きをしない。既存pathを`create_working_dir=false`で再利用するか、別の親ディレクトリを使うか、ユーザーへ確認する。

`create_working_dir=false`の手順:

1. `working_dir_parent`を絶対パスへ解決し、そのpath自体を`working_dir`とする。
2. `.agents/skills/name-work-directory`を適用せず、ディレクトリも作成しない。pathが存在しなければ、既存ディレクトリの指定をユーザーへ求める。

確定後、task-designは`working_dir`の絶対パスを呼び出し側へ返す。`<working_dir>/design.md`はStep 1で作成し、`<working_dir>/spike/`はStep 3で技術検証実装が必要になった時だけ作成する。discussion fileの作成・継続利用は、§4の設定を受けた`facilitate-discussion`が行う。execution planはdesign合意後、かつ対象が一件以上ある場合だけ作成する。

子roadmap phaseの入力を受けた場合、task-designは`parent_roadmap_path`の対応phaseを読み、`parent_phase_id`が一意に存在し、渡された親designとdependency resultsが対応することを確認する。Step 1の時点で、親roadmap path、親phase identity、親phaseの目的・scope・scope外・DoD・依存確定結果を`design.md`の「上位roadmap制約」へ記録する。これは参考情報ではなく子designの上位制約であり、子scopeは親phase scopeよりstrictly narrowerでなければならない。成果物種別にかかわらず省略しない。

### PrepareStep 3. 設計前調査

`working_dir`を確定した後、初稿を書く前に、`maintenance-plugin-context`へconsumer=`task-design`、必要理由、必要fact、確認元候補を渡す。返された文書・command・環境だけを使い、固定pathやrepository構造を推測しない。

1. 許可されたプロジェクト指示、architecture・開発規約、test方針を読む。
2. 類似実装を検索し、少なくとも次を確認する。
   - 類似機能
   - 命名
   - 例外処理
   - test pattern
   - layer・責務境界
3. GraphQL mutationまたはCommandの変更・追加では、関連moduleのREADMEを先に読み、orchestration patternを把握する。READMEに答えがない場合だけ既存の関連resolver等の実装へ進む。確認する観点は「どのdomain aggregateが、どのlayerで、どのように組み合わされているか」である。
4. codeを読んで初めて分かった永続性とレバレッジの高い知識は、次回codeを読まずに済むよう、contextが熱いうちに`doc-enricher`へ即座に渡す。codeを読むたびにcontextを消費するため、既存READMEまたは既存docsへessenceがあれば次回の調査を省ける。`doc-enricher`の提案とユーザーの承認・拒否判断までをその場で完了し、別taskへ先送りしない。書込みは承認された場合だけ行う。
5. UI挙動・表示を変える場合は、pluginの`visual-inspector`をchildとして使い、現状の画面を実測する。codeからの推測を画面事実としてdesignへ書かない。確認例は、headerが固定されているか、scroll時の挙動、layout崩れである。Playwright toolを直接呼ばず、必ずpluginの`visual-inspector` skillを使う。

調査で得た事実と、そこから導く設計判断を分離する。事実だけでdesignが決まらない場合はStep 3のdiscussionへ進み、調査結果を未合意案として`design.md`へ固定しない。

### Step 1. 初稿（TBD 込み）を作る

`templates/design.md`と`templates/outcome-sections/catalog.md`を完全に読む。catalogから今回変わる対象に必要なoutcome sectionを一つ以上選び、選んだfileも完全に読んで、task-design全体で一つの完成後の姿としてdesign.mdを初稿する。
- 分かっている部分だけ書く
- 未合意の部分は `TBD: （何が未合意か）` の形で残す
- 解消が必要な設計上の不確実性をTBDとして識別する。この時点ではdiscussion fileの論点・提案・親子関係を組み立てない

この時点ではまだユーザーに「レビューお願いします」を出さない。

成果物本文ではdomain固有名詞を曖昧な略称にせず、公開class・model・operationは完全な名前で記録する。`requirements.md`や`investigation.md`を使う場合も同じ`working_dir`へ置き、別の正本を作らない。

#### investigation.mdのlifecycle

調査結果によってdesign方針が変わり得る場合だけ`investigation.md`を作る。単なるreading logや既に方針が決まった調査には作らない。

1. 調査目的、未確定の判断、確認方法、終了条件をユーザーと合意する。
2. 確認した事実、実測結果、設計への影響を区別して記録する。
3. 結果から方針を確定し、合意したdecisionを`design.md`へ反映する。
4. `investigation.md`をexecution planやdesignの代替正本にしない。

#### requirements.mdの切り出し

Requirementsが長く、独立fileにするとreview可能性が上がる場合だけ`requirements.md`へ切り出す。短いRequirementsは`design.md`に残す。切り出す場合は同じ`working_dir`へ保存し、`design.md`側を明示linkへ置き換え、同じRequirementsを二重管理しない。

### Step 2. 全体構造を見せて合意を取る

TBD 込みの初稿をユーザーに提示し、**構造への合意**を取る。
- 「全 TBD を埋めてください」は出さない
- 「この骨格でいいか」のみ問う
- 構造合意後、下位判断を最も多く規定する設計上の不確実性を一つ選ぶ

### Step 3. 未解消の設計判断を解消する

これはtask-designが所有する外側の設計loopである。discussionを選んだ後の提案、論点、iteration、feedback routing、合意は`facilitate-discussion`の内側loopであり、ここへ複製しない。

1. `design.md`と合意済み設計を読み、解消すると下位判断を最も多く確定できる設計上の不確実性を一つ選ぶ。
2. 不確実性の解消手段を選ぶ。

| 判定 | 解消手段 |
| --- | --- |
| ユーザーへ問わなければ確定しない | discussion |
| 既存code・documentを読めば事実を確定できる | 調査 |
| 実行しなければ挙動を確定できない | 技術検証実装 |

解消手段はこの三つだけである。`確認`、`念のため聞く`、`選択肢を出して選んでもらう`は第四の手段ではなく、すべてdiscussionである。

3. 選んだ手段を実行する。
   - discussion: §4のtask-design固有contextを渡して`facilitate-discussion`を明示適用し、内部processを委ねる。task-design側で先に提案0をchatへ出したり、論点・iteration・質問形式を組み立てたりしない。
   - 調査: repository contextが許可したsourceを読み、設計判断の入力になる事実を特定する。
   - 技術検証実装: 下記の配置・運用契約に従い、実行しなければ分からない事実だけを確認する。
4. discussionでは、一つの論点でdecisionが返るたびに、そのdecisionだけを`design.md`の該当箇所へ直ちに反映する。調査・技術検証実装では、確定した事実だけを反映する。未決の提案や途中経過は書かず、複数decisionを最後まで溜めない。
5. decisionまたは事実から対象成果物の変更が生じるたびに、tasklist作成直前まで待たず、`design.md`付録のrouting stateへ分類する。
   - 未決decisionによって内容またはownerが変わる: `分類保留`
   - task-designが適用するが、他の未決事項との整合性を待つ: `task-design内の対象成果物反映待ち`
   - 未決事項へ依存せず、合意済み内容から一意に反映・validationできる: task-design内で任意に適用し、`task-design内で対象成果物へ適用済み`へ結果を記録する
   - 本番application coding、実行時に段階を踏む作業、ユーザー指定の作業: `execution plan対象`
   - design.mdとdiscussion file自身のlifecycle更新、調査、技術検証実装は対象成果物変更として分類せず、execution planへ載せない
6. 一つのdecisionまたは事実を反映・分類するたびに、`design.md`全体から残る不確実性と完了条件を再評価する。残る場合はStep 3を繰り返し、なければStep 4へ進む。

#### 技術検証実装の配置・運用

- 配置: design.md と同階層に `spike/` ディレクトリを作る
  - **命名意図（spike）**: Agile 用語で「実装前に不確実性を解消するための時間制限付きの調査・試行錯誤」を指す。`dry-run/` は「副作用なく実行する」という How（手段）の名前で、技術検証という What（概念）を表していない（dry-run は技術検証の手段の 1 つにすぎず、本番 DB に読み取りでアクセスする検証など、副作用なしを目的としない検証も技術検証の範疇に入るため）。`verify/` は「正しさを確認する」ニュアンスが強く、不確実性を試行錯誤で潰すという技術検証の本質と一致しない。`spike/` はこの「試行錯誤して不確実性を潰す」という性格を表す
- 独立できる場合（プロダクトの API レスポンスを使うだけなど疎結合）: そのディレクトリに package.json / node_modules を持ち、独立した形で実行する
- プロダクトのモジュールを使い回す場合: 動かせる形に必要な調整をする
- **実行環境:** `maintenance-plugin-context`が返した技術検証用command・環境だけを使う。返されない時はhost実行・container実行のどちらも推測しない
- **成果物管理:** repository contextが出力先・ignore方針を返した時だけ従う。返されない時は、検証成果物の保存・commit可否を明示してから進める

#### discussionを選んだ場合の境界

議論開始後の状態、提案、却下理由、決定をtask-design独自の形式やsession memoryだけで管理しない。task-design agent自身が`facilitate-discussion`を適用し、そのfile更新契約に従う。

- task-designが行う: §4の設計contextを渡す。一つの論点ごとに返されたdecisionを直ちに`design.md`へ反映し、次の論点より先に残る不確実性を再評価する。
- task-designが行わない: 論点採番、親子関係、提案番号、iteration、feedback routing、合意確認を独自に組み立てる。
- `facilitate-discussion`が行う: discussion scopeと対象論点を判定し、完全な現在案、feedback、検証、routing、決定をdiscussion fileへ保存して合意を進める。

### skill / docs 改善が必要になったとき

discussion中に「この気づきはskillへ書くべき」「このruleはdocsへ置くべき」と判明することがある。contextが熱いうちに永続化できるよう候補と関連contextを`facilitate-discussion`へ渡し、返されたdecisionだけを扱う。認識齟齬では、具体ケースの修正案より先に原因ownerを分類し、docsまたはskillの不備なら一般則を主decisionとして扱う内部processも`facilitate-discussion`を正本とする。

decisionの`design.md`への記録は直ちに行うが、対象skill／docsへの適用時期はStep 3のroutingで別に判定する。

- 他の未決事項へ依存しなければ、次の論点へ進む前に適用・validationしてよい。
- 他の未決事項によって内容が変わる、または複数file contractを一括で整合させる必要があれば、`task-design内の対象成果物反映待ち`へ置く。小手先のpatchを重ねない。
- 実際に即時適用した場合は、`facilitate-discussion`が返すcontractに従い、同じoriginating decisionについて`doc-enricher`を提案modeで一度だけreviewする。原因分類時に起動済みなら重複しない。

**禁止（3-5 違反）:**
- 合意なしの本体編集（「指摘されたから直す」を即実行）
- 「簡易合意」の名目で議論を省略
- `即時反映`自体を目的にし、未決decisionへ依存する変更を先にpatchする

### Step 4. design合意判定

以下が揃ったらdesign phaseを完了し、Step 5へ進む。task-design全体はまだ完了しない:
- 保存・提示前に「要議論」項目をchatで解消し、各要件を`MUST | SHOULD | MAY | 非目標`のいずれかへ確定している。未確定の提案を分類済み要件として保存していない
- 全 TBD が解消されている
- 新たな論点が生まれない（収束している）
- `design.md`付録の`分類保留`がzeroで、sectionごと削除されている
- `task-design内の対象成果物反映待ち`がzeroで、`なし`と記録されている
- 2-4 自己チェック「設計外の判断が残っていないか」が No
- 2-2 ネガティブ定義3つ全てに該当しない
- **読み手セルフレビュー**: 「後続のplan taskまたはtask-design内で適用した変更を見たとき、その根拠（なぜそのパターン・なぜその変更か）を design.md 内で完結して辿れるか」を確認する
    - やってしまいがちな失敗: 「論点が全て解消 = 設計完了」と判定。tasklist 化フェーズで初めて「なぜこの変更か」が design.md から辿れないことが露呈する
    - 判断基準: design.md の修正パターン（一般則）と変更点一覧（結論）の間に、「個別の変更箇所が分類のどこに該当し、なぜそのパターンを選んだか」のレイヤがあるか

designの要点をchatで短く示し、自然言語でreviewを依頼する。`OK`、`はい`、`進めて`等の自然な合意を受け取ればStep 5へ進み、修正ならdesignを更新して再reviewする。特定の承認keywordを強制しない。

D11により、生の議論log、iterationごとの旧案、未決提案を`design.md`へ複製する旧`事前設計議論メモ`章は作らない。議論の変遷は`task-design-discussion.md`を正本とする。ただし、未来の実装者がdesignだけから「なぜこの設計を選んだか」を遡れるよう、最終設計の理解に必要な代替案と棄却理由は`design.md`へ残す。discussionへのlinkだけで決定理由を省略しない。

**設計記述の主語の選び方:**
- 修正の入口（ユーザー操作の起点・変更の起点）を主語にする
    - 例: 修正対象が API エンドポイントなら、design.md の節立てもエンドポイントを主語にする
    - 例: 修正対象が CLI コマンドなら、コマンドを主語にする
- やってしまいがちな失敗: コードベース都合の分類（モデル分類・レイヤ分類など）を主語にする → 修正の入口から外れた説明になり、読み手が「なぜこのモデルがいきなり出てくるのか」を追えなくなる
- 個別モデル・個別レイヤの事情は、それを扱う「入口」の節内で語る形にする

**design.md 完成設計書チェック（2 段階）:**

design.md は「議論の入力ではなく議論の結果を記録する場所」である。設計完了時に 2 段階で議論色ゼロを確認する。

- **Stage 1（grep）**: `grep -n "TBD\|論点\|案 [a-c]\|採用理由\|（決定）"` を実行し、マッチゼロを確認する
  - grep は単語レベルのチェックなので必要条件。十分条件ではない
- **Stage 2（目視通読）**: design.md を「初めて読む設計者」として最初から最後まで通読し、以下を確認する
  - 議論色（「採用しない」「案 b 却下」「理由は」「（決定: なし）」等）が残っていないか
  - 例示・シナリオの前提が他セクションの設計と矛盾していないか
  - 必要な最終理由が、関係するWHATと区別されたうえで、そのWHATの後の最小scopeへ一度だけ置かれているか。固定理由章への集約や、実在しない代替案の穴埋めへ戻っていないか

Stage 2 を省略すると「grep で 0 件だから完了」となり、grep パターンで拾えない議論残骸（見出し内の括弧書き・「〇〇しない」という文体・前提矛盾の例示など）が残る。

### Step 5. execution plan対象を検証し、必要な場合だけplanを設計する

ここはtasklist掲載可否を初めて判断するgateではない。Step 3でdecisionごとに分類した`design.md`付録を集計し、分類漏れ、即時適用済み変更との重複、掲載条件違反がないことを最終検証する。

execution plan対象へ載せるのは次のいずれかに該当する作業だけである。

1. 対象repositoryで本番成果物として利用者へ届けるapplication、service、library、CLI、batch、infrastructure component等のruntime behaviorを変更し、testで正しさを確認する通常のapplication coding。本番成果物の変更に伴うtest code、schema、dependency、build設定、runtime設定は同じ実装scopeに含む
2. 本番application coding以外でも、順序依存する複数段階、中間checkpoint、外部調整、rollback境界、独立した検証単位が必要で、一つの連続した反映・validationでは安全に完了できない作業
3. ユーザーがtasklistまたはroadmapへの掲載を明示した作業

file数、調査量、discussion回数、実行可能な言語で書かれていることだけを掲載理由にしない。skill、prompt、documentation、template、規範等のcontentと、それらを検査・生成・整形するrepository validator、generator、formatter等の補助tool codeは、今回の本番成果物でない限り第一条件に含めない。合意済み内容から一意に変更でき、他の未決事項へ依存せず、一つの連続した反映・validationで完了できるならtask-design内で扱う。補助tool自体が今回利用者へ届ける本番productなら、名前やpathでは除外せず第一条件へ戻す。

test codeは単独の自動掲載条件ではなく、本番application codingの正しさを確認するacceptanceとして扱う。testだけの変更や補助toolのself-testは、段階実行またはユーザー指定に該当するかで判定する。調査と技術検証実装はdesign phaseの不確実性解消手段であり、execution plan対象へ載せない。対象一覧は`対象`、`掲載理由`、`参照するdesign section`だけを持つ索引であり、対象ごとの完成後の姿や実行手順を複製しない。

対象がzeroなら`tasklist.md`と`roadmap.md`を作らずStep 6へ進む。対象が一件以上ある場合だけ、以下のleaf / composite判定を行う。

合意済みdesignを、一つの実装loopで完了できるleafか、複数の独立した子design loopへ分けるcompositeか、意味で判定する。

- **leaf**: 一つのtasklistで、scope全体を着手可能なtask、検証、ユーザー確認まで落とせる。task数やfile数が多いだけではcompositeにしない
- **composite**: 二つ以上の相互に区別できる子scopeが必要で、各子が親より厳密に狭く、子全体で親DoDを満たす。依存はDAGにできる
- 一つだけの子scope、親と同一scopeの子、工程数が多いだけの分割はroadmapにしない

判定後は対応する一方だけを扱う。

1. leafなら`tasklist-design.md`、compositeなら`roadmap-design.md`を先頭から末尾まで完全に読む。
2. 同じ`working_dir`に反対側のplanがないことを確認する。既にあれば上書き・併存せず、designまたはplan種別の再合意へ戻る。
3. 対応templateからplanを作り、分割fileのgateに従って自己レビューする。
4. planの要点をユーザーへ示し、自然言語で合意を得る。
5. feedbackを、planだけの変更かdesignへ戻る変更か分類する。完成後の姿、設計根拠、公開API、module境界、要件が変わるならStep 3へ戻る。task順、task粒度、検証手順はtasklist planを更新する。roadmapのphase identity、目的、scope、scope外、DoD、依存、親DoD coverageが変わる場合はroadmap planの構造設計へ戻り、その変更が親designへ影響するか判定する。親designへ影響する場合だけStep 3へ戻る。roadmap運用fieldだけならsteeringのruntime更新へ返す。
6. designへ戻った場合は、再合意後に同じplan種別を再生成するかleaf / compositeを再判定する。

### Step 6. task-design完了判定と返却

三resultに共通して、次をすべて満たすまでtask-designは完了しない。

- designが合意済み
- designとdiscussionに未解消TBDまたは未確定decisionがない
- `design.md`付録に`分類保留`sectionがなく、`task-design内の対象成果物反映待ち`が`なし`である
- task-design内で対象成果物へ適用した変更にはvalidation結果と参照するdesign sectionがある

result固有の完了条件:

- `tasklist_ready`: execution plan対象が一件以上あり、`tasklist.md`だけが存在して合意済みである。plan reviewからdesignへ戻る未解消feedbackと、plan内のTBD、未解消feedback、実装者へ残した設計判断がない
- `roadmap_ready`: execution plan対象が一件以上あり、`roadmap.md`だけが存在して合意済みである。同じ未解消feedbackとTBDがなく、roadmapの構造fieldが確定している
- `planless_complete`: execution plan対象が`なし`で、`tasklist.md`と`roadmap.md`がどちらも存在しない。対象成果物への必要な適用とvalidationはtask-design内で完了している

返却形式:

```text
result=tasklist_ready
working_dir=<absolute>
design_path=<absolute>
tasklist_path=<absolute>
```

```text
result=roadmap_ready
working_dir=<absolute>
design_path=<absolute>
roadmap_path=<absolute>
```

```text
result=planless_complete
working_dir=<absolute>
design_path=<absolute>
```

task-designはplanを実行せず、roadmapの子path・status・完了日も更新しない。planless routeでtask-design内に適用するのは、合意済みdesignから一意に実行でき、本番application codingまたは段階実行を必要としない対象成果物変更だけである。補助tool codeはcodeであることだけではこのrouteから除外しない。

---

## 6. 絶対にやらないこと（NG集）

Sonnet がよく陥る穴埋めパターン。設計レビュー時に自分で走らせる。1つでも該当したら、対応する思想セクションに戻って合意し直す。

### A. 順序・スコープを誤る

- [ ] WHY を飛ばして HOW から書き始めた → 3-1
- [ ] 機能要件の議論をスキップして実装方針の提案を出した → 3-1
- [ ] deliverable の listing をタスクにした（「〇〇.md を整備する」「環境を構築する」）→ 2-3 / `outcome-sections/catalog.md`

### B. 完成後の姿が描けていない

- [ ] 完成後の姿が描けず、変更点だけ列挙した → 2-2 ネガ2 / 2-3
- [ ] データモデルをスキーマ定義だけで済ませた → 2-3 / `outcome-sections/data.md`
- [ ] callerが依存する命名を実装後回しにした → 2-3 / `outcome-sections/caller-contracts.md` / 2-2 ネガ1
- [ ] モジュール境界・ディレクトリ構成を実装中に決めた → 2-3 / `outcome-sections/code-structure.md`
- [ ] 総論だけ書いて「設計した」と思った → 3-2 / 3-3
- [ ] UI componentのinputを列挙したが、各inputの供給元が明示されていない → 2-3 / `outcome-sections/screen.md`
  - やってしまいがちな失敗: propsや引数の型だけを確定し、「どこで取得し、どの親から渡すか」を実装者へ残す
  - 正しい問い: 「このinputを実装者が見たとき、供給元と受け渡し経路を設計書だけから追えるか？」

### C. プロセスを誤る

- [ ] 「全セクション記入完了 = 設計完了」と判定した → 2-2 ネガ3
- [ ] TBD なしで一気に全埋めしてレビューに出した → 3-2
- [ ] 上位未合意のまま下位の問いを並列に投げた → 3-2 / 3-3
- [ ] 「方向性 ok」を「設計合意」と扱って実装に進んだ → 3-3
- [ ] 各論を詰めずに「だいたい合意取れた」で実装を始めた → 3-3

### D. 対話を省略した

- [ ] ユーザー発言を脊髄反射で文書に反映した → 3-5
- [ ] 「どうお考えですか?」と先に問い、自分の見解を後出しにした → 3-5
- [ ] 既存 steering やドキュメントの文章をそのまま貼って提案にした → 3-5
- [ ] 推測で埋めた成果物を「レビューお願いします」と承認待ちにした → 3-5
- [ ] 指摘を受けた瞬間に合意なしでスキル・テンプレートを修正した → 3-5

### E. 不確実性を埋めなかった

- [ ] 外部 API の挙動を推測で埋め、技術検証実装をスキップした → 3-4
- [ ] 技術検証実装のはずが本実装になり、設計に戻らなかった → 3-4

### F. 状態を頭で抱えた

- [ ] `design.md`の内容が変わる問いをユーザーへ出したが、その時点でdiscussion fileに対応するproposalが保存されておらず、論点・提案・却下理由がsessionだけに残った → 4 / 5 Step 3
- [ ] discussion内部processをtask-design側で組み立て直した → 4 / 5 Step 3
- [ ] task-design固有の設計contextを渡さず、discussionの判断材料まで新skillへ丸投げした → 4 / 5 Step 3

### G. 対象成果物変更のroutingを誤る

- [ ] decision確定ごとに分類せず、tasklist作成直前に初めて掲載可否を判断した → 5 Step 3 / Step 5
- [ ] 本番application coding、段階実行、ユーザー指定のいずれにも該当しない変更をexecution plan対象へ載せた → 5 Step 5
- [ ] 他の未決decisionへ依存する対象成果物を、即時反映自体を目的に先行patchした → 5 Step 3
- [ ] `分類保留`または`task-design内の対象成果物反映待ち`を残してdesignを完了した → 5 Step 4
- [ ] execution plan対象がzeroなのに空のtasklistまたはroadmapを作った → 5 Step 5 / Step 6

---

## 7. 起動・終了条件

### 起動条件

以下のいずれかに該当 → このスキルを起動:
- 機能追加・変更の要件が渡された
- 「どう実装すればいいか」を問われた
- 複数ファイル・レイヤーにまたがる変更が含まれる
- ドメイン命名・DB設計・API 設計が絡む
- 実装方針が決まっていない状態で「作って」と言われた
- docs、skill、prompt、規範、調査結果等について、完成後の姿または複数の設計判断を合意する必要がある

以下に該当 → スキル起動不要（軽度の修正）:
- typo 修正・コメント修正
- 既存ロジック変更を伴わないリファクタで影響範囲が小さいもの
- 1ファイル内で完結する小さな変更

判断に迷ったら起動側に倒す。設計完了まで進める方が、後の手戻りより安い。

### 終了条件

design phaseの判定基準はsection 5 Step 4、task-design全体の完了判定はStep 6を参照する。
designが合意され、`tasklist_ready | roadmap_ready | planless_complete`のいずれか一つの完了条件を満たした時点で終了する。

### このスキルの境界

このスキルは、plan routeではexecution plan合意、planless routeでは合意済み対象成果物の適用・validation完了で終わる。以下はplan routeでの対象外:

| 対象外 | 引き継ぎ先 |
|--------|------------|
| 実装 | 後続の実装ステップ |
| 実装後のレビュー | 別途 |
| roadmapの子steering binding・status更新 | steering スキル |

対応resultの完了条件を満たした時点でready resultを返す。不確実性、分類保留、反映待ちが残ったまま実装、orchestration、planless完了へ渡してはいけない。

---

## 8. このスキル自体の更新について

### 修正の種類と使うモデル

このスキルは Sonnet が日常運用する前提で書かれているが、スキル自体の更新は内容次第でモデルを使い分ける。

| 修正の種類 | 使うモデル | 例 |
|------------|-----------|-----|
| 細かな修正 | Sonnet | typo・表現微調整・既存節への事例追加 |
| 構造的修正 | **Opus 必須** | セクション追加・並び替え・新概念導入・節の分割統合 |
| 内容の抜本的修正 | **Opus 必須** | 思想項目の追加・既存節の書き直し・観点の増減・テンプレート構造変更 |

判断に迷ったら、task-design 自身で検討し、ユーザーとの対話で合意する。スキルは長く残るため、構造を歪めるリスクの方が往復コストより重い。

### Sonnet が更新するときに守ること

このスキル自体の更新は、このスキルの中身（特に section 3 思想）を自己適用して進める:

- **TBD 込みで全体を先に見せる（3-2）** — 全セクション一気書きはしない。骨格の合意を先に取る
- **上位の設計判断を優先する（3-3 / 5 Step 3）** — `design.md`全体で下位判断を最も多く規定する不確実性から解消する
- **転記禁止（3-5）** — steering や類似スキルの文章をそのまま貼らない。自分で咀嚼して提案する
- **抽象と具体の往復** — 思想・違反シグナル・帰結・問いの4点セットを崩さない。具体例で地を作る
- **discussionを直接管理しない（4 / 5 Step 3）** — task-design固有contextを渡した後の論点・iteration・合意は`facilitate-discussion`へ委ねる
- **合意なしに型を変えない（3-5）** — 「指摘されたから直す」を即実行しない。今のファイルで合意 → 型に反映

これらは全部このスキル本体に書かれている思想。スキル自体の更新でも例外なく適用される。

### 過去に観測された失敗パターン

このスキルを作る過程で観測された Sonnet の失敗:
- 既存 steering の文章を転記して「魂が抜けた薄い内容」になる
- 抽象だけ書いて「自分のケースに当たる」と気付けない総論レベルで止まる
- 具体例だけ追加して原則との接続が消える
- 1セクションを単独で詰めて、他セクションとの整合が崩れる

根本原因は **「穴埋めだけがミッションになり、考える地盤ができていない」状態**で動くこと。
342×638 の `?` に何でもいいから数字を入れるような状態で更新を始めると、上記が起きる。

更新の前に section 6 NG集 を自分に走らせる。1つでも該当したら、Opus に相談するか、対話を1段階戻す。

---
