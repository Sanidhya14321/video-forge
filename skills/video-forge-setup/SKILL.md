---
name: video-forge-setup
description: "Set up or diagnose Video Forge in an agent host, verify local rendering prerequisites, and choose a usable production or planning path."
---

# Video Forge Setup

Locate the toolkit root two directories above this skill folder. Read [installation](../../docs/installation.md) for the current host and [host adaptation](../video-forge/references/hosts.md) for capability differences.

Use the current installation rather than creating another copy. Run `node <toolkit-root>/dist/cli.js doctor` when dependencies exist. If Node modules are missing, prepare the locked runtime in that root with `npm ci`, `npm run setup:binaries`, and `npm run build`, then run doctor again. Respect the session's permissions. No credentials or paid services are needed for the local smoke job.

Verify with `run <toolkit-root>/examples/reel-smoke.json --out <new-workspace-directory>` and `inspect <new-workspace-directory>/vertical.mp4`. Report the actual installed version, discovered skills and successful checks. Setup is complete when the required runtime and local render work, not merely when a marketplace was added.

Install optional Python speech/transcription only when needed for the user's workflow. In an environment without shell/browser access, provide the planning/handoff route from [compatibility](../../docs/compatibility.md), without claiming a local runtime was installed. Do not change other host settings or publish content as part of setup.
