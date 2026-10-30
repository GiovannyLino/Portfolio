// @vitest-environment node
import { ApiError } from "@google/genai";
import { describe, expect, it } from "vitest";
import { mapFinishReason, toContents, toGeminiSchema, toProviderError } from "../llm/gemini.js";
import { buildSystemPrompt } from "../system-prompt.js";
import { createWikipediaSearch, pickTitle } from "../web-search.js";

describe("Gemini adapter", () => {
  it("keeps only the JSON Schema keywords Gemini accepts", () => {
    const schema = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "object",
      additionalProperties: false,
      properties: { tags: { type: "array", items: { type: "string", maxLength: 9, pattern: "x" } } },
      required: ["tags"],
    };
    expect(toGeminiSchema(schema)).toEqual({
      type: "object",
      properties: { tags: { type: "array", items: { type: "string", maxLength: 9 } } },
      required: ["tags"],
    });
  });

  it("sends tool results as functionResponse parts and replays native assistant content", () => {
    const native = { role: "model", parts: [{ functionCall: { id: "c1", name: "searchPortfolio" }, thoughtSignature: "sig" }] };
    const contents = toContents([
      { role: "user", text: "oi" },
      { role: "assistant", text: "", toolCalls: [], native },
      { role: "tool", results: [{ call: { id: "c1", name: "searchPortfolio", args: {} }, output: ["a"] }] },
    ]);

    expect(contents[0]).toEqual({ role: "user", parts: [{ text: "oi" }] });
    expect(contents[1]).toBe(native);
    expect(contents[2]).toEqual({
      role: "user",
      parts: [{ functionResponse: { id: "c1", name: "searchPortfolio", response: { result: ["a"] } } }],
    });
  });

  it("maps finish reasons and API errors", () => {
    expect(mapFinishReason("STOP")).toBe("stop");
    expect(mapFinishReason("SAFETY")).toBe("blocked");
    expect(toProviderError(new ApiError({ message: "quota", status: 429 })).kind).toBe("quota");
    expect(toProviderError(new ApiError({ message: "down", status: 503 })).kind).toBe("unavailable");
    expect(toProviderError(new ApiError({ message: "bad schema", status: 400 })).kind).toBe("invalid_request");
    const badKey = toProviderError(new ApiError({ message: '{"error": {"message": "API key not valid."}}', status: 400 }));
    expect(badKey.kind).toBe("unavailable");
    expect(badKey.message).toContain("check GEMINI_API_KEY");
    expect(toProviderError(Object.assign(new Error("x"), { name: "AbortError" })).kind).toBe("aborted");
  });
});

describe("Wikipedia search", () => {
  // Titles as returned by Wikipedia's search for these queries (Oct 2026).
  it.each([
    ["NetBox", ["CyberHound", "Superact"], undefined],
    ["Cisco NSO", ["Exploit (computer security)", "Brian Dickinson (climber)"], undefined],
    ["ThousandEyes", ["Night Has a Thousand Eyes", "Brainin"], undefined],
    ["Ansible", ["Ansible", "Ansible (software)"], "Ansible (software)"],
    ["Splunk", ["Splunk Inc.", "Aprendizado de máquina"], "Splunk Inc."],
    ["Infrastructure as code", ["Infrastructure as code", "Pulumi"], "Infrastructure as code"],
  ])("picks %s → %s", (query, titles, expected) => {
    expect(pickTitle(query, titles)).toBe(expected);
  });

  it("falls back to English Wikipedia and returns a citable source", async () => {
    const fakeFetch = (async (input: string | URL | Request) => {
      const url = String(input);
      if (url.startsWith("https://pt.")) return Response.json({ query: { search: [] } });
      if (url.includes("/w/api.php")) return Response.json({ query: { search: [{ title: "Splunk" }] } });
      return Response.json({
        title: "Splunk",
        extract: "Splunk Inc. is an American software company.",
        content_urls: { desktop: { page: "https://en.wikipedia.org/wiki/Splunk" } },
      });
    }) as typeof fetch;

    const result = await createWikipediaSearch(fakeFetch)("Splunk", "pt");
    expect(result).toEqual({
      summary: "Splunk Inc. is an American software company.",
      sources: [{ title: "Splunk — Wikipedia", url: "https://en.wikipedia.org/wiki/Splunk" }],
    });
  });
});

describe("system prompt", () => {
  it("embeds the knowledge base in the site language with ids for the tools", () => {
    const prompt = buildSystemPrompt({ lang: "pt", webSearchEnabled: false });
    expect(prompt).toContain("Analista de Service Provider @ Logicalis");
    expect(prompt).toContain("[netbox-ansible-pipeline]");
    expect(prompt).toContain("internal project, no public code or demo");
    expect(prompt).toContain("The visitor is at the top of the page.");
  });

  it("mentions webSearch only when it is enabled", () => {
    expect(buildSystemPrompt({ lang: "en", webSearchEnabled: false })).not.toContain("webSearch");
    expect(buildSystemPrompt({ lang: "en", webSearchEnabled: true })).toContain("- webSearch:");
  });

  it("never contains the phone number from the CV", () => {
    expect(buildSystemPrompt({ lang: "en", webSearchEnabled: true })).not.toMatch(/97365|\(\+?55\)/);
  });
});
