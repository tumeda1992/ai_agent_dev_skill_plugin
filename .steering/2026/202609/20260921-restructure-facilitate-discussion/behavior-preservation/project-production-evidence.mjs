// 意味照合済みprototypeの各unitを、許可された機械投影と実diffを介してproductionへ接続する。
// 元のsource inventory・prototype ledgerは変更しない。意味の再判定を自動化しない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(dir,'../../../../../');
const production='plugins/tumeda-dev/skills/facilitate-discussion/';
const prototype=path.resolve(dir,'../faciliate-discussion');
const read=f=>fs.readFileSync(f,'utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const json=f=>JSON.parse(read(path.join(dir,f)));
const audit=json('function-migration-audit.json'),reverse=json('function-migration-reverse-index.json');
const strip='> 設計確認用prototype。productionへ配布・登録していない。未監査範囲は [README.md](README.md) を参照する。';
const normalize=s=>s.replaceAll('../../../../../plugins/tumeda-dev/docs/','../../docs/').replace('各fileの例は記入方法の例であり、このprototypeで実測した事実ではない。','各fileの例は記入方法の例であり、実際の調査・検証結果ではない。').replace('例は型を説明するもので、このprototypeの実測結果ではない。','例は型を説明するもので、実際の調査・検証結果ではない。');
const records={},lineMaps={},errors=[],refs=[];
if(hash(read(path.join(dir,'function-migration-source-inventory.json')))!==audit.source_inventory_sha256)throw Error('source inventory変更');
for(const [f,original] of Object.entries(audit.files)){
  const target=production+f,actual=read(path.join(repo,target));
  const source=read(original.owner==='production-KEEP'?path.join(repo,target):path.join(prototype,f));
  if(hash(source)!==original.sha256)throw Error('固定hash不一致: '+f);
  let skipNext=false;const kept=[],map={};
  source.split('\n').forEach((line,i)=>{if(f==='SKILL.md'&&line===strip){skipNext=true;return}if(skipNext){if(line!=='')throw Error('prototype注記後の形式不一致');skipNext=false;return}map[i+1]=kept.length+1;kept.push(normalize(line))});
  if(kept.join('\n')!==actual)throw Error('許可投影以外の本文差: '+f);
  lineMaps[f]=map;records[f]={prototype_sha256:original.sha256,production_file:target,production_sha256:hash(actual),projection:'標準relative pathの変更。SKILL.mdのprototype注記と後続空行を除く。format READMEとgeneralizationの例≠実測という契約を保ってprototype依存の指示語だけを除く。他の意味本文は一致',equal_after_authorized_projection:true};
  for(const m of actual.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
    const url=m[1].split('#')[0];if(!url||/^(https?:|mailto:)/.test(url)||/[{}]/.test(url))continue;
    const resolved=path.resolve(repo,production,path.dirname(f),url);
    refs.push({file:target,href:m[1],exists:fs.existsSync(resolved)});
  }
}
for(const r of refs)if(!r.exists)errors.push({kind:'参照先不在',...r});
const mapDestination=d=>{const m=lineMaps[d.file];if(!m?.[d.from]||!m?.[d.to])throw Error('destination境界を投影できない: '+JSON.stringify(d));return {...d,file:production+d.file,from:m[d.from],to:m[d.to],owner:'production',prototype_destination:d}};
const units=[...audit.source_units,...audit.entry_units,...audit.addition_units].map(u=>({...u,destination:u.destination.map(mapDestination),production_verification:'固定prototypeとの許可投影後全文一致。意味照合根拠はverificationを維持し、参照解決と実diffを別途確認'}));
const relations=audit.relation_units.map(u=>({...u,destination:u.destination?.map(mapDestination)}));
const sourceRelations=new Map(json('function-migration-additions.json').contracts.filter(c=>c.source_contracts?.length).map(c=>[c.id,c.source_contracts]));
const structuralCandidates=new Set(audit.structural_occurrences.map(s=>s.candidate));
const candidateUnits=new Map();for(const u of units){const a=candidateUnits.get(u.candidate)??[];a.push(u);candidateUnits.set(u.candidate,a)}
const rows=reverse.rows.filter(r=>lineMaps[r.file]?.[r.line]).map(r=>{
  const line=lineMaps[r.file][r.line],file=production+r.file;
  const candidates=[...r.old,...r.entry,...r.agreed];
  const direct=candidates.flatMap(c=>(candidateUnits.get(c)??[]).filter(u=>u.destination.some(d=>d.file===file&&d.from<=line&&line<=d.to)).map(u=>u.id));
  const viaRelations=candidates.flatMap(c=>relations.filter(u=>u.candidate===c&&u.destination.some(d=>d.file===file&&d.from<=line&&line<=d.to)).map(u=>({relation:u.id,source_units:(sourceRelations.get(c)??[]).flatMap(s=>(candidateUnits.get(s)??[]).map(u=>u.id))})));
  const ids=[...new Set([...direct,...viaRelations.flatMap(r=>r.source_units)])];
  return {file,line,units:ids,via_relations:viaRelations,candidates,structural:r.structural||candidates.some(c=>structuralCandidates.has(c)),prototype_row:{file:r.file,line:r.line}};
});
const rowMap=new Map(rows.map(r=>[r.file+':'+r.line,r]));
const oldDeleted=new Map(reverse.diff.deleted.map(r=>[r.file+':'+r.line,r]));
const diffs=[],baselineChecks=[];
for(const f of Object.keys(records)){
  const file=production+f,old=spawnSync('git',['show',audit.baseline+':'+file],{cwd:repo,encoding:'utf8'});
  const actual=read(path.join(repo,file));
  let diff;
  if(old.status===0){
    const head=execFileSync('git',['show','HEAD:'+file],{cwd:repo,encoding:'utf8'});
    // commit前はbaseline、commit後は上で全文照合した許可投影だけを認める。
    // 無関係なHEAD差分を許容せず、diffの比較元は固定baselineのまま保つ。
    if(head!==old.stdout&&head!==actual)throw Error('baseline・許可投影以外のHEAD変更: '+file);
    baselineChecks.push({file,baseline_sha256:hash(old.stdout),head_equal_baseline:head===old.stdout,head_equal_authorized_projection:head===actual});
    diff=execFileSync('git',['diff','--no-ext-diff','--unified=0',audit.baseline,'--',file],{cwd:repo,encoding:'utf8'});
  }else{
    const result=spawnSync('git',['diff','--no-index','--no-ext-diff','--unified=0','/dev/null',path.join(repo,file)],{cwd:repo,encoding:'utf8'});
    if(![0,1].includes(result.status))throw Error(result.stderr);diff=result.stdout;
    baselineChecks.push({file,baseline_absent:true});
  }
  let oldLine=0,newLine=0;
  for(const text of diff.split('\n')){
    const h=text.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);if(h){oldLine=+h[1];newLine=+h[2];continue}
    if(text.startsWith('---')||text.startsWith('+++'))continue;
    if(text.startsWith('-')){
      const line=oldLine++,value=text.slice(1),oldRow=oldDeleted.get(file+':'+line);
      const ids=units.filter(u=>u.source?.file===file&&((u.source.from<=line&&line<=u.source.to)||(u.source.ranges??[]).some(r=>r.from<=line&&line<=r.to))).map(u=>u.id);
      const structural=Boolean(oldRow?.structures?.length)||!value.trim();
      if(!ids.length&&!structural)errors.push({kind:'未分類削除',file,line,value});
      diffs.push({side:'deleted',file,line,text:value,units:ids,structural,structure_ids:oldRow?.structures??[]});
    }else if(text.startsWith('+')){
      const line=newLine++,value=text.slice(1),row=rowMap.get(file+':'+line),structural=!value.trim()||Boolean(row?.structural);
      if(!row?.units.length&&!structural)errors.push({kind:'未分類追加',file,line,value});
      diffs.push({side:'added',file,line,text:value,units:row?.units??[],structural});
    }else if(text.startsWith(' ')){oldLine++;newLine++}
  }
}
const classification={};for(const u of units)classification[u.classification]=(classification[u.classification]??0)+1;
const output={scope:'facilitate-discussion productionの23file。validator/caller/思考標準/versionはproduction-verification.mdで別照合する',baseline:audit.baseline,prototype_audit_sha256:hash(read(path.join(dir,'function-migration-audit.json'))),source_inventory_sha256:audit.source_inventory_sha256,counting:audit.counting,classifications:classification,files:records,baseline_checks:baselineChecks,units,relation_units:relations,rows,diff:diffs,links:refs,errors};
if(process.argv.includes('--write'))fs.writeFileSync(path.join(dir,'production-migration-evidence.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({files:Object.keys(records).length,units:units.length,classifications:classification,relations:relations.length,diff:{deleted:diffs.filter(d=>d.side==='deleted').length,added:diffs.filter(d=>d.side==='added').length},links:refs.length,errors},null,2));
if(errors.length)process.exitCode=1;
