---
name: prepare-design-record
description: "新しい作業の設計の記録（`.design-records/YYYY/YYYYMM/YYYYMMDD-slug/`）を用意する。命名、directoryの作成、前月の`summary.md`の生成、任意のbranch作成を行い、directoryの絶対pathを返す。task-designが新しい作業を始める時に呼ぶ。変更を伴わない調査の設計のように、task-designを通さずに記録を置く作業からも呼べる。設計はしない"
allowed-tools: Read, Grep, Write, Edit, Bash
---

# 設計の記録を用意する

## 作業限定の暫定指示を取得する

起動・別sessionからの再開・resume・把握した指示変更時に、元作業のexactな場所、consumer `prepare-design-record`、
対象処理、実際に使うこのSKILL.mdの取得元を`maintenance-plugin-context`へ渡し、暫定指示を取得する。
選択・競合・実行版の判断は管理担当へ委ねる。
activeの実効指示に従い、paused/unavailableでは影響する暫定動作を止めて理由を返す。
none/endedでは既存処理へ進む。
元作業不明を別作業の探索で補わない。
通常の返信・内部file再読・think-throughの毎turn適用を定期取得へ変えない。
同一sessionの登録・改訂結果は返却された更新を使い、通知されていない編集を常時検知できるとは扱わない。


元作業directoryが未確定なら、取得不能をnoneにせず管理担当へ不足を返す。
既存ownerによる命名・directory確定に必要な処理は続け、影響する暫定動作だけを待ちにする。
元作業が確定した直後に取得し、先に対象の暫定動作を実行しない。

このskillが作るdirectoryが元作業の場所になる。作る前は元作業が未確定であり、作った直後に暫定指示を取得する。

## 役割

一つの作業の設計の記録を使える状態にし、そのdirectoryの絶対pathを呼出し元へ返す。

このskillは置き場所の準備だけを受け持つ。入力を整理する、codeや設計文書を読んで方針を作る、WHY・WHAT・HOWを整理する、scopeを分ける、選択肢や推奨の方向を示す、`design.md`等の成果物を作ることは行わない。設計の判断を置き場所の準備へ紛れ込ませると、設計の担当を包む層が生まれる。設計はtask-design等の呼出し元が行う。

呼ばれるのは、新しい作業を始める時である。既にある作業を再開する時は呼ばず、呼出し元が既存のdirectoryをそのまま使う。

## 入力

- 作業内容: 呼出し元が受けた依頼。意味を足さずに`name-work-directory`へ渡す
- 実行時のlocal date
- 任意: `branch_from_basename`。defaultは`false`。`true`のとき、basenameを決めた直後に同名のbranchを作成して切り替える

## 記述規則

- ユーザーとの会話と成果物本文は日本語で記述する。code、command、path、identifier、規定された出力形式、固有名詞は原文を維持する。
- 成果物へ書く前に、その記述が機密情報にあたるかを [`confidentiality.md`](../../docs/documentation_standards/confidentiality.md) の判定で確認する。調査は網羅的に行ってよいが、成果物へ書く時点では別の判断が要る。判定の中身は同 file が正本であり、ここへ写さない。

## 命名規則と置き場所

作業内容と実行時のlocal dateを`name-work-directory`へ渡し、`YYYYMMDD-slug`のbasenameを一つ受け取る。このskillが英語要約、slug、日付を独自に決めず、同じ作業中はbasenameを変更せず使い続ける。

basenameの日付部分から`YYYY`と`YYYYMM`を得て、次のpathを管理する。

```text
.design-records/YYYY/YYYYMM/YYYYMMDD-slug/
```

このpathが一つの作業の設計の記録であり、task-designから呼ばれた時はtask-designのworking directoryでもある。このskillは親directoryの作成と前月summary生成を担当する。branch名の取得・埋込み・衝突確認をbasenameへ持ち込まない。basenameからbranch名を導く逆方向は`branch_from_basename`が扱う。

`.design-records/`は起動時のworking directoryを基準に解決する。入るもの（タスク設計、調査設計、その議論・計画・実行の経緯）に共通する核は「設計」であり、`records`は決定と経緯が残る場所であることを示す。

## 手順（順序固定）

1. 以前の置き場所を確かめる。
   - `.steering/`がある時は、[`breaking_changes/20261123-move-steering-to-design-records.md`](breaking_changes/20261123-move-steering-to-design-records.md)の「移し方」の手順で移すことを利用者へ提案する。`.design-records/`も既にある時の扱いを含め、手順の正本は同fileであり、ここへ写さない。`.design-records/`も既にある時は、同fileの「追跡外のfileだけが残った時」の手順2で示す一覧を、移して空のdirectoryを消すことの提案とする。
   - 承認されたら同fileの手順で一度だけ移す。承認されない時、または同fileの手順が止まった時は、新しい記録を作らずに止まり、呼出し元へ返す。移さずに新しい記録を作ると、記録が`.steering/`と`.design-records/`に分かれたまま作業が進み、`.design-records/`だけを読む側（task-designの設計前調査、`facilitate-discussion/round-trip.md`の前例探し、前月summary）から`.steering/`側が見えなくなるためである。
2. `name-work-directory`で`YYYYMMDD-slug`を決める。
3. `branch_from_basename=true`の場合だけ、現在のHEADから`YYYYMMDD-slug`という名前のbranchを作成して切り替える。基点となるbranchが意図どおりかはcallerが保証する。同名branchが既に存在する場合、または切替に失敗した場合は、作成も強制切替もせず作業を停止してユーザーへ報告する。stashを行わない。branch名を決める前に[`branch_pr_issue.md`](../../docs/development_standards/development_flow/branch_pr_issue.md)を引き、merge済みのbranch名を再利用していないかを確かめる。判定の中身は同fileが正本であり、ここへ写さない。
4. `.design-records/YYYY/YYYYMM/`がなければ作成する。
5. `.design-records/YYYY/YYYYMM/YYYYMMDD-slug/`を作成する。同名pathが既に存在する場合はsuffix追加や上書きをせず、停止して呼出し元へ返す。
6. 実行月の一か月前（年を跨ぐ場合は前年12月）のdirectoryが存在し、その月の`summary.md`が未存在の場合だけ、[`summarize-previous-month.md`](summarize-previous-month.md)を読んで前月summaryを生成する。既存`summary.md`があれば何もしない。
7. 作成したdirectoryの絶対pathを呼出し元へ返す。

> この時点では`design.md`、`tasklist.md`、`roadmap.md`を作らない。

## 記録に入るもの

一つの作業のdirectoryのrootへ次を置く。どれを作るかは、それぞれを書く担当が決める。

- `design.md`: 合意済み設計の正本。task-designが書く。
- `requirements.md`: Requirementsが長く、独立fileにするとreview可能性が上がる時だけdesignから切り出す。
- `task-design-discussion.md`: task-designの設計収束過程の正本。
- `tasklist.md | roadmap.md`: tasklist・roadmapに載せて実行する変更がある場合だけtask-designが合意済みdesignから作る排他的execution plan。
- `discussion.md`: 実行の段取りの随時議論、段取り上の推論、他成果物へ収まらない背景。roadmapの時は`advance-roadmap`、tasklistの時は`tasklist-executor`を起動する側が書く。
- `implementation_review.md`: 実装、review、validation、ユーザー動作確認後に判明したfeedback・ずれの正本。
- 必要時だけ`investigation.md`、`spike/`。
- 実行の前提が崩れた時の記録`subagent_report/`、引き継ぎ中の一時成果物`task-design-catch-up/`、議論の内部log`internal-records/`。どれも追跡しない（下の「.gitignoreの見本」）。

`task-design-discussion.md`はtask-design固有の設計議論、`discussion.md`は実行の段取りの議論であり、同じ正本として混同しない。

task-design専用子directory、`task_design_dir`探索、`steering.json`を作らない。
議論記録は各basenameの単一fileまたは同名directoryの索引から`facilitate-discussion/resolve-discussion.md`で解決する。
分割形式も同じ正本であり、配置一覧のfile名を単一形式だけの指定と解釈しない。

## 以前の版の記録を読む

既にある記録で、探す見出しやpathが見つからない時は、作成時のpluginの版が古い可能性がある。

- 記録の本文に`.steering/…`のpathがある時は、[`breaking_changes/`](breaking_changes/README.md)の記録で`.design-records/…`として読む。
- `design.md`・`roadmap.md`の見出しやlabelが見つからない時は、[`task-design/templates/breaking_changes/`](../task-design/templates/breaking_changes/README.md)で旧名を確かめて読む。前月summaryの判定でも同じである。

## .gitignoreの見本

利用先repositoryは`prepare-design-record/.gitignore.sample`を`.design-records/.gitignore`へ複製して使う。`.sample`のままでは効かない。

## このskillが絶対にやらないこと

- 設計する。入力の整理、codeや設計文書を読んだ方針づくり、scopeの分割、選択肢や推奨の提示、plan種別の予想をしない。
- `design.md`、`tasklist.md`、`roadmap.md`、議論記録を作る。
- task-design専用子directory、`task_design_dir`探索、`steering.json`を作る。
- 既にある`summary.md`へ追記・再生成し、statusを更新する。
- 同名のdirectoryやbranchがある時に、suffixを足す、上書きする、強制的に切り替える、stashする。
- `.steering/`と`.design-records/`が両方ある時に、推測で混ぜる。
- 利用者の承認なしに`.steering/`を移す。
- 利用者の承認なしに、`.steering/`に残った追跡外のfileを移す。
- `.steering/`に残ったfileを消す。承認があっても消さない。
