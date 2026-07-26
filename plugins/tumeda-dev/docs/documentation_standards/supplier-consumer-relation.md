# supplier と consumer の関係

何かを **提供する側（supplier）** と、それを **使う側（consumer）** の間で、知識と複雑さをどちらに寄せるかの設計方針。

## このファイルの位置づけ

- コード・非同期メッセージング・ドキュメントなど、**「提供する側」と「使う側」** が現れる関係すべてに共通する上位方針
- 特定の実装観点ではなく、設計時に「知識・複雑さをどちらへ寄せるか」を判断するための考え方

## 用語

- **supplier（提供側）**: 機能・データ・イベント・ルールを **提供する側**。数は少ない（多くは 1）
- **consumer（消費側）**: supplier が提供するものを **使う側**。数が多い（1 supplier に対して N consumer になりやすい）

例: 1 つのクラス（supplier）を多数の呼び出し元（consumer）が使う。1 つの doc（supplier）を複数の skill（consumer）が参照する。

## 守ること: consumer を薄く、supplier を厚く

consumer は supplier のことを **最低限だけ知っていればよい** 状態に保つ。知識・複雑さを足すなら、**supplier 側を充実させて consumer は薄いまま** にする。

言い換えると、両者の間の窓口（インターフェース／契約）を薄くし、その内側の複雑さは supplier に閉じ込める。

設計時の問い: **この知識・判断、consumer 側に置こうとしていないか？ supplier 側に置けないか？**

### なぜか — 1:N の変更コスト

consumer は数が多い（1 supplier : N consumer）。複雑さや知識を consumer 側に持たせると、次が起きる:

- **変更点が N 倍に増える**: 同じ判断・ロジックを consumer の数だけ書くことになる
- **supplier の変更に全 consumer が追随させられる**: consumer が supplier の内部を知りすぎていると、supplier が少し変わるだけで N 箇所の修正が要る
- 1 箇所でも追随漏れがあれば、consumer 間で挙動が食い違う **バグの温床** になる

複雑さを supplier 側の 1 箇所に固めておけば、変更は supplier を直すだけで済み、consumer は薄いまま影響を受けない。

## 関係例

「supplier と consumer」は抽象。この repo では次のような具体形で現れる。いずれも「supplier を厚く、consumer を薄く」という同じ原則の現れ。

### 1. メソッド／クラスを定義する側（supplier）と、それを使う側（consumer）

- **supplier** = 振る舞いとデータを併せ持つクラス／ドメインモデル
- **consumer** = そのクラスを呼び出す側
- consumer が supplier の内部構造に踏み込まず、薄い窓口だけを使う関係。**デメテルの法則・カプセル化** が表現しているのはこれ
- **守らないと**: 判断ロジックが consumer 側に漏れ出し、supplier が単なるデータの入れ物に痩せる → **ドメインモデル貧血症**

### 2. 非同期メッセージングの publisher（supplier）と subscriber（consumer）

- **supplier** = イベントを publish する側
- **consumer** = subscribe して処理する側
- 非同期になっただけで、本質は 1 と同じ。イベントの意味・契約を publisher 側に固め、subscriber は薄く保つ

### 3. ドキュメント（supplier）と、それを参照してレビューする skill（consumer）

- **supplier** = ルール・観点を記述した doc（例: `implementation-standards/security.md`）
- **consumer** = その doc を参照してレビューする skill（例: `.ai_agent/skills/security-review`）
- skill は doc を **参照するだけ** の薄い作りにし、doc の中身を skill にコピーしない
- **守らないと**: ルールを各 skill に埋め込むと、doc を直すたびに全 skill を直す羽目になる（= 1:N の変更コスト）。skill を doc 駆動の薄い consumer に保つからこそ、doc の更新だけで全 skill に反映される
