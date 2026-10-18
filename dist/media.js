import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createRequire } from "node:module";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
const require = createRequire(import.meta.url);
export const exec = promisify(execFile);
export function binary(name) {
    const override = process.env[name === "ffmpeg" ? "FFMPEG_PATH" : "FFPROBE_PATH"];
    if (override)
        return override;
    try {
        return name === "ffmpeg"
            ? require("ffmpeg-static")
            : require("ffprobe-static").path;
    }
    catch {
        return name;
    }
}
export async function ensureBinary(name) {
    try {
        await exec(binary(name), ["-version"]);
    }
    catch {
        throw new Error(`${name} is unavailable. Run npm ci, install FFmpeg, or set ${name.toUpperCase()}_PATH.`);
    }
}
export async function probe(file) {
    const { stdout } = await exec(binary("ffprobe"), ["-v", "error", "-show_format", "-show_streams", "-of", "json", file], { maxBuffer: 4 * 1024 * 1024 });
    const data = JSON.parse(stdout);
    const video = data.streams.find((s) => s.codec_type === "video");
    return {
        duration: Number(data.format.duration),
        width: video?.width,
        height: video?.height,
        videoCodec: video?.codec_name,
        audio: data.streams.some((s) => s.codec_type === "audio"),
        audioCodec: data.streams.find((s) => s.codec_type === "audio")
            ?.codec_name,
        fps: video?.avg_frame_rate,
        streams: data.streams,
    };
}
export async function inspect(file) {
    const metadata = await probe(file);
    await exec(binary("ffmpeg"), ["-v", "error", "-i", file, "-f", "null", "-"], {
        maxBuffer: 2 * 1024 * 1024,
    });
    if (!metadata.width ||
        !metadata.height ||
        !Number.isFinite(metadata.duration) ||
        metadata.duration <= 0)
        throw new Error("No valid video stream");
    return { ...metadata, decoded: true };
}
export async function readable(path) {
    try {
        await access(path, constants.R_OK);
    }
    catch {
        throw new Error(`Cannot read asset: ${path}`);
    }
}
export function srt(words) {
    const stamp = (t) => {
        const ms = Math.round(t * 1000);
        return `${String(Math.floor(ms / 3600000)).padStart(2, "0")}:${String(Math.floor(ms / 60000) % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
    };
    return words
        .map((w, i) => `${i + 1}\n${stamp(w.start)} --> ${stamp(w.end)}\n${w.text.replace(/[\r\n]+/g, " ")}\n`)
        .join("\n");
}
export function remapWords(words, segments) {
    let offset = 0;
    const result = [];
    for (const segment of segments) {
        for (const word of words) {
            const start = Math.max(word.start, segment.start);
            const end = Math.min(word.end, segment.end);
            if (end > start)
                result.push({
                    ...word,
                    start: start - segment.start + offset,
                    end: end - segment.start + offset,
                });
        }
        offset += segment.end - segment.start;
    }
    return result;
}
export function invertSilences(duration, silences, padding = 0.12) {
    let cursor = 0;
    const keep = [];
    for (const s of silences) {
        const start = Math.max(cursor, s.start <= padding ? 0 : s.start + padding);
        if (start > cursor + 0.04)
            keep.push({ start: cursor, end: start });
        cursor = Math.max(cursor, Math.min(duration, s.end >= duration - padding ? duration : s.end - padding));
    }
    if (cursor < duration - 0.04)
        keep.push({ start: cursor, end: duration });
    return keep;
}
export async function detectSpeechSegments(file, db, seconds) {
    const metadata = await probe(file);
    if (!metadata.audio)
        throw new Error("Silence removal requires an audio stream");
    const { stderr } = await exec(binary("ffmpeg"), [
        "-hide_banner",
        "-i",
        file,
        "-af",
        `silencedetect=noise=${db}dB:d=${seconds}`,
        "-f",
        "null",
        "-",
    ], { maxBuffer: 16 * 1024 * 1024 });
    const spans = [];
    let start;
    for (const line of stderr.split("\n")) {
        const a = line.match(/silence_start: ([\d.]+)/);
        const b = line.match(/silence_end: ([\d.]+)/);
        if (a)
            start = Number(a[1]);
        if (b && start !== undefined) {
            spans.push({ start, end: Number(b[1]) });
            start = undefined;
        }
    }
    if (start !== undefined)
        spans.push({ start, end: metadata.duration });
    return invertSilences(metadata.duration, spans);
}
export function intersectSegments(a, b) {
    return a.flatMap((x) => b
        .map((y) => ({
        start: Math.max(x.start, y.start),
        end: Math.min(x.end, y.end),
    }))
        .filter((x) => x.end - x.start > 0.04));
}
export async function readWords(file) {
    const json = JSON.parse(await readFile(file, "utf8"));
    return Array.isArray(json) ? json : json.words;
}
export async function normalizeVoice(input, output) {
    const filter = "loudnorm=I=-16:TP=-1.5:LRA=11";
    const first = await exec(binary("ffmpeg"), [
        "-hide_banner",
        "-i",
        input,
        "-af",
        filter + ":print_format=json",
        "-f",
        "null",
        "-",
    ], { maxBuffer: 4 * 1024 * 1024 });
    const start = first.stderr.lastIndexOf("{"), end = first.stderr.lastIndexOf("}");
    if (start < 0 || end < start)
        throw new Error("FFmpeg did not return loudness measurements");
    const json = first.stderr.slice(start, end + 1);
    const m = JSON.parse(json);
    if (!Number.isFinite(Number(m.input_i)))
        throw new Error("Generated narration contains no measurable speech audio");
    const measured = `${filter}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
    await exec(binary("ffmpeg"), [
        "-v",
        "error",
        "-y",
        "-i",
        input,
        "-af",
        measured,
        "-ar",
        "48000",
        output,
    ]);
    return output;
}
