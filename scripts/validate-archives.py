#!/usr/bin/env python3
"""Validate host archives and generated companions without installing a host."""
import argparse,json,pathlib,subprocess,sys,tempfile,zipfile,re
p=argparse.ArgumentParser();p.add_argument('directory',type=pathlib.Path);a=p.parse_args()
root=pathlib.Path(__file__).resolve().parents[1];version=json.loads((root/'package.json').read_text())['version']
for host in ['source','claude','codex','standalone','claude-skill','chatgpt']:
 file=a.directory/f'video-forge-{host}-{version}.zip'
 with zipfile.ZipFile(file) as z:
  assert z.testzip() is None
  names=set(z.namelist());assert len(names)==len(z.namelist()),'Duplicate archive paths'
  assert not any(x in pathlib.PurePosixPath(n).parts for n in names for x in ['node_modules','.venv','.git','composition-bundle'])
  assert all(not pathlib.PurePosixPath(n).is_absolute() and '..' not in pathlib.PurePosixPath(n).parts for n in names)
  if host!='source':assert not any(n.startswith('video-forge/demos/') for n in names)
  with tempfile.TemporaryDirectory(prefix='vf-archive-') as tmp:
   z.extractall(tmp);folder=pathlib.Path(tmp)/'video-forge'
   if host=='chatgpt':
    assert not json.loads((folder/'manifest.json').read_text())['runtimeIncluded']
    assert json.loads((folder/'project.schema.json').read_text())
    assert len((folder/'instructions.md').read_text())<8000
    for md in folder.glob('*.md'):
     for target in re.findall(r'\]\(([^)]+)\)',md.read_text()):
      if target.startswith(('https:','http:','#','mailto:')):continue
      assert (md.parent/target.split('#')[0]).exists(),(md.name,target)
   else:
    subprocess.run([sys.executable,str(folder/'scripts/validate_package.py')],check=True)
    if host in ['standalone','claude-skill']:assert (folder/'SKILL.md').is_file()
    if host=='claude-skill':
     description=re.search(r'^description: (.+)',(folder/'SKILL.md').read_text(),re.M).group(1).strip('"')
     assert len(description)<=200
 print(host,'CRC, paths, resource resolution and host contract: passed')
