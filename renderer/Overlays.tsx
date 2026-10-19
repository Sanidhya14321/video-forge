import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import type {Project} from '../src/schema';
import {overlayTiming,screenshotRect} from '../src/overlay-timing';
import {reelLayout} from '../src/reel-layout';
type Overlay=Project['overlays'][number];
const PAPER='#f4f7fa',INK='#102f35';
function Pointer({x,y,local,clickAt,color}:{x:number;y:number;local:number;clickAt:number;color:string}){
 const p=Math.max(0,Math.min(1,local/.7)),travel=(1-p)**3,click=local-clickAt,ripple=Math.max(0,Math.min(1,click/.65));
 return <svg aria-hidden="true" style={{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible',pointerEvents:'none'}}>
  {click>=0&&click<.65&&<circle cx={x} cy={y} r={8+ripple*60} fill="none" stroke={color} strokeWidth={7*(1-ripple)} opacity={1-ripple}/>}
  <g transform={`translate(${x+travel*180} ${y+travel*140}) scale(${click>0&&click<.12?.82:1})`}><path d="M0 0 L0 48 L13 35 L26 60 L38 54 L25 30 L45 28 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round"/></g>
 </svg>;
}
function OverlayShot({o,project}:{o:Overlay;project:Project}){
 const f=useCurrentFrame(),{fps,width,height,durationInFrames}=useVideoConfig(),t=overlayTiming(f,fps,o.start,o.end,o.end>=durationInFrames/fps);
 if(!t.visible)return null;
 const accent=project.theme.accent,layout=reelLayout(width,height,project.reel?.safeArea),safe=layout.safe,content=layout.content;
 const full=o.layout==='full',light=o.kind==='browser'||o.kind==='brand',scale=width/1080;
 const x=safe.x,y=(o.layout==='top'?safe.y:o.layout==='lower-third'?content.y+content.height*.46:content.y)+o.offsetY*scale;
 const w=safe.width,h=o.layout==='top'?90*scale:o.layout==='lower-third'?content.height*.5:content.height;
 const color=light?INK:PAPER;
 const logo=o.logo?<Img src={staticFile(o.logo)} style={{width:Math.min(w*.65,530*scale),height:110*scale,objectFit:'contain'}}/>:null;
 const titleSize=Math.min(width*.075,w/Math.max(...o.title.split('\n').map(l=>l.length),1)*1.65);
 const title=<div style={{fontSize:titleSize,lineHeight:1.02,fontWeight:900,letterSpacing:'-.045em',whiteSpace:'pre-line',color,transform:`translateY(${(1-t.enter)*45*scale}px)`}}>{o.title}</div>;
 const eyebrow=o.eyebrow&&<div style={{fontSize:width*.023,fontWeight:800,letterSpacing:'.16em',color:accent,marginBottom:16*scale}}>{o.eyebrow}</div>;
 const body=o.body&&<div style={{fontSize:width*.031,color:light?'#49646b':'#b5d1d0',lineHeight:1.3,marginTop:18*scale}}>{o.body}</div>;
 return <AbsoluteFill style={{pointerEvents:'none',opacity:t.opacity,fontFamily:project.theme.font,zIndex:10}}>
  {full&&<AbsoluteFill style={{background:light?PAPER:project.theme.background,clipPath:`inset(0 ${(1-t.enter)*100}% 0 0)`}}>
    <svg viewBox="0 0 1080 1920" style={{width:'100%',height:'100%'}} preserveAspectRatio="none">
     <g opacity={light?.1:.15} stroke={accent} fill="none" strokeWidth="2">{Array.from({length:9},(_,i)=><circle key={i} cx="1070" cy="1100" r={120+i*100+Math.sin(t.local*1.8)*12}/>)}</g>
     <path d={`M0 ${1560+t.local*10} L1080 ${1230+t.local*10} V1920 H0Z`} fill={accent} opacity={light?.07:.13}/>
    </svg>
  </AbsoluteFill>}
  <div style={{position:'absolute',left:x,top:y,width:w,height:h,color,transform:`translateY(${(1-t.enter)*35*scale}px)`}}>
   {o.kind==='brand'?<div style={{display:'flex',alignItems:'center',gap:20*scale,width:'fit-content',background:PAPER,padding:`0 ${20*scale}px`,borderRadius:18*scale,border:`${2*scale}px solid ${accent}`,boxShadow:`${5*scale}px ${5*scale}px 0 ${INK}`}}>{logo}</div>:null}
   {o.kind==='label'?<div style={{background:project.theme.background,padding:28*scale,borderLeft:`${8*scale}px solid ${accent}`,borderRadius:14*scale,boxShadow:`0 ${8*scale}px 0 #00000033`}}>{eyebrow}{title}{body}<div style={{height:5*scale,width:`${100*t.enter}%`,background:accent,marginTop:20*scale}}/></div>:null}
   {o.kind==='call'?<>
    {eyebrow}{title}{body}
    <svg viewBox="0 0 900 500" style={{width:w,height:h*.7,overflow:'visible'}}>
     {[0,1,2].map(i=><circle key={i} cx="450" cy="230" r={92+((t.local*75+i*50)%165)} stroke={accent} fill="none" strokeWidth="3" opacity={.5-((t.local*75+i*50)%165)/330}/>)}
     <g transform={`translate(450 230) rotate(${Math.sin(t.local*16)*Math.exp(-t.local*2)*10})`}><rect x="-115" y="-115" width="230" height="230" rx="65" fill={accent}/><path d="M-52 -50 Q-40 35 55 65 L80 25 L35 4 L14 25 Q-20 7 -24 -26 L-8 -45 L-25 -85 Z" fill={PAPER}/></g>
     {Array.from({length:18},(_,i)=>{const hh=18+Math.abs(Math.sin(i*.8-t.local*6))*65;return <rect key={i} x={240+i*24} y={420-hh/2} width="12" height={hh} rx="6" fill={accent} opacity={.5+i%3*.15}/>})}
     <path d="M70 230 H280 M620 230 H830" stroke={accent} strokeWidth="4" strokeDasharray="8 12" strokeDashoffset={-t.local*80}/>
    </svg>
   </>:null}
   {o.kind==='browser'?<>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:85*scale}}>{logo}<div style={{fontSize:width*.02,color:'#608080',textAlign:'right'}}>WEBSITE<br/>REFERENCE</div></div>
    {eyebrow}{title}
    {(()=>{const by=225*scale,bh=Math.max(220*scale,h-by-20*scale),bw=w,toolbar=45*scale,focus={x:o.focus?.x??.5,y:o.focus?.y??.5,scale:(o.focus?.scale??1)*(1+t.progress*.025)},rect=screenshotRect(bw,bh-toolbar,o.aspectRatio,o.fit,focus);return <div style={{position:'absolute',top:by,width:bw,height:bh,borderRadius:22*scale,background:'#fff',border:`${3*scale}px solid ${accent}`,boxShadow:`${12*scale}px ${14*scale}px 0 #102f3522`,overflow:'hidden',transform:`perspective(1600px) rotateY(${(1-t.enter)*-12}deg) scale(${.94+.06*t.enter})`}}>
      <div style={{height:toolbar,display:'flex',alignItems:'center',gap:9*scale,paddingLeft:18*scale,background:'#e4eeee',borderBottom:'1px solid #bbd2d0'}}>{[0,1,2].map(i=><i key={i} style={{display:'block',width:9*scale,height:9*scale,borderRadius:'50%',background:i? '#8caaaa':accent}}/>)}<span style={{fontSize:22*scale,marginLeft:14*scale,color:INK}}>{o.body??'Official product website'}</span></div>
      <div style={{position:'relative',height:bh-toolbar,overflow:'hidden'}}><Img src={staticFile(o.src!)} style={{position:'absolute',left:rect.x,top:rect.y,width:rect.width,height:rect.height}}/>{o.cursor&&<Pointer x={rect.x+o.cursor.x*rect.width} y={rect.y+o.cursor.y*rect.height} local={t.local} clickAt={o.cursor.clickAt??.9} color={accent}/>}</div>
     </div>})()}
   </>:null}
   {o.kind==='steps'?<>
    {eyebrow}{title}<div style={{display:'flex',gap:14*scale,marginTop:32*scale}}>{o.labels!.map((label,i)=>{const active=t.local>.2+i*.36,pop=Math.max(0,Math.min(1,(t.local-i*.16)/.3));return <React.Fragment key={i}><div style={{flex:1,background:active?accent:PAPER,color:active?PAPER:INK,borderRadius:18*scale,padding:`${22*scale}px ${10*scale}px`,textAlign:'center',transform:`translateY(${(1-pop)*80*scale}px) scale(${.85+.15*pop})`,opacity:pop}}><div style={{fontSize:34*scale,fontWeight:900,marginBottom:10*scale}}>{active?'✓':String(i+1).padStart(2,'0')}</div><div style={{fontSize:Math.min(27*scale,165*scale/label.length*1.7),fontWeight:800}}>{label}</div></div>{i<o.labels!.length-1&&<div style={{alignSelf:'center',fontSize:30*scale,color:accent}}>→</div>}</React.Fragment>})}</div>{body}
   </>:null}
   {o.kind==='cta'?<>
    <div style={{marginBottom:45*scale}}>{logo}</div>{eyebrow}{title}{body}
    <div style={{position:'relative',marginTop:55*scale,height:150*scale,background:accent,borderRadius:30*scale,boxShadow:`0 ${12*scale}px 0 #071f23`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:30*scale,fontSize:width*.047,fontWeight:900,color:'#fff',transform:`scale(${1+Math.sin(t.local*3)*.012})`}}><span>{o.labels?.[0]??'Book a demo'}</span><span style={{fontSize:60*scale}}>↗</span><Pointer x={w*.75} y={75*scale} local={t.local} clickAt={1} color={PAPER}/></div>
    <div style={{display:'flex',gap:7*scale,marginTop:45*scale}}>{Array.from({length:30},(_,i)=><div key={i} style={{height:(8+Math.abs(Math.sin(i*.6-t.local*4))*35)*scale,width:8*scale,borderRadius:5*scale,background:accent}}/>)}</div>
   </>:null}
  </div>
 </AbsoluteFill>;
}
export function ProductionOverlays({project}:{project:Project}){return <>{(project.overlays??[]).map((o,i)=><OverlayShot key={i} o={o} project={project}/>)}</>;}
