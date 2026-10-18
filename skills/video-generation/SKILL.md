---
name: video-generation
description: "Plan generated images and video B-roll and execute explicitly configured fal jobs; guide optional avatar and media-provider integrations."
---

# Video Generation

Read [generation workflows](references/workflows.md). Use generated imagery where it serves the message. Render code, exact text, charts, and product interfaces deterministically when fidelity matters.

For fal, select a current endpoint from official documentation and supply its exact input schema. Configure `generation` jobs, reference their outputs as `generated:<id>`, and declare their maximum cost reservations. `FAL_KEY` and enabled cloud configuration are required. The generic adapter supports responses containing `images[0].url` or `video.url`; other provider result shapes require a code adapter.

This release uses fal's queue protocol, retains request IDs, and polls existing jobs. It does not upload local files: provider inputs must already use provider-supported URLs or values. Account-side spending controls are needed for a hard billing cap; client reservations cannot constrain an endpoint's final charge.

Review generated assets for identity drift, incorrect labels, temporal artifacts, and relevance before publication. Avatar generation, lip sync, RunComfy, Flow, Magic Hour, image upscaling, and inpainting are documented integrations, not bundled executable capabilities.
