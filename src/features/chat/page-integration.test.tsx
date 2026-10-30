import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import { contactHref } from "@/lib/contact";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { onContactPrefill, onOpenChat, prefillContact, type OpenChatDetail } from "./chat-bus";
import { HIGHLIGHT_ATTRIBUTE, highlightProject, navigateToSection, openContact } from "./lib/ui-actions";
import { markNudged, scrollProgress, wasNudged } from "./nudge";

const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 30));

afterEach(() => {
  document.body.innerHTML = "";
});

describe("page actions", () => {
  it("navigateToSection scrolls to the section and marks its title", async () => {
    document.body.innerHTML = '<section id="projects"><h2 id="projects-title"><span>04.</span><span>Projects</span></h2></section>';
    const scroll = vi.fn();
    document.getElementById("projects")!.scrollIntoView = scroll;

    navigateToSection("projects");
    await nextFrame();

    expect(scroll).toHaveBeenCalledWith(expect.objectContaining({ block: "start" }));
    expect(document.getElementById("projects-title")).toHaveAttribute(HIGHLIGHT_ATTRIBUTE, "heading");
  });

  it("highlightProject centers and highlights the card", async () => {
    document.body.innerHTML = '<article id="project-poc-in-a-box"></article>';
    const card = document.getElementById("project-poc-in-a-box")!;
    card.scrollIntoView = vi.fn();

    highlightProject("poc-in-a-box");
    await nextFrame();

    expect(card.scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ block: "center" }));
    expect(card).toHaveAttribute(HIGHLIGHT_ATTRIBUTE, "card");
  });

  it("openContact hands the subject and message to the contact form", () => {
    const received = vi.fn();
    const stop = onContactPrefill(received);
    openContact({ subject: "Vaga", message: "Olá" });
    stop();
    expect(received).toHaveBeenCalledWith({ subject: "Vaga", message: "Olá" });
  });
});

describe("contact button", () => {
  it("is a plain mailto link, with the assistant's subject and draft when it sent the visitor", () => {
    expect(contactHref("gio@example.com", null)).toBe("mailto:gio@example.com");
    expect(contactHref("gio@example.com", { subject: "Vaga SRE", message: "Olá!" })).toBe(
      "mailto:gio@example.com?subject=Vaga%20SRE&body=Ol%C3%A1!",
    );
  });

  it("picks up the prefill sent by the chat", () => {
    render(
      <LanguageProvider>
        <ContactSection />
      </LanguageProvider>,
    );
    const button = screen.getByRole("link", { name: "Say Hello" });
    expect(button).toHaveAttribute("href", "mailto:giovannylino9@gmail.com");

    act(() => prefillContact({ subject: "SRE role" }));
    expect(button).toHaveAttribute("href", "mailto:giovannylino9@gmail.com?subject=SRE%20role");
  });
});

describe("stack explorer", () => {
  const capture = () => {
    const opened: OpenChatDetail[] = [];
    const stop = onOpenChat((detail) => opened.push(detail));
    return { opened, stop };
  };

  it("asks Gio.AI where a technology was used", () => {
    const { opened, stop } = capture();
    render(
      <LanguageProvider>
        <SkillsSection />
      </LanguageProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Ask Gio.AI where Ansible was used" }));
    stop();
    expect(opened).toEqual([{ question: "Where did Giovanny use Ansible?" }]);
  });

  it("asks Gio.AI about a project from its card", () => {
    const { opened, stop } = capture();
    render(
      <LanguageProvider>
        <ProjectsSection />
      </LanguageProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Ask Gio.AI about PoC-in-a-Box" }));
    stop();
    expect(opened).toEqual([{ question: "Tell me about the PoC-in-a-Box project" }]);
  });
});

describe("proactive nudge", () => {
  it("measures scroll progress through the scrollable height", () => {
    expect(scrollProgress(0, 800, 4800)).toBe(0);
    expect(scrollProgress(2000, 800, 4800)).toBe(0.5);
    expect(scrollProgress(9999, 800, 4800)).toBe(1);
    expect(scrollProgress(0, 800, 600)).toBe(0);
  });

  it("happens once per session, and tolerates blocked storage", () => {
    const data = new Map<string, string>();
    const storage = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) } as Storage;
    expect(wasNudged(storage)).toBe(false);
    markNudged(storage);
    expect(wasNudged(storage)).toBe(true);

    const blocked = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    } as unknown as Storage;
    expect(wasNudged(blocked)).toBe(false);
    expect(() => markNudged(blocked)).not.toThrow();
  });
});
