import type { ChatErrorBody, ChatErrorCode, ChatEvent, ChatRequest } from "../protocol";
import { createSseParser } from "./stream-parser";

const ENDPOINT = "/api/chat";

const isErrorCode = (value: unknown): value is ChatErrorCode =>
  typeof value === "string" &&
  ["invalid_request", "forbidden_origin", "rate_limited", "upstream_quota", "upstream_unavailable", "internal"].includes(value);

async function errorFromResponse(response: Response): Promise<ChatEvent> {
  const body = (await response.json().catch(() => null)) as Partial<ChatErrorBody> | null;
  const retryHeader = Number(response.headers.get("retry-after"));
  const code = isErrorCode(body?.error?.code)
    ? body.error.code
    : response.status === 429
      ? "rate_limited"
      : "upstream_unavailable";
  const retryAfter = body?.error?.retryAfter ?? (Number.isFinite(retryHeader) && retryHeader > 0 ? retryHeader : undefined);
  return retryAfter === undefined ? { type: "error", code } : { type: "error", code, retryAfter };
}

/**
 * Sends one chat request and yields the server's events as they arrive. Network and HTTP
 * failures become a single error event; aborting (the visitor pressed stop) ends quietly.
 */
export async function* streamChat(
  request: ChatRequest,
  signal?: AbortSignal,
  fetchImpl: typeof fetch = fetch,
): AsyncGenerator<ChatEvent> {
  let response: Response;
  try {
    response = await fetchImpl(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal,
    });
  } catch {
    if (!signal?.aborted) yield { type: "error", code: "upstream_unavailable" };
    return;
  }

  if (!response.ok || !response.body) {
    yield await errorFromResponse(response);
    return;
  }

  const parser = createSseParser();
  const decoder = new TextDecoder();
  const reader = response.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      yield* parser.push(decoder.decode(value, { stream: true }));
    }
    yield* parser.push(decoder.decode());
    yield* parser.flush();
  } catch {
    if (!signal?.aborted) yield { type: "error", code: "upstream_unavailable" };
  } finally {
    reader.releaseLock();
  }
}
