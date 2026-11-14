import { createContext, createElement, useContext, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cssVars } from "./env";
import { observeInView } from "./in-view";

/** Styles live in styles/motion.css. */
export type RevealVariant = "up" | "fade" | "scale" | "clip" | "clip-up" | "line";

type Tag = "div" | "span" | "p" | "li" | "ul" | "ol" | "dl" | "article" | "header" | "footer" | "figure" | "section";

interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  as?: Tag;
  variant?: RevealVariant;
  /** Position in a sequence: each step waits a little longer (`--stagger`, 70 ms by default). */
  index?: number;
  /** Extra wait in ms. */
  delay?: number;
  /** rootMargin for the observer (see in-view.ts). */
  margin?: string;
  /** Drive the reveal by hand instead of by scroll position (e.g. after the intro). */
  play?: boolean;
  children?: ReactNode;
}

const GroupContext = createContext(false);

/** Marks the element as seen through an attribute, without re-rendering React. */
function useRevealTrigger(play: boolean | undefined, margin: string | undefined, skip: boolean) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (play !== undefined) {
      element.toggleAttribute("data-inview", play);
      return;
    }
    if (skip) return;
    return observeInView(element, () => element.setAttribute("data-inview", ""), { margin });
  }, [play, margin, skip]);

  return ref;
}

/** Animates its element in when it scrolls into view (or when its RevealGroup does). */
export const Reveal = ({ as = "div", variant = "up", index, delay, margin, play, style, children, ...rest }: RevealProps) => {
  const grouped = useContext(GroupContext);
  const ref = useRevealTrigger(play, margin, grouped);

  return createElement(
    as,
    {
      ...rest,
      ref,
      "data-reveal": variant,
      style: { ...style, ...cssVars({ "--i": index, "--delay": delay === undefined ? undefined : `${delay}ms` }) },
    },
    children,
  );
};

interface RevealGroupProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  as?: Tag;
  margin?: string;
  play?: boolean;
  children?: ReactNode;
}

/** Reveals every <Reveal> inside it at once, as soon as the group itself is seen. */
export const RevealGroup = ({ as = "div", margin, play, children, ...rest }: RevealGroupProps) => {
  const ref = useRevealTrigger(play, margin, false);

  return (
    <GroupContext.Provider value={true}>
      {createElement(as, { ...rest, ref, "data-reveal-group": "" }, children)}
    </GroupContext.Provider>
  );
};
