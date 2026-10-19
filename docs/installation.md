# Install Video Forge

Choose the host first. The full toolkit renders locally with Node, Remotion, FFmpeg and a browser. The ChatGPT companion supports planning and local handoff when those tools are unavailable. [Compatibility and verification scope](compatibility.md).

## Codex CLI and desktop

Register the repository marketplace, then install the plugin. **Adding the marketplace alone does not install it.** Current Codex CLI:

```bash
codex plugin marketplace add Sanidhya14321/video-forge --ref v0.5.1
codex plugin add video-forge@video-forge-local
codex plugin list --marketplace video-forge-local --json
```

In a desktop client, the Plugins Directory can install the same entry from the registered Video Forge source. Refresh/reopen the client if it does not yet list the newly registered source. Start a fresh turn/session after installation. Select Video Forge or invoke `$video-forge`. Run `$video-forge-setup` to prepare and verify the rendering runtime.

For a local checkout or extracted Codex archive, use `codex plugin marketplace add /absolute/video-forge` followed by the same `plugin add` selector. The marketplace name is **video-forge-local**; it differs from the Claude marketplace name below. Root `plugin.json` is canonical; `.codex-plugin/plugin.json` is a compatibility fallback.

## Claude Code

```bash
claude plugin marketplace add Sanidhya14321/video-forge
claude plugin install video-forge@video-forge
```

Invoke `/video-forge:video-forge` for directing and `/video-forge:video-forge-setup` for setup. Other focused skills use the same namespace. For a local test, use `claude --plugin-dir /absolute/video-forge` and `claude plugin validate /absolute/video-forge/.claude-plugin/plugin.json`. Exact versioned archives are available when reproducible production needs a fixed release.

## Claude chat / Cowork

Download **video-forge-claude-skill-VERSION.zip** from the release. Upload it as a custom skill using the host's Customize > Skills flow, with code execution/file creation enabled. The ZIP contains one `video-forge/` folder with root `SKILL.md` and all referenced resources. The Claude **plugin** archive is a separate package for a plugin upload or Claude Code.

Ask “Use Video Forge to create a 30-second reel…” and provide the actual project facts and assets. The skill checks the current environment before rendering. If the sandbox lacks Node, binaries, a browser or network permissions, it can finish the plan and project JSON, then hand it to a local host. Uploading the skill alone does not establish that the renderer works there. [Claude's upload instructions](https://support.claude.com/en/articles/12512180-use-skills-in-claude).

## ChatGPT

For **Work with local execution**, use the Codex/OpenAI package and the setup skill in a local-capable session. Local marketplaces and discovery vary by client; see [OpenAI's local plugin instructions](https://developers.openai.com/plugins/build/plugins).

For **chat without the local runtime**, download **video-forge-chatgpt-VERSION.zip**. Extract it and attach `instructions.md` plus the relevant module files, or use them in the instruction/reference-file facilities available in your saved assistant/project surface. `START-HERE.md` explains the workflow. This companion generates briefs, storyboards and version-1 project JSON; it does not install a plugin, run Node or provide a hosted rendering endpoint.

## Prepare the local runtime

In the actual installed/extracted toolkit directory (not an unrelated working directory):

```bash
npm ci
npm run setup:binaries
npm run build
node dist/cli.js doctor
```

Use Node 22+; Node 24 is tested. FFmpeg/ffprobe come from pinned npm dependencies. `setup:binaries` explicitly runs the known FFmpeg/esbuild installers if install scripts were blocked. Alternatively use absolute `FFMPEG_PATH` / `FFPROBE_PATH` overrides for system binaries. Chrome Headless Shell downloads on the first render and may need browser OS libraries. Follow an actual missing-library diagnostic rather than assuming every machine needs the same setup.

The CLI has no separate global npm installation requirement. Use `node /absolute/toolkit/dist/cli.js …`; this toolkit is not published as an npm package. Keep user jobs/assets and output folders outside the installation. Output directories must be new.

Verify setup without speech models or paid services:

```bash
node /absolute/toolkit/dist/cli.js run /absolute/toolkit/examples/reel-smoke.json --out /absolute/workspace/new-smoke
node /absolute/toolkit/dist/cli.js inspect /absolute/workspace/new-smoke/vertical.mp4
```

Prepared showcase audio is bundled in the runtime examples. To generate local speech/transcription, optionally install `uv`, then run `uv sync --project python --python 3.11 --locked` in the toolkit root. Model weights download on first use. Override `VIDEO_FORGE_PYTHON` only when managing a compatible Python environment. Linux and macOS CI checks pass; Windows remains unverified.

## Updates and removal

Use the host's marketplace update flow, then verify the installed version with `plugin list`/component inventory and run doctor. For a pinned Codex marketplace, select the next reviewed tag deliberately. Some CLI versions reject re-adding the same marketplace at a different ref as a different source. In that case, remove only the catalog registration with `codex plugin marketplace remove video-forge-local`, then register `codex plugin marketplace add Sanidhya14321/video-forge --ref vX.Y.Z` and run `codex plugin add video-forge@video-forge-local`. Existing project files stay outside the cache. `marketplace upgrade` refreshes the configured ref; it does not change a version pin. Existing jobs and output folders are independent of the plugin cache. Follow the installed CLI help if flags change.

Codex removal: `codex plugin remove video-forge@video-forge-local`; remove the marketplace separately only if you no longer want its catalog. Claude Code: `claude plugin uninstall video-forge@video-forge`. Do not remove unrelated sources or user output folders.

Never update dependencies automatically in the middle of a production. Optional cloud keys belong in environment variables, never project/release files. Paid providers require explicit selection and a positive spending reservation. No hooks, MCP server or remote account is needed for local video rendering. [Security and privacy](../SECURITY.md).
