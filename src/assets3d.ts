import {readFile} from 'node:fs/promises';

/** Validate the supported GLB envelope before loading an asset into the renderer.
 * It is a capability/preflight check, not a complete glTF conformance validator. */
export async function inspectGlb(file:string){
  const b=await readFile(file);
  if(b.length<20||b.readUInt32LE(0)!==0x46546c67||b.readUInt32LE(4)!==2||b.readUInt32LE(8)!==b.length||b.readUInt32LE(16)!==0x4e4f534a)
    throw new Error(`Invalid GLB v2 envelope: ${file}`);
  const end=20+b.readUInt32LE(12);if(end>b.length)throw new Error(`Truncated GLB JSON: ${file}`);
  let data:any;try{data=JSON.parse(b.subarray(20,end).toString('utf8').trim());}catch{throw new Error(`Invalid GLB JSON: ${file}`);}
  const visit=(v:unknown):void=>{
    if(!v||typeof v!=='object')return;
    for(const [key,value] of Object.entries(v)){
      if(key==='uri'&&(typeof value!=='string'||!value.startsWith('data:')))throw new Error(`GLB has external resources; embed textures/buffers before rendering: ${file}`);
      visit(value);
    }
  };visit(data);
  const unsupported=['KHR_draco_mesh_compression','EXT_meshopt_compression','KHR_texture_basisu'];
  if((data.extensionsUsed??[]).some((s:string)=>unsupported.includes(s)))throw new Error(`GLB needs a compression decoder; export an uncompressed self-contained GLB or use a custom loader: ${file}`);
  return {bytes:b.length,meshes:data.meshes?.length??0,animations:data.animations?.length??0,scope:'Static self-contained GLB; authored world transform keys only'};
}
