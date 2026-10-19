"""Generate host-specific entrypoints from one maintained skill/reference source."""
import pathlib,re,json

def standalone_director(root):
 s=(root/'skills/video-forge/SKILL.md').read_text()
 s=s.replace('../video-','skills/video-').replace('../../docs/','docs/').replace('../../sources/','sources/')
 s=re.sub(r'\]\(references/([^)]+)\)',r'](skills/video-forge/references/\1)',s)
 return s.replace("Locate this plugin's root from this file (two parent directories).","This file's directory is the toolkit root.")

def companion_files(root):
 files={p.name:p.read_bytes() for p in (root/'adapters/chatgpt').glob('*.md')}
 def flatten(text):
  def link(m):
   label,target=m.group(1),m.group(2)
   if target.startswith(('http:','https:','#','mailto:')):return m.group(0)
   if target.endswith('references/brand-edits.md'):target='brand-edits.md'
   elif target.endswith('references/reels.md') or target=='references/reels.md':target='reels.md'
   elif target.endswith('/SKILL.md'):
    target=target.split('/')[-2].removeprefix('video-')+'.md'
    if target=='forge.md':target='director.md'
    if target=='forge-setup.md':return label+' (use the local runtime setup guide)'
   elif target.endswith('references/workflows.md'):return label+' (use this module’s recipes below)'
   elif target.endswith('project-format.md'):target='project-format.md'
   elif target.endswith('references/hosts.md'):target='START-HERE.md'
   else:return label+' (see the source repository)'
   return f'[{label}]({target})'
  return re.sub(r'\[([^\]]+)\]\(([^)]+)\)',link,text)
 director=(root/'skills/video-forge/SKILL.md').read_text()
 director=director.replace('4. Locate this plugin\'s root from this file (two parent directories).','4. If a prepared local runtime is available, locate that toolkit directory; companion files do not contain the runtime.')
 files['director.md']=flatten(director).encode()
 files['brand-edits.md']=flatten((root/'skills/video-forge/references/brand-edits.md').read_text()).encode()
 files['reels.md']=flatten((root/'skills/video-forge/references/reels.md').read_text()).encode()
 for module in ['planning','motion','editing','captions','audio','generation','delivery']:
  folder=root/f'skills/video-{module}'
  files[f'{module}.md']=flatten((folder/'SKILL.md').read_text()+'\n\n'+(folder/'references/workflows.md').read_text()).encode()
 files['project-format.md']=(root/'docs/project-format.md').read_bytes()
 files['project.schema.json']=(root/'docs/project.schema.json').read_bytes()
 for name in ['reel-smoke.json','pop-smoke.json','product-demo.json']:files['examples/'+name]=(root/'examples'/name).read_bytes()
 files['LICENSE']=(root/'LICENSE').read_bytes();files['NOTICE.md']=(root/'NOTICE.md').read_bytes()
 files['manifest.json']=json.dumps({'version':json.loads((root/'package.json').read_text())['version'],'mode':'planning-and-local-handoff','runtimeIncluded':False,'generatedFrom':'shared skills and project contract','source':'https://github.com/Sanidhya14321/video-forge'},indent=2).encode()
 return files

if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--out',type=pathlib.Path,required=True);a=p.parse_args();root=pathlib.Path(__file__).resolve().parents[1]
 a.out.mkdir(parents=True,exist_ok=False)
 for name,data in companion_files(root).items():
  dest=a.out/name;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
 print('Generated ChatGPT companion:',a.out)
