# Development

## Structure

`src/` contains schema validation, local media operations, optional provider adapters, the runner, and the CLI. `renderer/Root.tsx` is the built-in composition. `python/` is an isolated optional CPU model environment. `skills/` contains shared Agent Skills used by both plugin hosts. `sources/` is an evidence and coverage register, not executable third-party instructions.

Use Node 22+ and `npm ci`. Run `npm run check` after changes. Run `npm run schema` after modifying the job schema. Run `npm run examples` in a clean `demos/` directory for end-to-end rendering and local speech verification. CI runs structural checks on Ubuntu and macOS and a product render on Linux.

## Custom compositions

For a custom design, copy the toolkit into the user's production project, change `renderer/Root.tsx`, and keep the project contract and frame timing stable. `Panel` owns built-in scene visuals. `Captions` uses global output time; scenes inside a `Sequence` receive local frame time. Use explicit structured fields for new scene behavior and extend the Zod schema and tests together.

A completed run preserves a renderer snapshot at `composition.tsx` plus `schema.ts`, staged assets, render props, and a browser bundle. Re-render the unchanged bundle with `renderMedia` from `@remotion/renderer`, passing `serveUrl` as the absolute bundle path, `id: VideoForge`, and the saved input props. To change the snapshot itself, rebundle `composition.tsx` with `publicDir` set to the run's `assets` directory. Resolve npm dependencies from the toolkit or install the pinned packages in that project. Copying a TSX file alone is insufficient to carry dependencies or media.

The source `project.json` preserves original input paths for reproducibility in the original production workspace. To move a production independently, use staged `render-props.json` and the composition bundle, or update the project inputs to staged paths. The manifest maps these assets by hash.

## Provider extensions

Keep request authentication and transport in a provider module. Validate all required local inputs and credentials before paid submission. Persist a reservation before submitting, retain returned request IDs, and query the existing request through terminal states. A timeout is not proof of cancellation. New result shapes need explicit adapters; do not infer them from model marketing copy.

Transport tests are mocked and make no billable calls. Account-level billing enforcement belongs with the provider; the local reservation file is a production control, not an account-wide credit limit.

## Auditing sources

`python3 scripts/audit_sources.py` refreshes already resolved evidence URLs using pinned commits and hashes. It never executes upstream code. New/ambiguous names require a deliberate canonical-source decision; do not resolve them by fuzzy name similarity alone. Review a relevant SKILL.md plus supporting references when available, update inspection specificity, and record the useful lesson and its destination. Raw research caches stay outside release packages.

Unresolved PDF entries are retained with reasons and candidate-search notes. Discovery-directory counts, scores, runtime costs, and speed claims are not copied into production defaults.

## Release

Update package and plugin versions together. Build with `npm run build`, validate, render representative examples, review frames, then run `npm run package`. Packaging uses deterministic member order and timestamps and excludes installed dependencies, virtual environments, caches, Git internals, and generated render bundles. Install dependencies after extraction. No user-level host configuration is changed by packaging.
