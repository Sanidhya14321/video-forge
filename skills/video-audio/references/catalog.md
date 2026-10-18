# Audio source mapping

Read only when upstream provenance or a specialized capability matters. Full evidence and scoped runtime claims are in `sources/catalog.json` at the plugin root. Summaries below are original consolidation notes; unresolved roles come from the PDF only.

## 8. speech

Built-in speech voices provide an optional hosted narration path with explicit credentials.

Disposition: reference guidance. Inspection: skill-inspected.

Source: [openai/skills](https://github.com/openai/skills) at `49f948faa925`.

## 26. faster-whisper

Local word-level transcription provides reusable timing with CPU or separately configured GPU inference.

Disposition: implemented and tested. Inspection: readme-inspected.

Source: [SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper) at `9e472ae9de8b`.

## 31. fal-audio

Audio model routing distinguishes speech synthesis, recognition, and their output requirements.

Disposition: reference guidance. Inspection: package-skills-inspected.

Source: [fal-ai-community/skills](https://github.com/fal-ai-community/skills) at `9ca850412943`.

## 80. qwencloud-audio-tts

Hosted multilingual speech requires provider credentials, supported voices, and output-format verification.

Disposition: reference guidance. Inspection: readme-inspected.

Source: [qwencloud/qwencloud-ai](https://github.com/qwencloud/qwencloud-ai) at `60542ab371ae`.

## 81. minimax-music-gen

Music generation separates instrumental and vocal intent, lyric control, and provider job handling.

Disposition: reference guidance. Inspection: skill-inspected.

Source: [MiniMax-AI/skills](https://github.com/MiniMax-AI/skills) at `60aaae52bb2a`.

## 98. zai-tts

The report describes a hosted speech skill; the exact source and supported voices remain unverified.

Disposition: unverified/unavailable. Inspection: unverified.

Canonical source unresolved; see the source register for the recorded reason.

## 99. video-to-music

The report describes generating a score to fit a video rather than selecting unrelated background music.

Disposition: unverified/unavailable. Inspection: unverified.

Canonical source unresolved; see the source register for the recorded reason.

## 100. venice-audio-speech

The report describes hosted speech and music; its exact skill package remains unresolved.

Disposition: unverified/unavailable. Inspection: unverified.

Canonical source unresolved; see the source register for the recorded reason.

