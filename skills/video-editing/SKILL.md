---
name: video-editing
description: "Scout footage, choose meaningful cuts and B-roll, preserve dialogue, and create editable short-form cuts, composites, reframing and sound directly in TSX."
---

# Video Editing

For a creative edit, use a [version-2 project](../../docs/code-projects.md): independently timed footage/audio layers, captures, masks, typography and captions in TSX. Use [code-motion](../video-motion/references/code-motion.md) and a shared frame score.

Inspect the recording and measured transcript. CLI `scout` samples source moments; it does not choose takes semantically. Select complete thought units in the approved story order. Keep original media and source-relative edit decisions. Remap word timestamps through cuts; replacement narration needs its own measured timeline.

Read [editorial grammar](references/editorial.md) for assembly and [execution workflows](references/workflows.md) for structured version-1 `segments`, silence removal and transcript tools. Those JSON options belong to the version-1 runner; a version-2 composition authors its own layers and consumes prepared media/sidecars. Threshold-based silence removal can cut breaths or quiet speech; review cut boundaries.

Use `contain` for evidence or faces unless a reviewed crop improves framing. Centered `cover` does not track subjects. Inspect vertical crops, split edits, caption clearance and dialogue/music together. Retiming B-roll is separate from changing speech. Follow [short-form rhythm](../video-forge/references/reels.md) while preserving qualifiers and proof. The [Premiere reference](references/premiere.md) is conditional guidance for an explicitly requested external handoff.
