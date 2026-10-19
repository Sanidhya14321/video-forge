#!/usr/bin/env python3
"""Check archive integrity and host resource resolution without installing a host."""
import argparse,json,pathlib,subprocess,sys,tempfile,zipfile
parser=argparse.ArgumentParser();parser.add_argument('directory',type=pathlib.Path);args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parents[1];version=json.loads((root/'package.json').read_text())['version']
for host in ['source','claude','codex','standalone']:
 file=args.directory/f'video-forge-{host}-{version}.zip'
 with zipfile.ZipFile(file) as archive:
  assert archive.testzip() is None
  assert not any(x in pathlib.PurePosixPath(n).parts for n in archive.namelist() for x in ['node_modules','.venv','.git','composition-bundle'])
  assert all(not pathlib.PurePosixPath(n).is_absolute() and '..' not in pathlib.PurePosixPath(n).parts for n in archive.namelist())
  with tempfile.TemporaryDirectory(prefix='vf-archive-') as tmp:
   archive.extractall(tmp);folder=pathlib.Path(tmp)/'video-forge'
   subprocess.run([sys.executable,str(folder/'scripts/validate_package.py')],check=True)
 print(host,'CRC, paths, excluded dependencies and packaged resources: passed')
