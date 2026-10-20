# Cinematography and 3D camera travel

Use for spatial product films, traversals, fly-throughs, parallax or a request for cinematic motion. Choose depth because it explains or reveals something. A CSS tilt is a 2D surface in perspective; a camera moving through meshes is a 3D scene. Label the distinction accurately.

## Design the shot in world space

Identify subject, its scale, foreground, middle ground, background, lighting and destination. Put an occluder or near edge in frame when travel must communicate parallax. A featureless background and a centered object can make a true dolly look like a scale tween.

Choose the shot's purpose: reveal an unseen surface, move from detail to context, travel from a problem to its solution, connect related stations, or show a process unfolding. Sketch camera start/end, a look-at target and a readable landing. Keep screen direction coherent across cuts; deliberately cross the action axis only when the geography remains understandable.

A lens is a framing decision. Approximate full-frame focal equivalents are useful language, not a renderer guarantee: wider views emphasize near/far separation; longer views compress apparent depth when framing is maintained by moving back. A dolly changes the camera position and parallax; changing FOV changes magnification/perspective framing without translating the eye. Avoid calling one the other.

## Camera vocabulary

| Move | Use it for | Avoid |
|---|---|---|
| Dolly in/out | Discover a detail or reveal its context | Driving through the subject or leaving no reading hold |
| Truck/pedestal | Reveal adjacent layers or a process | Moving camera and subject identically so no parallax remains |
| Orbit/arc | Read shape, silhouette, connections | An arbitrary full revolution around every feature |
| Crane rise/reveal | Go from obstruction/detail to the hero | Losing the subject against a flat silhouette |
| Rack focus | Transfer attention between depth planes | Blurring the only evidence or implying blur is implemented when it is not |
| Occlusion cut | Hide a cut behind a close passing surface | A wipe with no spatial or directional relation |
| Match move | Carry speed, direction or shape into a new shot | Mismatched velocity that looks like a stumble |
| Whip/reframe | Shift attention rapidly between established points | Unmotivated shake or unreadable copy during travel |

## Choreograph travel, landing, proof

Use continuous velocity through intermediate path points when traversing. Easing to zero at every point creates a stop-start sightseeing ride. Decelerate into the important detail and leave a stable hold before text or a UI action. For a fast film, a short travel can be surrounded by faster cuts; the whole film need not stay in constant motion.

Place camera motion and object motion on separate tracks. Move the camera for a new view; move objects for a state change. An exploded stack should reveal assembly or roles, not scatter meaningless parts. Use a coherent up vector and a deliberate small roll; do not accidentally invert the horizon while aiming nearly straight up/down.

Light to show form: key, fill and rim/background separation. Keep real brand colors recognizable under the light. Choose roughness, metalness and silhouette deliberately; chrome and excessive bloom do not automatically mean quality. Ground objects with contact/shadow/reflection cues when the chosen renderer supports them. Flat color is compatible with dimensional lighting; a no-gradient brief still allows shaded geometry unless the user excludes it.

## Native execution

`kind: world` uses genuine Three.js meshes, perspective projection, lighting, and a frame-derived camera path through `@remotion/three`. Read [world contract](../../../docs/project-format.md#3d-world-scenes). Camera samples and object transform keys use seconds relative to the scene. Positions/targets are authored in world units; rotations/roll are radians; FOV is vertical degrees. Choose linear travel or smooth interpolation deliberately. Validate camera clearance and framing in every aspect ratio.

Use `examples/camera-traversal.json` for a complete original world-space study. It is a foundation to restage, not the default answer to all cinematic briefs. The first-party renderer supports procedural primitives, local still-image planes and static self-contained GLB models. Compressed/externally referenced glTF, skeletal animation, physical lens distortion, depth of field, volumetrics and 3D motion blur require custom scene work or an external renderer; never imply these effects are present because the shot notes name them.

For custom Remotion work, keep animation tied to `useCurrentFrame()`, including shaders, camera and texture state. Use `ThreeCanvas` with dimensions; sequences within it need `layout="none"`. Interactive orbit controls, wall-clock damping and live simulations are unsuitable for reproducible frame capture unless explicitly sampled and baked. Review frames in a different order as well as sequential playback.

For authored rigs/complex models consider Blender or After Effects; for mathematical spatial explanations consider Manim; for web animation authoring consider Theatre.js or Motion Canvas. Their runtime requirements and timelines differ. Export prepared shots and conform them in the editorial timeline rather than claiming one engine executes another's code.

Mechanisms inspected in Remotion, R3F/Drei, Theatre.js, Motion Canvas, Manim and Shotcraft are recorded in [research](../../../sources/CREATIVE-RESEARCH.md).
