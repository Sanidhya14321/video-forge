import { dimensions } from './schema.js';
import { reelLayout } from './reel-layout.js';
import { cameraAt } from './world.js';
export function reviewProject(project) {
    let frame = 0;
    const timeline = project.scenes.map((scene, index) => {
        const start = frame;
        frame += Math.round(scene.duration * project.fps);
        return { index: index + 1, startFrame: start, endFrame: frame, seconds: (frame - start) / project.fps,
            treatment: scene.motion?.preset ?? scene.kind, style: scene.motion?.style ?? "standard", title: scene.title,
            previewFrames: [Math.min(frame - 1, start + Math.max(1, Math.round(project.fps * .18))), Math.min(frame - 1, start + Math.round((frame - start) * .70)), frame - 1] };
    });
    const warnings = [];
    const reel = Boolean(project.reel);
    if (reel) {
        if (timeline[0]?.seconds > 2)
            warnings.push({ code: 'slow-opening', scene: 1, message: 'The first shot exceeds 2s. Inspect whether its action delivers the hook before changing its duration.' });
        for (let i = 0; i < project.scenes.length; i++) {
            const s = project.scenes[i];
            if (s.duration > 2.5)
                warnings.push({ code: 'long-hold', scene: i + 1, message: 'Shot exceeds the fast-reel starting range; inspect action and reading load before trimming it.' });
            if (i >= 2 && timeline[i].treatment === timeline[i - 1].treatment && timeline[i].treatment === timeline[i - 2].treatment)
                warnings.push({ code: 'repeated-treatment', scene: i + 1, message: 'Three adjacent shots share one treatment. Change visual grammar or demonstrate a purposeful continuous action.' });
            if (s.title.replace(/\s/g, '').length > 28 || s.title.split('\n').length > 2)
                warnings.push({ code: 'dense-headline', scene: i + 1, message: 'Headline may crowd the phone layout. Shorten it or author a custom composition.' });
            if ((s.motion?.preset === 'code-scan' || s.kind === 'code') && (s.code?.length ?? 0) > 90 && s.duration < 2.5)
                warnings.push({ code: 'unreadable-code', scene: i + 1, message: 'Long code cannot be read at this pace. Isolate a meaningful line or extend this evidence shot.' });
        }
        const families = new Set(timeline.map(s => s.treatment));
        if (timeline.length >= 6 && families.size < 4)
            warnings.push({ code: 'low-variety', message: 'Few named treatments recur. Inspect framing, assets and shot functions; do not add effects simply to meet a variety quota.' });
        const titleCount = project.scenes.filter(s => s.kind === 'title' || s.motion?.preset === 'type-impact').length;
        if (project.scenes.length >= 6 && titleCount / project.scenes.length > .5)
            warnings.push({ code: 'slide-heavy', message: 'Most shots are title treatments. Replace explanatory labels with objects that perform the idea, unless this is intentionally a type-led film.' });
    }
    const cameraShots = project.scenes.flatMap((s, i) => {
        if (!s.world)
            return [];
        const samples = Array.from({ length: 41 }, (_, n) => cameraAt(n / 40 * s.duration, s.world.camera));
        const distance = Math.min(...samples.map(p => Math.hypot(...p.position.map((v, j) => v - p.target[j]))));
        if (distance < .2)
            warnings.push({ code: 'camera-target-clearance', scene: i + 1, message: 'Camera approaches/crosses its look target; inspect clipping, flips and the intended landing.' });
        if (samples.some(p => Math.abs(p.roll) > Math.PI / 4))
            warnings.push({ code: 'large-camera-roll', scene: i + 1, message: 'Strong camera roll: check orientation and reading comfort for this shot.' });
        const times = s.world.camera.keys.flatMap((k, n) => n === 0 ? [k.at] : [(s.world.camera.keys[n - 1].at + k.at) / 2, k.at]);
        const previewFrames = [...new Set(times.map(t => Math.min(timeline[i].endFrame - 1, timeline[i].startFrame + Math.round(t * project.fps))))];
        return [{ scene: i + 1, objects: s.world.objects.length, models: s.world.objects.filter(o => o.shape === 'model').length, interpolation: s.world.camera.interpolation, minimumSampledTargetDistance: distance, fovRange: [Math.min(...samples.map(p => p.fov)), Math.max(...samples.map(p => p.fov))], previewFrames, scope: 'Sampled camera-target clearance only; not mesh collision detection or a taste score' }];
    });
    for (const [i, o] of project.overlays.entries())
        if (o.kind === "browser" && o.end - o.start < .8)
            warnings.push({ code: "short-evidence-hold", message: `Overlay ${i + 1}: screenshot is visible for less than 0.8s; allow a readable evidence hold.` });
    return { version: 1, editorialHeuristics: true, engagementPrediction: false, reel,
        durationSeconds: project.footage ? null : frame / project.fps, shots: timeline.length,
        averageShotSeconds: timeline.length ? frame / project.fps / timeline.length : 0,
        uniqueTreatments: new Set(timeline.map(s => s.treatment)).size,
        overlayCount: project.overlays.length, overlayKinds: [...new Set(project.overlays.map(o => o.kind))], overlayTimeline: project.overlays.map(o => ({ kind: o.kind, start: o.start, end: o.end, title: o.title, src: o.src })),
        timeline, cameraShots, warnings,
        layouts: project.exports.map(target => { const [w, h] = target.width ? [target.width, target.height] : dimensions[target.preset]; return { preset: target.preset, width: w, height: h, ...reelLayout(w, h, project.reel?.safeArea) }; }),
        limits: 'Timing and layout heuristics do not establish taste, factual accuracy, caption recognition accuracy, retention, or current platform UI coverage.' };
}
