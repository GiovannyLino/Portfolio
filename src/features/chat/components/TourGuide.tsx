import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, Linkedin, MessageCircle, X } from "lucide-react";
import { profile, type Language } from "@/data/knowledge";
import type { ChatCopy } from "../i18n";
import { runUiAction } from "../lib/ui-actions";
import Mascot from "../Mascot";
import { buildTour } from "../tour";
import Markdown from "./Markdown";
import styles from "../ChatWidget.module.css";

interface TourGuideProps {
  lang: Language;
  copy: ChatCopy;
  onExit: () => void;
  /** Ends the tour and opens the chat. */
  onAsk: () => void;
}

const noop = () => {};

/** Floating card that walks the page; the chat panel stays closed so the page is visible. */
const TourGuide = ({ lang, copy, onExit, onAsk }: TourGuideProps) => {
  const stops = useMemo(() => buildTour(lang), [lang]);
  const [step, setStep] = useState(0);
  const nextRef = useRef<HTMLButtonElement>(null);
  const stop = stops[step];
  const last = step === stops.length - 1;

  useEffect(() => {
    runUiAction(stop.action);
    nextRef.current?.focus({ preventScroll: true });
  }, [stop]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  return (
    <aside className={styles.tour} role="dialog" aria-modal="false" aria-labelledby="gioai-tour-title">
      <header className={styles.tourHeader}>
        <Mascot mood="pointing" size={40} />
        <div className={styles.titleBlock}>
          <h2 id="gioai-tour-title" className={styles.tourTitle}>
            {copy.tour.title}
          </h2>
          <p className={styles.status}>{copy.tour.progress(step + 1, stops.length)}</p>
        </div>
        <button type="button" className={styles.iconButton} onClick={onExit} aria-label={copy.tour.exit} title={copy.tour.exit}>
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <ol className={styles.tourDots} aria-hidden="true">
        {stops.map((item, index) => (
          <li key={item.id} data-state={index === step ? "current" : index < step ? "done" : "next"} />
        ))}
      </ol>

      <div className={styles.tourText} aria-live="polite">
        <Markdown key={stop.id} content={stop.text} onNavigate={noop} copyLabel={copy.code.copy} copiedLabel={copy.code.copied} />
      </div>

      {last && (
        <div className={styles.cardActions}>
          <a className={styles.cardLink} href={profile.links.resume[lang]} target="_blank" rel="noopener noreferrer">
            <FileText size={14} aria-hidden="true" />
            {copy.cards.resume}
          </a>
          <a className={styles.cardLink} href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin size={14} aria-hidden="true" />
            LinkedIn
          </a>
          <button type="button" className={styles.cardButton} onClick={onAsk}>
            <MessageCircle size={14} aria-hidden="true" />
            {copy.tour.ask}
          </button>
        </div>
      )}

      <div className={styles.tourNav}>
        {step > 0 ? (
          <button type="button" className={styles.tourBack} onClick={() => setStep(step - 1)}>
            {copy.tour.back}
          </button>
        ) : (
          <span />
        )}
        <button ref={nextRef} type="button" className={styles.tourNext} onClick={() => (last ? onExit() : setStep(step + 1))}>
          {last ? copy.tour.finish : copy.tour.next}
        </button>
      </div>
    </aside>
  );
};

export default TourGuide;
