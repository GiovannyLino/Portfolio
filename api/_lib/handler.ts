// Request handling for POST /api/chat, with its dependencies injected so tests can run it
// against a fake provider and an in-memory rate limiter.
import { encodeEvent, type ChatErrorCode, type ChatEvent } from "../../src/features/chat/protocol.js";
import { runAgent } from "./agent.js";
import type { ServerConfig } from "./config.js";
import { hashedClientKey, isOriginAllowed, jsonError } from "./http.js";
import type { LLMProvider } from "./llm/index.js";
import { parseChatRequest, trimHistory } from "./payload.js";
import type { RateLimiter } from "./rate-limit.js";
import { buildSystemPrompt } from "./system-prompt.js";
import { buildTools } from "./tools.js";
import type { WebSearch } from "./web-search.js";

/**
 * One line per answered request, for usage and quota monitoring in the Vercel logs.
 * Anonymous by construction: no message text, no IP, no visitor id.
 */
export interface TurnLog {
  event: "chat_turn";
  lang: string;
  section: string | null;
  /** Tools the model called (data tools, plus UI tools as "ui:<action>"). */
  tools: string[];
  outcome: "answered" | "aborted" | ChatErrorCode;
  durationMs: number;
}

export interface ChatDependencies {
  config: ServerConfig;
  rateLimiter: RateLimiter;
  createProvider: (config: ServerConfig) => LLMProvider;
  webSearch?: WebSearch;
  turnTimeoutMs?: number;
  log?: (entry: TurnLog) => void;
}

/** Folds the stream's events into the anonymous turn summary. */
function turnRecorder(lang: string, section: string | null) {
  const started = Date.now();
  const tools: string[] = [];
  let outcome: TurnLog["outcome"] = "aborted";
  return {
    see(event: ChatEvent) {
      if (event.type === "tool" && event.status === "start") tools.push(event.name);
      else if (event.type === "ui") tools.push(`ui:${event.action.type}`);
      else if (event.type === "error") outcome = event.code;
      else if (event.type === "done") outcome = "answered";
    },
    entry: (): TurnLog => ({ event: "chat_turn", lang, section, tools, outcome, durationMs: Date.now() - started }),
  };
}

const MAX_BODY_CHARS = 64 * 1024;
/** Whole-turn budget, below the function's maxDuration (30 s in vercel.json). */
const TURN_TIMEOUT_MS = 25_000;

const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  "X-Accel-Buffering": "no",
};

export function createChatHandler(deps: ChatDependencies): (request: Request) => Promise<Response> {
  const { config } = deps;
  const tools = buildTools({ webSearchEnabled: config.webSearchEnabled });

  return async (request) => {
    if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
    if (!isOriginAllowed(request.headers.get("origin"), request.url, config.allowedOrigins, config.isProduction)) {
      return jsonError(403, "forbidden_origin");
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARS) return jsonError(413, "invalid_request");
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return jsonError(400, "invalid_request");
    }
    const parsed = parseChatRequest(body);
    if (!parsed.ok) return jsonError(400, "invalid_request");

    const limit = await deps.rateLimiter.limit(await hashedClientKey(request.headers, config.ipHashSalt));
    if (!limit.success) return jsonError(429, "rate_limited", Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000)));

    let provider: LLMProvider;
    try {
      provider = deps.createProvider(config);
    } catch (error) {
      console.error("[chat] provider unavailable:", error instanceof Error ? error.message : error);
      return jsonError(503, "upstream_unavailable");
    }

    const { lang, section, messages } = parsed.data;
    // Aborted when the visitor disconnects (stream cancel) or when the turn runs out of time.
    const abort = new AbortController();
    const signal = AbortSignal.any([abort.signal, AbortSignal.timeout(deps.turnTimeoutMs ?? TURN_TIMEOUT_MS)]);
    const events = runAgent({
      provider,
      system: buildSystemPrompt({ lang, section, webSearchEnabled: config.webSearchEnabled }),
      history: trimHistory(messages),
      tools,
      context: { lang, webSearch: deps.webSearch, signal },
      signal,
    });

    const encoder = new TextEncoder();
    const turn = turnRecorder(lang, section ?? null);
    let logged = false;
    const logTurn = () => {
      if (logged) return;
      logged = true;
      deps.log?.(turn.entry());
    };

    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        try {
          const { value, done } = await events.next();
          if (done) {
            logTurn();
            controller.close();
            return;
          }
          turn.see(value);
          controller.enqueue(encoder.encode(encodeEvent(value)));
        } catch (error) {
          // Log the failure, never the conversation.
          console.error("[chat] stream failed:", error instanceof Error ? error.message : error);
          turn.see({ type: "error", code: "internal" });
          logTurn();
          controller.enqueue(encoder.encode(encodeEvent({ type: "error", code: "internal" })));
          controller.close();
        }
      },
      async cancel() {
        abort.abort();
        logTurn();
        await events.return(undefined);
      },
    });

    return new Response(stream, { headers: SSE_HEADERS });
  };
}
