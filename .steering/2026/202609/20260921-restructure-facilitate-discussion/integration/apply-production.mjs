// 合意済み本文の一回限りの機械投影。未変更のproductionにだけ適用する。
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const b='.steering/2026/202609/20260921-restructure-facilitate-discussion/';
const roots=['plugins/tumeda-dev','scripts/verification/validate-plugin.mjs','scripts/verification/test-task-design-handoff.mjs','.claude-plugin/marketplace.json'];
if(execFileSync('git',['status','--porcelain','--',...roots],{encoding:'utf8'}).trim())throw Error('productionの既存変更を検出。上書きしない');
const changes=new Map();
const read=f=>fs.readFileSync(f,'utf8');
const set=(f,s)=>{if(!fs.existsSync(f)||read(f)!==s)changes.set(f,s)};
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
for(const rel of ['SKILL.md','iteration.md','record-recovery.md',...walk(b+'faciliate-discussion/templates').map(f=>path.relative(b+'faciliate-discussion',f))]){
  let s=read(b+'faciliate-discussion/'+rel).replaceAll('../../../../../plugins/tumeda-dev/docs/','../../docs/');
  if(rel==='templates/consideration-records/README.md')s=s.replace('各fileの例は記入方法の例であり、このprototypeで実測した事実ではない。','各fileの例は記入方法の例であり、実際の調査・検証結果ではない。');
  if(rel==='templates/consideration-records/generalization.md')s=s.replace('例は型を説明するもので、このprototypeの実測結果ではない。','例は型を説明するもので、実際の調査・検証結果ではない。');
  if(rel==='SKILL.md')s=s.replace('> 設計確認用prototype。productionへ配布・登録していない。未監査範囲は [README.md](README.md) を参照する。\n\n','');
  set('plugins/tumeda-dev/skills/facilitate-discussion/'+rel,s);
}
const v=read(b+'discussion-recording/validator-caller-design.md');
let f='scripts/verification/validate-plugin.mjs',s=read(f);
const a=s.indexOf('const discussionSkill ='),z=s.indexOf('const taskDesignSkill =');
if(a<0||z<a)throw Error('validator境界不一致');
set(f,(s.slice(0,a)+read(b+'integration/validate-plugin.discussion.inc.mjs')+'\n'+s.slice(z)).replace('const expectedRelease = "8.0.1";','const expectedRelease = "8.0.2";'));
for(const [f,prefix] of [['plugins/tumeda-dev/skills/task-design/SKILL.md','-- `facilitate'],['plugins/tumeda-dev/skills/task-design-work-handoff-contracts.md','-summary']]){
  const lines=v.split('\n'),i=lines.findIndex(l=>l.startsWith(prefix));
  if(i<0)throw Error('設計diff不在');
  const old=lines[i].slice(1),next=lines[i+1].slice(1);
  let s=read(f);if(s.split(old).length!==2)throw Error('置換対象が一意でない: '+f);
  s=s.replace(old,next);
  if(prefix==='-summary'){
    const paragraph=v.match(/```markdown\n(discussionから[\s\S]*?)\n```/)[1],lines=s.split('\n');
    const i=lines.findIndex(l=>l.startsWith('正本を比較する時点と完了直前'));if(i<0)throw Error('handoff挿入先不在');
    lines.splice(i+1,0,'',paragraph);s=lines.join('\n');
  }
  set(f,s);
}
f='scripts/verification/test-task-design-handoff.mjs';
set(f,read(f).replace('    "canonical file digest",','    "canonical file digest",\n    "discussion、接続された内部検討記録、既存attempt本文、canonical file全体を読むことは禁止",\n    "内部logを比較根拠として読んだ場合は、そのexactなfileをcanonical file digestの対象へ加える",'));
const td=read(b+'thinking-standard-evolution/thinking-standards-design.md');
set('plugins/tumeda-dev/docs/think_standards/evolution_policy.md',td.match(/```markdown\n([\s\S]*?)\n```/)[1]+'\n');
const names=[...td.matchAll(/^\| (\w+\.md) \| ([^|]+) \| ([^|]+) \|$/gm)].map(m=>({file:m[1],old:m[2].trim(),next:m[3].trim()}));
if(names.length!==11)throw Error('場面名数不一致');
for(const f of walk('plugins/tumeda-dev').filter(f=>f.endsWith('.md'))){
  const original=changes.get(f)??read(f);let s=original;
  for(const n of names){
    if(f==='plugins/tumeda-dev/docs/think_standards/'+n.file)s=s.replace('# '+n.old+'\n','# '+n.next+'\n');
    s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(all,label,url)=>url.split('#')[0].endsWith('/'+n.file)||url.split('#')[0]===n.file?'['+(label===n.old?n.next:label)+']('+url+')':all);
  }
  if(f.endsWith('/think_standards/making_and_choosing_options.md'))s=s.replace('## a/b/c または 1/2/3 で答えられる形式','## 補助: a/b/c または 1/2/3 で答えられる形式').replace('## 畳めたことは、議論が不要になったことを意味しない','## 補助: 畳めたことは、議論が不要になったことを意味しない');
  if(s!==original)set(f,s);
}
for(const f of ['plugins/tumeda-dev/.codex-plugin/plugin.json','plugins/tumeda-dev/.claude-plugin/plugin.json','.claude-plugin/marketplace.json']){
  s=read(f);if(!s.includes('"version": "8.0.1"'))throw Error('version前提不一致');
  set(f,s.replaceAll('"version": "8.0.1"','"version": "8.0.2"'));
}
// 全入力の解決が終わってから書き込む。削除やGit操作は行わない。
for(const [f,s] of changes){fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,s);console.log(f)}
