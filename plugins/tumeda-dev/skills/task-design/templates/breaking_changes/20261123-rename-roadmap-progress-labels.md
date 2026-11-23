# roadmapの進み具合の見出しとlabelの切り替え

## 変わった版

10.0.0。これより前の版のtask-designが作ったroadmap.mdは、下の旧名で書かれている。

## 旧名と新名の対応

| 成果物 | 旧名 | 新名 | 名前で読む側 |
| --- | --- | --- | --- |
| roadmap.md | ### 進み具合（steeringだけが更新する） | ### 進み具合（advance-roadmapだけが更新する） | `advance-roadmap`の進み具合の更新、`prepare-design-record`の前月summaryの判定 |
| roadmap.md | - 子steering: | - 子の設計の記録: | `advance-roadmap`の子phaseのbinding |

9.0.0より前の旧名（### 運用field（steeringだけが更新する））は、[20261115-rename-template-labels.md](./20261115-rename-template-labels.md)で読む。

## 変えた理由

`steering`というskillを解き、roadmapの進み具合を書く担当を`advance-roadmap`へ移した。roadmapの各phaseは、子steeringではなく、子phaseのtask-designが`prepare-design-record`で用意する一つの設計の記録になった。見出しとlabelが無くなったskillを名指したままにしないため、名前を切り替えた。

## 古い成果物の読み方

- 旧名の見出しとlabelは、対応する新名と同じものとして読む。
- 旧label「子steering」の値は子phaseのdirectoryのpathである。`.steering/…`のpathは、[`prepare-design-record/breaking_changes/`](../../../prepare-design-record/breaking_changes/README.md)の記録で`.design-records/…`として読む。
- 進行中のroadmap.mdを続ける時は、見出しとlabelを新名へ書き換えてよい。
