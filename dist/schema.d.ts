import { z } from "zod";
export declare const wordSchema: z.ZodObject<{
    text: z.ZodString;
    start: z.ZodNumber;
    end: z.ZodNumber;
}, z.core.$strict>;
export declare const wordsSchema: z.ZodArray<z.ZodObject<{
    text: z.ZodString;
    start: z.ZodNumber;
    end: z.ZodNumber;
}, z.core.$strict>>;
export declare const motionPresets: readonly ["type-impact", "fragment-merge", "orbit-lock", "signal-flow", "ribbon", "frame-morph", "timeline-cut", "waveform", "code-scan", "data-sculpt", "word-pulse", "radial-burst"];
export declare const motionSchema: z.ZodObject<{
    preset: z.ZodEnum<{
        "type-impact": "type-impact";
        "fragment-merge": "fragment-merge";
        "orbit-lock": "orbit-lock";
        "signal-flow": "signal-flow";
        ribbon: "ribbon";
        "frame-morph": "frame-morph";
        "timeline-cut": "timeline-cut";
        waveform: "waveform";
        "code-scan": "code-scan";
        "data-sculpt": "data-sculpt";
        "word-pulse": "word-pulse";
        "radial-burst": "radial-burst";
    }>;
    invert: z.ZodDefault<z.ZodBoolean>;
    seed: z.ZodDefault<z.ZodNumber>;
    density: z.ZodDefault<z.ZodNumber>;
    entrance: z.ZodDefault<z.ZodEnum<{
        cut: "cut";
        push: "push";
        scale: "scale";
    }>>;
}, z.core.$strict>;
export declare const sceneSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        title: "title";
        code: "code";
        chart: "chart";
        algorithm: "algorithm";
        image: "image";
        video: "video";
        reel: "reel";
    }>;
    duration: z.ZodNumber;
    title: z.ZodDefault<z.ZodString>;
    eyebrow: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    src: z.ZodOptional<z.ZodString>;
    values: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    highlight: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    note: z.ZodOptional<z.ZodString>;
    motion: z.ZodOptional<z.ZodObject<{
        preset: z.ZodEnum<{
            "type-impact": "type-impact";
            "fragment-merge": "fragment-merge";
            "orbit-lock": "orbit-lock";
            "signal-flow": "signal-flow";
            ribbon: "ribbon";
            "frame-morph": "frame-morph";
            "timeline-cut": "timeline-cut";
            waveform: "waveform";
            "code-scan": "code-scan";
            "data-sculpt": "data-sculpt";
            "word-pulse": "word-pulse";
            "radial-burst": "radial-burst";
        }>;
        invert: z.ZodDefault<z.ZodBoolean>;
        seed: z.ZodDefault<z.ZodNumber>;
        density: z.ZodDefault<z.ZodNumber>;
        entrance: z.ZodDefault<z.ZodEnum<{
            cut: "cut";
            push: "push";
            scale: "scale";
        }>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const projectSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    name: z.ZodString;
    workflow: z.ZodEnum<{
        "product-demo": "product-demo";
        "algorithm-explainer": "algorithm-explainer";
        "footage-repurpose": "footage-repurpose";
        "short-form-reel": "short-form-reel";
    }>;
    renderer: z.ZodDefault<z.ZodLiteral<"remotion">>;
    fps: z.ZodDefault<z.ZodUnion<readonly [z.ZodLiteral<24>, z.ZodLiteral<30>, z.ZodLiteral<60>]>>;
    theme: z.ZodDefault<z.ZodObject<{
        surface: z.ZodDefault<z.ZodEnum<{
            flat: "flat";
            ambient: "ambient";
        }>>;
        background: z.ZodDefault<z.ZodString>;
        foreground: z.ZodDefault<z.ZodString>;
        accent: z.ZodDefault<z.ZodString>;
        muted: z.ZodDefault<z.ZodString>;
        font: z.ZodDefault<z.ZodString>;
        brand: z.ZodDefault<z.ZodString>;
        tagline: z.ZodDefault<z.ZodString>;
    }, z.core.$strict>>;
    reel: z.ZodOptional<z.ZodObject<{
        bpm: z.ZodDefault<z.ZodNumber>;
        safeArea: z.ZodDefault<z.ZodEnum<{
            reels: "reels";
            clean: "clean";
        }>>;
    }, z.core.$strict>>;
    scenes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            title: "title";
            code: "code";
            chart: "chart";
            algorithm: "algorithm";
            image: "image";
            video: "video";
            reel: "reel";
        }>;
        duration: z.ZodNumber;
        title: z.ZodDefault<z.ZodString>;
        eyebrow: z.ZodOptional<z.ZodString>;
        body: z.ZodOptional<z.ZodString>;
        code: z.ZodOptional<z.ZodString>;
        src: z.ZodOptional<z.ZodString>;
        values: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
        highlight: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        note: z.ZodOptional<z.ZodString>;
        motion: z.ZodOptional<z.ZodObject<{
            preset: z.ZodEnum<{
                "type-impact": "type-impact";
                "fragment-merge": "fragment-merge";
                "orbit-lock": "orbit-lock";
                "signal-flow": "signal-flow";
                ribbon: "ribbon";
                "frame-morph": "frame-morph";
                "timeline-cut": "timeline-cut";
                waveform: "waveform";
                "code-scan": "code-scan";
                "data-sculpt": "data-sculpt";
                "word-pulse": "word-pulse";
                "radial-burst": "radial-burst";
            }>;
            invert: z.ZodDefault<z.ZodBoolean>;
            seed: z.ZodDefault<z.ZodNumber>;
            density: z.ZodDefault<z.ZodNumber>;
            entrance: z.ZodDefault<z.ZodEnum<{
                cut: "cut";
                push: "push";
                scale: "scale";
            }>>;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    footage: z.ZodOptional<z.ZodObject<{
        src: z.ZodString;
        segments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            start: z.ZodNumber;
            end: z.ZodNumber;
        }, z.core.$strict>>>;
        removeSilence: z.ZodDefault<z.ZodBoolean>;
        silenceDb: z.ZodDefault<z.ZodNumber>;
        silenceSeconds: z.ZodDefault<z.ZodNumber>;
        crop: z.ZodDefault<z.ZodEnum<{
            contain: "contain";
            cover: "cover";
        }>>;
    }, z.core.$strict>>;
    narration: z.ZodDefault<z.ZodObject<{
        provider: z.ZodDefault<z.ZodEnum<{
            file: "file";
            none: "none";
            kokoro: "kokoro";
            openai: "openai";
        }>>;
        src: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        voice: z.ZodDefault<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        rateUsdPerMillionCharacters: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    captions: z.ZodOptional<z.ZodObject<{
        words: z.ZodOptional<z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            start: z.ZodNumber;
            end: z.ZodNumber;
        }, z.core.$strict>>>;
        transcript: z.ZodOptional<z.ZodString>;
        transcribe: z.ZodDefault<z.ZodBoolean>;
        language: z.ZodDefault<z.ZodString>;
        model: z.ZodDefault<z.ZodEnum<{
            tiny: "tiny";
            base: "base";
            small: "small";
            medium: "medium";
            "large-v3": "large-v3";
            turbo: "turbo";
        }>>;
        maxWords: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>;
    music: z.ZodOptional<z.ZodObject<{
        src: z.ZodString;
        volume: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>;
    generation: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        provider: z.ZodLiteral<"fal">;
        endpoint: z.ZodString;
        input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        maxCostUsd: z.ZodNumber;
        resultType: z.ZodEnum<{
            image: "image";
            video: "video";
        }>;
    }, z.core.$strict>>>;
    cloud: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        maxUsd: z.ZodNumber;
        reservedUsd: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>;
    exports: z.ZodDefault<z.ZodArray<z.ZodObject<{
        preset: z.ZodEnum<{
            landscape: "landscape";
            vertical: "vertical";
            square: "square";
            portrait: "portrait";
        }>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>;
    assets: z.ZodDefault<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        origin: z.ZodString;
        license: z.ZodString;
        credit: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export type Project = z.infer<typeof projectSchema>;
export type Scene = z.infer<typeof sceneSchema>;
export type Word = z.infer<typeof wordSchema>;
export declare const dimensions: {
    readonly landscape: readonly [1920, 1080];
    readonly vertical: readonly [1080, 1920];
    readonly square: readonly [1080, 1080];
    readonly portrait: readonly [1080, 1350];
};
export type RenderProps = {
    project: Project;
    words: Word[];
    narration?: string;
    music?: string;
    footage?: string;
    durationFrames: number;
};
