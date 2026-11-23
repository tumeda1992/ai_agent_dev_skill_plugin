// 合意済み補助変更の全文差分と、このskillの単純frontmatterを限定検査する。
// PyYAMLを使う公式quick_validate.pyの実行ではなく、一般YAMLの代替parserでもない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const b='.steering/2026/202609/20260921-restructure-facilitate-discussion/';
const read=f=>fs.readFileSync(f,'utf8');
// 比較元は移行開始時の固定revision。commit後のHEADを旧版として扱わない。
const baseline='a6e24853800fcb75eb6a7bdd91479a633f740d4a';
const old=f=>execFileSync('git',['show',baseline+':'+f],{encoding:'utf8'});
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
const checks=[];
function same(f,expected,scope){assert.equal(read(f),expected,f);checks.push({file:f,scope,sha256:digest(read(f)),passed:true})}
const v=read(b+'discussion-recording/validator-caller-design.md'),thinking=read(b+'thinking-standard-evolution/thinking-standards-design.md');
let f='scripts/verification/validate-plugin.mjs',s=old(f),start=s.indexOf('const discussionSkill ='),end=s.indexOf('const taskDesignSkill =');
same(f,(s.slice(0,start)+read(b+'integration/validate-plugin.discussion.inc.mjs')+'\n'+s.slice(end)).replace('const expectedRelease = "8.0.1";','const expectedRelease = "8.0.2";'),'合意済み置換片とversion以外は全文不変');
for(const [f,prefix] of [['plugins/tumeda-dev/skills/task-design/SKILL.md','-- `facilitate'],['plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md','-summary']]){
  const lines=v.split('\n'),i=lines.findIndex(l=>l.startsWith(prefix));s=old(f).replace(lines[i].slice(1),lines[i+1].slice(1));
  if(prefix==='-summary'){const lines=s.split('\n'),i=lines.findIndex(l=>l.startsWith('正本を比較する時点と完了直前'));lines.splice(i+1,0,'',v.match(/```markdown\n(discussionから[\s\S]*?)\n```/)[1]);s=lines.join('\n')}
  same(f,s,'二層接続の合意diffとcatch-up追記以外は全文不変');
}
f='scripts/verification/test-task-design-handoff.mjs';
same(f,old(f).replace('    "canonical file digest",','    "canonical file digest",\n    "discussion、接続された内部検討記録、既存attempt本文、canonical file全体を読むことは禁止",\n    "内部logを比較根拠として読んだ場合は、そのexactなfileをcanonical file digestの対象へ加える",'),'二assertion追加以外は全文不変');
same('plugins/tumeda-dev/docs/think_standards/evolution_policy.md',thinking.match(/```markdown\n([\s\S]*?)\n```/)[1]+'\n','合意済み維持規律全文と一致');
const names=[...thinking.matchAll(/^\| (\w+\.md) \| ([^|]+) \| ([^|]+) \|$/gm)].map(m=>({file:m[1],old:m[2].trim(),next:m[3].trim()}));assert.equal(names.length,11);
const docs='plugins/tumeda-dev/docs/think_standards/';
for(const name of fs.readdirSync(docs).filter(n=>n.endsWith('.md')&&n!=='evolution_policy.md')){
  const f=docs+name;let s=old(f);
  for(const n of names){if(name===n.file)s=s.replace('# '+n.old+'\n','# '+n.next+'\n');s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(all,label,url)=>url.split('#')[0].endsWith('/'+n.file)||url.split('#')[0]===n.file?'['+(label===n.old?n.next:label)+']('+url+')':all)}
  if(name==='making_and_choosing_options.md')s=s.replace('## a/b/c または 1/2/3 で答えられる形式','## 補助: a/b/c または 1/2/3 で答えられる形式').replace('## 畳めたことは、議論が不要になったことを意味しない','## 補助: 畳めたことは、議論が不要になったことを意味しない');
  same(f,s,'11場面の表示名・対応link label・指定二h2以外は全文不変');
}
for(const f of ['plugins/tumeda-dev/.codex-plugin/plugin.json','plugins/tumeda-dev/.claude-plugin/plugin.json','.claude-plugin/marketplace.json'])same(f,old(f).replaceAll('"version": "8.0.1"','"version": "8.0.2"'),'versionのみ一度のPATCH更新');
const skill=read('plugins/tumeda-dev/skills/facilitate-discussion/SKILL.md');
const m=skill.match(/^---\n([^]*?)\n---\n/);assert.ok(m);
const lines=m[1].split('\n');assert.equal(lines.length,2);
const values=Object.fromEntries(lines.map(l=>{const m=l.match(/^(name|description): (.+)$/u);assert.ok(m);return [m[1],m[2]]}));
assert.deepEqual(Object.keys(values).sort(),['description','name']);
assert.match(values.name,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);assert.ok(values.name.length<=64);
assert.ok([...values.description].length<=1024);assert.ok(!/[<>]/.test(values.description));assert.ok(!values.description.startsWith('[TODO:'));
// 今回の二値はplain scalar。複雑なYAMLを受け付けて検査済みとしない。
for(const value of Object.values(values)){assert.ok(!/[:]\s|\s#|^[\[\]{}&*!|>'"%@`]/u.test(value))}
let fence=null;
for(const line of skill.slice(m[0].length).split('\n')){const mark=line.match(/^[ \t]*(?:(?:[-+*]|\d+[.)])[ \t]+)?(`{3,}|~{3,})(.*)$/);if(mark){if(!fence)fence=mark[1];else if(mark[1][0]===fence[0]&&mark[1].length>=fence.length&&!mark[2].trim())fence=null;continue}if(!fence)assert.ok(!/^[ ]{0,3}\[TODO:[^\n]*\][ \t]*$/.test(line))}
const result={scope:'補助変更の正確な投影と、現物の二fieldだけに限定したfrontmatter/name/description/scaffold検査。公式quick_validateは未実行のまま',checks,frontmatter:{passed:true,keys:Object.keys(values),description_characters:[...values.description].length,parser_scope:'二行のplain scalarだけ'},official_quick_validate:'blocked: yaml package不足'};
if(process.argv.includes('--write'))fs.writeFileSync(b+'integration/production-validation/supplemental-result.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({supplementary_files:checks.length,frontmatter:result.frontmatter,official_quick_validate:result.official_quick_validate}));
