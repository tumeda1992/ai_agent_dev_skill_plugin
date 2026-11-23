# Source materials migration ledger

## 移植契約

| 項目 | 内容 |
| --- | --- |
| source | gitignore対象の`source-materials.local.md/` |
| target | git管理対象の`source-materials/` |
| 移植単位 | 今回のsteering内から直接または推移的に参照されるMarkdown file |
| default | caseのiteration、feedback、判断材料、before / after、coverage結果を意味保持する |
| 許可変更 | repository名、source path、commit ID、固有domainのclass・file・API名を一般例へ置換する |
| 非許可変更 | caseを短い結論へ要約する、失敗した版を成功版へ書き換える、iterationやfeedbackを削る、coverage件数や判定を変える |
| 合意典拠 | `task-design-discussion.md`論点21。参照される資料を脱臭してgit管理下へ置くというユーザー指示 |

## 参照closure

直接参照に加え、`coverage-v3.md → evidence-matrix.md`、`coverage-v2.md → coverage-v1.md → curated-failures-before-after.md → C1試作`を辿った。次の20 fileを一対一で移植した。

| 区分 | file |
| --- | --- |
| C1 | `c1-iteration-replay-v2.md`、`c1-single-entry-v3.md`、`c1-single-entry-v4.md`、`c1-single-entry-v5.md` |
| C2〜C4 | `c2-single-entry-v1.md`、`c3-single-entry-v1.md`、`c4-discussion-v1.md` |
| C5〜C8 | `c5-discussion-v1.md`、`c5-discussion-v2.md`、`c6-existing-file-modification-v1.md`、`c7-topic-supersede-v1.md`、`c8-owner-move-v1.md` |
| C9〜C11 | `c9-file-move-v1.md`、`c10-file-split-v1.md`、`c11-semantic-migration-v1.md` |
| 帰納・coverage | `curated-failures-before-after.md`、`evidence-matrix.md`、`coverage-v1.md`、`coverage-v2.md`、`coverage-v3.md` |

`case-analysis.md`は今回のsteeringから参照されず、後続資料の参照先でもないため移植対象外とし、`source-materials.local.md/`へ残した。

## 一般化台帳

| 除去したsource固有情報 | targetでの表現 | 保持した意味 |
| --- | --- | --- |
| 利用先repository名、所有者名、日付付きsteering path | `非公開の利用先記録`、corpus ID `Dxx / Rxx` | どの種類の記録から何件を観測したか、case間の参照関係 |
| source commit ID | `初回実装`、`後続修正`、`変更前後のrevision` | 初回移動で旧pathが残り、後続修正で削除されたという失敗の因果 |
| 保存対象serviceと外部data storeの名称 | `savedItem`、`external store`、`external content API` | UI owner、外部data境界、forward取得、mapping責務 |
| scheduling domainのclass・module・directory名 | `Schedule::Slot`、`schedule/slot`、`ScheduleSlot` | namespaceの包含関係、後続命名によるsupersede、一対一directory移動 |
| host固有instructions file名 | `project-instructions.md` | 思考contractとdiscussion formatの二つを変更する関係 |
| 特定provider名 | `remote Git provider` | capabilityの有無による公開action分岐とowner |

## Verification

- [x] steering内の参照が`source-materials/`へ到達する。
- [x] catalogからC1〜C11の問題、比較版、主資料を辿れる。
- [x] targetに利用先repository名、absolute path、source commit ID、source固有domain識別子が残っていない。
- [x] 移植対象として列挙した20 fileとtargetの20 fileが一対一に対応する。
- [x] 移植対象外の`case-analysis.md`だけが`source-materials.local.md/`へ残る。
- [x] Markdown linkが存在するfileへ解決する。
