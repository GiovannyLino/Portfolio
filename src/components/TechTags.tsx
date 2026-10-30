import { getSkill, localize } from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";

interface TechTagsProps {
  skillIds: readonly string[];
  label: string;
}

const TechTags = ({ skillIds, label }: TechTagsProps) => {
  const { language } = useLanguage();

  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {skillIds.map((id) => {
        const skill = getSkill(id);
        if (!skill) return null;
        return (
          <li key={id} className="font-mono text-xs text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full">
            {localize(skill.name, language)}
          </li>
        );
      })}
    </ul>
  );
};

export default TechTags;
