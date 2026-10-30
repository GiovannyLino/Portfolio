// @vitest-environment node
import { describe, expect, it } from "vitest";
import type { ChatMessage } from "../../../src/features/chat/protocol.js";
import { fallbackSuggestions, runAgent, wantsContact } from "../agent.js";
import { ProviderError } from "../llm/index.js";
import { buildTools } from "../tools.js";
import { collect, ScriptedProvider, type ScriptedStep } from "./fakes.js";

const history: ChatMessage[] = [{ role: "user", content: "Fale do projeto com NetBox" }];

const run = (steps: ScriptedStep[], maxSteps?: number) => {
  const provider = new ScriptedProvider(steps);
  const events = collect(
    runAgent({ provider, system: "system", history, tools: buildTools({ webSearchEnabled: false }), context: { lang: "pt" }, maxSteps }),
  );
  return { provider, events };
};

const suggest = { name: "suggestNextSteps", args: { suggestions: ["Qual a stack?", "Tem código público?"] } };

describe("runAgent", () => {
  it("streams text and falls back to FAQ suggestions when the model skips them", async () => {
    const { provider, events } = run([{ text: ["Olá", "!"] }]);
    const result = await events;

    expect(result.slice(0, 2)).toEqual([
      { type: "text", delta: "Olá" },
      { type: "text", delta: "!" },
    ]);
    expect(result[2]).toMatchObject({ type: "suggestions" });
    expect(result[2].type === "suggestions" && result[2].items).toHaveLength(3);
    expect(result.at(-1)).toEqual({ type: "done" });
    expect(provider.requests).toHaveLength(1);
  });

  it("ends after a single model call when text comes with UI-only tool calls", async () => {
    const { provider, events } = run([
      {
        text: ["É o pipeline de automação de rede."],
        calls: [{ name: "highlightProject", args: { projectId: "netbox-ansible-pipeline" } }, suggest],
      },
    ]);
    const result = await events;

    expect(provider.requests).toHaveLength(1);
    expect(result).toContainEqual({ type: "ui", action: { type: "highlightProject", projectId: "netbox-ansible-pipeline" } });
    expect(result.filter((event) => event.type === "suggestions")).toEqual([
      { type: "suggestions", items: ["Qual a stack?", "Tem código público?"] },
    ]);
    expect(result.some((event) => event.type === "tool")).toBe(false);
  });

  it("feeds data-tool results back to the model and reports tool progress", async () => {
    const { provider, events } = run([{ calls: [{ name: "searchPortfolio", args: { query: "netbox pipeline" } }] }, { text: ["Achei."] }]);
    const result = await events;

    expect(result.slice(0, 3)).toEqual([
      { type: "tool", name: "searchPortfolio", status: "start" },
      { type: "tool", name: "searchPortfolio", status: "end" },
      { type: "text", delta: "Achei." },
    ]);
    const toolTurn = provider.requests[1].turns.at(-1);
    expect(toolTurn?.role).toBe("tool");
    expect(JSON.stringify(toolTurn)).toContain("netbox-ansible-pipeline");
  });

  it("asks the model again when a UI-only step wrote no text", async () => {
    const { provider, events } = run([{ calls: [{ name: "navigateToSection", args: { section: "projects" } }] }, { text: ["Pronto."] }]);
    const result = await events;

    expect(provider.requests).toHaveLength(2);
    expect(result[0]).toEqual({ type: "ui", action: { type: "navigate", section: "projects" } });
  });

  it("returns invalid arguments to the model instead of acting on them", async () => {
    const { provider, events } = run([
      { text: ["Veja."], calls: [{ name: "highlightProject", args: { projectId: "does-not-exist" } }] },
      { text: [" Corrigido."] },
    ]);
    const result = await events;

    expect(result.some((event) => event.type === "ui")).toBe(false);
    expect(provider.requests).toHaveLength(2);
    expect(JSON.stringify(provider.requests[1].turns.at(-1))).toContain("invalid arguments");
  });

  it("finishes normally when a later step fails after text reached the visitor", async () => {
    const { events } = run([
      { text: ["Resposta completa."], calls: [{ name: "searchPortfolio", args: { query: "netbox" } }] },
      new ProviderError("unavailable", "503 high demand"),
    ]);
    const result = await events;

    expect(result.some((event) => event.type === "error")).toBe(false);
    expect(result[0]).toEqual({ type: "text", delta: "Resposta completa." });
    expect(result.at(-1)).toEqual({ type: "done" });
  });

  it("still reports an error when the answer breaks off mid-text", async () => {
    const provider = {
      name: "flaky",
      async *stream() {
        yield { type: "text" as const, delta: "Você pode falar com ele pelo LinkedIn em [linked" };
        throw new ProviderError("unavailable", "turn timed out");
      },
    };
    const result = await collect(
      runAgent({ provider, system: "system", history, tools: buildTools({ webSearchEnabled: false }), context: { lang: "pt" } }),
    );
    expect(result.at(-1)).toEqual({ type: "error", code: "upstream_unavailable" });
  });

  it("maps a provider quota error to upstream_quota", async () => {
    const { events } = run([new ProviderError("quota", "429")]);
    expect(await events).toEqual([{ type: "error", code: "upstream_quota" }]);
  });

  it("stops silently when the request is aborted", async () => {
    const { events } = run([new ProviderError("aborted", "client left")]);
    expect(await events).toEqual([]);
  });

  it("reports an error when the model never writes text within the step budget", async () => {
    const navigate = { name: "navigateToSection", args: { section: "about" } };
    const { provider, events } = run([{ calls: [navigate] }, { calls: [navigate] }], 2);
    const result = await events;

    expect(provider.requests).toHaveLength(2);
    expect(result.at(-1)).toEqual({ type: "error", code: "upstream_unavailable" });
  });
});

describe("contact intent", () => {
  it.each([
    ["Quero conversar com ele sobre uma vaga de DevOps", true],
    ["Como entro em contato com ele?", true],
    ["We'd like to hire him for an SRE role", true],
    ["Me gustaría hablar con él", true],
    ["Ele está aberto a novas oportunidades?", false],
    ["Qual o contato dele?", false],
    ["What does he do at Logicalis?", false],
  ])("%s → %s", (message, expected) => {
    expect(wantsContact(message)).toBe(expected);
  });

  it("opens the contact form when the visitor asks for it and the model did not", async () => {
    const provider = new ScriptedProvider([{ text: ["Abri o formulário de contato."] }]);
    const message = "Quero conversar com ele sobre uma vaga";
    const result = await collect(
      runAgent({
        provider,
        system: "system",
        history: [{ role: "user", content: message }],
        tools: buildTools({ webSearchEnabled: false }),
        context: { lang: "pt" },
      }),
    );

    expect(result).toContainEqual({
      type: "ui",
      action: { type: "openContact", subject: "Contato pelo portfólio", message },
    });
    expect(result).toContainEqual({ type: "card", card: { kind: "contact" } });
  });

  it("does not open it twice when the model already did", async () => {
    const provider = new ScriptedProvider([{ text: ["Claro."], calls: [{ name: "openContact", args: { subject: "Vaga" } }] }]);
    const result = await collect(
      runAgent({
        provider,
        system: "system",
        history: [{ role: "user", content: "Quero conversar com ele" }],
        tools: buildTools({ webSearchEnabled: false }),
        context: { lang: "pt" },
      }),
    );
    expect(result.filter((event) => event.type === "ui")).toHaveLength(1);
  });
});

describe("fallbackSuggestions", () => {
  it("skips questions the visitor already asked", () => {
    const asked: ChatMessage[] = [{ role: "user", content: "o que ele faz na logicalis?" }];
    const items = fallbackSuggestions("pt", asked);
    expect(items).toHaveLength(3);
    expect(items).not.toContain("O que ele faz na Logicalis?");
  });
});
