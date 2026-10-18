# Motion and renderer-specific rules

## Remotion
Author React composition state from `useCurrentFrame()` and `useVideoConfig()`. Use `Sequence` for local scene time. Round scene durations consistently to frames and keep all Remotion packages on exactly the same version. Avoid wall-clock animation, ambient randomness, and uncached remote assets during rendering.

Animate a focal object, then allow readable hold time. Use a small motion vocabulary: eased entrances, restrained scale, directional emphasis, and continuity across adjacent scenes. A style recipe is a starting point; make brand, hierarchy, spacing, and the technical story drive the design.

The built-in renderer supports supplied screenshots, code panels, bar charts, and array states. Values are labels from structured data; scaling never changes displayed numbers. Supply ordered labels with values. Highlight indices are checked against the array bounds. Negative-value charts, axes, graph algorithms, 3D scenes, Lottie playback, and complex equations require a custom component; do not force them into the bar template.

For social exports, reflow the layout for each aspect ratio. Keep code excerpts short enough for the narrowest output. Render key frames at full content density and inspect actual glyphs before committing a long export.

## Product and motion recipe synthesis
Use genuine interface screenshots for demos. Pair a single product action with a clear consequence. Shotcraft supplies recipe-level ideas; iart motion packs, continuous-shot tools, and motion-design kits add typography, transitions, and choreography. Video Forge's templates are original implementations rather than bundled copies of these libraries. It does not include Shotcraft's shot-card collection or audio assets.

## HyperFrames (reference integration)
HyperFrames authors HTML with timed DOM clips and seekable animation adapters. It is separate from Remotion. Preserve its own data attributes, media playback ownership, seek-safe timeline, and export process. Render an asset with HyperFrames externally and import the resulting local video, or implement a dedicated backend later. Do not paste React timing rules into its HTML runtime.

## Manim (reference integration)
Manim Community Edition and ManimGL use different imports and APIs. Pick one explicitly, pin its dependencies, and render a small scene before building a full proof. LaTeX rendering requires its own toolchain. Import the rendered media into Remotion; verify mathematical state transitions and use a consistent background, dimensions, and frame rate.

## Entry-level source mapping

Read [catalog.md](catalog.md) only when a particular upstream technique or its provenance matters.
