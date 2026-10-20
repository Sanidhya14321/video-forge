# Camera design for code-authored video

Spatial cinematography can be made from typography, UI, photos, footage, masks and graphic planes. Author the camera and focal path in a [code project](../../../docs/code-projects.md); use [code-motion](code-motion.md) for executable mechanisms. Choose perspective layers, Canvas/WebGL or mesh geometry according to the subject.

## Stage the image, then move through it

Establish foreground, middle ground, background, subject and destination. Put a close edge or occluder in frame when travel should communicate depth. Vary layer spacing and relative speed. Preserve a shared coordinate system across the transition so a letter, screenshot edge, lens or subject carries the viewer into the next idea.

Write the focal path in frames: where attention begins, what passes the camera, what becomes dominant and where the motion lands. A screenshot can become a full-bleed detail; a glyph opening can become a mask; a timeline gap can collapse into the next frame. Script interaction rather than waiting for scroll, hover or pointer input.

| Move | Use | Check |
|---|---|---|
| Push/traverse | Travel through type/UI planes into proof | Distinct depth and a useful destination; avoid clipping the only readable evidence |
| Truck/pedestal | Reveal adjacent layers or a process | Relative motion makes the geography legible |
| Arc/roll | Shift the graphic's perspective and energy | Keep a focal subject and intentional horizon |
| Occlusion cut | Carry a passing edge into the next shot | Outgoing/incoming direction and velocity agree |
| Match move | Turn one shape/scale into another | Preserve the visual anchor through the handoff |
| Whip/reframe | Rapidly shift between established points | Inspect intermediate frames and stable landing |
| Focus/optical change | Direct attention through blur or refraction | Protect meaning-bearing text; confirm the implemented effect in actual motion |

Use continuous velocity through travel points; do not ease to a stop at every waypoint. Contrast rapid travel with brief stable proof. Move a layer to show a state change and change camera/framing to reveal a different view. Frame-level accents can surround a continuously readable message.

## Finish spatial motion

Drive every pose, lens center, shader uniform and procedural value from frame time. Compute velocity from the same authored curve, not previous-frame memory. Apply temporal blur to selected moving layers; critical copy/captions can remain sharp. Match Canvas/WebGL backing resolution to the render scale. Check optical edges, magnified text, image boundaries, maximum travel speed and the encoded transition, including out-of-order captures.

Solid-color art direction can include optical highlights or dimensional shading when the brief permits. Refraction needs visible detail behind it; translucency alone does not demonstrate lens distortion. Use original/cleared layered artwork or real captures with provenance. CSS perspective is a valid implementation of spatial video choreography; its value is judged by the resulting framing and motion.

## Optional mesh-world workflow

When the subject benefits from real mesh geometry, existing version-1 `kind: world` supplies Three.js projection, lighting, camera position/target/FOV/roll and object transforms. Read the [world contract](../../../docs/project-format.md#3d-world-scenes). World positions use scene units; rotations are radians; timing is scene-relative seconds. Use `ThreeCanvas` with explicit dimensions and frame-derived state.

The old camera study demonstrates this specific geometry path. Physical lens models, depth of field, volumetrics, compressed model decoders and skeletal animation require their own implementation; referencing them does not enable them. Existing mesh tools remain available without making models the default answer to a short-form motion brief.
