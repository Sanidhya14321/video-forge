import {mkdtemp,cp,readFile,writeFile,rm} from 'node:fs/promises';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';
import {verifyCodeFrames} from '../dist/code-project.js';import {exec,binary} from '../dist/media.js';
const tmp=await mkdtemp(path.join(os.tmpdir(),'vf-zero-lens-'));
try{
 const project=path.join(tmp,'project');await cp(new URL('../examples/code-smoke/',import.meta.url),project,{recursive:true,filter:p=>path.basename(p)!=='node_modules'});
 const file=path.join(project,'project.json'),json=JSON.parse(await readFile(file,'utf8'));json.inputProps={strength:0};await writeFile(file,JSON.stringify(json));
 const report=await verifyCodeFrames(file,path.join(tmp,'frames'),[15,0,15]);assert.ok(report.consistent);
 // At zero strength the formerly bright lower lens rim must preserve the supplied solid color.
 const {stdout}=await exec(binary('ffmpeg'),['-v','error','-i',path.join(tmp,'frames','0-15.png'),'-vf','crop=1:1:180:467,format=rgb24','-f','rawvideo','-'],{encoding:'buffer'});
 assert.deepEqual([...stdout],[223,255,0]);console.log('Zero-strength optical pass preserves its background; repeated frame PNGs match.');
}finally{await rm(tmp,{recursive:true,force:true});}
