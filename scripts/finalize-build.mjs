import {chmod} from 'node:fs/promises';
import './sync-examples.mjs';
if (process.platform !== 'win32') await chmod(new URL('../dist/cli.js', import.meta.url), 0o755);
