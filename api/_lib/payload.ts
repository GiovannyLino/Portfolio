import { z } from "zod/v4";
import { SECTION_IDS } from "../../src/lib/sections.js";
import { CHAT_LIMITS, type ChatMessage, type ChatRequest } from "../../src/features/chat/protocol.js";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(CHAT_LIMITS.maxMessageChars),
});

const chatRequestSchema = z
  .object({
    messages: z.array(messageSchema).min(1).max(50),
    lang: z.enum(["en", "pt", "es"]),
    section: z.enum(SECTION_IDS).optional(),
  })
  .check((ctx) => {
    const last = ctx.value.messages.at(-1);
    if (last?.role !== "user") {
      ctx.issues.push({ code: "custom", message: "last message must come from the user", input: last, path: ["messages"] });
    } else if (last.content.length > CHAT_LIMITS.maxInputChars) {
      ctx.issues.push({
        code: "custom",
        message: `message longer than ${CHAT_LIMITS.maxInputChars} characters`,
        input: last.content,
        path: ["messages"],
      });
    }
  });

export type ParseResult = { ok: true; data: ChatRequest } | { ok: false; issues: string[] };

export function parseChatRequest(body: unknown): ParseResult {
  const result = chatRequestSchema.safeParse(body);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, issues: result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`) };
}

/** Keeps the last messages within the limit and makes sure the history starts with the user. */
export function trimHistory(messages: readonly ChatMessage[], max: number = CHAT_LIMITS.maxHistoryMessages): ChatMessage[] {
  const recent = messages.slice(-max);
  const firstUser = recent.findIndex((message) => message.role === "user");
  return firstUser === -1 ? [] : recent.slice(firstUser);
}
