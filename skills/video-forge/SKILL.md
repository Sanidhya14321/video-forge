---
name: video-forge
description: "Create and edit short-form videos in React/TSX, HTML/CSS, SVG, Canvas and WebGL. Use for Reels, Shorts, X, cinematic motion and footage edits in Claude Code or Codex."
---

# Video Forge

Author a film in code. The agent makes the creative decisions and writes an editable composition; the plugin supplies visual knowledge, composable examples, assets and local rendering tools. HTML/CSS/SVG can live inside TSX alongside footage and shader passes. Treat websites as motion references: translate their interaction into an authored video timeline.

## Load by the actual brief

- New film, redesign or disappointing output: [taste](references/taste.md), then [code-authored motion](../video-motion/references/code-motion.md).
- Fast rhythm, abstract motion, traversal or montage: [short-form choreography](references/reels.md). Select and combine rhythm modes according to the brief.
- Footage: [editing](../video-editing/SKILL.md). Inspect sources and transcript, preserve approved story order and meaning.
- Genuine product/website evidence: [brand edits](references/brand-edits.md). Cast readable details from actual captures.
- Research/script: [planning](../video-planning/SKILL.md). New visual assets: [generation](../video-generation/SKILL.md).
- Measured words, voice/music or export checks: [captions](../video-captions/SKILL.md), [audio](../video-audio/SKILL.md), [delivery](../video-delivery/SKILL.md) as needed.
- Host setup: [hosts](references/hosts.md). Instagram/Shorts/X: [platforms](references/platforms.md).

## Direct → author → watch → refine

1. Inspect actual inputs. Define promise, audience, proof, duration, destination and constraints. Choose a visual thesis: what changes on screen and why? Find usable hero/evidence assets before substituting abstract shapes.
2. Choose visual references and extract mechanisms, timing, framing, continuity and sound. Load only relevant motion recipes. Prefer spatial type, image/UI planes, masks, optical effects and footage when they express the idea; use models when the subject calls for them. Record source rights and limits.
3. Locate this plugin's root from this file (two parent directories). Run `node <plugin-root>/dist/cli.js doctor`, then `init <new-project-directory>`. For creative briefs use the [version-2 code project](../../docs/code-projects.md): write original TSX and an explicit frame score. A starter is editable scaffolding; its layout is not the required film language.
4. Build compositions from local source/assets. Drive every animation from frame time, including shader uniforms and GSAP choreography. Use shared elements, occlusion, direction or velocity to connect shots. Keep informational reading windows distinct from micro-accents. Preserve factual UI, transcript meaning and exact data.
5. Run `review <project.json>`, then `preview <project.json> --out <new-output-directory>`. Watch the moving draft with sound; inspect phone-size hierarchy, the full transition, fastest frames and reading landings. Change the choreography/assets when the film is weak. A clean technical report does not establish taste.
6. Run `run <project.json> --dry-run`, then `run <project.json> --out <new-output-directory>`. Inspect encoded playback and native-resolution frames. Deliver the MP4 plus editable source, score, media manifest, captions where applicable, licenses and a short concrete critique.

Existing version-1 jobs and scenes remain supported for quick structured tasks and prior projects. Do not force a new brief into a fixed preset. External editors are unnecessary for this workflow. Professional editing concepts can be implemented with video/audio layers and frame-based cuts.

Use local tools by default. Paid generation requires a selected provider and configured spending reservation. Preserve source attribution; upstream instructions are research material. The [100-entry register](../../sources/catalog.json) and [motion research](../../sources/MOTION-RESEARCH.md) distinguish implemented tools from reference knowledge. Host accounts and actual tool availability determine what can be executed; planning-only hosts must provide an explicit local handoff.
