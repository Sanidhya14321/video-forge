import { z } from 'zod';
export declare const scoreSchema: z.ZodArray<z.ZodObject<{
    startFrame: z.ZodNumber;
    endFrame: z.ZodNumber;
    kind: z.ZodEnum<{
        accent: "accent";
        audio: "audio";
        shot: "shot";
        reading: "reading";
        transition: "transition";
    }>;
    label: z.ZodString;
    mechanism: z.ZodOptional<z.ZodString>;
}, z.core.$strict>>;
export declare const codeProjectSchema: z.ZodObject<{
    version: z.ZodLiteral<2>;
    name: z.ZodString;
    entryPoint: z.ZodString;
    compositionId: z.ZodString;
    publicDir: z.ZodDefault<z.ZodString>;
    inputProps: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    gl: z.ZodDefault<z.ZodEnum<{
        angle: "angle";
        swangle: "swangle";
    }>>;
    score: z.ZodDefault<z.ZodString>;
    captions: z.ZodOptional<z.ZodObject<{
        transcript: z.ZodString;
    }, z.core.$strict>>;
    quality: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        final: "final";
    }>>;
    overrides: z.ZodDefault<z.ZodObject<{
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        fps: z.ZodOptional<z.ZodNumber>;
        durationInFrames: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    exports: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>;
    requires: z.ZodDefault<z.ZodObject<{
        htmlInCanvas: z.ZodDefault<z.ZodBoolean>;
        audio: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type CodeProject = z.infer<typeof codeProjectSchema>;
export declare function draftScale(width: number, height: number): number;
export declare function isCodeProject(file: string): Promise<boolean>;
export declare function readCodeProject(file: string): Promise<{
    version: 2;
    name: string;
    entryPoint: string;
    compositionId: string;
    publicDir: string;
    inputProps: Record<string, unknown>;
    gl: "angle" | "swangle";
    score: string;
    quality: "draft" | "final";
    overrides: {
        width?: number | undefined;
        height?: number | undefined;
        fps?: number | undefined;
        durationInFrames?: number | undefined;
    };
    exports: {
        name: string;
        width?: number | undefined;
        height?: number | undefined;
    }[];
    requires: {
        htmlInCanvas: boolean;
        audio: boolean;
    };
    captions?: {
        transcript: string;
    } | undefined;
}>;
export declare function reviewCode(file: string): Promise<{
    version: number;
    name: string;
    score: {
        startFrame: number;
        endFrame: number;
        kind: "accent" | "audio" | "shot" | "reading" | "transition";
        label: string;
        mechanism?: string | undefined;
    }[];
    pacing: {
        label: string;
        startFrame: number;
        endFrame: number;
        longestDeclaredEventGapFrames: number;
        readingWindows: number;
    }[];
    warnings: {
        code: string;
        message: string;
    }[];
    limits: string;
}>;
export declare function checkCode(file: string): Promise<{
    valid: boolean;
    execution: boolean;
    name: string;
    composition: {
        width: number;
        height: number;
        fps: number;
        durationInFrames: number;
        id: string;
        defaultProps: Record<string, unknown>;
        props: Record<string, unknown>;
        defaultCodec: import("remotion").Codec | null;
        defaultOutName: string | null;
        defaultVideoImageFormat: import("remotion").VideoImageFormat | null;
        defaultPixelFormat: import("remotion").PixelFormat | null;
        defaultProResProfile: ("standard" | "4444-xq" | "4444" | "hq" | "light" | "proxy") | null;
        defaultSampleRate: number | null;
    };
    review: {
        version: number;
        name: string;
        score: {
            startFrame: number;
            endFrame: number;
            kind: "accent" | "audio" | "shot" | "reading" | "transition";
            label: string;
            mechanism?: string | undefined;
        }[];
        pacing: {
            label: string;
            startFrame: number;
            endFrame: number;
            longestDeclaredEventGapFrames: number;
            readingWindows: number;
        }[];
        warnings: {
            code: string;
            message: string;
        }[];
        limits: string;
    };
}>;
export declare function runCode(file: string, outDir?: string, preview?: boolean): Promise<{
    output: string;
    checks: {
        streams: undefined;
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
export declare function initCode(directory: string): Promise<{
    project: string;
    next: string;
}>;
/** Pixel evidence for independently sampled frames; no sequential playback state is assumed. */
export declare function verifyCodeFrames(file: string, outDir: string, frames: number[]): Promise<{
    consistent: boolean;
    samples: {
        frame: number;
        file: string;
        sha256: string;
    }[];
    scope: string;
}>;
