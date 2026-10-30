// Keyword search over the knowledge base, used by the chat's searchPortfolio tool and by
// the offline fallback. Same signature a vector retriever (e.g. pgvector) would expose.
import { certifications, education } from "./education.js";
import { faq } from "./faq.js";
import { profile } from "./profile.js";
import { allExperience, allProjects, allSkills, getSkill, whereUsed } from "./queries.js";
import { skillCategories } from "./skills.js";
import type { FaqEntry, Language, Localized, SectionId } from "./types.js";
import { localize, tokenize } from "./utils.js";

export type SearchHitKind = "profile" | "experience" | "project" | "skill" | "education" | "certification" | "faq";

export interface SearchHit {
  readonly kind: SearchHitKind;
  readonly id: string;
  readonly title: string;
  readonly snippet: string;
  readonly section: SectionId;
  readonly score: number;
}

interface IndexedField {
  readonly tokens: ReadonlySet<string>;
  readonly weight: number;
}

interface IndexedDoc {
  readonly kind: SearchHitKind;
  readonly id: string;
  readonly title: string;
  readonly section: SectionId;
  /** Snippet candidates: the one sharing the most terms with the query is returned. */
  readonly passages: readonly string[];
  readonly fields: readonly IndexedField[];
}

const WEIGHT = { title: 3, keywords: 2, body: 1 } as const;
/** Added when the query covers the whole title, so "ansible" ranks the Ansible skill above
 *  projects that merely have Ansible in a longer title. */
const FULL_TITLE_BONUS = 1;
const PREFIX_MIN_LENGTH = 4;
const USED_IN: Localized = { en: "Used in", pt: "Usado em", es: "Usado en" };

const field = (text: string, weight: number): IndexedField => ({ tokens: new Set(tokenize(text)), weight });

/** Names and aliases of the given skills, so a project matches "k8s" or "iac". */
const skillTerms = (ids: readonly string[], lang: Language): string =>
  ids
    .map((id) => getSkill(id))
    .flatMap((skill) => (skill ? [localize(skill.name, lang), ...(skill.aliases ?? [])] : []))
    .join(" ");

function buildIndex(lang: Language): IndexedDoc[] {
  const docs: IndexedDoc[] = [];

  docs.push({
    kind: "profile",
    id: "profile",
    title: `${profile.name} — ${profile.headline[lang]}`,
    section: "about",
    passages: [profile.intro[lang], profile.careerGoal[lang]],
    fields: [
      field(profile.headline[lang], WEIGHT.title),
      field(profile.location[lang], WEIGHT.keywords),
      field(`${profile.intro[lang]} ${profile.careerGoal[lang]}`, WEIGHT.body),
    ],
  });

  for (const job of allExperience) {
    docs.push({
      kind: "experience",
      id: job.id,
      title: `${job.role[lang]} — ${job.company}`,
      section: "experience",
      passages: job.highlights[lang],
      fields: [
        field(`${job.role[lang]} ${job.company}`, WEIGHT.title),
        field(skillTerms(job.skills, lang), WEIGHT.keywords),
        field(job.highlights[lang].join(" "), WEIGHT.body),
      ],
    });
  }

  for (const project of allProjects) {
    const title = localize(project.title, lang);
    const body = [
      project.summary[lang],
      project.problem?.[lang] ?? "",
      project.solution?.[lang] ?? "",
      ...(project.highlights?.[lang] ?? []),
    ].join(" ");
    docs.push({
      kind: "project",
      id: project.id,
      title,
      section: "projects",
      passages: [project.summary[lang]],
      fields: [field(title, WEIGHT.title), field(skillTerms(project.stack, lang), WEIGHT.keywords), field(body, WEIGHT.body)],
    });
  }

  for (const skill of allSkills) {
    const name = localize(skill.name, lang);
    const detail = skill.detail ? localize(skill.detail, lang) : "";
    const category = skillCategories.find((c) => c.id === skill.category)?.name[lang] ?? "";
    const used = whereUsed(skill.id);
    const usedTitles = [
      ...used.experience.map((job) => `${job.role[lang]} (${job.company})`),
      ...used.projects.map((project) => localize(project.title, lang)),
    ];
    const label = detail ? `${name} (${detail})` : name;
    docs.push({
      kind: "skill",
      id: skill.id,
      title: name,
      section: "skills",
      passages: [usedTitles.length > 0 ? `${label} — ${USED_IN[lang]}: ${usedTitles.join("; ")}` : label],
      fields: [
        field(name, WEIGHT.title),
        field(`${(skill.aliases ?? []).join(" ")} ${detail} ${category}`, WEIGHT.keywords),
        field(usedTitles.join(" "), WEIGHT.body),
      ],
    });
  }

  for (const item of education) {
    docs.push({
      kind: "education",
      id: item.id,
      title: item.degree[lang],
      section: "education",
      passages: [`${item.degree[lang]} — ${item.institution} (${item.period.start}–${item.period.end})`],
      fields: [field(item.degree[lang], WEIGHT.title), field(`${item.institution} ${item.location}`, WEIGHT.keywords)],
    });
  }

  for (const cert of certifications) {
    docs.push({
      kind: "certification",
      id: cert.id,
      title: cert.name,
      section: "education",
      passages: [`${cert.name} — ${cert.issuer} (${cert.year})`],
      fields: [field(cert.name, WEIGHT.title), field(cert.issuer, WEIGHT.keywords)],
    });
  }

  for (const entry of faq as readonly FaqEntry[]) {
    docs.push({
      kind: "faq",
      id: entry.id,
      title: entry.question[lang],
      section: entry.section ?? "about",
      passages: [entry.answer[lang]],
      fields: [
        field(entry.question[lang], WEIGHT.title),
        field(entry.keywords.join(" "), WEIGHT.keywords),
        field(entry.answer[lang], WEIGHT.body),
      ],
    });
  }

  return docs;
}

const indexByLanguage = new Map<Language, IndexedDoc[]>();

const getIndex = (lang: Language): IndexedDoc[] => {
  let index = indexByLanguage.get(lang);
  if (!index) {
    index = buildIndex(lang);
    indexByLanguage.set(lang, index);
  }
  return index;
};

/** 1 for an exact token, 0.5 when one is a prefix of the other ("dashboard" ~ "dashboards"). */
const matchStrength = (term: string, tokens: ReadonlySet<string>): number => {
  if (tokens.has(term)) return 1;
  if (term.length < PREFIX_MIN_LENGTH) return 0;
  for (const token of tokens) {
    if (token.length >= PREFIX_MIN_LENGTH && (token.startsWith(term) || term.startsWith(token))) return 0.5;
  }
  return 0;
};

const scoreDoc = (doc: IndexedDoc, terms: readonly string[]): number => {
  const score = terms.reduce(
    (total, term) => total + Math.max(0, ...doc.fields.map((f) => f.weight * matchStrength(term, f.tokens))),
    0,
  );
  // The title field is always first in `fields`.
  const titleTokens = doc.fields[0]?.tokens;
  const coversTitle = score > 0 && titleTokens !== undefined && titleTokens.size > 0 && [...titleTokens].every((token) => terms.includes(token));
  return coversTitle ? score + FULL_TITLE_BONUS : score;
};

const bestPassage = (passages: readonly string[], terms: readonly string[]): string => {
  let best = passages[0] ?? "";
  let bestHits = -1;
  for (const passage of passages) {
    const tokens = new Set(tokenize(passage));
    const hits = terms.filter((term) => matchStrength(term, tokens) > 0).length;
    if (hits > bestHits) {
      best = passage;
      bestHits = hits;
    }
  }
  return best;
};

export function searchPortfolio(query: string, lang: Language, limit = 5): SearchHit[] {
  const terms = [...new Set(tokenize(query))];
  if (terms.length === 0) return [];

  return getIndex(lang)
    .map((doc) => ({ doc, score: scoreDoc(doc, terms) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ doc, score }) => ({
      kind: doc.kind,
      id: doc.id,
      title: doc.title,
      snippet: bestPassage(doc.passages, terms),
      section: doc.section,
      score,
    }));
}
