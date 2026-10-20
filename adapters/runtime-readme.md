# Video Forge0.7 — code-authored short-form video

Use `node dist/cli.js init /absolute/new-film`, edit its React/TSX and frame score, then `preview` and `run`. See [code projects](docs/code-projects.md) and [motion recipes](skills/video-motion/references/code-motion.md).

# Video Forge runtime

An editable video toolkit with local Remotion/FFmpeg tools and focused agent skills. This install package omits generated demo folders; [watch/download examples on GitHub](https://github.com/Sanidhya14321/video-forge/releases). The source archive retains complete demo material.

Prepare this directory:

```bash
npm ci
npm run setup:binaries
npm run build
node dist/cli.js doctor
node dist/cli.js run examples/reel-smoke.json --out /absolute/new/workspace/smoke
```

Use the setup skill or ask Video Forge to check this installation. In Claude Code use `/video-forge:video-forge`; in Codex select Video Forge or invoke `$video-forge`. The Claude custom-skill/standalone archive has `SKILL.md` directly in this folder.

[Installation](docs/installation.md) · [Host compatibility](docs/compatibility.md) · [Project contract](docs/project-format.md) · [Licenses](NOTICE.md) · [Release assets](https://github.com/Sanidhya14321/video-forge/releases/latest)

Prepared media is included in `examples/assets/`; speech model installation is optional. Install Python dependencies only to regenerate speech/transcription. Keep projects and output directories in the user's workspace, outside this installation. Paid providers are disabled unless selected, configured and budgeted. This archive does not install itself or publish anything.
