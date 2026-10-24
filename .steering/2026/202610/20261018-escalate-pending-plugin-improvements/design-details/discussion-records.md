# 議論の保存と読取

[全体設計へ戻る](../design.md)

facilitate-discussionが、論点形式の記録の保存場所・原文読取・分割移行を担当する。
内容の決定や書込みの担当は変えず、読取専用scriptに正本選択・意味判断・自動修復をさせない。

## 保存する場所

各記録の実論点数が10件を超えたら、5論点単位へ分割する。
対象は設計議論、通常議論、実装後review、同skillを明示利用した議論。
design・tasklist・roadmap、論点別内部log、通常のsession履歴は対象外である。

元fileが `{stem}.md` なら、同階層の `{stem}/` に同名索引と `{stem}-{先頭}-{末尾}.md` を置く。
12件の設計議論、4件の通常議論、3件のreviewなら次になる。

```text
<working_dir>/
├── discussion.md
├── implementation_review.md
└── task-design-discussion/
    ├── task-design-discussion.md
    ├── task-design-discussion-1-5.md
    ├── task-design-discussion-6-10.md
    └── task-design-discussion-11-15.md
```

短い記録の場所・名前は変えず、そのためのdirectoryや索引も先行作成しない。
末尾が12件でも範囲名は11–15とする。共通のdiscussion/やindex.mdは追加しない。
内部logは現行配置を保ち、可変の追記先pointerは作らない。

索引は元のh1と「論点一覧」を持つ。実在する全論点を番号順に並べ、各行は番号・題名・担当本文へのlinkだけとする。
状態・親・提案要約を複写せず、改題・所在変更・新論点の時だけ更新する。
本文の一箇所で状態を保つため、状態を見る時は本文を読む。

## 入口を解決する

呼出し側は従来と同じ作業directoryと元のdiscussion basenameを渡す。
存在確認は本文もhashも読まず、fileを作成・移動しない。

| 元fileと分割先 | 結果 |
| --- | --- |
| 元fileだけ存在 | 一file形式 |
| 分割先だけ存在し、同名索引もある | 分割形式 |
| 両方存在 | 正本を選ばず停止 |
| 両方存在しない | 同じ記録の内部log・会話・参照などの既存証拠と矛盾しない場合だけ新規作成 |
| 索引欠落、想定外のpath種別、存在確認失敗 | 停止 |

入口の発見だけでは書込み可能と認定せず、長い一fileを見つけただけで即時分割しない。
task-designのhandoff gateも同じ判定を使い、design欠落時の停止と、独立再構成前の本文禁止を維持する。

## 原文を読む

通常進行では、全体前提、全論点のmetadata・現在結果、未決の最新iterationを出典付きの原文で取得する。
「現在の変更」の報告・反映状況も含める。対象と根拠の範囲本文・内部logは全文読み、後続訂正を辿る。
無関係な旧履歴の一律通読や、要約・常設current-state fileによる正本の代替は行わない。

別担当への設計引き継ぎでは、独立再構成後に索引と全範囲本文を読み、全decisionと主要な棄却理由を照合する。
通常進行の読取削減をこの段階へ流用しない。

書込直前は対象fileを全文再読込する。
索引・全範囲本文・根拠に読んだ内部logをsnapshotで識別し、追加・削除・解決先・内容が変われば再取得・影響評価する。
snapshotは排他lockでも読取・合意の証明でもなく、single writerを維持する。

取得不能や出力打切りを読了にせず、分割取得する。
安全に現在結果を抽出できない形式は `needs_full_read` と対象fileを返し、原文全文へ広げる。
実論点の境界も不明なら書込みを止め、検査不能を成功にしない。

## 分割へ移行する

導入前から長い記録は、次に再開して更新する時に分割する。新しく11件目が生じる記録も同じ。
読むだけの記録や閉じた過去記録を一括探索・移行しない。
引き継ぎ時は独立再構成と既存記録の照合後に移行する。

1. 移行元・移行先をsessionで報告する。同じ分割への再承認は求めない。
2. 受領した応答を原文保存し、旧版と移行対応を既存の内部logへ記録する。
3. 元fileを残したまま、索引・範囲本文と参照の更新候補を作る。
4. 原文・構造・link先を検査し、元版が変わっていないことを再確認する。
5. 元fileを最後に外し、新入口だけで再検査して通常進行へ戻る。

番号・順序・過去iteration・採否・応答原文を保持する。
格納用h1・索引と必要なhref以外は変えず、全href差は出典と旧新を表示して議論担当が必要性を判断する。
前書きなどの全体前提は最初の範囲本文へ残す。
内部logとの往復link、本文内のlink、designからの参照も更新する。
旧入口に案内・互換fileは残さず、更新できない外部の旧URLの互換性は保証しない。

切替中に新たな提案・決定を混ぜない。
中断後は、同じ担当が移行記録と一致する成果だけを再利用して未完分から続ける。
記録欠落、元版の変化、不明な差、曖昧な参照があれば通常追記も止め、未完範囲と理由を報告する。
上書き・削除・自動rollbackはせず、別担当もhandoff gateを通る。
新旧共存で止まる通常入口と、明示的な候補検査は別操作である。専用の進捗file・完了flagは増やさない。

## 読取専用script

`facilitate-discussion/scripts/inspect-discussion.mjs` はNode標準moduleだけで動かす。
共通入力は `--directory <作業directory>` と `--name <元basename>`。nameのdefaultはdiscussion.md。
nameへのpath混入、無効引数、読取不能、想定外のfile種別は失敗とし、sourceを実行・評価しない。

| 操作 | 返すもの |
| --- | --- |
| `resolve` | 内容を読まずnone・single・splitと入口 |
| `read --view current` | 全体前提、全metadata・現在結果、未決の最新iterationの原文 |
| `read --view full` | 索引と全範囲本文の原文 |
| `read --topic N` | Nを含む範囲fileの全文。一論点だけには切らない |
| `check` | 実論点、索引、範囲所属、重複、親参照の検査結果 |
| `snapshot` / `compare` | 内容識別情報 / stdinで渡した旧snapshotとの差 |
| `check-candidate` | `--source <元file>` と `--candidate <派生先directory>` の保持・構造・href差 |

stdoutは操作名・保存形式・解決先・問題・取得結果を持つJSON、stderrは失敗の説明。
原文chunkにはpathと1始まりの開始行・終了行・本文を付ける。
readは `--offset <0以上>`、`--limit <1以上>` によるchunk単位の分割を認め、総数・次offset・取得完了を返す。defaultは全件取得。
終了値は正常0、不能・不整合1、compareの差検出2。差の存在を構造不良とは扱わない。

snapshotは対象の相対path・実解決先・SHA-256を名前順に返す。
根拠logは反復可能な `--log <path>` で指定し、compare時も現行file集合を再列挙する。
保存が必要なら呼出し側が既存記録へ残す。scriptはfileの保存・移行・自動修復を行わない。

認識する実論点はh2の `## 論点N:` と旧h3の `### 論点N:`。正の整数と半角・全角colonを扱う。
fence・引用・HTML commentの例示を除き、最大番号ではなく実件数で閾値を判定する。欠番は埋めず採番は最大値+1。
通常提案、仮決定・決定、現在の変更、旧「提案中」statusを扱う。未完成iterationは正常な途中状態である。
閉じていないfenceなどで実論点の範囲も定まらない場合は書込みを止める。

## 実装するfileと接続

pathは `plugins/tumeda-dev/skills/` を基準とする。
facilitate-discussion/SKILL.mdは入口から次の内部指示を呼び、詳細規則を重複して持たない。

| 内部指示 | 見出しと担当 |
| --- | --- |
| resolve-discussion.md | 入力と入口を確認する / 保存形式を解決する |
| read-discussion.md | 現在の原文と根拠を取得する / 変更を照合する |
| split-discussion.md | 移行元を固定する / 候補と参照を検査する / 入口を切り替え、中断から戻る |

入口確認は本文禁止下でも使い、移行は書込みと中断状態を持つため、同じ内部指示へ混在させない。
専用scriptと `scripts/inspect-discussion.test.mjs` を加える。独立skillやcommonは新設しない。

task-design/SKILL.mdとtask-design-work-handoff-contracts.mdは、存在確認をresolveへ、独立再構成後の読取をfull・snapshotへ接続する。
steering/SKILL.mdの配置説明・終了前reviewも同じbasenameから解決する。本文を先読みする権限は増やさない。
extract-handoff-input.mjsは変更しない。

自己testは10・11・12件、旧h3、例示の999、新旧共存、索引欠落、重複・親循環、file追加削除、
未知形式・未完成iteration・分割取得、候補の原文改変と元版の変化、実行前後のsource不変を確認する。
