# Host compatibility

One shared production skill set; small adapters change discovery and handoff, not renderer quality. Host support is a capability check, not a model-specific prompt trick.

| Host | Package / entry | What is supported | Verification |
|---|---|---|---|
| Codex CLI / desktop | `codex` archive or Git marketplace; Video Forge / `$video-forge` | Nine discoverable skills, setup workflow, local production CLI | Manifest discovery, clean install and native render checked locally |
| Claude Code | `claude` plugin archive or Git marketplace; `/video-forge:video-forge` | Nine namespaced skills and local production CLI | Strict plugin/marketplace validation and component inventory checked locally |
| Claude chat / Cowork | `claude-skill` ZIP, or Claude plugin upload | Self-contained director with focused references; production when its environment passes runtime checks | Archive/resource structure checked; account upload and cloud runtime not tested |
| ChatGPT Work with local execution | Codex/OpenAI plugin package; select Video Forge | Same local production tools when installed and prepared | Shared package and local execution checked; separate ChatGPT account install not tested |
| ChatGPT chat | `chatgpt` companion ZIP, attach instruction + needed reference files | Brief, script, storyboard, native project JSON and local rendering handoff | Generated references, schema and example jobs checked; no hosted renderer bundled |
| Other Agent Skills hosts | `standalone` ZIP | Root `SKILL.md`, focused modules and local tools if the host provides execution | Archive/resource structure checked |

## Why separate packages

Claude Code plugins have `.claude-plugin/plugin.json`. The portable OpenAI package has root `plugin.json`, `skills/`, an OpenAI presentation/setup extension, and a legacy `.codex-plugin/plugin.json` fallback. The OpenAI package declares local execution for the rendering toolkit. Claude custom-skill upload expects the skill folder with a root `SKILL.md`, so its archive promotes the director and rewrites its resource links.

ChatGPT companion files are intentionally a planning/handoff adapter. They do not install the plugin or provision Node, Chrome or FFmpeg. They are generated from the same maintained skill/reference source and contain no credentials or demo binaries. Read only the modules relevant to the current request. In a local-capable Work session, use the full plugin instead.

Runtime archives exclude generated demo folders. The prepared example inputs, sources, scripts, renderer, lockfiles, licenses and full 100-entry register remain included. The source archive preserves all tracked demo outputs. An install archive is not a dependency bundle; `npm ci` and first-render browser provisioning still require network access.

## Current primary documentation

Checked 19 October 2026:

- [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins): portable manifests, local marketplaces, setup skills and host-specific metadata.
- [OpenAI desktop execution](https://developers.openai.com/plugins/deploy/desktop-only): a local execution requirement does not deploy tools into a web session.
- [OpenAI skills](https://developers.openai.com/plugins/concepts/skills): reusable skill folders and conditional loading.
- [Claude Code plugins](https://code.claude.com/docs/en/plugins) and [marketplaces](https://code.claude.com/docs/en/plugin-marketplaces): plugin structure and namespaced installation.
- [Claude custom skills](https://support.claude.com/en/articles/12512180-use-skills-in-claude) and [skill archive structure](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills): upload and code-execution prerequisites.

Account/organization policy and host versions can affect availability. The project has not been submitted to a public plugin directory or deployed as a remote rendering service.

## v0.6 creative resources

All host packages use the same taste, asset, cinematography, Premiere, editorial and platform references. Claude Code keeps namespaced skill discovery; Codex keeps focused skills with its UI metadata. The director selects relevant resources rather than concatenating every source. Individual recipes can be read through the local CLI; non-executing hosts can read the supplied JSON index directly.

ChatGPT companion generation flattens the new reference links and includes recipe/asset indexes; binary models remain source links rather than falsely bundled local files. Real 3D execution requires the pinned Three.js/R3F dependencies, WebGL-capable headless Chrome and the local runtime. Live Premiere/After Effects, external models with compression decoders, skeletal animation and paid generated-video quality remain separate capabilities.

OpenAI-specific guidance additionally checked 20 October 2026: [building skills](https://developers.openai.com/plugins/build/skills) and [Claude plugin portability](https://developers.openai.com/plugins/guides/submit-claude-plugin). The shared production language remains provider-neutral; product names are kept only in actual host setup/verification instructions. No marketplace submission is implied.
