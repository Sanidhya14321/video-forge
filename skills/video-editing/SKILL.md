---
name: video-editing
description: "Scout footage, choose meaningful cuts and B-roll, preserve dialogue, and create editable short-form cuts, composites, reframing and sound directly in TSX."
---

# Video Editing

For a creative edit, create a [version-2 code project](../../docs/code-projects.md). Layer footage, captures, masks, typography, captions and independent audio in TSX. Use [code-motion](../video-motion/references/code-motion.md) and an explicit frame score. Professional editorial principles become code-authored cuts and composites; an external editing app is unnecessary.

Inspect the recording and transcript, then choose complete thought units. Read [editing grammar](references/editorial.md) for a new assembly or weak edit; read [editing workflows](references/workflows.md) for execution details. Use CLI `scout` to inspect source moments before proposing cuts. Keep the original recording and capture source-relative cut boundaries in the project.

The footage workflow executes explicit `segments` in listed order. Optional `removeSilence` intersects those segments with detected audible ranges. Silence detection is an audio threshold heuristic; review its output around breaths, laughter, emphasis, and quiet speakers. It does not identify filler words or choose the best take semantically.

Use source-relative transcript words when retaining the original audio; the runner remaps them through every cut. When replacing the audio with narration, provide words on the narration timeline or transcribe the new narration.

Default to `contain` to preserve a code demo or face. `cover` is a center crop and does not track subjects. The built-in footage layout reserves space for captions but cannot guarantee face safety. Inspect the rendered crop. Editable cut decisions are retained as `edit-decisions.json`.

For split edits, place audio and video on independently timed layers. Preserve dialogue meaning and remap measured words through edits. Retiming B-roll is separate from changing spoken audio. The optional [Premiere reference](references/premiere.md) documents external-app concepts only when that handoff is explicitly requested.

For fast reels, use [reel direction](../video-forge/references/reels.md). Cut on meaning or action, vary shot scale, and preserve a self-contained claim and its proof. A rapid rhythm does not justify removing a qualifier that changes the speaker’s meaning.
