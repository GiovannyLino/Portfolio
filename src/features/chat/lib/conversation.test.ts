import { describe, expect, it } from "vitest";
import { baseMood } from "./mood";
import { conversationReducer, emptyConversation, newEntry, toHistory, type ChatEntry, type ConversationState } from "./conversation";

const start = (): { state: ConversationState; id: string } => {
  const user = newEntry("user", "Oi");
  const assistant = newEntry("assistant", "", "streaming");
  return { state: conversationReducer(emptyConversation(), { type: "send", user, assistant }), id: assistant.id };
};

describe("conversationReducer", () => {
  it("tracks phase and tool while an answer streams in", () => {
    const { state: initial, id } = start();
    let state = initial;
    expect(state.phase).toBe("waiting");

    state = conversationReducer(state, { type: "event", id, event: { type: "tool", name: "searchPortfolio", status: "start" } });
    expect(state).toMatchObject({ phase: "waiting", tool: "searchPortfolio" });

    state = conversationReducer(state, { type: "event", id, event: { type: "text", delta: "Ol" } });
    state = conversationReducer(state, { type: "event", id, event: { type: "text", delta: "á" } });
    expect(state).toMatchObject({ phase: "streaming", tool: null });
    expect(state.entries[1].content).toBe("Olá");

    state = conversationReducer(state, { type: "event", id, event: { type: "done" } });
    expect(state.phase).toBe("idle");
    expect(state.entries[1].status).toBe("done");
  });

  it("collects cards once, sources and suggestions", () => {
    const { state: initial, id } = start();
    let state = initial;
    const card = { kind: "project", id: "poc-in-a-box" } as const;
    state = conversationReducer(state, { type: "event", id, event: { type: "card", card } });
    state = conversationReducer(state, { type: "event", id, event: { type: "card", card } });
    state = conversationReducer(state, { type: "event", id, event: { type: "card", card: { kind: "contact" } } });
    state = conversationReducer(state, { type: "event", id, event: { type: "suggestions", items: ["E aí?"] } });

    expect(state.entries[1].cards).toEqual([card, { kind: "contact" }]);
    expect(state.entries[1].suggestions).toEqual(["E aí?"]);
  });

  it("stores the error and the local fallback answer", () => {
    const { state, id } = start();
    const failed = conversationReducer(state, { type: "fail", id, error: { code: "rate_limited", retryAfter: 60 }, fallback: "FAQ" });
    expect(failed.phase).toBe("idle");
    expect(failed.entries[1]).toMatchObject({ status: "error", error: { code: "rate_limited", retryAfter: 60 }, fallback: "FAQ" });
  });

  it("keeps partial text when stopped, or a placeholder when nothing arrived", () => {
    const { state, id } = start();
    expect(conversationReducer(state, { type: "stopped", id, placeholder: "_parado_" }).entries[1].content).toBe("_parado_");

    const partial = conversationReducer(state, { type: "event", id, event: { type: "text", delta: "Meia" } });
    expect(conversationReducer(partial, { type: "stopped", id, placeholder: "_parado_" }).entries[1].content).toBe("Meia");
  });
});

describe("toHistory", () => {
  const entry = (role: ChatEntry["role"], content: string, status: ChatEntry["status"] = "done") => ({
    ...newEntry(role, content, status),
  });

  it("sends answered exchanges plus the new question", () => {
    const entries = [entry("user", "a"), entry("assistant", "A"), entry("user", "b"), entry("assistant", "", "error")];
    expect(toHistory(entries, "c")).toEqual([
      { role: "user", content: "a" },
      { role: "assistant", content: "A" },
      { role: "user", content: "c" },
    ]);
  });

  it("keeps only the most recent messages", () => {
    const entries = Array.from({ length: 20 }, (_, i) => [entry("user", `q${i}`), entry("assistant", `a${i}`)]).flat();
    const history = toHistory(entries, "new");
    expect(history).toHaveLength(12);
    expect(history.at(-1)).toEqual({ role: "user", content: "new" });
  });
});

describe("baseMood", () => {
  it("follows the conversation phase and typing", () => {
    expect(baseMood("waiting", false)).toBe("thinking");
    expect(baseMood("streaming", true)).toBe("talking");
    expect(baseMood("idle", true)).toBe("listening");
    expect(baseMood("idle", false)).toBe("idle");
  });
});
