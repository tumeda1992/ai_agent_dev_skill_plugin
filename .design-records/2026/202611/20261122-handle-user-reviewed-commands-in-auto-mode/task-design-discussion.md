# 議論記録

## skill-update-review の結果（2026-11-22）

対象: `plugins/tumeda-dev/skills/task-design/SKILL.md`（Step 4「確認の担当と手段」）と `plugins/tumeda-dev/skills/steering/SKILL.md`（6-1「leafを実行する」）。

- 構造案の採用前（論点2 の決定の時）: 新しい工程・file を足さず、既存の節の箇条書きに項目を足す構造案。候補なし。足す項目は、既存の Step 4 の判断（確認の手段が今の環境で使えるか）と、既存の 6-1 の判断（tasklist-executor へ渡すもの）の中に収まり、独立した判断・状態・完了条件を持たない。
- 編集後（論点4 の反映の後）: 候補なし。実物でも、足した項目は既存の節の箇条書きの一項目であり、別の内部指示へ分ける理由になる工程は生まれていない。

## 論点1: 合意した command が止められずに進むための規則を、どの手段に寄せるか

**ステータス:** 決定

**種別:** 認識齟齬

### イテレーション0（論点1）: 検証していない手段（`!`）を規則として固定した誤りを直す

#### 起点

design の骨格（TBD 込み）を chat で示した時、合意済みの規則として「実行環境に止められたら、利用者に `!` で実行してもらう」を載せた。利用者の応答（2026-11-22、原文）:

> ！付きで実行するってなんでフィックスなの？今回もそれで解決してないし、提案されたのはaskで、実際はask無しでも実行できたのに

#### 提案0（論点1）

規則の目的を、利用者の原文のとおり「合意した command が、意図しない止められ方をせずに先へ進むこと」に置き直す。手段は、確かめられた範囲のものだけを書く。`!` も ask の rule も、固定の手段として書かない。

書く規則:

- 利用者の確かめは、実行許可の画面に当てない。確かめが要る command（取り返しのつかない操作等）は、実行する形のまま chat または tasklist で示し、利用者の明示の合意を得る。
  - 実行許可の画面は、permission mode によって出ない。例えば Claude Code の auto mode では、既定で出ない。
- 合意した command を実行する時は、利用者の合意を、実行する agent へそのまま渡す。subagent に任せる時も同じである。
  - 渡すものは、利用者の合意の原文と、合意した command の一覧である。
  - 実行環境は、利用者の意図を判断に使うことがある。例えば Claude Code の auto mode の分類器は、破壊的な操作の既定の制止を、利用者の意図で解く。
  - 利用者がまだ与えていない承認を、事実として書かない。「利用者が実行許可の画面で見る」のように、まだ起きていない確かめを書かない。
- それでも実行環境に止められたら、迂回せず停止し、利用者へ返す（今の「実行環境 gate」のとおり）。止められた command と、止めた理由（実行環境が示したもの）を示し、どう進めるかを利用者と決める。

書かないもの:

- `permissions.ask` の rule と `!` を、止められた時の固定の手段として書かない。どちらも、この作業で効くと確かめていない。

#### 検討記録（論点1・イテレーション0）

##### 利用者の指摘を確かめた

指摘のとおりである。`!` で利用者に実行してもらう手段は、利用先の作業で一度も試していない。利用先の実装後 review（論点1）で、assistant が「確実な経路」として提案に入れた。利用者はその提案に「ok」と答えた。ただし同じ応答で「askつけるかはhowの話だから、こっちとしては合意したコマンドが、変に止められず先に進められればいいよ」と述べていた。assistant はこの応答を、`!` を含む手段まで合意したと読み、plugin 側の design に「合意済みの規則」として写した。手段は未確定のまま、目的だけが合意されていた。

##### 実際に何が起きたかを確かめ直した

利用先の作業の、旧い deploy の資材を消す phase の実行記録から、次のことが分かっている。

| 実行 | その時の状況 | 結果 |
| --- | --- | --- |
| 1 回目の executor | ask の rule は無い。executor への指示に、利用者の承認についての記述は無い | 削除の command が分類器に止められた（「Destructive or Unwanted Actions」） |
| 2 回目の executor | ask の rule を足した。会話に利用者の承認（「本当はaでやりたい」「autoモードの上でね」「足していいよ」）がある。executor への指示に「利用者が 1 つずつ見て通す」と書いた | 削除・取り外しの 12 件が、実行許可の画面を経ずに分類器の許可で通った |

2 回目では、ask の rule は画面を出さなかった。ask の rule を足したことが通った理由かどうかは、確かめられない。

docs（code.claude.com の auto-mode-config、2026-11-22 に確認）には、分類器の制止のうち soft_deny について「User intent and allow exceptions can override these.」とある。破壊的な操作の制止は、利用者の意図で解かれうる。

2 回目に通った理由として、確かめた事実と最も合うのは、次の読みである。利用者の承認と、assistant の指示文が、分類器に利用者の意図として読まれた。

ただし、指示文の「利用者が 1 つずつ見て通す」は、起きていない確かめを書いたものだった。実際には、利用者は画面を受けていない。正しい形は、利用者が実際に与えた合意（原文と、合意した command）を渡すことである。

##### `!` を固定の手段から外す理由

- この作業で試しておらず、効くと確かめていない。
- 利用者の目的は「合意した command が止められずに進む」ことである。利用者自身に command を打たせる手段は、この目的を満たすが、利用者の手間を増やす。最初の手段として固定する根拠が無い。

##### 再発防止

assistant は、確かめていない手段を、目的の合意と一緒に規則として固定した。`think_standards/making_and_choosing_options.md` の「この提案が依拠する前提は確定しているか」で防げる種類の誤りであり、標準は既にある。今回は適用の誤りであり、新しい標準は足さない。

#### 提案0へのフィードバック（論点1）

**結果:** 合意

> ok

### 決定（論点1）

規則の目的は「合意した command が、意図しない止められ方をせずに先へ進むこと」である。手段は、確かめられた範囲のものだけを書く。

- 利用者の確かめは、実行許可の画面に当てない。確かめが要る command は、実行する形のまま chat または tasklist で示し、利用者の明示の合意を得る。実行許可の画面は permission mode によって出ない（例: Claude Code の auto mode では既定で出ない）。
- 合意した command を実行する時は、利用者の合意の原文と、合意した command の一覧を、実行する agent（subagent を含む）へそのまま渡す。実行環境は利用者の意図を判断に使うことがある（例: Claude Code の auto mode の分類器は、破壊的な操作の既定の制止を利用者の意図で解く）。利用者がまだ与えていない承認や、まだ起きていない確かめを、事実として書かない。
- それでも実行環境に止められたら、迂回せず停止し、利用者へ返す。止められた command と、実行環境が示した止めた理由を示し、どう進めるかを利用者と決める。
- `permissions.ask` の rule と `!` を、止められた時の固定の手段として書かない。どちらも効くと確かめていない。

## 論点2: 規則を書く場所

**ステータス:** 決定

**種別:** TBDヒアリング

### イテレーション0（論点2）: 既存の「実行環境 gate」に足す

#### 提案0（論点2）

新しい文書は作らず、`plugins/tumeda-dev/skills/runtime-execution-contracts.md` の「実行環境gate」に、論点1 の決定の規則を足す。

- 規則は、host に依存しない言葉で書く（実行許可の画面、実行環境、実行する agent）。
- Claude Code に固有のこと（auto mode では画面が既定で出ない、分類器は利用者の意図で既定の制止を解く）は、「例えば」で例として添える。手順としては書かない。
- `plugins/tumeda-dev/skills/README.md` の共有リファレンスの一行（runtime-execution-contracts.md の説明）に、利用者の確かめを実行許可の画面に当てないことを足す。

#### 検討記録（論点2・イテレーション0）

##### 新設の前提が崩れた

利用者の原文は「aiへの指示固有のドキュメント（あればそれ、無ければ新設）」である。利用先の実装後 review では、assistant が `plugins/tumeda-dev/docs/` の配下だけを探し、該当なしとして新設を提案した。plugin 側で `plugins/tumeda-dev/skills/` の直下の共有リファレンスも探すと、`runtime-execution-contracts.md` が見つかった。

##### 既存の文書の範囲に入るかを確かめた

`naming/core.md` の「中身を足す前に、名前が約束する範囲に入るかを確かめる」で、三つを照合した。

- 名前: `runtime-execution-contracts`（実行時の契約）。
- 入口の説明: 冒頭は「command を実行しうる任意の skill が共通して従う、実行時一般の契約」を対象の一つとする。skills の README の一行も「command を実行しうる任意の skill が従う実行時一般の契約（実行環境に止められたら迂回せず停止する）」である。
- 既に入っている中身: 「実行環境gate」は「agent が command を実行してよいと task level で判定したことは、実行環境がその command を通すことを意味しない」「止められたら迂回せず停止し、利用者へ返す」を持つ。

論点1 の規則は、task level の合意（利用者の確かめ）と実行環境（実行許可の画面、分類器）の関係を扱う。「実行環境gate」の続きであり、範囲に入る。

##### Claude Code に固有の部分の扱い

skills の README は、この file を「host 非依存の共通ドキュメント」として載せる。「実行環境gate」は「特定の実行基盤に依存する手順はこのfileへ書かない」とする。論点1 の規則は、host に依存しない言葉で書ける（実行許可の画面が permission mode によって出ないこと、実行する agent へ合意を渡すこと、止められたら返すこと）。Claude Code の auto mode は、規則が必要になる理由の例として添える。同じ共有リファレンスの `runtime-model-profiles.md` も、host に依存しない規則に、Claude Code と Codex の対応を添える形をとっている。

##### 候補を比べた

| 候補 | 採らない・採る理由 |
| --- | --- |
| Claude Code に固有の文書を新設する | 採らない。利用者の原文は「あればそれ」であり、範囲に入る既存の文書がある。新設すると、実行環境に止められた時の規則が二つの文書に分かれる |
| `docs/` の配下に新しい群を作る | 採らない。一つの規則のために群を作ることになる（`docs/README.md` は「一つのfileで足りる主題は、新しい群を作らず既存群へ置く」とする）。command を実行する skill が参照する契約は、skills の共有リファレンスにある |
| 「実行環境gate」に足す（提案0） | 採る。名前・入口の説明・既存の中身の範囲に入り、止められた時の規則が一か所にまとまる |

#### 提案0へのフィードバック（論点2）

**結果:** 修正要求（理由の誤りの指摘と、置き場の前提への疑問）

> 「新設すると、止められた時の規則が二つの文書に分かれる。」内省して。これでいいと思ってる？ あと、runtime-xx系多くない？ なんかfaciliate-disscussionに限定した記述もあるし、skillsにあるべきか悩むところもある

提案0 の選択理由と、置き場に選んだ file の位置づけの両方が問われた。

### イテレーション1（論点2）: 規則を中身の性質で分け、それぞれが効く場所に置く

#### 提案1（論点2）

`runtime-execution-contracts.md` には足さない。四つの規則は、いつ・誰が使うかが違うため、一か所にまとめず、それぞれが効く場所に置く。

| 規則 | 使う場面 | 置き場 |
| --- | --- | --- |
| 利用者の確かめを実行許可の画面に当てず、chat または tasklist で合意を得る | design で、確認の担当と手段を決める時 | `task-design/SKILL.md` の Step 4「確認の担当と手段」に、判断の問いとやってしまいがちな失敗（利用先の具体例）を足す |
| 合意した command を実行する agent へ、利用者の合意の原文と合意した command の一覧をそのまま渡し、まだ起きていない承認を書かない | steering が tasklist-executor へ実行を渡す時 | `steering/SKILL.md` の 6-1「leafを実行する」に足す |
| それでも止められたら、迂回せず停止して利用者へ返す | 実行中に止められた時 | 既に `runtime-execution-contracts.md` の「実行環境gate」にある。変えない |
| ask の rule と `!` を固定の手段にしない | — | 書かない（書かないことを規則として書く必要は無い） |

Claude Code に固有の事実（auto mode では実行許可の画面が既定で出ない、分類器は利用者の意図で既定の制止を解く）は、上の二か所で、規則が必要な理由の例として添える。

`runtime-*` の共有リファレンスの置き方（数、中身の混ざり方、skills の下に置くべきか）は、この論点とは別の判断として、論点3 で扱う。提案1 は `runtime-*` の file に何も足さないため、論点3 の結論に依らない。

#### 検討記録（論点2・イテレーション1）

##### 提案0 の理由を内省した

提案0 の「新設すると、止められた時の規則が二つの文書に分かれる」は誤りだった。

- 論点1 の四つの規則のうち、止められた時の規則は「迂回せず停止し、利用者へ返す」の一つだけである。これは既に「実行環境gate」にあり、新設してもそこから動かない。二つに分かれる規則は無かった。
- 残りの規則は、利用者の確かめをどの経路で得るか（design の時）と、合意をどう渡すか（実行を任せる時）の規則であり、止められた時の規則ではない。
- assistant は、置き場を先に決め、規則を「task level の合意と実行環境の関係」という一般的な言葉で言い直してから、範囲に入ると照合した。`naming/core.md` の「照合の前に、足したい先の範囲に入るよう、中身を実際より一般的な言葉で言い直す」という失敗そのものである。元の中身のまま照合すれば、二つの規則は「実行環境gate」の範囲（止められた時にどうするか）に入らない。
- 置き場に選んだ file の位置づけ（skills の下の共有リファレンスとして妥当か）も確かめていなかった。

##### 規則ごとに、効く場所を確かめた

- 利用者の確かめの経路: 利用先の作業で誤ったのは design の時である。design の「作業の流れ」に「利用者は各 command を tool の実行の許可で確かめる」と書いた。`task-design/SKILL.md` の Step 4「確認の担当と手段」は「その手段が今の環境で使えるか」を既に問うが、実行許可の画面がその問いに掛からなかった。ここに判断の問いと失敗例を足せば、design の時に掛かる。
- 合意の渡し方: 利用先の作業で誤ったのは、steering が tasklist-executor へ実行を渡す時である。指示文に「利用者が 1 つずつ見て通す」と、まだ起きていない確かめを書いた。`steering/SKILL.md` の 6-1 は、tasklist-executor へ渡す内容と守らせることを並べる節であり、ここに足せば渡す時に掛かる。

##### `runtime-*` の file の事実

- `runtime-execution-contracts.md`（118 行）: tasklist-executor が visual-inspector・test-runner へ child を委ねる時の契約と、command を実行しうる skill の実行時一般の契約の、二つの対象を持つ。steering、tasklist-executor、visual-inspector、test-runner、`documentation_standards/referent_explicitness.md` から参照される。
- `runtime-feedback-review.md`（44 行）: steering または tasklist-executor が実装の feedback を受けた時に、`facilitate-discussion` を `implementation_review.md` へ適用する手順。steering、tasklist-executor、`development_standards/development_flow/work_scope.md` から参照される。skills の README の共有リファレンスの一覧に載っていない。
- `runtime-model-profiles.md`（46 行）: 推論強度の profile と、Claude Code・Codex の model への対応。visual-inspector、test-runner、tasklist-executor、exhaustive-review から参照される。

`runtime-` という接頭辞は、実行時の契約、feedback の処理の手順、model の対応という性質の違う中身をまとめている。

#### 提案1へのフィードバック（論点2）

**結果:** 合意

> ok

### 決定（論点2）

論点1 の規則を、中身の性質ごとに、使う場面で効く場所へ置く。`runtime-*` の file には足さない。

- 利用者の確かめを実行許可の画面に当てず、chat または tasklist で合意を得る: `task-design/SKILL.md` の Step 4「確認の担当と手段」に、判断の問いとやってしまいがちな失敗を足す。
- 実行する agent へ、利用者の合意の原文と合意した command の一覧をそのまま渡し、まだ起きていない承認を書かない: `steering/SKILL.md` の 6-1「leafを実行する」に足す。
- 止められたら迂回せず停止して利用者へ返す: 既に `runtime-execution-contracts.md` の「実行環境gate」にあり、変えない。
- ask の rule と `!` は書かない。
- Claude Code に固有の事実は、上の二か所で、規則が必要な理由の例として添える。

## 論点3: `runtime-*` の共有リファレンスの置き方の見直しを、この作業で扱うか

**ステータス:** 決定

**種別:** レビュー指摘

### イテレーション0（論点3）: 見直しは切り出し、一覧の漏れだけを拾う

#### 提案0（論点3）

`work_scope.md` の二段の判定に当てる。

- 一段目: 目的の外である。この作業の目的は、合意した command が意図しない止められ方をせずに進むための規則であり、論点2 の決定で `runtime-*` の file には何も足さない。見直しの結論がどちらでも、この作業の完成後の姿は変わらない。
- 二段目: 置き方の見直しは切り出す。一覧の漏れの一行だけを拾う。

切り出すもの: `skills/` 直下の共有リファレンス（`runtime-execution-contracts.md`、`runtime-feedback-review.md`、`runtime-model-profiles.md`、`task-design-work-handoff-contracts.md`）の置き方の見直し。切り出し先として、plugin repository に issue を作る。

- 題: 「skills 直下の共有リファレンス（runtime-* 等）の分け方と置き場を見直す」
- 本文: 次の事実と問いを書く。
  - 事実: `runtime-` の接頭辞が、性質の違う三つの中身（実行時の契約、feedback の処理の手順、model の対応）をまとめている。`runtime-execution-contracts.md` は二つの対象を持つ。`runtime-feedback-review.md` は `facilitate-discussion` を使う手順で、skills の README の一覧に載っていない。
  - 問い: skills の下に置くべきか、docs の群に置くべきか、どう分けるか。
- 今やらない理由: 対象が 4 file、参照元が 6 つの skill と docs の 2 file、validator にまたがり、置き場と分け方の設計が要る。この作業に含めると大きく、単体で revert できる単位でもなくなる。

拾うもの: `plugins/tumeda-dev/skills/README.md` の「共有リファレンス（skill ではない）」の一覧に、`runtime-feedback-review.md` の一行を足す。一覧の漏れを直す一行であり、この作業の review・revert の単位を崩さない。見直しで置き場が変わる時は、その作業がこの一行も直す。

#### 検討記録（論点3・イテレーション0）

##### 起点

利用者の原文（論点2 への応答の後半）:

> あと、runtime-xx系多くない？ なんかfaciliate-disscussionに限定した記述もあるし、skillsにあるべきか悩むところもある

##### 事実

論点2 のイテレーション1 の検討記録「`runtime-*` の file の事実」を参照する。加えて、skills の README は共有リファレンスを「直下に置く、skill 本文から参照される host 非依存の共通ドキュメントと script」と説明し、一覧に `runtime-execution-contracts.md`、`runtime-model-profiles.md`、`task-design-work-handoff-contracts.md`、`tumeda-dev-plugin-context.md`、`scripts/github/create_or_get_pr.sh` を載せる。`runtime-feedback-review.md` は載っていない。

##### 拾うか切り出すかを比べた

| 候補 | 採らない・採る理由 |
| --- | --- |
| 見直し全体を今の作業で拾う | 採らない。置き場（skills の下か docs か）と分け方の設計が要り、4 file・8 か所の参照・validator を動かす。今の作業の review・revert の単位が崩れる |
| 見直しも一覧の漏れも、すべて切り出す | 採らない。一覧の漏れの一行は小さく、今の作業の単位を崩さない。切り出すと、その場でしか気付けない不備を後回しにする |
| 見直しは切り出し、一覧の漏れだけを拾う（提案0） | 採る |

#### 提案0へのフィードバック（論点3）

**結果:** 合意。切り出し先をこの作業の直後に扱うよう指示があった

> あー、まぁそれでいっか

（issue を作った直後の追加の指示）

> ただ、直後にこのissue扱ってね

### 決定（論点3）

`skills/` 直下の共有リファレンスの分け方と置き場の見直しは、この作業から切り出し、plugin repository の issue #26（「skills 直下の共有リファレンス（runtime-* 等）の分け方と置き場を見直す」）にした。利用者の指示により、この作業を終えた直後に扱う。この作業では、`plugins/tumeda-dev/skills/README.md` の共有リファレンスの一覧に `runtime-feedback-review.md` の一行を足す（一覧の漏れ）だけを拾う。

## 論点4: 論点1〜3 の決定を、skill の文へ書き込む変更

**ステータス:** 反映済み

**種別:** TBDヒアリング

### イテレーション0（論点4）: 二つの skill に足す文と、付随する変更

#### 提案0（論点4）

##### `plugins/tumeda-dev/skills/task-design/SKILL.md`（Step 4「確認の担当と手段」）

判断基準の前に、二項目を足す。

```diff
     - やってしまいがちな失敗: 確認の項目を「何を見るか」だけで合意し、誰が何で見るかをtasklist設計で初めて問う。具体例: …（既存）
+    - 実行環境の実行許可の画面（agentがtoolを実行する前に利用者へ出す確認）を、利用者が確かめる手段にしない。画面が出るかはpermission modeで変わる。例えば、Claude Codeのauto modeでは画面は既定で出ず、分類器がcommandを通すか止めるかを決める。利用者が見てから通すべきcommand（取り返しのつかない操作等）は、実行する形のままchatまたはtasklistで示し、利用者の明示の合意を得ることを手段にする
+    - やってしまいがちな失敗: 基盤を作る作業のdesignで、一度だけ行う操作の確かめを「利用者は各commandをtoolの実行の許可で確かめる」とした。sessionはauto modeで、Terraformのapply、secretsの登録、旧いdeployの仕組みの削除が、画面を経ずに分類器の許可で走った。結果はdesignどおりだったが、利用者はcommandを見ていなかった
     - 判断基準: …（既存）
```

##### `plugins/tumeda-dev/skills/steering/SKILL.md`（6-1「leafを実行する」）

箇条書きの最後に一項目を足す。

```diff
 - tasklist内のユーザー動作確認が完了する前にcommit、push、PRへ進ませない（…既存）。
+- 利用者が合意したcommand（tasklistで合意した取り返しのつかない操作等）をtasklist-executorに実行させる時は、利用者の合意の原文と、合意したcommandの一覧をそのまま渡す。実行環境は利用者の意図を判断に使うことがある。例えば、Claude Codeのauto modeの分類器は、破壊的な操作の既定の制止を利用者の意図で解く。利用者がまだ与えていない承認や、「利用者が実行許可の画面で見る」のようなまだ起きていない確かめを、指示に事実として書かない。それでも実行環境に止められた時の扱いは`runtime-execution-contracts.md`の「実行環境gate」に従う。
```

##### `plugins/tumeda-dev/skills/README.md`（共有リファレンスの一覧）

`runtime-execution-contracts.md` の行の後に一行を足す（論点3 で拾う一覧の漏れ）。

```diff
+- **runtime-feedback-review.md** — steering または tasklist-executor が実装・review・validation・利用者確認の feedback を直接受けた時に、`facilitate-discussion` を `implementation_review.md` へ適用し、decision の戻り先を選ぶ手順。
```

##### `scripts/verification/validate-plugin.mjs`

- `requireText`: task-design の「実行環境の実行許可の画面（agentがtoolを実行する前に利用者へ出す確認）を、利用者が確かめる手段にしない。」、steering の「利用者がまだ与えていない承認や、「利用者が実行許可の画面で見る」のようなまだ起きていない確かめを、指示に事実として書かない。」、skills の README の「**runtime-feedback-review.md**」。

##### release version

`main` の今の版（9.1.3）から PATCH を一つ上げる（既存 skill の内容の修正と README の一行。consumer が新たに呼べるものは増えない）。

#### 検討記録（論点4・イテレーション0）

##### 書き込む場所を確かめた

- task-design の Step 4「確認の担当と手段」は、判定の問い、手段が使えない時、やってしまいがちな失敗（form の読み仮名の例）、判断基準の四項目を持つ。実行許可の画面は「手段」の一つであり、「その手段が今の環境で使えるか」の具体として足せる。既存の失敗例は「誰が何で見るかを後で問う」失敗で、今回の失敗（手段を決めたが、その手段が実際には働かなかった）とは別の型のため、失敗例をもう一つ足す。
- steering の 6-1 は、tasklist-executor へ渡すものと守らせることを箇条書きで持つ。今回の誤りは、steering が tasklist-executor へ渡す指示文で起きたため、ここに足す。止められた後の扱いは「実行環境gate」が持つため、参照だけにする。
- 失敗例は、利用先固有の情報（repository 名、account の値、resource の実名）を除いた形で書く。

##### 決定との対応

| 決定 | 書き込む場所 |
| --- | --- |
| 論点1・論点2: 利用者の確かめを実行許可の画面に当てない | task-design の Step 4 |
| 論点1・論点2: 合意の原文と command の一覧を渡し、まだ起きていない承認を書かない | steering の 6-1 |
| 論点1・論点2: 止められたら迂回せず返す | 変えない（steering の 6-1 から参照） |
| 論点3: 一覧の漏れを拾う | skills の README |

#### 提案0へのフィードバック（論点4）

**結果:** 合意

> ok

### 決定（論点4）

提案0 の変更（task-design の Step 4 への二項目、steering の 6-1 への一項目、skills の README の一行、validator の assertion、release version の PATCH）をそのまま書き込む。反映と validation の結果は design の付録「設計中に反映を終えた変更」が持つ。
