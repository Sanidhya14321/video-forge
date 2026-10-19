import {test} from 'node:test';import assert from 'node:assert/strict';
import {overlayTiming,screenshotRect} from '../src/overlay-timing.js';
import {projectSchema,overlaySchema} from '../src/schema.js';
test('overlay timing is frame-derived, end-exclusive and stable under out-of-order rendering',()=>{
 assert.equal(overlayTiming(29,30,1,2).visible,false);assert.equal(overlayTiming(30,30,1,2).visible,true);assert.equal(overlayTiming(60,30,1,2).visible,false);
 assert.equal(overlayTiming(59,30,1,2,true).opacity,1);
 assert.equal(overlayTiming(60,30,1,2,true).visible,false);
 assert.deepEqual(overlayTiming(45,30,1,2),overlayTiming(90,60,1,2));
 const reverse=[59,35,45].map(f=>overlayTiming(f,30,1,2));assert.deepEqual(reverse[2],overlayTiming(45,30,1,2));
});
test('cursor and screenshot share fitted geometry in contain and cropped focus modes',()=>{
 const r=screenshotRect(800,500,2,'contain');assert.deepEqual(r,{x:0,y:50,width:800,height:400});
 const c=screenshotRect(800,500,2,'cover',{x:1,y:0,scale:1});assert.deepEqual(c,{x:-200,y:0,width:1000,height:500});
 assert.equal(r.x+r.width*.5,400);assert.equal(r.y+r.height*.5,250);
});
test('overlay contracts reject absent evidence, invalid pointer locations and impossible time windows',()=>{
 for(const o of [{kind:'browser',start:0,end:1},{kind:'brand',start:0,end:1},{kind:'steps',start:0,end:1},{kind:'label',start:2,end:1},{kind:'browser',src:'x.png',start:0,end:1,cursor:{x:2,y:.5}},{kind:'browser',src:'x.png',start:0,end:1,cursor:{x:.5,y:.5,clickAt:2}}])assert.equal(overlaySchema.safeParse(o).success,false);
 assert.equal(overlaySchema.parse({kind:'browser',src:'x.png',start:0,end:2,cursor:{x:.5,y:.5,clickAt:1}}).fit,'contain');
 const p=projectSchema.parse({version:1,name:'old',workflow:'product-demo',scenes:[{kind:'title',duration:1,title:'old'}]});assert.deepEqual(p.overlays,[]);
});
