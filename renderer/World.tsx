import React, {useLayoutEffect,useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useLoader, useThree} from '@react-three/fiber';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PerspectiveCamera, SRGBColorSpace, TextureLoader} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import type {Project, Scene} from '../src/schema';
import {cameraAt, objectAt, type World} from '../src/world';

function CameraRig({world,time}:{world:World;time:number}){
  const camera=useThree(s=>s.camera),pose=cameraAt(time,world.camera);
  const [x,y,z]=pose.position,[tx,ty,tz]=pose.target;
  useLayoutEffect(()=>{
    camera.position.set(x,y,z);camera.up.set(0,1,0);camera.lookAt(tx,ty,tz);camera.rotateZ(pose.roll);
    if(camera instanceof PerspectiveCamera){camera.fov=pose.fov;camera.updateProjectionMatrix();}
    camera.updateMatrixWorld();
  },[camera,x,y,z,tx,ty,tz,pose.roll,pose.fov]);
  return null;
}
function ImageSurface({src}:{src:string}){
  const texture=useLoader(TextureLoader,staticFile(src));
  useLayoutEffect(()=>{texture.colorSpace=SRGBColorSpace;texture.needsUpdate=true;},[texture]);
  return <meshBasicMaterial map={texture} transparent toneMapped={false}/>;
}
function Geometry({shape}:{shape:World['objects'][number]['shape']}){
  switch(shape){
    case 'box': return <boxGeometry args={[1,1,1]}/>;
    case 'sphere': return <sphereGeometry args={[.5,32,24]}/>;
    case 'torus': return <torusGeometry args={[.5,.11,12,48]}/>;
    case 'cylinder': return <cylinderGeometry args={[.5,.5,1,32]}/>;
    default:return <planeGeometry args={[1,1]}/>;
  }
}
function ModelAsset({src}:{src:string}){
  const model=useLoader(GLTFLoader,staticFile(src));
  const scene=useMemo(()=>model.scene.clone(true),[model.scene]);
  return <primitive object={scene}/>;
}
function WorldObject({object,time}:{object:World['objects'][number];time:number}){
  const pose=objectAt(time,object),scale=object.size.map((n,i)=>n*pose.scale[i]) as [number,number,number];
  return <group position={pose.position} rotation={pose.rotation} scale={scale}>
    {object.shape==='model'?<ModelAsset src={object.src!}/>:<mesh><Geometry shape={object.shape}/>
    {object.shape==='image'?<ImageSurface src={object.src!}/>:<meshStandardMaterial color={object.color} roughness={object.roughness} metalness={object.metalness}/>}</mesh>}
  </group>;
}
export function WorldScene({scene,project}:{scene:Scene;project:Project}){
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),world=scene.world!,time=frame/fps;
  const copyOpacity=Math.max(0,Math.min(1,(time-world.copyAt)/.18));
  return <AbsoluteFill>
    <ThreeCanvas width={width} height={height} camera={{near:.03,far:2000,fov:world.camera.keys[0].fov}} gl={{antialias:true,alpha:false}}>
      <color attach="background" args={[project.theme.background]}/>
      <CameraRig world={world} time={time}/>
      <ambientLight intensity={world.ambient}/>
      {world.lights.map((light,i)=><directionalLight key={i} position={light.position} intensity={light.intensity} color={light.color}/>)}
      {world.objects.map(object=><WorldObject key={object.id} object={object} time={time}/>)}
    </ThreeCanvas>
    {world.copyPosition!=='none'&&scene.title&&<div style={{position:'absolute',left:'8%',right:'12%',top:world.copyPosition==='top'?'14%':undefined,bottom:world.copyPosition==='bottom'?'39%':undefined,opacity:copyOpacity,fontFamily:project.theme.font,color:project.theme.foreground}}>
      {scene.eyebrow&&<div style={{fontSize:width*.022,letterSpacing:'.15em',fontWeight:700,color:project.theme.accent,marginBottom:width*.02}}>{scene.eyebrow}</div>}
      <div style={{fontSize:Math.min(width*.084,width*.8/Math.max(...scene.title.split('\n').map(s=>s.length),1)*1.6),fontWeight:900,lineHeight:1.02,letterSpacing:'-.04em',whiteSpace:'pre-line'}}>{scene.title}</div>
      {scene.body&&<div style={{fontSize:width*.03,lineHeight:1.35,marginTop:width*.025,maxWidth:width*.72}}>{scene.body}</div>}
    </div>}
  </AbsoluteFill>;
}
