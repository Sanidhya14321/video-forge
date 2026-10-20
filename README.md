# Video Forge

[![Checks](https://github.com/Sanidhya14321/video-forge/actions/workflows/check.yml/badge.svg)](https://github.com/Sanidhya14321/video-forge/actions/workflows/check.yml) [![Release](https://img.shields.io/github/v/release/Sanidhya14321/video-forge)](https://github.com/Sanidhya14321/video-forge/releases/latest) [![License: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)

**Direct the film before selecting an effect.** Video Forge is a reusable creative skill library for taste, asset casting, shot design, cinematography, editing and short-form delivery, with local Remotion/Three.js/FFmpeg tools. It now includes source-backed creative playbooks, individually loadable shot recipes and genuine 3D camera paths. Use it from Claude Code, Codex or a compatible local agent; use the Claude custom-skill or ChatGPT companion for their respective surfaces.

## Creative direction, then execution

For new work, the director develops a visual argument and casts the right assets before choosing templates. Conditional references cover [taste and critique](skills/video-forge/references/taste.md), [cinematography](skills/video-motion/references/cinematography.md), [asset selection](skills/video-generation/references/asset-direction.md), [generated-shot continuity](skills/video-generation/references/generation-direction.md), [editing grammar](skills/video-editing/references/editorial.md), [Premiere Pro](skills/video-editing/references/premiere.md) and [Instagram / Shorts / X](skills/video-forge/references/platforms.md).

[Research and decisions](sources/CREATIVE-RESEARCH.md): 11 freshly inspected repositories, 45 pinned source files and 14 primary documentation/asset-license pages. The plugin synthesizes mechanisms and original recipes; it does not blindly import upstream policies, code licenses or bundled media.

### Camera and asset study

[![3D camera study](demos/camera-study/thumbnail.png)](https://github.com/Sanidhya14321/video-forge/releases/download/v0.6.0/video-forge-camera-study-0.6.0.mp4)

A 12-second native 3D study: world-space traversal, an assembly arc and a GLB detail-to-hero reveal. Original assets/music, 1080×1920. [Production and scope](demos/camera-study/PRODUCTION.md). This exercises the camera/asset foundation; it is not a photoreal generated-video or independent taste benchmark.

The original two visual vocabulary studies remain available:

| Minimal | Creative Arcade |
|---|---|
| [![Minimal reel](demos/reel-showcase/thumbnail.png)](https://github.com/Sanidhya14321/video-forge/releases/download/v0.3.0/video-forge-reel-0.3.0.mp4) | [![Color reel](demos/pop-showcase/thumbnail.png)](https://github.com/Sanidhya14321/video-forge/releases/download/v0.3.0/video-forge-color-pop-0.3.0.mp4) |
| Monochrome abstract motion · 20 shots | Flat color, original characters and comic effects · 22 shots |

Both are 30 seconds, with original synthesized music, local AI voice and measured captions. [Watch side by side](https://github.com/Sanidhya14321/video-forge/releases/download/v0.3.0/video-forge-style-comparison-0.3.0.mp4). These demonstrate creative range; scripts, timing and music differ, so they are not a controlled performance benchmark.

## Choose your host

| Host | Install / use |
|---|---|
| **Codex CLI / desktop** | Commands below; nine skills plus setup and local rendering |
| **Claude Code** | Commands below; `/video-forge:video-forge` |
| **Claude chat / Cowork** | Upload the `claude-skill` archive as a custom skill; rendering depends on its runtime |
| **ChatGPT Work, local execution** | Codex/OpenAI package; run the setup skill in a local-capable session |
| **ChatGPT chat** | `chatgpt` companion: focused instructions/reference files for planning, code and a local render handoff |
| **Other Agent Skills hosts** | `standalone` archive with root `SKILL.md` and bundled resources |

[Installation and updates](docs/installation.md) · [Compatibility and verification](docs/compatibility.md) · [Download release packages](https://github.com/Sanidhya14321/video-forge/releases/latest)

### Codex

```bash
codex plugin marketplace add Sanidhya14321/video-forge --ref v0.6.0
codex plugin add video-forge@video-forge-local
```

Start a new turn/session, select Video Forge or use `$video-forge`. Run `$video-forge-setup` to prepare the local runtime. Adding a marketplace alone does not install the plugin.

### Claude Code

```bash
claude plugin marketplace add Sanidhya14321/video-forge
claude plugin install video-forge@video-forge
```

Use `/video-forge:video-forge` and `/video-forge:video-forge-setup`. For local development: `claude --plugin-dir /absolute/video-forge`.

### Try a brief

> Use Video Forge to develop a 25-second launch film for Instagram from my actual product assets. Explore distinct visual directions, choose one, and show a useful result. Use a motivated 3D camera reveal where it helps, readable product proof, deliberate sound and editable sources. Respect my brand constraints.

> Edit this recording into a complete, fast-moving YouTube Short. Choose the story from actual footage, preserve its meaning, use relevant B-roll and measured captions, and prepare an X version with a readable feed composition.

The skill chooses a visual language and uses relevant modules. It does not load the complete 100-source catalog for every request. Without an executable environment it delivers the production plan and job; it never labels an unrendered plan as an MP4.

## Local quick start

Node 22+ (Node 24 tested), npm, and first-use network access for pinned dependencies/browser. In the installed or extracted toolkit directory:

```bash
npm ci
npm run setup:binaries
npm run build
node dist/cli.js doctor
node dist/cli.js ideas list
node dist/cli.js ideas macro-to-context
node dist/cli.js review examples/camera-traversal.json
node dist/cli.js preview examples/camera-traversal.json --out /absolute/new/preview
node dist/cli.js run examples/camera-traversal.json --out /absolute/new/film
```

The examples include prepared narration/music, so optional Python speech models are unnecessary for these renders. User media paths resolve from the project JSON; output folders must be new. [Runtime/Python details](docs/installation.md#prepare-the-local-runtime).

## Capabilities

- **Three complete production workflows:** screenshot product demos, supplied-state algorithm explainers and captioned footage repurposing; plus native short-form reels.
- **Genuine 3D worlds:** camera position/target/FOV/roll keys, object transform keys, lit geometry, local image planes and self-contained static GLB assets. Path previews include key/midpoint samples. No CSS tilt is presented as a 3D reconstruction.
- **Creative library:** 12 load-on-demand recipes, asset-source/procedural indexes, reference breakdown and shot-level critique, with dated provenance.
- **Premiere Pro playbook:** Text-Based Editing, J/L cuts, retiming, Auto Reframe, color/audio finishing and concrete editor handoffs. Adobe application control is not bundled.
- **Twelve motion families, two treatments:** abstract minimal or colorful comic/character choreography; kinetic type, fragments, connections, reframing, cuts, code, data and more. Flat surfaces by default.
- **Brand-led overlays:** actual website/logo evidence, browser focus, illustrative cursors, call routing, animated steps and CTAs; source attribution and prepared-footage previews.
- **Editing/audio/captions:** explicit segment edits, optional threshold silence removal, local voice/transcription, music mixing, measured word highlighting and SRT. Silence detection does not perform semantic footage selection by itself.
- **Editable delivery:** project and renderer snapshots, staged assets/credits, transcripts, captions, thumbnails, MP4 presets and full-stream decoding checks.
- **Optional providers:** local Kokoro/faster-whisper and budget-gated OpenAI speech/fal adapters. Cloud transport tests are mocked; live paid services remain separately verified.
- **CLI:** `doctor`, `ideas list|<id>`, `scout`, `review`, `preview`, `run`, `inspect`. [Project format](docs/project-format.md) · [Creative direction](skills/video-forge/references/taste.md).

The [100-entry register](sources/INDEX.md) preserves coverage, revisions, attribution and unresolved names. It is **not 100 installed engines**. HyperFrames, Manim, avatar/pro-editor and publishing integrations remain reference guidance. [Audit](sources/AUDIT.md) · [Validation](docs/validation.md).

## Release packages

| Asset | Purpose |
|---|---|
| `codex` / `claude` | Native plugin manifests, nine shared skills, runtime and prepared example inputs |
| `claude-skill` | A self-contained root skill for Claude upload |
| `standalone` | Portable root skill for other compatible agents |
| `chatgpt` | Small planning/reference/handoff companion; no renderer |
| `source` | Full repository source and saved demo outputs |
| Demo MP4s / comparison ZIP | Watch or compare the finished films independently |

Install archives omit generated demo folders and installed dependencies. The source archive preserves them as saved artifacts (excluding generated browser bundles/dependency caches). Every release includes SHA-256 checksums and a machine-readable asset manifest. [Release procedure](docs/releasing.md) · [Changelog](CHANGELOG.md).

## Contribute and trust

Run `npm ci`, `npm run setup:binaries`, `npm run check` and `npm run build`. CI validates Linux/macOS, both motion vocabularies, native overlays/3D, packaged resources and host adapters. [Development](docs/development.md) · [Contributing](CONTRIBUTING.md) · [Report a vulnerability](SECURITY.md).

Code is MIT; Remotion, model weights and assets retain their own terms. [Notices and asset attribution](NOTICE.md). Local production needs no account, credentials, hooks or hosted service. Paid providers are opt-in; publishing is a separately authorized action. GitHub distribution does not imply submission to a public plugin directory.
