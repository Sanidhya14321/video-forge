#!/usr/bin/env python3
"""Build portable host archives; dependencies are installed after extraction."""
import pathlib,zipfile,json,hashlib,argparse
parser=argparse.ArgumentParser();parser.add_argument('--out',type=pathlib.Path);args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parents[1];out=(args.out or root.parent).resolve();version=json.loads((root/'package.json').read_text())['version']
if out==root:raise SystemExit('Use an output directory separate from the toolkit root')
out.mkdir(parents=True,exist_ok=True)
exclude={'node_modules','.venv','.cache','.git','__pycache__','runs','composition-bundle'}
files=sorted(p for p in root.rglob('*') if p.is_file() and (not out.is_relative_to(root) or out not in p.parents) and not any(x in exclude for x in p.relative_to(root).parts) and p.suffix not in {'.zip','.pyc'} and not p.name.startswith('.env'))
def write(z,member,data):
 info=zipfile.ZipInfo('video-forge/'+member,date_time=(2026,10,19,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=(0o755 if member in ['dist/cli.js','scripts/package.py'] else 0o644)<<16;z.writestr(info,data)
checksums=[]
for host in ['source','claude','codex','standalone']:
 dest=out/f'video-forge-{host}-{version}.zip'
 with zipfile.ZipFile(dest,'w') as z:
  for file in files:
   rel=file.relative_to(root).as_posix()
   if host=='claude' and (rel.startswith(('.codex-plugin/','.agents/')) or rel=='plugin.json'):continue
   if host=='codex' and rel.startswith('.claude-plugin/'):continue
   if host=='standalone' and (rel.startswith(('.claude-plugin/','.codex-plugin/','.agents/')) or rel in ['plugin.json','skills/video-forge/SKILL.md','skills/video-forge/agents/openai.yaml']):continue
   if host=='standalone' and rel=='README.md':
    write(z,rel,file.read_text().replace('(skills/video-forge/SKILL.md)','(SKILL.md)').encode());continue
   write(z,rel,file.read_bytes())
  if host!='source':write(z,'.release.json',json.dumps({'host':host,'version':version}).encode())
  if host=='standalone':
   s=(root/'skills/video-forge/SKILL.md').read_text().replace('../video-','skills/video-').replace('../../docs/','docs/').replace('../../sources/','sources/').replace('(references/workflows.md)','(skills/video-forge/references/workflows.md)').replace("(references/reels.md)","(skills/video-forge/references/reels.md)").replace("Locate this plugin's root from this file (two parent directories).","This file's directory is the toolkit root.")
   write(z,'SKILL.md',s.encode())
   write(z,'agents/openai.yaml',(root/'skills/video-forge/agents/openai.yaml').read_bytes())
 data=dest.read_bytes();checksums.append(f'{hashlib.sha256(data).hexdigest()}  {dest.name}')
 print(f'{dest.name}: {len(data):,} bytes')
(out/'video-forge-SHA256SUMS.txt').write_text('\n'.join(checksums)+'\n')
(out/f'video-forge-SHA256SUMS-{version}.txt').write_text('\n'.join(checksums)+'\n')
