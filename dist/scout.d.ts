/** Sampling assists source inspection; it does not identify the best action or take. */
export declare function scoutVideo(input: string, output: string): Promise<{
    output: string;
    frames: number;
    contactSheet: string;
    scope: string;
}>;
