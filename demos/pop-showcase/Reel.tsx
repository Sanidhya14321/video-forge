import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import type {Project,Scene} from './schema';
import {beatAt,easeOut,reelLayout,seededUnit} from './reel-layout';

/** Original flat motion vocabulary. No remote assets, gradients, ambient RNG or CSS clocks. */
export function ReelScene({scene,project}:{scene:Scene;project:Project}) {
  const frame=useCurrentFrame(),{width,height,fps}=useVideoConfig();
  const motion=scene.motion!,bpm=project.reel?.bpm??160;
  const beat=beatAt(frame,fps,bpm),totalBeats=scene.duration*bpm/60;
  const intro=easeOut(beat/.72),outro=easeOut((beat-(totalBeats-.5))/.5);
  const bg=motion.invert?project.theme.foreground:project.theme.background;
  const fg=motion.invert?project.theme.background:project.theme.foreground;
  const dim=project.theme.muted;
  const layout=reelLayout(width,height,project.reel?.safeArea);
  const shape={...layout.motif,height:layout.motif.height*(scene.body?.8:1)};
  const seed=motion.seed,count=motion.density;
  const lines=scene.title.split('\n');
  const typeOnly=motion.preset==='type-impact';
  const abstractHero=['fragment-merge','orbit-lock','ribbon','waveform','radial-burst'].includes(motion.preset);
  const font=Math.min(layout.font*(typeOnly?1.65:abstractHero?1.12:1),layout.safe.width/Math.max(...lines.map(s=>s.length),1)/.59);
  const stroke={stroke:fg,strokeWidth:7,fill:'none'};
  const pulse=1+Math.max(0,1-(beat%1)*4)*.018;
  const transition=motion.entrance==='push'?`translateX(${(1-intro)*width}px)`:motion.entrance==='scale'?`scale(${.84+.16*intro})`:'none';
  let motif:React.ReactNode;
  switch(motion.preset){
    case 'fragment-merge':
      motif=<>{Array.from({length:count},(_,i)=>{
        const angle=i/count*Math.PI*2,side=52+seededUnit(seed,i)*45;
        const endX=500+Math.cos(angle)*160,endY=255+Math.sin(angle)*155;
        const spread=1-easeOut((beat-i*.045)/1.6);
        const x=endX+Math.cos(angle)*(250+seededUnit(seed,i+30)*180)*spread;
        const y=endY+Math.sin(angle)*240*spread;
        return <rect key={i} x={x-side/2} y={y-side/2} width={side} height={side} fill={i%3?fg:dim}
          transform={`rotate(${(1-spread)*i*12+spread*90} ${x} ${y})`}/>;
      })}<path d="M457 175 L592 255 L457 335 Z" fill={bg} opacity={easeOut((beat-1.3)/.7)}/></>;
      break;
    case 'orbit-lock':
      motif=<><ellipse cx="500" cy="255" rx="285" ry="160" {...stroke} stroke={dim} strokeWidth="2"/>
        <ellipse cx="500" cy="255" rx="170" ry="245" {...stroke} stroke={dim} strokeWidth="2" transform="rotate(35 500 255)"/>
        {Array.from({length:count},(_,i)=>{const t=i/count*Math.PI*2+(1-easeOut(beat/2))*2.5;return <circle key={i} cx={500+Math.cos(t)*250} cy={255+Math.sin(t)*160} r={18+seededUnit(seed,i)*15} fill={i%3===0?dim:fg}/>})}
        <rect x={415} y={170} width="170" height="170" rx="85" fill={fg}/><path d="M480 208 L552 255 L480 302 Z" fill={bg}/></>;
      break;
    case 'signal-flow':
      motif=<>{Array.from({length:5},(_,i)=>{
        const y=70+i*92,path=`M60 ${y} C260 ${y}, 300 255, 500 255 S740 ${y}, 940 ${y}`;
        const travel=(beat*.47+i*.15)%1;
        return <g key={i}><path d={path} stroke={dim} strokeWidth="2" fill="none"/>
          <path d={path} stroke={fg} strokeWidth="8" fill="none" pathLength="1" strokeDasharray="0.07 0.93" strokeDashoffset={-travel}/></g>;
      })}<circle cx="500" cy="255" r={65+intro*12} fill={fg}/><circle cx="500" cy="255" r="20" fill={bg}/></>;
      break;
    case 'ribbon': {
      const points=Array.from({length:13},(_,i)=>{const x=i*80+20;const y=255+Math.sin(i*.62-beat*1.8)*(70+intro*65);return `${x},${y}`;});
      motif=<><polyline points={points.join(' ')} fill="none" stroke={fg} strokeWidth="58" strokeLinejoin="round" strokeLinecap="round"/>
        <polyline points={points.join(' ')} fill="none" stroke={bg} strokeWidth="5" strokeLinejoin="round"/>
        {[0,1,2].map(i=><circle key={i} cx={200+i*300} cy={255+Math.sin((200+i*300-20)/80*.62-beat*1.8)*(70+intro*65)} r="13" fill={bg}/>)}</>;
      break;
    }
    case 'frame-morph': {
      const t=easeOut((beat-.6)/1.65),w=730+(285-730)*t,h=290+(460-290)*t;
      motif=<><path d="M100 255 H900 M500 0 V510" stroke={dim} strokeWidth="1" strokeDasharray="6 14"/>
        <rect x={500-w/2} y={255-h/2} width={w} height={h} rx="20" {...stroke}/>
        <circle cx={500+(1-t)*140} cy="210" r="54" fill={fg}/><path d={`M${410+(1-t)*140} 390 V326 Q${500+(1-t)*140} 240 ${590+(1-t)*140} 326 V390 Z`} fill={dim}/>
        <path d={`M${500-w/2-20} ${255-h/2+50} V${255-h/2-20} H${500-w/2+50} M${500+w/2+20} ${255+h/2-50} V${255+h/2+20} H${500+w/2-50}`} {...stroke}/></>;
      break;
    }
    case 'timeline-cut': {
      const trim=easeOut((beat-.6)/1.5),gap=160*(1-trim);
      motif=<><path d="M40 170 H960 M40 345 H960" stroke={dim} strokeWidth="2"/>
        {[0,1,2].map(i=><g key={i} transform={`translate(${80+i*(235+gap)} 200)`}><rect width="220" height="115" fill={fg}/>
          {Array.from({length:12},(_,n)=><rect key={n} x={16+n*16} y={57-(10+seededUnit(seed,n+i*12)*60)/2} width="6" height={10+seededUnit(seed,n+i*12)*60} fill={bg}/>)}</g>)}
        <path d={`M${80+beat*145} 120 V385`} stroke={fg} strokeWidth="3"/><path d="M470 65 L500 105 L530 65" fill={fg}/>
        {trim<.95&&[0,1].map(i=><rect key={i} x={315+i*(235+gap)} y="200" width={Math.max(0,gap-15)} height="115" fill={dim} opacity={1-trim}/>)}</>;
      break;
    }
    case 'waveform':
      motif=<>{Array.from({length:count*5},(_,i)=>{const h=(22+Math.abs(Math.sin(i*.79-beat*2))*320)*easeOut((beat-i*.006)/.65);return <rect key={i} x={65+i*(870/(count*5))} y={255-h/2} width={Math.max(4,700/(count*5))} height={h} rx="4" fill={i%5?fg:dim}/>})}<path d="M40 255 H960" stroke={dim} strokeWidth="1"/></>;
      break;
    case 'code-scan': {
      const code=(scene.code??'').split('\n').slice(0,4);
      motif=<><path d="M80 90 H920 M80 430 H920" stroke={dim} strokeWidth="2"/>
        {code.map((line,i)=><g key={i} opacity={easeOut((beat-i*.27)/.45)} transform={`translate(${(1-easeOut((beat-i*.27)/.6))*100} 0)`}>
          <text x="90" y={170+i*74} fill={dim} fontSize="22" fontFamily="monospace">{i+1}</text>
          <text x="150" y={170+i*74} fill={fg} fontSize={Math.min(43,700/Math.max(line.length,1)/.61)} fontFamily="monospace">{line}</text></g>)}
        <rect x="135" y={125+Math.min(code.length-1,Math.floor(beat))*74} width="745" height="60" fill="none" stroke={fg} strokeWidth="2"/>
      </>;
      break;
    }
    case 'data-sculpt': {
      const values=scene.values??[1],max=Math.max(...values,1),step=800/values.length;
      motif=<><path d="M80 430 H940" stroke={dim} strokeWidth="2"/>{values.map((v,i)=>{const h=v/max*330*easeOut((beat-i*.13)/1);return <g key={i}>
        <rect x={110+i*step} y={430-h} width={step*.65} height={h} fill={scene.highlight?.includes(i)?dim:fg}/>
        <text x={110+i*step+step*.325} y={410-h} fill={fg} textAnchor="middle" fontSize="33" fontFamily="monospace">{v}</text>
        {scene.labels?.[i]&&<text x={110+i*step+step*.325} y="480" fill={dim} textAnchor="middle" fontSize="22">{scene.labels[i]}</text>}
      </g>})}</>;
      break;
    }
    case 'word-pulse': {
      const words=scene.labels??['VOICE','MUSIC','WORDS'];
      motif=<>{words.map((word,i)=>{const t=easeOut((beat-i*.32)/.6),active=Math.floor(beat*1.3)%words.length===i;
        return <g key={i} transform={`translate(500 ${110+i*145+(1-t)*80}) scale(${active?1.07:1})`} opacity={t}>
          <text x="0" y="0" textAnchor="middle" fill={active?fg:dim} fontSize={Math.min(100,800/word.length/.62)} fontWeight="800">{word}</text>
          {active&&<path d="M-250 22 H250" stroke={fg} strokeWidth="6"/>}</g>})}</>;
      break;
    }
    case 'radial-burst':
      motif=<>{Array.from({length:count*2},(_,i)=>{
        const angle=i/(count*2)*Math.PI*2+beat*.12,r=120+intro*20,length=95+Math.sin(beat*2+i)*28;
        return <path key={i} d={`M${500+Math.cos(angle)*r} ${255+Math.sin(angle)*r} L${500+Math.cos(angle)*(r+length)} ${255+Math.sin(angle)*(r+length)}`} stroke={i%3?fg:dim} strokeWidth={i%2?13:5}/>;
      })}<circle cx="500" cy="255" r="84" fill={fg}/><path d="M475 210 L545 255 L475 300 Z" fill={bg}/></>;
      break;
    default:
      motif=<><circle cx="500" cy="255" r={190+beat*15} {...stroke} strokeWidth="2"/><path d="M140 255 H860" stroke={dim} strokeWidth="2"/></>;
  }
  const titleY=typeOnly?layout.content.y+layout.content.height*.14:layout.content.y+10;
  return <AbsoluteFill style={{background:bg,color:fg,overflow:'hidden',fontFamily:project.theme.font}}>
    {/* Decorative full-bleed mechanics can leave the safe area; key copy cannot. */}
    <div style={{position:'absolute',inset:0,transform:transition}}>
      {abstractHero&&<svg aria-hidden="true" style={{position:'absolute',left:-width*.5,top:height*.53,width:width*2,height:height*.65,opacity:.13,transform:`rotate(${-12+beat*2}deg)`}} viewBox="0 0 1000 540">{motif}</svg>}
      {typeOnly&&<svg style={{position:'absolute',left:-width*.15,top:height*.29,width:width*1.3,height:height*.42}} viewBox="0 0 1000 600">
        <circle cx="500" cy="300" r={210+beat*27} stroke={dim} strokeWidth="2" fill="none"/>
        <path d="M0 300 H1000" stroke={dim} strokeWidth="1"/>
      </svg>}
      <div style={{position:'absolute',left:layout.content.x,top:titleY,width:layout.content.width,zIndex:2,fontSize:font,fontWeight:800,lineHeight:1.01,letterSpacing:-font*.055,textAlign:abstractHero?'center':'left'}}>
        {lines.map((line,i)=>{const t=easeOut((beat+(typeOnly?.35:0)-i*.17)/.65);return <div key={i} style={{overflow:'hidden',height:font*1.12}}>
          <div style={{transform:`translateY(${(1-t)*font*1.15}px) rotate(${(1-t)*(i%2?-5:5)}deg)`,transformOrigin:'left center'}}>{line}</div></div>})}
      </div>
      {!typeOnly&&<svg style={{position:'absolute',left:shape.x,top:shape.y,width:shape.width,height:shape.height,overflow:'visible',transform:`scale(${pulse})`}} viewBox="0 0 1000 540">{motif}</svg>}
      {scene.body&&<div style={{position:'absolute',left:layout.content.x,top:layout.content.y+layout.content.height*(typeOnly?.77:.92),width:layout.content.width,fontSize:Math.min(width*.033,layout.content.height*.042),fontWeight:600,letterSpacing:0,opacity:easeOut((beat-.7)/.6),fontFamily:scene.body.startsWith('$')||scene.body.startsWith('/')?'monospace':project.theme.font}}>{scene.body}</div>}
      {/* A moving registration mark provides continuity without a persistent slide frame. */}
      <svg style={{position:'absolute',left:layout.safe.x,top:height*.105,width:layout.safe.width,height:20}} viewBox="0 0 1000 20">
        <path d="M0 10 H1000" stroke={dim} strokeWidth="1"/><path d={`M${Math.min(970,beat/Math.max(1,totalBeats)*970)} 0 V20`} stroke={fg} strokeWidth="7"/>
      </svg>
    </div>
  </AbsoluteFill>;
}
