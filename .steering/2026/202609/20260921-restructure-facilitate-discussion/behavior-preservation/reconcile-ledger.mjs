// 保存済みledgerの参照位置を現在prototypeへ結び直す補助。意味の監査を代行しない。
// --write は位置情報を機械更新し、--patch は同じ更新のapply_patch入力を出す。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const base = path.dirname(fileURLToPath(import.meta.url));
const prototype = path.resolve(base, '../faciliate-discussion');
const repository = path.resolve(base, '../../../../../');
const original = new Map();
const readJSON = name => {
  const text = fs.readFileSync(path.join(base, name), 'utf8');
  original.set(name, text);
  return JSON.parse(text);
};
const ledger = readJSON('function-migration-ledger.json');
const additions = readJSON('function-migration-additions.json');
const definition = readJSON('contract-audit-definition.json');
const cache = new Map();
const digest = text => crypto.createHash('sha256').update(text).digest('hex');
function document(file) {
  if (cache.has(file)) return cache.get(file);
  const local = path.join(prototype, file);
  const absolute = fs.existsSync(local) ? local : path.join(repository, 'plugins/tumeda-dev/skills/facilitate-discussion', file);
  const text = fs.readFileSync(absolute, 'utf8');
  const lines = text.split('\n');
  const headings = [];
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const marker = lines[i].match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (fence[0] === marker[1][0] && marker[1].length >= fence.length) fence = null;
      continue;
    }
    const match = !fence && lines[i].match(/^(#{1,6}) (.+)$/);
    if (match) headings.push({ heading: match[2], level: match[1].length, from: i + 1 });
  }
  for (let i = 0; i < headings.length; i++) {
    const next = headings.slice(i + 1).find(h => h.level <= headings[i].level);
    headings[i].to = next ? next.from - 1 : lines.length - (lines.at(-1) === '' ? 1 : 0);
  }
  const result = { text, lines, headings, sha256: digest(text), owner: fs.existsSync(local) ? 'prototype' : 'production-KEEP' };
  cache.set(file, result);
  return result;
}
function locate(destination, meaning) {
  if ((destination.file === 'templates/proposal-sections/process-flow.md' && destination.heading === '補足') || (destination.file === 'templates/proposal-sections/structure-tree.md' && destination.heading === '併用')) {
    destination = { ...destination, original_locator_label: destination.heading, heading: 'template' };
  }
  const doc = document(destination.file);
  const matches = destination.heading === 'metadata'
    ? [{ from: 1, to: destination.file.endsWith('.yaml') ? doc.lines.length - 1 : doc.lines.indexOf('---', 1) + 1 }]
    : doc.headings.filter(h => h.heading === destination.heading);
  if (matches.length !== 1) throw new Error(`${destination.file}: 見出しが一意でない: ${destination.heading}`);
  const section = matches[0];
  const exact = meaning ? doc.lines.flatMap((line, i) => i + 1 >= section.from && i + 1 <= section.to && line.includes(meaning) ? [i + 1] : []) : [];
  return {
    ...destination,
    from: exact.length === 1 ? exact[0] : section.from,
    to: exact.length === 1 ? exact[0] : section.to,
    locator: exact.length === 1 ? '原文断片の節内一致' : '見出しの連続範囲',
    owner: doc.owner,
  };
}
for (const row of ledger.contracts) row.destination = row.destination.map(d => locate(d, row.meaning));
for (const row of additions.contracts) row.destination = row.destination.map(d => locate(d, row.meaning));
for (const row of additions.structures) Object.assign(row, locate(row));
for (const row of ledger.structure) {
  row.destination_locations = row.destination.map(text => {
    const at = text.indexOf(' / ');
    if (at < 0) throw new Error(`構造参照の形式不明: ${text}`);
    return locate({ file: text.slice(0, at), heading: text.slice(at + 3) });
  });
}
const refreshed = {
  method: '見出しを一意に解決し、同節内の原文一致が一つなら行へ絞る。section一致は意味保存の証明ではない。',
  files: Object.fromEntries([...cache].map(([file, doc]) => [file, { sha256: doc.sha256, owner: doc.owner }])),
  source_inventory_sha256: digest(fs.readFileSync(path.join(base, ledger.source_inventory))),
};
ledger.reference_refresh = refreshed;
additions.reference_refresh = refreshed;
ledger.state = 'レビュー後prototypeの順方向・独立意味単位・逆引きを照合済み。候補の原文・IDを保持し、完了集計はfunction-migration-audit.jsonを参照する。black-boxとproduction反映後の通常検証は別gate。';
additions.state = 'レビュー後prototypeの追加・変更を合意根拠へ対応付けた。原文候補を完了数にせず、独立unitと関係索引を分離したfunction-migration-audit.jsonで集計する。';
ledger.audit = 'function-migration-audit.json';
additions.audit = 'function-migration-audit.json';
const updates = new Map([
  ['function-migration-ledger.json', JSON.stringify(ledger, null, 2) + '\n'],
  ['function-migration-additions.json', JSON.stringify(additions, null, 2) + '\n'],
]);
// 以下は人手で定義した意味単位の展開・参照・集計だけを機械化する。
const entryName = 'entry-template-migration-ledger.md';
const entryOriginal = fs.readFileSync(path.join(base, entryName), 'utf8');
original.set(entryName, entryOriginal);
const entryText = entryOriginal.replace(/\[([^\]]+):\d+–\d+\]\(\.\.\/faciliate-discussion\/([^#)]+)#([^)]*)\)/g, (whole, label, file, heading) => {
  const d = locate({ file, heading: decodeURIComponent(heading) });
  return `[${label}:${d.from}–${d.to}](../faciliate-discussion/${file}#${heading})`;
});
updates.set(entryName, entryText);
const entryRows = entryText.split('\n').filter(l => /^\| E-C\d+ \|/.test(l)).map(line => {
  const cells = line.split('|').map(x => x.trim());
  const destination = [...cells[6].matchAll(/\]\(\.\.\/faciliate-discussion\/([^#)]+)#([^)]*)\)/g)].map(m => locate({ file: m[1], heading: decodeURIComponent(m[2]) }));
  const sourceRanges = cells[2].split(',').map(x => x.split('–').map(Number)).map(a => ({ from: a[0], to: a[1] ?? a[0] }));
  return { id: cells[1], source: { file: 'plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md', ranges: sourceRanges }, meaning: cells[3], destination,
    classification: cells[5].includes('CHANGE') ? 'CHANGE' : cells[5].includes('ADAPT') ? 'ADAPT' : 'MOVE', agreement: [cells[5], 'entry ledgerの共通根拠: 論点15・16'], verification: definition.evidence.entry };
});
if (entryRows.length !== 103) throw new Error(`entry row数が変わった: ${entryRows.length}`);
const structuralSource = new Set(definition.structural_source_ids.map(n => `S-C${String(n).padStart(4, '0')}`));
const structuralAddition = new Set(definition.structural_addition_ids);
const pending = [];
const syntax = [];
const makeUnits = (rows, splits, isComplete, structural, evidence) => rows.flatMap(row => {
  if (structural.has(row.id)) { syntax.push({ candidate: row.id, source: row.source, destination: row.destination, meaning: row.meaning, role: '構造記法・区切り・表示ラベル。連続構造範囲でも保持を確認し、能力として数えない' }); return []; }
  if (!isComplete(row)) { pending.push(row.id); return []; }
  return (splits[row.id] ?? [row.meaning]).map((meaning, index) => {
    const id = `${row.id}.${index + 1}`;
    return { id, candidate: row.id, source: row.source ?? null, kind: row.kind ?? '意味・順序・条件・例の独立照合単位', meaning,
      destination: row.destination, classification: definition.classification_overrides[id] ?? row.classification,
      agreement: row.agreement, verification: { state: '意味単位照合済み', evidence: evidence(row), original_verification: row.verification } };
  });
});
const sourceUnits = makeUnits(ledger.contracts, definition.source_splits, r => definition.completed_source_ranges.some(([a, b]) => +r.id.slice(3) >= a && +r.id.slice(3) <= b), structuralSource,
  r => definition.evidence[+r.id.slice(3) < 374 ? 'execution' : +r.id.slice(3) < 380 ? 'metadata' : 'patterns']);
const addedUnits = makeUnits(additions.contracts, definition.addition_splits, r => definition.completed_addition_ranges.some(([prefix, a, b]) => r.id.startsWith(prefix) && +r.id.slice(prefix.length) >= a && +r.id.slice(prefix.length) <= b), structuralAddition, () => definition.evidence.additions);
const relations = addedUnits.filter(u => additions.contracts.find(r => r.id === u.candidate).source_contracts?.length);
const additionUnits = addedUnits.filter(u => !relations.includes(u));
for (const row of definition.new_additions) additionUnits.push({ ...row, candidate: row.id, source: null, kind: '合意済み追加・例・誤適用防止', destination: row.destination.map(d => locate(d)), verification: { state: '意味単位照合済み', evidence: 'レビュー指摘の対処記録・該当decisionと現在本文を照合' } });
const entryUnits = makeUnits(entryRows, definition.entry_splits, () => true, new Set(), () => definition.evidence.entry);
const counted = [...sourceUnits, ...entryUnits, ...additionUnits];
for (const u of counted) if (['ADD', 'CHANGE', 'RETIRE'].includes(u.classification) && !u.agreement?.length) throw new Error(`合意根拠なし: ${u.id}`);
const classifications = Object.fromEntries(['KEEP', 'MOVE', 'ADAPT', 'ADD', 'CHANGE', 'RETIRE'].map(k => [k, counted.filter(u => u.classification === k).length]));
const audit = {
  steering_root: '..', prototype_root: '../faciliate-discussion', baseline: ledger.baseline,
  definition: 'contract-audit-definition.json', definition_sha256: digest(original.get('contract-audit-definition.json')),
  state: '原文候補から独立意味単位への展開結果。意味照合は定義と各unitの根拠へ辿る。参照・行coverageは意味保存の代用でない。',
  counting: '原文上のcontractの出現単位。重複した規則の出現は各sourceごとに追う。旧規則を逆引きするN-C関係索引とE-A要約は加算しない。構造記法も加算しない。',
  classifications, pending_candidates: pending,
  source_units: sourceUnits, entry_units: entryUnits, addition_units: additionUnits,
  relation_units: relations, structural_occurrences: [...ledger.structuralOnly, ...syntax],
  files: refreshed.files, source_inventory_sha256: refreshed.source_inventory_sha256,
};
const auditName = 'function-migration-audit.json';
original.set(auditName, fs.existsSync(path.join(base, auditName)) ? fs.readFileSync(path.join(base, auditName), 'utf8') : '');
updates.set(auditName, JSON.stringify(audit, null, 2) + '\n');

// sourceと現在prototypeの実差分から逆引き。原文・inventoryは変更しない。
const reverseName = 'function-migration-reverse-index.json';
original.set(reverseName, fs.readFileSync(path.join(base, reverseName), 'utf8'));
const allRows = [...ledger.contracts, ...entryRows, ...additions.contracts, ...definition.new_additions.map(r => ({ ...r, destination: r.destination.map(d => locate(d)) }))];
function destinationIDs(file, line) {
  return allRows.filter(r => r.destination.some(d => d.file === file && d.from <= line && d.to >= line)).map(r => r.id);
}
function sourceIDs(file, line) {
  return [...ledger.contracts, ...entryRows].filter(r => r.source?.file === file && (r.source.ranges ?? [r.source]).some(s => s.from <= line && s.to >= line)).map(r => r.id);
}
const reverseRows = [];
const deleted = [];
const added = [];
const baselineEqual = [];
const sourceFiles = [...new Set([...ledger.contracts, ...entryRows].map(r => r.source.file))];
for (const file of sourceFiles) {
  const before = execFileSync('git', ['show', `${ledger.baseline}:${file}`], { cwd: repository, encoding: 'utf8' });
  const current = fs.readFileSync(path.join(repository, file), 'utf8');
  if (before !== current) throw new Error(`baselineとproductionが一致しない: ${file}`);
  const short = file.replace('plugins/tumeda-dev/skills/facilitate-discussion/', '');
  baselineEqual.push({ file, sha256: digest(before), prototype_equal: fs.existsSync(path.join(prototype, short)) ? fs.readFileSync(path.join(prototype, short), 'utf8') === before : null });
  if (!fs.existsSync(path.join(prototype, short))) continue;
  const diff = spawnSync('git', ['diff', '--no-index', '--unified=0', path.join(repository, file), path.join(prototype, short)], { encoding: 'utf8' });
  if (![0, 1].includes(diff.status)) throw new Error(diff.stderr);
  let oldLine = 0, newLine = 0;
  for (const line of diff.stdout.split('\n')) {
    const h = line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (h) { oldLine = +h[1]; newLine = +h[2]; continue; }
    if (line.startsWith('---') || line.startsWith('+++') || line.startsWith('\\')) continue;
    if (line.startsWith('-')) { deleted.push({ file, line: oldLine, contracts: sourceIDs(file, oldLine), structures: ledger.structure.filter(s => s.source.file === file && s.source.from <= oldLine && s.source.to >= oldLine).map(s => s.id), blank: line.length === 1 }); oldLine++; }
    else if (line.startsWith('+')) { added.push({ file: short, line: newLine, contracts: destinationIDs(short, newLine), blank: line.length === 1 }); newLine++; }
    else if (line.startsWith(' ')) { oldLine++; newLine++; }
  }
}
for (const [file, doc] of cache) {
  if (doc.owner !== 'prototype') continue;
  for (let i = 0; i < doc.lines.length; i++) {
    const text = doc.lines[i]; if (!text.trim()) continue;
    const ids = destinationIDs(file, i + 1);
    const structural = /^(?:#{1,6} |\s*[`~]{3,}|---$|\|\s*[-:]|<a id=)/.test(text);
    const prototypeOnly = text.startsWith('> 設計確認用prototype。productionへ配布・登録していない。');
    reverseRows.push({ file, line: i + 1, old: ids.filter(x => x.startsWith('S-')), entry: ids.filter(x => x.startsWith('E-')), agreed: ids.filter(x => x.startsWith('N-')), structural, prototypeOnly });
  }
}
const entrySource = 'plugins/tumeda-dev/skills/facilitate-discussion/templates/discussion_entry.md';
const entryStructures = entryText.split('\n').filter(l => /^\| E-S\d+ \|/.test(l)).map(l => { const c = l.split('|').map(x => x.trim()); const [from, to] = c[2].split('–').map(Number); return { id: c[1], from, to }; });
for (const r of deleted) if (r.file === entrySource) r.structures.push(...entryStructures.filter(s => s.from <= r.line && s.to >= r.line).map(s => s.id));
const unlinked = [
  ...deleted.filter(r => !r.blank && !r.contracts.length && !r.structures.length).map(r => ({ direction: 'deleted', ...r })),
  ...reverseRows.filter(r => !r.old.length && !r.entry.length && !r.agreed.length && !r.structural && !r.prototypeOnly).map(r => ({ direction: 'current', ...r })),
];
const reverse = { steering_root: '..', prototype_root: '../faciliate-discussion', baseline: ledger.baseline,
  state: 'レビュー後の実diff・全非空行を再接続。candidate IDはfunction-migration-audit.jsonの独立unitへ展開する。行coverageは意味保存を証明しない。',
  baseline_checks: baselineEqual, files: refreshed.files, diff: { deleted, added }, rows: reverseRows, unlinked };
updates.set(reverseName, JSON.stringify(reverse, null, 2) + '\n');
const result = { reference_files: Object.keys(refreshed.files).length, independent_units: { source: sourceUnits.length, entry: entryUnits.length, added: additionUnits.length, relation_not_counted: relations.length }, classifications, pending_candidates: pending.length, structural: audit.structural_occurrences.length, deleted: deleted.length, added: added.length, current_nonempty: reverseRows.length, unlinked };
if (process.argv.includes('--write')) {
  for (const [name, text] of updates) fs.writeFileSync(path.join(base, name), text);
  console.log(JSON.stringify({ refreshed: [...updates.keys()], ...result, source_inventory_sha256: refreshed.source_inventory_sha256 }));
} else if (process.argv.includes('--patch')) {
  console.log('*** Begin Patch');
  for (const [name, text] of updates) {
    if (original.get(name) === text) continue;
    console.log(`*** ${original.get(name) ? 'Update' : 'Add'} File: ${path.join(base, name)}`);
    if (original.get(name)) { console.log('@@'); console.log(original.get(name).trimEnd().split('\n').map(s => '-' + s).join('\n')); }
    console.log(text.trimEnd().split('\n').map(s => '+' + s).join('\n'));
  }
  console.log('*** End Patch');
} else {
  console.log(JSON.stringify(result, null, 2));
}
