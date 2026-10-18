import React from 'react';
import {AbsoluteFill,Composition,registerRoot,Sequence,Audio,Img,OffthreadVideo,useCurrentFrame,useVideoConfig,interpolate,spring,staticFile} from 'remotion';
import type {RenderProps,Scene,Word} from './schema';
const sample:any={project:{fps:30,theme:{background:'#0b1020',foreground:'#f1f5f9',accent:'#68e0cf',muted:'#a8b3cc',font:'Arial, sans-serif'},scenes:[],narration:{provider:'none'},captions:{maxWords:5}},words:[],durationFrames:30};
function Panel({scene,theme}:{scene:Scene;theme:RenderProps['project']['theme']}){
 const f=useCurrentFrame(),{fps,width,height}=useVideoConfig();const vertical=height>width;
 const enter=spring({frame:f,fps,config:{damping:22,stiffness:130}});
 const font=width*(vertical?0.065:0.044);const max= Math.max(...(scene.values??[1]),1);
 return <AbsoluteFill style={{padding:`${height*.10}px ${width*.075}px ${height*.22}px`,justifyContent:'center',gap:height*.035,opacity:interpolate(f,[0,7],[0,1],{extrapolateRight:'clamp'}),transform:`translateY(${(1-enter)*24}px)`}}>
  {scene.eyebrow&&<div style={{color:theme.accent,fontSize:width*.021,letterSpacing:3,fontWeight:700,textTransform:'uppercase'}}>{scene.eyebrow}</div>}
  {scene.title&&<h1 style={{fontSize:font,letterSpacing:-font*.035,lineHeight:1.12,margin:0,maxWidth:'100%',overflowWrap:'break-word'}}>{scene.title}</h1>}
  {scene.body&&<p style={{fontSize:font*.48,lineHeight:1.5,color:theme.muted,margin:0}}>{scene.body}</p>}
  {scene.kind==='code'&&<pre style={{margin:0,padding:width*.035,fontSize:width*(vertical?.032:.024),lineHeight:1.6,background:'#141e33',border:`1px solid ${theme.accent}55`,borderRadius:width*.018,whiteSpace:'pre-wrap',overflowWrap:'anywhere',fontFamily:'monospace'}}>{scene.code}</pre>}
  {['chart','algorithm'].includes(scene.kind)&&<div style={{display:'flex',height:height*.26,alignItems:'end',gap:width*.018,paddingTop:30}}>{scene.values!.map((v,i)=><div key={i} style={{flex:1,height:'100%',display:'flex',flexDirection:'column',justifyContent:'end',alignItems:'center',gap:10}}><div style={{fontSize:width*.025,color:theme.foreground}}>{v}</div><div style={{width:'100%',height:`${Math.max(4,v/max*80*interpolate(f,[i*3,i*3+18],[.05,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}))}%`,borderRadius:'8px 8px 0 0',background:scene.highlight?.includes(i)?'#fbba72':theme.accent,boxShadow:scene.highlight?.includes(i)?'0 0 25px #fbba7233':undefined}}/><div style={{fontSize:width*.018,color:theme.muted}}>{scene.labels?.[i]??(scene.kind==='algorithm'?`[${i}]`:'')}</div></div>)}</div>}
  {scene.kind==='image'&&<Img src={staticFile(scene.src!)} style={{width:'100%',maxHeight:height*.42,objectFit:'contain',borderRadius:width*.02,boxShadow:'0 20px 90px #0006'}}/>}
  {scene.kind==='video'&&<OffthreadVideo src={staticFile(scene.src!)} muted style={{width:'100%',maxHeight:height*.45,objectFit:'contain'}}/>}
  {scene.note&&<div style={{fontSize:font*.37,color:theme.accent,lineHeight:1.5}}>{scene.note}</div>}
 </AbsoluteFill>;
}
function Captions({words,maxWords,theme}:{words:Word[];maxWords:number;theme:RenderProps['project']['theme']}){
 const f=useCurrentFrame(),{fps,width,height}=useVideoConfig(),t=f/fps;
 const index=words.findIndex(w=>t>=w.start&&t<w.end);if(index<0)return null;
 // Keep each phrase short enough for a phone; break early on long technical terms.
 let start=0,end=0;while(end<=index){start=end;let chars=0;while(end<words.length&&end-start<maxWords){const next=words[end].text.length+1;if(end>start&&chars+next>34)break;chars+=next;end++;}}
 return <div style={{position:'absolute',left:'8%',right:'8%',bottom:height*.14,display:'flex',justifyContent:'center'}}><div style={{maxWidth:'100%',display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'0 .27em',background:'#070c17ed',border:`1px solid ${theme.accent}44`,borderRadius:width*.016,padding:`${height*.012}px ${width*.025}px`,fontSize:width*(height>width?.050:.032),lineHeight:1.4,fontWeight:700,textAlign:'center'}}>{words.slice(start,end).map((w,i)=><span key={start+i} style={{color:start+i===index?theme.accent:theme.foreground,maxWidth:'100%',overflowWrap:'anywhere'}}>{w.text}</span>)}</div></div>;
}
export const Film:React.FC<RenderProps>=({project,words,narration,music,footage})=>{
 const f=useCurrentFrame(),{fps,durationInFrames,width,height}=useVideoConfig();let cursor=0;
 const activeVoice=words.some(w=>f/fps>=w.start&&f/fps<w.end);
 return <AbsoluteFill style={{background:project.theme.background,color:project.theme.foreground,fontFamily:project.theme.font}}>
  <AbsoluteFill style={{background:`radial-gradient(ellipse at 90% 15%, ${project.theme.accent}18, transparent 60%)`}}/>
  <div style={{position:'absolute',left:0,top:0,width:'100%',height:4,background:project.theme.accent,transformOrigin:'left',transform:`scaleX(${f/Math.max(1,durationInFrames-1)})`}}/>
  {footage?<AbsoluteFill style={{padding:`${height*.07}px ${width*.03}px ${height*.22}px`}}><OffthreadVideo src={staticFile(footage)} muted={Boolean(narration)} style={{width:'100%',height:'100%',objectFit:project.footage?.crop??'contain'}}/></AbsoluteFill>:project.scenes.map((scene,i)=>{const duration=Math.round(scene.duration*fps);const from=cursor;cursor+=duration;return <Sequence key={i} from={from} durationInFrames={duration}><Panel scene={scene} theme={project.theme}/></Sequence>;})}
  {narration&&<Audio src={staticFile(narration)}/>}
  {music&&<Audio src={staticFile(music)} loop volume={(project.music?.volume??.12)*(activeVoice?.55:1)}/>}
  <Captions words={words} maxWords={project.captions?.maxWords??5} theme={project.theme}/>
  {project.theme.brand&&<div style={{position:'absolute',bottom:height*.055,left:width*.075,fontSize:width*.018,color:project.theme.muted,letterSpacing:2}}>{project.theme.brand}{project.theme.tagline&&<> <span style={{color:project.theme.accent}}>●</span> {project.theme.tagline}</>}</div>}
 </AbsoluteFill>;
};
const Root=()=> <Composition id="VideoForge" component={Film as any} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={sample} calculateMetadata={({props}:any)=>({durationInFrames:props.durationFrames,fps:props.project.fps})}/>;
registerRoot(Root);
