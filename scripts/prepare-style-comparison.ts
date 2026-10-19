/** Delivery utility: compare two completed native productions, preserving both sources. */
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {root} from '../src/runner.js';
import {binary,exec,inspect} from '../src/media.js';
const out=path.join(root,'demos/style-comparison');await mkdir(out,{recursive:true});
const minimal=path.join(root,'demos/reel-showcase/vertical.mp4'),pop=path.join(root,'demos/pop-showcase/vertical.mp4');
const ffmpeg=binary('ffmpeg');
await exec(ffmpeg,['-y','-i',minimal,'-i',pop,'-loop','1','-i',path.join(out,'header.png'),'-filter_complex','[0:v]scale=540:960,setsar=1,setpts=PTS-STARTPTS[a];[1:v]scale=540:960,setsar=1,setpts=PTS-STARTPTS[b];[a][b]hstack=inputs=2[body];[2:v]scale=1080:80,setsar=1[head];[head][body]vstack=inputs=2[v]','-map','[v]','-map','1:a:0','-t','30','-r','30','-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart',path.join(out,'comparison.mp4')],{maxBuffer:5e6});
await writeFile(path.join(out,'quality.json'),JSON.stringify(await inspect(path.join(out,'comparison.mp4')),null,2));
