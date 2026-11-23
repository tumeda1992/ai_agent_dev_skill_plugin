# 内部検討記録: 論点8 — 「見分ける問い」を、ルー語の再発防止としてどこに置くか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点8

## 開始context

- 問題: 論点1で、言い換えの対象を見分ける問いを決めた。論点3で、言い換えは箇所ごとの書き直しとし、対応表を作らないと決めた。その代償として、後から書く人が同じ型の表現を書く余地が残る。issueの原因は、プロジェクト指示の「識別子は原文を維持する」がowner等の普通の概念語まで英語で書くことを止めず、どの表現を避けるかの線引きがどこにも書かれていなかったことにある。
- 決める範囲: 見分ける問いと書き直し方を、どのfileに置き、どこから参照させるか。
- 開始時の既決条件: 論点1〜7の決定。論点7で足した原則（共通の場所には全ての対象に当たる内容だけを書き、個別から共通を参照する）。論点2で、task-design以外のskillが作る成果物は今回の範囲外とし、再発防止の基準ができた後に必要になった時に扱うと決めた。

<a id="iteration-0"></a>

## イテレーション0: 既存の標準と参照の経路を調べる

<a id="iteration-0-record-1"></a>

### 調査: 置き場所の候補と、書く時に通る経路

#### 問い・探索範囲・方法

- 問い1: 既存の標準に、同じ線引きを足せる範囲のものがあるか。
- 問い2: skillのテンプレートや成果物を書く時に、標準が当たる経路はどれか。
- 方法: `docs/documentation_standards/README.md`の収録一覧と「標準の置き方」、`referent_explicitness.md`の冒頭、`skills/document-review/SKILL.md`の「当てる観点」、`skills/task-design/SKILL.md`の§1を読んだ。

#### 見つかった事実

- `referent_explicitness.md`は「文中の語が指す実体を、読み手がその文だけから復元できるか」を扱い、指示語の範囲に「system内部語（「repository context」「返却」等、system固有の意味を持つがどの実体かは別途定まる語）」を含む。論点1の二つ目の型（聞き慣れているが特別な意味を載せた語）と重なるが、一つ目の型（precedence、全量保存宣言のような耳馴染みがない語）は、指す実体の問題ではなく語の馴染みの問題で、この標準の名前が約束する範囲（指示対象の明示）に入らない。
- `documentation_standards/README.md`の「標準の置き方」: 標準は基本1 file。書かれた文に当てて満たすか判定できる標準は、`document-review`の観点listへ足す。読者がそのdocで使えるかを見る観点は、読者向けのdocにだけ当たり、steeringの作業記録には当たらない。
- `document-review`の対象はdocsとskill本体である。skillのテンプレートはskill本体の一部なので当たる。
- `task-design/SKILL.md`の§1は、成果物へ書く前に`confidentiality.md`、`provisionality_explicitness.md`で確認する、という参照を既に持つ。task-designが書くdesign.mdは利用者が読んで合意する文書であり、chatも利用者が読む。

#### 解釈・残る不足・次action

- 新しい標準を1 fileとして`documentation_standards/`に作る。既存の`referent_explicitness.md`へ足すと、耳馴染みがない語の型がその名前の範囲に入らない。
- 参照は二つ。テンプレートやskill本体を書く時は`document-review`の作成時・更新時の観点として当たる。task-designがdesign.mdとchatで利用者へ書く時は、task-designの§1に、既存のconfidentiality・provisionalityと同じ形の参照を一行置く。いずれも個別から共通の標準を参照する向きで、標準は個別のskillを名指さない。
- task-design以外のskillが書く成果物（facilitate-discussionのdiscussion file等）への参照は、論点2の決定どおり今回は置かない。
