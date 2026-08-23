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
const expectedRelease = "7.1.0";
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
    failures.push("manifest: version宣言が4管所すべてstringではない");
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
requirePattern(
  skillPath("task-design/SKILL.md"),
  /component(?:の)?input[\s\S]{0,120}供給元/,
  "UI component inputと供給元",
);

const discussionSkill = skillPath("facilitate-discussion/SKILL.md");
const discussionMetadata = skillPath("facilitate-discussion/agents/openai.yaml");
const discussionTemplate = skillPath(
  "facilitate-discussion/templates/discussion_entry.md",
);
const discussionProposalTemplates = [
  "README.md",
  "compact-options.md",
  "complete-state.md",
  "detailed-options.md",
  "document-heading-outline.md",
  "element-correspondence.md",
  "existing-file-local-diff.md",
  "file-change-set.md",
  "process-flow.md",
  "structure-tree.md",
].map((fileName) =>
  skillPath(`facilitate-discussion/templates/proposal-sections/${fileName}`),
);
for (const relativePath of [
  discussionSkill,
  discussionMetadata,
  discussionTemplate,
  ...discussionProposalTemplates,
]) {
  requireExists(relativePath);
}
for (const relativePath of [
  skillPath("task-design/templates/discussion_entry.md"),
  skillPath("steering/templates/discussion_entry.md"),
  skillPath("steering/templates/implementation_review.md"),
]) {
  requireAbsent(relativePath);
}

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
  "templates/proposal-sections/README.md",
  "提案Nへのフィードバック",
  "固定候補ではなくその回の結果が分かる短い",
  "templateの任意`仮決定`",
  "templateの`再開条件`",
  "固定の`ネクストアクション`fieldはentryへ置かない",
  "同じdecision scope",
  "親論点",
  "自己参照ではない",
  "循環しない",
  "一つのleaf論点を一つのdecision",
  "feedbackを受けた時は、iterationを追加する前に必ずこの分類をやり直す",
  "activeな論点を作らない",
  "`独立論点` は現在のdiscussion目的には属する",
  "作成済み論点がscope外と判明した場合は履歴を削除しない",
  "通常の質問、説明、短い相談から暗黙起動してはならない",
  "## workflow全体で守る不変条件",
  "## 実行workflow",
  "### 1. skillを起動する",
  "#### 起動phaseの完了gate",
  "### 2. 論点を扱う",
  "#### 2.1 対象論点を選ぶ",
  "#### 2.2 新規論点を作るvariant",
  "discussion scopeへ属する理由、別decisionとして分けた理由等",
  "#### 2.3 選択した一つの論点を進める",
  "##### 2.3.1 feedbackをiterationとして扱う",
  "###### iterationの入口gate",
  "iterationを追加せず、一段上の`2.1 対象論点を選ぶ`へ戻る",
  "skill起動済みという前提やtarget fileの解決を毎回分岐させない",
  "##### 2.3.2 合意したdecisionを確定する",
  "##### 2.3.3 論点をreparentする",
  "##### 2.3.4 scope外の既存論点を取り下げる",
  "#### 論点levelの完了gate",
  "一つの論点でdecisionを確定するたびに",
  "複数論点のdecisionをまとめてから返さない",
  "consumerがdecisionを適用して全体状態を再評価",
  "図のsubgraphはscopeの包含を表す",
]) {
  requireText(discussionSkill, expected);
}
for (const forbidden of [
  "## 入口を選ぶ",
  "## skillを起動する手順",
  "## 新規論点を開始する手順",
  "## feedback iterationを追記する手順",
  "## 合意したdecisionを確定する手順",
  "## 決定済み論点を再開する手順",
  "## 論点をreparentする手順",
  "## scope外の既存論点を取り下げる手順",
]) {
  forbidText(discussionSkill, forbidden, "root直下へ平坦化した旧entry見出し");
}
for (const expected of [
  "## 論点N: {判断内容を表すタイトル}",
  "**ステータス:**",
  "**親論点:**",
  "**種別:**",
  "### イテレーションN: {この提案で成立させること、または変えること}",
  "#### 提案N",
  "#### 提案背景",
  "#### 提案Nへのフィードバック",
  "**結果:** {その回の結果が分かる短い表現}",
  "### 仮決定",
  "### 再開条件",
  "### 決定",
]) {
  requireText(discussionTemplate, expected);
}
for (const forbidden of [
  "**起点となった原文:**",
  "### 現在の合意対象",
  "#### 根本原因0 + 提案0",
  "##### 論点routingの判断",
  "**決定:**",
  "**ネクストアクション:**",
]) {
  forbidText(discussionTemplate, forbidden, "廃止したdiscussion entry固定field");
}
requireText(discussionMetadata, "allow_implicit_invocation: false");

const discussionConsumers = [
  skillPath("task-design/SKILL.md"),
  skillPath("steering/SKILL.md"),
  skillPath("task-design/templates/tasklist.md"),
];
for (const relativePath of discussionConsumers) {
  requireText(relativePath, "facilitate-discussion");
}
const taskDesignSkill = skillPath("task-design/SKILL.md");
const taskDesignTemplate = skillPath("task-design/templates/design.md");
const outcomeSectionPath = (fileName) =>
  skillPath(`task-design/templates/outcome-sections/${fileName}`);
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
  "## 4. リスクと対策",
  "## 5. テスト方針",
]) {
  requireText(taskDesignTemplate, expected);
}
for (const forbidden of [
  "## 4. 設計判断",
  "### 選択した原則と理由",
  "### 代替案と棄却理由",
]) {
  forbidText(taskDesignTemplate, forbidden, "撤去済みの固定設計判断format");
}
requireText(taskDesignSkill, "discussion_file_name=task-design-discussion.md");
for (const expected of [
  "### Step 3. 未解消の設計判断を解消する",
  "### Step 0.5. 配置先確定",
  "### Step 0.75. 設計前調査",
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
]) {
  requireText(taskDesignSkill, expected);
}
requireOrderedText(
  taskDesignSkill,
  [
    "### Step 0. トリガー判定",
    "### Step 0.5. 配置先確定",
    "### Step 0.75. 設計前調査",
    "### Step 1. 初稿（TBD 込み）を作る",
  ],
  "配置先確定後に設計前調査を行うflow",
);
forbidText(taskDesignSkill, "### Step 0.25. 設計前調査");
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
requireText(skillPath("task-design/templates/tasklist.md"), "## 設計参照");
requireText(skillPath("task-design/templates/tasklist.md"), "./design.md");
requireText(skillPath("task-design/templates/tasklist.md"), "facilitate-discussion");
requireText(skillPath("task-design/templates/tasklist.md"), "implementation_review.md");
requireText(skillPath("task-design/templates/tasklist.md"), "特定の`steering` callerへ固定しない");
requireText(skillPath("README.md"), "facilitate-discussion");
requireAbsent(skillPath("design-consult/SKILL.md"));

const steeringSkill = skillPath("steering/SKILL.md");
const thinkThroughSkill = skillPath("think-through/SKILL.md");
requireFrontmatter(steeringSkill, "明示指定時");
requireFrontmatter(steeringSkill, "軽度でない複数file・複数stepの変更時");
requireFrontmatter(steeringSkill, "Agent");
requireFrontmatter(taskDesignSkill, "model: opus");
requireFrontmatter(steeringSkill, "model: sonnet");
requireFrontmatter(steeringSkill, "effort: high");
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
  thinkStandardsPath("presenting_options.md"),
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
for (const expected of [
  "## 上位roadmap制約（子phaseの場合のみ）",
  "{parent_roadmap_path}",
  "{parent_phase_id}",
  "{dependency_results}",
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
  "feedback原文",
  "既に修正済みのfeedbackでも記録を省略しない",
  "reviewのdecisionやtask追加後も実装を自動再開しない",
]) {
  requireText(steeringSkill, expected);
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

const agentDerivedSkills = [
  skillPath("tasklist-executor/SKILL.md"),
  skillPath("visual-inspector/SKILL.md"),
  skillPath("test-runner/SKILL.md"),
];
for (const relativePath of agentDerivedSkills) {
  requireFrontmatter(relativePath, "context: fork");
  requireText(relativePath, "../runtime-execution-contracts.md");
  requireText(relativePath, "../runtime-model-profiles.md");
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
  "tasklist-executor/scripts/github/create_or_get_pr.sh",
);
requireExists(prHelper);
requireAbsent(skillPath("steering/scripts/github/create_or_get_pr.sh"));
requireText(tasklistDesign, "tasklist-executor/scripts/github/create_or_get_pr.sh");
requireText(tasklistTemplate, "tasklist-executor/scripts/github/create_or_get_pr.sh");
for (const expected of [
  "phase末や作業末にまとめて更新しない",
  "時間不足",
  "合意済みplanの変更によって元taskが不要または別実装へ置換",
  "原文、関連する実装・design・plan、原因、採用方針、決定",
  "review後に実装を自動再開しない",
  "current branchが公開可能なnon-default branch",
]) {
  requireText(tasklistTemplate, expected);
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
  "UI確認環境とGit/GitHub公開条件",
  "steering固有情報として返さない",
]) {
  requireText(contextMaintainer, expected);
}
for (const expected of [
  "## task-design",
  "### UI確認環境",
  "### Git / GitHub公開条件",
  "## steering",
  "roadmap binding・status伝播に必要な制約",
]) {
  requireText(contextTemplate, expected);
}

const portableFiles = [
  skillPath("doc-enricher/SKILL.md"),
  discussionSkill,
  discussionMetadata,
  discussionTemplate,
  skillPath("task-design/SKILL.md"),
  tasklistDesign,
  roadmapDesign,
  tasklistTemplate,
  roadmapTemplate,
  skillPath("steering/SKILL.md"),
  prHelper,
  contextMaintainer,
  contextTemplate,
  runtimeContract,
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

if (failures.length > 0) {
  console.error("plugin validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("plugin validation passed");
