// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { encodeEvent, type ChatEvent, type ChatRequest } from "../protocol";
import { streamChat } from "./chat-client";

const request: ChatRequest = { lang: "pt", messages: [{ role: "user", content: "Oi" }] };

const collect = async (iterable: AsyncIterable<ChatEvent>) => {
  const events: ChatEvent[] = [];
  for await (const event of iterable) events.push(event);
  return events;
};

const sseResponse = (chunks: string[]) => {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
      controller.close();
    },
  });
  return new Response(body, { headers: { "Content-Type": "text/event-stream" } });
};

describe("streamChat", () => {
  it("posts the request and yields the streamed events", async () => {
    const wire = encodeEvent({ type: "text", delta: "Olá" }) + encodeEvent({ type: "done" });
    const fetchMock = vi.fn(async () => sseResponse([wire.slice(0, 10), wire.slice(10)]));

    const events = await collect(streamChat(request, undefined, fetchMock as unknown as typeof fetch));

    expect(events).toEqual([{ type: "text", delta: "Olá" }, { type: "done" }]);
    expect(fetchMock).toHaveBeenCalledWith("/api/chat", expect.objectContaining({ method: "POST", body: JSON.stringify(request) }));
  });

  it("turns an HTTP error body into one error event", async () => {
    const fetchMock = async () =>
      Response.json({ error: { code: "rate_limited", retryAfter: 120 } }, { status: 429, headers: { "Retry-After": "120" } });
    expect(await collect(streamChat(request, undefined, fetchMock as typeof fetch))).toEqual([
      { type: "error", code: "rate_limited", retryAfter: 120 },
    ]);
  });

  it("falls back to the status code when the error body is unreadable", async () => {
    const fetchMock = async () => new Response("<html>bad gateway</html>", { status: 502 });
    expect(await collect(streamChat(request, undefined, fetchMock as typeof fetch))).toEqual([
      { type: "error", code: "upstream_unavailable" },
    ]);
  });

  it("reports network failures", async () => {
    const fetchMock = async () => {
      throw new TypeError("Failed to fetch");
    };
    expect(await collect(streamChat(request, undefined, fetchMock as typeof fetch))).toEqual([
      { type: "error", code: "upstream_unavailable" },
    ]);
  });

  it("ends quietly when the visitor aborts", async () => {
    const controller = new AbortController();
    controller.abort();
    const fetchMock = async () => {
      throw new DOMException("aborted", "AbortError");
    };
    expect(await collect(streamChat(request, controller.signal, fetchMock as typeof fetch))).toEqual([]);
  });
});
