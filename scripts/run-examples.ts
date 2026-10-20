import {runProject, root} from '../src/runner.js';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--out')) throw new Error('Usage: npm run examples -- --out <new-directory>');
const output = path.resolve(args[1] ?? path.join(root, '..', `video-forge-examples-${Date.now()}`));
if (output === root || output.startsWith(root + path.sep)) throw new Error('Choose an examples output directory outside the repository');
await mkdir(output, {recursive: false});
for (const name of ['product-demo', 'algorithm-explainer', 'footage-repurpose']) {
  console.log(await runProject(path.join(root, 'examples', `${name}.json`), path.join(output, name)));
}
