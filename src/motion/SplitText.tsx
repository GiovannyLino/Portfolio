import { createElement, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cssVars } from "./env";
import { observeInView } from "./in-view";

interface SplitTextProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  text: string;
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3";
  /** Animate whole words (default) or single letters. */
  by?: "word" | "letter";
  /** "rise": each word slides up from behind a mask. "glow": words surface from the dark. */
  variant?: "rise" | "glow";
  /** Words that take the accent colour. */
  accent?: (word: string, index: number) => boolean;
  /** Wait between one word (or letter) and the next, in ms. */
  stagger?: number;
  /** Wait before the first one, in ms. */
  delay?: number;
  margin?: string;
  /** Drive the animation by hand instead of by scroll position. */
  play?: boolean;
}

/**
 * Text that enters word by word (styles in styles/motion.css). Words stay ordinary inline
 * text separated by real spaces, so wrapping and screen readers are unaffected; letter mode
 * hides its fragments from assistive tech and offers the whole string instead.
 */
const SplitText = ({
  text,
  as = "span",
  by = "word",
  variant = "rise",
  accent,
  stagger,
  delay,
  margin,
  play,
  style,
  ...rest
}: SplitTextProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (play !== undefined) {
      element.toggleAttribute("data-inview", play);
      return;
    }
    return observeInView(element, () => element.setAttribute("data-inview", ""), { margin });
  }, [play, margin]);

  const words = text.split(/\s+/).filter(Boolean);
  let letterCount = 0;

  const children: ReactNode[] = words.flatMap((word, index) => {
    const className = accent?.(word, index) ? "split-word accent" : "split-word";
    const node =
      by === "letter" ? (
        <span key={index} className={className}>
          {[...word].map((letter, position) => (
            <span key={position} className="split-inner" style={cssVars({ "--i": letterCount++ })}>
              {letter}
            </span>
          ))}
        </span>
      ) : (
        <span key={index} className={className}>
          <span className="split-inner" style={cssVars({ "--i": index })}>
            {word}
          </span>
        </span>
      );
    return index === 0 ? [node] : [" ", node];
  });

  return createElement(
    as,
    {
      ...rest,
      ref,
      "data-split": variant,
      style: {
        ...style,
        ...cssVars({
          "--stagger": stagger === undefined ? undefined : `${stagger}ms`,
          "--delay": delay === undefined ? undefined : `${delay}ms`,
        }),
      },
    },
    by === "letter" ? (
      <>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">{children}</span>
      </>
    ) : (
      children
    ),
  );
};

export default SplitText;
