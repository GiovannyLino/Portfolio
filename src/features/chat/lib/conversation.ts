// Conversation state for the widget as a pure reducer, so every stream event's effect on
// the transcript is unit-testable without React.
import { CHAT_LIMITS, type ChatCard, type ChatErrorCode, type ChatEvent, type ChatMessage, type Source, type ToolName } from "../protocol";

export interface ChatEntry {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "streaming" | "done" | "error";
  cards: ChatCard[];
  sources: Source[];
  suggestions: string[];
  error?: { code: ChatErrorCode; retryAfter?: number };
  /** Local FAQ answer shown when the API could not answer. */
  fallback?: string;
}

/** waiting: request sent or a tool running, no new text yet. streaming: text arriving. */
export type Phase = "idle" | "waiting" | "streaming";

export interface ConversationState {
  entries: ChatEntry[];
  phase: Phase;
  tool: ToolName | null;
}

export type ConversationAction =
  | { type: "send"; user: ChatEntry; assistant: ChatEntry }
  | { type: "event"; id: string; event: ChatEvent }
  | { type: "fail"; id: string; error: { code: ChatErrorCode; retryAfter?: number }; fallback?: string }
  | { type: "stopped"; id: string; placeholder: string }
  | { type: "reset" };

export const emptyConversation = (entries: ChatEntry[] = []): ConversationState => ({ entries, phase: "idle", tool: null });

export const newEntry = (role: ChatEntry["role"], content: string, status: ChatEntry["status"] = "done"): ChatEntry => ({
  id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
  role,
  content,
  status,
  cards: [],
  sources: [],
  suggestions: [],
});

const sameCard = (a: ChatCard, b: ChatCard) => a.kind === b.kind && ("id" in a ? a.id : "") === ("id" in b ? b.id : "");

function applyEvent(entry: ChatEntry, event: ChatEvent): ChatEntry {
  switch (event.type) {
    case "text":
      return { ...entry, content: entry.content + event.delta };
    case "card":
      return entry.cards.some((card) => sameCard(card, event.card)) ? entry : { ...entry, cards: [...entry.cards, event.card] };
    case "sources":
      return { ...entry, sources: event.items };
    case "suggestions":
      return { ...entry, suggestions: event.items };
    case "done":
      return { ...entry, status: "done" };
    default:
      return entry;
  }
}

export function conversationReducer(state: ConversationState, action: ConversationAction): ConversationState {
  const update = (id: string, change: (entry: ChatEntry) => ChatEntry) =>
    state.entries.map((entry) => (entry.id === id ? change(entry) : entry));

  switch (action.type) {
    case "send":
      return { entries: [...state.entries, action.user, action.assistant], phase: "waiting", tool: null };

    case "event": {
      const { event } = action;
      const entries = update(action.id, (entry) => applyEvent(entry, event));
      if (event.type === "text") return { entries, phase: "streaming", tool: null };
      if (event.type === "tool") {
        return event.status === "start" ? { entries, phase: "waiting", tool: event.name } : { entries, phase: state.phase, tool: null };
      }
      if (event.type === "done") return { entries, phase: "idle", tool: null };
      return { ...state, entries };
    }

    case "fail":
      return {
        entries: update(action.id, (entry) => ({ ...entry, status: "error", error: action.error, fallback: action.fallback })),
        phase: "idle",
        tool: null,
      };

    case "stopped":
      return {
        entries: update(action.id, (entry) => ({ ...entry, status: "done", content: entry.content || action.placeholder })),
        phase: "idle",
        tool: null,
      };

    case "reset":
      return emptyConversation();
  }
}

/**
 * Messages sent to the API: answered exchanges only (a question whose answer failed is
 * dropped so the model never sees two user turns in a row), newest last, within limits.
 */
export function toHistory(entries: readonly ChatEntry[], question: string): ChatMessage[] {
  const history: ChatMessage[] = [];
  for (let i = 0; i < entries.length - 1; i++) {
    const [user, answer] = [entries[i], entries[i + 1]];
    if (user.role === "user" && answer.role === "assistant" && answer.status === "done" && answer.content.trim()) {
      history.push(
        { role: "user", content: user.content },
        { role: "assistant", content: answer.content.slice(0, CHAT_LIMITS.maxMessageChars) },
      );
      i++;
    }
  }
  history.push({ role: "user", content: question });
  return history.slice(-CHAT_LIMITS.maxHistoryMessages);
}
