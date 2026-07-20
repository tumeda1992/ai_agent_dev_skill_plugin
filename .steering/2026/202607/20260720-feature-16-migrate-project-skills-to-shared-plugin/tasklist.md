# タスクリスト

このtasklistは、`tumeda-dev` pluginを唯一のskill正本へ移すための実装計画である。`[ ]`の実行はこのsteeringの範囲外とする。各タスク完了時に、その場で`[x]`へ更新する。

## フェーズ1: repository context基盤を使えるようにする

### DoD

Git repositoryでrepository固有文脈が必要なskillを起動すると、`maintenance-plugin-context`がplugin templateからinstanceを安全に作成・解決し、consumerは許可された範囲だけを読める。

- [x] pluginにcontext templateを配置する
  - [x] `skills/tumeda-dev-plugin-context.md`へ、H2 skill section、最後の`共通` H2、必要H3の記入欄だけを置く
  - [x] templateから運用手順、読取mapping、不在時fallback、repository固有値を除く
  - [x] 各skill H2の先頭に、実効文脈へ含める`共通`H3だけのinline linkを置く

- [x] `maintenance-plugin-context`をplugin skillとして実装する
  - [x] steering artifactの`maintenance-plugin-context/SKILL.md`を正本候補として移植する
  - [x] Git root探索、instance探索、`SKILL.md`の親の親にある`skills/tumeda-dev-plugin-context.md`だけをtemplate sourceとする規則を実装する
  - [x] 作成・最小更新・保存後再読込・既存記載の非破壊を実装する
  - [x] Git root、template、書込み権限、既存構造のいずれかが不足する時に`unavailable`を返し、cwdへの仮作成・独自形式生成・既存instance修復をしない規則を実装する
  - [x] consumer別の`共通`読取mappingと、`available` / `unavailable`返却形式を実装する

- [x] model profileをpluginへ配置する
  - [x] steering artifactの`runtime-model-profiles.md`を`skills/runtime-model-profiles.md`へ移植する
  - [x] `deep-design`と`standard-execution`のprofile、Claude selector、Codexの選択/親model継承fallback、release確認を保持する

- [x] x_favorites初期context instanceを作成する
  - [x] maintainerを使い、`.agents/skills/tumeda-dev-plugin-context.md`をtemplateから作成する
  - [x] `共通`へ`AGENTS.md`、確認済みarchitecture / development / testing文書、`docker compose exec app yarn test`、`docker compose exec app yarn lint`を記載する
  - [x] `steering`へGitHub `origin`と`feature-<issue番号>`のbranch / issue契約を記載する
  - [x] `visual-inspector`へ確認済みの`http://localhost:3000`、現存するbrowser設定・出力先だけを記載する
  - [x] `18100`、不存在helper / result template、`docker compose exec frontend npm test`がinstanceに入らないことを確認する

- [x] context基盤を検証する
  - [x] Git root配下でinstanceがないcase、既存instanceがあるcase、構造を読めないinstance、書込み不能caseを確認する
  - [x] consumerごとに返されるH2/H3が許可mapping外を含まないことを確認する
  - [x] templateとcontext instanceにsession議論・TBD・task状態が入らないことを確認する

## フェーズ2: 共有planning skillをplugin正本へ移す

### DoD

利用者が別repositoryで`think-through`、`design-consult`、`doc-enricher`、`task-design`、`steering`を起動すると、x_favorites固有参照なしで一般手順を実行し、必要時だけmaintainer経由でrepository文脈を使える。

- [x] `think-through`を移植・一般化する
  - [x] 常時適用する思考作法だけをplugin skillへ移す
  - [x] repository固有文脈が必要な場合だけmaintainerへ委譲する呼出条件を追加する

- [x] `design-consult`を移植・profile化する
  - [x] Opus固定の本文説明を`deep-design` profile参照へ置換する
  - [x] Claude Codeでは`model: opus`と`context: fork`、Codexではprofileを読んだparent→child契約を実装する
  - [x] childへ相談の問い、参照文脈、出力形式を渡し、返却分析を親が統合する規則を実装する

- [x] `doc-enricher`を移植・一般化する
  - [x] MealFrame / resolverなどの例を、module・責務境界・README候補の一般例へ置換する
  - [x] repository固有の文書配置・編集制約が必要な時だけmaintainerへ委譲する

- [x] `task-design`と成果物templateを移植・一般化する
  - [x] 固定docs path、X/Notion例、固定spike commandを一般例またはcontext返却値へ置換する
  - [x] template参照をplugin内のskill相対pathへ置換する
  - [x] repository規約・技術検証制約が必要な時だけmaintainerへ委譲する

- [x] `steering`、template、GitHub adapterを移植・一般化する
  - [x] 固定project path、旧template path、固定GitHub script自己レビューを除去する
  - [x] `### GitHub`の有無をmaintainer経由で読み、外部公開actionを生成する唯一の判断者として実装する
  - [x] GitHubなしではユーザー動作確認とsummary更新だけ、GitHubありではユーザー動作確認後にpreflight、commit、current branch push、plugin内adapterによる既存PR取得またはPR作成をtasklistへ生成する
  - [x] preflight / adapter失敗時は外部公開actionを未完にし、GitHub以外のCLIやmanual fallbackを推測しない規則を実装する
  - [x] `scripts/github/`を`skills/steering/scripts/github/`へ移植し、default base branch・existing PR・任意branchを扱えるadapterへ一般化する
  - [x] x_favorites固有のbranch / issue規約はcontextの`Branch / issue 契約`がある時だけadapter入力へ反映する

- [ ] planning skillを検証する
  - [x] 移植した5 skill、template、adapterにx_favorites固有の業務例・固定path・固定commandが残らないことを検索する
  - [ ] GitHubあり/なしのcontextを使い、生成tasklistの完了後actionが設計どおり分岐することを確認する
  - [ ] GitHubありのtasklistでユーザー動作確認がpreflight / commitより前にあり、GitHubなしにはcommit・push・PR taskがないことを確認する

## フェーズ3: subagent由来skillを実行グラフとして移す

### DoD

tasklist実行でUI確認またはtest分析が必要になると、`tasklist-executor`が必要なchildを起動して待機し、childの結果がDoD未達ならtaskを完了にしない。

- [x] `visual-inspector`をplugin skillへ移植する
  - [x] `standard-execution` profile、Claude Codeの`model: sonnet` / `context: fork`、Codexのparent→child prompt契約を実装する
  - [x] UI URL、認証、browser準備、result保存先をcontext返却値から受け取るよう一般化する
  - [x] `result.md`と検査summaryを親へ返す形式を実装する

- [x] `test-runner`をplugin skillへ移植する
  - [x] `standard-execution` profileとhost別child起動契約を実装する
  - [x] test command・前提・report形式をcontext返却値から受け取るよう一般化する
  - [x] 実行結果、失敗分析、推奨修正を親へ返す形式を実装する

- [x] `tasklist-executor`をplugin skillへ移植する
  - [x] `standard-execution` profileとhost別child起動契約を実装する
  - [x] UI task時は`visual-inspector`、test実行・失敗分析時は`test-runner`を直近parentとして起動し待機する規則を実装する
  - [x] executorだけがtasklist転記、DoD判定、`[x]`更新を行い、child失敗時は未完のまま修正・再実行・報告へ戻す規則を実装する

- [ ] nested delegationをhost別にsmoke testする
  - [ ] Claude Codeで`context: fork`と`$ARGUMENTS`に、task入力・context path・成果物path・DoD・返却summaryが渡ることを確認する
  - [ ] Codexで直近parentが同じ入力をchildへ渡し、childも必要ならparentになれることを確認する
  - [ ] visual / test childの異常返却時にexecutorがtasklistを`[x]`にしないことを確認する

## フェーズ4: plugin packageとx_favoritesのhost経路を切り替える

### DoD

Claude CodeとCodexの新規sessionで9 skillがpluginから発見・起動し、x_favoritesに旧shared skill / agentの実行経路が残らない。

- [x] plugin packageを9 skill構成へ確定する
  - [x] `skills/hello/`をdirectoryごと削除する
  - [x] 8移行skillと`maintenance-plugin-context`だけが`skills/`配下のskill directoryとして存在することを確認する
  - [x] `.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`内`tumeda-dev`、`.codex-plugin/plugin.json`のbase release versionを`1.0.0`へ揃える
  - [x] plugin validatorと静的検査でmanifest、frontmatter、template参照、skill数を検証する

- [ ] Codexの更新経路を検証する
  - [x] plugin cachebusterを更新し、Codex manifestだけが`1.0.0+codex.<timestamp>`の派生versionになることを確認する
  - [x] `x-favorite-plugins` marketplace経由で`tumeda-dev`を再installする
  - [ ] 新規threadで9 skill、context maintainer、profile参照、nested delegationをsmoke testする

- [ ] Claude Codeの更新経路を検証する
  - [x] marketplace plugin version更新後にpluginをreload / reinstallする
  - [ ] 新sessionで9 skill、`model` / `context: fork`、context maintainer、nested delegationをsmoke testする

- [x] x_favoritesのhost設定をplugin正本へ切り替える
  - [x] `AGENTS.md`を`tumeda-dev:think-through`の常時適用案内へ更新する
  - [x] Claude Code hookを短い思考作法だけにし、削除するlocal SKILL pathを参照しないよう更新する
  - [x] `.claude/settings.json`のskill permissionと旧GitHub script permissionをinventoryし、plugin名で解決する設定へ置換または削除する
  - [x] browser設定をinventoryし、旧agent固有設定を残さない

- [x] 旧定義を退役する
  - [x] Claude Code / Codex双方のsmoke testとhost設定inventory完了を確認してから、`.claude/skills` symlinkを削除または置換する
  - [x] `.claude/agents/{visual-inspector,tasklist-executor,test-runner}.md`を削除する
  - [x] `.agents/skills/`から共有skill本文とtemplateを削除し、`tumeda-dev-plugin-context.md`だけを残す
  - [x] project設定・hook・permission・文書を検索し、旧path・旧agent名・旧GitHub script permissionが残らないことを確認する

## フェーズ5: 移行全体を検証する

### DoD

利用者がx_favoritesと別repositoryのどちらでも、pluginを唯一の正本としてskillを安全に使え、旧x_favorites固有例・経路・cacheに依存しない。

- [x] plugin構造とskill内容を検証する
  - [x] 9 skill、context template、runtime model profile、skill内template、GitHub adapterの一覧と参照先を検証する
  - [x] x_favorites固有ドメイン、固定path、固定commandがshared skill本文に残らないことを検索する
  - [x] `hello`が存在しないことを確認する

- [ ] repository contextとGitHub分岐を検証する
  - [x] x_favorites context instanceの各factを正本文書・compose設定・remoteと照合する
  - [ ] contextなし・contextあり・`unavailable`の各caseでconsumerが安全に縮退または必要入力要求をすることを確認する
  - [ ] GitHubあり・なし、preflight失敗、adapter失敗の各caseでtasklistの完了後actionと未完報告が設計どおりであることを確認する

- [ ] host runtimeと退役を最終検証する
  - [ ] Claude Code / Codex双方でthink-through常時作法、9 skill、profileのhost adapter、nested delegationを確認する
  - [ ] Codexでchild model選択面がある時はprofile相当model、ない時は親model継承になることを確認する
  - [ ] plugin再install後の新規thread / 新sessionで旧local定義に依存しないことを確認する

---

## 動作確認

### DoD

ユーザーがx_favoritesでplugin起動、repository context利用、代表的なsubagent実行を確認し、移行後の挙動を了承する。

- [ ] ユーザーに動作確認を依頼する
- [ ] フィードバックがあれば`implementation_review.md`を作成して原文を収集し、認識合わせ・設計・追加taskの順で扱う
- [ ] フィードバックがない場合は、`~~フィードバック収集~~（フィードバックなし）`として完了する

---

## 完了後のaction

> 動作確認が完了するまでcommit・push・PR作成を実行しない。

### GitHubあり（x_favorites）

- [ ] GitHub接続・認証・current branch・working treeのpreflightを行う
- [ ] 変更を意味単位でcommitする
- [ ] current branchをGitHubへpushする
- [ ] plugin内`skills/steering/scripts/github/` adapterで既存PRを取得するか、新規PRを作成する
- [ ] preflightまたはadapterが失敗した時は、上記外部公開actionを未完のまま失敗内容と必要な利用者操作を報告する
- [ ] `.steering/2026/202607/summary.md`の本steeringエントリを完了へ更新する

### GitHubなしのrepositoryでこのtasklistを使う場合

- [ ] `commit`、`push`、`PR作成`のtaskを生成・実行しない
- [ ] ユーザー動作確認後にsummaryを更新して完了する
