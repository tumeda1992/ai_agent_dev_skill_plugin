# Design: 実装完了後reviewの適用範囲と実行者固定を書き分ける

<!--
このfileはpluginの公開配布物に含まれる。`maintenance_policies/migration.md`に従い、
利用先repositoryの名称、所有者名、絶対path、固有ドメイン名、固有steering slugを書かない。
-->

## 元の依頼内容

`steering/SKILL.md` の `## 実装完了後review` にある trigger 条件節が、assistant自身が発見した不具合で発火しない問題を直したい。

現行の文面は次のとおり。

> 実装、review、validation、ユーザー動作確認でfeedback・漏れ・追加要件・不具合を**直接受け取った**workflow ownerが、同じworking directoryでpluginの`facilitate-discussion`を適用する。

「直接受け取った」は feedback の**出所**による分類である。assistant が自分で見つけた不具合はこの条件節をすり抜ける。

### 調査による依頼内容の訂正

上記は依頼時点の理解であり、設計前調査で誤りと判明した。訂正内容は「調査で確定した事実」に記す。依頼の目的（自己発見の不具合でも`facilitate-discussion`が適用される状態にする）は変わらない。

---

## 1. TL;DR

`steering/SKILL.md` の `## 実装完了後review` 冒頭の一文が、適用範囲を定める列挙と、実行者を固定する句を同時に担っている。実行者を固定する「直接受け取った」が、適用範囲を絞るgateとして読める形になっており、自己発見の`漏れ`・`不具合`が対象外だと誤読された。二つの役割を書き分け、誤読の余地をなくす。

---

## 前提とする既存仕様

### `steering/SKILL.md` の `## 実装完了後review` 冒頭

現行の二文は次のとおり。

> 実装、review、validation、ユーザー動作確認でfeedback・漏れ・追加要件・不具合を直接受け取ったworkflow ownerが、同じworking directoryでpluginの`facilitate-discussion`を適用する。steeringが直接受け取った場合はsteering自身が行い、議論だけを別childへ再委譲しない。

一文目が三つの役割を同時に担っている。

| 役割 | 担っている部分 |
| --- | --- |
| 適用範囲（いつ） | 実装、review、validation、ユーザー動作確認で feedback・漏れ・追加要件・不具合 が出たとき |
| 実行者（誰が） | それを直接受け取った workflow owner |
| 実行内容（何を） | 同じworking directoryで`facilitate-discussion`を適用する |

二文目は実行者の固定を補強し、別childへの再委譲を禁じている。

### 「直接受領」の他の出現箇所

同じ語が四箇所にある。いずれも実行者を固定する文脈で使われ、適用範囲を絞る用法はない。

| file | 用法 |
| --- | --- |
| `steering/SKILL.md` の decision後 | 直接受領したworkflow ownerがcallerへdecisionを返す |
| `task-design/tasklist-design.md` | 直接受領したworkflow ownerが適用するtaskにする。特定caller名へ固定しない |
| `task-design/templates/tasklist.md` の2箇所 | 同上 |

「特定caller名へ固定しない」という併記が、この語の意図を示している。誰が受け取っても、受け取った当人が行う、という意味である。

### `facilitate-discussion` の起動gate

> 3. `task-design`、`steering` 等のconsumer skillが、保存を伴う議論workflowとして明示適用した。

consumerが適用すれば起動する。consumer側の適用判断が上流にあり、`facilitate-discussion`側は適用可否を再判定しない。

### `task-design/SKILL.md` の修正済みtrigger

release `7.2.0` で、discussion開始判定を既定でfail-openな形へ反転済みである。開始しない条件を閉じた集合として二つだけ列挙し、それ以外は判断せず開始する。

この修正は`task-design`のdesign phase内のdiscussionを対象としており、`steering`の実装完了後reviewは対象外である。

---

## 調査で確定した事実

### 既存ルールは今回のケースを覆っていた

適用範囲の列挙に `漏れ` と `不具合` が明記されている。今回の2件は次のとおりで、どちらも列挙に該当する。

| 発見内容 | 列挙のどれに当たるか |
| --- | --- |
| 設計時の影響範囲調査が誤っており参照元を1件見落とした | 漏れ |
| tasklistへ書いた実機検証タスクが実機のUIから到達不能だった | 不具合 |

したがって適用対象だった。ルールの不足ではない。

### 「直接受け取った」は実行者を固定する句である

二文目「steeringが直接受け取った場合はsteering自身が行い、議論だけを別childへ再委譲しない」と、他三箇所の「特定caller名へ固定しない」という併記から、この語の役割は実行者の固定であると確定する。適用可否のgateではない。

### 誤読の機序

一文が適用範囲と実行者を同時に担っているため、後置された「直接受け取った」が前段の列挙を絞り込む条件として読める。

「受け取る」は他者からの受領を含意する語であり、自己発見には自然に当てはまらない。この語感が「自分で見つけたものは受け取っていない、よって対象外」という読みを誘導する。

**ルールが足りないのではなく、一文が二つの役割を担い、片方がもう片方のgateとして読める。**

---

## 2. 要件（Requirements）

### MUST（必達）

- 適用範囲を定める記述と、実行者を固定する記述が、別の文として読める。
- 自己発見の`漏れ`・`不具合`が適用対象であることが、読み手の解釈に依存せず読める。

### SHOULD（できれば）

- 既存の四箇所で使われている「直接受領」の語法と矛盾しない。

### MAY（あれば嬉しい）

- なし。

### 非目標

- 新しいruleの追加。既存ルールは今回のケースを覆っており、重複を足すことは対症療法である。
- `facilitate-discussion` の起動gateの変更。consumer側の適用判断が上流にあり、今回の誤読はconsumer側で起きた。
- `task-design/SKILL.md` の修正済みtriggerの変更。release `7.2.0` で対応済みであり、対象phaseが異なる。
- `task-design/tasklist-design.md` と `templates/tasklist.md` の「直接受領」記述の変更。これらは実行者固定の文脈で単独に使われており、適用範囲と同居していない。
- 実装完了後reviewの三問、decision後の戻り先、`implementation_review.md` の責務境界の変更。

### 受け入れ基準

- 修正後の文面を初めて読む者が、自己発見の`漏れ`・`不具合`について適用要否を迷わない。
- 修正後の文面から、実行者を固定する意図（別childへ再委譲しない）が失われていない。
- `node scripts/verification/validate-plugin.mjs` が成功する。
- 追加・変更したfileに対する`migration.md`のセルフチェックgrepが、利用先固有情報を検出しない。

---

## 3. 完成後の姿

### documentation以外のfile deliverable

**対象と読者:**

| file | 主な読者 | 読後または利用後にできること |
| --- | --- | --- |
| `plugins/tumeda-dev/skills/steering/SKILL.md` の `## 実装完了後review` | steeringを実行するagent | 実装後に判明した事象について、`facilitate-discussion`を適用すべきかを、事象の出所によらず判断できる |

**完成後の内容と構造:**

`## 実装完了後review` の冒頭を二段落にする。一段落目が適用範囲と出所非依存、二段落目が実行者固定を担う。

```text
## 実装完了後review

実装、review、validation、ユーザー動作確認でfeedback・漏れ・追加要件・不具合が判明したら、
同じworking directoryでpluginの`facilitate-discussion`を適用する。
ユーザーから受け取ったものも、agent自身が見つけたものも同じ扱いにする。

適用するのは、それを直接受領したworkflow ownerである。
steeringが直接受領した場合はsteering自身が行い、議論だけを別childへ再委譲しない。
```

一文目の主語を`workflow owner`から事象へ移し、述語を`直接受け取った`から`判明したら`へ変えることで、適用範囲の文から実行者が抜ける。`判明した`は出所を含意しない。

`直接受領`は二段落目へ残す。`tasklist-design.md`と`templates/tasklist.md`の三箇所が同じ語を実行者固定の文脈で使っており、語法を揃える。

**記載する原則と例:**

- 適用範囲を定める記述と、実行者を固定する記述を同じ文へ同居させない
  - 今回の具体例: 「実装、review、validation、ユーザー動作確認で feedback・漏れ・追加要件・不具合 が出たとき」という適用範囲と、「直接受け取った workflow owner が行う」という実行者固定を、別の文にする
  - 意図に反する薄い記述: 「自己発見でも適用する」という一文を既存文へ足すだけ。既存文の二重の役割はそのまま残り、次に別の語感で同じ誤読が起きる

**配置・形式:**

- 配置: `plugins/tumeda-dev/skills/steering/SKILL.md` の `## 実装完了後review` 冒頭
- 形式: Markdown。既存の記述スタイルに合わせる
- 参照する既存pattern: `task-design/SKILL.md` の修正済みtrigger。適用範囲を先に確定し、判断材料にしない要素を明示する形をとっている
- 正本と重複防止: 実行者固定の語法は `tasklist-design.md` と `templates/tasklist.md` にも現れる。今回は`steering/SKILL.md`の当該箇所だけを変更し、他へ同じ説明を複製しない

---

## 4. リスクと対策

| リスク | 対策 |
| --- | --- |
| 書き分けた結果、実行者を固定する意図（別childへ再委譲しない）が弱まる | 受け入れ基準へ、実行者固定の意図が失われないことを含める |
| 「自己発見でも対象」と足すだけの対症療法になる | 完成後の姿の「意図に反する薄い記述」でこの形を禁じる |
| 他三箇所の「直接受領」と語法が食い違う | 非目標で他三箇所を対象外とし、実行者固定の文脈では同じ語を使い続ける |

---

## 5. テスト方針

- `node scripts/verification/validate-plugin.mjs` を実行する。
- 変更したfileへ`migration.md`のセルフチェックgrepを適用する。
- 修正後の文面を、今回の2件（影響範囲調査の漏れ、実行不能なtask）へ当てはめ、適用要否が一意に読めることを机上で確認する。
- validatorへassertionを追加しない。今回の変更は既存文の言い換えであり新しい契約を追加しない。検査したい対象は「適用範囲と実行者が別の文になっていること」という構造であり、固定文字列では表現できない。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

| 対象 | 反映内容 | validation結果 | 参照するdesign section |
| --- | --- | --- | --- |
| `plugins/tumeda-dev/skills/steering/SKILL.md` | `## 実装完了後review` 冒頭を二段落へ分離 | `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` | [documentation以外のfile deliverable](#documentation以外のfile-deliverable) |

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし
