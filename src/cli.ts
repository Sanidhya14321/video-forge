#!/usr/bin/env node
import { doctor, runProject, loadProject, preflight } from "./runner.js";
import { inspect } from "./media.js";
import path from "node:path";
const args = process.argv.slice(2);
const command = args.shift();
try {
  if (command === "doctor" && args.length === 0)
    console.log(JSON.stringify(await doctor(), null, 2));
  else if (command === "inspect" && args.length === 1)
    console.log(JSON.stringify(await inspect(path.resolve(args[0])), null, 2));
  else if (command === "run" && args[0]) {
    const outIndex = args.indexOf("--out");
    if (
      outIndex >= 0 &&
      (!args[outIndex + 1] || args[outIndex + 1].startsWith("--"))
    )
      throw new Error("--out requires a new directory path");
    if (
      args.some(
        (x, i) =>
          i > 0 && x !== "--out" && i !== outIndex + 1 && x !== "--dry-run",
      )
    )
      throw new Error("Unknown run option");
    if (args.includes("--dry-run")) {
      const p = await loadProject(args[0]);
      await preflight(p, path.dirname(path.resolve(args[0])));
      console.log(
        JSON.stringify({ valid: true, project: p.name, execution: false }),
      );
    } else
      console.log(
        JSON.stringify(
          await runProject(
            args[0],
            outIndex >= 0 ? args[outIndex + 1] : undefined,
          ),
          null,
          2,
        ),
      );
  } else {
    console.log(
      "Video Forge\n\n  video-forge doctor\n  video-forge run <project.json> [--out <new-directory>] [--dry-run]\n  video-forge inspect <video>",
    );
    if (command) process.exitCode = 1;
  }
} catch (error) {
  console.error(`Video Forge: ${(error as Error).message}`);
  process.exitCode = 1;
}
