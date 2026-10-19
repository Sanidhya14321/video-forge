import {test} from 'node:test';import assert from 'node:assert/strict';
import {footageScaleAt} from '../src/footage-layout.js';import {projectSchema} from '../src/schema.js';
test('punch-ins ease at edited-time boundaries and preserve ordinary framing outside windows',()=>{
 const p=[{start:1,end:2,scale:1.12},{start:3,end:3.12,scale:1.08}];
 for(const t of [0,1,2,2.5,4])assert.equal(footageScaleAt(t,p),1);
 assert.equal(footageScaleAt(1.5,p),1.12);assert.ok(footageScaleAt(1.09,p)>1&&footageScaleAt(1.09,p)<1.12);
 for(let t=0;t<5;t+=.01)assert.ok(footageScaleAt(t,p)>=1&&footageScaleAt(t,p)<=1.12);
 assert.equal(footageScaleAt(3.06,p),1.08);
});
test('footage layout remains compatible and rejects excessive crop amplification',()=>{
 const base={version:1,name:'portrait',workflow:'footage-repurpose',footage:{src:'source.mp4'}};
 assert.equal(projectSchema.parse(base).footage?.layout,'framed');
 assert.equal(projectSchema.parse({...base,footage:{src:'source.mp4',layout:'full-frame',punchIns:[{start:1,end:2,scale:1.1}]}}).footage?.layout,'full-frame');
 for(const p of [{start:2,end:1,scale:1.1},{start:0,end:1,scale:2}])assert.throws(()=>projectSchema.parse({...base,footage:{src:'source.mp4',punchIns:[p]}}));
});
