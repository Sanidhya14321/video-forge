import { readFile, writeFile, copyFile } from "node:fs/promises";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";
import { root } from "../src/runner.js";
const algorithm = path.join(root, "demos", "algorithm-explainer");
const props = JSON.parse(
  await readFile(path.join(algorithm, "render-props.json"), "utf8"),
);
props.words = [];
const serveUrl = path.join(algorithm, "composition-bundle");
const composition = {
  ...(await selectComposition({
    serveUrl,
    id: "VideoForge",
    inputProps: props,
  })),
  width: 960,
  height: 540,
};
await renderMedia({
  serveUrl,
  composition,
  inputProps: props,
  outputLocation: path.join(root, "examples", "assets", "sample-recording.mp4"),
  codec: "h264",
  audioCodec: "aac",
  concurrency: 2,
  offthreadVideoThreads: 2,
  crf: 22,
  pixelFormat: "yuv420p",
  chromiumOptions: { gl: "swangle" },
});
await copyFile(
  path.join(algorithm, "transcript.json"),
  path.join(root, "examples", "assets", "sample-transcript.json"),
);
const { words } = JSON.parse(
  await readFile(path.join(algorithm, "transcript.json"), "utf8"),
);
const split = words.findIndex((w: any) =>
  String(w.text).toLowerCase().includes("compare"),
);
const cut = split > 0 ? split : 6;
const segments = [
  { start: Math.max(0, words[0].start - 0.04), end: words[cut - 1].end + 0.03 },
  {
    start: Math.max(words[cut - 1].end + 0.03, words[cut].start - 0.03),
    end: Math.min(
      props.durationFrames / props.project.fps,
      words.at(-1).end + 0.12,
    ),
  },
];
const footage = {
  version: 1,
  name: "footage-repurpose",
  workflow: "footage-repurpose",
  footage: { src: "assets/sample-recording.mp4", segments, crop: "contain" },
  captions: { transcript: "assets/sample-transcript.json", maxWords: 4 },
  exports: [{ preset: "vertical", width: 540, height: 960 }],
  assets: [
    {
      path: "assets/sample-recording.mp4",
      origin:
        "Video Forge synthetic recording fixture: original animation and Kokoro narration, without burned captions",
      license: "MIT original animation; Kokoro model output terms apply",
    },
  ],
};
await writeFile(
  path.join(root, "examples", "footage-repurpose.json"),
  JSON.stringify(footage, null, 2) + "\n",
);
