# Contributing

Open an issue with a concrete use case, expected behavior and actual output. For rendering problems include a minimal version-1 job, tool versions and doctor output after removing keys, private paths and media you cannot share.

Use Node 24 and the npm lockfile. Install with `npm ci` and `npm run setup:binaries`; run `npm run check` and `npm run build`. Schema changes also need `npm run schema`. Native motion changes need both a preset smoke render and sampled visual review. Provider tests must use mocks unless live paid execution is explicitly authorized and budgeted.

Keep instructions in the shared skills. Host adapters should change installation, capability discovery or handoff; do not fork the creative rules for every model. Use progressive disclosure and keep coverage dispositions/attribution honest. Regenerate host packages with `python3 scripts/package.py --out /new/packages` and validate them with `python3 scripts/validate-archives.py /new/packages`.

Explain the problem, resulting behavior and relevant validation in pull requests. Preserve existing user jobs and outputs; test new output directories. Do not commit credentials, dependency/model caches or private media. See [development](docs/development.md) and [release procedure](docs/releasing.md).
