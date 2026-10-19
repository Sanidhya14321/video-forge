#!/usr/bin/env python3
"""Collect validated archives/media and emit machine-readable release checksums."""
import argparse,pathlib,json,hashlib,shutil,subprocess,sys
p=argparse.ArgumentParser();p.add_argument('--out',type=pathlib.Path,required=True);a=p.parse_args();out=a.out.resolve();out.mkdir(parents=True,exist_ok=True)
r=pathlib.Path(__file__).resolve().parents[1];v=json.loads((r/'package.json').read_text())['version']
for host in ['source','claude','codex','standalone','claude-skill','chatgpt']:
 if not (out/f'video-forge-{host}-{v}.zip').is_file():raise SystemExit('Package and validate all six host archives before preparing a release')
for src,name in [('demos/reel-showcase/vertical.mp4','reel.mp4'),('demos/reel-showcase/thumbnail.png','reel.png'),('demos/pop-showcase/vertical.mp4','color-pop.mp4'),('demos/pop-showcase/thumbnail.png','color-pop.png'),('demos/style-comparison/comparison.mp4','style-comparison.mp4')]:
 stem,ext=name.rsplit('.',1);shutil.copy2(r/src,out/f'video-forge-{stem}-{v}.{ext}')
subprocess.run([sys.executable,str(r/'scripts/package-comparison.py'),'--out',str(out)],check=True)
entries=[]
for f in sorted(out.iterdir()):
 if f.is_file() and f.name not in ['SHA256SUMS.txt','release-manifest.json']:
  entries.append({'name':f.name,'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
manifest={'version':v,'tag':'v'+v,'repository':'https://github.com/Sanidhya14321/video-forge','archives':['source','claude','codex','standalone','claude-skill','chatgpt'],'assets':entries}
(out/'release-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
entries.append({'name':'release-manifest.json','sha256':hashlib.sha256((out/'release-manifest.json').read_bytes()).hexdigest()})
(out/'SHA256SUMS.txt').write_text(''.join(f"{e['sha256']}  {e['name']}\n" for e in entries))
print('Prepared release',v,'with',len(entries),'checksummed assets')
