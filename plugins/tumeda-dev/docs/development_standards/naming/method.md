# メソッド名

メソッド名に固有の規則。どの対象にも効く原則は [core.md](./core.md) が持つ。

## `レシーバー.メソッド名` で意味が通る名前にする

メソッド名単体でなく、呼び出しの形 `receiver.method` で読んだときに意味が通ること。

- ✗ `member.check` / `bill.process` — レシーバと合わせても何をするか曖昧
- ○ `member.active?` / `bill.settle` / `member.initial_verification_status` — 呼び出しの形で意味が通る
