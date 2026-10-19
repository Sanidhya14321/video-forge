import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,access,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {projectSchema,motionPresets,dimensions} from '../src/schema.js';
import {reelLayout,beatAt,seededUnit,captionGroup} from '../src/reel-layout.js';
import {reviewProject} from '../src/reel-review.js';
import {previewProject,snapshotRenderer} from '../src/runner.js';
const base={version:1,name:'reel-test',workflow:'short-form-reel',reel:{bpm:160,safeArea:'reels'},scenes:[{kind:'reel',title:'ONE\nIDEA',duration:1.5,motion:{preset:'fragment-merge'}}],exports:[{preset:'vertical'}]};
test('reel schema requires explicit supported motion and meaningful inputs',()=>{
 assert.throws(()=>projectSchema.parse({...base,reel:undefined}));
 assert.throws(()=>projectSchema.parse({...base,scenes:[{kind:'reel',duration:1}]}));
 assert.throws(()=>projectSchema.parse({...base,scenes:[{kind:'reel',duration:1,motion:{preset:'unknown'}}]}));
 assert.throws(()=>projectSchema.parse({...base,scenes:[{kind:'reel',duration:1,motion:{preset:'data-sculpt'}}]}));
 assert.throws(()=>projectSchema.parse({...base,scenes:[{kind:'reel',duration:1,motion:{preset:'code-scan'}}]}));
 assert.throws(()=>projectSchema.parse({...base,scenes:[{kind:'title',duration:1,motion:{preset:'waveform'}}]}));
 assert.equal(projectSchema.parse(base).scenes[0].motion?.preset,'fragment-merge');
});
test('all native treatments accept valid data while rejecting invalid seeds',()=>{
 for(const preset of motionPresets){
  const scene={kind:'reel',title:'TEST',duration:1,motion:{preset},code:'const frame = 1;',values:[1,3],labels:['A','B']};
  assert.doesNotThrow(()=>projectSchema.parse({...base,scenes:[scene]}));
  assert.throws(()=>projectSchema.parse({...base,scenes:[{...scene,motion:{preset,seed:-1}}]}));
 }
});
test('beat timing is independent of fps and has no cumulative shot drift',()=>{
 assert.equal(beatAt(45,30,160),4);assert.equal(beatAt(90,60,160),4);
 const p=projectSchema.parse({...base,scenes:Array.from({length:20},()=>base.scenes[0])});
 const report=reviewProject(p);
 assert.equal(report.durationSeconds,30);assert.equal(report.timeline.at(-1)?.endFrame,900);
 for(let i=1;i<report.timeline.length;i++)assert.equal(report.timeline[i].startFrame,report.timeline[i-1].endFrame);
});
test('key content and two-line caption boxes stay within every export safe area',()=>{
 for(const [width,height] of Object.values(dimensions))for(const preset of ['reels','clean'] as const){
  const {safe,content,caption,motif}=reelLayout(width,height,preset);
  for(const b of [content,caption,motif]){
   assert.ok(b.x>=safe.x-.001&&b.y>=safe.y-.001);
   assert.ok(b.x+b.width<=safe.x+safe.width+.001);
   assert.ok(b.y+b.height<=safe.y+safe.height+.001);
  }
  assert.ok(content.y+content.height<caption.y);
  if(height>width*1.25&&preset==='reels')assert.ok(caption.y+caption.height<=height*.65+.001);
 }
});
test('creative review finds slow, repetitive slide structure without calling it an engagement score',()=>{
 const p=projectSchema.parse({...base,scenes:Array.from({length:8},()=>({kind:'title',duration:3,title:'A title'}))});
 const report=reviewProject(p),codes=report.warnings.map(x=>x.code);
 for(const code of ['slow-opening','long-hold','repeated-treatment','low-variety','slide-heavy'])assert.ok(codes.includes(code));
 assert.equal(report.engagementPrediction,false);
 const varied=projectSchema.parse({...base,scenes:motionPresets.map(preset=>({kind:'reel',duration:1.5,title:'DO\nTHIS',motion:{preset},code:'const f = 0;',values:[1,3]}))});
 assert.equal(reviewProject(varied).warnings.length,0);
});
test('review does not invent footage duration before probing and editing',()=>{
 const p=projectSchema.parse({version:1,name:'footage',workflow:'footage-repurpose',footage:{src:'clip.mp4'}});
 assert.equal(reviewProject(p).durationSeconds,null);
});
test('seeded motion stays repeatable across concurrency and varies by seed',()=>{
 const a=Array.from({length:100},(_,i)=>seededUnit(7,i));
 assert.deepEqual(a,Array.from({length:100},(_,i)=>seededUnit(7,i)));
 assert.notDeepEqual(a,Array.from({length:100},(_,i)=>seededUnit(8,i)));
 assert.ok(a.every(v=>v>=0&&v<1));
});
test('preview refuses cloud assets before creating an output directory',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'vf-preview-'));
 try{
  const file=path.join(dir,'project.json'),out=path.join(dir,'out');
  await writeFile(file,JSON.stringify({...base,scenes:[{kind:'image',src:'generated:remote',duration:1}]}));
  await assert.rejects(()=>previewProject(file,out),/local media/);
  await assert.rejects(()=>access(out));
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('renderer snapshot includes portable motion and layout dependencies',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'vf-snapshot-'));
 try{await snapshotRenderer(dir);for(const name of ['composition.tsx','Reel.tsx','PopReel.tsx','Overlays.tsx','overlay-timing.ts','footage-layout.ts','schema.ts','reel-layout.ts'])await access(path.join(dir,name));}
 finally{await rm(dir,{recursive:true,force:true});}
});

test('subtitle phrases stop at sentence boundaries instead of joining adjacent shots',()=>{
 const words=['Meet','Video','Forge.','Start','with','one','brief.'].map(text=>({text}));
 assert.deepEqual(captionGroup(words,2,5),{start:0,end:3});
 assert.deepEqual(captionGroup(words,3,5),{start:3,end:7});
});
test('subtitle grouping respects character and word limits without stalling on long identifiers',()=>{
 const words=['averylongidentifierthatexceedstheline','then','more','words.'].map(text=>({text}));
 assert.deepEqual(captionGroup(words,0,3),{start:0,end:1});
 assert.deepEqual(captionGroup(words,1,2),{start:1,end:3});
 assert.deepEqual(captionGroup(words,3,2),{start:3,end:4});
 assert.deepEqual(captionGroup(words,-1,2),{start:0,end:0});
});


test('pop treatment is explicit and backwards compatible with minimal jobs',()=>{
 const old=projectSchema.parse(base);assert.equal(old.scenes[0].motion?.style,'minimal');assert.equal(old.reel?.captionStyle,'standard');
 const pop=projectSchema.parse({...base,reel:{...base.reel,captionStyle:'pop'},scenes:[{...base.scenes[0],motion:{preset:'fragment-merge',style:'pop',palette:['#5046ef','#ff8c32','#e5ff3d'],energy:3}}]});
 assert.equal(pop.scenes[0].motion?.style,'pop');assert.equal(pop.reel?.captionStyle,'pop');
 for(const motion of [{palette:['#fff','#000','#abc']},{palette:['#111111','#222222']},{energy:4},{style:'unknown'}])assert.throws(()=>projectSchema.parse({...base,scenes:[{...base.scenes[0],motion:{preset:'fragment-merge',...motion}}]}));
});
test('creative arcade example rounds cumulative beat boundaries to exactly 900 frames',async()=>{
 const {readFile}=await import('node:fs/promises');
 const p=projectSchema.parse(JSON.parse(await readFile(new URL('../examples/pop-showcase.json',import.meta.url),'utf8'))),report=reviewProject(p);
 assert.equal(report.timeline.length,22);assert.equal(report.timeline.at(-1)?.endFrame,900);assert.equal(report.durationSeconds,30);
 assert.equal(new Set(p.scenes.map(s=>s.motion?.preset)).size,12);
 assert.ok(p.scenes.every(s=>s.motion?.style==='pop'));assert.ok(new Set(p.scenes.map(s=>s.duration)).size>1);
});
