---
name: video-captions
description: "Transcribe audio locally, preserve word timestamps through edits, style readable captions, and prepare editable subtitle sidecars."
---

# Video Captions

Read [caption workflows](references/workflows.md). Choose exactly one caption input: explicit words, a transcript JSON file, or local transcription. Word entries are `{text,start,end}` in seconds. Never estimate timestamps and present them as measured alignment.

Use the optional faster-whisper environment for `transcribe: true`. Its timestamps are ASR estimates. Review technical terms and alignment against the sound, especially after retakes or repeated phrases. Empty or out-of-range captions stop the job.

The renderer groups short phrases and highlights active words; the runner preserves `transcript.json` and SRT. Check punctuation, line length, contrast, interface safe areas, and placement against the subject. Font coverage must be tested for the chosen language.

Translation is an agent-authored reference workflow. Keep the original timing unless meaning requires revised segmentation and alignment. Bilingual styling and ASS sidecars are not built-in outputs in v0.1. Read the reference for available approaches and engine limitations.
