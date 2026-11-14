import { cssVars } from "./env";
import { useScrollProgress } from "./hooks";
import styles from "./ScrollWords.module.css";

interface Segment {
  text: string;
  /** Marks emphasised runs; styled by the caller through [data-tone]. */
  tone?: string;
}

interface ScrollWordsProps {
  segments: readonly Segment[];
  className?: string;
}

/**
 * A paragraph that "reads itself" as it scrolls past: words go from faint to full, a few
 * at a time, following the scroll position. Without motion every word is simply full.
 */
const ScrollWords = ({ segments, className }: ScrollWordsProps) => {
  const ref = useScrollProgress<HTMLParagraphElement>({ from: ["top", 0.9], to: ["bottom", 0.55], smooth: 140 });

  let count = 0;
  const children = segments.flatMap((segment, segmentIndex) =>
    // The capture keeps the whitespace runs, so spacing and wrapping stay those of plain text.
    segment.text.split(/(\s+)/).map((token, tokenIndex) =>
      token.trim() === "" ? (
        token
      ) : (
        <span key={`${segmentIndex}-${tokenIndex}`} className={styles.word} data-tone={segment.tone} style={cssVars({ "--i": count++ })}>
          {token}
        </span>
      ),
    ),
  );

  return (
    <p ref={ref} className={className} style={cssVars({ "--n": count })}>
      {children}
    </p>
  );
};

export default ScrollWords;
