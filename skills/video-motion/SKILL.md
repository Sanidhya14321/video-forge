---
name: video-motion
description: "Create editable Remotion product demos, abstract social reels, kinetic typography, code, data, and technical explainers."
---

# Video Motion

Use Remotion for the first-party renderer. Read [motion workflows](references/workflows.md) before choosing templates or writing custom React scenes. Inspect real screenshots and data rather than recreating product details from guesses.

For fast/abstract social work, read [reel direction](../video-forge/references/reels.md). Use its semantic motion mapping, not a heading-card default. The native reel treatments are implemented in `renderer/Reel.tsx` (minimal) and `renderer/PopReel.tsx` (colorful character/comic motion); `src/reel-layout.ts` owns frame/beat math and protected content bounds.

For real-brand footage or product evidence, read [brand-led editing](../video-forge/references/brand-edits.md). Native `overlays` add animated logos, screenshot/browser inserts, screenshot-aligned pointers, call diagrams, steps and CTAs above footage. Keep captured UI distinct from illustrative motion.

The [project contract](../../docs/project-format.md) supports title, image, video, code, chart, algorithm, and structured reel scenes. `algorithm` visualizes supplied array states; the agent computes and verifies the actual algorithm trace. It is not a generic algorithm solver. Large code excerpts should become multiple scenes.

Drive animation from Remotion frame time. Use fixed assets, stable seeds, and frame-based interpolation. Preserve exact data values and compare rendered labels against input data. Recompose each aspect ratio instead of assuming a center crop is readable.

Run `review` and `preview` through the plugin CLI to inspect creative warnings and entry/peak/exit stills before expensive exports. Use `video-forge run` through the plugin CLI to render built-in scenes. For custom React components, edit `renderer/Root.tsx` in a project copy, build, and render. Check frames at entry, peak content, transitions, and the final state. Read the reference section for optional Manim and HyperFrames integrations; they are separate engines.
