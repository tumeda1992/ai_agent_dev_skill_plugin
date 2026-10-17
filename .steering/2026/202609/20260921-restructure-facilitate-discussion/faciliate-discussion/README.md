# facilitate-discussionの設計prototype

ユーザーが完成形を読んで評価するための実物であり、配布用skillではない。
指定された `faciliate-discussion/` というdirectory名を維持する。
完成設計への合意後、productionの `plugins/tumeda-dev/skills/facilitate-discussion/` へ投影した。
このdirectoryは設計・検証時の本文として保持する。適用結果は [production検証](../behavior-preservation/production-verification.md) を参照する。

論点13〜22・24の合意と [二層の記録保存形](../discussion-recording/record-storage-design.md) を反映した。
責務と保存形の確認に使える。全量のwhite-box監査結果は後述の証拠へ保存したが、実際のagentによる全経路検証やproduction適用の完了を示すものではない。

## 最初に読むところ

1. [iteration.md](iteration.md)：調査前の入力保存から結果保存、判断背景の再構成、提示、応答処理、中断復帰までの共通本体。
2. [templates/discussion_entry.md](templates/discussion_entry.md)：ユーザーが読むdiscussionの十部品。適用制御を含まない。
3. [templates/internal_record.md](templates/internal_record.md)：内部logの所属・回・記録単位の三部品。六用途の中身とは別責務。
4. [SKILL.md](SKILL.md)：一度だけの起動、論点選択、二層の保存先、scope・親子、decision確定と同期。
5. [record-recovery.md](record-recovery.md)：未収録のchat合意・記録漏れを実証拠から回復する経路。
6. [templates/consideration-records/README.md](templates/consideration-records/README.md)：内部logで使う目的別formatの選択入口。

## 現在の構成

```text
faciliate-discussion/
├── SKILL.md
├── iteration.md
├── record-recovery.md
├── templates/
│   ├── discussion_entry.md          discussionの十部品
│   ├── internal_record.md           内部logの三部品
│   ├── consideration-records/
│   │   ├── README.md                共通入口
│   │   ├── research.md
│   │   ├── judgment.md
│   │   ├── alignment.md
│   │   ├── verification.md
│   │   ├── diagnosis.md
│   │   └── generalization.md
│   └── proposal-sections/           十の表示pattern file
├── alternatives/
│   ├── discussion_entry.with-handling.md
│   └── topic-15-split-templates/     旧九分割の内容を保全
└── README.md
```

保存形の選択・挿入・省略・更新条件は三実行fileが所有する。
template内へhandlerや制御commentを戻さず、一fileを全文読んで必要な名前のcode blockだけを使う。
consideration-recordsとproposal-sectionsは説明・例を持つformat guideであり、丸ごとコピーする雛形ではない。

## 二層の読者と保存順

discussionの各回は、提案または認識合わせ、判断背景、対応する応答を持つ。
背景は経過全件の短縮版でなく、判断に必要な事実・条件・決め手・代償・限界へ再構成する。
内部logを開かなくても、その回へ判断・応答できる情報量を保つ。

内部logは一論点一fileとし、discussionと同じdirectoryの `internal-records/` 配下へ置く。
新規名は `{discussion basename全体}.topic-{論点番号}.md`。
開始contextと目的別記録を持ち、内部logだけでも問い・確認方法・finding・解釈・訂正・残る不足・次actionの因果を追える。
既存の正しく接続されたlogは改名せず、過去discussionの経過も移動しない。

```text
discussionの作成中骨子
  → 内部logの所属・回を準備
  → 実施前入力を保存 → 調査・判断・検証 → 結果を保存 → 材料を再判定
  → discussionの判断背景を再構成
  → 本文・背景・空応答を保存して確認 → chatへ提示
  → 応答の原文と結果を同じ回へ一度保存 → 確定または次の準備
```

内部loopだけでは外向き回を増やさない。
中断時は実本文・tool結果・chatから未完部分へ戻り、提示済みか不明なら再送しない。
処理を先へ進めた後の欠落は事後回復へ分ける。
検討記録の書込み前は毎回expression_notationを全文読み、記録を構造化する。

## 過去の比較資料

[A案のtemplate](alternatives/discussion_entry.with-handling.md) は論点15・提案0の内容を保持する。
templateに適用制御も置いた比較案であり、現在の実行fileからは参照しない。
production配置を前提にした当時の相対参照も履歴として残しているため、実行導線には使わない。

[旧九分割の保存形](alternatives/topic-15-split-templates) は、論点15で実物比較した形である。
八つの小templateと当時のentryを保全した。現在はそれらの保存能力をdiscussion_entryの十部品へ集約した。
歴史上のfile名を参照する過去discussionは書き換えず、ここから当時の実物へ辿れるようにする。

| 旧小file | 現在のdiscussion_entry内の部品 |
| --- | --- |
| proposal.md | 提案本文 |
| proposal-feedback.md | 空の提案応答欄 |
| alignment.md | 認識合わせ本文 |
| alignment-answer.md | 空の認識合わせ回答欄 |
| response.md | 受領応答の本文 |
| provisional-decision.md | 仮決定 |
| resume-condition.md | 再開条件 |
| decision.md | 決定 |

## 検証済みと未完を分ける

このprototypeのbaselineは `a6e24853800fcb75eb6a7bdd91479a633f740d4a`。
entryの旧103 IDは [entry ledger](../behavior-preservation/entry-template-migration-ledger.md)、その他の旧source598原文候補と5構造記法は [source ledger](../behavior-preservation/function-migration-ledger.json) から具体移動先へ辿れる。
603候補の初期inventoryは [別file](../behavior-preservation/function-migration-source-inventory.json) に保全した。
新しい実行・保存と六用途の [合意差分](../behavior-preservation/function-migration-additions.json)、削除追加行の [逆引き](../behavior-preservation/function-migration-reverse-index.json) も保存した。
これらの件数を独立した保存能力数とは扱わない。

[独立contract監査](../behavior-preservation/function-migration-audit.json) では、旧側をsource686・entry114の計800単位へ分け、適合756・合意変更44へ対応付けた。
合意追加は306、明示廃止・未監査・未分類削除・未分類追加は0である。
旧側への関係索引37は重複計上せず、現在本文のhashと各単位の原文・移管先・合意へ戻れる形で保存した。
これはprototypeの意味・境界・順序・停止の照合であり、実行保証やproduction移行完了の宣言ではない。

三責務の境界とsource由来のscenario、実行済み範囲と残件は [移行検証](../behavior-preservation/migration-verification.md) を参照する。
validatorとcallerは [具体変更本文](../discussion-recording/validator-caller-design.md)、元steeringから移管された三件は [思考標準の具体設計](../thinking-standard-evolution/thinking-standards-design.md) へ保存した。
後者は維持規律全文・11場面名・補助二見出しであり、このprototypeへ実装済みとは扱わない。
productionへの適用完了と検査の限界は、prototypeの監査とは別に [production検証](../behavior-preservation/production-verification.md) へ保存した。

このprototypeにはagent metadata、consumer、hook、release宣言を複製していない。
production投影では相対参照をproduction配置へ戻し、既存metadataの起動制御を保持した。consumerとversionは合意済みの範囲でproduction側へ反映した。
検査結果は親directoryの内部検討記録へ残す。読むための構造検査と、実際のagentによる実行評価は区別する。
