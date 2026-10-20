// Original stylized product prop. Geometry/materials are MIT; no external media.
import {Group,Mesh,MeshStandardMaterial} from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter.js';
import {writeFile} from 'node:fs/promises';
// The exporter uses the web FileReader interface; no browser or network is needed.
globalThis.FileReader=class {
 readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}
 readAsDataURL(blob){blob.arrayBuffer().then(result=>{this.result=`data:${blob.type};base64,${Buffer.from(result).toString('base64')}`;this.onloadend?.();});}
};
const root=new Group();root.name='Video Forge original fictional speaker';
const materials={body:new MeshStandardMaterial({color:'#9bb5c8',roughness:.3,metalness:.35}),ink:new MeshStandardMaterial({color:'#121c2a',roughness:.7,metalness:.05}),coral:new MeshStandardMaterial({color:'#ff6045',roughness:.35,metalness:.15}),paper:new MeshStandardMaterial({color:'#f0e2c9',roughness:.5,metalness:.05})};
function add(name,size,position,material,radius){const mesh=new Mesh(new RoundedBoxGeometry(...size,3,radius),materials[material]);mesh.name=name;mesh.position.set(...position);root.add(mesh);}
add('body',[1.5,2.2,.6],[0,0,0],'body',.12);
add('front',[1.31,1.99,.055],[0,0,.3],'ink',.08);
add('accent',[.97,.15,.045],[0,.66,.345],'coral',.035);
for(let i=0;i<7;i++)add(`grille-${i}`,[1.02,.055,.05],[0,.38-i*.135,.35],'paper',.02);
add('control',[.14,.14,.055],[-.4,-.82,.355],'coral',.045);
const glb=await new GLTFExporter().parseAsync(root,{binary:true,onlyVisible:true});
await writeFile(new URL('../examples/assets/speaker-prop.glb',import.meta.url),Buffer.from(glb));
console.log('Original rounded GLB prop:',glb.byteLength,'bytes');
