// The chat panel (lazy chunk): drawer on desktop, full-screen sheet on phones. Loaded by
// ChatLauncher on first open or when the browser is idle.
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { FolderOpen, Globe, RotateCcw, Search, SendHorizontal, Square, X, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { SectionId } from "@/lib/sections";
import { useMediaQuery } from "./hooks";
import { chatCopy } from "./i18n";
import { CUE_MOODS, baseMood } from "./lib/mood";
import { runUiAction } from "./lib/ui-actions";
import Mascot, { type MascotMood } from "./Mascot";
import { CHAT_LIMITS, type ToolName, type UiAction } from "./protocol";
import { EmptyState, Message, QuickReplies } from "./components/Transcript";
import TourGuide from "./components/TourGuide";
import { openChat } from "./chat-bus";
import { useChat, type Cue } from "./useChat";
import styles from "./ChatWidget.module.css";

/** Keep in sync with --panel-width in ChatWidget.module.css. */
const PANEL_WIDTH = 420;
const STICK_TO_BOTTOM_PX = 80;

const TOOL_ICONS: Partial<Record<ToolName, LucideIcon>> = {
  searchPortfolio: Search,
  getProjectDetails: FolderOpen,
  webSearch: Globe,
};

export interface CloseOptions {
  /** Focus the launcher after closing (default). The tour moves focus to its own card instead. */
  restoreFocus?: boolean;
}

interface ChatWidgetProps {
  open: boolean;
  onClose: (options?: CloseOptions) => void;
  section: SectionId | null;
  pendingQuestion: string | null;
  onPendingQuestionSent: () => void;
}

/** Base mood from the conversation, with short reactions (pointing, happy, confused) on top. */
function useMascotMood(phase: Parameters<typeof baseMood>[0], typing: boolean, cue: Cue | null): MascotMood {
  const [reaction, setReaction] = useState<MascotMood | null>(null);

  useEffect(() => {
    if (!cue) return;
    const { mood, ms } = CUE_MOODS[cue.kind];
    setReaction(mood);
    const timer = window.setTimeout(() => setReaction(null), ms);
    return () => window.clearTimeout(timer);
  }, [cue]);

  // Pointing can interrupt an answer in progress; the other reactions wait until it ends.
  if (reaction === "pointing" || (reaction && phase === "idle")) return reaction;
  return baseMood(phase, typing);
}

/** Plain text of a Markdown answer, for the screen-reader announcement. */
const toPlainText = (markdown: string) => markdown.replace(/[*_`#>[\]]/g, "").replace(/\(https?:[^)]*\)/g, "");

const ChatWidget = ({ open, onClose, section, pendingQuestion, onPendingQuestionSent }: ChatWidgetProps) => {
  const { language } = useLanguage();
  const copy = chatCopy[language];
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  // On phones the sheet covers the page: scrolling it now would be invisible (and shifts the
  // fixed sheet in mobile browsers). The assistant's actions wait for the sheet to close; the
  // visitor's own clicks on cards close it and go.
  const deferredAction = useRef<UiAction | null>(null);
  const onUiAction = useCallback(
    (action: UiAction) => {
      if (isTablet) runUiAction(action);
      else deferredAction.current = action;
    },
    [isTablet],
  );
  const onPageAction = useCallback(
    (action: UiAction) => {
      if (isTablet) return runUiAction(action);
      deferredAction.current = action;
      onClose();
    },
    [isTablet, onClose],
  );

  useEffect(() => {
    if (open || !deferredAction.current) return;
    const action = deferredAction.current;
    deferredAction.current = null;
    // Next frame: the body scroll lock is released first.
    requestAnimationFrame(() => runUiAction(action));
  }, [open]);

  const chat = useChat({ lang: language, section, stoppedPlaceholder: copy.stopped, onUiAction });

  // The tour runs with the panel closed so the visitor sees the page it walks through.
  const [touring, setTouring] = useState(false);
  const startTour = useCallback(() => {
    setTouring(true);
    onClose({ restoreFocus: false });
  }, [onClose]);
  const endTour = useCallback(() => {
    setTouring(false);
    document.querySelector<HTMLElement>('[aria-controls="gioai-panel"]')?.focus();
  }, []);
  const askAfterTour = useCallback(() => {
    setTouring(false);
    openChat();
  }, []);

  const [draft, setDraft] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const mood = useMascotMood(chat.phase, inputFocused && draft.length > 0, chat.cue);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  const { send, busy, cue, entries } = chat;
  const entriesRef = useRef(entries);
  entriesRef.current = entries;

  // A question from a teaser or another part of the page (chat-bus).
  useEffect(() => {
    if (!open || !pendingQuestion || busy) return;
    void send(pendingQuestion);
    onPendingQuestionSent();
  }, [open, pendingQuestion, busy, send, onPendingQuestionSent]);

  // Desktop: the page shifts left instead of hiding behind the drawer, so scrolling and
  // highlights triggered by the assistant stay visible.
  // The data attribute lets the navbar switch to its compact menu while space is short.
  useEffect(() => {
    const root = document.documentElement;
    const pushed = open && isDesktop;
    root.style.setProperty("--gioai-offset", pushed ? `${PANEL_WIDTH}px` : "0px");
    root.toggleAttribute("data-gioai-open", pushed);
    return () => {
      root.style.removeProperty("--gioai-offset");
      root.removeAttribute("data-gioai-open");
    };
  }, [open, isDesktop]);

  // Phones: the sheet covers the screen, so the page behind must not scroll.
  useEffect(() => {
    if (!open || isTablet) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, isTablet]);

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Follow new content unless the visitor scrolled up to read something.
  useEffect(() => {
    const list = listRef.current;
    if (list && stickToBottom.current) list.scrollTop = list.scrollHeight;
  }, [entries]);

  // Announce each answer once, when it completes, not on every streamed token.
  useEffect(() => {
    if (cue?.kind !== "done") return;
    const answer = [...entriesRef.current].reverse().find((entry) => entry.role === "assistant");
    if (answer) setAnnouncement(toPlainText(answer.content));
  }, [cue]);

  const ask = (text: string) => {
    stickToBottom.current = true;
    void send(text);
  };

  const submit = () => {
    if (!draft.trim() || busy) return;
    ask(draft);
    setDraft("");
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const statusLabel = chat.tool
    ? (copy.tools[chat.tool] ?? copy.status.thinking)
    : chat.phase === "waiting"
      ? copy.status.thinking
      : chat.phase === "streaming"
        ? copy.status.writing
        : copy.status.online;
  const ToolIcon = chat.tool ? TOOL_ICONS[chat.tool] : undefined;
  const last = entries.at(-1);
  const suggestions = !busy && last?.role === "assistant" && last.status === "done" ? last.suggestions : [];

  return (
    <>
      <section
        id="gioai-panel"
        role="dialog"
        aria-modal={!isTablet}
        aria-labelledby="gioai-title"
        className={styles.panel}
        hidden={!open}
      >
        <header className={styles.header}>
          <button type="button" className={styles.avatar} onClick={chat.boop} aria-label={`${copy.name} 👋`}>
            <Mascot mood={mood} size={46} badge={ToolIcon ? <ToolIcon /> : undefined} />
          </button>
          <div className={styles.titleBlock}>
            <h2 id="gioai-title">
              {copy.name} <span>{copy.tagline}</span>
            </h2>
            <p className={styles.status}>
              <span className={styles.statusDot} data-phase={chat.phase} aria-hidden="true" />
              {statusLabel}
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={chat.reset}
              disabled={entries.length === 0}
              aria-label={copy.newChat}
              title={copy.newChat}
            >
              <RotateCcw size={17} aria-hidden="true" />
            </button>
            <button type="button" className={styles.iconButton} onClick={() => onClose()} aria-label={copy.close} title={copy.close}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div
          ref={listRef}
          className={styles.messages}
          role="log"
          aria-labelledby="gioai-title"
          onScroll={(event) => {
            const list = event.currentTarget;
            stickToBottom.current = list.scrollHeight - list.scrollTop - list.clientHeight < STICK_TO_BOTTOM_PX;
          }}
        >
          {entries.length === 0 ? (
            <EmptyState copy={copy} onPick={ask} onStartTour={startTour} />
          ) : (
            entries.map((entry) => (
              <Message
                key={entry.id}
                entry={entry}
                lang={language}
                copy={copy}
                statusLabel={statusLabel}
                onPageAction={onPageAction}
                onRetry={chat.retry}
              />
            ))
          )}
          {suggestions.length > 0 && <QuickReplies items={suggestions} onPick={ask} disabled={busy} />}
        </div>

        <form
          className={styles.composer}
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <textarea
            ref={inputRef}
            className={styles.input}
            value={draft}
            rows={1}
            maxLength={CHAT_LIMITS.maxInputChars}
            placeholder={copy.placeholder}
            aria-label={copy.placeholder}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onInputKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          {busy ? (
            <button type="button" className={styles.sendButton} onClick={chat.stop} aria-label={copy.stop} title={copy.stop}>
              <Square size={16} aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" className={styles.sendButton} disabled={!draft.trim()} aria-label={copy.send} title={copy.send}>
              <SendHorizontal size={18} aria-hidden="true" />
            </button>
          )}
          {draft.length > CHAT_LIMITS.maxInputChars * 0.7 && (
            <span className={styles.counter} aria-hidden="true">
              {draft.length}/{CHAT_LIMITS.maxInputChars}
            </span>
          )}
        </form>

        <div className={styles.srOnly} aria-live="polite">
          {announcement}
        </div>
      </section>
      {touring && <TourGuide lang={language} copy={copy} onExit={endTour} onAsk={askAfterTour} />}
    </>
  );
};

export default ChatWidget;
