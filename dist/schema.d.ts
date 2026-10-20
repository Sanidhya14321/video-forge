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
    style: z.ZodDefault<z.ZodEnum<{
        pop: "pop";
        minimal: "minimal";
    }>>;
    palette: z.ZodOptional<z.ZodArray<z.ZodString>>;
    energy: z.ZodDefault<z.ZodNumber>;
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
        scale: "scale";
        push: "push";
        cut: "cut";
    }>>;
}, z.core.$strict>;
export declare const overlaySchema: z.ZodObject<{
    kind: z.ZodEnum<{
        brand: "brand";
        call: "call";
        browser: "browser";
        steps: "steps";
        cta: "cta";
        label: "label";
    }>;
    start: z.ZodNumber;
    end: z.ZodNumber;
    title: z.ZodDefault<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    eyebrow: z.ZodOptional<z.ZodString>;
    src: z.ZodOptional<z.ZodString>;
    logo: z.ZodOptional<z.ZodString>;
    layout: z.ZodDefault<z.ZodEnum<{
        top: "top";
        full: "full";
        "lower-third": "lower-third";
    }>>;
    offsetY: z.ZodDefault<z.ZodNumber>;
    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    fit: z.ZodDefault<z.ZodEnum<{
        contain: "contain";
        cover: "cover";
    }>>;
    aspectRatio: z.ZodDefault<z.ZodNumber>;
    focus: z.ZodOptional<z.ZodObject<{
        x: z.ZodDefault<z.ZodNumber>;
        y: z.ZodDefault<z.ZodNumber>;
        scale: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strict>>;
    cursor: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        clickAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const sceneSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        image: "image";
        code: "code";
        title: "title";
        chart: "chart";
        algorithm: "algorithm";
        video: "video";
        reel: "reel";
        world: "world";
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
        style: z.ZodDefault<z.ZodEnum<{
            pop: "pop";
            minimal: "minimal";
        }>>;
        palette: z.ZodOptional<z.ZodArray<z.ZodString>>;
        energy: z.ZodDefault<z.ZodNumber>;
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
            scale: "scale";
            push: "push";
            cut: "cut";
        }>>;
    }, z.core.$strict>>;
    world: z.ZodOptional<z.ZodObject<{
        camera: z.ZodObject<{
            interpolation: z.ZodDefault<z.ZodEnum<{
                linear: "linear";
                smooth: "smooth";
            }>>;
            keys: z.ZodArray<z.ZodObject<{
                at: z.ZodNumber;
                position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                target: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                fov: z.ZodDefault<z.ZodNumber>;
                roll: z.ZodDefault<z.ZodNumber>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
        objects: z.ZodArray<z.ZodObject<{
            size: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
            color: z.ZodDefault<z.ZodString>;
            roughness: z.ZodDefault<z.ZodNumber>;
            metalness: z.ZodDefault<z.ZodNumber>;
            src: z.ZodOptional<z.ZodString>;
            keys: z.ZodDefault<z.ZodArray<z.ZodObject<{
                position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                rotation: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
                scale: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
                at: z.ZodNumber;
            }, z.core.$strict>>>;
            position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            rotation: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
            scale: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
            id: z.ZodString;
            shape: z.ZodEnum<{
                box: "box";
                sphere: "sphere";
                torus: "torus";
                cylinder: "cylinder";
                plane: "plane";
                image: "image";
                model: "model";
            }>;
        }, z.core.$strict>>;
        ambient: z.ZodDefault<z.ZodNumber>;
        lights: z.ZodDefault<z.ZodArray<z.ZodObject<{
            position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            color: z.ZodDefault<z.ZodString>;
            intensity: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strict>>>;
        copyPosition: z.ZodDefault<z.ZodEnum<{
            top: "top";
            bottom: "bottom";
            none: "none";
        }>>;
        copyAt: z.ZodDefault<z.ZodNumber>;
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
            ambient: "ambient";
            flat: "flat";
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
        captionStyle: z.ZodDefault<z.ZodEnum<{
            pop: "pop";
            brand: "brand";
            standard: "standard";
        }>>;
        safeArea: z.ZodDefault<z.ZodEnum<{
            reels: "reels";
            clean: "clean";
        }>>;
    }, z.core.$strict>>;
    scenes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            image: "image";
            code: "code";
            title: "title";
            chart: "chart";
            algorithm: "algorithm";
            video: "video";
            reel: "reel";
            world: "world";
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
            style: z.ZodDefault<z.ZodEnum<{
                pop: "pop";
                minimal: "minimal";
            }>>;
            palette: z.ZodOptional<z.ZodArray<z.ZodString>>;
            energy: z.ZodDefault<z.ZodNumber>;
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
                scale: "scale";
                push: "push";
                cut: "cut";
            }>>;
        }, z.core.$strict>>;
        world: z.ZodOptional<z.ZodObject<{
            camera: z.ZodObject<{
                interpolation: z.ZodDefault<z.ZodEnum<{
                    linear: "linear";
                    smooth: "smooth";
                }>>;
                keys: z.ZodArray<z.ZodObject<{
                    at: z.ZodNumber;
                    position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                    target: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                    fov: z.ZodDefault<z.ZodNumber>;
                    roll: z.ZodDefault<z.ZodNumber>;
                }, z.core.$strict>>;
            }, z.core.$strict>;
            objects: z.ZodArray<z.ZodObject<{
                size: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
                color: z.ZodDefault<z.ZodString>;
                roughness: z.ZodDefault<z.ZodNumber>;
                metalness: z.ZodDefault<z.ZodNumber>;
                src: z.ZodOptional<z.ZodString>;
                keys: z.ZodDefault<z.ZodArray<z.ZodObject<{
                    position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                    rotation: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
                    scale: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
                    at: z.ZodNumber;
                }, z.core.$strict>>>;
                position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                rotation: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
                scale: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
                id: z.ZodString;
                shape: z.ZodEnum<{
                    box: "box";
                    sphere: "sphere";
                    torus: "torus";
                    cylinder: "cylinder";
                    plane: "plane";
                    image: "image";
                    model: "model";
                }>;
            }, z.core.$strict>>;
            ambient: z.ZodDefault<z.ZodNumber>;
            lights: z.ZodDefault<z.ZodArray<z.ZodObject<{
                position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                color: z.ZodDefault<z.ZodString>;
                intensity: z.ZodDefault<z.ZodNumber>;
            }, z.core.$strict>>>;
            copyPosition: z.ZodDefault<z.ZodEnum<{
                top: "top";
                bottom: "bottom";
                none: "none";
            }>>;
            copyAt: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    overlays: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            brand: "brand";
            call: "call";
            browser: "browser";
            steps: "steps";
            cta: "cta";
            label: "label";
        }>;
        start: z.ZodNumber;
        end: z.ZodNumber;
        title: z.ZodDefault<z.ZodString>;
        body: z.ZodOptional<z.ZodString>;
        eyebrow: z.ZodOptional<z.ZodString>;
        src: z.ZodOptional<z.ZodString>;
        logo: z.ZodOptional<z.ZodString>;
        layout: z.ZodDefault<z.ZodEnum<{
            top: "top";
            full: "full";
            "lower-third": "lower-third";
        }>>;
        offsetY: z.ZodDefault<z.ZodNumber>;
        labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
        fit: z.ZodDefault<z.ZodEnum<{
            contain: "contain";
            cover: "cover";
        }>>;
        aspectRatio: z.ZodDefault<z.ZodNumber>;
        focus: z.ZodOptional<z.ZodObject<{
            x: z.ZodDefault<z.ZodNumber>;
            y: z.ZodDefault<z.ZodNumber>;
            scale: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strict>>;
        cursor: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            clickAt: z.ZodOptional<z.ZodNumber>;
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
        layout: z.ZodDefault<z.ZodEnum<{
            framed: "framed";
            "full-frame": "full-frame";
        }>>;
        punchIns: z.ZodDefault<z.ZodArray<z.ZodObject<{
            start: z.ZodNumber;
            end: z.ZodNumber;
            scale: z.ZodNumber;
        }, z.core.$strict>>>;
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
