import { writeFile } from "node:fs/promises";
import path from "node:path";
/** Persist reservations before requests. Failed/ambiguous requests retain their reservation. */
export class Budget {
    config;
    ledger;
    spent = 0;
    records = [];
    constructor(config, ledger) {
        this.config = config;
        this.ledger = ledger;
    }
    async reserve(provider, amount) {
        if (!this.config?.enabled)
            throw new Error("Cloud execution is disabled. Explicitly enable cloud and set maxUsd.");
        if (!Number.isFinite(amount) || amount <= 0)
            throw new Error("A positive maximum request cost is required");
        if (this.spent + amount + (this.config.reservedUsd ?? 0) >
            this.config.maxUsd + 1e-9)
            throw new Error("Cloud spending limit exceeded before request");
        this.spent += amount;
        const record = {
            provider,
            amountUsd: amount,
            state: "reserved",
        };
        this.records.push(record);
        await this.save();
        return record;
    }
    async finish(record, state, requestId) {
        record.state = state;
        record.requestId = requestId;
        await this.save();
    }
    async save() {
        if (this.ledger)
            await writeFile(this.ledger, JSON.stringify({ reservedUsd: this.spent, requests: this.records }, null, 2));
    }
}
async function checked(response) {
    if (!response.ok)
        throw new Error(`Provider request failed (HTTP ${response.status}); reservation retained. Check provider dashboard before retrying.`);
    return response;
}
export async function speechOpenAI(n, budget, out, http = fetch) {
    if (!process.env.OPENAI_API_KEY)
        throw new Error("Set OPENAI_API_KEY before selecting OpenAI narration");
    if (n.text && Array.from(n.text).length > 4096)
        throw new Error("OpenAI speech accepts at most 4096 characters per request; split narration explicitly");
    if (!n.text || !n.rateUsdPerMillionCharacters)
        throw new Error("Speech text and a verified unit rate are required");
    const record = await budget.reserve("openai", ((Array.from(n.text).length * n.rateUsdPerMillionCharacters) / 1e6) * 1.1);
    try {
        const response = await checked(await http("https://api.openai.com/v1/audio/speech", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: n.model ?? "tts-1",
                voice: n.voice === "af_heart" ? "alloy" : n.voice,
                input: n.text,
                response_format: "wav",
            }),
            signal: AbortSignal.timeout(120000),
        }));
        await writeFile(out, Buffer.from(await response.arrayBuffer()));
        await budget.finish(record, "completed");
        return out;
    }
    catch (error) {
        await budget.finish(record, "failed");
        throw error;
    }
}
export async function falGenerate(job, budget, outDir, http = fetch, delay = (ms) => new Promise((r) => setTimeout(r, ms))) {
    if (!process.env.FAL_KEY)
        throw new Error("Set FAL_KEY before selecting fal generation");
    const record = await budget.reserve("fal", job.maxCostUsd);
    const headers = {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
    };
    try {
        const submitted = (await (await checked(await http(`https://queue.fal.run/${job.endpoint}`, {
            method: "POST",
            headers,
            body: JSON.stringify(job.input),
            signal: AbortSignal.timeout(30000),
        }))).json());
        record.requestId = submitted.request_id;
        await budget.finish(record, "submitted", submitted.request_id); // pending jobs remain reserved if polling is interrupted
        const trusted = (url) => {
            const u = new URL(url);
            if (u.protocol !== "https:" || u.hostname !== "queue.fal.run")
                throw new Error("Unexpected fal queue URL");
            return u.toString();
        };
        const statusUrl = trusted(submitted.status_url), resultUrl = trusted(submitted.response_url);
        for (let i = 0; i < 240; i++) {
            const state = (await (await checked(await http(statusUrl, {
                headers,
                signal: AbortSignal.timeout(30000),
            }))).json());
            if (state.status === "COMPLETED") {
                const result = (await (await checked(await http(resultUrl, {
                    headers,
                    signal: AbortSignal.timeout(30000),
                }))).json());
                const url = job.resultType === "image"
                    ? result.images?.[0]?.url
                    : result.video?.url;
                if (!url || new URL(url).protocol !== "https:")
                    throw new Error("fal response did not include an HTTPS media URL");
                const media = await checked(await http(url, { signal: AbortSignal.timeout(120000) }));
                const buffer = Buffer.from(await media.arrayBuffer());
                if (buffer.length > 250 * 1024 * 1024)
                    throw new Error("Generated asset exceeds 250 MB");
                const dest = path.join(outDir, `${job.id}${job.resultType === "image" ? ".png" : ".mp4"}`);
                await writeFile(dest, buffer);
                await budget.finish(record, "completed", submitted.request_id);
                return { path: dest, requestId: submitted.request_id };
            }
            if (state.status === "FAILED" || state.error)
                throw new Error(`fal generation failed; request ${submitted.request_id}`);
            await delay(1000);
        }
        throw new Error(`fal polling timed out; request ${submitted.request_id} may still be running. Reservation retained.`);
    }
    catch (error) {
        await budget.finish(record, "failed", record.requestId);
        throw error;
    }
}
