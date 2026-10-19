#!/usr/bin/env python3
"""Produce a portable two-player comparison with both original files."""
import pathlib,zipfile,argparse,json
p=argparse.ArgumentParser();p.add_argument('--out',type=pathlib.Path,required=True);a=p.parse_args()
r=pathlib.Path(__file__).resolve().parents[1];version=json.loads((r/'package.json').read_text())['version'];a.out.mkdir(parents=True,exist_ok=True)
html=(r/'demos/style-comparison/index.html').read_text().replace('../reel-showcase/vertical.mp4','media/minimal.mp4').replace('../pop-showcase/vertical.mp4','media/color-pop.mp4')
with zipfile.ZipFile(a.out/f'video-forge-comparison-{version}.zip','w',zipfile.ZIP_DEFLATED) as z:
 z.writestr('video-forge-comparison/index.html',html)
 for src,dest in [('demos/reel-showcase/vertical.mp4','media/minimal.mp4'),('demos/pop-showcase/vertical.mp4','media/color-pop.mp4'),('demos/style-comparison/comparison.mp4','comparison.mp4')]:z.write(r/src,'video-forge-comparison/'+dest)
 z.writestr('video-forge-comparison/README.txt','Open index.html in a browser. Both films are local; use Play together and choose the soundtrack. comparison.mp4 is a labelled side-by-side export with color-pop audio. These are contrasting productions with different scripts, timing and music, not a controlled performance experiment. AI-generated voice; original synthesized music and graphics. Video Forge: https://github.com/Sanidhya14321/video-forge\n')
