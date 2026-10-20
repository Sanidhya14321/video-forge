---
name: video-generation
description: "Cast visual assets and direct generated image/video shots with consistent framing, camera motion and continuity; execute explicitly configured fal jobs."
---

# Video Generation

For asset casting/search, look consistency and rights, read [asset direction](references/asset-direction.md). For shot prompts, camera/action separation, continuity and take critique, read [generation direction](references/generation-direction.md). Choose and inspect usable assets before decorating the edit; an accepted API job is not a usable cinematic shot.


Check the host’s actual media tools first. If an image/video tool is available, follow its contract and stage its returned local files as ordinary assets; do not demand a fal key for a host-native image tool. Otherwise use an explicitly configured provider or deliver a shot/keyframe plan and a local handoff. Do not present procedural animation or a still-image zoom as newly generated photographic video.

Read [generation workflows](references/workflows.md). Use generated imagery where it serves the message. Render code, exact text, charts, and product interfaces deterministically when fidelity matters.

For fal, select a current endpoint from official documentation and supply its exact input schema. Configure `generation` jobs, reference their outputs as `generated:<id>`, and declare their maximum cost reservations. `FAL_KEY` and enabled cloud configuration are required. The generic adapter supports responses containing `images[0].url` or `video.url`; other provider result shapes require a code adapter.

This release uses fal's queue protocol, retains request IDs, and polls existing jobs. It does not upload local files: provider inputs must already use provider-supported URLs or values. Account-side spending controls are needed for a hard billing cap; client reservations cannot constrain an endpoint's final charge.

Review generated assets for identity drift, incorrect labels, temporal artifacts, and relevance before publication. Avatar generation, lip sync, RunComfy, Flow, Magic Hour, image upscaling, and inpainting are documented integrations, not bundled executable capabilities.
