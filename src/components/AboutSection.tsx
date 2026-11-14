import type { ReactNode } from "react";
import {
  allProjects,
  certifications,
  currentPosition,
  education,
  featuredSkills,
  formatPeriod,
  localize,
  profile,
  skillsByCategory,
} from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import Counter from "@/motion/Counter";
import { useScrollProgress } from "@/motion/hooks";
import Marquee from "@/motion/Marquee";
import { Reveal, RevealGroup } from "@/motion/Reveal";
import ScrollWords from "@/motion/ScrollWords";
import SplitText from "@/motion/SplitText";
// 4:5 crops of profile.jpg for 1x and 2x screens (the page shows them in black and white).
import portrait380 from "@/assets/portrait-380.webp";
import portrait760 from "@/assets/portrait-760.webp";
import RichParagraph from "./RichParagraph";
import Section from "./Section";
import TechTags from "./TechTags";
import styles from "./AboutSection.module.css";

const listedSkillCount = skillsByCategory().reduce((total, group) => total + group.skills.length, 0);
const featuredSkillIds = featuredSkills.map((skill) => skill.id);

const Fact = ({ label, index, children }: { label: string; index: number; children: ReactNode }) => (
  <Reveal index={index} className={styles.fact}>
    <dt className="label">{label}</dt>
    <dd>{children}</dd>
  </Reveal>
);

const AboutSection = () => {
  const { t, language } = useLanguage();
  const [degree] = education;
  const [statement, ...paragraphs] = profile.about[language];
  const [firstWord, ...otherWords] = t.sections.about.split(" ");
  // The portrait drops into the title as the title scrolls up to the middle of the screen.
  const titleRef = useScrollProgress<HTMLSpanElement>({ from: ["top", "bottom"], to: ["center", 0.5] });

  // Numbers counted from the knowledge base, so they never drift from the content below.
  const stats = [
    { value: allProjects.length, label: t.nav.links.projects },
    { value: certifications.length, label: t.education.certifications },
    { value: listedSkillCount, label: t.experience.technologies },
    { value: profile.languages.length, label: t.about.languages },
  ];

  return (
    <Section
      id="about"
      surface="paper"
      className={styles.about}
      lead={
        // The same technologies are listed (and clickable) further down, under "recent tech".
        <Marquee className={styles.marquee} speed={85}>
          {featuredSkills.map((skill, index) => (
            <span key={skill.id} className={cn("display", styles.marqueeItem)} data-outline={index % 2 === 1 || undefined}>
              {localize(skill.name, language)}
              <span className={styles.marqueeMark} />
            </span>
          ))}
        </Marquee>
      }
      title={
        <span ref={titleRef} className={cn("display", styles.title)}>
          <SplitText text={firstWord} />
          <span className={styles.photo} aria-hidden="true">
            <Reveal as="span" variant="clip-up" className={styles.photoFrame}>
              <img
                src={portrait760}
                srcSet={`${portrait380} 380w, ${portrait760} 760w`}
                sizes="(min-width: 900px) 20vw, 30vw"
                width={380}
                height={475}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          </span>
          {otherWords.length > 0 && <SplitText text={otherWords.join(" ")} delay={120} />}
        </span>
      }
    >
      <div className={styles.body}>
        <ScrollWords
          className={styles.statement}
          segments={statement.map((segment) => (typeof segment === "string" ? { text: segment } : segment))}
        />

        <Reveal className={styles.prose}>
          {paragraphs.map((paragraph, i) => (
            <RichParagraph key={i} segments={paragraph} />
          ))}
        </Reveal>

        <RevealGroup as="dl" className={styles.facts}>
          <Fact index={0} label={t.about.currentRole}>
            {currentPosition.role[language]} · {currentPosition.company}
            <small>{formatPeriod(currentPosition.period, language)}</small>
          </Fact>
          <Fact index={1} label={t.about.location}>
            {profile.location[language]}
          </Fact>
          <Fact index={2} label={t.about.education}>
            {degree.degree[language]}
            <small>
              USCS · {degree.period.start} – {degree.period.end}
            </small>
          </Fact>
          <Fact index={3} label={t.about.languages}>
            {profile.languages.map((spoken) => `${spoken.name[language]} (${spoken.level[language]})`).join(" · ")}
          </Fact>
        </RevealGroup>

        <Reveal className={styles.recent}>
          <p className="label">{t.about.recentTech}</p>
          <TechTags skillIds={featuredSkillIds} label={t.about.recentTech} />
        </Reveal>
      </div>

      <RevealGroup as="dl" className={styles.stats}>
        {stats.map((stat, index) => (
          <Reveal key={stat.label} index={index} className={styles.stat}>
            <dt className="label">{stat.label}</dt>
            <dd className={cn("display", styles.statValue)}>
              <Counter value={stat.value} />
            </dd>
          </Reveal>
        ))}
      </RevealGroup>
    </Section>
  );
};

export default AboutSection;
