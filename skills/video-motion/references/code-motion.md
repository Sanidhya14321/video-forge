# Composable motion for a video timeline

Read the project [contract](../../../docs/code-projects.md). Executable source: [motion helpers](../../../motion/index.tsx), [starter Film](../../../templates/short/src/Film.tsx). Moving studies and source are in [motion studies](../../../demos/motion-studies/README.md). The helpers are original MIT code, not copies of upstream demos.

## Choose the mechanism

| Mechanism | Direct the shot | Implementation and timing | Failure to correct |
|---|---|---|---|
| Fluid glass/refraction | A lens crosses type/UI and reveals a new relationship | `Refract`: capture DOM to a texture, refract sampling coordinates from lens normals, animate center/radius/strength from frames. Distinct detail behind the lens makes optics visible. | A transparent rounded rectangle is not refraction; avoid distorting proof text throughout its reading window. |
| Spatial traversal | Travel through successive type/image/UI planes and land on evidence | `DepthStage`/`Plane`: shared perspective, staged depth/occlusion, frame-derived camera position and roll. Make outgoing geometry become the next frame. | Generic tunnels or arbitrary orbit. CSS perspective is a legitimate video technique; a GLB is unnecessary. |
| Layered parallax | Foreground passes faster than the background, revealing the subject | Separate actual layers, vary depth/scale, choreograph overlap and crop. Use real cutouts with rights; flat images can be choreographed as planes without claiming subject segmentation. | Identical layer speeds, extreme upscaling, uncovered image edges. |
| Kinetic typography | Words act as objects and carry the cut | `SplitType`, masks, tracked lines, perspective transforms; `useGsapTimeline` for scoped DOM/SVG staggers. Keep one meaning-bearing read stable across accents. | Every word springing alike; long sentences flashed as independent frames. |
| Continuous transition | A shared edge/shape/velocity links two ideas | `Wipe`, shared transforms, overlapping sequences; `Refract displace` for an authored texture crossing. Set outgoing and incoming coordinates together. | Resetting the whole stage at each cut; distortion with no destination. |
| Rapid editorial | Alternate cut density, spatial travel and a brief decisive hold | Frame-score shot/accent/audio events. Use hard cuts, freeze moments, match scale and deliberate retiming. `Blur` samples fractional frame poses for selected moving layers. | Repetitive impacts, full-screen flashing, blurred captions, cuts that truncate speech. |

## Website motion becomes video motion

Replace scroll progress with `progress(frame,start,end)`. Replace mouse influence with a scripted focal path. Compute velocity from the same curve at adjacent/subframes, not a previous-frame ref. Seed randomness. Do not use RAF, wall-clock time, GSAP callbacks, ScrollTrigger or incremental lerp as the animation clock. Frame N must match whether rendered after N−1, frame 0 or frame 500.

Use `useGsapTimeline` only for DOM/SVG targets; plain-object shader uniforms can freeze in captures. Build synchronous paused timelines. Keep all @remotion packages on 4.0.536. Local fonts load through `loadFont`, which blocks rendering and rejects failed loads. HTML-in-canvas effects use the pinned Chromium in CLI rendering; a normal preview browser may need the experimental flag. CLI moving previews avoid relying on browser-player support.

`Refract` uses an original deterministic optical distortion shader, not a physical fluid solver. Simulated fluid feedback must be pre-baked or replayed from a fixed start. `Blur` uses fractional-frame DOM samples with additive compositing; `NativeBlur` exposes the upstream implementation, which encountered a sibling-paint issue in the tested browser. Scope it to a brief fast movement and keep independent reading layers outside. Nested optical/blur effects need the pinned browser. WebGL resolution must follow the output/backing pixel density; a larger CSS size does not add pixels.

## Cast assets and finish

Use distinctive typography, actual product evidence, original graphic patterns and strong crops. Move screenshots as image planes; enlarge the relevant region instead of displaying a tiny desktop. Record original pixels, largest crop/magnification, license, role and source. Do not copy demo photography/music under a code license.

Inspect a moving draft and critical full-resolution frames: entry, maximum velocity, lens edge, shared-element handoff, text landing and loop seam. Per-frame transition strips reveal discontinuities. Encode checks and creative judgment are separate. Refine based on visible defects, not effect counts.

Sources, pinned revisions and adaptation boundaries: [motion research](../../../sources/MOTION-RESEARCH.md). Original upstream mechanisms include [Codrops kinetic type](https://github.com/codrops/KineticTypePageTransition), [The Substance](https://github.com/drcmda/the-substance), [Remotion GSAP](https://www.remotion.dev/docs/gsap/use-gsap-timeline), [HTML-in-canvas](https://www.remotion.dev/docs/html-in-canvas) and [motion blur](https://www.remotion.dev/docs/motion-blur).
