# Six composable motion studies

[Play the complete 15-second reel](vertical.mp4) · [Editable project](../../examples/motion-studies) · [Technical report](quality.json)

Original source and graphics demonstrate six mechanisms at1080×1920,60fps. These are composable motion studies, not finished stories or engagement evidence. There are no decorative gradients or required mesh models. Clips are silent so their timing and geometry can be inspected without implying a sound design.

| Moving preview | Editable implementation | Direction / timing |
|---|---|---|
| [Glass and refraction](glass.mp4) | `Field`, `Refract` in [Film.tsx](../../examples/motion-studies/src/Film.tsx) and [helpers](../../motion/index.tsx) | Analytic lens crosses high-frequency type for150frames; no physical fluid simulation. |
| [Spatial traversal](traversal.mp4) | `Travel`, `DepthStage`, `Plane` | Camera travels through three type planes and lands on the final phrase; selected fractional-frame blur. |
| [Layered parallax](parallax.mp4) | `Parallax` | Countermoving type, ring and foreground marker reveal depth; artwork may bleed off frame. |
| [Kinetic typography](type.mp4) | `Type`, `useGsapTimeline` | Scoped line stagger enters over0.55s; exit starts1.7s into the shot. |
| [Continuous transition](transition.mp4) | `Portal` | Shared shape and circular mask carry the palette change across frames40–105. |
| [Rapid editorial](editorial.mp4) | `Editorial` |18-frame phrases,3-frame overshoots and selected accent bars; adjust copy before increasing speed. |

Each clip lasts2.5s and was re-encoded from the native final with exact trim boundaries. The complete project contains the score, dependencies and local helpers. Research provenance and licenses are in [motion research](../../sources/MOTION-RESEARCH.md). Original helpers are MIT; dependency terms are retained separately. Out-of-order frame evidence covers the optical, traversal/blur, GSAP, transition and editorial mechanisms on the tested GPU/browser; it does not promise cross-GPU identical pixels.
