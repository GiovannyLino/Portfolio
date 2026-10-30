import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LANGUAGES } from "@/data/knowledge";
import { chatCopy } from "./i18n";
import { buildTour } from "./tour";
import TourGuide from "./components/TourGuide";

const runUiAction = vi.fn();
vi.mock("./lib/ui-actions", () => ({ runUiAction: (...args: unknown[]) => runUiAction(...args) }));

beforeEach(() => runUiAction.mockReset());

describe("buildTour", () => {
  it.each(LANGUAGES)("walks the page in order and ends at contact (%s)", (lang) => {
    const stops = buildTour(lang);
    expect(stops.map((stop) => stop.id)).toEqual(["about", "experience", "projects", "skills", "education", "contact"]);
    expect(stops[2].action).toEqual({ type: "highlightProject", projectId: "netbox-ansible-pipeline" });
    expect(stops.every((stop) => stop.text.length > 40 && stop.text.length < 320)).toBe(true);
  });

  it("takes its facts from the knowledge base", () => {
    const [about, experience, , , education] = buildTour("pt");
    expect(about.text).toContain("Analista de Service Provider na Logicalis");
    expect(experience.text).toContain("desde Dez/2025");
    expect(education.text).toContain("4 certificações");
    expect(education.text).toContain("2028");
  });
});

describe("TourGuide", () => {
  const setup = () => {
    const onExit = vi.fn();
    const onAsk = vi.fn();
    render(<TourGuide lang="en" copy={chatCopy.en} onExit={onExit} onAsk={onAsk} />);
    return { onExit, onAsk };
  };

  it("moves the page with each stop and focuses Next", () => {
    setup();
    expect(runUiAction).toHaveBeenLastCalledWith({ type: "navigate", section: "about" });
    expect(screen.getByText("1 of 6")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(runUiAction).toHaveBeenLastCalledWith({ type: "navigate", section: "experience" });

    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText("1 of 6")).toBeInTheDocument();
  });

  it("ends with the résumé, LinkedIn and a way to keep asking", () => {
    const { onExit, onAsk } = setup();
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("6 of 6")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Résumé/ })).toHaveAttribute("href", "/Giovanny_Lino_Resume_DevOps_EN.pdf");
    fireEvent.click(screen.getByRole("button", { name: "Ask a question" }));
    expect(onAsk).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Finish" }));
    expect(onExit).toHaveBeenCalled();
  });

  it("can be left at any time with Esc or the close button", () => {
    const { onExit } = setup();
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Exit tour" }));
    expect(onExit).toHaveBeenCalledTimes(2);
  });
});
