import { execFile } from "node:child_process";
import type { Word } from "./schema.js";
export declare const exec: typeof execFile.__promisify__;
export declare function binary(name: "ffmpeg" | "ffprobe"): string;
export declare function ensureBinary(name: "ffmpeg" | "ffprobe"): Promise<void>;
export declare function probe(file: string): Promise<{
    duration: number;
    width: any;
    height: any;
    videoCodec: any;
    audio: any;
    audioCodec: any;
    fps: any;
    streams: any;
}>;
export declare function inspect(file: string): Promise<{
    decoded: boolean;
    duration: number;
    width: any;
    height: any;
    videoCodec: any;
    audio: any;
    audioCodec: any;
    fps: any;
    streams: any;
}>;
export declare function readable(path: string): Promise<void>;
export declare function srt(words: Word[]): string;
export declare function remapWords(words: Word[], segments: {
    start: number;
    end: number;
}[]): Word[];
export declare function invertSilences(duration: number, silences: {
    start: number;
    end: number;
}[], padding?: number): {
    start: number;
    end: number;
}[];
export declare function detectSpeechSegments(file: string, db: number, seconds: number): Promise<{
    start: number;
    end: number;
}[]>;
export declare function intersectSegments(a: {
    start: number;
    end: number;
}[], b: {
    start: number;
    end: number;
}[]): {
    start: number;
    end: number;
}[];
export declare function readWords(file: string): Promise<Word[]>;
export declare function normalizeVoice(input: string, output: string): Promise<string>;
