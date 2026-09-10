---
name: share-work-in-progress
description: 作業中のbranchの内容を、依頼者がGitHub上で読める状態にする。「出来上がったものをちょっと見たい」など、動作確認の完了を待たずに今のbranchの中身を共有したい時に使う。tasklist-executorの「ユーザー動作確認が完了するまでcommit・push・PRを行わない」契約とは前提が逆であり、動作確認の後に呼ぶものではない。
---

# 作業中branchの共有

## 目的と成果

今いるbranchの内容を、依頼者がGitHub上で読める状態にする。成果は一つの起動で成立する。

- commitが無ければ、working treeの全部をuntracked含めて一つのcommitにする。
- pushできるcommitが無ければ、空commitを作ってでもpushする。
- 同じhead branchにopen PRが既にあれば、重複作成せずそのURLを返す。無ければ作る。

結果、依頼される側はcommit・push・PR作成の手順をその場で毎回組み立てなくて済み、依頼者はURLを開くだけで現在の成果物を確認できる。

## 起動gate

`tasklist-executor`は「ユーザー動作確認が完了するまでcommit・push・PRを行わない」契約を持ち、公開は動作確認の後に来る。このskillは動作確認の**前**に呼ばれる。両者は公開の前提が逆であり、`tasklist-executor`が動いている最中の成果物へこのskillを重ねて呼ばない。

このskillが作るcommitは、後からamendやrebaseで整理される前提を持つ。履歴として残すためのcommitではない。

## 停止条件

次のいずれかに該当する場合、commitを作らず停止して報告する。確認を取っても実行できないため、確認を挟まない。

- current branchがdetached HEADである。
- remoteが存在しない。

## 確認を取る条件

current branchがremoteのdefault branchである場合、運用形態を推定しない。default branchを保護対象としてPR経由で更新するrepositoryと、default branchをそのまま作業branchとして使うrepositoryでは、同じ操作の意味が反転する。merged PRの有無、branch protectionの設定、他のbranchの有無、利用先contextの宣言のいずれからも運用形態を推定せず、commitする前に利用者へ確認を取る。承認されなければ、working treeを変えずに停止する。

## 実行workflow

1. current branch、remoteの有無、default branch名を確認する。detached HEADまたはremote不在なら[停止条件](#停止条件)に従い停止する。
2. current branchがdefault branchなら、[確認を取る条件](#確認を取る条件)に従い、commitする前に利用者へ確認を取る。承認されなければ停止する。
3. 未commitの変更があれば、untrackedを含めてすべてstageし、一つのcommitにする。commit messageは`WIP: share work in progress`とする。
4. 未commitの変更が無く、かつremoteとHEADが同じでpushできるcommitも無い場合だけ、空commitを作る。空commitはPRを成立させるための最小差分であり、見せるための差分ではない。
5. current branchをpushする。rejectされたら停止し、remoteと分岐していることを報告する（[失敗の扱い](#失敗の扱い)）。
6. default branchでなく、かつ`gh`が使える場合だけ、`../scripts/github/create_or_get_pr.sh`を呼ぶ。既にopen PRがあれば作成せずURLが返る。
7. 到達した地点を報告する。PRのURL、またはpushまでで止まった理由を示す。

script pathの起点はpluginのskills directoryである。利用先repositoryからの相対pathではない。

## 部分成功の扱い

目的が部分的にしか達成できない場面でも、達成しない結果を返さない。どこまで進んだかを報告する。

- `gh`が使えない、またはGitHubでないrepositoryの場合: pushまでを部分成功として報告する。remoteにbranchがあれば差分は読める。
- default branchでの実行の場合: PRを作れないため、pushまでを部分成功として報告する。

## 失敗の扱い

- pushがrejectされた場合: 停止する。commitは既に作られており、localには残る。force pushは行わない（[このskillが絶対にやらないこと](#このskillが絶対にやらないこと)）。利用者が分岐を解消してから呼び直す。
- default branchでの不承認の場合: 停止する。commitを作る前に停止するため、working treeは変わらない。

## このskillが絶対にやらないこと

- force pushを行わない。`--force-with-lease`による自動再試行も行わない。この保護は「自分が最後にfetchしたremote先端」との比較で成り立つため、手順に`git fetch`を挟むと効かなくなる。安全性を手順の書き方に依存させない。
- PRをmergeしない。
- PR本文を生成する仕組みを持たない。本文はPR作成scriptが持つ範囲に留める。
- 利用先repositoryのCIや自動化を変更しない。
