import { useEffect, useRef, useState, type RefObject } from "react";
import { observeInView, type InViewOptions } from "./in-view";
import { trackProgress, type ProgressOptions } from "./scroll";

/**
 * Ref for an element whose scroll progress (0–1) is written to a custom property (default
 * `--p`) on it. Style against `var(--p, <still value>)`: the fallback is what visitors
 * with reduced motion see.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(options: ProgressOptions = {}): RefObject<T> {
  const ref = useRef<T>(null);
  // Options are read once per mount: callers pass literals, which change identity every render.
  const initial = useRef(options);

  useEffect(() => {
    if (!ref.current) return;
    return trackProgress(ref.current, initial.current);
  }, []);

  return ref;
}

/** True once the element has been seen (or, with `repeat`, while it is on screen). */
export function useInView<T extends Element = HTMLDivElement>(options: InViewOptions = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { margin, repeat } = options;

  useEffect(() => {
    if (!ref.current) return;
    return observeInView(ref.current, setInView, { margin, repeat });
  }, [margin, repeat]);

  return [ref, inView];
}
