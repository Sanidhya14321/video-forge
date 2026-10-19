# Installation

Video Forge is a local desktop/CLI plugin. A skills-only host without shell, Node, filesystem, or browser-rendering access can use its guidance but cannot run its tools. No MCP server or lifecycle hook is required.

## Runtime

Use Node.js 22 or newer (tested here with Node 24). In the extracted toolkit directory:

```bash
npm ci
npm run build
node dist/cli.js doctor
node dist/cli.js run examples/product-demo.json
```

The lockfile pins compatible Remotion packages. FFmpeg and ffprobe are provided through npm dependencies on supported platforms. If npm reports blocked install scripts, review and allow the `ffmpeg-static` and `esbuild` scripts according to your npm version, then reinstall. The included `npm run setup:binaries` executes these known dependency installers explicitly. Alternatively install system FFmpeg and set absolute `FFMPEG_PATH` and `FFPROBE_PATH` values. On unsupported CPU/platform combinations use system binaries.

Remotion downloads Chrome Headless Shell on the first render. Local rendering may need OS browser libraries; use Remotion's documented Linux dependency setup if startup reports a missing shared library. These first-use downloads are not bundled in release archives.

The environment used for this delivery is Linux x64. CI defines Linux/macOS checks, but a successful macOS run has not been observed here. Windows is not yet tested.

## Optional local speech and transcription

Install uv, then from the toolkit directory:

```bash
uv sync --project python --python 3.11 --locked
node dist/cli.js doctor
node dist/cli.js run examples/algorithm-explainer.json
```

Python is isolated at `python/.venv`; CPU PyTorch and the English spaCy model are included in the lock. Model weights download on first use. The Python 3.11 environment is deliberate: the host's system Python may be newer than supported ML wheels. Set `VIDEO_FORGE_PYTHON` to another compatible environment's absolute Python executable only when managing dependencies yourself.

## Claude Code

For local testing, launch Claude Code with the extracted plugin directory:

```bash
claude --plugin-dir /absolute/path/to/video-forge
```

Use `/video-forge:video-forge` for the directing skill or ask a matching natural-language request. Focused commands include `/video-forge:video-motion`, `/video-forge:video-editing`, and the other packaged skill names. Validate the package with `claude plugin validate /absolute/path/to/video-forge`.

For marketplace distribution, the archive includes `.claude-plugin/plugin.json` and the same `skills/` content. The repository also includes a marketplace catalog for GitHub distribution.

## Codex

The package includes portable `plugin.json` and a compatibility `.codex-plugin/plugin.json`, both pointing to the shared skills. Add the extracted package to a local plugin marketplace using the current Codex plugin flow. A repository-scoped example is included at `.agents/plugins/marketplace.json`. Register this root with `codex plugin marketplace add /absolute/path/to/video-forge` when you choose to install it, then use the plugin directory in your client. Merely running the CLI in this folder may not list an unregistered marketplace. Follow the official packaging guide if your installed client uses a different marketplace interface.

For a simple standalone install, extract the standalone archive as `~/.agents/skills/video-forge/` (or the skill directory documented by your agent). It contains a root `SKILL.md`, all workflow references, and the runtime package. Run `npm ci && npm run build` inside that folder. Invoke `$video-forge` in Codex. The installer does not alter user-level configuration automatically.

## Other agents

Use the standalone skill archive in an Agent Skills-compatible directory. Keep the whole folder: its instructions refer to bundled runtime and sibling workflow resources. Only the metadata/frontmatter and workflow instructions are portable; shell permissions, dependency installation, and plugin discovery remain host responsibilities.

## Updates and credentials

Do not auto-update upstream packages during a production run. Change pinned versions deliberately, rerun checks and examples, and rebuild release archives. Store optional API credentials in environment variables; no example or source catalog contains secrets. Default examples use local processing only.

## GitHub distribution (v0.2.0)

Versioned host/source archives, demo media and checksums are published at [Video Forge releases](https://github.com/Sanidhya14321/video-forge/releases). Extract an archive and run `npm ci`, `npm run setup:binaries`, and `npm run build` in its toolkit directory before rendering. The portable skill folder includes the runtime and examples; a lone SKILL.md without its references/runtime is insufficient.

For Claude Code, add this repository's marketplace and install its entry:

```bash
claude plugin marketplace add Sanidhya14321/video-forge
claude plugin install video-forge@video-forge
```

Then invoke `/video-forge:video-forge` and describe the film. For a local development checkout, `claude --plugin-dir /absolute/path/to/video-forge` still works. The marketplace catalog and the plugin manifest both point at the shared root skills; [Claude's marketplace documentation](https://code.claude.com/docs/en/plugin-marketplaces) explains these commands.

For Codex, register this Git source:

```bash
codex plugin marketplace add Sanidhya14321/video-forge
```

Then install Video Forge from that source in the client's Plugins Directory. Adding a source alone does not install a plugin. Alternatively extract the standalone archive into `~/.agents/skills/video-forge/`, prepare its Node runtime as above, and invoke `$video-forge`. See [official OpenAI packaging guidance](https://developers.openai.com/plugins/build/plugins) for marketplace setup. This repository is a GitHub distribution, not a submission to either public universal directory.

The showcase includes ready-made voice/music and captions, so it renders without optional Python models. Regenerating speech/transcription still needs the locked Python setup. No personal host settings are changed by building or packaging this repository.
