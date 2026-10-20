---
name: video-audio
description: "Generate local or optional OpenAI narration, prepare music and sound effects, and mix audio for technical videos."
---

# Video Audio

In a version-2 code film, place prepared local audio with Remotion `Audio` and synchronize it to the shared frame score. Mix and inspect the encoded result; keep narration, music, effects and provenance in the editable project. The native version-1 speech/transcription tools below remain available for preparing media.

Read [audio workflows](references/workflows.md). Prefer approved audio or local Kokoro. Verify pronunciation of symbols, names, abbreviations, and code before the full export. A script that reads well may not speak well.

Use `narration.provider: file` for supplied audio, `kokoro` for local synthesis, or `openai` for an explicitly selected paid speech call. OpenAI requires a verified per-character rate and a cloud reservation budget; supported models are documented in the project contract. Credentials belong in environment variables.

The runner rejects narration longer than the scene timeline. Short narration leaves the remaining visual duration intact. Music loops at the configured volume and is attenuated while timestamped caption words are active. Generated voice receives measured two-pass loudness normalization before mixing. Supplied voice levels are preserved. Inspect actual audio and avoid claiming a loudness target that was not measured.

Generated narration must be disclosed in publishing copy. Custom voice cloning and hosted music generation are reference workflows. Preserve audio credits separately from the toolkit's code license.

For beat-driven reels, follow [reel direction](../video-forge/references/reels.md). Derive cue times from the same FPS/BPM clock as motion, accent important transformations selectively, and preserve voice intelligibility. Do not import a trending commercial track without a usable license.
