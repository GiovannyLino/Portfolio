import { faq, normalize, type FaqEntry } from "../../src/data/knowledge/index.js";
import type { ChatErrorCode, ChatEvent, ChatMessage } from "../../src/features/chat/protocol.js";
import type { Language } from "../../src/i18n/translations.js";
import { ProviderError, type AssistantTurn, type LLMProvider, type ToolCall, type Turn } from "./llm/index.js";
import { toToolSpec, type ChatTool, type ToolContext } from "./tools.js";

export interface AgentInput {
  provider: LLMProvider;
  system: string;
  history: readonly ChatMessage[];
  tools: readonly ChatTool[];
  context: Omit<ToolContext, "emit">;
  /** Model calls per visitor message. Each one counts against the provider quota. */
  maxSteps?: number;
  signal?: AbortSignal;
}

const DEFAULT_MAX_STEPS = 4;
const MAX_TOOL_CALLS_PER_STEP = 6;
// Offered when the model forgets suggestNextSteps, skipping questions already asked.
const FALLBACK_FAQ_IDS = ["current-role", "featured-projects", "network-automation", "observability", "contact"];

const ERROR_CODES: Record<Exclude<ProviderError["kind"], "aborted">, ChatErrorCode> = {
  quota: "upstream_quota",
  unavailable: "upstream_unavailable",
  invalid_request: "internal",
};

const faqEntries: readonly FaqEntry[] = faq;

export function fallbackSuggestions(lang: Language, history: readonly ChatMessage[]): string[] {
  const asked = new Set(history.filter((m) => m.role === "user").map((m) => normalize(m.content.trim())));
  return FALLBACK_FAQ_IDS.flatMap((id) => {
    const question = faqEntries.find((entry) => entry.id === id)?.question[lang];
    return question && !asked.has(normalize(question)) ? [question] : [];
  }).slice(0, 3);
}

const toTurns = (history: readonly ChatMessage[]): Turn[] =>
  history.map((message) =>
    message.role === "user"
      ? { role: "user", text: message.content }
      : { role: "assistant", text: message.content, toolCalls: [] },
  );

/**
 * Runs one visitor message through the model, executing tool calls between model steps,
 * and yields the events the widget renders. A step that only produced text plus
 * fire-and-forget calls (scroll, highlight, suggestions) ends the turn without another
 * model call, which keeps most answers to a single request against the quota.
 */
export async function* runAgent(input: AgentInput): AsyncGenerator<ChatEvent> {
  const { provider, system, history, tools, signal, maxSteps = DEFAULT_MAX_STEPS } = input;
  const toolsByName = new Map(tools.map((tool) => [tool.name as string, tool]));
  const specs = tools.map(toToolSpec);
  const turns = toTurns(history);
  let wroteText = false;
  let suggested = false;

  for (let step = 0; step < maxSteps; step++) {
    let assistant: AssistantTurn | undefined;
    let stepWroteText = false;

    try {
      for await (const event of provider.stream({ system, turns, tools: specs, signal })) {
        if (event.type === "text" && event.delta) {
          stepWroteText = wroteText = true;
          yield { type: "text", delta: event.delta };
        } else if (event.type === "finish") {
          assistant = event.turn;
        }
      }
    } catch (error) {
      const providerError = error instanceof ProviderError ? error : new ProviderError("unavailable", String(error));
      if (providerError.kind === "aborted") return;
      // Provider messages describe the failure (quota, bad key), never the conversation.
      console.error(`[chat] ${provider.name} ${providerError.kind} (${providerError.status ?? "-"}): ${providerError.message}`);
      yield { type: "error", code: ERROR_CODES[providerError.kind] };
      return;
    }

    if (!assistant) break;
    turns.push(assistant);
    const calls = assistant.toolCalls.slice(0, MAX_TOOL_CALLS_PER_STEP);
    if (calls.length === 0) break;

    const results: { call: ToolCall; output: unknown }[] = [];
    let needsResults = false;

    for (const call of calls) {
      const tool = toolsByName.get(call.name);
      if (!tool) {
        results.push({ call, output: { error: `unknown tool "${call.name}"` } });
        needsResults = true;
        continue;
      }

      const queued: ChatEvent[] = [];
      if (!tool.fireAndForget) yield { type: "tool", name: tool.name, status: "start" };
      const outcome = await tool.run(call.args, { ...input.context, emit: (event) => queued.push(event) });
      yield* queued;
      if (!tool.fireAndForget) yield { type: "tool", name: tool.name, status: "end" };

      if (tool.name === "suggestNextSteps" && outcome.ok) suggested = true;
      if (!tool.fireAndForget || !outcome.ok) needsResults = true;
      results.push({ call, output: outcome.ok ? outcome.output : { error: outcome.error } });
    }

    turns.push({ role: "tool", results });
    if (!needsResults && stepWroteText) break;
  }

  if (!wroteText) {
    yield { type: "error", code: "upstream_unavailable" };
    return;
  }
  if (!suggested) {
    const items = fallbackSuggestions(input.context.lang, history);
    if (items.length > 0) yield { type: "suggestions", items };
  }
  yield { type: "done" };
}
