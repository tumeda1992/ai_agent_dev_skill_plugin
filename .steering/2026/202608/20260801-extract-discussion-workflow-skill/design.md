# 議論 workflow skill 抽出 設計

## 目的

`task-design` と `steering` に重複している議論 workflow を再利用可能な独立 skill に切り出し、議論の記録・追跡・合意反映に一貫した契約を与える。

## 完了条件

- [x] 新 skill の名前と起動条件が合意されている
- [x] 新 skill と consumer の責務境界が合意されている
- [x] 議論場所の directory、任意 file 名、default file 名、既存 file への追記、論点連番の契約が合意されている
- [x] 親子論点と feedback 原文保持による追跡方法が合意されている
- [x] `task-design` と `steering` の移行後 workflow と成果物名が合意されている
- [x] 新 skill の resource 構成、`agents/openai.yaml`、verification、plugin version bump の方針が合意されている
- [x] 実装者が追加の設計判断をせず、対象 skill 本体・templates・verification・manifest を更新できる粒度になっている

## 決定事項

### D1. 新 skill の責務

新 skill 名は `facilitate-discussion` とする。

`facilitate-discussion` は論点の開始、提案、検証、再診断、決定までの議論 process と、その変遷をdiscussion fileへ永続化する形式を所有する。特定consumerの成果物や後続workflowは所有しない。

consumer は、議論の起動条件、議論へ渡す文脈、決定後の適用先と適用方法を所有する。適用先は `design.md` や `tasklist.md` に限定せず、consumerごとに決める。

### D2. feedback と論点の追跡

独立した `フィードバック収集` sectionと`FB-N`は廃止する。review起点の最上位論点では、ユーザーの言葉を `起点となった原文` にそのまま保持する。

1件のfeedbackから複数の決定が生じる場合は、原文を持ち、分解自体に実質的な決定を持つ親論点を作る。子論点は同じfile内の親論点を一つだけ参照し、各leaf論点は一つの決定だけを扱う。複数feedbackが一つの決定へ収束する場合は、一つの論点内に複数の原文を保持する。

### D3. consumer との連携

- `task-design` は `task-design-discussion.md` を指定して `facilitate-discussion` を適用し、決定を自身の設計成果物へ反映する。
- `steering` の通常議論はdefaultの `discussion.md` を使い、決定を該当する後続成果物やworkflowへ反映する。
- 実装後レビューは `implementation_review.md` を指定し、固定4部構成ではなく共通の論点形式で議論する。設計とタスク整理の順序が必要な場合はsteering側が制御し、review fileに空sectionを先置きしない。

### D4. 旧 template の扱い

次の旧pathは互換用に残さず削除し、`facilitate-discussion` のtemplateを唯一の正本にする。この変更は破壊的変更として扱う。

- `plugins/tumeda-dev/skills/task-design/templates/discussion_entry.md`
- `plugins/tumeda-dev/skills/steering/templates/discussion_entry.md`
- `plugins/tumeda-dev/skills/steering/templates/implementation_review.md`

### D5. `facilitate-discussion` は合意対象をself-containedに保存する

`facilitate-discussion` は、ユーザーへ合意を求める前に、現在採用を求める提案の全体と、今回判断してほしいことをdiscussion fileへ保存する。session内の説明、「上記」「これ」のような指示語、過去の提案との差分だけを前提にしない。

- `変更点`には前案との差分を書く。
- `提案N（現時点）`には、初見の読者が単独で評価できる現在案の全体を書く。
- 提案の一部だけを確認する場合は、`今回確認すること`に決定対象と影響範囲を書く。
- チャットではdiscussion file名、論点番号、提案番号または見出し、判断対象を具体的に示す。

### D6. `facilitate-discussion` はfeedback受領時に論点をroutingする

`facilitate-discussion` は、feedbackを同じ論点のiterationへ追加する前に、そのfeedbackが現在の論点と同じ決定を扱っているかを再確認する。

routingの前に、新規decision候補の結論が変わることで、現在のdiscussion目的または指定parentの決定・実装範囲が変わるかを確認する。変わらない事項はactiveな論点にせず、consumer内部の判断として残すか、別の明示依頼が必要なscope外候補としてchatで区別する。

- 同じ決定の原因・提案・検証を修正するfeedbackだけを、現在の論点のiterationにする。
- 現在の決定に依存する下位決定はchild論点にする。
- 共通の親に属する別の決定はsibling論点にする。`独立論点` は現在のdiscussion目的には属するが、同じfile内の他論点へ直接依存しないdecisionだけに使う。
- 複数の既存論点を規定する上位決定が後から判明した場合は、新しいparent論点を作って既存論点から参照してよい。親番号と子番号の大小は制約せず、循環参照を禁止する。
- 親論点は子論点の進行に応じて `子論点待ち` または `分解済み` とする。
- 既に作成した論点がscope外と判明した場合は履歴を削除せず、その論点内に取り下げ理由を保存して終了する。

### D7. skill起動時の入力と内部状態

`facilitate-discussion` のskill起動時に扱う明示設定は、`discussion_directory` と任意の `discussion_file_name` だけにする。

議論対象とconsumer固有の制約は、現在の会話またはcallerから渡された自然言語の文脈として受け取り、固定fieldを増やさない。`open` / `iterate` / `decide` / `reopen`、現在の `論点N`、`親論点`、`起点となった原文` は、skillが会話とdiscussion fileから判断・管理する内部状態とする。

skillの成果は、更新されたdiscussion fileと、チャット上で合意された決定・ネクストアクションとする。consumerが機械的にparseする固定result schemaは設けない。

### D8. 議論fileの解決

`facilitate-discussion` は、次の順序で議論の正本となるfileを一意に解決する。

1. `discussion_directory` がcallerから渡されていれば使用し、未指定なら議論開始前にユーザーへ具体的なdirectory pathを確認する。
2. 指定されたdirectoryが既存directoryであることを確認する。存在しない場合はskillが推測作成せず、ユーザーまたはconsumerへ用意を求める。
3. `discussion_file_name` がなければ `discussion.md`、指定されていれば指定basenameを変更せず使う。
4. file名に絶対path、`../`、path separatorを含む場合は拒否し、basenameの再指定を求める。
5. 対象fileが存在しなければ新規作成し、同名fileがあれば内容を保持して継続利用する。

### D9. discussion fileの履歴保持と現在状態

`facilitate-discussion` はdiscussion fileを物理的なappend-only logにはせず、過去の議論履歴を不変で保持しながら現在状態fieldだけを局所更新する。

- 新しい論点はfile末尾へ追加する。
- 同じdecision scopeへのfeedbackは、対象論点内へ新しいiterationとして追加する。既存iterationは変更・削除しない。
- `ステータス`、現在の `決定`、`ネクストアクション` は現在状態を示すfieldとして局所更新できる。
- 決定済み論点を再開・変更する場合は、以前の決定と変更理由を新しいiterationへ保存してから、現在状態を更新する。
- file全体の置換、既存論点の並べ替え、過去の提案・feedback・却下理由の削除、旧formatの一括整形は行わない。

### D10. 新規論点の採番

`facilitate-discussion` は、論点番号をdiscussion file内の単調増加する安定IDとして扱う。

1. 新規論点の書込み直前に対象fileを読み直す。
2. canonicalな `## 論点N:` とlegacy互換の `### 論点N:` の見出しから既存番号を収集する。
3. 既存論点がなければ `論点1`、存在すれば最大番号に1を足した番号を使う。
4. 欠番を再利用せず、既存論点をrenumberしない。
5. 新規論点はcanonicalなh2見出し `## 論点N: タイトル` でfile末尾へ追加する。
6. 書込み直前に変更を検出した場合は最大番号を再計算する。同じfileへの同時書込みはsingle writerを前提にする。
7. 既存fileに重複番号がある場合は、自動修復せず追加を停止してユーザーへ報告する。

### D11. 親子関係の正本

親子関係は、child entryの任意field `親論点` だけを正本にする。parent側に `子論点` fieldを保存せず、同じfile内で `親論点: 論点N` を検索してchild一覧を導出する。

- 一つの論点が持てる直接の親は最大一つとする。
- 親は同じdiscussion file内に存在する論点だけを指定できる。別fileの論点は本文からpathと論点番号で参照する。
- 親の保存・変更前に、存在確認、自己参照禁止、循環参照禁止を検証する。
- 親番号と子番号の大小関係は制約しない。後から上位決定が判明した場合は、新しいparentを作ってreparentできる。
- reparent前の親と変更理由は、新しいiterationへ保存する。
- parent自身にも分解内容の実質的な決定を残し、未決childがあれば `子論点待ち`、全childが決定済みなら `分解済み` とする。

### D12. canonicalなdiscussion fileとentry

新規discussion fileは `# 議論記録` を先頭に持つ。既存fileに別のh1がある場合は置換せず、新規論点だけを次のcanonical形式で追加する。

```markdown
## 論点N: タイトル

**ステータス:** （提案中 / 調査中 / 子論点待ち / 決定 / 保留 / 分解済み）

**親論点:** 論点M
<!-- top-level論点では省略 -->

**種別:** （TBDヒアリング / 認識齟齬 / レビュー指摘。複数可）

**起点となった原文:**
> （ユーザーの言葉を変更せず記録する）
<!-- review起点の最上位論点では必須。それ以外は必要時だけ記載 -->

**提起の背景:** （表面の質問ではなく、質問が生まれた設計上の問題を書く）

### 現在の合意対象

**参照する現在案:** （根本原因0 + 提案0 / イテレーションNの提案N）

**今回確認すること:** （決定対象と、決定によって変わる範囲を指示語なしで書く）

### 議論の変遷

#### 事象の記述
- （具体的に何が起きたか）

#### 原因の追跡
- なぜ: ...
- なぜ: ...
- なぜ: ...

#### 根本原因0 + 提案0
- **根本原因0**: ...
- **提案0（現時点）**:
  - 総論: ...
  - 各論:
    - ルール: ...
    - 適用例: ...

#### イテレーションN

##### 検証
- **観点**: ...
- **弱点**: ...

##### 論点routingの判断
- **同一decision scopeとしてiterationを継続する理由**: ...

##### 修正先の判断
- **提案level / 診断levelへの遡及**: ...

##### 根本原因N + 提案N
- **根本原因N**: ...
- **変更点**: （前案との差分）
- **提案N（現時点）**:
  - 総論: （差分ではなく現在案の全体を書く）
  - 各論:
    - ルール: ...
    - 適用例: ...

**決定:** （現在の決定。未決なら理由を書く）

**ネクストアクション:** （決定の適用先・適用方法。具体的な合意前は未決とする）
```

`現在の合意対象` は現在状態として局所更新できる。参照先の `提案N（現時点）` は同じentry内に完全な案として保存する。新しいfeedbackが同じdecision scopeでない場合はiterationを追加せず、新規のchild・sibling・parent・独立論点へroutingする。

### D13. 起動契約

`facilitate-discussion` はimplicit invocationを無効にし、次の場合だけ起動する。

1. ユーザーが `$facilitate-discussion` を明示する、または議論をMarkdownへ継続記録するよう明示的に依頼する。
2. `task-design`、`steering` などのconsumer skillが、保存を伴う議論workflowとして明示的に適用する。

`agents/openai.yaml` では `policy.allow_implicit_invocation: false` とする。frontmatter descriptionは構造化して永続化する議論と明示依頼・consumer委譲をtriggerとして記載し、通常の質問・説明・短い相談をtriggerに含めない。

直接起動で `discussion_directory` がなければユーザーへ確認する。consumer経由でdirectoryが渡されていれば聞き直さない。

### D14. skill resource構成

`facilitate-discussion` は次の最小構成にする。

```text
plugins/tumeda-dev/skills/facilitate-discussion/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── templates/
    └── discussion_entry.md
```

- `SKILL.md`: frontmatterは `name` と `description` だけにし、bodyへ保存先解決、routing、合意対象保存、履歴と現在状態、採番、親子validation、議論flowを書く。template全文は複製しない。
- `templates/discussion_entry.md`: D12のentry形式だけを持つ。新規fileのh1はskillの作成手順で追加する。
- `agents/openai.yaml`: 日本語のUI metadataと `policy.allow_implicit_invocation: false` を持つ。
- scripts、references、assets、README等は作らない。機械処理の必要性が実利用で判明した場合に別変更として検討する。

### D15. `task-design` consumer契約

`task-design` はworking_dir、議論開始判断、設計文脈、決定後のdesign反映、task-design固有の完了判定を所有する。議論を開始した後のprocessとfile管理は `facilitate-discussion` へ委譲する。

通常mode・軽量modeとも、task-design agent自身が次を渡して新skillを明示適用する。

```text
discussion_directory=<working_dir>
discussion_file_name=task-design-discussion.md
```

`facilitate-discussion` は `task-design-discussion.md` の作成・継続利用、entry作成、採番、親子validation、議論変遷、合意対象保存、feedback routing、現在状態更新を所有する。決定後はtask-designが `design.md` へ反映し、設計完了を判定する。

`task-design` から、旧 `templates/discussion_entry.md`、entry format全文、記録timing、feedback loop、「親子関係は作らない」という規則を削除する。議論だけを別child agentへ再委譲せず、task-design agent自身が新skillを適用する。

### D16. `steering` の通常discussion consumer契約

`steering` は通常discussionの起動判断、steering directoryと関連成果物の文脈、決定後のphase制御、steering固有の終了条件を所有する。議論開始後のprocessとfile管理は `facilitate-discussion` へ委譲する。

steering agent自身が次を渡して新skillを明示適用する。

```text
discussion_directory=<steering directory>
```

file名はdefaultの `discussion.md` を使う。task-design由来の `task-design-discussion.md` とは混ぜない。

`facilitate-discussion` は `discussion.md` の作成・継続利用、entry format、採番、親子validation、合意対象保存、feedback routing、現在状態更新を所有する。決定後はsteeringがdesign修正、tasklist修正、調査、文書改善review等の適切なphaseへ戻す。

`steering` から旧 `templates/discussion_entry.md`、entry format全文、feedback iteration、種別・原因追跡・提案formatの重複説明を削除する。通常discussionだけを別child agentへ再委譲しない。

### D17. implementation review consumer契約

実装完了後にユーザーが漏れ・追加要件・不具合を提示した場合、steering agent自身が次を渡して `facilitate-discussion` を明示適用する。

```text
discussion_directory=<steering directory>
discussion_file_name=implementation_review.md
```

`facilitate-discussion` は `implementation_review.md` の作成・継続利用、review起点の最上位論点への原文保存、親子routing、共通entry形式、採番、親子validation、合意対象保存、現在状態更新を所有する。

`steering` はreviewの起動判断、feedback原文と関連する実装・design・tasklistの文脈、決定後の適用先と順序を所有する。認識合わせだけで完了するか、既存designの変更またはtask-designへ戻るか、design合意後にtaskを追加するか、別の成果物へ反映するかを判断する。設計判断が必要な変更ではdesign合意前にtaskを作らず、review決定後も実装を自動開始しない。

旧4部構成、`FB-N`、旧 `templates/implementation_review.md` は廃止する。設計からtaskへ進む順序はreview fileの固定sectionではなく、steeringの決定後flowとして維持する。review fileは議論の正本だけを担い、設計やtaskを複製しない。決定後の `ネクストアクション` には具体的な適用先pathと処理を記録する。修正済みfeedbackも論点を省略せず、実装済みという状態を決定またはネクストアクションへ記録する。

### D18. verification契約

新skillのpackaging、repository内の参照移行、議論体験を別の検証層として扱い、静的検証と隔離した一時directoryでのbehavior smoke testを併用する。

- `quick_validate.py` で `facilitate-discussion/SKILL.md` の構造とfrontmatterを検証する。
- `scripts/verification/validate-plugin.mjs` を更新し、新skillとtemplateの存在、`agents/openai.yaml` の `policy.allow_implicit_invocation: false`、consumerの新skill参照、旧template三pathの不存在、配布versionの一致を検証する。
- repository全体を検索し、削除したtemplate path、旧4部構成、`FB-N`、consumer側に複製されたcanonical entry全文が現行定義に残っていないことを確認する。過去の `.steering/` 成果物は履歴として除外する。
- `plugins/tumeda-dev/skills/README.md` に新skillの一行索引を追加し、索引漏れを検出する。
- plugin sourceや既存steering成果物を書き換えない一時directoryで、次をbehavior smoke testする。
  1. directory指定・file名省略時の `discussion.md` 新規作成。
  2. custom file名かつ既存fileでの本文保持、最大番号+1、file末尾へのcanonical entry追加。
  3. 合意確認前に、sessionへ依存しない完全な現在案と判断対象がentry内に保存されること。
  4. 異なるdecision scopeのfeedbackを同じiterationへ混ぜず、親子・兄弟・独立のいずれかへroutingして理由を保存すること。
  5. 現在のdiscussion目的へ影響しない候補をactiveな論点にせず、scope外として区別すること。
- 最後に `node scripts/verification/validate-plugin.mjs`、version一致確認、`git diff --check`、変更差分の通読を行う。

verificationは新skillの振る舞いとconsumer接続に限定し、steering固有のfeature・MVP境界やtasklist内容の正しさは各consumerの既存検証へ残す。

### D19. `design-consult` consumer契約

`design-consult` は分析結果を返した後、現行どおりユーザーへdiscussion記録の要否を確認する。ユーザーが記録を承認した場合、discussion entryを直接書かず、会話と保存先を知る親agentが `facilitate-discussion` を明示適用する。

- callerから `discussion_directory` と任意の `discussion_file_name` が渡されていれば、そのconsumer契約を使う。
- 保存先が渡されていなければ新skillがdirectoryをユーザーへ確認し、file名はdefaultの `discussion.md` を使う。
- 記録の承認はfile作成・追記の承認であり、分析内の全提案への一括合意とは扱わない。分析から生じたdecision scopeごとにself-containedな現在案を作り、必要なら親子論点へ分けて個別に合意する。
- design-consultのchild subagentへdiscussion記録を再委譲しない。

`design-consult` の分析方法、subagent model、回答形式は変更しない。discussion fileを読むだけの `doc-enricher` も変更しない。

### D20. 実装対象と配布version

新規作成するpathは次のとおりとする。

- `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`
- `plugins/tumeda-dev/skills/facilitate-discussion/agents/openai.yaml`
- `plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md`

`agents/openai.yaml` は次のmetadataを持つ。

```yaml
interface:
  display_name: "Facilitate Discussion"
  short_description: "議論を構造化し、指定したMarkdownへ継続的に記録"
  default_prompt: "$facilitate-discussion を使って、議論を構造化し指定directoryのMarkdownへ継続記録してください。"
policy:
  allow_implicit_invocation: false
```

`skill-creator` は `short_description` に25〜64文字を要求する。初期案の「議論を構造化してMarkdownへ継続記録」は21文字で検証を通らないため、意味を変えずに上記の有効な文言へ具体化する。

更新するpathは次のとおりとする。

- `plugins/tumeda-dev/skills/task-design/SKILL.md`
- `plugins/tumeda-dev/skills/steering/SKILL.md`
- `plugins/tumeda-dev/skills/steering/templates/tasklist.md`
- `plugins/tumeda-dev/skills/design-consult/SKILL.md`
- `plugins/tumeda-dev/skills/README.md`
- `scripts/verification/validate-plugin.mjs`
- `plugins/tumeda-dev/.codex-plugin/plugin.json`
- `plugins/tumeda-dev/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

削除するpathはD4の三つだけとする。`.agents/plugins/marketplace.json` はversion宣言を持たず、source pathも変わらないため更新しない。root `README.md`、`doc-enricher`、`think-through`、既存 `.steering/` 履歴は変更しない。

旧template pathを互換用に残さない破壊的変更を含むため、`maintenance-plugin-context` のSemVer規約に従い、`tumeda-dev` を `2.0.0` から `3.0.0` へMAJOR bumpする。Codex manifest、Claude manifest、marketplace root、marketplaceの `tumeda-dev` entryの四宣言を `3.0.0` に揃え、validatorの期待releaseも同じ値へ更新する。

### D21. 新規論点作成前のdiscussion scope gate

`facilitate-discussion` は親子・兄弟・独立論点へのroutingより前に、新規decision候補が現在のdiscussion目的へ属するかを検証する。

- 判定質問は「このdecisionの結論が変わると、現在のdiscussion目的または指定parentの決定・実装範囲が変わるか」とする。
- 変わらない場合はactiveな論点を作らない。consumer内部の判断として維持するか、別の明示依頼が必要なscope外候補としてchatで区別する。
- `独立論点` は、現在のdiscussion目的には属するが他論点へ直接依存しないdecisionを表す。discussion目的自体と無関係な事項の受け皿にはしない。
- 既にscope外の論点を作成していた場合は、履歴を削除せず、その論点内に取り下げ理由を保存して終了する。
- templateには論点作成前のscope確認をinstruction commentとして持たせ、feedback iterationの `論点routingの判断` ではdiscussion scopeへ属する理由も確認できるようにする。

この規則は論点作成を所有する新skillだけに置き、`think-through` とconsumerへ重複させない。steeringのfeature・MVP境界などconsumer固有のscope定義自体は変更しない。

## 元の依頼内容

- `task-design` が `task-design-discussion.md` で行う議論と、`steering` が `implementation_review.md` で行う議論を、再利用可能な独立 skill に切り出し、consumer は新 skill を使う。
- `implementation_review.md` の独自4部構成は「3. 設計」「4. タスク整理」が空欄になりがちで効果が薄かったため、`task-design-discussion.md` の論点形式を基本形にする。
- 「1. フィードバック収集」は feedback と論点が1:1でない場合の追跡には役立つ可能性があるが、専用 section を設けず、論点の親子関係等で機能するか検討する。
- 新 skill は議論場所の directory を確認する。`discussion.md` を default file 名とし、指定 file 名があればその名前を使い、同名 file が既にあれば追記する。
- repository 内のドキュメント本文は日本語で記述し、コード、command、path、識別子、規定された出力形式、固有名詞は原文を維持する。
