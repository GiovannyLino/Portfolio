import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { ServerConfig } from "./config.js";

export interface LimitResult {
  success: boolean;
  /** Unix epoch in milliseconds when the window frees up. */
  reset: number;
}

export interface RateLimiter {
  limit(key: string): Promise<LimitResult>;
}

/**
 * Sliding-window log kept in process memory. Good for development and tests; on Vercel each
 * instance has its own memory, so production should use Upstash.
 */
export class MemoryRateLimiter implements RateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  async limit(key: string): Promise<LimitResult> {
    const now = this.now();
    const recent = (this.hits.get(key) ?? []).filter((time) => now - time < this.windowMs);
    const success = recent.length < this.max;
    if (success) recent.push(now);
    this.hits.set(key, recent);
    return { success, reset: (recent[0] ?? now) + this.windowMs };
  }
}

/** Passes only when every limiter passes; reports the latest reset among the ones that failed. */
class CombinedRateLimiter implements RateLimiter {
  constructor(private readonly limiters: readonly { limiter: RateLimiter; key: (key: string) => string }[]) {}

  async limit(key: string): Promise<LimitResult> {
    const results = await Promise.all(this.limiters.map(({ limiter, key: toKey }) => limiter.limit(toKey(key))));
    const failed = results.filter((result) => !result.success);
    if (failed.length === 0) return { success: true, reset: Math.max(...results.map((r) => r.reset)) };
    return { success: false, reset: Math.max(...failed.map((r) => r.reset)) };
  }
}

const DAY_SECONDS = 24 * 60 * 60;

export function createRateLimiter({ rateLimit }: ServerConfig): RateLimiter {
  const { perIp, dailyTotal, upstash } = rateLimit;

  const build = (requests: number, windowSeconds: number, prefix: string): RateLimiter => {
    if (!upstash) return new MemoryRateLimiter(requests, windowSeconds * 1000);
    const limiter = new Ratelimit({
      redis: new Redis({ url: upstash.url, token: upstash.token }),
      limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
      prefix,
    });
    return { limit: async (key) => limiter.limit(key) };
  };

  const limiters = [{ limiter: build(perIp.requests, perIp.windowSeconds, "gioai:ip"), key: (key: string) => key }];
  if (dailyTotal > 0) {
    limiters.push({ limiter: build(dailyTotal, DAY_SECONDS, "gioai:day"), key: () => "all" });
  }
  return new CombinedRateLimiter(limiters);
}
