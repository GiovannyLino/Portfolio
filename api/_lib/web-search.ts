// General explanations of technologies for the webSearch tool, from Wikipedia: free, no
// API key, and every answer comes with a citable URL. Niche tools (NetBox, Cisco NSO,
// Containerlab) have no article, so the matcher prefers returning nothing over a wrong page.
import type { Language } from "../../src/i18n/translations.js";
import type { Source } from "../../src/features/chat/protocol.js";

export interface WebSearchResult {
  summary: string;
  sources: Source[];
}

export type WebSearch = (query: string, lang: Language, signal?: AbortSignal) => Promise<WebSearchResult>;

type Fetch = typeof fetch;

const USER_AGENT = "GioAI-portfolio-assistant/1.0 (https://github.com/GiovannyLino/Portfolio)";
const TIMEOUT_MS = 5000;
const MAX_SUMMARY_CHARS = 1200;
const TECH_QUALIFIER = /\((software|company|computing|programming language|protocol)\)/i;

const words = (text: string): string[] =>
  text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

/**
 * Picks the search result whose title contains every word of the query, preferring
 * titles qualified as software/company ("Ansible (software)" over the sci-fi "Ansible").
 */
export function pickTitle(query: string, titles: readonly string[]): string | undefined {
  const queryWords = words(query);
  if (queryWords.length === 0) return undefined;
  const matches = titles.filter((title) => {
    const titleWords = words(title);
    return queryWords.every((word) => titleWords.includes(word));
  });
  return matches.find((title) => TECH_QUALIFIER.test(title)) ?? matches[0];
}

async function fetchJson(fetchImpl: Fetch, url: string, signal?: AbortSignal): Promise<unknown> {
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  const response = await fetchImpl(url, {
    headers: { "Api-User-Agent": USER_AGENT, "User-Agent": USER_AGENT, Accept: "application/json" },
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  return response.ok ? response.json() : null;
}

interface SearchResponse {
  query?: { search?: { title: string }[] };
}

interface SummaryResponse {
  type?: string;
  title?: string;
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
}

async function lookup(fetchImpl: Fetch, wiki: string, query: string, signal?: AbortSignal): Promise<WebSearchResult | null> {
  const base = `https://${wiki}.wikipedia.org`;
  const params = new URLSearchParams({ action: "query", list: "search", srsearch: query, srlimit: "5", srprop: "", format: "json" });
  const search = (await fetchJson(fetchImpl, `${base}/w/api.php?${params}`, signal)) as SearchResponse | null;
  const title = pickTitle(query, search?.query?.search?.map((result) => result.title) ?? []);
  if (!title) return null;

  const key = encodeURIComponent(title.replace(/ /g, "_"));
  const summary = (await fetchJson(fetchImpl, `${base}/api/rest_v1/page/summary/${key}`, signal)) as SummaryResponse | null;
  if (!summary?.extract || summary.type === "disambiguation") return null;

  return {
    summary: summary.extract.slice(0, MAX_SUMMARY_CHARS),
    sources: [{ title: `${summary.title ?? title} — Wikipedia`, url: summary.content_urls?.desktop?.page ?? `${base}/wiki/${key}` }],
  };
}

/** Searches the visitor's Wikipedia first, then English, which covers far more technologies. */
export const createWikipediaSearch =
  (fetchImpl: Fetch = fetch): WebSearch =>
  async (query, lang, signal) => {
    for (const wiki of lang === "en" ? ["en"] : [lang, "en"]) {
      const result = await lookup(fetchImpl, wiki, query, signal);
      if (result) return result;
    }
    return { summary: "", sources: [] };
  };
