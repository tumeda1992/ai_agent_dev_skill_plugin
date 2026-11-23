# 成果物を名前で読めなくなった変更の記録

以前の版のtask-designが作った成果物を、今の版で読むための対応だけを置く。全ての変更履歴ではない。

記録の対象と1件の書き方は、`maintenance-plugin-context`の版の規則（[`../../../maintenance-plugin-context/SKILL.md`](../../../maintenance-plugin-context/SKILL.md)の「Plugin version」節）に従う。

## task-designの成果物で記録する例・しない例

対象の成果物は、task-designが作る`design.md`、`tasklist.md`、`roadmap.md`である。

- 記録する例: 9.0.0での付録とroadmapのlabelの切り替え。前月summaryの判定やplan無しの完了の検証が、古いdesign.mdの付録の見出しを名前で探せなくなる。
- 記録しない例:
  - 完成後の姿のsectionの見出しだけの言い換え。skillもscriptも、その見出しを名前で読まない。
  - テンプレートへのsectionの追加。古い成果物も今までどおり読める。
  - 記入guideの書き直し。成果物の見出し・labelが変わらない。

## いつ読むか

既存のdesign.md・roadmap.mdで、skillが探す見出しが見つからない時。作成時の版が古い可能性がある。

## 記録

- [20261115-rename-template-labels.md](./20261115-rename-template-labels.md) — 9.0.0。付録とroadmapのlabelを、普段の意味のまま読める名前へ切り替えた。
- [20261123-rename-roadmap-progress-labels.md](./20261123-rename-roadmap-progress-labels.md) — 10.0.0。roadmapの進み具合の見出しとlabelを、steeringから`advance-roadmap`と子の設計の記録へ切り替えた。
