import type { ChatEntry } from "./conversation";

const KEY = "gioai:conversation:v1";
const MAX_ENTRIES = 40;

// localStorage can be unavailable or throw (private mode, blocked site data, quota):
// every access is guarded and the chat simply starts empty.

const isEntry = (value: unknown): value is ChatEntry => {
  const entry = value as Partial<ChatEntry> | null;
  return (
    typeof entry === "object" &&
    entry !== null &&
    typeof entry.id === "string" &&
    (entry.role === "user" || entry.role === "assistant") &&
    typeof entry.content === "string" &&
    Array.isArray(entry.cards) &&
    Array.isArray(entry.sources) &&
    Array.isArray(entry.suggestions)
  );
};

export function loadConversation(storage: Storage | undefined = globalThis.localStorage): ChatEntry[] {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(KEY) ?? "[]");
    // Only finished messages are kept; a reload mid-answer must not leave a stuck bubble.
    return Array.isArray(parsed) ? parsed.filter(isEntry).filter((entry) => entry.status !== "streaming") : [];
  } catch {
    return [];
  }
}

export function saveConversation(entries: readonly ChatEntry[], storage: Storage | undefined = globalThis.localStorage): void {
  try {
    storage?.setItem(KEY, JSON.stringify(entries.filter((entry) => entry.status !== "streaming").slice(-MAX_ENTRIES)));
  } catch {
    // Full or blocked storage: the conversation just won't survive a reload.
  }
}

export function clearConversation(storage: Storage | undefined = globalThis.localStorage): void {
  try {
    storage?.removeItem(KEY);
  } catch {
    // Nothing to clean up.
  }
}
