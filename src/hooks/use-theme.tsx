import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { prefersReducedMotion } from "@/motion/env";

type Theme = "light" | "dark";

interface Point {
  x: number;
  y: number;
}

interface ThemeContextType {
  theme: Theme;
  /** Switches theme. With an origin (where the toggle was pressed), the new theme grows from that point. */
  toggleTheme: (origin?: Point) => void;
}

const STORAGE_KEY = "theme";

// The same decision is made inline in index.html, before the first paint.
const initialTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage can be blocked; fall through to the system preference.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const apply = (theme: Theme): void => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

const remember = (theme: Theme): void => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Not remembered: the next visit follows the system preference again.
  }
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const current = useRef(theme);
  current.current = theme;

  // index.html already did this before the first paint; it matters where that script did not run.
  useEffect(() => apply(theme), [theme]);

  const toggleTheme = useCallback((origin?: Point) => {
    const next: Theme = current.current === "dark" ? "light" : "dark";
    const commit = () => {
      apply(next);
      setTheme(next);
    };
    remember(next);

    const doc: ViewTransitionDocument = document;
    if (!origin || !doc.startViewTransition || prefersReducedMotion()) {
      commit();
      return;
    }

    // The browser snapshots the page, we switch theme, and the new picture is uncovered
    // by a circle growing from the toggle (see ::view-transition-* in styles/base.css).
    const transition = doc.startViewTransition(() => flushSync(commit));
    const radius = Math.hypot(Math.max(origin.x, window.innerWidth - origin.x), Math.max(origin.y, window.innerHeight - origin.y));
    transition.ready
      .then(() =>
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${radius}px at ${origin.x}px ${origin.y}px)`],
          },
          { duration: 700, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
        ),
      )
      .catch(() => {
        // The transition was skipped (e.g. the tab is hidden): the theme changed anyway.
      });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
