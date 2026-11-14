import type { ReactNode } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { sectionNumber, type SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { Reveal } from "@/motion/Reveal";
import SplitText from "@/motion/SplitText";
import styles from "./Section.module.css";

export type Surface = "ink" | "paper";

interface SectionProps {
  id: SectionId;
  /** Which of the two surfaces the section sits on (see styles/tokens.css). */
  surface: Surface;
  children: ReactNode;
  className?: string;
  /** Replaces the default title. Must render a single <span>: see the note in the markup. */
  title?: ReactNode;
  /** Shown beside the title on wide screens: a hint, a short note. */
  aside?: ReactNode;
  /** Full-bleed content above the title, outside the page gutters. */
  lead?: ReactNode;
}

/** A page section: a sheet that slides over the previous one, with its numbered title. */
const Section = ({ id, surface, children, className, title, aside, lead }: SectionProps) => {
  const { t } = useLanguage();
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      data-surface={surface}
      className={cn(styles.section, `surface-${surface}`, className)}
    >
      {lead}
      <div className="wrap">
        <header className={styles.header}>
          {/* The assistant highlights a section through `#<id>-title > span:nth-child(2)`
              (features/chat): the number stays first and the title text second. */}
          <h2 id={titleId} className={styles.title}>
            <span className={cn("label", styles.number)}>{sectionNumber(id)}</span>
            {title ?? <SplitText text={t.sections[id]} className={cn("display", styles.titleText)} />}
          </h2>
          {aside && <Reveal className={styles.aside}>{aside}</Reveal>}
        </header>
        {children}
      </div>
    </section>
  );
};

export default Section;
