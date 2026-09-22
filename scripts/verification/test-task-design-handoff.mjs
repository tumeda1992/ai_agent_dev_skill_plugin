import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "../..");
const extractor = resolve(root, "plugins/tumeda-dev/skills/task-design/scripts/extract-handoff-input.mjs");
const taskDesign = readFileSync(resolve(root, "plugins/tumeda-dev/skills/task-design/SKILL.md"), "utf8");
const steering = readFileSync(resolve(root, "plugins/tumeda-dev/skills/steering/SKILL.md"), "utf8");
const handoffContract = readFileSync(resolve(root, "plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md"), "utf8");
const fixture = mkdtempSync(resolve(tmpdir(), "task-design-handoff-"));
let failures = [];

function expectIncludes(name, source, expectedValues) {
  for (const value of expectedValues) {
    if (!source.includes(value)) failures.push(`${name}: ${value} がありません`);
  }
}

function expectExcludes(name, source, forbiddenValues) {
  for (const value of forbiddenValues) {
    if (source.includes(value)) failures.push(`${name}: 共有referenceだけが持つ「${value}」を重複定義しています`);
  }
}

function expectOrder(name, source, first, second) {
  const firstIndex = source.indexOf(first);
  const secondIndex = source.indexOf(second);
  if (firstIndex < 0 || secondIndex < 0 || firstIndex >= secondIndex) failures.push(`${name}: 「${first}」が「${second}」より前にありません`);
}

function run(name, source, expectedStatus, expectedOutput = "") {
  const design = resolve(fixture, `${name}.md`);
  writeFileSync(design, source);
  const result = spawnSync(process.execPath, [extractor, design], { encoding: "utf8" });
  if (result.status !== expectedStatus) failures.push(`${name}: exit ${result.status} (expected ${expectedStatus})`);
  if (expectedOutput && result.stdout !== expectedOutput) failures.push(`${name}: stdoutが期待値と異なる`);
  if (result.stdout.includes("FORBIDDEN_MARKER")) failures.push(`${name}: 禁止markerがstdoutへ露出した`);
}

expectIncludes(
  "task-design consumer",
  taskDesign,
  [
    "#### 既存designのhandoff gate",
    "`design.md`または`task-design-discussion.md`の存在だけ",
    "ownershipの連続性を確認できない",
    "../task-design-work-handoff-contracts.md",
    "task-design/scripts/extract-handoff-input.mjs",
    "対象working directoryを除外",
    "同じattempt",
    "次の連番",
    "`facilitate-discussion`",
    "exactなactive topicと次の一問",
  ],
);
expectOrder("task-design consumer", taskDesign, "### PrepareStep 2. 配置先確定", "#### 既存designのhandoff gate");
expectOrder("task-design consumer", taskDesign, "#### 既存designのhandoff gate", "### PrepareStep 3. 設計前調査");

expectIncludes(
  "steering routing",
  steering,
  [
    "既存designを引き継ぐdesign phase",
    "同じworking directoryの`task-design`",
    "steeringはcanonical designまたはdiscussionの本文を読まず",
    "steering固有phase",
  ],
);

expectIncludes(
  "shared handoff contract",
  handoffContract,
  [
    "current design、全decision、activeまたは停止中topic",
    "`一致`、`正本から補完して理由まで理解`、`正本へ疑義あり`、`独立再構成だけにある新規TBD`",
    "canonical file digest",
    "未分類差分zero",
    "未解消疑義zero",
    "working directory直下のexact path",
    "`attempt-[0-9]{3}.md`だけ",
  ],
);

const sharedOnly = [
  "`一致`、`正本から補完して理由まで理解`、`正本へ疑義あり`、`独立再構成だけにある新規TBD`",
  "未分類差分zero",
  "`attempt-[0-9]{3}.md`だけ",
];
expectExcludes("task-design consumer", taskDesign, sharedOnly);
expectExcludes("steering routing", steering, sharedOnly);
expectExcludes("steering routing", steering, ["task-design-work-handoff-contracts.md"]);

try {
  run("standalone", "# Design\n\n## 元の依頼内容\n\nstandalone request\n\n## TL;DR\n\nFORBIDDEN_MARKER\n", 0, "## 元の依頼内容\n\nstandalone request\n");
  run("child-phase", "# Design\n\n## 元の依頼内容\n\nchild request\n\n## 上位roadmap制約\n\nparent constraint\n\n## TL;DR\n\nFORBIDDEN_MARKER\n", 0, "## 元の依頼内容\n\nchild request\n\n## 上位roadmap制約\n\nparent constraint\n");
  run("missing", "# Design\n\n## TL;DR\n\nFORBIDDEN_MARKER\n", 1);
  run("duplicate", "# Design\n\n## 元の依頼内容\n\none\n\n## 元の依頼内容\n\ntwo\n", 1);
  run("broken-boundary", "# Design\n\n## 元の依頼内容\n\n## TL;DR\n\nFORBIDDEN_MARKER\n", 1);
} finally {
  rmSync(fixture, { recursive: true, force: true });
}

if (failures.length > 0) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exit(1);
}
process.stdout.write("task-design handoff tests passed\n");
