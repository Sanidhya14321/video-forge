# Video Forge

An agent-directed video toolkit for technical creators. One portable skill collection consolidates the techniques in a 100-entry video-skills report into focused workflows, with an executable Remotion/FFmpeg core.

**v0.3.0:** flat-color creative arcade and minimal motion treatments, fast abstract reels, kinetic typography, product demos, array-based algorithm explainers, and captioned footage repurposing. The agent prepares the story and edit decisions; the CLI renders the explicit job. No account or paid API is needed for the local examples.

## Install in Claude or Codex

```bash
claude plugin install video-forge --marketplace Sanidhya14321/video-forge
codex plugin marketplace add Sanidhya14321/video-forge
```

In Codex, install Video Forge from that source in the Plugins Directory after registration. Invoke `/video-forge:video-forge` in Claude, or use the standalone `$video-forge` skill in a compatible agent. Prepare the runtime with `npm ci && npm run setup:binaries && npm run build` in the installed toolkit directory. [Full setup](docs/installation.md).

[![Video Forge reel demo](demos/reel-showcase/thumbnail.png)](https://github.com/Sanidhya14321/video-forge/releases/download/v0.2.0/video-forge-reel-0.2.0.mp4)

[Watch the minimal reel demo](https://github.com/Sanidhya14321/video-forge/releases/download/v0.2.0/video-forge-reel-0.2.0.mp4)

## Same toolkit, contrasting styles

[![Creative Arcade — color-pop reel](demos/pop-showcase/thumbnail.png)](https://github.com/Sanidhya14321/video-forge/releases/download/v0.3.0/video-forge-color-pop-0.3.0.mp4)

[Watch color-pop](https://github.com/Sanidhya14321/video-forge/releases/download/v0.3.0/video-forge-color-pop-0.3.0.mp4) · [Watch side by side](https://github.com/Sanidhya14321/video-forge/releases/download/v0.3.0/video-forge-style-comparison-0.3.0.mp4)

Creative Arcade is a new 30-second, 22-shot film with original flat vector characters, chunky comic typography, clapperboard assembly, gear locks, skateboarding, scissors, pumping boomboxes, particles, scene-aligned sound effects, stereo music and measured captions. No gradients or paid generation are used. The 12 native presets now each support a separate `pop` choreography alongside the original `minimal` style. This is a creative range demonstration; script, music and shot timing differ, so it is not a controlled performance experiment.

```bash
node dist/cli.js review examples/pop-showcase.json
node dist/cli.js preview examples/pop-showcase.json --out /tmp/video-forge-pop-preview
node dist/cli.js run examples/pop-showcase.json --out /tmp/video-forge-pop
```

The examples include prepared speech/music assets; optional Python models are needed only to regenerate them. [Production and skill-use record](demos/pop-showcase/PRODUCTION.md).

## Fast reel preview

```bash
npm ci
npm run setup:binaries
npm run build
node dist/cli.js review examples/reel-showcase.json
node dist/cli.js preview examples/reel-showcase.json --out /tmp/video-forge-reel-preview
node dist/cli.js run examples/reel-showcase.json --out /tmp/video-forge-reel
```

The showcase is a complete 30-second, 20-shot, 1080×1920 monochrome production with an original 160 BPM score, local AI narration and measured captions. Twelve frame-driven treatments include fragments, orbits, signals, ribbons, crop transforms, timeline cuts, waveform motion, code, data, kinetic words and radial forms. Preview creates entry/peak/exit stills before a full render. The included audio means the showcase does not require installing speech models to render.

The directing skill selects a visual language and maps ideas to physical transformations instead of treating every video as a deck of UI cards. It preserves explicit user choices such as minimal colors and no gradients. [Creative direction](skills/video-forge/references/reels.md) and [evaluation limits](docs/reel-evaluation.md) explain what is improved and what remains unmeasured.

Download versioned Claude, Codex, standalone and source archives from [GitHub Releases](https://github.com/Sanidhya14321/video-forge/releases). [Installation](docs/installation.md) covers both agent hosts. This GitHub distribution is not a public plugin-directory submission.

## Quick start

```bash
npm ci
npm run build
node dist/cli.js doctor
node dist/cli.js run examples/product-demo.json
node dist/cli.js inspect /absolute/path/to/output/landscape.mp4
```

For local narration and transcription:

```bash
uv sync --project python --python 3.11 --locked
node dist/cli.js run examples/algorithm-explainer.json
```

See [installation](docs/installation.md), [the project format](docs/project-format.md), and [validation results](docs/validation.md). The demonstration footage is synthetic: it is the algorithm example reused as a source recording, with measured local speech timestamps and explicit cuts.

## What's included

- A compact [directing skill](skills/video-forge/SKILL.md) and seven focused production skills.
- A TypeScript CLI: `doctor`, `run`, `inspect`, `review`, and `preview`; schema validation and dry runs.
- Twelve original abstract/typographic reel treatments plus React scenes for titles, screenshots, video inserts, code, nonnegative bar charts, and supplied algorithm array states.
- Ordered footage cuts, optional threshold-based silence removal, source-to-output word-time remapping, word-highlight captions, and SRT.
- Optional local Kokoro voice and faster-whisper transcription in a locked CPU environment.
- Optional OpenAI speech and fal queue adapters, tested with mocks. Live cloud execution is not verified in this delivery.
- Four aspect-ratio presets, thumbnails, editable production material, asset provenance, and full-stream technical validation.
- A [100-entry source register](sources/INDEX.md) with revisions, evidence hashes, disposition, mapping, and explicit unresolved entries.

## Coverage is explicit

The register distinguishes implemented/tested scoped behavior, reference guidance, and unverified/unavailable names. Source inspection can be exact-skill, package-skills, or README-only; these are not interchangeable. No unresolved entry is silently omitted. Read [the audit report](sources/AUDIT.md) for counts and methodology.

HyperFrames, Manim, avatars, professional editor integrations, advanced image transforms, and social publishing have reference workflows. They are not native execution backends in this release. Remotion is an independent dependency with its own [license](https://www.remotion.dev/docs/license); the MIT license on this repository does not change it.

## Development and packaging

```bash
npm run check
npm run examples
npm run package
```

The examples command creates `demos/` and requires the local Python models. Move or remove an earlier generated `demos/` before rerunning; output directories are never overwritten. Releases contain the runtime source, compiled CLI, lockfiles, instructions, references, and examples, excluding installed dependencies and model caches. `npm run package` writes Claude, Codex, standalone, and source archives beside this directory.

The renderer source is in `renderer/Root.tsx`, `renderer/Reel.tsx` and `renderer/PopReel.tsx`. Edit a project copy for custom components. A completed run retains `composition.tsx`, render props, schema types, and a browser composition bundle as an editable/re-renderable snapshot. Detailed instructions are in [the development guide](docs/development.md).

The included production tools do not install themselves into personal agent settings or publish social posts. Repository releases distribute the toolkit; publishing a video remains a separate action.
