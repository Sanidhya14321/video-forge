# Video Forge

[![Checks](https://github.com/Sanidhya14321/video-forge/actions/workflows/check.yml/badge.svg)](https://github.com/Sanidhya14321/video-forge/actions/workflows/check.yml) [![Release](https://img.shields.io/github/v/release/Sanidhya14321/video-forge)](https://github.com/Sanidhya14321/video-forge/releases/latest) [![License: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)

**Turn a brief or recording into an editable video.** A compact directing skill coordinates planning, motion, editing, captions, audio, generation and delivery, backed by local Remotion/FFmpeg execution. Use it from Claude Code, Codex or a compatible local agent; use the Claude custom-skill or ChatGPT companion for their respective surfaces.

One shared toolkit, two different visual directions:

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
codex plugin marketplace add Sanidhya14321/video-forge --ref v0.5.0
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

> Use Video Forge to make a 30-second launch reel about my project. Explain the problem, show its actual features, and finish with one clear action. Bold flat colors, no gradients, playful character motion, original sound effects and timed captions. Preserve editable sources.

The skill chooses a visual language and uses relevant modules. It does not load the complete 100-source catalog for every request. Without an executable environment it delivers the production plan and job; it never labels an unrendered plan as an MP4.

## Local quick start

Node 22+ (Node 24 tested), npm, and first-use network access for pinned dependencies/browser. In the installed or extracted toolkit directory:

```bash
npm ci
npm run setup:binaries
npm run build
node dist/cli.js doctor
node dist/cli.js review examples/pop-showcase.json
node dist/cli.js preview examples/pop-showcase.json --out /absolute/new/preview
node dist/cli.js run examples/pop-showcase.json --out /absolute/new/film
```

The examples include prepared narration/music, so optional Python speech models are unnecessary for these renders. User media paths resolve from the project JSON; output folders must be new. [Runtime/Python details](docs/installation.md#prepare-the-local-runtime).

## Capabilities

- **Three complete production workflows:** screenshot product demos, supplied-state algorithm explainers and captioned footage repurposing; plus native short-form reels.
- **Twelve motion families, two treatments:** abstract minimal or colorful comic/character choreography; kinetic type, fragments, connections, reframing, cuts, code, data and more. Flat surfaces by default.
- **Brand-led overlays:** actual website/logo evidence, browser focus, illustrative cursors, call routing, animated steps and CTAs; source attribution and prepared-footage previews.
- **Editing/audio/captions:** explicit segment edits, optional threshold silence removal, local voice/transcription, music mixing, measured word highlighting and SRT. Silence detection does not perform semantic footage selection by itself.
- **Editable delivery:** project and renderer snapshots, staged assets/credits, transcripts, captions, thumbnails, MP4 presets and full-stream decoding checks.
- **Optional providers:** local Kokoro/faster-whisper and budget-gated OpenAI speech/fal adapters. Cloud transport tests are mocked; live paid services remain separately verified.
- **CLI:** `doctor`, `review`, `preview`, `run`, `inspect`. [Project format](docs/project-format.md) · [Creative direction](skills/video-forge/references/reels.md).

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

Run `npm ci`, `npm run setup:binaries`, `npm run check` and `npm run build`. CI validates Linux/macOS, both motion vocabularies, packaged resources and host adapters. [Development](docs/development.md) · [Contributing](CONTRIBUTING.md) · [Report a vulnerability](SECURITY.md).

Code is MIT; Remotion, model weights and assets retain their own terms. [Notices and asset attribution](NOTICE.md). Local production needs no account, credentials, hooks or hosted service. Paid providers are opt-in; publishing is a separately authorized action. GitHub distribution does not imply submission to a public plugin directory.
