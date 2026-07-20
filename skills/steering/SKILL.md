---
name: steering
description: >
  大きめの変更をspec-drivenなdesignとtasklistへ落とすplanning skill。
  design合意、tasklist合意、記録の振り返りまでで終了し、明示的な実行依頼があるまで実装しない。
model: sonnet
---

# Steering

## ゴールと境界

repository内のsteering directoryにdesignとtasklistを作り、各論まで合意された実行計画を渡す。これは実装skillではない。tasklistの合意だけでコード変更、test実行、commit、push、PR作成を始めない。

repository固有の文脈が必要な時、`maintenance-plugin-context`にconsumer=`steering`、理由、必要section、確認元候補を渡す。通常は`共通`の許可項目と、必要時の`steering/GitHub`、`steering/Branch / issue 契約`を求める。`available`で返った範囲だけを使う。contextがない場合にGitHub、branch規約、command、固定pathを推測しない。

## 成果物とtemplate

Git rootで作業できる時、`<git-root>/.steering/<YYYY>/<YYYYMM>/<YYYYMMDD>-<branch>-<slug>/`を作る。branchは現在branch、得られなければ`unknown-branch`。slugは依頼を英語の短いkebab-caseにしたものを最初に提案して固定する。

templateはこのskill directoryから相対参照する。

- `templates/summary_entry.md`
- `templates/discussion_entry.md`
- `templates/roadmap.md`
- `templates/tasklist.md`
- `templates/implementation_review.md`

`design.md`と`task-design-discussion.md`は`task-design`が管理する。`discussion.md`はdesign後に生まれた議論、`implementation_review.md`は実装後の利用者feedbackを扱う。混ぜない。

## discussionの記録

論点・質問・要議論が出た時点で`discussion.md`へ記録する。AIが自発的に深めた議論も、複数往復になる前に記録する。結論だけでなく、事象、原因、提案、反復、決定、次の行動を残す。

- 一つの論点は一つの決定だけを扱う。
- タイトルは表面の質問でなく、その質問を生んだ設計上の問題にする。
- 利用者feedbackを受けたら、次案の前に現案と弱点を反復として残す。
- `ok`は各論までの確定版への合意であり、途中feedbackとは区別する。

## フロー

### 1. root、文脈、調査範囲を確定する

Git rootを確認する。作れない場合、repositoryへのartifact作成を偽装せず、必要なrootを求める。contextから許可されたproject instruction、architecture、development/test規約、全体commandだけを読む。さらに依頼に関係する既存実装、既存test、既存文書を読む。

UI挙動が設計の根拠になる時は、`visual-inspector`の結果を使う。コード推測やbrowser toolの直接実行を根拠にしない。

### 2. task-designへ委譲する

`working_dir=<steering directory>`、依頼内容、許可されたcontextを渡す。task-designがdesign.mdを作り、TBDと設計上の論点を解消するまで待つ。design.mdが存在し、設計外の判断が残らないと確認してからreviewへ進む。

### 3. designを合意する

利用者へ完成後の姿、設計選択、残るリスクを短く示してreviewを求める。方向性だけの同意で先へ進まない。修正feedbackはdiscussionに記録し、designへ反映して再reviewする。

要件が長く、単独reviewの方が良い時だけrequirementsを別fileへ切り出す。

### 4. tasklistを作る

design合意後、templateからtasklistを作る。調査結果で実装方針が変わるなら、先に`investigation.md`の調査方針と結果を合意する。複数の独立MVPに分かれる時だけroadmapを使い、子steeringを分ける。フェーズが多いだけでroadmapにしない。

通常tasklistでは以下を守る。

- phaseはlayer別ではなく、独立して完結・検証できる利用者操作で分ける。
- DoDは一つの操作または一つの明確な状態で検証できる形にする。複数操作が混ざれば分割する。
- 挙動変更のphaseには、その挙動を担保するtest作成/変更と実行を含める。既存testを通すだけでは足りない。
- UI表示に影響するphaseには、そのphase内のvisual-inspector taskと目視のDoDを含める。
- repository contextが返した全体test/lint commandがある時だけ、品質確認taskへ使う。なければcommandを作らない。
- migrationは独立phaseにし、適用後に利用者確認で停止する。
- 不確実なものはTBDと調査/判断方法を明記する。

### 5. tasklistを自己reviewして合意する

提示前に、すべてのphaseについてDoDの粒度、test、UI確認、依存順序、未解消TBD、利用者動作確認を確認する。抽象的な「整備する」「作る」DoDは、完成後に何が確認できるかへ書き直す。

tasklistのreviewでは、phaseと主要task、特に利用者確認より前に公開操作をしないことを示す。利用者が各論まで了承するまで実行へ進まない。

### 6. 合意後の振り返り

tasklist合意後、実装前に`doc-enricher`を提案モードで使う。承認されたものだけを適用する。discussionを読み、次回同じ議論を減らす知識がどこに残るべきかを検討する。skill/template/docsの改善は、必要なら今の合意を経て反映する。不要なら変更しない。

ここまで終えてから、利用者がtasklist実行を明示した時だけ`tasklist-executor`へ渡す。

## GitHubがある時だけの完了後action

`maintenance-plugin-context`から`steering/GitHub`が`available`で返った場合に限り、tasklist末尾へ以下を生成する。

1. 利用者の動作確認とfeedback収集。
2. GitHub接続、認証、current branch、working treeのpreflight。
3. 意味単位のcommit。
4. current branchのpush。
5. `scripts/github/create_or_get_pr.sh`による既存PR取得またはPR作成。
6. summaryの完了更新。

preflightまたはadapterが失敗したら、公開actionを未完のままにして、失敗内容と必要な利用者操作を報告する。他のhosting service、CLI、手作業URLを推測してfallbackしない。

adapterは引数なしでcurrent branch、repository default branch、既存open PRを解決する。adapter自身がcontext instanceの`Branch / issue 契約`を読み、そこに`feature-<issue番号>`が明示され、current branchも一致する時だけIssue titleと`Closes #<issue番号>`を作る。契約がない、またはbranchが一致しない時はissue番号を推測せず、branch由来titleを使う。`--base`、`--head`、`--title`、`--body`は例外的なoverrideであり、通常tasklistに必須入力として生成しない。

`GitHub` sectionが無い、または`unavailable`なら、tasklistには利用者動作確認とsummary更新だけを置く。commit、push、PR作成は生成しない。

## 実装後feedback

利用者が実装後に漏れを報告した時は、`implementation_review.md`に原文を先に残す。次に論点単位で認識を合わせ、完成後の操作フローを設計し、合意後に既存tasklistへ追加する。すでに修正済みでも、原因と設計判断を省略しない。
