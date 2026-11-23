# 成果物を名前やpathで読めなくなった変更の記録

以前の版の`prepare-design-record`（またはその前身の`steering`）が作った設計の記録を、今の版で読むための対応だけを置く。全ての変更履歴ではない。

記録の対象と1件の書き方は、`maintenance-plugin-context`の版の規則（[`../../maintenance-plugin-context/SKILL.md`](../../maintenance-plugin-context/SKILL.md)の「Plugin version」節）に従う。

## prepare-design-recordの成果物で記録する例・しない例

対象の成果物は、このskillが用意する設計の記録のdirectory（`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/`）と、月ごとの`summary.md`である。

- 記録する例: 10.0.0での`.steering/`から`.design-records/`への置き場所の変更。記録の本文に書かれた`.steering/…`のpathを、今の版のskillがそのままでは探せなくなる。
- 記録しない例:
  - `summary.md`の題の言い換え。skillもscriptも、題を名前で探さない。
  - 記録に入るfileの説明の書き直し。fileの名前と置き場所が変わらない。

## いつ読むか

既にある記録の本文に`.steering/…`のpathがある時。repositoryに`.steering/`が残っていて、`.design-records/`へ移す時。

## 記録

- [20261123-move-steering-to-design-records.md](./20261123-move-steering-to-design-records.md) — 10.0.0。記録の置き場所を`.steering/`から`.design-records/`へ移した。
