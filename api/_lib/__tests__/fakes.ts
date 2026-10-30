import type { ChatEvent } from "../../../src/features/chat/protocol.js";
import type { LLMProvider, ProviderEvent, StreamRequest, ToolCall } from "../llm/index.js";

export type ScriptedStep = { text?: string[]; calls?: ToolCall[] } | Error;

/** Plays back one scripted model response per call and records what it was sent. */
export class ScriptedProvider implements LLMProvider {
  readonly name = "scripted";
  readonly requests: StreamRequest[] = [];

  constructor(private readonly steps: ScriptedStep[]) {}

  async *stream(request: StreamRequest): AsyncGenerator<ProviderEvent> {
    // The agent keeps appending to the same turns array; snapshot what this call saw.
    this.requests.push({ ...request, turns: [...request.turns] });
    const step = this.steps[this.requests.length - 1];
    if (!step) throw new Error(`no scripted step #${this.requests.length}`);
    if (step instanceof Error) throw step;

    for (const delta of step.text ?? []) yield { type: "text", delta };
    for (const call of step.calls ?? []) yield { type: "tool-call", call };
    yield {
      type: "finish",
      reason: "stop",
      turn: { role: "assistant", text: (step.text ?? []).join(""), toolCalls: step.calls ?? [] },
    };
  }
}

/** Never answers: waits until the request is aborted, like a stalled upstream. */
export class HangingProvider implements LLMProvider {
  readonly name = "hanging";

  stream({ signal }: StreamRequest): AsyncIterable<ProviderEvent> {
    const next = () =>
      new Promise<IteratorResult<ProviderEvent>>((_, reject) => {
        signal?.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })));
      });
    return { [Symbol.asyncIterator]: () => ({ next }) };
  }
}

export async function collect<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const items: T[] = [];
  for await (const item of iterable) items.push(item);
  return items;
}

/** Parses an SSE body produced by encodeEvent. */
export const parseSse = (body: string): ChatEvent[] =>
  body
    .split("\n\n")
    .filter((block) => block.startsWith("data: "))
    .map((block) => JSON.parse(block.slice("data: ".length)) as ChatEvent);
