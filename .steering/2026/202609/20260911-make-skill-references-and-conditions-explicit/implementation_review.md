# 実装完了後review

## 論点1: design が定める変更対象を、plan と実装が覆っているかを確認する仕組み

**ステータス:** 提案中

**種別:** 認識齟齬

### イテレーション0: 覆域を確認する問いを、tasklist 作成時と DoD 判定時にも当てる

#### 提案0

**推奨:** b。同じ問いが既に存在し、当たる場所が足りていない。

##### 何が起きたか

`tasklist-executor` が全 phase を完了して返した後、steering が返却 result だけで判断せず実物を照合したところ、二件の不足が見つかった。

**不足1: `plugins/tumeda-dev/skills/runtime-execution-contracts.md` の `Repository context` 節が未修正だった。**

`design.md` の「skillの役割と方針」は、条件文を直す対象を三箇所と定めている。`tasklist-design.md:122`、同 `:123`、`runtime-execution-contracts.md` の `Repository context` 節である。ところが `tasklist.md` の Phase 4 は、task も DoD も前の二箇所しか持っていなかった。executor は tasklist どおりに実行したため、三箇所目は手つかずのまま `[x]` になった。

原因は tasklist の作成時にある。design の対象一覧を見ずに、論点2 の chat で中心的に扱った二箇所だけを Phase 4 へ落とした。

**不足2: `.steering/2026/202609/20260910-add-publish-branch-diff-skill/design.md` の修正が DoD を満たしていなかった。**

Phase 5 の DoD は「`design.md:102` が、同 steering の `task-design-discussion.md:67` と同じ意味になっている」である。実際には `remote` を `remote の default branch` へ置換しただけで、後半の「push できる commit も無い場合だけ」が残っていた。原本は「PR を作れない場合だけ」である。

この差で動作が変わる。default branch から branch を切ったばかりで remote にその branch が無い状況では、「push できる commit」は存在するため、修正後の `design.md:102` では空 commit を作らない。原本と `SKILL.md:40` では作る。

さらに同 file の mermaid（`design.md:85`）にも同じ条件があり、こちらは `remote と HEAD が同じ` のまま残っていた。

原因は実装時にある。DoD が二つの文の同一性を要求しているのに、置換対象の語だけを見て、文全体を原本と照合しなかった。

##### 共通する形

二件とも、**確認した範囲が主張する範囲より狭い**。不足1 は design の三箇所に対し tasklist が二箇所、不足2 は文全体の同一性に対し語一つの置換である。

`plugins/tumeda-dev/skills/task-design/SKILL.md` の Step 4 には、すでにこの問いがある。

> **確認範囲が主張範囲を覆っているか**: 検証可能な事実を`design.md`または会話で断定する前に、確認した範囲が主張する範囲を覆っているかを問う。

この gate は design 合意判定の場面に置かれている。tasklist を作る場面と、executor が DoD を判定する場面には置かれていない。標準は存在するのに、当たる場所が足りない。これは今回の steering が扱った事項4（naming 標準が存在するのに skill から参照されていない）および論点9（新設した標準が `document-review` の観点 list に無い）と同じ形である。

##### 案

- **a. 今回の二件を直して終わりにする。一般則は足さない。**
  - 二件はすでに修正し、`node scripts/verification/validate-plugin.mjs` も通っている
  - 同じ形の漏れが次の steering でも起きる
- **b. 覆域を確認する問いを、tasklist 作成時と DoD 判定時にも当てる。**
  - `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の自己レビュー gate へ「`design.md` が定める変更対象を、tasklist の task が覆っているか」を足す
  - `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` の DoD 判定へ「DoD が二つの記述の同一性を要求する場合、両方の全文を読んで照合する」を足す
  - 既存の問い（`task-design/SKILL.md` Step 4）と同じ問いであり、当てる場所を増やすだけである
- **c. b に加えて、`task-design/SKILL.md` Step 4 の既存 gate から新しい二箇所へ参照を張る。**
  - 三箇所が同じ問いであることが読み手に分かる
  - 参照を張る先が増えるぶん、どれが正本かが曖昧になる

#### 提案背景

steering の Step 6-1 は「executorがどの停止理由で返しても、返却resultだけで次の判断をしない」と定めている。この手順に従って `tasklist.md` の checkbox と実物を照合した結果、二件が見つかった。照合しなければ、そのままユーザーへ動作確認を依頼していた。

提案0 が満たす必要のある条件は次の三つである。

1. 二件の不足が実際に解消していること
2. 同じ形の漏れが次に起きたときに検知できること
3. 同じ問いを複数の場所へ重複定義しないこと

条件1 はすでに満たしている。`runtime-execution-contracts.md` の `Repository context` 節を書き直し、`design.md` の `:85` と `:102` を原本へ揃えた。原本である `task-design-discussion.md` は変更していない。

条件2 が案 a を落とす。条件3 が案 b と案 c を分ける。案 c は参照を張ることで同一性を示すが、正本がどこかを曖昧にする。案 b は各場面へ問いを置き、内容は `task-design/SKILL.md` Step 4 と重複するが、場面ごとに確認対象（design の対象一覧か、二つの記述の同一性か）が違うため、同じ文の複製にはならない。

#### 提案0へのフィードバック
**結果:** b を採用。

> b

### 決定

覆域を確認する問いを、tasklist 作成時と DoD 判定時の二箇所へ置く。

| 対象 | 置く位置 | 書く内容 |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/task-design/tasklist-design.md` | 自己レビュー gate | `design.md` が定める変更対象を、tasklist の task が覆っているか。design 側から一つずつ辿る |
| `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` | 最重要原則の「DoD の各条件は『試みた』ではなく『実際に通過した』ことを確認してから `[x]` にする」の配下 | DoD が二つの記述の同一性を要求する場合、両方の全文を読んで照合してから `[x]` にする |

`task-design/SKILL.md` Step 4 の既存 gate からの参照は張らない。参照先が増えるほど正本が曖昧になるためである。各場面で確認する対象が違う（design の対象一覧か、二つの記述の同一性か）ため、同じ文の複製にはならない。

この変更は完成後の姿を変えるため、`design.md` へ反映し、`tasklist.md` へ Phase 8 として追加する。version は既に 7.6.1 へ上げており、この追加も PATCH の範囲にとどまるため再度は上げない。`maintenance-plugin-context` の「配布する変更には、変更内容に見合うversion bumpを一度だけ行う」に従う。
