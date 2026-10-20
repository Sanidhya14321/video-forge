import {z} from 'zod';

export type Vec3 = [number, number, number];
const vector = z.tuple([z.number().finite().min(-1000).max(1000), z.number().finite().min(-1000).max(1000), z.number().finite().min(-1000).max(1000)]);
const positiveVector = z.tuple([z.number().min(.001).max(1000), z.number().min(.001).max(1000), z.number().min(.001).max(1000)]);
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const pose = {position: vector, rotation: vector.default([0,0,0]), scale: positiveVector.default([1,1,1])};
const transformKey = z.object({at:z.number().nonnegative(), ...pose}).strict();
export const cameraKeySchema = z.object({
  at:z.number().nonnegative(), position:vector, target:vector,
  fov:z.number().min(15).max(100).default(45), roll:z.number().min(-Math.PI).max(Math.PI).default(0),
}).strict().refine(k=>Math.hypot(...k.position.map((v,i)=>v-k.target[i]))>.05, 'Camera position must differ from its target');
const increasing = (keys:readonly {at:number}[]) => keys.every((k,i)=>i===0||k.at>keys[i-1].at);
export const worldSchema = z.object({
  camera:z.object({interpolation:z.enum(['linear','smooth']).default('smooth'), keys:z.array(cameraKeySchema).min(2).max(24)}).strict(),
  objects:z.array(z.object({
    id:z.string().regex(/^[a-z0-9-]+$/), shape:z.enum(['box','sphere','torus','cylinder','plane','image','model']),
    ...pose, size:positiveVector.default([1,1,1]), color:color.default('#f0e2c9'),
    roughness:z.number().min(0).max(1).default(.45), metalness:z.number().min(0).max(1).default(.1),
    src:z.string().min(1).optional(), keys:z.array(transformKey).max(24).default([]),
  }).strict().superRefine((o,ctx)=>{
    if(['image','model'].includes(o.shape)&&!o.src)ctx.addIssue({code:'custom',message:'Image/model requires a local src'});
    if(!['image','model'].includes(o.shape)&&o.src)ctx.addIssue({code:'custom',message:'src belongs to image/model assets'});
    if(o.shape==='model'&&(!o.src?.toLowerCase().endsWith('.glb')||/^https?:/i.test(o.src)))ctx.addIssue({code:'custom',message:'Models require a local, self-contained .glb file'});
    if(!increasing(o.keys))ctx.addIssue({code:'custom',message:'Object keys must have strictly increasing times'});
  })).min(1).max(96),
  ambient:z.number().min(0).max(5).default(.65),
  lights:z.array(z.object({position:vector,color:color.default('#ffffff'),intensity:z.number().min(0).max(20).default(2)}).strict()).max(8)
    .default([{position:[4,6,5],color:'#ffffff',intensity:2.5},{position:[-5,2,-3],color:'#99baff',intensity:1.5}]),
  copyPosition:z.enum(['top','bottom','none']).default('none'), copyAt:z.number().nonnegative().default(0),
}).strict().superRefine((w,ctx)=>{
  if(!increasing(w.camera.keys)||w.camera.keys[0].at!==0)ctx.addIssue({code:'custom',message:'Camera keys must start at zero and strictly increase'});
  if(new Set(w.objects.map(o=>o.id)).size!==w.objects.length)ctx.addIssue({code:'custom',message:'World object ids must be unique'});
});
export type World = z.infer<typeof worldSchema>;
export type CameraKey = z.infer<typeof cameraKeySchema>;

/** Time-weighted Hermite interpolation preserves velocity across intermediate keys.
 * Endpoints clamp; no previous-frame state or wall clock is involved. */
function sample(time:number, keys:readonly {at:number}[], values:readonly number[][], mode:'linear'|'smooth'):number[]{
  if(time<=keys[0].at)return [...values[0]];
  if(time>=keys.at(-1)!.at)return [...values.at(-1)!];
  const i=keys.findIndex((k,n)=>n<keys.length-1&&time>=k.at&&time<keys[n+1].at);
  const dt=keys[i+1].at-keys[i].at, t=(time-keys[i].at)/dt;
  return values[i].map((a,c)=>{
    const b=values[i+1][c];if(mode==='linear')return a+(b-a)*t;
    const prev=Math.max(0,i-1),next=Math.min(keys.length-1,i+2);
    const m0=i===0?0:(values[i+1][c]-values[prev][c])/(keys[i+1].at-keys[prev].at);
    const m1=i+1===keys.length-1?0:(values[next][c]-values[i][c])/(keys[next].at-keys[i].at);
    return (2*t**3-3*t*t+1)*a+(t**3-2*t*t+t)*dt*m0+(-2*t**3+3*t*t)*b+(t**3-t*t)*dt*m1;
  });
}
export function cameraAt(time:number, camera:World['camera']){
  const {keys,interpolation}=camera;
  const v=sample(time,keys,keys.map(k=>[...k.position,...k.target,k.fov,k.roll]),interpolation);
  return {position:v.slice(0,3) as Vec3,target:v.slice(3,6) as Vec3,fov:Math.max(15,Math.min(100,v[6])),roll:v[7]};
}
export function objectAt(time:number, object:World['objects'][number]){
  if(!object.keys.length)return {position:object.position,rotation:object.rotation,scale:object.scale};
  const v=sample(time,object.keys,object.keys.map(k=>[...k.position,...k.rotation,...k.scale]),'smooth');
  return {position:v.slice(0,3) as Vec3,rotation:v.slice(3,6) as Vec3,scale:v.slice(6,9).map(n=>Math.max(.001,n)) as Vec3};
}
