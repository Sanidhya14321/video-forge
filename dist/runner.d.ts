import { type Project } from "./schema.js";
export declare const root: string;
export declare const python: string;
export declare function loadProject(file: string): Promise<{
    version: 1;
    name: string;
    workflow: "product-demo" | "algorithm-explainer" | "footage-repurpose" | "short-form-reel";
    renderer: "remotion";
    fps: 24 | 30 | 60;
    theme: {
        surface: "flat" | "ambient";
        background: string;
        foreground: string;
        accent: string;
        muted: string;
        font: string;
        brand: string;
        tagline: string;
    };
    scenes: {
        kind: "title" | "code" | "chart" | "algorithm" | "image" | "video" | "reel";
        duration: number;
        title: string;
        eyebrow?: string | undefined;
        body?: string | undefined;
        code?: string | undefined;
        src?: string | undefined;
        values?: number[] | undefined;
        labels?: string[] | undefined;
        highlight?: number[] | undefined;
        note?: string | undefined;
        motion?: {
            preset: "type-impact" | "fragment-merge" | "orbit-lock" | "signal-flow" | "ribbon" | "frame-morph" | "timeline-cut" | "waveform" | "code-scan" | "data-sculpt" | "word-pulse" | "radial-burst";
            invert: boolean;
            seed: number;
            density: number;
            entrance: "cut" | "push" | "scale";
        } | undefined;
    }[];
    narration: {
        provider: "file" | "none" | "kokoro" | "openai";
        voice: string;
        src?: string | undefined;
        text?: string | undefined;
        model?: string | undefined;
        rateUsdPerMillionCharacters?: number | undefined;
    };
    generation: {
        id: string;
        provider: "fal";
        endpoint: string;
        input: Record<string, unknown>;
        maxCostUsd: number;
        resultType: "image" | "video";
    }[];
    exports: {
        preset: "landscape" | "vertical" | "square" | "portrait";
        width?: number | undefined;
        height?: number | undefined;
    }[];
    assets: {
        path: string;
        origin: string;
        license: string;
        credit?: string | undefined;
    }[];
    reel?: {
        bpm: number;
        safeArea: "reels" | "clean";
    } | undefined;
    footage?: {
        src: string;
        removeSilence: boolean;
        silenceDb: number;
        silenceSeconds: number;
        crop: "contain" | "cover";
        segments?: {
            start: number;
            end: number;
        }[] | undefined;
    } | undefined;
    captions?: {
        transcribe: boolean;
        language: string;
        model: "tiny" | "base" | "small" | "medium" | "large-v3" | "turbo";
        maxWords: number;
        words?: {
            text: string;
            start: number;
            end: number;
        }[] | undefined;
        transcript?: string | undefined;
    } | undefined;
    music?: {
        src: string;
        volume: number;
    } | undefined;
    cloud?: {
        enabled: boolean;
        maxUsd: number;
        reservedUsd: number;
    } | undefined;
}>;
export declare function doctor(): Promise<Record<string, unknown>>;
export declare function preflight(project: Project, base: string): Promise<void>;
export declare function snapshotRenderer(out: string): Promise<void>;
/** Render storyboard stills without executing narration, edits or cloud jobs. */
export declare function previewProject(file: string, output: string): Promise<{
    output: string;
    stills: number;
    warnings: {
        code: string;
        scene?: number;
        message: string;
    }[];
}>;
export declare function runProject(file: string, output?: string): Promise<{
    output: string;
    checks: {
        streams: undefined;
        captionWords: number;
        decoded: boolean;
        duration: number;
        width: any;
        height: any;
        videoCodec: any;
        audio: any;
        audioCodec: any;
        fps: any;
        file: string;
    }[];
}>;
