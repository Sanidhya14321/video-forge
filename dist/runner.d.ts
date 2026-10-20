import { type Project } from "./schema.js";
export declare const root: string;
export declare const python: string;
export declare function loadProject(file: string): Promise<{
    version: 1;
    name: string;
    workflow: "product-demo" | "algorithm-explainer" | "footage-repurpose" | "short-form-reel";
    renderer: "remotion";
    fps: 24 | 60 | 30;
    theme: {
        surface: "ambient" | "flat";
        background: string;
        foreground: string;
        accent: string;
        muted: string;
        font: string;
        brand: string;
        tagline: string;
    };
    scenes: {
        kind: "image" | "code" | "title" | "chart" | "algorithm" | "video" | "reel" | "world";
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
            style: "pop" | "minimal";
            energy: number;
            preset: "type-impact" | "fragment-merge" | "orbit-lock" | "signal-flow" | "ribbon" | "frame-morph" | "timeline-cut" | "waveform" | "code-scan" | "data-sculpt" | "word-pulse" | "radial-burst";
            invert: boolean;
            seed: number;
            density: number;
            entrance: "scale" | "push" | "cut";
            palette?: string[] | undefined;
        } | undefined;
        world?: {
            camera: {
                interpolation: "linear" | "smooth";
                keys: {
                    at: number;
                    position: [number, number, number];
                    target: [number, number, number];
                    fov: number;
                    roll: number;
                }[];
            };
            objects: {
                size: [number, number, number];
                color: string;
                roughness: number;
                metalness: number;
                keys: {
                    position: [number, number, number];
                    rotation: [number, number, number];
                    scale: [number, number, number];
                    at: number;
                }[];
                position: [number, number, number];
                rotation: [number, number, number];
                scale: [number, number, number];
                id: string;
                shape: "box" | "sphere" | "torus" | "cylinder" | "plane" | "image" | "model";
                src?: string | undefined;
            }[];
            ambient: number;
            lights: {
                position: [number, number, number];
                color: string;
                intensity: number;
            }[];
            copyPosition: "top" | "bottom" | "none";
            copyAt: number;
        } | undefined;
    }[];
    overlays: {
        kind: "brand" | "call" | "browser" | "steps" | "cta" | "label";
        start: number;
        end: number;
        title: string;
        layout: "top" | "full" | "lower-third";
        offsetY: number;
        fit: "contain" | "cover";
        aspectRatio: number;
        body?: string | undefined;
        eyebrow?: string | undefined;
        src?: string | undefined;
        logo?: string | undefined;
        labels?: string[] | undefined;
        focus?: {
            x: number;
            y: number;
            scale: number;
        } | undefined;
        cursor?: {
            x: number;
            y: number;
            clickAt?: number | undefined;
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
        captionStyle: "pop" | "brand" | "standard";
        safeArea: "reels" | "clean";
    } | undefined;
    footage?: {
        src: string;
        removeSilence: boolean;
        silenceDb: number;
        silenceSeconds: number;
        crop: "contain" | "cover";
        layout: "framed" | "full-frame";
        punchIns: {
            start: number;
            end: number;
            scale: number;
        }[];
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
