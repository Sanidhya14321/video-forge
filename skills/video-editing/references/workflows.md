# Editing decisions and timeline preservation

## Inspect before selecting
Probe the recording and listen around candidate boundaries. Use a lower-resolution proxy for exploration while retaining the original for final media processing. Select complete thought units with context, evidence, and a payoff. Retakes and repeated phrases can confuse transcription and forced alignment; verify suspicious timing in isolated audio windows.

## Executable editing behavior
Set `workflow` to `footage-repurpose` and specify `footage.src`. `segments` contains source seconds and is played in listed order, permitting intentional reordering. The runner trims both audio and video, resets timestamps, and concatenates the ranges. It preserves the resulting edit decisions and remaps source caption words into the new timeline.

`removeSilence` measures audio below `silenceDb` for at least `silenceSeconds`, retains a short padding near audible material, and intersects retained spans with the explicit segments. It is not filler-word recognition, a breath classifier, or semantic take selection. A completely silent selection fails if removal leaves no usable footage.

If a word crosses a chosen boundary, remapping clips its timing but cannot restore the missing sound. Choose boundaries from verified word or phrase edges. Read the edited clip at normal speed; a technically valid concat can still sound abrupt.

## Framing
`contain` preserves the source frame within the reserved content area. `cover` fills that area by center cropping. Neither detects faces. On-screen terminals, subtitles already present in the source, and a corner webcam need visual review. Prefer a custom composition for picture-in-picture or subject-tracked reframing.

## Advanced integrations (guidance only)
FireRed-style intent editing contributes editorial planning; BaoCut contributes an editable timeline and translation/dubbing sequence; OpenChatCut and Premiere tools expose application-owned timeline mechanics. Keep those state formats native. Do not claim Video Forge opens their timelines or implements their entire feature sets.

For beat-synced edits, obtain actual beat times and inspect them against the soundtrack before assigning cuts. B-roll should illustrate the spoken idea and retain its own source, credit, and license record. Visual frame scoring is a separate model integration; the current runner executes agent-authored selections.

## Entry-level source mapping

Read [catalog.md](catalog.md) only when a particular upstream technique or its provenance matters.
