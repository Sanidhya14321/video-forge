# Media generation and provider boundaries

## Shot planning
Describe subject, action, scene, framing, camera motion, duration, aspect ratio, style, and continuity constraints. Use one clear motion idea per short generated shot. Keep a source image or character reference stable when continuity matters. Check current provider schemas and supported model capabilities rather than copying dated model IDs from the PDF.

Prefer deterministic React or vector rendering for exact charts, code, logos, and UI text. Use generated media for illustrative B-roll or environments where its variation is useful. Keep original reference assets and the chosen result with provenance.

## fal queue adapter
Set `FAL_KEY`, enable `cloud`, and declare `maxUsd`. A generation job has an id, endpoint, exact input object, resultType, and `maxCostUsd`. The client reserves this declared maximum before submitting one request, stores its request id, and polls the same queue request. It accepts image responses with `images[0].url` and video responses with `video.url`.

Use `generated:<id>` as an image or video scene source. Local paths are not remote uploads. Any reference URL inside an endpoint input must be reachable and accepted by that provider. This release cannot automatically translate between endpoint input schemas or result formats.

A timeout or network failure can leave a paid job running. Inspect `spending.json` and the provider dashboard before resubmitting. Reservations count failed and pending requests. Account-side provider limits are necessary for a hard monetary cap because a client declaration does not limit the provider's actual charge. Persist a known unresolved reservation in a new project's `cloud.reservedUsd` when intentionally continuing production.

## Additional integrations, guidance only
RunComfy routes to model-specific workflows; retain its request and cancellation semantics. Flow automation depends on an interactive signed-in browser and differs from a normal media API. Magic Hour, HeyGen avatars, lip-sync tools, and self-hosted GPU models each need separate credentials, dependencies, and response handling. Do not silently substitute one for another.

For avatar work, use an authorized presenter image and approved speech, verify identity and lip sync, and disclose synthetic narration/presentation where appropriate. For image editing, state which features must be preserved. For upscaling, compare against the original for invented glyphs or details. These tasks are not implemented by the generic image/video adapter merely because an upstream model can perform them.

## Entry-level source mapping

Read [catalog.md](catalog.md) only when a particular upstream technique or its provenance matters.
