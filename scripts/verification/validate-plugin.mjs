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
const expectedRelease = "3.0.0";
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

requireText(skillPath("doc-enricher/SKILL.md"), "モジュール構想（Module Concept）");
requireText(skillPath("doc-enricher/SKILL.md"), "命名意図（Naming Intent）");
requireText(skillPath("doc-enricher/SKILL.md"), "進化の種（Evolution Seed）");
requireText(skillPath("doc-enricher/SKILL.md"), "設計意図メモ（Design Intent Note）");
requireText(skillPath("task-design/SKILL.md"), "観点5: 画面イメージと配置意図");
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
for (const relativePath of [
  discussionSkill,
  discussionMetadata,
  discussionTemplate,
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
  "現在の合意対象",
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
  "iterationの入口gateから別decisionとして戻った場合",
  "選択中だった論点とは別decisionである理由も保存する",
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
  "## 論点N: タイトル",
  "**ステータス:**",
  "**親論点:**",
  "**種別:**",
  "**起点となった原文:**",
  "### 現在の合意対象",
  "#### 根本原因0 + 提案0",
  "##### 論点routingの判断",
  "**決定:**",
  "**ネクストアクション:**",
]) {
  requireText(discussionTemplate, expected);
}
requireText(discussionMetadata, "allow_implicit_invocation: false");

const discussionConsumers = [
  skillPath("task-design/SKILL.md"),
  skillPath("steering/SKILL.md"),
  skillPath("design-consult/SKILL.md"),
  skillPath("steering/templates/tasklist.md"),
];
for (const relativePath of discussionConsumers) {
  requireText(relativePath, "facilitate-discussion");
}
const taskDesignSkill = skillPath("task-design/SKILL.md");
requireText(taskDesignSkill, "discussion_file_name=task-design-discussion.md");
for (const expected of [
  "### Step 3. 未解消の設計判断を解消する",
  "discussion内部processをtask-design側で再定義しない",
  "設計目的と完了条件",
  "現在の`design.md`",
  "通常modeまたは軽量mode",
  "task-designは`topic_id`",
  "discussion fileの作成・継続利用は",
  "一つの論点でdecisionを確定するたびにtask-designへ返す",
  "複数論点のdecisionを溜めて最後に一括反映しない",
  "一つのdecisionまたは事実を反映するたびに",
  "軽量modeではdiscussion内部の論点・iteration・合意手順を再定義せず",
]) {
  requireText(taskDesignSkill, expected);
}
for (const forbidden of [
  "### Step 3. 論点を1つずつ詰める（イテレーション）",
  "上位論点に対して、自分で先に考えた提案₀を出す",
  "新skillのprocessで論点1を議論 → 決定",
  "`<working_dir>/design.md` `<working_dir>/spike/` `<working_dir>/task-design-discussion.md` を作成・参照する",
]) {
  forbidText(taskDesignSkill, forbidden, "task-designに残った旧discussion process");
}
requireText(skillPath("steering/SKILL.md"), "discussion_directory=<steering directory>");
requireText(skillPath("steering/SKILL.md"), "discussion_file_name=implementation_review.md");
requireText(skillPath("design-consult/SKILL.md"), "discussion_directory");
requireText(skillPath("design-consult/SKILL.md"), "discussion_file_name");
requireText(skillPath("steering/templates/tasklist.md"), "implementation_review.md");
requireText(skillPath("README.md"), "facilitate-discussion");

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

const portableFiles = [
  skillPath("doc-enricher/SKILL.md"),
  discussionSkill,
  discussionMetadata,
  discussionTemplate,
  skillPath("task-design/SKILL.md"),
  skillPath("steering/SKILL.md"),
  skillPath("steering/templates/tasklist.md"),
  skillPath("design-consult/SKILL.md"),
  runtimeContract,
  ...agentDerivedSkills,
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
