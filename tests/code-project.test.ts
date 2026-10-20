import {test} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';import os from 'node:os';
import {mkdtemp,readFile,writeFile,rm,access} from 'node:fs/promises';
import {codeProjectSchema,scoreSchema,initCode,readCodeProject,reviewCode,runCode} from '../src/code-project.js';
import {projectSchema} from '../src/schema.js';import {reviewProject} from '../src/reel-review.js';
test('code descriptor preserves metadata ownership and rejects unsafe exports or ambiguous dimensions',()=>{
 const p=codeProjectSchema.parse({version:2,name:'custom',entryPoint:'src/index.tsx',compositionId:'Custom'});assert.deepEqual(p.overrides,{});assert.equal(p.quality,'final');
 assert.throws(()=>codeProjectSchema.parse({...p,exports:[{name:'../overwrite'}]}));assert.throws(()=>codeProjectSchema.parse({...p,exports:[{name:'vertical',width:1080}]}));
 assert.throws(()=>codeProjectSchema.parse({...p,renderer:'arbitrary'}));
});
test('frame score permits one-frame accents, overlapping reading windows and enforces half-open ranges',()=>{
 const score=scoreSchema.parse([{kind:'shot',label:'continuous move',startFrame:0,endFrame:90},{kind:'reading',label:'proof persists',startFrame:10,endFrame:75},{kind:'accent',label:'one frame',startFrame:20,endFrame:21}]);assert.equal(score[2].endFrame-score[2].startFrame,1);
 assert.throws(()=>scoreSchema.parse([{kind:'accent',label:'empty',startFrame:20,endFrame:20}]));assert.throws(()=>scoreSchema.parse([{kind:'shot',label:'fraction',startFrame:.5,endFrame:30}]));
});
test('init creates a standalone project with complete local motion source and locked fonts/dependencies',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'vf-init-'));try{const out=path.join(dir,'new-parent','film');await initCode(out);await access(path.join(out,'lib/index.tsx'));await access(path.join(out,'public/SpaceGrotesk.ttf'));await access(path.join(out,'public/FONT-LICENSE.txt'));await access(path.join(out,'package-lock.json'));assert.equal((await readCodeProject(path.join(out,'project.json'))).version,2);const review=await reviewCode(path.join(out,'project.json'));assert.ok(review.score.length);await assert.rejects(()=>initCode(out),/EEXIST/);}finally{await rm(dir,{recursive:true,force:true});}
});
test('missing code entry fails before output creation and before launching a browser',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'vf-bad-code-'));try{const file=path.join(dir,'project.json'),out=path.join(dir,'..',`${path.basename(dir)}-output`);await writeFile(file,JSON.stringify({version:2,name:'missing',entryPoint:'missing.tsx',compositionId:'Film'}));await assert.rejects(()=>runCode(file,out),/Cannot read asset/);await assert.rejects(()=>access(out));}finally{await rm(dir,{recursive:true,force:true});}
});
test('mesh worlds receive the same pacing and repetition inspection as other scenes',()=>{
 const world={camera:{keys:[{at:0,position:[0,0,6],target:[0,0,0]},{at:4,position:[0,0,5],target:[0,0,0]}]},objects:[{id:'hero',shape:'box',position:[0,0,0]}]};
 const p=projectSchema.parse({version:1,name:'slow-world',workflow:'short-form-reel',reel:{bpm:120},scenes:[0,1,2].map(()=>({kind:'world',title:'World',duration:4,world}))});const codes=reviewProject(p).warnings.map(w=>w.code);assert.ok(codes.includes('slow-opening'));assert.ok(codes.includes('long-hold'));assert.ok(codes.includes('repeated-treatment'));
});
test('draft scaling keeps common social formats even-sized without changing aspect or frame timing',async()=>{
 const {draftScale}=await import('../src/code-project.js');for(const [w,h] of [[1080,1920],[1920,1080],[1080,1350],[1080,1080],[360,640]]){const s=draftScale(w,h);assert.equal(Math.round(w*s)%2,0);assert.equal(Math.round(h*s)%2,0);assert.ok(w*s<=540);assert.ok(Math.abs(w/h-(w*s)/(h*s))<1e-12);}
});
