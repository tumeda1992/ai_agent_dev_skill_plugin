#!/usr/bin/env node
import { readFileSync } from "node:fs";

const designPath = process.argv[2];

function fail(message) {
  process.stderr.write(`extract-handoff-input: ${message}\n`);
  process.exitCode = 1;
}

if (!designPath || process.argv.length !== 3) {
  fail("design.mdのpathを一つだけ指定する必要があります");
} else {
  let source;
  try {
    source = readFileSync(designPath, "utf8");
  } catch (error) {
    fail(`読取失敗: ${error.message}`);
  }

  if (source !== undefined) {
    const lines = source.split(/\r?\n/u);
    const headings = lines
      .map((line, index) => ({ line, index, match: /^(#{1,6})\s+(.+?)\s*$/u.exec(line) }))
      .filter(({ match }) => match);
    const targets = ["元の依頼内容", "上位roadmap制約"];
    const sections = [];

    for (const title of targets) {
      const matches = headings.filter(({ match }) => match[1].length === 2 && match[2] === title);
      if (matches.length > 1) {
        fail(`対象見出し「${title}」が重複しています`);
        break;
      }
      if (matches.length === 1) sections.push({ title, heading: matches[0] });
    }

    if (!process.exitCode) {
      const original = sections.find(({ title }) => title === "元の依頼内容");
      if (!original) {
        fail("対象見出し「元の依頼内容」がありません");
      } else {
        const output = [];
        for (const { title, heading } of sections.sort((a, b) => a.heading.index - b.heading.index)) {
          const next = headings.find(({ index }) => index > heading.index && /^#{1,2}\s/u.test(lines[index]));
          const end = next ? next.index : lines.length;
          const body = lines.slice(heading.index + 1, end).join("\n").trim();
          if (!body) {
            fail(`対象見出し「${title}」の境界が壊れているか本文が空です`);
            break;
          }
          output.push(`## ${title}\n\n${body}`);
        }
        if (!process.exitCode) process.stdout.write(`${output.join("\n\n")}\n`);
      }
    }
  }
}
