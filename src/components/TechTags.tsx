import { getSkill, localize, type Skill } from "@/data/knowledge";
import { openChat } from "@/features/chat/chat-bus";
import { launcherCopy } from "@/features/chat/launcher-copy";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import styles from "./TechTags.module.css";

interface TechChipProps {
  skill: Skill;
  /** Also show the skill's detail, e.g. AWS · EC2, S3, IAM. */
  detailed?: boolean;
}

/** One technology; clicking it asks Gio.AI where Giovanny used it (stack explorer). */
export const TechChip = ({ skill, detailed = false }: TechChipProps) => {
  const { language } = useLanguage();
  const ask = launcherCopy[language].ask;
  const name = localize(skill.name, language);

  return (
    <button
      type="button"
      className={styles.chip}
      onClick={() => openChat({ question: ask.skill(name) })}
      aria-label={ask.skillLabel(name)}
      title={ask.skillLabel(name)}
    >
      {name}
      {detailed && skill.detail && <span className={styles.detail}>· {localize(skill.detail, language)}</span>}
    </button>
  );
};

interface TechTagsProps {
  skillIds: readonly string[];
  label: string;
  className?: string;
}

/** Technology chips for a position or project. */
const TechTags = ({ skillIds, label, className }: TechTagsProps) => (
  <ul aria-label={label} className={cn(styles.list, className)}>
    {skillIds.map((id) => {
      const skill = getSkill(id);
      return skill ? (
        <li key={id}>
          <TechChip skill={skill} />
        </li>
      ) : null;
    })}
  </ul>
);

export default TechTags;
