# Host and capability adaptation

Use this only for setup, a host change, or a missing execution capability. The same production contract and creative direction apply across agents; model names do not change the renderer.

Check what the current session can actually read and execute before promising a video. A chat file upload does not install Node, FFmpeg, Chrome, credentials or the local plugin.

| Surface | Entry | Practical execution |
|---|---|---|
| Claude Code | `/video-forge:video-forge` | Use the plugin directory and local shell; run doctor first |
| Claude chat / Cowork | Uploaded custom skill or plugin; natural-language request | Read the bundled root skill; probe the available execution environment. Render only after Node, binaries and browser work there |
| Codex CLI / desktop | Select Video Forge or `$video-forge` | Use the installed plugin root and local shell; run doctor first |
| ChatGPT Work with local execution | Select the installed Video Forge skill | Same runtime checks as Codex; installation does not provision binaries |
| ChatGPT chat without local tools | ChatGPT companion instructions and focused reference files | Produce a brief, storyboard and schema-valid project/handoff. Do not claim a rendered MP4 |

When local execution is available, keep project inputs/outputs in the user's workspace and dependencies in the toolkit directory. Invoke `node <plugin-root>/dist/cli.js` by absolute path; the current working directory may be unrelated. Never assume `npx video-forge` exists on npm. Use the locked dependencies; install only the runtime needed for the task. Optional speech models are not required for the prepared examples.

When execution is unavailable, finish the useful planning work. Supply the explicit project JSON, missing asset list and exact local CLI commands to render it. Distinguish placeholders from real files, estimated script duration from measured audio, and intended QA from executed QA. Offer a local handoff instead of repeatedly attempting unavailable tools or inventing caption times. A renderer extension requires the source package and a capable code environment.

For host installation and current source links, use [installation](../../../docs/installation.md) and [compatibility](../../../docs/compatibility.md). Do not install this plugin into another account or change global settings as an incidental part of video production.
