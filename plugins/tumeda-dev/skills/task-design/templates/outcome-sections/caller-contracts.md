### callerが依存するcontract

<!--
function、method、endpoint、mutation等について、callerが実装を開かず依存できる
identifier、input、result、error、side effect保証が変わる時に使う。
public／privateというvisibilityだけでは選ばない。callerにはrepository外の利用者だけでなく、
別module、application service、adapter等、安定した入口へ依存する呼出し側を含む。

なぜ必要か:
- public nameを読んでも中身を開かなければ意味が分からない状態を防ぐため。
- callerがargument、result、side effect、処理すべき失敗を推測すると、実装ごとに異なる
  contractが生まれるため。
- caller-facingなnameとcontractは長く残るため、実装中の都合で決めないため。

NG:
- saveItem(url)
- getItems(id)
- handleData()
- set_ / get_ / do_ / handle_だけでdomain actionを表す
- 成功時の返却値だけを書き、保存・通知等のside effectと失敗時のstate保証を書かない

具体的な記述例:
importDocument(url): Promise<ImportResult>
  - "import" はexternal resourceの取得と保存を表す。"create"では入力から新規作成するように見える。
  - "document" は利用者が扱う保存単位を表す。"section"では一部分に見える。

DocumentSourceClient.fetchDocument(documentId): Promise<SourceDocument>
  - "fetch" はexternal API callを示す。"get" は内部状態取得に見える。
  - "SourceDocument" は外部取得直後の値を示し、保存済みDocumentと区別する。

DocumentRecordBuilder.build(sourceDocument): StoredDocument
  - "Builder" は保存用構造の組立責務を示す。"Converter"では意味変換に見える。

成功・失敗contractのselection gate:
- 新設するcaller contractは、成功時のresultとside effect、およびcallerが処理すべき失敗条件を設計する。
- 既存contractの変更では、今回identifier、input、result、error表現、side effect保証のいずれかが
  変わるcaseだけを記載する。
- 実装内部だけの例外、今回変わらない一般error、callerが観測できない失敗を機械的に
  caller contractへ昇格させない。

owner境界:
- このsectionはcaller-facingなidentifier、input、result、error type／status／payloadと、
  成功・失敗時のside effect保証を所有する。
- layer、module／class責務、directory、dependency direction、全体call relationは
  `code-structure.md`が所有する。code structureはこのsectionのidentifierを入口として参照できるが、
  signatureやcontract本文を複製しない。
- domain概念やubiquitous languageをどう選び維持するかという方針は、このsectionで決めない。
- actorがどのstepで何を観測し次に何をするかはinteraction flow、画面の表示・配置・操作可否は
  screenが所有する。

判断基準:
- caller-facingなnameがdomainで何をするかを伝えるか。
- callerが実装を開かず、argument、result、side effect、処理すべき失敗を理解できるか。
- 完全なdomain固有名詞を使い、内部だけの略称をcaller contractへ持ち込んでいないか。
- internal helperやcallerが依存しない実装詳細を、公開されているという理由だけで記載していないか。
-->

**新設・変更するcaller-facing class / function:**

- `{ClassName}`: {callerから見た責務}
  - `{methodName}({args}): {Result}`: {callerから見たactionとside effect}
    - 命名根拠: {動詞・名詞が表す意味と、紛らわしい代替名を採らない理由}

**mutation / endpoint / caller contract:**

- `{callerFacingName}({arg}: {Type}, {optionalArg}?: {Type}): {Result}`
  - caller: {利用者または依存module}
  - input contract: {必須値、任意値、前提条件}
  - 成功時のresult: {返却値}
  - 成功時のside effect: {作成・更新・通知等の保証}

**失敗contract:**

| 条件 | caller-facingなerror contract | state・side effectの保証 |
| --- | --- | --- |
| {callerが処理すべき失敗条件} | {error type、status、payload等} | {data不変、部分反映、rollback等} |
