/** Pure layout/time helpers shared by the renderer and pre-render review. */
export type Box = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare function reelLayout(width: number, height: number, preset?: "reels" | "clean"): {
    safe: Box;
    content: Box;
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
};
export declare function beatAt(frame: number, fps: number, bpm: number): number;
export declare function easeOut(t: number): number;
export declare function seededUnit(seed: number, index: number): number;
/** Group measured words without carrying a sentence into the next subtitle. */
export declare function captionGroup(words: readonly {
    text: string;
}[], index: number, maxWords: number, maxChars?: number): {
    start: number;
    end: number;
};
