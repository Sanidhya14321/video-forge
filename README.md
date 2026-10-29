# Video Forge

[![Checks](https://github.com/Sanidhya14321/video-forge/actions/workflows/check.yml/badge.svg)](https://github.com/Sanidhya14321/video-forge/actions/workflows/check.yml) [![Release](https://img.shields.io/github/v/release/Sanidhya14321/video-forge)](https://github.com/Sanidhya14321/video-forge/releases/latest)

**Finished short-form video, authored directly in code with Claude Code or Codex.** Video Forge supplies visual knowledge, editable motion examples, assets, creative critique, and a local Remotion/FFmpeg renderer. Your agent writes React/TSX using HTML/CSS, SVG, Canvas, WebGL and video/audio layers. Everything stays editable.

## See the motion

https://github.com/user-attachments/assets/6390ce1e-12bd-4088-8257-62b150961c4a

A 24-second code-authored film: spatial typography, optical refraction, layered traversal, fast cuts, actual rendered evidence, local narration and measured captions. [Editable film project](https://github.com/Sanidhya14321/video-forge/tree/v0.7.0/examples/code-film) · [Production review](https://github.com/Sanidhya14321/video-forge/blob/v0.7.0/demos/code-film/PRODUCTION.md) · [Six motion studies](examples/motion-studies)

Video Forge teaches agents **how to choose and compose motion**, then lets them write the film. Each focused reference explains a mechanism, its timing and continuity, appropriate assets, failure cases and implementation boundaries. A moving preview helps judge the result before final export. There is no required heading-card layout or external editing application.

## Install

### Codex CLI / desktop

```bash
codex plugin marketplace add Sanidhya14321/video-forge --ref v0.7.1
codex plugin add video-forge@video-forge-local
```

Start a new turn/session and use `$video-forge`. Use `$video-forge-setup` to prepare the local runtime. An existing differently pinned marketplace must be removed and re-added to change its ref; see [installation and updates](docs/installation.md).

### Claude Code

```bash
claude plugin marketplace add Sanidhya14321/video-forge
claude plugin install video-forge@video-forge
```

Use `/video-forge:video-forge`. Local development: `claude --plugin-dir /absolute/video-forge`.

| Other host | Package / behavior |
|---|---|
| Claude custom-skill surface | `claude-skill` archive, with runtime-dependent rendering |
| ChatGPT Work with local execution | Codex/OpenAI runtime package |
| Ordinary ChatGPT | `chatgpt` companion for guidance, code and explicit local rendering handoff |
| Compatible Agent Skills host | `standalone` root skill plus resources |

Nine shared skills cover directing, setup, planning, motion, editing, captions, audio, generation and delivery. References load progressively. Host packaging does not grant an unavailable shell, browser, credentials or rendering service. [Compatibility](docs/compatibility.md)

## Make a film

Node22+ and npm; Node24 is tested. First use needs network access for locked dependencies and the rendering browser. Inside the extracted/installed toolkit:

```bash
npm ci
npm run setup:binaries
npm run build
node dist/cli.js doctor
node dist/cli.js init /absolute/my-film
node dist/cli.js review /absolute/my-film/project.json
node dist/cli.js preview /absolute/my-film/project.json --out /absolute/my-draft
node dist/cli.js run /absolute/my-film/project.json --dry-run
node dist/cli.js run /absolute/my-film/project.json --out /absolute/my-final
```

Edit the new project's `src/Film.tsx`, local assets and frame score. Its standalone package lock also supports ordinary Remotion authoring. The version-2 descriptor points to your composition; it does not limit you to a scene vocabulary. [Code-project contract](docs/code-projects.md)

> Use Video Forge to make a fast 24-second Instagram launch from my actual product assets. Combine spatial type, layered parallax, fluid glass and editorial bursts where they help the idea. Preserve readable proof, synchronize sound, watch the moving draft and refine it. Deliver the MP4 and editable code.

> Edit these clips in their supplied story order. Preserve complete thoughts, remove dead time, add relevant real UI evidence, kinetic inserts, measured captions and sound. Use my brand and prepare Reels, Shorts and X compositions.

## Motion and production toolkit

- **Fluid glass/refraction:** an original deterministic optical shader bends captured content; displacement passes support authored transitions. This is analytic distortion, not a physical fluid simulation.
- **Spatial traversal and parallax:** perspective layers made from text, screenshots, footage and graphics; shared camera paths and meaningful depth.
- **Kinetic type and continuity:** split text, scoped GSAP choreography, masks, shared-element handoffs, overlap and optical transitions.
- **Rapid editing:** frame-level accents and score events, footage/audio layers, reading windows and deliberate pacing contrast.
- **Finishing:** moving drafts, native-resolution critical frames, fractional-frame blur, explicit Canvas/WebGL resolution, CRF16 final exports and complete decoding checks.
- **Editable delivery:** full local source tree, dependency lock, score, public media, checksummed asset manifest and render reports. Captions/transcripts remain alongside sources.
- **Local/optional audio:** supplied narration or Kokoro, faster-whisper timing, original music/SFX and budget-gated OpenAI/fal adapters. Paid-provider tests are mocked unless separately identified as live.

Previous version-1 projects, native reel/pop scenes, diagrams, supplied-state algorithms, overlays and mesh worlds remain supported. [Legacy contract](docs/project-format.md) · [Older studies](https://github.com/Sanidhya14321/video-forge/blob/v0.7.0/demos/camera-study/PRODUCTION.md)

## Evidence and limits

[New motion research](sources/MOTION-RESEARCH.md) records inspected mechanisms, pinned revisions and licensing. The original [100-entry PDF register](sources/INDEX.md) preserves explicit dispositions; it does not represent100 installed engines. Media rights are separate from source-code licenses.

Technical checks establish playable media and reproducible frame sampling. Creative review examines continuity, rhythm, evidence, readability and finishing. Neither check predicts reach or retention. Supplied low-resolution footage retains its source-detail limits. [Validation](docs/validation.md) · [Independent trial](docs/agent-forward-test.md)

Release archives include Claude, Codex, standalone, Claude-skill, ChatGPT companion and full source packages with SHA256 manifests. Published demonstrations stay in their original releases. Installed dependencies/caches are excluded. Private user footage and its edit are never release assets. [Releases](https://github.com/Sanidhya14321/video-forge/releases) · [Changelog](CHANGELOG.md)

Code is MIT; dependencies, models, fonts and other assets retain their terms. [Notices](NOTICE.md). Run `npm run check` and `npm run build` to contribute. Long-form production and external-editor integrations are outside the0.7 focus.

Repository layout: reusable code and small fixtures are maintained here; [rendered productions](demos/README.md) remain in immutable releases. Example helpers and dependency locks are generated from canonical sources during build.
