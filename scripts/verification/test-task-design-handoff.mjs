import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "../..");
const extractor = resolve(root, "plugins/tumeda-dev/skills/task-design/scripts/extract-handoff-input.mjs");
const taskDesign = readFileSync(resolve(root, "plugins/tumeda-dev/skills/task-design/SKILL.md"), "utf8");
const steering = readFileSync(resolve(root, "plugins/tumeda-dev/skills/steering/SKILL.md"), "utf8");
const handoffContract = readFileSync(resolve(root, "plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md"), "utf8");
const discussionInspector = resolve(root, "plugins/tumeda-dev/skills/facilitate-discussion/scripts/inspect-discussion.mjs");
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
    "discussion、接続された内部検討記録、既存attempt本文、canonical file全体を読むことは禁止",
    "内部logを比較根拠として読んだ場合は、そのexactなfileをcanonical file digestの対象へ加える",
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
  // 存在だけのgate: designがなくても分割議論があれば既存記録である。
  const splitWork = resolve(fixture, "split-existing"), splitDirectory = resolve(splitWork, "task-design-discussion");
  mkdirSync(splitDirectory, { recursive: true });
  const indexPath = resolve(splitDirectory, "task-design-discussion.md");
  writeFileSync(indexPath, "FORBIDDEN_MARKER\n```unclosed\n"); chmodSync(indexPath, 0);
  let result = spawnSync(process.execPath, [discussionInspector, "resolve", "--directory", splitWork, "--name", "task-design-discussion.md"], { encoding: "utf8" });
  chmodSync(indexPath, 0o600);
  if (result.status !== 0 || JSON.parse(result.stdout).format !== "split" || result.stdout.includes("FORBIDDEN_MARKER") || result.stdout.includes("sha256")) failures.push("split存在gate: 本文/hash取得なしで既存を解決できない");
  expectIncludes("split consumer gate", taskDesign, ["resolve-discussion.md", "同名directoryの索引も既存記録", "本文・hash・snapshotは独立再構成前に取得しない"]);
  expectIncludes("split catch-up", handoffContract, ["全範囲fileを全chunk読む", "集合・実解決先・hash", "追加・削除も変化"]);
  const rows = [], expectedBodies = [];
  for (const start of [1, 6, 11]) {
    const rangeName = `task-design-discussion-${start}-${start + 4}.md`;
    let body = "# 議論記録\n\n";
    for (let number = start; number < Math.min(start + 5, 12); number++) {
      body += `## 論点${number}: 問い${number}\n\n**ステータス:** 決定\n\n### 決定（論点${number}）\n\n判断${number}。\n\n`;
      rows.push(`| ${number} | 問い${number} | [本文](./${rangeName}) |`);
    }
    writeFileSync(resolve(splitDirectory, rangeName), body); expectedBodies.push(body);
  }
  const indexText = "# 議論記録\n\n## 論点一覧\n\n| 番号 | 題名 | 本文 |\n| --- | --- | --- |\n" + rows.join("\n") + "\n";
  writeFileSync(indexPath, indexText);
  result = spawnSync(process.execPath, [discussionInspector, "read", "--directory", splitWork, "--name", "task-design-discussion.md", "--view", "full"], { encoding: "utf8" });
  if (result.status !== 0 || JSON.parse(result.stdout).chunks.map(chunk => chunk.text).join("") !== indexText + expectedBodies.join("")) failures.push("split catch-up: 索引と全範囲の原文を完全取得できない");
  const snapshot = spawnSync(process.execPath, [discussionInspector, "snapshot", "--directory", splitWork, "--name", "task-design-discussion.md"], { encoding: "utf8" });
  const changedPath = resolve(splitDirectory, "task-design-discussion-6-10.md"); writeFileSync(changedPath, expectedBodies[1] + "後発訂正\n");
  result = spawnSync(process.execPath, [discussionInspector, "compare", "--directory", splitWork, "--name", "task-design-discussion.md"], { encoding: "utf8", input: snapshot.stdout });
  if (result.status !== 2) failures.push("split完了前: 範囲fileの後発変化を再照合できない");
  const singlePath = resolve(splitWork, "task-design-discussion.md"); writeFileSync(singlePath, "旧入口\n");
  result = spawnSync(process.execPath, [discussionInspector, "resolve", "--directory", splitWork, "--name", "task-design-discussion.md"], { encoding: "utf8" });
  if (result.status !== 1) failures.push("split存在gate: 新旧共存を拒否しない");
  rmSync(singlePath); rmSync(indexPath);
  result = spawnSync(process.execPath, [discussionInspector, "resolve", "--directory", splitWork, "--name", "task-design-discussion.md"], { encoding: "utf8" });
  if (result.status !== 1) failures.push("split存在gate: 索引欠落を拒否しない");
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
