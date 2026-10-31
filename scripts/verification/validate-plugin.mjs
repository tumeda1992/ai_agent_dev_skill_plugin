import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const pluginRoot = "plugins/tumeda-dev";
const failures = [];

function read(relativePath) {
  try {
    return readFileSync(resolve(root, relativePath), "utf8");
  } catch (error) {
    failures.push(`${relativePath}: 読み込み失敗: ${error.message}`);
    return "";
  }
}

function readJson(relativePath) {
  const source = read(relativePath);
  if (!source) return undefined;

  try {
    return JSON.parse(source);
  } catch (error) {
    failures.push(`${relativePath}: JSON parse失敗: ${error.message}`);
    return undefined;
  }
}

function requireText(relativePath, expected, label = expected) {
  const source = read(relativePath);
  if (!source.includes(expected)) {
    failures.push(`${relativePath}: 必須項目「${label}」がない`);
  }
}

function requirePattern(relativePath, pattern, label) {
  const source = read(relativePath);
  if (!pattern.test(source)) {
    failures.push(`${relativePath}: 必須項目「${label}」がない`);
  }
}

function forbidText(relativePath, forbidden, label = forbidden) {
  const source = read(relativePath);
  if (source.includes(forbidden)) {
    failures.push(`${relativePath}: 禁止項目「${label}」が残っている`);
  }
}

function requireOrderedText(relativePath, expectedItems, label) {
  const source = read(relativePath);
  let previousIndex = -1;
  for (const expected of expectedItems) {
    const index = source.indexOf(expected);
    if (index === -1 || index <= previousIndex) {
      failures.push(`${relativePath}: 必須順序「${label}」を満たさない`);
      return;
    }
    previousIndex = index;
  }
}

function requireExists(relativePath) {
  if (!existsSync(resolve(root, relativePath))) {
    failures.push(`${relativePath}: 必須pathが存在しない`);
  }
}

function requireAbsent(relativePath) {
  if (existsSync(resolve(root, relativePath))) {
    failures.push(`${relativePath}: 削除済みであるべき旧pathが残っている`);
  }
}

function requireFrontmatter(relativePath, expected) {
  const source = read(relativePath);
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? "";
  if (!frontmatter.includes(expected)) {
    failures.push(`${relativePath}: frontmatter必須項目「${expected}」がない`);
  }
}

function requireFields(relativePath, value, fields) {
  if (!value) return;
  for (const field of fields) {
    if (!(field in value)) {
      failures.push(`${relativePath}: 必須field「${field}」がない`);
    }
  }
}

const codexManifestPath = `${pluginRoot}/.codex-plugin/plugin.json`;
const claudeManifestPath = `${pluginRoot}/.claude-plugin/plugin.json`;
const codexManifest = readJson(codexManifestPath);
const claudeManifest = readJson(claudeManifestPath);
const marketplace = readJson(".claude-plugin/marketplace.json");
const codexMarketplace = readJson(".agents/plugins/marketplace.json");
const expectedRelease = "8.2.0";
const claudePlugin = marketplace?.plugins?.find(
  (plugin) => plugin.name === "tumeda-dev",
);
const codexPlugin = codexMarketplace?.plugins?.find(
  (plugin) => plugin.name === "tumeda-dev",
);

if (codexManifest && claudeManifest && marketplace && claudePlugin) {
  const versions = [
    codexManifest.version,
    claudeManifest.version,
    marketplace.version,
    claudePlugin.version,
  ];
  if (versions.some((version) => typeof version !== "string")) {
    failures.push("manifest: version宣言が4箇所すべてstringではない");
  } else if (new Set(versions).size !== 1) {
    failures.push(`manifest: version不一致: ${versions.join(", ")}`);
  } else if (versions[0] !== expectedRelease) {
    failures.push(
      `manifest: release期待値は${expectedRelease}、実際は${versions[0]}`,
    );
  }
}

if (codexManifest?.name !== "tumeda-dev") {
  failures.push(`${codexManifestPath}: nameはtumeda-devでなければならない`);
}
if (codexManifest?.skills !== "./skills/") {
  failures.push(`${codexManifestPath}: skillsは./skills/でなければならない`);
}
if (claudeManifest?.name !== "tumeda-dev") {
  failures.push(`${claudeManifestPath}: nameはtumeda-devでなければならない`);
}
if (!claudePlugin) {
  failures.push(".claude-plugin/marketplace.json: name: tumeda-devのentryがない");
} else if (claudePlugin.source !== "./plugins/tumeda-dev") {
  failures.push(".claude-plugin/marketplace.json: tumeda-dev sourceは./plugins/tumeda-devでなければならない");
}
if (!codexPlugin) {
  failures.push(".agents/plugins/marketplace.json: name: tumeda-devのentryがない");
} else if (codexPlugin.source?.path !== "./plugins/tumeda-dev") {
  failures.push(".agents/plugins/marketplace.json: tumeda-dev source pathは./plugins/tumeda-devでなければならない");
}
for (const legacyPath of [
  ".codex-plugin/plugin.json",
  ".claude-plugin/plugin.json",
  "skills",
]) {
  if (existsSync(resolve(root, legacyPath))) {
    failures.push(`${legacyPath}: 旧root pathが残っている`);
  }
}

const skillPath = (relativePath) => `${pluginRoot}/skills/${relativePath}`;
const docPath = (relativePath) => `${pluginRoot}/docs/${relativePath}`;
const thinkStandardsPath = (relativePath) =>
  docPath(`think_standards/${relativePath}`);

requireText(skillPath("doc-enricher/SKILL.md"), "モジュール構想（Module Concept）");
requireText(skillPath("doc-enricher/SKILL.md"), "命名意図（Naming Intent）");
requireText(skillPath("doc-enricher/SKILL.md"), "進化の種（Evolution Seed）");
requireText(skillPath("doc-enricher/SKILL.md"), "設計意図メモ（Design Intent Note）");
requireText(
  skillPath("doc-enricher/SKILL.md"),
  "「登り切った命題に反例はないか」→ 反例が挙がるなら一般則として偽 → DROP",
);
requireText(
  skillPath("doc-enricher/SKILL.md"),
  "置き場所は規範fileでなく当該作業のledgerになる",
);
requirePattern(
  skillPath("task-design/SKILL.md"),
  /component(?:の)?input[\s\S]{0,120}供給元/,
  "UI component inputと供給元",
);

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
  "legacyな `### 論点N:`",
  "最大値+1",
  "self-contained",
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

requireSavedForms(discussionTemplate, ["論点metadata","回の骨子","提案本文","空の提案応答欄","認識合わせ本文","空の認識合わせ回答欄","受領応答の本文","仮決定","再開条件","決定","変更内容","現在の変更"]);

requireSavedForms(discussionInternalTemplate, ["論点の骨子","回の骨子","記録単位"]);

for (const expected of [
  "## 論点N: {判断内容を表すタイトル}",
  "**ステータス:** {調査中 / 応答待ち / 子論点待ち / 決定 / 保留 / 分解済み / 反映待ち / 反映済み}",
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

const taskDesignSkill = skillPath("task-design/SKILL.md");
const taskDesignTemplate = skillPath("task-design/templates/design.md");
const outcomeSectionPath = (fileName) =>
  skillPath(`task-design/templates/outcome-sections/${fileName}`);
const taskDesignHandoffContract = skillPath(
  "task-design-work-handoff-contracts.md",
);
const taskDesignHandoffExtractor = skillPath(
  "task-design/scripts/extract-handoff-input.mjs",
);
const taskDesignHandoffTest =
  "scripts/verification/test-task-design-handoff.mjs";
for (const relativePath of [
  taskDesignHandoffContract,
  taskDesignHandoffExtractor,
  taskDesignHandoffTest,
]) {
  requireExists(relativePath);
}
for (const expected of [
  "対象は、別agentまたはownershipの連続性を確認できない新しい`task-design`実行",
  "steering固有phaseの引き継ぎ、任意workflowのhandoff、skill間result handoff、tasklist実行の再開は対象外",
  "scripts/extract-handoff-input.mjs",
  "current design、全decision、activeまたは停止中topic",
  "canonical file digest",
  "`attempt-[0-9]{3}.md`だけ",
]) {
  requireText(taskDesignHandoffContract, expected);
}
for (const expected of [
  "#### 既存designのhandoff gate",
  "../task-design-work-handoff-contracts.md",
  "task-design/scripts/extract-handoff-input.mjs",
  "current-state coverage、差分分類",
  "exactなactive topicと次の一問",
]) {
  requireText(taskDesignSkill, expected);
}
requireOrderedText(
  taskDesignSkill,
  [
    "### PrepareStep 2. 配置先確定",
    "#### 既存designのhandoff gate",
    "### PrepareStep 3. 設計前調査",
  ],
  "working directory確定後かつ設計前調査前のhandoff gate",
);
for (const fileName of [
  "README.md",
  "catalog.md",
  "caller-contracts.md",
  "code-structure.md",
  "contract-preservation.md",
  "data.md",
  "documentation.md",
  "file-deliverables.md",
  "interaction-flow.md",
  "research-findings.md",
  "runtime-and-configuration.md",
  "screen.md",
  "skill-policy.md",
  "workflow.md",
]) {
  requireExists(outcomeSectionPath(fileName));
}
requireAbsent(outcomeSectionPath("public-contracts.md"));
for (const expected of [
  "outcome-sections/catalog.md",
  "outcome-sections/README.md",
  "完成後の姿はtask-design全体で一つ",
  "### task-design内で対象成果物へ適用済み",
  "### task-design内の対象成果物反映待ち",
  "### execution plan対象",
  "### 分類保留（設計中のみ）",
  "| 対象 | 掲載理由 | 参照するdesign section |",
  "本番application coding / 段階実行 / ユーザー指定",
  "## リスクと対策",
  "## テスト方針",
  "## （付録）前提とする既存仕様",
]) {
  requireText(taskDesignTemplate, expected);
}
for (const forbidden of [
  "## 設計判断",
  "### 選択した原則と理由",
  "### 代替案と棄却理由",
]) {
  forbidText(taskDesignTemplate, forbidden, "撤去済みの固定設計判断format");
}
requireText(taskDesignSkill, "discussion_file_name=task-design-discussion.md");
for (const expected of [
  "### Step 3. 未解消の設計判断を解消する",
  "### PrepareStep 2. 配置先確定",
  "### PrepareStep 3. 設計前調査",
  "`working_dir`を確定した後、初稿を書く前に",
  "GraphQL mutationまたはCommand",
  "関連moduleのREADMEを先に読み",
  "pluginの`visual-inspector`をchildとして使い",
  "#### investigation.mdのlifecycle",
  "調査目的、未確定の判断、確認方法、終了条件",
  "#### requirements.mdの切り出し",
  "独立fileにするとreview可能性が上がる場合だけ",
  "working_dir_parent",
  "create_working_dir",
  "defaultは`true`",
  ".agents/skills/name-work-directory",
  "<current working directory>/<YYYYMMDD-slug>",
  "task-design起動時のcurrent working directoryを基準",
  "技術検証実装が必要になった時だけ作成する",
  "discussion内部processをtask-design側で再定義しない",
  "設計目的と完了条件",
  "現在の`design.md`",
  "templates/outcome-sections/catalog.md",
  "必要なsectionを一つ以上選ぶ",
  "task-designは`topic_id`",
  "discussion fileの作成・継続利用は",
  "一つの論点でdecisionを確定するたびにtask-designへ返す",
  "複数論点のdecisionを溜めて最後に一括反映しない",
  "一つのdecisionまたは事実を反映・分類するたびに",
  "本番application coding",
  "補助tool code",
  "分類保留",
  "task-design内の対象成果物反映待ち",
  "task-design内で対象成果物へ適用済み",
  "tasklist_ready | roadmap_ready | planless_complete",
  "result=planless_complete",
  "### 3-5. 実行して初めて確定することは、段階を分けて設計する",
  "### 3-6. 設計は対話であり転記ではない",
  "目的の内にある不確実性を、今回の段階のscopeへ含めるか判定する（3-5）",
  "捨てられる成果物は土台にならず、土台になる成果物は捨てられない",
  "起点以外の具体caseを二つ以上その基準へ当て",
]) {
  requireText(taskDesignSkill, expected);
}
requireOrderedText(
  taskDesignSkill,
  [
    "### PrepareStep 1. トリガー判定",
    "### PrepareStep 2. 配置先確定",
    "### PrepareStep 3. 設計前調査",
    "### Step 1. 初稿（TBD 込み）を作る",
  ],
  "配置先確定後に設計前調査を行うflow",
);
forbidText(taskDesignSkill, "### Step 0", "撤去済みのStep 0系番号");
for (const forbidden of [
  "### Step 3. 論点を1つずつ詰める（イテレーション）",
  "上位論点に対して、自分で先に考えた提案₀を出す",
  "新skillのprocessで論点1を議論 → 決定",
  "`<working_dir>/design.md` `<working_dir>/spike/` `<working_dir>/task-design-discussion.md` を作成・参照する",
  "軽量モード",
  "通常modeまたは軽量mode",
  "軽量modeでは",
  "outcome-sections/public-contracts.md",
  "理由は 4 章",
  "section 4 参照",
]) {
  forbidText(taskDesignSkill, forbidden, "task-designに残った旧discussion process");
}
requireText(skillPath("steering/SKILL.md"), "discussion_directory=<steering directory>");
requireText(skillPath("steering/SKILL.md"), "discussion_file_name=implementation_review.md");
requireText(skillPath("steering/SKILL.md"), "working_dir_parent=<steering ディレクトリの絶対パス>");
requireText(skillPath("steering/SKILL.md"), "create_working_dir=false");
requireText(skillPath("task-design/templates/tasklist.md"), "## 参照");
requireText(skillPath("task-design/templates/tasklist.md"), "./design.md");
requireText(skillPath("task-design/templates/tasklist.md"), "facilitate-discussion");
requireText(skillPath("task-design/templates/tasklist.md"), "implementation_review.md");
requireText(skillPath("task-design/templates/tasklist.md"), "特定の`steering` callerへ固定しない");
requireText(skillPath("README.md"), "facilitate-discussion");
requireText(skillPath("README.md"), "escalate-plugin-skill-fix");
requireText(skillPath("README.md"), "task-design-work-handoff-contracts.md");
requireText(skillPath("README.md"), "consumerは`task-design`");
requireText(
  skillPath("maintenance-plugin-context/SKILL.md"),
  "escalate-plugin-skill-fix",
);
requireAbsent(skillPath("design-consult/SKILL.md"));

const steeringSkill = skillPath("steering/SKILL.md");
const thinkThroughSkill = skillPath("think-through/SKILL.md");
for (const expected of [
  "既存designを引き継ぐdesign phase",
  "同じworking directoryの`task-design`",
  "steeringはcanonical designまたはdiscussionの本文を読まず",
  "steering固有phase、任意workflow、skill間result handoff、tasklist実行再開へhandoff contractを一般化しない",
]) {
  requireText(steeringSkill, expected);
}
forbidText(
  steeringSkill,
  "task-design-work-handoff-contracts.md",
  "steeringへの共有handoff contract直接接続",
);
requireFrontmatter(steeringSkill, "明示指定時");
requireFrontmatter(steeringSkill, "軽度でない複数file・複数stepの変更時");
requireFrontmatter(steeringSkill, "Agent");
forbidText(steeringSkill, "model:", "main session適用skillへのmodel宣言");
forbidText(steeringSkill, "effort:", "main session適用skillへのeffort宣言");
forbidText(taskDesignSkill, "model:", "main session適用skillへのmodel宣言");
forbidText(taskDesignSkill, "effort:", "main session適用skillへのeffort宣言");
const orderingParallelItemsDoc = thinkStandardsPath("ordering_parallel_items.md");
const advancingDiscussionDoc = thinkStandardsPath("advancing_discussion.md");
const designingForVariationsDoc = thinkStandardsPath("designing_for_variations.md");
for (const expected of [
  "**主軸: readyな確定事項を先に完了する**",
  "未決事項への問いかけや新しい作業を先行させない",
  "必要な合意・入力・権限が揃うなら、先に完了する",
]) {
  requireText(orderingParallelItemsDoc, expected);
}
requireText(advancingDiscussionDoc, "同じmessage、task、sessionに含まれる");
for (const expected of [
  "**主軸: 具体caseと方針群を反復往復し、全caseを扱えるまで帰納する**",
  "方針群が変わるたび5へ戻る",
  "多様なcaseを一つの方式へ押し込む",
  "taskを終えるため、豊富な具体を使わず演繹的に方針を作る",
]) {
  requireText(designingForVariationsDoc, expected);
}
forbidText(
  orderingParallelItemsDoc,
  "あるトピックについて議論している最中は、その議論が収束するまで次のアクションを提案・促すことは禁止。",
  "独立した確定事項まで一括保留する旧ルール",
);

const thinkStandardsFiles = [
  thinkStandardsPath("README.md"),
  thinkStandardsPath("core.md"),
  thinkStandardsPath("evolution_policy.md"),
  thinkStandardsPath("starting_to_think.md"),
  thinkStandardsPath("receiving_feedback.md"),
  thinkStandardsPath("advancing_discussion.md"),
  thinkStandardsPath("writing_abstraction.md"),
  thinkStandardsPath("updating_types.md"),
  thinkStandardsPath("handling_errors.md"),
  thinkStandardsPath("questioning_existing.md"),
  thinkStandardsPath("making_and_choosing_options.md"),
  orderingParallelItemsDoc,
  designingForVariationsDoc,
];
for (const relativePath of thinkStandardsFiles) {
  requireExists(relativePath);
}
requireText(thinkThroughSkill, "docs/think_standards/");
forbidText(
  thinkThroughSkill,
  "**主軸:",
  "docsへ移した思考標準の内容がSKILL.mdへ戻っている",
);
for (const relativePath of [taskDesignSkill, steeringSkill]) {
  requireText(
    relativePath,
    "ユーザーとの会話と成果物本文は日本語で記述する。code、command、path、identifier、規定された出力形式、固有名詞は原文を維持する。",
  );
}
for (const expected of [
  "## task-design初回起動前の境界",
  "ユーザー入力を未整理のままtask-designへ渡して直ちに起動する",
  "設計や方向性を整理する別stepを挟まず",
  "通常flowの初回task-design起動前には開始しない",
  "task-designを安全に起動できるかの確認にだけ使い",
  "## Ready result後の必須gate",
  "`tasklist_ready | roadmap_ready | planless_complete`のどのresultでも",
  "`doc-enricher`を提案modeで適用",
  "明示承認された提案だけを適用",
  "再発防止review",
  "ユーザーの明示確認",
  "`roadmap_ready`を受けたこと自体を子実行の承認とみなさない",
  "`planless_complete`では実行するplanがない",
  "planlessは子steeringの共通gateと完了報告を確認する",
  "planless status:",
]) {
  requireText(steeringSkill, expected);
}
forbidText(
  steeringSkill,
  "pre-designの認識合わせ",
  "task-design起動前の設計をsteeringへ戻す旧discussion用途",
);
for (const forbidden of [
  "## Plan合意後の必須gate",
  "`tasklist_ready | roadmap_ready`のどちらでも",
]) {
  forbidText(steeringSkill, forbidden, "steeringに残った二result前提");
}
requireText(steeringSkill, "# {YYYY}年{MM}月 Steering サマリー");
for (const expected of [
  "parent_roadmap_path",
  "parent_phase_id",
  "parent_design_path",
  "dependency_results",
  "上位roadmap制約",
  "親phase identity",
  "strictly narrower",
]) {
  requireText(taskDesignSkill, expected);
}
requireText(taskDesignSkill, "確認範囲が主張範囲を覆っているか");
requireText(taskDesignSkill, "`head`等で打ち切ったまま全体として扱わない");
for (const expected of [
  "## 上位roadmap制約（子phaseの場合のみ）",
  "{parent_roadmap_path}",
  "{parent_phase_id}",
  "{dependency_results}",
  "運用documentの手順だけを入力として、対象環境に対する確認操作が通る",
]) {
  requireText(taskDesignTemplate, expected);
}

const tasklistDesign = skillPath("task-design/tasklist-design.md");
const roadmapDesign = skillPath("task-design/roadmap-design.md");
const tasklistTemplate = skillPath("task-design/templates/tasklist.md");
const roadmapTemplate = skillPath("task-design/templates/roadmap.md");
for (const relativePath of [
  tasklistDesign,
  roadmapDesign,
  tasklistTemplate,
  roadmapTemplate,
]) {
  requireExists(relativePath);
}
requireAbsent(skillPath("steering/templates/tasklist.md"));
requireAbsent(skillPath("steering/templates/roadmap.md"));
for (const expected of [
  "tasklist-design.md",
  "roadmap-design.md",
  "先頭から末尾まで完全に読む",
  "tasklist_ready",
  "roadmap_ready",
  "plan reviewからdesignへ戻る未解消feedbackと",
]) {
  requireText(taskDesignSkill, expected);
}
requireText(tasklistDesign, "親roadmapを探索・更新するtaskを含めない");
requireText(tasklistDesign, "自己レビューgate");
for (const expected of [
  "実装可能で今回の完了に必要なtaskだけ",
  "将来やるかもしれない",
  "最初の実装phaseへ置く",
  "良い分割:",
  "悪い分割:",
  "時間不足、難しさ、host停止、tool制限、外部環境未準備を取消理由にしない",
  "未開拓の実行基盤を伴う作業では、基盤を立てるphaseを最初に置き",
  "Step 4で受け入れ基準へ入れた引き継ぎの観点（この作業を破棄しても残る変化を、後から更新・確認・復旧できること）を前提にする",
]) {
  requireText(tasklistDesign, expected);
}
requireText(roadmapDesign, "strictly narrower");
requireText(roadmapDesign, "依存関係はcycleを持たないDAG");
requireText(roadmapDesign, "一つだけの子");
requireText(roadmapTemplate, "構造field（task-designが設計・reviewする）");
requireText(roadmapTemplate, "運用field（steeringだけが更新する）");

for (const expected of [
  "working_dir_parent=<steering ディレクトリの絶対パス>",
  "create_working_dir=false",
  "`tasklist_ready`",
  "`roadmap_ready`",
  "子steering path、status、完了日だけ",
  "dependency_results=<依存phaseの確定結果>",
  "全phase完了",
  "tasklist status: checkbox",
  "roadmap status: 全phaseの運用status",
  "旧形式",
  "同じ作業中はbasenameを変更せず",
  "一か月前",
  "各steering実行時にもstatusを手動更新しない",
  "runtime-feedback-review.md",
]) {
  requireText(steeringSkill, expected);
}
const runtimeFeedbackReview = skillPath("runtime-feedback-review.md");
for (const expected of [
  "feedback原文",
  "既に修正済みのfeedbackでも記録を省略しない",
  "reviewのdecisionやtask追加後も実装を自動再開しない",
]) {
  requireText(runtimeFeedbackReview, expected);
}
for (const expected of [
  "adopt_task_design_working_dir=<absolute path>",
  "source basenameは`YYYYMMDD-slug`",
  "`tasklist.md`が併存しない",
  "未解消TBD",
  "repository内",
  "exact sourceとexact destination",
  "destinationが存在しない",
  "明示承認",
  "merge、overwrite、suffix追加、自動copy/delete",
  "directory全体を一度だけ",
  "`steering.json`や旧sourceへのpointerは作らない",
]) {
  requireText(steeringSkill, expected);
}

for (const relativePath of discussionConsumers) {
  forbidText(relativePath, "templates/discussion_entry.md", "旧discussion template path");
  forbidText(relativePath, "templates/implementation_review.md", "旧implementation review template path");
  forbidText(relativePath, "セクション1（フィードバック収集）", "旧4部構成");
  forbidText(relativePath, "FB-N", "旧feedback ID契約");
}

const runtimeContract = skillPath("runtime-execution-contracts.md");
for (const expected of [
  "状態の正本とsingle writer",
  "completed",
  "phase_checkpoint",
  "delegation_required",
  "user_confirmation_required",
  "blocked",
  "limit_reached",
  "request_id",
  "passed",
  "failed",
  "停止・再開と二重起動防止",
  "Logical ownerとphysical launcher",
  "Repository context",
]) {
  requireText(runtimeContract, expected);
}

const runtimeProfiles = skillPath("runtime-model-profiles.md");
requireText(runtimeProfiles, "## 推論強度の基準");
requireText(runtimeProfiles, "## delegated-execution");
forbidText(runtimeProfiles, "standard-execution", "旧profile名");

const agentDerivedSkills = [
  skillPath("tasklist-executor/SKILL.md"),
  skillPath("visual-inspector/SKILL.md"),
  skillPath("test-runner/SKILL.md"),
];
for (const relativePath of agentDerivedSkills) {
  requireFrontmatter(relativePath, "context: fork");
  requireText(relativePath, "../runtime-execution-contracts.md");
  requireText(relativePath, "../runtime-model-profiles.md");
  requireText(relativePath, "delegated-execution");
  requireText(relativePath, "Codex");
}
requireText(skillPath("tasklist-executor/SKILL.md"), "tasklist、DoD判定、checkbox、child結果の転記を更新するのはこのskillだけ");
requireFrontmatter(skillPath("tasklist-executor/SKILL.md"), "model: sonnet");
requireFrontmatter(skillPath("tasklist-executor/SKILL.md"), "context: fork");
requireFrontmatter(skillPath("tasklist-executor/SKILL.md"), "effort: medium");
for (const expected of ["Read", "Grep", "Glob", "Edit", "Write", "Bash", "Agent"]) {
  requireFrontmatter(skillPath("tasklist-executor/SKILL.md"), expected);
}
for (const expected of [
  "同directoryの`./design.md`",
  "別directoryを探索・推測せず`blocked`",
  "`roadmap.md`を作成・更新しない",
  "親roadmap pathを探索せず",
  "tasklist完了resultだけをcallerへ返す",
]) {
  requireText(skillPath("tasklist-executor/SKILL.md"), expected);
}
requirePattern(
  skillPath("tasklist-executor/SKILL.md"),
  /failed[\s\S]{0,160}blocked[\s\S]{0,160}\[ \]/u,
  "failed / blocked時の未完了維持",
);
for (const relativePath of [
  skillPath("visual-inspector/SKILL.md"),
  skillPath("test-runner/SKILL.md"),
]) {
  requirePattern(
    relativePath,
    /tasklist[\s\S]{0,100}(?:変更しない|更新しない)/u,
    "childのtasklist非更新",
  );
  requireText(relativePath, "passed");
  requireText(relativePath, "failed");
  requireText(relativePath, "blocked");
}

const requestPath = "inline runtime request";
const passedPath = "inline passed result";
const failedPath = "inline failed result";
const requestFixture = {
  request_id: "runtime-contract-test-1",
  kind: "test-runner",
  tasklist: ".steering/example/tasklist.md",
  task: "phase-1-test-1",
  attempt: 1,
  artifact_directory: "artifacts/runtime-contract-test-1/",
  status: "requested",
  checks: [
    {
      operation: "許可されたtest commandを実行する",
      expected: "対象testの終了codeが0になる",
    },
  ],
  dod: ["対象testがgreenになる"],
};
const passedFixture = {
  request_id: "runtime-contract-test-1",
  attempt: 1,
  status: "passed",
  artifact_directory: "artifacts/runtime-contract-test-1/",
  result: "artifacts/runtime-contract-test-1/result-passed.md",
  summary: "対象testは終了code 0で完了した",
};
const failedFixture = {
  request_id: "runtime-contract-test-1",
  attempt: 1,
  status: "failed",
  artifact_directory: "artifacts/runtime-contract-test-1/",
  result: "artifacts/runtime-contract-test-1/result-failed.md",
  summary: "対象testは失敗した。executorは対応taskを未完了のまま維持する",
};

requireFields(requestPath, requestFixture, [
  "request_id",
  "kind",
  "tasklist",
  "task",
  "attempt",
  "artifact_directory",
  "status",
  "checks",
  "dod",
]);
for (const [relativePath, fixture] of [
  [passedPath, passedFixture],
  [failedPath, failedFixture],
]) {
  requireFields(relativePath, fixture, [
    "request_id",
    "attempt",
    "status",
    "artifact_directory",
    "result",
    "summary",
  ]);
}

if (requestFixture) {
  if (!["visual-inspector", "test-runner"].includes(requestFixture.kind)) {
    failures.push(`${requestPath}: kindが許容値ではない`);
  }
  if (requestFixture.status !== "requested") {
    failures.push(`${requestPath}: statusはrequestedでなければならない`);
  }
  if (!Number.isInteger(requestFixture.attempt) || requestFixture.attempt < 1) {
    failures.push(`${requestPath}: attemptは1以上の整数でなければならない`);
  }
  if (!Array.isArray(requestFixture.checks) || requestFixture.checks.length === 0) {
    failures.push(`${requestPath}: checksは1件以上必要`);
  }
  if (!Array.isArray(requestFixture.dod) || requestFixture.dod.length === 0) {
    failures.push(`${requestPath}: dodは1件以上必要`);
  }
}

for (const [relativePath, fixture, expectedStatus] of [
  [passedPath, passedFixture, "passed"],
  [failedPath, failedFixture, "failed"],
]) {
  if (!fixture) continue;
  if (!["passed", "failed", "blocked"].includes(fixture.status)) {
    failures.push(`${relativePath}: statusが許容値ではない`);
  }
  if (fixture.status !== expectedStatus) {
    failures.push(`${relativePath}: statusは${expectedStatus}でなければならない`);
  }
  if (!Number.isInteger(fixture.attempt) || fixture.attempt < 1) {
    failures.push(`${relativePath}: attemptは1以上の整数でなければならない`);
  }
  if (
    requestFixture &&
    (fixture.request_id !== requestFixture.request_id ||
      fixture.attempt !== requestFixture.attempt)
  ) {
    failures.push(`${relativePath}: request IDまたはattemptがrequestと一致しない`);
  }
}
if (failedFixture && !failedFixture.summary.includes("未完了")) {
  failures.push(`${failedPath}: failed resultはtaskの未完了維持を明示する`);
}

const prHelper = skillPath(
  "scripts/github/create_or_get_pr.sh",
);
requireExists(prHelper);
requireAbsent(skillPath("steering/scripts/github/create_or_get_pr.sh"));
requireAbsent(
  skillPath("tasklist-executor/scripts/github/create_or_get_pr.sh"),
);
requireText(tasklistDesign, "scripts/github/create_or_get_pr.sh");
requireText(tasklistTemplate, "scripts/github/create_or_get_pr.sh");
for (const expected of [
  "原文、関連する実装・design・plan、原因、採用方針、決定",
  "review後に実装を自動再開しない",
  "current branchが公開可能なnon-default branch",
]) {
  requireText(tasklistTemplate, expected);
}
for (const expected of [
  "phase末や作業末にまとめて更新しない",
  "時間不足",
  "合意済みplanの変更により元taskが不要または別実装へ置換",
]) {
  requireText(skillPath("tasklist-executor/SKILL.md"), expected);
}
requireText(
  skillPath("tasklist-executor/SKILL.md"),
  "host・tool・外部環境が動かない",
);

const migrationPolicy = skillPath(
  "maintenance-plugin-context/maintenance_policies/migration.md",
);
const functionMigrationPolicy = `${pluginRoot}/docs/common_standard/function_migration_policy.md`;
requireExists(functionMigrationPolicy);
for (const expected of [
  "function_migration_policy.md",
  "機密情報を残すことも、汎用化を理由にfunctionを薄めることも許可しない",
]) {
  requireText(migrationPolicy, expected);
}
for (const expected of [
  "移行前の能力",
  "ユーザーが変更として明示指示した追加・変更",
  "実装者の提案にユーザーが明示合意した追加・変更",
  "構造ledger",
  "contract ledger",
  "未分類削除と未分類追加は常に失敗",
  "## 5. 変更が必要なときの合意gate",
  "## 7. White-box検証",
  "Git差分の削除行",
  "Git追加行と移行後の全contract",
  "独立した章を薄い箇条書き一つへ置き換え",
  "black-box検証をwhite-box検証の代替にしてはならない",
  "失敗実装へ継ぎ足す",
  "未監査 0 / 未分類削除 0 / 未分類追加 0",
]) {
  requireText(functionMigrationPolicy, expected);
}
requireText(
  migrationPolicy,
  "固有情報の除去と意味保存を同時に満たせないcontractは移植を停止する",
);

for (const forbidden of [
  "### 4) Designレビュー",
  "### 7) tasklist の自己レビュー",
  "create_working_dir=true`を渡す",
]) {
  forbidText(steeringSkill, forbidden, "steeringへ逆流した旧plan設計契約");
}
forbidText(
  tasklistTemplate,
  "（親ロードマップがある場合のみ）親の `roadmap.md`",
  "tasklistから親roadmapを更新する旧契約",
);

const contextMaintainer = skillPath("maintenance-plugin-context/SKILL.md");
const contextTemplate = skillPath("tumeda-dev-plugin-context.md");
for (const expected of [
  "| `task-design` | プロジェクト指示、アーキテクチャ文書、開発規約、テスト方針、全体 test command、全体 lint command |",
  "UI確認環境、Git/GitHub公開条件、作業の外へ残るactionの差し込み",
  "steering固有情報として返さない",
]) {
  requireText(contextMaintainer, expected);
}
for (const expected of [
  "## task-design",
  "### UI確認環境",
  "### Git / GitHub公開条件",
  "### 作業の外へ残るactionの差し込み",
  "## steering",
  "roadmap binding・status伝播に必要な制約",
]) {
  requireText(contextTemplate, expected);
}
forbidText(contextTemplate, "現在の宣言値は", "templateへ書かれたversion実値");

const escalateSkill = skillPath("escalate-plugin-skill-fix/SKILL.md");
const escalateMetadata = skillPath("escalate-plugin-skill-fix/agents/openai.yaml");
requireExists(escalateSkill);
requireExists(escalateMetadata);
requireText(steeringSkill, "branch_from_basename");
requireText(escalateSkill, "branch_from_basename");
for (const heading of [
  "## 起動gate",
  "## plugin repositoryの判定",
  "### 作業対象の切り替え",
  "## 引き渡し後",
  "## 責務境界",
  "## このskillが絶対にやらないこと",
]) {
  requireText(escalateSkill, heading);
}
requireText(escalateSkill, "### plugin repositoryでの作業完了後の取り込み");
requireText(escalateSkill, "作業branchを`main`へmergeする");

requireText(steeringSkill, "## Blocker resolution");
requireText(
  steeringSkill,
  "唯一の例外は`Blocker resolution`であり、その成立条件と手順は同節が持つ。"
);
requireExists(skillPath("steering/.gitignore.sample"));
requireText(skillPath("steering/.gitignore.sample"), "*/*/*/task-design-catch-up/");

requireText(
  `${pluginRoot}/docs/development_standards/naming/core.md`,
  "## 表現が同じでも、名前空間が違えば別の意味を持つ"
);

forbidText("AGENTS.md", "正本", "repositoryの自称としての「正本」");
forbidText("README.md", "正本", "repositoryの自称としての「正本」");
forbidText(escalateSkill, "正本repository", "plugin repositoryの自称としての「正本repository」");
forbidText(
  skillPath("README.md"),
  "正本repository",
  "skills READMEに残ったplugin repositoryの自称「正本repository」"
);

// skill構造reviewの入口・分担・caller接続。旧guardの意味は変更しない。
const structureReviewFiles = [
  "skill-update-review/SKILL.md",
  "skill-update-review/collect-review-material.md",
  "skill-update-review/assess-structure.md",
  "skill-update-review/templates/review-result.md",
  "skill-update-review/agents/openai.yaml",
].map(skillPath);
for (const relativePath of structureReviewFiles) requireExists(relativePath);
requireFrontmatter(structureReviewFiles[0], "name: skill-update-review");
for (const expected of ["collect-review-material.md", "assess-structure.md", "templates/review-result.md", "構造の合格は", "旧合格を使わない"]) {
  requireText(structureReviewFiles[0], expected);
}
for (const expected of ["source全文", "必要な比較元が読めなければ材料不足", "実解決先", "内容hash", "既存の必読条件を維持"]) {
  requireText(structureReviewFiles[1], expected);
}
for (const expected of ["混線の実績がなくても不合格", "現在の単独利用・他callerの具体要求", "将来予測だけでは独立させない", "既存の不合格も通常完了までに解消", "不合格と未確認が併存", "別用途だけの独立問題"]) {
  requireText(structureReviewFiles[2], expected);
}
for (const relativePath of [taskDesignSkill, tasklistDesign, tasklistTemplate, skillPath("tasklist-executor/SKILL.md"), skillPath("README.md")]) {
  requireText(relativePath, "skill-update-review");
}
for (const relativePath of [taskDesignSkill, tasklistDesign, tasklistTemplate, skillPath("tasklist-executor/SKILL.md")]) {
  requireText(relativePath, "内容識別");
  requireText(relativePath, "材料不足");
}
requireText(structureReviewFiles[4], "$skill-update-review");

// 議論格納・導出変更・明示保留・暫定指示。旧解決guardは内部ownerへ移した。
const discussionResolve = skillPath("facilitate-discussion/resolve-discussion.md");
const discussionRead = skillPath("facilitate-discussion/read-discussion.md");
const discussionSplit = skillPath("facilitate-discussion/split-discussion.md");
const derivedChanges = skillPath("facilitate-discussion/derived-change.md");
const pendingEscalations = skillPath("escalate-plugin-skill-fix/pending-escalations.md");
const pendingTemplate = skillPath("escalate-plugin-skill-fix/templates/pending-escalation.md");
const temporaryOverrides = skillPath("maintenance-plugin-context/temporary-overrides.md");
const overrideTemplate = skillPath("maintenance-plugin-context/templates/temporary-override.md");
const discussionHelper = skillPath("facilitate-discussion/scripts/inspect-discussion.mjs");
const discussionHelperTest = skillPath("facilitate-discussion/scripts/inspect-discussion.test.mjs");
const newFunctionalFiles = [discussionResolve, discussionRead, discussionSplit, derivedChanges, pendingEscalations, pendingTemplate, temporaryOverrides, overrideTemplate, discussionHelper, discussionHelperTest];
for (const path of newFunctionalFiles) requireExists(path);
requireText(discussionResolve, "# 議論記録");
requireText(discussionResolve, "### 解決の完了gate");
requireText(discussionRead, "末尾提示・原文応答・現在state・親子と根拠を判断する");
for (const name of ["resolve-discussion.md", "read-discussion.md", "split-discussion.md", "derived-change.md"]) requireText(discussionSkill, name);
for (const expected of ["next_offset", "needs_full_read", "snapshot", "compare", "全chunk", "独立構成前"]) requireText(discussionRead, expected);
for (const expected of ["10件を超えた", "最大番号+1", "check-candidate", "原文fileを削除", "自動修復"]) requireText(discussionSplit, expected);
for (const expected of ["明示委託", "次の実応答", "変更内容", "現在の変更", "原文", "部分反映"]) requireText(derivedChanges, expected);
requireOrderedText(escalateSkill, ["\n## 起動gate\n", "\n## 作業先を切り替える前の保留判定\n", "\n## plugin repositoryの判定\n"], "起動後・repository判定前の明示保留");
for (const expected of ["保留を保存する", "再開条件を確認する", "現在の提案を引き渡す", "受領先を記録する", "二重起動しない", "引渡し済みは改善済みではない"]) requireText(pendingEscalations, expected);
for (const expected of ["保留時の内容", "関連情報", "追跡"]) requireText(pendingTemplate, expected);
for (const expected of ["元作業と依頼を確認する", "記録を登録・改訂する", "適用候補と実行版を照合する", "実効指示または停止理由を返す", "終了を記録する", "active", "none", "paused", "unavailable", "ended", "無関係な更新でも", "全面代替"]) requireText(temporaryOverrides, expected);
for (const expected of ["## 指示", "## 適用状況", "## 変更と終了の履歴"]) requireText(overrideTemplate, expected);
const overrideConsumers = ["doc-enricher", "document-review", "escalate-plugin-skill-fix", "facilitate-discussion", "maintenance-plugin-context", "name-work-directory", "share-work-in-progress", "steering", "task-design", "tasklist-executor", "test-runner", "think-through", "visual-inspector", "skill-update-review"];
for (const name of overrideConsumers) {
  const path = skillPath(`${name}/SKILL.md`);
  for (const expected of ["## 作業限定の暫定指示を取得する", "resume", "SKILL.md", "paused/unavailable"]) requireText(path, expected);
}
for (const name of ["steering", "task-design", "tasklist-executor"]) requireText(skillPath(`${name}/SKILL.md`), "## 元作業の完了を暫定指示の管理へ通知する");
requireText(contextMaintainer, "temporary-overrides.md");
requireText(escalateSkill, "pending-escalations.md");

// 独立実操作で検出した到達不能・出典切れの修復条件。
for (const expected of ["分割済み記録を更新する", "通常のresolve/compareを呼ばない", "実体pathとSHA-256", "design等から旧入口"]) requireText(discussionSplit, expected);
for (const path of [pendingEscalations, temporaryOverrides]) requireText(path, "保存先fileから相対pathを実解決");
for (const expected of ["候補を比較", "選定理由", "報告した実際の問いまたは完了reviewと版"]) requireText(derivedChanges, expected);

requireText(discussionResolve, "`.md`以外の拡張子や拡張子なしを追加拒否しない");
requireText(discussionSplit, "## 元fileと最終directoryが同pathになる場合");

const portableFiles = [
  ...newFunctionalFiles,
  ...structureReviewFiles,
  skillPath("doc-enricher/SKILL.md"),
  discussionSkill,
  discussionMetadata,
  discussionTemplate,
  skillPath("task-design/SKILL.md"),
  taskDesignHandoffContract,
  taskDesignHandoffExtractor,
  taskDesignHandoffTest,
  tasklistDesign,
  roadmapDesign,
  tasklistTemplate,
  roadmapTemplate,
  skillPath("steering/SKILL.md"),
  prHelper,
  contextMaintainer,
  contextTemplate,
  runtimeContract,
  escalateSkill,
  escalateMetadata,
  ...agentDerivedSkills,
  ...thinkStandardsFiles,
];
const bannedPatterns = [
  [/x_favorites/gi, "移植元repository名"],
  [/(?:\/Users\/|[A-Za-z]:\\\\Users\\\\)/g, "利用者の絶対path"],
  [/\b[0-9a-f]{40}\b/gi, "commit hash"],
  [/https?:\/\/localhost(?::\d+)?/gi, "固定localhost URL"],
];

for (const relativePath of portableFiles) {
  const source = read(relativePath);
  for (const [pattern, label] of bannedPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(source)) {
      failures.push(`${relativePath}: 禁止項目「${label}」を含む`);
    }
  }
}

const documentReviewSkill = skillPath("document-review/SKILL.md");
requireExists(documentReviewSkill);
for (const expected of [
  "当て方の中身は `content_density.md` / `expression_notation.md` / `file_naming.md` が正本であり、skill 本文へ写さない",
  "薄い（濃さ不足）は微細でない",
  "「要素が揃った」でなく「観点を満たした」で判定する",
]) {
  requireText(documentReviewSkill, expected);
}

// 作業の外へ残る変化の判定をdesign合意判定へ移した契約
for (const expected of [
  "**作業の外へ残る変化の引き継ぎ**",
  "この作業で起きる変化は、この作業を破棄しても残るか",
]) {
  requireText(taskDesignSkill, expected);
}
requireText(tasklistDesign, "`SKILL.md`のStep 4（design合意判定）で特定した、作業を破棄しても残る変化を起こすactionを対象action");
forbidText(tasklistDesign, "| DB migrationの適用 | 残る | 対象 |", "Step 4へ移した判定の例の表");

// 暫定の判断の暫定性・理由・見直す条件を落とさない契約
const provisionalityStandard = `${pluginRoot}/docs/documentation_standards/provisionality_explicitness.md`;
requireExists(provisionalityStandard);
requireText(provisionalityStandard, "見直す条件を知らない読み手がこの文だけを読んだら、恒久の方針と受け取らないか");
requireText(taskDesignSkill, "provisionality_explicitness.md");
requireText(documentReviewSkill, "暫定性 → `provisionality_explicitness.md`");
requireText(taskDesignTemplate, "見直す条件または切り出した先を書く");
requireText(`${pluginRoot}/docs/documentation_standards/README.md`, "provisionality_explicitness.md");
requireText(`${pluginRoot}/docs/documentation_standards/stock-and-flow-information.md`, "provisionality_explicitness.md");
requireText(thinkStandardsPath("making_and_choosing_options.md"), "## 補助: 提案が暫定か恒久かを示す");

// 作業の範囲（目的の内外、目的の外の不備を拾うか切り出すか）の判定の契約
const workScopeStandard = `${pluginRoot}/docs/development_standards/development_flow/work_scope.md`;
requireExists(workScopeStandard);
requireText(workScopeStandard, "「今の作業の目的の外である」ことは、切り出す理由にならない");
for (const expected of [
  "work_scope.md",
  "目的の内外の判定は、`facilitate-discussion`へ渡す前にtask-designが行う",
]) {
  requireText(taskDesignSkill, expected);
}
requireText(runtimeFeedbackReview, "work_scope.md");
requireText(runtimeFeedbackReview, "目的の外の不備を切り出すと決めた");
requireText(`${pluginRoot}/docs/development_standards/README.md`, "work_scope.md");

// 確認の前に許すcommit・push（UI確認環境の宣言）。
const confirmEnvExclusion = "（確認環境へ載せるために`UI確認環境`が定めるcommit・pushを除く）";
requireText(tasklistDesign, "repositoryのcontext fileの`UI確認環境`が、確認環境へ載せるのにcommit・pushが要ると定めている場合、そのcommit・pushは確認の前に行ってよい。");
requireText(tasklistDesign, "それ以外のcommit・push・PRは確認の後に行う。");
requireText(tasklistDesign, "確認で直したところは既存のcommitを書き換えず、追加のcommitにする");
requireText(tasklistDesign, "その場合は、動作確認の依頼taskの前に、`UI確認環境`が定める載せ方で確認環境へ載せるtaskを置く。");
requireText(tasklistTemplate, "- [ ] 確認環境へ載せる（`UI確認環境`が載せ方を定めている場合だけ。{載せ方}）");
requireText(tasklistDesign, `**commit・push・PRより前にユーザー動作確認があるか**${confirmEnvExclusion}`);
requireText(tasklistTemplate, "確認環境へ載せるために`UI確認環境`が定めるcommit・pushを除き、動作確認phaseが完了するまでcommit、push、PRを促したり実行したりしない");
requireText(skillPath("tasklist-executor/SKILL.md"), `確認前にcommit・pushへ進まない${confirmEnvExclusion}`);
requireText(skillPath("tasklist-executor/SKILL.md"), `ユーザー動作確認より先にcommit・push・PRへ進まない${confirmEnvExclusion}`);
requireText(skillPath("steering/SKILL.md"), `ユーザー動作確認が完了する前にcommit、push、PRへ進ませない${confirmEnvExclusion}`);
requireText(skillPath("steering/SKILL.md"), `ユーザー動作確認前にcommit、push、PRを行う${confirmEnvExclusion}`);
requireText(skillPath("tumeda-dev-plugin-context.md"), "tasklist-design・tasklist-executor・steering は、ここに書かれた commit・push だけを、利用者の動作確認の前に許す");
// 確認の前の除外は確認環境のためのcommit・pushに限る。phaseごとに確認の前にcommitする形へ広げない。
forbidText(tasklistTemplate, "このphaseの差分をlocalでcommitする");
forbidText(tasklistDesign, "作業branchのpush・PRより前にユーザー動作確認を必須にする");
requireText(skillPath("share-work-in-progress/SKILL.md"), "ユーザー動作確認が完了するまでcommit・push・PRを行わない");
requireText(skillPath("README.md"), "tasklist-executorのcommit・push・PR契約");

// commitの境界からplan-commitsへの導線。
requireText(taskDesignSkill, "#### commitの境界が設計判断になる時");
requireText(taskDesignSkill, "designの段階には実差分が無いため`plan-commits`は起動せず、基準だけを当てる");
requireText(tasklistDesign, "分け方の基準は`plan-commits`に従い、commit taskの実行時は実差分へ`plan-commits`を当てて境界を決める");
requireText(tasklistTemplate, "境界は、実差分へ`plan-commits`を当てて決める");

// 既にあるcommitを、履歴の単位を整えるためだけに書き換えない。
const planCommitsSkill = skillPath("plan-commits/SKILL.md");
requireText(planCommitsSkill, "一方、既にあるcommitを、履歴の単位を整えるためだけに書き換えない。");
requireText(planCommitsSkill, "既にあるcommitの上へ、意味の単位で積む。書き換えるのは利用者が明示した時だけである。");
forbidText(planCommitsSkill, "既存の保存commitを、履歴が整わないという理由だけで改変しない。");
const shareWipSkill = skillPath("share-work-in-progress/SKILL.md");
requireText(shareWipSkill, "このskillが作るcommitは、作業中の内容を見せるためのcommitであり、意味の単位になっているとは限らない。");
requireText(shareWipSkill, "後から整理するかは利用者が決める。既にあるcommitの扱いは`plan-commits`に従う。");
forbidText(shareWipSkill, "後からamendやrebaseで整理される前提を持つ");

if (failures.length > 0) {
  console.error("plugin validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("plugin validation passed");
