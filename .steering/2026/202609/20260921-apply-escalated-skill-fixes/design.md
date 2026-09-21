# Design: 利用先から引き渡された skill 修正提案を適用する

## 元の依頼内容

利用先 repository での作業中に生じた、この plugin の skill への修正提案 5 件を扱う。`escalate-plugin-skill-fix` による引き渡しである。固有情報は `migration.md` の規約に従って除いてある。以降、提案元は「利用先 repository」「別の利用先 repository」と総称で呼ぶ。

### 提案1: 判断材料が揃う前に選択肢へ畳む誤りを防げるか

`facilitate-discussion` は「`提案N` はその回の問いを判断できる案にする」と定めるが、その案が「判断できる」かを何で確かめるかが書かれていない。形式は整っているが前提が誤っている提案は、形式の確認では検出できない。

利用先 repository での実例。ある論点のイテレーション1 で、事実を一つ見つけた時点で三案へ畳み、その三案が依拠する前提を疑わなかった。イテレーション2 で前提が誤りと判明し、結論が逆転した。ユーザーからの指摘は次。

> 何度も言ってるけど、決定だけ急がないで。決められる判断材料が揃って、ほぼどれを選ぶか自明になってから決めに入る。

既存の思考標準を確認済みで、盲点にあたる。`choosing_between_options.md` の主軸は「選べないのは、材料が枯れていない合図」で、これは assistant が選べないと感じたときに発火する。`presenting_options.md` の補助「選択肢に畳めたことは、議論が不要になったことを意味しない」は、畳めた後に記録を省くかどうかの話である。どちらも assistant が自信を持って提案を出すときには発火しない。今回の誤りはまさにその場面で起きた。

#### 併合する提案（別の利用先 repository で先に記録され、escalate されないまま保留されていたもの）

対象は `task-design` の section 5 Step 3「未解消の設計判断を解消する」。

Step 3 は「解消すると下位判断を最も多く確定できる不確実性を一つ選ぶ → 解消手段を選ぶ（discussion / 調査 / 技術検証実装）→ 実行する → 確定した decision を design へ反映する」の順序を持つ。

問題は、1 で「規定力が最大の不確実性」を選ばせた直後に、2 以降がすべて「解消する」前提で構成されている点にある。解消手段は三つとも解消のための手段であり、「まだ決めない」という分岐が構造上存在しない。結果として、規定力が最大＝影響が最大の判断を、根拠が揃っていない段階で確定させる方向へ働く。

入れるべきは、1 と 2 の間に置く「今が決める時期か」の判定である。判定基準は、根拠が揃って選択問題に落ちているかどうか。落ちていなければ確定させず、仮決定と再開条件を置いて前へ進み、根拠が集まってから戻る。

必要だと分かった具体例は 2 回連続で発生している。

一度目。作業場の全容がまだ見えていない段階で、成果物一件分のディレクトリ構造の完成形を 3 案提示し、選択を求めた。ディレクトリ構造は全要素を入れる器であり、規定力は最大に見える。Step 3 の「下位判断を最も多く規定する不確実性を一つ選ぶ」に忠実に従うほど、真っ先に選ばれる。しかし中身の全容が出ていない段階で器を確定させると、以降に出てくる要素が器へ収まる範囲まで縮む。ユーザーからは「今のこの決め方はキャップを決めている」と差し戻された。

二度目。工程の完了条件として 3 項目を提示し、決定を求めた。3 項目の正当化は「一巡目で実際に作られ、後工程へ引き継がれた」という既存成果物からの演繹であり、その工程に本来何が必要かという側からは導いていなかった。ユーザーからは「プロダクトアウトで演繹的に機能しているだけで、完全にこれでしっくりきているって感じじゃない」として仮決定へ格下げされた。

どちらも、規定力の大きい判断を先に扱ったこと自体は正しい。誤りは、扱うことと決めることを区別せず、そのまま確定させにいった点にある。

提案の根拠。不確実性の大きさは規定力の大きさと同義である。規定力が大きいほど、それが決まることによる制約が大きく、誤って確定させたときの被害も大きい。したがって、規定力が大きい判断ほど、確定の条件は厳しくなければならない。現在の Step 3 はこの関係を持たず、規定力の大きさを「先に決めるべき理由」としてのみ扱っている。

「先に扱う」と「先に決める」は別である。規定力の大きい不確実性を先に扱うのは正しい。ただし扱うとは、材料を集める、仮に置く、影響範囲を見るところまでを含み、必ずしも確定を意味しない。決めてよいのは、根拠が揃って「あとは選ぶだけ」の状態になったときに限る。

`task-design` には TBD を使って全体を先に見せる思想（section 3-2）があるが、これは初稿段階の作法として書かれている。Step 3 に入った後は解消一択となり、初稿段階で持っていた「未決のまま前へ進む」選択肢が失われる。3-2 の思想を Step 3 まで貫通させる必要がある。

ユーザーの原文。

> task-designがそう指示したとしても、決まっていない不確実性が高いものを決めることが先走って勝手に決めちゃうって悪手だよね。不確実性が大きいものはそれだけ影響力がでかく、それが決まることによる制約が大きいもの。決めるための根拠があってあとは選ぶだけっていう状況だったらいいけど、そうじゃないのに決める状態では不確実性が高いことについて扱うにあたって決めちゃいけない

関連して検討する余地があるもの。`facilitate-discussion` の `仮決定` と `再開条件` は、根拠が揃う前に前へ進むための道具として既に存在する。しかし `task-design` 側の Step 3 からは、この二つを使う判断へ接続していない。skill 間の接続として扱うか、`task-design` 単独の修正で足りるかは、この repository 側で判断する。

引き渡し後の後始末。別の利用先 repository にこの提案を保留していた file が残っている。引き渡し完了後、そちらへ「正本で扱う旨・正本側 steering directory の basename・提案要旨 1 行」だけを残す作業が必要になる。path は steering 側が保持している。

### 提案2: 提案自体の背景（調査結果・思考記録）の置き場が定義されていない

`facilitate-discussion` の `提案背景` の定義は二箇所にある。

- 新規論点（`2.2`）: 「最初の user input、finding、既存状態を必要な範囲で示し、提案0 が満たす必要のある条件と、提案0 のどの内容がそれを満たすかを書く」
- iteration（`2.3.1`）: 「直前の feedback から今回満たす必要が生じた条件と、新 proposal のどの内容がそれを満たすかを書く」

iteration 側は「直前の feedback から生じた条件」だけを指定している。結果、`提案背景` が「イテレーションが起きた背景」に縮退する。提案そのものの背景、すなわちなぜこの案へ至ったかの調査結果と思考記録は、置き場が定義されていないため `提案N` 側へ流れ込む。流れ込んだ提案は、選ぶべき案と、その案へ至った経緯が混ざり、判断対象が特定できなくなる。

加えて、イテレーションが起きた背景は `提案N-1へのフィードバック` が既に持っている。`提案背景` が同じことを書くと二重記録になる。

実例。ある論点の提案5 は、本体の大部分が調査結果だった（過去の実績から拾った 10 行の表、実績三件の列挙、それを束ね直した内訳）。一方、同じ iteration の `提案背景` は「提案4 から何を引き継ぎ、何を捨てるか」であり、イテレーションが起きた背景だけを書いていた。調査結果と思考記録が提案側に寄り、背景側にイテレーション背景しか無いという形がそのまま現れた。この提案5 は feedback で「提案の形を取っていない」と確定した。

> この提案5は何を書いてるの？ 提案なの？

想定する修正の方向。`提案背景` の定義へ、提案自体の背景（この案へ至った調査結果と思考記録）を含めることを明示する。イテレーションが起きた背景は `提案N-1へのフィードバック` が持つため `提案背景` へ重ねて書かない旨も併せて示す。

### 提案3: イテレーションの中身を `提案N` に固定している

`facilitate-discussion` は `イテレーションN` の中身を `提案N` に固定している。`2.2` と `2.3.1` のどちらも、iteration を追加する手順が「`提案N` へ今回の問いを判断できる案を書く」で始まる。

認識を合わせなければ提案を出せない段階でも、提案の形へ押し込むことになる。押し込まれた提案は、判断できる案ではないのに提案の体裁だけを備えるため、`2.3.1` の形式確認では検出できない。

ユーザーが示した形。基本は提案でイテレーションを回す。提案を出せない場合だけ、`提案N` の代わりに `認識合わせ` を置く。

```text
イテレーション0 - 提案0
イテレーション1 - 認識合わせ
イテレーション2 - 提案2
```

実例は提案2 と同じもの。あの提案5 は検証アクションの列挙と実績の報告であり、採否を選べる案ではなかった。末尾に置いた「この提案で判断してほしいこと」も「漏れがないか」「妥当か」という確認要求であり、選択肢になっていない。この段階で必要だったのは見方をユーザーと合わせることであり、案の採否ではなかった。`認識合わせ` を置ける形であれば、提案の体裁を取り繕う必要がなかった。

提案2 との関係。提案2 は「提案へ流れ込んだ調査結果を、背景側へ正しく置く」修正であり、提案は出せる前提に立つ。提案3 は「そもそも提案を出せない段階がある」ことを認める修正である。同じ具体例から導かれるが、片方を採ってもう片方を却下できるため、独立した decision として分ける。

### 提案4: PR・branch・issue・merge の対応をどう保つか

利用先 repository での実装中に、次の対応がすべて崩れた。

| 本来の対応 | 起きたこと |
| --- | --- |
| branch 1 本 = issue 1 件 | branch を merge した後、同じ名前で作り直した。同じ名前が前半の作業と後半の作業という別の文脈を指した |
| merge = branch の終了 = issue の終了 | 検証のための merge が PR body の `Closes` により issue を閉じた。その時点で後続の phase と動作確認が残っていた |
| PR 1 本 = issue 1 件 | 一つの issue に対して PR が 2 本、加えて検証用が 1 本 |

ユーザーの指摘。

> 大抵、マージはissueで1つであり、それはそのブランチの終了、issueの終了を意味する。だから、howでできるからといって乱立させたくない。同じ変数に文脈が変わるのに雑に値を入れるのと同じようなもの。今回みたいに検証したいことがmergeしないとできないのであれば、そのブランチを用意して作業するとかにしたい。mainにマージするって、これからは本番に自動で適用される大事な営みなんだよ

根本原因は「検証のために既定 branch へ merge する必要がある」場合の扱いが決まっていなかったこと。この repository では、既定 branch への push を契機に本番へ適用する CI を構築していた。merge 契機の検証には実際の merge が要る。そこで issue 完了の merge と同じ経路を使った。

もう一つは branch 名の再利用である。merge 後に「このままの branch で続けるか」を問われ、assistant は履歴の見え方（squash merge で commit が再掲される）だけを見て「既定 branch から同じ名前で切り直す」と提案した。branch 名が issue と一対一で対応し、その merge が branch と issue の終了を意味するという側を見ていなかった。

正しい形は同じ作業の後半で実証済み。検証用に別 branch を立て、`Closes` を持たせず issue への参照だけを書いた PR で検証を行い、issue 完了の PR とは分けた。この形が成立することは確認できている。最初からこれを採るべきだった。

skill へ入れる候補。

- 検証のために既定 branch へ merge が必要な場合、issue 完了の PR とは別の branch と PR を立てる。その PR は `Closes` を持たず issue への参照だけを書く
- merge 済みの branch 名を再利用しない
- これを `task-design` の plan 設計時に決めるか、`tasklist-executor` の実行時契約にするか、`steering` の orchestration に置くかは、この repository 側で判定する

既定 branch への merge が本番適用を走らせる契機になった repository では、この対応の崩れが直接事故へつながる。

### 提案5: 動作確認が自明でないとき、提案して合意する段が無い

tasklist の動作確認 section の DoD が次のような抽象的な記述のまま実行段階へ持ち越された。

> ユーザーが実際に変更して本番へ反映する経路を使い、意図どおりであることを確認した。

何をもって「確認した」と言えるかが決まっていない。実行の段になってユーザーから問われて初めて、assistant が選択肢を提示した。

> 動作確認って何をもってしたといえればいい？

このとき提示した三案のうち採用されたのはユーザー自身が出した案であり、assistant が出した二案はどちらも二つの適用経路を一周する発想に至っていなかった。

根本原因。動作確認の DoD が抽象的なまま tasklist へ載り、実行時まで具体化されなかった。`tasklist-design.md` が動作確認 task の書き方を持っているが、「確認の具体が自明でない場合にどうするか」が無い。結果として抽象的な DoD がそのまま残り、実行者が実行時に困る。

skill へ入れる候補。

- tasklist を作る時点で、動作確認の具体（何を変更し、何を観測できれば満たすか）を決める
- 設計時に決められない場合は、実行前に提案して合意する段を置くことを tasklist の task として明示する
- どちらを採るか、`task-design` の `tasklist-design.md` に置くか `tasklist-executor` の実行時契約に置くかは、この repository 側で判定する

### 補足: この escalate 自体で見つかった制約

`escalate-plugin-skill-fix` は「working directory を plugin repository へ移す。切り替えだけが、これから行う作業対象を `steering` へ伝える唯一の手段である」と定めているが、この session の shell は working directory を変更できない。そのため絶対 path を明示する形で代替している。これ自体が skill の前提の穴であり、扱うかどうかもこの設計で判断してよい。

---

## TL;DR

利用先 repository での実作業から、この plugin の skill が持つ穴が 5 件見つかった。いずれも「skill の記述が足りていたのに守らなかった」ではなく、**skill の記述自体に判断の段が無い**ことに起因する。放置すると同じ誤りが利用先を問わず再発し、特に提案4 は既定 branch への merge が本番適用を起こす repository で事故へ直結する。

5 件はそれぞれ別の問いを持つため、**一提案一 phase の composite** として扱う。終了時には、5 件それぞれについて所有する skill または docs が一つに決まり、対象 file へ反映され、同じ判断を複数の正本が持たない状態になる。

---

## 完成後の姿

この design は composite の親である。各 phase が成立させる具体的な完成後の姿は、対応する子 steering の design が所有する。ここでは phase 間で共有する owner 境界と、全 phase 完了時に成立する状態だけを扱う。

### skillの役割と方針

5 件の修正はいずれも、既存 skill へ「問いの段」を足すか、既存の段の定義を明確にするものである。skill の役割そのものを変える修正は含まない。

phase 間で共有する方針は一つある。**同じ判断を複数の正本が持たない。** 5 件のうち提案1 は `facilitate-discussion`・`task-design`・`think_standards` のいずれかへ置かれる可能性があり、提案4・5 は `task-design`・`tasklist-executor`・`steering` のいずれかへ置かれる可能性がある。どの phase も、自分が置く先を決めるときに、隣接する skill が同じ判断を持たないことを確認する。

この方針が要るのは、5 件が独立した phase として並行に進みうるためである。各 phase が自分の owner だけを見て決めると、二つの phase が同じ判断を別の file へ書く事故が起きる。`naming/core.md` の「表現が同じでも、名前空間が違えば別の意味を持つ」が扱うのは名前の衝突だが、ここで問題になるのは判断の重複であり、避け方が異なる。名前は名前空間が違えば共存してよいが、判断の正本は一つでなければならない。

### workflow

**phase 分割と依存:**

```text
proposal-background-scope ──> proposal-quality-gate ──> non-proposal-iteration

branch-pr-issue-correspondence   独立
verification-concreteness        独立
```

**ownerと責務:**

| owner | 判断・更新するもの | 行わないこと | single source of truth |
| --- | --- | --- | --- |
| この design（親 task-design） | phase の目的、scope、scope外、DoD、依存、親 DoD coverage | 各 phase の完成後の姿の具体化、対象 file の確定 | `roadmap.md` の構造 field |
| 各 phase の子 steering | その phase が扱う提案の owner 決定と、対象 file への反映 | 他 phase の owner 決定 | 各子 steering directory の `design.md` |
| steering（runtime） | 子 steering path、status、完了日 | 構造 field の変更 | `roadmap.md` の運用 field |

**依存結果の受け渡し:**

依存を持つ phase は、先行 phase の確定結果を `dependency_results` として受け取る。何を渡し、それで何を解消し、想定範囲外なら何を親へ戻すかは `roadmap.md` が持つ。

**全 phase 完了時に成立する状態:**

5 件それぞれについて、所有する skill または docs が一つに決まっている。同じ判断を複数の正本が持たない。各修正は利用先を問わず成立する汎用知識として書かれており、利用先 repository 固有の情報を含まない。

---

## 要件（Requirements）

### MUST（必達）

- 5 件それぞれについて、所有する skill または docs が一つに決まっている。同じ判断を複数の正本が持たない
- 各修正が、利用先を問わず成立する汎用知識として書かれている。利用先 repository 固有の情報（repository 名、絶対 path、issue・PR 番号、固有ドメイン名）を含まない
- 提案1 について、既存の `choosing_between_options.md` と `presenting_options.md` との関係が決まっている。重複した判断基準を二箇所に持たない
- 各 phase 完了時点で、その phase が触った skill が単独で利用可能な状態である。後続 phase がなければ成立しない記述を残さない

### SHOULD（できれば）

- 5 件の修正から導かれる version bump を一度にまとめ、宣言値 4 箇所と `expectedRelease` の計 5 箇所を同時に変える

### MAY（あれば嬉しい）

- この steering 自身で観測された「判断材料が揃う前に構造を確定させようとした」三件を、phase `proposal-quality-gate` の具体例として使う

### 非目標

- skill の役割そのものを変えない。5 件はいずれも既存 skill へ問いの段を足すか、既存の段の定義を明確にするものである
- `escalate-plugin-skill-fix` の working directory 制約は、この roadmap の phase に含めない。この escalate の実行中に見つかった別出自の課題であり、5 件とは扱いが異なる

### 受け入れ基準

- 全 phase の status が `完了` で、各 phase に完了日がある
- 引き渡し元の利用先 repository へ、正本で扱う旨・正本側 steering directory の basename・提案要旨 1 行が記載されている（提案1 の引き渡し後始末）
- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出力する

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 独立した phase が並行に進み、二つの phase が同じ判断を別の file へ書く | 「同じ判断を複数の正本が持たない」を phase 間で共有する方針として置き、各 phase の DoD へ隣接 skill の確認を含める |
| 5 件を個別に足した結果、skill が肥大化して読まれなくなる | 各 phase の子 design で「既存記述で足りないか」を先に確認する |
| 提案1 を `think_standards` へ置くと、既存の二つの file と判断基準が重複する | phase `proposal-quality-gate` の DoD に、既存 file との関係確定を含める |
| 依存を持つ phase が、先行 phase の想定範囲外の結果を受け取る | `roadmap.md` へ、想定範囲外だった場合に親 roadmap へ戻る条件を phase ごとに明記する |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs` を実行し、`plugin validation passed` を確認する。version 宣言値 4 箇所と `expectedRelease` の一致を検査する
- この repository は自動 test framework を持たないため、skill 本文の内容は人の review で担保する
- 各 phase の子 steering が `document-review` skill を md の emit 前ゲートとして適用する

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md`: `2.2` で新規論点の `提案背景` を「最初の user input、finding、既存状態を必要な範囲で示し、提案0 が満たす必要のある条件と、提案0 のどの内容がそれを満たすかを書く」と定める。`2.3.1` で iteration の `提案背景` を「直前の feedback から今回満たす必要が生じた条件と、新 proposal のどの内容がそれを満たすかを書く」と定める。どちらも iteration の中身を `提案N` に固定している。`仮決定` と `再開条件` を任意 field として持つ
- `plugins/tumeda-dev/skills/task-design/SKILL.md`: section 5 Step 3 が「不確実性を一つ選ぶ → 解消手段を選ぶ → 実行する → design へ反映する」の順序を持ち、解消手段は discussion・調査・技術検証実装の三つに限る。section 3-2 が TBD で全体を先に見せる思想を持つが、初稿段階の作法として書かれている
- `plugins/tumeda-dev/docs/think_standards/choosing_between_options.md`: 主軸は「選べないのは、材料が枯れていない合図」。二案のどちらも捨てられないと感じた時点を検知の合図とし、和集合を取ることを禁じる
- `plugins/tumeda-dev/docs/think_standards/presenting_options.md`: 主軸は `a/b/c` または `1/2/3` の形式。補助として「選択肢に畳めたことは、議論が不要になったことを意味しない」を持ち、畳めた論点ほど記録価値が高いことを述べる
- `plugins/tumeda-dev/skills/steering/SKILL.md`: 「tasklist 内のユーザー動作確認が完了する前に commit、push、PR を行う」ことを禁止事項に持つ。`branch_from_basename` で steering directory の basename と同名の branch を作る
- `plugins/tumeda-dev/skills/task-design/roadmap-design.md`: roadmap の構造 field は task-design、運用 field は steering が所有する。依存結果で決まる内容を構造 TBD として残さず、`dependency_results` と子 design 制約へ変換する。各 phase 完了時点で成果物が正常に利用できる状態を保つ
- `.agents/skills/tumeda-dev-plugin-context.md`: この repository は Branch / issue 契約を持たない。branch 名は steering directory の basename に揃える。PR 作成 script は `scripts/for_local/github/create_or_get_pr.sh`。自動 test framework を持たず、検証は `node scripts/verification/validate-plugin.mjs` だけである
- version bump: 配布 version は SemVer の `MAJOR.MINOR.PATCH` だけを使う。MINOR と PATCH の境界は「consumer が新たに呼べるものが増えたか」。bump は宣言値 4 箇所と `expectedRelease` 1 箇所の計 5 箇所を一度に変える

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

なし。

### task-design内の対象成果物反映待ち

なし。

### execution plan対象

| 対象 | 掲載理由 | 参照するdesign section |
| --- | --- | --- |
| `roadmap.md` の 5 phase | 各 phase が独立した子 design loop を必要とする composite である。子 steering が依存順に実行する | [workflow](#workflow) |
