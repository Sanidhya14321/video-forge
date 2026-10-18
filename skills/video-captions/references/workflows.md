# Caption timing, readability, and localization

## Inputs and output timelines
Inline `captions.words` and transcript JSON contain text, start, and end in seconds. Transcript JSON may be a word array or an object with a `words` array. A footage job with original audio expects source-relative words; the runner remaps through ordered cuts. New narration uses its own output timeline. Automatic transcription operates on the final selected audio, so its output already matches the edit.

Word start times must be sorted and nonnegative, end must follow start, and captions must fit the output duration. ASR timings remain estimates: review repeated technical terms, acronyms, punctuation, and retakes. Never replace missing alignment with invented measurements.

## Rendered captions
The current template groups up to `maxWords` and breaks long groups at roughly 34 characters. The active word is highlighted. Captions sit in a high-contrast box above the footer. This is a default layout, not a guarantee of platform safe-zone or face clearance. Preview the destination crop and check long unbroken identifiers and script-specific fonts.

SRT is retained for editing and platform uploads. The default sidecar uses word cues for timing fidelity; group into sentence cues for a conventional subtitle track when needed, preserving a copy of word data. Keep content editable rather than treating burned text as the source of truth.

## Bilingual guidance
Translate meaning with surrounding sentences. Preserve proper nouns and technical vocabulary. Use a glossary and a second reading pass. Avoid changing all cue boundaries merely to accommodate a translation; re-align if the spoken language or segmentation changes materially.

For CJK-over-Latin layouts, use appropriate font coverage and punctuation handling, and give the two languages deliberate hierarchy. Some FFmpeg builds lack libass; PNG overlays are an alternative for styled captions. Video Forge's Remotion captions do not require libass, but v0.1 does not implement a bilingual layout or ASS output automatically.

## Upstream lessons
Embedded-caption workflows keep timing inside a composition. Local Whisper workflows produce reusable word timing. Alignment-focused cut tools warn that repeated takes can drift by seconds. Provenance-aware editing skills keep per-clip attribution alongside subtitles. These are complementary concerns and are consolidated here without promising perfect word alignment or automatic retention gains.

## Entry-level source mapping

Read [catalog.md](catalog.md) only when a particular upstream technique or its provenance matters.
