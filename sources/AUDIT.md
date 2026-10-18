# Source audit — 19 October 2026

The supplied PDF contains 100 ranked entries across ten categories. All ranks 1–100 are represented exactly once in `catalog.json`; reported scores are metadata and were not regraded.

## Results

{
  "reference guidance": 83,
  "implemented and tested": 2,
  "unverified/unavailable": 15
}

Inspection specificity:

{
  "skill-inspected": 50,
  "readme-inspected": 9,
  "package-skills-inspected": 26,
  "unverified": 15
}

## Method

The PDF's catalog was extracted and wrapped names corrected against its visible tables. Canonical repository candidates were discovered through its named GitHub lists and targeted searches, then inspected directly. Repository HEAD revisions were resolved, and README/SKILL/supporting-reference/license evidence was read where available and recorded with SHA-256 hashes. Ambiguous names were not matched merely by fuzzy spelling. GitHub API rate limiting reduced some deep package inspection; those records remain README-only or package-level rather than claiming exact skill inspection.

Exact skill inspection, related skills within a package, and README-only inspection are separate labels. The register may include several package evidence files; inspection of a package does not prove that a particular historical sub-skill still exists. Dependencies are evidence-derived mentions, not an exhaustive transitive install plan.

Two entries are marked implemented and tested only for the explicitly scoped Video Forge subset. The other resolved entries contribute reference guidance. Unresolved entries retain a PDF-described summary, intended destination, and reason; no canonical link or revision is invented. The release does not implement 100 independent tools.

No upstream code, full skill corpus, or media library is vendored. Techniques were synthesized into original workflow references, with engine-specific rules kept conditional. Per-entry summaries are on-demand references rather than always-loaded context.

## Corrections to the report

HyperFrames is a separate HTML-native engine rather than a layer on Remotion. Current Remotion skill names differ from the report's install example. The faceless-shorts compatibility label differs between the catalog and playbook. Rankings, marketplace counts, per-video costs, speed figures, and platform upload limits are dated report claims and are not runtime defaults. Word-level ASR timing is estimated alignment and is not guaranteed exact.

## Refresh

Run `python3 scripts/audit_sources.py --rank 2` to verify pinned evidence hashes. Refreshing to a newer revision is a deliberate maintenance task. The script performs read-only HTTP retrieval and does not execute upstream instructions.
