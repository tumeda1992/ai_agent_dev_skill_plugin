# 内部検討記録: 論点2 — 言い換えをどのfileまで行うか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点2

## 開始context

- 問題: 論点1で、言い換えの対象を見分ける問いが決まった。読む場面は「task-designのテンプレートや、それを使って書かれたdesign.md」である。issue #5が名指ししたのは`task-design/templates/outcome-sections/`だが、同じ型の表現はtask-designの他のテンプレートや他skillにも出る。
- 決める範囲: 今回の作業で言い換えるfileと、今回扱わず別の作業へ切り出すもの。各表現の言い換え先は決めない。
- 開始時の既決条件: 論点1の決定。file名は変えない。
- 判定に使う標準: `plugins/tumeda-dev/docs/development_standards/development_flow/work_scope.md`。目的の外の不備は既定で拾い、大きすぎる、単体で分けた方がrevertしやすい、本番適用が遅れる、のどれかの時だけ切り出す。

<a id="iteration-0"></a>

## イテレーション0: 範囲の候補と、それぞれの広がりを調べる

<a id="iteration-0-record-1"></a>

### 調査: 同じ型の表現がどこに出て、他のfileとどう結び付いているか

#### 問い・探索範囲・方法

範囲を広げると、言い換えが他skill・scriptの記述まで波及するかが変わる。波及するなら、別の作業へ分けた方がreview・revertの単位が保てる。

- 方法1: 論点1の例に挙げた表現（owner、contract、caller、gate、handoff、precedence、tie-break、closed-world、ledger、baseline、consumer、outcome、意味正本、理解依存、全量保存宣言、明示差分、形式知化、所有）を`grep -oiE`で出現単位に数える。網羅ではなく、広がりの目安である。
- 方法2: task-designのテンプレートが持つ固定のlabelを、他skill・script・validatorが名前で読んでいるかを`grep -rl`で調べる。範囲は`plugins/`と`scripts/`。`.steering/`は除外した。

#### 出現の広がり

| 範囲 | 出現数 |
| --- | --- |
| `templates/outcome-sections/`（14 file） | 378 |
| `task-design/SKILL.md` | 53 |
| `task-design/tasklist-design.md` | 10 |
| `task-design/roadmap-design.md` | 8 |
| `templates/design.md` | 7 |
| `templates/tasklist.md` | 5 |
| `templates/roadmap.md` | 0 |
| plugin全体のMarkdown（71 file） | 940 |

`templates/roadmap.md`が0件なのは、例に挙げた表現を含まないだけである。同じ型の別表現（「運用field」「構造field」「親DoD coverage」「Dependency DAG」）は持つ。

#### 他のfileから名前で読まれているlabel

| label | 出てくるテンプレート | 名前で読んでいる場所 |
| --- | --- | --- |
| 分類保留、task-design内の対象成果物反映待ち、execution plan対象 | `templates/design.md` | `steering/SKILL.md`（Step 3でdesign.mdの付録を検証）、`task-design/SKILL.md`、`validate-plugin.mjs` |
| 上位roadmap制約 | `templates/design.md` | `task-design/scripts/extract-handoff-input.mjs`（見出し名で本文を抜き出す）、`task-design-work-handoff-contracts.md`、`test-task-design-handoff.mjs`、`validate-plugin.mjs` |
| strictly narrower | `templates/design.md`、`templates/roadmap.md` | `tasklist-design.md`、`roadmap-design.md`、`task-design/SKILL.md`、`validate-plugin.mjs` |
| 運用field、構造field | `templates/roadmap.md` | `steering/SKILL.md`、`tasklist-executor/SKILL.md`、`roadmap-design.md`、`validate-plugin.mjs`。構造fieldは`outcome-sections/workflow.md`にも1回出る |
| 親DoD coverage | `templates/roadmap.md` | `roadmap-design.md`、`task-design/SKILL.md`、`runtime-feedback-review.md` |
| routing state | `templates/design.md` | `task-design/SKILL.md` |

outcome-sectionsで他から名前で読まれているのは、`validate-plugin.mjs`が検査する`documentation.md`の三つの文だけである。この三文に言い換え対象の表現は含まれない。outcome-sectionsの側から他を名前で指しているのは、`workflow.md`の「構造field」1回である。

#### 解釈・残る不足・次action

- outcome-sectionsは、他のfileと名前で結び付いている箇所がほぼ無く、単独で言い換えて単独でrevertできる。
- `templates/design.md`・`tasklist.md`・`roadmap.md`で言い換え対象になる表現の多くは、steering、tasklist-executor、script、validatorが名前で読むlabelである。これらを変えるとskill間の取り決めが変わり、他skill・script・testを同時に直す必要がある。labelを残してテンプレートの他の文だけ言い換えると、同じテンプレート内に言い換え前と後の語が混ざる。
- `task-design/SKILL.md`等のagent向けの指示は、design.mdの読み手が直接読む文ではない。ただしagentがchatで使う語の出どころになる。
- 推奨: outcome-sectionsの14 fileを今回の範囲とし、他テンプレートのlabelとSKILL.md等の語は、skill間の取り決めとして一つの別作業に切り出す。切り出す理由は、他skill・script・testへ波及して大きく、単体でrevertできる方がよいため（`work_scope.md`の二段目）。
- outcome-sections内の「構造field」は、roadmapのlabelを指す参照なので今回はそのまま残し、別作業でlabelと一緒に変える。

<a id="iteration-1"></a>

## イテレーション1: 「表出するか」で範囲を引き直す

入口は提案0への利用者の応答。

> cを希望するけど、結果aを選んだときと同じ結果になると思う。skillの内部的で表出しない話は内輪で伝わればいいから

範囲の引き方が「どのfileか」から「利用者の目に出るか」へ変わった。skillの内部だけでやり取りされる語は言い換えの対象外になる。利用者は、この引き方ならaと同じ結果になると見ている。その見立てが成り立つかを確かめる。

<a id="iteration-1-record-1"></a>

### 調査: outcome-sections以外のテンプレートで、成果物へそのまま出る語はあるか

#### 問い・探索範囲・方法

design.md・tasklist.md・roadmap.mdのテンプレートの見出しと表のlabelは、task-designが作る成果物へそのまま写り、利用者が読む。そこに論点1の言い換え対象の型が残っていれば、結果はaと同じにならない。

- 範囲: `plugins/tumeda-dev/skills/task-design/templates/design.md`、`tasklist.md`、`roadmap.md`
- 方法: `grep -n "^#"`で見出しを、本文を読んで表のlabelを抜き出し、論点1の見分ける問いを当てた。各語を言い換えるかの最終判定は言い換え先の論点で行う。ここでは候補に入るかだけを見る。

#### 成果物へそのまま出る語のうち、言い換え候補になるもの

| テンプレート | 成果物へ出る見出し・label | 候補になる理由 |
| --- | --- | --- |
| `design.md` | 上位roadmap制約、（付録）変更の実行区分、task-design内で対象成果物へ適用済み、task-design内の対象成果物反映待ち、execution plan対象、分類保留、表の「掲載理由」「参照するdesign section」「validation結果」 | 「execution plan対象」「対象成果物反映待ち」は、task-designの内部の区分を知らないと何の対象・何の反映か分からない |
| `roadmap.md` | 構造field（task-designが設計・reviewする）、運用field（steeringだけが更新する）、`stable-phase-id`、Scope／Scope外、親DoD coverage、Dependency DAG | 「構造field」「運用field」「親DoD coverage」「Dependency DAG」は普段の会話で聞かない |
| `tasklist.md` | Phase、DoD（完了条件）、Tasks、各task詳細 | DoDは括弧で言い換えが付いており、Phase・Tasksは普段の意味のまま読める。候補に入らない可能性が高い |

#### 解釈・残る不足・次action

- 利用者の見立て（結果はaと同じ）は成り立たない。design.mdとroadmap.mdのテンプレートには、成果物へそのまま出て、論点1の型に当たる語が残る。
- これらの多くは、steering・tasklist-executor・script・validatorが名前で読むlabelでもある。言い換えるなら、名前で読む側を同時に追随させる。追随は語の差し替えであり、読む側の内部の文を言い換えることではない。
- 記入guide（HTML comment）は成果物へは出ないが、論点1で「agentがdesign.mdへ持ち込む」ため対象とした。利用者の「内輪で伝わればいい」と矛盾するかを確認したい。assistantの読みは、持ち込みの経路があるので表出の一部として扱う、である。
- agentがchatで使う語も利用者の目に出る。出どころはSKILL.md等の内部の文で、範囲に入れると内部の文を全部言い換えることになる。今回は入れず、再発防止の論点で「書くときの基準」として扱う案を示す。
