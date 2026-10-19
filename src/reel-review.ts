import {dimensions, type Project} from './schema.js';
import {reelLayout} from './reel-layout.js';
export function reviewProject(project: Project) {
  let frame=0;
  const timeline=project.scenes.map((scene,index)=>{
    const start=frame;frame+=Math.round(scene.duration*project.fps);
    return {index:index+1,startFrame:start,endFrame:frame,seconds:(frame-start)/project.fps,
      treatment:scene.motion?.preset??scene.kind,style:scene.motion?.style??"standard",title:scene.title,
      previewFrames:[Math.min(frame-1,start+Math.max(1,Math.round(project.fps*.18))),Math.min(frame-1,start+Math.round((frame-start)*.70)),frame-1]};
  });
  const warnings:{code:string;scene?:number;message:string}[]=[];
  const reel=Boolean(project.reel);
  if(reel){
    if(timeline[0]?.seconds>2)warnings.push({code:'slow-opening',scene:1,message:'The first shot exceeds 2s. Show the hook/payoff sooner, or keep a deliberate evidence hold.'});
    for(let i=0;i<project.scenes.length;i++){
      const s=project.scenes[i];
      if(s.duration>2.5)warnings.push({code:'long-hold',scene:i+1,message:'Shot exceeds the fast-reel starting range; check that the hold earns its time.'});
      if(i>=2&&timeline[i].treatment===timeline[i-1].treatment&&timeline[i].treatment===timeline[i-2].treatment)
        warnings.push({code:'repeated-treatment',scene:i+1,message:'Three adjacent shots share one treatment. Change visual grammar or demonstrate a purposeful continuous action.'});
      if(s.title.replace(/\s/g,'').length>28||s.title.split('\n').length>2)
        warnings.push({code:'dense-headline',scene:i+1,message:'Headline may crowd the phone layout. Shorten it or author a custom composition.'});
      if((s.motion?.preset==='code-scan'||s.kind==='code')&&(s.code?.length??0)>90&&s.duration<2.5)
        warnings.push({code:'unreadable-code',scene:i+1,message:'Long code cannot be read at this pace. Isolate a meaningful line or extend this evidence shot.'});
    }
    const families=new Set(timeline.map(s=>s.treatment));
    if(timeline.length>=6&&families.size<4)warnings.push({code:'low-variety',message:'Fewer than four treatments across a reel. Reconsider a sequence of similar panels.'});
    const titleCount=project.scenes.filter(s=>s.kind==='title'||s.motion?.preset==='type-impact').length;
    if(project.scenes.length>=6&&titleCount/project.scenes.length>.5)warnings.push({code:'slide-heavy',message:'Most shots are title treatments. Replace explanatory labels with objects that perform the idea, unless this is intentionally a type-led film.'});
  }
  for(const [i,o] of project.overlays.entries())if(o.kind==="browser"&&o.end-o.start<.8)warnings.push({code:"short-evidence-hold",message:`Overlay ${i+1}: screenshot is visible for less than 0.8s; allow a readable evidence hold.`});
  return {version:1,editorialHeuristics:true,engagementPrediction:false,reel,
    durationSeconds:project.footage?null:frame/project.fps,shots:timeline.length,
    averageShotSeconds:timeline.length?frame/project.fps/timeline.length:0,
    uniqueTreatments:new Set(timeline.map(s=>s.treatment)).size,
    overlayCount:project.overlays.length,overlayKinds:[...new Set(project.overlays.map(o=>o.kind))],overlayTimeline:project.overlays.map(o=>({kind:o.kind,start:o.start,end:o.end,title:o.title,src:o.src})),
    timeline,warnings,
    layouts:project.exports.map(target=>{const [w,h]=target.width?[target.width,target.height!]:dimensions[target.preset];return {preset:target.preset,width:w,height:h,...reelLayout(w,h,project.reel?.safeArea)};}),
    limits:'Timing and layout heuristics do not establish taste, factual accuracy, caption recognition accuracy, retention, or current platform UI coverage.'};
}
