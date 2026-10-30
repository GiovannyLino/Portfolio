import { Compass, RotateCcw } from "lucide-react";
import type { Language } from "@/data/knowledge";
import type { SectionId } from "@/lib/sections";
import type { UiAction } from "../protocol";
import type { ChatCopy } from "../i18n";
import type { ChatEntry } from "../lib/conversation";
import { ChatCardView, SourceList } from "./Cards";
import Markdown from "./Markdown";
import styles from "../ChatWidget.module.css";

interface Shared {
  lang: Language;
  copy: ChatCopy;
  onPageAction: (action: UiAction) => void;
}

const navigateWith = (onPageAction: Shared["onPageAction"]) => (section: SectionId) =>
  onPageAction({ type: "navigate", section });

export const Thinking = ({ label }: { label: string }) => (
  <div className={styles.thinking}>
    <span className={styles.dots} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
    <span>{label}</span>
  </div>
);

const ErrorNotice = ({ entry, copy, lang, onPageAction, onRetry }: Shared & { entry: ChatEntry; onRetry: () => void }) => {
  const error = entry.error;
  if (!error) return null;
  const message =
    error.code === "rate_limited" && error.retryAfter
      ? copy.errors.rateLimited(Math.max(1, Math.ceil(error.retryAfter / 60)))
      : copy.errors[error.code];
  const canRetry = error.code === "upstream_unavailable" || error.code === "internal";

  return (
    <div className={styles.errorNotice}>
      <p>{message}</p>
      {entry.fallback ? (
        <>
          <p className={styles.cardLabel}>{copy.errors.fallbackLead}</p>
          <Markdown
            content={entry.fallback}
            onNavigate={navigateWith(onPageAction)}
            copyLabel={copy.code.copy}
            copiedLabel={copy.code.copied}
          />
        </>
      ) : (
        <ChatCardView card={{ kind: "contact" }} lang={lang} copy={copy} onPageAction={onPageAction} />
      )}
      {canRetry && (
        <button type="button" className={styles.cardButton} onClick={onRetry}>
          <RotateCcw size={14} aria-hidden="true" />
          {copy.errors.retry}
        </button>
      )}
    </div>
  );
};

export const Message = ({
  entry,
  statusLabel,
  onRetry,
  ...shared
}: Shared & { entry: ChatEntry; statusLabel: string; onRetry: (id: string) => void }) => {
  const { copy, lang, onPageAction } = shared;

  if (entry.role === "user") {
    return (
      <div className={styles.userRow}>
        <p className={styles.userBubble}>
          <span className={styles.srOnly}>{copy.you}: </span>
          {entry.content}
        </p>
      </div>
    );
  }

  const streaming = entry.status === "streaming";
  return (
    <div className={styles.assistantRow}>
      {(entry.content || streaming) && (
        <div className={styles.assistantBubble}>
          {streaming && !entry.content ? (
            <Thinking label={statusLabel} />
          ) : (
            <Markdown
              content={entry.content}
              streaming={streaming}
              onNavigate={navigateWith(onPageAction)}
              copyLabel={copy.code.copy}
              copiedLabel={copy.code.copied}
            />
          )}
        </div>
      )}
      {entry.status === "error" && <ErrorNotice entry={entry} onRetry={() => onRetry(entry.id)} {...shared} />}
      {entry.cards.map((card) => (
        <ChatCardView
          key={card.kind + ("id" in card ? card.id : "")}
          card={card}
          lang={lang}
          copy={copy}
          onPageAction={onPageAction}
        />
      ))}
      {entry.sources.length > 0 && <SourceList sources={entry.sources} label={copy.cards.sources} />}
    </div>
  );
};

export const QuickReplies = ({ items, onPick, disabled }: { items: string[]; onPick: (text: string) => void; disabled: boolean }) => (
  <div className={styles.quickReplies}>
    {items.map((item) => (
      <button key={item} type="button" className={styles.chip} onClick={() => onPick(item)} disabled={disabled}>
        {item}
      </button>
    ))}
  </div>
);

export const EmptyState = ({
  copy,
  onPick,
  onStartTour,
}: {
  copy: ChatCopy;
  onPick: (text: string) => void;
  onStartTour: () => void;
}) => (
  <div className={styles.empty}>
    <div className={styles.assistantBubble}>
      <Markdown content={copy.greeting} onNavigate={() => {}} copyLabel={copy.code.copy} copiedLabel={copy.code.copied} />
    </div>
    <button type="button" className={styles.tourStart} onClick={onStartTour}>
      <Compass size={16} aria-hidden="true" />
      {copy.tour.start}
    </button>
    <p className={styles.starterTitle}>{copy.starterTitle}</p>
    <div className={styles.starters}>
      {copy.starters.map((starter) => (
        <button key={starter} type="button" className={styles.starter} onClick={() => onPick(starter)}>
          {starter}
        </button>
      ))}
    </div>
  </div>
);
