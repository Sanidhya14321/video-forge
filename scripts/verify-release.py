#!/usr/bin/env python3
"""Verify downloaded or locally prepared release assets before installation."""
import argparse,pathlib,json,hashlib
p=argparse.ArgumentParser();p.add_argument('directory',type=pathlib.Path);a=p.parse_args();r=a.directory.resolve()
seen=set()
for line in (r/'SHA256SUMS.txt').read_text().splitlines():
 digest,name=line.split('  ',1)
 if pathlib.PurePosixPath(name).name!=name or name in seen:raise SystemExit('Invalid or duplicate asset name')
 seen.add(name);file=r/name
 if hashlib.sha256(file.read_bytes()).hexdigest()!=digest:raise SystemExit('Checksum mismatch: '+name)
actual={p.name for p in r.iterdir() if p.is_file() and p.name!='SHA256SUMS.txt'}
if actual!=seen:raise SystemExit('Missing or unlisted release assets')
m=json.loads((r/'release-manifest.json').read_text())
for item in m['assets']:
 f=r/item['name']
 if item['name'] not in seen or f.stat().st_size!=item['bytes'] or hashlib.sha256(f.read_bytes()).hexdigest()!=item['sha256']:raise SystemExit('Manifest mismatch: '+item['name'])
print('Verified release',m['tag'],':',len(seen),'assets')
