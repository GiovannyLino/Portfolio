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
import { markNudged, NUDGE_DELAY_MS, NUDGE_SCROLL_PROGRESS, scrollProgress, wasNudged } from "./nudge";
import styles from "./ChatLauncher.module.css";

const loadWidget = () => import("./ChatWidget");
const ChatWidget = lazy(loadWidget);

const TEASER_MS = 6500;
const ATTENTION_MS = 1600;

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
  const [attention, setAttention] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const gaze = usePointerGaze(buttonRef, !open && !reducedMotion);
  const current: TeaserKey = section ?? "top";
  const currentRef = useRef(current);
  currentRef.current = current;

  const openPanel = useCallback((question?: string) => {
    setPendingQuestion(question ?? null);
    setTeaser(null);
    setMounted(true);
    setOpen(true);
  }, []);

  const closePanel = useCallback(({ restoreFocus = true }: { restoreFocus?: boolean } = {}) => {
    setOpen(false);
    // The launcher re-renders on close; focus it once it is back in the DOM.
    if (restoreFocus) requestAnimationFrame(() => buttonRef.current?.focus());
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

  // One proactive invitation per session. Wide screens get the section's teaser; phones only
  // a hop from the mascot, so nothing covers the content.
  useEffect(() => {
    if (open || wasNudged()) return;
    let done = false;
    const nudge = () => {
      if (done) return;
      done = true;
      markNudged();
      if (isDesktop) setTeaser(currentRef.current);
      else setAttention(true);
    };
    const onScroll = () => {
      const { scrollY, innerHeight } = window;
      if (scrollProgress(scrollY, innerHeight, document.documentElement.scrollHeight) >= NUDGE_SCROLL_PROGRESS) nudge();
    };
    const timer = window.setTimeout(nudge, NUDGE_DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, isDesktop]);

  useEffect(() => {
    if (!teaser || hovered) return;
    const hide = window.setTimeout(() => setTeaser(null), TEASER_MS);
    return () => window.clearTimeout(hide);
  }, [teaser, hovered]);

  useEffect(() => {
    if (!attention) return;
    const stop = window.setTimeout(() => setAttention(false), ATTENTION_MS);
    return () => window.clearTimeout(stop);
  }, [attention]);

  const mood: MascotMood = hovered || attention ? "happy" : teaser ? "talking" : "idle";
  const teaserCopy = teaser ? copy.teasers[teaser] : null;

  return (
    <>
      {!open && (
        <div className={styles.dock}>
          {teaserCopy && (
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
            onPointerEnter={(event) => {
              setHovered(true);
              // Contextual tooltip for the visible section (mouse only; a tap opens the chat).
              if (event.pointerType === "mouse") setTeaser(currentRef.current);
              void loadWidget();
            }}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => {
              setTeaser(currentRef.current);
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
