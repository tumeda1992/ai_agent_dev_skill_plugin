#!/usr/bin/env node
// 議論記録の読取専用helper。正本選択、意味判断、修復、書込みは行わない。
import { readFileSync, readdirSync, statSync, realpathSync } from "node:fs";
import { resolve, join, basename, dirname, relative, extname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const actions = new Set(["resolve", "read", "check", "snapshot", "compare", "check-candidate"]);
function fail(message) { throw new Error(message); }
function discussionStem(name) { const extension = extname(name); return extension ? name.slice(0, -extension.length) : name; }
function type(path) {
  try { const s = statSync(path); return s.isFile() ? "file" : s.isDirectory() ? "directory" : "other"; }
  catch (error) { if (error.code === "ENOENT") return "none"; throw error; }
}
export function resolveDiscussion(directory, name = "discussion.md") {
  if (!name || name === "." || name === ".." || /[/\\\0]/u.test(name)) fail("nameはpathを含まないbasenameを指定する");
  const root = resolve(directory);
  if (type(root) !== "directory") fail("作業directoryが存在しないかdirectoryではない");
  const single = join(root, name), split = join(root, discussionStem(name)), index = join(split, name);
  const singleType = type(single), splitType = type(split);
  // 拡張子のない既存basenameは同path。file/directoryの実種別で解決する。
  if (single === split) {
    if (!["none", "file", "directory"].includes(singleType)) fail("想定外のpath種別");
    if (singleType === "directory" && type(index) !== "file") fail("分割先の同名索引が欠落している");
    return { directory: root, name, format: singleType === "file" ? "single" : singleType === "directory" ? "split" : "none", entry: singleType === "file" ? single : singleType === "directory" ? index : null, split };
  }
  if (!["none", "file"].includes(singleType) || !["none", "directory"].includes(splitType)) fail("想定外のpath種別");
  if (singleType !== "none" && splitType !== "none") fail("新旧共存。正本を選ばず停止する");
  if (splitType === "directory" && type(index) !== "file") fail("分割先の同名索引が欠落している");
  return { directory: root, name, format: singleType === "file" ? "single" : splitType === "directory" ? "split" : "none", entry: singleType === "file" ? single : splitType === "directory" ? index : null, split };
}
function filesFor(location) {
  if (location.format === "none") return [];
  if (location.format === "single") return [location.entry];
  return readdirSync(location.split).sort((a, b) => a.localeCompare(b, "en", { numeric: true })).map(name => {
    const path = join(location.split, name);
    if (type(path) !== "file") fail(`分割先の想定外path: ${name}`);
    return path;
  });
}
function source(path) {
  const text = readFileSync(path, "utf8");
  const lines = text.match(/[^\n]*\n|[^\n]+$/gu) ?? [];
  return { path, text, lines };
}
function scan(document) {
  const headings = [], problems = [];
  let fence = null, comment = false;
  document.lines.forEach((raw, index) => {
    let line = raw.replace(/\r?\n$/u, "");
    if (/^\s*>/u.test(line)) return;
    if (fence) { if (new RegExp(`^ {0,3}${fence.char}{${fence.length},}\\s*$`, "u").test(line)) fence = null; return; }
    // comment中のheading例を認識しない。閉じた後の通常本文は保持する。
    let visible = "";
    while (line.length) {
      if (comment) { const end = line.indexOf("-->"); if (end < 0) return; line = line.slice(end + 3); comment = false; }
      else { const start = line.indexOf("<!--"); if (start < 0) { visible += line; break; } visible += line.slice(0, start); line = line.slice(start + 4); comment = true; }
    }
    const marker = /^ {0,3}(?:(?:[-+*]|\d+[.)])\s+)?(`{3,}|~{3,})/u.exec(visible);
    if (marker) { fence = { char: marker[1][0], length: marker[1].length }; return; }
    const heading = /^(#{1,6})\s+(.+?)\s*$/u.exec(visible);
    if (heading) headings.push({ depth: heading[1].length, title: heading[2], line: index });
  });
  if (fence || comment) problems.push("閉じていないfence/commentにより境界を確定できない");
  for (const heading of headings) if ([2, 3].includes(heading.depth) && /^論点/u.test(heading.title) && !/^論点[1-9]\d*[:：]/u.test(heading.title) && heading.title !== "論点一覧") problems.push("論点の境界・番号を確定できない");
  const topicHeadings = headings.filter(h => [2, 3].includes(h.depth) && /^論点[1-9]\d*[:：]/u.test(h.title));
  const topics = topicHeadings.map((heading, index) => {
    const match = /^論点([1-9]\d*)[:：]\s*(.*)$/u.exec(heading.title);
    const end = topicHeadings[index + 1]?.line ?? document.lines.length;
    const body = document.lines.slice(heading.line, end).join("");
    const metadata = document.lines.slice(heading.line, headings.find(h => h.line > heading.line && h.line < end && h.depth > heading.depth)?.line ?? end).join("");
    const status = /\*\*ステータス[:：]\*\*\s*(.+)/u.exec(metadata)?.[1]?.trim();
    const parentFields = [...metadata.matchAll(/^\*\*親論点[:：]\*\*[^\S\r\n]*(.*?)\r?$/gmu)];
    if (parentFields.length > 1) problems.push("親論点が複数ある");
    if (!Number.isSafeInteger(Number(match[1]))) problems.push("論点番号が安全な整数ではない");
    const parent = parentFields.length === 1 ? /^論点([1-9]\d*)$/u.exec(parentFields[0][1])?.[1] : null;
    if (parentFields.length && (!parent || !Number.isSafeInteger(Number(parent)))) problems.push("親論点fieldが一意の正整数参照ではない");
    return { ...heading, number: Number(match[1]), topicTitle: match[2], end, body, metadata, status, parent: parent ? Number(parent) : null };
  });
  return { document, headings, topics, problems };
}
function chunk(document, start = 0, end = document.lines.length) {
  return { path: document.path, start_line: start + 1, end_line: end, text: document.lines.slice(start, end).join("") };
}
function boundedChunks(chunks) {
  const output = [];
  for (const original of chunks) {
    const lines = original.text.match(/[^\n]*\n|[^\n]+$/gu) ?? [];
    let text = "", first = original.start_line, lineNumber = first, lineCount = 0;
    const flush = () => { if (text) output.push({ path: original.path, start_line: first, end_line: lineNumber - 1, text }); text = ""; lineCount = 0; first = lineNumber; };
    for (const line of lines) {
      if (text && (text.length + line.length > 8000 || lineCount >= 60)) flush();
      if (line.length > 8000) {
        flush(); let position = 0;
        while (position < line.length) {
          let end = Math.min(position + 8000, line.length);
          if (end < line.length && /[\uD800-\uDBFF]/u.test(line[end - 1])) end--;
          output.push({ path: original.path, start_line: lineNumber, end_line: lineNumber, start_column: position + 1, end_column: end, text: line.slice(position, end) }); position = end;
        }
        lineNumber++; first = lineNumber;
      } else { text += line; lineNumber++; lineCount++; }
    }
    flush();
  }
  return output;
}
function load(location) {
  if (location.format === "none") fail("記録が存在しない");
  const documents = filesFor(location).map(source);
  const index = location.format === "split" ? documents.find(d => d.path === location.entry) : null;
  const ranges = documents.filter(d => d !== index).map(scan);
  return { location, documents, index, ranges, topics: ranges.flatMap(r => r.topics) };
}
function validate(record) {
  const problems = record.ranges.flatMap(r => r.problems.map(problem => ({ path: r.document.path, problem })));
  const seen = new Map(); let previous = 0;
  for (const topic of record.topics) {
    if (seen.has(topic.number)) problems.push({ problem: `論点番号重複: ${topic.number}` });
    seen.set(topic.number, topic);
    if (topic.number <= previous) problems.push({ problem: `論点順序不整合: ${topic.number}` });
    previous = topic.number;
    if (record.location.format === "split") {
      const start = Math.floor((topic.number - 1) / 5) * 5 + 1;
      const expected = `${discussionStem(record.location.name)}-${start}-${start + 4}.md`;
      if (basename(record.ranges.find(r => r.topics.includes(topic)).document.path) !== expected) problems.push({ problem: `範囲所属不整合: ${topic.number}`, expected });
    }
  }
  for (const topic of record.topics) {
    const visited = new Set([topic.number]); let parent = topic.parent;
    while (parent !== null) {
      if (visited.has(parent)) { problems.push({ problem: `親参照循環: ${topic.number}` }); break; }
      if (!seen.has(parent)) { problems.push({ problem: `親論点欠落: ${parent}` }); break; }
      visited.add(parent); parent = seen.get(parent).parent;
    }
  }
  if (record.index) {
    if (!/^## 論点一覧\s*$/mu.test(record.index.text)) problems.push({ problem: "索引の論点一覧がない" });
    const entries = [];
    for (const line of record.index.lines) {
      const row = /^\|\s*([1-9]\d*)\s*\|\s*(.*?)\s*\|\s*\[[^\]]+\]\(([^)]+)\)\s*\|/u.exec(line);
      const item = /^[-*]\s+\[論点([1-9]\d*)[:： ]\s*([^\]]+)\]\(([^)]+)\)/u.exec(line);
      if (row || item) { const value = row ?? item; entries.push({ number: Number(value[1]), title: value[2].trim(), href: value[3] }); }
    }
    if (entries.length !== record.topics.length) problems.push({ problem: "索引の論点件数が本文と一致しない" });
    entries.forEach((entry, index) => {
      const topic = record.topics[index];
      if (!topic || entry.number !== topic.number || entry.title !== topic.topicTitle) problems.push({ problem: `索引の番号・題名・順序不整合: ${entry.number}` });
      const target = resolve(dirname(record.index.path), decodeURIComponent(entry.href.split("#")[0]));
      const range = record.ranges.find(r => r.topics.includes(topic));
      if (!range || target !== range.document.path) problems.push({ problem: `索引link不整合: ${entry.number}` });
    });
    const allowed = new Set([record.location.name, ...record.topics.map(t => `${discussionStem(record.location.name)}-${Math.floor((t.number - 1) / 5) * 5 + 1}-${Math.floor((t.number - 1) / 5) * 5 + 5}.md`)]);
    for (const document of record.documents) if (!allowed.has(basename(document.path))) problems.push({ problem: `未知の範囲file: ${document.path}` });
  }
  return problems;
}
function current(record) {
  const chunks = [], needsFullRead = [];
  for (const range of record.ranges) {
    const { document, topics, headings } = range;
    const preambleEnd = topics[0]?.line ?? document.lines.length;
    if (preambleEnd) chunks.push(chunk(document, 0, preambleEnd));
    for (const topic of topics) {
      const nested = headings.filter(h => h.line > topic.line && h.line < topic.end && h.depth === topic.depth + 1);
      const iterations = nested.filter(h => /^イテレーション\d+/u.test(h.title));
      const results = nested.filter(h => /^(?:仮決定|決定|再開条件|現在の変更)(?:（|\s|$)/u.test(h.title));
      const unknown = nested.filter(h => !iterations.includes(h) && !results.includes(h));
      const sectionEnd = section => nested.find(h => h.line > section.line)?.line ?? topic.end;
      const hasBody = section => document.lines.slice(section.line + 1, sectionEnd(section)).join("").trim().length > 0;
      const requiredResult = /^(決定|分解済み)$/u.test(topic.status ?? "") ? /^決定(?:（|\s|$)/u :
        topic.status === "反映済み" ? /^現在の変更(?:（|\s|$)/u : null;
      // 終端statusだけを根拠に本文を省かない。結果型と非空本文を確認し、意味判断はcallerへ残す。
      const missingResult = requiredResult && !results.some(section => requiredResult.test(section.title) && hasBody(section));
      const knownStatus = !topic.status || /^(応答待ち|調査中|子論点待ち|決定|保留|分解済み|提案中|反映待ち|反映済み)$/u.test(topic.status);
      if (unknown.length || !knownStatus || missingResult || (!iterations.length && !results.length)) {
        needsFullRead.push(document.path); continue;
      }
      const metadataEnd = nested[0]?.line ?? topic.end;
      chunks.push(chunk(document, topic.line, metadataEnd));
      const selected = new Set(results);
      if ((!/^(決定|分解済み|反映済み)$/u.test(topic.status ?? "") || results.some(h => /^現在の変更/u.test(h.title))) && iterations.length) selected.add(iterations.at(-1));
      // 「現在の変更」は原文を返す。完了の意味判定は行わずcallerが本文で確認する。
      for (const section of [...selected].sort((a, b) => a.line - b.line)) {
        const end = sectionEnd(section);
        chunks.push(chunk(document, section.line, end));
      }
    }
  }
  return { chunks, needs_full_read: [...new Set(needsFullRead)].sort() };
}
function snapshot(location, logs) {
  const paths = [...new Set([...filesFor(location), ...logs.map(path => resolve(location.directory, path))])].sort();
  return { format: location.format, entry: location.entry, files: paths.map(path => {
    if (type(path) !== "file") fail(`snapshot対象がfileではない: ${path}`);
    return { path: relative(location.directory, path), realpath: realpathSync(path), sha256: createHash("sha256").update(readFileSync(path)).digest("hex") };
  }) };
}
function hrefs(text) {
  // 元の文字列上で採番する。置換後のoffsetを出典として返さない。
  const patterns = [/(\]\()([^\n]*?)(\))/gu, /(\bhref=["'])([^"']*)(["'])/gu, /^(\s*\[[^\]]+\]:\s*)(\S+)/gmu];
  const links = patterns.flatMap(pattern => [...text.matchAll(pattern)].map(match => ({ value: match[2], offset: match.index + match[1].length })));
  let normalized = text;
  for (const pattern of patterns) normalized = normalized.replace(pattern, (_all, prefix, _href, suffix = "") => `${prefix}HREF${typeof suffix === "string" ? suffix : ""}`);
  return { normalized, values: links.map(link => link.value), links };
}
function hrefOrigin(document, startLine, text, link, initialOffset = 0) {
  if (!link) return null;
  const prefix = text.slice(0, link.offset), lines = prefix.split("\n");
  return { path: document.path, line: startLine + lines.length, column: lines.at(-1).length + 1, offset: initialOffset + link.offset };
}
function validateSnapshot(value) {
  if (!value || typeof value !== "object" || !["none", "single", "split"].includes(value.format) || !Array.isArray(value.files)) fail("stdinのsnapshot形式が不正");
  if (value.format === "none" ? value.entry !== null : typeof value.entry !== "string" || !value.entry.length) fail("stdinのsnapshot entryが不正");
  const names = new Set();
  for (const file of value.files) {
    if (!file || typeof file !== "object" || typeof file.path !== "string" || !file.path.length || typeof file.realpath !== "string" || !file.realpath.length || typeof file.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(file.sha256) || names.has(file.path)) fail("stdinのsnapshot fileが不正");
    names.add(file.path);
  }
}
function candidate(sourcePath, candidateDirectory, name) {
  const original = source(sourcePath), sourceScan = scan(original);
  const candidateLocation = { directory: dirname(candidateDirectory), name, format: "split", entry: join(candidateDirectory, name), split: candidateDirectory };
  if (type(candidateDirectory) !== "directory" || type(candidateLocation.entry) !== "file") fail("候補索引がない");
  const record = load(candidateLocation), problems = [...validate({ location: { format: "single" }, ranges: [sourceScan], topics: sourceScan.topics, index: null }), ...validate(record)];
  const hrefChanges = [];
  for (const range of record.ranges.slice(1)) {
    const prefix = range.document.lines.slice(0, range.topics[0]?.line ?? range.document.lines.length).join("");
    if (prefix.replace(/^# [^\n]+\r?\n/u, "").trim()) problems.push({ problem: `候補範囲の先頭に格納用h1以外の追加本文: ${range.document.path}` });
  }
  if (sourceScan.topics.length !== record.topics.length) problems.push({ problem: "候補の論点件数が違う" });
  sourceScan.topics.forEach((topic, index) => {
    const target = record.topics[index];
    if (!target || target.number !== topic.number) { problems.push({ problem: `候補の論点番号・順序が違う: ${topic.number}` }); return; }
    const before = hrefs(topic.body), after = hrefs(target.body);
    if (before.normalized !== after.normalized) problems.push({ problem: `候補の原文改変: ${topic.number}` });
    if (before.values.length !== after.values.length) problems.push({ problem: `候補linkの数が違う: ${topic.number}` });
    const targetDocument = record.ranges.find(range => range.topics.includes(target)).document;
    before.values.forEach((href, offset) => { if (after.values[offset] !== href) hrefChanges.push({ topic: topic.number, offset, before: href, after: after.values[offset] ?? null, source: hrefOrigin(original, topic.line, topic.body, before.links[offset]), candidate: hrefOrigin(targetDocument, target.line, target.body, after.links[offset]) }); });
  });
  const beforePreamble = original.lines.slice(0, sourceScan.topics[0]?.line ?? original.lines.length).join("");
  const first = record.ranges[0];
  let afterPreamble = first?.document.lines.slice(0, first.topics[0]?.line ?? 0).join("") ?? "";
  // 候補の格納用h1だけを除去できる。元のh1を含む前書き全体は保持する。
  let preambleLineOffset = 0;
  if (beforePreamble !== afterPreamble && afterPreamble.startsWith(`# ${basename(candidateDirectory)}\n\n`)) { afterPreamble = afterPreamble.slice(`# ${basename(candidateDirectory)}\n\n`.length); preambleLineOffset = 2; }
  const beforeLinks = hrefs(beforePreamble), afterLinks = hrefs(afterPreamble);
  beforeLinks.values.forEach((href, offset) => { if (afterLinks.values[offset] !== href) hrefChanges.push({ topic: null, offset, before: href, after: afterLinks.values[offset] ?? null, source: hrefOrigin(original, 0, beforePreamble, beforeLinks.links[offset]), candidate: first ? hrefOrigin(first.document, preambleLineOffset, afterPreamble, afterLinks.links[offset]) : null }); });
  if (hrefs(beforePreamble).normalized !== hrefs(afterPreamble).normalized) problems.push({ problem: "全体前提・前書きの原文改変" });
  return { problems, href_changes: hrefChanges, topic_count: sourceScan.topics.length };
}
export function inspect(argv, stdin = "") {
  const action = argv[0]; if (!actions.has(action)) fail("操作が不正");
  const options = { name: "discussion.md", logs: [] }, seen = new Set();
  for (let index = 1; index < argv.length; index += 2) {
    const key = argv[index], value = argv[index + 1];
    if (!value || !["--directory", "--name", "--view", "--topic", "--offset", "--limit", "--source", "--candidate", "--log"].includes(key)) fail(`無効引数: ${key}`);
    if (key !== "--log" && seen.has(key)) fail(`引数の重複: ${key}`);
    seen.add(key); if (key === "--log") options.logs.push(value); else options[key.slice(2)] = value;
  }
  const allowed = new Set(["--directory", "--name", ...(action === "read" ? ["--view", "--topic", "--offset", "--limit"] : action === "snapshot" || action === "compare" ? ["--log"] : action === "check-candidate" ? ["--source", "--candidate"] : [])]);
  if ([...seen].some(key => !allowed.has(key))) fail("この操作では使えない引数");
  if (!options.directory) fail("--directoryが必要");
  for (const key of ["topic", "offset", "limit"]) if (options[key] !== undefined && (!/^\d+$/u.test(options[key]) || !Number.isSafeInteger(Number(options[key])) || Number(options[key]) < (key === "offset" ? 0 : 1))) fail(`不正な${key}`);
  if (action === "read" && options.view && options.topic) fail("viewとtopicは同時指定できない");
  if (options.view && !["current", "full"].includes(options.view)) fail("不正なview");
  if (action === "check-candidate") {
    if (!options.source || !options.candidate) fail("sourceとcandidateが必要");
    if (!options.name || options.name === "." || options.name === ".." || /[/\\\0]/u.test(options.name)) fail("nameはpathを含まないbasenameを指定する");
    if (type(resolve(options.source)) !== "file") fail("sourceがfileではない");
    return { action, format: "candidate", ...candidate(resolve(options.source), resolve(options.candidate), options.name) };
  }
  const location = resolveDiscussion(options.directory, options.name);
  const base = { action, format: location.format, entry: location.entry, problems: [] };
  if (action === "resolve") return base;
  if (action === "snapshot" || action === "compare") {
    const value = snapshot(location, options.logs);
    if (action === "snapshot") return { ...base, snapshot: value };
    let previous; try { previous = JSON.parse(stdin); previous = previous.snapshot ?? previous; } catch { fail("stdinのsnapshotが不正なJSON"); }
    validateSnapshot(previous);
    return { ...base, snapshot: value, changed: JSON.stringify(previous) !== JSON.stringify(value), previous };
  }
  const record = load(location), problems = validate(record);
  if (problems.length) return { ...base, problems };
  if (action === "check") return { ...base, topic_count: record.topics.length, next_topic: Math.max(0, ...record.topics.map(t => t.number)) + 1, split_required: record.topics.length > 10 };
  const result = options.topic ? { chunks: record.ranges.filter(range => range.topics.some(topic => topic.number === Number(options.topic))).map(range => chunk(range.document)), needs_full_read: [] } : options.view === "full" ? { chunks: [...(record.index ? [chunk(record.index)] : []), ...record.ranges.map(range => chunk(range.document))], needs_full_read: [] } : current(record);
  if (options.topic && result.chunks.length === 0) fail("対象論点が存在しない");
  result.chunks = boundedChunks(result.chunks);
  const offset = Number(options.offset ?? 0), limit = Number(options.limit ?? Math.max(1, result.chunks.length));
  if (offset > result.chunks.length) fail("offsetが総chunk数を超える");
  const selected = result.chunks.slice(offset, offset + limit), next = offset + selected.length;
  return { ...base, ...result, chunks: selected, total_chunks: result.chunks.length, next_offset: next < result.chunks.length ? next : null, complete: next >= result.chunks.length && result.needs_full_read.length === 0 };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const stdin = process.argv[2] === "compare" ? readFileSync(0, "utf8") : "";
    const result = inspect(process.argv.slice(2), stdin);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    process.exitCode = result.problems.length ? 1 : result.changed ? 2 : 0;
    if (result.problems.length) process.stderr.write("inspect-discussion: 構造不整合。problemsを確認する\n");
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ action: process.argv[2] ?? null, problems: [{ problem: error.message }] })}\n`);
    process.stderr.write(`inspect-discussion: ${error.message}\n`); process.exitCode = 1;
  }
}
