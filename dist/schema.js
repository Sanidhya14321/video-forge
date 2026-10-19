import { z } from "zod";
const safeColor = z.string().regex(/^#[0-9a-fA-F]{6}$/);
export const wordSchema = z
    .object({
    text: z.string().min(1).max(120),
    start: z.number().nonnegative(),
    end: z.number().positive(),
})
    .strict()
    .refine((w) => w.end > w.start, "Word end must follow start");
export const wordsSchema = z.array(wordSchema).superRefine((words, ctx) => {
    for (let i = 1; i < words.length; i++)
        if (words[i].start < words[i - 1].start)
            ctx.addIssue({
                code: "custom",
                message: "Words must be sorted by start time",
                path: [i],
            });
});
export const motionPresets = [
    "type-impact", "fragment-merge", "orbit-lock", "signal-flow",
    "ribbon", "frame-morph", "timeline-cut", "waveform",
    "code-scan", "data-sculpt", "word-pulse", "radial-burst",
];
export const motionSchema = z.object({
    style: z.enum(["minimal", "pop"]).default("minimal"),
    palette: z.array(safeColor).min(3).max(8).optional(),
    energy: z.number().min(1).max(3).default(2),
    preset: z.enum(motionPresets),
    invert: z.boolean().default(false),
    seed: z.number().int().min(0).max(99999).default(7),
    density: z.number().int().min(3).max(16).default(8),
    entrance: z.enum(["cut", "push", "scale"]).default("cut"),
}).strict();
export const sceneSchema = z
    .object({
    kind: z.enum(["title", "code", "chart", "algorithm", "image", "video", "reel"]),
    duration: z.number().min(0.2).max(600),
    title: z.string().max(100).default(""),
    eyebrow: z.string().max(80).optional(),
    body: z.string().max(350).optional(),
    code: z.string().max(2400).optional(),
    src: z.string().min(1).optional(),
    values: z
        .array(z.number().finite().nonnegative())
        .min(1)
        .max(12)
        .optional(),
    labels: z.array(z.string().max(20)).max(12).optional(),
    highlight: z.array(z.number().int().nonnegative()).optional(),
    note: z.string().max(200).optional(),
    motion: motionSchema.optional(),
})
    .strict()
    .superRefine((s, ctx) => {
    if (s.kind === "reel" && !s.motion)
        ctx.addIssue({ code: "custom", message: "Reel scene requires motion" });
    if (s.kind !== "reel" && s.motion)
        ctx.addIssue({ code: "custom", message: "motion belongs to reel scenes" });
    if (s.motion?.preset === "code-scan" && !s.code)
        ctx.addIssue({ code: "custom", message: "code-scan requires code" });
    if (s.motion?.preset === "data-sculpt" && !s.values)
        ctx.addIssue({ code: "custom", message: "data-sculpt requires values" });
    if (["image", "video"].includes(s.kind) && !s.src)
        ctx.addIssue({ code: "custom", message: `${s.kind} scene requires src` });
    if (["chart", "algorithm"].includes(s.kind) && !s.values)
        ctx.addIssue({
            code: "custom",
            message: `${s.kind} scene requires values`,
        });
    if (s.kind === "code" && !s.code)
        ctx.addIssue({ code: "custom", message: "Code scene requires code" });
    if (s.labels && s.values && s.labels.length !== s.values.length)
        ctx.addIssue({ code: "custom", message: "labels must match values" });
    if (s.highlight?.some((i) => i >= (s.values?.length ?? 0)))
        ctx.addIssue({
            code: "custom",
            message: "Highlight index exceeds values",
        });
});
const paidSchema = z
    .object({
    enabled: z.boolean().default(false),
    maxUsd: z.number().positive().max(1000),
    reservedUsd: z.number().nonnegative().default(0),
})
    .strict();
export const projectSchema = z
    .object({
    version: z.literal(1),
    name: z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/),
    workflow: z.enum([
        "product-demo",
        "algorithm-explainer",
        "footage-repurpose",
        "short-form-reel",
    ]),
    renderer: z.literal("remotion").default("remotion"),
    fps: z.union([z.literal(24), z.literal(30), z.literal(60)]).default(30),
    theme: z
        .object({
        surface: z.enum(["flat", "ambient"]).default("flat"),
        background: safeColor.default("#0b1020"),
        foreground: safeColor.default("#f1f5f9"),
        accent: safeColor.default("#68e0cf"),
        muted: safeColor.default("#a8b3cc"),
        font: z.string().max(80).default("Arial, sans-serif"),
        brand: z.string().max(80).default(""),
        tagline: z.string().max(80).default(""),
    })
        .strict()
        .default({
        surface: "flat",
        background: "#0b1020",
        foreground: "#f1f5f9",
        accent: "#68e0cf",
        muted: "#a8b3cc",
        font: "Arial, sans-serif",
        brand: "",
        tagline: "",
    }),
    reel: z.object({
        bpm: z.number().min(60).max(200).default(160),
        captionStyle: z.enum(["standard", "pop"]).default("standard"),
        safeArea: z.enum(["reels", "clean"]).default("reels"),
    }).strict().optional(),
    scenes: z.array(sceneSchema).max(100).default([]),
    footage: z
        .object({
        src: z.string(),
        segments: z
            .array(z
            .object({
            start: z.number().nonnegative(),
            end: z.number().positive(),
        })
            .strict()
            .refine((s) => s.end > s.start, "Segment end must follow start"))
            .min(1)
            .max(100)
            .optional(),
        removeSilence: z.boolean().default(false),
        silenceDb: z.number().min(-80).max(-10).default(-35),
        silenceSeconds: z.number().min(0.2).max(10).default(0.6),
        crop: z.enum(["contain", "cover"]).default("contain"),
        layout: z.enum(["framed", "full-frame"]).default("framed"),
        punchIns: z.array(z.object({
            start: z.number().nonnegative(),
            end: z.number().positive(),
            scale: z.number().min(1).max(1.35),
        }).strict().refine(p => p.end > p.start, "Punch-in end must follow start")).max(32).default([]),
    })
        .strict()
        .optional(),
    narration: z
        .object({
        provider: z.enum(["none", "file", "kokoro", "openai"]).default("none"),
        src: z.string().optional(),
        text: z.string().max(20000).optional(),
        voice: z.string().max(80).default("af_heart"),
        model: z.string().max(100).optional(),
        rateUsdPerMillionCharacters: z.number().positive().optional(),
    })
        .strict()
        .default({ provider: "none", voice: "af_heart" }),
    captions: z
        .object({
        words: wordsSchema.optional(),
        transcript: z.string().optional(),
        transcribe: z.boolean().default(false),
        language: z
            .string()
            .regex(/^[a-z]{2,3}$/)
            .default("en"),
        model: z
            .enum(["tiny", "base", "small", "medium", "large-v3", "turbo"])
            .default("base"),
        maxWords: z.number().int().min(1).max(8).default(5),
    })
        .strict()
        .optional(),
    music: z
        .object({
        src: z.string(),
        volume: z.number().min(0).max(1).default(0.12),
    })
        .strict()
        .optional(),
    generation: z
        .array(z
        .object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        provider: z.literal("fal"),
        endpoint: z.string().regex(/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_\/-]+$/),
        input: z.record(z.string(), z.unknown()),
        maxCostUsd: z.number().positive(),
        resultType: z.enum(["image", "video"]),
    })
        .strict())
        .max(20)
        .default([]),
    cloud: paidSchema.optional(),
    exports: z
        .array(z
        .object({
        preset: z.enum(["landscape", "vertical", "square", "portrait"]),
        width: z
            .number()
            .int()
            .min(240)
            .max(3840)
            .refine((n) => n % 2 === 0)
            .optional(),
        height: z
            .number()
            .int()
            .min(240)
            .max(3840)
            .refine((n) => n % 2 === 0)
            .optional(),
    })
        .strict()
        .refine((x) => Boolean(x.width) === Boolean(x.height), "Set both width and height"))
        .min(1)
        .max(4)
        .default([{ preset: "landscape" }]),
    assets: z
        .array(z
        .object({
        path: z.string(),
        origin: z.string(),
        license: z.string(),
        credit: z.string().optional(),
    })
        .strict())
        .default([]),
})
    .strict()
    .superRefine((p, ctx) => {
    if (p.workflow === "short-form-reel" && !p.reel)
        ctx.addIssue({ code: "custom", message: "short-form-reel requires reel pacing settings" });
    if (p.scenes.some(s => s.kind === "reel") && !p.reel)
        ctx.addIssue({ code: "custom", message: "Reel scenes require reel settings" });
    if (p.workflow === "footage-repurpose" && !p.footage)
        ctx.addIssue({
            code: "custom",
            message: "Footage workflow requires footage",
        });
    if (p.workflow !== "footage-repurpose" && !p.scenes.length)
        ctx.addIssue({
            code: "custom",
            message: "At least one scene is required",
        });
    if (p.workflow === "footage-repurpose" && p.scenes.length)
        ctx.addIssue({
            code: "custom",
            message: "Footage workflow uses footage, not scenes",
        });
    if (p.narration.provider === "file" && !p.narration.src)
        ctx.addIssue({ code: "custom", message: "File narration requires src" });
    if (["kokoro", "openai"].includes(p.narration.provider) &&
        !p.narration.text)
        ctx.addIssue({
            code: "custom",
            message: "Generated narration requires text",
        });
    if (p.narration.provider === "openai" &&
        p.narration.model &&
        !["tts-1", "tts-1-hd"].includes(p.narration.model))
        ctx.addIssue({
            code: "custom",
            message: "Budgeted speech supports per-character tts-1 and tts-1-hd models",
        });
    if (p.narration.provider === "openai" &&
        !p.narration.rateUsdPerMillionCharacters)
        ctx.addIssue({
            code: "custom",
            message: "Set a verified speech rateUsdPerMillionCharacters for budgeting",
        });
    const c = p.captions;
    if (c &&
        [c.words !== undefined, c.transcript !== undefined, c.transcribe].filter(Boolean).length !== 1)
        ctx.addIssue({
            code: "custom",
            message: "Captions require exactly one of words, transcript, transcribe",
        });
    if (new Set(p.exports.map((x) => x.preset)).size !== p.exports.length)
        ctx.addIssue({
            code: "custom",
            message: "Export presets must be unique",
        });
});
export const dimensions = {
    landscape: [1920, 1080],
    vertical: [1080, 1920],
    square: [1080, 1080],
    portrait: [1080, 1350],
};
