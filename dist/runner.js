import { fingerprint } from './file-manifest.js';
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia, renderStill, openBrowser, } from "@remotion/renderer";
import { projectSchema, wordsSchema, dimensions, } from "./schema.js";
import { exec, binary, ensureBinary, readable, probe, inspect, readWords, remapWords, srt, detectSpeechSegments, intersectSegments, normalizeVoice, } from "./media.js";
import { Budget, speechOpenAI, falGenerate } from "./providers.js";
import { reviewProject } from "./reel-review.js";
import { inspectGlb } from './assets3d.js';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const python = process.env.VIDEO_FORGE_PYTHON ??
    path.join(root, "python", ".venv", "bin", "python");
const localScript = path.join(root, "python", "local_media.py");
export async function loadProject(file) {
    return projectSchema.parse(JSON.parse(await readFile(file, "utf8")));
}
async function localDoctor() {
    try {
        const { stdout } = await exec(python, [localScript, "doctor"]);
        return JSON.parse(stdout);
    }
    catch {
        return {};
    }
}
export async function doctor() {
    const tools = {
        node: process.version,
        platform: process.platform,
        renderer: "Remotion 4.0.536",
        python,
        optionalModels: await localDoctor(),
        cloud: {
            openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
            falConfigured: Boolean(process.env.FAL_KEY),
            enabledByDefault: false,
        },
    };
    for (const name of ["ffmpeg", "ffprobe"]) {
        try {
            await ensureBinary(name);
            tools[name] = { available: true, path: binary(name) };
        }
        catch (e) {
            tools[name] = { available: false, error: e.message };
        }
    }
    return tools;
}
export async function preflight(project, base) {
    await Promise.all([ensureBinary("ffmpeg"), ensureBinary("ffprobe")]);
    const refs = [
        ...project.scenes.map((s) => s.src),
        ...project.scenes.flatMap(s => s.world?.objects.map(o => o.src) ?? []),
        ...project.overlays.flatMap(o => [o.src, o.logo]),
        project.footage?.src,
        project.narration.provider === "file" ? project.narration.src : undefined,
        project.music?.src,
        project.captions?.transcript,
        ...project.assets.map((a) => a.path),
    ].filter((x) => Boolean(x));
    for (const ref of new Set(refs)) {
        if (ref.startsWith("generated:")) {
            if (!project.generation.some((g) => `generated:${g.id}` === ref))
                throw new Error(`Unknown generated asset: ${ref}`);
        }
        else {
            if (/^https?:/i.test(ref))
                throw new Error("Use downloaded local asset paths; remote assets are not fetched implicitly");
            await readable(path.resolve(base, ref));
        }
    }
    for (const scene of project.scenes)
        for (const o of scene.world?.objects ?? [])
            if (o.shape === 'model')
                await inspectGlb(path.resolve(base, o.src));
    if (project.narration.provider === "kokoro" || project.captions?.transcribe) {
        const d = await localDoctor();
        if (project.narration.provider === "kokoro" && !d.kokoro)
            throw new Error("Kokoro is missing. Run: uv sync --project python --python 3.11");
        if (project.captions?.transcribe && !d.faster_whisper)
            throw new Error("faster-whisper is missing. Run: uv sync --project python --python 3.11");
    }
    if (project.captions?.transcribe &&
        project.narration.provider === "none" &&
        !project.footage)
        throw new Error("Transcription requires narration audio or footage");
    if (project.narration.provider === "openai" && !process.env.OPENAI_API_KEY)
        throw new Error("Set OPENAI_API_KEY before selecting OpenAI narration");
    if (project.generation.length && !process.env.FAL_KEY)
        throw new Error("Set FAL_KEY before selecting fal generation");
    if (project.narration.provider === "openai" &&
        Array.from(project.narration.text).length > 4096)
        throw new Error("OpenAI narration exceeds 4096 characters; split it explicitly");
    const speechCost = project.narration.provider === "openai"
        ? ((Array.from(project.narration.text).length *
            project.narration.rateUsdPerMillionCharacters) /
            1e6) *
            1.1
        : 0;
    const total = project.generation.reduce((n, g) => n + g.maxCostUsd, 0) + speechCost;
    if (total > 0 &&
        (!project.cloud?.enabled ||
            total + (project.cloud.reservedUsd ?? 0) > project.cloud.maxUsd))
        throw new Error("Cloud is disabled or the aggregate request reservation exceeds maxUsd");
    const initialWords = project.captions?.transcript
        ? wordsSchema.parse(await readWords(path.resolve(base, project.captions.transcript)))
        : (project.captions?.words ?? []);
    if (!project.footage) {
        const planned = project.scenes.reduce((n, s) => n + Math.round(s.duration * project.fps), 0) / project.fps;
        if (project.overlays.some(o => o.end > planned + .03))
            throw new Error("Overlay timing exceeds the planned video duration");
        if (initialWords.some((w) => w.end > planned + 0.03))
            throw new Error("Caption timing exceeds the planned video duration");
        if (project.narration.provider === "file" &&
            (await probe(path.resolve(base, project.narration.src))).duration >
                planned + 0.08)
            throw new Error("Narration exceeds the planned video duration");
    }
    if (project.footage) {
        const meta = await probe(path.resolve(base, project.footage.src));
        if (project.footage.segments?.some((s) => s.end > meta.duration + 0.03))
            throw new Error("Footage segment exceeds the input duration");
        if (project.captions?.transcribe &&
            project.narration.provider === "none" &&
            !meta.audio)
            throw new Error("Transcription requires footage with an audio stream");
    }
}
export async function snapshotRenderer(out) {
    for (const [source, dest] of [["renderer/Root.tsx", "composition.tsx"], ["renderer/Reel.tsx", "Reel.tsx"], ["renderer/PopReel.tsx", "PopReel.tsx"], ["renderer/Overlays.tsx", "Overlays.tsx"], ["renderer/World.tsx", "World.tsx"]]) {
        const text = (await readFile(path.join(root, source), "utf8")).replaceAll("../src/", "./");
        await writeFile(path.join(out, dest), text);
    }
    await copyFile(path.join(root, "src/schema.ts"), path.join(out, "schema.ts"));
    await copyFile(path.join(root, "src/reel-layout.ts"), path.join(out, "reel-layout.ts"));
    await copyFile(path.join(root, "src/footage-layout.ts"), path.join(out, "footage-layout.ts"));
    await copyFile(path.join(root, "src/overlay-timing.ts"), path.join(out, "overlay-timing.ts"));
    await copyFile(path.join(root, "src/world.ts"), path.join(out, "world.ts"));
}
/** Render storyboard stills without executing narration, edits or cloud jobs. */
export async function previewProject(file, output) {
    const base = path.dirname(path.resolve(file)), project = await loadProject(file);
    if (project.footage && (project.footage.segments?.length || project.footage.removeSilence))
        throw new Error("Preview footage must be a prepared source without cuts or silence removal; render the edit first");
    const refs = [...project.scenes.flatMap(scene => [scene.src, ...(scene.world?.objects.map(o => o.src) ?? [])].filter((s) => Boolean(s))), ...project.overlays.flatMap(o => [o.src, o.logo].filter((s) => Boolean(s))), ...(project.footage ? [project.footage.src] : [])];
    if (refs.some(ref => ref.startsWith("generated:") || /^https?:/i.test(ref)))
        throw new Error("Preview requires local media; it never executes cloud generation");
    for (const ref of refs)
        await readable(path.resolve(base, ref));
    for (const scene of project.scenes)
        for (const o of scene.world?.objects ?? [])
            if (o.shape === 'model')
                await inspectGlb(path.resolve(base, o.src));
    const words = project.captions?.transcript ? wordsSchema.parse(await readWords(path.resolve(base, project.captions.transcript))) : (project.captions?.words ?? []);
    const out = path.resolve(output);
    await mkdir(path.dirname(out), { recursive: true });
    await mkdir(out);
    const assetsDir = path.join(out, "assets");
    await mkdir(assetsDir);
    const ready = structuredClone(project);
    const previewStage = async (ref) => {
        const source = path.resolve(base, ref);
        const { sha256 } = await fingerprint(source);
        const name = sha256.slice(0, 16) + path.extname(ref).toLowerCase();
        await copyFile(source, path.join(assetsDir, name));
        return name;
    };
    for (const scene of ready.scenes)
        if (scene.src)
            scene.src = await previewStage(scene.src);
    for (const scene of ready.scenes)
        for (const object of scene.world?.objects ?? [])
            if (object.src)
                object.src = await previewStage(object.src);
    for (const o of ready.overlays) {
        if (o.src)
            o.src = await previewStage(o.src);
        if (o.logo)
            o.logo = await previewStage(o.logo);
    }
    const footage = project.footage ? await previewStage(project.footage.src) : undefined;
    const review = reviewProject(project);
    const durationFrames = project.footage ? Math.round((await probe(path.resolve(base, project.footage.src))).duration * project.fps) : Math.round((review.durationSeconds ?? 0) * project.fps);
    if (project.overlays.some(o => o.end > durationFrames / project.fps + .03))
        throw new Error("Overlay timing exceeds the preview duration");
    const props = { project: ready, words, footage, durationFrames };
    const overlayShots = project.overlays.map((o, i) => ({ index: review.timeline.length + i + 1, previewFrames: [Math.min(durationFrames - 1, Math.round(o.start * project.fps) + 5), Math.min(durationFrames - 1, Math.round((o.start + o.end) / 2 * project.fps)), Math.min(durationFrames - 1, Math.round(o.end * project.fps) - 1)] }));
    const shots = [...review.timeline, ...overlayShots];
    if (!shots.length)
        shots.push({ index: 1, previewFrames: [0, Math.floor(durationFrames / 2), durationFrames - 1] });
    await snapshotRenderer(out);
    await writeFile(path.join(out, "render-props.json"), JSON.stringify(props, null, 2));
    const serveUrl = await bundle({ entryPoint: path.join(root, "renderer/Root.tsx"), publicDir: assetsDir, outDir: path.join(out, "composition-bundle") });
    const browser = await openBrowser("chrome", { chromiumOptions: { gl: "swangle" } });
    const frames = [];
    try {
        for (const target of project.exports) {
            const [width, height] = target.width ? [target.width, target.height] : dimensions[target.preset];
            const composition = { ...(await selectComposition({ serveUrl, id: "VideoForge", inputProps: props, puppeteerInstance: browser })), width, height };
            for (const shot of shots)
                for (const [i, frame] of shot.previewFrames.entries()) {
                    const name = `${target.preset}-${String(shot.index).padStart(2, "0")}-${["entry", "peak", "exit"][i]}.png`;
                    await renderStill({ serveUrl, composition, inputProps: props, frame, scale: Math.min(1, 540 / width), output: path.join(out, name), puppeteerInstance: browser });
                    frames.push({ file: name, frame, shot: shot.index, phase: ["entry", "peak", "exit"][i] });
                }
            for (const shot of review.cameraShots)
                for (const frame of shot.previewFrames) {
                    const name = `${target.preset}-camera-${String(shot.scene).padStart(2, '0')}-${String(frame).padStart(6, '0')}.png`;
                    await renderStill({ serveUrl, composition, inputProps: props, frame, scale: Math.min(1, 540 / width), output: path.join(out, name), puppeteerInstance: browser });
                    frames.push({ file: name, frame, shot: shot.scene, phase: 'camera' });
                }
        }
    }
    finally {
        await browser.close({ silent: true });
    }
    await writeFile(path.join(out, "preview.json"), JSON.stringify({ review, frames, audio: false, cloudExecuted: false, automaticTranscriptionExecuted: false }, null, 2));
    return { output: out, stills: frames.length, warnings: review.warnings };
}
export async function runProject(file, output) {
    const filePath = path.resolve(file), base = path.dirname(filePath), project = await loadProject(filePath);
    await preflight(project, base);
    const out = path.resolve(output ??
        path.join(base, "runs", `${project.name}-${randomUUID().slice(0, 8)}`));
    await mkdir(path.dirname(out), { recursive: true });
    await mkdir(out); // Existing output directories are never overwritten.
    const assetsDir = path.join(out, "assets");
    await mkdir(assetsDir);
    const generatedDir = path.join(out, "generated");
    await mkdir(generatedDir);
    await writeFile(path.join(out, "project.json"), JSON.stringify(project, null, 2));
    const manifest = [];
    const generated = new Map();
    const budget = new Budget(project.cloud, path.join(out, "spending.json"));
    for (const job of project.generation) {
        const result = await falGenerate(job, budget, generatedDir);
        generated.set(`generated:${job.id}`, result.path);
        manifest.push({
            path: path.relative(out, result.path),
            origin: `fal:${job.endpoint}`,
            requestId: result.requestId,
            license: "provider output terms; verify for intended use",
        });
    }
    const stagedRefs = new Map();
    const stage = async (ref, metadata) => {
        const source = generated.get(ref) ?? path.resolve(base, ref);
        const cached = stagedRefs.get(source);
        if (cached)
            return cached;
        await readable(source);
        const { sha256: hash } = await fingerprint(source);
        const name = `${hash.slice(0, 16)}${path.extname(source).toLowerCase()}`;
        await copyFile(source, path.join(assetsDir, name));
        const credit = metadata ??
            project.assets.find((a) => path.resolve(base, a.path) === source);
        manifest.push({
            path: `assets/${name}`,
            sha256: hash,
            origin: credit?.origin ??
                (generated.has(ref) ? ref : "user-supplied local file"),
            license: credit?.license ?? "unspecified; user-supplied",
            credit: credit?.credit,
        });
        stagedRefs.set(source, name);
        return name;
    };
    let narration;
    if (project.narration.provider === "file")
        narration = await stage(project.narration.src);
    if (project.narration.provider === "openai")
        narration = await stage(await normalizeVoice(await speechOpenAI(project.narration, budget, path.join(out, "narration.wav")), path.join(out, "narration-normalized.wav")), {
            origin: `Generated OpenAI ${project.narration.model ?? "tts-1"} narration`,
            license: "Provider output terms; synthetic narration",
        });
    if (project.narration.provider === "kokoro") {
        const textPath = path.join(out, "narration.txt");
        await writeFile(textPath, project.narration.text);
        const audioPath = path.join(out, "narration.wav");
        await exec(python, [
            localScript,
            "speak",
            "--input",
            textPath,
            "--output",
            audioPath,
            "--language",
            project.captions?.language ?? "en",
            "--voice",
            project.narration.voice,
        ], { maxBuffer: 8 * 1024 * 1024 });
        narration = await stage(await normalizeVoice(audioPath, path.join(out, "narration-normalized.wav")), {
            origin: `Local Kokoro narration, voice ${project.narration.voice}`,
            license: "Kokoro model/voice output terms; synthetic narration",
        });
    }
    let words = project.captions?.words ?? [];
    if (project.captions?.transcript)
        words = wordsSchema.parse(await readWords(path.resolve(base, project.captions.transcript)));
    let segments = [];
    let footage;
    if (project.footage) {
        const source = path.resolve(base, project.footage.src), meta = await probe(source);
        segments = project.footage.segments ?? [{ start: 0, end: meta.duration }];
        if (project.footage.removeSilence)
            segments = intersectSegments(segments, await detectSpeechSegments(source, project.footage.silenceDb, project.footage.silenceSeconds));
        if (!segments.length)
            throw new Error("No footage remains after selection and silence removal");
        const filters = segments.flatMap((s, i) => [
            `[0:v]trim=start=${s.start}:end=${s.end},setpts=PTS-STARTPTS[v${i}]`,
            ...(meta.audio
                ? [
                    `[0:a]atrim=start=${s.start}:end=${s.end},asetpts=PTS-STARTPTS[a${i}]`,
                ]
                : []),
        ]);
        const inputs = segments
            .map((_, i) => `[v${i}]${meta.audio ? `[a${i}]` : ""}`)
            .join("");
        filters.push(`${inputs}concat=n=${segments.length}:v=1:a=${meta.audio ? 1 : 0}[v]${meta.audio ? "[a]" : ""}`);
        const dest = path.join(out, "edited-source.mp4");
        await exec(binary("ffmpeg"), [
            "-y",
            "-i",
            source,
            "-filter_complex",
            filters.join(";"),
            "-map",
            "[v]",
            ...(meta.audio ? ["-map", "[a]"] : []),
            "-c:v",
            "libx264",
            "-preset",
            "fast",
            "-crf",
            "19",
            "-pix_fmt",
            "yuv420p",
            ...(meta.audio ? ["-c:a", "aac"] : []),
            dest,
        ], { maxBuffer: 16 * 1024 * 1024 });
        footage = await stage(dest, {
            origin: `Edited derivative of ${project.footage.src}`,
            license: project.assets.find((a) => a.path === project.footage.src)?.license ??
                "Source footage terms; unspecified user-supplied media",
        });
        await writeFile(path.join(out, "edit-decisions.json"), JSON.stringify({
            version: 1,
            source: project.footage.src,
            segments,
            captionInputTimeline: project.narration.provider === "none" ? "source" : "narration",
        }, null, 2));
        // Inline/file captions describe the source footage. Narrated edits use the new narration timeline.
        if (project.narration.provider === "none")
            words = remapWords(words, segments);
    }
    if (project.captions?.transcribe) {
        const source = narration
            ? path.join(assetsDir, narration)
            : path.join(assetsDir, footage);
        const transcript = path.join(out, "asr-transcript.json");
        await exec(python, [
            localScript,
            "transcribe",
            "--input",
            source,
            "--output",
            transcript,
            "--model",
            project.captions.model,
            "--language",
            project.captions.language,
        ], { maxBuffer: 8 * 1024 * 1024 });
        words = wordsSchema.parse(await readWords(transcript));
    }
    let durationFrames = footage
        ? Math.round((await probe(path.join(assetsDir, footage))).duration * project.fps)
        : project.scenes.reduce((n, s) => n + Math.round(s.duration * project.fps), 0);
    const duration = durationFrames / project.fps;
    if (project.overlays.some(o => o.end > duration + .03))
        throw new Error("Overlay timing exceeds the output duration");
    if (project.footage?.punchIns.some(p => p.end > duration + .03))
        throw new Error("Punch-in timing exceeds the edited output duration");
    if (narration &&
        (await probe(path.join(assetsDir, narration))).duration > duration + 0.08)
        throw new Error("Narration exceeds the planned video duration. Extend scenes or shorten the script.");
    if (words.some((w) => w.end > duration + 0.03))
        throw new Error("Caption timing exceeds the edited output duration");
    if (project.captions && !words.length)
        throw new Error("Captioning produced no words; inspect the transcript or source audio");
    await writeFile(path.join(out, "transcript.json"), JSON.stringify({ version: 1, timeline: "output", words }, null, 2));
    await writeFile(path.join(out, "captions.srt"), srt(words));
    await writeFile(path.join(out, "storyboard.md"), `# ${project.name}\n\n${project.scenes.map((s, i) => `${i + 1}. ${s.kind} (${s.duration}s): ${s.title}${s.note ? ` — ${s.note}` : ""}`).join("\n")}${footage ? "\nSee edit-decisions.json for source selection." : ""}\n`);
    const ready = structuredClone(project);
    for (const scene of ready.scenes)
        if (scene.src)
            scene.src = await stage(scene.src);
    for (const scene of ready.scenes)
        for (const object of scene.world?.objects ?? [])
            if (object.src)
                object.src = await stage(object.src);
    for (const o of ready.overlays) {
        if (o.src)
            o.src = await stage(o.src);
        if (o.logo)
            o.logo = await stage(o.logo);
    }
    const music = project.music ? await stage(project.music.src) : undefined;
    const props = {
        project: ready,
        words,
        narration,
        music,
        footage,
        durationFrames,
    };
    await writeFile(path.join(out, "render-props.json"), JSON.stringify(props, null, 2));
    await snapshotRenderer(out);
    await writeFile(path.join(out, "creative-review.json"), JSON.stringify(reviewProject(project), null, 2));
    await writeFile(path.join(out, "asset-manifest.json"), JSON.stringify(manifest, null, 2));
    const serveUrl = await bundle({
        entryPoint: path.join(root, "renderer", "Root.tsx"),
        publicDir: assetsDir,
        outDir: path.join(out, "composition-bundle"),
    });
    const checks = [];
    let thumbnail = false;
    for (const target of project.exports) {
        const [width, height] = target.width
            ? [target.width, target.height]
            : dimensions[target.preset];
        const composition = {
            ...(await selectComposition({
                serveUrl,
                id: "VideoForge",
                inputProps: props,
            })),
            width,
            height,
        };
        const dest = path.join(out, `${target.preset}.mp4`);
        let lastProgress = -1;
        await renderMedia({
            serveUrl,
            composition,
            inputProps: props,
            outputLocation: dest,
            codec: "h264",
            audioCodec: "aac",
            pixelFormat: "yuv420p",
            crf: 20,
            concurrency: 2,
            offthreadVideoThreads: 2,
            chromiumOptions: { gl: "swangle" },
            overwrite: false,
            onProgress: ({ progress }) => {
                const percent = Math.floor(progress * 10) * 10;
                if (percent !== lastProgress) {
                    lastProgress = percent;
                    process.stderr.write(`${target.preset}: ${percent}%\n`);
                }
            },
        });
        const check = await inspect(dest);
        if (Math.abs(check.duration - duration) > Math.max(0.12, 2 / project.fps))
            throw new Error("Export duration failed validation");
        if (check.width !== width || check.height !== height)
            throw new Error("Export dimensions failed validation");
        if ((narration ||
            music ||
            (footage && (await probe(path.join(assetsDir, footage))).audio)) &&
            !check.audio)
            throw new Error("Expected audio stream is missing");
        checks.push({
            file: path.basename(dest),
            ...check,
            streams: undefined,
            captionWords: words.length,
        });
        if (!thumbnail) {
            await renderStill({
                serveUrl,
                composition,
                inputProps: props,
                output: path.join(out, "thumbnail.png"),
                frame: Math.min(project.fps, durationFrames - 1),
                chromiumOptions: { gl: "swangle" },
            });
            thumbnail = true;
        }
    }
    await writeFile(path.join(out, "quality.json"), JSON.stringify({
        version: 1,
        checks,
        visualReview: "required; technical checks do not establish visual or editorial quality",
    }, null, 2));
    await writeFile(path.join(out, "publish-draft.md"), `# ${project.name}\n\nWrite a platform-specific hook and post here.\n\n${["kokoro", "openai"].includes(project.narration.provider) ? "Narration is AI-generated.\n\n" : ""}Review thumbnail, captions, attribution, and crop before upload. No publishing API was called.\n`);
    return { output: out, checks };
}
