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
