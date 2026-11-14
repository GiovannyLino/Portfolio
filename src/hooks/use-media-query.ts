import { useEffect, useState } from "react";

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
