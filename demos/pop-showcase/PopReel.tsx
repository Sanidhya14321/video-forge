import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import type {Project,Scene} from './schema';
import {beatAt,easeOut,reelLayout,seededUnit} from './reel-layout';

const INK='#171322',CREAM='#fff7e5';
function star(cx:number,cy:number,r:number,n=12,inner=.66){return Array.from({length:n*2},(_,i)=>{const a=i/n*Math.PI-Math.PI/2,d=i%2?r*inner:r;return `${cx+Math.cos(a)*d},${cy+Math.sin(a)*d}`;}).join(' ');}
function PlayPal({x=500,y=300,scale=1,beat=0,color='#e5ff3d',flip=false}:{x?:number,y?:number,scale?:number,beat?:number,color?:string,flip?:boolean}){
  const wave=Math.sin(beat*3)*14,bob=Math.sin(beat*5)*6,blink=Math.floor(beat*15)%43<2;
  return <g transform={`translate(${x} ${y+bob}) scale(${flip?-scale:scale} ${scale})`} stroke={INK} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round">
    <path d={`M-65 5 Q-123 ${-30-wave} -145 ${-65-wave} M65 10 Q125 ${20+wave} 145 ${-25+wave}`} fill="none"/>
    <circle cx="-147" cy={-66-wave} r="18" fill={CREAM}/><circle cx="147" cy={-25+wave} r="18" fill={CREAM}/>
    <path d={`M-35 77 L${-45+wave*.3} 130 M35 77 L${45-wave*.3} 130`} fill="none"/>
    <ellipse cx={-59+wave*.3} cy="134" rx="30" ry="15" fill={CREAM}/><ellipse cx={61-wave*.3} cy="134" rx="30" ry="15" fill={CREAM}/>
    <rect x="-87" y="-95" width="174" height="184" rx="34" fill={color}/>
    <path d="M-30 -59 L58 -7 L-30 43 Z" fill={CREAM} strokeWidth="6"/>
    <ellipse cx="-29" cy="-24" rx="7" ry={blink?2:12} fill={INK} stroke="none"/><ellipse cx="26" cy="-24" rx="7" ry={blink?2:12} fill={INK} stroke="none"/>
    <path d="M-24 48 Q2 73 30 43" fill="none" strokeWidth="6"/>
  </g>;
}
function Badge({x,y,text,fill,rotate=0}:{x:number,y:number,text:string,fill:string,rotate?:number}){return <g transform={`translate(${x} ${y}) rotate(${rotate})`}><rect x="-126" y="-31" width="252" height="72" rx="8" fill={INK}/><rect x="-134" y="-39" width="252" height="72" rx="8" fill={fill} stroke={INK} strokeWidth="6"/><text x="-8" y="10" textAnchor="middle" fontSize="35" fontWeight="900" fill={INK}>{text}</text></g>;}

/** A reusable high-energy, flat-color treatment of the native reel vocabulary. */
export function PopReelScene({scene,project}:{scene:Scene;project:Project}){
 const f=useCurrentFrame(),{fps,width,height}=useVideoConfig(),m=scene.motion!;
 const beat=beatAt(f,fps,project.reel?.bpm??160),p=easeOut((beat+.13)/.72),seed=m.seed;
 const colors=m.palette??[project.theme.background,project.theme.accent,'#e5ff3d','#ff558e','#ff8c32'];
 const bg=m.invert?CREAM:colors[0],a=colors[1],b=colors[2],c=colors[3%colors.length],d=colors[4%colors.length];
 const col=(i:number)=>colors[1+(i%(colors.length-1))];
 const safe=reelLayout(width,height,project.reel?.safeArea),box=safe.content;
 const flipped=['orbit-lock','frame-morph'].includes(m.preset),poster=m.preset==='type-impact';
 const words=m.preset==='word-pulse';
 const view={x:safe.safe.x,y:flipped?box.y+5:poster?box.y+box.height*.16:words?box.y+box.height*.5:box.y+box.height*.37,width:safe.safe.width,height:flipped?box.height*.52:poster?box.height*.86:words?box.height*.53:box.height*.66};
 const titleTop=flipped?box.y+box.height*.58:poster?box.y+box.height*.16:box.y+5;
 const lines=scene.title.split('\n'),longest=Math.max(...lines.map(x=>x.length),1);
 const typeSize=Math.min(flipped?140:poster?195:175,940/longest/.64);
 const alignment=['ribbon','code-scan','data-sculpt'].includes(m.preset)?'start':'middle';
 const typeX=alignment==='start'?28:500;
 const bump=Math.sin(f*2.1)*Math.max(0,1-f/8)*m.energy*1.7;
 const squish=1+Math.sin(beat*9)*Math.exp(-beat*4)*.085*m.energy/2;
 const move=m.entrance==='push'?`translateX(${(1-p)*width}px)`:m.entrance==='scale'?`scale(${.72+.28*p})`:'none';
 const id=`pop-${seed}-${m.preset}`;
 let art:React.ReactNode;
 switch(m.preset){
 case 'type-impact':art=<>
  <polygon points={star(500,270,325,11,.64)} fill={b} stroke={INK} strokeWidth="9" transform={`rotate(${-8+beat*3} 500 270)`}/>
  {[0,1,2].map(i=><path key={i} d={`M${90+i*85} ${380+i*20} L${190+i*85} ${330+i*20}`} stroke={INK} strokeWidth="12"/>)}
  <PlayPal x={815} y={400} scale={.83} beat={beat} color={a}/><Badge x={206} y={440} text="LET'S GO!" fill={c} rotate={-13}/>
 </>;break;
 case 'fragment-merge':{
  const t=easeOut((beat-.05)/1.6);
  art=<>{Array.from({length:m.density+4},(_,i)=>{const angle=i/(m.density+4)*Math.PI*2,x=500+Math.cos(angle)*(390*(1-t)+150),y=290+Math.sin(angle)*(260*(1-t)+95),size=55+seededUnit(seed,i)*30;return <rect key={i} x={x-size/2} y={y-size/2} width={size} height={size} rx={i%2?0:14} fill={col(i)} stroke={INK} strokeWidth="6" transform={`rotate(${i*19+(1-t)*170} ${x} ${y})`}/>})}
   <g transform={`translate(500 300) rotate(${-8+(1-t)*24}) scale(${.4+.6*t})`}>
    <rect x="-245" y="-110" width="490" height="290" rx="22" fill={a} stroke={INK} strokeWidth="10"/>
    <g transform={`translate(-245 -110) rotate(${-24*(1-easeOut((beat-.9)/.8))})`}><rect width="490" height="70" rx="7" fill={CREAM} stroke={INK} strokeWidth="10"/>{Array.from({length:7},(_,i)=><path key={i} d={`M${i*75} 0 L${i*75+55} 70`} stroke={INK} strokeWidth="31"/>)}</g>
    <path d="M-60 -35 L85 45 L-60 125 Z" fill={CREAM} stroke={INK} strokeWidth="8"/>
    <path d="M-205 145 H205" stroke={INK} strokeWidth="7"/>
   </g><Badge x={780} y={452} text="ASSEMBLED" fill={b} rotate={12}/>
  </>;break;}
 case 'orbit-lock':{
  const turn=(1-easeOut(beat/2))*100;
  art=<><g transform={`rotate(${turn} 500 270)`}>
    {Array.from({length:12},(_,i)=><g key={i} transform={`rotate(${i*30} 500 270)`}><rect x="471" y="12" width="58" height="105" rx="16" fill={col(i)} stroke={INK} strokeWidth="7"/></g>)}
    <circle cx="500" cy="270" r="197" fill={a} stroke={INK} strokeWidth="9"/>
    <circle cx="500" cy="270" r="154" fill={CREAM} stroke={INK} strokeWidth="6" strokeDasharray="12 10"/>
   </g><PlayPal x={500} y={270} scale={1.12} beat={beat} color={b}/>
   {[0,1,2].map(i=>{const angle=beat*.6+i*2.1;return <g key={i} transform={`translate(${500+Math.cos(angle)*340} ${270+Math.sin(angle)*205}) rotate(${i*25})`}><path d="M-32 -32 L32 0 L-32 32 Z" fill={col(i+1)} stroke={INK} strokeWidth="6"/></g>})}
   <Badge x={745} y={465} text="CONNECTED" fill={c} rotate={-9}/>
  </>;break;}
 case 'signal-flow':art=<>
   {[0,1,2,3].map(i=>{const y=75+i*140,path=`M35 ${y} C260 ${y}, 300 280, 485 280 S730 ${y}, 970 ${y}`;return <g key={i}>
    <path d={path} fill="none" stroke={INK} strokeWidth="27"/><path d={path} fill="none" stroke={col(i)} strokeWidth="16"/>
    <path d={path} fill="none" stroke={CREAM} strokeWidth="14" strokeDasharray=".045 .955" pathLength="1" strokeDashoffset={-(beat*.55+i*.19)%1}/>
   </g>})}<g transform={`translate(500 280) rotate(${Math.sin(beat*4)*3})`}><rect x="-119" y="-120" width="238" height="245" rx="35" fill={b} stroke={INK} strokeWidth="10"/><path d="M-45 -65 L76 5 L-45 75 Z" fill={a} stroke={INK} strokeWidth="8"/></g>
   <Badge x={235} y={480} text="BRIEF → FILM" fill={c} rotate={-6}/>
  </>;break;
 case 'ribbon':{
  const path=`M-70 400 C160 ${110+Math.sin(beat*2)*110},280 510,450 290 S750 ${60+Math.cos(beat*2)*100},1080 250`;
  art=<><path d={path} stroke={INK} strokeWidth="120" fill="none" strokeLinecap="round"/><path d={path} stroke={a} strokeWidth="98" fill="none" strokeLinecap="round"/><path d={path} stroke={CREAM} strokeWidth="19" strokeDasharray="30 25" strokeDashoffset={-f*5} fill="none"/>
    <g transform={`translate(${470+Math.sin(beat)*150} ${230+Math.sin(beat*2)*35}) rotate(${Math.sin(beat*2)*9})`}><PlayPal x={0} y={0} scale={.95} beat={beat} color={b}/><path d="M-125 165 Q0 205 125 165" stroke={INK} strokeWidth="18" fill="none"/><circle cx="-70" cy="190" r="18" fill={c} stroke={INK} strokeWidth="7"/><circle cx="70" cy="190" r="18" fill={c} stroke={INK} strokeWidth="7"/></g>
   </>;break;}
 case 'frame-morph':{
  const t=easeOut((beat-.4)/1.8),w=760-420*t,h=275+225*t;
  art=<><g transform={`translate(500 290) rotate(${-12+14*t})`}>
    <rect x={-w/2+20} y={-h/2+22} width={w} height={h} rx="20" fill={INK}/>
    <rect x={-w/2} y={-h/2} width={w} height={h} rx="20" fill={a} stroke={INK} strokeWidth="10"/>
    <clipPath id={`${id}-crop`}><rect x={-w/2+12} y={-h/2+12} width={w-24} height={h-24} rx="10"/></clipPath>
    <g clipPath={`url(#${id}-crop)`}><path d="M-500 160 L500 -160 V500 H-500 Z" fill={b}/><PlayPal x={90*(1-t)} y={-10} scale={1.13} beat={beat} color={c}/></g>
    <path d={`M${-w/2-28} ${-h/2+56} V${-h/2-28} H${-w/2+56} M${w/2+28} ${h/2-56} V${h/2+28} H${w/2-56}`} fill="none" stroke={CREAM} strokeWidth="13"/>
   </g><Badge x={770} y={475} text={t>.7?'TALL!':'WIDE!'} fill={b} rotate={8}/>
   </>;break;}
 case 'timeline-cut':{
  const t=easeOut((beat-.7)/1.3),gap=160*(1-t);
  art=<><g transform={`translate(40 180) rotate(-5 450 100)`}>
    {[0,1,2].map(i=><g key={i} transform={`translate(${i*(245+gap)} 0)`}><rect width="225" height="205" rx="6" fill={col(i)} stroke={INK} strokeWidth="9"/>
      {[0,1,2,3,4].map(j=><g key={j}><rect x={12+j*42} y="10" width="23" height="13" fill={INK}/><rect x={12+j*42} y="180" width="23" height="13" fill={INK}/></g>)}<path d="M85 55 L155 101 L85 148 Z" fill={CREAM} stroke={INK} strokeWidth="5"/></g>)}
   </g><g transform={`translate(${510-150*t} ${140+Math.sin(beat*4)*20}) rotate(${-20+Math.sin(beat*5)*12})`} stroke={INK} strokeWidth="12" fill={CREAM}>
    <circle cx="-45" cy="-45" r="36" fill={a}/><circle cx="45" cy="-45" r="36" fill={b}/><path d="M-20 -20 L75 145 L0 70 L-75 145 L20 -20"/>
   </g><Badge x={735} y={475} text="SNIP!" fill={c} rotate={9}/>
  </>;break;}
 case 'waveform':art=<><g transform={`translate(500 300) rotate(${Math.sin(beat*3)*3})`}>
   <path d="M-180 -150 V-200 H180 V-150" stroke={INK} strokeWidth="15" fill="none"/>
   <rect x="-365" y="-150" width="730" height="335" rx="32" fill={a} stroke={INK} strokeWidth="11"/>
   {[-245,245].map((x,i)=><g key={i} transform={`translate(${x} 25) scale(${1+Math.max(0,1-(beat%1)*3)*.1})`}><circle r="100" fill={b} stroke={INK} strokeWidth="9"/><circle r="66" fill={CREAM} stroke={INK} strokeWidth="7"/><circle r="34" fill={c} stroke={INK} strokeWidth="7"/></g>)}
   <rect x="-125" y="-112" width="250" height="112" rx="9" fill={INK}/>
   {Array.from({length:14},(_,i)=>{const h=18+Math.abs(Math.sin(i*.9-beat*2.4))*64;return <rect key={i} x={-110+i*16} y={-18-h} width="10" height={h} fill={col(i)}/>})}
   <rect x="-115" y="43" width="230" height="87" fill={CREAM} stroke={INK} strokeWidth="7"/><path d="M-90 62 H90 M-90 85 H90 M-90 108 H90" stroke={INK} strokeWidth="6"/>
  </g>{[-1,1].map((side,i)=><g key={i} transform={`translate(${500+side*420} ${100+Math.sin(beat*3+i)*45}) rotate(${side*15})`}><path d="M0 0 V-80 L60 -95 V-15" fill="none" stroke={INK} strokeWidth="10"/><ellipse cx="-14" cy="3" rx="24" ry="17" fill={b} stroke={INK} strokeWidth="6"/><ellipse cx="46" cy="-12" rx="24" ry="17" fill={c} stroke={INK} strokeWidth="6"/></g>)}</>;break;
 case 'code-scan':{
  const code=(scene.code??'').split('\n').slice(0,3);
  art=<><g transform={`translate(500 290) rotate(${-5+Math.sin(beat*2)*2})`}>
   <path d="M-400 -170 H335 L400 -105 V195 H-400 Z" fill={a} stroke={INK} strokeWidth="11"/><path d="M335 -170 V-105 H400" fill={b} stroke={INK} strokeWidth="8"/>
   <rect x="-365" y="-105" width="705" height="220" rx="8" fill={CREAM} stroke={INK} strokeWidth="7"/>
   {code.map((line,i)=><g key={i} opacity={easeOut((beat-i*.25)/.4)}><text x="-337" y={-45+i*70} fill={INK} fontFamily="monospace" fontSize={Math.min(38,640/line.length/.62)} fontWeight="700">{line}</text></g>)}
   <rect x="-345" y={-83+Math.min(code.length-1,Math.floor(beat))*70} width="665" height="55" fill="none" stroke={c} strokeWidth="7"/>
   <path d="M-300 153 H180" stroke={INK} strokeWidth="13" strokeDasharray="22 13"/>
  </g><polygon points="75,10 30,135 95,115 55,235 190,70 115,90 150,10" fill={b} stroke={INK} strokeWidth="7"/><Badge x={790} y={475} text="RUN IT!" fill={c} rotate={8}/>
  </>;break;}
 case 'data-sculpt':{
  const values=scene.values??[1],max=Math.max(...values,1),step=820/values.length;
  art=<><path d="M65 480 H955" stroke={INK} strokeWidth="9"/>{values.map((v,i)=>{const t=easeOut((beat-i*.13)/1),h=v/max*320*t,x=100+i*step,w=step*.62;return <g key={i}>
   <path d={`M${x+w} ${480-h} l22 -22 v${h} l-22 22 Z`} fill={INK}/><path d={`M${x} ${480-h} l22 -22 h${w} l-22 22 Z`} fill={CREAM} stroke={INK} strokeWidth="5"/>
   <rect x={x} y={480-h} width={w} height={h} fill={col(i)} stroke={INK} strokeWidth="7"/>
   <g transform={`translate(${x+w/2} ${410-h-Math.abs(Math.sin(Math.min(1,beat/2)*Math.PI*2))*35*(1-t)})`}><circle r="41" fill={b} stroke={INK} strokeWidth="6"/><text textAnchor="middle" y="13" fontSize="38" fontWeight="900" fill={INK}>{v}</text></g>
   {scene.labels?.[i]&&<text x={x+w/2} y="540" fill={INK} textAnchor="middle" fontSize="30" fontWeight="900">{scene.labels[i]}</text>}
  </g>})}</>;break;}
 case 'word-pulse':{
  const words=scene.labels??['VOICE','MUSIC','WORDS'];
  art=<>{words.map((word,i)=>{const t=easeOut((beat-i*.28)/.6),active=Math.floor(beat*1.25)%words.length===i;return <g key={i} transform={`translate(${500+(1-t)*(i%2?350:-350)} ${100+i*175}) rotate(${i%2?5:-5}) scale(${active?1.07:1})`} opacity={t}>
   <rect x="-335" y="-82" width="680" height="126" rx="8" fill={INK}/><rect x="-345" y="-92" width="680" height="126" rx="8" fill={active?col(i):CREAM} stroke={INK} strokeWidth="7"/>
   <text y="2" x="-5" textAnchor="middle" fill={INK} fontSize={Math.min(108,600/word.length/.66)} fontWeight="1000">{word}</text>
  </g>})}</>;break;}
 case 'radial-burst':art=<><g transform={`translate(500 290) rotate(${beat*6})`}>
   <polygon points={star(0,0,290,17,.59)} fill={a} stroke={INK} strokeWidth="10"/><polygon points={star(0,0,218,11,.72)} fill={b} stroke={INK} strokeWidth="7"/>
  </g><PlayPal x={500} y={275} scale={1.33} beat={beat} color={c}/>
  {Array.from({length:8},(_,i)=>{const ang=i/8*Math.PI*2;return <path key={i} d={`M${500+Math.cos(ang)*340} ${290+Math.sin(ang)*240} l${Math.cos(ang)*70} ${Math.sin(ang)*70}`} stroke={INK} strokeWidth="13"/>})}
  <Badge x={765} y={480} text="BOOM!" fill={d} rotate={9}/></>;break;
 }
 return <AbsoluteFill style={{background:bg,color:INK,fontFamily:project.theme.font,overflow:'hidden'}}>
  <svg style={{position:'absolute',inset:0,width,height}} viewBox="0 0 1080 1920" preserveAspectRatio="none">
   <defs><pattern id={`${id}-dots`} width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="4" fill={INK}/></pattern><pattern id={`${id}-check`} width="80" height="80" patternUnits="userSpaceOnUse" patternTransform={`translate(${-f*5} 0)`}><rect width="80" height="80" fill={CREAM}/><path d="M0 0 H40 V40 H0 Z M40 40 H80 V80 H40 Z" fill={INK}/></pattern></defs>
   <path d={`M${700-f*2} -100 L1200 -100 V1920 H${100+f*2} Z`} fill={a} opacity=".22"/>
   <path d="M740 0 H1080 V1920 H150 Z" fill={`url(#${id}-dots)`} opacity=".22"/>
   <text x="-100" y="1740" fill="none" stroke={INK} strokeWidth="3" opacity=".2" fontSize="410" fontWeight="1000" transform={`rotate(-15 540 1450) translate(${-beat*25} 0)`}>MAKE IT MOVE</text>
   <g transform={`translate(-150 ${1410+Math.sin(beat)*35}) rotate(-16 540 0)`}><rect width="1500" height="115" fill={INK}/><rect y="10" width="1500" height="95" fill={`url(#${id}-check)`}/></g>
   {Array.from({length:16},(_,i)=>{const angle=i/16*Math.PI*2;return <path key={i} d={`M${540+Math.cos(angle)*700} ${820+Math.sin(angle)*1000} L${540+Math.cos(angle)*(850+beat*10)} ${820+Math.sin(angle)*(1180+beat*10)}`} stroke={INK} strokeWidth={i%2?8:4} opacity=".35"/>})}
  </svg>
  <div style={{position:'absolute',inset:0,transform:`${move} translate(${bump}px,${-bump*.65}px) scale(${squish},${2-squish})`,transformOrigin:'50% 40%'}}>
   <svg style={{position:'absolute',left:view.x,top:view.y,width:view.width,height:view.height,overflow:'visible'}} viewBox="0 0 1000 600">{art}</svg>
   <svg style={{position:'absolute',left:safe.safe.x,top:titleTop,width:safe.safe.width,height:typeSize*lines.length*safe.safe.width/1000*1.22,overflow:'visible',zIndex:3}} viewBox={`0 0 1000 ${typeSize*lines.length*1.22}`}>
    {lines.map((line,i)=>{const t=easeOut((beat+.28-i*.13)/.65),x=typeX+(1-t)*(i%2?120:-120),y=typeSize*(i*1.13+.87),rot=(1-t)*(i%2?7:-7);return <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${1+Math.sin((beat-i*.13)*9)*Math.exp(-beat*4)*.04})`} fontSize={typeSize} fontWeight="1000" textAnchor={alignment} letterSpacing={-typeSize*.045}>
     <text x="10" y="12" fill={INK} stroke={INK} strokeWidth="19" paintOrder="stroke">{line}</text>
     {f<5&&<text x={i%2?-8:8} y="-3" fill={b} stroke={b} strokeWidth="17" paintOrder="stroke">{line}</text>}
     <text fill={i%2?b:CREAM} stroke={INK} strokeWidth="13" paintOrder="stroke">{line}</text>
    </g>})}
   </svg>
   {scene.body&&<div style={{position:'absolute',top:box.y+box.height*.95,left:box.x,width:box.width,textAlign:'center',zIndex:4,opacity:easeOut((beat-.6)/.5)}}><span style={{display:'inline-block',background:CREAM,color:INK,padding:'8px 15px',border:'3px solid '+INK,boxShadow:'5px 5px 0 '+INK,fontSize:Math.min(width*.029,box.height*.04),fontWeight:900,fontFamily:scene.body.startsWith('$')||scene.body.startsWith('/')?'monospace':project.theme.font,transform:'rotate(-2deg)'}}>{scene.body}</span></div>}
  </div>
  <svg style={{position:'absolute',inset:0,width,height,pointerEvents:'none'}} viewBox="0 0 1080 1920" preserveAspectRatio="none">
   {Array.from({length:Math.round(m.density*m.energy)},(_,i)=>{const r=seededUnit(seed,i),r2=seededUnit(seed,i+100),t=Math.max(0,beat-.05),x=540+Math.cos(i*2.4)*(120+t*260)*(r+.5),y=820+Math.sin(i*2.4)*(80+t*190)+t*t*95,opacity=Math.max(0,1-t/4.6),size=10+r2*18;return <g key={i} transform={`translate(${x} ${y}) rotate(${r*360+t*(r2-.5)*190})`} opacity={opacity}>
     {i%3===0?<polygon points={star(0,0,size,4,.35)} fill={col(i)} stroke={INK} strokeWidth="3"/>:<rect x={-size/2} y={-size/4} width={size} height={size*.55} rx={i%2?0:5} fill={col(i)} stroke={INK} strokeWidth="2"/>}
    </g>})}
  </svg>
 </AbsoluteFill>;
}
