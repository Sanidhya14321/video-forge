---
name: video-editing
description: "Repurpose recordings with deliberate segment selection, silence removal, reframing, B-roll planning, and editable cut decisions."
---

# Video Editing

Inspect the recording and transcript, then choose complete thought units. Read [editing workflows](references/workflows.md). Keep the original recording and capture source-relative cut boundaries in the project.

The footage workflow executes explicit `segments` in listed order. Optional `removeSilence` intersects those segments with detected audible ranges. Silence detection is an audio threshold heuristic; review its output around breaths, laughter, emphasis, and quiet speakers. It does not identify filler words or choose the best take semantically.

Use source-relative transcript words when retaining the original audio; the runner remaps them through every cut. When replacing the audio with narration, provide words on the narration timeline or transcribe the new narration.

Default to `contain` to preserve a code demo or face. `cover` is a center crop and does not track subjects. The built-in footage layout reserves space for captions but cannot guarantee face safety. Inspect the rendered crop. Editable cut decisions are retained as `edit-decisions.json`.

Professional timelines, beat analysis, automatic visual take scoring, and application MCP integrations are reference guidance in this release.
