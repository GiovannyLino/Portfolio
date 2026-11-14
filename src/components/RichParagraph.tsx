import type { RichText } from "@/data/knowledge";

/**
 * Renders knowledge-base prose with emphasis as React nodes, never as raw HTML.
 * "strong" runs become <strong>, "accent" runs take the accent colour.
 */
const RichParagraph = ({ segments, className }: { segments: RichText; className?: string }) => (
  <p className={className}>
    {segments.map((segment, i) =>
      typeof segment === "string" ? (
        segment
      ) : segment.tone === "strong" ? (
        <strong key={i}>{segment.text}</strong>
      ) : (
        <span key={i} className="accent">
          {segment.text}
        </span>
      ),
    )}
  </p>
);

export default RichParagraph;
