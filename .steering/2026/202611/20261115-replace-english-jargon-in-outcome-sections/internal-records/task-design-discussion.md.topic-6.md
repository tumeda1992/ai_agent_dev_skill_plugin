# 内部検討記録: 論点6 — 今後の破壊的変更で、記録を残すことをどこで思い出させるか

**discussion:** [task-design-discussion.md](../task-design-discussion.md)

**論点:** 論点6

## 開始context

- 問題: 論点5で、今回の破壊的変更を`task-design/templates/breaking_changes/`に記録し、記録する線をREADMEで示すことになった。利用者は論点5の応答で、今後の破壊的変更でも同じように追えるようにしたいと述べた。READMEは記録の置き場所にあるため、破壊的変更を行う人がそこを開かなければ、記録を残すことを思い出せない。
- 決める範囲: 破壊的変更を行う時に、記録を残すことを思い出させる一文をどこに置くか。記録の線と中身はREADMEが持つ。
- 開始時の既決条件: 論点5の合意済みの部分（名前の切り替え、記録の中身、steeringに置く一文、9.0.0、directory名）。

<a id="iteration-0"></a>

## イテレーション0: 破壊的変更を行う人が、必ず通る場所を探す

<a id="iteration-0-record-1"></a>

### 調査: 破壊的変更の時に必ず読まれる場所

#### 問い・探索範囲・方法

破壊的変更を行う人が必ず読む場所に一文を置けば、記録を思い出せる。そういう場所があるかを確かめる。

- 方法: `plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md`の「Plugin version」節を読んだ。

#### 見つかった事実

- 「Plugin version」節は、「破壊的変更はMAJOR、後方互換な機能追加はMINOR、後方互換な修正・文書変更はPATCHを上げる」と定める。versionを変える時、または配布前に検証する時に読まれる。
- 配布する変更には必ずversion bumpを行うため、破壊的変更はMAJORの判定でこの節を通る。

#### 解釈・残る不足・次action

- MAJORを上げると判定した時点が、破壊的変更を行う人が必ず通る場所である。ここに一文を置けば、記録を残すことを思い出せる。
- 一文は、どの変更で記録するかの線と、記録の中身をREADMEへ委ね、ここへ写さない。
- 今は`task-design`だけが`breaking_changes/`を持つ。他のskillの成果物で同じ変更が起きた時は、そのskillのテンプレートの置き場所に同じdirectoryを作る、とする。

<a id="iteration-1"></a>

## イテレーション1: 共通の規則に個別のskillを持ち込まない

入口は提案0への利用者の応答。

> 論点6について、maintenance-plugin-context/SKILL.md に書くのはいいけど、それは全般に同じ規則を適用するから。だからtask-designを名指しで指名するとかありえない。共通の原則のところに個別の事書くとかセンスなさすぎるよね。

<a id="iteration-1-record-1"></a>

### 原因の特定: なぜ共通の規則が個別のskillを名指したか

#### 期待との差

- 期待: pluginの全skillに当たる共通の規則には、全skillに当たる内容だけを書く。
- 実際: 提案0は、共通の規則（`maintenance-plugin-context`の版の規則）から、記録する線と書き方の正本として`task-design/templates/breaking_changes/README.md`を名指した。

#### 原因

- 論点5で、記録する線と1件の書き方をtask-designのREADMEへ書く構成を先に決め、論点6ではその構成を前提に「共通の規則からREADMEを指す」一文を足した。線と書き方がtask-design固有か、全skillに当たるかを問い直さなかった。
- 線（以前の版のskillが作った成果物を、今の版で名前で読めなくなる変更）も書き方（版、旧名と新名、理由、読み方）も、どのskillの成果物にも当たる。全skillに当たる内容の正本を個別のskillに置いたため、共通の規則が個別を参照する逆向きの依存になった。
- 既存の標準に照らしても誤りである。`docs/development_standards/naming/core.md`の「中身を足す前に、名前が約束する範囲に入るかを確かめる」に当てれば、task-designのpathは「Plugin version」節の範囲に入らない。

#### 修正先

- 全skillに当たる線と書き方は、共通の規則に置く。
- task-designの`breaking_changes/README.md`には、このdirectoryに何が入るかと、task-designの成果物での具体例だけを置き、線と書き方は共通の規則を参照する。参照は個別から共通への向きになる。
