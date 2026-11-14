import { allExperience, formatPeriod, type Experience } from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { useScrollProgress } from "@/motion/hooks";
import { Reveal } from "@/motion/Reveal";
import SplitText from "@/motion/SplitText";
import Section from "./Section";
import TechTags from "./TechTags";
import styles from "./ExperienceSection.module.css";

const Job = ({ job }: { job: Experience }) => {
  const { t, language } = useLanguage();
  // Fills the rail beside the highlights as the visitor reads down the position.
  const ref = useScrollProgress<HTMLLIElement>({ from: ["top", 0.7], to: ["bottom", 0.65] });
  const current = job.period.end === null;

  return (
    <li ref={ref} className={styles.job}>
      {/* Stays in view on wide screens while the highlights scroll past. */}
      <div className={styles.aside}>
        <p className={cn("label", styles.period)}>
          {current && <span className="live-dot" aria-hidden="true" />}
          {formatPeriod(job.period, language)}
        </p>
        <SplitText as="h3" text={job.role[language]} className={cn("display", styles.role)} />
        <p className={styles.company}>
          <span className="accent">@ {job.company}</span> · {job.location[language]}
        </p>
      </div>

      <div className={styles.body}>
        <span className={styles.rail} aria-hidden="true" />
        <ul>
          {job.highlights[language].map((highlight, index) => (
            <Reveal as="li" key={index} className={styles.highlight}>
              <span className={cn("label", styles.highlightIndex)} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p>{highlight}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className={styles.tech}>
          <p className="label">{t.experience.technologies}</p>
          <TechTags skillIds={job.skills} label={t.experience.technologies} />
        </Reveal>
      </div>
    </li>
  );
};

const ExperienceSection = () => (
  <Section id="experience" surface="paper">
    <ol className={styles.jobs}>
      {allExperience.map((job) => (
        <Job key={job.id} job={job} />
      ))}
    </ol>
  </Section>
);

export default ExperienceSection;
