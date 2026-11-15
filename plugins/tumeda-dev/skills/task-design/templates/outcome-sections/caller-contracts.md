### 呼び出し元から見た呼び出し方と保証

<!--
function、method、endpoint、mutation等について、呼び出し元が実装を開かずに頼れる名前、入力、結果、
失敗時の返し方、成功・失敗時に何が起きるかの保証が変わる時に使う。
public／privateという公開の範囲だけでは選ばない。呼び出し元にはrepository外の利用者だけでなく、
別のmodule、application service、adapter等、決まった入口を使う呼び出し側を含む。

なぜ必要か:
- 公開された名前を読んでも、中身を開かなければ意味が分からない状態を防ぐため。
- 呼び出し元が引数、結果、副作用、処理すべき失敗を推測すると、実装ごとに異なる
  呼び出し方が生まれるため。
- 呼び出し元から見える名前と保証は長く残るため、実装中の都合で決めないため。

NG:
- saveItem(url)
- getItems(id)
- handleData()
- set_ / get_ / do_ / handle_だけでdomainの操作を表す
- 成功時の返り値だけを書き、保存・通知等の副作用と、失敗時にdataがどうなるかの保証を書かない

具体的な記述例:
importDocument(url): Promise<ImportResult>
  - "import" は外部の資源の取得と保存を表す。"create"では入力から新しく作るように見える。
  - "document" は利用者が扱う保存の単位を表す。"section"では一部分に見える。

DocumentSourceClient.fetchDocument(documentId): Promise<SourceDocument>
  - "fetch" は外部APIの呼び出しを示す。"get" は内部の状態の取得に見える。
  - "SourceDocument" は外部から取ってきた直後の値を示し、保存済みのDocumentと区別する。

DocumentRecordBuilder.build(sourceDocument): StoredDocument
  - "Builder" は保存用の構造を組み立てる責務を示す。"Converter"では意味の変換に見える。

成功・失敗時の返し方を書く条件:
- 新しく作る呼び出し方では、成功時の結果と副作用、および呼び出し元が処理すべき失敗の条件を設計する。
- 既存の呼び出し方を変える時は、名前、入力、結果、errorの表し方、副作用の保証のどれかが
  今回変わる場合だけを書く。
- 実装の内部だけの例外、今回変わらない一般的なerror、呼び出し元から見えない失敗を、
  機械的にこのsectionへ書き足さない。

このsectionに書くこと・書かないこと:
- このsectionには、呼び出し元から見える名前、入力、結果、失敗時の返し方（error type、status、payload）と、
  成功・失敗のそれぞれで何が起きるか（保存、通知等）の保証を書く。
- layer、module・classの責務、directory、依存の向き、全体の呼び出し関係は`code-structure.md`に書く。
  `code-structure.md`はこのsectionの名前を入口として参照できるが、signatureや保証の本文を写さない。
- domainの概念と、それを呼ぶ共通の言葉をどう選び保つかの方針は、このsectionで決めない。
- 操作する人がどの段階で何を見て次に何をするかは`interaction-flow.md`、画面の表示・配置・
  操作できるかどうかは`screen.md`に書く。

判断基準:
- 呼び出し元から見える名前が、domainで何をするかを伝えるか。
- 呼び出し元が実装を開かずに、引数、結果、副作用、処理すべき失敗を理解できるか。
- domainの名前を省略せずに使い、内部だけで通じる略称を呼び出し方へ持ち込んでいないか。
- 内部のhelperや、呼び出し元が頼らない実装の詳細を、公開されているという理由だけで書いていないか。
-->

**新設・変更する、呼び出し元が使うclass / function:**

- `{ClassName}`: {呼び出し元から見た責務}
  - `{methodName}({args}): {Result}`: {呼び出し元から見た操作と副作用}
    - 命名根拠: {動詞・名詞が表す意味と、紛らわしい別の名前を採らない理由}

**mutation / endpointの呼び出し方:**

- `{operationName}({arg}: {Type}, {optionalArg}?: {Type}): {Result}`
  - 呼び出し元: {利用者または依存するmodule}
  - 入力の条件: {必須の値、任意の値、前提条件}
  - 成功時の結果: {返り値}
  - 成功時の副作用: {作成・更新・通知等の保証}

**失敗時の返し方と、dataの状態の保証:**

| 条件 | 呼び出し元へ返すerror（type、status、payload） | dataの状態と副作用の保証 |
| --- | --- | --- |
| {呼び出し元が処理すべき失敗の条件} | {error type、status、payload等} | {dataは変わらない、一部だけ反映、rollback等} |
