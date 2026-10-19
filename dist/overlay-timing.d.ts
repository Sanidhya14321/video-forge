/** Frame-derived overlays; pointer coordinates share the screenshot's actual fitted geometry. */
export declare function overlayTiming(frame: number, fps: number, start: number, end: number): {
    visible: boolean;
    local: number;
    duration: number;
    progress: number;
    enter: number;
    opacity: number;
};
export declare function screenshotRect(width: number, height: number, aspect: number, fit: 'contain' | 'cover', focus?: {
    x: number;
    y: number;
    scale: number;
}): {
    x: number;
    y: number;
    width: number;
    height: number;
};
