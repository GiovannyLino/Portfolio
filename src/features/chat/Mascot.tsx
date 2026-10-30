import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./Mascot.module.css";

export type MascotMood = "idle" | "listening" | "thinking" | "talking" | "happy" | "pointing" | "confused";

export interface Gaze {
  /** -1 (left) … 1 (right) */
  x: number;
  /** -1 (up) … 1 (down) */
  y: number;
}

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  /** Where the eyes look while idle or listening (e.g. following the pointer). */
  gaze?: Gaze;
  /** Small icon bubble next to the antenna, e.g. the tool in use. */
  badge?: ReactNode;
  className?: string;
}

// Some moods have their own fixed look: up-right while thinking, at the page while pointing.
const MOOD_GAZE: Partial<Record<MascotMood, Gaze>> = {
  thinking: { x: 0.7, y: -0.9 },
  pointing: { x: -1, y: 0.1 },
};

/**
 * Gio, the assistant's mascot: a small network bot with a signal antenna and two ports.
 * Pure SVG + CSS (no animation library); every animation stops under prefers-reduced-motion.
 */
const Mascot = ({ mood = "idle", size = 56, gaze, badge, className }: MascotProps) => {
  const look = MOOD_GAZE[mood] ?? gaze ?? { x: 0, y: 0 };

  return (
    <span className={cn(styles.root, className)} data-mood={mood} style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" className={styles.svg} aria-hidden="true" focusable="false">
        <g className={styles.antenna}>
          <line x1="32" y1="9" x2="32" y2="18" className={styles.stalk} />
          <circle cx="32" cy="8" r="6" className={styles.ring} />
          <circle cx="32" cy="8" r="3.4" className={styles.led} />
        </g>
        <rect x="5" y="28" width="6" height="13" rx="2.5" className={styles.port} />
        <rect x="53" y="28" width="6" height="13" rx="2.5" className={styles.port} />
        <rect x="9" y="17" width="46" height="40" rx="13" className={styles.head} />
        <rect x="12" y="19" width="40" height="8" rx="4" className={styles.shine} />
        <rect x="14" y="22" width="36" height="30" rx="9" className={styles.screen} />

        <g className={styles.face} style={{ transform: `translate(${look.x * 2.6}px, ${look.y * 2.2}px)` }}>
          <g className={styles.eyesOpen}>
            <rect x="22" y="30" width="6" height="9" rx="3" className={cn(styles.eye, styles.eyeLeft)} />
            <rect x="36" y="30" width="6" height="9" rx="3" className={cn(styles.eye, styles.eyeRight)} />
          </g>
          <g className={styles.eyesHappy}>
            <path d="M21.5 35.5 Q25 30.5 28.5 35.5" />
            <path d="M35.5 35.5 Q39 30.5 42.5 35.5" />
          </g>
          <path d="M27.5 43.5 Q32 47 36.5 43.5" className={styles.mouthSmile} />
          <ellipse cx="32" cy="45" rx="3.2" ry="2.2" className={styles.mouthTalk} />
          <line x1="28.5" y1="45" x2="35.5" y2="45" className={styles.mouthFlat} />
          <circle cx="19" cy="42" r="2" className={styles.cheek} />
          <circle cx="45" cy="42" r="2" className={styles.cheek} />
        </g>
      </svg>
      {mood === "confused" && (
        <span className={styles.question} aria-hidden="true">
          ?
        </span>
      )}
      {badge && (
        <span className={styles.badge} aria-hidden="true">
          {badge}
        </span>
      )}
    </span>
  );
};

export default Mascot;
