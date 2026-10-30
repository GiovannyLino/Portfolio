// Always-loaded entry point of the assistant: the floating mascot, its section-aware
// teaser bubble, and the lazy import of the chat widget (its own JS/CSS chunk).
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useLanguage } from "@/i18n/LanguageContext";
import { SECTION_IDS } from "@/lib/sections";
import { onOpenChat } from "./chat-bus";
import { useMediaQuery, usePointerGaze, usePrefersReducedMotion } from "./hooks";
import { launcherCopy, type TeaserKey } from "./launcher-copy";
import Mascot, { type MascotMood } from "./Mascot";
import styles from "./ChatLauncher.module.css";

const loadWidget = () => import("./ChatWidget");
const ChatWidget = lazy(loadWidget);

const TEASER_MS = 6500;
const SEEN_KEY = "gioai:teasers-seen";

// sessionStorage can be missing or throw (private mode, blocked storage): teasers then
// just show once per page load.
const seenTeasers = (): Set<string> => {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
};

const markTeaserSeen = (key: TeaserKey, seen: Set<string>) => {
  seen.add(key);
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
  } catch {
    // Ignore: the in-memory set still prevents repeats on this page.
  }
};

const ChatLauncher = () => {
  const { language } = useLanguage();
  const copy = launcherCopy[language];
  const section = useScrollSpy(SECTION_IDS);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reducedMotion = usePrefersReducedMotion();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [teaser, setTeaser] = useState<TeaserKey | null>(null);
  const [hovered, setHovered] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const seen = useRef(seenTeasers());
  const gaze = usePointerGaze(buttonRef, !open && !reducedMotion);
  const current: TeaserKey = section ?? "top";

  const openPanel = useCallback((question?: string) => {
    setPendingQuestion(question ?? null);
    setTeaser(null);
    setMounted(true);
    setOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    // The launcher re-renders on close; focus it once it is back in the DOM.
    requestAnimationFrame(() => buttonRef.current?.focus());
  }, []);

  // Fetch the widget chunk while the browser is idle so the first open feels instant.
  useEffect(() => {
    const idle = window.requestIdleCallback?.(() => void loadWidget(), { timeout: 8000 });
    const timer = idle === undefined ? window.setTimeout(() => void loadWidget(), 6000) : undefined;
    return () => {
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => onOpenChat(({ question }) => openPanel(question)), [openPanel]);

  // One teaser per section per session, on wide screens only (it would cover content on phones).
  useEffect(() => {
    if (open || !isDesktop || seen.current.has(current)) return;
    const show = window.setTimeout(() => {
      markTeaserSeen(current, seen.current);
      setTeaser(current);
    }, 1200);
    return () => window.clearTimeout(show);
  }, [current, open, isDesktop]);

  useEffect(() => {
    if (!teaser || hovered) return;
    const hide = window.setTimeout(() => setTeaser(null), TEASER_MS);
    return () => window.clearTimeout(hide);
  }, [teaser, hovered]);

  const mood: MascotMood = hovered ? "happy" : teaser ? "talking" : "idle";
  const teaserCopy = teaser ? copy.teasers[teaser] : null;

  return (
    <>
      {!open && (
        <div className={styles.dock}>
          {teaserCopy && teaser && (
            <div className={styles.teaser} role="status">
              <button type="button" className={styles.teaserText} onClick={() => openPanel(teaserCopy.question)}>
                {teaserCopy.text}
              </button>
              <button type="button" className={styles.teaserClose} onClick={() => setTeaser(null)} aria-label={copy.dismissTeaser}>
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          )}
          <button
            ref={buttonRef}
            type="button"
            className={styles.launcher}
            aria-label={copy.open}
            aria-expanded={open}
            aria-controls="gioai-panel"
            onClick={() => openPanel()}
            onPointerEnter={() => {
              setHovered(true);
              void loadWidget();
            }}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => {
              setTeaser(current);
              void loadWidget();
            }}
          >
            <span className={styles.halo} aria-hidden="true" />
            <Mascot mood={mood} size={58} gaze={gaze} />
          </button>
        </div>
      )}

      {mounted && (
        <Suspense fallback={null}>
          <ChatWidget
            open={open}
            onClose={closePanel}
            section={section}
            pendingQuestion={pendingQuestion}
            onPendingQuestionSent={() => setPendingQuestion(null)}
          />
        </Suspense>
      )}
    </>
  );
};

export default ChatLauncher;
