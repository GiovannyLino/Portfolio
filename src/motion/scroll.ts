// Scroll-linked motion. One requestAnimationFrame loop serves every tracker on the page:
// it measures only after the page actually moved, eases each value towards its goal (so a
// mouse wheel's steps do not show), and stops as soon as everything has settled.
import { clamp, damp, prefersReducedMotion } from "./env";

type EdgeName = "top" | "center" | "bottom";
type Edge = EdgeName | number;

/**
 * Where the element meets the viewport: [element edge, viewport edge], each a keyword or a
 * 0–1 fraction measured from the top. ["top", "bottom"] is "the element's top reaches the
 * bottom of the viewport".
 */
export type Anchor = readonly [Edge, Edge];

export interface ProgressOptions {
  /** Progress is 0 here… Default: the element's top enters at the bottom of the viewport. */
  from?: Anchor;
  /** …and 1 here. Default: the element's bottom leaves at the top of the viewport. */
  to?: Anchor;
  /** Custom progress (0–1) instead of from/to, e.g. how far the whole page has scrolled. */
  measure?: () => number;
  /** Time constant of the easing in ms; 0 follows the scrollbar exactly. */
  smooth?: number;
  /** Custom property written on the element (or on `target`). Default: --p. */
  property?: `--${string}`;
  /** Element that receives the property when it is not the measured one. */
  target?: HTMLElement | null;
  onChange?: (progress: number) => void;
  /** Keeps working under prefers-reduced-motion: for indicators, not for decoration. */
  essential?: boolean;
}

interface Tracker {
  element: HTMLElement;
  options: ProgressOptions;
  from: readonly [number, number];
  to: readonly [number, number];
  goal: number;
  current: number;
  /** Near the viewport; trackers far away are skipped. */
  active: boolean;
  /** False until the first measurement, which is applied without easing. */
  primed: boolean;
}

const FRACTION: Record<EdgeName, number> = { top: 0, center: 0.5, bottom: 1 };
const fraction = (edge: Edge): number => (typeof edge === "number" ? edge : FRACTION[edge]);
const resolve = (anchor: Anchor): readonly [number, number] => [fraction(anchor[0]), fraction(anchor[1])];

const DEFAULT_FROM: Anchor = ["top", "bottom"];
const DEFAULT_TO: Anchor = ["bottom", "top"];
const DEFAULT_SMOOTH_MS = 110;
const SETTLED = 0.0005;

const trackers = new Set<Tracker>();
const velocityListeners = new Set<(pixelsPerSecond: number) => void>();

let running = false;
let dirty = false;
let listening = false;
let lastTime = 0;
let lastScrollY = 0;
let velocity = 0;
let nearViewport: IntersectionObserver | null = null;
const byElement = new Map<Element, Set<Tracker>>();

function measure(tracker: Tracker): number {
  if (tracker.options.measure) return clamp(tracker.options.measure());
  const rect = tracker.element.getBoundingClientRect();
  const viewport = window.innerHeight;
  const start = rect.top + rect.height * tracker.from[0] - viewport * tracker.from[1];
  const end = rect.top + rect.height * tracker.to[0] - viewport * tracker.to[1];
  const span = end - start;
  return span === 0 ? (start <= 0 ? 1 : 0) : clamp(-start / span);
}

function write(tracker: Tracker): void {
  const { options, element, current } = tracker;
  (options.target ?? element).style.setProperty(options.property ?? "--p", current.toFixed(4));
  options.onChange?.(current);
}

function frame(now: number): void {
  const elapsed = Math.min(64, now - lastTime);
  lastTime = now;

  // Read everything first, write afterwards: one layout per frame at most.
  if (dirty) {
    dirty = false;
    for (const tracker of trackers) if (tracker.active) tracker.goal = measure(tracker);
  }

  let settled = true;
  for (const tracker of trackers) {
    if (!tracker.active) continue;
    let next = tracker.goal;
    if (tracker.primed) {
      const eased = tracker.current + (tracker.goal - tracker.current) * damp(elapsed, tracker.options.smooth ?? DEFAULT_SMOOTH_MS);
      if (Math.abs(tracker.goal - eased) > SETTLED) {
        next = eased;
        settled = false;
      }
    }
    if (next !== tracker.current || !tracker.primed) {
      tracker.current = next;
      tracker.primed = true;
      write(tracker);
    }
  }

  if (velocityListeners.size > 0) {
    const scrollY = window.scrollY;
    const instant = elapsed > 0 ? ((scrollY - lastScrollY) / elapsed) * 1000 : 0;
    lastScrollY = scrollY;
    velocity += (instant - velocity) * damp(elapsed, 140);
    if (Math.abs(velocity) < 2) velocity = 0;
    else settled = false;
    for (const listener of velocityListeners) listener(velocity);
  }

  if (settled && !dirty) running = false;
  else requestAnimationFrame(frame);
}

function wake(): void {
  dirty = true;
  if (running) return;
  running = true;
  lastTime = performance.now();
  lastScrollY = window.scrollY;
  requestAnimationFrame(frame);
}

function listen(): void {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", wake, { passive: true });
  window.addEventListener("resize", wake, { passive: true });
  // Content that changes height (fonts arriving, the chat drawer pushing the page)
  // moves elements without any scroll event.
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(wake).observe(document.body);
  if (typeof IntersectionObserver !== "undefined") {
    nearViewport = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          for (const tracker of byElement.get(entry.target) ?? []) tracker.active = entry.isIntersecting;
        }
        wake();
      },
      { rootMargin: "60% 0px 60% 0px" },
    );
  }
}

/**
 * Follows `element` through the viewport and writes its progress (0–1) to a custom
 * property, eased. Returns the function that stops tracking.
 *
 * Under prefers-reduced-motion nothing is written unless `essential` is set, so the CSS
 * fallback of the property (`var(--p, 1)`) decides the still image.
 */
export function trackProgress(element: HTMLElement, options: ProgressOptions = {}): () => void {
  if (typeof window === "undefined" || (prefersReducedMotion() && !options.essential)) return () => {};
  listen();

  const tracker: Tracker = {
    element,
    options,
    from: resolve(options.from ?? DEFAULT_FROM),
    to: resolve(options.to ?? DEFAULT_TO),
    goal: 0,
    current: 0,
    // Custom measurements are not tied to an element's position: always on.
    active: Boolean(options.measure) || nearViewport === null,
    primed: false,
  };
  trackers.add(tracker);

  if (!options.measure && nearViewport) {
    let group = byElement.get(element);
    if (!group) byElement.set(element, (group = new Set()));
    group.add(tracker);
    nearViewport.observe(element);
  }
  wake();

  return () => {
    trackers.delete(tracker);
    const group = byElement.get(element);
    if (group?.delete(tracker) && group.size === 0) {
      byElement.delete(element);
      nearViewport?.unobserve(element);
    }
  };
}

/** Smoothed scroll speed in px/s (signed: positive when scrolling down), once per frame while moving. */
export function onScrollVelocity(listener: (pixelsPerSecond: number) => void): () => void {
  if (typeof window === "undefined") return () => {};
  listen();
  velocityListeners.add(listener);
  return () => velocityListeners.delete(listener);
}
