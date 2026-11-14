import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./env";
import { observeInView } from "./in-view";

interface CounterProps {
  value: number;
  /** Minimum digits: 4 → "04". */
  pad?: number;
  durationMs?: number;
  className?: string;
}

const easeOutExpo = (t: number): number => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const format = (value: number, pad: number): string => String(Math.round(value)).padStart(pad, "0");

/**
 * A number that counts up the first time it is seen. Screen readers get the final value;
 * the ticking digits are decoration.
 */
const Counter = ({ value, pad = 2, durationMs = 1600, className }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // React owns the text node: change its data rather than replacing it.
    const digits = ref.current?.firstChild;
    if (!ref.current || !digits || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;

    let frame = 0;
    digits.nodeValue = format(0, pad);
    const stop = observeInView(ref.current, () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs);
        digits.nodeValue = format(value * easeOutExpo(progress), pad);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });

    return () => {
      stop();
      cancelAnimationFrame(frame);
      digits.nodeValue = format(value, pad);
    };
  }, [value, pad, durationMs]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {format(value, pad)}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
};

export default Counter;
