// Plain-text rendering of the knowledge base for the assistant's system prompt. Ids are
// kept next to each item so the model can pass them to tools (getProjectDetails, ...).
import { certifications, education } from "./education.js";
import { profile } from "./profile.js";
import { allExperience, allProjects, getExperience, getSkill, skillsByCategory } from "./queries.js";
import type { Language, RichText } from "./types.js";
import { formatPeriod, localize } from "./utils.js";

const plain = (paragraph: RichText): string =>
  paragraph.map((segment) => (typeof segment === "string" ? segment : segment.text)).join("");

const skillNames = (ids: readonly string[], lang: Language): string =>
  ids
    .map((id) => getSkill(id))
    .filter((skill) => skill !== undefined)
    .map((skill) => localize(skill.name, lang))
    .join(", ");

export function serializeKnowledge(lang: Language, currentYear = new Date().getFullYear()): string {
  const lines: string[] = [];
  const push = (...items: string[]) => lines.push(...items);

  push(
    "# Profile",
    `Name: ${profile.fullName} (goes by ${profile.name})`,
    `Headline: ${profile.headline[lang]}`,
    `Location: ${profile.location[lang]}`,
    `Summary: ${profile.about[lang].map(plain).join(" ")}`,
    `Career goal: ${profile.careerGoal[lang]}`,
    `Availability: ${profile.availability[lang]}`,
    `Spoken languages: ${profile.languages.map((l) => `${l.name[lang]} (${l.level[lang]})`).join(", ")}`,
    `Public contact: email ${profile.links.email} · LinkedIn ${profile.links.linkedin} · GitHub ${profile.links.github} · résumé PDF available on the site`,
    "",
    "# Experience (most recent first)",
  );
  for (const job of allExperience) {
    push(
      `## [${job.id}] ${job.role[lang]} @ ${job.company} — ${formatPeriod(job.period, lang)}, ${job.location[lang]}`,
      ...job.highlights[lang].map((highlight) => `- ${highlight}`),
      `Technologies: ${skillNames(job.skills, lang)}`,
      "",
    );
  }

  push("# Projects (featured first)");
  for (const project of allProjects) {
    const tags = [
      project.featured ? "featured" : "other",
      project.origin === "work" ? "built at work" : "personal/academic",
    ];
    const job = project.experienceId ? getExperience(project.experienceId) : undefined;
    if (job) tags.push(`during: ${job.role[lang]}`);
    const { repo, demo } = project.links;
    const links = [repo && `code ${repo}`, demo && `demo ${demo}`].filter(Boolean).join(" · ");

    push(`## [${project.id}] ${localize(project.title, lang)} (${tags.join("; ")})`, `Summary: ${project.summary[lang]}`);
    if (project.problem) push(`Problem: ${project.problem[lang]}`);
    if (project.solution) push(`Solution: ${project.solution[lang]}`);
    if (project.highlights) push(`Highlights: ${project.highlights[lang].join("; ")}`);
    push(
      `Stack: ${skillNames(project.stack, lang)}`,
      `Links: ${links || "none — internal project, no public code or demo"}`,
      "",
    );
  }

  push("# Skills by category");
  for (const { category, skills } of skillsByCategory()) {
    const names = skills.map((skill) => {
      const name = localize(skill.name, lang);
      return skill.detail ? `${name} (${localize(skill.detail, lang)})` : name;
    });
    push(`- ${category.name[lang]}: ${names.join(", ")}`);
  }

  push("", "# Education");
  for (const item of education) {
    const status = item.period.end > currentYear ? `in progress, expected ${item.period.end}` : `completed ${item.period.end}`;
    push(`- ${item.degree[lang]} — ${item.institution} (${item.period.start}–${item.period.end}, ${status})`);
  }

  push("", "# Certifications");
  for (const cert of certifications) push(`- ${cert.name} — ${cert.issuer} (${cert.year})`);

  return lines.join("\n");
}
