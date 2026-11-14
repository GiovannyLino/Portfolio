import { useEffect, useRef } from "react";
import { damp, prefersReducedMotion } from "@/motion/env";

interface PreloaderProps {
  /** Called as the curtain starts to lift: the cue for the page to make its entrance. */
  onDone: () => void;
}

// The overlay itself (#preloader) is plain HTML and CSS in index.html, so it is on screen
// before any JavaScript arrives. This component only drives it: the counter runs while the
// fonts load, so the page is never shown in fallback type, and then the curtain lifts.
const FONTS = ['800 1em "Big Shoulders Display Variable"', '400 1em "Inter Variable"', '500 1em "JetBrains Mono"'];
const FONT_TIMEOUT_MS = 2500;
const MIN_VISIBLE_MS = 900;
/** How long after the curtain starts moving the page begins its entrance. */
const ENTRANCE_DELAY_MS = 380;
/** Matches the transition of #preloader[data-state="exit"] in index.html. */
const EXIT_MS = 1100;

const fontsLoaded = (): Promise<unknown> => {
  if (!document.fonts) return Promise.resolve();
  const loading = Promise.all(FONTS.map((font) => document.fonts.load(font))).then(() => document.fonts.ready);
  const timeout = new Promise((resolve) => window.setTimeout(resolve, FONT_TIMEOUT_MS));
  return Promise.race([loading, timeout]).catch(() => undefined);
};

const Preloader = ({ onDone }: PreloaderProps) => {
  const done = useRef(onDone);
  done.current = onDone;

  // Runs once: the overlay exists only on the first load.
  useEffect(() => {
    const root = document.getElementById("preloader");
    if (!root) {
      done.current();
      return;
    }

    const counter = root.querySelector<HTMLElement>("[data-count]");
    const bar = root.querySelector<HTMLElement>("[data-bar]");
    const still = prefersReducedMotion();
    const started = performance.now();
    const timers: number[] = [];
    let frame = 0;
    let ready = false;
    let value = 0;
    let last = started;

    const show = (progress: number) => {
      if (counter) counter.textContent = String(Math.round(progress * 100)).padStart(3, "0");
      bar?.style.setProperty("transform", `scaleX(${progress.toFixed(4)})`);
    };

    const leave = () => {
      show(1);
      root.setAttribute("data-state", "exit");
      timers.push(window.setTimeout(() => done.current(), still ? 0 : ENTRANCE_DELAY_MS));
      timers.push(window.setTimeout(() => root.remove(), EXIT_MS));
    };

    // Runs to 86% on its own, then waits there for the fonts.
    const tick = (now: number) => {
      const goal = ready && now - started >= MIN_VISIBLE_MS ? 1 : 0.86;
      value += (goal - value) * damp(now - last, 200);
      last = now;
      if (goal === 1 && value > 0.992) {
        leave();
        return;
      }
      show(value);
      frame = requestAnimationFrame(tick);
    };

    void fontsLoaded().then(() => {
      ready = true;
      // The counter is set in the display face: only show it once that face is there.
      root.setAttribute("data-fonts", "");
      if (still) leave();
    });
    if (!still) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return null;
};

export default Preloader;
