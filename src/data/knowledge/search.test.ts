import { describe, expect, it } from "vitest";
import { searchPortfolio } from "./search";

const ids = (query: string, lang: "en" | "pt" | "es" = "en") => searchPortfolio(query, lang).map((hit) => hit.id);

describe("searchPortfolio", () => {
  it("ranks the project whose title matches every term first", () => {
    expect(ids("netbox pipeline")[0]).toBe("netbox-ansible-pipeline");
  });

  it("ranks a skill above projects that mention it in a longer title", () => {
    expect(ids("ansible")[0]).toBe("ansible");
  });

  it("ignores interrogatives like 'onde'", () => {
    expect(ids("onde ele usou splunk", "pt")).not.toContain("education");
  });

  it("matches skill aliases", () => {
    expect(ids("k8s")[0]).toBe("kubernetes");
  });

  it("ignores accents and case", () => {
    expect(ids("OBSERVAÇÃO observabilidade", "pt")).toContain("splunk");
  });

  it("matches plurals through prefixes", () => {
    expect(ids("dashboard")).toContain("dashboards-alerting");
  });

  it("answers in the requested language", () => {
    const [hit] = searchPortfolio("certificaciones", "es");
    expect(hit.id).toBe("certifications");
    expect(hit.snippet).toMatch(/^Tiene:/);
  });

  it("points each hit at a page section", () => {
    const [hit] = searchPortfolio("thousandeyes", "en");
    expect(hit.section).toBe("skills");
  });

  it("picks the highlight that best matches the query as snippet", () => {
    const hit = searchPortfolio("iso 8601 timestamps power bi", "en").find((h) => h.kind === "experience");
    expect(hit?.snippet).toContain("ISO 8601");
  });

  it("returns nothing for empty or stopword-only queries", () => {
    expect(searchPortfolio("", "en")).toEqual([]);
    expect(searchPortfolio("o que é o", "pt")).toEqual([]);
  });

  it("respects the limit", () => {
    expect(searchPortfolio("ansible", "en", 2)).toHaveLength(2);
  });
});
