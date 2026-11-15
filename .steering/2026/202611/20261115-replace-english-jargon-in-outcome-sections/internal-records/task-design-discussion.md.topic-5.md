# 内部検討記録: 論点5 — design.md・roadmap.mdのテンプレートの見出し・labelをどう言い換えるか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点5

## 開始context

- 問題: 論点2で、design.md・tasklist.md・roadmap.mdのテンプレートの見出し・表のlabelも、利用者の目に出るため言い換えの判定にかけると決めた。言い換えたlabelを名前で読むskill・script・validatorは、文字列だけを追随させる。
- 決める範囲: 三つのテンプレートの見出し・表のlabel・placeholderの言い換え先と、名前で読む側の扱い。記入guideと本文の文の書き直しは別の論点で扱う。
- 開始時の既決条件: 論点1〜4の決定。

<a id="iteration-0"></a>

## イテレーション0: labelの読まれ方を調べ、言い換え先を決める

<a id="iteration-0-record-1"></a>

### 調査: 各labelを、誰が、どの成果物から読んでいるか

#### 問い・探索範囲・方法

論点2の決定は「名前で読む側の文字列を追随させれば、取り決めは崩れない」という前提に立つ。読む側が今回作るテンプレートだけでなく、既に作られた成果物（過去のdesign.md、進行中のroadmap.md）からもlabelを読んでいるなら、名前を変えると古い成果物を読めなくなる。

- 範囲: `plugins/`、`scripts/`
- 方法: 各labelを`grep -rc`で数え、読む側の該当行を読んだ。`extract-handoff-input.mjs`は見出しの照合方法を読んだ。

#### 見つかった事実

| label | 読む側 | 既存の成果物から読むか |
| --- | --- | --- |
| 分類保留、task-design内の対象成果物反映待ち、execution plan対象 | `steering/SKILL.md`のStep 1（前月summaryのstatus判定）とStep 3（planless resultの検証） | 読む。Step 1は前月の全steeringのdesign.mdを読み、これらのsectionの有無と`なし`で完了を判定する |
| task-design内で対象成果物へ適用済み、表の「validation結果」 | `steering/SKILL.md`のStep 3 | 読む（今回のdesign.md） |
| 上位roadmap制約 | `task-design/scripts/extract-handoff-input.mjs` | 読む。既存のdesign.mdから、h2見出しの文字列が「上位roadmap制約」と完全一致するsectionを抜き出す（`match[2] === title`） |
| 構造field、運用field | `steering/SKILL.md`（子steering path・status・完了日の更新）、`tasklist-executor/SKILL.md`、`roadmap-design.md`、`validate-plugin.mjs`（`構造field（task-designが設計・reviewする）`等を完全一致で検査） | 読む。steeringは進行中のroadmap.mdの運用fieldを更新する |
| 親DoD coverage | `roadmap-design.md`、`task-design/SKILL.md`、`runtime-feedback-review.md` | agentが意味で読む。scriptの照合は無い |
| Dependency DAG | `templates/roadmap.md`だけ | 読む側が無い |
| dependency results | `roadmap-design.md`、`task-design/SKILL.md`、`steering/SKILL.md` | agentが意味で読む |
| strictly narrower | `tasklist-design.md`、`roadmap-design.md`、`task-design/SKILL.md`、validator | テンプレートでは記入guideとplaceholderに出る。validatorは指示側の文を検査する |

#### 解釈・残る不足・次action

- 分類保留等の付録のlabel、上位roadmap制約、構造field、運用fieldは、steeringとscriptが既存の成果物から名前で読む。名前を変えると、過去のdesign.mdや進行中のroadmap.md（利用先repositoryにもある）を読めなくなる。追随させるには、読む側が新旧両方の名前を受け付ける必要がある。
- これらは論点1の「task-design全体で決まった形式」に当たると見ることができる。名前は残し、意味が読み取れないものだけ括弧で普段の言葉の説明を添えれば、読む側は今の文字列のまま照合でき、読み手は意味を受け取れる。テンプレートには既に「分類保留（設計中のみ）」という括弧書きの前例がある。
- 上位roadmap制約は完全一致で照合されるため括弧も足せない。ただし「上位のroadmapから受ける制約」と普段の意味のまま読めるため、言い換え対象に当たらない。分類保留も同様に読める。
- 親DoD coverage、Dependency DAG、dependency resultsはscriptが照合せず、agentが意味で読むだけなので、言い換えて指示側の文字列を追随させられる。
