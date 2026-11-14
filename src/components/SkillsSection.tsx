import { skillsByCategory } from "@/data/knowledge";
import Mascot from "@/features/chat/Mascot";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup } from "@/motion/Reveal";
import SplitText from "@/motion/SplitText";
import Section from "./Section";
import { TechChip } from "./TechTags";
import styles from "./SkillsSection.module.css";

const groups = skillsByCategory();

/** Every category as a numbered row; each technology is a chip that asks Gio.AI about it. */
const SkillsSection = () => {
  const { t, language } = useLanguage();

  return (
    <Section
      id="skills"
      surface="ink"
      aside={
        <p className={styles.hint}>
          <Mascot size={38} className={styles.hintMascot} />
          {t.skills.askHint}
        </p>
      }
    >
      <ol className={styles.list}>
        {groups.map(({ category, skills }, index) => (
          <RevealGroup as="li" key={category.id} className={styles.row}>
            <span className={cn("label", styles.index)} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <SplitText as="h3" text={category.name[language]} className={cn("display", styles.name)} />
            <ul className={styles.chips}>
              {skills.map((skill, position) => (
                <Reveal as="li" key={skill.id} index={position}>
                  <TechChip skill={skill} detailed />
                </Reveal>
              ))}
            </ul>
          </RevealGroup>
        ))}
      </ol>
    </Section>
  );
};

export default SkillsSection;
