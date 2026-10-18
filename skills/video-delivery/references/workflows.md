# Export and review

## Formats
Full-resolution defaults: landscape 1920x1080, vertical 1080x1920, square 1080x1080, portrait 1080x1350. The project may provide even-numbered preview dimensions. Output is MP4, H.264, yuv420p, with AAC audio when source audio exists. Aspect ratio names are layout presets, not assertions about a platform's latest upload rules.

Use the editable source to reflow titles, code, charts, and captions for each crop. A vertical version must be inspected on its own; a successful landscape export does not validate it. Destination limits and interface safe areas change, so check official platform documentation when preparing a real upload.

## Technical validation
`inspect` probes streams and decodes the full file. A completed run checks planned duration and dimensions and verifies expected audio. `quality.json` records these results. The source transcript is preserved with SRT, including after cut remapping.

Technical checks do not establish visual readability, meaningful motion, audio quality, exact data correctness, or a good story. Sample entry and exit frames for every scene, inspect code and chart labels at full density, listen across each cut, and check the last frame. Examine the cover at a small size.

## Deliverables
A run preserves the normalized job, storyboard, renderer source, render props, static asset copies, per-asset provenance, transcript, SRT, edit decisions where applicable, thumbnails, MP4 variants, technical checks, and a publishing draft. The bundled composition is also retained for reproducible rendering. Dependency versions and engine licensing still apply.

## Publishing guidance
Write a truthful hook, identify the payoff, and tailor copy to the destination. Keep separate posts only where the user's publishing plan calls for them. Typefully, X upload tools, and other publishing connectors have their own authentication and mutation behavior; v0.1 prepares drafts and files without invoking them.

## Source audit
The catalog is a dated evidence register, not an install list. It separates inspected skill files from README-only inspection and unresolved names. An entry marked implemented and tested refers only to the scoped Video Forge capability described in that record, not to all features in the upstream project. No marketplace ranking or security grade is inherited as a warranty.

## Entry-level source mapping

Read [catalog.md](catalog.md) only when a particular upstream technique or its provenance matters.
