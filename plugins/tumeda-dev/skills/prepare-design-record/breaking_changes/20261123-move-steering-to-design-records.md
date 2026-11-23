# 記録の置き場所の`.steering/`から`.design-records/`への変更

## 変わった版

10.0.0。これより前の版の`steering`は、設計の記録を`.steering/`の下に作った。

## 旧名と新名の対応

| 成果物 | 旧名 | 新名 | 名前やpathで読む側 |
| --- | --- | --- | --- |
| 設計の記録の置き場所 | `.steering/YYYY/YYYYMM/YYYYMMDD-slug/` | `.design-records/YYYY/YYYYMM/YYYYMMDD-slug/` | `task-design`の設計前調査（過去の決定を探す）、`facilitate-discussion/round-trip.md`の前例探し、`prepare-design-record`の前月summary |
| 月の一覧 | `.steering/YYYY/YYYYMM/summary.md` | `.design-records/YYYY/YYYYMM/summary.md` | `prepare-design-record`の前月summary |
| `.gitignore` | `.steering/.gitignore`（見本は`steering/.gitignore.sample`） | `.design-records/.gitignore`（見本は`prepare-design-record/.gitignore.sample`） | Git |

作業のdirectoryの中のfile名（`design.md`、`task-design-discussion.md`、`discussion.md`等）は変えていない。

## 変えた理由

`steering`というskillを解き、受け持ちを`task-design`、`prepare-design-record`、`advance-roadmap`、`tasklist-executor`へ分けた。記録の置き場所の名前を、無くなったskillの名前から、入るもの（タスク設計、調査設計、その議論・計画・実行の経緯）の共通の核である「設計」と、決定と経緯が残る場所であることを示す`records`へ変えた。

## 古い成果物の読み方

- 記録の本文に`.steering/…`のpathがある時は、`.steering/`を`.design-records/`へ置き換えたpathとして読む。本文は書き換えない。
- 月の一覧の題が「{YYYY}年{MM}月 Steering サマリー」のものは、以前の版が作った一覧である。書き換えない。

## 移し方

repositoryに`.steering/`が残っている時は、次の手順で一度だけ移す。`prepare-design-record`が初回に移すことを提案する時も、この手順を使う。人もagentも、skillを起動せずにこの手順だけで移せる。

1. `.steering/`がある、作業のworking directoryに`.design-records/`が無いことを確かめる。
   - `.steering/`と`.design-records/`が両方ある時は、下の「追跡外のfileだけが残った時」へ進む。
2. `git mv .steering .design-records`で移す。`.steering/.gitignore`も一緒に`.design-records/.gitignore`へ移る。`.gitignore`で追跡しないfileも、directoryごと一緒に移る。
3. 移した結果をcommitする。`git log --follow`で移す前の履歴を辿れる。

他のbranchで`.steering/`の下にfileを足している作業は、mergeの時に衝突しうる。その時は、足したfileを`.design-records/`の同じ位置へ置き直す。

### 追跡外のfileだけが残った時

移した変更を、別のcloneや別のworktreeでpull・mergeして取り込むと、追跡されたfileだけが`.design-records/`へ移り、追跡外のfileは`.steering/`に残る。
残るのは次のようなfileとdirectoryである。

- `.gitignore`で追跡していなかった作業の控え（`internal-records/`、`subagent_report/`等）
- commit前の作業のfile
- Claude Codeがsessionの作業directoryに作る空の`.claude/.cc-writes/`

この時は`.steering/`と`.design-records/`が両方あるが、追跡されている記録は、すべて`.design-records/`へ移り終えている。

取り込むと`.steering/.gitignore`も移るため、残った作業の控えは無視されなくなり、`git status`に追跡外のfileとして現れる。
移し終えるまで、`.steering/`の下をcommitに含めない。含めると`.steering/`に追跡されたfileができ、下の手順1で止まることになる。追跡しないと決めた控えも履歴に残る。

1. `git ls-files .steering`が何も返さないことを確かめる。
   - fileを返す時は、`.steering/`に追跡されたfileが残っている。混ぜずに止まり、どちらを正にするかを利用者が確かめる。
2. `.steering/`に残ったfileと空のdirectoryを一覧にする。agentが行う時は、一覧を、fileは移し、移し終えて空になったdirectoryは`.steering/`ごと消すという提案として利用者へ示し、承認を得てから次へ進む。承認されなければ移さない。
3. 各fileを`.design-records/`の同じ相対pathへ移す。移す先のdirectoryが無ければ作り（`mkdir -p`）、同じ名前のfileを上書きしない指定（`mv -n`等）で移す。`mv -n`は、移す先に同じ名前のfileがあると上書きせずに黙って飛ばすため、そのfileに気づくのは手順4である。
4. 空のdirectoryだけを消す（例: `find .steering -depth -type d -empty -delete`）。fileは一つも消さない。`.steering/`が消えずに残ったら、残ったfileの多くは、移す先に同じ名前のfileがあったものである。止まり、残ったfileと移す先のfileを並べて、どうするかを利用者が確かめる。

追跡外のfileを移すだけなので、commitは要らない。commit前の作業のfileは、移した先でそのまま作業を続けられる。
