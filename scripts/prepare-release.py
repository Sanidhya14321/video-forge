#!/usr/bin/env python3
"""Publish the six current packages; demonstrations stay in their original release."""
import argparse, pathlib, json, hashlib

p = argparse.ArgumentParser()
p.add_argument('--out', type=pathlib.Path, required=True)
out = p.parse_args().out.resolve()
r = pathlib.Path(__file__).resolve().parents[1]
v = json.loads((r / 'package.json').read_text())['version']
hosts = ['source', 'claude', 'codex', 'standalone', 'claude-skill', 'chatgpt']
expected = {f'video-forge-{host}-{v}.zip' for host in hosts}
expected |= {'video-forge-SHA256SUMS.txt', f'video-forge-SHA256SUMS-{v}.txt'}
actual = {f.name for f in out.iterdir() if f.is_file()}
if expected - actual:
    raise SystemExit('Package and validate all six host archives before preparing a release')
if actual - expected - {'SHA256SUMS.txt', 'release-manifest.json'}:
    raise SystemExit('Unexpected or stale release assets; use a clean package output directory')

def digest(file):
    with file.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()

entries = [{'name': name, 'bytes': (out / name).stat().st_size, 'sha256': digest(out / name)} for name in sorted(expected)]
manifest = {'version': v, 'tag': 'v' + v, 'repository': 'https://github.com/Sanidhya14321/video-forge',
            'archives': hosts, 'assets': entries,
            'demonstrations': 'https://github.com/Sanidhya14321/video-forge/releases/tag/v0.7.0'}
(out / 'release-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
entries.append({'name': 'release-manifest.json', 'sha256': digest(out / 'release-manifest.json')})
(out / 'SHA256SUMS.txt').write_text(''.join(f"{e['sha256']}  {e['name']}\n" for e in entries))
print('Prepared release', v, 'with', len(entries), 'checksummed assets')
