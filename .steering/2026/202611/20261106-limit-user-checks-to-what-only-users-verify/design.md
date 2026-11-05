# Design: 利用者の確認の task に、利用者にしか確かめられないものだけを入れる

## 元の依頼内容

escalate-plugin-skill-fix からの引き渡し（利用先 repository 固有の情報は除去済み）:

1. 提案の内容（assistant が書いた案。中身は未合意として扱い、設計で改めて合意を取る）
   - `task-design/tasklist-design.md` の「commit・push・PRより前にユーザー動作確認を必須にする」に、利用者の確認の task に入れるものの境界を足す。入れるのは、利用者にしか確かめられないもの（画面を触った感触、利用者の端末での見え方、利用者に届く email など）だけにする。assistant が実行・照合できる確認（command の exit code やログ、差分と design の照合）は、DoD と品質 check の task に入れ、executor が自分で行う。
   - commit の前に利用者が触れるものが無い作業（本番へ入れて初めて利用者に結果が見える変更など）では、commit・push の前に利用者の確認の task を置かない。利用者の確認は、利用者が触れるものが初めて現れる phase に置く。
   - tasklist の自己 review の gate に、「この利用者の確認の task に、assistant が自分で確かめられるものしか入っていないか」を足す。
   - 関係する今の契約: `tasklist-design.md` の「自動testとscreenshotは機械的確認であり、ユーザーが実際に触る動作確認を代替しない。commit・push・PRより前にユーザー動作確認を必須にする。」、`tasklist-executor/SKILL.md` の「ユーザー動作確認がtasklistにある時は`user_confirmation_required`で停止し、確認前にcommit・pushへ進まない」。
   - 変えないもの: 確認環境へ載せる commit・push を確認の前に許す例外と、利用者が触れるものがある時は確認の後に commit・push・PR をする順序（前回の取り込みの決定）。作業の外へ残る action を含む phase で止まる規則。

2. 必要だと分かった具体例（一般化済み）
   - 利用先 repository で、本番の基盤（定期実行の job と通知の経路）を作る作業の tasklist が、品質 check の後に「動作確認」の phase を置き、三つの確認を利用者の task にした。ローカルで入口が理由を出して非 0 で終わること、build した image の中で同じ command が非 0 で終わり version のログが出ること、基盤の定義の差分が design のとおりであること、である。
   - この時点では本番の resource が無く、画面も変わらず、利用者が触れるものは無かった。task 自身も「ローカルで確かめられることに限る」と書いていた。三つとも assistant が実行・照合できた。
   - assistant が利用者に確認を頼んで commit の前で止まり、利用者が「え、ここは動作確認必要なの？ 進められる範囲まで進めていいんじゃないの？（デジャブか？全く同じことを1つ前のissueのブランチで言った気がする）」と問うた。executor が三つを確かめ、commit・push まで進めた。
   - 一つ前の作業でも、tasklist が phase ごとに利用者の確認を置き、利用者が「つど確認必要？最後まで終わってでいいんじゃない？」と問うた。その時の引き渡しで plugin が取り込んだのは、確認環境のための commit・push の例外だけだった（steering `20261031-adopt-escalated-commit-practice-improvements` の論点2・3）。

3. 提案の根拠
   - 利用者が確かめる必要の無い待ちが、二つの作業で続けて起きた。一度目の取り込みでは確認の順序だけが扱われ、その時点で利用者の確認が要るかは問われなかった。
   - 規則は plugin の skill にある。利用先の context file だけを変えると skill と食い違う。
   - 他の場面への当てはめ（assistant の見立て）: 画面を変える作業では、利用者が触れるものが commit の前にあるため今の契約のまま。文書だけを変える作業では、利用者が触れるものは無く、利用者の目は PR の review で入る。画面の無い API の変更では、assistant が request を送って確かめられる。

4. 利用者が合意した範囲
   - 引き渡すことと時期には合意済み。原文: 「2:a」（assistant の問い「今回の原因を plugin へ渡すか。a) 渡す（推奨）。今の plugin の作業を commit してから、別の作業として始める。…b) 渡さず、今回だけの扱いにする」への回答）。
   - 提案の中身・根拠・他の場面への当てはめは assistant が書いたもので、中身への合意は取れていない。利用者の原文で確かめられるのは、上の具体例で引用した二つの発言だけ。

補足: 前回の作業 `20261101-keep-document-content-within-file-scope` の `artifacts/skill-update-review.md` で、task-design の本文の全体を読まずに「次に task-design を直す作業で全体を見る」と記録した。この作業の skill-update-review で task-design の全体を読む。

---

## TL;DR

tasklist の設計の規則は、commit・push・PR の前に利用者の確認を必ず置く。その時点で利用者が確かめるものがあるかは問わない。そのため、利用者が触れるものが無い作業でも、assistant が自分で確かめられる確認が利用者の task になり、executor がそこで止まって利用者を待たせる。この待ちが、二つの作業で続けて起きた。

この作業で、利用者の確認の task に入れるものと、その task を置く場所の規則を tasklist の設計に足す（TBD: 規則の境界と、前回の決定「commit・push・PR より前にユーザー動作確認を必須にする」との関係）。executor と steering の停止の契約を、その規則に合わせる（TBD: 変える箇所）。終了時には、tasklist の利用者の確認の task は利用者にしか確かめられないものだけを持ち、executor はそれ以外の確認を自分で行って先へ進む。

---

## 完成後の姿

### workflow

**ownerと責務:**

| owner | 判断・更新するもの | 行わないこと | single source of truth |
| --- | --- | --- | --- |
| task-design（`tasklist-design.md`） | TBD: 利用者の確認の task に入れるもの、置く phase、置かない場合の判定 | 実行時に確認を省くかを判断する | `tasklist.md` |
| tasklist-executor | TBD: 利用者の確認の task で止まる契約と、それ以外の確認を自分で行う契約 | 利用者の確認の task を自分で完了にする | `tasklist.md` の checkbox |
| steering | TBD: dispatch の時に、利用者の確認より前の commit・push・PR を止める契約 | tasklist の確認の置き方を再設計する | `tasklist.md` |

**状態と遷移:** TBD: 規則の境界が決まった後に描く（利用者が触れるものがある作業と無い作業で、確認・commit・push の順序がどう分かれるか）

**必須順序とhandoff:** TBD: 同上

**失敗・取消・再開:** TBD: 利用者の確認の task が無い tasklist で、executor が完了を返した後の steering の扱い

### documentation以外のfile deliverable

TBD: 変更する file と位置。候補は次のとおり。

- `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の「実装後feedbackと公開action」の規則の文と、自己レビューgate の「commit・push・PRより前にユーザー動作確認があるか」
- `plugins/tumeda-dev/skills/task-design/templates/tasklist.md` の「動作確認」の phase と「完了後のaction」の ⚠️
- `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` の「停止・再開」と「実行手順」の 11（最後に必ず利用者へ動作確認を促す）
- `plugins/tumeda-dev/skills/steering/SKILL.md` の 6-1 と「このskillが絶対にやらないこと」
- `scripts/verification/validate-plugin.mjs` の、確認の順序を検査する assertion

---

## 要件（Requirements）

### MUST（必達）

- 成果物（skill、docs、steering の作業記録）に、利用先 repository 固有の情報を書かない。
- 変更した skill の契約の文を、`scripts/verification/validate-plugin.mjs` の assertion で検査する。
- 配布 version を PATCH で一度だけ上げる（宣言値 4 箇所と `expectedRelease`）。
- 変更した skill に、編集後の skill-update-review を当てる。task-design は本文の全体を読む。
- TBD: 規則の要件

### SHOULD（できれば）

- なし

### MAY（あれば嬉しい）

- なし

### 非目標

- TBD: 前回の決定（確認環境のための commit・push の例外と、利用者が触れるものがある時の順序）のうち、変えないもの

### 受け入れ基準

- `node scripts/verification/validate-plugin.mjs` が `plugin validation passed` を出す。
- 起点以外の具体 case 二つ以上に規則を当て、意図した tasklist の形（利用者の確認の task の有無と位置）に落ちることを design に書ける。
- TBD: 規則の観測基準

---

## リスクと対策

| リスク | 対策 |
| --- | --- |
| 「assistant が確かめられる」を広く取り、利用者が触って初めて分かるもの（操作の感触、端末での見え方）まで機械的な確認で済ませる | TBD: 利用者にしか確かめられないものの判定の仕方 |
| 利用者の確認が無い作業で、確かめていない変更が公開される | TBD: 確認が無い作業での公開の前の扱い |

---

## テスト方針

- `node scripts/verification/validate-plugin.mjs` に、追加・変更した契約の文の assertion を足して通す。
- 起点以外の具体 case への当てはめを design の検証として書く。

---

## （付録）前提とする既存仕様

- `plugins/tumeda-dev/skills/task-design/tasklist-design.md` の「実装後feedbackと公開action」: 「自動testとscreenshotは機械的確認であり、ユーザーが実際に触る動作確認を代替しない。commit・push・PRより前にユーザー動作確認を必須にする。」例外として、context file の `UI確認環境` が確認環境へ載せるのに commit・push が要ると定めている場合、その commit・push は確認の前に行ってよい。確認の前に確認環境のための commit があれば、確認で直したところは追加の commit にする。
- 同 file の自己レビューgate: 「commit・push・PRより前にユーザー動作確認があるか（確認環境へ載せるために`UI確認環境`が定めるcommit・pushを除く）: 自動test・screenshotをユーザー確認の代替にしていないか。」失敗例は「機械的確認を『動作確認済み』と読み替え、tasklist-executorがそのままcommit・pushまで進む。」
- `plugins/tumeda-dev/skills/task-design/templates/tasklist.md` の「動作確認」: DoD は「Tasks に挙げた確認をユーザーが行い、期待どおりであることを確認した」。task は確認環境へ載せること、ユーザーに動作確認を依頼すること、feedback の扱い。「完了後のaction」の ⚠️ は、確認環境のための commit・push を除き、動作確認 phase が完了するまで commit・push・PR を促したり実行したりしない。
- `plugins/tumeda-dev/skills/tasklist-executor/SKILL.md` の「停止・再開」: 「ユーザー動作確認がtasklistにある時は`user_confirmation_required`で停止し、確認前にcommit・pushへ進まない（確認環境へ載せるために`UI確認環境`が定めるcommit・pushを除く）」。「実行手順」の 11 は、最後に「ユーザーに動作確認を促す（『動作を確認していただけますか？』と伝えるのみ。次の行動は促さない）」。
- steering `20261031-adopt-escalated-commit-practice-improvements` の論点2・3 の決定: 今の契約（commit・push・PR より前にユーザー動作確認を必須にする）は変えず、確認環境のための commit・push の例外だけを足した。phase ごとに確認の前に commit する形は、利用者の「review環境で確認するとか必然性があるコミットを許可してるだけなのに」により採らなかった。

---

## （付録）変更の実行区分

### task-design内で対象成果物へ適用済み

なし

### task-design内の対象成果物反映待ち

なし

### execution plan対象

なし

### 分類保留（設計中のみ）

| 変更候補 | 保留理由 | 分類を確定するdecision |
| --- | --- | --- |
| 利用者の確認の task に入れるものと置く場所の規則 | 規則の境界と、前回の決定との関係が未決 | 規則の境界 |
| executor と steering の停止の契約 | 規則の境界が未決 | 規則の境界、変える箇所 |
| `scripts/verification/validate-plugin.mjs` の assertion と version | 検査する文が未決 | 上の二つ |
