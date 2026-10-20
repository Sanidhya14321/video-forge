import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {Refract,SplitType,DepthStage,Plane,between,loadFont} from '../lib';
import score from '../score.json';
if(typeof window!=='undefined')loadFont('Forge','SpaceGrotesk.ttf',{weight:'300 700'});
export const Film=()=>{const f=useCurrentFrame(),shot=score[0];return <Refract frame={f} center={[between(f,70,140,-.2,1.2),.5]} strength={1.4}><AbsoluteFill style={{background:'#e6ff62',color:'#161717',fontFamily:'Forge,Arial,sans-serif'}}><DepthStage z={between(f,0,shot.endFrame,0,160)} roll={between(f,0,shot.endFrame,-8,3)}><Plane width={1000} height={750} z={-100}><SplitType text={'EDITABLE\nBY DESIGN.'} frame={f} start={0} stagger={1} size={180}/><div style={{fontSize:36,marginTop:60}}>HTML · React · TSX → video</div></Plane></DepthStage></AbsoluteFill></Refract>;};
