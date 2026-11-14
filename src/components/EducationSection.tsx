import { certifications, education } from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { cssVars } from "@/motion/env";
import { Reveal, RevealGroup } from "@/motion/Reveal";
import SplitText from "@/motion/SplitText";
import Section from "./Section";
import styles from "./EducationSection.module.css";

const number = (index: number): string => String(index + 1).padStart(2, "0");

const EducationSection = () => {
  const { t, language } = useLanguage();

  return (
    <Section id="education" surface="paper">
      <h3 className={cn("label", styles.subtitle)}>{t.education.degrees}</h3>
      <ul className={styles.degrees}>
        {education.map((item) => (
          <RevealGroup as="li" key={item.id} className={styles.degree}>
            <p className={cn("label", styles.years)}>
              {item.period.start} – {item.period.end}
            </p>
            <SplitText as="p" text={item.degree[language]} className={cn("display", styles.degreeName)} />
            <Reveal as="p" index={3} className={styles.school}>
              {item.institution}
            </Reveal>
          </RevealGroup>
        ))}
      </ul>

      <h3 className={cn("label", styles.subtitle)}>{t.education.certifications}</h3>
      {/* A staircase on wide screens: each step stands a little taller than the one before. */}
      <RevealGroup as="ol" className={styles.stairs} style={cssVars({ "--steps": certifications.length })}>
        {certifications.map((certification, index) => (
          <li key={certification.id} className={styles.step} style={cssVars({ "--step": index })}>
            <span className={cn("display", styles.stepNumber)} aria-hidden="true">
              {number(index)}
            </span>
            <Reveal variant="clip-up" index={index} className={styles.stepPanel}>
              <p className={styles.stepName}>{certification.name}</p>
              <p className={cn("label", styles.stepMeta)}>
                {certification.issuer} · {certification.year}
              </p>
            </Reveal>
          </li>
        ))}
      </RevealGroup>
    </Section>
  );
};

export default EducationSection;
