# 基盤の仕組みを消す時の範囲

使わなくなった基盤の仕組み（cloud の resource とその構成、それを届ける workflow、外部の service への登録）を消す時に、何を消し、何を残すかの判断基準。
別の仕組みへ置き換えて、旧い仕組みを消す時を含む。

この標準は、何を消し、何を残すかの一覧を受け持つ。
一覧を作り、消す前に確かめ、消した後に実物と突き合わせるまでを扱う。
消したことで影響を受ける動きの確かめは [`change_verification.md`](./change_verification.md) が持つ。

## 作ったもの・付けたものまで辿って、消す一覧を作る

- MUST: 消す一覧は、最初の調査で見えた resource で終えない。その仕組みの resource が作ったもの・付けたものまで辿って一覧にする。

辿る先は、次の三種類である。

- 相手側の登録: その仕組みを動かすために、別の service へ登録したもの。例えば、GitHub に登録した webhook、deploy の service の側にある webhook、通知先、定期実行の schedule の rule。
- それだけに付いた権限: その仕組みの role にだけ付いた policy、その仕組みのためだけに作った user や key。
- 書き出した成果物: その仕組みが動いて書き出したもの。例えば、build の artifact、container の image、共有の bucket の中の object。

理由:

- これらは、仕組みの設定画面や一覧の command では直接見えないことが多い。最初の調査で見えた resource だけを並べると漏れる。
- 漏れたものは、仕組みの本体を消しても残る。権限として効き続けたり、費用がかかり続けたりする。
- infrastructure as code で管理している仕組みでも、state に無いもの（service が自分で作ったもの、書き出した object、手で登録したもの）は、定義から外して apply しても消えない。

例外: application のログは消さない。それを出す resource を消しても残す（[`log_retention.md`](./log_retention.md)）。

判断の問い: **「この仕組みが動いた結果、他の場所に作られたもの・付けられたものは何か」**

## 共有されているものは残す

- MUST: 消す仕組み以外も使っている resource は、一覧から外して残す。
- MUST: 共有している resource の中に、この仕組みの分だけがある場合（共有の bucket のうち、この仕組みの prefix の下等）は、その分だけを消す。

理由: 同じ account には、別の仕組みが同じ resource（deploy の service の role、artifact の bucket 等）を使っていることがある。
一覧に入れて消すと、別の仕組みが動かなくなる。

判断の問い: **「この resource を、消す仕組み以外も使っているか」**

## 消す前に、他から使われていないことを確かめる

- MUST: 消す前に、一覧の各件が、消す仕組み以外から使われていないことを、読み取りで確かめる。
- MUST: 確かめた結果が一覧と違えば、消さない。一覧を直して、合意し直してから消す。

確かめる観点:

- 付き先: policy や role が、どの user・role・resource に付いているか。
- 参照元: その resource を名前や識別子で参照している設定・定義が、他に無いか。
- prefix: 共有の入れ物の中を prefix で消す時、その prefix が他の仕組みの prefix と前方一致しないか。例えば `app/` を消すつもりの指定が、`app_v2/` の下まで消さないか。

判断の問い: **「一覧に入れた resource のうち、他から使われていないことをまだ確かめていないものはどれか」**

## 消した後、一覧と実物を突き合わせる

- MUST: 消した後、一覧と実物を突き合わせる。消すとした全件が無く、残すとした全件が残っていることを確かめる。

消すことも基盤の変更である。
消したことで影響を受ける動きの確かめは、[`change_verification.md`](./change_verification.md) に従う。
例えば、残したものを使う別の仕組みが動くこと、消した仕組みを起動していた経路が何も起こさないことである。

判断の問い: **「一覧のうち、消した後の実物とまだ突き合わせていないものはどれか」**

## やってしまいがちな失敗

- 旧い deploy の仕組み（GitHub の webhook → CodePipeline → CodeDeploy）を、Terraform と GitHub Actions の経路へ置き換えて消す時に、消す一覧を最初の調査で見えた resource だけで作り、設計で合意した。
    - 一覧に入れたのは、pipeline とその service role、CodeDeploy の application、container の image の repository、GitHub の webhook だった。
    - 消す前に読み取りで確かめると、AWS 側の CodePipeline の webhook、pipeline の service role にだけ付いた policy、artifact の bucket のうちその pipeline の prefix の下の object が漏れていた。
    - 同じ確かめで、CodeDeploy の service role と artifact の bucket は、同じ account の別の app と共有していて、残すべきものだと分かった。
    - 漏れを足して合意し直した一覧で消した。消した後の突き合わせで、消すとしたものが無く、残すとしたものが残っていることを確かめた。
