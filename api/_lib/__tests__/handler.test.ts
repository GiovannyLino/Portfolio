// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readConfig, type ServerConfig } from "../config.js";
import { createChatHandler } from "../handler.js";
import { MemoryRateLimiter, type RateLimiter } from "../rate-limit.js";
import { HangingProvider, parseSse, ScriptedProvider } from "./fakes.js";

const ORIGIN = "http://localhost:8080";

const setup = (options: { config?: Partial<ServerConfig>; rateLimiter?: RateLimiter; providerFails?: boolean } = {}) => {
  const provider = new ScriptedProvider([{ text: ["Oi!"], calls: [{ name: "suggestNextSteps", args: { suggestions: ["Quem é ele?", "Quais projetos?"] } }] }]);
  const handle = createChatHandler({
    config: { ...readConfig({}), ...options.config },
    rateLimiter: options.rateLimiter ?? new MemoryRateLimiter(100, 60_000),
    createProvider: () => {
      if (options.providerFails) throw new Error("GEMINI_API_KEY is not set");
      return provider;
    },
  });
  return { handle, provider };
};

const post = (body: unknown, headers: Record<string, string> = { origin: ORIGIN }) =>
  new Request(`${ORIGIN}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.7", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const validBody = { lang: "pt", section: "projects", messages: [{ role: "user", content: "Oi" }] };

describe("POST /api/chat", () => {
  it("streams the answer as server-sent events", async () => {
    const { handle } = setup();
    const response = await handle(post(validBody));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/event-stream");
    expect(parseSse(await response.text())).toEqual([
      { type: "text", delta: "Oi!" },
      { type: "suggestions", items: ["Quem é ele?", "Quais projetos?"] },
      { type: "done" },
    ]);
  });

  it("puts the visible section in the system prompt", async () => {
    const { handle, provider } = setup();
    await (await handle(post(validBody))).text();
    expect(provider.requests[0].system).toContain('currently looking at the "projects" section');
  });

  it("rejects other HTTP methods", async () => {
    const { handle } = setup();
    const response = await handle(new Request(`${ORIGIN}/api/chat`));
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
  });

  it("rejects foreign origins", async () => {
    const { handle } = setup();
    const response = await handle(post(validBody, { origin: "https://evil.example" }));
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: { code: "forbidden_origin" } });
  });

  it("accepts origins from ALLOWED_ORIGINS", async () => {
    const { handle } = setup({ config: { allowedOrigins: ["https://giovannylino.vercel.app"] } });
    const response = await handle(post(validBody, { origin: "https://giovannylino.vercel.app" }));
    expect(response.status).toBe(200);
  });

  it("requires an Origin header in production", async () => {
    const { handle } = setup({ config: { isProduction: true } });
    expect((await handle(post(validBody, {}))).status).toBe(403);
  });

  it.each([
    ["malformed JSON", "{not json"],
    ["unknown language", { ...validBody, lang: "fr" }],
    ["an assistant message last", { ...validBody, messages: [{ role: "assistant", content: "hi" }] }],
    ["a message over 500 characters", { ...validBody, messages: [{ role: "user", content: "x".repeat(501) }] }],
  ])("rejects %s with 400", async (_, body) => {
    const { handle } = setup();
    const response = await handle(post(body));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: "invalid_request" } });
  });

  it("rate-limits per visitor with Retry-After", async () => {
    const { handle } = setup({ rateLimiter: new MemoryRateLimiter(1, 60_000) });
    expect((await handle(post(validBody))).status).toBe(200);

    const limited = await handle(post(validBody));
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(await limited.json()).toMatchObject({ error: { code: "rate_limited" } });
  });

  it("ends a stalled turn with upstream_unavailable instead of hanging", async () => {
    const handle = createChatHandler({
      config: readConfig({}),
      rateLimiter: new MemoryRateLimiter(100, 60_000),
      createProvider: () => new HangingProvider(),
      turnTimeoutMs: 50,
    });
    const response = await handle(post(validBody));
    expect(parseSse(await response.text())).toEqual([{ type: "error", code: "upstream_unavailable" }]);
  });

  it("answers 503 when the provider is not configured", async () => {
    const { handle } = setup({ providerFails: true });
    const response = await handle(post(validBody));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: { code: "upstream_unavailable" } });
  });
});
