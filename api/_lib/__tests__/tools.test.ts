// @vitest-environment node
import { describe, expect, it } from "vitest";
import type { ChatEvent } from "../../../src/features/chat/protocol.js";
import { buildTools, type ChatTool, type ToolContext } from "../tools.js";

const tools = buildTools({ webSearchEnabled: true });
const tool = (name: string): ChatTool => {
  const found = tools.find((candidate) => candidate.name === name);
  if (!found) throw new Error(`missing tool ${name}`);
  return found;
};

const context = (overrides: Partial<ToolContext> = {}) => {
  const events: ChatEvent[] = [];
  return { events, ctx: { lang: "en" as const, emit: (event: ChatEvent) => events.push(event), ...overrides } };
};

describe("chat tools", () => {
  it("offers webSearch only when the flag is on", () => {
    expect(buildTools({ webSearchEnabled: false }).map((t) => t.name)).not.toContain("webSearch");
    expect(tools.map((t) => t.name)).toContain("webSearch");
  });

  it("describes arguments as JSON Schema with the knowledge-base ids as enums", () => {
    const schema = tool("highlightProject").parameters as { properties: { projectId: { enum: string[] } }; required: string[] };
    expect(schema.properties.projectId.enum).toContain("netbox-ansible-pipeline");
    expect(schema.required).toEqual(["projectId"]);
    expect(JSON.stringify(tool("navigateToSection").parameters)).toContain('"contact"');
  });

  it("getProjectDetails returns localized details, flags internal projects and shows a card", async () => {
    const { events, ctx } = context({ lang: "pt" });
    const outcome = await tool("getProjectDetails").run({ projectId: "netbox-ansible-pipeline" }, ctx);

    expect(outcome.ok).toBe(true);
    expect(outcome.ok && outcome.output).toMatchObject({
      title: "Pipeline de Automação de Rede com NetBox e Ansible",
      builtDuring: "Estagiário de Engenharia de Telecomunicações @ Logicalis",
      links: "internal project: no public code or demo",
    });
    expect(events).toEqual([{ type: "card", card: { kind: "project", id: "netbox-ansible-pipeline" } }]);
  });

  it("searchPortfolio shows a skill card when the query names a skill", async () => {
    const { events, ctx } = context();
    const outcome = await tool("searchPortfolio").run({ query: "ansible" }, ctx);

    expect(outcome.ok).toBe(true);
    expect(events).toEqual([{ type: "card", card: { kind: "skill", id: "ansible" } }]);
  });

  it("openContact opens the form and shows the contact card", async () => {
    const { events, ctx } = context();
    await tool("openContact").run({ subject: "Vaga de SRE" }, ctx);
    expect(events).toEqual([
      { type: "ui", action: { type: "openContact", subject: "Vaga de SRE" } },
      { type: "card", card: { kind: "contact" } },
    ]);
  });

  it("rejects arguments that break the schema", async () => {
    const { events, ctx } = context();
    const outcome = await tool("suggestNextSteps").run({ suggestions: ["only one"] }, ctx);
    expect(outcome.ok).toBe(false);
    expect(events).toEqual([]);
  });

  it("webSearch emits its sources", async () => {
    const source = { title: "Splunk — Wikipedia", url: "https://en.wikipedia.org/wiki/Splunk" };
    const { events, ctx } = context({ webSearch: async () => ({ summary: "Splunk is…", sources: [source] }) });
    const outcome = await tool("webSearch").run({ query: "Splunk" }, ctx);

    expect(outcome).toEqual({ ok: true, output: { summary: "Splunk is…", sources: [source] } });
    expect(events).toEqual([{ type: "sources", items: [source] }]);
  });

  it("webSearch reports when nothing reliable was found", async () => {
    const { ctx } = context({ webSearch: async () => ({ summary: "", sources: [] }) });
    const outcome = await tool("webSearch").run({ query: "NetBox" }, ctx);
    expect(outcome.ok && outcome.output).toMatchObject({ note: "no reliable source found" });
  });
});
