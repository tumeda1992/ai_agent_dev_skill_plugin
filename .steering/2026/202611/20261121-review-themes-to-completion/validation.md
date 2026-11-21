# 設計と適用の検討・検証

## 実施前の判断と確認方法

利用者の改善を、既存のexhaustive-review・内部指示・個票・versionへどう結ぶかを調べる。
対象固定とモデル・監督、個別の採否と適用、障害・再開の契約を保持し、変更するのはテーマの扱いと、個票・集合の再検討と終了判断である。
公開先には利用先の固有情報を移さず、指示の一般化で意味を落とさないか、sourceと削除・追加の各行を照合する。

## 設計時のskill-update-review

exhaustive-reviewの全本文と既存のtemplatesを読み、追加する個票・集合の再検討には、探索とは別の入力（既存指摘集合）、判断（修正後にも反例が残るか）、結果（再探索又は終了）と改訂理由があると判じた。
内部指示review-findings.mdへ分け、各走査後に全文を読む入口と、coverageを更新して探索又は終了へ戻す返りを持たせる。単独の外部callerの要求は無いため別skillにしない。
既存の対象固定・適用・障害処理の責務は移さない。設計の変更集合から旧contractのownerが減らないことを差分で確認する。

## skill-creatorの適用元

実行環境にskill-creatorが同梱されていなかったため、OpenAI公式公開sourceの[skill-creator](https://github.com/openai/skills/blob/main/skills/.system/skill-creator/SKILL.md)を取得して全文を読み、既存skill更新の手順を適用した。既存skillのためinitは省略する。
再利用する詳細は内部指示へ置き、入口で必須読取の条件を示す。新しい不要なREADME・インストール説明・UIメタデータは追加しない。quick_validateは公式sourceのscriptを読み、対象のfrontmatter検査に使う。

## 文書reviewとdoc-enricherの方針

初見の担当がどこで再探索・終了・未完へ返すか、具体の反例と対照から判じられるかを確認する。
利用先から移す恒久的な知識は今回のskillと内部指示へ収めるため、別READMEへの重複提案は行わない。実測と机上の判断、未実施を混ぜない。
