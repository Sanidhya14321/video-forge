import type { Project } from "./schema.js";
export type Fetch = typeof fetch;
export type Reservation = {
    provider: string;
    amountUsd: number;
    state: "reserved" | "submitted" | "completed" | "failed";
    requestId?: string;
};
/** Persist reservations before requests. Failed/ambiguous requests retain their reservation. */
export declare class Budget {
    private config;
    private ledger?;
    private spent;
    private records;
    constructor(config: Project["cloud"], ledger?: string | undefined);
    reserve(provider: string, amount: number): Promise<Reservation>;
    finish(record: Reservation, state: "submitted" | "completed" | "failed", requestId?: string): Promise<void>;
    private save;
}
export declare function speechOpenAI(n: Project["narration"], budget: Budget, out: string, http?: Fetch): Promise<string>;
export declare function falGenerate(job: Project["generation"][number], budget: Budget, outDir: string, http?: Fetch, delay?: (ms: number) => Promise<void>): Promise<{
    path: string;
    requestId: any;
}>;
