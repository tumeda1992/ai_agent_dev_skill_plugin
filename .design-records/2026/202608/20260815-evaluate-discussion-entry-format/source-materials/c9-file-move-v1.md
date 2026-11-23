# C9 after候補 v1: 既存directory移動を変更契約で判断する

**位置づけ:** 既存directoryの移動で、完成後treeだけでは見えない全変更を、file全文の列挙へせず合意できるか確認するafter候補。共通format案ではない。

**判定:** 成立。`file-change-set`の一対一移動variationとして受諾

**source:** 非公開の利用先記録から一般化したcase（Phase 0「フロントエンド: `src/features/scheduleSlot/` → `src/features/schedule/slot/`」）

**実装結果の確認元:** 初回の移動実装と、旧directoryを後から削除した修正実装

イテレーション0はsourceで実装対象になった記述を現在の骨子へ置いた再現である。イテレーション1だけが、移動をcopyとして実装できた不足を合意前に見える形へするC9の試作である。

---

## 論点5: frontendのfeature directoryをdomain階層へ移す

**ステータス:** 提案中

**種別:** TBDヒアリング

### イテレーション0: directory移動と参照更新を実装対象にする

#### 提案0

`frontend/src/features/scheduleSlot/`以下をすべて`frontend/src/features/schedule/slot/`へ移動する。全sourceから`features/scheduleSlot`のimportを検索し、`features/schedule/slot`へ更新する。

移動と参照更新の後にfrontend testを実行し、すべてgreenであることを確認する。

#### 提案背景

新しく追加する枠patternを`features/schedule/slot/pattern/`へ配置するため、既存の枠featureも同じdomain階層へ揃える必要があった。

directoryの始点と終点、外部参照の更新、test実行を指定すれば、既存featureのリネームとして実装できると考えた。

#### 提案0へのフィードバック

**結果:** 実装結果により不成立・旧directoryの削除が完了条件になっていなかった

sourceのtasklistでは、この項目を完了としている。しかし初回実装は、新pathへ8 fileを追加して外部参照を更新した一方、旧pathの8 fileを削除していない。`tsconfig.json`の無関係な変更も同じ変更集合へ混入した。

旧pathは後続修正で「移行済み、消し忘れ」として削除された。したがって、`移動する`という動詞、移動先path、参照更新、test greenだけでは、copyとmoveを区別して完了判定できなかった。

### イテレーション1: 移動をfile対応と変更範囲へ分解する

#### 提案1

`frontend/src/features/scheduleSlot/`を`frontend/src/features/schedule/slot/`へ移動する。合意対象はpath名だけでなく、次の完成状態と変更範囲の全体とする。

##### 完成後の配置

```text
frontend/src/features/
├── schedule/
│   └── slot/
│       ├── addScheduleSlotEntryMutation.ts
│       ├── addScheduleSlotMutation.ts
│       ├── deleteScheduleSlotMutation.ts
│       ├── fetchScheduleSlotQuery.ts
│       ├── removeScheduleSlotEntryMutation.ts
│       ├── schema.ts
│       ├── updateScheduleSlotMutation.ts
│       └── useScheduleSlot.ts
└── scheduleSlot/                         [存在しない]
```

##### 移動するfile

表内のpathは`frontend/src/`を起点とする。

| 移動元 | 移動先 | 移動後の本文変更 |
| --- | --- | --- |
| `features/scheduleSlot/addScheduleSlotEntryMutation.ts` | `features/schedule/slot/addScheduleSlotEntryMutation.ts` | 相対importを補正 |
| `features/scheduleSlot/addScheduleSlotMutation.ts` | `features/schedule/slot/addScheduleSlotMutation.ts` | 相対importを補正 |
| `features/scheduleSlot/deleteScheduleSlotMutation.ts` | `features/schedule/slot/deleteScheduleSlotMutation.ts` | 相対importを補正 |
| `features/scheduleSlot/fetchScheduleSlotQuery.ts` | `features/schedule/slot/fetchScheduleSlotQuery.ts` | 相対importを補正 |
| `features/scheduleSlot/removeScheduleSlotEntryMutation.ts` | `features/schedule/slot/removeScheduleSlotEntryMutation.ts` | 相対importを補正 |
| `features/scheduleSlot/schema.ts` | `features/schedule/slot/schema.ts` | 変更なし |
| `features/scheduleSlot/updateScheduleSlotMutation.ts` | `features/schedule/slot/updateScheduleSlotMutation.ts` | 相対importを補正 |
| `features/scheduleSlot/useScheduleSlot.ts` | `features/schedule/slot/useScheduleSlot.ts` | 変更なし |

表の8 fileは同じbasenameを維持して一対一に移動する。表にないfileを新pathへ追加せず、旧pathにはfileもdirectoryも残さない。

##### 移動したfile内の変更

`相対importを補正`とした6 fileでは、階層が一段深くなることに伴う次の置換だけを行う。

```diff
- from '../../lib/graphql/generated/graphql'
+ from '../../../lib/graphql/generated/graphql'

- from '../utils/mutationUtils'
+ from '../../utils/mutationUtils'

- from '../utils/queryUtils'
+ from '../../utils/queryUtils'
```

一つ目の置換は6 file、二つ目はmutationの5 file、三つ目は`fetchScheduleSlotQuery.ts`だけが対象になる。export、GraphQL query、schema、hookの処理内容は変更しない。

##### 外部consumerの変更

次の5 fileにある`features/scheduleSlot/useScheduleSlot`へのimportを、同じ相対階層の`features/schedule/slot/useScheduleSlot`へ置換する。

表内のpathは`frontend/src/`を起点とする。

| file | 変更するimport数 |
| --- | ---: |
| `app/schedule-slots/[id]/edit/page.tsx` | 1 |
| `components/calendar/calendarComponents/SlotCard/index.tsx` | 1 |
| `components/calendar/calendarComponents/ScheduleIcon/AddScheduleSlot/index.tsx` | 1 |
| `components/scheduleSlot/ScheduleSlotForm.tsx` | 2 |
| `components/scheduleSlot/ScheduleSlotList.tsx` | 1 |

`ScheduleSlotForm.tsx`ではdefault importと`AddScheduleSlotInput`のtype importを両方変更する。他のconsumer本文は変更しない。

##### この移動へ含めない変更

compiler option、formatting、他のfeature・componentの再配置は変更しない。特に`frontend/tsconfig.json`はこの移動の対象外とする。移動から説明できない変更が必要になった場合は、このproposalへ混ぜず、別decisionとして提示する。

##### 完了確認

適用後は、次をすべて確認する。

- 新pathに対応表の8 fileが存在する。
- 旧`frontend/src/features/scheduleSlot/`が存在しない。
- tracked sourceに`features/scheduleSlot`を含むimportが0件である。
- 許可した相対import補正を除き、移動元と移動先のfile本文が一致する。
- 移動対象とconsumer以外にdiffがない。
- frontend testがすべてgreenである。

#### 提案背景

イテレーション0は、`移動する`を一つの操作として書いた。しかし実装者が新pathへの追加、consumer更新、test greenまでを満たした時、旧path削除が行われていなくてもtaskを完了扱いできた。完成後treeだけを追加しても、どのfileが一対一に対応し、本文のどこまで変更してよいかは残る。

このcaseで合意前に必要なのは、8 fileの本文全文ではない。本文の大部分は同一で、差分は階層変更から機械的に導ける相対importだけである。そこで、全fileの対応を省略しない表、本文変更の完全な置換規則、全consumerと変更数、旧path不在、scope外変更を一つの変更契約として示す。

この形なら、移動の全変更対象は列挙しながら、同じ本文をbefore / afterとして16回複製せずに済む。判断するのは、上記の変更契約で、旧path削除漏れ、consumer漏れ、移動中の意図しない本文変更、無関係な変更の混入を合意前と完了時の両方で検出できるかである。

#### 提案1へのフィードバック

**結果:** 単体の合意gate化を取り下げ、母集団全体への一巡適用へ統合

一対一移動のafter候補自体は維持する。ただし、このcaseだけから共通formatを決めず、file分割と意味保持移植を含む未確認caseを同じ巡回で精査し、共通骨子とvariationを得てからまとめて判断する。

### 決定

C10・C11との照合と既確認caseへの戻り検証を経て、このafterを`file-change-set`の一対一移動variationとして採用する。C9の表示項目を全file変更へ固定せず、共通contractは変更集合を閉じることに置く。典拠は`task-design-discussion.md`論点4のイテレーション20とする。
