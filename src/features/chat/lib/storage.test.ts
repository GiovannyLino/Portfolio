import { describe, expect, it } from "vitest";
import { newEntry } from "./conversation";
import { localAnswer } from "./fallback";
import { clearConversation, loadConversation, saveConversation } from "./storage";

const memoryStorage = (): Storage => {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, value),
  };
};

const throwingStorage = (): Storage => {
  const fail = () => {
    throw new DOMException("blocked", "SecurityError");
  };
  return { length: 0, clear: fail, getItem: fail, key: fail, removeItem: fail, setItem: fail };
};

describe("conversation storage", () => {
  it("round-trips finished messages and drops one still streaming", () => {
    const storage = memoryStorage();
    const entries = [newEntry("user", "Oi"), newEntry("assistant", "Olá!"), newEntry("assistant", "meia", "streaming")];
    saveConversation(entries, storage);
    expect(loadConversation(storage)).toEqual(entries.slice(0, 2));
  });

  it("ignores corrupted or foreign data", () => {
    const storage = memoryStorage();
    storage.setItem("gioai:conversation:v1", "{not json");
    expect(loadConversation(storage)).toEqual([]);
    storage.setItem("gioai:conversation:v1", JSON.stringify([{ id: 1, role: "hacker" }]));
    expect(loadConversation(storage)).toEqual([]);
  });

  it("never throws when storage is blocked", () => {
    const storage = throwingStorage();
    expect(loadConversation(storage)).toEqual([]);
    expect(() => saveConversation([newEntry("user", "Oi")], storage)).not.toThrow();
    expect(() => clearConversation(storage)).not.toThrow();
  });
});

describe("localAnswer", () => {
  it("answers from the curated FAQ when the API is down", () => {
    expect(localAnswer("quais certificações ele tem?", "pt")).toMatch(/^Ele possui: Iquall NetOps/);
  });

  it("routes 'how do I talk to him' to the contact answer, not to spoken languages", () => {
    expect(localAnswer("Como falar com ele?", "pt")).toMatch(/^Por email em giovannylino9@gmail\.com/);
  });

  it("returns nothing for questions outside the portfolio", () => {
    expect(localAnswer("receita de bolo de cenoura", "pt")).toBeUndefined();
  });
});
