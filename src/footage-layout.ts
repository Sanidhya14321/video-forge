/** Deterministic editorial punch-ins on the final edited timeline, with eased edges. */
export function footageScaleAt(seconds:number,punchIns:ReadonlyArray<{start:number;end:number;scale:number}>):number {
 let scale=1;
 for(const p of punchIns){
  if(seconds<p.start||seconds>p.end)continue;
  const ramp=Math.min(.18,(p.end-p.start)/3);
  const phase=Math.max(0,Math.min(1,(seconds-p.start)/ramp,(p.end-seconds)/ramp));
  const eased=phase*phase*(3-2*phase);
  scale=Math.max(scale,1+(p.scale-1)*eased);
 }
 return scale;
}
