// "Is this element on screen?" for every reveal on the page, through a handful of shared
// IntersectionObservers (one per rootMargin) instead of one per element.

export interface InViewOptions {
  /** rootMargin of the observer. The default waits until the element is a little inside the viewport. */
  margin?: string;
  /** Keep reporting as the element leaves and returns. Default: report the first sighting only. */
  repeat?: boolean;
}

type Listener = (inView: boolean) => void;

interface Registration {
  listener: Listener;
  repeat: boolean;
  margin: string;
}

export const DEFAULT_MARGIN = "0px 0px -10% 0px";

const observers = new Map<string, IntersectionObserver>();
const registry = new Map<Element, Set<Registration>>();
let flushScheduled = false;
let listeningForBottom = false;

function release(element: Element, registration: Registration): void {
  const registrations = registry.get(element);
  if (!registrations?.delete(registration)) return;
  if (![...registrations].some((other) => other.margin === registration.margin)) {
    observers.get(registration.margin)?.unobserve(element);
  }
  if (registrations.size === 0) registry.delete(element);
}

function observerFor(margin: string): IntersectionObserver {
  let observer = observers.get(margin);
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          for (const registration of [...(registry.get(entry.target) ?? [])]) {
            if (registration.margin !== margin) continue;
            if (registration.repeat) registration.listener(entry.isIntersecting);
            else if (entry.isIntersecting) {
              release(entry.target, registration);
              registration.listener(true);
            }
          }
        }
      },
      { rootMargin: margin },
    );
    observers.set(margin, observer);
  }
  return observer;
}

// With a negative bottom margin, whatever sits at the very end of the page can never get
// "inside enough". Once the visitor reaches the bottom, reveal what is visible.
function flushAtPageBottom(): void {
  flushScheduled = false;
  const root = document.documentElement;
  if (window.innerHeight + window.scrollY < root.scrollHeight - 2) return;
  for (const [element, registrations] of [...registry]) {
    const rect = element.getBoundingClientRect();
    if (rect.top >= window.innerHeight || rect.bottom <= 0) continue;
    for (const registration of [...registrations]) {
      if (registration.repeat) continue;
      release(element, registration);
      registration.listener(true);
    }
  }
}

function onScroll(): void {
  if (flushScheduled || registry.size === 0) return;
  flushScheduled = true;
  requestAnimationFrame(flushAtPageBottom);
}

/**
 * Calls `listener` when `element` enters the viewport (and, with `repeat`, when it leaves).
 * Without IntersectionObserver the element is reported as visible right away.
 * Returns the function that stops observing.
 */
export function observeInView(element: Element, listener: Listener, options: InViewOptions = {}): () => void {
  if (typeof IntersectionObserver === "undefined") {
    listener(true);
    return () => {};
  }

  const registration: Registration = {
    listener,
    repeat: options.repeat ?? false,
    margin: options.margin ?? DEFAULT_MARGIN,
  };
  let registrations = registry.get(element);
  if (!registrations) registry.set(element, (registrations = new Set()));
  const observer = observerFor(registration.margin);
  // An observer only reports changes: start over so a latecomer still gets the current state.
  if ([...registrations].some((other) => other.margin === registration.margin)) observer.unobserve(element);
  registrations.add(registration);
  observer.observe(element);

  if (!listeningForBottom) {
    listeningForBottom = true;
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  return () => release(element, registration);
}
