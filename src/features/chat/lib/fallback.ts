import { faq, searchPortfolio, type FaqEntry, type Language } from "@/data/knowledge";

const faqEntries: readonly FaqEntry[] = faq;

/**
 * Best offline answer for a question when the API is unavailable or rate-limited:
 * the closest curated FAQ answer, else the best matching snippet of the portfolio.
 */
export function localAnswer(question: string, lang: Language): string | undefined {
  const hits = searchPortfolio(question, lang, 8);
  const faqHit = hits.find((hit) => hit.kind === "faq");
  if (faqHit) return faqEntries.find((entry) => entry.id === faqHit.id)?.answer[lang];
  return hits[0]?.snippet;
}
