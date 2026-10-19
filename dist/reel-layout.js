export function reelLayout(width, height, preset = "reels") {
    const vertical = height > width * 1.25;
    // Conservative project defaults, not a promise about every app's current UI.
    const top = vertical && preset === "reels" ? .14 : .08;
    const bottom = vertical && preset === "reels" ? .35 : .12;
    const safe = { x: width * .08, y: height * top, width: width * .80, height: height * (1 - top - bottom) };
    const captionHeight = Math.min(width * .17, safe.height * .22);
    const content = { ...safe, height: safe.height - captionHeight - 24 * (width / 1080) };
    return {
        safe, content,
        caption: { x: safe.x, y: safe.y + safe.height - captionHeight, width: safe.width, height: captionHeight },
        font: Math.min(safe.width * .175, content.height * .17),
        motif: { x: safe.x, y: content.y + content.height * .40, width: safe.width, height: content.height * .60 },
    };
}
export function beatAt(frame, fps, bpm) { return frame / fps * bpm / 60; }
export function easeOut(t) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 4); }
export function seededUnit(seed, index) {
    // Stable integer hash, independent of render concurrency or ambient RNG.
    let x = (seed ^ Math.imul(index + 1, 0x45d9f3b)) | 0;
    x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
    return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}
/** Group measured words without carrying a sentence into the next subtitle. */
export function captionGroup(words, index, maxWords, maxChars = 34) {
    if (index < 0 || index >= words.length)
        return { start: 0, end: 0 };
    let start = 0, end = 0;
    while (end <= index) {
        start = end;
        let chars = 0;
        while (end < words.length && end - start < Math.max(1, maxWords)) {
            const next = words[end].text.length + 1;
            if (end > start && chars + next > maxChars)
                break;
            chars += next;
            end++;
            if (/[.!?]$/.test(words[end - 1].text))
                break;
        }
    }
    return { start, end };
}
