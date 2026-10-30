import type { ChatEvent } from "../protocol";

const EVENT_TYPES = new Set<ChatEvent["type"]>(["text", "tool", "ui", "card", "suggestions", "sources", "error", "done"]);

const isChatEvent = (value: unknown): value is ChatEvent =>
  typeof value === "object" &&
  value !== null &&
  EVENT_TYPES.has((value as { type?: unknown }).type as ChatEvent["type"]);

export interface SseParser {
  /** Feeds decoded text; returns the events completed by this chunk. */
  push(chunk: string): ChatEvent[];
  /** Returns an event left without its trailing blank line when the stream ends. */
  flush(): ChatEvent[];
}

/**
 * Incremental parser for the /api/chat Server-Sent Events stream. Chunks can split an
 * event anywhere; malformed or unknown events are skipped instead of breaking the chat.
 */
export function createSseParser(): SseParser {
  let buffer = "";

  const parseBlock = (block: string): ChatEvent | null => {
    const data = block
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");
    if (!data) return null;
    try {
      const value: unknown = JSON.parse(data);
      return isChatEvent(value) ? value : null;
    } catch {
      return null;
    }
  };

  const drain = (final: boolean): ChatEvent[] => {
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = final ? "" : (blocks.pop() ?? "");
    return blocks.map(parseBlock).filter((event): event is ChatEvent => event !== null);
  };

  return {
    push(chunk) {
      buffer += chunk;
      return drain(false);
    },
    flush() {
      return drain(true);
    },
  };
}
