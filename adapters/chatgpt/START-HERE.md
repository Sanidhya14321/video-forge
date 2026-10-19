# Video Forge for ChatGPT

This companion is a portable set of instructions and focused reference files. It is not a hosted renderer, an MCP server, or an installed ChatGPT plugin.

In a chat that can read uploaded files, attach `instructions.md` and the relevant module file(s), then describe your video. For a saved assistant/project setup, use the instruction text in that surface's instruction field and attach the reference files where supported. Do not paste the entire collection into every prompt.

Example: “Using Video Forge, plan a 30-second playful explainer about my product. Bold flat colors, no gradients. Give me a storyboard and a version-1 project JSON for local rendering.” Include the actual product facts and asset filenames.

For local execution in ChatGPT Work, use the Codex/OpenAI plugin package in a local-capable session and run its setup skill. Ordinary chat can produce production plans and code, but this bundle does not grant a local shell or browser. When those capabilities are missing, hand the project to Codex/Claude Code with the runtime installed.

Local handoff (after extracting a runtime archive and preparing it with `npm ci`, `npm run setup:binaries`, `npm run build`):

```bash
node /absolute/toolkit/dist/cli.js doctor
node /absolute/toolkit/dist/cli.js review /absolute/project/project.json
node /absolute/toolkit/dist/cli.js run /absolute/project/project.json --dry-run
node /absolute/toolkit/dist/cli.js run /absolute/project/project.json --out /absolute/new/output
```

Repository, runtime archives and video examples: https://github.com/Sanidhya14321/video-forge/releases

Native planning/reference use is packaged here. Live ChatGPT account upload/invocation is not claimed as verified. For current local-plugin setup see https://developers.openai.com/plugins/build/plugins and for skills see https://developers.openai.com/plugins/concepts/skills.
