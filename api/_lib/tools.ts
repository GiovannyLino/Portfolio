import { z } from "zod/v4";
import {
  getExperience,
  getProject,
  getSkill,
  localize,
  projects,
  searchPortfolio,
  type ProjectId,
} from "../../src/data/knowledge/index.js";
import type { ChatEvent, ToolName } from "../../src/features/chat/protocol.js";
import type { Language } from "../../src/i18n/translations.js";
import { SECTION_IDS } from "../../src/lib/sections.js";
import type { ToolSpec } from "./llm/index.js";
import type { WebSearch } from "./web-search.js";

export interface ToolContext {
  lang: Language;
  /** Events for the widget (UI actions, cards, suggestions), flushed in call order. */
  emit: (event: ChatEvent) => void;
  webSearch?: WebSearch;
  signal?: AbortSignal;
}

export type ToolOutcome = { ok: true; output: unknown } | { ok: false; error: string };

export interface ChatTool {
  name: ToolName;
  description: string;
  /** Only drives the page or the widget: the model does not need the result to keep answering. */
  fireAndForget: boolean;
  parameters: Record<string, unknown>;
  run(args: unknown, context: ToolContext): Promise<ToolOutcome>;
}

/** Ties a zod schema to the tool: it becomes the JSON Schema sent to the model and validates the arguments. */
function defineTool<S extends z.ZodType>(tool: {
  name: ToolName;
  description: string;
  fireAndForget: boolean;
  input: S;
  execute: (args: z.infer<S>, context: ToolContext) => unknown;
}): ChatTool {
  return {
    name: tool.name,
    description: tool.description,
    fireAndForget: tool.fireAndForget,
    parameters: z.toJSONSchema(tool.input) as Record<string, unknown>,
    async run(args, context) {
      const parsed = tool.input.safeParse(args);
      if (!parsed.success) {
        return { ok: false, error: `invalid arguments: ${parsed.error.issues.map((issue) => issue.message).join("; ")}` };
      }
      try {
        return { ok: true, output: await tool.execute(parsed.data, context) };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "tool failed" };
      }
    },
  };
}

const projectIds = projects.map((project) => project.id) as [ProjectId, ...ProjectId[]];
const OK = { ok: true } as const;
/** A search hit this strong means the query names the skill itself ("where did he use Ansible?"). */
const SKILL_CARD_MIN_SCORE = 3;

const searchPortfolioTool = defineTool({
  name: "searchPortfolio",
  description:
    "Keyword search over Giovanny's portfolio: experience, projects, skills, education, certifications and FAQ. Use it only when the knowledge in your instructions does not clearly answer. Returns matching items with their ids and the page section where they appear.",
  fireAndForget: false,
  input: z.object({
    query: z.string().trim().min(1).max(200).describe("Keywords, e.g. 'ansible netbox' or 'observability'"),
    limit: z.number().int().min(1).max(8).optional(),
  }),
  execute({ query, limit }, { lang, emit }) {
    const hits = searchPortfolio(query, lang, limit ?? 5);
    const [top] = hits;
    if (top?.kind === "skill" && top.score >= SKILL_CARD_MIN_SCORE) emit({ type: "card", card: { kind: "skill", id: top.id } });
    return { results: hits.map(({ kind, id, title, snippet, section }) => ({ kind, id, title, snippet, section })) };
  },
});

const getProjectDetailsTool = defineTool({
  name: "getProjectDetails",
  description:
    "Get the full details of one project, show its card in the chat and highlight it on the page. Use it when the visitor asks about a specific project.",
  fireAndForget: false,
  input: z.object({ projectId: z.enum(projectIds) }),
  execute({ projectId }, { lang, emit }) {
    const project = getProject(projectId);
    if (!project) throw new Error(`unknown project ${projectId}`);
    emit({ type: "card", card: { kind: "project", id: project.id } });
    // Done here rather than asked of the model, which often skipped the separate highlight call.
    emit({ type: "ui", action: { type: "highlightProject", projectId: project.id } });
    const job = project.experienceId ? getExperience(project.experienceId) : undefined;
    return {
      id: project.id,
      title: localize(project.title, lang),
      origin: project.origin,
      builtDuring: job ? `${job.role[lang]} @ ${job.company}` : undefined,
      summary: project.summary[lang],
      problem: project.problem?.[lang],
      solution: project.solution?.[lang],
      highlights: project.highlights?.[lang],
      stack: project.stack.map((id) => getSkill(id)).flatMap((skill) => (skill ? [localize(skill.name, lang)] : [])),
      links: project.links.repo || project.links.demo ? project.links : "internal project: no public code or demo",
    };
  },
});

const navigateToSectionTool = defineTool({
  name: "navigateToSection",
  description: "Scroll the page to a section so the visitor sees what your answer talks about. Use at most once per answer.",
  fireAndForget: true,
  input: z.object({ section: z.enum(SECTION_IDS) }),
  execute({ section }, { emit }) {
    emit({ type: "ui", action: { type: "navigate", section } });
    return OK;
  },
});

const highlightProjectTool = defineTool({
  name: "highlightProject",
  description: "Scroll to a project card on the page and highlight it. Prefer it over navigateToSection when one project is the topic.",
  fireAndForget: true,
  input: z.object({ projectId: z.enum(projectIds) }),
  execute({ projectId }, { emit }) {
    emit({ type: "ui", action: { type: "highlightProject", projectId } });
    return OK;
  },
});

const suggestNextStepsTool = defineTool({
  name: "suggestNextSteps",
  description:
    "Show 2-3 follow-up questions as quick-reply buttons. Call it exactly once at the end of every answer. Write them in the visitor's language, phrased as the visitor would ask, about topics the portfolio covers.",
  fireAndForget: true,
  input: z.object({ suggestions: z.array(z.string().trim().min(3).max(90)).min(2).max(3) }),
  execute({ suggestions }, { emit }) {
    emit({ type: "suggestions", items: suggestions });
    return OK;
  },
});

const openContactTool = defineTool({
  name: "openContact",
  description:
    "Open the site's contact form pre-filled with a subject and, optionally, a short message draft summarizing what the visitor wants. Use it when the visitor wants to contact or hire Giovanny, or asks something the portfolio doesn't answer.",
  fireAndForget: true,
  input: z.object({
    subject: z.string().trim().min(1).max(120),
    message: z.string().trim().max(500).optional(),
  }),
  execute({ subject, message }, { emit }) {
    emit({ type: "ui", action: message ? { type: "openContact", subject, message } : { type: "openContact", subject } });
    emit({ type: "card", card: { kind: "contact" } });
    return OK;
  },
});

const webSearchTool = defineTool({
  name: "webSearch",
  description:
    "Look up a general explanation of a technology on Wikipedia, e.g. 'Splunk' or 'Infrastructure as code'. Use it only to explain what a technology is, then relate it to Giovanny's experience from the knowledge base. Cite the returned source. Returns an empty result when no reliable article exists.",
  fireAndForget: false,
  input: z.object({ query: z.string().trim().min(2).max(120).describe("Technology name, e.g. 'Ansible'") }),
  async execute({ query }, { lang, emit, webSearch, signal }) {
    if (!webSearch) throw new Error("web search is disabled");
    const result = await webSearch(query, lang, signal);
    if (result.sources.length > 0) emit({ type: "sources", items: result.sources });
    return result.summary ? result : { summary: "", sources: [], note: "no reliable source found" };
  },
});

export function buildTools({ webSearchEnabled }: { webSearchEnabled: boolean }): ChatTool[] {
  const tools = [
    searchPortfolioTool,
    getProjectDetailsTool,
    navigateToSectionTool,
    highlightProjectTool,
    suggestNextStepsTool,
    openContactTool,
  ];
  return webSearchEnabled ? [...tools, webSearchTool] : tools;
}

export const toToolSpec = ({ name, description, parameters }: ChatTool): ToolSpec => ({ name, description, parameters });
