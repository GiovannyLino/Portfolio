import type { ChatErrorBody, ChatErrorCode } from "../../src/features/chat/protocol.js";

export const jsonError = (status: number, code: ChatErrorCode, retryAfter?: number): Response => {
  const body: ChatErrorBody = { error: retryAfter === undefined ? { code } : { code, retryAfter } };
  const headers: Record<string, string> = { "Cache-Control": "no-store" };
  if (retryAfter !== undefined) headers["Retry-After"] = String(retryAfter);
  return Response.json(body, { status, headers });
};

/**
 * Browsers always send Origin on a cross-origin or POST fetch. The deployment's own origin
 * (production, preview or localhost) is always allowed; requests without Origin are only
 * accepted outside production, so curl works locally.
 */
export function isOriginAllowed(
  origin: string | null,
  requestUrl: string,
  allowedOrigins: readonly string[],
  isProduction: boolean,
): boolean {
  if (!origin) return !isProduction;
  return origin === new URL(requestUrl).origin || allowedOrigins.includes(origin);
}

/** First hop of X-Forwarded-For as set by Vercel's edge; falls back to a shared bucket. */
export const clientIp = (headers: Headers): string =>
  headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim() || "unknown";

/** Rate-limit key: a salted SHA-256 of the IP, so raw addresses are never stored. */
export async function hashedClientKey(headers: Headers, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${clientIp(headers)}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest).slice(0, 16), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
