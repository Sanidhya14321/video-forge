# Release maintenance

Use semantic versions. Never move a published tag or replace published archives to hide a fix. Keep older media/releases available; mark only the newest stable release as latest. A correction to documentation or packaging receives a new version when the distributable changes.

1. Update `package.json`, the lockfile root package and all three plugin manifests together. Update the changelog, compatibility/installation instructions and `docs/releases/vX.Y.Z.md`.
2. Run `npm run check`, `npm run build`, all affected native smoke/production jobs and relevant visual review. Skill changes need frontmatter/link validation and realistic routing review; host metadata is not proof of live account invocation.
3. Build into a separate directory: `python3 scripts/package.py --out /new/release-assets`. Validate all six packages with `python3 scripts/validate-archives.py /new/release-assets`.
4. Run `python3 scripts/prepare-release.py --out /new/release-assets`, then `python3 scripts/verify-release.py /new/release-assets`. This collects both demos, the comparison, archives, a JSON asset manifest and checksums.
5. Commit, push the reviewed changes, and push an annotated version tag. The release workflow first calls the Linux/macOS validation workflow, then packages that tag and creates a **draft** release. It publishes only after all uploads complete. Existing published tags are not overwritten.
6. Verify remote CI, the published asset list and GitHub SHA-256 digests against local files. Verify a clean host install and native render; keep that machine-specific evidence outside distributable packages. Choose the new pin explicitly when updating an installed production plugin.

The `source` archive includes saved demo outputs; install archives exclude generated demos but retain prepared example inputs, runtime, skill references and provenance. The `claude-skill` archive has a root director; the `chatgpt` archive has instruction/reference files and no local renderer. Archives exclude dependency/model caches and browser bundles.

Release preparation never makes provider calls, installs personal plugins, submits marketplace listings or publishes social posts. Those are separate actions. GitHub distribution is distinct from public plugin-directory submission.
