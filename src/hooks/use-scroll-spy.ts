import { useEffect, useState } from "react";

/**
 * Returns the id of the section crossing a thin band at ~40% of the viewport height,
 * or null while none does (e.g. over the hero).
 */
export function useScrollSpy<T extends string>(ids: readonly T[]): T | null {
  const [active, setActive] = useState<T | null>(null);
  // Callers usually pass a fresh array each render; depend on its contents instead.
  const idsKey = ids.join(",");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const elements = idsKey
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Document order breaks ties when two sections share the band during a jump.
        setActive((elements.find((element) => visible.has(element.id))?.id as T | undefined) ?? null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [idsKey]);

  return active;
}
