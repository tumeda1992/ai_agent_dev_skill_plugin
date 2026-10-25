# 議論記録を目的に合わせて読む

入口は[解決](resolve-discussion.md)済みとする。
同じownerがread-only helper `scripts/inspect-discussion.mjs`で取得し、意味・合意・応答・完了は原文から判断する。
helperへ正本の選択や修復を委ねない。

## 通常の継続を読む

1. `check --directory <directory> --name <name>`で実論点・件数・順序・親子・索引と範囲所属を確認する。
   構造問題があれば対象の書込みを停止し、自動修復・改番しない。
2. `read --view current --directory <directory> --name <name> --offset 0 --limit 1`で、
   全体前提、論点metadata、現在結果、未決の最新iteration、現在の変更を原文で取得する。
3. `next_offset`がnullになるまで同じ条件で取得を続ける。
   `total_chunks`と出典path・行・columnを保持する。
   一fileや一行の途中でも切れるため、同じfileの全chunkを合わせて読む。
   tool出力の打切りを読了にしない。
4. `needs_full_read`にあるfileは全文へ広げる。未知の形式を空・決定済み・確認済みにしない。取得不能は未確認として返す。
5. 対象論点は`read --topic N`で、その論点を含む範囲file全文を全chunk取得する。
   単一形式では単一file全体になる。
   末尾のiterationとfeedback状態、原文応答、前回提示、現在state、親子を確認する。
6. 対象の内部logは全文読む。根拠として使う他論点の現在結果・該当範囲と内部log、後続訂正・参照先へ必要な分だけ広げる。無関係な全過去iteration・全logを毎回通読しない。

`read --view full`は索引と全範囲fileの原文を返す。
大きい時もoffset/limitで最後まで取得する。
helperが出すcompleteは取得範囲の完了であり、意味理解や承認を保証しない。

## 書込み直前に再取得する

更新対象file全体と使用するlog全文を再読する。分割済みでも対象欄だけを抜き出して書かない。
読取時に`snapshot --directory <directory> --name <name> --log <evidence-log>`で、
記録集合・実体path・SHA-256と使用logを保存する。
logが複数なら`--log`を繰り返す。
保存直前に同じ条件の`compare`へ旧snapshot JSONをstdinで渡す。
exit 0なら不変、2なら変更あり、1なら不正input・取得不能である。
2や1を正常な不変と扱わず、入口解決・必要な再読と再判定へ戻る。
単一から分割への明示移行中だけは新旧共存が意図された状態になるため、通常resolverを使うcompareへ通さず、[分割](split-discussion.md)の旧集合の直接照合を使う。
この例外を通常継続へ広げない。
保存後は対象集合と実差分を確認し、過去履歴・別欄・親子・linkを保持したことを確かめる。対象file不明や同時変更を推測で上書きしない。

## handoffで全文を追いつく

既存designの独立構成前には本文もsnapshotも取らない。
task-designの既存gateを通った後のcatch-upだけ、`read --view full`で索引・全範囲の全chunkと必要な内部logを読む。
最終返却前に集合・解決先・hashを再照合する。
差があれば再取得・再読・照合し、古いsnapshotによる完了を返さない。
bounded extractionをcanonical全文読取の許可へ読み替えない。
