# C3 after試作 v1: 技術的反証と受容する制約を経て最終決定する

**位置づけ:** 一度成立したdecisionを後続evidenceで再開し、旧decisionの履歴を残しながら現在有効なdecisionだけを置換し、残る制約を受容して確定できるか評価するafter。共通format案ではない。

**source:** 非公開の利用先記録から一般化したcase（論点4「スレッド本文取得方法」イテレーション0〜4）

このfileは、sourceのイテレーション4までを適用した最終状態を示す。

---

## 論点4: root postからthread本文を取得する

**ステータス:** 決定

### イテレーション0: rootを保存する利用者に必要なforward取得へ絞る

#### 提案0

thread本文は、保存対象のroot postから子postへ進むforward方向で取得する。backward traversalは候補から外し、forward取得できるAPIを比較する。

| 候補 | forward取得 | この用途での制約 |
| --- | --- | --- |
| `search/recent` | 可能 | 7日を超えたpostを取得できず、全文の魚拓用途を満たさない。 |
| `search/all` | 可能 | Pro tierが必要で、費用がこのprojectの前提に合わない。 |
| `GET /v1/authors/:authorId/posts` | 可能 | 7日制限はない。authorのtimelineから同じconversationだけをfilterする必要がある。 |

次の検証対象をuser timelineに絞り、rootより後のpostをどう小さい探索範囲で取得するかを決める。

#### 提案背景

保存するのはthread末尾ではなくrootであり、目的は連投を含む全文の魚拓を残すことである。`referenced_posts`を辿るbackward traversalは子から親へ遡るため、rootを起点にするとroot自身しか取得できない。

一般的な利用者がthread末尾を保存するという想定ではなく、このserviceの唯一の利用者がrootを保存する行動を設計条件にする。その条件から、方向の合わない候補を先に外す。

#### 提案0へのフィードバック

**結果:** user timeline候補の具体検証へ進行

sourceには提案0への独立したuser feedbackは保存されていない。次のiterationでは、forward取得候補のうち7日制限がないuser timelineへ`since_id`を指定する方法が具体的に検証されている。

### イテレーション1: since_id単独では探索範囲が広いと判定する

#### 提案1

user timelineへroot IDを`since_id`として指定し、同じconversationに属する子postを取得する。

```text
GET /v1/authors/{authorId}/posts?since_id={rootId}
  ↓
rootより新しいpostをnewest-firstで取得
  ↓
conversation_id === rootId のpostだけを残す
```

この方式はforward取得と7日制限回避を成立させるが、採用しない。root以降にauthorが投稿した全postが対象になり、古いthreadほど継続postが深いpageへ押し出されるためである。

#### 提案背景

提案0で残したuser timelineを使うには、rootより後という下限と、同じthreadというfilterが必要になる。`since_id`と`conversation_id`でこの二条件は表現できる。

一方、API結果はnewest-firstである。authorがroot以降に多く投稿しているほど、root直後のthread postへ届くまでのpaginationが増える。取得可能かだけでなく、実際の探索範囲を小さくできることが次案の条件になる。

#### 提案1へのフィードバック

**結果:** 自己reviewで不採用

> 著者が根以降に多くツイートしているほど深いページネーションが必要になる

forward取得と7日制限回避は成立するが、探索範囲が広すぎる。rootの作成時刻を使って取得範囲を狭める案へ進む。

### イテレーション2: rootから3時間の時間窓で二段階取得する

#### 提案2

user timelineへ`start_time`と`end_time`を指定し、root作成時刻から最大3時間の範囲だけを二段階で取得する。

```text
root post
  ↓
Stage 1: rootから30分、最大5件でprobe
  ├── 同じconversationの子postなし → 単体postとして扱う
  └── 子postあり
        ↓
      Stage 2: rootから3時間、最大50件を取得
        ↓
      同じconversationのpostだけを残して昇順sort
```

requestとfilterは次の形にする。

```text
GET /v1/authors/{authorId}/posts
  ?start_time={root.created_at}
  &end_time={root.created_at+30mまたは3h}
  &post.fields=conversation_id,text,created_at
  &max_results={5または50}

filter: conversation_id === rootId
```

3時間と50件はAPIから確定する値ではなく、確認できたthreadが約1時間半で完結した実例から置く調整可能な上限とする。author timelineの最新3,200件より古いpostは取得できない制約も残る。これらを固定仕様として隠さず、調整可能な値と取得限界としてdocumentへ残す。

#### 提案背景

提案1の問題はforward取得そのものではなく、`since_id`だけではroot以降の全期間が探索対象になることだった。threadは通常rootの直後に連続して投稿されるため、IDの下限だけでなく時間の上限を指定すれば、authorの総投稿量に左右されにくい小さなwindowにできる。

単体postまで常に50件取得しないよう、短いprobeでthreadの有無を確認してから本取得へ進む。探索範囲、request数、thread本文の欠落回避を同時に判断できる具体像として二段階取得を示す。

#### 提案2へのフィードバック

**結果:** sourceで決定

sourceには独立したuser feedback原文は保存されていない。同じiterationの`決定`で、二段階取得、3時間上限、調整可能な数値のdocumentationが採用されている。

### イテレーション3: Elevated access制約で時間窓方式を撤回する

#### 提案3

`start_time / end_time`方式を撤回し、user timelineへ`since_id`を指定して最大5 page取得する方式へ置き換える。

```text
GET /v1/authors/{authorId}/posts
  ?since_id={rootTweetId}
  &max_results=100
  &post.fields=conversation_id,text,created_at,author_id
  ↓
最大5 pageをpagination
  ↓
同じconversation・同じauthor・root自身以外のpostを残す
```

filterは次の三条件をすべて満たすpostだけを残す。

```text
conversation_id === rootTweetId
author_id === authorId
id !== rootTweetId
```

`MAX_PAGES=5`により取得上限を500件とする。`since_id`単独ではroot以降の探索範囲が広いというイテレーション1の弱点は残るが、7日を超えたthreadを取得できるBasic tierの方法を優先する。

#### 提案背景

##### Evidence

実装時の検証で、`start_time`と`end_time`はElevated accessが必要だと判明した。Basic tierでは両parameterが無視され、意図した時間窓ではなく直近の少数件だけが返る。イテレーション2の二段階取得は、現在のaccess tierでは実行できない。

##### 無効になった判断

イテレーション2では、user timelineへ絶対時刻を指定すれば、7日制限を避けながらroot直後の小さいwindowを取得できると判断した。APIの探索効率ではなく、parameterを利用できるaccess tierという前提が成立しなかったため、このdecisionを撤回する。

##### 置換理由

agentは制約発覚後、userへ相談せず`search/recent`へ切り替え、7日を超えたthreadは取得不能として扱おうとした。しかし全文の魚拓が目的なので、7日制限はイテレーション0で既に用途不適合と判定されている。

残る候補では、イテレーション1で探索範囲が広いと評価した`since_id`が、7日制限を持たずBasic tierで実行できる。効率上の弱点をpagination上限で制御し、用途を壊す7日制限より優先する。

#### 提案3へのフィードバック

**結果:** 受諾

> 7日制限で取れないほうが使い物にならない。since_id を試すだろ

時間窓方式を撤回し、`since_id`を試す。相談なしに`search/recent`へ切り替えた案は採用しない。

### イテレーション4: until_idで探索窓を狭め、取得不能を可視化する

#### 提案4

`since_id`へ`until_id=rootCreatedAt+3h`を組み合わせ、root直後の3時間だけを探索する。pagination上限は3 pageとする。

```text
rootTweetId ───────────────→ since_id
rootCreatedAt + 3h
  └── timestampからsnowflake IDへ変換 → until_id

user timelineを最大3 page取得
  ↓
同じconversation・同じauthor・root自身以外のpostを残す
  ↓
0件なら、取得できなかった可能性をsyncErrorとして残す
```

requestは次の形にする。

```text
GET /v1/authors/{authorId}/posts
  ?since_id={rootTweetId}
  &until_id={timestampToSnowflakeId(rootCreatedAt+3h)}
  &max_results=100
  &post.fields=conversation_id,text,created_at,author_id
```

Basic tierでは、author timelineの最新3,200件より古いpostを取得できない。filter結果が0件でも、それが3,200件window外のthreadなのか、子postを持たない一本postなのかをAPIから区別できない。情報欠落の可能性を黙って消すより、両方に`syncError`を付ける方を採用する。

#### 提案背景

##### since_id単独で残った問題

イテレーション3の`since_id`単独では、root以降にauthorが投稿した全postをnewest-firstで辿る。activeなauthorの古いthreadでは、root直後の子postが深いpageへ押し出され、`MAX_PAGES=5`でも届かない。

threadがroot直後の数時間に書かれるというイテレーション2の判断は、時間parameterが使えないことによって無効になったわけではない。絶対時刻parameterの代わりに、root作成時刻から3時間後のsnowflake IDを上限として使い、ID範囲で探索窓を作る。

##### 3,200件上限のevidence

`until_id=root+3h`で0件になるcaseを調べ、未来のIDを指定するとpostが返る一方、古いrootの3時間後を指定すると0件になることを確認した。user timelineは最新3,200件だけにaccessでき、activeなauthorの古いrootはこのwindow外になる。

この制約はpagination数を増やしても解消できず、Basic tierでは構造的に取得不能である。古いthreadを必ず取得できるという条件は外し、取得不能を検知可能にすることを現在案の条件へ変える。

##### 一本postとの区別不能

filter結果が0件になるのは、threadが3,200件window外にある場合だけではない。子postを持たない一本postも0件になる。Basic tierのAPIでは二つを区別できないため、古いthreadだけへ正確に`syncError`を付けることはできない。

#### 提案4へのフィードバック

**結果:** 制約を受容して受諾

sourceでは、一本postにも`syncError`が付く可能性を理解したうえで、何も記録せず情報欠落を見逃すより、取得できなかった可能性を残す方がよいと判断されている。3,200件window外の古いthreadをBasic tierで取得できないことも受容している。

### 決定

root postからthread本文をforward取得するため、user timelineへ`since_id=rootTweetId`と`until_id=rootCreatedAt+3h`を指定する方式を採用する。

一pageあたり最大100件、`MAX_PAGES=3`としてpaginationする。取得結果から、同じconversation、同じauthor、root自身以外という三条件を満たすpostだけをthread本文へ含める。

Basic tierでは最新3,200件より古いthreadを取得できない。また、取得結果が0件の時、window外のthreadと一本postを区別できない。どちらの場合も`syncError`を残し、取得できなかった可能性を可視化する。一本postへの誤検知を受容し、情報欠落の可能性を黙って消さないことを優先する。
