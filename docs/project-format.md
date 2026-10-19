# Project format, version 1

The agent writes an explicit JSON production plan. The CLI validates and executes it; it does not perform LLM scriptwriting or semantic editing internally. Paths resolve relative to the project JSON, never relative to the plugin installation.

`src/schema.ts` is the authoritative runtime contract. `docs/project.schema.json` is the generated JSON Schema for editors. Unknown fields are rejected. Examples are executable jobs.

```json
{
  "version": 1,
  "name": "my-demo",
  "workflow": "product-demo",
  "renderer": "remotion",
  "fps": 30,
  "scenes": [
    {"kind": "title", "duration": 3, "title": "A concrete promise", "body": "One useful explanation."},
    {"kind": "image", "duration": 4, "title": "Evidence", "src": "assets/screenshot.png"},
    {"kind": "code", "duration": 3, "title": "Try it", "code": "npm run build"}
  ],
  "exports": [{"preset": "landscape"}, {"preset": "vertical"}]
}
```

## Scene and theme inputs

`workflow`: `product-demo`, `algorithm-explainer`, or `footage-repurpose`. Product and algorithm jobs require scenes. Footage jobs use `footage` instead. All use Remotion for the final composition.

A scene has `kind`, `duration` in seconds, and an optional title (up to 100 characters), body (350), or note (200). `code` requires `code` text. `image` and `video` require a local `src`. `chart` and `algorithm` require `values`: one to twelve nonnegative finite numbers. Optional labels must match that array's length. `highlight` contains zero-based indices. These scenes show supplied data; they do not compute algorithms or render arbitrary graph structures. The example trace is computed in the project.

FPS may be 24, 30, or 60. Each scene duration rounds independently to frames. A title/body is a layout input, not a promise that any maximum-length string will fit; visually review the chosen aspect ratio. Split long text across scenes.

`theme` supports six-digit hex `background`, `foreground`, `accent`, `muted` colors and a local CSS font stack. Defaults use a dark navy background, light text, and mint accents. Optional `brand` and `tagline` add a footer; both are empty by default, so ordinary exports have no toolkit watermark. A scene may set an optional `eyebrow` label. No remote font is fetched.

## Footage and captions

```json
{
  "version": 1, "name": "my-clip", "workflow": "footage-repurpose",
  "footage": {
    "src": "recording.mp4",
    "segments": [{"start": 8.2, "end": 17.8}, {"start": 30.1, "end": 40.2}],
    "removeSilence": false, "silenceDb": -35, "silenceSeconds": 0.6,
    "crop": "contain"
  },
  "captions": {"transcript": "words.json", "maxWords": 5},
  "exports": [{"preset": "vertical"}]
}
```

Segments are source-relative seconds and play in listed order. Overlap/repetition is permitted for intentional replays. Without segments, the full recording is selected. With `removeSilence`, selected ranges are intersected with audible intervals; meaningful pauses may need restoring by editing the job. Center cropping with `cover` does not track faces.

`captions` requires exactly one of:

- `words`: an array of `{text, start, end}` with times in seconds.
- `transcript`: local JSON containing that array, or `{ "words": [...] }`.
- `transcribe: true`: local faster-whisper recognition; optional `language` (default `en`) and `model` (`base` default; tiny/small/medium/large-v3/turbo also accepted).

Word end must follow start, starts must be ordered, and output timing must fit the video. Original-audio footage jobs expect source-time supplied captions, which are remapped after cuts. With replacement narration, supplied captions describe that narration timeline. Automatic transcription always runs on the final selected audio.

`maxWords` is 1–8 (default 5). It controls phrase grouping along with a character heuristic. Long identifiers or non-Latin writing still require visual review. Transcript output is JSON with output-time words; SRT uses individual word cues to preserve timing. Sentence grouping, translation, bilingual layouts, and ASS export are reference workflows, not implicit features.

## Audio

`narration.provider` defaults to `none`. Use `file` plus `src` for approved local audio. Use `kokoro` plus `text` and a suitable voice (`af_heart` default) for local synthesis. Use `openai` plus `text`, a built-in voice, and an explicitly verified `rateUsdPerMillionCharacters` for paid speech. Supported budgeted models are `tts-1` (default) and `tts-1-hd`; token-priced speech models need a different estimator and are rejected.

The runner will not stretch speech to fit. It rejects narration longer than the planned video. Shorter narration leaves the remaining scene time intact. Add a generated-voice disclosure to publication copy.

`music: {"src": "music.wav", "volume": 0.12}` adds a looping local bed. When captions align with narration, music attenuates to 55% of that volume during word intervals. Generated narration receives a measured two-pass FFmpeg loudness normalization targeting -16 LUFS and -1.5 dBTP before mixing. Supplied audio is preserved. The final combined mix still needs review; no denoising is applied automatically.

## Optional paid generation

```json
{
  "cloud": {"enabled": true, "maxUsd": 0.5, "reservedUsd": 0},
  "generation": [{
    "id": "broll", "provider": "fal",
    "endpoint": "fal-ai/your-verified-endpoint",
    "input": {"prompt": "Use the endpoint's current documented schema"},
    "resultType": "video", "maxCostUsd": 0.3
  }]
}
```

This fragment must be included in a complete project. It is a schema example, not a valid model selection. Verify an endpoint's exact input, pricing, duration, and response shape before enabling it. Reference results with `src: "generated:broll"`. The adapter handles `images[0].url` or `video.url` results and does not upload local reference files. Use environment variables `FAL_KEY` and `OPENAI_API_KEY`.

`maxUsd` limits client reservations for this run, including failed/ambiguous requests. OpenAI character estimates include 10% slack. fal uses the declared per-request maximum, which the provider does not enforce. Actual provider billing can differ; use account-side provider spending limits for a hard billing cap. Reservations do not span processes automatically. A new output directory creates a new run; carry unresolved known commitments into `reservedUsd` before intentionally retrying elsewhere. There are no automatic paid retries or provider fallbacks. `spending.json` retains request IDs so existing jobs can be investigated.

## Exports, assets, and outputs

Presets: `landscape` 1920x1080, `vertical` 1080x1920, `square` 1080x1080, `portrait` 1080x1350. Optional paired `width` and `height` allow even preview dimensions of 240–3840 pixels. Presets must be unique in one job.

The output directory must not exist. A failed run is preserved for diagnosis; choose a new directory for another attempt. Assets are copied to content-hashed filenames. The source project records original paths; `render-props.json` points to staged assets used by the bundled composition.

Provide optional asset credits as `assets: [{"path":"asset.png", "origin":"source URL or original work", "license":"license identifier or terms", "credit":"credit line"}]`. Unspecified user assets stay labeled unspecified. No ownership is inferred.

A successful run retains the job, storyboard, assets and manifest, composition source and bundle, render props, JSON transcript, SRT, thumbnail, MP4 variants, `quality.json`, edit decisions where relevant, and a publishing draft. Technical checks decode the full stream but cannot establish editorial quality or caption accuracy.

## Short-form reels

v0.2.0 adds `workflow: "short-form-reel"` and an explicit `reel: {"bpm":160,"safeArea":"reels"}`. Existing version-1 jobs remain accepted. `theme.surface` is now `flat` by default; `ambient` opts ordinary scenes into the older radial background. Reel scenes always use flat surfaces.

```json
{
  "version": 1,
  "name": "reel",
  "workflow": "short-form-reel",
  "reel": {"bpm":160,"safeArea":"reels"},
  "theme": {"background":"#111111","foreground":"#f4f4ef","accent":"#f4f4ef","muted":"#85857f"},
  "scenes": [
    {"kind":"reel","duration":1.5,"title":"ONE\nIDEA.","motion":{"preset":"fragment-merge","seed":17}},
    {"kind":"reel","duration":1.5,"title":"IN\nMOTION.","motion":{"preset":"ribbon","invert":true}}
  ],
  "exports":[{"preset":"vertical"}]
}
```

A `reel` scene requires `motion`. Its `preset` is one of `type-impact`, `fragment-merge`, `orbit-lock`, `signal-flow`, `ribbon`, `frame-morph`, `timeline-cut`, `waveform`, `code-scan`, `data-sculpt`, `word-pulse`, or `radial-burst`. `code-scan` requires `code`; `data-sculpt` requires nonnegative `values`. Word-pulse uses optional `labels`. These are actual renderer treatments; the abstract waveform is illustrative motion, not an audio spectrum measurement.

Optional `motion` inputs: `seed` (0–99999 integer, default 7), `density` (3–16, default 8), `invert` (default false), `entrance` (`cut`, `push`, or `scale`; default cut). A two-line title uses a literal newline; short body copy is optional. Beat phase derives from the local frame number, FPS and BPM. Scene durations remain explicit seconds rounded to frames. At 160 BPM, four beats occupy 1.5s; twenty such scenes occupy exactly 900 frames at 30fps.

The `reels` layout preset protects a conservative central content band in vertical output: 14% at the top, 35% at the bottom, 8% at the left and 12% at the right. These are project margins, not guaranteed dimensions for every current app interface. `clean` uses a larger content area for ordinary viewing. Other aspect ratios recompose inside their own bounds. Headline length, caption grouping and proof readability still require actual visual review.

```bash
node dist/cli.js review examples/reel-showcase.json
node dist/cli.js preview examples/reel-showcase.json --out /new/storyboard-folder
node dist/cli.js run examples/reel-showcase.json --dry-run
node dist/cli.js run examples/reel-showcase.json --out /new/render-folder
```

`review` needs no browser or external requests. It reports exact scene-frame ranges, expected duration, treatment variety, protected bounds and advisory warnings for slow openings, repeated treatments, excessive title cards and dense code. It does not measure retention or rank creative quality. Footage duration is unknown until probed/edited and is reported as null.

`preview` supports scene-based jobs. It stages only referenced local scene media and renders entry, peak and exit stills for every target at up to 540px width. It never calls cloud generation, narration or automatic transcription. Supplied inline/file word timings appear in the previews; automatic captions need a completed run. It preserves a portable renderer snapshot and `preview.json`. The output directory must be new. Full runs additionally retain `creative-review.json`.

### Pop motion (v0.3.0)

`motion.style` selects `minimal` (default, backward compatible) or `pop`. Pop is a separate flat-color illustration/choreography treatment of all twelve presets. `motion.palette` accepts 3–8 six-digit hex colors: background first, then accent colors. Omission uses the theme plus built-in pop accents. `motion.energy` accepts 1–3 (default 2), controlling impact amplitude and seeded confetti count together with density. `invert` uses cream as the background in pop; supplied accents remain intact. `reel.captionStyle` accepts `standard` (default) or `pop`.

```json
{"kind":"reel","duration":1.5,"title":"MAKE\nIT MOVE.","motion":{"preset":"ribbon","style":"pop","palette":["#5046ef","#ff8c32","#e5ff3d","#ff558e"],"energy":3,"density":12,"seed":91}}
```

The pop waveform/boombox is illustrative, not an audio analysis. Score and sound effects in the showcase are synthesized locally and are not automatic effects added by the scene renderer. For fractional beat durations, round cumulative beat boundaries to frames and subtract adjacent boundaries before converting to seconds. `examples/pop-showcase.json` demonstrates this at 160 BPM with 22 scenes and exactly 900 frames.


### Full-frame footage and editorial punch-ins (v0.4.0)

`footage.layout` is `framed` by default, preserving the prior padded recording layout. `full-frame` fills the export canvas; use `crop: cover` for a vertical talking-head reel and review the crop. Optional `punchIns` contains `{start,end,scale}` windows on the **final edited timeline**, with scale 1–1.35 and 0.18-second eased edges (short windows use shorter ramps). The transform centers at 50% across / 30% down to favor a portrait speaker. It does not track a face. Overlapping windows use the largest active scale; windows must fit the output duration. The source recording is preserved.

Multiple input recordings can be normalized/concatenated in the approved source order with FFmpeg before the footage job; preserve original filenames and the input-to-output cut map. The native runner's `footage.src` still refers to one prepared source. Do not imply that the CLI selects source order or transcribes brand spellings perfectly.


## Production overlays (v0.5.0)

`overlays` is an optional array (default empty) on the final output timeline. Each overlay has `kind`, `start`, `end`, `title`, optional `body`, `eyebrow`, local `src`/`logo`, and `layout` (`full`, `lower-third`, `top`). Native kinds are `brand`, `call`, `browser`, `steps`, `cta`, and `label`. `brand` requires a logo, `browser` a screenshot, and `steps` 2–4 labels. Timing must fit the output; ends are exclusive. Ordered overlaps are intentional layers, with captions above them.

`browser` supports `aspectRatio` (actual source width/height; default 16/9), `fit` (`contain` or `cover`), optional `focus: {x,y,scale}`, and `cursor: {x,y,clickAt}`. Coordinates are normalized to the original screenshot, including cropped/letterboxed geometry; clickAt is local seconds. Cursor travel and ripples are illustrative highlights over a captured image, not real UI execution. Runtime rendering uses staged local assets only.

`offsetY` is an optional -400..400 pixel adjustment measured at 1080px width and scaled with the export. Use it to avoid the actual speaker/evidence; it does not detect faces. `reel.captionStyle: brand` uses the theme accent for active words and the caption border. Caption layout remains protected and layers above overlays.

```json
{"kind":"browser","start":6.5,"end":9.5,"title":"SEE THE PRODUCT.","src":"assets/site.png","logo":"assets/logo.png","body":"Official website reference","aspectRatio":1.77778,"fit":"cover","focus":{"x":0.5,"y":0.3,"scale":1.2},"cursor":{"x":0.6,"y":0.4,"clickAt":1}}
```

`review` lists the overlay timeline and flags very short screenshot holds. `preview` renders every overlay's entry/peak/exit and can now inspect prepared footage without segments or silence removal. It still performs no cloud generation, narration or automatic transcription. For a cut footage plan, prepare/render the edit first; preview does not silently ignore edits. Native snapshots include `Overlays.tsx` and `overlay-timing.ts`. Reused local assets are staged once per source path with attribution.
