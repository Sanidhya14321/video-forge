import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
import os from 'node:os';
const exec=promisify(execFile),sha=(b:string)=>createHash('sha256').update(b).digest('hex');
test('release verification detects tampering, extra files and unsafe names',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'vf-release-'));
 try{
  const data='verified artifact',manifest=JSON.stringify({tag:'vtest',assets:[{name:'runtime.zip',bytes:Buffer.byteLength(data),sha256:sha(data)}]});
  const sums=`${sha(data)}  runtime.zip\n${sha(manifest)}  release-manifest.json\n`;
  await writeFile(path.join(dir,'runtime.zip'),data);await writeFile(path.join(dir,'release-manifest.json'),manifest);await writeFile(path.join(dir,'SHA256SUMS.txt'),sums);
  const verify=()=>exec('python3',['scripts/verify-release.py',dir]);
  assert.match((await verify()).stdout,/Verified release/);
  await writeFile(path.join(dir,'runtime.zip'),'modified');await assert.rejects(verify,/Checksum mismatch/);
  await writeFile(path.join(dir,'runtime.zip'),data);await writeFile(path.join(dir,'extra.txt'),'unexpected');await assert.rejects(verify,/unlisted/);
  await rm(path.join(dir,'extra.txt'));await writeFile(path.join(dir,'SHA256SUMS.txt'),`${sha(data)}  ../runtime.zip\n`);await assert.rejects(verify,/Invalid/);
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('generated ChatGPT companion resolves local references without a rendering claim',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'vf-companion-'));const out=path.join(dir,'companion');
 try{
  await exec('python3',['scripts/host_adapters.py','--out',out]);
  const manifest=JSON.parse(await readFile(path.join(out,'manifest.json'),'utf8'));assert.equal(manifest.runtimeIncluded,false);assert.equal(manifest.mode,'planning-and-local-handoff');
  const {readdir,access}=await import('node:fs/promises');
  for(const name of await readdir(out))if(name.endsWith('.md'))for(const match of (await readFile(path.join(out,name),'utf8')).matchAll(/\]\(([^)]+)\)/g))if(!/^(https?:|#|mailto:)/.test(match[1]))await access(path.join(out,match[1].split('#')[0]));
 }finally{await rm(dir,{recursive:true,force:true});}
});
