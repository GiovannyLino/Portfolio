import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cssVars, prefersReducedMotion } from "./env";
import { observeInView } from "./in-view";
import { onScrollVelocity } from "./scroll";
import styles from "./Marquee.module.css";

interface MarqueeProps {
  children: ReactNode;
  /** Resting speed in px/s. */
  speed?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * Endless horizontal ticker. Decoration only: it is hidden from assistive tech, so the
 * same information must exist elsewhere on the page. It runs on the compositor (a CSS
 * animation), speeds up while the page scrolls and pauses off screen.
 */
const Marquee = ({ children, speed = 70, reverse = false, className }: MarqueeProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!root || !track || !group || prefersReducedMotion()) return;

    // Constant speed whatever the content: the loop lasts as long as one copy is wide.
    const fit = () => track.style.setProperty("--marquee-duration", `${Math.max(8, group.offsetWidth / speed)}s`);
    fit();
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(fit);
    resize?.observe(group);

    const stopWatching = observeInView(root, (inView) => root.toggleAttribute("data-paused", !inView), {
      margin: "20% 0px 20% 0px",
      repeat: true,
    });

    const stopVelocity = onScrollVelocity((pixelsPerSecond) => {
      const [animation] = track.getAnimations?.() ?? [];
      if (animation) animation.playbackRate = 1 + Math.min(5, Math.abs(pixelsPerSecond) / 450);
    });

    return () => {
      resize?.disconnect();
      stopWatching();
      stopVelocity();
    };
  }, [speed]);

  return (
    <div ref={rootRef} className={cn(styles.marquee, className)} aria-hidden="true">
      <div ref={trackRef} className={styles.track} style={cssVars({ "--marquee-direction": reverse ? "reverse" : "normal" })}>
        <div ref={groupRef} className={styles.group}>
          {children}
        </div>
        <div className={styles.group}>{children}</div>
      </div>
    </div>
  );
};

export default Marquee;
