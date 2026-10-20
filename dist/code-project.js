import { z } from 'zod';
import { wordsSchema } from './schema.js';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, cp, mkdtemp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia, renderStill, openBrowser } from '@remotion/renderer';
import { inspect, readable, ensureBinary, readWords, srt } from './media.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const positive = z.number().int().positive();
export const scoreSchema = z.array(z.object({
    startFrame: z.number().int().nonnegative(), endFrame: positive,
    kind: z.enum(['shot', 'reading', 'transition', 'accent', 'audio']), label: z.string().min(1),
    mechanism: z.string().optional(),
}).strict().refine(e => e.endFrame > e.startFrame, 'endFrame must exceed startFrame'));
export const codeProjectSchema = z.object({
    version: z.literal(2), name: z.string().min(1), entryPoint: z.string().min(1),
    compositionId: z.string().min(1), publicDir: z.string().default('public'),
    inputProps: z.record(z.string(), z.unknown()).default({}),
    gl: z.enum(['angle', 'swangle']).default('angle'), score: z.string().default('score.json'), captions: z.object({ transcript: z.string() }).strict().optional(), quality: z.enum(['draft', 'final']).default('final'),
    overrides: z.object({ width: positive.optional(), height: positive.optional(), fps: z.number().positive().max(120).optional(), durationInFrames: positive.optional() }).strict().default({}),
    exports: z.array(z.object({ name: z.string().regex(/^[a-zA-Z0-9_-]+$/), width: positive.optional(), height: positive.optional() }).strict().refine(t => Boolean(t.width) === Boolean(t.height), 'Set both width and height')).min(1).default([{ name: 'vertical' }]),
    requires: z.object({ htmlInCanvas: z.boolean().default(false), audio: z.boolean().default(false) }).strict().default({ htmlInCanvas: false, audio: false }),
}).strict();
export function draftScale(width, height) { if (width <= 540)
    return 1; const gcd = (a, b) => b ? gcd(b, a % b) : a; const d = gcd(width, height), n = Math.floor(540 / (width / d * 2)); return n > 0 ? 2 * n / d : 1; }
export async function isCodeProject(file) { return JSON.parse(await readFile(file, 'utf8')).version === 2; }
export async function readCodeProject(file) { return codeProjectSchema.parse(JSON.parse(await readFile(file, 'utf8'))); }
export async function reviewCode(file) {
    const project = await readCodeProject(file), base = path.dirname(path.resolve(file));
    const score = scoreSchema.parse(JSON.parse(await readFile(path.resolve(base, project.score), 'utf8')));
    const warnings = [];
    const shots = score.filter(e => e.kind === 'shot');
    for (let i = 2; i < shots.length; i++)
        if (shots[i].mechanism && shots[i].mechanism === shots[i - 1].mechanism && shots[i].mechanism === shots[i - 2].mechanism)
            warnings.push({ code: 'repeated-structure', message: `Inspect consecutive ${shots[i].mechanism} shots at frame ${shots[i].startFrame}; continuity may justify repetition.` });
    const pacing = shots.map(shot => { const markers = [shot.startFrame, ...score.filter(e => ['accent', 'transition'].includes(e.kind) && e.startFrame > shot.startFrame && e.startFrame < shot.endFrame).map(e => e.startFrame), shot.endFrame].sort((a, b) => a - b); return { label: shot.label, startFrame: shot.startFrame, endFrame: shot.endFrame, longestDeclaredEventGapFrames: Math.max(...markers.slice(1).map((f, i) => f - markers[i])), readingWindows: score.filter(e => e.kind === 'reading' && e.startFrame < shot.endFrame && e.endFrame > shot.startFrame).length }; });
    return { version: 2, name: project.name, score, pacing, warnings, limits: 'The authored score is declared metadata, not automatic analysis of pixels, source code, reading comprehension or taste. Review moving output.' };
}
async function filesAt(dir) {
    const result = [];
    for (const e of await readdir(dir, { withFileTypes: true })) {
        if (e.isSymbolicLink())
            throw new Error(`Use ordinary project files, not symlinked assets: ${path.join(dir, e.name)}`);
        if (e.isDirectory())
            result.push(...await filesAt(path.join(dir, e.name)));
        else if (e.isFile())
            result.push(path.join(dir, e.name));
    }
    return result;
}
async function browserCapabilities(browser) {
    const page = await browser.newPage({ context: () => null, logLevel: 'error', indent: false, pageIndex: 0, onBrowserLog: null, onLog: () => { } });
    try {
        return await page.evaluate(() => { const gl = document.createElement('canvas').getContext('webgl'), debug = gl?.getExtension('WEBGL_debug_renderer_info'); return { webgl: Boolean(gl), renderer: gl && debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : null, htmlInCanvas: typeof HTMLCanvasElement.prototype.captureElementImage === 'function', userAgent: navigator.userAgent }; });
    }
    finally {
        await page.close();
    }
}
async function prepare(file) {
    await Promise.all([ensureBinary('ffmpeg'), ensureBinary('ffprobe')]);
    const project = await readCodeProject(file), base = path.dirname(path.resolve(file));
    const entryPoint = path.resolve(base, project.entryPoint), publicDir = path.resolve(base, project.publicDir);
    if (!entryPoint.startsWith(base + path.sep) || !publicDir.startsWith(base + path.sep))
        throw new Error('Keep entryPoint and publicDir inside the project directory for portable source delivery');
    await readable(entryPoint);
    await readable(publicDir);
    const review = await reviewCode(file), assets = await filesAt(publicDir);
    const words = project.captions ? wordsSchema.parse(await readWords(path.resolve(base, project.captions.transcript))) : [];
    const temp = await mkdtemp(path.join(os.tmpdir(), 'video-forge-code-'));
    try {
        const serveUrl = await bundle({ entryPoint, publicDir, outDir: path.join(temp, 'bundle'), webpackOverride: config => ({ ...config, plugins: [...(config.plugins ?? []), { apply(compiler) { compiler.hooks.afterCompile.tap('VideoForgePortableProject', (compilation) => { for (const module of compilation.modules) {
                            const resource = module.resource?.split('?')[0];
                            if (resource && path.isAbsolute(resource) && !resource.startsWith(base + path.sep) && !resource.includes(path.sep + 'node_modules' + path.sep))
                                compilation.errors.push(new Error(`Local import is outside the editable project: ${resource}. Copy source/assets into the project so delivery remains portable.`));
                        } }); } }], resolve: { ...config.resolve, modules: [path.join(root, 'node_modules'), ...(config.resolve?.modules ?? ['node_modules'])], alias: { ...config.resolve?.alias, react: path.join(root, 'node_modules/react'), 'react-dom': path.join(root, 'node_modules/react-dom'), remotion: path.join(root, 'node_modules/remotion') } } }) });
        let selectedGl = project.gl;
        let browser = await openBrowser('chrome', { chromiumOptions: { gl: selectedGl } });
        let capabilities = await browserCapabilities(browser);
        if (!capabilities.webgl && selectedGl === 'angle') {
            await browser.close({ silent: true });
            selectedGl = 'swangle';
            browser = await openBrowser('chrome', { chromiumOptions: { gl: selectedGl } });
            capabilities = await browserCapabilities(browser);
            process.stderr.write('Hardware WebGL unavailable; using swangle.\n');
        }
        try {
            const selected = await selectComposition({ serveUrl, id: project.compositionId, inputProps: project.inputProps, puppeteerInstance: browser });
            const composition = { ...selected, ...project.overrides };
            if (project.requires.htmlInCanvas) {
                const page = await browser.newPage({ context: () => null, logLevel: 'error', indent: false, pageIndex: 0, onBrowserLog: null, onLog: () => { } });
                try {
                    const supported = await page.evaluate(() => typeof HTMLCanvasElement.prototype.captureElementImage === 'function');
                    if (!supported)
                        throw new Error('HTML-in-canvas is unavailable in the rendering browser; use the pinned Remotion Chrome.');
                }
                finally {
                    await page.close();
                }
            }
            for (const t of project.exports)
                if ((t.width ?? composition.width) % 2 || (t.height ?? composition.height) % 2)
                    throw new Error('H.264 export dimensions must be even');
            for (const word of words)
                if (word.end > composition.durationInFrames / composition.fps + .01)
                    throw new Error('Caption exceeds composition duration');
            for (const e of review.score)
                if (e.endFrame > composition.durationInFrames)
                    throw new Error(`Score event exceeds composition: ${e.label}`);
            // A real capture verifies fonts, shaders and the pinned browser before creating user output.
            await renderStill({ serveUrl, composition, inputProps: project.inputProps, frame: 0, scale: .25, output: path.join(temp, 'preflight.png'), puppeteerInstance: browser });
            return { project, base, assets, review, words, temp, serveUrl, browser, composition, capabilities, selectedGl };
        }
        catch (e) {
            await browser.close({ silent: true });
            throw e;
        }
    }
    catch (e) {
        await rm(temp, { recursive: true, force: true });
        throw new Error(`Code-project preflight failed: ${e.message}`);
    }
}
export async function checkCode(file) { const p = await prepare(file); try {
    return { valid: true, execution: false, name: p.project.name, composition: p.composition, review: p.review };
}
finally {
    await p.browser.close({ silent: true });
    await rm(p.temp, { recursive: true, force: true });
} }
export async function runCode(file, outDir, preview = false) {
    const p = await prepare(file);
    const out = path.resolve(outDir ?? path.join(p.base, '..', `${path.basename(p.base)}-render-${Date.now()}`));
    try {
        if (out === p.base || out.startsWith(p.base + path.sep))
            throw new Error('Choose an output directory outside the editable project');
        await mkdir(out, { recursive: false });
        const checks = [];
        if (p.words.length) {
            await writeFile(path.join(out, 'transcript.json'), JSON.stringify({ timing: 'supplied measured words', words: p.words }, null, 2));
            await writeFile(path.join(out, 'captions.srt'), srt(p.words));
        }
        const draft = preview || p.project.quality === 'draft';
        await cp(p.base, path.join(out, 'source'), { recursive: true, filter: src => !['node_modules', '.git', '.cache'].includes(path.basename(src)) && !path.basename(src).startsWith('.env') });
        await cp(p.serveUrl, path.join(out, 'composition-bundle'), { recursive: true });
        const manifest = [];
        for (const f of p.assets)
            manifest.push({ path: path.relative(p.base, f), bytes: (await readFile(f)).length, sha256: createHash('sha256').update(await readFile(f)).digest('hex') });
        await writeFile(path.join(out, 'asset-manifest.json'), JSON.stringify(manifest, null, 2));
        await writeFile(path.join(out, 'creative-review.json'), JSON.stringify(p.review, null, 2));
        for (const target of p.project.exports) {
            const composition = { ...p.composition, ...(target.width ? { width: target.width, height: target.height } : {}) };
            const dest = path.join(out, `${target.name}.mp4`);
            let last = -1;
            await renderMedia({ serveUrl: p.serveUrl, composition, inputProps: p.project.inputProps, outputLocation: dest, codec: 'h264', audioCodec: 'aac', audioBitrate: '192k', pixelFormat: 'yuv420p', crf: draft ? 23 : 16, x264Preset: draft ? 'veryfast' : 'slow', imageFormat: 'png', scale: draft ? draftScale(composition.width, composition.height) : 1, concurrency: 2, offthreadVideoThreads: 2, puppeteerInstance: p.browser, onProgress: ({ progress }) => { const n = Math.floor(progress * 10) * 10; if (n !== last) {
                    last = n;
                    process.stderr.write(`${target.name}: ${n}%\n`);
                } } });
            const check = await inspect(dest), scale = draft ? draftScale(composition.width, composition.height) : 1;
            if (check.width !== Math.round(composition.width * scale) || check.height !== Math.round(composition.height * scale))
                throw new Error('Code-project dimensions failed validation');
            if (Math.abs(check.duration - composition.durationInFrames / composition.fps) > .12)
                throw new Error('Code-project duration failed validation');
            if (p.project.requires.audio && !check.audio)
                throw new Error('Expected audio stream is missing');
            checks.push({ file: path.basename(dest), ...check, streams: undefined });
            if (checks.length === 1) {
                const frames = [...new Set([0, Math.min(composition.durationInFrames - 1, composition.fps), ...p.review.score.filter(e => ['transition', 'reading'].includes(e.kind)).flatMap(e => [e.startFrame, Math.floor((e.startFrame + e.endFrame - 1) / 2), e.endFrame - 1])])];
                await mkdir(path.join(out, 'frames'));
                for (const frame of frames)
                    await renderStill({ serveUrl: p.serveUrl, composition, inputProps: p.project.inputProps, frame, output: path.join(out, 'frames', `${String(frame).padStart(5, '0')}.png`), puppeteerInstance: p.browser });
                await cp(path.join(out, 'frames', `${String(frames[1] ?? 0).padStart(5, '0')}.png`), path.join(out, 'thumbnail.png'));
            }
        }
        await writeFile(path.join(out, 'quality.json'), JSON.stringify({ version: 2, profile: draft ? 'draft' : 'final', gl: p.selectedGl, browser: p.capabilities, checks, visualReview: 'Moving playback and native-resolution inspection required; technical decoding is not creative acceptance.' }, null, 2));
        return { output: out, checks };
    }
    finally {
        await p.browser.close({ silent: true });
        await rm(p.temp, { recursive: true, force: true });
    }
}
export async function initCode(directory) {
    const dest = path.resolve(directory);
    await mkdir(path.dirname(dest), { recursive: true });
    await mkdir(dest, { recursive: false });
    await cp(path.join(root, 'templates', 'short'), dest, { recursive: true });
    await cp(path.join(root, 'motion'), path.join(dest, 'lib'), { recursive: true });
    return { project: path.join(dest, 'project.json'), next: 'Edit src/Film.tsx and score.json; preview and run through the plugin CLI. npm ci supports standalone Remotion authoring.' };
}
/** Pixel evidence for independently sampled frames; no sequential playback state is assumed. */
export async function verifyCodeFrames(file, outDir, frames) {
    const p = await prepare(file);
    try {
        await mkdir(outDir, { recursive: false });
        const samples = [];
        for (const [i, frame] of frames.entries()) {
            if (!Number.isInteger(frame) || frame < 0 || frame >= p.composition.durationInFrames)
                throw new Error('Audit frame outside composition');
            const output = path.join(outDir, `${i}-${frame}.png`);
            await renderStill({ serveUrl: p.serveUrl, composition: p.composition, inputProps: p.project.inputProps, frame, output, puppeteerInstance: p.browser });
            samples.push({ frame, file: path.basename(output), sha256: createHash('sha256').update(await readFile(output)).digest('hex') });
        }
        const consistent = samples.every(s => samples.filter(t => t.frame === s.frame).every(t => t.sha256 === s.sha256));
        const report = { consistent, samples, scope: 'Exact PNG comparison on this browser/machine. Not a cross-GPU pixel-identical guarantee.' };
        await writeFile(path.join(outDir, 'determinism.json'), JSON.stringify(report, null, 2));
        if (!consistent)
            throw new Error('Out-of-order frame audit found different pixels for the same frame');
        return report;
    }
    finally {
        await p.browser.close({ silent: true });
        await rm(p.temp, { recursive: true, force: true });
    }
}
