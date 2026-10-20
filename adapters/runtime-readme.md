# Video Forge runtime

Author editable short-form films in TSX with focused creative instructions and local Remotion/FFmpeg tools. The package includes reusable motion helpers, a standalone scaffold, small examples and provenance. [Published films](https://github.com/Sanidhya14321/video-forge/releases/tag/v0.7.0) stay outside installs.

Prepare this directory:

```sh
npm ci
npm run setup:binaries
npm run build
node dist/cli.js doctor
node dist/cli.js init /absolute/new-film
node dist/cli.js preview /absolute/new-film/project.json --out /absolute/new-draft
```

Use `$video-forge` in Codex or `/video-forge:video-forge` in Claude Code. Root `SKILL.md` is the director in standalone/custom-skill packages. [Installation](docs/installation.md) · [Code projects](docs/code-projects.md) · [Compatibility](docs/compatibility.md) · [Notices](NOTICE.md).

Keep production inputs/outputs outside this installation. Python speech/transcription is optional; paid execution requires selected/configured providers and a budget. This package does not install itself, grant credentials or publish content.
