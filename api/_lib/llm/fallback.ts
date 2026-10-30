import { ProviderError, type LLMProvider, type ProviderEvent, type StreamRequest } from "./provider.js";

export interface FallbackOptions {
  /** Time the primary has to produce its first event before the fallback takes over. */
  firstEventTimeoutMs?: number;
  /** After a primary failure, requests go straight to the fallback for this long. */
  cooldownMs?: number;
  now?: () => number;
}

/**
 * Tries the primary provider and switches to the fallback when it fails or stalls before
 * answering. Built for the free Gemini tier, where the better models often return 503
 * ("high demand") or hang while the Lite model stays available. Once the primary has
 * started answering, the turn stays with it.
 */
export class FallbackProvider implements LLMProvider {
  readonly name: string;
  private skipPrimaryUntil = 0;

  constructor(
    private readonly primary: LLMProvider,
    private readonly fallback: LLMProvider,
    private readonly options: FallbackOptions = {},
  ) {
    this.name = `${primary.name} → ${fallback.name}`;
  }

  async *stream(request: StreamRequest): AsyncGenerator<ProviderEvent> {
    const now = this.options.now ?? Date.now;
    if (now() < this.skipPrimaryUntil) {
      yield* this.fallback.stream(request);
      return;
    }

    const attempt = new AbortController();
    const signal = request.signal ? AbortSignal.any([request.signal, attempt.signal]) : attempt.signal;
    const timer = setTimeout(
      () => attempt.abort(new ProviderError("unavailable", "no response in time")),
      this.options.firstEventTimeoutMs ?? 8000,
    );
    const events = this.primary.stream({ ...request, signal })[Symbol.asyncIterator]();

    let first: IteratorResult<ProviderEvent>;
    try {
      first = await events.next();
    } catch (error) {
      // The visitor left or the whole turn ran out of time: falling back would not help.
      if (request.signal?.aborted) throw error;
      this.skipPrimaryUntil = now() + (this.options.cooldownMs ?? 60_000);
      const reason = attempt.signal.aborted ? "timed out" : error instanceof Error ? error.message : String(error);
      console.warn(`[chat] ${this.primary.name} failed (${reason.slice(0, 120)}); using ${this.fallback.name}`);
      yield* this.fallback.stream(request);
      return;
    } finally {
      clearTimeout(timer);
    }

    if (first.done) return;
    yield first.value;
    for (let next = await events.next(); !next.done; next = await events.next()) yield next.value;
  }
}
