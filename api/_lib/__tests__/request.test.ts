// @vitest-environment node
import { describe, expect, it } from "vitest";
import type { ChatMessage } from "../../../src/features/chat/protocol.js";
import { readConfig } from "../config.js";
import { clientIp, hashedClientKey, isOriginAllowed } from "../http.js";
import { parseChatRequest, trimHistory } from "../payload.js";
import { MemoryRateLimiter } from "../rate-limit.js";

describe("parseChatRequest", () => {
  it("accepts a valid request and trims whitespace", () => {
    const result = parseChatRequest({ lang: "es", messages: [{ role: "user", content: "  hola  " }] });
    expect(result).toEqual({ ok: true, data: { lang: "es", messages: [{ role: "user", content: "hola" }] } });
  });

  it("rejects unknown sections and empty messages", () => {
    expect(parseChatRequest({ lang: "en", section: "blog", messages: [{ role: "user", content: "hi" }] }).ok).toBe(false);
    expect(parseChatRequest({ lang: "en", messages: [{ role: "user", content: "   " }] }).ok).toBe(false);
  });
});

describe("trimHistory", () => {
  it("keeps the most recent messages and starts with the visitor", () => {
    const messages: ChatMessage[] = Array.from({ length: 7 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `m${i}`,
    }));
    expect(trimHistory(messages, 4).map((m) => m.content)).toEqual(["m4", "m5", "m6"]);
  });
});

describe("isOriginAllowed", () => {
  const url = "https://giovannylino.vercel.app/api/chat";

  it("allows the deployment's own origin and the allow-list", () => {
    expect(isOriginAllowed("https://giovannylino.vercel.app", url, [], true)).toBe(true);
    expect(isOriginAllowed("https://www.example.com", url, ["https://www.example.com"], true)).toBe(true);
    expect(isOriginAllowed("https://evil.example", url, [], true)).toBe(false);
  });

  it("lets requests without Origin through only outside production", () => {
    expect(isOriginAllowed(null, url, [], false)).toBe(true);
    expect(isOriginAllowed(null, url, [], true)).toBe(false);
  });
});

describe("visitor keys", () => {
  it("uses the first X-Forwarded-For hop", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
    expect(clientIp(new Headers())).toBe("unknown");
  });

  it("hashes the IP with the salt", async () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.7" });
    const key = await hashedClientKey(headers, "salt");
    expect(key).toMatch(/^[0-9a-f]{32}$/);
    expect(key).not.toContain("203");
    expect(await hashedClientKey(headers, "salt")).toBe(key);
    expect(await hashedClientKey(headers, "other")).not.toBe(key);
  });
});

describe("MemoryRateLimiter", () => {
  it("applies a sliding window per key", async () => {
    let now = 0;
    const limiter = new MemoryRateLimiter(2, 1000, () => now);

    expect((await limiter.limit("a")).success).toBe(true);
    now = 500;
    expect((await limiter.limit("a")).success).toBe(true);
    expect(await limiter.limit("a")).toEqual({ success: false, reset: 1000 });
    expect((await limiter.limit("b")).success).toBe(true);
    now = 1001;
    expect((await limiter.limit("a")).success).toBe(true);
  });
});

describe("readConfig", () => {
  it("falls back to safe defaults", () => {
    const config = readConfig({});
    expect(config.llm.model).toBe("gemini-3.5-flash-lite");
    expect(config.llm.fallbackModel).toBe("gemini-3.5-flash-lite");
    expect(config.webSearchEnabled).toBe(false);
    expect(config.rateLimit.perIp).toEqual({ requests: 20, windowSeconds: 600 });
    expect(config.rateLimit.upstash).toBeNull();
    expect(config.isProduction).toBe(false);
  });

  it("turns the model fallback off with 'none'", () => {
    expect(readConfig({ GEMINI_FALLBACK_MODEL: "none" }).llm.fallbackModel).toBeUndefined();
  });

  it("reads the Vercel Upstash integration variables and trims allowed origins", () => {
    const config = readConfig({
      KV_REST_API_URL: "https://redis.example",
      KV_REST_API_TOKEN: "token",
      ALLOWED_ORIGINS: "https://a.example/, https://b.example",
      VERCEL_ENV: "production",
    });
    expect(config.rateLimit.upstash).toEqual({ url: "https://redis.example", token: "token" });
    expect(config.allowedOrigins).toEqual(["https://a.example", "https://b.example"]);
    expect(config.isProduction).toBe(true);
  });
});
