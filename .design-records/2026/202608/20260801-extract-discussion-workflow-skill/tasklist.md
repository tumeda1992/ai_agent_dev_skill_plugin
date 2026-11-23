# タスクリスト

## 実行ルール

- 各タスクが完了した直後に対応する `[ ]` を `[x]` へ更新し、最後にまとめて更新しない。
- 全タスクが完了するまで実装・検証・修正を継続し、未完了taskを残して完了扱いにしない。
- repository内のドキュメント本文は日本語で記述し、code、command、path、識別子、規定された出力形式、固有名詞は原文を維持する。
- 既存 `.steering/` 成果物は履歴として変更しない。このtasklist自身のcheckbox更新と、同じsteering directoryの合意済み成果物に必要な現在状態更新だけを許可する。
- `plugins/tumeda-dev/skills/think-through/SKILL.md` と `plugins/tumeda-dev/skills/doc-enricher/SKILL.md` は変更しない。
- commit、push、PR作成、公開は今回の実装範囲に含めない。

## フェーズ1: `facilitate-discussion` を唯一のdiscussion process正本として追加する

### DoD

`plugins/tumeda-dev/skills/facilitate-discussion/` だけを読めば、明示された既存directoryと任意file名に対し、完全な合意対象を保存しながら論点を開始・更新・決定できる。default `discussion.md`、既存file継続、採番、履歴保持、feedback routing、親子validationの契約が一意に分かる。

### タスク

- [x] `skill-creator` の初期化手順で `facilitate-discussion` を作成する。
  - [x] `init_skill.py` で `plugins/tumeda-dev/skills/facilitate-discussion/` と `SKILL.md` を生成し、初期化scriptがdescription長検証で停止した後は `generate_openai_yaml.py` を使って `agents/openai.yaml` を生成する。
  - [x] `templates/` を追加し、scripts、references、assets、skill固有READMEは作らない。
  - [x] frontmatterは `name: facilitate-discussion` と日本語の `description` だけにする。
- [x] `SKILL.md` に明示起動とfile解決契約を書く。
  - [x] ユーザーの明示依頼またはconsumerの明示適用だけをtriggerとし、通常の質問・短い相談では起動しない。
  - [x] 明示設定を `discussion_directory` と任意のbasename `discussion_file_name` に限定し、議論内容は自然言語contextとして受け取る。
  - [x] `open`、`iterate`、`decide`、`reopen`、`topic_id`、`親論点`、`起点となった原文` はskillが会話とfileから判断する内部状態であり、skill起動時の入力fieldではないことを書く。
  - [x] directory未指定なら具体的pathを聞き、存在しないdirectoryは作らない。
  - [x] file名未指定なら `discussion.md` を使い、絶対path、`../`、path separatorを含む指定を拒否する。
  - [x] 同名fileがなければ作成し、あれば全内容を保持して継続利用する。
- [x] `SKILL.md` にdiscussion lifecycleを書く。
  - [x] 論点開始、事象、原因、完全な現在案、検証、合意確認、feedback再診断、決定、ネクストアクションの順序を書く。
  - [x] ユーザーへ合意を求める前に、sessionへ依存しない完全な現在案と具体的な判断対象を同じentryへ保存するMUSTを書く。
  - [x] chatではfile名、論点番号、提案番号または見出し、判断対象を具体的に示し、曖昧な指示語を使わないMUSTを書く。
  - [x] 新規論点作成前に、候補decisionが現在のdiscussion目的または指定parentの決定・実装範囲へ影響するかを検証するscope gateを書く。影響しない事項はactiveな論点にしない。
  - [x] feedback受領時はiteration追加前にdecision scopeを再確認し、同一decision、child、sibling、後発parent、独立論点へroutingするMUSTを書く。`独立論点` は同じdiscussion目的に属するdecisionだけに限定する。
  - [x] 作成済み論点がscope外と判明した場合は履歴を削除せず、その論点内に取り下げ理由を保存して終了する規則を書く。
  - [x] review起点の最上位論点では原文を保持し、独立ledgerと `FB-N` を作らない規則を書く。
  - [x] 成果を更新済みdiscussion fileとchat上の決定・ネクストアクションとし、consumer向け固定result schemaを設けない。
- [x] `SKILL.md` にfile更新と親子validationを書く。
  - [x] canonical h2とlegacy h3の論点見出しを走査し、最大番号+1を使い、欠番再利用・renumberを禁止する。重複番号があれば追加を停止してユーザーへ報告し、自動修復しない。
  - [x] 書込み直前の再読込、file末尾への新規論点追加、single writer前提を書く。
  - [x] 過去iterationを不変にし、現在の合意対象、status、決定、ネクストアクションだけを局所更新する規則を書く。既存fileのh1、論点順序、legacy formatを一括変更しない。
  - [x] 決定済み論点の再開・変更とreparentでは、旧決定または旧親と変更理由を新iterationへ保存する。
  - [x] child側の任意 `親論点` だけを正本とし、parent側に `子論点` fieldを保存しない。一親、同一file内の存在、自己参照禁止、循環禁止を検証する。
  - [x] parent自身に分解の実質的な決定を残し、未決childがあれば `子論点待ち`、全childが決定済みなら `分解済み` とする。
- [x] `templates/discussion_entry.md` をcanonical entryの唯一のtemplateとして作成する。
  - [x] canonical h2 entry、status、任意の親、種別、条件付き原文、背景、現在の合意対象、議論履歴、現在の決定とネクストアクションを表現する。新規fileのh1は `SKILL.md` のfile作成手順だけで管理し、entry templateへ含めない。
  - [x] `提案N（現時点）` は差分ではなく完全な現在案、`変更点` は前案との差分として分離する。
  - [x] iterationに `論点routingの判断` と同一decision scopeとして継続する理由を含める。
  - [x] 論点作成前のdiscussion scope確認をinstruction commentで示し、iterationのrouting観点ではdiscussion scopeへ属する理由も確認できるようにする。
- [x] `agents/openai.yaml` をdesign D20の具体値へ揃える。
  - [x] `display_name`、日本語の `short_description`、`$facilitate-discussion` を含む日本語の `default_prompt` を設定する。
  - [x] `policy.allow_implicit_invocation: false` を設定する。
- [x] 新skill単体の構造を検証する。
  - [x] `quick_validate.py` を `facilitate-discussion` に実行して成功を確認する。
    - test-runner result: `phase-1-quick-validate-1` / attempt 1 / `passed`
    - 証跡: `.steering/2026/202608/20260801-extract-discussion-workflow-skill/artifacts/phase-1-quick-validate/result.md`
  - [x] `SKILL.md` とtemplateを相互に読み、同じentry全文を二重管理していないことを確認する。

## フェーズ2: `task-design` を新skillのconsumerへ移行する

### DoD

通常modeと軽量modeのtask-designが、同じagentからworking directoryと `task-design-discussion.md` を渡して `facilitate-discussion` を適用し、決定後だけ `design.md` を更新する。task-design内に別のentry形式・feedback loop・親子禁止規則が残らない。

### タスク

- [x] `plugins/tumeda-dev/skills/task-design/SKILL.md` のdiscussion接続を更新する。
  - [x] working directory、議論開始判断、設計context、決定後のdesign反映、task-design固有の完了判定をtask-designの責務として残す。
  - [x] 通常mode・軽量modeの両方で、同じagentが `discussion_directory=<working_dir>` と `discussion_file_name=task-design-discussion.md` を渡して新skillを明示適用するMUSTを書く。
  - [x] entry format全文、具体的な記録timing、feedback loop、「親子関係は作らない」という旧規則を削除する。
  - [x] task-designの既存設計思想、normal/light mode切替、design成果物、spike運用を変更しない。
- [x] `plugins/tumeda-dev/skills/task-design/templates/discussion_entry.md` を削除する。
- [x] task-designの移行を静的確認する。
  - [x] `templates/discussion_entry.md` への参照がtask-designの現行定義に残っていないことを確認する。
  - [x] `facilitate-discussion`、working directory、`task-design-discussion.md`、決定後のdesign反映が一つのconsumer契約として読めることを確認する。

## フェーズ3: `steering` の通常discussionとimplementation reviewを移行する

### DoD

steeringが通常discussionにはdefault `discussion.md`、実装後reviewには `implementation_review.md` を指定して同じ `facilitate-discussion` を適用する。旧4部構成・`FB-N`・旧entry全文はなく、steering固有の起動条件と決定後flowだけが残る。

### タスク

- [x] `plugins/tumeda-dev/skills/steering/SKILL.md` の通常discussion接続を更新する。
  - [x] steering directory、通常discussionの起動判断、関連成果物context、決定後のphase制御、終了条件をsteeringの責務として残す。
  - [x] 同じagentが `discussion_directory=<steering directory>` を渡し、default `discussion.md` で新skillを明示適用するMUSTを書く。
  - [x] entry format全文、提案・feedback・決定の記録手順、原因追跡formatの重複を削除する。
  - [x] `task-design-discussion.md` と通常 `discussion.md` を混ぜない規則を残す。
- [x] `plugins/tumeda-dev/skills/steering/SKILL.md` のimplementation review接続を更新する。
  - [x] 同じagentがsteering directoryと `discussion_file_name=implementation_review.md` を渡して新skillを明示適用するMUSTを書く。
  - [x] feedback原文と実装・design・tasklist context、決定後の適用先、必要時のdesign合意からtask追加への順序をsteeringの責務として残す。
  - [x] 旧4部構成、`FB-N`、空の設計・task整理section、固定section順序を削除する。
  - [x] review決定後に実装を自動開始しない規則と、修正済みfeedbackも論点として扱う規則を残す。
  - [x] feedback件数、feature・MVP境界、既存tasklistへの追記方法など、今回対象外のsteering内部規則を変更しない。
- [x] `plugins/tumeda-dev/skills/steering/templates/tasklist.md` のreview案内を新skill接続へ合わせる。
  - [x] 「`implementation_review.md` を作成して収集する」という直接file操作を、steeringが `facilitate-discussion` を使って記録する表現へ置き換える。
  - [x] tasklist templateのその他のphase構造、DoD、完了後actionを変更しない。
- [x] 次の旧templateを削除する。
  - [x] `plugins/tumeda-dev/skills/steering/templates/discussion_entry.md`
  - [x] `plugins/tumeda-dev/skills/steering/templates/implementation_review.md`
- [x] steeringの移行を静的確認する。
  - [x] 旧template path、4部構成、`FB-N`、consumer側のcanonical entry全文が現行定義に残っていないことを確認する。
  - [x] 通常discussionとimplementation reviewのfile名、consumer責務、決定後flowが混ざらず読めることを確認する。

## フェーズ4: `design-consult` の記録経路とskill索引を更新する

### DoD

design-consultの分析記録をユーザーが承認した場合、親agentがcallerの保存先または新skillのdirectory確認を使って `facilitate-discussion` を適用する。分析内容への一括合意は発生せず、人間向けskill一覧から新skillを発見できる。

### タスク

- [x] `plugins/tumeda-dev/skills/design-consult/SKILL.md` の記録案内を更新する。
  - [x] 分析後に記録要否を確認する現行動作を残す。
  - [x] 承認後はchild subagentやdesign-consult自身が直接書かず、親agentが新skillを明示適用する規則を書く。
  - [x] callerの `discussion_directory` と任意file名を優先し、なければdirectoryを聞いてdefault `discussion.md` を使う規則を書く。
  - [x] 記録承認を分析内の全提案への一括合意とは扱わず、decision scopeごとに通常flowで合意する規則を書く。
  - [x] 分析方法、subagent model、回答を要約せず返す契約を変更しない。
- [x] `plugins/tumeda-dev/skills/README.md` に `facilitate-discussion` の一行索引を追加する。
  - [x] discussion processを共通化するskillであることだけを一行で示し、詳細契約を複製しない。
  - [x] `think-through`、`steering`、`task-design` との関係が階層表示から誤読されない位置に置く。
- [x] read-only consumerと対象外fileが変更されていないことを確認する。
  - [x] `doc-enricher/SKILL.md` と `think-through/SKILL.md` に差分がないことを確認する。
  - [x] root `README.md` と今回のsteering directory以外の既存 `.steering/` 履歴に意図しない差分がないことを確認する。

## フェーズ5: validatorと配布versionを新しい正本へ切り替える

### DoD

repository validatorが新skill、consumer接続、旧template不存在、portable file、skill索引を検証し、Codex・Claude・marketplaceの四つのversion宣言と期待releaseがすべて `3.0.0` で一致する。

### タスク

- [x] `scripts/verification/validate-plugin.mjs` のdiscussion関連検証を更新する。
  - [x] 必須pathを新skillの `SKILL.md`、`agents/openai.yaml`、`templates/discussion_entry.md` へ切り替える。
  - [x] new skillのfrontmatter、canonical entry要素、self-containedな合意対象、feedback routing、親子validation、default/custom file契約を静的検証する。
  - [x] 新規論点作成前のdiscussion scope gate、`独立論点` の限定、scope外判明時の履歴保持を静的検証する。
  - [x] `policy.allow_implicit_invocation: false` を検証する。
  - [x] task-design、steering、design-consult、steering tasklist templateの `facilitate-discussion` 接続とconsumer固有file名を検証する。
  - [x] 旧template三pathが存在しないことと、現行consumerが旧path・4部構成・`FB-N` を参照しないことを検証する。
  - [x] portable file一覧から削除済みtemplateを外し、新skill本体・template・更新consumerを追加する。
  - [x] skill一覧に `facilitate-discussion` が存在することを検証する。
- [x] `tumeda-dev` の配布versionを `3.0.0` に揃える。
  - [x] `plugins/tumeda-dev/.codex-plugin/plugin.json` を更新する。
  - [x] `plugins/tumeda-dev/.claude-plugin/plugin.json` を更新する。
  - [x] `.claude-plugin/marketplace.json` のroot versionと `tumeda-dev` entry versionを更新する。
  - [x] validatorの `expectedRelease` を `3.0.0` に更新する。
  - [x] `.agents/plugins/marketplace.json` はversionを持たないため変更しない。
- [x] 配布metadataと静的契約を検証する。
  - [x] `node scripts/verification/validate-plugin.mjs` を実行して成功するまで修正・再実行する。
  - [x] JSON parserで三つのmetadata fileを読み、四宣言が `3.0.0` で一致することを確認する。
  - [x] repository全体を検索し、過去の `.steering/` 履歴を除く現行定義に削除pathと旧契約が残っていないことを確認する。

## フェーズ6: discussion体験を隔離fixtureでsmoke testする

### DoD

plugin sourceと既存steering成果物を変更しない一時directoryで、default file作成、custom既存file継続、self-containedな合意対象保存、異なるdecision scopeのrouting、discussion scope外候補の除外がすべて確認できる。旧本文・旧iterationは保持される。

### タスク

- [x] `mktemp -d` で五ケースを分離したfixture rootを作り、各caseの既存directoryと必要なseed Markdownを用意する。
- [x] `codex exec --ephemeral --sandbox workspace-write` のfresh processへrepository内の新しい `facilitate-discussion/SKILL.md` を明示して、default file caseを実行する。
  - [x] file名を渡さず、既存directoryに `discussion.md` が新規作成されることを確認する。
  - [x] 新規fileが `# 議論記録` とcanonicalな `## 論点1:` を持つことを確認する。
- [x] custom既存file caseを実行する。
  - [x] `### 論点3:` を持つcustom file名を渡し、書込み前の全byte列が書込み後fileの不変なprefixとして残ったまま、file末尾に `## 論点4:` が追加されることを確認する。
  - [x] defaultの `discussion.md` が別途作られていないことを確認する。
- [x] self-containedな合意対象caseを実行する。
  - [x] chatにだけある提案を含むpromptで合意確認まで進め、agentが質問を返す前に完全な現在案と具体的な判断対象をentryへ保存したことを確認する。
  - [x] fileだけを読むfresh readerが、何への合意を求めているか特定できることを確認する。
- [x] feedback routing caseを実行する。
  - [x] 既存論点とは異なるdecision scopeのfeedbackを与え、既存iterationへ混ぜず新規のchild・sibling・parent・独立論点のいずれかへroutingしたことを確認する。
  - [x] routing理由、親指定の整合性、既存iterationの不変を確認する。
- [x] discussion scope gate caseを実行する。
  - [x] 現在のdiscussion目的へ影響しないconsumer内部規則を候補として与え、activeな新規論点を作らないことを確認する。
  - [x] scope外である理由をchatで区別し、`独立論点` の受け皿へ入れないことを確認する。
- [x] smoke testの結果をtasklistの各checkboxと実行報告へ記録し、一時fixtureだけを後片付けする。repositoryへfixtureや生成discussion fileを追加しない。

## フェーズ7: 最終整合性を確認する

### DoD

新skill、全consumer、template削除、validator、skill索引、配布metadataがdesign D1〜D21と一致し、repository差分に空白error・対象外変更・旧正本の残存がない。

### タスク

- [x] `quick_validate.py` を `facilitate-discussion` に再実行して成功を確認する。
- [x] `node scripts/verification/validate-plugin.mjs` を再実行して成功を確認する。
- [x] 変更fileと削除fileをdesign D20の一覧へ照合する。
  - [x] plugin実装差分が追加三file、更新九path、削除三pathだけであることを確認する。
  - [x] `.agents/plugins/marketplace.json`、root `README.md`、`doc-enricher`、`think-through`、今回のsteering directory以外の既存 `.steering/` 履歴に意図しない差分がないことを確認する。
- [x] `git diff --check` を実行して成功を確認する。
- [x] 差分を通読し、consumer側にcanonical entry全文やfeedback processの第二の正本が残っていないことを確認する。
- [x] tasklistの全実装・検証taskが `[x]` であることを確認する。

## フェーズ8: review feedbackからworkflow記述標準の初稿を作る

### DoD

`how_to_write_workflow.md`が固定templateを配らず、workflow文書のprocedure境界、進行gate、階層、局所記法を内容から導くhowを説明し、既存documentation standardsから発見できる。`facilitate-discussion/SKILL.md`の再構成にはまだ着手しない。

### タスク

- [x] review feedbackと初稿作成の承認を`implementation_review.md`の論点1・2へ記録する。
- [x] `plugins/tumeda-dev/docs/documentation_standards/how_to_write_workflow.md`を新規作成する。
  - [x] semantic roleを固定outlineでなく構造判断の語彙として定義する。
  - [x] workflow文書を書くprocedureと、workflow本文内の独立procedureを設計する基準を分けて書く。
  - [x] phase、variant、進行gate、完了条件を意味に沿った階層で表す方法を書く。
  - [x] sectionごとに記法を独立選択し、理由のない外形対称性をsmellとしてreviewする方法を書く。
  - [x] discussion workflowと別domainのworkflowで原則を検算する。
- [x] `plugins/tumeda-dev/docs/documentation_standards/README.md`へ一行索引を追加する。
- [x] 初稿を通読し、固定template化、既存標準との二重正本、`facilitate-discussion/SKILL.md`への先行変更がないことを確認する。
- [x] `git diff --check`を実行して成功を確認する。

## フェーズ9: 合意したscope treeでworkflow記述標準を全面書換えする

### DoD

`how_to_write_workflow.md`がworkflowを独立した文書種別に限定せず、任意の成果物内で状態を変える記述を対象とする。本文は`workflow全体 → procedure → phase・variant → step・branch`を主軸にし、局所の意図、rule、gate、アンチパターンを文脈から分散させない。成果物別の応用section、role別のtop-level分類、旧8stepは残さず、`facilitate-discussion/SKILL.md`は変更しない。

### タスク

- [x] イテレーション3の提案3への合意を`implementation_review.md`の論点2へ記録し、全面書換え後のfileを現在の合意対象にする。
- [x] `plugins/tumeda-dev/docs/documentation_standards/how_to_write_workflow.md`を全面書換えする。
  - [x] file名や成果物種別でなく、開始状態、判断、順序付きaction、状態遷移、完了状態を持つ記述を対象として定義する。
  - [x] scope treeを構造の主軸とし、role分類は配置後の補助診断に下げる。
  - [x] workflow全体、procedure、phase・variant、step・branchの順に、各scopeの境界と局所情報の置き方を書く。
  - [x] 書く側の手順をscope順の少数phaseへ組み直し、旧8stepを撤去する。
  - [x] 成果物別の応用sectionを撤去し、具体は原則を説明する局所例だけにする。
- [x] `documentation_standards/README.md`の索引が全面書換え後の責務と一致することを確認する。
- [x] 本文を通読し、旧構造の見出し、局所情報のtop-levelへの引上げ、固定field、理由のない外形対称性が残っていないことを確認する。
- [x] `node scripts/verification/validate-plugin.mjs`と`git diff --check`を実行し、成功を確認する。
  - test-runner result: `phase-9-workflow-standard-rewrite-validation-2` / attempt 2 / `passed`
  - 証跡: `.steering/2026/202608/20260801-extract-discussion-workflow-skill/artifacts/phase-9-workflow-standard-rewrite-validation/result.md`
- [x] Phase 9の差分に`facilitate-discussion/SKILL.md`の追加変更がないことを確認する。

## フェーズ10: semantic roleの厚みと表現記法を同時に復元する

### DoD

`how_to_write_workflow.md`が`scope × semantic role`の二軸を明示し、目的・成果、設計意図、不変条件・契約、gate、action・状態遷移、validation・アンチパターンの定義と配置判断を十分に説明する。包含・flow・規則的対応・並列・意味の機微へ、それぞれmermaid、表、箇条書き、散文を使い分け、標準自身が`expression_notation.md`に従う。role別bucket、全組合せmatrix、全scope共通fieldは作らず、`facilitate-discussion/SKILL.md`は変更しない。

### タスク

- [x] 論点2の提案4と論点3の提案0への合意を`implementation_review.md`へ記録する。
- [x] `how_to_write_workflow.md`を二軸の内容構造で再構成する。
  - [x] scope treeをplacementの主軸として維持する。
  - [x] semantic roleの一覧と、各roleの定義・区別・placement・防ぐ失敗を復元する。
  - [x] workflow全体、procedure、phase・variant、step・branchの各scopeで、必要なroleを局所文脈に保つ方法を書く。
  - [x] gateを入口、進行、分岐、完了を制御する体系として復元する。
- [x] `expression_notation.md`を標準自身へ適用する。
  - [x] scope包含、gate遷移、執筆sequenceをmermaidで表す。
  - [x] semantic roleの地図、procedureとvariantの境界、gate種別を短い表で表す。
  - [x] 同格のcriteriaとreview観点を箇条書きまたは意味のある小見出しで表す。
  - [x] 定義、理由、因果、例外、機微を散文に残し、図・表へ過剰変換しない。
- [x] README索引が再構成後の標準責務を表していることを確認する。
- [x] 本文を通読し、semantic roleの陳腐化、散文の壁、固定template化、記法の理由なき対称性がないことを確認する。
- [x] plugin validator、workflow標準の静的検査、`git diff --check`を実行して成功を確認する。
  - test-runner result: `phase-10-workflow-standard-content-notation-validation-2` / attempt 2 / `passed`
  - 証跡: `.steering/2026/202608/20260801-extract-discussion-workflow-skill/artifacts/phase-10-workflow-standard-content-notation-validation/result.md`
- [x] Phase 10の差分に`facilitate-discussion/SKILL.md`の追加変更がないことを確認する。

## フェーズ11: state階層を持つskill draftを作る

### DoD

`facilitate-discussion/SKILL.md`が、skill起動を一度だけ通る初期phase、その後の論点level、選択中の一論点に属するiteration levelとして包含階層を表現する。iterationが別decisionだと判定した場合だけ論点選択へ一段戻り、skill起動を再分岐しない。file新規作成と既存file継続はskill起動phaseのvariantとし、decision確定、再開、reparent、取下げは選択中論点のstate処理とする。全体不変条件と各scope固有の契約・gate・手順を分離し、既存behaviorを削らない。draft review前にはbehavior smokeを実行せず、template、consumer、metadata、version、`think-through/SKILL.md`を変更しない。

### タスク

- [x] 論点4の提案2と、提案1のroot兄弟entryを撤回する理由を記録する。
- [x] `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`を全面書換えする。
  - [x] workflow全体の目的・成果、起動gate、責務境界、入力、設計意図、不変条件を実行workflowより前へ置く。
  - [x] skill起動を一度だけ通る初期phaseとし、file新規作成と既存file継続をそのvariantにする。
  - [x] 論点選択、新規論点作成、選択中論点の進行を論点levelへまとめる。
  - [x] feedback iterationを選択中の一論点へ属する局所procedureにし、別decisionなら論点選択へ戻す。
  - [x] decision確定、再開、reparent、scope外取下げを対象論点のstateに応じた処理として配置する。
  - [x] decision scopeと親子関係の契約を、それらが有効になる論点levelへ置く。
- [x] `scripts/verification/validate-plugin.mjs`を新しい階層見出しとiterationから論点選択への戻り先へ追随させる。
- [x] skill本文を通読し、root直下の無前提な兄弟entry、旧1〜8、全scopeへの同一field強制が残っていないことを確認する。
- [x] template、consumer、metadata、version、`think-through/SKILL.md`にPhase 11の差分がないことを確認する。
- [x] workflow構造の静的検査、plugin validator、`git diff --check`を実行して成功を確認する。behavior smokeはdraft review後へ残す。
  - 証跡: `artifacts/phase-11-facilitate-discussion-hierarchy-validation/result.json`（attempt 2、`passed`、成功3件・失敗0件、behavior smoke未実行）。

## フェーズ12: 採用したstate階層をbehavior smokeで確認する

### DoD

fresh processが採用済み`facilitate-discussion/SKILL.md`を読み、skill起動からdefault fileと新規論点を作るcase、選択済みのactive論点へ同じdecisionのiterationを追記するcase、iteration候補が別decisionなので既存論点へ混ぜず論点levelで新規論点を作るcaseを完了する。既存履歴は不変prefixとして保持し、各caseの完全な現在案と具体的な合意対象がfileへ保存される。plugin sourceと既存discussion成果物は変更しない。

### タスク

- [x] 論点4の提案2への合意とbehavior smokeへの遷移を`implementation_review.md`へ記録する。
- [x] 隔離した三つのfixture directoryと、iteration・別decision caseのseed discussion fileを用意する。
- [x] skill起動caseをfresh processで実行する。
  - [x] 未指定file名からdefault `discussion.md`を作る。
  - [x] canonicalな論点1、完全な現在案、具体的な合意対象を保存する。
- [x] 同一decision iteration caseをfresh processで実行する。
  - [x] skill起動phaseを議論上の分岐として繰り返さず、選択済み論点へiterationを追記する。
  - [x] 旧提案と過去履歴を保持し、現在の合意対象だけを更新して、新規論点を作らない。
- [x] 別decision caseをfresh processで実行する。
  - [x] 選択中論点へiterationを追記せず、論点選択へ戻って新規論点を作る。
  - [x] 旧file全体を不変prefixとして保持し、新論点へrouting理由と完全な現在案を保存する。
- [x] test-runner result、plugin validator、`git diff --check`が成功したことを確認する。
  - 証跡: `artifacts/phase-12-hierarchy-behavior-smoke/result.json`（attempt 1、`passed`、成功8件・失敗0件）。

## フェーズ13: `task-design`のdiscussion processをconsumer handoffへ置き換える

### DoD

`task-design/SKILL.md`が、discussion内部の提案作成、論点選択、iteration、feedback routing、親子関係、合意、file更新を再定義せず、`facilitate-discussion`へ完全移譲する。task-designには議論開始判断、設計固有contextの受渡し、調査・技術検証との解消手段選択、返されたdecisionの`design.md`反映、残る不確実性と完了条件の再評価だけを残す。一つの論点を決定するたびにfacilitate-discussionからtask-designへ返し、decisionを直ちに反映・再評価してから次のdiscussionへ進む。通常modeと軽量modeが同じconsumer契約を参照し、draft review前にはbehavior smokeを実行しない。

### タスク

- [x] 論点5の提案0を実fileへ具体化するdraft承認を記録する。
- [x] `plugins/tumeda-dev/skills/task-design/SKILL.md`の§4をconsumer handoff中心へ再構成する。
  - [x] task-designの所有範囲と`facilitate-discussion`の所有範囲を分ける。
  - [x] directory・file名、設計目的、完了条件、現在の`design.md`、対象不確実性、影響範囲、設計固有判断材料をcontextとして渡す。
  - [x] `topic_id`、提案番号、iteration番号、親論点、entry formatをtask-design入力から除外する。
- [x] Step 3を、未解消の設計判断を解消して`design.md`へ反映する外側loopへ書き換える。
  - [x] discussion、調査、技術検証実装の解消手段をtask-designが選ぶ。
  - [x] discussionを選んだ後の内部processを新skillへ委ね、task-design側で提案0やiterationを組み立てない。
  - [x] decisionまたは事実を反映後に、残る不確実性とStep 4への進行を再評価する。
- [x] `facilitate-discussion`の一論点決定をconsumerへの強制handback gateにする。
  - [x] 複数論点のdecisionをまとめて返さず、一decision確定後は別論点を選ばない。
  - [x] task-designがdecisionを反映・再評価した後だけ、必要に応じて次のdiscussionへ再適用する。
- [x] design.md更新timing、副産物flow、NG集、自己更新規則、軽量modeを同じconsumer境界へ揃える。
- [x] `scripts/verification/validate-plugin.mjs`へconsumer handoff契約と旧Step 3不存在の検証を追加する。
- [x] task-design本文を通読し、discussion内部processの第二の正本が残っていないことを確認する。
- [x] plugin validator、consumer境界の静的検査、`git diff --check`を実行して成功を確認する。behavior smokeはdraft採用後へ残す。
  - test-runner result: `phase-13-task-design-handoff-draft-validation` / attempt 1 / `passed`
  - 証跡: `artifacts/phase-13-task-design-handoff-draft-validation/result.md`
- [x] 論点5のイテレーション1・提案1と実file draftの採用を記録する。
- [x] fresh processでtask-designとfacilitate-discussionの逐次handbackをbehavior smoke testする。
  - [x] 第一の論点を決定した直後に別論点へ進まず、consumerへ返す。
  - [x] task-designが返されたdecisionを`design.md`へ反映し、全体再評価後に次の不確実性を選び直す。
  - [x] plugin validatorと`git diff --check`を再実行して成功する。
  - 証跡: `artifacts/phase-13-task-design-handoff-behavior-smoke/result.json`（attempt 1、`passed`、成功4件・失敗0件）

## 動作確認

### DoD

ユーザーが新skillの内容、consumer接続、旧template削除、`3.0.0`へのversion bump、behavior smoke test結果を確認し、意図した議論体験になっていると判断する。

### タスク

- [x] ユーザーへ変更内容と検証結果の確認を依頼する。
- [x] feedbackがあれば、対象steering directoryと `implementation_review.md` を指定して `facilitate-discussion` で記録・合意する。
- [x] 最終draftへの追加feedbackがないことを確認し、behavior smokeの成功を記録して動作確認を完了する。

## 完了後のアクション

今回の依頼にはcommit、push、PR作成、公開が含まれないため、外部状態を変更するアクションは行わない。
