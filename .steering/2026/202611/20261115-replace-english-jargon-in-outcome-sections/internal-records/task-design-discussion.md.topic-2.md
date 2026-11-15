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
