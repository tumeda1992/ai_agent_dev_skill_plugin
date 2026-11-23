# 議論記録

## 論点31: `execution-contracts.md`の「起動する側が行うこと」を、別の内部指示へ分けるか

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** まとめて考える（波及: 中。`task-design/wrap-up.md`、`advance-roadmap/SKILL.md`、`blocker-resolution.md`、validatorの参照と、移行の対応表の移した先が変わる。他は小）

論点26〜29を反映した後の、編集後の`skill-update-review`の候補（候補2）から立てた。

### イテレーション0（論点31）: 候補を、今の作業で分けるかを提案する

#### 提案0（論点31）

##### 候補の内容

`tasklist-executor/execution-contracts.md`は、冒頭で自分を「executorがvisual-inspector / test-runnerへchild処理を委譲する時の契約」と定義したうえで、`tasklist-executor`を起動する側の約束（「起動する側が行うこと」）も同じfileに置いている。二つは読む担当も、改める理由も違う。

| 部分 | 読む担当 | 改める理由の例 |
| --- | --- | --- |
| 状態の正本、停止理由、child request・result、停止・再開、logical owner | `tasklist-executor`（`SKILL.md`の「共通実行契約」から） | childの種類、request・resultの形、host adapterが変わる |
| 起動する側が行うこと（起動、読み直し、実装後のfeedback、段取りの議論、完了の確認、禁止） | 利用者の会話のagent、`advance-roadmap` | task-designの締めくくり、`advance-roadmap`、保留したplugin改善の扱い、実行環境の承認の扱いが変わる |

例えば「完了を確かめた時に、保留メモの確かめ直しを依頼する条件」を変えると、`tasklist-executor`が自分の契約として読むfileが変わる。論点27でBlocker resolutionを分けた時も、起動する側の都合でこのfileの冒頭と本文を直した。

##### 案

- **a. （推奨）今の作業で、`tasklist-executor/caller-contract.md`へ分ける**
  - 「起動する側が行うこと」の節を、見出しの深さだけ変えて新しいfileへ移す。`execution-contracts.md`の冒頭の一文を、新しいfileへの参照に直す。
  - 新しいfileは、読み直しの根拠として`execution-contracts.md`の「状態の正本とsingle writer」と「停止理由」を参照する。Blocker resolutionへの参照は、新しいfileから`blocker-resolution.md`へ向ける。
  - 参照元（`task-design/wrap-up.md`の「実行を始めてよいかを確かめる」、`advance-roadmap/SKILL.md`の二箇所、`blocker-resolution.md`の冒頭）とvalidatorのassertionを、新しいfileへ向け直す。
  - 名前は、validatorが同じ節を`callerContract`と呼んでいることと、隣の`execution-contracts.md`に揃えた。`launcher`は、`execution-contracts.md`で「physical launcher」（host adapter）という別の意味に使われているため避けた。
- **b. 別の作業へ切り出す**
  - 切り出し先の設計の記録を先に作り、今の作業の記録に、今はやらない理由と切り出し先を書く。
- **c. 分けない**
  - 二つの契約が同じfileに残り、片方の都合でもう片方の読み手のfileが変わり続ける。

aを推す。
`work_scope.md`の二段目で見ると、今の作業で書いた節の置き場所を、同じskillの中で変えるだけであり、review・revert・本番適用の単位は崩れない。
論点3の決定（起動する側の約束を、`tasklist-executor`の約束の下に置く）の意味は変わらない。
後で分けると、今書いた節と参照を二度直すことになる。論点27と同じ理由である。

#### 検討記録（論点31・イテレーション0）

##### 前回の編集後reviewとの違い

同じ作業の前回の編集後review（論点27の検討記録）は、「起動する側の約束は停止理由の扱いと結び付いており、分けると停止理由の定義と離れるため候補にしない」とした。今回のreviewは、起動する側の約束が停止理由の定義を参照するだけで、定義そのものは持たないと見た。分けた後も「停止理由」と「状態の正本とsingle writer」を参照すれば読み直しのgateは欠けない。

`execution-contracts.md`を読み直し、起動する側の節（「起動する」「止まって返ってきた時に読み直す」「実装後のfeedback」「段取りの議論」「完了を確かめた時」「起動する側が絶対にやらないこと」「Blocker resolution」）が、child処理の節を参照するだけで、child処理の節からは参照されていないことを確かめた。

##### 参照元

`grep -rn "起動する側が行うこと" plugins scripts`で、`advance-roadmap/SKILL.md`の69行・133行、`task-design/wrap-up.md`の87行、`tasklist-executor/blocker-resolution.md`の3行を確かめた。

#### 提案0へのフィードバック（論点31）

**結果:** 推す案aに合意

> 全部ok

論点30・31・32をまとめて示した往復（あわせて、手元の`.steering/`に残った空のdirectoryを消してよいかを確かめた）で「全部ok」と答えられた。

### 決定（論点31）

今の作業で、`tasklist-executor/execution-contracts.md`の「起動する側が行うこと」を`tasklist-executor/caller-contract.md`へ、見出しの深さだけ変えて移す。
`execution-contracts.md`の冒頭は、起動する側の約束が`caller-contract.md`に、Blocker resolutionが`blocker-resolution.md`にあることを示す一文にする。`caller-contract.md`は、読み直しの根拠として`execution-contracts.md`の「状態の正本とsingle writer」と「停止理由」を参照する。
参照元（`task-design/wrap-up.md`の「実行を始めてよいかを確かめる」、`advance-roadmap/SKILL.md`の二箇所、`blocker-resolution.md`の冒頭）とvalidatorのassertionを、新しいfileへ向け直す。

child処理の契約と起動する側の約束は、読む担当（`tasklist-executor`か、利用者の会話のagentと`advance-roadmap`か）も、改める理由も違うためである。論点3の決定（起動する側の約束を`tasklist-executor`の約束の下に置く）の意味は変わらない。名前は、validatorが同じ節を`callerContract`と呼んでいることと隣の`execution-contracts.md`に揃え、`execution-contracts.md`で別の意味に使われる`launcher`を避けた。

## 論点32: `advance-roadmap/SKILL.md`の「段取りの議論（discussion.md）」を、内部指示へ分けるか

**ステータス:** 決定

**種別:** レビュー指摘

**重さ:** まとめて考える（波及: 中。`advance-roadmap/SKILL.md`と、tasklistを起動する側の段取りの議論の参照先が変わる。他は小）

論点26〜29を反映した後の、編集後の`skill-update-review`の候補（候補3）から立てた。

### イテレーション0（論点32）: 候補を、今の作業で分けるかを提案する

#### 提案0（論点32）

##### 候補の内容

`advance-roadmap/SKILL.md`の「段取りの議論（discussion.md）」は、議論を始める条件、始めない理由にならないもの、`facilitate-discussion`へ渡す入力、主な用途、`investigation.md`との区別を持つ。tasklistを起動する側の段取りの議論も、`execution-contracts.md`から「`discussion.md`の使い方の詳細は`advance-roadmap/SKILL.md`の『段取りの議論（discussion.md）』と同じ」と、この節に頼っている。

そのため、tasklistの側が求める変更（例えば、`limit_reached`で返った後に再開位置を問う時も議論を始める）でも、roadmapだけに関わる手順と同じ`advance-roadmap/SKILL.md`を直すことになる。

##### 案

- **a. （推奨）今の作業で、`advance-roadmap/staging-discussion.md`へ分ける**
  - 節を、見出しの深さだけ変えて新しいfileへ移す。`advance-roadmap/SKILL.md`には「子phaseのtask-designを起動する前には始めない」境界と、新しいfileへの参照を残す（境界は「子phaseのtask-designを起動する前の境界」の節にもある）。
  - tasklistを起動する側の参照先（論点31がaなら`caller-contract.md`、cなら`execution-contracts.md`）を、新しいfileへ直す。
  - 名前は、`discussion.md`に入れるのが「実行の段取りの議論」であること（論点10の決定）から付けた。`discussion`だけでは、`task-design-discussion.md`の設計の議論と区別できない。
- **b. 別の作業へ切り出す**
  - 切り出し先の設計の記録を先に作り、今の作業の記録に、今はやらない理由と切り出し先を書く。
- **c. 分けない**
  - 節は二十行ほどで、今の参照でも読める。tasklistの側の都合で`advance-roadmap/SKILL.md`を直すことが続く。

aを推す。
`work_scope.md`の二段目で見ると、論点10で決めた段取りの議論の置き場所を、同じskillの中で変えるだけであり、単位は崩れない。
実装後のfeedbackは、二つの起動する側が共有する手順を`tasklist-executor/implementation-feedback.md`に分けている。段取りの議論も同じく共有されるため、`SKILL.md`から分けておくと揃う。
置き場所を`tasklist-executor/`ではなく`advance-roadmap/`にするのは、節の文面がroadmapの子phaseを前提に書かれているためである。

#### 検討記録（論点32・イテレーション0）

`advance-roadmap/SKILL.md`の111〜129行を読み、節の中身が、議論を始める条件、`facilitate-discussion`へ渡す`discussion_directory`、内部processを複製しない約束、主な用途三つ、`investigation.md`との区別であることを確かめた。`execution-contracts.md`の「段取りの議論」は、自分の条件（tasklistを実行する段取り）と`discussion_directory`を書いたうえで、詳細をこの節へ送っている。

候補は「段取りの議論の運用方針は、roadmapとtasklistの二つの起動する側から改められ、phaseを進める手順とは別の理由で改まる」とした。分ける先を`tasklist-executor/`にする形も考えた。実装後のfeedbackの手順はそこにある。ただし節の文面（「子phaseのtask-design起動後」「`roadmap.md`がある設計の記録のdirectory」）がroadmapを前提にしており、`tasklist-executor/`へ移すと文面の書き直しが要るため、候補どおり`advance-roadmap/`にした。

#### 提案0へのフィードバック（論点32）

**結果:** 推す案aに合意

> 全部ok

論点30・31・32をまとめて示した往復（あわせて、手元の`.steering/`に残った空のdirectoryを消してよいかを確かめた）で「全部ok」と答えられた。

### 決定（論点32）

今の作業で、`advance-roadmap/SKILL.md`の「段取りの議論（discussion.md）」を`advance-roadmap/staging-discussion.md`へ、見出しの深さだけ変えて移す。
`advance-roadmap/SKILL.md`には、子phaseのtask-designを起動する前には始めない境界と、新しいfileへの参照を残す。tasklistを起動する側の段取りの議論（`caller-contract.md`）の参照先も新しいfileへ直す。

段取りの議論の運用は、roadmapとtasklistの二つの起動する側から改められ、roadmapだけに関わる手順とは別の理由で改まるためである。置き場所を`advance-roadmap/`にするのは、節の文面がroadmapの子phaseを前提に書かれているためである。名前は、`discussion.md`に入れるのが実行の段取りの議論であること（論点10の決定）から付け、`task-design-discussion.md`の設計の議論と区別した。
