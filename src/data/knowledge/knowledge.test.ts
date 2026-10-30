import { describe, expect, it } from "vitest";
import {
  LANGUAGES,
  allExperience,
  allProjects,
  allSkills,
  certifications,
  education,
  faq,
  featuredSkills,
  formatPeriod,
  getExperience,
  isLocalized,
  profile,
  skillCategories,
  skillsByCategory,
  whereUsed,
} from "./index";

const everything = { profile, allSkills, skillCategories, allExperience, allProjects, education, certifications, faq };

/** Calls `visit` for every localized object found anywhere in `value`. */
const walkLocalized = (value: unknown, path: string, visit: (localized: Record<string, unknown>, path: string) => void) => {
  if (isLocalized(value)) {
    visit(value as Record<string, unknown>, path);
    return;
  }
  if (Array.isArray(value)) value.forEach((item, i) => walkLocalized(item, `${path}[${i}]`, visit));
  else if (typeof value === "object" && value !== null)
    Object.entries(value).forEach(([key, child]) => walkLocalized(child, `${path}.${key}`, visit));
};

describe("knowledge base", () => {
  it.each([
    ["skills", allSkills],
    ["experience", allExperience],
    ["projects", allProjects],
    ["education", education],
    ["certifications", certifications],
    ["faq", faq],
  ] as const)("has unique ids in %s", (_, items) => {
    const ids = items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("fills every localized field in every language, with matching list lengths", () => {
    const problems: string[] = [];
    let visited = 0;
    walkLocalized(everything, "kb", (localized, path) => {
      visited++;
      const lengths = LANGUAGES.map((lang) => {
        const value = localized[lang];
        if (Array.isArray(value)) return value.length;
        if (typeof value === "string" && value.trim() !== "") return -1;
        problems.push(`${path}.${lang} is empty`);
        return -1;
      });
      if (new Set(lengths).size > 1) problems.push(`${path} has different list lengths per language: ${lengths}`);
    });
    expect(visited).toBeGreaterThan(50);
    expect(problems).toEqual([]);
  });

  it("links projects only to existing positions", () => {
    for (const project of allProjects) {
      if (project.experienceId) expect(getExperience(project.experienceId)).toBeDefined();
    }
  });

  it("backs every featured skill with a position or project", () => {
    for (const skill of featuredSkills) {
      const used = whereUsed(skill.id);
      expect(used.experience.length + used.projects.length, skill.id).toBeGreaterThan(0);
    }
  });

  it("hides catalog-only skills from the Skills grid", () => {
    const listed = skillsByCategory().flatMap((group) => group.skills.map((skill) => skill.id));
    expect(listed).not.toContain("java");
    expect(listed).toContain("ansible");
  });

  it("never exposes a phone number", () => {
    const serialized = JSON.stringify(everything);
    expect(serialized).not.toMatch(/\(?\+?55\)?\s?\d{2}\s?9?\d{4}-?\d{4}/);
    expect(serialized).not.toContain("97365");
  });

  it("formats periods per language", () => {
    expect(formatPeriod({ start: "2025-12", end: "2026-08" }, "en")).toBe("Dec 2025 – Aug 2026");
    expect(formatPeriod({ start: "2026-09", end: null }, "pt")).toBe("Set/2026 – Atual");
    expect(formatPeriod({ start: "2026-09", end: null }, "es")).toBe("Sep 2026 – Actualidad");
  });
});
