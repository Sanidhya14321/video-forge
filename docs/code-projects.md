# Version-2 code projects

Create a self-contained editable project:

```sh
node /absolute/plugin/dist/cli.js init /absolute/new-film
node /absolute/plugin/dist/cli.js review /absolute/new-film/project.json
node /absolute/plugin/dist/cli.js preview /absolute/new-film/project.json --out /absolute/draft
node /absolute/plugin/dist/cli.js run /absolute/new-film/project.json --dry-run
node /absolute/plugin/dist/cli.js run /absolute/new-film/project.json --out /absolute/final
```

```json
{"version":2,"name":"A film","entryPoint":"src/index.tsx","compositionId":"Film","publicDir":"public","inputProps":{},"score":"score.json","quality":"final","exports":[{"name":"vertical"}],"requires":{"htmlInCanvas":true,"audio":true}}
```

Optional `captions: {"transcript":"public/transcript.json"}` validates measured words and delivers root transcript/SRT sidecars. Optional `gl` chooses `angle` (default) or `swangle`; hardware capability is checked and a software fallback is reported.

The registered Remotion composition owns dimensions, FPS and duration. Optional `overrides` contains `width`, `height`, `fps`, `durationInFrames`. Export targets may set both `width` and `height`; `name` forms the MP4 filename. H.264 dimensions must be even. Keep source imports and assets inside the project; no symlinked public media. Output must be a fresh directory outside the project. The CLI consistently resolves the toolkit's React/Remotion runtime. The scaffold includes a standalone dependency lock; `npm ci` enables ordinary Remotion authoring without a Video Forge CLI.

`score.json` is an array of `{kind,label,startFrame,endFrame,mechanism?}`; kind is `shot`, `reading`, `transition`, `accent` or `audio`. Ranges are half-open, integral, positive-length and inside composition duration. Import this data into components so review metadata and choreography stay connected. Metadata is not inferred pixel analysis. A reading window can span cuts when the text remains visible. One-frame accents are supported.

`preview` renders a moving draft at up to 540px wide with even dimensions, keeping FPS/duration. `run` uses `quality`: draft uses CRF23/veryfast, final uses CRF16/slow; both use PNG capture, H.264/yuv420p and AAC192k when present. All original public files are checksummed. The complete source tree (excluding dependencies, Git, caches and environment files), bundle, score/review, native-resolution reading/transition frames, thumbnail and decode/dimension/duration/audio checks are delivered alongside MP4. External local imports are rejected during bundling: keep the project self-contained.

Preflight bundles and captures frame zero before creating output. It validates imports, composition ID, score bounds and assets encountered by capture. Later-only media must be loaded/awaited by its component; arbitrary user code cannot be statically proven correct. Use `loadFont` and Remotion media primitives, and inspect the full moving output. `requires.audio` rejects a silent export; `requires.htmlInCanvas` declares browser requirements. Optical helpers also explicitly check capability. Rendering reports record the actual WebGL renderer/browser. Preview uses the pinned rendering browser, so the resulting MP4 can play in an ordinary browser.

Version-1 JSON remains supported without migration. The new code path allows normal React composition instead of adding more fixed scene kinds. Raw HTML/CSS/SVG lives inside JSX; this release does not record standalone interactive HTML websites.
