# 付録とroadmapのlabelの切り替え

## 変わった版

9.0.0。これより前の版のtask-designが作ったdesign.md・roadmap.mdは、下の旧名で書かれている。

## 旧名と新名の対応

| 成果物 | 旧名 | 新名 | 名前で読む側 |
| --- | --- | --- | --- |
| design.mdの付録 | ### task-design内で対象成果物へ適用済み | ### 設計中に反映を終えた変更 | steeringのplanless resultの検証 |
| design.mdの付録 | ### task-design内の対象成果物反映待ち | ### 設計中に反映する、他の判断を待っている変更 | steeringの前月summaryの判定、planless resultの検証 |
| design.mdの付録 | ### execution plan対象 | ### tasklist・roadmapに載せて実行する変更 | steeringの前月summaryの判定、planless resultの検証 |
| roadmap.md | ## 構造field（task-designが設計・reviewする） | ## 各phaseの計画（task-designが設計・reviewする） | task-designのroadmapの設計 |
| roadmap.md | ### 運用field（steeringだけが更新する） | ### 進み具合（steeringだけが更新する） | steeringの子steeringのpath・status・完了日の更新 |
| roadmap.md | ## 親DoD coverage | ## 親の完了条件と、それを満たすphase | task-designのroadmapの自己review |
| roadmap.md | ## Dependency DAG | ## phase間の依存関係 | なし（人が読む） |
| roadmap.md | dependency results: | 依存phaseの確定結果: | 子のtask-design |

「分類保留（設計中のみ）」と「上位roadmap制約」は変えていない。

## 変えた理由

利用者の目に出る見出しから、普段の意味のまま読めない表現（execution plan、field、coverage、DAG等）を無くすため。今後は新しい名前が中心になるため、読む側に新旧二つの名前を持たせず、名前を切り替えた。

## 古い成果物の読み方

- 旧名の見出しは、対応する新名と同じものとして読む。
- 進行中のroadmap.mdを続ける時は、見出しを新名へ書き換えてよい。
