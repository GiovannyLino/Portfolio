import { useEffect, useRef, type ReactNode } from "react";
import { hasFinePointer, prefersReducedMotion } from "./env";

interface MagneticProps {
  children: ReactNode;
  /** How far the content follows the pointer: 0 (not at all) to 1 (stays under it). */
  strength?: number;
  className?: string;
}

/**
 * Makes its content lean towards the mouse while it is over it (styles in
 * styles/motion.css). The outer box stays put and is the one measured, so the movement of
 * the inner one never feeds back into the calculation.
 */
const Magnetic = ({ children, strength = 0.3, className }: MagneticProps) => {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner || !hasFinePointer() || prefersReducedMotion()) return;

    const onMove = (event: PointerEvent) => {
      const rect = outer.getBoundingClientRect();
      inner.style.setProperty("--mx", `${((event.clientX - (rect.left + rect.width / 2)) * strength).toFixed(1)}px`);
      inner.style.setProperty("--my", `${((event.clientY - (rect.top + rect.height / 2)) * strength).toFixed(1)}px`);
      inner.setAttribute("data-magnetic-active", "");
    };
    const onLeave = () => {
      inner.style.removeProperty("--mx");
      inner.style.removeProperty("--my");
      inner.removeAttribute("data-magnetic-active");
    };

    outer.addEventListener("pointermove", onMove, { passive: true });
    outer.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      outer.removeEventListener("pointermove", onMove);
      outer.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, [strength]);

  return (
    <span ref={outerRef} className={className} style={{ display: "inline-block" }}>
      <span ref={innerRef} data-magnetic="">
        {children}
      </span>
    </span>
  );
};

export default Magnetic;
