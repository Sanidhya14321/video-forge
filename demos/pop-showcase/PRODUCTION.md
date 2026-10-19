# Creative Arcade — Video Forge v0.3.0

A 30-second flat-color film that explains Video Forge, its Claude/Codex integration, and its native production capabilities. This intentionally changes the previous minimal film's objects, typography, sound and pacing. It is a creative range comparison, not an audience or controlled agent benchmark.

## Skill use and execution

The agent read and applied the installed-in-repository Video Forge director and conditional reel reference, planning, motion, audio, captions, editing, generation and delivery instructions. The toolkit was used to prepare and validate the project, preview every shot, render the final composition and fully decode/inspect the result. The renderer extension is reusable in the plugin rather than a one-off external composition.

| Module | Applied work |
|---|---|
| Director | Selected a new playful illustration language; routed the production through focused modules |
| Planning | Original hook, 70-word narration, 22-shot board and cumulative frame/beat boundaries |
| Motion | All 12 native motion families in the new pop treatment; original character, clapperboard, gear, signal paths, skateboard, scissors, frame masks, boombox, code cartridge, bars, word stamps and bursts |
| Editing | Authored shot order, varied 3–5 beat durations, push/scale/cut entries, immediate hook, protected evidence and caption zones |
| Audio | Local Kokoro speech; measured two-pass voice normalization; original sample-free stereo music and scene-aligned synthesized swishes, zaps and dings |
| Captions | Actual faster-whisper word measurements; scripted spelling/punctuation correction constrained to measured synthesis windows; JSON and SRT |
| Generation | Chose deterministic code-native vector graphics for exact flat design; no external image/video generation needed |
| Delivery | Native review/preview/run/inspect, sampled visual QA, full-stream decoding, editable sources, credits, comparison and release archives |

The cloud adapters, professional editors, avatars and all upstream projects in the coverage register were not executed. “Extensive skill use” describes the relevant local pipeline above, not every optional integration.

## Reproduction

From the toolkit root:

```bash
npm ci && npm run setup:binaries && npm run build
node dist/cli.js doctor
node dist/cli.js review examples/pop-showcase.json
node dist/cli.js preview examples/pop-showcase.json --out /new/pop-preview
node dist/cli.js run examples/pop-showcase.json --dry-run
node dist/cli.js run examples/pop-showcase.json --out /new/pop-render
node dist/cli.js inspect /new/pop-render/vertical.mp4
```

Prepared narration/music/word timings are bundled. To regenerate audio, install the optional locked Python environment and run `npx tsx scripts/prepare-reel-showcase.ts /new/audio --pop`, then update the project paths. Regeneration requires a fresh output directory and a successful measured alignment check; it does not fabricate caption times on recognition failure.

## Design and provenance

Solid cobalt, orange, pink, teal, acid lime and cream; no gradients. The play-button character and all illustrations are original vector code in `renderer/PopReel.tsx`. Flat offset shadows and pattern fills are intentional. Narration is AI-generated with local Kokoro `af_heart`; the score and effects are original NumPy synthesis. Dependency/model licenses apply separately from this repository's MIT code license. No stock media, remote fonts, cloud keys or paid requests were used.

The `reels` content band is a conservative toolkit layout choice. It is not a promise of safe placement under every current social interface. Small installation labels identify the integration; full setup commands are in the repository documentation.
