/** Frame-derived overlays; pointer coordinates share the screenshot's actual fitted geometry. */
export function overlayTiming(frame:number,fps:number,start:number,end:number,holdEnd=false){
 const time=frame/fps,local=time-start,duration=end-start;
 const clamp=(x:number)=>Math.max(0,Math.min(1,x));
 return {visible:time>=start&&time<end,local,duration,progress:clamp(local/duration),enter:1-Math.pow(1-clamp(local/.32),3),opacity:Math.min(clamp(local/.1),holdEnd?1:clamp((end-time)/.15))};
}
export function screenshotRect(width:number,height:number,aspect:number,fit:'contain'|'cover',focus={x:.5,y:.5,scale:1}){
 const scale=(fit==='contain'?Math.min(width/aspect,height):Math.max(width/aspect,height))*focus.scale;
 const w=scale*aspect,h=scale;
 return {x:(width-w)*focus.x,y:(height-h)*focus.y,width:w,height:h};
}
