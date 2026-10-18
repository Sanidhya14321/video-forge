import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, access, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import {
  exec,
  binary,
  detectSpeechSegments,
  normalizeVoice,
  probe,
} from "../src/media.js";
import { runProject, preflight } from "../src/runner.js";
import { projectSchema } from "../src/schema.js";
test("real FFmpeg silence detection removes an interior gap and handles fully silent input", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "vf-silence-"));
  try {
    const file = path.join(dir, "audio.wav");
    await exec(binary("ffmpeg"), [
      "-v",
      "error",
      "-y",
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:duration=1",
      "-f",
      "lavfi",
      "-i",
      "anullsrc=r=44100:cl=mono:d=1",
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=440:duration=1",
      "-filter_complex",
      "[0:a][1:a][2:a]concat=n=3:v=0:a=1[a]",
      "-map",
      "[a]",
      file,
    ]);
    const keep = await detectSpeechSegments(file, -35, 0.3);
    assert.equal(keep.length, 2);
    assert.ok(keep[0].end > 1 && keep[0].end < 1.2);
    assert.ok(keep[1].start > 1.8 && keep[1].start < 2);
    const silent = path.join(dir, "silent.wav");
    await exec(binary("ffmpeg"), [
      "-v",
      "error",
      "-y",
      "-f",
      "lavfi",
      "-i",
      "anullsrc=r=44100:cl=mono:d=1",
      silent,
    ]);
    assert.deepEqual(await detectSpeechSegments(silent, -35, 0.3), []);
    await assert.rejects(
      () => normalizeVoice(silent, path.join(dir, "bad-voice.wav")),
      /no measurable/,
    );
    const leveled = await normalizeVoice(file, path.join(dir, "leveled.wav"));
    assert.ok(Math.abs((await probe(leveled)).duration - 3) < 0.03);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test("invalid jobs fail without creating an output directory or making paid calls", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "vf-preflight-"));
  try {
    const job = path.join(dir, "job.json"),
      out = path.join(dir, "output");
    await writeFile(
      job,
      JSON.stringify({
        version: 1,
        name: "missing",
        workflow: "product-demo",
        scenes: [{ kind: "image", duration: 2, src: "not-there.png" }],
      }),
    );
    await assert.rejects(() => runProject(job, out), /Cannot read asset/);
    await assert.rejects(() => access(out));
    const p = projectSchema.parse({
      version: 1,
      name: "bad-ref",
      workflow: "product-demo",
      scenes: [{ kind: "image", duration: 2, src: "generated:missing" }],
    });
    await assert.rejects(() => preflight(p, dir), /Unknown generated asset/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
