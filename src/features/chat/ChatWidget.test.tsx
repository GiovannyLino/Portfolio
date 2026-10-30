import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import type { ChatEvent, ChatRequest } from "./protocol";
import ChatWidget from "./ChatWidget";

const script: { events: ChatEvent[]; requests: ChatRequest[] } = { events: [], requests: [] };

vi.mock("./lib/chat-client", () => ({
  streamChat: async function* (request: ChatRequest) {
    script.requests.push(request);
    for (const event of script.events) yield event;
  },
}));

const renderWidget = () =>
  render(
    <LanguageProvider>
      <ChatWidget open onClose={() => {}} section="projects" pendingQuestion={null} onPendingQuestionSent={() => {}} />
    </LanguageProvider>,
  );

beforeEach(() => {
  script.events = [];
  script.requests = [];
  localStorage.clear();
});

describe("ChatWidget", () => {
  it("starts with a greeting and starter questions", () => {
    renderWidget();
    expect(screen.getByRole("dialog", { name: /Gio\.AI/ })).toBeInTheDocument();
    expect(screen.getByText(/this portfolio's assistant/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "What does he do at Logicalis?" })).toBeInTheDocument();
  });

  it("streams an answer with markdown, a project card and quick replies", async () => {
    script.events = [
      { type: "text", delta: "He built the " },
      { type: "text", delta: "**NetBox pipeline**." },
      { type: "card", card: { kind: "project", id: "netbox-ansible-pipeline" } },
      { type: "suggestions", items: ["Is the code public?", "What else did he automate?"] },
      { type: "done" },
    ];
    renderWidget();

    fireEvent.click(screen.getByRole("button", { name: "Show me his automation projects" }));

    expect(await screen.findByText("NetBox pipeline", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Network Automation Pipeline with NetBox and Ansible" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Is the code public?" })).toBeInTheDocument();
    expect(script.requests[0]).toMatchObject({
      lang: "en",
      section: "projects",
      messages: [{ role: "user", content: "Show me his automation projects" }],
    });
  });

  it("sends with Enter and keeps Shift+Enter for new lines", async () => {
    script.events = [{ type: "text", delta: "Hi!" }, { type: "done" }];
    renderWidget();
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
    expect(script.requests).toHaveLength(0);

    fireEvent.keyDown(input, { key: "Enter" });
    await screen.findByText("Hi!");
    expect(script.requests).toHaveLength(1);
    expect(input).toHaveValue("");
  });

  it("explains a rate limit and answers from the local FAQ", async () => {
    script.events = [{ type: "error", code: "rate_limited", retryAfter: 120 }];
    renderWidget();

    fireEvent.click(screen.getByRole("button", { name: "Which certifications does he have?" }));

    expect(await screen.findByText(/Try again in 2 min/)).toBeInTheDocument();
    expect(screen.getByText(/He holds: Iquall NetOps Automation Specialist/)).toBeInTheDocument();
  });

  it("restores the previous conversation from localStorage", async () => {
    script.events = [{ type: "text", delta: "Saved answer" }, { type: "done" }];
    const first = renderWidget();
    fireEvent.click(screen.getByRole("button", { name: "What does he do at Logicalis?" }));
    await screen.findByText("Saved answer");
    first.unmount();

    renderWidget();
    await waitFor(() => expect(screen.getByText("Saved answer")).toBeInTheDocument());
  });
});
