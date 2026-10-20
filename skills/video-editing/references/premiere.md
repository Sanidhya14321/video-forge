# Adobe Premiere Pro: editorial and finishing playbook

Use when the user works in Premiere or an edit benefits from professional timeline techniques. This is an actionable guide and handoff specification, not a claim that Video Forge controls an installed Adobe application. Check the actual host/tool inventory before promising automation. UI labels and API availability depend on the installed version.

## Organize for revision

Keep camera originals, audio, stills/logos, generated shots, sequences and exports in separate bins. Use the intended sequence frame rate and dimensions; interpret footage deliberately rather than changing its playback speed accidentally. Use proxies for heavy media while preserving original timecode, names and relinkable paths. Duplicate the sequence before a major structural edit or platform reframe.

A useful track organization is V1 story/selects, V2 evidence/cutaways, V3 motion/titles, V4 captions; A1 dialogue, A2 continuity/room tone, A3 effects, A4 music. Adapt the layout to the job. Mark the hook, proof, transformation and CTA so timing remains intentional while assets change.

## Text-Based Editing → a visual cut

Transcribe sources; build and reorder complete thoughts in Text-Based Editing. Review the linked footage after transcript edits. Correct names and preserve qualifiers before tightening pauses. Create captions from the edited sequence so subtitles reflect the final cut, then verify actual spelling, word boundaries, line breaks and crop. Do not confuse deleting a transcript filler with preserving a natural visual gesture.

Use a dialogue assembly to establish the argument, then add B-roll as evidence. Use J/L split edits to connect speech and reactions; keep sync and handles when trimming audio independently. Speech clarity and continuity take priority over arbitrary beat snapping.

## Keyframes, retiming and transitions

Use Effect Controls to shape position/scale/rotation and velocity; match the acceleration and direction across a motion cut. A sequence of linear zooms is not a cinematic rig. In Time Remapping, place speed changes around real action, ease the ramp handles, then inspect the rendered result. Compare Frame Sampling, Frame Blending and Optical Flow on the actual shot. Optical Flow is a choice to test, not a universal “best quality” switch.

Choose transitions by their purpose: hard cut for progress, a shape/action match for connection, an occlusion cut for a hidden change, a dissolve for an intentional temporal shift. Keep transitions short enough to preserve the subject and long enough to read their cause. Repeated preset zoom/flash transitions on unrelated content look assembled rather than directed.

Nest related graphics to move them together, while keeping editable originals. Use adjustment layers for a coherent effect pass when appropriate; avoid baking a destructive look into all source media. Match exposure/white balance in Lumetri before styling. Check skin, highlights, black levels, saturation and brand fidelity on scopes as well as the display.

## Spatial shots and motion graphics

Premiere assembles and finishes spatial shots; it is not a general scene-graph 3D package. For camera rigs, 3D layers, focus changes or complex objects, author in After Effects, Blender or a Three.js/Remotion scene. Import a prepared high-quality shot or use a supported Dynamic Link workflow. Preserve aspect ratio, frame rate, alpha interpretation and color pipeline. A flattened render does not preserve a 3D camera for editing in Premiere.

Use a two-node/point-of-interest camera when the subject should remain the focal anchor; use an independent camera orientation when the shot demands it. Keep camera and subject motion distinct. Export handles around a planned cut so the editor can reshape timing. Motion blur, depth of field and transparent interchange depend on the chosen renderer/export, not just a note in a storyboard.

## Reframe, captions and sound

Duplicate/conform platform sequences, then use Auto Reframe as a starting pass. Inspect faces, hands, product details, captions and transitions individually. Replace a poor tracked result with deliberate keyframes. Do not scale a desktop interface down until it becomes unreadable simply to retain all corners.

Mix dialogue first; automate music around speech, retain useful ambience, and use effects as punctuation. Check loudness and true peak on export. Caption timing follows the final sequence, not an earlier source transcript. Review the destination UI on the target crop before publishing.

## Concrete handoff

Supply source-media manifest, a numbered shot/selects table with source and record in/out, sequence FPS/dimensions, approved script/transcript, SRT, reference frames, graphics and audio stems when available, effect/camera notes, and a reference MP4. Explicitly identify missing handles, generated media, third-party rights and flattened effects. These artifacts can support an editor even when no application connector is installed.

The official UXP platform and sample repository are the preferred starting points for a new Adobe integration. The inspected community Premiere MCP is a separate dependency with its own bridge, host/version requirements and behavior; it is not installed or enabled by this skill. Exporting a cut list or SRT is not proof of a live Premiere import. No `.prproj` serialization, UXP panel or application control is implemented in this release.

Sources checked 2026-10-20: [Text-Based Editing](https://helpx.adobe.com/premiere/desktop/edit-projects/edit-video-using-text-based-editing/overview-of-text-based-editing.html), [split edits](https://helpx.adobe.com/uk/premiere/desktop/edit-projects/trim-clips/perform-j-cuts-and-l-cuts.html), [retiming](https://helpx.adobe.com/premiere/desktop/edit-projects/change-clip-speed/change-clip-speed-using-the-speedduration-option.html), [Auto Reframe](https://helpx.adobe.com/premiere/desktop/add-video-effects/commonly-used-effects/auto-reframe-overview.html), [Adobe UXP](https://developer.adobe.com/premiere-pro/uxp/), [source inspection](../../../sources/CREATIVE-RESEARCH.md).
