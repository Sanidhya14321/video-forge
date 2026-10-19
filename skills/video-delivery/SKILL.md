---
name: video-delivery
description: "Export social video variants, inspect playable media, review thumbnails and caption placement, and prepare publishing assets."
---

# Video Delivery

Read [delivery workflows](references/workflows.md). Export from the editable composition to each requested aspect ratio. Use explicit dimensions for preview renders and full-resolution presets for delivery.

Run `node <plugin-root>/dist/cli.js inspect /absolute/path/video.mp4`. The runner also writes `quality.json` with codec, dimensions, duration, audio presence, caption count, and full-stream decoding results. These checks do not assess pacing, correctness, visual taste, pronunciation, or accessibility.

For reels, run CLI `review` and `preview`, then check key text and captions against the conservative content bounds. A platform interface can vary; these bounds are a design aid, not upload certification.

Inspect frames at scene changes and information-dense moments. Listen to narration and music together. Test captions on a phone-sized view, and inspect the vertical crop separately. The first export produces a thumbnail frame; it may need a separately designed cover.

Preserve MP4s, source job, composition, manifest, transcript, subtitles, and edit decisions. Finish the publishing draft with a factual hook, relevant asset credits, and generated-voice disclosure. Verify current destination upload limits before publication. This plugin prepares files and text; it does not publish or schedule posts.
