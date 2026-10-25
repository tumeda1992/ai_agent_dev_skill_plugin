import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, rmSync, chmodSync, symlinkSync, renameSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { inspect } from "./inspect-discussion.mjs";
const helper = fileURLToPath(new URL("./inspect-discussion.mjs", import.meta.url));
function fixture(t) { const path = mkdtempSync(join(tmpdir(), "discussion-inspect-")); t.after(() => rmSync(path, { recursive: true, force: true })); return path; }
function entry(number, { depth = 2, status = "応答待ち", parent = null, extra = "", title = `問い${number}` } = {}) {
  const h = "#".repeat(depth);
  return `${h} 論点${number}: ${title}\n\n**ステータス:** ${status}\n${parent ? `\n**親論点:** 論点${parent}\n` : ""}\n${h}# イテレーション0（論点${number}）: 旧案\n\n${h}## 提案0（論点${number}）\n\nOLD-${number}\n\n${h}# イテレーション1（論点${number}）: 今の案\n\n${h}## 提案1（論点${number}）\n\nCURRENT-${number}\n[根拠](detail.md)\n\n${extra}`;
}
function single(directory, count, options = {}) { const text = "# 議論記録\n\n全体前提。\n\n" + Array.from({ length: count }, (_, index) => entry(index + 1, options)).join(""); writeFileSync(join(directory, "discussion.md"), text); return text; }
function split(directory, count, transform = value => value) {
  const target = join(directory, "discussion"); mkdirSync(target);
  const rows = [];
  for (let start = 1; start <= count; start += 5) {
    const file = `discussion-${start}-${start + 4}.md`;
    let body = start === 1 ? "# 議論記録\n\n全体前提。\n\n" : "# discussion\n\n";
    for (let number = start; number <= Math.min(start + 4, count); number++) { body += transform(entry(number)); rows.push(`| ${number} | 問い${number} | [本文](./${file}) |`); }
    writeFileSync(join(target, file), body);
  }
  writeFileSync(join(target, "discussion.md"), "# 議論記録\n\n## 論点一覧\n\n| 番号 | 題名 | 本文 |\n| --- | --- | --- |\n" + rows.join("\n") + "\n");
  return target;
}
function run(directory, action, ...args) { return inspect([action, "--directory", directory, ...args]); }
function cli(directory, action, args = [], input = "") { const result = spawnSync(process.execPath, [helper, action, "--directory", directory, ...args], { encoding: "utf8", input }); return { ...result, value: JSON.parse(result.stdout) }; }

test("入口は内容を読まずにnone/single/splitを判定し、共存や索引欠落を拒否する", t => {
  const directory = fixture(t); assert.equal(run(directory, "resolve").format, "none");
  writeFileSync(join(directory, "discussion.md"), "```\n## 論点999: 読むと境界不明\n");
  assert.equal(run(directory, "resolve").format, "single");
  chmodSync(join(directory, "discussion.md"), 0); assert.equal(run(directory, "resolve").format, "single"); chmodSync(join(directory, "discussion.md"), 0o600);
  mkdirSync(join(directory, "discussion")); assert.throws(() => run(directory, "resolve"), /共存/u);
  rmSync(join(directory, "discussion.md")); assert.throws(() => run(directory, "resolve"), /索引/u);
  writeFileSync(join(directory, "discussion/discussion.md"), "not parsed"); assert.equal(run(directory, "resolve").format, "split");
});
for (const count of [10, 11, 12]) test(`${count}実論点の閾値は最大番号ではなく件数`, t => {
  const directory = fixture(t); single(directory, count); const result = run(directory, "check"); assert.equal(result.topic_count, count); assert.equal(result.split_required, count > 10); assert.equal(result.next_topic, count + 1);
});
test("旧h3・全角colon・欠番を扱い、fence/引用/commentの例示は数えない", t => {
  const directory = fixture(t); const text = "# 記録\n\n```md\n## 論点999: 例\n```\n> ## 論点998: 引用\n<!--\n## 論点997: comment\n-->\n- ```md\n## 論点996: list fence\n  ```\n" + entry(2, { depth: 3 }).replace("論点2:", "論点2：") + entry(9, { depth: 3 }); writeFileSync(join(directory, "discussion.md"), text);
  const result = run(directory, "check"); assert.equal(result.topic_count, 2); assert.equal(result.next_topic, 10);
});
test("未完成iterationは途中状態、未知の現在形式はneeds_full_read、境界不明は失敗", t => {
  const directory = fixture(t); writeFileSync(join(directory, "discussion.md"), "# 記録\n\n## 論点1: 途中\n\n### イテレーション0（論点1）\n"); assert.equal(run(directory, "check").problems.length, 0);
  writeFileSync(join(directory, "discussion.md"), entry(1) + "### 未知の状態\n\n不明\n"); const unknown = run(directory, "read"); assert.deepEqual(unknown.needs_full_read, [join(directory, "discussion.md")]); assert.equal(unknown.complete, false);
  writeFileSync(join(directory, "discussion.md"), entry(1) + "```\n"); assert.equal(cli(directory, "check").status, 1);
});
test("重複番号、親欠落、親循環、複数親、無効番号を拒否する", t => {
  const directory = fixture(t);
  for (const content of [entry(1) + entry(1), entry(1, { parent: 8 }), entry(1, { parent: 2 }) + entry(2, { parent: 1 }), entry(1).replace("**ステータス:** 応答待ち", "**親論点:** 論点2\n**親論点:** 論点3"), "## 論点0: invalid\n"]) {
    writeFileSync(join(directory, "discussion.md"), content); assert.equal(cli(directory, "check").status, 1, content);
  }
});
test("currentはmetadata/未決の最新回/現在の変更を原文で返し旧回を一律通読しない", t => {
  const directory = fixture(t); single(directory, 1, { extra: "### 現在の変更（論点1）\n\n未報告・反映待ち。\n" }); const result = run(directory, "read"); const text = result.chunks.map(c => c.text).join(""); assert.ok(!text.includes("OLD-1")); assert.ok(text.includes("CURRENT-1")); assert.ok(text.includes("現在の変更")); assert.equal(result.complete, true);
  for (const item of result.chunks) { const lines = readFileSync(item.path, "utf8").match(/[^\n]*\n|[^\n]+$/gu); assert.equal(item.text, lines.slice(item.start_line - 1, item.end_line).join("")); }
});
test("巨大な一fileも範囲fileも行境界chunkで全原文を分割取得できる", t => {
  const directory = fixture(t); const text = single(directory, 1, { extra: ("本文".repeat(25) + "\n").repeat(300) }); let offset = 0, output = "", steps = 0;
  do { const result = run(directory, "read", "--view", "full", "--offset", String(offset), "--limit", "1"); assert.equal(result.chunks.length, 1); output += result.chunks[0].text; offset = result.next_offset; if (offset !== null) assert.equal(result.complete, false); steps++; } while (offset !== null);
  assert.ok(steps > 3); assert.equal(output, text);
  rmSync(join(directory, "discussion.md")); split(directory, 12); const topic = run(directory, "read", "--topic", "7"); assert.equal(topic.chunks.map(c => c.text).join(""), readFileSync(join(directory, "discussion/discussion-6-10.md"), "utf8")); assert.ok(topic.chunks.map(c => c.text).join("").includes("論点6:"));
});
test("一行が巨大でも原文と出典行を保持し、surrogateを破壊しない", t => {
  const directory = fixture(t); const text = single(directory, 1, { extra: "あ😀".repeat(9000) + "\n" }); const result = run(directory, "read", "--view", "full"); assert.ok(result.chunks.length > 3); assert.equal(result.chunks.map(c => c.text).join(""), text); assert.ok(result.chunks.every(c => c.text.length <= 8000));
});
test("分割済みは番号順に読み、索引/所属の不整合を検出する", t => {
  const directory = fixture(t); split(directory, 12); assert.equal(run(directory, "check").topic_count, 12); assert.equal(run(directory, "read", "--view", "full").format, "split");
  const indexPath = join(directory, "discussion/discussion.md"); writeFileSync(indexPath, readFileSync(indexPath, "utf8").replace("| 7 | 問い7", "| 7 | 別題")); assert.ok(run(directory, "check").problems.length > 0);
});
test("snapshot/compareは原文/log/集合/解決先の変化を検出し、差のexitは2", t => {
  const directory = fixture(t); single(directory, 1); writeFileSync(join(directory, "log.md"), "根拠\n"); const snapshot = run(directory, "snapshot", "--log", "log.md"); assert.equal(cli(directory, "compare", ["--log", "log.md"], JSON.stringify(snapshot)).status, 0);
  writeFileSync(join(directory, "log.md"), "訂正\n"); assert.equal(cli(directory, "compare", ["--log", "log.md"], JSON.stringify(snapshot)).status, 2);
  const targetA = join(directory, "a.md"), targetB = join(directory, "b.md"); writeFileSync(targetA, "同じ\n"); writeFileSync(targetB, "同じ\n"); const link = join(directory, "evidence.md"); symlinkSync(targetA, link); const first = run(directory, "snapshot", "--log", "evidence.md"); rmSync(link); symlinkSync(targetB, link); assert.equal(inspect(["compare", "--directory", directory, "--log", "evidence.md"], JSON.stringify(first)).changed, true);
  rmSync(join(directory, "discussion.md")); split(directory, 11); const splitBefore = run(directory, "snapshot"); writeFileSync(join(directory, "discussion/extra.md"), "追加"); assert.equal(cli(directory, "compare", [], JSON.stringify(splitBefore)).status, 2); rmSync(join(directory, "discussion/extra.md")); rmSync(join(directory, "discussion/discussion-11-15.md")); assert.equal(cli(directory, "compare", [], JSON.stringify(splitBefore)).status, 2);
});
test("明示候補検査は新旧共存中に原文保持と全href差を返し、本文改変を拒否する", t => {
  const directory = fixture(t); const original = single(directory, 12); const target = split(directory, 12, text => text.replaceAll("(detail.md)", "(../detail.md)")); const args = ["check-candidate", "--directory", directory, "--source", join(directory, "discussion.md"), "--candidate", target]; let result = inspect(args); assert.deepEqual(result.problems, []); assert.equal(result.href_changes.length, 12); assert.equal(readFileSync(join(directory, "discussion.md"), "utf8"), original); assert.throws(() => run(directory, "resolve"), /共存/u);
  const candidatePath = join(target, "discussion-6-10.md"); const current = readFileSync(candidatePath, "utf8"); writeFileSync(candidatePath, current.replace("CURRENT-8", "CHANGED-8")); assert.ok(inspect(args).problems.some(p => /原文改変/u.test(p.problem))); writeFileSync(candidatePath, current.replace("# discussion\n\n", "# discussion\n\n隠れた追加\n")); assert.ok(inspect(args).problems.some(p => /追加本文/u.test(p.problem)));
});
test("無効引数/取得不能を成功にせず、全操作でsourceは不変", t => {
  const directory = fixture(t); single(directory, 2); const before = run(directory, "snapshot");
  for (const action of ["resolve", "check", "read", "snapshot"]) assert.equal(cli(directory, action).status, 0);
  assert.deepEqual(run(directory, "snapshot"), before);
  for (const args of [["--name", "../escape.md"], ["--limit", "0"], ["--view", "unknown"], ["--offset", "99999"], ["--topic", "99"]]) assert.equal(cli(directory, "read", args).status, 1);
  assert.equal(cli(directory, "compare", [], "not-json").status, 1); rmSync(join(directory, "discussion.md")); assert.equal(cli(directory, "read").status, 1);
});
test("指定された実在の分割記録を修復せず原文・現在・snapshotで読む", { skip: !process.env.DISCUSSION_REAL_DIRECTORY }, t => {
  const directory = resolve(process.env.DISCUSSION_REAL_DIRECTORY), name = process.env.DISCUSSION_REAL_NAME ?? "task-design-discussion.md";
  const before = inspect(["snapshot", "--directory", directory, "--name", name]);
  const check = inspect(["check", "--directory", directory, "--name", name]); assert.deepEqual(check.problems, []); assert.ok(check.topic_count > 10);
  const current = inspect(["read", "--directory", directory, "--name", name, "--view", "current", "--limit", "1"]); assert.deepEqual(current.problems, []); assert.ok(Array.isArray(current.needs_full_read));
  let offset = 0, count = 0; const texts = new Map();
  do {
    const result = inspect(["read", "--directory", directory, "--name", name, "--view", "full", "--offset", String(offset), "--limit", "1"]);
    assert.deepEqual(result.problems, []); assert.equal(result.chunks.length, 1);
    const item = result.chunks[0]; texts.set(item.path, (texts.get(item.path) ?? "") + item.text); offset = result.next_offset; count++;
    if (offset === null) assert.equal(result.complete, true);
  } while (offset !== null);
  for (const [path, text] of texts) assert.equal(text, readFileSync(path, "utf8"));
  assert.deepEqual(inspect(["snapshot", "--directory", directory, "--name", name]), before);
  t.diagnostic(JSON.stringify({ topics: check.topic_count, files: texts.size, full_chunks: count, current_needs_full_read: current.needs_full_read, source_unchanged: true }));
});

test("親fieldの存在を無視せず、0・複数参照・空・非整数・過大整数を拒否する", t => {
  const directory = fixture(t);
  for (const parent of ["論点0", "論点1、論点2", "", "不明", "論点1.5", "論点9007199254740992"]) {
    writeFileSync(join(directory, "discussion.md"), entry(1) + entry(2).replace("**ステータス:** 応答待ち", `**ステータス:** 応答待ち\n**親論点:** ${parent}`));
    const result = cli(directory, "check"); assert.equal(result.status, 1, parent); assert.ok(result.value.problems.some(p => /正整数参照/u.test(p.problem)));
  }
});
test("compareは不正snapshotを変更ありexit2へ混ぜずexit1で拒否する", t => {
  const directory = fixture(t); single(directory, 1); const valid = run(directory, "snapshot").snapshot;
  for (const snapshot of [null, {}, { ...valid, format: "garbage" }, { ...valid, entry: null }, { ...valid, files: [{}] }, { ...valid, files: [{ path: "a" }] }, { ...valid, files: [{ ...valid.files[0], sha256: "bad" }] }, { ...valid, files: [valid.files[0], valid.files[0]] }]) assert.equal(cli(directory, "compare", [], JSON.stringify(snapshot)).status, 1);
});
test("href差の旧新を各fileの該当行へ辿れる", t => {
  const directory = fixture(t); single(directory, 12); const target = split(directory, 12, text => text.replaceAll("(detail.md)", "(../detail.md)"));
  const result = inspect(["check-candidate", "--directory", directory, "--source", join(directory, "discussion.md"), "--candidate", target]);
  assert.deepEqual(result.problems, []);
  for (const change of result.href_changes) {
    for (const [origin, value] of [[change.source, change.before], [change.candidate, change.after]]) {
      assert.ok(origin.path && origin.line > 0 && origin.column > 0);
      const line = readFileSync(origin.path, "utf8").split("\n")[origin.line - 1]; assert.equal(line.slice(origin.column - 1, origin.column - 1 + value.length), value);
    }
  }
});

for (const { name, stem } of [{ name: "notes.markdown", stem: "notes" }, { name: "review.txt", stem: "review" }, { name: "session", stem: "session" }, { name: ".journal", stem: ".journal" }]) test(`既存basename ${name}を追加拒否せず単一/分割で読む`, t => {
  const directory = fixture(t), sourcePath = join(directory, name), text = "# 議論記録\n\n" + entry(1);
  writeFileSync(sourcePath, text);
  const args = ["--name", name]; assert.equal(run(directory, "resolve", ...args).format, "single"); assert.equal(run(directory, "read", ...args, "--view", "full").chunks.map(c => c.text).join(""), text); assert.equal(run(directory, "check", ...args).topic_count, 1);
  const before = run(directory, "snapshot", ...args); assert.equal(cli(directory, "compare", args, JSON.stringify(before)).status, 0);
  rmSync(sourcePath); const target = join(directory, stem); mkdirSync(target);
  writeFileSync(join(target, name), `# 議論記録\n\n## 論点一覧\n\n| 1 | 問い1 | [本文](./${stem}-1-5.md) |\n`);
  writeFileSync(join(target, `${stem}-1-5.md`), text);
  assert.equal(run(directory, "resolve", ...args).format, "split"); assert.deepEqual(run(directory, "check", ...args).problems, []); assert.equal(run(directory, "read", ...args, "--topic", "1").chunks.map(c => c.text).join(""), text); assert.equal(cli(directory, "compare", args, JSON.stringify(before)).status, 2);
});
test("拡張子なしは明示候補で原文を保持して検査し、旧除去後に同pathへ切り替える", t => {
  const directory = fixture(t), name = "session", sourcePath = join(directory, name), candidateDirectory = join(directory, "explicit-candidate");
  const original = "# 議論記録\n\n" + entry(1); writeFileSync(sourcePath, original); writeFileSync(join(directory, "detail.md"), "# 詳細\n"); const before = run(directory, "snapshot", "--name", name);
  mkdirSync(candidateDirectory); writeFileSync(join(candidateDirectory, name), "# 議論記録\n\n## 論点一覧\n\n| 1 | 問い1 | [本文](./session-1-5.md) |\n"); writeFileSync(join(candidateDirectory, "session-1-5.md"), original.replaceAll("(detail.md)", "(../detail.md)"));
  const checked = inspect(["check-candidate", "--directory", directory, "--name", name, "--source", sourcePath, "--candidate", candidateDirectory]); assert.deepEqual(checked.problems, []); assert.equal(checked.href_changes.length, 1); assert.equal(readFileSync(sourcePath, "utf8"), original); assert.equal(cli(directory, "compare", ["--name", name], JSON.stringify(before)).status, 0);
  rmSync(sourcePath); renameSync(candidateDirectory, sourcePath); assert.equal(run(directory, "resolve", "--name", name).format, "split"); assert.deepEqual(run(directory, "check", "--name", name).problems, []); assert.ok(run(directory, "read", "--name", name, "--view", "full").complete);
});
