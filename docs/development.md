# Development

## Structure

`src/` contains schema validation, local media operations, optional provider adapters, the runner, and the CLI. `renderer/Root.tsx` is the built-in composition. `python/` is an isolated optional CPU model environment. `skills/` contains shared Agent Skills used by the host adapters. `sources/` is an evidence and coverage register, not executable third-party instructions.

Use Node 22+ and `npm ci`. Run `npm run check` after changes. Run `npm run schema` after modifying the job schema. Run `npm run examples` in a clean `demos/` directory for end-to-end rendering and local speech verification. CI runs runtime/renderer checks and all six package/resource checks on Ubuntu and macOS, with product and both motion-vocabulary renders on Linux.

## Custom compositions

For a custom design, copy the toolkit into the user's production project, change `renderer/Root.tsx`, and keep the project contract and frame timing stable. `Panel` owns built-in scene visuals. `Captions` uses global output time; scenes inside a `Sequence` receive local frame time. Use explicit structured fields for new scene behavior and extend the Zod schema and tests together.

A completed run preserves a renderer snapshot at `composition.tsx` plus its motion, footage/layout and schema dependencies, staged assets, render props, and a browser bundle. Re-render the unchanged bundle with `renderMedia` from `@remotion/renderer`, passing `serveUrl` as the absolute bundle path, `id: VideoForge`, and the saved input props. To change the snapshot itself, rebundle `composition.tsx` with `publicDir` set to the run's `assets` directory. Resolve npm dependencies from the toolkit or install the pinned packages in that project. Copying a TSX file alone is insufficient to carry dependencies or media.

The source `project.json` preserves original input paths for reproducibility in the original production workspace. To move a production independently, use staged `render-props.json` and the composition bundle, or update the project inputs to staged paths. The manifest maps these assets by hash.

## Provider extensions

Keep request authentication and transport in a provider module. Validate all required local inputs and credentials before paid submission. Persist a reservation before submitting, retain returned request IDs, and query the existing request through terminal states. A timeout is not proof of cancellation. New result shapes need explicit adapters; do not infer them from model marketing copy.

Transport tests are mocked and make no billable calls. Account-level billing enforcement belongs with the provider; the local reservation file is a production control, not an account-wide credit limit.

## Auditing sources

`python3 scripts/audit_sources.py` refreshes already resolved evidence URLs using pinned commits and hashes. It never executes upstream code. New/ambiguous names require a deliberate canonical-source decision; do not resolve them by fuzzy name similarity alone. Review a relevant SKILL.md plus supporting references when available, update inspection specificity, and record the useful lesson and its destination. Raw research caches stay outside release packages.

Unresolved PDF entries are retained with reasons and candidate-search notes. Discovery-directory counts, scores, runtime costs, and speed claims are not copied into production defaults.

## Release

Update package and plugin versions together. Build with `npm run build`, validate, render representative examples, review frames, then run `npm run package`. Packaging uses deterministic member order and timestamps and excludes installed dependencies, virtual environments, caches, Git internals, and generated render bundles. Install dependencies after extraction. No user-level host configuration is changed by packaging.

## Reel renderer and feedback loop (v0.2)

`renderer/Reel.tsx` implements the twelve original treatments; `renderer/PopReel.tsx` supplies their separate flat-color comic/character choreography. `src/reel-layout.ts` contains deterministic beat, seed and safe-area helpers; `src/reel-review.ts` produces editorial heuristics. The runtime schema accepts reel data without modifying the legacy scene contract. `tsconfig.renderer.json` also checks the actual TSX renderer, which was not covered by the original source-only TypeScript check.

A renderer snapshot now includes `Reel.tsx`, `PopReel.tsx`, `reel-layout.ts` and `footage-layout.ts` beside `composition.tsx` and `schema.ts`; their imports resolve within the output folder. `preview` uses the same renderer as `run` and stages only referenced media. It intentionally performs no cloud, voice or ASR execution. Use snapshots or a project copy for choreography that exceeds the preset vocabulary.

The complete 30-second `examples/reel-showcase.json` includes locally generated speech, measured captions and an original score. The 4.8-second `examples/reel-smoke.json` exercises every treatment without speech-model dependencies. To regenerate showcase audio into a **new** directory, use `npx tsx scripts/prepare-reel-showcase.ts /absolute/new/asset-directory` after setting up the optional Python environment. Update the job's relative asset paths if using a different location. The helper refuses to overwrite an existing directory and requires review when the ASR token count differs from the narration script.


## Host adapters and maintenance (v0.4)

Keep creative rules in `skills/`; `references/hosts.md` adapts only environment handling. `scripts/host_adapters.py` promotes a self-contained director for standalone/Claude upload and generates the ChatGPT companion from the same focused modules. `package.py` prunes cache directories before walking and excludes generated demos from install archives. Source archives retain saved demos. Adapter/archive tests check actual resources and paths, not just matching prose.

`src/footage-layout.ts` applies bounded, eased punch-ins on final output time; `footage.layout: full-frame` is an opt-in to preserve backward-compatible padded footage. Do not infer face tracking or semantic cut selection. User media for a production belongs outside this repository and is not a release fixture.

Use [the release procedure](releasing.md) for publication and [compatibility](compatibility.md) for tested versus unverified host paths. The workflow uses a reusable Linux/macOS validation job before publishing a complete draft. Release checksums reject modified or unlisted assets.

## Creative library and 3D (v0.6)

`renderer/World.tsx` uses ThreeCanvas and R3F for genuine scene depth. `src/world.ts` defines strict camera/object contracts and pure frame-time samples; `src/assets3d.ts` checks the supported self-contained GLB envelope before loading. Keep live frame loops and interactive camera damping out of capture. Model geometry/materials come from the selected GLB; transform keys do not play skeletal animation.

Snapshots include World.tsx/world.ts beside the existing components. Preview samples camera keys and midpoints; review reports target clearance only, not mesh collision or taste. Run the original `world-smoke.json` to exercise geometry, texture and GLB staging. `scripts/prepare-world-asset.mjs` regenerates the original prop; `prepare-camera-score.py` regenerates the original music/SFX.

Creative references remain conditional. `ideas` loads one authored recipe, while `scout` extracts local source samples without semantic take selection. Keep fetched source caches outside the repo. Use the pinned creative research addendum and preserve the original 100-entry register. [Evaluation cases](creative-evaluation.md) separate structural/technical checks from future host behavior and audience studies.
