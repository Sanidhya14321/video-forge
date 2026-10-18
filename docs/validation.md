# Validation — 19 October 2026

## Implemented release

Eight shared skills, a TypeScript production runner, a versioned job schema, a Remotion composition, local CPU narration/transcription, optional cloud adapters, examples, source evidence, and host packaging.

The 100-entry register contains 2 scoped implemented/tested entries, 83 reference-guidance entries, and 15 unresolved entries. The toolkit's native feature set spans the three complete workflows; these labels do not imply that all features of 100 upstream projects are implemented. Inspection specificity and unresolved names are in [the audit](../sources/AUDIT.md).

## Checks performed

- `npm run check`: TypeScript checking, 13 passing tests, and package/source-reference validation.
- Tests cover invalid assets and projects, caption source ambiguity and timing, reordering/repeating cuts, real FFmpeg silence detection and fully silent inputs, measured voice normalization, SRT time boundaries, disabled/exhausted cloud budgets, oversized speech, retained failed reservations, mocked OpenAI audio, mocked fal image/video results, queue failures, and authentication-boundary handling.
- `npm run build` and schema export complete successfully.
- All eight SKILL.md files pass the skill-creator validator.
- Claude's strict manifest validation passes. `claude --plugin-dir <plugin-root> plugin details video-forge` discovers all eight skills; its inventory is saved in [claude-inventory.txt](claude-inventory.txt).
- Codex lists `video-forge@video-forge-local` through one-process marketplace configuration overrides. [Discovery evidence](codex-discovery.json) records the result. No personal marketplace or plugin installation was changed.
- Pinned Remotion README and three actual skill files were re-fetched; all four hashes match the register. [Verification evidence](pinned-source-verification.json).
- The local product dry run passes without producing media or paid requests. All four preliminary archives were extracted, checked for CRC integrity and excluded dependencies, and passed the packaged structural validator; final archives are regenerated after this report.

## Demonstrations

[Demo results](demo-results.json) records final probe/decoding checks. The source repository includes landscape and vertical product and algorithm examples and a vertical footage-repurposing example. MP4 outputs use H.264 video and AAC audio at 30 fps. Previews use 960x540 or 540x960; full-resolution presets remain available.

The algorithm example uses real CPU Kokoro synthesis and faster-whisper word timestamps. Its array trace is supplied as structured data; the narrowed array retains original indices. Narration timing was used to tighten the visual sequence. The repurposing example uses a clean version of that original animation and synthetic narration as a recording fixture, trims explicit source ranges, and remaps the actual word timestamps. No real-person recording was supplied.

Visual review samples scene entries, information-dense frames, both aspect ratios, caption placement, the preserved source crop, and the last code scene. Audio checks use signal analysis and recognition of actual synthesized speech. The final algorithm export measures -16.34 LUFS integrated, and the recognized words match the intended narration after punctuation normalization. There has been no separate human listening session or live professional-editor review. Each output's `quality.json` distinguishes technical validation from visual/editorial judgment.

## Instruction loading

The directing skill is 672 tokens under `cl100k_base`. An illustrative comparison loads the director plus only the relevant focused instructions and references; selected workflow totals are roughly 72–85% below the corresponding inspected upstream entrypoint collections. [Measurement details](context-measurements.json) include baseline files, totals, and limitations. Claude's own component inventory estimates about 305 tokens of always-on metadata.

These are static loading measurements, not a live agent-token benchmark or a claim of equal feature coverage. [Routing cases](routing-cases.md) are manually reviewed expectations; live model-selection behavior has not been evaluated in this delivery.

## Practical limits

Live OpenAI and fal requests have not been made: no cloud keys were configured or required. Mock transport checks do not establish live endpoint availability, output quality, or pricing. The client reservation budget is not an account-wide billing cap.

Linux x64 was tested with Node 24 and the locked Python 3.11 CPU environment. The included CI matrix defines Linux/macOS checks but was not run remotely; macOS and Windows are not claimed as locally verified. Initial model, speech-language-model, browser, and dependency downloads require network access.

HyperFrames, Manim, avatars, translation, advanced vision/editing, professional application timelines, and publishing connectors remain reference integrations. Source instruction files and the report are research inputs; their execution policies and installation commands are not inherited.
