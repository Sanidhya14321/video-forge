#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const command = args.shift();
const print = (value: unknown) => console.log(JSON.stringify(value, null, 2));
const isCode = async (file: string) => JSON.parse(await readFile(file, 'utf8')).version === 2;

// Load rendering dependencies only for commands that use them.
try {
  if (command === 'init' && args.length === 1) {
    print(await (await import('./code-project.js')).initCode(args[0]));
  } else if (command === 'ideas' && args.length === 1) {
    print(await (await import('./ideas.js')).shotIdeas(args[0]));
  } else if (command === 'scout' && args.length === 3 && args[1] === '--out') {
    print(await (await import('./scout.js')).scoutVideo(args[0], args[2]));
  } else if (command === 'doctor' && args.length === 0) {
    print(await (await import('./runner.js')).doctor());
  } else if (command === 'inspect' && args.length === 1) {
    print(await (await import('./media.js')).inspect(path.resolve(args[0])));
  } else if (command === 'review' && args.length === 1) {
    if (await isCode(args[0])) print(await (await import('./code-project.js')).reviewCode(args[0]));
    else {
      const {projectSchema} = await import('./schema.js');
      const {reviewProject} = await import('./reel-review.js');
      print(reviewProject(projectSchema.parse(JSON.parse(await readFile(args[0], 'utf8')))));
    }
  } else if (command === 'preview' && args.length === 3 && args[1] === '--out') {
    print(await isCode(args[0])
      ? await (await import('./code-project.js')).runCode(args[0], args[2], true)
      : await (await import('./runner.js')).previewProject(args[0], args[2]));
  } else if (command === 'run' && args[0]) {
    const outIndex = args.indexOf('--out');
    if (outIndex >= 0 && (!args[outIndex + 1] || args[outIndex + 1].startsWith('--')))
      throw new Error('--out requires a new directory path');
    if (args.some((x, i) => i > 0 && x !== '--out' && i !== outIndex + 1 && x !== '--dry-run'))
      throw new Error('Unknown run option');
    if (await isCode(args[0])) {
      const {checkCode, runCode} = await import('./code-project.js');
      print(args.includes('--dry-run') ? await checkCode(args[0]) : await runCode(args[0], outIndex >= 0 ? args[outIndex + 1] : undefined));
    } else {
      const {loadProject, preflight, runProject} = await import('./runner.js');
      if (args.includes('--dry-run')) {
        const project = await loadProject(args[0]);
        await preflight(project, path.dirname(path.resolve(args[0])));
        const {reviewProject} = await import('./reel-review.js');
        print({valid: true, project: project.name, execution: false, review: reviewProject(project)});
      } else print(await runProject(args[0], outIndex >= 0 ? args[outIndex + 1] : undefined));
    }
  } else {
    console.log('Video Forge\n\n  video-forge init <new-directory>\n  video-forge doctor\n  video-forge ideas list|<id>\n  video-forge scout <video> --out <new-directory>\n  video-forge run <project.json> [--out <new-directory>] [--dry-run]\n  video-forge inspect <video>\n  video-forge review <project.json>\n  video-forge preview <project.json> --out <new-directory>');
    if (command && command !== '--help' && command !== '-h') process.exitCode = 1;
  }
} catch (error) {
  console.error(`Video Forge: ${(error as Error).message}`);
  process.exitCode = 1;
}
