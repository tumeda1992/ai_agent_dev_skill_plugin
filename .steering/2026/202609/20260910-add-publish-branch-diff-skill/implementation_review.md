# 議論記録

## 論点1: Phase 1 DoDの「usageが出る」という文言と、script実装の実際の分岐の不一致

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0: 不一致の内容と、成果物固有の注記で足りるかを判断する

#### 提案0

`tasklist.md` Phase 1のDoD（79行目）は次のように書かれている。

> `scripts/for_local/github/create_or_get_pr.sh` を実行すると、壊れた symlink の error ではなく script の usage が出る。

対応するTasksサブタスク（107行目）は次のように書かれている。

> `scripts/for_local/github/create_or_get_pr.sh` を引数なしで実行し、usage が出ることを確認する

しかし対象script `plugins/tumeda-dev/skills/scripts/github/create_or_get_pr.sh` を実際に読むと、`usage()` はargument parsingの`case`文の`default`分岐（未知flag受領時）でのみ呼ばれる。引数なし実行は`current_branch()`・`default_branch()`で正常にhead/baseを解決し、`gh pr create`まで到達する正常経路であり、`usage()`には到達しない。

実測結果:

- symlink張り替え後、引数なしで実行すると、このrepositoryの現在の状態（対象branchがmainと同一commitで、まだ何もcommitしていない）では、`gh pr create`が`No commits between main and 20260910-add-publish-branch-diff-skill`という実際のGraphQL errorを返して終了した。
- 未知flag（`--unknownflag`）を渡すと、実際に`usage: ./scripts/for_local/github/create_or_get_pr.sh [--base <branch>] [--head <branch>] [--title <title>] [--body <body>]`が出力された。

いずれの実行でも、壊れたsymlinkの`No such file or directory`ではなく、script本来の出力（正常な実行結果、または実際のerror）が返っており、DoDが確認したかった本質（symlinkが直っている）は両方の実行で満たされている。`tasklist.md`側は、この実測内容を注記として追記したうえで該当subtaskを`[x]`にした（修正済みだが、この論点自体の記録は省略しない）。

分類の検討:

- **成果物固有**: この`tasklist.md`のDoD文言だけが実際のscript分岐と一致していなかった、という説明で足りるか。
- **repository知識**: `create_or_get_pr.sh`の`usage()`がどの入力で発火するかという情報が、design.mdの「（付録）前提とする既存仕様」等に不足しており、今後も同種の誤りが起きうるか。
- **skill**: `task-design`がDoDへ「実行すると特定の出力が出る」という機械的に検証可能な文言を書く際、対象scriptの実際の分岐を読んで検証する手順が`task-design`または`tasklist-design.md`に不足しているか。

提案: 今回は**成果物固有**として扱い、追加の`docs`/`skill`変更は行わない。理由は次の通り。

- 誤りの範囲はこの一つのtasklistの一つのDoD文言に閉じている。`create_or_get_pr.sh`の`usage()`の分岐自体はscript読解で誰でも確認できる情報であり、隠れた設計意図ではない。
- 「壊れたsymlinkのerrorではなくscript本来の出力が出ること」というDoDの意図自体は誤っておらず、確認手段の言葉選び（「usage」という語を例示として使った）が実際の分岐の一つとだけ一致しなかった、という程度の誤差である。
- `task-design/tasklist-design.md`へ「DoDに書く出力文言は対象scriptの分岐を必ず読んで検証する」という一般則を追加するほどの再発可能性があるかは、今回一件だけでは判断材料が不足している。

#### 提案背景

tasklist-executorとして機械的検証可能なDoDを実測したところ、記述どおりの文言が出力されないケースに遭遇した。tasklist-executor skillの契約上、「実装、review、validationからfeedbackまたは実装とのずれが生じた場合」は`facilitate-discussion`を適用して記録することになっているため、この場で報告している。すでに`tasklist.md`側は実測内容の注記付きで`[x]`にしており、実装のやり直しや設計変更は必要ないと判断しているが、原因owner（成果物固有かrepository知識かskillか）の判定はこの場で確定させたい。

#### 提案0へのフィードバック

**結果:** 成果物固有ではなく、一般則として扱う。同じ形の誤りがこの作業中に三回起きていた。

> 1:b

executor は誤りの範囲がこの tasklist の DoD 文言一つに閉じていると判断したが、caller 側で同じ形の誤りを他に二件確認した。

1. 「validator が template へ課す検査は五つ」と述べた。実際は十二個あり、preamble 削除で落ちるのは四つだった。428 行から 440 行しか確認していなかった
2. 「PR 作成 script の参照元は三箇所」と述べた。実際は doc 三 file に加えて context instance と validator 四行があった。`plugins/` 配下だけを `grep` していた
3. 今回の「引数なしで実行すると `usage` が出る」。script は読んでいたが、`usage()` がどの分岐で呼ばれるかを照合していなかった

三件に共通する形は「確認した範囲が、主張する範囲を覆っていない」である。code を読めば分かるのに読まなかったのではなく、読んだうえで照合を完了せずに断定している。三回同型で現れる以上、成果物固有とは言えない。

### 決定

`task-design/SKILL.md` Step 4 の受け入れ確認項目「対象語の網羅確認」を、一般則「確認範囲が主張範囲を覆っているか」へ広げる。

主張が持つ量化子（すべて、N 箇所、この入力で）に対し、確認の範囲が同じ量化子を満たしているかを判断基準とする。既存の対象語の置換に関する内容は削除せず、具体例として保持する。あわせて「この入力でこの出力が出る」を DoD や手順へ書く場合の具体例を足し、対象を読んだことと該当分岐まで照合したことは別であると明示する。

`scripts/verification/validate-plugin.mjs` の `requireText(taskDesignSkill, "対象語の網羅確認")` を新しい見出しへ合わせる。

この修正自体でも同じ誤りが再現した。見出しを改名した時点で、その文字列を検査している箇所を照合せずに validation を実行し、`必須項目「対象語の網羅確認」がない` で落ちた。規則が対象とする失敗そのものであり、validator が捕捉した。

Phase 1 の DoD 文言の不一致は、実装のやり直しを要さない。symlink が直っていることは、引数なし実行と未知 flag 実行のどちらでも確認できている。`tasklist.md` 側は実測内容の注記付きで完了済みとする。
