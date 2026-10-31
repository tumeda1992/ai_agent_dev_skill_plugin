---
name: escalate-plugin-skill-fix
description: このpluginのskill、docs、template、scriptに対する修正提案が生じた時に使う。利用先repositoryで作業中でもplugin repositoryで作業中でも、提案が生じた瞬間、または元担当が同じ作業の保留条件を再確認・再開する時に起動する。plugin repositoryかどうかの判定はこのskillの内部で行うため、起動条件には含めない。通常の設計議論や、利用先repository自身のcodeに対する修正では起動しない。
---

# Escalate plugin skill fix

## 作業限定の暫定指示を取得する

起動・別sessionからの再開・resume・把握した指示変更時に、元作業のexactな場所、consumer `escalate-plugin-skill-fix`、
対象処理、実際に使うこのSKILL.mdの取得元を`maintenance-plugin-context`へ渡し、暫定指示を取得する。
選択・競合・実行版の判断は管理担当へ委ねる。
activeの実効指示に従い、paused/unavailableでは影響する暫定動作を止めて理由を返す。
none/endedでは既存処理へ進む。
元作業不明を別作業の探索で補わない。
通常の返信・内部file再読・think-throughの毎turn適用を定期取得へ変えない。
同一sessionの登録・改訂結果は返却された更新を使い、通知されていない編集を常時検知できるとは扱わない。


元作業directoryが未確定なら、取得不能をnoneにせず管理担当へ不足を返す。
既存ownerによる命名・directory確定に必要な処理は続け、影響する暫定動作だけを待ちにする。
元作業が確定した直後に取得し、先に対象の暫定動作を実行しない。

## 目的と成果

このpluginのskill・docs・template・scriptのいずれかに対して「こう直すべきだ」という提案が生じたとき、その提案を実際に直せる場所――このpluginのskill群を持つplugin repository――へ確実に運ぶ。

このskillが存在しない状態では、提案は生まれた場所（多くは利用先repository）で議論が進み、合意してからplugin repositoryへ手作業で移設することになる。
移設は記録の採番衝突、発言原文の意図しない改変、利用先固有情報の混入という事故を生む。
明示保留がない場合は「提案が生じた時点で、記録を始める前にplugin repositoryへ移る」経路を使う。
利用者が保留を明示した場合は、元作業へ固定した控えを保存し、指定条件から引渡しを再開する。

即時引渡しの成果は、plugin repositoryで`steering`が起動した状態である。
明示保留では元作業のメモと追跡を保存して元の担当へ返す。
以降の設計・議論・実装は`steering`の通常flowが引き継ぐ。

## 起動gate

起動するのは、このpluginのskill、docs、template、scriptに対する修正提案が生じた時、
または元担当が同じ作業の既存保留条件を再確認・再開する時である。
後者は新しい提案の発生を要求せず、[保留と再開](pending-escalations.md)の「元担当の状態遷移から再確認する」へ渡す。

- 今いるrepositoryがplugin repositoryかどうかは、起動条件に含めない。その判定は起動後にこのskill自身が行う（`## plugin repositoryの判定`）。判定を起動条件に混ぜると、判定を誤った経路がこのskillへ到達しなくなり、結局同じ事故が形を変えて再発する。起動は広く、判定は内側で行う。
- 次の場合は起動しない。
  - 通常の設計議論（新機能の要件整理、実装方針の相談など、修正提案という形を取っていないもの）
  - 利用先repository自身のcode・設定・docsへの修正提案（このpluginの成果物ではないもの）

## 作業先を切り替える前の保留判定

起動gateを通った後、実際の利用者指示に個別または同じ作業内の明示保留があるかを確認する。
明示保留または既存保留メモの再確認・再開では、[保留と再開](pending-escalations.md)を読み、元作業への保存・条件確認・受領追跡を行う。
保留を保存した時は元作業へ返す。条件成立後の実際の転送は下の既存経路へ戻る。
保留指示がなければ即時引渡しを継続し、メモの存在や慣習だけで保留にしない。
この判定は現在がplugin repositoryでも省略しない。


## plugin repositoryの判定

### 判定方法

`git rev-parse --show-toplevel`で現在のGit rootを取得する。取得できた場合、そのrootにこのplugin自身のskill群（例: `plugins/tumeda-dev/skills/`）が存在するかを確認し、存在すればplugin repositoryとみなす。

Git rootが取得できない、またはこの判定だけではplugin repositoryかどうかを確定できない場合は、そのまま進めず停止する。提案は現在のsessionに残したまま、ユーザーへplugin repositoryのpathを尋ねる。推測で判定しない。

### plugin repositoryだった場合

現在のrepositoryが既にplugin repositoryであれば、移動もrepository固有情報の除去も不要である。そのまま`steering`を`branch_from_basename=true`で起動し、このskillは終了する。

## plugin repositoryでない場合の引き渡し

### 引き渡す内容

次の四点を、利用先repository固有の情報を除いた形で取り出す。

- 提案の内容
- その提案が必要だと分かった具体例
- 提案の根拠
- 利用者が合意した範囲。引き渡すことへの合意と提案の中身への合意を分け、利用者の原文を添える。中身や根拠をassistantが書いた場合は、その旨を示す。

受け取った側は、利用者の原文で確かめられない中身を未合意として扱い、設計で改めて合意を取る。

除去すべき固有情報（利用先repository名、所有者名、絶対path、固有ドメイン名、固有steering slugなど）の規約はこのskillが持たない。正本は`plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies/migration.md`である。除去すると提案の意味が保てなくなる場合は、無理に一般化せず、`migration.md`が定める規約に従って停止する。

### 作業対象の切り替え

working directoryをplugin repositoryへ移す。作業branchは`steering`が作る。

`steering`は起動時のworking directoryを基準に`.steering/`を解決する。working directoryの切り替えだけが、これから行う作業対象を`steering`へ伝える唯一の手段である。切り替えを省略すると、`steering`は利用先repository側の`.steering/`を解決してしまい、提案は結局利用先repositoryに記録される。

### 起動するもの

working directoryの切り替えが終わったら、plugin repositoryで`steering`を`branch_from_basename=true`で起動する。以降の設計・議論・実装は`steering`の通常flowに委ねる。

このrepositoryへの変更は利用先からの提案が起点であり、その都度固有の題材になるためissue番号のような安定した識別子を持たない。branch名をsteering directoryのbasenameに揃えると、branch一覧が日付順に並び、branch名からsteering記録を一意に引ける。

### 利用先側に残すもの

利用先repositoryのdiscussion fileには、次の三つだけを残す。

1. この提案はplugin repositoryで扱う旨
2. plugin repository側で作業するsteering directoryのbasename
3. 引き渡した提案の要旨（一行）

議論の続きや合意内容そのものを利用先側に書き足さない。続きはplugin repository側の記録が正である。

## 引き渡し後

- 利用先repository側の元taskは中断したまま残る。plugin repository側の作業が終わってから、その続きに戻る。
- 修正したskillは、pluginをupdateしただけでは、今実行中のsessionへ反映されない。skill内容はsession開始時に読み込まれるためである。反映する操作は[取り込みと反映](integrate-plugin-changes.md)の7に従う。
- **escalateのためにsessionを新規作成しない。** 新規作成するとcontextが失われ、元taskと進行中の議論の両方を説明し直すところから始まる。escalateは、提案が生じたsessionの中で行う。
- 元taskを旧版のskillのまま続けるか、反映して修正後のskillで続けるかは、ユーザーが選ぶ。このskillが代わりに決めない。

### plugin repositoryでの作業完了後の取り込み

plugin repositoryでのsteeringがcommitまで終わったら、[取り込みと反映](integrate-plugin-changes.md)に従い、PRを経由せず`main`へ取り込み、pluginをupdateする。

## 責務境界

このskillは引き渡しの経路だけを持つ。次の判断・規約はそれぞれの正本に委ね、複製しない。

- 利用先固有情報の除去規約・意味保存の判断 → `migration.md`
- 議論の進行、提案・feedback・決定の記録 → `facilitate-discussion`
- repository固有文脈、配布version規約 → `maintenance-plugin-context`
- plugin repositoryでの設計・実装のorchestration → `steering`

## このskillが絶対にやらないこと

- 提案についての議論を自分で進行・継続しない。議論は`facilitate-discussion`に委ねる。
- 固有情報の除去ルールを自分で定義・判断しない。`migration.md`を参照するだけで、規約そのものは持たない。
- 専用の設計・実装processを持たない。plugin repositoryへ移った後は`steering`の通常flowに従う。
- version bumpの要否や区分を自分で決めない。
- plugin repositoryかどうかの判定を保留したまま、あるいは推測だけで、利用先repositoryのまま議論や記録を進めない。
