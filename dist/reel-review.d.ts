import { type Project } from './schema.js';
export declare function reviewProject(project: Project): {
    version: number;
    editorialHeuristics: boolean;
    engagementPrediction: boolean;
    reel: boolean;
    durationSeconds: number | null;
    shots: number;
    averageShotSeconds: number;
    uniqueTreatments: number;
    timeline: {
        index: number;
        startFrame: number;
        endFrame: number;
        seconds: number;
        treatment: "type-impact" | "fragment-merge" | "orbit-lock" | "signal-flow" | "ribbon" | "frame-morph" | "timeline-cut" | "waveform" | "code-scan" | "data-sculpt" | "word-pulse" | "radial-burst" | "title" | "code" | "chart" | "algorithm" | "image" | "video" | "reel";
        title: string;
        previewFrames: number[];
    }[];
    warnings: {
        code: string;
        scene?: number;
        message: string;
    }[];
    layouts: {
        safe: import("./reel-layout.js").Box;
        content: import("./reel-layout.js").Box;
        caption: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        font: number;
        motif: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        preset: "landscape" | "vertical" | "square" | "portrait";
        width: number;
        height: number;
    }[];
    limits: string;
};
