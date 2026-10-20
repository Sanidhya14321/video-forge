import {cp, mkdir} from 'node:fs/promises';
const root = new URL('../', import.meta.url);
// Repository examples share canonical helpers and the standalone scaffold lock.
// Materialize them for rendering/archives; delivered projects remain self-contained.
for (const name of ['code-smoke', 'motion-studies']) {
  await mkdir(new URL(`examples/${name}/lib/`, root), {recursive: true});
  await cp(new URL('motion/index.tsx', root), new URL(`examples/${name}/lib/index.tsx`, root));
}
for (const file of ['package.json', 'package-lock.json']) {
  await cp(new URL(`templates/short/${file}`, root), new URL(`examples/motion-studies/${file}`, root));
}
