# 公開の規則の移行の対応表

作業の公開（commit、push、PR、merge、既定branchのpush、`Closes`）を定める記述を、今ある場所ごとに並べ、行き先を決める。

論点1・論点6の決定で、対象はescalate経由のplugin repositoryの作業の取り込みに絞られた。対象行はL1〜L5とP7であり、L1・L2・L4・L5はKEEP、L3とP7がCHANGEである。P6・P8はKEEP。利用先repositoryの文脈の記述（L6〜L23）と、利用先に効くpluginの記述（P1〜P5、P9、P10）は対象外であり、変えない（KEEP）。下の分類欄のうち、対象外の行に書いた論点は、対象を絞る前のものである。

## 移行前の基準

| repository | commit | 対象 |
| --- | --- | --- |
| `ai_agent_dev_skill_plugin` | `5c2c5a4` | `plugins/tumeda-dev/skills/tumeda-dev-plugin-context.md`（このrepositoryの文脈の実体）、`task-design/tasklist-design.md`、`task-design/templates/tasklist.md`、`steering/SKILL.md`、`escalate-plugin-skill-fix/integrate-plugin-changes.md`、`maintenance-plugin-context/SKILL.md`、`docs/development_standards/development_flow/branch_pr_issue.md` |
| `fortune_calculator` | `e00a794` | `.agents/skills/tumeda-dev-plugin-context.md` |
| `x_favorites` | `b494ffa` | `.agents/skills/tumeda-dev-plugin-context.md` |
| `nanitabe` | `fc3947c` | `.agents/skills/tumeda-dev-plugin-context.md` |

`grow-product-ideas` は文脈のfileを持たない。`article_workspace` の文脈は公開の欄を持たない。

## 利用先の文脈にある記述

| ID | 今の場所 | 原文 | 分類 |
| --- | --- | --- | --- |
| L1 | plugin repository `Git / GitHub公開条件` | remote: `origin` は `ssh://git@github.com/tumeda1992/ai_agent_dev_skill_plugin.git`。 | KEEP（repositoryのfact） |
| L2 | 同 | default branch: `main`。default branchの上で直接commitしない。作業はbranchで行う。 | KEEP（論点9は取り下げ） |
| L3 | 同 | `escalate-plugin-skill-fix`で引き渡された作業は、同skillの「plugin repositoryでの作業完了後の取り込み」に従い、PRを経由せず作業branchを`main`へmergeしてpushする。 | CHANGE（論点1・論点4・論点7: escalate経由もPRを記録として作る規則に変わり、文脈からは消す。規則は`integrate-plugin-changes.md`が持つ。commit `e31e14b`） |
| L4 | 同 | PR作成script: `scripts/for_local/github/create_or_get_pr.sh`。（以下、symlinkの注意書き二行） | KEEP（repositoryのfact） |
| L5 | plugin repository `Branch / issue 契約` | なし。利用先repositoryからの提案が起点になるため、issue番号のような安定した識別子を持たない。branch名はsteering directoryのbasenameに揃える。 | KEEP（論点7で対象から外れた。plugin repositoryの作業はissueを持つことがあるが、この作業では変えない） |
| L6 | fortune_calculator `Git / GitHub公開条件` | remote: `origin` は GitHub の `tumeda1992/fortune_calculator`（private）。 | KEEP |
| L7 | 同 | default branch: `master`。default branch の上で直接 commit しない。作業は issue の branch で行う。 | 既定branchの名前はKEEP。残りは論点9 |
| L8 | 同 | commit・push・PR の作成は、利用者が頼んだ時だけ行う。 | CHANGE（論点2: 作業の終わりにPRの作成まで毎回行う規則に置き換わる。文脈からは消す） |
| L9 | 同 | PR は `master` へ作る。merge は利用者が行う。 | 論点3 |
| L10 | 同 | `Closes #<issue番号>` は、その PR の merge で issue の作業が終わる時だけ付ける。終わらない時は `参照: #<issue番号>` と書き、本文に issue の完了を意味しないことを書く。 | `branch_pr_issue.md` と同じ規則。論点7 |
| L11 | 同 | PR は plugin の `scripts/github/create_or_get_pr.sh` で作る。 | `tasklist-design.md` と同じ規則。論点7 |
| L12 | x_favorites `local Git 運用条件` | commit は、利用者の動作確認が完了した後に行い、phase 単位かつ意味単位で分ける。 | `tasklist-design.md` と同じ規則。論点7 |
| L13 | x_favorites `GitHub 公開条件` | push・PR は non-default branch から作り、PR は plugin の `scripts/github/create_or_get_pr.sh` で作る。 | `tasklist-design.md` と同じ規則。論点7 |
| L14 | 同 | 既定 branch（`main`）への merge は利用者が行う。assistant は merge しない。 | 論点3 |
| L15 | 同 | issue を閉じるのは本線 `feature-<issue番号>` の PR であり、その issue の残作業が無くなってから `Closes #<issue番号>` を付ける。 | `branch_pr_issue.md` と同じ規則。論点7 |
| L16 | 同 | 検証のための merge は、派生 branch `feature-<issue番号>-<説明>` の PR で行う。`Closes` を付けず、参照と「issue の完了を意味しない」を書く。merge 後は `main` を本線へ取り込む。 | 規則は `branch_pr_issue.md` と同じ。branchの形式はrepositoryのfact。論点7 |
| L17 | 同 | `main` への merge は Amplify の本番 build を起こす。 | KEEP（repositoryのfact。論点3の判断に使う） |
| L18 | x_favorites `## tasklist-executor` | ユーザー動作確認が完了するまで、作業 branch への commit・push と PR 作成を行わない。`review` へのforce pushはこの制限に含まれない。 | 前半は `steering`・`tasklist-executor` と同じ規則。後半は確認環境のfact。論点7 |
| L19 | nanitabe `Git / GitHub 公開条件` | remote: `origin` は `git@github.com:tumeda1992/nanitabe.git`。（旧名の注意書き） | KEEP |
| L20 | 同 | default branch: `main`。commit と push を default branch へ直接行わない。 | 既定branchの名前はKEEP。残りは論点9 |
| L21 | 同 | 公開可能な branch: `feature-<issue番号>` 形式の non-default branch。 | KEEP（branchの形式。論点7で置く欄を決める） |
| L22 | 同 | PR: `feature-<issue番号>` から `main` へ作成する。 | RETIRE（論点2: PRを既定branchへ作ることはpluginの規則になる。branchの形式と既定branchの名前は他の行で残る） |
| L23 | 同 | merge 後の main の commit title には `(#PR番号)` が付く（squash merge 運用）。 | 論点3 |

## pluginにある記述

| ID | 今の場所 | 原文（要点の範囲） | 分類 |
| --- | --- | --- | --- |
| P1 | `task-design/tasklist-design.md`「実装後feedbackと公開action」 | 文脈にlocal Git運用条件の記載がある場合、またはユーザーが明示的にcommitを要求した場合だけcommit sectionを生成する。…該当項目が無い場合は…利用者へ確認する。利用者の回答は`maintenance-plugin-context`が同fileへ書き戻し… | ADAPT（論点2: 文脈の欄の有無によらず、commit sectionを作る） |
| P2 | 同 | 文脈にGitHub公開条件の記載があり…current branchが公開可能なnon-default branchである場合だけpush・PR sectionを生成し…該当項目が無い場合は…利用者へ確認する… | ADAPT（論点2: 文脈の欄の有無によらず、push・PR sectionを作る。行えない時の扱いはdesignの「作業の公開の流れ」） |
| P3 | `task-design/tasklist-design.md`「利用者にしかできない操作」 | PRのmerge、既定branchへのmerge（どちらを禁じるかは、repositoryのcontext fileとpluginの規則が決める） | 論点3 |
| P4 | `task-design/templates/tasklist.md` | commit section、push・PR sectionを生成する条件のcomment | ADAPT（論点2） |
| P5 | `maintenance-plugin-context/SKILL.md` | task-designは…UI確認環境、Git/GitHub公開条件、作業の外へ残るactionの差し込みを必要factとして要求できる。 | 論点7 |
| P6 | `steering/SKILL.md` 5-1 | `planless_complete`の完了報告。公開の段を持たない | KEEP（論点5は取り下げ） |
| P7 | `escalate-plugin-skill-fix/integrate-plugin-changes.md` | PRを経由せず次の4stepで`main`へ取り込む。…PRを経由しないのは… | CHANGE（論点1・論点6・論点10: PRを記録として作り、手元で`--no-ff`のmergeを行う。escalateの内部指示のまま。commit `e31e14b`） |
| P8 | `docs/development_standards/development_flow/branch_pr_issue.md` | `Closes`、二つのmerge経路、branch名の原則。形式は利用先が宣言する | KEEP |
| P9 | `share-work-in-progress/SKILL.md` | 動作確認の前に今のbranchを見せるためのcommit・push・PR | KEEP（作業の終わりの公開とは別の場面） |
| P10 | `steering/SKILL.md`、`tasklist-executor/SKILL.md`、`tasklist-design.md` | 動作確認が完了する前にcommit・push・PRを行わない（確認環境と作業の外へ残るactionの例外を除く） | KEEP |
