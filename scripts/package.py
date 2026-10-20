#!/usr/bin/env python3
"""Build portable host archives; dependencies are installed after extraction."""
import pathlib,zipfile,json,hashlib,argparse,os,re
from host_adapters import standalone_director,companion_files
from package_policy import collect_files
parser=argparse.ArgumentParser();parser.add_argument('--out',type=pathlib.Path);args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parents[1];out=(args.out or root.parent).resolve();version=json.loads((root/'package.json').read_text())['version']
if out==root:raise SystemExit('Use an output directory separate from the toolkit root')
out.mkdir(parents=True,exist_ok=True)
if any(out.iterdir()):raise SystemExit('Use an empty output directory to avoid stale release assets')
files=collect_files(root)
def runtime_text(file):
 """Keep documentation useful when large demos are separate release assets."""
 text=file.read_text()
 def replace(m):
  label,target=m.group(1),m.group(2)
  if target.startswith(('https:','http:','#','mailto:')):return m.group(0)
  dest=(file.parent/target.split('#')[0]).resolve()
  if dest.is_relative_to(root/'demos') or dest.is_relative_to(root/'docs/releases'):
   return f'[{label}](https://github.com/Sanidhya14321/video-forge/blob/v{version}/{dest.relative_to(root).as_posix()})'
  return m.group(0)
 return re.sub(r'\[([^\]]+)\]\(([^)]+)\)',replace,text).encode()
def write(z,member,data):
 info=zipfile.ZipInfo('video-forge/'+member,date_time=(2026,10,19,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=(0o755 if member in ['dist/cli.js','scripts/package.py'] else 0o644)<<16;z.writestr(info,data)
checksums=[]
for host in ['source','claude','codex','standalone','claude-skill','chatgpt']:
 dest=out/f'video-forge-{host}-{version}.zip'
 with zipfile.ZipFile(dest,'w') as z:
  if host=='chatgpt':
   for name,data in sorted(companion_files(root).items()):write(z,name,data)
  for file in ([] if host=='chatgpt' else files):
   rel=file.relative_to(root).as_posix()
   if host!='source' and (rel.startswith('demos/') or rel.startswith('.github/')):continue
   if host!='source' and rel=='README.md':
    write(z,rel,(root/'adapters/runtime-readme.md').read_bytes());continue
   if host=='claude' and (rel.startswith(('.codex-plugin/','.agents/')) or rel=='plugin.json'):continue
   if host=='codex' and rel.startswith('.claude-plugin/'):continue
   if host in ['standalone','claude-skill'] and (rel.startswith(('.claude-plugin/','.codex-plugin/','.agents/')) or rel in ['plugin.json','skills/video-forge/SKILL.md','skills/video-forge/agents/openai.yaml']):continue
   write(z,rel,runtime_text(file) if host!='source' and file.suffix=='.md' else file.read_bytes())
  if host not in ['source','chatgpt']:write(z,'.release.json',json.dumps({'host':host,'version':version}).encode())
  if host in ['standalone','claude-skill']:
   s=standalone_director(root)
   write(z,'SKILL.md',s.encode())
   write(z,'agents/openai.yaml',(root/'skills/video-forge/agents/openai.yaml').read_bytes())
 data=dest.read_bytes();checksums.append(f'{hashlib.sha256(data).hexdigest()}  {dest.name}')
 print(f'{dest.name}: {len(data):,} bytes')
(out/'video-forge-SHA256SUMS.txt').write_text('\n'.join(checksums)+'\n')
(out/f'video-forge-SHA256SUMS-{version}.txt').write_text('\n'.join(checksums)+'\n')
