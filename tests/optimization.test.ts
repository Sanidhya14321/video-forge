import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, writeFile, rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
import {fingerprint} from '../src/file-manifest.js';
import {exec} from '../src/media.js';

test('streamed media manifest preserves exact bytes/hash and reports missing media', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'vf-hash-'));
  try {
    const bytes = Buffer.alloc(3 * 1024 * 1024 + 17, 0xab), file = path.join(dir, 'footage.bin');
    await writeFile(file, bytes);
    assert.deepEqual(await fingerprint(file), {bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex')});
    await assert.rejects(() => fingerprint(path.join(dir, 'absent.bin')), /ENOENT/);
  } finally { await rm(dir, {recursive: true, force: true}); }
});

test('release inventory excludes local productions, caches, secrets and unlisted media', async () => {
  const {stdout} = await exec('python3', ['-c', `
import sys,pathlib,tempfile
sys.path.insert(0,'scripts')
from package_policy import collect_files
with tempfile.TemporaryDirectory() as tmp:
 r=pathlib.Path(tmp)
 for name in ['src/cli.ts','src/.cache/scratch.ts','node_modules/leak.ts','demos/final.mp4','examples/private.mp4','examples/assets/sample-recording.mp4','templates/short/public/SpaceGrotesk.ttf','skills/video-forge/SKILL.md','skills/.env.local','scratch.md']:
  f=r/name;f.parent.mkdir(parents=True,exist_ok=True);f.write_text('fixture')
 print(chr(10).join(f.relative_to(r).as_posix() for f in collect_files(r)))
`]);
  assert.deepEqual(stdout.trim().split('\n').sort(), ['examples/assets/sample-recording.mp4','skills/video-forge/SKILL.md','src/cli.ts','templates/short/public/SpaceGrotesk.ttf'].sort());
});
