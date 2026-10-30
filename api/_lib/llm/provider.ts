// Provider-neutral contract the agent loop talks to. Adding a provider (e.g. Anthropic)
// means implementing LLMProvider in a sibling file and registering it in index.ts.

export interface ToolCall {
  /** Provider-assigned id, echoed back with the result when the provider uses one. */
  id?: string;
  name: string;
  args: unknown;
}

export interface ToolSpec {
  name: string;
  description: string;
  /** JSON Schema of the arguments object. */
  parameters: Record<string, unknown>;
}

export type Turn =
  | { role: "user"; text: string }
  | {
      role: "assistant";
      text: string;
      toolCalls: ToolCall[];
      /** Provider-native message, replayed verbatim (e.g. Gemini thought signatures). */
      native?: unknown;
    }
  | { role: "tool"; results: { call: ToolCall; output: unknown }[] };

export type AssistantTurn = Extract<Turn, { role: "assistant" }>;

export type FinishReason = "stop" | "max_tokens" | "blocked" | "other";

export type ProviderEvent =
  | { type: "text"; delta: string }
  | { type: "tool-call"; call: ToolCall }
  | { type: "finish"; reason: FinishReason; turn: AssistantTurn };

export interface StreamRequest {
  system: string;
  turns: Turn[];
  tools: ToolSpec[];
  signal?: AbortSignal;
}

export interface LLMProvider {
  readonly name: string;
  stream(request: StreamRequest): AsyncIterable<ProviderEvent>;
}

export type ProviderErrorKind = "quota" | "unavailable" | "invalid_request" | "aborted";

export class ProviderError extends Error {
  constructor(
    readonly kind: ProviderErrorKind,
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
