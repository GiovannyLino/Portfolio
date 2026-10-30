import { useEffect, useState, type RefObject } from "react";
import type { Gaze } from "./Mascot";

const query = (media: string): MediaQueryList | null =>
  typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia(media) : null;

export function useMediaQuery(media: string): boolean {
  const [matches, setMatches] = useState(() => query(media)?.matches ?? false);

  useEffect(() => {
    const list = query(media);
    if (!list) return;
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [media]);

  return matches;
}

export const usePrefersReducedMotion = (): boolean => useMediaQuery("(prefers-reduced-motion: reduce)");

const CENTER: Gaze = { x: 0, y: 0 };
/** Distance (px) at which the eyes reach the edge of their range. */
const REACH = 320;

/** Normalized direction from the element's center to the pointer, updated once per frame. */
export function usePointerGaze(ref: RefObject<HTMLElement>, enabled: boolean): Gaze {
  const [gaze, setGaze] = useState<Gaze>(CENTER);

  useEffect(() => {
    if (!enabled) {
      setGaze(CENTER);
      return;
    }
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const clamp = (value: number) => Math.max(-1, Math.min(1, value));
        setGaze({
          x: clamp((event.clientX - (rect.left + rect.width / 2)) / REACH),
          y: clamp((event.clientY - (rect.top + rect.height / 2)) / REACH),
        });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [ref, enabled]);

  return gaze;
}
