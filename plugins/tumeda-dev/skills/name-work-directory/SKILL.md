---
name: name-work-directory
description: 作業成果物を格納するディレクトリの安定した basename を決める。実装、調査、計画などの作業用ディレクトリに再利用可能な日付付きの名前が必要なときに使う。
---

# 作業ディレクトリの命名

## 作業限定の暫定指示を取得する

起動・別sessionからの再開・resume・把握した指示変更時に、元作業のexactな場所、consumer `name-work-directory`、
対象処理、実際に使うこのSKILL.mdの取得元を`maintenance-plugin-context`へ渡し、暫定指示を取得する。
選択・競合・実行版の判断は管理担当へ委ねる。
activeの実効指示に従い、paused/unavailableでは影響する暫定動作を止めて理由を返す。
none/endedでは既存処理へ進む。
元作業不明を別作業の探索で補わない。
通常の返信・内部file再読・think-throughの毎turn適用を定期取得へ変えない。
同一sessionの登録・改訂結果は返却された更新を使い、通知されていない編集を常時検知できるとは扱わない。

この呼出し用の作業contextは命名入力へ足さず、basenameは引き続き作業内容とローカル日付だけから決める。
元作業がまだ未確定なら取得不能を黙ってnoneにせずcallerへ返し、callerが元作業を確定した時に取得する。


basename だけを決める。ディレクトリの作成や確認はしない。

元作業directoryが未確定なら、取得不能をnoneにせず管理担当へ不足を返す。
既存ownerによる命名・directory確定に必要な処理は続け、影響する暫定動作だけを待ちにする。
元作業が確定した直後に取得し、先に対象の暫定動作を実行しない。

## 入力

次だけを使う。

- ディレクトリに格納する作業内容
- 実行時のローカル日付

## 出力

次の形式の basename を一つだけ返す。

```text
YYYYMMDD-slug
```

slug の規則を適用する前に、`plugins/tumeda-dev/docs/development_standards/naming/README.md` を入口として引き、そこの引き方に従う。個別 file を名指ししないのは、どの file が該当するかの判断を README 側へ持たせ、`naming/` 配下の file の増減でこの skill を直さずに済ませるためである。

`YYYYMMDD` には入力されたローカル日付を使う。`slug` は作業内容を英語で要約したものにする。

- 英小文字の kebab-case とし、文字、数字、ハイフンだけを使う。
- 可能な限り 3〜8 語にする。
- 動詞と目的語の組み合わせを優先する。
- 意味を増やさない冠詞は省略する。

一度 basename を決めたら、同じ作業中は変更しない。

## 責務境界

branch 名を取得・含有しない。親パスの決定、ディレクトリ作成、名前衝突の確認もしない。これらは呼び出し側が担う。

Git リポジトリや特定の workflow の存在を前提にしない。

## 例

- ローカル日付が `2026-07-26` で、作業が「作業ディレクトリの命名を skill として切り出す」の場合は `20260726-extract-work-directory-naming` になる。
- ローカル日付が `2026-07-26` で、作業が「決済リトライの失敗原因を調査する」の場合は `20260726-investigate-payment-retry-failures` になる。
