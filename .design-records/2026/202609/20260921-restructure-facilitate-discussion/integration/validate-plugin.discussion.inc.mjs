const discussionSkill = skillPath("facilitate-discussion/SKILL.md");

const discussionIteration = skillPath("facilitate-discussion/iteration.md");

const discussionRecovery = skillPath("facilitate-discussion/record-recovery.md");

const discussionMetadata = skillPath("facilitate-discussion/agents/openai.yaml");

const discussionTemplate = skillPath("facilitate-discussion/templates/discussion_entry.md");

const discussionInternalTemplate = skillPath("facilitate-discussion/templates/internal_record.md");

const discussionSupportingFiles = [
  "templates/proposal-sections/README.md",
  "templates/proposal-sections/compact-options.md",
  "templates/proposal-sections/complete-state.md",
  "templates/proposal-sections/detailed-options.md",
  "templates/proposal-sections/document-heading-outline.md",
  "templates/proposal-sections/element-correspondence.md",
  "templates/proposal-sections/existing-file-local-diff.md",
  "templates/proposal-sections/file-change-set.md",
  "templates/proposal-sections/process-flow.md",
  "templates/proposal-sections/structure-tree.md",
  "templates/consideration-records/README.md",
  "templates/consideration-records/research.md",
  "templates/consideration-records/judgment.md",
  "templates/consideration-records/alignment.md",
  "templates/consideration-records/verification.md",
  "templates/consideration-records/diagnosis.md",
  "templates/consideration-records/generalization.md"
].map((name) => skillPath("facilitate-discussion/" + name));

for (const p of [discussionSkill, discussionIteration, discussionRecovery, discussionMetadata, discussionTemplate, discussionInternalTemplate, ...discussionSupportingFiles]) requireExists(p);

for (const p of ["task-design/templates/discussion_entry.md", "steering/templates/discussion_entry.md", "steering/templates/implementation_review.md"]) requireAbsent(skillPath(p));

requireFrontmatter(discussionSkill, "name: facilitate-discussion");

requireFrontmatter(discussionSkill, "description:");

for (const expected of [
  "discussion_directory",
  "discussion_file_name",
  "defaultは `discussion.md`",
  "既存directory",
  "pathを含まないbasename",
  "# 議論記録",
  "legacyな `### 論点N:`",
  "最大値+1",
  "self-contained",
  "末尾のiterationとfeedback状態",
  "その回の問いを判断できる",
  "templateの任意`仮決定`",
  "templateの`再開条件`",
  "固定の`ネクストアクション`fieldはentryへ置かない",
  "親論点",
  "自己参照ではない",
  "循環しない",
  "一つのleaf論点を一つのdecision",
  "activeな論点を作らない",
  "`独立論点` は現在のdiscussion目的には属する",
  "作成済み論点がscope外と判明した場合は履歴を削除しない",
  "通常の質問、説明、短い相談から暗黙起動してはならない",
  "## workflow全体で守る不変条件",
  "## 実行経路",
  "## discussion fileを解決する",
  "### 解決の完了gate",
  "## 対象論点を選ぶ",
  "## 選択した論点を進める",
  "### 合意したdecisionを確定する",
  "### 論点をreparentする",
  "### scope外の既存論点を取り下げる",
  "### 返却の完了gate",
  "一つの論点でdecisionを確定するたびに",
  "複数論点のdecisionをまとめてから返さない",
  "consumerがdecisionを適用して全体状態を再評価",
  "skill起動、論点選択、iterationを無前提な兄弟分岐として扱わない"
]) requireText(discussionSkill, expected);

for (const expected of [
  "templates/proposal-sections/README.md",
  "固定候補ではなくその回の結果が分かる短い",
  "同じdecision scope",
  "feedbackを受けた時は、iterationを追加する前に必ずこの分類をやり直す",
  "### 作成中の回と検討記録を用意する",
  "discussion scopeへ属する理由、別decisionとして分けた理由等",
  "## 既存提示への応答を扱う",
  "## 入る前に引き継ぐ状態",
  "別decisionなら回を足さずhandlerへ戻る",
  "skill起動済みという前提やtarget fileの解決を毎回分岐させない"
]) requireText(discussionIteration, expected);

for (const expected of [
  "#### 提案Iへのフィードバック（論点N）"
]) requireText(discussionTemplate, expected);

for (const forbidden of [
  "## 入口を選ぶ",
  "## skillを起動する手順",
  "## 新規論点を開始する手順",
  "## feedback iterationを追記する手順",
  "## 合意したdecisionを確定する手順",
  "## 決定済み論点を再開する手順",
  "## 論点をreparentする手順",
  "## scope外の既存論点を取り下げる手順"
]) forbidText(discussionSkill, forbidden, "root直下へ平坦化した旧entry見出し");

// 保存形だけを持つfile。本文内の見出し例を外側の部品として数えない。

function requireSavedForms(relativePath, headings) {
  const source = read(relativePath);
  const withoutFences = source.replace(/^```markdown\n[\s\S]*?^```\s*$/gmu, "");
  const actual = [...withoutFences.matchAll(/^## (.+)$/gmu)].map((m) => m[1]);
  const count = [...source.matchAll(/^```markdown$/gmu)].length;
  if (JSON.stringify(actual) !== JSON.stringify(headings) || count !== headings.length) failures.push(relativePath + ": 保存形の名前・順序・code block数が不一致");
  forbidText(relativePath, "<!--", "templateへ埋め込まれた適用制御");
}

requireSavedForms(discussionTemplate, ["論点metadata","回の骨子","提案本文","空の提案応答欄","認識合わせ本文","空の認識合わせ回答欄","受領応答の本文","仮決定","再開条件","決定"]);

requireSavedForms(discussionInternalTemplate, ["論点の骨子","回の骨子","記録単位"]);

for (const expected of [
  "## 論点N: {判断内容を表すタイトル}",
  "**ステータス:** {調査中 / 応答待ち / 子論点待ち / 決定 / 保留 / 分解済み}",
  "**親論点:** 論点M",
  "**種別:**",
  "### イテレーションI（論点N）:",
  "#### 検討記録（論点N・イテレーションI）",
  "#### 提案I（論点N）",
  "#### 提案Iへのフィードバック（論点N）",
  "#### 認識合わせI（論点N）",
  "#### 認識合わせIへの回答（論点N）",
  "**結果:** {その回の結果が分かる短い表現}",
  "### 仮決定（論点N）",
  "### 再開条件（論点N）",
  "### 決定（論点N）",
  "{内部log相対path}#iteration-I"
]) requireText(discussionTemplate, expected);

for (const forbidden of [
  "**起点となった原文:**",
  "### 現在の合意対象",
  "#### 根本原因0 + 提案0",
  "##### 論点routingの判断",
  "**決定:**",
  "**ネクストアクション:**"
]) forbidText(discussionTemplate, forbidden, "廃止したdiscussion entry固定field");

for (const expected of [
  "internal-records/{D}.topic-{N}.md",
  "同じownerがsingle writer",
  "expression_notation.md",
  "提示済みか不明"
]) requireText(discussionSkill, expected);

for (const expected of [
  "making_and_choosing_options.md",
  "該当fileを全文読む",
  "入力",
  "次actionより前",
  "内部logを開かずに理解・判断・応答",
  "提示済みか不明"
]) requireText(discussionIteration, expected);

for (const expected of [
  "未提示の具体案への合意へ変換しない",
  "事後記録",
  "実施前保存の履歴を作らない",
  "通常経路の代替ではない"
]) requireText(discussionRecovery, expected);

for (const expected of [
  "<a id=\"iteration-I\"></a>",
  "<a id=\"iteration-I-record-R\"></a>",
  "**discussion:**",
  "**論点:** 論点N",
  "## 開始context"
]) requireText(discussionInternalTemplate, expected);

requireOrderedText(discussionIteration, ["### 作成中の回と検討記録を用意する", "### 判断材料を確かめ、検討記録を育てる", "### 提案または認識合わせを形にする", "### 保存した回を提示可能にする"], "提示準備の実行順");

requireText(discussionMetadata, "allow_implicit_invocation: false");

const discussionConsumers = ["task-design/SKILL.md", "steering/SKILL.md", "task-design/templates/tasklist.md"].map(skillPath);

for (const p of discussionConsumers) requireText(p, "facilitate-discussion");
