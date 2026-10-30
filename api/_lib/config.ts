// Server configuration, read from environment variables (Vercel project settings or
// .env.local in development). Secrets never leave this process.

export interface ServerConfig {
  llm: { provider: "gemini"; apiKey: string | undefined; model: string; thinkingLevel: string | undefined };
  /** Extra origins allowed to call the API besides the deployment's own origin. */
  allowedOrigins: string[];
  webSearchEnabled: boolean;
  rateLimit: {
    perIp: { requests: number; windowSeconds: number };
    /** Global cap per rolling 24h to stay inside the LLM free quota; 0 disables it. */
    dailyTotal: number;
    upstash: { url: string; token: string } | null;
  };
  /** Salt for hashing visitor IPs before they are used as rate-limit keys. */
  ipHashSalt: string;
  isProduction: boolean;
}

type Env = Record<string, string | undefined>;

const intFrom = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const listFrom = (value: string | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim().replace(/\/+$/, ""))
    .filter(Boolean);

export function readConfig(env: Env = process.env): ServerConfig {
  // Vercel's Upstash integration injects KV_REST_API_*; a manual setup uses UPSTASH_REDIS_REST_*.
  const upstashUrl = env.UPSTASH_REDIS_REST_URL ?? env.KV_REST_API_URL;
  const upstashToken = env.UPSTASH_REDIS_REST_TOKEN ?? env.KV_REST_API_TOKEN;

  return {
    llm: {
      provider: "gemini",
      apiKey: env.GEMINI_API_KEY,
      model: env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      thinkingLevel: env.GEMINI_THINKING_LEVEL || undefined,
    },
    allowedOrigins: listFrom(env.ALLOWED_ORIGINS),
    webSearchEnabled: env.WEB_SEARCH_ENABLED === "true",
    rateLimit: {
      perIp: {
        requests: intFrom(env.RATE_LIMIT_REQUESTS, 20),
        windowSeconds: intFrom(env.RATE_LIMIT_WINDOW_SECONDS, 600),
      },
      dailyTotal: intFrom(env.CHAT_DAILY_LIMIT, 0),
      upstash: upstashUrl && upstashToken ? { url: upstashUrl, token: upstashToken } : null,
    },
    ipHashSalt: env.IP_HASH_SALT ?? "",
    isProduction: env.VERCEL_ENV === "production",
  };
}
