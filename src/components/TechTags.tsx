import { getSkill, localize } from "@/data/knowledge";
import { openChat } from "@/features/chat/chat-bus";
import { launcherCopy } from "@/features/chat/launcher-copy";
import { useLanguage } from "@/i18n/LanguageContext";

interface TechTagsProps {
  skillIds: readonly string[];
  label: string;
}

/** Technology chips; each one asks Gio.AI where Giovanny used it (stack explorer). */
const TechTags = ({ skillIds, label }: TechTagsProps) => {
  const { language } = useLanguage();
  const ask = launcherCopy[language].ask;

  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {skillIds.map((id) => {
        const skill = getSkill(id);
        if (!skill) return null;
        const name = localize(skill.name, language);
        return (
          <li key={id}>
            <button
              type="button"
              onClick={() => openChat({ question: ask.skill(name) })}
              aria-label={ask.skillLabel(name)}
              title={ask.skillLabel(name)}
              className="font-mono text-xs text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {name}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default TechTags;
