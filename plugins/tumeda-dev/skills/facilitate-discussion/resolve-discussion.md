# 議論記録の入口を解決する

同じ記録ownerが実行する内部処理である。入力は既存の`discussion_directory`と任意の`discussion_file_name`だけとする。

## 存在だけを確認する

1. directory未指定なら具体的なpathを確認する。存在しなければ推測作成せず、consumerまたは利用者へ用意・再指定を求める。
2. name未指定なら`discussion.md`を使う。
   絶対path、`../`、path separatorを含む指定を拒否し、pathを含まないbasenameを求める。
   従来の入力を保ち、`.md`以外の拡張子や拡張子なしを追加拒否しない。
3. 単一file `<directory>/<name>` と、最後の拡張子を除いた同名directory（拡張子なしはbasenameそのもの） `<directory>/<stem>/` を調べる。
   分割先の入口は `<directory>/<stem>/<name>` である。
元fileと分割先が同pathになる場合は、そのpathがfileなら単一、directoryなら同名索引を持つ分割として判定する。両者が別pathの時の共存停止は維持する。

4. 本文読取を許される前は、helperの`resolve --directory <directory> --name <name>`だけを使う。
   存在・path種別だけを確認し、本文・hash・snapshotを先取りしない。

| 結果 | 次の処理 |
| --- | --- |
| single | そのfileを保持して継続する。h1やlegacy formatを一括変更しない |
| split | 同名索引を入口とし、範囲fileを同じ一つの論理記録として継続する |
| none | 同じ作業の既知記録や中断証拠と矛盾しない時だけ、先頭`# 議論記録`の単一fileを作る |
| 共存・索引欠落・path種別不正・取得不能 | 正本を推測せず、該当記録の処理を停止して実pathと理由を返す |

noneでも、既存記録があったという証拠を無視して新規作成しない。別作業や別basenameを探索して代用しない。

### 解決の完了gate

解決結果と現在stateが一意になった時だけ論点選択へ進む。入口解決だけの依頼では、新論点を作らず返してよい。

## 本文を読める段階へ渡す

[読取](read-discussion.md)へ入口・basename・許可された目的を渡す。
新旧共存が許されるのは、[分割](split-discussion.md)の明示候補検査中だけである。
通常の継続入口に候補を正本として選ばせない。
