# Design: task-design による作業ディレクトリ作成

## 目的

`task-design` を単独でも配置先の事前決定なしに起動でき、`steering` から起動した場合も設計固有の成果物を steering ディレクトリ配下へ分離して保存できるようにする。

## 完了条件

- [x] 新規作成の既定値と、新規作成しない場合の入力契約が一意である
- [x] 単独起動と steering 経由起動の配置先が一意に決まる
- [x] `name-work-directory` と `task-design` の責務境界が維持される
- [x] steering の後続フェーズが入れ子になった `design.md` を参照できる
- [x] 配布versionが変更の互換性に従って更新される

## 決定事項

### D1. 入力名と内部名を分離する

呼び出し側が渡す親または直接利用先を `working_dir_parent`、配置先確定後の絶対パスを `working_dir` と呼ぶ。既存の `working_dir` 入力を親ディレクトリへ読み替えない。

### D2. 新規作成を既定動作にする

`create_working_dir` は省略可能な boolean とし、既定値を `true` にする。`true` の場合は `name-work-directory` で `YYYYMMDD-slug` を決め、`working_dir_parent` 配下へその名前のディレクトリを作る。`working_dir_parent` 未指定時はtask-design起動時のcurrent working directoryを使い、相対パス指定も同じ場所を基準に絶対化する。

### D3. 新規作成しない場合は既存ディレクトリを直接使う

`create_working_dir=false` の場合は `working_dir_parent` を必須とし、その既存ディレクトリ自体を `working_dir` にする。`name-work-directory` とディレクトリ作成は実行しない。

### D4. steering は task-design の返却先を保持する

steering は初回起動時に steering ディレクトリを `working_dir_parent` として渡し、task-design が返した `working_dir` を `task_design_dir` として後続フェーズへ引き継ぐ。再設計時は既存の `task_design_dir` を `working_dir_parent` とし、`create_working_dir=false` で再開する。

### D5. 既存の直接配置契約を破壊的変更として扱う

入力名と成果物配置が変わるため、plugin versionは `4.0.0` から `5.0.0` へ上げる。
