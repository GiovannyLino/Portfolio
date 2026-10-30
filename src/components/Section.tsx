import type { ReactNode } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { sectionNumber, type SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: SectionId;
  children: ReactNode;
  className?: string;
}

const Section = ({ id, children, className }: SectionProps) => {
  const { t } = useLanguage();
  const titleId = `${id}-title`;

  return (
    // The top padding already clears the fixed navbar when jumping to #id.
    <section id={id} aria-labelledby={titleId} className={cn("py-20 md:py-28", className)}>
      <h2 id={titleId} className="flex items-center gap-4 text-2xl md:text-3xl font-bold text-foreground mb-10 md:mb-12">
        <span className="font-mono text-lg md:text-xl font-medium text-primary">{sectionNumber(id)}</span>
        <span>{t.sections[id]}</span>
        <span aria-hidden="true" className="hidden sm:block h-px flex-1 max-w-xs bg-border" />
      </h2>
      {children}
    </section>
  );
};

export default Section;
