import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { projectSchema, wordsSchema } from "../src/schema.js";
import {
  remapWords,
  invertSilences,
  intersectSegments,
  srt,
} from "../src/media.js";
import { Budget, speechOpenAI, falGenerate } from "../src/providers.js";
const basic = {
  version: 1,
  name: "test",
  workflow: "product-demo",
  scenes: [{ kind: "title", title: "Test", duration: 2 }],
};
test("project rejects missing scene assets and invalid mathematical inputs", () => {
  assert.throws(() =>
    projectSchema.parse({ ...basic, scenes: [{ kind: "image", duration: 2 }] }),
  );
  assert.throws(() =>
    projectSchema.parse({
      ...basic,
      scenes: [{ kind: "chart", duration: 2, values: [-2] }],
    }),
  );
  assert.throws(() =>
    projectSchema.parse({
      ...basic,
      scenes: [{ kind: "algorithm", duration: 2, values: [2], highlight: [2] }],
    }),
  );
  assert.throws(() =>
    projectSchema.parse({
      ...basic,
      exports: [{ preset: "vertical", width: 541, height: 960 }],
    }),
  );
  assert.throws(() => projectSchema.parse({ ...basic, unknown: true }));
});
test("caption source is unambiguous and timestamps are ordered", () => {
  assert.throws(() => projectSchema.parse({ ...basic, captions: {} }));
  assert.throws(() =>
    projectSchema.parse({
      ...basic,
      captions: { words: [], transcribe: true },
    }),
  );
  assert.throws(() => wordsSchema.parse([{ text: "a", start: 2, end: 1 }]));
  assert.throws(() =>
    wordsSchema.parse([
      { text: "a", start: 2, end: 3 },
      { text: "b", start: 0, end: 1 },
    ]),
  );
});
test("cut remapping preserves reordering, intersections, and repeated segments", () => {
  const words = [
    { text: "A", start: 1, end: 2 },
    { text: "B", start: 5, end: 6 },
  ];
  assert.deepEqual(
    remapWords(words, [
      { start: 4, end: 7 },
      { start: 1.5, end: 2 },
      { start: 4, end: 7 },
    ]),
    [
      { text: "B", start: 1, end: 2 },
      { text: "A", start: 3, end: 3.5 },
      { text: "B", start: 4.5, end: 5.5 },
    ],
  );
});
test("silence keeps useful padding and composes with explicit selections", () => {
  const spans = invertSilences(
    5,
    [
      { start: 0, end: 1 },
      { start: 3, end: 5 },
    ],
    0.1,
  );
  assert.deepEqual(spans, [{ start: 0.9, end: 3.1 }]);
  assert.deepEqual(invertSilences(5, [{ start: 0, end: 5 }]), []);
  assert.deepEqual(intersectSegments([{ start: 1, end: 4 }], spans), [
    { start: 1, end: 3.1 },
  ]);
  assert.deepEqual(invertSilences(4, []), [{ start: 0, end: 4 }]);
});
test("SRT carries milliseconds over minute boundaries", () => {
  assert.match(
    srt([{ text: "Hello", start: 59.9998, end: 60.5 }]),
    /00:01:00,000 --> 00:01:00,500/,
  );
});
test("disabled or exhausted cloud budget blocks the transport", async () => {
  let calls = 0;
  const http = async () => {
    calls++;
    throw new Error("must not call");
  };
  const old = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "mock-only";
  try {
    const n = {
      provider: "openai" as const,
      voice: "alloy",
      text: "hello",
      rateUsdPerMillionCharacters: 15,
    };
    await assert.rejects(
      () => speechOpenAI(n, new Budget(undefined), "unused", http as any),
      /disabled/,
    );
    await assert.rejects(
      () =>
        speechOpenAI(
          n,
          new Budget({ enabled: true, maxUsd: 0.000001, reservedUsd: 0 }),
          "unused",
          http as any,
        ),
      /limit/,
    );
    assert.equal(calls, 0);
  } finally {
    if (old === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = old;
  }
});
test("speech mock writes real bytes and keeps reservation after failure", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "vf-provider-"));
  const old = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "mock-only";
  try {
    let body: any;
    const http = async (_url: any, init: any) => {
      body = JSON.parse(init.body);
      return new Response(new Uint8Array([82, 73, 70, 70]));
    };
    const ledger = path.join(dir, "spending.json"),
      out = path.join(dir, "voice.wav");
    const budget = new Budget(
      { enabled: true, maxUsd: 1, reservedUsd: 0 },
      ledger,
    );
    await speechOpenAI(
      {
        provider: "openai",
        voice: "alloy",
        text: "hello",
        rateUsdPerMillionCharacters: 15,
      },
      budget,
      out,
      http as any,
    );
    assert.equal(body.response_format, "wav");
    assert.equal(body.model, "tts-1");
    assert.equal((await readFile(out)).length, 4);
    const failure = async () => new Response("", { status: 503 });
    await assert.rejects(
      () =>
        speechOpenAI(
          {
            provider: "openai",
            voice: "alloy",
            text: "hello",
            rateUsdPerMillionCharacters: 15,
          },
          budget,
          out,
          failure as any,
        ),
      /HTTP 503/,
    );
    const log = JSON.parse(await readFile(ledger, "utf8"));
    assert.equal(log.requests[1].state, "failed");
    assert.ok(log.reservedUsd > log.requests[0].amountUsd);
  } finally {
    if (old === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = old;
    await rm(dir, { recursive: true, force: true });
  }
});
test("fal queue polls one submitted request and downloads its output without leaking auth", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "vf-fal-"));
  const old = process.env.FAL_KEY;
  process.env.FAL_KEY = "mock-only";
  const calls: string[] = [];
  let polls = 0;
  try {
    const http = async (url: string, init: any) => {
      calls.push(url);
      if (url === "https://queue.fal.run/fal-ai/mock")
        return Response.json({
          request_id: "abc",
          status_url: "https://queue.fal.run/fal-ai/mock/requests/abc/status",
          response_url: "https://queue.fal.run/fal-ai/mock/requests/abc",
        });
      if (url.endsWith("/status"))
        return Response.json({
          status: ++polls === 1 ? "IN_PROGRESS" : "COMPLETED",
        });
      if (url.endsWith("/abc"))
        return Response.json({
          images: [{ url: "https://media.fal.media/test.png" }],
        });
      assert.equal(init.headers, undefined);
      return new Response(new Uint8Array([137, 80, 78, 71]));
    };
    const result = await falGenerate(
      {
        id: "test",
        provider: "fal",
        endpoint: "fal-ai/mock",
        input: { prompt: "test" },
        maxCostUsd: 0.1,
        resultType: "image",
      },
      new Budget({ enabled: true, maxUsd: 1, reservedUsd: 0 }),
      dir,
      http as any,
      async () => {},
    );
    assert.equal(result.requestId, "abc");
    assert.equal(
      calls.filter((c) => c === "https://queue.fal.run/fal-ai/mock").length,
      1,
    );
    assert.equal((await readFile(result.path)).length, 4);
  } finally {
    if (old === undefined) delete process.env.FAL_KEY;
    else process.env.FAL_KEY = old;
    await rm(dir, { recursive: true, force: true });
  }
});
test("fal rejects untrusted queue status URLs before sending its key", async () => {
  const old = process.env.FAL_KEY;
  process.env.FAL_KEY = "mock-only";
  let calls = 0;
  try {
    await assert.rejects(
      () =>
        falGenerate(
          {
            id: "test",
            provider: "fal",
            endpoint: "fal-ai/mock",
            input: {},
            maxCostUsd: 1,
            resultType: "video",
          },
          new Budget({ enabled: true, maxUsd: 2, reservedUsd: 0 }),
          ".",
          (async () => {
            calls++;
            return Response.json({
              request_id: "bad",
              status_url: "https://example.com/steal",
              response_url: "https://queue.fal.run/result",
            });
          }) as any,
        ),
      /Unexpected fal/,
    );
    assert.equal(calls, 1);
  } finally {
    if (old === undefined) delete process.env.FAL_KEY;
    else process.env.FAL_KEY = old;
  }
});
test("fal video result shape is supported and provider errors remain failures", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "vf-video-"));
  const old = process.env.FAL_KEY;
  process.env.FAL_KEY = "mock-only";
  try {
    const job = {
      id: "clip",
      provider: "fal" as const,
      endpoint: "fal-ai/mock-video",
      input: { prompt: "test" },
      maxCostUsd: 0.2,
      resultType: "video" as const,
    };
    const http = async (url: string) =>
      url === "https://queue.fal.run/fal-ai/mock-video"
        ? Response.json({
            request_id: "vid",
            status_url: "https://queue.fal.run/status",
            response_url: "https://queue.fal.run/result",
          })
        : url.endsWith("/status")
          ? Response.json({ status: "COMPLETED" })
          : url.endsWith("/result")
            ? Response.json({
                video: { url: "https://media.fal.media/clip.mp4" },
              })
            : new Response(new Uint8Array([0, 0, 0, 24]));
    const result = await falGenerate(
      job,
      new Budget({ enabled: true, maxUsd: 1, reservedUsd: 0 }),
      dir,
      http as any,
      async () => {},
    );
    assert.match(result.path, /clip\.mp4$/);
    const bad = async (url: string) =>
      url.endsWith("/status")
        ? Response.json({ status: "FAILED", error: "no output" })
        : Response.json({
            request_id: "fail",
            status_url: "https://queue.fal.run/status",
            response_url: "https://queue.fal.run/result",
          });
    await assert.rejects(
      () =>
        falGenerate(
          job,
          new Budget({ enabled: true, maxUsd: 1, reservedUsd: 0 }),
          dir,
          bad as any,
          async () => {},
        ),
      /failed/,
    );
  } finally {
    if (old === undefined) delete process.env.FAL_KEY;
    else process.env.FAL_KEY = old;
    await rm(dir, { recursive: true, force: true });
  }
});
test("oversized speech is rejected before budget reservation or transport", async () => {
  const old = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "mock-only";
  let called = false;
  try {
    await assert.rejects(
      () =>
        speechOpenAI(
          {
            provider: "openai",
            voice: "alloy",
            text: "a".repeat(4097),
            rateUsdPerMillionCharacters: 15,
          },
          new Budget({ enabled: true, maxUsd: 1, reservedUsd: 0 }),
          "unused",
          (async () => {
            called = true;
            return new Response();
          }) as any,
        ),
      /4096/,
    );
    assert.equal(called, false);
  } finally {
    if (old === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = old;
  }
});
