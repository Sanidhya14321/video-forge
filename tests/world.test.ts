import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,rm,access} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';
import {worldSchema,cameraAt,objectAt} from '../src/world.js';
import {projectSchema} from '../src/schema.js';
import {inspectGlb} from '../src/assets3d.js';
import {preflight,previewProject} from '../src/runner.js';
import {scoutVideo} from '../src/scout.js';
import {shotIdeas} from '../src/ideas.js';
import {binary,exec} from '../src/media.js';
const make=()=>worldSchema.parse({camera:{keys:[{at:0,position:[0,0,6],target:[0,0,0]},{at:1,position:[1,0,5],target:[0,0,0]},{at:2,position:[2,0,4],target:[0,0,0]}]},objects:[{id:'hero',shape:'box',position:[0,0,0]}]});
test('3D camera samples are time-derived, clamp endpoints and preserve intermediate velocity',()=>{
 const w=make();assert.deepEqual(cameraAt(-1,w.camera).position,[0,0,6]);assert.deepEqual(cameraAt(3,w.camera).position,[2,0,4]);
 assert.deepEqual(cameraAt(30/30,w.camera),cameraAt(60/60,w.camera));
 const randomOrder=[1.8,.2,1,0].map(t=>cameraAt(t,w.camera));assert.deepEqual(randomOrder[2],cameraAt(1,w.camera));
 const left=(cameraAt(1,w.camera).position[0]-cameraAt(.999,w.camera).position[0])/.001;
 const right=(cameraAt(1.001,w.camera).position[0]-cameraAt(1,w.camera).position[0])/.001;
 assert.ok(left>.9&&Math.abs(left-right)<.01);
});
test('world contracts reject ambiguous paths, missing assets and out-of-scene animation',()=>{
 const valid=make();assert.equal(projectSchema.parse({version:1,name:'world',workflow:'product-demo',scenes:[{kind:'world',duration:2,world:valid}]}).scenes[0].world?.objects.length,1);
 for(const world of [{...valid,camera:{keys:[valid.camera.keys[1],valid.camera.keys[0]]}},{...valid,objects:[valid.objects[0],valid.objects[0]]},{...valid,objects:[{id:'image',shape:'image',position:[0,0,0]}]},{...valid,camera:{keys:[{at:0,position:[0,0,0],target:[0,0,0]},valid.camera.keys[1]]}}])assert.equal(worldSchema.safeParse(world).success,false);
 assert.throws(()=>projectSchema.parse({version:1,name:'over',workflow:'product-demo',scenes:[{kind:'world',duration:1,world:valid}]}));
 assert.throws(()=>projectSchema.parse({version:1,name:'wrong-kind',workflow:'product-demo',scenes:[{kind:'title',duration:2,world:valid}]}));
 const o=worldSchema.parse({...valid,objects:[{...valid.objects[0],keys:[{at:0,position:[0,0,0]},{at:2,position:[0,2,0]}]}]}).objects[0];
 assert.deepEqual(objectAt(0,o).position,[0,0,0]);assert.deepEqual(objectAt(2,o).position,[0,2,0]);assert.ok(objectAt(1,o).position[1]>0);
});
test('self-contained GLB check accepts the bundled original prop and rejects external or compressed dependencies',async()=>{
 const meta=await inspectGlb(new URL('../examples/assets/speaker-prop.glb',import.meta.url).pathname);assert.ok(meta.meshes>=3);
 const dir=await mkdtemp(path.join(os.tmpdir(),'vf-glb-'));try{
  for(const content of [{buffers:[{uri:'https://example.com/secret.bin'}]},{images:[{uri:'texture.png'}]},{extensionsUsed:['KHR_draco_mesh_compression']}]){
   let json=Buffer.from(JSON.stringify(content));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);const b=Buffer.alloc(20+json.length);b.writeUInt32LE(0x46546c67,0);b.writeUInt32LE(2,4);b.writeUInt32LE(b.length,8);b.writeUInt32LE(json.length,12);b.writeUInt32LE(0x4e4f534a,16);json.copy(b,20);const f=path.join(dir,'bad.glb');await writeFile(f,b);await assert.rejects(()=>inspectGlb(f),/external resources|compression decoder/);
  }
  const f=path.join(dir,'truncated.glb');await writeFile(f,Buffer.from('glTF'));await assert.rejects(()=>inspectGlb(f),/Invalid GLB/);
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('world assets are checked before a render or preview can create outputs',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'vf-world-assets-'));try{
  const world=make();world.objects[0]={...world.objects[0],shape:'image',src:'missing.png'};
  const p=projectSchema.parse({version:1,name:'missing',workflow:'product-demo',scenes:[{kind:'world',duration:2,world}]});await assert.rejects(()=>preflight(p,dir),/Cannot read asset/);
  world.objects[0].src='https://example.com/unfetched.png';const job=path.join(dir,'job.json');await writeFile(job,JSON.stringify({...p,scenes:[{kind:'world',duration:2,world}]}));await assert.rejects(()=>previewProject(job,path.join(dir,'preview')),/local media/);await assert.rejects(()=>access(path.join(dir,'preview')));
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('source scout extracts a bounded source-timed contact sheet from real video and preserves its input',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'vf-scout-'));try{
  const file=path.join(dir,'source.mp4');await exec(binary('ffmpeg'),['-v','error','-f','lavfi','-i','testsrc2=size=320x240:rate=24:duration=1','-c:v','libx264','-pix_fmt','yuv420p',file]);
  const before=await readFile(file);const result=await scoutVideo(file,path.join(dir,'scout'));assert.equal(result.frames,12);assert.deepEqual(await readFile(file),before);
  const report=JSON.parse(await readFile(path.join(dir,'scout/scout.json'),'utf8'));assert.equal(report.frames[0].sourceSeconds,0);assert.ok(report.frames.at(-1).sourceSeconds<1);for(const f of report.frames)await access(path.join(dir,'scout',f.file));
  await assert.rejects(()=>scoutVideo('https://example.com/private.mp4',path.join(dir,'remote')),/local video/);await assert.rejects(()=>access(path.join(dir,'remote')));
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('individual shot recipes remain attributable and load without the full reference collection',async()=>{
 const index=await shotIdeas('list');assert.equal(index.recipes.length,12);const recipe=await shotIdeas('occlusion-traversal');assert.equal(recipe.id,'occlusion-traversal');assert.ok(recipe.camera&&recipe.assets.length&&recipe.sourceIds.length);assert.equal(recipe.recipes,undefined);await assert.rejects(()=>shotIdeas('invented'),/Unknown shot recipe/);
 const register=JSON.parse(await readFile(new URL('../sources/creative-research-2026-10-20.json',import.meta.url),'utf8'));const ids=new Set(register.repositories.map((r:any)=>r.id));
 for(const x of index.recipes){const r=await shotIdeas(x.id);for(const id of r.sourceIds)assert.ok(ids.has(id),id);}
});
