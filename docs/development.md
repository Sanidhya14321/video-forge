# Development

Use Node22+ (Node24 in CI), `npm ci`, `npm run build`, then `npm run check`. Regenerate schemas with `npm run schema` after contract changes.

## Maintained source

- `src/`: CLI, version-1 runner, version-2 custom composition pipeline, schemas and media/provider tools.
- `renderer/`: structured legacy compositions; `motion/`: canonical composable TSX helpers.
- `templates/short/`: standalone editable project and pinned lock/font.
- `examples/`: small working jobs and silent motion studies. Build materializes shared helpers/locks instead of maintaining copies.
- `skills/`, `sources/`: conditional creative instructions, attribution and the100-entry coverage register.
- `tests/`: contract, media and distribution regressions; `scripts/`: maintained build/release tools.
- `dist/`: prebuilt CLI for agent installations. Rebuild it with source changes; CI checks for stale output.

Use CLI `init` for a custom composition; do not modify plugin internals to author a film. See [code projects](code-projects.md). Keep personal production inputs, outputs, dependency caches and credentials outside version control. The fixture media is intentional test material; published productions are linked from [demonstrations](../demos/README.md).

`npm run examples -- --out /absolute/new-directory` renders the three original structured workflows using supplied fixtures. The algorithm example requires optional local Python speech/transcription dependencies. Rendering never writes into the source checkout by default. Smaller `reel-smoke`, `pop-smoke`, `overlay-smoke`, `world-smoke` and `code-smoke/project.json` jobs exercise individual runtime paths without paid APIs.

## Validation and distribution

CI runs TypeScript, renderer checks and tests on Linux/macOS, plus native renders and optical regression on Linux. `scripts/sync-examples.mjs` derives example resources; `scripts/package_policy.py` defines the release inventory. Add new required binary fixtures there deliberately. Packages exclude productions, caches, secrets and arbitrary media; building from an extracted source archive remains supported.

All100 catalog entries and newly inspected motion sources retain pinned revisions and rights. `scripts/audit_sources.py` can refresh resolved pinned evidence; it does not execute upstream code. Keep media attribution distinct from code attribution.

Provider transport tests are mocked. Paid requests need selected adapters, credentials and a configured reservation; timeouts do not prove cancellation. The budget is not an account-wide billing cap. [Release procedure](releasing.md) · [Validation scope](validation.md).
