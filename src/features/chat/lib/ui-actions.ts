// Page effects of the assistant's UI tools: scroll, highlight, and the contact prefill
// (the contact section listens through chat-bus). Highlight styles live in ChatWidget.module.css,
// which is loaded whenever these run.
import { projectAnchorId, type SectionId } from "@/lib/sections";
import { prefillContact, type ContactPrefill } from "../chat-bus";
import type { UiAction } from "../protocol";

export const HIGHLIGHT_ATTRIBUTE = "data-gioai-highlight";
const HIGHLIGHT_MS = 2600;

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

const scrollTo = (element: Element | null, block: ScrollLogicalPosition) =>
  element?.scrollIntoView?.({ behavior: reducedMotion() ? "auto" : "smooth", block });

const timers = new WeakMap<Element, number>();

/** Marks an element for the highlight animation; a repeat restarts it instead of stacking. */
export function flash(element: Element | null, kind: "card" | "heading"): void {
  if (!element) return;
  window.clearTimeout(timers.get(element));
  element.removeAttribute(HIGHLIGHT_ATTRIBUTE);
  // Next frame, so removing and re-adding the attribute restarts the CSS animation.
  requestAnimationFrame(() => {
    element.setAttribute(HIGHLIGHT_ATTRIBUTE, kind);
    timers.set(element, window.setTimeout(() => element.removeAttribute(HIGHLIGHT_ATTRIBUTE), HIGHLIGHT_MS));
  });
}

export function navigateToSection(section: SectionId): void {
  scrollTo(document.getElementById(section), "start");
  flash(document.getElementById(`${section}-title`), "heading");
}

export function highlightProject(projectId: string): void {
  const card = document.getElementById(projectAnchorId(projectId));
  scrollTo(card, "center");
  flash(card, "card");
}

export function openContact(prefill: ContactPrefill): void {
  navigateToSection("contact");
  prefillContact(prefill);
  flash(document.getElementById("contact-email"), "card");
}

export function runUiAction(action: UiAction): void {
  switch (action.type) {
    case "navigate":
      return navigateToSection(action.section);
    case "highlightProject":
      return highlightProject(action.projectId);
    case "openContact":
      return openContact({ subject: action.subject, message: action.message });
  }
}
