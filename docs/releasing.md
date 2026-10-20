# Release maintenance

Use semantic versions; never move published tags or silently replace published assets.

1. Update package/lock and all three plugin manifests, changelog, installation pin and `docs/releases/vX.Y.Z.md`.
2. Run `npm run build`, `npm run check`, affected native smoke renders and relevant visual review. Confirm `git diff -- dist` contains the intended build. Stage all maintained source changes.
3. Package into an empty directory outside the checkout: `python3 scripts/package.py --out /new/packages`. Validate all six archives with `python3 scripts/validate-archives.py /new/packages`.
4. Run `prepare-release.py --out /new/packages`, then `verify-release.py /new/packages`. Unexpected or stale assets fail preparation. The release contains current packages and SHA256 manifests; unchanged demonstrations remain in their original release.
5. Commit/push reviewed changes, then push an annotated version tag. GitHub runs Linux/macOS gates, uploads a draft, and publishes only when every upload succeeds.
6. Verify remote CI and published asset sizes/digests against local files. Verify the installed host version/resources and a native render. Keep machine-specific results outside distributable source.

The explicit inventory in `scripts/package_policy.py` excludes production output, caches, environment files and unlisted binary media. Source archives include development tooling; host archives omit GitHub workflows, showcase output and host-inapplicable metadata. ChatGPT is an instruction/code companion without a renderer. Shared example helpers/locks are generated from canonical sources before packaging; each delivered example stays editable.

Old production media, attribution and reports remain available from [demonstrations](../demos/README.md), immutable tags and historical releases. Git history is preserved. Marketplace submission and social publishing remain separate actions.
