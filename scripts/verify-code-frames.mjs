import {verifyCodeFrames} from '../dist/code-project.js';
const [project,out,...frames]=process.argv.slice(2);if(!project||!out||!frames.length)throw new Error('Usage: node scripts/verify-code-frames.mjs project.json new-output frame frame ...');
console.log(JSON.stringify(await verifyCodeFrames(project,out,frames.map(Number)),null,2));
