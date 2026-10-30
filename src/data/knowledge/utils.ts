import type { Language, Localized, MonthPeriod, Text, YearMonth } from "./types.js";

export const LANGUAGES: readonly Language[] = ["en", "pt", "es"];

export const localize = (text: Text, lang: Language): string =>
  typeof text === "string" ? text : text[lang];

// Fixed tables instead of Intl so the page and the serverless function print the same text.
const MONTHS: Localized<readonly string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  pt: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
};

const PRESENT: Localized = { en: "Present", pt: "Atual", es: "Actualidad" };

export const formatYearMonth = (value: YearMonth, lang: Language): string => {
  const [year, month] = value.split("-");
  const name = MONTHS[lang][Number(month) - 1];
  return lang === "pt" ? `${name}/${year}` : `${name} ${year}`;
};

export const formatPeriod = ({ start, end }: MonthPeriod, lang: Language): string =>
  `${formatYearMonth(start, lang)} – ${end ? formatYearMonth(end, lang) : PRESENT[lang]}`;

export const isLocalized = (value: unknown): value is Localized<unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  LANGUAGES.every((lang) => lang in value) &&
  Object.keys(value).length === LANGUAGES.length;

/** Lowercase and strip diacritics so "Observação" matches "observacao". */
export const normalize = (text: string): string =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

// Function words and interrogatives in EN/PT/ES, plus Giovanny's own name, which every
// document is about. "who"/"quem" stay out: they route to the "who is Giovanny" FAQ.
const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "by", "did", "do", "does", "for", "from", "has", "have", "he", "his",
  "how", "in", "is", "it", "of", "on", "or", "the", "to", "use", "used", "uses", "was", "what", "when",
  "where", "which", "with", "about",
  "ao", "com", "como", "da", "das", "de", "do", "dos", "ele", "em", "na", "nas", "no", "nos", "onde", "os",
  "ou", "para", "pela", "pelo", "por", "qual", "quais", "quando", "que", "sao", "se", "sobre", "um", "uma",
  "usa", "usou", "uso",
  "al", "con", "cuando", "del", "donde", "el", "en", "es", "la", "las", "lo", "los", "su", "sus", "una", "y",
  "giovanny", "lino", "gio",
]);

export const tokenize = (text: string): string[] =>
  normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
