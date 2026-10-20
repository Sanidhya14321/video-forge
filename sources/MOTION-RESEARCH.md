# Video-native motion research — 0.7

The core production path is code-authored short-form video. Motion from websites becomes an explicit frame/beat score, with no interactive input or live animation clock. The original 100-entry PDF register remains unchanged; this addendum records the new, narrower investigation.

Pinned repository evidence and hashes: [machine register](motion-research-v07.json). The inspected files include upstream license texts and the relevant animation/shader implementation. Raw research files remain outside the distributable. New helpers in `motion/index.tsx` are original MIT code; no upstream photos, fonts or audio were copied under repository code licenses.

| Source | Extracted mechanism | Video adaptation / disposition |
|---|---|---|
| [The Substance](https://github.com/drcmda/the-substance) | Depth layout, velocity plane bend, RGB/refraction sampling | Replace scroll history, incremental lerp and useFrame with frame functions. Reference guidance; original layer/lens helpers implemented separately. |
| [Codrops KineticTypePageTransition](https://github.com/codrops/KineticTypePageTransition) | Rotate/scale type into the next scene; stagger multiple lines | Shorten/author timing for film; original SplitType/perspective/masks. MIT source inspected; no source/media vendored. |
| [Codrops shader animation](https://github.com/biazo/codrops-animate-shaders-with-gsap) | Ripple/reveal uniforms, texture blending | Original deterministic displacement/refraction pass; no mouse-based input or plain-object GSAP tween. |
| [Remotion GSAP](https://www.remotion.dev/docs/gsap/use-gsap-timeline) | Frame-seeked scoped DOM/SVG timeline | Integrated @remotion/gsap4.0.536 with GSAP3.15.0. No callbacks, plugins, standalone tweens or object-uniform updates through the hook. |
| [HTML-in-canvas](https://www.remotion.dev/docs/html-in-canvas) | Capture live DOM for Canvas/WebGL postprocessing | Implemented original lens using captured DOM → 2D bridge → WebGL texture → output canvas. Captured ElementImage belongs to its capture canvas; direct texture API assumptions failed in the pinned browser and were replaced by the verified bridge. |
| [Remotion motion blur](https://www.remotion.dev/docs/motion-blur) | Fractional-frame temporal accumulation | Matching package is available as `NativeBlur`. Its sibling capture failed during a real render in pinned Chromium157; the original `Blur` helper uses fractional-frame DOM samples with additive premultiplied compositing instead. Captions/evidence remain outside blur. |
| [Liquid glass grid](https://tympanus.net/codrops/2026/09/08/building-an-infinite-liquid-glass-grid-with-three-js-webgpu-and-tsl/) | Flat-plane lens normals, refraction and aligned HTML | Technical reference, not copied source. This release uses WebGL and original analytic distortion, not its WebGPU simulation or a physical fluid solver. |

## Licensing and limits

The first three repositories are MIT at the revisions recorded in JSON. Their code was read as mechanism research; the current helper code is original. GSAP uses its own [standard license](https://gsap.com/community/standard-license/), while the Remotion wrapper and motion-blur package are MIT; Remotion core has its own terms. Retain dependency and per-asset notices. Code terms do not automatically cover repository media.

Realistically deterministic output requires explicit time, seeded values, awaited local assets/fonts and frame-aware texture upload. Stateful fluids require baking/replay; browser callbacks and scroll listeners are not an offline video timeline. Visual quality, true refraction and temporal continuity must be checked in rendered motion, separately from schema/package tests.
