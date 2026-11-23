# entry templateの移行対応

## この記録の範囲と状態

旧entry templateの保存形と制御を分離し、論点18の保存形および論点19–22の二層保存への移行を追跡する。
対象は revision `a6e24853800fcb75eb6a7bdd91479a633f740d4a` の `plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md` 全109行である。
移行方向は、旧templateから同名fileの十の保存形、および同skillの三実行fileへの移動である。

これはentryを対象とするledgerである。SKILL.md・metadata・表示patternの対応と逆引き、境界照合は [migration-verification.md](migration-verification.md) から辿る。productionは変更していない。
下表はprototype本文への順方向照合を保存したもの。103の元IDを保持し、理由と禁止等が同居する11行は [独立contract監査](function-migration-audit.json) の114単位へ分けた。
末尾提案を上部へ重複しない理由付き禁止、scope・owner移動の具体例を保持している。順方向の充足は実行検証の完了を意味しない。
構造の存在、意味の保存、行の逆引きが実際に確認されるまで、件数や行coverageから移行完了を導かない。

## destinationの読み方

各略記は次のfile・章を指す。照合した実物は [prototype](../faciliate-discussion/README.md) 配下であり、productionは未変更である。個別行のverificationから移管先の具体的な節へ辿る。

| destination略記 | file・章 |
| --- | --- |
| template / 名前 | `templates/discussion_entry.md` の同名見出し |
| handler / 全体規則 | `SKILL.md` の `workflow全体で守る不変条件` |
| handler / 論点選択 | `SKILL.md` の `対象論点を選ぶ` |
| handler / 現在state | `SKILL.md` の `選択した論点を進める` 内の仮決定・再開条件・decision確定 |
| handler / 返却 | `SKILL.md` の `返却前に記録を同期する` |
| iteration / 作成中 | `iteration.md` の `作成中の回と検討記録を用意する` |
| iteration / 材料確認 | `iteration.md` の `判断材料を確かめ、検討記録を育てる` |
| iteration / 提示 | `iteration.md` の `提案または認識合わせを形にする` |
| iteration / 保存 | `iteration.md` の `保存した回を提示可能にする` |
| iteration / 応答 | `iteration.md` の `既存提示への応答を扱う` |

`record-recovery.md` は実在する証拠から同じ保存形を使うconsumerであり、旧template固有の規則を二重所有しない。
保存形を使う前の全文読取、必要なblockだけの適用、番号と旧形式への投影は論点13・15・16の合意による。

## 構造ledger

source欄は上記baseline fileの連続行範囲である。空行・comment delimiterも直前または直後のblockに含む。
複数分類の行は、下の意味単位で保存形と制御を分離する。MOVEは論点15によるowner移動であり、能力の廃止ではない。
保存形は十部品の該当code block、制御は下のcontract ledgerの移管先で確認した。構造間の実行境界は全体監査の別gateに残す。

| ID | source | structural role・relation | destination | classification・合意 |
| --- | --- | --- | --- | --- |
| E-S01 | 1–6 | 新規entry前のscope gate | handler / 論点選択 | MOVE |
| E-S02 | 7–15 | 論点metadata、親参照、top-level省略 | template / 論点metadata、handler / 論点選択 | ADAPT・CHANGE（論点11・12・16）、MOVE |
| E-S03 | 16–25 | 初回、保存・応答順、既存深度 | iteration / 作成中・保存・応答、handler / 全体規則 | MOVE・CHANGE（論点6・9・12） |
| E-S04 | 26–31 | 回見出し→提案見出し→本文 | template / 回の骨子・提案本文、iteration / 提示 | ADAPT・CHANGE（論点9・12・16）、MOVE |
| E-S05 | 32–47 | 本文構成とpattern選択 | iteration / 提示 | MOVE |
| E-S06 | 48–53 | 背景、初回／修正／外部evidence | template / 回の骨子、iteration / 材料確認 | CHANGE（論点6・7・9）、MOVE |
| E-S07 | 54–55 | 対応する空feedback見出し | template / 空の提案応答欄 | CHANGE（論点12）、ADAPT（論点16） |
| E-S08 | 56–69 | 空欄→結果・原文・評価、語彙強度 | template / 受領応答の本文、iteration / 応答・保存 | ADAPT（論点16）、MOVE |
| E-S09 | 70–76 | 履歴不変、再開、独立decision | handler / 全体規則・論点選択・現在state、iteration / 応答・提示 | MOVE |
| E-S10 | 77–86 | 条件付き仮決定と現在stateの更新 | template / 仮決定、handler / 現在state | CHANGE（論点12）、ADAPT（論点16）、MOVE |
| E-S11 | 87–96 | 条件付き再開条件、成立後の接続 | template / 再開条件、handler / 現在state、iteration / 作成中 | CHANGE（論点12）、ADAPT（論点16）、MOVE |
| E-S12 | 97–100 | 合意後の現在decision | template / 決定、handler / 現在state | CHANGE（論点12）、ADAPT（論点16）、MOVE |
| E-S13 | 101–109 | 最終結論、具体表現同期、次焦点・handoff | handler / 現在state・返却 | MOVE |

## contract ledger

以下は原文から抽出した照合位置の索引である。同じsource行から複数のIDが生じる。
一つのIDに理由と禁止等が残る場合の独立した下位unitは、上記監査JSONを参照する。
`MOVE` の合意は論点15、十部品への `ADAPT` は論点16を共通根拠とする。意味変更の合意は行ごとに示す。
verification欄は原文の条件・禁止・理由・例を移管先本文と照合した結果を示す。部品の存在だけでなく使用条件・前後順序を実行側へ対応させた。

| ID | source | kind・保存する意味 | destination | classification・合意 | verification |
| --- | --- | --- | --- | --- | --- |
| E-C001 | 3 | 判断質問: 結論が目的または指定parentの決定・実装範囲を変えるか | handler / 論点選択 | MOVE | 順方向照合済み: [SKILL.md:219–243](../faciliate-discussion/SKILL.md#scopeと親子関係) |
| E-C002 | 4 | 禁止: 範囲を変えないdecisionをactiveにしない | handler / 論点選択 | MOVE | 順方向照合済み: [SKILL.md:219–243](../faciliate-discussion/SKILL.md#scopeと親子関係) |
| E-C003 | 5 | 禁止: 独立decisionを枝label付き同一論点へ置かない | handler / 論点選択 | MOVE | 順方向照合済み: [SKILL.md:219–243](../faciliate-discussion/SKILL.md#scopeと親子関係) |
| E-C004 | 5 | action: 独立decisionへ次の連番の別論点を作る | handler / 論点選択 | MOVE | 順方向照合済み: [SKILL.md:219–243](../faciliate-discussion/SKILL.md#scopeと親子関係) |
| E-C005 | 5,11 | 関係: childから親を参照する | template / 論点metadata、handler / 論点選択 | ADAPT | 順方向照合済み: [SKILL.md:219–243](../faciliate-discussion/SKILL.md#scopeと親子関係) |
| E-C006 | 5 | state: 未決childがある親を子論点待ちにする | handler / 論点選択 | MOVE | 順方向照合済み: [SKILL.md:219–243](../faciliate-discussion/SKILL.md#scopeと親子関係) |
| E-C007 | 7 | 形式: canonical h2、論点番号、判断タイトル | template / 論点metadata | ADAPT | 順方向照合済み: [templates/discussion_entry.md:4–15](../faciliate-discussion/templates/discussion_entry.md#論点metadata)、[iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する) |
| E-C008 | 9 | state: 作成中・提示後・子待ち・決定・保留・分解済みを示す | template / 論点metadata、handler / 現在state | CHANGE（論点11: 提案中→応答待ち） | 順方向照合済み: [templates/discussion_entry.md:4–15](../faciliate-discussion/templates/discussion_entry.md#論点metadata)、[iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する) |
| E-C009 | 12 | 例外: top-levelでは親fieldを省略する | iteration / 作成中 | MOVE | 順方向照合済み: [templates/discussion_entry.md:4–15](../faciliate-discussion/templates/discussion_entry.md#論点metadata)、[iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する) |
| E-C010 | 14 | 形式: 種別はTBDヒアリング・認識齟齬・レビュー指摘、複数可 | template / 論点metadata | ADAPT | 順方向照合済み: [templates/discussion_entry.md:4–15](../faciliate-discussion/templates/discussion_entry.md#論点metadata)、[iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する) |
| E-C011 | 17 | default: 最初の回は0 | iteration / 作成中 | MOVE | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する) |
| E-C012 | 18 | 順序: 提示前に本文・背景・空応答を保存する | iteration / 保存 | CHANGE（論点6・9: 作成中から検討記録）、CHANGE（論点19・21・22: 二層分離と保存境界） | 順方向照合済み: [iteration.md:140–154](../faciliate-discussion/iteration.md#保存した回を提示可能にする) |
| E-C013 | 18,57 | 禁止: 未回答等の可視placeholderを空応答へ書かない | iteration / 保存 | MOVE | 順方向照合済み: [iteration.md:140–154](../faciliate-discussion/iteration.md#保存した回を提示可能にする) |
| E-C014 | 18 | 禁止: feedbackを推測しない | iteration / 保存 | MOVE | 順方向照合済み: [iteration.md:140–154](../faciliate-discussion/iteration.md#保存した回を提示可能にする) |
| E-C015 | 19,71 | 履歴: feedback確定時に元の提案と背景を変えない | handler / 全体規則、iteration / 応答 | MOVE | 順方向照合済み: [iteration.md:181–188](../faciliate-discussion/iteration.md#原文と結果を一度保存する) |
| E-C016 | 19,71 | action: 対応するfeedbackを一度だけ確定する | iteration / 応答 | MOVE | 順方向照合済み: [iteration.md:181–188](../faciliate-discussion/iteration.md#原文と結果を一度保存する) |
| E-C017 | 19,61,67 | 出力: 結果はその回が分かる短い自由語彙 | template / 受領応答の本文、iteration / 応答 | ADAPT・MOVE | 順方向照合済み: [iteration.md:181–188](../faciliate-discussion/iteration.md#原文と結果を一度保存する) |
| E-C018 | 19 | 分岐: 受諾はdecision確定へ返す | iteration / 応答 | MOVE | 順方向照合済み: [iteration.md:189–194](../faciliate-discussion/iteration.md#応答から次の行き先へ進む) |
| E-C019 | 19 | 分岐: 同じdecisionの修正は番号を増やし末尾へ追加 | iteration / 応答 | MOVE | 順方向照合済み: [iteration.md:189–194](../faciliate-discussion/iteration.md#応答から次の行き先へ進む) |
| E-C020 | 19 | 分岐: 別decisionは論点選択へ戻す | iteration / 応答 | MOVE | 順方向照合済み: [iteration.md:189–194](../faciliate-discussion/iteration.md#応答から次の行き先へ進む) |
| E-C021 | 20 | 理由・禁止: 末尾の未決提案が対象なので上部へ重複しない | handler / 全体規則 | MOVE | 順方向照合済み: [SKILL.md:85–103](../faciliate-discussion/SKILL.md#workflow全体で守る不変条件) |
| E-C022 | 22 | 形式: 新規fileの見出し階層を使う | template / 各保存形、iteration / 作成中 | CHANGE（論点12: 所属suffix） | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[SKILL.md:85–103](../faciliate-discussion/SKILL.md#workflow全体で守る不変条件) |
| E-C023 | 23 | 適応: 既存entryの可視構造・読み順を維持する | iteration / 作成中 | MOVE | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[SKILL.md:85–103](../faciliate-discussion/SKILL.md#workflow全体で守る不変条件) |
| E-C024 | 23 | 適応: 兄弟の深度へsubtree全体を同段数移す | iteration / 作成中 | MOVE | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[SKILL.md:85–103](../faciliate-discussion/SKILL.md#workflow全体で守る不変条件) |
| E-C025 | 23 | 禁止: 既存履歴の見出しを一括変換しない | handler / 全体規則 | MOVE | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[SKILL.md:85–103](../faciliate-discussion/SKILL.md#workflow全体で守る不変条件) |
| E-C026 | 26 | 形式: 回番号と今回の内容を示す見出し | template / 回の骨子 | CHANGE（論点10・12: 共通番号・所属） | 順方向照合済み: [templates/discussion_entry.md:16–27](../faciliate-discussion/templates/discussion_entry.md#回の骨子) |
| E-C027 | 28 | 形式: 回と同じ番号の提案見出し | template / 提案本文 | CHANGE（論点12: 所属） | 順方向照合済み: [templates/discussion_entry.md:28–35](../faciliate-discussion/templates/discussion_entry.md#提案本文) |
| E-C028 | 30 | 出力: 今回の問いを判断できる案 | template / 提案本文、iteration / 提示 | ADAPT・MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C029 | 30 | 制限: 既決内容は今回の判断に必要な範囲だけ示す | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C030 | 30 | 禁止: 完全性のためだけに再掲しない | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C031 | 30 | 条件: 完全状態が判断対象なら完全版を示す | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C032 | 33 | 順序: pattern選択前に問いへ何を示すか考える | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C033 | 33 | 参照: catalogを読み、必要なら組み合わせる | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C034 | 33 | 合成: 複数案は選択肢wrapperを使い内部へ別patternを置ける | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C035 | 33 | fallback: 未該当ならcatalogへ押し込まず内容から構成 | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C036 | 35 | 方針: 本文の構成は内容から決める | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C037 | 36 | 例: 独立説明は保存構造・読み取り範囲・fallback等の固有見出し | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C038 | 37 | 条件: 短く同格な要素だけを箇条書きにする | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C039 | 38 | 禁止: 総論／各論／ルール／適用例や箇条書きを固定しない | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C040 | 39 | 禁止: 抽象と具体を疑似箇条書きへ平坦化しない | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C041 | 39 | action: 意味関係が読める段落・固有見出し・表を選ぶ | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C042 | 41 | 条件: 配置・周辺・非作成fileが判断対象なら限定treeを示す | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C043 | 41 | 順序: 新documentはoutline合意→実file作成→実物review | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C044 | 41 | 禁止: 新document全文を作成前discussionへ複製しない | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C045 | 43 | 条件: 局所変更が一つの読めるdiffに収まればlocal-diffを使う | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C046 | 43 | 禁止: 変更hunk内を省略しない | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C047 | 43 | 制限: 変更しない残部は再掲しない | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C048 | 45 | 条件: 不可分な複数file・対応・hunkはfile-change-set | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C049 | 45 | 出力: 対象を漏れなく列挙しbefore→after対応を示す | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C050 | 45 | 出力: 許可・維持・削除・scope外・完了状態を閉じる | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C051 | 45 | 自由度: 対応単位はpath・責務・contract・保持意味から選ぶ | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C052 | 45 | 自由度: 対象内部はtree・置換・diff・対比・outline・flow等を使い分ける | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C053 | 45 | 禁止: 内部の表示方式を一律に揃えない | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C054 | 45 | 禁止: 独立して採否を変えられる変更を一集合にしない | handler / 論点選択、iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする) |
| E-C055 | 48 | 形式: 背景の保存領域 | template / 回の骨子 | CHANGE（論点6・9・12: 検討記録・随時保存・所属）、CHANGE（論点19・21・22: 二層分離と保存境界） | 順方向照合済み: [templates/discussion_entry.md:16–27](../faciliate-discussion/templates/discussion_entry.md#回の骨子)、[iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[iteration.md:140–154](../faciliate-discussion/iteration.md#保存した回を提示可能にする) |
| E-C056 | 50 | 意味: 必要条件と案が満たす内容の対応を記録する | iteration / 材料確認 | ADAPT（論点19・21・22: 過程は内部log、判断背景はdiscussionへ再構成。元の必要条件・訂正・限界は両者に保持） | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[iteration.md:61–98](../faciliate-discussion/iteration.md#判断材料を確かめ、検討記録を育てる)、[iteration.md:140–154](../faciliate-discussion/iteration.md#保存した回を提示可能にする) |
| E-C057 | 50 | 初回: user input・finding・既存状態から必要条件を導く | iteration / 材料確認 | ADAPT（論点19・21・22: 過程は内部log、判断背景はdiscussionへ再構成。元の必要条件・訂正・限界は両者に保持） | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[iteration.md:61–98](../faciliate-discussion/iteration.md#判断材料を確かめ、検討記録を育てる)、[iteration.md:140–154](../faciliate-discussion/iteration.md#保存した回を提示可能にする) |
| E-C058 | 50 | 継続: 直前feedbackと今回の調査から条件・findingの整理を記録 | iteration / 材料確認 | ADAPT（論点19・21・22: 過程は内部log、判断背景はdiscussionへ再構成。元の必要条件・訂正・限界は両者に保持） | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[iteration.md:61–98](../faciliate-discussion/iteration.md#判断材料を確かめ、検討記録を育てる)、[iteration.md:140–154](../faciliate-discussion/iteration.md#保存した回を提示可能にする) |
| E-C059 | 50 | 訂正: 診断・scopeが変わった時、維持・置換・拡張を区別する | iteration / 材料確認 | ADAPT（論点19・21・22: 過程は内部log、判断背景はdiscussionへ再構成。元の必要条件・訂正・限界は両者に保持） | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[iteration.md:61–98](../faciliate-discussion/iteration.md#判断材料を確かめ、検討記録を育てる)、[iteration.md:140–154](../faciliate-discussion/iteration.md#保存した回を提示可能にする) |
| E-C060 | 50 | 理由・禁止: 原文と評価は前の回がownerなので複製しない | handler / 全体規則、iteration / 材料確認 | ADAPT（論点19・21・22: 過程は内部log、判断背景はdiscussionへ再構成。元の必要条件・訂正・限界は両者に保持） | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[iteration.md:61–98](../faciliate-discussion/iteration.md#判断材料を確かめ、検討記録を育てる)、[iteration.md:140–154](../faciliate-discussion/iteration.md#保存した回を提示可能にする) |
| E-C061 | 52 | 再開: evidence・無効な判断・置換条件を読み分ける | iteration / 作成中・材料確認 | ADAPT（論点19・21・22: 過程は内部log、判断背景はdiscussionへ再構成。元の必要条件・訂正・限界は両者に保持） | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[iteration.md:61–98](../faciliate-discussion/iteration.md#判断材料を確かめ、検討記録を育てる)、[iteration.md:140–154](../faciliate-discussion/iteration.md#保存した回を提示可能にする) |
| E-C062 | 52 | 禁止: 再開用のlabelを全iterationの固定fieldにしない | iteration / 材料確認 | ADAPT（論点19・21・22: 過程は内部log、判断背景はdiscussionへ再構成。元の必要条件・訂正・限界は両者に保持） | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[iteration.md:61–98](../faciliate-discussion/iteration.md#判断材料を確かめ、検討記録を育てる)、[iteration.md:140–154](../faciliate-discussion/iteration.md#保存した回を提示可能にする) |
| E-C063 | 54 | 形式: 対応する提案へのfeedback見出し | template / 空の提案応答欄 | CHANGE（論点12: 所属） | 順方向照合済み: [templates/discussion_entry.md:36–41](../faciliate-discussion/templates/discussion_entry.md#空の提案応答欄) |
| E-C064 | 59,61–65 | 順序・形: 応答受領後、結果→必要な原文→補足を空欄へ入れる | template / 受領応答の本文、iteration / 応答 | ADAPT・MOVE | 順方向照合済み: [templates/discussion_entry.md:56–65](../faciliate-discussion/templates/discussion_entry.md#受領応答の本文)、[iteration.md:181–188](../faciliate-discussion/iteration.md#原文と結果を一度保存する) |
| E-C065 | 63 | 原文: user feedback・reviewを必要範囲で改変せず示す | template / 受領応答の本文、iteration / 応答 | ADAPT・MOVE | 順方向照合済み: [templates/discussion_entry.md:56–65](../faciliate-discussion/templates/discussion_entry.md#受領応答の本文)、[iteration.md:181–188](../faciliate-discussion/iteration.md#原文と結果を一度保存する) |
| E-C066 | 65 | 条件: 原文だけで不足する時、受諾・不成立の範囲を補う | iteration / 応答 | MOVE | 順方向照合済み: [templates/discussion_entry.md:56–65](../faciliate-discussion/templates/discussion_entry.md#受領応答の本文)、[iteration.md:181–188](../faciliate-discussion/iteration.md#原文と結果を一度保存する) |
| E-C067 | 67 | 強度: 原因診断への影響を単なる修正要求へ丸めない | iteration / 応答 | MOVE | 順方向照合済み: [templates/discussion_entry.md:56–65](../faciliate-discussion/templates/discussion_entry.md#受領応答の本文)、[iteration.md:181–188](../faciliate-discussion/iteration.md#原文と結果を一度保存する) |
| E-C068 | 67 | 出力: 診断を維持するか遡るかを分かる結果にする | iteration / 応答 | MOVE | 順方向照合済み: [templates/discussion_entry.md:56–65](../faciliate-discussion/templates/discussion_entry.md#受領応答の本文)、[iteration.md:181–188](../faciliate-discussion/iteration.md#原文と結果を一度保存する) |
| E-C069 | 71 | 禁止: 過去iterationを変更・削除・圧縮要約しない | handler / 全体規則 | MOVE | 順方向照合済み: [templates/discussion_entry.md:56–65](../faciliate-discussion/templates/discussion_entry.md#受領応答の本文)、[iteration.md:181–188](../faciliate-discussion/iteration.md#原文と結果を一度保存する) |
| E-C070 | 71 | 禁止: 決定済み提案への再feedbackで元の評価を上書きしない | iteration / 応答 | MOVE | 順方向照合済み: [templates/discussion_entry.md:56–65](../faciliate-discussion/templates/discussion_entry.md#受領応答の本文)、[iteration.md:181–188](../faciliate-discussion/iteration.md#原文と結果を一度保存する) |
| E-C071 | 72 | routing: 既決decision変更のfeedback・evidenceは新しい回へ接続 | handler / 論点選択、iteration / 作成中 | MOVE | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[SKILL.md:244–260](../faciliate-discussion/SKILL.md#eventから所属を選ぶ) |
| E-C072 | 72 | state: 旧履歴を保ちactiveへ戻す | handler / 現在state | MOVE | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[SKILL.md:244–260](../faciliate-discussion/SKILL.md#eventから所属を選ぶ) |
| E-C073 | 72 | state: 旧decisionを現在結論の表示から外す | handler / 現在state | MOVE | 順方向照合済み: [iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する)、[SKILL.md:244–260](../faciliate-discussion/SKILL.md#eventから所属を選ぶ) |
| E-C074 | 74 | routing: 独立したscope・owner変更は別論点 | handler / 論点選択 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする)、[SKILL.md:219–243](../faciliate-discussion/SKILL.md#scopeと親子関係) |
| E-C075 | 74 | 例・表示: 同decisionの移動前後・owner境界はflow・tree・表・散文から選ぶ | iteration / 提示 | MOVE | 順方向照合済み: [iteration.md:99–139](../faciliate-discussion/iteration.md#提案または認識合わせを形にする)、[SKILL.md:219–243](../faciliate-discussion/SKILL.md#scopeと親子関係) |
| E-C076 | 78 | 条件・位置: 理解を助ける時だけ仮決定を最新回の後へ置く | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:66–73](../faciliate-discussion/templates/discussion_entry.md#仮決定)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[SKILL.md:312–320](../faciliate-discussion/SKILL.md#合意したdecisionを確定する) |
| E-C077 | 80,82 | 出力: 自己完結した現在の仮判断 | template / 仮決定 | CHANGE（論点12: 所属）、ADAPT | 順方向照合済み: [templates/discussion_entry.md:66–73](../faciliate-discussion/templates/discussion_entry.md#仮決定)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[SKILL.md:312–320](../faciliate-discussion/SKILL.md#合意したdecisionを確定する) |
| E-C078 | 82 | 条件: 足跡が役立つ場合だけ典拠回を添える | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:66–73](../faciliate-discussion/templates/discussion_entry.md#仮決定)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[SKILL.md:312–320](../faciliate-discussion/SKILL.md#合意したdecisionを確定する) |
| E-C079 | 84 | 禁止: 仮決定を固定sectionにせず部分判断を機械加算しない | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:66–73](../faciliate-discussion/templates/discussion_entry.md#仮決定)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[SKILL.md:312–320](../faciliate-discussion/SKILL.md#合意したdecisionを確定する) |
| E-C080 | 84 | 更新: 無効な仮判断は外し履歴は過去回に保つ | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:66–73](../faciliate-discussion/templates/discussion_entry.md#仮決定)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[SKILL.md:312–320](../faciliate-discussion/SKILL.md#合意したdecisionを確定する) |
| E-C081 | 84 | 順序: 最終合意時に仮決定を外しdecisionへ書く | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:66–73](../faciliate-discussion/templates/discussion_entry.md#仮決定)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[SKILL.md:312–320](../faciliate-discussion/SKILL.md#合意したdecisionを確定する) |
| E-C082 | 88 | 条件: 同じ未決decisionが外部event等で停止し、entryだけで理由・戻り先が不足 | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:74–81](../faciliate-discussion/templates/discussion_entry.md#再開条件)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する) |
| E-C083 | 88 | 位置: 再開条件は最新回の直後 | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:74–81](../faciliate-discussion/templates/discussion_entry.md#再開条件)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する) |
| E-C084 | 90,92 | 出力: 不足・解消event/evidence/action・戻る未決判断 | template / 再開条件 | CHANGE（論点12: 所属）、ADAPT | 順方向照合済み: [templates/discussion_entry.md:74–81](../faciliate-discussion/templates/discussion_entry.md#再開条件)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する) |
| E-C085 | 92 | 自由度: 固定小fieldにせず内容に合う文章・短い列挙・表を選ぶ | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:74–81](../faciliate-discussion/templates/discussion_entry.md#再開条件)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する) |
| E-C086 | 94 | 禁止: 通常応答待ち・consumer反映・完了・直後の次回へ再開条件を置かない | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:74–81](../faciliate-discussion/templates/discussion_entry.md#再開条件)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する) |
| E-C087 | 94 | 順序: 条件成立結果を次の回へ接続し現在の再開条件を外す | handler / 現在state、iteration / 作成中 | MOVE | 順方向照合済み: [templates/discussion_entry.md:74–81](../faciliate-discussion/templates/discussion_entry.md#再開条件)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する) |
| E-C088 | 94 | 境界: 別steering化・phase委譲が最終判断ならdecisionへ書く | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:74–81](../faciliate-discussion/templates/discussion_entry.md#再開条件)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[iteration.md:23–60](../faciliate-discussion/iteration.md#作成中の回と検討記録を用意する) |
| E-C089 | 97,99 | 出力: 合意後の確定内容、未決を確定表示しない | template / 決定、handler / 現在state | CHANGE（論点12: 所属）、ADAPT・MOVE | 順方向照合済み: [templates/discussion_entry.md:82–88](../faciliate-discussion/templates/discussion_entry.md#決定)、[SKILL.md:312–320](../faciliate-discussion/SKILL.md#合意したdecisionを確定する)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C090 | 102 | 品質: 現在有効な最終結論だけを自己完結して書く | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:82–88](../faciliate-discussion/templates/discussion_entry.md#決定)、[SKILL.md:312–320](../faciliate-discussion/SKILL.md#合意したdecisionを確定する)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C091 | 102 | 禁止・例: 過去判断を機械加算し以前／更新／最終のdecisionを並べない | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:82–88](../faciliate-discussion/templates/discussion_entry.md#決定)、[SKILL.md:312–320](../faciliate-discussion/SKILL.md#合意したdecisionを確定する)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C092 | 102 | 条件: 受容した弱点はdebug経緯でなく現在の制約・選択理由にする | handler / 現在state | MOVE | 順方向照合済み: [templates/discussion_entry.md:82–88](../faciliate-discussion/templates/discussion_entry.md#決定)、[SKILL.md:312–320](../faciliate-discussion/SKILL.md#合意したdecisionを確定する)、[SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C093 | 104 | 条件: boundary不変の具体表現置換なら現在decisionだけ同期 | handler / 現在state | MOVE | 順方向照合済み: [SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C094 | 104 | 履歴: 過去iterationは当時の判断対象として保つ | handler / 全体規則 | MOVE | 順方向照合済み: [SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C095 | 104 | 典拠: 同期箇所から置換元topicを示す | handler / 現在state | MOVE | 順方向照合済み: [SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C096 | 104 | owner: 置換理由は後続topicが所有し複製しない | handler / 現在state | MOVE | 順方向照合済み: [SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C097 | 104 | 例外: decision自体の変更は再開または別decisionへrouting | handler / 論点選択 | MOVE | 順方向照合済み: [SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C098 | 106 | 禁止: 固定ネクストアクションfieldを置かない | handler / 現在state | MOVE | 順方向照合済み: [SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C099 | 106 | 禁止・例: 合意待ち／consumer反映／完了等のdefault処理を全entryに反復しない | handler / 現在state | MOVE | 順方向照合済み: [SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C100 | 107 | 表示: 通常の次焦点は末尾のactive提示 | handler / 返却 | ADAPT（論点9・10: 提示種類） | 順方向照合済み: [SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う)、[SKILL.md:365–370](../faciliate-discussion/SKILL.md#返却の完了gate) |
| E-C101 | 107 | 境界: 順序・委譲先自体が合意ならdecisionが所有 | handler / 現在state | MOVE | 順方向照合済み: [SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C102 | 107 | 境界: 再開位置が停止条件と不可分な時だけ再開条件へ置く | handler / 現在state | MOVE | 順方向照合済み: [SKILL.md:321–328](../faciliate-discussion/SKILL.md#必要な現在stateを扱う) |
| E-C103 | 108 | 返却: decision後にconsumerへ処理を返す | handler / 返却 | MOVE | 順方向照合済み: [SKILL.md:312–320](../faciliate-discussion/SKILL.md#合意したdecisionを確定する)、[SKILL.md:365–370](../faciliate-discussion/SKILL.md#返却の完了gate) |

## 合意済みの追加への接続

| ID | 追加・変更 | destination | classification・合意 | verification |
| --- | --- | --- | --- | --- |
| E-A001 | 認識合わせの本文・対応する空回答欄 | template / 認識合わせ本文・空の認識合わせ回答欄 | ADD（論点5・8・10・12・16） | 順方向照合済み: 下記の接続を参照 |
| E-A002 | 種類決定前から同じ検討記録を育て、二種の提示へ接続 | template / 回の骨子、iteration / 作成中・材料確認・保存 | ADD・CHANGE（論点6・7・9） | 順方向照合済み: 下記の接続を参照 |
| E-A003 | 認識合わせへの訂正・一部回答・回答不能を受領応答へ記録 | template / 受領応答の本文、iteration / 応答 | ADD（論点8・10） | 順方向照合済み: 下記の接続を参照 |
| E-A004 | 名前付きの十部品を全文読取後に適用し、制御は実行側が所有 | template / 各保存形、三実行file | ADAPT（論点15・16） | 順方向照合済み: 下記の接続を参照 |

追加4件は、E-A001を保存形の認識合わせ本文・空回答欄とiterationの提示、E-A002を作成中→材料確認→保存（論点19–22で二層へ再配置）、E-A003を応答節、E-A004を三実行fileの全文読取と必要block適用へ照合した。
完了集計ではE-Aを重ねて加算せず、対応するN-C030・032・040・044と、随時記録・二層のN-C015〜028・033〜036への関係索引として扱う。

十部品の具体本文の合意と意味保存の照合は別である。ここでは旧103単位の順方向を確認したが、SKILL.md側の同義contractとの合算、全追加・削除行の逆引き、境界の合算、black-boxは [全体ledger](function-migration-ledger.json) と後続の検証に残る。この記録だけで移行完了とは扱わない。
