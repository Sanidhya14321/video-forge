import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { binary, ensureBinary, exec, probe, readable } from './media.js';
const escape = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/** Sampling assists source inspection; it does not identify the best action or take. */
export async function scoutVideo(input, output) {
    if (/^https?:/i.test(input))
        throw new Error('Scout requires a local video; it does not fetch remote media.');
    const file = path.resolve(input);
    await readable(file);
    await Promise.all([ensureBinary('ffmpeg'), ensureBinary('ffprobe')]);
    const metadata = await probe(file);
    if (!metadata.width || !metadata.height || !Number.isFinite(metadata.duration) || metadata.duration <= 0)
        throw new Error('Scout requires a valid video stream.');
    const out = path.resolve(output);
    await mkdir(path.dirname(out), { recursive: true });
    await mkdir(out);
    const [num, den] = String(metadata.fps).split('/').map(Number), fps = den ? num / den : 1;
    const count = Math.min(12, Math.max(1, Math.floor(metadata.duration * (Number.isFinite(fps) ? fps : 1))));
    const frames = [];
    for (let i = 0; i < count; i++) {
        const at = count === 1 ? 0 : i / (count - 1) * Math.max(0, metadata.duration - Math.max(.05, 1 / (fps || 1)));
        const name = `frame-${String(i + 1).padStart(2, '0')}.jpg`;
        await exec(binary('ffmpeg'), ['-v', 'error', '-y', '-ss', at.toFixed(6), '-i', file, '-frames:v', '1', '-vf', 'scale=480:854:force_original_aspect_ratio=decrease', '-q:v', '2', path.join(out, name)]);
        frames.push({ file: name, sourceSeconds: Number(at.toFixed(6)) });
    }
    const report = { version: 1, source: file, metadata, frames, scope: 'Uniform samples only: inspect additional moments for meaning, action, focus, faces, continuity and exact cut points. No transcription, semantic selection or paid request.' };
    await writeFile(path.join(out, 'scout.json'), JSON.stringify(report, null, 2));
    await writeFile(path.join(out, 'contact-sheet.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><title>Video Forge source scout</title><style>body{background:#101820;color:#eee;font:16px system-ui;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}figure{margin:0;background:#1a2b35;padding:8px}img{display:block;width:100%;height:240px;object-fit:contain}p{max-width:900px;line-height:1.5}a{color:#80dfcb}</style><h1>Source scout</h1><p>${escape(path.basename(file))} · ${metadata.width}×${metadata.height} · ${metadata.duration.toFixed(3)}s · ${escape(String(metadata.fps))} fps</p><p>${escape(report.scope)}</p><main>${frames.map(f => `<figure><a href="${f.file}"><img alt="Source sample at ${f.sourceSeconds}s" src="${f.file}"></a><figcaption>${f.sourceSeconds.toFixed(3)}s</figcaption></figure>`).join('')}</main></html>`);
    return { output: out, frames: frames.length, contactSheet: 'contact-sheet.html', scope: report.scope };
}
