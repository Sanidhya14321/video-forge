# Video Forge

An agent-directed video toolkit for technical creators. One portable skill collection consolidates the techniques in a 100-entry video-skills report into focused workflows, with an executable Remotion/FFmpeg core.

**v0.1.0:** product demos, array-based algorithm explainers, and captioned footage repurposing. The agent prepares the story and edit decisions; the CLI renders the explicit job. No account or paid API is needed for the local examples.

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
- A TypeScript CLI: `doctor`, `run`, and `inspect`; schema validation and dry runs.
- Original React scenes for titles, screenshots, video inserts, code, nonnegative bar charts, and supplied algorithm array states.
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

The renderer source is in `renderer/Root.tsx`. Edit a project copy for custom components. A completed run retains `composition.tsx`, render props, schema types, and a browser composition bundle as an editable/re-renderable snapshot. Detailed instructions are in [the development guide](docs/development.md).

No website is hosted, repository pushed, plugin installed into user settings, or social post published by the included tools.
