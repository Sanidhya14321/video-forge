---
name: video-motion
description: "Create editable Remotion product demos, animated code panels, data charts, and algorithm explainers."
---

# Video Motion

Use Remotion for the first-party renderer. Read [motion workflows](references/workflows.md) before choosing templates or writing custom React scenes. Inspect real screenshots and data rather than recreating product details from guesses.

The [project contract](../../docs/project-format.md) supports title, image, video, code, chart, and algorithm scenes. `algorithm` visualizes supplied array states; the agent computes and verifies the actual algorithm trace. It is not a generic algorithm solver. Large code excerpts should become multiple scenes.

Drive animation from Remotion frame time. Use fixed assets, stable seeds, and frame-based interpolation. Preserve exact data values and compare rendered labels against input data. Recompose each aspect ratio instead of assuming a center crop is readable.

Use `video-forge run` through the plugin CLI to render built-in scenes. For custom React components, edit `renderer/Root.tsx` in a project copy, build, and render. Check frames at entry, peak content, transitions, and the final state. Read the reference section for optional Manim and HyperFrames integrations; they are separate engines.
