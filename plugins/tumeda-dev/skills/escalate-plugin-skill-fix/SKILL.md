---
name: escalate-plugin-skill-fix
description: このpluginのskill、docs、template、scriptに対する修正提案が生じた時に使う。利用先repositoryで作業中でも正本repositoryで作業中でも、提案が生じた瞬間に起動する。正本repositoryかどうかの判定はこのskillの内部で行うため、起動条件には含めない。通常の設計議論や、利用先repository自身のcodeに対する修正では起動しない。
---

# Escalate plugin skill fix

## 目的と成果

このpluginのskill・docs・template・scriptのいずれかに対して「こう直すべきだ」という提案が生じたとき、その提案を実際に直せる場所――このpluginの正本repository――へ確実に運ぶ。

このskillが存在しない状態では、提案は生まれた場所（多くは利用先repository）で議論が進み、合意してから正本repositoryへ手作業で移設することになる。移設は記録の採番衝突、発言原文の意図しない改変、利用先固有情報の混入という事故を生む。このskillは「提案が生じた時点で、記録を始める前に正本repositoryへ移る」ことを徹底し、移設という工程自体をなくす。

成果は、正本repositoryで`steering`が起動した状態で終わる。以降の設計・議論・実装は`steering`の通常flowが引き継ぐ。

## 起動gate

起動条件は「このpluginのskill、docs、template、scriptに対する修正提案が生じた」という観測可能な行為だけである。

- 今いるrepositoryが正本かどうかは、起動条件に含めない。正本か否かの判定は起動後にこのskill自身が行う（`## 正本repositoryの判定`）。判定を起動条件に混ぜると、判定を誤った経路がこのskillへ到達しなくなり、結局同じ事故が形を変えて再発する。起動は広く、判定は内側で行う。
- 次の場合は起動しない。
  - 通常の設計議論（新機能の要件整理、実装方針の相談など、修正提案という形を取っていないもの）
  - 利用先repository自身のcode・設定・docsへの修正提案（このpluginの成果物ではないもの）

## 正本repositoryの判定

### 判定方法

`git rev-parse --show-toplevel`で現在のGit rootを取得する。取得できた場合、そのrootにこのplugin自身のskill群（例: `plugins/tumeda-dev/skills/`）が存在するかを確認し、存在すれば正本repositoryとみなす。

Git rootが取得できない、またはこの判定だけでは正本かどうかを確定できない場合は、そのまま進めず停止する。提案は現在のsessionに残したまま、ユーザーへ正本repositoryのpathを尋ねる。推測で正本と決めつけない。

### 正本だった場合

現在のrepositoryが既に正本であれば、移動もrepository固有情報の除去も不要である。そのまま`steering`を`branch_from_basename=true`で起動し、このskillは終了する。

## 正本でない場合の引き渡し

### 引き渡す内容

次の三点を、利用先repository固有の情報を除いた形で取り出す。

- 提案の内容
- その提案が必要だと分かった具体例
- 提案の根拠

除去すべき固有情報（利用先repository名、所有者名、絶対path、固有ドメイン名、固有steering slugなど）の規約はこのskillが持たない。正本は`migration.md`である。除去すると提案の意味が保てなくなる場合は、無理に一般化せず、`migration.md`が定める規約に従って停止する。

### 作業対象の切り替え

working directoryを正本repositoryへ移す。作業branchは`steering`が作る。

`steering`は起動時のworking directoryを基準に`.steering/`を解決する。working directoryの切り替えだけが、これから行う作業対象を`steering`へ伝える唯一の手段である。切り替えを省略すると、`steering`は利用先repository側の`.steering/`を解決してしまい、提案は結局利用先repositoryに記録される。

### 起動するもの

working directoryの切り替えが終わったら、正本repositoryで`steering`を`branch_from_basename=true`で起動する。以降の設計・議論・実装は`steering`の通常flowに委ねる。

このrepositoryへの変更は利用先からの提案が起点であり、その都度固有の題材になるためissue番号のような安定した識別子を持たない。branch名をsteering directoryのbasenameに揃えると、branch一覧が日付順に並び、branch名からsteering記録を一意に引ける。

### 利用先側に残すもの

利用先repositoryのdiscussion fileには、次の三つだけを残す。

1. この提案は正本repositoryで扱う旨
2. 正本側で作業するsteering directoryのbasename
3. 引き渡した提案の要旨（一行）

議論の続きや合意内容そのものを利用先側に書き足さない。続きは正本repository側の記録が正である。

## 引き渡し後

- 利用先repository側の元taskは中断したまま残る。正本repository側の作業が終わってから、その続きに戻る。
- 正本repositoryで対象のskillを修正しても、それは今実行中のsessionには反映されない。skill内容はsession開始時にcacheされるため、修正後のskillで動くには新しいsessionを開始する必要がある。
- 元taskを旧版のskillのまま続けるか、新しいsessionを開始して修正後のskillで再開するかは、ユーザーが選ぶ。このskillが代わりに決めない。

### 正本repositoryでの作業完了後の取り込み

正本repositoryでのsteeringがcommitまで終わったら、PRを経由せず次の4stepで`main`へ取り込む。

1. 作業branchをpushする。
2. `main`へ切り替える。
3. 作業branchを`main`へmergeする。
4. `main`をpushする。

PRを経由しないのは、正本repositoryが利用先repositoryから見てsubであり、pluginの更新がメインの作業を再開するための前段だからである。PRを開いてreviewを待つ相手がいないため、review単位としてのPRが機能しない。変更の妥当性は正本repositoryでのsteeringがdesign合意とtasklist合意で担保しており、PRはその上に別のgateを重ねるものではない。

## 責務境界

このskillは引き渡しの経路だけを持つ。次の判断・規約はそれぞれの正本に委ね、複製しない。

- 利用先固有情報の除去規約・意味保存の判断 → `migration.md`
- 議論の進行、提案・feedback・決定の記録 → `facilitate-discussion`
- repository固有文脈、配布version規約 → `maintenance-plugin-context`
- 正本repositoryでの設計・実装のorchestration → `steering`

## このskillが絶対にやらないこと

- 提案についての議論を自分で進行・継続しない。議論は`facilitate-discussion`に委ねる。
- 固有情報の除去ルールを自分で定義・判断しない。`migration.md`を参照するだけで、規約そのものは持たない。
- 専用の設計・実装processを持たない。正本repositoryへ移った後は`steering`の通常flowに従う。
- version bumpの要否や区分を自分で決めない。
- 正本判定を保留したまま、あるいは推測だけで、利用先repositoryのまま議論や記録を進めない。
