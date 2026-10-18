import { runProject, root } from "../src/runner.js";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
const dir = path.join(root, "demos");
await mkdir(dir, { recursive: true });
for (const name of ["product-demo", "algorithm-explainer"]) {
  console.log(`Rendering ${name}`);
  const result = await runProject(
    path.join(root, "examples", `${name}.json`),
    path.join(dir, name),
  );
  console.log(result.output);
}
await import("./prepare-footage-example.js");
console.log("Rendering footage-repurpose");
console.log(
  (
    await runProject(
      path.join(root, "examples", "footage-repurpose.json"),
      path.join(dir, "footage-repurpose"),
    )
  ).output,
);
