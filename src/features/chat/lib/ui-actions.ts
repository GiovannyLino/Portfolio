// Page effects of the assistant's UI tools. Phase 5 builds the contact form that listens
// to the prefill event; everything else here already works on the current page.
import { projectAnchorId, type SectionId } from "@/lib/sections";
import type { UiAction } from "../protocol";

export const CONTACT_PREFILL_EVENT = "gioai:contact-prefill";
export const HIGHLIGHT_ATTRIBUTE = "data-gioai-highlight";
const HIGHLIGHT_MS = 2600;

export interface ContactPrefill {
  subject: string;
  message?: string;
}

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

const scrollTo = (element: Element | null, block: ScrollLogicalPosition) =>
  element?.scrollIntoView?.({ behavior: reducedMotion() ? "auto" : "smooth", block });

export const navigateToSection = (section: SectionId) => scrollTo(document.getElementById(section), "start");

export function highlightProject(projectId: string): void {
  const card = document.getElementById(projectAnchorId(projectId));
  if (!card) return;
  scrollTo(card, "center");
  card.setAttribute(HIGHLIGHT_ATTRIBUTE, "true");
  window.setTimeout(() => card.removeAttribute(HIGHLIGHT_ATTRIBUTE), HIGHLIGHT_MS);
}

export function openContact(prefill: ContactPrefill): void {
  navigateToSection("contact");
  window.dispatchEvent(new CustomEvent<ContactPrefill>(CONTACT_PREFILL_EVENT, { detail: prefill }));
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
