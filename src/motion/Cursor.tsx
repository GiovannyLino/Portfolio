import { useEffect, useRef, useState } from "react";
import { damp, hasFinePointer, prefersReducedMotion } from "./env";
import styles from "./Cursor.module.css";

const INTERACTIVE = "a, button, [role='button'], summary, label";
const TEXT_ENTRY = "input, textarea, [contenteditable='true']";

/**
 * A dot that trails the mouse and swells over anything clickable. The native cursor stays:
 * this is an accent, not a replacement. Mouse only, and never under reduced motion.
 */
const Cursor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => setEnabled(hasFinePointer() && !prefersReducedMotion()), []);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;

    let x = 0;
    let y = 0;
    let goalX = 0;
    let goalY = 0;
    let frame = 0;
    let last = 0;
    let shown = false;

    const loop = (now: number) => {
      const ease = damp(now - last, 75);
      last = now;
      x += (goalX - x) * ease;
      y += (goalY - y) * ease;
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      frame = Math.abs(goalX - x) + Math.abs(goalY - y) > 0.2 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      goalX = event.clientX;
      goalY = event.clientY;
      if (!shown) {
        shown = true;
        x = goalX;
        y = goalY;
        element.setAttribute("data-visible", "");
      }
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      element.dataset.state = target?.closest(TEXT_ENTRY) ? "text" : target?.closest(INTERACTIVE) ? "hover" : "idle";
    };

    const hide = () => {
      shown = false;
      element.removeAttribute("data-visible");
    };
    const press = () => element.setAttribute("data-pressed", "");
    const lift = () => element.removeAttribute("data-pressed");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", lift, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", lift);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} className={styles.cursor} data-state="idle" aria-hidden="true">
      <span className={styles.dot} />
    </div>
  );
};

export default Cursor;
