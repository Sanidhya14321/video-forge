# Editing grammar for short films

Use for recordings, montages, interviews, demonstrations and repurposing. The edit is an argument made from selected moments. More transitions cannot repair weak selects or missing evidence.

## Scout and build a paper cut

Inspect source duration, frame rate, orientation, camera stability, focus, audio, gestures, speech completeness and useful cutaways. Use CLI `scout` for timestamped samples and metadata, then inspect the intervals that matter; it does not understand meaning or find the best take. Read/transcribe actual dialogue before selecting it. Preserve requested order and intended meaning.

Make selects with source in/out, spoken idea, usable action, crop feasibility and what it proves. Cut the idea first, then tighten breaths and dead time. Silence removal is an assistant for a reviewed paper cut, not a semantic editor. Protect qualifiers, punchline setup, reaction time and gestures. Avoid repeated jump cuts caused only by tiny loudness gaps.

## Choose a cut for a reason

- Hard cut: a new idea, useful contrast or direct progression. It should often be the simplest transition.
- Cut on action: leave and enter during the same meaningful movement. Match direction, gesture and perceived speed, not just beat time.
- Match cut: preserve shape, scale, position, action or sound while changing context. Establish a match a viewer can actually perceive.
- J cut: let the incoming scene's sound precede its image to pull the viewer forward.
- L cut: carry the outgoing sound under new evidence or a reaction so the idea continues across the visual cut.
- B-roll insert: show what the voice is describing, cover a necessary edit or add consequence. A decorative unrelated insert weakens evidence.
- Speed ramp: compress travel or emphasize a real action. Ramp around a movement or occluder, then give the important landing normal readable time.
- Freeze/detail hold: isolate an interpretable moment; avoid holding a mid-word facial expression as a generic outro.

J/L cuts require independent audio/video edit points. The native `segments` workflow currently makes coupled cuts; use a custom composition or Premiere for split edits. Native browser/brand overlays can add evidence above prepared footage but do not automatically select B-roll, track a face or understand an action.

## Rhythm is not an effect quota

Cut on meaning, movement, emphasis or a purposeful musical subdivision. A beat grid is a useful starting structure; speech and proof may need asymmetric holds. Vary wide/medium/detail and information density. Leave contrast before an impact. One strong visual event can feel faster than many weak stickers.

Retiming must respect capture frame rate and source quality. Slowing 24 fps footage to 25% at a 30 fps output does not recover missing moments. Optical Flow can invent artifacts around occlusion, hands, hair and repeating edges; inspect the result. Do not retime conversational speech unintentionally or use extreme ramps across the only factual proof.

## Finish the recording, then the graphics

Balance dialogue clips for consistency, preserve intentional room tone, clean actual distractions, and avoid a gated dead-silent floor between every word. Start with voice intelligibility, add music under the argument, then selective sound accents. A whoosh at every cut flattens emphasis.

Match shots for white balance/exposure before applying a creative look. Check skin and brand colors. Use restrained sharpening/denoise on weak sources; upscaling does not add real facial or UI detail. Correct crop and horizon per shot. Auto Reframe can propose framing in Premiere, but review every important gesture and speaker change.

Check hook, evidence, complete speech, transitions, frame edges, captions, final action and audio continuity on the encoded result. Inspect footage-only and graphics-only when an overlay hides a problem. Deliver original sources, source-relative selects, remapped words and edit decisions. Do not treat a single flattened MP4 as an editable professional timeline.

For Premiere's concrete workflow and the scope of integration, read [Premiere playbook](premiere.md). Primary techniques and implementation boundaries are mapped in [creative research](../../../sources/CREATIVE-RESEARCH.md).
