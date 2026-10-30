// @vitest-environment node
import { describe, expect, it } from "vitest";
import { FallbackProvider } from "../llm/fallback.js";
import { ProviderError, type ProviderEvent, type StreamRequest } from "../llm/index.js";
import { collect, HangingProvider, ScriptedProvider } from "./fakes.js";

const request: StreamRequest = { system: "s", turns: [{ role: "user", text: "oi" }], tools: [] };
const texts = (events: ProviderEvent[]) => events.flatMap((event) => (event.type === "text" ? [event.delta] : []));

describe("FallbackProvider", () => {
  it("uses only the primary when it answers", async () => {
    const primary = new ScriptedProvider([{ text: ["primary"] }]);
    const fallback = new ScriptedProvider([{ text: ["fallback"] }]);

    expect(texts(await collect(new FallbackProvider(primary, fallback).stream(request)))).toEqual(["primary"]);
    expect(fallback.requests).toHaveLength(0);
  });

  it("switches to the fallback when the primary fails before answering, then skips it during the cooldown", async () => {
    let now = 0;
    const primary = new ScriptedProvider([new ProviderError("unavailable", "503 high demand"), { text: ["primary"] }]);
    const fallback = new ScriptedProvider([{ text: ["fallback 1"] }, { text: ["fallback 2"] }, { text: ["fallback 3"] }]);
    const provider = new FallbackProvider(primary, fallback, { cooldownMs: 1000, now: () => now });

    expect(texts(await collect(provider.stream(request)))).toEqual(["fallback 1"]);
    now = 500;
    expect(texts(await collect(provider.stream(request)))).toEqual(["fallback 2"]);
    expect(primary.requests).toHaveLength(1);
    now = 1500;
    expect(texts(await collect(provider.stream(request)))).toEqual(["primary"]);
  });

  it("switches to the fallback when the primary stalls", async () => {
    const fallback = new ScriptedProvider([{ text: ["fallback"] }]);
    const provider = new FallbackProvider(new HangingProvider(), fallback, { firstEventTimeoutMs: 20 });
    expect(texts(await collect(provider.stream(request)))).toEqual(["fallback"]);
  });

  it("does not switch once the primary has started answering", async () => {
    const primary = {
      name: "flaky",
      async *stream() {
        yield { type: "text" as const, delta: "partial" };
        throw new ProviderError("unavailable", "dropped");
      },
    };
    const fallback = new ScriptedProvider([{ text: ["fallback"] }]);
    const seen: string[] = [];
    await expect(async () => {
      for await (const event of new FallbackProvider(primary, fallback).stream(request)) {
        if (event.type === "text") seen.push(event.delta);
      }
    }).rejects.toThrow("dropped");
    expect(seen).toEqual(["partial"]);
    expect(fallback.requests).toHaveLength(0);
  });

  it("does not fall back when the visitor already left", async () => {
    const visitor = new AbortController();
    const fallback = new ScriptedProvider([{ text: ["fallback"] }]);
    const run = collect(new FallbackProvider(new HangingProvider(), fallback).stream({ ...request, signal: visitor.signal }));
    visitor.abort();
    await expect(run).rejects.toThrow();
    expect(fallback.requests).toHaveLength(0);
  });
});
