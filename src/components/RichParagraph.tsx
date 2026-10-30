import type { RichText } from "@/data/knowledge";

const TONE_CLASS = {
  strong: "text-foreground font-medium",
  accent: "text-primary font-medium",
} as const;

/** Renders knowledge-base prose with emphasis as React nodes, never as raw HTML. */
const RichParagraph = ({ segments }: { segments: RichText }) => (
  <p>
    {segments.map((segment, i) =>
      typeof segment === "string" ? (
        segment
      ) : (
        <span key={i} className={TONE_CLASS[segment.tone]}>
          {segment.text}
        </span>
      ),
    )}
  </p>
);

export default RichParagraph;
