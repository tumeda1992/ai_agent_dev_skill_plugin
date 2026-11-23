# 二層の記録保存形

## この設計が具体化するもの

論点12の所属識別、論点15・16・18の純粋な保存形、論点19〜22の二層分離・配置・独立可読性・保存境界を、実際に組み立てられる保存形へ結ぶ。
既決の意味を変更する新しいproposalではなく、consumerによる通常具体化である。
この文書は設計成果物であり、productionへの適用済みや移行検証済みを表さない。

discussionはユーザーが各回を理解し、判断・応答する正本である。
内部logは過程の正本であり、linkを開かなければ案を理解できない構成にはしない。
ここで定める識別子は、説明の代わりではなく、説明と証跡を取り違えずに辿るための位置指定である。

## 保存先はdiscussion名と論点番号から導く

`D` は解決済みの `discussion_file_name` のbasename全体、`N` はdiscussionが所有する論点番号とする。
新しく内部logを作る場合のpathは、discussion directoryを基準に `internal-records/{D}.topic-{N}.md` とする。

```text
作業directory/
├── task-design-discussion.md
├── implementation-review.md
└── internal-records/
    ├── task-design-discussion.md.topic-1.md
    ├── task-design-discussion.md.topic-2.md
    └── implementation-review.md.topic-1.md
```

同じdirectoryに複数のdiscussionがあっても、論点1の保存先を区別できる。
元basenameの拡張子を落とさないのは、入力として許される `discussion` と `discussion.md` を同じ名へ潰さないためである。
basenameに意味を追加する略称・slugの別管理、追加の設定値、全discussion共通の論点採番は作らない。

既存論点に正しく接続された内部logがある場合は、そのfileを継続利用する。
暫定名の既存logや過去のdiscussion本文を、この規則だけを理由に移動・改名・分割しない。
一つの論点に複数の正本候補がある、解決したfileの所属が違う、名前長等で保存できない場合は、既存の対象不明・書込み失敗gateへ戻す。
自動短縮や別名への逃避で二つ目の正本を作らない。

## discussion側は既存の十部品を保つ

背景の正式見出しは論点9・12・18で採った `検討記録` を維持する。
その本文は論点19・21どおり、経過全件ではなく、判断に必要な事実・条件・決め手・代償・限界へ再構成する。
提案と認識合わせの双方で同じ背景領域を使い、linkは詳細証跡への導線として添える。

`templates/discussion_entry.md` の合意済み十部品のうち、`回の骨子` のcode blockだけを次に置き換える。他の九部品は論点18の合意本文を維持する。

```markdown
### イテレーションI（論点N）: {この回で進める内容}

#### 検討記録（論点N・イテレーションI）

{今回の判断・応答に必要な事実、条件、決め手、代償と限界を説明する本文}

[内部検討記録: 論点N・イテレーションI]({内部log相対path}#iteration-I)
```

最終的な読順は、回の見出し、提案または認識合わせ、上の検討記録、対応する応答欄とする。
判断に必要な反証や不明点をlink先へ追い出さない。具体的な根拠を指す必要がある場合は本文から記録単位へもlinkできる。
作成中からこれらを完成済みとして埋めるのではなく、論点22で合意した順序で準備・記録・再構成する。

## 内部logの保存形は一つの純粋なtemplateへ置く

`templates/internal_record.md` は、内部logの所属・回・記録単位という保存形だけを持つ。
目的別の中身は既存の六用途file、選択・適用・更新の制御は三実行fileが持つ。新しいhandlerは作らない。
配置を分けるのは、discussion entryとは出力先と見出し階層が違い、六用途の中身とは無関係にfileの所属を表すためである。

同fileの本文は次の三部品とする。外側の見出しとcode fenceはtemplate整理用であり、出力には必要なcode blockだけを使う。

````markdown
# 内部検討記録の保存形

## 論点の骨子

```markdown
# 内部検討記録: 論点N — {対象の問い}

**discussion:** [{discussion basename}]({discussion相対path})

**論点:** 論点N

## 開始context

{問題、対象語の意味、決める範囲、開始時の既決条件、残る不足}
```

## 回の骨子

```markdown
<a id="iteration-I"></a>

## イテレーションI: {この回の問い}

{今回の入口、変わった前提、使う既存根拠}
```

## 記録単位

```markdown
<a id="iteration-I-record-R"></a>

### {用途}: {何を調べ、判断し、確かめるかを表すタイトル}

{選択した目的別formatの入力と結果}
```
````

`I` はdiscussion側と同じ外向き回番号、`R` はその回内の記録単位を一意に指す1始まりの番号である。
Rは進捗や完了を表さず、discussionの論点採番を代替しない。
用途の表示は調査、比較・判断、認識合わせ、検証、診断・修正、一般化を使い、中身は対応する六用途formatへ従う。
実行側が用途format内の見出し深度を記録単位の配下へ合わせ、入力・結果・完成時の読順は変えない。
一律の三見出しや「確認N」というタイトルは復活させない。

固定anchorはsemantic titleと切り離す。入力記述中にタイトルの説明が精密になっても、既に参照された根拠の識別を変えないためである。
anchorをrenderしない読取環境でも、file path、外向き回番号、record番号からraw本文を一意に探せるよう、参照labelにもその番号を含める。
同じ回・記録の重複や所属不一致なら書込みを止める。

## 接続と更新を実行fileへ結び付ける

### 相互参照

- discussionからlog:
  - 例: `[内部検討記録: 論点3・イテレーション2](internal-records/task-design-discussion.md.topic-3.md#iteration-2)`。
  - 必要な個別根拠は `#iteration-2-record-1` を指し、labelにも論点・回・recordを示す。
- logからdiscussion:
  - 例: `[task-design-discussion.md](../task-design-discussion.md)` と `論点3`、各回の `イテレーション2` で所属を示す。
  - legacyの同名見出しへ曖昧なanchorを推測追加しない。discussionの範囲限定走査で論点→回を解決する。
- 訂正と再利用:
  - 訂正を新しい記録単位へ保存し、訂正元のfile・回・recordを明示する。
  - 再利用した根拠も同じ精度で指す。過去本文は上書きせず、参照先の後続訂正も含めて現在使える根拠かを確かめる。

相対pathの各segmentで、空白・`#`・`%`・括弧等、Markdown linkやURLとして特別な意味を持つ文字はpercent-encodeする。
file名自体は変更しない。anchorは実在するidと一致させ、リンクの表示名だけを根拠に接続済みと扱わない。

### 読取と書込み

1. handlerは既存どおりdiscussion全文からstate・論点番号・親子関係・現在の回を解決する。
2. iterationまたは回復が対象論点を扱う時は、接続された内部log全文を読む。新規なら未作成を確認する。
   - 現在回だけを切り出し、同じfileの過去前提や後続訂正を無視する読取へ弱めない。
   - 他論点の根拠を使う場合は、そのdiscussionの現在decisionと当該log全文へ広げ、参照された根拠と訂正を辿る。
   - 無関係な全論点のlogを毎回読むことは要求しない。必要なfileが読めない場合は、その根拠を確認済みとしない。
3. 保存形を使う実行fileは `discussion_entry.md` または `internal_record.md` の該当file全文を読み、必要な部品だけを使う。
   - 用途formatはREADMEで選んで該当fileを全文読み、目的が変われば再選択する。
   - 検討記録の書込み前には毎回 `expression_notation.md` 全文を読む。入力追加、結果追加、訂正、discussion背景の再構成も対象とする。
4. 書込み直前に対象file全体を再読込し、所属・回・記録単位を一意に特定してから同じownerが更新する。
   - 新規時は未作成と挿入先、既存時は現在の処理との一致を確認する。
   - 現在の単位には入力後の結果を加えられるが、次の処理へ進んだ単位を結論に合わせて改作しない。訂正は新しい単位へ接続する。

保存順と中断復帰は論点22のcontractをそのまま使う。
未提示の準備を途中で止めても同じ回へ戻り、結果が保存された後なら根拠から背景を完成する。応答保存後なら確定・反映・調査の未完部分へ戻る。
記録漏れの事後回復は、確認できる実施・結果と確認不能範囲を区別して同じ保存形を使う。

### legacyと新形式の接続

新しい内部logが必要になった最初の回から新形式を使い、logの開始contextへ分離開始の外向き回を明記する。
それより前の経過は元のdiscussionの論点・回・見出しで参照し、一括転記しない。
既存logでは既存の一意な見出し・位置を保持し、新しい回から必要なanchorを付ける。過去blockへ一括採番しない。
旧参照で対象が一意にならなければ範囲を広げて実体を確認し、解決できないまま根拠を利用しない。

## 実装先とprototypeへの反映状態

この設計の実装先は次のとおり。prototypeの三実行file・保存形・format接続へ反映した。
productionは変更していない。全量ledger・validatorとの対応と意味保存監査は残る。

| 対象 | 必要な反映 |
| --- | --- |
| `SKILL.md` | discussionからlog所属を解決し、二層と実会話の同期・停止・回復を接続する |
| `iteration.md` | 新形式の準備、全文読取、六用途と標準参照、随時保存、背景再構成、応答後処理へbindingする |
| `record-recovery.md` | 二層の回復先、元記録への参照、事後記録・確認不能を接続する |
| `templates/discussion_entry.md` | 仮の九fileを論点18の十部品へ集約し、回の骨子へ上記差分を加える |
| `templates/internal_record.md` | 上記三部品の純粋な保存形を追加する |
| `templates/consideration-records/README.md` と六用途file | 保存先を内部log、discussion側を再構成した背景として表す。目的別formatと読取gateは保持する |
| prototypeの旧 `proposal.md`・`alignment.md`・`proposal-feedback.md`・`alignment-answer.md`・`response.md`・`provisional-decision.md`・`resume-condition.md`・`decision.md` | entryへ集約済み。旧内容は `faciliate-discussion/alternatives/topic-15-split-templates/` へ保全し、過去の実物参照はそこへ接続した |
| 移行ledger・validator・caller | 保存形・参照先・新旧互換性を対応付ける。文字列一致だけで意味保存済みとしない |

表示pattern群の責務と論点17の語彙変更は維持する。
`templates/` の下へ実行handlerを追加したり、以前の所感だった `discussion-records/` へownerを移したりしない。

現在の実物と読み方は [prototype README](../faciliate-discussion/README.md)、変更と検証の過程は [内部検討記録](../internal-records/topic-23.md) に置く。
この反映はユーザーが指定した設計確認用の実物更新であり、production適用・全量移行・design readyへの承認を追加するものではない。
