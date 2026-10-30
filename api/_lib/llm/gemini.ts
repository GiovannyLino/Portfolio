import {
  ApiError,
  GoogleGenAI,
  ThinkingLevel,
  type Content,
  type FinishReason as GeminiFinishReason,
  type Part,
} from "@google/genai";
import {
  ProviderError,
  type FinishReason,
  type LLMProvider,
  type ProviderEvent,
  type StreamRequest,
  type ToolCall,
  type ToolSpec,
  type Turn,
} from "./provider.js";

export interface GeminiOptions {
  apiKey: string;
  model: string;
  /** Optional ThinkingLevel (MINIMAL | LOW | MEDIUM | HIGH); the model default applies when unset. */
  thinkingLevel?: string;
  maxOutputTokens?: number;
}

// JSON Schema keywords the Gemini function-declaration schema accepts; anything else
// (e.g. "$schema", "additionalProperties" from zod) is dropped before sending.
const SCHEMA_KEYS = new Set([
  "type",
  "description",
  "properties",
  "required",
  "items",
  "enum",
  "minimum",
  "maximum",
  "minItems",
  "maxItems",
  "minLength",
  "maxLength",
  "format",
  "nullable",
]);

export function toGeminiSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(toGeminiSchema);
  if (typeof schema !== "object" || schema === null) return schema;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema)) {
    if (!SCHEMA_KEYS.has(key)) continue;
    if (key === "properties" && typeof value === "object" && value !== null) {
      result.properties = Object.fromEntries(Object.entries(value).map(([name, child]) => [name, toGeminiSchema(child)]));
    } else {
      result[key] = key === "items" ? toGeminiSchema(value) : value;
    }
  }
  return result;
}

const asResponseObject = (output: unknown): Record<string, unknown> =>
  typeof output === "object" && output !== null && !Array.isArray(output)
    ? (output as Record<string, unknown>)
    : { result: output };

export function toContents(turns: readonly Turn[]): Content[] {
  return turns.map((turn): Content => {
    switch (turn.role) {
      case "user":
        return { role: "user", parts: [{ text: turn.text }] };
      case "assistant":
        // Replaying the native content keeps thought signatures, which Gemini requires
        // when the same turn continues after function calls.
        return (turn.native as Content | undefined) ?? { role: "model", parts: [{ text: turn.text }] };
      case "tool":
        return {
          role: "user",
          parts: turn.results.map(({ call, output }) => ({
            functionResponse: { id: call.id, name: call.name, response: asResponseObject(output) },
          })),
        };
    }
  });
}

export function mapFinishReason(reason: GeminiFinishReason | string | undefined): FinishReason {
  switch (reason) {
    case undefined:
    case "STOP":
      return "stop";
    case "MAX_TOKENS":
      return "max_tokens";
    case "SAFETY":
    case "RECITATION":
    case "BLOCKLIST":
    case "PROHIBITED_CONTENT":
    case "SPII":
      return "blocked";
    default:
      return "other";
  }
}

export function toProviderError(error: unknown): ProviderError {
  if (error instanceof ProviderError) return error;
  if (error instanceof Error && error.name === "AbortError") return new ProviderError("aborted", "request aborted");
  if (error instanceof ApiError) {
    const message = error.message.replace(/\s+/g, " ").slice(0, 300);
    if (error.status === 429) return new ProviderError("quota", "Gemini quota exceeded", 429);
    // A bad or revoked key is a deployment problem, not a malformed request.
    const badKey = error.status === 401 || error.status === 403 || /api key/i.test(error.message);
    if (badKey) return new ProviderError("unavailable", `check GEMINI_API_KEY: ${message}`, error.status);
    if (error.status === 400 || error.status === 404) return new ProviderError("invalid_request", message, error.status);
    return new ProviderError("unavailable", message, error.status);
  }
  return new ProviderError("unavailable", error instanceof Error ? error.message : String(error));
}

const toFunctionDeclarations = (tools: readonly ToolSpec[]) =>
  tools.map((tool) => ({ name: tool.name, description: tool.description, parametersJsonSchema: toGeminiSchema(tool.parameters) }));

export class GeminiProvider implements LLMProvider {
  readonly name = "gemini";
  private readonly client: GoogleGenAI;
  private readonly thinkingLevel: ThinkingLevel | undefined;

  constructor(private readonly options: GeminiOptions) {
    this.client = new GoogleGenAI({ apiKey: options.apiKey });
    // Unknown values are ignored rather than sent, so a typo in the env var can't break every request.
    this.thinkingLevel = Object.values(ThinkingLevel).find((level) => level === options.thinkingLevel);
  }

  async *stream({ system, turns, tools, signal }: StreamRequest): AsyncGenerator<ProviderEvent> {
    const parts: Part[] = [];
    const toolCalls: ToolCall[] = [];
    let text = "";
    let finishReason: string | undefined;

    try {
      const stream = await this.client.models.generateContentStream({
        model: this.options.model,
        contents: toContents(turns),
        config: {
          systemInstruction: system,
          tools: tools.length > 0 ? [{ functionDeclarations: toFunctionDeclarations(tools) }] : undefined,
          maxOutputTokens: this.options.maxOutputTokens ?? 1024,
          abortSignal: signal,
          ...(this.thinkingLevel ? { thinkingConfig: { thinkingLevel: this.thinkingLevel } } : {}),
        },
      });

      for await (const chunk of stream) {
        const candidate = chunk.candidates?.[0];
        for (const part of candidate?.content?.parts ?? []) {
          parts.push(part);
          if (part.thought) continue;
          if (part.text) {
            text += part.text;
            yield { type: "text", delta: part.text };
          }
          if (part.functionCall?.name) {
            const call: ToolCall = { id: part.functionCall.id, name: part.functionCall.name, args: part.functionCall.args ?? {} };
            toolCalls.push(call);
            yield { type: "tool-call", call };
          }
        }
        finishReason = candidate?.finishReason ?? finishReason;
      }
    } catch (error) {
      throw toProviderError(error);
    }

    yield {
      type: "finish",
      reason: mapFinishReason(finishReason),
      turn: { role: "assistant", text, toolCalls, native: { role: "model", parts } satisfies Content },
    };
  }
}
