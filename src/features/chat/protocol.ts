// Wire contract between /api/chat and the chat widget: the request body, and the
// Server-Sent Events stream (one JSON ChatEvent per `data:` line). Imported by both
// sides, so keep it free of DOM, Node and React APIs and use .js import specifiers.
import type { Language } from "../../i18n/translations.js";
import type { SectionId } from "../../lib/sections.js";

export const CHAT_LIMITS = {
  /** Longest message a visitor can send. */
  maxInputChars: 500,
  /** Messages of history forwarded to the model (older ones are dropped). */
  maxHistoryMessages: 12,
  /** Upper bound for any single message in the payload (assistant replies included). */
  maxMessageChars: 4000,
} as const;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  /** Language selected on the site; the model still answers in the visitor's language. */
  lang: Language;
  /** Section visible when the message was sent, as reported by the scrollspy. */
  section?: SectionId;
}

export type ToolName =
  | "searchPortfolio"
  | "getProjectDetails"
  | "navigateToSection"
  | "highlightProject"
  | "suggestNextSteps"
  | "openContact"
  | "webSearch";

/** Page actions the widget performs when the model calls a UI tool. */
export type UiAction =
  | { type: "navigate"; section: SectionId }
  | { type: "highlightProject"; projectId: string }
  | { type: "openContact"; subject: string; message?: string };

/** Rich cards rendered in the conversation; the widget resolves ids against the knowledge base. */
export type ChatCard = { kind: "project"; id: string } | { kind: "skill"; id: string } | { kind: "contact" };

export interface Source {
  title: string;
  url: string;
}

export type ChatErrorCode =
  | "invalid_request"
  | "forbidden_origin"
  | "rate_limited"
  | "upstream_quota"
  | "upstream_unavailable"
  | "internal";

export type ChatEvent =
  | { type: "text"; delta: string }
  | { type: "tool"; name: ToolName; status: "start" | "end" }
  | { type: "ui"; action: UiAction }
  | { type: "card"; card: ChatCard }
  | { type: "suggestions"; items: string[] }
  | { type: "sources"; items: Source[] }
  | { type: "error"; code: ChatErrorCode; retryAfter?: number }
  | { type: "done" };

/** Body of non-streaming error responses (4xx before the stream starts). */
export interface ChatErrorBody {
  error: { code: ChatErrorCode; retryAfter?: number };
}

export const encodeEvent = (event: ChatEvent): string => `data: ${JSON.stringify(event)}\n\n`;
