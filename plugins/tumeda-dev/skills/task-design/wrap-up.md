# 設計を締めくくる

task-designがStep 6で`tasklist_ready | roadmap_ready | planless_complete`を返す前に、先頭から末尾まで読む。Step 6の完了条件を満たした直後に、このfileの節を上から順に行う。

## 締めくくりの確認

`tasklist_ready | roadmap_ready | planless_complete`のどのresultでも、返却直前に必ず実行する。plan resultでは実装開始確認より先、planless resultでは完了報告より先に置く。「早く次へ進みたい」ことを理由に省略しない。

1から3は、三つとも見直してから、出た提案を一度に示す。重なる提案は一つにまとめる。一往復に示す数と並べ方は、[round-trip.md](../facilitate-discussion/round-trip.md)に従う。見直しごとに示すと、確かめるだけの提案でも見直しの数だけ往復が増える。

### 1. doc-enricherを提案modeで起動する

次を渡してpluginの`doc-enricher` skillを提案modeで実行する。

- 対象directory: 今回readingまたは変更対象になった範囲
- 関連file: 調査で読んだ、または参照したfile
- 設計の記録のpath: `.design-records/.../YYYYMMDD-slug/`

`doc-enricher`を提案modeで適用し、この作業で払った手間のうち、次の作業者が再び払うものが残っていないかを確認する。提案があれば内容と適用先をユーザーへ示す。明示承認された提案だけを適用し、拒否または保留なら変更しない。

同じoriginating decisionについてtask-design中にreview済みなら重複提案しない。この確認はtheme全体を横断する最終safety netとして、新たな候補だけを扱う。

### 2. discussionを元に再発防止先をreviewする

各議論basenameを解決し、`facilitate-discussion/read-discussion.md`で現在stateと対象範囲・必要logを取得する。
reviewに必要な履歴はfull取得を全chunkで補う。
共存・取得不能を未記録と扱わない。
`discussion.md`と`task-design-discussion.md`に記録された各discussionについて、次の三問による再発防止reviewを順番に扱う。解決策より先に原因を特定する。

1. この議論が起きた根本原因、すなわち共有されていなかった知識の前提は何か。
   - 失敗例: 議論の結論であるruleを根本原因として扱い、対症療法にする。
   - 正しい問い: 議論が始まる前に、どちらかが知らなかった、または共有されていなかった設計前提は何か。
2. その知識はcodeを読めば分かるか、読んでも分からない設計意図か、設計processの不足か。
   - codeを読めば分かる: 既存README等へessenceを提案し、次回のcode readingを省く。
   - codeを読んでも分からない: repositoryの上位architecture document等へ原則を提案する。
   - 設計processの不足: 対応するskillへ、設計時に問うべき問いを提案する。
3. どこに書けば次回この議論が不要になるか。変更はユーザー合意後だけ行う。
   - 既存の file へ書くなら、その file の範囲に入るかを [`naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」](../../docs/development_standards/naming/core.md#中身を足す前に名前が約束する範囲に入るかを確かめる) で確かめてから提案する。

ここで特定した更新提案と承認判断はこの確認で完了させ、実装taskへ先送りしない。設計議論のcontextが最も熱い時点を逃すと「なぜ変えるか」が薄れ、更新品質が下がるためである。「tasklistへdocument更新taskを入れようとしているが、これは今すぐ扱うべきものではないか」と自問する。

### 3. task-design skill自身を確認する

今回の議論から、このtask-design skillの変更が必要かを確認する。不要なら変更してはならない。必要な場合も、提案と変更を分け、ユーザー合意後だけ適用する。

### ファインプレー即時記録の原則

実行中にskill改善のinsightが生まれた場合は、締めくくりの確認を待たずcontextが熱いうちに提案してよい。

- 締めくくりの確認は全体整合性の最終確認であり、timelyな提案の代替ではない。
- 「提案する」と「変更する」は別である。提案は即時、変更は合意後に行う。
- 型は利益があるため存在する。型の精神を理解し、型を活かしてより良くする場合だけ即時提案する。
- 命令無視または単なる改悪を「型を崩す」と正当化しない。

## `planless_complete`を完了する

`planless_complete`では実行するplanがない。実行開始確認、tasklist-executor、`advance-roadmap`の起動へ進まず、`design_path`、task-design内で適用した変更とvalidationの要約、planを作らなかった理由、締めくくりの確認の結果を示して完了する。

完了報告の前に、task-design内で適用した変更を公開する。commit・push・PRを行う条件と方法は、tasklistのcommit section・push・PR sectionと同じく[`tasklist-design.md`の「実装後feedbackと公開action」](tasklist-design.md#実装後feedbackと公開action)に従い、ここへ写さない。この段はPRの作成で終わり、PRのmergeは行わない。escalate経由の作業では、続けて[取り込みと反映](../escalate-plugin-skill-fix/integrate-plugin-changes.md)に従う。完了報告には、公開した先（PRのURL）か、公開しなかった理由を含める。push・PRの前に、local commitが実際に一件以上存在することを確認する。

保留したplugin改善のメモは、再開条件が成り立ちうる状態遷移の時だけ確かめ直す（[保留条件の再確認](../escalate-plugin-skill-fix/pending-escalations.md#元担当の状態遷移から再確認する)）。
task-designが依頼するのは、plan無しで元作業全体を完了する時だけであり、元作業の場所と完了記録・実証拠を`escalate-plugin-skill-fix`へ渡す。
ready resultの照合後、作業の再開時には依頼しない。返却resultだけで成立を通知しない。暫定指示の管理への通知や追加承認とは区別する。

### 記録をcommitへ載せる順序

作業の記録を「記録」として一括りにせず、確定した時点で変更の前後へ分ける。分割軸は何がいつ確定したかであり、`.design-records/`配下という置き場所ではない。この規則は、plan無しの公開でも、tasklistのcommit section（[`tasklist-design.md`の「実装後feedbackと公開action」](tasklist-design.md#実装後feedbackと公開action)）でも使う。

1. `design.md`、`requirements.md`、`task-design-discussion.md`、`discussion.md` — 変更を行う前に確定する。対応する変更commitより前へ置く。
2. tasklistが指示した成果物変更、またはtask-design内で適用した成果物変更 — 変更commit。
3. `tasklist.md`のcheckbox確定と`implementation_review.md`、締めくくりの確認で書き足した記録 — 変更が終わってから確定する。対応する変更commitより後へ置く。

一つの作業が複数の変更commitを生む場合、各変更commitと、その根拠になった合意の記録を近接させる。間に無関係なcommitを挟まない。

一つのdiscussion fileが複数の変更commitへ対応する場合、hunk単位の分割を強制しない。最も早い対応commitへまとめ、後続commitの本文でどの論点に基づくかを示す。

変更が一commitで完結し、三段へ分けても読み手が辿れる情報が増えない場合は、まとめてよい。判断基準は、後から読む人が「どの変更がどの合意に基づくか」をcommit単位で辿れるかである。

- やってしまいがちな行動: 作業の記録を`.design-records/`配下という置き場所で括り、最後の一commitへまとめる
- それをやると何が起きるか: 合意が変更より後に記録された履歴になる。どの変更がどの合意に基づくかを、後から読む人がfile全体を突き合わせないと辿れない
- 正しい判断のための問い: 「この作業の記録は、対応する変更より前に確定したか、後に確定したか？」

## 実行を始めてよいかを確かめる

`tasklist_ready | roadmap_ready`では、ready result、主要成果物、締めくくりの確認の結果を示した後でのみ、tasklist実装またはroadmap tree実行を開始するかユーザーの明示確認を自然言語で得る。

- `OK`、`はい`、`進めて`等の明示確認があれば、planの種類に対応するskillを起動する。`tasklist_ready`なら、[`tasklist-executor/execution-contracts.md`](../tasklist-executor/execution-contracts.md)の「起動する側が行うこと」に従って`tasklist-executor`を起動する。`roadmap_ready`なら`advance-roadmap`を起動する。
- `advance-roadmap`から子phaseとして起動された時は、自分では起動せず、明示確認の原文を結果に添えて`advance-roadmap`へ返す。`advance-roadmap`が起動する。
- 拒否、保留、確認なしならここで終了する。
- plan合意を実行開始の承認と読み替えず、`roadmap_ready`を受けたこと自体を子実行の承認とみなさない。
- 結果を返した直後に「実装へ進みますか」と聞き、締めくくりの確認を飛ばすことを禁止する。

## このfileで絶対にやらないこと

- 許可なくtasklistを実行する。
- 締めくくりの確認またはユーザー確認を飛ばし、自動で次工程へ突入する。
- `planless_complete`を未完了resultとしてtasklist作成へ戻す、または実行開始確認・executor・`advance-roadmap`へ渡す。
- `planless_complete`を理由に締めくくりの確認を省略する。
