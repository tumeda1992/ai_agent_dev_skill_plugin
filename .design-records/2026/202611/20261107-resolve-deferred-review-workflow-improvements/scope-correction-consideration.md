# 内部検討記録: 論点1 — reviewのmodel分担の対象

**discussion:** [implementation_review.md](implementation_review.md)

**論点:** 論点1

## 開始context

利用者がmodel分担の対象をexhaustive-reviewとし、Codex限定でもないと訂正した。一般workflowの既定値まで変更した前版の実差分と対比する。

<a id="iteration-0"></a>

## イテレーション0: 対象の拡張とhost限定を取り除く

この記録は同turnの原文照合とGit差分読取後の事後保存である。前版とその直前の比較ではruntime-model-profiles、steering、task-design、tasklist-executor、test-runner、visual-inspectorに一般化した記述がある。利用者の指示はreview内の役割であり、一般host adapterへの既定値変更を根拠付けない。無関係な既存契約は復元・保持し、reviewの役割を限定して配置する必要がある。配置そのものは設計担当へ返し、source編集や検証を実施したとは記録しない。
