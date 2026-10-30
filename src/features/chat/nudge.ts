// The launcher's single proactive invitation per session: after 25 s on the page or half of
// it scrolled, whichever comes first. Anything else only shows on hover/focus.
export const NUDGE_DELAY_MS = 25_000;
export const NUDGE_SCROLL_PROGRESS = 0.5;
const NUDGED_KEY = "gioai:nudged";

/** 0 at the top of the page, 1 at the bottom. */
export const scrollProgress = (scrollY: number, viewportHeight: number, documentHeight: number): number => {
  const scrollable = documentHeight - viewportHeight;
  return scrollable <= 0 ? 0 : Math.min(1, Math.max(0, scrollY / scrollable));
};

// sessionStorage can be missing or throw (private mode, blocked storage): then the nudge
// may repeat on a reload, never within the same page view.
export const wasNudged = (storage: Storage | undefined = globalThis.sessionStorage): boolean => {
  try {
    return storage?.getItem(NUDGED_KEY) === "1";
  } catch {
    return false;
  }
};

export const markNudged = (storage: Storage | undefined = globalThis.sessionStorage): void => {
  try {
    storage?.setItem(NUDGED_KEY, "1");
  } catch {
    // See wasNudged.
  }
};
