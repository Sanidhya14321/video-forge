# Directing a fast reel

Use this reference for short vertical films, abstract motion, kinetic typography, or an explicit fast-paced social request. These are authored creative starting points; they do not predict Instagram reach or represent an algorithm formula. Respect the requested tone, palette, and pace rather than imposing this style on every explainer.

## Choose a visual argument

Decide what physically changes on screen before picking a template. For a technical project, a useful sequence is friction → transformation → capability → proof → payoff. Lead with the visible payoff or tension; a long standalone logo introduction spends the opening on identification.

| Direction | Visual grammar | Useful when |
|---|---|---|
| Abstract cause-and-effect | Fragments assemble, objects lock, signals connect, windows transform | The product is conceptual or code-driven |
| Kinetic type | Words act as objects: masked, split, tracked, pushed, or replaced | A compact message or manifesto is the story |
| Product evidence | A real action, a tracked detail, a consequence, a short proof hold | Viewers need to understand what the interface does |
| Footage-led | Selected action, intentional jump cuts, punch-ins, B-roll and subtitles | A recording contains the evidence |

Choose a dominant language and use others for contrast. When the user wants a different look, change shot scale, object behavior, transition logic, and spatial hierarchy. Reusing the same script, timing, terminal cards, and geometry with alternate colors is not a meaningful comparison. Preserve literal installation steps in documentation or a sufficiently long evidence shot instead of flashing unreadable commands.

## Make abstraction communicate

Use one main moving object per shot. Give the shape a role and an observable consequence:

- Scattered fragments → one coherent form: a brief becomes a film.
- Orbit → lock/connect: integration with an agent or tool.
- Traveling signals → an organized path: production steps connect.
- A gap collapses in a timeline: editing removes dead time.
- A frame changes proportions around its subject: reframing or exports.
- Lines become a voice envelope or word rhythm: audio and synchronization.
- Real numeric values become shapes: data, preserving values and labels.

Change scale or layout after several shots; avoid an endless heading over a box. Let text enter the action rather than adding a persistent slide header, chapter count, and footer to every shot. Decorative shapes may bleed to the edge; key copy and evidence remain readable.

## Pace the information

For an energetic 20–35s technical reel, try primary shots around 0.8–1.8s with 0.35–0.8s internal accents. Hold an actual command, diagram or proof longer when reading requires it. These ranges are adjustable production choices, not platform rules.

Use rhythm contrast: an assertive hook, denser middle, a short quiet hold, then a clear payoff. Cutting every shot at one identical interval is only a starting grid. A 120–180 BPM bed is convenient for beat-based motion; derive beat phase from frames, not elapsed wall time. Estimate narration, synthesize, measure, then revise cuts around actual words and breaths.

Choreograph an impact: anticipate, travel, settle, hold. For example at 30fps, 2–4 anticipation frames, 8–14 travel frames and 6–10 settle frames can leave a useful reading hold in a 1.5s shot. Avoid making every object spring, shaking every word, full-screen flash spam, or decorative effects with no narrative role.

Use match cuts when an outgoing object can become the incoming one. Masks, directional pushes, crop changes, shape continuity and a sound transient should explain the cut. Native presets are a vocabulary, not a replacement for authoring transitions when a continuous custom move is required.

## Execute with the toolkit

Author `workflow: short-form-reel`, explicit `reel: {bpm, safeArea}`, and scene `kind: reel` plus `motion.preset`. See [the contract](../../../docs/project-format.md#short-form-reels). The twelve native treatments are type-impact, fragment-merge, orbit-lock, signal-flow, ribbon, frame-morph, timeline-cut, waveform, code-scan, data-sculpt, word-pulse, and radial-burst. Pick treatments by their meaning; avoid selecting one randomly for each sentence.

Use `motion.seed` for stable variation, `invert` for intentional light/dark cuts, and `entrance` for cut/push/scale entry. Native surfaces are flat; a requested minimal palette stays minimal. Use real data for `data-sculpt`, short supplied code for `code-scan`, and asset provenance for imported evidence. Unsupported custom ideas belong in a project copy of the renderer.

Run CLI `review` for timing/repetition/density warnings and `preview` for entry/peak/exit stills. Preview does not call cloud providers, synthesize audio, or transcribe. Inline/file caption timings appear when supplied. Read actual previews; a warning-free report cannot prove the design works.

## Finish for a phone

Meta's published Reels advertising guidance emphasizes vertical video, audio and safe placement. Use a 1080×1920 master unless the request specifies otherwise. The toolkit's conservative `reels` preset protects top 14%, bottom 35%, left 8% and right 12% of vertical output; these margins are project defaults, not an official universal Instagram specification. Inspect the current destination UI or an overlay before posting. A `clean` preset supports presentations and exports where those margins are unnecessary.

Keep short caption phrases near the protected content band, not at the bottom of the frame. Respect meaningful pauses and avoid a new subtitle group at every arbitrary cut. Music supports the voice; place sound design on important transformations and leave some beats unaccented. Use original or appropriately licensed audio; access to a social app's music library does not establish a transferable license for exported files.

Review the hook at frame zero, transition neighborhoods, dense proof frames, sound-off comprehension and the loop seam. Describe whether visual review is sampled or full playback. Retention, saves, completion and A/B performance remain unmeasured until actually observed; do not claim a reel is viral or optimized for an algorithm because it contains many cuts.

Sources checked for platform essentials and packaging: [Meta Reels creative guidance](https://www.facebook.com/business/ads/facebook-instagram-reels-ads), [OpenAI skill testing](https://developers.openai.com/plugins/build/skills). The motion library and timing recommendations above are original design guidance, not copied platform claims.

## Color-pop / creative arcade

For a playful maximalist brief, use `motion.style: "pop"` rather than recoloring the minimal treatment. Pop changes the objects, typography, staging and behavior: a play-button character, hinged clapperboard, gear lock, candy-road skateboard, crop window, scissors, boombox, code cartridge, dimensional bars and comic word stamps. All twelve presets have this separate choreography. Match each object to its narrative role.

Set a 3–8 color `motion.palette` (first color is the background, remaining colors are accents) and `energy` from 1–3. Pop defaults to flat solid colors, thick outlines, offset shadows, halftone/checker patterns, squash/stretch, short camera impacts and seeded confetti. `reel.captionStyle: "pop"` adds an outlined caption badge and lime active words. Keep caption/evidence zones clear and review dense entry frames; more effects should not hide the message. Avoid repeated rapid full-screen color flashing.

Use `examples/pop-showcase.json` as a complete reference, including varied beat lengths, local generated speech, measured ASR word timing, original stereo score and scene-aligned synthesized effects. Rebuild optional audio with `npx tsx scripts/prepare-reel-showcase.ts /new/audio-directory --pop`, then point the job at those files. Compare the rendered result with the minimal example at the same phone display size. This is a creative range demonstration, not a controlled engagement experiment.
